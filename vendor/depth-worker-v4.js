// Đo độ sâu (gần / xa) của ảnh, chạy trong worker riêng để không làm đơ giao diện.
// Mô hình Depth Anything V2 Small (Apache-2.0, bản nén uint8 của onnx-community) chạy bằng
// ONNX Runtime Web 1.20.1 (MIT) — xem LICENSES/depth-anything.txt và LICENSES/onnxruntime.txt.
// Đổi nội dung file này thì phải đổi số phiên bản trong tên (file .js được lưu đệm một năm).
// 12/11 (README §23z217 — dev Bảo: một ảnh, Làm sạch phông / rãnh cười đầy card 8 GB, đứng máy): tham số trên đường dẫn do app đặt theo mức Hiệu năng —
//   ?g=0: KHÔNG dùng card màn hình (mô hình cần nhiều bộ nhớ card hơn phần app được phép → chạy CPU); ?th=N: số luồng CPU cho WASM (tối đa 8).
// 12/11 (README §23z225 — chế độ card màn hình rời của app máy tính): ?gm=1 (app đặt khi người dùng bật "Dùng card màn hình rời" và card đủ bộ nhớ)
//   → thử chạy trên card (WebGPU), lỗi thì CPU như cũ. Không có gm=1: chạy CPU (WASM) như bản trước. ONNX Runtime bản có WebGPU dùng chung với BiRefNet.
import * as ort from './scunet/ort.webgpu.min.mjs';

ort.env.wasm.wasmPaths = new URL('./scunet/', import.meta.url).href;
// chạy nhiều luồng cần trang được "cách ly" (COOP/COEP); không có thì một luồng
// ?t=1: một luồng — máy ít bộ nhớ (02/11, iPhone 11 Pro: 6 worker con của ONNX Runtime + vùng nhớ dùng chung đẩy trang vượt giới hạn iOS, trang sập)
const Q_ = new URL(import.meta.url).searchParams;
const GPU_OK = Q_.get('g') !== '0';
const GPU_MODE = Q_.get('gm') === '1';
let backend = '', gpuErr = '';
ort.env.wasm.numThreads = Q_.get('t') === '1' || !self.crossOriginIsolated ? 1 : Q_.get('th') ? Math.max(1, Math.min(8, Number(Q_.get('th')) || 1)) : Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 2) - 1));
ort.env.wasm.proxy = false;

const MODEL = new URL('./depth-anything-v2-small/model_uint8.onnx', import.meta.url).href;
const MEAN = [0.485, 0.456, 0.406], STD = [0.229, 0.224, 0.225];

let session = null;
async function create(cpu = false) {
  if (!cpu && GPU_OK && GPU_MODE && self.navigator?.gpu) {
    try { const s = await ort.InferenceSession.create(MODEL, { executionProviders: ['webgpu'], graphOptimizationLevel: 'all' }); backend = 'webgpu'; return s; } catch (e) { gpuErr = String(e?.message || e).slice(0, 200); /* sang WASM */ }
  }
  const s = await ort.InferenceSession.create(MODEL, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
  backend = 'wasm';
  return s;
}
/** Chạy; lượt trên card lỗi (phép tính WebGPU chưa hỗ trợ, hết bộ nhớ card…) thì tạo lại phiên CPU và chạy lại — người dùng không gặp lỗi. */
async function run(feeds) {
  const s = await ready();
  try { return await s.run(feeds); } catch (e) {
    if (backend !== 'webgpu') throw e;
    gpuErr = 'run: ' + String(e?.message || e).slice(0, 200);
    session = create(true);
    return (await session).run(feeds);
  }
}
const ready = () => (session ||= create()
  .catch((e) => { session = null; throw e; })); // mất mạng lúc tải mô hình: lần sau thử lại

/** img: ImageData, cạnh là bội số của 14. Trả độ sâu tương đối (càng lớn càng gần), cùng cỡ ảnh vào. */
async function depth(img) {
  const s = await ready();
  const { width: w, height: h, data: d } = img;
  if (!w || !h || w % 14 || h % 14 || w * h > 1_000_000) throw new Error('SIZE');
  const n = w * h, x = new Float32Array(3 * n);
  for (let i = 0; i < n; i++) {
    x[i] = (d[i * 4] / 255 - MEAN[0]) / STD[0];
    x[n + i] = (d[i * 4 + 1] / 255 - MEAN[1]) / STD[1];
    x[2 * n + i] = (d[i * 4 + 2] / 255 - MEAN[2]) / STD[2];
  }
  const out = await run({ [s.inputNames[0]]: new ort.Tensor('float32', x, [1, 3, h, w]) });
  const t = out[s.outputNames[0]];
  const dims = t.dims;
  return { data: new Float32Array(t.data), w: dims[dims.length - 1], h: dims[dims.length - 2] };
}

self.onmessage = async ({ data }) => {
  const { id, img } = data || {};
  try {
    const r = await depth(img);
    self.postMessage({ id, ...r, be: backend, ge: gpuErr }, [r.data.buffer]);
  } catch (e) {
    self.postMessage({ id, error: String(e?.message || e) });
  }
};
