// Chia phần người + điểm mốc khuôn mặt bằng AI (25/10/2026 — README §23z64), MediaPipe Tasks Vision 1.0.1 (Apache-2.0, Google):
//   - Selfie Multiclass 256 × 256: mỗi điểm ảnh → nền / tóc / da người / da mặt / quần áo / phụ kiện (độ tin 0..1);
//   - Face Landmarker (Face Mesh V2): 478 điểm mốc trên mặt (có tròng mắt) — chạy trên vùng cắt quanh từng khuôn mặt app đã tìm;
//   - Pose Landmarker Full (BlazePose GHUM 3D, v2 — 28/10): 33 điểm khớp cơ thể (vai, khuỷu, cổ tay, hông, gối…) cho thon người tự động;
//   - Hand Landmarker (v2 — 28/10): 21 điểm trên bàn tay (khớp từng ngón) — chạy trên vùng cắt quanh cổ tay app đã tìm, cho thon bàn tay;
//   - Object Detector EfficientDet-Lite0 int8 (v3 — 31/10, 4,6 MB, COCO 80 loại): người + động vật trong ảnh cho Lọc ảnh (chỉ trả các loại
//     đó, không trả đồ vật).
// Chạy bằng CPU (WASM) — mô hình nhỏ (16 MB + 3,7 MB + 9,4 MB + 7,8 MB), vài trăm mili giây. Xem LICENSES/mediapipe.txt.
// Đổi nội dung file này thì phải đổi số phiên bản trong tên (file .js được lưu đệm một năm).
import { FaceLandmarker, FilesetResolver, HandLandmarker, ImageSegmenter, ObjectDetector, PoseLandmarker } from './mediapipe/vision_bundle.mjs';
// Thư viện nạp loader WASM (ES module) một lần rồi xoá self.ModuleFactory sau khi tạo tác vụ đầu → tác vụ thứ hai báo 'ModuleFactory not
// set'. Tự nạp loader (cùng một module, trình duyệt dùng lại) và gán lại trước mỗi lần tạo tác vụ.
import ModuleFactory from './mediapipe/vision_wasm_module_internal.js';
const arm = (fs) => { self.ModuleFactory = ModuleFactory; return fs; };

const BASE = new URL('./mediapipe/', import.meta.url).href;
let fileset = null, seg = null, face = null, pose = null, hand = null, obj = null;
const files = () => (fileset ||= FilesetResolver.forVisionTasks(BASE.replace(/\/$/, ''), true).catch((e) => { fileset = null; throw e; }));
const segmenter = () => (seg ||= files().then(arm).then((fs) => ImageSegmenter.createFromOptions(fs, {
  baseOptions: { modelAssetPath: BASE + 'selfie_multiclass_256x256.tflite', delegate: 'CPU' },
  runningMode: 'IMAGE', outputConfidenceMasks: true, outputCategoryMask: false,
})).catch((e) => { seg = null; throw e; }));
const landmarker = () => (face ||= files().then(arm).then((fs) => FaceLandmarker.createFromOptions(fs, {
  baseOptions: { modelAssetPath: BASE + 'face_landmarker.task', delegate: 'CPU' },
  runningMode: 'IMAGE', numFaces: 1, minFaceDetectionConfidence: 0.3, minFacePresenceConfidence: 0.3,
})).catch((e) => { face = null; throw e; }));

const poser = () => (pose ||= files().then(arm).then((fs) => PoseLandmarker.createFromOptions(fs, {
  baseOptions: { modelAssetPath: BASE + 'pose_landmarker_full.task', delegate: 'CPU' },
  runningMode: 'IMAGE', numPoses: 4, minPoseDetectionConfidence: 0.5, minPosePresenceConfidence: 0.5, outputSegmentationMasks: false,
})).catch((e) => { pose = null; throw e; }));

const hander = () => (hand ||= files().then(arm).then((fs) => HandLandmarker.createFromOptions(fs, {
  baseOptions: { modelAssetPath: BASE + 'hand_landmarker.task', delegate: 'CPU' },
  runningMode: 'IMAGE', numHands: 2, minHandDetectionConfidence: 0.4, minHandPresenceConfidence: 0.4,
})).catch((e) => { hand = null; throw e; }));

