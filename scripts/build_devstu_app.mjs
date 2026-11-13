import fs from 'fs';
import { execSync } from 'child_process';

const orig = fs.readFileSync('scripts/pristine_app.js', 'utf8');

console.log('Original pristine app size:', orig.length);

// 1. Language fix: ensure Ay(t) calls location.reload() after URL parameter update
const oldAy = 'async function Ay(t){if(await Dbt(t)){Vb();const u=new URL(location.href);u.searchParams.set("lang",t);location.href=u.toString();return!0}return!1}';
const newAy = 'async function Ay(t){if(await Dbt(t)){Vb();const u=new URL(location.href);u.searchParams.set("lang",t);location.href=u.toString();setTimeout(()=>location.reload(),10);return!0}return!1}';

let code = orig.replace(oldAy, newAy);
if (code === orig) {
  throw new Error('Could not find Ay in pristine file');
}
console.log('1. Language fix applied.');

// 2. Add window bridge to oHt
const oHtHookTarget = 'function oHt(){let t={stage:void 0,afterPick:null},e={},n={S:t,A:e},o=document.getElementById("app");';
const oHtHookRepl = `function oHt(){let t={stage:void 0,afterPick:null},e={},n={S:t,A:e},o=document.getElementById("app");
  window._devstuApp = e;
  window._devstuAddFiles = async function(files, select) { return await e.addFiles(files, select !== false); };
  window._devstuA = A;
  window._devstuSelectPhoto = function(id) { A.select(id); };
  window._devstuGetBitmap = _T;`;

if (!code.includes(oHtHookTarget)) {
  throw new Error('Could not find oHt target in pristine file');
}
code = code.replace(oHtHookTarget, oHtHookRepl);
console.log('2. oHt bridge attached.');

// 3. Add phongnen and crop to pl rail tabs array
const plTarget = '{id:"retouch",label:a("tab::Retouch"),icon:D.face},{id:"matna",label:a("Mặt nạ"),icon:D.stack}';
const plRepl = '{id:"retouch",label:a("tab::Retouch"),icon:D.face},{id:"phongnen",label:a("Phông nền"),icon:D.image},{id:"crop",label:a("Cắt & Xoay"),icon:D.crop},{id:"matna",label:a("Mặt nạ"),icon:D.stack}';

if (!code.includes(plTarget)) {
  throw new Error('Could not find plTarget in pristine file');
}
code = code.replace(plTarget, plRepl);
console.log('3. pl tabs added (phongnen, crop).');

// 4. In nxt(t): in Hair card (g.id === "hair"), append createProHairTools(e)
const hairCardTarget = 'g.id==="hair"&&A.current&&b.append(e.hairTools(A.current)),';
const hairCardRepl = 'g.id==="hair"&&A.current&&b.append(e.hairTools(A.current), createProHairTools(e)),';

if (!code.includes(hairCardTarget)) {
  throw new Error('Could not find hairCardTarget in pristine file');
}
code = code.replace(hairCardTarget, hairCardRepl);
console.log('4. createProHairTools hooked into hair card.');

// 5. In rxt(t): mount createCollabsBgTab and createCollabsCropTab inside rebuild
const rebuildMountTarget = 'A.mode==="simple"?t.buildSimple():t.buildFull(),t.applyTabs(),e.append(r)';
const rebuildMountRepl = 'A.mode==="simple"?t.buildSimple():t.buildFull(),(function(){ try { var bg=createCollabsBgTab(t); bg.dataset.mt="phongnen"; e.append(bg); var cr=createCollabsCropTab(t); cr.dataset.mt="crop"; e.append(cr); } catch(err){console.error("Collabs mount error:", err);} })(),t.applyTabs(),e.append(r)';

if (!code.includes(rebuildMountTarget)) {
  throw new Error('Could not find rebuildMountTarget in pristine file');
}
code = code.replace(rebuildMountTarget, rebuildMountRepl);
console.log('5. Collabs tabs mounted inside panel.');

// 6. Rail button click in Qut(): strictly isolate crop & phongnen without rail-jump sliding
const qutClickTarget = 'onclick:()=>{Wu()?it("rail-jump",i.id):i.id===_p&&Dc&&!or()?Ip(!1):as(i.id)}';
const qutClickRepl = 'onclick:()=>{if(i.id==="crop"||i.id==="phongnen"){if(A.mode==="simple")A.setMode("full");as(i.id);return;}if(_p==="crop"||_p==="phongnen"){as(i.id);return;}Wu()?it("rail-jump",i.id):i.id===_p&&Dc&&!or()?Ip(!1):as(i.id)}';

if (!code.includes(qutClickTarget)) {
  throw new Error('Could not find qutClickTarget in pristine file');
}
code = code.replace(qutClickTarget, qutClickRepl);
console.log('6. Qut rail click handler updated for strict tab isolation.');

