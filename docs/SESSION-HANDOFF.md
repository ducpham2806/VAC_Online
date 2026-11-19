# Bàn giao · 19/11/2026 · LT-14 thử phát hành Godot

## Đã merge
- `main` tại `3fb5ea0`: Godot P1 có vòng ruộng, mùa, điền trang, vật nuôi, bếp, đơn HTX, NPC, Chương 1, hướng dẫn và âm thanh.
- Giữ bản lưu offline Phaser khi mở online; nhật ký hướng dẫn Godot và mã chơi thử. Bản đồ chỉnh tay trong `godot/estate_map.tscn`, công trình trong `estate_features.tscn`; F5 chạy `estate_probe.tscn`.
- Luật vẫn chạy qua engine TypeScript trên server; Godot gửi thao tác. Hiện trạng chi tiết ở KY-90, plan ở LT-14, cấu hình ở [GODOT-ONLINE](GODOT-ONLINE.md).

## Nhánh đang chờ duyệt
- `codex/godot-living-farm-animation` kế thừa safe-area `94ae93e`. Sửa lịch hành vi vật nuôi/cá, bước chân điền chủ, NPC và gió cây theo AR-30. Mở `godot/animation_preview.tscn`, F6 xem riêng. Bước ngang xen 4 khung gốc với 4 khung chèn sau khi PO góp ý tỷ lệ chân. Cá xoay theo cung, gà/vịt/NPC có khung chân. Kiểm motion 28/28, Chương 1 50/50, P1-9 41/41; Chrome cảnh thật và preview hai cỡ qua. Có ảnh/video, chưa merge.
- `codex/godot-pwa-safe-area`: vùng an toàn cho HUD, bảng danh sách và hộp xác nhận. Giữ lề scene; đọc CSS env trên Web và quy đổi pixel canvas sang UI. Có nhánh native, chưa kiểm trên thiết bị.
- Đã xuất Web bằng Godot trên Mac. Chrome hai cỡ UI-10 qua kiểm vùng khuyết mô phỏng, đổi cỡ và đổi phía. Chương 1 fixture 50/50. Typecheck, 305 test, build và kiểm cấu trúc scene qua. Bằng chứng ở WORKLOG.

## Bước tiếp theo
1. Duyệt chuyển động và vùng an toàn; chỉ merge khi PO yêu cầu.
2. LT-14 bước 4 còn kiểm từ icon PWA, nhiều ngón, safe-area, âm thanh và hiệu năng trên Android/iPhone thật. Máy chủ staging tạm của phiên trước đã dừng; cần dựng lại trước khi gửi URL cho người thử.
3. PO chốt chính sách offline và duyệt phát hành trước chuyển URL chính, rồi mới chạy P1-12 theo LT-13. Diễn tập báo cáo LT-13 đã đọc được phiên/mốc hướng dẫn; chưa có nhóm người chơi thật.

## Giữ nguyên
- `/?p1` là Phaser P1 online, `/?p1&offline` mở bản lưu cục bộ cũ. Game mặc định là MVP cũ. Không đổi DB thật; chỉ áp migration khi PO cho phép rõ ràng.
- Bản đồ/asset PO chỉnh tay phải giữ. Xuất và chạy Godot trong bản sao tạm để tránh thay đổi cache đã được theo dõi trong Git.
- Không đụng project Supabase “Nam_A_CRM”.
