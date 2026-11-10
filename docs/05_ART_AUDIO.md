# 05 · Art & âm thanh

**Sở hữu:** phong cách, palette, góc nhìn, kích thước, viền, hoạt ảnh, VFX, âm thanh, pipeline asset.
**Không chứa:** danh sách thực thể (dữ liệu), số lượng asset từng pha (`07`), bố cục màn hình (`06`).
Kiểm tự động: `/vac-asset-audit`, `npm run test:art`, `src/data/palette.test.ts`.

### AR-01 · Phong cách
- Pixel art ấm áp kiểu nông trại cổ điển, đặt trong làng quê Việt: tre, rơm, ngói, gỗ lim, ao sen.
- Góc nhìn 3/4 top-down. Nhân vật chibi khoảng 2 đầu thân.
- Cảm giác "chiều quê": nắng vàng, bóng ấm, không dùng màu neon. Chỉ tham khảo thể loại (TQ-02); không sao chép hình của game khác.

### AR-10 · Palette (QD-07)
- **Nguồn duy nhất:** `art/palette/vac_base.gpl`, 64 màu.
  - Viền/bóng 4 màu: `#3D2314`, `#1B3B2B`, `#23192D`, `#2A180C`.
  - Còn lại: gỗ/tre/giấy, lá, nước, đất, da, đỏ/cam, vàng lúa, hồng/tím, đá, trời, trắng.
- **Cấm `#000000`.** `#FF00FF` chỉ dùng làm nền để tách.
- VFX cũng chỉ dùng 64 màu này. Các màu VFX cũ ngoài bảng (`#4DD0E1`, `#FFEB3B`, `#90E0EF`, `#D9ED92`, `#FF9F1C`) đổi sang màu gần nhất trong bảng.
- Mỗi miền có 4 màu chủ đạo, chọn từ trong bảng:
  - **Bắc:** `#7FB800`, `#C85A32`, `#5C6B73`, `#F4A7B9`.
  - **Trung:** `#F5B700`, `#5E4B56`, `#8D3B24`, `#2EC4B6`.
  - **Nam:** `#8AC926`, `#C99E67`, `#FFB703`, `#2E8B8D`.
- Màu giao diện HTML không bắt buộc theo bảng.

### AR-11 · Mùa trên bản đồ (QD-14)
- **4 bộ tile theo mùa** cho cỏ, tán cây, đường, ao, cảnh.
  - Làm bằng **đổi màu trong palette** (cùng hình, khác bảng con) để giảm khối lượng.
  - Đông của miền Bắc: cỏ úa, ao đục, cây trơ cành; không có tuyết.
- **Cây trồng:** cây đang lớn khi hết mùa vẫn thu được (GP-20), không cần hình héo. Có 1 hình "đất trống vụ sau".

### AR-20 · Lưới và kích thước
| Loại | Kích thước | Ghi chú |
|---|---|---|
| Lưới bản đồ, ô đất trồng | 32×32 | Mỗi ô trồng 1 cây (GP-11). Ô đất 168×80 kiểu cũ bỏ (QD-27) |
| Nhân vật người | 48×64 | Neo `(0,5, 0,95)` (khớp `player.ts`) |
| Vật nuôi | 48×48 | Neo đáy |
| Cây trồng 4 giai đoạn | khung 32×48, neo đáy | Đường ống `import_sprite.py` (hiện là 48×48, đổi khi làm lại) |
| Icon, vật phẩm, công cụ | 32×32 | |
| Công trình | bội số 32, chiều ngang 96–224 | Kích thước chính xác ghi trong manifest asset, không ghi ở đây |
| Bằng khen xuất PNG | 960×540 | |

- Alpha chỉ 0 hoặc 255, không dithering, phóng to kiểu `nearest`.
- Sắp lớp theo trục y (vật ở dưới vẽ đè lên vật ở trên).

### AR-21 · Viền
Viền ấm chọn lọc theo chất liệu:
- `#3D2314`: gỗ, thân cây, nhân vật;
- `#1B3B2B`: tán lá, bờ ao;
- `#23192D`: bóng đổ.

Hậu kỳ bắt buộc: `tools/art/recolor_outline.py --check` phải ra 0 pixel đen.

