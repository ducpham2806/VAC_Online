---
paths:
  - "**/*.test.ts"
  - "supabase/tests/**"
  - "src/services/qcTestRunner.ts"
---

# Test — chuyển thể từ CCGS `test-standards`

- Tên test nói rõ tình huống và kết quả mong đợi (tiếng Việt được).
- **Không bao giờ** skip, xóa hay nới lỏng test để có màu xanh. Test fail thì xác định **test sai hay code sai**: sửa đúng chỗ và ghi lý do vào commit.
- Logic mới ở `src/domain` phải có test cho từng nhánh từ chối. RPC mới phải có assertion trong `supabase/tests/*.test.sql`, gồm cả trường hợp `anon` bị chặn và user A không đụng được dữ liệu của user B.
- Test không gọi mạng: trong vitest Supabase luôn offline (`MODE=test`). Test SQL chạy trên Postgres tạm, không chạy trên project thật.
- **NOT ASSESSED (từ CCGS):** không có dữ liệu để kiểm thì báo "chưa kiểm được", không báo "đạt".
