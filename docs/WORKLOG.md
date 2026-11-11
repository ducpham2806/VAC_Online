# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

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

## 11/11/2026 · Hoạt ảnh nông trại P1 · codex/p1-hoat-anh-nong-trai
- PO duyệt làm tiếp. Dùng vac-studio, game-feel, technical-artist, vac-asset-audit và vac-story-done.
- Tái dùng sprite và bảng màu VAC. Lớp công cụ tạo trong Phaser, thêm tư thế và VFX gieo/tưới/gặt, vật nuôi lệch nhịp, gợn ao (AR-30, AR-31).
- Typecheck, 303 test, build và check:docs PASS. Chrome ở 1280×720 và 844×390 xác nhận ba công cụ đạt kiểm màu/alpha, VFX đúng ô thành công, đi bộ ngắt tư thế, vật nuôi/ao chuyển động và không có lỗi JS.
- Smoke P1-9 hai cỡ PASS, hướng dẫn 844×390 tới DONE và nhận Chương 1. Bản production mở P1 hai cỡ.
- Nhánh đang chờ PO duyệt, còn bước kiểm trên điện thoại thật. Chơi thử P1-12 theo LT-13.
