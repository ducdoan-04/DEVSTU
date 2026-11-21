use std::fs::File;
use std::io::{BufRead, BufReader, Write};
use std::path::{Path, PathBuf};
use std::process::{Child, ChildStdin, ChildStdout, Command, Stdio};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Mutex, OnceLock};
use tiny_http::{Header, Method, Request, Response, Server, StatusCode};
use url::Url;
use base64::engine::general_purpose::STANDARD as BASE64;
use base64::Engine;

static REQ_SEQ: AtomicU64 = AtomicU64::new(1);

fn next_temp_tag() -> String {
    let pid = std::process::id();
    let seq = REQ_SEQ.fetch_add(1, Ordering::Relaxed);
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis();
    format!("{pid}_{now}_{seq}")
}

fn project_temp_dir(base_dir: &Path) -> PathBuf {
    let dir = crate::lk_bridge::devstu_temp_root(base_dir);
    let _ = std::fs::create_dir_all(&dir);
    dir
}

fn configure_python_cmd(cmd: &mut std::process::Command, base_dir: &Path) {
    let tmp_dir = project_temp_dir(base_dir);
    cmd.env("PYTHONUTF8", "1")
        .env("PYTHONIOENCODING", "utf-8")
        .env("TMP", &tmp_dir)
        .env("TEMP", &tmp_dir);
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x08000000);
    }
}

fn find_python(base_dir: &Path) -> String {
    let mut candidates: Vec<PathBuf> = vec![
        base_dir.join("python-embed").join("python.exe"),
        base_dir.join("LiYing-master").join("python-embed").join("python.exe"),
    ];
    if let Ok(exe) = std::env::current_exe() {
        if let Some(dir) = exe.parent() {
            candidates.push(dir.join("python-embed").join("python.exe"));
        }
    }
    for p in candidates {
        if p.is_file() {
            return p.to_string_lossy().to_string();
        }
    }
    "python".to_string()
}

struct LkMatteDaemon {
    child: Child,
    stdin: ChildStdin,
    stdout: BufReader<ChildStdout>,
    next_id: u64,
}

impl LkMatteDaemon {
    fn spawn(base_dir: &Path) -> Result<Self, String> {
        let script = base_dir.join("scripts").join("lk_matting_pipeline.py");
        if !script.exists() {
            return Err("Could not locate scripts/lk_matting_pipeline.py".to_string());
        }
        let py = find_python(base_dir);
        let mut cmd = Command::new(&py);
        cmd.arg(&script)
            .arg("--daemon")
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::null());
        configure_python_cmd(&mut cmd, base_dir);

        let mut child = cmd.spawn().map_err(|e| format!("Failed to spawn LK daemon: {e}"))?;
        let stdin = child.stdin.take().ok_or("Missing daemon stdin")?;
        let stdout_raw = child.stdout.take().ok_or("Missing daemon stdout")?;
        let mut stdout = BufReader::new(stdout_raw);

        // Wait for {"status":"ready",...}
        let mut ready_line = String::new();
        loop {
            ready_line.clear();
            let n = stdout.read_line(&mut ready_line).map_err(|e| format!("Daemon handshake read failed: {e}"))?;
            if n == 0 {
                let _ = child.kill();
                return Err("LK daemon exited during startup".to_string());
            }
            let trimmed = ready_line.trim();
            if trimmed.is_empty() {
                continue;
            }
            if let Ok(v) = serde_json::from_str::<serde_json::Value>(trimmed) {
                if v.get("status").and_then(|s| s.as_str()) == Some("ready") {
                    break;
                }
            }
        }

        Ok(Self {
            child,
            stdin,
            stdout,
            next_id: 1,
        })
    }

    fn call(&mut self, mut req: serde_json::Value) -> Result<serde_json::Value, String> {
        if let Ok(Some(_)) = self.child.try_wait() {
            return Err("LK daemon exited".to_string());
        }
        let id = self.next_id.to_string();
        self.next_id += 1;
        if let Some(obj) = req.as_object_mut() {
            obj.insert("id".to_string(), serde_json::Value::String(id.clone()));
        }
        let line = serde_json::to_string(&req).map_err(|e| e.to_string())?;
        self.stdin
            .write_all(line.as_bytes())
            .and_then(|_| self.stdin.write_all(b"\n"))
            .and_then(|_| self.stdin.flush())
            .map_err(|e| format!("Daemon write error: {e}"))?;

        let mut resp_line = String::new();
        loop {
            resp_line.clear();
            let n = self.stdout.read_line(&mut resp_line).map_err(|e| format!("Daemon read error: {e}"))?;
            if n == 0 {
                return Err("LK daemon closed stdout".to_string());
            }
            let trimmed = resp_line.trim();
            if trimmed.is_empty() {
                continue;
            }
            let v: serde_json::Value = serde_json::from_str(trimmed)
                .map_err(|e| format!("Daemon invalid JSON: {e}"))?;
            if v.get("id").and_then(|x| x.as_str()) == Some(id.as_str()) {
                return Ok(v);
            }
        }
    }
}

fn lk_daemon_pool() -> &'static Mutex<Option<LkMatteDaemon>> {
    static POOL: OnceLock<Mutex<Option<LkMatteDaemon>>> = OnceLock::new();
    POOL.get_or_init(|| Mutex::new(None))
}

fn lk_daemon_call(base_dir: &Path, req: serde_json::Value) -> Result<serde_json::Value, String> {
    let mut guard = lk_daemon_pool().lock().map_err(|_| "LK daemon mutex poisoned".to_string())?;
    if guard.is_none() {
        *guard = Some(LkMatteDaemon::spawn(base_dir)?);
    }
    let res = match guard.as_mut() {
        Some(d) => d.call(req.clone()),
        None => Err("Daemon unavailable".to_string()),
    };
    match res {
        Ok(val) => Ok(val),
        Err(_) => {
            // Respawn once if stale
            if let Some(mut old) = guard.take() {
                let _ = old.child.kill();
            }
            let mut fresh = LkMatteDaemon::spawn(base_dir)?;
            let val = fresh.call(req)?;
            *guard = Some(fresh);
            Ok(val)
        }
    }
}

