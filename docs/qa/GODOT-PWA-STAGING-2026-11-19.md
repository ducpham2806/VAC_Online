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

## Bản main sau merge

Ngày 19/11/2026, xuất `5687b0ef21951e7fef58a30bd76d7dc82414ab84` bằng Godot 4.7.2 trên Mac và cập nhật cùng origin HTTPS. Hai client dùng chung môi trường thử. Thay bản dựng staging, giữ dịch vụ và DB thử đang chạy.

| Tiêu chí | Kết quả |
|---|---|
| Chuyển gói PWA từ `ca63b20` | Chrome giữ gói cũ khi tab còn mở. Sau khi đóng mở, SHA-256 của PCK trong cache trùng `build-info.json` của `5687b0e`. Cùng phiên khách, ô P5_7 có lúa và 2.498 vàng. |
| Offline rồi nối mạng | Chrome mở game bằng gói mới từ cache khi ngắt mạng mô phỏng. Nối mạng và tải lại, đọc được cùng ô lúa và số vàng. WebKit trên Mac cũng mở offline sau một lần vào online. |
| Quay lại Phaser `/?p1` | Chrome đọc cùng phiên, ô lúa và 2.498 vàng trên bản Phaser đóng gói cùng commit. |
| iPhone 14 Pro Max mở lại từ icon | Qua iPhone Mirroring màn dọc. Đóng hẳn thẻ VAC rồi mở lại. Còn ruộng lúa chín, 1.970 vàng, 2 lúa trong kho và bước 5/8. Chạm ô trống di chuyển được, HUD thấy 60 FPS trong lượt đi. HUD báo 10,1 giây sau lần đóng hẳn. Chưa đối chiếu SHA-256 gói ngay trên iPhone. |
| Nghiệm thu thiết bị còn lại | Chờ Android thật và thử ngang, hai ngón, âm thanh, offline trên iPhone thật. Giữ dấu mốc trước khi mở URL chính và nhóm P1-12. |

Typecheck, 305 test, build, xuất Web và check:docs qua. Log `main-5687b0e-update.log`, `main-5687b0e-current.log` và `main-5687b0e-webkit.log` trong thư mục staging. Lượt nâng cấp đầu đã qua kiểm SHA-256 và dữ liệu. Bộ lọc log ban đầu bỏ qua query của request Phaser, nên kiểm quay về Phaser được chạy lại với bộ lọc đã sửa. Ảnh 844×390, 1280×720 và offline có tiền tố `godot-main-5687b0e-`. Phần cập nhật staging và kiểm trình duyệt đã xong, cổng phát hành LT-14 còn mở.

## Ngang, hai chạm, âm thanh và offline trên bản staging hiện tại

| Kiểm tra | Kết quả trên `5687b0e` |
|---|---|
| Vùng an toàn WebKit mô phỏng iPhone | 844×390 với lề khuyết 55 px trái rồi phải, phần nền HUD trên dịch đúng 55 px ở cả hai đầu. Đổi sang 393×852 có ảnh bố cục dọc. |
| Tiếng nút trên WebKit mô phỏng | SHA-256 PCK khớp. Bộ phân tích ở đầu ra WebAudio đọc khoảng −34 dBFS quanh 880 Hz sau khi chạm nút, nền im lặng. Còn nghe tiếng trực tiếp trên iPhone. |
| Hai chạm Chrome mô phỏng Android | Một ngón giữ joystick, ngón kia chạm gieo. Web nhận hai điểm chạm, gửi một PLANT, trừ đúng 2 vàng, tải lại còn lúa ở P5_7. |
| Mở offline với cấu hình iPhone standalone mô phỏng | Có sẵn gói game trong cache. Đóng tab, giả lập mất mạng và mở lại thấy nông trại. Nối mạng, bấm **Đọc lại**, phiên và ô P5_7 cùng 2.498 vàng khớp. |
| Thiết bị thật | Lượt này iPhone Mirroring không có cửa sổ để điều khiển, Mac chưa thấy Android. Còn xác nhận ngang, hai ngón, âm thanh và mất mạng trực tiếp. |

Ảnh tiền tố `godot-lt14-current-`. Log `lt14-current-device.log`, `lt14-current-two-touch.log`, `lt14-ios-standalone-offline.log`. Trang đo âm thanh và SHA-256 tạm tại `/godot/lt14-device-check-5687b0e.html` trên cùng origin staging. Trang ghi tín hiệu bằng WebAudio trong trình duyệt và giữ trang mở từ icon như cũ.

