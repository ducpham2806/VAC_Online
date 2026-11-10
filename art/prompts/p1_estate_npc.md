# Prompt ảnh P1: nhà, giếng, chuồng gà, NPC · cho PO tự tạo bằng ChatGPT / Gemini

Theo `docs/05_ART_AUDIO.md` AR-01, AR-20, AR-21 và QD-80. Thay hình tạm của bản thử `?p1` trước khi chơi thử (P1-12).
- **Ảnh AI** chỉ cần đúng chủ thể, đúng góc nhìn, đúng số khung, nền đặc `#FF00FF`. Tách nền, thu về đúng khung, khóa 64 màu, viền `#3D2314` là việc của hậu kỳ (`tools/art/import_sheet.py`).
- Hạng mục điền trang có **2 khung cạnh nhau: trái = đổ nát, phải = đã sửa**. Hai khung phải cùng góc, cùng vị trí, cùng kích thước (game đổi khung khi người chơi sửa xong, GP-14).

## Cách làm
1. Mở ChatGPT/Gemini, **đính kèm ảnh mẫu phong cách** `art/source/inbox/farmer_walk_sheet.png` (anh đã tạo ở P0-2).
2. Gửi **Prompt chung** + một dòng [CHỦ THỂ] ở bảng dưới. Mỗi ảnh một lượt.
3. Đặt tên file đúng cột "Tên file", bỏ vào `art/source/inbox/`, đẩy lên repo hoặc gửi trong chat.
4. Claude nhập bằng `import_sheet.py`, chạy `/vac-asset-audit`, thay vào `?p1` và chụp màn hình để anh duyệt.

## Prompt chung
```
Cozy Vietnamese countryside pixel art game sprite sheet, same style as the attached reference image
(original Vietnamese look, not copied from any existing game). Camera: 3/4 top-down oblique (about 45°),
same as the reference. Northern Vietnam (Red River Delta) village.
Subject: [CHỦ THỂ].
Frames laid out left to right in one row, equal width, same scale, same ground line, generous empty space between frames.
Chunky readable pixel art, flat shading with 2–3 tones per color, warm dark-brown outline (#3D2314), never pure black.
Warm earthy palette. Solid flat magenta background #FF00FF, no gradient, no shadow on the background,
no text, no labels, no border, nothing cut off.
```

## 6 ảnh
| # | Tên file | [CHỦ THỂ] | Khung cuối |
|---|---|---|---|
| 1 | `house_sheet.png` | an old Northern Vietnamese three-room village house (nhà ngói ba gian): terracotta tile roof with curved ridge ends, wooden pillars and wooden panel doors, ochre plaster walls, low brick porch with two steps. 2 frames. LEFT = abandoned and ruined: roof with missing tiles and holes, sagging ridge, one door hanging off, cracked walls with moss, weeds and fallen tiles around the porch. RIGHT = the same house fully restored: complete clean red roof, doors closed, fresh walls, a red paper lantern by the door, a potted plant on the porch | 2 × 128×128 |
| 2 | `well_sheet.png` | a round village well built from red-ochre laterite stone blocks (giếng đá ong), with a small wooden frame, rope pulley and a wooden bucket. 2 frames. LEFT = broken: several stone blocks crumbled and fallen, wooden frame snapped, no bucket, dry and mossy. RIGHT = repaired: neat stone ring, dark water visible inside, frame upright with rope and bucket | 2 × 64×80 |
| 3 | `coop_sheet.png` | a small Vietnamese bamboo chicken coop hut with a thatched straw roof, raised on short bamboo legs, small ramp and door. 2 frames. LEFT = broken: roof thatch collapsed with holes, bamboo slats broken and leaning, ramp missing. RIGHT = repaired: fresh golden thatch, straight bamboo walls, ramp in place, a little straw nest visible | 2 × 96×96 |
| 4 | `npc_bacbay_sheet.png` | Uncle Bảy, an elderly Northern Vietnamese village chief (about 65), short white beard, dark-brown khăn xếp turban, brown traditional áo the jacket, light trousers, holding a bamboo walking cane, kind smile; full body facing the camera, feet planted on one ground line. 4 frames: idle breathing frame 1, idle breathing frame 2, talking with free hand raised, talking with a nod | 4 × 48×64 |
| 5 | `npc_cohuong_sheet.png` | Miss Hương, a young village school teacher (about 25), long black hair tied low, white áo dài with light-blue trousers, holding a book and a nón lá at her side, gentle smile; full body facing the camera, feet planted on one ground line. 4 frames: idle 1, idle 2, talking with book raised, talking with a small wave | 4 × 48×64 |
| 6 | `portraits_sheet.png` | 3 head-and-shoulders dialogue portraits, front view, same framing: (1) Uncle Bảy as in sheet 4, warm smile; (2) Miss Hương as in sheet 5, gentle smile; (3) Merchant Bá Kiến, stern middle-aged rich landlord, round face, thin mustache, dark-red brocade áo gấm and khăn xếp, holding a folded paper fan, cold skeptical look | 3 × 64×64 |

## Ghi chú
- Ảnh 1–3: ô chiếm chỗ trên bản đồ là nhà 4×3 ô, giếng 2×2 ô, chuồng gà trong sân 6×4 ô. Phần mái nhô cao hơn khung chân là bình thường.
- Ảnh 4–5: cùng cỡ người chơi (48×64), khung đầu là khung đứng yên dùng ngay ở bản thử; khung nói chuyện dùng khi mở hộp thoại.
- Ảnh 6: chân dung hiện trong hộp thoại NPC và cảnh mở đầu (TG-40). Bá Kiến chỉ cần chân dung ở P1.
- Nếu AI vẽ lệch giữa khung trái và phải (khác góc, khác cỡ), yêu cầu lại: "keep both frames identical in camera angle, size and position; only the condition changes".
