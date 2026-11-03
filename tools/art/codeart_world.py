#!/usr/bin/env python3
"""Asset thế giới TẠM vẽ bằng code cho bản chạy thử GĐ1 (bảng 64 màu, viền ấm #3D2314, góc 3/4).

  python3 tools/art/codeart_world.py   # ghi art/source/world/<tên>.png
  python3 tools/art/pack_atlas.py art/source/world --name world

Gồm: ô đất 168x80 (ruộng khô/ướt, vườn, ao 3 khung, đất hoang), nền cỏ & đường làng (tile 32px),
nhà chính 3 gian, giếng làng, lô "sắp mở", cảnh trang trí (cỏ, hoa, đá, tre, chuối, rơm, rào tre, cây đa),
nhân vật 48x64 (điền chủ nam/nữ: đứng 2, đi 4, làm việc 2; Bác Bảy đứng 2), mây, bướm, chim.
GĐ2 (S5): Lán Thợ mái tranh 140x100; thợ Chú Tư / Cô Năm 48x64 (đứng 2, đi 4).
Ảnh thật nhập bằng import_sprite.py / thay file cùng tên sẽ thay khung tương ứng.
"""
import math
import os
import random
import sys

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from codeart_wave1 import (  # noqa: E402
    BROWN, CREAM, FOAM, GOLD, GOLD_D, GOLD_L, LEAF, LEAF_D, LEAF_DD, LEAF_L, LEAF_M, LEAF_PALE, ORANGE, PINK,
    PINK_L, PURPLE, RED, RED_D, SAND, SKIN_D, SLATE, SLATE_D, SOIL, SOIL_D, SOIL_L, SPARK, STONE, STONE_D, STRAW,
    WATER, WATER_D, WATER_L, WHITE, WOOD, WOOD_D, c,
)
from import_sprite import DEFAULT_PALETTE, add_outline  # noqa: E402
from recolor_outline import count_off_palette, load_gpl  # noqa: E402

OUTLINE = c("3D2314")
GUM = c("2A180C")
WOOD_L, PAPER, PAPER_D, BAMBOO = c("C88A4B"), c("FFF8EB"), c("F3E3C3"), c("E0C79A")
SKIN, SKIN_L, HAIR = c("F2C9A0"), c("FCE3C8"), c("4A2C17")
ROOF, ROOF_D, ROOF_L = c("C85A32"), c("A51F1F"), c("F07C4A")
SKY_L, SKY = c("BFE4FF"), c("6FB7E8")
DIRT, DIRT_L = c("E6C79C"), c("F2F0EA")


def canvas(w: int, h: int) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    return im, ImageDraw.Draw(im)


# ----------------------------------------------------------------------------- ô đất 168x80
def plot_base(d, fill, edge, rim=OUTLINE):
    d.rounded_rectangle((0, 0, 167, 79), 12, fill=rim)
    d.rounded_rectangle((3, 3, 164, 76), 10, fill=edge)
    d.rounded_rectangle((6, 6, 161, 70), 8, fill=fill)


def tile_land(wet: bool) -> Image.Image:
    im, d = canvas(168, 80)
    plot_base(d, SOIL_D if wet else SOIL, LEAF_D)
    for row in range(5):
        y = 14 + row * 11
        d.line((14, y, 154, y), fill=SOIL_D if not wet else c("4E3424"), width=3)
        d.line((14, y - 2, 154, y - 2), fill=SOIL_L if not wet else SOIL, width=1)
    if wet:
        for x, y in ((30, 20), (80, 42), (128, 30), (60, 56), (140, 58)):
            d.line((x, y, x + 6, y), fill=WATER_L)
    rnd = random.Random(1 if wet else 2)
    for _ in range(14):
        x, y = rnd.randint(10, 156), rnd.randint(8, 70)
        d.point((x, y), fill=DIRT if not wet else SOIL_L)
    for x in range(10, 160, 9):
        d.point((x, 7), fill=LEAF_L)
        d.point((x + 4, 72), fill=LEAF_M)
    return im


def tile_orchard() -> Image.Image:
    im, d = canvas(168, 80)
    plot_base(d, SOIL, LEAF_D)
    rnd = random.Random(3)
    for _ in range(26):
        x, y = rnd.randint(14, 150), rnd.randint(12, 64)
        d.line((x, y, x + 2, y - 3), fill=LEAF_M)
        d.line((x + 2, y, x + 3, y - 2), fill=LEAF)
    for x in (42, 84, 126):
        d.ellipse((x - 10, 32, x + 10, 48), fill=SOIL_D)
        d.ellipse((x - 8, 33, x + 8, 44), fill=c("4E3424"))
    return im


