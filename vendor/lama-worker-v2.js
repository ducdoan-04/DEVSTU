// Xoá bằng AI (xoá vật thể): mô hình LaMa (Samsung AI / advimman, Apache 2.0 — bản ONNX của Carve, Apache 2.0) chạy bằng
// ONNX Runtime Web 1.20.1 (MIT) trong worker riêng để không làm đơ giao diện — xem LICENSES/lama.txt, LICENSES/onnxruntime.txt.
// Thay MI-GAN từ 19/10 (anh thấy MI-GAN lấp nhoè): LaMa vẽ nối cấu trúc (cột, lan can, mép tường) và vân tốt hơn hẳn.
// Mô hình chạy cố định 512 × 512: ảnh cắt quanh chỗ xoá được co về 512 × 512, chạy, rồi phóng về cỡ cũ; ngoài chỗ xoá giữ ảnh thật.
// Trọng số cất dạng fp16 (tools/onnx-fp16-store.py, 106 MB thay vì 208 MB), chia 4 phần 26,6 MB (GitHub chặn file > 100 MB, cầu nối chép sang máy ≤ 30 MB;
// tải song song). Đổi nội dung file này thì phải đổi số phiên bản trong tên (file .js được lưu đệm một năm).
// 12/11 (README §23z217 — dev Bảo: một ảnh, Làm sạch phông / rãnh cười đầy card 8 GB, đứng máy): tham số trên đường dẫn do app đặt theo mức Hiệu năng —
//   ?g=0: KHÔNG dùng card màn hình (mô hình cần nhiều bộ nhớ card hơn phần app được phép → chạy CPU); ?th=N: số luồng CPU cho WASM (tối đa 8).
import * as ort from './onnxruntime-web-1.20.1/ort.wasm.min.mjs';

ort.env.wasm.wasmPaths = new URL('./onnxruntime-web-1.20.1/', import.meta.url).href;
// chạy nhiều luồng cần trang được "cách ly" (COOP/COEP); không có thì một luồng
const Q_ = new URL(import.meta.url).searchParams;
const GPU_OK = Q_.get('g') !== '0';
ort.env.wasm.numThreads = Q_.get('t') === '1' || !self.crossOriginIsolated ? 1 : Q_.get('th') ? Math.max(1, Math.min(8, Number(Q_.get('th')) || 1)) : Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 2) - 1));
ort.env.wasm.proxy = false;

const PARTS = [1, 2, 3, 4].map((i) => new URL(`./lama/lama-fp16w.part${i}.bin`, import.meta.url).href);
const BYTES = 106291628;
const S = 512;

async function loadModel() {
  // tải 4 phần song song, báo tiến độ (lần đầu ~106 MB) — đã có trong bộ nhớ đệm thì gần như tức thì
  let got = 0, last = 0;
  const bufs = await Promise.all(PARTS.map(async (u) => {
    const r = await fetch(u);
    if (!r.ok || !r.body) throw new Error('HTTP ' + r.status);
    const rd = r.body.getReader(), chunks = [];
    let n = 0;
    for (;;) {
      const { done, value } = await rd.read();
      if (done) break;
      chunks.push(value); n += value.length; got += value.length;
      const now = performance.now();
      if (now - last > 250) { last = now; self.postMessage({ dl: Math.min(0.999, got / BYTES) }); }
    }
    const b = new Uint8Array(n);
    let o = 0;
    for (const c of chunks) { b.set(c, o); o += c.length; }
    return b;
  }));
  self.postMessage({ dl: 1 });
  const all = new Uint8Array(bufs.reduce((a, b) => a + b.length, 0));
  let o = 0;
  for (const b of bufs) { all.set(b, o); o += b.length; }
  if (all.length !== BYTES) throw new Error('MODEL_SIZE');
  return all;
}

