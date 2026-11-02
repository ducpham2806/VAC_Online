#!/usr/bin/env python3
"""Đóng các sprite art/source/<lô>/<ID>/<stage>.png thành 1 atlas Phaser (JSON Hash).

  python3 tools/art/pack_atlas.py art/source/wave1 --name wave1
  → public/assets/atlas/wave1.png + public/assets/atlas/wave1.json   (khung tên "<ID>_<stage>")

Hai kiểu thư mục nguồn:
  - <ID>/<stage>.png  → khung "<ID>_<stage>" (sprite cây/vật nuôi theo giai đoạn, thường cùng 48x48)
  - <tên>.png         → khung "<tên>" (asset thế giới / UI, kích thước tùy ý)
Khung cùng kích thước xếp lưới; khác kích thước thì xếp theo kệ (shelf). Cách nhau 2px để tránh lem khi zoom.
"""
import argparse
import json
import math
import os
import sys

from PIL import Image

PADDING = 2


def collect(src: str) -> list[tuple[str, str]]:
    frames: list[tuple[str, str]] = []
    for entity in sorted(os.listdir(src)):
        d = os.path.join(src, entity)
        if not os.path.isdir(d):
            stem, ext = os.path.splitext(entity)
            if ext.lower() == ".png":
                frames.append((stem, d))
            continue
        for f in sorted(os.listdir(d)):
            stem, ext = os.path.splitext(f)
            if ext.lower() == ".png" and stem.isdigit():
                frames.append((f"{entity}_{stem}", os.path.join(d, f)))
    return frames


def layout(sizes: list[tuple[int, int]]) -> list[tuple[int, int]]:
    """Cùng kích thước → lưới vuông; khác nhau → xếp kệ theo chiều cao giảm dần, rộng tối đa 1024px."""
    if len(set(sizes)) == 1:
        fw, fh = sizes[0]
        cols = math.ceil(math.sqrt(len(sizes)))
        return [((i % cols) * (fw + PADDING), (i // cols) * (fh + PADDING)) for i in range(len(sizes))]
    max_w = max(1024, max(w for w, _ in sizes) + PADDING)
    order = sorted(range(len(sizes)), key=lambda i: (-sizes[i][1], -sizes[i][0]))
    pos: list[tuple[int, int]] = [(0, 0)] * len(sizes)
    x = y = shelf_h = 0
    for i in order:
        w, h = sizes[i]
        if x + w + PADDING > max_w:
            x, y, shelf_h = 0, y + shelf_h + PADDING, 0
        pos[i] = (x, y)
        x += w + PADDING
        shelf_h = max(shelf_h, h)
    return pos


def pack(src: str, name: str, out_dir: str) -> tuple[str, str, int]:
    frames = collect(src)
    if not frames:
        raise ValueError(f"Không có sprite nào trong {src} (cần <ID>/<stage>.png)")
    images = [(n, Image.open(p).convert("RGBA")) for n, p in frames]
    positions = layout([im.size for _, im in images])
    sheet_w = max(x + im.width for (x, _), (_, im) in zip(positions, images)) + PADDING
    sheet_h = max(y + im.height for (_, y), (_, im) in zip(positions, images)) + PADDING
    sheet = Image.new("RGBA", (sheet_w, sheet_h), (0, 0, 0, 0))
    meta_frames = {}
    for (x, y), (n, im) in zip(positions, images):
        fw, fh = im.size
        sheet.paste(im, (x, y))
        meta_frames[n] = {
            "frame": {"x": x, "y": y, "w": fw, "h": fh},
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": fw, "h": fh},
            "sourceSize": {"w": fw, "h": fh},
        }
    os.makedirs(out_dir, exist_ok=True)
    png = os.path.join(out_dir, f"{name}.png")
    js = os.path.join(out_dir, f"{name}.json")
    sheet.save(png, optimize=True)
    with open(js, "w", encoding="utf-8") as f:
        json.dump({"frames": meta_frames, "meta": {
            "app": "VAC Online tools/art/pack_atlas.py", "image": f"{name}.png",
            "format": "RGBA8888", "size": {"w": sheet.width, "h": sheet.height}, "scale": "1",
        }}, f, ensure_ascii=False, indent=1)
    return png, js, len(images)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("src", help="Thư mục lô, vd art/source/wave1")
    parser.add_argument("--name", required=True, help="Tên atlas, vd wave1")
    parser.add_argument("--out-dir", default="public/assets/atlas")
    args = parser.parse_args()
    png, js, n = pack(args.src, args.name, args.out_dir)
    print(f"Đã đóng {n} khung → {png} + {js}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
