# Phiếu nghiệm thu staging Godot Web/PWA · 19/11/2026

Thuộc LT-14 bước 4. Gói gốc `3fb5ea0` và gói hoạt ảnh `e26571b` được xuất bằng Godot 4.7.2 trên Mac. Cả hai cùng dùng origin HTTPS, GoTrue và PostgreSQL thử riêng. Cách đóng gói ở [hướng dẫn staging](../GODOT-ONLINE.md#staging-web-và-pwa).

- ✅ Chrome nhận manifest và điều kiện cài PWA. Hiệu ứng lật trang tạo tín hiệu âm thanh trong Web Audio.
- ✅ Một nông trại thử giữ 2.498 vàng và lúa ở P5_7 qua Godot, Phaser, làm mới phiên, tải lại sau mất mạng và quay về Phaser.
- ✅ Đổi giữa hai bản dựng thật. Sau khi đóng/mở trang, worker dùng cache của bản mới, bỏ cache cũ và đọc đúng nông trại. Mã ở `/godot/build-info.json` khớp gói đang phục vụ.
- ✅ Chrome 844×390 mô phỏng giữ joystick và gieo bằng ngón còn lại. Tải lại vẫn còn lúa. Ảnh bản mới ở cả hai cỡ UI-10.
- ✅ WebKit trên Mac ở khung 844×390 mở bản `e26571b` và giữ cùng danh tính khi tải lại.
- ✅ Typecheck, 305 test, build, Web/PWA export và check:docs. Kiểm URL sai bị từ chối trước khi xuất gói.
- Chưa nghiệm thu trên thiết bị thật. Còn mở từ icon, nhiều ngón, safe-area, âm thanh và hiệu năng. Ghi vào [phiếu thiết bị](../GODOT-ONLINE.md#phiếu-thử-pwa-trên-thiết-bị).

Một lượt Chrome trên Mac ở bản gốc đo tới khi đọc nông trại khoảng 10,2 giây lúc mở đầu, 7,5 giây khi làm mới phiên và 1,3 giây với cache. Đây là số đo staging, đối chiếu hiệu năng trên điện thoại vẫn còn ở LT-14.

Bằng chứng tại đường dẫn trong `/private/tmp/vac-staging-p1-current`. Tệp `origin` chứa URL tunnel còn hiệu lực khi máy thử chạy. Log `browser.log`, `two-touch.log` và `webkit.log`. Ảnh dùng tiền tố `godot-staging-candidate-` và `godot-staging-lt14-` trong thư mục visualizations của phiên.

Hoàn tất phần đóng gói và thử trình duyệt. Chưa phát hành URL chính và chưa mở nhóm LT-13.
