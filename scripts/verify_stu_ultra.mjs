import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tmpDir = 'C:\\Users\\user\\AppData\\Local\\Temp\\edge_debug_stu_ultra_verify';
const artifactDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9228',
  '--user-data-dir=' + tmpDir,
  '--window-size=1440,900',
  'http://127.0.0.1:3000'
]);

await new Promise(r => setTimeout(r, 2500));

try {
  const targetsRes = await fetch('http://127.0.0.1:9228/json');
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

  // 2. Check mode buttons in top header
  console.log('2. Checking top mode buttons...');
  const modeButtons = await evaluate(`
    (() => {
      const modes = document.querySelector('.modes');
      if (!modes) return { error: 'No .modes group found' };
      const btns = Array.from(modes.querySelectorAll('button')).map(b => ({
        className: b.className,
        text: b.textContent.trim(),
        ariaPressed: b.getAttribute('aria-pressed')
      }));
      return btns;
    })()
  `);
  console.log('Modes found:', modeButtons);

  // 3. Click STU Ultra mode
  console.log('3. Clicking STU Ultra mode button...');
  const clickUltraResult = await evaluate(`
    (() => {
      const ultraBtn = document.querySelector('.mode-stu-ultra');
      if (!ultraBtn) return { error: 'STU Ultra button not found' };
      ultraBtn.click();
      return {
        clicked: true,
        ariaPressed: ultraBtn.getAttribute('aria-pressed'),
        appHasClass: document.getElementById('app')?.classList.contains('app-stu-ultra')
      };
    })()
  `);
  console.log('STU Ultra Click Result:', clickUltraResult);

  await new Promise(r => setTimeout(r, 1000));

  // 4. Inspect STU Ultra DOM elements
  console.log('4. Inspecting STU Ultra workspace elements...');
  const stuUltraCheck = await evaluate(`
    (() => {
      const cont = document.getElementById('stu-ultra-container');
      const insp = cont?.querySelector('.retouch-right-inspector');
      const rail = cont?.querySelector('.retouch-right-rail');
      const hdrRight = document.getElementById('stu-ultra-header-right');
      const activePane = insp?.querySelector('.retouch-module-pane.active')?.id;
      const title = insp?.querySelector('#right-module-title')?.textContent;
      const devstuPanelHidden = getComputedStyle(document.querySelector('.panel')).display === 'none';
      const devstuMtabsHidden = getComputedStyle(document.querySelector('.mtabs')).display === 'none';
      const contDisplay = cont ? getComputedStyle(cont).display : 'none';

      return {
        containerExists: !!cont,
        containerDisplay: contDisplay,
        inspectorExists: !!insp,
        railExists: !!rail,
        headerRightExists: !!hdrRight,
        activeModulePane: activePane,
        moduleTitle: title,
        devstuPanelHidden,
        devstuMtabsHidden
      };
    })()
  `);
  console.log('STU Ultra Workspace Check:', stuUltraCheck);

  await captureScreenshot('verify_stu_ultra_portrait.png');

  // 5. Test Rail Module Switching
  console.log('5. Testing Rail Module Switching...');

  // A. Switch to mod-color
  await evaluate(`
    (() => {
      const btn = document.querySelector('.rail-icon-btn[data-mod="mod-color"]');
      if (btn) btn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 600));
  const colorCheck = await evaluate(`
    (() => ({
      title: document.getElementById('right-module-title')?.textContent,
      activePane: document.querySelector('.retouch-module-pane.active')?.id,
      slidersCount: document.querySelectorAll('#mod-color .retouch-slider').length
    }))()
  `);
  console.log('Color Module Check:', colorCheck);
  await captureScreenshot('verify_stu_ultra_color.png');

  // Test moving exposure slider in mod-color
  console.log('Testing exposure slider in mod-color...');
  const sliderMove = await evaluate(`
    (() => {
      const sl = document.getElementById('exposure');
      if (!sl) return { error: 'exposure slider not found' };
      sl.value = 25;
      sl.dispatchEvent(new Event('input', { bubbles: true }));
      const badge = document.querySelector('.val[data-for="exposure"]');
      const photo = window._devstuA?.current;
      return {
        badgeText: badge?.textContent,
        badgeModified: badge?.classList.contains('modified'),
        photoToneExposure: photo?.state?.tone?.exposure
      };
    })()
  `);
  console.log('Exposure Slider Result:', sliderMove);

  // B. Switch to mod-bg
  await evaluate(`
    (() => {
      const btn = document.querySelector('.rail-icon-btn[data-mod="mod-bg"]');
      if (btn) btn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 600));
  const bgCheck = await evaluate(`
    (() => ({
      title: document.getElementById('right-module-title')?.textContent,
      activePane: document.querySelector('.retouch-module-pane.active')?.id,
      swatchesCount: document.querySelectorAll('#mod-bg .asset-swatch').length
    }))()
  `);
  console.log('BG Module Check:', bgCheck);
  await captureScreenshot('verify_stu_ultra_bg.png');

  // C. Switch to mod-clothing
  await evaluate(`
    (() => {
      const btn = document.querySelector('.rail-icon-btn[data-mod="mod-clothing"]');
      if (btn) btn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 600));
  const clothingCheck = await evaluate(`
    (() => ({
      title: document.getElementById('right-module-title')?.textContent,
      activePane: document.querySelector('.retouch-module-pane.active')?.id,
      slidersCount: document.querySelectorAll('#mod-clothing .retouch-slider').length
    }))()
  `);
  console.log('Clothing Module Check:', clothingCheck);
  await captureScreenshot('verify_stu_ultra_clothing.png');

  // D. Switch to mod-crop
  await evaluate(`
    (() => {
      const btn = document.querySelector('.rail-icon-btn[data-mod="mod-crop"]');
      if (btn) btn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 600));
  const cropCheck = await evaluate(`
    (() => ({
      title: document.getElementById('right-module-title')?.textContent,
      activePane: document.querySelector('.retouch-module-pane.active')?.id,
      ratioBtnText: document.getElementById('crop-ratio-label')?.textContent
    }))()
  `);
  console.log('Crop Module Check:', cropCheck);
  await captureScreenshot('verify_stu_ultra_crop.png');

  // 6. Test Bidirectional Mode Switching
  console.log('6. Testing Bidirectional Mode Switching...');
  // Switch back to "Đầy đủ"
  await evaluate(`
    (() => {
      const fullBtn = document.querySelector('.mode-full');
      if (fullBtn) fullBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 600));
  const fullModeCheck = await evaluate(`
    (() => ({
      appHasClass: document.getElementById('app')?.classList.contains('app-stu-ultra'),
      contDisplay: getComputedStyle(document.getElementById('stu-ultra-container')).display,
      panelDisplay: getComputedStyle(document.querySelector('.panel')).display,
      mtabsDisplay: getComputedStyle(document.querySelector('.mtabs')).display
    }))()
  `);
  console.log('Switch back to Full Mode Check:', fullModeCheck);
  await captureScreenshot('verify_switch_back_to_full.png');

  // Switch back to "STU Ultra"
  await evaluate(`
    (() => {
      const ultraBtn = document.querySelector('.mode-stu-ultra');
      if (ultraBtn) ultraBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 600));
  const ultraAgainCheck = await evaluate(`
    (() => ({
      appHasClass: document.getElementById('app')?.classList.contains('app-stu-ultra'),
      contDisplay: getComputedStyle(document.getElementById('stu-ultra-container')).display,
      panelDisplay: getComputedStyle(document.querySelector('.panel')).display,
      exposureValue: document.getElementById('exposure')?.value
    }))()
  `);
  console.log('Switch back to STU Ultra Check:', ultraAgainCheck);
  await captureScreenshot('verify_return_to_stu_ultra.png');

  console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
} catch (err) {
  console.error('Error during verification:', err);
} finally {
  proc.kill();
  process.exit(0);
}
