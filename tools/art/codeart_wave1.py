#!/usr/bin/env python3
"""Sprite TẠM "vẽ bằng code" cho 23 loài Đợt 1 × 4 giai đoạn lớn (48x48, bảng 64 màu, viền #3D2314).

  python3 tools/art/codeart_wave1.py            # ghi art/source/wave1/<ID>/<0..3>.png
  python3 tools/art/pack_atlas.py art/source/wave1 --name wave1

Đây là hình giữ chỗ đúng chuẩn 05 (góc 3/4, khối đơn giản) trong lúc chờ ảnh AI / họa sĩ.
Ảnh thật nhập bằng tools/art/import_sprite.py vào CÙNG đường dẫn sẽ thay thế khung tương ứng.
Chỉ dùng màu trong art/palette/vac_base.gpl.
"""
import math
import os
import sys

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from import_sprite import DEFAULT_PALETTE, add_outline  # noqa: E402
from recolor_outline import count_off_palette, load_gpl  # noqa: E402

SIZE = 48
BASE_Y = 43  # mặt đất (neo đáy giữa)
SCALE = [0.38, 0.62, 0.86, 1.0]  # kích thước theo giai đoạn 0..3


def c(hex_: str) -> tuple[int, int, int, int]:
    return (int(hex_[0:2], 16), int(hex_[2:4], 16), int(hex_[4:6], 16), 255)


# --- màu (đều nằm trong vac_base.gpl) ---------------------------------------------------------
SOIL, SOIL_D, SOIL_L = c("6B4A32"), c("4E3424"), c("A97B4F")
LEAF_L, LEAF, LEAF_M, LEAF_D, LEAF_DD = c("B8F272"), c("8AC926"), c("7FB800"), c("4E8222"), c("2F5F1E")
LEAF_PALE = c("E4F5B0")
GOLD, GOLD_L, GOLD_D, STRAW = c("FFB703"), c("FFD166"), c("E09F00"), c("E0C79A")
RED, RED_D, ORANGE, ORANGE_L = c("D62828"), c("A51F1F"), c("F07C4A"), c("FF9800")
PURPLE, PURPLE_D, PURPLE_L, MAGENTA = c("9B5DE5"), c("6A3FA0"), c("C9B6E4"), c("B23A8A")
PINK, PINK_L, WHITE, STONE, STONE_D = c("F4A7B9"), c("FFD6E4"), c("F2F0EA"), c("C4C7C2"), c("8E9A9F")
SLATE, SLATE_D = c("5C6B73"), c("3E474D")
WATER_L, WATER, WATER_D, FOAM = c("80DEEA"), c("2EC4B6"), c("2E8B8D"), c("CDEFF2")
WOOD, WOOD_D, BROWN, SKIN_D = c("A0673A"), c("6E4121"), c("8A5638"), c("DCA57A")
SAND, CREAM, SPARK = c("E6C79C"), c("FFF3B0"), c("FFFFFF")


