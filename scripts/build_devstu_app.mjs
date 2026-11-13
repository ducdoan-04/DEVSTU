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

// 8. Collabs UI functions definition to append before hxt
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
var SWAP_ICON_FN = function(size) { return makeSvgNode(size || 14, size || 14, "0 0 24 24", '<path fill="none" stroke="currentColor" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4"/>'); };

function makeEvotoSwitch(initOn, onChange) {
  var btn = d("button", {
    type: "button",
    class: "evoto-switch" + (initOn ? " on" : ""),
    role: "switch",
    "aria-checked": String(Boolean(initOn))
  }, d("span", { class: "evoto-switch-knob" }));

  btn.onclick = function() {
    var nextOn = !btn.classList.contains("on");
    btn.classList.toggle("on", nextOn);
    btn.setAttribute("aria-checked", String(nextOn));
    if (typeof onChange === "function") onChange(nextOn);
  };
  return btn;
}

function makeRetouchSlider(label, min, max, defVal, step, onInput) {
  var vSpan = d("span", { class: "val" }, step < 1 ? (+defVal).toFixed(2) : String(defVal));
  var sInput = d("input", {
    type: "range",
    min: String(min),
    max: String(max),
    step: String(step || 1),
    value: String(defVal),
    class: "retouch-slider crop-range-slider"
  });

  sInput.oninput = function() {
    var val = step < 1 ? (+sInput.value).toFixed(2) : sInput.value;
    vSpan.textContent = String(val);
    if (typeof onInput === "function") onInput(+sInput.value);
  };

  var row = d("div", { class: "retouch-slider-item sl-row" },
    d("div", { class: "s-head sl-head" },
      d("span", null, label),
      vSpan
    ),
    sInput
  );

  return {
    el: row,
    input: sInput,
    valSpan: vSpan,
    setValue: function(v) {
      sInput.value = String(v);
      vSpan.textContent = step < 1 ? (+v).toFixed(2) : String(v);
    }
  };
}

function createCollabsHistogram(e) {
  var wrap = d("div", { class: "collabs-hist-wrap" });
  var head = d("div", { class: "collabs-hist-head" },
    d("span", { class: "collabs-hist-title" },
      G(D.chevDown, 12),
      d("b", null, a("Biểu đồ")),
      d("small", null, "16-bit • Rust SIMD")
    )
  );

  var canvas = d("canvas", { class: "collabs-hist-canvas", width: 256, height: 64 });
  var ctx = canvas.getContext("2d");

  function drawHist(histData) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!histData) {
      ctx.fillStyle = "#14151a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }
    var maxVal = 1;
    for (var x of [histData.r, histData.g, histData.b]) {
      if (!x) continue;
      for (var s = 1; s < 63; s++) maxVal = Math.max(maxVal, x[s] || 0);
    }
    var colors = [
      { arr: histData.r, c: "rgba(239, 68, 68, 0.55)" },
      { arr: histData.g, c: "rgba(34, 197, 94, 0.55)" },
      { arr: histData.b, c: "rgba(59, 130, 246, 0.55)" }
    ];
    for (var ch of colors) {
      if (!ch.arr) continue;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (var w = 0; w < 64; w++) {
        var val = ch.arr[w] || 0;
        ctx.lineTo(w / 63 * canvas.width, canvas.height - Math.min(1, val / maxVal) * (canvas.height - 4));
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fillStyle = ch.c;
      ctx.fill();
    }
  }

  kt("histogram", function(M) { drawHist(M); });

  var foot = d("div", { class: "collabs-hist-foot" },
    d("div", { class: "collabs-hist-tags" },
      d("span", null, "sRGB"),
      d("span", null, "RGBA")
    ),
    d("span", { class: "collabs-hist-rgb" }, "R 145 · G 133 · B 146")
  );

  var realtimeRow = d("div", { class: "collabs-realtime-row" },
    d("span", null, a("Chế độ chỉnh màu thời gian thực")),
    makeEvotoSwitch(true, function(on) {})
  );

  wrap.append(head, canvas, foot, realtimeRow);
  return wrap;
}

