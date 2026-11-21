use serde_json::{json, Value};
use std::collections::HashMap;
use std::io::{BufRead, BufReader, Write};
use std::path::{Path, PathBuf};
use std::process::{Child, ChildStdin, Command, Stdio};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{mpsc, Mutex, OnceLock};
use std::time::{Duration, Instant};

const RESP_PREFIX: &str = "@BRIDGE_RESP@ ";

struct BridgeProcess {
    child: Child,
    stdin: ChildStdin,
    pending: std::sync::Arc<Mutex<HashMap<u64, mpsc::Sender<Value>>>>,
    ready_info: Value,
}

static BRIDGE: OnceLock<Mutex<Option<BridgeProcess>>> = OnceLock::new();
static NEXT_ID: AtomicU64 = AtomicU64::new(1);

fn bridge_slot() -> &'static Mutex<Option<BridgeProcess>> {
    BRIDGE.get_or_init(|| Mutex::new(None))
}

/// Resolve the local `lk_runtime` AI engine directory co-located with the app bundle.
pub fn find_lk_root(base_dir: &Path) -> Option<PathBuf> {
    let mut candidates: Vec<PathBuf> = Vec::new();
    if let Ok(env_p) = std::env::var("DEVSTU_LK_ROOT") {
        if !env_p.trim().is_empty() {
            candidates.push(PathBuf::from(env_p));
        }
    }
    candidates.push(base_dir.join("lk_runtime"));
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
    if let Ok(cwd) = std::env::current_dir() {
        candidates.push(cwd.join("lk_runtime"));
    }
    candidates.into_iter().find(|p| p.join("aipic.dll").is_file())
}

fn find_bridge_exe(base_dir: &Path) -> Result<PathBuf, String> {
    let mut candidates: Vec<PathBuf> = Vec::new();
    if let Ok(exe) = std::env::current_exe() {
        if let Some(dir) = exe.parent() {
            candidates.push(dir.join("aipic_bridge.exe"));
        }
    }
    candidates.push(base_dir.join("aipic_bridge.exe"));
    candidates.push(base_dir.join("src-tauri").join("target").join("release").join("aipic_bridge.exe"));
    candidates.push(base_dir.join("src-tauri").join("target").join("debug").join("aipic_bridge.exe"));

    if let Some(found) = candidates.into_iter().find(|p| p.is_file()) {
        return Ok(found);
    }
    Err("Khong tim thay aipic_bridge.exe; vui long dat canh DEVSTU.exe".to_string())
}

fn strip_unc_prefix(p: PathBuf) -> PathBuf {
    let s = p.to_string_lossy();
    if let Some(rest) = s.strip_prefix(r"\\?\") {
        PathBuf::from(rest)
    } else {
        p
    }
}

pub fn devstu_data_root(base_dir: &Path) -> PathBuf {
    strip_unc_prefix(base_dir.to_path_buf()).join("_data")
}

pub fn devstu_temp_root(base_dir: &Path) -> PathBuf {
    devstu_data_root(base_dir).join("tmp")
}

