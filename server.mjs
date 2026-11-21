import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleAiRequest } from './scripts/ai_api_handler.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const REMOTE_BASE = 'https://devstu.vercel.app';

const MODEL_KEYS = {
  'da-retouch-v1': 'JibaelF7gqjnIGCgdiPy4TKEvYDVuZvv7LL81ctCcpw=',
  'ao-retouch-v1': 'kTsTOrX93u8ykhZmZb0L1juKtLcJwMt14wBqK97OLLg=',
  'da-than-v1': '3VbTFBXHjdfMwCimmnqfyljuoEZSg5yZkfU7Kw/DfAM=',
  'ranh-cuoi-v1': 'BmgP7/zGvGnIUjbjsT7aWVGQENjeTKSTiel9w5db2wE=',
  'tao-khoi-v1': 'ilJyUSkIMmfTctFrcE+AMcA88lMLLW+Uo3QWqXz2ITE=',
  'toc-retouch-v1': 'v1DH98kNoq/zydfgVxs3O5DaDSknZnsVwA5xBwMevt4=',
  'giam-nhieu-nhe-v1': '4f0oZX+Bh6itefTITLzUSnfGD6xdrZQwsejlXZ3XgQI='
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.bin': 'application/octet-stream',
  '.enc': 'application/octet-stream',
  '.onnx': 'application/octet-stream',
  '.tul': 'application/octet-stream',
  '.task': 'application/octet-stream',
  '.tflite': 'application/octet-stream'
};

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Cross-Origin headers for SharedArrayBuffer, WebGPU, and SIMD
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // AI API routes
    if (pathname.startsWith('/api/')) {
      const handled = await handleAiRequest(pathname, req, res);
      if (handled) return;
    }

    // 1. Emulate /__native/... routes
    if (pathname.startsWith('/__native/')) {
      const sub = pathname.replace('/__native/', '');

      if (sub.startsWith('paths')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'ok',
          allowed: true,
          platform: 'windows'
        }));
        return;
      }

      if (sub.startsWith('tether')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          on: false,
          mode: 'wifi',
          port: 2121,
          user: 'DEVSTU',
          pass: '123456',
          ips: ['192.168.1.100'],
          dir: 'Pictures\\DEVSTU-Tether',
          usb_dir: 'Pictures\\DEVSTU-USB',
          cameras: [],
          files: [],
          received: 0,
          done: 0,
          total: 0
        }));
        return;
      }

      if (sub.startsWith('photos/save')) {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const bodyBuf = Buffer.concat(chunks);
        console.log(`[Native Save] Received ${bodyBuf.length} bytes to save`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, saved: true }));
        return;
      }

      if (sub.startsWith('profiles/file')) {
        const p = parsedUrl.searchParams.get('p');
        const sysColorDir = 'C:\\Windows\\System32\\spool\\drivers\\color';
        const targetProf = p ? path.join(sysColorDir, path.basename(p)) : null;
        if (targetProf && fs.existsSync(targetProf)) {
          res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
          fs.createReadStream(targetProf).pipe(res);
          return;
        }
        res.writeHead(404);
        res.end('Profile not found');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    // 2. Emulate /__api/... or /v1/... routes
    const isApi = pathname.startsWith('/__api/') || pathname.startsWith('/v1/');
    if (isApi) {
      const apiPath = pathname.replace(/^\/__api/, '');

      if (apiPath === '/v1/me') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          user: {
            id: 'pro_user',
            email: 'pro@DEVSTU.local',
            name: 'Pro User',
            role: 'pro',
            newsletter: false
          },
          access: {
            tier: 'all',
            premiumUntil: 4102444800,
            premiumLifetime: true,
            masterUntil: 4102444800,
            masterLifetime: true,
            masterTrial: false,
            masterTrialUsed: false
          },
          k: 'msGYBNQ9tpi4ldfsX_ZGw4kz5LMIsA30kEqYBgWH0tU',
          referral: {
            code: 'PRO_LOCAL',
            link: 'http://127.0.0.1:3000',
            qualified: 999,
            pending: 0,
            next: 0,
            campaign: { days: 9999, capDays: 9999, usedDays: 0, until: 4102444800 },
            redeemed: false,
            waiting: false,
            partner: null
          },
          notices: 0,
          global: null
        }));
        return;
      }

      if (apiPath.startsWith('/v1/model-key')) {
        const m = parsedUrl.searchParams.get('m');
        const key = MODEL_KEYS[m] || 'plain';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ model: m, key, exp: 4102444800 }));
        return;
      }

      if (apiPath.startsWith('/v1/t/')) {
        const hash = apiPath.replace(/^\/v1\/t\//, '').replace(/\.bin$/, '');
        const lutFile = path.join(__dirname, 'cache_t', `${hash}.bin`);
        if (fs.existsSync(lutFile)) {
          res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
          fs.createReadStream(lutFile).pipe(res);
          return;
        }
        try {
          const remoteLutRes = await fetch(`${REMOTE_BASE}/cache_t/${hash}.bin`);
          if (remoteLutRes.ok) {
            const buf = Buffer.from(await remoteLutRes.arrayBuffer());
            fs.mkdirSync(path.dirname(lutFile), { recursive: true });
            fs.writeFileSync(lutFile, buf);
            res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
            res.end(buf);
            return;
          }
        } catch (err) {
          console.error(`[Remote LUT Fetch Error] ${err.message}`);
        }
      }

      if (apiPath === '/v1/notices' || apiPath.startsWith('/v1/notices/')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ notices: [] }));
        return;
      }

      if (apiPath === '/v1/plans') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ plans: [] }));
        return;
      }

      // Default auth / cloud / store response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, user: { email: 'pro@DEVSTU.local' } }));
      return;
    }

    // 3. Static files
    if (pathname === '/') pathname = '/index.html';
    const filePath = path.join(__dirname, pathname.replace(/^\//, '').replace(/\//g, path.sep));

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': mime,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // 4. Remote caching proxy for missing files
    if (pathname.startsWith('/vendor/') || pathname.startsWith('/hptul/') || pathname.startsWith('/icons/') || pathname.startsWith('/fonts/') || pathname.startsWith('/cache_t/')) {
      const remoteUrl = REMOTE_BASE + pathname;
      console.log(`[Cache Miss] Downloading from remote: ${remoteUrl}`);
      try {
        const remoteRes = await fetch(remoteUrl);
        if (remoteRes.ok) {
          const buf = Buffer.from(await remoteRes.arrayBuffer());
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
          fs.writeFileSync(filePath, buf);
          console.log(`[Cached] Saved ${buf.length} bytes to ${filePath}`);

          const ext = path.extname(filePath).toLowerCase();
          res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
          res.end(buf);
          return;
        }
      } catch (err) {
        console.error(`[Remote Fetch Error] ${err.message}`);
      }
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  } catch (err) {
    console.error('[Server Error]', err);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n======================================================`);
  console.log(` DEVSTU Pro Unlocked (Offline Suite) is running!`);
  console.log(` URL: http://127.0.0.1:${PORT}`);
  console.log(`======================================================\n`);
});