def tile_pond(frame: int) -> Image.Image:
    im, d = canvas(168, 80)
    d.rounded_rectangle((0, 0, 167, 79), 18, fill=OUTLINE)
    d.rounded_rectangle((3, 3, 164, 76), 16, fill=STONE_D)
    d.rounded_rectangle((7, 7, 160, 72), 13, fill=WATER_D)
    d.rounded_rectangle((10, 9, 157, 66), 11, fill=WATER)
    for i in range(7):
        x = 18 + ((i * 23 + frame * 7) % 130)
        y = 16 + (i * 13 % 44)
        d.line((x, y, x + 8, y), fill=WATER_L)
        d.point((x + 10, y), fill=FOAM)
    for x in range(14, 156, 12):
        d.point((x, 5), fill=STONE)
    return im


def tile_wild() -> Image.Image:
    im, d = canvas(168, 80)
    plot_base(d, c("4E8222"), LEAF_D)
    rnd = random.Random(5)
    for _ in range(40):
        x, y = rnd.randint(10, 156), rnd.randint(10, 68)
        d.line((x, y, x - 1, y - 4), fill=LEAF_M)
        d.line((x + 2, y, x + 3, y - 3), fill=LEAF_L)
    for x, y in ((36, 40), (110, 28), (140, 56)):
        d.ellipse((x - 6, y - 4, x + 6, y + 4), fill=STONE_D)
        d.ellipse((x - 5, y - 4, x + 3, y + 1), fill=STONE)
    d.line((70, 50, 90, 58), fill=WOOD_D, width=2)
    return im


# ----------------------------------------------------------------------------- nền 32px
def grass_tile() -> Image.Image:
    im = Image.new("RGBA", (32, 32), c("8AC926"))
    d = ImageDraw.Draw(im)
    rnd = random.Random(7)
    for _ in range(18):
        x, y = rnd.randint(0, 31), rnd.randint(0, 31)
        d.point((x, y), fill=LEAF_M if rnd.random() < 0.6 else LEAF_L)
    for _ in range(4):
        x, y = rnd.randint(2, 29), rnd.randint(3, 29)
        d.line((x, y, x, y - 2), fill=LEAF_D)
    return im


def path_tile() -> Image.Image:
    im = Image.new("RGBA", (32, 32), DIRT)
    d = ImageDraw.Draw(im)
    rnd = random.Random(8)
    for _ in range(6):
        x, y = rnd.randint(1, 26), rnd.randint(2, 26)
        d.ellipse((x, y, x + 5, y + 3), fill=SAND if rnd.random() < 0.5 else DIRT_L)
        d.point((x + 2, y + 3), fill=SOIL_L)
    return im


# ----------------------------------------------------------------------------- nhà cửa
def house() -> Image.Image:
    im, d = canvas(132, 100)
    d.ellipse((6, 84, 126, 98), fill=c("4E8222"))
    d.rectangle((14, 48, 118, 88), fill=PAPER_D)
    for x in (14, 48, 84, 118):
        d.rectangle((x - 3, 46, x + 1, 88), fill=WOOD)
    d.rectangle((52, 58, 80, 88), fill=WOOD_D)
    d.line((66, 58, 66, 88), fill=GUM)
    for x in (24, 92):
        d.rectangle((x, 58, x + 16, 72), fill=SLATE)
        d.line((x + 8, 58, x + 8, 72), fill=WOOD_D)
        d.line((x, 65, x + 16, 65), fill=WOOD_D)
    d.polygon([(2, 50), (130, 50), (110, 14), (22, 14)], fill=ROOF)
    for y in range(18, 50, 6):
        d.line((22 - (y - 14) * 0.55, y, 110 + (y - 14) * 0.55, y), fill=ROOF_D)
    d.line((22, 14, 110, 14), fill=ROOF_L, width=2)
    d.polygon([(18, 12), (26, 4), (30, 14)], fill=ROOF_D)
    d.polygon([(114, 12), (106, 4), (102, 14)], fill=ROOF_D)
    d.rectangle((94, 2, 102, 16), fill=STONE_D)
    d.rectangle((94, 2, 102, 4), fill=SLATE_D)
    for x in range(8, 126, 8):
        d.rectangle((x, 88, x + 4, 92), fill=STONE)
    return add_outline(im)


