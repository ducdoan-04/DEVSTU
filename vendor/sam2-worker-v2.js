// Chọn đồ vật bằng AI (25/10/2026 — README §23z64): SAM 2.1 hiera-tiny (Apache-2.0, Meta — facebookresearch/sam2), kiểu "Select
// Objects" của Lightroom: bấm vào đồ vật (một hay nhiều điểm) và / hoặc kéo khung quanh nó → mặt nạ đồ vật. Hai mô hình:
//   - bộ mã hoá ảnh (ảnh 1024 × 1024 → 3 tầng đặc trưng, ~0,5 giây WebGPU / ~3,5 giây CPU) — chạy MỘT lần mỗi ảnh, nhớ 2 ảnh gần nhất;
//   - bộ giải mã (điểm + khung → 3 mặt nạ 256 × 256 + điểm tin) — vài trăm mili giây, chạy lại mỗi lần thêm điểm / đổi khung.
// ONNX Runtime Web 1.20.1 (MIT) — dùng chung bản WebGPU của vendor/scunet/; không có WebGPU thì WASM. Xem LICENSES/sam2.txt.
// Đổi nội dung file này thì phải đổi số phiên bản trong tên (file .js được lưu đệm một năm).
// 12/11 (README §23z217 — dev Bảo: một ảnh, Làm sạch phông / rãnh cười đầy card 8 GB, đứng máy): tham số trên đường dẫn do app đặt theo mức Hiệu năng —
//   ?g=0: KHÔNG dùng card màn hình (mô hình cần nhiều bộ nhớ card hơn phần app được phép → chạy CPU); ?th=N: số luồng CPU cho WASM (tối đa 8).
import * as ort from './scunet/ort.webgpu.min.mjs';

ort.env.wasm.wasmPaths = new URL('./scunet/', import.meta.url).href;
const Q_ = new URL(import.meta.url).searchParams;
const GPU_OK = Q_.get('g') !== '0';
ort.env.wasm.numThreads = Q_.get('t') === '1' || !self.crossOriginIsolated ? 1 : Q_.get('th') ? Math.max(1, Math.min(8, Number(Q_.get('th')) || 1)) : Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 2) - 1));
ort.env.wasm.proxy = false;

const url = (f) => new URL('./sam2/' + f, import.meta.url).href;
// tên file trọng số ghi trong mô hình (externalData phải khớp đúng tên này)
const ENC = { graph: 'sam2-enc-fp16.onnx', data: [1, 2, 3].map((i) => `sam2-enc-fp16.data.part${i}.bin`), name: 'vision_encoder_fp16.onnx_data', bytes: 67005504 };
const DEC = { graph: 'sam2-dec.onnx', data: ['sam2-dec.data.bin'], name: 'prompt_encoder_mask_decoder.onnx_data', bytes: 20958208 };
const TOTAL = 314925 + ENC.bytes + 213114 + DEC.bytes;
const S = 1024;
const MEAN = [0.485, 0.456, 0.406], STD = [0.229, 0.224, 0.225];

let got = 0, last = 0;
async function fetchAll(u) {
  const r = await fetch(u);
  if (!r.ok || !r.body) throw new Error('HTTP ' + r.status);
  const rd = r.body.getReader(), chunks = [];
  let n = 0;
  for (;;) {
    const { done, value } = await rd.read();
    if (done) break;
    chunks.push(value); n += value.length; got += value.length;
    const now = performance.now();
    if (now - last > 250) { last = now; self.postMessage({ dl: Math.min(0.999, got / TOTAL) }); }
  }
  return join(chunks, n);
}
function join(parts, n = parts.reduce((a, b) => a + b.length, 0)) {
  const b = new Uint8Array(n);
  let o = 0;
  for (const c of parts) { b.set(c, o); o += c.length; }
  return b;
}
async function files(m) {
  const [g, ...d] = await Promise.all([fetchAll(url(m.graph)), ...m.data.map((f) => fetchAll(url(f)))]);
  const data = join(d);
  if (data.length !== m.bytes) throw new Error('MODEL_SIZE');
  return { g, data };
}

