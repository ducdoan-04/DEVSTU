// AI sửa theo vùng trên cả ảnh (02/11/2026 — README §23z161): hai mô hình riêng của DEVSTU, train từ ảnh retouch của anh Phúc (tools/train-toc-ao;
// LICENSES/ao-retouch.txt, LICENSES/da-than.txt, toc-retouch.txt, ranh-cuoi.txt, tao-khoi.txt): ao-retouch-v1 xoá nếp nhăn quần áo, da-than-v1 làm đẹp da cơ thể; 03/11 (README §23z184): toc-retouch-v1 làm gọn tóc, ranh-cuoi-v1 làm mờ rãnh cười, tao-khoi-v1 tạo khối mặt. Cùng kiến trúc U-Net ~2,7 triệu tham
// số với da-retouch, nhận ô vuông cắt từ ảnh (cạnh chia hết cho 16, 0..1) → ô đã sửa cùng cỡ. ONNX Runtime Web 1.20.1 (MIT) dùng chung với giảm nhiễu AI
// (vendor/scunet/). File trên hosting đã mã hoá như da-retouch ("FRM1" + IV 12 byte + AES-256-GCM — tools/ma-hoa-mo-hinh.mjs); app gửi chìa máy chủ phát
// (/v1/model-key, chỉ người đang có Premium) trong tin nhắn (k). Bản THỬ trên máy gửi k = 'plain' → nạp bản gốc .onnx.
// WebGPU trước; không có, hoặc card không đủ bộ nhớ cho ô này, thì chạy tiếp bằng CPU (WASM).
// Đổi nội dung file này thì phải đổi số phiên bản trong tên (file .js được lưu đệm một năm).
// v3 (04/11 — anh: đưa rãnh cười, tạo khối, tóc AI lên điện thoại, README §23z192): tin nhắn có c = true → chạy bằng CPU, bỏ WebGPU, giữ chỗ bộ nhớ thấp như skin-ai-worker-v4,
// mỗi lúc chỉ giữ một mô hình. ?t=1: một luồng, máy ít bộ nhớ. v1, v2 giữ trên hosting cho bản app cũ còn lưu đệm.
// Nạp tĩnh, đừng dùng await import: worker sẽ lỡ tin nhắn đầu. Thư viện chỉ xin bộ nhớ lúc tạo phiên nên vẫn đi qua chỗ hạ mức bên dưới.
// 12/11 (README §23z217 — dev Bảo: một ảnh, Làm sạch phông / rãnh cười đầy card 8 GB, đứng máy): tham số trên đường dẫn do app đặt theo mức Hiệu năng —
//   ?g=0: KHÔNG dùng card màn hình (mô hình cần nhiều bộ nhớ card hơn phần app được phép → chạy CPU); ?th=N: số luồng CPU cho WASM (tối đa 8).
// 12/11 chiều (README §23z218 — báo cáo hiệu năng của dev Bảo): chạy trên card thì ONNX Runtime chỉ một luồng WASM (trước đây 3 luồng / worker chạy không).
import * as ort from './scunet/ort.webgpu.min.mjs';

const RealMemory = WebAssembly.Memory;
/** Mức giữ chỗ khi chạy CPU, theo trang 64 KB: 1 GB, 768 MB, 512 MB (test/e2e-region-phone.mjs đo một ô 512 chạy được ở các mức này). */
const CPU_CAPS = [16384, 12288, 8192];
let capped = false;
function CappedMemory(d) {
  if (!capped || !d?.shared || !(d.maximum > CPU_CAPS[0])) return new RealMemory(d);
  let last;
  for (const maximum of CPU_CAPS) {
    try { return new RealMemory({ ...d, maximum }); } catch (e) { last = e; }
  }
  throw last;
}
CappedMemory.prototype = RealMemory.prototype;
WebAssembly.Memory = CappedMemory;

