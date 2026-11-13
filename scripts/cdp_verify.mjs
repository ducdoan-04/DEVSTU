import { spawn } from 'child_process';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9333;

async function testWithCDP() {
  console.log('Spawning Edge headless with debugging port', PORT);
  const edge = spawn(EDGE_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    'http://127.0.0.1:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const res = await fetch(`http://127.0.0.1:${PORT}/json`);
  const targets = await res.json();
  const pageTarget = targets.find(t => t.type === 'page');
  if (!pageTarget) throw new Error('No page target found');

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const resolve = pending.get(data.id);
      pending.delete(data.id);
      resolve(data);
    }
  };

  await new Promise((resolve) => ws.onopen = resolve);

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  await new Promise(r => setTimeout(r, 2500));

  async function takeScreenshot(filename) {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filename, Buffer.from(shot.result.data, 'base64'));
    console.log('Saved screenshot:', filename);
  }

  // 1. Initial screenshot with Presets open
  await takeScreenshot('verify_1_left_presets.png');

  // 2. Click Left History button
  await send('Runtime.evaluate', {
    expression: `document.querySelector('button.left-rail-btn[data-ltab="ltab-history"]')?.click()`
  });
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('verify_2_left_history_empty.png');

  // 3. Click Left Project button
  await send('Runtime.evaluate', {
    expression: `document.querySelector('button.left-rail-btn[data-ltab="ltab-project"]')?.click()`
  });
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('verify_3_left_project.png');

  // 4. Click Left Info button
  await send('Runtime.evaluate', {
    expression: `document.querySelector('button.left-rail-btn[data-ltab="ltab-info"]')?.click()`
  });
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('verify_4_left_info.png');

  // 5. Test close drawer (×)
  await send('Runtime.evaluate', {
    expression: `document.getElementById('btn-close-left')?.click()`
  });
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('verify_5_left_drawer_collapsed.png');

  // 6. Test re-opening drawer by clicking Presets icon
  await send('Runtime.evaluate', {
    expression: `document.querySelector('button.left-rail-btn[data-ltab="ltab-presets"]')?.click()`
  });
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('verify_6_left_drawer_reopened.png');

  // 7. Test switching to "Thư viện ảnh" when photos exist
  // Populate photos like in User Image 10:
  await send('Runtime.evaluate', {
    expression: `
      (function() {
        function makeSampleThumb(color, text) {
          const c = document.createElement('canvas');
          c.width = 320; c.height = 240;
          const ctx = c.getContext('2d');
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, 320, 240);
          ctx.fillStyle = '#ffffff';
          ctx.font = '16px sans-serif';
          ctx.fillText(text, 20, 120);
          return c;
        }

        const pList = [
          {
            id: 'p1',
            name: 'Chan_dung_Ao_do.jpg',
            width: 740,
            height: 740,
            thumb: makeSampleThumb('#7e3838', 'Chan dung Ao do'),
            state: {},
            undo: []
          },
          {
            id: 'p2',
            name: 'Chan_dung_Studio_Neon.jpg',
            width: 493,
            height: 740,
            thumb: makeSampleThumb('#2e4a6a', 'Studio Neon'),
            state: {},
            undo: []
          },
          {
            id: 'p3',
            name: 'Chan_dung_Mua_thu.jpg',
            width: 493,
            height: 740,
            thumb: makeSampleThumb('#7a5f36', 'Mua thu'),
            state: {},
            undo: []
          },
          {
            id: 'p4',
            name: 'Chan_dung_Ngoai_troi_85m....jpg',
            width: 2500,
            height: 3745,
            thumb: makeSampleThumb('#3d6648', 'Ngoai troi 85mm'),
            state: {},
            undo: []
          },
          {
            id: 'p5',
            name: 'IMG_2996.JPG',
            width: 4284,
            height: 5712,
            thumb: makeSampleThumb('#58416d', 'IMG 2996'),
            editedThumb: makeSampleThumb('#58416d', 'IMG 2996'),
            state: {},
            undo: [{ a: 1 }]
          },
          {
            id: 'p6',
            name: 'IMG_3043.JPG',
            width: 4284,
            height: 5712,
            thumb: makeSampleThumb('#8f7832', 'IMG 3043'),
            editedThumb: makeSampleThumb('#8f7832', 'IMG 3043 (Edited)'),
            state: {},
            undo: [{ a: 1 }, { a: 2 }],
            _history: [
              { title: 'Ảnh gốc', sub: 'Nhập ảnh ban đầu', val: '' },
              { title: 'Áp dụng Cài sẵn / Đồng bộ', sub: 'Thay đổi hàng loạt', val: '3 thông số' },
              { title: 'Điều chỉnh tóc', sub: 'Cường độ màu nhuộm', val: '+100' },
              { title: 'Điều chỉnh tóc', sub: 'Cường độ màu nhuộm', val: '+93' },
              { title: 'Điều chỉnh tóc', sub: 'Cường độ màu nhuộm', val: 'Reset' },
              { title: 'Điều chỉnh tóc', sub: 'Cường độ màu nhuộm', val: '+93' },
              { title: 'Điều chỉnh tóc', sub: 'Cường độ màu nhuộm', val: '+97' }
            ]
          }
        ];

        if (window._devstuA) {
          window._devstuA.photos = pList;
          window._devstuA.current = pList[5];
        }

        // Switch to grid mode
        document.getElementById('btn-mode-library')?.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1000));
  await takeScreenshot('verify_7_library_grid_full.png');

  // 8. Collapse drawer while in library grid to match User Image 10 exactly
  await send('Runtime.evaluate', {
    expression: `document.getElementById('btn-close-left')?.click()`
  });
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('verify_8_library_grid_collapsed.png');

  // 9. Click on card IMG_3043.JPG to switch back to Develop mode
  await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('.library-grid-card')[5]?.click()`
  });
  await new Promise(r => setTimeout(r, 1000));
  await takeScreenshot('verify_9_back_to_develop_editor.png');

  // 10. Open History tab for IMG_3043.JPG to verify history list matches User Image 8
  await send('Runtime.evaluate', {
    expression: `document.querySelector('button.left-rail-btn[data-ltab="ltab-history"]')?.click()`
  });
  await new Promise(r => setTimeout(r, 800));
  await takeScreenshot('verify_10_history_with_photo_steps.png');

  ws.close();
  edge.kill();
  console.log('All verification screenshots captured successfully!');
}

testWithCDP().catch(err => {
  console.error('CDP test error:', err);
  process.exit(1);
});