# --- nền theo loại ô ----------------------------------------------------------------------------
def soil(d: ImageDraw.ImageDraw, w: int = 30) -> None:
    d.ellipse((24 - w // 2, BASE_Y - 4, 24 + w // 2, BASE_Y + 3), fill=SOIL)
    d.ellipse((24 - w // 2 + 3, BASE_Y - 4, 24 + w // 2 - 6, BASE_Y - 1), fill=SOIL_L)


def water(d: ImageDraw.ImageDraw) -> None:
    d.ellipse((4, BASE_Y - 9, 44, BASE_Y + 3), fill=WATER_D)
    d.ellipse((7, BASE_Y - 8, 41, BASE_Y), fill=WATER)
    d.line((12, BASE_Y - 6, 20, BASE_Y - 6), fill=FOAM)
    d.line((28, BASE_Y - 3, 36, BASE_Y - 3), fill=WATER_L)


def nest(d: ImageDraw.ImageDraw) -> None:
    d.ellipse((10, BASE_Y - 6, 38, BASE_Y + 3), fill=STRAW)
    d.ellipse((14, BASE_Y - 5, 34, BASE_Y - 1), fill=SAND)
    for x in range(12, 37, 4):
        d.point((x, BASE_Y - 4), fill=GOLD_D)


def sparkle(d: ImageDraw.ImageDraw, x: int, y: int) -> None:
    d.line((x - 2, y, x + 2, y), fill=SPARK)
    d.line((x, y - 2, x, y + 2), fill=SPARK)
    d.point((x, y), fill=GOLD_L)


# --- khuôn cây ----------------------------------------------------------------------------------
def blades(d, s, n, color, dark, spread=12, lean=0.0):
    h = int(34 * s)
    for i in range(n):
        t = (i / (n - 1) - 0.5) if n > 1 else 0
        x0 = 24 + int(t * 6)
        x1 = 24 + int(t * spread * 2 + lean * h)
        d.line((x0, BASE_Y - 2, x1, BASE_Y - 2 - h + int(abs(t) * 6)), fill=color if i % 2 else dark, width=2)
    return h


def grass(stage, color, dark, head=None, head2=None, n=7, spread=11, droop=False):
    def draw(d):
        soil(d)
        s = SCALE[stage]
        h = blades(d, s, n, color, dark, spread)
        if head and stage >= 2:
            for i in range(n):
                t = (i / (n - 1) - 0.5)
                x = 24 + int(t * spread * 2)
                y = BASE_Y - 2 - h + int(abs(t) * 6)
                k = 4 if stage == 3 else 2
                for j in range(k):
                    px = x + (j if droop else 0)
                    d.rectangle((px - 1, y + j * 2, px, y + j * 2 + 1), fill=head if j % 2 == 0 else (head2 or head))
    return draw


def leafy(stage, light, dark, frilly=False, bulb=None):
    def draw(d):
        soil(d)
        s = SCALE[stage]
        r = max(3, int(13 * s))
        n = 5 + stage
        for i in range(n):
            a = math.pi * (1.05 + 0.9 * i / max(1, n - 1))
            cx, cy = 24 + int(math.cos(a) * r * 0.9), BASE_Y - 4 + int(math.sin(a) * r * 0.8)
            d.ellipse((cx - r // 2 - 1, cy - r // 2, cx + r // 2 + 1, cy + r // 2), fill=light if i % 2 else dark)
            if frilly and stage >= 1:
                d.point((cx - r // 2 - 1, cy), fill=LEAF_PALE)
                d.point((cx + r // 2 + 1, cy - 1), fill=LEAF_PALE)
        d.ellipse((24 - r // 2, BASE_Y - 4 - r // 2, 24 + r // 2, BASE_Y - 4 + r // 3), fill=light)
        if bulb and stage >= 2:
            br = 4 + stage
            d.ellipse((24 - br, BASE_Y - 3 - br, 24 + br, BASE_Y - 1), fill=bulb)
            d.point((24 - br // 2, BASE_Y - 2 - br), fill=WHITE)
    return draw


def bush(stage, fruit, fruit2=None, shape="dot", leaf=LEAF_M, leaf_d=LEAF_D):
    """Bụi lá nhiều khối (3/4 nhìn nghiêng), quả treo ở mép dưới các khối lá."""
    def draw(d):
        soil(d)
        s = SCALE[stage]
        r = max(3, int(9 * s))
        cy = BASE_Y - 3 - int(r * 0.9)
        lumps = [(-r, 2), (r, 2), (0, -int(r * 0.9))] if stage >= 1 else [(0, 0)]
        if stage >= 2:
            lumps += [(-int(r * 1.6), 5), (int(r * 1.6), 5)]
        for dx, dy in lumps:
            d.ellipse((24 + dx - r, cy + dy - r + 2, 24 + dx + r, cy + dy + r), fill=leaf_d)
        for dx, dy in lumps:
            d.ellipse((24 + dx - r + 1, cy + dy - r + 1, 24 + dx + r - 2, cy + dy + r - 3), fill=leaf)
            d.ellipse((24 + dx - r // 2, cy + dy - r + 2, 24 + dx + r // 4, cy + dy - r // 3), fill=LEAF_L)
        d.line((24, BASE_Y - 2, 24, cy + r), fill=leaf_d, width=2)
        if stage >= 2:
            spots = [(-r, 1), (r, 1), (-int(r * 1.6), 4), (int(r * 1.6), 4), (0, 0)][: (3 if stage == 2 else 5)]
            for i, (dx, dy) in enumerate(spots):
                fx, fy = 24 + dx, cy + dy + r - 1
                col = fruit if (i % 2 == 0 or not fruit2) else fruit2
                if shape == "pod":
                    d.rectangle((fx - 1, fy - 1, fx + 1, fy + 4), fill=col)
                elif shape == "long":
                    d.rectangle((fx - 1, fy - 1, fx + 2, fy + 6), fill=col)
                    d.point((fx, fy + 1), fill=LEAF_PALE)
                elif shape == "chili":
                    d.polygon([(fx - 1, fy - 1), (fx + 2, fy - 1), (fx, fy + 5)], fill=col)
                else:
                    d.ellipse((fx - 2, fy - 1, fx + 2, fy + 3), fill=col)
                    d.point((fx - 1, fy), fill=CREAM)
    return draw


def corn(stage):
    def draw(d):
        soil(d, 24)
        s = SCALE[stage]
        h = int(38 * s)
        d.rectangle((23, BASE_Y - 2 - h, 25, BASE_Y - 2), fill=LEAF_D)
        for k in range(1, 4):
            y = BASE_Y - 2 - int(h * k / 4)
            d.line((24, y, 24 - 8 - k, y - 6), fill=LEAF_M, width=2)
            d.line((24, y + 2, 24 + 8 + k, y - 4), fill=LEAF, width=2)
        if stage >= 2:
            y = BASE_Y - 2 - int(h * 0.55)
            d.ellipse((26, y - 6, 31, y + 4), fill=LEAF_D)
            if stage == 3:
                d.ellipse((27, y - 7, 31, y + 1), fill=GOLD_L)
                d.point((29, y - 9), fill=SKIN_D)
        if stage == 3:
            d.line((24, BASE_Y - 2 - h, 24, BASE_Y - 6 - h), fill=STRAW)
    return draw


def papaya(stage):
    def draw(d):
        soil(d, 24)
        s = SCALE[stage]
        h = int(36 * s)
        top = BASE_Y - 2 - h
        d.rectangle((22, top, 25, BASE_Y - 2), fill=WOOD)
        d.line((22, top + 4, 25, top + 4), fill=SOIL_L)
        r = max(4, int(13 * s))
        for a in range(0, 360, 45):
            ra = math.radians(a)
            ex, ey = 24 + int(math.cos(ra) * r), top + int(math.sin(ra) * r * 0.6) - 2
            d.line((24, top, ex, ey), fill=LEAF_D, width=1)
            d.ellipse((ex - 3, ey - 2, ex + 3, ey + 2), fill=LEAF_M if a % 90 else LEAF)
        if stage >= 2:
            col = ORANGE if stage == 3 else LEAF
            for dx in (-3, 2, -1):
                d.ellipse((24 + dx - 2, top + 3, 24 + dx + 2, top + 9), fill=col)
            if stage == 3:
                d.point((22, top + 4), fill=CREAM)
    return draw


def tuber(stage):
    def draw(d):
        soil(d, 34)
        s = SCALE[stage]
        n = 3 + stage
        for i in range(n):
            x = 12 + int(i * (24 / max(1, n - 1)))
            y = BASE_Y - 5 - int(8 * s) + (i % 2) * 3
            r = 2 + stage
            d.polygon([(x, y + r + 1), (x - r - 1, y - 1), (x, y - r), (x + r + 1, y - 1)], fill=PURPLE_D if i % 3 == 0 else LEAF_D)
        if stage == 3:
            for x in (16, 27):
                d.ellipse((x - 3, BASE_Y - 3, x + 4, BASE_Y + 2), fill=MAGENTA)
                d.point((x, BASE_Y - 2), fill=PINK)
    return draw


def flower_shrub(stage, petal, petal2, water_lily=False):
    def draw(d):
        if water_lily:
            water(d)
            s = SCALE[stage]
            r = max(4, int(10 * s))
            d.ellipse((24 - r - 4, BASE_Y - 8 - r // 2, 24 + r - 4, BASE_Y - 6 + r // 3), fill=LEAF_D)
            d.ellipse((18, BASE_Y - 10, 30, BASE_Y - 6), fill=LEAF_M)
            if stage >= 2:
                cx, cy = 30, BASE_Y - 12
                for a in range(0, 360, 60):
                    ra = math.radians(a)
                    d.ellipse((cx + int(math.cos(ra) * 3) - 2, cy + int(math.sin(ra) * 2) - 2,
                               cx + int(math.cos(ra) * 3) + 2, cy + int(math.sin(ra) * 2) + 2), fill=petal2)
                d.ellipse((cx - 1, cy - 1, cx + 1, cy + 1), fill=GOLD_L)
            return
        bush(stage, petal, petal2, "dot", LEAF, LEAF_D)(d)
    return draw


def garlic_chili(stage):
    def draw(d):
        soil(d)
        s = SCALE[stage]
        h = blades(d, s * 0.9, 5, LEAF_M, LEAF_D, 6)
        if stage >= 2:
            for x in (18, 24, 30):
                d.ellipse((x - 3, BASE_Y - 7, x + 3, BASE_Y - 1), fill=WHITE)
                d.line((x, BASE_Y - 7, x, BASE_Y - 5), fill=STONE)
            for x in (14, 34):
                d.polygon([(x - 1, BASE_Y - 10 - h // 3), (x + 1, BASE_Y - 10 - h // 3), (x, BASE_Y - 4 - h // 3)],
                          fill=RED if stage == 3 else ORANGE)
    return draw


def cane(stage):
    def draw(d):
        soil(d, 26)
        s = SCALE[stage]
        h = int(40 * s)
        for x, col in ((19, PURPLE_D), (24, MAGENTA), (29, PURPLE_D)):
            d.rectangle((x - 1, BASE_Y - 2 - h, x + 1, BASE_Y - 2), fill=col)
            for y in range(BASE_Y - 2 - h + 4, BASE_Y - 2, 5):
                d.line((x - 1, y, x + 1, y), fill=PURPLE_L if stage >= 2 else LEAF_D)
            d.line((x, BASE_Y - 2 - h, x - 6, BASE_Y - h + 4), fill=LEAF_M, width=2)
            d.line((x, BASE_Y - 2 - h, x + 6, BASE_Y - h + 2), fill=LEAF, width=2)
    return draw


# --- vật nuôi -----------------------------------------------------------------------------------
def bird(d, cx, cy, body, wing, head_col, beak, comb=None, scale=1.0, tail=None):
    r = int(9 * scale)
    d.ellipse((cx - r, cy - int(r * 0.8), cx + r, cy + int(r * 0.8)), fill=body)
    if tail:
        d.polygon([(cx - r + 1, cy - 2), (cx - r - 4, cy - 6), (cx - r - 2, cy + 1)], fill=tail)
    d.ellipse((cx - r // 2, cy - 2, cx + r // 2 + 1, cy + r // 2), fill=wing)
    hr = max(2, int(5 * scale))
    hx, hy = cx + r - 2, cy - r + 1
    d.ellipse((hx - hr, hy - hr, hx + hr, hy + hr), fill=head_col)
    d.point((hx + 1, hy - 1), fill=SLATE_D)
    d.polygon([(hx + hr, hy), (hx + hr + 3, hy + 1), (hx + hr, hy + 2)], fill=beak)
    if comb:
        d.rectangle((hx - 1, hy - hr - 2, hx + 1, hy - hr), fill=comb)
    d.line((cx - 2, cy + int(r * 0.8), cx - 2, cy + int(r * 0.8) + 2), fill=GOLD_D)
    d.line((cx + 2, cy + int(r * 0.8), cx + 2, cy + int(r * 0.8) + 2), fill=GOLD_D)


def eggs(d, cols):
    for i, col in enumerate(cols):
        x = 18 + i * 6
        d.ellipse((x - 3, BASE_Y - 8, x + 3, BASE_Y - 1), fill=col)
        d.point((x - 1, BASE_Y - 6), fill=WHITE)


def poultry(stage, body, wing, head_col, beak, comb=None, egg=WHITE, tail=None):
    def draw(d):
        nest(d)
        if stage == 0:
            eggs(d, [egg, egg, egg])
            return
        sc = [0, 0.55, 0.9, 0.95][stage]
        if stage == 1:
            bird(d, 24, BASE_Y - 6, CREAM, GOLD_L, CREAM, beak, None, sc)
            return
        bird(d, 22, BASE_Y - 10, body, wing, head_col, beak, comb, sc, tail)
        if stage == 3:
            d.ellipse((33, BASE_Y - 7, 39, BASE_Y - 1), fill=egg)
            sparkle(d, 40, BASE_Y - 13)
    return draw


def rabbit(stage):
    def draw(d):
        nest(d)
        sc = SCALE[stage] * 1.05
        r = max(3, int(9 * sc))
        cx, cy = 22, BASE_Y - 3 - r
        d.ellipse((cx - r, cy - int(r * 0.7), cx + r, cy + r), fill=WHITE)
        hr = max(2, int(5 * sc))
        hx, hy = cx + r - 1, cy - r + 2
        d.ellipse((hx - hr, hy - hr, hx + hr, hy + hr), fill=WHITE)
        d.rectangle((hx - 2, hy - hr - int(7 * sc), hx - 1, hy - hr), fill=WHITE)
        d.rectangle((hx + 1, hy - hr - int(6 * sc), hx + 2, hy - hr), fill=PINK_L)
        d.point((hx + 2, hy), fill=RED_D)
        d.point((hx + hr, hy + 1), fill=PINK)
        d.ellipse((cx - r - 2, cy, cx - r + 2, cy + 4), fill=STONE)
        if stage == 3:
            bird(d, 36, BASE_Y - 16, STONE, STONE_D, STONE, PINK, None, 0.55)
    return draw


# --- thủy sản -----------------------------------------------------------------------------------
def fish(d, cx, cy, body, belly, fin, scale):
    w, h = int(11 * scale), int(5 * scale)
    d.ellipse((cx - w, cy - h, cx + w, cy + h), fill=body)
    d.ellipse((cx - w + 3, cy, cx + w - 3, cy + h), fill=belly)
    d.polygon([(cx - w + 1, cy), (cx - w - 5, cy - h), (cx - w - 5, cy + h)], fill=fin)
    d.polygon([(cx - 2, cy - h), (cx + 3, cy - h - 3), (cx + 4, cy - h)], fill=fin)
    d.point((cx + w - 3, cy - 1), fill=WHITE)


def bubbles(d):
    for x, y in ((34, BASE_Y - 20), (38, BASE_Y - 25), (31, BASE_Y - 28)):
        d.ellipse((x - 1, y - 1, x + 1, y + 1), outline=FOAM)


def aqua_fish(stage):
    def draw(d):
        water(d)
        if stage == 0:
            for x, y in ((18, 34), (22, 32), (26, 35), (30, 33)):
                d.ellipse((x - 1, y - 1, x + 1, y + 1), fill=GOLD_L)
            return
        fish(d, 24, BASE_Y - 12, SLATE, STONE, SLATE_D, [0, 0.55, 0.85, 1.0][stage])
        if stage == 3:
            bubbles(d)
    return draw


def shrimp(stage):
    def draw(d):
        water(d)
        sc = SCALE[stage]
        n = 3 + stage * 2
        for i in range(n):
            x, y = 20 + i * int(3 * sc + 1), BASE_Y - 12 - int(math.sin(i * 0.7) * 4 * sc)
            d.ellipse((x - 2, y - 2, x + 2, y + 2), fill=ORANGE if stage == 3 else STONE)
        d.line((20, BASE_Y - 14, 15, BASE_Y - 20), fill=ORANGE_L if stage == 3 else STONE_D)
        if stage >= 2:
            fish(d, 34, BASE_Y - 6, SLATE_D, SLATE, SLATE_D, 0.45)
        if stage == 3:
            bubbles(d)
    return draw


def crab(stage):
    def draw(d):
        water(d)
        sc = SCALE[stage]
        r = max(3, int(8 * sc))
        cx, cy = 20, BASE_Y - 8
        d.ellipse((cx - r, cy - r + 2, cx + r, cy + r - 2), fill=SOIL_D)
        d.ellipse((cx - r + 2, cy - r + 3, cx + r - 3, cy), fill=BROWN)
        for sx in (-1, 1):
            d.line((cx + sx * r, cy, cx + sx * (r + 4), cy - 4), fill=SOIL_D, width=2)
            d.ellipse((cx + sx * (r + 4) - 2, cy - 7, cx + sx * (r + 4) + 2, cy - 3), fill=WOOD_D)
        if stage >= 2:
            d.ellipse((30, BASE_Y - 13, 38, BASE_Y - 5), fill=SLATE_D)
            d.arc((31, BASE_Y - 12, 37, BASE_Y - 6), 0, 270, fill=STONE_D)
        if stage == 3:
            bubbles(d)
    return draw


# --- 23 loài Đợt 1 ------------------------------------------------------------------------------
SPECIES = {
    "CROP_01": lambda st: grass(st, LEAF_M, LEAF_D, GOLD, GOLD_L if st == 3 else LEAF_PALE, 7, 11, True),
    "CROP_02": lambda st: leafy(st, LEAF, LEAF_D),
    "CROP_03": corn,
    "CROP_04": lambda st: grass(st, LEAF, LEAF_DD, LEAF_PALE, WHITE, 6, 7),
    "CROP_05": lambda st: leafy(st, LEAF_L, LEAF_M),
    "CROP_06": tuber,
    "CROP_07": lambda st: bush(st, LEAF_L, GOLD_D if st == 3 else LEAF_L, "pod"),
    "CROP_08": lambda st: bush(st, LEAF_D, LEAF_DD, "long", LEAF, LEAF_M),
    "CROP_09": cane,
    "CROP_10": lambda st: bush(st, SAND, STRAW, "pod", LEAF_M, LEAF_DD),
    "CROP_11": lambda st: bush(st, RED, ORANGE, "chili", LEAF_M, LEAF_D),
    "CROP_12": lambda st: bush(st, LEAF_DD, GOLD_L, "pod", LEAF, LEAF_D),
    "CROP_23": papaya,
    "CROP_N01": lambda st: leafy(st, LEAF, LEAF_D, True, PURPLE_L),
    "CROP_C01": garlic_chili,
    "CROP_S01": lambda st: flower_shrub(st, GOLD_L, GOLD, False),
    "ANI_01": lambda st: poultry(st, RED_D, BROWN, ORANGE, GOLD, RED, CREAM, LEAF_DD),
    "ANI_02": lambda st: poultry(st, SOIL_L, BROWN, SAND, SLATE, None, STONE),
    "ANI_03": lambda st: poultry(st, BROWN, SOIL_D, LEAF_DD, GOLD, None, WATER_L),
    "ANI_04": rabbit,
    "AQUA_01": aqua_fish,
    "AQUA_02": shrimp,
    "AQUA_03": crab,
}


def render(entity: str, stage: int) -> Image.Image:
    im = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    SPECIES[entity](stage)(ImageDraw.Draw(im))
    return add_outline(im)


def main() -> int:
    out_root = sys.argv[1] if len(sys.argv) > 1 else "art/source/wave1"
    palette = load_gpl(DEFAULT_PALETTE)
    bad = 0
    for entity in SPECIES:
        os.makedirs(os.path.join(out_root, entity), exist_ok=True)
        for st in range(4):
            im = render(entity, st)
            off = count_off_palette(im, palette)
            if off:
                print(f"LỖI {entity}_{st}: {off} pixel ngoài bảng 64 màu")
                bad += 1
            im.save(os.path.join(out_root, entity, f"{st}.png"))
    print(f"Đã vẽ {len(SPECIES)} loài × 4 giai đoạn → {out_root}" + (f" ({bad} khung lỗi)" if bad else ""))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
