# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 21/11/2026 · Nâng cấp PWA trên HTTPS staging · codex/godot-pwa-https-qa
- Dựng `5687b0e` và `d325444` cho cùng tunnel HTTPS mới với GoTrue/PostgreSQL thử. Bản staging hiện ở `d325444`.
- Chrome và WebKit mô phỏng tải đủ PCK/WASM trước khi worker mới kích hoạt. Ngắt mạng trước khi đóng, mở lại đúng SHA-256 của gói mới. Nối mạng và tải lại vẫn cùng khách, ô P5_7 có lúa và 2.498 vàng.
- Typecheck, 305 test, build, xuất Web, check:docs qua. Có ảnh hai cỡ và [phiếu staging](qa/GODOT-PWA-STAGING-2026-11-19.md#nâng-cấp-trên-https-staging--21112026). Chưa merge. Dừng ở nghiệm thu thiết bị thật LT-14.

## 21/11/2026 · Rà soát tiến độ LT-14 · codex/progress-review-2026-11-21
- GitHub main ở `5687b0e`. Typecheck, 305 test, build và check:docs qua trên main. Bản dựng staging trên máy khớp `5687b0e`; hôm nay không phân giải được tên miền tunnel thử.
- Đối chiếu phiếu staging và nhánh `d325444`. Bản sửa cập nhật cache đã qua mô phỏng Chrome/WebKit và còn chờ kiểm nâng cấp trên HTTPS staging.
- Dừng ở LT-14 bước 4. Còn nghiệm thu Android và các mục iPhone trên máy thật, PO chốt phiên Safari/icon, offline và URL chính trước P1-12.

## 19/11/2026 · Cập nhật PWA và mở lại offline · codex/godot-pwa-offline-update
- PO chọn tiếp tục mô phỏng. Tái hiện lỗi trên Chrome và WebKit khi bản cập nhật đã chờ, mất mạng rồi đóng/mở game. Worker kích hoạt với cache thiếu WASM/PCK.
- Script xuất Web chờ nạp đủ tài nguyên của bản cập nhật. Chrome/WebKit mở game offline từ gói mới, giữ cache cũ nếu WASM trả 503 và chỉ tải WASM một lần ở hồ sơ mới. Xuất Web Godot 4.7.2, typecheck, 305 test, build và check:docs qua.
- WebKit trên HTTPS staging cắt yêu cầu gieo trước khi gửi và cắt phản hồi sau khi server lưu. Đọc lại cho kết quả tương ứng 2.500 vàng/ô trống và 2.498 vàng/có lúa, mỗi lượt chỉ có một lần bấm gieo.
- Sửa trên nhánh riêng, bản staging chính vẫn là `5687b0e`. Còn thử nâng cấp ở HTTPS staging và nghiệm thu thiết bị LT-14. Xem [phiếu staging](qa/GODOT-PWA-STAGING-2026-11-19.md#cập-nhật-pwa-rồi-mở-lại-offline).
