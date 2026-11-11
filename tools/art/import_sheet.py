#!/usr/bin/env python3
"""Nhập 1 tấm ảnh nhiều khung (ChatGPT / Gemini, nền #FF00FF) thành các khung sprite đúng chuẩn docs/05_ART_AUDIO.

  python3 tools/art/import_sheet.py --p0                     # 5 tấm mẫu P0-2 trong art/source/inbox/ -> art/source/p0_ai/
  python3 tools/art/import_sheet.py --p1                     # 6 tấm P1 (nhà, giếng, chuồng, NPC, chân dung) -> art/source/p1_ai/
  python3 tools/art/import_sheet.py in.png --layout strip:4 --size 32x48 --names CROP_01_0,CROP_01_1,CROP_01_2,CROP_01_3

Khác import_sprite.py (1 ảnh -> 1 khung):
  - Cắt khung: `strip:N` (các hình xếp ngang, tách theo khoảng trống), `grid:CxR` (ô đều nhau), `tiles:N` (ô vuông ngang, không tách nền).
  - **Cùng một tỉ lệ thu cho mọi khung của một tấm**: mạ non vẫn nhỏ hơn lúa chín; nhân vật không "nhảy" cỡ giữa các bước.
  - Thu nhỏ bằng màu chiếm đa số trong mỗi khối (sau khi khóa bảng 64 màu), giữ nét pixel thay vì làm nhòe.
Sau đó: khóa alpha 0/255, đổi gần đen -> #3D2314, viền ấm 1px (trừ tile nền).
"""
import argparse
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from import_sprite import DEFAULT_PALETTE, add_outline, parse_size  # noqa: E402
from recolor_outline import WARM_OUTLINE, count_near_black, count_off_palette, load_gpl  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
INBOX = os.path.join(ROOT, "art", "source", "inbox")
P0_OUT = os.path.join(ROOT, "art", "source", "p0_ai")
P1_OUT = os.path.join(ROOT, "art", "source", "p1_ai")

DIRS = ("down", "up", "left", "right")
# Tên khung trùng với mẫu vẽ bằng code (codeart_p0_samples.py) để so cạnh nhau.
# Tùy chọn: fit = cỡ tối đa của hình trong khung (QD-82: gà ~40x40 trong khung 48x48);
# strip_soil = bỏ ụ bùn/nước ở đáy cây vì ô đất đã có đất (QD-82).
P0_SHEETS = [
    ("CROP_01_sheet.png", "strip:4", "32x48", [f"CROP_01_{i}" for i in range(4)], {"strip_soil": True}),
    ("ANI_01_sheet.png", "strip:2", "48x48", ["ANI_01_0", "ANI_01_1"], {"fit": (40, 40)}),
    ("AQUA_01_sheet.png", "strip:2", "32x32", ["AQUA_01_0", "AQUA_01_1"], {}),
    ("farmer_walk_sheet.png", "grid:4x4", "48x64", [f"farmer_walk_{d}_{f}" for d in DIRS for f in range(4)], {}),
    ("tiles_sheet.png", "tiles:4", "32x32", ["tile_tilled_dry", "tile_tilled_wet", "tile_grass_xuan", "tile_grass_dong"], {}),
    # P1-9 (art/prompts/p1_species.md, QD-86): 4 cây + vịt của bộ 8 loài, cùng atlas `slice` với lúa/gà/cá
    *[(f"{c}_sheet.png", "strip:4", "32x48", [f"{c}_{i}" for i in range(4)], {}) for c in ("CROP_02", "CROP_03", "CROP_04", "CROP_05")],
    ("ANI_03_sheet.png", "strip:2", "48x48", ["ANI_03_0", "ANI_03_1"], {"fit": (40, 40)}),
]


