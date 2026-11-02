---
paths:
  - "0*_*.md"
  - "1*_*.md"
  - "AGENTS.md"
---

# Tài liệu — RULE D0 (chuyển thể từ CCGS `design-docs`)

- `00 → 16` mô tả **thiết kế đích**. **Hiện trạng thật** (số thực thể, test, bảng/RPC, module xong chưa) chỉ ghi ở `17_PROJECT_AUDIT…md`. Không sửa số hiện trạng rải rác ở file khác.
- Không chép lại bảng giữa các file; dẫn link tới file gốc (Single Source of Truth trong `AGENTS.md`).
- Công thức phải có định nghĩa biến, khoảng giá trị và ví dụ. Edge case phải nói rõ chuyện gì xảy ra. Tiêu chí nghiệm thu phải kiểm được đúng/sai.
- Tài liệu lớn (>30 KB): đọc theo đoạn (offset/limit), không đọc cả file; hook `read-guard` sẽ nhắc.
- Đổi con số trong `01`/`02` thì chạy `/vac-propagate-change`. Định kỳ chạy `/vac-consistency-check`.
