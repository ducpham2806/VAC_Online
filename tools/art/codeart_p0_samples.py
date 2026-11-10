#!/usr/bin/env python3
"""P0-2 — 5 sprite mẫu vẽ bằng code theo chuẩn mới (docs/05_ART_AUDIO AR-11, AR-20, AR-21, AR-30).

  python3 tools/art/codeart_p0_samples.py      # ghi art/source/p0_samples/*.png + preview_x4.png

Đây là MẪU HƯỚNG HÌNH để chốt kích thước, khung, góc nhìn và bảng màu (QD-33),
không phải art thành phẩm. Ảnh thật: PO tự tạo theo art/prompts/p0_samples.md rồi nhập bằng import_sprite.py (QD-80).

  1. Lúa (CROP_01) 4 giai đoạn, khung 32x48 neo đáy
  2. Gà Ri (ANI_01) 48x48, 2 khung (đứng / mổ thóc)
  3. Cá Rô (AQUA_01) 32x32, 2 khung bơi
  4. Điền chủ 48x64, đi 4 hướng x 4 khung (xuống, lên, trái, phải)
  5. Ô 32x32: đất cuốc khô / ướt, cỏ mùa Xuân / Đông (đổi màu trong bảng, cùng hình — AR-11)
"""
import os
import sys

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from codeart_wave1 import (  # noqa: E402
    GOLD, GOLD_D, GOLD_L, LEAF, LEAF_D, LEAF_DD, LEAF_L, LEAF_M, ORANGE, RED, SAND, SLATE, SOIL, SOIL_D, SOIL_L,
    STONE, STRAW, WATER_L, WHITE, WOOD, WOOD_D, c,
)
from import_sprite import DEFAULT_PALETTE, add_outline  # noqa: E402
from recolor_outline import count_near_black, count_off_palette, load_gpl  # noqa: E402

OUT = os.path.join(os.path.dirname(__file__), "..", "..", "art", "source", "p0_samples")
OUTLINE = c("3D2314")
SKIN, HAIR, SHIRT, SHIRT_D, PANTS = c("F2C9A0"), c("4A2C17"), c("2E8B8D"), c("1B3B2B"), c("5C6B73")
HAT, HAT_D = c("E0C79A"), c("A97B4F")


def canvas(w, h):
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    return im, ImageDraw.Draw(im)


def finish(im):
    """Viền ấm 1px quanh khối (AR-21); các mẫu không viền chỉ là tile nền."""
    return add_outline(im, OUTLINE[:3])


