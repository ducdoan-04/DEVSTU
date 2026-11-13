use std::fs::File;
use std::path::{Path, PathBuf};
use tiny_http::{Header, Method, Request, Response, Server, StatusCode};
use url::Url;
use base64::engine::general_purpose::STANDARD as BASE64;
use base64::Engine;

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

pub fn find_base_dir() -> PathBuf {
    // 1. Check current directory and parents
    if let Ok(cwd) = std::env::current_dir() {
        if cwd.join("index.html").exists() {
            return cwd;
        }
        if cwd.join("..").join("index.html").exists() {
            if let Ok(p) = cwd.join("..").canonicalize() {
                return p;
            }
        }
    }
    // 2. Check exe directory and parents
    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(parent) = exe_path.parent() {
            if parent.join("index.html").exists() {
                return parent.to_path_buf();
            }
            if let Some(gp) = parent.parent() {
                if gp.join("index.html").exists() {
                    return gp.to_path_buf();
                }
                if let Some(ggp) = gp.parent() {
                    if ggp.join("index.html").exists() {
                        return ggp.to_path_buf();
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
        PathBuf::from("F:/Workspace/Code projects/2. Tool Media by Doan/Collabs-Retouch-Pro/scripts/liying_process.py"),
    ];
    let script = script_paths.iter().find(|p| p.exists())
        .ok_or_else(|| "Could not locate liying_process.py".to_string())?;

    let py_interpreters = [
        "F:/Workspace/Code projects/LiYing-master/python-embed/python.exe",
        "F:/Workspace/Code projects/LiYing/python-embed/python.exe",
        "python-embed/python.exe",
        "python",
        "python3",
    ];
    let py = py_interpreters.iter().find(|p| {
        if p.contains('/') || p.contains('\\') {
            Path::new(p).exists()
        } else {
            true
        }
    }).ok_or_else(|| "Could not find python interpreter with LiYing environment".to_string())?;

    let temp_dir = std::env::temp_dir();
    let pid = std::process::id();
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis();
    let temp_input = temp_dir.join(format!("devstu_liying_in_{pid}_{now}.png"));
    let temp_output = temp_dir.join(format!("devstu_liying_out_{pid}_{now}.png"));
    let temp_matte = temp_dir.join(format!("devstu_liying_matte_{pid}_{now}.png"));

    std::fs::write(&temp_input, &img_bytes)
        .map_err(|e| format!("Failed to save temp input: {e}"))?;

    let mut cmd = std::process::Command::new(py);
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

    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x08000000);
    }

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

fn evoto_hair_dye_process(body_str: &str, base_dir: &Path) -> Result<String, String> {
    let start = std::time::Instant::now();
    let v: serde_json::Value = serde_json::from_str(body_str).map_err(|e| e.to_string())?;
    let img_b64 = v.get("image_base64").and_then(|x| x.as_str()).unwrap_or("");
    let img_bytes = decode_data_url_bytes(img_b64)?;

    let script = base_dir.join("scripts").join("evoto_hair_process.py");
    let py = "F:/Workspace/Code projects/LiYing-master/python-embed/python.exe";

    let temp_dir = std::env::temp_dir();
    let pid = std::process::id();
    let now = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap_or_default().as_millis();
    let temp_in = temp_dir.join(format!("devstu_hair_in_{pid}_{now}.png"));
    let temp_out = temp_dir.join(format!("devstu_hair_out_{pid}_{now}.png"));
    let temp_mask = temp_dir.join(format!("devstu_hair_mask_{pid}_{now}.png"));

    std::fs::write(&temp_in, &img_bytes).map_err(|e| format!("Failed to save input: {e}"))?;

    let mut params_obj = v.clone();
    if let Some(mask_b64) = v.get("mask_base64").and_then(|x| x.as_str()) {
        if let Ok(m_bytes) = decode_data_url_bytes(mask_b64) {
            let _ = std::fs::write(&temp_mask, &m_bytes);
            if let Some(map) = params_obj.as_object_mut() {
                map.insert("mask_path".to_string(), serde_json::Value::String(temp_mask.to_string_lossy().to_string()));
            }
        }
    }

    let mut cmd = std::process::Command::new(py);
    cmd.arg(&script)
        .arg(&temp_in)
        .arg(&temp_out)
        .arg(params_obj.to_string());

    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x08000000);
    }

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
    let py = "F:/Workspace/Code projects/LiYing-master/python-embed/python.exe";

    let temp_dir = std::env::temp_dir();
    let pid = std::process::id();
    let now = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap_or_default().as_millis();
    let temp_in = temp_dir.join(format!("devstu_matte_in_{pid}_{now}.png"));
    let temp_out = temp_dir.join(format!("devstu_matte_out_{pid}_{now}.png"));

    std::fs::write(&temp_in, &img_bytes).map_err(|e| format!("Failed to save input: {e}"))?;

    let mut cmd = std::process::Command::new(py);
    cmd.arg(&script)
        .arg(&temp_in)
        .arg(&temp_out);

    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x08000000);
    }

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
            let body = r#"{"on":false,"cameras":[],"received":0,"done":0,"total":0}"#;
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
    std::thread::spawn(move || {
        let addr = format!("127.0.0.1:{}", port);
        match Server::http(&addr) {
            Ok(server) => {
                let base_dir = find_base_dir();
                println!("[DEVSTU] Embedded Native Server running at http://{}", addr);
                println!("[DEVSTU] Serving assets from: {:?}", base_dir);
                for req in server.incoming_requests() {
                    handle_request(req, &base_dir);
                }
            }
            Err(e) => {
                eprintln!("[DEVSTU] Server error on {}: {}", addr, e);
            }
        }
    });
}

