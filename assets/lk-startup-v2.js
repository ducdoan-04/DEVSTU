/* DEVSTU Startup Splash Screen (5s) */
(function () {
  'use strict';

  var params;
  try {
    params = new URLSearchParams(window.location.search || '');
  } catch (_) {
    params = { has: function () { return false; } };
  }

  var html = document.documentElement;
  var isStandalone = html.classList.contains('lk-startup-standalone');
  var isTauriEnv = Boolean(window.__TAURI_INTERNALS__ || window.__TAURI__);

  if (!isStandalone) {
    if (params.has('tauri_main') || params.has('nosplash') || isTauriEnv) {
      window.__devstuStartupV2 = { version: '2.0.0', skipped: true, done: true };
      return;
    }
  }

  if (window.__devstuStartupV2) return;

  var scriptSrc = (document.currentScript && document.currentScript.src) || (window.location.origin + '/assets/lk-startup-v2.js');
  var assetBase = new URL('.', scriptSrc);
  var DURATION_MS = 5000;

  var api = {
    version: '2.0.0',
    standalone: isStandalone,
    done: false,
    percent: 0,
    logs: []
  };
  window.__devstuStartupV2 = api;

  function tauriInvoke(cmd, args) {
    try {
      if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === 'function') {
        return window.__TAURI__.core.invoke(cmd, args || {});
      }
      if (window.__TAURI_INTERNALS__ && typeof window.__TAURI_INTERNALS__.invoke === 'function') {
        return window.__TAURI_INTERNALS__.invoke(cmd, args || {});
      }
    } catch (_) {}
    return Promise.reject(new Error('Tauri invoke unavailable'));
  }

  function startWindowDrag() {
    if (!isStandalone) return;
    try {
      if (window.__TAURI__ && window.__TAURI__.window && typeof window.__TAURI__.window.getCurrentWindow === 'function') {
        window.__TAURI__.window.getCurrentWindow().startDragging().catch(function () {});
        return;
      }
      tauriInvoke('plugin:window|start_dragging').catch(function () {});
    } catch (_) {}
  }

  function mountSplash() {
    if (document.getElementById('lk-startup-shell-v2')) return;

    var container = document.body;
    var backdrop = null;
    if (!isStandalone) {
      backdrop = document.createElement('div');
      backdrop.id = 'lk-startup-backdrop-v2';
      container.appendChild(backdrop);
      container = backdrop;
    }

    var shell = document.createElement('div');
    shell.id = 'lk-startup-shell-v2';
    shell.className = 'lk-startup-shell-v2';

    var header = document.createElement('div');
    header.className = 'lk-startup-header-v2';

    var drag = document.createElement('div');
    drag.className = 'lk-startup-drag-v2';
    drag.setAttribute('data-tauri-drag-region', '');

    var closeBtn = document.createElement('button');
    closeBtn.id = 'lk-startup-close-v2';
    closeBtn.className = 'lk-startup-close-v2';
    closeBtn.type = 'button';
    closeBtn.title = isStandalone ? 'Thoát DEVSTU' : 'Đóng màn hình khởi động';
    closeBtn.setAttribute('aria-label', closeBtn.title);
    closeBtn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
      '<line x1="18" y1="6" x2="6" y2="18"></line>' +
      '<line x1="6" y1="6" x2="18" y2="18"></line>' +
      '</svg>';

    header.append(drag, closeBtn);

    var stage = document.createElement('section');
    stage.id = 'lk-startup-stage-v2';
    stage.setAttribute('aria-label', 'DEVSTU đang khởi động');

    var logo = document.createElement('img');
    logo.className = 'lk-startup-logo-v2';
    logo.alt = 'DEVSTU';
    logo.src = new URL('lk-startup-logo-v2.png', assetBase).href;

    var tagline = document.createElement('h1');
    tagline.className = 'lk-startup-tagline-v2';
    tagline.textContent = 'DEVSTU - AI PHOTO RETOUCHING SUITE';

    var guide = document.createElement('img');
    guide.className = 'lk-startup-guide-v2';
    guide.alt = 'Tải ảnh chân dung · Xử lý AI tự động · Xuất ảnh đã chỉnh sửa';
    guide.src = new URL('lk-startup-guide-v2.png', assetBase).href;

    var row = document.createElement('div');
    row.className = 'lk-startup-status-row-v2';

    var statusEl = document.createElement('p');
    statusEl.className = 'lk-startup-status-v2';
    statusEl.textContent = 'Đang Khởi Động';
    statusEl.setAttribute('role', 'status');

    var percentEl = document.createElement('span');
    percentEl.className = 'lk-startup-percent-v2';
    percentEl.textContent = '0%';

    row.append(statusEl, percentEl);

    var track = document.createElement('div');
    track.className = 'lk-startup-track-v2';
    track.setAttribute('role', 'progressbar');
    track.setAttribute('aria-label', 'Tiến độ khởi động');
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', '100');
    track.setAttribute('aria-valuenow', '0');

    var fill = document.createElement('span');
    fill.className = 'lk-startup-fill-v2';
    track.appendChild(fill);

    var detailsBtn = document.createElement('button');
    detailsBtn.id = 'lk-startup-details-v2';
    detailsBtn.className = 'lk-startup-details-v2';
    detailsBtn.type = 'button';
    detailsBtn.textContent = 'Xem thông báo khởi động';

    stage.append(logo, tagline, guide, row, track, detailsBtn);

    var logPanel = document.createElement('div');
    logPanel.id = 'lk-startup-log-panel-v2';
    logPanel.className = 'lk-startup-log-panel-v2';

    var logHead = document.createElement('div');
    logHead.className = 'lk-startup-log-head-v2';

    var logTitle = document.createElement('h2');
    logTitle.className = 'lk-startup-log-title-v2';
    logTitle.textContent = 'Nhật ký khởi động DEVSTU';

    var logBackBtn = document.createElement('button');
    logBackBtn.className = 'lk-startup-log-back-v2';
    logBackBtn.type = 'button';
    logBackBtn.textContent = 'Quay lại';

    logHead.append(logTitle, logBackBtn);

    var logList = document.createElement('ul');
    logList.id = 'lk-startup-log-list-v2';
    logList.className = 'lk-startup-log-list-v2';

    logPanel.append(logHead, logList);
    shell.append(header, stage, logPanel);
    container.appendChild(shell);

    var dismissed = false;
    var rafId = 0;

    function addLog(msg) {
      var ts = new Date().toLocaleTimeString('vi-VN', { hour12: false });
      var line = '[' + ts + '] ' + msg;
      api.logs.push(line);
      var li = document.createElement('li');
      li.textContent = line;
      logList.appendChild(li);
      logList.scrollTop = logList.scrollHeight;
    }

    function setProgress(pct, phaseText) {
      var clamped = Math.max(api.percent, Math.min(100, Math.round(pct)));
      api.percent = clamped;
      fill.style.width = clamped + '%';
      percentEl.textContent = clamped + '%';
      track.setAttribute('aria-valuenow', String(clamped));
      if (phaseText) {
        statusEl.title = phaseText;
        track.setAttribute('aria-valuetext', phaseText + ' — ' + clamped + '%');
      }
    }

    function finishSplash(cancelled) {
      if (dismissed) return;
      dismissed = true;
      if (rafId) cancelAnimationFrame(rafId);

      var inTauriNow = Boolean(window.__TAURI_INTERNALS__ || window.__TAURI__);
      if (isStandalone && inTauriNow) {
        if (cancelled) {
          fetch('/api/app_exit', { method: 'POST' }).catch(function () {});
          tauriInvoke('exit_app').catch(function () {
            try { window.close(); } catch (_) {}
          });
        } else {
          api.done = true;
          fetch('/api/app_splash_done', { method: 'POST' }).catch(function () {});
          tauriInvoke('finish_splash').catch(function () {});
        }
        return;
      }

      api.done = true;
      try {
        window.dispatchEvent(new CustomEvent('devstu:splash-complete', { detail: { cancelled: !!cancelled } }));
      } catch (_) {}

      if (backdrop && backdrop.parentNode) {
        backdrop.classList.add('is-leaving');
        setTimeout(function () {
          if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
        }, 290);
      }
    }

    if (isStandalone) {
      shell.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        if (e.target.closest('button, a, .lk-startup-log-list-v2')) return;
        startWindowDrag();
      });
    }

    closeBtn.addEventListener('click', function () {
      finishSplash(true);
    });

    detailsBtn.addEventListener('click', function () {
      shell.classList.add('show-logs');
    });

    logBackBtn.addEventListener('click', function () {
      shell.classList.remove('show-logs');
    });

    // Warm up local backend & catalogs during splash without blocking 5s flow
    var warmupPromises = [
      fetch('/__api/v1/me', { cache: 'no-store' })
        .then(function (r) { addLog('Máy chủ nội bộ sẵn sàng (HTTP ' + r.status + ')'); })
        .catch(function () { addLog('Đang dùng cấu hình cục bộ'); }),
      fetch('/assets/lk_bg_info.json', { cache: 'force-cache' }).catch(function () {}),
      fetch('/assets/lk_ui_catalog.json', { cache: 'force-cache' }).catch(function () {})
    ];

    var milestones = [
      { at: 0, text: 'Khởi tạo ứng dụng DEVSTU...' },
      { at: 18, text: 'Kết nối máy chủ nội bộ & kiểm tra tài nguyên...' },
      { at: 42, text: 'Nạp danh mục màu sắc & preset chỉnh sửa...' },
      { at: 68, text: 'Chuẩn bị trình giải mã RAW, WebGL & AI Engine...' },
      { at: 90, text: 'Hoàn tất không gian làm việc...' }
    ];
    var milestoneIdx = 0;
    addLog(milestones[0].text);
    setProgress(0, milestones[0].text);

    var backendSettled = false;
    Promise.all(warmupPromises).then(function () {
      backendSettled = true;
    });

    var startTime = performance.now();
    function tick(now) {
      if (dismissed) return;
      var elapsed = now - startTime;
      var ratio = Math.min(1, elapsed / DURATION_MS);
      // Smooth ease-out while ensuring final 100% lands right at 5s + backend ready
      var eased = 1 - Math.pow(1 - ratio, 1.35);
      var pct = ratio < 1 ? Math.min(99, eased * 99) : 100;

      while (milestoneIdx + 1 < milestones.length && pct >= milestones[milestoneIdx + 1].at) {
        milestoneIdx++;
        addLog(milestones[milestoneIdx].text);
      }

      if (ratio >= 1 && (backendSettled || elapsed >= DURATION_MS + 1000)) {
        setProgress(100, 'Giao diện chính đã sẵn sàng');
        addLog('Giao diện chính đã sẵn sàng!');
        setTimeout(function () {
          finishSplash(false);
        }, 120);
        return;
      }

      setProgress(pct, milestones[milestoneIdx].text);
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
  }

  if (document.body) {
    mountSplash();
  } else {
    document.addEventListener('DOMContentLoaded', mountSplash, { once: true });
  }
})();
