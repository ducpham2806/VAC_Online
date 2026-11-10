---
paths:
  - "docs/**"
  - "AGENTS.md"
  - "VIEC_CAN_LAM.md"
---

# Tài liệu — RULE D0 (chuyển thể từ CCGS `design-docs`)

- Bản đồ "thông tin nào ở file nào": `docs/00_TONG_QUAN.md` TQ-04. Sửa ở file sở hữu, nơi khác chỉ dẫn mã mục (`GP-nn`, `KT-nn`…). Không chép bảng hay luật sang file khác.
- Mỗi luật / công thức là một heading `### XX-nn · Tên`; mã đã dùng không đổi số. Bỏ mục thì để lại heading kèm "(bỏ — QD-nn)".
- Con số chỉ ở `docs/03_KINH_TE.md` hoặc dữ liệu (`data/`, `GAME_CATALOG`). Quyết định của PO chỉ ở `docs/08_QUYET_DINH.md`.
- `docs/01 → 06` mô tả **thiết kế đích**; hiện trạng code chỉ ghi ở `docs/04_KY_THUAT.md` KY-90.
- Công thức có định nghĩa biến, ví dụ; tiêu chí nghiệm thu kiểm được đúng/sai. Viết ngắn, không emoji trang trí, không văn quảng bá.
- Sửa xong chạy `npm run check:docs` (mã mục, link, trần ký tự). Đổi luật/số thì `/vac-propagate-change`.
- Bộ cũ `docs_archive_merged/v1-2026-11-10/` chỉ đọc để truy vết, không sửa, không dẫn làm nguồn chuẩn.
