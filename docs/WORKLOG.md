# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

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

## 12/11/2026 · Vòng ruộng Godot · codex/godot-vong-ruong
- PO duyệt làm tiếp LT-14. Dùng godot-gameplay-scripter. Một ô lúa nhận gieo, tưới, gặt theo trạng thái, kho có nút bán. Cảnh chỉnh được hình cây, đất ướt và VFX.
- Fixture Deno gọi engine, tăng tốc đồng hồ và giữ nông trại riêng trong bộ nhớ. Chrome 1280×720 và 844×390 chơi hết vòng, tải lại giữ kho, vàng/XP/thể lực đúng. WebKit đọc lại đúng kết quả.
- 303 test, typecheck, build, Godot headless và Web/PWA export, check:docs và kiểm 5 PNG qua. Ảnh hai cỡ đã chụp. Hai cột cỏ PO tô còn ở bản cục bộ.
- Dừng ở nhánh chờ PO duyệt, máy Mac có ô trống để thử. Còn kiểm điện thoại thật và mốc lưu online LT-14.