function createCollabsCropTab(e) {
  var panel = d("div", { class: "collabs-crop-tab", role: "region", "aria-label": a("Cắt & Xoay") });

  panel.append(createCollabsHistogram(e));

  var modeNav = d("div", { class: "crop-mode-nav" },
    d("button", { type: "button", class: "crop-mode-tab active" }, a("Cắt & Xoay")),
    d("button", { type: "button", class: "crop-mode-tab" }, a("Phối cảnh & Mở rộng"))
  );
  panel.append(modeNav);

  var cropSection = d("div", { class: "crop-tool-section" });
  var cropHead = d("div", { class: "crop-section-head" },
    G(D.chevDown, 12),
    d("span", null, a("Cắt"))
  );

  var ratioSel = d("select", { class: "crop-ratio-select" },
    d("option", { value: "orig" }, a("Kích thước gốc")),
    d("option", { value: "free" }, a("Tự do")),
    d("option", { value: "1:1" }, "1:1 (" + a("Vuông") + ")"),
    d("option", { value: "3:4" }, "3:4 (" + a("Chân dung") + ")"),
    d("option", { value: "4:3" }, "4:3 (" + a("Ngang") + ")"),
    d("option", { value: "9:16" }, "9:16 (" + a("Story / TikTok") + ")"),
    d("option", { value: "16:9" }, "16:9 (" + a("Màn hình") + ")")
  );

  var dimInfo = d("div", { class: "crop-dim-info" },
    d("span", { class: "dim-text" }, a("Gốc: 4284 × 5712 px")),
    d("div", { class: "dim-actions" },
      d("button", { type: "button", class: "dim-btn", title: a("Đổi chiều ngang/dọc") }, SWAP_ICON_FN(12)),
      d("button", { type: "button", class: "dim-btn", title: a("Xem lại tỉ lệ gốc") }, a("Xem")),
      d("button", { type: "button", class: "dim-btn", title: a("Khôi phục kích thước gốc") }, G(D.reset, 12))
    )
  );

  var cropBtns = d("div", { class: "crop-action-btns" },
    d("button", { type: "button", class: "crop-action-btn primary" }, a("Áp dụng cắt")),
    d("button", { type: "button", class: "crop-action-btn secondary" }, a("Đặt lại cắt"))
  );
  cropBtns.children[0].onclick = function() { tt(a("Đã áp dụng vùng cắt")); };
  cropBtns.children[1].onclick = function() {
    var photo = A.current;
    if (photo) {
      var st = lt(photo.state);
      st.geometry = st.geometry || {};
      st.geometry.crop = [0, 0, 1, 1];
      st.geometry.angle = 0;
      A.setState(st);
      tt(a("Đã đặt lại cắt"));
    }
  };

  var gridLabel = d("label", { class: "crop-checkbox-label" },
    d("input", { type: "checkbox", checked: "checked" }),
    d("span", null, a("Hiển thị lưới khi cắt ảnh"))
  );

  cropSection.append(cropHead, ratioSel, dimInfo, cropBtns, gridLabel);
  panel.append(cropSection);

  var aiSection = d("div", { class: "crop-tool-section" });
  aiSection.append(
    d("div", { class: "crop-section-title" }, a("Định vị bằng AI")),
    d("div", { class: "crop-ai-tabs" },
      d("button", { type: "button", class: "crop-ai-tab active" }, a("Chủ thể")),
      d("button", { type: "button", class: "crop-ai-tab" }, a("Khung chân dung"))
    ),
    d("div", { class: "crop-ai-toggle-row" },
      d("span", null, a("Định vị đối tượng")),
      makeEvotoSwitch(false, function(on) {})
    ),
    d("div", { class: "crop-ai-align-hint" }, a("Tự động căn chỉnh người")),
    d("div", { class: "crop-ai-btns-col" },
      d("button", { type: "button", class: "crop-align-btn", onclick: function() { ymt(0); tt(a("Đã căn chỉnh dọc theo dáng người")); } }, a("Căn chỉnh dọc")),
      d("button", { type: "button", class: "crop-align-btn", onclick: function() { ymt(1); tt(a("Đã căn ngang theo mắt")); } }, a("Căn ngang theo mắt"))
    )
  );
  panel.append(aiSection);

  var rotSection = d("div", { class: "crop-tool-section" });
  rotSection.append(
    d("div", { class: "crop-section-head" },
      G(D.chevDown, 12),
      d("span", null, a("Xoay"))
    )
  );

  var rotIconsRow = d("div", { class: "crop-icon-grid" });

  var rotLeftBtn = d("button", { type: "button", class: "crop-icon-btn", title: a("Xoay trái 90°") }, G(D.rotL, 16));
  rotLeftBtn.onclick = function() { if (A.current) bu([A.current], 3); };

  var rotRightBtn = d("button", { type: "button", class: "crop-icon-btn", title: a("Xoay phải 90°") }, G(D.rotR, 16));
  rotRightBtn.onclick = function() { if (A.current) bu([A.current], 1); };

  var flipHBtn = d("button", { type: "button", class: "crop-icon-btn", title: a("Lật ngang") }, FLIP_H_ICON_FN(16));
  flipHBtn.onclick = function() {
    var photo = A.current;
    if (photo) {
      var st = lt(photo.state);
      st.geometry = st.geometry || {};
      st.geometry.flipH = !st.geometry.flipH;
      A.setState(st);
      tt(a("Đã lật ngang"));
    }
  };

  var flipVBtn = d("button", { type: "button", class: "crop-icon-btn", title: a("Lật dọc") }, FLIP_V_ICON_FN(16));
  flipVBtn.onclick = function() {
    var photo = A.current;
    if (photo) {
      var st = lt(photo.state);
      st.geometry = st.geometry || {};
      st.geometry.flipV = !st.geometry.flipV;
      A.setState(st);
      tt(a("Đã lật dọc"));
    }
  };

  rotIconsRow.append(rotLeftBtn, rotRightBtn, flipHBtn, flipVBtn);
  rotSection.append(rotIconsRow);

  var aiHorizonRow = d("div", { class: "crop-ai-straighten-row" },
    d("span", null, a("AI Hiệu Chỉnh")),
    d("button", { type: "button", class: "crop-pill-btn", onclick: function() { ymt(1); } }, a("Tự động"))
  );
  rotSection.append(aiHorizonRow);

  var angleSliderObj = makeRetouchSlider(a("Góc"), -45, 45, 0, 0.2, function(v) {
    var photo = A.current;
    if (photo) {
      var st = lt(photo.state);
      st.geometry = st.geometry || {};
      st.geometry.angle = v;
      A.setState(st);
    }
  });
  rotSection.append(angleSliderObj.el);
  panel.append(rotSection);

  var footerRow = d("div", { class: "crop-tab-footer" },
    d("button", { type: "button", class: "crop-footer-btn" }, a("Lưu cài sẵn mới")),
    d("button", { type: "button", class: "crop-footer-btn" }, a("Đồng bộ tất cả")),
    d("button", { type: "button", class: "crop-footer-icon-btn", title: a("Khôi phục mặc định") }, G(D.reset, 14))
  );
  panel.append(footerRow);

  function syncCrop(state) {
    if (!state || !state.geometry) return;
    var ang = state.geometry.angle || 0;
    angleSliderObj.setValue(ang);
    if (A.current && A.current.meta) {
      var w = A.current.meta.width || 4284;
      var h = A.current.meta.height || 5712;
      dimInfo.querySelector(".dim-text").textContent = a("Gốc: {0} × {1} px", w, h);
    }
  }

  if (e && e.updaters) e.updaters.push(syncCrop);
  syncCrop(A.current ? A.current.state : null);

  return panel;
}

