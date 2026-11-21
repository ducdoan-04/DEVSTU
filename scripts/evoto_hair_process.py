import sys
import os
import json
import base64
import time
import argparse
import cv2
import numpy as np

# 13 Evoto Salon Hair Dye Specifications from Collabs Retouch Pro:
# (target_rgb, exp_adj, con_adj, sh_lift, chroma_mix)
EVOTO_HAIR_SPECS = {
    "h01": ((0.486, 0.412, 0.357), 0.14,  0.07,  0.19, 0.72), # #7C695B Cool Tea
    "h02": ((0.537, 0.361, 0.286), 0.10,  0.07,  0.08, 0.76), # #895C49 Tea Brown
    "h03": ((0.776, 0.475, 0.318), 0.20,  0.06,  0.29, 0.80), # #C67951 Orange Brown
    "h04": ((0.612, 0.329, 0.349), 0.16,  0.07,  0.12, 0.78), # #9C5459 Red Brown+
    "h05": ((0.678, 0.349, 0.337), 0.18, -0.16,  0.27, 0.82), # #AD5956 Ruby Red
    "h06": ((0.596, 0.447, 0.431), 0.22, -0.10,  0.19, 0.78), # #98726E Pink Brown
    "h07": ((0.808, 0.576, 0.565), 0.32,  0.00,  0.42, 0.84), # #CE9390 Sakura Pink
    "h08": ((0.220, 0.185, 0.172), -0.18, 0.08, -0.26, 0.78), # #5D4B43 Natural Black
    "h09": ((0.270, 0.305, 0.425), 0.06, -0.06,  0.10, 0.80), # #646980 Blue Black
    "h10": ((0.608, 0.345, 0.424), 0.14,  0.03,  0.22, 0.82), # #9B586C Grape Purple
    "h11": ((0.486, 0.427, 0.510), 0.16,  0.09,  0.19, 0.80), # #7C6D82 Blue Purple
    "h12": ((0.443, 0.435, 0.376), 0.15,  0.12,  0.13, 0.76), # #716F60 Olive Flax
    "h13": ((0.459, 0.502, 0.376), 0.18, -0.14,  0.28, 0.80), # #758060 Ash Moss
}

def compute_skin_weight(r, g, b):
    """
    Calibrated skin chroma detector (YCbCr + HSV) matching Collabs Retouch Pro.
    r, g, b are float arrays [0..1]
    """
    r255 = r * 255.0
    g255 = g * 255.0
    b255 = b * 255.0
    cb = 128.0 - 0.168736 * r255 - 0.331264 * g255 + 0.5 * b255
    cr = 128.0 + 0.5 * r255 - 0.418688 * g255 - 0.081312 * b255
    cb_dist = np.abs((cb - 112.0) / 26.0)
    cr_dist = np.abs((cr - 152.0) / 28.0)
    chroma_score = np.clip(1.0 - np.sqrt(cb_dist * cb_dist + cr_dist * cr_dist), 0.0, 1.0)

    # Fast vectorized HSV hue & sat
    max_c = np.maximum(r, np.maximum(g, b))
    min_c = np.minimum(r, np.minimum(g, b))
    delta = max_c - min_c + 1e-7
    sat = delta / np.maximum(max_c, 1e-7)

    # Hue in degrees [0..360]
    hue = np.zeros_like(r)
    mask_r = (max_c == r)
    mask_g = (max_c == g) & (~mask_r)
    mask_b = (~mask_r) & (~mask_g)

    hue[mask_r] = ((g[mask_r] - b[mask_r]) / delta[mask_r]) % 6.0 * 60.0
    hue[mask_g] = ((b[mask_g] - r[mask_g]) / delta[mask_g] + 2.0) * 60.0
    hue[mask_b] = ((r[mask_b] - g[mask_b]) / delta[mask_b] + 4.0) * 60.0
    hue = (hue + 360.0) % 360.0

    hue_ok = np.where((hue <= 54.0) | (hue >= 330.0), 1.0, 0.0)
    sat_ok = np.where((sat >= 0.06) & (sat <= 0.82) & (max_c >= 0.10), 1.0, 0.25)

    return np.clip(chroma_score * hue_ok * sat_ok, 0.0, 1.0)

