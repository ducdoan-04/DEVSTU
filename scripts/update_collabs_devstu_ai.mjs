import fs from 'fs';

const filePath = 'assets/collabs_devstu_ai.js';
let code = fs.readFileSync(filePath, 'utf8');

// Replace restoreOriginalPhoto and runLiyingBackgroundReplacement and runEvotoHairDye and applyCollabsBgComposite
// Let's create the updated collabs_devstu_ai.js with applyInPlaceResult helper.

const oldRestoreAndLiying = `  // Restore original photo if modified by LiYing or Evoto AI
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

    var baseName = (photo.name || (photo.file && photo.file.name) || 'photo').replace(/\\.[^.]+$/, '');
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
  }`;

const newRestoreAndLiying = `  // Apply in-place result to photo with proper DEVSTU WebGL GPU texture reload
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

    var baseName = (photo.name || (photo.file && photo.file.name) || 'photo').replace(/\\.[^.]+$/, '');
    var suffix = levelOnly ? '_can_vai.png' : ('_nen_' + (options.label || color) + '.png');
    var filename = baseName + suffix;

    await applyInPlaceResult(photo, res.data_url, filename, true);

    return res;
  }`;

console.log('Match oldRestoreAndLiying:', code.includes(oldRestoreAndLiying));
if (code.includes(oldRestoreAndLiying)) {
  code = code.replace(oldRestoreAndLiying, newRestoreAndLiying);
} else {
  console.error('oldRestoreAndLiying not found');
}

// Next: hair dye replacement
const oldHairDyeEnd = `    var baseName = (photo.name || (photo.file && photo.file.name) || 'photo').replace(/\\.[^.]+$/, '');
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

    return res;`;

const newHairDyeEnd = `    var baseName = (photo.name || (photo.file && photo.file.name) || 'photo').replace(/\\.[^.]+$/, '');
    var code = (options.code || preset).toUpperCase();
    var filename = baseName + '_' + code + '.png';

    await applyInPlaceResult(photo, res.data_url, filename, true);

    return res;`;

console.log('Match oldHairDyeEnd:', code.includes(oldHairDyeEnd));
if (code.includes(oldHairDyeEnd)) {
  code = code.replace(oldHairDyeEnd, newHairDyeEnd);
} else {
  console.error('oldHairDyeEnd not found');
}

// Next: applyCollabsBgComposite
const oldBgCompEnd = `    var outDataUrl = mode === 'transparent'
      ? outCanvas.toDataURL('image/png')
      : outCanvas.toDataURL('image/jpeg', 0.95);

    var baseName = (photo.name || (photo.file && photo.file.name) || 'photo').replace(/\\.[^.]+$/, '');
    var newFile = dataURLtoFile(outDataUrl, baseName + '_nen_' + mode + (mode === 'transparent' ? '.png' : '.jpg'));

    photo.file = newFile;
    photo.src = URL.createObjectURL(newFile);
    photo._devstuDataUrl = outDataUrl;
    photo._isAiVersion = true;

    try {
      if (typeof createImageBitmap === 'function') {
        createImageBitmap(newFile, { resizeWidth: 160, resizeHeight: 120, resizeQuality: 'medium' }).then(function(bmp) {
          photo.thumb = bmp;
          if (window._devstuA) window._devstuA.emit('thumbs');
        }).catch(function() {});
      }
    } catch (e) {}

    if (window._devstuStage && typeof window._devstuStage.loadPhoto === 'function') {
      try { window._devstuStage.loadPhoto(photo); } catch (e) {}
    }
    if (window._devstuA) {
      window._devstuA.emit('photos');
      window._devstuA.emit('current');
    }

    return { ok: true, data_url: outDataUrl };`;

const newBgCompEnd = `    var outDataUrl = mode === 'transparent'
      ? outCanvas.toDataURL('image/png')
      : outCanvas.toDataURL('image/jpeg', 0.95);

    var baseName = (photo.name || (photo.file && photo.file.name) || 'photo').replace(/\\.[^.]+$/, '');
    var filename = baseName + '_nen_' + mode + (mode === 'transparent' ? '.png' : '.jpg');

    await applyInPlaceResult(photo, outDataUrl, filename, true);

    return { ok: true, data_url: outDataUrl };`;

console.log('Match oldBgCompEnd:', code.includes(oldBgCompEnd));
if (code.includes(oldBgCompEnd)) {
  code = code.replace(oldBgCompEnd, newBgCompEnd);
} else {
  console.error('oldBgCompEnd not found');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('collabs_devstu_ai.js successfully updated!');
