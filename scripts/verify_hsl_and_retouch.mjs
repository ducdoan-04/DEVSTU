import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tmpDir = 'C:\\Users\\user\\AppData\\Local\\Temp\\edge_debug_hsl_retouch';
const artifactDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\ade8dcc1-6679-4d2d-8fad-e7954ecade51';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9231',
  '--user-data-dir=' + tmpDir,
  '--window-size=1440,900',
  'http://127.0.0.1:3000'
]);

await new Promise(r => setTimeout(r, 2500));

try {
  const targetsRes = await fetch('http://127.0.0.1:9231/json');
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

  // 1. Load portrait photo
  const samplePath = 'public/samples/portrait_1.jpg';
  const imgB64 = 'data:image/jpeg;base64,' + fs.readFileSync(samplePath).toString('base64');

  console.log('1. Loading portrait_1.jpg...');
  await evaluate(`
    (async () => {
      const res = await fetch("${imgB64}");
      const blob = await res.blob();
      const file = new File([blob], "portrait_1.jpg", { type: "image/jpeg" });
      if (window._devstuAddFiles) {
        await window._devstuAddFiles([file], true);
      }
    })();
  `);

  await new Promise(r => setTimeout(r, 2500));

  // 2. Click STU Ultra Mode
  console.log('2. Switching to STU Ultra mode...');
  await evaluate(`
    (() => {
      const ultraBtn = document.querySelector('.mode-stu-ultra');
      if (ultraBtn) ultraBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 1000));

  // 3. Test HSL in mod-color
  console.log('3. Testing HSL 8 Channels in STU Ultra...');
  // Click mod-color rail icon
  await evaluate(`
    (() => {
      const colorBtn = document.querySelector('.rail-icon-btn[data-mod="mod-color"]');
      if (colorBtn) colorBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 600));

  // Test Red Channel Sliders
  const hslRedResult = await evaluate(`
    (() => {
      const hueSl = document.getElementById('hslRedHue');
      const satSl = document.getElementById('hslRedSat');
      const lumSl = document.getElementById('hslRedLum');
      
      if (hueSl) {
        hueSl.value = 25;
        hueSl.dispatchEvent(new Event('input', { bubbles: true }));
        hueSl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (satSl) {
        satSl.value = -80;
        satSl.dispatchEvent(new Event('input', { bubbles: true }));
        satSl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (lumSl) {
        lumSl.value = 15;
        lumSl.dispatchEvent(new Event('input', { bubbles: true }));
        lumSl.dispatchEvent(new Event('change', { bubbles: true }));
      }

      const st = window._devstuA?.current?.state;
      return {
        sliderValues: { hue: hueSl?.value, sat: satSl?.value, lum: lumSl?.value },
        stateHslChannel0: { h0: st?.hsl?.h0, s0: st?.hsl?.s0, l0: st?.hsl?.l0 },
        badgeModifiedHue: document.querySelector('.val[data-for="hslRedHue"]')?.classList.contains('modified'),
        badgeModifiedSat: document.querySelector('.val[data-for="hslRedSat"]')?.classList.contains('modified')
      };
    })()
  `);
  console.log('HSL Red Channel Result:', hslRedResult);

  // Switch to Orange Dot (Skin tones) and drag Orange Saturation
  const hslOrangeResult = await evaluate(`
    (() => {
      const orangeDot = document.querySelector('.hsl-dot[data-hsl="Orange"]');
      if (orangeDot) orangeDot.click();

      const orangeSatSl = document.getElementById('hslOrangeSat');
      if (orangeSatSl) {
        orangeSatSl.value = 35;
        orangeSatSl.dispatchEvent(new Event('input', { bubbles: true }));
        orangeSatSl.dispatchEvent(new Event('change', { bubbles: true }));
      }

      const st = window._devstuA?.current?.state;
      return {
        orangePaneActive: document.querySelector('.hsl-band-pane[data-hsl-pane="Orange"]')?.classList.contains('active'),
        orangeSatValue: orangeSatSl?.value,
        stateHslChannel1: { h1: st?.hsl?.h1, s1: st?.hsl?.s1, l1: st?.hsl?.l1 }
      };
    })()
  `);
  console.log('HSL Orange Channel Result:', hslOrangeResult);
  await captureScreenshot('verify_hsl_updated.png');

  // 4. Test Portrait Retouching in mod-portrait
  console.log('4. Testing Portrait Retouching & AI Models in STU Ultra...');
  // Click mod-portrait rail icon
  await evaluate(`
    (() => {
      const portraitBtn = document.querySelector('.rail-icon-btn[data-mod="mod-portrait"]');
      if (portraitBtn) portraitBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 600));

  // Adjust skin smooth, blemish, eyes, teeth, face reshape
  const retouchResult = await evaluate(`
    (() => {
      const smoothSl = document.getElementById('facialSkinSmooth');
      const acneSl = document.getElementById('freckleAcne');
      const eyeSl = document.getElementById('eyeSize');
      const teethSl = document.getElementById('teethWhiten');
      const faceSl = document.getElementById('faceWidth');
      const jawSl = document.getElementById('jawlineSlim');

      if (smoothSl) {
        smoothSl.value = 75;
        smoothSl.dispatchEvent(new Event('input', { bubbles: true }));
        smoothSl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (acneSl) {
        acneSl.value = 60;
        acneSl.dispatchEvent(new Event('input', { bubbles: true }));
        acneSl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (eyeSl) {
        eyeSl.value = 45;
        eyeSl.dispatchEvent(new Event('input', { bubbles: true }));
        eyeSl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (teethSl) {
        teethSl.value = 50;
        teethSl.dispatchEvent(new Event('input', { bubbles: true }));
        teethSl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (faceSl) {
        faceSl.value = 30;
        faceSl.dispatchEvent(new Event('input', { bubbles: true }));
        faceSl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (jawSl) {
        jawSl.value = 40;
        jawSl.dispatchEvent(new Event('input', { bubbles: true }));
        jawSl.dispatchEvent(new Event('change', { bubbles: true }));
      }

      const photo = window._devstuA?.current;
      const st = photo?.state;
      return {
        smooth: st?.skin?.smooth,
        ai: st?.skin?.ai,
        teeth: st?.skin?.teeth,
        shapeEyes: st?.shape?.eyes,
        shapeFaceSize: st?.shape?.faceSize,
        shapeJaw: st?.shape?.jaw,
        hasFaces: !!photo?.faces,
        facesCount: photo?.faces?.length || 0
      };
    })()
  `);
  console.log('Retouch State Update Result:', retouchResult);

  // Wait a moment for face model to finish if async
  await new Promise(r => setTimeout(r, 2000));

  const afterAiCheck = await evaluate(`
    (() => {
      const photo = window._devstuA?.current;
      const statusLabel = document.getElementById('stu-ultra-status-label')?.textContent;
      return {
        statusLabel,
        hasFaces: !!photo?.faces,
        facesCount: photo?.faces?.length || 0,
        skinSmooth: photo?.state?.skin?.smooth,
        shapeEyes: photo?.state?.shape?.eyes
      };
    })()
  `);
  console.log('After AI Face Model Check:', afterAiCheck);
  await captureScreenshot('verify_retouch_applied.png');

  console.log('ALL HSL AND RETOUCH CHECKS COMPLETED!');
} catch (err) {
  console.error('Error during verification:', err);
} finally {
  proc.kill();
  process.exit(0);
}
