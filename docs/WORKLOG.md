# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 22/11/2026 · Chuẩn bị ghép mã, phản hồi và báo cáo P1-12 · codex/godot-pwa-cutover-preflight
- Làm phần độc lập trong lúc PO xử lý quyền Supabase. Có mẫu bảng theo dõi, lọc nhật ký theo mã và mẫu báo cáo riêng. [Mẫu và truy vấn](GODOT-ONLINE.md#xuất-theo-mã-và-chốt-báo-cáo).
- PostgreSQL tạm loại mã ngoài nhóm, xử lý mã lặp/trùng/thiếu. Báo cáo đọc 3/3 nhật ký giả và cho D1 1/2 theo giờ Việt Nam. Kiểm tài liệu qua.
- Chờ PO vào đúng dự án để xuất QA thật, sau đó báo PO trước khi mời. Chưa mời, chưa merge.

## 22/11/2026 · Bật nhật ký P1-12 và kiểm ghi chính thức · codex/godot-pwa-cutover-preflight
- PO duyệt QD-96. Đã gán B bật nhật ký lên URL chính. Chrome giữ phiên và tiến trình khi cập nhật; Supabase chính thức nhận hai lần mở cùng mã QA, thao tác và mốc hướng dẫn.
- Kiểm quyền khách đọc nhật ký trả 403 như dự kiến. Kiểm lại SQL Editor và danh sách dự án trên Dashboard vẫn thiếu quyền vào VAC. Đã xác nhận URL chính còn phục vụ đúng gói bật nhật ký. Câu truy vấn chỉ đọc đúng mã QA đã sẵn sàng. Dừng ở xuất nhật ký và chạy báo cáo. [Phiếu Production](GODOT-ONLINE.md#kiểm-trên-production).
- Chưa mời nhóm thử, chưa áp migration và chưa merge `main`.

## 22/11/2026 · Chuẩn bị P1-12 trên bản B · codex/godot-pwa-cutover-preflight
- Xác nhận gói B `524ef73` ở URL chính đang tắt nhật ký. Đã đóng gói cục bộ ứng viên bật nhật ký, chưa tải lên Vercel.
- Chrome/PostgreSQL thử ghi hai phiên cùng mã, thao tác và mốc hướng dẫn. Xuất báo cáo 1/1 nhật ký, ghép được phản hồi mẫu. Check tài liệu qua.
- Dừng ở chờ PO duyệt bật nhật ký và kênh thu phản hồi. Còn QA trên bản ứng viên với API chính thức trước khi mời. Chưa gửi lời mời, chưa merge. [Phiếu duyệt](GODOT-ONLINE.md#phiếu-duyệt-chơi-thử-p1-12).
