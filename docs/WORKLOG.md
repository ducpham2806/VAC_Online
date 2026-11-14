# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 14/11/2026 · Merge Godot điền trang vào main · codex/merge-godot-p1-estate
- PO yêu cầu merge main. Nhánh nguồn là `codex/godot-p1-estate` tại `953d210`, bản main trước gộp là `2d42566`.
- Giải quyết ba xung đột thêm cùng file bằng scene `estate_map.tscn`, TileSet và cấu hình Godot của main. Bản đồ 902 ô, tài nguyên và thiết lập Editor của PO được giữ trong cây gộp.
- Kiểm bản gộp bằng typecheck, 303 test, build và check:docs. Godot headless kiểm cảnh, lịch mùa, xác nhận/hủy, thiếu vật liệu và tìm đường. Xuất Web/PWA qua.
- Gộp mã và bàn giao vào main theo duyệt của PO. Còn chuyển vật nuôi, Bếp Củi, đơn HTX và kiểm PWA trên Android/iPhone thật.

## 13/11/2026 · Điền trang Godot P1 · codex/godot-p1-estate
- PO duyệt làm tiếp LT-14 bước 3. Chuyển dọn, sửa và khai hoang theo GP-14. Dùng sprite P1 và dữ liệu engine. Cảnh có marker chỉnh tay, tán cây và ao đổi màu theo mùa.
- Godot headless kiểm sáu chướng ngại, sửa giếng/chuồng/nhà, hai vùng mở tới 28 ô ruộng, xác nhận chi phí, tưới cả loạt và đọc lại. Chrome hai cỡ kiểm hủy, mở vùng, gieo ô mới, kéo hai ô. WebKit đọc lại tiến trình.
- Typecheck, 303 test, build, Web/PWA export, check:docs và audit ảnh qua. Đã chụp 1280×720 và 844×390.
- Dừng ở bản chạy cục bộ và nhánh chờ duyệt. Còn chuyển vật nuôi, Bếp Củi và đơn HTX, cùng kiểm PWA trên thiết bị thật.

## 12/11/2026 · Lịch mùa trong Godot P1 · codex/godot-p1-seasons
- PO duyệt làm tiếp LT-14 bước 3. Godot hiển thị ngày trong mùa, đổi nền cỏ bằng bốn ảnh P1 và báo khi lúa trái vụ. Lịch build từ dữ liệu chuẩn, dùng giờ máy chủ.
- Chrome 1280×720 và 844×390 qua bốn mùa, Thu chuyển Đông khi đang chơi. Gặt và bán lúa trong Đông, gieo lại khi sang Xuân. Chạm ô và nút trái vụ đều không gửi lệnh. WebKit đọc đúng cây đã lưu.
- Typecheck, 303 test, build, Godot headless và Web/PWA export, check:docs và audit bốn ảnh qua. Chụp ảnh hai cỡ.
- Dừng ở bản cục bộ và nhánh chờ PO duyệt. Tiếp theo chuyển điền trang. Staging trước vẫn dùng để thử mở từ icon, cảm ứng và hiệu năng trên điện thoại thật.
