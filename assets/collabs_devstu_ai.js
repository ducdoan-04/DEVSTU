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

  // Restore original photo if modified by LiYing or Evoto AI
  function restoreOriginalPhoto(photo) {
    if (!photo || !photo._originalBackup) return false;
    var b = photo._originalBackup;
    photo.file = b.file;
    photo.src = b.src;
    if (b.thumb) photo.thumb = b.thumb;
    if (b.editedThumb) photo.editedThumb = b.editedThumb;
    if (b.dataUrl) photo._devstuDataUrl = b.dataUrl;
    photo._isAiVersion = false;

    if (window._devstuStage && typeof window._devstuStage.loadPhoto === 'function') {
      try { window._devstuStage.loadPhoto(photo); } catch (e) {}
    }
    if (window._devstuA) {
      window._devstuA.emit('photos');
      window._devstuA.emit('current');
    }
    return true;
  }

  // Execute LiYing Background Replacement (RMBG-1.4 + Pose Alignment)
  // UPDATED: Modifies current photo IN-PLACE with undo/restore support, NEVER creates extra files!
  async function runLiyingBackgroundReplacement(photo, options) {
    photo = photo || (window._devstuA ? window._devstuA.current : null);
    if (!photo) throw new Error('Không có ảnh đang chọn');
    options = options || {};

    var dataUrl = await getPhotoDataUrl(photo);
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
    var suffix = levelOnly ? '_can_vai.png' : ('_nen_' + (options.label || color) + '.png');
    var newFile = dataURLtoFile(res.data_url, baseName + suffix);

    // Apply in-place onto the current photo
    photo.file = newFile;
    photo.src = URL.createObjectURL(newFile);
    photo._devstuDataUrl = res.data_url;
    photo._isAiVersion = true;

    // Update thumbnail bitmap
    try {
      if (typeof createImageBitmap === 'function') {
        createImageBitmap(newFile, { resizeWidth: 160, resizeHeight: 120, resizeQuality: 'medium' }).then(function(bmp) {
          photo.thumb = bmp;
          if (window._devstuA) window._devstuA.emit('thumbs');
        }).catch(function() {});
      }
    } catch (e) {}

    // Reload active stage viewer & inform DEVSTU
    if (window._devstuStage && typeof window._devstuStage.loadPhoto === 'function') {
      try { window._devstuStage.loadPhoto(photo); } catch (e) {}
    }
    if (window._devstuA) {
      window._devstuA.emit('photos');
      window._devstuA.emit('current');
    }

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
    var newFile = dataURLtoFile(res.data_url, baseName + '_' + code + '.png');

    // Apply in-place onto the current photo
    photo.file = newFile;
    photo.src = URL.createObjectURL(newFile);
    photo._devstuDataUrl = res.data_url;
    photo._isAiVersion = true;

    // Update thumbnail bitmap
    try {
      if (typeof createImageBitmap === 'function') {
        createImageBitmap(newFile, { resizeWidth: 160, resizeHeight: 120, resizeQuality: 'medium' }).then(function(bmp) {
          photo.thumb = bmp;
          if (window._devstuA) window._devstuA.emit('thumbs');
        }).catch(function() {});
      }
    } catch (e) {}

    // Reload active stage viewer & inform DEVSTU
    if (window._devstuStage && typeof window._devstuStage.loadPhoto === 'function') {
      try { window._devstuStage.loadPhoto(photo); } catch (e) {}
    }
    if (window._devstuA) {
      window._devstuA.emit('photos');
      window._devstuA.emit('current');
    }

    return res;
  }

  window.CollabsDevstuAI = {
    EVOTO_HAIR_SPECS: EVOTO_HAIR_SPECS,
    dataURLtoFile: dataURLtoFile,
    getPhotoDataUrl: getPhotoDataUrl,
    ensurePhotoAiMask: ensurePhotoAiMask,
    runLiyingBackgroundReplacement: runLiyingBackgroundReplacement,
    runEvotoHairDye: runEvotoHairDye,
    restoreOriginalPhoto: restoreOriginalPhoto
  };

})(window);
