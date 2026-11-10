# VIỆC CẦN LÀM — VAC Online (Hương Đồng Gió Nội)

Danh sách việc **duy nhất** của dự án. Việc xong: đánh dấu `[x]`, gạch đi và ghi ngày; không xóa dòng.
Chi tiết hiện trạng và lý do: `17_PROJECT_AUDIT_VA_KE_HOACH_TAI_CAU_TRUC.md`.

---

## A. Việc anh (PO) cần làm

### A0. Duyệt kế hoạch làm lại (mới — 2026-11-10)
- [ ] Đọc `docs/REVIEW-2026-11-10.md` và duyệt / sửa `docs/PROJECT-PLAN.md`: build lại phần nền hay sửa tại chỗ.
- [ ] Trả lời 3 câu: mục tiêu bản 1.0 (thương mại hay cộng đồng), nguồn art, vertical slice 1 miền hay 3 miền.
- [ ] Nếu build lại: cho phép DB mới cho bản làm lại (ngoại lệ RULE D1 mục 4; DB cũ giữ nguyên).
- [ ] Trong lúc chờ: tạm dừng việc mở GĐ2 (A1, C) hay vẫn làm tiếp?

### A1. Trên Supabase / Vercel
- [x] ~~Chạy `0003_security_hardening.sql`, `0004_farm_core.sql` trong SQL Editor~~ ✅ 2026-11-01
- [x] ~~Chạy 2 seed `master_catalog_seed.sql`, `quest_catalog_seed.sql`~~ ✅ 2026-11-01
- [x] ~~Bật Anonymous Sign-ins~~ ✅ 2026-11-01
- [x] ~~Cấp quyền Supabase connector cho AI~~ ✅ 2026-11-01
- [x] ~~Chạy `0006` → `0007` → seed nhiệm vụ → `0008` trong SQL Editor~~ ✅ 2026-11-02 (AI đã kiểm: đủ hàm/bảng/view, Security Advisor 0 ERROR)
- [x] ~~Chạy `0009_kitchen.sql` (PO) + `recipe_seed.sql` (AI qua connector)~~ ✅ 2026-11-02 (AI đã kiểm: 3 bảng, 5 RPC Bếp, 34 dòng công thức, Security Advisor 0 ERROR)
- [x] ~~Chạy `0010_livestock_cycles.sql`~~ ✅ 2026-11-03 (AI qua connector)
- [x] ~~Chạy `0011_workers.sql` → `0012_quest_counters_s5.sql` → `quest_catalog_seed.sql`~~ ✅ 2026-11-03 (AI qua connector). Lưu ý chung: chạy migration theo thứ tự tăng dần, không chạy lại file cũ sau file mới.
- [x] ~~Cập nhật `master_catalog` trên DB thật (Chó Phú Quốc, Ngỗng, 2 thợ S5b)~~ ✅ 2026-11-03 (AI chạy đúng 4 dòng khác biệt của seed)
- [x] ~~Áp `0013_craft_gear.sql` + seed đồ thợ / nhiệm vụ Ch.7 lên Supabase~~ ✅ 2026-11-03 (AI qua connector)
- [x] ~~Áp `0014_worker_bonus.sql`~~ ✅ 2026-11-03 (AI qua connector)
- [ ] Áp `0015_app_config_stage.sql` (công tắc giai đoạn, vẫn để GĐ1). Lần trước Supabase hỏi xác nhận vì có `DROP POLICY IF EXISTS` → anh bấm đồng ý khi AI áp lại, hoặc tự dán vào SQL Editor.
- [ ] **Mở GĐ2:** merge nhánh `ccr-0f19bfc4-fkqi1b` → deploy Vercel với `VITE_GAME_STAGE=2` → chạy `UPDATE public.app_config SET value = '2' WHERE key = 'game_stage';` (quay lại: đặt `'1'`).
- [ ] Thử bản chạy thử GĐ2: https://claude.ai/artifact/Ujwb3Y19GPA24rTgxCt7vP
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
  - [x] ~~Chương 3 mở ở Lv.6 (code) hay Lv.9 (`01`)?~~ ✅ 2026-11-03: Lv.9
  - [x] ~~Cửa sổ trộm: 2 phút~~ ✅ 2026-11-02
