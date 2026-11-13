function makeAccGroup(titleText, children) {
  var grp = d("div", { class: "retouch-acc-group" });
  var titleBtn = d("button", { type: "button", class: "retouch-acc-title" },
    d("span", { class: "acc-title-text" }, "▾ " + titleText)
  );
  var body = d("div", { class: "retouch-acc-body" });
  if (Array.isArray(children)) {
    for (var c of children) if (c) body.append(c);
  } else if (children) {
    body.append(children);
  }
  titleBtn.onclick = function() {
    grp.classList.toggle("collapsed");
    var isCol = grp.classList.contains("collapsed");
    titleBtn.querySelector(".acc-title-text").textContent = (isCol ? "▸ " : "▾ ") + titleText;
  };
  grp.append(titleBtn, body);
  return grp;
}

function makeEvotoSwitch(initialState, onChange) {
  var btn = d("button", {
    type: "button",
    class: "evoto-switch" + (initialState ? " on" : ""),
    role: "switch",
    "aria-checked": initialState ? "true" : "false"
  }, d("span", { class: "evoto-switch-knob" }));

  btn.onclick = function() {
    btn.classList.toggle("on");
    var isOn = btn.classList.contains("on");
    btn.setAttribute("aria-checked", isOn ? "true" : "false");
    if (typeof onChange === "function") onChange(isOn);
  };
  return btn;
}

function makeRetouchSlider(label, min, max, step, defVal, onInput, formatter) {
  var item = d("div", { class: "retouch-slider-item" });
  var valSpan = d("span", { class: "val" }, formatter ? formatter(defVal) : String(defVal));
  var head = d("div", { class: "s-head" },
    d("span", null, label),
    valSpan
  );
  var slider = d("input", {
    type: "range",
    class: "retouch-slider",
    min: String(min),
    max: String(max),
    step: String(step || 1),
    value: String(defVal)
  });
  slider.oninput = function() {
    var val = +slider.value;
    valSpan.textContent = formatter ? formatter(val) : String(val);
    if (typeof onInput === "function") onInput(val, slider);
  };
  valSpan.onclick = function() {
    slider.value = String(defVal);
    valSpan.textContent = formatter ? formatter(defVal) : String(defVal);
    if (typeof onInput === "function") onInput(defVal, slider);
  };
  item.append(head, slider);
  return { item: item, slider: slider, valSpan: valSpan };
}

function makeInspectorFooter() {
  var footer = d("div", { class: "inspector-footer" });
  var saveBtn = d("button", { type: "button", class: "evoto-footer-pill" }, a("Lưu cài sẵn mới"));
  saveBtn.onclick = function() { tt(a("Đã mở lưu cài sẵn mới")); };
  var syncBtn = d("button", { type: "button", class: "evoto-footer-pill" }, a("Đồng bộ tất cả"));
  syncBtn.onclick = function() { tt(a("Đã đồng bộ thông số cho tất cả ảnh")); };
  var resetBtn = d("button", { type: "button", class: "evoto-footer-gear", title: a("Khôi phục mặc định") }, G(D.reset, 14));
  resetBtn.onclick = function() {
    var photo = A.current;
    if (photo) {
      A.resetState(photo);
      tt(a("Đã khôi phục mặc định"));
    }
  };
  footer.append(saveBtn, syncBtn, resetBtn);
  return footer;
}

