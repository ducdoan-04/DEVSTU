import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tmpDir = 'C:\\Users\\user\\AppData\\Local\\Temp\\edge_debug_inspect_photo_2';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9230',
  '--user-data-dir=' + tmpDir,
  '--window-size=1440,900',
  'http://127.0.0.1:3000'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const targetsRes = await fetch('http://127.0.0.1:9230/json');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('3000'));
  const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);

  await new Promise(resolve => {
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
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

  await new Promise(r => setTimeout(r, 1500));

  // Load sample portrait
  const samplePath = 'public/samples/portrait_1.jpg';
  const imgB64 = 'data:image/jpeg;base64,' + fs.readFileSync(samplePath).toString('base64');

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

  await new Promise(r => setTimeout(r, 3000));

  // Test calling _devstuLt
  const faceResult = await evaluate(`
    (async () => {
      const photo = window._devstuA?.current;
      if (!photo) return { error: 'No photo' };
      if (!window._devstuLt) return { error: 'No _devstuLt' };
      const faces = await window._devstuLt(photo, true);
      return {
        facesDetected: Array.isArray(faces),
        facesCount: faces?.length || 0,
        photoFacesCount: photo.faces?.length || 0,
        box: faces?.[0]?.box,
        ptsCount: faces?.[0]?.pts?.length
      };
    })()
  `);
  console.log('Face Detection Result:', JSON.stringify(faceResult, null, 2));

  // Test updating HSL (e.g. Red Saturation = -100) and Skin Smooth = 80
  const stateUpdateResult = await evaluate(`
    (() => {
      const photo = window._devstuA?.current;
      if (!photo) return { error: 'No photo' };
      
      // Update HSL Red
      photo.state.hsl.s0 = -100;
      photo.state.skin.smooth = 80;
      photo.state.shape.eyes = 50;

      window._devstuA.emit("state");
      if (window._devstuStage?.requestRender) {
        window._devstuStage.requestRender();
      }

      return {
        smooth: photo.state.skin.smooth,
        redSat: photo.state.hsl.s0,
        eyes: photo.state.shape.eyes
      };
    })()
  `);
  console.log('State Update Result:', JSON.stringify(stateUpdateResult, null, 2));

} catch (err) {
  console.error(err);
} finally {
  proc.kill();
  process.exit(0);
}