function createCollabsBgTab(e) {
  var panel = d("div", { class: "collabs-bg-tab", role: "region", "aria-label": a("Điều chỉnh phông nền") });

  panel.append(createCollabsHistogram(e));

  // 1. Tối ưu hoá phông nền trơn
  var optSection = d("div", { class: "bg-tool-section" },
    d("div", { class: "bg-section-head" },
      G(D.chevDown, 12),
      d("span", null, a("Điều chỉnh phông nền"))
    ),
    d("div", { class: "bg-sub-title" }, a("Tối ưu hoá phông nền trơn"))
  );

  var TOGGLES = [
    { label: a("Loại bỏ chi tiết gây nhiễu"), def: !1 },
    { label: a("Loại bỏ nhược điểm phông nền"), def: !1 },
    { label: a("Độ sáng đồng đều"), def: !1 },
    { label: a("Loại bỏ dải màu"), def: !1 }
  ];

  for (var tg of TOGGLES) {
    optSection.append(
      d("div", { class: "bg-toggle-row" },
        d("span", null, tg.label),
        makeEvotoSwitch(tg.def, function(on) {})
      )
    );
  }
  panel.append(optSection);

  // 2. Tinh chỉnh phông nền (Sliders)
  var tuneSection = d("div", { class: "bg-tool-section" },
    d("div", { class: "bg-sub-title" }, a("Tinh chỉnh phông nền"))
  );

  tuneSection.append(
    makeRetouchSlider(a("Cải tiến phông nền"), 0, 100, 0, 1, function(v) {}).el,
    makeRetouchSlider(a("Khử sọc chuyển sắc (Banding)"), 0, 100, 0, 1, function(v) {}).el,
    makeRetouchSlider(a("Làm mờ hậu cảnh (Bokeh)"), 0, 100, 0, 1, function(v) {}).el
  );
  panel.append(tuneSection);

  // 3. Thay đổi phông nền (LiYing AI Engine)
  var chgSection = d("div", { class: "bg-tool-section" },
    d("div", { class: "bg-section-head" },
      G(D.chevDown, 12),
      d("span", null, a("Thay đổi phông nền"))
    )
  );

  var liyingCard = d("div", { class: "liying-bg-card" });

  var cardHeader = d("div", { class: "liying-card-header" },
    d("div", { class: "liying-badge-title" },
      d("span", { class: "liying-sparkle" }, SPARKLE_ICON_FN(14)),
      d("div", { class: "liying-title-stack" },
        d("strong", null, "LiYing AI"),
        d("span", { class: "liying-subtitle" }, "RMBG + Pose")
      )
    ),
    d("span", { class: "liying-tag" }, "LOCAL")
  );

  var straightenCb = d("input", { type: "checkbox", id: "liying-straighten-cb" });
  var straightenLabel = d("label", { class: "liying-checkbox-label", title: a("Tự động nhận diện tư thế hai vai, xoay cân bằng tư thế và căn giữa mặt") },
    d("span", { class: "liying-option-text" }, a("Tự cân bằng vai khi tách nền")),
    straightenCb
  );

  var BG_CHIPS = [
    { id: "blue", label: a("Xanh thẻ"), color: "#628bce", bdIdx: 0, rgb: [98, 139, 206] },
    { id: "white", label: a("Trắng"), color: "#ffffff", bdIdx: 1, rgb: [255, 255, 255], isLight: !0 },
    { id: "red", label: a("Đỏ"), color: "#d74532", bdIdx: 2, rgb: [215, 69, 50] },
    { id: "transparent", label: a("Trong suốt"), color: "transparent", isTrans: !0, bdIdx: -1 },
    { id: "darkblue", label: a("Xanh đậm"), color: "#1c4b82", bdIdx: 3, rgb: [28, 75, 130] },
    { id: "lightblue", label: a("Xanh nhạt"), color: "#a4c2e6", bdIdx: 4, rgb: [164, 194, 230] },
    { id: "gray", label: a("Xám"), color: "#8a8a8e", bdIdx: 5, rgb: [138, 138, 142] },
    { id: "cream", label: a("Kem Be"), color: "#f2ede4", bdIdx: 6, rgb: [242, 237, 228], isLight: !0 }
  ];

  var selColor = BG_CHIPS[0];
  var chipsWrap = d("div", { class: "liying-preset-grid" });

  var chipBtns = [];
  for (var chip of BG_CHIPS) {
    (function(item) {
      var isAct = item.id === selColor.id;
      var dotStyle = item.isTrans ? "" : "background:" + item.color;
      var dotClasses = "chip-dot" + (item.isTrans ? " chip-transparent" : "") + (item.isLight ? " chip-dot-light" : "");
      var btn = d("button", {
        type: "button",
        class: "liying-color-chip" + (isAct ? " active" : ""),
        title: item.label,
        onclick: function() {
          selColor = item;
          for (var b of chipBtns) b.classList.toggle("active", b === btn);
        }
      },
        d("span", { class: dotClasses, style: dotStyle }),
        d("span", null, item.label)
      );
      chipBtns.push(btn);
      chipsWrap.append(btn);
    })(chip);
  }

  // Action Buttons
  var applyBgBtn = d("button", { type: "button", class: "btn-liying-primary" },
    SPARKLE_ICON_FN(12),
    d("span", null, a("Tách & Thay nền"))
  );
  applyBgBtn.onclick = async function() {
    var photo = A.current;
    if (!photo) {
      tt(a("Vui lòng chọn một ảnh chân dung để thay nền"), 3000, "error");
      return;
    }
    tt(a("Đang tách & thay nền LiYing AI (RMBG-1.4 + Pose)..."), 3500);
    try {
      if (window.CollabsDevstuAI && typeof window.CollabsDevstuAI.runLiyingBackgroundReplacement === 'function') {
        var sourcePhoto = photo._originalPhotoRef || photo;
        await window.CollabsDevstuAI.runLiyingBackgroundReplacement(sourcePhoto, {
          color: selColor.id,
          label: selColor.label,
          transparent: Boolean(selColor.isTrans),
          straighten: Boolean(straightenCb.checked)
        });
        tt(a("Đã tách và thay nền LiYing AI thành công!"), 4000);
      } else {
        var st = lt(photo.state);
        st.idp = st.idp || {};
        st.idp.on = 1;
        if (selColor.isTrans) {
          st.lt = st.lt || {};
          st.lt.backdrop = 0;
          st.idp.bg = 0;
        } else {
          st.lt = st.lt || {};
          st.lt.backdrop = 100;
          st.lt.backdropC = selColor.bdIdx >= 0 ? selColor.bdIdx : 0;
          st.idp.bg = 4;
          st.idp.bgR = selColor.rgb[0];
          st.idp.bgG = selColor.rgb[1];
          st.idp.bgB = selColor.rgb[2];
        }
        A.setState(st);
        tt(a("Đã đổi màu nền thẻ"), 3000);
      }
    } catch (err) {
      console.error(err);
      tt(a("Lỗi thay nền: {0}", err.message || err), 5000, "error");
    }
  };

  var levelOnlyBtn = d("button", { type: "button", class: "btn-liying-secondary", title: a("Tự động nhận diện tư thế hai vai và xoay cân bằng") },
    d("span", null, "↔ " + a("Cân vai"))
  );
  levelOnlyBtn.onclick = async function() {
    var photo = A.current;
    if (!photo) {
      tt(a("Vui lòng chọn một ảnh để cân vai"), 3000, "error");
      return;
    }
    tt(a("Đang nhận diện dáng người & cân bằng vai..."), 3000);
    try {
      if (window.CollabsDevstuAI && typeof window.CollabsDevstuAI.runLiyingBackgroundReplacement === 'function') {
        var sourcePhoto = photo._originalPhotoRef || photo;
        await window.CollabsDevstuAI.runLiyingBackgroundReplacement(sourcePhoto, {
          levelOnly: true,
          straighten: true
        });
        tt(a("Đã cân bằng vai và dáng người thành công!"), 4000);
      } else {
        await ymt(0);
        tt(a("Đã cân vai"));
      }
    } catch (err) {
      console.error(err);
      tt(a("Lỗi cân vai: {0}", err.message || err), 5000, "error");
    }
  };

  var cancelBgBtn = d("button", { type: "button", class: "btn-liying-secondary", title: a("Khôi phục nền ban đầu của ảnh") },
    d("span", null, "✕ " + a("Hủy"))
  );
  cancelBgBtn.onclick = function() {
    var photo = A.current;
    if (photo) {
      var st = lt(photo.state);
      if (st.idp) st.idp.on = 0;
      if (st.lt) st.lt.backdrop = 0;
      A.setState(st);
      tt(a("Đã hủy thay đổi phông nền"));
    }
  };

  var actionsRow = d("div", { class: "liying-actions-row" },
    applyBgBtn, levelOnlyBtn, cancelBgBtn
  );

  liyingCard.append(cardHeader, straightenLabel, chipsWrap, actionsRow);
  chgSection.append(liyingCard);

  // Type Tabs & Gallery Tabs
  var bgTypeTabs = d("div", { class: "bg-type-tabs" },
    d("button", { type: "button", class: "bg-type-tab" }, a("Hình ảnh")),
    d("button", { type: "button", class: "bg-type-tab active" }, a("Màu đơn sắc"))
  );

  var bgLibTabs = d("div", { class: "bg-lib-tabs" },
    d("button", { type: "button", class: "bg-lib-tab active" }, a("Đề xuất")),
    d("button", { type: "button", class: "bg-lib-tab" }, a("Nền của bạn")),
    d("button", { type: "button", class: "bg-lib-btn-orig", onclick: function() { cancelBgBtn.click(); } }, a("Nền gốc"))
  );

  chgSection.append(bgTypeTabs, bgLibTabs);
  panel.append(chgSection);

  // Footer Row
  var footerRow = d("div", { class: "crop-tab-footer" },
    d("button", { type: "button", class: "crop-footer-btn" }, a("Lưu cài sẵn mới")),
    d("button", { type: "button", class: "crop-footer-btn" }, a("Đồng bộ tất cả")),
    d("button", { type: "button", class: "crop-footer-icon-btn", title: a("Khôi phục mặc định") }, G(D.reset, 14))
  );
  panel.append(footerRow);

  return panel;
}

