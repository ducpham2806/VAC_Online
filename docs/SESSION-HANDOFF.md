# Bàn giao · 10/11/2026 · P1 đang chạy (P1-1…7, P1-10 xong)

## Việc vừa làm
Nhánh `claude/gifted-faraday-2q851c` (PR #3 cũ đã merge; phần này chưa có PR).
- QD-82 áp bằng script; atlas `slice`; engine ở `src/engine/`; scene đi bộ `?p1` (`src/game/slice/`).
- P1-4/5: chạm ô, kéo cả loạt, nút hành động, HUD lai, Kho bán HTX (`src/domain/tools.ts`, `src/store/useSliceStore.ts`, `src/ui/hud/SliceHud.tsx`).
- P1-6/7: mùa trên bản đồ + công tắc mùa (⚙️), lưu cục bộ `vac_slice_save_v1`.
- P1-10 (QD-83): dọn đá/gốc cây → Gỗ/Đá, sửa giếng/chuồng/nhà, khai hoang 2 vùng (`src/domain/estate.ts`, `src/game/slice/estateTarget.ts`).
- Thẻ P1: `docs/07_LO_TRINH.md` LT-12.

## Đã xác minh
- typecheck, 250 test, build, test:art, check:docs PASS.
- `tools/qa/p1-slice-smoke.cjs` (cần `npx vite --port 5179`): cả vòng gieo → bán, điền trang (dọn, sửa, khai hoang, giếng mở tưới cả loạt), 4 mùa, tải lại giữ tiến trình ở 2 cỡ, 0 nút < 44 px, 0 lỗi JS.
- Playwright `?p1` ở 1280×720 và 844×390: chạm đi tới, joystick, 0 lỗi JS. Ảnh: `docs/screenshots/p1-3-*.png`.

## Chưa xác minh
- Trên điện thoại thật (cảm ứng nhiều ngón, safe-area).
- P0-6 / P1-8: kết nối Supabase của Claude chỉ thấy project "Nam_A_CRM", không thấy project VAC `znabynzbcimpesrxxxsz`.

## Bước tiếp theo
1. P1-11: 2 NPC có tim, Chương 1 (mở khi sửa nhà), hướng dẫn 15 phút đầu — làm được, cần impact report (core loop).
2. P1-9: cần PO duyệt 8 loài (5 cây, 2 vật nuôi, 1 cá) 2 mùa Bắc Bộ.
3. P1-8 khi có quyền Supabase project VAC.
4. Kiểm trên điện thoại thật: ô trắng sau khung mùa ở 844×390 (nghi lỗi chụp headless).

## Bối cảnh giữ nguyên
- Game mặc định (không `?p1`) vẫn là MVP cũ (KY-90). DB MVP chưa đổi.
- Không đụng project Supabase "Nam_A_CRM".
- Nhà/giếng/cây/đá (cả trạng thái đổ nát/đã sửa) trong `?p1` đang dùng hình vẽ code của atlas `world` (tạm, cần art thật trước P1-12).
