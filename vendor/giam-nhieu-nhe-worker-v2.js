// Giảm nhiễu bằng AI — mô hình nhẹ của DEVSTU (06/11/2026, README §23z196): U-Net chỉ có tích chập 3×3 + ReLU, 4,2 triệu tham số, học bắt chước
// SCUNet trên ảnh RAW / JPEG của Hoàng Phúc Photo (PSNR 46,7 dB so với SCUNet trên ảnh kiểm). Nhanh hơn SCUNet ~20 lần: ảnh 26 MP trên card Intel
// tích hợp ~43 giây (SCUNet 13,4 phút). ONNX Runtime Web 1.31.1 (scunet2/, MIT), ô cố định 512 × 512.
// Mô hình trên hosting ĐÃ MÃ HOÁ ("FRM1" + IV 12 byte + AES-256-GCM, tools/ma-hoa-mo-hinh.mjs); chìa do máy chủ phát cho người có Premium
// (trang gửi kèm `k`; 'plain' = bản THỬ trên máy nạp bản gốc). `h`: card có shader-f16 → bản 16-bit (8 MB), không thì bản 32-bit (16 MB).
// `gc` (WebKit): sau mỗi ô tạo rồi bỏ 128 MB ArrayBuffer cho JavaScriptCore chạy GC, như scunet-worker-v2/v3.
// Đổi nội dung file này thì phải đổi số phiên bản trong tên (file .js được lưu đệm một năm).
// 12/11 (README §23z217 — dev Bảo: một ảnh, Làm sạch phông / rãnh cười đầy card 8 GB, đứng máy): tham số trên đường dẫn do app đặt theo mức Hiệu năng —
//   ?g=0: KHÔNG dùng card màn hình (mô hình cần nhiều bộ nhớ card hơn phần app được phép → chạy CPU); ?th=N: số luồng CPU cho WASM (tối đa 8).
import * as ort from './scunet2/ort.webgpu.min.mjs';

ort.env.wasm.wasmPaths = new URL('./scunet2/', import.meta.url).href;
const Q_ = new URL(import.meta.url).searchParams;
const GPU_OK = Q_.get('g') !== '0';
ort.env.wasm.numThreads = Q_.get('t') === '1' || !self.crossOriginIsolated ? 1 : Q_.get('th') ? Math.max(1, Math.min(8, Number(Q_.get('th')) || 1)) : Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 2) - 1));
ort.env.wasm.proxy = false;

const T = 512;
const file = (h, ext) => new URL(`./giam-nhieu-nhe/giam-nhieu-nhe-v1${h ? '-f16' : ''}.${ext}`, import.meta.url).href;

async function fetchAll(u) {
  const r = await fetch(u);
  if (!r.ok || !r.body) throw new Error('HTTP ' + r.status);
  const total = Number(r.headers.get('content-length')) || 0;
  const rd = r.body.getReader(), chunks = [];
  let n = 0, last = 0;
  for (;;) {
    const { done, value } = await rd.read();
    if (done) break;
    chunks.push(value); n += value.length;
    const now = performance.now();
    if (total && now - last > 250) { last = now; self.postMessage({ dl: Math.min(0.999, n / total) }); }
  }
  self.postMessage({ dl: 1 });
  const b = new Uint8Array(n);
  let o = 0;
  for (const c of chunks) { b.set(c, o); o += c.length; }
  return b;
}

async function loadModel(k, h) {
  if (k === 'plain') return fetchAll(file(h, 'onnx'));
  if (typeof k !== 'string' || !k) throw new Error('SKIN_AI_KEY');
  const b = await fetchAll(file(h, 'enc'));
  if (b.length < 32 || String.fromCharCode(b[0], b[1], b[2], b[3]) !== 'FRM1') throw new Error('SKIN_AI_FILE');
  const raw = Uint8Array.from(atob(k), (ch) => ch.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
  try {
    return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b.subarray(4, 16) }, key, b.subarray(16)));
  } catch { throw new Error('SKIN_AI_KEY'); }
}

let session = null, backend = '';
const ready = (k, h) => (session ||= loadModel(k, h).then(async (m) => {
  // WebGPU trước; lỗi (máy / trình duyệt không có) thì WASM
  if (GPU_OK && self.navigator?.gpu) {
    try { const s = await ort.InferenceSession.create(m, { executionProviders: ['webgpu'], graphOptimizationLevel: 'all' }); backend = 'webgpu'; return s; } catch { /* sang WASM */ }
  }
  const s = await ort.InferenceSession.create(m, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
  backend = 'wasm';
  return s;
}).catch((e) => { session = null; throw e; }));

// ONNX Runtime WebGPU không chạy hai lượt cùng lúc (lỗi 'Session mismatch'): xếp hàng từng ô
let queue = Promise.resolve();
self.onmessage = ({ data }) => { queue = queue.then(() => handle(data)); };
async function handle(data) {
  const { id, x, gc, k, h } = data || {};
  try {
    const s = await ready(k, !!h);
    if (!x) { self.postMessage({ id, backend }); return; }
    if (!(x instanceof Float32Array) || x.length !== 3 * T * T) throw new Error('SIZE');
    const out = (await s.run({ input: new ort.Tensor('float32', x, [1, 3, T, T]) })).output.data;
    if (gc) { for (let i = 0; i < 4; i++) new ArrayBuffer(32 << 20); await new Promise((r) => setTimeout(r)); }
    const y = out instanceof Float32Array ? out : Float32Array.from(out);
    self.postMessage({ id, y, backend }, [y.buffer]);
  } catch (e) {
    self.postMessage({ id, error: String(e?.message || e) });
  }
}
