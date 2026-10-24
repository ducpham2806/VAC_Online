# 🌾 AGENTS.MD — QUY TẮC CỐT LÕI DỰ ÁN "HƯƠNG ĐỒNG GIÓ NỘI (VAC ONLINE)"

Tài liệu này được nạp tự động cho các AI Coding Agents (Antigravity, Cursor, Claude, ChatGPT) khi phát triển dự án.

## 1. Kiến trúc Kỹ thuật & Chuẩn Mobile Landscape PWA / Native App (iOS, Android, iPad)
* **Stack cố định:** `Vite + React 19 + Phaser 3 + TypeScript (Strict Mode) + Tailwind CSS + Zustand + Supabase + CapacitorJS`.
* **100% Data-Driven:** Đọc toàn bộ thông số từ `04_MASTER_DATA_Bang_Thong_So_Kinh_Te_Toan_Game.csv` / `src/data/masterData.ts`.
* **Chống gian lận:** Mọi giao dịch tiền tệ, kho đồ, thuê nhân công, chợ P2P và hái trộm trên Production bắt buộc gọi qua **Supabase PostgreSQL RPC (`SECURITY DEFINER`)**.
* **Chuẩn Hiển Thị Màn Hình Ngang Mobile PWA & iPad (`RULE C6`):**
  1. **Full-Bleed Landscape Viewport (`100dvw x 100dvh`):** Canvas Phaser 3 đặt ở `fixed inset-0 z-0` với `Phaser.Scale.ENVELOP`, hỗ trợ kéo ngón tay di chuyển bản đồ (`Touch Drag-to-Pan`) và cụm nút thu phóng (`➕ / 🎯 / ➖`) để không bao giờ bị viền đen trên cả điện thoại màn hình dài (`19.5:9`, `20:9`) lẫn iPad (`4:3`).
  2. **Floating 2-Thumb Ergonomic HUD & Safe-Area Insets:** Tuyệt đối không dùng thanh Header/Footer dạng khối đặc chiếm chiều cao màn hình ngang điện thoại. Toàn bộ HUD phải nổi (`fixed`), áp dụng `env(safe-area-inset-top/bottom/left/right)` tránh tai thỏ/Dynamic Island, chia rõ **Vùng Ngón Cái Trái** (Khay hạt giống thu gọn, Giỏ kho thợ, Chat) và **Vùng Ngón Cái Phải** (6 nút tính năng chính + Zoom), kích thước nút cảm ứng tối thiểu `>= 38–44px`.
  3. **Smart Portrait Prompt & Capacitor Ready:** Hiển thị màn hình nhắc xoay ngang thông minh khi cầm dọc điện thoại (có nút bật Fullscreen khóa ngang `⛶` và nút bỏ qua), cấu hình sẵn `public/manifest.webmanifest`, `public/sw.js` và `capacitor.config.ts`.

## 2. Quy tắc Kinh tế, 6 Nhân công Lán Thợ & 12 Tính năng Benchmark
* **4 Vòng lặp tiêu tiền của 6 Nhân công (`WORK_01..06` từ Lv 14+):** Trả lương Vàng (`800–3,500 🪙/ngày`) + Nuôi cơm Bàn Ăn Lán Thợ + Áo quần bảo hộ độ bền `72h` + Thưởng Phụ Cấp Ngày Mùa. Nhân công chờ **5 phút sau khi cây chín** mới thu hoạch (chừa phút 3–5 cho bạn bè rình trộm) và cất vào **Giỏ Kho Lán Thợ (`120 ô riêng`)**.
* **Bảo hiểm đi trộm 80% & Zero-Sum Penalty:** Khi bị Chó Phú Quốc (`70%`) bắt, số Vàng phạt trừ trực tiếp từ ví kẻ trộm chuyển cho chủ nhà (khấu trừ 10% thuế hệ thống) kèm `1 Chiếc Dép Tổ Ong`.