# P1 (art/prompts/p1_estate_npc.md): hạng mục điền trang 2 khung (đổ nát, đã sửa); NPC 2 khung đứng + 2 khung nói.
P1_SHEETS = [
    ("house_sheet.png", "strip:2", "128x128", ["house_0", "house_1"], {}),
    ("well_sheet.png", "strip:2", "64x80", ["well_0", "well_1"], {}),
    ("coop_sheet.png", "strip:2", "96x96", ["coop_0", "coop_1"], {}),
    # QD-85: NPC lớn hơn người chơi 15% (56×74 thay 48×64) cho dễ nhận ra
    ("npc_bacbay_sheet.png", "strip:4", "56x74",
     ["npc_bacbay_idle_0", "npc_bacbay_idle_1", "npc_bacbay_talk_0", "npc_bacbay_talk_1"], {}),
    ("npc_cohuong_sheet.png", "strip:4", "56x74",
     ["npc_cohuong_idle_0", "npc_cohuong_idle_1", "npc_cohuong_talk_0", "npc_cohuong_talk_1"], {}),
    ("portraits_sheet.png", "strip:3", "64x64", ["portrait_bacbay", "portrait_cohuong", "portrait_bakien"], {}),
    # art/prompts/p1_nature.md — thay hình tạm của atlas `world`
    ("tree_sheet.png", "strip:1", "96x112", ["tree_0"], {}),  # cây đa: 1 cây cổ thụ, không chặt
    ("xoan_sheet.png", "strip:1", "96x112", ["xoan_0"], {}),  # cây xoan già: gốc cây chặt lấy Gỗ (KT-18)
    ("bamboo_sheet.png", "strip:2", "48x96", ["bamboo_0", "bamboo_1"], {}),
    ("rock_sheet.png", "strip:3", "40x32", ["rock_0", "rock_1", "rock_2"], {}),
    ("weeds_sheet.png", "strip:3", "20x16", ["weed_0", "weed_1", "weed_2"], {}),
    # Ảnh rào vẽ thẳng (PO tạo lại 11/11). Ảnh xéo thì thêm {"shear": độ dốc} để nắn rail thành ngang.
    ("fence_sheet.png", "strip:2", "64x32", ["fence_0", "fence_1"], {}),
    # P1-9 (art/prompts/p1_species.md): Bếp Củi 2 khung (đổ nát, đã sửa); icon 2 món (cũng chép sang src/assets/icons/)
    ("kitchen_sheet.png", "strip:2", "64x64", ["kitchen_0", "kitchen_1"], {}),
    ("dishes_sheet.png", "strip:2", "32x32", ["PROD_01", "PROD_03"], {}),
]


def magenta_mask(rgb: np.ndarray) -> np.ndarray:
    """True ở pixel nền: gần #FF00FF, kể cả viền pha hồng do ảnh AI làm mềm cạnh."""
    r, g, b = (rgb[..., i].astype(np.int32) for i in range(3))
    return (r - g > 60) & (b - g > 60) & (np.abs(r - b) < 110)


def palette_index(rgb: np.ndarray, palette: np.ndarray) -> np.ndarray:
    flat = rgb.reshape(-1, 3).astype(np.int32)
    out = np.empty(len(flat), dtype=np.int32)
    for s in range(0, len(flat), 200_000):
        chunk = flat[s:s + 200_000]
        d = ((chunk[:, None, :] - palette[None, :, :]) ** 2).sum(axis=2)
        out[s:s + 200_000] = d.argmin(axis=1)
    return out.reshape(rgb.shape[:2])


def runs(profile: np.ndarray, min_gap: int) -> list[tuple[int, int]]:
    """Các đoạn liên tục có hình (profile > 0), gộp khe hở < min_gap."""
    idx = np.flatnonzero(profile > 0)
    if not len(idx):
        return []
    segs, start, prev = [], idx[0], idx[0]
    for i in idx[1:]:
        if i - prev > min_gap:
            segs.append((start, prev + 1))
            start = i
        prev = i
    segs.append((start, prev + 1))
    return segs


TOUCH_WIDTH = 1.6
TOUCH_THIN = 0.3


def split_strip(alpha: np.ndarray, n: int) -> list[tuple[int, int, int, int]]:
    segs = runs(alpha.sum(axis=0), min_gap=8)
    while len(segs) > n:  # gộp cặp kề nhau có khe nhỏ nhất (vd hạt thóc tách khỏi con gà)
        gaps = [segs[i + 1][0] - segs[i][1] for i in range(len(segs) - 1)]
        i = int(np.argmin(gaps))
        segs[i:i + 2] = [(segs[i][0], segs[i + 1][1])]
    cols = alpha.sum(axis=0)
    # 2 hình chạm nhau (vd lá cây giai đoạn 3–4): cắt hình rộng nhất ở cột thưa nhất giữa nó — chỉ khi hình đó
    # rộng hẳn (≥ TOUCH_WIDTH × trung vị các hình còn lại) và cột cắt thưa (≤ TOUCH_THIN × cột dày nhất của nó).
    while 1 < len(segs) < n:
        widths = [b - a for a, b in segs]
        i = int(np.argmax(widths))
        others = float(np.median([w for k, w in enumerate(widths) if k != i]))
        x0, x1 = segs[i]
        lo, hi = x0 + (x1 - x0) // 4, x1 - (x1 - x0) // 4
        cut = lo + int(np.argmin(cols[lo:hi]))
        if widths[i] < TOUCH_WIDTH * others or cols[cut] > TOUCH_THIN * cols[x0:x1].max():
            break
        segs[i:i + 1] = [(x0, cut), (cut, x1)]
    if len(segs) != n:
        raise ValueError(f"Tìm được {len(segs)} hình, cần {n} — kiểm tra nền / bố cục ảnh")
    boxes = []
    for x0, x1 in segs:
        ys = np.flatnonzero(alpha[:, x0:x1].sum(axis=1) > 0)
        boxes.append((x0, int(ys[0]), x1, int(ys[-1]) + 1))
    return boxes


