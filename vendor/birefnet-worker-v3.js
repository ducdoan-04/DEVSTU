// Chọn chủ thể / người bằng AI (25/10/2026 — README §23z64): mô hình BiRefNet_lite (MIT — ZhengPeng7/BiRefNet), ảnh vào 1024 × 1024,
// ra độ phủ chủ thể có sợi tóc. Chạy bằng ONNX Runtime Web 1.20.1 (MIT) — dùng chung bản WebGPU của vendor/scunet/; máy không có
// WebGPU thì WASM (máy tính ~5 giây / ảnh). Xem LICENSES/birefnet.txt, LICENSES/onnxruntime.txt.
// Trọng số cất dạng fp16 (tools/onnx-fp16-store.py, 101 MB thay vì 200 MB), chia 4 phần, tải song song khi dùng lần đầu.
// Đổi nội dung file này thì phải đổi số phiên bản trong tên (file .js được lưu đệm một năm).
// 12/11 (README §23z217 — dev Bảo: một ảnh, Làm sạch phông / rãnh cười đầy card 8 GB, đứng máy): tham số trên đường dẫn do app đặt theo mức Hiệu năng —
//   ?g=0: KHÔNG dùng card màn hình (mô hình cần nhiều bộ nhớ card hơn phần app được phép → chạy CPU); ?th=N: số luồng CPU cho WASM (tối đa 8).
// 12/11 chiều (README §23z218 — báo cáo hiệu năng của dev Bảo): mô hình nạp thẳng vào một mảng (bớt ~200 MB lúc nạp).
import * as ort from './scunet/ort.webgpu.min.mjs';

ort.env.wasm.wasmPaths = new URL('./scunet/', import.meta.url).href;
const Q_ = new URL(import.meta.url).searchParams;
const GPU_OK = Q_.get('g') !== '0';
ort.env.wasm.numThreads = Q_.get('t') === '1' || !self.crossOriginIsolated ? 1 : Q_.get('th') ? Math.max(1, Math.min(8, Number(Q_.get('th')) || 1)) : Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 2) - 1));
ort.env.wasm.proxy = false;

const PARTS = [1, 2, 3, 4].map((i) => new URL(`./birefnet/birefnet-fp16w.part${i}.bin`, import.meta.url).href);
const BYTES = 101318831;
const S = 1024;
const MEAN = [0.485, 0.456, 0.406], STD = [0.229, 0.224, 0.225];

async function loadModel() {
  // nạp thẳng vào một mảng cỡ đúng mô hình (trước đây giữ cùng lúc từng mảnh, từng phần và cả mô hình: đỉnh ~300 MB trong worker)
  let got = 0, last = 0;
  const tick = (n) => { got += n; const now = performance.now(); if (now - last > 250) { last = now; self.postMessage({ dl: Math.min(0.999, got / BYTES) }); } };
  const rs = await Promise.all(PARTS.map(async (u) => { const r = await fetch(u); if (!r.ok || !r.body) throw new Error('HTTP ' + r.status); return r; }));
  const lens = rs.map((r) => Number(r.headers.get('content-length')) || 0);
  const all = new Uint8Array(BYTES);
  if (lens.every((n) => n > 0) && lens.reduce((a, b) => a + b, 0) === BYTES) {
    const offs = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
    await Promise.all(rs.map(async (r, i) => {
      const rd = r.body.getReader(), end = offs[i] + lens[i];
      let o = offs[i];
      for (;;) {
        const { done, value } = await rd.read();
        if (done) break;
        if (o + value.length > end) throw new Error('MODEL_SIZE');
        all.set(value, o); o += value.length; tick(value.length);
      }
      if (o !== end) throw new Error('MODEL_SIZE');
    }));
  } else {
    // không biết cỡ từng phần (máy chủ nén, thiếu header): gom từng phần rồi chép một lần vào `all`
    const parts = await Promise.all(rs.map(async (r) => { const rd = r.body.getReader(), ch = []; for (;;) { const { done, value } = await rd.read(); if (done) break; ch.push(value); tick(value.length); } return ch; }));
    let o = 0;
    for (const ch of parts) for (const c of ch) { if (o + c.length > BYTES) throw new Error('MODEL_SIZE'); all.set(c, o); o += c.length; }
    if (o !== BYTES) throw new Error('MODEL_SIZE');
  }
  self.postMessage({ dl: 1 });
  return all;
}

let session = null, backend = '';
const ready = () => (session ||= loadModel().then(async (m) => {
  // WebGPU trước; lỗi (máy / trình duyệt không có) thì WASM
  if (GPU_OK && self.navigator?.gpu) {
    try { const s = await ort.InferenceSession.create(m, { executionProviders: ['webgpu'], graphOptimizationLevel: 'all' }); backend = 'webgpu'; return s; } catch { /* sang WASM */ }
  }
  const s = await ort.InferenceSession.create(m, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
  backend = 'wasm';
  return s;
}).catch((e) => { session = null; throw e; }));

/** img: ImageData 1024 × 1024 (ảnh đã co / giãn về hình vuông). Trả độ phủ chủ thể 0..1, 1024 × 1024. */
async function matte(img) {
  const s = await ready();
  if (img.width !== S || img.height !== S) throw new Error('SIZE');
  const d = img.data, n = S * S, x = new Float32Array(3 * n);
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) x[k * n + i] = (d[i * 4 + k] / 255 - MEAN[k]) / STD[k];
  const out = await s.run({ [s.inputNames[0]]: new ort.Tensor('float32', x, [1, 3, S, S]) });
  const t = out[s.outputNames[s.outputNames.length - 1]].data;
  const y = new Float32Array(n);
  for (let i = 0; i < n; i++) y[i] = 1 / (1 + Math.exp(-t[i]));   // mô hình ra logit
  return y;
}

// ONNX Runtime WebGPU không chạy hai lượt cùng lúc: xếp hàng
let queue = Promise.resolve();
self.onmessage = ({ data }) => { queue = queue.then(() => handle(data)); };
async function handle(data) {
  const { id, img } = data || {};
  try {
    const y = await matte(img);
    self.postMessage({ id, data: y, w: S, h: S, backend }, [y.buffer]);
  } catch (e) {
    self.postMessage({ id, error: String(e?.message || e) });
  }
}
