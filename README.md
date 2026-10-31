# HƯƠNG ĐỒNG GIÓ NỘI (NÔNG TRẠI BA MIỀN – VAC ONLINE)

Webgame / PWA → Mobile App thể loại **Cozy Vietnamese Pixel Art Farm Tycoon & Social RPG**
(Phaser 3 + React 19 + Zustand + Supabase).

- Thiết kế đích: bộ tài liệu `00` → `16` (bắt đầu từ `00_MASTER_BIBLE…md`).
- **Hiện trạng thực tế & kế hoạch sprint:** `17_PROJECT_AUDIT_VA_KE_HOACH_TAI_CAU_TRUC.md`.
- Quy tắc cho AI agent: `AGENTS.md`.

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
npm test            # vitest: catalog, luật chợ, auth, 25 QC test case, seed catalog
npm run build       # bản production (ẩn công cụ debug)
```

## Kết nối Supabase

1. Copy `.env.example` thành `.env`, điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`
   (trên Vercel: đặt 2 biến này trong Project Settings → Environment Variables).
2. Trong Supabase **SQL Editor**, chạy theo đúng thứ tự:
   1. `supabase/migrations/0001_init_huong_dong_gio_noi.sql`
   2. `supabase/migrations/0002_seed_full_master_data.sql`
   3. `supabase/migrations/0003_security_hardening.sql`
   4. `supabase/seed/master_catalog_seed.sql` (danh mục thực thể; sinh lại bằng `npm run seed:catalog`
      mỗi khi sửa `src/data/masterData.ts`)
3. Trong Supabase Dashboard → **Authentication**:
   - Bật **Anonymous Sign-ins** (để người Chơi Khách có `auth.uid()` khi dùng Chợ / Lưu bút).
   - Email Templates → **Reset Password**: thêm mã `{{ .Token }}` vào nội dung (game dùng OTP 6 số).

Mọi migration là **Additive-Only** (RULE D1): không `DROP TABLE` / `DROP COLUMN`, chạy lại an toàn.

## Đóng gói Mobile

`capacitor.config.ts` đã có cấu hình; thư viện `@capacitor/*` sẽ được cài ở Sprint S11–S12 (xem file `17`).