function makeCropRatioDropdown(onChange) {
  var RATIOS = [
    { id: "orig", label: a("Kích thước gốc"), isSep: !1 },
    { id: "as_shot", label: a("Cài đặt ảnh gốc"), isSep: !1 },
    { id: "free", label: a("Tự do"), isSep: !1 },
    { id: "sep1", isSep: !0 },
    { id: "1:1", label: "1 : 1 (" + a("Vuông") + ")", isSep: !1, w: 1, h: 1 },
    { id: "4:5", label: "4 : 5 (" + a("Instagram") + ")", isSep: !1, w: 4, h: 5 },
    { id: "3:4", label: "3 : 4 (" + a("Chân dung") + ")", isSep: !1, w: 3, h: 4 },
    { id: "5:7", label: "5 : 7", isSep: !1, w: 5, h: 7 },
    { id: "2:3", label: "2 : 3", isSep: !1, w: 2, h: 3 },
    { id: "16:9", label: "16 : 9 (" + a("Màn hình") + ")", isSep: !1, w: 16, h: 9 },
    { id: "9:16", label: "9 : 16 (" + a("Story / TikTok") + ")", isSep: !1, w: 9, h: 16 },
    { id: "4:3", label: "4 : 3 (" + a("Ngang") + ")", isSep: !1, w: 4, h: 3 }
  ];

  var wrap = d("div", { class: "crop-ratio-wrap" });
  var labelSpan = d("span", { id: "crop-ratio-label" }, a("Kích thước gốc"));
  var btn = d("button", { type: "button", class: "crop-ratio-btn", "aria-expanded": "false" },
    labelSpan,
    makeSvgNode(12, 12, "0 0 24 24", '<polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" stroke-width="2"/>')
  );

  var menu = d("div", { class: "crop-ratio-menu hidden" });
  var curId = "orig";
  var optEls = [];

  for (var r of RATIOS) {
    if (r.isSep) {
      menu.append(d("div", { class: "crop-ratio-divider" }));
      continue;
    }
    (function(item) {
      var opt = d("div", { class: "crop-ratio-opt" + (item.id === curId ? " active" : "") },
        d("span", { class: "opt-check" }, item.id === curId ? "✓" : ""),
        d("span", null, item.label)
      );
      opt.onclick = function(ev) {
        ev.stopPropagation();
        curId = item.id;
        labelSpan.textContent = item.label;
        for (var o of optEls) {
          var isAct = o._item.id === curId;
          o.el.classList.toggle("active", isAct);
          o.el.querySelector(".opt-check").textContent = isAct ? "✓" : "";
        }
        menu.classList.add("hidden");
        btn.setAttribute("aria-expanded", "false");
        if (typeof onChange === "function") onChange(item);
      };
      optEls.push({ el: opt, _item: item });
      menu.append(opt);
    })(r);
  }

  btn.onclick = function(ev) {
    ev.stopPropagation();
    var isHidden = menu.classList.toggle("hidden");
    btn.setAttribute("aria-expanded", isHidden ? "false" : "true");
  };

  document.addEventListener("click", function(ev) {
    if (!wrap.contains(ev.target)) {
      menu.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  wrap.append(btn, menu);
  return wrap;
}

function createCollabsHistogram(e) {
  var wrap = d("div", { class: "collabs-hist-container" });

  var head = d("div", { class: "hist-collapse-head", id: "btn-toggle-histogram" },
    d("span", null, "▾ " + a("Biểu đồ")),
    d("span", { id: "hist-exposure-info" }, "16-bit • Rust SIMD")
  );

  var cardShell = d("div", { class: "hist-card-shell" });
  var canvas = d("canvas", { id: "histogram-canvas", width: 290, height: 68 });
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

  var rgbMeanSpan = d("span", { class: "hist-rgb" }, "R 145 · G 133 · B 146");
  var teleRow = d("div", { class: "hist-telemetry-row" },
    d("span", null, "sRGB"),
    d("span", null, "RGBA"),
    rgbMeanSpan
  );
  cardShell.append(canvas, teleRow);

  var realtimeRow = d("div", { class: "evoto-realtime-row" },
    d("span", null, a("Chế độ chỉnh màu thời gian thực")),
    makeEvotoSwitch(true, function(isOn) {
      tt(isOn ? a("Đã bật chế độ xem trước thời gian thực") : a("Đã tắt chế độ thời gian thực (tối ưu máy yếu)"));
    })
  );

  head.onclick = function() {
    var isHidden = cardShell.style.display === "none";
    cardShell.style.display = isHidden ? "flex" : "none";
    realtimeRow.style.display = cardShell.style.display;
    head.querySelector("span").textContent = (isHidden ? "▾ " : "▸ ") + a("Biểu đồ");
  };

  wrap.append(head, cardShell, realtimeRow);
  return wrap;
}

function createCollabsCropTab(e) {
  var panel = d("div", { class: "collabs-crop-tab", role: "region", "aria-label": a("Cắt & Xoay") });

  panel.append(createCollabsHistogram(e));

  // 1. Segmented Tabs: Cắt & Xoay vs Phối cảnh & Mở rộng
  var tabPaneMain = d("div", { class: "crop-subtab-pane active" });
  var tabPaneExpand = d("div", { class: "crop-subtab-pane" });
  tabPaneExpand.style.display = "none";

  var btnTabMain = d("button", { type: "button", class: "crop-mode-tab active" }, a("Cắt & Xoay"));
  var btnTabExpand = d("button", { type: "button", class: "crop-mode-tab" }, a("Phối cảnh & Mở rộng"));

  btnTabMain.onclick = function() {
    btnTabMain.classList.add("active");
    btnTabExpand.classList.remove("active");
    tabPaneMain.style.display = "flex";
    tabPaneExpand.style.display = "none";
  };
  btnTabExpand.onclick = function() {
    btnTabExpand.classList.add("active");
    btnTabMain.classList.remove("active");
    tabPaneMain.style.display = "none";
    tabPaneExpand.style.display = "flex";
  };

  var modeNav = d("div", { class: "crop-mode-tabs" }, btnTabMain, btnTabExpand);
  panel.append(modeNav);

  // --- CROP SECTION INSIDE ACCORDION ---
  var cropBodyItems = [];

  // Dropdown Ratio
  var ratioDropdown = makeCropRatioDropdown(function(ratioItem) {
    var photo = A.current;
    if (photo && ratioItem.w && ratioItem.h) {
      var st = lt(photo.state);
      st.geometry = st.geometry || {};
      st.geometry.cropRatio = [ratioItem.w, ratioItem.h];
      A.setState(st);
      tt(a("Đã áp dụng tỉ lệ: {0}", ratioItem.label));
    }
  });
  cropBodyItems.push(ratioDropdown);

  // Live Readout + Toolbar Row
  var readoutSpan = d("span", { class: "crop-box-readout" }, a("Gốc: 4284 × 5712 px"));
  var swapBtn = d("button", { type: "button", class: "crop-mini-btn", title: a("Đổi chiều khung cắt (Ngang / Dọc)") }, "⇄");
  var viewBtn = d("button", { type: "button", class: "crop-mini-btn", title: a("Xem lại") }, a("Xem"));
  var resetCropMiniBtn = d("button", { type: "button", class: "crop-mini-btn", title: a("Đặt lại khung cắt") }, "↺");

  swapBtn.onclick = function() {
    var photo = A.current;
    if (photo) {
      var st = lt(photo.state);
      st.geometry = st.geometry || {};
      if (st.geometry.cropRatio) {
        st.geometry.cropRatio = [st.geometry.cropRatio[1], st.geometry.cropRatio[0]];
        A.setState(st);
        tt(a("Đã đổi chiều khung cắt"));
      }
    }
  };
  viewBtn.onclick = function() { tt(a("Đang xem trước vùng cắt")); };
  resetCropMiniBtn.onclick = function() {
    var photo = A.current;
    if (photo) {
      var st = lt(photo.state);
      st.geometry = st.geometry || {};
      st.geometry.crop = [0, 0, 1, 1];
      A.setState(st);
      tt(a("Đã đặt lại khung cắt"));
    }
  };

  var toolbarRow = d("div", { class: "crop-toolbar-row" },
    readoutSpan,
    d("div", { class: "crop-mini-actions" }, swapBtn, viewBtn, resetCropMiniBtn)
  );
  cropBodyItems.push(toolbarRow);

  // Apply & Reset Row
  var applyCropBtn = d("button", { type: "button", class: "crop-action-btn primary" }, a("Áp dụng cắt"));
  var resetCropBtn = d("button", { type: "button", class: "crop-action-btn secondary" }, a("Đặt lại cắt"));
  applyCropBtn.onclick = function() { tt(a("Đã áp dụng vùng cắt")); };
  resetCropBtn.onclick = function() { resetCropMiniBtn.click(); };

  var applyResetRow = d("div", { class: "crop-apply-reset-row" }, applyCropBtn, resetCropBtn);
  cropBodyItems.push(applyResetRow);

  // Grid Checkbox Row
  var gridCb = d("input", { type: "checkbox", checked: "checked" });
  var gridLabel = d("label", { class: "crop-check-row" },
    gridCb,
    d("span", null, a("Hiển thị lưới khi cắt ảnh"))
  );
  gridCb.onchange = function() {
    window.__DEVSTU_SHOW_CROP_GRID = gridCb.checked;
  };
  cropBodyItems.push(gridLabel);

  // AI Alignment Section
  var aiSection = d("div", { class: "crop-ai-section" });
  var aiTitle = d("div", { class: "crop-ai-title" }, a("Định vị bằng AI"));

  var aiTabSubject = d("button", { type: "button", class: "crop-ai-tab active" }, a("Chủ thể"));
  var aiTabHead = d("button", { type: "button", class: "crop-ai-tab" }, a("Khung chân dung"));
  aiTabSubject.onclick = function() {
    aiTabSubject.classList.add("active");
    aiTabHead.classList.remove("active");
  };
  aiTabHead.onclick = function() {
    aiTabHead.classList.add("active");
    aiTabSubject.classList.remove("active");
  };

  var aiTabsRow = d("div", { class: "crop-ai-tabs" }, aiTabSubject, aiTabHead);

  var aiToggleRow = d("div", { class: "crop-toggle-row" },
    d("span", { class: "crop-toggle-label" }, a("Định vị đối tượng")),
    makeEvotoSwitch(false, function(isOn) {
      if (isOn) {
        ymt(0);
        tt(a("Đã tự động định vị và căn giữa đối tượng"));
      }
    })
  );

  var aiAlignHint = d("div", { class: "crop-sublabel" }, a("Tự động căn chỉnh người"));

  var btnAlignV = d("button", { type: "button", class: "crop-pill-action-btn" }, a("Căn chỉnh dọc"));
  var btnAlignEye = d("button", { type: "button", class: "crop-pill-action-btn" }, a("Căn ngang theo mắt"));
  btnAlignV.onclick = function() { ymt(0); tt(a("Đã căn chỉnh dọc theo dáng người")); };
  btnAlignEye.onclick = function() { ymt(1); tt(a("Đã căn ngang theo mắt")); };

  var aiBtnsCol = d("div", { class: "crop-ai-stack-btns" }, btnAlignV, btnAlignEye);

  aiSection.append(aiTitle, aiTabsRow, aiToggleRow, aiAlignHint, aiBtnsCol);
  cropBodyItems.push(aiSection);

  var cropAccGroup = makeAccGroup(a("Cắt"), cropBodyItems);
  tabPaneMain.append(cropAccGroup);

  // --- ROTATE SECTION INSIDE ACCORDION ---
  var rotBodyItems = [];

  var rotLeftBtn = d("button", { type: "button", class: "crop-icon-btn", title: a("Xoay trái 90°") }, G(D.rotL, 16));
  rotLeftBtn.onclick = function() { if (A.current) bu([A.current], 3); };

  var rotRightBtn = d("button", { type: "button", class: "crop-icon-btn", title: a("Xoay phải 90°") }, G(D.rotR, 16));
  rotRightBtn.onclick = function() { if (A.current) bu([A.current], 1); };

  var flipHBtn = d("button", { type: "button", class: "crop-icon-btn", title: a("Lật ngang (Soi gương)") }, FLIP_H_ICON_FN(16));
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

  var rotIconsRow = d("div", { class: "crop-rotate-icons" }, rotLeftBtn, rotRightBtn, flipHBtn, flipVBtn);
  rotBodyItems.push(rotIconsRow);

  var autoStraightenBtn = d("button", { type: "button", class: "crop-auto-pill" }, a("Tự động"));
  autoStraightenBtn.onclick = function() {
    ymt(1);
    tt(a("Đã tự động cân bằng góc đường chân trời"));
  };
  var aiStraightenRow = d("div", { class: "crop-ai-straighten-row" },
    d("span", { class: "crop-toggle-label" }, a("AI Hiệu Chỉnh")),
    autoStraightenBtn
  );
  rotBodyItems.push(aiStraightenRow);

  var angleSliderObj = makeRetouchSlider(a("Góc"), -45, 45, 0.1, 0, function(val) {
    var photo = A.current;
    if (photo) {
      var st = lt(photo.state);
      st.geometry = st.geometry || {};
      st.geometry.angle = val;
      A.setState(st);
    }
  }, function(v) { return (+v).toFixed(2); });
  rotBodyItems.push(angleSliderObj.item);

  var rotAccGroup = makeAccGroup(a("Xoay"), rotBodyItems);
  tabPaneMain.append(rotAccGroup);

  // Tab 2: Phối cảnh & Mở rộng (Expand & Perspective)
  var expandItems = [];
  var vKeystone = makeRetouchSlider(a("Biến dạng dọc (Keystone V)"), -50, 50, 1, 0, function(val) {
    var photo = A.current;
    if (photo) {
      var st = lt(photo.state);
      st.geometry = st.geometry || {};
      st.geometry.keystoneV = val;
      A.setState(st);
    }
  });
  var hKeystone = makeRetouchSlider(a("Biến dạng ngang (Keystone H)"), -50, 50, 1, 0, function(val) {
    var photo = A.current;
    if (photo) {
      var st = lt(photo.state);
      st.geometry = st.geometry || {};
      st.geometry.keystoneH = val;
      A.setState(st);
    }
  });
  var expandAcc = makeAccGroup(a("Biến dạng phối cảnh"), [vKeystone.item, hKeystone.item]);
  tabPaneExpand.append(expandAcc);

  panel.append(tabPaneMain, tabPaneExpand);

  // Sticky Inspector Footer
  panel.append(makeInspectorFooter());

  function syncCrop(state) {
    if (!state || !state.geometry) return;
    var ang = state.geometry.angle || 0;
    angleSliderObj.slider.value = String(ang);
    angleSliderObj.valSpan.textContent = ang.toFixed(2);
    if (A.current && A.current.meta) {
      var w = A.current.meta.width || 4284;
      var h = A.current.meta.height || 5712;
      readoutSpan.textContent = a("Gốc: {0} × {1} px", w, h);
    }
  }

  if (e && e.updaters) e.updaters.push(syncCrop);
  syncCrop(A.current ? A.current.state : null);

  return panel;
}

function createCollabsBgTab(e) {
  var panel = d("div", { class: "collabs-bg-tab", role: "region", "aria-label": a("Điều chỉnh phông nền") });

  panel.append(createCollabsHistogram(e));

  // --- SECTION 1: Tối ưu hoá phông nền trơn & Tinh chỉnh ---
  var optItems = [];
  optItems.push(d("div", { class: "bg-subhead" }, a("Tối ưu hoá phông nền trơn")));

  var TOGGLES = [
    { label: a("Loại bỏ chi tiết gây nhiễu"), key: "cleanDistractions" },
    { label: a("Loại bỏ nhược điểm phông nền"), key: "cleanDefects" },
    { label: a("Độ sáng đồng đều"), key: "evenBrightness" },
    { label: a("Loại bỏ dải màu"), key: "removeBanding" }
  ];

  for (var tg of TOGGLES) {
    (function(item) {
      var sw = makeEvotoSwitch(false, function(isOn) {
        var photo = A.current;
        if (photo) {
          var st = lt(photo.state);
          st.bgOpt = st.bgOpt || {};
          st.bgOpt[item.key] = isOn;
          A.setState(st);
          tt(a("Đã cập nhật: {0}", item.label));
        }
      });
      var row = d("div", { class: "crop-toggle-row" },
        d("span", { class: "crop-toggle-label" }, item.label),
        sw
      );
      optItems.push(row);
    })(tg);
  }

  optItems.push(d("div", { class: "bg-divider" }));
  optItems.push(d("div", { class: "bg-subhead" }, a("Tinh chỉnh phông nền")));

  var sClean = makeRetouchSlider(a("Cải tiến phông nền"), 0, 100, 1, 0, function(val) {
    var photo = A.current;
    if (photo) {
      var st = lt(photo.state);
      st.lt = st.lt || {};
      st.lt.backdropClean = val;
      A.setState(st);
    }
  });
  var sBanding = makeRetouchSlider(a("Khử sọc chuyển sắc (Banding)"), 0, 100, 1, 0, function(val) {
    var photo = A.current;
    if (photo) {
      var st = lt(photo.state);
      st.lt = st.lt || {};
      st.lt.backdropBandingFix = val;
      A.setState(st);
    }
  });
  var sBokeh = makeRetouchSlider(a("Làm mờ hậu cảnh (Bokeh)"), 0, 100, 1, 0, function(val) {
    var photo = A.current;
    if (photo) {
      var st = lt(photo.state);
      st.lt = st.lt || {};
      st.lt.bgBlurBokeh = val;
      A.setState(st);
    }
  });
  optItems.push(sClean.item, sBanding.item, sBokeh.item);

  var bgOptAcc = makeAccGroup(a("Điều chỉnh phông nền"), optItems);
  panel.append(bgOptAcc);

  // --- SECTION 2: Thay đổi phông nền (LiYing AI Engine) ---
  var chgItems = [];

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

  var straightenActive = false;
  var straightenSwitch = makeEvotoSwitch(false, function(isOn) {
    straightenActive = isOn;
  });
  var straightenRow = d("div", { class: "crop-toggle-row", title: a("Tự động nhận diện tư thế hai vai, xoay cân bằng tư thế và căn giữa mặt") },
    d("span", { class: "crop-toggle-label" }, a("Tự cân bằng vai khi tách nền")),
    straightenSwitch
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
          straighten: Boolean(straightenActive)
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
    makeSvgNode(13, 13, "0 0 24 24", '<path d="M3 12h18M8 7l-3 5 3 5M16 7l3 5-3 5" fill="none" stroke="currentColor" stroke-width="2"/>'),
    d("span", null, a("Cân vai"))
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

  var cancelBgBtn = d("button", { type: "button", class: "btn-liying-secondary btn-liying-cancel", title: a("Khôi phục nền ban đầu của ảnh") },
    makeSvgNode(12, 12, "0 0 24 24", '<path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'),
    d("span", null, a("Hủy"))
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

  var actionsRow = d("div", { class: "liying-actions-row" }, applyBgBtn, levelOnlyBtn, cancelBgBtn);

  liyingCard.append(cardHeader, straightenRow, chipsWrap, actionsRow);
  chgItems.push(liyingCard);

  // Segmented Tabs: Hình ảnh vs Màu đơn sắc
  var bgCatImage = d("button", { type: "button", class: "bg-type-tab" }, a("Hình ảnh"));
  var bgCatSolid = d("button", { type: "button", class: "bg-type-tab active" }, a("Màu đơn sắc"));
  bgCatImage.onclick = function() {
    bgCatImage.classList.add("active");
    bgCatSolid.classList.remove("active");
    tt(a("Chế độ phông nền hình ảnh"));
  };
  bgCatSolid.onclick = function() {
    bgCatSolid.classList.add("active");
    bgCatImage.classList.remove("active");
  };
  var bgTypeTabs = d("div", { class: "bg-type-tabs" }, bgCatImage, bgCatSolid);
  chgItems.push(bgTypeTabs);

  // Underline Tabs: Đề xuất vs Nền của bạn + Nền gốc button
  var libTabRec = d("button", { type: "button", class: "bg-lib-tab active" }, a("Đề xuất"));
  var libTabUser = d("button", { type: "button", class: "bg-lib-tab" }, a("Nền của bạn"));
  libTabRec.onclick = function() {
    libTabRec.classList.add("active");
    libTabUser.classList.remove("active");
  };
  libTabUser.onclick = function() {
    libTabUser.classList.add("active");
    libTabRec.classList.remove("active");
  };
  var origResetBtn = d("button", { type: "button", class: "bg-orig-reset-btn", title: a("Khôi phục phông nền gốc") }, a("Nền gốc"));
  origResetBtn.onclick = function() { cancelBgBtn.click(); };

  var bgLibRow = d("div", { class: "bg-lib-tabs-row" },
    d("div", { class: "bg-lib-tabs" }, libTabRec, libTabUser),
    origResetBtn
  );
  chgItems.push(bgLibRow);

  var chgAccGroup = makeAccGroup(a("Thay đổi phông nền"), chgItems);
  panel.append(chgAccGroup);

  // Sticky Inspector Footer
  panel.append(makeInspectorFooter());

  return panel;
}
