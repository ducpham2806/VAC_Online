#!/usr/bin/env python3
"""Hậu kỳ sprite theo 05_MASTER_ART (RULE D1 — cấm viền đen #000000).

Dùng sau khi agent-sprite-forge (generate2dsprite / video2dsprite) xuất PNG:

  # đổi pixel gần-đen thành viền ấm #3D2314 rồi ghi ra file mới
  python3 tools/art/recolor_outline.py in.png --out out.png
  # chỉ kiểm tra (exit 1 nếu còn pixel #000000 hoặc gần đen)
  python3 tools/art/recolor_outline.py out.png --check
  # khóa thêm bảng 64 màu (05 mục 1.3): đưa mỗi pixel về màu gần nhất / kiểm pixel lạc bảng
  python3 tools/art/recolor_outline.py in.png --palette art/palette/vac_base.gpl --out out.png
  python3 tools/art/recolor_outline.py out.png --palette art/palette/vac_base.gpl --check

Chỉ xử lý pixel không trong suốt (alpha > 0). Ngưỡng "gần đen" chỉnh bằng --threshold.
"""
import argparse
import sys

from PIL import Image

WARM_OUTLINE = (0x3D, 0x23, 0x14)


def is_near_black(r: int, g: int, b: int, threshold: int) -> bool:
    return max(r, g, b) <= threshold


def recolor(img: Image.Image, threshold: int) -> tuple[Image.Image, int]:
    rgba = img.convert("RGBA")
    px = rgba.load()
    changed = 0
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, a = px[x, y]
            if a > 0 and is_near_black(r, g, b, threshold):
                px[x, y] = (*WARM_OUTLINE, a)
                changed += 1
    return rgba, changed


def load_gpl(path: str) -> list[tuple[int, int, int]]:
    """Đọc bảng màu GIMP (.gpl): mỗi dòng màu bắt đầu bằng 3 số R G B."""
    colors: list[tuple[int, int, int]] = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            parts = line.split()
            if len(parts) >= 3 and all(p.isdigit() for p in parts[:3]):
                colors.append((int(parts[0]), int(parts[1]), int(parts[2])))
    if not colors:
        raise ValueError(f"Không đọc được màu nào từ {path}")
    return colors


def nearest(rgb: tuple[int, int, int], palette: list[tuple[int, int, int]]) -> tuple[int, int, int]:
    return min(palette, key=lambda c: (c[0] - rgb[0]) ** 2 + (c[1] - rgb[1]) ** 2 + (c[2] - rgb[2]) ** 2)


def snap_to_palette(img: Image.Image, palette: list[tuple[int, int, int]]) -> tuple[Image.Image, int]:
    rgba = img.convert("RGBA")
    px = rgba.load()
    allowed = set(palette)
    cache: dict[tuple[int, int, int], tuple[int, int, int]] = {}
    changed = 0
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, a = px[x, y]
            if a == 0 or (r, g, b) in allowed:
                continue
            target = cache.setdefault((r, g, b), nearest((r, g, b), palette))
            px[x, y] = (*target, a)
            changed += 1
    return rgba, changed


def count_off_palette(img: Image.Image, palette: list[tuple[int, int, int]]) -> int:
    rgba = img.convert("RGBA")
    allowed = set(palette)
    px = rgba.load()
    return sum(
        1
        for y in range(rgba.height)
        for x in range(rgba.width)
        if px[x, y][3] > 0 and px[x, y][:3] not in allowed
    )


def count_near_black(img: Image.Image, threshold: int) -> int:
    rgba = img.convert("RGBA")
    px = rgba.load()
    return sum(
        1
        for y in range(rgba.height)
        for x in range(rgba.width)
        if px[x, y][3] > 0 and is_near_black(*px[x, y][:3], threshold)
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("image", help="Ảnh PNG đầu vào")
    parser.add_argument("--out", help="Ảnh PNG đầu ra (bắt buộc khi không dùng --check)")
    parser.add_argument("--check", action="store_true", help="Chỉ kiểm tra, không sửa ảnh")
    parser.add_argument("--palette", help="Bảng màu .gpl để khóa màu (vd art/palette/vac_base.gpl)")
    parser.add_argument("--threshold", type=int, default=24, help="Kênh màu lớn nhất <= ngưỡng thì coi là gần đen (mặc định 24)")
    args = parser.parse_args()

    img = Image.open(args.image)
    palette = load_gpl(args.palette) if args.palette else None
    if args.check:
        bad = count_near_black(img, args.threshold)
        off = count_off_palette(img, palette) if palette else 0
        if bad or off:
            if bad:
                print(f"FAIL {args.image}: còn {bad} pixel đen/gần đen (cần viền ấm #3D2314)")
            if off:
                print(f"FAIL {args.image}: {off} pixel nằm ngoài bảng {len(palette or [])} màu ({args.palette})")
            return 1
        print(f"OK {args.image}: không còn pixel đen" + (f", 100% pixel thuộc bảng {len(palette or [])} màu" if palette else ""))
        return 0

    if not args.out:
        parser.error("cần --out khi không dùng --check")
    result, changed = recolor(img, args.threshold)
    snapped = 0
    if palette:
        result, snapped = snap_to_palette(result, palette)
    result.save(args.out)
    print(f"Đã đổi {changed} pixel sang #3D2314" + (f", khóa {snapped} pixel về bảng màu" if palette else "") + f" → {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
