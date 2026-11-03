---
paths:
  - "src/data/**"
  - "04_MASTER_DATA_Bang_Thong_So_Kinh_Te_Toan_Game.csv"
  - "supabase/seed/**"
---
# Dữ liệu gốc
- Không đổi/xóa ID trong `GAME_CATALOG`. CSV `04` phải khớp ID + `Unlock_Wave` (`catalog.test.ts`), chỉ thêm cột/dòng.
- `supabase/seed/*.sql` sinh tự động: sửa `masterData.ts`/`quests.ts` rồi `npm run seed:catalog`.
- Đổi giá/thời gian/sản lượng/XP = đổi kinh tế: `/vac-balance-check` và chờ PO duyệt.
- 5 Đợt (23→45→63→76→81) bị test khóa; muốn đổi thì sửa `01` trước.
