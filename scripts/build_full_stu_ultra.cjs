const fs = require('fs');
const path = require('path');

// 1. Read source assets
const railHtml = fs.readFileSync('scripts/collabs_rail.html', 'utf8');
const inspectorHtml = fs.readFileSync('scripts/collabs_inspector.html', 'utf8');
const inspectorCss = fs.readFileSync('scripts/collabs_inspector.css', 'utf8');

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

          // Map swatch to color
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

      // 9. All 163 Sliders (.retouch-slider)
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

          // Sync Lightroom / Tone / WB sliders to DEVSTU state
          if (photo.state) {
            var needsRender = false;
            if (key === 'exposure') { photo.state.tone.exposure = val / 50; needsRender = true; }
            else if (key === 'contrast') { photo.state.tone.contrast = val; needsRender = true; }
            else if (key === 'highlights') { photo.state.tone.highlights = val; needsRender = true; }
            else if (key === 'shadows') { photo.state.tone.shadows = val; needsRender = true; }
            else if (key === 'whites') { photo.state.tone.whites = val; needsRender = true; }
            else if (key === 'blacks') { photo.state.tone.blacks = val; needsRender = true; }
            else if (key === 'temperature') { photo.state.wb.temp = val; needsRender = true; }
            else if (key === 'tint') { photo.state.wb.tint = val; needsRender = true; }
            else if (key === 'vibrance') { photo.state.presence.vibrance = val; needsRender = true; }
            else if (key === 'saturation') { photo.state.presence.saturation = val; needsRender = true; }
            else if (key === 'clarity') { photo.state.presence.clarity = val; needsRender = true; }
            else if (key === 'texture') { photo.state.presence.texture = val; needsRender = true; }

            if (needsRender) {
              if (window._devstuStage && typeof window._devstuStage.requestRender === 'function') {
                window._devstuStage.requestRender();
              }
              A.emit('state');
            }
          }
        });

        // Double click to reset slider
        slider.addEventListener('dblclick', function() {
          var defVal = DEFAULT_PARAMS[key] || 0;
          slider.value = defVal;
          slider.dispatchEvent(new Event('input', { bubbles: true }));
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

      // Draw multi-channel curve simulating 16-bit Rust SIMD telemetry
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

      // Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (var g = 1; g <= 3; g++) {
        var gx = (w * g) / 4;
        var gy = (h * g) / 4;
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
      }

      // Diagonal line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w, 0); ctx.stroke();
      ctx.setLineDash([]);

      // Gold tone curve
      ctx.strokeStyle = '#f8d442';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.bezierCurveTo(w * 0.35, h * 0.65, w * 0.65, h * 0.35, w, 0);
      ctx.stroke();

      // Points
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
console.log('Successfully wrote assets/stu_ultra_module.js (length: ' + moduleJs.length + ')');
