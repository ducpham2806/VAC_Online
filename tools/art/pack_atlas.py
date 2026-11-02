#!/usr/bin/env python3
"""Đóng các sprite art/source/<lô>/<ID>/<stage>.png thành 1 atlas Phaser (JSON Hash).

  python3 tools/art/pack_atlas.py art/source/wave1 --name wave1
  → public/assets/atlas/wave1.png + public/assets/atlas/wave1.json   (khung tên "<ID>_<stage>")

Mọi khung phải cùng kích thước (mặc định 48x48); xếp thành lưới, cách nhau 2px để tránh lem khi zoom.
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
            continue
        for f in sorted(os.listdir(d)):
            stem, ext = os.path.splitext(f)
            if ext.lower() == ".png" and stem.isdigit():
                frames.append((f"{entity}_{stem}", os.path.join(d, f)))
    return frames


def pack(src: str, name: str, out_dir: str) -> tuple[str, str, int]:
    frames = collect(src)
    if not frames:
        raise ValueError(f"Không có sprite nào trong {src} (cần <ID>/<stage>.png)")
    images = [(n, Image.open(p).convert("RGBA")) for n, p in frames]
    fw, fh = images[0][1].size
    for n, im in images:
        if im.size != (fw, fh):
            raise ValueError(f"Khung {n} có kích thước {im.size}, khác {fw}x{fh}")
    cols = math.ceil(math.sqrt(len(images)))
    rows = math.ceil(len(images) / cols)
    sheet = Image.new("RGBA", (cols * (fw + PADDING), rows * (fh + PADDING)), (0, 0, 0, 0))
    meta_frames = {}
    for i, (n, im) in enumerate(images):
        x, y = (i % cols) * (fw + PADDING), (i // cols) * (fh + PADDING)
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
