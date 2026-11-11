# Bàn giao · 11/11/2026 · P1 đang chạy (P1-1…11 xong; P1-12 chờ PO mời người chơi)

## Việc vừa làm
Mã P1-8 đã có trên `main` tại `c58623e`. Đã rà lại cấu trúc repo và bộ công cụ agent, xem WORKLOG.
- QD-82 áp bằng script; atlas `slice`; engine ở `src/engine/`; scene đi bộ `?p1` (`src/game/slice/`).
- P1-4/5: chạm ô, kéo cả loạt, nút hành động, HUD lai, Kho bán HTX (`src/domain/tools.ts`, `src/store/useSliceStore.ts`, `src/ui/hud/SliceHud.tsx`).
- P1-6/7: mùa trên bản đồ + công tắc mùa (⚙️), lưu cục bộ `vac_slice_save_v1`.
- P1-10 (QD-83): dọn đá/gốc cây → Gỗ/Đá, sửa giếng/chuồng/nhà, khai hoang 2 vùng (`src/domain/estate.ts`, `src/game/slice/estateTarget.ts`).
- P1-11 (QD-84): cảnh mở đầu, 2 NPC có tim, Sổ Gia Phả Chương 1, hướng dẫn 8 bước (`src/domain/npc.ts`, `story.ts`, `src/game/slice/sliceTutorial.ts`, `src/ui/hud/SliceStoryHud.tsx`).
- P1-9 (QD-86, QD-87): 8 loài (`src/data/sliceContent.ts`), chỗ nuôi + Bếp Củi (`src/domain/estate.ts`), đơn HTX (`src/domain/orders.ts`), HUD `src/ui/hud/SliceKitchenHud.tsx`; engine `ctx.slice`.
- Hoạt ảnh nông trại P1 ở `codex/p1-hoat-anh-nong-trai`, chờ PO duyệt (AR-30, AR-31). Chrome hai cỡ, P1-9 và hướng dẫn 844×390 PASS.
- Thẻ P1: `docs/07_LO_TRINH.md` LT-12.

## Đã xác minh
- Lần nghiệm thu P1-8: typecheck, 303 test, test:sql, build, check:docs PASS ([nhật ký 11/11](archive/WORKLOG-2026-11.md)). Lần rà soát cục bộ sau đó xác nhận build và check:docs.
- `tools/qa/p1-tutorial-smoke.cjs`: người mới theo hướng dẫn đi hết 8 bước + nhận Chương 1 ở 2 cỡ, không kẹt.
- `tools/qa/p1-slice-smoke.cjs` (cần `npx vite --port 5179`): cả vòng gieo → bán, điền trang (dọn, sửa, khai hoang, giếng mở tưới cả loạt), 4 mùa, tải lại giữ tiến trình ở 2 cỡ, 0 nút < 44 px, 0 lỗi JS.
- Playwright `?p1` ở 1280×720 và 844×390: chạm đi tới, joystick, 0 lỗi JS. Ảnh: `docs/screenshots/p1-3-*.png`.

## Chưa xác minh
- Trên điện thoại thật (cảm ứng nhiều ngón, safe-area).
- Online trên điện thoại thật của người chơi ở Việt Nam (đã đo từ máy cloud, chưa đo từ VN).

## Bước tiếp theo
1. P1-12: PO triển khai link (`npm run build` → `dist/`), mời 10–20 người; xuất số liệu `select json_agg(log) from public.playtest_logs;` → `npm run playtest:report`.
2. Hỏi PO có xóa dữ liệu kiểm thử trên DB thật không (VIEC_CAN_LAM).
3. Kiểm trên điện thoại thật: ô trắng sau khung mùa ở 844×390 (nghi lỗi chụp headless).

## Bối cảnh giữ nguyên
- Game mặc định (không `?p1`) vẫn là MVP cũ (KY-90). Bảng MVP chưa đổi; DB thật đã có thêm `0016` (P1-8). `?p1` mặc định chơi online; `?p1&offline` chơi trên máy (kiểm thử khói dùng cách này).
- Không đụng project Supabase "Nam_A_CRM".
- Mọi hình điền trang trong `?p1` (nhà, giếng, chuồng, NPC, cây đa, tre, đá, cỏ dại, rào) đã là ảnh thật của PO (atlas `estate`, `python3 tools/art/import_sheet.py --p1` rồi `pack_atlas.py art/source/p1_ai --name estate`).
