#!/usr/bin/env python3
"""Hậu kỳ sprite theo 05_MASTER_ART (RULE D1 — cấm viền đen #000000).

Dùng sau khi agent-sprite-forge (generate2dsprite / video2dsprite) xuất PNG:

  # đổi pixel gần-đen thành viền ấm #3D2314 rồi ghi ra file mới
  python3 tools/art/recolor_outline.py in.png --out out.png
  # chỉ kiểm tra (exit 1 nếu còn pixel #000000 hoặc gần đen)
  python3 tools/art/recolor_outline.py out.png --check

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
    parser.add_argument("--threshold", type=int, default=24, help="Kênh màu lớn nhất <= ngưỡng thì coi là gần đen (mặc định 24)")
    args = parser.parse_args()

    img = Image.open(args.image)
    if args.check:
        bad = count_near_black(img, args.threshold)
        if bad:
            print(f"FAIL {args.image}: còn {bad} pixel đen/gần đen (cần viền ấm #3D2314)")
            return 1
        print(f"OK {args.image}: không còn pixel đen")
        return 0

    if not args.out:
        parser.error("cần --out khi không dùng --check")
    result, changed = recolor(img, args.threshold)
    result.save(args.out)
    print(f"Đã đổi {changed} pixel sang #3D2314 → {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
