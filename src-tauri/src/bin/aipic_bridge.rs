use base64::engine::general_purpose::STANDARD as BASE64;
use base64::Engine;
use serde_json::{json, Value};
use std::collections::{HashMap, HashSet};
use std::ffi::{CStr, CString};
use std::io::{BufRead, BufReader, Read, Write};
use std::net::TcpListener;
use std::os::raw::{c_char, c_int, c_longlong, c_void};
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, AtomicI32, AtomicI64, AtomicU64, Ordering};
use std::sync::{mpsc, Mutex, OnceLock};
use std::time::{Duration, Instant};

#[link(name = "kernel32")]
unsafe extern "system" {
    fn LoadLibraryW(lpLibFileName: *const u16) -> *mut c_void;
    fn GetProcAddress(hModule: *mut c_void, lpProcName: *const c_char) -> *mut c_void;
    fn SetDllDirectoryW(lpPathName: *const u16) -> c_int;
    fn SetCurrentDirectoryW(lpPathName: *const u16) -> c_int;
    fn GetModuleHandleW(lpModuleName: *const u16) -> *mut c_void;
    fn VirtualProtect(
        lpAddress: *mut c_void,
        dwSize: usize,
        flNewProtect: u32,
        lpflOldProtect: *mut u32,
    ) -> c_int;
    fn GetCurrentProcess() -> *mut c_void;
    fn K32EnumProcessModules(
        hProcess: *mut c_void,
        lphModule: *mut *mut c_void,
        cb: u32,
        lpcbNeeded: *mut u32,
    ) -> c_int;
}

#[link(name = "ole32")]
unsafe extern "system" {
    fn CoTaskMemAlloc(cb: usize) -> *mut c_void;
}

#[link(name = "user32")]
unsafe extern "system" {
    fn CreateWindowExW(
        dwExStyle: u32,
        lpClassName: *const u16,
        lpWindowName: *const u16,
        dwStyle: u32,
        x: c_int,
        y: c_int,
        nWidth: c_int,
        nHeight: c_int,
        hWndParent: *mut c_void,
        hMenu: *mut c_void,
        hInstance: *mut c_void,
        lpParam: *mut c_void,
    ) -> *mut c_void;
    fn PeekMessageW(
        lpMsg: *mut [u8; 48],
        hWnd: *mut c_void,
        wMin: u32,
        wMax: u32,
        wRemove: u32,
    ) -> c_int;
    fn TranslateMessage(lpMsg: *const [u8; 48]) -> c_int;
    fn DispatchMessageW(lpMsg: *const [u8; 48]) -> isize;
}

static MODEL_READY: AtomicBool = AtomicBool::new(false);
static WS_ID: AtomicI64 = AtomicI64::new(-1);
static WS_DONE: AtomicBool = AtomicBool::new(false);
static BATCH_DONE: AtomicBool = AtomicBool::new(false);
static BATCH_FID: AtomicI32 = AtomicI32::new(-1);
static RETOUCH_DONE: AtomicBool = AtomicBool::new(false);
static UNI_DONE: AtomicBool = AtomicBool::new(false);
static GET_IMAGE_DONE: AtomicBool = AtomicBool::new(false);
static GENERIC_DONE: AtomicBool = AtomicBool::new(false);
static EXPORT_DONE: AtomicBool = AtomicBool::new(false);
static EXPORT_ID: AtomicI32 = AtomicI32::new(0);
static PRESET_DONE: AtomicBool = AtomicBool::new(false);
static WRITE_DONE: AtomicBool = AtomicBool::new(false);
static WRITE_ERR: AtomicI32 = AtomicI32::new(0);
static SEQ_COUNTER: AtomicU64 = AtomicU64::new(1);
static THUMB_SEQ: AtomicU64 = AtomicU64::new(0);
static SWITCH_PARAM_DONE: AtomicBool = AtomicBool::new(false);

static READY_FIDS: OnceLock<Mutex<HashSet<i32>>> = OnceLock::new();
static FRAME_RECT: OnceLock<Mutex<(f64, f64, f64, f64)>> = OnceLock::new();
static LAST_THUMB: OnceLock<Mutex<String>> = OnceLock::new();
static LAST_HIST: OnceLock<Mutex<String>> = OnceLock::new();
static LAST_WB: OnceLock<Mutex<String>> = OnceLock::new();
static LAST_UNI: OnceLock<Mutex<String>> = OnceLock::new();
static GET_IMAGE_JSON: OnceLock<Mutex<String>> = OnceLock::new();
static LAST_SWITCH_PARAM: OnceLock<Mutex<String>> = OnceLock::new();
static BG_INFO_JSON: OnceLock<Mutex<String>> = OnceLock::new();
static MATERIAL_2_JSON: OnceLock<Mutex<String>> = OnceLock::new();
static GENERIC_JSON: OnceLock<Mutex<String>> = OnceLock::new();
static PRESET_JSON: OnceLock<Mutex<String>> = OnceLock::new();
static EXPORT_EVENT_JSON: OnceLock<Mutex<String>> = OnceLock::new();
static ASYNC_EVENTS: OnceLock<Mutex<Vec<Value>>> = OnceLock::new();
static VERBOSE: AtomicBool = AtomicBool::new(false);

fn ready_fids() -> &'static Mutex<HashSet<i32>> {
    READY_FIDS.get_or_init(|| Mutex::new(HashSet::new()))
}
fn frame_rect() -> &'static Mutex<(f64, f64, f64, f64)> {
    FRAME_RECT.get_or_init(|| Mutex::new((200.0, 150.0, 800.0, 700.0)))
}
fn last_thumb() -> &'static Mutex<String> {
    LAST_THUMB.get_or_init(|| Mutex::new(String::new()))
}
fn last_hist() -> &'static Mutex<String> {
    LAST_HIST.get_or_init(|| Mutex::new(String::new()))
}
fn last_wb() -> &'static Mutex<String> {
    LAST_WB.get_or_init(|| Mutex::new(String::new()))
}
fn last_uni() -> &'static Mutex<String> {
    LAST_UNI.get_or_init(|| Mutex::new(String::new()))
}
fn get_image_json() -> &'static Mutex<String> {
    GET_IMAGE_JSON.get_or_init(|| Mutex::new(String::new()))
}
fn last_switch_param() -> &'static Mutex<String> {
    LAST_SWITCH_PARAM.get_or_init(|| Mutex::new(String::new()))
}
fn bg_info_json() -> &'static Mutex<String> {
    BG_INFO_JSON.get_or_init(|| Mutex::new(String::new()))
}
fn material_2_json() -> &'static Mutex<String> {
    MATERIAL_2_JSON.get_or_init(|| Mutex::new(String::new()))
}
fn generic_json() -> &'static Mutex<String> {
    GENERIC_JSON.get_or_init(|| Mutex::new(String::new()))
}
fn preset_json() -> &'static Mutex<String> {
    PRESET_JSON.get_or_init(|| Mutex::new(String::new()))
}
fn export_event_json() -> &'static Mutex<String> {
    EXPORT_EVENT_JSON.get_or_init(|| Mutex::new(String::new()))
}
fn async_events() -> &'static Mutex<Vec<Value>> {
    ASYNC_EVENTS.get_or_init(|| Mutex::new(Vec::new()))
}

fn to_wide(s: &str) -> Vec<u16> {
    s.encode_utf16().chain(std::iter::once(0)).collect()
}

unsafe fn cstr(p: *const c_char) -> String {
    if p.is_null() {
        String::new()
    } else {
        unsafe { CStr::from_ptr(p) }.to_string_lossy().into_owned()
    }
}

fn cstring_safe(s: &str) -> Result<CString, String> {
    CString::new(s).map_err(|e| format!("NUL byte in string: {e}"))
}

fn extract_all_ints_after(hay: &str, key: &str) -> Vec<i32> {
    let mut out = Vec::new();
    let mut rest = hay;
    while let Some(pos) = rest.find(key) {
        let after = &rest[pos + key.len()..];
        let trimmed = after.trim_start_matches(|c: char| c == ' ' || c == ':' || c == '"');
        let digits: String = trimmed
            .chars()
            .take_while(|c| c.is_ascii_digit() || *c == '-')
            .collect();
        if let Ok(v) = digits.parse::<i32>() {
            out.push(v);
        }
        rest = &rest[pos + key.len()..];
    }
    out
}

fn extract_f64_key(hay: &str, key: &str) -> Option<f64> {
    let pos = hay.find(key)?;
    let after = hay[pos + key.len()..].trim_start_matches(|c: char| c == ' ' || c == ':' || c == '"');
    let s: String = after
        .chars()
        .take_while(|c| c.is_ascii_digit() || *c == '.' || *c == '-')
        .collect();
    s.parse::<f64>().ok()
}

fn pump_messages_once() {
    let mut msg = [0u8; 48];
    unsafe {
        while PeekMessageW(&mut msg, std::ptr::null_mut(), 0, 0, 1) != 0 {
            TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }
    }
}

fn pump_until(secs: f64, done: Option<&AtomicBool>, wait_fid: Option<i32>) -> bool {
    let start = Instant::now();
    loop {
        pump_messages_once();
        if let Some(d) = done {
            if d.load(Ordering::SeqCst) {
                return true;
            }
        }
        if let Some(fid) = wait_fid {
            if let Ok(g) = ready_fids().lock() {
                if g.contains(&fid) {
                    return true;
                }
            }
        }
        if start.elapsed().as_secs_f64() >= secs {
            return false;
        }
        std::thread::sleep(Duration::from_millis(15));
    }
}

fn emit_response(val: &Value) {
    if let Ok(line) = serde_json::to_string(val) {
        let mut out = std::io::stdout().lock();
        let _ = writeln!(out, "@BRIDGE_RESP@ {}", line);
        let _ = out.flush();
    }
}

// --- C Callbacks registered with aipic.dll ---

unsafe extern "C" fn log_cb(level: c_int, msg: *const c_char) {
    if VERBOSE.load(Ordering::Relaxed) {
        let s = unsafe { cstr(msg) };
        let clean: String = s.chars().filter(|c| c.is_ascii()).take(220).collect();
        if !clean.is_empty() {
            eprintln!("[AIPIC L{}] {}", level, clean);
        }
    }
}

unsafe extern "C" fn event_cb(ev: c_int, data: *const c_char, _len: c_int) {
    let s = unsafe { cstr(data) };
    if VERBOSE.load(Ordering::Relaxed) {
        let clean: String = s.chars().filter(|c| c.is_ascii()).take(220).collect();
        eprintln!("[EV {}] {}", ev, clean);
    }
    match ev {
        5000 => {
            if s.contains("\"progress\":\"100\"") || s.contains("\"progress\":100") {
                MODEL_READY.store(true, Ordering::SeqCst);
            }
        }
        18001 => {
            for fid in extract_all_ints_after(&s, "\"fileid\":") {
                if fid > 0 {
                    if let Ok(mut set) = ready_fids().lock() {
                        set.insert(fid);
                    }
                }
            }
        }
        2001 => {
            if let (Some(x), Some(y), Some(w), Some(h)) = (
                extract_f64_key(&s, "\"x\":"),
                extract_f64_key(&s, "\"y\":"),
                extract_f64_key(&s, "\"width\":"),
                extract_f64_key(&s, "\"height\":"),
            ) {
                if w > 10.0 && h > 10.0 {
                    if let Ok(mut fr) = frame_rect().lock() {
                        *fr = (x, y, w, h);
                    }
                }
            }
        }
        10001 => {
            if let Ok(mut h) = last_hist().lock() {
                *h = s;
            }
        }
        5 => {
            if let Ok(mut e) = export_event_json().lock() {
                *e = s.clone();
            }
            if s.contains("\"task_progress\":\"1\"")
                || s.contains("\"task_progress\":1")
                || s.contains("\"status\":\"3\"")
                || s.contains("\"status\":3")
                || s.contains("\"status\":\"4\"")
                || s.contains("\"status\":4")
            {
                EXPORT_DONE.store(true, Ordering::SeqCst);
            }
        }
        16000 | 16001 | 16002 => {
            if let Ok(mut q) = async_events().lock() {
                if q.len() > 64 {
                    q.remove(0);
                }
                q.push(json!({ "event": ev, "data": s }));
            }
        }
        _ => {}
    }
}

unsafe extern "C" fn on_wm(_cookie: c_longlong, _err: c_int) -> c_int {
    0
}

unsafe extern "C" fn on_ws(_cookie: c_longlong, _err: c_int, id: c_longlong) {
    WS_ID.store(id, Ordering::SeqCst);
    WS_DONE.store(true, Ordering::SeqCst);
}

unsafe extern "C" fn on_batch(_cookie: c_longlong, _err: c_int, items: *const c_char) {
    let s = unsafe { cstr(items) };
    let unescaped = s.replace("\\\"", "\"");
    let mut fids = extract_all_ints_after(&unescaped, "\"fileid\":");
    if fids.is_empty() {
        fids = extract_all_ints_after(&unescaped, "\"id\":");
    }
    if let Some(&first) = fids.first() {
        BATCH_FID.store(first, Ordering::SeqCst);
    }
    BATCH_DONE.store(true, Ordering::SeqCst);
}

unsafe extern "C" fn on_hist(_fid: c_int, _err: c_int, hist: *const c_char) {
    let s = unsafe { cstr(hist) };
    if !s.is_empty() {
        if let Ok(mut h) = last_hist().lock() {
            *h = s;
        }
    }
}

unsafe extern "C" fn on_thumb(_fid: c_int, _err: c_int, thumb: *const c_char) {
    let s = unsafe { cstr(thumb) };
    if VERBOSE.load(Ordering::Relaxed) {
        eprintln!("[THUMB fid={} err={} len={}]", _fid, _err, s.len());
    }
    if !s.is_empty() {
        if let Ok(mut t) = last_thumb().lock() {
            *t = s;
        }
        THUMB_SEQ.fetch_add(1, Ordering::SeqCst);
    }
    RETOUCH_DONE.store(true, Ordering::SeqCst);
}

