---
name: vac-propagate-change
description: "Khi đổi 1 luật chơi hoặc 1 con số của VAC Online (giá, thời gian, XP, trần, công thức), liệt kê và cập nhật đủ mọi nơi phụ thuộc: tài liệu 01/02/04, src/domain, migration SQL mới, seed, test TS + SQL, file 17. Dùng ngay khi PO duyệt một thay đổi thiết kế."
argument-hint: "<mô tả thay đổi, ví dụ 'tưới nước giảm 20% thay vì 15%'>"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(npm run *), Bash(npx vitest run *), Bash(grep *)
---

# /vac-propagate-change
Một luật nằm ở nhiều nơi; sót 1 nơi thì client và server tính khác nhau.
1. **Chốt:** cũ → mới, lý do, ai duyệt. Đụng kinh tế/core/DB mà chưa có PO duyệt → dừng.
2. **Tìm nơi phụ thuộc** (grep hằng số, tên hàm, ID): thiết kế `01`, `02`, CSV `04` · dữ liệu `masterData.ts`, `quests.ts` → `npm run seed:catalog` · client `src/domain/*.ts` · server: migration **mới** `CREATE OR REPLACE` · test `src/**/*.test.ts`, `qcTestRunner.ts`, `supabase/tests/*.test.sql` · hiện trạng `17`.
3. **Báo trước khi sửa:** danh sách file:dòng + impact report 5 dòng, chờ PO "OK"; sửa theo thứ tự domain + test → migration + test SQL → dữ liệu + seed → tài liệu.
4. **Chứng minh:** `npm run typecheck && npm test && npm run test:sql && npm run build`, grep lại giá trị cũ. Migration mới → nhắc áp DB thật, rồi `npm run supabase -- smoke`.

Agent: `vac-economy`, `vac-backend`, `vac-qa`.
