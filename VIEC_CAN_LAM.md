# VIỆC CẦN LÀM — VAC Online (Hương Đồng Gió Nội)

Danh sách việc **duy nhất** của dự án. Việc xong: đánh dấu `[x]`, gạch đi và ghi ngày; không xóa dòng.
Chi tiết hiện trạng và lý do: `17_PROJECT_AUDIT_VA_KE_HOACH_TAI_CAU_TRUC.md`.

---

## A. Việc anh (PO) cần làm

### A1. Trên Supabase / Vercel
- [x] ~~Chạy `0003_security_hardening.sql`, `0004_farm_core.sql` trong SQL Editor~~ ✅ 2026-11-01
- [x] ~~Chạy 2 seed `master_catalog_seed.sql`, `quest_catalog_seed.sql`~~ ✅ 2026-11-01
- [x] ~~Bật Anonymous Sign-ins~~ ✅ 2026-11-01
- [x] ~~Cấp quyền Supabase connector cho AI~~ ✅ 2026-11-01
- [x] ~~Chạy `0006` → `0007` → seed nhiệm vụ → `0008` trong SQL Editor~~ ✅ 2026-11-02 (AI đã kiểm: đủ hàm/bảng/view, Security Advisor 0 ERROR)
- [ ] (Không gấp) Chạy lại `supabase/seed/master_catalog_seed.sql` trong SQL Editor để cập nhật chữ mô tả Chó Phú Quốc 50% / Ngỗng 70% trên DB (luật không đổi).
- [ ] Bật **Leaked password protection** (Dashboard → Authentication → Providers/Policies → Password) — Security Advisor báo WARN.
- [ ] Xóa user test **"Smoke Test"** (`f1598bb5-…`): Dashboard → Authentication → Users.
- [ ] Thêm `{{ .Token }}` vào email template **Reset Password** (game dùng OTP 6 số). Có thể chạy `npm run supabase -- auth-config --apply` khi có `SUPABASE_ACCESS_TOKEN`.
- [ ] Quyết định giữ hay xóa hàm `rls_auto_enable()` (không phải của dự án, Security Advisor báo WARN).
- [ ] (Nếu dùng project khác) đặt `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` trên Vercel.

### A2. Quyết định thiết kế / kinh tế
- [x] ~~S1: thu hoạch vào Kho, bán HTX; bắt đầu Lv.1; vòng chơi tính trên server~~ ✅ 2026-11-01
- [x] ~~Thuế Chợ P2P 5%~~ ✅ 2026-11-01
- [x] ~~Bảo hiểm trộm 80%~~ ✅ 2026-11-01
- [x] ~~PK tốn năng lượng~~ ✅ 2026-11-01
- [ ] Duyệt 2 mặc định em tự chọn: **PK `-5⚡`/trận** và **Máy Thùng Hyper-Casual vẫn `0⚡`**.
- [ ] Trần thưởng 1.500/ngày tính bằng **Xu Hội Làng** (`16`) hay **🪙 vàng** (`02`)?
- [ ] Chốt các mâu thuẫn còn lại (`17` mục A4):
  - [x] ~~Chó giữ nhà: Chó Phú Quốc 50% (Ngỗng 40%, cùng thức 70%)~~ ✅ 2026-11-02
  - [ ] Phòng Sảnh Chung: 25 hay 30 CCU?
  - [ ] Đình Làng: guild 20–30 người (`14`) hay solo 5k/15k/50k?
  - [ ] Lễ cưới: 1.000 điểm thân mật (`15`) hay 10 tim?
  - [ ] Nồi Bánh Chưng: 12h cả làng (`15`) hay 6h tối đa 5 bạn?
  - [ ] Số món ăn: 22 hay 27?
  - [x] ~~Cửa sổ trộm: 2 phút~~ ✅ 2026-11-02
- [ ] Duyệt đường cong XP `round(60 × L^1.5)`, tối đa Lv.60 (xem lại khi có số liệu beta).
- [x] ~~Chốt **bảng 64 màu**~~ ✅ 2026-11-02 (`art/palette/vac_base.gpl`, `05` mục 1.3)
- [ ] Kiểm tra pháp lý Gacha Đập Niêu, Xổ số 18h, cược PK trước GĐ4.
- [ ] Duyệt thiết kế **khai hoang thật** và **kiểm mục tiêu nhiệm vụ** (em sẽ trình trước khi code, vì đụng DB).

