---
name: vac-consistency-check
description: "Kiểm RULE D0 cho VAC Online: tìm con số / tên lệch nhau giữa bộ tài liệu 00→17, AGENTS.md và code thật (GAME_CATALOG, migration, test). Dùng khi sửa tài liệu, trước khi bàn giao sprint, hoặc khi nghi số liệu bị trôi."
argument-hint: "[full | file:<tên> | topic:<chủ đề>]"
allowed-tools: Read, Grep, Glob, Bash(npx vitest run *), Bash(grep *), Bash(ls *), Bash(wc *)
---

# /vac-consistency-check (RULE D0)
Chỉ báo cáo; sửa khi PO đồng ý.
1. **Sự thật từ code** (ghi FOUND + lệnh, hoặc ABSENT): số thực thể/loài/Đợt (`masterData.ts`, `npx vitest run src/data`); số test (`npx vitest run`, số `runCase(` trong `qcTestRunner.ts`, số `t.eq|t.expect_error` trong `supabase/tests/`); bảng/RPC (grep `CREATE TABLE IF NOT EXISTS`, `CREATE OR REPLACE FUNCTION public.rpc_` trong migrations); trạng thái module (`17` Phụ lục 1).
2. **Grep tài liệu** `0*_*.md 1*_*.md AGENTS.md`: `155|166|146 thực thể`, `81 loài`, `23 ➔ 45`, `37 Test|TC`, `11 Bảng`, `7 .*RPC`, `C1 ➔ C1[24]`, `v9\.[0-9]`, tên GĐ, prefix lạ `TREE_|DISH_|DEC_|ITEM_`. Chỉ đọc đoạn quanh dòng trúng.
3. **Phân loại:** SAI HIỆN TRẠNG (sửa theo `17`) · THIẾT KẾ ĐÍCH (giữ, ghi rõ "đích") · MÂU THUẪN THIẾT KẾ (PO chọn; `01`/`02`/`04` thắng `13`–`16`).

Báo cáo bảng `File:dòng | Nội dung | Sự thật (nguồn) | Loại | Đề xuất`; kết luận **NHẤT QUÁN** / **CÓ LỆCH (n)** / **NOT ASSESSED** (nói thiếu gì). Agent: `vac-qa`, `vac-designer`.
