#!/usr/bin/env python3
"""Asset UI TẠM vẽ bằng code (bảng 64 màu): icon 32x32, khung gỗ / giấy dó 9-slice, tranh splash.

  python3 tools/art/codeart_ui.py
  → src/assets/icons/<key>.png  (icon UI + 23 loài Đợt 1 lấy từ khung "chín" của atlas wave1)
  → src/assets/ui/ui_wood.png, ui_paper.png (9-slice, viền 8px), splash_scene.png

Ảnh nằm trong src/ để Vite đóng gói (đường dẫn đúng cả khi build --base=./ cho bản chạy thử).
"""
import os
import sys

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from codeart_wave1 import (  # noqa: E402
    BROWN, CREAM, GOLD, GOLD_D, GOLD_L, LEAF, LEAF_D, LEAF_M, PINK, PURPLE, PURPLE_L, RED, SAND, SLATE, SLATE_D,
    SOIL, SOIL_D, SOIL_L, STONE, STONE_D, WATER, WATER_D, WATER_L, WHITE, WOOD, WOOD_D, c,
)
from codeart_world import build as build_world  # noqa: E402
from import_sprite import DEFAULT_PALETTE, add_outline  # noqa: E402
from recolor_outline import count_off_palette, load_gpl  # noqa: E402

GUM, WOOD_L, PAPER, PAPER_D, BAMBOO = c("2A180C"), c("C88A4B"), c("FFF8EB"), c("F3E3C3"), c("E0C79A")
SKY_L, SKY = c("BFE4FF"), c("6FB7E8")


def icon(draw_fn) -> Image.Image:
    im = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    draw_fn(ImageDraw.Draw(im))
    return add_outline(im)


def i_gold(d):
    d.ellipse((5, 5, 27, 27), fill=GOLD_D)
    d.ellipse((6, 5, 25, 24), fill=GOLD)
    d.rectangle((13, 11, 18, 18), fill=GOLD_D)
    d.rectangle((14, 12, 17, 17), fill=GOLD_L)
    d.point((9, 9), fill=WHITE)


def i_gem(d):
    d.polygon([(16, 4), (27, 13), (16, 28), (5, 13)], fill=c("2EC4B6"))
    d.polygon([(16, 4), (21, 13), (16, 28), (11, 13)], fill=WATER_L)
    d.line((5, 13, 27, 13), fill=WATER_D)
    d.point((13, 9), fill=WHITE)


def i_energy(d):  # bát cơm
    d.ellipse((6, 6, 26, 18), fill=WHITE)
    d.ellipse((8, 7, 22, 14), fill=CREAM)
    d.pieslice((4, 4, 28, 28), 0, 180, fill=c("3A7BBF"))
    d.line((8, 21, 24, 21), fill=WHITE)
    d.rectangle((12, 26, 20, 28), fill=c("24477A"))


def i_xp(d):
    pts = [(16, 3), (19, 12), (28, 12), (21, 18), (24, 27), (16, 22), (8, 27), (11, 18), (4, 12), (13, 12)]
    d.polygon(pts, fill=GOLD)
    d.polygon([(16, 7), (18, 13), (14, 13)], fill=GOLD_L)


def i_mud(d):
    d.polygon([(7, 10), (25, 10), (22, 28), (10, 28)], fill=STONE_D)
    d.polygon([(9, 12), (23, 12), (21, 26), (11, 26)], fill=SLATE)
    d.ellipse((8, 8, 24, 13), fill=SOIL_D)
    d.ellipse((10, 8, 20, 11), fill=SOIL)
    d.arc((6, 2, 26, 18), 180, 360, fill=WOOD_D)


def i_scroll(d):
    d.rectangle((8, 6, 24, 26), fill=PAPER_D)
    d.rectangle((6, 4, 26, 7), fill=WOOD_L)
    d.rectangle((6, 25, 26, 28), fill=WOOD_L)
    for y in (11, 15, 19):
        d.line((11, y, 21, y), fill=WOOD_D)
    d.rectangle((18, 20, 22, 23), fill=RED)


def i_basket(d):
    d.polygon([(4, 13), (28, 13), (24, 28), (8, 28)], fill=WOOD_L)
    for x in range(8, 26, 4):
        d.line((x, 14, x - 1, 27), fill=WOOD)
    d.line((6, 20, 26, 20), fill=WOOD)
    d.arc((7, 3, 25, 23), 180, 360, fill=WOOD_D, width=2)
    d.ellipse((10, 9, 16, 14), fill=GOLD)
    d.ellipse((16, 9, 22, 14), fill=LEAF)


def i_book(d):
    d.rectangle((5, 6, 27, 27), fill=c("A51F1F"))
    d.rectangle((7, 6, 27, 25), fill=RED)
    d.rectangle((9, 9, 24, 13), fill=GOLD_L)
    d.line((7, 6, 7, 27), fill=c("6E4121"), width=2)
    d.rectangle((25, 8, 27, 25), fill=PAPER)


def i_axe(d):
    d.line((8, 27, 22, 9), fill=WOOD, width=3)
    d.polygon([(17, 5), (27, 9), (24, 17), (18, 12)], fill=STONE)
    d.line((24, 10, 25, 15), fill=WHITE)


