import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const pyInterpreters = [
  path.join(projectRoot, 'python-embed', 'python.exe'),
  path.join(projectRoot, 'LiYing-master', 'python-embed', 'python.exe'),
  'python',
  'python3'
];

function findPython() {
  for (const p of pyInterpreters) {
    if (p.includes('/') || p.includes('\\')) {
      if (fs.existsSync(p)) return p;
    } else {
      return p;
    }
  }
  return 'python';
}

function getProjectTempDir() {
  const dir = path.join(projectRoot, '_data', 'tmp');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function pyEnv() {
  const tmpDir = getProjectTempDir();
  return { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8', TMP: tmpDir, TEMP: tmpDir };
}

// -------------------------------------------------------------------------
// Rust SIMD Worker management
// -------------------------------------------------------------------------
let rustWorkerProc = null;

export async function isRustWorkerAlive() {
  try {
    const res = await fetch('http://127.0.0.1:3005/api/ping', { signal: AbortSignal.timeout(600) });
    const j = await res.json();
    return Boolean(j && j.ok);
  } catch (e) {
    return false;
  }
}

export async function ensureRustWorkerRunning() {
  if (await isRustWorkerAlive()) return true;

  const rustExe = path.join(projectRoot, 'retouch-pro.exe');
  if (!fs.existsSync(rustExe)) {
    console.error('retouch-pro.exe not found at:', rustExe);
    return false;
  }

  console.log('[DEVSTU] Spawning Collabs-Retouch-Pro Rust SIMD Worker on port 3005...');
  rustWorkerProc = spawn(rustExe, ['--server', '3005'], {
    windowsHide: true,
    stdio: 'ignore',
    detached: true
  });
  rustWorkerProc.unref();

  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 100));
    if (await isRustWorkerAlive()) {
      console.log('[DEVSTU] Rust SIMD Worker is ready on port 3005!');
      return true;
    }
  }
  return false;
}

// -------------------------------------------------------------------------
// LK Magic Pro Matting & Replacement Daemon (model_29 + BGFusion)
// -------------------------------------------------------------------------
let lkDaemonProc = null;
let lkDaemonPending = new Map();
let lkReqCounter = 1;
let lkDaemonBuffer = '';
let lkDaemonReady = false;

function ensureLkDaemonRunning() {
  if (lkDaemonProc && !lkDaemonProc.killed) return;

  const lkScript = path.join(projectRoot, 'scripts', 'lk_matting_pipeline.py');
  if (!fs.existsSync(lkScript)) return;

  const py = findPython();
  console.log('[DEVSTU LK Pipeline] Starting model_29 Matting Daemon...');
  lkDaemonProc = spawn(py, [lkScript, '--daemon'], {
    windowsHide: true,
    env: pyEnv(),
    stdio: ['pipe', 'pipe', 'pipe']
  });

  lkDaemonProc.stdout.on('data', (chunk) => {
    lkDaemonBuffer += chunk.toString('utf8');
    const lines = lkDaemonBuffer.split('\n');
    lkDaemonBuffer = lines.pop(); // save incomplete fragment
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const msg = JSON.parse(trimmed);
        if (msg.status === 'ready') {
          lkDaemonReady = true;
          console.log('[DEVSTU LK Pipeline] model_29 daemon is ready for sub-second inference!');
          continue;
        }
        if (msg.id && lkDaemonPending.has(msg.id)) {
          const { resolve } = lkDaemonPending.get(msg.id);
          lkDaemonPending.delete(msg.id);
          resolve(msg);
        }
      } catch (err) {
        console.warn('[DEVSTU LK Pipeline] Daemon JSON parse warning:', err.message);
      }
    }
  });

  lkDaemonProc.stderr.on('data', (d) => {
    // Info logs from Python
    const s = d.toString('utf8').trim();
    if (s) console.log('[DEVSTU LK Pipeline STDERR]', s);
  });

  lkDaemonProc.on('close', (code) => {
    console.log('[DEVSTU LK Pipeline] Daemon exited with code:', code);
    lkDaemonProc = null;
    lkDaemonReady = false;
    for (const [id, { reject }] of lkDaemonPending) {
      reject(new Error(`LK Daemon exited unexpectedly (code ${code})`));
    }
    lkDaemonPending.clear();
  });
}

