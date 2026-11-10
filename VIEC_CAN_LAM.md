# VIỆC CẦN LÀM — VAC Online (Hương Đồng Gió Nội)

Danh sách việc duy nhất. Xong thì `[x]` + gạch + ghi ngày, không xóa dòng.
- Quyết định chờ PO: [docs/08_QUYET_DINH.md](docs/08_QUYET_DINH.md) (không chép lại ở đây).
- Thẻ việc phát triển: [docs/07_LO_TRINH.md](docs/07_LO_TRINH.md) LT-10.
- Bản cũ của file này (sprint S0–S5, việc đã xong): [docs/archive/VIEC_CAN_LAM-2026-11-10-truoc-rut-gon.md](docs/archive/VIEC_CAN_LAM-2026-11-10-truoc-rut-gon.md).

## A. Việc anh (PO)
### A0. Duyệt bộ tài liệu mới (2026-11-10)
- [ ] Đọc `docs/00_TONG_QUAN.md` → `01_GAMEPLAY.md` → `08_QUYET_DINH.md`. Sửa hoặc duyệt các mục "(đề xuất)".
- [ ] Trả lời các câu `QD-83 … QD-99` ở `08`. Gấp nhất: QD-92 (build lại), QD-91 (nguồn ảnh), QD-86 (bản đồ tile 32), QD-93 (miền Bắc).
- [ ] Trong lúc chờ: tạm dừng mở GĐ2 bản cũ (A1) hay vẫn làm tiếp?

### A1. Supabase / Vercel (bản MVP cũ — chỉ cần nếu vẫn mở GĐ2 cũ)
- [ ] Áp `0015_app_config_stage.sql`. Supabase sẽ hỏi xác nhận vì có `DROP POLICY IF EXISTS`.
- [ ] Mở GĐ2:
  - deploy Vercel với `VITE_GAME_STAGE=2`;
  - chạy `UPDATE public.app_config SET value = '2' WHERE key = 'game_stage';` (quay lại thì đặt `'1'`).
- [ ] Thử bản chạy thử GĐ2: https://claude.ai/artifact/Ujwb3Y19GPA24rTgxCt7vP
- [ ] Bật **Leaked password protection**: Dashboard → Authentication → Password.
- [ ] Xóa user test "Smoke Test" (`f1598bb5-…`).
- [ ] Thêm `{{ .Token }}` vào email template Reset Password.
- [ ] Quyết định giữ hay xóa hàm `rls_auto_enable()` (không phải của dự án).

## B. Đang làm — P0 Chốt nền (`docs/07_LO_TRINH.md` LT-10)
- [x] ~~P0-1 Bộ tài liệu mới `docs/00 → 08`~~ ✅ 2026-11-10
- [ ] P0-2 5 sprite mẫu theo hướng mới (chờ QD-91)
- [ ] P0-3 ADR kiến trúc + dữ liệu (thêm cột `seasons`) (chờ QD-92)
- [ ] P0-4 Thử nghiệm Edge Function một bản luật
- [ ] P0-5 Wireframe HUD điều khiển lai (`docs/06_UI_UX.md` UI-20)

## F. Nhật ký
Nhật ký chính: [docs/WORKLOG.md](docs/WORKLOG.md) (≤ 3 mục). Việc đã xong: [docs/COMPLETED.md](docs/COMPLETED.md).
