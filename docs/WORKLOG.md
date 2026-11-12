# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 12/11/2026 · Lịch mùa trong Godot P1 · codex/godot-p1-seasons
- PO duyệt làm tiếp LT-14 bước 3. Godot hiển thị ngày trong mùa, đổi nền cỏ bằng bốn ảnh P1 và báo khi lúa trái vụ. Lịch build từ dữ liệu chuẩn, dùng giờ máy chủ.
- Chrome 1280×720 và 844×390 qua bốn mùa, Thu chuyển Đông khi đang chơi. Gặt và bán lúa trong Đông, gieo lại khi sang Xuân. Chạm ô và nút trái vụ đều không gửi lệnh. WebKit đọc đúng cây đã lưu.
- Typecheck, 303 test, build, Godot headless và Web/PWA export, check:docs và audit bốn ảnh qua. Chụp ảnh hai cỡ.
- Dừng ở bản cục bộ và nhánh chờ PO duyệt. Tiếp theo chuyển điền trang. Staging trước vẫn dùng để thử mở từ icon, cảm ứng và hiệu năng trên điện thoại thật.

## 12/11/2026 · Staging Godot Web/PWA · codex/godot-staging-pwa
- PO duyệt triển khai staging. Xuất Phaser và Godot cùng origin HTTPS tạm qua Cloudflare Tunnel, dùng Supabase Auth và PostgreSQL thử trên Mac.
- Godot Web dùng lại phiên Phaser qua Supabase SDK. Chrome và WebKit giữ cùng tài khoản. Chrome kiểm ô, kho, vàng, XP, token bị từ chối, hàng chờ Phaser và bán ở Godot rồi đọc lại trên Phaser.
- Chrome qua kiểm cài PWA, mở cache offline và giữ joystick khi gieo ở 844×390. Một lượt đo trên Mac tới khi đọc nông trại là 10,3 giây lần đầu và 1,4 giây khi tải lại. Typecheck, 303 test, build và check:docs qua.
- Dừng ở staging tạm chờ kiểm Android/iPhone thật và duyệt merge. Tiến trình người chơi thật chưa chuyển.

## 12/11/2026 · Godot lưu online · codex/godot-luu-online
- PO yêu cầu tiếp tục LT-14. Dùng skill Supabase. Web/native dùng chung transport, đăng nhập ẩn danh, làm mới phiên và lưu bản xem theo tài khoản. Nhật ký LT-13 bật bằng cấu hình.
- Chrome với Supabase Auth và PostgreSQL cục bộ chạy hết vòng. Token bị từ chối thì làm mới cùng tài khoản. Lệnh gieo mất phản hồi được đối chiếu bằng đọc lại, sổ cái ghi một lần. PWA đọc cache khi offline.
- WebKit có nông trại riêng, Godot native mở lại giữ phiên. Typecheck, 303 test, build Godot Web, check:docs qua. Ảnh hai cỡ đã chụp.
- Dừng ở nhánh chờ PO duyệt. Còn kiểm staging, phiên Phaser và thiết bị thật. Chưa triển khai lên Supabase thật.