---

## B. Sprint đang làm — S2

- [x] ~~Tách `useGameStore.ts` thành 6 slice (giữ nguyên API)~~ ✅ 2026-11-01
- [x] ~~Tách 11 modal khỏi `App.tsx` (2.084 → 699 dòng), dùng selector Zustand~~ ✅ 2026-11-01
- [x] ~~Khai hoang thật: lưới 5×5, mỗi lần khai hoang mở 1 ô trồng được (`farmGrid.ts`, migration `0006`)~~ ✅ 2026-11-01
- [x] ~~Kiểm mục tiêu nhiệm vụ trên server: Ch.1 tưới + thu Lúa, Ch.2 vét bùn + bón bùn (`0007`)~~ ✅ 2026-11-01
- [ ] Đặt mục tiêu đo được cho Chương 3–10 khi mở GĐ2–5 (hiện chỉ kiểm cấp).
- [x] ~~HUD màn hình ngang thấp (844×390, 667×375): khay giống không che ruộng, footer 1 hàng~~ ✅ 2026-11-02
- [ ] Atlas sprite thật cho 23 loài Đợt 1 (`agent-sprite-forge`, sau khi chốt bảng màu).
- [x] ~~Analytics phía server: retention D1/D7, phễu tân thủ, Sources/Sinks (`0008`, `npm run supabase -- report`)~~ ✅ 2026-11-02

## C. Lộ trình sau (chi tiết: `17` Phần C)
- [x] ~~S3: Hướng dẫn tân thủ Chương 1–2 (Bác Bảy, 8 bước, `src/domain/tutorial.ts`)~~ ✅ 2026-11-02
- [ ] S3: closed beta 50–100 người (xem số liệu bằng `npm run supabase -- report`).
- [ ] S4–S5: GĐ2 Bếp Quê & Lán Thợ (45 loài), công thức bếp theo nguyên liệu, lazy-tick ở server.
- [ ] S6–S8: GĐ3 Chợ Phiên (`rpc_buy_listing` có escrow + thuế 5%), trộm trên server (viết lại `rpc_attempt_steal` theo `src/domain/social.ts`: Chó 50%, cửa sổ 2 phút, bảo hiểm 80%, bỏ tham số `p_thief_id` / `p_dog_catch_chance`), chạy lại `/vac-balance-check`.
- [ ] S9–S10: GĐ4 Hội Làng & Thời Trang, IAP qua Edge Function.
- [ ] S11–S12: GĐ5, đóng gói Capacitor, soft launch.
- [ ] Sau launch: GĐ6 Sảnh Chung / Hyper-Casual / PvP.

## D. Backlog tài liệu
- [x] ~~Sửa số cứng "155 thực thể / 37 TC / 11 bảng / 7 RPC"~~ ✅ 2026-11-01
- [x] ~~Thống nhất thuế Chợ, bảo hiểm trộm, năng lượng PK~~ ✅ 2026-11-01
- [ ] Gộp `13 → 16` về hệ ID của CSV `04`; thống nhất tên dự án.
- [ ] Sửa tham chiếu `04_MASTER_NARRATIVE`, "GDD Mục 9".
- [ ] Xóa ký tự lạ (`定`, `枯`), sửa lỗi gõ.
- [ ] Bỏ tick `[x]` ở checklist nghiệm thu GĐ1–2 cho tới khi code đạt.
- [ ] Điền 2 placeholder rỗng (`02:62`, `08:70`).
- [ ] Đồng bộ 7/8 van chống lạm phát.

## E. Đã xong trước đó
- [x] ~~Phân tích dự án, lập file `17` và kế hoạch sprint~~ ✅ 2026-10-31
- [x] ~~Bổ sung skill art `agent-sprite-forge`~~ ✅ 2026-10-31
- [x] ~~Sprint S0: build, vitest + CI, bảo mật DB (`0003`), auth Supabase, ẩn công cụ debug~~ ✅ 2026-10-31
- [x] ~~Sprint S1: vòng chơi GĐ1 trên server (`0004`), Kho/HTX, persist, khóa theo Giai đoạn~~ ✅ 2026-11-01
- [x] ~~Áp dụng Claude-Code-Game-Studios: rule, skill `vac-*`, hook~~ ✅ 2026-11-01
- [x] ~~`0005` sửa Security Advisor + smoke test thật~~ ✅ 2026-11-01