fn spawn_bridge(base_dir: &Path) -> Result<BridgeProcess, String> {
    let exe = find_bridge_exe(base_dir)?;
    let lk_root = strip_unc_prefix(
        find_lk_root(base_dir)
            .ok_or_else(|| "Khong tim thay thu muc lk_runtime (aipic.dll)".to_string())?,
    );

    let data_root = devstu_data_root(base_dir);
    let tmp_dir = data_root.join("tmp");
    let isolated_appdata = data_root.join("appdata");
    let _ = std::fs::create_dir_all(&data_root);
    let _ = std::fs::create_dir_all(&tmp_dir);
    let _ = std::fs::create_dir_all(&isolated_appdata);

    let mut cmd = Command::new(&exe);
    cmd.env("DEVSTU_LK_ROOT", &lk_root)
        .env("DEVSTU_DATA_DIR", &data_root)
        .env("LOCALAPPDATA", &isolated_appdata)
        .env("TMP", &tmp_dir)
        .env("TEMP", &tmp_dir)
        .env("HEYON_NATIVE_PERFORMANCE", "1")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null());

    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x08000000);
    }

    let mut child = cmd
        .spawn()
        .map_err(|e| format!("Khong khoi dong duoc aipic_bridge.exe: {e}"))?;

    let stdin = child
        .stdin
        .take()
        .ok_or_else(|| "Khong mo duoc stdin cho aipic_bridge".to_string())?;
    let stdout = child
        .stdout
        .take()
        .ok_or_else(|| "Khong mo duoc stdout cho aipic_bridge".to_string())?;

    let pending: std::sync::Arc<Mutex<HashMap<u64, mpsc::Sender<Value>>>> =
        std::sync::Arc::new(Mutex::new(HashMap::new()));
    let (ready_tx, ready_rx) = mpsc::channel::<Value>();
    let pending_reader = std::sync::Arc::clone(&pending);

    std::thread::spawn(move || {
        let mut ready_opt = Some(ready_tx);
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            let Ok(raw) = line else { break };
            let Some(json_str) = raw.strip_prefix(RESP_PREFIX) else {
                continue;
            };
            let Ok(val) = serde_json::from_str::<Value>(json_str) else {
                continue;
            };
            let id = val.get("id").and_then(|v| v.as_u64()).unwrap_or(0);
            if id == 0 {
                if let Some(tx) = ready_opt.take() {
                    let _ = tx.send(val);
                    continue;
                }
            }
            if let Ok(mut map) = pending_reader.lock() {
                if let Some(tx) = map.remove(&id) {
                    let _ = tx.send(val);
                }
            }
        }
        if let Some(tx) = ready_opt.take() {
            let _ = tx.send(json!({ "id": 0, "ok": false, "error": "aipic_bridge da thoat som khi khoi dong" }));
        }
        if let Ok(mut map) = pending_reader.lock() {
            for (_, tx) in map.drain() {
                let _ = tx.send(json!({ "ok": false, "error": "aipic_bridge da ngat ket noi" }));
            }
        }
    });

    let ready_info = ready_rx
        .recv_timeout(Duration::from_secs(30))
        .map_err(|_| {
            let _ = child.kill();
            "Het thoi gian cho aipic_bridge khoi tao aipic.dll".to_string()
        })?;

    if !ready_info.get("ok").and_then(|v| v.as_bool()).unwrap_or(false) {
        let _ = child.kill();
        let err = ready_info
            .get("error")
            .and_then(|v| v.as_str())
            .unwrap_or("Khoi tao aipic.dll that bai");
        return Err(err.to_string());
    }

    Ok(BridgeProcess {
        child,
        stdin,
        pending,
        ready_info,
    })
}

fn ensure_running<'a>(
    guard: &'a mut Option<BridgeProcess>,
    base_dir: &Path,
) -> Result<&'a mut BridgeProcess, String> {
    let alive = match guard.as_mut() {
        Some(proc_state) => matches!(proc_state.child.try_wait(), Ok(None)),
        None => false,
    };
    if !alive {
        *guard = None;
        *guard = Some(spawn_bridge(base_dir)?);
    }
    guard
        .as_mut()
        .ok_or_else(|| "Bridge unavailable".to_string())
}

/// Ensure the persistent `aipic_bridge.exe` worker is started and return its startup metadata.
pub fn init(base_dir: &Path) -> Result<Value, String> {
    let mut guard = bridge_slot()
        .lock()
        .map_err(|_| "Bridge lock poisoned".to_string())?;
    let proc_state = ensure_running(&mut guard, base_dir)?;
    Ok(proc_state.ready_info.clone())
}

/// Send one synchronous command to `aipic_bridge.exe` and wait up to `timeout` for its reply.
pub fn call(base_dir: &Path, cmd: &str, mut payload: Value, timeout: Duration) -> Result<Value, String> {
    let req_id = NEXT_ID.fetch_add(1, Ordering::Relaxed);
    if !payload.is_object() {
        payload = json!({});
    }
    if let Some(obj) = payload.as_object_mut() {
        obj.insert("id".to_string(), Value::from(req_id));
        obj.insert("cmd".to_string(), Value::from(cmd));
    }
    let line = format!("{}\n", payload);

    let (rx, pending, timed_pid) = {
        let mut guard = bridge_slot()
            .lock()
            .map_err(|_| "Bridge lock poisoned".to_string())?;
        let proc_state = ensure_running(&mut guard, base_dir)?;
        let (tx, rx) = mpsc::channel::<Value>();
        if let Ok(mut map) = proc_state.pending.lock() {
            map.insert(req_id, tx);
        }
        if let Err(e) = proc_state
            .stdin
            .write_all(line.as_bytes())
            .and_then(|_| proc_state.stdin.flush())
        {
            if let Ok(mut map) = proc_state.pending.lock() {
                map.remove(&req_id);
            }
            let _ = proc_state.child.kill();
            *guard = None;
            return Err(format!("Ghi lenh toi aipic_bridge that bai: {e}"));
        }
        (rx, std::sync::Arc::clone(&proc_state.pending), proc_state.child.id())
    };

    match rx.recv_timeout(timeout) {
        Ok(resp) => Ok(resp),
        Err(_) => {
            if let Ok(mut map) = pending.lock() {
                map.remove(&req_id);
            }
            // Terminate wedged worker so the next command spawns a clean bridge instead of blocking forever
            if let Ok(mut guard) = bridge_slot().lock() {
                if let Some(ps) = guard.as_mut() {
                    if ps.child.id() == timed_pid {
                        let _ = ps.child.kill();
                        *guard = None;
                    }
                }
            }
            Err(format!("Lenh '{cmd}' toi aipic_bridge bi timeout"))
        }
    }
}

