# VIỆC CẦN LÀM — VAC Online (Hương Đồng Gió Nội)

Danh sách việc **duy nhất**, chỉ giữ **việc còn mở** + nhật ký gần nhất để tiết kiệm token đầu phiên.
- Việc xong: đánh dấu `[x]` + ngày, rồi **chuyển dòng đó** sang `docs_archive_merged/VIEC_CAN_LAM_LUU_TRU.md` (không xóa hẳn).
- Việc đã xong và nhật ký cũ: xem file lưu trữ trên. Hiện trạng chi tiết: `17_PROJECT_AUDIT_VA_KE_HOACH_TAI_CAU_TRUC.md`.
- Lưu ý chung: chạy migration theo thứ tự tăng dần, không chạy lại file cũ sau file mới. DB thật đã áp đến `0014`.

---

## A. Việc anh (PO) cần làm

### A1. Trên Supabase / Vercel
- [ ] 🔴 **Áp `0015` → `0016_pond_mud_fix.sql` + 3 seed lên Supabase thật** (PO đã đồng ý 2026-11-03; lần áp `0015` hết 60 giây chờ xác nhận). Nhắn "áp lại" rồi bấm đồng ý trong cửa sổ Supabase, hoặc tự dán 2 file vào SQL Editor theo thứ tự.
- [ ] **Mở GĐ2** (sau khi áp `0016`): thử bản chạy thử https://claude.ai/artifact/Ujwb3Y19GPA24rTgxCt7vP → deploy Vercel `VITE_GAME_STAGE=2` → `UPDATE public.app_config SET value = '2' WHERE key = 'game_stage';` (quay lại: `'1'`).
- [ ] Bật **Leaked password protection** (Dashboard → Authentication → Providers/Policies → Password) — Security Advisor báo WARN.
- [ ] Xóa user test **"Smoke Test"** (`f1598bb5-…`): Dashboard → Authentication → Users.
- [ ] Thêm `{{ .Token }}` vào email template **Reset Password** (game dùng OTP 6 số). Có thể chạy `npm run supabase -- auth-config --apply` khi có `SUPABASE_ACCESS_TOKEN`.
- [ ] Quyết định giữ hay xóa hàm `rls_auto_enable()` (không phải của dự án, Security Advisor báo WARN).
- [ ] (Nếu dùng project khác) đặt `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` trên Vercel.

### A2. Asset
- [ ] Tạo ảnh / animation bằng ChatGPT theo `art/prompts/wave1_species.md`: tên `<ID>_<giai đoạn>.png` hoặc `<ID>_<động tác>.png`, nền `#FF00FF`, bỏ vào `art/source/inbox/` hoặc gửi trong chat.

---

## B. Sprint đang làm — chuẩn bị mở GĐ2
- [ ] Bật GĐ2 cho người chơi (chờ A1).
- [ ] Còn của S5: Cối Xay Cám (AI gửi thiết kế cho PO duyệt trước).
- [ ] Đặt mục tiêu đo được cho Chương 3–10 — xong Ch.3, 6, 7; còn Ch.4–5, 8–10 (làm khi mở GĐ3–5).
- [ ] Nhập ảnh ChatGPT thay hình tạm Đợt 1 (khi PO gửi ảnh).

## C. Lộ trình sau (chi tiết: `17` Phần C)
- [ ] S3: closed beta 50–100 người (xem số liệu bằng `npm run supabase -- report`).
- [ ] S6–S8: GĐ3 Chợ Phiên (`rpc_buy_listing` có escrow + thuế 5%), trộm trên server (viết lại `rpc_attempt_steal` theo `src/domain/social.ts`: Chó 50%, cửa sổ 2 phút, bảo hiểm 80%, bỏ tham số `p_thief_id` / `p_dog_catch_chance`), chạy lại `/vac-balance-check`.
- [ ] S9–S10: GĐ4 Hội Làng & Thời Trang (Đình Làng solo 5k/15k/50k), IAP qua Edge Function.
- [ ] S11–S12: GĐ5 (Lễ cưới 1.000 điểm thân mật, Nồi Bánh Chưng 12h cả làng), đóng gói Capacitor, soft launch.
- [ ] Sau launch: GĐ6 Sảnh Chung (30 CCU/phòng) / Hyper-Casual (trần 1.500 🏮/ngày) / PvP.

## D. Backlog tài liệu
- [ ] Gộp `13 → 16` về hệ ID của CSV `04`; thống nhất tên dự án.
- [ ] Cấp mở khóa lệch: `BM_DINH_01`, `NEW_EXP_01` Lv.11 nhưng thuộc GĐ4 (`17` mục A4). Đụng dữ liệu catalog nên làm cùng lúc mở GĐ tương ứng.

---

## F. Nhật ký việc đã làm (RULE bắt buộc — `AGENTS.md` mục 1.5)
Mỗi việc xong ghi 1 dòng: **ngày — việc — file/commit — kiểm tra — còn dở**. Mới nhất ở dưới cùng. Chỉ giữ vài dòng gần nhất; dòng cũ chuyển sang file lưu trữ (không xóa).

- **2026-11-03** — `/vac-balance-check wave:2` (chỉ phân tích, script tạm trong scratchpad, không commit script): bảng lãi/phút Đợt 1–2, mô phỏng lên cấp, kết quả + đề xuất ghi ở `17` mục C4. Phát hiện 🔴 Bùn Phù Sa in tiền (cả GĐ1 đang chạy) và 🔴 `PROD_C01` cần `CROP_C05` Đợt 4. DB thật: 1 hồ sơ, analytics rỗng → số liệu thật NOT ASSESSED. **Dừng ở:** chờ PO chọn cách sửa (mục A2), chưa sửa số.
- **2026-11-03** — PO duyệt sửa cân bằng (`17` C4): vét ao = Độ Bùn Ao (≤10, ao rỗng từ chối), Độ Bùn chỉ tăng khi thu thủy sản, không bón bùn `TREE`; `PROD_C01` = Đậu Phộng + Sữa Bò + Mía. File: `src/domain/farm.ts` (`dredgeMudGain`), `farmSlice.ts` (toast đúng số xô), `tutorial.ts`, `quests.ts` Ch.2, `masterData.ts` + CSV `04` + seed, `0016_pond_mud_fix.sql` (+ xóa 1 dòng công thức cũ `PROD_C01/CROP_C05`), test TS (`farm`, `farmGrid`, `cooking`) + SQL (`farm_core`, `kitchen`) sửa theo luật mới; tài liệu `01`, `02`, `17`. Kiểm: typecheck, 181 test, build, test:sql (7 file) PASS. **Dừng ở:** chờ PO cho áp `0015` + `0016` + seed lên DB thật.
- **2026-11-03** — Ghi 8 quyết định PO (`17` A4: trần 1.500 🏮 Xu Hội/ngày, Sảnh 30 CCU, Đình Làng solo 5k/15k/50k, cưới 1.000 điểm thân mật, Bánh Chưng 12h cả làng, 27 món, XP tối đa Lv.60, gacha/xổ số/cược chỉ tiền trong game) và đồng bộ 12 tài liệu `00`–`16` (agent; `14` viết lại phần guild thành solo, tên RPC/modal mới chỉ là đề xuất). Chuyển việc đã xong sang lưu trữ. Chỉ đụng tài liệu. **Còn mở:** Bánh Chưng "giảm 20 phút/người" (`01`) chưa có trần khi cả làng cùng nấu; ID món/xưởng ở `13`–`15` chưa theo `01` (backlog D).
