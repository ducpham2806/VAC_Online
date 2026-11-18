# Nhật ký công việc

Nhật ký chính duy nhất, giữ ≤ 3 mục mới nhất. Mục cũ nguyên văn ở `docs/archive/` ([trước 10/11](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md)); tóm tắt bền vững ở [COMPLETED](COMPLETED.md); quy trình ở [WORKFLOW](WORKFLOW.md).

## 18/11/2026 · Giữ bản lưu Phaser khi thử Godot P1 · codex/godot-p1-save-qa
- PO duyệt tiếp LT-14 bước 4. Tái hiện online ghi đè bản offline vì dùng chung ô lưu. Tách ô lưu cho `?p1&offline` và sao chép một lần bản chung còn trong trình duyệt.
- Chrome staging 1280×720 và 844×390 đọc mẫu v1 sau khi mở online. Giữ 4.321 vàng, 3 lúa và lựa chọn mở đầu qua tải lại. Godot đợi hàng chờ, Phaser gửi một lần và Godot thấy đúng ô lúa. Chụp đủ hai cỡ.
- Typecheck, 305 test, build và check:docs qua. Bản sửa chạy trên staging, chờ duyệt merge. Còn kiểm Android/iPhone thật và chốt phương án online/offline trước phát hành.

## 18/11/2026 · Staging phát hành Godot P1 · codex/godot-p1-release-qa
- PO duyệt tiếp LT-14 bước 4. Dựng lại Godot và Phaser cùng origin HTTPS tạm, dùng Supabase Auth và PostgreSQL thử trên Mac.
- Chrome giữ cùng tài khoản, ô lúa và vàng qua hai client. Giả lập token lỗi thì làm mới phiên. Đạt kiểm điều kiện cài PWA, xem bản lưu khi mất mạng, kết nối lại, nhận phiên bản cache mới và mở lại nông trại trên Phaser. WebKit mở được cảnh đầu. Chrome phát tín hiệu âm thanh khi chuyển trang.
- Đo một lượt Chrome trên Mac từ tải đến đọc nông trại, 10,0 giây lần đầu và 1,3 giây với cache. Chụp ảnh hai cỡ. Typecheck, 303 test, build, Godot Web/PWA và check:docs qua.
- Script kiểm fixture chạy trên macOS bằng Python và tách cache từng lượt. Chương 1 qua 50/50, vật nuôi/Bếp/đơn HTX qua 41/41. Chờ kiểm mở từ icon, cảm ứng, âm thanh và hiệu năng trên Android/iPhone thật, cùng phương án cho bản lưu offline cũ.

## 15/11/2026 · Chương 1 trong Godot P1 · ccr-b91fc534-n2yctl
- PO duyệt nhánh vật nuôi, Bếp, đơn HTX: đã merge vào `main` tại `225f9b5`. PO yêu cầu làm tiếp cho xong Chương 1.
- LT-14 bước 3: Godot có cảnh mở đầu chọn hướng (TG-40), hướng dẫn 8 bước của Bác Bảy kèm mũi tên (GP-62), hai NPC có tim với nói chuyện và tặng quà (GP-50), Sổ Gia Phả nhận thưởng Chương 1 (TG-30), âm thanh tổng hợp theo AR-40 có nút tắt. Lời cảnh mở đầu chuyển vào `src/data/sliceStory.ts` để Phaser và Godot dùng chung. HUD hết tràn lề ở 1280×720. Không đổi luật, DB hay kinh tế.
- Kiểm thật: `tools/qa/godot-chapter1-flow.sh` 50/50 bước từ người chơi mới, `godot-p1-9-flow.sh` 41/41. Typecheck, 303 test, build, xuất Web, check:docs và kiểm thử hướng dẫn Phaser qua. Chrome hai cỡ bấm chuột thật qua cảnh mở đầu, NPC, Sổ; 0 lỗi JS. Ảnh `docs/screenshots/godot-ch1-*`.
- PO duyệt, đã merge vào `main` tại `667445e`. Chưa deploy. Chưa nghe âm thanh bằng tai (chỉ kiểm không lỗi), chưa thử Supabase thật và điện thoại. Tiếp theo là LT-14 bước 4.
