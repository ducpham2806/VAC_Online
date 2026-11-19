# Phiếu nghiệm thu staging Godot Web/PWA · 19/11/2026

Thuộc LT-14 bước 4. Gói gốc `3fb5ea0` và gói hoạt ảnh `e26571b` được xuất bằng Godot 4.7.2 trên Mac. Cả hai cùng dùng origin HTTPS, GoTrue và PostgreSQL thử riêng. Cách đóng gói ở [hướng dẫn staging](../GODOT-ONLINE.md#staging-web-và-pwa).

- ✅ Chrome nhận manifest và điều kiện cài PWA. Hiệu ứng lật trang tạo tín hiệu âm thanh trong Web Audio.
- ✅ Một nông trại thử giữ 2.498 vàng và lúa ở P5_7 qua Godot, Phaser, làm mới phiên, tải lại sau mất mạng và quay về Phaser.
- ✅ Đổi giữa hai bản dựng thật. Sau khi đóng/mở trang, worker dùng cache của bản mới, bỏ cache cũ và đọc đúng nông trại. Mã ở `/godot/build-info.json` khớp gói đang phục vụ.
- ✅ Chrome 844×390 mô phỏng giữ joystick và gieo bằng ngón còn lại. Tải lại vẫn còn lúa. Ảnh bản mới ở cả hai cỡ UI-10.
- ✅ WebKit trên Mac ở khung 844×390 mở bản `e26571b` và giữ cùng danh tính khi tải lại.
- ✅ Typecheck, 305 test, build, Web/PWA export và check:docs. Kiểm URL sai bị từ chối trước khi xuất gói.
- iPhone thật đã qua mở từ Safari và icon, chạm gieo và giữ tiến trình sau khi đóng hẳn. Kết quả chi tiết bên dưới.

Một lượt Chrome trên Mac ở bản gốc đo tới khi đọc nông trại khoảng 10,2 giây lúc mở đầu, 7,5 giây khi làm mới phiên và 1,3 giây với cache. Đây là số đo staging, đối chiếu hiệu năng trên điện thoại vẫn còn ở LT-14.

Bằng chứng tại đường dẫn trong `/private/tmp/vac-staging-p1-current`. Tệp `origin` chứa URL tunnel còn hiệu lực khi máy thử chạy. Log `browser.log`, `two-touch.log` và `webkit.log`. Ảnh dùng tiền tố `godot-staging-candidate-` và `godot-staging-lt14-` trong thư mục visualizations của phiên.

## iPhone 14 Pro Max thật

Kiểm trên gói `e26571b` qua iPhone Mirroring, theo màn dọc. Phiên bản iOS chưa ghi.

| Mục | Quan sát |
|---|---|
| Safari mở từ URL | Qua. Vào thư mở đầu. HUD báo 11,9 giây lúc mở và 7,0 giây sau tải lại. |
| Thêm vào Màn hình chính và mở từ icon | Qua. Bật Open as Web App trong Safari. Mở độc lập, không có thanh địa chỉ. HUD báo 11,7 giây. |
| Một ngón và lưu | Qua. Chọn hướng ở Chương 1, chạm ô để đi tới và gieo, vàng từ 2.500 xuống 2.498, hướng dẫn sang bước tưới. HUD thấy 60 FPS trong một lần đi. |
| Đóng rồi mở lại từ icon | Qua. Vuốt bỏ thẻ VAC trong trình đa nhiệm, mở lại icon. Còn ô lúa, 2.498 vàng và bước tưới. HUD báo 13,4 giây. |
| Chuyển từ icon sang tab Safari cùng URL | Không dùng cùng nông trại. Sau tải lại Safari vẫn ở thư mở đầu trong khi icon đã lưu ô lúa. |
| Màn ngang, safe-area ngang, hai ngón, âm thanh và mất mạng | Chưa đo trên máy thật. |
| Android Chrome thật, so tốc độ với Phaser cùng thiết bị | Chưa có kết quả. |

Thời gian và FPS là giá trị đọc được từ HUD, lấy một mẫu cho mỗi lần mở. Bằng chứng là ảnh trong lượt điều khiển iPhone, gồm bố cục ứng dụng không có thanh Safari, trước/sau gieo và lần mở lại. Giữ icon thử trên iPhone để chạy tiếp.

Từ lần thử này, hai cách mở đang giữ hai phiên khách. Bản Web dùng localStorage cho phiên. Theo [WebKit](https://webkit.org/blog/14787/webkit-features-in-safari-17-2/#login-cookies), khi thêm vào Màn hình chính hệ thống có thể sao chép cookie nhưng không sao chép localStorage, và dữ liệu tiếp tục tách riêng sau cài. Vấn đề còn mở nếu đợt thử cần người chơi chuyển nông trại đã chơi trên Safari sang icon. Đề xuất cài trước khi bắt đầu với người mới và cho người có tiến trình tiếp tục dùng cách mở cũ. Chờ PO quyết định luồng cho nhóm thử và chính sách offline theo LT-14.

Hoàn tất phần đóng gói, thử trình duyệt và các mục iPhone đã ghi đạt. Chưa phát hành URL chính và chưa mở nhóm LT-13.

## Hướng dẫn cài iOS trên staging

Nhánh `codex/godot-ios-install-guide` thêm hướng dẫn vào trang xuất Godot do script staging đóng gói. Trang vẫn giữ manifest, icon và vị trí cài cũ. Bản xuất Godot thường giữ hành vi khởi động ban đầu.

- WebKit mô phỏng iPhone mới ở 393×852, 844×390 và 1280×720: hướng dẫn vừa khung, nút ít nhất 44 px. Chưa tải PCK/WASM, gọi Auth hay đọc nông trại trước khi người chơi chọn.
- Chọn chơi trong trình duyệt: tạo một phiên, vào thư mở đầu. Tải lại dùng cùng phiên và bỏ qua hướng dẫn.
- Mở từ icon mô phỏng và Chrome desktop: vào thẳng game. Trên iPhone thật, icon đã cài mở lại nông trại có lúa và 2.498 vàng. Chưa thử màn hướng dẫn mới bằng phiên Safari sạch trên máy thật.
- Typecheck, 305 test, build và check:docs qua. Log `ios-guide-browser.log` và ảnh `godot-ios-guide-*` trong bằng chứng của phiên.

Việc này hướng dẫn người mới chọn cách mở trước khi bắt đầu. Chuyển nông trại đã có từ Safari sang icon còn chờ quyết định phạm vi theo LT-14.

## Đóng và mở lại offline sau lần đầu

- Tái hiện trên gói trước: sau lần đọc nông trại đầu, Chrome có HTML trong CacheStorage. WASM/PCK còn thiếu và mở lại khi ngắt mạng chỉ tới trang lỗi offline.
- Nhánh `codex/godot-pwa-first-load-cache` đợi worker nhận trang trước khi tải WASM/PCK, có giới hạn 4 giây. Khi cache khả dụng, hai tệp được tái dùng từ lần tải đã phục vụ game. Luồng cập nhật vẫn đợi trang cũ đóng.
- Chrome và WebKit trên Mac: hồ sơ mới, mở online một lần, đủ HTML/WASM/PCK và worker kiểm soát trang. Ngắt mạng mô phỏng, đóng tab, mở lại URL, thấy game.
- Chrome: để PLANT hoàn tất trên API thử rồi ngắt phản hồi về trình duyệt. Bấm **Đọc lại** lấy đúng P5_7 có lúa và 2.498 vàng. Mở lại từ cache khi offline, nối mạng và đọc được cùng dữ liệu. Chỉ có một lần gửi PLANT.
- Typecheck, 305 test, build, Web/PWA export và check:docs qua. Log `offline-first-before.log`, `offline-first-chrome.log`, `offline-first-webkit.log` và `offline-drop-with-cache.log` tại thư mục QA. Ảnh có tiền tố `godot-offline-`.
- Chưa ngắt mạng trên iPhone/Android thật. Hồ sơ mạng mô phỏng kiểm bản xem và đọc lại, chưa thay thế mục nghiệm thu thiết bị ở LT-14.