fn add_cors_headers<R: std::io::Read>(mut resp: Response<R>) -> Response<R> {
    let headers = [
        ("Cross-Origin-Opener-Policy", "same-origin"),
        ("Cross-Origin-Embedder-Policy", "require-corp"),
        ("Access-Control-Allow-Origin", "*"),
        ("Access-Control-Allow-Methods", "GET, POST, OPTIONS"),
        ("Access-Control-Allow-Headers", "*"),
    ];
    for (name, val) in headers {
        if let Ok(h) = Header::from_bytes(name.as_bytes(), val.as_bytes()) {
            resp = resp.with_header(h);
        }
    }
    resp
}

fn with_content_type<R: std::io::Read>(mut resp: Response<R>, ct: &str) -> Response<R> {
    if let Ok(h) = Header::from_bytes(b"Content-Type", ct.as_bytes()) {
        resp = resp.with_header(h);
    }
    resp
}

fn get_mime_type(path: &Path) -> &'static str {
    match path.extension().and_then(|s| s.to_str()).unwrap_or("") {
        "html" => "text/html; charset=utf-8",
        "js" | "mjs" => "text/javascript; charset=utf-8",
        "css" => "text/css; charset=utf-8",
        "json" => "application/json; charset=utf-8",
        "wasm" => "application/wasm",
        "png" => "image/png",
        "jpg" | "jpeg" => "image/jpeg",
        "ico" => "image/x-icon",
        "svg" => "image/svg+xml",
        "woff" => "font/woff",
        "woff2" => "font/woff2",
        "txt" => "text/plain; charset=utf-8",
        "bin" | "enc" | "onnx" | "tul" | "task" | "tflite" => "application/octet-stream",
        _ => "application/octet-stream",
    }
}

fn strip_unc_prefix(p: PathBuf) -> PathBuf {
    let s = p.to_string_lossy();
    if let Some(rest) = s.strip_prefix(r"\\?\") {
        PathBuf::from(rest)
    } else {
        p
    }
}

pub fn find_base_dir() -> PathBuf {
    // 1. Check current directory and parents
    if let Ok(cwd) = std::env::current_dir() {
        if cwd.join("index.html").exists() {
            return strip_unc_prefix(cwd);
        }
        if cwd.join("..").join("index.html").exists() {
            if let Ok(p) = cwd.join("..").canonicalize() {
                return strip_unc_prefix(p);
            }
        }
    }
    // 2. Check exe directory and parents
    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(parent) = exe_path.parent() {
            if parent.join("index.html").exists() {
                return strip_unc_prefix(parent.to_path_buf());
            }
            if let Some(gp) = parent.parent() {
                if gp.join("index.html").exists() {
                    return strip_unc_prefix(gp.to_path_buf());
                }
                if let Some(ggp) = gp.parent() {
                    if ggp.join("index.html").exists() {
                        return strip_unc_prefix(ggp.to_path_buf());
                    }
                }
            }
        }
    }
    PathBuf::from(".")
}


fn decode_data_url_bytes(data: &str) -> Result<Vec<u8>, String> {
    let b64 = if let Some(idx) = data.find(',') {
        &data[idx + 1..]
    } else {
        data
    };
    BASE64.decode(b64.trim().as_bytes())
        .map_err(|e| format!("Base64 decode error: {e}"))
}

fn liying_change_background(
    img_b64: &str,
    color: &str,
    transparent: bool,
    straighten: bool,
    level_only: bool,
    base_dir: &Path,
) -> Result<String, String> {
    let start = std::time::Instant::now();
    let img_bytes = decode_data_url_bytes(img_b64)?;

    let script_paths = [
        base_dir.join("scripts").join("liying_process.py"),
        PathBuf::from("scripts/liying_process.py"),
    ];
    let script = script_paths.iter().find(|p| p.exists())
        .ok_or_else(|| "Could not locate scripts/liying_process.py".to_string())?;

    let py = find_python(base_dir);

    let temp_dir = project_temp_dir(base_dir);
    let tag = next_temp_tag();
    let temp_input = temp_dir.join(format!("devstu_liying_in_{tag}.png"));
    let temp_output = temp_dir.join(format!("devstu_liying_out_{tag}.png"));
    let temp_matte = temp_dir.join(format!("devstu_liying_matte_{tag}.png"));

    std::fs::write(&temp_input, &img_bytes)
        .map_err(|e| format!("Failed to save temp input: {e}"))?;

    let mut cmd = std::process::Command::new(&py);
    cmd.arg(script)
        .arg("--input").arg(&temp_input)
        .arg("--output").arg(&temp_output)
        .arg("--matte-output").arg(&temp_matte)
        .arg("--color").arg(color);

    if transparent {
        cmd.arg("--transparent");
    }
    if straighten {
        cmd.arg("--straighten");
    }
    if level_only {
        cmd.arg("--level-only");
    }

    configure_python_cmd(&mut cmd, base_dir);

    let output = cmd.output().map_err(|e| format!("Failed to spawn LiYing process: {e}"))?;
    let _ = std::fs::remove_file(&temp_input);

    if !output.status.success() {
        let err_str = String::from_utf8_lossy(&output.stderr);
        let _ = std::fs::remove_file(&temp_output);
        let _ = std::fs::remove_file(&temp_matte);
        return Err(format!("LiYing background replacement failed: {err_str}"));
    }

    if !temp_output.exists() {
        let _ = std::fs::remove_file(&temp_matte);
        return Err("LiYing output image was not produced".to_string());
    }

    let out_bytes = std::fs::read(&temp_output).map_err(|e| e.to_string())?;
    let _ = std::fs::remove_file(&temp_output);

    let matte_data_url = if temp_matte.exists() {
        let m_bytes = std::fs::read(&temp_matte).ok();
        let _ = std::fs::remove_file(&temp_matte);
        m_bytes.map(|b| format!("data:image/png;base64,{}", BASE64.encode(b)))
    } else {
        None
    };

    let data_url = format!("data:image/png;base64,{}", BASE64.encode(&out_bytes));
    let stdout_str = String::from_utf8_lossy(&output.stdout);
    let straightened = stdout_str.contains("\"straightened\": true");

    let res = serde_json::json!({
        "ok": true,
        "data_url": data_url,
        "matte_data_url": matte_data_url,
        "straightened": straightened,
        "elapsed_ms": start.elapsed().as_millis()
    });

    Ok(res.to_string())
}

