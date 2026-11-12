# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 12/11/2026 · Vòng ruộng Godot · codex/godot-vong-ruong
- PO duyệt làm tiếp LT-14. Dùng godot-gameplay-scripter. Một ô lúa nhận gieo, tưới, gặt theo trạng thái, kho có nút bán. Cảnh chỉnh được hình cây, đất ướt và VFX.
- Fixture Deno gọi engine, tăng tốc đồng hồ và giữ nông trại riêng trong bộ nhớ. Chrome 1280×720 và 844×390 chơi hết vòng, tải lại giữ kho, vàng/XP/thể lực đúng. WebKit đọc lại đúng kết quả.
- 303 test, typecheck, build, Godot headless và Web/PWA export, check:docs và kiểm 5 PNG qua. Ảnh hai cỡ đã chụp. Hai cột cỏ PO tô còn ở bản cục bộ.
- Dừng ở nhánh chờ PO duyệt, máy Mac có ô trống để thử. Còn kiểm điện thoại thật và mốc lưu online LT-14.

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