unsafe extern "C" fn on_switch_param(_fid: c_int, _err: c_int, p: *const c_char) {
    let s = unsafe { cstr(p) };
    if VERBOSE.load(Ordering::Relaxed) {
        let clean: String = s.chars().filter(|c| c.is_ascii()).take(180).collect();
        eprintln!("[SWITCH_PARAM fid={} err={}] {}", _fid, _err, clean);
    }
    if let Ok(mut sp) = last_switch_param().lock() {
        *sp = s;
    }
    SWITCH_PARAM_DONE.store(true, Ordering::SeqCst);
}

unsafe extern "C" fn on_wb(_a: c_longlong, _b: c_int, p: *const c_char) {
    let s = unsafe { cstr(p) };
    if let Ok(mut w) = last_wb().lock() {
        *w = s;
    }
}

unsafe extern "C" fn on_uni(err: c_int, p: *const c_char) {
    let s = unsafe { cstr(p) };
    if VERBOSE.load(Ordering::Relaxed) {
        let clean: String = s.chars().filter(|c| c.is_ascii()).take(220).collect();
        eprintln!("[UNI err={}] {}", err, clean);
    }
    if let Ok(mut u) = last_uni().lock() {
        *u = s;
    }
    UNI_DONE.store(true, Ordering::SeqCst);
}

unsafe extern "C" fn on_get_image(p: *const c_char) {
    let s = unsafe { cstr(p) };
    if VERBOSE.load(Ordering::Relaxed) {
        let clean: String = s.chars().filter(|c| c.is_ascii()).take(220).collect();
        eprintln!("[GET_IMAGE] {}", clean);
    }
    if let Ok(mut g) = get_image_json().lock() {
        *g = s;
    }
    GET_IMAGE_DONE.store(true, Ordering::SeqCst);
}

unsafe extern "C" fn on_detect(_err: c_int, _fid: c_int, p: *const c_char) {
    let s = unsafe { cstr(p) };
    if let Ok(mut g) = generic_json().lock() {
        *g = s;
    }
    GENERIC_DONE.store(true, Ordering::SeqCst);
}

unsafe extern "C" fn on_bg_info(_err: c_int, p: *const c_char) {
    let s = unsafe { cstr(p) };
    if let Ok(mut b) = bg_info_json().lock() {
        *b = s;
    }
    GENERIC_DONE.store(true, Ordering::SeqCst);
}

unsafe extern "C" fn on_material_info(_err: c_int, p: *const c_char) {
    let s = unsafe { cstr(p) };
    if let Ok(mut m) = material_2_json().lock() {
        *m = s;
    }
    GENERIC_DONE.store(true, Ordering::SeqCst);
}

unsafe extern "C" fn on_str_2(err: c_int, p: *const c_char) {
    let s = unsafe { cstr(p) };
    if VERBOSE.load(Ordering::Relaxed) {
        let clean: String = s.chars().filter(|c| c.is_ascii()).take(220).collect();
        eprintln!("[STR2 err={}] {}", err, clean);
    }
    if let Ok(mut g) = generic_json().lock() {
        *g = s;
    }
    GENERIC_DONE.store(true, Ordering::SeqCst);
}

unsafe extern "C" fn on_str_1(p: *const c_char) {
    let s = unsafe { cstr(p) };
    if VERBOSE.load(Ordering::Relaxed) {
        let clean: String = s.chars().filter(|c| c.is_ascii()).take(220).collect();
        eprintln!("[STR1] {}", clean);
    }
    if let Ok(mut g) = generic_json().lock() {
        *g = s;
    }
    GENERIC_DONE.store(true, Ordering::SeqCst);
}

unsafe extern "C" fn on_preset_get(_cookie: c_longlong, _err: c_int, items: *const c_char) {
    let s = unsafe { cstr(items) };
    if let Ok(mut p) = preset_json().lock() {
        *p = s;
    }
    PRESET_DONE.store(true, Ordering::SeqCst);
}

unsafe extern "C" fn on_write_item(_cookie: c_longlong, err: c_int) {
    WRITE_ERR.store(err, Ordering::SeqCst);
    WRITE_DONE.store(true, Ordering::SeqCst);
}

unsafe extern "C" fn on_export(_err: c_int, id: c_int) {
    EXPORT_ID.store(id, Ordering::SeqCst);
}

unsafe extern "C" fn on_op_apply(op: *const c_char, err: c_int) {
    let s = unsafe { cstr(op) };
    if let Ok(mut g) = generic_json().lock() {
        *g = json!({ "err": err, "operation": s }).to_string();
    }
    RETOUCH_DONE.store(true, Ordering::SeqCst);
}

// --- Offline Local Proxy HTTP Mock Server (port 8316) ---

const DUMMY_PNG_B64: &str = "iVBORw0KGgoAAAANSUhEUgAAAVAAAAFQCAYAAADp6CbZAAABzUlEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgM4N5aoAAfjHCH4AAAAASUVORK5CYII=";

