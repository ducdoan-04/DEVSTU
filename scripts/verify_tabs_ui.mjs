import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tmpDir = 'C:\\Users\\user\\AppData\\Local\\Temp\\edge_debug_tmp_tabs';

const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=' + tmpDir,
  '--window-size=1400,900',
  'http://127.0.0.1:3000'
]);

await new Promise(r => setTimeout(r, 2000));

try {
  const targetsRes = await fetch('http://127.0.0.1:9222/json');
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

  console.log('Waiting for page mount...');
  await new Promise(r => setTimeout(r, 2000));

  // Load a test photo
  const testImgPath = 'F:\\Workspace\\Code projects\\LiYing-master\\images\\test1.jpg';
  let testImgB64 = '';
  if (fs.existsSync(testImgPath)) {
    testImgB64 = 'data:image/jpeg;base64,' + fs.readFileSync(testImgPath).toString('base64');
  }

  console.log('Loading test portrait photo into DEVSTU...');
  await evaluate(`
    (async () => {
      if ("${testImgB64}") {
        const res = await fetch("${testImgB64}");
        const blob = await res.blob();
        const file = new File([blob], "Chan_dung_Test.jpg", { type: "image/jpeg" });
        if (window._devstuAddFiles) {
          await window._devstuAddFiles([file], true);
        }
      }
      if (window._devstuA) {
        window._devstuA.setMode("full");
      }
    })()
  `);

  await new Promise(r => setTimeout(r, 2000));

  // 1. Test Tab: Cắt & Xoay (Crop & Rotate)
  console.log('Switching to Tab: Cắt & Xoay...');
  const cropCheck = await evaluate(`
    (() => {
      // Find button for crop tab
      const railBtns = Array.from(document.querySelectorAll('.rail-icon-btn, .rail button, nav button, [data-mt]'));
      const cropBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cắt') || b.getAttribute('title')?.includes('Cắt') || b.getAttribute('data-mt') === 'crop');
      if (cropBtn) cropBtn.click();

      // Check crop panel
      const cropTab = document.querySelector('.collabs-crop-tab');
      if (!cropTab) return { error: 'No .collabs-crop-tab found' };

      const histShell = cropTab.querySelector('.hist-card-shell');
      const histHead = cropTab.querySelector('.hist-collapse-head');
      const realtimeRow = cropTab.querySelector('.evoto-realtime-row');
      const realtimeSwitch = realtimeRow?.querySelector('.evoto-switch');
      const modeTabs = cropTab.querySelector('.crop-mode-tabs');
      const ratioBtn = cropTab.querySelector('.crop-ratio-btn');
      const readout = cropTab.querySelector('.crop-box-readout');
      const applyResetRow = cropTab.querySelector('.crop-apply-reset-row');
      const checkRow = cropTab.querySelector('.crop-check-row');
      const aiSection = cropTab.querySelector('.crop-ai-section');
      const aiPills = cropTab.querySelectorAll('.crop-pill-action-btn');
      const rotIcons = cropTab.querySelector('.crop-rotate-icons');
      const sHead = cropTab.querySelector('.s-head');
      const footer = cropTab.querySelector('.inspector-footer');

      return {
        hasHistHead: !!histHead,
        histHeadText: histHead?.textContent?.trim(),
        hasHistShell: !!histShell,
        hasRealtimeSwitch: !!realtimeSwitch,
        hasRealtimeSwitchOn: realtimeSwitch?.classList.contains('on'),
        hasModeTabs: !!modeTabs,
        hasRatioBtn: !!ratioBtn,
        readoutText: readout?.textContent?.trim(),
        hasApplyResetRow: !!applyResetRow,
        hasCheckRow: !!checkRow,
        hasAiSection: !!aiSection,
        aiPillsCount: aiPills.length,
        hasRotIcons: !!rotIcons,
        rotIconsCount: rotIcons?.children?.length,
        hasSHead: !!sHead,
        sHeadText: sHead?.textContent?.trim(),
        hasFooter: !!footer,
        footerPillsCount: footer?.querySelectorAll('.evoto-footer-pill')?.length
      };
    })()
  `);

  console.log('Crop Tab Inspection Results:\n', JSON.stringify(cropCheck, null, 2));

  await captureScreenshot('scripts/screenshot_crop_tab.png');

  // 2. Test Tab: Phông nền (Background)
  console.log('Switching to Tab: Phông nền...');
  const bgCheck = await evaluate(`
    (() => {
      const bgBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Phông nền') || b.getAttribute('title')?.includes('Phông nền') || b.getAttribute('data-mt') === 'phongnen');
      if (bgBtn) bgBtn.click();

      const bgTab = document.querySelector('.collabs-bg-tab');
      if (!bgTab) return { error: 'No .collabs-bg-tab found' };

      const subheads = Array.from(bgTab.querySelectorAll('.bg-subhead')).map(s => s.textContent.trim());
      const toggleRows = bgTab.querySelectorAll('.crop-toggle-row');
      const switches = bgTab.querySelectorAll('.evoto-switch');
      const sHeads = Array.from(bgTab.querySelectorAll('.s-head')).map(s => s.textContent.trim());
      const liyingCard = bgTab.querySelector('.liying-bg-card');
      const chips = bgTab.querySelectorAll('.liying-color-chip');
      const liyingActions = bgTab.querySelectorAll('.liying-actions-row button');
      const typeTabs = bgTab.querySelector('.bg-type-tabs');
      const libTabsRow = bgTab.querySelector('.bg-lib-tabs-row');
      const footer = bgTab.querySelector('.inspector-footer');

      return {
        subheads,
        toggleRowsCount: toggleRows.length,
        switchesCount: switches.length,
        sHeads,
        hasLiyingCard: !!liyingCard,
        chipsCount: chips.length,
        liyingActionsCount: liyingActions.length,
        hasTypeTabs: !!typeTabs,
        hasLibTabsRow: !!libTabsRow,
        hasFooter: !!footer
      };
    })()
  `);

  console.log('Background Tab Inspection Results:\n', JSON.stringify(bgCheck, null, 2));

  await captureScreenshot('scripts/screenshot_bg_tab.png');

  // Check for any raw SVG code leaking into text
  const svgLeak = await evaluate(`
    (() => {
      const allText = document.body.innerText;
      const leaks = [];
      if (allText.includes('<svg') || allText.includes('viewBox=') || allText.includes('</svg>')) {
        leaks.push('SVG text leak detected in DOM innerText!');
      }
      return leaks;
    })()
  `);
  console.log('SVG Leak Check:', svgLeak);

} catch (err) {
  console.error('Inspection failed:', err);
} finally {
  proc.kill();
  console.log('Edge process stopped.');
}