def well() -> Image.Image:
    im, d = canvas(56, 60)
    d.rectangle((10, 6, 13, 34), fill=WOOD)
    d.rectangle((42, 6, 45, 34), fill=WOOD)
    d.polygon([(4, 8), (52, 8), (44, 0), (12, 0)], fill=ROOF)
    d.line((12, 18, 44, 18), fill=WOOD_D, width=2)
    d.line((28, 18, 28, 30), fill=BAMBOO)
    d.rectangle((24, 30, 32, 36), fill=WOOD_D)
    d.ellipse((4, 30, 52, 58), fill=STONE_D)
    d.ellipse((8, 32, 48, 48), fill=STONE)
    d.ellipse((14, 35, 42, 45), fill=WATER_D)
    d.line((18, 38, 26, 38), fill=WATER_L)
    return add_outline(im)


def lot_sign() -> Image.Image:
    im, d = canvas(120, 72)
    d.ellipse((4, 44, 116, 70), fill=SOIL)
    d.ellipse((10, 46, 110, 62), fill=SOIL_L)
    for x in range(8, 116, 10):
        d.rectangle((x, 34, x + 2, 58), fill=BAMBOO)
    d.line((6, 40, 114, 40), fill=WOOD, width=2)
    d.line((6, 50, 114, 50), fill=WOOD, width=2)
    d.rectangle((54, 18, 58, 50), fill=WOOD_D)
    d.rectangle((34, 4, 80, 26), fill=WOOD_L)
    d.rectangle((36, 6, 78, 24), fill=PAPER_D)
    d.line((42, 12, 72, 12), fill=WOOD_D)
    d.line((42, 18, 66, 18), fill=WOOD_D)
    return add_outline(im)


# ----------------------------------------------------------------------------- trang trí
def tuft(variant: int) -> Image.Image:
    im, d = canvas(16, 12)
    cols = [(LEAF_M, LEAF_L), (LEAF_D, LEAF_M), (LEAF, LEAF_PALE)][variant]
    for i, x in enumerate((3, 6, 9, 12)):
        d.line((x, 11, x + (i - 1.5), 3 + (i % 2) * 2), fill=cols[i % 2])
    return im


def flower(color) -> Image.Image:
    im, d = canvas(14, 16)
    d.line((7, 15, 7, 7), fill=LEAF_D)
    d.line((7, 11, 3, 9), fill=LEAF_M)
    for dx, dy in ((-2, 0), (2, 0), (0, -2), (0, 2)):
        d.ellipse((7 + dx - 2, 5 + dy - 2, 7 + dx + 2, 5 + dy + 2), fill=color)
    d.point((7, 5), fill=GOLD_L)
    return add_outline(im)


def rock() -> Image.Image:
    im, d = canvas(22, 14)
    d.ellipse((1, 3, 21, 13), fill=STONE_D)
    d.ellipse((3, 2, 15, 9), fill=STONE)
    d.point((6, 4), fill=WHITE)
    return add_outline(im)


def bamboo() -> Image.Image:
    im, d = canvas(48, 96)
    d.ellipse((6, 86, 42, 95), fill=LEAF_D)
    for i, x in enumerate((14, 22, 30, 36)):
        top = 6 + i * 6
        d.rectangle((x, top, x + 3, 90), fill=LEAF_M if i % 2 else LEAF)
        for y in range(top + 10, 90, 12):
            d.line((x, y, x + 3, y), fill=LEAF_D)
        for y in range(top + 4, 80, 18):
            d.polygon([(x + 3, y), (x + 14, y - 4), (x + 4, y + 3)], fill=LEAF_D)
            d.polygon([(x, y + 6), (x - 11, y + 2), (x - 1, y + 9)], fill=LEAF_M)
    return add_outline(im)


def banana() -> Image.Image:
    im, d = canvas(56, 80)
    d.rectangle((25, 34, 31, 76), fill=c("A97B4F"))
    d.line((26, 40, 30, 40), fill=SOIL)
    for ang in (200, 240, 290, 330, 20):
        r = math.radians(ang)
        x2, y2 = 28 + math.cos(r) * 26, 30 + math.sin(r) * 22
        d.line((28, 32, x2, y2), fill=LEAF_D, width=2)
        d.polygon([(28, 32), (x2, y2), (x2 + 4, y2 + 6), (28 + math.cos(r) * 8, 36)], fill=LEAF_M if ang % 40 else LEAF)
    d.ellipse((30, 40, 40, 52), fill=GOLD_D)
    d.ellipse((31, 41, 38, 49), fill=GOLD)
    return add_outline(im)


