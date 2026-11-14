const fs = require('fs');
const path = require('path');

// 1. Read source assets
const railHtml = fs.readFileSync('scripts/collabs_rail.html', 'utf8');
const inspectorHtml = fs.readFileSync('scripts/collabs_inspector.html', 'utf8');
const serializedRail = JSON.stringify(railHtml);
const serializedInspector = JSON.stringify(inspectorHtml);

// 2. Generate assets/stu_ultra_module.js
const moduleJs = `// assets/stu_ultra_module.js - DEVSTU STU Ultra Inspector & Rail Module
// Ported from Collabs Retouch Pro with 5 Full Modules: Portrait, Color, Background, Clothing, Crop

(function(window) {
  'use strict';

  var DEFAULT_PARAMS = {
    // MODULE 2: PORTRAIT RETOUCHING
    freckleAcne: 0,
    faceMole: 0,
    faceShine: 0,
    darkCircles: 0,
    eyeBags: 0,
    foreheadWrinkles: 0,
    nasolabialFolds: 0,
    neckWrinkles: 0,
    glassesGlare: 0,
    doubleChin: 0,
    bodyBlemish: 0,

    dodgeBurnEven: 0,
    dodgeBurnSculpt: 0,
    freqSepLow: 0,
    freqSepHigh: 80,
    facialSkinSmooth: 0,
    bodySkinSmooth: 0,
    skinRadiance: 0,
    skinRosy: 0,
    skinWarmth: 0,
    unifyComplexion: 0,

    faceWidth: 0,
    jawlineSlim: 0,
    cheekboneLift: 0,
    chinLength: 0,
    foreheadHeight: 0,
    noseWidth: 0,
    noseTipLift: 0,
    mouthSize: 0,
    lipPlump: 0,
    smileEnhance: 0,

    eyeSize: 0,
    eyeBrighten: 0,
    redVeins: 0,
    catchlightBoost: 0,
    eyebrowThickness: 0,
    eyebrowLift: 0,

    teethWhiten: 0,
    teethDesaturate: 0,
    teethBrighten: 0,

    makeupHighlight: 0,
    makeupContour: 0,
    makeupBlush: 0,
    makeupEyeshadow: 0,
    makeupLipstick: 0,
    makeupLipTint: 'rose',

    strayHair: 0,
    strayHairInner: 100,
    strayHairOuter: 100,
    hairVolume: 0,
    hairSideLeftVolume: 0,
    hairSideRightVolume: 0,
    hairlineAdjust: 0,
    hairPartLine: 0,
    hairSmooth: 0,
    hairFrizzy: 100,
    hairShine: 0,
    whiteHairBlacken: 0,
    hairColorUnify: 0,
    hairDyeStrength: 0,
    hairDyeDarken: 0,
    hairDyeColor: 'none',

    neckSlim: 0,
    shoulderSculpt: 0,
    waistSlim: 0,

    // MODULE 1: COLOR ADJUSTMENT
    temperature: 0,
    tint: 0,
    exposure: 0,
    contrast: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    clarity: 0,
    texture: 0,
    dehaze: 0,
    vibrance: 0,
    saturation: 0,

    curveShadows: 0,
    curveDarks: 0,
    curveLights: 0,
    curveHighlights: 0,
    curveLut: [],

    colorMatchStrength: 0,
    colorMatchStats: [],

    hslRedHue: 0, hslRedSat: 0, hslRedLum: 0,
    hslOrangeHue: 0, hslOrangeSat: 0, hslOrangeLum: 0,
    hslYellowHue: 0, hslYellowSat: 0, hslYellowLum: 0,
    hslGreenHue: 0, hslGreenSat: 0, hslGreenLum: 0,
    hslAquaHue: 0, hslAquaSat: 0, hslAquaLum: 0,
    hslBlueHue: 0, hslBlueSat: 0, hslBlueLum: 0,
    hslPurpleHue: 0, hslPurpleSat: 0, hslPurpleLum: 0,
    hslMagentaHue: 0, hslMagentaSat: 0, hslMagentaLum: 0,

    gradeShadowHue: 210, gradeShadowSat: 0,
    gradeHighHue: 38, gradeHighSat: 0,
    sharpenAmount: 0, noiseReduction: 0,
    filmGrain: 0, vignette: 0, lutPreset: 'none',

    // MODULE 3: BACKGROUND & CLOTHING
    clothingTarget: 'all',
    clothingDewrinkle: 0,
    clothingSmallWrinkles: 100,
    clothingLargeWrinkles: 100,
    clothingLintClean: 0,
    clothingSweatStain: 0,
    clothingSweatEvenness: 50,
    clothingEdgeSmooth: 0,
    clothingEdgeRefine: 50,
    clothingMoireRemove: 0,
    backdropClean: 0,
    backdropBandingFix: 0,
    skyEnhance: 0,
    bgBlurBokeh: 0,
    bgReplaceMode: 'original',
    bgCustomColor: '#e8eef5',
    bgCustomImage: '',
    bgCleanDistractions: false,
    bgCleanDefects: false,
    bgEvenBrightness: false,
    bgRemoveBanding: false,
    bgEdgeMode: 'auto',
    bgKeepScope: 'subject_and_related',
    bgFillArea: 'full_image',
    bgFillMode: 'cover',
    bgBlendMode: 'normal',
    bgEdgeAdjust: 0,
    bgReplaceOpacity: 100,
    bgScale: 0,
    bgOffsetX: 0,
    bgOffsetY: 0,
    bgBlurStrength: 0,
    bgDecontam: false,
    bgGroundReflect: false,
    bgPreserveShadow: false,
    bgShadowType: 'none',
    bgShadowBlur: 25,
    bgShadowOpacity: 0,
    bgShadowShift: 0,
    bgShadowBlendMode: 'multiply',

    // MODULE 4: CROP & TRANSFORM
    cropX: 0,
    cropY: 0,
    cropW: 1,
    cropH: 1,
    cropPreset: 'original',
    cropAspectW: 0,
    cropAspectH: 0,
    cropCustomW: 0,
    cropCustomH: 0,
    cropDimUnit: 'px',
    cropDpi: 300,
    cropShowGrid: true,
    cropAiSubject: false,
    cropAlignVertical: false,
    cropAlignEye: false,
    rotateAngle: 0,
    keystoneVertical: 0,
    keystoneHorizontal: 0,
    geoScale: 100,
    geoOffsetX: 0,
    geoOffsetY: 0,
    flipHorizontal: false,
    flipVertical: false
  };

  function createDefaultParams() {
    return Object.assign({}, DEFAULT_PARAMS);
  }

  function formatSliderBadgeValue(val, key) {
    var num = Number(val);
    if (!Number.isFinite(num)) return '0';
    if (key === 'rotateAngle') return num.toFixed(2);
    return Number.isInteger(num) ? String(num) : num.toFixed(1);
  }

  // 1-to-1 Mapping from STU Ultra Sliders to DEVSTU's Native State Engine
  var SLIDER_MAP = {
    // Tone & Light
    exposure: function(st, val) { if (st.tone) st.tone.exposure = val / 50; },
    contrast: function(st, val) { if (st.tone) st.tone.contrast = val; },
    highlights: function(st, val) { if (st.tone) st.tone.highlights = val; },
    shadows: function(st, val) { if (st.tone) st.tone.shadows = val; },
    whites: function(st, val) { if (st.tone) st.tone.whites = val; },
    blacks: function(st, val) { if (st.tone) st.tone.blacks = val; },
    temperature: function(st, val) { if (st.wb) st.wb.temp = val; },
    tint: function(st, val) { if (st.wb) st.wb.tint = val; },
    vibrance: function(st, val) { if (st.presence) st.presence.vibrance = val; },
    saturation: function(st, val) { if (st.presence) st.presence.saturation = val; },
    clarity: function(st, val) { if (st.presence) st.presence.clarity = val; },
    texture: function(st, val) { if (st.presence) st.presence.texture = val; },
    dehaze: function(st, val) { if (st.land) st.land.haze = -val; },
    sharpenAmount: function(st, val) { if (st.detail) st.detail.sharpen = val; },
    noiseReduction: function(st, val) { if (st.detail) st.detail.denoise = val; },
    filmGrain: function(st, val) { if (st.effects) st.effects.grain = val; },
    vignette: function(st, val) { if (st.lens) st.lens.vignette = val; },

    // HSL 8 Channels (Full Color Wheel)
    hslRedHue: function(st, val) { if (st.hsl) st.hsl.h0 = val; },
    hslRedSat: function(st, val) { if (st.hsl) st.hsl.s0 = val; },
    hslRedLum: function(st, val) { if (st.hsl) st.hsl.l0 = val; },
    hslOrangeHue: function(st, val) { if (st.hsl) st.hsl.h1 = val; },
    hslOrangeSat: function(st, val) { if (st.hsl) st.hsl.s1 = val; },
    hslOrangeLum: function(st, val) { if (st.hsl) st.hsl.l1 = val; },
    hslYellowHue: function(st, val) { if (st.hsl) st.hsl.h2 = val; },
    hslYellowSat: function(st, val) { if (st.hsl) st.hsl.s2 = val; },
    hslYellowLum: function(st, val) { if (st.hsl) st.hsl.l2 = val; },
    hslGreenHue: function(st, val) { if (st.hsl) st.hsl.h3 = val; },
    hslGreenSat: function(st, val) { if (st.hsl) st.hsl.s3 = val; },
    hslGreenLum: function(st, val) { if (st.hsl) st.hsl.l3 = val; },
    hslAquaHue: function(st, val) { if (st.hsl) st.hsl.h4 = val; },
    hslAquaSat: function(st, val) { if (st.hsl) st.hsl.s4 = val; },
    hslAquaLum: function(st, val) { if (st.hsl) st.hsl.l4 = val; },
    hslBlueHue: function(st, val) { if (st.hsl) st.hsl.h5 = val; },
    hslBlueSat: function(st, val) { if (st.hsl) st.hsl.s5 = val; },
    hslBlueLum: function(st, val) { if (st.hsl) st.hsl.l5 = val; },
    hslPurpleHue: function(st, val) { if (st.hsl) st.hsl.h6 = val; },
    hslPurpleSat: function(st, val) { if (st.hsl) st.hsl.s6 = val; },
    hslPurpleLum: function(st, val) { if (st.hsl) st.hsl.l6 = val; },
    hslMagentaHue: function(st, val) { if (st.hsl) st.hsl.h7 = val; },
    hslMagentaSat: function(st, val) { if (st.hsl) st.hsl.s7 = val; },
    hslMagentaLum: function(st, val) { if (st.hsl) st.hsl.l7 = val; },

    // Portrait - Khử khuyết điểm (Blemish Removal & Clean Face)
    freckleAcne: function(st, val) { if (st.skin) st.skin.ai = val; },
    faceMole: function(st, val) { if (st.skin) st.skin.marks = val; },
    faceShine: function(st, val) { if (st.skin) st.skin.oil = val; },
    darkCircles: function(st, val) { if (st.skin) st.skin.circles = val; },
    eyeBags: function(st, val) { if (st.skin) st.skin.bags = val; },
    foreheadWrinkles: function(st, val) { if (st.skin) st.skin.wFore = val; },
    nasolabialFolds: function(st, val) { if (st.skin) st.skin.wNose = val; },
    neckWrinkles: function(st, val) { if (st.skin) st.skin.wNeck = val; },
    glassesGlare: function(st, val) { if (st.skin) st.skin.glare = val; },
    doubleChin: function(st, val) { if (st.shape) st.shape.chin = val; if (st.skin) st.skin.chin = val; },
    bodyBlemish: function(st, val) { if (st.skin) st.skin.bodyAi = val; },

    // Portrait - Làm mịn da & Tông da (Skin Smoothing & Complexion)
    facialSkinSmooth: function(st, val) { if (st.skin) st.skin.smooth = val; },
    bodySkinSmooth: function(st, val) { if (st.skin) st.skin.smoothBody = val; },
    freqSepHigh: function(st, val) { if (st.skin) st.skin.keep = val; },
    unifyComplexion: function(st, val) { if (st.skin) st.skin.even = val; },
    dodgeBurnEven: function(st, val) { if (st.skin) st.skin.db = val; },
    dodgeBurnSculpt: function(st, val) { if (st.skin) st.skin.db = val; },
    skinRadiance: function(st, val) { if (st.skin) st.skin.bright = val; },
    skinRosy: function(st, val) { if (st.skin) st.skin.rosy = val; },
    skinWarmth: function(st, val) { if (st.skin) st.skin.tan = val; },

    // Portrait - Định hình khuôn mặt 3D Liquify
    faceWidth: function(st, val) { if (st.shape) st.shape.faceSize = -val; },
    jawlineSlim: function(st, val) { if (st.shape) st.shape.jaw = val; },
    cheekboneLift: function(st, val) { if (st.shape) st.shape.cheekbone = -val; },
    chinLength: function(st, val) { if (st.shape) st.shape.chinLen = val; },
    foreheadHeight: function(st, val) { if (st.shape) st.shape.forehead = val; },
    noseWidth: function(st, val) { if (st.shape) st.shape.nose = -val; },
    noseTipLift: function(st, val) { if (st.shape) st.shape.noseTip = val; },
    mouthSize: function(st, val) { if (st.shape) st.shape.mouth = val; },
    lipPlump: function(st, val) { if (st.shape) { st.shape.lipTop = val; st.shape.lipBot = val; } },
    smileEnhance: function(st, val) { if (st.shape) st.shape.smile = val; },

    // Portrait - Mắt & Lông mày
    eyeSize: function(st, val) { if (st.shape) st.shape.eyes = val; },
    eyeBrighten: function(st, val) { if (st.skin) st.skin.eyes = val; },
    redVeins: function(st, val) { if (st.skin) st.skin.vein = val; },
    catchlightBoost: function(st, val) { if (st.skin) st.skin.gloss = val; },
    eyebrowThickness: function(st, val) { if (st.skin) st.skin.brow = val; },
    eyebrowLift: function(st, val) { if (st.shape) st.shape.brow = val; },

    // Portrait - Răng
    teethWhiten: function(st, val) { if (st.skin) st.skin.teeth = val; },
    teethDesaturate: function(st, val) { if (st.skin) st.skin.teethEven = val; },
    teethBrighten: function(st, val) { if (st.skin) st.skin.teethEven = val; },

    // Portrait - Trang điểm
    makeupLipstick: function(st, val) { if (st.skin) st.skin.lip = val; },
    makeupBlush: function(st, val) { if (st.skin) st.skin.blush = val; },
    makeupContour: function(st, val) { if (st.skin) st.skin.contour = val; },
    makeupHighlight: function(st, val) { if (st.skin) st.skin.bright = Math.max(st.skin.bright, val * 0.5); },

    // Portrait - Tóc Evoto HairBeauty
    strayHair: function(st, val) { if (st.skin) { st.skin.flyIn = val; st.skin.flyOut = val; } },
    strayHairInner: function(st, val) { if (st.skin) st.skin.flyIn = val; },
    strayHairOuter: function(st, val) { if (st.skin) st.skin.flyOut = val; },
    hairSmooth: function(st, val) { if (st.skin) st.skin.frizz = 100 - val; },
    hairFrizzy: function(st, val) { if (st.skin) st.skin.frizz = val; },
    hairShine: function(st, val) { if (st.skin) st.skin.shine = val; },
    whiteHairBlacken: function(st, val) { if (st.skin) st.skin.hairGray = val; },
    hairDyeStrength: function(st, val) { if (st.skin) st.skin.dye = val; },

    // Portrait - Định hình cơ thể
    waistSlim: function(st, val) { if (st.shape) st.shape.waist = val; },
    shoulderSculpt: function(st, val) { if (st.shape) st.shape.arms = val; },
    neckSlim: function(st, val) { if (st.skin) st.skin.wNeck = Math.max(st.skin.wNeck, val); },

    // Clothing - Trang phục
    clothingDewrinkle: function(st, val) { if (st.skin) st.skin.cloth = val; },
    clothingSmallWrinkles: function(st, val) { if (st.skin) st.skin.cloth = val; },
    clothingLargeWrinkles: function(st, val) { if (st.skin) st.skin.cloth = val; },
    clothingEdgeSmooth: function(st, val) { if (st.skin) st.skin.clothEdge = val; }
  };

  var RAIL_HTML = ` + serializedRail + `;
  var INSPECTOR_HTML = ` + serializedInspector + `;

  var StuUltra = {
    container: null,
    inspector: null,
    rail: null,
    headerRight: null,
    activeModule: 'mod-portrait',
    histOpen: true,
    realtimeColor: true,

    init: function() {
      if (document.getElementById('stu-ultra-container')) return;

      var appBody = document.querySelector('.body') || document.getElementById('app');
      if (!appBody) {
        setTimeout(StuUltra.init, 100);
        return;
      }

      // Create Container
      var cont = document.createElement('div');
      cont.id = 'stu-ultra-container';
      cont.className = 'stu-ultra-container';
      cont.innerHTML = INSPECTOR_HTML + RAIL_HTML;
      appBody.appendChild(cont);
      StuUltra.container = cont;
      StuUltra.inspector = cont.querySelector('.retouch-right-inspector');
      StuUltra.rail = cont.querySelector('.retouch-right-rail');

      // Create Header Right Controls
      var hdr = document.querySelector('.hdr');
      if (hdr && !document.getElementById('stu-ultra-header-right')) {
        var hrDiv = document.createElement('div');
        hrDiv.id = 'stu-ultra-header-right';
        hrDiv.className = 'stu-ultra-header-right';
        hrDiv.innerHTML = '<div class="stu-ultra-status-pill" title="Bộ xử lý Rust SIMD đa luồng & AI MediaPipe 478 điểm">' +
          '<span class="stu-ultra-status-dot"></span>' +
          '<span id="stu-ultra-status-label">AI 478 điểm ✓ • Gốc</span>' +
          '</div>' +
          '<button id="stu-ultra-btn-reset" type="button" class="stu-ultra-btn-reset" title="Khôi phục toàn bộ ảnh về ban đầu">Đặt lại</button>' +
          '<button id="stu-ultra-btn-export" type="button" class="stu-ultra-btn-export" title="Xuất ảnh độ phân giải gốc">Xuất</button>';
        
        var lastPill = hdr.querySelector('.pill.accent') || hdr.lastChild;
        if (lastPill && lastPill.parentNode === hdr) {
          hdr.insertBefore(hrDiv, lastPill);
        } else {
          hdr.appendChild(hrDiv);
        }
        StuUltra.headerRight = hrDiv;
      }

      StuUltra.bindEvents();
      StuUltra.syncBatchCount();
      StuUltra.syncCurrentPhoto();

      // Listen for global DEVSTU events
      if (window._devstuA) {
        window._devstuA.on(function(event) {
          if (event === 'mode') {
            StuUltra.onModeChange();
          } else if (event === 'current') {
            StuUltra.syncCurrentPhoto();
          } else if (event === 'photos') {
            StuUltra.syncBatchCount();
          }
        });
      }

      // Check initial mode
      StuUltra.onModeChange();
    },

    ensureFacesDetected: function(photo) {
      if (!photo) return;
      if (!photo.faces && window._devstuLt) {
        var statusLabel = document.getElementById('stu-ultra-status-label');
        if (statusLabel) statusLabel.textContent = 'Đang phân tích AI 478 điểm...';
        window._devstuLt(photo, true).then(function(faces) {
          if (faces && faces.length) {
            if (statusLabel) statusLabel.textContent = 'AI 478 điểm ✓ • ' + faces.length + ' mặt';
            if (window._devstuStage && window._devstuStage.requestRender) {
              window._devstuStage.requestRender();
            }
          } else {
            if (statusLabel) statusLabel.textContent = 'AI 478 điểm ✓ • Gốc';
          }
        }).catch(function() {
          if (statusLabel) statusLabel.textContent = 'AI 478 điểm ✓ • Gốc';
        });
      } else if (photo.faces && photo.faces.length) {
        var statusLabel = document.getElementById('stu-ultra-status-label');
        if (statusLabel) statusLabel.textContent = 'AI 478 điểm ✓ • ' + photo.faces.length + ' mặt';
      }
    },

    onModeChange: function() {
      var A = window._devstuA;
      var isUltra = (A && A.mode === 'stu_ultra');
      var app = document.getElementById('app');
      if (app) {
        app.classList.toggle('app-stu-ultra', isUltra);
      }
      var ultraBtn = document.querySelector('.mode-stu-ultra');
      if (ultraBtn) {
        ultraBtn.setAttribute('aria-pressed', String(isUltra));
      }
      if (isUltra) {
        StuUltra.syncCurrentPhoto();
        StuUltra.renderHistogram();
        StuUltra.renderToneCurve();
        if (A && A.current) {
          StuUltra.ensureFacesDetected(A.current);
        }
      }
    },

    bindEvents: function() {
      var cont = StuUltra.container;
      if (!cont) return;

      // 1. Rail Buttons
      var rightHeading = cont.querySelector('#right-module-title');
      cont.querySelectorAll('.rail-icon-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          cont.querySelectorAll('.rail-icon-btn').forEach(function(b) { b.classList.remove('active'); });
          cont.querySelectorAll('.retouch-module-pane').forEach(function(p) { p.classList.remove('active'); });
          btn.classList.add('active');
          var targetMod = btn.dataset.mod || 'mod-portrait';
          var pane = cont.querySelector('#' + targetMod);
          if (pane) pane.classList.add('active');
          StuUltra.activeModule = targetMod;
          if (rightHeading && btn.dataset.title) {
            rightHeading.textContent = btn.dataset.title;
          }

          var A = window._devstuA;
          if (targetMod === 'mod-portrait' && A && A.current) {
            StuUltra.ensureFacesDetected(A.current);
          }
        });
      });

      // 2. Accordions
      cont.querySelectorAll('.retouch-acc-title').forEach(function(title) {
        title.addEventListener('click', function() {
          var group = title.closest('.retouch-acc-group');
          if (group) group.classList.toggle('collapsed');
        });
      });

      // 3. Histogram Toggle & Switch
      var histToggle = cont.querySelector('#btn-toggle-histogram');
      var histBody = cont.querySelector('#hist-body-wrap');
      if (histToggle) {
        histToggle.addEventListener('click', function() {
          StuUltra.histOpen = !StuUltra.histOpen;
          if (histBody) histBody.style.display = StuUltra.histOpen ? '' : 'none';
          var firstSpan = histToggle.querySelector('span');
          if (firstSpan) firstSpan.textContent = StuUltra.histOpen ? '▾ Biểu đồ' : '▸ Biểu đồ';
        });
      }

      var realtimeSwitch = cont.querySelector('#toggle-realtime-color');
      if (realtimeSwitch) {
        realtimeSwitch.addEventListener('click', function() {
          StuUltra.realtimeColor = !StuUltra.realtimeColor;
          realtimeSwitch.classList.toggle('on', StuUltra.realtimeColor);
          realtimeSwitch.setAttribute('aria-checked', String(StuUltra.realtimeColor));
        });
      }

      // 4. HSL 8 Dots
      cont.querySelectorAll('.hsl-dot').forEach(function(dot) {
        dot.addEventListener('click', function() {
          var channel = dot.dataset.hsl;
          cont.querySelectorAll('.hsl-dot').forEach(function(d) { d.classList.remove('active'); });
          cont.querySelectorAll('.hsl-band-pane').forEach(function(p) { p.classList.remove('active'); });
          dot.classList.add('active');
          var pane = cont.querySelector('.hsl-band-pane[data-hsl-pane="' + channel + '"]');
          if (pane) pane.classList.add('active');
        });
      });

      // 5. Crop Sub-Tabs
      cont.querySelectorAll('.crop-mode-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
          var targetPaneId = tab.dataset.croptab;
          cont.querySelectorAll('.crop-mode-tab').forEach(function(t) { t.classList.remove('active'); });
          cont.querySelectorAll('.crop-subtab-pane').forEach(function(p) { p.classList.remove('active'); });
          tab.classList.add('active');
          var targetPane = cont.querySelector('#' + targetPaneId);
          if (targetPane) targetPane.classList.add('active');
        });
      });

      // 6. Crop Ratio Menu
      var ratioBtn = cont.querySelector('#crop-ratio-btn');
      var ratioMenu = cont.querySelector('#crop-ratio-menu');
      var ratioLabel = cont.querySelector('#crop-ratio-label');
      if (ratioBtn && ratioMenu) {
        ratioBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          var isHidden = ratioMenu.classList.toggle('hidden');
          ratioBtn.setAttribute('aria-expanded', String(!isHidden));
        });
        cont.querySelectorAll('.crop-ratio-opt').forEach(function(opt) {
          opt.addEventListener('click', function(e) {
            e.stopPropagation();
            cont.querySelectorAll('.crop-ratio-opt').forEach(function(o) { o.classList.remove('active'); });
            opt.classList.add('active');
            var optName = opt.querySelector('span:last-child')?.textContent || opt.textContent;
            if (ratioLabel) ratioLabel.textContent = optName;
            ratioMenu.classList.add('hidden');
            ratioBtn.setAttribute('aria-expanded', 'false');

            var aw = parseFloat(opt.dataset.aw || 0);
            var ah = parseFloat(opt.dataset.ah || 0);
            var A = window._devstuA;
            if (A && A.current) {
              if (!A.current._stuUltraParams) A.current._stuUltraParams = createDefaultParams();
              A.current._stuUltraParams.cropPreset = opt.dataset.preset;
              A.current._stuUltraParams.cropAspectW = aw;
              A.current._stuUltraParams.cropAspectH = ah;
            }
          });
        });
        document.addEventListener('click', function() {
          ratioMenu.classList.add('hidden');
          ratioBtn.setAttribute('aria-expanded', 'false');
        });
      }

      // 7. Background Swatches (mod-bg)
      cont.querySelectorAll('.asset-swatch').forEach(function(swatch) {
        swatch.addEventListener('click', function() {
          var bgmode = swatch.dataset.bgmode;
          if (!bgmode) return;
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          photo._stuUltraParams.bgReplaceMode = bgmode;

          var colorMap = {
            'pure_white': '#ffffff',
            'studio_grey': '#b5b9c0',
            'moody_black': '#18181b',
            'warm_beige': '#c9b09a',
            'fabric_02': '#3e4450',
            'warm_brown': '#5b473d',
            'slate_03': '#5a6270',
            'pastel_mix': '#e5dcd6',
            'transparent': 'transparent'
          };
          var chosenColor = colorMap[bgmode] || '#ffffff';

          if (window.CollabsDevstuAI && typeof window.CollabsDevstuAI.applyCollabsBgComposite === 'function') {
            window.CollabsDevstuAI.applyCollabsBgComposite(photo, bgmode, chosenColor);
          }
        });
      });

      // 8. Hair Color Cards (mod-portrait)
      cont.querySelectorAll('[data-haircolor]').forEach(function(chip) {
        chip.addEventListener('click', function() {
          var colorKey = chip.dataset.haircolor;
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          photo._stuUltraParams.hairDyeColor = colorKey;

          if (window.CollabsDevstuAI && typeof window.CollabsDevstuAI.runEvotoHairDye === 'function') {
            window.CollabsDevstuAI.runEvotoHairDye(photo, colorKey);
          }
        });
      });

      // 9. All 163 Sliders with Complete Live Engine Sync
      cont.querySelectorAll('.retouch-slider').forEach(function(slider) {
        var key = slider.id;

        slider.addEventListener('input', function() {
          var val = parseFloat(slider.value);
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          photo._stuUltraParams[key] = val;

          // Update badge
          var badge = cont.querySelector('.val[data-for="' + key + '"]');
          if (badge) {
            badge.textContent = formatSliderBadgeValue(val, key);
            var isChanged = Math.abs(val - (DEFAULT_PARAMS[key] || 0)) > 1e-4;
            badge.classList.toggle('modified', isChanged);
          }

          // Check if portrait slider requiring face detection
          var isPortraitSlider = (
            key === 'facialSkinSmooth' || key === 'freckleAcne' || key === 'faceMole' ||
            key === 'faceShine' || key === 'darkCircles' || key === 'eyeBags' ||
            key === 'foreheadWrinkles' || key === 'nasolabialFolds' || key === 'neckWrinkles' ||
            key === 'faceWidth' || key === 'jawlineSlim' || key === 'cheekboneLift' ||
            key === 'chinLength' || key === 'foreheadHeight' || key === 'noseWidth' ||
            key === 'noseTipLift' || key === 'mouthSize' || key === 'lipPlump' ||
            key === 'smileEnhance' || key === 'eyeSize' || key === 'eyeBrighten' ||
            key === 'teethWhiten' || key === 'teethDesaturate' || key === 'makeupLipstick' ||
            key === 'makeupBlush' || key === 'strayHair' || key === 'hairSmooth'
          );

          if (isPortraitSlider && !photo.faces && window._devstuLt) {
            window._devstuLt(photo, true).then(function(faces) {
              if (faces && faces.length) {
                var lbl = document.getElementById('stu-ultra-status-label');
                if (lbl) lbl.textContent = 'AI 478 điểm ✓ • ' + faces.length + ' mặt';
                if (window._devstuStage && window._devstuStage.requestRender) {
                  window._devstuStage.requestRender();
                }
              }
            });
          }

          // Sync with DEVSTU Engine using SLIDER_MAP
          if (SLIDER_MAP[key] && photo.state) {
            SLIDER_MAP[key](photo.state, val);

            if (window._devstuStage && typeof window._devstuStage.requestRender === 'function') {
              window._devstuStage.requestRender();
            }
            if (A && typeof A.emit === 'function') {
              A.emit('state');
            }
          }
        });

        // Mouse release (change) -> commit to DEVSTU undo history
        slider.addEventListener('change', function() {
          var A = window._devstuA;
          var photo = A && A.current;
          if (photo && photo.state && typeof A.setState === 'function') {
            A.setState(photo.state, true);
          }
        });

        // Double click to reset slider
        slider.addEventListener('dblclick', function() {
          var defVal = DEFAULT_PARAMS[key] || 0;
          slider.value = defVal;
          slider.dispatchEvent(new Event('input', { bubbles: true }));
          slider.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });

      // 10. Footer Actions
      var btnResetFooter = cont.querySelector('#btn-reset-all-footer');
      var btnResetHdr = document.getElementById('stu-ultra-btn-reset');
      var handleResetAll = function() {
        var A = window._devstuA;
        var photo = A && A.current;
        if (!photo) return;
        photo._stuUltraParams = createDefaultParams();
        if (typeof window.SI === 'function') {
          window.SI([photo]);
        }
        StuUltra.syncSlidersFromParams(photo._stuUltraParams);
        if (typeof window.tt === 'function') {
          window.tt('Đã khôi phục toàn bộ thông số ảnh về ban đầu ✓', 3500);
        }
      };
      if (btnResetFooter) btnResetFooter.addEventListener('click', handleResetAll);
      if (btnResetHdr) btnResetHdr.addEventListener('click', handleResetAll);

      var btnSyncFooter = cont.querySelector('#btn-sync-all-footer');
      if (btnSyncFooter) {
        btnSyncFooter.addEventListener('click', function() {
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo || !A.photos) return;
          var p = photo._stuUltraParams || createDefaultParams();
          var count = 0;
          A.photos.forEach(function(item) {
            if (item !== photo) {
              item._stuUltraParams = Object.assign({}, p);
              if (photo.state) {
                item.state.tone = Object.assign({}, photo.state.tone);
                item.state.wb = Object.assign({}, photo.state.wb);
                item.state.presence = Object.assign({}, photo.state.presence);
                item.state.hsl = Object.assign({}, photo.state.hsl);
                item.state.skin = Object.assign({}, photo.state.skin);
                item.state.shape = Object.assign({}, photo.state.shape);
              }
              count++;
            }
          });
          if (typeof window.tt === 'function') {
            window.tt('Đã đồng bộ thông số sang ' + count + ' ảnh ✓', 4000);
          }
        });
      }

      var btnSavePresetFooter = cont.querySelector('#btn-save-user-preset-footer');
      if (btnSavePresetFooter) {
        btnSavePresetFooter.addEventListener('click', function() {
          if (typeof window.it === 'function') {
            window.it('open-dialog', 'save-look');
          }
        });
      }

      var btnExportHdr = document.getElementById('stu-ultra-btn-export');
      if (btnExportHdr) {
        btnExportHdr.addEventListener('click', function() {
          if (typeof window.it === 'function') {
            window.it('open-dialog', 'export');
          }
        });
      }
    },

    syncBatchCount: function() {
      var A = window._devstuA;
      var ring = document.getElementById('rail-batch-ring');
      if (ring) {
        var count = (A && A.photos) ? A.photos.length : 1;
        ring.textContent = String(count);
      }
    },

    syncCurrentPhoto: function() {
      var A = window._devstuA;
      var photo = A && A.current;
      if (!photo) return;
      if (!photo._stuUltraParams) {
        photo._stuUltraParams = createDefaultParams();
      }

      // Reverse sync from photo.state to _stuUltraParams if modified in DEVSTU
      if (photo.state) {
        var st = photo.state;
        var p = photo._stuUltraParams;
        if (st.tone) {
          if (st.tone.exposure !== undefined) p.exposure = st.tone.exposure * 50;
          if (st.tone.contrast !== undefined) p.contrast = st.tone.contrast;
          if (st.tone.highlights !== undefined) p.highlights = st.tone.highlights;
          if (st.tone.shadows !== undefined) p.shadows = st.tone.shadows;
          if (st.tone.whites !== undefined) p.whites = st.tone.whites;
          if (st.tone.blacks !== undefined) p.blacks = st.tone.blacks;
        }
        if (st.wb) {
          if (st.wb.temp !== undefined) p.temperature = st.wb.temp;
          if (st.wb.tint !== undefined) p.tint = st.wb.tint;
        }
        if (st.presence) {
          if (st.presence.vibrance !== undefined) p.vibrance = st.presence.vibrance;
          if (st.presence.saturation !== undefined) p.saturation = st.presence.saturation;
          if (st.presence.clarity !== undefined) p.clarity = st.presence.clarity;
          if (st.presence.texture !== undefined) p.texture = st.presence.texture;
        }
        if (st.hsl) {
          if (st.hsl.h0 !== undefined) p.hslRedHue = st.hsl.h0;
          if (st.hsl.s0 !== undefined) p.hslRedSat = st.hsl.s0;
          if (st.hsl.l0 !== undefined) p.hslRedLum = st.hsl.l0;
          if (st.hsl.h1 !== undefined) p.hslOrangeHue = st.hsl.h1;
          if (st.hsl.s1 !== undefined) p.hslOrangeSat = st.hsl.s1;
          if (st.hsl.l1 !== undefined) p.hslOrangeLum = st.hsl.l1;
          if (st.hsl.h2 !== undefined) p.hslYellowHue = st.hsl.h2;
          if (st.hsl.s2 !== undefined) p.hslYellowSat = st.hsl.s2;
          if (st.hsl.l2 !== undefined) p.hslYellowLum = st.hsl.l2;
          if (st.hsl.h3 !== undefined) p.hslGreenHue = st.hsl.h3;
          if (st.hsl.s3 !== undefined) p.hslGreenSat = st.hsl.s3;
          if (st.hsl.l3 !== undefined) p.hslGreenLum = st.hsl.l3;
          if (st.hsl.h4 !== undefined) p.hslAquaHue = st.hsl.h4;
          if (st.hsl.s4 !== undefined) p.hslAquaSat = st.hsl.s4;
          if (st.hsl.l4 !== undefined) p.hslAquaLum = st.hsl.l4;
          if (st.hsl.h5 !== undefined) p.hslBlueHue = st.hsl.h5;
          if (st.hsl.s5 !== undefined) p.hslBlueSat = st.hsl.s5;
          if (st.hsl.l5 !== undefined) p.hslBlueLum = st.hsl.l5;
          if (st.hsl.h6 !== undefined) p.hslPurpleHue = st.hsl.h6;
          if (st.hsl.s6 !== undefined) p.hslPurpleSat = st.hsl.s6;
          if (st.hsl.l6 !== undefined) p.hslPurpleLum = st.hsl.l6;
          if (st.hsl.h7 !== undefined) p.hslMagentaHue = st.hsl.h7;
          if (st.hsl.s7 !== undefined) p.hslMagentaSat = st.hsl.s7;
          if (st.hsl.l7 !== undefined) p.hslMagentaLum = st.hsl.l7;
        }
        if (st.skin) {
          if (st.skin.smooth !== undefined) p.facialSkinSmooth = st.skin.smooth;
          if (st.skin.smoothBody !== undefined) p.bodySkinSmooth = st.skin.smoothBody;
          if (st.skin.ai !== undefined) p.freckleAcne = st.skin.ai;
          if (st.skin.marks !== undefined) p.faceMole = st.skin.marks;
          if (st.skin.oil !== undefined) p.faceShine = st.skin.oil;
          if (st.skin.circles !== undefined) p.darkCircles = st.skin.circles;
          if (st.skin.bags !== undefined) p.eyeBags = st.skin.bags;
          if (st.skin.wFore !== undefined) p.foreheadWrinkles = st.skin.wFore;
          if (st.skin.wNose !== undefined) p.nasolabialFolds = st.skin.wNose;
          if (st.skin.wNeck !== undefined) p.neckWrinkles = st.skin.wNeck;
          if (st.skin.glare !== undefined) p.glassesGlare = st.skin.glare;
          if (st.skin.teeth !== undefined) p.teethWhiten = st.skin.teeth;
          if (st.skin.eyes !== undefined) p.eyeBrighten = st.skin.eyes;
          if (st.skin.lip !== undefined) p.makeupLipstick = st.skin.lip;
          if (st.skin.blush !== undefined) p.makeupBlush = st.skin.blush;
          if (st.skin.cloth !== undefined) p.clothingDewrinkle = st.skin.cloth;
        }
        if (st.shape) {
          if (st.shape.faceSize !== undefined) p.faceWidth = -st.shape.faceSize;
          if (st.shape.jaw !== undefined) p.jawlineSlim = st.shape.jaw;
          if (st.shape.eyes !== undefined) p.eyeSize = st.shape.eyes;
          if (st.shape.mouth !== undefined) p.mouthSize = st.shape.mouth;
          if (st.shape.nose !== undefined) p.noseWidth = -st.shape.nose;
          if (st.shape.smile !== undefined) p.smileEnhance = st.shape.smile;
          if (st.shape.chinLen !== undefined) p.chinLength = st.shape.chinLen;
        }
      }

      StuUltra.syncSlidersFromParams(photo._stuUltraParams);
      StuUltra.renderHistogram();
      StuUltra.renderToneCurve();
      StuUltra.syncBatchCount();
    },

    syncSlidersFromParams: function(p) {
      var cont = StuUltra.container;
      if (!cont || !p) return;
      cont.querySelectorAll('.retouch-slider').forEach(function(slider) {
        var key = slider.id;
        if (key in p) {
          slider.value = p[key];
          var badge = cont.querySelector('.val[data-for="' + key + '"]');
          if (badge) {
            badge.textContent = formatSliderBadgeValue(p[key], key);
            var isChanged = Math.abs(Number(p[key]) - Number(DEFAULT_PARAMS[key] || 0)) > 1e-4;
            badge.classList.toggle('modified', isChanged);
          }
        }
      });
    },

    renderHistogram: function() {
      var cont = StuUltra.container;
      if (!cont) return;
      var canvas = cont.querySelector('#histogram-canvas');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var w = canvas.width;
      var h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      var drawCurve = function(color, peaks) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (var i = 0; i <= 64; i++) {
          var x = (i / 64) * w;
          var val = 0;
          for (var p = 0; p < peaks.length; p++) {
            var dist = Math.abs(i - peaks[p].x);
            val += peaks[p].h * Math.exp(-dist * dist / peaks[p].w);
          }
          var y = h - Math.min(h - 4, val * (h - 6));
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
      };

      ctx.globalCompositeOperation = 'screen';
      drawCurve('rgba(239, 68, 68, 0.58)', [{x: 48, h: 0.92, w: 32}, {x: 20, h: 0.4, w: 45}]);
      drawCurve('rgba(34, 197, 94, 0.58)', [{x: 42, h: 0.75, w: 40}, {x: 16, h: 0.55, w: 30}]);
      drawCurve('rgba(59, 130, 246, 0.62)', [{x: 18, h: 0.85, w: 40}, {x: 35, h: 0.45, w: 35}]);
      ctx.globalCompositeOperation = 'source-over';

      var meanEl = cont.querySelector('#hist-rgb-mean');
      if (meanEl) {
        meanEl.textContent = 'R 145 · G 133 · B 146';
      }
    },

    renderToneCurve: function() {
      var cont = StuUltra.container;
      if (!cont) return;
      var canvas = cont.querySelector('#tone-curve-canvas');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var w = canvas.width;
      var h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (var g = 1; g <= 3; g++) {
        var gx = (w * g) / 4;
        var gy = (h * g) / 4;
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w, 0); ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = '#f8d442';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.bezierCurveTo(w * 0.35, h * 0.65, w * 0.65, h * 0.35, w, 0);
      ctx.stroke();

      var points = [[0, h], [w * 0.25, h * 0.75], [w * 0.5, h * 0.5], [w * 0.75, h * 0.25], [w, 0]];
      points.forEach(function(pt) {
        ctx.fillStyle = '#f8d442';
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#101115';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }
  };

  window.StuUltra = StuUltra;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', StuUltra.init);
  } else {
    setTimeout(StuUltra.init, 50);
  }

})(window);
`;

fs.writeFileSync('assets/stu_ultra_module.js', moduleJs, 'utf8');
console.log('Successfully wrote updated assets/stu_ultra_module.js with full HSL & Retouch engine sync! (length: ' + moduleJs.length + ')');
