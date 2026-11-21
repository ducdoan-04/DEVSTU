// assets/stu_ultra_module.js - DEVSTU STU Ultra with Collabs-Retouch-Pro Rust SIMD Engine
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
    opticsDefringePurple: 0, opticsDefringeGreen: 0,
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
    isHighresMatte: false,

    // MODULE 5: LK MAGIC PRO AI (STU ULTRA MAX)
    lkAiColorStyle: 'none',
    lkAiColorStrength: 75,
    lkDeepSkinSmooth: 0,
    lkSkinTonePreset: 'none',
    lkSkinToneStrength: 60,
    lkSkyPreset: 'none',
    lkSkyStrength: 85,
    lkSkyRelight: 50,
    lkBgPreset: 'none'
  };

  function isStuMode(A) {
    return Boolean(A && A.mode === 'stu_ultra');
  }

  function hasActiveLkMaxParams(p) {
    if (!p) return false;
    return Boolean(
      (p.lkAiColorStyle && p.lkAiColorStyle !== 'none' && Number(p.lkAiColorStrength) > 0) ||
      (Number(p.lkDeepSkinSmooth) > 0) ||
      (p.lkSkinTonePreset && p.lkSkinTonePreset !== 'none' && Number(p.lkSkinToneStrength) > 0) ||
      (p.lkSkyPreset && p.lkSkyPreset !== 'none' && Number(p.lkSkyStrength) > 0) ||
      (p.lkBgPreset && p.lkBgPreset !== 'none')
    );
  }

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
    },
    wedding: {
      freckleAcne: 50, faceShine: 35, darkCircles: 45, freqSepLow: 45, freqSepHigh: 85,
      skinRadiance: 40, skinWarmth: 15, eyeBrighten: 40, teethWhiten: 45, smileEnhance: 14,
      exposure: 8, highlights: -14, shadows: 18, temperature: 10, vibrance: 12, lutPreset: 'warm_wedding'
    },
    group: {
      freckleAcne: 45, faceShine: 40, darkCircles: 40, dodgeBurnEven: 40, freqSepLow: 40, freqSepHigh: 80,
      eyeBrighten: 35, teethWhiten: 40, exposure: 6, highlights: -10, shadows: 20, vibrance: 16
    },
    studio: {
      freckleAcne: 60, faceShine: 50, darkCircles: 50, dodgeBurnEven: 45, dodgeBurnSculpt: 40,
      freqSepLow: 50, freqSepHigh: 90, eyeBrighten: 45, teethWhiten: 45, contrast: 12, clarity: 10
    },
    outdoor: {
      freckleAcne: 45, darkCircles: 40, freqSepLow: 40, freqSepHigh: 80, skinRadiance: 35,
      skinWarmth: 20, exposure: 6, highlights: -18, shadows: 15, temperature: 14, vibrance: 12
    },
    product: {
      exposure: 6, contrast: 12, highlights: -10, shadows: 12, clarity: 25, sharpenAmount: 30, vibrance: 15
    },
    landscape: {
      contrast: 15, highlights: -25, shadows: 22, clarity: 25, sharpenAmount: 30, vibrance: 25, temperature: 6
    },
    street: {
      contrast: 22, highlights: -15, shadows: 10, clarity: 20, sharpenAmount: 20, vibrance: -5,
      gradeShadowHue: 195, gradeShadowSat: 25, gradeHighHue: 35, gradeHighSat: 20
    },
    newborn: {
      freckleAcne: 40, darkCircles: 30, freqSepLow: 55, freqSepHigh: 75, skinRadiance: 30,
      skinWarmth: 12, exposure: 10, highlights: -15, shadows: 18, contrast: -10, clarity: -12
    },
    kids: {
      freckleAcne: 30, darkCircles: 25, freqSepLow: 35, freqSepHigh: 78, skinRadiance: 35,
      eyeBrighten: 40, exposure: 8, highlights: -12, shadows: 15, vibrance: 20
    },
    family: {
      freckleAcne: 45, faceShine: 35, darkCircles: 40, freqSepLow: 40, freqSepHigh: 80,
      skinWarmth: 15, exposure: 5, highlights: -12, shadows: 14, temperature: 10, vibrance: 8
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

  function drawSourceToJpegResult(srcEl, srcW, srcH, maxDim, quality) {
    var w = Math.max(1, srcW || 1);
    var h = Math.max(1, srcH || 1);
    if (maxDim > 0 && (w > maxDim || h > maxDim)) {
      var sc = maxDim / Math.max(w, h);
      w = Math.max(1, Math.round(w * sc));
      h = Math.max(1, Math.round(h * sc));
    }
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    var ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(srcEl, 0, 0, w, h);
    return { dataUrl: c.toDataURL('image/jpeg', quality || 0.94), width: w, height: h };
  }

  function decodeBlobUprightToDataUrl(blob, maxDim, quality) {
    var q = quality || 0.95;
    var limit = maxDim || 0;
    return new Promise(function(resolve) {
      var fallbackImageDecode = function() {
        var url = URL.createObjectURL(blob);
        var img = new Image();
        img.onload = function() {
          var res = drawSourceToJpegResult(img, img.naturalWidth, img.naturalHeight, limit, q);
          URL.revokeObjectURL(url);
          resolve(res);
        };
        img.onerror = function() {
          URL.revokeObjectURL(url);
          resolve(null);
        };
        img.src = url;
      };
      if (typeof createImageBitmap === 'function') {
        createImageBitmap(blob, { imageOrientation: 'from-image' }).then(function(bmp) {
          var res = drawSourceToJpegResult(bmp, bmp.width, bmp.height, limit, q);
          try { bmp.close(); } catch (_) {}
          resolve(res);
        }).catch(fallbackImageDecode);
      } else {
        fallbackImageDecode();
      }
    });
  }

  function getPhotoBitmapFallback(photo, maxDim, quality) {
    if (typeof window._devstuGetBitmap !== 'function') return Promise.resolve(null);
    return window._devstuGetBitmap(photo, maxDim || 4096).then(function(bmp) {
      if (!bmp) return null;
      var res = drawSourceToJpegResult(bmp, bmp.width, bmp.height, maxDim || 0, quality || 0.94);
      try { bmp.close && bmp.close(); } catch (_) {}
      return res;
    }).catch(function() { return null; });
  }

  function getPhotoOriginalDataUrl(photo) {
    return new Promise(function(resolve) {
      if (!photo) return resolve(null);
      if (photo._stuRotatedDataUrl) {
        photo._cachedOriginalDataUrl = photo._stuRotatedDataUrl;
        return resolve(photo._stuRotatedDataUrl);
      }
      if (photo._cachedOriginalDataUrl) {
        return resolve(photo._cachedOriginalDataUrl);
      }
      var finalize = function(dec) {
        if (dec && dec.dataUrl) {
          photo._cachedOriginalDataUrl = dec.dataUrl;
          photo._stuUltraWidth = dec.width;
          photo._stuUltraHeight = dec.height;
          resolve(dec.dataUrl);
        } else if (photo.processedDataUrl && typeof photo.processedDataUrl === 'string' && photo.processedDataUrl.indexOf('data:') === 0) {
          photo._cachedOriginalDataUrl = photo.processedDataUrl;
          resolve(photo.processedDataUrl);
        } else {
          resolve(null);
        }
      };
      var blob = photo.file || (photo.src && photo.src.blob);
      if (blob) {
        decodeBlobUprightToDataUrl(blob, 4096, 0.95).then(function(dec) {
          if (dec && dec.dataUrl) finalize(dec);
          else getPhotoBitmapFallback(photo, 4096, 0.95).then(finalize);
        });
      } else {
        getPhotoBitmapFallback(photo, 4096, 0.95).then(finalize);
      }
    });
  }

  function getPhotoPreviewDataUrl(photo) {
    return new Promise(function(resolve) {
      if (!photo) return resolve(null);
      if (photo._stuRotatedDataUrl) {
        photo._cachedPreviewDataUrl = photo._stuRotatedDataUrl;
        return resolve(photo._stuRotatedDataUrl);
      }
      if (photo._cachedPreviewDataUrl) {
        return resolve(photo._cachedPreviewDataUrl);
      }
      var blob = photo.file || (photo.src && photo.src.blob);
      if (blob) {
        decodeBlobUprightToDataUrl(blob, 1600, 0.92).then(function(dec) {
          if (dec && dec.dataUrl) {
            photo._cachedPreviewDataUrl = dec.dataUrl;
            resolve(dec.dataUrl);
            return;
          }
          getPhotoOriginalDataUrl(photo).then(resolve);
        });
      } else {
        getPhotoOriginalDataUrl(photo).then(function(orig) {
          if (!orig) return resolve(null);
          var img = new Image();
          img.onload = function() {
            var res = drawSourceToJpegResult(img, img.naturalWidth, img.naturalHeight, 1600, 0.92);
            photo._cachedPreviewDataUrl = res.dataUrl;
            resolve(res.dataUrl);
          };
          img.onerror = function() { resolve(orig); };
          img.src = orig;
        });
      }
    });
  }

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function getPhotoCurvePoints(photo) {
    if (!photo._stuCurvePoints || photo._stuCurvePoints.length < 2) {
      photo._stuCurvePoints = [
        { x: 0, y: 0 },
        { x: 0.25, y: 0.25 },
        { x: 0.5, y: 0.5 },
        { x: 0.75, y: 0.75 },
        { x: 1, y: 1 }
      ];
    }
    return photo._stuCurvePoints;
  }

  function evaluateCurveSpline(points, x) {
    var sorted = points.slice().sort(function(a, b) { return a.x - b.x; });
    if (x <= sorted[0].x) return sorted[0].y;
    if (x >= sorted[sorted.length - 1].x) return sorted[sorted.length - 1].y;
    var i = 0;
    while (i < sorted.length - 1 && sorted[i + 1].x < x) i++;
    var p0 = sorted[Math.max(0, i - 1)];
    var p1 = sorted[i];
    var p2 = sorted[i + 1];
    var p3 = sorted[Math.min(sorted.length - 1, i + 2)];
    var span = Math.max(1e-4, p2.x - p1.x);
    var t = (x - p1.x) / span;
    var t2 = t * t;
    var t3 = t2 * t;
    var y = 0.5 * (
      2 * p1.y +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
    );
    return clamp01(y);
  }

  function build256CurveLutFromPoints(points) {
    var isIdentity = points.every(function(pt) { return Math.abs(pt.x - pt.y) < 0.004; });
    if (isIdentity) return [];
    var lut = new Array(256);
    for (var i = 0; i < 256; i++) {
      var x = i / 255;
      var y = evaluateCurveSpline(points, x);
      lut[i] = Math.max(0, Math.min(255, Math.round(y * 255)));
    }
    return lut;
  }

  function computeColorMatchStatsFromImage(imgEl) {
    var c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    var ctx = c.getContext('2d');
    ctx.drawImage(imgEl, 0, 0, 128, 128);
    var data = ctx.getImageData(0, 0, 128, 128).data;
    var n = 128 * 128;
    var sr = 0, sg = 0, sb = 0;
    for (var i = 0; i < data.length; i += 4) {
      sr += data[i] / 255;
      sg += data[i + 1] / 255;
      sb += data[i + 2] / 255;
    }
    var mr = sr / n, mg = sg / n, mb = sb / n;
    var vr = 0, vg = 0, vb = 0;
    for (var j = 0; j < data.length; j += 4) {
      vr += Math.pow(data[j] / 255 - mr, 2);
      vg += Math.pow(data[j + 1] / 255 - mg, 2);
      vb += Math.pow(data[j + 2] / 255 - mb, 2);
    }
    return [
      mr, Math.max(0.02, Math.sqrt(vr / n)),
      mg, Math.max(0.02, Math.sqrt(vg / n)),
      mb, Math.max(0.02, Math.sqrt(vb / n))
    ];
  }

  var BG_SWITCH_KEYS = [
    'bgCleanDistractions', 'bgCleanDefects', 'bgEvenBrightness', 'bgRemoveBanding',
    'bgDecontam', 'bgGroundReflect', 'bgPreserveShadow'
  ];

  var BG_SELECT_IDS = [
    'bgReplaceMode', 'bgEdgeMode', 'bgKeepScope', 'bgFillArea',
    'bgFillMode', 'bgBlendMode', 'bgShadowBlendMode'
  ];

  function needsHighresMatte(p) {
    if (!p) return false;
    return Boolean(
      (p.bgReplaceMode && p.bgReplaceMode !== 'original') ||
      (p.bgBlurBokeh || 0) > 0.5 ||
      (p.strayHair || 0) > 0.5 ||
      (p.backdropClean || 0) > 0.5 ||
      p.bgCleanDistractions || p.bgCleanDefects || p.bgEvenBrightness || p.bgRemoveBanding
    );
  }

  function hasActiveCropRect(p) {
    if (!p) return false;
    return (p.cropX > 0.001) || (p.cropY > 0.001) || (p.cropW < 0.999) || (p.cropH < 0.999);
  }

  var RAIL_HTML = "<nav class=\"retouch-right-rail\" aria-label=\"Thanh công cụ bên phải\">\n          <div class=\"rail-top\">\n            <div class=\"rail-ai-badge\" title=\"Retouch Studio AI 478 điểm + Rust SIMD\">Ai</div>\n            <button class=\"rail-icon-btn\" data-mod=\"mod-color\" data-title=\"Điều chỉnh màu\" title=\"Điều chỉnh màu (HSL, Đường cong, Cân bằng trắng, Khử nhiễu AI)\">\n              <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\">\n                <circle cx=\"13.5\" cy=\"6.5\" r=\"2.2\" />\n                <circle cx=\"17.5\" cy=\"10.5\" r=\"2.2\" />\n                <circle cx=\"8.5\" cy=\"7.5\" r=\"2.2\" />\n                <circle cx=\"6.5\" cy=\"12.5\" r=\"2.2\" />\n                <path d=\"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z\" />\n              </svg>\n            </button>\n            <button class=\"rail-icon-btn active\" data-mod=\"mod-portrait\" data-title=\"Chỉnh sửa chân dung\" title=\"Chỉnh sửa chân dung (Khử mụn, Làm mịn da, Khuôn mặt 3D, Trang điểm, Tóc)\">\n              <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\">\n                <path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\" />\n                <circle cx=\"12\" cy=\"7\" r=\"4\" />\n              </svg>\n            </button>\n            <button class=\"rail-icon-btn\" data-mod=\"mod-bg\" data-title=\"Điều chỉnh phông nền\" title=\"Điều chỉnh phông nền, Thay nền &amp; Đổi bầu trời AI\">\n              <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\">\n                <rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\" />\n                <circle cx=\"9\" cy=\"9\" r=\"2\" />\n                <path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\" />\n              </svg>\n            </button>\n            <button class=\"rail-icon-btn\" data-mod=\"mod-clothing\" data-title=\"Làm đẹp trang phục\" title=\"Làm đẹp trang phục (Ủi phẳng nếp nhăn, Xóa xơ vải, Vết mồ hôi, Khử vân vải AI)\">\n              <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\">\n                <path d=\"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z\" />\n              </svg>\n            </button>\n            <button class=\"rail-icon-btn\" data-mod=\"mod-crop\" data-title=\"Cắt &amp; Xoay\" title=\"Cắt ảnh, Xoay, Định vị AI &amp; Hiệu chỉnh phối cảnh\">\n              <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\">\n                <path d=\"M6 2v14a2 2 0 0 0 2 2h14\" />\n                <path d=\"M18 22V8a2 2 0 0 0-2-2H2\" />\n              </svg>\n            </button>\n          </div>\n\n          <div class=\"rail-bottom\">\n            <div id=\"rail-batch-ring\" class=\"rail-batch-ring\" title=\"Số ảnh đang mở trong phiên\">0</div>\n          </div>\n        </nav>";
  var INSPECTOR_HTML = "<aside class=\"retouch-right-inspector\">\n          <div class=\"right-panel-topheader\">\n            <span id=\"right-module-title\">Chỉnh sửa chân dung</span>\n          </div>\n\n          <div class=\"right-inspector-scroll\">\n            <!-- BIỂU ĐỒ RGB + CHẾ ĐỘ CHỈNH MÀU THỜI GIAN THỰC -->\n            <div class=\"retouch-histogram-block\">\n              <div class=\"hist-collapse-head\" id=\"btn-toggle-histogram\">\n                <span>▾ Biểu đồ</span>\n                <span id=\"hist-exposure-info\">16-bit • Rust SIMD</span>\n              </div>\n              <div id=\"hist-body-wrap\">\n                <div class=\"hist-card-shell\">\n                  <canvas id=\"histogram-canvas\" width=\"290\" height=\"68\"></canvas>\n                  <div class=\"hist-telemetry-row\">\n                    <span>sRGB</span>\n                    <span>RGBA</span>\n                    <span id=\"hist-rgb-mean\">R - · G - · B -</span>\n                  </div>\n                </div>\n              </div>\n              <div class=\"evoto-realtime-row\">\n                <span>Chế độ chỉnh màu thời gian thực</span>\n                <button\n                  id=\"toggle-realtime-color\"\n                  type=\"button\"\n                  role=\"switch\"\n                  aria-checked=\"true\"\n                  class=\"evoto-switch on\"\n                  title=\"Tắt nếu máy xử lý ảnh RAW lớn bị chậm khi kéo nhanh (chỉ xử lý khi thả chuột)\"\n                >\n                  <span class=\"evoto-switch-knob\"></span>\n                </button>\n              </div>\n            </div>\n\n            <!-- MODULE 1: ĐIỀU CHỈNH MÀU (100% ĐỦ TOÀN BỘ THANH TRƯỢT + ĐƯỜNG CONG + HSL + LENS + GRAIN) -->\n            <div id=\"mod-color\" class=\"retouch-module-pane\">\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Bộ lọc &amp; Hồ sơ màu</div>\n                <div class=\"retouch-acc-body\">\n                  <select id=\"lutPreset\" class=\"retouch-select\">\n                    <option value=\"none\">Màu tiêu chuẩn Studio</option>\n                    <option value=\"clean_portrait\">Chân dung thương mại trong trẻo</option>\n                    <option value=\"fuji_pro\">Fujifilm Pro 400H Dịu nhẹ</option>\n                    <option value=\"kodak_gold\">Kodak Portra 400 Ấm áp</option>\n                    <option value=\"cinematic_teal\">Điện ảnh Teal &amp; Cam</option>\n                    <option value=\"warm_wedding\">Ánh vàng Giờ Vàng (Ảnh cưới)</option>\n                    <option value=\"bw_studio\">Phim Đen Trắng Ilford Delta</option>\n                  </select>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ AI Khớp màu (Từ ảnh tham chiếu)</div>\n                <div class=\"retouch-acc-body\">\n                  <div style=\"display: flex; gap: 6px; align-items: center\">\n                    <button id=\"btn-load-color-ref\" class=\"retouch-sync-btn\" style=\"flex: 1\">+ Chọn ảnh mẫu màu</button>\n                    <button id=\"btn-clear-color-ref\" class=\"retouch-sync-btn\" title=\"Xóa ảnh mẫu\">Xóa</button>\n                    <input type=\"file\" id=\"ref-color-input\" accept=\"image/*\" hidden />\n                  </div>\n                  <div class=\"retouch-slider-item\" style=\"margin-top: 4px\">\n                    <div class=\"s-head\"><span>Cường độ khớp màu</span><span class=\"val\" data-for=\"colorMatchStrength\">0</span></div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"colorMatchStrength\" min=\"0\" max=\"100\" value=\"0\" />\n                  </div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Cân bằng trắng</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Nhiệt độ màu (Temp)</span><span class=\"val\" data-for=\"temperature\">0</span></div>\n                    <input type=\"range\" class=\"retouch-slider wb-temp\" id=\"temperature\" min=\"-100\" max=\"100\" value=\"0\" />\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Sắc thái màu (Tint)</span><span class=\"val\" data-for=\"tint\">0</span></div>\n                    <input type=\"range\" class=\"retouch-slider wb-tint\" id=\"tint\" min=\"-100\" max=\"100\" value=\"0\" />\n                  </div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Cơ Bản — Tông màu &amp; Độ nét</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Phơi sáng (Exposure)</span><span class=\"val\" data-for=\"exposure\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"exposure\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tương phản (Contrast)</span><span class=\"val\" data-for=\"contrast\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"contrast\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Vùng sáng (Highlights)</span><span class=\"val\" data-for=\"highlights\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"highlights\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Vùng tối (Shadows)</span><span class=\"val\" data-for=\"shadows\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"shadows\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Điểm trắng (Whites)</span><span class=\"val\" data-for=\"whites\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"whites\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Điểm đen (Blacks)</span><span class=\"val\" data-for=\"blacks\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"blacks\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Kết cấu (Texture)</span><span class=\"val\" data-for=\"texture\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"texture\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ nét cục bộ (Clarity)</span><span class=\"val\" data-for=\"clarity\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"clarity\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử sương mù (Dehaze)</span><span class=\"val\" data-for=\"dehaze\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"dehaze\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ tươi (Vibrance)</span><span class=\"val\" data-for=\"vibrance\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"vibrance\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa (Saturation)</span><span class=\"val\" data-for=\"saturation\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"saturation\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Đường cong tông màu (256-LUT)</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"curve-canvas-box\">\n                    <canvas id=\"tone-curve-canvas\" width=\"268\" height=\"170\" title=\"Nhấp để thêm điểm · Kéo để chỉnh · Nhấp đúp vào điểm để xóa\"></canvas>\n                    <div class=\"curve-toolbar-row\">\n                      <span class=\"curve-hint\">Kéo điểm trên biểu đồ</span>\n                      <button id=\"btn-reset-curve\" class=\"mini-save-btn\">Đặt lại đường cong</button>\n                    </div>\n                  </div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Điểm rất sáng (Highlights)</span><span class=\"val\" data-for=\"curveHighlights\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"curveHighlights\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Vùng sáng vừa (Lights)</span><span class=\"val\" data-for=\"curveLights\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"curveLights\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Vùng tối vừa (Darks)</span><span class=\"val\" data-for=\"curveDarks\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"curveDarks\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Vùng tối sâu (Shadows)</span><span class=\"val\" data-for=\"curveShadows\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"curveShadows\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ HSL 8 Kênh màu</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"hsl-color-dots\" id=\"hsl-band-tabs\">\n                    <button class=\"hsl-dot active\" data-hsl=\"Red\" style=\"background: #ef4444\" title=\"Đỏ\"></button>\n                    <button class=\"hsl-dot\" data-hsl=\"Orange\" style=\"background: #f97316\" title=\"Cam (Tông da)\"></button>\n                    <button class=\"hsl-dot\" data-hsl=\"Yellow\" style=\"background: #eab308\" title=\"Vàng\"></button>\n                    <button class=\"hsl-dot\" data-hsl=\"Green\" style=\"background: #22c55e\" title=\"Xanh lá\"></button>\n                    <button class=\"hsl-dot\" data-hsl=\"Aqua\" style=\"background: #06b6d4\" title=\"Xanh ngọc\"></button>\n                    <button class=\"hsl-dot\" data-hsl=\"Blue\" style=\"background: #3b82f6\" title=\"Xanh dương\"></button>\n                    <button class=\"hsl-dot\" data-hsl=\"Purple\" style=\"background: #a855f7\" title=\"Tím\"></button>\n                    <button class=\"hsl-dot\" data-hsl=\"Magenta\" style=\"background: #ec4899\" title=\"Hồng cánh sen\"></button>\n                  </div>\n\n                  <div class=\"hsl-band-pane active\" data-hsl-pane=\"Red\">\n                    <div class=\"sub-badge\">Kênh Đỏ</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Đỏ</span><span class=\"val\" data-for=\"hslRedHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslRedHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Đỏ</span><span class=\"val\" data-for=\"hslRedSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslRedSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Đỏ</span><span class=\"val\" data-for=\"hslRedLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslRedLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                  <div class=\"hsl-band-pane\" data-hsl-pane=\"Orange\">\n                    <div class=\"sub-badge\">Kênh Cam (Tông da)</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Cam</span><span class=\"val\" data-for=\"hslOrangeHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslOrangeHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Cam</span><span class=\"val\" data-for=\"hslOrangeSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslOrangeSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Cam</span><span class=\"val\" data-for=\"hslOrangeLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslOrangeLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                  <div class=\"hsl-band-pane\" data-hsl-pane=\"Yellow\">\n                    <div class=\"sub-badge\">Kênh Vàng</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Vàng</span><span class=\"val\" data-for=\"hslYellowHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslYellowHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Vàng</span><span class=\"val\" data-for=\"hslYellowSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslYellowSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Vàng</span><span class=\"val\" data-for=\"hslYellowLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslYellowLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                  <div class=\"hsl-band-pane\" data-hsl-pane=\"Green\">\n                    <div class=\"sub-badge\">Kênh Xanh lá</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Xanh lá</span><span class=\"val\" data-for=\"hslGreenHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslGreenHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Xanh lá</span><span class=\"val\" data-for=\"hslGreenSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslGreenSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Xanh lá</span><span class=\"val\" data-for=\"hslGreenLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslGreenLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                  <div class=\"hsl-band-pane\" data-hsl-pane=\"Aqua\">\n                    <div class=\"sub-badge\">Kênh Xanh ngọc</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Xanh ngọc</span><span class=\"val\" data-for=\"hslAquaHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslAquaHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Xanh ngọc</span><span class=\"val\" data-for=\"hslAquaSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslAquaSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Xanh ngọc</span><span class=\"val\" data-for=\"hslAquaLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslAquaLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                  <div class=\"hsl-band-pane\" data-hsl-pane=\"Blue\">\n                    <div class=\"sub-badge\">Kênh Xanh dương</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Xanh dương</span><span class=\"val\" data-for=\"hslBlueHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslBlueHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Xanh dương</span><span class=\"val\" data-for=\"hslBlueSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslBlueSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Xanh dương</span><span class=\"val\" data-for=\"hslBlueLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslBlueLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                  <div class=\"hsl-band-pane\" data-hsl-pane=\"Purple\">\n                    <div class=\"sub-badge\">Kênh Tím</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Tím</span><span class=\"val\" data-for=\"hslPurpleHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslPurpleHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Tím</span><span class=\"val\" data-for=\"hslPurpleSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslPurpleSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Tím</span><span class=\"val\" data-for=\"hslPurpleLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslPurpleLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                  <div class=\"hsl-band-pane\" data-hsl-pane=\"Magenta\">\n                    <div class=\"sub-badge\">Kênh Hồng cánh sen</div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc độ Hồng</span><span class=\"val\" data-for=\"hslMagentaHue\">0</span></div><input type=\"range\" class=\"retouch-slider hsl-grad-hue\" id=\"hslMagentaHue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ bão hòa Hồng</span><span class=\"val\" data-for=\"hslMagentaSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslMagentaSat\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ chói Hồng</span><span class=\"val\" data-for=\"hslMagentaLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"hslMagentaLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Phân loại màu sắc (Vùng tối / Sáng)</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Màu vùng tối (Shadow Hue)</span><span class=\"val\" data-for=\"gradeShadowHue\">210</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeShadowHue\" min=\"0\" max=\"360\" value=\"210\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cường độ màu vùng tối</span><span class=\"val\" data-for=\"gradeShadowSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeShadowSat\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Màu vùng sáng (Highlight Hue)</span><span class=\"val\" data-for=\"gradeHighHue\">38</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeHighHue\" min=\"0\" max=\"360\" value=\"38\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cường độ màu vùng sáng</span><span class=\"val\" data-for=\"gradeHighSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeHighSat\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Màu trung tính (Midtone Hue)</span><span class=\"val\" data-for=\"gradeMidHue\">120</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeMidHue\" min=\"0\" max=\"360\" value=\"120\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cường độ trung tính</span><span class=\"val\" data-for=\"gradeMidSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeMidSat\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Màu tổng thể (Global Hue)</span><span class=\"val\" data-for=\"gradeGlobalHue\">45</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeGlobalHue\" min=\"0\" max=\"360\" value=\"45\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cường độ tổng thể</span><span class=\"val\" data-for=\"gradeGlobalSat\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeGlobalSat\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ sáng vùng tối</span><span class=\"val\" data-for=\"gradeShadowLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeShadowLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ sáng trung tính</span><span class=\"val\" data-for=\"gradeMidLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeMidLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ sáng vùng sáng</span><span class=\"val\" data-for=\"gradeHighLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeHighLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ sáng tổng thể</span><span class=\"val\" data-for=\"gradeGlobalLum\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeGlobalLum\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Hòa trộn (Blending)</span><span class=\"val\" data-for=\"gradeBlending\">50</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeBlending\" min=\"0\" max=\"100\" value=\"50\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cân bằng Sáng/Tối</span><span class=\"val\" data-for=\"gradeBalance\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"gradeBalance\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Trộn kênh Đen &amp; Trắng</div>\n                <div class=\"retouch-acc-body\">\n                  <select id=\"treatment\" class=\"retouch-select\" style=\"margin-bottom: 6px\">\n                    <option value=\"color\">Ảnh Màu</option>\n                    <option value=\"bw\">Đen &amp; Trắng (B&amp;W)</option>\n                  </select>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Đỏ</span><span class=\"val\" data-for=\"bwRed\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwRed\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cam</span><span class=\"val\" data-for=\"bwOrange\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwOrange\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Vàng</span><span class=\"val\" data-for=\"bwYellow\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwYellow\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Xanh lá</span><span class=\"val\" data-for=\"bwGreen\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwGreen\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Xanh ngọc</span><span class=\"val\" data-for=\"bwAqua\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwAqua\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Xanh dương</span><span class=\"val\" data-for=\"bwBlue\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwBlue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tím</span><span class=\"val\" data-for=\"bwPurple\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwPurple\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Hồng cánh sen</span><span class=\"val\" data-for=\"bwMagenta\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bwMagenta\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Chi tiết — Làm nét &amp; Khử nhiễu AI</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử nhiễu AI (RAW &amp; JPG)</span><span class=\"val\" data-for=\"aiDenoise\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"aiDenoise\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Giữ chi tiết khi khử nhiễu</span><span class=\"val\" data-for=\"nrDetail\">50</span></div><input type=\"range\" class=\"retouch-slider\" id=\"nrDetail\" min=\"0\" max=\"100\" value=\"50\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử nhiễu độ sáng</span><span class=\"val\" data-for=\"noiseReduction\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"noiseReduction\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử nhiễu màu</span><span class=\"val\" data-for=\"nrColor\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"nrColor\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tăng nét (Sharpening)</span><span class=\"val\" data-for=\"sharpenAmount\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"sharpenAmount\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Bán kính làm nét</span><span class=\"val\" data-for=\"sharpenRadius\">1</span></div><input type=\"range\" class=\"retouch-slider\" id=\"sharpenRadius\" min=\"0.5\" max=\"3\" value=\"1\" step=\"0.1\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Chi tiết vùng nét</span><span class=\"val\" data-for=\"sharpenDetail\">25</span></div><input type=\"range\" class=\"retouch-slider\" id=\"sharpenDetail\" min=\"0\" max=\"100\" value=\"25\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Mặt nạ vùng nét (Masking)</span><span class=\"val\" data-for=\"sharpenMasking\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"sharpenMasking\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Nhiễu hạt &amp; Tối góc (Hiệu ứng)</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Hạt phim (Film Grain)</span><span class=\"val\" data-for=\"filmGrain\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"filmGrain\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Kích thước hạt</span><span class=\"val\" data-for=\"grainSize\">25</span></div><input type=\"range\" class=\"retouch-slider\" id=\"grainSize\" min=\"0\" max=\"100\" value=\"25\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ thô hạt</span><span class=\"val\" data-for=\"grainRoughness\">50</span></div><input type=\"range\" class=\"retouch-slider\" id=\"grainRoughness\" min=\"0\" max=\"100\" value=\"50\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tối góc (Vignette)</span><span class=\"val\" data-for=\"vignette\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"vignette\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Điểm giữa tối góc</span><span class=\"val\" data-for=\"vignetteMidpoint\">50</span></div><input type=\"range\" class=\"retouch-slider\" id=\"vignetteMidpoint\" min=\"0\" max=\"100\" value=\"50\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ tròn tối góc</span><span class=\"val\" data-for=\"vignetteRoundness\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"vignetteRoundness\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm mềm viền tối góc</span><span class=\"val\" data-for=\"vignetteFeather\">50</span></div><input type=\"range\" class=\"retouch-slider\" id=\"vignetteFeather\" min=\"0\" max=\"100\" value=\"50\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Giữ vùng sáng ở góc</span><span class=\"val\" data-for=\"vignetteHighlights\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"vignetteHighlights\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Hiệu chỉnh ống kính</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Hiệu chỉnh méo hình</span><span class=\"val\" data-for=\"opticsDistortion\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"opticsDistortion\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử tối góc ống kính</span><span class=\"val\" data-for=\"opticsVignetting\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"opticsVignetting\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Điểm giữa ống kính</span><span class=\"val\" data-for=\"opticsVignettingMidpoint\">50</span></div><input type=\"range\" class=\"retouch-slider\" id=\"opticsVignettingMidpoint\" min=\"0\" max=\"100\" value=\"50\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc sai — Đỏ/Lục lam</span><span class=\"val\" data-for=\"opticsCaRed\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"opticsCaRed\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Sắc sai — Xanh/Vàng</span><span class=\"val\" data-for=\"opticsCaBlue\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"opticsCaBlue\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử viền tím</span><span class=\"val\" data-for=\"opticsDefringePurple\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"opticsDefringePurple\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử viền xanh lá</span><span class=\"val\" data-for=\"opticsDefringeGreen\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"opticsDefringeGreen\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n            </div>\n\n            <!-- MODULE 2: CHỈNH SỬA CHÂN DUNG (MẶC ĐỊNH MỞ KHI KHỞI ĐỘNG) -->\n            <div id=\"mod-portrait\" class=\"retouch-module-pane active\">\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Khử khuyết điểm</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tàn nhang &amp; Mụn trứng cá</span><span class=\"val\" data-for=\"freckleAcne\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"freckleAcne\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Nốt ruồi trên mặt</span><span class=\"val\" data-for=\"faceMole\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"faceMole\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Giảm bóng dầu vùng chữ T</span><span class=\"val\" data-for=\"faceShine\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"faceShine\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Quầng thâm dưới mắt</span><span class=\"val\" data-for=\"darkCircles\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"darkCircles\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Bọng mắt &amp; Nếp mí dưới</span><span class=\"val\" data-for=\"eyeBags\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"eyeBags\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Nếp nhăn trán</span><span class=\"val\" data-for=\"foreheadWrinkles\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"foreheadWrinkles\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Rãnh cười (Khóe mũi miệng)</span><span class=\"val\" data-for=\"nasolabialFolds\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"nasolabialFolds\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Nếp nhăn vùng cổ</span><span class=\"val\" data-for=\"neckWrinkles\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"neckWrinkles\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử lóa mắt kính</span><span class=\"val\" data-for=\"glassesGlare\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"glassesGlare\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Giảm nọng cằm</span><span class=\"val\" data-for=\"doubleChin\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"doubleChin\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khuyết điểm da cơ thể</span><span class=\"val\" data-for=\"bodyBlemish\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bodyBlemish\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Làm mịn da &amp; Điều chỉnh tông da</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"sub-badge\">Làm đều sáng tối (Dodge &amp; Burn)</div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm đều bề mặt da (Even)</span><span class=\"val\" data-for=\"dodgeBurnEven\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"dodgeBurnEven\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tạo khối sáng tối 3D (Sculpt)</span><span class=\"val\" data-for=\"dodgeBurnSculpt\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"dodgeBurnSculpt\" min=\"0\" max=\"100\" value=\"0\" /></div>\n\n                  <div class=\"sub-badge\">Tách tần số da (Frequency Separation)</div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm mịn tần số thấp (Màu da)</span><span class=\"val\" data-for=\"freqSepLow\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"freqSepLow\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Giữ hạt lỗ chân lông (High Freq)</span><span class=\"val\" data-for=\"freqSepHigh\">80</span></div><input type=\"range\" class=\"retouch-slider\" id=\"freqSepHigh\" min=\"0\" max=\"100\" value=\"80\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm mịn da mặt</span><span class=\"val\" data-for=\"facialSkinSmooth\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"facialSkinSmooth\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm mịn da cơ thể</span><span class=\"val\" data-for=\"bodySkinSmooth\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bodySkinSmooth\" min=\"0\" max=\"100\" value=\"0\" /></div>\n\n                  <div class=\"sub-badge\">Sắc tố &amp; Độ rạng rỡ</div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm đều tông màu da</span><span class=\"val\" data-for=\"unifyComplexion\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"unifyComplexion\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm sáng rạng rỡ da</span><span class=\"val\" data-for=\"skinRadiance\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"skinRadiance\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Màu da hồng hào</span><span class=\"val\" data-for=\"skinRosy\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"skinRosy\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ ấm màu da</span><span class=\"val\" data-for=\"skinWarmth\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"skinWarmth\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Định hình khuôn mặt (3D Liquify)</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ rộng khuôn mặt</span><span class=\"val\" data-for=\"faceWidth\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"faceWidth\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Thon gọn xương hàm (V-Line)</span><span class=\"val\" data-for=\"jawlineSlim\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"jawlineSlim\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Thu nâng gò má</span><span class=\"val\" data-for=\"cheekboneLift\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"cheekboneLift\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ dài cằm</span><span class=\"val\" data-for=\"chinLength\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"chinLength\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ cao trán</span><span class=\"val\" data-for=\"foreheadHeight\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"foreheadHeight\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Thu gọn cánh mũi</span><span class=\"val\" data-for=\"noseWidth\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"noseWidth\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Nâng đầu mũi</span><span class=\"val\" data-for=\"noseTipLift\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"noseTipLift\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Kích thước miệng</span><span class=\"val\" data-for=\"mouthSize\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"mouthSize\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ đầy đặn môi</span><span class=\"val\" data-for=\"lipPlump\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"lipPlump\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Nâng khóe miệng cười</span><span class=\"val\" data-for=\"smileEnhance\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"smileEnhance\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Mắt &amp; Lông mày</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Kích thước mắt</span><span class=\"val\" data-for=\"eyeSize\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"eyeSize\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm sáng tròng mắt</span><span class=\"val\" data-for=\"eyeBrighten\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"eyeBrighten\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tăng ánh sáng mắt (Catchlight)</span><span class=\"val\" data-for=\"catchlightBoost\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"catchlightBoost\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Xóa tia máu đỏ mắt</span><span class=\"val\" data-for=\"redVeins\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"redVeins\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ dày lông mày</span><span class=\"val\" data-for=\"eyebrowThickness\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"eyebrowThickness\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Nâng dáng lông mày</span><span class=\"val\" data-for=\"eyebrowLift\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"eyebrowLift\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Làm đẹp răng</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm trắng răng</span><span class=\"val\" data-for=\"teethWhiten\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"teethWhiten\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử ố vàng răng</span><span class=\"val\" data-for=\"teethDesaturate\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"teethDesaturate\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ sáng răng</span><span class=\"val\" data-for=\"teethBrighten\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"teethBrighten\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Trang điểm</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Bắt sáng (Highlight)</span><span class=\"val\" data-for=\"makeupHighlight\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"makeupHighlight\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tạo khối (Contour)</span><span class=\"val\" data-for=\"makeupContour\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"makeupContour\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Má hồng</span><span class=\"val\" data-for=\"makeupBlush\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"makeupBlush\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Phấn mắt</span><span class=\"val\" data-for=\"makeupEyeshadow\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"makeupEyeshadow\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cường độ son môi</span><span class=\"val\" data-for=\"makeupLipstick\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"makeupLipstick\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Màu son môi</span></div>\n                    <select id=\"makeupLipTint\" class=\"retouch-select\">\n                      <option value=\"rose\">Hồng Nhung (Velvet Rose)</option>\n                      <option value=\"coral\">Cam San Hô Ấm</option>\n                      <option value=\"berry\">Đỏ Mận (Deep Berry)</option>\n                      <option value=\"nude\">Nude Tự Nhiên</option>\n                      <option value=\"ruby\">Đỏ Ruby Cổ Điển</option>\n                    </select>\n                  </div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title cloth-acc-header\">\n                  <span>▾ Điều chỉnh tóc</span>\n                  <button type=\"button\" id=\"btn-hair-reset\" class=\"cloth-reset-btn\" title=\"Đặt lại toàn bộ điều chỉnh tóc\">\n                    <svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">\n                      <path d=\"M3 12a9 9 0 1 0 3-6.7L3 8\" />\n                      <path d=\"M3 3v5h5\" />\n                    </svg>\n                  </button>\n                </div>\n                <div class=\"retouch-acc-body\">\n                  <!-- Subgroup 1: Chỉnh sửa hình dáng tóc -->\n                  <div class=\"hair-subhead\">Chỉnh sửa hình dáng tóc</div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Làm đầy điểm hói</span><span class=\"val\" data-for=\"hairPartLine\">0</span></div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"hairPartLine\" min=\"0\" max=\"100\" value=\"0\" />\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span class=\"cloth-label-with-badges\">\n                        Độ Dày Tóc Đỉnh Đầu\n                        <span class=\"cloth-help-dot\" title=\"Tăng/giảm độ phồng đỉnh đầu (hộp sọ cao)\">?</span>\n                      </span>\n                      <span class=\"val\" data-for=\"hairVolume\">0</span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider hair-centered\" id=\"hairVolume\" min=\"-100\" max=\"100\" value=\"0\" />\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Tăng lượng tóc hai bên</span></div>\n                    <div class=\"hair-dual-row\">\n                      <div class=\"hair-dual-col\">\n                        <div class=\"s-head\"><span>Trái</span><span class=\"val\" data-for=\"hairSideLeftVolume\">0</span></div>\n                        <input type=\"range\" class=\"retouch-slider hair-centered\" id=\"hairSideLeftVolume\" min=\"-100\" max=\"100\" value=\"0\" />\n                      </div>\n                      <button type=\"button\" id=\"btn-hair-side-link\" class=\"cloth-link-btn hair-side-link active\" aria-pressed=\"true\" title=\"Liên kết lượng tóc Trái &amp; Phải\">\n                        <svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">\n                          <path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\" />\n                          <path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\" />\n                        </svg>\n                      </button>\n                      <div class=\"hair-dual-col\">\n                        <div class=\"s-head\"><span>Phải</span><span class=\"val\" data-for=\"hairSideRightVolume\">0</span></div>\n                        <input type=\"range\" class=\"retouch-slider hair-centered\" id=\"hairSideRightVolume\" min=\"-100\" max=\"100\" value=\"0\" />\n                      </div>\n                    </div>\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Đường chân tóc</span><span class=\"val\" data-for=\"hairlineAdjust\">0</span></div>\n                    <input type=\"range\" class=\"retouch-slider hair-centered\" id=\"hairlineAdjust\" min=\"-100\" max=\"100\" value=\"0\" />\n                  </div>\n\n                  <div class=\"bg-divider\" style=\"margin: 10px 0;\"></div>\n\n                  <!-- Subgroup 2: Hoàn thiện tóc -->\n                  <div class=\"hair-subhead\">Hoàn thiện tóc</div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span>Loại bỏ tóc gãy</span>\n                      <span class=\"cloth-val-with-arrow\">\n                        <span class=\"val\" data-for=\"strayHair\">0</span>\n                        <button type=\"button\" id=\"btn-hair-stray-expand\" class=\"cloth-sub-arrow\" aria-expanded=\"false\" title=\"Mở tùy chọn vùng xóa tóc con\">▸</button>\n                      </span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"strayHair\" min=\"0\" max=\"100\" value=\"0\" />\n                    <div id=\"hair-stray-drawer\" class=\"cloth-sub-drawer hidden\">\n                      <div class=\"s-head\" style=\"margin-top: 6px;\"><span>Trong đường viền nhân vật</span><span class=\"val\" data-for=\"strayHairInner\">100</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"strayHairInner\" min=\"0\" max=\"100\" value=\"100\" />\n                      <div class=\"s-head\" style=\"margin-top: 6px;\"><span>Ngoài đường viền nhân vật</span><span class=\"val\" data-for=\"strayHairOuter\">100</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"strayHairOuter\" min=\"0\" max=\"100\" value=\"100\" />\n                    </div>\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span>Làm mượt tóc</span>\n                      <span class=\"cloth-val-with-arrow\">\n                        <span class=\"val\" data-for=\"hairSmooth\">0</span>\n                        <button type=\"button\" id=\"btn-hair-smooth-expand\" class=\"cloth-sub-arrow\" aria-expanded=\"false\" title=\"Mở tinh chỉnh giảm xơ rối\">▸</button>\n                      </span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"hairSmooth\" min=\"0\" max=\"100\" value=\"0\" />\n                    <div id=\"hair-smooth-drawer\" class=\"cloth-sub-drawer hidden\">\n                      <div class=\"s-head\" style=\"margin-top: 6px;\"><span>Giảm xơ rối</span><span class=\"val\" data-for=\"hairFrizzy\">100</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"hairFrizzy\" min=\"0\" max=\"100\" value=\"100\" />\n                    </div>\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Tăng độ bóng cho tóc</span><span class=\"val\" data-for=\"hairShine\">0</span></div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"hairShine\" min=\"0\" max=\"100\" value=\"0\" />\n                  </div>\n\n                  <div class=\"bg-divider\" style=\"margin: 10px 0;\"></div>\n\n                  <!-- Subgroup 3: Chỉnh sửa màu tóc -->\n                  <div class=\"hair-subhead\">Chỉnh sửa màu tóc</div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span class=\"cloth-label-with-badges\">\n                        Tóc Đen Tóc Bạc\n                        <span class=\"evoto-beta-badge\">Beta</span>\n                      </span>\n                      <span class=\"val\" data-for=\"whiteHairBlacken\">0</span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"whiteHairBlacken\" min=\"0\" max=\"100\" value=\"0\" />\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span class=\"cloth-label-with-badges\">\n                        Thống Nhất Màu Tóc\n                        <span class=\"evoto-beta-badge\">Beta</span>\n                      </span>\n                      <span class=\"val\" data-for=\"hairColorUnify\">0</span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider hair-centered\" id=\"hairColorUnify\" min=\"-100\" max=\"100\" value=\"0\" />\n                  </div>\n\n                  <div class=\"hair-color-section\">\n                    <div class=\"hair-subhead\" style=\"margin-bottom: 8px;\">Màu Tóc</div>\n                    <div class=\"hair-color-grid\" id=\"hair-color-grid\">\n                      <button type=\"button\" class=\"hair-color-card active\" data-haircolor=\"none\" title=\"Giữ màu tóc gốc\">\n                        <span class=\"hair-swatch-preview hair-swatch-none\">⊘</span>\n                        <span class=\"hair-swatch-code\">Trống</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h01\" data-deg=\"60\" title=\"H01 - Nâu Trà Lạnh\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #988374 0%, #7C695B 55%, #4f4137 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #7C695B\">H01</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h02\" data-deg=\"60\" title=\"H02 - Nâu Trà Sữa\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #a6745d 0%, #895C49 55%, #5b3b2e 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #895C49\">H02</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h03\" data-deg=\"60\" title=\"H03 - Nâu Cam Tây\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #dd9269 0%, #C67951 55%, #8a4b2b 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #C67951\">H03</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h04\" data-deg=\"60\" title=\"H04 - Đỏ Nâu Ánh Sáng\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #b86c71 0%, #9C5459 55%, #663034 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #9C5459\">H04</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h05\" data-deg=\"50\" title=\"H05 - Đỏ Rượu\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #ca736f 0%, #AD5956 55%, #753431 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #AD5956\">H05</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h06\" data-deg=\"50\" title=\"H06 - Nâu Hồng Phấn\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #b58d88 0%, #98726E 55%, #654744 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #98726E\">H06</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h07\" data-deg=\"70\" title=\"H07 - Hồng Tử Đằng\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #e5b0ad 0%, #CE9390 55%, #996260 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #CE9390\">H07</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h08\" data-deg=\"50\" title=\"H08 - Đen Tự Nhiên\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #776359 0%, #5D4B43 55%, #2f241f 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #5D4B43\">H08</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h09\" data-deg=\"60\" title=\"H09 - Đen Ánh Xanh\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #7e849d 0%, #646980 55%, #373b4c 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #646980\">H09</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h10\" data-deg=\"60\" title=\"H10 - Tím Nho\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #b87387 0%, #9B586C 55%, #653141 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #9B586C\">H10</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h11\" data-deg=\"60\" title=\"H11 - Tím Khói Xanh\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #98889e 0%, #7C6D82 55%, #4d4252 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #7C6D82\">H11</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h12\" data-deg=\"60\" title=\"H12 - Nâu Rêu Lanh\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #8d8b79 0%, #716F60 55%, #47463a 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #716F60\">H12</span>\n                      </button>\n                      <button type=\"button\" class=\"hair-color-card\" data-haircolor=\"h13\" data-deg=\"60\" title=\"H13 - Xám Rêu Khói\">\n                        <span class=\"hair-swatch-preview\" style=\"background: linear-gradient(155deg, #919c7a 0%, #758060 55%, #4a523a 100%)\"></span>\n                        <span class=\"hair-swatch-code\" style=\"background: #758060\">H13</span>\n                      </button>\n                    </div>\n                    <div id=\"hair-dye-controls\" class=\"hair-dye-controls\" style=\"margin-top: 10px;\">\n                      <div class=\"retouch-slider-item\">\n                        <div class=\"s-head\"><span>Mức độ màu nhuộm</span><span class=\"val\" data-for=\"hairDyeStrength\">0</span></div>\n                        <input type=\"range\" class=\"retouch-slider\" id=\"hairDyeStrength\" min=\"0\" max=\"100\" value=\"0\" />\n                      </div>\n                      <div class=\"retouch-slider-item\" style=\"margin-bottom: 0;\">\n                        <div class=\"s-head\"><span>Làm tối tóc</span><span class=\"val\" data-for=\"hairDyeDarken\">0</span></div>\n                        <input type=\"range\" class=\"retouch-slider\" id=\"hairDyeDarken\" min=\"0\" max=\"100\" value=\"0\" />\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Định hình cơ thể</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Thon gọn vùng cổ</span><span class=\"val\" data-for=\"neckSlim\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"neckSlim\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Chỉnh dáng vai</span><span class=\"val\" data-for=\"shoulderSculpt\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"shoulderSculpt\" min=\"-50\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Thu gọn eo</span><span class=\"val\" data-for=\"waistSlim\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"waistSlim\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n            </div>\n\n            <!-- MODULE 3: ĐIỀU CHỈNH PHÔNG NỀN, BẦU TRỜI & TRANG PHỤC (Evoto Style) -->\n            <div id=\"mod-bg\" class=\"retouch-module-pane\">\n              <!-- SECTION 1: Điều chỉnh phông nền (Tối ưu hoá phông nền trơn + Tinh chỉnh) -->\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Điều chỉnh phông nền</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"bg-subhead\">Tối ưu hoá phông nền trơn</div>\n                  <div class=\"crop-toggle-row\">\n                    <span class=\"crop-toggle-label\">Loại bỏ chi tiết gây nhiễu</span>\n                    <button type=\"button\" id=\"bgCleanDistractions\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\"><span class=\"evoto-switch-knob\"></span></button>\n                  </div>\n                  <div class=\"crop-toggle-row\">\n                    <span class=\"crop-toggle-label\">Loại bỏ nhược điểm phông nền</span>\n                    <button type=\"button\" id=\"bgCleanDefects\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\"><span class=\"evoto-switch-knob\"></span></button>\n                  </div>\n                  <div class=\"crop-toggle-row\">\n                    <span class=\"crop-toggle-label\">Độ sáng đồng đều</span>\n                    <button type=\"button\" id=\"bgEvenBrightness\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\"><span class=\"evoto-switch-knob\"></span></button>\n                  </div>\n                  <div class=\"crop-toggle-row\">\n                    <span class=\"crop-toggle-label\">Loại bỏ dải màu</span>\n                    <button type=\"button\" id=\"bgRemoveBanding\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\"><span class=\"evoto-switch-knob\"></span></button>\n                  </div>\n\n                  <div class=\"bg-divider\"></div>\n                  <div class=\"bg-subhead\">Tinh chỉnh phông nền</div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Cải tiến phông nền</span><span class=\"val\" data-for=\"backdropClean\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"backdropClean\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Khử sọc chuyển sắc (Banding)</span><span class=\"val\" data-for=\"backdropBandingFix\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"backdropBandingFix\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm mờ hậu cảnh (Bokeh)</span><span class=\"val\" data-for=\"bgBlurBokeh\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgBlurBokeh\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n\n              <!-- SECTION 2: Thay đổi phông nền (Evoto Studio Replacement) -->\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ Thay đổi phông nền</div>\n                <div class=\"retouch-acc-body\">\n                  <!-- LIYING AI ENGINE CARD -->\n                  <div class=\"liying-bg-card\" id=\"liying-bg-card\">\n                    <div class=\"liying-card-header\">\n                      <div class=\"liying-badge-title\">\n                        <span class=\"liying-sparkle\" aria-hidden=\"true\">\n                          <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"currentColor\">\n                            <path d=\"M12 2l2.1 6.2L20.3 10l-6.2 2.1L12 18.3l-2.1-6.2L3.7 10l6.2-1.8L12 2zm7 12l1.1 3.1L23.2 18l-3.1 1.1L19 22.2l-1.1-3.1L14.8 18l3.1-.9L19 14z\"/>\n                          </svg>\n                        </span>\n                        <div class=\"liying-title-stack\">\n                          <strong>DEVSTU PRO AI</strong>\n                          <span class=\"liying-subtitle\">Model 29 U-Net Matting + BGFusion</span>\n                        </div>\n                      </div>\n                      <span class=\"liying-tag\">104MB • Local</span>\n                    </div>\n\n                    <label class=\"liying-checkbox-label\" title=\"Tự động nhận diện hai vai bằng YOLOv8 Pose, xoay cân bằng tư thế và căn giữa mặt\">\n                      <span class=\"liying-option-text\">Tự cân bằng vai khi tách nền</span>\n                      <input type=\"checkbox\" id=\"liying-straighten-cb\" />\n                    </label>\n\n                    <div class=\"liying-preset-grid\">\n                      <button type=\"button\" class=\"liying-color-chip active\" data-color=\"sifalan\" title=\"Xanh tư pháp LK (#2b6cb0)\">\n                        <span class=\"chip-dot\" style=\"background:#2b6cb0\"></span>\n                        <span>Xanh tư pháp</span>\n                      </button>\n                      <button type=\"button\" class=\"liying-color-chip\" data-color=\"baise\" title=\"Trắng chuẩn (#FFFFFF)\">\n                        <span class=\"chip-dot chip-dot-light\" style=\"background:#ffffff\"></span>\n                        <span>Trắng</span>\n                      </button>\n                      <button type=\"button\" class=\"liying-color-chip\" data-color=\"dengjihong\" title=\"Đăng ký đỏ / Ảnh thẻ kết hôn (#d92429)\">\n                        <span class=\"chip-dot\" style=\"background:#d92429\"></span>\n                        <span>Đăng ký đỏ</span>\n                      </button>\n                      <button type=\"button\" class=\"liying-color-chip\" data-color=\"lanbaijianbian\" title=\"Xanh trắng chuyển sắc (Gradient Blue)\">\n                        <span class=\"chip-dot\" style=\"background:linear-gradient(180deg,#70a6ff,#ffffff)\"></span>\n                        <span>Xanh gradient</span>\n                      </button>\n                      <button type=\"button\" class=\"liying-color-chip\" data-color=\"transparent\" title=\"Trong suốt (PNG Alpha / Cutout)\">\n                        <span class=\"chip-dot chip-transparent\"></span>\n                        <span>Trong suốt</span>\n                      </button>\n                      <button type=\"button\" class=\"liying-color-chip\" data-color=\"jingdianlan\" title=\"Xanh cổ điển (#1e3a8a)\">\n                        <span class=\"chip-dot\" style=\"background:#1e3a8a\"></span>\n                        <span>Xanh cổ điển</span>\n                      </button>\n                      <button type=\"button\" class=\"liying-color-chip\" data-color=\"zhenghong\" title=\"Đỏ tươi (#e11d48)\">\n                        <span class=\"chip-dot\" style=\"background:#e11d48\"></span>\n                        <span>Đỏ tươi</span>\n                      </button>\n                      <button type=\"button\" class=\"liying-color-chip\" data-color=\"heise\" title=\"Đen tuyền (#111827)\">\n                        <span class=\"chip-dot\" style=\"background:#111827\"></span>\n                        <span>Đen</span>\n                      </button>\n                    </div>\n\n                    <div class=\"liying-actions-row\">\n                      <button type=\"button\" id=\"btn-liying-apply\" class=\"btn-liying-primary\" title=\"Tách nền bằng Model 29 U-Net và ghép nền BGFusion (LK Magic Pro)\">\n                        <svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"><path d=\"m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z\"/></svg>\n                        <span>Tách &amp; Thay nền</span>\n                      </button>\n                      <button type=\"button\" id=\"btn-liying-level-only\" class=\"btn-liying-secondary\" title=\"Chỉ cân bằng vai & canh giữa mặt (giữ nguyên nền)\">\n                        <svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 12h18\"/><path d=\"M8 7l-3 5 3 5\"/><path d=\"M16 7l3 5-3 5\"/></svg>\n                        <span>Cân vai</span>\n                      </button>\n                      <button type=\"button\" id=\"btn-liying-cancel\" class=\"btn-liying-secondary btn-liying-cancel\" title=\"Hủy hoặc khôi phục lại phông nền ban đầu\">\n                        <svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\"><path d=\"M18 6L6 18\"/><path d=\"M6 6l12 12\"/></svg>\n                        <span>Hủy</span>\n                      </button>\n                    </div>\n                  </div>\n\n                  <!-- Hình ảnh / Màu đơn sắc Segmented Tabs -->\n                  <div class=\"bg-type-tabs\">\n                    <button type=\"button\" class=\"bg-type-tab active\" id=\"bg-cat-image\">Hình ảnh</button>\n                    <button type=\"button\" class=\"bg-type-tab\" id=\"bg-cat-solid\">Màu đơn sắc</button>\n                  </div>\n\n                  <!-- Đề xuất / Nền của bạn Underline Tabs + Reset Original -->\n                  <div class=\"bg-lib-tabs-row\">\n                    <div class=\"bg-lib-tabs\">\n                      <button type=\"button\" class=\"bg-lib-tab active\" id=\"bg-lib-tab-rec\">Đề xuất</button>\n                      <button type=\"button\" class=\"bg-lib-tab\" id=\"bg-lib-tab-user\">Nền của bạn</button>\n                    </div>\n                    <button type=\"button\" id=\"btn-bg-reset-original\" class=\"bg-orig-reset-btn\" title=\"Khôi phục phông nền gốc\">Nền gốc</button>\n                  </div>\n\n                  <!-- Synced Dropdown (Ẩn nhẹ trong UI nhưng tương thích hoàn toàn preset & phím tắt) -->\n                  <select id=\"bgReplaceMode\" class=\"retouch-select bg-compact-select\" aria-label=\"Chế độ phông nền\">\n                    <option value=\"original\">Giữ nguyên phông nền gốc</option>\n                    <option value=\"transparent\">Nền Trong suốt (PNG Alpha)</option>\n                    <option value=\"pure_white\">Trắng (Studio Photo / Ảnh thẻ)</option>\n                    <option value=\"studio_grey\">Xám 02 (Studio trung tính)</option>\n                    <option value=\"moody_black\">Đen (Low-Key Studio)</option>\n                    <option value=\"fabric_02\">Vải 02 (Phông vải vân mây)</option>\n                    <option value=\"warm_beige\">Nâu 03 (Be / Nâu tạp chí)</option>\n                    <option value=\"slate_grey_03\">Xám 03 (Xám khói Studio)</option>\n                    <option value=\"passport_blue\">Xanh thẻ (Xanh dương Studio)</option>\n                    <option value=\"pastel_pink\">Hồng phấn (Pastel Studio)</option>\n                    <option value=\"sage_green\">Xanh bơ (Mint Pastel)</option>\n                    <option value=\"lavender_mist\">Tím nhạt (Lavender Studio)</option>\n                    <option value=\"sky_golden_sunset\">Bầu trời: Hoàng hôn vàng</option>\n                    <option value=\"sky_alpine_blue\">Bầu trời: Xanh mây núi</option>\n                    <option value=\"sky_dramatic_clouds\">Bầu trời: Mây kịch tính</option>\n                    <option value=\"sky_night_stars\">Bầu trời: Đêm đầy sao</option>\n                    <option value=\"custom_color\">Màu đơn sắc tùy chỉnh</option>\n                    <option value=\"custom_image\">Ảnh phông nền của bạn</option>\n                  </select>\n\n                  <!-- TAB ĐỀ XUẤT -->\n                  <div id=\"bg-lib-rec-panel\">\n                    <div class=\"bg-filter-pills\">\n                      <button type=\"button\" class=\"bg-pill active\" id=\"bg-filter-explore\">Khám phá ngay</button>\n                      <button type=\"button\" class=\"bg-pill\" id=\"bg-filter-selected\">Mục đã chọn</button>\n                    </div>\n\n                    <div class=\"asset-hub-grid bg-evoto-grid\" id=\"bg-asset-hub-grid\">\n                      <button type=\"button\" class=\"asset-swatch bg-swatch-transparent\" data-bgmode=\"transparent\"><span>Trong suốt</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"pure_white\" style=\"background: #f8fafc; color: #09090b\"><span>Trắng</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"passport_blue\" style=\"background: #2b6cb0\"><span>Xanh tư pháp</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"dengjihong\" style=\"background: #d92429\"><span>Đăng ký đỏ</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"lanbaijianbian\" style=\"background: linear-gradient(180deg, #70a6ff, #ffffff); color: #09090b\"><span>Xanh gradient</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"studio_grey\" style=\"background: radial-gradient(circle at 50% 35%, #b5b9c0, #6f737a)\"><span>Xám 02</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"moody_black\" style=\"background: radial-gradient(circle at 50% 35%, #2b2e36, #0a0b0d)\"><span>Đen</span></button>\n                      <button type=\"button\" class=\"asset-swatch bg-swatch-more\" id=\"btn-bg-more\"><span>Thêm</span></button>\n                    </div>\n\n                    <div class=\"asset-hub-grid bg-evoto-grid hidden\" id=\"bg-more-swatches\" style=\"margin-top: 6px;\">\n                      <button type=\"button\" class=\"asset-swatch active\" data-bgmode=\"original\" style=\"background: linear-gradient(135deg, #18181c, #2d2d35)\"><span>Nền gốc</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"passport_blue\" style=\"background: #2563eb\"><span>Xanh thẻ</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"pastel_pink\" style=\"background: #f3cbd3; color: #18181b\"><span>Hồng phấn</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"sage_green\" style=\"background: #9bb7a5; color: #18181b\"><span>Xanh bơ</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"lavender_mist\" style=\"background: #cdc4ea; color: #18181b\"><span>Tím nhạt</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"custom_color\" id=\"swatch-custom-color\" style=\"background: #e8eef5; color: #09090b\"><span>Màu riêng</span></button>\n                      <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"custom_image\" style=\"background: linear-gradient(135deg, #27272f, #3f3f4a)\"><span>Ảnh riêng</span></button>\n                    </div>\n                  </div>\n\n                  <!-- TAB NỀN CỦA BẠN (Hình ảnh upload & Màu đơn sắc) -->\n                  <div id=\"bg-lib-user-panel\" class=\"hidden\">\n                    <div id=\"bg-user-image-pane\">\n                      <div class=\"bg-filter-pills\">\n                        <button type=\"button\" class=\"bg-pill active\" id=\"bg-user-filter-personal\">Cá nhân</button>\n                        <button type=\"button\" class=\"bg-pill\" id=\"bg-user-filter-fav\">Yêu thích của tôi</button>\n                      </div>\n                      <button type=\"button\" id=\"btn-upload-custom-bg\" class=\"bg-upload-dropzone\">\n                        <span class=\"bg-upload-plus\">+</span>\n                        <span class=\"bg-upload-hint\">Chọn ảnh nền từ máy (JPEG, PNG, WEBP)</span>\n                      </button>\n                      <input type=\"file\" id=\"bg-custom-file-input\" accept=\"image/*\" multiple hidden />\n                      <div id=\"bg-user-gallery\" class=\"bg-user-gallery hidden\"></div>\n                      <div id=\"custom-bg-preview\" class=\"custom-bg-preview hidden\" style=\"margin-top: 6px;\">\n                        <img id=\"custom-bg-preview-img\" alt=\"Xem trước ảnh nền\" />\n                        <button type=\"button\" id=\"btn-clear-custom-bg\" class=\"custom-bg-clear-btn hidden\" title=\"Xóa ảnh nền đang chọn\">✕</button>\n                      </div>\n                    </div>\n\n                    <div id=\"bg-user-solid-pane\" class=\"hidden\">\n                      <div class=\"bg-solid-picker-banner\">\n                        <label class=\"bg-rainbow-chip\" title=\"Chọn màu tùy chỉnh\">\n                          <input type=\"color\" id=\"bgCustomColor\" value=\"#e8eef5\" />\n                        </label>\n                        <div class=\"bg-solid-text\">\n                          <div>Hãy thêm màu tùy chỉnh từ bảng chọn màu.</div>\n                          <span id=\"bg-custom-color-hex\" class=\"bg-color-hex\">#e8eef5</span>\n                        </div>\n                      </div>\n                      <div class=\"bg-solid-presets\">\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#ffffff\" style=\"background: #ffffff\" title=\"Trắng\"></button>\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#e8eef5\" style=\"background: #e8eef5\" title=\"Xanh xám nhạt\"></button>\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#cbd5e1\" style=\"background: #cbd5e1\" title=\"Xám sáng\"></button>\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#94a3b8\" style=\"background: #94a3b8\" title=\"Xám studio\"></button>\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#2563eb\" style=\"background: #2563eb\" title=\"Xanh thẻ\"></button>\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#b91c1c\" style=\"background: #b91c1c\" title=\"Đỏ đô\"></button>\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#e7d8c5\" style=\"background: #e7d8c5\" title=\"Kem ấm\"></button>\n                        <button type=\"button\" class=\"bg-color-dot\" data-color=\"#18181b\" style=\"background: #18181b\" title=\"Đen than\"></button>\n                      </div>\n                    </div>\n                  </div>\n\n                  <!-- KHÓA ĐIỀU KHIỂN KHI CHƯA THAY NỀN + BỘ TINH CHỈNH CHI TIẾT EVOTO -->\n                  <div id=\"bg-replace-advanced-wrap\" class=\"bg-advanced-wrap is-locked\">\n                    <div id=\"bg-lock-banner\" class=\"bg-lock-banner\">Thay đổi nền để mở khoá các điều khiển này.</div>\n                    <div id=\"bg-replace-controls-body\" class=\"bg-controls-body\">\n                      <div class=\"bg-field-group\">\n                        <label class=\"bg-field-label\">Chế độ viền <span class=\"evoto-new-badge\">New</span></label>\n                        <select id=\"bgEdgeMode\" class=\"retouch-select bg-evoto-select\">\n                          <option value=\"auto\">Tự động</option>\n                          <option value=\"soft\">Mềm (Tóc bay)</option>\n                          <option value=\"crisp\">Sắc nét</option>\n                          <option value=\"hair_detail\">Tóc chi tiết</option>\n                        </select>\n                      </div>\n\n                      <div class=\"bg-field-group\">\n                        <label class=\"bg-field-label\">Phạm vi lưu giữ</label>\n                        <select id=\"bgKeepScope\" class=\"retouch-select bg-evoto-select\">\n                          <option value=\"subject_and_related\">Chủ thể và các đối tượng liên quan</option>\n                          <option value=\"subject_only\">Chỉ chủ thể chính</option>\n                          <option value=\"portrait_focus\">Chân dung (Đầu &amp; vai)</option>\n                        </select>\n                      </div>\n\n                      <div class=\"bg-field-group\">\n                        <label class=\"bg-field-label\">Vùng lấp đầy</label>\n                        <select id=\"bgFillArea\" class=\"retouch-select bg-evoto-select\">\n                          <option value=\"full_image\">Ảnh gốc</option>\n                          <option value=\"outer_only\">Chỉ vùng nền trống</option>\n                        </select>\n                      </div>\n\n                      <div class=\"bg-field-group\">\n                        <label class=\"bg-field-label\">Chế độ lấp đầy</label>\n                        <select id=\"bgFillMode\" class=\"retouch-select bg-evoto-select\">\n                          <option value=\"cover\">Phủ kín (Giữ tỉ lệ)</option>\n                          <option value=\"stretch\">Kéo giãn để lấp đầy</option>\n                          <option value=\"contain\">Vừa khung ảnh</option>\n                          <option value=\"tile\">Lặp gạch nền</option>\n                        </select>\n                      </div>\n\n                      <div class=\"bg-field-group\">\n                        <label class=\"bg-field-label\">Chế độ hòa trộn</label>\n                        <select id=\"bgBlendMode\" class=\"retouch-select bg-evoto-select\">\n                          <option value=\"normal\">Bình thường</option>\n                          <option value=\"multiply\">Nhân</option>\n                          <option value=\"screen\">Làm sáng</option>\n                          <option value=\"overlay\">Phủ</option>\n                          <option value=\"soft_light\">Ánh sáng mềm</option>\n                        </select>\n                      </div>\n\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Điều chỉnh viền</span><span class=\"val\" data-for=\"bgEdgeAdjust\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgEdgeAdjust\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ mờ</span><span class=\"val\" data-for=\"bgReplaceOpacity\">100</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgReplaceOpacity\" min=\"0\" max=\"100\" value=\"100\" /></div>\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Kích thước</span><span class=\"val\" data-for=\"bgScale\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgScale\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Chiều dọc</span><span class=\"val\" data-for=\"bgOffsetY\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgOffsetY\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Chiều ngang</span><span class=\"val\" data-for=\"bgOffsetX\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgOffsetX\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Mờ</span><span class=\"val\" data-for=\"bgBlurStrength\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgBlurStrength\" min=\"0\" max=\"100\" value=\"0\" /></div>\n\n                      <div class=\"crop-toggle-row\">\n                        <span class=\"crop-toggle-label\">Xoá lem màu</span>\n                        <button type=\"button\" id=\"bgDecontam\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\"><span class=\"evoto-switch-knob\"></span></button>\n                      </div>\n                      <div class=\"crop-toggle-row\">\n                        <span class=\"crop-toggle-label\">Phản chiếu mặt đất</span>\n                        <button type=\"button\" id=\"bgGroundReflect\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\"><span class=\"evoto-switch-knob\"></span></button>\n                      </div>\n\n                      <div class=\"bg-divider\"></div>\n                      <div class=\"bg-subhead\">Bóng Gốc</div>\n                      <div class=\"crop-toggle-row\">\n                        <span class=\"crop-toggle-label\">Bóng AI giữ lại</span>\n                        <button type=\"button\" id=\"bgPreserveShadow\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\"><span class=\"evoto-switch-knob\"></span></button>\n                      </div>\n\n                      <div class=\"bg-subhead\" style=\"margin-top: 8px;\">Thêm bóng đổ</div>\n                      <div class=\"bg-shadow-grid\" id=\"bg-shadow-grid\">\n                        <button type=\"button\" class=\"bg-shadow-card active\" data-shadow=\"none\">\n                          <span class=\"bg-sh-icon bg-sh-none\">⊘</span>\n                          <span>Trống</span>\n                        </button>\n                        <button type=\"button\" class=\"bg-shadow-card\" data-shadow=\"soft_shadow\">\n                          <span class=\"bg-sh-icon bg-sh-soft\">●</span>\n                          <span>Bóng mờ</span>\n                        </button>\n                        <button type=\"button\" class=\"bg-shadow-card\" data-shadow=\"hard_shadow\">\n                          <span class=\"bg-sh-icon bg-sh-hard\">●</span>\n                          <span>Bóng đậm</span>\n                        </button>\n                        <button type=\"button\" class=\"bg-shadow-card\" data-shadow=\"cast_shadow\">\n                          <span class=\"bg-sh-icon bg-sh-cast\">●</span>\n                          <span>Đổ bóng</span>\n                        </button>\n                      </div>\n\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Làm mờ bóng</span><span class=\"val\" data-for=\"bgShadowBlur\">25</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgShadowBlur\" min=\"0\" max=\"100\" value=\"25\" /></div>\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ mờ</span><span class=\"val\" data-for=\"bgShadowOpacity\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgShadowOpacity\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                      <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Chuyển màu</span><span class=\"val\" data-for=\"bgShadowShift\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"bgShadowShift\" min=\"0\" max=\"100\" value=\"0\" /></div>\n\n                      <div class=\"bg-field-group\">\n                        <label class=\"bg-field-label\">Chế độ hòa trộn</label>\n                        <select id=\"bgShadowBlendMode\" class=\"retouch-select bg-evoto-select\">\n                          <option value=\"multiply\">Nhân</option>\n                          <option value=\"normal\">Bình thường</option>\n                          <option value=\"darken\">Làm tối</option>\n                          <option value=\"soft_light\">Ánh sáng mềm</option>\n                        </select>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <!-- SECTION 3: Đổi bầu trời -->\n              <div class=\"retouch-acc-group collapsed\">\n                <div class=\"retouch-acc-title\">▾ Đổi bầu trời</div>\n                <div class=\"retouch-acc-body\">\n                  <div class=\"asset-hub-grid bg-evoto-grid\" style=\"margin-bottom: 8px;\">\n                    <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"sky_golden_sunset\" style=\"background: linear-gradient(180deg, #f97316, #fde047)\"><span>Hoàng hôn</span></button>\n                    <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"sky_alpine_blue\" style=\"background: linear-gradient(180deg, #1d4ed8, #93c5fd)\"><span>Trời xanh</span></button>\n                    <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"sky_dramatic_clouds\" style=\"background: linear-gradient(180deg, #334155, #94a3b8)\"><span>Mây bão</span></button>\n                    <button type=\"button\" class=\"asset-swatch\" data-bgmode=\"sky_night_stars\" style=\"background: linear-gradient(180deg, #090d16, #1e293b)\"><span>Đêm sao</span></button>\n                  </div>\n                  <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Tăng chiều sâu &amp; sắc trời</span><span class=\"val\" data-for=\"skyEnhance\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"skyEnhance\" min=\"0\" max=\"100\" value=\"0\" /></div>\n                </div>\n              </div>\n            </div>\n\n            <!-- MODULE 3B: LÀM ĐẸP TRANG PHỤC (Evoto Style) -->\n            <div id=\"mod-clothing\" class=\"retouch-module-pane\">\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title cloth-acc-title\">\n                  <span>▾ Điều chỉnh trang phục</span>\n                  <button type=\"button\" id=\"btn-clothing-reset\" class=\"cloth-reset-btn\" title=\"Đặt lại toàn bộ chỉnh sửa trang phục\">\n                    <svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">\n                      <path d=\"M3 12a9 9 0 1 0 3-6.7L3 8\" />\n                      <path d=\"M3 3v5h5\" />\n                    </svg>\n                  </button>\n                </div>\n                <div class=\"retouch-acc-body\">\n                  <!-- Nhóm đối tượng trang phục -->\n                  <div class=\"cloth-target-pills\" id=\"cloth-target-pills\">\n                    <button type=\"button\" class=\"cloth-target-pill active\" data-clothtarget=\"all\">Tất cả</button>\n                    <button type=\"button\" class=\"cloth-target-pill\" data-clothtarget=\"female\">Nữ</button>\n                    <button type=\"button\" class=\"cloth-target-pill\" data-clothtarget=\"male\">Nam</button>\n                    <button type=\"button\" class=\"cloth-target-pill\" data-clothtarget=\"child\">Trẻ con</button>\n                    <button type=\"button\" class=\"cloth-target-pill\" data-clothtarget=\"senior_female\">Nữ lớn tuổi</button>\n                    <button type=\"button\" class=\"cloth-target-pill\" data-clothtarget=\"senior_male\">Nam lớn tuổi</button>\n                  </div>\n\n                  <!-- Card Loại bỏ nếp nhăn quần áo -->\n                  <div class=\"cloth-wrinkle-card\">\n                    <div class=\"cloth-wrinkle-head\">\n                      <div class=\"cloth-wrinkle-title\">\n                        <span>Loại bỏ nếp nhăn quần áo</span>\n                        <span class=\"evoto-new-badge\">New</span>\n                      </div>\n                      <button type=\"button\" id=\"btn-cloth-wrinkle-link\" class=\"cloth-link-btn active\" aria-pressed=\"true\" title=\"Liên kết mức độ nếp nhăn nhỏ &amp; nếp nhăn lớn\">\n                        <svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">\n                          <path d=\"M9 17H7A5 5 0 0 1 7 7h2\" />\n                          <path d=\"M15 7h2a5 5 0 1 1 0 10h-2\" />\n                          <line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\" />\n                        </svg>\n                      </button>\n                    </div>\n                    <div class=\"retouch-slider-item\" style=\"margin-bottom: 0;\">\n                      <div class=\"s-head\"><span>Mức độ</span><span class=\"val\" data-for=\"clothingDewrinkle\">0</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"clothingDewrinkle\" min=\"0\" max=\"100\" value=\"0\" />\n                    </div>\n                  </div>\n\n                  <div class=\"retouch-slider-item\" style=\"margin-top: 10px;\">\n                    <div class=\"s-head\"><span>Loại bỏ nếp nhăn nhỏ</span><span class=\"val\" data-for=\"clothingSmallWrinkles\">100</span></div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"clothingSmallWrinkles\" min=\"0\" max=\"100\" value=\"100\" />\n                  </div>\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\"><span>Loại bỏ nếp nhăn lớn</span><span class=\"val\" data-for=\"clothingLargeWrinkles\">100</span></div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"clothingLargeWrinkles\" min=\"0\" max=\"100\" value=\"100\" />\n                  </div>\n\n                  <div class=\"bg-divider\" style=\"margin-top: 10px;\"></div>\n                  <div class=\"cloth-subhead\">Xoá khuyết điểm trên quần áo</div>\n\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span class=\"cloth-label-with-badges\">\n                        Xóa xơ vải\n                        <span class=\"cloth-help-dot\" title=\"Tự động nhận diện và xóa xơ vải, bụi trắng li ti trên trang phục\">?</span>\n                        <span class=\"evoto-beta-badge\">Beta</span>\n                      </span>\n                      <span class=\"val\" data-for=\"clothingLintClean\">0</span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"clothingLintClean\" min=\"0\" max=\"100\" value=\"0\" />\n                  </div>\n\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span class=\"cloth-label-with-badges\">\n                        Xóa vết mồ hôi\n                        <span class=\"evoto-beta-badge\">Beta</span>\n                        <span class=\"evoto-new-badge\">New</span>\n                      </span>\n                      <span class=\"cloth-val-with-arrow\">\n                        <span class=\"val\" data-for=\"clothingSweatStain\">0</span>\n                        <button type=\"button\" id=\"btn-cloth-sweat-expand\" class=\"cloth-sub-arrow\" aria-expanded=\"false\" title=\"Mở tinh chỉnh vết mồ hôi\">▸</button>\n                      </span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"clothingSweatStain\" min=\"0\" max=\"100\" value=\"0\" />\n                    <div id=\"cloth-sweat-drawer\" class=\"cloth-sub-drawer hidden\">\n                      <div class=\"s-head\" style=\"margin-top: 6px;\"><span>Đều màu vùng ẩm</span><span class=\"val\" data-for=\"clothingSweatEvenness\">50</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"clothingSweatEvenness\" min=\"0\" max=\"100\" value=\"50\" />\n                    </div>\n                  </div>\n\n                  <div class=\"retouch-slider-item\">\n                    <div class=\"s-head\">\n                      <span class=\"cloth-label-with-badges\">\n                        Làm phẳng viền trang phục\n                        <span class=\"cloth-help-dot\" title=\"Làm phẳng đường gấu áo, cổ áo, mép vải bị phồng hoặc nhăn nhúm\">?</span>\n                      </span>\n                      <span class=\"cloth-val-with-arrow\">\n                        <span class=\"val\" data-for=\"clothingEdgeSmooth\">0</span>\n                        <button type=\"button\" id=\"btn-cloth-edge-expand\" class=\"cloth-sub-arrow\" aria-expanded=\"false\" title=\"Mở tinh chỉnh viền trang phục\">▸</button>\n                      </span>\n                    </div>\n                    <input type=\"range\" class=\"retouch-slider\" id=\"clothingEdgeSmooth\" min=\"0\" max=\"100\" value=\"0\" />\n                    <div id=\"cloth-edge-drawer\" class=\"cloth-sub-drawer hidden\">\n                      <div class=\"s-head\" style=\"margin-top: 6px;\"><span>Bảo vệ cổ &amp; gấu áo</span><span class=\"val\" data-for=\"clothingEdgeRefine\">50</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"clothingEdgeRefine\" min=\"0\" max=\"100\" value=\"50\" />\n                    </div>\n                  </div>\n\n                  <!-- Promo card: Loại bỏ vân vải (Moiré) -->\n                  <div class=\"cloth-promo-card\">\n                    <div class=\"cloth-promo-thumb\">\n                      <div class=\"cloth-promo-half cloth-promo-before\">\n                        <span class=\"cloth-ba-tag\">Before</span>\n                      </div>\n                      <div class=\"cloth-promo-half cloth-promo-after\">\n                        <span class=\"cloth-ba-tag after\">After</span>\n                      </div>\n                    </div>\n                    <div class=\"cloth-promo-info\">\n                      <div class=\"cloth-promo-icon\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\">\n                          <path d=\"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z\" />\n                        </svg>\n                      </div>\n                      <div class=\"cloth-promo-title\">Loại bỏ vân vải</div>\n                      <button type=\"button\" id=\"btn-cloth-try-moire\" class=\"cloth-promo-cta\">Dùng thử ngay →</button>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <!-- SECTION 2: AI Lab -->\n              <div class=\"retouch-acc-group\">\n                <div class=\"retouch-acc-title\">▾ AI Lab</div>\n                <div class=\"retouch-acc-body\">\n                  <button type=\"button\" id=\"btn-cloth-ailab-moire\" class=\"cloth-ailab-row\" aria-expanded=\"false\">\n                    <span class=\"cloth-ailab-left\">\n                      <span class=\"cloth-ailab-badge\">\n                        <svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\">\n                          <path d=\"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z\" />\n                        </svg>\n                      </span>\n                      <span>Loại bỏ vân vải</span>\n                    </span>\n                    <span class=\"cloth-ailab-chevron\" id=\"cloth-ailab-chevron\">›</span>\n                  </button>\n                  <div id=\"cloth-ailab-moire-drawer\" class=\"cloth-ailab-drawer hidden\">\n                    <div class=\"retouch-slider-item\" style=\"margin-bottom: 0;\">\n                      <div class=\"s-head\"><span>Khử vân Moiré trên vải</span><span class=\"val\" data-for=\"clothingMoireRemove\">0</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"clothingMoireRemove\" min=\"0\" max=\"100\" value=\"0\" />\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n\n            <!-- MODULE 4: CẮT & XOAY (Evoto Style) -->\n            <div id=\"mod-crop\" class=\"retouch-module-pane\">\n              <div class=\"crop-mode-tabs\">\n                <button type=\"button\" class=\"crop-mode-tab active\" data-croptab=\"crop-pane-main\">Cắt &amp; Xoay</button>\n                <button type=\"button\" class=\"crop-mode-tab\" data-croptab=\"crop-pane-expand\">Phối cảnh &amp; Mở rộng</button>\n              </div>\n\n              <!-- TAB 1: CẮT & XOAY -->\n              <div id=\"crop-pane-main\" class=\"crop-subtab-pane active\">\n                <div class=\"retouch-acc-group\">\n                  <div class=\"retouch-acc-title\">▾ Cắt</div>\n                  <div class=\"retouch-acc-body\">\n\n                    <!-- Evoto Crop Ratio Dropdown -->\n                    <div class=\"crop-ratio-wrap\">\n                      <button type=\"button\" id=\"crop-ratio-btn\" class=\"crop-ratio-btn\" aria-expanded=\"false\">\n                        <span id=\"crop-ratio-label\">Kích thước gốc</span>\n                        <svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"6 9 12 15 18 9\"/></svg>\n                      </button>\n                      <div id=\"crop-ratio-menu\" class=\"crop-ratio-menu hidden\">\n                        <div class=\"crop-ratio-opt active\" data-preset=\"original\" data-aw=\"0\" data-ah=\"0\"><span class=\"opt-check\">✓</span><span>Kích thước gốc</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"as_shot\" data-aw=\"-3\" data-ah=\"-3\"><span class=\"opt-check\"></span><span>Cài đặt ảnh gốc</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"fixed\" data-aw=\"-1\" data-ah=\"-1\"><span class=\"opt-check\"></span><span>Tỉ lệ cố định</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"custom_ratio\" data-aw=\"-2\" data-ah=\"-2\"><span class=\"opt-check\"></span><span>Kích thước tự chọn</span></div>\n                        <div class=\"crop-ratio-divider\"></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"1:1\" data-aw=\"1\" data-ah=\"1\"><span class=\"opt-check\"></span><span>1 : 1</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"4:5\" data-aw=\"4\" data-ah=\"5\"><span class=\"opt-check\"></span><span>4 : 5</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"5:7\" data-aw=\"5\" data-ah=\"7\"><span class=\"opt-check\"></span><span>5 : 7</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"2:3\" data-aw=\"2\" data-ah=\"3\"><span class=\"opt-check\"></span><span>2 : 3</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"16:9\" data-aw=\"16\" data-ah=\"9\"><span class=\"opt-check\"></span><span>16 : 9</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"1.91:1\" data-aw=\"191\" data-ah=\"100\"><span class=\"opt-check\"></span><span>1.91 : 1</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"2:1\" data-aw=\"2\" data-ah=\"1\"><span class=\"opt-check\"></span><span>2 : 1</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"3:1\" data-aw=\"3\" data-ah=\"1\"><span class=\"opt-check\"></span><span>3 : 1</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"4:3\" data-aw=\"4\" data-ah=\"3\"><span class=\"opt-check\"></span><span>4 : 3</span></div>\n                        <div class=\"crop-ratio-divider\"></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"custom_dim\" data-aw=\"-4\" data-ah=\"-4\"><span class=\"opt-check\"></span><span>Dài*Rộng*Độ phân giải</span></div>\n                        <div class=\"crop-ratio-opt\" data-preset=\"id_photo\" data-aw=\"-5\" data-ah=\"-5\"><span class=\"opt-check\"></span><span>Ảnh Thẻ</span><span class=\"opt-arrow\">›</span></div>\n                      </div>\n                    </div>\n\n                    <!-- Nhập tay tỉ lệ W : H -->\n                    <div id=\"crop-custom-ratio-box\" class=\"crop-custom-inputs hidden\">\n                      <div class=\"crop-dim-grid\">\n                        <div class=\"crop-dim-field\">\n                          <label>Tỉ lệ ngang</label>\n                          <input type=\"number\" id=\"crop-ratio-w-in\" class=\"crop-num-input\" min=\"0.1\" max=\"9999\" step=\"0.1\" value=\"4\" />\n                        </div>\n                        <button type=\"button\" id=\"btn-crop-swap-ratio\" class=\"crop-swap-btn\" title=\"Đảo tỉ lệ ngang / dọc\">⇄</button>\n                        <div class=\"crop-dim-field\">\n                          <label>Tỉ lệ dọc</label>\n                          <input type=\"number\" id=\"crop-ratio-h-in\" class=\"crop-num-input\" min=\"0.1\" max=\"9999\" step=\"0.1\" value=\"5\" />\n                        </div>\n                      </div>\n                    </div>\n\n                    <!-- Nhập tay Dài * Rộng * Độ phân giải -->\n                    <div id=\"crop-custom-inputs\" class=\"crop-custom-inputs hidden\">\n                      <div class=\"crop-dim-grid\">\n                        <div class=\"crop-dim-field\">\n                          <label>Rộng</label>\n                          <input type=\"number\" id=\"crop-custom-w-in\" class=\"crop-num-input\" min=\"1\" max=\"20000\" step=\"1\" placeholder=\"1200\" />\n                        </div>\n                        <button type=\"button\" id=\"btn-crop-swap-dim\" class=\"crop-swap-btn\" title=\"Đảo Rộng × Cao\">⇄</button>\n                        <div class=\"crop-dim-field\">\n                          <label>Cao</label>\n                          <input type=\"number\" id=\"crop-custom-h-in\" class=\"crop-num-input\" min=\"1\" max=\"20000\" step=\"1\" placeholder=\"1500\" />\n                        </div>\n                      </div>\n                      <div class=\"crop-dim-meta-row\">\n                        <select id=\"crop-dim-unit\" class=\"crop-mini-select\">\n                          <option value=\"px\">px (Pixel)</option>\n                          <option value=\"cm\">cm</option>\n                          <option value=\"mm\">mm</option>\n                        </select>\n                        <div class=\"crop-dpi-field\">\n                          <span>DPI</span>\n                          <input type=\"number\" id=\"crop-dpi-in\" class=\"crop-num-input\" min=\"72\" max=\"1200\" step=\"1\" value=\"300\" />\n                        </div>\n                      </div>\n                      <p id=\"crop-dim-computed\" class=\"crop-custom-hint\">Áp dụng đúng tỉ lệ &amp; xuất đúng kích thước</p>\n                    </div>\n\n                    <!-- Preset Ảnh Thẻ -->\n                    <div id=\"crop-id-presets-box\" class=\"crop-custom-inputs hidden\">\n                      <div class=\"crop-id-grid\">\n                        <button type=\"button\" class=\"crop-id-chip\" data-idpreset=\"id_2x3\" data-cmw=\"2\" data-cmh=\"3\">2×3 cm</button>\n                        <button type=\"button\" class=\"crop-id-chip\" data-idpreset=\"id_3x4\" data-cmw=\"3\" data-cmh=\"4\">3×4 cm</button>\n                        <button type=\"button\" class=\"crop-id-chip\" data-idpreset=\"id_4x6\" data-cmw=\"4\" data-cmh=\"6\">4×6 cm</button>\n                        <button type=\"button\" class=\"crop-id-chip\" data-idpreset=\"id_35x45\" data-cmw=\"3.5\" data-cmh=\"4.5\">Visa 3.5×4.5</button>\n                        <button type=\"button\" class=\"crop-id-chip\" data-idpreset=\"id_5x5\" data-cmw=\"5\" data-cmh=\"5\">5×5 cm</button>\n                        <button type=\"button\" class=\"crop-id-chip\" data-idpreset=\"id_33x48\" data-cmw=\"3.3\" data-cmh=\"4.8\">3.3×4.8 cm</button>\n                      </div>\n                      <p id=\"crop-id-readout\" class=\"crop-custom-hint\">300 DPI · Tự động khóa đúng tỉ lệ ảnh thẻ</p>\n                    </div>\n\n                    <!-- Live Readout + Action Buttons -->\n                    <div class=\"crop-toolbar-row\">\n                      <span id=\"crop-box-readout\" class=\"crop-box-readout\">Toàn khung ảnh</span>\n                      <div class=\"crop-mini-actions\">\n                        <button type=\"button\" id=\"btn-crop-orient\" class=\"crop-mini-btn\" title=\"Đảo chiều khung cắt (Ngang / Dọc)\">⇄</button>\n                        <button type=\"button\" id=\"btn-crop-preview-toggle\" class=\"crop-mini-btn\" title=\"Xem kết quả đã cắt ngay\">Xem</button>\n                        <button type=\"button\" id=\"btn-crop-reset\" class=\"crop-mini-btn\" title=\"Đặt lại khung cắt\">↺</button>\n                      </div>\n                    </div>\n\n                    <div class=\"crop-apply-reset-row\">\n                      <button type=\"button\" id=\"btn-crop-apply\" class=\"crop-action-btn primary\" title=\"Áp dụng vùng cắt vào khung xem trước\">Áp dụng cắt</button>\n                      <button type=\"button\" id=\"btn-crop-reset-btn\" class=\"crop-action-btn secondary\" title=\"Khôi phục khung ảnh gốc\">Đặt lại cắt</button>\n                    </div>\n\n                    <!-- Show Grid -->\n                    <label class=\"crop-check-row\">\n                      <input type=\"checkbox\" id=\"crop-show-grid\" checked />\n                      <span>Hiển thị lưới khi cắt ảnh</span>\n                    </label>\n\n                    <!-- Định vị bằng AI -->\n                    <div class=\"crop-ai-section\">\n                      <div class=\"crop-ai-title\">Định vị bằng AI</div>\n                      <div class=\"crop-ai-tabs\">\n                        <button type=\"button\" class=\"crop-ai-tab active\" id=\"crop-ai-tab-subject\">Chủ thể</button>\n                        <button type=\"button\" class=\"crop-ai-tab\" id=\"crop-ai-tab-head\">Khung chân dung</button>\n                      </div>\n\n                      <div id=\"crop-ai-subject-panel\">\n                        <div class=\"crop-toggle-row\">\n                          <span class=\"crop-toggle-label\">Định vị đối tượng</span>\n                          <button type=\"button\" id=\"toggle-crop-ai-subject\" class=\"evoto-switch\" role=\"switch\" aria-checked=\"false\">\n                            <span class=\"evoto-switch-knob\"></span>\n                          </button>\n                        </div>\n                        <div class=\"crop-sublabel\">Tự động căn chỉnh người</div>\n                        <div class=\"crop-ai-stack-btns\">\n                          <button type=\"button\" id=\"btn-crop-align-v\" class=\"crop-pill-action-btn\">Căn chỉnh dọc</button>\n                          <button type=\"button\" id=\"btn-crop-align-eye\" class=\"crop-pill-action-btn\">Căn ngang theo mắt</button>\n                        </div>\n                      </div>\n\n                      <div id=\"crop-ai-head-panel\" class=\"hidden\">\n                        <div class=\"crop-sublabel\" style=\"margin-top:8px\">Bố cục chân dung AI 478 điểm</div>\n                        <div class=\"crop-id-grid\">\n                          <button type=\"button\" class=\"crop-frame-chip\" data-frame=\"headshot\">Cận mặt</button>\n                          <button type=\"button\" class=\"crop-frame-chip\" data-frame=\"waist\">Bán thân</button>\n                          <button type=\"button\" class=\"crop-frame-chip\" data-frame=\"full\">Toàn thân</button>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n\n                <!-- XOAY -->\n                <div class=\"retouch-acc-group\">\n                  <div class=\"retouch-acc-title\">▾ Xoay</div>\n                  <div class=\"retouch-acc-body\">\n                    <div class=\"crop-rotate-icons\">\n                      <button type=\"button\" id=\"btn-crop-rot-left\" class=\"crop-icon-btn\" title=\"Xoay trái 90°\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M3 12a9 9 0 1 0 3-6.7L3 8\"/><path d=\"M3 3v5h5\"/><rect x=\"9\" y=\"9\" width=\"8\" height=\"8\" rx=\"1.2\"/></svg>\n                      </button>\n                      <button type=\"button\" id=\"btn-crop-rot-right\" class=\"crop-icon-btn\" title=\"Xoay phải 90°\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M21 12a9 9 0 1 1-3-6.7L21 8\"/><path d=\"M21 3v5h-5\"/><rect x=\"7\" y=\"9\" width=\"8\" height=\"8\" rx=\"1.2\"/></svg>\n                      </button>\n                      <button type=\"button\" id=\"btn-flip-h\" class=\"crop-icon-btn\" title=\"Lật ngang (Soi gương)\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"21\" stroke-dasharray=\"2 2\"/><polygon points=\"8 7 3 12 8 17 8 7\"/><polygon points=\"16 7 21 12 16 17 16 7\"/></svg>\n                      </button>\n                      <button type=\"button\" id=\"btn-flip-v\" class=\"crop-icon-btn\" title=\"Lật dọc\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\" stroke-dasharray=\"2 2\"/><polygon points=\"7 8 12 3 17 8 7 8\"/><polygon points=\"7 16 12 21 17 16 7 16\"/></svg>\n                      </button>\n                    </div>\n                    <div class=\"crop-ai-straighten-row\">\n                      <span class=\"crop-toggle-label\">AI Hiệu Chỉnh</span>\n                      <button type=\"button\" id=\"btn-ai-auto-straighten\" class=\"crop-auto-pill\">Tự động</button>\n                    </div>\n                    <div class=\"retouch-slider-item\" style=\"margin-top:8px\">\n                      <div class=\"s-head\"><span>Góc</span><span class=\"val\" data-for=\"rotateAngle\">0.00</span></div>\n                      <input type=\"range\" class=\"retouch-slider\" id=\"rotateAngle\" min=\"-45\" max=\"45\" step=\"0.1\" value=\"0\" />\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <!-- TAB 2: PHỐI CẢNH & MỞ RỘNG -->\n              <div id=\"crop-pane-expand\" class=\"crop-subtab-pane\">\n                <div class=\"retouch-acc-group\">\n                  <div class=\"retouch-acc-title\">▾ Biến dạng phối cảnh</div>\n                  <div class=\"retouch-acc-body\">\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Biến dạng dọc (Keystone V)</span><span class=\"val\" data-for=\"keystoneVertical\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"keystoneVertical\" min=\"-50\" max=\"50\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Biến dạng ngang (Keystone H)</span><span class=\"val\" data-for=\"keystoneHorizontal\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"keystoneHorizontal\" min=\"-50\" max=\"50\" value=\"0\" /></div>\n                  </div>\n                </div>\n                <div class=\"retouch-acc-group\">\n                  <div class=\"retouch-acc-title\">▾ Hình học &amp; Mở rộng khung</div>\n                  <div class=\"retouch-acc-body\">\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Thu phóng hình (%)</span><span class=\"val\" data-for=\"geoScale\">100</span></div><input type=\"range\" class=\"retouch-slider\" id=\"geoScale\" min=\"50\" max=\"200\" value=\"100\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ lệch trục X</span><span class=\"val\" data-for=\"geoOffsetX\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"geoOffsetX\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                    <div class=\"retouch-slider-item\"><div class=\"s-head\"><span>Độ lệch trục Y</span><span class=\"val\" data-for=\"geoOffsetY\">0</span></div><input type=\"range\" class=\"retouch-slider\" id=\"geoOffsetY\" min=\"-100\" max=\"100\" value=\"0\" /></div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- CHÂN BẢNG PHẢI CỐ ĐỊNH KIỂU EVOTO -->\n          <div class=\"inspector-footer\">\n            <button id=\"btn-save-user-preset-footer\" type=\"button\" class=\"evoto-footer-pill\">Lưu cài sẵn mới</button>\n            <button id=\"btn-sync-all-footer\" type=\"button\" class=\"evoto-footer-pill\">Đồng bộ tất cả</button>\n            <button id=\"btn-reset-all-footer\" type=\"button\" class=\"evoto-footer-gear\" title=\"Đặt lại toàn bộ thông số ảnh hiện tại\">↺</button>\n          </div>\n        </aside>";

  var StuUltra = {
    container: null,
    inspector: null,
    rail: null,
    headerRight: null,
    viewport: null,
    afterCanvas: null,
    beforeCanvas: null,
    overlayCanvas: null,
    canvasWrap: null,
    splitLine: null,
    activeModule: 'mod-portrait',
    histOpen: true,
    realtimeColor: true,
    splitRatio: 0.5,
    isDraggingSplit: false,
    isProcessing: false,
    pendingProcess: false,
    cropPreviewMode: false,
    hairSideLinked: true,
    clothWrinkleLinked: true,
    bgCategory: 'image',
    bgLibTab: 'rec',
    bgFilter: 'explore',
    bgUserFilter: 'personal',
    bgMoreExpanded: false,
    customBgGallery: [],
    draggingCurveIdx: -1,
    _renderSeq: 0,
    _processSeq: 0,
    zoomScale: 0,
    fitScale: 1,
    panX: 0,
    panY: 0,
    isPanning: false,
    panStartX: 0,
    panStartY: 0,
    compareVisible: true,
    holdingOriginal: false,
    _toolbarHooked: false,
    loadedBeforeCrop: null,

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

      // 3. Create Header Right Controls (reuses top-bar #devstu-top-exit-btn without duplicate ✕)
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

        var lastPill = hdr.querySelector('.pill.accent') || document.getElementById('devstu-top-exit-btn') || hdr.lastChild;
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
            StuUltra.zoomScale = 0;
            StuUltra.panX = 0;
            StuUltra.panY = 0;
            StuUltra.syncCurrentPhoto();
            if (isStuMode(window._devstuA) && window._devstuA.current) {
              StuUltra.triggerRustProcess(window._devstuA.current, false);
            }
          } else if (event === 'photos') {
            StuUltra.syncBatchCount();
          }
        });
      }

      StuUltra.hookToolbarControls();
      StuUltra.onModeChange();
    },

    hookToolbarControls: function() {
      if (StuUltra._toolbarHooked) return;
      StuUltra._toolbarHooked = true;
      document.addEventListener('click', function(e) {
        var A = window._devstuA;
        if (!isStuMode(A)) return;
        var btn = e.target && e.target.closest && e.target.closest('.toolbar button');
        if (!btn) return;
        var lbl = (btn.textContent || '').trim();
        var aria = btn.getAttribute('aria-label') || '';
        if (aria.indexOf('Thu nhỏ') !== -1 || btn.classList.contains('zb') && aria.toLowerCase().indexOf('nhỏ') !== -1) {
          e.preventDefault(); e.stopPropagation();
          StuUltra.stepZoom(-1);
        } else if (aria.indexOf('Phóng to') !== -1 || btn.classList.contains('zb') && aria.toLowerCase().indexOf('phóng') !== -1) {
          e.preventDefault(); e.stopPropagation();
          StuUltra.stepZoom(1);
        } else if (lbl === 'Vừa khung') {
          e.preventDefault(); e.stopPropagation();
          StuUltra.setZoom('fit');
        } else if (lbl === '100 %' || lbl === '100%') {
          e.preventDefault(); e.stopPropagation();
          StuUltra.setZoom(1);
        } else if (lbl.indexOf('So sánh') !== -1) {
          e.preventDefault(); e.stopPropagation();
          StuUltra.compareVisible = !StuUltra.compareVisible;
          btn.setAttribute('aria-pressed', String(StuUltra.compareVisible));
          StuUltra.updateSplitRender();
        } else if (btn.classList.contains('tb-crop') || lbl.indexOf('Cắt ảnh') !== -1) {
          e.preventDefault(); e.stopPropagation();
          var cropRailBtn = StuUltra.container && StuUltra.container.querySelector('.rail-icon-btn[data-mod="mod-crop"]');
          if (cropRailBtn) cropRailBtn.click();
        } else if (lbl.indexOf('Ảnh gốc') !== -1) {
          e.preventDefault(); e.stopPropagation();
        }
      }, true);

      var setHoldOriginal = function(active) {
        var A = window._devstuA;
        if (!isStuMode(A)) return;
        if (StuUltra.holdingOriginal !== active) {
          StuUltra.holdingOriginal = active;
          StuUltra.updateSplitRender();
        }
      };
      document.addEventListener('pointerdown', function(e) {
        var A = window._devstuA;
        if (!isStuMode(A)) return;
        var btn = e.target && e.target.closest && e.target.closest('.toolbar button');
        if (btn && ((btn.textContent || '').indexOf('Ảnh gốc') !== -1)) {
          e.preventDefault(); e.stopPropagation();
          setHoldOriginal(true);
        }
      }, true);
      window.addEventListener('pointerup', function() { if (StuUltra.holdingOriginal) setHoldOriginal(false); });
      window.addEventListener('pointercancel', function() { if (StuUltra.holdingOriginal) setHoldOriginal(false); });
      window.addEventListener('keydown', function(e) {
        var A = window._devstuA;
        if (!isStuMode(A)) return;
        var tag = (document.activeElement && document.activeElement.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (e.code === 'Space' && !e.repeat) {
          e.preventDefault();
          setHoldOriginal(true);
        }
      });
      window.addEventListener('keyup', function(e) {
        if (e.code === 'Space' && StuUltra.holdingOriginal) {
          setHoldOriginal(false);
        }
      });
    },

    setZoom: function(target) {
      var A = window._devstuA;
      var photo = A && A.current;
      if (target === 'fit') {
        StuUltra.zoomScale = 0;
        StuUltra.panX = 0;
        StuUltra.panY = 0;
      } else {
        var z = Number(target);
        if (Number.isFinite(z) && z > 0.05) {
          StuUltra.zoomScale = Math.max(0.1, Math.min(4, z));
        }
      }
      if (photo) StuUltra.renderViewport(photo);
    },

    stepZoom: function(dir) {
      var A = window._devstuA;
      var photo = A && A.current;
      var cur = StuUltra.zoomScale > 0 ? StuUltra.zoomScale : (StuUltra.fitScale || 0.5);
      var next = dir > 0 ? cur * 1.25 : cur / 1.25;
      var clamped = Math.max(0.1, Math.min(4, next));
      if (StuUltra.fitScale && Math.abs(clamped - StuUltra.fitScale) < 0.04) {
        StuUltra.zoomScale = 0;
        StuUltra.panX = 0;
        StuUltra.panY = 0;
      } else {
        StuUltra.zoomScale = clamped;
      }
      if (photo) StuUltra.renderViewport(photo);
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
        '<canvas id="stu-ultra-overlay-canvas"></canvas>' +
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
      StuUltra.canvasWrap = vDiv.querySelector('#stu-ultra-canvas-wrap');
      StuUltra.afterCanvas = vDiv.querySelector('#stu-ultra-after-canvas');
      StuUltra.beforeCanvas = vDiv.querySelector('#stu-ultra-before-canvas');
      StuUltra.overlayCanvas = vDiv.querySelector('#stu-ultra-overlay-canvas');
      StuUltra.splitLine = vDiv.querySelector('#stu-ultra-split-line');

      var onSplitMove = function(clientX) {
        if (!StuUltra.isDraggingSplit) return;
        var wrap = StuUltra.canvasWrap;
        if (!wrap) return;
        var rect = wrap.getBoundingClientRect();
        if (rect.width <= 0) return;
        var ratio = (clientX - rect.left) / rect.width;
        StuUltra.splitRatio = Math.max(0.01, Math.min(0.99, ratio));
        StuUltra.updateSplitRender();
      };

      StuUltra.splitLine.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        StuUltra.isDraggingSplit = true;
      });

      StuUltra.canvasWrap.addEventListener('mousedown', function(e) {
        if (e.target && e.target.closest && e.target.closest('#stu-ultra-split-line')) return;
        if (StuUltra.zoomScale > 0 && StuUltra.zoomScale > (StuUltra.fitScale || 0) * 1.02) {
          e.preventDefault();
          StuUltra.isPanning = true;
          StuUltra.panStartX = e.clientX - StuUltra.panX;
          StuUltra.panStartY = e.clientY - StuUltra.panY;
          StuUltra.canvasWrap.style.cursor = 'grabbing';
        }
      });

      vDiv.addEventListener('wheel', function(e) {
        var A = window._devstuA;
        if (!isStuMode(A)) return;
        e.preventDefault();
        StuUltra.stepZoom(e.deltaY < 0 ? 1 : -1);
      }, { passive: false });

      StuUltra.canvasWrap.addEventListener('dblclick', function(e) {
        if (e.target && e.target.closest && e.target.closest('#stu-ultra-split-line')) return;
        StuUltra.setZoom(StuUltra.zoomScale > 0 ? 'fit' : 1);
      });

      window.addEventListener('mousemove', function(e) {
        if (StuUltra.isDraggingSplit) {
          onSplitMove(e.clientX);
        } else if (StuUltra.isPanning) {
          StuUltra.panX = e.clientX - StuUltra.panStartX;
          StuUltra.panY = e.clientY - StuUltra.panStartY;
          if (StuUltra.canvasWrap) {
            StuUltra.canvasWrap.style.transform = 'translate(' + Math.round(StuUltra.panX) + 'px, ' + Math.round(StuUltra.panY) + 'px)';
          }
        } else if (StuUltra.draggingCurveIdx !== -1) {
          var curveCanvas = document.getElementById('tone-curve-canvas');
          var A = window._devstuA;
          var photo = A && A.current;
          if (!curveCanvas || !photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          var rect = curveCanvas.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return;
          var nx = clamp01((e.clientX - rect.left) / rect.width);
          var ny = clamp01(1 - (e.clientY - rect.top) / rect.height);
          var pts = getPhotoCurvePoints(photo);
          var idx = StuUltra.draggingCurveIdx;
          if (idx === 0) {
            pts[0].x = 0; pts[0].y = ny;
          } else if (idx === pts.length - 1) {
            pts[idx].x = 1; pts[idx].y = ny;
          } else {
            pts[idx].x = Math.max(pts[idx - 1].x + 0.02, Math.min(pts[idx + 1].x - 0.02, nx));
            pts[idx].y = ny;
          }
          photo._stuUltraParams.curveLut = build256CurveLutFromPoints(pts);
          StuUltra.renderToneCurve();
          if (StuUltra.realtimeColor) StuUltra.triggerRustProcess(photo, false);
        }
      });

      window.addEventListener('mouseup', function() {
        StuUltra.isDraggingSplit = false;
        if (StuUltra.isPanning) {
          StuUltra.isPanning = false;
          if (StuUltra.canvasWrap) StuUltra.canvasWrap.style.cursor = '';
        }
        if (StuUltra.draggingCurveIdx !== -1) {
          StuUltra.draggingCurveIdx = -1;
          var A = window._devstuA;
          if (A && A.current) StuUltra.triggerRustProcess(A.current, false);
        }
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

      if (typeof ResizeObserver === 'function') {
        var ro = new ResizeObserver(function() {
          var A = window._devstuA;
          if (isStuMode(A) && A.current) {
            StuUltra.renderViewport(A.current);
          }
        });
        ro.observe(vDiv);
      }
      window.addEventListener('resize', function() {
        var A = window._devstuA;
        if (isStuMode(A) && A.current) {
          StuUltra.renderViewport(A.current);
        }
      });
    },

    drawCropOverlay: function(w, h, photo) {
      var oc = StuUltra.overlayCanvas;
      if (!oc) return;
      var ctx = oc.getContext('2d');
      ctx.clearRect(0, 0, w, h);
      if (!photo) return;
      var p = photo._stuUltraParams;
      if (!p) return;
      var showGuide = (StuUltra.activeModule === 'mod-crop' && !StuUltra.cropPreviewMode);
      if (!showGuide) return;

      var cx = Math.round((p.cropX || 0) * w);
      var cy = Math.round((p.cropY || 0) * h);
      var cw = Math.max(4, Math.round((p.cropW != null ? p.cropW : 1) * w));
      var ch = Math.max(4, Math.round((p.cropH != null ? p.cropH : 1) * h));

      ctx.save();
      ctx.fillStyle = 'rgba(8, 9, 12, 0.58)';
      ctx.beginPath();
      ctx.rect(0, 0, w, h);
      ctx.rect(cx, cy, cw, ch);
      ctx.fill('evenodd');

      if (p.cropShowGrid !== false) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
        ctx.lineWidth = Math.max(1, w / 900);
        for (var i = 1; i <= 2; i++) {
          var gx = cx + (cw * i) / 3;
          var gy = cy + (ch * i) / 3;
          ctx.beginPath();
          ctx.moveTo(gx, cy); ctx.lineTo(gx, cy + ch);
          ctx.moveTo(cx, gy); ctx.lineTo(cx + cw, gy);
          ctx.stroke();
        }
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.lineWidth = Math.max(1.5, w / 650);
      ctx.strokeRect(cx + 0.5, cy + 0.5, cw - 1, ch - 1);

      var scaleFactor = Math.max(1, w / 720);
      var arm = Math.min(18 * scaleFactor, cw * 0.22, ch * 0.22);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(2.5, w / 340);
      ctx.beginPath();
      // TL
      ctx.moveTo(cx, cy + arm); ctx.lineTo(cx, cy); ctx.lineTo(cx + arm, cy);
      // TR
      ctx.moveTo(cx + cw - arm, cy); ctx.lineTo(cx + cw, cy); ctx.lineTo(cx + cw, cy + arm);
      // BL
      ctx.moveTo(cx, cy + ch - arm); ctx.lineTo(cx, cy + ch); ctx.lineTo(cx + arm, cy + ch);
      // BR
      ctx.moveTo(cx + cw - arm, cy + ch); ctx.lineTo(cx + cw, cy + ch); ctx.lineTo(cx + cw, cy + ch - arm);
      ctx.stroke();
      ctx.restore();
    },

    updateSplitRender: function() {
      if (!StuUltra.splitLine || !StuUltra.beforeCanvas || !StuUltra.loadedBeforeCrop) return;
      var bw = StuUltra.beforeCanvas.width;
      var bh = StuUltra.beforeCanvas.height;
      if (bw <= 0 || bh <= 0) return;

      var src = StuUltra.loadedBeforeCrop;
      var ctx = StuUltra.beforeCanvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, bw, bh);

      if (StuUltra.holdingOriginal) {
        StuUltra.splitLine.classList.add('hidden');
        ctx.drawImage(src.img, src.sx, src.sy, src.sw, src.sh, 0, 0, bw, bh);
        return;
      }

      if (!StuUltra.compareVisible) {
        StuUltra.splitLine.classList.add('hidden');
        return;
      }

      var ratio = StuUltra.splitRatio;
      var splitX = Math.round(bw * ratio);
      StuUltra.splitLine.classList.remove('hidden');
      StuUltra.splitLine.style.left = ((splitX / bw) * 100) + '%';

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, bh);
      ctx.clip();
      ctx.drawImage(src.img, src.sx, src.sy, src.sw, src.sh, 0, 0, bw, bh);
      ctx.restore();
    },

    renderViewport: function(photo) {
      if (!StuUltra.afterCanvas || !StuUltra.beforeCanvas || !photo) return;
      var A = window._devstuA;
      if (A && A.current && A.current !== photo) return;
      var pNow = photo._stuUltraParams || createDefaultParams();
      if (StuUltra.canvasWrap) {
        StuUltra.canvasWrap.classList.toggle('has-transparency', pNow.bgReplaceMode === 'transparent' || pNow.lkBgPreset === 'touming');
      }
      var originalUrl = photo._cachedOriginalDataUrl || photo._cachedPreviewDataUrl;
      var processedUrl = photo.processedDataUrl || originalUrl;
      if (!originalUrl) return;

      var seq = ++StuUltra._renderSeq;
      var beforeImg = new Image();
      var afterImg = new Image();
      var loadedCount = 0;

      var onBothLoaded = function() {
        if (seq !== StuUltra._renderSeq) return;
        var Acur = window._devstuA && window._devstuA.current;
        if (Acur && Acur !== photo) return;
        var bw = beforeImg.naturalWidth || photo._stuUltraWidth || 1000;
        var bh = beforeImg.naturalHeight || photo._stuUltraHeight || 1000;
        var aw = afterImg.naturalWidth || bw;
        var ah = afterImg.naturalHeight || bh;
        if (!bw || !bh) return;

        photo._stuUltraWidth = bw;
        photo._stuUltraHeight = bh;
        var p = photo._stuUltraParams || createDefaultParams();
        var showCropped = hasActiveCropRect(p) && (StuUltra.activeModule !== 'mod-crop' || StuUltra.cropPreviewMode);

        var imgW = showCropped ? Math.max(1, Math.round(p.cropW * bw)) : bw;
        var imgH = showCropped ? Math.max(1, Math.round(p.cropH * bh)) : bh;

        var bsx = showCropped ? Math.max(0, Math.min(bw - 1, p.cropX * bw)) : 0;
        var bsy = showCropped ? Math.max(0, Math.min(bh - 1, p.cropY * bh)) : 0;
        var bsw = showCropped ? Math.max(1, Math.min(bw - bsx, p.cropW * bw)) : bw;
        var bsh = showCropped ? Math.max(1, Math.min(bh - bsy, p.cropH * bh)) : bh;

        var asx = showCropped ? Math.max(0, Math.min(aw - 1, p.cropX * aw)) : 0;
        var asy = showCropped ? Math.max(0, Math.min(ah - 1, p.cropY * ah)) : 0;
        var asw = showCropped ? Math.max(1, Math.min(aw - asx, p.cropW * aw)) : aw;
        var ash = showCropped ? Math.max(1, Math.min(ah - asy, p.cropH * ah)) : ah;

        var vp = StuUltra.viewport;
        var vpStyle = vp ? getComputedStyle(vp) : null;
        var padX = vpStyle ? (parseFloat(vpStyle.paddingLeft) || 0) + (parseFloat(vpStyle.paddingRight) || 0) : 40;
        var padY = vpStyle ? (parseFloat(vpStyle.paddingTop) || 0) + (parseFloat(vpStyle.paddingBottom) || 0) : 120;
        var rawVpW = vp && vp.clientWidth > 0 ? vp.clientWidth - padX : (window.innerWidth - 380);
        var rawVpH = vp && vp.clientHeight > 0 ? vp.clientHeight - padY : (window.innerHeight - 200);
        var maxCssW = Math.max(64, Math.floor(rawVpW));
        var maxCssH = Math.max(64, Math.floor(rawVpH));
        var fitScale = Math.min(maxCssW / imgW, maxCssH / imgH);
        StuUltra.fitScale = fitScale;
        var effScale = StuUltra.zoomScale > 0 ? StuUltra.zoomScale : fitScale;
        var cssW = Math.max(1, Math.round(imgW * effScale));
        var cssH = Math.max(1, Math.round(imgH * effScale));

        var zoomPctEl = document.querySelector('.toolbar .zoom-pct');
        if (zoomPctEl) {
          zoomPctEl.textContent = Math.max(1, Math.round(effScale * 100)) + ' %';
        }

        var dpr = Math.min(window.devicePixelRatio || 1, 3);
        var canvasTargetScale = StuUltra.zoomScale > 0 ? Math.min(fitScale * 2.5, effScale) : effScale;
        var w = Math.max(1, Math.min(4096, Math.round(imgW * canvasTargetScale * dpr)));
        var h = Math.max(1, Math.min(4096, Math.round(imgH * canvasTargetScale * dpr)));

        if (StuUltra.canvasWrap) {
          StuUltra.canvasWrap.style.width = cssW + 'px';
          StuUltra.canvasWrap.style.height = cssH + 'px';
          StuUltra.canvasWrap.style.transform = (StuUltra.zoomScale > 0)
            ? ('translate(' + Math.round(StuUltra.panX) + 'px, ' + Math.round(StuUltra.panY) + 'px)')
            : '';
          StuUltra.canvasWrap.style.cursor = (StuUltra.zoomScale > 0 && StuUltra.zoomScale > fitScale * 1.02) ? 'grab' : '';
          StuUltra.canvasWrap.classList.toggle('has-transparency', p.bgReplaceMode === 'transparent' || p.lkBgPreset === 'touming');
        }

        StuUltra.afterCanvas.width = w; StuUltra.afterCanvas.height = h;
        StuUltra.beforeCanvas.width = w; StuUltra.beforeCanvas.height = h;
        if (StuUltra.overlayCanvas) {
          StuUltra.overlayCanvas.width = w;
          StuUltra.overlayCanvas.height = h;
        }

        var afterCtx = StuUltra.afterCanvas.getContext('2d');
        afterCtx.imageSmoothingEnabled = true;
        afterCtx.imageSmoothingQuality = 'high';
        afterCtx.clearRect(0, 0, w, h);
        afterCtx.drawImage(afterImg, asx, asy, asw, ash, 0, 0, w, h);

        StuUltra.loadedBeforeCrop = { img: beforeImg, sx: bsx, sy: bsy, sw: bsw, sh: bsh };
        StuUltra.updateSplitRender();
        StuUltra.drawCropOverlay(w, h, photo);
      };

      beforeImg.onload = function() {
        loadedCount++;
        if (loadedCount === 2) onBothLoaded();
      };
      afterImg.onload = function() {
        loadedCount++;
        if (loadedCount === 2) onBothLoaded();
      };
      beforeImg.onerror = afterImg.onerror = function() {
        // Fallback if processed image failed
        if (afterImg.src !== originalUrl) {
          afterImg.src = originalUrl;
        }
      };

      beforeImg.src = originalUrl;
      afterImg.src = processedUrl;
    },

    ensureAiAnalysis: function(photo, originalDataUrl) {
      if (!photo) return Promise.resolve({});
      var p = photo._stuUltraParams || (photo._stuUltraParams = createDefaultParams());

      var applyCachedFace = function() {
        if (photo._aiFace && photo._aiFace.faceRx > 0.01 && (!p.face || p.face.faceRx <= 0.01)) {
          p.face = Object.assign({}, photo._aiFace);
        }
      };

      var aiPromise;
      if (photo._aiMaskBase64 && photo._aiMaskSource === originalDataUrl) {
        applyCachedFace();
        aiPromise = Promise.resolve();
      } else if (typeof window.analyzePhotoWithNeuralAI === 'function' && originalDataUrl) {
        aiPromise = new Promise(function(resolve) {
          var img = new Image();
          img.onload = function() {
            window.analyzePhotoWithNeuralAI(img, photo._aiFace || null).then(function(res) {
              if (res) {
                photo._aiFace = res.face;
                photo._aiMaskBase64 = res.maskBase64;
                photo._aiSceneMaskBase64 = res.sceneMaskBase64;
                photo._aiHairBounds = res.hairBounds;
                photo._aiMesh478 = res.mesh478;
                photo._aiLandmarksDetected = res.landmarksDetected;
                photo._aiMaskSource = originalDataUrl;
                if (res.face && res.face.faceRx > 0.01) {
                  p.face = Object.assign({}, res.face);
                }
              }
              resolve();
            }).catch(function() { resolve(); });
          };
          img.onerror = function() { resolve(); };
          img.src = originalDataUrl;
        });
      } else {
        aiPromise = Promise.resolve();
      }

      return aiPromise.then(function() {
        var needMatte = needsHighresMatte(p);
        var hasValidMatte = photo.highresMatteBase64 && photo._matteSourceRef === originalDataUrl;
        if (needMatte && !hasValidMatte && !photo._matteAttempted && originalDataUrl) {
          photo._matteAttempted = true;
          return fetch('/api/extract_highres_matte', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_base64: originalDataUrl, imageBase64: originalDataUrl })
          }).then(function(r) { return r.ok ? r.json() : null; }).then(function(m) {
            if (m && m.matte_data_url) {
              photo.highresMatteBase64 = m.matte_data_url;
              photo._matteSourceRef = originalDataUrl;
            }
          }).catch(function() {});
        }
      }).then(function() {
        var validHighres = (photo.highresMatteBase64 && photo._matteSourceRef === originalDataUrl)
          ? photo.highresMatteBase64 : null;
        var effSceneMask = (needsHighresMatte(p) && validHighres)
          ? validHighres
          : (photo._aiSceneMaskBase64 || validHighres || null);
        var usingHighres = Boolean(effSceneMask && validHighres && effSceneMask === validHighres);
        return {
          maskBase64: photo._aiMaskBase64 || null,
          sceneMaskBase64: effSceneMask,
          isHighresMatte: usingHighres
        };
      });
    },

    triggerRustProcess: function(photo, highQuality) {
      if (!photo) return;
      if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();

      if (StuUltra.isProcessing) {
        StuUltra.pendingProcess = true;
        return;
      }

      StuUltra.isProcessing = true;
      var processSeq = ++StuUltra._processSeq;
      var statusLabel = document.getElementById('stu-ultra-status-label');
      if (statusLabel) statusLabel.textContent = 'Đang phân tích AI & xử lý Rust SIMD...';
      var getSrc = highQuality ? getPhotoOriginalDataUrl : getPhotoPreviewDataUrl;
      getSrc(photo).then(function(srcDataUrl) {
        if (!srcDataUrl) {
          StuUltra.isProcessing = false;
          if (StuUltra.pendingProcess) {
            StuUltra.pendingProcess = false;
            var nextP = (window._devstuA && window._devstuA.current) || photo;
            StuUltra.triggerRustProcess(nextP, false);
          }
          return;
        }

        StuUltra.ensureAiAnalysis(photo, srcDataUrl).then(function(aiInfo) {
          var p = photo._stuUltraParams;
          var sendParams = Object.assign({}, p, {
            isHighresMatte: Boolean(aiInfo && aiInfo.isHighresMatte)
          });

          fetch('/api/process_photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: srcDataUrl,
              params: sendParams,
              highQuality: Boolean(highQuality),
              maskBase64: (aiInfo && aiInfo.maskBase64) || null,
              sceneMaskBase64: (aiInfo && aiInfo.sceneMaskBase64) || null
            })
          }).then(function(res) {
            if (!res.ok) {
              return res.text().then(function(t) {
                throw new Error('HTTP ' + res.status + (t ? ': ' + t.slice(0, 140) : ''));
              });
            }
            return res.json();
          }).then(function(data) {
            if (!data || !data.ok || !data.dataUrl) {
              throw new Error((data && data.error) || 'Rust SIMD trả về lỗi');
            }
            if (data.detectedFace && data.detectedFace.faceRx > 0.01 && (!p.face || p.face.faceRx <= 0.01)) {
              p.face = data.detectedFace;
            }
            return data;
          }).then(function(data) {
            StuUltra.isProcessing = false;
            var A = window._devstuA;
            var Acur = A && A.current;
            if (data && data.ok && data.dataUrl) {
              photo.processedDataUrl = data.dataUrl;
              if (!Acur || Acur === photo) {
                if (statusLabel) {
                  var lmTxt = photo._aiLandmarksDetected ? 'AI 478 điểm ✓' : 'AI Studio ✓';
                  statusLabel.textContent = lmTxt + ' • Rust SIMD • ' + data.elapsedMs + 'ms';
                }
                getPhotoOriginalDataUrl(photo).then(function() {
                  StuUltra.renderViewport(photo);
                });
                StuUltra.renderHistogramFromDataUrl(data.dataUrl);
              }
            } else {
              throw new Error((data && data.error) || 'Rust SIMD trả về lỗi');
            }
            if (StuUltra.pendingProcess) {
              StuUltra.pendingProcess = false;
              var nextPhoto = (window._devstuA && window._devstuA.current) || photo;
              StuUltra.triggerRustProcess(nextPhoto, false);
            }
          }).catch(function(err) {
            StuUltra.isProcessing = false;
            console.error('[STU Ultra] Rust SIMD error:', err);
            if (statusLabel) {
              statusLabel.textContent = 'Lỗi Rust SIMD: ' + (err.message || err);
            }
            if (StuUltra.pendingProcess) {
              StuUltra.pendingProcess = false;
              var nextErrPhoto = (window._devstuA && window._devstuA.current) || photo;
              StuUltra.triggerRustProcess(nextErrPhoto, false);
            }
          });
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
      StuUltra.syncAllControlsUI(photo);
      StuUltra.triggerRustProcess(photo, false);
      if (typeof window.tt === 'function') {
        window.tt('Đã áp dụng cài sẵn ' + presetKey + ' qua Rust SIMD ✓', 3000);
      }
    },

    getPhotoDims: function(photo) {
      return {
        imgW: Math.max(1, (photo && photo._stuUltraWidth) || (StuUltra.afterCanvas && StuUltra.afterCanvas.width) || 1000),
        imgH: Math.max(1, (photo && photo._stuUltraHeight) || (StuUltra.afterCanvas && StuUltra.afterCanvas.height) || 1000)
      };
    },

    fitCropBoxToAspect: function(photo, targetRatio, anchor) {
      if (!photo) return;
      var p = photo._stuUltraParams || (photo._stuUltraParams = createDefaultParams());
      if (!targetRatio || targetRatio <= 0) {
        p.cropX = 0; p.cropY = 0; p.cropW = 1; p.cropH = 1;
        return;
      }
      var dims = StuUltra.getPhotoDims(photo);
      var srcRatio = dims.imgW / dims.imgH;
      var nw, nh;
      if (srcRatio > targetRatio) {
        nh = 1;
        nw = clamp01((dims.imgH * targetRatio) / dims.imgW);
      } else {
        nw = 1;
        nh = clamp01(dims.imgW / (dims.imgH * targetRatio));
      }
      var f = p.face;
      var hasFace = Boolean(f && f.faceRy > 0.01);
      var cx = anchor ? anchor.x : (hasFace ? f.centerX : 0.5);
      var cy = anchor ? anchor.y : (hasFace ? Math.max(0.25, Math.min(0.75, f.centerY + f.faceRy * 0.35)) : 0.5);
      p.cropW = Math.max(0.04, nw);
      p.cropH = Math.max(0.04, nh);
      p.cropX = Math.max(0, Math.min(1 - p.cropW, cx - p.cropW * 0.5));
      p.cropY = Math.max(0, Math.min(1 - p.cropH, cy - p.cropH * 0.44));
    },

    applyIdPhotoPreset: function(photo, idPreset, cmW, cmH, refit) {
      if (!photo || !(cmW > 0) || !(cmH > 0)) return;
      var p = photo._stuUltraParams || (photo._stuUltraParams = createDefaultParams());
      var dpiEl = document.getElementById('crop-dpi-in');
      var dpi = Math.max(72, Math.min(1200, Math.round(parseFloat((dpiEl && dpiEl.value) || p.cropDpi || 300))));
      var pxW = Math.max(1, Math.round((cmW / 2.54) * dpi));
      var pxH = Math.max(1, Math.round((cmH / 2.54) * dpi));
      p.cropPreset = idPreset;
      p.cropDpi = dpi;
      p.cropCustomW = pxW;
      p.cropCustomH = pxH;
      p.cropAspectW = pxW;
      p.cropAspectH = pxH;
      if (refit !== false) StuUltra.fitCropBoxToAspect(photo, pxW / pxH);
    },

    applyCustomDimInputs: function(photo, refit) {
      if (!photo) return;
      var p = photo._stuUltraParams || (photo._stuUltraParams = createDefaultParams());
      var unitEl = document.getElementById('crop-dim-unit');
      var dpiEl = document.getElementById('crop-dpi-in');
      var cwEl = document.getElementById('crop-custom-w-in');
      var chEl = document.getElementById('crop-custom-h-in');
      var unit = (unitEl && unitEl.value) || p.cropDimUnit || 'px';
      var dpi = Math.max(72, Math.min(1200, Math.round(parseFloat((dpiEl && dpiEl.value) || p.cropDpi || 300))));
      var rawW = parseFloat((cwEl && cwEl.value) || '');
      var rawH = parseFloat((chEl && chEl.value) || '');
      p.cropDimUnit = unit;
      p.cropDpi = dpi;
      var toPx = function(val) {
        if (!(val > 0)) return 0;
        if (unit === 'cm') return Math.max(1, Math.round((val / 2.54) * dpi));
        if (unit === 'mm') return Math.max(1, Math.round((val / 25.4) * dpi));
        return Math.max(1, Math.round(val));
      };
      var pxW = toPx(rawW);
      var pxH = toPx(rawH);
      if (pxW > 0 && pxH > 0) {
        p.cropCustomW = pxW; p.cropCustomH = pxH;
        p.cropAspectW = pxW; p.cropAspectH = pxH;
        if (refit !== false) StuUltra.fitCropBoxToAspect(photo, pxW / pxH);
      } else {
        p.cropCustomW = 0; p.cropCustomH = 0;
        p.cropAspectW = 0; p.cropAspectH = 0;
      }
    },

    rotateActivePhoto90: function(clockwise) {
      var A = window._devstuA;
      var photo = A && A.current;
      if (!photo) return;
      getPhotoOriginalDataUrl(photo).then(function(origUrl) {
        if (!origUrl) return;
        var img = new Image();
        img.onload = function() {
          var sw = img.naturalWidth || 800;
          var sh = img.naturalHeight || 1000;
          var c = document.createElement('canvas');
          c.width = sh; c.height = sw;
          var ctx = c.getContext('2d');
          ctx.translate(sh * 0.5, sw * 0.5);
          ctx.rotate(clockwise ? Math.PI * 0.5 : -Math.PI * 0.5);
          ctx.drawImage(img, -sw * 0.5, -sh * 0.5, sw, sh);
          var rotUrl = c.toDataURL('image/jpeg', 0.95);
          photo._stuRotatedDataUrl = rotUrl;
          photo._cachedOriginalDataUrl = rotUrl;
          photo._cachedPreviewDataUrl = rotUrl;
          photo._stuUltraWidth = sh;
          photo._stuUltraHeight = sw;
          photo._aiMaskBase64 = null;
          photo._aiSceneMaskBase64 = null;
          photo._aiFace = null;
          photo.highresMatteBase64 = null;
          photo._matteAttempted = false;
          var p = photo._stuUltraParams || (photo._stuUltraParams = createDefaultParams());
          p.cropX = 0; p.cropY = 0; p.cropW = 1; p.cropH = 1;
          p.face = Object.assign({}, DEFAULT_PARAMS.face);
          StuUltra.syncAllControlsUI(photo);
          StuUltra.triggerRustProcess(photo, false);
        };
        img.src = origUrl;
      });
    },

    applyCropAlignAI: function(photo, mode) {
      if (!photo) return;
      var p = photo._stuUltraParams || (photo._stuUltraParams = createDefaultParams());
      var dims = StuUltra.getPhotoDims(photo);
      var f = p.face || {};
      var lockedRatio = (p.cropAspectW > 0.01 && p.cropAspectH > 0.01) ? (p.cropAspectW / p.cropAspectH) : 0;
      var effRatio = lockedRatio > 0 ? lockedRatio : (hasActiveCropRect(p) ? (p.cropW * dims.imgW) / (p.cropH * dims.imgH) : (dims.imgW / dims.imgH));
      var normRatio = effRatio * (dims.imgH / dims.imgW);
      var needReprocess = false;

      if (mode === 'auto_straighten') {
        var dx = ((f.rightEyeX || 0.57) - (f.leftEyeX || 0.43)) * dims.imgW;
        var dy = ((f.rightEyeY || 0.38) - (f.leftEyeY || 0.38)) * dims.imgH;
        var tilt = (Math.hypot(dx, dy) >= 8 && photo._aiLandmarksDetected)
          ? Math.max(-45, Math.min(45, Math.round(((-Math.atan2(dy, dx) * 180) / Math.PI) * 10) / 10))
          : 0;
        p.rotateAngle = tilt;
        needReprocess = true;
      } else if (mode === 'eye') {
        p.cropAlignEye = true; p.cropAlignVertical = false;
        var eyeMidX = ((f.leftEyeX || 0.43) + (f.rightEyeX || 0.57)) * 0.5;
        var eyeMidY = ((f.leftEyeY || 0.38) + (f.rightEyeY || 0.38)) * 0.5;
        var cw = Math.max(0.25, Math.min(1, lockedRatio > 0 ? p.cropW : 0.92));
        var ch = cw / normRatio;
        if (ch > 1) { ch = 1; cw = ch * normRatio; }
        p.cropW = cw; p.cropH = ch;
        p.cropX = Math.max(0, Math.min(1 - cw, eyeMidX - cw * 0.5));
        p.cropY = Math.max(0, Math.min(1 - ch, eyeMidY - ch * 0.34));
      } else if (mode === 'vertical' || mode === 'subject') {
        if (mode === 'vertical') { p.cropAlignVertical = true; p.cropAlignEye = false; }
        var rx = f.faceRx || 0.18, ry = f.faceRy || 0.24;
        var cx = f.centerX || 0.5;
        var headTop = Math.max(0, (f.centerY || 0.42) - ry * 1.65);
        var desiredH = Math.min(1, ry * 5.4);
        var desiredW = desiredH * normRatio;
        if (desiredW > 1) { desiredW = 1; desiredH = desiredW / normRatio; }
        p.cropW = Math.max(0.18, desiredW);
        p.cropH = Math.max(0.18, desiredH);
        p.cropX = Math.max(0, Math.min(1 - p.cropW, cx - p.cropW * 0.5));
        p.cropY = Math.max(0, Math.min(1 - p.cropH, headTop - 0.04));
      } else if (mode === 'headshot' || mode === 'waist' || mode === 'full') {
        var fy = f.faceRy || 0.16;
        var fcx = f.centerX || 0.5;
        var fTop = Math.max(0, (f.centerY || 0.35) - fy * 1.65);
        var targetSpanH = mode === 'headshot' ? fy * 4.4 : (mode === 'waist' ? fy * 7.6 : 0.92);
        var mch = Math.max(0.22, Math.min(1, targetSpanH));
        var mcw = mch * normRatio;
        if (mcw > 1) { mcw = 1; mch = mcw / normRatio; }
        p.cropW = mcw; p.cropH = mch;
        p.cropX = Math.max(0, Math.min(1 - mcw, fcx - mcw * 0.5));
        p.cropY = Math.max(0, Math.min(1 - mch, fTop - mch * 0.08));
      }

      StuUltra.syncAllControlsUI(photo);
      if (needReprocess) {
        StuUltra.triggerRustProcess(photo, false);
      } else {
        StuUltra.renderViewport(photo);
      }
    },

    onModeChange: function() {
      var A = window._devstuA;
      var isUltra = Boolean(A && A.mode === 'stu_ultra');
      var isMax = Boolean(A && A.mode === 'stu_ultra_max');
      var app = document.getElementById('app');
      if (app) {
        app.classList.toggle('app-stu-ultra', isUltra);
      }
      var ultraBtn = document.querySelector('.mode-stu-ultra');
      if (ultraBtn) {
        ultraBtn.setAttribute('aria-pressed', String(isUltra));
      }
      var maxBtn = document.querySelector('.mode-stu-ultra-max');
      if (maxBtn) {
        maxBtn.setAttribute('aria-pressed', String(isMax));
      }

      if (isUltra) {
        var cont = StuUltra.container;
        if (cont) {
          var targetMod = StuUltra.activeModule || 'mod-portrait';
          var targetBtn = cont.querySelector('.rail-icon-btn[data-mod="' + targetMod + '"]');
          if (targetBtn && !targetBtn.classList.contains('active')) {
            targetBtn.click();
          }
        }
        StuUltra.zoomScale = 0;
        StuUltra.panX = 0;
        StuUltra.panY = 0;
        StuUltra.initViewport();
        StuUltra.syncCurrentPhoto();
        var photo = A && A.current;
        if (photo) {
          StuUltra.triggerRustProcess(photo, false);
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
          if (A && A.current) StuUltra.renderViewport(A.current);
        });
      });

      // 2. Accordions (ignore interactive buttons in accordion header)
      cont.querySelectorAll('.retouch-acc-title').forEach(function(title) {
        title.addEventListener('click', function(e) {
          if (e.target && e.target.closest && e.target.closest('button')) return;
          var group = title.closest('.retouch-acc-group');
          if (group) group.classList.toggle('collapsed');
        });
      });

      // 3. Histogram Toggle & Realtime Switch
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

      // 4. All Select Dropdowns (Color LUT, Treatment, Lip Tint, Bg Selects)
      ['lutPreset', 'treatment', 'makeupLipTint'].concat(BG_SELECT_IDS).forEach(function(selId) {
        var sel = cont.querySelector('#' + selId);
        if (!sel) return;
        sel.addEventListener('change', function(e) {
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          photo._stuUltraParams[selId] = e.target.value;
          if (BG_SELECT_IDS.indexOf(selId) !== -1) {
            StuUltra.syncBgControlsUI(photo._stuUltraParams);
          }
          StuUltra.triggerRustProcess(photo, false);
        });
      });

      // 4b. Interactive 256-LUT Tone Curve + Reset
      var curveCanvas = cont.querySelector('#tone-curve-canvas');
      if (curveCanvas) {
        curveCanvas.addEventListener('mousedown', function(e) {
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          var rect = curveCanvas.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return;
          var nx = clamp01((e.clientX - rect.left) / rect.width);
          var ny = clamp01(1 - (e.clientY - rect.top) / rect.height);
          var pts = getPhotoCurvePoints(photo);
          var hitIdx = -1;
          for (var i = 0; i < pts.length; i++) {
            if (Math.hypot(pts[i].x - nx, pts[i].y - ny) < 0.06) {
              hitIdx = i; break;
            }
          }
          if (hitIdx === -1) {
            pts.push({ x: nx, y: ny });
            pts.sort(function(a, b) { return a.x - b.x; });
            hitIdx = pts.findIndex(function(pt) { return Math.abs(pt.x - nx) < 1e-4 && Math.abs(pt.y - ny) < 1e-4; });
          }
          StuUltra.draggingCurveIdx = hitIdx;
          photo._stuUltraParams.curveLut = build256CurveLutFromPoints(pts);
          StuUltra.renderToneCurve();
          StuUltra.triggerRustProcess(photo, false);
        });

        curveCanvas.addEventListener('dblclick', function(e) {
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          var rect = curveCanvas.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return;
          var nx = clamp01((e.clientX - rect.left) / rect.width);
          var ny = clamp01(1 - (e.clientY - rect.top) / rect.height);
          var pts = getPhotoCurvePoints(photo);
          for (var i = 1; i < pts.length - 1; i++) {
            if (Math.hypot(pts[i].x - nx, pts[i].y - ny) < 0.07) {
              pts.splice(i, 1);
              photo._stuUltraParams.curveLut = build256CurveLutFromPoints(pts);
              StuUltra.renderToneCurve();
              StuUltra.triggerRustProcess(photo, false);
              break;
            }
          }
        });
      }

      var btnResetCurve = cont.querySelector('#btn-reset-curve');
      if (btnResetCurve) {
        btnResetCurve.addEventListener('click', function() {
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          photo._stuCurvePoints = [
            { x: 0, y: 0 }, { x: 0.25, y: 0.25 }, { x: 0.5, y: 0.5 }, { x: 0.75, y: 0.75 }, { x: 1, y: 1 }
          ];
          photo._stuUltraParams.curveLut = [];
          StuUltra.renderToneCurve();
          StuUltra.triggerRustProcess(photo, false);
        });
      }

      // 4c. AI Color Match Reference Upload / Clear
      var refColorIn = cont.querySelector('#ref-color-input');
      var btnLoadColorRef = cont.querySelector('#btn-load-color-ref');
      if (btnLoadColorRef && refColorIn) {
        btnLoadColorRef.addEventListener('click', function() { refColorIn.click(); });
        refColorIn.addEventListener('change', function(e) {
          var file = e.target.files && e.target.files[0];
          var A = window._devstuA;
          var photo = A && A.current;
          if (!file || !photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          var reader = new FileReader();
          reader.onload = function() {
            var imgEl = new Image();
            imgEl.onload = function() {
              photo._stuUltraParams.colorMatchStats = computeColorMatchStatsFromImage(imgEl);
              if (photo._stuUltraParams.colorMatchStrength === 0) {
                photo._stuUltraParams.colorMatchStrength = 65;
              }
              StuUltra.syncSlidersFromParams(photo._stuUltraParams);
              StuUltra.triggerRustProcess(photo, false);
              if (typeof window.tt === 'function') window.tt('Đã trích xuất bảng màu tham chiếu ✓', 2500);
            };
            imgEl.src = reader.result;
          };
          reader.readAsDataURL(file);
          refColorIn.value = '';
        });
      }
      var btnClearColorRef = cont.querySelector('#btn-clear-color-ref');
      if (btnClearColorRef) {
        btnClearColorRef.addEventListener('click', function() {
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          photo._stuUltraParams.colorMatchStats = [];
          photo._stuUltraParams.colorMatchStrength = 0;
          StuUltra.syncSlidersFromParams(photo._stuUltraParams);
          StuUltra.triggerRustProcess(photo, false);
        });
      }

      // 4d. HSL 8 Dots
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

      // 5. Sub-drawers (Hair & Clothing)
      var bindDrawerToggle = function(btnId, drawerId) {
        var btn = cont.querySelector('#' + btnId);
        var drawer = cont.querySelector('#' + drawerId);
        if (btn && drawer) {
          btn.addEventListener('click', function() {
            var willOpen = drawer.classList.contains('hidden');
            drawer.classList.toggle('hidden', !willOpen);
            btn.setAttribute('aria-expanded', String(willOpen));
          });
        }
      };
      bindDrawerToggle('btn-cloth-sweat-expand', 'cloth-sweat-drawer');
      bindDrawerToggle('btn-cloth-edge-expand', 'cloth-edge-drawer');
      bindDrawerToggle('btn-cloth-ailab-moire', 'cloth-ailab-moire-drawer');
      bindDrawerToggle('btn-hair-stray-expand', 'hair-stray-drawer');
      bindDrawerToggle('btn-hair-smooth-expand', 'hair-smooth-drawer');

      // 5b. Clothing Actions
      cont.querySelectorAll('.cloth-target-pill').forEach(function(pill) {
        pill.addEventListener('click', function() {
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          photo._stuUltraParams.clothingTarget = pill.dataset.clothtarget || 'all';
          StuUltra.syncClothingControlsUI(photo._stuUltraParams);
          StuUltra.triggerRustProcess(photo, false);
        });
      });

      var clothLinkBtn = cont.querySelector('#btn-cloth-wrinkle-link');
      if (clothLinkBtn) {
        clothLinkBtn.addEventListener('click', function() {
          StuUltra.clothWrinkleLinked = !StuUltra.clothWrinkleLinked;
          var A = window._devstuA;
          StuUltra.syncClothingControlsUI((A && A.current && A.current._stuUltraParams) || createDefaultParams());
        });
      }

      var clothResetBtn = cont.querySelector('#btn-clothing-reset');
      if (clothResetBtn) {
        clothResetBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          var keys = [
            'clothingTarget', 'clothingDewrinkle', 'clothingSmallWrinkles', 'clothingLargeWrinkles',
            'clothingLintClean', 'clothingSweatStain', 'clothingSweatEvenness',
            'clothingEdgeSmooth', 'clothingEdgeRefine', 'clothingMoireRemove'
          ];
          keys.forEach(function(k) { photo._stuUltraParams[k] = DEFAULT_PARAMS[k]; });
          StuUltra.syncAllControlsUI(photo);
          StuUltra.triggerRustProcess(photo, false);
        });
      }

      var tryMoireBtn = cont.querySelector('#btn-cloth-try-moire');
      if (tryMoireBtn) {
        tryMoireBtn.addEventListener('click', function() {
          var aiBtn = cont.querySelector('#btn-cloth-ailab-moire');
          var drawer = cont.querySelector('#cloth-ailab-moire-drawer');
          if (drawer) {
            drawer.classList.remove('hidden');
            if (aiBtn) aiBtn.setAttribute('aria-expanded', 'true');
          }
          var A = window._devstuA;
          var photo = A && A.current;
          if (photo) {
            if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
            if (!(photo._stuUltraParams.clothingMoireRemove > 0)) {
              photo._stuUltraParams.clothingMoireRemove = 45;
              StuUltra.syncSlidersFromParams(photo._stuUltraParams);
              StuUltra.triggerRustProcess(photo, false);
            }
          }
        });
      }

      // 6. Crop Sub-Tabs, Ratio Menu, ID Chips, Custom Dim/Ratio, Orientation, Preview/Apply/Reset, AI Align, Rotate/Flip
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

      var ratioBtn = cont.querySelector('#crop-ratio-btn');
      var ratioMenu = cont.querySelector('#crop-ratio-menu');
      if (ratioBtn && ratioMenu) {
        ratioBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          var isHidden = ratioMenu.classList.toggle('hidden');
          ratioBtn.setAttribute('aria-expanded', String(!isHidden));
        });
        cont.querySelectorAll('.crop-ratio-opt').forEach(function(opt) {
          opt.addEventListener('click', function(e) {
            e.stopPropagation();
            ratioMenu.classList.add('hidden');
            ratioBtn.setAttribute('aria-expanded', 'false');
            var A = window._devstuA;
            var photo = A && A.current;
            if (!photo) return;
            var p = photo._stuUltraParams || (photo._stuUltraParams = createDefaultParams());
            var preset = opt.dataset.preset || 'original';
            var aw = parseFloat(opt.dataset.aw || '0');
            var ah = parseFloat(opt.dataset.ah || '0');
            var dims = StuUltra.getPhotoDims(photo);

            if (preset === 'original') {
              p.cropPreset = 'original'; p.cropAspectW = 0; p.cropAspectH = 0; p.cropCustomW = 0; p.cropCustomH = 0;
              StuUltra.fitCropBoxToAspect(photo, 0);
            } else if (preset === 'as_shot') {
              p.cropPreset = 'as_shot'; p.cropAspectW = dims.imgW; p.cropAspectH = dims.imgH; p.cropCustomW = 0; p.cropCustomH = 0;
              StuUltra.fitCropBoxToAspect(photo, dims.imgW / dims.imgH);
            } else if (preset === 'fixed') {
              var curW = Math.max(1, Math.round((p.cropW != null ? p.cropW : 1) * dims.imgW));
              var curH = Math.max(1, Math.round((p.cropH != null ? p.cropH : 1) * dims.imgH));
              p.cropPreset = 'fixed'; p.cropAspectW = curW; p.cropAspectH = curH; p.cropCustomW = 0; p.cropCustomH = 0;
            } else if (preset === 'custom_ratio') {
              var rwIn = cont.querySelector('#crop-ratio-w-in');
              var rhIn = cont.querySelector('#crop-ratio-h-in');
              var rw = parseFloat((rwIn && rwIn.value) || '') || (p.cropAspectW > 0 ? p.cropAspectW : 4);
              var rh = parseFloat((rhIn && rhIn.value) || '') || (p.cropAspectH > 0 ? p.cropAspectH : 5);
              if (rwIn && !(parseFloat(rwIn.value) > 0)) rwIn.value = String(rw);
              if (rhIn && !(parseFloat(rhIn.value) > 0)) rhIn.value = String(rh);
              p.cropPreset = 'custom_ratio'; p.cropAspectW = rw; p.cropAspectH = rh; p.cropCustomW = 0; p.cropCustomH = 0;
              StuUltra.fitCropBoxToAspect(photo, rw / rh);
            } else if (preset === 'custom_dim') {
              p.cropPreset = 'custom_dim';
              StuUltra.applyCustomDimInputs(photo, true);
            } else if (preset === 'id_photo') {
              var curChip = p.cropPreset && p.cropPreset.indexOf('id_') === 0
                ? cont.querySelector('.crop-id-chip[data-idpreset="' + p.cropPreset + '"]')
                : cont.querySelector('.crop-id-chip[data-idpreset="id_3x4"]');
              StuUltra.applyIdPhotoPreset(photo,
                (curChip && curChip.dataset.idpreset) || 'id_3x4',
                parseFloat((curChip && curChip.dataset.cmw) || '3'),
                parseFloat((curChip && curChip.dataset.cmh) || '4'), true);
            } else if (aw > 0 && ah > 0) {
              p.cropPreset = preset; p.cropAspectW = aw; p.cropAspectH = ah; p.cropCustomW = 0; p.cropCustomH = 0;
              StuUltra.fitCropBoxToAspect(photo, aw / ah);
            }

            StuUltra.cropPreviewMode = false;
            StuUltra.syncCropControlsUI(photo);
            StuUltra.renderViewport(photo);
          });
        });
        document.addEventListener('click', function(e) {
          if (!ratioMenu.classList.contains('hidden') && (!e.target || !e.target.closest || !e.target.closest('.crop-ratio-wrap'))) {
            ratioMenu.classList.add('hidden');
            ratioBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }

      var handleCustomRatioInput = function() {
        var A = window._devstuA;
        var photo = A && A.current;
        if (!photo) return;
        var rw = parseFloat((cont.querySelector('#crop-ratio-w-in') || {}).value || '');
        var rh = parseFloat((cont.querySelector('#crop-ratio-h-in') || {}).value || '');
        if (rw > 0 && rh > 0) {
          var p = photo._stuUltraParams || (photo._stuUltraParams = createDefaultParams());
          p.cropPreset = 'custom_ratio'; p.cropAspectW = rw; p.cropAspectH = rh; p.cropCustomW = 0; p.cropCustomH = 0;
          StuUltra.fitCropBoxToAspect(photo, rw / rh);
          StuUltra.cropPreviewMode = false;
          StuUltra.syncCropControlsUI(photo);
          StuUltra.renderViewport(photo);
        }
      };
      cont.querySelector('#crop-ratio-w-in')?.addEventListener('input', handleCustomRatioInput);
      cont.querySelector('#crop-ratio-h-in')?.addEventListener('input', handleCustomRatioInput);
      cont.querySelector('#btn-crop-swap-ratio')?.addEventListener('click', function() {
        var rwIn = cont.querySelector('#crop-ratio-w-in');
        var rhIn = cont.querySelector('#crop-ratio-h-in');
        if (rwIn && rhIn) { var tmp = rwIn.value; rwIn.value = rhIn.value; rhIn.value = tmp; }
        handleCustomRatioInput();
      });

      var handleCustomDimOrDpi = function(refit) {
        var A = window._devstuA;
        var photo = A && A.current;
        if (!photo) return;
        var p = photo._stuUltraParams || (photo._stuUltraParams = createDefaultParams());
        if (p.cropPreset && p.cropPreset.indexOf('id_') === 0) {
          var activeChip = cont.querySelector('.crop-id-chip[data-idpreset="' + p.cropPreset + '"]');
          if (activeChip) {
            StuUltra.applyIdPhotoPreset(photo, p.cropPreset, parseFloat(activeChip.dataset.cmw || '3'), parseFloat(activeChip.dataset.cmh || '4'), false);
          }
        } else if (p.cropPreset === 'custom_dim') {
          StuUltra.applyCustomDimInputs(photo, refit);
        } else {
          var dpi = parseFloat((cont.querySelector('#crop-dpi-in') || {}).value || '');
          if (dpi >= 72 && dpi <= 1200) p.cropDpi = Math.round(dpi);
          var unit = (cont.querySelector('#crop-dim-unit') || {}).value;
          if (unit) p.cropDimUnit = unit;
        }
        StuUltra.syncCropControlsUI(photo);
        StuUltra.renderViewport(photo);
      };
      cont.querySelector('#crop-custom-w-in')?.addEventListener('input', function() { handleCustomDimOrDpi(true); });
      cont.querySelector('#crop-custom-h-in')?.addEventListener('input', function() { handleCustomDimOrDpi(true); });
      cont.querySelector('#crop-dim-unit')?.addEventListener('change', function() { handleCustomDimOrDpi(true); });
      cont.querySelector('#crop-dpi-in')?.addEventListener('input', function() { handleCustomDimOrDpi(false); });
      cont.querySelector('#btn-crop-swap-dim')?.addEventListener('click', function() {
        var cwIn = cont.querySelector('#crop-custom-w-in');
        var chIn = cont.querySelector('#crop-custom-h-in');
        if (cwIn && chIn) { var t = cwIn.value; cwIn.value = chIn.value; chIn.value = t; }
        handleCustomDimOrDpi(true);
      });

      cont.querySelectorAll('.crop-id-chip').forEach(function(chip) {
        chip.addEventListener('click', function() {
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          StuUltra.applyIdPhotoPreset(photo, chip.dataset.idpreset || 'id_3x4',
            parseFloat(chip.dataset.cmw || '3'), parseFloat(chip.dataset.cmh || '4'), true);
          StuUltra.cropPreviewMode = false;
          StuUltra.syncCropControlsUI(photo);
          StuUltra.renderViewport(photo);
        });
      });

      cont.querySelector('#btn-crop-orient')?.addEventListener('click', function() {
        var A = window._devstuA;
        var photo = A && A.current;
        if (!photo) return;
        var p = photo._stuUltraParams || (photo._stuUltraParams = createDefaultParams());
        var dims = StuUltra.getPhotoDims(photo);
        if (p.cropAspectW > 0 && p.cropAspectH > 0) { var t = p.cropAspectW; p.cropAspectW = p.cropAspectH; p.cropAspectH = t; }
        if (p.cropCustomW > 0 && p.cropCustomH > 0) { var tc = p.cropCustomW; p.cropCustomW = p.cropCustomH; p.cropCustomH = tc; }
        var curRatio = (p.cropAspectW > 0 && p.cropAspectH > 0) ? (p.cropAspectW / p.cropAspectH) : ((Math.max(1, p.cropH * dims.imgH)) / Math.max(1, p.cropW * dims.imgW));
        StuUltra.fitCropBoxToAspect(photo, curRatio, {
          x: (p.cropX || 0) + (p.cropW != null ? p.cropW : 1) * 0.5,
          y: (p.cropY || 0) + (p.cropH != null ? p.cropH : 1) * 0.44
        });
        StuUltra.syncCropControlsUI(photo);
        StuUltra.renderViewport(photo);
      });

      cont.querySelector('#btn-crop-preview-toggle')?.addEventListener('click', function() {
        var A = window._devstuA;
        var photo = A && A.current;
        if (!photo) return;
        StuUltra.cropPreviewMode = !StuUltra.cropPreviewMode;
        StuUltra.syncCropControlsUI(photo);
        StuUltra.renderViewport(photo);
      });

      cont.querySelector('#btn-crop-apply')?.addEventListener('click', function() {
        var A = window._devstuA;
        var photo = A && A.current;
        if (!photo) return;
        StuUltra.cropPreviewMode = true;
        StuUltra.syncCropControlsUI(photo);
        StuUltra.renderViewport(photo);
        if (typeof window.tt === 'function') window.tt('Đã áp dụng vùng cắt trên xem trước ✓', 2500);
      });

      var handleResetCrop = function() {
        var A = window._devstuA;
        var photo = A && A.current;
        if (!photo) return;
        var p = photo._stuUltraParams || (photo._stuUltraParams = createDefaultParams());
        var hadRotate = Math.abs(p.rotateAngle || 0) > 1e-4;
        p.cropX = 0; p.cropY = 0; p.cropW = 1; p.cropH = 1;
        p.cropPreset = 'original'; p.cropAspectW = 0; p.cropAspectH = 0; p.cropCustomW = 0; p.cropCustomH = 0;
        p.cropAiSubject = false; p.cropAlignVertical = false; p.cropAlignEye = false; p.rotateAngle = 0;
        StuUltra.cropPreviewMode = false;
        cont.querySelectorAll('.crop-frame-chip').forEach(function(c) { c.classList.remove('active'); });
        StuUltra.syncAllControlsUI(photo);
        if (hadRotate) StuUltra.triggerRustProcess(photo, false);
        else StuUltra.renderViewport(photo);
      };
      cont.querySelector('#btn-crop-reset')?.addEventListener('click', handleResetCrop);
      cont.querySelector('#btn-crop-reset-btn')?.addEventListener('click', handleResetCrop);

      cont.querySelector('#crop-show-grid')?.addEventListener('change', function(e) {
        var A = window._devstuA;
        var photo = A && A.current;
        if (!photo) return;
        if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
        photo._stuUltraParams.cropShowGrid = Boolean(e.target.checked);
        if (StuUltra.overlayCanvas && StuUltra.overlayCanvas.width) {
          StuUltra.drawCropOverlay(StuUltra.overlayCanvas.width, StuUltra.overlayCanvas.height, photo);
        }
      });

      cont.querySelector('#crop-ai-tab-subject')?.addEventListener('click', function() {
        cont.querySelector('#crop-ai-tab-subject')?.classList.add('active');
        cont.querySelector('#crop-ai-tab-head')?.classList.remove('active');
        cont.querySelector('#crop-ai-subject-panel')?.classList.remove('hidden');
        cont.querySelector('#crop-ai-head-panel')?.classList.add('hidden');
      });
      cont.querySelector('#crop-ai-tab-head')?.addEventListener('click', function() {
        cont.querySelector('#crop-ai-tab-head')?.classList.add('active');
        cont.querySelector('#crop-ai-tab-subject')?.classList.remove('active');
        cont.querySelector('#crop-ai-head-panel')?.classList.remove('hidden');
        cont.querySelector('#crop-ai-subject-panel')?.classList.add('hidden');
      });

      cont.querySelector('#toggle-crop-ai-subject')?.addEventListener('click', function() {
        var A = window._devstuA;
        var photo = A && A.current;
        if (!photo) return;
        if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
        photo._stuUltraParams.cropAiSubject = !photo._stuUltraParams.cropAiSubject;
        if (photo._stuUltraParams.cropAiSubject) {
          StuUltra.applyCropAlignAI(photo, 'subject');
        } else {
          StuUltra.syncCropControlsUI(photo);
          StuUltra.renderViewport(photo);
        }
      });
      cont.querySelector('#btn-crop-align-v')?.addEventListener('click', function() {
        var A = window._devstuA; if (A && A.current) StuUltra.applyCropAlignAI(A.current, 'vertical');
      });
      cont.querySelector('#btn-crop-align-eye')?.addEventListener('click', function() {
        var A = window._devstuA; if (A && A.current) StuUltra.applyCropAlignAI(A.current, 'eye');
      });
      cont.querySelectorAll('.crop-frame-chip').forEach(function(chip) {
        chip.addEventListener('click', function() {
          var A = window._devstuA; if (!A || !A.current) return;
          cont.querySelectorAll('.crop-frame-chip').forEach(function(c) { c.classList.remove('active'); });
          chip.classList.add('active');
          StuUltra.applyCropAlignAI(A.current, chip.dataset.frame || 'headshot');
        });
      });

      cont.querySelector('#btn-crop-rot-left')?.addEventListener('click', function() { StuUltra.rotateActivePhoto90(false); });
      cont.querySelector('#btn-crop-rot-right')?.addEventListener('click', function() { StuUltra.rotateActivePhoto90(true); });
      cont.querySelector('#btn-flip-v')?.addEventListener('click', function() {
        var A = window._devstuA; var photo = A && A.current; if (!photo) return;
        if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
        photo._stuUltraParams.flipVertical = !photo._stuUltraParams.flipVertical;
        StuUltra.syncCropControlsUI(photo);
        StuUltra.triggerRustProcess(photo, false);
      });
      cont.querySelector('#btn-flip-h')?.addEventListener('click', function() {
        var A = window._devstuA; var photo = A && A.current; if (!photo) return;
        if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
        photo._stuUltraParams.flipHorizontal = !photo._stuUltraParams.flipHorizontal;
        StuUltra.syncCropControlsUI(photo);
        StuUltra.triggerRustProcess(photo, false);
      });
      cont.querySelector('#btn-ai-auto-straighten')?.addEventListener('click', function() {
        var A = window._devstuA; if (A && A.current) StuUltra.applyCropAlignAI(A.current, 'auto_straighten');
      });

      // 7. Background Controls (Switches, Custom Solid Color, Custom Image Upload, Filters, Shadows, LK Magic Pro)
      BG_SWITCH_KEYS.forEach(function(swId) {
        cont.querySelector('#' + swId)?.addEventListener('click', function() {
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          photo._stuUltraParams[swId] = !Boolean(photo._stuUltraParams[swId]);
          StuUltra.syncBgControlsUI(photo._stuUltraParams);
          StuUltra.triggerRustProcess(photo, false);
        });
      });

      var handleCustomColorPick = function(e) {
        var A = window._devstuA;
        var photo = A && A.current;
        if (!photo) return;
        if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
        photo._stuUltraParams.bgCustomColor = e.target.value;
        photo._stuUltraParams.bgReplaceMode = 'custom_color';
        StuUltra.syncBgControlsUI(photo._stuUltraParams);
        StuUltra.triggerRustProcess(photo, false);
      };
      cont.querySelector('#bgCustomColor')?.addEventListener('input', handleCustomColorPick);
      cont.querySelector('#bgCustomColor')?.addEventListener('change', handleCustomColorPick);

      cont.querySelectorAll('.bg-color-dot').forEach(function(dot) {
        dot.addEventListener('click', function() {
          var A = window._devstuA;
          var photo = A && A.current;
          var hex = dot.dataset.color;
          if (!photo || !hex) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          photo._stuUltraParams.bgCustomColor = hex;
          photo._stuUltraParams.bgReplaceMode = 'custom_color';
          StuUltra.syncBgControlsUI(photo._stuUltraParams);
          StuUltra.triggerRustProcess(photo, false);
        });
      });

      var customBgInput = cont.querySelector('#bg-custom-file-input');
      cont.querySelector('#btn-upload-custom-bg')?.addEventListener('click', function() {
        if (customBgInput) customBgInput.click();
      });
      if (customBgInput) {
        customBgInput.addEventListener('change', function(e) {
          var files = Array.prototype.slice.call(e.target.files || []);
          var A = window._devstuA;
          var photo = A && A.current;
          if (!files.length || !photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          var pending = files.length;
          files.forEach(function(file, idx) {
            var reader = new FileReader();
            reader.onload = function() {
              var bgImg = new Image();
              bgImg.onload = function() {
                var maxDim = 2048;
                var sc = Math.min(1, maxDim / Math.max(bgImg.naturalWidth || 1, bgImg.naturalHeight || 1));
                var bw = Math.max(1, Math.round((bgImg.naturalWidth || 1) * sc));
                var bh = Math.max(1, Math.round((bgImg.naturalHeight || 1) * sc));
                var c = document.createElement('canvas'); c.width = bw; c.height = bh;
                c.getContext('2d').drawImage(bgImg, 0, 0, bw, bh);
                var dataUrl = file.type === 'image/png' ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.92);
                StuUltra.customBgGallery.unshift({
                  id: Date.now() + '-' + idx, name: file.name, dataUrl: dataUrl, fav: false
                });
                if (--pending === 0) {
                  photo._stuUltraParams.bgCustomImage = StuUltra.customBgGallery[0].dataUrl;
                  photo._stuUltraParams.bgReplaceMode = 'custom_image';
                  StuUltra.bgCategory = 'image';
                  StuUltra.bgLibTab = 'user';
                  StuUltra.syncBgControlsUI(photo._stuUltraParams);
                  StuUltra.triggerRustProcess(photo, false);
                }
              };
              bgImg.src = reader.result;
            };
            reader.readAsDataURL(file);
          });
          customBgInput.value = '';
        });
      }

      cont.querySelector('#btn-clear-custom-bg')?.addEventListener('click', function() {
        var A = window._devstuA;
        var photo = A && A.current;
        if (!photo) return;
        if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
        photo._stuUltraParams.bgCustomImage = '';
        if (photo._stuUltraParams.bgReplaceMode === 'custom_image') {
          photo._stuUltraParams.bgReplaceMode = 'original';
        }
        StuUltra.syncBgControlsUI(photo._stuUltraParams);
        StuUltra.triggerRustProcess(photo, false);
      });

      cont.querySelectorAll('.bg-shadow-card').forEach(function(card) {
        card.addEventListener('click', function() {
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          var sh = card.dataset.shadow || 'none';
          photo._stuUltraParams.bgShadowType = sh;
          if (sh === 'none') {
            photo._stuUltraParams.bgShadowOpacity = 0;
          } else if (!(photo._stuUltraParams.bgShadowOpacity > 0)) {
            photo._stuUltraParams.bgShadowOpacity = sh === 'hard_shadow' ? 65 : (sh === 'cast_shadow' ? 55 : 45);
          }
          StuUltra.syncSlidersFromParams(photo._stuUltraParams);
          StuUltra.syncBgControlsUI(photo._stuUltraParams);
          StuUltra.triggerRustProcess(photo, false);
        });
      });

      cont.querySelector('#bg-filter-explore')?.addEventListener('click', function() {
        StuUltra.bgFilter = 'explore';
        var A = window._devstuA;
        StuUltra.syncBgControlsUI((A && A.current && A.current._stuUltraParams) || createDefaultParams());
      });
      cont.querySelector('#bg-filter-selected')?.addEventListener('click', function() {
        StuUltra.bgFilter = 'selected';
        var A = window._devstuA;
        StuUltra.syncBgControlsUI((A && A.current && A.current._stuUltraParams) || createDefaultParams());
      });
      cont.querySelector('#bg-user-filter-personal')?.addEventListener('click', function() {
        StuUltra.bgUserFilter = 'personal';
        var A = window._devstuA;
        StuUltra.syncBgControlsUI((A && A.current && A.current._stuUltraParams) || createDefaultParams());
      });
      cont.querySelector('#bg-user-filter-fav')?.addEventListener('click', function() {
        StuUltra.bgUserFilter = 'fav';
        var A = window._devstuA;
        StuUltra.syncBgControlsUI((A && A.current && A.current._stuUltraParams) || createDefaultParams());
      });

      var selectedLkColor = 'sifalan';
      var selectedLkLabel = 'Xanh tư pháp';

      cont.querySelectorAll('.liying-color-chip').forEach(function(chip) {
        chip.addEventListener('click', function() {
          cont.querySelectorAll('.liying-color-chip').forEach(function(c) { c.classList.remove('active'); });
          chip.classList.add('active');
          selectedLkColor = chip.dataset.color || 'sifalan';
          var spanLabel = chip.querySelector('span:last-child');
          selectedLkLabel = spanLabel ? spanLabel.textContent : selectedLkColor;
        });
      });

      var btnLkApply = cont.querySelector('#btn-liying-apply');
      if (btnLkApply) {
        btnLkApply.addEventListener('click', async function() {
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          var straightenCb = cont.querySelector('#liying-straighten-cb');
          var isTransparent = selectedLkColor === 'transparent' || selectedLkColor === 'touming';
          var statusLabel = document.getElementById('stu-ultra-status-label');
          if (statusLabel) statusLabel.textContent = 'LK Model 29 U-Net Matting: ' + selectedLkLabel + '...';
          try {
            var res;
            if (isTransparent && window.CollabsDevstuAI && window.CollabsDevstuAI.runLkMattingCutout) {
              res = await window.CollabsDevstuAI.runLkMattingCutout(photo);
            } else if (window.CollabsDevstuAI && window.CollabsDevstuAI.runLkBackgroundReplacement) {
              res = await window.CollabsDevstuAI.runLkBackgroundReplacement(photo, {
                color: selectedLkColor, transparent: isTransparent, label: selectedLkLabel,
                straighten: Boolean(straightenCb && straightenCb.checked)
              });
            }
            if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
            photo._stuUltraParams.bgReplaceMode = isTransparent ? 'transparent' : (selectedLkColor === 'baise' ? 'pure_white' : selectedLkColor);
            if (res && res.data_url) {
              photo.processedDataUrl = res.data_url;
              StuUltra.renderViewport(photo);
              StuUltra.renderHistogramFromDataUrl(res.data_url);
            }
            StuUltra.syncBgControlsUI(photo._stuUltraParams);
            if (statusLabel) statusLabel.textContent = 'LK Model 29 ✓ • ' + (res && res.elapsed_ms ? res.elapsed_ms + 'ms' : 'Xong');
          } catch (err) {
            console.error('[LK Matting Apply] Error:', err);
          }
        });
      }

      var btnLkLevel = cont.querySelector('#btn-liying-level-only');
      if (btnLkLevel) {
        btnLkLevel.addEventListener('click', async function() {
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          try {
            if (window.CollabsDevstuAI && window.CollabsDevstuAI.runLiyingBackgroundReplacement) {
              var res = await window.CollabsDevstuAI.runLiyingBackgroundReplacement(photo, { levelOnly: true, straighten: true });
              if (res && res.data_url) {
                photo.processedDataUrl = res.data_url;
                StuUltra.renderViewport(photo);
                StuUltra.renderHistogramFromDataUrl(res.data_url);
              }
            }
          } catch (err) { console.error('[LK Level Only] Error:', err); }
        });
      }

      var handleResetBg = function() {
        var A = window._devstuA;
        var photo = A && A.current;
        if (!photo) return;
        if (window.CollabsDevstuAI && window.CollabsDevstuAI.restoreOriginalPhoto) {
          window.CollabsDevstuAI.restoreOriginalPhoto(photo);
        }
        if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
        photo._stuUltraParams.bgReplaceMode = 'original';
        photo.processedDataUrl = null;
        StuUltra.syncBgControlsUI(photo._stuUltraParams);
        StuUltra.triggerRustProcess(photo, false);
      };
      cont.querySelector('#btn-liying-cancel')?.addEventListener('click', handleResetBg);
      cont.querySelector('#btn-bg-reset-original')?.addEventListener('click', handleResetBg);

      cont.querySelector('#btn-bg-more')?.addEventListener('click', function(e) {
        e.stopPropagation();
        StuUltra.bgMoreExpanded = !StuUltra.bgMoreExpanded;
        var A = window._devstuA;
        StuUltra.syncBgControlsUI((A && A.current && A.current._stuUltraParams) || createDefaultParams());
      });

      cont.querySelector('#bg-cat-image')?.addEventListener('click', function() {
        StuUltra.bgCategory = 'image';
        var A = window._devstuA;
        StuUltra.syncBgControlsUI((A && A.current && A.current._stuUltraParams) || createDefaultParams());
      });
      cont.querySelector('#bg-cat-solid')?.addEventListener('click', function() {
        StuUltra.bgCategory = 'solid';
        var A = window._devstuA;
        StuUltra.syncBgControlsUI((A && A.current && A.current._stuUltraParams) || createDefaultParams());
      });
      cont.querySelector('#bg-lib-tab-rec')?.addEventListener('click', function() {
        StuUltra.bgLibTab = 'rec';
        var A = window._devstuA;
        StuUltra.syncBgControlsUI((A && A.current && A.current._stuUltraParams) || createDefaultParams());
      });
      cont.querySelector('#bg-lib-tab-user')?.addEventListener('click', function() {
        StuUltra.bgLibTab = 'user';
        var A = window._devstuA;
        StuUltra.syncBgControlsUI((A && A.current && A.current._stuUltraParams) || createDefaultParams());
      });

      // Swatches: route to LK Model 29 presets or directly to Rust SIMD engine!
      cont.querySelectorAll('.asset-swatch').forEach(function(swatch) {
        swatch.addEventListener('click', function() {
          var bgmode = swatch.dataset.bgmode;
          if (!bgmode) return;
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          if (bgmode === 'original') {
            handleResetBg();
            return;
          }
          var colorMap = {
            'pure_white': '#ffffff', 'studio_grey': '#b5b9c0', 'moody_black': '#18181b',
            'warm_beige': '#ad9387', 'fabric_02': '#3e4450', 'slate_grey_03': '#74727a',
            'passport_blue': '#2b6cb0', 'dengjihong': '#d92429', 'pastel_pink': '#f3cbd3',
            'sage_green': '#9bb7a5', 'lavender_mist': '#cdc4ea'
          };
          // Keep full Rust SIMD compatibility + unlock advanced background controls
          photo._stuUltraParams.bgReplaceMode = bgmode === 'dengjihong' || bgmode === 'lanbaijianbian'
            ? (photo._stuUltraParams.bgReplaceMode = 'custom_color', photo._stuUltraParams.bgCustomColor = (bgmode === 'dengjihong' ? '#d92429' : '#70a6ff'), 'custom_color')
            : bgmode;
          if (colorMap[bgmode] && bgmode !== 'custom_color') {
            photo._stuUltraParams.bgCustomColor = colorMap[bgmode];
          }
          StuUltra.syncBgControlsUI(photo._stuUltraParams);
          StuUltra.triggerRustProcess(photo, false);
        });
      });

      // 8. Hair Color Cards, Side Link, Hair Reset (mod-portrait)
      cont.querySelector('#btn-hair-side-link')?.addEventListener('click', function() {
        StuUltra.hairSideLinked = !StuUltra.hairSideLinked;
        var A = window._devstuA;
        StuUltra.syncPortraitControlsUI((A && A.current && A.current._stuUltraParams) || createDefaultParams());
      });

      cont.querySelectorAll('[data-haircolor]').forEach(function(chip) {
        chip.addEventListener('click', function() {
          var colorKey = chip.dataset.haircolor || 'none';
          var defaultDeg = Number(chip.dataset.deg || 60);
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          photo._stuUltraParams.hairDyeColor = colorKey;
          photo._stuUltraParams.hairDyeStrength = colorKey === 'none' ? 0 : defaultDeg;
          if (colorKey === 'none') photo._stuUltraParams.hairDyeDarken = 0;
          StuUltra.syncAllControlsUI(photo);
          StuUltra.triggerRustProcess(photo, false);
        });
      });

      cont.querySelector('#btn-hair-reset')?.addEventListener('click', function(e) {
        e.stopPropagation();
        var A = window._devstuA;
        var photo = A && A.current;
        if (!photo) return;
        if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
        var keys = [
          'strayHair', 'strayHairInner', 'strayHairOuter', 'hairVolume',
          'hairSideLeftVolume', 'hairSideRightVolume', 'hairlineAdjust', 'hairPartLine',
          'hairSmooth', 'hairFrizzy', 'hairShine', 'whiteHairBlacken', 'hairColorUnify',
          'hairDyeStrength', 'hairDyeDarken', 'hairDyeColor'
        ];
        keys.forEach(function(k) { photo._stuUltraParams[k] = DEFAULT_PARAMS[k]; });
        StuUltra.syncAllControlsUI(photo);
        StuUltra.triggerRustProcess(photo, false);
      });

      // 9. All Sliders Hooked to Rust SIMD (with side/wrinkle link + click-badge reset)
      cont.querySelectorAll('.retouch-slider').forEach(function(slider) {
        var key = slider.id;
        var resetOne = function() {
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          var defVal = DEFAULT_PARAMS[key] != null ? DEFAULT_PARAMS[key] : 0;
          slider.value = defVal;
          photo._stuUltraParams[key] = defVal;
          if (StuUltra.hairSideLinked && (key === 'hairSideLeftVolume' || key === 'hairSideRightVolume')) {
            photo._stuUltraParams.hairSideLeftVolume = defVal;
            photo._stuUltraParams.hairSideRightVolume = defVal;
          }
          if (StuUltra.clothWrinkleLinked && (key === 'clothingSmallWrinkles' || key === 'clothingLargeWrinkles')) {
            photo._stuUltraParams.clothingSmallWrinkles = defVal;
            photo._stuUltraParams.clothingLargeWrinkles = defVal;
          }
          StuUltra.syncSlidersFromParams(photo._stuUltraParams);
          StuUltra.triggerRustProcess(photo, false);
        };

        slider.addEventListener('input', function() {
          var val = parseFloat(slider.value);
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          if (!photo._stuUltraParams) photo._stuUltraParams = createDefaultParams();
          photo._stuUltraParams[key] = val;

          var syncCounterpart = function(otherKey) {
            photo._stuUltraParams[otherKey] = val;
            var otherSl = cont.querySelector('#' + otherKey);
            if (otherSl) otherSl.value = val;
            var ob = cont.querySelector('.val[data-for="' + otherKey + '"]');
            if (ob) {
              ob.textContent = formatSliderBadgeValue(val, otherKey);
              ob.classList.toggle('modified', Math.abs(val - (DEFAULT_PARAMS[otherKey] || 0)) > 1e-4);
            }
          };

          if (StuUltra.hairSideLinked) {
            if (key === 'hairSideLeftVolume') syncCounterpart('hairSideRightVolume');
            else if (key === 'hairSideRightVolume') syncCounterpart('hairSideLeftVolume');
          }
          if (StuUltra.clothWrinkleLinked) {
            if (key === 'clothingSmallWrinkles') syncCounterpart('clothingLargeWrinkles');
            else if (key === 'clothingLargeWrinkles') syncCounterpart('clothingSmallWrinkles');
          }

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

        slider.addEventListener('change', function() {
          var A = window._devstuA;
          var photo = A && A.current;
          if (photo && !StuUltra.realtimeColor) {
            StuUltra.triggerRustProcess(photo, false);
          }
        });

        slider.addEventListener('dblclick', resetOne);
        var badgeEl = cont.querySelector('.val[data-for="' + key + '"]');
        if (badgeEl) {
          badgeEl.title = 'Nhấp vào số để đặt lại mặc định';
          badgeEl.addEventListener('click', resetOne);
        }
      });

      // 10. Left & Inner Preset Card + Genre Chip + LK Magic Pro Max Click Handlers
      document.addEventListener('click', function(e) {
        var A = window._devstuA;
        if (!isStuMode(A)) return;
        var lkColorBtn = e.target && e.target.closest && e.target.closest('[data-lk-color]');
        if (lkColorBtn) {
          e.preventDefault(); e.stopPropagation();
          var ph1 = A.current; if (!ph1) return;
          if (!ph1._stuUltraParams) ph1._stuUltraParams = createDefaultParams();
          ph1._stuUltraParams.lkAiColorStyle = lkColorBtn.getAttribute('data-lk-color') || 'none';
          StuUltra.syncLkUltraMaxUI(ph1._stuUltraParams);
          StuUltra.triggerRustProcess(ph1, false);
          return;
        }
        var lkToneBtn = e.target && e.target.closest && e.target.closest('[data-lk-skintone]');
        if (lkToneBtn) {
          e.preventDefault(); e.stopPropagation();
          var ph2 = A.current; if (!ph2) return;
          if (!ph2._stuUltraParams) ph2._stuUltraParams = createDefaultParams();
          ph2._stuUltraParams.lkSkinTonePreset = lkToneBtn.getAttribute('data-lk-skintone') || 'none';
          StuUltra.syncLkUltraMaxUI(ph2._stuUltraParams);
          StuUltra.triggerRustProcess(ph2, false);
          return;
        }
        var lkSkyBtn = e.target && e.target.closest && e.target.closest('[data-lk-sky]');
        if (lkSkyBtn) {
          e.preventDefault(); e.stopPropagation();
          var ph3 = A.current; if (!ph3) return;
          if (!ph3._stuUltraParams) ph3._stuUltraParams = createDefaultParams();
          ph3._stuUltraParams.lkSkyPreset = lkSkyBtn.getAttribute('data-lk-sky') || 'none';
          StuUltra.syncLkUltraMaxUI(ph3._stuUltraParams);
          StuUltra.triggerRustProcess(ph3, false);
          return;
        }
        var lkBgBtn = e.target && e.target.closest && e.target.closest('[data-lk-bg]');
        if (lkBgBtn) {
          e.preventDefault(); e.stopPropagation();
          var ph4 = A.current; if (!ph4) return;
          if (!ph4._stuUltraParams) ph4._stuUltraParams = createDefaultParams();
          ph4._stuUltraParams.lkBgPreset = lkBgBtn.getAttribute('data-lk-bg') || 'none';
          StuUltra.syncLkUltraMaxUI(ph4._stuUltraParams);
          StuUltra.triggerRustProcess(ph4, false);
          return;
        }
        var chip = e.target && e.target.closest && e.target.closest('.gn-chip[data-genre-id]');
        if (chip) {
          e.preventDefault();
          e.stopPropagation();
          var gid = chip.dataset.genreId;
          if (gid) StuUltra.applyPreset(gid);
          return;
        }
        var card = e.target && e.target.closest && e.target.closest('.retouch-preset-item[data-preset], .retouch-preset-item[data-genre]');
        if (card) {
          var key = card.dataset.preset || card.dataset.genre;
          if (!key) return;
          e.preventDefault();
          e.stopPropagation();
          document.querySelectorAll('.retouch-preset-item').forEach(function(c) { c.classList.remove('active'); });
          card.classList.add('active');
          StuUltra.applyPreset(key);
        }
      }, true);

      // 11. Footer & Header Actions
      var btnResetFooter = cont.querySelector('#btn-reset-all-footer');
      var btnResetHdr = document.getElementById('stu-ultra-btn-reset');
      var handleResetAll = function() {
        var A = window._devstuA;
        var photo = A && A.current;
        if (!photo) return;
        var faceBackup = (photo._stuUltraParams && photo._stuUltraParams.face) || photo._aiFace || DEFAULT_PARAMS.face;
        photo._stuUltraParams = createDefaultParams();
        photo._stuUltraParams.face = Object.assign({}, faceBackup);
        photo._stuCurvePoints = null;
        StuUltra.cropPreviewMode = false;
        photo.processedDataUrl = null;
        document.querySelectorAll('.retouch-preset-item').forEach(function(c) { c.classList.remove('active'); });
        StuUltra.syncAllControlsUI(photo);
        StuUltra.renderViewport(photo);
        if (photo._cachedOriginalDataUrl) StuUltra.renderHistogramFromDataUrl(photo._cachedOriginalDataUrl);
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
              var itemFace = (item._stuUltraParams && item._stuUltraParams.face) || item._aiFace || DEFAULT_PARAMS.face;
              item._stuUltraParams = Object.assign({}, p, { face: Object.assign({}, itemFace) });
              if (photo._stuCurvePoints) {
                item._stuCurvePoints = photo._stuCurvePoints.map(function(pt) { return { x: pt.x, y: pt.y }; });
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
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo) return;
          var statusLabel = document.getElementById('stu-ultra-status-label');
          if (statusLabel) statusLabel.textContent = 'Đang xuất ảnh 4K qua Rust SIMD...';

          getPhotoOriginalDataUrl(photo).then(function(originalDataUrl) {
            if (!originalDataUrl) return;
            StuUltra.ensureAiAnalysis(photo, originalDataUrl).then(function(aiInfo) {
              var p = photo._stuUltraParams || createDefaultParams();
              var sendParams = Object.assign({}, p, { isHighresMatte: Boolean(aiInfo && aiInfo.isHighresMatte) });
              fetch('/api/process_photo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  imageBase64: originalDataUrl,
                  params: sendParams,
                  highQuality: true,
                  maskBase64: (aiInfo && aiInfo.maskBase64) || null,
                  sceneMaskBase64: (aiInfo && aiInfo.sceneMaskBase64) || null
                })
              }).then(function(res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
              }).then(function(data) {
                if (data && data.ok && data.dataUrl) {
                  var isPng = p.bgReplaceMode === 'transparent';
                  var a = document.createElement('a');
                  a.href = data.dataUrl;
                  var baseName = (photo.name || 'retouch').replace(/\.[^.]+$/, '');
                  a.download = baseName + '_STU_Ultra.' + (isPng ? 'png' : 'jpg');
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  if (statusLabel) statusLabel.textContent = 'Xuất hoàn tất 4K ✓ (' + data.elapsedMs + 'ms)';
                  if (typeof window.tt === 'function') window.tt('Đã xuất ảnh chất lượng cao 4K qua Rust SIMD ✓', 4000);
                } else {
                  throw new Error((data && data.error) || 'Export thất bại');
                }
              }).catch(function(err) {
                if (statusLabel) statusLabel.textContent = 'Lỗi xuất ảnh: ' + (err.message || err);
                if (typeof window.tt === 'function') window.tt('Lỗi xuất ảnh: ' + (err.message || err), 4000, 'error');
              });
            });
          });
        });
      }
    },

    syncColorControlsUI: function(p) {
      var cont = StuUltra.container;
      if (!cont || !p) return;
      ['lutPreset', 'treatment'].forEach(function(id) {
        var el = cont.querySelector('#' + id);
        if (el && p[id] !== undefined) el.value = p[id];
      });
      StuUltra.renderToneCurve();
    },

    syncPortraitControlsUI: function(p) {
      var cont = StuUltra.container;
      if (!cont || !p) return;
      var lipEl = cont.querySelector('#makeupLipTint');
      if (lipEl && p.makeupLipTint !== undefined) lipEl.value = p.makeupLipTint;

      var dyeColor = p.hairDyeColor || 'none';
      cont.querySelectorAll('.hair-color-card').forEach(function(card) {
        card.classList.toggle('active', (card.dataset.haircolor || 'none') === dyeColor);
      });
      var dyeControls = cont.querySelector('#hair-dye-controls');
      if (dyeControls) dyeControls.classList.toggle('disabled', dyeColor === 'none');
      var sideLinkBtn = cont.querySelector('#btn-hair-side-link');
      if (sideLinkBtn) {
        sideLinkBtn.classList.toggle('active', Boolean(StuUltra.hairSideLinked));
        sideLinkBtn.setAttribute('aria-pressed', String(Boolean(StuUltra.hairSideLinked)));
      }
    },

    syncClothingControlsUI: function(p) {
      var cont = StuUltra.container;
      if (!cont || !p) return;
      var target = p.clothingTarget || 'all';
      cont.querySelectorAll('.cloth-target-pill').forEach(function(pill) {
        pill.classList.toggle('active', pill.dataset.clothtarget === target);
      });
      var linkBtn = cont.querySelector('#btn-cloth-wrinkle-link');
      if (linkBtn) {
        linkBtn.classList.toggle('active', Boolean(StuUltra.clothWrinkleLinked));
        linkBtn.setAttribute('aria-pressed', String(Boolean(StuUltra.clothWrinkleLinked)));
      }
    },

    syncBgControlsUI: function(p) {
      var cont = StuUltra.container;
      if (!cont || !p) return;
      var mode = p.bgReplaceMode || 'original';
      if (StuUltra.canvasWrap) {
        StuUltra.canvasWrap.classList.toggle('has-transparency', mode === 'transparent');
      }
      var hex = /^#[0-9a-fA-F]{6}$/.test(p.bgCustomColor || '') ? p.bgCustomColor : '#e8eef5';
      var hasCustomImg = Boolean(p.bgCustomImage && p.bgCustomImage.length > 0);

      cont.querySelectorAll('.asset-swatch').forEach(function(sw) {
        sw.classList.toggle('active', Boolean(sw.dataset.bgmode) && sw.dataset.bgmode === mode);
      });
      cont.querySelector('#btn-bg-reset-original')?.classList.toggle('active', mode === 'original');

      BG_SELECT_IDS.forEach(function(id) {
        var el = cont.querySelector('#' + id);
        if (el && p[id] !== undefined) el.value = p[id];
      });
      BG_SWITCH_KEYS.forEach(function(id) {
        var sw = cont.querySelector('#' + id);
        if (sw) {
          var on = Boolean(p[id]);
          sw.classList.toggle('on', on);
          sw.setAttribute('aria-checked', String(on));
        }
      });

      var swatchCust = cont.querySelector('#swatch-custom-color');
      if (swatchCust) swatchCust.style.background = hex;
      var picker = cont.querySelector('#bgCustomColor');
      if (picker) picker.value = hex;
      var hexLbl = cont.querySelector('#bg-custom-color-hex');
      if (hexLbl) hexLbl.textContent = hex;

      cont.querySelectorAll('.bg-color-dot').forEach(function(dot) {
        var dc = (dot.dataset.color || '').toLowerCase();
        dot.classList.toggle('active', mode === 'custom_color' && dc === hex.toLowerCase());
      });

      var isSolid = StuUltra.bgCategory === 'solid';
      var isUserTab = StuUltra.bgLibTab === 'user';
      cont.querySelector('#bg-cat-image')?.classList.toggle('active', !isSolid);
      cont.querySelector('#bg-cat-solid')?.classList.toggle('active', isSolid);
      cont.querySelector('#bg-lib-tab-rec')?.classList.toggle('active', !isUserTab);
      cont.querySelector('#bg-lib-tab-user')?.classList.toggle('active', isUserTab);

      var recPanel = cont.querySelector('#bg-lib-rec-panel');
      var userPanel = cont.querySelector('#bg-lib-user-panel');
      var userImgPane = cont.querySelector('#bg-user-image-pane');
      var userSolidPane = cont.querySelector('#bg-user-solid-pane');

      if (isSolid) {
        recPanel?.classList.add('hidden');
        userPanel?.classList.remove('hidden');
        userImgPane?.classList.add('hidden');
        userSolidPane?.classList.remove('hidden');
      } else {
        recPanel?.classList.toggle('hidden', isUserTab);
        userPanel?.classList.toggle('hidden', !isUserTab);
        userImgPane?.classList.toggle('hidden', !isUserTab);
        userSolidPane?.classList.add('hidden');
      }

      var isSelFilter = StuUltra.bgFilter === 'selected';
      cont.querySelector('#bg-filter-explore')?.classList.toggle('active', !isSelFilter);
      cont.querySelector('#bg-filter-selected')?.classList.toggle('active', isSelFilter);
      cont.querySelector('#bg-user-filter-personal')?.classList.toggle('active', StuUltra.bgUserFilter === 'personal');
      cont.querySelector('#bg-user-filter-fav')?.classList.toggle('active', StuUltra.bgUserFilter === 'fav');

      var btnMore = cont.querySelector('#btn-bg-more');
      var moreWrap = cont.querySelector('#bg-more-swatches');
      if (recPanel) {
        recPanel.querySelectorAll('.asset-swatch[data-bgmode]').forEach(function(sw) {
          sw.classList.toggle('hidden', isSelFilter && sw.dataset.bgmode !== mode);
        });
        if (btnMore) {
          btnMore.classList.toggle('hidden', isSelFilter);
          btnMore.classList.toggle('active', !isSelFilter && StuUltra.bgMoreExpanded);
        }
        if (moreWrap) {
          var hasMore = Boolean(moreWrap.querySelector('.asset-swatch[data-bgmode="' + mode + '"]'));
          moreWrap.classList.toggle('hidden', isSelFilter ? !hasMore : !StuUltra.bgMoreExpanded);
        }
      }

      var previewWrap = cont.querySelector('#custom-bg-preview');
      var previewImg = cont.querySelector('#custom-bg-preview-img');
      var clearBtn = cont.querySelector('#btn-clear-custom-bg');
      if (previewWrap) previewWrap.classList.toggle('hidden', !hasCustomImg);
      if (previewImg) previewImg.src = hasCustomImg ? p.bgCustomImage : '';
      if (clearBtn) clearBtn.classList.toggle('hidden', !hasCustomImg);

      // Render uploaded backgrounds gallery
      var gallery = cont.querySelector('#bg-user-gallery');
      if (gallery) {
        gallery.replaceChildren();
        var items = StuUltra.customBgGallery.filter(function(it) {
          return StuUltra.bgUserFilter === 'fav' ? Boolean(it.fav) : true;
        });
        gallery.classList.toggle('hidden', items.length === 0);
        items.forEach(function(item) {
          var card = document.createElement('div');
          card.className = 'bg-user-thumb' + (mode === 'custom_image' && p.bgCustomImage === item.dataUrl ? ' active' : '');
          var img = document.createElement('img');
          img.src = item.dataUrl; img.alt = item.name || 'Nền';
          card.appendChild(img);
          card.addEventListener('click', function() {
            var A = window._devstuA; var ph = A && A.current; if (!ph) return;
            if (!ph._stuUltraParams) ph._stuUltraParams = createDefaultParams();
            ph._stuUltraParams.bgCustomImage = item.dataUrl;
            ph._stuUltraParams.bgReplaceMode = 'custom_image';
            StuUltra.syncBgControlsUI(ph._stuUltraParams);
            StuUltra.triggerRustProcess(ph, false);
          });
          gallery.appendChild(card);
        });
      }

      cont.querySelector('#bg-replace-advanced-wrap')?.classList.toggle('is-locked', mode === 'original');

      var shType = p.bgShadowType || 'none';
      cont.querySelectorAll('.bg-shadow-card').forEach(function(card) {
        card.classList.toggle('active', card.dataset.shadow === shType);
      });
    },

    syncCropControlsUI: function(photo) {
      var cont = StuUltra.container;
      if (!cont || !photo) return;
      var p = photo._stuUltraParams || createDefaultParams();
      var dims = StuUltra.getPhotoDims(photo);
      var labelMap = {
        original: 'Kích thước gốc', as_shot: 'Cài đặt ảnh gốc', fixed: 'Tỉ lệ cố định',
        custom_ratio: 'Kích thước tự chọn', custom_dim: 'Dài*Rộng*Độ phân giải', id_photo: 'Ảnh Thẻ',
        id_2x3: 'Ảnh Thẻ 2×3 cm', id_3x4: 'Ảnh Thẻ 3×4 cm', id_4x6: 'Ảnh Thẻ 4×6 cm',
        id_35x45: 'Ảnh Thẻ Visa 3.5×4.5', id_5x5: 'Ảnh Thẻ 5×5 cm', id_33x48: 'Ảnh Thẻ 3.3×4.8 cm',
        '1:1': '1 : 1', '4:5': '4 : 5', '5:7': '5 : 7', '2:3': '2 : 3', '16:9': '16 : 9',
        '1.91:1': '1.91 : 1', '2:1': '2 : 1', '3:1': '3 : 1', '4:3': '4 : 3'
      };
      var preset = p.cropPreset || 'original';
      var lbl = cont.querySelector('#crop-ratio-label');
      if (lbl) lbl.textContent = labelMap[preset] || preset;

      cont.querySelectorAll('.crop-ratio-opt').forEach(function(opt) {
        var op = opt.dataset.preset;
        var act = (op === preset) || (op === 'id_photo' && preset.indexOf('id_') === 0);
        opt.classList.toggle('active', act);
        var ck = opt.querySelector('.opt-check');
        if (ck) ck.textContent = act ? '✓' : '';
      });

      cont.querySelector('#crop-custom-ratio-box')?.classList.toggle('hidden', preset !== 'custom_ratio');
      cont.querySelector('#crop-custom-inputs')?.classList.toggle('hidden', preset !== 'custom_dim');
      cont.querySelector('#crop-id-presets-box')?.classList.toggle('hidden', preset.indexOf('id_') !== 0);
      cont.querySelectorAll('.crop-id-chip').forEach(function(chip) {
        chip.classList.toggle('active', chip.dataset.idpreset === preset);
      });

      var gridChk = cont.querySelector('#crop-show-grid');
      if (gridChk) gridChk.checked = p.cropShowGrid !== false;
      var aiSw = cont.querySelector('#toggle-crop-ai-subject');
      if (aiSw) {
        aiSw.classList.toggle('on', Boolean(p.cropAiSubject));
        aiSw.setAttribute('aria-checked', String(Boolean(p.cropAiSubject)));
      }
      cont.querySelector('#btn-crop-align-v')?.classList.toggle('active', Boolean(p.cropAlignVertical));
      cont.querySelector('#btn-crop-align-eye')?.classList.toggle('active', Boolean(p.cropAlignEye));
      cont.querySelector('#btn-flip-h')?.classList.toggle('active', Boolean(p.flipHorizontal));
      cont.querySelector('#btn-flip-v')?.classList.toggle('active', Boolean(p.flipVertical));
      cont.querySelector('#btn-crop-preview-toggle')?.classList.toggle('active', Boolean(StuUltra.cropPreviewMode));
      var applyBtn = cont.querySelector('#btn-crop-apply');
      if (applyBtn) {
        applyBtn.classList.toggle('active', Boolean(StuUltra.cropPreviewMode));
        applyBtn.textContent = StuUltra.cropPreviewMode ? 'Đang xem cắt ✓' : 'Áp dụng cắt';
      }

      var cw = Math.max(1, Math.round((p.cropW != null ? p.cropW : 1) * dims.imgW));
      var ch = Math.max(1, Math.round((p.cropH != null ? p.cropH : 1) * dims.imgH));
      var readout = cont.querySelector('#crop-box-readout');
      if (readout) {
        readout.textContent = (p.cropCustomW > 0 && p.cropCustomH > 0)
          ? (cw + '×' + ch + ' → ' + p.cropCustomW + '×' + p.cropCustomH + ' px')
          : (hasActiveCropRect(p) ? ('Khung: ' + cw + ' × ' + ch + ' px') : ('Gốc: ' + dims.imgW + ' × ' + dims.imgH + ' px'));
      }
    },

    syncLkUltraMaxUI: function(p) {
      var cont = StuUltra.container;
      if (!cont || !p) return;
      var cStyle = p.lkAiColorStyle || 'none';
      cont.querySelectorAll('[data-lk-color]').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lk-color') === cStyle);
      });
      var sTone = p.lkSkinTonePreset || 'none';
      cont.querySelectorAll('[data-lk-skintone]').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lk-skintone') === sTone);
      });
      var skyP = p.lkSkyPreset || 'none';
      cont.querySelectorAll('[data-lk-sky]').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lk-sky') === skyP);
      });
      var bgP = p.lkBgPreset || 'none';
      cont.querySelectorAll('[data-lk-bg]').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lk-bg') === bgP);
      });
    },

    syncAllControlsUI: function(photo) {
      if (!photo) return;
      var p = photo._stuUltraParams || (photo._stuUltraParams = createDefaultParams());
      StuUltra.syncSlidersFromParams(p);
      StuUltra.syncColorControlsUI(p);
      StuUltra.syncPortraitControlsUI(p);
      StuUltra.syncClothingControlsUI(p);
      StuUltra.syncBgControlsUI(p);
      StuUltra.syncCropControlsUI(photo);
      StuUltra.syncLkUltraMaxUI(p);
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

      StuUltra.syncAllControlsUI(photo);
      StuUltra.syncBatchCount();

      if (!photo._cachedOriginalDataUrl && StuUltra.afterCanvas && StuUltra.beforeCanvas) {
        StuUltra.afterCanvas.getContext('2d').clearRect(0, 0, StuUltra.afterCanvas.width, StuUltra.afterCanvas.height);
        StuUltra.beforeCanvas.getContext('2d').clearRect(0, 0, StuUltra.beforeCanvas.width, StuUltra.beforeCanvas.height);
      }

      getPhotoOriginalDataUrl(photo).then(function(origUrl) {
        if (window._devstuA && window._devstuA.current && window._devstuA.current !== photo) return;
        StuUltra.syncCropControlsUI(photo);
        StuUltra.renderViewport(photo);
        var histSrc = photo.processedDataUrl || origUrl;
        if (histSrc) StuUltra.renderHistogramFromDataUrl(histSrc);
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
        var sampleH = Math.max(1, Math.round(120 * ((img.naturalHeight || 1) / (img.naturalWidth || 1))));
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
          var r = imgData[i], g = imgData[i + 1], b = imgData[i + 2];
          rHist[r]++; gHist[g]++; bHist[b]++;
          sumR += r; sumG += g; sumB += b;
        }

        var meanEl = document.getElementById('hist-rgb-mean');
        if (meanEl) {
          meanEl.textContent = 'R ' + Math.round(sumR / totalPx) + ' · G ' + Math.round(sumG / totalPx) + ' · B ' + Math.round(sumB / totalPx);
        }

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

        drawChannel(rHist, 'rgba(239, 68, 68, 0.48)');
        drawChannel(gHist, 'rgba(34, 197, 94, 0.48)');
        drawChannel(bHist, 'rgba(59, 130, 246, 0.48)');
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

      var A = window._devstuA;
      var photo = A && A.current;
      var pts = photo ? getPhotoCurvePoints(photo) : [
        { x: 0, y: 0 }, { x: 0.25, y: 0.25 }, { x: 0.5, y: 0.5 }, { x: 0.75, y: 0.75 }, { x: 1, y: 1 }
      ];

      ctx.strokeStyle = '#f8d442';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (var px = 0; px <= w; px += 2) {
        var ny = evaluateCurveSpline(pts, px / w);
        var py = (1 - ny) * h;
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      pts.forEach(function(pt, idx) {
        ctx.fillStyle = idx === StuUltra.draggingCurveIdx ? '#ffffff' : '#f8d442';
        ctx.strokeStyle = '#0f1013';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pt.x * w, (1 - pt.y) * h, 4.5, 0, Math.PI * 2);
        ctx.fill();
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
