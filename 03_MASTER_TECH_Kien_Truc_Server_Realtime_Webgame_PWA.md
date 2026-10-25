# TÀI LIỆU KIẾN TRÚC KỸ THUẬT SUPABASE REALTIME, MOBILE LANDSCAPE PWA, CAPACITOR & BỘ QUY TẮC CODE CỐT LÕI (MASTER TECH & ENGINEERING RULES)
## Dự án: **VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)**
**Mã tài liệu:** `03_MASTER_TECH_Kien_Truc_Server_Realtime_Webgame_PWA.md` *(Đã hợp nhất `03_MASTER_TECH` + `10_MASTER_AI_RULES`, loại bỏ trùng lặp)*  
**Phiên bản:** Master Tech & Rules 5.0  
**Đối tượng sử dụng:** Frontend Engineers (Phaser 3 / React 19), Backend Engineers (Supabase PostgreSQL / Realtime), DevOps & Mobile Release Engineers

---

## PHẦN 1: NGĂN XẾP KỸ THUẬT & SƠ ĐỒ KIẾN TRÚC TỔNG THỂ (`SYSTEM ARCHITECTURE`)

### 1.1. Tech Stack Cố Định
* **Frontend Game Engine:** `Phaser 3.88+` (WebGL/Canvas 2D Full-Bleed `100dvw x 100dvh`, `roundPixels: true`, `PixelAssetGenerator`).
* **Frontend UI & State:** `Vite 6` + `React 19` + `TypeScript 5.8 (Strict Mode)` + `Tailwind CSS v4` + `Zustand Store` (`useGameStore.ts`).
* **Audio & Canvas Utilities:** `CozySoundManager` (Web Audio API Synthesizer 0ms latency) + `certificateExporter.ts` (HTML5 Canvas PNG Exporter `960x540`).
* **Backend & Cloud:** `Supabase` (`PostgreSQL 15+`, `Supabase Auth`, `Row Level Security`, `PL/pgSQL Atomic RPCs`, `Supabase Realtime Presence & Broadcast`).
* **PWA & Native Packaging:** `public/manifest.webmanifest` + `public/sw.js` (Offline-First Service Worker) + `CapacitorJS 7` (`iOS`, `Android`, `iPadOS`).

### 1.2. Cấu Trúc Thư Mục Mã Nguồn Chuẩn
```text
/Users/phamduc/Documents/game_farm/
├── index.html                          # Khai báo viewport-fit=cover & manifest PWA
├── capacitor.config.ts                 # Cấu hình đóng gói iOS/Android khóa hướng Landscape
├── vercel.json                         # Cấu hình SPA Rewrite & Cache-Control Header cho sw.js
├── public/
│   ├── manifest.webmanifest            # Cấu hình PWA Fullscreen Landscape
│   ├── sw.js                           # Service Worker Offline Cache
│   └── icon-192.svg / icon-512.svg     # Bộ Icon App chuẩn Vector/PNG
├── supabase/migrations/
│   ├── 0001_init_huong_dong_gio_noi.sql # 8 Bảng cốt lõi + RLS + RPC hái trộm & thương lái
│   └── 0002_seed_full_master_data.sql   # Bảng master_catalog (155 items) + RPC chợ & lưu bút
└── src/
    ├── data/
    │   ├── types.ts                    # Toàn bộ TypeScript Interfaces toàn dự án
    │   └── masterData.ts               # Danh mục cứng 155 Thực thể (GAME_CATALOG)
    ├── services/
    │   ├── supabaseClient.ts           # Khởi tạo kết nối Supabase & lưu thông tin cấu hình
    │   ├── authService.ts              # Đăng ký, Đăng nhập, Chơi Khách, Liên kết TK (+50💎), Quên MK OTP
    │   ├── realtimeService.ts          # Kênh Realtime vac_online_global_hub (Presence, Chat, Loa, Chợ)
    │   ├── soundEffects.ts             # Nhạc nền Ngũ Cung 3 miền & 6 hiệu ứng âm thanh đồng quê
    │   ├── certificateExporter.ts      # Vẽ & tải ảnh Bằng Khen Điền Chủ (.PNG) bằng HTML5 Canvas
    │   └── qcTestRunner.ts             # Bộ chạy kiểm thử tự động 25 Test Cases (Snapshot & Restore)
    ├── game/
    │   ├── EventBus.ts                 # Cầu nối sự kiện 2 chiều React HUD <-> Phaser 3 Scene
    │   ├── PhaserGame.tsx              # Khởi tạo Phaser.Scale.RESIZE / ENVELOP
    │   ├── assets/PixelAssetGenerator.ts # Sinh bộ Texture Pixel Art 64 màu trong bộ nhớ
    │   └── scenes/FarmScene.ts         # Bản đồ 3 miền, Tàu Thống Nhất, 6 Thợ đi tuần, Mưa/Đom đóm
    ├── components/
    │   └── SplashAndAuthGate.tsx       # Màn hình 0A (Splash 4 bước) & 0B (Cổng Xác Thực 4 Tabs)
    ├── store/useGameStore.ts           # Zustand Store quản lý toàn bộ Gameplay, Kinh tế & 10 Chương
    └── App.tsx                         # Giao diện 2-Thumb Landscape HUD & 11 Cửa sổ Modal
```