/// Resolve a safe local asset path inside `lk_runtime` resources for UI swatches/skies/examples.
pub fn resolve_lk_asset_path(base_dir: &Path, rel_or_abs: &str) -> Option<PathBuf> {
    let lk_root = find_lk_root(base_dir)?;
    let trimmed = rel_or_abs.trim().replace('\\', "/");
    if trimmed.is_empty() {
        return None;
    }

    let root_canon = lk_root.canonicalize().ok()?;
    let mut candidates: Vec<PathBuf> = Vec::new();
    let p = Path::new(&trimmed);
    if p.is_absolute() {
        candidates.push(p.to_path_buf());
    } else {
        let clean = trimmed.trim_start_matches("./").trim_start_matches('/');
        candidates.push(lk_root.join(clean));
        candidates.push(lk_root.join("resources").join(clean));
        candidates.push(lk_root.join("resources").join("render").join(clean));
        candidates.push(lk_root.join("resources").join("electron_res").join(clean));
    }

    for cand in candidates {
        if let Ok(canon) = cand.canonicalize() {
            if canon.starts_with(&root_canon) && canon.is_file() {
                return Some(canon);
            }
        }
    }
    None
}

/// Resolve a safe generated preview image file path inside isolated DEVSTU cache dirs.
pub fn resolve_preview_file_path(base_dir: &Path, raw_path: &str) -> Option<PathBuf> {
    let trimmed = raw_path.trim();
    if trimmed.is_empty() {
        return None;
    }
    let canon = Path::new(trimmed).canonicalize().ok()?;
    if !canon.is_file() {
        return None;
    }
    let ext = canon
        .extension()
        .and_then(|e| e.to_str())
        .map(|e| e.to_ascii_lowercase())
        .unwrap_or_default();
    if !matches!(ext.as_str(), "png" | "jpg" | "jpeg" | "webp" | "bmp" | "data") {
        return None;
    }
    let mut allowed_roots = vec![
        devstu_temp_root(base_dir),
        std::env::temp_dir(),
        base_dir.to_path_buf(),
    ];
    if let Some(la) = std::env::var_os("LOCALAPPDATA") {
        allowed_roots.push(PathBuf::from(la).join("Ai-Photo"));
    }
    if let Some(up) = std::env::var_os("USERPROFILE") {
        allowed_roots.push(PathBuf::from(up).join("AppData").join("Local").join("Ai-Photo"));
    }
    for root in &allowed_roots {
        if let Ok(rc) = root.canonicalize() {
            if canon.starts_with(&rc) {
                return Some(canon);
            }
        }
    }
    None
}

/// Gracefully terminate `aipic_bridge.exe` if it is running.
pub fn shutdown() {
    let Ok(mut guard) = bridge_slot().lock() else {
        return;
    };
    let Some(mut proc_state) = guard.take() else {
        return;
    };

    let _ = proc_state
        .stdin
        .write_all(br#"{"id":99999999,"cmd":"shutdown"}"#);
    let _ = proc_state.stdin.write_all(b"\n");
    let _ = proc_state.stdin.flush();

    let start = Instant::now();
    while start.elapsed() < Duration::from_millis(600) {
        if let Ok(Some(_)) = proc_state.child.try_wait() {
            return;
        }
        std::thread::sleep(Duration::from_millis(40));
    }
    let _ = proc_state.child.kill();
    let _ = proc_state.child.wait();
}