fn lk_extract_matte_only(img_b64: &str, base_dir: &Path) -> Result<String, String> {
    let start = std::time::Instant::now();
    // 1. Try persistent Python daemon first for ~150-300ms warm inference
    let daemon_req = serde_json::json!({
        "action": "matte_only",
        "image_base64": img_b64,
        "return_matte": true
    });
    if let Ok(dres) = lk_daemon_call(base_dir, daemon_req) {
        if dres.get("status").and_then(|s| s.as_str()) == Some("ok") {
            if let Some(matte_b64) = dres.get("matte_base64").and_then(|s| s.as_str()) {
                let res = serde_json::json!({
                    "ok": true,
                    "matte_data_url": matte_b64,
                    "width": dres.get("width"),
                    "height": dres.get("height"),
                    "elapsed_ms": dres.get("elapsed_ms").cloned().unwrap_or_else(|| serde_json::json!(start.elapsed().as_millis())),
                    "engine": "LK Magic Pro + GuidedFilter (Daemon)"
                });
                return Ok(res.to_string());
            }
        }
    }

    // 2. Fallback to single-shot lk_matting_pipeline.py --matte-output (skip unused composite)
    let img_bytes = decode_data_url_bytes(img_b64)?;
    let script = base_dir.join("scripts").join("lk_matting_pipeline.py");
    if !script.exists() {
        return Err("Could not locate scripts/lk_matting_pipeline.py".to_string());
    }
    let py = find_python(base_dir);
    let temp_dir = project_temp_dir(base_dir);
    let tag = next_temp_tag();
    let temp_input = temp_dir.join(format!("devstu_lk_min_{tag}.png"));
    let temp_matte = temp_dir.join(format!("devstu_lk_m_{tag}.png"));

    std::fs::write(&temp_input, &img_bytes)
        .map_err(|e| format!("Failed to save temp input: {e}"))?;

    let mut cmd = std::process::Command::new(&py);
    cmd.arg(&script)
        .arg("--input").arg(&temp_input)
        .arg("--matte-output").arg(&temp_matte);

    configure_python_cmd(&mut cmd, base_dir);

    let output = cmd.output().map_err(|e| format!("Failed to spawn LK matte process: {e}"))?;
    let _ = std::fs::remove_file(&temp_input);

    if !output.status.success() || !temp_matte.exists() {
        let err_str = String::from_utf8_lossy(&output.stderr);
        let _ = std::fs::remove_file(&temp_matte);
        return Err(format!("LK matte extraction failed: {err_str}"));
    }

    let m_bytes = std::fs::read(&temp_matte).map_err(|e| e.to_string())?;
    let _ = std::fs::remove_file(&temp_matte);
    let matte_data_url = format!("data:image/png;base64,{}", BASE64.encode(m_bytes));

    let res = serde_json::json!({
        "ok": true,
        "matte_data_url": matte_data_url,
        "elapsed_ms": start.elapsed().as_millis(),
        "engine": "LK Magic Pro + GuidedFilter"
    });
    Ok(res.to_string())
}

fn lk_matting_process(
    img_b64: &str,
    color: &str,
    transparent: bool,
    sky: bool,
    base_dir: &Path,
) -> Result<String, String> {
    let start = std::time::Instant::now();
    // Try fast persistent daemon for portrait matting + BGFusion composite
    if !sky {
        let daemon_req = serde_json::json!({
            "action": "composite",
            "image_base64": img_b64,
            "color": color,
            "transparent": transparent,
            "return_matte": true
        });
        if let Ok(dres) = lk_daemon_call(base_dir, daemon_req) {
            if dres.get("status").and_then(|s| s.as_str()) == Some("ok") {
                if let Some(data_url) = dres.get("data_url").and_then(|s| s.as_str()) {
                    let res = serde_json::json!({
                        "ok": true,
                        "data_url": data_url,
                        "matte_data_url": dres.get("matte_base64"),
                        "elapsed_ms": dres.get("elapsed_ms").cloned().unwrap_or_else(|| serde_json::json!(start.elapsed().as_millis())),
                        "engine": "LK Magic Pro + BGFusion (Daemon)"
                    });
                    return Ok(res.to_string());
                }
            }
        }
    }

    let img_bytes = decode_data_url_bytes(img_b64)?;

    let script = base_dir.join("scripts").join("lk_matting_pipeline.py");
    if !script.exists() {
        return Err("Could not locate scripts/lk_matting_pipeline.py".to_string());
    }

    let py = find_python(base_dir);

    let temp_dir = project_temp_dir(base_dir);
    let tag = next_temp_tag();
    let temp_input = temp_dir.join(format!("devstu_lk_in_{tag}.png"));
    let temp_output = temp_dir.join(format!("devstu_lk_out_{tag}.png"));
    let temp_matte = temp_dir.join(format!("devstu_lk_matte_{tag}.png"));

    std::fs::write(&temp_input, &img_bytes)
        .map_err(|e| format!("Failed to save temp input: {e}"))?;

    let mut cmd = std::process::Command::new(&py);
    cmd.arg(&script)
        .arg("--input").arg(&temp_input)
        .arg("--output").arg(&temp_output)
        .arg("--matte-output").arg(&temp_matte)
        .arg("--color").arg(color);

    if transparent {
        cmd.arg("--transparent");
    }
    if sky {
        cmd.arg("--sky");
    }

    configure_python_cmd(&mut cmd, base_dir);

    let output = cmd.output().map_err(|e| format!("Failed to spawn LK matting process: {e}"))?;
    let _ = std::fs::remove_file(&temp_input);

    if !output.status.success() {
        let err_str = String::from_utf8_lossy(&output.stderr);
        let _ = std::fs::remove_file(&temp_output);
        let _ = std::fs::remove_file(&temp_matte);
        return Err(format!("LK Matting failed: {err_str}"));
    }

    if !temp_output.exists() {
        let _ = std::fs::remove_file(&temp_matte);
        return Err("LK Matting output image was not produced".to_string());
    }

    let out_bytes = std::fs::read(&temp_output).map_err(|e| e.to_string())?;
    let _ = std::fs::remove_file(&temp_output);

    let matte_data_url = if temp_matte.exists() {
        let m_bytes = std::fs::read(&temp_matte).ok();
        let _ = std::fs::remove_file(&temp_matte);
        m_bytes.map(|b| format!("data:image/png;base64,{}", BASE64.encode(b)))
    } else {
        None
    };

    let data_url = format!("data:image/png;base64,{}", BASE64.encode(&out_bytes));

    let res = serde_json::json!({
        "ok": true,
        "data_url": data_url,
        "matte_data_url": matte_data_url,
        "elapsed_ms": start.elapsed().as_millis(),
        "engine": "LK Magic Pro model_29 + BGFusion"
    });

    Ok(res.to_string())
}

