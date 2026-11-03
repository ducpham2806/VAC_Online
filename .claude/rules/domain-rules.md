---
paths:
  - "src/domain/**"
---
# Luật chơi (src/domain)
- Hàm thuần: không import store/React/Phaser/Supabase; `now`, `rng` truyền vào. Trả `{ ok, save, message }`, lỗi trả `ok: false` + lời nhắn tiếng Việt, không throw.
- Số gameplay lấy từ `GAME_CATALOG` hoặc hằng số có tên đầu file.
- Luật có bản sao trên server. Sửa luật phải: (1) sửa domain, (2) migration mới `CREATE OR REPLACE` (không sửa migration đã chạy), (3) cập nhật `*.test.ts` + `supabase/tests/*.test.sql`, (4) ghi `02`/`17`. Dùng `/vac-propagate-change`.
- Mỗi nhánh (thành công + từng lý do từ chối) có test.
