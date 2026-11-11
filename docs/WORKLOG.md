# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 11/11/2026 · Hoạt ảnh đi và gieo trong Godot · codex/godot-hoat-anh-di-gieo
- PO yêu cầu làm tiếp trên Mac. Godot có chạm để đi, phím mũi tên/WASD, hoạt ảnh 4 hướng và thứ tự lớp theo chân. Hai cột cỏ PO tô vẫn nằm trong bản cục bộ.
- Mở SpriteFrames trong Editor. Dùng godot-animation và vac-asset-audit, 16 PNG qua kiểm kích thước, nền, viền và bảng màu.
- Godot headless kiểm đi/dừng, phím ngắt chạm và VFX chỉ sau xác nhận gieo. Chrome hai cỡ và WebKit mô phỏng qua. Ảnh xác nhận che khuất, di chuyển và hiệu ứng. PostgreSQL tạm ghi một giao dịch.
- Typecheck, 303 test, build, Godot Web/PWA export và check:docs qua. Dừng ở nhánh chờ PO duyệt, còn kiểm điện thoại thật.

## 11/11/2026 · Scene nông trại chỉnh tay trong Godot · codex/godot-scene-nong-trai
- PO yêu cầu dùng Godot trên Mac và có scene chỉnh tay. Dùng godot-tilemap. Bản đồ có các lớp cỏ, đất, node vật trang trí, điểm xuất phát và ô gieo chỉnh được.
- Mở Godot 4.7.2 từ ~/Applications, xác nhận bản đồ 2D và Inspector. Đã thử nhập sprite từ thư mục dự án sạch với `--prepare-only`.
- Xuất Web/PWA, thử Chrome ở 1280×720 và 844×390, tải lại giữ lúa, đọc cache khi mất mạng. WebKit mô phỏng đọc được. Ảnh đã chụp ở hai cỡ.
- Bản sao dời ô bằng scene nhận chạm ở vị trí mới, không gửi gieo ở vị trí cũ. PostgreSQL tạm ghi một lần trừ vàng. Typecheck, 303 test, build và check:docs qua.
- Dừng ở scene chỉnh tay trên nhánh riêng chờ PO duyệt. LT-14 bước 0 còn kiểm trên Android và iPhone thật.

## 11/11/2026 · Godot P1 bước 0 · codex/godot-p1-kiem-chung
- PO duyệt bắt đầu LT-14. Cảnh Godot 4.7.2 dùng lại sprite, mở Web/PWA, chạm gieo một ô và đọc lại trạng thái. Dùng vac-studio, godot-export và Supabase.
- Handler `apply-actions` dùng PostgreSQL tạm và danh tính thử. Chrome đọc đúng ô lúa sau tải lại, sổ cái có một giao dịch. Chrome mở lại từ cache khi mất mạng. WebKit trên máy tính đọc được nông trại.
- Link HTTPS thử đã qua Chrome và WebKit trên máy tính. Chrome đo một lần tải nguội khoảng 17,1 giây và tải lại 0,55 giây. WASM gửi dạng gzip 9,6 MiB.
- Kiểm typecheck, 303 test, build, test:sql 8 file, check:docs, Godot headless/export và màu 8 PNG đều qua. Cách chạy lại ở LT-14.
- Bước 0 đang chờ kiểm Chrome Android và Safari iPhone thật, gồm mở từ icon và đo tải/FPS.
