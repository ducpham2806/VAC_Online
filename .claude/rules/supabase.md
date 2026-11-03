---
paths:
  - "supabase/**"
  - "scripts/test-sql.sh"
  - "scripts/supabase-admin.ts"
---
# Supabase / SQL (server làm trọng tài)
- Additive-only: mỗi thay đổi 1 file `supabase/migrations/NNNN_ten.sql`, không sửa file đã chạy. Cấm DROP TABLE/COLUMN, đổi tên cột, đổi ID.
- Hàm `SECURITY DEFINER`: `SET search_path = public, pg_temp`; danh tính `auth.uid()` (không nhận user id); kiểm input; giá/thời gian từ `master_catalog` + `NOW()`; `FOR UPDATE` theo thứ tự profile → entity → inventory; `REVOKE … FROM PUBLIC, anon`, GRANT `authenticated` khi cần. Hàm nội bộ `_tên`: `REVOKE ALL … FROM PUBLIC, anon, authenticated`.
- Mỗi migration có test trong `supabase/tests/`, chạy `npm run test:sql`.
- Áp DB thật qua connector `apply_migration` (hoặc PO dán SQL Editor), rồi `get_advisors` + `npm run supabase -- smoke`. Lệnh có DROP bị hỏi xác nhận: nhờ PO, không lách.
