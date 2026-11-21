// =========================================================================
// DEVSTU EXIT CONFIRMATION MODAL (PIXEL-PERFECT MATCHING USER DESIGN)
// =========================================================================
(function() {
  'use strict';

  var BADGE_DATA_URL = "data:image/png;base64,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";

  // Inject CSS styles
  var style = document.createElement('style');
  style.id = 'devstu-exit-confirm-styles';
  style.textContent = `
    .devstu-exit-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999999;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.18s ease-out, visibility 0.18s ease-out;
      user-select: none;
      -webkit-user-select: none;
    }

    .devstu-exit-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .devstu-exit-modal {
      width: 340px;
      max-width: calc(100vw - 32px);
      background: #292929;
      border-radius: 20px;
      box-shadow: 0 24px 50px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.08);
      padding: 34px 24px 26px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      transform: scale(0.92) translateY(8px);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .devstu-exit-overlay.active .devstu-exit-modal {
      transform: scale(1) translateY(0);
    }

    .devstu-exit-badge-wrap {
      width: 71px;
      height: 70px;
      border-radius: 18px;
      overflow: hidden;
      margin-bottom: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.45);
    }

    .devstu-exit-badge {
      width: 71px;
      height: 70px;
      display: block;
      object-fit: cover;
      pointer-events: none;
    }

    .devstu-exit-title {
      color: #f2f2f2;
      font-size: 17.5px;
      font-weight: 600;
      line-height: 1.35;
      text-align: center;
      margin: 0 0 24px 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      letter-spacing: -0.2px;
    }

    .devstu-exit-actions {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .devstu-btn-exit {
      width: 100%;
      height: 44px;
      background: #0ea5e9;
      color: #ffffff;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
      transition: background 0.15s ease, transform 0.05s ease, filter 0.15s ease;
      font-family: inherit;
    }

    .devstu-btn-exit:hover {
      background: #0284c7;
      filter: brightness(1.05);
    }

    .devstu-btn-exit:active {
      background: #0369a1;
      transform: scale(0.985);
    }

    .devstu-btn-cancel {
      width: 100%;
      height: 44px;
      background: #444444;
      color: #ffffff;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
      transition: background 0.15s ease, transform 0.05s ease;
      font-family: inherit;
    }

    .devstu-btn-cancel:hover {
      background: #505050;
    }

    .devstu-btn-cancel:active {
      background: #3a3a3a;
      transform: scale(0.985);
    }

    /* Titlebar Quick Exit Button */
    .stu-ultra-btn-exit,
    .devstu-top-exit-btn {
      height: 28px;
      width: 28px;
      min-width: 28px;
      padding: 0;
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 6px;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.15s ease;
      margin-left: 6px;
      font-size: 13px;
      font-weight: 500;
      flex-shrink: 0;
      box-sizing: border-box;
      z-index: 99;
    }

    .stu-ultra-btn-exit:hover,
    .devstu-top-exit-btn:hover {
      background: #ef4444 !important;
      border-color: #ef4444 !important;
      color: #ffffff !important;
      box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
    }
  `;
  document.head.appendChild(style);

  // Build Modal DOM
  var overlay = document.createElement('div');
  overlay.className = 'devstu-exit-overlay';
  overlay.id = 'devstu-exit-modal-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  overlay.innerHTML = `
    <div class="devstu-exit-modal" role="dialog" aria-modal="true" aria-labelledby="devstu-exit-title">
      <div class="devstu-exit-badge-wrap">
        <img src="${BADGE_DATA_URL}" alt="DEVSTU" class="devstu-exit-badge" width="71" height="70" />
      </div>
      <div class="devstu-exit-title" id="devstu-exit-title">Bạn muốn thoát DEVSTU?</div>
      <div class="devstu-exit-actions">
        <button type="button" class="devstu-btn-exit" id="devstu-btn-confirm-exit">Thoát ứng dụng</button>
        <button type="button" class="devstu-btn-cancel" id="devstu-btn-cancel-exit">Hủy bỏ</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  var btnConfirm = overlay.querySelector('#devstu-btn-confirm-exit');
  var btnCancel = overlay.querySelector('#devstu-btn-cancel-exit');
  var isExiting = false;

  function showExitConfirm() {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    if (btnConfirm) btnConfirm.focus();
  }

  function hideExitConfirm() {
    if (isExiting) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }

  async function executeAppExit() {
    if (isExiting) return;
    isExiting = true;
    if (btnConfirm) {
      btnConfirm.textContent = 'Đang thoát...';
      btnConfirm.style.opacity = '0.75';
      btnConfirm.style.pointerEvents = 'none';
    }
    if (btnCancel) {
      btnCancel.style.pointerEvents = 'none';
    }

    try {
      // 1. Send clean exit signal to backend
      fetch('/api/app_exit', { method: 'POST' }).catch(function() {});
    } catch (e) {}

    // 2. Invoke Tauri native exit if available
    setTimeout(function() {
      if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === 'function') {
        window.__TAURI__.core.invoke('exit_app').catch(function() {
          try { window.close(); } catch (e) {}
        });
      } else if (window.__TAURI__ && window.__TAURI__.process && typeof window.__TAURI__.process.exit === 'function') {
        window.__TAURI__.process.exit(0);
      } else {
        try {
          window.close();
        } catch (e) {}
      }
    }, 60);
  }

  // Event handlers
  if (btnConfirm) btnConfirm.addEventListener('click', executeAppExit);
  if (btnCancel) btnCancel.addEventListener('click', hideExitConfirm);

  // Click outside to cancel
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      hideExitConfirm();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', function(e) {
    if (overlay.classList.contains('active')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        hideExitConfirm();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeAppExit();
      }
      return;
    }

    // Hotkey: Ctrl+Q or Alt+F4
    if ((e.ctrlKey || e.metaKey) && (e.key === 'q' || e.key === 'Q')) {
      e.preventDefault();
      showExitConfirm();
    } else if (e.altKey && e.key === 'F4') {
      e.preventDefault();
      showExitConfirm();
    }
  });

  // Ensure Exit Button in Header
  function ensureTopExitButton() {
    try {
      var hdr = document.querySelector('header.hdr') || document.querySelector('.hdr');
      if (hdr && !document.getElementById('devstu-top-exit-btn')) {
        var btn = document.createElement('button');
        btn.id = 'devstu-top-exit-btn';
        btn.type = 'button';
        btn.className = 'devstu-top-exit-btn';
        btn.title = 'Thoát ứng dụng DEVSTU';
        btn.setAttribute('aria-label', 'Thoát ứng dụng DEVSTU');
        btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          showExitConfirm();
        });
        hdr.appendChild(btn);
      }
    } catch (_) {}
  }

  // Periodic check to ensure button persists
  setInterval(ensureTopExitButton, 500);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureTopExitButton);
  } else {
    ensureTopExitButton();
  }

  // Hook into any existing exit triggers
  document.addEventListener('click', function(e) {
    var exitTrig = e.target.closest('#stu-ultra-btn-exit, .stu-ultra-btn-exit, #devstu-top-exit-btn, [data-action="exit-app"]');
    if (exitTrig) {
      e.preventDefault();
      e.stopPropagation();
      showExitConfirm();
    }
  }, true);

  // Expose to window for Tauri CloseRequested & UI triggers
  window.showDevstuExitConfirm = showExitConfirm;
  window.hideDevstuExitConfirm = hideExitConfirm;
  window.devstuExecuteExit = executeAppExit;

  // Listen for native Tauri close request
  if (window.__TAURI__?.event?.listen) {
    try {
      window.__TAURI__.event.listen('devstu-exit-confirm', function() {
        showExitConfirm();
      });
    } catch (_) {}
  }

  window.addEventListener('message', function(e) {
    if (e.data === 'devstu-exit-confirm' || e.data?.type === 'devstu-exit-confirm') {
      showExitConfirm();
    }
  });

  console.log('[DEVSTU] Exit confirmation module loaded successfully ✓');
})();
