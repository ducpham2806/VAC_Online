# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 11/11/2026 · Nhập 6 ảnh P1 của PO (nhà, giếng, chuồng gà, NPC, chân dung) · claude/gifted-faraday-2q851c
- PO đẩy 6 ảnh lên `main` (`9450a80`); gộp `main` vào nhánh. `import_sheet.py --p1` → `art/source/p1_ai/` 17 khung (0 lạc bảng, 0 pixel đen, alpha 0/255, đúng cỡ AR-20) → atlas `public/assets/atlas/estate.*`; chân dung → `public/assets/portraits/`.
- `?p1`: nhà/giếng/chuồng gà đổi khung đổ nát → đã sửa (bỏ tô tối), chuồng gà tre đặt ở góc sân; Bác Bảy, Cô Hương dùng ảnh mới (2 khung đứng, 2 khung nói khi mở hộp thoại); chân dung trong hộp thoại NPC và cảnh mở đầu (Bá Kiến).
- Kiểm: typecheck, 270 test, build, test:art, check:docs PASS; smoke 2 cỡ + người mới theo hướng dẫn (844×390) PASS, 0 lỗi JS, 0 nút < 44 px. Ảnh: `docs/screenshots/p1-art-estate-{broken,repaired}-1280x720.png`.
- **Dừng ở:** còn hình tạm: cây đa, đá, cỏ dại, rào (atlas `world`). NPC nhìn hơi mảnh hơn người chơi — chờ PO xem.

## 10/11/2026 · P1-11 DONE (QD-84 PO duyệt) · claude/gifted-faraday-2q851c
- PO duyệt QD-84 theo đề xuất. Ghi `03` KT-19 (mới), `01` GP-50, GP-62, `02` TG-40, `04` KY-90.
- Code: `src/domain/npc.ts` (tim, nói chuyện, tặng quà theo ngày giờ VN), `src/domain/story.ts` (chọn hướng, Chương 1, thưởng từ `src/data/quests.ts`), `src/data/npcs.ts`; engine thêm `TALK`/`GIFT`/`CHOOSE_PATH`/`CLAIM_CHAPTER`; `sliceTutorial.ts` 8 bước, mũi tên chỉ chỗ lấy vật liệu khi thiếu; HUD `SliceStoryHud.tsx` (cảnh mở đầu, thanh hướng dẫn chạm xuyên, hộp thoại NPC, Sổ Gia Phả); NPC trên bản đồ có 💬. Bản lưu version 3 (đọc được v1, v2).
- Kiểm: typecheck, 270 test (+20), build, test:art, check:docs PASS. `tools/qa/p1-tutorial-smoke.cjs` (mới) 2 cỡ: người mới theo đúng thanh hướng dẫn đi hết 8 bước rồi nhận Chương 1, không kẹt, 0 lỗi JS (cho lúa chín ngay). `p1-slice-smoke.cjs` 2 cỡ: thêm cảnh mở đầu, Gia Phả, tặng quà, nhận Chương 1; 0 nút < 44 px.
- Sửa trong lúc kiểm: thanh hướng dẫn che ruộng ở 844×390 → cho chạm xuyên. Lưu ý: chạy kiểm khói thì đừng sửa file khi Vite đang chạy (Vite tải lại trang).
- **Dừng ở:** P1-9 chờ PO duyệt 8 loài; P1-8 chờ quyền Supabase; sau đó P1-12 chơi thử.

## 10/11/2026 · P1-10 DONE (QD-83 PO duyệt) · claude/gifted-faraday-2q851c
- PO duyệt QD-83 theo đề xuất (giếng khóa tưới cả loạt, vật liệu hữu hạn, khai hoang theo vùng). Ghi vào `03` KT-15 (viết lại theo vùng), KT-18 (mới), KT-20; `01` GP-02, GP-14; tiền tố `MAT_` vào TQ-06 + AGENTS D1.4.
- Code: `src/domain/estate.ts` (dọn / sửa / khai hoang, hàm thuần), bố cục chuyển sang `src/data/estateLayout.ts`; engine thêm `CLEAR`/`REPAIR`/`RECLAIM` + khóa tưới 1 ô/lô khi giếng chưa sửa; `estateTarget.ts` (chạm đối tượng ra việc gì); store hỏi lại trước khi tiêu vàng (`pending`); scene: đá/cây biến mất khi dọn, hạng mục đổ nát xỉn tối + biển "cần sửa", chuồng chưa sửa không có gà, vùng kế tiếp có khung mờ; Kho hiện vật liệu + Phong Thủy. Bản lưu lên version 2 (đọc được v1).
- Kiểm: typecheck, 250 test (+25), build, check:docs PASS. Smoke 2 cỡ: tưới khi giếng hỏng 1/6 ô; dọn 2 đá + 3 gốc cây, sửa đủ 3 hạng mục (Phong Thủy 90), khai hoang vùng 1 (+8 ô); sau khi sửa giếng kéo tưới cả loạt; tải lại giữ tiến trình; 0 nút < 44 px.
- Chưa: không có SQL vì 3 thao tác mới chỉ chạy trong engine dùng chung (Edge Function, P1-8). Hình đổ nát/đã sửa vẫn là hình tạm.
- **Dừng ở:** P1-9 chờ PO duyệt 8 loài; P1-8 chờ quyền Supabase; P1-11 làm được (cần P1-10 ✓).
