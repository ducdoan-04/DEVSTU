pub mod lk_bridge;
pub mod retouch_engine;
mod server;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::OnceLock;
use tauri::{Emitter, Manager};

static SPLASH_FINISHED: AtomicBool = AtomicBool::new(false);
static APP_HANDLE: OnceLock<tauri::AppHandle> = OnceLock::new();

pub fn trigger_finish_splash() {
    if let Some(handle) = APP_HANDLE.get() {
        finish_splash_impl(handle);
    }
}

fn finish_splash_impl(app_handle: &tauri::AppHandle) {
    if SPLASH_FINISHED.swap(true, Ordering::SeqCst) {
        return;
    }
    if let Some(main_win) = app_handle.get_webview_window("main") {
        let _ = main_win.show();
        let _ = main_win.unminimize();
        let _ = main_win.set_focus();
        let _ = main_win.eval("window.dispatchEvent(new Event('resize'));");
    }
    if let Some(splash_win) = app_handle.get_webview_window("splash") {
        let _ = splash_win.destroy();
    }
}

#[tauri::command]
fn finish_splash(app_handle: tauri::AppHandle) {
    finish_splash_impl(&app_handle);
}

#[tauri::command]
fn exit_app(app_handle: tauri::AppHandle) {
    crate::lk_bridge::shutdown();
    app_handle.exit(0);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let base_dir = server::find_base_dir();
    let data_dir = lk_bridge::devstu_data_root(&base_dir);
    let webview_dir = data_dir.join("webview");
    let tmp_dir = data_dir.join("tmp");
    let _ = std::fs::create_dir_all(&webview_dir);
    let _ = std::fs::create_dir_all(&tmp_dir);
    unsafe {
        std::env::set_var("WEBVIEW2_USER_DATA_FOLDER", &webview_dir);
    }

    server::start_server(3000);

    tauri::Builder::default()
        .setup(|app| {
            let _ = APP_HANDLE.set(app.handle().clone());
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            let handle = app.handle().clone();
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_secs(9));
                if !SPLASH_FINISHED.load(Ordering::SeqCst) {
                    finish_splash_impl(&handle);
                }
            });
            Ok(())
        })
        .on_window_event(|window, event| {
            match event {
                tauri::WindowEvent::CloseRequested { api, .. } => {
                    if window.label() == "splash" {
                        if !SPLASH_FINISHED.load(Ordering::SeqCst) {
                            crate::lk_bridge::shutdown();
                            window.app_handle().exit(0);
                        }
                        return;
                    }
                    api.prevent_close();
                    if let Some(main_win) = window.app_handle().get_webview_window("main") {
                        let _ = main_win.eval("if (window.showDevstuExitConfirm) { window.showDevstuExitConfirm(); } else if (confirm('Bạn muốn thoát DEVSTU?')) { if (window.devstuExecuteExit) window.devstuExecuteExit(); else window.close(); }");
                    }
                    let _ = window.emit("devstu-exit-confirm", ());
                }
                tauri::WindowEvent::Destroyed => {
                    if window.label() == "main" {
                        crate::lk_bridge::shutdown();
                    }
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![exit_app, finish_splash])
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}
