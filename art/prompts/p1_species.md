# Prompt ảnh P1-9: 4 cây, vịt, Bếp Củi, 2 món ăn · cho PO tự tạo bằng ChatGPT / Gemini

Theo `docs/05_ART_AUDIO.md` AR-01, AR-11, AR-20, AR-21 và QD-80, QD-86. Lúa (`CROP_01`), gà (`ANI_01`), cá rô (`AQUA_01`) đã có từ P0-2, không vẽ lại.
- **Ảnh AI** chỉ cần đúng chủ thể, đúng góc nhìn, đúng số khung, nền đặc `#FF00FF`. Tách nền, thu về đúng khung, khóa 64 màu, viền ấm là việc của hậu kỳ (`tools/art/import_sheet.py`).
- **Mùa:** chỉ vẽ một bản; game tự đổi tông theo mùa (AR-11).

## Cách làm
1. Mở ChatGPT/Gemini, **đính kèm 2 ảnh mẫu phong cách**: `art/source/inbox/CROP_01_sheet.png` (cho ảnh 1–4) hoặc `art/source/inbox/ANI_01_sheet.png` (cho ảnh 5), và `art/source/inbox/house_sheet.png` (cho ảnh 6–7).
2. Gửi **Prompt chung** + một dòng [CHỦ THỂ] ở bảng dưới. Mỗi ảnh một lượt.
3. Đặt tên file đúng cột "Tên file", bỏ vào `art/source/inbox/`, đẩy lên repo.
4. Claude nhập, chạy `/vac-asset-audit`, thay vào `?p1`, chụp màn hình để anh duyệt.

## Prompt chung
```
Cozy Vietnamese countryside pixel art game sprite sheet, same style, palette and outline as the attached reference images
(original Vietnamese look, not copied from any existing game). Camera: 3/4 top-down oblique (about 45°), same as the references.
Northern Vietnam (Red River Delta) village.
Subject: [CHỦ THỂ].
Frames laid out left to right in one row, equal width, same scale, same ground line, generous empty space between frames.
Chunky readable pixel art, flat shading with 2–3 tones per color, warm dark-brown outline (#3D2314), never pure black.
Solid flat magenta background #FF00FF, no gradient, no shadow on the background, no text, no labels, no border, nothing cut off.
```

## 7 ảnh
| # | Tên file | [CHỦ THỂ] | Khung cuối |
|---|---|---|---|
| 1 | `CROP_02_sheet.png` | water spinach (rau muống) in 4 growth stages: tiny sprouts, short green runners, bushy clump of hollow stems with arrow-shaped leaves, big lush harvest-ready clump. No soil mound | 4 × 32×48 |
| 2 | `CROP_03_sheet.png` | sticky corn (ngô nếp) in 4 growth stages: seedling, knee-high leafy stalk, tall stalk with tassel, tall stalk with 2 ripe white-yellow cobs in green husks with brown silk. No soil mound | 4 × 32×48 |
| 3 | `CROP_04_sheet.png` | spring onion and coriander (hành lá & rau mùi) growing together in 4 stages: tiny sprouts, thin green shoots, taller hollow onion leaves beside feathery coriander, dense harvest-ready clump. No soil mound | 4 × 32×48 |
| 4 | `CROP_05_sheet.png` | Vietnamese mustard greens (cải ngọt / cải xanh) in 4 stages: tiny sprouts, small rosette, medium leafy rosette, big tender green rosette ready to harvest. No soil mound | 4 × 32×48 |
| 5 | `ANI_03_sheet.png` | a small Vietnamese field duck (vịt cỏ), brown-speckled feathers, orange bill and feet, 2 frames: standing, dabbling with head down | 2 × 48×48 |
| 6 | `kitchen_sheet.png` | a small open-air Vietnamese wood-fire kitchen hut (bếp củi): low thatched roof on 4 bamboo posts, a clay three-stone stove with a clay pot, a stack of firewood. 2 frames. LEFT = broken: roof collapsed, posts leaning, stove cracked, no pot, cold ashes. RIGHT = repaired: fresh thatch, upright posts, clay pot on the stove with a little fire and steam | 2 × 64×64 |
| 7 | `dishes_sheet.png` | 2 dish icons, front 3/4 view: (1) a bowl of steaming white rice in a blue-white ceramic bowl with chopsticks; (2) a bowl of mustard-green soup with climbing perch fish (canh cải cá rô) | 2 × 32×32 |

## Ghi chú
- Ảnh 1–4: cây đứng trên ô đất 32×32, phần lá được nhô cao hơn ô (khung 32×48), giống lúa.
- Ảnh 5: vịt thu về ~40×40 trong khung 48×48 như gà (QD-82). Vịt bơi ở mép ao.
- Ảnh 6: Bếp Củi chiếm 2×2 ô cạnh nhà chính. Hai khung phải cùng góc, cùng vị trí, cùng kích thước.
- Ảnh 7: icon dùng trong Kho, bảng nấu và đơn HTX.
- Nếu AI vẽ các khung to nhỏ khác nhau, yêu cầu lại: "keep all frames at the same pixel scale as the reference images".
