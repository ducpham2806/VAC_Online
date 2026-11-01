---
paths:
  - "src/data/**"
  - "04_MASTER_DATA_Bang_Thong_So_Kinh_Te_Toan_Game.csv"
  - "supabase/seed/**"
---

# Dữ liệu gốc — chuyển thể từ CCGS `data-files`

- **Không đổi, không xóa ID** thực thể trong `GAME_CATALOG` (CROP_, ANI_, AQUA_, PROD_, MAC_, WORK_, PET_, FASH_, BM_, NEW_, CRAFT_, IAP_, DEF_, TRAP_).
- `GAME_CATALOG` là nguồn chuẩn. CSV `04` phải khớp ID và `Unlock_Wave` (`src/data/catalog.test.ts` kiểm). CSV chỉ được **thêm cột/dòng**, giữ nguyên định dạng các ô cũ.
- File trong `supabase/seed/*.sql` **sinh tự động**, không sửa tay. Sửa `masterData.ts` hoặc `quests.ts` thì chạy `npm run seed:catalog`; test sẽ báo nếu quên.
- Đổi giá, thời gian, sản lượng hay XP là thay đổi kinh tế: chạy `/vac-balance-check` và dừng chờ PO duyệt (RULE D1).
- Phân bổ 5 Đợt (23→45→63→76→81) được test khóa. Muốn đổi thì sửa GDD `01` trước.
