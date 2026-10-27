# TÀI LIỆU KIẾN TRÚC KỸ THUẬT SUPABASE REALTIME, ĐỒNG BỘ SẢNH CHUNG MULTIPLAYER, KHUNG HYPER-CASUAL SDK & BỘ 14 QUY TẮC CODE CỐT LÕI (MASTER TECH & ENGINEERING RULES)
## Dự án: **VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)**
**Mã tài liệu:** `03_MASTER_TECH_Kien_Truc_Server_Realtime_Webgame_PWA.md` *(Đã hợp nhất `03_MASTER_TECH` + `10_MASTER_AI_RULES` + **Phần 3: Kiến Trúc Đồng Bộ Sảnh Chung `10Hz` & Khung Plug-and-Play Hyper-Casual SDK**, tích hợp `RULE D0` & `RULE D1`)*  
**Phiên bản:** Master Tech & Rules 7.0 (Full Production, Multiplayer Social Hub & Architectural Integrity Edition)  
**Thực hiện bởi:** `@backend-architect`, `@godot-multiplayer-engineer`, `@frontend-developer`, `@technical-artist` & `@code-reviewer`  
**Đối tượng sử dụng:** Frontend Engineers (Phaser 3 / React 19), Backend Engineers (Supabase PostgreSQL / Realtime), DevOps & Mobile Release Engineers

---

## PHẦN 1: NGĂN XẾP KỸ THUẬT & SƠ ĐỒ KIẾN TRÚC TỔNG THỂ (`SYSTEM ARCHITECTURE`)

### 1.1. Tech Stack Cố Định
* **Frontend Game Engine:** `Phaser 3.88+` (WebGL/Canvas 2D Full-Bleed `100dvw x 100dvh`, `roundPixels: true`, `PixelAssetGenerator`, hỗ trợ đa Scene cô lập: `FarmScene`, `SocialPlazaScene`, `MinigameHostScene`).
* **Frontend UI & State:** `Vite 6` + `React 19` + `TypeScript 5.8 (Strict Mode)` + `Tailwind CSS v4` + `Zustand Store` (`useGameStore.ts`).
* **Audio & Canvas Utilities:** `CozySoundManager` (Web Audio API Synthesizer 0ms latency) + `certificateExporter.ts` (HTML5 Canvas PNG Exporter `960x540`).
* **Backend & Multiplayer Cloud:** `Supabase` (`PostgreSQL 15+`, `Supabase Auth`, `Row Level Security`, `PL/pgSQL Atomic RPCs`, `Supabase Realtime Presence & Broadcast Sharded Rooms`).
* **PWA & Native Packaging:** `public/manifest.webmanifest` + `public/sw.js` (Offline-First Service Worker) + `CapacitorJS 7` (`iOS`, `Android`, `iPadOS`).

