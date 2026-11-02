---
name: vac-consistency-check
description: "Kiểm RULE D0 cho VAC Online: tìm con số / tên lệch nhau giữa bộ tài liệu 00→17, AGENTS.md và code thật (GAME_CATALOG, migration, test). Dùng khi sửa tài liệu, trước khi bàn giao sprint, hoặc khi nghi số liệu bị trôi."
argument-hint: "[full | file:<tên> | topic:<chủ đề>]"
allowed-tools: Read, Grep, Glob, Bash(npx vitest run *), Bash(grep *), Bash(ls *), Bash(wc *)
---

# /vac-consistency-check — kiểm RULE D0 (chuyển thể từ CCGS `consistency-check`)

Chỉ **báo cáo**, không tự sửa. Sửa chỉ khi PO đồng ý.

## Bước 1 — Lấy "sự thật" từ code (không đoán)
Mỗi giá trị ghi **FOUND** (kèm lệnh/đường dẫn) hoặc **ABSENT**:
- Số thực thể, loài V-A-C và lũy kế Đợt: `src/data/masterData.ts`, `src/data/catalog.test.ts` (chạy `npx vitest run src/data`).
- Số test: `npx vitest run` (tổng), số `runCase(` trong `src/services/qcTestRunner.ts`, số assertion `t.eq|t.expect_error` trong `supabase/tests/`.
- Bảng / RPC: grep `CREATE TABLE IF NOT EXISTS` và `CREATE OR REPLACE FUNCTION public.rpc_` trong `supabase/migrations/`.
- Module xong chưa: Phụ lục 1 của `17_PROJECT_AUDIT…md`.

## Bước 2 — Grep tài liệu, không đọc cả file
Chạy `grep -n` trong `0*_*.md 1*_*.md AGENTS.md` theo các mẫu:
`155|166|146 thực thể`, `81 loài`, `23 ➔ 45`, `37 Test|TC`, `11 Bảng|bảng`, `7 .*RPC`, `C1 ➔ C1[24]`, `v9\.[0-9]`, tên giai đoạn, ID prefix (`TREE_|DISH_|DEC_|ITEM_`).
Chỉ đọc đoạn quanh dòng trúng (offset/limit) khi cần hiểu ngữ cảnh.

## Bước 3 — Phân loại từng chỗ lệch
- **SAI HIỆN TRẠNG:** tài liệu nói về code hiện tại nhưng khác code. Sửa về số trong file 17.
- **THIẾT KẾ ĐÍCH:** mục tiêu tương lai (ví dụ 11 bảng ở GĐ6). Giữ nguyên, nhưng phải ghi rõ là "đích".
- **MÂU THUẪN THIẾT KẾ:** 2 tài liệu nói 2 điều khác nhau về cùng một luật. Cần PO chọn; `01`/`02`/`04` thắng `13`–`16`.

## Bước 4 — Báo cáo
| File:dòng | Nội dung | Sự thật (nguồn) | Loại | Đề xuất |
|---|---|---|---|---|

Kết luận: **NHẤT QUÁN**, **CÓ LỆCH (n chỗ)** hoặc **NOT ASSESSED** (nếu thiếu dữ liệu ở Bước 1; nói rõ thiếu gì).
Agent phù hợp: `vac-qa` (rà soát), `vac-designer` (chọn phương án cho mâu thuẫn thiết kế).
