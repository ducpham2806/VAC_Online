# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 10/11/2026 · P1-6 + P1-7 DONE · claude/gifted-faraday-2q851c
- P1-6: cỏ Hạ/Thu sinh từ cỏ Xuân bằng đổi màu khóa bảng (AR-11), atlas `slice` 30 khung; scene đổi cỏ, tông ao và tán cây theo mùa; đất hoang tô sẫm để luôn thấy ranh giới. Công tắc mùa trong ⚙️ (Lịch thật / 4 mùa); engine nhận `ctx.season` tùy chọn (chỉ client bản thử). Túi hạt lọc theo mùa đang áp dụng; mùa không có giống thì báo rõ.
- P1-7: `useSliceStore` lưu `vac_slice_save_v1` (version 1, chỉ lưu save + giống + công tắc mùa); bản hỏng/khác phiên bản → chơi lại; `reconcileSliceSave` khớp ô ruộng với bản đồ. Nút "Chơi lại từ đầu" có xác nhận.
- Kiểm: typecheck, 225 test (+9), build, test:art, check:docs PASS. `tools/qa/p1-slice-smoke.cjs` 2 cỡ: 4 mùa đổi đúng (bản đồ + HUD), Đông túi hạt trống, tải lại trang giữ ô đã gieo và vàng; 0 nút < 44 px; 0 lỗi JS.
- **Dừng ở:** P1-8 chờ quyền Supabase project VAC; P1-9 chờ PO duyệt 8 loài; P1-10 (sửa nhà/giếng/chuồng, khai hoang) làm được ngay.

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