fn start_mock_http() {
    let listener = match TcpListener::bind("127.0.0.1:8316") {
        Ok(l) => l,
        Err(e) => {
            eprintln!("[aipic_bridge] 127.0.0.1:8316 bind skipped ({e})");
            return;
        }
    };
    std::thread::spawn(move || {
        let png_bytes = BASE64.decode(DUMMY_PNG_B64).unwrap_or_default();
        let ticket_conf = r#"{"errno":0,"msg":"success","data":{"is_free":1,"free":1,"algorithms":[{"id":170001,"name":"sample_color","free_num":999999,"valid_end_time":1999999999},{"id":220073,"name":"intelligent_tone","free_num":999999,"valid_end_time":1999999999},{"id":220074,"name":"white_balance","free_num":999999,"valid_end_time":1999999999},{"id":630001,"name":"change_sky","free_num":999999,"valid_end_time":1999999999}]}}"#;
        let ticket_info = r#"{"errno":0,"msg":"success","data":{"total_ticket":999999,"remain_ticket":999999,"ticket_num":999999,"voucher_count":999999,"used_ticket":0,"is_vip":1,"is_svip":1,"vip_status":1,"vip_type":2,"vip_end_time":1999999999,"watermark":"http://127.0.0.1:8316/transparent_watermark.png","list":[{"ticket_id":1,"total_num":999999,"remain_num":999999,"expire_time":1999999999}]}}"#;
        let ticket_deduct = r#"{"errno":0,"msg":"success","data":{"remain_ticket":999999,"ticket_num":999999,"deduct_success":1,"deduct_num":0,"order_id":"offline-export-001"}}"#;
        let account_info = r#"{"errno":0,"msg":"success","data":{"uk":"100000001","username":"DEVSTU","nickname":"DEVSTU","vip_type":2,"is_vip":1,"is_svip":1,"vip_level":5,"vip_end_time":1999999999,"quota":10995116277760,"used":0,"remain_ticket":999999,"has_new":0,"is_ban":0,"watermark":"http://127.0.0.1:8316/transparent_watermark.png"}}"#;
        let auth_ok = r#"{"errno":0,"msg":"success","data":{"authorized":1,"is_authorized":1,"is_auth":1,"status":1,"vip":1,"is_vip":1,"is_svip":1,"remain_ticket":999999,"has_new":0,"is_ban":0,"expire_time":1999999999,"watermark":"http://127.0.0.1:8316/transparent_watermark.png"}}"#;
        let syscfg = r#"{"errno":0,"msg":"success","data":{"cfg":{"free_export":1,"enable_export":1,"max_export_size":0,"online_mode":0}}}"#;
        let detect_base = format!(
            r#"{{"code":0,"errno":0,"msg":"success","data":{{"code":0,"errno":0,"image_base64":"{}","result_type":"json","result_json":"{{\"face_count\":0,\"faces\":[],\"person_count\":0,\"persons\":[]}}","json":"{{\"face_count\":0,\"faces\":[],\"person_count\":0,\"persons\":[]}}"}}}}"#,
            DUMMY_PNG_B64
        );
        let cloud_ok = format!(
            r#"{{"code":0,"errno":0,"msg":"success","task_id":"offline-task-fixed-001","status":"success","progress":100,"data":{{"code":0,"errno":0,"completed":true,"status":2,"progress":100,"task_id":"offline-task-fixed-001","records":[{{"record_id":"1","status":2,"progress":100,"task_status":"SUCCESS"}}],"image_base64":"{}","result_url":"","result_type":"json","result_json":"{{\"face_count\":0,\"faces\":[],\"person_count\":0,\"persons\":[]}}","json":"{{\"face_count\":0,\"faces\":[],\"person_count\":0,\"persons\":[]}}"}}}}"#,
            DUMMY_PNG_B64
        );

        for stream in listener.incoming().flatten() {
            let mut s = stream;
            let _ = s.set_read_timeout(Some(Duration::from_millis(800)));
            let mut raw = Vec::with_capacity(4096);
            let mut buf = [0u8; 4096];
            let mut header_end = None;
            let mut content_len = 0usize;
            while raw.len() < 1024 * 1024 {
                match s.read(&mut buf) {
                    Ok(0) | Err(_) => break,
                    Ok(n) => {
                        raw.extend_from_slice(&buf[..n]);
                        if header_end.is_none() {
                            if let Some(pos) = raw.windows(4).position(|w| w == b"\r\n\r\n") {
                                header_end = Some(pos + 4);
                                let hdr_str = String::from_utf8_lossy(&raw[..pos + 4]).to_lowercase();
                                for line in hdr_str.lines() {
                                    if let Some(v) = line.strip_prefix("content-length:") {
                                        content_len = v.trim().parse().unwrap_or(0);
                                    }
                                }
                            }
                        }
                        if let Some(he) = header_end {
                            if raw.len() >= he + content_len {
                                break;
                            }
                        }
                    }
                }
            }
            let first = String::from_utf8_lossy(&raw)
                .lines()
                .next()
                .unwrap_or("")
                .to_string();
            let path = first.split_whitespace().nth(1).unwrap_or("/");
            let (ctype, body): (&str, Vec<u8>) = if path.contains("watermark") || path.contains("transparent") {
                ("image/png", png_bytes.clone())
            } else if path.contains("freeAlgorithm") || path.contains("free_algorithm") {
                ("application/json", ticket_conf.as_bytes().to_vec())
            } else if path.contains("/ticket/deduct") || path.contains("/ticket/confirm") || path.contains("/ticket/prededuct") {
                ("application/json", ticket_deduct.as_bytes().to_vec())
            } else if path.contains("/ticket/") {
                ("application/json", ticket_info.as_bytes().to_vec())
            } else if path.contains("/account/uinfo") || path.contains("/api/quota") || path.contains("/user/info") || path.contains("/loginstatus") {
                ("application/json", account_info.as_bytes().to_vec())
            } else if path.contains("/authorized/") || path.contains("/customization/") {
                ("application/json", auth_ok.as_bytes().to_vec())
            } else if path.contains("/getsyscfg") {
                ("application/json", syscfg.as_bytes().to_vec())
            } else if path.contains("/detect/base") || path.contains("cloudoperator/detect") {
                ("application/json", detect_base.as_bytes().to_vec())
            } else if path.contains("cloudoperator") {
                ("application/json", cloud_ok.as_bytes().to_vec())
            } else {
                ("application/json", r#"{"code":0,"errno":0,"msg":"success","data":{"is_vip":1,"is_svip":1,"remain_ticket":999999,"watermark":"http://127.0.0.1:8316/transparent_watermark.png"}}"#.as_bytes().to_vec())
            };
            let hdr = format!(
                "HTTP/1.1 200 OK\r\nContent-Type: {}\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
                ctype,
                body.len()
            );
            let _ = s.write_all(hdr.as_bytes());
            let _ = s.write_all(&body);
            let _ = s.flush();
        }
    });
}

// --- Dynamic DLL Handle & Typed Function Pointers ---

#[allow(dead_code)]
struct AipicApi {
    aipic_set_config: unsafe extern "C" fn(c_int, *const c_char) -> *const c_char,
    aipic_global_init: unsafe extern "C" fn(
        unsafe extern "C" fn(c_int, *const c_char),
        unsafe extern "C" fn(c_int, *const c_char, c_int),
        *const c_char,
        *const c_char,
        c_int,
        *const c_char,
    ) -> c_int,
    aipic_set_login_state: unsafe extern "C" fn(*const c_char) -> c_int,
    aipic_set_retouched_thumbnail_watermark: unsafe extern "C" fn(*const c_char, *const c_void) -> c_int,
    aipic_get_image_backgroud_info: unsafe extern "C" fn(*const c_void) -> c_int,
    aipic_get_material_info: Option<unsafe extern "C" fn(c_int, *const c_void) -> c_int>,
    aipic_window_event: unsafe extern "C" fn(*mut c_longlong, c_int, *const c_char) -> c_int,
    aipic_get_workspace_item: Option<unsafe extern "C" fn(c_int, *mut c_longlong, c_int, bool, *const c_void) -> c_int>,
    aipic_insert_workspace_item: unsafe extern "C" fn(c_int, *mut c_longlong, *const c_char, *const c_void) -> c_int,
    aipic_delete_workspace_item: Option<unsafe extern "C" fn(c_int, *mut c_longlong, *const c_char, *const c_void) -> c_int>,
    aipic_batch_insert_filelist_item: unsafe extern "C" fn(c_int, *mut c_longlong, *const c_char, c_int, c_int, bool, *const c_void) -> c_int,
    aipic_retouch_switch_image: unsafe extern "C" fn(*mut c_longlong, c_int, c_int, *const c_void, *const c_void, *const c_void) -> c_int,
    aipic_get_some_dectect_info: unsafe extern "C" fn(c_int, c_int, *const c_char, c_int, *mut c_longlong, *const c_void) -> c_int,
    aipic_retouch_image: unsafe extern "C" fn(c_int, *const c_char, c_int, bool, bool, bool, bool, *const c_void, *const c_void, *const c_void, *const c_void, c_int) -> c_int,
    aipic_retouch_operation: Option<unsafe extern "C" fn(c_int, c_int, *const c_void, *const c_void, *const c_void) -> c_int>,
    aipic_liquid_begin: unsafe extern "C" fn(c_int, *const c_void) -> c_int,
    aipic_liquid_confirm: unsafe extern "C" fn(c_int, *const c_void) -> c_int,
    aipic_liquid_cancel: Option<unsafe extern "C" fn(c_int, *const c_void) -> c_int>,
    aipic_liquid_history: Option<unsafe extern "C" fn(*const c_char) -> c_int>,
    aipic_set_reference_by_aisimulation: unsafe extern "C" fn(*const c_char, *const c_void),
    aipic_save_image: Option<unsafe extern "C" fn(*const c_char, *const c_char, c_int, *const c_void) -> c_int>,
    aipic_update_reference_view: Option<unsafe extern "C" fn(*const c_char, *const c_void) -> c_int>,
    aipic_get_image: unsafe extern "C" fn(*const c_char, *const c_void) -> c_int,
    get_file_curve_data: Option<unsafe extern "C" fn(*const c_char, *const c_void) -> c_int>,
    get_file_histogram_data: Option<unsafe extern "C" fn(c_int, *const c_void) -> c_int>,
    aipic_build_export_task: unsafe extern "C" fn(c_int, c_int, *const c_char, *const c_char, *const c_void) -> c_int,
    aipic_get_preset_group_item: Option<unsafe extern "C" fn(*mut c_longlong, c_int, bool, *const c_void) -> c_int>,
    aipic_get_preset_group_item_by_id: Option<unsafe extern "C" fn(*mut c_longlong, c_int, *const c_void) -> c_int>,
    aipic_insert_preset_group_item: Option<unsafe extern "C" fn(*mut c_longlong, *const c_char, *const c_void) -> c_int>,
    aipic_modify_preset_group_item: Option<unsafe extern "C" fn(*mut c_longlong, *const c_char, *const c_void) -> c_int>,
    aipic_delete_preset_group_item: Option<unsafe extern "C" fn(*mut c_longlong, c_int, *const c_void) -> c_int>,
    aipic_insert_preset_item: Option<unsafe extern "C" fn(*mut c_longlong, *const c_char, *const c_void) -> c_int>,
    aipic_modify_preset_item: Option<unsafe extern "C" fn(*mut c_longlong, *const c_char, *const c_void) -> c_int>,
    aipic_delete_preset_item: Option<unsafe extern "C" fn(*mut c_longlong, c_int, *const c_void) -> c_int>,
    aipic_camera_connect: Option<unsafe extern "C" fn(*const c_char) -> c_int>,
    aipic_camera_disconnect: Option<unsafe extern "C" fn(*const c_char) -> c_int>,
    aipic_online_shooting_setting: Option<unsafe extern "C" fn(*const c_char, *const c_char) -> c_int>,
    aipic_set_setting: Option<unsafe extern "C" fn(bool, *const c_char, *const c_char, *const c_char) -> c_int>,
}

fn find_lk_root() -> Result<PathBuf, String> {
    let mut candidates: Vec<PathBuf> = Vec::new();
    if let Ok(env_dir) = std::env::var("DEVSTU_LK_ROOT") {
        if !env_dir.trim().is_empty() {
            candidates.push(PathBuf::from(env_dir));
        }
    }
    if let Ok(cwd) = std::env::current_dir() {
        candidates.push(cwd.join("lk_runtime"));
        candidates.push(cwd);
    }
    if let Ok(exe) = std::env::current_exe() {
        if let Some(dir) = exe.parent() {
            candidates.push(dir.join("lk_runtime"));
            candidates.push(dir.join("resources").join("lk_runtime"));
            candidates.push(dir.to_path_buf());
            for anc in dir.ancestors().skip(1).take(4) {
                candidates.push(anc.join("lk_runtime"));
            }
        }
    }
    for c in candidates {
        if c.join("aipic.dll").is_file() {
            return Ok(c);
        }
    }
    Err("Khong tim thay aipic.dll trong thu muc lk_runtime".to_string())
}

#[repr(C)]
#[derive(Clone, Copy, PartialEq, Eq)]
struct Guid {
    data1: u32,
    data2: u16,
    data3: u16,
    data4: [u8; 8],
}

// {F1B32785-6FBA-4FCF-9D55-7B8E7F157091}
const FOLDERID_LOCAL_APPDATA: Guid = Guid {
    data1: 0xF1B32785,
    data2: 0x6FBA,
    data3: 0x4FCF,
    data4: [0x9D, 0x55, 0x7B, 0x8E, 0x7F, 0x15, 0x70, 0x91],
};
const CSIDL_LOCAL_APPDATA: c_int = 0x001c;

static HOOK_LOCALAPPDATA_W: OnceLock<Vec<u16>> = OnceLock::new();
static HOOK_LOCALAPPDATA_A: OnceLock<Vec<u8>> = OnceLock::new();
static ORIG_SH_KNOWN: std::sync::atomic::AtomicUsize = std::sync::atomic::AtomicUsize::new(0);
static ORIG_SH_FOLDER_W: std::sync::atomic::AtomicUsize = std::sync::atomic::AtomicUsize::new(0);
static ORIG_SH_FOLDER_A: std::sync::atomic::AtomicUsize = std::sync::atomic::AtomicUsize::new(0);
static ORIG_SH_SPECIAL_W: std::sync::atomic::AtomicUsize = std::sync::atomic::AtomicUsize::new(0);

unsafe extern "system" fn hook_sh_get_known_folder_path(
    rfid: *const Guid,
    dw_flags: u32,
    h_token: *mut c_void,
    ppsz_path: *mut *mut u16,
) -> i32 {
    if !rfid.is_null() && !ppsz_path.is_null() && unsafe { *rfid } == FOLDERID_LOCAL_APPDATA {
        if let Some(w) = HOOK_LOCALAPPDATA_W.get() {
            let bytes = w.len() * 2;
            let mem = unsafe { CoTaskMemAlloc(bytes) } as *mut u16;
            if !mem.is_null() {
                unsafe { std::ptr::copy_nonoverlapping(w.as_ptr(), mem, w.len()) };
                unsafe { *ppsz_path = mem };
                return 0;
            }
        }
    }
    let orig = ORIG_SH_KNOWN.load(Ordering::Acquire);
    if orig != 0 {
        let f: unsafe extern "system" fn(*const Guid, u32, *mut c_void, *mut *mut u16) -> i32 =
            unsafe { std::mem::transmute(orig) };
        return unsafe { f(rfid, dw_flags, h_token, ppsz_path) };
    }
    -2147467259i32 // E_FAIL
}

unsafe extern "system" fn hook_sh_get_folder_path_w(
    hwnd: *mut c_void,
    csidl: c_int,
    h_token: *mut c_void,
    dw_flags: u32,
    psz_path: *mut u16,
) -> i32 {
    if !psz_path.is_null() && (csidl & 0xff) == CSIDL_LOCAL_APPDATA {
        if let Some(w) = HOOK_LOCALAPPDATA_W.get() {
            let n = w.len().min(260);
            unsafe {
                std::ptr::copy_nonoverlapping(w.as_ptr(), psz_path, n);
                *psz_path.add(n - 1) = 0;
            }
            return 0;
        }
    }
    let orig = ORIG_SH_FOLDER_W.load(Ordering::Acquire);
    if orig != 0 {
        let f: unsafe extern "system" fn(*mut c_void, c_int, *mut c_void, u32, *mut u16) -> i32 =
            unsafe { std::mem::transmute(orig) };
        return unsafe { f(hwnd, csidl, h_token, dw_flags, psz_path) };
    }
    -2147467259i32
}

unsafe extern "system" fn hook_sh_get_special_folder_path_w(
    hwnd: *mut c_void,
    psz_path: *mut u16,
    csidl: c_int,
    f_create: c_int,
) -> c_int {
    if !psz_path.is_null() && (csidl & 0xff) == CSIDL_LOCAL_APPDATA {
        if let Some(w) = HOOK_LOCALAPPDATA_W.get() {
            let n = w.len().min(260);
            unsafe {
                std::ptr::copy_nonoverlapping(w.as_ptr(), psz_path, n);
                *psz_path.add(n - 1) = 0;
            }
            return 1;
        }
    }
    let orig = ORIG_SH_SPECIAL_W.load(Ordering::Acquire);
    if orig != 0 {
        let f: unsafe extern "system" fn(*mut c_void, *mut u16, c_int, c_int) -> c_int =
            unsafe { std::mem::transmute(orig) };
        return unsafe { f(hwnd, psz_path, csidl, f_create) };
    }
    0
}

unsafe extern "system" fn hook_sh_get_folder_path_a(
    hwnd: *mut c_void,
    csidl: c_int,
    h_token: *mut c_void,
    dw_flags: u32,
    psz_path: *mut u8,
) -> i32 {
    if !psz_path.is_null() && (csidl & 0xff) == CSIDL_LOCAL_APPDATA {
        if let Some(a) = HOOK_LOCALAPPDATA_A.get() {
            let n = a.len().min(260);
            unsafe {
                std::ptr::copy_nonoverlapping(a.as_ptr(), psz_path, n);
                *psz_path.add(n - 1) = 0;
            }
            return 0;
        }
    }
    let orig = ORIG_SH_FOLDER_A.load(Ordering::Acquire);
    if orig != 0 {
        let f: unsafe extern "system" fn(*mut c_void, c_int, *mut c_void, u32, *mut u8) -> i32 =
            unsafe { std::mem::transmute(orig) };
        return unsafe { f(hwnd, csidl, h_token, dw_flags, psz_path) };
    }
    -2147467259i32
}

unsafe fn patch_module_shell32_iat(hmod: *mut c_void) {
    if hmod.is_null() {
        return;
    }
    let base = hmod as *const u8;
    unsafe {
        if *(base as *const u16) != 0x5A4D {
            return;
        }
        let lfanew = *(base.add(0x3C) as *const u32) as usize;
        if lfanew == 0 || lfanew > 0x10000 {
            return;
        }
        let pe = base.add(lfanew);
        if *(pe as *const u32) != 0x00004550 {
            return;
        }
        let opt = pe.add(24);
        if *(opt as *const u16) != 0x020B {
            return;
        }
        let import_rva = *(opt.add(120) as *const u32) as usize;
        let import_size = *(opt.add(124) as *const u32) as usize;
        if import_rva == 0 || import_size < 20 {
            return;
        }

        let orig_known = ORIG_SH_KNOWN.load(Ordering::Relaxed);
        let orig_folder_w = ORIG_SH_FOLDER_W.load(Ordering::Relaxed);
        let orig_folder_a = ORIG_SH_FOLDER_A.load(Ordering::Relaxed);
        let orig_special_w = ORIG_SH_SPECIAL_W.load(Ordering::Relaxed);

        let mut desc = base.add(import_rva);
        loop {
            let oft_rva = *(desc as *const u32) as usize;
            let name_rva = *(desc.add(12) as *const u32) as usize;
            let ft_rva = *(desc.add(16) as *const u32) as usize;
            if oft_rva == 0 && ft_rva == 0 {
                break;
            }
            if name_rva != 0 && ft_rva != 0 {
                let dll_name = CStr::from_ptr(base.add(name_rva) as *const c_char)
                    .to_string_lossy()
                    .to_ascii_lowercase();
                if dll_name == "shell32.dll" {
                    let mut oft = if oft_rva != 0 { base.add(oft_rva) as *const u64 } else { std::ptr::null() };
                    let mut ft = base.add(ft_rva) as *mut u64;
                    loop {
                        let slot_val = *ft;
                        if slot_val == 0 {
                            break;
                        }
                        let mut target_hook: usize = 0;
                        if !oft.is_null() {
                            let int_val = *oft;
                            if int_val == 0 {
                                break;
                            }
                            if (int_val & (1u64 << 63)) == 0 {
                                let ibn_rva = int_val as u32 as usize;
                                let fn_name = CStr::from_ptr(base.add(ibn_rva + 2) as *const c_char).to_string_lossy();
                                target_hook = match fn_name.as_ref() {
                                    "SHGetKnownFolderPath" => hook_sh_get_known_folder_path as *const () as usize,
                                    "SHGetFolderPathW" => hook_sh_get_folder_path_w as *const () as usize,
                                    "SHGetSpecialFolderPathW" => hook_sh_get_special_folder_path_w as *const () as usize,
                                    "SHGetFolderPathA" => hook_sh_get_folder_path_a as *const () as usize,
                                    _ => 0,
                                };
                            }
                            oft = oft.add(1);
                        }
                        if target_hook == 0 {
                            let cur = slot_val as usize;
                            if cur != 0 && cur == orig_known {
                                target_hook = hook_sh_get_known_folder_path as *const () as usize;
                            } else if cur != 0 && cur == orig_folder_w {
                                target_hook = hook_sh_get_folder_path_w as *const () as usize;
                            } else if cur != 0 && cur == orig_special_w {
                                target_hook = hook_sh_get_special_folder_path_w as *const () as usize;
                            } else if cur != 0 && cur == orig_folder_a {
                                target_hook = hook_sh_get_folder_path_a as *const () as usize;
                            }
                        }
                        if target_hook != 0 && (*ft as usize) != target_hook {
                            let mut old_prot: u32 = 0;
                            if VirtualProtect(ft as *mut c_void, std::mem::size_of::<u64>(), 0x04, &mut old_prot) != 0 {
                                *ft = target_hook as u64;
                                let _ = VirtualProtect(ft as *mut c_void, std::mem::size_of::<u64>(), old_prot, &mut old_prot);
                            }
                        }
                        ft = ft.add(1);
                    }
                }
            }
            desc = desc.add(20);
        }
    }
}

unsafe fn install_localappdata_iat_hooks(appdata_dir: &Path) {
    let s = appdata_dir.to_string_lossy().to_string();
    let _ = HOOK_LOCALAPPDATA_W.set(to_wide(&s));
    let mut a_bytes = s.as_bytes().to_vec();
    a_bytes.push(0);
    let _ = HOOK_LOCALAPPDATA_A.set(a_bytes);

    unsafe {
        let sh_w = to_wide("shell32.dll");
        let sh = LoadLibraryW(sh_w.as_ptr());
        if !sh.is_null() {
            let p_k = GetProcAddress(sh, CString::new("SHGetKnownFolderPath").unwrap().as_ptr()) as usize;
            let p_w = GetProcAddress(sh, CString::new("SHGetFolderPathW").unwrap().as_ptr()) as usize;
            let p_sw = GetProcAddress(sh, CString::new("SHGetSpecialFolderPathW").unwrap().as_ptr()) as usize;
            let p_a = GetProcAddress(sh, CString::new("SHGetFolderPathA").unwrap().as_ptr()) as usize;
            let _ = ORIG_SH_KNOWN.compare_exchange(0, p_k, Ordering::SeqCst, Ordering::SeqCst);
            let _ = ORIG_SH_FOLDER_W.compare_exchange(0, p_w, Ordering::SeqCst, Ordering::SeqCst);
            let _ = ORIG_SH_SPECIAL_W.compare_exchange(0, p_sw, Ordering::SeqCst, Ordering::SeqCst);
            let _ = ORIG_SH_FOLDER_A.compare_exchange(0, p_a, Ordering::SeqCst, Ordering::SeqCst);
        }

        let mut needed: u32 = 0;
        let proc_h = GetCurrentProcess();
        let mut mods = vec![std::ptr::null_mut::<c_void>(); 512];
        if K32EnumProcessModules(
            proc_h,
            mods.as_mut_ptr(),
            (mods.len() * std::mem::size_of::<*mut c_void>()) as u32,
            &mut needed,
        ) != 0
        {
            let count = (needed as usize / std::mem::size_of::<*mut c_void>()).min(mods.len());
            for &m in &mods[..count] {
                patch_module_shell32_iat(m);
            }
        }
    }
}

unsafe fn load_aipic_api(lk_root: &Path, isolate_appdata: Option<&Path>) -> Result<AipicApi, String> {
    let lk_str = lk_root.to_string_lossy().to_string();
    let dll_path = lk_root.join("aipic.dll").to_string_lossy().to_string();
    let lk_w = to_wide(&lk_str);
    unsafe {
        SetDllDirectoryW(lk_w.as_ptr());
        SetCurrentDirectoryW(lk_w.as_ptr());
        if let Some(ad) = isolate_appdata {
            // Preload SHELL32 dependents so their IATs are redirected before aipic.dll initializes them
            for dep in ["netbase.dll", "ImgCodec.dll", "schedule.dll", "kernel.dll"] {
                let dep_p = lk_root.join(dep);
                if dep_p.is_file() {
                    let dep_w = to_wide(&dep_p.to_string_lossy());
                    let _ = LoadLibraryW(dep_w.as_ptr());
                }
            }
            install_localappdata_iat_hooks(ad);
        }
    }
    let dll_w = to_wide(&dll_path);
    let h = unsafe { LoadLibraryW(dll_w.as_ptr()) };
    if h.is_null() {
        return Err(format!("LoadLibraryW that bai: {}", dll_path));
    }
    if let Some(ad) = isolate_appdata {
        unsafe {
            install_localappdata_iat_hooks(ad);
        }
    }

    macro_rules! req_sym {
        ($name:literal, $t:ty) => {{
            let c = CString::new($name).unwrap();
            let p = unsafe { GetProcAddress(h, c.as_ptr()) };
            if p.is_null() {
                return Err(format!("Thieu symbol bat buoc: {}", $name));
            }
            unsafe { std::mem::transmute::<*mut c_void, $t>(p) }
        }};
    }
    macro_rules! opt_sym {
        ($name:literal, $t:ty) => {{
            let c = CString::new($name).unwrap();
            let p = unsafe { GetProcAddress(h, c.as_ptr()) };
            if p.is_null() {
                None
            } else {
                Some(unsafe { std::mem::transmute::<*mut c_void, $t>(p) })
            }
        }};
    }

    Ok(AipicApi {
        aipic_set_config: req_sym!("aipic_set_config", _),
        aipic_global_init: req_sym!("aipic_global_init", _),
        aipic_set_login_state: req_sym!("aipic_set_login_state", _),
        aipic_set_retouched_thumbnail_watermark: req_sym!("aipic_set_retouched_thumbnail_watermark", _),
        aipic_get_image_backgroud_info: req_sym!("aipic_get_image_backgroud_info", _),
        aipic_get_material_info: opt_sym!("aipic_get_material_info", _),
        aipic_window_event: req_sym!("aipic_window_event", _),
        aipic_get_workspace_item: opt_sym!("aipic_get_workspace_item", _),
        aipic_insert_workspace_item: req_sym!("aipic_insert_workspace_item", _),
        aipic_delete_workspace_item: opt_sym!("aipic_delete_workspace_item", _),
        aipic_batch_insert_filelist_item: req_sym!("aipic_batch_insert_filelist_item", _),
        aipic_retouch_switch_image: req_sym!("aipic_retouch_switch_image", _),
        aipic_get_some_dectect_info: req_sym!("aipic_get_some_dectect_info", _),
        aipic_retouch_image: req_sym!("aipic_retouch_image", _),
        aipic_retouch_operation: opt_sym!("aipic_retouch_operation", _),
        aipic_liquid_begin: req_sym!("aipic_liquid_begin", _),
        aipic_liquid_confirm: req_sym!("aipic_liquid_confirm", _),
        aipic_liquid_cancel: opt_sym!("aipic_liquid_cancel", _),
        aipic_liquid_history: opt_sym!("aipic_liquid_history", _),
        aipic_set_reference_by_aisimulation: req_sym!("aipic_set_reference_by_aisimulation", _),
        aipic_save_image: opt_sym!("aipic_save_image", _),
        aipic_update_reference_view: opt_sym!("aipic_update_reference_view", _),
        aipic_get_image: req_sym!("aipic_get_image", _),
        get_file_curve_data: opt_sym!("get_file_curve_data", _),
        get_file_histogram_data: opt_sym!("get_file_histogram_data", _),
        aipic_build_export_task: req_sym!("aipic_build_export_task", _),
        aipic_get_preset_group_item: opt_sym!("aipic_get_preset_group_item", _),
        aipic_get_preset_group_item_by_id: opt_sym!("aipic_get_preset_group_item_by_id", _),
        aipic_insert_preset_group_item: opt_sym!("aipic_insert_preset_group_item", _),
        aipic_modify_preset_group_item: opt_sym!("aipic_modify_preset_group_item", _),
        aipic_delete_preset_group_item: opt_sym!("aipic_delete_preset_group_item", _),
        aipic_insert_preset_item: opt_sym!("aipic_insert_preset_item", _),
        aipic_modify_preset_item: opt_sym!("aipic_modify_preset_item", _),
        aipic_delete_preset_item: opt_sym!("aipic_delete_preset_item", _),
        aipic_camera_connect: opt_sym!("aipic_camera_connect", _),
        aipic_camera_disconnect: opt_sym!("aipic_camera_disconnect", _),
        aipic_online_shooting_setting: opt_sym!("aipic_online_shooting_setting", _),
        aipic_set_setting: opt_sym!("aipic_set_setting", _),
    })
}

fn strip_unc_prefix(p: PathBuf) -> PathBuf {
    let s = p.to_string_lossy();
    if let Some(rest) = s.strip_prefix(r"\\?\") {
        PathBuf::from(rest)
    } else {
        p
    }
}

fn devstu_data_root() -> PathBuf {
    if let Ok(env_d) = std::env::var("DEVSTU_DATA_DIR") {
        if !env_d.trim().is_empty() {
            return strip_unc_prefix(PathBuf::from(env_d));
        }
    }
    if let Ok(lk_root) = find_lk_root() {
        let base = if lk_root.file_name().and_then(|n| n.to_str()).map(|n| n.eq_ignore_ascii_case("lk_runtime")).unwrap_or(false) {
            lk_root.parent().map(|p| p.to_path_buf()).unwrap_or(lk_root.clone())
        } else {
            lk_root
        };
        return strip_unc_prefix(base.join("_data"));
    }
    if let Ok(exe) = std::env::current_exe() {
        if let Some(dir) = exe.parent() {
            return strip_unc_prefix(dir.join("_data"));
        }
    }
    strip_unc_prefix(PathBuf::from("_data"))
}

fn devstu_temp_root() -> PathBuf {
    devstu_data_root().join("tmp")
}

fn devstu_appdata_root() -> PathBuf {
    devstu_data_root().join("appdata")
}

fn ensure_ascii_work_dir() -> PathBuf {
    let p = devstu_temp_root();
    let _ = std::fs::create_dir_all(p.join("work"));
    let _ = std::fs::create_dir_all(p.join("export"));
    p
}

fn save_base64_to_ascii_temp(b64_or_data_url: &str, prefix: &str) -> Result<PathBuf, String> {
    let trimmed = b64_or_data_url.trim();
    let (hint_ext, b64) = if let Some(comma) = trimmed.find(',') {
        let meta = &trimmed[..comma];
        let ext = if meta.contains("image/jpeg") || meta.contains("image/jpg") {
            "jpg"
        } else if meta.contains("image/webp") {
            "webp"
        } else if meta.contains("image/tiff") || meta.contains("dng") {
            "tif"
        } else {
            "png"
        };
        (ext, &trimmed[comma + 1..])
    } else {
        ("png", trimmed)
    };
    let bytes = BASE64.decode(b64).map_err(|e| format!("Base64 decode error: {e}"))?;
    let ext = if bytes.starts_with(b"\xff\xd8\xff") {
        "jpg"
    } else if bytes.starts_with(b"\x89PNG\r\n\x1a\n") {
        "png"
    } else if bytes.starts_with(b"RIFF") && bytes.get(8..12) == Some(b"WEBP") {
        "webp"
    } else if bytes.starts_with(b"BM") {
        "bmp"
    } else if bytes.starts_with(b"II*\0") || bytes.starts_with(b"MM\0*") {
        "tif"
    } else {
        hint_ext
    };
    let work_dir = ensure_ascii_work_dir().join("work");
    let seq = SEQ_COUNTER.fetch_add(1, Ordering::Relaxed);
    let path = work_dir.join(format!("{}_{}_{}.{}", prefix, std::process::id(), seq, ext));
    std::fs::write(&path, bytes).map_err(|e| format!("Write temp image failed: {e}"))?;
    Ok(path)
}

fn copy_to_ascii_if_needed(orig_path: &str, prefix: &str) -> Result<PathBuf, String> {
    let p = PathBuf::from(orig_path);
    if !p.exists() {
        return Err(format!("File khong ton tai: {}", orig_path));
    }
    let has_non_ascii_or_dot = orig_path.bytes().any(|b| b >= 0x80)
        || orig_path.contains("\\.")
        || orig_path.contains("/.");
    if !has_non_ascii_or_dot {
        return Ok(p);
    }
    let ext = p.extension().and_then(|s| s.to_str()).unwrap_or("jpg");
    let work_dir = ensure_ascii_work_dir().join("work");
    let seq = SEQ_COUNTER.fetch_add(1, Ordering::Relaxed);
    let dest = work_dir.join(format!("{}_{}_{}.{}", prefix, std::process::id(), seq, ext));
    std::fs::copy(&p, &dest).map_err(|e| format!("Copy image failed: {e}"))?;
    Ok(dest)
}

fn detect_single(api: &AipicApi, dtype: i32, fid: i32, req: &str) -> String {
    GENERIC_DONE.store(false, Ordering::SeqCst);
    if let Ok(mut g) = generic_json().lock() {
        g.clear();
    }
    let req_c = match cstring_safe(req) {
        Ok(c) => c,
        Err(_) => return String::new(),
    };
    let mut cookie: c_longlong = SEQ_COUNTER.fetch_add(1, Ordering::Relaxed) as i64;
    let r = unsafe {
        (api.aipic_get_some_dectect_info)(
            0,
            dtype,
            req_c.as_ptr(),
            fid,
            &mut cookie,
            on_detect as *const c_void,
        )
    };
    if r == 0 {
        let wait = if dtype == 1 { 8.0 } else { 5.0 };
        pump_until(wait, Some(&GENERIC_DONE), None);
    }
    generic_json().lock().map(|g| g.clone()).unwrap_or_default()
}

fn detect_mime(bytes: &[u8], path: &str) -> &'static str {
    if bytes.starts_with(b"\x89PNG\r\n\x1a\n") {
        "image/png"
    } else if bytes.starts_with(b"\xff\xd8\xff") {
        "image/jpeg"
    } else if bytes.starts_with(b"RIFF") && bytes.get(8..12) == Some(b"WEBP") {
        "image/webp"
    } else if bytes.starts_with(b"BM") {
        "image/bmp"
    } else if path.to_ascii_lowercase().ends_with(".png") {
        "image/png"
    } else {
        "image/jpeg"
    }
}

