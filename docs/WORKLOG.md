# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 23/11/2026 · P1-12 bắt đầu mời và thu phản hồi · codex/godot-pwa-cutover-preflight
- PO xác nhận đã gửi lời mời. Chuẩn bị bảng Excel riêng để nhập mã và phản hồi. Dữ liệu người chơi và bảng đã điền giữ ngoài GitHub.
- Dùng danh sách mã đã đối chiếu để xuất nhật ký thật và tính D1 theo LT-13. Dừng ở đang thu mã, chưa tính D1. [Phiếu P1-12](GODOT-ONLINE.md#xuất-theo-mã-và-chốt-báo-cáo).

## 22/11/2026 · Duyệt tích hợp bản phát hành P1 vào main · codex/godot-pwa-cutover-preflight
- PO duyệt merge theo QD-97. Nhánh gồm định tuyến và cache Godot PWA, kiểm bản B trên máy thật, phiếu P1-12 và quy trình thu phản hồi.
- Kiểm trên cây mã đã commit: typecheck, 317 test và build qua. Kiểm tài liệu qua.
- PR #4 đã merge tại `1b0f441`, CI mã và SQL qua. PO xuất đúng một nhật ký QA từ Supabase VAC. Báo cáo đọc 1/1, khớp hai phiên, một thao tác và hai mốc hướng dẫn. Kiểm tài liệu qua. Dừng ở báo PO trước khi mời. [Phiếu Production](GODOT-ONLINE.md#kiểm-trên-production).

## 22/11/2026 · Chuẩn bị ghép mã, phản hồi và báo cáo P1-12 · codex/godot-pwa-cutover-preflight
- Làm phần độc lập trong lúc PO xử lý quyền Supabase. Có mẫu bảng theo dõi, lọc nhật ký theo mã và mẫu báo cáo riêng. [Mẫu và truy vấn](GODOT-ONLINE.md#xuất-theo-mã-và-chốt-báo-cáo).
- PostgreSQL tạm loại mã ngoài nhóm, xử lý mã lặp/trùng/thiếu. Báo cáo đọc 3/3 nhật ký giả và cho D1 1/2 theo giờ Việt Nam. Kiểm tài liệu qua.
- Chờ PO vào đúng dự án để xuất QA thật, sau đó báo PO trước khi mời. Chưa mời, chưa merge.
