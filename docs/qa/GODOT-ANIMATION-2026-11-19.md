# Phiếu nghiệm thu hoạt ảnh Godot · 19/11/2026

Nhánh `codex/godot-living-farm-animation`, kế thừa safe-area `94ae93e`. Yêu cầu PO: rà và sửa hoạt ảnh dựa trên prompt hiện có. Tiêu chí hình ảnh theo AR-30; phạm vi LT-14.

- ✅ Bộ kiểm chuyển động: 30/30. Kiểm giày trước sát đất ở Chèn 2/3 và đế giày chân trụ trong từng dáng chèn, bốn khung gốc xen bốn khung chèn và dáng đứng gốc của điền chủ, hướng đầu cá theo cung, khung nhấc chân gà và NPC, cùng các trạng thái nghỉ/hành động.
- ✅ Luồng Chương 1: 50/50; vật nuôi/Bếp/đơn HTX: 41/41.
- ✅ Typecheck, 305 test, build, check:docs; cấu trúc Godot không lỗi/cảnh báo. Xuất Web bằng Godot trên Mac.
- ✅ Chrome cảnh chơi thật và cảnh xem thử: 1280×720, 844×390, không lỗi trình duyệt/shader. Đã xem ảnh; có video WebM.
- ✅ 52 PNG nguồn qua kiểm màu palette, đen và magenta. Năm atlas mới qua kiểm kích thước, alpha và palette. `test:art` qua trong môi trường có NumPy.
- NOT ASSESSED: điện thoại thật. NPC bước ngắn với khung chân riêng. Clip đi đủ hướng vẫn là phần còn thiếu.

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

Bằng chứng lượt đầu nằm trong thư mục được trỏ bởi `/private/tmp/vac-animation-current`: `motion-final.log`, `chapter.log`, `livestock.log`, `browser.log`, `game-browser.log`. Ảnh/video `godot-animation-*` ở thư mục visualizations của phiên Codex. Lượt sửa bước ngang và cá ở `/private/tmp/vac-stride-current`. Video và ảnh dùng tiền tố `godot-stride-preview`. Lượt giữ tỷ lệ chân ở `/private/tmp/vac-inbetweens-current`. Dải khung gốc/chèn và video dùng tiền tố `godot-inbetween-`. Lượt sửa mũi và đế giày ở `/private/tmp/vac-walkfeet-current`, ảnh/video dùng tiền tố `godot-walkfeet-`. Lượt sửa riêng Chèn 2/3 ở `/private/tmp/vac-plantcontact-current`. Ảnh trước/sau và video dùng tiền tố `godot-plantcontact-`.

Dựng lại atlas từ gốc repo bằng `godot --headless --script tools/art/godot_stride_frames.gd`. Giữ các PNG nguồn trong `art/source/` khi dựng.

RULE D0/D1: không đổi core loop, kinh tế, DB, vùng tương tác hay vị trí marker. Bản đồ và PNG của PO giữ nguyên. Native headless vẫn báo ObjectDB leak lúc thoát (6 ở Chương 1, 11 ở P1-9); chưa kết luận hoặc sửa nguyên nhân trong việc này.

Kết luận **XONG CÓ GHI CHÚ** cho phần sửa dùng asset hiện có. Đã code trên nhánh riêng; chưa merge, áp DB hoặc phát hành. Chờ PO nghiệm thu hình ảnh theo AGENTS.md.

## Nhịp đi theo sheet Walk của PO

Nhánh `codex/godot-walk-reference` tham khảo nhịp Walk trong ảnh PO gửi. Bốn pha chính là qua chân A, đặt B, qua chân B và đặt A. Mỗi vòng có 8 khung với các pha vươn và dồn lực. Mỗi hướng dùng trực tiếp bốn ảnh đặt chân gốc. Lật bộ ngang để đi phải. Hai pha đi qua thu chân dưới hông khi đi ngang và giảm chênh cao hai bàn chân khi đi lên/xuống. Atlas chỉ dùng pixel VAC và ảnh gốc còn nguyên.

- Motion 35/35, Chương 1 50/50. Có kiểm khung nguồn, pixel thân, chân trụ và thứ tự pha. 12 ô 48×64 trong atlas đúng palette và alpha.
- Typecheck, 305 test, build, 9 test art và Web export qua. Browser chạy cảnh farm và F6 ở 1280×720, 844×390 không lỗi.
- Bằng chứng trong thư mục `/private/tmp/vac-walkref-current` trỏ tới. Dải khung, ảnh và video có tiền tố `godot-walk-reference-`.
- Cảnh `animation_preview.tscn` giờ đi cả bốn hướng. Chưa merge, giữ staging ở gói LT-14 đang nghiệm thu.