fn fetch_retouched_preview(
    api: &AipicApi,
    fid: i32,
    ws_id: i64,
    orig_path: &str,
    need_data_url: bool,
) -> Option<(String, String, usize)> {
    if fid <= 0 {
        return None;
    }
    GET_IMAGE_DONE.store(false, Ordering::SeqCst);
    if let Ok(mut g) = get_image_json().lock() {
        g.clear();
    }
    let req = json!({
        "type": "retouched_image",
        "file_id": fid,
        "workspace_id": ws_id,
        "original_path": orig_path,
    });
    let req_c = cstring_safe(&req.to_string()).ok()?;
    let r = unsafe { (api.aipic_get_image)(req_c.as_ptr(), on_get_image as *const c_void) };
    if VERBOSE.load(Ordering::Relaxed) {
        eprintln!("[GET_IMAGE_CALL] fid={} raw_ret={}", fid, r);
    }
    pump_until(6.0, Some(&GET_IMAGE_DONE), None);
    let raw = get_image_json().lock().map(|g| g.clone()).unwrap_or_default();
    let parsed: Value = serde_json::from_str(&raw).ok()?;
    let out_path = parsed.get("path").and_then(|v| v.as_str()).unwrap_or("").to_string();
    if out_path.is_empty() {
        return None;
    }
    if !need_data_url {
        if std::path::Path::new(&out_path).is_file() {
            return Some((String::new(), out_path, 0));
        }
        return None;
    }
    let bytes = std::fs::read(&out_path).ok()?;
    if bytes.is_empty() {
        return None;
    }
    let n = bytes.len();
    let mime = detect_mime(&bytes, &out_path);
    let data_url = format!("data:{};base64,{}", mime, BASE64.encode(&bytes));
    Some((data_url, out_path, n))
}