fn lk_ultra_max_process(body_str: &str, base_dir: &Path) -> Result<String, String> {
    let start = std::time::Instant::now();
    let mut v: serde_json::Value = serde_json::from_str(body_str).map_err(|e| e.to_string())?;
    let id = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_nanos();
    if let Some(obj) = v.as_object_mut() {
        obj.insert("id".to_string(), serde_json::Value::String(id.to_string()));
        obj.insert("action".to_string(), serde_json::Value::String("ultra_max".to_string()));
    }

    let d_res = lk_daemon_call(base_dir, v)?;
    let data_url = d_res.get("data_url").and_then(|x| x.as_str()).unwrap_or("");
    let engine = d_res.get("engine").and_then(|x| x.as_str()).unwrap_or("LK Magic Pro ONNX");
    let active_models = d_res.get("active_models").cloned().unwrap_or(serde_json::json!([]));
    if data_url.is_empty() {
        return Err("LK Ultra Max returned empty data_url".to_string());
    }
    let res = serde_json::json!({
        "ok": true,
        "data_url": data_url,
        "engine": engine,
        "active_models": active_models,
        "elapsed_ms": start.elapsed().as_millis()
    });
    Ok(res.to_string())
}

fn evoto_hair_dye_process(body_str: &str, base_dir: &Path) -> Result<String, String> {
    let start = std::time::Instant::now();
    let v: serde_json::Value = serde_json::from_str(body_str).map_err(|e| e.to_string())?;
    let img_b64 = v.get("image_base64").and_then(|x| x.as_str()).unwrap_or("");
    let img_bytes = decode_data_url_bytes(img_b64)?;

    let script = base_dir.join("scripts").join("evoto_hair_process.py");
    let py = find_python(base_dir);

    let temp_dir = project_temp_dir(base_dir);
    let tag = next_temp_tag();
    let temp_in = temp_dir.join(format!("devstu_hair_in_{tag}.png"));
    let temp_out = temp_dir.join(format!("devstu_hair_out_{tag}.png"));
    let temp_mask = temp_dir.join(format!("devstu_hair_mask_{tag}.png"));

    std::fs::write(&temp_in, &img_bytes).map_err(|e| format!("Failed to save input: {e}"))?;

    let mut params_obj = v.clone();
    if let Some(map) = params_obj.as_object_mut() {
        map.remove("image_base64");
        map.remove("mask_base64");
        if let Some(mask_b64) = v.get("mask_base64").and_then(|x| x.as_str()) {
            if let Ok(m_bytes) = decode_data_url_bytes(mask_b64) {
                let _ = std::fs::write(&temp_mask, &m_bytes);
                map.insert("mask_path".to_string(), serde_json::Value::String(temp_mask.to_string_lossy().to_string()));
            }
        }
    }

    let mut cmd = std::process::Command::new(&py);
    cmd.arg(&script)
        .arg(&temp_in)
        .arg(&temp_out)
        .arg(params_obj.to_string());

    configure_python_cmd(&mut cmd, base_dir);

    let output = cmd.output().map_err(|e| format!("Failed to spawn hair process: {e}"))?;
    let _ = std::fs::remove_file(&temp_in);
    let _ = std::fs::remove_file(&temp_mask);

    if !output.status.success() {
        let err = String::from_utf8_lossy(&output.stderr);
        let _ = std::fs::remove_file(&temp_out);
        return Err(format!("Hair dye processing failed: {err}"));
    }

    if !temp_out.exists() {
        return Err("Hair dye output was not produced".to_string());
    }

    let out_bytes = std::fs::read(&temp_out).map_err(|e| e.to_string())?;
    let _ = std::fs::remove_file(&temp_out);
    let data_url = format!("data:image/png;base64,{}", BASE64.encode(&out_bytes));

    let res = serde_json::json!({
        "ok": true,
        "data_url": data_url,
        "elapsed_ms": start.elapsed().as_millis()
    });
    Ok(res.to_string())
}

fn extract_highres_matte(body_str: &str, base_dir: &Path) -> Result<String, String> {
    let start = std::time::Instant::now();
    let v: serde_json::Value = serde_json::from_str(body_str).map_err(|e| e.to_string())?;
    let img_b64 = v.get("image_base64").and_then(|x| x.as_str()).unwrap_or("");
    let img_bytes = decode_data_url_bytes(img_b64)?;

    let script = base_dir.join("scripts").join("extract_matte.py");
    let py = find_python(base_dir);

    let temp_dir = project_temp_dir(base_dir);
    let tag = next_temp_tag();
    let temp_in = temp_dir.join(format!("devstu_matte_in_{tag}.png"));
    let temp_out = temp_dir.join(format!("devstu_matte_out_{tag}.png"));

    std::fs::write(&temp_in, &img_bytes).map_err(|e| format!("Failed to save input: {e}"))?;

    let mut cmd = std::process::Command::new(&py);
    cmd.arg(&script)
        .arg(&temp_in)
        .arg(&temp_out);

    configure_python_cmd(&mut cmd, base_dir);

    let output = cmd.output().map_err(|e| format!("Failed to spawn matte process: {e}"))?;
    let _ = std::fs::remove_file(&temp_in);

    if !output.status.success() {
        let err = String::from_utf8_lossy(&output.stderr);
        let _ = std::fs::remove_file(&temp_out);
        return Err(format!("Matte process failed: {err}"));
    }

    if !temp_out.exists() {
        return Err("Matte output was not produced".to_string());
    }

    let out_bytes = std::fs::read(&temp_out).map_err(|e| e.to_string())?;
    let _ = std::fs::remove_file(&temp_out);
    let matte_data_url = format!("data:image/png;base64,{}", BASE64.encode(&out_bytes));

    let res = serde_json::json!({
        "ok": true,
        "matte_data_url": matte_data_url,
        "elapsed_ms": start.elapsed().as_millis()
    });
    Ok(res.to_string())
}

fn respond_json(req: Request, status: u16, body: String) {
    let resp = with_content_type(
        Response::from_string(body).with_status_code(StatusCode(status)),
        "application/json",
    );
    let _ = req.respond(add_cors_headers(resp));
}

