# VIỆC CẦN LÀM — VAC Online (Hương Đồng Gió Nội)

Danh sách việc duy nhất. Xong thì `[x]` + gạch + ghi ngày, không xóa dòng.
- Quyết định chờ PO: [docs/08_QUYET_DINH.md](docs/08_QUYET_DINH.md) (không chép lại ở đây).
- Thẻ việc phát triển: [docs/07_LO_TRINH.md](docs/07_LO_TRINH.md) LT-10.
- Bản cũ của file này (sprint S0–S5, việc đã xong): [docs/archive/VIEC_CAN_LAM-2026-11-10-truoc-rut-gon.md](docs/archive/VIEC_CAN_LAM-2026-11-10-truoc-rut-gon.md).

## A. Việc anh (PO)
### A0. Câu hỏi đang chờ anh (`docs/08_QUYET_DINH.md`)
- [x] ~~Duyệt bộ tài liệu mới + mọi đề xuất~~ ✅ 2026-11-10 (QD-18…32)
- [x] ~~QD-81: Supabase cho bản làm lại~~ ✅ 2026-11-10 — dùng project cũ, dữ liệu MVP bỏ được.
- [x] ~~QD-80: tạo 5 ảnh mẫu~~ ✅ 2026-11-10 — đã nhập vào `art/source/p0_ai/`.
- [ ] Kết nối Supabase của Claude đang trỏ vào tài khoản chỉ có project "Nam_A_CRM". Cần nối tài khoản/tổ chức chứa project VAC (`znabynzbcimpesrxxxsz`) → mở khóa P0-6.
- [x] ~~QD-82: cỡ gà + ảnh lúa không ụ bùn~~ ✅ 2026-11-10 (áp bằng script, không cần tạo lại ảnh).
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
- [x] ~~P0-2 5 sprite mẫu (hình vẽ code; ảnh thật chờ QD-80)~~ ✅ 2026-11-10
- [x] ~~P0-3 ADR kiến trúc + cột `Seasons`~~ ✅ 2026-11-10
- [x] ~~P0-4 Thử nghiệm Edge Function một bản luật (máy cục bộ)~~ ✅ 2026-11-10
- [x] ~~P0-5 Wireframe HUD điều khiển lai~~ ✅ 2026-11-10
- [ ] P0-6 Đo độ trễ trên Supabase thật (chờ kết nối Supabase tới project VAC)
- [x] ~~Lập thẻ P1 vertical slice~~ ✅ 2026-11-10 (`docs/07_LO_TRINH.md` LT-12)

## C. Đang làm — P1 Vertical slice (`docs/07_LO_TRINH.md` LT-12)
- [x] ~~P1-1 Atlas `slice`~~ ✅ 2026-11-10
- [x] ~~P1-2 Engine vào `src/engine/`~~ ✅ 2026-11-10
- [x] ~~P1-3 Scene điền trang đi bộ (`?p1`)~~ ✅ 2026-11-10
- [x] ~~P1-4 Chạm ô / kéo làm cả loạt~~ ✅ 2026-11-10
- [x] ~~P1-5 HUD lai~~ ✅ 2026-11-10
- [x] ~~P1-6 Mùa trên bản đồ + công tắc đổi mùa~~ ✅ 2026-11-10
- [x] ~~P1-7 Lưu cục bộ~~ ✅ 2026-11-10
- [x] ~~Duyệt số liệu P1-10 (QD-83)~~ ✅ 2026-11-10
- [x] ~~P1-10 Sửa nhà/giếng/chuồng + khai hoang~~ ✅ 2026-11-10
- [ ] Thử `?p1` trên điện thoại thật (anh)
- [ ] PO duyệt danh sách 8 loài cho P1-9 (khi tới thẻ đó)

## F. Nhật ký
Nhật ký chính: [docs/WORKLOG.md](docs/WORKLOG.md) (≤ 3 mục). Việc đã xong: [docs/COMPLETED.md](docs/COMPLETED.md).