def split_grid(alpha: np.ndarray, cols: int, rows: int) -> list[tuple[int, int, int, int]]:
    """Cùng một khung (hợp bbox của mọi ô, tính theo tọa độ trong ô) để giữ nhịp nhún và đường chân."""
    h, w = alpha.shape
    cw, ch = w // cols, h // rows
    ux0, uy0, ux1, uy1 = cw, ch, 0, 0
    for r in range(rows):
        for c in range(cols):
            cell = alpha[r * ch:(r + 1) * ch, c * cw:(c + 1) * cw]
            ys, xs = np.flatnonzero(cell.sum(axis=1)), np.flatnonzero(cell.sum(axis=0))
            if len(ys):
                ux0, uy0 = min(ux0, xs[0]), min(uy0, ys[0])
                ux1, uy1 = max(ux1, xs[-1] + 1), max(uy1, ys[-1] + 1)
    return [(c * cw + ux0, r * ch + uy0, c * cw + ux1, r * ch + uy1) for r in range(rows) for c in range(cols)]


def downsample(idx: np.ndarray, alpha: np.ndarray, box: tuple[int, int, int, int], scale: float,
               out_w: int, out_h: int) -> tuple[np.ndarray, np.ndarray]:
    """Mỗi pixel đích = màu bảng chiếm đa số trong khối nguồn; trong suốt nếu < 50% khối có hình."""
    x0, y0, x1, y1 = box
    tw, th = max(1, round((x1 - x0) * scale)), max(1, round((y1 - y0) * scale))
    tw, th = min(tw, out_w), min(th, out_h)
    oi = np.zeros((th, tw), dtype=np.int32)
    oa = np.zeros((th, tw), dtype=bool)
    sx, sy = (x1 - x0) / tw, (y1 - y0) / th
    for ty in range(th):
        ya, yb = y0 + int(ty * sy), max(y0 + int(ty * sy) + 1, y0 + int((ty + 1) * sy))
        for tx in range(tw):
            xa, xb = x0 + int(tx * sx), max(x0 + int(tx * sx) + 1, x0 + int((tx + 1) * sx))
            a = alpha[ya:yb, xa:xb]
            if a.mean() >= 0.5:
                oa[ty, tx] = True
                oi[ty, tx] = np.bincount(idx[ya:yb, xa:xb][a]).argmax()
    return oi, oa


