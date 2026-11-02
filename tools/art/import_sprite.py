#!/usr/bin/env python3
"""Nhập 1 ảnh (do ChatGPT / Gemini / API tạo, hoặc vẽ tay) thành sprite đúng chuẩn 05_MASTER_ART.

  python3 tools/art/import_sprite.py art/source/inbox/lua_chin.png --id CROP_01 --stage 3
  python3 tools/art/import_sprite.py in.png --id ANI_01 --stage 2 --size 48x48 --out-dir art/source/wave1

Các bước:
  1. Tách nền: màu #FF00FF (chroma key) — hoặc màu ở 4 góc ảnh khi dùng --bg corner — thành trong suốt.
  2. Cắt sát phần hình, thu nhỏ về lưới logic (mặc định 48x48, chừa 1px viền) giữ tỉ lệ, neo đáy giữa.
  3. Khóa bảng 64 màu (art/palette/vac_base.gpl) + alpha chỉ 0/255 (pixel art không có nửa trong suốt).
  4. Viền ấm chọn lọc #3D2314 quanh hình; mọi pixel đen/gần đen cũng đổi sang #3D2314.
Kết quả: <out-dir>/<ID>/<stage>.png — sau đó chạy tools/art/pack_atlas.py để đóng atlas.
"""
import argparse
import os
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from recolor_outline import WARM_OUTLINE, load_gpl, recolor, snap_to_palette  # noqa: E402

DEFAULT_PALETTE = os.path.join(os.path.dirname(__file__), "..", "..", "art", "palette", "vac_base.gpl")
CHROMA = (0xFF, 0x00, 0xFF)


def _dist2(a: tuple[int, int, int], b: tuple[int, int, int]) -> int:
    return sum((x - y) ** 2 for x, y in zip(a, b))


def remove_background(img: Image.Image, mode: str, tolerance: int) -> Image.Image:
    rgba = img.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    if mode == "corner":
        corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
        keys = [c[:3] for c in corners if c[3] > 0]
    else:
        keys = [CHROMA]
    tol2 = tolerance * tolerance
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 0 and any(_dist2((r, g, b), k) <= tol2 for k in keys):
                px[x, y] = (0, 0, 0, 0)
    return rgba


def fit_to_grid(img: Image.Image, size: tuple[int, int]) -> Image.Image:
    """Cắt sát hình rồi thu về khung size (chừa 1px mỗi bên cho viền), neo đáy giữa."""
    bbox = img.getbbox()
    if not bbox:
        raise ValueError("Ảnh trống sau khi tách nền — kiểm tra màu nền / --bg / --tolerance")
    art = img.crop(bbox)
    max_w, max_h = size[0] - 2, size[1] - 2
    scale = min(max_w / art.width, max_h / art.height)
    new = (max(1, round(art.width * scale)), max(1, round(art.height * scale)))
    resample = Image.Resampling.NEAREST if scale >= 1 else Image.Resampling.BOX
    art = art.resize(new, resample)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    canvas.paste(art, ((size[0] - new[0]) // 2, size[1] - 1 - new[1]), art)
    return canvas


def harden_alpha(img: Image.Image, cutoff: int = 128) -> Image.Image:
    px = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            px[x, y] = (r, g, b, 255) if a >= cutoff else (0, 0, 0, 0)
    return img


def add_outline(img: Image.Image, color: tuple[int, int, int] = WARM_OUTLINE) -> Image.Image:
    """Viền 1px (4 hướng) màu ấm quanh mọi pixel đặc."""
    src = img.load()
    out = img.copy()
    dst = out.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            if src[x, y][3] > 0:
                continue
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and src[nx, ny][3] > 0:
                    dst[x, y] = (*color, 255)
                    break
    return out


def process(img: Image.Image, size: tuple[int, int], palette: list[tuple[int, int, int]],
            bg: str = "chroma", tolerance: int = 90, outline: bool = True) -> Image.Image:
    rgba = remove_background(img, bg, tolerance) if bg != "none" else img.convert("RGBA")
    rgba = harden_alpha(fit_to_grid(rgba, size))
    rgba, _ = recolor(rgba, 24)
    rgba, _ = snap_to_palette(rgba, palette)
    if outline:
        rgba = add_outline(rgba)
    return rgba


def parse_size(s: str) -> tuple[int, int]:
    w, h = s.lower().split("x")
    return int(w), int(h)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("image")
    parser.add_argument("--id", required=True, help="ID thực thể trong GAME_CATALOG, vd CROP_01")
    parser.add_argument("--stage", type=int, required=True, choices=[0, 1, 2, 3],
                        help="Giai đoạn lớn: 0 mầm/trứng, 1 non, 2 lớn, 3 chín/thu hoạch")
    parser.add_argument("--size", default="48x48", help="Kích thước logic (05: cây/vật nuôi 48x48, nhân vật 48x64, icon 32x32)")
    parser.add_argument("--bg", choices=["chroma", "corner", "none"], default="chroma")
    parser.add_argument("--tolerance", type=int, default=90, help="Độ lệch màu nền chấp nhận (mặc định 90)")
    parser.add_argument("--palette", default=DEFAULT_PALETTE)
    parser.add_argument("--out-dir", default="art/source/wave1")
    args = parser.parse_args()

    result = process(Image.open(args.image), parse_size(args.size), load_gpl(args.palette), args.bg, args.tolerance)
    out_dir = os.path.join(args.out_dir, args.id)
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, f"{args.stage}.png")
    result.save(out)
    print(f"OK {args.image} → {out} ({result.width}x{result.height}, 64 màu, viền #3D2314)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