### AR-30 · Hoạt ảnh
- **Vòng lặp:** 8–12 frame ở 8–15 FPS. Chân bám đất (planted feet).
- **Nhân vật người chơi** (4 hướng, 8 frame mỗi clip): đứng, đi, cuốc, tưới, gặt (liềm), rìu/búa, câu cá, cho ăn, cầm đồ.
- **Vật nuôi:** đứng, đi, ăn, vui.
- **NPC:** đứng, đi, nói chuyện. Thợ làm việc thì thêm clip làm việc.
- **Cây:** 4 giai đoạn (hạt → non → ra hoa/trái xanh → chín) + biến thể Hoàng Kim.
- **Phản hồi chạm:** tween `scaleX 1,07 / scaleY 0,92` trong 90 ms + 6–12 hạt + âm thanh.
- **Cảnh:** sóng lúa và mặt nước lệch pha theo vị trí.

### AR-31 · VFX
- **Tối thiểu cho Đợt 1:** giọt nước (8×8), sao Hoàng Kim (6×6), mưa (2×12), đom đóm (8×8).
- **Đợt sau:** khói bếp, sao món ngon, hơi tàu, cảnh báo trộm, hào quang đột biến, pháo giấy cưới, lửa bánh chưng.
- Code: `src/game/vfx/farmVfx.ts`.

### AR-40 · Âm thanh (WebAudio tổng hợp, không file ngoài)
- **Chuỗi xử lý:** lọc thấp 2.950 Hz (Q 0,7); không dùng sóng vuông/răng cưa thô; vọng stereo 190 ms, phản hồi 22%, độ trộn 18%. Gọi `resume()` ở lần chạm đầu.
- **Nhạc cụ:** đàn tranh/kalimba gảy, sáo trúc (LFO 5,2 Hz), chuông celesta, tiếng chim.
- **Nhạc nền ngũ cung:** sáng, trưa, đêm, lễ hội. Thêm **4 chủ đề theo mùa** (mới).
- **SFX có sẵn:** 16 tiếng (tưới, thu tiền, Hoàng Kim, gieo, click phách tre, lật trang, xào nấu, vật nuôi, chó sủa, còi tàu, đập niêu, cồng, mưa, va chạm, chém, lên cấp).
- **SFX cần thêm:** bước chân theo nền (đất/cỏ/gỗ), cuốc, liềm, rìu, cần câu.
- Code: `src/services/soundEffects.ts`.

### AR-50 · Pipeline asset
1. **Ảnh gốc:** plugin `agent-sprite-forge` (`generate2dsprite`, `video2dsprite` cho hoạt ảnh nhân vật, `generate2dmap` cho tilemap) hoặc ảnh PO tự tạo bỏ vào `art/source/inbox/`.
   - Prompt mẫu: `art/prompts/`.
   - Nguồn ảnh: QD-33 (không dùng API key), QD-80 (PO tự tạo bằng ChatGPT/Gemini).
2. **Chuẩn hóa:** `tools/art/import_sprite.py` (1 ảnh → 1 khung) hoặc `tools/art/import_sheet.py` (1 tấm nhiều khung, chung tỉ lệ thu, thu bằng màu đa số); cả hai tách `#FF00FF`, alpha 0/255, khóa palette, viền ấm.
   - Ảnh AI hay sai hướng (cả 2 hàng trái/phải cùng quay phải) và vẽ khung tối quanh ô nền: script lật gương hàng trái và cắt mép ô.
3. **Đóng gói:** `tools/art/pack_atlas.py` → `public/assets/atlas/<lô>.png/.json`. Phaser đặt tên khung `<ID>_<giai đoạn>`.
4. **Kiểm:** `/vac-asset-audit`. Mẫu hướng hình theo chuẩn này: `tools/art/codeart_p0_samples.py` → `art/source/p0_samples/` (lúa 4 giai đoạn 32×48, gà 48×48, cá 32×32, nhân vật đi 4 hướng × 4 khung, ô đất/cỏ 2 mùa); prompt cho ảnh thật: `art/prompts/p0_samples.md`; ảnh thật đã nhập: `art/source/p0_ai/` (`preview_x4.png`, cảnh ghép `scene_x3.png`). Thiếu khung thì game dùng hình vẽ bằng code (`codeart_*.py`).
5. **Chỉ làm art cho miền đang mở** (QD-15). 30% đặc sản của miền khác làm khi mở miền đó.
