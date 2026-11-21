# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 22/11/2026 · Chuẩn bị P1-12 trên bản B · codex/godot-pwa-cutover-preflight
- Xác nhận gói B `524ef73` ở URL chính đang tắt nhật ký. Đã đóng gói cục bộ ứng viên bật nhật ký, chưa tải lên Vercel.
- Chrome/PostgreSQL thử ghi hai phiên cùng mã, thao tác và mốc hướng dẫn. Xuất báo cáo 1/1 nhật ký, ghép được phản hồi mẫu. Check tài liệu qua.
- Dừng ở chờ PO duyệt bật nhật ký và kênh thu phản hồi. Còn QA trên bản ứng viên với API chính thức trước khi mời. Chưa gửi lời mời, chưa merge. [Phiếu duyệt](GODOT-ONLINE.md#phiếu-duyệt-chơi-thử-p1-12).

## 22/11/2026 · Bản B đạt nghiệm thu trên iPhone và Android · codex/godot-pwa-cutover-preflight
- PO thử B `524ef73` trên URL chính. Mỗi máy đạt 3/3: mở từ icon, đóng/mở vẫn giữ phiên và tiến trình, tắt Wi-Fi và dữ liệu di động vẫn mở xem được bản lưu. [Phiếu thiết bị Production](qa/GODOT-PWA-STAGING-2026-11-19.md#nghiệm-thu-bản-b-trên-điện-thoại).
- Cập nhật LT-14, bàn giao và tóm tắt nghiệm thu. Kiểm tra tài liệu qua. Chưa merge `main`, chưa mở P1-12.

## 21/11/2026 · Nghiệm thu bản B trên điện thoại · codex/godot-pwa-cutover-preflight
- HTTPS Production trả 307 sang Godot và build-info đúng B `524ef73`. Typecheck, 317 test, build và check:docs qua.
- Gửi PO các bước kiểm từ icon, giữ phiên và nông trại, đóng/mở offline theo QD-91/QD-92 trên iPhone và Android thật. [Phiếu thiết bị Production](qa/GODOT-PWA-STAGING-2026-11-19.md#nghiệm-thu-bản-b-trên-điện-thoại).
- Dừng ở chờ kết quả hai máy. B đang phục vụ Production, chưa có bản phát hành mới và chưa merge `main`.
