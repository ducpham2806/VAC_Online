# TÀI LIỆU KIẾN TRÚC KỸ THUẬT SERVER REALTIME, DATABASE, MOBILE LANDSCAPE PWA & CAPACITOR (MASTER TECH SPEC)
## Dự án: **HƯƠNG ĐỒNG GIÓ NỘI (NÔNG TRẠI BA MIỀN – VAC ONLINE)**
**Phiên bản:** Master Tech 4.1 (Đồng bộ Supabase PostgreSQL + Realtime + Kiến trúc Mobile Landscape PWA & Đóng gói Native iOS/Android/iPad qua CapacitorJS)  
**Thực hiện bởi:** `@backend-architect`, `@frontend-developer` & `@technical-artist`

---

## PHẦN 1: KIẾN TRÚC HIỂN THỊ MOBILE LANDSCAPE PWA & ĐÓNG GÓI APP NATIVE (iOS / ANDROID / iPadOS)

### 1.1. Tối Ưu Hóa Màn Hình Ngang (`Landscape-First Viewport`) Cho Đa Thiết Bị
1. **Lớp Engine Phaser 3 Full-Bleed (`100dvw x 100dvh`):**
   * Cấu hình `Phaser.Scale.ENVELOP` kết hợp Camera Bounds mở rộng (`width + 320, height + 180`), cho phép lấp đầy 100% diện tích màn hình trên cả **iPhone màn hình dài (`19.5:9` / `20:9`)**, **Android** lẫn **iPad (`4:3`)** mà không bao giờ xuất hiện dải đen hai bên (Zero Black Bars).
   * Tích hợp điều khiển cảm ứng đa điểm (**Touch Drag-to-Pan** kéo bản đồ mượt mà và **Pinch / Button Zoom `0.75x -> 1.45x`**).
2. **Lớp Giao Diện Floating 2-Thumb HUD & Vùng An Toàn (`Safe-Area Insets`):**
   * Khai báo `viewport-fit=cover` trong `index.html` và sử dụng biến CSS `env(safe-area-inset-top/bottom/left/right)` để tự động đẩy các nút bấm tránh xa vùng **Tai thỏ / Dynamic Island** trên iPhone và thanh **Home Bar** trên iPad.
   * Mọi nút bấm cảm ứng đều áp dụng `.touch-btn` đạt chuẩn kích thước chạm tối thiểu `38px – 44px` kèm phản hồi rung xúc giác (`triggerHaptic`) và âm thanh WebAudio tức thì (`CozySoundManager`).
3. **Lộ Trình Chuyển Đổi 1 Lệnh Từ PWA Sang Native App (`CapacitorJS Pipeline`):**
   * File `capacitor.config.ts` đã cấu hình sẵn `appId: 'vn.huongdonggionoi.vaconline'`, khóa hướng xoay ngang `ScreenOrientation: 'landscape'` và ẩn thanh trạng thái `StatusBar`.
   * Quy trình xuất bản lên App Store & Google Play:
     ```bash
     npm run build
     npx cap add ios && npx cap add android
     npx cap sync
     npx cap open ios     # Build lên TestFlight / App Store (iPhone & iPad)
     npx cap open android # Build file .aab lên Google Play Console
     ```

---

## PHẦN 2: KIẾN TRÚC DATABASE SUPABASE POSTGRESQL & ROW LEVEL SECURITY (RLS)

Toàn bộ định nghĩa 7 bảng cốt lõi (`profiles`, `inventories`, `farm_entities`, `hired_workers`, `market_listings`, `trader_booms`, `farm_guestbook`) và các hàm **Atomic RPC (`SECURITY DEFINER`)** chống gian lận đã được đóng gói sẵn sàng chạy trong:
👉 `/Users/phamduc/Documents/game_farm/supabase/migrations/0001_init_huong_dong_gio_noi.sql`

### Các Nguyên Tắc Bảo Mật & Đồng Bộ Realtime:
1. **Zero Client Write:** Client chỉ có quyền `SELECT` qua RLS. Mọi thay đổi số dư Xu Vàng (`gold`), Ngọc (`gems`), Năng lượng (`stamina`), Kho đồ (`inventories`), Lương/Độ no của 6 Nhân công (`hired_workers`), Thương lái đột xuất (`trader_booms`) và Hái trộm (`rpc_attempt_steal`) đều chạy trong Transaction có khóa dòng `FOR UPDATE` trên PostgreSQL.
2. **Supabase Realtime Broadcast & Presence:**
   * Kênh `global:loa_phuong`: Phát thông báo toàn server khi có người nổ Độc Đắc Xổ Số 18:00, lai tạo thành công Cây Đột Biến SSR hoặc trùng tu xong Đình Làng, kèm 50 suất **Xin Vía Nhận Lộc**.
   * Kênh `farm:room:{host_user_id}`: Đồng bộ vị trí khách đang đứng thăm nhà, ký Sổ Lưu Bút Cổng Làng, dựng giúp giàn cây sau bão và hái trộm theo thời gian thực.