// người + 10 loài động vật của bộ COCO (tên đúng như labelmap của mô hình)
const SUBJECTS = ['person', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe'];
const detector = () => (obj ||= files().then(arm).then((fs) => ObjectDetector.createFromOptions(fs, {
  baseOptions: { modelAssetPath: BASE + 'efficientdet_lite0.tflite', delegate: 'CPU' },
  runningMode: 'IMAGE', maxResults: 25, scoreThreshold: 0.3, categoryAllowlist: SUBJECTS,
})).catch((e) => { obj = null; throw e; }));

/** img: ImageData. Trả người / động vật thấy được: [{ c: tên loại, s: độ tin, b: [x, y, rộng, cao] theo ảnh 0..1 }]. */
async function objects(img) {
  const d = await detector();
  const r = d.detect(img);
  const W = img.width, H = img.height;
  return (r.detections || []).map((x) => {
    const c = x.categories?.[0], bb = x.boundingBox;
    return c && bb ? { c: c.categoryName, s: c.score, b: [bb.originX / W, bb.originY / H, bb.width / W, bb.height / H] } : null;
  }).filter(Boolean);
}

/** crops: [{ img, x, y, w, h }] (vùng cắt quanh cổ tay, toạ độ 0..1 của ảnh). Trả mỗi vùng các bàn tay thấy được, mỗi bàn 21 × (x, y) theo ảnh 0..1. */
async function hands(crops) {
  const hl = await hander();
  return crops.map((c) => (hl.detect(c.img).landmarks || []).filter((lm) => lm && lm.length >= 21).map((lm) => {
    const pts = new Float32Array(42);
    for (let i = 0; i < 21; i++) { pts[2 * i] = c.x + lm[i].x * c.w; pts[2 * i + 1] = c.y + lm[i].y * c.h; }
    return pts;
  }));
}

/** img: ImageData (cả ảnh). Trả mỗi người 33 × (x, y, độ tin thấy được) theo ảnh 0..1. */
async function poses(img) {
  const pl = await poser();
  const r = pl.detect(img);
  return (r.landmarks || []).filter((lm) => lm && lm.length >= 33).map((lm) => {
    const out = new Float32Array(33 * 3);
    for (let i = 0; i < 33; i++) { out[3 * i] = lm[i].x; out[3 * i + 1] = lm[i].y; out[3 * i + 2] = lm[i].visibility ?? 1; }
    return out;
  });
}

/** img: ImageData. Trả 5 lớp độ tin (tóc, da người, da mặt, quần áo, phụ kiện) nối liền: Float32Array 5 × w × h. */
async function parts(img) {
  const s = await segmenter();
  const r = s.segment(img);
  const masks = r.confidenceMasks || [];
  if (masks.length < 6) throw new Error('MP_CLASSES');
  const n = img.width * img.height, out = new Float32Array(5 * n);
  for (let k = 1; k <= 5; k++) out.set(masks[k].getAsFloat32Array().subarray(0, n), (k - 1) * n);
  for (const m of masks) m.close();
  return out;
}

/** crops: [{ img: ImageData, x, y, w, h }] (vùng cắt, toạ độ 0..1 của ảnh). Trả mỗi vùng 478 × (x, y) theo ảnh 0..1, hoặc null. */
async function faces(crops) {
  const fl = await landmarker();
  return crops.map((c) => {
    const r = fl.detect(c.img);
    const lm = r.faceLandmarks?.[0];
    if (!lm || lm.length < 478) return null;
    const pts = new Float32Array(lm.length * 2);
    lm.forEach((p, i) => { pts[2 * i] = c.x + p.x * c.w; pts[2 * i + 1] = c.y + p.y * c.h; });
    return pts;
  });
}

let queue = Promise.resolve();
self.onmessage = ({ data }) => { queue = queue.then(() => handle(data)); };
async function handle(data) {
  const { id, op } = data || {};
  try {
    if (op === 'parts') {
      const y = await parts(data.img);
      self.postMessage({ id, data: y, w: data.img.width, h: data.img.height }, [y.buffer]);
    } else if (op === 'faces') {
      const r = await faces(data.crops);
      self.postMessage({ id, faces: r }, r.filter(Boolean).map((x) => x.buffer));
    } else if (op === 'pose') {
      const r = await poses(data.img);
      self.postMessage({ id, poses: r }, r.map((x) => x.buffer));
    } else if (op === 'hands') {
      const r = await hands(data.crops);
      self.postMessage({ id, hands: r }, r.flat().map((x) => x.buffer));
    } else if (op === 'objects') {
      self.postMessage({ id, objects: await objects(data.img) });
    } else throw new Error('OP');
  } catch (e) {
    self.postMessage({ id, error: String(e?.message || e) });
  }
}