let models = null, backend = '';
const ready = () => (models ||= Promise.all([files(ENC), files(DEC)]).then(async ([e, d]) => {
  self.postMessage({ dl: 1 });
  const open = (f, m, ep) => ort.InferenceSession.create(f.g, { executionProviders: [ep], graphOptimizationLevel: 'all', externalData: [{ path: m.name, data: f.data }] });
  // WebGPU trước; lỗi (máy / trình duyệt không có) thì WASM
  if (GPU_OK && self.navigator?.gpu) {
    try { const s = [await open(e, ENC, 'webgpu'), await open(d, DEC, 'webgpu')]; backend = 'webgpu'; return s; } catch { /* sang WASM */ }
  }
  const s = [await open(e, ENC, 'wasm'), await open(d, DEC, 'wasm')];
  backend = 'wasm';
  return s;
}).catch((err) => { models = null; throw err; }));

// đặc trưng ảnh đã mã hoá: key → { tên đầu ra → Tensor } (2 ảnh gần nhất, ~16 MB mỗi ảnh)
const embeds = new Map();
async function embed(key, img) {
  const [enc] = await ready();
  if (img.width !== S || img.height !== S) throw new Error('SIZE');
  const d = img.data, n = S * S, x = new Float32Array(3 * n);
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) x[k * n + i] = (d[i * 4 + k] / 255 - MEAN[k]) / STD[k];
  const out = await enc.run({ [enc.inputNames[0]]: new ort.Tensor('float32', x, [1, 3, S, S]) });
  embeds.delete(key);
  embeds.set(key, out);
  while (embeds.size > 2) embeds.delete(embeds.keys().next().value);
}

/**
 * points: [[x, y, nhãn]] (0..1 theo ảnh; nhãn 1 = lấy, 0 = bỏ), box: [x0, y0, x1, y1] (0..1) hoặc null.
 * Trả logit mặt nạ có điểm tin cao nhất: Float32Array 256 × 256 (khung ảnh vuông 1024 — ảnh đã co / giãn).
 */
async function decode(key, points, box) {
  const [, dec] = await ready();
  const eo = embeds.get(key);
  const feeds = {};
  for (const k of dec.inputNames) {
    if (eo[k]) feeds[k] = eo[k];
    else if (k === 'input_points') feeds[k] = new ort.Tensor('float32', Float32Array.from(points.flatMap((p) => [p[0] * S, p[1] * S])), [1, 1, points.length, 2]);
    else if (k === 'input_labels') feeds[k] = new ort.Tensor('int64', BigInt64Array.from(points.map((p) => BigInt(p[2] ? 1 : 0))), [1, 1, points.length]);
    else if (k === 'input_boxes') feeds[k] = box ? new ort.Tensor('float32', Float32Array.from(box.map((v) => v * S)), [1, 1, 4]) : new ort.Tensor('float32', new Float32Array(0), [1, 0, 4]);
    else throw new Error('SAM_INPUT ' + k);
  }
  const out = await dec.run(feeds);
  const masks = out.pred_masks, iou = out.iou_scores.data;
  const [w, h] = masks.dims.slice(-2), n = w * h, m = iou.length;
  let best = 0;
  for (let k = 1; k < m; k++) if (iou[k] > iou[best]) best = k;
  // một điểm, không khung: mơ hồ (một phần / cả vật) — 3 mặt nạ từ nhỏ đến lớn. Lightroom lấy cả vật: chọn mặt nạ LỚN nhất trong số
  // có điểm tin gần mức cao nhất (kém ≤ 0,1)
  if (points.length === 1 && !box) {
    const area = (k) => { let c = 0; for (let i = k * n; i < (k + 1) * n; i++) if (masks.data[i] > 0) c++; return c; };
    let big = area(best);
    for (let k = 0; k < m; k++) { if (k === best || iou[k] < iou[best] - 0.1) continue; const a2 = area(k); if (a2 > big) { big = a2; best = k; } }
  }
  return { data: Float32Array.from(masks.data.subarray(best * n, (best + 1) * n)), w, h, iou: iou[best], obj: out.object_score_logits?.data?.[0] ?? 1 };
}

// ONNX Runtime WebGPU không chạy hai lượt cùng lúc: xếp hàng
let queue = Promise.resolve();
self.onmessage = ({ data }) => { queue = queue.then(() => handle(data)); };
async function handle(data) {
  const { id, key } = data || {};
  try {
    if (!embeds.has(key)) {
      // ảnh chưa mã hoá (lần đầu, hoặc worker vừa tắt vì rảnh): xin ảnh
      if (!data.img) { self.postMessage({ id, need: true }); return; }
      await embed(key, data.img);
    }
    const r = await decode(key, data.points || [], data.box || null);
    self.postMessage({ id, ...r, backend }, [r.data.buffer]);
  } catch (e) {
    self.postMessage({ id, error: String(e?.message || e) });
  }
}
