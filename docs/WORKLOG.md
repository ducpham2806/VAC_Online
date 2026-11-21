# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 21/11/2026 · Chuyển P1 chính thức sang Godot · codex/godot-pwa-cutover-preflight
- PO duyệt A/B (QD-95). Đã đưa A lên trước, Phaser và Godot đọc cùng tài khoản QA, P5_7 có lúa, 2.498 vàng, kho và nhánh Chương 1.
- Đã chuyển B. Kiểm 307, cùng phiên/tiến trình, Phaser dự phòng và đường trực tiếp Godot. A là mốc quay lui. Kiểm tra tài liệu qua. [Phiếu Production](qa/GODOT-PWA-STAGING-2026-11-19.md#chuyển-url-chính-sang-godot--21112026).
- Đã triển khai Production từ `524ef73`. Chưa merge `main`, chưa áp migration, chưa mời nhóm P1-12. Dừng ở chuẩn bị P1-12.

## 21/11/2026 · Hai bản Production chờ duyệt · codex/godot-pwa-cutover-preflight
- PO chọn đích Vercel riêng và khôi phục Supabase VAC (QD-94). Vercel xác nhận tên miền đích. Supabase qua DNS, Auth, kiểm function và CORS bằng yêu cầu chỉ đọc.
- Dựng gói chung từ `524ef73`; bản A tắt chuyển hướng, B bật. Middleware, checksum, 317 test, typecheck, build và check:docs qua.
- Chờ PO duyệt hai bản. Chưa tải gói Production, đổi URL, ghi DB hay merge. [Phiếu duyệt](qa/GODOT-PWA-STAGING-2026-11-19.md#hai-bản-chờ-duyệt-trên-đích-chính--21112026).

## 21/11/2026 · Chuẩn bị duyệt chuyển URL chính · codex/godot-pwa-cutover-preflight
- Cấu hình VAC dùng đúng project ref đã ghi và khóa publishable. Host Supabase trả NXDOMAIN ở Google/Cloudflare DNS, Auth và function chưa kiểm được qua HTTP.
- Nhóm Vercel đang kết nối chỉ có dự án VAC cho Preview. Ghi tiêu chí xác minh URL, gói bật/tắt và phương án quay lui giữ đường icon từ kết quả Preview. Kiểm tra tài liệu qua.
- Chờ PO xác nhận URL chính và Supabase đang hoạt động. Chưa đổi URL, ghi API/DB hoặc merge. [Phiếu duyệt](qa/GODOT-PWA-STAGING-2026-11-19.md#phiếu-duyệt-chuyển-url-chính--21112026).
