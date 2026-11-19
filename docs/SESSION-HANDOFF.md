# Bàn giao · 19/11/2026 · LT-14 thử phát hành Godot

## Đã merge
- `main` tại `3fb5ea0`: Godot P1 có vòng ruộng, mùa, điền trang, vật nuôi, bếp, đơn HTX, NPC, Chương 1, hướng dẫn và âm thanh.
- Giữ bản lưu offline Phaser khi mở online; nhật ký hướng dẫn Godot và mã chơi thử. Bản đồ chỉnh tay trong `godot/estate_map.tscn`, công trình trong `estate_features.tscn`; F5 chạy `estate_probe.tscn`.
- Luật vẫn chạy qua engine TypeScript trên server; Godot gửi thao tác. Hiện trạng chi tiết ở KY-90, plan ở LT-14, cấu hình ở [GODOT-ONLINE](GODOT-ONLINE.md).

## Nhánh đang chờ duyệt
- `codex/godot-ios-install-guide`: staging thêm hướng dẫn cho iOS mới, hoãn tải game/tạo phiên đến khi chọn trình duyệt hoặc mở từ icon. Kiểm WebKit ba cỡ, Chrome và icon iPhone đã cài.
- `codex/godot-pwa-staging-qa` thêm script đóng gói cùng commit và mã bản dựng. Đã diễn tập chuyển `3fb5ea0 → e26571b` trên staging HTTPS. Chrome giữ phiên/ô lúa qua cache, cập nhật và quay lui. Hai ngón mô phỏng qua. iPhone 14 Pro Max mở từ icon và giữ lúa/2.498 vàng sau đóng mở. Safari và icon giữ nông trại riêng. Chi tiết ở [phiếu staging](qa/GODOT-PWA-STAGING-2026-11-19.md).
- `codex/godot-living-farm-animation` kế thừa safe-area `94ae93e`. Sửa lịch hành vi vật nuôi/cá, bước chân điền chủ, NPC và gió cây theo AR-30. Mở `godot/animation_preview.tscn`, F6 xem riêng. Bước ngang xen 4 khung gốc và 4 khung chèn. Chèn 2 và 3 giữ cả giày trước sát đất qua các dáng gốc liền kề. Cá xoay theo cung, gà/vịt/NPC có khung chân. Kiểm motion 30/30, Chương 1 50/50, P1-9 41/41; Chrome cảnh thật và preview hai cỡ qua. Có ảnh/video, chưa merge.
- `codex/godot-pwa-safe-area`: vùng an toàn cho HUD, bảng danh sách và hộp xác nhận. Giữ lề scene; đọc CSS env trên Web và quy đổi pixel canvas sang UI. Có nhánh native, chưa kiểm trên thiết bị.
- Đã xuất Web bằng Godot trên Mac. Chrome hai cỡ UI-10 qua kiểm vùng khuyết mô phỏng, đổi cỡ và đổi phía. Chương 1 fixture 50/50. Typecheck, 305 test, build và kiểm cấu trúc scene qua. Bằng chứng ở WORKLOG.

## Bước tiếp theo
1. Duyệt chuyển động và vùng an toàn; chỉ merge khi PO yêu cầu.
2. LT-14 bước 4 còn kiểm Android thật, màn ngang/hai ngón, âm thanh và mất mạng trên iPhone thật. Link staging tạm ghi ở `/private/tmp/vac-staging-p1-current` → tệp `origin`. Dựng lại nếu tunnel dừng.
3. PO chốt phạm vi chuyển phiên Safari/icon, chính sách offline và duyệt phát hành trước chuyển URL chính, rồi mới chạy P1-12 theo LT-13. Diễn tập báo cáo LT-13 đã đọc được phiên/mốc hướng dẫn; chưa có nhóm người chơi thật.

## Giữ nguyên
- `/?p1` là Phaser P1 online, `/?p1&offline` mở bản lưu cục bộ cũ. Game mặc định là MVP cũ. Không đổi DB thật; chỉ áp migration khi PO cho phép rõ ràng.
- Bản đồ/asset PO chỉnh tay phải giữ. Xuất và chạy Godot trong bản sao tạm để tránh thay đổi cache đã được theo dõi trong Git.
- Không đụng project Supabase “Nam_A_CRM”.
