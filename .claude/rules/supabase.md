---
paths:
  - "supabase/**"
  - "scripts/test-sql.sh"
  - "scripts/supabase-admin.ts"
---

# Supabase / SQL — chuyển thể từ CCGS `network-code` (server làm trọng tài)

- **Additive-only (RULE D1 / C13).** Mỗi thay đổi là 1 file mới `supabase/migrations/NNNN_ten.sql`, không sửa file đã chạy trên production. Chỉ dùng `CREATE … IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS … DEFAULT`, `CREATE OR REPLACE`, GRANT/REVOKE, thay policy. Cấm `DROP TABLE`/`DROP COLUMN`, đổi tên cột đang dùng, đổi ID thực thể.
- **Mọi hàm `SECURITY DEFINER`:**
  - Có `SET search_path = public, pg_temp`.
  - Lấy danh tính bằng `auth.uid()`, không bao giờ nhận user id làm tham số.
  - Kiểm mọi input; giá và thời gian đọc từ `master_catalog` và `NOW()`.
  - Khóa `FOR UPDATE` theo thứ tự profile → entity → inventory.
  - `REVOKE … FROM PUBLIC, anon`, chỉ GRANT cho `authenticated` khi cần.
- Hàm nội bộ (`_tên`) phải `REVOKE ALL … FROM PUBLIC, anon, authenticated`.
- Mỗi migration có test trong `supabase/tests/` và phải chạy `npm run test:sql` (dựng Postgres tạm, chạy 0001→mới nhất 2 lần, rồi seed và test).
- **Áp lên project thật** qua Supabase connector (`apply_migration`) hoặc nhờ PO dán vào SQL Editor. Sau đó chạy `get_advisors` và `npm run supabase -- smoke`.
- Lệnh có DROP sẽ bị Supabase hỏi xác nhận. Nếu bị treo thì nhờ PO tự chạy, **không** lách bằng cách giấu câu lệnh.
