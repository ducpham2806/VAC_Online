---
name: vac-propagate-change
description: "Khi đổi 1 luật chơi hoặc 1 con số của VAC Online (giá, thời gian, XP, trần, công thức), liệt kê và cập nhật đủ mọi nơi phụ thuộc: tài liệu 01/02/04, src/domain, migration SQL mới, seed, test TS + SQL, file 17. Dùng ngay khi PO duyệt một thay đổi thiết kế."
argument-hint: "<mô tả thay đổi, ví dụ 'tưới nước giảm 20% thay vì 15%'>"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(npm run *), Bash(npx vitest run *), Bash(grep *)
---

# /vac-propagate-change (chuyển thể từ CCGS `propagate-design-change`)

Trong dự án, 1 luật tồn tại ở nhiều nơi. Bỏ sót 1 nơi thì client và server tính khác nhau.

## Bước 1 — Chốt thay đổi
Ghi rõ: giá trị cũ → giá trị mới, lý do, ai duyệt. Chưa có PO duyệt mà thay đổi đụng kinh tế / core loop / DB thì **dừng** (RULE D1).

## Bước 2 — Tìm mọi nơi phụ thuộc (grep theo hằng số, tên hàm, ID)
| Lớp | Nơi cần kiểm |
|---|---|
| Thiết kế | `docs/01_GAMEPLAY.md` (luật, mã GP-), `docs/03_KINH_TE.md` (số, mã KT-), `data/catalog.csv`, `docs/08_QUYET_DINH.md` (QD mới) |
| Dữ liệu | `src/data/masterData.ts`, `src/data/quests.ts`, rồi `npm run seed:catalog` |
| Luật client | `src/domain/*.ts` (hằng số đầu file) |
| Luật server | RPC trong `supabase/migrations/0004_farm_core.sql` → viết **migration mới** `CREATE OR REPLACE` |
| Test | `src/domain/*.test.ts`, `src/store/*.test.ts`, `qcTestRunner.ts`, `supabase/tests/*.test.sql` |
| Hiện trạng | `docs/04_KY_THUAT.md` KY-90, `docs/COMPLETED.md` |

## Bước 3 — Báo cáo tác động rồi mới sửa
Liệt kê từng file:dòng sẽ đổi, kèm RULE D1 Impact Report 5 dòng. Đợi PO "OK", rồi sửa theo thứ tự: domain + test → migration + test SQL → dữ liệu + seed → tài liệu.

## Bước 4 — Chứng minh
`npm run typecheck && npm test && npm run test:sql && npm run build`, rồi grep lại giá trị cũ xem còn sót không.
Có migration mới thì nhắc áp lên Supabase thật (connector hoặc SQL Editor), rồi chạy `npm run supabase -- smoke`.
Agent: `vac-economy` (số), `vac-backend` (SQL), `vac-qa` (chứng minh).