fn material_dir_stats(dir: &std::path::Path) -> (usize, u64) {
    let mut entries = 0usize;
    let mut bytes = 0u64;
    let Ok(rd) = std::fs::read_dir(dir) else {
        return (0, 0);
    };
    for ent in rd.flatten() {
        entries += 1;
        let p = ent.path();
        if p.is_dir() {
            if let Ok(sub) = std::fs::read_dir(&p) {
                for s in sub.flatten() {
                    entries += 1;
                    if let Ok(md) = s.metadata() {
                        bytes = bytes.saturating_add(md.len());
                    }
                }
            }
        } else if let Ok(md) = ent.metadata() {
            bytes = bytes.saturating_add(md.len());
        }
    }
    (entries, bytes)
}

fn best_preview(
    api: &AipicApi,
    fid: i32,
    ws_id: i64,
    file_paths: &HashMap<i32, String>,
    allow_get_image: bool,
    need_data_url: bool,
) -> (String, String, &'static str) {
    if allow_get_image {
        let orig = file_paths.get(&fid).map(|s| s.as_str()).unwrap_or("");
        if let Some((url, path, _)) = fetch_retouched_preview(api, fid, ws_id, orig, need_data_url) {
            return (url, path, "retouched_image");
        }
    }
    let thumb = last_thumb().lock().map(|s| s.clone()).unwrap_or_default();
    let src = if thumb.is_empty() { "none" } else { "thumb" };
    (thumb, String::new(), src)
}

