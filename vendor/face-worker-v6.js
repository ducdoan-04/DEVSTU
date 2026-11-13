// Nhận diện khuôn mặt + 68 điểm mốc, chạy trong worker riêng để không làm đơ giao diện.
// v2 (26/10): thêm "dấu vân mặt" 128 số (FaceRecognitionNet của face-api, MIT) để nhóm ảnh theo người ở màn Lọc ảnh — chỉ tải mô hình
// này (6,4 MB) khi người dùng bấm "Tìm người trong ảnh".
// v3 (31/10 — anh: "1 album có hàng ngàn ảnh và mỗi ảnh có nhiều người khác nhau … giới hạn số lượng khuôn mặt"): "Tìm người" chỉ tính dấu
// vân mặt cho tối đa `max` mặt LỚN nhất mỗi ảnh (mặc định 10), bỏ mặt quá nhỏ (bề ngang < `minW` × bề ngang ảnh) — tìm mặt trước, cắt
// từng mặt đã chọn ra tính riêng, nên ảnh đông người không tốn thời gian cho mặt nhỏ phía xa.
// v4 (02/11 — anh: Làm đẹp da AI trên app iPhone không chạy, Safari chạy): sửa đường dẫn mô hình trên giao thức fr://.
// v5 (03/11 — iPad lag khoảng một phút sau khi cài, chặn riêng worker này là hết): chọn backend theo từng việc (`backend`: cpu | webgl). Trên WebKit ảnh đang chỉnh chạy CPU,
// không dựng WebGL trong worker nên không tranh với bộ vẽ; việc hàng loạt khách tự bấm vẫn dùng WebGL cho nhanh (io/face.ts).
// v6 (13/11 — máy không có card, ANGLE WARP): khi WebGL không dựng được, TensorFlow.js thử backend WASM mà gói không có file .wasm → lỗi 404
// mỗi lần khởi động rồi mới xuống CPU. Gỡ đăng ký backend WASM ngay sau khi nạp: hỏng WebGL thì xuống thẳng CPU (kết quả như cũ).
// Dùng face-api 1.7.15 (MIT, kèm TensorFlow.js — Apache 2.0), xem face-api-1.7.15/THIRD_PARTY.txt.
// Đổi nội dung file này thì phải đổi số phiên bản trong tên (file .js được lưu đệm một năm).
import * as faceapi from './face-api-1.7.15/face-api.esm.js';

// chỉ đường dẫn, không kèm giao thức: face-api chỉ biết http:// và https://, gặp fr://localhost/ (app Mac, iPhone) nó gộp dấu / thành fr:/localhost/ nên không tải được mô hình
const MODEL = new URL('./face-api-1.7.15/model', import.meta.url).pathname;
const no = () => { throw new Error('NO_DOM'); };
// worker không có DOM: chỉ dùng OffscreenCanvas và dữ liệu điểm ảnh
faceapi.env.setEnv({
  Canvas: OffscreenCanvas, CanvasRenderingContext2D: OffscreenCanvasRenderingContext2D, Image: class {}, ImageData, Video: class {},
  createCanvasElement: () => new OffscreenCanvas(1, 1), createImageElement: no, createVideoElement: no,
  fetch: self.fetch.bind(self), readFile: no,
});

try { faceapi.tf.removeBackend('wasm'); } catch { /* bản tfjs không có backend wasm */ }
let backend = '';
async function useBackend(want) {
  if (backend === want) return;
  try { await faceapi.tf.setBackend(want); await faceapi.tf.ready(); backend = want; }
  catch { await faceapi.tf.setBackend('cpu'); await faceapi.tf.ready(); backend = 'cpu'; }
}

let base = null;
function ready() {
  return (base ||= (async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL);
    return faceapi.tf.getBackend();
  })().catch((e) => { base = null; throw e; })); // mất mạng lúc tải mô hình: lần sau thử lại
}
let ssd = null;
const ssdReady = () => (ssd ||= faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL).catch((e) => { ssd = null; throw e; }));
let rec = null;
const recReady = () => (rec ||= faceapi.nets.faceRecognitionNet.loadFromUri(MODEL).catch((e) => { rec = null; throw e; }));

