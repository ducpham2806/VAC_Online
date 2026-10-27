# 🎪 PLAN TRIỂN KHAI CHI TIẾT GIAI ĐOẠN 6: SẢNH CHUNG CHỢ ĐÌNH, PK DÂN GIAN (1V1 & LOẠN CHIẾN) & KHU TRÒ CHƠI HYPER-CASUAL (`v3.0`)
**Phiên bản:** `1.1 (Stage 6 Execution Plan & AI Delegation Playbook — Bổ sung Kế Hoạch Sản Xuất Chi Tiết Asset, Animation 8–12f, Tilemap Sảnh Chung & VFX)`  
**Mốc phát hành:** Tháng 7+ (Tuần 13–16 — Bản Đại Mở Rộng Multiplayer Social Plaza, Đấu Trường Dân Gian Vui Nhộn & Cổng Arcade Siêu Tốc)  
**Tài liệu tham chiếu gốc:** `00_MASTER_BIBLE` ➔ `01_MASTER_GDD` (Mục 9) ➔ `02_MASTER_ECONOMY` (Mục 8) ➔ `03_MASTER_TECH` (Mục 7) ➔ `04_MASTER_NARRATIVE` ➔ `05_MASTER_ART` ➔ `06_MASTER_UI_UX` (Mục 4.10)  
**Quy tắc bắt buộc:** Thực thi nghiêm ngặt **`RULE D0`** (Đối chiếu khử trùng lặp) & **`RULE D1`** (Bảo toàn Core Gameplay Nông trại làm gốc, Nhất quán Art `#3D2314`/Code/DB Additive-Only & Cảnh báo tác động chéo ngay tại Bước 1).

---

## 1. MỤC TIÊU CỐT LÕI & CÂU CHUYỆN GIAI ĐOẠN 6 (CHAPTER 6: BẾN ĐÌNH HỘI TỤ & SỚI VẬT TRẩy HỘI BỐN PHƯƠNG)
- **Bối cảnh cốt truyện (`04_MASTER_NARRATIVE` Mục 1.7):** Khi nông trại quê nhà đã trù phú và gia đình êm ấm, **Bến Đình Sông Quê** chính thức mở tuyến đò ngang đưa bà con nông dân từ khắp mọi miền đổ về **Sảnh Chung Chợ Đình (Social Plaza `48x32 Tiles`)**! Tại đây, 20–30 người chơi có thể trực tiếp điều khiển nhân vật đi dạo dưới gốc đa cổ thụ, ngồi quán nước chè xanh chém gió, cùng nhau **Múa Sạp, Múa Lân**, bước lên **Cầu Tre Đấu Gậy 1v1**, tham gia **Loạn Chiến Bắt Vịt Hoàng Kim** dưới ao bùn hay ghé **Lều Máy Thùng Tuổi Thơ** giải trí siêu tốc 30–45 giây trong lúc chờ lúa chín!
- **Mục tiêu sản phẩm & Ràng buộc Thiết kế (`RULE D1` Core Guardrail):**
  - Mở khóa không gian **Real-time Multiplayer Social Plaza** (`SocialPlazaScene.ts`) tách biệt hoàn toàn với `FarmScene.ts` (chuyển cảnh qua cổng Đình Làng hoặc nút HUD `🎪 Sảnh Đình`, đảm bảo nông trại chính luôn nhẹ và mượt).
  - **Cơ chế PK Dân Gian Không Máu Me (Slapstick Folk Arena):** Tuyệt đối không chém giết bạo lực; mọi đòn đánh là **Đấu Gậy Bông Đẩy Cầu Tre, Đấu Vật Đẩy Khỏi Vòng Vôi, Ném Bóng Nước/Cà Chua Chín & Tranh Cờ/Bắt Vịt**.
  - **Kinh tế Khép Kín Chống Cày Tiền (Anti-Bot Farming):** PK & Hyper-Casual tiêu thụ **Bánh Chưng / Cơm Nắm (Stamina Nông Trại)** và trả thưởng bằng **Xu Hội Làng (`🪙 Xu Hội`)** có trần **1.500 Xu/ngày** — giữ cho Nông Trại luôn là trái tim kinh tế duy nhất của game (`RULE D1`).

