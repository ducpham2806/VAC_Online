---
name: vac-scope-check
description: "So một yêu cầu/tính năng mới với sprint đang chạy trong file 17 của VAC Online, đo mức phình phạm vi và đề xuất cắt/hoãn — phù hợp dự án 1 người + AI. Dùng khi có yêu cầu mới giữa sprint hoặc trước khi lập kế hoạch."
argument-hint: "<yêu cầu mới>"
allowed-tools: Read, Grep, Glob
---

# /vac-scope-check
1. **Phạm vi gốc:** `17` Phần C (sprint hiện tại) + `VIEC_CAN_LAM.md` mục B + runbook GĐ đang mở (`src/config/features.ts`).
2. **Phân loại:** Trong phạm vi · Kéo sớm (sprint/GĐ sau) · Ngoài lộ trình (không có trong `00`–`17`) · Cờ đỏ (core VAC, kinh tế, DB).
3. **Ước lượng (1 người + AI):** số lớp phải đụng (domain, SQL, store, UI, art, tài liệu), cần migration/asset không, rủi ro hồi quy.

Báo cáo bảng `Yêu cầu | Loại | Công sức S/M/L | Ảnh hưởng sprint | Đề xuất`. Mức phình = công sức thêm ÷ sprint gốc; > 20% → đề xuất cắt/hoãn. Kết luận **NHẬN** / **NHẬN NHƯNG CẮT X** / **HOÃN SANG Sn** / **TỪ CHỐI**; PO quyết. Agent: `vac-designer`.