- [ ] Duyệt đường cong XP `round(60 × L^1.5)`, tối đa Lv.60 (xem lại khi có số liệu beta).
- [x] ~~Chốt **bảng 64 màu**~~ ✅ 2026-11-02 (`art/palette/vac_base.gpl`, `05` mục 1.3)
- [ ] **Chọn nguồn ảnh cho sprite đẹp:** (1) anh tự tạo bằng ChatGPT / Gemini theo `art/prompts/wave1_species.md` rồi bỏ vào `art/source/inbox/`, hoặc (2) thêm `OPENAI_API_KEY` / `GEMINI_API_KEY` vào cài đặt môi trường cloud để AI tự tạo hàng loạt (tốn phí API). Không dán key vào chat.
- [x] ~~S5 Lán Thợ: thợ chỉ thu + tưới; lương 25%; vật nuôi nhiều lứa; hạ cấp thợ (Lv.13 / Lv.15)~~ ✅ 2026-11-03 (`17` C3)
- [x] ~~S5d: đồ thợ dùng loài Đợt 2 có sẵn; tác dụng Độ No hao chậm 25%; AI áp 0010→0012 qua connector~~ ✅ 2026-11-03 (`17` C3)
- [ ] Kiểm tra pháp lý Gacha Đập Niêu, Xổ số 18h, cược PK trước GĐ4.
- [x] ~~Duyệt thiết kế **khai hoang thật** và **kiểm mục tiêu nhiệm vụ**~~ ✅ 2026-11-01

---

## B. Sprint đang làm — S2

- [x] ~~Tách `useGameStore.ts` thành 6 slice (giữ nguyên API)~~ ✅ 2026-11-01
- [x] ~~Tách 11 modal khỏi `App.tsx` (2.084 → 699 dòng), dùng selector Zustand~~ ✅ 2026-11-01
- [x] ~~Khai hoang thật: lưới 5×5, mỗi lần khai hoang mở 1 ô trồng được (`farmGrid.ts`, migration `0006`)~~ ✅ 2026-11-01
- [x] ~~Kiểm mục tiêu nhiệm vụ trên server: Ch.1 tưới + thu Lúa, Ch.2 vét bùn + bón bùn (`0007`)~~ ✅ 2026-11-01
- [ ] Đặt mục tiêu đo được cho Chương 3–10 khi mở GĐ2–5 — ✅ Ch.3, Ch.6, Ch.7 (2026-11-03); còn Ch.4–5, 8–10 (mở GĐ3–5).
- [x] ~~HUD màn hình ngang thấp (844×390, 667×375): khay giống không che ruộng, footer 1 hàng~~ ✅ 2026-11-02
- [x] ~~Đường ống asset + atlas tạm 23 loài Đợt 1 × 4 giai đoạn + VFX nông trại~~ ✅ 2026-11-02
- [ ] Thay hình tạm Đợt 1 bằng ảnh vẽ đẹp (chờ PO chọn nguồn ảnh — mục A2).
- [x] ~~Bản chạy thử GĐ1 đủ asset tạm (thế giới, nhân vật, UI, icon, animation, VFX, âm thanh) — link Artifact riêng tư https://claude.ai/artifact/8R1sgtQahsaAaGgG3DB36h (`npm run build:preview`, chạy offline)~~ ✅ 2026-11-02
- [x] ~~Analytics phía server: retention D1/D7, phễu tân thủ, Sources/Sinks (`0008`, `npm run supabase -- report`)~~ ✅ 2026-11-02
- [x] ~~Sửa CI job `sql` luôn đỏ (`scripts/test-sql.sh` thoát mã 1 dù test PASS)~~ ✅ 2026-11-02
- [x] ~~Vá lỗ hổng Bách Khoa: GĐ1 "mua" món rồi bán lại HTX ra vàng/XP/⚡ vô hạn (`canCraftOrBuy`, bản chạy thử đã đăng lại)~~ ✅ 2026-11-02