---

## 2. DANH MỤC TÍNH NĂNG & PHẠM VI TRIỂN KHAI GIAI ĐOẠN 6 (`WHAT TO BUILD`)

### 2.1. Sảnh Chung Chợ Đình (`SocialPlazaScene.ts` — Bản Đồ `48x32 Tiles`, 20–30 Players/Room)
- **5 Phân khu Tương tác Trực tiếp:**
  1. **Quảng Trường Cây Đa & Quán Nước Chè Đầu Cổng:** Nơi người chơi xuất hiện, ngồi ghế đẩu uống trà xanh (hồi nhẹ Stamina), bật bong bóng chat trên đầu và gõ lệnh nối vần **Ca Dao – Tục Ngữ**.
  2. **Sân Khấu Múa Sạp & Múa Lân Đồng Đội:** Nhảy vào vòng sạp tre hoặc lập đội 2 người (1 người múa Đầu Lân + 1 người đánh Trống/Ông Địa) để biểu diễn nhận mưa tim từ khán giả.
  3. **Khu Đấu Trường Dân Gian 1v1 (Cầu Tre & Sới Vật Vòng Vôi):** Đấu đài trực tiếp có khán đài cho người chơi khác đứng cổ vũ và tung hoa giấy.
  4. **Đầm Lầy Loạn Chiến & Bãi Cướp Cờ (Tổ Đội 3v3 & 8-Player Brawl):** Khu vực sình lầy phía Đông Sảnh Đình dành cho các trận đấu nhóm 90–120 giây.
  5. **Lều Máy Thùng & Góc Trò Chơi Tuổi Thơ (`Arcade Tent`):** Cổng vào 4 trò chơi Hyper-Casual siêu tốc 30–45 giây.
- **Điều khiển Nhân vật Real-time:** Hỗ trợ **Virtual Joystick** (trên Mobile) + **WASD / Arrow Keys / Click-to-Move** (trên Desktop), đồng bộ vị trí qua **Supabase Realtime Broadcast (`10Hz` + Linear Interpolation `lerp`)** siêu mượt mà không tốn tài nguyên ghi Database.

### 2.2. Đấu Trường Dân Gian PK 1v1 & Loạn Chiến Nhóm (`FolkArenaMatchmaker`)
- **2 Chế độ PK Đơn 1v1 (60 giây/hiệp — Rock-Paper-Scissors Stance + Timing Bar):**
  - **Đẩy Gậy Trên Cầu Tre Lắc Lư (`Bamboo Bridge Joust`):** Chọn 3 thế *Đẩy Cao (High Strike) ➔ Quét Thấp (Low Sweep) ➔ Nhảy Né/Đỡ (Jump/Parry)* kết hợp bấm dừng thanh lực ở Vùng Vàng để hất đối thủ rơi tõm xuống suối (có hiệu ứng bắn nước vui nhộn).
  - **Đấu Vật Đẩy Vòng Vôi (`Folk Sumo Ring`):** Điều khiển hướng di chuyển + canh nhịp *Húc Vai (Dash Charge)* và *Lách Người (Sidestep)* để đẩy đối phương ra khỏi vòng vôi trắng.
- **2 Chế độ PK Nhóm & Loạn Chiến (90–120 giây/trận):**
  - **Cướp Cờ Làng 3v3 (`3v3 Capture the Flag`):** 2 đội Xanh – Đỏ phối hợp vượt chướng ngại vật rơm rạ, dùng *Bóng Nước / Bẫy Vỏ Chuối* làm chậm đối phương để cướp Cờ Lúa Vàng đem về căn cứ.
  - **Loạn Chiến Bắt Vịt Hoàng Kim 8 Người (`8-Player Golden Duck Brawl`):** 8 nông dân lội ao bùn tranh nhau ôm **Chú Vịt Hoàng Kim**. Người đang ôm vịt bị giảm 20% tốc độ chạy; ai giữ được Vịt Hoàng Kim lâu nhất khi hết 90 giây sẽ chiến thắng!

