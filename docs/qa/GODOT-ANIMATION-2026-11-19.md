# Phiếu nghiệm thu hoạt ảnh Godot · 19/11/2026

Nhánh `codex/godot-living-farm-animation`, kế thừa safe-area `94ae93e`. Yêu cầu PO: rà và sửa hoạt ảnh dựa trên prompt hiện có. Tiêu chí hình ảnh theo AR-30; phạm vi LT-14.

- ✅ Bộ kiểm chuyển động: 19/19. Có khoảng nghỉ, các trạng thái hành động, giữ cá dưới nước khi chọn ô, hướng và quãng bước, điểm chân, giới hạn NPC và dáng nói.
- ✅ Luồng Chương 1: 50/50; vật nuôi/Bếp/đơn HTX: 41/41.
- ✅ Typecheck, 305 test, build, check:docs; cấu trúc Godot không lỗi/cảnh báo. Xuất Web bằng Godot trên Mac.
- ✅ Chrome cảnh chơi thật và cảnh xem thử: 1280×720, 844×390, không lỗi trình duyệt/shader. Đã xem ảnh; có video WebM.
- ✅ 52 PNG nguồn qua kiểm màu palette, đen và magenta. Không sửa PNG hoặc pipeline art.
- NOT ASSESSED: điện thoại thật. NPC dùng idle/talk sẵn có và chuyển động ngắn, chưa có sheet đi đủ hướng.

## Chạy lại

Trong bản sao dự án đã nhập tài nguyên, dùng Godot 4.7.2. Kiểm chuyển động không cần mạng:

```bash
godot --headless --path godot --script res://qa/ambient_motion.gd
```

Hai luồng gameplay dùng bộ fixture hiện có:

```bash
bash tools/qa/godot-chapter1-flow.sh
bash tools/qa/godot-p1-9-flow.sh
```

Mở `godot/animation_preview.tscn`, F6 xem riêng. Chỉnh `Idle Min/Max`, `Wander Distance` trong `animal_slot.tscn`; `Shuffle Distance`, `Rest Seconds` ở từng Sprite NPC trong `estate_features.tscn`; `Tree Wind Strength` ở gốc scene đó và `Wind Strength` trong `rice_plot.tscn`. `Walk Cycle Distance` trong `farmer.tscn` điều chỉnh quãng đường mỗi vòng chân.

Bằng chứng phiên nằm trong thư mục được trỏ bởi `/private/tmp/vac-animation-current`: `motion-final.log`, `chapter.log`, `livestock.log`, `browser.log`, `game-browser.log`. Ảnh/video `godot-animation-*` ở thư mục visualizations của phiên Codex. Artifact này cục bộ, chưa triển khai công khai.

RULE D0/D1: không đổi core loop, kinh tế, DB, vùng tương tác hay vị trí marker. Bản đồ và PNG của PO giữ nguyên. Native headless vẫn báo ObjectDB leak lúc thoát (6 ở Chương 1, 11 ở P1-9); chưa kết luận hoặc sửa nguyên nhân trong việc này.

Kết luận **XONG CÓ GHI CHÚ** cho phần sửa dùng asset hiện có. Đã code trên nhánh riêng; chưa merge, áp DB hoặc phát hành. Chờ PO nghiệm thu hình ảnh theo AGENTS.md.
