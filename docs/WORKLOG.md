# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 25/11/2026 · Bổ sung đối chiếu D1 P1-12 · codex/p1-d1-cohort (bản vá cục bộ)
- CLI mặc định chỉ in D1 quan sát. Khi khai báo đủ hai số đã đối chiếu, in khoảng D1 và tạm chờ nếu khoảng cắt cổng LT-02. Giả lập 4/7 trên 10 người đủ thời gian → 40–70%.
- Kiểm CLI bằng 22 ca giả, gồm qua mốc nửa đêm Việt Nam, thiếu/nhầm số đếm và nhật ký trùng. Không dùng dữ liệu người chơi.
- Bản vá chưa merge, không triển khai. Xuất QA và gửi lời mời đã ghi trên nhánh bàn giao; đang thu mã, chưa tính D1 thật. [Quy trình báo cáo](GODOT-ONLINE.md#xuất-theo-mã-và-chốt-báo-cáo).

## 23/11/2026 · P1-12 bắt đầu mời và thu phản hồi · codex/godot-pwa-cutover-preflight
- PO xác nhận đã gửi lời mời. Chuẩn bị bảng Excel riêng để nhập mã và phản hồi. Dữ liệu người chơi và bảng đã điền giữ ngoài GitHub.
- Dùng danh sách mã đã đối chiếu để xuất nhật ký thật và tính D1 theo LT-13. Dừng ở đang thu mã, chưa tính D1. [Phiếu P1-12](GODOT-ONLINE.md#xuất-theo-mã-và-chốt-báo-cáo).

## 22/11/2026 · Duyệt tích hợp bản phát hành P1 vào main · codex/godot-pwa-cutover-preflight
- PO duyệt merge theo QD-97. Nhánh gồm định tuyến và cache Godot PWA, kiểm bản B trên máy thật, phiếu P1-12 và quy trình thu phản hồi.
- Kiểm trên cây mã đã commit: typecheck, 317 test và build qua. Kiểm tài liệu qua.
- PR #4 đã merge tại `1b0f441`, CI mã và SQL qua. PO xuất đúng một nhật ký QA từ Supabase VAC. Báo cáo đọc 1/1, khớp hai phiên, một thao tác và hai mốc hướng dẫn. Kiểm tài liệu qua. Dừng ở báo PO trước khi mời. [Phiếu Production](GODOT-ONLINE.md#kiểm-trên-production).
