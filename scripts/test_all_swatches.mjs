import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tmpDir = 'C:\\Users\\user\\AppData\\Local\\Temp\\edge_debug_swatches';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9228',
  '--user-data-dir=' + tmpDir,
  '--window-size=1440,900',
  'http://127.0.0.1:3000'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const targetsRes = await fetch('http://127.0.0.1:9228/json');
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

  const samplePath = 'public\\samples\\portrait_1.jpg';
  const imgB64 = 'data:image/jpeg;base64,' + fs.readFileSync(samplePath).toString('base64');

  await evaluate(`
    (async () => {
      const res = await fetch("${imgB64}");
      const blob = await res.blob();
      const file = new File([blob], "portrait_1.jpg", { type: "image/jpeg" });
      await window._devstuAddFiles([file], true);
      window._devstuA.setMode("full");
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));

  // Open Phông nền
  await evaluate(`document.querySelector('button.mt-btn[data-mt="phongnen"]')?.click()`);
  await new Promise(r => setTimeout(r, 600));

  // Click Trắng (Pure White)
  console.log('Testing pure_white swatch...');
  await evaluate(`
    (async () => {
      const btn = document.querySelector('.asset-swatch[data-bgmode="pure_white"]');
      btn.click();
    })()
  `);
  // Give it 4 seconds for extract_matte if first time
  await new Promise(r => setTimeout(r, 4500));
  await captureScreenshot('C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51\\test_swatch_pure_white.png');

  // Click Nâu 03 (warm_beige)
  console.log('Testing warm_beige swatch...');
  await evaluate(`
    (async () => {
      const btn = document.querySelector('.asset-swatch[data-bgmode="warm_beige"]');
      btn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1500));
  await captureScreenshot('C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51\\test_swatch_warm_beige.png');

  // Click Xám 02 (studio_grey)
  console.log('Testing studio_grey swatch...');
  await evaluate(`
    (async () => {
      const btn = document.querySelector('.asset-swatch[data-bgmode="studio_grey"]');
      btn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1500));
  await captureScreenshot('C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51\\test_swatch_studio_grey.png');

  // Click Nền gốc
  console.log('Testing restore Nền gốc...');
  await evaluate(`document.querySelector('.bg-lib-btn-orig')?.click()`);
  await new Promise(r => setTimeout(r, 1500));
  await captureScreenshot('C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51\\test_swatch_restored.png');

  console.log('All swatches tested!');
} catch (e) {
  console.error(e);
} finally {
  proc.kill();
}
