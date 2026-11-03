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
- [ ] **Cho phép AI áp `0015` → `0016_pond_mud_fix.sql` + 3 seed lên Supabase thật** (sửa lỗi Bùn Phù Sa đang chạy ở GĐ1 + Cà Phê Muối; `17` C4). `0015` có `DROP POLICY IF EXISTS` nên Supabase sẽ hỏi anh xác nhận.
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
- **2026-11-03** — Rút gọn toàn bộ quy tắc nạp vào phiên: `AGENTS.md` 19,9 → 5,6 KB (giữ đủ RULE D0/D1, ghi nhật ký, lệnh kiểm tra, vòng 6 bước; bản cũ lưu ở `docs_archive_merged/AGENTS_v9.3_ban_day_du.md`); `.claude/rules/` 7,4 → 4,6 KB; `.claude/agents/` 9,1 → 5,7 KB (sửa số cũ: 8 van, thuế Chợ 5% / Sới Đình 10%, backend áp DB qua connector khi PO cho phép); `.claude/skills/vac-*` 12,8 → 8,9 KB (giữ nguyên các bước). Chỉ đụng tài liệu/cấu hình AI. Còn dở: không.
- **2026-11-03** — `/vac-balance-check wave:2` (chỉ phân tích, script tạm trong scratchpad, không commit script): bảng lãi/phút Đợt 1–2, mô phỏng lên cấp, kết quả + đề xuất ghi ở `17` mục C4. Phát hiện 🔴 Bùn Phù Sa in tiền (cả GĐ1 đang chạy) và 🔴 `PROD_C01` cần `CROP_C05` Đợt 4. DB thật: 1 hồ sơ, analytics rỗng → số liệu thật NOT ASSESSED. **Dừng ở:** chờ PO chọn cách sửa (mục A2), chưa sửa số.
- **2026-11-03** — PO duyệt sửa cân bằng (`17` C4): vét ao = Độ Bùn Ao (≤10, ao rỗng từ chối), Độ Bùn chỉ tăng khi thu thủy sản, không bón bùn `TREE`; `PROD_C01` = Đậu Phộng + Sữa Bò + Mía. File: `src/domain/farm.ts` (`dredgeMudGain`), `farmSlice.ts` (toast đúng số xô), `tutorial.ts`, `quests.ts` Ch.2, `masterData.ts` + CSV `04` + seed, `0016_pond_mud_fix.sql` (+ xóa 1 dòng công thức cũ `PROD_C01/CROP_C05`), test TS (`farm`, `farmGrid`, `cooking`) + SQL (`farm_core`, `kitchen`) sửa theo luật mới; tài liệu `01`, `02`, `17`. Kiểm: typecheck, 181 test, build, test:sql (7 file) PASS. **Dừng ở:** chờ PO cho áp `0015` + `0016` + seed lên DB thật.