fn respond_bridge_result(req: Request, res: Result<serde_json::Value, String>) {
    match res {
        Ok(val) => {
            let status = if val.get("ok").and_then(|v| v.as_bool()).unwrap_or(true) {
                200
            } else {
                500
            };
            respond_json(req, status, val.to_string());
        }
        Err(e) => {
            let err = serde_json::json!({ "ok": false, "error": e }).to_string();
            respond_json(req, 500, err);
        }
    }
}

fn read_json_body(req: &mut Request) -> serde_json::Value {
    let mut body_str = String::new();
    let _ = req.as_reader().read_to_string(&mut body_str);
    if body_str.trim().is_empty() {
        serde_json::json!({})
    } else {
        serde_json::from_str(&body_str).unwrap_or_else(|_| serde_json::json!({}))
    }
}

fn save_user_color_reference(base_dir: &Path, img_b64: &str) -> Result<serde_json::Value, String> {
    let raw_bytes = decode_data_url_bytes(img_b64)?;
    let lk_root = crate::lk_bridge::find_lk_root(base_dir)
        .ok_or_else(|| "Khong tim thay thu muc lk_runtime".to_string())?;
    let rel_dir = "color_ai_example/images/lk_magic_user";
    let abs_dir = lk_root.join("resources").join("render").join(rel_dir);
    std::fs::create_dir_all(&abs_dir).map_err(|e| format!("Tao thu muc mau that bai: {e}"))?;

    let filename = format!("ref_{}.jpg", next_temp_tag());
    let rel_scene = format!("{rel_dir}/{filename}");
    let abs_path = abs_dir.join(&filename);

    let dyn_img = image::load_from_memory(&raw_bytes)
        .map_err(|e| format!("Khong doc duoc dinh dang anh mau: {e}"))?;
    let mut out_file = File::create(&abs_path)
        .map_err(|e| format!("Khong ghi duoc anh mau: {e}"))?;
    let rgb = dyn_img.to_rgb8();
    let mut encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(&mut out_file, 94);
    encoder
        .encode_image(&image::DynamicImage::ImageRgb8(rgb))
        .map_err(|e| format!("Khong luu duoc anh mau JPEG: {e}"))?;

    Ok(serde_json::json!({
        "ok": true,
        "scene": rel_scene,
        "refer_path": abs_path.to_string_lossy().to_string(),
    }))
}

fn sniff_image_mime(path: &Path) -> &'static str {
    let mut buf = [0u8; 12];
    if let Ok(mut f) = File::open(path) {
        use std::io::Read;
        if let Ok(n) = f.read(&mut buf) {
            if n >= 3 && buf[0] == 0xFF && buf[1] == 0xD8 && buf[2] == 0xFF {
                return "image/jpeg";
            }
            if n >= 4 && buf[..4] == [0x89, 0x50, 0x4E, 0x47] {
                return "image/png";
            }
            if n >= 12 && &buf[..4] == b"RIFF" && &buf[8..12] == b"WEBP" {
                return "image/webp";
            }
            if n >= 2 && &buf[..2] == b"BM" {
                return "image/bmp";
            }
        }
    }
    get_mime_type(path)
}

fn handle_lk_ultra_max_api(mut req: Request, pathname: &str, parsed_url: &Url, base_dir: &Path) {
    let sub = &pathname["/api/lk_ultra_max/".len()..];
    if sub == "asset" || sub == "file" {
        let rel = parsed_url
            .query_pairs()
            .find(|(k, _)| k == "path")
            .map(|(_, v)| v.into_owned())
            .unwrap_or_default();
        let found = if sub == "asset" {
            crate::lk_bridge::resolve_lk_asset_path(base_dir, &rel)
        } else {
            crate::lk_bridge::resolve_preview_file_path(base_dir, &rel)
        };
        if let Some(file_path) = found {
            let mime = if sub == "file" {
                sniff_image_mime(&file_path)
            } else {
                get_mime_type(&file_path)
            };
            if let Ok(file) = File::open(&file_path) {
                let mut resp = with_content_type(Response::from_file(file), mime);
                if sub == "file" {
                    if let Ok(hdr) = Header::from_bytes(&b"Cache-Control"[..], &b"no-store"[..]) {
                        resp.add_header(hdr);
                    }
                }
                let _ = req.respond(add_cors_headers(resp));
                return;
            }
        }
        let resp = Response::from_string("Asset Not Found").with_status_code(StatusCode(404));
        let _ = req.respond(add_cors_headers(resp));
        return;
    }

    let body = read_json_body(&mut req);
    let d15 = std::time::Duration::from_secs(15);
    let d45 = std::time::Duration::from_secs(45);
    let d60 = std::time::Duration::from_secs(60);

    match sub {
        "init" => match crate::lk_bridge::init(base_dir) {
            Ok(ready) => {
                let materials = crate::lk_bridge::call(base_dir, "materials", serde_json::json!({}), d15)
                    .unwrap_or_else(|_| serde_json::json!({}));
                let presets = crate::lk_bridge::call(base_dir, "get_presets", serde_json::json!({}), d15)
                    .unwrap_or_else(|_| serde_json::json!({}));
                respond_json(
                    req,
                    200,
                    serde_json::json!({
                        "ok": true,
                        "ready": ready,
                        "materials": materials,
                        "presets": presets
                    })
                    .to_string(),
                );
            }
            Err(e) => respond_json(req, 500, serde_json::json!({ "ok": false, "error": e }).to_string()),
        },
        "open" => respond_bridge_result(req, crate::lk_bridge::call(base_dir, "open_image", body, d60)),
        "set_viewport" => respond_bridge_result(req, crate::lk_bridge::call(base_dir, "set_viewport", body, d15)),
        "detect" => respond_bridge_result(req, crate::lk_bridge::call(base_dir, "detect", body, d15)),
        "retouch" => {
            let cmd = if body.get("op_mode").is_some() { "retouch_op" } else { "retouch" };
            respond_bridge_result(
                req,
                crate::lk_bridge::call(base_dir, cmd, body, d45),
            );
        }
        "curve" => respond_bridge_result(req, crate::lk_bridge::call(base_dir, "get_curve_data", body, d15)),
        "histogram" => respond_bridge_result(req, crate::lk_bridge::call(base_dir, "get_histogram", body, d15)),
        "reference" => {
            if body.get("purpose").and_then(|v| v.as_str()) == Some("color_ref") {
                let img_b64 = body.get("image_base64").and_then(|v| v.as_str()).unwrap_or("");
                match save_user_color_reference(base_dir, img_b64) {
                    Ok(val) => respond_json(req, 200, val.to_string()),
                    Err(e) => respond_json(req, 400, serde_json::json!({ "ok": false, "error": e }).to_string()),
                }
            } else {
                respond_bridge_result(req, crate::lk_bridge::call(base_dir, "set_reference", body, d15));
            }
        }
        "liquid" => {
            let cmd = match body.get("action").and_then(|v| v.as_str()).unwrap_or("") {
                "begin" => "liquid_begin",
                "event" => "liquid_event",
                "confirm" => "liquid_confirm",
                "cancel" => "liquid_cancel",
                "history" => "liquid_history",
                other => {
                    respond_json(
                        req,
                        400,
                        serde_json::json!({ "ok": false, "error": format!("Unsupported liquid action: {other}") })
                            .to_string(),
                    );
                    return;
                }
            };
            respond_bridge_result(req, crate::lk_bridge::call(base_dir, cmd, body, d15));
        }
        "presets" => {
            let op = body.get("op").and_then(|v| v.as_str()).unwrap_or("list");
            let cmd = if op == "list" || op.is_empty() { "get_presets" } else { "preset_op" };
            respond_bridge_result(req, crate::lk_bridge::call(base_dir, cmd, body, d15));
        }
        "camera" => {
            let cmd = match body.get("action").and_then(|v| v.as_str()).unwrap_or("poll") {
                "connect" => "camera_connect",
                "disconnect" => "camera_disconnect",
                "setting" => "camera_setting",
                _ => "poll_events",
            };
            respond_bridge_result(req, crate::lk_bridge::call(base_dir, cmd, body, d15));
        }
        "export" => respond_bridge_result(
            req,
            crate::lk_bridge::call(base_dir, "export", body, std::time::Duration::from_secs(100)),
        ),
        _ => respond_json(
            req,
            404,
            serde_json::json!({ "ok": false, "error": format!("Unknown lk_ultra_max endpoint: {sub}") }).to_string(),
        ),
    }
}

