# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 11/11/2026 · Godot P1 bước 0 · codex/godot-p1-kiem-chung
- PO duyệt bắt đầu LT-14. Cảnh Godot 4.7.2 dùng lại sprite, mở Web/PWA, chạm gieo một ô và đọc lại trạng thái. Dùng vac-studio, godot-export và Supabase.
- Handler `apply-actions` dùng PostgreSQL tạm và danh tính thử. Chrome đọc đúng ô lúa sau tải lại, sổ cái có một giao dịch. Chrome mở lại từ cache khi mất mạng. WebKit trên máy tính đọc được nông trại.
- Link HTTPS thử đã qua Chrome và WebKit trên máy tính. Chrome đo một lần tải nguội khoảng 17,1 giây và tải lại 0,55 giây. WASM gửi dạng gzip 9,6 MiB.
- Kiểm typecheck, 303 test, build, test:sql 8 file, check:docs, Godot headless/export và màu 8 PNG đều qua. Cách chạy lại ở LT-14.
- Bước 0 đang chờ kiểm Chrome Android và Safari iPhone thật, gồm mở từ icon và đo tải/FPS.

## 11/11/2026 · Kế hoạch chuyển P1 sang Godot · codex/ke-hoach-chuyen-godot
- PO chọn Godot 4, Web/PWA trước (QD-90). LT-14 ghi phạm vi P1, tác động, các bước và tiêu chí qua bước.
- Đối chiếu mã lưu/đồng bộ P1 và tài liệu Godot, Supabase chính thức. Dùng vac-studio, godot-export, game-production-scrum và Supabase.
- Giữ engine luật TS và Supabase trong đề xuất. Chốt riêng hành vi offline và phương án mang phiên/lưu cũ trước phát hành.
- `npm run check:docs` và `git diff --check` qua. Kế hoạch chờ PO duyệt bước thử Web/PWA trên máy thật.

## 11/11/2026 · Đối chiếu engine cho web/PWA · codex/doi-chieu-engine-web-pwa
- Đối chiếu Godot 4, PixiJS và Phaser đang chạy. Đề xuất giữ Phaser 3 để phát hành P1 qua web/PWA, đóng gói `dist/` bằng Capacitor khi cần app.
- Đối chiếu trực tiếp `src/main.tsx`, manifest, service worker và cấu hình Capacitor. Manifest mở `/`, còn P1 vào bằng `/?p1`. Nếu PWA phục vụ P1, cần chọn đúng điểm vào.
- Kiểm thật `npm run build` trên main và `npm run check:docs` trên nhánh tư vấn. Chưa có số đo trên máy thật, APK hay bản iOS.
- Ghi nhận đề xuất để PO cân nhắc. P1-12 tiếp tục theo LT-13.
