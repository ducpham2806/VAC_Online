# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 11/11/2026 · Rà soát dự án và bộ công cụ agent · codex/ra-soat-du-an (nền c58623e)
- Kiểm kê 999 tệp Git; tra Graphify cục bộ (1.984 nút), đối chiếu hai luồng MVP và P1 từ điểm vào tới lưu trạng thái.
- Đọc cấu hình Claude, 7 skill VAC, Graphify và 6 agent VAC; rà danh mục 116 skill và 21 playbook Game Studio (c5dac46). Skill dùng: Graphify, Supabase (đọc mã cục bộ).
- Kiểm thật: build và check:docs PASS. Typecheck thiếu kiểu Node; Vitest chưa cài; SQL thiếu Postgres cục bộ; test art thiếu numpy (6 lỗi import).
- **Dừng ở:** rà soát xong; P1-12 vẫn chờ PO phát hành link và mời người chơi.

## 11/11/2026 · P1-8 DONE: lưu online (QD-89) — ĐÃ ÁP DB THẬT, ĐÃ TRIỂN KHAI FUNCTION · claude/gifted-faraday-2q851c
- PO duyệt QD-89, bật đăng nhập ẩn danh. Kết nối Supabase nay thấy project VAC `znabynzbcimpesrxxxsz` (17 bảng MVP, 0 dòng, chưa có function).
- Migration `0016_p1_state_ledger.sql` (chỉ thêm): `farm_states`, `ledger`, `_commit_farm_state` (chỉ service_role), `playtest_events` (chỉ thêm dòng của mình), view `playtest_logs`. Test `supabase/tests/p1_state.test.sql`. **Đã áp lên DB thật 11/11** (`apply_migration`); advisors: không cảnh báo mới ngoài "anonymous đọc dòng của mình" (chủ ý), cảnh báo cũ của MVP giữ nguyên.
- Edge Function `apply-actions` (luật `src/engine/sliceServer.ts` đóng gói `npm run build:edge`, kiểm dạng lô, token qua `getClaims`, CORS + `x-region`). **Đã triển khai 11/11** bằng Supabase CLI (`--use-api`; access token PO lưu ở môi trường, không vào repo). Môi trường cloud thêm host `znabynzbcimpesrxxxsz.supabase.co`.
- Client `src/services/sliceSync.ts`: đăng nhập ẩn danh (gộp gọi trùng), hàng chờ lưu máy, gửi lô 0,8 s, dựng lại = ảnh chụp server + hàng chờ, mất mạng thử lại 2–30 s, 404 → về chơi trên máy; gửi nhật ký chơi thử; HUD báo mất kết nối; online ẩn công tắc mùa / chơi lại; `?offline` cho kiểm thử khói.
- Kiểm: typecheck, 303 test, test:sql (8 file), build, check:docs PASS. Cục bộ (Postgres + Deno): p95 3,6 ms, sổ cái khớp. Thật: xử lý trên server p95 11 ms; từ máy cloud (xa, qua proxy) tính cả mạng p95 379 ms (vùng mặc định p95 ~3,4 s → ép `ap-southeast-1`); sổ cái khớp số dư. `tools/qa/p1-8-online-smoke.cjs` PASS (ONLINE → gieo lên server → xóa bản lưu máy, tải lại lấy từ server → nhật ký lên server). Smoke offline 3 kịch bản PASS.
- Dữ liệu kiểm thử còn trên DB thật: 7 người chơi ẩn danh, 2 trạng thái, 4 dòng sổ cái, 8 sự kiện (chờ PO cho xóa).
- **Dừng ở:** P1-12 — PO triển khai link, mời người chơi.

## 11/11/2026 · P1-12 chuẩn bị chơi thử (QD-88) · claude/gifted-faraday-2q851c
- PO chọn: thu số liệu qua server sau P1-8; PO tự triển khai link (không có project Vercel cho VAC, tài khoản Vercel nối chỉ có nama-crm-hrm) → QD-88, kế hoạch `07` LT-13.
- Code: `src/game/slice/playtest.ts` (nhật ký ẩn danh `vac_slice_playtest_v1`: phiên, thao tác thành công theo loại, cấp, bước hướng dẫn; tối đa 3.000 sự kiện; mốc `sent` cho P1-8; gộp phiên mở 2 lần do StrictMode); `playtestMetrics.ts` (D1 theo giờ VN, phễu 8 bước, phiên đầu, cấp); `npm run playtest:report`; mã chơi thử ở ⚙️ Cài đặt.
- Kiểm: typecheck, 295 test (+6), build, check:docs PASS; smoke người mới 844×390: nhật ký đủ MOVE→DONE, 1 phiên; smoke p1-9 + slice 2 cỡ PASS, 0 lỗi JS, 0 nút < 44 px; bản build production (`vite preview`) chạy `?p1`, ghi sự kiện, không lộ công cụ dev.
- **Dừng ở:** chờ P1-8 (quyền Supabase VAC) để gửi sự kiện lên server; PO triển khai link + mời người chơi. Chưa có người chơi thử nào.
