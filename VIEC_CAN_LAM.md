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
- [x] ~~Chạy `0009_kitchen.sql` (PO) + `recipe_seed.sql` (AI qua connector)~~ ✅ 2026-11-02 (AI đã kiểm: 3 bảng, 5 RPC Bếp, 34 dòng công thức, Security Advisor 0 ERROR)
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
- [ ] **Chọn nguồn ảnh cho sprite đẹp:** (1) anh tự tạo bằng ChatGPT / Gemini theo `art/prompts/wave1_species.md` rồi bỏ vào `art/source/inbox/`, hoặc (2) thêm `OPENAI_API_KEY` / `GEMINI_API_KEY` vào cài đặt môi trường cloud để AI tự tạo hàng loạt (tốn phí API). Không dán key vào chat.
- [ ] Kiểm tra pháp lý Gacha Đập Niêu, Xổ số 18h, cược PK trước GĐ4.
- [x] ~~Duyệt thiết kế **khai hoang thật** và **kiểm mục tiêu nhiệm vụ**~~ ✅ 2026-11-01

---

## B. Sprint đang làm — S2

- [x] ~~Tách `useGameStore.ts` thành 6 slice (giữ nguyên API)~~ ✅ 2026-11-01
- [x] ~~Tách 11 modal khỏi `App.tsx` (2.084 → 699 dòng), dùng selector Zustand~~ ✅ 2026-11-01
- [x] ~~Khai hoang thật: lưới 5×5, mỗi lần khai hoang mở 1 ô trồng được (`farmGrid.ts`, migration `0006`)~~ ✅ 2026-11-01
- [x] ~~Kiểm mục tiêu nhiệm vụ trên server: Ch.1 tưới + thu Lúa, Ch.2 vét bùn + bón bùn (`0007`)~~ ✅ 2026-11-01
- [ ] Đặt mục tiêu đo được cho Chương 3–10 khi mở GĐ2–5 (hiện chỉ kiểm cấp).
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
- [ ] S5: Lán Thợ (Cối Xay Cám, Đan Lát, Khung Cửi, đồ thợ, lazy-tick ở server).
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
- [ ] Cấp mở khóa lệch: `WORK_02` Lv.16 vs Chương 6 Lv.13; `BM_DINH_01`, `NEW_EXP_01` Lv.11 nhưng thuộc GĐ4 (`17` mục A4). Đụng dữ liệu catalog nên để làm cùng lúc mở GĐ tương ứng.

## E. Đã xong trước đó
- [x] ~~Phân tích dự án, lập file `17` và kế hoạch sprint~~ ✅ 2026-10-31
- [x] ~~Bổ sung skill art `agent-sprite-forge`~~ ✅ 2026-10-31
- [x] ~~Sprint S0: build, vitest + CI, bảo mật DB (`0003`), auth Supabase, ẩn công cụ debug~~ ✅ 2026-10-31
- [x] ~~Sprint S1: vòng chơi GĐ1 trên server (`0004`), Kho/HTX, persist, khóa theo Giai đoạn~~ ✅ 2026-11-01
- [x] ~~Áp dụng Claude-Code-Game-Studios: rule, skill `vac-*`, hook~~ ✅ 2026-11-01
- [x] ~~`0005` sửa Security Advisor + smoke test thật~~ ✅ 2026-11-01

---

## F. Nhật ký việc đã làm (RULE bắt buộc — `AGENTS.md` mục 1.5)
Mỗi việc xong ghi 1 dòng: **ngày — việc — file/commit — kiểm tra — còn dở**. Mới nhất ở dưới cùng. Không xóa.

- **2026-11-02** — S4-1 luật Bếp Quê dạng hàm thuần `src/domain/cooking.ts` + công thức theo ID (`machineId`, `recipe`) trong `GAME_CATALOG` + seed `recipe_seed.sql` — commit `e3ae998` — 22 test domain PASS.
- **2026-11-02** — S4-2 migration `0009_kitchen.sql` (3 bảng, 5 RPC `rpc_build_machine/start_craft/collect_craft/eat_dish/cook_pot`, snapshot có `machines`/`recipes`) + `supabase/tests/kitchen.test.sql`; `test-sql.sh` chạy thêm seed công thức và test bếp — commit `7c62a5a` — `npm run test:sql` PASS.
- **2026-11-02** — S4-3 client: `src/store/slices/kitchenSlice.ts`, `CookingModal` 3 tab (Xưởng / Sổ Tay / Nồi Đất), nút "🍚 Ăn" trong Kho, `cookRandomDish` / `craftOrBuyCatalogItem` giữ tên nhưng theo luật mới, QC `TC-04.2a` viết lại; tài liệu `17` C2, `03` — commit `65a4803` — typecheck + 147 test + build + test:sql PASS; chụp 1280×720 & 844×390.
- **2026-11-02** — PO chạy `0009` trên Supabase thật; AI chạy `recipe_seed.sql` qua connector và kiểm: 3 bảng mới, 22 RPC (5 RPC Bếp), `anon` không gọi được, 14 món / 34 dòng công thức, `app_game_stage() = 1` (Bếp chưa mở cho người chơi). Security Advisor: 0 ERROR, WARN như cũ.
- **2026-11-02** — Thêm RULE bắt buộc ghi nhật ký vào `AGENTS.md` mục 1.5 + mục F này.

- **2026-11-02** — `/vac-balance-check` Đợt 1–2 (chỉ phân tích). Phát hiện: vật nuôi `ANI_01..07` và thủy sản `AQUA_01..06` đều **lỗ mỗi lứa** (chỉ có XP); thu nhập trần ~3.240🪙/ngày (12 ô Lúa, 90 phút) so với `02` giả định 12.000–20.000🪙/ngày → lương Lán Thợ lớn hơn thu nhập. Ghi vào `17` mục C3.
- **2026-11-02** — Viết đặc tả **nháp S5 Lán Thợ** (`17` mục C3) + RULE D1 sơ bộ. **Dừng ở đây: chờ PO trả lời 4 câu hỏi** (cách thợ làm việc, mức lương, sửa vật nuôi lỗ, lệch cấp Chương 6–7). Chưa viết code S5.