let session = null;
const ready = () => (session ||= loadModel()
  .then((m) => ort.InferenceSession.create(m, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' }))
  .catch((e) => { session = null; throw e; })); // mất mạng lúc tải mô hình: lần sau thử lại

/** img: ImageData (RGBA), mask: Uint8Array cùng cỡ, 1 = chỗ cần lấp. Trả RGBA đã lấp, cùng cỡ (ngoài chỗ lấp = ảnh cũ). */
async function fill(img, mask) {
  const s = await ready();
  const { width: w, height: h, data: d } = img;
  if (!w || !h || w * h > 4_200_000 || !(mask instanceof Uint8Array) || mask.length !== w * h) throw new Error('SIZE');
  // ảnh → 512 × 512 (co giãn cả hai chiều, nội suy hai chiều)
  const src = new OffscreenCanvas(w, h);
  src.getContext('2d').putImageData(img, 0, 0);
  const sq = new OffscreenCanvas(S, S);
  const sx = sq.getContext('2d', { willReadFrequently: true });
  sx.imageSmoothingQuality = 'high';
  sx.drawImage(src, 0, 0, S, S);
  const px = sx.getImageData(0, 0, S, S).data;
  // mặt nạ → 512 × 512: điểm nào có dính chỗ xoá là xoá (không để sót viền vật khi co)
  const m = new Float32Array(S * S);
  for (let y = 0; y < h; y++) {
    const yy0 = Math.floor((y * S) / h), yy1 = Math.max(yy0, Math.ceil(((y + 1) * S) / h) - 1);
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      const xx0 = Math.floor((x * S) / w), xx1 = Math.max(xx0, Math.ceil(((x + 1) * S) / w) - 1);
      for (let yy = yy0; yy <= yy1; yy++) for (let xx = xx0; xx <= xx1; xx++) m[yy * S + xx] = 1;
    }
  }
  const n = S * S, x = new Float32Array(3 * n);
  for (let i = 0; i < n; i++) {
    // chỗ xoá: đưa vào 0 như lúc huấn luyện (mô hình tự bỏ qua điểm ảnh ở đó)
    const k = m[i] ? 0 : 1 / 255;
    x[i] = px[i * 4] * k; x[n + i] = px[i * 4 + 1] * k; x[2 * n + i] = px[i * 4 + 2] * k;
  }
  const out = await s.run({ image: new ort.Tensor('float32', x, [1, 3, S, S]), mask: new ort.Tensor('float32', m, [1, 1, S, S]) });
  const r = out[s.outputNames[0]].data; // 0..255
  const o512 = new ImageData(S, S);
  for (let i = 0; i < n; i++) {
    o512.data[i * 4] = r[i]; o512.data[i * 4 + 1] = r[n + i]; o512.data[i * 4 + 2] = r[2 * n + i]; o512.data[i * 4 + 3] = 255;
  }
  sx.putImageData(o512, 0, 0);
  // phóng kết quả về cỡ ảnh cắt; ngoài chỗ xoá giữ ảnh thật
  const back = new OffscreenCanvas(w, h);
  const bx = back.getContext('2d', { willReadFrequently: true });
  bx.imageSmoothingQuality = 'high';
  bx.drawImage(sq, 0, 0, w, h);
  const res = bx.getImageData(0, 0, w, h).data;
  const rgba = new Uint8ClampedArray(4 * w * h);
  for (let i = 0; i < w * h; i++) {
    const a = mask[i] ? res : d;
    rgba[i * 4] = a[i * 4]; rgba[i * 4 + 1] = a[i * 4 + 1]; rgba[i * 4 + 2] = a[i * 4 + 2]; rgba[i * 4 + 3] = 255;
  }
  return rgba;
}

self.onmessage = async ({ data }) => {
  const { id, img, mask } = data || {};
  try {
    const rgba = await fill(img, mask);
    self.postMessage({ id, rgba, w: img.width, h: img.height }, [rgba.buffer]);
  } catch (e) {
    self.postMessage({ id, error: String(e?.message || e) });
  }
};
