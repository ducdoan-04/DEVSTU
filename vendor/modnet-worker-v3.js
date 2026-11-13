// Tách người khỏi nền bằng AI (độ phủ mềm, có sợi tóc), chạy trong worker riêng để không làm đơ giao diện.
// Mô hình MODNet (Apache-2.0, bản nén uint8 của Xenova/modnet — 6,3 MB) chạy bằng ONNX Runtime Web 1.20.1 (MIT) — xem
// LICENSES/modnet.txt và LICENSES/onnxruntime.txt. Anh chọn hướng này 20/10 khuya (vùng chọn tự động "chưa ổn lắm").
// Đổi nội dung file này thì phải đổi số phiên bản trong tên (file .js được lưu đệm một năm).
// 12/11 (README §23z217 — dev Bảo: một ảnh, Làm sạch phông / rãnh cười đầy card 8 GB, đứng máy): tham số trên đường dẫn do app đặt theo mức Hiệu năng —
//   ?g=0: KHÔNG dùng card màn hình (mô hình cần nhiều bộ nhớ card hơn phần app được phép → chạy CPU); ?th=N: số luồng CPU cho WASM (tối đa 8).
import * as ort from './onnxruntime-web-1.20.1/ort.wasm.min.mjs';

ort.env.wasm.wasmPaths = new URL('./onnxruntime-web-1.20.1/', import.meta.url).href;
// chạy nhiều luồng cần trang được "cách ly" (COOP/COEP); không có thì một luồng
// ?t=1: một luồng — máy ít bộ nhớ (02/11, iPhone 11 Pro: 6 worker con của ONNX Runtime + vùng nhớ dùng chung đẩy trang vượt giới hạn iOS, trang sập)
const Q_ = new URL(import.meta.url).searchParams;
const GPU_OK = Q_.get('g') !== '0';
ort.env.wasm.numThreads = Q_.get('t') === '1' || !self.crossOriginIsolated ? 1 : Q_.get('th') ? Math.max(1, Math.min(8, Number(Q_.get('th')) || 1)) : Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 2) - 1));
ort.env.wasm.proxy = false;

const MODEL = new URL('./modnet/model_uint8.onnx', import.meta.url).href;

let session = null;
const ready = () => (session ||= ort.InferenceSession.create(MODEL, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' })
  .catch((e) => { session = null; throw e; })); // mất mạng lúc tải mô hình: lần sau thử lại

/** img: ImageData, hai cạnh là bội số của 32. Trả độ phủ người 0..1, cùng cỡ ảnh vào. */
async function matte(img) {
  const s = await ready();
  const { width: w, height: h, data: d } = img;
  if (!w || !h || w % 32 || h % 32 || w * h > 1_200_000) throw new Error('SIZE');
  const n = w * h, x = new Float32Array(3 * n);
  // chuẩn hoá như lúc huấn luyện: (x / 255 − 0,5) / 0,5
  for (let i = 0; i < n; i++) {
    x[i] = d[i * 4] / 127.5 - 1;
    x[n + i] = d[i * 4 + 1] / 127.5 - 1;
    x[2 * n + i] = d[i * 4 + 2] / 127.5 - 1;
  }
  const out = await s.run({ [s.inputNames[0]]: new ort.Tensor('float32', x, [1, 3, h, w]) });
  const t = out[s.outputNames[0]];
  const dims = t.dims;
  return { data: new Float32Array(t.data), w: dims[dims.length - 1], h: dims[dims.length - 2] };
}

self.onmessage = async ({ data }) => {
  const { id, img } = data || {};
  try {
    const r = await matte(img);
    self.postMessage({ id, ...r }, [r.data.buffer]);
  } catch (e) {
    self.postMessage({ id, error: String(e?.message || e) });
  }
};
