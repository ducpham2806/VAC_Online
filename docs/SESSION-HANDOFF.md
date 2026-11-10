# Bàn giao · 10/11/2026 · DOCS-01 xong, chờ PO duyệt

## Việc vừa làm
Nhánh `claude/gifted-faraday-2q851c`.
- Thay bộ tài liệu `00 → 17` bằng `docs/00 → 08` theo hướng PO chọn: Green Farm 3 + Harvest Moon, điều khiển lai, 4 mùa, 1 miền trước (QD-12…17).
- Bộ cũ ở `docs_archive_merged/v1-2026-11-10/`. Dữ liệu ở `data/catalog.csv`.
- Trước đó cùng ngày: cài Game Studio + Graphify, hệ nhật ký (TOOLING-01).

## Đã xác minh
- typecheck, 178 test, build, check:docs PASS.
- `check:docs` kiểm mã mục, link, trần ký tự. Đã thử: dẫn mã không tồn tại thì bị báo lỗi.

## Chưa xác minh
- CI GitHub cho nhánh. Chưa merge.
- Nội dung "(đề xuất)" trong `01`/`03` chưa được PO đọc.

## Bước tiếp theo
1. PO trả lời `VIEC_CAN_LAM.md` A0 (QD-83…99 ở `docs/08_QUYET_DINH.md`). Mỗi câu trả lời: chuyển dòng sang "Đã quyết", sửa mục có mã liên quan, chạy `npm run check:docs`.
2. Sau QD-92 + QD-86: làm P0-3 (ADR + cột `seasons`), P0-5 (wireframe HUD lai). Sau QD-91: làm P0-2 (sprite mẫu).

## Bối cảnh giữ nguyên
- Code vẫn theo thiết kế cũ (`docs/04_KY_THUAT.md` KY-90).
- Supabase thật đã chạy `0001 → 0014`; `0015` chưa áp.
