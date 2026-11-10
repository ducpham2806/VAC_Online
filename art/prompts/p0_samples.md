# Prompt 5 sprite mẫu P0-2 — hướng mới (đi bộ + 4 mùa) · cho PO tự tạo bằng ChatGPT / Gemini

Theo `docs/05_ART_AUDIO.md` AR-11, AR-20, AR-30 và QD-33 (không dùng API key).
- **Mẫu vẽ bằng code** để đối chiếu khung và kích thước: `art/source/p0_samples/preview_x4.png` (`python3 tools/art/codeart_p0_samples.py`).
- **Ảnh AI** chỉ cần đúng chủ thể, đúng góc nhìn, nền đặc `#FF00FF`. Tách nền, thu về đúng khung, khóa 64 màu, viền `#3D2314` là việc của bước hậu kỳ.

## Cách làm
1. Gửi **Prompt chung** + mẫu 1 (Lúa). Chọn ảnh ưng nhất làm **ảnh mẫu phong cách**.
2. Với các mẫu 2–5: đính kèm ảnh mẫu phong cách, thêm câu "Giữ đúng phong cách ảnh đính kèm".
3. Đặt tên file như cột "Tên file" bên dưới, bỏ vào `art/source/inbox/`, đẩy lên repo hoặc gửi trong chat.
4. Claude nhập ảnh bằng `tools/art/import_sprite.py`, chạy `/vac-asset-audit`, rồi ghép vào wireframe để anh duyệt.

## Prompt chung
```
Cozy Vietnamese countryside pixel art game sprite, in the spirit of classic top-down farming life-sim games
but with an original Vietnamese look (nón lá, bamboo, rice paddies). Camera: 3/4 top-down oblique (about 45°).
Subject: [CHỦ THỂ].
Chunky readable pixel art, flat shading with 2–3 tones per color, warm dark-brown outline (#3D2314), never pure black.
Warm cheerful palette. Solid flat magenta background #FF00FF, no gradient, no text, no border, nothing cut off.
```

## 5 mẫu
| # | Tên file | [CHỦ THỂ] | Khung cuối |
|---|---|---|---|
| 1 | `CROP_01_sheet.png` | rice plant (Vietnamese paddy rice) in 4 growth stages left to right: seedling, young green tillers, green flowering panicles, ripe golden drooping panicles; each on a small patch of mud | 4 × 32×48 |
| 2 | `ANI_01_sheet.png` | a small brown-orange Vietnamese village hen (gà ri), 2 frames left to right: standing, pecking grain | 2 × 48×48 |
| 3 | `AQUA_01_sheet.png` | a climbing perch fish (cá rô đồng), grey-olive with dark stripes, side view swimming, 2 frames tail left / tail right | 2 × 32×32 |
| 4 | `farmer_walk_sheet.png` | young Vietnamese farmer wearing nón lá, teal áo bà ba, grey trousers; walk cycle 4 frames per row; rows: facing down, up, left, right; feet planted on one ground line | 16 × 48×64 |
| 5 | `tiles_sheet.png` | 4 square ground tiles side by side, seamless edges: dry tilled soil rows, wet tilled soil, spring green grass with tiny flowers, winter dry yellow-brown grass (northern Vietnam, no snow) | 4 × 32×32 |

Ô đất mùa Đông (mẫu 5) không có tuyết: Đông miền Bắc là cỏ úa, đất khô (AR-11).
