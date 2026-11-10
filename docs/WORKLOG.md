# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 11/11/2026 · P1-9 code xong (QD-87 PO duyệt) · claude/gifted-faraday-2q851c
- PO duyệt QD-87. Ghi `03` KT-14 (đơn HTX), KT-18 (Bếp Củi), KT-21 (mới: cấp mở riêng bản thử, chỗ nuôi, chưa cho ăn); `01` GP-13, GP-30, GP-40; `04` KY-90.
- Code: `src/domain/orders.ts` (bảng 3 đơn, hệ số 1,2/1,35/1,5, bỏ đơn chờ 10 phút); `estate.ts` thêm hạng mục `KITCHEN` (`K` cạnh nhà) + 9 chỗ nuôi (`COOP`/`POND`, chỗ gà mở khi sửa Chuồng); `cooking.ts` thêm `KitchenRules` tùy chọn; `plant` thêm cấp mở thay thế tùy chọn; engine `ctx.slice` + 7 thao tác (`COOK`, `COLLECT_DISH`, `EAT`, `DISCOVER`, `REFRESH_ORDERS`, `DELIVER_ORDER`, `SKIP_ORDER`); HUD `SliceKitchenHud.tsx` (bảng nấu + Nồi Đất, bảng đơn), Kho có nút Ăn; scene vẽ chỗ nuôi (khung mờ khi trống, biểu tượng khi tới lứa), bỏ gà/cá trang trí. Bản lưu v4.
- Kiểm: typecheck, 289 test (+16), build, check:docs PASS. Smoke cũ 2 cỡ + người mới (844×390) PASS. `tools/qa/p1-9-smoke.cjs` (mới) 2 cỡ: sửa chuồng → thả gà/vịt/cá → thu; sửa Bếp → nấu Cơm → lấy → Nồi Đất tìm Canh → ăn hồi ⚡; bảng 3 đơn → giao đúng thưởng → bỏ đơn; tải lại giữ; 0 nút < 44 px; 0 lỗi JS. Ảnh `docs/screenshots/p1-9-*`.
- `/vac-balance-check`: Lúa lãi/phút và XP/phút cao nhất (3,33🪙, 0,56 XP mỗi ô) — cây cấp cao kém cây cấp 1 (cần chạm nhiều hơn, chưa đo); Cơm bán lỗ 1🪙 so với bán Lúa, Canh lời 1🪙 (món dùng để hồi ⚡ và giao đơn); Sources/Sinks NOT ASSESSED — chưa có người chơi.
- **Dừng ở:** chờ 7 ảnh PO (`art/prompts/p1_species.md`); đang dùng hình tạm (atlas `wave1`, Bếp vẽ bằng code). Sau đó P1-8 (Supabase), P1-12.

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
