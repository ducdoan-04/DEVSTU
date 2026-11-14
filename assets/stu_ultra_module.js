// assets/stu_ultra_module.js - DEVSTU STU Ultra Inspector & Rail Module
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

  var RAIL_HTML = "<nav class=\"retouch-right-rail\" aria-label=\"Thanh công cụ bên phải\">\n          <div class=\"rail-top\">\n            <div class=\"rail-ai-badge\" title=\"Retouch Studio AI 478 điểm + Rust SIMD\">Ai</div>\n            <button class=\"rail-icon-btn\" data-mod=\"mod-color\" data-title=\"Điều chỉnh màu\" title=\"Điều chỉnh màu (HSL, Đường cong, Cân bằng trắng, Khử nhiễu AI)\">\n              <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\">\n                <circle cx=\"13.5\" cy=\"6.5\" r=\"2.2\" />\n                <circle cx=\"17.5\" cy=\"10.5\" r=\"2.2\" />\n                <circle cx=\"8.5\" cy=\"7.5\" r=\"2.2\" />\n                <circle cx=\"6.5\" cy=\"12.5\" r=\"2.2\" />\n                <path d=\"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z\" />\n              </svg>\n            </button>\n            <button class=\"rail-icon-btn active\" data-mod=\"mod-portrait\" data-title=\"Chỉnh sửa chân dung\" title=\"Chỉnh sửa chân dung (Khử mụn, Làm mịn da, Khuôn mặt 3D, Trang điểm, Tóc)\">\n              <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\">\n                <path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\" />\n                <circle cx=\"12\" cy=\"7\" r=\"4\" />\n              </svg>\n            </button>\n            <button class=\"rail-icon-btn\" data-mod=\"mod-bg\" data-title=\"Điều chỉnh phông nền\" title=\"Điều chỉnh phông nền, Thay nền &amp; Đổi bầu trời AI\">\n              <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\">\n                <rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\" />\n                <circle cx=\"9\" cy=\"9\" r=\"2\" />\n                <path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\" />\n              </svg>\n            </button>\n            <button class=\"rail-icon-btn\" data-mod=\"mod-clothing\" data-title=\"Làm đẹp trang phục\" title=\"Làm đẹp trang phục (Ủi phẳng nếp nhăn, Xóa xơ vải, Vết mồ hôi, Khử vân vải AI)\">\n              <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\">\n                <path d=\"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z\" />\n              </svg>\n            </button>\n            <button class=\"rail-icon-btn\" data-mod=\"mod-crop\" data-title=\"Cắt &amp; Xoay\" title=\"Cắt ảnh, Xoay, Định vị AI &amp; Hiệu chỉnh phối cảnh\">\n              <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\">\n                <path d=\"M6 2v14a2 2 0 0 0 2 2h14\" />\n                <path d=\"M18 22V8a2 2 0 0 0-2-2H2\" />\n              </svg>\n            </button>\n          </div>\n\n          <div class=\"rail-bottom\">\n            <div id=\"rail-batch-ring\" class=\"rail-batch-ring\" title=\"Số ảnh đang mở trong phiên\">0</div>\n          </div>\n        </nav>";
  var INSPECTOR_HTML = "<aside class=\"retouch-right-inspector\">\n          <div class=\"right-panel-topheader\">\n            <span id=\"right-module-title\">Chỉnh sửa chân dung</span>\n          </div>\n\n          <div class=\"right-inspector-scroll\">\n            <!-- BIỂU ĐỒ RGB + CHẾ ĐỘ CHỈNH MÀU THỜI GIAN THỰC -->\n            <div class=\"retouch-histogram-block\">\n              <div class=\"hist-collapse-head\" id=\"btn-toggle-histogram\">\n                <span>▾ Biểu đồ</span>\n                <span id=\"hist-exposure-info\">16-bit • Rust SIMD</span>\n              </div>\n              <div id=\"hist-body-wrap\">\n                <div class=\"hist-card-shell\">\n                  <canvas id=\"histogram-canvas\" width=\"290\" height=\"68\"></canvas>\n                  <div class=\"hist-telemetry-row\">\n                    <span>sRGB</span>\n                    <span>RGBA</span>\n                    <span id=\"hist-rgb-mean\">R - · G - · B -</span>\n                  </div>\n                </div>\n              </div>\n              <div class=\"evoto-realtime-row\">\n                <span>Chế độ chỉnh màu thời gian thực</span>\n                <button\n                  id=\"toggle-realtime-color\"\n                  type=\"button\"\n                  role=\"switch\"\n                  aria-checked=\"true\"\n                  class=\"evoto-switch on\"\n                  title=\"Tắt nếu máy xử lý ảnh RAW lớn bị chậm khi kéo nhanh (chỉ xử lý khi thả chuột)\"\n                >\n                  <span class=\"evoto-switch-knob\"></span>\n                </button>\n              </div>\n            </div>\n\n            <!-- MODULE 1: ĐIỀU CHỈNH MÀU (100% ĐỦ TOÀN BỘ THANH TRƯỢT + ĐƯỜNG CONG + HSL + LENS + GRAIN) -->\n            <div id=\"mod-color\" class=\"retouch-module-pane\">\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Bộ lọc &amp; Hồ sơ màu</div>\n                <div class=\"retouch-acc-body\">\n                  <select id=\"lutPreset\" class=\"retouch-select\">\n                    <option value=\"none\">Màu tiêu chuẩn Studio</option>\n                    <option value=\"clean_portrait\">Chân dung thương mại trong trẻo</option>\n                    <option value=\"fuji_pro\">Fujifilm Pro 400H Dịu nhẹ</option>\n                    <option value=\"kodak_gold\">Kodak Portra 400 Ấm áp</option>\n                    <option value=\"cinematic_teal\">Điện ảnh Teal &amp; Cam</option>\n                    <option value=\"warm_wedding\">Ánh vàng Giờ Vàng (Ảnh cưới)</option>\n                    <option value=\"bw_studio\">Phim Đen Trắng Ilford Delta</option>\n                  </select>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ AI Khớp màu (Từ ảnh tham chiếu)</div>\n                <div class=\"retouch-acc-body\">\n                  <div style=\"display: flex; gap: 6px; align-items: center\">\n                    <button id=\"btn-load-color-ref\" class=\"retouch-sync-btn\" style=\"flex: 1\">+ Chọn ảnh mẫu màu</button>\n                    <button id=\"btn-clear-color-ref\" class=\"retouch-sync-btn\" title=\"Xóa ảnh mẫu\">Xóa</button>\n                  </div>\n                  <div class=\"retouch-slider-item\" style=\"margin-top: 4px\">\n                    <div class=\"s-head\"><span>Cường độ khớp màu</span><span class=\"val\" data-for=\"colorMatchStrength\">0</span></div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"colorMatchStrength\" min=\"0\" max=\"100\" value=\"0\" />\n                  </div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Cân bằng trắng</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Nhiệt độ màu (Temp)</span><span class=\"val\" data-for=\"temperature\">0</span></div>\n                    <input type=\"range\" class=\"retouch-slider wb-temp\" id=\"temperature\" min=\"-100\" max=\"100\" value=\"0\" />\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Sắc thái màu (Tint)</span><span class=\"val\" data-for=\"tint\">0</span></div>\n                    <input type=\"range\" class=\"retouch-slider wb-tint\" id=\"tint\" min=\"-100\" max=\"100\" value=\"0\" />\n                  </div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Cơ Bản — Tông màu &amp; Độ nét</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Phơi sáng (Exposure)</span><span class=\"val\" data-for=\"exposure\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"exposure\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tương phản (Contrast)</span><span class=\"val\" data-for=\"contrast\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"contrast\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Vùng sáng (Highlights)</span><span class=\"val\" data-for=\"highlights\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"highlights\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Vùng tối (Shadows)</span><span class=\"val\" data-for=\"shadows\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"shadows\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Điểm trắng (Whites)</span><span class=\"val\" data-for=\"whites\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"whites\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Điểm đen (Blacks)</span><span class=\"val\" data-for=\"blacks\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"blacks\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Kết cấu (Texture)</span><span class=\"val\" data-for=\"texture\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"texture\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ nét cục bộ (Clarity)</span><span class=\"val\" data-for=\"clarity\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"clarity\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử sương mù (Dehaze)</span><span class=\"val\" data-for=\"dehaze\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"dehaze\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ tươi (Vibrance)</span><span class=\"val\" data-for=\"vibrance\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"vibrance\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa (Saturation)</span><span class=\"val\" data-for=\"saturation\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"saturation\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Đường cong tông màu (256-LUT)</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"curve-canvas-box\">\n                    <canvas id=\"tone-curve-canvas\" width=\"268\" height=\"170\" title=\"Nhấp để thêm điểm · Kéo để chỉnh · Nhấp đúp vào điểm để xóa\"></canvas>\n                    <div class=\"curve-toolbar-row\">\n                      <span class=\"curve-hint\">Kéo điểm trên biểu đồ</span>\n                      <button id=\"btn-reset-curve\" class=\"mini-save-btn\">Đặt lại đường cong</button>\n                    </div>\n                  </div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Điểm rất sáng (Highlights)</span><span class=\"val\" data-for=\"curveHighlights\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"curveHighlights\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Vùng sáng vừa (Lights)</span><span class=\"val\" data-for=\"curveLights\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"curveLights\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Vùng tối vừa (Darks)</span><span class=\"val\" data-for=\"curveDarks\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"curveDarks\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Vùng tối sâu (Shadows)</span><span class=\"val\" data-for=\"curveShadows\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"curveShadows\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ HSL 8 Kênh màu</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"hsl-color-dots\" id=\"hsl-band-tabs\">\n                    <button class=\"hsl-dot active\" data-hsl=\"Red\" style=\"background: #ef4444\" title=\"Đỏ\"></button>\n                    <button class=\"hsl-dot\" data-hsl=\"Orange\" style=\"background: #f97316\" title=\"Cam (Tông da)\"></button>\n                    <button class=\"hsl-dot\" data-hsl=\"Yellow\" style=\"background: #eab308\" title=\"Vàng\"></button>\n                    <button class=\"hsl-dot\" data-hsl=\"Green\" style=\"background: #22c55e\" title=\"Xanh lá\"></button>\n                    <button class=\"hsl-dot\" data-hsl=\"Aqua\" style=\"background: #06b6d4\" title=\"Xanh ngọc\"></button>\n                    <button class=\"hsl-dot\" data-hsl=\"Blue\" style=\"background: #3b82f6\" title=\"Xanh dương\"></button>\n                    <button class=\"hsl-dot\" data-hsl=\"Purple\" style=\"background: #a855f7\" title=\"Tím\"></button>\n                    <button class=\"hsl-dot\" data-hsl=\"Magenta\" style=\"background: #ec4899\" title=\"Hồng cánh sen\"></button>\n                  </div>\n\n                  <div class=\"hsl-band-pane active\" data-hsl-pane=\"Red\">\n                    <div class=\"sub-badge\">Kênh Đỏ</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Đỏ</span><span class=\"val\" data-for=\"hslRedHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslRedHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Đỏ</span><span class=\"val\" data-for=\"hslRedSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslRedSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Đỏ</span><span class=\"val\" data-for=\"hslRedLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslRedLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                  <div class=\"hsl-band-pane\" data-hsl-pane=\"Orange\">\n                    <div class=\"sub-badge\">Kênh Cam (Tông da)</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Cam</span><span class=\"val\" data-for=\"hslOrangeHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslOrangeHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Cam</span><span class=\"val\" data-for=\"hslOrangeSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslOrangeSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Cam</span><span class=\"val\" data-for=\"hslOrangeLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslOrangeLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                  <div class=\"hsl-band-pane\" data-hsl-pane=\"Yellow\">\n                    <div class=\"sub-badge\">Kênh Vàng</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Vàng</span><span class=\"val\" data-for=\"hslYellowHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslYellowHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Vàng</span><span class=\"val\" data-for=\"hslYellowSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslYellowSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Vàng</span><span class=\"val\" data-for=\"hslYellowLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslYellowLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                  <div class=\"hsl-band-pane\" data-hsl-pane=\"Green\">\n                    <div class=\"sub-badge\">Kênh Xanh lá</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Xanh lá</span><span class=\"val\" data-for=\"hslGreenHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslGreenHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Xanh lá</span><span class=\"val\" data-for=\"hslGreenSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslGreenSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Xanh lá</span><span class=\"val\" data-for=\"hslGreenLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslGreenLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                  <div class=\"hsl-band-pane\" data-hsl-pane=\"Aqua\">\n                    <div class=\"sub-badge\">Kênh Xanh ngọc</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Xanh ngọc</span><span class=\"val\" data-for=\"hslAquaHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslAquaHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Xanh ngọc</span><span class=\"val\" data-for=\"hslAquaSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslAquaSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Xanh ngọc</span><span class=\"val\" data-for=\"hslAquaLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslAquaLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                  <div class=\"hsl-band-pane\" data-hsl-pane=\"Blue\">\n                    <div class=\"sub-badge\">Kênh Xanh dương</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Xanh dương</span><span class=\"val\" data-for=\"hslBlueHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslBlueHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Xanh dương</span><span class=\"val\" data-for=\"hslBlueSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslBlueSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Xanh dương</span><span class=\"val\" data-for=\"hslBlueLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslBlueLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                  <div class=\"hsl-band-pane\" data-hsl-pane=\"Purple\">\n                    <div class=\"sub-badge\">Kênh Tím</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Tím</span><span class=\"val\" data-for=\"hslPurpleHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslPurpleHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Tím</span><span class=\"val\" data-for=\"hslPurpleSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslPurpleSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Tím</span><span class=\"val\" data-for=\"hslPurpleLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslPurpleLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                  <div class=\"hsl-band-pane\" data-hsl-pane=\"Magenta\">\n                    <div class=\"sub-badge\">Kênh Hồng cánh sen</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Hồng</span><span class=\"val\" data-for=\"hslMagentaHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslMagentaHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Hồng</span><span class=\"val\" data-for=\"hslMagentaSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslMagentaSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Hồng</span><span class=\"val\" data-for=\"hslMagentaLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslMagentaLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Phân loại màu sắc (Vùng tối / Sáng)</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Màu vùng tối (Shadow Hue)</span><span class=\"val\" data-for=\"gradeShadowHue\">210</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeShadowHue\" min=\"0\" max=\"360\" value=\"210\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cường độ màu vùng tối</span><span class=\"val\" data-for=\"gradeShadowSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeShadowSat\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Màu vùng sáng (Highlight Hue)</span><span class=\"val\" data-for=\"gradeHighHue\">38</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeHighHue\" min=\"0\" max=\"360\" value=\"38\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cường độ màu vùng sáng</span><span class=\"val\" data-for=\"gradeHighSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeHighSat\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Màu trung tính (Midtone Hue)</span><span class=\"val\" data-for=\"gradeMidHue\">120</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeMidHue\" min=\"0\" max=\"360\" value=\"120\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cường độ trung tính</span><span class=\"val\" data-for=\"gradeMidSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeMidSat\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Màu tổng thể (Global Hue)</span><span class=\"val\" data-for=\"gradeGlobalHue\">45</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeGlobalHue\" min=\"0\" max=\"360\" value=\"45\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cường độ tổng thể</span><span class=\"val\" data-for=\"gradeGlobalSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeGlobalSat\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ sáng vùng tối</span><span class=\"val\" data-for=\"gradeShadowLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeShadowLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ sáng trung tính</span><span class=\"val\" data-for=\"gradeMidLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeMidLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ sáng vùng sáng</span><span class=\"val\" data-for=\"gradeHighLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeHighLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ sáng tổng thể</span><span class=\"val\" data-for=\"gradeGlobalLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeGlobalLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Hòa trộn (Blending)</span><span class=\"val\" data-for=\"gradeBlending\">50</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeBlending\" min=\"0\" max=\"100\" value=\"50\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cân bằng Sáng/Tối</span><span class=\"val\" data-for=\"gradeBalance\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeBalance\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Trộn kênh Đen &amp; Trắng</div>\n                <div class=\"retouch-acc-body\">\n                  <select id=\"treatment\" class=\"retouch-select\" style=\"margin-bottom: 6px\">\n                    <option value=\"color\">Ảnh Màu</option>\n                    <option value=\"bw\">Đen &amp; Trắng (B&amp;W)</option>\n                  </select>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Đỏ</span><span class=\"val\" data-for=\"bwRed\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwRed\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cam</span><span class=\"val\" data-for=\"bwOrange\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwOrange\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Vàng</span><span class=\"val\" data-for=\"bwYellow\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwYellow\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Xanh lá</span><span class=\"val\" data-for=\"bwGreen\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwGreen\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Xanh ngọc</span><span class=\"val\" data-for=\"bwAqua\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwAqua\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Xanh dương</span><span class=\"val\" data-for=\"bwBlue\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwBlue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tím</span><span class=\"val\" data-for=\"bwPurple\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwPurple\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Hồng cánh sen</span><span class=\"val\" data-for=\"bwMagenta\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwMagenta\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Chi tiết — Làm nét &amp; Khử nhiễu AI</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử nhiễu AI (RAW &amp; JPG)</span><span class=\"val\" data-for=\"aiDenoise\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"aiDenoise\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Giữ chi tiết khi khử nhiễu</span><span class=\"val\" data-for=\"nrDetail\">50</span></div><input type=\"range\" class=\"retouch-slider\" id=\"nrDetail\" min=\"0\" max=\"100\" value=\"50\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử nhiễu độ sáng</span><span class=\"val\" data-for=\"noiseReduction\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"noiseReduction\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử nhiễu màu</span><span class=\"val\" data-for=\"nrColor\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"nrColor\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tăng nét (Sharpening)</span><span class=\"val\" data-for=\"sharpenAmount\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"sharpenAmount\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Bán kính làm nét</span><span class=\"val\" data-for=\"sharpenRadius\">1</span></div><input type=\"range\" class=\"retouch-slider\" id=\"sharpenRadius\" min=\"0.5\" max=\"3\" value=\"1\" step=\"0.1\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Chi tiết vùng nét</span><span class=\"val\" data-for=\"sharpenDetail\">25</span></div><input type=\"range\" class=\"retouch-slider\" id=\"sharpenDetail\" min=\"0\" max=\"100\" value=\"25\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Mặt nạ vùng nét (Masking)</span><span class=\"val\" data-for=\"sharpenMasking\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"sharpenMasking\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Nhiễu hạt &amp; Tối góc (Hiệu ứng)</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Hạt phim (Film Grain)</span><span class=\"val\" data-for=\"filmGrain\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"filmGrain\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Kích thước hạt</span><span class=\"val\" data-for=\"grainSize\">25</span></div><input type=\"range\" class=\"retouch-slider\" id=\"grainSize\" min=\"0\" max=\"100\" value=\"25\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ thô hạt</span><span class=\"val\" data-for=\"grainRoughness\">50</span></div><input type=\"range\" class=\"retouch-slider\" id=\"grainRoughness\" min=\"0\" max=\"100\" value=\"50\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tối góc (Vignette)</span><span class=\"val\" data-for=\"vignette\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"vignette\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Điểm giữa tối góc</span><span class=\"val\" data-for=\"vignetteMidpoint\">50</span></div><input type=\"range\" class=\"retouch-slider\" id=\"vignetteMidpoint\" min=\"0\" max=\"100\" value=\"50\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ tròn tối góc</span><span class=\"val\" data-for=\"vignetteRoundness\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"vignetteRoundness\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm mềm viền tối góc</span><span class=\"val\" data-for=\"vignetteFeather\">50</span></div><input type=\"range\" class=\"retouch-slider\" id=\"vignetteFeather\" min=\"0\" max=\"100\" value=\"50\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Giữ vùng sáng ở góc</span><span class=\"val\" data-for=\"vignetteHighlights\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"vignetteHighlights\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Hiệu chỉnh ống kính</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Hiệu chỉnh méo hình</span><span class=\"val\" data-for=\"opticsDistortion\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"opticsDistortion\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử tối góc ống kính</span><span class=\"val\" data-for=\"opticsVignetting\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"opticsVignetting\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Điểm giữa ống kính</span><span class=\"val\" data-for=\"opticsVignettingMidpoint\">50</span></div><input type=\"range\" class=\"retouch-slider\" id=\"opticsVignettingMidpoint\" min=\"0\" max=\"100\" value=\"50\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc sai — Đỏ/Lục lam</span><span class=\"val\" data-for=\"opticsCaRed\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"opticsCaRed\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc sai — Xanh/Vàng</span><span class=\"val\" data-for=\"opticsCaBlue\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"opticsCaBlue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử viền tím</span><span class=\"val\" data-for=\"opticsDefringePurple\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"opticsDefringePurple\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử viền xanh lá</span><span class=\"val\" data-for=\"opticsDefringeGreen\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"opticsDefringeGreen\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n            </div>\n\n            <!-- MODULE 2: CHỈNH SỬA CHÂN DUNG (MẶC ĐỊNH MỞ KHI KHỞI ĐỘNG) -->\n            <div id=\"mod-portrait\" class=\"retouch-module-pane active\">\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Khử khuyết điểm</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tàn nhang &amp; Mụn trứng cá</span><span class=\"val\" data-for=\"freckleAcne\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"freckleAcne\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Nốt ruồi trên mặt</span><span class=\"val\" data-for=\"faceMole\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"faceMole\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Giảm bóng dầu vùng chữ T</span><span class=\"val\" data-for=\"faceShine\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"faceShine\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Quầng thâm dưới mắt</span><span class=\"val\" data-for=\"darkCircles\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"darkCircles\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Bọng mắt &amp; Nếp mí dưới</span><span class=\"val\" data-for=\"eyeBags\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"eyeBags\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Nếp nhăn trán</span><span class=\"val\" data-for=\"foreheadWrinkles\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"foreheadWrinkles\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Rãnh cười (Khóe mũi miệng)</span><span class=\"val\" data-for=\"nasolabialFolds\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"nasolabialFolds\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Nếp nhăn vùng cổ</span><span class=\"val\" data-for=\"neckWrinkles\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"neckWrinkles\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử lóa mắt kính</span><span class=\"val\" data-for=\"glassesGlare\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"glassesGlare\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Giảm nọng cằm</span><span class=\"val\" data-for=\"doubleChin\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"doubleChin\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khuyết điểm da cơ thể</span><span class=\"val\" data-for=\"bodyBlemish\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bodyBlemish\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Làm mịn da &amp; Điều chỉnh tông da</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"sub-badge\">Làm đều sáng tối (Dodge &amp; Burn)</div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm đều bề mặt da (Even)</span><span class=\"val\" data-for=\"dodgeBurnEven\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"dodgeBurnEven\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tạo khối sáng tối 3D (Sculpt)</span><span class=\"val\" data-for=\"dodgeBurnSculpt\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"dodgeBurnSculpt\" min=\"0\" max=\"100\" value=\"0\" /></div>\n\n                  <div class=\"sub-badge\">Tách tần số da (Frequency Separation)</div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm mịn tần số thấp (Màu da)</span><span class=\"val\" data-for=\"freqSepLow\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"freqSepLow\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Giữ hạt lỗ chân lông (High Freq)</span><span class=\"val\" data-for=\"freqSepHigh\">80</span></div><input type=\"range\" class=\"retouch-slider\" id=\"freqSepHigh\" min=\"0\" max=\"100\" value=\"80\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm mịn da mặt</span><span class=\"val\" data-for=\"facialSkinSmooth\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"facialSkinSmooth\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm mịn da cơ thể</span><span class=\"val\" data-for=\"bodySkinSmooth\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bodySkinSmooth\" min=\"0\" max=\"100\" value=\"0\" /></div>\n\n                  <div class=\"sub-badge\">Sắc tố &amp; Độ rạng rỡ</div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm đều tông màu da</span><span class=\"val\" data-for=\"unifyComplexion\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"unifyComplexion\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm sáng rạng rỡ da</span><span class=\"val\" data-for=\"skinRadiance\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"skinRadiance\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Màu da hồng hào</span><span class=\"val\" data-for=\"skinRosy\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"skinRosy\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ ấm màu da</span><span class=\"val\" data-for=\"skinWarmth\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"skinWarmth\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Định hình khuôn mặt (3D Liquify)</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ rộng khuôn mặt</span><span class=\"val\" data-for=\"faceWidth\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"faceWidth\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Thon gọn xương hàm (V-Line)</span><span class=\"val\" data-for=\"jawlineSlim\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"jawlineSlim\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Thu nâng gò má</span><span class=\"val\" data-for=\"cheekboneLift\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"cheekboneLift\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ dài cằm</span><span class=\"val\" data-for=\"chinLength\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"chinLength\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ cao trán</span><span class=\"val\" data-for=\"foreheadHeight\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"foreheadHeight\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Thu gọn cánh mũi</span><span class=\"val\" data-for=\"noseWidth\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"noseWidth\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Nâng đầu mũi</span><span class=\"val\" data-for=\"noseTipLift\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"noseTipLift\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Kích thước miệng</span><span class=\"val\" data-for=\"mouthSize\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"mouthSize\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ đầy đặn môi</span><span class=\"val\" data-for=\"lipPlump\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"lipPlump\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Nâng khóe miệng cười</span><span class=\"val\" data-for=\"smileEnhance\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"smileEnhance\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Mắt &amp; Lông mày</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Kích thước mắt</span><span class=\"val\" data-for=\"eyeSize\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"eyeSize\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm sáng tròng mắt</span><span class=\"val\" data-for=\"eyeBrighten\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"eyeBrighten\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tăng ánh sáng mắt (Catchlight)</span><span class=\"val\" data-for=\"catchlightBoost\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"catchlightBoost\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Xóa tia máu đỏ mắt</span><span class=\"val\" data-for=\"redVeins\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"redVeins\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ dày lông mày</span><span class=\"val\" data-for=\"eyebrowThickness\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"eyebrowThickness\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Nâng dáng lông mày</span><span class=\"val\" data-for=\"eyebrowLift\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"eyebrowLift\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Làm đẹp răng</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm trắng răng</span><span class=\"val\" data-for=\"teethWhiten\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"teethWhiten\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử ố vàng răng</span><span class=\"val\" data-for=\"teethDesaturate\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"teethDesaturate\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ sáng răng</span><span class=\"val\" data-for=\"teethBrighten\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"teethBrighten\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Trang điểm</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Bắt sáng (Highlight)</span><span class=\"val\" data-for=\"makeupHighlight\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"makeupHighlight\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tạo khối (Contour)</span><span class=\"val\" data-for=\"makeupContour\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"makeupContour\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Má hồng</span><span class=\"val\" data-for=\"makeupBlush\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"makeupBlush\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Phấn mắt</span><span class=\"val\" data-for=\"makeupEyeshadow\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"makeupEyeshadow\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cường độ son môi</span><span class=\"val\" data-for=\"makeupLipstick\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"makeupLipstick\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Màu son môi</span></div>\n                    <select id=\"makeupLipTint\" class=\"retouch-select\">\n                      <option value=\"rose\">Hồng Nhung (Velvet Rose)</option>\n                      <option value=\"coral\">Cam San Hô Ấm</option>\n                      <option value=\"berry\">Đỏ Mận (Deep Berry)</option>\n                      <option value=\"nude\">Nude Tự Nhiên</option>\n                      <option value=\"ruby\">Đỏ Ruby Cổ Điển</option>\n                    </select>\n                  </div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title cloth-acc-header\">\n                  <span>▾ Điều chỉnh tóc</span>\n                  <button type=\"button\" id=\"btn-hair-reset\" class=\"cloth-reset-btn\" title=\"Đặt lại toàn bộ điều chỉnh tóc\">\n                    <svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">\n                      <path d=\"M3 12a9 9 0 1 0 3-6.7L3 8\" />\n                      <path d=\"M3 3v5h5\" />\n                    </svg>\n                  </button>\n                </div>\n                <div class=\"retouch-acc-body\">\n                  <!-- Subgroup 1: Chỉnh sửa hình dáng tóc -->\n                  <div class=\"hair-subhead\">Chỉnh sửa hình dáng tóc</div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Làm đầy điểm hói</span><span class=\"val\" data-for=\"hairPartLine\">0</span></div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"hairPartLine\" min=\"0\" max=\"100\" value=\"0\" />\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span class=\"cloth-label-with-badges\">\n                        Độ Dày Tóc Đỉnh Đầu\n                        <span class=\"cloth-help-dot\" title=\"Tăng/giảm độ phồng đỉnh đầu (hộp sọ cao)\">?</span>\n                      </span>\n                      <span class=\"val\" data-for=\"hairVolume\">0</span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider hair-centered\" id=\"hairVolume\" min=\"-100\" max=\"100\" value=\"0\" />\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Tăng lượng tóc hai bên</span></div>\n                    <div class=\"hair-dual-row\">\n                      <div class=\"hair-dual-col\">\n                        <div class=\"s-head\"><span>Trái</span><span class=\"val\" data-for=\"hairSideLeftVolume\">0</span></div>\n                        <input type=\"range\" class=\"retouch-slider hair-centered\" id=\"hairSideLeftVolume\" min=\"-100\" max=\"100\" value=\"0\" />\n                      </div>\n                      <button type=\"button\" id=\"btn-hair-side-link\" class=\"cloth-link-btn hair-side-link active\" aria-pressed=\"true\" title=\"Liên kết lượng tóc Trái &amp; Phải\">\n                        <svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">\n                          <path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\" />\n                          <path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\" />\n                        </svg>\n                      </button>\n                      <div class=\"hair-dual-col\">\n                        <div class=\"s-head\"><span>Phải</span><span class=\"val\" data-for=\"hairSideRightVolume\">0</span></div>\n                        <input type=\"range\" class=\"retouch-slider hair-centered\" id=\"hairSideRightVolume\" min=\"-100\" max=\"100\" value=\"0\" />\n                      </div>\n                    </div>\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Đường chân tóc</span><span class=\"val\" data-for=\"hairlineAdjust\">0</span></div>\n                    <input type=\"range\" class=\"retouch-slider hair-centered\" id=\"hairlineAdjust\" min=\"-100\" max=\"100\" value=\"0\" />\n                  </div>\n\n                  <div class=\"bg-divider\" style=\"margin: 10px 0;\"></div>\n\n                  <!-- Subgroup 2: Hoàn thiện tóc -->\n                  <div class=\"hair-subhead\">Hoàn thiện tóc</div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span>Loại bỏ tóc gãy</span>\n                      <span class=\"cloth-val-with-arrow\">\n                        <span class=\"val\" data-for=\"strayHair\">0</span>\n                        <button type=\"button\" id=\"btn-hair-stray-expand\" class=\"cloth-sub-arrow\" aria-expanded=\"false\" title=\"Mở tùy chọn vùng xóa tóc con\">▸</button>\n                      </span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"strayHair\" min=\"0\" max=\"100\" value=\"0\" />\n                    <div id=\"hair-stray-drawer\" class=\"cloth-sub-drawer hidden\">\n                      <div class=\"s-head\" style=\"margin-top: 6px;\"><span>Trong đường viền nhân vật</span><span class=\"val\" data-for=\"strayHairInner\">100</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"strayHairInner\" min=\"0\" max=\"100\" value=\"100\" />\n                      <div class=\"s-head\" style=\"margin-top: 6px;\"><span>Ngoài đường viền nhân vật</span><span class=\"val\" data-for=\"strayHairOuter\">100</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"strayHairOuter\" min=\"0\" max=\"100\" value=\"100\" />\n                    </div>\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span>Làm mượt tóc</span>\n                      <span class=\"cloth-val-with-arrow\">\n                        <span class=\"val\" data-for=\"hairSmooth\">0</span>\n                        <button type=\"button\" id=\"btn-hair-smooth-expand\" class=\"cloth-sub-arrow\" aria-expanded=\"false\" title=\"Mở tinh chỉnh giảm xơ rối\">▸</button>\n                      </span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"hairSmooth\" min=\"0\" max=\"100\" value=\"0\" />\n                    <div id=\"hair-smooth-drawer\" class=\"cloth-sub-drawer hidden\">\n                      <div class=\"s-head\" style=\"margin-top: 6px;\"><span>Giảm xơ rối</span><span class=\"val\" data-for=\"hairFrizzy\">100</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"hairFrizzy\" min=\"0\" max=\"100\" value=\"100\" />\n                    </div>\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Tăng độ bóng cho tóc</span><span class=\"val\" data-for=\"hairShine\">0</span></div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"hairShine\" min=\"0\" max=\"100\" value=\"0\" />\n                  </div>\n\n                  <div class=\"bg-divider\" style=\"margin: 10px 0;\"></div>\n\n                  <!-- Subgroup 3: Chỉnh sửa màu tóc -->\n                  <div class=\"hair-subhead\">Chỉnh sửa màu tóc</div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span class=\"cloth-label-with-badges\">\n                        Tóc Đen Tóc Bạc\n                        <span class=\"evoto-beta-badge\">Beta</span>\n                      </span>\n                      <span class=\"val\" data-for=\"whiteHairBlacken\">0</span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"whiteHairBlacken\" min=\"0\" max=\"100\" value=\"0\" />\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span class=\"cloth-label-with-badges\">\n                        Thống Nhất Màu Tóc\n                        <span class=\"evoto-beta-badge\">Beta</span>\n                      </span>\n                      <span class=\"val\" data-for=\"hairColorUnify\">0</span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider hair-centered\" id=\"hairColorUnify\" min=\"-100\" max=\"100\" value=\"0\" />\n                  </div>\n\n                  <div class=\"hair-color-section\">\n                    <div class=\"hair-subhead\" style=\"margin-bottom: 8px;\">Màu Tóc</div>\n                    <div class=\"hair-color-grid\" id=\"hair-color-grid\">\n                      <button type=\"button\" class=\"hair-color-card active\" data-haircolor=\"none\" title=\"Giữ màu tóc gốc\">\n                        <span class=\"hair-swatch-preview hair-swatch-none\">⊘</span>\n                        <span class=\"hair-swatch-code\">Trống</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h01\" data-deg=\"60\" title=\"H01 - Nâu Trà Lạnh\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #988374 0%, #7C695B 55%, #4f4137 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #7C695B\">H01</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h02\" data-deg=\"60\" title=\"H02 - Nâu Trà Sữa\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #a6745d 0%, #895C49 55%, #5b3b2e 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #895C49\">H02</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h03\" data-deg=\"60\" title=\"H03 - Nâu Cam Tây\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #dd9269 0%, #C67951 55%, #8a4b2b 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #C67951\">H03</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h04\" data-deg=\"60\" title=\"H04 - Đỏ Nâu Ánh Sáng\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #b86c71 0%, #9C5459 55%, #663034 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #9C5459\">H04</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h05\" data-deg=\"50\" title=\"H05 - Đỏ Rượu\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #ca736f 0%, #AD5956 55%, #753431 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #AD5956\">H05</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h06\" data-deg=\"50\" title=\"H06 - Nâu Hồng Phấn\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #b58d88 0%, #98726E 55%, #654744 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #98726E\">H06</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h07\" data-deg=\"70\" title=\"H07 - Hồng Tử Đằng\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #e5b0ad 0%, #CE9390 55%, #996260 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #CE9390\">H07</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h08\" data-deg=\"50\" title=\"H08 - Đen Tự Nhiên\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #776359 0%, #5D4B43 55%, #2f241f 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #5D4B43\">H08</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h09\" data-deg=\"60\" title=\"H09 - Đen Ánh Xanh\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #7e849d 0%, #646980 55%, #373b4c 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #646980\">H09</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h10\" data-deg=\"60\" title=\"H10 - Tím Nho\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #b87387 0%, #9B586C 55%, #653141 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #9B586C\">H10</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h11\" data-deg=\"60\" title=\"H11 - Tím Khói Xanh\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #98889e 0%, #7C6D82 55%, #4d4252 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #7C6D82\">H11</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h12\" data-deg=\"60\" title=\"H12 - Nâu Rêu Lanh\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #8d8b79 0%, #716F60 55%, #47463a 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #716F60\">H12</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h13\" data-deg=\"60\" title=\"H13 - Xám Rêu Khói\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #919c7a 0%, #758060 55%, #4a523a 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #758060\">H13</span>\n                      </button>\n                    </div>\n                    <div id=\"hair-dye-controls\" class=\"hair-dye-controls\" style=\"margin-top: 10px;\">\n                      <div class=\"retouch-slider-item\">\n                        <div class=\"s-head\"><span>Mức độ màu nhuộm</span><span class=\"val\" data-for=\"hairDyeStrength\">0</span></div>\n                        <input type=\"range\" class=\"retouch-slider\" id=\"hairDyeStrength\" min=\"0\" max=\"100\" value=\"0\" />\n                      </div>\n                      <div class=\"retouch-slider-item\" style=\"margin-bottom: 0;\">\n                        <div class=\"s-head\"><span>Làm tối tóc</span><span class=\"val\" data-for=\"hairDyeDarken\">0</span></div>\n                        <input type=\"range\" class=\"retouch-slider\" id=\"hairDyeDarken\" min=\"0\" max=\"100\" value=\"0\" />\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Định hình cơ thể</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Thon gọn vùng cổ</span><span class=\"val\" data-for=\"neckSlim\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"neckSlim\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Chỉnh dáng vai</span><span class=\"val\" data-for=\"shoulderSculpt\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"shoulderSculpt\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Thu gọn eo</span><span class=\"val\" data-for=\"waistSlim\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"waistSlim\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n            </div>\n\n            <!-- MODULE 3: ĐIỀU CHỈNH PHÔNG NỀN, BẦU TRỜI & TRANG PHỤC (Evoto Style) -->\n            <div id=\"mod-bg\" class=\"retouch-module-pane\">\n              <!-- SECTION 1: Điều chỉnh phông nền (Tối ưu hoá phông nền trơn + Tinh chỉnh) -->\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Điều chỉnh phông nền</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"bg-subhead\">Tối ưu hoá phông nền trơn</div>\n                  <div class=\"crop-toggle-row\">\n                    <span class=\"crop-toggle-label\">Loại bỏ chi tiết gây nhiễu</span>\n                    <button type=\"button\" id=\"bgCleanDistractions\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\"><span class=\"evoto-switch-knob\"></span></button>\n                  </div>\n                  <div class=\"crop-toggle-row\">\n                    <span class=\"crop-toggle-label\">Loại bỏ nhược điểm phông nền</span>\n                    <button type=\"button\" id=\"bgCleanDefects\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\"><span class=\"evoto-switch-knob\"></span></button>\n                  </div>\n                  <div class=\"crop-toggle-row\">\n                    <span class=\"crop-toggle-label\">Độ sáng đồng đều</span>\n                    <button type=\"button\" id=\"bgEvenBrightness\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\"><span class=\"evoto-switch-knob\"></span></button>\n                  </div>\n                  <div class=\"crop-toggle-row\">\n                    <span class=\"crop-toggle-label\">Loại bỏ dải màu</span>\n                    <button type=\"button\" id=\"bgRemoveBanding\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\"><span class=\"evoto-switch-knob\"></span></button>\n                  </div>\n\n                  <div class=\"bg-divider\"></div>\n                  <div class=\"bg-subhead\">Tinh chỉnh phông nền</div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cải tiến phông nền</span><span class=\"val\" data-for=\"backdropClean\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"backdropClean\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử sọc chuyển sắc (Banding)</span><span class=\"val\" data-for=\"backdropBandingFix\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"backdropBandingFix\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm mờ hậu cảnh (Bokeh)</span><span class=\"val\" data-for=\"bgBlurBokeh\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgBlurBokeh\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <!-- SECTION 2: Thay đổi phông nền (Evoto Studio Replacement) -->\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Thay đổi phông nền</div>\n                <div class=\"retouch-acc-body\">\n                  <!-- LIYING AI ENGINE CARD -->\n                  <div class=\"liying-bg-card\" id=\"liying-bg-card\">\n                    <div class=\"liying-card-header\">\n                      <div class=\"liying-badge-title\">\n                        <span class=\"liying-sparkle\" aria-hidden=\"true\">\n                          <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                            <path d=\"M12 2l2.1 6.2L20.3 10l-6.2 2.1L12 18.3l-2.1-6.2L3.7 10l6.2-1.8L12 2zm7 12l1.1 3.1L23.2 18l-3.1 1.1L19 22.2l-1.1-3.1L14.8 18l3.1-.9L19 14z\"/>\n                          </svg>\n                        </span>\n                        <div class=\"liying-title-stack\">\n                          <strong>LiYing AI</strong>\n                          <span class=\"liying-subtitle\">RMBG + Pose</span>\n                        </div>\n                      </div>\n                      <span class=\"liying-tag\">Local</span>\n                    </div>\n\n                    <label class=\"liying-checkbox-label\" title=\"Tự động nhận diện hai vai bằng YOLOv8 Pose, xoay cân bằng tư thế và căn giữa mặt\">\n                      <span class=\"liying-option-text\">Tự cân bằng vai khi tách nền</span>\n                      <input type=\"checkbox\" id=\"liying-straighten-cb\" />\n                    </label>\n\n                    <div class=\"liying-preset-grid\">\n                      <button type=\"button\" class=\"liying-color-chip active\" data-color=\"blue\" title=\"Xanh thẻ chuẩn LiYing (#628BCE)\">\n                        <span class=\"chip-dot\" style=\"background:#628bce\"></span>\n                        <span>Xanh thẻ</span>\n                      </button>\n                      <button type=\"button\" class=\"liying-color-chip\" data-color=\"white\" title=\"Trắng chuẩn LiYing (#FFFFFF)\">\n                        <span class=\"chip-dot chip-dot-light\" style=\"background:#ffffff\"></span>\n                        <span>Trắng</span>\n                      </button>\n                      <button type=\"button\" class=\"liying-color-chip\" data-color=\"red\" title=\"Đỏ ảnh thẻ (#D74532)\">\n                        <span class=\"chip-dot\" style=\"background:#d74532\"></span>\n                        <span>Đỏ</span>\n                      </button>\n                      <button type=\"button\" class=\"liying-color-chip\" data-color=\"transparent\" title=\"Trong suốt (PNG Alpha)\">\n                        <span class=\"chip-dot chip-transparent\"></span>\n                        <span>Trong suốt</span>\n                      </button>\n                      <button type=\"button\" class=\"liying-color-chip\" data-color=\"dark_blue\" title=\"Xanh đậm công sở (#0047AB)\">\n                        <span class=\"chip-dot\" style=\"background:#0047ab\"></span>\n                        <span>Xanh đậm</span>\n                      </button>\n                      <button type=\"button\" class=\"liying-color-chip\" data-color=\"light_blue\" title=\"Xanh nhạt dịu (#B4C8E6)\">\n                        <span class=\"chip-dot\" style=\"background:#b4c8e6\"></span>\n                        <span>Xanh nhạt</span>\n                      </button>\n                      <button type=\"button\" class=\"liying-color-chip\" data-color=\"gray\" title=\"Xám trung tính (#808080)\">\n                        <span class=\"chip-dot\" style=\"background:#808080\"></span>\n                        <span>Xám</span>\n                      </button>\n                      <button type=\"button\" class=\"liying-color-chip\" data-color=\"beige\" title=\"Kem ấm (#F5F5DC)\">\n                        <span class=\"chip-dot chip-dot-light\" style=\"background:#f5f5dc\"></span>\n                        <span>Kem Be</span>\n                      </button>\n                    </div>\n\n                    <div class=\"liying-actions-row\">\n                      <button type=\"button\" id=\"btn-liying-apply\" class=\"btn-liying-primary\" title=\"Chạy tách & thay nền bằng thuật toán LiYing AI\">\n                        <svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"><path d=\"m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z\"/></svg>\n                        <span>Tách &amp; Thay nền</span>\n                      </button>\n                      <button type=\"button\" id=\"btn-liying-level-only\" class=\"btn-liying-secondary\" title=\"Chỉ cân bằng vai & canh giữa mặt (giữ nguyên nền)\">\n                        <svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 12h18\"/><path d=\"M8 7l-3 5 3 5\"/><path d=\"M16 7l3 5-3 5\"/></svg>\n                        <span>Cân vai</span>\n                      </button>\n                      <button type=\"button\" id=\"btn-liying-cancel\" class=\"btn-liying-secondary btn-liying-cancel\" title=\"Hủy xử lý hoặc khôi phục lại ảnh trước khi tách & thay nền\">\n                        <svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\"><path d=\"M18 6L6 18\"/><path d=\"M6 6l12 12\"/></svg>\n                        <span>Hủy</span>\n                      </button>\n                    </div>\n                  </div>\n\n                  <!-- Hình ảnh / Màu đơn sắc Segmented Tabs -->\n                  <div class=\"bg-type-tabs\">\n                    <button type=\"button\" class=\"bg-type-tab active\" id=\"bg-cat-image\">Hình ảnh</button>\n                    <button type=\"button\" class=\"bg-type-tab\" id=\"bg-cat-solid\">Màu đơn sắc</button>\n                  </div>\n\n                  <!-- Đề xuất / Nền của bạn Underline Tabs + Reset Original -->\n                  <div class=\"bg-lib-tabs-row\">\n                    <div class=\"bg-lib-tabs\">\n                      <button type=\"button\" class=\"bg-lib-tab active\" id=\"bg-lib-tab-rec\">Đề xuất</button>\n                      <button type=\"button\" class=\"bg-lib-tab\" id=\"bg-lib-tab-user\">Nền của bạn</button>\n                    </div>\n                    <button type=\"button\" id=\"btn-bg-reset-original\" class=\"bg-orig-reset-btn\" title=\"Khôi phục phông nền gốc\">Nền gốc</button>\n                  </div>\n\n                  <!-- Synced Dropdown (Ẩn nhẹ trong UI nhưng tương thích hoàn toàn preset & phím tắt) -->\n                  <select id=\"bgReplaceMode\" class=\"retouch-select bg-compact-select\" aria-label=\"Chế độ phông nền\">\n                    <option value=\"original\">Giữ nguyên phông nền gốc</option>\n                    <option value=\"transparent\">Nền Trong suốt (PNG Alpha)</option>\n                    <option value=\"pure_white\">Trắng (Studio Photo / Ảnh thẻ)</option>\n                    <option value=\"studio_grey\">Xám 02 (Studio trung tính)</option>\n                    <option value=\"moody_black\">Đen (Low-Key Studio)</option>\n                    <option value=\"fabric_02\">Vải 02 (Phông vải vân mây)</option>\n                    <option value=\"warm_beige\">Nâu 03 (Be / Nâu tạp chí)</option>\n                    <option value=\"slate_grey_03\">Xám 03 (Xám khói Studio)</option>\n                    <option value=\"passport_blue\">Xanh thẻ (Xanh dương Studio)</option>\n                    <option value=\"pastel_pink\">Hồng phấn (Pastel Studio)</option>\n                    <option value=\"sage_green\">Xanh bơ (Mint Pastel)</option>\n                    <option value=\"lavender_mist\">Tím nhạt (Lavender Studio)</option>\n                    <option value=\"sky_golden_sunset\">Bầu trời: Hoàng hôn vàng</option>\n                    <option value=\"sky_alpine_blue\">Bầu trời: Xanh mây núi</option>\n                    <option value=\"sky_dramatic_clouds\">Bầu trời: Mây kịch tính</option>\n                    <option value=\"sky_night_stars\">Bầu trời: Đêm đầy sao</option>\n                    <option value=\"custom_color\">Màu đơn sắc tùy chỉnh</option>\n                    <option value=\"custom_image\">Ảnh phông nền của bạn</option>\n                  </select>\n\n                  <!-- TAB ĐỀ XUẤT -->\n                  <div id=\"bg-lib-rec-panel\">\n                    <div class=\"bg-filter-pills\">\n                      <button type=\"button\" class=\"bg-pill active\" id=\"bg-filter-explore\">Khám phá ngay</button>\n                      <button type=\"button\" class=\"bg-pill\" id=\"bg-filter-selected\">Mục đã chọn</button>\n                    </div>\n\n                    <div class=\"asset-hub-grid bg-evoto-grid\" id=\"bg-asset-hub-grid\">\n                      <button type=\"button\" class=\"asset-swatch bg-swatch-transparent\" data-bgmode=\"transparent\"><span>Trong suốt</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"pure_white\" style=\"background: #f8fafc; color: #09090b\"><span>Trắng</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"studio_grey\" style=\"background: radial-gradient(circle at 50% 35%, #b5b9c0, #6f737a)\"><span>Xám 02</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"moody_black\" style=\"background: radial-gradient(circle at 50% 35%, #2b2e36, #0a0b0d)\"><span>Đen</span></button>\n\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"fabric_02\" style=\"background: radial-gradient(circle at 38% 42%, #555c68, #282c33 60%, #1c1f25)\"><span>Vải 02</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"warm_beige\" style=\"background: radial-gradient(circle at 50% 38%, #ad9387, #8a7368)\"><span>Nâu 03</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"slate_grey_03\" style=\"background: linear-gradient(160deg, #74727a, #5c5a63)\"><span>Xám 03</span></button>\n                      <button type=\"button\" class=\"asset-swatch bg-swatch-more\" id=\"btn-bg-more\"><span>Thêm</span></button>\n                    </div>\n\n                    <div class=\"asset-hub-grid bg-evoto-grid hidden\" id=\"bg-more-swatches\" style=\"margin-top: 6px;\">\n                      <button type=\"button\" class=\"asset-swatch active\" data-bgmode=\"original\" style=\"background: linear-gradient(135deg, #18181c, #2d2d35)\"><span>Nền gốc</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"passport_blue\" style=\"background: #2563eb\"><span>Xanh thẻ</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"pastel_pink\" style=\"background: #f3cbd3; color: #18181b\"><span>Hồng phấn</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"sage_green\" style=\"background: #9bb7a5; color: #18181b\"><span>Xanh bơ</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"lavender_mist\" style=\"background: #cdc4ea; color: #18181b\"><span>Tím nhạt</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"custom_color\" id=\"swatch-custom-color\" style=\"background: #e8eef5; color: #09090b\"><span>Màu riêng</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"custom_image\" style=\"background: linear-gradient(135deg, #27272f, #3f3f4a)\"><span>Ảnh riêng</span></button>\n                    </div>\n                  </div>\n\n                  <!-- TAB NỀN CỦA BẠN (Hình ảnh upload & Màu đơn sắc) -->\n                  <div id=\"bg-lib-user-panel\" class=\"hidden\">\n                    <div id=\"bg-user-image-pane\">\n                      <div class=\"bg-filter-pills\">\n                        <button type=\"button\" class=\"bg-pill active\" id=\"bg-user-filter-personal\">Cá nhân</button>\n                        <button type=\"button\" class=\"bg-pill\" id=\"bg-user-filter-fav\">Yêu thích của tôi</button>\n                      </div>\n                      <button type=\"button\" id=\"btn-upload-custom-bg\" class=\"bg-upload-dropzone\">\n                        <span class=\"bg-upload-plus\">+</span>\n                        <span class=\"bg-upload-hint\">Chọn ảnh nền từ máy (JPEG, PNG, WEBP)</span>\n                      </button>\n                      <input type=\"file\" id=\"bg-custom-file-input\" accept=\"image/*\" multiple hidden />\n                      <div id=\"bg-user-gallery\" class=\"bg-user-gallery hidden\"></div>\n                      <div id=\"custom-bg-preview\" class=\"custom-bg-preview hidden\" style=\"margin-top: 6px;\">\n                        <img id=\"custom-bg-preview-img\" alt=\"Xem trước ảnh nền\" />\n                        <button type=\"button\" id=\"btn-clear-custom-bg\" class=\"custom-bg-clear-btn hidden\" title=\"Xóa ảnh nền đang chọn\">✕</button>\n                      </div>\n                    </div>\n\n                    <div id=\"bg-user-solid-pane\" class=\"hidden\">\n                      <div class=\"bg-solid-picker-banner\">\n                        <label class=\"bg-rainbow-chip\" title=\"Chọn màu tùy chỉnh\">\n                          <input type=\"color\" id=\"bgCustomColor\" value=\"#e8eef5\" />\n                        </label>\n                        <div class=\"bg-solid-text\">\n                          <div>Hãy thêm màu tùy chỉnh từ bảng chọn màu.</div>\n                          <span id=\"bg-custom-color-hex\" class=\"bg-color-hex\">#e8eef5</span>\n                        </div>\n                      </div>\n                      <div class=\"bg-solid-presets\">\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#ffffff\" style=\"background: #ffffff\" title=\"Trắng\"></button>\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#e8eef5\" style=\"background: #e8eef5\" title=\"Xanh xám nhạt\"></button>\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#cbd5e1\" style=\"background: #cbd5e1\" title=\"Xám sáng\"></button>\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#94a3b8\" style=\"background: #94a3b8\" title=\"Xám studio\"></button>\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#2563eb\" style=\"background: #2563eb\" title=\"Xanh thẻ\"></button>\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#b91c1c\" style=\"background: #b91c1c\" title=\"Đỏ đô\"></button>\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#e7d8c5\" style=\"background: #e7d8c5\" title=\"Kem ấm\"></button>\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#18181b\" style=\"background: #18181b\" title=\"Đen than\"></button>\n                      </div>\n                    </div>\n                  </div>\n\n                  <!-- KHÓA ĐIỀU KHIỂN KHI CHƯA THAY NỀN + BỘ TINH CHỈNH CHI TIẾT EVOTO -->\n                  <div id=\"bg-replace-advanced-wrap\" class=\"bg-advanced-wrap is-locked\">\n                    <div id=\"bg-lock-banner\" class=\"bg-lock-banner\">Thay đổi nền để mở khoá các điều khiển này.</div>\n                    <div id=\"bg-replace-controls-body\" class=\"bg-controls-body\">\n                      <div class=\"bg-field-group\">\n                        <label class=\"bg-field-label\">Chế độ viền <span class=\"evoto-new-badge\">New</span></label>\n                        <select id=\"bgEdgeMode\" class=\"retouch-select bg-evoto-select\">\n                          <option value=\"auto\">Tự động</option>\n                          <option value=\"soft\">Mềm (Tóc bay)</option>\n                          <option value=\"crisp\">Sắc nét</option>\n                          <option value=\"hair_detail\">Tóc chi tiết</option>\n                        </select>\n                      </div>\n\n                      <div class=\"bg-field-group\">\n                        <label class=\"bg-field-label\">Phạm vi lưu giữ</label>\n                        <select id=\"bgKeepScope\" class=\"retouch-select bg-evoto-select\">\n                          <option value=\"subject_and_related\">Chủ thể và các đối tượng liên quan</option>\n                          <option value=\"subject_only\">Chỉ chủ thể chính</option>\n                          <option value=\"portrait_focus\">Chân dung (Đầu &amp; vai)</option>\n                        </select>\n                      </div>\n\n                      <div class=\"bg-field-group\">\n                        <label class=\"bg-field-label\">Vùng lấp đầy</label>\n                        <select id=\"bgFillArea\" class=\"retouch-select bg-evoto-select\">\n                          <option value=\"full_image\">Ảnh gốc</option>\n                          <option value=\"outer_only\">Chỉ vùng nền trống</option>\n                        </select>\n                      </div>\n\n                      <div class=\"bg-field-group\">\n                        <label class=\"bg-field-label\">Chế độ lấp đầy</label>\n                        <select id=\"bgFillMode\" class=\"retouch-select bg-evoto-select\">\n                          <option value=\"cover\">Phủ kín (Giữ tỉ lệ)</option>\n                          <option value=\"stretch\">Kéo giãn để lấp đầy</option>\n                          <option value=\"contain\">Vừa khung ảnh</option>\n                          <option value=\"tile\">Lặp gạch nền</option>\n                        </select>\n                      </div>\n\n                      <div class=\"bg-field-group\">\n                        <label class=\"bg-field-label\">Chế độ hòa trộn</label>\n                        <select id=\"bgBlendMode\" class=\"retouch-select bg-evoto-select\">\n                          <option value=\"normal\">Bình thường</option>\n                          <option value=\"multiply\">Nhân</option>\n                          <option value=\"screen\">Làm sáng</option>\n                          <option value=\"overlay\">Phủ</option>\n                          <option value=\"soft_light\">Ánh sáng mềm</option>\n                        </select>\n                      </div>\n\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Điều chỉnh viền</span><span class=\"val\" data-for=\"bgEdgeAdjust\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgEdgeAdjust\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ mờ</span><span class=\"val\" data-for=\"bgReplaceOpacity\">100</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgReplaceOpacity\" min=\"0\" max=\"100\" value=\"100\" /></div>\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Kích thước</span><span class=\"val\" data-for=\"bgScale\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgScale\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Chiều dọc</span><span class=\"val\" data-for=\"bgOffsetY\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgOffsetY\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Chiều ngang</span><span class=\"val\" data-for=\"bgOffsetX\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgOffsetX\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Mờ</span><span class=\"val\" data-for=\"bgBlurStrength\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgBlurStrength\" min=\"0\" max=\"100\" value=\"0\" /></div>\n\n                      <div class=\"crop-toggle-row\">\n                        <span class=\"crop-toggle-label\">Xoá lem màu</span>\n                        <button type=\"button\" id=\"bgDecontam\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\"><span class=\"evoto-switch-knob\"></span></button>\n                      </div>\n                      <div class=\"crop-toggle-row\">\n                        <span class=\"crop-toggle-label\">Phản chiếu mặt đất</span>\n                        <button type=\"button\" id=\"bgGroundReflect\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\"><span class=\"evoto-switch-knob\"></span></button>\n                      </div>\n\n                      <div class=\"bg-divider\"></div>\n                      <div class=\"bg-subhead\">Bóng Gốc</div>\n                      <div class=\"crop-toggle-row\">\n                        <span class=\"crop-toggle-label\">Bóng AI giữ lại</span>\n                        <button type=\"button\" id=\"bgPreserveShadow\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\"><span class=\"evoto-switch-knob\"></span></button>\n                      </div>\n\n                      <div class=\"bg-subhead\" style=\"margin-top: 8px;\">Thêm bóng đổ</div>\n                      <div class=\"bg-shadow-grid\" id=\"bg-shadow-grid\">\n                        <button type=\"button\" class=\"bg-shadow-card active\" data-shadow=\"none\">\n                          <span class=\"bg-sh-icon bg-sh-none\">⊘</span>\n                          <span>Trống</span>\n                        </button>\n                        <button type=\"button\" class=\"bg-shadow-card\" data-shadow=\"soft_shadow\">\n                          <span class=\"bg-sh-icon bg-sh-soft\">●</span>\n                          <span>Bóng mờ</span>\n                        </button>\n                        <button type=\"button\" class=\"bg-shadow-card\" data-shadow=\"hard_shadow\">\n                          <span class=\"bg-sh-icon bg-sh-hard\">●</span>\n                          <span>Bóng đậm</span>\n                        </button>\n                        <button type=\"button\" class=\"bg-shadow-card\" data-shadow=\"cast_shadow\">\n                          <span class=\"bg-sh-icon bg-sh-cast\">●</span>\n                          <span>Đổ bóng</span>\n                        </button>\n                      </div>\n\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm mờ bóng</span><span class=\"val\" data-for=\"bgShadowBlur\">25</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgShadowBlur\" min=\"0\" max=\"100\" value=\"25\" /></div>\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ mờ</span><span class=\"val\" data-for=\"bgShadowOpacity\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgShadowOpacity\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Chuyển màu</span><span class=\"val\" data-for=\"bgShadowShift\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgShadowShift\" min=\"0\" max=\"100\" value=\"0\" /></div>\n\n                      <div class=\"bg-field-group\">\n                        <label class=\"bg-field-label\">Chế độ hòa trộn</label>\n                        <select id=\"bgShadowBlendMode\" class=\"retouch-select bg-evoto-select\">\n                          <option value=\"multiply\">Nhân</option>\n                          <option value=\"normal\">Bình thường</option>\n                          <option value=\"darken\">Làm tối</option>\n                          <option value=\"soft_light\">Ánh sáng mềm</option>\n                        </select>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <!-- SECTION 3: Đổi bầu trời -->\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Đổi bầu trời</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"asset-hub-grid bg-evoto-grid\" style=\"margin-bottom: 8px;\">\n                    <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"sky_golden_sunset\" style=\"background: linear-gradient(180deg, #f97316, #fde047)\"><span>Hoàng hôn</span></button>\n                    <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"sky_alpine_blue\" style=\"background: linear-gradient(180deg, #1d4ed8, #93c5fd)\"><span>Trời xanh</span></button>\n                    <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"sky_dramatic_clouds\" style=\"background: linear-gradient(180deg, #334155, #94a3b8)\"><span>Mây bão</span></button>\n                    <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"sky_night_stars\" style=\"background: linear-gradient(180deg, #090d16, #1e293b)\"><span>Đêm sao</span></button>\n                  </div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tăng chiều sâu &amp; sắc trời</span><span class=\"val\" data-for=\"skyEnhance\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"skyEnhance\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n            </div>\n\n            <!-- MODULE 3B: LÀM ĐẸP TRANG PHỤC (Evoto Style) -->\n            <div id=\"mod-clothing\" class=\"retouch-module-pane\">\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title cloth-acc-title\">\n                  <span>▾ Điều chỉnh trang phục</span>\n                  <button type=\"button\" id=\"btn-clothing-reset\" class=\"cloth-reset-btn\" title=\"Đặt lại toàn bộ chỉnh sửa trang phục\">\n                    <svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">\n                      <path d=\"M3 12a9 9 0 1 0 3-6.7L3 8\" />\n                      <path d=\"M3 3v5h5\" />\n                    </svg>\n                  </button>\n                </div>\n                <div class=\"retouch-acc-body\">\n                  <!-- Nhóm đối tượng trang phục -->\n                  <div class=\"cloth-target-pills\" id=\"cloth-target-pills\">\n                    <button type=\"button\" class=\"cloth-target-pill active\" data-clothtarget=\"all\">Tất cả</button>\n                    <button type=\"button\" class=\"cloth-target-pill\" data-clothtarget=\"female\">Nữ</button>\n                    <button type=\"button\" class=\"cloth-target-pill\" data-clothtarget=\"male\">Nam</button>\n                    <button type=\"button\" class=\"cloth-target-pill\" data-clothtarget=\"child\">Trẻ con</button>\n                    <button type=\"button\" class=\"cloth-target-pill\" data-clothtarget=\"senior_female\">Nữ lớn tuổi</button>\n                    <button type=\"button\" class=\"cloth-target-pill\" data-clothtarget=\"senior_male\">Nam lớn tuổi</button>\n                  </div>\n\n                  <!-- Card Loại bỏ nếp nhăn quần áo -->\n                  <div class=\"cloth-wrinkle-card\">\n                    <div class=\"cloth-wrinkle-head\">\n                      <div class=\"cloth-wrinkle-title\">\n                        <span>Loại bỏ nếp nhăn quần áo</span>\n                        <span class=\"evoto-new-badge\">New</span>\n                      </div>\n                      <button type=\"button\" id=\"btn-cloth-wrinkle-link\" class=\"cloth-link-btn active\" aria-pressed=\"true\" title=\"Liên kết mức độ nếp nhăn nhỏ &amp; nếp nhăn lớn\">\n                        <svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">\n                          <path d=\"M9 17H7A5 5 0 0 1 7 7h2\" />\n                          <path d=\"M15 7h2a5 5 0 1 1 0 10h-2\" />\n                          <line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\" />\n                        </svg>\n                      </button>\n                    </div>\n                    <div class=\"retouch-slider-item\" style=\"margin-bottom: 0;\">\n                      <div class=\"s-head\"><span>Mức độ</span><span class=\"val\" data-for=\"clothingDewrinkle\">0</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"clothingDewrinkle\" min=\"0\" max=\"100\" value=\"0\" />\n                    </div>\n                  </div>\n\n                  <div class=\"retouch-slider-item\" style=\"margin-top: 10px;\">\n                    <div class=\"s-head\"><span>Loại bỏ nếp nhăn nhỏ</span><span class=\"val\" data-for=\"clothingSmallWrinkles\">100</span></div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"clothingSmallWrinkles\" min=\"0\" max=\"100\" value=\"100\" />\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Loại bỏ nếp nhăn lớn</span><span class=\"val\" data-for=\"clothingLargeWrinkles\">100</span></div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"clothingLargeWrinkles\" min=\"0\" max=\"100\" value=\"100\" />\n                  </div>\n\n                  <div class=\"bg-divider\" style=\"margin-top: 10px;\"></div>\n                  <div class=\"cloth-subhead\">Xoá khuyết điểm trên quần áo</div>\n\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span class=\"cloth-label-with-badges\">\n                        Xóa xơ vải\n                        <span class=\"cloth-help-dot\" title=\"Tự động nhận diện và xóa xơ vải, bụi trắng li ti trên trang phục\">?</span>\n                        <span class=\"evoto-beta-badge\">Beta</span>\n                      </span>\n                      <span class=\"val\" data-for=\"clothingLintClean\">0</span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"clothingLintClean\" min=\"0\" max=\"100\" value=\"0\" />\n                  </div>\n\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span class=\"cloth-label-with-badges\">\n                        Xóa vết mồ hôi\n                        <span class=\"evoto-beta-badge\">Beta</span>\n                        <span class=\"evoto-new-badge\">New</span>\n                      </span>\n                      <span class=\"cloth-val-with-arrow\">\n                        <span class=\"val\" data-for=\"clothingSweatStain\">0</span>\n                        <button type=\"button\" id=\"btn-cloth-sweat-expand\" class=\"cloth-sub-arrow\" aria-expanded=\"false\" title=\"Mở tinh chỉnh vết mồ hôi\">▸</button>\n                      </span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"clothingSweatStain\" min=\"0\" max=\"100\" value=\"0\" />\n                    <div id=\"cloth-sweat-drawer\" class=\"cloth-sub-drawer hidden\">\n                      <div class=\"s-head\" style=\"margin-top: 6px;\"><span>Đều màu vùng ẩm</span><span class=\"val\" data-for=\"clothingSweatEvenness\">50</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"clothingSweatEvenness\" min=\"0\" max=\"100\" value=\"50\" />\n                    </div>\n                  </div>\n\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span class=\"cloth-label-with-badges\">\n                        Làm phẳng viền trang phục\n                        <span class=\"cloth-help-dot\" title=\"Làm phẳng đường gấu áo, cổ áo, mép vải bị phồng hoặc nhăn nhúm\">?</span>\n                      </span>\n                      <span class=\"cloth-val-with-arrow\">\n                        <span class=\"val\" data-for=\"clothingEdgeSmooth\">0</span>\n                        <button type=\"button\" id=\"btn-cloth-edge-expand\" class=\"cloth-sub-arrow\" aria-expanded=\"false\" title=\"Mở tinh chỉnh viền trang phục\">▸</button>\n                      </span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"clothingEdgeSmooth\" min=\"0\" max=\"100\" value=\"0\" />\n                    <div id=\"cloth-edge-drawer\" class=\"cloth-sub-drawer hidden\">\n                      <div class=\"s-head\" style=\"margin-top: 6px;\"><span>Bảo vệ cổ &amp; gấu áo</span><span class=\"val\" data-for=\"clothingEdgeRefine\">50</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"clothingEdgeRefine\" min=\"0\" max=\"100\" value=\"50\" />\n                    </div>\n                  </div>\n\n                  <!-- Promo card: Loại bỏ vân vải (Moiré) -->\n                  <div class=\"cloth-promo-card\">\n                    <div class=\"cloth-promo-thumb\">\n                      <div class=\"cloth-promo-half cloth-promo-before\">\n                        <span class=\"cloth-ba-tag\">Before</span>\n                      </div>\n                      <div class=\"cloth-promo-half cloth-promo-after\">\n                        <span class=\"cloth-ba-tag after\">After</span>\n                      </div>\n                    </div>\n                    <div class=\"cloth-promo-info\">\n                      <div class=\"cloth-promo-icon\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\">\n                          <path d=\"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z\" />\n                        </svg>\n                      </div>\n                      <div class=\"cloth-promo-title\">Loại bỏ vân vải</div>\n                      <button type=\"button\" id=\"btn-cloth-try-moire\" class=\"cloth-promo-cta\">Dùng thử ngay →</button>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <!-- SECTION 2: AI Lab -->\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ AI Lab</div>\n                <div class=\"retouch-acc-body\">\n                  <button type=\"button\" id=\"btn-cloth-ailab-moire\" class=\"cloth-ailab-row\" aria-expanded=\"false\">\n                    <span class=\"cloth-ailab-left\">\n                      <span class=\"cloth-ailab-badge\">\n                        <svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\">\n                          <path d=\"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z\" />\n                        </svg>\n                      </span>\n                      <span>Loại bỏ vân vải</span>\n                    </span>\n                    <span class=\"cloth-ailab-chevron\" id=\"cloth-ailab-chevron\">›</span>\n                  </button>\n                  <div id=\"cloth-ailab-moire-drawer\" class=\"cloth-ailab-drawer hidden\">\n                    <div class=\"retouch-slider-item\" style=\"margin-bottom: 0;\">\n                      <div class=\"s-head\"><span>Khử vân Moiré trên vải</span><span class=\"val\" data-for=\"clothingMoireRemove\">0</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"clothingMoireRemove\" min=\"0\" max=\"100\" value=\"0\" />\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n\n            <!-- MODULE 4: CẮT & XOAY (Evoto Style) -->\n            <div id=\"mod-crop\" class=\"retouch-module-pane\">\n              <div class=\"crop-mode-tabs\">\n                <button type=\"button\" class=\"crop-mode-tab active\" data-croptab=\"crop-pane-main\">Cắt &amp; Xoay</button>\n                <button type=\"button\" class=\"crop-mode-tab\" data-croptab=\"crop-pane-expand\">Phối cảnh &amp; Mở rộng</button>\n              </div>\n\n              <!-- TAB 1: CẮT & XOAY -->\n              <div id=\"crop-pane-main\" class=\"crop-subtab-pane active\">\n                <div class=\"retouch-acc-group\">\n                  <div class=\"retouch-acc-title\">▾ Cắt</div>\n                  <div class=\"retouch-acc-body\">\n\n                    <!-- Evoto Crop Ratio Dropdown -->\n                    <div class=\"crop-ratio-wrap\">\n                      <button type=\"button\" id=\"crop-ratio-btn\" class=\"crop-ratio-btn\" aria-expanded=\"false\">\n                        <span id=\"crop-ratio-label\">Kích thước gốc</span>\n                        <svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"6 9 12 15 18 9\"/></svg>\n                      </button>\n                      <div id=\"crop-ratio-menu\" class=\"crop-ratio-menu hidden\">\n                        <div class=\"crop-ratio-opt active\" data-preset=\"original\" data-aw=\"0\" data-ah=\"0\"><span class=\"opt-check\">✓</span><span>Kích thước gốc</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"as_shot\" data-aw=\"-3\" data-ah=\"-3\"><span class=\"opt-check\"></span><span>Cài đặt ảnh gốc</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"fixed\" data-aw=\"-1\" data-ah=\"-1\"><span class=\"opt-check\"></span><span>Tỉ lệ cố định</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"custom_ratio\" data-aw=\"-2\" data-ah=\"-2\"><span class=\"opt-check\"></span><span>Kích thước tự chọn</span></div>\n                        <div class=\"crop-ratio-divider\"></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"1:1\" data-aw=\"1\" data-ah=\"1\"><span class=\"opt-check\"></span><span>1 : 1</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"4:5\" data-aw=\"4\" data-ah=\"5\"><span class=\"opt-check\"></span><span>4 : 5</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"5:7\" data-aw=\"5\" data-ah=\"7\"><span class=\"opt-check\"></span><span>5 : 7</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"2:3\" data-aw=\"2\" data-ah=\"3\"><span class=\"opt-check\"></span><span>2 : 3</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"16:9\" data-aw=\"16\" data-ah=\"9\"><span class=\"opt-check\"></span><span>16 : 9</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"1.91:1\" data-aw=\"191\" data-ah=\"100\"><span class=\"opt-check\"></span><span>1.91 : 1</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"2:1\" data-aw=\"2\" data-ah=\"1\"><span class=\"opt-check\"></span><span>2 : 1</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"3:1\" data-aw=\"3\" data-ah=\"1\"><span class=\"opt-check\"></span><span>3 : 1</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"4:3\" data-aw=\"4\" data-ah=\"3\"><span class=\"opt-check\"></span><span>4 : 3</span></div>\n                        <div class=\"crop-ratio-divider\"></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"custom_dim\" data-aw=\"-4\" data-ah=\"-4\"><span class=\"opt-check\"></span><span>Dài*Rộng*Độ phân giải</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"id_photo\" data-aw=\"-5\" data-ah=\"-5\"><span class=\"opt-check\"></span><span>Ảnh Thẻ</span><span class=\"opt-arrow\">›</span></div>\n                      </div>\n                    </div>\n\n                    <!-- Nhập tay tỉ lệ W : H -->\n                    <div id=\"crop-custom-ratio-box\" class=\"crop-custom-inputs hidden\">\n                      <div class=\"crop-dim-grid\">\n                        <div class=\"crop-dim-field\">\n                          <label>Tỉ lệ ngang</label>\n                          <input type=\"number\" id=\"crop-ratio-w-in\" class=\"crop-num-input\" min=\"0.1\" max=\"9999\" step=\"0.1\" value=\"4\" />\n                        </div>\n                        <button type=\"button\" id=\"btn-crop-swap-ratio\" class=\"crop-swap-btn\" title=\"Đảo tỉ lệ ngang / dọc\">⇄</button>\n                        <div class=\"crop-dim-field\">\n                          <label>Tỉ lệ dọc</label>\n                          <input type=\"number\" id=\"crop-ratio-h-in\" class=\"crop-num-input\" min=\"0.1\" max=\"9999\" step=\"0.1\" value=\"5\" />\n                        </div>\n                      </div>\n                    </div>\n\n                    <!-- Nhập tay Dài * Rộng * Độ phân giải -->\n                    <div id=\"crop-custom-inputs\" class=\"crop-custom-inputs hidden\">\n                      <div class=\"crop-dim-grid\">\n                        <div class=\"crop-dim-field\">\n                          <label>Rộng</label>\n                          <input type=\"number\" id=\"crop-custom-w-in\" class=\"crop-num-input\" min=\"1\" max=\"20000\" step=\"1\" placeholder=\"1200\" />\n                        </div>\n                        <button type=\"button\" id=\"btn-crop-swap-dim\" class=\"crop-swap-btn\" title=\"Đảo Rộng × Cao\">⇄</button>\n                        <div class=\"crop-dim-field\">\n                          <label>Cao</label>\n                          <input type=\"number\" id=\"crop-custom-h-in\" class=\"crop-num-input\" min=\"1\" max=\"20000\" step=\"1\" placeholder=\"1500\" />\n                        </div>\n                      </div>\n                      <div class=\"crop-dim-meta-row\">\n                        <select id=\"crop-dim-unit\" class=\"crop-mini-select\">\n                          <option value=\"px\">px (Pixel)</option>\n                          <option value=\"cm\">cm</option>\n                          <option value=\"mm\">mm</option>\n                        </select>\n                        <div class=\"crop-dpi-field\">\n                          <span>DPI</span>\n                          <input type=\"number\" id=\"crop-dpi-in\" class=\"crop-num-input\" min=\"72\" max=\"1200\" step=\"1\" value=\"300\" />\n                        </div>\n                      </div>\n                      <p id=\"crop-dim-computed\" class=\"crop-custom-hint\">Áp dụng đúng tỉ lệ &amp; xuất đúng kích thước</p>\n                    </div>\n\n                    <!-- Preset Ảnh Thẻ -->\n                    <div id=\"crop-id-presets-box\" class=\"crop-custom-inputs hidden\">\n                      <div class=\"crop-id-grid\">\n                        <button type=\"button\" class=\"crop-id-chip\" data-idpreset=\"id_2x3\" data-cmw=\"2\" data-cmh=\"3\">2×3 cm</button>\n                        <button type=\"button\" class=\"crop-id-chip\" data-idpreset=\"id_3x4\" data-cmw=\"3\" data-cmh=\"4\">3×4 cm</button>\n                        <button type=\"button\" class=\"crop-id-chip\" data-idpreset=\"id_4x6\" data-cmw=\"4\" data-cmh=\"6\">4×6 cm</button>\n                        <button type=\"button\" class=\"crop-id-chip\" data-idpreset=\"id_35x45\" data-cmw=\"3.5\" data-cmh=\"4.5\">Visa 3.5×4.5</button>\n                        <button type=\"button\" class=\"crop-id-chip\" data-idpreset=\"id_5x5\" data-cmw=\"5\" data-cmh=\"5\">5×5 cm</button>\n                        <button type=\"button\" class=\"crop-id-chip\" data-idpreset=\"id_33x48\" data-cmw=\"3.3\" data-cmh=\"4.8\">3.3×4.8 cm</button>\n                      </div>\n                      <p id=\"crop-id-readout\" class=\"crop-custom-hint\">300 DPI · Tự động khóa đúng tỉ lệ ảnh thẻ</p>\n                    </div>\n\n                    <!-- Live Readout + Action Buttons -->\n                    <div class=\"crop-toolbar-row\">\n                      <span id=\"crop-box-readout\" class=\"crop-box-readout\">Toàn khung ảnh</span>\n                      <div class=\"crop-mini-actions\">\n                        <button type=\"button\" id=\"btn-crop-orient\" class=\"crop-mini-btn\" title=\"Đảo chiều khung cắt (Ngang / Dọc)\">⇄</button>\n                        <button type=\"button\" id=\"btn-crop-preview-toggle\" class=\"crop-mini-btn\" title=\"Xem kết quả đã cắt ngay\">Xem</button>\n                        <button type=\"button\" id=\"btn-crop-reset\" class=\"crop-mini-btn\" title=\"Đặt lại khung cắt\">↺</button>\n                      </div>\n                    </div>\n\n                    <div class=\"crop-apply-reset-row\">\n                      <button type=\"button\" id=\"btn-crop-apply\" class=\"crop-action-btn primary\" title=\"Áp dụng vùng cắt vào khung xem trước\">Áp dụng cắt</button>\n                      <button type=\"button\" id=\"btn-crop-reset-btn\" class=\"crop-action-btn secondary\" title=\"Khôi phục khung ảnh gốc\">Đặt lại cắt</button>\n                    </div>\n\n                    <!-- Show Grid -->\n                    <label class=\"crop-check-row\">\n                      <input type=\"checkbox\" id=\"crop-show-grid\" checked />\n                      <span>Hiển thị lưới khi cắt ảnh</span>\n                    </label>\n\n                    <!-- Định vị bằng AI -->\n                    <div class=\"crop-ai-section\">\n                      <div class=\"crop-ai-title\">Định vị bằng AI</div>\n                      <div class=\"crop-ai-tabs\">\n                        <button type=\"button\" class=\"crop-ai-tab active\" id=\"crop-ai-tab-subject\">Chủ thể</button>\n                        <button type=\"button\" class=\"crop-ai-tab\" id=\"crop-ai-tab-head\">Khung chân dung</button>\n                      </div>\n\n                      <div id=\"crop-ai-subject-panel\">\n                        <div class=\"crop-toggle-row\">\n                          <span class=\"crop-toggle-label\">Định vị đối tượng</span>\n                          <button type=\"button\" id=\"toggle-crop-ai-subject\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\">\n                            <span class=\"evoto-switch-knob\"></span>\n                          </button>\n                        </div>\n                        <div class=\"crop-sublabel\">Tự động căn chỉnh người</div>\n                        <div class=\"crop-ai-stack-btns\">\n                          <button type=\"button\" id=\"btn-crop-align-v\" class=\"crop-pill-action-btn\">Căn chỉnh dọc</button>\n                          <button type=\"button\" id=\"btn-crop-align-eye\" class=\"crop-pill-action-btn\">Căn ngang theo mắt</button>\n                        </div>\n                      </div>\n\n                      <div id=\"crop-ai-head-panel\" class=\"hidden\">\n                        <div class=\"crop-sublabel\" style=\"margin-top:8px\">Bố cục chân dung AI 478 điểm</div>\n                        <div class=\"crop-id-grid\">\n                          <button type=\"button\" class=\"crop-frame-chip\" data-frame=\"headshot\">Cận mặt</button>\n                          <button type=\"button\" class=\"crop-frame-chip\" data-frame=\"waist\">Bán thân</button>\n                          <button type=\"button\" class=\"crop-frame-chip\" data-frame=\"full\">Toàn thân</button>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n\n                <!-- XOAY -->\n                <div class=\"retouch-acc-group\">\n                  <div class=\"retouch-acc-title\">▾ Xoay</div>\n                  <div class=\"retouch-acc-body\">\n                    <div class=\"crop-rotate-icons\">\n                      <button type=\"button\" id=\"btn-crop-rot-left\" class=\"crop-icon-btn\" title=\"Xoay trái 90°\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M3 12a9 9 0 1 0 3-6.7L3 8\"/><path d=\"M3 3v5h5\"/><rect x=\"9\" y=\"9\" width=\"8\" height=\"8\" rx=\"1.2\"/></svg>\n                      </button>\n                      <button type=\"button\" id=\"btn-crop-rot-right\" class=\"crop-icon-btn\" title=\"Xoay phải 90°\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M21 12a9 9 0 1 1-3-6.7L21 8\"/><path d=\"M21 3v5h-5\"/><rect x=\"7\" y=\"9\" width=\"8\" height=\"8\" rx=\"1.2\"/></svg>\n                      </button>\n                      <button type=\"button\" id=\"btn-flip-h\" class=\"crop-icon-btn\" title=\"Lật ngang (Soi gương)\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"21\" stroke-dasharray=\"2 2\"/><polygon points=\"8 7 3 12 8 17 8 7\"/><polygon points=\"16 7 21 12 16 17 16 7\"/></svg>\n                      </button>\n                      <button type=\"button\" id=\"btn-flip-v\" class=\"crop-icon-btn\" title=\"Lật dọc\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\" stroke-dasharray=\"2 2\"/><polygon points=\"7 8 12 3 17 8 7 8\"/><polygon points=\"7 16 12 21 17 16 7 16\"/></svg>\n                      </button>\n                    </div>\n                    <div class=\"crop-ai-straighten-row\">\n                      <span class=\"crop-toggle-label\">AI Hiệu Chỉnh</span>\n                      <button type=\"button\" id=\"btn-ai-auto-straighten\" class=\"crop-auto-pill\">Tự động</button>\n                    </div>\n                    <div class=\"retouch-slider-item\" style=\"margin-top:8px\">\n                      <div class=\"s-head\"><span>Góc</span><span class=\"val\" data-for=\"rotateAngle\">0.00</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"rotateAngle\" min=\"-45\" max=\"45\" step=\"0.1\" value=\"0\" />\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <!-- TAB 2: PHỐI CẢNH & MỞ RỘNG -->\n              <div id=\"crop-pane-expand\" class=\"crop-subtab-pane\">\n                <div class=\"retouch-acc-group\">\n                  <div class=\"retouch-acc-title\">▾ Biến dạng phối cảnh</div>\n                  <div class=\"retouch-acc-body\">\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Biến dạng dọc (Keystone V)</span><span class=\"val\" data-for=\"keystoneVertical\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"keystoneVertical\" min=\"-50\" max=\"50\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Biến dạng ngang (Keystone H)</span><span class=\"val\" data-for=\"keystoneHorizontal\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"keystoneHorizontal\" min=\"-50\" max=\"50\" value=\"0\" /></div>\n                  </div>\n                </div>\n                <div class=\"retouch-acc-group\">\n                  <div class=\"retouch-acc-title\">▾ Hình học &amp; Mở rộng khung</div>\n                  <div class=\"retouch-acc-body\">\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Thu phóng hình (%)</span><span class=\"val\" data-for=\"geoScale\">100</span></div><input type=\"range\" class=\"retouch-slider\" id=\"geoScale\" min=\"50\" max=\"200\" value=\"100\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ lệch trục X</span><span class=\"val\" data-for=\"geoOffsetX\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"geoOffsetX\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ lệch trục Y</span><span class=\"val\" data-for=\"geoOffsetY\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"geoOffsetY\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- CHÂN BẢNG PHẢI CỐ ĐỊNH KIỂU EVOTO -->\n          <div class=\"inspector-footer\">\n            <button id=\"btn-save-user-preset-footer\" type=\"button\" class=\"evoto-footer-pill\">Lưu cài sẵn mới</button>\n            <button id=\"btn-sync-all-footer\" type=\"button\" class=\"evoto-footer-pill\">Đồng bộ tất cả</button>\n            <button id=\"btn-reset-all-footer\" type=\"button\" class=\"evoto-footer-gear\" title=\"Đặt lại toàn bộ thông số ảnh hiện tại\">↺</button>\n          </div>\n        </aside>";

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
