
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



// =========================================================================
// LEFT RAIL & LIBRARY GRID EXTENSIONS FOR DEVSTU
// =========================================================================

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
    aiBanner.innerHTML = `
      <div style="background: rgba(232, 185, 49, 0.08); border: 1px solid rgba(232, 185, 49, 0.25); border-radius: 8px; padding: 10px; margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span style="font-size: 11.5px; font-weight: 700; color: #f8d442;">LiYing AI Studio</span>
          <span style="font-size: 10.5px; color: #f8d442;">Hoàn tất</span>
        </div>
        <div style="font-size: 10.5px; color: #aeb5c2; margin-top: 2px;">Tách nền / Cân vai AI</div>
      </div>
    `;
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
        item.innerHTML = `
          <span class="preset-thumb preset-thumb--user_custom" aria-hidden="true"></span>
          <span class="preset-badge">TÔI</span>
          <div class="preset-meta">
            <div class="p-title">${name}</div>
            <div class="p-sub">Cài sẵn tùy chỉnh cá nhân</div>
          </div>
        `;
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
  tabPresets.innerHTML = `
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
  `;
  aside.appendChild(tabPresets);

  // Tab 2: Lịch sử
  const tabHistory = document.createElement('div');
  tabHistory.id = 'ltab-history';
  tabHistory.className = 'left-tab-content';
  tabHistory.innerHTML = `
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
  `;
  aside.appendChild(tabHistory);

  // Tab 3: Dự án & AI
  const tabProject = document.createElement('div');
  tabProject.id = 'ltab-project';
  tabProject.className = 'left-tab-content';
  tabProject.innerHTML = `
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
  `;
  aside.appendChild(tabProject);

  // Tab 4: Thông tin & Hướng dẫn
  const tabInfo = document.createElement('div');
  tabInfo.id = 'ltab-info';
  tabInfo.className = 'left-tab-content';
  tabInfo.innerHTML = `
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
  `;
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
      gridView.innerHTML = `
        <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; color: #8b92a0; gap: 14px;">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" style="opacity: 0.35;">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <div style="font-size: 15px; font-weight: 600; color: #dfe4ed;">Thư viện ảnh trống</div>
          <div style="font-size: 12px; color: #6e7481; max-width: 320px; text-align: center;">Chưa có ảnh nào trong dự án. Bấm nút dưới để thêm ảnh hoặc RAW từ máy tính.</div>
          <button type="button" class="retouch-btn-import" onclick="typeof it==='function'?it('open-dialog','add-photos'):document.querySelector('.strip button.add')?.click()" style="margin-top: 4px; padding: 6px 16px; height: 34px;">
            +Chọn ảnh từ máy
          </button>
        </div>
      `;
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
      dimEl.textContent = (pw && ph) ? `${pw} × ${ph} px` : '';

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