### 2.3. Khu Trò Chơi Hyper-Casual Siêu Tốc 30–45 Giây (`HyperCasualArcadeModal.tsx`)
- Kiến trúc **Plug-and-Play Modular Mini-games** (mỗi game chỉ 1 nút bấm / 1 thao tác vuốt, kết thúc trong 30–45 giây):
  1. **Chẻ Tre Đan Sọt (`Bamboo Slash`):** Vuốt/Click chẻ chuẩn các đốt tre xanh bay lên theo nhịp, né những trái pháo đất.
  2. **Nhảy Bao Bố Vượt Chướng Ngại Vật (`Sack Race Dash`):** Canh lực bấm giữ – nhả để nhảy qua mô đất, rơm cuộn và vũng bùn.
  3. **Bắn Bi Ve / Đập Pháo Đất (`Marble Flick & Clay Cracker`):** Kéo thả căn góc bắn viên bi chủ trúng bi mục tiêu trong vòng tròn đất.
  4. **Hứng Dừa Bến Tre (`Coconut Catcher`):** Di chuyển thúng tre hứng dừa rơi từ ngọn cây, né vỏ sầu riêng gai.

---

## 2.5. KẾ HOẠCH SẢN XUẤT CHI TIẾT ASSET, ANIMATION (`8–12 FRAMES`), TILEMAP SẢNH CHUNG & VFX GIAI ĐOẠN 6 (`05_MASTER_ART`)

### A. Bảng Định Mức Sản Xuất Asset & Animation Giai Đoạn 6
| Nhóm Asset | Danh mục chi tiết & Mã ID (`05_MASTER_ART`) | Kích thước chuẩn | Số Frames / Biến thể | Kỹ năng AI phụ trách |
| :--- | :--- | :--- | :--- | :--- |
| **1. Tilemap Sảnh Chung Chợ Đình (`48x32 Tiles`)** | Sân gạch bát tràng cổ, Bến đò ngang, Gốc đa cổ thụ (`160x140 px`), Quán nước chè xanh (`96x64 px`), Cầu tre bắc qua suối (`128x48 px`), Sới vật vòng vôi (`128x128 px`), Ao bùn bắt vịt (`160x128 px`) | Base grid `32x32 px` + Props lớn | **24 Autotiles** nền sân đình/suối/ao bùn + **12 Landmark Props** | `@generate2dmap` + `@codeart2d` |
| **2. Công trình Lều Máy Thùng & Đạo Cụ PK Dân Gian** | Lều Máy Thùng Tuổi Thơ (`bldg_arcade_tent` `180x80 px`), Bộ đạo cụ `PROP_ARENA` (*Gậy tre bọc bông, Cờ Lúa Vàng, Chú Vịt Hoàng Kim, Bóng nước, Vỏ chuối, Bao bố, Ống tre, Bi ve, Pháo đất*) | `180x80 px` (Lều) & `32x32 px` (Đạo cụ) | `Idle_Tent_Lights` (**6 frames**), `GoldenDuck_Waddle_Panic` (**8 frames** — Vịt vàng chạy vỗ cánh) | `@generate2dmap` + `@generate2dsprite` |
| **3. Bộ Animation Nhân Vật Giao Lưu & PK (`8–12 Frames`)** | Bổ sung vào khung xương nhân vật `32x48 px` (tương thích 100% với Paper-Doll Giai đoạn 4) | `32x48 px` (cùng 1 khung Đầu Lân `48x48 px`) | - `Emote_BambooDance` (**8 frames** — nhảy sạp)<br>- `Emote_LionDance` (**12 frames** — múa đầu lân)<br>- `PK_JoustHigh / Low / Jump` (**8 frames/đòn**)<br>- `PK_SumoCharge` (**8 frames** — húc vai)<br>- `Brawl_HoldGoldenDuck` (**8 frames** — vừa chạy vừa ôm vịt) | `@generate2dsprite` ➔ `@video2dsprite` ➔ `@technical-artist` |
| **4. Bộ Sprite 4 Trò Chơi Hyper-Casual (30–45s)** | Đốt tre xanh tách đôi, Trái dừa rơi, Thúng tre hứng dừa, Viên bi ve ngũ sắc phản quang, Nắm đất sét pháo đất | `24x24 px` ➔ `48x48 px` | **16 sprites** đạo cụ mini-game sắc nét 60fps | `@generate2dsprite` / `@codeart2d` |
| **5. Hệ thống Particle VFX Giai Đoạn 6** | `fx_arena_impact` (Ngôi sao vàng `#FF9F1C` `12x12 px` nảy ra khi va chạm gậy bông/húc vai), `fx_water_splash_plaza` (Nước bắn trắng xóa khi ngã khỏi cầu tre), `fx_blade_trail` (Vệt sáng chẻ tre mượt mà), `fx_mud_splatter` (Bùn văng vui nhộn trong ao bắt vịt) | `12x12 px` ➔ `32x32 px` | Particle JSON + Sprite strip **6–8 frames** | `@codeart2d` + `@technical-artist` |

