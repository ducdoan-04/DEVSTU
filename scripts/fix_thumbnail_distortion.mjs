import fs from 'fs';

const filePath = 'assets/collabs_devstu_ai.js';
let code = fs.readFileSync(filePath, 'utf8');

// Target applyInPlaceResult in collabs_devstu_ai.js
const oldApplyInPlace = `  // Apply in-place result to photo with proper DEVSTU WebGL GPU texture reload
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
  }`;

const newApplyInPlace = `  // Calculate thumbnail dimensions maintaining exact aspect ratio
  function calcThumbDimensions(w, h, maxDim) {
    maxDim = maxDim || 360;
    var scale = Math.min(1, maxDim / Math.max(w, h));
    return {
      width: Math.max(1, Math.round(w * scale)),
      height: Math.max(1, Math.round(h * scale))
    };
  }

  // Apply in-place result to photo with proper DEVSTU WebGL GPU texture reload
  async function applyInPlaceResult(photo, dataUrl, filename, isAi) {
    var newFile = dataURLtoFile(dataUrl, filename);

    // Create ImageBitmap and proportional thumbnails
    var newBmp = null;
    var newThumb = null;
    try {
      if (typeof createImageBitmap === 'function') {
        newBmp = await createImageBitmap(newFile);
        var tDim = calcThumbDimensions(newBmp.width, newBmp.height, 360);
        newThumb = await createImageBitmap(newBmp, {
          resizeWidth: tDim.width,
          resizeHeight: tDim.height,
          resizeQuality: 'high'
        });
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
    
    // Close previous thumbnails to prevent memory leaks and clear stale cache
    if (photo.editedThumb && typeof photo.editedThumb.close === 'function') {
      try { photo.editedThumb.close(); } catch (e) {}
    }
    photo.editedThumb = null;

    if (newThumb) {
      if (photo.thumb && typeof photo.thumb.close === 'function') {
        try { photo.thumb.close(); } catch (e) {}
      }
      photo.thumb = newThumb;
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
  }`;

console.log('Match oldApplyInPlace:', code.includes(oldApplyInPlace));
if (code.includes(oldApplyInPlace)) {
  code = code.replace(oldApplyInPlace, newApplyInPlace);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Successfully updated assets/collabs_devstu_ai.js with proportional thumbnails!');
} else {
  console.error('oldApplyInPlace not found in assets/collabs_devstu_ai.js');
}