## C. Lộ trình sau (chi tiết: `17` Phần C)
- [x] ~~S3: Hướng dẫn tân thủ Chương 1–2 (Bác Bảy, 8 bước, `src/domain/tutorial.ts`)~~ ✅ 2026-11-02
- [ ] S3: closed beta 50–100 người (xem số liệu bằng `npm run supabase -- report`).
- [x] ~~S4: đặc tả Bếp Quê & Xưởng + 4 quyết định PO (Nồi Đất khám phá, giữ dữ liệu gốc, giữ giá, mở GĐ2) — `17` mục C2~~ ✅ 2026-11-02
- [x] ~~S4: làm Bếp Quê & Xưởng theo `17` C2 (domain → `0009` → store → UI → tài liệu)~~ ✅ 2026-11-02 (chờ PO chạy `0009` + seed)
- [ ] Mở GĐ2: đặt mục tiêu Chương 3 (Bếp Quê), `/vac-balance-check`, migration đổi `app_game_stage()` = 2, `VITE_GAME_STAGE=2` trên Vercel.
- [x] ~~S5: Lán Thợ theo `17` C3: S5a nuôi nhiều lứa → S5b số liệu thợ → S5c Lán Thợ + lazy-tick server → S5d xưởng nghề + đồ thợ → mục tiêu Ch.3/6/7~~ ✅ 2026-11-03 (còn: sprite Lán Thợ + 2 thợ trên bản đồ, Cối Xay Cám, Phụ Cấp Ngày Mùa)
- [ ] Mở GĐ2 cho người chơi: `/vac-balance-check` Đợt 2, migration đổi `app_game_stage()` = 2, `VITE_GAME_STAGE=2` trên Vercel, bản chạy thử GĐ2.
- [ ] S6–S8: GĐ3 Chợ Phiên (`rpc_buy_listing` có escrow + thuế 5%), trộm trên server (viết lại `rpc_attempt_steal` theo `src/domain/social.ts`: Chó 50%, cửa sổ 2 phút, bảo hiểm 80%, bỏ tham số `p_thief_id` / `p_dog_catch_chance`), chạy lại `/vac-balance-check`.
- [ ] S9–S10: GĐ4 Hội Làng & Thời Trang, IAP qua Edge Function.
- [ ] S11–S12: GĐ5, đóng gói Capacitor, soft launch.
- [ ] Sau launch: GĐ6 Sảnh Chung / Hyper-Casual / PvP.

## D. Backlog tài liệu
- [x] ~~Sửa số cứng "155 thực thể / 37 TC / 11 bảng / 7 RPC"~~ ✅ 2026-11-01
- [x] ~~Thống nhất thuế Chợ, bảo hiểm trộm, năng lượng PK~~ ✅ 2026-11-01
- [ ] Gộp `13 → 16` về hệ ID của CSV `04`; thống nhất tên dự án.
- [x] ~~Sửa tham chiếu `04_MASTER_NARRATIVE`, "GDD Mục 9"~~ ✅ 2026-11-02
- [x] ~~Xóa ký tự lạ, sửa lỗi gõ~~ ✅ 2026-11-02
- [x] ~~Bỏ tick `[x]` ở checklist nghiệm thu GĐ1–2 cho tới khi code đạt~~ ✅ 2026-11-02
- [x] ~~Điền 2 placeholder rỗng (`02` Phần 4, `08` Phần 5)~~ ✅ 2026-11-02
- [x] ~~Đồng bộ 7/8 van chống lạm phát (= 8, theo `02`)~~ ✅ 2026-11-02
- [x] ~~Lệch số quy tắc code (14), số phiên bản Bible / UI~~ ✅ 2026-11-02
- [ ] Cấp mở khóa lệch: ~~`WORK_02` Lv.16 vs Chương 6 Lv.13~~ ✅ 2026-11-03 (Lv.13 / Lv.15); `BM_DINH_01`, `NEW_EXP_01` Lv.11 nhưng thuộc GĐ4 (`17` mục A4). Đụng dữ liệu catalog nên để làm cùng lúc mở GĐ tương ứng.

## E. Đã xong trước đó
- [x] ~~Phân tích dự án, lập file `17` và kế hoạch sprint~~ ✅ 2026-10-31
- [x] ~~Bổ sung skill art `agent-sprite-forge`~~ ✅ 2026-10-31
- [x] ~~Sprint S0: build, vitest + CI, bảo mật DB (`0003`), auth Supabase, ẩn công cụ debug~~ ✅ 2026-10-31
- [x] ~~Sprint S1: vòng chơi GĐ1 trên server (`0004`), Kho/HTX, persist, khóa theo Giai đoạn~~ ✅ 2026-11-01
- [x] ~~Áp dụng Claude-Code-Game-Studios: rule, skill `vac-*`, hook~~ ✅ 2026-11-01
- [x] ~~`0005` sửa Security Advisor + smoke test thật~~ ✅ 2026-11-01

---

## F. Nhật ký
Từ 2026-11-10 nhật ký chính là [docs/WORKLOG.md](docs/WORKLOG.md) (≤ 3 mục mới nhất), tóm tắt việc xong ở [docs/COMPLETED.md](docs/COMPLETED.md). Nhật ký cũ của mục này (2026-11-02 → 11-03) giữ nguyên văn ở [docs/archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md](docs/archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md).
