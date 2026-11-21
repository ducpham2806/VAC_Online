# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 21/11/2026 · Đề xuất phát hành Godot P1 · codex/godot-pwa-release-proposal
- Ghi QD-91 đến QD-93 chờ PO duyệt. Giữ phiên khách ở nơi đã chơi, xem bản lưu khi offline và chuyển tạm URL P1 sang Godot cùng origin.
- Bổ sung điều kiện nghiệm thu định tuyến, quay lui và giữ lối Phaser xử lý hàng chờ. Kiểm tra tài liệu qua.
- Dừng ở duyệt phương án. Chưa đổi code, URL, DB hay phát hành. [Đề xuất](GODOT-ONLINE.md#đề-xuất-chốt-phát-hành-p1).

## 21/11/2026 · Kiểm thiết bị thật cho PWA · codex/godot-pwa-real-device-qa
- Xác nhận staging HTTPS trả `d325444`. Safari trên iPhone 14 Pro Max mở được hướng dẫn cài. Đến mục thêm icon; Mirroring không hiện rõ màn hình xác nhận. Mac chưa nhận diện Android qua USB.
- PO thử trực tiếp `d325444` trên iPhone và Android: 5/5 mục đạt trên mỗi máy, gồm mở từ icon, màn ngang, hai ngón, âm thanh và mở lại khi mất mạng. Kiểm tra tài liệu qua. Chưa merge. Dừng ở quyết định phát hành LT-14. [Phiếu thiết bị](qa/GODOT-PWA-STAGING-2026-11-19.md#nghiệm-thu-trên-thiết-bị-thật--21112026).

## 21/11/2026 · Nâng cấp PWA trên HTTPS staging · codex/godot-pwa-https-qa
- Dựng `5687b0e` và `d325444` cho cùng tunnel HTTPS mới với GoTrue/PostgreSQL thử. Bản staging hiện ở `d325444`.
- Chrome và WebKit mô phỏng tải đủ PCK/WASM trước khi worker mới kích hoạt. Ngắt mạng trước khi đóng, mở lại đúng SHA-256 của gói mới. Nối mạng và tải lại vẫn cùng khách, ô P5_7 có lúa và 2.498 vàng.
- Typecheck, 305 test, build, xuất Web, check:docs qua. Có ảnh hai cỡ và [phiếu staging](qa/GODOT-PWA-STAGING-2026-11-19.md#nâng-cấp-trên-https-staging--21112026). Chưa merge. Dừng ở nghiệm thu thiết bị thật LT-14.