---

## PHẦN 2: KIẾN TRÚC DATABASE SUPABASE POSTGRESQL, RLS & ATOMIC RPC

### 2.1. Danh Mục 9 Bảng Dữ Liệu Trên Supabase (`0001` & `0002` Migrations)
1. `public.master_catalog`: Lưu trữ 155 thực thể chuẩn (`id`, `category`, `region`, `name`, `unlock_level`, `buy_cost_gold`, `base_sell_gold`, `grow_or_craft_minutes`, `xp_reward`).
2. `public.profiles`: Hồ sơ người chơi (`id`, `display_name`, `gender`, `region`, `level`, `xp`, `gold`, `gems`, `stamina`, `style_score`, `feng_shui_score`, `neighbor_points`, `dinh_lang_stage`).
3. `public.farm_entities`: Trạng thái từng ô đất/ao/vườn cây (`id`, `user_id`, `zone_type`, `item_id`, `planted_at`, `mature_at`, `watered`, `mud_applied`, `is_golden`, `remaining_yield`, `stolen_by`).
4. `public.inventories`: Kho nông sản, món ăn, vật tư và trang phục (`user_id`, `item_id`, `quantity`).
5. `public.hired_workers`: Trạng thái 6 Nhân công Lán Thợ (`user_id`, `worker_code`, `is_hired`, `contract_expires_at`, `belly_meter`, `morale_meter`, `equipped_gear_id`, `gear_durability`).
6. `public.market_listings`: Sạp hàng Báo Chợ Phiên P2P 3 Miền (`id`, `seller_id`, `seller_name`, `region`, `item_id`, `quantity`, `unit_price`, `status`).
7. `public.trader_booms`: Phiên Thương Lái Đột Xuất giá sốt `1.5x–3.0x` (`host_user_id`, `featured_item_id`, `price_multiplier`, `remaining_quota`, `expires_at`).
8. `public.steal_logs`: Nhật ký thăm nhà & hái trộm/chó rượt.
9. `public.farm_guestbook`: Sổ Lưu Bút Cổng Làng (`id`, `host_name`, `visitor_name`, `message`, `created_at`).

### 2.2. Đặc Tả 5 Hàm Atomic RPC Chống Gian Lận (`SECURITY DEFINER`)
1. `public.rpc_sync_master_catalog(p_items JSONB)`: Đồng bộ trọn bộ 155 thực thể từ Client lên bảng `public.master_catalog` (`ON CONFLICT (id) DO UPDATE`).
2. `public.rpc_post_market_listing(...)`: Kiểm tra khung giá hợp lệ `[0.8x, 2.0x Base_Sell_Gold]` ngay trên PostgreSQL trước khi cho phép đăng bán.
3. `public.rpc_attempt_steal(p_thief_id UUID, p_target_tile_id UUID)`:
   * Khóa dòng `FOR UPDATE` trên `public.farm_entities`.
   * Chặn nếu chưa qua **3 phút Ân huệ** (`NOW() < mature_at + INTERVAL '3 minutes'`).
   * Chặn nếu đã chạm **Ngưỡng Bảo hiểm 80% sản lượng** (`remaining_yield <= CEIL(total_yield * 0.80)`).
   * Chặn nếu `p_thief_id = ANY(stolen_by)`.
   * Quay xúc xắc phòng thủ (*Chó Phú Quốc 70%, Ngỗng 40%, Bẫy Vỏ Chuối 100%*): nếu bị bắt thì trừ `50 🪙` từ ví kẻ trộm chuyển cho chủ nhà (**Zero-Sum Penalty**) và tặng `1 Chiếc Dép Tổ Ong`.