def apply_evoto_hair_dye(img_rgb, hair_mask, skin_mask, preset, strength, darken, shine=0, gray=0, unify=0, smooth=0):
    """
    Vectorized implementation matching Collabs Retouch Pro Rust apply_evoto_hair_dye.
    img_rgb: float32 (H, W, 3), range [0, 1]
    hair_mask: float32 (H, W), range [0, 1]
    skin_mask: float32 (H, W), range [0, 1]
    """
    key = str(preset).lower()
    if key not in EVOTO_HAIR_SPECS or strength <= 0.5:
        return img_rgb.copy()

    (pr, pg, pb), exp_adj, con_adj, sh_lift, chroma_mix = EVOTO_HAIR_SPECS[key]

    r = img_rgb[:, :, 0]
    g = img_rgb[:, :, 1]
    b = img_rgb[:, :, 2]

    # Hair strand high-frequency detail: high = orig - gaussian_blur
    blur_fine = cv2.GaussianBlur(img_rgb, (5, 5), 1.2)
    high_r = r - blur_fine[:, :, 0]
    high_g = g - blur_fine[:, :, 1]
    high_b = b - blur_fine[:, :, 2]

    # Skin chroma guard: protects face, forehead hairline, ears and neck
    hair_skin_guard = compute_skin_weight(r, g, b)

    # Hair core gate: isolates hair fibers strictly from face and skin
    hair_core_gate = np.clip((hair_mask - 0.16) / 0.56, 0.0, 1.0) \
        * np.clip(1.0 - skin_mask * 1.4, 0.0, 1.0) \
        * np.clip(1.0 - hair_skin_guard * 1.35, 0.0, 1.0)

    scalp_guard = np.clip(1.0 - hair_skin_guard * 0.9, 0.15, 1.0)
    deg = np.clip(strength / 100.0, 0.0, 1.0)
    dye_a = np.clip(hair_core_gate * scalp_guard * deg * 0.90, 0.0, 0.92)

    # Active mask where dye will take effect
    active = dye_a > 0.005
    if not np.any(active):
        return img_rgb.copy()

    out_r = r.copy()
    out_g = g.copy()
    out_b = b.copy()

    # Active pixel luminance
    ra = r[active]
    ga = g[active]
    ba = b[active]
    hra = high_r[active]
    hga = high_g[active]
    hba = high_b[active]
    da = dye_a[active]

    lum = np.clip(0.299 * ra + 0.587 * ga + 0.114 * ba, 0.0, 1.0)
    lifted_lum = np.clip(lum * (1.0 + exp_adj * 0.55) + sh_lift * 0.16 * (1.0 - lum), 0.02, 0.96)
    dark_scale = 1.0 - np.clip(darken / 100.0, 0.0, 1.0) * 0.38
    target_lum = np.clip((lifted_lum - 0.5) * (1.0 + con_adj * 0.35) + 0.5, 0.02, 0.96) * dark_scale

    p_lum = max(0.06, 0.299 * pr + 0.587 * pg + 0.114 * pb)
    gain = np.clip(target_lum / p_lum, 0.22, 1.85)

    # Pigment color with strand micro-texture preservation
    dr = np.clip(pr * gain + hra * 0.65, 0.0, 1.0)
    dg = np.clip(pg * gain + hga * 0.65, 0.0, 1.0)
    db = np.clip(pb * gain + hba * 0.65, 0.0, 1.0)

    mix_w = da * chroma_mix
    out_r[active] = np.clip(ra * (1.0 - mix_w) + dr * mix_w, 0.0, 1.0)
    out_g[active] = np.clip(ga * (1.0 - mix_w) + dg * mix_w, 0.0, 1.0)
    out_b[active] = np.clip(ba * (1.0 - mix_w) + db * mix_w, 0.0, 1.0)

    # Shine (tăng độ bóng)
    if shine > 0.5:
        shine_str = np.clip(shine / 100.0, 0.0, 1.0)
        lum_out = 0.299 * out_r[active] + 0.587 * out_g[active] + 0.114 * out_b[active]
        lum_blur = 0.299 * blur_fine[:, :, 0][active] + 0.587 * blur_fine[:, :, 1][active] + 0.114 * blur_fine[:, :, 2][active]
        strand_sheen = np.clip((lum_out - lum_blur) * 4.5, 0.0, 1.0)
        silk_band = np.clip((lum_out - 0.03) / 0.19, 0.0, 1.0) * np.clip(1.0 - (lum_out - 0.55) / 0.31, 0.0, 1.0)
        gate_a = hair_core_gate[active]
        shadow_deep = (1.0 - np.clip((lum_out - 0.02) / 0.12, 0.0, 1.0)) * gate_a * shine_str * 0.08
        add = gate_a * shine_str * (0.045 * silk_band + 0.11 * strand_sheen)
        out_r[active] = np.clip(out_r[active] * (1.0 - shadow_deep) + add + hra * gate_a * shine_str * 0.18, 0.0, 1.0)
        out_g[active] = np.clip(out_g[active] * (1.0 - shadow_deep) + add + hga * gate_a * shine_str * 0.18, 0.0, 1.0)
        out_b[active] = np.clip(out_b[active] * (1.0 - shadow_deep) + add + hba * gate_a * shine_str * 0.18, 0.0, 1.0)

    return np.stack([out_r, out_g, out_b], axis=2)

