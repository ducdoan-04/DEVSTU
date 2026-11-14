import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tmpDir = 'C:\\Users\\user\\AppData\\Local\\Temp\\edge_debug_bg_verify_3';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9227',
  '--user-data-dir=' + tmpDir,
  '--window-size=1440,900',
  'http://127.0.0.1:3000'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const targetsRes = await fetch('http://127.0.0.1:9227/json');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('3000'));

  if (!pageTarget) {
    console.error('Target page not found:', targets);
    process.exit(1);
  }

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
    if (res.exceptionDetails) {
      console.error('Eval exception:', res.exceptionDetails);
    }
    return res.result ? res.result.value : null;
  }

  async function captureScreenshot(filepath) {
    const shot = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filepath, Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot to:', filepath);
  }

  await new Promise(r => setTimeout(r, 2000));

  // 1. Load sample photo portrait_1.jpg via base64
  const samplePath = 'public\\samples\\portrait_1.jpg';
  const imgB64 = 'data:image/jpeg;base64,' + fs.readFileSync(samplePath).toString('base64');

  console.log('1. Loading sample portrait photo into DEVSTU...');
  const loadResult = await evaluate(`
    (async () => {
      const res = await fetch("${imgB64}");
      const blob = await res.blob();
      const file = new File([blob], "portrait_1.jpg", { type: "image/jpeg" });
      if (window._devstuAddFiles) {
        await window._devstuAddFiles([file], true);
      }
      if (window._devstuA) {
        window._devstuA.setMode("full");
      }
      return {
        photosCount: window._devstuA?.photos?.length,
        currentName: window._devstuA?.current?.name,
        currentId: window._devstuA?.current?.id
      };
    })()
  `);
  console.log('Load Result:', loadResult);

  await new Promise(r => setTimeout(r, 3000));
  await captureScreenshot('C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51\\test_1_initial_photo.png');

  // 2. Open "Phông nền" tab
  console.log('2. Opening Phông nền tab...');
  await evaluate(`
    (() => {
      const bgBtn = document.querySelector('button.mt-btn[data-mt="phongnen"]');
      bgBtn?.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 800));

  // 3. Test LiYing AI Kem Be background replacement
  console.log('3. Running LiYing AI Kem Be...');
  const liyingResult = await evaluate(`
    (async () => {
      const photo = window._devstuA?.current;
      if (!photo) return { error: 'No photo' };

      const res = await window.CollabsDevstuAI.runLiyingBackgroundReplacement(photo, {
        color: 'beige',
        label: 'Kem Be',
        transparent: false,
        straighten: false
      });

      return {
        ok: res?.ok,
        isAiVersion: photo._isAiVersion,
        photosCount: window._devstuA?.photos?.length
      };
    })()
  `);
  console.log('LiYing AI Result:', liyingResult);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51\\test_2_liying_beige.png');

  // 4. Test Swatch: Trắng (Pure White)
  console.log('4. Clicking Swatch: Trắng...');
  const whiteResult = await evaluate(`
    (async () => {
      const btn = document.querySelector('.asset-swatch[data-bgmode="pure_white"]');
      if (btn) {
        btn.click();
        return { clicked: true };
      }
      return { clicked: false, availableModes: Array.from(document.querySelectorAll('.asset-swatch')).map(b => b.dataset.bgmode) };
    })()
  `);
  console.log('White Swatch Result:', whiteResult);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51\\test_3_swatch_white.png');

  // 5. Test Swatch: Đen (Moody Black)
  console.log('5. Clicking Swatch: Đen...');
  const blackResult = await evaluate(`
    (async () => {
      const btn = document.querySelector('.asset-swatch[data-bgmode="moody_black"]');
      if (btn) {
        btn.click();
        return { clicked: true };
      }
      return { clicked: false };
    })()
  `);
  console.log('Black Swatch Result:', blackResult);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51\\test_4_swatch_black.png');

  // 6. Test Nền gốc restore
  console.log('6. Clicking Nền gốc (Restore original)...');
  await evaluate(`
    (() => {
      const origBtn = document.querySelector('.bg-lib-btn-orig');
      origBtn?.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51\\test_5_restored_original.png');

  console.log('Test completed successfully!');
} catch (err) {
  console.error('Test error:', err);
} finally {
  proc.kill();
}
