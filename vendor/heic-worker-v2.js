// Giải mã HEIC/HEIF (ảnh iPhone) trong worker riêng để không làm đơ giao diện.
// Dùng libheif (LGPL-3.0, xem libheif-1.23.5/LICENSE), nạp riêng dưới dạng file .wasm.
// Đổi nội dung file này thì phải đổi số phiên bản trong tên (file .js được lưu đệm một năm).
/* global libheif */
importScripts('libheif-1.23.5/libheif.js');
let modP = null;
const mod = () => (modP ||= Promise.resolve(libheif({ locateFile: (f) => 'libheif-1.23.5/' + f })));

self.onmessage = async ({ data }) => {
  const { id, buf } = data;
  try {
    const m = await mod();
    const dec = new m.HeifDecoder();
    const imgs = dec.decode(new Uint8Array(buf));
    if (!imgs || !imgs.length) throw new Error('EMPTY');
    try {
      const img = imgs.find((i) => i.is_primary && i.is_primary()) || imgs[0];
      const w = img.get_width(), h = img.get_height();
      // file khai báo kích thước bất thường (hỏng hoặc cố ý làm treo máy): không cấp phát
      if (!w || !h || w * h > 120000000) throw new Error('SIZE');
      const out = new Uint8ClampedArray(w * h * 4);
      await new Promise((res, rej) => img.display({ data: out, width: w, height: h }, (d) => (d ? res(d) : rej(new Error('DISPLAY')))));
      self.postMessage({ id, w, h, data: out }, [out.buffer]);
    } finally {
      for (const i of imgs) { try { i.free(); } catch (e) { /* */ } }
    }
  } catch (e) {
    self.postMessage({ id, error: String((e && e.message) || e) });
  }
};
