---
name: vac-scope-check
description: "So một yêu cầu/tính năng mới với pha đang chạy trong docs/07_LO_TRINH.md của VAC Online, đo mức phình phạm vi và đề xuất cắt/hoãn — phù hợp dự án 1 người + AI. Dùng khi có yêu cầu mới giữa sprint hoặc trước khi lập kế hoạch."
argument-hint: "<yêu cầu mới>"
allowed-tools: Read, Grep, Glob
---

# /vac-scope-check (chuyển thể từ CCGS `scope-check`)

## Bước 1 — Phạm vi gốc
Đọc `docs/07_LO_TRINH.md` (pha hiện tại, thẻ việc LT-10, phần ngoài 1.0 LT-04) và trụ cột `docs/00_TONG_QUAN.md` TQ-03, kèm giai đoạn đang mở (`GAME_STAGE` trong `src/config/features.ts`).

## Bước 2 — Phân loại yêu cầu mới
- **Trong phạm vi:** thuộc sprint hiện tại.
- **Kéo sớm:** thuộc sprint hoặc giai đoạn sau.
- **Ngoài lộ trình:** không có trong `docs/00`–`08`.
- **Đụng cờ đỏ:** core loop VAC, kinh tế hoặc DB (RULE D1).

## Bước 3 — Ước lượng (1 người + AI)
Cho mỗi yêu cầu: số file/lớp phải đụng (domain, SQL, store, UI, art, tài liệu), có cần migration không, có cần asset không, rủi ro hồi quy.

## Báo cáo
| Yêu cầu | Loại | Công sức (S/M/L) | Ảnh hưởng tới sprint | Đề xuất |
|---|---|---|---|---|

**Mức phình** = công sức thêm ÷ công sức sprint gốc. Trên 20% thì phải đề xuất cắt hoặc hoãn thứ khác.
Kết luận: **NHẬN** / **NHẬN NHƯNG CẮT X** / **HOÃN SANG Sn** / **TỪ CHỐI**. PO quyết.
Agent: `vac-designer`.