fn handle_command(
    api: &AipicApi,
    cmd_val: &Value,
    ws_id: i64,
    cookie_gen: &mut c_longlong,
    win_cookie: &mut c_longlong,
    current_fid: &mut i32,
    retouch_seq: &mut i64,
    file_paths: &mut HashMap<i32, String>,
) -> Value {
    let id = cmd_val.get("id").and_then(|v| v.as_i64()).unwrap_or(0);
    let cmd = cmd_val.get("cmd").and_then(|v| v.as_str()).unwrap_or("");

    match cmd {
        "ping" => json!({
            "id": id,
            "ok": true,
            "model_ready": MODEL_READY.load(Ordering::SeqCst),
            "ws_id": ws_id,
            "current_fid": *current_fid
        }),

        "materials" => {
            let bg = bg_info_json().lock().map(|s| s.clone()).unwrap_or_default();
            let mat2 = material_2_json().lock().map(|s| s.clone()).unwrap_or_default();
            json!({
                "id": id,
                "ok": true,
                "bg_info": serde_json::from_str::<Value>(&bg).unwrap_or(Value::String(bg)),
                "custom_materials": serde_json::from_str::<Value>(&mat2).unwrap_or(Value::String(mat2)),
            })
        }

        "set_viewport" => {
            let x = cmd_val.get("x").and_then(|v| v.as_i64()).unwrap_or(0);
            let y = cmd_val.get("y").and_then(|v| v.as_i64()).unwrap_or(60);
            let vw = cmd_val.get("viewW").and_then(|v| v.as_i64()).unwrap_or(1400);
            let vh = cmd_val.get("viewH").and_then(|v| v.as_i64()).unwrap_or(900);
            let ww = cmd_val.get("windowW").and_then(|v| v.as_i64()).unwrap_or(1920);
            let wh = cmd_val.get("windowH").and_then(|v| v.as_i64()).unwrap_or(1080);
            let sf = cmd_val.get("scaleFactor").and_then(|v| v.as_f64()).unwrap_or(1.0);
            let ev_json = format!(
                r#"{{"resize":{{"x":{},"y":{},"viewW":{},"viewH":{},"windowW":{},"windowH":{},"scaleFactor":{}}}}}"#,
                x, y, vw, vh, ww, wh, sf
            );
            if let Ok(c) = cstring_safe(&ev_json) {
                let r = unsafe { (api.aipic_window_event)(win_cookie, 100, c.as_ptr()) };
                pump_until(0.12, None, None);
                let fr = *frame_rect().lock().unwrap();
                return json!({
                    "id": id,
                    "ok": r == 0,
                    "ret": r,
                    "frame_rect": { "x": fr.0, "y": fr.1, "width": fr.2, "height": fr.3 }
                });
            }
            json!({ "id": id, "ok": false, "error": "Invalid viewport string" })
        }

        "open_image" => {
            let local_path = if let Some(b64) = cmd_val.get("image_base64").and_then(|v| v.as_str()).filter(|s| !s.is_empty()) {
                match save_base64_to_ascii_temp(b64, "src") {
                    Ok(p) => p,
                    Err(e) => return json!({ "id": id, "ok": false, "error": e }),
                }
            } else if let Some(p) = cmd_val.get("path").and_then(|v| v.as_str()).filter(|s| !s.is_empty()) {
                match copy_to_ascii_if_needed(p, "src") {
                    Ok(cp) => cp,
                    Err(e) => return json!({ "id": id, "ok": false, "error": e }),
                }
            } else {
                return json!({ "id": id, "ok": false, "error": "Thieu image_base64 hoac path" });
            };

            let p_str = local_path.to_string_lossy().to_string();
            let batch_arr = json!([{
                "workspaceid": ws_id,
                "path": p_str,
                "extinfo": "",
                "shoottime": "2026-11-15 18:00:00",
                "import_path": "",
                "online_shooting_image": 0,
                "retouch_param": ""
            }]);
            let batch_c = match cstring_safe(&batch_arr.to_string()) {
                Ok(c) => c,
                Err(e) => return json!({ "id": id, "ok": false, "error": e }),
            };
            BATCH_DONE.store(false, Ordering::SeqCst);
            BATCH_FID.store(-1, Ordering::SeqCst);
            *cookie_gen += 1;
            let bi_r = unsafe {
                (api.aipic_batch_insert_filelist_item)(
                    0,
                    cookie_gen,
                    batch_c.as_ptr(),
                    0,
                    1,
                    true,
                    on_batch as *const c_void,
                )
            };
            pump_until(8.0, Some(&BATCH_DONE), None);
            let fid = BATCH_FID.load(Ordering::SeqCst);
            if fid <= 0 {
                return json!({ "id": id, "ok": false, "error": format!("batch_insert that bai: ret={} fid={}", bi_r, fid) });
            }
            *current_fid = fid;
            file_paths.insert(fid, p_str.clone());

            if let Ok(mut set) = ready_fids().lock() {
                set.remove(&fid);
            }
            RETOUCH_DONE.store(false, Ordering::SeqCst);
            SWITCH_PARAM_DONE.store(false, Ordering::SeqCst);
            if let Ok(mut t) = last_thumb().lock() {
                t.clear();
            }
            let mut sw_cookie: c_longlong = 1;
            let sw_r = unsafe {
                (api.aipic_retouch_switch_image)(
                    &mut sw_cookie,
                    fid,
                    1,
                    on_hist as *const c_void,
                    on_thumb as *const c_void,
                    on_switch_param as *const c_void,
                )
            };
            let t_sw = Instant::now();
            loop {
                pump_messages_once();
                if SWITCH_PARAM_DONE.load(Ordering::SeqCst) {
                    break;
                }
                if t_sw.elapsed().as_secs_f64() >= 3.0 {
                    break;
                }
                std::thread::sleep(Duration::from_millis(15));
            }

            let fast_open = cmd_val.get("fast_open").and_then(|v| v.as_bool()).unwrap_or(false);
            let fast_url = cmd_val.get("fast_url").and_then(|v| v.as_bool()).unwrap_or(false);
            if !fast_open {
                let _seg_raw = detect_single(api, 15, fid, "{}");
            }

            let t_ready = Instant::now();
            let ready_grace = if fast_open { 0.35 } else { 2.5 };
            let ready_max = if fast_open { 12.0 } else { 15.0 };
            loop {
                pump_messages_once();
                let is_ready = ready_fids().lock().map(|g| g.contains(&fid)).unwrap_or(false);
                if is_ready && (RETOUCH_DONE.load(Ordering::SeqCst) || t_ready.elapsed().as_secs_f64() > ready_grace) {
                    break;
                }
                if t_ready.elapsed().as_secs_f64() >= ready_max {
                    break;
                }
                std::thread::sleep(Duration::from_millis(10));
            }

            let mut face_raw = detect_single(api, 14, fid, "{}");
            let max_face_retries = if fast_open { 3 } else { 5 };
            for _ in 0..max_face_retries {
                if face_raw.contains("\"items\"") {
                    break;
                }
                pump_messages_once();
                std::thread::sleep(Duration::from_millis(80));
                face_raw = detect_single(api, 14, fid, "{}");
            }
            let (matte_raw, sky_raw) = if fast_open {
                ("{}".to_string(), "{}".to_string())
            } else {
                (detect_single(api, 0, fid, "{}"), detect_single(api, 1, fid, "{}"))
            };

            let (preview, preview_path, preview_source) = best_preview(api, fid, ws_id, file_paths, true, !fast_url);
            let hist_str = last_hist().lock().map(|s| s.clone()).unwrap_or_default();
            let sw_param = last_switch_param().lock().map(|s| s.clone()).unwrap_or_default();
            let fr = *frame_rect().lock().unwrap();

            json!({
                "id": id,
                "ok": sw_r == 0 || !preview.is_empty() || !preview_path.is_empty(),
                "fid": fid,
                "ws_id": ws_id,
                "source_path": p_str,
                "frame_rect": { "x": fr.0, "y": fr.1, "width": fr.2, "height": fr.3 },
                "preview_data_url": preview,
                "preview_path": preview_path,
                "preview_source": preview_source,
                "histogram": serde_json::from_str::<Value>(&hist_str).unwrap_or(Value::String(hist_str)),
                "detect_faces": serde_json::from_str::<Value>(&face_raw).unwrap_or(Value::String(face_raw)),
                "detect_matting": serde_json::from_str::<Value>(&matte_raw).unwrap_or(Value::String(matte_raw)),
                "detect_sky": serde_json::from_str::<Value>(&sky_raw).unwrap_or(Value::String(sky_raw)),
                "switch_param": serde_json::from_str::<Value>(&sw_param).unwrap_or(Value::String(sw_param)),
            })
        }

        "detect" => {
            let fid = cmd_val.get("fid").and_then(|v| v.as_i64()).map(|x| x as i32).unwrap_or(*current_fid);
            let dtype = cmd_val.get("detect_type").and_then(|v| v.as_i64()).unwrap_or(14) as i32;
            let req = cmd_val.get("req_json").and_then(|v| v.as_str()).unwrap_or("{}");
            let raw = detect_single(api, dtype, fid, req);
            json!({
                "id": id,
                "ok": !raw.is_empty(),
                "fid": fid,
                "detect_type": dtype,
                "result": serde_json::from_str::<Value>(&raw).unwrap_or(Value::String(raw))
            })
        }

        "retouch" => {
            let fid = cmd_val.get("fid").and_then(|v| v.as_i64()).map(|x| x as i32).unwrap_or(*current_fid);
            if fid <= 0 {
                return json!({ "id": id, "ok": false, "error": "Chua mo anh trong workspace" });
            }
            let mode = cmd_val.get("mode").and_then(|v| v.as_i64()).unwrap_or(1) as c_int;
            let is_changing = cmd_val.get("is_changing").and_then(|v| v.as_bool()).unwrap_or(false);
            let param_str = match cmd_val.get("param") {
                Some(Value::String(s)) => s.clone(),
                Some(v) => v.to_string(),
                None => r#"{"sex_retoucher_beauty_params":[],"sex_retoucher_color_params":{"params":[],"partial_params":[],"combine_classifyid_group":[]}}"#.to_string(),
            };
            *retouch_seq += 1;
            let full = json!({
                "fileid": fid,
                "param": param_str,
                "operate_info": r#"{"operate_type":1}"#,
                "current_retouch_id": *retouch_seq,
                "is_from_param_history": 0,
                "retouch_param_type": 1
            });
            let full_c = match cstring_safe(&full.to_string()) {
                Ok(c) => c,
                Err(e) => return json!({ "id": id, "ok": false, "error": e }),
            };
            if !is_changing && fid > 0 {
                let t_wait = Instant::now();
                while t_wait.elapsed().as_secs_f64() < 3.0 {
                    let is_ready = ready_fids().lock().map(|g| g.contains(&fid)).unwrap_or(false);
                    if is_ready {
                        break;
                    }
                    pump_messages_once();
                    std::thread::sleep(Duration::from_millis(15));
                }
            }

            let full_view = full_c.to_string_lossy();
            let is_cold_watch_color_ai =
                !is_changing && full_view.contains("170001") && full_view.contains("scene");
            let mat_dir = devstu_appdata_root()
                .join("Ai-Photo")
                .join("users")
                .join("devstu_umx")
                .join("material");
            let mat_before = if is_cold_watch_color_ai {
                material_dir_stats(&mat_dir)
            } else {
                (0, 0)
            };
            let seq_before = THUMB_SEQ.load(Ordering::SeqCst);
            let thumb_before = if is_cold_watch_color_ai {
                last_thumb().lock().map(|s| s.clone()).unwrap_or_default()
            } else {
                String::new()
            };

            let run_retouch_once = || unsafe {
                RETOUCH_DONE.store(false, Ordering::SeqCst);
                UNI_DONE.store(false, Ordering::SeqCst);
                if let Ok(mut u) = last_uni().lock() {
                    u.clear();
                }
                let rc = (api.aipic_retouch_image)(
                    fid,
                    full_c.as_ptr(),
                    mode,
                    true,
                    true,
                    true,
                    false,
                    on_thumb as *const c_void,
                    on_hist as *const c_void,
                    on_wb as *const c_void,
                    on_uni as *const c_void,
                    0,
                );
                pump_until(8.0, Some(&RETOUCH_DONE), None);
                rc
            };

            let mut r = run_retouch_once();

            if is_cold_watch_color_ai {
                let mat_after_first = material_dir_stats(&mat_dir);
                let thumb_unchanged = THUMB_SEQ.load(Ordering::SeqCst) == seq_before
                    || last_thumb().lock().map(|s| *s == thumb_before).unwrap_or(false);
                if mat_after_first != mat_before || thumb_unchanged {
                    let t_mat = Instant::now();
                    let mut saw_mat_growth = mat_after_first != mat_before;
                    let max_wait = if saw_mat_growth { 0.55 } else { 2.0 };
                    while t_mat.elapsed().as_secs_f64() < max_wait {
                        pump_messages_once();
                        std::thread::sleep(Duration::from_millis(25));
                        if !saw_mat_growth && material_dir_stats(&mat_dir) != mat_before {
                            saw_mat_growth = true;
                            // Wait briefly for data_0/data_1 inside material_detect_info_* to flush.
                            let t_settle = Instant::now();
                            while t_settle.elapsed().as_secs_f64() < 0.45 {
                                pump_messages_once();
                                std::thread::sleep(Duration::from_millis(20));
                            }
                            break;
                        }
                    }
                    if saw_mat_growth || thumb_unchanged {
                        if VERBOSE.load(Ordering::Relaxed) {
                            eprintln!(
                                "[COLD_170001_RETRY fid={}] saw_mat_growth={} thumb_unchanged={}, re-applying",
                                fid, saw_mat_growth, thumb_unchanged
                            );
                        }
                        r = run_retouch_once();
                    }
                }
            }
            let skip_gi = cmd_val.get("skip_get_image").and_then(|v| v.as_bool()).unwrap_or(false);
            let fast_url = cmd_val.get("fast_url").and_then(|v| v.as_bool()).unwrap_or(false);
            let (preview, preview_path, preview_source) = best_preview(api, fid, ws_id, file_paths, !skip_gi, !fast_url);
            let hist_str = last_hist().lock().map(|s| s.clone()).unwrap_or_default();
            let uni_str = last_uni().lock().map(|s| s.clone()).unwrap_or_default();
            json!({
                "id": id,
                "ok": r == 0,
                "ret": r,
                "fid": fid,
                "preview_data_url": preview,
                "preview_path": preview_path,
                "preview_source": preview_source,
                "uni": serde_json::from_str::<Value>(&uni_str).unwrap_or(Value::String(uni_str)),
                "histogram": serde_json::from_str::<Value>(&hist_str).unwrap_or(Value::String(hist_str)),
            })
        }

        "get_preview" => {
            let fid = cmd_val.get("fid").and_then(|v| v.as_i64()).map(|x| x as i32).unwrap_or(*current_fid);
            let fast_url = cmd_val.get("fast_url").and_then(|v| v.as_bool()).unwrap_or(false);
            let (preview, preview_path, preview_source) = best_preview(api, fid, ws_id, file_paths, true, !fast_url);
            json!({
                "id": id,
                "ok": !preview.is_empty() || !preview_path.is_empty(),
                "fid": fid,
                "preview_data_url": preview,
                "preview_path": preview_path,
                "preview_source": preview_source,
            })
        }

        "retouch_op" => {
            let fid = cmd_val.get("fid").and_then(|v| v.as_i64()).map(|x| x as i32).unwrap_or(*current_fid);
            let op_mode = cmd_val.get("op_mode").and_then(|v| v.as_i64()).unwrap_or(0) as c_int;
            let fast_url = cmd_val.get("fast_url").and_then(|v| v.as_bool()).unwrap_or(false);
            let Some(f) = api.aipic_retouch_operation else {
                return json!({ "id": id, "ok": false, "error": "aipic_retouch_operation unavailable" });
            };
            RETOUCH_DONE.store(false, Ordering::SeqCst);
            let r = unsafe {
                f(
                    fid,
                    op_mode,
                    on_thumb as *const c_void,
                    on_hist as *const c_void,
                    on_op_apply as *const c_void,
                )
            };
            pump_until(6.0, Some(&RETOUCH_DONE), None);
            let (preview, preview_path, preview_source) = best_preview(api, fid, ws_id, file_paths, true, !fast_url);
            let hist_str = last_hist().lock().map(|s| s.clone()).unwrap_or_default();
            let applied = generic_json().lock().map(|s| s.clone()).unwrap_or_default();
            json!({
                "id": id,
                "ok": r == 0,
                "ret": r,
                "preview_data_url": preview,
                "preview_path": preview_path,
                "preview_source": preview_source,
                "histogram": serde_json::from_str::<Value>(&hist_str).unwrap_or(Value::String(hist_str)),
                "applied": serde_json::from_str::<Value>(&applied).unwrap_or(Value::String(applied)),
            })
        }

        "get_curve_data" => {
            let Some(f) = api.get_file_curve_data else {
                return json!({ "id": id, "ok": false, "error": "get_file_curve_data unavailable" });
            };
            let param_str = match cmd_val.get("point_data") {
                Some(pd) => json!({ "point_data": pd }).to_string(),
                None => cmd_val.get("json_data").and_then(|v| v.as_str()).unwrap_or("{}").to_string(),
            };
            let Ok(c) = cstring_safe(&param_str) else {
                return json!({ "id": id, "ok": false, "error": "Invalid json" });
            };
            GENERIC_DONE.store(false, Ordering::SeqCst);
            let r = unsafe { f(c.as_ptr(), on_str_2 as *const c_void) };
            pump_until(3.0, Some(&GENERIC_DONE), None);
            let raw = generic_json().lock().map(|s| s.clone()).unwrap_or_default();
            json!({
                "id": id,
                "ok": r == 0,
                "result": serde_json::from_str::<Value>(&raw).unwrap_or(Value::String(raw)),
            })
        }

        "get_histogram" => {
            let fid = cmd_val.get("fid").and_then(|v| v.as_i64()).map(|x| x as i32).unwrap_or(*current_fid);
            if let Some(f) = api.get_file_histogram_data {
                GENERIC_DONE.store(false, Ordering::SeqCst);
                let _ = unsafe { f(fid, on_str_2 as *const c_void) };
                pump_until(2.0, Some(&GENERIC_DONE), None);
                let raw = generic_json().lock().map(|s| s.clone()).unwrap_or_default();
                if !raw.is_empty() {
                    return json!({
                        "id": id,
                        "ok": true,
                        "histogram": serde_json::from_str::<Value>(&raw).unwrap_or(Value::String(raw)),
                    });
                }
            }
            let hist_str = last_hist().lock().map(|s| s.clone()).unwrap_or_default();
            json!({
                "id": id,
                "ok": !hist_str.is_empty(),
                "histogram": serde_json::from_str::<Value>(&hist_str).unwrap_or(Value::String(hist_str)),
            })
        }

        "set_reference" => {
            let fid = cmd_val.get("fid").and_then(|v| v.as_i64()).map(|x| x as i32).unwrap_or(*current_fid);
            let ref_path = if let Some(b64) = cmd_val.get("image_base64").and_then(|v| v.as_str()).filter(|s| !s.is_empty()) {
                match save_base64_to_ascii_temp(b64, "ref") {
                    Ok(p) => p.to_string_lossy().to_string(),
                    Err(e) => return json!({ "id": id, "ok": false, "error": e }),
                }
            } else if let Some(p) = cmd_val.get("refer_path").and_then(|v| v.as_str()).filter(|s| !s.is_empty()) {
                match copy_to_ascii_if_needed(p, "ref") {
                    Ok(cp) => cp.to_string_lossy().to_string(),
                    Err(e) => return json!({ "id": id, "ok": false, "error": e }),
                }
            } else {
                return json!({ "id": id, "ok": false, "error": "Thieu refer_path hoac image_base64" });
            };

            if let Some(save_fn) = api.aipic_save_image {
                let info = json!({
                    "fileid": fid,
                    "workspace_id": ws_id,
                    "algo_group_id": 180010,
                    "path": ref_path
                });
                if let Ok(info_c) = cstring_safe(&info.to_string()) {
                    GENERIC_DONE.store(false, Ordering::SeqCst);
                    let empty_data = CString::new("").unwrap();
                    let _ = unsafe { save_fn(info_c.as_ptr(), empty_data.as_ptr(), 0, on_str_2 as *const c_void) };
                    pump_until(4.0, Some(&GENERIC_DONE), None);
                }
            }
            if let Some(upd_fn) = api.aipic_update_reference_view {
                if let Ok(u_c) = cstring_safe(&json!({ "workspace_id": ws_id }).to_string()) {
                    GENERIC_DONE.store(false, Ordering::SeqCst);
                    let _ = unsafe { upd_fn(u_c.as_ptr(), on_str_1 as *const c_void) };
                    pump_until(2.0, Some(&GENERIC_DONE), None);
                }
            }
            let ref_req = json!({
                "fileid": fid,
                "workspace_id": ws_id,
                "refer_path": ref_path,
                "type": "reference"
            });
            if let Ok(rc) = cstring_safe(&ref_req.to_string()) {
                GENERIC_DONE.store(false, Ordering::SeqCst);
                unsafe { (api.aipic_set_reference_by_aisimulation)(rc.as_ptr(), on_str_1 as *const c_void) };
                pump_until(4.0, Some(&GENERIC_DONE), None);
            }
            let raw = generic_json().lock().map(|s| s.clone()).unwrap_or_default();
            json!({
                "id": id,
                "ok": true,
                "refer_path": ref_path,
                "result": serde_json::from_str::<Value>(&raw).unwrap_or(Value::String(raw)),
            })
        }

        "liquid_begin" => {
            let mode = cmd_val.get("mode").and_then(|v| v.as_i64()).unwrap_or(1) as c_int;
            let fid = cmd_val.get("fid").and_then(|v| v.as_i64()).map(|x| x as i32).unwrap_or(*current_fid);
            let fast_url = cmd_val.get("fast_url").and_then(|v| v.as_bool()).unwrap_or(false);
            GENERIC_DONE.store(false, Ordering::SeqCst);
            let r = unsafe { (api.aipic_liquid_begin)(mode, on_str_2 as *const c_void) };
            pump_until(4.0, Some(&GENERIC_DONE), None);
            let (preview, preview_path, preview_source) = best_preview(api, fid, ws_id, file_paths, false, !fast_url);
            json!({ "id": id, "ok": r == 0, "ret": r, "preview_data_url": preview, "preview_path": preview_path, "preview_source": preview_source })
        }

        "liquid_event" => {
            let fid = cmd_val.get("fid").and_then(|v| v.as_i64()).map(|x| x as i32).unwrap_or(*current_fid);
            let ev_type = cmd_val.get("event_type").and_then(|v| v.as_i64()).unwrap_or(500) as c_int;
            let fast_url = cmd_val.get("fast_url").and_then(|v| v.as_bool()).unwrap_or(false);
            let data_str = match cmd_val.get("data") {
                Some(Value::String(s)) => s.clone(),
                Some(v) => v.to_string(),
                None => "{}".to_string(),
            };
            let Ok(c) = cstring_safe(&data_str) else {
                return json!({ "id": id, "ok": false, "error": "Invalid liquid event json" });
            };
            RETOUCH_DONE.store(false, Ordering::SeqCst);
            let r = unsafe { (api.aipic_window_event)(win_cookie, ev_type, c.as_ptr()) };
            pump_until(0.25, Some(&RETOUCH_DONE), None);
            let fetch_p = cmd_val.get("fetch_preview").and_then(|v| v.as_bool()).unwrap_or(ev_type == 502);
            let (preview, preview_path, preview_source) = best_preview(api, fid, ws_id, file_paths, fetch_p, !fast_url);
            json!({ "id": id, "ok": r == 0, "ret": r, "preview_data_url": preview, "preview_path": preview_path, "preview_source": preview_source })
        }

        "liquid_confirm" => {
            let mode = cmd_val.get("mode").and_then(|v| v.as_i64()).unwrap_or(1) as c_int;
            let fid = cmd_val.get("fid").and_then(|v| v.as_i64()).map(|x| x as i32).unwrap_or(*current_fid);
            let fast_url = cmd_val.get("fast_url").and_then(|v| v.as_bool()).unwrap_or(false);
            GENERIC_DONE.store(false, Ordering::SeqCst);
            RETOUCH_DONE.store(false, Ordering::SeqCst);
            let r = unsafe { (api.aipic_liquid_confirm)(mode, on_str_2 as *const c_void) };
            pump_until(6.0, Some(&GENERIC_DONE), None);
            pump_until(0.5, Some(&RETOUCH_DONE), None);
            let raw = generic_json().lock().map(|s| s.clone()).unwrap_or_default();
            let parsed_res: Value = serde_json::from_str::<Value>(&raw).unwrap_or(Value::String(raw));
            let liquid_params = parsed_res
                .get("param")
                .and_then(|p| p.as_str())
                .and_then(|s| serde_json::from_str::<Value>(s).ok())
                .and_then(|pv| pv.get("liquid_params").cloned())
                .or_else(|| parsed_res.get("param").and_then(|p| p.get("liquid_params")).cloned())
                .unwrap_or(Value::Null);
            let (preview, preview_path, preview_source) = best_preview(api, fid, ws_id, file_paths, true, !fast_url);
            json!({
                "id": id,
                "ok": r == 0,
                "ret": r,
                "preview_data_url": preview,
                "preview_path": preview_path,
                "preview_source": preview_source,
                "liquid_params": liquid_params,
                "result": parsed_res,
            })
        }

        "liquid_cancel" => {
            let mode = cmd_val.get("mode").and_then(|v| v.as_i64()).unwrap_or(1) as c_int;
            let fid = cmd_val.get("fid").and_then(|v| v.as_i64()).map(|x| x as i32).unwrap_or(*current_fid);
            let fast_url = cmd_val.get("fast_url").and_then(|v| v.as_bool()).unwrap_or(false);
            if let Some(f) = api.aipic_liquid_cancel {
                GENERIC_DONE.store(false, Ordering::SeqCst);
                let r = unsafe { f(mode, on_str_2 as *const c_void) };
                pump_until(4.0, Some(&GENERIC_DONE), None);
                let (preview, preview_path, preview_source) = best_preview(api, fid, ws_id, file_paths, true, !fast_url);
                return json!({ "id": id, "ok": r == 0, "ret": r, "preview_data_url": preview, "preview_path": preview_path, "preview_source": preview_source });
            }
            json!({ "id": id, "ok": false, "error": "aipic_liquid_cancel unavailable" })
        }

        "liquid_history" => {
            let fid = cmd_val.get("fid").and_then(|v| v.as_i64()).map(|x| x as i32).unwrap_or(*current_fid);
            let fast_url = cmd_val.get("fast_url").and_then(|v| v.as_bool()).unwrap_or(false);
            if let Some(f) = api.aipic_liquid_history {
                let p_str = match cmd_val.get("params") {
                    Some(Value::String(s)) => s.clone(),
                    Some(v) => v.to_string(),
                    None => "{}".to_string(),
                };
                if let Ok(c) = cstring_safe(&p_str) {
                    RETOUCH_DONE.store(false, Ordering::SeqCst);
                    let r = unsafe { f(c.as_ptr()) };
                    pump_until(2.0, Some(&RETOUCH_DONE), None);
                    let (preview, preview_path, preview_source) = best_preview(api, fid, ws_id, file_paths, true, !fast_url);
                    return json!({ "id": id, "ok": r == 0, "ret": r, "preview_data_url": preview, "preview_path": preview_path, "preview_source": preview_source });
                }
            }
            json!({ "id": id, "ok": false, "error": "aipic_liquid_history unavailable" })
        }

        "get_presets" => {
            let Some(f) = api.aipic_get_preset_group_item else {
                return json!({ "id": id, "ok": false, "error": "aipic_get_preset_group_item unavailable" });
            };
            PRESET_DONE.store(false, Ordering::SeqCst);
            let mut c: c_longlong = 1;
            let r = unsafe { f(&mut c, 0, true, on_preset_get as *const c_void) };
            pump_until(4.0, Some(&PRESET_DONE), None);
            let raw = preset_json().lock().map(|s| s.clone()).unwrap_or_default();
            json!({
                "id": id,
                "ok": r == 0,
                "groups": serde_json::from_str::<Value>(&raw).unwrap_or(Value::String(raw)),
            })
        }

        "preset_op" => {
            let op = cmd_val.get("op").and_then(|v| v.as_str()).unwrap_or("");
            let mut c: c_longlong = 1;
            let payload = match cmd_val.get("data") {
                Some(Value::String(s)) => s.clone(),
                Some(v) => v.to_string(),
                None => "{}".to_string(),
            };
            let item_id = cmd_val.get("item_id").and_then(|v| v.as_i64()).unwrap_or(0) as c_int;
            match op {
                "get_by_id" => {
                    if let Some(f) = api.aipic_get_preset_group_item_by_id {
                        PRESET_DONE.store(false, Ordering::SeqCst);
                        let r = unsafe { f(&mut c, item_id, on_preset_get as *const c_void) };
                        pump_until(4.0, Some(&PRESET_DONE), None);
                        let raw = preset_json().lock().map(|s| s.clone()).unwrap_or_default();
                        return json!({ "id": id, "ok": r == 0, "items": serde_json::from_str::<Value>(&raw).unwrap_or(Value::String(raw)) });
                    }
                }
                "insert_group" | "modify_group" | "insert_item" | "modify_item" => {
                    let func = match op {
                        "insert_group" => api.aipic_insert_preset_group_item,
                        "modify_group" => api.aipic_modify_preset_group_item,
                        "insert_item" => api.aipic_insert_preset_item,
                        _ => api.aipic_modify_preset_item,
                    };
                    if let (Some(f), Ok(pc)) = (func, cstring_safe(&payload)) {
                        WRITE_DONE.store(false, Ordering::SeqCst);
                        let r = unsafe { f(&mut c, pc.as_ptr(), on_write_item as *const c_void) };
                        pump_until(4.0, Some(&WRITE_DONE), None);
                        return json!({ "id": id, "ok": r == 0 && WRITE_ERR.load(Ordering::SeqCst) == 0, "ret": r, "err": WRITE_ERR.load(Ordering::SeqCst) });
                    }
                }
                "delete_group" | "delete_item" => {
                    let func = if op == "delete_group" {
                        api.aipic_delete_preset_group_item
                    } else {
                        api.aipic_delete_preset_item
                    };
                    if let Some(f) = func {
                        WRITE_DONE.store(false, Ordering::SeqCst);
                        let r = unsafe { f(&mut c, item_id, on_write_item as *const c_void) };
                        pump_until(4.0, Some(&WRITE_DONE), None);
                        return json!({ "id": id, "ok": r == 0 && WRITE_ERR.load(Ordering::SeqCst) == 0, "ret": r, "err": WRITE_ERR.load(Ordering::SeqCst) });
                    }
                }
                _ => {}
            }
            json!({ "id": id, "ok": false, "error": format!("Unsupported preset_op: {}", op) })
        }

        "camera_connect" => {
            let Some(f) = api.aipic_camera_connect else {
                return json!({ "id": id, "ok": false, "error": "aipic_camera_connect unavailable" });
            };
            let p_str = match cmd_val.get("params") {
                Some(Value::String(s)) => s.clone(),
                Some(v) => v.to_string(),
                None => "{}".to_string(),
            };
            if let Ok(c) = cstring_safe(&p_str) {
                let r = unsafe { f(c.as_ptr()) };
                pump_until(0.5, None, None);
                return json!({ "id": id, "ok": r == 0, "ret": r });
            }
            json!({ "id": id, "ok": false, "error": "Invalid params" })
        }

        "camera_disconnect" => {
            let Some(f) = api.aipic_camera_disconnect else {
                return json!({ "id": id, "ok": false, "error": "aipic_camera_disconnect unavailable" });
            };
            let p_str = match cmd_val.get("params") {
                Some(Value::String(s)) => s.clone(),
                Some(v) => v.to_string(),
                None => "{}".to_string(),
            };
            if let Ok(c) = cstring_safe(&p_str) {
                let r = unsafe { f(c.as_ptr()) };
                pump_until(0.2, None, None);
                return json!({ "id": id, "ok": r == 0, "ret": r });
            }
            json!({ "id": id, "ok": false, "error": "Invalid params" })
        }

        "camera_setting" => {
            let Some(f) = api.aipic_online_shooting_setting else {
                return json!({ "id": id, "ok": false, "error": "aipic_online_shooting_setting unavailable" });
            };
            let k = cmd_val.get("key").and_then(|v| v.as_str()).unwrap_or("");
            let v = match cmd_val.get("value") {
                Some(Value::String(s)) => s.clone(),
                Some(val) => val.to_string(),
                None => "".to_string(),
            };
            if let (Ok(kc), Ok(vc)) = (cstring_safe(k), cstring_safe(&v)) {
                let r = unsafe { f(kc.as_ptr(), vc.as_ptr()) };
                pump_until(0.15, None, None);
                return json!({ "id": id, "ok": r == 0, "ret": r });
            }
            json!({ "id": id, "ok": false, "error": "Invalid key/value" })
        }

        "poll_events" => {
            pump_messages_once();
            let evs = async_events()
                .lock()
                .map(|mut q| q.drain(..).collect::<Vec<_>>())
                .unwrap_or_default();
            json!({ "id": id, "ok": true, "events": evs })
        }

        "export" => {
            let fid = cmd_val.get("fid").and_then(|v| v.as_i64()).map(|x| x as i32).unwrap_or(*current_fid);
            if fid <= 0 {
                return json!({ "id": id, "ok": false, "error": "Chua mo anh de xuat" });
            }
            let seq = SEQ_COUNTER.fetch_add(1, Ordering::Relaxed);
            let exp_dir = ensure_ascii_work_dir().join("export").join(format!("e_{}_{}", std::process::id(), seq));
            if let Err(e) = std::fs::create_dir_all(&exp_dir) {
                return json!({ "id": id, "ok": false, "error": format!("Create export dir error: {e}") });
            }
            let export_type = cmd_val.get("export_type").and_then(|v| v.as_i64()).unwrap_or(2);
            let quality = cmd_val.get("quality").and_then(|v| v.as_i64()).unwrap_or(10);
            let max_size = cmd_val.get("export_max_size").and_then(|v| v.as_i64()).unwrap_or(0);
            let inner_setting = json!({
                "export_max_size": max_size,
                "quality": quality,
                "export_type": export_type
            })
            .to_string();
            let exp_json = json!({
                "version": "1.0",
                "fileitems": [{ "fileid": fid }],
                "by_origin_path": 0,
                "location": "0",
                "cid": "0",
                "create_new_folder": 0,
                "keep_import_folder": 0,
                "faceitems": [],
                "quality": quality,
                "export_setting": inner_setting
            });
            let dest_str = exp_dir.to_string_lossy().to_string();
            let Ok(dest_c) = cstring_safe(&dest_str) else {
                return json!({ "id": id, "ok": false, "error": "Invalid dest path" });
            };
            let Ok(exp_c) = cstring_safe(&exp_json.to_string()) else {
                return json!({ "id": id, "ok": false, "error": "Invalid export json" });
            };
            pump_until(0.5, None, None);
            EXPORT_DONE.store(false, Ordering::SeqCst);
            EXPORT_ID.store(0, Ordering::SeqCst);
            if let Ok(mut e) = export_event_json().lock() {
                e.clear();
            }
            let br = unsafe {
                (api.aipic_build_export_task)(
                    0,
                    ws_id as c_int,
                    dest_c.as_ptr(),
                    exp_c.as_ptr(),
                    on_export as *const c_void,
                )
            };
            if br != 0 {
                return json!({ "id": id, "ok": false, "error": format!("aipic_build_export_task ret={}", br) });
            }
            pump_until(90.0, Some(&EXPORT_DONE), None);
            for _ in 0..8 {
                if let Ok(rd) = std::fs::read_dir(&exp_dir) {
                    if let Some(file) = rd.flatten().find(|e| e.path().is_file()) {
                        let out_path = file.path();
                        if let Ok(bytes) = std::fs::read(&out_path) {
                            let mime = if out_path.extension().and_then(|s| s.to_str()).unwrap_or("").eq_ignore_ascii_case("png") {
                                "image/png"
                            } else {
                                "image/jpeg"
                            };
                            let data_url = format!("data:{};base64,{}", mime, BASE64.encode(&bytes));
                            if let Some(custom_dest) = cmd_val.get("dest_path").and_then(|v| v.as_str()).filter(|s| !s.is_empty()) {
                                let _ = std::fs::write(custom_dest, &bytes);
                            }
                            let _ = std::fs::remove_dir_all(&exp_dir);
                            let ev_raw = export_event_json().lock().map(|s| s.clone()).unwrap_or_default();
                            return json!({
                                "id": id,
                                "ok": true,
                                "bytes": bytes.len(),
                                "image_base64": data_url,
                                "event": serde_json::from_str::<Value>(&ev_raw).unwrap_or(Value::String(ev_raw)),
                            });
                        }
                    }
                }
                pump_until(0.5, None, None);
            }
            let ev_raw = export_event_json().lock().map(|s| s.clone()).unwrap_or_default();
            json!({
                "id": id,
                "ok": false,
                "error": "Export khong tao ra file dau ra",
                "event": serde_json::from_str::<Value>(&ev_raw).unwrap_or(Value::String(ev_raw)),
            })
        }

        "shutdown" => {
            delete_workspace_by_id(api, ws_id);
            emit_response(&json!({ "id": id, "ok": true, "exiting": true }));
            std::process::exit(0);
        }

        _ => json!({ "id": id, "ok": false, "error": format!("Unknown cmd: {}", cmd) }),
    }
}