### 1.2. Cấu Trúc Thư Mục Mã Nguồn Chuẩn (Bao Gồm Sảnh Chung & Khung Hyper-Casual SDK)
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
│   ├── 0001_init_huong_dong_gio_noi.sql # Bảng cốt lõi + RLS + RPC hái trộm & thương lái
│   ├── 0002_seed_full_master_data.sql   # Bảng master_catalog (155 items) + RPC chợ & lưu bút
│   └── 0003_social_plaza_and_arena.sql  # Bảng arena_matches, minigame_scores & RPC quyết toán PK
└── src/
    ├── data/
    │   ├── types.ts                    # Toàn bộ TypeScript Interfaces toàn dự án
    │   └── masterData.ts               # Danh mục cứng 155 Thực thể (GAME_CATALOG)
    ├── services/
    │   ├── supabaseClient.ts           # Khởi tạo kết nối Supabase & lưu thông tin cấu hình
    │   ├── authService.ts              # Đăng ký, Đăng nhập, Chơi Khách, Liên kết TK (+50💎), Quên MK OTP
    │   ├── realtimeService.ts          # Kênh Realtime vac_online_global_hub & Sharded Plaza Rooms
    │   ├── soundEffects.ts             # Nhạc nền Ngũ Cung 3 miền & SFX đồng quê / võ đài
    │   ├── certificateExporter.ts      # Vẽ & tải ảnh Bằng Khen Điền Chủ (.PNG) bằng HTML5 Canvas
    │   └── qcTestRunner.ts             # Bộ chạy kiểm thử tự động 37 Test Cases (Snapshot & Restore)
    ├── game/
    │   ├── EventBus.ts                 # Cầu nối sự kiện 2 chiều React HUD <-> Phaser 3 Scenes
    │   ├── PhaserGame.tsx              # Khởi tạo Phaser.Scale.RESIZE / ENVELOP
    │   ├── assets/PixelAssetGenerator.ts # Sinh bộ Texture Pixel Art 64 màu trong bộ nhớ
    │   ├── scenes/
    │   │   ├── FarmScene.ts            # Bản đồ Nông trại 3 miền, Tàu Thống Nhất, 6 Thợ đi tuần
    │   │   ├── SocialPlazaScene.ts     # [GIAI ĐOẠN 6] Sảnh Chung Chợ Đình (Joystick, 30 CCU LERP)
    │   │   └── MinigameHostScene.ts    # [GIAI ĐOẠN 6] Khung vỏ chạy các băng game PK & Hyper-Casual
    │   └── minigames/                  # [PLUG-AND-PLAY HYPER-CASUAL CARTRIDGES]
    │       ├── IHyperCasualCartridge.ts # Chuẩn giao diện lắp ghép 1-file cho mọi minigame mới
    │       ├── BambooJoust1v1.ts       # PK 1v1: Đi Cầu Tre Đấu Gậy Bông
    │       ├── VillageSumo1v1.ts       # PK 1v1: Đấu Vật Sới Đình
    │       ├── CaptureRiceFlag3v3.ts   # Team 3v3: Cướp Cờ Bông Lúa Vàng
    │       ├── MudPondDuckBrawl8P.ts   # Loạn Chiến 8P: Ao Làng Đại Náo Bắt Vịt Vàng
    │       ├── BambooSlicerSolo.ts     # Hyper-Casual Đơn 30s: Chẻ Tre & Bổ Dừa Siêu Tốc
    │       └── LotusHopperSolo.ts      # Hyper-Casual Đơn 30s: Nhảy Lá Sen Qua Ao Cá
    ├── components/
    │   ├── SplashAndAuthGate.tsx       # Màn hình 0A (Splash 4 bước) & 0B (Cổng Xác Thực 4 Tabs)
    │   └── SocialPlazaAndArenaModal.tsx # Giao diện Sảnh Chung, Ghép trận PK & Máy Thùng Arcade
    ├── store/useGameStore.ts           # Zustand Store quản lý toàn bộ Gameplay, Kinh tế & Đấu Trường
    └── App.tsx                         # Giao diện 2-Thumb Landscape HUD & Hệ thống Cửa sổ Modal
