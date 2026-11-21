# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 21/11/2026 · Kiểm thiết bị thật cho PWA · codex/godot-pwa-real-device-qa
- Xác nhận staging HTTPS trả `d325444`. Safari trên iPhone 14 Pro Max mở được hướng dẫn cài. Đến mục thêm icon; Mirroring không hiện rõ màn hình xác nhận. Mac chưa nhận diện Android qua USB.
- PO thử trực tiếp `d325444` trên iPhone và Android: 5/5 mục đạt trên mỗi máy, gồm mở từ icon, màn ngang, hai ngón, âm thanh và mở lại khi mất mạng. Kiểm tra tài liệu qua. Chưa merge. Dừng ở quyết định phát hành LT-14. [Phiếu thiết bị](qa/GODOT-PWA-STAGING-2026-11-19.md#nghiệm-thu-trên-thiết-bị-thật--21112026).

## 21/11/2026 · Nâng cấp PWA trên HTTPS staging · codex/godot-pwa-https-qa
- Dựng `5687b0e` và `d325444` cho cùng tunnel HTTPS mới với GoTrue/PostgreSQL thử. Bản staging hiện ở `d325444`.
- Chrome và WebKit mô phỏng tải đủ PCK/WASM trước khi worker mới kích hoạt. Ngắt mạng trước khi đóng, mở lại đúng SHA-256 của gói mới. Nối mạng và tải lại vẫn cùng khách, ô P5_7 có lúa và 2.498 vàng.
- Typecheck, 305 test, build, xuất Web, check:docs qua. Có ảnh hai cỡ và [phiếu staging](qa/GODOT-PWA-STAGING-2026-11-19.md#nâng-cấp-trên-https-staging--21112026). Chưa merge. Dừng ở nghiệm thu thiết bị thật LT-14.

## 21/11/2026 · Rà soát tiến độ LT-14 · codex/progress-review-2026-11-21
- GitHub main ở `5687b0e`. Typecheck, 305 test, build và check:docs qua trên main. Bản dựng staging trên máy khớp `5687b0e`; hôm nay không phân giải được tên miền tunnel thử.
- Đối chiếu phiếu staging và nhánh `d325444`. Bản sửa cập nhật cache đã qua mô phỏng Chrome/WebKit và còn chờ kiểm nâng cấp trên HTTPS staging.
- Dừng ở LT-14 bước 4. Còn nghiệm thu Android và các mục iPhone trên máy thật, PO chốt phiên Safari/icon, offline và URL chính trước P1-12.