fn handle_request(mut req: Request, base_dir: &Path) {
    if req.method() == &Method::Options {
        let resp = Response::empty(StatusCode(204));
        let _ = req.respond(add_cors_headers(resp));
        return;
    }

    let raw_url = format!("http://localhost{}", req.url());
    let parsed_url = match Url::parse(&raw_url) {
        Ok(u) => u,
        Err(_) => {
            let resp = Response::from_string("Bad Request").with_status_code(StatusCode(400));
            let _ = req.respond(add_cors_headers(resp));
            return;
        }
    };

    let pathname = parsed_url.path();

    // AI API Endpoints (LiYing RMBG, Evoto Hair, Matte)
    if pathname.starts_with("/api/") {
        if pathname == "/api/ping" {
            let resp = with_content_type(Response::from_string(r#"{"ok":true,"app":"DEVSTU"}"#), "application/json");
            let _ = req.respond(add_cors_headers(resp));
            return;
        }

        if pathname == "/api/process_photo" {
            let mut body_str = String::new();
            let _ = req.as_reader().read_to_string(&mut body_str);
            match crate::retouch_engine::process_photo_http(&body_str) {
                Ok(payload) => {
                    let resp = with_content_type(Response::from_string(payload), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
                Err(e) => {
                    let err_json = format!(r#"{{"ok":false,"error":{}}}"#, serde_json::to_string(&e).unwrap_or_default());
                    let resp = with_content_type(Response::from_string(err_json).with_status_code(StatusCode(500)), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
            }
        }

        if pathname == "/api/app_exit" {
            crate::lk_bridge::shutdown();
            let resp = with_content_type(Response::from_string(r#"{"ok":true,"exiting":true}"#), "application/json");
            let _ = req.respond(add_cors_headers(resp));
            std::thread::spawn(|| {
                std::thread::sleep(std::time::Duration::from_millis(80));
                std::process::exit(0);
            });
            return;
        }

        if pathname == "/api/app_splash_done" {
            crate::trigger_finish_splash();
            let resp = with_content_type(Response::from_string(r#"{"ok":true}"#), "application/json");
            let _ = req.respond(add_cors_headers(resp));
            return;
        }

        if pathname.starts_with("/api/lk_ultra_max/") {
            handle_lk_ultra_max_api(req, pathname, &parsed_url, base_dir);
            return;
        }

        if pathname == "/api/liying_change_background" {
            let mut body_str = String::new();
            let _ = req.as_reader().read_to_string(&mut body_str);
            let v: serde_json::Value = serde_json::from_str(&body_str).unwrap_or(serde_json::Value::Null);
            let img_b64 = v.get("image_base64").and_then(|x| x.as_str()).unwrap_or("");
            let color = v.get("color").and_then(|x| x.as_str()).unwrap_or("blue");
            let transparent = v.get("transparent").and_then(|x| x.as_bool()).unwrap_or(false);
            let straighten = v.get("straighten").and_then(|x| x.as_bool()).unwrap_or(false);
            let level_only = v.get("level_only").and_then(|x| x.as_bool()).unwrap_or(false);

            match liying_change_background(img_b64, color, transparent, straighten, level_only, base_dir) {
                Ok(payload) => {
                    let resp = with_content_type(Response::from_string(payload), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
                Err(e) => {
                    let err_json = format!(r#"{{"ok":false,"error":{}}}"#, serde_json::to_string(&e).unwrap_or_default());
                    let resp = with_content_type(Response::from_string(err_json).with_status_code(StatusCode(500)), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
            }
        }

        if pathname == "/api/evoto_hair_dye" {
            let mut body_str = String::new();
            let _ = req.as_reader().read_to_string(&mut body_str);
            match evoto_hair_dye_process(&body_str, base_dir) {
                Ok(payload) => {
                    let resp = with_content_type(Response::from_string(payload), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
                Err(e) => {
                    let err_json = format!(r#"{{"ok":false,"error":{}}}"#, serde_json::to_string(&e).unwrap_or_default());
                    let resp = with_content_type(Response::from_string(err_json).with_status_code(StatusCode(500)), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
            }
        }

        if pathname == "/api/extract_highres_matte" {
            let mut body_str = String::new();
            let _ = req.as_reader().read_to_string(&mut body_str);
            match extract_highres_matte(&body_str, base_dir) {
                Ok(payload) => {
                    let resp = with_content_type(Response::from_string(payload), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
                Err(e) => {
                    let err_json = format!(r#"{{"ok":false,"error":{}}}"#, serde_json::to_string(&e).unwrap_or_default());
                    let resp = with_content_type(Response::from_string(err_json).with_status_code(StatusCode(500)), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
            }
        }

        if pathname == "/api/extract_matte" {
            let mut body_str = String::new();
            let _ = req.as_reader().read_to_string(&mut body_str);
            let v: serde_json::Value = serde_json::from_str(&body_str).unwrap_or(serde_json::Value::Null);
            let img_b64 = v.get("image_base64").and_then(|x| x.as_str()).unwrap_or("");
            match lk_extract_matte_only(img_b64, base_dir) {
                Ok(payload) => {
                    let resp = with_content_type(Response::from_string(payload), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
                Err(_) => {
                    // Fallback to extract_highres_matte
                    match extract_highres_matte(&body_str, base_dir) {
                        Ok(payload) => {
                            let resp = with_content_type(Response::from_string(payload), "application/json");
                            let _ = req.respond(add_cors_headers(resp));
                            return;
                        }
                        Err(e) => {
                            let err_json = format!(r#"{{"ok":false,"error":{}}}"#, serde_json::to_string(&e).unwrap_or_default());
                            let resp = with_content_type(Response::from_string(err_json).with_status_code(StatusCode(500)), "application/json");
                            let _ = req.respond(add_cors_headers(resp));
                            return;
                        }
                    }
                }
            }
        }

        if pathname == "/api/background_presets" {
            let bg_path = base_dir.join("assets").join("bg.json");
            if bg_path.exists() {
                if let Ok(content) = std::fs::read_to_string(&bg_path) {
                    let resp = with_content_type(Response::from_string(content), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
            }
            let resp = with_content_type(Response::from_string(r#"{"ok":true,"param":[]}"#), "application/json");
            let _ = req.respond(add_cors_headers(resp));
            return;
        }

        if pathname == "/api/lk_matting_cutout" {
            let mut body_str = String::new();
            let _ = req.as_reader().read_to_string(&mut body_str);
            let v: serde_json::Value = serde_json::from_str(&body_str).unwrap_or(serde_json::Value::Null);
            let img_b64 = v.get("image_base64").and_then(|x| x.as_str()).unwrap_or("");
            match lk_matting_process(img_b64, "sifalan", true, false, base_dir) {
                Ok(payload) => {
                    let resp = with_content_type(Response::from_string(payload), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
                Err(e) => {
                    let err_json = format!(r#"{{"ok":false,"error":{}}}"#, serde_json::to_string(&e).unwrap_or_default());
                    let resp = with_content_type(Response::from_string(err_json).with_status_code(StatusCode(500)), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
            }
        }

        if pathname == "/api/lk_change_background" {
            let mut body_str = String::new();
            let _ = req.as_reader().read_to_string(&mut body_str);
            let v: serde_json::Value = serde_json::from_str(&body_str).unwrap_or(serde_json::Value::Null);
            let img_b64 = v.get("image_base64").and_then(|x| x.as_str()).unwrap_or("");
            let color = v.get("color").and_then(|x| x.as_str()).unwrap_or("sifalan");
            let transparent = v.get("transparent").and_then(|x| x.as_bool()).unwrap_or(false);
            match lk_matting_process(img_b64, color, transparent, false, base_dir) {
                Ok(payload) => {
                    let resp = with_content_type(Response::from_string(payload), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
                Err(e) => {
                    let err_json = format!(r#"{{"ok":false,"error":{}}}"#, serde_json::to_string(&e).unwrap_or_default());
                    let resp = with_content_type(Response::from_string(err_json).with_status_code(StatusCode(500)), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
            }
        }

        if pathname == "/api/lk_sky_replacement" {
            let mut body_str = String::new();
            let _ = req.as_reader().read_to_string(&mut body_str);
            let v: serde_json::Value = serde_json::from_str(&body_str).unwrap_or(serde_json::Value::Null);
            let img_b64 = v.get("image_base64").and_then(|x| x.as_str()).unwrap_or("");
            match lk_matting_process(img_b64, "sky", false, true, base_dir) {
                Ok(payload) => {
                    let resp = with_content_type(Response::from_string(payload), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
                Err(e) => {
                    let err_json = format!(r#"{{"ok":false,"error":{}}}"#, serde_json::to_string(&e).unwrap_or_default());
                    let resp = with_content_type(Response::from_string(err_json).with_status_code(StatusCode(500)), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
            }
        }

        if pathname == "/api/lk_ultra_max_process" {
            let mut body_str = String::new();
            let _ = req.as_reader().read_to_string(&mut body_str);
            match lk_ultra_max_process(&body_str, base_dir) {
                Ok(payload) => {
                    let resp = with_content_type(Response::from_string(payload), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
                Err(e) => {
                    let err_json = format!(r#"{{"ok":false,"error":{}}}"#, serde_json::to_string(&e).unwrap_or_default());
                    let resp = with_content_type(Response::from_string(err_json).with_status_code(StatusCode(500)), "application/json");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
            }
        }
    }


    // 1. Emulate /__native/... routes
    if pathname.starts_with("/__native/") {
        let sub = &pathname[10..];

        if sub.starts_with("paths") {
            let body = r#"{"status":"ok","allowed":true,"platform":"windows"}"#;
            let resp = with_content_type(Response::from_string(body), "application/json");
            let _ = req.respond(add_cors_headers(resp));
            return;
        }

        if sub.starts_with("tether") {
            let body = r#"{"on":false,"mode":"wifi","port":2121,"user":"DEVSTU","pass":"123456","ips":["192.168.1.100"],"dir":"Pictures\\DEVSTU-Tether","usb_dir":"Pictures\\DEVSTU-USB","cameras":[],"files":[],"received":0,"done":0,"total":0}"#;
            let resp = with_content_type(Response::from_string(body), "application/json");
            let _ = req.respond(add_cors_headers(resp));
            return;
        }

        if sub.starts_with("photos/save") {
            let body = r#"{"ok":true,"saved":true}"#;
            let resp = with_content_type(Response::from_string(body), "application/json");
            let _ = req.respond(add_cors_headers(resp));
            return;
        }

        if sub.starts_with("profiles/file") {
            let p_param = parsed_url.query_pairs().find(|(k, _)| k == "p").map(|(_, v)| v.into_owned());
            if let Some(target_p) = p_param {
                let sys_color_dir = Path::new(r"C:\Windows\System32\spool\drivers\color");
                let file_name = Path::new(&target_p).file_name().unwrap_or_default();
                let target_prof = sys_color_dir.join(file_name);
                if target_prof.exists() {
                    if let Ok(file) = File::open(&target_prof) {
                        let resp = with_content_type(Response::from_file(file), "application/octet-stream");
                        let _ = req.respond(add_cors_headers(resp));
                        return;
                    }
                }
            }
            let resp = Response::from_string("Profile not found").with_status_code(StatusCode(404));
            let _ = req.respond(add_cors_headers(resp));
            return;
        }

        let body = r#"{"ok":true}"#;
        let resp = with_content_type(Response::from_string(body), "application/json");
        let _ = req.respond(add_cors_headers(resp));
        return;
    }

    // 2. Emulate /__api/... or /v1/... routes
    let is_api = pathname.starts_with("/__api/") || pathname.starts_with("/v1/");
    if is_api {
        let api_path = if pathname.starts_with("/__api") {
            &pathname[6..]
        } else {
            pathname
        };

        if api_path == "/v1/me" {
            let body = r#"{
  "user": {
    "id": "pro_user",
    "email": "ducdoan04.work@gmail.com",
    "name": "ducdoan-04",
    "role": "pro",
    "newsletter": false
  },
  "access": {
    "tier": "all",
    "premiumUntil": 4102444800,
    "premiumLifetime": true,
    "masterUntil": 4102444800,
    "masterLifetime": true,
    "masterTrial": false,
    "masterTrialUsed": false
  },
  "k": "msGYBNQ9tpi4ldfsX_ZGw4kz5LMIsA30kEqYBgWH0tU",
  "referral": {
    "code": "DEVSTU",
    "link": "http://127.0.0.1:3000",
    "qualified": 999,
    "pending": 0,
    "next": 0,
    "campaign": { "days": 9999, "capDays": 9999, "usedDays": 0, "until": 4102444800 },
    "redeemed": false,
    "waiting": false,
    "partner": null
  },
  "notices": 0,
  "global": null
}"#;
            let resp = with_content_type(Response::from_string(body), "application/json");
            let _ = req.respond(add_cors_headers(resp));
            return;
        }

        if api_path.starts_with("/v1/model-key") {
            let m_param = parsed_url.query_pairs().find(|(k, _)| k == "m").map(|(_, v)| v.into_owned());
            let m = m_param.as_deref().unwrap_or("");
            let key = match m {
                "da-retouch-v1" => "JibaelF7gqjnIGCgdiPy4TKEvYDVuZvv7LL81ctCcpw=",
                "ao-retouch-v1" => "kTsTOrX93u8ykhZmZb0L1juKtLcJwMt14wBqK97OLLg=",
                "da-than-v1" => "3VbTFBXHjdfMwCimmnqfyljuoEZSg5yZkfU7Kw/DfAM=",
                "ranh-cuoi-v1" => "BmgP7/zGvGnIUjbjsT7aWVGQENjeTKSTiel9w5db2wE=",
                "tao-khoi-v1" => "ilJyUSkIMmfTctFrcE+AMcA88lMLLW+Uo3QWqXz2ITE=",
                "toc-retouch-v1" => "v1DH98kNoq/zydfgVxs3O5DaDSknZnsVwA5xBwMevt4=",
                "giam-nhieu-nhe-v1" => "4f0oZX+Bh6itefTITLzUSnfGD6xdrZQwsejlXZ3XgQI=",
                _ => "plain",
            };
            let body = format!(r#"{{"model":"{}","key":"{}","exp":4102444800}}"#, m, key);
            let resp = with_content_type(Response::from_string(body), "application/json");
            let _ = req.respond(add_cors_headers(resp));
            return;
        }

        if api_path.starts_with("/v1/t/") {
            let hash = api_path.trim_start_matches("/v1/t/").trim_end_matches(".bin");
            let lut_file = base_dir.join("cache_t").join(format!("{}.bin", hash));
            if lut_file.exists() {
                if let Ok(file) = File::open(&lut_file) {
                    let resp = with_content_type(Response::from_file(file), "application/octet-stream");
                    let _ = req.respond(add_cors_headers(resp));
                    return;
                }
            }
        }

        if api_path == "/v1/notices" || api_path.starts_with("/v1/notices/") {
            let body = r#"{"notices":[]}"#;
            let resp = with_content_type(Response::from_string(body), "application/json");
            let _ = req.respond(add_cors_headers(resp));
            return;
        }

        if api_path == "/v1/plans" {
            let body = r#"{"plans":[]}"#;
            let resp = with_content_type(Response::from_string(body), "application/json");
            let _ = req.respond(add_cors_headers(resp));
            return;
        }

        let body = r#"{"ok":true,"user":{"email":"ducdoan04.work@gmail.com"}}"#;
        let resp = with_content_type(Response::from_string(body), "application/json");
        let _ = req.respond(add_cors_headers(resp));
        return;
    }

    // 3. Static files
    let mut rel_path = pathname.trim_start_matches('/');
    if rel_path.is_empty() {
        rel_path = "index.html";
    }

    let file_path = base_dir.join(rel_path);

    if file_path.exists() && file_path.is_file() {
        let mime = get_mime_type(&file_path);
        if let Ok(file) = File::open(&file_path) {
            let resp = with_content_type(Response::from_file(file), mime);
            let _ = req.respond(add_cors_headers(resp));
            return;
        }
    }

    let resp = Response::from_string("404 Not Found").with_status_code(StatusCode(404));
    let _ = req.respond(add_cors_headers(resp));
}

pub fn start_server(port: u16) {
    let addr = format!("127.0.0.1:{}", port);
    let base_dir = find_base_dir();
    let mut server_opt = None;
    for attempt in 0..10 {
        match Server::http(&addr) {
            Ok(srv) => {
                server_opt = Some(srv);
                break;
            }
            Err(e) => {
                if attempt == 9 {
                    eprintln!("[DEVSTU] Server error on {}: {}", addr, e);
                } else {
                    std::thread::sleep(std::time::Duration::from_millis(100));
                }
            }
        }
    }

    if let Some(server) = server_opt {
        println!("[DEVSTU] Embedded Native Server running at http://{}", addr);
        println!("[DEVSTU] Serving assets from: {:?}", base_dir);
        std::thread::spawn(move || {
            for req in server.incoming_requests() {
                let bd = base_dir.clone();
                std::thread::spawn(move || {
                    handle_request(req, &bd);
                });
            }
        });
    }
}