def to_image(oi: np.ndarray, oa: np.ndarray, palette: np.ndarray, size: tuple[int, int]) -> Image.Image:
    """Đặt khung đã thu vào canvas size, neo đáy giữa, chừa 1px đáy cho viền."""
    th, tw = oi.shape
    rgba = np.zeros((th, tw, 4), dtype=np.uint8)
    rgba[..., :3] = palette[oi]
    rgba[..., 3] = np.where(oa, 255, 0)
    near_black = oa & (rgba[..., :3].max(axis=2) <= 24)
    rgba[near_black, :3] = WARM_OUTLINE
    art = Image.fromarray(rgba, "RGBA")
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    canvas.paste(art, ((size[0] - tw) // 2, size[1] - 1 - th), art)
    return canvas


def plant_mask(rgb: np.ndarray) -> np.ndarray:
    """True ở pixel lá/thân/bông (xanh lá, vàng lúa); False ở bùn nâu, nước xanh lam, viền."""
    f = rgb.astype(np.float32) / 255
    mx, mn = f.max(axis=2), f.min(axis=2)
    d = np.where(mx - mn == 0, 1e-6, mx - mn)
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    sat = (mx - mn) / np.where(mx == 0, 1, mx)
    return (h >= 36) & (h <= 150) & (sat > 0.35) & (mx > 0.3)


def strip_soil(rgb: np.ndarray, alpha: np.ndarray, boxes: list[tuple[int, int, int, int]], band: float = 1.0) -> list[tuple[int, int, int, int]]:
    """Ở dải đáy mỗi khung, chỉ giữ pixel cây; trả bbox mới sát phần còn lại."""
    keep = plant_mask(rgb)
    out = []
    for x0, y0, x1, y1 in boxes:
        yb = y1 - int((y1 - y0) * band)
        alpha[yb:y1, x0:x1] &= keep[yb:y1, x0:x1]
        sub = alpha[y0:y1, x0:x1]
        ys, xs = np.flatnonzero(sub.sum(axis=1)), np.flatnonzero(sub.sum(axis=0))
        out.append((x0 + int(xs[0]), y0 + int(ys[0]), x0 + int(xs[-1]) + 1, y0 + int(ys[-1]) + 1))
    return out


def shear_y(img: Image.Image, k: float) -> Image.Image:
    """Trượt dọc: điểm ở cột x dời xuống k·x px (đường dốc −k thành ngang, đường đứng giữ đứng). Nền mới là #FF00FF."""
    w, h = img.size
    extra = int(abs(k) * w) + 1
    off = 0 if k >= 0 else extra
    return img.transform((w, h + extra), Image.Transform.AFFINE, (1, 0, 0, -k, 1, -off),
                         resample=Image.Resampling.NEAREST, fillcolor=(255, 0, 255))


def import_sheet(path: str, layout: str, size: tuple[int, int], palette_list: list[tuple[int, int, int]],
                 fit: tuple[int, int] | None = None, soil: bool = False, shear: float = 0.0) -> list[Image.Image]:
    palette = np.array(palette_list, dtype=np.int32)
    src = Image.open(path).convert("RGB")
    rgb = np.asarray(shear_y(src, shear) if shear else src)
    kind, arg = layout.split(":")
    if kind == "tiles":
        return import_tiles(rgb, int(arg), size, palette)
    alpha = ~magenta_mask(rgb)
    # bỏ nhiễu lẻ (pixel hồng/đen rời rạc do nén ảnh)
    alpha &= np.roll(alpha, 1, 0) | np.roll(alpha, -1, 0)
    alpha &= np.roll(alpha, 1, 1) | np.roll(alpha, -1, 1)
    boxes = split_strip(alpha, int(arg)) if kind == "strip" else split_grid(alpha, *map(int, arg.split("x")))
    if soil:
        boxes = strip_soil(rgb, alpha, boxes)
    fw, fh = fit or (size[0] - 2, size[1] - 2)
    scale = min(min(fw / (x1 - x0), fh / (y1 - y0)) for x0, y0, x1, y1 in boxes)
    idx = palette_index(rgb, palette)
    frames = []
    for box in boxes:
        oi, oa = downsample(idx, alpha, box, scale, size[0] - 2, size[1] - 2)
        frames.append(add_outline(to_image(oi, oa, palette, size), WARM_OUTLINE))
    return frames


def import_tiles(rgb: np.ndarray, n: int, size: tuple[int, int], palette: np.ndarray) -> list[Image.Image]:
    """Ô nền phủ kín khung: không viền, không trong suốt (AR-20)."""
    alpha = ~magenta_mask(rgb)
    boxes = split_strip(alpha, n)
    idx = palette_index(rgb, palette)
    out = []
    for x0, y0, x1, y1 in boxes:
        m = max(3, (x1 - x0) * 7 // 100)  # bỏ mép: ảnh AI hay vẽ khung tối quanh ô, làm lộ lưới khi lát liền
        box = (x0 + m, y0 + m, x1 - m, y1 - m)
        full = np.ones_like(alpha)
        oi, oa = downsample(idx, full, box, min(size[0] / (box[2] - box[0]), size[1] / (box[3] - box[1])), *size)
        rgba = np.zeros((*oi.shape, 4), dtype=np.uint8)
        rgba[..., :3] = palette[oi]
        rgba[..., 3] = 255
        out.append(Image.fromarray(rgba, "RGBA").resize(size, Image.Resampling.NEAREST))
    return out


def save_all(named: dict[str, Image.Image], out_dir: str, palette: list[tuple[int, int, int]]) -> list[str]:
    os.makedirs(out_dir, exist_ok=True)
    bad = []
    for name, im in named.items():
        if count_off_palette(im, palette) or count_near_black(im, 24):
            bad.append(name)
        im.save(os.path.join(out_dir, f"{name}.png"))
    return bad


def scene(f: dict[str, Image.Image]) -> Image.Image:
    """Ghép thử cảnh nông trại x3 để duyệt tỉ lệ giữa nhân vật, cây, vật nuôi, ô đất (không phải bản đồ thật)."""
    from PIL import ImageDraw
    sc = Image.new("RGBA", (12 * 32, 7 * 32))
    for y in range(7):
        for x in range(12):
            sc.paste(f["tile_grass_dong" if x >= 9 and y >= 5 else "tile_grass_xuan"], (x * 32, y * 32))
    for y in range(2, 5):
        for x in range(2, 7):
            sc.paste(f["tile_tilled_wet" if (x + y) % 3 == 0 else "tile_tilled_dry"], (x * 32, y * 32))
            sc.alpha_composite(f[f"CROP_01_{(x - 2) % 4}"], (x * 32, y * 32 - 16))
    ImageDraw.Draw(sc).ellipse((270, 40, 370, 120), fill=(46, 139, 141, 255), outline=(*WARM_OUTLINE, 255), width=2)
    sc.alpha_composite(f["AQUA_01_0"], (290, 55))
    sc.alpha_composite(f["AQUA_01_1"], (325, 80))
    sc.alpha_composite(f["ANI_01_0"], (250, 150))
    sc.alpha_composite(f["ANI_01_1"], (300, 160))
    sc.alpha_composite(f["farmer_walk_right_1"], (200, 120))
    return sc.resize((sc.width * 3, sc.height * 3), Image.Resampling.NEAREST)


# AR-11: mùa Hạ/Thu làm bằng đổi màu cỏ Xuân trong bảng 64 màu (cùng hình). (độ lệch sắc độ, hệ số bão hòa, hệ số sáng)
SEASON_SHIFT = {"ha": (8, 1.15, 0.85), "thu": (-15, 0.7, 0.85)}


def season_variant(img: Image.Image, shift: tuple[float, float, float], palette_list: list[tuple[int, int, int]]) -> Image.Image:
    """Đổi sắc độ/bão hòa/độ sáng từng pixel rồi khóa lại vào bảng (không sinh màu ngoài bảng)."""
    import colorsys
    dh, ks, kv = shift
    palette = np.array(palette_list, dtype=np.int32)
    rgba = np.asarray(img.convert("RGBA")).copy()
    out = rgba.copy()
    for y in range(rgba.shape[0]):
        for x in range(rgba.shape[1]):
            r, g, b, a = (int(v) for v in rgba[y, x])
            if not a:
                continue
            h, sat, val = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            h = (h + dh / 360) % 1
            nr, ng, nb = colorsys.hsv_to_rgb(h, min(1, sat * ks), min(1, val * kv))
            c = np.array([nr * 255, ng * 255, nb * 255])
            out[y, x, :3] = palette[((palette - c) ** 2).sum(axis=1).argmin()]
    return Image.fromarray(out, "RGBA")


def run_p0(palette: list[tuple[int, int, int]]) -> int:
    named: dict[str, Image.Image] = {}
    for fname, layout, size, names, opt in P0_SHEETS:
        if not os.path.exists(os.path.join(INBOX, fname)):
            continue  # ảnh loài chưa có → game dùng hình tạm atlas `wave1`
        frames = import_sheet(os.path.join(INBOX, fname), layout, parse_size(size), palette,
                              fit=opt.get("fit"), soil=opt.get("strip_soil", False))
        named.update(zip(names, frames))
    # Ảnh AI vẽ cả hàng 3 và 4 đều quay mặt sang phải: hàng "left" lấy bản lật gương của hàng 3.
    for f in range(4):
        named[f"farmer_walk_left_{f}"] = named[f"farmer_walk_left_{f}"].transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    for name, shift in SEASON_SHIFT.items():
        named[f"tile_grass_{name}"] = season_variant(named["tile_grass_xuan"], shift, palette)
    bad = save_all(named, P0_OUT, palette)
    from codeart_p0_samples import preview  # noqa: E402 — dùng chung bảng xem x4
    preview(named).save(os.path.join(P0_OUT, "preview_x4.png"))
    scene(named).save(os.path.join(P0_OUT, "scene_x3.png"))
    print(f"{len(named)} khung -> {os.path.relpath(P0_OUT)}; lạc bảng / gần đen: {bad or 'không'}")
    return 1 if bad else 0


def p1_preview(named: dict[str, Image.Image], grass: Image.Image | None) -> Image.Image:
    """Bảng duyệt x3: các khung P1 trên nền cỏ, cùng tỉ lệ với ô 32×32 (người chơi 48×64 để so cỡ)."""
    order = ["house_0", "house_1", "well_0", "well_1", "coop_0", "coop_1",
             "npc_bacbay_idle_0", "npc_bacbay_talk_0", "npc_cohuong_idle_0", "npc_cohuong_talk_0",
             "portrait_bacbay", "portrait_cohuong", "portrait_bakien",
             "kitchen_0", "kitchen_1", "PROD_01", "PROD_03",
             "tree_0", "xoan_0", "bamboo_0", "bamboo_1", "rock_0", "rock_1", "rock_2", "weed_0", "weed_1", "weed_2", "fence_0", "fence_1"]
    order = [n for n in order if n in named]
    w = sum(named[n].width + 8 for n in order) + 8
    sheet = Image.new("RGBA", (w, 144), (90, 140, 60, 255))
    if grass:
        for x in range(0, w, 32):
            for y in range(0, 144, 32):
                sheet.paste(grass, (x, y))
    x = 8
    for n in order:
        im = named[n]
        sheet.alpha_composite(im, (x, 136 - im.height))
        x += im.width + 8
    return sheet.resize((sheet.width * 3, sheet.height * 3), Image.Resampling.NEAREST)


def run_p1(palette: list[tuple[int, int, int]]) -> int:
    named: dict[str, Image.Image] = {}
    for fname, layout, size, names, opt in P1_SHEETS:
        if not os.path.exists(os.path.join(INBOX, fname)):
            continue  # nhóm ảnh chưa có (vd ảnh thiên nhiên) → game dùng hình tạm atlas `world`
        frames = import_sheet(os.path.join(INBOX, fname), layout, parse_size(size), palette,
                              fit=opt.get("fit"), soil=opt.get("strip_soil", False), shear=opt.get("shear", 0.0))
        named.update(zip(names, frames))
    bad = save_all(named, P1_OUT, palette)
    # icon món ăn cho HUD (GameIcon đọc src/assets/icons/<ID>.png)
    for icon in ("PROD_01", "PROD_03"):
        if icon in named:
            named[icon].save(os.path.join(ROOT, "src", "assets", "icons", f"{icon}.png"))
    grass_path = os.path.join(P0_OUT, "tile_grass_xuan.png")
    grass = Image.open(grass_path).convert("RGBA") if os.path.exists(grass_path) else None
    p1_preview(named, grass).save(os.path.join(P1_OUT, "preview_x3.png"))
    print(f"{len(named)} khung -> {os.path.relpath(P1_OUT)}; lạc bảng / gần đen: {bad or 'không'}")
    return 1 if bad else 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("image", nargs="?")
    ap.add_argument("--p0", action="store_true", help="nhập 5 tấm mẫu P0-2 từ art/source/inbox/")
    ap.add_argument("--p1", action="store_true", help="nhập 6 tấm P1 (nhà, giếng, chuồng, NPC, chân dung) từ art/source/inbox/")
    ap.add_argument("--layout", help="strip:N | grid:CxR | tiles:N")
    ap.add_argument("--size", default="48x48")
    ap.add_argument("--names", help="tên khung, cách nhau dấu phẩy, theo thứ tự trái→phải, trên→dưới")
    ap.add_argument("--out-dir", default="art/source/wave1")
    ap.add_argument("--palette", default=DEFAULT_PALETTE)
    a = ap.parse_args()
    palette = load_gpl(a.palette)
    if a.p0:
        return run_p0(palette)
    if a.p1:
        return run_p1(palette)
    if not (a.image and a.layout and a.names):
        ap.error("cần image, --layout, --names (hoặc --p0)")
    frames = import_sheet(a.image, a.layout, parse_size(a.size), palette)
    names = a.names.split(",")
    if len(names) != len(frames):
        ap.error(f"{len(frames)} khung nhưng {len(names)} tên")
    bad = save_all(dict(zip(names, frames)), a.out_dir, palette)
    print(f"{len(frames)} khung -> {a.out_dir}; lạc bảng / gần đen: {bad or 'không'}")
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
