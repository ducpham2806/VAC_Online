# ADR-003 · Một nguồn dữ liệu thực thể

**Trạng thái:** Chấp nhận (QD-20, 10/11/2026). **Áp vào:** `docs/04_KY_THUAT.md` KY-20.

## Bối cảnh
- **Ba nguồn đang lệch nhau:** cùng thông số nằm ở `src/data/masterData.ts` (166 mục), `data/catalog.csv` (146 dòng, 43 giá trị lệch) và seed SQL. Tài liệu cũ còn chép số lần thứ tư.
- **Hướng mới cần thêm cột** (`seasons`, công cụ, mùa ra quả). Nếu sửa 3 nơi thì sẽ lệch tiếp.

## Quyết định
1. **Nguồn chuẩn:** thư mục `data/`, mỗi bảng một file CSV (`catalog.csv`, sau này `recipes.csv`, `npcs.csv`, `quests.csv`…). CSV là định dạng PO sửa được bằng Excel/Sheets.
2. **Script `npm run data:gen`** đọc `data/*.csv`, kiểm kiểu và ràng buộc, rồi sinh:
   - `src/data/generated/*.ts` (type chặt, không `any`);
   - `supabase/seed/*.sql` (chỉ upsert);
   - `docs/generated/*.md` (bảng tóm tắt để tài liệu dẫn link, không chép số).
   File sinh có dòng đầu "SINH TỰ ĐỘNG — không sửa tay"; CI chạy lại script và báo nếu khác.
3. **Chuyển dần**, không đổi ID thực thể nào (`docs/04_KY_THUAT.md` KY-31):
   - **Bước 1 (P0-3, đã làm):** thêm cột `Seasons` vào CSV và `src/data/seasons.ts`; test khóa hai nơi phải khớp.
   - **Bước 2 (P1):**
     - gộp 43 giá trị lệch: lấy số trong code làm chuẩn, PO duyệt theo bảng so sánh;
     - thêm 20 dòng `MAC_`/`FASH_` còn thiếu vào CSV;
     - viết `data:gen`, cho `masterData.ts` đọc từ file sinh.
   - **Bước 3:** bỏ các cột tính sẵn trong CSV (lợi nhuận, GPM). Các cột này sai sau luật nhiều lứa; script balance tính lại khi cần.

## Hệ quả
- Đổi một con số chỉ sửa 1 ô CSV, rồi chạy `data:gen` và test.
- `/vac-propagate-change` rút gọn còn: CSV → `data:gen` → test → ghi QD nếu là quyết định kinh tế.
