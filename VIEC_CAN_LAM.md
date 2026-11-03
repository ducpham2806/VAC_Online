# VIỆC CẦN LÀM — VAC Online (Hương Đồng Gió Nội)

Danh sách việc **duy nhất**, chỉ giữ **việc còn mở** + nhật ký gần nhất để tiết kiệm token đầu phiên.
- Việc xong: đánh dấu `[x]` + ngày, rồi **chuyển dòng đó** sang `docs_archive_merged/VIEC_CAN_LAM_LUU_TRU.md` (không xóa hẳn).
- Việc đã xong và nhật ký cũ (đến 2026-11-03): xem file lưu trữ trên. Hiện trạng chi tiết: `17_PROJECT_AUDIT_VA_KE_HOACH_TAI_CAU_TRUC.md`.
- Lưu ý chung: chạy migration theo thứ tự tăng dần, không chạy lại file cũ sau file mới. DB thật đã áp đến `0014`.

---

## A. Việc anh (PO) cần làm

### A1. Trên Supabase / Vercel
- [ ] Áp `0015_app_config_stage.sql` (công tắc giai đoạn, vẫn để GĐ1). Supabase hỏi xác nhận vì có `DROP POLICY IF EXISTS` → anh bấm đồng ý khi AI áp lại, hoặc tự dán vào SQL Editor.
- [ ] **Mở GĐ2:** merge nhánh `ccr-0f19bfc4-fkqi1b` → deploy Vercel với `VITE_GAME_STAGE=2` → chạy `UPDATE public.app_config SET value = '2' WHERE key = 'game_stage';` (quay lại: đặt `'1'`).
- [ ] Thử bản chạy thử GĐ2: https://claude.ai/artifact/Ujwb3Y19GPA24rTgxCt7vP
- [ ] Bật **Leaked password protection** (Dashboard → Authentication → Providers/Policies → Password) — Security Advisor báo WARN.
- [ ] Xóa user test **"Smoke Test"** (`f1598bb5-…`): Dashboard → Authentication → Users.
- [ ] Thêm `{{ .Token }}` vào email template **Reset Password** (game dùng OTP 6 số). Có thể chạy `npm run supabase -- auth-config --apply` khi có `SUPABASE_ACCESS_TOKEN`.
- [ ] Quyết định giữ hay xóa hàm `rls_auto_enable()` (không phải của dự án, Security Advisor báo WARN).
- [ ] (Nếu dùng project khác) đặt `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` trên Vercel.

### A2. Quyết định thiết kế / kinh tế
- [ ] Duyệt 2 mặc định em tự chọn: **PK `-5⚡`/trận** và **Máy Thùng Hyper-Casual vẫn `0⚡`**.
- [ ] Trần thưởng 1.500/ngày tính bằng **Xu Hội Làng** (`16`) hay **🪙 vàng** (`02`)?
- [ ] Chốt các mâu thuẫn còn lại (`17` mục A4):
  - [ ] Phòng Sảnh Chung: 25 hay 30 CCU?
  - [ ] Đình Làng: guild 20–30 người (`14`) hay solo 5k/15k/50k?
  - [ ] Lễ cưới: 1.000 điểm thân mật (`15`) hay 10 tim?
  - [ ] Nồi Bánh Chưng: 12h cả làng (`15`) hay 6h tối đa 5 bạn?
  - [ ] Số món ăn: 22 hay 27?
- [ ] Duyệt đường cong XP `round(60 × L^1.5)`, tối đa Lv.60 (xem lại khi có số liệu beta).
- [ ] **Chọn nguồn ảnh cho sprite đẹp:** (1) anh tự tạo bằng ChatGPT / Gemini theo `art/prompts/wave1_species.md` rồi bỏ vào `art/source/inbox/`, hoặc (2) thêm `OPENAI_API_KEY` / `GEMINI_API_KEY` vào cài đặt môi trường cloud để AI tự tạo hàng loạt (tốn phí API). Không dán key vào chat.
- [ ] Kiểm tra pháp lý Gacha Đập Niêu, Xổ số 18h, cược PK trước GĐ4.

---

