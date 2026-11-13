import sys
import os
import json
import base64
import time
import cv2
import numpy as np
from PIL import Image

# 13 Evoto Salon Hair Dye Specifications:
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

def apply_evoto_hair_dye(img_rgb, hair_mask, skin_mask, preset, strength, darken, shine=0, gray=0, unify=0):
    """
    Vectorized NumPy implementation of apply_evoto_hair_dye from Collabs Retouch Pro.
    img_rgb: float32 (H, W, 3), range [0, 1]
    hair_mask: float32 (H, W), range [0, 1]
    skin_mask: float32 (H, W), range [0, 1]
    """
    key = preset.lower()
    if key not in EVOTO_HAIR_SPECS or strength <= 0.5:
        return img_rgb
        
    (pr, pg, pb), exp_adj, con_adj, sh_lift, chroma_mix = EVOTO_HAIR_SPECS[key]
    
    r = img_rgb[:, :, 0]
    g = img_rgb[:, :, 1]
    b = img_rgb[:, :, 2]
    
    # Compute high-frequency hair strand textures: high = original - fine_blur
    blur_fine = cv2.GaussianBlur(img_rgb, (5, 5), 1.2)
    high_r = r - blur_fine[:, :, 0]
    high_g = g - blur_fine[:, :, 1]
    high_b = b - blur_fine[:, :, 2]
    
    # Skin chroma guard protects face skin, forehead and roots
    hair_skin_guard = compute_skin_weight(r, g, b)
    
    # Hair core gate isolates actual hair from skin and background
    hair_core_gate = np.clip((hair_mask - 0.16) / 0.56, 0.0, 1.0) \
        * np.clip(1.0 - skin_mask * 1.4, 0.0, 1.0) \
        * np.clip(1.0 - hair_skin_guard * 1.35, 0.0, 1.0)
        
    scalp_guard = np.clip(1.0 - hair_skin_guard * 0.9, 0.15, 1.0)
    deg = np.clip(strength / 100.0, 0.0, 1.0)
    dye_a = np.clip(hair_core_gate * scalp_guard * deg * 0.90, 0.0, 0.92)
    
    # Luminance curve
    lum = np.clip(0.299 * r + 0.587 * g + 0.114 * b, 0.0, 1.0)
    lifted_lum = np.clip(lum * (1.0 + exp_adj * 0.55) + sh_lift * 0.16 * (1.0 - lum), 0.02, 0.96)
    dark_scale = 1.0 - np.clip(darken / 100.0, 0.0, 1.0) * 0.38
    target_lum = np.clip((lifted_lum - 0.5) * (1.0 + con_adj * 0.35) + 0.5, 0.02, 0.96) * dark_scale
    
    p_lum = max(0.06, 0.299 * pr + 0.587 * pg + 0.114 * pb)
    gain = np.clip(target_lum / p_lum, 0.22, 1.85)
    
    # Add strand high-frequency texture back in (preserves individual hair strands!)
    dr = np.clip(pr * gain + high_r * 0.65, 0.0, 1.0)
    dg = np.clip(pg * gain + high_g * 0.65, 0.0, 1.0)
    db = np.clip(pb * gain + high_b * 0.65, 0.0, 1.0)
    
    mix_w = dye_a * chroma_mix
    
    out_r = np.clip(r * (1.0 - mix_w) + dr * mix_w, 0.0, 1.0)
    out_g = np.clip(g * (1.0 - mix_w) + dg * mix_w, 0.0, 1.0)
    out_b = np.clip(b * (1.0 - mix_w) + db * mix_w, 0.0, 1.0)
    
    # Hair shine (tăng độ bóng)
    if shine > 0.5:
        shine_str = np.clip(shine / 100.0, 0.0, 1.0)
        lum_out = 0.299 * out_r + 0.587 * out_g + 0.114 * out_b
        lum_blur = 0.299 * blur_fine[:, :, 0] + 0.587 * blur_fine[:, :, 1] + 0.114 * blur_fine[:, :, 2]
        strand_sheen = np.clip((lum_out - lum_blur) * 4.5, 0.0, 1.0)
        silk_band = np.clip((lum_out - 0.03) / 0.19, 0.0, 1.0) * np.clip(1.0 - (lum_out - 0.55) / 0.31, 0.0, 1.0)
        shadow_deep = (1.0 - np.clip((lum_out - 0.02) / 0.12, 0.0, 1.0)) * hair_core_gate * shine_str * 0.08
        add = hair_core_gate * shine_str * (0.045 * silk_band + 0.11 * strand_sheen)
        out_r = np.clip(out_r * (1.0 - shadow_deep) + add + high_r * hair_core_gate * shine_str * 0.18, 0.0, 1.0)
        out_g = np.clip(out_g * (1.0 - shadow_deep) + add + high_g * hair_core_gate * shine_str * 0.18, 0.0, 1.0)
        out_b = np.clip(out_b * (1.0 - shadow_deep) + add + high_b * hair_core_gate * shine_str * 0.18, 0.0, 1.0)
        
    return np.stack([out_r, out_g, out_b], axis=2)

def main():
    if len(sys.argv) < 3:
        print("Usage: evoto_hair_process.py <input.jpg> <output.png> [params_json]")
        sys.exit(1)
        
    in_path = sys.argv[1]
    out_path = sys.argv[2]
    params = {}
    if len(sys.argv) >= 4:
        try:
            params = json.loads(sys.argv[3])
        except Exception:
            pass
            
    t0 = time.time()
    img_bgr = cv2.imread(in_path)
    if img_bgr is None:
        sys.stderr.write(f"Cannot read {in_path}\n")
        sys.exit(1)
        
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    h, w = img_rgb.shape[:2]
    
    # Load or generate hair mask
    mask_path = params.get("mask_path")
    if mask_path and os.path.exists(mask_path):
        mask_rgba = cv2.imread(mask_path, cv2.IMREAD_UNCHANGED)
        if mask_rgba.shape[0] != h or mask_rgba.shape[1] != w:
            mask_rgba = cv2.resize(mask_rgba, (w, h), interpolation=cv2.INTER_LINEAR)
        # R = skin, B = hair
        skin_mask = mask_rgba[:, :, 2].astype(np.float32) / 255.0 if mask_rgba.shape[2] >= 3 else np.zeros((h, w), dtype=np.float32)
        hair_mask = mask_rgba[:, :, 0].astype(np.float32) / 255.0 if mask_rgba.shape[2] >= 3 else np.ones((h, w), dtype=np.float32)
    else:
        # Default placeholder if no mask passed: upper third center
        hair_mask = np.ones((h, w), dtype=np.float32)
        skin_mask = np.zeros((h, w), dtype=np.float32)
        
    preset = params.get("preset", "h05")
    strength = float(params.get("strength", 65))
    darken = float(params.get("darken", 0))
    shine = float(params.get("shine", 0))
    gray = float(params.get("gray", 0))
    unify = float(params.get("unify", 0))
    
    out_rgb = apply_evoto_hair_dye(img_rgb, hair_mask, skin_mask, preset, strength, darken, shine, gray, unify)
    out_bgr = cv2.cvtColor((out_rgb * 255.0).clip(0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR)
    cv2.imwrite(out_path, out_bgr)
    print(json.dumps({"ok": True, "elapsed_ms": int((time.time() - t0) * 1000)}))

if __name__ == "__main__":
    main()

