# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 10/11/2026 · P1-10 Bước 1: đề xuất số liệu, chờ PO (QD-83) · claude/gifted-faraday-2q851c
- Impact report: (1) core VAC: thêm vòng dọn chướng ngại → vật liệu → sửa hạng mục, không đổi gieo/tưới/gặt; (2) kinh tế: CÓ — 2 vật liệu mới `MAT_GO`/`MAT_DA`, giá sửa, ⚡ dọn đá/gốc cây (KT-20 "chốt ở P1"), khai hoang thêm 22 ô ruộng; (3) art/UI: hạng mục đổ nát/đã sửa vẽ tạm từ atlas `world` (tô tối + đống gạch), cần PO tạo ảnh thật sau; (4) module cũ: MVP không đổi, engine thêm 3 action `CLEAR`/`REPAIR`/`RECLAIM`, bản lưu bản thử lên version 2 có `migrate`; (5) DB: chưa (P1-8 BLOCKED), engine dùng chung nên không viết luật SQL riêng.
- Tổng chi để sửa đủ 3 hạng mục: 1.200🪙 + 12 Gỗ + 6 Đá; bản đồ có 3 cụm gốc cây (15 Gỗ) và 3 tảng đá (9 Đá), dư một chút. Người mới có 2.500🪙. Vật liệu hữu hạn trong bản thử (không mọc lại).
- Khai hoang: vùng 1 (8 ô) 500🪙, vùng 2 (14 ô) 625🪙, mỗi vùng 5⚡ +45 XP +25 Phong Thủy. Sửa hạng mục +20/30/40 Phong Thủy (giếng/chuồng/nhà); mốc thưởng Phong Thủy để sau.
- **Dừng ở:** chờ PO duyệt QD-83 (hoặc sửa số), rồi mới code P1-10.

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