def main():
    parser = argparse.ArgumentParser(description="Evoto Salon Hair Dye Engine")
    parser.add_argument("--input", "-i", type=str, help="Input image path")
    parser.add_argument("--output", "-o", type=str, help="Output image path")
    parser.add_argument("--mask", "-m", type=str, default=None, help="Neural mask path (PNG)")
    parser.add_argument("--preset", "-p", type=str, default="h05", help="Evoto preset (h01-h13)")
    parser.add_argument("--strength", "-s", type=float, default=65.0, help="Dye strength (0-100)")
    parser.add_argument("--darken", "-d", type=float, default=0.0, help="Darken roots/strands (0-100)")
    parser.add_argument("--shine", type=float, default=0.0, help="Hair shine (0-100)")
    parser.add_argument("--gray", type=float, default=0.0, help="Blacken gray hair (0-100)")
    parser.add_argument("--unify", type=float, default=0.0, help="Unify hair color (0-100)")
    parser.add_argument("--smooth", type=float, default=0.0, help="Hair smooth / frizzy (0-100)")

    # Support positional arguments fallback
    if len(sys.argv) >= 3 and not sys.argv[1].startswith("--"):
        in_path = sys.argv[1]
        out_path = sys.argv[2]
        params = {}
        if len(sys.argv) >= 4:
            try:
                params = json.loads(sys.argv[3])
            except Exception:
                pass
        preset = params.get("preset", "h05")
        strength = float(params.get("strength", 65.0))
        darken = float(params.get("darken", 0.0))
        shine = float(params.get("shine", 0.0))
        gray = float(params.get("gray", 0.0))
        unify = float(params.get("unify", 0.0))
        smooth = float(params.get("smooth", 0.0))
        mask_path = params.get("mask_path", None)
    else:
        args = parser.parse_args()
        in_path = args.input
        out_path = args.output
        mask_path = args.mask
        preset = args.preset
        strength = args.strength
        darken = args.darken
        shine = args.shine
        gray = args.gray
        unify = args.unify
        smooth = args.smooth

    if not in_path or not out_path:
        sys.stderr.write("Error: input and output paths are required.\n")
        sys.exit(1)

    t0 = time.time()
    try:
        img_bgr = cv2.imdecode(np.fromfile(in_path, dtype=np.uint8), cv2.IMREAD_COLOR)
    except Exception:
        img_bgr = None
    if img_bgr is None:
        sys.stderr.write(f"Cannot read image: {in_path}\n")
        sys.exit(1)

    h, w = img_bgr.shape[:2]
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0

    # Load neural mask or segment with MediaPipe
    hair_mask = None
    skin_mask = None

    if mask_path and os.path.exists(mask_path):
        try:
            mask_rgba = cv2.imdecode(np.fromfile(mask_path, dtype=np.uint8), cv2.IMREAD_UNCHANGED)
            if mask_rgba is not None:
                if mask_rgba.shape[0] != h or mask_rgba.shape[1] != w:
                    mask_rgba = cv2.resize(mask_rgba, (w, h), interpolation=cv2.INTER_LINEAR)
                # MediaPipe Vision mask: Channel 0 in BGR is B (Hair), Channel 2 is R (Skin)
                if len(mask_rgba.shape) >= 3 and mask_rgba.shape[2] >= 3:
                    hair_mask = mask_rgba[:, :, 0].astype(np.float32) / 255.0
                    skin_mask = mask_rgba[:, :, 2].astype(np.float32) / 255.0
                elif len(mask_rgba.shape) == 2:
                    hair_mask = mask_rgba.astype(np.float32) / 255.0
                    skin_mask = np.zeros((h, w), dtype=np.float32)
        except Exception as e:
            sys.stderr.write(f"Warning reading mask file: {e}\n")

    if hair_mask is None or skin_mask is None:
        # Segment hair & skin using MediaPipe Selfie Multiclass model
        model_candidates = [
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models", "selfie_multiclass_256x256.tflite"),
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "selfie_multiclass_256x256.tflite"),
            r"models\selfie_multiclass_256x256.tflite"
        ]
        model_path = None
        for cand in model_candidates:
            if os.path.isfile(cand):
                model_path = os.path.abspath(cand)
                break

        if model_path:
            try:
                import mediapipe as mp
                from mediapipe.tasks import python
                from mediapipe.tasks.python import vision

                with open(model_path, "rb") as mf:
                    model_bytes = mf.read()
                base_options = python.BaseOptions(model_asset_buffer=model_bytes)
                options = vision.ImageSegmenterOptions(
                    base_options=base_options,
                    output_category_mask=False,
                    output_confidence_masks=True
                )
                segmenter = vision.ImageSegmenter.create_from_options(options)

                mp_img = mp.Image(
                    image_format=mp.ImageFormat.SRGB,
                    data=cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
                )
                seg_res = segmenter.segment(mp_img)

                # Class 1: Hair, Class 2: Body Skin, Class 3: Face Skin
                raw_hair = seg_res.confidence_masks[1].numpy_view().squeeze()
                raw_skin = (
                    seg_res.confidence_masks[2].numpy_view().squeeze() +
                    seg_res.confidence_masks[3].numpy_view().squeeze()
                )

                hair_mask = cv2.resize(raw_hair, (w, h), interpolation=cv2.INTER_LINEAR)
                skin_mask = cv2.resize(raw_skin, (w, h), interpolation=cv2.INTER_LINEAR)
            except Exception as e:
                sys.stderr.write(f"MediaPipe segmentation warning: {e}\n")

    if hair_mask is None:
        hair_mask = np.zeros((h, w), dtype=np.float32)
        hair_mask[:int(h * 0.5), :] = 0.8
    if skin_mask is None:
        skin_mask = np.zeros((h, w), dtype=np.float32)

    out_rgb = apply_evoto_hair_dye(img_rgb, hair_mask, skin_mask, preset, strength, darken, shine, gray, unify, smooth)

    # Convert back to uint8 BGR
    out_bgr = cv2.cvtColor((out_rgb * 255.0).clip(0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR)

    # Only replace pixels where active change happened to preserve 100% exact lossless source elsewhere
    diff_mask = np.any(np.abs(out_bgr.astype(np.int16) - img_bgr.astype(np.int16)) > 2, axis=2)
    final_bgr = img_bgr.copy()
    final_bgr[diff_mask] = out_bgr[diff_mask]

    out_ext = os.path.splitext(out_path)[1] or ".png"
    ok_enc, enc_buf = cv2.imencode(out_ext, final_bgr)
    if not ok_enc:
        raise IOError(f"cv2.imencode failed for {out_path}")
    enc_buf.tofile(out_path)
    elapsed = int((time.time() - t0) * 1000)
    print(json.dumps({"ok": True, "elapsed_ms": elapsed, "preset": preset, "modified_pixels": int(np.count_nonzero(diff_mask))}))

if __name__ == "__main__":
    main()