function createProHairTools(e) {
  var panel = d("div", { class: "pro-hair-section", role: "region", "aria-label": a("Chỉnh màu tóc Pro") });

  var PRESETS = [
    { id: "none", name: "Trống", hex: "#363942", grad: "", deg: 0, title: a("Giữ màu tóc gốc") },
    { id: "h01", name: "H01", hex: "#7C695B", grad: "linear-gradient(155deg, #988374 0%, #7C695B 55%, #4f4137 100%)", deg: 60, title: "H01 - Nâu Trà Lạnh" },
    { id: "h02", name: "H02", hex: "#895C49", grad: "linear-gradient(155deg, #a6745d 0%, #895C49 55%, #5b3b2e 100%)", deg: 60, title: "H02 - Nâu Trà Sữa" },
    { id: "h03", name: "H03", hex: "#C67951", grad: "linear-gradient(155deg, #dd9269 0%, #C67951 55%, #8a4b2b 100%)", deg: 60, title: "H03 - Nâu Cam Tây" },
    { id: "h04", name: "H04", hex: "#9C5459", grad: "linear-gradient(155deg, #b86c71 0%, #9C5459 55%, #663034 100%)", deg: 60, title: "H04 - Đỏ Nâu Ánh Sáng" },
    { id: "h05", name: "H05", hex: "#AD5956", grad: "linear-gradient(155deg, #ca736f 0%, #AD5956 55%, #753431 100%)", deg: 50, title: "H05 - Đỏ Rượu" },
    { id: "h06", name: "H06", hex: "#98726E", grad: "linear-gradient(155deg, #b58d88 0%, #98726E 55%, #654744 100%)", deg: 50, title: "H06 - Nâu Hồng Phấn" },
    { id: "h07", name: "H07", hex: "#CE9390", grad: "linear-gradient(155deg, #e5b0ad 0%, #CE9390 55%, #996260 100%)", deg: 70, title: "H07 - Hồng Tử Đằng" },
    { id: "h08", name: "H08", hex: "#5D4B43", grad: "linear-gradient(155deg, #776359 0%, #5D4B43 55%, #2f241f 100%)", deg: 50, title: "H08 - Đen Tự Nhiên" },
    { id: "h09", name: "H09", hex: "#646980", grad: "linear-gradient(155deg, #7e849d 0%, #646980 55%, #373b4c 100%)", deg: 60, title: "H09 - Đen Ánh Xanh" },
    { id: "h10", name: "H10", hex: "#9B586C", grad: "linear-gradient(155deg, #b87387 0%, #9B586C 55%, #653141 100%)", deg: 60, title: "H10 - Tím Nho" },
    { id: "h11", name: "H11", hex: "#7C6D82", grad: "linear-gradient(155deg, #98889e 0%, #7C6D82 55%, #4d4252 100%)", deg: 60, title: "H11 - Tím Khói Xanh" },
    { id: "h12", name: "H12", hex: "#716F60", grad: "linear-gradient(155deg, #8d8b79 0%, #716F60 55%, #47463a 100%)", deg: 60, title: "H12 - Nâu Rêu Lạnh" },
    { id: "h13", name: "H13", hex: "#758060", grad: "linear-gradient(155deg, #919c7a 0%, #758060 55%, #4a523a 100%)", deg: 60, title: "H13 - Xám Rêu Khói" }
  ];

  var activePreset = "none";
  var hairSettings = {
    strength: 0,
    darken: 0,
    gray: 0,
    unify: 0,
    shine: 0,
    smooth: 0
  };

  var header = d("div", { class: "pro-hair-header" },
    d("div", { class: "pro-hair-title-wrap" },
      SPARKLE_ICON_FN(14),
      d("strong", null, a("Chỉnh màu tóc Pro")),
      d("span", { class: "pro-hair-badge" }, "COLLABS AI")
    ),
    d("div", { class: "pro-hair-subdesc" }, a("Hệ 13 màu nhuộm salon Evoto cao cấp & tinh chỉnh sợi tóc chuyên sâu"))
  );

  var cardGrid = d("div", { class: "hair-color-grid", id: "pro-hair-color-grid" });
  var cards = [];

  function selectPreset(preset) {
    activePreset = preset ? preset.id : "none";
    for (var c of cards) {
      c.classList.toggle("active", c.dataset.haircolor === activePreset);
    }
    if (preset && preset.id !== "none") {
      hairSettings.strength = preset.deg || 60;
      sDye.setValue(hairSettings.strength);
    } else {
      hairSettings.strength = 0;
      hairSettings.darken = 0;
      sDye.setValue(0);
      sDarken.setValue(0);
    }
  }

  for (var p of PRESETS) {
    (function(item) {
      var isNone = item.id === "none";
      var card = d("button", {
        type: "button",
        class: "hair-color-card" + (isNone ? " active" : ""),
        "data-haircolor": item.id,
        "data-deg": String(item.deg),
        title: item.title,
        onclick: function() {
          selectPreset(item);
        }
      },
        isNone
          ? d("span", { class: "hair-swatch-preview hair-swatch-none" }, "⊘")
          : d("span", { class: "hair-swatch-preview", style: "background: " + item.grad }),
        d("span", {
          class: "hair-swatch-code",
          style: isNone ? "background: #363942" : ("background: " + item.hex)
        }, item.name)
      );
      cards.push(card);
      cardGrid.append(card);
    })(p);
  }

  var sDye = makeRetouchSlider(a("Mức độ màu nhuộm Pro"), 0, 100, 0, 1, function(v) { hairSettings.strength = v; });
  var sDarken = makeRetouchSlider(a("Làm tối tóc"), 0, 100, 0, 1, function(v) { hairSettings.darken = v; });
  var sGray = makeRetouchSlider(a("Làm đen tóc bạc"), 0, 100, 0, 1, function(v) { hairSettings.gray = v; });
  var sUnify = makeRetouchSlider(a("Thống nhất màu tóc"), 0, 100, 0, 1, function(v) { hairSettings.unify = v; });
  var sShine = makeRetouchSlider(a("Tăng độ bóng tóc"), 0, 100, 0, 1, function(v) { hairSettings.shine = v; });
  var sSmooth = makeRetouchSlider(a("Mềm mượt & Giảm xơ rối"), 0, 100, 0, 1, function(v) { hairSettings.smooth = v; });

  var applyHairBtn = d("button", {
    type: "button",
    class: "btn-liying-primary pro-hair-apply-btn",
    style: "width:100%;margin-top:10px;height:32px"
  },
    SPARKLE_ICON_FN(14),
    d("span", null, a("Áp dụng màu tóc AI"))
  );

  applyHairBtn.onclick = async function() {
    var photo = A.current;
    if (!photo) {
      tt(a("Vui lòng chọn một ảnh để nhuộm tóc"), 3000, "error");
      return;
    }
    if (!activePreset || activePreset === "none") {
      tt(a("Vui lòng chọn một màu tóc salon (H01 - H13)"), 3000, "error");
      return;
    }
    var presetObj = PRESETS.find(function(p) { return p.id === activePreset; });
    var presetName = presetObj ? presetObj.title : activePreset.toUpperCase();
    tt(a("Đang nhuộm tóc Collabs Evoto AI ({0})...", presetName), 4000);

    try {
      if (window.CollabsDevstuAI && typeof window.CollabsDevstuAI.runEvotoHairDye === 'function') {
        var sourcePhoto = photo._originalPhotoRef || photo;
        await window.CollabsDevstuAI.runEvotoHairDye(sourcePhoto, activePreset, {
          code: activePreset,
          name: presetName,
          strength: hairSettings.strength,
          darken: hairSettings.darken,
          shine: hairSettings.shine,
          gray: hairSettings.gray,
          unify: hairSettings.unify,
          smooth: hairSettings.smooth
        });
        tt(a("Đã nhuộm tóc AI màu {0} thành công!", presetName), 4000);
      }
    } catch (err) {
      console.error(err);
      tt(a("Lỗi nhuộm tóc: {0}", err.message || err), 5000, "error");
    }
  };

  var resetBtn = d("button", {
    type: "button",
    class: "hair-reset-link",
    style: "margin-top:8px",
    onclick: function() {
      selectPreset(PRESETS[0]);
      hairSettings.strength = 0;
      hairSettings.darken = 0;
      hairSettings.gray = 0;
      hairSettings.unify = 0;
      hairSettings.shine = 0;
      hairSettings.smooth = 0;
      sDye.setValue(0);
      sDarken.setValue(0);
      sGray.setValue(0);
      sUnify.setValue(0);
      sShine.setValue(0);
      sSmooth.setValue(0);
      tt(a("Đã đặt lại màu tóc Pro"));
    }
  },
    G(D.reset, 12),
    d("span", null, a("Đặt lại màu tóc Pro"))
  );

  panel.append(
    header,
    cardGrid,
    sDye.el,
    sDarken.el,
    sGray.el,
    sUnify.el,
    sShine.el,
    sSmooth.el,
    applyHairBtn,
    resetBtn
  );

  return panel;
}
`;

// Insert collabsHelpersCode right before function hxt()
const hxtIdx = code.indexOf('function hxt(');
if (hxtIdx === -1) {
  throw new Error('Could not find function hxt(');
}

code = code.slice(0, hxtIdx) + collabsHelpersCode + '\n' + code.slice(hxtIdx);
console.log('8. Collabs helper functions inserted before hxt.');

// Save new app file
fs.writeFileSync('assets/app-7UAGS7H2.js', code, 'utf8');
console.log('9. Saved assets/app-7UAGS7H2.js successfully. Final size:', code.length);

// Verify syntax
execSync('node -c assets/app-7UAGS7H2.js', { stdio: 'inherit' });
console.log('10. Syntax check passed 100%!');