// 7. Scroll spy M(): prevent sliding to other tabs when on crop or phongnen
const mSpyTarget = 'y=null,k=null,M=()=>{if(!Wu()||A.mode==="simple")return;let x=y??"goiy";if(!y){let S=e.getBoundingClientRect().top+60,w=-1/0;for(let P of pl){let C=P.id==="matna"?null:b(P.id)?.getBoundingClientRect().top;C!=null&&C<=S&&C>w&&(w=C,x=P.id)}}x!==k&&(k=x,it("rail-at",x))};';
const mSpyRepl = 'y=null,k=null,M=()=>{if(!Wu()||A.mode==="simple")return;if(_p==="phongnen"||_p==="crop"){it("rail-at",_p);return;}let x=y??"goiy";if(!y){let S=e.getBoundingClientRect().top+60,w=-1/0;for(let P of pl){if(P.id==="phongnen"||P.id==="crop")continue;let C=P.id==="matna"?null:b(P.id)?.getBoundingClientRect().top;C!=null&&C<=S&&C>w&&(w=C,x=P.id)}}x!==k&&(k=x,it("rail-at",x))};';

if (!code.includes(mSpyTarget)) {
  throw new Error('Could not find mSpyTarget in pristine file');
}
code = code.replace(mSpyTarget, mSpyRepl);
console.log('7. Scroll spy M() patched to prevent unwanted tab drifting.');

// 8. Mount Left Rail and Library Grid View in oHt()
const bodyMountTarget = 'let u=rmt(),m=d("main",{class:"body"},imt(),t.stage.root,u.el,u.panelEdge,l,h);e.body=m;';
const bodyMountRepl = 'let u=rmt(),m=d("main",{class:"body"},createCollabsLeftRail(e),imt(),t.stage.root,createCollabsLibraryGrid(e),u.el,u.panelEdge,l,h);e.body=m;';

if (!code.includes(bodyMountTarget)) {
  throw new Error('Could not find bodyMountTarget in pristine file');
}
code = code.replace(bodyMountTarget, bodyMountRepl);
console.log('8. createCollabsLeftRail and createCollabsLibraryGrid mounted in main.body.');

// 9. Mount Top Header "Thư viện ảnh" / "Tinh chỉnh" in X2t()
const headerMountTarget = 'b=d("header",{class:"hdr"},d("div",{class:"brand"},d("img",{class:"brand-ic",src:"icons/fr-logo-64.png",alt:"",width:"24",height:"24"}),d("b",null,"DEVSTU")),...[M0t()],l,o,d("span",{class:"spacer"})';
const headerMountRepl = 'b=d("header",{class:"hdr"},d("div",{class:"brand"},d("img",{class:"brand-ic",src:"icons/fr-logo-64.png",alt:"",width:"24",height:"24"}),d("b",null,"DEVSTU")),...[M0t()],l,createCollabsModeTabs(),o,d("span",{class:"spacer"})';

if (!code.includes(headerMountTarget)) {
  throw new Error('Could not find headerMountTarget in pristine file');
}
code = code.replace(headerMountTarget, headerMountRepl);
console.log('9. createCollabsModeTabs mounted in header.hdr.');

