import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tmpDir = 'C:\\Users\\user\\AppData\\Local\\Temp\\edge_debug_footer_verify';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9229',
  '--user-data-dir=' + tmpDir,
  '--window-size=1440,900',
  'http://127.0.0.1:3000'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const targetsRes = await fetch('http://127.0.0.1:9229/json');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('3000'));
  const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);

  await new Promise(resolve => {
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
      resolve();
    };
  });

  const callbacks = {};
  let reqId = 10;
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks[msg.id]) {
      callbacks[msg.id](msg.result);
      delete callbacks[msg.id];
    }
  };

  function sendCmd(method, params = {}) {
    return new Promise(resolve => {
      const id = ++reqId;
      callbacks[id] = resolve;
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expr) {
    const res = await sendCmd('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result ? res.result.value : null;
  }

  async function captureScreenshot(filepath) {
    const shot = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filepath, Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot:', filepath);
  }

  await new Promise(r => setTimeout(r, 2000));

  // Load 2 portrait photos to match user scenario (IMG_2948 and IMG_2996)
  const p1Path = 'public\\samples\\portrait_1.jpg';
  const p2Path = 'public\\samples\\portrait_2.jpg';
  const b64_1 = 'data:image/jpeg;base64,' + fs.readFileSync(p1Path).toString('base64');
  const b64_2 = 'data:image/jpeg;base64,' + fs.readFileSync(p2Path).toString('base64');

  console.log('1. Adding two portrait photos to DEVSTU...');
  const addResult = await evaluate(`
    (async () => {
      const r1 = await fetch("${b64_1}");
      const b1 = await r1.blob();
      const f1 = new File([b1], "IMG_2948.JPG", { type: "image/jpeg" });

      const r2 = await fetch("${b64_2}");
      const b2 = await r2.blob();
      const f2 = new File([b2], "IMG_2996.JPG", { type: "image/jpeg" });

      await window._devstuAddFiles([f1, f2], true);
      window._devstuA.setMode("full");

      return {
        photosCount: window._devstuA?.photos?.length,
        names: window._devstuA?.photos?.map(p => p.name)
      };
    })()
  `);
  console.log('Add Result:', addResult);

  await new Promise(r => setTimeout(r, 2500));

  // Check initial thumbnail canvas dimensions
  const initThumbData = await evaluate(`
    (() => {
      const thumbs = Array.from(document.querySelectorAll('footer.strip .thumb'));
      return thumbs.map(th => {
        const c = th.querySelector('canvas');
        return {
          id: th.dataset.id,
          name: th.title,
          canvasWidth: c?.width,
          canvasHeight: c?.height,
          cssWidth: c?.style?.width,
          aspectRatio: c ? (c.width / c.height).toFixed(3) : null
        };
      });
    })()
  `);
  console.log('Initial Thumbnails Proportions:', initThumbData);

  // Open Phông nền
  await evaluate(`document.querySelector('button.mt-btn[data-mt="phongnen"]')?.click()`);
  await new Promise(r => setTimeout(r, 600));

  // Click background swatch: Trắng
  console.log('2. Applying background swatch: pure_white...');
  await evaluate(`
    (() => {
      const btn = document.querySelector('.asset-swatch[data-bgmode="pure_white"]');
      btn?.click();
    })()
  `);

  await new Promise(r => setTimeout(r, 4000));

  // Check thumbnail canvas dimensions AFTER background replacement
  const afterThumbData = await evaluate(`
    (() => {
      const thumbs = Array.from(document.querySelectorAll('footer.strip .thumb'));
      const A = window._devstuA;
      return thumbs.map(th => {
        const c = th.querySelector('canvas');
        const photo = A.photos.find(p => p.id === th.dataset.id);
        return {
          id: th.dataset.id,
          name: th.title,
          canvasWidth: c?.width,
          canvasHeight: c?.height,
          cssWidth: c?.style?.width,
          aspectRatio: c ? (c.width / c.height).toFixed(3) : null,
          isPortrait: c ? c.height > c.width : null,
          thumbWidth: photo?.thumb?.width,
          thumbHeight: photo?.thumb?.height
        };
      });
    })()
  `);
  console.log('AFTER Background Swatch Thumbnails Proportions:', afterThumbData);

  // Click background swatch: Xám 02
  console.log('3. Applying background swatch: studio_grey...');
  await evaluate(`
    (() => {
      const btn = document.querySelector('.asset-swatch[data-bgmode="studio_grey"]');
      btn?.click();
    })()
  `);

  await new Promise(r => setTimeout(r, 2000));

  const greyThumbData = await evaluate(`
    (() => {
      const thumbs = Array.from(document.querySelectorAll('footer.strip .thumb'));
      const A = window._devstuA;
      return thumbs.map(th => {
        const c = th.querySelector('canvas');
        const photo = A.photos.find(p => p.id === th.dataset.id);
        return {
          id: th.dataset.id,
          name: th.title,
          canvasWidth: c?.width,
          canvasHeight: c?.height,
          cssWidth: c?.style?.width,
          aspectRatio: c ? (c.width / c.height).toFixed(3) : null,
          isPortrait: c ? c.height > c.width : null,
          thumbWidth: photo?.thumb?.width,
          thumbHeight: photo?.thumb?.height
        };
      });
    })()
  `);
  console.log('AFTER Studio Grey Swatch Thumbnails Proportions:', greyThumbData);

  await captureScreenshot('C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51\\verify_footer_proportions_fixed.png');

  // Verify that all thumbnails are strictly portrait (height > width)
  const allPortrait = greyThumbData.every(t => t.isPortrait);
  console.log('=== VERIFICATION RESULT ===');
  console.log('Are all thumbnails strictly PORTRAIT (un-distorted):', allPortrait);

} catch (e) {
  console.error(e);
} finally {
  proc.kill();
}
