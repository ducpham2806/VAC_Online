# Bàn giao · 10/11/2026 · P0 xong trừ P0-6

## Việc vừa làm
PR #3 (P0) đã merge vào main; nhánh `claude/gifted-faraday-2q851c` làm lại từ main.
- P0-2 ảnh thật: `tools/art/import_sheet.py` nhập 5 tấm ảnh PO tạo → `art/source/p0_ai/` (28 khung).
- QD-80, QD-81 đã quyết (dùng project Supabase cũ, dữ liệu MVP bỏ được). Câu mới: QD-82.

## Đã xác minh
- `python3 tools/art/import_sheet.py --p0`: 0 pixel lạc bảng / gần đen. test:art 6 test PASS.
- typecheck, test, build, check:docs PASS.

## Chưa xác minh
- Độ trễ Edge Function trên Supabase thật (P0-6): kết nối Supabase của Claude chỉ thấy project "Nam_A_CRM", không thấy project VAC `znabynzbcimpesrxxxsz`.
- Ảnh thật chưa đóng atlas, chưa vào game (làm ở P1).

## Bước tiếp theo
1. PO nối kết nối Supabase tới tài khoản/tổ chức chứa project VAC → P0-6: áp `prototypes/p0-4-edge/supabase/migrations/0001_state_ledger.sql` (bảng mới, không trùng bảng MVP), deploy `apply-actions`, đo p95 (< 400 ms).
2. PO trả lời QD-82 (cỡ gà; lúa không ụ bùn).
3. Lập thẻ P1 (vertical slice, `07` LT-03): viết lại schema theo ADR-002 (QD-81), scene đi bộ + HUD lai theo UI-20, dùng sprite `art/source/p0_ai/`.

## Bối cảnh giữ nguyên
- Code game đang chạy vẫn theo thiết kế cũ (KY-90). DB MVP `0001 → 0014` chưa đổi.
- Không đụng project Supabase "Nam_A_CRM" (không phải của VAC).
- Môi trường cloud riêng `VAC_Online` (chỉ mở thêm `api.openai.com`), chưa lưu khóa nào.