def haystack() -> Image.Image:
    im, d = canvas(44, 40)
    d.ellipse((2, 30, 42, 39), fill=SOIL)
    d.polygon([(4, 34), (40, 34), (32, 8), (22, 2), (12, 8)], fill=GOLD_D)
    d.polygon([(10, 30), (34, 30), (28, 10), (22, 6), (16, 10)], fill=GOLD)
    for y in range(12, 32, 5):
        d.line((12, y, 32, y), fill=STRAW)
    d.line((22, 0, 22, 6), fill=WOOD_D, width=2)
    return add_outline(im)


def fence() -> Image.Image:
    im, d = canvas(64, 24)
    for x in range(2, 64, 9):
        d.rectangle((x, 4, x + 3, 23), fill=BAMBOO)
        d.point((x + 1, 6), fill=PAPER)
    d.line((0, 10, 63, 10), fill=WOOD, width=2)
    d.line((0, 18, 63, 18), fill=WOOD, width=2)
    return add_outline(im)


def banyan() -> Image.Image:
    im, d = canvas(96, 104)
    d.ellipse((10, 92, 86, 103), fill=LEAF_D)
    d.polygon([(40, 98), (56, 98), (54, 50), (42, 50)], fill=WOOD)
    for x in (36, 46, 58):
        d.line((x, 60, x - 2, 98), fill=WOOD_D)
    for cx, cy, r in ((48, 34, 30), (24, 46, 20), (72, 46, 20), (48, 54, 22)):
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=LEAF_DD)
    for cx, cy, r in ((46, 30, 24), (26, 42, 15), (70, 42, 15)):
        d.ellipse((cx - r, cy - r, cx + r, cy + r - 4), fill=LEAF_D)
        d.ellipse((cx - r // 2, cy - r + 2, cx + r // 4, cy - r // 3), fill=LEAF_M)
    return add_outline(im)


# ----------------------------------------------------------------------------- nhân vật 48x64
def person(frame: str, i: int, female: bool, elder: bool = False, shirt_override=None, scarf=None) -> Image.Image:
    im, d = canvas(48, 64)
    shirt = PINK if female else c("A0673A")
    shirt_d = c("B23A8A") if female else WOOD_D
    pants = c("2A180C") if not elder else SLATE_D
    if elder:
        shirt, shirt_d = STONE, STONE_D
    if shirt_override:
        shirt, shirt_d = shirt_override
    bob = (i % 2) if frame == "idle" else (1 if frame == "walk" and i % 2 else 0)
    # bóng
    d.ellipse((12, 58, 36, 63), fill=c("23192D"))
    # chân
    lx, rx = 19, 27
    if frame == "walk":
        off = [2, 0, -2, 0][i]
        d.rectangle((lx + off, 46, lx + 3 + off, 59), fill=pants)
        d.rectangle((rx - off, 46, rx + 3 - off, 59), fill=pants)
        d.rectangle((lx + off, 58, lx + 4 + off, 60), fill=SKIN_D)
        d.rectangle((rx - off, 58, rx + 4 - off, 60), fill=SKIN_D)
    else:
        d.rectangle((lx, 46, lx + 3, 59), fill=pants)
        d.rectangle((rx, 46, rx + 3, 59), fill=pants)
        d.rectangle((lx, 58, lx + 4, 60), fill=SKIN_D)
        d.rectangle((rx, 58, rx + 4, 60), fill=SKIN_D)
    top = 26 + bob
    # áo bà ba
    d.rounded_rectangle((15, top, 33, 48), 4, fill=shirt)
    d.line((24, top + 2, 24, 46), fill=shirt_d)
    for y in (top + 6, top + 11, top + 16):
        d.point((25, y), fill=PAPER)
    # tay
    if frame == "act":
        reach = [6, 9][i]
        d.rectangle((31, top + 4, 31 + reach, top + 8), fill=shirt)
        d.rectangle((31 + reach, top + 4, 34 + reach, top + 8), fill=SKIN)
        # bình tưới
        d.rectangle((34 + reach - 2, top + 8, 40 + reach - 2, top + 14), fill=SLATE)
        d.line((40 + reach - 2, top + 9, 44, top + 6 + i * 3), fill=SLATE_D)
        if i == 1:
            d.point((45, top + 10), fill=WATER_L)
            d.point((44, top + 13), fill=WATER_L)
        d.rectangle((13, top + 4, 16, top + 16), fill=shirt)
    else:
        swing = [1, 0, -1, 0][i] if frame == "walk" else 0
        d.rectangle((12, top + 4 + swing, 15, top + 16 + swing), fill=shirt)
        d.rectangle((33, top + 4 - swing, 36, top + 16 - swing), fill=shirt)
        d.rectangle((12, top + 16 + swing, 15, top + 18 + swing), fill=SKIN)
        d.rectangle((33, top + 16 - swing, 36, top + 18 - swing), fill=SKIN)
    # đầu
    hy = top - 12
    d.ellipse((17, hy, 31, hy + 14), fill=SKIN)
    d.point((21, hy + 7), fill=GUM)
    d.point((27, hy + 7), fill=GUM)
    d.point((24, hy + 10), fill=SKIN_D)
    if female:
        d.rectangle((16, hy + 4, 18, hy + 16), fill=HAIR)
        d.rectangle((30, hy + 4, 32, hy + 16), fill=HAIR)
    if elder:
        d.line((20, hy + 12, 28, hy + 12), fill=WHITE)
        d.rectangle((19, hy + 12, 29, hy + 15), fill=WHITE)
    # khăn rằn quàng cổ (thợ)
    if scarf:
        d.rectangle((17, top - 1, 31, top + 2), fill=scarf[0])
        for x in range(18, 31, 3):
            d.point((x, top), fill=scarf[1])
    # nón lá
    d.polygon([(8, hy + 5), (40, hy + 5), (24, hy - 9)], fill=BAMBOO)
    d.line((12, hy + 3, 36, hy + 3), fill=c("C88A4B"))
    d.line((17, hy - 1, 31, hy - 1), fill=c("C88A4B"))
    return add_outline(im)


def lodge() -> Image.Image:
    """Lán Thợ mái tranh (GĐ2): cột tre, mái rơm vàng, bàn ăn chung + giỏ tre phía trước."""
    im, d = canvas(140, 100)
    d.ellipse((4, 86, 136, 99), fill=c("4E8222"))
    # nền đất nện + vách tre
    d.rectangle((16, 50, 124, 88), fill=SAND)
    for x in range(18, 124, 6):
        d.line((x, 52, x, 86), fill=BAMBOO)
    d.rectangle((54, 60, 84, 88), fill=WOOD_D)  # cửa lán
    for x in (16, 52, 88, 124):
        d.rectangle((x - 3, 46, x + 1, 88), fill=c("4E8222"))  # cột tre xanh
        for y in (54, 66, 78):
            d.line((x - 3, y, x + 1, y), fill=c("2F5F1E"))
    # mái tranh vàng nhiều lớp
    d.polygon([(0, 52), (140, 52), (116, 12), (24, 12)], fill=GOLD)
    for y in range(16, 52, 5):
        span = (y - 12) * 0.6
        d.line((24 - span, y, 116 + span, y), fill=GOLD_D)
    for x in range(10, 132, 7):
        d.line((x, 50, x + 2, 55), fill=STRAW)
    d.line((24, 12, 116, 12), fill=GOLD_L, width=2)
    # bàn ăn chung + giỏ tre
    d.rectangle((90, 76, 132, 80), fill=WOOD)
    d.rectangle((94, 80, 97, 90), fill=WOOD_D)
    d.rectangle((125, 80, 128, 90), fill=WOOD_D)
    for x in (98, 110, 122):
        d.ellipse((x - 4, 71, x + 4, 77), fill=WHITE)  # bát cơm
        d.ellipse((x - 3, 70, x + 3, 74), fill=CREAM)
    d.ellipse((6, 76, 24, 90), fill=BAMBOO)  # giỏ tre
    d.line((8, 80, 22, 80), fill=c("C88A4B"))
    d.line((8, 85, 22, 85), fill=c("C88A4B"))
    return add_outline(im)


# Thợ GĐ2 (S5): Chú Tư áo nâu sồng + khăn nâu; Cô Năm áo bà ba xanh lá + khăn rằn đỏ.
WORKERS = {
    "worker_tu": dict(female=False, shirt_override=(c("8A5638"), WOOD_D), scarf=(c("6E4121"), STRAW)),
    "worker_nam": dict(female=True, shirt_override=(c("4E8222"), c("2F5F1E")), scarf=(RED, WHITE)),
}


# ----------------------------------------------------------------------------- môi trường
def cloud(v: int) -> Image.Image:
    im, d = canvas(72, 28)
    blobs = [(14, 18, 12), (30, 12, 14), (48, 15, 12), (60, 19, 9)] if v == 0 else [(16, 16, 11), (34, 14, 13), (52, 18, 10)]
    for x, y, r in blobs:
        d.ellipse((x - r, y - r, x + r, y + r), fill=SKY_L)
    for x, y, r in blobs:
        d.ellipse((x - r + 2, y - r, x + r - 3, y + r - 5), fill=WHITE)
    return im


def butterfly(i: int) -> Image.Image:
    im, d = canvas(12, 10)
    w = 4 if i == 0 else 2
    d.ellipse((6 - w - 1, 1, 6, 7), fill=GOLD_L)
    d.ellipse((6, 1, 6 + w + 1, 7), fill=GOLD_L)
    d.point((6 - w, 3), fill=ORANGE)
    d.point((6 + w, 3), fill=ORANGE)
    d.line((6, 2, 6, 8), fill=GUM)
    return im


def bird(i: int) -> Image.Image:
    im, d = canvas(14, 8)
    if i == 0:
        d.line((0, 2, 7, 5), fill=GUM)
        d.line((7, 5, 13, 2), fill=GUM)
    else:
        d.line((0, 5, 7, 3), fill=GUM)
        d.line((7, 3, 13, 5), fill=GUM)
    d.point((7, 4), fill=SLATE_D)
    return im


def smoke() -> Image.Image:
    im, d = canvas(12, 12)
    d.ellipse((1, 1, 11, 11), fill=STONE)
    d.ellipse((2, 2, 8, 7), fill=c("F2F0EA"))
    return im


def build() -> dict[str, Image.Image]:
    out: dict[str, Image.Image] = {
        "tile_land_dry": tile_land(False),
        "tile_land_wet": tile_land(True),
        "tile_orchard": tile_orchard(),
        "tile_wild": tile_wild(),
        "grass_tile": grass_tile(),
        "path_tile": path_tile(),
        "house": house(),
        "well": well(),
        "lot_sign": lot_sign(),
        "rock": rock(),
        "bamboo": bamboo(),
        "banana": banana(),
        "haystack": haystack(),
        "fence": fence(),
        "banyan": banyan(),
        "cloud_0": cloud(0),
        "cloud_1": cloud(1),
        "smoke": smoke(),
    }
    for f in range(3):
        out[f"tile_pond_{f}"] = tile_pond(f)
    for v in range(3):
        out[f"tuft_{v}"] = tuft(v)
    for name, col in (("flower_pink", PINK), ("flower_yellow", GOLD_L), ("flower_purple", PURPLE)):
        out[name] = flower(col)
    for i in range(2):
        out[f"butterfly_{i}"] = butterfly(i)
        out[f"bird_{i}"] = bird(i)
    for who, female in (("farmer_m", False), ("farmer_f", True)):
        for i in range(2):
            out[f"{who}_idle_{i}"] = person("idle", i, female)
            out[f"{who}_act_{i}"] = person("act", i, female)
        for i in range(4):
            out[f"{who}_walk_{i}"] = person("walk", i, female)
    for i in range(2):
        out[f"bacbay_idle_{i}"] = person("idle", i, False, elder=True)
    out["lodge"] = lodge()
    for who, kw in WORKERS.items():
        for i in range(2):
            out[f"{who}_idle_{i}"] = person("idle", i, **kw)
        for i in range(4):
            out[f"{who}_walk_{i}"] = person("walk", i, **kw)
    return out


def main() -> int:
    out_root = sys.argv[1] if len(sys.argv) > 1 else "art/source/world"
    os.makedirs(out_root, exist_ok=True)
    palette = load_gpl(DEFAULT_PALETTE)
    bad = 0
    frames = build()
    for name, im in frames.items():
        off = count_off_palette(im, palette)
        if off:
            print(f"LỖI {name}: {off} pixel ngoài bảng 64 màu")
            bad += 1
        im.save(os.path.join(out_root, f"{name}.png"))
    print(f"Đã vẽ {len(frames)} khung thế giới → {out_root}" + (f" ({bad} khung lỗi)" if bad else ""))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