## B. Sprint đang làm — chuẩn bị mở GĐ2
- [ ] Mở GĐ2 cho người chơi: `/vac-balance-check` Đợt 2, áp `0015` + bật `game_stage = 2`, `VITE_GAME_STAGE=2` trên Vercel (bản chạy thử GĐ2 đã có).
- [ ] Còn của S5: Cối Xay Cám.
- [ ] Đặt mục tiêu đo được cho Chương 3–10 — xong Ch.3, 6, 7 (2026-11-03); còn Ch.4–5, 8–10 (làm khi mở GĐ3–5).
- [ ] Thay hình tạm Đợt 1 bằng ảnh vẽ đẹp (chờ PO chọn nguồn ảnh — mục A2).

## C. Lộ trình sau (chi tiết: `17` Phần C)
- [ ] S3: closed beta 50–100 người (xem số liệu bằng `npm run supabase -- report`).
- [ ] S6–S8: GĐ3 Chợ Phiên (`rpc_buy_listing` có escrow + thuế 5%), trộm trên server (viết lại `rpc_attempt_steal` theo `src/domain/social.ts`: Chó 50%, cửa sổ 2 phút, bảo hiểm 80%, bỏ tham số `p_thief_id` / `p_dog_catch_chance`), chạy lại `/vac-balance-check`.
- [ ] S9–S10: GĐ4 Hội Làng & Thời Trang, IAP qua Edge Function.
- [ ] S11–S12: GĐ5, đóng gói Capacitor, soft launch.
- [ ] Sau launch: GĐ6 Sảnh Chung / Hyper-Casual / PvP.

## D. Backlog tài liệu
- [ ] Gộp `13 → 16` về hệ ID của CSV `04`; thống nhất tên dự án.
- [ ] Cấp mở khóa lệch: `BM_DINH_01`, `NEW_EXP_01` Lv.11 nhưng thuộc GĐ4 (`17` mục A4). Đụng dữ liệu catalog nên làm cùng lúc mở GĐ tương ứng. (`WORK_02` đã xong 2026-11-03.)

---

## F. Nhật ký việc đã làm (RULE bắt buộc — `AGENTS.md` mục 1.5)
Mỗi việc xong ghi 1 dòng: **ngày — việc — file/commit — kiểm tra — còn dở**. Mới nhất ở dưới cùng. Chỉ giữ vài dòng gần nhất; dòng cũ chuyển sang file lưu trữ (không xóa).

- **2026-11-03** — Chuẩn bị mở GĐ2: sprite tạm Lán Thợ + Chú Tư + Cô Năm (`tools/art/codeart_world.py`, atlas `world` 62 khung, 0 pixel đen, `test:art` OK) + FarmScene dùng sprite/hoạt ảnh; `0015_app_config_stage.sql` (công tắc giai đoạn trong bảng `app_config`) + `stage_switch.test.sql`; save mẫu bản chạy thử (`PREVIEW_PRESET=gd2`, chỉ khi `VITE_OFFLINE_DEMO=1`) + `npm run build:preview:gd2` + `make_preview_page.py` nhận tên trang. Đăng Artifact riêng tư https://claude.ai/artifact/Ujwb3Y19GPA24rTgxCt7vP; chạy thử bằng Playwright: xây Bếp → nấu Cơm → thuê Chú Tư, vàng khớp, 0 lỗi. Áp `0014` lên DB thật (27 RPC, `anon` bị chặn); `0015` CHƯA áp (Supabase hỏi xác nhận, hết 60 giây). Kiểm: typecheck, 178 test, build, test:sql (7 file), test:art PASS. **Dừng ở:** chờ PO xác nhận áp `0015`, rồi merge + deploy + bật GĐ2.
- **2026-11-03** — Rút gọn `VIEC_CAN_LAM.md` (20,5 KB → ~6 KB): chuyển 50 việc đã xong + 21 dòng nhật ký cũ sang `docs_archive_merged/VIEC_CAN_LAM_LUU_TRU.md`; gộp 2 dòng "Mở GĐ2" trùng nhau ở B/C; sửa quy tắc ở `AGENTS.md` 1.5 (việc xong thì chuyển sang lưu trữ). Chỉ đụng tài liệu, không đụng code/DB. Còn dở: không.
