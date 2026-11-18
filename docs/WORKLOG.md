# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 18/11/2026 · Nhật ký chơi thử Godot P1 · codex/godot-p1-playtest-report
- PO yêu cầu phát triển tiếp. Nối mốc hướng dẫn và DONE vào nhật ký LT-13. Hàng chờ lưu theo tài khoản và tự thử lại. Mã chơi thử ở cuối Sổ Gia Phả.
- Godot online cục bộ qua Supabase Auth và PostgreSQL thử chạy Chương 1 50/50. Xuất view và chạy báo cáo thật, nhận đúng tám bước, DONE và nhận thưởng. D1 còn 0 người đủ điều kiện vì đây là lượt diễn tập.
- Chrome hai cỡ gửi phiên và mốc MOVE, có ảnh. Typecheck, 305 test, build, xuất Web/PWA và check:docs qua. Đã code trên nhánh riêng, chưa bật nhật ký trên URL thử công khai. Còn kiểm PWA trên Android/iPhone và chờ duyệt phát hành.

## 18/11/2026 · Giữ bản lưu Phaser khi thử Godot P1 · codex/godot-p1-save-qa
- PO duyệt tiếp LT-14 bước 4. Tái hiện online ghi đè bản offline vì dùng chung ô lưu. Tách ô lưu cho `?p1&offline` và sao chép một lần bản chung còn trong trình duyệt.
- Chrome staging 1280×720 và 844×390 đọc mẫu v1 sau khi mở online. Giữ 4.321 vàng, 3 lúa và lựa chọn mở đầu qua tải lại. Godot đợi hàng chờ, Phaser gửi một lần và Godot thấy đúng ô lúa. Chụp đủ hai cỡ.
- Typecheck, 305 test, build và check:docs qua. Bản sửa chạy trên staging, chờ duyệt merge. Còn kiểm Android/iPhone thật và chốt phương án online/offline trước phát hành.
- PO yêu cầu tiếp tục kiểm PWA. Chrome 844×390 mô phỏng hai ngón giữ joystick, gieo và tải lại đúng ô. Mac kết nối iPhone 14 Pro Max qua iPhone Mirroring, điều khiển Safari gián đoạn trước khi mở staging. Chrome trên Mac thiếu lệnh cài qua DevTools. Chờ thử từ icon trực tiếp trên iPhone và Android.

## 18/11/2026 · Staging phát hành Godot P1 · codex/godot-p1-release-qa
- PO duyệt tiếp LT-14 bước 4. Dựng lại Godot và Phaser cùng origin HTTPS tạm, dùng Supabase Auth và PostgreSQL thử trên Mac.
- Chrome giữ cùng tài khoản, ô lúa và vàng qua hai client. Giả lập token lỗi thì làm mới phiên. Đạt kiểm điều kiện cài PWA, xem bản lưu khi mất mạng, kết nối lại, nhận phiên bản cache mới và mở lại nông trại trên Phaser. WebKit mở được cảnh đầu. Chrome phát tín hiệu âm thanh khi chuyển trang.
- Đo một lượt Chrome trên Mac từ tải đến đọc nông trại, 10,0 giây lần đầu và 1,3 giây với cache. Chụp ảnh hai cỡ. Typecheck, 303 test, build, Godot Web/PWA và check:docs qua.
- Script kiểm fixture chạy trên macOS bằng Python và tách cache từng lượt. Chương 1 qua 50/50, vật nuôi/Bếp/đơn HTX qua 41/41. Chờ kiểm mở từ icon, cảm ứng, âm thanh và hiệu năng trên Android/iPhone thật, cùng phương án cho bản lưu offline cũ.