# ---------------------------------------------------------------- 1. Lúa 4 giai đoạn (32x48)
def rice(stage: int) -> Image.Image:
    im, d = canvas(32, 48)
    d.ellipse((6, 42, 25, 47), fill=SOIL_D)  # gốc đất
    if stage == 0:  # hạt / mạ non
        for x in (12, 16, 20):
            d.line((x, 42, x, 38), fill=LEAF_L)
        return finish(im)
    h = {1: 14, 2: 24, 3: 26}[stage]
    blade, blade_d = (LEAF, LEAF_D) if stage < 3 else (GOLD_L, GOLD_D)  # lúa chín ngả vàng
    for i, x in enumerate((9, 12, 15, 18, 21, 24)):
        lean = (i - 2.5) * (1.4 if stage > 1 else 0.8)
        top = 43 - h + (i % 2) * 3
        d.line((x, 43, x + lean, top), fill=blade if i % 2 else blade_d, width=2)
    if stage >= 2:  # bông lúa: xanh ở GĐ2, vàng trĩu ở GĐ3
        head, head_d = (LEAF_L, LEAF_M) if stage == 2 else (GOLD_L, GOLD_D)
        for x in (10, 15, 20, 25):
            droop = 3 if stage == 3 else 0  # bông chín trĩu xuống
            for k in range(6):
                d.rectangle((x + droop * k // 5, 43 - h + k * 2, x + 1 + droop * k // 5, 44 - h + k * 2), fill=head if k % 2 else head_d)
    if stage == 3:
        d.line((7, 20, 26, 18), fill=STRAW)  # ánh nắng trên bông chín
    return finish(im)


# ---------------------------------------------------------------- 2. Gà Ri (48x48)
def chicken(frame: int) -> Image.Image:
    im, d = canvas(48, 48)
    peck = frame == 1
    d.ellipse((12, 18, 36, 38), fill=ORANGE)           # thân
    d.ellipse((14, 22, 28, 36), fill=GOLD_D)           # cánh
    d.polygon([(10, 22), (14, 16), (16, 26)], fill=WOOD_D)  # đuôi
    hx, hy = (32, 22) if peck else (30, 10)
    d.ellipse((hx - 6, hy, hx + 6, hy + 11), fill=ORANGE)   # đầu
    d.polygon([(hx - 2, hy - 2), (hx, hy - 5), (hx + 3, hy - 2), (hx + 2, hy + 1)], fill=RED)  # mào
    d.polygon([(hx + 5, hy + 4), (hx + 10, hy + 6), (hx + 5, hy + 7)], fill=GOLD)  # mỏ
    d.point((hx + 2, hy + 4), fill=OUTLINE)
    for x in (20, 27):
        d.line((x, 38, x, 44), fill=GOLD_D, width=2)
    if peck:
        for x, y in ((40, 34), (43, 36), (38, 37)):
            d.point((x, y), fill=STRAW)  # hạt thóc
    return finish(im)


# ---------------------------------------------------------------- 3. Cá Rô (32x32)
def fish(frame: int) -> Image.Image:
    im, d = canvas(32, 32)
    tail = 3 if frame else -3
    d.ellipse((6, 10, 24, 22), fill=c("8E9A9F"))
    d.ellipse((8, 13, 22, 21), fill=STONE)
    d.polygon([(6, 16), (1, 10 + tail), (1, 22 + tail)], fill=SLATE)
    for x in (11, 15, 19):
        d.line((x, 11, x - 1, 14), fill=SLATE)  # vảy sọc
    d.point((20, 14), fill=OUTLINE)
    d.line((12, 9, 17, 7), fill=SLATE)  # vây lưng gai
    d.point((27, 12), fill=WATER_L)  # bọt nước
    return finish(im)


# ---------------------------------------------------------------- 4. Điền chủ đi 4 hướng (48x64)
def farmer(direction: str, frame: int) -> Image.Image:
    im, d = canvas(48, 64)
    step = (0, 2, 0, -2)[frame]
    bob = 1 if frame in (1, 3) else 0
    y0 = 10 + bob
    # chân (chân bám đất, AR-30)
    if direction in ("down", "up"):
        d.rectangle((17, 46 + bob, 22, 58 + max(0, step)), fill=PANTS)
        d.rectangle((26, 46 + bob, 31, 58 + max(0, -step)), fill=PANTS)
    else:
        d.rectangle((20 + step, 46 + bob, 25 + step, 58), fill=PANTS)
        d.rectangle((23 - step, 46 + bob, 28 - step, 58), fill=SHIRT_D)
    # thân áo
    d.rounded_rectangle((14, y0 + 20, 34, y0 + 38), 4, fill=SHIRT)
    if direction in ("left", "right"):
        arm_x = (26 if direction == "right" else 17) - step  # tay đung đưa theo bước
        d.rectangle((arm_x, y0 + 23, arm_x + 4, y0 + 33), fill=SHIRT_D)
        d.rectangle((arm_x, y0 + 32, arm_x + 4, y0 + 35), fill=SKIN)
    else:
        d.rectangle((10, y0 + 22 + step // 2, 14, y0 + 34), fill=SKIN)
        d.rectangle((34, y0 + 22 - step // 2, 38, y0 + 34), fill=SKIN)
    # đầu
    d.ellipse((14, y0 + 2, 34, y0 + 22), fill=SKIN if direction != "up" else HAIR)
    if direction == "down":
        d.point((20, y0 + 13), fill=OUTLINE)
        d.point((27, y0 + 13), fill=OUTLINE)
        d.line((22, y0 + 17, 25, y0 + 17), fill=c("C85A32"))
    elif direction in ("left", "right"):
        ex = 18 if direction == "left" else 29
        d.point((ex, y0 + 13), fill=OUTLINE)
        # tóc phủ nửa sau đầu (phía ngược hướng nhìn)
        if direction == "left":
            d.chord((14, y0 + 2, 34, y0 + 22), 300, 120, fill=HAIR)
        else:
            d.chord((14, y0 + 2, 34, y0 + 22), 60, 240, fill=HAIR)
    # nón lá
    d.polygon([(6, y0 + 6), (24, y0 - 8), (42, y0 + 6)], fill=HAT)
    d.line((8, y0 + 5, 40, y0 + 5), fill=HAT_D)
    return finish(im)


# ---------------------------------------------------------------- 5. Ô 32x32
def tilled(wet: bool) -> Image.Image:
    im, d = canvas(32, 32)
    d.rectangle((0, 0, 31, 31), fill=SOIL_D if wet else SOIL)
    for y in (6, 14, 22, 30):
        d.line((1, y, 30, y), fill=c("4E3424") if wet else SOIL_D)
        d.line((1, y - 2, 30, y - 2), fill=SOIL if wet else SOIL_L)
    if wet:
        for x, y in ((6, 10), (20, 18), (12, 26)):
            d.point((x, y), fill=WATER_L)
    return im


def grass(season: str) -> Image.Image:
    """Cùng hình, đổi bảng con theo mùa (AR-11). Đông miền Bắc: cỏ úa, không tuyết."""
    base, light, dark = {
        "xuan": (LEAF, LEAF_L, LEAF_D),
        "dong": (SAND, STRAW, c("A97B4F")),
    }[season]
    im, d = canvas(32, 32)
    d.rectangle((0, 0, 31, 31), fill=base)
    for x, y in ((4, 6), (14, 3), (24, 9), (8, 18), (19, 21), (28, 26), (3, 28)):
        d.line((x, y, x + 1, y - 3), fill=dark)
        d.point((x + 2, y - 1), fill=light)
    if season == "xuan":
        d.point((16, 12), fill=WHITE)
        d.point((26, 17), fill=c("F4A7B9"))
    return im


def build() -> dict[str, Image.Image]:
    out = {f"CROP_01_{s}": rice(s) for s in range(4)}
    out.update({f"ANI_01_{f}": chicken(f) for f in range(2)})
    out.update({f"AQUA_01_{f}": fish(f) for f in range(2)})
    for direction in ("down", "up", "left", "right"):
        out.update({f"farmer_walk_{direction}_{f}": farmer(direction, f) for f in range(4)})
    out["tile_tilled_dry"], out["tile_tilled_wet"] = tilled(False), tilled(True)
    out["tile_grass_xuan"], out["tile_grass_dong"] = grass("xuan"), grass("dong")
    return out


def preview(sprites: dict[str, Image.Image]) -> Image.Image:
    """Bảng xem nhanh phóng to x4 (nearest), nền giấy để thấy viền ấm."""
    cell = 64
    names = list(sprites)
    cols = 8
    rows = (len(names) + cols - 1) // cols
    sheet = Image.new("RGBA", (cols * cell, rows * cell), c("FFF8EB"))
    for i, n in enumerate(names):
        im = sprites[n]
        x, y = (i % cols) * cell + (cell - im.width) // 2, (i // cols) * cell + (cell - im.height) // 2
        sheet.alpha_composite(im, (x, y))
    return sheet.resize((sheet.width * 4, sheet.height * 4), Image.NEAREST)


def main() -> int:
    os.makedirs(OUT, exist_ok=True)
    palette = load_gpl(DEFAULT_PALETTE)
    sprites = build()
    bad = []
    for name, im in sprites.items():
        if count_off_palette(im, palette) or count_near_black(im, 24):
            bad.append(name)
        im.save(os.path.join(OUT, f"{name}.png"))
    preview(sprites).save(os.path.join(OUT, "preview_x4.png"))
    print(f"{len(sprites)} khung -> {os.path.relpath(OUT)}; lạc bảng / gần đen: {bad or 'không'}")
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