/**
 * Khuôn mặt + dấu vân mặt (128 số) — mô hình kỹ (SSD) để bắt cả mặt nhỏ trong ảnh đông người. Chỉ `max` mặt lớn nhất, bề ngang ≥ `minW`
 * × bề ngang ảnh: tìm mặt cả ảnh trước, rồi mỗi mặt đã chọn cắt một vùng rộng gấp 2 quanh nó, tìm lại + điểm mốc + dấu vân trên vùng nhỏ đó.
 */
async function describe(img, max = 10, minW = 0.025) {
  await ready();
  await ssdReady();
  await recReady();
  const W = img.width, H = img.height;
  if (!W || !H || W * H > 6_000_000) throw new Error('SIZE');
  const opt = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
  const t = faceapi.tf.browser.fromPixels(img);
  let pick;
  try {
    const dets = await faceapi.detectAllFaces(t, opt);
    pick = dets.filter((d) => d.box.width / W >= minW).sort((a, b) => b.box.area - a.box.area).slice(0, Math.max(1, Math.min(40, max)));
  } finally {
    t.dispose();
  }
  const src = new OffscreenCanvas(W, H);
  src.getContext('2d').putImageData(img, 0, 0);
  const out = [];
  for (const d of pick) {
    const b = d.box, side = Math.max(b.width, b.height) * 2;
    const x0 = Math.max(0, Math.round(b.x + b.width / 2 - side / 2)), y0 = Math.max(0, Math.round(b.y + b.height / 2 - side / 2));
    const x1 = Math.min(W, Math.round(b.x + b.width / 2 + side / 2)), y1 = Math.min(H, Math.round(b.y + b.height / 2 + side / 2));
    const cw = x1 - x0, ch = y1 - y0;
    if (cw < 16 || ch < 16) continue;
    const crop = new OffscreenCanvas(cw, ch);
    crop.getContext('2d').drawImage(src, x0, y0, cw, ch, 0, 0, cw, ch);
    const ct = faceapi.tf.browser.fromPixels(crop.getContext('2d').getImageData(0, 0, cw, ch));
    try {
      const r = await faceapi.detectSingleFace(ct, opt).withFaceLandmarks().withFaceDescriptor();
      if (!r) continue;
      const rb = r.detection.box;
      out.push({ box: [(x0 + rb.x) / W, (y0 + rb.y) / H, rb.width / W, rb.height / H], score: r.detection.score, desc: Array.from(r.descriptor) });
    } finally {
      ct.dispose();
    }
  }
  return out;
}

async function detect(img, thorough) {
  await ready();
  const W = img.width, H = img.height;
  if (!W || !H || W * H > 6_000_000) throw new Error('SIZE');
  const t = faceapi.tf.browser.fromPixels(img);
  try {
    let opt;
    if (thorough) { await ssdReady(); opt = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4 }); }
    else opt = new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.45 });
    const res = await faceapi.detectAllFaces(t, opt).withFaceLandmarks();
    return res.slice(0, 40).map((r) => {
      const b = r.detection.box;
      const pts = [];
      for (const p of r.landmarks.positions) pts.push(p.x / W, p.y / H);
      return { box: [b.x / W, b.y / H, b.width / W, b.height / H], score: r.detection.score, pts };
    });
  } finally {
    t.dispose();
  }
}

self.onmessage = async ({ data }) => {
  const { id, img, thorough, op, max, backend: want } = data;
  try {
    await useBackend(want === 'cpu' ? 'cpu' : 'webgl');
    const faces = op === 'desc' ? await describe(img, typeof max === 'number' ? max : 10) : await detect(img, !!thorough);
    self.postMessage({ id, faces, backend });
  } catch (e) {
    self.postMessage({ id, error: String((e && e.message) || e) });
  }
};
