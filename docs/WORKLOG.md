# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 19/11/2026 · Cập nhật PWA và mở lại offline · codex/godot-pwa-offline-update
- PO chọn tiếp tục mô phỏng. Tái hiện lỗi trên Chrome và WebKit khi bản cập nhật đã chờ, mất mạng rồi đóng/mở game. Worker kích hoạt với cache thiếu WASM/PCK.
- Script xuất Web chờ nạp đủ tài nguyên của bản cập nhật. Chrome/WebKit mở game offline từ gói mới, giữ cache cũ nếu WASM trả 503 và chỉ tải WASM một lần ở hồ sơ mới. Xuất Web Godot 4.7.2, typecheck, 305 test, build và check:docs qua.
- WebKit trên HTTPS staging cắt yêu cầu gieo trước khi gửi và cắt phản hồi sau khi server lưu. Đọc lại cho kết quả tương ứng 2.500 vàng/ô trống và 2.498 vàng/có lúa, mỗi lượt chỉ có một lần bấm gieo.
- Sửa trên nhánh riêng, bản staging chính vẫn là `5687b0e`. Còn thử nâng cấp ở HTTPS staging và nghiệm thu thiết bị LT-14. Xem [phiếu staging](qa/GODOT-PWA-STAGING-2026-11-19.md#cập-nhật-pwa-rồi-mở-lại-offline).

## 19/11/2026 · Godot main trên staging · codex/godot-main-staging-qa
- Xuất `5687b0e` trên Mac và đưa lên cùng URL HTTPS thử. Chrome xác nhận PCK đổi từ `ca63b20`, giữ cùng phiên, lúa và 2.498 vàng. Mở offline, nối mạng rồi quay Phaser đều giữ dữ liệu. WebKit mở lại offline. Có ảnh 1280×720 và 844×390.
- iPhone 14 Pro Max đóng hẳn, mở icon và giữ ruộng lúa chín, 1.970 vàng và bước 5/8. Chạm đất trống đi được. Chưa đo mã gói trên iPhone. Chi tiết ở [phiếu staging](qa/GODOT-PWA-STAGING-2026-11-19.md).
- Typecheck, 305 test, build, xuất Web và check:docs qua. Còn kiểm Android thật và màn ngang, hai ngón, tiếng và mất mạng trên iPhone theo LT-14.
- `codex/godot-lt14-device-checks` thử tiếp `5687b0e`: WebKit đo tiếng nút 880 Hz, HUD dịch 55 px khi đổi phía vùng khuyết, mở standalone offline và Đọc lại giữ lúa/vàng. Chrome mô phỏng Android dùng hai điểm chạm, gửi một lần gieo. iPhone Mirroring trả `cgWindowNotFound`, Mac chưa thấy Android. Chờ thiết bị cho mục nghiệm thu thật.

## 19/11/2026 · Nhịp đi bốn hướng theo sheet PO · codex/godot-walk-reference
- Đọc hàng Walk. Mỗi hướng có hai nhịp qua dưới hông xen hai nhịp đặt chân, thêm vươn và dồn lực. Bốn khung nguồn vẫn dùng trực tiếp. Khung mới giữ thân và cụm giày gốc, chỉnh vị trí chân theo góc. Dáng đi tính theo quãng đường, tốc độ điều khiển giữ nguyên.
- F6 đi bốn hướng. Motion 35/35, Chương 1 50/50, 305 test, 9 test art, typecheck, build, Web và check:docs qua. Mở cảnh farm và preview ở hai cỡ. Có dải khung và video.
- PO duyệt merge `001f209` vào `main`. Gộp bước đi cùng hoạt ảnh, safe-area và các sửa PWA kế thừa. Chưa đổi staging. Còn cổng nghiệm thu thiết bị LT-14.
