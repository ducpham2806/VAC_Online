# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 15/11/2026 · Chương 1 trong Godot P1 · ccr-b91fc534-n2yctl
- PO duyệt nhánh vật nuôi, Bếp, đơn HTX: đã merge vào `main` tại `225f9b5`. PO yêu cầu làm tiếp cho xong Chương 1.
- LT-14 bước 3: Godot có cảnh mở đầu chọn hướng (TG-40), hướng dẫn 8 bước của Bác Bảy kèm mũi tên (GP-62), hai NPC có tim với nói chuyện và tặng quà (GP-50), Sổ Gia Phả nhận thưởng Chương 1 (TG-30), âm thanh tổng hợp theo AR-40 có nút tắt. Lời cảnh mở đầu chuyển vào `src/data/sliceStory.ts` để Phaser và Godot dùng chung. HUD hết tràn lề ở 1280×720. Không đổi luật, DB hay kinh tế.
- Kiểm thật: `tools/qa/godot-chapter1-flow.sh` 50/50 bước từ người chơi mới, `godot-p1-9-flow.sh` 41/41. Typecheck, 303 test, build, xuất Web, check:docs và kiểm thử hướng dẫn Phaser qua. Chrome hai cỡ bấm chuột thật qua cảnh mở đầu, NPC, Sổ; 0 lỗi JS. Ảnh `docs/screenshots/godot-ch1-*`.
- Đã code và đẩy nhánh, chưa merge phần Chương 1, chưa deploy. Chưa nghe âm thanh bằng tai (chỉ kiểm không lỗi), chưa thử Supabase thật và điện thoại. Tiếp theo là LT-14 bước 4.

## 15/11/2026 · Vật nuôi, Bếp Củi, đơn HTX trong Godot P1 · ccr-b91fc534-n2yctl
- PO yêu cầu làm tiếp theo kế hoạch, dùng bản Game Studio mới và graphify. Nâng bản ghim Game Studio lên `fa7b1db` (125 skill, 340 file), mở nhóm skill Godot trong INDEX. Dựng lại đồ thị graphify và dùng để tra luật P1-9.
- LT-14 bước 3: Godot có 9 chỗ nuôi (gà, vịt, cá) theo marker `Slot_<id>`, chọn 5 giống, bảng Kho (bán, ăn), Bếp Củi (nấu, lấy món, Nồi Đất) và bảng đơn HTX (giao, bỏ, tự xin đơn). Luật vẫn ở server, không đổi DB hay kinh tế.
- Kiểm thật: `tools/qa/godot-p1-9-flow.sh` chạy cảnh Godot không cửa sổ qua máy chủ thử, 41/41 bước. Typecheck, 303 test, build, xuất Web và check:docs qua. Chrome 1280×720 và 844×390 mở các bảng, 0 lỗi JS, ảnh `docs/screenshots/godot-p1-9-*`.
- Đã code và đẩy nhánh, chưa merge, chưa deploy. Chưa thử với Supabase thật và trên điện thoại. Còn NPC, Chương 1, hướng dẫn và âm thanh của bước 3.

## 14/11/2026 · Merge Godot điền trang vào main · codex/merge-godot-p1-estate
- PO yêu cầu merge main. Nhánh nguồn là `codex/godot-p1-estate` tại `953d210`, bản main trước gộp là `2d42566`.
- Giải quyết ba xung đột thêm cùng file bằng scene `estate_map.tscn`, TileSet và cấu hình Godot của main. Bản đồ 902 ô, tài nguyên và thiết lập Editor của PO được giữ trong cây gộp.
- Kiểm bản gộp bằng typecheck, 303 test, build và check:docs. Godot headless kiểm cảnh, lịch mùa, xác nhận/hủy, thiếu vật liệu và tìm đường. Xuất Web/PWA qua.
- Gộp mã và bàn giao vào main theo duyệt của PO. Còn chuyển vật nuôi, Bếp Củi, đơn HTX và kiểm PWA trên Android/iPhone thật.
