# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 11/11/2026 · P1-12 chuẩn bị chơi thử (QD-88) · claude/gifted-faraday-2q851c
- PO chọn: thu số liệu qua server sau P1-8; PO tự triển khai link (không có project Vercel cho VAC, tài khoản Vercel nối chỉ có nama-crm-hrm) → QD-88, kế hoạch `07` LT-13.
- Code: `src/game/slice/playtest.ts` (nhật ký ẩn danh `vac_slice_playtest_v1`: phiên, thao tác thành công theo loại, cấp, bước hướng dẫn; tối đa 3.000 sự kiện; mốc `sent` cho P1-8; gộp phiên mở 2 lần do StrictMode); `playtestMetrics.ts` (D1 theo giờ VN, phễu 8 bước, phiên đầu, cấp); `npm run playtest:report`; mã chơi thử ở ⚙️ Cài đặt.
- Kiểm: typecheck, 295 test (+6), build, check:docs PASS; smoke người mới 844×390: nhật ký đủ MOVE→DONE, 1 phiên; smoke p1-9 + slice 2 cỡ PASS, 0 lỗi JS, 0 nút < 44 px; bản build production (`vite preview`) chạy `?p1`, ghi sự kiện, không lộ công cụ dev.
- **Dừng ở:** chờ P1-8 (quyền Supabase VAC) để gửi sự kiện lên server; PO triển khai link + mời người chơi. Chưa có người chơi thử nào.

## 11/11/2026 · P1-9 DONE: nhập 7 ảnh loài mới của PO · claude/gifted-faraday-2q851c
- Gộp `main` (`9730ada`): Rau Muống, Ngô, Hành & Mùi, Cải (4 giai đoạn), vịt, Bếp Củi (đổ nát/đã sửa), 2 món.
- `import_sheet.py`: cây/vịt vào `art/source/p0_ai/` → atlas `slice` (48 khung, khung cũ giữ nguyên); Bếp + món vào `art/source/p1_ai/` → atlas `estate` (33 khung); icon món chép sang `src/assets/icons/PROD_01|03.png`. Thêm tách 2 hình chạm nhau trong cùng dải (Hành giai đoạn 3–4 chạm lá) + test (9 test art).
- HUD: icon món ở bảng nấu và Kho. 0 pixel đen, 0 lạc bảng.
- Kiểm: typecheck, 289 test, test:art, build, check:docs PASS; `p1-9-smoke.cjs` 2 cỡ PASS (thêm ảnh ruộng 5 cây), 0 lỗi JS, 0 nút < 44 px. Ảnh `docs/screenshots/p1-9-*`.
- **Dừng ở:** P1-8 (chờ quyền Supabase), rồi P1-12 chơi thử.

## 11/11/2026 · P1-9 code xong (QD-87 PO duyệt) · claude/gifted-faraday-2q851c
- PO duyệt QD-87. Ghi `03` KT-14 (đơn HTX), KT-18 (Bếp Củi), KT-21 (mới: cấp mở riêng bản thử, chỗ nuôi, chưa cho ăn); `01` GP-13, GP-30, GP-40; `04` KY-90.
- Code: `src/domain/orders.ts` (bảng 3 đơn, hệ số 1,2/1,35/1,5, bỏ đơn chờ 10 phút); `estate.ts` thêm hạng mục `KITCHEN` (`K` cạnh nhà) + 9 chỗ nuôi (`COOP`/`POND`, chỗ gà mở khi sửa Chuồng); `cooking.ts` thêm `KitchenRules` tùy chọn; `plant` thêm cấp mở thay thế tùy chọn; engine `ctx.slice` + 7 thao tác (`COOK`, `COLLECT_DISH`, `EAT`, `DISCOVER`, `REFRESH_ORDERS`, `DELIVER_ORDER`, `SKIP_ORDER`); HUD `SliceKitchenHud.tsx` (bảng nấu + Nồi Đất, bảng đơn), Kho có nút Ăn; scene vẽ chỗ nuôi (khung mờ khi trống, biểu tượng khi tới lứa), bỏ gà/cá trang trí. Bản lưu v4.
- Kiểm: typecheck, 289 test (+16), build, check:docs PASS. Smoke cũ 2 cỡ + người mới (844×390) PASS. `tools/qa/p1-9-smoke.cjs` (mới) 2 cỡ: sửa chuồng → thả gà/vịt/cá → thu; sửa Bếp → nấu Cơm → lấy → Nồi Đất tìm Canh → ăn hồi ⚡; bảng 3 đơn → giao đúng thưởng → bỏ đơn; tải lại giữ; 0 nút < 44 px; 0 lỗi JS. Ảnh `docs/screenshots/p1-9-*`.
- `/vac-balance-check`: Lúa lãi/phút và XP/phút cao nhất (3,33🪙, 0,56 XP mỗi ô) — cây cấp cao kém cây cấp 1 (cần chạm nhiều hơn, chưa đo); Cơm bán lỗ 1🪙 so với bán Lúa, Canh lời 1🪙 (món dùng để hồi ⚡ và giao đơn); Sources/Sinks NOT ASSESSED — chưa có người chơi.
- **Dừng ở:** chờ 7 ảnh PO (`art/prompts/p1_species.md`); đang dùng hình tạm (atlas `wave1`, Bếp vẽ bằng code). Sau đó P1-8 (Supabase), P1-12.
