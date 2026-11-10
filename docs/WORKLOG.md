# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 10/11/2026 · P1-4 + P1-5 DONE · claude/gifted-faraday-2q851c
- P1-4: `src/domain/tools.ts` (GP-02 công cụ tự chọn, tầm 1 ô, kéo cả loạt ≤ 12 ô chốt công cụ theo ô đầu, giai đoạn hình cây); `useSliceStore` gọi `applyActions`; scene: chạm ô xa → đi tới rồi làm, kéo trên ruộng = làm cả loạt, kéo chỗ khác = xem bản đồ. Bản đồ: 6 ô ruộng + đất hoang.
- P1-5: `src/ui/hud/SliceHud.tsx` theo UI-20/30: cấp + XP, mùa + còn N ngày, 🪙💎⚡, nút hành động, thanh công cụ thu gọn 8 ô, túi hạt lọc mùa, dock (Kho bán HTX; Đơn/Gia Phả/Bạn báo thẻ sau), thông báo. Thêm `.touch-btn-44`.
- GP-02 và UI-20 ghi thêm luật tầm làm việc, chốt công cụ khi kéo, nút hành động.
- Kiểm: typecheck, 216 test (+15), build, test:art, check:docs PASS. `tools/qa/p1-slice-smoke.cjs` ở 1280×720 + 844×390: gieo 1 + kéo gieo 5, kéo tưới 6, nút gặt 1 + kéo gặt 5, bán 12 lúa +48 🪙; 0 nút < 44 px; 0 lỗi JS.
- Lưu ý: ảnh chụp toàn màn ở 844×390 có ô trắng sau khung mùa khi đang có thông báo; chụp 1 pixel thì đúng màu — nghi lỗi chụp của Chromium headless trên canvas WebGL, chưa kiểm trên máy thật.
- **Dừng ở:** P1-6 (mùa trên bản đồ, công tắc đổi mùa), P1-7 (lưu cục bộ). P1-8 chờ quyền Supabase.

## 10/11/2026 · P1-1…3 DONE + QD-82 · claude/gifted-faraday-2q851c
- QD-82 (PO đồng ý): `import_sheet.py` thêm `fit` (gà ~40×40 trong khung 48) và `strip_soil` (lúa bỏ ụ bùn); không cần PO tạo lại ảnh. +1 test asset.
- Thẻ P1 viết ở `07` LT-12 (12 thẻ; P1-8 BLOCKED chờ quyền Supabase project VAC).
- P1-1: atlas `public/assets/atlas/slice.*` (28 khung), audit: 0 pixel đen, 100% bảng 64 màu, đúng cỡ.
- P1-2: engine chuyển `prototypes/p0-4-edge/engine.ts` → `src/engine/applyActions.ts`; prototype chỉ re-export; `build-engine.sh` vẫn đóng gói được.
- P1-3: `src/game/slice/` — bản đồ 30×18 ô, A* tìm đường (chạm vật cản → ô sát nó), joystick nổi góc dưới trái, kéo xem bản đồ; mở bằng `?p1`, game MVP không đổi. 11 test mới. Chạy thật Playwright 1280×720 + 844×390: chạm đi tới ô (11,9), joystick đi phải 4 ô, 0 lỗi JS; ảnh `docs/screenshots/p1-3-*.png`.
- Kiểm: typecheck, 201 test, build, test:art, check:docs PASS.
- **Dừng ở:** P1-4 (chạm ô → công cụ tự chọn, kéo làm cả loạt, gọi engine) và P1-5 (HUD). P0-6/P1-8 chờ quyền Supabase.

## 10/11/2026 · P0-2 ảnh thật (QD-80) + QD-81 · claude/gifted-faraday-2q851c (PR #3 đã merge; nhánh làm lại từ main)
- PO đẩy 5 tấm ảnh AI vào `art/source/inbox/` (commit `b2448fc` trên main). Viết `tools/art/import_sheet.py`: cắt nhiều khung/tấm, chung tỉ lệ thu, thu bằng màu đa số; lật gương hàng "trái" (ảnh AI vẽ cả 2 hàng quay phải); cắt mép ô nền để lát liền.
- Kết quả `art/source/p0_ai/`: 28 khung, 0 pixel lạc bảng / gần đen; `preview_x4.png`, cảnh ghép `scene_x3.png`. Thêm 3 test vào `test_pipeline.py`.
- QD-81: PO cho dùng project Supabase cũ, dữ liệu MVP bỏ được, viết lại schema một lần (thay QD-20; KY-31, AGENTS D1.4).
- P0-6 **BLOCKED**: kết nối Supabase của phiên chỉ thấy project "Nam_A_CRM", không thấy project VAC `znabynzbcimpesrxxxsz`. Không đụng project CRM.
- Kiểm: test:art (6 test), check:docs, typecheck, test, build — xem commit.
- **Dừng ở:** PO nối Supabase tới project VAC → P0-6; PO trả lời QD-82 (cỡ gà, lúa không ụ bùn); lập thẻ P1.
