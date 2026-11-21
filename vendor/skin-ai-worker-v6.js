// Làm đẹp da AI (31/10/2026 — README §23z113): mô hình riêng của DEVSTU (tools/train-da, train từ ảnh trước / sau retouch da của anh
// Phúc — LICENSES/da-retouch.txt), U-Net ~2,7 triệu tham số, nhận ảnh cắt quanh một khuôn mặt (cạnh chia hết cho 16, 0..1) → ảnh đã
// làm đẹp da cùng cỡ. Chạy bằng ONNX Runtime Web 1.20.1 (MIT) dùng chung với giảm nhiễu AI (vendor/scunet/) — ưu tiên WebGPU, không
// có thì WASM. Trọng số cất fp16 (tools/onnx-fp16-store.py, 5,5 MB), tính fp32.
// Đổi nội dung file này thì phải đổi số phiên bản trong tên (file .js được lưu đệm một năm).
// v2 (01/11 — anh: dùng thử Premium không có kẽ hở): mô hình trên hosting ĐÃ MÃ HOÁ (da-retouch-v1.enc: "FRM1" + IV 12 byte + AES-256-GCM —
// tools/ma-hoa-mo-hinh.mjs); app gửi chìa máy chủ phát (/v1/model-key — chỉ người đang có Premium) trong tin nhắn (k). Bản THỬ trên máy (không
// bao giờ lên hosting) gửi k = 'plain' → nạp bản gốc .onnx.
// v3 (01/11 — anh: "muốn user dùng điện thoại dùng được làm đẹp da AI"): tin nhắn có c = true → chạy bằng CPU (WASM), bỏ WebGPU — điện thoại
// (ONNX Runtime WebGPU từng làm Safari iPhone sập vì hết bộ nhớ). App chia khung mặt thành ô 512 trước khi gửi (core/analysis/skin-ai.ts).
// v4 (04/11 — anh, iPhone 1.0.8: "no available backend found. ERR: [wasm] RangeError: Out of memory"): ONNX Runtime xin WebAssembly.Memory dùng
// chung với maximum 65536 trang (4 GB) và WebKit phải giữ chỗ trước đủ mức đó, app đang giữ nhiều ảnh thì không còn chỗ liền nhau. Chế độ CPU
// xin mức thấp hơn, không được thì thấp nữa (mô hình cho phép maximum nhỏ hơn mức khai báo). README §23z190.
// ?t=1: một luồng, máy ít bộ nhớ, như modnet-worker-v2, depth-worker-v2 (6 worker con của ONNX Runtime từng đẩy iPhone 11 Pro quá giới hạn của iOS).
// v2, v3 giữ trên hosting cho bản app cũ còn lưu đệm.
// Nạp tĩnh, đừng dùng await import: worker sẽ lỡ tin nhắn đầu. Thư viện chỉ xin bộ nhớ lúc tạo phiên nên vẫn đi qua chỗ hạ mức bên dưới.
// 12/11 (README §23z217 — dev Bảo: một ảnh, Làm sạch phông / rãnh cười đầy card 8 GB, đứng máy): tham số trên đường dẫn do app đặt theo mức Hiệu năng —
//   ?g=0: KHÔNG dùng card màn hình (mô hình cần nhiều bộ nhớ card hơn phần app được phép → chạy CPU); ?th=N: số luồng CPU cho WASM (tối đa 8).
// 12/11 chiều (README §23z218 — báo cáo hiệu năng của dev Bảo): chạy trên card thì ONNX Runtime chỉ một luồng WASM (trước đây 3 luồng / worker chạy không).
import * as ort from './scunet/ort.webgpu.min.mjs';

const RealMemory = WebAssembly.Memory;
/** Mức giữ chỗ khi chạy CPU, theo trang 64 KB: 1 GB, 768 MB, 512 MB (test/e2e-skin-mem.mjs đo một ô 512 chạy được ở các mức này). */
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

const MODEL_ENC = new URL('./skin-ai/da-retouch-v1.enc', import.meta.url).href;
const MODEL_PLAIN = new URL('./skin-ai/da-retouch-v1.onnx', import.meta.url).href;

async function loadModel(k) {
  if (k === 'plain') {
    const r = await fetch(MODEL_PLAIN);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return new Uint8Array(await r.arrayBuffer());
  }
  if (typeof k !== 'string' || !k) throw new Error('SKIN_AI_KEY');
  const r = await fetch(MODEL_ENC);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const b = new Uint8Array(await r.arrayBuffer());
  if (b.length < 32 || String.fromCharCode(b[0], b[1], b[2], b[3]) !== 'FRM1') throw new Error('SKIN_AI_FILE');
  const raw = Uint8Array.from(atob(k), (ch) => ch.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
  try {
    return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b.subarray(4, 16) }, key, b.subarray(16)));
  } catch { throw new Error('SKIN_AI_KEY'); }
}

let session = null, backend = '';
const ready = (k, cpu) => (session ||= (async () => {
  if (cpu) capped = true;
  const m = await loadModel(k);
  // WebGPU trước (trừ khi app đòi CPU); lỗi (máy / trình duyệt không có) thì WASM
  // chạy trên card: một luồng WASM (đặt trước khi ONNX Runtime khởi động; nhiều luồng chỉ chạy không, tốn CPU)
  if (!sessionsStarted) { sessionsStarted = true; ort.env.wasm.numThreads = !cpu && GPU_OK && self.navigator?.gpu ? 1 : THREADS; }
  if (!cpu && GPU_OK && self.navigator?.gpu) {
    try { const s = await ort.InferenceSession.create(m, { executionProviders: ['webgpu'], graphOptimizationLevel: 'all' }); backend = 'webgpu'; return s; } catch { /* sang WASM */ }
  }
  const s = await ort.InferenceSession.create(m, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
  backend = 'wasm';
  return s;
})().catch((e) => { session = null; throw e; }));

// ONNX Runtime WebGPU không chạy hai lượt cùng lúc (lỗi 'Session mismatch'): xếp hàng từng mặt
let queue = Promise.resolve();
self.onmessage = ({ data }) => { queue = queue.then(() => handle(data)); };
async function handle(data) {
  const { id, x, n, k, c } = data || {};
  try {
    const s = await ready(k, c === true);
    if (!x) { self.postMessage({ id, backend }); return; }
    if (!(x instanceof Float32Array) || !(n > 0) || n % 16 || x.length !== 3 * n * n) throw new Error('SIZE');
    const out = (await s.run({ input: new ort.Tensor('float32', x, [1, 3, n, n]) })).output.data;
    const y = out instanceof Float32Array ? out : Float32Array.from(out);
    self.postMessage({ id, y, backend }, [y.buffer]);
  } catch (e) {
    self.postMessage({ id, error: String(e?.message || e) });
  }
}
