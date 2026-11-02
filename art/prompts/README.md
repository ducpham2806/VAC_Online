# Prompt mẫu cho agent-sprite-forge (chuẩn `05_MASTER_ART`)

Dùng với skill `generate2dsprite` (ảnh tĩnh, sprite sheet) và `video2dsprite` (chuyển động).
Plugin chỉ hiểu hướng mặt trái/phải/trước/sau, nên **góc nhìn 3/4 top-down phải ghi rõ trong prompt**
và luôn đưa thêm 1 ảnh tham chiếu style (ảnh thứ hai) là sprite đã duyệt hoặc key art `image.png`.

## Thông số cố định
| Mục | Giá trị |
|---|---|
| Finish | `pixel` |
| Palette | `art/palette/vac_base.gpl` — 64 màu đã chốt (`05` mục 1.3); khóa màu: `tools/art/recolor_outline.py --palette art/palette/vac_base.gpl` |
| Nền tách | chroma key `#FF00FF` |
| Kích thước | nhân vật `48x64`, ô đất `168x80`, icon / vật phẩm `32x32` |
| Animation | 8–12 frame, chân bám đất (planted feet), neo `(0.5, 0.9)` |
| Viền | ấm `#3D2314` (lá: `#1B3B2B`, bóng: `#23192D`); **không** `#000000` |

## Mẫu: cây trồng 4 giai đoạn (ví dụ `CROP_01` Lúa Nước — Đợt 1)
```
Cozy Vietnamese countryside pixel art, 3/4 top-down oblique camera (45°), single crop plant
"rice paddy (Lúa Nước Tẻ Thơm)", 4 growth stages left-to-right: seedling, young, flowering, ripe golden.
Each stage centered in a 32x32 logical cell, warm brown outline #3D2314 (never pure black),
limited palette, flat shading with 2-3 tones, soft drop shadow #23192D, solid #FF00FF background.
```

## Mẫu: nhân vật (Điền chủ — dùng cho video2dsprite)
```
Cozy Vietnamese farmer, 3/4 top-down oblique view, wearing nón lá and áo bà ba, 48x64 logical pixels,
warm brown outline #3D2314, limited palette, feet planted on a fixed ground line, solid #FF00FF background.
Actions: Idle, Walk (4 directions), Water, Harvest — 8–12 frames each, seamless loop.
```

## Sau khi xuất
```bash
python3 tools/art/recolor_outline.py <file>.png --out <file>.png   # đổi viền đen → #3D2314
python3 tools/art/recolor_outline.py <file>.png --check            # phải in OK
```
Lưu nguồn tại `art/source/<wave>/<entity_id>/`; chỉ atlas đã duyệt mới vào `public/assets/atlas/`.