### B. Quy Trình Kỹ Thuật & Kiểm Định Art Giai Đoạn 6 (`RULE D1`)
1. **Bảo Toàn Tương Thích Ngược Paper-Doll:** Mọi animation mới của Giai đoạn 6 (`Emote_BambooDance`, `PK_Joust`, `PK_SumoCharge`) dùng chung bảng tọa độ Neo Đầu/Thân với Giai đoạn 4 để người chơi mặc *Áo Dài, Áo Bà Ba, Áo Tứ Thân* vào Sảnh Đình thi đấu không bị lệch trang phục.
2. **Đóng gói Atlas Giai Đoạn 6:** Tách riêng thành `assets/atlases/plaza_stage6_arena_arcade.json` + `.png` (`<= 2048x2048 px`) và chỉ **Lazy-load** khi người chơi bấm vào Sảnh Đình (giữ cho thời gian tải `FarmScene.ts` ban đầu dưới 1.5 giây).

---

## 3. PHÂN CÔNG NHIỆM VỤ THEO BỘ PHẬN & KỸ NĂNG AI (`WHO DOES WHAT & HOW`)

| Bộ phận | Kỹ năng AI sử dụng | Nhiệm vụ cụ thể trong Giai đoạn 6 | Đầu ra nghiệm thu (`Deliverables`) |
| :--- | :--- | :--- | :--- |
| **1. Game Design & Economy** | `@game-designer` + `@economy-designer` + `@level-designer` | - Thiết kế layout `48x32 Tiles` cho Sảnh Chung Chợ Đình (luồng di chuyển từ Bến Đò ➔ Cây Đa ➔ Sới Vật ➔ Lều Máy Thùng).<br>- Cân bằng Stamina tiêu thụ (1 Bánh Chưng/lượt PK) và trần **1.500 Xu Hội Làng/ngày** + Shop Đổi Thưởng Hội Làng. | Bản vẽ Layout `48x32` + `STAGE6_ARENA_ECONOMY_CONFIG`. |
| **2. Multiplayer & Backend** | `@backend-architect` + `@godot-multiplayer-engineer` (tư duy netcode) | - Thiết kế kênh **Supabase Realtime Broadcast + Presence** (`plaza_room_1..N`, tối đa 25 CCU/phòng, gói tin vị trí nén `< 120 bytes` ở tần số `10Hz`).<br>- Viết **Migration Additive-Only** cho bảng `arena_elo_ratings`, `plaza_match_history`, `arcade_leaderboards` và RPC `claim_plaza_reward` (kiểm tra trần 1.500 Xu/ngày + chống giả mạo điểm số). | File SQL Migration Giai đoạn 6 + `PlazaRealtimeService.ts` + RPC `claim_plaza_reward`. |
| **3. Art, Tilemap & VFX** | `@generate2dmap` + `@generate2dsprite` + `@video2dsprite` + `@codeart2d` + `@technical-artist` | - Sản xuất Tilemap `48x32` Sảnh Chung, Lều Máy Thùng, Bộ đạo cụ `PROP_ARENA`.<br>- Tạo 7 bộ animation PK & Giao lưu (`8–12 frames`) khớp Paper-Doll + 4 VFX (`fx_arena_impact`, `fx_water_splash_plaza`, `fx_blade_trail`, `fx_mud_splatter`). | Atlas `plaza_stage6_arena_arcade.json/.png` (Lazy-loaded). |
| **4. Frontend, Scene & Arcade** | `@frontend-developer` + `@ui-designer` | - Xây dựng `src/game/scenes/SocialPlazaScene.ts` (di chuyển Joystick/WASD + nội suy vị trí người chơi khác + bong bóng chat/emote).<br>- Xây dựng `SocialPlazaModal.tsx` và `HyperCasualArcadeModal.tsx` (4 mini-game 30–45s). | `SocialPlazaScene.ts` + 2 UI Modals + 4 Hyper-Casual Modules. |
| **5. Audio & QA** | `@game-audio-engineer` + `@code-reviewer` | - Gắn nhạc nền Sảnh Đình & tiếng gậy bông va chạm, tiếng nước bắn, tiếng chẻ tre giòn tan.<br>- Kiểm tra tải mạng khi 25 người chơi di chuyển cùng lúc (đảm bảo FPS >= 60 và không rò rỉ bộ nhớ khi chuyển qua lại giữa `FarmScene` ⇄ `SocialPlazaScene`). | Báo cáo Audit `RULE D0 & D1` Giai đoạn 6. |

