---
paths:
  - "**/*.test.ts"
  - "supabase/tests/**"
  - "src/services/qcTestRunner.ts"
---
# Test
- Tên test nói rõ tình huống + kết quả mong đợi.
- Không skip/xóa/nới test để xanh; xác định test sai hay code sai, ghi lý do vào commit.
- Domain mới: test từng nhánh từ chối. RPC mới: assert trong `supabase/tests/`, gồm `anon` bị chặn và user A không đụng dữ liệu user B.
- Test không gọi mạng (vitest `MODE=test`; SQL chạy Postgres tạm).
- Không có dữ liệu để kiểm → báo "NOT ASSESSED", không báo "đạt".
