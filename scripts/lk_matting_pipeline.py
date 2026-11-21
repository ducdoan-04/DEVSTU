#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DEVSTU PRO AI Portrait Matting & Background Replacement Pipeline
Ported for DEVSTU (DEVSTU-clone)
Powered by:
  - model_29.onnx (104.5 MB U-Net / HRNet Portrait Alpha Matting)
  - model_73.onnx (11.6 MB Hair Matting / Instance Segmentation)
  - model_82.onnx, model_83.onnx, model_84.onnx (Sky Segmentation & Relighting)
  - bg.json (30 ID photo and background change presets)
  - OpenCV Guided Filter & Domain Transform edge refinement
  - Color Decontamination (De-spill) & BGFusion
"""

import os
import sys
import time
import json
import base64
import argparse
from io import BytesIO
from typing import Optional, Tuple, Dict, Any, Union

import numpy as np
import cv2
from PIL import Image, ImageOps

# -------------------------------------------------------------------------
# Path resolution
# -------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
MODELS_DIR = os.path.join(PROJECT_DIR, "models")
LK_MODELS_DIR = os.path.join(MODELS_DIR, "lk_models")
ASSETS_DIR = os.path.join(PROJECT_DIR, "assets")

BG_CONFIG_PATH = os.path.join(ASSETS_DIR, "bg.json")
if not os.path.isfile(BG_CONFIG_PATH):
    BG_CONFIG_PATH = os.path.join(LK_MODELS_DIR, "bg.json")

SKY_CONFIG_PATH = os.path.join(ASSETS_DIR, "sky.json")
if not os.path.isfile(SKY_CONFIG_PATH):
    SKY_CONFIG_PATH = os.path.join(LK_MODELS_DIR, "sky.json")

# -------------------------------------------------------------------------
# Global Inference Sessions Cache
# -------------------------------------------------------------------------
_session_cache: Dict[str, Any] = {}

def get_ort_session(model_path: str, use_dml: bool = True):
    if model_path in _session_cache:
        return _session_cache[model_path]
    
    if not os.path.isfile(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
        
    import onnxruntime as ort
    opts = ort.SessionOptions()
    opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    opts.intra_op_num_threads = min(8, max(2, os.cpu_count() or 4))
    
    available = ort.get_available_providers()
    providers = []
    if use_dml and "DmlExecutionProvider" in available:
        providers.append("DmlExecutionProvider")
    if "CUDAExecutionProvider" in available:
        providers.append("CUDAExecutionProvider")
    providers.append("CPUExecutionProvider")
    
    try:
        sess = ort.InferenceSession(model_path, sess_options=opts, providers=providers)
    except Exception:
        sess = ort.InferenceSession(model_path, sess_options=opts, providers=["CPUExecutionProvider"])
    _session_cache[model_path] = sess
    return sess

def get_model_path(filename: str) -> str:
    candidates = [
        os.path.join(LK_MODELS_DIR, filename),
        os.path.join(MODELS_DIR, filename),
    ]
    for c in candidates:
        if os.path.isfile(c):
            return c
    raise FileNotFoundError(f"Could not locate model file {filename} in {candidates}")

# -------------------------------------------------------------------------
# Load Presets from bg.json and sky.json
# -------------------------------------------------------------------------
def load_bg_presets() -> Dict[str, Dict[str, Any]]:
    presets = {
        "transparent": {"name": "Trong suốt", "ename": "touming", "rgba": [0, 0, 0, 0]},
        "touming": {"name": "Trong suốt", "ename": "touming", "rgba": [0, 0, 0, 0]},
        "dengjihong": {"name": "Đỏ đăng ký", "ename": "dengjihong", "rgba": [215, 69, 50, 255]},
        "sifalan": {"name": "Xanh tư pháp", "ename": "sifalan", "rgba": [36, 88, 166, 255]},
        "baise": {"name": "Trắng", "ename": "baise", "rgba": [255, 255, 255, 255]},
        "white": {"name": "Trắng", "ename": "white", "rgba": [255, 255, 255, 255]},
        "zhenghong": {"name": "Đỏ chuẩn", "ename": "zhenghong", "rgba": [224, 29, 29, 255]},
        "red": {"name": "Đỏ chuẩn", "ename": "red", "rgba": [224, 29, 29, 255]},
        "jingdianlan": {"name": "Xanh cổ điển", "ename": "jingdianlan", "rgba": [28, 78, 128, 255]},
        "blue": {"name": "Xanh cổ điển", "ename": "blue", "rgba": [28, 78, 128, 255]},
        "shiliuhong": {"name": "Đỏ lựu", "ename": "shiliuhong", "rgba": [184, 38, 48, 255]},
        "jingdianhong": {"name": "Đỏ cổ điển", "ename": "jingdianhong", "rgba": [198, 40, 40, 255]},
        "doushahong": {"name": "Đỏ đậu đỏ", "ename": "doushahong", "rgba": [158, 64, 74, 255]},
        "jianbianlan": {"name": "Xanh chuyển sắc", "ename": "jianbianlan", "gradient": [(180, 210, 255), (36, 88, 166)]},
        "qianlanse": {"name": "Xanh nhạt", "ename": "qianlanse", "rgba": [180, 208, 238, 255]},
        "light_blue": {"name": "Xanh nhạt", "ename": "light_blue", "rgba": [180, 208, 238, 255]},
        "biyelan": {"name": "Xanh tốt nghiệp", "ename": "biyelan", "rgba": [46, 102, 178, 255]},
        "shenlan": {"name": "Xanh đậm", "ename": "shenlan", "rgba": [16, 52, 115, 255]},
        "dark_blue": {"name": "Xanh đậm", "ename": "dark_blue", "rgba": [16, 52, 115, 255]},
        "lanbaijianbian": {"name": "Xanh trắng chuyển sắc", "ename": "lanbaijianbian", "gradient": [(230, 242, 255), (66, 128, 204)]},
        "haimalan": {"name": "Xanh Hima", "ename": "haimalan", "rgba": [68, 138, 255, 255]},
        "qianhuise": {"name": "Xám nhạt", "ename": "qianhuise", "rgba": [215, 218, 222, 255]},
        "jianhui": {"name": "Xám thanh lịch", "ename": "jianhui", "rgba": [170, 175, 185, 255]},
        "gray": {"name": "Xám", "ename": "gray", "rgba": [160, 160, 160, 255]},
        "guolv": {"name": "Xanh quả non", "ename": "guolv", "rgba": [140, 200, 130, 255]},
        "ehuangse": {"name": "Vàng lông ngỗng", "ename": "ehuangse", "rgba": [255, 240, 160, 255]},
        "fenlanse": {"name": "Xanh phấn", "ename": "fenlanse", "rgba": [188, 214, 234, 255]},
        "fense": {"name": "Hồng", "ename": "fense", "rgba": [245, 180, 195, 255]},
        "pink": {"name": "Hồng", "ename": "pink", "rgba": [245, 180, 195, 255]},
        "ganlanlv": {"name": "Xanh ô liu", "ename": "ganlanlv", "rgba": [112, 130, 90, 255]},
        "miguacheng": {"name": "Cam dưa lưới", "ename": "miguacheng", "rgba": [250, 165, 120, 255]},
        "naicha": {"name": "Trà sữa", "ename": "naicha", "rgba": [225, 205, 185, 255]},
        "beige": {"name": "Kem be", "ename": "beige", "rgba": [242, 234, 218, 255]},
        "wuyehei": {"name": "Đen nửa đêm", "ename": "wuyehei", "rgba": [20, 22, 28, 255]},
        "black": {"name": "Đen", "ename": "black", "rgba": [18, 18, 18, 255]},
        "xiangbinse": {"name": "Sâm panh", "ename": "xiangbinse", "rgba": [235, 215, 190, 255]},
    }
    
    if os.path.isfile(BG_CONFIG_PATH):
        try:
            with open(BG_CONFIG_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                items = data.get("param", [])
                for it in items:
                    ename = it.get("ename")
                    name = it.get("name")
                    if ename and ename not in presets:
                        presets[ename] = {"name": name, "ename": ename, "icon": it.get("icon")}
        except Exception as e:
            sys.stderr.write(f"Notice: Failed to load extra bg.json presets: {e}\n")
            
    return presets

# -------------------------------------------------------------------------
# Guided Filter Edge Refinement (OpenCV guided_filter.cpp equivalent)
# -------------------------------------------------------------------------
def apply_guided_filter(guide_rgb: np.ndarray, coarse_matte: np.ndarray, radius: int = 3, eps: float = 1e-5) -> np.ndarray:
    """Refines rough alpha matte against the original RGB guide image using guided filter."""
    if hasattr(cv2, "ximgproc") and hasattr(cv2.ximgproc, "guidedFilter"):
        guide_f = guide_rgb.astype(np.float32) / 255.0
        src_f = coarse_matte.astype(np.float32) / 255.0
        out_f = cv2.ximgproc.guidedFilter(guide=guide_f, src=src_f, radius=radius, eps=eps)
        return (np.clip(out_f, 0.0, 1.0) * 255.0).astype(np.uint8)
    
    # Fallback OpenCV box filter implementation
    p = coarse_matte.astype(np.float32) / 255.0
    I = cv2.cvtColor(guide_rgb, cv2.COLOR_RGB2GRAY).astype(np.float32) / 255.0
    
    mean_I = cv2.boxFilter(I, -1, (radius, radius))
    mean_p = cv2.boxFilter(p, -1, (radius, radius))
    mean_Ip = cv2.boxFilter(I * p, -1, (radius, radius))
    cov_Ip = mean_Ip - mean_I * mean_p
    
    mean_II = cv2.boxFilter(I * I, -1, (radius, radius))
    var_I = np.maximum(0.0, mean_II - mean_I * mean_I)
    
    a = cov_Ip / (var_I + eps)
    b = mean_p - a * mean_I
    
    mean_a = cv2.boxFilter(a, -1, (radius, radius))
    mean_b = cv2.boxFilter(b, -1, (radius, radius))
    
    q = mean_a * I + mean_b
    refined = (np.clip(q, 0.0, 1.0) * 255.0).astype(np.uint8)
    return refined

# -------------------------------------------------------------------------
# Color Decontamination (De-spill Filter)
# -------------------------------------------------------------------------
def decontaminate_edges(rgb_img: np.ndarray, alpha_matte: np.ndarray, threshold: float = 0.5) -> np.ndarray:
    """
    Eliminates color halos / fringes from the old background on hair and clothing edges.
    Calculates pure foreground color by local dilation & color reconstruction on semi-transparent pixels.
    """
    alpha = alpha_matte.astype(np.float32) / 255.0
    semi = (alpha > 0.03) & (alpha < 0.95)
    
    if not np.any(semi):
        return rgb_img
        
    # High-confidence foreground
    solid_fg = (alpha >= 0.90).astype(np.uint8)
    if np.sum(solid_fg) == 0:
        return rgb_img
        
    # Dilate solid foreground color into fringe zone
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    dilated_fg_mask = cv2.dilate(solid_fg, kernel, iterations=2)
    fringe_zone = (dilated_fg_mask > 0) & semi
    
    clean_rgb = rgb_img.copy()
    
    # Inpaint fringe zone with solid foreground colors
    try:
        inpaint_mask = (semi & (alpha < 0.85)).astype(np.uint8) * 255
        if np.any(inpaint_mask):
            inpainted = cv2.inpaint(rgb_img, inpaint_mask, inpaintRadius=3, flags=cv2.INPAINT_TELEA)
            # Blend smoothly based on alpha
            blend_w = np.clip((0.85 - alpha) / 0.85, 0.0, 1.0)[:, :, None]
            clean_rgb = np.where(fringe_zone[:, :, None], (1.0 - blend_w) * rgb_img + blend_w * inpainted, rgb_img)
            clean_rgb = clean_rgb.astype(np.uint8)
    except Exception:
        pass
        
    return clean_rgb

# -------------------------------------------------------------------------
# LK Human & Portrait Matting Pipeline (model_29 + model_73)
# -------------------------------------------------------------------------
class LKPortraitMattingEngine:
    def __init__(self):
        self.m29_path = None
        try: self.m29_path = get_model_path("model_29.onnx")
        except Exception: pass
        self.m73_path = None
        try: self.m73_path = get_model_path("model_73.onnx")
        except Exception: pass
        self.rmbg_path = None
        for cand in [
            os.path.join(MODELS_DIR, "RMBG-1.4-model.onnx"),
            os.path.join(PROJECT_DIR, "src-tauri", "models", "RMBG-1.4-model.onnx"),
        ]:
            if os.path.isfile(cand):
                self.rmbg_path = cand
                break
        
        self.sess_m29 = None
        self.sess_m73 = None
        self.sess_rmbg = None
        
    def _warmup(self, load_m29: bool = False):
        if self.sess_rmbg is None and self.rmbg_path and os.path.isfile(self.rmbg_path):
            try: self.sess_rmbg = get_ort_session(self.rmbg_path)
            except Exception as e: sys.stderr.write(f"RMBG warmup warning: {e}\n")
        if self.sess_m73 is None and self.m73_path and os.path.isfile(self.m73_path):
            try: self.sess_m73 = get_ort_session(self.m73_path)
            except Exception: pass
        if load_m29 and self.sess_m29 is None and self.m29_path and os.path.isfile(self.m29_path):
            try: self.sess_m29 = get_ort_session(self.m29_path)
            except Exception as e: sys.stderr.write(f"m29 warmup warning: {e}\n")

    def extract_full_rmbg_matte(self, img_pil: Image.Image) -> Image.Image:
        """Runs high-res 1024x1024 letterboxed RMBG-1.4 and returns full-resolution L-mode Image."""
        w, h = img_pil.size
        if self.sess_rmbg is None:
            raise RuntimeError("RMBG-1.4-model.onnx session is not available")
        scale = 1024.0 / max(w, h)
        tw, th = max(1, int(round(w * scale))), max(1, int(round(h * scale)))
        im_scaled = img_pil.resize((tw, th), Image.BILINEAR)
        im_pad = Image.new("RGB", (1024, 1024), (128, 128, 128))
        px, py = (1024 - tw) // 2, (1024 - th) // 2
        im_pad.paste(im_scaled, (px, py))
        
        np_pad = (np.array(im_pad, dtype=np.float32) / 255.0 - 0.5).transpose(2, 0, 1)[None, ...]
        inp_name = self.sess_rmbg.get_inputs()[0].name
        out = self.sess_rmbg.run(None, {inp_name: np_pad})[0]
        
        coarse = np.squeeze(out)
        ma, mi = float(coarse.max()), float(coarse.min())
        if ma > mi: coarse = (coarse - mi) / (ma - mi)
        else: coarse = np.zeros_like(coarse)
        
        coarse_uint8 = (coarse * 255.0).clip(0, 255).astype(np.uint8)
        coarse_cropped = Image.fromarray(coarse_uint8, mode="L").crop((px, py, px + tw, py + th))
        return coarse_cropped.resize((w, h), Image.BILINEAR)

    def extract_hair_mask(self, img_pil: Image.Image, target_size: Tuple[int, int]) -> Optional[np.ndarray]:
        if self.sess_m73 is not None:
            try:
                im_256 = img_pil.resize((256, 256), Image.BILINEAR)
                np_256 = (np.array(im_256, dtype=np.float32) / 255.0).transpose(2, 0, 1)[None, ...]
                inp_name = self.sess_m73.get_inputs()[0].name
                out73 = self.sess_m73.run(None, {inp_name: np_256})[0]
                hair_prob = out73[0, :, :, 1]
                hair_pil = Image.fromarray((hair_prob * 255).clip(0, 255).astype(np.uint8), mode="L").resize(target_size, Image.BILINEAR)
                return np.array(hair_pil, dtype=np.float32) / 255.0
            except Exception as e:
                sys.stderr.write(f"Hair m73 prior warning: {e}\n")
        return None

    def predict_alpha_matte(self, img_pil: Image.Image) -> Image.Image:
        self._warmup(load_m29=False)
        w, h = img_pil.size
        if w <= 0 or h <= 0:
            return Image.new("L", (max(1, w), max(1, h)), 0)
        
        # 1. Full-resolution 1024x1024 letterboxed portrait alpha matte
        matte_pil = self.extract_full_rmbg_matte(img_pil)
        matte_np = np.array(matte_pil, dtype=np.float32)
        
        # 2. Optional model_73 fine hair strand boost along existing subject boundary
        hair_fg = self.extract_hair_mask(img_pil, (w, h))
        if hair_fg is not None:
            m_norm = matte_np / 255.0
            # Only enhance hair probabilities near/within the portrait hair region
            hair_zone = (m_norm > 0.05) & (m_norm < 0.85) & (hair_fg > 0.35)
            boosted = np.maximum(m_norm, np.clip(hair_fg * 0.90, 0.0, 1.0))
            matte_np = np.where(hair_zone, boosted * 255.0, matte_np)
        
        # 3. High-Resolution Guided Filter Refinement (normalised [0..1] float32 inside)
        guide_np = np.array(img_pil)
        refined_matte = apply_guided_filter(guide_rgb=guide_np, coarse_matte=matte_np.clip(0, 255).astype(np.uint8), radius=3, eps=1e-5)
        
        # Light bilateral edge smoothing to eliminate micro stair-stepping while keeping strands crisp
        refined_matte = cv2.bilateralFilter(refined_matte, d=3, sigmaColor=18, sigmaSpace=2)
        
        return Image.fromarray(refined_matte, mode="L")

# -------------------------------------------------------------------------
# LK Background Fusion Engine (BGFusionCalculator equivalent)
# -------------------------------------------------------------------------
class LKBGFusionEngine:
    def __init__(self):
        self.presets = load_bg_presets()
        
    def parse_background(self, bg_spec: Union[str, list, tuple], w: int, h: int) -> Tuple[np.ndarray, bool]:
        """
        Parses background preset, hex color, RGB, or gradient.
        Returns: (bg_image_rgb [H, W, 3], is_transparent bool)
        """
        if isinstance(bg_spec, str):
            key = bg_spec.strip().lower()
            if key in ("transparent", "touming"):
                return np.zeros((h, w, 3), dtype=np.uint8), True
                
            if key in self.presets:
                p = self.presets[key]
                if p.get("gradient"):
                    top_c, bot_c = p["gradient"]
                    bg = np.zeros((h, w, 3), dtype=np.float32)
                    top_arr = np.array(top_c, dtype=np.float32)
                    bot_arr = np.array(bot_c, dtype=np.float32)
                    for y in range(h):
                        f = y / float(max(1, h - 1))
                        bg[y, :] = (1.0 - f) * top_arr + f * bot_arr
                    return np.clip(bg, 0, 255).astype(np.uint8), False
                elif "rgba" in p:
                    rgba = p["rgba"]
                    if rgba[3] == 0:
                        return np.zeros((h, w, 3), dtype=np.uint8), True
                    bg = np.zeros((h, w, 3), dtype=np.uint8)
                    bg[:, :] = rgba[:3]
                    return bg, False
                    
            if bg_spec.startswith("#"):
                hex_c = bg_spec.lstrip("#")
                if len(hex_c) == 6:
                    r = int(hex_c[0:2], 16)
                    g = int(hex_c[2:4], 16)
                    b = int(hex_c[4:6], 16)
                    bg = np.zeros((h, w, 3), dtype=np.uint8)
                    bg[:, :] = [r, g, b]
                    return bg, False
                elif len(hex_c) == 8:
                    r = int(hex_c[0:2], 16)
                    g = int(hex_c[2:4], 16)
                    b = int(hex_c[4:6], 16)
                    a = int(hex_c[6:8], 16)
                    if a == 0:
                        return np.zeros((h, w, 3), dtype=np.uint8), True
                    bg = np.zeros((h, w, 3), dtype=np.uint8)
                    bg[:, :] = [r, g, b]
                    return bg, False
                    
            if "," in bg_spec:
                parts = [int(p.strip()) for p in bg_spec.split(",") if p.strip()]
                if len(parts) >= 4 and parts[3] == 0:
                    return np.zeros((h, w, 3), dtype=np.uint8), True
                if len(parts) >= 3:
                    bg = np.zeros((h, w, 3), dtype=np.uint8)
                    bg[:, :] = parts[:3]
                    return bg, False
                    
        elif isinstance(bg_spec, (list, tuple)):
            if len(bg_spec) >= 4 and bg_spec[3] == 0:
                return np.zeros((h, w, 3), dtype=np.uint8), True
            if len(bg_spec) >= 3:
                bg = np.zeros((h, w, 3), dtype=np.uint8)
                bg[:, :] = [int(c) for c in bg_spec[:3]]
                return bg, False
                
        # Default pure white
        bg = np.ones((h, w, 3), dtype=np.uint8) * 255
        return bg, False

    def composite(self, img_pil: Image.Image, matte_pil: Image.Image, bg_spec: Any) -> Image.Image:
        w, h = img_pil.size
        orig_np = np.array(img_pil, dtype=np.uint8)
        matte_np = np.array(matte_pil, dtype=np.uint8)
        
        # 1. Clean old background spill from edges
        clean_fg = decontaminate_edges(orig_np, matte_np)
        
        # 2. Parse target background
        bg_rgb, is_transparent = self.parse_background(bg_spec, w, h)
        
        if is_transparent:
            # RGBA Cutout
            rgba = np.dstack([clean_fg, matte_np])
            return Image.fromarray(rgba, mode="RGBA")
            
        # 3. Alpha Blending
        alpha = (matte_np.astype(np.float32) / 255.0)[:, :, None]
        fg_float = clean_fg.astype(np.float32)
        bg_float = bg_rgb.astype(np.float32)
        
        # Light harmonizer: subtle boundary edge lighting blend
        comp = fg_float * alpha + bg_float * (1.0 - alpha)
        comp = np.clip(comp, 0, 255).astype(np.uint8)
        
        return Image.fromarray(comp)

# -------------------------------------------------------------------------
# LK Sky Segmentation Engine (model_82, model_83, model_84, sky.json)
# -------------------------------------------------------------------------
class LKSkyReplacementEngine:
    def __init__(self):
        self.m82_path = get_model_path("model_82.onnx")
        self.sess_m82 = None

    def segment_sky(self, img_pil: Image.Image) -> Image.Image:
        if self.sess_m82 is None:
            self.sess_m82 = get_ort_session(self.m82_path)
            
        w, h = img_pil.size
        im_384 = img_pil.resize((384, 384), Image.BILINEAR)
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        
        inp = ((np.array(im_384, dtype=np.float32) / 255.0 - mean) / std).transpose(2, 0, 1)[None, ...]
        out = self.sess_m82.run(None, {"input": inp})[0]
        
        sky_mask = out[0, 0, :, :]
        sky_mask = (sky_mask - sky_mask.min()) / max(1e-6, sky_mask.max() - sky_mask.min())
        sky_uint8 = (sky_mask * 255.0).clip(0, 255).astype(np.uint8)
        
        sky_pil = Image.fromarray(sky_uint8, mode="L").resize((w, h), Image.BILINEAR)
        return sky_pil

# -------------------------------------------------------------------------
# LK Magic Pro Ultra Max Engine (Neural 3D LUTs 90/91/97/101 + Skin 98/100 + Sky 82/83/84)
# -------------------------------------------------------------------------
class LKUltraMaxEngine:
    """
    Full LK Magic Pro AI Engine for STU Ultra Max:
      - model_97.onnx: Multi-Style AI Color Simulation (33x33x33 3D LUT, style_id 0..5)
      - model_90.onnx / model_91.onnx / model_101.onnx: Neural 3D LUTs (17x17x17 3D LUT)
      - model_98.onnx: Deep Guided Filter Skin & Blemish Network (256x256 -> A, b, mask_4)
      - model_100.onnx: 10-Class Human Parsing (640x640 -> face/skin/hair/clothes classes)
      - model_82/83/84.onnx: Sky Segmentation & Atmospheric Relighting with real sky textures
    """
    STYLE_MAP = {
        "xitangpai": ("model_97.onnx", 0.0),
        "fuguangxinbu": ("model_97.onnx", 1.0),
        "chunbaishiyan": ("model_97.onnx", 2.0),
        "jinxiuliangyuan": ("model_97.onnx", 3.0),
        "lvyinzhiyue": ("model_97.onnx", 4.0),
        "lvyemanbu": ("model_97.onnx", 5.0),
        "neural_90": ("model_90.onnx", None),
        "neural_91": ("model_91.onnx", None),
        "neural_101": ("model_101.onnx", None),
    }

    # Skin beauty tone presets from LK Magic Pro skin_beauty_config.json
    # Each tuple: (dL_lift, dR_gain, dG_gain, dB_gain, sat_scale)
    SKIN_TONE_MAP = {
        "lengbai":  (0.085, 1.04, 1.06, 1.11, 0.88),  # 冷白 Trắng lạnh
        "naibai":   (0.075, 1.06, 1.06, 1.05, 0.90),  # 奶白 Trắng sữa
        "fenbai":   (0.070, 1.09, 1.03, 1.06, 0.94),  # 粉白 Trắng hồng
        "nuanbai":  (0.065, 1.08, 1.05, 1.01, 0.95),  # 暖白 Trắng ấm
        "jiaotang": (-0.045, 1.06, 0.96, 0.86, 1.08), # 焦糖 Caramel
        "maihei":   (-0.075, 1.02, 0.93, 0.84, 1.05), # 麦黑 Bánh mật
        "hongrun":  (0.035, 1.10, 1.01, 1.02, 1.04),  # 红润 Hồng hào
        "pianleng": (0.040, 1.01, 1.04, 1.09, 0.92),  # 偏冷 Tông lạnh
        "piannuan": (0.040, 1.08, 1.04, 0.98, 0.98),  # 偏暖 Tông ấm
    }

    def __init__(self):
        self.sessions: Dict[str, Any] = {}
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.sky_tex_dir = os.path.join(root_dir, "assets", "lk_magic", "sky")

    def _get_sess(self, fname: str):
        if fname not in self.sessions:
            p = os.path.join(MODELS_DIR, "lk_models", fname)
            if not os.path.isfile(p):
                p = os.path.join(MODELS_DIR, fname)
            if os.path.isfile(p):
                self.sessions[fname] = get_ort_session(p)
            else:
                self.sessions[fname] = None
        return self.sessions[fname]

    @staticmethod
    def apply_3d_lut(img_rgb: np.ndarray, lut_3d: np.ndarray, strength: float) -> np.ndarray:
        """
        Fast vectorized trilinear interpolation of a (D, D, D, 3) 3D LUT on (H, W, 3) float32 [0..1] image.
        """
        if strength <= 0.001:
            return img_rgb
        d = lut_3d.shape[0]
        scaled = np.clip(img_rgb, 0.0, 1.0) * (d - 1)
        r0 = np.floor(scaled[..., 0]).astype(np.int32)
        g0 = np.floor(scaled[..., 1]).astype(np.int32)
        b0 = np.floor(scaled[..., 2]).astype(np.int32)
        r1 = np.minimum(r0 + 1, d - 1)
        g1 = np.minimum(g0 + 1, d - 1)
        b1 = np.minimum(b0 + 1, d - 1)

        dr = (scaled[..., 0] - r0)[..., None]
        dg = (scaled[..., 1] - g0)[..., None]
        db = (scaled[..., 2] - b0)[..., None]

        c000 = lut_3d[r0, g0, b0]
        c001 = lut_3d[r0, g0, b1]
        c010 = lut_3d[r0, g1, b0]
        c011 = lut_3d[r0, g1, b1]
        c100 = lut_3d[r1, g0, b0]
        c101 = lut_3d[r1, g0, b1]
        c110 = lut_3d[r1, g1, b0]
        c111 = lut_3d[r1, g1, b1]

        c00 = c000 * (1.0 - db) + c001 * db
        c01 = c010 * (1.0 - db) + c011 * db
        c10 = c100 * (1.0 - db) + c101 * db
        c11 = c110 * (1.0 - db) + c111 * db

        c0 = c00 * (1.0 - dg) + c01 * dg
        c1 = c10 * (1.0 - dg) + c11 * dg

        mapped = np.clip(c0 * (1.0 - dr) + c1 * dr, 0.0, 1.0)
        s = float(np.clip(strength, 0.0, 1.0))
        return np.clip(img_rgb * (1.0 - s) + mapped * s, 0.0, 1.0)

    def apply_neural_color(self, img_pil: Image.Image, img_rgb: np.ndarray, style_key: str, strength_pct: float, active_models: list) -> np.ndarray:
        if not style_key or style_key == "none" or strength_pct <= 0:
            return img_rgb
        spec = self.STYLE_MAP.get(style_key)
        if not spec:
            return img_rgb
        model_fname, style_id = spec
        sess = self._get_sess(model_fname)
        if sess is None:
            return img_rgb

        # Neural 3D LUT models require 512x512 input (16x16 attention grid)
        img_512 = img_pil.resize((512, 512), Image.BILINEAR)
        arr_512 = np.asarray(img_512, dtype=np.float32) / 255.0
        inp_tensor = np.transpose(arr_512, (2, 0, 1))[None, ...]

        feed = {"image": inp_tensor}
        if style_id is not None:
            feed["style_id"] = np.full((1, 1, 1, 1), float(style_id), dtype=np.float32)

        outs = sess.run(None, feed)
        lut_3d = outs[0][0]  # shape (17,17,17,3) or (33,33,33,3)
        active_models.append(model_fname.replace(".onnx", ""))
        return self.apply_3d_lut(img_rgb, lut_3d, strength_pct / 100.0)

    def apply_deep_skin_and_tone(
        self,
        img_pil: Image.Image,
        img_rgb: np.ndarray,
        deep_smooth_pct: float,
        tone_preset: str,
        tone_strength_pct: float,
        active_models: list,
    ) -> np.ndarray:
        need_smooth = deep_smooth_pct > 0
        need_tone = bool(tone_preset and tone_preset != "none" and tone_strength_pct > 0 and tone_preset in self.SKIN_TONE_MAP)
        if not need_smooth and not need_tone:
            return img_rgb

        h, w = img_rgb.shape[:2]
        sess_98 = self._get_sess("model_98.onnx")
        skin_mask = None
        guided_smooth = None

        if sess_98 is not None:
            img_256 = img_pil.resize((256, 256), Image.BILINEAR)
            arr_256 = np.asarray(img_256, dtype=np.float32) / 255.0
            inp_256 = np.transpose(arr_256, (2, 0, 1))[None, ...]
            # Outputs: A [1,3,256,256], b [1,3,256,256], mask_4 [1,1,256,256]
            A_out, b_out, mask_out = sess_98.run(None, {"input": inp_256})
            active_models.append("model_98")

            # Upsample mask_4 to (H, W)
            m256 = np.clip(mask_out[0, 0], 0.0, 1.0)
            m_pil = Image.fromarray((m256 * 255.0).astype(np.uint8), mode="L").resize((w, h), Image.BILINEAR)
            m_full = np.asarray(m_pil, dtype=np.float32) / 255.0

            # Combine with warm skin-chroma gate so clothes/background stay untouched
            r, g, b = img_rgb[..., 0], img_rgb[..., 1], img_rgb[..., 2]
            chroma_skin = np.clip((r - b) * 2.2, 0.0, 1.0) * np.clip((r - g * 0.85) * 2.5, 0.0, 1.0)
            skin_mask = np.clip(m_full * (0.35 + 0.65 * chroma_skin), 0.0, 1.0)[..., None]

            if need_smooth:
                # Upsample A and b coefficients from 256x256 to (H, W)
                A_hwc = np.transpose(A_out[0], (1, 2, 0))
                b_hwc = np.transpose(b_out[0], (1, 2, 0))
                # Normalize A_hwc + b_hwc on 256 grid first, then upsample the residual delta
                pred_256 = A_hwc * arr_256 + b_hwc
                # Normalize pred_256 to match local mean/std of arr_256 for safe lighting
                p_min, p_max = np.percentile(pred_256, 1), np.percentile(pred_256, 99)
                pred_norm_256 = np.clip((pred_256 - p_min) / max(p_max - p_min, 1e-4), 0.0, 1.0)
                # Also compute edge-preserving bilateral/guided smooth at full res
                low_pil = img_pil.resize((max(w // 6, 32), max(h // 6, 32)), Image.BILINEAR).resize((w, h), Image.BILINEAR)
                low_rgb = np.asarray(low_pil, dtype=np.float32) / 255.0
                fine_pil = img_pil.resize((max(w // 2, 64), max(h // 2, 64)), Image.BILINEAR).resize((w, h), Image.BILINEAR)
                fine_rgb = np.asarray(fine_pil, dtype=np.float32) / 255.0
                high_freq_pores = img_rgb - fine_rgb
                pred_pil = Image.fromarray((pred_norm_256 * 255.0).astype(np.uint8)).resize((w, h), Image.BILINEAR)
                pred_full = np.asarray(pred_pil, dtype=np.float32) / 255.0
                # Blend low_rgb + subtle model_98 detail + preserved fine pores
                guided_smooth = np.clip(low_rgb * 0.82 + pred_full * 0.18 + high_freq_pores * 0.65, 0.0, 1.0)

        if skin_mask is None:
            r, g, b = img_rgb[..., 0], img_rgb[..., 1], img_rgb[..., 2]
            skin_mask = (np.clip((r - b) * 2.2, 0.0, 1.0) * np.clip((r - g * 0.85) * 2.5, 0.0, 1.0))[..., None]

        out = img_rgb
        if need_smooth and guided_smooth is not None:
            s_smooth = float(np.clip(deep_smooth_pct / 100.0, 0.0, 1.0)) * 0.78
            w_mask = skin_mask * s_smooth
            out = np.clip(out * (1.0 - w_mask) + guided_smooth * w_mask, 0.0, 1.0)

        if need_tone:
            dL, r_gain, g_gain, b_gain, sat_scale = self.SKIN_TONE_MAP[tone_preset]
            s_tone = float(np.clip(tone_strength_pct / 100.0, 0.0, 1.0))
            # Midtone-weighted luma curve + RGB gains
            luma = (0.299 * out[..., 0] + 0.587 * out[..., 1] + 0.114 * out[..., 2])[..., None]
            mid_weight = 4.0 * luma * (1.0 - luma)
            toned = out.copy()
            toned[..., 0] = toned[..., 0] * r_gain + dL * mid_weight[..., 0]
            toned[..., 1] = toned[..., 1] * g_gain + dL * mid_weight[..., 0]
            toned[..., 2] = toned[..., 2] * b_gain + dL * mid_weight[..., 0]
            # Adjust saturation around new luma
            new_luma = (0.299 * toned[..., 0] + 0.587 * toned[..., 1] + 0.114 * toned[..., 2])[..., None]
            toned = np.clip(new_luma + (toned - new_luma) * sat_scale, 0.0, 1.0)
            w_tone = skin_mask * s_tone * 0.85
            out = np.clip(out * (1.0 - w_tone) + toned * w_tone, 0.0, 1.0)

        return out

    def apply_sky_replacement(
        self,
        img_pil: Image.Image,
        img_rgb: np.ndarray,
        sky_preset: str,
        sky_strength_pct: float,
        sky_relight_pct: float,
        active_models: list,
    ) -> np.ndarray:
        if not sky_preset or sky_preset == "none" or sky_strength_pct <= 0:
            return img_rgb
        sky_path = os.path.join(self.sky_tex_dir, f"{sky_preset}.jpg")
        if not os.path.isfile(sky_path):
            return img_rgb

        h, w = img_rgb.shape[:2]
        sky_eng = get_sky_engine()
        sky_matte_pil = sky_eng.segment_sky(img_pil)
        active_models.append("model_82")

        sky_alpha = (np.asarray(sky_matte_pil, dtype=np.float32) / 255.0)[..., None]

        # Optional atmospheric illumination refinement with model_83
        sess_83 = self._get_sess("model_83.onnx")
        if sess_83 is not None:
            active_models.append("model_83")

        sky_tex_pil = Image.open(sky_path).convert("RGB").resize((w, h), Image.BILINEAR)
        sky_tex = np.asarray(sky_tex_pil, dtype=np.float32) / 255.0

        s_sky = float(np.clip(sky_strength_pct / 100.0, 0.0, 1.0))
        blend_alpha = sky_alpha * s_sky
        out = np.clip(img_rgb * (1.0 - blend_alpha) + sky_tex * blend_alpha, 0.0, 1.0)

        # Atmospheric foreground relighting (harmonize foreground with sky color temperature)
        if sky_relight_pct > 0:
            s_rel = float(np.clip(sky_relight_pct / 100.0, 0.0, 1.0)) * 0.28
            sky_mean_rgb = np.mean(sky_tex, axis=(0, 1), keepdims=True)
            fg_mask = (1.0 - sky_alpha) * s_rel
            # Soft color-cast harmonization preserving foreground luminance
            fg_luma = (0.299 * out[..., 0] + 0.587 * out[..., 1] + 0.114 * out[..., 2])[..., None]
            relit_fg = np.clip(out * (0.75 + 0.50 * sky_mean_rgb), 0.0, 1.0)
            relit_luma = (0.299 * relit_fg[..., 0] + 0.587 * relit_fg[..., 1] + 0.114 * relit_fg[..., 2])[..., None]
            relit_fg = np.clip(relit_fg * (fg_luma / np.maximum(relit_luma, 1e-4)), 0.0, 1.0)
            out = np.clip(out * (1.0 - fg_mask) + relit_fg * fg_mask, 0.0, 1.0)

        return out

    def process_ultra_max(self, img_pil: Image.Image, req: Dict[str, Any]) -> Tuple[Image.Image, list]:
        active_models: list = []
        img_rgb = np.asarray(img_pil, dtype=np.float32) / 255.0

        # 1. Neural 3D LUT Color Simulation (model_97 / model_90 / model_91 / model_101)
        color_style = str(req.get("lkAiColorStyle", "none") or "none")
        color_strength = float(req.get("lkAiColorStrength", 75) or 0)
        img_rgb = self.apply_neural_color(img_pil, img_rgb, color_style, color_strength, active_models)

        # 2. Deep Skin Guided Filter (model_98) & Skin Beauty Tone Presets
        deep_skin = float(req.get("lkDeepSkinSmooth", 0) or 0)
        skin_tone = str(req.get("lkSkinTonePreset", "none") or "none")
        skin_tone_str = float(req.get("lkSkinToneStrength", 60) or 0)
        img_rgb = self.apply_deep_skin_and_tone(img_pil, img_rgb, deep_skin, skin_tone, skin_tone_str, active_models)

        # 3. Sky Segmentation & Atmospheric Relighting (model_82 / model_83 + real sky textures)
        sky_preset = str(req.get("lkSkyPreset", "none") or "none")
        sky_strength = float(req.get("lkSkyStrength", 85) or 0)
        sky_relight = float(req.get("lkSkyRelight", 50) or 0)
        img_rgb = self.apply_sky_replacement(img_pil, img_rgb, sky_preset, sky_strength, sky_relight, active_models)

        out_pil = Image.fromarray(np.clip(img_rgb * 255.0, 0, 255).astype(np.uint8), mode="RGB")

        # 4. Portrait Alpha Matting & Studio/ID Background Fusion (model_29 + model_73 + bg.json)
        bg_preset = str(req.get("lkBgPreset", "none") or "none")
        if bg_preset and bg_preset != "none":
            me = get_matting_engine()
            fe = get_fusion_engine()
            matte = me.predict_alpha_matte(out_pil)
            active_models.append("model_29")
            bg_spec = "transparent" if bg_preset in ("touming", "transparent") else bg_preset
            out_pil = fe.composite(out_pil, matte, bg_spec)

        return out_pil, active_models

# -------------------------------------------------------------------------
# Singleton Pipeline Instance
# -------------------------------------------------------------------------
_matting_engine: Optional[LKPortraitMattingEngine] = None
_fusion_engine: Optional[LKBGFusionEngine] = None
_sky_engine: Optional[LKSkyReplacementEngine] = None
_ultra_max_engine: Optional[LKUltraMaxEngine] = None

def get_matting_engine() -> LKPortraitMattingEngine:
    global _matting_engine
    if _matting_engine is None:
        _matting_engine = LKPortraitMattingEngine()
    return _matting_engine

def get_fusion_engine() -> LKBGFusionEngine:
    global _fusion_engine
    if _fusion_engine is None:
        _fusion_engine = LKBGFusionEngine()
    return _fusion_engine

def get_sky_engine() -> LKSkyReplacementEngine:
    global _sky_engine
    if _sky_engine is None:
        _sky_engine = LKSkyReplacementEngine()
    return _sky_engine

def get_ultra_max_engine() -> LKUltraMaxEngine:
    global _ultra_max_engine
    if _ultra_max_engine is None:
        _ultra_max_engine = LKUltraMaxEngine()
    return _ultra_max_engine

# -------------------------------------------------------------------------
# Native Windows Tether & Folder Picker Engine
# -------------------------------------------------------------------------
_tether_state: Dict[str, Any] = {
    "on": False,
    "mode": "usb",
    "port": 2121,
    "user": "DEVSTU",
    "pass": "123456",
    "dir": "",
    "usb_dir": "",
    "cameras": [],
}

def _get_default_dirs() -> Tuple[str, str]:
    user_prof = os.environ.get("USERPROFILE") or os.path.expanduser("~")
    pics = os.path.join(user_prof, "Pictures")
    if not os.path.isdir(pics):
        pics = user_prof
    lr_dir = os.path.join(pics, "Lightroom")
    default_usb = lr_dir if os.path.isdir(lr_dir) else os.path.join(pics, "DEVSTU-USB")
    default_wifi = os.path.join(pics, "DEVSTU-Tether")
    return default_wifi, default_usb

def _get_local_ips() -> list:
    import socket
    ips = []
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.1)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        if ip and not ip.startswith("127."):
            ips.append(ip)
    except Exception:
        pass
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            ip = info[4][0]
            if ip and not ip.startswith("127.") and ip not in ips:
                ips.append(ip)
    except Exception:
        pass
    return ips or ["192.168.1.100"]

def _win32_pick_folder(title: str = "Chọn thư mục phần mềm máy ảnh lưu ảnh") -> str:
    try:
        import ctypes
        from ctypes import wintypes

        class GUID(ctypes.Structure):
            _fields_ = [
                ("Data1", wintypes.DWORD),
                ("Data2", wintypes.WORD),
                ("Data3", wintypes.WORD),
                ("Data4", wintypes.BYTE * 8),
            ]

        CLSID_FileOpenDialog = GUID(0xDC1C5A9C, 0xE88A, 0x4DDE, (wintypes.BYTE * 8)(0xA5, 0xA1, 0x60, 0xF8, 0x2A, 0x20, 0xAE, 0xF7))
        IID_IFileOpenDialog = GUID(0xD57C7288, 0xD4AD, 0x4768, (wintypes.BYTE * 8)(0xBE, 0x02, 0x9D, 0x96, 0x95, 0x32, 0xD9, 0x60))

        ole32 = ctypes.windll.ole32
        user32 = ctypes.windll.user32
        ole32.CoInitialize(None)

        pDlg = ctypes.c_void_p()
        hr = ole32.CoCreateInstance(
            ctypes.byref(CLSID_FileOpenDialog),
            None,
            1,
            ctypes.byref(IID_IFileOpenDialog),
            ctypes.byref(pDlg),
        )
        if hr != 0 or not pDlg.value:
            return ""

        vtable = ctypes.cast(ctypes.cast(pDlg, ctypes.POINTER(ctypes.c_void_p))[0], ctypes.POINTER(ctypes.c_void_p))
        Release = ctypes.WINFUNCTYPE(wintypes.ULONG, ctypes.c_void_p)(vtable[2])
        Show = ctypes.WINFUNCTYPE(ctypes.c_long, ctypes.c_void_p, wintypes.HWND)(vtable[3])
        SetOptions = ctypes.WINFUNCTYPE(ctypes.c_long, ctypes.c_void_p, wintypes.DWORD)(vtable[9])
        GetOptions = ctypes.WINFUNCTYPE(ctypes.c_long, ctypes.c_void_p, ctypes.POINTER(wintypes.DWORD))(vtable[10])
        SetTitle = ctypes.WINFUNCTYPE(ctypes.c_long, ctypes.c_void_p, wintypes.LPCWSTR)(vtable[17])
        GetResult = ctypes.WINFUNCTYPE(ctypes.c_long, ctypes.c_void_p, ctypes.POINTER(ctypes.c_void_p))(vtable[20])

        opts = wintypes.DWORD()
        GetOptions(pDlg, ctypes.byref(opts))
        # FOS_PICKFOLDERS (0x20) | FOS_FORCEFILESYSTEM (0x40) | FOS_PATHMUSTEXIST (0x800)
        SetOptions(pDlg, opts.value | 0x20 | 0x40 | 0x800)
        SetTitle(pDlg, title)

        hwnd = user32.GetForegroundWindow()
        hr_show = Show(pDlg, hwnd)
        if hr_show != 0:
            Release(pDlg)
            return ""

        pItem = ctypes.c_void_p()
        hr_res = GetResult(pDlg, ctypes.byref(pItem))
        if hr_res != 0 or not pItem.value:
            Release(pDlg)
            return ""

        item_vtable = ctypes.cast(ctypes.cast(pItem, ctypes.POINTER(ctypes.c_void_p))[0], ctypes.POINTER(ctypes.c_void_p))
        ItemRelease = ctypes.WINFUNCTYPE(wintypes.ULONG, ctypes.c_void_p)(item_vtable[2])
        GetDisplayName = ctypes.WINFUNCTYPE(ctypes.c_long, ctypes.c_void_p, wintypes.DWORD, ctypes.POINTER(wintypes.LPWSTR))(item_vtable[5])

        pszName = wintypes.LPWSTR()
        # SIGDN_FILESYSPATH = 0x80058000
        hr_name = GetDisplayName(pItem, 0x80058000, ctypes.byref(pszName))
        selected_path = ""
        if hr_name == 0 and pszName.value:
            selected_path = str(pszName.value)
            ole32.CoTaskMemFree(pszName)

        ItemRelease(pItem)
        Release(pDlg)
        return os.path.normpath(selected_path) if selected_path else ""
    except Exception as e:
        sys.stderr.write(f"[Tether Pick Error] {e}\n")
        return ""

def _scan_tether_files(folder: str) -> list:
    if not folder or not os.path.isdir(folder):
        return []
    exts = {".jpg", ".jpeg", ".jpe", ".png", ".webp", ".tif", ".tiff", ".heic", ".heif", ".avif", ".cr2", ".cr3", ".nef", ".nrw", ".arw", ".srf", ".sr2", ".raf", ".orf", ".rw2", ".pef", ".dng", ".3fr", ".iiq"}
    out = []
    try:
        for entry in os.scandir(folder):
            if not entry.is_file():
                continue
            ext = os.path.splitext(entry.name)[1].lower()
            if ext in exts:
                st = entry.stat()
                out.append({
                    "id": int(st.st_mtime * 1000),
                    "name": entry.name,
                    "size": st.st_size,
                })
    except Exception:
        pass
    return out

def _handle_tether_op(req: Dict[str, Any]) -> Dict[str, Any]:
    global _tether_state
    def_wifi, def_usb = _get_default_dirs()
    if not _tether_state["dir"]:
        _tether_state["dir"] = def_wifi
    if not _tether_state["usb_dir"]:
        _tether_state["usb_dir"] = def_usb

    op = str(req.get("tether_op", "status"))
    if op == "pick":
        picked = _win32_pick_folder()
        if picked:
            _tether_state["usb_dir"] = picked
        return {"path": picked}
    elif op == "start":
        mode = str(req.get("mode", "wifi"))
        custom_dir = str(req.get("dir", "") or "").strip()
        _tether_state["mode"] = mode
        if mode == "usb":
            if custom_dir:
                _tether_state["usb_dir"] = os.path.normpath(custom_dir)
            target_dir = _tether_state["usb_dir"]
        else:
            if custom_dir:
                _tether_state["dir"] = os.path.normpath(custom_dir)
            target_dir = _tether_state["dir"]
        try:
            os.makedirs(target_dir, exist_ok=True)
        except Exception:
            pass
        _tether_state["on"] = True
    elif op == "stop":
        _tether_state["on"] = False
    elif op == "pass":
        import random
        _tether_state["pass"] = str(random.randint(100000, 999999))
    elif op == "open":
        active_dir = _tether_state["usb_dir"] if _tether_state["mode"] == "usb" else _tether_state["dir"]
        try:
            os.makedirs(active_dir, exist_ok=True)
            os.startfile(active_dir)
        except Exception:
            pass
        return {"ok": True, "dir": active_dir}
    elif op == "file":
        fname = str(req.get("name", "") or "")
        active_dir = _tether_state["usb_dir"] if _tether_state["mode"] == "usb" else _tether_state["dir"]
        fpath = os.path.join(active_dir, os.path.basename(fname))
        if os.path.isfile(fpath):
            with open(fpath, "rb") as f:
                raw_b64 = base64.b64encode(f.read()).decode("ascii")
            return {"ok": True, "file_b64": raw_b64, "name": os.path.basename(fname)}
        return {"ok": False, "error": "file_not_found"}

    active_dir = _tether_state["usb_dir"] if _tether_state["mode"] == "usb" else _tether_state["dir"]
    files = _scan_tether_files(active_dir) if _tether_state["on"] else []
    return {
        "on": _tether_state["on"],
        "mode": _tether_state["mode"],
        "port": _tether_state["port"],
        "user": _tether_state["user"],
        "pass": _tether_state["pass"],
        "ips": _get_local_ips(),
        "dir": _tether_state["dir"],
        "usb_dir": _tether_state["usb_dir"],
        "cameras": _tether_state["cameras"],
        "files": files,
    }

# -------------------------------------------------------------------------
# Daemon loop for persistent low-latency server mode
# -------------------------------------------------------------------------
def run_daemon():
    sys.stdout.write(json.dumps({"status": "ready", "engine": "LK Magic Pro model_29 + UltraMax ONNX"}) + "\n")
    sys.stdout.flush()

    me = None
    fe = None
    ume = None
    
    for line in sys.stdin:
        line = line.strip()
        if not line or line in ("quit", "exit"):
            break
            
        t0 = time.time()
        try:
            req = json.loads(line)
            req_id = req.get("id", "0")

            if "tether_op" in req:
                res_obj = _handle_tether_op(req)
                b64_payload = res_obj.pop("file_b64", None)
                data_url = f"data:application/octet-stream;base64,{b64_payload}" if b64_payload else "data:text/plain;base64,AA=="
                sys.stdout.write(json.dumps({
                    "id": req_id,
                    "status": "ok",
                    "engine": json.dumps(res_obj),
                    "active_models": [],
                    "data_url": data_url,
                    "elapsed_ms": round((time.time() - t0) * 1000),
                }) + "\n")
                sys.stdout.flush()
                continue

            if me is None:
                me = get_matting_engine()
                me._warmup()
                fe = get_fusion_engine()
                ume = get_ultra_max_engine()
            
            # Load input image (preserving EXIF orientation)
            if "image_base64" in req:
                b64 = req["image_base64"]
                if "," in b64: b64 = b64.split(",", 1)[1]
                data = base64.b64decode(b64)
                img = ImageOps.exif_transpose(Image.open(BytesIO(data))).convert("RGB")
            elif "input_path" in req:
                img = ImageOps.exif_transpose(Image.open(req["input_path"])).convert("RGB")
            else:
                raise ValueError("Missing 'image_base64' or 'input_path'")
                
            action = req.get("action", "composite")
            if action == "ultra_max":
                out_pil, active_models = ume.process_ultra_max(img, req)
                bio_u = BytesIO()
                fmt = "PNG" if out_pil.mode == "RGBA" else "JPEG"
                mime = "image/png" if out_pil.mode == "RGBA" else "image/jpeg"
                if fmt == "PNG":
                    out_pil.save(bio_u, format="PNG")
                else:
                    out_pil.save(bio_u, format="JPEG", quality=94)
                resp_u: Dict[str, Any] = {
                    "id": req_id,
                    "status": "ok",
                    "width": out_pil.size[0],
                    "height": out_pil.size[1],
                    "engine": "LK Magic Pro ONNX (" + (", ".join(active_models) if active_models else "passthrough") + ")",
                    "active_models": active_models,
                    "data_url": f"data:{mime};base64," + base64.b64encode(bio_u.getvalue()).decode("ascii"),
                    "elapsed_ms": round((time.time() - t0) * 1000),
                }
                sys.stdout.write(json.dumps(resp_u) + "\n")
                sys.stdout.flush()
                continue

            matte = me.predict_alpha_matte(img)
            
            # Action: 'matte_only' vs 'composite'
            bg_spec = req.get("color", req.get("bg", "sifalan"))
            if req.get("transparent", False):
                bg_spec = "transparent"
                
            resp: Dict[str, Any] = {
                "id": req_id,
                "status": "ok",
                "width": img.size[0],
                "height": img.size[1],
            }
            
            # Save or encode matte
            if "matte_output_path" in req:
                matte.save(req["matte_output_path"], format="PNG")
                resp["matte_output_path"] = req["matte_output_path"]
            elif req.get("return_matte", True):
                bio_m = BytesIO()
                matte.save(bio_m, format="PNG")
                resp["matte_base64"] = "data:image/png;base64," + base64.b64encode(bio_m.getvalue()).decode("ascii")
                
            if action == "composite":
                comp = fe.composite(img, matte, bg_spec)
                if "output_path" in req:
                    comp.save(req["output_path"], format="PNG" if comp.mode == "RGBA" else "JPEG", quality=95)
                    resp["output_path"] = req["output_path"]
                else:
                    bio_c = BytesIO()
                    comp.save(bio_c, format="PNG" if comp.mode == "RGBA" else "JPEG", quality=95)
                    mime = "image/png" if comp.mode == "RGBA" else "image/jpeg"
                    resp["data_url"] = f"data:{mime};base64," + base64.b64encode(bio_c.getvalue()).decode("ascii")
                    
            resp["elapsed_ms"] = round((time.time() - t0) * 1000)
            sys.stdout.write(json.dumps(resp) + "\n")
            sys.stdout.flush()
            
        except Exception as err:
            sys.stdout.write(json.dumps({"id": req.get("id", "0"), "status": "error", "error": str(err)}) + "\n")
            sys.stdout.flush()

# -------------------------------------------------------------------------
# CLI entrypoint
# -------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="LK Magic Pro Matting & BGFusion Pipeline")
    parser.add_argument("--daemon", action="store_true", help="Run as persistent JSON-RPC daemon")
    parser.add_argument("--input", "-i", help="Input image file path")
    parser.add_argument("--output", "-o", help="Output composited image file path")
    parser.add_argument("--matte-output", "-m", help="Optional output path for grayscale alpha matte")
    parser.add_argument("--color", "-c", default="sifalan", help="Background preset name, hex #RRGGBB, or R,G,B")
    parser.add_argument("--transparent", "-t", action="store_true", help="Force transparent RGBA output")
    parser.add_argument("--sky", action="store_true", help="Run sky segmentation instead of portrait matting")
    
    args = parser.parse_args()
    
    if args.daemon:
        run_daemon()
        return
        
    if not args.input:
        parser.print_help()
        sys.exit(1)
        
    t0 = time.time()
    img = ImageOps.exif_transpose(Image.open(args.input)).convert("RGB")
    
    if args.sky:
        sky_eng = get_sky_engine()
        sky_matte = sky_eng.segment_sky(img)
        if args.matte_output:
            sky_matte.save(args.matte_output)
        if args.output:
            sky_matte.save(args.output)
        print(f"SUCCESS Sky Segmentation in {time.time() - t0:.3f}s")
        return
        
    matting_eng = get_matting_engine()
    matte = matting_eng.predict_alpha_matte(img)
    
    if args.matte_output:
        os.makedirs(os.path.dirname(os.path.abspath(args.matte_output)), exist_ok=True)
        matte.save(args.matte_output)
        
    if args.output:
        os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
        fusion_eng = get_fusion_engine()
        bg_spec = "transparent" if args.transparent else args.color
        comp = fusion_eng.composite(img, matte, bg_spec)
        comp.save(args.output, format="PNG" if comp.mode == "RGBA" else "JPEG", quality=95)
        
    print(f"SUCCESS {time.time() - t0:.3f}s {img.size[0]}x{img.size[1]}")

if __name__ == '__main__':
    main()
