---
paths:
  - "src/domain/**"
---

# Luật chơi (src/domain) — chuyển thể từ CCGS `gameplay-code`

- Chỉ viết **hàm thuần**: không import store, React, Phaser, Supabase. Thời gian (`now`) và ngẫu nhiên (`rng`) truyền vào làm tham số để test được.
- Mọi con số gameplay lấy từ `GAME_CATALOG` (`src/data/masterData.ts`) hoặc hằng số có tên ở đầu file. Không viết số "thần kỳ" giữa hàm.
- **Luật ở đây có bản sao trên server** (`supabase/migrations/0004_farm_core.sql` và các migration sau). Sửa luật thì phải làm đủ 4 việc:
  1. Sửa hàm domain.
  2. Viết migration mới `CREATE OR REPLACE` cho RPC tương ứng. Không sửa file migration đã chạy.
  3. Cập nhật `src/domain/*.test.ts` và `supabase/tests/*.test.sql`.
  4. Cập nhật `docs/03_KINH_TE.md` (mã KT-) và nếu hiện trạng đổi thì `docs/04_KY_THUAT.md` KY-90.
  Dùng skill `/vac-propagate-change` để không sót chỗ nào.
- Mỗi hàm trả `{ ok, save, message }`. Lỗi thì trả `ok: false` kèm lời nhắn tiếng Việt cho người chơi; không throw.
- Mỗi nhánh (thành công và từng lý do từ chối) đều phải có test.
