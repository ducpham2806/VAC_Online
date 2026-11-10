# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 11/11/2026 · P1-9 bắt đầu (QD-86 PO duyệt 8 loài) · claude/gifted-faraday-2q851c
- PO duyệt bộ 8 loài Xuân + Thu → QD-86. Code: `src/data/sliceContent.ts` (8 loài, 2 món, 2 mùa); `sowableSeeds` chỉ còn 5 cây bản thử (Hạ: Lúa, Rau Muống; Đông: Ngô, Hành, Cải).
- Prompt 7 ảnh mới: `art/prompts/p1_species.md` (4 cây, vịt, Bếp Củi đổ nát/đã sửa, 2 món).
- Kiểm: typecheck, 273 test (+2) PASS.
- Phát hiện: dữ liệu chưa có luật cho vật nuôi ăn cám (Cối Xay Cám hoãn); Bếp Củi khóa ở Giai đoạn 2 (`CRAFT_MIN_STAGE`); cấp mở của Cải/Bếp (Lv4), Vịt (Lv6) xa so với XP bản thử.
- **Dừng ở:** chờ PO duyệt đề xuất số liệu Bếp Củi, chỗ nuôi, bảng đơn HTX (đã gửi trong chat); chờ 7 ảnh.

## 11/11/2026 · Nhập 6 ảnh P1 của PO (nhà, giếng, chuồng gà, NPC, chân dung) · claude/gifted-faraday-2q851c
- PO đẩy 6 ảnh lên `main` (`9450a80`); gộp `main` vào nhánh. `import_sheet.py --p1` → `art/source/p1_ai/` 17 khung (0 lạc bảng, 0 pixel đen, alpha 0/255, đúng cỡ AR-20) → atlas `public/assets/atlas/estate.*`; chân dung → `public/assets/portraits/`.
- `?p1`: nhà/giếng/chuồng gà đổi khung đổ nát → đã sửa (bỏ tô tối), chuồng gà tre đặt ở góc sân; Bác Bảy, Cô Hương dùng ảnh mới (2 khung đứng, 2 khung nói khi mở hộp thoại); chân dung trong hộp thoại NPC và cảnh mở đầu (Bá Kiến).
- Kiểm: typecheck, 270 test, build, test:art, check:docs PASS; smoke 2 cỡ + người mới theo hướng dẫn (844×390) PASS, 0 lỗi JS, 0 nút < 44 px. Ảnh: `docs/screenshots/p1-art-estate-{broken,repaired}-1280x720.png`.
- 11/11 (tiếp): nhập thêm 5 ảnh thiên nhiên (`580bca3`): cây đa, 2 bụi tre, 3 đá, 3 cỏ dại, 2 đoạn rào → atlas `estate` 28 khung (0 lạc bảng, 0 pixel đen). Rào AI vẽ xéo → `import_sheet.py` thêm `shear` nắn rail thành ngang; scene ghép rào chồng mép 6 px, dàn đều khớp mép. `?p1` bỏ hẳn atlas `world`. Smoke 2 cỡ + người mới PASS, 0 lỗi JS, 0 nút < 44 px.
- 11/11 (tiếp 2): PO yêu cầu NPC +15% → QD-85, NPC nhập lại ở khung 56×74 (không phóng trong game, giữ nét pixel). PO tạo lại rào (vẽ thẳng, bỏ `shear`) và gửi cây xoan (`48edc92`, `7b73099`): gốc cây chặt lấy Gỗ đổi sang xoan già; cây đa thành 1 cây cổ thụ đầu làng `D` (góc trên phải, chắn lối, chạm thì nhắc không chặt). Atlas `estate` 29 khung, 0 lạc bảng, 0 pixel đen. 271 test; smoke 2 cỡ + người mới PASS. Ảnh: `docs/screenshots/p1-art-trees-1280x720.png`.
- **Dừng ở:** P1-9 (chờ duyệt 8 loài), P1-8 (chờ quyền Supabase).

## 10/11/2026 · P1-11 DONE (QD-84 PO duyệt) · claude/gifted-faraday-2q851c
- PO duyệt QD-84 theo đề xuất. Ghi `03` KT-19 (mới), `01` GP-50, GP-62, `02` TG-40, `04` KY-90.
- Code: `src/domain/npc.ts` (tim, nói chuyện, tặng quà theo ngày giờ VN), `src/domain/story.ts` (chọn hướng, Chương 1, thưởng từ `src/data/quests.ts`), `src/data/npcs.ts`; engine thêm `TALK`/`GIFT`/`CHOOSE_PATH`/`CLAIM_CHAPTER`; `sliceTutorial.ts` 8 bước, mũi tên chỉ chỗ lấy vật liệu khi thiếu; HUD `SliceStoryHud.tsx` (cảnh mở đầu, thanh hướng dẫn chạm xuyên, hộp thoại NPC, Sổ Gia Phả); NPC trên bản đồ có 💬. Bản lưu version 3 (đọc được v1, v2).
- Kiểm: typecheck, 270 test (+20), build, test:art, check:docs PASS. `tools/qa/p1-tutorial-smoke.cjs` (mới) 2 cỡ: người mới theo đúng thanh hướng dẫn đi hết 8 bước rồi nhận Chương 1, không kẹt, 0 lỗi JS (cho lúa chín ngay). `p1-slice-smoke.cjs` 2 cỡ: thêm cảnh mở đầu, Gia Phả, tặng quà, nhận Chương 1; 0 nút < 44 px.
- Sửa trong lúc kiểm: thanh hướng dẫn che ruộng ở 844×390 → cho chạm xuyên. Lưu ý: chạy kiểm khói thì đừng sửa file khi Vite đang chạy (Vite tải lại trang).
- **Dừng ở:** P1-9 chờ PO duyệt 8 loài; P1-8 chờ quyền Supabase; sau đó P1-12 chơi thử.
