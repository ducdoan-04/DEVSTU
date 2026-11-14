// collabs_devstu_ai.js - AI Bridge for DEVSTU powered by Collabs Retouch Pro & LiYing AI

(function(window) {
  'use strict';

  // 1. Evoto Salon Hair Specs (target_rgb, exp_adj, con_adj, sh_lift, chroma_mix)
  var EVOTO_HAIR_SPECS = {
    h01: [[0.486, 0.412, 0.357], 0.14,  0.07,  0.19, 0.72], // #7C695B Cool Tea
    h02: [[0.537, 0.361, 0.286], 0.10,  0.07,  0.08, 0.76], // #895C49 Tea Brown
    h03: [[0.776, 0.475, 0.318], 0.20,  0.06,  0.29, 0.80], // #C67951 Orange Brown
    h04: [[0.612, 0.329, 0.349], 0.16,  0.07,  0.12, 0.78], // #9C5459 Red Brown+
    h05: [[0.678, 0.349, 0.337], 0.18, -0.16,  0.27, 0.82], // #AD5956 Ruby Red
    h06: [[0.596, 0.447, 0.431], 0.22, -0.10,  0.19, 0.78], // #98726E Pink Brown
    h07: [[0.808, 0.576, 0.565], 0.32,  0.00,  0.42, 0.84], // #CE9390 Sakura Pink
    h08: [[0.220, 0.185, 0.172], -0.18, 0.08, -0.26, 0.78], // #5D4B43 Natural Black
    h09: [[0.270, 0.305, 0.425], 0.06, -0.06,  0.10, 0.80], // #646980 Blue Black
    h10: [[0.608, 0.345, 0.424], 0.14,  0.03,  0.22, 0.82], // #9B586C Grape Purple
    h11: [[0.486, 0.427, 0.510], 0.16,  0.09,  0.19, 0.80], // #7C6D82 Blue Purple
    h12: [[0.443, 0.435, 0.376], 0.15,  0.12,  0.13, 0.76], // #716F60 Olive Flax
    h13: [[0.459, 0.502, 0.376], 0.18, -0.14,  0.28, 0.80]  // #758060 Ash Moss
  };

  // Convert Base64 Data URL to a browser File object
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(',');
    var mimeMatch = arr[0].match(/:(.*?);/);
    var mime = mimeMatch ? mimeMatch[1] : 'image/png';
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime, lastModified: Date.now() });
  }

  // Extract high-res image data URL from DEVSTU photo
  async function getPhotoDataUrl(photo) {
    if (!photo) return null;
    if (photo._devstuDataUrl) return photo._devstuDataUrl;

    // 1. Check if photo has a raw File
    if (photo.file && typeof photo.file.slice === 'function') {
      try {
        var dataUrl = await new Promise(function(resolve, reject) {
          var reader = new FileReader();
          reader.onload = function() { resolve(reader.result); };
          reader.onerror = reject;
          reader.readAsDataURL(photo.file);
        });
        if (dataUrl && dataUrl.startsWith('data:image')) {
          photo._devstuDataUrl = dataUrl;
          return dataUrl;
        }
      } catch (e) {
        console.warn('[CollabsAI] FileReader failed:', e);
      }
    }

    // 2. Fallback: draw from window._devstuGetBitmap or canvas
    if (typeof window._devstuGetBitmap === 'function') {
      try {
        var bmp = await window._devstuGetBitmap(photo, 4096);
        if (bmp) {
          var c = document.createElement('canvas');
          c.width = bmp.width;
          c.height = bmp.height;
          var ctx = c.getContext('2d');
          ctx.drawImage(bmp, 0, 0);
          var res = c.toDataURL('image/png');
          bmp.close?.();
          photo._devstuDataUrl = res;
          return res;
        }
      } catch (e) {
        console.warn('[CollabsAI] Bitmap export failed:', e);
      }
    }

    return null;
  }

  // Run MediaPipe Neural AI analysis (Mesh 478 + 6-class Segmenter)
  async function ensurePhotoAiMask(photo) {
    if (!photo) return null;
    if (photo._aiMaskBase64) return photo._aiMaskBase64;
    if (typeof window.analyzePhotoWithNeuralAI !== 'function') {
      console.warn('[CollabsAI] analyzePhotoWithNeuralAI is not ready yet');
      return null;
    }

    var dataUrl = await getPhotoDataUrl(photo);
    if (!dataUrl) return null;

    var img = new Image();
    await new Promise(function(resolve, reject) {
      img.onload = resolve;
      img.onerror = reject;
      img.src = dataUrl;
    });

    try {
      var aiRes = await window.analyzePhotoWithNeuralAI(img, null);
      if (aiRes) {
        photo._aiMaskBase64 = aiRes.maskBase64;
        photo._aiSceneMaskBase64 = aiRes.sceneMaskBase64;
        photo._aiHairBounds = aiRes.hairBounds;
        photo._aiMesh478 = aiRes.mesh478;
        photo._aiLandmarksDetected = aiRes.landmarksDetected;
        return aiRes.maskBase64;
      }
    } catch (e) {
      console.warn('[CollabsAI] Neural mask extraction error:', e);
    }
    return null;
  }

  // Apply in-place result to photo with proper DEVSTU WebGL GPU texture reload
  async function applyInPlaceResult(photo, dataUrl, filename, isAi) {
    var newFile = dataURLtoFile(dataUrl, filename);

    // Create ImageBitmap and thumbnails
    var newBmp = null;
    var newThumb = null;
    try {
      if (typeof createImageBitmap === 'function') {
        newBmp = await createImageBitmap(newFile);
        newThumb = await createImageBitmap(newBmp, { resizeWidth: 160, resizeHeight: 120, resizeQuality: 'medium' });
      }
    } catch (e) {
      console.warn('[CollabsAI] createImageBitmap error:', e);
    }

    photo.file = newFile;
    photo.src = {
      kind: 'image',
      file: newFile,
      blob: newFile,
      sensorLong: (photo.src && photo.src.sensorLong) || 0
    };
    if (newBmp) {
      photo.width = newBmp.width;
      photo.height = newBmp.height;
    }
    if (newThumb) {
      photo.thumb = newThumb;
      photo.editedThumb = null;
    }
    photo._devstuDataUrl = dataUrl;
    photo._isAiVersion = !!isAi;

    // Reload DEVSTU viewer GPU texture and render
    if (typeof window._devstuReloadPhoto === 'function') {
      await window._devstuReloadPhoto(photo);
    } else {
      if (window._devstuViewer) {
        try { window._devstuViewer.forget(); } catch (e) {}
        try { if (window._devstuViewer.pre) window._devstuViewer.pre.delete(photo.id); } catch (e) {}
      }
      if (window._devstuStage && typeof window._devstuStage.loadPhoto === 'function') {
        try { window._devstuStage.loadPhoto(photo); } catch (e) {}
      }
      if (window._devstuA) {
        try { window._devstuA.emit('photos'); } catch (e) {}
        try { window._devstuA.emit('current'); } catch (e) {}
        try { window._devstuA.emit('state'); } catch (e) {}
        try { window._devstuA.emit('thumbs'); } catch (e) {}
      }
    }
  }

  // Restore original photo if modified by LiYing or Evoto AI
  function restoreOriginalPhoto(photo) {
    if (!photo || !photo._originalBackup) return false;
    var b = photo._originalBackup;
    photo.file = b.file;
    photo.src = b.src;
    if (b.thumb) photo.thumb = b.thumb;
    if (b.editedThumb) photo.editedThumb = b.editedThumb;
    if (b.dataUrl) photo._devstuDataUrl = b.dataUrl;
    if (b.width) photo.width = b.width;
    if (b.height) photo.height = b.height;
    photo._isAiVersion = false;

    if (typeof window._devstuReloadPhoto === 'function') {
      window._devstuReloadPhoto(photo);
    } else {
      if (window._devstuViewer) {
        try { window._devstuViewer.forget(); } catch (e) {}
        try { if (window._devstuViewer.pre) window._devstuViewer.pre.delete(photo.id); } catch (e) {}
      }
      if (window._devstuStage && typeof window._devstuStage.loadPhoto === 'function') {
        try { window._devstuStage.loadPhoto(photo); } catch (e) {}
      }
      if (window._devstuA) {
        try { window._devstuA.emit('photos'); } catch (e) {}
        try { window._devstuA.emit('current'); } catch (e) {}
        try { window._devstuA.emit('state'); } catch (e) {}
        try { window._devstuA.emit('thumbs'); } catch (e) {}
      }
    }
    return true;
  }

  // Execute LiYing Background Replacement (RMBG-1.4 + Pose Alignment)
  // UPDATED: Modifies current photo IN-PLACE with undo/restore support, NEVER creates extra files!
  async function runLiyingBackgroundReplacement(photo, options) {
    photo = photo || (window._devstuA ? window._devstuA.current : null);
    if (!photo) throw new Error('Không có ảnh đang chọn');
    options = options || {};

    // Backup original photo before first modification
    if (!photo._originalBackup) {
      var origUrl = await getPhotoDataUrl(photo);
      photo._originalBackup = {
        file: photo.file,
        src: photo.src,
        thumb: photo.thumb,
        editedThumb: photo.editedThumb,
        dataUrl: photo._devstuDataUrl || origUrl,
        width: photo.width,
        height: photo.height
      };
    }

    var dataUrl = (photo._originalBackup && photo._originalBackup.dataUrl) || (await getPhotoDataUrl(photo));
    if (!dataUrl) throw new Error('Không đọc được dữ liệu ảnh gốc');

    var color = options.color || 'blue';
    var transparent = Boolean(options.transparent);
    var straighten = Boolean(options.straighten);
    var levelOnly = Boolean(options.levelOnly);

    var resp = await fetch('/api/liying_change_background', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_base64: dataUrl,
        color: color,
        transparent: transparent,
        straighten: straighten,
        level_only: levelOnly
      })
    });

    var res = await resp.json();
    if (!res || !res.ok || !res.data_url) {
      throw new Error(res && res.error ? res.error : 'Máy chủ LiYing AI không phản hồi');
    }

    var baseName = (photo.name || (photo.file && photo.file.name) || 'photo').replace(/\.[^.]+$/, '');
    var suffix = levelOnly ? '_can_vai.png' : ('_nen_' + (options.label || color) + '.png');
    var filename = baseName + suffix;

    await applyInPlaceResult(photo, res.data_url, filename, true);

    return res;
  }

  // Execute Evoto Hair Dye (H01-H13 + Sliders)
  // UPDATED: Modifies current photo IN-PLACE with undo/restore support, NEVER creates extra files!
  async function runEvotoHairDye(photo, preset, options) {
    photo = photo || (window._devstuA ? window._devstuA.current : null);
    if (!photo) throw new Error('Không có ảnh đang chọn');
    options = options || {};

    if (!preset || preset === 'none') {
      restoreOriginalPhoto(photo);
      return { ok: true, restored: true };
    }

    var dataUrl = await getPhotoDataUrl(photo);
    if (!dataUrl) throw new Error('Không đọc được dữ liệu ảnh gốc');

    // Extract or get cached MediaPipe hair mask
    var maskB64 = await ensurePhotoAiMask(photo);

    var strength = typeof options.strength === 'number' ? options.strength : 65;
    var darken = typeof options.darken === 'number' ? options.darken : 0;
    var shine = typeof options.shine === 'number' ? options.shine : 0;
    var gray = typeof options.gray === 'number' ? options.gray : 0;
    var unify = typeof options.unify === 'number' ? options.unify : 0;
    var smooth = typeof options.smooth === 'number' ? options.smooth : 0;

    var resp = await fetch('/api/evoto_hair_dye', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_base64: dataUrl,
        mask_base64: maskB64,
        preset: preset,
        strength: strength,
        darken: darken,
        shine: shine,
        gray: gray,
        unify: unify,
        smooth: smooth
      })
    });

    var res = await resp.json();
    if (!res || !res.ok || !res.data_url) {
      throw new Error(res && res.error ? res.error : 'Bộ xử lý tóc Collabs Evoto không phản hồi');
    }

    // Backup original photo if not yet stored
    if (!photo._originalBackup) {
      photo._originalBackup = {
        file: photo.file,
        src: photo.src,
        thumb: photo.thumb,
        editedThumb: photo.editedThumb,
        dataUrl: photo._devstuDataUrl || dataUrl
      };
    }

    var baseName = (photo.name || (photo.file && photo.file.name) || 'photo').replace(/\.[^.]+$/, '');
    var code = (options.code || preset).toUpperCase();
    var filename = baseName + '_' + code + '.png';

    await applyInPlaceResult(photo, res.data_url, filename, true);

    return res;
  }

  // Extract high-res RMBG-1.4 matte from backend or cache
  async function ensurePhotoAiMatte(photo) {
    if (!photo) return null;
    if (photo._aiMatteDataUrl) return photo._aiMatteDataUrl;

    var dataUrl = await getPhotoDataUrl(photo);
    if (!dataUrl) return null;

    try {
      var resp = await fetch('/api/extract_matte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: dataUrl })
      });
      var res = await resp.json();
      if (res && res.ok && res.matte_data_url) {
        photo._aiMatteDataUrl = res.matte_data_url;
        return res.matte_data_url;
      }
    } catch (e) {
      console.warn('[CollabsAI] extract_matte failed:', e);
    }
    return null;
  }

  function loadImageElement(url) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload = function() { resolve(img); };
      img.onerror = reject;
      img.src = url;
    });
  }

  // Composite subject and background matching Collabs Retouch Pro Rust SIMD
  async function applyCollabsBgComposite(photo, options) {
    photo = photo || (window._devstuA ? window._devstuA.current : null);
    if (!photo) throw new Error('Không có ảnh đang chọn');
    options = options || {};

    var mode = options.mode || 'original';
    if (mode === 'original') {
      restoreOriginalPhoto(photo);
      return { ok: true, restored: true };
    }

    // Ensure original backup
    if (!photo._originalBackup) {
      var origUrl = await getPhotoDataUrl(photo);
      photo._originalBackup = {
        file: photo.file,
        src: photo.src,
        thumb: photo.thumb,
        editedThumb: photo.editedThumb,
        dataUrl: photo._devstuDataUrl || origUrl
      };
    }

    var baseDataUrl = photo._originalBackup.dataUrl;
    var matteUrl = photo._aiMatteDataUrl;
    if (!matteUrl) {
      try {
        matteUrl = await ensurePhotoAiMatte(photo);
      } catch (e) {
        console.warn('[CollabsAI] ensurePhotoAiMatte error:', e);
      }
    }
    if (!matteUrl) {
      matteUrl = photo._aiSceneMaskBase64 || photo._aiMaskBase64;
    }
    if (!matteUrl) {
      try {
        matteUrl = await ensurePhotoAiMask(photo);
      } catch (e) {
        console.warn('[CollabsAI] ensurePhotoAiMask error:', e);
      }
    }
    if (!matteUrl) throw new Error('Không trích xuất được mặt nạ nền AI (RMBG-1.4)');

    var origImg = await loadImageElement(baseDataUrl);
    var maskImg = await loadImageElement(matteUrl);

    var nw = origImg.naturalWidth || photo.width || 1200;
    var nh = origImg.naturalHeight || photo.height || 1600;
    var scale = Math.min(1, 2400 / Math.max(nw, nh));
    var w = Math.max(1, Math.round(nw * scale));
    var h = Math.max(1, Math.round(nh * scale));

    var outCanvas = document.createElement('canvas');
    outCanvas.width = w;
    outCanvas.height = h;
    var ctx = outCanvas.getContext('2d');

    var bgOpacity = Math.max(0, Math.min(1, (options.opacity !== undefined ? options.opacity : 100) / 100));

    // 1. Draw chosen background
    if (mode === 'transparent') {
      ctx.clearRect(0, 0, w, h);
    } else {
      if (bgOpacity < 0.999 || options.fillArea === 'outer_only') {
        ctx.drawImage(origImg, 0, 0, w, h);
      }
      ctx.save();
      if (bgOpacity < 0.999) ctx.globalAlpha = bgOpacity;

      if (mode === 'pure_white') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
      } else if (mode === 'custom_color') {
        ctx.fillStyle = /^#[0-9a-fA-F]{6}$/.test(options.color || '') ? options.color : '#e8eef5';
        ctx.fillRect(0, 0, w, h);
      } else if (mode === 'custom_image' && options.customImage) {
        try {
          var bgImg = await loadImageElement(options.customImage);
          var bsw = bgImg.naturalWidth || 1;
          var bsh = bgImg.naturalHeight || 1;
          var zoom = 1 + Math.max(0, Math.min(100, options.scale || 0)) / 100;
          var offX = ((options.offsetX || 0) / 100) * w * 0.45;
          var offY = ((options.offsetY || 0) / 100) * h * 0.45;
          var dw = w * zoom;
          var dh = h * zoom;
          ctx.drawImage(bgImg, (w - dw) * 0.5 + offX, (h - dh) * 0.5 + offY, dw, dh);
        } catch (_) {
          ctx.fillStyle = '#e8eef5';
          ctx.fillRect(0, 0, w, h);
        }
      } else {
        var rGrad = ctx.createRadialGradient(w * 0.5, h * 0.36, w * 0.05, w * 0.5, h * 0.4, Math.max(w, h) * 0.72);
        if (mode === 'warm_beige') {
          rGrad.addColorStop(0, '#ad9387');
          rGrad.addColorStop(1, '#8a7368');
        } else if (mode === 'studio_grey') {
          rGrad.addColorStop(0, '#b5b9c0');
          rGrad.addColorStop(1, '#6f737a');
        } else if (mode === 'slate_grey_03') {
          rGrad.addColorStop(0, '#7c7a82');
          rGrad.addColorStop(1, '#58565f');
        } else if (mode === 'fabric_02') {
          rGrad.addColorStop(0, '#555c68');
          rGrad.addColorStop(1, '#1c1f25');
        } else if (mode === 'passport_blue') {
          rGrad.addColorStop(0, '#2e7ad8');
          rGrad.addColorStop(1, '#2366bf');
        } else if (mode === 'pastel_pink') {
          rGrad.addColorStop(0, '#f7dce1');
          rGrad.addColorStop(1, '#e8bdc6');
        } else if (mode === 'sage_green') {
          rGrad.addColorStop(0, '#b2ccb9');
          rGrad.addColorStop(1, '#8aa694');
        } else if (mode === 'lavender_mist') {
          rGrad.addColorStop(0, '#ddd6f3');
          rGrad.addColorStop(1, '#beb3e0');
        } else {
          rGrad.addColorStop(0, '#252830');
          rGrad.addColorStop(1, '#08090c');
        }
        ctx.fillStyle = rGrad;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();
    }

    // 2. Cutout foreground using continuous neural probability
    var fgCanvas = document.createElement('canvas');
    fgCanvas.width = w;
    fgCanvas.height = h;
    var fgCtx = fgCanvas.getContext('2d');
    fgCtx.drawImage(origImg, 0, 0, w, h);
    var fgData = fgCtx.getImageData(0, 0, w, h);

    var mCanvas = document.createElement('canvas');
    mCanvas.width = w;
    mCanvas.height = h;
    var mCtx = mCanvas.getContext('2d');
    mCtx.drawImage(maskImg, 0, 0, w, h);
    var mPixels = mCtx.getImageData(0, 0, w, h).data;

    var edgeShift = -((options.edgeAdjust || 0) / 360);
    var edgeMode = options.edgeMode || 'auto';

    function smoothstep(lo, hi, x) {
      var t = Math.max(0, Math.min(1, (x - lo) / (hi - lo)));
      return t * t * (3 - 2 * t);
    }

    var px = fgData.data;
    for (var i = 0; i < px.length; i += 4) {
      var rawMatte = mPixels[i] / 255;
      var a = edgeShift !== 0 ? Math.max(0, Math.min(1, rawMatte - edgeShift)) : rawMatte;
      if (edgeMode === 'crisp') {
        a = smoothstep(0.28, 0.72, a);
      } else if (edgeMode === 'soft') {
        a = smoothstep(0.01, 0.94, a);
      }
      px[i + 3] = Math.round(a * 255);
    }
    fgCtx.putImageData(fgData, 0, 0);

    // 3. Drop Shadow
    var shMode = options.shadowMode || 'none';
    var shOp = Math.max(0, Math.min(1, (options.shadowOpacity !== undefined ? options.shadowOpacity : 25) / 100));
    if (shMode !== 'none' && shOp > 0.01) {
      var shBlur = Math.max(1, ((options.shadowBlur || 25) / 100) * Math.min(w, h) * 0.05);
      var shiftFrac = (options.shadowShift || 0) / 100;
      var offX = shMode === 'realistic' ? w * (0.036 + shiftFrac * 0.04) : w * 0.01 * (1 + shiftFrac);
      var offY = shMode === 'realistic' ? h * 0.014 : h * 0.018 * (1 + shiftFrac);

      ctx.save();
      if (mode !== 'transparent') {
        ctx.globalCompositeOperation = options.shadowBlendMode === 'soft_light' ? 'soft-light' : 'multiply';
      }
      ctx.shadowColor = 'rgba(10, 12, 16, ' + (shOp * 0.65).toFixed(3) + ')';
      ctx.shadowBlur = shMode === 'flat' ? shBlur * 0.35 : shBlur;
      ctx.shadowOffsetX = offX;
      ctx.shadowOffsetY = offY;
      ctx.drawImage(fgCanvas, 0, 0);
      ctx.restore();
    }

    // 4. Ground Reflection
    if (options.groundReflection) {
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.translate(0, h * 1.8);
      ctx.scale(1, -0.8);
      ctx.drawImage(fgCanvas, 0, 0);
      ctx.restore();
    }

    // 5. Draw foreground
    ctx.drawImage(fgCanvas, 0, 0);

    var outDataUrl = mode === 'transparent'
      ? outCanvas.toDataURL('image/png')
      : outCanvas.toDataURL('image/jpeg', 0.95);

    var baseName = (photo.name || (photo.file && photo.file.name) || 'photo').replace(/\.[^.]+$/, '');
    var filename = baseName + '_nen_' + mode + (mode === 'transparent' ? '.png' : '.jpg');

    await applyInPlaceResult(photo, outDataUrl, filename, true);

    return { ok: true, data_url: outDataUrl };
  }

  window.CollabsDevstuAI = {
    EVOTO_HAIR_SPECS: EVOTO_HAIR_SPECS,
    dataURLtoFile: dataURLtoFile,
    getPhotoDataUrl: getPhotoDataUrl,
    ensurePhotoAiMask: ensurePhotoAiMask,
    ensurePhotoAiMatte: ensurePhotoAiMatte,
    applyCollabsBgComposite: applyCollabsBgComposite,
    runLiyingBackgroundReplacement: runLiyingBackgroundReplacement,
    runEvotoHairDye: runEvotoHairDye,
    restoreOriginalPhoto: restoreOriginalPhoto
  };

})(window);
