# Bàn giao · 10/11/2026 · P1 đang chạy (P1-1…3 xong)

## Việc vừa làm
Nhánh `claude/gifted-faraday-2q851c` (PR #3 cũ đã merge; phần này chưa có PR).
- QD-82 áp bằng script; atlas `slice`; engine ở `src/engine/`; scene đi bộ `?p1` (`src/game/slice/`).
- Thẻ P1: `docs/07_LO_TRINH.md` LT-12.

## Đã xác minh
- typecheck, 201 test, build, test:art, check:docs PASS.
- Playwright `?p1` ở 1280×720 và 844×390: chạm đi tới, joystick, 0 lỗi JS. Ảnh: `docs/screenshots/p1-3-*.png`.

## Chưa xác minh
- Trên điện thoại thật (cảm ứng nhiều ngón, safe-area).
- P0-6 / P1-8: kết nối Supabase của Claude chỉ thấy project "Nam_A_CRM", không thấy project VAC `znabynzbcimpesrxxxsz`.

## Bước tiếp theo
1. P1-4: chạm ô ruộng → công cụ tự chọn (GP-02), ở xa thì đi tới (đã có `pathToward`) rồi gọi `applyActions`; kéo trên ô = làm cả loạt ≤ 12 ô (KT-16). Hiện kéo đâu cũng là xem bản đồ.
2. P1-5: HUD React theo wireframe `docs/wireframes/` (thanh công cụ thu gọn).
3. P1-7 lưu cục bộ, rồi P1-8 khi có quyền Supabase.

## Bối cảnh giữ nguyên
- Game mặc định (không `?p1`) vẫn là MVP cũ (KY-90). DB MVP chưa đổi.
- Không đụng project Supabase "Nam_A_CRM".
- Nhà/giếng/cây/đá trong `?p1` đang dùng hình vẽ code của atlas `world` (tạm, cần art thật trước P1-12).
