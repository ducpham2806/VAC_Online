# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

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

## 19/11/2026 · Sửa hoạt ảnh nông trại Godot · codex/godot-living-farm-animation
- PO yêu cầu sửa theo prompt repo. Đối chiếu `p0_samples`, `p1_estate_npc`, `p1_nature` và AR-30. Gà/vịt có nghỉ, mổ, rỉa lông, bước ngắn; cá lặn/nổi/nhảy; chân điền chủ theo quãng đường, sửa thứ tự đi ngang và hướng phải. NPC thở, nói, bước quanh trong vùng marker. Cây/lúa có gió giữ gốc. Dùng khung sẵn có, chưa có clip NPC đi đủ hướng.
- Thêm cảnh `animation_preview.tscn` chạy F6 không chạm bản lưu. Godot trên Mac xuất Web; kiểm chuyển động 19/19, Chương 1 50/50, vật nuôi/Bếp/đơn 41/41. Chrome cảnh thật và preview hai cỡ UI-10 không lỗi; đã chụp ảnh và ghi WebM. Kiểm màu/viền/nền 52 PNG nguồn qua; không đổi PNG. Typecheck, 305 test và build qua.
- Nhánh kế thừa safe-area `94ae93e`, chưa merge/phát hành, không đổi DB/kinh tế. Dừng ở nghiệm thu hình ảnh; điện thoại thật chưa kiểm. Bằng chứng tạm tại `/private/tmp/vac-animation-current`, ảnh/video `godot-animation-*` trong thư mục visualizations của phiên.
- PO góp ý bước ngang và đầu cá. Đã dựng 8 khung đi ngang có chân trụ và chân vung, thêm atlas bước gà/vịt và NPC. Cá xoay theo cung, đầu lên khi bật và chúi khi rơi. Motion 25/25, 5 atlas qua kiểm palette và alpha. Chrome cảnh F6 hai cỡ qua, có WebM lượt sửa. Chờ PO xem lại chuyển động trên nhánh.
- PO thấy chân bị bóp. Phục hồi dáng đứng và bốn khung đi ngang gốc trong clip. Chỉ chèn bốn khung dịch pixel ống quần/giày. Motion 28/28 có kiểm texture gốc và pixel thân. Typecheck, 305 test, 9 test art, build và check:docs qua. Có dải khung đối chiếu và video lượt sửa. Nhánh chờ duyệt hình ảnh.
- PO góp ý bàn chân. Tách giày khỏi phần dịch ống quần trong bốn khung chèn. Chân trụ giữ đế nguyên pixel/cao độ, chân nhấc xoay ở cổ chân. Motion 29/29, Chương 1 50/50, 305 test và 9 test art. Đã xuất Web, đối chiếu dải khung và ghi clip hai cỡ. Dừng ở duyệt hình ảnh trên nhánh.
- PO đánh dấu Chèn 2/3 giật bàn chân trước. Hai khung giữ giày trước từ dáng gốc liền trước và chuyển chân sau theo dáng kế. Chèn 1/4 giống bản trước từng pixel. Motion 30/30, Chương 1 50/50, 305 test và 9 test art. Xuất Web, có ảnh trước/sau và clip. Chờ PO duyệt hình ảnh.
