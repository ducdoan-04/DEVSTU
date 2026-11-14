const fs = require('fs');
const path = require('path');

// 1. Read source assets from Collabs Retouch Pro
const railHtml = fs.readFileSync('scripts/collabs_rail.html', 'utf8');
const inspectorHtml = fs.readFileSync('scripts/collabs_inspector.html', 'utf8');
const serializedRail = JSON.stringify(railHtml);
const serializedInspector = JSON.stringify(inspectorHtml);

// 2. Generate assets/stu_ultra_module.js with native Collabs-Retouch-Pro Rust SIMD integration
const moduleJs = `// assets/stu_ultra_module.js - DEVSTU STU Ultra with Collabs-Retouch-Pro Rust SIMD Engine
// Complete 5-module Inspector + Split-View Viewport + 100% Rust Backend Algorithm Integration

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
    gradeMidHue: 120, gradeMidSat: 0,
    gradeGlobalHue: 45, gradeGlobalSat: 0,
    gradeShadowLum: 0, gradeMidLum: 0, gradeHighLum: 0, gradeGlobalLum: 0,
    gradeBlending: 50, gradeBalance: 0,
    treatment: 'color',
    bwRed: 0, bwOrange: 0, bwYellow: 0, bwGreen: 0, bwAqua: 0, bwBlue: 0, bwPurple: 0, bwMagenta: 0,

    aiDenoise: 0, nrDetail: 50, noiseReduction: 0, nrColor: 0,
    sharpenAmount: 0, sharpenRadius: 1, sharpenDetail: 25, sharpenMasking: 0,
    filmGrain: 0, grainSize: 25, grainRoughness: 50,
    vignette: 0, vignetteMidpoint: 50, vignetteRoundness: 0, vignetteFeather: 50, vignetteHighlights: 0,
    opticsDistortion: 0, opticsVignetting: 0, opticsVignettingMidpoint: 50, opticsCaRed: 0, opticsCaBlue: 0,
    lutPreset: 'none',

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
    flipVertical: false,
    isHighresMatte: false
  };

  var RETOUCH_PRESETS = {
    clean_natural: {
      freckleAcne: 55, faceShine: 35, darkCircles: 45, dodgeBurnEven: 35, dodgeBurnSculpt: 22,
      freqSepLow: 42, freqSepHigh: 84, skinRadiance: 22, eyeBrighten: 38, catchlightBoost: 28,
      redVeins: 35, teethWhiten: 35, exposure: 4, contrast: 6, highlights: -8, shadows: 12, vibrance: 10,
      lutPreset: 'clean_portrait'
    },
    high_fashion: {
      freckleAcne: 85, faceMole: 60, faceShine: 65, darkCircles: 70, eyeBags: 55, nasolabialFolds: 45,
      dodgeBurnEven: 68, dodgeBurnSculpt: 65, freqSepLow: 68, freqSepHigh: 84, unifyComplexion: 55,
      skinRadiance: 35, jawlineSlim: 16, cheekboneLift: 18, eyeSize: 10, eyeBrighten: 60, catchlightBoost: 50,
      teethWhiten: 55, makeupHighlight: 42, makeupContour: 38, makeupLipstick: 30, strayHair: 55,
      hairShine: 48, contrast: 14, clarity: 14, sharpenAmount: 20, lutPreset: 'clean_portrait'
    },
    glamour_makeup: {
      freckleAcne: 70, freqSepLow: 58, freqSepHigh: 82, dodgeBurnSculpt: 50, skinRadiance: 38, skinRosy: 16,
      darkCircles: 60, eyeBrighten: 55, eyebrowThickness: 26, eyebrowLift: 14, lipPlump: 20, smileEnhance: 16,
      makeupHighlight: 50, makeupContour: 46, makeupBlush: 58, makeupEyeshadow: 45, makeupLipstick: 65,
      makeupLipTint: 'berry', hairVolume: 25, hairShine: 42
    },
    wedding_luminous: {
      freckleAcne: 50, faceShine: 38, darkCircles: 48, freqSepLow: 48, freqSepHigh: 85, skinRadiance: 42,
      skinWarmth: 16, eyeBrighten: 42, teethWhiten: 48, smileEnhance: 14, exposure: 8, highlights: -14,
      shadows: 20, temperature: 12, vibrance: 14, lutPreset: 'warm_wedding'
    },
    corporate_exec: {
      freckleAcne: 60, faceShine: 70, glassesGlare: 45, darkCircles: 65, eyeBags: 50, doubleChin: 30,
      freqSepLow: 38, freqSepHigh: 88, dodgeBurnEven: 42, eyeBrighten: 45, redVeins: 50, teethWhiten: 45,
      strayHair: 65, clothingDewrinkle: 75, clothingLintClean: 55, backdropClean: 60, bgBlurBokeh: 35,
      contrast: 10, lutPreset: 'clean_portrait'
    },
    passport_id: {
      freckleAcne: 48, faceShine: 60, darkCircles: 50, freqSepLow: 32, strayHair: 80, clothingDewrinkle: 65,
      backdropClean: 85, bgReplaceMode: 'pure_white', exposure: 5, contrast: 6
    },
    cinematic_film: {
      freckleAcne: 50, freqSepLow: 42, dodgeBurnSculpt: 50, eyeBrighten: 55, contrast: 20, highlights: -18,
      shadows: 12, clarity: 20, gradeShadowHue: 205, gradeShadowSat: 35, gradeHighHue: 36, gradeHighSat: 30,
      bgBlurBokeh: 50, vignette: 32, lutPreset: 'cinematic_teal'
    },
    bw_dramatic: {
      freckleAcne: 60, freqSepLow: 45, dodgeBurnSculpt: 70, eyeBrighten: 65, contrast: 28, highlights: -14,
      whites: 18, blacks: -18, clarity: 32, sharpenAmount: 22, filmGrain: 25, vignette: 38, lutPreset: 'bw_studio'
    }
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

  function getPhotoOriginalDataUrl(photo) {
    return new Promise(function(resolve) {
      if (!photo) return resolve(null);
      if (photo._cachedOriginalDataUrl) {
        return resolve(photo._cachedOriginalDataUrl);
      }
      var blob = photo.file || (photo.src && photo.src.blob);
      if (blob) {
        var reader = new FileReader();
        reader.onload = function() {
          photo._cachedOriginalDataUrl = reader.result;
          resolve(reader.result);
        };
        reader.onerror = function() { resolve(null); };
        reader.readAsDataURL(blob);
      } else {
        resolve(null);
      }
    });
  }

  var RAIL_HTML = ` + serializedRail + `;
  var INSPECTOR_HTML = ` + serializedInspector + `;

  var StuUltra = {
    container: null,
    inspector: null,
    rail: null,
    headerRight: null,
    viewport: null,
    afterCanvas: null,
    beforeCanvas: null,
    splitLine: null,
    activeModule: 'mod-portrait',
    histOpen: true,
    realtimeColor: true,
    splitRatio: 0.5,
    isDraggingSplit: false,
    isProcessing: false,
    pendingProcess: false,

    init: function() {
      if (document.getElementById('stu-ultra-container')) return;

      var appBody = document.querySelector('.body') || document.getElementById('app');
      if (!appBody) {
        setTimeout(StuUltra.init, 100);
        return;
      }

      // 1. Create Inspector + Rail Container
      var cont = document.createElement('div');
      cont.id = 'stu-ultra-container';
      cont.className = 'stu-ultra-container';
      cont.innerHTML = INSPECTOR_HTML + RAIL_HTML;
      appBody.appendChild(cont);
      StuUltra.container = cont;
      StuUltra.inspector = cont.querySelector('.retouch-right-inspector');
      StuUltra.rail = cont.querySelector('.retouch-right-rail');

      // 2. Inject STU Ultra Viewport into .viewport
      StuUltra.initViewport();

      // 3. Create Header Right Controls
      var hdr = document.querySelector('.hdr');
      if (hdr && !document.getElementById('stu-ultra-header-right')) {
        var hrDiv = document.createElement('div');
        hrDiv.id = 'stu-ultra-header-right';
        hrDiv.className = 'stu-ultra-header-right';
        hrDiv.innerHTML = '<div class="stu-ultra-status-pill" title="Bộ xử lý Collabs-Retouch-Pro Rust SIMD & AI 478 điểm">' +
          '<span class="stu-ultra-status-dot"></span>' +
          '<span id="stu-ultra-status-label">AI 478 điểm ✓ • Rust SIMD Sẵn sàng</span>' +
          '</div>' +
          '<button id="stu-ultra-btn-reset" type="button" class="stu-ultra-btn-reset" title="Khôi phục toàn bộ ảnh về ban đầu">Đặt lại</button>' +
          '<button id="stu-ultra-btn-export" type="button" class="stu-ultra-btn-export" title="Xuất ảnh chất lượng cao 4K qua Rust SIMD">Xuất</button>';
        
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

      StuUltra.onModeChange();
    },

    initViewport: function() {
      var vp = document.querySelector('.viewport');
      if (!vp || document.getElementById('stu-ultra-viewport')) return;

      var vDiv = document.createElement('div');
      vDiv.id = 'stu-ultra-viewport';
      vDiv.className = 'stu-ultra-viewport';
      vDiv.innerHTML = '<div id="stu-ultra-canvas-wrap" class="stu-ultra-canvas-wrap">' +
        '<canvas id="stu-ultra-after-canvas"></canvas>' +
        '<canvas id="stu-ultra-before-canvas"></canvas>' +
        '<div id="stu-ultra-split-line" class="stu-ultra-split-line">' +
        '<div class="stu-ultra-split-pill tag-before">Trước</div>' +
        '<div class="stu-ultra-split-knob">' +
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>' +
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</div>' +
        '<div class="stu-ultra-split-pill tag-after">Sau</div>' +
        '</div>' +
        '</div>';

      vp.appendChild(vDiv);
      StuUltra.viewport = vDiv;
      StuUltra.afterCanvas = vDiv.querySelector('#stu-ultra-after-canvas');
      StuUltra.beforeCanvas = vDiv.querySelector('#stu-ultra-before-canvas');
      StuUltra.splitLine = vDiv.querySelector('#stu-ultra-split-line');

      // Bind split-line drag
      var onSplitMove = function(clientX) {
        if (!StuUltra.isDraggingSplit) return;
        var wrap = document.getElementById('stu-ultra-canvas-wrap');
        if (!wrap) return;
        var rect = wrap.getBoundingClientRect();
        if (rect.width <= 0) return;
        var ratio = (clientX - rect.left) / rect.width;
        StuUltra.splitRatio = Math.max(0.01, Math.min(0.99, ratio));
        StuUltra.updateSplitRender();
      };

      StuUltra.splitLine.addEventListener('mousedown', function(e) {
        e.preventDefault();
        StuUltra.isDraggingSplit = true;
      });

      window.addEventListener('mousemove', function(e) {
        if (StuUltra.isDraggingSplit) {
          onSplitMove(e.clientX);
        }
      });

      window.addEventListener('mouseup', function() {
        StuUltra.isDraggingSplit = false;
      });

      StuUltra.splitLine.addEventListener('touchstart', function(e) {
        if (e.touches && e.touches[0]) {
          StuUltra.isDraggingSplit = true;
        }
      });

      window.addEventListener('touchmove', function(e) {
        if (StuUltra.isDraggingSplit && e.touches && e.touches[0]) {
          onSplitMove(e.touches[0].clientX);
        }
      });

      window.addEventListener('touchend', function() {
        StuUltra.isDraggingSplit = false;
      });

      StuUltra.splitLine.addEventListener('dblclick', function() {
        StuUltra.splitRatio = 0.5;
        StuUltra.updateSplitRender();
      });
    },

    updateSplitRender: function() {
      if (!StuUltra.splitLine || !StuUltra.beforeCanvas || !StuUltra.loadedBeforeImg) return;
      var ratio = StuUltra.splitRatio;
      StuUltra.splitLine.style.left = (ratio * 100) + '%';

      var bw = StuUltra.beforeCanvas.width;
      var bh = StuUltra.beforeCanvas.height;
      if (bw <= 0 || bh <= 0) return;

      var ctx = StuUltra.beforeCanvas.getContext('2d');
      ctx.clearRect(0, 0, bw, bh);
      var splitX = Math.round(bw * ratio);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, bh);
      ctx.clip();
      ctx.drawImage(StuUltra.loadedBeforeImg, 0, 0, bw, bh);
      ctx.restore();
    },

    renderViewport: function(photo) {
      if (!StuUltra.afterCanvas || !StuUltra.beforeCanvas) return;
      var originalUrl = photo._cachedOriginalDataUrl;
      var processedUrl = photo.processedDataUrl || originalUrl;
      if (!originalUrl) return;

      var beforeImg = new Image();
      var afterImg = new Image();
      var loadedCount = 0;
      var onBothLoaded = function() {
        var w = afterImg.naturalWidth || beforeImg.naturalWidth;
        var h = afterImg.naturalHeight || beforeImg.naturalHeight;
        if (!w || !h) return;

        StuUltra.afterCanvas.width = w;
        StuUltra.afterCanvas.height = h;
        StuUltra.beforeCanvas.width = w;
        StuUltra.beforeCanvas.height = h;

        var afterCtx = StuUltra.afterCanvas.getContext('2d');
        afterCtx.clearRect(0, 0, w, h);
        afterCtx.drawImage(afterImg, 0, 0, w, h);

        StuUltra.loadedBeforeImg = beforeImg;
        StuUltra.updateSplitRender();
      };

      beforeImg.onload = function() {
        loadedCount++;
        if (loadedCount === 2) onBothLoaded();
      };
      afterImg.onload = function() {
        loadedCount++;
        if (loadedCount === 2) onBothLoaded();
      };

      beforeImg.src = originalUrl;
      afterImg.src = processedUrl;
    },

    triggerRustProcess: function(photo, highQuality) {
      if (!photo) return;
      if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();

      if (StuUltra.isProcessing) {
        StuUltra.pendingProcess = true;
        return;
      }

      StuUltra.isProcessing = true;
      getPhotoOriginalDataUrl(photo).then(function(originalDataUrl) {
        if (!originalDataUrl) {
          StuUltra.isProcessing = false;
          return;
        }

        var statusLabel = document.getElementById('stu-ultra-status-label');
        if (statusLabel) statusLabel.textContent = 'Đang xử lý Rust SIMD...';

        fetch('/api/process_photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: originalDataUrl,
            params: photo._stuUltraParams,
            highQuality: Boolean(highQuality)
          })
        }).then(function(res) {
          return res.json();
        }).then(function(data) {
          StuUltra.isProcessing = false;
          if (data && data.ok && data.dataUrl) {
            photo.processedDataUrl = data.dataUrl;
            if (statusLabel) {
              statusLabel.textContent = 'AI 478 điểm ✓ • Rust SIMD • ' + data.elapsedMs + 'ms';
            }
            StuUltra.renderViewport(photo);
            StuUltra.renderHistogramFromDataUrl(data.dataUrl);
          }
          if (StuUltra.pendingProcess) {
            StuUltra.pendingProcess = false;
            StuUltra.triggerRustProcess(photo, false);
          }
        }).catch(function(err) {
          StuUltra.isProcessing = false;
          console.error('[STU Ultra] Rust SIMD error:', err);
          if (StuUltra.pendingProcess) {
            StuUltra.pendingProcess = false;
            StuUltra.triggerRustProcess(photo, false);
          }
        });
      });
    },

    applyPreset: function(presetKey) {
      var presetValues = RETOUCH_PRESETS[presetKey];
      var A = window._devstuA;
      var photo = A && A.current;
      if (!photo || !presetValues) return;
      if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
      var fresh = createDefaultParams();
      fresh.face = photo._stuUltraParams.face;
      fresh.blemishSpots = photo._stuUltraParams.blemishSpots;
      photo._stuUltraParams = Object.assign({}, fresh, presetValues);
      StuUltra.syncSlidersFromParams(photo._stuUltraParams);
      StuUltra.triggerRustProcess(photo, false);
      if (typeof window.tt === 'function') {
        window.tt('Đã áp dụng cài sẵn ' + presetKey + ' qua Rust SIMD ✓', 3000);
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
        StuUltra.initViewport();
        StuUltra.syncCurrentPhoto();
        StuUltra.renderToneCurve();
        var photo = A && A.current;
        if (photo) {
          getPhotoOriginalDataUrl(photo).then(function() {
            StuUltra.triggerRustProcess(photo, false);
          });
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
            var photo = A && A.current;
            if (photo) {
              if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
              photo._stuUltraParams.cropPreset = opt.dataset.preset;
              photo._stuUltraParams.cropAspectW = aw;
              photo._stuUltraParams.cropAspectH = ah;
              StuUltra.triggerRustProcess(photo, false);
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
          photo._stuUltraParams.bgCustomColor = colorMap[bgmode] || '#ffffff';
          StuUltra.triggerRustProcess(photo, false);
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
          photo._stuUltraParams.hairDyeStrength = 65;
          StuUltra.triggerRustProcess(photo, false);
        });
      });

      // 9. All 163 Sliders Hooked to Collabs-Retouch-Pro Rust Engine
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

          if (StuUltra.realtimeColor) {
            StuUltra.triggerRustProcess(photo, false);
          }
        });

        // Mouse release (change) -> always process latest state
        slider.addEventListener('change', function() {
          var A = window._devstuA;
          var photo = A && A.current;
          if (photo) {
            StuUltra.triggerRustProcess(photo, false);
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

      // 10. Left & Inner Preset Card Click Handlers
      document.querySelectorAll('.retouch-preset-item[data-preset]').forEach(function(card) {
        card.addEventListener('click', function(e) {
          var A = window._devstuA;
          if (A && A.mode === 'stu_ultra') {
            e.preventDefault();
            e.stopPropagation();
            document.querySelectorAll('.retouch-preset-item').forEach(function(c) { c.classList.remove('active'); });
            card.classList.add('active');
            var presetKey = card.dataset.preset;
            StuUltra.applyPreset(presetKey);
          }
        }, true);
      });

      // 11. Footer Actions
      var btnResetFooter = cont.querySelector('#btn-reset-all-footer');
      var btnResetHdr = document.getElementById('stu-ultra-btn-reset');
      var handleResetAll = function() {
        var A = window._devstuA;
        var photo = A && A.current;
        if (!photo) return;
        photo._stuUltraParams = createDefaultParams();
        photo.processedDataUrl = null;
        StuUltra.syncSlidersFromParams(photo._stuUltraParams);
        StuUltra.renderViewport(photo);
        var lbl = document.getElementById('stu-ultra-status-label');
        if (lbl) lbl.textContent = 'AI 478 điểm ✓ • Đã đặt lại ảnh gốc';
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
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          var statusLabel = document.getElementById('stu-ultra-status-label');
          if (statusLabel) statusLabel.textContent = 'Đang xuất ảnh 4K qua Rust SIMD...';

          getPhotoOriginalDataUrl(photo).then(function(originalDataUrl) {
            if (!originalDataUrl) return;
            fetch('/api/process_photo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imageBase64: originalDataUrl,
                params: photo._stuUltraParams || createDefaultParams(),
                highQuality: true
              })
            }).then(function(res) {
              return res.json();
            }).then(function(data) {
              if (data && data.ok && data.dataUrl) {
                var a = document.createElement('a');
                a.href = data.dataUrl;
                var baseName = (photo.name || 'retouch').replace(/\\.[^.]+$/, '');
                a.download = baseName + '_STU_Ultra.jpg';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                if (statusLabel) {
                  statusLabel.textContent = 'Xuất hoàn tất 4K ✓ (' + data.elapsedMs + 'ms)';
                }
                if (typeof window.tt === 'function') {
                  window.tt('Đã xuất ảnh chất lượng cao 4K qua Rust SIMD ✓', 4000);
                }
              }
            });
          });
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

      StuUltra.syncSlidersFromParams(photo._stuUltraParams);
      StuUltra.renderToneCurve();
      StuUltra.syncBatchCount();

      getPhotoOriginalDataUrl(photo).then(function() {
        StuUltra.renderViewport(photo);
      });
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
            var isChanged = Math.abs(p[key] - (DEFAULT_PARAMS[key] || 0)) > 1e-4;
            badge.classList.toggle('modified', isChanged);
          }
        }
      });
    },

    renderHistogramFromDataUrl: function(dataUrl) {
      var canvas = document.getElementById('histogram-canvas');
      if (!canvas || !dataUrl) return;
      var ctx = canvas.getContext('2d');
      var img = new Image();
      img.onload = function() {
        var sampleW = 120;
        var sampleH = Math.round(120 * (img.naturalHeight / (img.naturalWidth || 1)));
        var offCanvas = document.createElement('canvas');
        offCanvas.width = sampleW;
        offCanvas.height = sampleH;
        var offCtx = offCanvas.getContext('2d');
        offCtx.drawImage(img, 0, 0, sampleW, sampleH);
        var imgData = offCtx.getImageData(0, 0, sampleW, sampleH).data;

        var rHist = new Float32Array(256);
        var gHist = new Float32Array(256);
        var bHist = new Float32Array(256);
        var totalPx = sampleW * sampleH;
        var sumR = 0, sumG = 0, sumB = 0;

        for (var i = 0; i < imgData.length; i += 4) {
          var r = imgData[i];
          var g = imgData[i + 1];
          var b = imgData[i + 2];
          rHist[r]++;
          gHist[g]++;
          bHist[b]++;
          sumR += r;
          sumG += g;
          sumB += b;
        }

        var meanEl = document.getElementById('hist-rgb-mean');
        if (meanEl) {
          meanEl.textContent = 'R ' + Math.round(sumR / totalPx) + ' · G ' + Math.round(sumG / totalPx) + ' · B ' + Math.round(sumB / totalPx);
        }

        // Find max peak (ignore extreme zero and 255)
        var maxPeak = 1;
        for (var j = 1; j < 255; j++) {
          if (rHist[j] > maxPeak) maxPeak = rHist[j];
          if (gHist[j] > maxPeak) maxPeak = gHist[j];
          if (bHist[j] > maxPeak) maxPeak = bHist[j];
        }

        var w = canvas.width;
        var h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        var drawChannel = function(hist, color) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(0, h);
          for (var x = 0; x < 256; x++) {
            var val = hist[x] / maxPeak;
            var px = (x / 255) * w;
            var py = h - Math.min(h, val * h * 0.95);
            ctx.lineTo(px, py);
          }
          ctx.lineTo(w, h);
          ctx.closePath();
          ctx.fill();
        };

        drawChannel(rHist, 'rgba(239, 68, 68, 0.45)');
        drawChannel(gHist, 'rgba(34, 197, 94, 0.45)');
        drawChannel(bHist, 'rgba(59, 130, 246, 0.45)');
      };
      img.src = dataUrl;
    },

    renderToneCurve: function() {
      var canvas = document.getElementById('tone-curve-canvas');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var w = canvas.width;
      var h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (var g = 1; g <= 3; g++) {
        var gx = (w / 4) * g;
        var gy = (h / 4) * g;
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
        ctx.strokeStyle = '#0f1013';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }
  };

  window.StuUltra = StuUltra;
  window._stuUltraSetSlider = function(key, val) {
    var A = window._devstuA;
    var photo = A && A.current;
    if (!photo) return;
    if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
    photo._stuUltraParams[key] = parseFloat(val);
    var cont = StuUltra.container;
    if (cont) {
      var slider = cont.querySelector('#' + key);
      if (slider) {
        slider.value = val;
        var badge = cont.querySelector('.val[data-for="' + key + '"]');
        if (badge) {
          badge.textContent = formatSliderBadgeValue(val, key);
          badge.classList.toggle('modified', true);
        }
      }
    }
  };
  window._stuUltraTriggerRender = function(highQuality) {
    var A = window._devstuA;
    var photo = A && A.current;
    if (photo) {
      StuUltra.triggerRustProcess(photo, highQuality);
    }
  };
  window._stuUltraApplyPreset = function(presetKey) {
    StuUltra.applyPreset(presetKey);
  };
  window.__STU_ULTRA_ENGINE_STATUS = 'ready';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', StuUltra.init);
  } else {
    StuUltra.init();
  }

})(window);
`;

fs.writeFileSync('assets/stu_ultra_module.js', moduleJs, 'utf8');
console.log('Successfully wrote updated assets/stu_ultra_module.js with Collabs-Retouch-Pro Rust SIMD integration! (length: ' + moduleJs.length + ')');
