# Bàn giao · 21/11/2026 · Godot P1 đã lên URL chính

## Đã merge
- PO duyệt merge `codex/godot-walk-reference` tại `001f209` vào `main`. Điền chủ có bước bốn hướng theo sheet Walk, dùng bốn khung gốc và bốn khung chèn. F6 `godot/animation_preview.tscn` xem đủ hướng. Có hoạt ảnh nghỉ/hành động cho gà/vịt/cá, NPC và gió cây.
- Cùng đợt có vùng an toàn HUD, hướng dẫn cài staging iOS, cache Web lần mở đầu và script đóng gói hai client. Kiểm 35/35 chuyển động, 50/50 Chương 1, 305 test, 9 test art, build/ xuất Web và check:docs. Bằng chứng ở [phiếu hoạt ảnh](qa/GODOT-ANIMATION-2026-11-19.md).
- Godot P1 có ruộng, mùa, điền trang, vật nuôi, bếp, đơn HTX, NPC, Chương 1, hướng dẫn, âm thanh. Bản đồ chỉnh tay trong `godot/estate_map.tscn`, công trình ở `estate_features.tscn`; F5 chạy `estate_probe.tscn`. Hiện trạng xem KY-90.

## Nghiệm thu phát hành
- Staging HTTPS mới chạy `d325444`. Chrome và WebKit qua nâng cấp từ `5687b0e`, ngắt mạng trước khi đóng/mở lại, rồi đọc cùng nông trại khi nối mạng. Xem [phiếu staging](qa/GODOT-PWA-STAGING-2026-11-19.md).
- Staging thử riêng. iPhone 14 Pro Max mở từ icon và giữ lúa/2.498 vàng sau đóng mở. Safari và icon giữ nông trại riêng. Chrome/WebKit mở offline sau lần online đầu, đọc lại sau mất phản hồi gieo chỉ gửi một lần. [Phiếu staging](qa/GODOT-PWA-STAGING-2026-11-19.md).
- Staging HTTPS cùng URL đã chạy `main` tại `5687b0e`. Chrome kiểm SHA-256 gói mới, mở offline, nối mạng và quay Phaser giữ tiến trình. WebKit mở offline. iPhone mở lại icon giữ lúa chín/1.970 vàng. Link tunnel tạm ở `/private/tmp/vac-staging-p1-current` → tệp `origin`.
- `5687b0e` qua mô phỏng WebKit dọc/ngang, tiếng nút và offline ở chế độ standalone, Chrome Android qua hai chạm. Phiếu staging có trang đo tạm và các bước nghiệm thu thật. Lượt sau chưa mở được iPhone Mirroring, Mac chưa thấy Android.
- PO chọn tiếp tục mô phỏng. Nhánh `codex/godot-pwa-offline-update` sửa cache khi bản cập nhật chờ kích hoạt rồi mở lại offline. Chrome/WebKit qua cả tải đủ, WASM trả 503 và hồ sơ mới. Bản sửa đã qua kiểm trên HTTPS staging và chưa merge.
- PO xác nhận `d325444` đạt 5/5 mục trên iPhone và Android thật. Xem [phiếu thiết bị](qa/GODOT-PWA-STAGING-2026-11-19.md#nghiệm-thu-trên-thiết-bị-thật--21112026).
- QD-95: B `524ef73` phục vụ URL chính P1, đã giữ phiên và nông trại qua A/B trên Chrome. A sẵn để quay lui. Chờ PO thử B trên iPhone/Android thật. [Phiếu thiết bị Production](qa/GODOT-PWA-STAGING-2026-11-19.md#nghiệm-thu-bản-b-trên-điện-thoại). Chưa merge, chưa mời P1-12.

## Giữ nguyên
- Luật TypeScript ở server; Godot gửi thao tác. Production `/?p1` mở Godot. `/?p1&client=phaser` và `/?p1&offline` giữ lối Phaser. Game mặc định `/` là MVP cũ.
- Bản đồ/asset PO chỉnh tay phải giữ. Nên xuất Godot trong bản sao tạm để tránh thay đổi cache được theo dõi. Không đụng Supabase “Nam_A_CRM”.