// 10. Collabs UI functions definition to append before hxt
const collabsHelpersCode = `
// =========================================================================
// COLLABS RETOUCH PRO & LIYING AI EXTENSIONS FOR DEVSTU (PIXEL-PERFECT)
// =========================================================================

function makeSvgNode(w, h, viewBox, innerHtml) {
  var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("width", String(w));
  s.setAttribute("height", String(h));
  s.setAttribute("viewBox", viewBox);
  s.innerHTML = innerHtml;
  return s;
}

var SPARKLE_ICON_FN = function(size) { return makeSvgNode(size || 14, size || 14, "0 0 24 24", '<path fill="currentColor" d="M12 2l2.1 6.2L20.3 10l-6.2 2.1L12 18.3l-2.1-6.2L3.7 10l6.2-1.8L12 2zm7 12l1.1 3.1L23.2 18l-3.1 1.1L19 22.2l-1.1-3.1L14.8 18l3.1-.9L19 14z"/>'); };
var FLIP_H_ICON_FN = function(size) { return makeSvgNode(size || 16, size || 16, "0 0 24 24", '<path fill="none" stroke="currentColor" stroke-width="2" d="M12 2v20M4 18l6-6-6-6v12zm16 0l-6-6 6-6v12z"/>'); };
var FLIP_V_ICON_FN = function(size) { return makeSvgNode(size || 16, size || 16, "0 0 24 24", '<path fill="none" stroke="currentColor" stroke-width="2" d="M2 12h20M18 4l-6 6-6-6h12zm0 16l-6-6-6 6h12z"/>'); };
var ROT_L_ICON_FN = function(size) { return makeSvgNode(size || 16, size || 16, "0 0 24 24", '<path fill="none" stroke="currentColor" stroke-width="2" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path fill="none" stroke="currentColor" stroke-width="2" d="M3 3v5h5"/>'); };
var ROT_R_ICON_FN = function(size) { return makeSvgNode(size || 16, size || 16, "0 0 24 24", '<path fill="none" stroke="currentColor" stroke-width="2" d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path fill="none" stroke="currentColor" stroke-width="2" d="M21 3v5h-5"/>'); };

// State & History Management
function recordCollabsHistory(photo, title, sub, val) {
  try {
    if (!photo) photo = window._devstuA?.current;
    if (!photo) return;
    if (!photo._history) {
      photo._history = [
        { title: 'Ảnh gốc', sub: 'Nhập ảnh ban đầu', val: '', timestamp: Date.now() }
      ];
    }
    photo._history.push({ title: title, sub: sub || '', val: String(val ?? ''), timestamp: Date.now() });
    const dock = document.getElementById('left-dock-container');
    if (dock) renderHistoryList(dock);
  } catch (err) {
    console.warn("recordCollabsHistory error:", err);
  }
}
window.recordCollabsHistory = recordCollabsHistory;

function renderHistoryList(container) {
  try {
    const nameEl = container.querySelector('#history-photo-name');
    const listEl = container.querySelector('#history-list');
    if (!listEl) return;

    const photo = window._devstuA?.current;
    if (!photo) {
      if (nameEl) nameEl.textContent = 'Chưa chọn ảnh';
      listEl.innerHTML = '<div class="history-empty-note">Mở hoặc chọn một ảnh để xem lịch sử chỉnh sửa.</div>';
      return;
    }

    if (nameEl) nameEl.textContent = photo.name || 'Ảnh chưa đặt tên';

    if (!photo._history || photo._history.length === 0) {
      photo._history = [
        { title: 'Ảnh gốc', sub: 'Nhập ảnh ban đầu', val: '', timestamp: Date.now() }
      ];
    }

    listEl.innerHTML = '';

    // Golden AI Studio Banner
    const aiBanner = document.createElement('div');
    aiBanner.className = 'history-ai-card';
    aiBanner.innerHTML = \`
      <div style="background: rgba(232, 185, 49, 0.08); border: 1px solid rgba(232, 185, 49, 0.25); border-radius: 8px; padding: 10px; margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span style="font-size: 11.5px; font-weight: 700; color: #f8d442;">LiYing AI Studio</span>
          <span style="font-size: 10.5px; color: #f8d442;">Hoàn tất</span>
        </div>
        <div style="font-size: 10.5px; color: #aeb5c2; margin-top: 2px;">Tách nền / Cân vai AI</div>
      </div>
    \`;
    listEl.appendChild(aiBanner);

    const items = [...photo._history];
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'history-item' + (i === items.length - 1 ? ' active' : '');

      const titleEl = document.createElement('div');
      titleEl.className = 'history-item-title';
      titleEl.textContent = item.title;
      el.appendChild(titleEl);

      if (item.sub || item.val) {
        const subEl = document.createElement('div');
        subEl.className = 'history-item-sub';
        const paramEl = document.createElement('span');
        paramEl.className = 'history-item-param';
        paramEl.textContent = item.sub || '';
        const valEl = document.createElement('span');
        valEl.className = 'history-item-val';
        valEl.textContent = item.val || '';
        subEl.appendChild(paramEl);
        subEl.appendChild(valEl);
        el.appendChild(subEl);
      }

      listEl.appendChild(el);
    }
  } catch (err) {
    console.warn("renderHistoryList error:", err);
  }
}

function applyCollabsPreset(presetId, title) {
  try {
    const photo = window._devstuA?.current;
    if (!photo) return;
    if (photo.state) {
      if (presetId === 'clean_natural') {
        photo.state.exposure = (photo.state.exposure || 0) + 0.15;
        photo.state.contrast = (photo.state.contrast || 0) + 0.05;
      } else if (presetId === 'high_fashion') {
        photo.state.contrast = (photo.state.contrast || 0) + 0.2;
        photo.state.highlights = (photo.state.highlights || 0) - 0.1;
      } else if (presetId === 'glamour_makeup') {
        photo.state.saturation = (photo.state.saturation || 0) + 0.15;
      } else if (presetId === 'wedding_luminous') {
        photo.state.exposure = (photo.state.exposure || 0) + 0.25;
        photo.state.temp = (photo.state.temp || 0) + 0.08;
      } else if (presetId === 'corporate_exec') {
        photo.state.contrast = (photo.state.contrast || 0) + 0.1;
        photo.state.clarity = (photo.state.clarity || 0) + 0.15;
      } else if (presetId === 'passport_id') {
        photo.state.exposure = (photo.state.exposure || 0) + 0.3;
      } else if (presetId === 'cinematic_film') {
        photo.state.temp = (photo.state.temp || 0) + 0.15;
        photo.state.tint = (photo.state.tint || 0) - 0.1;
      } else if (presetId === 'bw_dramatic') {
        photo.state.saturation = -1.0;
        photo.state.contrast = (photo.state.contrast || 0) + 0.35;
      }
      if (window._devstuA?.emit) window._devstuA.emit('state');
    }
    recordCollabsHistory(photo, 'Áp dụng Cài sẵn / Đồng bộ', title, 'Đã áp dụng');
  } catch (err) {
    console.warn("applyCollabsPreset error:", err);
  }
}

function initLeftRailAndPanel(container) {
  const leftRailBtns = container.querySelectorAll('.left-rail-btn');
  const leftTabs = container.querySelectorAll('.left-tab-content');
  const panel = container.querySelector('.retouch-left-panel');
  const heading = container.querySelector('#left-panel-heading');
  const btnClose = container.querySelector('#btn-close-left');
  const btnClearHist = container.querySelector('#btn-clear-history');
  const btnSavePreset = container.querySelector('#btn-save-user-preset');

  const headingMap = {
    'ltab-presets': 'Cài sẵn',
    'ltab-history': 'Lịch sử',
    'ltab-project': 'Dự án & AI',
    'ltab-info': 'Thông tin & Hướng dẫn'
  };

  function updateActions(tabId) {
    if (btnSavePreset) btnSavePreset.classList.toggle('hidden', tabId !== 'ltab-presets');
    if (btnClearHist) btnClearHist.classList.toggle('hidden', tabId !== 'ltab-history');
  }

  leftRailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.ltab;
      const isAlreadyActive = btn.classList.contains('active');
      const isPanelVisible = !panel.classList.contains('hidden') && panel.style.display !== 'none';

      if (isAlreadyActive && isPanelVisible) {
        panel.classList.add('hidden');
        panel.style.display = 'none';
        btn.classList.remove('active');
        return;
      }

      panel.classList.remove('hidden');
      panel.style.display = 'flex';

      leftRailBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      leftTabs.forEach(t => t.classList.remove('active'));
      const activeTab = container.querySelector('#' + targetId);
      if (activeTab) activeTab.classList.add('active');

      if (heading) heading.textContent = headingMap[targetId] || 'Bảng điều khiển';
      updateActions(targetId);

      if (targetId === 'ltab-history') {
        renderHistoryList(container);
      }
    });
  });

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      panel.classList.add('hidden');
      panel.style.display = 'none';
      leftRailBtns.forEach(b => b.classList.remove('active'));
    });
  }

  if (btnClearHist) {
    btnClearHist.addEventListener('click', () => {
      const cur = window._devstuA?.current;
      if (cur) {
        cur._history = [
          { title: 'Ảnh gốc', sub: 'Nhập ảnh ban đầu', val: '', timestamp: Date.now() }
        ];
        renderHistoryList(container);
      }
    });
  }

  if (btnSavePreset) {
    btnSavePreset.addEventListener('click', () => {
      const name = prompt('Nhập tên Cài sẵn mới:', 'Cài sẵn của tôi ' + (new Date().toLocaleTimeString()));
      if (!name) return;
      const wrap = container.querySelector('#user-presets-container');
      if (wrap) {
        const item = document.createElement('button');
        item.className = 'retouch-preset-item active';
        item.innerHTML = \`
          <span class="preset-thumb preset-thumb--user_custom" aria-hidden="true"></span>
          <span class="preset-badge">TÔI</span>
          <div class="preset-meta">
            <div class="p-title">\${name}</div>
            <div class="p-sub">Cài sẵn tùy chỉnh cá nhân</div>
          </div>
        \`;
        item.onclick = () => {
          container.querySelectorAll('.retouch-preset-item').forEach(b => b.classList.remove('active'));
          item.classList.add('active');
          applyCollabsPreset('custom', name);
        };
        wrap.prepend(item);
      }
    });
  }

  const btnImportSide = container.querySelector('#btn-import-side');
  if (btnImportSide) {
    btnImportSide.addEventListener('click', () => {
      if (typeof it === 'function') {
        it('open-dialog', 'add-photos');
      } else {
        document.querySelector('.strip button.add')?.click();
      }
    });
  }

  // Scope filter tabs
  const scopeBtns = container.querySelectorAll('.preset-scope-btn');
  scopeBtns.forEach(sb => {
    sb.addEventListener('click', () => {
      scopeBtns.forEach(b => b.classList.remove('active'));
      sb.classList.add('active');
      const scope = sb.dataset.scope;
      const rec = container.querySelector('#recommended-presets-wrap');
      const mine = container.querySelector('#user-presets-wrap');
      if (scope === 'all') {
        if (rec) rec.style.display = 'flex';
        if (mine) mine.style.display = 'flex';
      } else if (scope === 'recommended') {
        if (rec) rec.style.display = 'flex';
        if (mine) mine.style.display = 'none';
      } else if (scope === 'mine') {
        if (rec) rec.style.display = 'none';
        if (mine) mine.style.display = 'flex';
      }
    });
  });

  // Search input
  const presetSearch = container.querySelector('#preset-search');
  if (presetSearch) {
    presetSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      container.querySelectorAll('.retouch-preset-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = (!q || text.includes(q)) ? '' : 'none';
      });
    });
  }

  // Preset click
  container.querySelectorAll('.retouch-preset-item[data-preset]').forEach(item => {
    item.addEventListener('click', () => {
      container.querySelectorAll('.retouch-preset-item').forEach(b => b.classList.remove('active'));
      item.classList.add('active');
      const presetId = item.dataset.preset;
      applyCollabsPreset(presetId, item.querySelector('.p-title')?.textContent || presetId);
    });
  });
}

function createCollabsLeftRail(app) {
  const dock = document.createElement('div');
  dock.id = 'left-dock-container';
  dock.className = 'left-dock-container';

  const nav = document.createElement('nav');
  nav.className = 'left-icon-rail';
  nav.setAttribute('aria-label', 'Bảng bên trái');

  const btnPresets = document.createElement('button');
  btnPresets.type = 'button';
  btnPresets.className = 'left-rail-btn active';
  btnPresets.dataset.ltab = 'ltab-presets';
  btnPresets.title = 'Cài sẵn (Preset)';
  btnPresets.appendChild(makeSvgNode(17, 17, '0 0 24 24', '<path fill="none" stroke="currentColor" stroke-width="1.9" d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>'));

  const btnHistory = document.createElement('button');
  btnHistory.type = 'button';
  btnHistory.className = 'left-rail-btn';
  btnHistory.dataset.ltab = 'ltab-history';
  btnHistory.title = 'Lịch sử chỉnh sửa';
  btnHistory.appendChild(makeSvgNode(17, 17, '0 0 24 24', '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.9"/><polyline points="12 7 12 12 15.5 14" fill="none" stroke="currentColor" stroke-width="1.9"/>'));

  const btnProject = document.createElement('button');
  btnProject.type = 'button';
  btnProject.className = 'left-rail-btn';
  btnProject.dataset.ltab = 'ltab-project';
  btnProject.title = 'Dự án & Hồ sơ AI';
  btnProject.appendChild(makeSvgNode(17, 17, '0 0 24 24', '<path fill="none" stroke="currentColor" stroke-width="1.9" d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>'));

  const btnInfo = document.createElement('button');
  btnInfo.type = 'button';
  btnInfo.className = 'left-rail-btn';
  btnInfo.dataset.ltab = 'ltab-info';
  btnInfo.title = 'Thông tin phần mềm & Hướng dẫn cơ bản';
  btnInfo.appendChild(makeSvgNode(17, 17, '0 0 24 24', '<path fill="none" stroke="currentColor" stroke-width="1.9" d="M12 7v14m0-14C10.5 5.5 8.5 5 5 5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2c3.5 0 5.5.5 7 2m0-15c1.5-1.5 3.5-2 7-2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2c-3.5 0-5.5.5-7 2"/>'));

  nav.appendChild(btnPresets);
  nav.appendChild(btnHistory);
  nav.appendChild(btnProject);
  nav.appendChild(btnInfo);
  dock.appendChild(nav);

  const aside = document.createElement('aside');
  aside.id = 'left-floating-panel';
  aside.className = 'retouch-left-panel';

  const header = document.createElement('div');
  header.className = 'left-floating-header';
  const heading = document.createElement('span');
  heading.id = 'left-panel-heading';
  heading.textContent = 'Cài sẵn';

  const actions = document.createElement('div');
  actions.className = 'left-floating-actions';

  const btnSavePreset = document.createElement('button');
  btnSavePreset.id = 'btn-save-user-preset';
  btnSavePreset.className = 'icon-tiny-btn';
  btnSavePreset.title = 'Lưu bộ thông số hiện tại thành Cài sẵn của tôi';
  btnSavePreset.textContent = '+';

  const btnClearHist = document.createElement('button');
  btnClearHist.id = 'btn-clear-history';
  btnClearHist.className = 'icon-tiny-btn hidden';
  btnClearHist.title = 'Xóa danh sách lịch sử chỉnh sửa';
  btnClearHist.appendChild(makeSvgNode(14, 14, '0 0 24 24', '<path fill="none" stroke="currentColor" stroke-width="1.8" d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>'));

  const btnClose = document.createElement('button');
  btnClose.id = 'btn-close-left';
  btnClose.className = 'icon-tiny-btn';
  btnClose.title = 'Thu gọn bảng bên trái';
  btnClose.textContent = '×';

  actions.appendChild(btnSavePreset);
  actions.appendChild(btnClearHist);
  actions.appendChild(btnClose);
  header.appendChild(heading);
  header.appendChild(actions);
  aside.appendChild(header);

  // Tab 1: Cài sẵn
  const tabPresets = document.createElement('div');
  tabPresets.id = 'ltab-presets';
  tabPresets.className = 'left-tab-content active';
  tabPresets.innerHTML = \`
    <div class="evoto-pill-switch" id="preset-scope-tabs">
      <button type="button" class="preset-scope-btn active" data-scope="all">Tất cả</button>
      <button type="button" class="preset-scope-btn" data-scope="recommended">Đề xuất</button>
      <button type="button" class="preset-scope-btn" data-scope="mine">Của tôi</button>
    </div>
    <div class="preset-search-box">
      <svg class="preset-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="7"/>
        <path d="m20 20-3.5-3.5"/>
      </svg>
      <input id="preset-search" type="text" placeholder="Tất cả Cài Sẵn..." />
    </div>
    <div id="recommended-presets-wrap" class="preset-scroll-inner">
      <div class="preset-category">
        <div class="preset-cat-header">▾ Chân dung &amp; Làm đẹp</div>
        <div class="preset-grid-2col">
          <button class="retouch-preset-item" data-preset="clean_natural" title="Giữ lỗ chân lông + sáng mắt nhẹ">
            <span class="preset-thumb preset-thumb--clean_natural" aria-hidden="true"></span>
            <span class="preset-badge">AI</span>
            <div class="preset-meta">
              <div class="p-title">Chân dung tự nhiên</div>
              <div class="p-sub">Giữ lỗ chân lông + sáng mắt nhẹ</div>
            </div>
          </button>
          <button class="retouch-preset-item" data-preset="high_fashion" title="Tách tần số + tạo khối 3D">
            <span class="preset-thumb preset-thumb--high_fashion" aria-hidden="true"></span>
            <span class="preset-badge">PRO</span>
            <div class="preset-meta">
              <div class="p-title">Da tạp chí cao cấp</div>
              <div class="p-sub">Tách tần số + tạo khối 3D</div>
            </div>
          </button>
          <button class="retouch-preset-item" data-preset="glamour_makeup" title="Má hồng + tạo khối + son berry">
            <span class="preset-thumb preset-thumb--glamour_makeup" aria-hidden="true"></span>
            <span class="preset-badge">AI</span>
            <div class="preset-meta">
              <div class="p-title">Trang điểm &amp; Rạng rỡ</div>
              <div class="p-sub">Má hồng + tạo khối + son berry</div>
            </div>
          </button>
          <button class="retouch-preset-item" data-preset="wedding_luminous" title="Da ấm dịu + làm trắng răng">
            <span class="preset-thumb preset-thumb--wedding_luminous" aria-hidden="true"></span>
            <span class="preset-badge">AI</span>
            <div class="preset-meta">
              <div class="p-title">Ảnh cưới sáng trong</div>
              <div class="p-sub">Da ấm dịu + làm trắng răng</div>
            </div>
          </button>
        </div>
      </div>
      <div class="preset-category">
        <div class="preset-cat-header">▾ Studio &amp; Nghệ thuật</div>
        <div class="preset-grid-2col">
          <button class="retouch-preset-item" data-preset="corporate_exec" title="Giảm quầng thâm + bóng dầu + phẳng áo">
            <span class="preset-thumb preset-thumb--corporate_exec" aria-hidden="true"></span>
            <span class="preset-badge">PRO</span>
            <div class="preset-meta">
              <div class="p-title">Doanh nhân chuyên nghiệp</div>
              <div class="p-sub">Giảm quầng thâm + bóng dầu + phẳng áo</div>
            </div>
          </button>
          <button class="retouch-preset-item" data-preset="passport_id" title="Nền trắng sạch + xóa tóc con">
            <span class="preset-thumb preset-thumb--passport_id" aria-hidden="true"></span>
            <span class="preset-badge">THẺ</span>
            <div class="preset-meta">
              <div class="p-title">Ảnh thẻ nền trắng</div>
              <div class="p-sub">Nền trắng sạch + xóa tóc con</div>
            </div>
          </button>
          <button class="retouch-preset-item" data-preset="cinematic_film" title="Phân màu phim + xóa phông bokeh">
            <span class="preset-thumb preset-thumb--cinematic_film" aria-hidden="true"></span>
            <span class="preset-badge">LUT</span>
            <div class="preset-meta">
              <div class="p-title">Phim điện ảnh Teal &amp; Cam</div>
              <div class="p-sub">Phân màu phim + xóa phông bokeh</div>
            </div>
          </button>
          <button class="retouch-preset-item" data-preset="bw_dramatic" title="Tương phản cao + hạt phim mịn">
            <span class="preset-thumb preset-thumb--bw_dramatic" aria-hidden="true"></span>
            <span class="preset-badge">Đ&amp;T</span>
            <div class="preset-meta">
              <div class="p-title">Studio Đen Trắng</div>
              <div class="p-sub">Tương phản cao + hạt phim mịn</div>
            </div>
          </button>
        </div>
      </div>
    </div>
    <div id="user-presets-wrap" class="preset-category">
      <div class="preset-cat-header"><span>▾ Cài sẵn của tôi</span></div>
      <div id="user-presets-container" class="preset-grid-2col"></div>
    </div>
  \`;
  aside.appendChild(tabPresets);

  // Tab 2: Lịch sử
  const tabHistory = document.createElement('div');
  tabHistory.id = 'ltab-history';
  tabHistory.className = 'left-tab-content';
  tabHistory.innerHTML = \`
    <div class="history-photo-bar">
      <svg class="history-photo-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="m21 15-4.5-4.5a2 2 0 0 0-2.82 0L6 18" />
      </svg>
      <span id="history-photo-name" class="history-photo-name">Chưa chọn ảnh</span>
    </div>
    <div id="history-list" class="history-list">
      <div class="history-empty-note">Mở hoặc chọn một ảnh để xem lịch sử chỉnh sửa.</div>
    </div>
  \`;
  aside.appendChild(tabHistory);

  // Tab 3: Dự án & AI
  const tabProject = document.createElement('div');
  tabProject.id = 'ltab-project';
  tabProject.className = 'left-tab-content';
  tabProject.innerHTML = \`
    <div class="project-box">
      <button id="btn-import-side" class="retouch-btn-import full-w" style="justify-content: center; margin-bottom: 10px">
        + Nhập ảnh &amp; RAW từ máy
      </button>
      <div class="face-card">
        <div class="face-card-title">Hồ sơ nhận diện AI cục bộ</div>
        <div class="face-tag-row">
          <span class="face-pill active">478 điểm mặt + Tách nền 6 lớp AI</span>
        </div>
        <p class="face-help">
          Mẹo: Nhấn biểu tượng Khuôn mặt trên thanh công cụ để xem lưới 478 điểm và kéo chỉnh trực tiếp mắt, mũi, miệng nếu cần.
        </p>
      </div>
      <div class="face-card" style="margin-top: 8px">
        <div class="face-card-title">Định dạng hỗ trợ 100% Offline</div>
        <p class="face-help">
          Hỗ trợ đọc trực tiếp Camera RAW (CR2, CR3, NEF, ARW, DNG, ORF, RW2, RAF, PEF), JPG, PNG, WebP, TIFF và xuất độ phân giải gốc qua Rust SIMD.
        </p>
      </div>
    </div>
  \`;
  aside.appendChild(tabProject);

  // Tab 4: Thông tin & Hướng dẫn
  const tabInfo = document.createElement('div');
  tabInfo.id = 'ltab-info';
  tabInfo.className = 'left-tab-content';
  tabInfo.innerHTML = \`
    <div class="project-box">
      <div class="face-card">
        <div class="face-card-title">DEVSTU Retouch Studio Pro</div>
        <div class="face-tag-row">
          <span class="face-pill active">Offline AI + Rust SIMD</span>
        </div>
        <div class="info-meta-list">
          <div class="info-meta-row">
            <span class="info-meta-label">Author:</span>
            <span class="info-meta-value">ducdoan-04</span>
          </div>
          <div class="info-meta-row">
            <span class="info-meta-label">Email:</span>
            <span class="info-meta-value">ducdoan04.work@gmail.com</span>
          </div>
          <div class="info-meta-row">
            <span class="info-meta-label">Phone:</span>
            <span class="info-meta-value">_ _ _</span>
          </div>
          <div class="info-meta-row">
            <span class="info-meta-label">Address:</span>
            <span class="info-meta-value">Da Nang, Viet Nam.</span>
          </div>
        </div>
      </div>
      <div class="face-card">
        <div class="face-card-title">Hướng dẫn sử dụng cơ bản</div>
        <ol class="guide-step-list">
          <li><strong>Nhập ảnh:</strong> Kéo thả ảnh hoặc RAW trực tiếp vào cửa sổ làm việc.</li>
          <li><strong>Thư viện ảnh:</strong> Bấm tab trên cùng để xem toàn bộ ảnh dạng lưới (Phím G).</li>
          <li><strong>Tinh chỉnh:</strong> Chọn ảnh để chỉnh màu, da, dáng, tóc, phông nền (Phím D).</li>
          <li><strong>Áp dụng cài sẵn:</strong> Chọn preset đẹp mắt ở ngăn Cài sẵn bên trái.</li>
          <li><strong>Xuất ảnh:</strong> Bấm nút Lưu ảnh hoặc Ctrl + S để xuất ảnh chất lượng cao.</li>
        </ol>
      </div>
    </div>
  \`;
  aside.appendChild(tabInfo);
  dock.appendChild(aside);

  initLeftRailAndPanel(dock);
  return dock;
}

// Workspace Mode & Library Grid
function setWorkspaceMode(mode) {
  try {
    window._devstuWorkspaceMode = mode;
    const isGrid = (mode === 'grid');

    const btnLib = document.getElementById('btn-mode-library');
    const btnDev = document.getElementById('btn-mode-develop');
    const gridView = document.getElementById('library-grid-view');
    const stageEl = document.querySelector('.stage') || (window._devstuApp?.S?.stage?.root);
    const panelEl = document.querySelector('.panel') || (window._devstuApp?.panel);
    const stripEl = document.querySelector('.strip') || (window._devstuApp?.strip);
    const psDock = document.querySelector('.ps-dock');
    const psTools = document.querySelector('.ps-tools');
    const emptyEl = document.querySelector('.empty') || (window._devstuApp?.empty);
    const dropCard = document.querySelector('.drop-card');

    if (btnLib) btnLib.classList.toggle('active', isGrid);
    if (btnDev) btnDev.classList.toggle('active', !isGrid);

    if (emptyEl) emptyEl.style.display = isGrid ? 'none' : '';
    if (dropCard) dropCard.style.display = isGrid ? 'none' : '';

    if (gridView) {
      if (isGrid) {
        gridView.classList.remove('hidden');
        gridView.style.display = 'grid';
        renderLibraryGrid();
      } else {
        gridView.classList.add('hidden');
        gridView.style.display = 'none';
      }
    }

    if (stageEl) stageEl.style.display = isGrid ? 'none' : '';
    if (panelEl) panelEl.style.display = isGrid ? 'none' : '';
    if (stripEl) stripEl.style.display = isGrid ? 'none' : '';
    if (psDock) psDock.style.display = isGrid ? 'none' : '';
    if (psTools) psTools.style.display = isGrid ? 'none' : '';
  } catch (err) {
    console.warn("setWorkspaceMode error:", err);
  }
}
window.setWorkspaceMode = setWorkspaceMode;

function renderLibraryGrid() {
  try {
    const gridView = document.getElementById('library-grid-view');
    if (!gridView) return;
    gridView.innerHTML = '';

    const photos = window._devstuA?.photos || [];
    const currentPhoto = window._devstuA?.current;

    if (photos.length === 0) {
      gridView.innerHTML = \`
        <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; color: #8b92a0; gap: 14px;">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" style="opacity: 0.35;">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <div style="font-size: 15px; font-weight: 600; color: #dfe4ed;">Thư viện ảnh trống</div>
          <div style="font-size: 12px; color: #6e7481; max-width: 320px; text-align: center;">Chưa có ảnh nào trong dự án. Bấm nút dưới để thêm ảnh hoặc RAW từ máy tính.</div>
          <button type="button" class="retouch-btn-import" onclick="typeof it==='function'?it('open-dialog','add-photos'):document.querySelector('.strip button.add')?.click()" style="margin-top: 4px; padding: 6px 16px; height: 34px;">
            + Thêm ảnh vào thư viện
          </button>
        </div>
      \`;
      return;
    }

    photos.forEach((p, idx) => {
      const card = document.createElement('div');
      const isActive = (currentPhoto && currentPhoto.id === p.id);
      card.className = 'library-grid-card' + (isActive ? ' active' : '');

      const media = document.createElement('div');
      media.className = 'library-card-media';

      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;

      const thumb = p.editedThumb || p.thumb;
      if (thumb && thumb.width && thumb.height) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const scale = Math.max(320 / thumb.width, 240 / thumb.height);
          const sw = Math.round(thumb.width * scale);
          const sh = Math.round(thumb.height * scale);
          const sx = Math.round((320 - sw) / 2);
          const sy = Math.round((240 - sh) / 2);
          try {
            ctx.drawImage(thumb, 0, 0, thumb.width, thumb.height, sx, sy, sw, sh);
          } catch(err) {
            // fallback
          }
        }
      }
      media.appendChild(canvas);

      const isEdited = Boolean(p.editedThumb || (p.undo && p.undo.length > 0) || (p._history && p._history.length > 1));
      if (isEdited) {
        const badge = document.createElement('span');
        badge.className = 'library-edited-badge';
        badge.textContent = 'Đã chỉnh';
        media.appendChild(badge);
      }

      const meta = document.createElement('div');
      meta.className = 'library-card-meta';

      const nameEl = document.createElement('div');
      nameEl.className = 'library-card-name';
      nameEl.title = p.name || 'Ảnh chưa đặt tên';
      nameEl.textContent = p.name || 'Ảnh chưa đặt tên';

      const dimEl = document.createElement('div');
      dimEl.className = 'library-card-dim';
      const pw = p.width || p.meta?.width || (thumb ? thumb.width : 0);
      const ph = p.height || p.meta?.height || (thumb ? thumb.height : 0);
      dimEl.textContent = (pw && ph) ? \`\${pw} × \${ph} px\` : '';

      meta.appendChild(nameEl);
      meta.appendChild(dimEl);

      card.appendChild(media);
      card.appendChild(meta);

      card.addEventListener('click', () => {
        if (window._devstuA) {
          window._devstuA.select(p.id);
        }
        setWorkspaceMode('develop');
      });

      gridView.appendChild(card);
    });
  } catch (err) {
    console.warn("renderLibraryGrid error:", err);
  }
}
window.renderLibraryGrid = renderLibraryGrid;

function createCollabsLibraryGrid(app) {
  const grid = document.createElement('div');
  grid.id = 'library-grid-view';
  grid.className = 'library-grid-view hidden';
  grid.style.display = 'none';
  return grid;
}

function createCollabsModeTabs() {
  const wrap = document.createElement('div');
  wrap.className = 'evoto-mode-tabs';

  const btnLib = document.createElement('button');
  btnLib.id = 'btn-mode-library';
  btnLib.className = 'evoto-mode-tab';
  btnLib.type = 'button';
  btnLib.title = 'Xem lưới toàn bộ ảnh trong dự án (Phím G)';
  btnLib.textContent = 'Thư viện ảnh';
  btnLib.onclick = () => setWorkspaceMode('grid');

  const btnDev = document.createElement('button');
  btnDev.id = 'btn-mode-develop';
  btnDev.className = 'evoto-mode-tab active';
  btnDev.type = 'button';
  btnDev.title = 'Không gian Tinh chỉnh ảnh chi tiết (Phím D)';
  btnDev.textContent = 'Tinh chỉnh';
  btnDev.onclick = () => setWorkspaceMode('develop');

  wrap.appendChild(btnLib);
  wrap.appendChild(btnDev);

  // Global keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'g' || e.key === 'G') {
      setWorkspaceMode('grid');
    } else if (e.key === 'd' || e.key === 'D') {
      setWorkspaceMode('develop');
    }
  });

  return wrap;
}

// Hook into A.on for reactive updates
setTimeout(() => {
  if (window._devstuA) {
    window._devstuA.on(evt => {
      if (evt === 'photos' || evt === 'current' || evt === 'state') {
        if (window._devstuWorkspaceMode === 'grid') {
          renderLibraryGrid();
        }
        const dock = document.getElementById('left-dock-container');
        if (dock) {
          const nameEl = dock.querySelector('#history-photo-name');
          if (nameEl) nameEl.textContent = window._devstuA?.current?.name || 'Chưa chọn ảnh';
          const tabHist = dock.querySelector('#ltab-history');
          if (tabHist && tabHist.classList.contains('active')) {
            renderHistoryList(dock);
          }
        }
      }
    });
  }
}, 500);
`;

// Insert collabsHelpersCode right before function hxt()
const hxtIdx = code.indexOf('function hxt(');
if (hxtIdx === -1) {
  throw new Error('Could not find function hxt(');
}

code = code.slice(0, hxtIdx) + collabsHelpersCode + '\n' + code.slice(hxtIdx);
console.log('10. Collabs helper functions inserted before hxt.');

// Save new app file
fs.writeFileSync('assets/app-7UAGS7H2.js', code, 'utf8');
console.log('11. Saved assets/app-7UAGS7H2.js successfully. Final size:', code.length);

// Verify syntax
execSync('node -c assets/app-7UAGS7H2.js', { stdio: 'inherit' });
console.log('12. Syntax check passed 100%!');