---

## 4. QUY TRÌNH GIAO VIỆC CHO AI (`AI DELEGATION WORKFLOW & READY-TO-USE PROMPTS`)

### Cách 1: Prompt Giao AI Triển Khai Toàn Bộ Giai Đoạn 6 (Full-Stack Execution)
```markdown
Hãy đóng vai đội ngũ phát triển dự án "Nông Trại Tình Yêu & Gia Đình 3 Miền" và triển khai GIAI ĐOẠN 6 (v3.0 - Sảnh Chung Chợ Đình, PK Dân Gian & Khu Trò Chơi Hyper-Casual) theo đúng file `16_PLAN_GIAI_DOAN_6_v3.0_Sanh_Chung_PK_Va_Hyper_Casual.md`:
1. BƯỚC 1 (Khai báo Tác động chéo theo RULE D0 & D1): Đảm bảo `SocialPlazaScene.ts` tách biệt hoàn toàn với `FarmScene.ts`, lazy-load tài nguyên và kinh tế PK khóa trần 1.500 Xu Hội Làng/ngày không gây lạm phát Vàng nông trại.
2. BƯỚC 2 (Realtime Netcode & Database - @backend-architect): Tạo migration SQL Additive-Only cho `arena_elo_ratings`, `plaza_match_history`, `arcade_leaderboards`, RPC `claim_plaza_reward` và `PlazaRealtimeService.ts` (Supabase Realtime Broadcast 10Hz + Presence 25 người/phòng + Linear Interpolation).
3. BƯỚC 3 (Scene Sảnh Chung, PK & Hyper-Casual - @frontend-developer + @ui-designer): Xây dựng `SocialPlazaScene.ts` (48x32 tiles, Joystick/WASD, Emote Múa Sạp/Múa Lân, Đấu Gậy Cầu Tre 1v1, Đấu Vật, Cướp Cờ 3v3, Bắt Vịt Hoàng Kim 8 người) và `HyperCasualArcadeModal.tsx` (Chẻ Tre, Nhảy Bao Bố, Bắn Bi Ve, Hứng Dừa).
4. BƯỚC 4 (QA & Nghiệm thu - @code-reviewer): Kiểm tra giải phóng bộ nhớ khi chuyển cảnh `FarmScene ⇄ SocialPlazaScene` và nghiệm thu theo Checklist Mục 5.
```