4. `public.rpc_sell_to_friend_trader(...)`: Khóa dòng `FOR UPDATE` trên `public.trader_booms`, giới hạn mỗi khách bán ké tối đa `20 đơn vị`, cộng `+5%` hoa hồng cho chủ nhà.
5. `public.rpc_sign_guestbook(...)`: Lưu lời chúc vào `public.farm_guestbook` và trả về bản ghi mới.

---

## PHẦN 3: BỘ 12 QUY TẮC KỸ THUẬT BẤT KHẢ XÂM PHẠM (MANDATORY ENGINEERING RULES)

| Mã Quy Tắc | Tên Quy Tắc | Nội Dung Bắt Buộc Khi Viết Code & Kiểm Thử |
| :---: | :--- | :--- |
| **RULE C1** | **TypeScript Strict & Zero `any`** | Toàn bộ file `.ts` / `.tsx` phải biên dịch `tsc --noEmit` với `0 errors`, không dùng kiểu `any`. |
| **RULE C2** | **100% Data-Driven (155 Items)** | Mọi giá mua, giá bán, thời gian chín, XP đều phải tra cứu từ `GAME_CATALOG` (`src/data/masterData.ts`). |
| **RULE C3** | **XSS Input Sanitization** | Mọi chuỗi người dùng nhập (Tên Điền chủ, Tin nhắn Chat, Sổ Lưu Bút) phải lọc `.replace(/[<>]/g, '').trim()`. |
| **RULE C4** | **Chống Số Dư Âm Tuyệt Đối** | Trước mọi thao tác tiêu tốn `gold`, `gems`, `stamina`, `inventory[item]`, bắt buộc kiểm tra `>= cost`; khi trừ phạt dùng `Math.min(state.gold, penalty)`. |
| **RULE C5** | **Khóa Trần Chỉ Số (`Clamp`)** | `stamina = Math.min(maxStamina, stamina + gain)`; `workerPantryCount = Math.min(120, count + gain)`; `wildPlotsUnlocked <= 25`. |
| **RULE C6** | **Phân Biệt Tap vs. Drag Trên Bản Đồ** | Trong `FarmScene.ts`, nếu khoảng cách kéo ngón tay `dist > 12px` thì bật `isDragging = true` và hủy sự kiện thu hoạch khi nhả tay (`pointerup`). |
| **RULE C7** | **Full-Bleed Landscape & Safe-Area** | Canvas Phaser 3 phủ `fixed inset-0 z-0`; các thanh HUD dùng `env(safe-area-inset-*)` tránh tai thỏ/Dynamic Island, vùng chạm nút `>= 38–44px`. |
| **RULE C8** | **Kết Nối Kép (Cloud + Local Vault)** | Mọi tính năng Auth, Chợ Phiên, Lưu Bút phải hoạt động mượt cả khi có mạng Supabase Cloud lẫn khi mất mạng (Offline PWA). |
| **RULE C9** | **Cửa Sổ Trộm 2 Phút & Lazy-Tick** | Nhân công chờ 5 phút sau khi cây chín mới thu gom; khi mở lại game phải tính sản lượng Offline qua `simulateOfflineWorkerProgress`. |
| **RULE C10** | **Không Dùng `window.alert/confirm`** | Toàn bộ thông báo trong game phải hiển thị qua hệ thống **Toast Banner Gỗ/Tre** (`setToast`) hoặc Modal UI. |
| **RULE C11** | **Zero External Audio Blocking** | Âm thanh và nhạc nền Ngũ Cung tổng hợp trực tiếp qua Web Audio API (`soundEffects.ts`), tự động `resume()` khi người chơi chạm màn hình. |
| **RULE C12** | **Kiểm Thử Tự Động Snapshot An Toàn** | Bộ `runFullQCTestSuite()` (`25 Test Cases`) phải chụp `structuredClone` trước khi chạy và khôi phục 100% trạng thái sau khi kết thúc. |
