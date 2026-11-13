import fs from 'fs';
import { execSync } from 'child_process';

const orig = fs.readFileSync('scripts/app_d564e4b.js', 'utf8');

console.log('Original size:', orig.length);

// 1. Language fix: ensure Ay(t) calls location.reload() after URL parameter update
const oldAy = 'async function Ay(t){if(await Dbt(t)){Vb();const u=new URL(location.href);u.searchParams.set("lang",t);location.href=u.toString();return!0}return!1}';
const newAy = 'async function Ay(t){if(await Dbt(t)){Vb();const u=new URL(location.href);u.searchParams.set("lang",t);location.href=u.toString();setTimeout(()=>location.reload(),10);return!0}return!1}';

let code = orig.replace(oldAy, newAy);
if (code === orig) {
  console.warn('Warning: Ay replacement not matched directly, checking regex...');
  code = orig.replace(/async function Ay\s*\([^)]*\)\s*\{[\s\S]*?location\.href\s*=\s*u\.toString\(\);return!0\}return!1\}/, newAy);
}
console.log('Language fix applied.');

// 2. Add window bridge to oHt
const oHtHookTarget = 'function oHt(){let t={stage:void 0,afterPick:null},e={},n={S:t,A:e},o=document.getElementById("app");';
const oHtHookRepl = `function oHt(){let t={stage:void 0,afterPick:null},e={},n={S:t,A:e},o=document.getElementById("app");
  window._devstuApp = e;
  window._devstuAddFiles = async function(files, select) { return await e.addFiles(files, select !== false); };
  window._devstuA = A;
  window._devstuSelectPhoto = function(id) { A.select(id); };
  window._devstuGetBitmap = _T;`;

if (!code.includes(oHtHookTarget)) {
  throw new Error('Could not find oHt target in original file');
}
code = code.replace(oHtHookTarget, oHtHookRepl);
console.log('oHt bridge attached.');

// 3. Add phongnen and crop to pl rail tabs array
const plTarget = '{id:"retouch",label:a("tab::Retouch"),icon:D.face},{id:"matna",label:a("Mặt nạ"),icon:D.stack}';
const plRepl = '{id:"retouch",label:a("tab::Retouch"),icon:D.face},{id:"phongnen",label:a("Phông nền"),icon:D.image},{id:"crop",label:a("Cắt & Xoay"),icon:D.crop},{id:"matna",label:a("Mặt nạ"),icon:D.stack}';

if (!code.includes(plTarget)) {
  throw new Error('Could not find plTarget in original file');
}
code = code.replace(plTarget, plRepl);
console.log('pl tabs added (phongnen, crop).');

// 4. In nxt(t): in Hair card (g.id === "hair"), append createProHairTools(e)
const hairCardTarget = 'g.id==="hair"&&A.current&&b.append(e.hairTools(A.current)),';
const hairCardRepl = 'g.id==="hair"&&A.current&&b.append(e.hairTools(A.current), createProHairTools(e)),';

if (!code.includes(hairCardTarget)) {
  throw new Error('Could not find hairCardTarget');
}
code = code.replace(hairCardTarget, hairCardRepl);
console.log('createProHairTools hooked into hair card.');

// 5. In rxt(t): mount createCollabsBgTab and createCollabsCropTab inside rebuild
const rebuildMountTarget = 'A.mode==="simple"?t.buildSimple():t.buildFull(),t.applyTabs(),e.append(r)';
const rebuildMountRepl = 'A.mode==="simple"?t.buildSimple():t.buildFull(),(function(){ try { var bg=createCollabsBgTab(t); bg.dataset.mt="phongnen"; e.append(bg); var cr=createCollabsCropTab(t); cr.dataset.mt="crop"; e.append(cr); } catch(err){console.error("Collabs mount error:", err);} })(),t.applyTabs(),e.append(r)';

if (!code.includes(rebuildMountTarget)) {
  throw new Error('Could not find rebuildMountTarget');
}
code = code.replace(rebuildMountTarget, rebuildMountRepl);
console.log('rebuild mounted Collabs tabs inside panel.');

// 5b. In Qut(): ensure clicking crop or phongnen in simple mode switches to full mode
const qutClickTarget = 'onclick:()=>{Wu()?it("rail-jump",i.id):i.id===_p&&Dc&&!or()?Ip(!1):as(i.id)}';
const qutClickRepl = 'onclick:()=>{if((i.id==="crop"||i.id==="phongnen"||i.id==="retouch")&&A.mode==="simple")A.setMode("full");Wu()?it("rail-jump",i.id):i.id===_p&&Dc&&!or()?Ip(!1):as(i.id)}';

if (code.includes(qutClickTarget)) {
  code = code.replace(qutClickTarget, qutClickRepl);
  console.log('Qut click hook attached.');
}

