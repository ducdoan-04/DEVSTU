// assets/stu_ultra_max_module.js - STU Ultra Max powered 100% by 9. LK Magic Pro (aipic.dll via aipic_bridge.exe)
(function() {
  'use strict';
  if (window.StuUltraMax) return;

  var COHORT_DEFS = [
    { key: 'female', label: 'Nữ', sex: 2, age: 2 },
    { key: 'male', label: 'Nam', sex: 1, age: 2 },
    { key: 'child', label: 'Trẻ Con', sex: 2, age: 1 },
    { key: 'elder_female', label: 'Nữ Lớn Tuổi', sex: 2, age: 3 },
    { key: 'elder_male', label: 'Nam Lớn Tuổi', sex: 1, age: 3 }
  ];

  var CLOTH_TABS = [
    { key: 'all', label: 'tất cả', index: 0 },
    { key: 'female', label: 'Nữ', index: 1, sex: 2, age: 2 },
    { key: 'male', label: 'Nam', index: 2, sex: 1, age: 2 },
    { key: 'child', label: 'Trẻ em', index: 3, sex: 2, age: 1 },
    { key: 'elder_female', label: 'Bà', index: 4, sex: 2, age: 3 },
    { key: 'elder_male', label: 'Ông', index: 5, sex: 1, age: 3 }
  ];

  var MASK_TARGETS = [
    { key: 'whole_background', layer_type: 2, label: 'Tổng thể nền' },
    { key: 'grass', layer_type: 2, label: 'Thảm cỏ' },
    { key: 'sky', layer_type: 2, label: 'Bầu trời' },
    { key: 'fluid', layer_type: 2, label: 'Mặt nước' },
    { key: 'sand', layer_type: 2, label: 'Bãi cát' },
    { key: 'mountain', layer_type: 2, label: 'Núi' },
    { key: 'building', layer_type: 2, label: 'Kiến trúc' },
    { key: 'all_person', layer_type: 0, label: 'Tất cả mọi người' },
    { key: 'all', layer_type: 3, label: 'Chủ thể' }
  ];

  var HSL_COLORS = [
    { key: 'red', code: 1, label: 'Đỏ', hex: '#ef4444' },
    { key: 'orange', code: 2, label: 'Cam', hex: '#f97316' },
    { key: 'yellow', code: 3, label: 'Vàng', hex: '#eab308' },
    { key: 'green', code: 4, label: 'Xanh lá', hex: '#22c55e' },
    { key: 'lightgreen', code: 5, label: 'Xanh nhạt', hex: '#06b6d4' },
    { key: 'blue', code: 6, label: 'Xanh dương', hex: '#3b82f6' },
    { key: 'purple', code: 7, label: 'Tím', hex: '#a855f7' },
    { key: 'magenta', code: 8, label: 'Đỏ tươi', hex: '#ec4899' }
  ];

  var CURVE_CHANNELS = [
    { code: 0, label: 'RGB', color: '#e4e4e7' },
    { code: 1, label: 'Đỏ', color: '#f87171' },
    { code: 2, label: 'Lục', color: '#4ade80' },
    { code: 3, label: 'Lam', color: '#60a5fa' }
  ];

  var SKY_CATS = [
    { key: 'blueSky', label: 'Trời xanh' },
    { key: 'cloudy', label: 'Mây' },
    { key: 'afterGlow', label: 'Hoàng hôn' }
  ];

  var SKY_SLIDERS = [
    { ename: 'horizontal_movement', label: 'Di chuyển ngang', min: -100, max: 100, def: 0 },
    { ename: 'vertical_movement', label: 'Di chuyển dọc', min: -100, max: 100, def: 0 },
    { ename: 'edge_sky_transition', label: 'Chuyển tiếp viền bầu trời', min: 0, max: 100, def: 0 },
    { ename: 'sky_opacity', label: 'Độ trong suốt bầu trời', min: 1, max: 100, def: 100 },
    { ename: 'sky_virtualization', label: 'Làm mờ bầu trời', min: 0, max: 100, def: 0 },
    { ename: 'sky_color_fusion', label: 'Hòa trộn màu sắc bầu trời', min: 0, max: 100, def: 50 }
  ];

  var RAIL_MODULES = [
    { id: 'color', label: 'Màu sắc', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1.1.9-2 2-2h2.3A4.7 4.7 0 0 0 22 9.8C22 5.9 17.5 3 12 3zm-4.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4.5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>' },
    { id: 'beauty', label: 'Chân dung', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4a4 4 0 0 1 4 4c0 1.9-1.1 3.7-2.6 4.4A3.5 3.5 0 0 1 12 13a3.5 3.5 0 0 1-1.4-.6C9.1 11.7 8 9.9 8 8a4 4 0 0 1 4-4zm0 10.5c3.9 0 7 1.9 7 4.3V20H5v-1.2c0-2.4 3.1-4.3 7-4.3zM19.5 3l.6 1.4L21.5 5l-1.4.6-.6 1.4-.6-1.4L17.5 5l1.4-.6.6-1.4z"/></svg>' },
    { id: 'background', label: 'Nền', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>' },
    { id: 'clothing', label: 'Quần áo', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 4l4 2.5-1.8 3.7L16 9v11H8V9l-2.2 1.2L4 6.5 8 4c.8 1.2 2.2 2 4 2s3.2-.8 4-2z"/></svg>' },
    { id: 'camera', label: 'Kết nối máy ảnh', icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 4l-1.5 2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.5L15 4H9zm3 13a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"/><circle cx="12" cy="12.5" r="2.5"/></svg>' },
    { id: 'liquify', label: 'Nắn bóp thủ công', isLiquify: true, icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 2a1.3 1.3 0 0 0-1.3 1.3v6.2h-.9V4.8a1.3 1.3 0 1 0-2.6 0v5.7h-.8V7a1.2 1.2 0 1 0-2.4 0v8.2c0 3.7 2.8 6.8 6.8 6.8 3.4 0 6.2-2.5 6.6-5.9l.6-5.3a1.3 1.3 0 0 0-2.6-.3l-.3 2.5h-.9V3.3A1.3 1.3 0 0 0 12.5 2z"/></svg>' }
  ];

  // Quick local genre preset recipes using verified algorithmids & scales
  var GENRE_PRESETS = {
    clean_natural: {
      name: 'Tự nhiên trong trẻo',
      colorParams: [
        { id: 130005, algorithm: { value: 0.15 } },
        { id: 130010, algorithm: { value: 6 } },
        { id: 130013, algorithm: { value: 8 } }
      ],
      beautyParams: [
        { id: 220003, algorithm: { value: 45 } },
        { id: 220012, algorithm: { value: 30 } },
        { id: 220008, algorithm: { value: 35 } }
      ]
    },
    wedding: {
      name: 'Ảnh Cưới (Wedding)',
      colorParams: [
        { id: 220073, algorithm: { value: 35 } },
        { id: 130005, algorithm: { value: 0.25 } },
        { id: 130006, algorithm: { value: -15 } },
        { id: 130013, algorithm: { value: 14 } }
      ],
      beautyParams: [
        { id: 220003, algorithm: { value: 65 } },
        { id: 220012, algorithm: { value: 45 } },
        { id: 220017, algorithm: { value: 0.25 } },
        { id: 201001, algorithm: { value: 35, brightness_value: 100, yellowing_value: 100 } }
      ]
    },
    studio: {
      name: 'Studio Chân Dung',
      colorParams: [
        { id: 130010, algorithm: { value: 10 } },
        { id: 130012, algorithm: { amount: 1.5, radius: 1.0 } }
      ],
      beautyParams: [
        { id: 220003, algorithm: { value: 70 } },
        { id: 220014, algorithm: { value: 40 } },
        { id: 220012, algorithm: { value: 50 } },
        { id: 220025, algorithm: { value: 25 } },
        { id: 220026, algorithm: { value: 20 } },
        { id: 240001, algorithm: { value: 0.35, eyewhite_enhance_value: 100, eyewhite_lighter_value: 100, eyewhite_yellow_value: 0 } }
      ]
    },
    outdoor: {
      name: 'Ngoại Cảnh Nắng',
      colorParams: [
        { id: 220073, algorithm: { value: 30 } },
        { id: 130006, algorithm: { value: -20 } },
        { id: 130008, algorithm: { value: 22 } },
        { id: 130013, algorithm: { value: 18 } }
      ],
      beautyParams: [
        { id: 220003, algorithm: { value: 50 } },
        { id: 220012, algorithm: { value: 35 } }
      ]
    },
    corporate_exec: {
      name: 'Doanh Nhân / Ảnh Thẻ',
      colorParams: [
        { id: 130010, algorithm: { value: 8 } },
        { id: 130018, algorithm: { value: 10 } }
      ],
      beautyParams: [
        { id: 220003, algorithm: { value: 60 } },
        { id: 220008, algorithm: { value: 45 } },
        { id: 220014, algorithm: { value: 50 } },
        { id: 202004, algorithm: { value: 40, bg_value: 100, fg_value: 100 } }
      ]
    }
  };

  function postJson(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    }).then(function(r) {
      return r.json().catch(function() { return { ok: false, error: 'HTTP ' + r.status }; });
    });
  }

  function clone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function roundScope(val, scope) {
    var s = Number(scope);
    if (!s || isNaN(s)) s = 1;
    return Math.round(Number(val) * s * 10000) / 10000;
  }

  function unscaleScope(rawVal, scope) {
    var s = Number(scope);
    if (!s || isNaN(s)) s = 1;
    return Math.round((Number(rawVal) / s) * 100) / 100;
  }

  function toast(msg, type) {
    var el = document.getElementById('stu-max-toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'stu-max-toast show' + (type ? ' ' + type : '');
    clearTimeout(el._timer);
    el._timer = setTimeout(function() { el.classList.remove('show'); }, 3200);
  }

  function assetUrl(item) {
    if (!item) return '';
    var p = item.scene || item.file_path || '';
    if (!p && item.path) p = item.path;
    if (!p) return '';
    return '/api/lk_ultra_max/asset?path=' + encodeURIComponent(p);
  }

  function resolvePreviewSrc(res) {
    if (!res) return '';
    if (res.preview_url) return res.preview_url;
    if (res.preview_path) {
      return '/api/lk_ultra_max/file?path=' + encodeURIComponent(res.preview_path) + '&t=' + Date.now();
    }
    return res.preview_data_url || '';
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function extractOrigDataUrl(photo) {
    return new Promise(function(resolve) {
      if (!photo) return resolve(null);
      if (photo._lkMaxOrigDataUrl) return resolve(photo._lkMaxOrigDataUrl);

      var finishDataUrl = function(dUrl, w, h) {
        if (dUrl) {
          photo._lkMaxOrigDataUrl = dUrl;
          if (w && h) {
            photo._lkOrigW = w;
            photo._lkOrigH = h;
          }
        }
        resolve(dUrl || null);
      };

      var nameStr = String(photo.name || (photo.file && photo.file.name) || '');
      var blob = photo.file || (photo.src && photo.src.blob);
      var mimeStr = String((blob && blob.type) || '');
      var isPngSource = /png$/i.test(mimeStr) || /\.png$/i.test(nameStr);
      var isRawLike = Boolean(photo.isRaw || (photo.src && photo.src.kind === 'raw'))
        || /\.(dng|cr2|cr3|nef|nrw|arw|srf|sr2|raf|orf|rw2|pef|srw|3fr|fff|iiq|erf|mef|mos|mrw|raw|rwl|x3f|tif|tiff|heic|heif)$/i.test(nameStr)
        || /tiff|dng|raw|heic|heif/i.test(mimeStr);
      var isWebSafeBlob = /^image\/(jpeg|jpg|png|webp|bmp)$/i.test(mimeStr);

      var bitmapToDataUrl = function(bmp) {
        var c = document.createElement('canvas');
        c.width = bmp.width;
        c.height = bmp.height;
        var ctx = c.getContext('2d');
        ctx.drawImage(bmp, 0, 0);
        var w = bmp.width;
        var h = bmp.height;
        if (typeof bmp.close === 'function') bmp.close();
        // Use Q96 JPEG for camera/RAW/large photos so payload stays ~2-3 MB instead of 30+ MB PNG
        var url = isPngSource ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.96);
        return { url: url, w: w, h: h };
      };

      var decodeViaAppBitmap = function() {
        if (typeof window._devstuGetBitmap !== 'function') return Promise.reject(new Error('no _devstuGetBitmap'));
        var maxDim = Math.max(Number(photo.width) || 0, Number(photo.height) || 0, 4096);
        return Promise.resolve(window._devstuGetBitmap(photo, maxDim)).then(function(bmp) {
          if (!bmp || !bmp.width || !bmp.height) throw new Error('empty bitmap');
          return bitmapToDataUrl(bmp);
        });
      };

      var decodeBlobOriented = function(b) {
        if (isRawLike) return decodeViaAppBitmap();
        if (typeof createImageBitmap === 'function') {
          return createImageBitmap(b, { imageOrientation: 'from-image' }).then(bitmapToDataUrl);
        }
        return decodeViaAppBitmap();
      };

      if (blob) {
        decodeBlobOriented(blob).catch(function() {
          return decodeViaAppBitmap();
        }).then(function(res) {
          finishDataUrl(res.url, res.w, res.h);
        }).catch(function() {
          if (isWebSafeBlob) {
            var fr = new FileReader();
            fr.onload = function() { finishDataUrl(fr.result, photo.width, photo.height); };
            fr.onerror = function() { resolve(null); };
            fr.readAsDataURL(blob);
          } else if (photo.processedDataUrl && typeof photo.processedDataUrl === 'string') {
            finishDataUrl(photo.processedDataUrl, photo.width, photo.height);
          } else {
            resolve(null);
          }
        });
        return;
      }

      if (isRawLike) {
        decodeViaAppBitmap().then(function(res) {
          finishDataUrl(res.url, res.w, res.h);
        }).catch(function() {
          if (photo.processedDataUrl && typeof photo.processedDataUrl === 'string') {
            finishDataUrl(photo.processedDataUrl, photo.width, photo.height);
          } else {
            resolve(null);
          }
        });
        return;
      }

      if (photo.src && typeof photo.src === 'string') {
        fetch(photo.src).then(function(r) { return r.blob(); }).then(function(b) {
          return decodeBlobOriented(b).catch(function() {
            return decodeViaAppBitmap();
          }).then(function(res) {
            finishDataUrl(res.url, res.w, res.h);
          }).catch(function() {
            if (/^image\/(jpeg|jpg|png|webp|bmp)$/i.test(b.type || '')) {
              var fr = new FileReader();
              fr.onload = function() { finishDataUrl(fr.result, photo.width, photo.height); };
              fr.onerror = function() { resolve(null); };
              fr.readAsDataURL(b);
            } else {
              resolve(null);
            }
          });
        }).catch(function() { resolve(null); });
        return;
      }

      if (photo.processedDataUrl && typeof photo.processedDataUrl === 'string') {
        finishDataUrl(photo.processedDataUrl, photo.width, photo.height);
        return;
      }
      resolve(null);
    });
  }

  function parseRefValue(algoObj) {
    var def = {
      overall_adjustment: { degree: 100, tone: 100, color: 100 },
      background: { degree: 100, tone: 100, color: 100 },
      localized_adjustment: [{ type_name: 'people', degree: 100, tone: 100, color: 100, showLine: true }]
    };
    if (!algoObj || !algoObj.value) return def;
    var parsed = algoObj.value;
    if (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed); } catch (e) { parsed = null; }
    }
    if (!parsed || typeof parsed !== 'object') return def;
    var locArr = Array.isArray(parsed.localized_adjustment) && parsed.localized_adjustment.length
      ? parsed.localized_adjustment
      : (parsed.person ? [Object.assign({ type_name: 'people', showLine: true }, parsed.person)] : []);
    var loc = locArr.length
      ? Object.assign({}, def.localized_adjustment[0], locArr[0])
      : def.localized_adjustment[0];
    return {
      overall_adjustment: Object.assign({}, def.overall_adjustment, parsed.overall_adjustment || {}),
      background: Object.assign({}, def.background, parsed.background || {}),
      localized_adjustment: [loc]
    };
  }

  function parseSkyValue(algoObj) {
    var defVals = {
      horizontal_movement: 0,
      vertical_movement: 0,
      edge_sky_transition: 0,
      sky_opacity: 100,
      sky_virtualization: 0,
      sky_color_fusion: 50
    };
    var out = { scene: '', value: Object.assign({}, defVals) };
    if (!algoObj) return out;
    var raw = algoObj.value;
    if (typeof raw === 'string') {
      try { raw = JSON.parse(raw); } catch (e) { raw = null; }
    }
    if (raw && typeof raw === 'object') {
      out.scene = raw.scene || algoObj.scene || '';
      out.value = Object.assign({}, defVals, raw.value || {});
    } else {
      out.scene = algoObj.scene || '';
      Object.keys(defVals).forEach(function(k) {
        if (algoObj[k] != null) out.value[k] = Number(algoObj[k]);
      });
    }
    return out;
  }

  function buildSkyAlgoPatch(scene, vals) {
    var defVals = {
      horizontal_movement: 0,
      vertical_movement: 0,
      edge_sky_transition: 0,
      sky_opacity: 100,
      sky_virtualization: 0,
      sky_color_fusion: 50
    };
    var vObj = {};
    Object.keys(defVals).forEach(function(k) {
      vObj[k] = (vals && vals[k] != null) ? Number(vals[k]) : defVals[k];
    });
    return { value: JSON.stringify({ scene: scene || '', value: vObj }) };
  }

  function createEmptyPhotoState() {
    return {
      fid: null,
      wsId: null,
      sourcePath: '',
      opening: false,
      openError: '',
      frameRect: null,
      detectFaces: [],
      detectMatting: null,
      detectSky: null,
      histogram: null,
      afterDataUrl: '',
      referThumbUrl: '',
      referPath: '',
      referName: '',
      referSampleId: '',
      referScope: 'all', // 'all' | 'person' | 'background'
      beautyCohorts: COHORT_DEFS.map(function(c) {
        return { sex: c.sex, age: c.age, params: [] };
      }),
      faceParams: {}, // classid -> { sex, age, classid, params: [] }
      colorParams: [],
      partialParams: [],
      bgMode: 'sys', // 'sys' | 'cus'
      bgEdge: 0,
      bgOpacity: 100,
      bgMaskScope: 1,
      bgCustomScenes: [],
      skyMode: 'sys',
      skyCat: 'blueSky',
      skyCustomScenes: [],
      clothCohortIdx: 0,
      clothValues: {}, // algoId -> [0,0,0,0,0]
      liquidParams: null,
      liquifyHistoryIdx: -1
    };
  }

  function ensureState(photo) {
    if (!photo) return createEmptyPhotoState();
    if (!photo._lkMaxState) photo._lkMaxState = createEmptyPhotoState();
    return photo._lkMaxState;
  }

  function openColorRefDb() {
    return new Promise(function(resolve, reject) {
      if (!window.indexedDB) { reject(new Error('No IndexedDB')); return; }
      var req = window.indexedDB.open('devstu_color_refs_v1', 1);
      req.onupgradeneeded = function() {
        var db = req.result;
        if (!db.objectStoreNames.contains('refs')) db.createObjectStore('refs', { keyPath: 'id' });
      };
      req.onsuccess = function() { resolve(req.result); };
      req.onerror = function() { reject(req.error || new Error('DB open error')); };
    });
  }

  function loadCustomColorRefs() {
    return openColorRefDb().then(function(db) {
      return new Promise(function(resolve) {
        var tx = db.transaction('refs', 'readonly');
        var req = tx.objectStore('refs').getAll();
        req.onsuccess = function() {
          var arr = Array.isArray(req.result) ? req.result : [];
          arr.sort(function(a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
          resolve(arr);
        };
        req.onerror = function() { resolve([]); };
      });
    }).catch(function() { return []; });
  }

  function saveCustomColorRef(item) {
    return openColorRefDb().then(function(db) {
      return new Promise(function(resolve) {
        var tx = db.transaction('refs', 'readwrite');
        tx.objectStore('refs').put(item);
        tx.oncomplete = function() { resolve(true); };
        tx.onerror = function() { resolve(false); };
      });
    }).catch(function() { return false; });
  }

  function deleteCustomColorRef(id) {
    return openColorRefDb().then(function(db) {
      return new Promise(function(resolve) {
        var tx = db.transaction('refs', 'readwrite');
        tx.objectStore('refs').delete(id);
        tx.oncomplete = function() { resolve(true); };
        tx.onerror = function() { resolve(false); };
      });
    }).catch(function() { return false; });
  }

  function makeRefThumbDataUrl(dataUrl) {
    return new Promise(function(resolve) {
      var img = new Image();
      img.onload = function() {
        try {
          var maxDim = 360;
          var scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
          var w = Math.max(1, Math.round((img.width || 1) * scale));
          var h = Math.max(1, Math.round((img.height || 1) * scale));
          var cv = document.createElement('canvas');
          cv.width = w; cv.height = h;
          cv.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(cv.toDataURL('image/jpeg', 0.85));
        } catch (e) { resolve(dataUrl); }
      };
      img.onerror = function() { resolve(dataUrl); };
      img.src = dataUrl;
    });
  }

  var StuUltraMax = {
    catalog: null,
    bgInfo: null,
    colorRefCatalog: { personal: [], presets: [] },
    customColorRefs: [],
    presets: [],
    bridgeReady: false,
    bridgeInitPromise: null,
    initError: '',

    activeModule: 'color', // 'color' | 'beauty' | 'background' | 'clothing' | 'camera' | 'liquify'
    colorTopTab: 'adjust', // 'ref' | 'adjust'
    colorScopeTab: 'basic', // 'basic' | 'mask'
    activeMaskKey: 'whole_background',
    activeCurveChannel: 0,
    activeHslColor: 'red',
    activeFilterGroupIdx: 0,
    activePortraitCohort: 'female', // 'female' | 'male' | 'child' | 'elder_female' | 'elder_male' | 'single' | 'all'
    selectedFaceClassId: null,
    makeupTabIdx: 0,
    eyeLightTabIdx: 0,
    bgBeautyMode: 610003,
    presetDrawerOpen: false,

    // Viewport state
    container: null,
    inspector: null,
    viewportEl: null,
    stageFlex: null,
    sbsBeforeWrap: null,
    sbsBeforeCanvas: null,
    sbsAfterTag: null,
    canvasWrap: null,
    beforeCanvas: null,
    afterCanvas: null,
    overlayCanvas: null,
    splitLine: null,
    navCard: null,
    navVisible: false,
    zoomMenu: null,
    headerRight: null,
    presetDrawer: null,
    compareMode: 0, // 0 = off, 1 = split slider, 2 = side-by-side
    splitPos: 0.5,
    holdOriginal: false,
    zoomScale: 0, // 0 = fit
    _fitScale: 1,
    _renderSeq: 0,
    _toolbarHooked: false,
    _loadedBeforeImg: null,
    _loadedAfterImg: null,
    _lastPhotoId: null,
    panX: 0,
    panY: 0,
    isPanning: false,

    // Liquify brush state
    liquifyActive: false,
    liquifyTool: 'push', // 'push' | 'pan'
    liquifySize: 50,
    liquifyPressure: 50,
    liquifyDensity: 50,
    liquifyPinEdges: true,
    liquifyDragging: false,

    // Camera tether state
    cameraConnected: false,
    cameraPollTimer: null,
    cameraEvents: [],

    // Coalesced retouch pipeline
    _retouchInFlight: false,
    _retouchPending: false,
    _retouchDebounce: null,
    _retouchSeq: 0,

    // Open Accordions & per-accordion snapshots for undo
    openGroups: { '100': true, '6': true, '7': true, '13': true, '61': true, '62': true, '64': true, '71': true },
    expandedNodes: {},

    isActive: function() {
      var A = window._devstuA;
      return Boolean(A && A.mode === 'stu_ultra_max');
    },

    init: function() {
      if (StuUltraMax.container) return;
      var appBody = document.querySelector('.body') || document.getElementById('app');
      if (!appBody) {
        setTimeout(StuUltraMax.init, 100);
        return;
      }

      StuUltraMax.mountDOM(appBody);
      StuUltraMax.loadStaticCatalogs();
      StuUltraMax.hookStore();
      StuUltraMax.onModeChange();
    },

    loadStaticCatalogs: function() {
      Promise.all([
        fetch('assets/lk_ui_catalog.json').then(function(r) { return r.json(); }).catch(function() { return null; }),
        fetch('assets/lk_bg_info.json').then(function(r) { return r.json(); }).catch(function() { return null; }),
        fetch('assets/lk_color_references.json').then(function(r) { return r.json(); }).catch(function() { return null; }),
        loadCustomColorRefs()
      ]).then(function(res) {
        if (res[0]) StuUltraMax.catalog = res[0];
        if (res[1]) StuUltraMax.bgInfo = res[1];
        if (res[2]) StuUltraMax.colorRefCatalog = res[2];
        if (Array.isArray(res[3])) StuUltraMax.customColorRefs = res[3];
        StuUltraMax.renderModule();
      });
    },

    ensureBridgeReady: function() {
      if (StuUltraMax.bridgeReady) return Promise.resolve(true);
      if (StuUltraMax.bridgeInitPromise) return StuUltraMax.bridgeInitPromise;

      StuUltraMax.setStatus('Đang khởi động aipic.dll Studio Engine...', 'busy');
      StuUltraMax.bridgeInitPromise = postJson('/api/lk_ultra_max/init', {}).then(function(res) {
        StuUltraMax.bridgeInitPromise = null;
        if (res && res.ok) {
          StuUltraMax.bridgeReady = true;
          StuUltraMax.initError = '';
          if (res.materials && res.materials.bg_info && res.materials.bg_info.change_background && !StuUltraMax.bgInfo) {
            StuUltraMax.bgInfo = res.materials.bg_info;
          }
          if (res.presets && res.presets.groups) {
            StuUltraMax.parsePresetsPayload(res.presets.groups);
          }
          StuUltraMax.setStatus('AI Studio Engine ✓ • Sẵn sàng', 'ready');
          StuUltraMax.syncViewportToEngine();
          if (StuUltraMax.presetDrawerOpen) StuUltraMax.renderPresetDrawer();
          return true;
        }
        StuUltraMax.initError = (res && res.error) || 'Không thể khởi tạo aipic.dll';
        StuUltraMax.setStatus('Lỗi Engine: ' + StuUltraMax.initError, 'error');
        return false;
      }).catch(function(err) {
        StuUltraMax.bridgeInitPromise = null;
        StuUltraMax.initError = String(err);
        StuUltraMax.setStatus('Lỗi kết nối aipic_bridge', 'error');
        return false;
      });
      return StuUltraMax.bridgeInitPromise;
    },

    syncViewportToEngine: function() {
      var vp = document.getElementById('stu-max-viewport');
      if (!vp || !StuUltraMax.bridgeReady) return;
      var rect = vp.getBoundingClientRect();
      if (rect.width < 100 || rect.height < 100) return;
      postJson('/api/lk_ultra_max/set_viewport', {
        viewW: Math.round(rect.width),
        viewH: Math.round(rect.height),
        windowW: window.innerWidth || 1280,
        windowH: window.innerHeight || 760,
        scaleFactor: window.devicePixelRatio || 1
      }).then(function(res) {
        var photo = window._devstuA && window._devstuA.current;
        if (res && res.frame_rect && photo && photo._lkMaxState) {
          photo._lkMaxState.frameRect = res.frame_rect;
        }
      });
    },

    setStatus: function(txt, state) {
      var lbl = document.getElementById('stu-max-status-label');
      var dot = document.getElementById('stu-max-status-dot');
      if (lbl) lbl.textContent = txt;
      if (dot) dot.className = 'stu-max-status-dot' + (state ? ' ' + state : '');
    },

    mountDOM: function(appBody) {
      // 1. Header right actions
      var hdr = document.querySelector('.hdr');
      if (hdr && !document.getElementById('stu-max-header-right')) {
        var hr = document.createElement('div');
        hr.id = 'stu-max-header-right';
        hr.className = 'stu-max-header-right';
        hr.innerHTML = [
          '<div class="stu-max-status-pill" title="LK Magic Pro AI Engine (aipic.dll GPU)">',
          '  <span id="stu-max-status-dot" class="stu-max-status-dot"></span>',
          '  <span id="stu-max-status-label">AI Studio • Chưa mở</span>',
          '</div>',
          '<button type="button" id="stu-max-btn-settings" class="stu-max-hdr-btn" title="Thông tin cấu hình engine & chất lượng">Cài Đặt</button>',
          '<button type="button" id="stu-max-btn-export" class="stu-max-hdr-btn primary" title="Xuất ảnh chất lượng cao từ aipic.dll">Xuất Ảnh</button>'
        ].join('');
        hdr.appendChild(hr);
        StuUltraMax.headerRight = hr;
        hr.querySelector('#stu-max-btn-settings').addEventListener('click', StuUltraMax.openSettingsModal);
        hr.querySelector('#stu-max-btn-export').addEventListener('click', StuUltraMax.openExportModal);
      }

      // 2. Right Inspector + Right Nav Rail
      var cont = document.createElement('div');
      cont.id = 'stu-max-container';
      cont.className = 'stu-max-container';
      cont.innerHTML = [
        '<div class="stu-max-inspector">',
        '  <div class="stu-max-ins-body" id="stu-max-ins-body"></div>',
        '  <div class="stu-max-ins-footer">',
        '    <button type="button" class="stu-max-ft-btn primary" id="stu-max-ft-sync" title="Đồng bộ thông số sang ảnh khác trong workspace">Đồng Bộ</button>',
        '    <button type="button" class="stu-max-ft-btn primary" id="stu-max-ft-save-preset" title="Lưu cấu hình hiện tại vào Cài Đặt Sẵn">Lưu Cài Đặt Sẵn</button>',
        '    <button type="button" class="stu-max-ft-btn primary" id="stu-max-ft-reset" title="Khôi phục toàn bộ thông số về mặc định">Reset</button>',
        '  </div>',
        '</div>',
        '<div class="stu-max-rail" id="stu-max-rail">',
        RAIL_MODULES.map(function(m) {
          var cls = 'stu-max-rail-btn' + (m.isLiquify ? ' liquify' : '') + (m.id === StuUltraMax.activeModule ? ' active' : '');
          return '<button type="button" class="' + cls + '" data-max-mod="' + m.id + '" title="' + escapeHtml(m.label) + '">' +
            '<span class="rail-ico">' + m.icon + '</span>' +
            '<span class="rail-lbl">' + escapeHtml(m.label) + '</span>' +
            '<span class="rail-dot" data-dirty-mod="' + m.id + '"></span>' +
          '</button>';
        }).join(''),
        '</div>'
      ].join('');
      appBody.appendChild(cont);
      StuUltraMax.container = cont;
      StuUltraMax.inspector = cont.querySelector('#stu-max-ins-body');

      cont.querySelectorAll('[data-max-mod]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          StuUltraMax.switchModule(btn.getAttribute('data-max-mod'));
        });
      });
      cont.querySelector('#stu-max-ft-sync').addEventListener('click', StuUltraMax.syncToAllPhotos);
      cont.querySelector('#stu-max-ft-save-preset').addEventListener('click', StuUltraMax.saveCurrentAsPreset);
      cont.querySelector('#stu-max-ft-reset').addEventListener('click', StuUltraMax.resetAllParams);

      // 3. Viewport + Preset Drawer (reusing Đầy đủ .stage > .toolbar & .photo-badge)
      var vp = document.querySelector('.viewport');
      if (vp && !document.getElementById('stu-max-viewport')) {
        var vDiv = document.createElement('div');
        vDiv.id = 'stu-max-viewport';
        vDiv.className = 'stu-max-viewport is-empty';
        vDiv.innerHTML = [
          '<div class="stu-max-vp-top-left">',
          '  <button type="button" id="stu-max-preset-toggle" class="stu-max-preset-pill">Cài Đặt Sẵn</button>',
          '  <span id="stu-max-detect-pills" class="stu-max-detect-pills"></span>',
          '</div>',
          '<div id="stu-max-preset-drawer" class="stu-max-preset-drawer hidden"></div>',
          '<div id="stu-max-stage-flex" class="stu-max-stage-flex">',
          '  <div id="stu-max-sbs-pane" class="stu-max-sbs-pane hidden">',
          '    <div id="stu-max-sbs-before-wrap" class="stu-max-sbs-before-wrap">',
          '      <canvas id="stu-max-sbs-before-canvas"></canvas>',
          '    </div>',
          '    <span class="stu-max-sbs-tag">Trước</span>',
          '  </div>',
          '  <div id="stu-max-after-pane" class="stu-max-after-pane">',
          '    <div id="stu-max-canvas-wrap" class="stu-max-canvas-wrap">',
          '      <canvas id="stu-max-after-canvas"></canvas>',
          '      <canvas id="stu-max-before-canvas"></canvas>',
          '      <canvas id="stu-max-overlay-canvas"></canvas>',
          '      <div id="stu-max-split-line" class="stu-max-split-line hidden">',
          '        <span class="stu-max-split-tag before">Trước</span>',
          '        <span class="stu-max-split-knob">⇄</span>',
          '        <span class="stu-max-split-tag after">Sau</span>',
          '      </div>',
          '    </div>',
          '    <span id="stu-max-sbs-after-tag" class="stu-max-sbs-tag hidden">Sau</span>',
          '  </div>',
          '</div>',
          '<div id="stu-max-nav-card" class="stu-max-nav-card hidden">',
          '  <div class="stu-max-nav-hdr"><span>Toàn ảnh</span><button type="button" id="stu-max-nav-close" class="lk-modal-x">✕</button></div>',
          '  <canvas id="stu-max-nav-canvas" width="194" height="130"></canvas>',
          '</div>',
          '<div id="stu-max-loading-overlay" class="stu-max-loading-overlay hidden" role="status" aria-live="polite">',
          '  <div class="stu-max-loading-card">',
          '    <div class="stu-max-loading-ring"><span class="stu-max-loading-core">GPU</span></div>',
          '    <div class="stu-max-loading-title" id="stu-max-loading-title">Đang nạp ảnh vào GPU Studio Engine...</div>',
          '    <div class="stu-max-loading-sub" id="stu-max-loading-sub">Đang khởi tạo model AI & nhận diện khuôn mặt</div>',
          '    <div class="stu-max-loading-bar"><i></i></div>',
          '  </div>',
          '</div>',
          '<div id="stu-max-zoom-menu" class="stu-max-zoom-menu hidden" role="menu"></div>',
          '<div id="stu-max-toast" class="stu-max-toast"></div>',
          '<div id="stu-max-modal" class="stu-max-modal hidden"></div>'
        ].join('');
        vp.appendChild(vDiv);

        StuUltraMax.viewportEl = vDiv;
        StuUltraMax.stageFlex = vDiv.querySelector('#stu-max-stage-flex');
        StuUltraMax.sbsPane = vDiv.querySelector('#stu-max-sbs-pane');
        StuUltraMax.afterPane = vDiv.querySelector('#stu-max-after-pane');
        StuUltraMax.sbsBeforeWrap = vDiv.querySelector('#stu-max-sbs-before-wrap');
        StuUltraMax.sbsBeforeCanvas = vDiv.querySelector('#stu-max-sbs-before-canvas');
        StuUltraMax.sbsAfterTag = vDiv.querySelector('#stu-max-sbs-after-tag');
        StuUltraMax.canvasWrap = vDiv.querySelector('#stu-max-canvas-wrap');
        StuUltraMax.afterCanvas = vDiv.querySelector('#stu-max-after-canvas');
        StuUltraMax.beforeCanvas = vDiv.querySelector('#stu-max-before-canvas');
        StuUltraMax.overlayCanvas = vDiv.querySelector('#stu-max-overlay-canvas');
        StuUltraMax.splitLine = vDiv.querySelector('#stu-max-split-line');
        StuUltraMax.presetDrawer = vDiv.querySelector('#stu-max-preset-drawer');
        StuUltraMax.navCard = vDiv.querySelector('#stu-max-nav-card');
        StuUltraMax.loadingOverlay = vDiv.querySelector('#stu-max-loading-overlay');
        StuUltraMax.loadingTitle = vDiv.querySelector('#stu-max-loading-title');
        StuUltraMax.loadingSub = vDiv.querySelector('#stu-max-loading-sub');
        StuUltraMax.zoomMenu = vDiv.querySelector('#stu-max-zoom-menu');

        StuUltraMax.bindViewportEvents();
        StuUltraMax.hookToolbarControls();
      }
    },

    setZoom: function(target) {
      if (StuUltraMax._endPan) StuUltraMax._endPan();
      if (window.__hpStage) {
        window.__hpStage.drag = null;
        window.__hpStage.spacePan = null;
        window.__hpStage.zoom = 'fit';
      }
      if (target === 'fit') {
        StuUltraMax.zoomScale = 0;
        StuUltraMax.panX = 0;
        StuUltraMax.panY = 0;
      } else {
        var z = Number(target);
        if (Number.isFinite(z) && z > 0.05) {
          StuUltraMax.zoomScale = Math.max(0.1, Math.min(4, z));
        }
      }
      StuUltraMax.renderViewport();
    },

    stepZoom: function(dir) {
      if (StuUltraMax._endPan) StuUltraMax._endPan();
      var cur = StuUltraMax.zoomScale > 0 ? StuUltraMax.zoomScale : (StuUltraMax._fitScale || 0.5);
      var next = dir > 0 ? cur * 1.25 : cur / 1.25;
      var clamped = Math.max(0.1, Math.min(4, next));
      if (StuUltraMax._fitScale && Math.abs(clamped - StuUltraMax._fitScale) < 0.04) {
        StuUltraMax.zoomScale = 0;
        StuUltraMax.panX = 0;
        StuUltraMax.panY = 0;
      } else {
        StuUltraMax.zoomScale = clamped;
      }
      StuUltraMax.renderViewport();
    },

    cycleCompare: function() {
      StuUltraMax.compareMode = (StuUltraMax.compareMode + 1) % 3;
      StuUltraMax.renderViewport();
      StuUltraMax.syncToolbarState();
    },

    syncToolbarState: function(effScale) {
      if (!StuUltraMax.isActive()) return;
      var tb = document.querySelector('.stage > .toolbar');
      if (!tb) return;
      var zBtn = tb.querySelector('.zoom-pct');
      var scale = effScale || (StuUltraMax.zoomScale > 0 ? StuUltraMax.zoomScale : (StuUltraMax._fitScale || 1));
      if (zBtn) zBtn.textContent = Math.max(1, Math.round(scale * 100)) + ' %';
      var isFit = StuUltraMax.zoomScale === 0;
      var is100 = StuUltraMax.zoomScale > 0 && Math.abs(StuUltraMax.zoomScale - 1) < 0.02;
      tb.querySelectorAll('button').forEach(function(btn) {
        var lbl = (btn.textContent || '').trim();
        if (lbl === 'Vừa khung') btn.setAttribute('aria-pressed', String(isFit));
        else if (lbl === '100 %' || lbl === '100%') btn.setAttribute('aria-pressed', String(is100));
        else if (lbl.indexOf('So sánh') !== -1) btn.setAttribute('aria-pressed', String(StuUltraMax.compareMode > 0));
        else if (lbl.indexOf('Ảnh gốc') !== -1) btn.setAttribute('aria-pressed', String(StuUltraMax.holdOriginal));
        else if (btn.classList.contains('nav-btn')) btn.setAttribute('aria-pressed', String(StuUltraMax.navVisible));
      });
    },

    openZoomMenu: function(anchorBtn) {
      var menu = StuUltraMax.zoomMenu;
      if (!menu || !anchorBtn) return;
      if (!menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        return;
      }
      var cur = StuUltraMax.zoomScale;
      var items = [
        { label: 'Vừa khung', val: 'fit', active: cur === 0 },
        { label: '25 %', val: 0.25, active: cur > 0 && Math.abs(cur - 0.25) < 0.02 },
        { label: '50 %', val: 0.5, active: cur > 0 && Math.abs(cur - 0.5) < 0.02 },
        { label: '100 %', val: 1, active: cur > 0 && Math.abs(cur - 1) < 0.02 },
        { label: '150 %', val: 1.5, active: cur > 0 && Math.abs(cur - 1.5) < 0.02 },
        { label: '200 %', val: 2, active: cur > 0 && Math.abs(cur - 2) < 0.02 },
        { label: '300 %', val: 3, active: cur > 0 && Math.abs(cur - 3) < 0.02 }
      ];
      menu.innerHTML = items.map(function(it) {
        return '<button type="button" class="' + (it.active ? 'active' : '') + '" data-zval="' + it.val + '">' + it.label + '</button>';
      }).join('');
      var r = anchorBtn.getBoundingClientRect();
      menu.classList.remove('hidden');
      menu.style.left = Math.max(8, Math.round(r.left)) + 'px';
      menu.style.top = Math.max(8, Math.round(r.top - menu.offsetHeight - 8)) + 'px';
      menu.querySelectorAll('button').forEach(function(b) {
        b.addEventListener('click', function(ev) {
          ev.stopPropagation();
          var v = b.getAttribute('data-zval');
          menu.classList.add('hidden');
          StuUltraMax.setZoom(v === 'fit' ? 'fit' : Number(v));
        });
      });
    },

    hookToolbarControls: function() {
      if (StuUltraMax._toolbarHooked) return;
      StuUltraMax._toolbarHooked = true;

      document.addEventListener('click', function(e) {
        if (StuUltraMax.zoomMenu && !StuUltraMax.zoomMenu.classList.contains('hidden')) {
          if (!e.target.closest || (!e.target.closest('#stu-max-zoom-menu') && !e.target.closest('.zoom-pct'))) {
            StuUltraMax.zoomMenu.classList.add('hidden');
          }
        }
        if (!StuUltraMax.isActive()) return;
        var btn = e.target && e.target.closest && e.target.closest('.stage > .toolbar button');
        if (!btn) return;
        var lbl = (btn.textContent || '').trim();
        var aria = btn.getAttribute('aria-label') || '';
        if (btn.classList.contains('zb') && (aria.indexOf('Thu nhỏ') !== -1 || aria.toLowerCase().indexOf('nhỏ') !== -1)) {
          e.preventDefault(); e.stopPropagation();
          StuUltraMax.stepZoom(-1);
        } else if (btn.classList.contains('zb') && (aria.indexOf('Phóng to') !== -1 || aria.toLowerCase().indexOf('phóng') !== -1)) {
          e.preventDefault(); e.stopPropagation();
          StuUltraMax.stepZoom(1);
        } else if (btn.classList.contains('zoom-pct')) {
          e.preventDefault(); e.stopPropagation();
          StuUltraMax.openZoomMenu(btn);
        } else if (lbl === 'Vừa khung') {
          e.preventDefault(); e.stopPropagation();
          StuUltraMax.setZoom('fit');
        } else if (lbl === '100 %' || lbl === '100%') {
          e.preventDefault(); e.stopPropagation();
          StuUltraMax.setZoom(1);
        } else if (lbl.indexOf('So sánh') !== -1) {
          e.preventDefault(); e.stopPropagation();
          StuUltraMax.cycleCompare();
        } else if (btn.classList.contains('tb-crop') || lbl.indexOf('Cắt ảnh') !== -1) {
          e.preventDefault(); e.stopPropagation();
          StuUltraMax.toast('Cắt ảnh: dùng Cắt ảnh trong tab Đầy đủ / STU Ultra hoặc tuỳ chỉnh ở Xuất Ảnh');
        } else if (btn.classList.contains('nav-btn')) {
          e.preventDefault(); e.stopPropagation();
          StuUltraMax.navVisible = !StuUltraMax.navVisible;
          if (StuUltraMax.navCard) StuUltraMax.navCard.classList.toggle('hidden', !StuUltraMax.navVisible);
          StuUltraMax.updateNavMiniMap();
          StuUltraMax.syncToolbarState();
        } else if (lbl.indexOf('Ảnh gốc') !== -1) {
          e.preventDefault(); e.stopPropagation();
        }
      }, true);

      var setHoldOriginal = function(active) {
        if (!StuUltraMax.isActive()) return;
        if (StuUltraMax.holdOriginal !== active) {
          StuUltraMax.holdOriginal = active;
          StuUltraMax.renderViewport();
          StuUltraMax.syncToolbarState();
        }
      };

      document.addEventListener('pointerdown', function(e) {
        if (!StuUltraMax.isActive()) return;
        var btn = e.target && e.target.closest && e.target.closest('.stage > .toolbar button');
        if (btn && ((btn.textContent || '').indexOf('Ảnh gốc') !== -1)) {
          e.preventDefault(); e.stopPropagation();
          setHoldOriginal(true);
        }
      }, true);
      window.addEventListener('pointerup', function() { if (StuUltraMax.holdOriginal) setHoldOriginal(false); });
      window.addEventListener('pointercancel', function() { if (StuUltraMax.holdOriginal) setHoldOriginal(false); });
      window.addEventListener('keydown', function(e) {
        if (!StuUltraMax.isActive()) return;
        var tag = (document.activeElement && document.activeElement.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (e.code === 'Space' && !e.repeat) {
          e.preventDefault();
          setHoldOriginal(true);
        } else if ((e.key === 'z' || e.key === 'Z') && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          StuUltraMax.setZoom(StuUltraMax.zoomScale > 0 ? 'fit' : 1);
        } else if ((e.key === 'y' || e.key === 'Y') && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          StuUltraMax.cycleCompare();
        }
      });
      window.addEventListener('keyup', function(e) {
        if (e.code === 'Space' && StuUltraMax.holdOriginal) {
          setHoldOriginal(false);
        }
      });
    },

    bindViewportEvents: function() {
      var v = StuUltraMax.viewportEl;
      if (!v) return;

      v.querySelector('#stu-max-preset-toggle').addEventListener('click', function() {
        StuUltraMax.presetDrawerOpen = !StuUltraMax.presetDrawerOpen;
        StuUltraMax.presetDrawer.classList.toggle('hidden', !StuUltraMax.presetDrawerOpen);
        if (StuUltraMax.presetDrawerOpen) {
          StuUltraMax.loadPresets().then(StuUltraMax.renderPresetDrawer);
        }
      });

      var navClose = v.querySelector('#stu-max-nav-close');
      if (navClose) navClose.addEventListener('click', function() {
        StuUltraMax.navVisible = false;
        if (StuUltraMax.navCard) StuUltraMax.navCard.classList.add('hidden');
        StuUltraMax.syncToolbarState();
      });

      // Isolate #stu-max-viewport from parent .viewport (Đầy đủ Fwt capture/bubble handlers)
      var resetHiddenStage = function() {
        if (window.__hpStage) {
          window.__hpStage.drag = null;
          window.__hpStage.spacePan = null;
          window.__hpStage.spaceHeld = false;
          window.__hpStage.zoom = 'fit';
        }
        var parentVp = v.parentElement;
        if (parentVp) parentVp.classList.remove('dragging');
      };
      ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'mousedown', 'mousemove', 'mouseup', 'click', 'dblclick', 'dragstart'].forEach(function(evName) {
        v.addEventListener(evName, function(e) {
          if (StuUltraMax.isActive()) e.stopPropagation();
        });
      });

      // Split drag & double-click reset
      var splitDrag = false;
      var endSplit = function() { splitDrag = false; };
      StuUltraMax.splitLine.addEventListener('pointerdown', function(e) {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        splitDrag = true;
      });
      StuUltraMax.splitLine.addEventListener('dblclick', function(e) {
        e.preventDefault();
        e.stopPropagation();
        splitDrag = false;
        StuUltraMax.splitPos = 0.5;
        StuUltraMax.applySplitClip();
      });

      // Canvas interaction: Liquify brush OR Pan/Wheel/DblClick zoom
      var ov = StuUltraMax.overlayCanvas;
      var sbsWrap = StuUltraMax.sbsBeforeWrap;
      var panStart = null;
      var endPan = function() {
        panStart = null;
        var idleCursor = (StuUltraMax.activeModule === 'liquify' && StuUltraMax.liquifyTool === 'push')
          ? 'crosshair'
          : (StuUltraMax.zoomScale > (StuUltraMax._fitScale || 0) * 1.02 ? 'grab' : '');
        if (ov) ov.style.cursor = idleCursor;
        if (sbsWrap) sbsWrap.style.cursor = (StuUltraMax.zoomScale > (StuUltraMax._fitScale || 0) * 1.02 ? 'grab' : '');
      };
      StuUltraMax._endPan = endPan;

      v.addEventListener('wheel', function(e) {
        if (!StuUltraMax.isActive()) return;
        if (e.target && e.target.closest && e.target.closest('.stu-max-preset-drawer, .stu-max-modal')) return;
        e.preventDefault();
        e.stopPropagation();
        StuUltraMax.stepZoom(e.deltaY < 0 ? 1 : -1);
      }, { passive: false });

      var attachInteractHandlers = function(el, allowLiquify) {
        if (!el) return;
        el.addEventListener('dragstart', function(e) { e.preventDefault(); });
        el.addEventListener('dblclick', function(e) {
          if (!StuUltraMax.isActive()) return;
          if (allowLiquify && StuUltraMax.activeModule === 'liquify' && StuUltraMax.liquifyTool === 'push') return;
          if (e.target && e.target.closest && e.target.closest('#stu-max-split-line')) return;
          e.preventDefault();
          e.stopPropagation();
          endPan();
          endSplit();
          StuUltraMax.liquifyDragging = false;
          resetHiddenStage();
          StuUltraMax.setZoom(StuUltraMax.zoomScale > 0 ? 'fit' : 1);
        });
        el.addEventListener('pointerdown', function(e) {
          if (!StuUltraMax.isActive()) return;
          e.stopPropagation();
          resetHiddenStage();
          if (e.button !== 0 && e.pointerType === 'mouse') return;
          var A = window._devstuA;
          var photo = A && A.current;
          if (!photo || !photo._lkMaxState || !photo._lkMaxState.fid) return;

          if (allowLiquify && StuUltraMax.activeModule === 'liquify' && StuUltraMax.liquifyTool === 'push') {
            e.preventDefault();
            StuUltraMax.liquifyDragging = true;
            StuUltraMax.sendLiquifyPointerEvent(500, e);
            return;
          }
          if (StuUltraMax.zoomScale > 0) {
            e.preventDefault();
            panStart = {
              pointerId: e.pointerId,
              startX: e.clientX,
              startY: e.clientY,
              baseX: StuUltraMax.panX,
              baseY: StuUltraMax.panY,
              el: el,
              moved: false
            };
          }
        });
      };
      attachInteractHandlers(ov, true);
      attachInteractHandlers(sbsWrap, false);

      window.addEventListener('pointermove', function(e) {
        if (!StuUltraMax.isActive()) return;
        if (splitDrag) {
          if (e.pointerType === 'mouse' && (e.buttons & 1) === 0) {
            endSplit();
          } else {
            var rect = StuUltraMax.canvasWrap && StuUltraMax.canvasWrap.getBoundingClientRect();
            if (rect && rect.width > 0) {
              StuUltraMax.splitPos = Math.max(0.02, Math.min(0.98, (e.clientX - rect.left) / rect.width));
              StuUltraMax.applySplitClip();
            }
          }
          return;
        }
        if (StuUltraMax.liquifyDragging) {
          if (e.pointerType === 'mouse' && (e.buttons & 1) === 0) {
            StuUltraMax.liquifyDragging = false;
            StuUltraMax.sendLiquifyPointerEvent(502, e);
          } else if (StuUltraMax.activeModule === 'liquify' && StuUltraMax.liquifyTool === 'push') {
            StuUltraMax.drawBrushCursor(e);
            StuUltraMax.sendLiquifyPointerEvent(501, e);
          }
          return;
        }
        if (panStart) {
          if (e.pointerType === 'mouse' && (e.buttons & 1) === 0) {
            endPan();
            return;
          }
          if (StuUltraMax.zoomScale > 0) {
            var dx = e.clientX - panStart.startX;
            var dy = e.clientY - panStart.startY;
            if (!panStart.moved && (dx * dx + dy * dy) < 4) return;
            panStart.moved = true;
            if (panStart.el) panStart.el.style.cursor = 'grabbing';
            StuUltraMax.panX = panStart.baseX + dx;
            StuUltraMax.panY = panStart.baseY + dy;
            var tr = 'translate(' + Math.round(StuUltraMax.panX) + 'px,' + Math.round(StuUltraMax.panY) + 'px)';
            if (StuUltraMax.canvasWrap) StuUltraMax.canvasWrap.style.transform = tr;
            if (StuUltraMax.sbsBeforeWrap && StuUltraMax.compareMode === 2) StuUltraMax.sbsBeforeWrap.style.transform = tr;
          }
        }
      }, true);

      if (ov) {
        ov.addEventListener('pointermove', function(e) {
          if (!StuUltraMax.isActive()) return;
          if (!StuUltraMax.liquifyDragging && StuUltraMax.activeModule === 'liquify' && StuUltraMax.liquifyTool === 'push') {
            StuUltraMax.drawBrushCursor(e);
          }
        });
        ov.addEventListener('pointerleave', function() {
          StuUltraMax.clearOverlayCursor();
        });
      }

      var onPointerRelease = function(e) {
        endSplit();
        if (StuUltraMax.liquifyDragging) {
          StuUltraMax.liquifyDragging = false;
          StuUltraMax.sendLiquifyPointerEvent(502, e);
        }
        if (panStart) endPan();
      };
      window.addEventListener('pointerup', onPointerRelease, true);
      window.addEventListener('pointercancel', onPointerRelease, true);
      window.addEventListener('blur', function() {
        endSplit();
        endPan();
        StuUltraMax.liquifyDragging = false;
      });

      if (typeof ResizeObserver === 'function') {
        var ro = new ResizeObserver(function() {
          if (StuUltraMax.isActive()) {
            StuUltraMax.syncViewportToEngine();
            StuUltraMax.renderViewport();
          }
        });
        ro.observe(v);
      }
      window.addEventListener('resize', function() {
        if (StuUltraMax.isActive()) {
          StuUltraMax.syncViewportToEngine();
          StuUltraMax.renderViewport();
        }
      });
    },

    hookStore: function() {
      var A = window._devstuA;
      if (!A || typeof A.on !== 'function') {
        setTimeout(StuUltraMax.hookStore, 120);
        return;
      }
      if (StuUltraMax._hooked) return;
      StuUltraMax._hooked = true;
      A.on(function(evt) {
        if (evt === 'mode') {
          StuUltraMax.onModeChange();
        } else if ((evt === 'current' || evt === 'photos') && StuUltraMax.isActive()) {
          StuUltraMax.onPhotoActivated(A.current);
        }
      });
    },

    onModeChange: function() {
      var active = StuUltraMax.isActive();
      var app = document.getElementById('app');
      if (app) {
        app.classList.toggle('app-stu-ultra-max', active);
        if (active) app.setAttribute('data-max-mod', StuUltraMax.activeModule);
        else app.removeAttribute('data-max-mod');
      }
      var maxBtn = document.querySelector('.mode-stu-ultra-max');
      if (maxBtn) maxBtn.setAttribute('aria-pressed', String(active));

      if (StuUltraMax._endPan) StuUltraMax._endPan();
      if (window.__hpStage) {
        window.__hpStage.drag = null;
        window.__hpStage.spacePan = null;
        window.__hpStage.spaceHeld = false;
        if (active) window.__hpStage.zoom = 'fit';
      }

      if (!active) {
        if (StuUltraMax.zoomMenu) StuUltraMax.zoomMenu.classList.add('hidden');
        if (StuUltraMax.navCard) StuUltraMax.navCard.classList.add('hidden');
        StuUltraMax.navVisible = false;
        StuUltraMax.holdOriginal = false;
        if (StuUltraMax.liquifyActive) StuUltraMax.endLiquify(false);
        return;
      }

      StuUltraMax.syncToolbarState();
      var A = window._devstuA;
      if (A && A.current) {
        StuUltraMax.onPhotoActivated(A.current);
      } else {
        StuUltraMax.renderViewport();
        StuUltraMax.renderModule();
        StuUltraMax.ensureBridgeReady();
      }
      StuUltraMax.renderModule();
    },

    updateViewportLoading: function(st) {
      var ov = StuUltraMax.loadingOverlay;
      if (!ov) return;
      var activePhoto = window._devstuA && window._devstuA.current;
      var curSt = activePhoto && activePhoto._lkMaxState;
      var show = Boolean(activePhoto && (st ? st.opening : (curSt && curSt.opening)));
      ov.classList.toggle('hidden', !show);
      if (StuUltraMax.canvasWrap) StuUltraMax.canvasWrap.classList.toggle('is-loading', show);
      if (show) {
        if (StuUltraMax.loadingTitle) {
          StuUltraMax.loadingTitle.textContent = !StuUltraMax.bridgeReady
            ? 'Đang khởi động GPU Studio Engine...'
            : 'Đang nạp ảnh vào GPU Studio Engine...';
        }
        if (StuUltraMax.loadingSub) {
          StuUltraMax.loadingSub.textContent = !StuUltraMax.bridgeReady
            ? 'Đang kích hoạt aipic.dll & nạp model AI GPU'
            : 'Đang chuẩn bị khung hình & nhận diện khuôn mặt';
        }
      }
    },

    onPhotoActivated: function(photo) {
      if (!photo) {
        StuUltraMax._lastPhotoId = null;
        StuUltraMax.updateViewportLoading(null);
        StuUltraMax.renderViewport();
        StuUltraMax.renderModule();
        return;
      }
      var pid = photo.id || photo.name || '';
      if (StuUltraMax._lastPhotoId !== pid) {
        StuUltraMax._lastPhotoId = pid;
        StuUltraMax.zoomScale = 0;
        StuUltraMax.panX = 0;
        StuUltraMax.panY = 0;
      }
      var st = ensureState(photo);
      StuUltraMax.updateDetectPills(st);
      StuUltraMax.renderViewport();
      StuUltraMax.renderModule();

      if (st.fid) {
        StuUltraMax.updateViewportLoading(st);
        StuUltraMax.syncDirtyIndicators();
        return;
      }
      if (st.opening) {
        StuUltraMax.updateViewportLoading(st);
        return;
      }

      st.opening = true;
      StuUltraMax.updateViewportLoading(st);
      StuUltraMax.setStatus('Đang nạp ảnh vào GPU Studio Engine...', 'busy');

      var origPromise = extractOrigDataUrl(photo).then(function(dataUrl) {
        if (dataUrl && window._devstuA && window._devstuA.current === photo) {
          StuUltraMax.renderViewport();
        }
        return dataUrl;
      });

      Promise.all([StuUltraMax.ensureBridgeReady(), origPromise]).then(function(pair) {
        var ok = pair[0];
        var dataUrl = pair[1];
        if (!ok) {
          st.opening = false;
          StuUltraMax.updateViewportLoading(st);
          return;
        }
        if (!dataUrl) {
          st.opening = false;
          StuUltraMax.updateViewportLoading(st);
          StuUltraMax.setStatus('Không đọc được dữ liệu ảnh', 'error');
          return;
        }
        StuUltraMax.updateViewportLoading(st);
        return postJson('/api/lk_ultra_max/open', { image_base64: dataUrl, fast_open: true, fast_url: true }).then(function(res) {
          st.opening = false;
          if (!res || !res.ok) {
            st.openError = (res && res.error) || 'Lỗi mở ảnh';
            StuUltraMax.updateViewportLoading(st);
            StuUltraMax.setStatus('Lỗi mở ảnh: ' + st.openError, 'error');
            return;
          }
          st.fid = res.fid;
          st.wsId = res.ws_id;
          st.sourcePath = res.source_path || '';
          st.frameRect = res.frame_rect || null;
          var openPreviewUrl = resolvePreviewSrc(res) || '';
          st.afterDataUrl = openPreviewUrl;
          st.histogram = res.histogram || null;
          var df = res.detect_faces || {};
          var rawFaces = (df.items && df.items[0] && Array.isArray(df.items[0].person))
            ? df.items[0].person
            : (Array.isArray(df.faces) ? df.faces : []);
          st.detectFaces = rawFaces;
          st.detectMatting = res.detect_matting || null;
          st.detectSky = res.detect_sky || null;

          // Capture unmodified engine baseline before thumbnail_tmp.data is overwritten by retouch
          st._baselinePromise = (!st.origBaselineUrl && openPreviewUrl)
            ? fetch(openPreviewUrl).then(function(r) { return r.blob(); }).then(function(b) {
                if (b && b.size > 0) st.origBaselineUrl = URL.createObjectURL(b);
              }).catch(function() {})
            : Promise.resolve();

          // Default portrait cohort to first detected face (isSameSexAge rule from LK Magic Pro)
          if (st.detectFaces.length > 0) {
            var f0 = st.detectFaces[0];
            if (f0.classid != null) StuUltraMax.selectedFaceClassId = f0.classid;
            var matched = COHORT_DEFS.find(function(c) {
              return Number(f0.age) === 1
                ? Number(c.age) === 1
                : (Number(c.sex) === Number(f0.sex) && Number(c.age) === Number(f0.age));
            }) || (Number(f0.age) >= 3 ? COHORT_DEFS.find(function(c) { return Number(c.age) === 3 && Number(c.sex) === Number(f0.sex); }) : null);
            if (matched) StuUltraMax.activePortraitCohort = matched.key;
          }

          StuUltraMax.updateViewportLoading(st);
          StuUltraMax.setStatus('AI Studio Engine ✓ • FID ' + st.fid + ' • Sẵn sàng', 'ready');
          if (window._devstuA && window._devstuA.current === photo) {
            StuUltraMax.updateDetectPills(st);
            StuUltraMax.renderViewport();
            StuUltraMax.renderModule();
            // Re-apply if photo already had staged preset/edits before opening (after baseline captured)
            if (StuUltraMax.hasAnyEdits(st)) {
              st._baselinePromise.then(function() {
                if (window._devstuA && window._devstuA.current === photo) {
                  StuUltraMax.scheduleRetouch(false);
                }
              });
            }
          }
          if (!st.detectSky || st.detectSky.sky_info_status == null) {
            var skyFid = st.fid;
            setTimeout(function() {
              if (!st || st.fid !== skyFid) return;
              postJson('/api/lk_ultra_max/detect', { fid: skyFid, detect_type: 1 }).then(function(dRes) {
                if (dRes && dRes.ok && dRes.result && typeof dRes.result === 'object') {
                  st.detectSky = dRes.result;
                  if (window._devstuA && window._devstuA.current === photo) {
                    StuUltraMax.updateDetectPills(st);
                    if (StuUltraMax.activeModule === 'background') StuUltraMax.renderModule();
                  }
                }
              }).catch(function() {});
            }, 120);
          }
        });
      }).catch(function(err) {
        st.opening = false;
        StuUltraMax.updateViewportLoading(st);
        StuUltraMax.setStatus('Lỗi: ' + err, 'error');
      });
    },

    switchModule: function(modId) {
      if (StuUltraMax.activeModule === modId) return;
      var prev = StuUltraMax.activeModule;
      if (prev === 'liquify' && StuUltraMax.liquifyActive) {
        StuUltraMax.endLiquify(true);
      }
      StuUltraMax.activeModule = modId;
      var app = document.getElementById('app');
      if (app) app.setAttribute('data-max-mod', modId);
      document.querySelectorAll('.stu-max-rail-btn').forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-max-mod') === modId);
      });
      if (modId === 'liquify') {
        StuUltraMax.beginLiquify();
      } else {
        StuUltraMax.clearOverlayCursor();
      }
      StuUltraMax.renderModule();
      StuUltraMax.renderViewport();
    },

    updateDetectPills: function(st) {
      var el = document.getElementById('stu-max-detect-pills');
      if (!el) return;
      if (!st || !st.fid) {
        el.innerHTML = '';
        return;
      }
      var fCount = (st.detectFaces && st.detectFaces.length) || 0;
      var skyOk = st.detectSky && Number(st.detectSky.sky_info_status) === 1;
      el.innerHTML =
        '<span class="detect-badge">' + fCount + ' Khuôn mặt</span>' +
        '<span class="detect-badge ' + (skyOk ? 'ok' : 'muted') + '">' + (skyOk ? 'Bầu trời ✓' : 'Không thấy trời') + '</span>';
    },

    // =========================================================================
    // SERIALIZER -> EXACT aipic_retouch_image JSON
    // =========================================================================
    buildRetouchParam: function(st) {
      var cohorts = (st.beautyCohorts || []).filter(function(c) {
        return c.params && c.params.length > 0;
      }).map(function(c) {
        return {
          sex: Number(c.sex),
          age: Number(c.age),
          params: c.params,
          combine_classifyid_group: st.combineClassifyGroup || []
        };
      });

      var singleFaces = Object.keys(st.faceParams || {}).map(function(cid) {
        var fp = st.faceParams[cid];
        if (!fp || !fp.params || !fp.params.length) return null;
        return {
          sex: Number(fp.sex || 2),
          age: Number(fp.age || 2),
          classid: fp.classid,
          params: fp.params
        };
      }).filter(Boolean);

      var out = {
        sex_retoucher_beauty_params: cohorts.concat(singleFaces),
        sex_retoucher_color_params: {
          params: st.colorParams || [],
          partial_params: (st.partialParams || []).filter(function(p) {
            return p && p.params && p.params.length > 0;
          }),
          combine_classifyid_group: st.combineClassifyGroup || []
        }
      };
      if (st.liquidParams) out.liquid_params = st.liquidParams;
      return out;
    },

    hasAnyEdits: function(st) {
      if (!st) return false;
      if (st.liquidParams) return true;
      if (st.colorParams && st.colorParams.length > 0) return true;
      if (st.partialParams && st.partialParams.some(function(p) { return p.params && p.params.length > 0; })) return true;
      if (st.beautyCohorts && st.beautyCohorts.some(function(c) { return c.params && c.params.length > 0; })) return true;
      if (st.faceParams && Object.keys(st.faceParams).some(function(k) { return st.faceParams[k].params && st.faceParams[k].params.length > 0; })) return true;
      return false;
    },

    getActiveColorList: function(st) {
      if (StuUltraMax.colorScopeTab === 'mask') {
        var target = MASK_TARGETS.find(function(m) { return m.key === StuUltraMax.activeMaskKey; }) || MASK_TARGETS[0];
        var layer = (st.partialParams || []).find(function(p) {
          return p && p.mask_types && p.mask_types[0] === target.key;
        });
        return layer ? layer.params : [];
      }
      return st.colorParams || [];
    },

    upsertColorParam: function(st, algoId, patch, opts) {
      opts = opts || {};
      var targetArr;
      if (StuUltraMax.colorScopeTab === 'mask' && !opts.forceGlobal) {
        var target = MASK_TARGETS.find(function(m) { return m.key === StuUltraMax.activeMaskKey; }) || MASK_TARGETS[0];
        var layer = st.partialParams.find(function(p) {
          return p && p.mask_types && p.mask_types[0] === target.key;
        });
        if (!layer) {
          layer = {
            layer_type: target.layer_type,
            name: target.label,
            mask_types: [target.key],
            params: []
          };
          st.partialParams.push(layer);
        }
        targetArr = layer.params;
      } else {
        targetArr = st.colorParams;
      }
      StuUltraMax.applyAlgoPatchToArray(targetArr, algoId, patch, opts);
    },

    applyAlgoPatchToArray: function(arr, algoId, patch, opts) {
      opts = opts || {};
      var idNum = Number(algoId);
      if (opts.clearGroupIds && Array.isArray(opts.clearGroupIds)) {
        for (var i = arr.length - 1; i >= 0; i--) {
          if (opts.clearGroupIds.indexOf(Number(arr[i].id)) !== -1) arr.splice(i, 1);
        }
      }
      if (opts.isFilter) {
        for (var j = arr.length - 1; j >= 0; j--) {
          if (/^11/.test(String(arr[j].id))) arr.splice(j, 1);
        }
        if (idNum === -1 || opts.remove) return;
      }
      if (opts.remove) {
        for (var r = arr.length - 1; r >= 0; r--) {
          if (Number(arr[r].id) === idNum) arr.splice(r, 1);
        }
        return;
      }
      var existing = arr.find(function(it) { return Number(it.id) === idNum; });
      if (!existing) {
        arr.push({ id: idNum, algorithm: Object.assign({}, patch) });
      } else {
        Object.assign(existing.algorithm, patch);
      }
    },

    getActiveBeautyReadArray: function(st) {
      var key = StuUltraMax.activePortraitCohort;
      if (key === 'single') {
        var cid = StuUltraMax.selectedFaceClassId;
        return (cid != null && st.faceParams[cid]) ? st.faceParams[cid].params : [];
      }
      if (key === 'all') {
        return st.beautyCohorts[0] ? st.beautyCohorts[0].params : [];
      }
      var cohort = COHORT_DEFS.find(function(c) { return c.key === key; }) || COHORT_DEFS[0];
      var found = st.beautyCohorts.find(function(c) {
        return Number(c.age) === Number(cohort.age) && Number(c.sex) === Number(cohort.sex);
      });
      return found ? found.params : [];
    },

    upsertBeautyParam: function(st, algoId, patch, opts) {
      var key = StuUltraMax.activePortraitCohort;
      if (key === 'single') {
        var cid = StuUltraMax.selectedFaceClassId;
        if (cid == null) {
          toast('Chưa chọn khuôn mặt nào trong ảnh để chỉnh đơn');
          return;
        }
        if (!st.faceParams[cid]) {
          var faceObj = (st.detectFaces || []).find(function(f) { return f.classid === cid; }) || {};
          st.faceParams[cid] = {
            sex: faceObj.sex || 2,
            age: faceObj.age || 2,
            classid: cid,
            params: []
          };
        }
        StuUltraMax.applyAlgoPatchToArray(st.faceParams[cid].params, algoId, patch, opts);
        return;
      }
      if (key === 'all') {
        st.beautyCohorts.forEach(function(c) {
          StuUltraMax.applyAlgoPatchToArray(c.params, algoId, patch, opts);
        });
        return;
      }
      var def = COHORT_DEFS.find(function(c) { return c.key === key; }) || COHORT_DEFS[0];
      var target = st.beautyCohorts.find(function(c) {
        return Number(c.age) === Number(def.age) && Number(c.sex) === Number(def.sex);
      });
      if (target) StuUltraMax.applyAlgoPatchToArray(target.params, algoId, patch, opts);
    },

    getAlgoObject: function(st, isBeauty, algoId) {
      var list = isBeauty ? StuUltraMax.getActiveBeautyReadArray(st) : StuUltraMax.getActiveColorList(st);
      var item = list.find(function(x) { return Number(x.id) === Number(algoId); });
      return item ? item.algorithm : null;
    },

    scheduleRetouch: function(isChanging) {
      var A = window._devstuA;
      var photo = A && A.current;
      if (!photo || !photo._lkMaxState || !photo._lkMaxState.fid) return;
      StuUltraMax.syncDirtyIndicators();

      clearTimeout(StuUltraMax._retouchDebounce);
      var delay = isChanging ? 30 : 10;
      StuUltraMax._retouchDebounce = setTimeout(function() {
        StuUltraMax._enqueueRetouch(photo, !!isChanging);
      }, delay);
    },

    _enqueueRetouch: function(photo, isChanging) {
      if (StuUltraMax._retouchInFlight) {
        StuUltraMax._retouchPending = { photo: photo, isChanging: isChanging };
        return;
      }
      StuUltraMax._retouchInFlight = true;
      var st = ensureState(photo);
      var param = StuUltraMax.buildRetouchParam(st);
      var seq = ++StuUltraMax._retouchSeq;
      StuUltraMax.setStatus('Đang xử lý GPU...', 'busy');

      var waitBase = (!st.origBaselineUrl && st._baselinePromise) ? st._baselinePromise : Promise.resolve();
      waitBase.then(function() {
        return postJson('/api/lk_ultra_max/retouch', {
          fid: st.fid,
          mode: 1,
          is_changing: isChanging,
          fast_url: true,
          param: param
        });
      }).then(function(res) {
        StuUltraMax._retouchInFlight = false;
        if (res && res.ok) {
          var nextSrc = resolvePreviewSrc(res);
          if (nextSrc) st.afterDataUrl = nextSrc;
          if (res.histogram && (res.histogram.histogram_infos || res.histogram.r || Array.isArray(res.histogram))) {
            st.histogram = res.histogram;
          }
          StuUltraMax.setStatus('AI Studio Engine ✓ • FID ' + st.fid, 'ready');
          if (window._devstuA && window._devstuA.current === photo) {
            StuUltraMax.renderViewport();
            StuUltraMax.renderHistogramSvg();
          }
        } else {
          StuUltraMax.setStatus('Lỗi retouch: ' + ((res && res.error) || ''), 'error');
        }
        if (StuUltraMax._retouchPending) {
          var next = StuUltraMax._retouchPending;
          StuUltraMax._retouchPending = null;
          StuUltraMax._enqueueRetouch(next.photo, next.isChanging);
        }
      }).catch(function(err) {
        StuUltraMax._retouchInFlight = false;
        StuUltraMax.setStatus('Lỗi retouch: ' + err, 'error');
        StuUltraMax._retouchPending = null;
      });
    },

    // =========================================================================
    // CANVAS VIEWPORT & HISTOGRAM RENDERING
    // =========================================================================
    renderViewport: function() {
      var vp = StuUltraMax.viewportEl;
      if (!vp) return;
      var A = window._devstuA;
      var photo = A && A.current;
      if (!photo) {
        vp.classList.add('is-empty');
        StuUltraMax.updateViewportLoading(null);
        if (StuUltraMax.stageFlex) StuUltraMax.stageFlex.classList.remove('is-sbs');
        if (StuUltraMax.sbsPane) StuUltraMax.sbsPane.classList.add('hidden');
        if (StuUltraMax.sbsAfterTag) StuUltraMax.sbsAfterTag.classList.add('hidden');
        if (StuUltraMax.splitLine) StuUltraMax.splitLine.classList.add('hidden');
        if (StuUltraMax.beforeCanvas) StuUltraMax.beforeCanvas.style.display = 'none';
        StuUltraMax.syncToolbarState(1);
        return;
      }
      vp.classList.remove('is-empty');
      var st = ensureState(photo);
      StuUltraMax.updateViewportLoading(st);
      var afterUrl = st.afterDataUrl || photo._lkMaxOrigDataUrl || '';
      var beforeUrl = st.origBaselineUrl || photo._lkMaxOrigDataUrl || afterUrl;
      if (!afterUrl && !beforeUrl) return;

      var effAfterUrl = StuUltraMax.holdOriginal ? beforeUrl : afterUrl;
      var showSplit = StuUltraMax.compareMode === 1 && !StuUltraMax.holdOriginal;
      var showSbs = StuUltraMax.compareMode === 2 && !StuUltraMax.holdOriginal;

      if (StuUltraMax.stageFlex) StuUltraMax.stageFlex.classList.toggle('is-sbs', showSbs);
      if (StuUltraMax.sbsPane) StuUltraMax.sbsPane.classList.toggle('hidden', !showSbs);
      if (StuUltraMax.sbsAfterTag) StuUltraMax.sbsAfterTag.classList.toggle('hidden', !showSbs);
      if (StuUltraMax.beforeCanvas) {
        StuUltraMax.beforeCanvas.style.display = showSplit ? 'block' : 'none';
        if (showSplit) StuUltraMax.applySplitClip();
      }
      if (StuUltraMax.splitLine) StuUltraMax.splitLine.classList.toggle('hidden', !showSplit);

      if (!StuUltraMax._imgCache) {
        StuUltraMax._imgCache = { before: { src: '', img: null }, after: { src: '', img: null } };
      }
      var targetAfterSrc = effAfterUrl || beforeUrl;
      var targetBeforeSrc = beforeUrl || effAfterUrl;

      var drawAlignedCover = function(ctx, img, w, h) {
        var sw = img.naturalWidth || img.width || w;
        var sh = img.naturalHeight || img.height || h;
        if (!sw || !sh || !w || !h) return;
        var imgRatio = sw / sh;
        var dstRatio = w / h;
        if (Math.abs(imgRatio - dstRatio) <= 0.004) {
          ctx.drawImage(img, 0, 0, w, h);
          return;
        }
        var sx = 0, sy = 0, cw = sw, ch = sh;
        if (imgRatio > dstRatio) {
          cw = sh * dstRatio;
          sx = (sw - cw) * 0.5;
        } else {
          ch = sw / dstRatio;
          sy = (sh - ch) * 0.5;
        }
        ctx.drawImage(img, sx, sy, cw, ch, 0, 0, w, h);
      };

      var seq = ++StuUltraMax._renderSeq;

      var paintBoth = function(afterImg, beforeImg) {
        if (seq !== StuUltraMax._renderSeq) return;
        var cur = window._devstuA && window._devstuA.current;
        if (cur && cur !== photo) return;

        var iw = afterImg.naturalWidth || beforeImg.naturalWidth || 800;
        var ih = afterImg.naturalHeight || beforeImg.naturalHeight || 600;
        var vpRect = vp.getBoundingClientRect();
        var vpStyle = getComputedStyle(vp);
        var padX = (parseFloat(vpStyle.paddingLeft) || 20) + (parseFloat(vpStyle.paddingRight) || 20);
        var padY = (parseFloat(vpStyle.paddingTop) || 52) + (parseFloat(vpStyle.paddingBottom) || 76);
        var rawW = Math.max(120, (vpRect.width || (window.innerWidth - 380)) - padX);
        var rawH = Math.max(120, (vpRect.height || (window.innerHeight - 200)) - padY);
        var availW = showSbs ? Math.max(80, Math.floor((rawW - 10) / 2)) : rawW;
        var availH = rawH;

        var fitScale = Math.min(availW / iw, availH / ih);
        StuUltraMax._fitScale = fitScale;
        var scale = StuUltraMax.zoomScale > 0 ? StuUltraMax.zoomScale : fitScale;
        var dispW = Math.max(40, Math.round(iw * scale));
        var dispH = Math.max(40, Math.round(ih * scale));
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var bufW = Math.max(40, Math.min(4096, Math.round(dispW * dpr)));
        var bufH = Math.max(40, Math.min(4096, Math.round(dispH * dpr)));

        var tr = StuUltraMax.zoomScale > 0
          ? ('translate(' + Math.round(StuUltraMax.panX) + 'px,' + Math.round(StuUltraMax.panY) + 'px)')
          : '';
        var panCursor = StuUltraMax.zoomScale > fitScale * 1.02 ? 'grab' : '';
        StuUltraMax.canvasWrap.style.width = dispW + 'px';
        StuUltraMax.canvasWrap.style.height = dispH + 'px';
        StuUltraMax.canvasWrap.style.transform = tr;
        if (StuUltraMax.overlayCanvas) {
          StuUltraMax.overlayCanvas.width = dispW;
          StuUltraMax.overlayCanvas.height = dispH;
          StuUltraMax.overlayCanvas.style.cursor =
            (StuUltraMax.activeModule === 'liquify' && StuUltraMax.liquifyTool === 'push')
              ? 'crosshair'
              : panCursor;
        }
        if (StuUltraMax.sbsBeforeWrap) {
          StuUltraMax.sbsBeforeWrap.style.cursor = panCursor;
        }

        StuUltraMax.afterCanvas.width = bufW;
        StuUltraMax.afterCanvas.height = bufH;
        var aCtx = StuUltraMax.afterCanvas.getContext('2d');
        aCtx.imageSmoothingEnabled = true;
        aCtx.imageSmoothingQuality = 'high';
        aCtx.clearRect(0, 0, bufW, bufH);
        drawAlignedCover(aCtx, afterImg, bufW, bufH);

        if (showSplit && StuUltraMax.beforeCanvas) {
          StuUltraMax.beforeCanvas.width = bufW;
          StuUltraMax.beforeCanvas.height = bufH;
          var bCtx = StuUltraMax.beforeCanvas.getContext('2d');
          bCtx.imageSmoothingEnabled = true;
          bCtx.imageSmoothingQuality = 'high';
          bCtx.clearRect(0, 0, bufW, bufH);
          drawAlignedCover(bCtx, beforeImg, bufW, bufH);
          StuUltraMax.applySplitClip();
        }

        if (showSbs && StuUltraMax.sbsBeforeWrap && StuUltraMax.sbsBeforeCanvas) {
          StuUltraMax.sbsBeforeWrap.style.width = dispW + 'px';
          StuUltraMax.sbsBeforeWrap.style.height = dispH + 'px';
          StuUltraMax.sbsBeforeWrap.style.transform = tr;
          StuUltraMax.sbsBeforeCanvas.width = bufW;
          StuUltraMax.sbsBeforeCanvas.height = bufH;
          var sCtx = StuUltraMax.sbsBeforeCanvas.getContext('2d');
          sCtx.imageSmoothingEnabled = true;
          sCtx.imageSmoothingQuality = 'high';
          sCtx.clearRect(0, 0, bufW, bufH);
          drawAlignedCover(sCtx, beforeImg, bufW, bufH);
        }

        StuUltraMax.drawFaceBoxes();
        StuUltraMax.syncToolbarState(scale);
        StuUltraMax.updateNavMiniMap();
      };

      var needBefore = showSplit || showSbs;
      var cachedA = StuUltraMax._imgCache.after;
      var cachedB = StuUltraMax._imgCache.before;
      var aReady = cachedA.src === targetAfterSrc && cachedA.img && cachedA.img.complete && cachedA.img.naturalWidth > 0;
      var bReady = !needBefore || (cachedB.src === targetBeforeSrc && cachedB.img && cachedB.img.complete && cachedB.img.naturalWidth > 0);
      if (aReady && bReady) {
        paintBoth(cachedA.img, cachedB.img || cachedA.img);
        return;
      }

      var afterImg = aReady ? cachedA.img : new Image();
      var beforeImg = needBefore ? (bReady ? cachedB.img : new Image()) : afterImg;
      var pending = (aReady ? 0 : 1) + (needBefore && !bReady ? 1 : 0);
      var onOneReady = function() {
        if (--pending <= 0) paintBoth(afterImg, beforeImg);
      };

      if (!aReady) {
        afterImg.onload = function() {
          StuUltraMax._imgCache.after = { src: targetAfterSrc, img: afterImg };
          onOneReady();
        };
        afterImg.onerror = function() {
          if (targetBeforeSrc && afterImg.src !== targetBeforeSrc) afterImg.src = targetBeforeSrc;
          else onOneReady();
        };
        afterImg.src = targetAfterSrc;
      }
      if (needBefore && !bReady) {
        beforeImg.onload = function() {
          StuUltraMax._imgCache.before = { src: targetBeforeSrc, img: beforeImg };
          onOneReady();
        };
        beforeImg.onerror = function() {
          if (targetAfterSrc && beforeImg.src !== targetAfterSrc) beforeImg.src = targetAfterSrc;
          else onOneReady();
        };
        beforeImg.src = targetBeforeSrc;
      }
    },

    updateNavMiniMap: function() {
      if (!StuUltraMax.navVisible || !StuUltraMax.navCard || !StuUltraMax.afterCanvas) return;
      var nc = document.getElementById('stu-max-nav-canvas');
      var src = StuUltraMax.afterCanvas;
      if (!nc || !src.width || !src.height) return;
      var h = Math.max(60, Math.round(194 * (src.height / src.width)));
      if (nc.width !== 194 || nc.height !== h) {
        nc.width = 194;
        nc.height = h;
      }
      var ctx = nc.getContext('2d');
      ctx.clearRect(0, 0, 194, h);
      ctx.drawImage(src, 0, 0, 194, h);
    },

    applySplitClip: function() {
      var pct = Math.round(StuUltraMax.splitPos * 1000) / 10;
      if (StuUltraMax.splitLine) StuUltraMax.splitLine.style.left = pct + '%';
      if (StuUltraMax.beforeCanvas) StuUltraMax.beforeCanvas.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    },

    drawFaceBoxes: function() {
      var ov = StuUltraMax.overlayCanvas;
      if (!ov) return;
      var ctx = ov.getContext('2d');
      ctx.clearRect(0, 0, ov.width, ov.height);
      if (StuUltraMax.activeModule !== 'beauty' || StuUltraMax.activePortraitCohort !== 'single') return;
      var photo = window._devstuA && window._devstuA.current;
      var st = photo && photo._lkMaxState;
      if (!st || !st.detectFaces || !st.detectFaces.length) return;
      st.detectFaces.forEach(function(f, idx) {
        var box = f.face_rect || f.rect || f.box;
        if (!box) return;
        var x = (box.x || box.left || 0) * (box.x <= 1 ? ov.width : 1);
        var y = (box.y || box.top || 0) * (box.y <= 1 ? ov.height : 1);
        var w = (box.w || box.width || ((box.right || 0) - (box.left || 0))) * ((box.w || box.width || 2) <= 1 ? ov.width : 1);
        var h = (box.h || box.height || ((box.bottom || 0) - (box.top || 0))) * ((box.h || box.height || 2) <= 1 ? ov.height : 1);
        var active = f.classid === StuUltraMax.selectedFaceClassId;
        ctx.strokeStyle = active ? '#0099ff' : 'rgba(255,255,255,0.65)';
        ctx.lineWidth = active ? 2.5 : 1.5;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = active ? '#0099ff' : 'rgba(0,0,0,0.65)';
        ctx.fillRect(x, Math.max(0, y - 18), 54, 18);
        ctx.fillStyle = '#fff';
        ctx.font = '11px sans-serif';
        ctx.fillText('Mặt #' + (idx + 1), x + 5, Math.max(13, y - 5));
      });
    },

    renderHistogramSvg: function() {
      var svg = document.getElementById('stu-max-hist-svg');
      if (!svg) return;
      var photo = window._devstuA && window._devstuA.current;
      var h = photo && photo._lkMaxState && photo._lkMaxState.histogram;
      if (typeof h === 'string' && h) {
        try { h = JSON.parse(h); } catch (_) { h = null; }
      }
      var info = (h && h.histogram_infos) || (h && h.data) || h;
      var rArr = (info && (info.r || info.red || info.R)) || [];
      var gArr = (info && (info.g || info.green || info.G)) || [];
      var bArr = (info && (info.b || info.blue || info.B)) || [];
      var lArr = (info && (info.rgb || info.l)) || [];
      if (!rArr.length && Array.isArray(h)) {
        rArr = h; gArr = h; bArr = h;
      }
      if (!rArr.length && !gArr.length && !bArr.length && !lArr.length) {
        svg.innerHTML = '<text x="128" y="42" text-anchor="middle" fill="#71717a" font-size="10">Đang chờ dữ liệu biểu đồ RGB...</text>';
        return;
      }
      var maxV = 1;
      [rArr, gArr, bArr, lArr].forEach(function(arr) {
        for (var i = 2; i < arr.length - 2; i++) {
          if (arr[i] > maxV) maxV = arr[i];
        }
      });
      function pathFor(arr) {
        if (!arr || !arr.length) return '';
        var len = arr.length;
        var d = 'M 0 78 ';
        for (var i = 0; i < len; i++) {
          var x = (i / Math.max(1, len - 1)) * 256;
          var y = 78 - Math.min(1, arr[i] / maxV) * 72;
          d += 'L ' + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
        }
        return d + 'L 256 78 Z';
      }
      svg.innerHTML =
        (lArr.length ? '<path d="' + pathFor(lArr) + '" fill="rgba(228,228,231,0.16)" stroke="rgba(228,228,231,0.45)" stroke-width="0.9"/>' : '') +
        '<path d="' + pathFor(rArr) + '" fill="rgba(239,68,68,0.28)" stroke="#ef4444" stroke-width="1"/>' +
        '<path d="' + pathFor(gArr) + '" fill="rgba(34,197,94,0.28)" stroke="#22c55e" stroke-width="1"/>' +
        '<path d="' + pathFor(bArr) + '" fill="rgba(59,130,246,0.28)" stroke="#3b82f6" stroke-width="1"/>';
    },

    // =========================================================================
    // INSPECTOR RENDERERS (ALL 6 MODULES)
    // =========================================================================
    renderModule: function() {
      var body = StuUltraMax.inspector;
      if (!body) return;
      var scrollPrev = body.scrollTop;
      var mod = StuUltraMax.activeModule;
      var A = window._devstuA;
      var photo = A && A.current;
      var st = ensureState(photo);

      if (mod === 'color') body.innerHTML = StuUltraMax.renderColorModuleHtml(st);
      else if (mod === 'beauty') body.innerHTML = StuUltraMax.renderPortraitModuleHtml(st);
      else if (mod === 'background') body.innerHTML = StuUltraMax.renderBackgroundModuleHtml(st);
      else if (mod === 'clothing') body.innerHTML = StuUltraMax.renderClothingModuleHtml(st);
      else if (mod === 'camera') body.innerHTML = StuUltraMax.renderCameraModuleHtml();
      else if (mod === 'liquify') body.innerHTML = StuUltraMax.renderLiquifyModuleHtml();

      StuUltraMax.bindInspectorEvents(body, st);
      if (mod === 'color') StuUltraMax.renderHistogramSvg();
      if (mod === 'color' && StuUltraMax.colorTopTab === 'adjust') StuUltraMax.bindCurveCanvas(body, st);
      body.scrollTop = scrollPrev;
      StuUltraMax.syncDirtyIndicators();
    },

    syncDirtyIndicators: function() {
      var A = window._devstuA;
      var photo = A && A.current;
      var st = photo && photo._lkMaxState;
      var beautyDirty = Boolean(st && ((st.beautyCohorts || []).some(function(c) { return c.params && c.params.length; }) || Object.keys(st.faceParams || {}).length > 0));
      var bgIds = [610001, 610002, 610003, 610004, 610005, 620001, 620002, 630001, 630002];
      var bgDirty = Boolean(st && (st.colorParams || []).some(function(p) { return bgIds.indexOf(Number(p.id)) !== -1; }));
      var clothDirty = Boolean(st && (st.colorParams || []).some(function(p) { return [710001, 710002, 710003].indexOf(Number(p.id)) !== -1; }));
      var colorDirty = Boolean(st && ((st.colorParams || []).some(function(p) { return bgIds.indexOf(Number(p.id)) === -1 && [710001, 710002, 710003].indexOf(Number(p.id)) === -1; }) || (st.partialParams && st.partialParams.length > 0)));

      var map = { color: colorDirty, beauty: beautyDirty, background: bgDirty, clothing: clothDirty };
      Object.keys(map).forEach(function(k) {
        var dot = document.querySelector('[data-dirty-mod="' + k + '"]');
        if (dot) dot.classList.toggle('on', map[k]);
      });
    },

    renderSliderHtml: function(cfg) {
      var val = cfg.val != null ? cfg.val : cfg.def;
      var min = cfg.min != null ? cfg.min : 0;
      var max = cfg.max != null ? cfg.max : 100;
      var step = cfg.step != null ? cfg.step : 1;
      var pct = Math.max(0, Math.min(100, ((val - min) / Math.max(0.0001, max - min)) * 100));
      var originPct = min < 0 ? ((-min) / (max - min)) * 100 : 0;
      var gradClass = cfg.grad ? ' grad-' + cfg.grad : '';
      return '<div class="lk-slider-row' + gradClass + '">' +
        '<div class="lk-slider-head">' +
          '<span class="lk-s-lbl">' + escapeHtml(cfg.label) + '</span>' +
          '<span class="lk-s-val" data-val-key="' + escapeHtml(cfg.key) + '">' + val + '</span>' +
        '</div>' +
        '<input type="range" class="lk-range" data-lk-slider="' + escapeHtml(cfg.key) + '"' +
          ' data-algo="' + escapeHtml(cfg.algoId) + '"' +
          ' data-ename="' + escapeHtml(cfg.ename || 'value') + '"' +
          ' data-scope="' + (cfg.scope || 1) + '"' +
          ' data-beauty="' + (cfg.isBeauty ? '1' : '0') + '"' +
          ' data-def="' + (cfg.def || 0) + '"' +
          ' data-link-left="' + (cfg.linkLeft || '') + '"' +
          ' data-link-right="' + (cfg.linkRight || '') + '"' +
          ' min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"' +
          ' style="--p:' + pct + '%;--o:' + originPct + '%" />' +
      '</div>';
    },

    renderSwitchHtml: function(cfg) {
      return '<div class="lk-switch-row">' +
        '<span class="lk-s-lbl">' + escapeHtml(cfg.label) + '</span>' +
        '<label class="lk-switch">' +
          '<input type="checkbox" data-lk-switch="1" data-algo="' + escapeHtml(cfg.algoId) + '" data-ename="' + escapeHtml(cfg.ename || 'value') + '" data-max="' + (cfg.max || 100) + '" data-beauty="' + (cfg.isBeauty ? '1' : '0') + '" ' + (cfg.checked ? 'checked' : '') + ' />' +
          '<span class="lk-switch-track"></span>' +
        '</label>' +
      '</div>';
    },

    // ---- COLOR REFERENCE GALLERY HELPERS ----
    getAllColorRefItems: function() {
      var cat = StuUltraMax.colorRefCatalog || {};
      var custom = Array.isArray(StuUltraMax.customColorRefs) ? StuUltraMax.customColorRefs : [];
      var personal = Array.isArray(cat.personal) ? cat.personal : [];
      var presets = Array.isArray(cat.presets) ? cat.presets : [];
      return custom.concat(personal, presets);
    },

    renderRefCardsHtml: function(items, st) {
      return '<div class="lk-ref-grid">' + items.map(function(item) {
        var isActive = st.referSampleId === item.id;
        var isLoading = st._refLoadingId === item.id;
        var src = item.thumbUrl || item.dataUrl || ('/api/lk_ultra_max/asset?path=' + encodeURIComponent(item.icon || item.scene));
        return '<div class="lk-ref-card' + (isActive ? ' active' : '') + (isLoading ? ' loading' : '') + '" role="button" tabindex="0" data-ref-sample="' + escapeHtml(item.id) + '" title="' + escapeHtml(item.name) + '">' +
          (item.isCustom ? '<button type="button" class="lk-ref-del" data-ref-del="' + escapeHtml(item.id) + '" title="Xóa ảnh mẫu">×</button>' : '') +
          '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(item.name) + '" />' +
          '<span class="lk-ref-label">' + escapeHtml(item.name) + '</span>' +
        '</div>';
      }).join('') + '</div>';
    },

    renderColorRefGalleryHtml: function(st) {
      var cat = StuUltraMax.colorRefCatalog || {};
      var custom = Array.isArray(StuUltraMax.customColorRefs) ? StuUltraMax.customColorRefs : [];
      var personal = custom.concat(Array.isArray(cat.personal) ? cat.personal : []);
      var presets = Array.isArray(cat.presets) ? cat.presets : [];
      var out = '';
      if (personal.length) {
        out += '<div class="lk-ref-sec-title">Ảnh mẫu cá nhân (' + personal.length + ')</div>' +
          StuUltraMax.renderRefCardsHtml(personal, st);
      }
      if (presets.length) {
        out += '<div class="lk-ref-sec-title">Mẫu màu AI đề xuất (' + presets.length + ')</div>' +
          StuUltraMax.renderRefCardsHtml(presets, st);
      }
      return out;
    },

    applyColorSceneSample: function(st, meta) {
      if (!st || !st.fid) {
        toast('Đang nạp ảnh vào GPU Studio Engine, vui lòng chờ giây lát...');
        return;
      }
      meta = meta || {};
      st._refLoadingId = '';
      st.referPath = meta.scene || '';
      st.referName = meta.name || 'custom_ref';
      st.referSampleId = meta.id || '';
      st.referThumbUrl = meta.thumbUrl || meta.dataUrl || (meta.icon || meta.scene ? ('/api/lk_ultra_max/asset?path=' + encodeURIComponent(meta.icon || meta.scene)) : '');
      var curParsed = parseRefValue(StuUltraMax.getAlgoObject(st, false, 170001));
      StuUltraMax.upsertColorParam(st, 170001, {
        value: JSON.stringify(curParsed),
        refer_name: 'sys_ai_color_simulation',
        scene: st.referPath
      }, { forceGlobal: true });
      StuUltraMax.renderModule();
      StuUltraMax.scheduleRetouch(false);
      toast('Đã nạp Ảnh Mẫu AI: ' + st.referName);
    },

    applyColorReferenceData: function(st, dataUrl, meta) {
      if (!st || !st.fid) {
        toast('Đang nạp ảnh vào GPU Studio Engine, vui lòng chờ giây lát...');
        return;
      }
      meta = meta || {};
      st._refLoadingId = meta.id || '';
      st.referThumbUrl = meta.thumbUrl || dataUrl;
      StuUltraMax.renderModule();
      postJson('/api/lk_ultra_max/reference', { fid: st.fid, purpose: 'color_ref', image_base64: dataUrl }).then(function(res) {
        st._refLoadingId = '';
        if (res && res.ok) {
          var scenePath = res.scene || res.refer_path || '';
          if (res.scene && meta.isCustom) {
            meta.scene = res.scene;
            saveCustomColorRef(meta);
          }
          StuUltraMax.applyColorSceneSample(st, Object.assign({}, meta, { scene: scenePath, thumbUrl: meta.thumbUrl || dataUrl }));
        } else {
          StuUltraMax.renderModule();
          toast('Không nạp được Ảnh Mẫu AI: ' + ((res && res.error) || 'Lỗi engine'));
        }
      }).catch(function(err) {
        st._refLoadingId = '';
        StuUltraMax.renderModule();
        toast('Lỗi nạp Ảnh Mẫu AI: ' + String(err));
      });
    },

    selectColorSampleById: function(st, sampleId) {
      if (!st || !st.fid) {
        toast('Đang nạp ảnh vào GPU Studio Engine, vui lòng chờ giây lát...');
        return;
      }
      var item = StuUltraMax.getAllColorRefItems().find(function(x) { return x.id === sampleId; });
      if (!item) return;
      if (item.scene) {
        StuUltraMax.applyColorSceneSample(st, item);
        return;
      }
      if (item.dataUrl) {
        StuUltraMax.applyColorReferenceData(st, item.dataUrl, item);
        return;
      }
    },

    // ---- MODULE 1: MÀU SẮC ----
    renderColorModuleHtml: function(st) {
      var catColor = (StuUltraMax.catalog && StuUltraMax.catalog.panelJson && StuUltraMax.catalog.panelJson[0]) || null;
      var html = '<div class="lk-mod-header">' +
        '<div class="lk-mod-title"><span class="ico">◐</span><span>Màu sắc</span></div>' +
        '<button type="button" class="lk-reset-mini" data-reset-mod="color">Đặt lại</button>' +
      '</div>';

      html += '<div class="lk-hist-box"><svg id="stu-max-hist-svg" viewBox="0 0 256 80" preserveAspectRatio="none"></svg></div>';

      html += '<div class="lk-seg-top">' +
        '<button type="button" class="lk-seg-btn' + (StuUltraMax.colorTopTab === 'ref' ? ' active' : '') + '" data-color-top="ref">Face Màu Mẫu</button>' +
        '<button type="button" class="lk-seg-btn' + (StuUltraMax.colorTopTab === 'adjust' ? ' active' : '') + '" data-color-top="adjust">Màu Sắc/Ánh Sáng</button>' +
      '</div>';

      if (StuUltraMax.colorTopTab === 'ref') {
        var refObj = StuUltraMax.getAlgoObject(st, false, 170001) || {};
        var parsedRef = parseRefValue(refObj);
        var curRef = st.referScope === 'person'
          ? parsedRef.localized_adjustment[0]
          : (st.referScope === 'background' ? parsedRef.background : parsedRef.overall_adjustment);
        html += '<div class="lk-card">' +
          '<div class="lk-ref-box">' +
            (st.referThumbUrl ? '<img class="lk-ref-preview" src="' + st.referThumbUrl + '" />' : '<div class="lk-ref-empty">Chưa chọn ảnh mẫu AI</div>') +
            '<div class="lk-ref-actions">' +
              '<label class="lk-upload-btn"><span>+ Tải Ảnh Mẫu</span><input type="file" id="stu-max-ref-file" accept="image/*" hidden /></label>' +
              (st.referThumbUrl ? '<button type="button" class="lk-ref-clear-btn" id="stu-max-ref-clear">Bỏ mẫu</button>' : '') +
            '</div>' +
            '<p class="lk-ref-hint">Chọn ảnh JPG/PNG trên máy để dùng làm mẫu màu.</p>' +
          '</div>' +
          '<div class="lk-sub-pills" style="margin:8px 0">' +
            '<button type="button" class="lk-pill' + (st.referScope === 'all' ? ' active' : '') + '" data-ref-scope="all">Toàn ảnh</button>' +
            '<button type="button" class="lk-pill' + (st.referScope === 'person' ? ' active' : '') + '" data-ref-scope="person">Chủ thể</button>' +
            '<button type="button" class="lk-pill' + (st.referScope === 'background' ? ' active' : '') + '" data-ref-scope="background">Hậu cảnh</button>' +
          '</div>' +
          StuUltraMax.renderSliderHtml({ key: 'ref_degree', label: 'Mức độ', algoId: 170001, ename: 'ref_degree', min: 0, max: 100, def: 100, val: curRef.degree != null ? curRef.degree : 100 }) +
          StuUltraMax.renderSliderHtml({ key: 'ref_tone', label: 'Tông màu/Ánh sáng', algoId: 170001, ename: 'ref_tone', min: 0, max: 100, def: 100, val: curRef.tone != null ? curRef.tone : 100 }) +
          StuUltraMax.renderSliderHtml({ key: 'ref_color', label: 'Màu sắc', algoId: 170001, ename: 'ref_color', min: 0, max: 100, def: 100, val: curRef.color != null ? curRef.color : 100 }) +
          StuUltraMax.renderColorRefGalleryHtml(st) +
        '</div>';
        return html;
      }

      html += '<div class="lk-sub-pills" style="margin-bottom:8px">' +
        '<button type="button" class="lk-pill' + (StuUltraMax.colorScopeTab === 'basic' ? ' active' : '') + '" data-color-scope="basic">Cơ Bản</button>' +
        '<button type="button" class="lk-pill' + (StuUltraMax.colorScopeTab === 'mask' ? ' active' : '') + '" data-color-scope="mask">Mặt Nạ</button>' +
      '</div>';

      if (StuUltraMax.colorScopeTab === 'mask') {
        html += '<div class="lk-mask-strip">';
        MASK_TARGETS.forEach(function(m) {
          var active = m.key === StuUltraMax.activeMaskKey;
          var layer = (st.partialParams || []).find(function(p) { return p.mask_types && p.mask_types[0] === m.key && p.params && p.params.length; });
          html += '<button type="button" class="lk-pill sm' + (active ? ' active' : '') + '" data-mask-key="' + m.key + '">' +
            escapeHtml(m.label) + (layer ? ' •' : '') + '</button>';
        });
        html += '</div>';
      }

      if (!catColor || !catColor.sub) return html + '<div class="lk-loading">Đang nạp catalog...</div>';

      catColor.sub.forEach(function(grp) {
        if (grp.classifyid === 41) return; // Ref color rendered in top tab
        var gid = String(grp.classifyid || grp.name);
        var isOpen = !!StuUltraMax.openGroups[gid];
        var ids = StuUltraMax.collectAlgoIds(grp);
        var dirty = ids.some(function(id) { return !!StuUltraMax.getAlgoObject(st, false, id); });

        html += '<div class="lk-acc' + (isOpen ? ' open' : '') + '" data-acc-id="' + escapeHtml(gid) + '">' +
          '<div class="lk-acc-hdr" data-toggle-acc="' + escapeHtml(gid) + '">' +
            '<span class="lk-acc-name">' + (grp.classifyid === 100 ? '✦ ' : '') + escapeHtml(grp.name) + (dirty ? ' <i class="acc-dot">•</i>' : '') + '</span>' +
            '<span class="lk-acc-actions">' +
              '<button type="button" class="lk-acc-undo" data-reset-ids="' + ids.join(',') + '" title="Đặt lại nhóm">↶</button>' +
              '<span class="lk-acc-chev">' + (isOpen ? '⌃' : '⌄') + '</span>' +
            '</span>' +
          '</div>' +
          '<div class="lk-acc-body">';

        if (isOpen) {
          if (grp.classifyid === 9) html += StuUltraMax.renderCurvesEditorHtml(st);
          else if (grp.classifyid === 12) html += StuUltraMax.renderHslEditorHtml(st);
          else if (grp.classifyid === 5) html += StuUltraMax.renderFilterBankHtml(grp, st);
          else html += StuUltraMax.renderCatalogGroupChildren(grp, st, false);
        }
        html += '</div></div>';
      });
      return html;
    },

    renderCurvesEditorHtml: function(st) {
      var curObj = StuUltraMax.getAlgoObject(st, false, 150001) || {};
      var arr = [];
      try { arr = curObj.value ? JSON.parse(curObj.value) : []; } catch (e) {}
      var ch = CURVE_CHANNELS.find(function(c) { return c.code === StuUltraMax.activeCurveChannel; }) || CURVE_CHANNELS[0];
      var found = arr.find(function(x) { return Number(x.color_type) === ch.code; });
      var pts = (found && found.point_arr && found.point_arr.length) ? found.point_arr : [{ x: 0, y: 0 }, { x: 255, y: 255 }];

      var tabs = CURVE_CHANNELS.map(function(c) {
        return '<button type="button" class="lk-curve-ch' + (c.code === ch.code ? ' active' : '') + '" data-curve-ch="' + c.code + '" style="--cc:' + c.color + '">' + c.label + '</button>';
      }).join('');

      var svgPts = pts.map(function(p, idx) {
        var cx = (p.x / 255) * 200;
        var cy = 200 - (p.y / 255) * 200;
        return '<circle class="lk-curve-pt" data-pt-idx="' + idx + '" cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="4.5" fill="' + ch.color + '" stroke="#111" stroke-width="1.5"/>';
      }).join('');

      var poly = pts.map(function(p) {
        return ((p.x / 255) * 200).toFixed(1) + ',' + (200 - (p.y / 255) * 200).toFixed(1);
      }).join(' ');

      return '<div class="lk-curve-tabs">' + tabs +
          '<button type="button" class="lk-curve-reset" data-curve-reset="1" title="Đặt lại kênh này">↺</button>' +
        '</div>' +
        '<div class="lk-curve-wrap">' +
          '<svg id="stu-max-curve-svg" viewBox="0 0 200 200">' +
            '<line x1="50" y1="0" x2="50" y2="200" stroke="#2d2f36" stroke-width="1"/>' +
            '<line x1="100" y1="0" x2="100" y2="200" stroke="#2d2f36" stroke-width="1"/>' +
            '<line x1="150" y1="0" x2="150" y2="200" stroke="#2d2f36" stroke-width="1"/>' +
            '<line x1="0" y1="50" x2="200" y2="50" stroke="#2d2f36" stroke-width="1"/>' +
            '<line x1="0" y1="100" x2="200" y2="100" stroke="#2d2f36" stroke-width="1"/>' +
            '<line x1="0" y1="150" x2="200" y2="150" stroke="#2d2f36" stroke-width="1"/>' +
            '<line x1="0" y1="200" x2="200" y2="0" stroke="#3f434d" stroke-dasharray="3,3" stroke-width="1"/>' +
            '<polyline id="stu-max-curve-poly" fill="none" stroke="' + ch.color + '" stroke-width="2" points="' + poly + '"/>' +
            svgPts +
          '</svg>' +
          '<div class="lk-curve-tip">Bấm để thêm điểm • Kéo để chỉnh • Nháy đúp để xóa</div>' +
        '</div>';
    },

    renderHslEditorHtml: function(st) {
      var curObj = StuUltraMax.getAlgoObject(st, false, 160001) || {};
      var arr = [];
      try { arr = curObj.value ? JSON.parse(curObj.value) : []; } catch (e) {}
      var activeDef = HSL_COLORS.find(function(c) { return c.key === StuUltraMax.activeHslColor; }) || HSL_COLORS[0];
      var found = arr.find(function(x) { return Number(x.color_type) === activeDef.code; }) || {
        color_type: activeDef.code, hue_value: 0, saturation_value: 0, brightness_value: 0
      };

      var pills = HSL_COLORS.map(function(c) {
        var ch = arr.find(function(x) { return Number(x.color_type) === c.code; });
        var hasVal = ch && (ch.hue_value || ch.saturation_value || ch.brightness_value);
        return '<button type="button" class="lk-hsl-dot' + (c.key === activeDef.key ? ' active' : '') + (hasVal ? ' dirty' : '') + '" data-hsl-color="' + c.key + '" style="background:' + c.hex + '" title="' + c.label + '"></button>';
      }).join('');

      return '<div class="lk-hsl-bar">' + pills + '</div>' +
        '<div class="lk-hsl-lbl">Màu: <b>' + activeDef.label + '</b></div>' +
        StuUltraMax.renderSliderHtml({ key: 'hsl_hue', label: 'Sắc độ (Hue)', algoId: 160001, ename: 'hsl_hue_value', min: -100, max: 100, val: found.hue_value || 0 }) +
        StuUltraMax.renderSliderHtml({ key: 'hsl_sat', label: 'Độ bão hòa (Saturation)', algoId: 160001, ename: 'hsl_saturation_value', min: -100, max: 100, val: found.saturation_value || 0 }) +
        StuUltraMax.renderSliderHtml({ key: 'hsl_lum', label: 'Độ sáng (Luminance)', algoId: 160001, ename: 'hsl_brightness_value', min: -100, max: 100, val: found.brightness_value || 0 });
    },

    renderFilterBankHtml: function(grp, st) {
      var filterRoot = grp.sub && grp.sub[0];
      var cats = (filterRoot && filterRoot.sub) || [];
      if (!cats.length) return '';
      var activeCat = cats[StuUltraMax.activeFilterGroupIdx] || cats[0];
      var activeFilter = (st.colorParams || []).find(function(p) { return /^11\d{4}$/.test(String(p.id)); });
      var activeId = activeFilter ? Number(activeFilter.id) : -1;
      var strength = activeFilter ? unscaleScope(activeFilter.algorithm.value, 0.01) : 80;

      var catBar = '<div class="lk-filter-cats">' + cats.map(function(c, i) {
        return '<button type="button" class="lk-pill sm' + (i === StuUltraMax.activeFilterGroupIdx ? ' active' : '') + '" data-filter-cat="' + i + '">' + escapeHtml(c.name) + '</button>';
      }).join('') + '</div>';

      var items = (activeCat.group || []).map(function(it) {
        var aid = Number(it.algorithmid || -1);
        var sel = aid === activeId || (aid === -1 && activeId === -1);
        var gradHue = Math.abs((aid * 37) % 360);
        return '<button type="button" class="lk-filter-item' + (sel ? ' active' : '') + '" data-filter-id="' + aid + '">' +
          '<span class="lk-filter-thumb" style="' + (aid === -1 ? 'background:#2b2e35' : 'background:linear-gradient(135deg,hsl(' + gradHue + ',55%,45%),hsl(' + ((gradHue + 45) % 360) + ',65%,28%))') + '">' +
            (aid === -1 ? 'Gốc' : escapeHtml((it.ename || '').slice(0, 4).toUpperCase())) +
          '</span>' +
          '<span class="lk-filter-name">' + escapeHtml(it.name) + '</span>' +
        '</button>';
      }).join('');

      return catBar +
        '<div class="lk-filter-grid">' + items + '</div>' +
        (activeId > 0 ? StuUltraMax.renderSliderHtml({ key: 'filter_str_' + activeId, label: 'Cường độ bộ lọc', algoId: activeId, ename: 'value', scope: 0.01, min: 0, max: 100, def: 80, val: strength }) : '');
    },

    // ---- MODULE 2: CHÂN DUNG ----
    renderPortraitModuleHtml: function(st) {
      var catBeauty = (StuUltraMax.catalog && StuUltraMax.catalog.panelJson && StuUltraMax.catalog.panelJson[1]) || null;
      var html = '<div class="lk-mod-header">' +
        '<div class="lk-mod-title"><span class="ico">☺</span><span>Chân dung</span></div>' +
        '<button type="button" class="lk-blue-pill" id="stu-max-auto-portrait" title="Áp dụng làm đẹp chuẩn chân dung">Đặt Chân Dung</button>' +
        '<button type="button" class="lk-ico-btn' + (StuUltraMax.activePortraitCohort === 'single' ? ' active' : '') + '" data-cohort="single" title="Chọn từng khuôn mặt (Đơn)">👤</button>' +
        '<button type="button" class="lk-reset-mini" data-reset-mod="beauty">Đặt lại</button>' +
      '</div>';

      // Demographic chips
      html += '<div class="lk-cohort-grid">';
      COHORT_DEFS.forEach(function(c) {
        var active = StuUltraMax.activePortraitCohort === c.key;
        var has = st.beautyCohorts.some(function(b) { return b.age === c.age && b.sex === c.sex && b.params && b.params.length; });
        html += '<button type="button" class="lk-cohort-chip' + (active ? ' active' : '') + '" data-cohort="' + c.key + '">' + escapeHtml(c.label) + (has ? ' •' : '') + '</button>';
      });
      html += '<button type="button" class="lk-cohort-chip' + (StuUltraMax.activePortraitCohort === 'single' ? ' active' : '') + '" data-cohort="single">Đơn</button>';
      html += '<button type="button" class="lk-cohort-chip' + (StuUltraMax.activePortraitCohort === 'all' ? ' active' : '') + '" data-cohort="all">Tất cả</button>';
      html += '</div>';

      var activeLbl = StuUltraMax.activePortraitCohort === 'all' ? 'Tất cả'
        : StuUltraMax.activePortraitCohort === 'single'
          ? ('Đơn' + (StuUltraMax.selectedFaceClassId != null ? ' (Mặt ID ' + StuUltraMax.selectedFaceClassId + ')' : ' (Chưa chọn mặt)'))
          : ((COHORT_DEFS.find(function(c) { return c.key === StuUltraMax.activePortraitCohort; }) || {}).label || 'Nữ');
      html += '<div class="lk-editing-sub">Đang chỉnh: <span>' + escapeHtml(activeLbl) + '</span></div>';

      // Detected faces selector when Đơn is active
      if (StuUltraMax.activePortraitCohort === 'single') {
        var faces = st.detectFaces || [];
        html += '<div class="lk-face-list">' + (faces.length ? faces.map(function(f, idx) {
          var sel = f.classid === StuUltraMax.selectedFaceClassId;
          var sexStr = f.sex === 1 ? 'Nam' : 'Nữ';
          return '<button type="button" class="lk-face-chip' + (sel ? ' active' : '') + '" data-face-cid="' + escapeHtml(f.classid) + '">Mặt #' + (idx + 1) + ' (' + sexStr + ')</button>';
        }).join('') : '<span class="lk-muted">Chưa nhận diện thấy khuôn mặt trong ảnh</span>') + '</div>';
      }

      if (!catBeauty || !catBeauty.sub) return html + '<div class="lk-loading">Đang nạp catalog Chân dung...</div>';

      catBeauty.sub.forEach(function(grp) {
        var gid = String(grp.classifyid || grp.name);
        var isOpen = !!StuUltraMax.openGroups[gid];
        var ids = StuUltraMax.collectAlgoIds(grp);
        var dirty = ids.some(function(id) { return !!StuUltraMax.getAlgoObject(st, true, id); });

        html += '<div class="lk-acc' + (isOpen ? ' open' : '') + '" data-acc-id="' + escapeHtml(gid) + '">' +
          '<div class="lk-acc-hdr" data-toggle-acc="' + escapeHtml(gid) + '">' +
            '<span class="lk-acc-name">' + escapeHtml(grp.name) + (dirty ? ' <i class="acc-dot">•</i>' : '') + '</span>' +
            '<span class="lk-acc-actions">' +
              '<button type="button" class="lk-acc-undo" data-reset-beauty-ids="' + ids.join(',') + '" title="Đặt lại mục này">↶</button>' +
              '<span class="lk-acc-chev">' + (isOpen ? '⌃' : '⌄') + '</span>' +
            '</span>' +
          '</div>' +
          '<div class="lk-acc-body">';
        if (isOpen) {
          html += StuUltraMax.renderCatalogGroupChildren(grp, st, true);
        }
        html += '</div></div>';
      });
      return html;
    },

    // ---- GENERIC CATALOG TREE RENDERER (HANDLES ALL NODE TYPES VERIFIED) ----
    collectAlgoIds: function(node) {
      var set = {};
      function walk(n) {
        if (!n) return;
        if (n.algorithmid && Number(n.algorithmid) > 0) set[Number(n.algorithmid)] = true;
        if (Array.isArray(n.sub)) n.sub.forEach(walk);
        if (Array.isArray(n.group)) n.group.forEach(walk);
      }
      walk(node);
      return Object.keys(set).map(Number);
    },

    renderCatalogGroupChildren: function(grp, st, isBeauty) {
      var out = '';
      (grp.sub || []).forEach(function(child) {
        if (child.moduleType === 'creative-generation') {
          return; // Cloud-only creative generation skipped (offline DLL)
        }
        if (child.moduleType === 'groupPreset') {
          out += StuUltraMax.renderReshapeSubTabs(child, st);
          return;
        }
        if (child.moduleType === 'tabGroup') {
          out += StuUltraMax.renderRowTabGroup(child, st, isBeauty);
          return;
        }
        if (child.moduleType === 'rowGroup') {
          out += StuUltraMax.renderRowSwatchGroup(child, st, isBeauty);
          return;
        }
        if (child.moduleType === 'multiParam') {
          out += StuUltraMax.renderMultiParamNode(child, st, isBeauty);
          return;
        }
        if (child.moduleType === 'linkage') {
          out += StuUltraMax.renderLinkageNode(child, st, isBeauty);
          return;
        }
        if (child.moduleType === 'sliderGroup' && child.param && child.param.length > 1) {
          out += '<div class="lk-sub-block"><div class="lk-sub-title">' + escapeHtml(child.name) + '</div>';
          var obj = StuUltraMax.getAlgoObject(st, isBeauty, child.algorithmid) || {};
          child.param.forEach(function(p) {
            if (p.type === 'switch') {
              out += StuUltraMax.renderSwitchHtml({ label: p.name || child.name, algoId: child.algorithmid, ename: p.ename, max: p.max || 1, isBeauty: isBeauty, checked: Number(obj[p.ename]) > 0 });
            } else {
              var curV = obj[p.ename] != null ? unscaleScope(obj[p.ename], p.scope) : p.default;
              out += StuUltraMax.renderSliderHtml({ key: 'sg_' + child.algorithmid + '_' + p.ename, label: p.name || child.name, algoId: child.algorithmid, ename: p.ename, scope: p.scope, min: p.min, max: p.max, def: p.default, val: curV, isBeauty: isBeauty });
            }
          });
          out += '</div>';
          return;
        }
        if (child.moduleType === 'switch' || (child.param && child.param[0] && child.param[0].type === 'switch')) {
          var p0 = child.param[0];
          var objS = StuUltraMax.getAlgoObject(st, isBeauty, child.algorithmid) || {};
          out += StuUltraMax.renderSwitchHtml({
            label: child.name, algoId: child.algorithmid, ename: p0.ename, max: p0.max || 100, isBeauty: isBeauty, checked: Number(objS[p0.ename]) > 0
          });
          return;
        }
        if (child.param && child.param.length) {
          var p = child.param[0];
          var objA = StuUltraMax.getAlgoObject(st, isBeauty, child.algorithmid) || {};
          var valA = objA[p.ename] != null ? unscaleScope(objA[p.ename], p.scope) : p.default;
          var grad = child.algorithmid === 130002 ? 'temp' : (child.algorithmid === 130003 ? 'tint' : '');
          out += StuUltraMax.renderSliderHtml({
            key: (isBeauty ? 'b_' : 'c_') + child.algorithmid + '_' + p.ename,
            label: child.name, algoId: child.algorithmid, ename: p.ename, scope: p.scope,
            min: p.min, max: p.max, step: p.min === -5 ? 0.05 : 1, def: p.default, val: valA, isBeauty: isBeauty, grad: grad
          });
          return;
        }
        if (child.sub && child.sub.length) {
          out += '<div class="lk-sub-block"><div class="lk-sub-blue-title">' + escapeHtml(child.name) + '</div>' +
            StuUltraMax.renderCatalogGroupChildren(child, st, isBeauty) + '</div>';
        }
      });
      return out;
    },

    renderReshapeSubTabs: function(node, st) {
      var tabs = node.sub || [];
      if (!tabs.length) return '';
      var idx = Math.min(tabs.length - 1, StuUltraMax._reshapeTabIdx || 0);
      var bar = '<div class="lk-sub-pills reshape">' + tabs.map(function(t, i) {
        return '<button type="button" class="lk-pill sm' + (i === idx ? ' active' : '') + '" data-reshape-tab="' + i + '">' + escapeHtml(t.name) + '</button>';
      }).join('') + '</div>';
      return bar + StuUltraMax.renderCatalogGroupChildren(tabs[idx], st, true);
    },

    renderMultiParamNode: function(node, st, isBeauty) {
      var subs = node.sub || [];
      if (!subs.length) return '';
      var first = subs[0];
      var aid = first.algorithmid;
      var expKey = 'mp_' + aid + '_' + node.name;
      var expanded = !!StuUltraMax.expandedNodes[expKey];
      var obj = StuUltraMax.getAlgoObject(st, isBeauty, aid) || {};
      var fp = first.param && first.param[0];
      var mainVal = fp ? (obj[fp.ename] != null ? unscaleScope(obj[fp.ename], fp.scope) : fp.default) : 0;

      var html = '<div class="lk-expand-wrap">' +
        '<div class="lk-expand-top">' +
          '<div class="lk-expand-main">' +
            StuUltraMax.renderSliderHtml({ key: expKey + '_main', label: node.name, algoId: aid, ename: fp ? fp.ename : 'value', scope: fp ? fp.scope : 1, min: fp ? fp.min : 0, max: fp ? fp.max : 100, def: fp ? fp.default : 0, val: mainVal, isBeauty: isBeauty }) +
          '</div>' +
          '<button type="button" class="lk-expand-btn" data-expand-key="' + escapeHtml(expKey) + '" title="Mở rộng tùy chỉnh con">' + (expanded ? '▴' : '▾') + '</button>' +
        '</div>';
      if (expanded) {
        html += '<div class="lk-expand-sub">';
        subs.slice(1).forEach(function(s) {
          var sp = s.param && s.param[0];
          if (!sp) return;
          var sv = obj[sp.ename] != null ? unscaleScope(obj[sp.ename], sp.scope) : sp.default;
          html += StuUltraMax.renderSliderHtml({ key: expKey + '_' + sp.ename, label: s.name, algoId: aid, ename: sp.ename, scope: sp.scope, min: sp.min, max: sp.max, def: sp.default, val: sv, isBeauty: isBeauty });
        });
        html += '</div>';
      }
      return html + '</div>';
    },

    renderLinkageNode: function(node, st, isBeauty) {
      var subs = node.sub || [];
      if (subs.length < 2) return '';
      var left = subs[0], right = subs[1];
      var lp = left.param && left.param[0];
      var rp = right.param && right.param[0];
      var lObj = StuUltraMax.getAlgoObject(st, isBeauty, left.algorithmid) || {};
      var rObj = StuUltraMax.getAlgoObject(st, isBeauty, right.algorithmid) || {};
      var lv = lp ? (lObj[lp.ename] != null ? unscaleScope(lObj[lp.ename], lp.scope) : lp.default) : 0;
      var rv = rp ? (rObj[rp.ename] != null ? unscaleScope(rObj[rp.ename], rp.scope) : rp.default) : 0;
      var expKey = 'lk_' + left.algorithmid + '_' + right.algorithmid;
      var expanded = !!StuUltraMax.expandedNodes[expKey];

      var html = '<div class="lk-expand-wrap">' +
        '<div class="lk-expand-top">' +
          '<div class="lk-expand-main">' +
            StuUltraMax.renderSliderHtml({
              key: expKey + '_both', label: node.name, algoId: left.algorithmid, ename: 'value', scope: lp ? lp.scope : 1,
              min: lp ? lp.min : -100, max: lp ? lp.max : 100, def: 0, val: Math.round((lv + rv) / 2),
              isBeauty: isBeauty, linkLeft: left.algorithmid, linkRight: right.algorithmid
            }) +
          '</div>' +
          '<button type="button" class="lk-expand-btn" data-expand-key="' + escapeHtml(expKey) + '" title="Chỉnh riêng Trái / Phải">' + (expanded ? '▴' : '▾') + '</button>' +
        '</div>';
      if (expanded) {
        html += '<div class="lk-expand-sub">' +
          StuUltraMax.renderSliderHtml({ key: expKey + '_L', label: left.name, algoId: left.algorithmid, ename: lp.ename, scope: lp.scope, min: lp.min, max: lp.max, def: lp.default, val: lv, isBeauty: isBeauty }) +
          StuUltraMax.renderSliderHtml({ key: expKey + '_R', label: right.name, algoId: right.algorithmid, ename: rp.ename, scope: rp.scope, min: rp.min, max: rp.max, def: rp.default, val: rv, isBeauty: isBeauty }) +
        '</div>';
      }
      return html + '</div>';
    },

    renderRowTabGroup: function(node, st, isBeauty) {
      var tabs = node.sub || [];
      if (!tabs.length) return '';
      var isEyeLight = node.name.indexOf('mắt') !== -1;
      var idx = Math.min(tabs.length - 1, isEyeLight ? StuUltraMax.eyeLightTabIdx : StuUltraMax.makeupTabIdx);
      var stateKey = isEyeLight ? 'eyeLightTabIdx' : 'makeupTabIdx';
      var bar = '<div class="lk-sub-title" style="margin-top:6px">' + escapeHtml(node.name) + '</div>' +
        '<div class="lk-sub-pills wrap">' + tabs.map(function(t, i) {
          return '<button type="button" class="lk-pill sm' + (i === idx ? ' active' : '') + '" data-rowtab-state="' + stateKey + '" data-rowtab-idx="' + i + '">' + escapeHtml(t.name) + '</button>';
        }).join('') + '</div>';
      return bar + StuUltraMax.renderRowSwatchGroup(tabs[idx], st, isBeauty);
    },

    renderRowSwatchGroup: function(node, st, isBeauty) {
      var aid = Number(node.algorithmid);
      var curObj = StuUltraMax.getAlgoObject(st, isBeauty, aid) || {};
      var activeScene = curObj.scene != null ? String(curObj.scene) : '';
      var items = node.group || [];
      var defItem = items[1] || items[0];
      var p = defItem && defItem.param && defItem.param[0];
      var curVal = p ? (curObj.value != null ? unscaleScope(curObj.value, p.scope) : p.default) : 80;

      var html = '<div class="lk-swatch-row">';
      items.forEach(function(it, idx) {
        var isNone = idx === 0 || (it.ename && it.ename.indexOf('_none') !== -1);
        var sceneStr = isNone ? '' : String(it.scene != null ? it.scene : '');
        var sel = isNone ? (!activeScene && curObj.value == null) : (activeScene === sceneStr && curObj.value != null);

        // Visual fill: lip RGBA or path thumbnail via local asset proxy or clean color pill
        var thumbHtml;
        if (isNone) {
          thumbHtml = '<span class="lk-sw-none">⊘</span>';
        } else if (aid === 280003 && /^\d/.test(sceneStr)) {
          var rgba = sceneStr.split(',').slice(0, 3).map(Number);
          thumbHtml = '<span class="lk-sw-color" style="background:rgb(' + rgba.join(',') + ')"></span>';
        } else if (sceneStr && (sceneStr.indexOf('/') !== -1 || sceneStr.indexOf('.png') !== -1)) {
          thumbHtml = '<img class="lk-sw-img" src="' + assetUrl({ scene: sceneStr }) + '" onerror="this.style.display=\'none\'" alt="" />';
        } else {
          var hue = Math.abs(((aid + idx * 17) * 43) % 360);
          thumbHtml = '<span class="lk-sw-color" style="background:linear-gradient(135deg,hsl(' + hue + ',55%,62%),hsl(' + ((hue + 30) % 360) + ',50%,38%))"></span>';
        }

        var ip = it.param && it.param[0];
        html += '<button type="button" class="lk-sw-card' + (sel ? ' active' : '') + '" data-rg-algo="' + aid + '"' +
          ' data-rg-scene="' + escapeHtml(sceneStr) + '" data-rg-none="' + (isNone ? '1' : '0') + '"' +
          ' data-rg-def="' + (ip ? ip.default : 60) + '" data-rg-scope="' + (ip ? ip.scope : 1) + '" data-rg-beauty="' + (isBeauty ? '1' : '0') + '">' +
          thumbHtml + '<span class="lk-sw-lbl">' + escapeHtml(it.name || 'Không') + '</span></button>';
      });
      html += '</div>';

      if (activeScene || curObj.value != null) {
        if (p) {
          html += StuUltraMax.renderSliderHtml({
            key: 'rg_' + aid, label: 'Mức độ ' + (node.name || ''), algoId: aid, ename: 'value', scope: p.scope || 1,
            min: p.min || 0, max: p.max || 100, def: p.default || 60, val: curVal, isBeauty: isBeauty
          });
          if (p.sub && p.sub.length) {
            var opt = curObj.option_value != null ? Number(curObj.option_value) : 0;
            html += '<div class="lk-sub-pills" style="margin-top:4px">' + p.sub.map(function(s, i) {
              return '<button type="button" class="lk-pill sm' + (opt === i ? ' active' : '') + '" data-rg-opt-algo="' + aid + '" data-rg-opt="' + i + '">' + escapeHtml(s.name) + '</button>';
            }).join('') + '</div>';
          }
        }
      }
      return html;
    },

    // ---- MODULE 3: NỀN ----
    renderBackgroundModuleHtml: function(st) {
      var bgData = StuUltraMax.bgInfo || {};
      var catBg = (StuUltraMax.catalog && StuUltraMax.catalog.panelJson && StuUltraMax.catalog.panelJson[2]) || null;
      var html = '<div class="lk-mod-header">' +
        '<div class="lk-mod-title"><span class="ico">▣</span><span>Nền</span></div>' +
        '<button type="button" class="lk-reset-mini" data-reset-mod="background">Đặt lại</button>' +
      '</div>';

      // 1) Làm đẹp hậu cảnh (610001..610005)
      var bgBDirty = [610001, 610002, 610003, 610004, 610005].some(function(id) { return !!StuUltraMax.getAlgoObject(st, false, id); });
      var activeDefectObj = StuUltraMax.getAlgoObject(st, false, 610003) || StuUltraMax.getAlgoObject(st, false, 610002) || StuUltraMax.getAlgoObject(st, false, 610001);
      var defectOn = !!activeDefectObj;
      var defectMode = StuUltraMax.getAlgoObject(st, false, 610002) ? 610002 : (StuUltraMax.getAlgoObject(st, false, 610001) ? 610001 : 610003);
      var defectObj = activeDefectObj || { value: 100, background: 100, ground: 100 };
      var boofOn = !!StuUltraMax.getAlgoObject(st, false, 610004);
      var evenObj = StuUltraMax.getAlgoObject(st, false, 610005);
      var evenOn = !!evenObj;

      html += '<div class="lk-acc' + (StuUltraMax.openGroups['61'] ? ' open' : '') + '">' +
        '<div class="lk-acc-hdr" data-toggle-acc="61">' +
          '<span class="lk-acc-name">Làm đẹp hậu cảnh' + (bgBDirty ? ' <i class="acc-dot">•</i>' : '') + '</span>' +
          '<span class="lk-acc-actions"><button type="button" class="lk-acc-undo" data-reset-ids="610001,610002,610003,610004,610005">↶</button><span class="lk-acc-chev">' + (StuUltraMax.openGroups['61'] ? '⌃' : '⌄') + '</span></span>' +
        '</div>' +
        '<div class="lk-acc-body">' +
          (StuUltraMax.openGroups['61'] ? (
            '<div class="lk-switch-row"><span class="lk-s-lbl">Xóa khuyết điểm phông nền</span><label class="lk-switch"><input type="checkbox" id="stu-max-bg-defect-sw" ' + (defectOn ? 'checked' : '') + '/><span class="lk-switch-track"></span></label></div>' +
            (defectOn ? (
              '<div class="lk-expand-sub">' +
                '<div class="lk-sub-pills wrap" style="margin-bottom:6px">' +
                  '<button type="button" class="lk-pill sm' + (defectMode === 610003 ? ' active' : '') + '" data-defect-mode="610003">Đề xuất AI</button>' +
                  '<button type="button" class="lk-pill sm' + (defectMode === 610002 ? ' active' : '') + '" data-defect-mode="610002">Đơn sắc</button>' +
                  '<button type="button" class="lk-pill sm' + (defectMode === 610001 ? ' active' : '') + '" data-defect-mode="610001">Không đơn sắc</button>' +
                '</div>' +
                StuUltraMax.renderSliderHtml({ key: 'bg_def_val', label: 'Mức độ xóa khuyết điểm', algoId: defectMode, ename: 'value', min: 0, max: 100, def: 100, val: defectObj.value != null ? defectObj.value : 100 }) +
                StuUltraMax.renderSliderHtml({ key: 'bg_def_bg', label: 'Nền', algoId: defectMode, ename: 'background', min: 0, max: 100, def: 100, val: defectObj.background != null ? defectObj.background : 100 }) +
                StuUltraMax.renderSliderHtml({ key: 'bg_def_gnd', label: 'Mặt đất', algoId: defectMode, ename: 'ground', min: 0, max: 100, def: 100, val: defectObj.ground != null ? defectObj.ground : 100 }) +
              '</div>'
            ) : '') +
            '<div class="lk-switch-row"><span class="lk-s-lbl">Xóa chi tiết thừa phông nền</span><label class="lk-switch"><input type="checkbox" data-lk-switch="1" data-algo="610004" data-ename="value" data-max="100" ' + (boofOn ? 'checked' : '') + '/><span class="lk-switch-track"></span></label></div>' +
            '<div class="lk-switch-row"><span class="lk-s-lbl">Làm đều sáng phông nền</span><label class="lk-switch"><input type="checkbox" id="stu-max-bg-even-sw" ' + (evenOn ? 'checked' : '') + '/><span class="lk-switch-track"></span></label></div>' +
            (evenOn ? StuUltraMax.renderSliderHtml({ key: 'bg_even_val', label: 'Mức độ làm đều sáng', algoId: 610005, ename: 'value', min: 0, max: 100, def: 100, val: evenObj.value != null ? evenObj.value : 100 }) : '')
          ) : '') +
        '</div>' +
      '</div>';

      // 2) Thay nền ảnh thẻ (620001 / 620002)
      var bgObj = StuUltraMax.getAlgoObject(st, false, 620001) || StuUltraMax.getAlgoObject(st, false, 620002);
      var bgSysList = (bgData.change_background && bgData.change_background[0] && bgData.change_background[0].group) || [];
      html += '<div class="lk-acc' + (StuUltraMax.openGroups['62'] ? ' open' : '') + '">' +
        '<div class="lk-acc-hdr" data-toggle-acc="62">' +
          '<span class="lk-acc-name">Thay nền ảnh thẻ' + (bgObj ? ' <i class="acc-dot">•</i>' : '') + '</span>' +
          '<span class="lk-acc-actions"><button type="button" class="lk-acc-undo" data-reset-ids="620001,620002">↶</button><span class="lk-acc-chev">' + (StuUltraMax.openGroups['62'] ? '⌃' : '⌄') + '</span></span>' +
        '</div>' +
        '<div class="lk-acc-body">';
      if (StuUltraMax.openGroups['62']) {
        html += '<div class="lk-seg-top sm">' +
          '<button type="button" class="lk-seg-btn' + (st.bgMode === 'sys' ? ' active' : '') + '" data-bg-mode="sys">Gợi ý' + (bgObj && StuUltraMax.getAlgoObject(st, false, 620001) ? ' •' : '') + '</button>' +
          '<button type="button" class="lk-seg-btn' + (st.bgMode === 'cus' ? ' active' : '') + '" data-bg-mode="cus">Tùy chỉnh</button>' +
        '</div>';

        if (st.bgMode === 'sys') {
          html += '<div class="lk-bg-grid">';
          bgSysList.forEach(function(item, idx) {
            var isNone = idx === 0 || Number(item.algorithmid) === -1;
            var sel = isNone ? !bgObj : (bgObj && bgObj.scene === item.scene);
            var isTransparent = item.ename === 'touming';
            var thumb = isNone
              ? '<div class="lk-bg-thumb none">⊘</div>'
              : isTransparent
                ? '<div class="lk-bg-thumb checker"></div>'
                : '<img class="lk-bg-thumb" src="' + assetUrl(item) + '" alt="' + escapeHtml(item.name) + '"/>';
            html += '<button type="button" class="lk-bg-tile' + (sel ? ' active' : '') + '" data-bg-idx="' + idx + '">' +
              thumb + '<span class="lk-bg-name">' + escapeHtml(item.name || 'Không') + '</span></button>';
          });
          html += '</div>';
        } else {
          html += '<div class="lk-cus-box">' +
            '<label class="lk-upload-btn full"><span>+ Tải ảnh nền tùy chỉnh</span><input type="file" id="stu-max-bg-custom-file" accept="image/*" hidden/></label>' +
            (st.bgCustomScenes.length ? '<div class="lk-bg-grid">' + st.bgCustomScenes.map(function(c, i) {
              var sel = bgObj && bgObj.scene === c.scene;
              return '<button type="button" class="lk-bg-tile' + (sel ? ' active' : '') + '" data-bg-cus-idx="' + i + '">' +
                '<img class="lk-bg-thumb" src="' + c.thumb + '"/><span class="lk-bg-name">' + escapeHtml(c.name) + '</span></button>';
            }).join('') + '</div>' : '<div class="lk-muted" style="margin-top:6px">Hỗ trợ PNG/JPG làm nền ảnh thẻ hoặc phông ghép.</div>') +
          '</div>';
        }

        html += '<div class="lk-field-row"><span>Vùng tách nền</span>' +
          '<select id="stu-max-bg-mask-scope" class="lk-select">' +
            '<option value="1"' + (Number(st.bgMaskScope) === 1 ? ' selected' : '') + '>Chỉ chủ thể</option>' +
            '<option value="2"' + (Number(st.bgMaskScope) === 2 ? ' selected' : '') + '>Chủ thể &amp; vật phẩm liên quan</option>' +
          '</select></div>' +
          StuUltraMax.renderSliderHtml({ key: 'bg_edge', label: 'Chỉnh viền nhân vật', algoId: 620001, ename: 'bg_edge', min: 0, max: 100, def: 0, val: st.bgEdge }) +
          StuUltraMax.renderSliderHtml({ key: 'bg_opacity', label: 'Độ trong suốt', algoId: 620001, ename: 'bg_opacity', min: 0, max: 100, def: 100, val: st.bgOpacity });
      }
      html += '</div></div>';

      // 3) Thay nền trời (630001 / 630002)
      var skyObj = StuUltraMax.getAlgoObject(st, false, 630001) || StuUltraMax.getAlgoObject(st, false, 630002);
      var skyParsed = skyObj ? parseSkyValue(skyObj) : null;
      var skyDetected = st.detectSky && Number(st.detectSky.sky_info_status) === 1;
      var skySysList = (bgData.change_sky && bgData.change_sky[0] && bgData.change_sky[0].group) || [];
      html += '<div class="lk-acc' + (StuUltraMax.openGroups['64'] ? ' open' : '') + '">' +
        '<div class="lk-acc-hdr" data-toggle-acc="64">' +
          '<span class="lk-acc-name">Thay nền trời' + (skyObj ? ' <i class="acc-dot">•</i>' : '') + '</span>' +
          '<span class="lk-acc-actions"><button type="button" class="lk-acc-undo" data-reset-ids="630001,630002">↶</button><span class="lk-acc-chev">' + (StuUltraMax.openGroups['64'] ? '⌃' : '⌄') + '</span></span>' +
        '</div>' +
        '<div class="lk-acc-body">';
      if (StuUltraMax.openGroups['64']) {
        if (st.fid && !skyDetected) {
          html += '<div class="lk-warn-banner"><span class="warn-ico">!</span><span>Không nhận dạng được bầu trời, điều chỉnh thông số sẽ không có hiệu lực</span></div>';
        }
        html += '<div class="lk-seg-top sm">' +
          '<button type="button" class="lk-seg-btn' + (st.skyMode === 'sys' ? ' active' : '') + '" data-sky-mode="sys">Gợi ý</button>' +
          '<button type="button" class="lk-seg-btn' + (st.skyMode === 'cus' ? ' active' : '') + '" data-sky-mode="cus">Tùy chỉnh</button>' +
        '</div>';

        if (st.skyMode === 'sys') {
          html += '<div class="lk-sub-pills" style="margin:6px 0">' +
            SKY_CATS.map(function(c) {
              return '<button type="button" class="lk-pill sm' + (st.skyCat === c.key ? ' active' : '') + '" data-sky-cat="' + c.key + '">' + c.label + '</button>';
            }).join('') +
            '<button type="button" class="lk-pill sm' + (!skyObj ? ' active' : '') + '" data-sky-none="1">Gốc</button>' +
          '</div>' +
          '<div class="lk-sky-thumbs">';
          skySysList.forEach(function(item, idx) {
            if (idx === 0 || Number(item.algorithmid) === -1) return;
            if (String(item.scene || '').indexOf(st.skyCat) === -1) return;
            var sel = skyParsed && skyParsed.scene === item.scene;
            html += '<button type="button" class="lk-sky-tile' + (sel ? ' active' : '') + '" data-sky-idx="' + idx + '">' +
              '<img src="' + assetUrl(item) + '" alt="' + escapeHtml(item.name) + '"/>' +
              '<span>' + escapeHtml(item.name) + '</span></button>';
          });
          html += '</div>';
        } else {
          html += '<div class="lk-cus-box">' +
            '<label class="lk-upload-btn full"><span>+ Tải ảnh bầu trời tùy chỉnh</span><input type="file" id="stu-max-sky-custom-file" accept="image/*" hidden/></label>' +
            (st.skyCustomScenes.length ? '<div class="lk-sky-thumbs">' + st.skyCustomScenes.map(function(c, i) {
              var sel = skyParsed && skyParsed.scene === c.scene;
              return '<button type="button" class="lk-sky-tile' + (sel ? ' active' : '') + '" data-sky-cus-idx="' + i + '"><img src="' + c.thumb + '"/><span>' + escapeHtml(c.name) + '</span></button>';
            }).join('') + '</div>' : '') +
          '</div>';
        }

        html += '<div class="lk-sky-sliders' + (st.fid && !skyDetected ? ' disabled' : '') + '">';
        SKY_SLIDERS.forEach(function(sl) {
          var v = (skyParsed && skyParsed.value[sl.ename] != null) ? skyParsed.value[sl.ename] : sl.def;
          html += StuUltraMax.renderSliderHtml({ key: 'sky_' + sl.ename, label: sl.label, algoId: 630001, ename: 'skyparam_' + sl.ename, min: sl.min, max: sl.max, def: sl.def, val: v });
        });
        html += '</div>';
      }
      return html + '</div></div>';
    },

    // ---- MODULE 4: QUẦN ÁO ----
    renderClothingModuleHtml: function(st) {
      var catCloth = (StuUltraMax.catalog && StuUltraMax.catalog.panelJson && StuUltraMax.catalog.panelJson[3]) || null;
      var items = (catCloth && catCloth.sub && catCloth.sub[0] && catCloth.sub[0].sub && catCloth.sub[0].sub[0] && catCloth.sub[0].sub[0].sub) || [
        { algorithmid: 710001, name: 'Xóa nếp nhăn quần áo' },
        { algorithmid: 710003, name: 'Xóa khuyết điểm quần áo' },
        { algorithmid: 710002, name: 'Làm phẳng viền quần áo' }
      ];
      var html = '<div class="lk-mod-header">' +
        '<div class="lk-mod-title"><span class="ico">👕</span><span>Quần áo</span></div>' +
        '<button type="button" class="lk-reset-mini" data-reset-mod="clothing">Đặt lại</button>' +
      '</div>';

      html += '<div class="lk-acc open"><div class="lk-acc-hdr"><span>Làm đẹp quần áo</span></div><div class="lk-acc-body">' +
        '<div class="lk-cohort-grid">';
      CLOTH_TABS.forEach(function(t) {
        html += '<button type="button" class="lk-cohort-chip' + (st.clothCohortIdx === t.index ? ' active' : '') + '" data-cloth-tab="' + t.index + '">' + escapeHtml(t.label) + '</button>';
      });
      html += '</div>';

      items.forEach(function(it) {
        var aid = Number(it.algorithmid);
        var arr = st.clothValues[aid] || [0, 0, 0, 0, 0];
        var v = st.clothCohortIdx === 0 ? arr[0] : (arr[st.clothCohortIdx - 1] || 0);
        html += StuUltraMax.renderSliderHtml({ key: 'cloth_' + aid, label: it.name, algoId: aid, ename: 'cloth_' + aid, min: 0, max: 100, def: 0, val: v });
      });
      return html + '</div></div>';
    },

    // ---- MODULE 5: KẾT NỐI MÁY ẢNH ----
    renderCameraModuleHtml: function() {
      return '<div class="lk-mod-header">' +
        '<div class="lk-mod-title"><span class="ico">📷</span><span>Kết nối máy ảnh</span></div>' +
      '</div>' +
      '<div class="lk-acc open"><div class="lk-acc-hdr"><span>Chụp kết nối trực tiếp (Tethered Shooting)</span></div><div class="lk-acc-body">' +
        '<div class="lk-field-row"><span>Trạng thái</span><span class="lk-badge ' + (StuUltraMax.cameraConnected ? 'on' : '') + '">' + (StuUltraMax.cameraConnected ? 'Đã kết nối ✓' : 'Chưa kết nối') + '</span></div>' +
        '<div class="lk-btn-row">' +
          '<button type="button" class="lk-blue-btn" id="stu-max-cam-connect"' + (StuUltraMax.cameraConnected ? ' disabled' : '') + '>Kết nối máy ảnh</button>' +
          '<button type="button" class="lk-gray-btn" id="stu-max-cam-disconnect"' + (!StuUltraMax.cameraConnected ? ' disabled' : '') + '>Ngắt kết nối</button>' +
        '</div>' +
        '<div class="lk-field-row" style="margin-top:10px"><span>Tự retouch khi chụp</span>' +
          '<select id="stu-max-cam-auto-preset" class="lk-select"><option value="">Không tự động</option><option value="studio">Studio Chân Dung</option><option value="clean_natural">Tự nhiên</option><option value="wedding">Ảnh Cưới</option></select>' +
        '</div>' +
        '<div class="lk-sub-title" style="margin-top:12px">Nhật ký máy ảnh (Events 16000/16001/16002)</div>' +
        '<div class="lk-cam-log">' + (StuUltraMax.cameraEvents.length ? StuUltraMax.cameraEvents.slice(-8).map(function(ev) {
          return '<div class="lk-cam-ev">[' + ev.type + '] ' + escapeHtml(ev.msg) + '</div>';
        }).join('') : '<div class="lk-muted">Cắm cáp USB máy ảnh Canon/Nikon/Sony hoặc chụp để nhận ảnh tự động từ aipic.dll.</div>') + '</div>' +
      '</div></div>';
    },

    // ---- MODULE 6: NẮN BÓP THỦ CÔNG ----
    renderLiquifyModuleHtml: function() {
      return '<div class="lk-mod-header">' +
        '<div class="lk-mod-title"><span class="ico">✋</span><span>Công cụ nắn bóp</span></div>' +
        '<button type="button" class="lk-reset-mini" id="stu-max-liq-cancel">Đặt lại</button>' +
      '</div>' +
      '<div class="lk-acc open"><div class="lk-acc-hdr"><span>Tùy chọn cọ vẽ</span></div><div class="lk-acc-body">' +
        '<div class="lk-sub-pills" style="margin-bottom:10px">' +
          '<button type="button" class="lk-pill' + (StuUltraMax.liquifyTool === 'push' ? ' active' : '') + '" data-liq-tool="push">Cọ đẩy nắn bóp</button>' +
          '<button type="button" class="lk-pill' + (StuUltraMax.liquifyTool === 'pan' ? ' active' : '') + '" data-liq-tool="pan">Di chuyển ảnh</button>' +
        '</div>' +
        '<div class="lk-slider-row"><div class="lk-slider-head"><span class="lk-s-lbl">Kích thước</span><span class="lk-s-val" id="liq-val-size">' + StuUltraMax.liquifySize + '</span></div><input type="range" class="lk-range" id="liq-size" min="5" max="100" value="' + StuUltraMax.liquifySize + '" style="--p:' + StuUltraMax.liquifySize + '%;--o:0%"/></div>' +
        '<div class="lk-slider-row"><div class="lk-slider-head"><span class="lk-s-lbl">Áp lực</span><span class="lk-s-val" id="liq-val-pressure">' + StuUltraMax.liquifyPressure + '</span></div><input type="range" class="lk-range" id="liq-pressure" min="1" max="100" value="' + StuUltraMax.liquifyPressure + '" style="--p:' + StuUltraMax.liquifyPressure + '%;--o:0%"/></div>' +
        '<div class="lk-slider-row"><div class="lk-slider-head"><span class="lk-s-lbl">Mật độ</span><span class="lk-s-val" id="liq-val-density">' + StuUltraMax.liquifyDensity + '</span></div><input type="range" class="lk-range" id="liq-density" min="1" max="100" value="' + StuUltraMax.liquifyDensity + '" style="--p:' + StuUltraMax.liquifyDensity + '%;--o:0%"/></div>' +
        '<div class="lk-switch-row"><span class="lk-s-lbl">Cố định viền</span><label class="lk-switch"><input type="checkbox" id="liq-pin-edges" ' + (StuUltraMax.liquifyPinEdges ? 'checked' : '') + '/><span class="lk-switch-track"></span></label></div>' +
        '<div class="lk-btn-row" style="margin-top:12px">' +
          '<button type="button" class="lk-blue-btn" id="stu-max-liq-confirm">Xác nhận nắn bóp</button>' +
          '<button type="button" class="lk-gray-btn" id="stu-max-liq-undo">Hoàn tác nét</button>' +
        '</div>' +
      '</div></div>';
    },

    // =========================================================================
    // INSPECTOR EVENT BINDING
    // =========================================================================
    bindInspectorEvents: function(body, st) {
      // Top level reset
      var rMod = body.querySelector('[data-reset-mod]');
      if (rMod) rMod.addEventListener('click', function() {
        var what = rMod.getAttribute('data-reset-mod');
        StuUltraMax.resetModule(what, st);
      });

      // Accordions toggle & group reset
      body.querySelectorAll('[data-toggle-acc]').forEach(function(el) {
        el.addEventListener('click', function(e) {
          if (e.target.closest('button')) return;
          var gid = el.getAttribute('data-toggle-acc');
          StuUltraMax.openGroups[gid] = !StuUltraMax.openGroups[gid];
          StuUltraMax.renderModule();
        });
      });

      body.querySelectorAll('[data-reset-ids]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var ids = btn.getAttribute('data-reset-ids').split(',').map(Number);
          ids.forEach(function(id) { StuUltraMax.upsertColorParam(st, id, {}, { remove: true }); });
          StuUltraMax.renderModule();
          StuUltraMax.scheduleRetouch(false);
        });
      });

      body.querySelectorAll('[data-reset-beauty-ids]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var ids = btn.getAttribute('data-reset-beauty-ids').split(',').map(Number);
          ids.forEach(function(id) { StuUltraMax.upsertBeautyParam(st, id, {}, { remove: true }); });
          StuUltraMax.renderModule();
          StuUltraMax.scheduleRetouch(false);
        });
      });

      // Expand multiParam / linkage
      body.querySelectorAll('[data-expand-key]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var k = btn.getAttribute('data-expand-key');
          StuUltraMax.expandedNodes[k] = !StuUltraMax.expandedNodes[k];
          StuUltraMax.renderModule();
        });
      });

      // Color tabs / scope / mask
      body.querySelectorAll('[data-color-top]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          StuUltraMax.colorTopTab = btn.getAttribute('data-color-top');
          StuUltraMax.renderModule();
        });
      });
      body.querySelectorAll('[data-color-scope]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          StuUltraMax.colorScopeTab = btn.getAttribute('data-color-scope');
          StuUltraMax.renderModule();
        });
      });
      body.querySelectorAll('[data-mask-key]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          StuUltraMax.activeMaskKey = btn.getAttribute('data-mask-key');
          StuUltraMax.renderModule();
        });
      });

      // Reference image upload, sample gallery & scope
      var refIn = body.querySelector('#stu-max-ref-file');
      if (refIn) refIn.addEventListener('change', function() {
        var f = refIn.files && refIn.files[0];
        if (!f) return;
        var fr = new FileReader();
        fr.onload = function() {
          var rawUrl = fr.result;
          var cleanTitle = (f.name || 'Ảnh mẫu').replace(/\.[^.]+$/, '');
          makeRefThumbDataUrl(rawUrl).then(function(thumbUrl) {
            var customId = 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
            var customItem = {
              id: customId,
              name: 'Cá nhân · ' + cleanTitle,
              dataUrl: rawUrl,
              thumbUrl: thumbUrl,
              isCustom: true,
              createdAt: Date.now()
            };
            StuUltraMax.customColorRefs.unshift(customItem);
            saveCustomColorRef(customItem);
            StuUltraMax.applyColorReferenceData(st, rawUrl, customItem);
          });
        };
        fr.readAsDataURL(f);
      });
      var refClear = body.querySelector('#stu-max-ref-clear');
      if (refClear) refClear.addEventListener('click', function() {
        st.referThumbUrl = '';
        st.referPath = '';
        st.referName = '';
        st.referSampleId = '';
        StuUltraMax.upsertColorParam(st, 170001, {}, { remove: true, forceGlobal: true });
        StuUltraMax.renderModule();
        StuUltraMax.scheduleRetouch(false);
        toast('Đã bỏ Ảnh Mẫu AI');
      });
      body.querySelectorAll('[data-ref-del]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var delId = btn.getAttribute('data-ref-del');
          StuUltraMax.customColorRefs = StuUltraMax.customColorRefs.filter(function(x) { return x.id !== delId; });
          deleteCustomColorRef(delId);
          StuUltraMax.renderModule();
          toast('Đã xóa ảnh mẫu cá nhân');
        });
      });
      body.querySelectorAll('[data-ref-sample]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var sid = btn.getAttribute('data-ref-sample');
          StuUltraMax.selectColorSampleById(st, sid);
        });
      });
      body.querySelectorAll('[data-ref-scope]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          st.referScope = btn.getAttribute('data-ref-scope');
          StuUltraMax.renderModule();
        });
      });

      // HSL & Curve channels & Filters
      body.querySelectorAll('[data-hsl-color]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          StuUltraMax.activeHslColor = btn.getAttribute('data-hsl-color');
          StuUltraMax.renderModule();
        });
      });
      body.querySelectorAll('[data-curve-ch]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          StuUltraMax.activeCurveChannel = Number(btn.getAttribute('data-curve-ch'));
          StuUltraMax.renderModule();
        });
      });
      var curveReset = body.querySelector('[data-curve-reset]');
      if (curveReset) curveReset.addEventListener('click', function() {
        var obj = StuUltraMax.getAlgoObject(st, false, 150001) || {};
        var arr = [];
        try { arr = obj.value ? JSON.parse(obj.value) : []; } catch (e) {}
        arr = arr.filter(function(x) { return Number(x.color_type) !== StuUltraMax.activeCurveChannel; });
        if (!arr.length) StuUltraMax.upsertColorParam(st, 150001, {}, { remove: true });
        else StuUltraMax.upsertColorParam(st, 150001, { value: JSON.stringify(arr) });
        StuUltraMax.renderModule();
        StuUltraMax.scheduleRetouch(false);
      });

      body.querySelectorAll('[data-filter-cat]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          StuUltraMax.activeFilterGroupIdx = Number(btn.getAttribute('data-filter-cat'));
          StuUltraMax.renderModule();
        });
      });
      body.querySelectorAll('[data-filter-id]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var aid = Number(btn.getAttribute('data-filter-id'));
          StuUltraMax.upsertColorParam(st, aid, { value: roundScope(80, 0.01) }, { isFilter: true, forceGlobal: true });
          StuUltraMax.renderModule();
          StuUltraMax.scheduleRetouch(false);
        });
      });

      // Portrait cohorts, auto portrait, single face, reshape/makeup tabs, rowGroup swatches
      body.querySelectorAll('[data-cohort]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          StuUltraMax.activePortraitCohort = btn.getAttribute('data-cohort');
          StuUltraMax.renderModule();
          StuUltraMax.drawFaceBoxes();
        });
      });
      body.querySelectorAll('[data-face-cid]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          StuUltraMax.selectedFaceClassId = Number(btn.getAttribute('data-face-cid'));
          StuUltraMax.renderModule();
          StuUltraMax.drawFaceBoxes();
        });
      });
      var autoPortrait = body.querySelector('#stu-max-auto-portrait');
      if (autoPortrait) autoPortrait.addEventListener('click', function() {
        StuUltraMax.applyPresetRecipe(GENRE_PRESETS.studio, 'Đặt Chân Dung');
      });

      body.querySelectorAll('[data-reshape-tab]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          StuUltraMax._reshapeTabIdx = Number(btn.getAttribute('data-reshape-tab'));
          StuUltraMax.renderModule();
        });
      });
      body.querySelectorAll('[data-rowtab-state]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          StuUltraMax[btn.getAttribute('data-rowtab-state')] = Number(btn.getAttribute('data-rowtab-idx'));
          StuUltraMax.renderModule();
        });
      });
      body.querySelectorAll('[data-rg-algo]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var aid = Number(btn.getAttribute('data-rg-algo'));
          var isNone = btn.getAttribute('data-rg-none') === '1';
          var scene = btn.getAttribute('data-rg-scene');
          var def = Number(btn.getAttribute('data-rg-def') || 60);
          var scope = Number(btn.getAttribute('data-rg-scope') || 1);
          var isB = btn.getAttribute('data-rg-beauty') === '1';
          var patch = isNone ? {} : { scene: scene, value: roundScope(def, scope) };
          if (isB) StuUltraMax.upsertBeautyParam(st, aid, patch, { remove: isNone });
          else StuUltraMax.upsertColorParam(st, aid, patch, { remove: isNone });
          StuUltraMax.renderModule();
          StuUltraMax.scheduleRetouch(false);
        });
      });
      body.querySelectorAll('[data-rg-opt-algo]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var aid = Number(btn.getAttribute('data-rg-opt-algo'));
          StuUltraMax.upsertBeautyParam(st, aid, { option_value: Number(btn.getAttribute('data-rg-opt')) });
          StuUltraMax.renderModule();
          StuUltraMax.scheduleRetouch(false);
        });
      });

      // Background module events
      var defectSw = body.querySelector('#stu-max-bg-defect-sw');
      if (defectSw) defectSw.addEventListener('change', function() {
        var clear = [610001, 610002, 610003];
        if (defectSw.checked) {
          StuUltraMax.upsertColorParam(st, 610003, { value: 100, background: 100, ground: 100 }, { clearGroupIds: clear, forceGlobal: true });
        } else {
          StuUltraMax.upsertColorParam(st, 610003, {}, { clearGroupIds: clear, remove: true, forceGlobal: true });
        }
        StuUltraMax.renderModule();
        StuUltraMax.scheduleRetouch(false);
      });
      body.querySelectorAll('[data-defect-mode]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var aid = Number(btn.getAttribute('data-defect-mode'));
          var cur = StuUltraMax.getAlgoObject(st, false, 610003) || StuUltraMax.getAlgoObject(st, false, 610002) || StuUltraMax.getAlgoObject(st, false, 610001) || { value: 100, background: 100, ground: 100 };
          StuUltraMax.upsertColorParam(st, aid, Object.assign({}, cur), { clearGroupIds: [610001, 610002, 610003], forceGlobal: true });
          StuUltraMax.renderModule();
          StuUltraMax.scheduleRetouch(false);
        });
      });
      var evenSw = body.querySelector('#stu-max-bg-even-sw');
      if (evenSw) evenSw.addEventListener('change', function() {
        StuUltraMax.upsertColorParam(st, 610005, { value: 100 }, { remove: !evenSw.checked, forceGlobal: true });
        StuUltraMax.renderModule();
        StuUltraMax.scheduleRetouch(false);
      });

      body.querySelectorAll('[data-bg-mode]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          st.bgMode = btn.getAttribute('data-bg-mode');
          StuUltraMax.renderModule();
        });
      });
      body.querySelectorAll('[data-bg-idx]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var idx = Number(btn.getAttribute('data-bg-idx'));
          var list = (StuUltraMax.bgInfo && StuUltraMax.bgInfo.change_background && StuUltraMax.bgInfo.change_background[0].group) || [];
          var item = list[idx];
          if (!item || idx === 0 || Number(item.algorithmid) === -1) {
            StuUltraMax.upsertColorParam(st, 620001, {}, { clearGroupIds: [620001, 620002], remove: true, forceGlobal: true });
          } else {
            StuUltraMax.upsertColorParam(st, 620001, {
              scene: item.scene, ename: 'sys_changebackground', value: Number(st.bgEdge), material_alpha: Number(st.bgOpacity), mask_scope: Number(st.bgMaskScope)
            }, { clearGroupIds: [620001, 620002], forceGlobal: true });
          }
          StuUltraMax.renderModule();
          StuUltraMax.scheduleRetouch(false);
        });
      });
      var maskSel = body.querySelector('#stu-max-bg-mask-scope');
      if (maskSel) maskSel.addEventListener('change', function() {
        st.bgMaskScope = Number(maskSel.value);
        var cur = StuUltraMax.getAlgoObject(st, false, 620001) || StuUltraMax.getAlgoObject(st, false, 620002);
        if (cur) {
          cur.mask_scope = st.bgMaskScope;
          StuUltraMax.scheduleRetouch(false);
        }
      });

      // Sky module events
      body.querySelectorAll('[data-sky-mode]').forEach(function(btn) {
        btn.addEventListener('click', function() { st.skyMode = btn.getAttribute('data-sky-mode'); StuUltraMax.renderModule(); });
      });
      body.querySelectorAll('[data-sky-cat]').forEach(function(btn) {
        btn.addEventListener('click', function() { st.skyCat = btn.getAttribute('data-sky-cat'); StuUltraMax.renderModule(); });
      });
      var skyNone = body.querySelector('[data-sky-none]');
      if (skyNone) skyNone.addEventListener('click', function() {
        StuUltraMax.upsertColorParam(st, 630001, {}, { clearGroupIds: [630001, 630002], remove: true, forceGlobal: true });
        StuUltraMax.renderModule();
        StuUltraMax.scheduleRetouch(false);
      });
      body.querySelectorAll('[data-sky-idx]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var idx = Number(btn.getAttribute('data-sky-idx'));
          var list = (StuUltraMax.bgInfo && StuUltraMax.bgInfo.change_sky && StuUltraMax.bgInfo.change_sky[0].group) || [];
          var item = list[idx];
          if (!item) return;
          StuUltraMax.upsertColorParam(st, 630001, buildSkyAlgoPatch(item.scene, null), { clearGroupIds: [630001, 630002], forceGlobal: true });
          StuUltraMax.renderModule();
          StuUltraMax.scheduleRetouch(false);
        });
      });

      // Clothing tabs
      body.querySelectorAll('[data-cloth-tab]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          st.clothCohortIdx = Number(btn.getAttribute('data-cloth-tab'));
          StuUltraMax.renderModule();
        });
      });

      // Custom bg & custom sky uploaders (saves ref image path via bridge)
      StuUltraMax.bindCustomSceneUpload(body.querySelector('#stu-max-bg-custom-file'), st, 620002, [620001, 620002], function(path, thumb) {
        st.bgCustomScenes.push({ name: 'Tùy chỉnh ' + (st.bgCustomScenes.length + 1), scene: path, thumb: thumb });
        return { scene: path, ename: 'cus_changebackground', value: Number(st.bgEdge), material_alpha: Number(st.bgOpacity), mask_scope: Number(st.bgMaskScope) };
      });
      StuUltraMax.bindCustomSceneUpload(body.querySelector('#stu-max-sky-custom-file'), st, 630002, [630001, 630002], function(path, thumb) {
        st.skyCustomScenes.push({ name: 'Trời #' + (st.skyCustomScenes.length + 1), scene: path, thumb: thumb });
        return buildSkyAlgoPatch(path, null);
      });
      body.querySelectorAll('[data-bg-cus-idx]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var item = st.bgCustomScenes[Number(btn.getAttribute('data-bg-cus-idx'))];
          if (!item) return;
          StuUltraMax.upsertColorParam(st, 620002, { scene: item.scene, ename: 'cus_changebackground', value: Number(st.bgEdge), material_alpha: Number(st.bgOpacity), mask_scope: Number(st.bgMaskScope) }, { clearGroupIds: [620001, 620002], forceGlobal: true });
          StuUltraMax.renderModule(); StuUltraMax.scheduleRetouch(false);
        });
      });
      body.querySelectorAll('[data-sky-cus-idx]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var item = st.skyCustomScenes[Number(btn.getAttribute('data-sky-cus-idx'))];
          if (!item) return;
          StuUltraMax.upsertColorParam(st, 630002, buildSkyAlgoPatch(item.scene, null), { clearGroupIds: [630001, 630002], forceGlobal: true });
          StuUltraMax.renderModule(); StuUltraMax.scheduleRetouch(false);
        });
      });

      // All Range Sliders
      body.querySelectorAll('[data-lk-slider]').forEach(function(inp) {
        function handleSlider(isChanging) {
          var v = Number(inp.value);
          var min = Number(inp.min), max = Number(inp.max);
          inp.style.setProperty('--p', (((v - min) / Math.max(0.0001, max - min)) * 100) + '%');
          var lbl = body.querySelector('[data-val-key="' + inp.getAttribute('data-lk-slider') + '"]');
          if (lbl) lbl.textContent = v;

          var aid = Number(inp.getAttribute('data-algo'));
          var ename = inp.getAttribute('data-ename');
          var scope = Number(inp.getAttribute('data-scope') || 1);
          var isB = inp.getAttribute('data-beauty') === '1';
          var linkL = inp.getAttribute('data-link-left');
          var linkR = inp.getAttribute('data-link-right');

          if (linkL && linkR) {
            StuUltraMax.upsertBeautyParam(st, Number(linkL), { value: roundScope(v, scope) });
            StuUltraMax.upsertBeautyParam(st, Number(linkR), { value: roundScope(v, scope) });
          } else if (ename.indexOf('hsl_') === 0) {
            var field = ename.slice(4);
            var hDef = HSL_COLORS.find(function(c) { return c.key === StuUltraMax.activeHslColor; });
            var cur = StuUltraMax.getAlgoObject(st, false, 160001) || {};
            var arr = [];
            try { arr = cur.value ? JSON.parse(cur.value) : []; } catch (e) {}
            var entry = arr.find(function(x) { return Number(x.color_type) === hDef.code; });
            if (!entry) {
              entry = { color_type: hDef.code, hue_value: 0, saturation_value: 0, brightness_value: 0 };
              arr.push(entry);
            }
            entry[field] = v;
            StuUltraMax.upsertColorParam(st, 160001, { value: JSON.stringify(arr) });
          } else if (ename.indexOf('ref_') === 0) {
            var rk = ename.slice(4);
            var ro = StuUltraMax.getAlgoObject(st, false, 170001) || {};
            var parsedRef = parseRefValue(ro);
            var targetRef = st.referScope === 'person'
              ? parsedRef.localized_adjustment[0]
              : (st.referScope === 'background' ? parsedRef.background : parsedRef.overall_adjustment);
            targetRef[rk] = v;
            StuUltraMax.upsertColorParam(st, 170001, {
              value: JSON.stringify(parsedRef),
              refer_name: ro.refer_name || 'sys_ai_color_simulation',
              scene: st.referPath || ro.scene || ''
            }, { forceGlobal: true });
          } else if (ename === 'bg_edge' || ename === 'bg_opacity') {
            if (ename === 'bg_edge') st.bgEdge = v;
            else st.bgOpacity = v;
            var bgAct = StuUltraMax.getAlgoObject(st, false, 620001) || StuUltraMax.getAlgoObject(st, false, 620002);
            if (bgAct) {
              bgAct.value = st.bgEdge;
              bgAct.material_alpha = st.bgOpacity;
            }
          } else if (ename.indexOf('skyparam_') === 0) {
            var sk = ename.slice(9);
            var isCusSky = !!StuUltraMax.getAlgoObject(st, false, 630002);
            var sActId = isCusSky ? 630002 : 630001;
            var sAct = StuUltraMax.getAlgoObject(st, false, sActId);
            if (sAct) {
              var curSky = parseSkyValue(sAct);
              curSky.value[sk] = v;
              StuUltraMax.upsertColorParam(st, sActId, buildSkyAlgoPatch(curSky.scene, curSky.value), { forceGlobal: true });
            }
          } else if (ename.indexOf('cloth_') === 0) {
            var caid = Number(ename.slice(6));
            if (!st.clothValues[caid]) st.clothValues[caid] = [0, 0, 0, 0, 0];
            if (st.clothCohortIdx === 0) st.clothValues[caid] = [v, v, v, v, v];
            else st.clothValues[caid][st.clothCohortIdx - 1] = v;
            var list = COHORT_DEFS.map(function(c, i) { return { sex: c.sex, age: c.age, value: st.clothValues[caid][i] }; });
            var allZeroCloth = list.every(function(x) { return Number(x.value) === 0; });
            if (allZeroCloth) {
              StuUltraMax.upsertColorParam(st, caid, {}, { remove: true, forceGlobal: true });
            } else {
              StuUltraMax.upsertColorParam(st, caid, {
                ename: 'value',
                scope: 1,
                value: JSON.stringify({ sex_age_value_list: list })
              }, { forceGlobal: true });
            }
          } else {
            var patch = {};
            patch[ename] = roundScope(v, scope);
            if (isB) StuUltraMax.upsertBeautyParam(st, aid, patch);
            else StuUltraMax.upsertColorParam(st, aid, patch);
          }
          StuUltraMax.scheduleRetouch(isChanging);
        }

        inp.addEventListener('input', function() { handleSlider(true); });
        inp.addEventListener('change', function() { handleSlider(false); });
        inp.addEventListener('dblclick', function() {
          inp.value = inp.getAttribute('data-def') || 0;
          handleSlider(false);
        });
      });

      // Generic switches
      body.querySelectorAll('[data-lk-switch]').forEach(function(sw) {
        sw.addEventListener('change', function() {
          var aid = Number(sw.getAttribute('data-algo'));
          var ename = sw.getAttribute('data-ename') || 'value';
          var maxV = Number(sw.getAttribute('data-max') || 100);
          var isB = sw.getAttribute('data-beauty') === '1';
          var patch = {};
          patch[ename] = sw.checked ? maxV : 0;
          if (isB) StuUltraMax.upsertBeautyParam(st, aid, patch, { remove: !sw.checked });
          else StuUltraMax.upsertColorParam(st, aid, patch, { remove: !sw.checked });
          StuUltraMax.scheduleRetouch(false);
        });
      });

      // Camera events
      var camConn = body.querySelector('#stu-max-cam-connect');
      var camDisc = body.querySelector('#stu-max-cam-disconnect');
      if (camConn) camConn.addEventListener('click', StuUltraMax.connectCamera);
      if (camDisc) camDisc.addEventListener('click', StuUltraMax.disconnectCamera);

      // Liquify controls
      body.querySelectorAll('[data-liq-tool]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          StuUltraMax.liquifyTool = btn.getAttribute('data-liq-tool');
          StuUltraMax.renderModule();
        });
      });
      ['size', 'pressure', 'density'].forEach(function(k) {
        var r = body.querySelector('#liq-' + k);
        if (r) r.addEventListener('input', function() {
          var v = Number(r.value);
          r.style.setProperty('--p', v + '%');
          if (k === 'size') StuUltraMax.liquifySize = v;
          if (k === 'pressure') StuUltraMax.liquifyPressure = v;
          if (k === 'density') StuUltraMax.liquifyDensity = v;
          var valEl = body.querySelector('#liq-val-' + k);
          if (valEl) valEl.textContent = v;
        });
      });
      var pinEl = body.querySelector('#liq-pin-edges');
      if (pinEl) pinEl.addEventListener('change', function() {
        StuUltraMax.liquifyPinEdges = pinEl.checked;
        if (StuUltraMax.liquifyActive) {
          postJson('/api/lk_ultra_max/liquid', {
            action: 'event',
            event_type: 504,
            data: { edge_fixed: Boolean(StuUltraMax.liquifyPinEdges) },
            fetch_preview: false
          });
        }
      });
      var liqConf = body.querySelector('#stu-max-liq-confirm');
      var liqCanc = body.querySelector('#stu-max-liq-cancel');
      var liqUndo = body.querySelector('#stu-max-liq-undo');
      if (liqConf) liqConf.addEventListener('click', function() { StuUltraMax.endLiquify(true, false); StuUltraMax.switchModule('color'); });
      if (liqCanc) liqCanc.addEventListener('click', function() {
        var photo = window._devstuA && window._devstuA.current;
        if (photo && photo._lkMaxState) photo._lkMaxState.liquidParams = null;
        StuUltraMax.endLiquify(false, true);
      });
      if (liqUndo) liqUndo.addEventListener('click', function() { StuUltraMax.undoLiquify(); });
    },

    bindCustomSceneUpload: function(inputEl, st, algoId, clearIds, buildPatchFn) {
      if (!inputEl) return;
      inputEl.addEventListener('change', function() {
        var f = inputEl.files && inputEl.files[0];
        if (!f || !st.fid) return;
        var fr = new FileReader();
        fr.onload = function() {
          postJson('/api/lk_ultra_max/reference', { fid: st.fid, image_base64: fr.result }).then(function(res) {
            if (!res || !res.refer_path) return;
            var patch = buildPatchFn(res.refer_path, fr.result);
            StuUltraMax.upsertColorParam(st, algoId, patch, { clearGroupIds: clearIds, forceGlobal: true });
            StuUltraMax.renderModule();
            StuUltraMax.scheduleRetouch(false);
          });
        };
        fr.readAsDataURL(f);
      });
    },

    bindCurveCanvas: function(body, st) {
      var svg = body.querySelector('#stu-max-curve-svg');
      if (!svg) return;
      function getArr() {
        var curObj = StuUltraMax.getAlgoObject(st, false, 150001) || {};
        try { return curObj.value ? JSON.parse(curObj.value) : []; } catch (e) { return []; }
      }
      function getChannelPts(arr) {
        var ch = arr.find(function(x) { return Number(x.color_type) === StuUltraMax.activeCurveChannel; });
        if (!ch) {
          ch = { color_type: StuUltraMax.activeCurveChannel, point_arr: [{ x: 0, y: 0 }, { x: 255, y: 255 }] };
          arr.push(ch);
        }
        return ch.point_arr;
      }
      function commitCurve(arr, isChanging) {
        arr.forEach(function(c) { c.point_arr.sort(function(a, b) { return a.x - b.x; }); });
        StuUltraMax.upsertColorParam(st, 150001, { value: JSON.stringify(arr) });
        StuUltraMax.scheduleRetouch(isChanging);
        var pts = getChannelPts(arr);
        var poly = body.querySelector('#stu-max-curve-poly');
        if (poly) poly.setAttribute('points', pts.map(function(p) {
          return ((p.x / 255) * 200).toFixed(1) + ',' + (200 - (p.y / 255) * 200).toFixed(1);
        }).join(' '));
      }

      var dragIdx = -1;
      function svgCoords(e) {
        var r = svg.getBoundingClientRect();
        var x = Math.max(0, Math.min(255, Math.round(((e.clientX - r.left) / r.width) * 255)));
        var y = Math.max(0, Math.min(255, Math.round((1 - (e.clientY - r.top) / r.height) * 255)));
        return { x: x, y: y };
      }

      svg.addEventListener('pointerdown', function(e) {
        var ptEl = e.target.closest('[data-pt-idx]');
        var arr = getArr();
        var pts = getChannelPts(arr);
        if (ptEl) {
          dragIdx = Number(ptEl.getAttribute('data-pt-idx'));
        } else {
          var c = svgCoords(e);
          pts.push(c);
          pts.sort(function(a, b) { return a.x - b.x; });
          dragIdx = pts.findIndex(function(p) { return p.x === c.x && p.y === c.y; });
          commitCurve(arr, true);
          StuUltraMax.renderModule();
        }
        svg.setPointerCapture(e.pointerId);
      });
      svg.addEventListener('pointermove', function(e) {
        if (dragIdx < 0) return;
        var arr = getArr();
        var pts = getChannelPts(arr);
        if (!pts[dragIdx]) return;
        var c = svgCoords(e);
        if (dragIdx === 0) c.x = 0;
        if (dragIdx === pts.length - 1) c.x = 255;
        pts[dragIdx] = c;
        commitCurve(arr, true);
      });
      svg.addEventListener('pointerup', function() {
        if (dragIdx >= 0) {
          dragIdx = -1;
          commitCurve(getArr(), false);
          StuUltraMax.renderModule();
        }
      });
      svg.addEventListener('dblclick', function(e) {
        var ptEl = e.target.closest('[data-pt-idx]');
        if (!ptEl) return;
        var idx = Number(ptEl.getAttribute('data-pt-idx'));
        var arr = getArr();
        var pts = getChannelPts(arr);
        if (idx > 0 && idx < pts.length - 1) {
          pts.splice(idx, 1);
          commitCurve(arr, false);
          StuUltraMax.renderModule();
        }
      });
    },

    // =========================================================================
    // LIQUIFY INTERACTION (500 / 501 / 502 + begin / confirm / cancel)
    // =========================================================================
    beginLiquify: function() {
      var photo = window._devstuA && window._devstuA.current;
      var st = photo && photo._lkMaxState;
      if (!st || !st.fid || StuUltraMax.liquifyActive) return;
      StuUltraMax.liquifyActive = true;
      postJson('/api/lk_ultra_max/liquid', { action: 'begin', fid: st.fid, mode: 1, fast_url: true }).then(function(res) {
        var bSrc = resolvePreviewSrc(res);
        if (bSrc) { st.afterDataUrl = bSrc; StuUltraMax.renderViewport(); }
        postJson('/api/lk_ultra_max/liquid', {
          action: 'event',
          fid: st.fid,
          event_type: 504,
          data: { edge_fixed: Boolean(StuUltraMax.liquifyPinEdges) },
          fetch_preview: false,
          fast_url: true
        });
      });
    },

    endLiquify: function(confirmChanges, rebegin) {
      if (!StuUltraMax.liquifyActive) return;
      StuUltraMax.liquifyActive = false;
      var photo = window._devstuA && window._devstuA.current;
      var st = photo && photo._lkMaxState;
      var fid = (st && st.fid) || 0;
      postJson('/api/lk_ultra_max/liquid', { action: confirmChanges ? 'confirm' : 'cancel', fid: fid, mode: 1, fast_url: true }).then(function(res) {
        if (st) {
          if (confirmChanges) {
            var lp = (res && res.liquid_params) || null;
            if (!lp && res && res.result && typeof res.result.param === 'string') {
              try { lp = JSON.parse(res.result.param).liquid_params || null; } catch (e) {}
            }
            if (lp) st.liquidParams = lp;
            StuUltraMax.scheduleRetouch(false);
            toast('Đã áp dụng nắn bóp');
          } else {
            st.liquidParams = null;
            var cSrc = resolvePreviewSrc(res);
            if (cSrc) {
              st.afterDataUrl = cSrc;
              StuUltraMax.renderViewport();
            }
            StuUltraMax.scheduleRetouch(false);
            if (rebegin && StuUltraMax.activeModule === 'liquify') {
              StuUltraMax.beginLiquify();
            }
          }
        }
      });
    },

    undoLiquify: function() {
      var photo = window._devstuA && window._devstuA.current;
      var st = photo && photo._lkMaxState;
      postJson('/api/lk_ultra_max/liquid', { action: 'history', fid: (st && st.fid) || 0, params: { step: -1 }, fast_url: true }).then(function(res) {
        var hSrc = resolvePreviewSrc(res);
        if (hSrc && st) {
          st.afterDataUrl = hSrc;
          StuUltraMax.renderViewport();
        }
      });
    },

    drawBrushCursor: function(e) {
      var ov = StuUltraMax.overlayCanvas;
      if (!ov) return;
      var r = ov.getBoundingClientRect();
      var x = e.clientX - r.left;
      var y = e.clientY - r.top;
      var ctx = ov.getContext('2d');
      ctx.clearRect(0, 0, ov.width, ov.height);
      ctx.beginPath();
      ctx.arc(x, y, Math.max(8, StuUltraMax.liquifySize * 0.65), 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    },

    clearOverlayCursor: function() {
      var ov = StuUltraMax.overlayCanvas;
      if (!ov) return;
      ov.getContext('2d').clearRect(0, 0, ov.width, ov.height);
      StuUltraMax.drawFaceBoxes();
    },

    sendLiquifyPointerEvent: function(evType, e) {
      var ov = StuUltraMax.overlayCanvas;
      var photo = window._devstuA && window._devstuA.current;
      var st = photo && photo._lkMaxState;
      if (!ov || !st || !st.fid) return;
      var now = Date.now();
      if (evType === 501 && StuUltraMax._lastLiqMove && (now - StuUltraMax._lastLiqMove) < 32) {
        return;
      }
      if (evType === 501) StuUltraMax._lastLiqMove = now;
      var rect = ov.getBoundingClientRect();
      var fr = st.frameRect || { x: 200, y: 150, width: Math.max(200, rect.width), height: Math.max(200, rect.height) };
      var nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
      var ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / Math.max(1, rect.height)));
      var px = Math.round(fr.x + nx * fr.width);
      var py = Math.round(fr.y + ny * fr.height);
      var diam = Math.max(12, Math.round(StuUltraMax.liquifySize * Math.max(0.6, fr.width / 300)));

      var evData = evType === 500 ? {
        type: 'forward_deform',
        in_canvas: true,
        x: px,
        y: py,
        diameter: diam,
        stress: StuUltraMax.liquifyPressure,
        density: StuUltraMax.liquifyDensity,
        fixed_edge: StuUltraMax.liquifyPinEdges ? 100 : 0
      } : {
        type: 'forward_deform',
        in_canvas: true,
        x: px,
        y: py
      };

      postJson('/api/lk_ultra_max/liquid', {
        action: 'event',
        fid: st.fid,
        event_type: evType,
        data: evData,
        fetch_preview: evType === 502,
        fast_url: true
      }).then(function(res) {
        var lSrc = resolvePreviewSrc(res);
        if (lSrc) {
          st.afterDataUrl = lSrc;
          StuUltraMax.renderViewport();
        }
      });
    },

    // =========================================================================
    // CAMERA TETHER
    // =========================================================================
    connectCamera: function() {
      postJson('/api/lk_ultra_max/camera', { action: 'connect', params: {} }).then(function(res) {
        StuUltraMax.cameraConnected = !!(res && res.ok);
        StuUltraMax.cameraEvents.push({
          type: 'INFO',
          msg: StuUltraMax.cameraConnected
            ? 'Đã bật lắng nghe máy ảnh aipic.dll'
            : ((res && res.error) || (res && res.ret === 1900003 ? 'Không có máy ảnh USB / chưa hỗ trợ (ret=1900003)' : 'Không tìm thấy máy ảnh USB'))
        });
        if (StuUltraMax.cameraConnected) {
          clearInterval(StuUltraMax.cameraPollTimer);
          StuUltraMax.cameraPollTimer = setInterval(function() {
            postJson('/api/lk_ultra_max/camera', { action: 'poll' }).then(function(p) {
              if (p && p.events && p.events.length) {
                p.events.forEach(function(ev) {
                  StuUltraMax.cameraEvents.push({ type: ev.event, msg: ev.data });
                });
                if (StuUltraMax.activeModule === 'camera') StuUltraMax.renderModule();
              }
            });
          }, 1500);
        }
        StuUltraMax.renderModule();
      });
    },

    disconnectCamera: function() {
      clearInterval(StuUltraMax.cameraPollTimer);
      postJson('/api/lk_ultra_max/camera', { action: 'disconnect', params: {} }).then(function() {
        StuUltraMax.cameraConnected = false;
        StuUltraMax.cameraEvents.push({ type: 'INFO', msg: 'Đã ngắt kết nối máy ảnh' });
        StuUltraMax.renderModule();
      });
    },

    // =========================================================================
    // PRESETS, SYNC, RESET & EXPORT
    // =========================================================================
    parsePresetsPayload: function(groupsPayload) {
      var list = Array.isArray(groupsPayload) ? groupsPayload : (groupsPayload && groupsPayload.groups) || [];
      StuUltraMax.presets = list;
    },

    loadPresets: function() {
      return postJson('/api/lk_ultra_max/presets', { op: 'list' }).then(function(res) {
        if (res && res.ok) StuUltraMax.parsePresetsPayload(res.groups);
      });
    },

    renderPresetDrawer: function() {
      var drawer = StuUltraMax.presetDrawer;
      if (!drawer) return;
      var builtins = Object.keys(GENRE_PRESETS).map(function(k) {
        return '<button type="button" class="lk-preset-row" data-builtin-preset="' + k + '"><span>✦ ' + escapeHtml(GENRE_PRESETS[k].name) + '</span><span class="badge">Chuẩn</span></button>';
      }).join('');

      var saved = [];
      (StuUltraMax.presets || []).forEach(function(g) {
        (g.items || g.presets || []).forEach(function(it) {
          saved.push('<div class="lk-preset-saved">' +
            '<button type="button" class="lk-preset-row" data-saved-idx="' + saved.length + '" data-saved-param="' + escapeHtml(typeof it.param === 'string' ? it.param : JSON.stringify(it.param || {})) + '"><span>' + escapeHtml(it.name || 'Preset #' + (saved.length + 1)) + '</span></button>' +
            (it.id ? '<button type="button" class="lk-preset-del" data-del-preset="' + it.id + '" title="Xóa preset">✕</button>' : '') +
          '</div>');
        });
      });

      drawer.innerHTML =
        '<div class="lk-drawer-hdr"><span>Cài Đặt Sẵn (LK Magic Pro)</span><button type="button" id="stu-max-drawer-close">✕</button></div>' +
        '<div class="lk-drawer-sec">Đề xuất Studio</div>' + builtins +
        '<div class="lk-drawer-sec">Đã lưu trong CSDL</div>' +
        (saved.length ? saved.join('') : '<div class="lk-muted">Chưa có cài đặt sẵn cá nhân — bấm "Lưu Cài Đặt Sẵn" ở đáy bảng phải.</div>');

      drawer.querySelector('#stu-max-drawer-close').addEventListener('click', function() {
        StuUltraMax.presetDrawerOpen = false;
        drawer.classList.add('hidden');
      });
      drawer.querySelectorAll('[data-builtin-preset]').forEach(function(b) {
        b.addEventListener('click', function() {
          var key = b.getAttribute('data-builtin-preset');
          StuUltraMax.applyPresetRecipe(GENRE_PRESETS[key], GENRE_PRESETS[key].name);
        });
      });
      drawer.querySelectorAll('[data-saved-param]').forEach(function(b) {
        b.addEventListener('click', function() {
          try {
            var p = JSON.parse(b.getAttribute('data-saved-param'));
            StuUltraMax.applyRawAipicParam(p, b.textContent);
          } catch (e) {}
        });
      });
      drawer.querySelectorAll('[data-del-preset]').forEach(function(b) {
        b.addEventListener('click', function() {
          postJson('/api/lk_ultra_max/presets', { op: 'delete_item', item_id: Number(b.getAttribute('data-del-preset')) }).then(function() {
            StuUltraMax.loadPresets().then(StuUltraMax.renderPresetDrawer);
          });
        });
      });
    },

    applyPresetBySlug: function(slug, title) {
      var recipe = GENRE_PRESETS[slug] || GENRE_PRESETS.clean_natural;
      StuUltraMax.applyPresetRecipe(recipe, title || recipe.name);
    },

    applyPresetRecipe: function(recipe, label) {
      var photo = window._devstuA && window._devstuA.current;
      if (!photo) { toast('Vui lòng chọn ảnh trước'); return; }
      var st = ensureState(photo);
      (recipe.colorParams || []).forEach(function(it) {
        StuUltraMax.applyAlgoPatchToArray(st.colorParams, it.id, it.algorithm, {});
      });
      if (recipe.beautyParams && recipe.beautyParams.length) {
        st.beautyCohorts.forEach(function(c) {
          recipe.beautyParams.forEach(function(it) {
            StuUltraMax.applyAlgoPatchToArray(c.params, it.id, it.algorithm, {});
          });
        });
      }
      StuUltraMax.renderModule();
      StuUltraMax.scheduleRetouch(false);
      toast('Đã áp dụng: ' + label);
    },

    applyRawAipicParam: function(raw, label) {
      var photo = window._devstuA && window._devstuA.current;
      if (!photo) return;
      var st = ensureState(photo);
      if (raw.sex_retoucher_color_params) {
        st.colorParams = clone(raw.sex_retoucher_color_params.params || []);
        st.partialParams = clone(raw.sex_retoucher_color_params.partial_params || []);
      }
      if (Array.isArray(raw.sex_retoucher_beauty_params)) {
        raw.sex_retoucher_beauty_params.forEach(function(bp) {
          if (bp.classid != null) return;
          var target = st.beautyCohorts.find(function(c) { return c.age === Number(bp.age) && c.sex === Number(bp.sex); });
          if (target) target.params = clone(bp.params || []);
        });
      }
      StuUltraMax.renderModule();
      StuUltraMax.scheduleRetouch(false);
      toast('Đã áp dụng preset: ' + label);
    },

    saveCurrentAsPreset: function() {
      var photo = window._devstuA && window._devstuA.current;
      if (!photo) { toast('Chưa có ảnh nào đang mở'); return; }
      var name = window.prompt('Nhập tên Cài Đặt Sẵn mới:', 'Studio Preset ' + new Date().toLocaleTimeString('vi-VN'));
      if (!name) return;
      var st = ensureState(photo);
      var paramJson = JSON.stringify(StuUltraMax.buildRetouchParam(st));
      postJson('/api/lk_ultra_max/presets', {
        op: 'insert_item',
        data: { group_id: 1, name: name, param: paramJson, sort: 0 }
      }).then(function(res) {
        if (res && res.ok) {
          toast('Đã lưu Cài Đặt Sẵn: ' + name);
          StuUltraMax.loadPresets().then(StuUltraMax.renderPresetDrawer);
        } else {
          toast('Lưu Cài Đặt Sẵn thất bại: ' + ((res && res.error) || ''), 'error');
        }
      });
    },

    syncToAllPhotos: function() {
      var A = window._devstuA;
      if (!A || !A.current || !A.photos || A.photos.length < 2) {
        toast('Cần tối thiểu 2 ảnh trong danh sách để đồng bộ');
        return;
      }
      var src = ensureState(A.current);
      var count = 0;
      A.photos.forEach(function(p) {
        if (p === A.current) return;
        var dst = ensureState(p);
        dst.beautyCohorts = clone(src.beautyCohorts);
        dst.colorParams = clone(src.colorParams);
        dst.partialParams = clone(src.partialParams);
        dst.clothValues = clone(src.clothValues);
        count++;
      });
      toast('Đã đồng bộ thông số STU Ultra Max sang ' + count + ' ảnh');
    },

    resetModule: function(mod, st) {
      if (mod === 'color') {
        st.colorParams = st.colorParams.filter(function(p) {
          return Number(p.id) >= 610000; // keep background & clothing
        });
        st.partialParams = [];
        st.referThumbUrl = '';
        st.referPath = '';
        st.referName = '';
        st.referSampleId = '';
      } else if (mod === 'beauty') {
        st.beautyCohorts.forEach(function(c) { c.params = []; });
        st.faceParams = {};
      } else if (mod === 'background') {
        st.colorParams = st.colorParams.filter(function(p) {
          var id = Number(p.id);
          return id < 610000 || id >= 700000;
        });
        st.bgEdge = 0; st.bgOpacity = 100; st.bgMaskScope = 1;
      } else if (mod === 'clothing') {
        st.clothValues = {};
        st.colorParams = st.colorParams.filter(function(p) {
          var id = Number(p.id);
          return id < 710000 || id >= 720000;
        });
      }
      StuUltraMax.renderModule();
      StuUltraMax.scheduleRetouch(false);
    },

    resetAllParams: function() {
      var photo = window._devstuA && window._devstuA.current;
      if (!photo) return;
      var st = ensureState(photo);
      st.beautyCohorts.forEach(function(c) { c.params = []; });
      st.faceParams = {};
      st.colorParams = [];
      st.partialParams = [];
      st.clothValues = {};
      st.liquidParams = null;
      st.referThumbUrl = '';
      st.referPath = '';
      st.referName = '';
      st.referSampleId = '';
      st.bgEdge = 0; st.bgOpacity = 100; st.bgMaskScope = 1;
      StuUltraMax.renderModule();
      StuUltraMax.scheduleRetouch(false);
      toast('Đã đặt lại toàn bộ thông số');
    },

    openSettingsModal: function() {
      var modal = document.getElementById('stu-max-modal');
      if (!modal) return;
      modal.classList.remove('hidden');
      modal.innerHTML = '<div class="lk-modal-card">' +
        '<div class="lk-modal-hdr"><span>Cài đặt AI Engine (STU Ultra Max)</span><button type="button" id="lk-m-close">✕</button></div>' +
        '<div class="lk-modal-body">' +
          '<div class="lk-field-row"><span>Engine lõi</span><b>aipic.dll (9. LK Magic Pro GPU)</b></div>' +
          '<div class="lk-field-row"><span>Trạng thái Sidecar</span><b>' + (StuUltraMax.bridgeReady ? 'Đang chạy ✓' : 'Chưa khởi tạo') + '</b></div>' +
          '<div class="lk-field-row"><span>Độ phân giải gốc</span><b>' + ((window._devstuA?.current?._lkOrigW || window._devstuA?.current?.width || 0) + ' × ' + (window._devstuA?.current?._lkOrigH || window._devstuA?.current?.height || 0)) + '</b></div>' +
        '</div>' +
        '<div class="lk-modal-ft"><button type="button" class="lk-blue-btn" id="lk-m-ok">Đóng</button></div>' +
      '</div>';
      modal.querySelector('#lk-m-close').onclick = modal.querySelector('#lk-m-ok').onclick = function() {
        modal.classList.add('hidden');
      };
    },

    openExportModal: function() {
      var photo = window._devstuA && window._devstuA.current;
      var st = photo && photo._lkMaxState;
      if (!photo || !st || !st.fid) { toast('Chưa có ảnh mở sẵn sàng để xuất'); return; }
      var modal = document.getElementById('stu-max-modal');
      if (!modal) return;
      modal.classList.remove('hidden');
      modal.innerHTML = '<div class="lk-modal-card">' +
        '<div class="lk-modal-hdr"><span>Xuất Ảnh GPU (aipic.dll)</span><button type="button" id="lk-m-close">✕</button></div>' +
        '<div class="lk-modal-body">' +
          '<div class="lk-field-row"><span>Định dạng</span><select id="exp-type" class="lk-select"><option value="2">PNG (Hỗ trợ trong suốt)</option><option value="1">JPEG (Chất lượng studio)</option></select></div>' +
          '<div class="lk-field-row"><span>Chất lượng JPEG</span><select id="exp-qual" class="lk-select"><option value="12">12 - Tối đa</option><option value="10" selected>10 - Studio</option><option value="8">8 - Nhẹ hơn</option></select></div>' +
          '<div class="lk-field-row"><span>Giới hạn cạnh (px)</span><select id="exp-max" class="lk-select"><option value="0" selected>Kích thước gốc</option><option value="4096">4096 px (4K)</option><option value="2048">2048 px</option></select></div>' +
          '<div id="exp-status" class="lk-muted" style="margin-top:8px">Xuất trực tiếp qua bộ xử lý aipic_build_export_task.</div>' +
        '</div>' +
        '<div class="lk-modal-ft">' +
          '<button type="button" class="lk-gray-btn" id="lk-m-cancel">Hủy</button>' +
          '<button type="button" class="lk-blue-btn" id="lk-m-go">Bắt đầu xuất ảnh</button>' +
        '</div>' +
      '</div>';
      var closeFn = function() { modal.classList.add('hidden'); };
      modal.querySelector('#lk-m-close').onclick = modal.querySelector('#lk-m-cancel').onclick = closeFn;
      modal.querySelector('#lk-m-go').onclick = function() {
        var btn = this;
        var stEl = modal.querySelector('#exp-status');
        btn.disabled = true;
        stEl.textContent = 'Đang render và xuất ảnh GPU...';
        var expType = Number(modal.querySelector('#exp-type').value);
        postJson('/api/lk_ultra_max/export', {
          fid: st.fid,
          export_type: expType,
          quality: Number(modal.querySelector('#exp-qual').value),
          export_max_size: Number(modal.querySelector('#exp-max').value)
        }).then(function(res) {
          btn.disabled = false;
          if (!res || !res.ok || !res.image_base64) {
            stEl.textContent = 'Lỗi xuất ảnh: ' + ((res && res.error) || 'Không rõ');
            return;
          }
          var a = document.createElement('a');
          var base = (photo.name || 'photo').replace(/\.[^.]+$/, '');
          a.href = res.image_base64;
          a.download = base + '_STU_Ultra_Max.' + (expType === 2 ? 'png' : 'jpg');
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          stEl.textContent = 'Xuất thành công (' + Math.round((res.bytes || 0) / 1024) + ' KB)';
          toast('Đã xuất ảnh STU Ultra Max ✓');
          setTimeout(closeFn, 700);
        });
      };
    }
  };

  window.StuUltraMax = StuUltraMax;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', StuUltraMax.init);
  } else {
    StuUltraMax.init();
  }
})();