```

---

## PHẦN 2: KIẾN TRÚC DATABASE SUPABASE POSTGRESQL, RLS, ATOMIC RPC & QUY TẮC BẢO TOÀN DỮ LIỆU (`RULE D1`)

### 2.1. Danh Mục 11 Bảng Dữ Liệu Trên Supabase (`0001`, `0002` & `0003` Migrations — Additive-Only Schema)
1. `public.master_catalog`: Lưu trữ 155 thực thể chuẩn (`id`, `category`, `region`, `name`, **`unlock_stage` (`1..5`)**, **`unlock_story_chapter` (`1..10`)**, `unlock_level`, `buy_cost_gold`, `base_sell_gold`, `grow_or_craft_minutes`, `xp_reward`) — phục vụ cơ chế **Mở khóa 3 tầng (`Stage + Story Chapter + Level`)** chia nhỏ 81 loài V-A-C qua 5 Giai đoạn.
2. `public.profiles`: Hồ sơ người chơi (`id`, `display_name`, `gender`, `region`, `level`, `xp`, `gold`, `gems`, `stamina`, **`current_stage_unlocked` (`1..6`)**, **`highest_story_chapter_completed` (`0..10`)**, `style_score`, `feng_shui_score`, `neighbor_points`, `dinh_lang_stage`, `festival_tokens` (`🏮 Xu Hội Làng`), `arena_elo`, `daily_arcade_gold_earned`).
3. `public.farm_entities`: Trạng thái từng ô đất/ao/vườn cây (`id`, `user_id`, `zone_type`, `item_id`, `planted_at`, `mature_at`, `watered`, `mud_applied`, `is_golden`, `remaining_yield`, `stolen_by`).
4. `public.inventories`: Kho nông sản, món ăn, vật tư, kỷ vật 8x–9x và trang phục (`user_id`, `item_id`, `quantity`).
5. `public.hired_workers`: Trạng thái 6 Nhân công Lán Thợ (`user_id`, `worker_code`, `is_hired`, `contract_expires_at`, `belly_meter`, `morale_meter`, `equipped_gear_id`, `gear_durability`).
6. `public.market_listings`: Sạp hàng Báo Chợ Phiên P2P 3 Miền (`id`, `seller_id`, `seller_name`, `region`, `item_id`, `quantity`, `unit_price`, `status`).
7. `public.trader_booms`: Phiên Thương Lái Đột Xuất giá sốt `1.5x–3.0x`.
8. `public.steal_logs`: Nhật ký thăm nhà & hái trộm/chó rượt.
9. `public.farm_guestbook`: Sổ Lưu Bút Cổng Làng (`id`, `host_name`, `visitor_name`, `message`, `created_at`).
10. `public.arena_matches` *(Giai đoạn 6 - Mới)*: Lưu trữ phiên đấu PK 1v1, 3v3 & Loạn Chiến 8–12P (`match_id`, `mode_code`, `entry_fee_gold`, `tax_burned_gold`, `participants JSONB`, `winner_ids UUID[]`, `status`, `created_at`).
11. `public.minigame_leaderboards` *(Giai đoạn 6 - Mới)*: Bảng vàng kỷ lục tuần của từng trò chơi Hyper-Casual (`game_code`, `user_id`, `display_name`, `region`, `best_score`, `week_key`).

### 2.2. Đặc Tả 7 Hàm Atomic RPC Chống Gian Lận (`SECURITY DEFINER`)
1. `public.rpc_sync_master_catalog(p_items JSONB)`: Đồng bộ trọn bộ 155 thực thể lên bảng `public.master_catalog` bằng `ON CONFLICT (id) DO UPDATE` (tuyệt đối không xóa các dòng đang tham chiếu bởi `inventories` hoặc `farm_entities`).
2. `public.rpc_post_market_listing(...)`: Kiểm tra khung giá hợp lệ `[0.8x, 2.0x Base_Sell_Gold]` ngay trên PostgreSQL.
3. `public.rpc_attempt_steal(p_thief_id UUID, p_target_tile_id UUID)`: Khóa dòng `FOR UPDATE`, kiểm tra 3 phút ân huệ, trần bảo hiểm 80%, và phạt Zero-Sum `50 🪙` + tặng `Dép Tổ Ong` khi bị bắt.
4. `public.rpc_sell_to_friend_trader(...)`: Khóa dòng `FOR UPDATE`, giới hạn mỗi khách bán ké tối đa `20 đơn vị`, cộng `+5%` hoa hồng cho chủ nhà.
5. `public.rpc_sign_guestbook(...)`: Lưu lời chúc vào `public.farm_guestbook`.
6. `public.rpc_settle_arena_wager(p_match_id UUID, p_winner_id UUID)` *(Giai đoạn 6 - Mới)*:
   * Khóa dòng `FOR UPDATE` trên `public.profiles` của các đấu thủ.
   * Kiểm tra chống dàn xếp tỉ số: nếu 2 người chơi đã đấu quá `3 trận tính thưởng/ngày`, từ chối trao vàng cược.
   * Khấu trừ đúng **`10% Thuế Sới Đình`** (`tax_burned_gold = FLOOR(total_pot * 0.10)`), cộng `90%` quỹ thưởng và `+25 🏮 Xu Hội Làng` cho người chiến thắng.
7. `public.rpc_submit_minigame_score(p_game_code TEXT, p_score INT)` *(Giai đoạn 6 - Mới)*:
   * Kiểm tra ngưỡng điểm hợp lý theo thời gian ván chơi (`Anti-Speedhack Ceiling`) và kiểm tra trần **`daily_arcade_gold_earned < 1500`** trước khi cộng Xu Vàng thưởng.

---

## PHẦN 3: KIẾN TRÚC ĐỒNG BỘ MẠNG SẢNH CHUNG (`10Hz STATE SYNC`) & KHUNG LẮP GHÉP HYPER-CASUAL SDK (`PLUG-AND-PLAY CARTRIDGE ARCHITECTURE`)

### 3.1. Kiến Trúc Phân Kênh & Nội Suy Chuyển Động Sảnh Chung (`@godot-multiplayer-engineer` & `@backend-architect`)

Để hàng trăm người chơi cùng vào **Sảnh Chung Chợ Đình** mà không gây nghẽn băng thông WebSockets hay tụt FPS trên điện thoại tầm trung:

1. **Phân Kênh Tự Động (`Spatial Room Sharding: vac_plaza_room_01..99`):**
   * Mỗi phòng Sảnh Chung giới hạn tối đa **`25 – 30 người chơi hiển thị đồng thời (Max 30 CCU/Shard)`**. Khi phòng `01` đạt `25/30`, người chơi mới tự động được định tuyến sang phòng `02` (vẫn cho phép bấm chọn đổi kênh thủ công để hội ngộ bạn bè).
2. **Tần Số Đồng Bộ `10Hz` Kết Hợp Nội Suy Tuyến Tính `60 FPS` (`10Hz Broadcast + Client LERP`):**
   * Client của người chơi chỉ gửi gói tin vị trí rút gọn `PlazaStatePacket` mỗi **`100ms` (`10 gói/giây`)** khi nhân vật thực sự di chuyển hoặc tung biểu cảm:
     ```ts
     export interface PlazaPlayerPacket {
       uid: string;
       name: string;
       region: 'NORTH' | 'CENTRAL' | 'SOUTH';
       x: number;          // Làm tròn số nguyên (0..1536)
       y: number;          // Làm tròn số nguyên (0..1024)
       vx: number;         // Vận tốc hướng X (-1, 0, 1)
       vy: number;         // Vận tốc hướng Y (-1, 0, 1)
       emoteId?: string;   // Biểu cảm đang bật (Múa sạp, Múa lân, Vẫy tay)
       chatBubble?: string;// Bong bóng thoại tối đa 60 ký tự
       styleScore: number; // Điểm phong cách hiển thị huy hiệu
     }
     ```
   * Tại mỗi khung hình render (`60 FPS` trong `SocialPlazaScene.ts`), vị trí hiển thị của các người chơi khác được làm mượt bằng công thức nội suy:
     $$P_{\text{render}}(t) = \text{Lerp}\left(P_{\text{current}}, P_{\text{target}} + V \cdot \Delta t, 0.18\right)$$
   * Nhờ đó, băng thông tiêu thụ giảm **85%** so với đồng bộ 60Hz thô nhưng chuyển động trên màn hình vẫn mượt như lụa!

---

### 3.2. Chuẩn Giao Diện "Băng Trò Chơi Lắp Ghép" (`IHyperCasualCartridge` — Build Minigame Mới Trong 2 Giờ)

Mọi trò chơi Đơn Hyper-Casual (`15s–45s`), PK 1v1 (`45s–60s`) hoặc Loạn Chiến (`60s–90s`) đều tuân thủ chuẩn **1-File Cartridge Interface** dưới đây:

```ts
export interface HyperCasualContext {
  width: number;
  height: number;
  seed: number; // Dùng PRNG đồng bộ seed cho cả 2 máy khi đấu PK/Brawl!
  addScore: (delta: number, floatingLabel?: string) => void;
  playSound: (sfx: 'HIT' | 'COIN' | 'SPLASH' | 'GONG') => void;
  endMatch: (winnerSide: 'PLAYER' | 'OPPONENT' | 'DRAW') => void;
}