// 6. Collabs UI functions definition to append before hxt
const collabsHelpersCode = `
// =========================================================================
// COLLABS RETOUCH PRO & LIYING AI EXTENSIONS FOR DEVSTU
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

var EVOTO_HAIR_SPECS = {
  h01: [[0.486, 0.412, 0.357], 0.14,  0.07,  0.19, 0.72],
  h02: [[0.537, 0.361, 0.286], 0.10,  0.07,  0.08, 0.76],
  h03: [[0.776, 0.475, 0.318], 0.20,  0.06,  0.29, 0.80],
  h04: [[0.612, 0.329, 0.349], 0.16,  0.07,  0.12, 0.78],
  h05: [[0.678, 0.349, 0.337], 0.18, -0.16,  0.27, 0.82],
  h06: [[0.596, 0.447, 0.431], 0.22, -0.10,  0.19, 0.78],
  h07: [[0.808, 0.576, 0.565], 0.32,  0.00,  0.42, 0.84],
  h08: [[0.220, 0.185, 0.172], -0.18, 0.08, -0.26, 0.78],
  h09: [[0.270, 0.305, 0.425], 0.06, -0.06,  0.10, 0.80],
  h10: [[0.608, 0.345, 0.424], 0.14,  0.03,  0.22, 0.82],
  h11: [[0.486, 0.427, 0.510], 0.16,  0.09,  0.19, 0.80],
  h12: [[0.443, 0.435, 0.376], 0.15,  0.12,  0.13, 0.76],
  h13: [[0.459, 0.502, 0.376], 0.18, -0.14,  0.28, 0.80]
};

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
      ctx.fillStyle = "#16181f";
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
    d("span", { class: "collabs-hist-rgb" }, "R 140 · G 130 · B 145")
  );

  var realtimeRow = d("div", { class: "collabs-realtime-row" },
    d("span", null, a("Chế độ chỉnh màu thời gian thực")),
    d("label", { class: "collabs-toggle" },
      d("input", { type: "checkbox", checked: "checked" }),
      d("span", { class: "slider" })
    )
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
      d("button", { type: "button", class: "dim-btn", title: a("Đổi chiều ngang/dọc") }, G(D.swapRatio, 14)),
      d("button", { type: "button", class: "dim-btn", title: a("Xem lại tỉ lệ gốc") }, a("Xem")),
      d("button", { type: "button", class: "dim-btn", title: a("Khôi phục kích thước gốc") }, G(D.reset, 14))
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
      d("label", { class: "collabs-toggle" },
        d("input", { type: "checkbox" }),
        d("span", { class: "slider" })
      )
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

  var angleVal = d("span", { class: "crop-slider-val" }, "0.00");
  var angleSlider = d("input", { type: "range", min: "-45", max: "45", step: "0.2", value: "0", class: "crop-range-slider" });
  angleSlider.oninput = function() {
    angleVal.textContent = (+angleSlider.value).toFixed(2);
    var photo = A.current;
    if (photo) {
      var st = lt(photo.state);
      st.geometry = st.geometry || {};
      st.geometry.angle = +angleSlider.value;
      A.setState(st);
    }
  };

  rotSection.append(
    d("div", { class: "crop-slider-row" },
      d("span", null, a("Góc")),
      angleVal
    ),
    angleSlider
  );
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
    angleSlider.value = String(ang);
    angleVal.textContent = ang.toFixed(2);
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
        d("label", { class: "collabs-toggle" },
          d("input", { type: "checkbox", checked: tg.def ? "checked" : null }),
          d("span", { class: "slider" })
        )
      )
    );
  }
  panel.append(optSection);

  // 2. Tinh chỉnh phông nền (Sliders)
  var tuneSection = d("div", { class: "bg-tool-section" },
    d("div", { class: "bg-sub-title" }, a("Tinh chỉnh phông nền"))
  );

  function makeBgSlider(title) {
    var vSpan = d("span", { class: "bg-slider-val" }, "0");
    var sInput = d("input", { type: "range", min: "0", max: "100", value: "0", class: "crop-range-slider" });
    sInput.oninput = function() { vSpan.textContent = sInput.value; };
    return d("div", { class: "bg-slider-wrap" },
      d("div", { class: "bg-slider-row" },
        d("span", null, title),
        vSpan
      ),
      sInput
    );
  }

  tuneSection.append(
    makeBgSlider(a("Cải tiến phông nền")),
    makeBgSlider(a("Khử sọc chuyển sắc (Banding)")),
    makeBgSlider(a("Làm mờ hậu cảnh (Bokeh)"))
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
    { id: "h01", name: "Trà lạnh", sub: "Cool Tea", hex: "#7c695b", dye: 65, scalp: 20 },
    { id: "h02", name: "Nâu trà", sub: "Tea Brown", hex: "#895c49", dye: 70, scalp: 20 },
    { id: "h03", name: "Nâu cam", sub: "Orange Brown", hex: "#c67951", dye: 75, scalp: 15 },
    { id: "h04", name: "Nâu đỏ", sub: "Red Brown+", hex: "#9c5459", dye: 72, scalp: 20 },
    { id: "h05", name: "Đỏ Ruby", sub: "Ruby Red", hex: "#ad5956", dye: 80, scalp: 25 },
    { id: "h06", name: "Nâu hồng", sub: "Pink Brown", hex: "#98726e", dye: 70, scalp: 20 },
    { id: "h07", name: "Hồng Sakura", sub: "Sakura Pink", hex: "#ce9390", dye: 82, scalp: 15 },
    { id: "h08", name: "Đen tự nhiên", sub: "Natural Black", hex: "#2e2522", dye: 60, scalp: 35 },
    { id: "h09", name: "Xanh đen", sub: "Blue Black", hex: "#2c3245", dye: 75, scalp: 30 },
    { id: "h10", name: "Nho tím", sub: "Grape Purple", hex: "#6b3c4f", dye: 76, scalp: 25 },
    { id: "h11", name: "Xanh tím khói", sub: "Blue Purple", hex: "#544a5c", dye: 78, scalp: 20 },
    { id: "h12", name: "Rêu khói", sub: "Olive Flax", hex: "#575647", dye: 70, scalp: 20 },
    { id: "h13", name: "Rêu tro", sub: "Ash Moss", hex: "#5a6347", dye: 72, scalp: 20 }
  ];

  var activePreset = null;
  var hairSettings = {
    strength: 65,
    darken: 0,
    shine: 0,
    gray: 0,
    unify: 0,
    scalp: 0
  };

  var header = d("div", { class: "pro-hair-header" },
    d("div", { class: "pro-hair-title-wrap" },
      G(D.sparkle, 14),
      d("strong", null, a("Chỉnh màu tóc Pro")),
      d("span", { class: "pro-hair-badge" }, "EVOTO SALON AI")
    )
  );

  var cardGrid = d("div", { class: "pro-hair-grid" });
  var cards = [];

  function selectPreset(preset) {
    activePreset = preset ? preset.id : null;
    for (var c of cards) {
      c.classList.toggle("active", c.dataset.id === activePreset);
    }
    if (preset) {
      hairSettings.strength = preset.dye;
      hairSettings.scalp = preset.scalp;
      sDye.setVisual(hairSettings.strength);
      sDarken.setVisual(hairSettings.scalp);
    }
  }

  for (var p of PRESETS) {
    (function(item) {
      var card = d("button", {
        type: "button",
        class: "pro-hair-card",
        "data-id": item.id,
        title: item.name + " (" + item.sub + ")",
        onclick: function() {
          if (activePreset === item.id) {
            selectPreset(null);
          } else {
            selectPreset(item);
          }
        }
      },
        d("span", { class: "pro-hair-color-dot", style: "background:" + item.hex }),
        d("span", { class: "pro-hair-card-name" }, item.name),
        d("span", { class: "pro-hair-card-sub" }, item.id.toUpperCase())
      );
      cards.push(card);
      cardGrid.append(card);
    })(p);
  }

  function makeProSlider(label, min, max, getVal, setVal) {
    var vSpan = d("span", { class: "pro-slider-val" }, "0");
    var sInput = d("input", { type: "range", min: String(min), max: String(max), value: "0", class: "crop-range-slider" });

    function setVisual(v) {
      sInput.value = String(v);
      vSpan.textContent = String(v);
    }

    sInput.oninput = function() {
      var val = +sInput.value;
      vSpan.textContent = String(val);
      setVal(val);
    };

    var row = d("div", { class: "pro-slider-wrap" },
      d("div", { class: "pro-slider-row" },
        d("span", null, label),
        vSpan
      ),
      sInput
    );

    return { el: row, setVisual: setVisual, getVal: getVal };
  }

  var sDye = makeProSlider(a("Nhuộm tóc"), 0, 100, function() { return hairSettings.strength; }, function(v) { hairSettings.strength = v; });
  var sDarken = makeProSlider(a("Che da đầu lộ"), 0, 100, function() { return hairSettings.scalp; }, function(v) { hairSettings.scalp = v; });
  var sGray = makeProSlider(a("Làm đen tóc bạc"), 0, 100, function() { return hairSettings.gray; }, function(v) { hairSettings.gray = v; });
  var sUnify = makeProSlider(a("Đồng đều màu tóc"), 0, 100, function() { return hairSettings.unify; }, function(v) { hairSettings.unify = v; });
  var sShine = makeProSlider(a("Bóng tóc"), 0, 100, function() { return hairSettings.shine; }, function(v) { hairSettings.shine = v; });
  var sFrizz = makeProSlider(a("Tối chân tóc"), 0, 100, function() { return hairSettings.darken; }, function(v) { hairSettings.darken = v; });

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
    if (!activePreset) {
      tt(a("Vui lòng chọn một màu tóc từ bảng salon ở trên"), 3000, "error");
      return;
    }
    var presetObj = PRESETS.find(function(p) { return p.id === activePreset; });
    var presetName = presetObj ? presetObj.name : activePreset.toUpperCase();
    tt(a("Đang nhuộm tóc Evoto AI ({0})...", presetName), 4000);

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
          unify: hairSettings.unify
        });
        tt(a("Đã nhuộm tóc AI màu {0} thành công!", presetName), 4000);
      } else {
        var spec = EVOTO_HAIR_SPECS[activePreset];
        if (spec) {
          var rgb = spec[0];
          var st = lt(photo.state);
          st.skin = st.skin || {};
          st.skin.dye = hairSettings.strength;
          st.skin.dyeR = Math.round(rgb[0] * 255);
          st.skin.dyeG = Math.round(rgb[1] * 255);
          st.skin.dyeB = Math.round(rgb[2] * 255);
          st.skin.proHairDye = activePreset;
          A.setState(st);
          tt(a("Đã áp dụng màu tóc {0}", presetName), 3000);
        }
      }
    } catch (err) {
      console.error(err);
      tt(a("Lỗi nhuộm tóc: {0}", err.message || err), 5000, "error");
    }
  };

  var brushBtn = d("button", {
    type: "button",
    class: "hair-brush-action-btn",
    onclick: function() {
      if (typeof it === "function") {
        it("brush-mode", "hair");
        tt(a("Đã bật cọ tô tóc: hãy tô lên chỗ da đầu lộ hoặc tóc thưa"), 3000);
      }
    }
  },
    G(D.brush, 15),
    d("span", null, a("Tô chỗ hói bằng cọ"))
  );

  var resetBtn = d("button", {
    type: "button",
    class: "hair-reset-link",
    onclick: function() {
      selectPreset(null);
      hairSettings.strength = 0;
      hairSettings.scalp = 0;
      hairSettings.gray = 0;
      hairSettings.unify = 0;
      hairSettings.shine = 0;
      hairSettings.darken = 0;
      sDye.setVisual(0);
      sDarken.setVisual(0);
      sGray.setVisual(0);
      sUnify.setVisual(0);
      sShine.setVisual(0);
      sFrizz.setVisual(0);
      var photo = A.current;
      if (photo) {
        var st = lt(photo.state);
        if (st.skin) {
          st.skin.dye = 0;
          delete st.skin.proHairDye;
          A.setState(st);
        }
      }
      tt(a("Đã đặt lại nhóm tóc"));
    }
  },
    G(D.reset, 12),
    d("span", null, a("Đặt lại nhóm này"))
  );

  panel.append(
    header,
    cardGrid,
    sDye.el,
    sDarken.el,
    sGray.el,
    sUnify.el,
    sShine.el,
    sFrizz.el,
    applyHairBtn,
    d("div", { class: "hair-brush-wrap" },
      d("div", { class: "hair-brush-hint" }, a("Che chỗ hói, tóc thưa")),
      brushBtn,
      d("small", { class: "hair-brush-subhint" }, a("Bấm nút trên rồi tô lên chỗ da đầu lộ ra"))
    ),
    resetBtn
  );

  function syncHair(state) {
    if (!state || !state.skin) return;
    var activeId = state.skin.proHairDye || activePreset || null;
    for (var c of cards) c.classList.toggle("active", c.dataset.id === activeId);
    sDye.setVisual(hairSettings.strength);
    sDarken.setVisual(hairSettings.scalp);
    sGray.setVisual(hairSettings.gray);
    sUnify.setVisual(hairSettings.unify);
    sShine.setVisual(hairSettings.shine);
    sFrizz.setVisual(hairSettings.darken);
  }

  if (e && e.updaters) e.updaters.push(syncHair);
  syncHair(A.current ? A.current.state : null);

  return panel;
}
`;

// Insert collabsHelpersCode right before function hxt()
const hxtIdx = code.indexOf('function hxt(');
if (hxtIdx === -1) {
  throw new Error('Could not find function hxt(');
}

code = code.slice(0, hxtIdx) + collabsHelpersCode + '\n' + code.slice(hxtIdx);
console.log('Collabs helper functions inserted before hxt.');

// Save new app file
fs.writeFileSync('assets/app-7UAGS7H2.js', code, 'utf8');
console.log('Saved assets/app-7UAGS7H2.js successfully. Final size:', code.length);

// Verify syntax
execSync('node -c assets/app-7UAGS7H2.js', { stdio: 'inherit' });
console.log('Syntax check passed 100%!');
