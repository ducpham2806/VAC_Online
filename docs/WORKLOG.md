# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

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

## 11/11/2026 · Rà soát dự án và bộ công cụ agent · codex/ra-soat-du-an (nền c58623e)
- Kiểm kê 999 tệp Git; tra Graphify cục bộ (1.984 nút), đối chiếu hai luồng MVP và P1 từ điểm vào tới lưu trạng thái.
- Đọc cấu hình Claude, 7 skill VAC, Graphify và 6 agent VAC; rà danh mục 116 skill và 21 playbook Game Studio (c5dac46). Skill dùng: Graphify, Supabase (đọc mã cục bộ).
- Kiểm thật: build và check:docs PASS. Typecheck thiếu kiểu Node; Vitest chưa cài; SQL thiếu Postgres cục bộ; test art thiếu numpy (6 lỗi import).
- **Dừng ở:** rà soát xong; P1-12 vẫn chờ PO phát hành link và mời người chơi.