def i_gate(d):
    d.rectangle((6, 12, 9, 28), fill=c("A51F1F"))
    d.rectangle((23, 12, 26, 28), fill=c("A51F1F"))
    d.polygon([(2, 9), (30, 9), (27, 5), (5, 5)], fill=RED)
    d.rectangle((5, 13, 27, 15), fill=c("A51F1F"))
    d.rectangle((13, 8, 19, 12), fill=GOLD)


def i_seed(d):
    d.polygon([(8, 10), (24, 10), (27, 28), (5, 28)], fill=BAMBOO)
    d.rectangle((10, 6, 22, 11), fill=WOOD_L)
    d.line((10, 8, 22, 8), fill=WOOD_D)
    d.ellipse((12, 15, 20, 23), fill=LEAF)
    d.line((16, 23, 16, 17), fill=LEAF_D)


def i_heart(d):
    d.ellipse((5, 7, 17, 19), fill=c("D62828"))
    d.ellipse((15, 7, 27, 19), fill=c("D62828"))
    d.polygon([(6, 15), (26, 15), (16, 27)], fill=c("D62828"))
    d.point((10, 10), fill=PINK)


def i_lock(d):
    d.arc((9, 4, 23, 20), 180, 360, fill=STONE_D, width=3)
    d.rectangle((7, 13, 25, 28), fill=GOLD_D)
    d.rectangle((8, 14, 24, 26), fill=GOLD)
    d.rectangle((15, 18, 17, 23), fill=GUM)


UI_ICONS = {
    "gold": i_gold, "gem": i_gem, "energy": i_energy, "xp": i_xp, "mud": i_mud, "scroll": i_scroll,
    "basket": i_basket, "book": i_book, "axe": i_axe, "gate": i_gate, "seed": i_seed, "heart": i_heart, "lock": i_lock,
}


def nine_slice(kind: str) -> Image.Image:
    im = Image.new("RGBA", (24, 24), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if kind == "wood":
        d.rounded_rectangle((0, 0, 23, 23), 5, fill=c("3D2314"))
        d.rounded_rectangle((2, 2, 21, 21), 4, fill=c("6E4121"))
        d.rounded_rectangle((3, 3, 20, 20), 3, fill=c("A0673A"))
        # vân gỗ chỉ ở viền (vùng giữa 8..15 bị kéo giãn khi 9-slice → phải phẳng màu)
        for y in (5, 18):
            d.line((4, y, 19, y), fill=c("6E4121"))
        d.line((4, 3, 19, 3), fill=WOOD_L)
        for x, y in ((5, 5), (18, 5), (5, 18), (18, 18)):
            d.point((x, y), fill=GOLD_L)
    else:
        d.rounded_rectangle((0, 0, 23, 23), 5, fill=c("6E4121"))
        d.rounded_rectangle((2, 2, 21, 21), 4, fill=BAMBOO)
        d.rounded_rectangle((3, 3, 20, 20), 3, fill=PAPER)
        for x, y in ((5, 5), (18, 4), (4, 18), (18, 19)):  # chấm giấy dó chỉ ở viền
            d.point((x, y), fill=PAPER_D)
    return im


def splash_scene() -> Image.Image:
    w = build_world()
    im = Image.new("RGBA", (240, 112), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, 239, 111), 10, fill=SKY_L)
    d.rectangle((0, 70, 239, 111), fill=c("8AC926"))
    d.rounded_rectangle((0, 0, 239, 111), 10, outline=c("3D2314"), width=2)
    for name, x, y in (("cloud_0", 14, 8), ("cloud_1", 150, 14)):
        im.alpha_composite(w[name], (x, y))
    im.alpha_composite(w["banyan"].resize((72, 78), Image.NEAREST), (4, 30))
    im.alpha_composite(w["house"], (60, 8))
    im.alpha_composite(w["haystack"], (190, 66))
    im.alpha_composite(w["farmer_f_idle_0"], (150, 44))
    im.alpha_composite(w["farmer_m_act_1"], (178, 44))
    for x in range(8, 232, 18):
        im.alpha_composite(w["tuft_1"], (x, 96))
    return im


def main() -> int:
    root = os.path.join(os.path.dirname(__file__), "..", "..")
    icons_dir = os.path.join(root, "src", "assets", "icons")
    ui_dir = os.path.join(root, "src", "assets", "ui")
    os.makedirs(icons_dir, exist_ok=True)
    os.makedirs(ui_dir, exist_ok=True)
    palette = load_gpl(DEFAULT_PALETTE)
    out: dict[str, Image.Image] = {}
    for key, fn in UI_ICONS.items():
        out[os.path.join(icons_dir, f"{key}.png")] = icon(fn)
    wave1 = os.path.join(root, "art", "source", "wave1")
    for entity in sorted(os.listdir(wave1)):
        ripe = os.path.join(wave1, entity, "3.png")
        if os.path.exists(ripe):
            out[os.path.join(icons_dir, f"{entity}.png")] = Image.open(ripe).convert("RGBA")
    out[os.path.join(ui_dir, "ui_wood.png")] = nine_slice("wood")
    out[os.path.join(ui_dir, "ui_paper.png")] = nine_slice("paper")
    out[os.path.join(ui_dir, "splash_scene.png")] = splash_scene()
    bad = 0
    for path, im in out.items():
        if count_off_palette(im, palette):
            print(f"LỖI {path}: có pixel ngoài bảng 64 màu")
            bad += 1
        im.save(path, optimize=True)
    print(f"Đã vẽ {len(out)} ảnh UI → src/assets/icons, src/assets/ui" + (f" ({bad} lỗi)" if bad else ""))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