Khi có thiết bị, mở icon đã cài, xoay ngang và kiểm HUD hai chiều. Thử giữ joystick và dùng ngón còn lại chạm ô trên nông trại thử, nghe tiếng nút, đóng app khi mất mạng rồi mở lại. Nối mạng, bấm **Đọc lại** và so ô ruộng, vàng, bước hướng dẫn. Android cần thử cả Chrome từ URL và từ icon, ghi tải đầu, tải lại và FPS để đối chiếu Phaser.

## Cập nhật PWA rồi mở lại offline

PO chọn tiếp tục mô phỏng. Dùng gói `ca63b20` đã cache đủ và đưa `5687b0e` lên origin loopback thử riêng khi cửa sổ cũ còn mở. Chrome và WebKit đều có worker chờ cùng cache mới thiếu WASM/PCK. Ngắt mạng, đóng cửa sổ cũ rồi mở lại thấy trang báo offline thay cho game.

Nhánh `codex/godot-pwa-offline-update` chờ cache hoàn tất trong bước cài worker mới. Godot 4.7.2 xuất gói thử. So SHA-256 của PCK trong cache với tệp xuất ở từng lượt. Vòng đời cài worker theo [đặc tả Service Workers](https://www.w3.org/TR/service-workers/#extendableevent-waituntil).

| Kịch bản | Chrome và WebKit |
|---|---|
| Tải đủ bản cập nhật, rồi ngắt mạng và đóng/mở | Game mở bằng đúng PCK mới. Trong khi cửa sổ cũ còn mở, cả hai gói đều nằm trong cache. |
| WASM của bản cập nhật trả HTTP 503 | Worker cập nhật không cài xong. Đóng/mở offline vẫn chạy bằng PCK cũ. |
| Hồ sơ mới mở lần đầu | WASM được tải một lần. Lần đóng/mở offline dùng cache. |

WebKit qua hai tình huống cắt kết nối của thao tác gieo, dùng hai tài khoản thử HTTPS. Mô phỏng lỗi trước khi chuyển yêu cầu tới API thì **Đọc lại** thấy 2.500 vàng và ô P5_7 trống. Chuyển yêu cầu tới API, xác nhận server đã ghi rồi mô phỏng mất phản hồi về game thì **Đọc lại** thấy 2.498 vàng và P5_7 có lúa. Godot thử gọi PLANT một lần mỗi lượt. Khâu đọc lại chỉ gửi yêu cầu lấy trạng thái.

Ảnh 844×390 và 1280×720, tiền tố `godot-lt14-`. Log `lt14-update-repro*.log`, `lt14-update-fixed-*.log`, `lt14-update-failed-*.log`, `lt14-update-fresh-*.log` và `lt14-action-boundaries.log` tại thư mục staging. Typecheck, 305 test, build, xuất Web và check:docs qua. Staging HTTPS tiếp tục phục vụ `5687b0e`.

## Nâng cấp trên HTTPS staging · 21/11/2026

Dựng lại cả hai client của `5687b0e` và `d325444` bằng Godot 4.7.2 cho cùng origin HTTPS tạm. Dùng GoTrue và PostgreSQL cô lập. Kiểm trên Chrome desktop và WebKit mô phỏng iPhone mở từ icon. Bản dựng để lại trên staging là `d325444`.

| Tiêu chí | Chrome và WebKit |
|---|---|
| Chuẩn bị trên `5687b0e` | PCK trong cache khớp SHA-256 bản cũ. Gieo ô P5_7 qua API thử, tải lại thấy lúa và 2.498 vàng. |
| Đổi bản khi cửa sổ cũ còn mở | `build-info.json` báo `d325444`. Worker mới chờ với PCK đúng SHA-256 và WASM đã có trong cache. Worker cũ vẫn điều khiển cửa sổ. |
| Ngắt mạng trước khi đóng rồi mở lại | Game khởi động từ cache của `d325444`, còn phiên khách, ô lúa và 2.498 vàng. Cache cũ đã được dọn. |
| Nối mạng và tải lại | Cùng tài khoản đọc ô P5_7 có lúa và 2.498 vàng từ server thử. Không có lỗi JavaScript chưa xử lý. |

Typecheck, 305 test, build cả hai client, xuất Web và check:docs qua. Ảnh offline 844×390 và 1280×720 cho mỗi trình duyệt, cùng log `verify-upgrade-full.log`, nằm tại thư mục staging được trỏ bởi `/private/tmp/vac-staging-p1-current`.

Cổng LT-14 bước 4 còn nghiệm thu trên Android/iPhone thật và các quyết định phát hành đã ghi trong bàn giao.