fn delete_workspace_by_id(api: &AipicApi, ws_id: i64) {
    if ws_id <= 0 {
        return;
    }
    if let Some(del_fn) = api.aipic_delete_workspace_item {
        let payload = format!(r#"[{{"workspaceid":{}}}]"#, ws_id);
        if let Ok(pc) = cstring_safe(&payload) {
            let mut cookie: c_longlong = 1;
            WRITE_DONE.store(false, Ordering::SeqCst);
            let r = unsafe { del_fn(0, &mut cookie, pc.as_ptr(), on_write_item as *const c_void) };
            if r == 0 {
                pump_until(2.5, Some(&WRITE_DONE), None);
            }
        }
    }
}

fn purge_leaked_devstu_workspaces(api: &AipicApi) -> usize {
    let Some(get_fn) = api.aipic_get_workspace_item else {
        eprintln!("[PURGE] aipic_get_workspace_item symbol missing");
        return 0;
    };
    let Some(del_fn) = api.aipic_delete_workspace_item else {
        eprintln!("[PURGE] aipic_delete_workspace_item symbol missing");
        return 0;
    };
    if let Ok(mut p) = preset_json().lock() {
        p.clear();
    }
    let mut cookie: c_longlong = 11;
    PRESET_DONE.store(false, Ordering::SeqCst);
    let r = unsafe { get_fn(0, &mut cookie, 1, true, on_preset_get as *const c_void) };
    if r != 0 {
        eprintln!("[PURGE] ws_type=0 sort_by=1 ret={}", r);
        return 0;
    }
    pump_until(5.0, Some(&PRESET_DONE), None);
    let raw = preset_json().lock().map(|p| p.clone()).unwrap_or_default();
    let Ok(Value::Array(items)) = serde_json::from_str::<Value>(&raw) else {
        eprintln!("[PURGE] unexpected JSON len={}", raw.len());
        return 0;
    };
    let mut leaked_ids = Vec::new();
    let mut leaked_dirs = Vec::new();
    for it in &items {
        let name = it.get("name").and_then(|v| v.as_str()).unwrap_or("");
        let wid = it
            .get("workspaceid")
            .or_else(|| it.get("workspace_id"))
            .or_else(|| it.get("id"))
            .and_then(|v| v.as_i64().or_else(|| v.as_str().and_then(|s| s.parse::<i64>().ok())))
            .unwrap_or(0);
        let ws_path = it.get("path").and_then(|v| v.as_str()).unwrap_or("");
        let mtime = it.get("mtime").and_then(|v| v.as_str()).unwrap_or("");
        if wid > 0 && name.starts_with("DevstuUltraMax_") {
            eprintln!("[PURGE] matched leaked ws id={} name={} mtime={} path={}", wid, name, mtime, ws_path);
            leaked_ids.push(json!({ "workspaceid": wid }));
            if !ws_path.is_empty() {
                leaked_dirs.push(ws_path.to_string());
            }
        } else {
            eprintln!("[PURGE] keeping ws id={} name={} mtime={}", wid, name, mtime);
        }
    }
    let count = leaked_ids.len();
    if count > 0 {
        if let Ok(pc) = cstring_safe(&Value::Array(leaked_ids).to_string()) {
            let mut dc: c_longlong = 200;
            WRITE_DONE.store(false, Ordering::SeqCst);
            let dr = unsafe { del_fn(0, &mut dc, pc.as_ptr(), on_write_item as *const c_void) };
            let wdone = if dr == 0 { pump_until(5.0, Some(&WRITE_DONE), None) } else { false };
            let werr = WRITE_ERR.load(Ordering::SeqCst);
            eprintln!("[PURGE] delete dr={} done={} err={}", dr, wdone, werr);
            for d in leaked_dirs {
                let p = std::path::Path::new(&d);
                if p.exists() {
                    let _ = std::fs::remove_dir_all(p);
                }
            }
            return if dr == 0 && werr == 0 { count } else { 0 };
        }
    }
    0
}

fn main() {
    let purge_leaked = std::env::args().any(|a| a == "--purge-leaked-from-lk");
    let data_root = devstu_data_root();
    let iso_tmp = devstu_temp_root();
    let iso_appdata = devstu_appdata_root();
    if !purge_leaked {
        let _ = std::fs::create_dir_all(&data_root);
        let _ = std::fs::create_dir_all(&iso_tmp);
        let _ = std::fs::create_dir_all(&iso_appdata);
        unsafe {
            std::env::set_var("LOCALAPPDATA", &iso_appdata);
            std::env::set_var("TMP", &iso_tmp);
            std::env::set_var("TEMP", &iso_tmp);
        }
    }
    if std::env::var("AIPIC_BRIDGE_VERBOSE").ok().as_deref() == Some("1") {
        VERBOSE.store(true, Ordering::Relaxed);
    }
    start_mock_http();

    let lk_root = match find_lk_root() {
        Ok(r) => r,
        Err(e) => {
            emit_response(&json!({ "id": 0, "ok": false, "event": "bridge_error", "error": e }));
            std::process::exit(1);
        }
    };

    let iso_hook = if purge_leaked { None } else { Some(iso_appdata.as_path()) };
    let api = match unsafe { load_aipic_api(&lk_root, iso_hook) } {
        Ok(a) => a,
        Err(e) => {
            emit_response(&json!({ "id": 0, "ok": false, "event": "bridge_error", "error": e }));
            std::process::exit(1);
        }
    };

    unsafe {
        let cls_w = to_wide("STATIC");
        let title_w = to_wide("DevstuAipicHost");
        let hmod = GetModuleHandleW(std::ptr::null());
        let host_hwnd = CreateWindowExW(
            0,
            cls_w.as_ptr(),
            title_w.as_ptr(),
            0x8000_0000u32,
            0,
            0,
            1400,
            900,
            std::ptr::null_mut(),
            std::ptr::null_mut(),
            hmod,
            std::ptr::null_mut(),
        );
        let hwnd_str = if !host_hwnd.is_null() {
            (host_hwnd as usize).to_string()
        } else {
            "0".to_string()
        };
        if VERBOSE.load(Ordering::Relaxed) {
            eprintln!("[HOST_HWND] {}", hwnd_str);
        }
        let empty_c = CString::new("").unwrap();
        let hwnd_c = CString::new(hwnd_str.as_str()).unwrap();
        let gi = (api.aipic_global_init)(
            log_cb,
            event_cb,
            hwnd_c.as_ptr(),
            empty_c.as_ptr(),
            0,
            empty_c.as_ptr(),
        );
        if let Some(set_setting) = api.aipic_set_setting {
            let group = CString::new("local_info").unwrap();
            for (k, v) in [
                ("export_speed", "3"),
                ("compatibility_mode_acceleration", ""),
                ("gpu_enabled", "1"),
            ] {
                if let (Ok(kc), Ok(vc)) = (CString::new(k), CString::new(v)) {
                    let sr = set_setting(true, group.as_ptr(), kc.as_ptr(), vc.as_ptr());
                    if VERBOSE.load(Ordering::Relaxed) {
                        eprintln!("[SET_SETTING] {}={} -> {}", k, v, sr);
                    }
                }
            }
        }
        let wm_c = CString::new("http://127.0.0.1:8316/transparent_watermark.png").unwrap();
        let _ = (api.aipic_set_retouched_thumbnail_watermark)(wm_c.as_ptr(), on_wm as *const c_void);

        let cfg = r#"{"pcs_root":"http://127.0.0.1:8316/","netdisk_http_root_path":"http://127.0.0.1:8316/","netdisk_https_root_path":"http://127.0.0.1:8316/","pcs_root_path_http":"http://127.0.0.1:8316/","pcs_root_path_https":"http://127.0.0.1:8316/","pcs_upload_server":"http://127.0.0.1:8316/","sandbox_netdisk_http_root_path":"http://127.0.0.1:8316/","sandbox_netdisk_https_root_path":"http://127.0.0.1:8316/","sandbox_pcs_root_path_http":"http://127.0.0.1:8316/","sandbox_pcs_root_path_https":"http://127.0.0.1:8316/","sandbox_pcs_upload_server":"http://127.0.0.1:8316/","ua":"netdisk;5.31.5;PC;PC-Windows;10.0.22631;Heyon","channel":"Windows_10.0.22631_Heyon_netdisk_00000000000000000000000000000001","app_version":"5.31.5","client_type":0}"#;
        let cfg_c = CString::new(cfg).unwrap();
        let _ = (api.aipic_set_config)(0, cfg_c.as_ptr());

        let purge_leaked = std::env::args().any(|a| a == "--purge-leaked-from-lk");
        let login_json = if purge_leaked {
            r#"{"uk":"100000001","sign_key":"123456","BDUSS":"offline-bduss-lkmagic-pro-supervip-token","PTOKEN":"offline-ptoken-lkmagic-pro-supervip-token","STOKEN":"offline-stoken-lkmagic-pro-supervip-token","cookies":["BDUSS=offline-bduss-lkmagic-pro-supervip-token","PTOKEN=offline-ptoken-lkmagic-pro-supervip-token","STOKEN=offline-stoken-lkmagic-pro-supervip-token"],"mdr":"1","wdr":"1"}"#
        } else {
            // Keep offline VIP account identity ("uk":"100000001") while isolating profile directory ("mdr"/"wdr":"devstu_umx") from 9. LK Magic Pro ("1").
            r#"{"uk":"100000001","sign_key":"123456","BDUSS":"offline-bduss-lkmagic-pro-supervip-token","PTOKEN":"offline-ptoken-lkmagic-pro-supervip-token","STOKEN":"offline-stoken-lkmagic-pro-supervip-token","cookies":["BDUSS=offline-bduss-lkmagic-pro-supervip-token","PTOKEN=offline-ptoken-lkmagic-pro-supervip-token","STOKEN=offline-stoken-lkmagic-pro-supervip-token"],"mdr":"devstu_umx","wdr":"devstu_umx"}"#
        };
        let login_c = CString::new(login_json).unwrap();
        let _ = (api.aipic_set_login_state)(login_c.as_ptr());

        pump_until(20.0, Some(&MODEL_READY), None);

        if purge_leaked {
            let deleted = purge_leaked_devstu_workspaces(&api);
            println!("PURGED_LEAKED_DEVSTU_WORKSPACES={}", deleted);
            std::process::exit(0);
        }

        GENERIC_DONE.store(false, Ordering::SeqCst);
        let _ = (api.aipic_get_image_backgroud_info)(on_bg_info as *const c_void);
        pump_until(4.0, Some(&GENERIC_DONE), None);

        if let Some(get_mat) = api.aipic_get_material_info {
            GENERIC_DONE.store(false, Ordering::SeqCst);
            let _ = get_mat(2, on_material_info as *const c_void);
            pump_until(2.5, Some(&GENERIC_DONE), None);
        }

        let mut win_cookie: c_longlong = 1;
        let win_sz_c = CString::new(r#"{"resize":{"x":0,"y":60,"viewW":1400,"viewH":900,"windowW":1920,"windowH":1080,"scaleFactor":1.0}}"#).unwrap();
        let _ = (api.aipic_window_event)(&mut win_cookie, 100, win_sz_c.as_ptr());
        pump_until(0.3, None, None);

        let mut cookie_gen: c_longlong = 10;
        let ts = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs();
        let ws_c = CString::new(format!(r#"{{"name":"DevstuUltraMax_{}_{}","option":"{{}}"}}"#, std::process::id(), ts)).unwrap();
        WS_DONE.store(false, Ordering::SeqCst);
        let _ = (api.aipic_insert_workspace_item)(0, &mut cookie_gen, ws_c.as_ptr(), on_ws as *const c_void);
        pump_until(6.0, Some(&WS_DONE), None);
        let ws_id = WS_ID.load(Ordering::SeqCst);

        emit_response(&json!({
            "id": 0,
            "ok": gi == 0 && ws_id > 0,
            "event": "bridge_ready",
            "global_init": gi,
            "model_ready": MODEL_READY.load(Ordering::SeqCst),
            "ws_id": ws_id,
            "lk_root": lk_root.to_string_lossy()
        }));

        static STDIN_EOF: AtomicBool = AtomicBool::new(false);
        let (tx, rx) = mpsc::channel::<String>();
        std::thread::spawn(move || {
            let stdin = std::io::stdin();
            let reader = BufReader::new(stdin.lock());
            for line in reader.lines() {
                match line {
                    Ok(l) => {
                        let t = l.trim().to_string();
                        if !t.is_empty() && tx.send(t).is_err() {
                            break;
                        }
                    }
                    Err(_) => break,
                }
            }
            STDIN_EOF.store(true, Ordering::SeqCst);
        });

        let mut current_fid: i32 = -1;
        let mut retouch_seq: i64 = 1;
        let mut file_paths: HashMap<i32, String> = HashMap::new();
        loop {
            pump_messages_once();
            let mut processed_any = false;
            while let Ok(line) = rx.try_recv() {
                processed_any = true;
                match serde_json::from_str::<Value>(&line) {
                    Ok(v) => {
                        let resp = handle_command(
                            &api,
                            &v,
                            ws_id,
                            &mut cookie_gen,
                            &mut win_cookie,
                            &mut current_fid,
                            &mut retouch_seq,
                            &mut file_paths,
                        );
                        emit_response(&resp);
                    }
                    Err(e) => {
                        emit_response(&json!({ "id": 0, "ok": false, "error": format!("Bad JSON: {e}") }));
                    }
                }
            }
            if !processed_any && STDIN_EOF.load(Ordering::SeqCst) {
                break;
            }
            std::thread::sleep(Duration::from_millis(12));
        }
        delete_workspace_by_id(&api, ws_id);
        std::process::exit(0);
    }
}
