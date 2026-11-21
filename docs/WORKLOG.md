# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 21/11/2026 · Chuẩn bị duyệt chuyển URL chính · codex/godot-pwa-cutover-preflight
- Cấu hình VAC dùng đúng project ref đã ghi và khóa publishable. Host Supabase trả NXDOMAIN ở Google/Cloudflare DNS, Auth và function chưa kiểm được qua HTTP.
- Nhóm Vercel đang kết nối chỉ có dự án VAC cho Preview. Ghi tiêu chí xác minh URL, gói bật/tắt và phương án quay lui giữ đường icon từ kết quả Preview. Kiểm tra tài liệu qua.
- Chờ PO xác nhận URL chính và Supabase đang hoạt động. Chưa đổi URL, ghi API/DB hoặc merge. [Phiếu duyệt](qa/GODOT-PWA-STAGING-2026-11-19.md#phiếu-duyệt-chuyển-url-chính--21112026).

## 21/11/2026 · Vercel Preview và diễn tập quay lui · codex/godot-pwa-vercel-qa
- PO duyệt dự án Preview riêng và trang giữ chỗ Production bắt buộc, không gán tên miền. Đưa đúng `524ef73` lên hai bản Preview bật/tắt, dùng API staging thử.
- Vercel trả đúng 307 và ngoại lệ. Chrome/WebKit giữ cùng phiên, ô P5_7 và 2.498 vàng qua Phaser → Godot → Phaser. Kiểm tra tài liệu qua.
- Để Preview ở bản tắt, có xác thực. URL chính và main giữ nguyên. Dừng ở chờ PO cho chuyển URL chính. [Phiếu Preview](qa/GODOT-PWA-STAGING-2026-11-19.md#vercel-preview-giữ-phiên-và-quay-lui--21112026).

## 21/11/2026 · Triển khai và diễn tập URL Godot P1 · codex/godot-pwa-release-staging
- PO duyệt QD-91 đến QD-93. Có hướng dẫn giữ phiên Safari/icon, chế độ chỉ xem khi mất mạng và chuyển hướng P1 mặc định tắt. Build staging `e12e2d8`.
- Chrome/WebKit qua định tuyến, giữ phiên và nông trại, mở lại offline và quay lui. Chrome qua đồng bộ hàng chờ Phaser. Typecheck, 317 test, build, xuất Godot và check:docs qua.
- Staging đã tắt redirect sau thử. Dừng ở chờ PO chuyển URL chính. Chưa merge. [Phiếu QA](qa/GODOT-PWA-STAGING-2026-11-19.md#chuyển-url-p1-và-quay-lui-trên-staging--21112026).
