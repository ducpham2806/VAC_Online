# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 12/11/2026 · Camera nông trại Godot · codex/godot-camera-nong-trai
- PO yêu cầu tiếp tục LT-14. Camera bám chân, kéo đất trống hoặc hai ngón để xem, giới hạn theo lớp Ground. HUD và joystick neo màn hình. Scene chính mở trên Mac.
- Chrome mô phỏng 1280×720 và 844×390 kiểm kéo, giữ góc nhìn, chạm đúng ô sau kéo cùng joystick, bám lại và giữ mép. Mỗi lần ghi một giao dịch thử. WebKit đọc đúng ô đã lưu.
- Typecheck, 303 test, build, Godot headless, Web/PWA export và check:docs qua. Chụp ảnh hai cỡ.
- Dừng ở nhánh chờ PO duyệt. Bước 0 còn kiểm điện thoại thật. Bước 1 còn vòng ruộng bằng fixture.

## 12/11/2026 · Joystick hai ngón trong Godot · codex/godot-joystick-cam-ung
- PO yêu cầu tiếp tục. Dùng godot-ui-control, dựng joystick nổi góc dưới trái trong scene chỉnh tay. Nhập clip đi phải đã bỏ khung sai hướng. Hai cột cỏ PO tô vẫn ở bản cục bộ.
- Chrome mô phỏng 1280×720 và 844×390: giữ joystick, dùng ngón khác gieo đúng một lần trên PostgreSQL tạm. Kéo qua ô, thả ngón, hủy chạm và nút HUD đều qua. Chụp ảnh hai cỡ.
- Godot headless kiểm vùng chết, giới hạn lực, mất focus và resize. Mở scene trong Godot Editor trên Mac. Typecheck, 303 test, build, Web/PWA export và check:docs qua.
- Dừng ở nhánh chờ PO duyệt, còn kiểm joystick, safe-area và mở từ icon trên điện thoại thật theo LT-14.

## 11/11/2026 · Hoạt ảnh đi và gieo trong Godot · codex/godot-hoat-anh-di-gieo
- PO yêu cầu làm tiếp trên Mac. Godot có chạm để đi, phím mũi tên/WASD, hoạt ảnh 4 hướng và thứ tự lớp theo chân. Hai cột cỏ PO tô vẫn nằm trong bản cục bộ.
- Mở SpriteFrames trong Editor. Dùng godot-animation và vac-asset-audit. Kiểm 16 PNG về kích thước, nền, viền và bảng màu. Bỏ khung đi phải quay sai hướng khỏi clip Godot.
- Godot headless kiểm đi/dừng, phím ngắt chạm và VFX chỉ sau xác nhận gieo. Chrome hai cỡ và WebKit mô phỏng qua. Ảnh xác nhận che khuất, di chuyển và hiệu ứng. PostgreSQL tạm ghi một giao dịch.
- Typecheck, 303 test, build, Godot Web/PWA export và check:docs qua. Dừng ở nhánh chờ PO duyệt, còn kiểm điện thoại thật.