export interface IHyperCasualCartridge {
  readonly code: string;              // VD: 'HC_SOLO_01' | 'PK_1V1_01' | 'BRAWL_8P_01'
  readonly title: string;             // Tên hiển thị trên cổng Máy Thùng / Võ Đài
  readonly mode: 'SOLO_HC' | 'PK_1V1' | 'TEAM_3V3' | 'BRAWL_8P';
  readonly durationSeconds: number;   // 30 | 45 | 60 | 75
  readonly entryFeeGold: number;      // 0 (Giải trí) hoặc 150..300 (Có vé Sới Đình)
  init(ctx: HyperCasualContext): void;
  onActionInput(action: 'LEFT' | 'RIGHT' | 'HIGH' | 'LOW' | 'JUMP' | 'DASH' | 'SWIPE', x?: number, y?: number): void;
  update(dtMs: number): void;
  dispose(): void;
}
```

> **Quy trình để thêm 1 game Hyper-Casual mới bất kỳ trong tương lai:**
> 1. Tạo 1 file mới trong `src/game/minigames/` implement `IHyperCasualCartridge` (`< 200 dòng`).
> 2. Đăng ký mã game vào mảng `HYPER_CASUAL_REGISTRY` trong `MinigameHostScene.ts`.
> 3. Toàn bộ UI đếm ngược, tính điểm, chống hack trần `1,500 🪙/ngày`, cộng `🏮 Xu Hội Làng` và Bảng Xếp Hạng tự động hoạt động 100% mà không cần sửa lại `App.tsx` hay Database!

---

## PHẦN 4: BỘ 14 QUY TẮC KỸ THUẬT BẤT KHẢ XÂM PHẠM (MANDATORY ENGINEERING RULES — TÍCH HỢP `RULE D1`)

| Mã Quy Tắc | Tên Quy Tắc | Nội Dung Bắt Buộc Khi Viết Code & Kiểm Thử |
| :---: | :--- | :--- |
| **RULE C1** | **TypeScript Strict & Zero `any`** | Toàn bộ file `.ts` / `.tsx` phải biên dịch `tsc --noEmit` với `0 errors`, không dùng kiểu `any`. |
| **RULE C2** | **100% Data-Driven (155 Items)** | Mọi giá mua, giá bán, thời gian chín, XP, đợt mở khóa (`unlockStage`, `unlockChapter`) đều phải tra cứu từ `GAME_CATALOG` (`src/data/masterData.ts`). |
| **RULE C3** | **XSS Input Sanitization** | Mọi chuỗi người dùng nhập (Tên Điền chủ, Tin nhắn Chat, Bong bóng thoại Sảnh Chung, Sổ Lưu Bút) phải lọc `.replace(/[<>]/g, '').trim()`. |
| **RULE C4** | **Chống Số Dư Âm Tuyệt Đối** | Trước mọi thao tác tiêu tốn `gold`, `gems`, `stamina`, `festivalTokens`, `inventory[item]`, bắt buộc kiểm tra `>= cost`; khi trừ phạt dùng `Math.min(state.gold, penalty)`. |
| **RULE C5** | **Khóa Trần Chỉ Số & Trần Thưởng Arcade (`Clamp`)** | `stamina = Math.min(maxStamina, stamina + gain)`; `workerPantryCount = Math.min(120, count + gain)`; `dailyArcadeGoldEarned <= 1500`. |
| **RULE C6** | **Phân Biệt Tap vs. Drag Trên Bản Đồ** | Trong `FarmScene.ts`, nếu khoảng cách kéo ngón tay `dist > 12px` thì bật `isDragging = true` và hủy sự kiện thu hoạch khi nhả tay (`pointerup`). |
| **RULE C7** | **Full-Bleed Landscape & Safe-Area** | Canvas Phaser 3 phủ `fixed inset-0 z-0`; các thanh HUD và Virtual Joystick dùng `env(safe-area-inset-*)` tránh tai thỏ/Dynamic Island, vùng chạm nút `>= 38–44px`. |
| **RULE C8** | **Kết Nối Kép (Cloud + Local Bot Fallback)** | Tại Sảnh Chung và Võ Đài PK, nếu người chơi đang Offline hoặc chưa ghép đủ người thật trong `5 giây`, hệ thống tự động sinh **NPC / Bot Hàng Xóm Thông Minh** (*A Páo, Út Nhỏ, Minh Râu, Chú Tư*) vào đấu cùng để thời gian chờ ghép trận luôn `< 3 giây`! |
| **RULE C9** | **Cửa Sổ Trộm 2 Phút & Lazy-Tick** | Nhân công chờ 5 phút sau khi cây chín mới thu gom; khi mở lại game phải tính sản lượng Offline qua `simulateOfflineWorkerProgress`. |
| **RULE C10** | **Không Dùng `window.alert/confirm`** | Toàn bộ thông báo trong game phải hiển thị qua hệ thống **Toast Banner Gỗ/Tre** (`setToast`) hoặc Modal UI. |
| **RULE C11** | **Zero External Audio Blocking** | Âm thanh và nhạc nền Ngũ Cung tổng hợp trực tiếp qua Web Audio API (`soundEffects.ts`), tự động `resume()` khi người chơi chạm màn hình. |
| **RULE C12** | **Kiểm Thử Tự Động Snapshot An Toàn** | Bộ `runFullQCTestSuite()` (**37 Test Cases**) phải chụp `structuredClone` trước khi chạy và khôi phục 100% trạng thái sau khi kết thúc. |
| **RULE C13** | **Bảo Toàn Cơ Sở Dữ Liệu (`Additive-Only DB Schema` - `RULE D1`)** | Mọi bản cập nhật SQL (`supabase/migrations/*.sql`) và `localStorage` chỉ được phép **mở rộng không phá hủy** (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS ... DEFAULT ...`). Tuyệt đối **cấm `DROP TABLE`, `DROP COLUMN`, hoặc thay đổi `ID` của 155 thực thể gốc** làm mất tài sản hay gãy dữ liệu người chơi cũ. |
| **RULE C14** | **Cô Lập Module & Cảnh Báo Tác Động Chéo Sớm (`RULE D1`)** | Triển khai tính năng mới không được làm ảnh hưởng tới Core Gameplay VAC hoặc tính năng cũ. Nếu phát hiện có tác động chéo tới tính năng khác hoặc Database, **bắt buộc phải thông báo ngay từ Bước 1 (Lên Thiết Kế / Kế Hoạch) và chờ PO phê duyệt** trước khi viết code. |