### Cách 2: Prompt Giao AI Sản Xuất Riêng Gói Asset, Animation (`8–12f`), Tilemap & VFX Giai Đoạn 6
```markdown
Hãy kích hoạt chuỗi kỹ năng `@generate2dmap`, `@generate2dsprite`, `@video2dsprite`, `@codeart2d` và `@technical-artist` để sản xuất trọn bộ Asset, Tilemap, Animation & VFX cho GIAI ĐOẠN 6 theo đúng Mục 2.5 của `16_PLAN_GIAI_DOAN_6_v3.0_Sanh_Chung_PK_Va_Hyper_Casual.md` và `05_MASTER_ART`:
1. Tuân thủ tuyệt đối RULE D1 Art Lock: Góc nhìn 3/4 Top-Down Oblique, viền ấm `#3D2314` (cấm `#000000`), nền `#FF00FF`, Anchor `(0.5, 0.9)`.
2. Thiết kế Tilemap Sảnh Chung Chợ Đình (`48x32 Tiles` — 24 Autotiles + 12 Landmark Props: Cây đa cổ thụ, Quán nước chè, Cầu tre đấu gậy, Sới vật vòng vôi, Ao bùn bắt vịt) và Lều Máy Thùng (`bldg_arcade_tent` `180x80 px`).
3. Tạo Bộ đạo cụ PK & Hyper-Casual (`PROP_ARENA` `32x32 px`: Gậy bông, Cờ lúa vàng, Vịt Hoàng Kim `GoldenDuck_Waddle_Panic` 8f, Đốt tre, Thúng dừa, Bi ve, Pháo đất).
4. Tạo 7 bộ Animation Nhân vật `8–12 frames` khớp 100% với hệ thống Paper-Doll (`Emote_BambooDance`, `Emote_LionDance` 12f, `PK_JoustHigh/Low/Jump`, `PK_SumoCharge`, `Brawl_HoldGoldenDuck`) và 4 Particle VFX (`fx_arena_impact` `#FF9F1C`, `fx_water_splash_plaza`, `fx_blade_trail`, `fx_mud_splatter`), đóng gói vào Atlas `plaza_stage6_arena_arcade.json/.png`.
```

---

## 5. CHECKLIST NGHIỆM THU GIAI ĐOẠN 6 (`DEFINITION OF DONE`)
- [ ] **Nghiệm thu RULE D0 & D1:** `FarmScene.ts` hoàn toàn không bị nặng thêm (Atlas Giai đoạn 6 được lazy-load riêng); PK mang tính dân gian vui nhộn, không máu me; trần 1.500 Xu Hội Làng/ngày hoạt động chuẩn xác.
- [ ] **Nghiệm thu Asset, Tilemap & VFX Đợt 6:** Bản đồ `48x32 Tiles` không có lỗi va chạm (seam/collision); 7 động tác PK & Múa Sạp/Múa Lân khớp hoàn hảo với các bộ trang phục Paper-Doll; VFX `fx_arena_impact` và `fx_blade_trail` mượt 60fps.
- [ ] **Nghiệm thu Multiplayer & 4 Game Hyper-Casual:** Di chuyển 25 người/phòng mượt mà nhờ `lerp` 10Hz; cả 4 trò chơi Hyper-Casual chơi gọn trong 30–45 giây trên cả cảm ứng và chuột/phím.
