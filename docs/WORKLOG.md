# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 19/11/2026 · Godot main trên staging · codex/godot-main-staging-qa
- Xuất `5687b0e` trên Mac và đưa lên cùng URL HTTPS thử. Chrome xác nhận PCK đổi từ `ca63b20`, giữ cùng phiên, lúa và 2.498 vàng. Mở offline, nối mạng rồi quay Phaser đều giữ dữ liệu. WebKit mở lại offline. Có ảnh 1280×720 và 844×390.
- iPhone 14 Pro Max đóng hẳn, mở icon và giữ ruộng lúa chín, 1.970 vàng và bước 5/8. Chạm đất trống đi được. Chưa đo mã gói trên iPhone. Chi tiết ở [phiếu staging](qa/GODOT-PWA-STAGING-2026-11-19.md).
- Typecheck, 305 test, build, xuất Web và check:docs qua. Còn kiểm Android thật và màn ngang, hai ngón, tiếng và mất mạng trên iPhone theo LT-14.

## 19/11/2026 · Nhịp đi bốn hướng theo sheet PO · codex/godot-walk-reference
- Đọc hàng Walk. Mỗi hướng có hai nhịp qua dưới hông xen hai nhịp đặt chân, thêm vươn và dồn lực. Bốn khung nguồn vẫn dùng trực tiếp. Khung mới giữ thân và cụm giày gốc, chỉnh vị trí chân theo góc. Dáng đi tính theo quãng đường, tốc độ điều khiển giữ nguyên.
- F6 đi bốn hướng. Motion 35/35, Chương 1 50/50, 305 test, 9 test art, typecheck, build, Web và check:docs qua. Mở cảnh farm và preview ở hai cỡ. Có dải khung và video.
- PO duyệt merge `001f209` vào `main`. Gộp bước đi cùng hoạt ảnh, safe-area và các sửa PWA kế thừa. Chưa đổi staging. Còn cổng nghiệm thu thiết bị LT-14.

## 19/11/2026 · Cache Web/PWA lần mở đầu · codex/godot-pwa-first-load-cache
- Tiếp LT-14. Tái hiện lần đọc nông trại đầu có HTML trong cache nhưng thiếu WASM/PCK. Bản xuất đợi worker nhận trang trước khi tải gói, có giới hạn chờ và nạp online dự phòng.
- Chrome/WebKit đóng và mở lại ngay khi ngắt mạng sau lần đầu, có game từ cache. Chrome thử gieo đã ghi trên server nhưng rơi phản hồi. Đọc lại giữ 2.498 vàng và đúng ô lúa, không gửi lại gieo.
- Typecheck, 305 test, build, xuất Web và check:docs qua. Đang thử trên staging. Còn nghiệm thu trực tiếp offline, ngang, hai ngón, âm thanh trên iPhone và Android thật.
