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

export async function handleAiRequest(pathname, req, res) {
  if (pathname === '/api/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, app: 'DEVSTU' }));
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

  return false;
}
