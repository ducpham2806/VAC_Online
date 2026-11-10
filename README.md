# HƯƠNG ĐỒNG GIÓ NỘI (NÔNG TRẠI BA MIỀN – VAC ONLINE)

Webgame / PWA → Mobile App thể loại **Cozy Vietnamese Pixel Art Farm Tycoon & Social RPG**
(Phaser 3 + React 19 + Zustand + Supabase).

- **Tài liệu thiết kế:** `docs/00_TONG_QUAN.md` → `docs/08_QUYET_DINH.md` (bắt đầu từ `00`: tầm nhìn, tham chiếu Green Farm 3 + Harvest Moon, bản đồ tài liệu). Lộ trình: `docs/07_LO_TRINH.md`. Hiện trạng code: `docs/04_KY_THUAT.md` KY-90. Bộ cũ `00 → 17`: `docs_archive_merged/v1-2026-11-10/`.
- **Dữ liệu thực thể:** `data/catalog.csv` ↔ `src/data/masterData.ts`.
- Quy tắc cho AI agent: `AGENTS.md` (Claude Code nạp qua `CLAUDE.md`).
- **Việc cần làm (PO + dev):** `VIEC_CAN_LAM.md`. Đánh giá dự án: `docs/REVIEW-2026-11-10.md`.
- **Nhật ký / bàn giao:** `docs/WORKLOG.md`, `docs/COMPLETED.md`, `docs/SESSION-HANDOFF.md` (quy trình: `docs/WORKFLOW.md`).
- **Bộ công cụ AI:** thư viện Game Studio `.agents/game-studio/` (tra `docs/studio/INDEX.md`), đồ thị tri thức Graphify (`npm run graph`).

## Chạy nhanh

Yêu cầu Node 22.

```bash
npm ci          # cài thư viện
npm run dev     # http://localhost:5173 — có thêm công cụ debug (⏩ x60, 🧪 QC, cấu hình Supabase)
```

Không cần Supabase vẫn chơi được bằng **Chơi Khách** (offline). Đăng ký / đăng nhập cần Supabase.

## Kiểm tra trước khi commit (CI chạy đúng các bước này)

```bash
npm run typecheck   # tsc cho app + test
npm test            # vitest: luật domain, catalog & 5 Đợt, store, auth, 25 QC test case, seed
npm run test:sql    # test migration + RPC trên Postgres tạm (cần Postgres 16 cục bộ hoặc PGHOST)
npm run build       # bản production (ẩn công cụ debug)
npm run check:docs  # trần ký tự tài liệu, link, nhật ký, bản ghim Game Studio
```

## Kết nối Supabase

1. Copy `.env.example` thành `.env`, điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`
   (trên Vercel: đặt 2 biến này trong Project Settings → Environment Variables).
2. Trong Supabase **SQL Editor**, chạy theo đúng thứ tự:
   1. `supabase/migrations/0001_init_huong_dong_gio_noi.sql`
   2. `supabase/migrations/0002_seed_full_master_data.sql`
   3. `supabase/migrations/0003_security_hardening.sql`
   4. `supabase/migrations/0004_farm_core.sql` (vòng chơi GĐ1 trên server)
   5. `supabase/migrations/0005_advisor_fixes.sql` (sửa cảnh báo Security Advisor)
   6. `supabase/migrations/0006_land_expansion.sql` (khai hoang lưới 5×5). Chạy lại `0004` thì phải chạy lại cả `0006` và `0007`.
   7. `supabase/migrations/0007_quest_objectives.sql` (mục tiêu nhiệm vụ đo được). Seed nhiệm vụ phải chạy **sau** file này.
   8. `supabase/migrations/0008_analytics.sql` (analytics phía server; xem bằng `npm run supabase -- report`).
   9. `supabase/seed/master_catalog_seed.sql` và `supabase/seed/quest_catalog_seed.sql`. Sinh lại 2 file này bằng
      `npm run seed:catalog` mỗi khi sửa `src/data/masterData.ts` hoặc `src/data/quests.ts`.

   Có thể chạy tự động qua Management API: đặt biến `SUPABASE_ACCESS_TOKEN` (Personal Access Token, **không commit**) rồi chạy
   ```bash
   npm run supabase -- status
   npm run supabase -- apply supabase/migrations/0003_security_hardening.sql supabase/migrations/0004_farm_core.sql \
     supabase/migrations/0005_advisor_fixes.sql supabase/migrations/0006_land_expansion.sql supabase/migrations/0007_quest_objectives.sql supabase/migrations/0008_analytics.sql supabase/seed/master_catalog_seed.sql supabase/seed/quest_catalog_seed.sql
   npm run supabase -- auth-config --apply   # bật Anonymous Sign-ins + email OTP
   npm run supabase -- smoke                 # chơi thử như Khách thật
   npm run supabase -- report                # retention D1/D7, phễu tân thủ, Sources/Sinks (sau 0008)
   ```
3. Trong Supabase Dashboard → **Authentication**:
   - Bật **Anonymous Sign-ins** (để người Chơi Khách có `auth.uid()` khi dùng Chợ / Lưu bút).
   - Email Templates → **Reset Password**: thêm mã `{{ .Token }}` vào nội dung (game dùng OTP 6 số).

Mọi migration là **Additive-Only** (RULE D1): không `DROP TABLE` / `DROP COLUMN`, chạy lại an toàn.

## Giai đoạn phát hành

`VITE_GAME_STAGE` (1–6) quyết định tính năng và Đợt V-A-C nào được hiện. Production mặc định là `1`, còn `npm run dev` mặc định là `6`.
Khi mở giai đoạn mới, cần nâng cả `VITE_GAME_STAGE` lẫn hàm SQL `public.app_game_stage()`.

## Đóng gói Mobile

`capacitor.config.ts` đã có cấu hình; thư viện `@capacitor/*` sẽ được cài ở Sprint S11–S12 (xem `docs/04_KY_THUAT.md` KY-70).
