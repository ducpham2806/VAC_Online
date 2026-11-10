# Prompt ảnh P1: cây đa, bụi tre, đá, cỏ dại, rào · cho PO tự tạo bằng ChatGPT / Gemini

Theo `docs/05_ART_AUDIO.md` AR-01, AR-11, AR-20, AR-21 và QD-80. Thay nốt hình tạm (atlas `world`) của bản thử `?p1` trước khi chơi thử (P1-12).
- **Ảnh AI** chỉ cần đúng chủ thể, đúng góc nhìn, đúng số hình, nền đặc `#FF00FF`. Tách nền, thu về đúng khung, khóa 64 màu, viền ấm là việc của hậu kỳ (`tools/art/import_sheet.py`).
- **Mùa:** chỉ cần vẽ mùa Xuân. Game tự đổi tông tán lá theo mùa (Hạ xanh đậm, Thu ngả vàng, Đông xỉn màu, không tuyết, AR-11).

## Cách làm
1. Mở ChatGPT/Gemini, **đính kèm 2 ảnh mẫu phong cách**: `art/source/inbox/house_sheet.png` và `art/source/inbox/farmer_walk_sheet.png`.
2. Gửi **Prompt chung** + một dòng [CHỦ THỂ] ở bảng dưới. Mỗi ảnh một lượt.
3. Đặt tên file đúng cột "Tên file", bỏ vào `art/source/inbox/`, đẩy lên repo (như lần trước) hoặc gửi trong chat.
4. Claude nhập, chạy `/vac-asset-audit`, thay vào `?p1`, chụp màn hình để anh duyệt.

## Prompt chung
```
Cozy Vietnamese countryside pixel art game sprite sheet, same style, palette and outline as the attached reference images
(original Vietnamese look, not copied from any existing game). Camera: 3/4 top-down oblique (about 45°), same as the references.
Northern Vietnam (Red River Delta) village, spring.
Subject: [CHỦ THỂ].
Objects laid out left to right in one row, same scale, same ground line, generous empty space between them.
Chunky readable pixel art, flat shading with 2–3 tones per color, warm dark-brown outline (#3D2314) on wood and trunks,
dark green outline (#1B3B2B) on leaves, never pure black. No cast shadow on the background.
Solid flat magenta background #FF00FF, no gradient, no text, no labels, no border, nothing cut off.
```

## 5 ảnh
| # | Tên file | [CHỦ THỂ] | Khung cuối |
|---|---|---|---|
| 1 | `tree_sheet.png` | one big old Vietnamese village banyan tree (cây đa): wide dense rounded canopy in fresh spring green, thick gnarled trunk with a few hanging aerial roots, big roots spreading on the ground, a little tuft of grass at the base. 1 object only | 1 × 96×112 |
| 2 | `bamboo_sheet.png` | 2 clumps of Vietnamese village bamboo (lũy tre) used as a living hedge: tall slender green-yellow culms with feathery leaves leaning slightly, dense at the base. Two slightly different clumps | 2 × 48×96 |
| 3 | `rock_sheet.png` | 3 field boulders of grey laterite-and-granite stone that block farmland, each a different shape (round, flat, two stacked), with small cracks, a little moss and grass at the base | 3 × 40×32 |
| 4 | `weeds_sheet.png` | 3 small tufts of wild weeds on fallow land: spiky green grass tuft, tuft with tiny yellow flowers, dry yellow-brown grass tuft | 3 × 20×16 |
| 5 | `fence_sheet.png` | 2 horizontal segments of a woven bamboo village fence (hàng rào tre), seen from the front at 3/4 top-down: vertical split-bamboo stakes tied to two horizontal bamboo rails with rope, both ends cut straight so segments join seamlessly side by side. Segment A plain, segment B with one slightly taller stake | 2 × 64×32 |

## Ghi chú
- Ảnh 1: một gốc cây chiếm 3×3 ô trên bản đồ. Người chơi chặt gốc này để lấy Gỗ (KT-18). Cây đa là cây thiêng của làng Việt, chặt có thể gây phản cảm. Nếu anh muốn tránh, thay dòng [CHỦ THỂ] bằng: `one big old half-dead chinaberry tree (cây xoan già) with a thick gnarled trunk, sparse canopy and some dry branches`.
- Ảnh 2: bụi tre dựng dọc 2 mép trái, phải của điền trang.
- Ảnh 3: đá chiếm 1 ô; dọn được để lấy Đá.
- Ảnh 4: cỏ dại rải trên đất hoang chưa khai, và cạnh hạng mục đổ nát.
- Ảnh 5: rào chạy dọc mép trên, mép dưới điền trang và quanh sân chuồng gà; hai đầu mỗi đoạn phải khớp nhau khi ghép liền.
- Nếu AI vẽ các hình to nhỏ khác nhau quá, yêu cầu lại: "keep all objects at the same pixel scale as the reference images".
