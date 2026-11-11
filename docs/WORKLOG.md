# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

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

## 11/11/2026 · Mẫu VFX tưới trong P1 · codex/p1-vfx-tuoi
- Kiểm atlas `slice` và `estate`, không pixel đen/lạc bảng/alpha lẻ. Skill dùng: vac-studio, vac-scope-check, vac-asset-audit, game-feel, technical-artist, vac-story-done.
- Mẫu dùng sự kiện tưới thành công của P1, vẽ giọt nước ở ô vừa tưới (AR-31). Tác động giới hạn ở hiển thị P1. Mẫu dùng lại atlas và bảng màu VAC.
- Kiểm: typecheck, 303 test, build, check:docs PASS. Chrome 1280×720 và 844×390: dùng nút hành động, VFX đúng ô rồi tự dọn, ô đã tưới không phát lại, 0 lỗi JS. Bản production mở P1 ở cả hai cỡ.
- **Dừng ở:** mẫu trên nhánh riêng, chờ PO xem. P1-12 vẫn theo LT-13.
