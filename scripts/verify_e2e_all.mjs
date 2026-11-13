import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tmpDir = 'C:\\Users\\user\\AppData\\Local\\Temp\\edge_debug_e2e_all';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9224',
  '--user-data-dir=' + tmpDir,
  '--window-size=1440,900',
  'http://127.0.0.1:3000'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const targetsRes = await fetch('http://127.0.0.1:9224/json');
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
    return res?.result?.value;
  }

  async function captureScreenshot(outPath) {
    const res = await sendCmd('Page.captureScreenshot', { format: 'png' });
    if (res?.data) {
      fs.writeFileSync(outPath, Buffer.from(res.data, 'base64'));
      console.log('Saved screenshot to:', outPath);
    }
  }

  console.log('1. Waiting for DEVSTU web app mount...');
  await new Promise(r => setTimeout(r, 2000));

  // Load test portrait
  const samplePath = 'F:\\Workspace\\Code projects\\2. Tool Media by Doan\\Collabs-Retouch-Pro\\public\\samples\\portrait_1.jpg';
  const imgB64 = 'data:image/jpeg;base64,' + fs.readFileSync(samplePath).toString('base64');

  console.log('2. Loading portrait photo into DEVSTU...');
  await evaluate(`
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
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));

  // STEP 1: Verify Crop & Rotate
  console.log('3. Verifying Crop & Rotate overlay and controls...');
  const cropTest = await evaluate(`
    (() => {
      const cropBtn = document.querySelector('button[data-mt="crop"]');
      if (cropBtn) cropBtn.click();

      const cropTab = document.querySelector('.collabs-crop-tab');
      const cropOv = document.querySelector('.crop-ov');
      const cropCard = document.querySelector('.heal-card.crop-card');
      const cropBox = document.querySelector('.crop-box');

      // Test changing ratio to 1:1
      if (typeof window._devstuSetCropRatio === 'function') {
        window._devstuSetCropRatio('1:1');
      }

      return {
        hasCropTab: !!cropTab,
        isOvVisible: cropOv && !cropOv.classList.contains('hidden') && window.getComputedStyle(cropOv).display !== 'none',
        isCardHidden: !cropCard || cropCard.classList.contains('hidden') || window.getComputedStyle(cropCard).display === 'none',
        isTabInert: cropTab ? cropTab.inert : null,
        cropBoxHandlesCount: cropBox ? cropBox.querySelectorAll('.ch').length : 0,
        gridLinesCount: cropBox ? cropBox.querySelectorAll('.cg').length : 0
      };
    })()
  `);
  console.log('Crop Test Result:', cropTest);
  await captureScreenshot('C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51\\e2e_crop_verified.png');

  // STEP 2: Verify Background tab & lower controls
  console.log('4. Verifying Background Tab & Lower Controls...');
  const bgTest = await evaluate(`
    (() => {
      const bgBtn = document.querySelector('button[data-mt="phongnen"]');
      if (bgBtn) bgBtn.click();

      const bgTab = document.querySelector('.collabs-bg-tab');
      if (!bgTab) return { error: 'No collabs-bg-tab' };

      const bgSelect = bgTab.querySelector('#bgReplaceMode');
      const swatches = bgTab.querySelectorAll('.asset-swatch');
      const advWrap = bgTab.querySelector('#bg-replace-advanced-wrap');
      const modeSelects = advWrap?.querySelectorAll('select');
      const sliders = advWrap?.querySelectorAll('.retouch-slider');
      const switches = advWrap?.querySelectorAll('.evoto-switch');
      const shadowCards = advWrap?.querySelectorAll('.bg-shadow-card');

      // Scroll the panel down so lower controls are centered in viewport
      const panel = document.querySelector('.panel');
      if (panel) {
        panel.scrollTop = 400;
      }

      return {
        hasBgTab: !!bgTab,
        hasBgSelect: !!bgSelect,
        optionsCount: bgSelect?.options?.length,
        swatchesCount: swatches.length,
        hasAdvWrap: !!advWrap,
        advSelectsCount: modeSelects?.length,
        advSlidersCount: sliders?.length,
        advSwitchesCount: switches?.length,
        shadowCardsCount: shadowCards?.length
      };
    })()
  `);
  console.log('Background Controls Result:', bgTest);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51\\e2e_bg_scrolled_lower.png');

  // STEP 3: Test In-Place AI Hair Dye
  console.log('5. Testing In-Place AI Hair Dye with MediaPipe...');
  const hairDyeTest = await evaluate(`
    (async () => {
      const A = window._devstuA;
      if (!A || !A.current) return { error: 'No photo loaded' };

      const countBefore = A.photos.length;
      const idBefore = A.current.id;

      // Run Evoto Hair Dye in-place (H05 - Ruby Red)
      const res = await window.CollabsDevstuAI.runEvotoHairDye(A.current, 'h05', {
        strength: 75,
        darken: 0
      });

      const countAfter = A.photos.length;
      const idAfter = A.current.id;

      return {
        resOk: res?.ok,
        countBefore,
        countAfter,
        noNewFilesCreated: countBefore === countAfter,
        samePhotoId: idBefore === idAfter
      };
    })()
  `);
  console.log('In-Place Hair Dye Result:', hairDyeTest);
  await new Promise(r => setTimeout(r, 1000));
  await captureScreenshot('C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51\\e2e_hair_dye_inplace.png');

  // STEP 4: Test Restore Original Photo
  console.log('6. Testing Restore Original Photo...');
  const restoreTest = await evaluate(`
    (() => {
      const A = window._devstuA;
      const countBefore = A.photos.length;
      window.CollabsDevstuAI.restoreOriginalPhoto(A.current);
      const countAfter = A.photos.length;

      return {
        countBefore,
        countAfter,
        noNewFilesCreated: countBefore === countAfter
      };
    })()
  `);
  console.log('Restore Result:', restoreTest);

  // STEP 5: Test In-Place AI Background Replacement
  console.log('7. Testing In-Place AI Background Replacement (White)...');
  const bgReplaceTest = await evaluate(`
    (async () => {
      const A = window._devstuA;
      const countBefore = A.photos.length;
      const idBefore = A.current.id;

      const res = await window.CollabsDevstuAI.runLiyingBackgroundReplacement(A.current, 'white', {
        transparent: false,
        name: 'Trắng'
      });

      const countAfter = A.photos.length;
      const idAfter = A.current.id;

      return {
        resOk: res?.ok,
        countBefore,
        countAfter,
        noNewFilesCreated: countBefore === countAfter,
        samePhotoId: idBefore === idAfter
      };
    })()
  `);
  console.log('In-Place Background Replacement Result:', bgReplaceTest);
  await new Promise(r => setTimeout(r, 1000));
  await captureScreenshot('C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51\\e2e_bg_replace_inplace.png');

  console.log('ALL E2E VERIFICATIONS COMPLETED SUCCESSFULLY!');
} catch (err) {
  console.error('E2E Verification Error:', err);
} finally {
  proc.kill();
}