export function executeLkPipelineDaemon(payload, timeoutMs = 25000) {
  return new Promise((resolve, reject) => {
    ensureLkDaemonRunning();
    if (!lkDaemonProc) {
      return reject(new Error('Failed to spawn LK daemon process'));
    }

    const id = String(lkReqCounter++);
    payload.id = id;

    const timer = setTimeout(() => {
      lkDaemonPending.delete(id);
      reject(new Error(`LK Daemon request timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    lkDaemonPending.set(id, {
      resolve: (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      reject: (err) => {
        clearTimeout(timer);
        reject(err);
      }
    });

    try {
      lkDaemonProc.stdin.write(JSON.stringify(payload) + '\n');
    } catch (err) {
      clearTimeout(timer);
      lkDaemonPending.delete(id);
      reject(err);
    }
  });
}

// -------------------------------------------------------------------------
// Main AI Request Router
// -------------------------------------------------------------------------
export async function handleAiRequest(pathname, req, res) {
  if (pathname === '/api/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      app: 'DEVSTU',
      rustWorker: await isRustWorkerAlive(),
      lkModel29Ready: lkDaemonReady
    }));
    return true;
  }

  if (pathname === '/api/app_exit') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, exiting: true }));
    setTimeout(() => {
      process.exit(0);
    }, 80);
    return true;
  }

  // 1. Rust SIMD Worker proxy
  if (pathname === '/api/process_photo') {
    await ensureRustWorkerRunning();
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const bodyBuf = Buffer.concat(chunks);

    try {
      const rustRes = await fetch('http://127.0.0.1:3005/api/process_photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyBuf
      });
      const data = await rustRes.json();
      res.writeHead(rustRes.status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'Rust SIMD Worker proxy error: ' + String(err) }));
    }
    return true;
  }

  // 2. Background presets from bg.json
  if (pathname === '/api/background_presets') {
    const bgJsonPath = path.join(projectRoot, 'assets', 'bg.json');
    if (fs.existsSync(bgJsonPath)) {
      try {
        const content = fs.readFileSync(bgJsonPath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(content);
        return true;
      } catch (e) {}
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, param: [] }));
    return true;
  }

  // 3. LK Magic Pro Cutout & Matting (/api/lk_matting_cutout)
  if (pathname === '/api/lk_matting_cutout') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    let body = {};
    try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'Invalid JSON body' }));
      return true;
    }

    const { image_base64 } = body;
    if (!image_base64) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'image_base64 is required' }));
      return true;
    }

    try {
      const result = await executeLkPipelineDaemon({
        action: 'composite',
        image_base64: image_base64,
        transparent: true,
        return_matte: true
      });

      if (result.status === 'ok') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: true,
          data_url: result.data_url,
          cutout_data_url: result.data_url,
          matte_data_url: result.matte_base64,
          width: result.width,
          height: result.height,
          elapsed_ms: result.elapsed_ms,
          engine: 'LK Magic Pro model_29 + GuidedFilter'
        }));
        return true;
      } else {
        throw new Error(result.error || 'LK Pipeline returned error');
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: `LK Cutout failed: ${err.message}` }));
      return true;
    }
  }

  // 4. LK Magic Pro Background Replacement (/api/lk_change_background)
  if (pathname === '/api/lk_change_background') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    let body = {};
    try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'Invalid JSON body' }));
      return true;
    }

    const { image_base64, color = 'sifalan', transparent = false } = body;
    if (!image_base64) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'image_base64 is required' }));
      return true;
    }

    try {
      const result = await executeLkPipelineDaemon({
        action: 'composite',
        image_base64: image_base64,
        color: String(color),
        transparent: Boolean(transparent),
        return_matte: true
      });

      if (result.status === 'ok') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: true,
          data_url: result.data_url,
          matte_data_url: result.matte_base64,
          width: result.width,
          height: result.height,
          elapsed_ms: result.elapsed_ms,
          engine: 'LK Magic Pro model_29 + BGFusion'
        }));
        return true;
      } else {
        throw new Error(result.error || 'LK Background Change returned error');
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: `LK Background Change failed: ${err.message}` }));
      return true;
    }
  }

  // 5. LK Magic Pro Sky Replacement (/api/lk_sky_replacement)
  if (pathname === '/api/lk_sky_replacement') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    let body = {};
    try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'Invalid JSON body' }));
      return true;
    }

    const { image_base64 } = body;
    if (!image_base64) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'image_base64 is required' }));
      return true;
    }

    const pid = process.pid;
    const now = Date.now();
    const tmpDir = getProjectTempDir();
    const tempIn = path.join(tmpDir, `devstu_sky_in_${pid}_${now}.png`);
    const tempOut = path.join(tmpDir, `devstu_sky_out_${pid}_${now}.png`);

    fs.writeFileSync(tempIn, Buffer.from(image_base64.replace(/^data:image\/[a-zA-Z]+;base64,/, ''), 'base64'));

    const scriptPath = path.join(projectRoot, 'scripts', 'lk_matting_pipeline.py');
    const py = findPython();

    const pyProc = spawn(py, [scriptPath, '--input', tempIn, '--output', tempOut, '--sky'], { windowsHide: true, env: pyEnv() });
    let stderr = '';
    pyProc.stderr.on('data', d => { stderr += d.toString(); });

    pyProc.on('close', code => {
      try { if (fs.existsSync(tempIn)) fs.unlinkSync(tempIn); } catch (e) {}

      if (code !== 0 || !fs.existsSync(tempOut)) {
        try { if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut); } catch (e) {}
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: `Sky segmentation failed: ${stderr || code}` }));
        return;
      }

      const outBuf = fs.readFileSync(tempOut);
      try { if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut); } catch (e) {}

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ok: true,
        data_url: `data:image/png;base64,${outBuf.toString('base64')}`,
        sky_matte_url: `data:image/png;base64,${outBuf.toString('base64')}`,
        engine: 'LK Magic Pro model_82 (Sky Segmentation)'
      }));
    });

    return true;
  }

  // 6. Upgraded /api/liying_change_background:
  // Routes to LK Magic Pro model_29 + BGFusion for ultra-high resolution and hair detail!
  if (pathname === '/api/liying_change_background') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const bodyStr = Buffer.concat(chunks).toString('utf8');
    let body = {};
    try { body = JSON.parse(bodyStr); } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'Invalid JSON body' }));
      return true;
    }

    const { image_base64, color = 'blue', transparent = false, straighten = false, level_only = false } = body;
    if (!image_base64) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'image_base64 is required' }));
      return true;
    }

    // If no pose alignment needed, use the superior LK model_29 pipeline directly!
    if (!straighten && !level_only) {
      try {
        const lkRes = await executeLkPipelineDaemon({
          action: 'composite',
          image_base64: image_base64,
          color: String(color),
          transparent: Boolean(transparent),
          return_matte: true
        });

        if (lkRes && lkRes.status === 'ok') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            ok: true,
            data_url: lkRes.data_url,
            matte_url: lkRes.matte_base64,
            engine: 'LK Magic Pro model_29 (Human Matting & BGFusion)'
          }));
          return true;
        }
      } catch (lkErr) {
        console.warn('[DEVSTU] LK Pipeline fallback to LiYing:', lkErr.message);
      }
    }

    // Fallback or pose alignment using LiYing
    const base64Data = image_base64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    const imgBuffer = Buffer.from(base64Data, 'base64');

    const pid = process.pid;
    const now = Date.now();
    const tmpDir = getProjectTempDir();
    const tempIn = path.join(tmpDir, `devstu_liying_in_${pid}_${now}.png`);
    const tempOut = path.join(tmpDir, `devstu_liying_out_${pid}_${now}.png`);
    const tempMatte = path.join(tmpDir, `devstu_liying_matte_${pid}_${now}.png`);

    fs.writeFileSync(tempIn, imgBuffer);

    const scriptPath = path.join(projectRoot, 'scripts', 'liying_process.py');
    const py = findPython();

    const args = [
      scriptPath,
      '--input', tempIn,
      '--output', tempOut,
      '--matte-output', tempMatte,
      '--color', String(color)
    ];
    if (transparent) args.push('--transparent');
    if (straighten) args.push('--straighten');
    if (level_only) args.push('--level-only');

    const pyProc = spawn(py, args, { windowsHide: true, env: pyEnv() });
    let stderr = '';
    pyProc.stderr.on('data', d => { stderr += d.toString(); });

    pyProc.on('close', code => {
      try { if (fs.existsSync(tempIn)) fs.unlinkSync(tempIn); } catch (e) {}

      if (code !== 0 || !fs.existsSync(tempOut)) {
        try { if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut); } catch (e) {}
        try { if (fs.existsSync(tempMatte)) fs.unlinkSync(tempMatte); } catch (e) {}
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: `LiYing failed: ${stderr || code}` }));
        return;
      }

      const outBuf = fs.readFileSync(tempOut);
      let matteBuf = null;
      if (fs.existsSync(tempMatte)) {
        try { matteBuf = fs.readFileSync(tempMatte); } catch (e) {}
      }

      try { if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut); } catch (e) {}
      try { if (fs.existsSync(tempMatte)) fs.unlinkSync(tempMatte); } catch (e) {}

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ok: true,
        data_url: `data:image/png;base64,${outBuf.toString('base64')}`,
        matte_url: matteBuf ? `data:image/png;base64,${matteBuf.toString('base64')}` : null,
        engine: 'LiYing Pose Align & Segmentation'
      }));
    });

    return true;
  }

  // 7. Evoto Salon Hair Dye
  if (pathname === '/api/evoto_hair_dye') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const bodyStr = Buffer.concat(chunks).toString('utf8');
    let body = {};
    try { body = JSON.parse(bodyStr); } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'Invalid JSON body' }));
      return true;
    }

    const {
      image_base64,
      mask_base64,
      preset = 'h07',
      strength = 65,
      darken = 0,
      shine = 0,
      gray = 0,
      unify = 0,
      smooth = 0
    } = body;

    if (!image_base64) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'image_base64 is required' }));
      return true;
    }

    const pid = process.pid;
    const now = Date.now();
    const tmpDir = getProjectTempDir();
    const tempIn = path.join(tmpDir, `devstu_hair_in_${pid}_${now}.png`);
    const tempMask = path.join(tmpDir, `devstu_hair_mask_${pid}_${now}.png`);
    const tempOut = path.join(tmpDir, `devstu_hair_out_${pid}_${now}.png`);

    const imgBuf = Buffer.from(image_base64.replace(/^data:image\/[a-zA-Z]+;base64,/, ''), 'base64');
    fs.writeFileSync(tempIn, imgBuf);

    if (mask_base64) {
      const maskBuf = Buffer.from(mask_base64.replace(/^data:image\/[a-zA-Z]+;base64,/, ''), 'base64');
      fs.writeFileSync(tempMask, maskBuf);
    }

    const scriptPath = path.join(projectRoot, 'scripts', 'evoto_hair_process.py');
    const py = findPython();

    const args = [
      scriptPath,
      '--input', tempIn,
      '--output', tempOut,
      '--preset', String(preset),
      '--strength', String(strength),
      '--darken', String(darken),
      '--shine', String(shine),
      '--gray', String(gray),
      '--unify', String(unify),
      '--smooth', String(smooth)
    ];
    if (mask_base64 && fs.existsSync(tempMask)) {
      args.push('--mask', tempMask);
    }

    const pyProc = spawn(py, args, { windowsHide: true, env: pyEnv() });
    let stderr = '';
    pyProc.stderr.on('data', d => { stderr += d.toString(); });

    pyProc.on('close', code => {
      try { if (fs.existsSync(tempIn)) fs.unlinkSync(tempIn); } catch (e) {}
      try { if (fs.existsSync(tempMask)) fs.unlinkSync(tempMask); } catch (e) {}

      if (code !== 0 || !fs.existsSync(tempOut)) {
        try { if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut); } catch (e) {}
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: `Hair dye failed: ${stderr || code}` }));
        return;
      }

      const outBuf = fs.readFileSync(tempOut);
      try { if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut); } catch (e) {}

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ok: true,
        data_url: `data:image/png;base64,${outBuf.toString('base64')}`
      }));
    });

    return true;
  }

  // 8. Upgraded /api/extract_matte:
  // Uses LK Magic Pro model_29 for ultra-detailed alpha matting with Guided Filter refinement!
  if (pathname === '/api/extract_matte') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const bodyStr = Buffer.concat(chunks).toString('utf8');
    let body = {};
    try { body = JSON.parse(bodyStr); } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'Invalid JSON body' }));
      return true;
    }

    const { image_base64 } = body;
    if (!image_base64) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'image_base64 is required' }));
      return true;
    }

    // Try LK model_29 Daemon first!
    try {
      const lkRes = await executeLkPipelineDaemon({
        action: 'matte_only',
        image_base64: image_base64,
        return_matte: true
      });

      if (lkRes && lkRes.status === 'ok' && lkRes.matte_base64) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: true,
          matte_data_url: lkRes.matte_base64,
          width: lkRes.width,
          height: lkRes.height,
          elapsed_ms: lkRes.elapsed_ms,
          engine: 'LK Magic Pro model_29 + GuidedFilter'
        }));
        return true;
      }
    } catch (lkErr) {
      console.warn('[DEVSTU] LK Daemon matte extraction fallback to extract_matte.py:', lkErr.message);
    }

    // Fallback to extract_matte.py (RMBG-1.4)
    const pid = process.pid;
    const now = Date.now();
    const tmpDir = getProjectTempDir();
    const tempIn = path.join(tmpDir, `devstu_matte_in_${pid}_${now}.png`);
    const tempOut = path.join(tmpDir, `devstu_matte_out_${pid}_${now}.png`);

    const imgBuf = Buffer.from(image_base64.replace(/^data:image\/[a-zA-Z]+;base64,/, ''), 'base64');
    fs.writeFileSync(tempIn, imgBuf);

    const scriptPath = path.join(projectRoot, 'scripts', 'extract_matte.py');
    const py = findPython();

    const pyProc = spawn(py, [scriptPath, tempIn, tempOut], { windowsHide: true, env: pyEnv() });
    let stderr = '';
    pyProc.stderr.on('data', d => { stderr += d.toString(); });

    pyProc.on('close', code => {
      try { if (fs.existsSync(tempIn)) fs.unlinkSync(tempIn); } catch (e) {}

      if (code !== 0 || !fs.existsSync(tempOut)) {
        try { if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut); } catch (e) {}
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: `Matte extraction failed: ${stderr || code}` }));
        return;
      }

      const outBuf = fs.readFileSync(tempOut);
      try { if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut); } catch (e) {}

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ok: true,
        matte_data_url: `data:image/png;base64,${outBuf.toString('base64')}`,
        engine: 'RMBG-1.4 Fallback'
      }));
    });

    return true;
  }

  return false;
}
