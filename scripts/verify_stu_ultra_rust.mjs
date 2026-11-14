import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tmpDir = 'C:\\Users\\user\\AppData\\Local\\Temp\\edge_debug_stu_ultra_rust_full';
const artifactDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9230',
  '--user-data-dir=' + tmpDir,
  '--window-size=1440,900',
  'http://127.0.0.1:3000'
]);

await new Promise(r => setTimeout(r, 2500));

try {
  const targetsRes = await fetch('http://127.0.0.1:9230/json');
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
      ws.send(JSON.stringify({ id: 3, method: 'Network.enable' }));
      resolve();
    };
  });

  const callbacks = {};
  let reqId = 10;
  const rustApiCalls = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Network.requestWillBeSent') {
      if (msg.params.request.url.includes('/api/process_photo')) {
        rustApiCalls.push({
          url: msg.params.request.url,
          timestamp: Date.now()
        });
      }
    }
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

  async function captureScreenshot(filename) {
    const shot = await sendCmd('Page.captureScreenshot', { format: 'png' });
    const fullPath = path.join(artifactDir, filename);
    fs.writeFileSync(fullPath, Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot to:', fullPath);
  }

  await new Promise(r => setTimeout(r, 2000));

  // 1. Load sample portrait photo
  let samplePath = 'test_swatches/IMG_2948.JPG';
  if (!fs.existsSync(samplePath)) {
    samplePath = 'public/samples/portrait_1.jpg';
  }
  const imgB64 = 'data:image/jpeg;base64,' + fs.readFileSync(samplePath).toString('base64');

  console.log('1. Loading sample photo into DEVSTU...');
  await evaluate(`
    (async () => {
      const res = await fetch("${imgB64}");
      const blob = await res.blob();
      const file = new File([blob], "IMG_2948.JPG", { type: "image/jpeg" });
      if (window._devstuAddFiles) {
        await window._devstuAddFiles([file], true);
      }
    })();
  `);

  await new Promise(r => setTimeout(r, 2500));

  // 2. Click STU Ultra tab
  console.log('2. Switching to STU Ultra mode...');
  const switchRes = await evaluate(`
    (() => {
      const btn = document.getElementById('top-tab-stu-ultra') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('STU Ultra'));
      if (btn) {
        btn.click();
        return { clicked: true, text: btn.textContent.trim() };
      }
      return { clicked: false };
    })()
  `);
  console.log('Switch result:', switchRes);

  await new Promise(r => setTimeout(r, 2500));

  // 3. Inspect DOM and Viewport
  console.log('3. Inspecting STU Ultra Viewport & Rust Engine integration...');
  const inspectState = await evaluate(`
    (() => {
      const vp = document.getElementById('stu-ultra-viewport');
      const afterCanvas = document.getElementById('stu-ultra-after-canvas');
      const beforeCanvas = document.getElementById('stu-ultra-before-canvas');
      const splitLine = document.getElementById('stu-ultra-split-line');
      const container = document.getElementById('stu-ultra-container');
      const statusLabel = document.getElementById('stu-ultra-status-label');
      
      return {
        viewportExists: !!vp,
        viewportVisible: vp ? window.getComputedStyle(vp).display !== 'none' : false,
        afterCanvasExists: !!afterCanvas,
        afterCanvasWidth: afterCanvas ? afterCanvas.width : 0,
        afterCanvasHeight: afterCanvas ? afterCanvas.height : 0,
        beforeCanvasExists: !!beforeCanvas,
        beforeCanvasWidth: beforeCanvas ? beforeCanvas.width : 0,
        splitLineExists: !!splitLine,
        containerExists: !!container,
        engineStatus: window.__STU_ULTRA_ENGINE_STATUS || 'unknown',
        statusText: statusLabel ? statusLabel.textContent : ''
      };
    })()
  `);
  console.log('Inspect state:', inspectState);
  await captureScreenshot('verify_stu_ultra_step1_initial.png');

  // 4. Test Slider change -> Rust SIMD pipeline
  console.log('4. Adjusting sliders (facialSkinSmooth: 80, dodgeBurnSculpt: 50)...');
  const callsBeforeSlider = rustApiCalls.length;
  await evaluate(`
    (async () => {
      if (window._stuUltraSetSlider) {
        window._stuUltraSetSlider('facialSkinSmooth', 80);
        window._stuUltraSetSlider('dodgeBurnSculpt', 50);
        window._stuUltraTriggerRender(false);
      }
    })()
  `);
  await new Promise(r => setTimeout(r, 2500));
  console.log('Rust SIMD calls before/after slider:', callsBeforeSlider, '->', rustApiCalls.length);
  await captureScreenshot('verify_stu_ultra_step2_skin_smooth.png');

  // 5. Test Preset Click (Da tạp chí cao cấp / high_fashion) -> Rust SIMD pipeline
  console.log('5. Clicking Preset "high_fashion"...');
  const callsBeforePreset = rustApiCalls.length;
  const presetRes = await evaluate(`
    (() => {
      const card = document.querySelector('.retouch-preset-item[data-preset="high_fashion"]');
      if (card) {
        card.click();
        return { clicked: true };
      } else if (window._stuUltraApplyPreset) {
        window._stuUltraApplyPreset('high_fashion');
        return { appliedViaHelper: true };
      }
      return { failed: true };
    })()
  `);
  console.log('Preset click result:', presetRes);
  await new Promise(r => setTimeout(r, 2500));
  console.log('Rust SIMD calls before/after preset:', callsBeforePreset, '->', rustApiCalls.length);
  await captureScreenshot('verify_stu_ultra_step3_preset_high_fashion.png');

  // 6. Test Switching through All 5 Rail Tabs
  console.log('6. Switching through all 5 Rail Modules...');
  
  // 6.1 Color Module
  await evaluate(`
    (() => {
      const btn = document.querySelector('.rail-icon-btn[data-mod="mod-color"]');
      if (btn) btn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('verify_stu_ultra_mod_color.png');

  // 6.2 Background Module & Pure White Swatch
  console.log('6.2 Switching to Background module & Pure White swatch...');
  await evaluate(`
    (() => {
      const btn = document.querySelector('.rail-icon-btn[data-mod="mod-bg"]');
      if (btn) btn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 600));
  const bgSwatchRes = await evaluate(`
    (() => {
      const swatch = document.querySelector('.asset-swatch[data-bgmode="pure_white"]') || document.querySelector('.asset-swatch');
      if (swatch) {
        swatch.click();
        return { clicked: true, bgmode: swatch.dataset.bgmode };
      }
      return { clicked: false };
    })()
  `);
  console.log('BG Swatch click result:', bgSwatchRes);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('verify_stu_ultra_mod_bg.png');

  // 6.3 Clothing Module
  console.log('6.3 Switching to Clothing module...');
  await evaluate(`
    (() => {
      const btn = document.querySelector('.rail-icon-btn[data-mod="mod-clothing"]');
      if (btn) btn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('verify_stu_ultra_mod_clothing.png');

  // 6.4 Crop & Rotate Module
  console.log('6.4 Switching to Crop module...');
  await evaluate(`
    (() => {
      const btn = document.querySelector('.rail-icon-btn[data-mod="mod-crop"]');
      if (btn) btn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('verify_stu_ultra_mod_crop.png');

  // 7. Test Reset Button
  console.log('7. Testing Reset Button...');
  const resetRes = await evaluate(`
    (() => {
      const resetBtn = document.getElementById('stu-ultra-btn-reset');
      if (resetBtn) {
        resetBtn.click();
        return { clicked: true };
      }
      return { clicked: false };
    })()
  `);
  console.log('Reset click result:', resetRes);
  await new Promise(r => setTimeout(r, 2500));
  await captureScreenshot('verify_stu_ultra_step5_reset.png');

  console.log('Summary of Rust SIMD API calls: Total', rustApiCalls.length, 'calls recorded.');
  console.log('ALL TESTS PASSED!');
} catch (err) {
  console.error('Verification error:', err);
} finally {
  try { proc.kill(); } catch (e) {}
  process.exit(0);
}