ort.env.wasm.wasmPaths = new URL('./scunet/', import.meta.url).href;
const Q_ = new URL(import.meta.url).searchParams;
const GPU_OK = Q_.get('g') !== '0';
const THREADS = Q_.get('t') === '1' || !self.crossOriginIsolated ? 1 : Q_.get('th') ? Math.max(1, Math.min(8, Number(Q_.get('th')) || 1)) : Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 2) - 1));
ort.env.wasm.numThreads = THREADS;
let sessionsStarted = false;
ort.env.wasm.proxy = false;

const MODELS = new Set(['ao-retouch-v1', 'da-than-v1', 'toc-retouch-v1', 'ranh-cuoi-v1', 'tao-khoi-v1']);

async function loadModel(m, k) {
  if (!MODELS.has(m)) throw new Error('REGION_AI_MODEL');
  if (k === 'plain') {
    const r = await fetch(new URL(`./skin-ai/${m}.onnx`, import.meta.url).href);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return new Uint8Array(await r.arrayBuffer());
  }
  if (typeof k !== 'string' || !k) throw new Error('REGION_AI_KEY');
  const r = await fetch(new URL(`./skin-ai/${m}.enc`, import.meta.url).href);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const b = new Uint8Array(await r.arrayBuffer());
  if (b.length < 32 || String.fromCharCode(b[0], b[1], b[2], b[3]) !== 'FRM1') throw new Error('REGION_AI_FILE');
  const raw = Uint8Array.from(atob(k), (ch) => ch.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
  try {
    return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b.subarray(4, 16) }, key, b.subarray(16)));
  } catch { throw new Error('REGION_AI_KEY'); }
}

const sessions = new Map();   // mã mô hình → { s, backend }
let cpuOnly = false;
async function ready(m, k, cpu) {
  if (cpu) { cpuOnly = true; capped = true; }
  const c = sessions.get(m);
  if (c) return c;
  // máy ít bộ nhớ: trả mô hình trước rồi mới nạp mô hình sau
  if (cpu) for (const [o, e] of sessions) { sessions.delete(o); await e.s.release().catch(() => undefined); }
  const model = await loadModel(m, k);
  let e = null;
  // chạy trên card: một luồng WASM (đặt trước khi ONNX Runtime khởi động; nhiều luồng chỉ chạy không, tốn CPU)
  if (!sessionsStarted) { sessionsStarted = true; ort.env.wasm.numThreads = !cpuOnly && GPU_OK && self.navigator?.gpu ? 1 : THREADS; }
  if (!cpuOnly && GPU_OK && self.navigator?.gpu) {
    try { e = { backend: 'webgpu', s: await ort.InferenceSession.create(model, { executionProviders: ['webgpu'], graphOptimizationLevel: 'all' }) }; } catch { /* sang WASM */ }
  }
  e ||= { backend: 'wasm', s: await ort.InferenceSession.create(model, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' }) };
  sessions.set(m, e);
  return e;
}

const infer = async (e, x, n) => (await e.s.run({ input: new ort.Tensor('float32', x, [1, 3, n, n]) })).output.data;

// ONNX Runtime WebGPU không chạy hai lượt cùng lúc: xếp hàng từng ô
let queue = Promise.resolve();
self.onmessage = ({ data }) => { queue = queue.then(() => handle(data)); };
async function handle(data) {
  const { id, m, x, n, k, c } = data || {};
  try {
    if (!(x instanceof Float32Array) || !(n > 0) || n % 16 || x.length !== 3 * n * n) throw new Error('SIZE');
    const e = await ready(m, k, c === true);
    let out;
    try { out = await infer(e, x, n); } catch (err) {
      if (e.backend !== 'webgpu') throw err;
      // card không đủ bộ nhớ cho ô: mọi mô hình của lần chạy này sang CPU, chậm hơn nhưng vẫn xong
      cpuOnly = true;
      sessions.clear();
      out = await infer(await ready(m, k, false), x, n);
    }
    const y = out instanceof Float32Array ? out : Float32Array.from(out);
    self.postMessage({ id, y, backend: sessions.get(m).backend }, [y.buffer]);
  } catch (e) {
    self.postMessage({ id, error: String(e?.message || e) });
  }
}
