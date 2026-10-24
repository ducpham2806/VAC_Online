# 🌾 HƯƠNG ĐỒNG GIÓ NỘI (NÔNG TRẠI BA MIỀN – VAC ONLINE)

Dự án Webgame / PWA -> Mobile App thể loại **Cozy Bright Vietnamese Pixel Art Hybrid Farm Tycoon & Social RPG**, được khởi tạo theo đúng kiến trúc **Master 3.0 – 4.0**.

## 🚀 Hướng dẫn Khởi chạy Nhanh (Quick Start)

1. Mở Terminal tại thư mục `/Users/phamduc/Documents/game_farm` và cài đặt thư viện:
   ```bash
   npm install
   ```
2. Chạy môi trường phát triển (Vite Dev Server tại `http://localhost:5173`):
   ```bash
   npm run dev
   ```
   *(Mặc định game có sẵn chế độ **Local Demo Fallback** để bạn trải nghiệm ngay lập tức toàn bộ vòng lặp Vườn – Ao – Chuồng, Lán Thợ 6 Gia Nhân, Bếp Quê Ngẫu Nhiên, Vườn Ươm Đột Biến, Đình Làng, Thương Lái Đột Xuất, Báo Chợ 3 Miền & Đi Trộm mà chưa cần cấu hình Supabase).*

3. **Kết nối Supabase (Khi lên Server thật):**
   * Copy `.env.example` thành `.env` và điền `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.
   * Chạy file SQL trong `supabase/migrations/0001_init_huong_dong_gio_noi.sql` trên Supabase SQL Editor để tạo bảng, RLS và các hàm Atomic RPC chống gian lận.
