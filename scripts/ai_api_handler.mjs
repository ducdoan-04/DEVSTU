import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const pyInterpreters = [
  'F:/Workspace/Code projects/LiYing-master/python-embed/python.exe',
  'F:/Workspace/Code projects/LiYing/python-embed/python.exe',
  'python-embed/python.exe',
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

  const rustExe = 'F:/Workspace/Code projects/2. Tool Media by Doan/Collabs-Retouch-Pro/src-tauri/target/debug/retouch-pro.exe';
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

export async function handleAiRequest(pathname, req, res) {
  if (pathname === '/api/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, app: 'DEVSTU', rustWorker: await isRustWorkerAlive() }));
    return true;
  }

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

    const base64Data = image_base64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    const imgBuffer = Buffer.from(base64Data, 'base64');

    const pid = process.pid;
    const now = Date.now();
    const tempIn = path.join(os.tmpdir(), `devstu_liying_in_${pid}_${now}.png`);
    const tempOut = path.join(os.tmpdir(), `devstu_liying_out_${pid}_${now}.png`);
    const tempMatte = path.join(os.tmpdir(), `devstu_liying_matte_${pid}_${now}.png`);

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

    const pyProc = spawn(py, args, { windowsHide: true });
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
        matte_url: matteBuf ? `data:image/png;base64,${matteBuf.toString('base64')}` : null
      }));
    });

    return true;
  }

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
    const tempIn = path.join(os.tmpdir(), `devstu_hair_in_${pid}_${now}.png`);
    const tempMask = path.join(os.tmpdir(), `devstu_hair_mask_${pid}_${now}.png`);
    const tempOut = path.join(os.tmpdir(), `devstu_hair_out_${pid}_${now}.png`);

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

    const pyProc = spawn(py, args, { windowsHide: true });
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

    const pid = process.pid;
    const now = Date.now();
    const tempIn = path.join(os.tmpdir(), `devstu_matte_in_${pid}_${now}.png`);
    const tempOut = path.join(os.tmpdir(), `devstu_matte_out_${pid}_${now}.png`);

    const imgBuf = Buffer.from(image_base64.replace(/^data:image\/[a-zA-Z]+;base64,/, ''), 'base64');
    fs.writeFileSync(tempIn, imgBuf);

    const scriptPath = path.join(projectRoot, 'scripts', 'extract_matte.py');
    const py = findPython();

    const pyProc = spawn(py, [scriptPath, tempIn, tempOut], { windowsHide: true });
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
        matte_data_url: `data:image/png;base64,${outBuf.toString('base64')}`
      }));
    });

    return true;
  }

  return false;
}
