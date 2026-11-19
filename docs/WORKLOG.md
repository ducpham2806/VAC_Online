# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 19/11/2026 · Nhịp đi bốn hướng theo sheet PO · codex/godot-walk-reference
- Đọc hàng Walk. Mỗi hướng có hai nhịp qua dưới hông xen hai nhịp đặt chân, thêm vươn và dồn lực. Bốn khung nguồn vẫn dùng trực tiếp. Khung mới giữ thân và cụm giày gốc, chỉnh vị trí chân theo góc. Dáng đi tính theo quãng đường, tốc độ điều khiển giữ nguyên.
- F6 đi bốn hướng. Motion 35/35, Chương 1 50/50, 305 test, 9 test art, typecheck, build, Web và check:docs qua. Mở cảnh farm và preview ở hai cỡ. Có dải khung và video.
- Đã code trên nhánh kế thừa cache PWA. Chưa merge hoặc đổi staging. Dừng ở nghiệm thu hình ảnh bốn hướng.

## 19/11/2026 · Cache Web/PWA lần mở đầu · codex/godot-pwa-first-load-cache
- Tiếp LT-14. Tái hiện lần đọc nông trại đầu có HTML trong cache nhưng thiếu WASM/PCK. Bản xuất đợi worker nhận trang trước khi tải gói, có giới hạn chờ và nạp online dự phòng.
- Chrome/WebKit đóng và mở lại ngay khi ngắt mạng sau lần đầu, có game từ cache. Chrome thử gieo đã ghi trên server nhưng rơi phản hồi. Đọc lại giữ 2.498 vàng và đúng ô lúa, không gửi lại gieo.
- Typecheck, 305 test, build, xuất Web và check:docs qua. Đang thử trên staging. Còn nghiệm thu trực tiếp offline, ngang, hai ngón, âm thanh trên iPhone và Android thật.

## 19/11/2026 · Nghiệm thu staging Web/PWA · codex/godot-pwa-staging-qa
- Tiếp LT-14 bước 4. Thêm script đóng gói Phaser và Godot từ cùng commit để phục vụ cùng origin, kèm checksum. Xuất `3fb5ea0` và `e26571b` bằng Godot trên Mac.
- HTTPS staging dùng GoTrue và PostgreSQL thử. Chrome giữ một danh tính và ô lúa/2.498 vàng sau làm mới phiên, mất mạng, cập nhật PWA và quay Phaser. Hai ngón mô phỏng đạt. WebKit giữ phiên khi tải lại bản mới. Typecheck, 305 test, build, check:docs qua.
- Đang phục vụ `e26571b` trên tunnel thử. Chưa phát hành URL chính. Còn nghiệm thu Android thật và PO chốt offline. Xem [phiếu staging](qa/GODOT-PWA-STAGING-2026-11-19.md).
- iPhone 14 Pro Max cài icon qua Safari, gieo thử, đóng hẳn rồi mở lại vẫn giữ ô lúa và 2.498 vàng. Safari tải lại vẫn ở thư mở đầu. Hai nơi mở có phiên khách riêng. Chờ thử màn ngang, hai ngón, âm thanh và offline thật; cần chốt luồng iPhone cho nhóm thử. check:docs qua.
- `codex/godot-ios-install-guide` thêm hướng dẫn iOS mới ngay trên staging. WebKit ba cỡ xác nhận đợi lựa chọn trước khi tải hoặc đăng nhập. Phiên cũ, icon và Chrome vào thẳng. Icon iPhone đã cài còn 2.498 vàng. 305 test, typecheck, build, check:docs qua. Còn nghiệm thu Android và các mục iPhone LT-14.
