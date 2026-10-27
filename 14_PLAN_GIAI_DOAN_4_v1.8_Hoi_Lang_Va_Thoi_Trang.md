# 🏮 PLAN TRIỂN KHAI CHI TIẾT GIAI ĐOẠN 4: HỘI LÀNG ĐÌNH CHUNG, CÂY ĐỘT BIẾN, KỶ VẬT & THỜI TRANG (`v1.8`)
**Phiên bản:** `1.1 (Stage 4 Execution Plan & AI Delegation Playbook — Bổ sung Kế Hoạch Sản Xuất Chi Tiết Asset, Animation 8–12f, Paper-Doll & VFX)`  
**Mốc phát hành:** Tháng 4 (Tuần 7–8 — Bản cập nhật Cộng đồng Đình Làng, Sưu tầm chuyên sâu & Cá nhân hóa Thời trang)  
**Tài liệu tham chiếu gốc:** `00_MASTER_BIBLE` ➔ `01_MASTER_GDD` ➔ `02_MASTER_ECONOMY` ➔ `03_MASTER_TECH` ➔ `04_MASTER_NARRATIVE` ➔ `05_MASTER_ART` ➔ `06_MASTER_UI_UX`  
**Quy tắc bắt buộc:** Thực thi nghiêm ngặt **`RULE D0`** (Đối chiếu khử trùng lặp) & **`RULE D1`** (Bảo toàn Core Gameplay, Nhất quán Art `#3D2314`/Code/DB Additive-Only & Cảnh báo tác động chéo ngay tại Bước 1).

---

## 1. MỤC TIÊU CỐT LÕI & CÂU CHUYỆN GIAI ĐOẠN 4 (CHAPTER 4: TRỐNG HỘI ĐÌNH LÀNG & MÙA HOA ĐỘT BIẾN)
- **Bối cảnh cốt truyện (`04_MASTER_NARRATIVE` Mục 1.7):** Tiếng trống cái từ **Đình Làng Tam Miền** vang vọng khắp xóm! Cả làng cùng góp gạch ngói, gỗ lim và nông sản để trùng tu ngôi Đình cổ 3 cấp. Nhờ mạch nước ngầm cổ dưới chân Đình khơi thông và lớp bùn phù sa đặc biệt của *Chú Tám Mộc*, những giống cây trồng quý hiếm bắt đầu kết trái **Đột Biến Ngũ Sắc** rực rỡ. Mỗi tối cuối tuần, sân Đình lại rộn ràng **3 trò chơi dân gian Hội Làng**, và bà con diện những bộ **Áo Dài, Áo Tứ Thân, Áo Bà Ba** đẹp nhất đi trẩy hội!
- **Mục tiêu sản phẩm & KPI:**
  - Mở khóa **Đình Làng Cộng Đồng (Co-op Guild 20–30 thành viên)**, **3 Minigame Lễ Hội Dân Gian**, **Hệ thống Lai Tạo Cây Đột Biến Ngũ Sắc**, **Bảo Tàng Kỷ Vật Tuổi Thơ 8x–9x (12 món)**, và **Tủ Đồ Thời Trang 12 Lớp Paper-Doll**.
  - Nâng tổng hệ sinh thái sinh vật từ **63 loài lên 76 loài (+13 loài quý hiếm Bậc 4–5)**.
  - Tăng chỉ số **D30 Retention > 18%** và kích hoạt **Sink Vàng/Nông sản lớn nhất Mid-game** (Quyên góp Đình Làng + Ghép Kỷ Vật + Mở Tủ Đồ).

---

## 2. DANH MỤC TÍNH NĂNG, HỆ SINH THÁI & PHẠM VI TRIỂN KHAI GIAI ĐOẠN 4 (`WHAT TO BUILD`)

### 2.1. Hệ Sinh Thái Nông – Thủy – Hải Sản Đợt 4 (+13 Loài Quý Hiếm = Lũy Kế 76 Loài)
1. **6 Cây trồng Đợt 4 (Đại Đặc Sản Bậc 5 & 3 Giống Đột Biến Ngũ Sắc):**
   - **3 Đại Đặc Sản 3 Miền:** *Bưởi Diễn Hoàng Gia (`CROP_10` - Bắc), Cà Phê Buôn Ma Thuột (`CROP_18` - Trung), Sầu Riêng Ri6 (`CROP_26` - Nam)*.
   - **3 Cây Đột Biến Ngũ Sắc (Mutant Crops — Xác suất lai tạo 3%–8% khi trồng 2 cây Sao Vàng ⭐ cạnh nhau + bón Bùn Ao Phù Sa):** *Lúa Ngọc Trai Tím (`CROP_27`), Sen Bách Diệp Ánh Kim (`CROP_28`), Hoa Hồng Nhung Ngũ Sắc (`CROP_29`)*.
2. **3 Vật nuôi Quý & Linh thú Đợt 4:**
   - *Lợn Bản Đen (`ANIM_09` - Bắc), Hươu Sao Lấy Nhung (`ANIM_10` - Trung), Nhà Yến Đảo Khơi (`ANIM_11` - Nam/Trung)*, cùng mở khóa *Chim Sáo Sậu (`ANIM_07` - học nói & báo tin khách quý)*.
3. **4 Thủy sản Đặc sản Đợt 4:**
   - *Ba Ba Ao Quê (`AQUA_04` - Bắc), Cá Anh Vũ Tiến Vua (`AQUA_09` - Bắc), Ghẹ Đầm Ô Loan (`AQUA_11` - Trung), Cá Tai Tượng Chiên Xù (`AQUA_12` - Nam)*.

### 2.2. Dây Chuyền Chế Biến Đợt 4 (+2 Món Thượng Hạng = Lũy Kế 21/22 Công Thức)
- Mở khóa **Xưởng Tinh Chế Đặc Sản (`MACH_07`)**:
  - *Cà Phê Phin Sữa Đá (`PROD_13` - Tăng +15% tốc độ di chuyển nhân vật & gia nhân trong 30 phút)* và *Bánh Pía Sầu Riêng Trứng Muối (`PROD_20` - Món quà tặng NPC tăng +40 điểm Hảo cảm)*.
- Mở khóa **Gia Nhân Thứ 5:** **Chú Tám Mộc (`WORK_05`)** — Tự động nạo vét bùn ao, ủ phân hữu cơ và bón *Bùn Ao Phù Sa* kích thích tỷ lệ ra Cây Đột Biến (+3% xác suất).

### 2.3. Đình Làng Cộng Đồng, 3 Minigame Hội Làng, Bảo Tàng Kỷ Vật & Thời Trang
- **Đình Làng Cộng Đồng (`VillageGuildModal.tsx`):**
  - Bang hội 20–30 nông dân cùng quyên góp Vàng + Nông sản theo tiến độ 3 Cấp Đình Làng (*Cấp 1: Mái Ngói Rêu Phong ➔ Cấp 2: Cột Lim Chạm Rồng ➔ Cấp 3: Đại Đình Tam Miền*).
  - Mở khóa **Cây Đa Thần Nông** ban phúc lợi toàn bang (+5% Vàng đơn hàng, giảm 5% thời gian chín cây trồng).
- **3 Minigame Lễ Hội Dân Gian (`FestivalMinigamesModal.tsx`):**
  - **Đua Thuyền Rồng Trên Sông** (Bấm nhịp Trống Đình Làng cùng đồng đội).
  - **Đua Trâu Cày Ruộng Lầy** (Điều hướng Trâu tránh vũng bùn sâu & gom bó mạ vàng).
  - **Bịt Mắt Đập Niêu Đất** (Canh góc & lực đập niêu đất treo trên dây nhận mảnh Kỷ Vật).
- **Bảo Tàng Kỷ Vật Tuổi Thơ 8x–9x (`ChildhoodMuseumModal.tsx` — 12 Kỷ vật `RELIC_01..12`):**
  - Sưu tầm mảnh kỷ vật khi cuốc đất, câu cá, đóng tàu hỏa hoặc đập niêu (*Máy Điện Tử Xếp Hình Brick Game, Băng Nhạc Cassette, Đèn Trung Thu Ông Sao, Súng Phóc Ống Tre, Truyện Tranh Đôrêmon Cũ, Hộp Bút Sắt 2 Tầng...*). Đủ bộ kích hoạt **Buff Nội Tại Vĩnh Viễn** cho nông trại.
- **Tủ Đồ Thời Trang 12 Lớp Paper-Doll (`FashionWardrobeModal.tsx` — `FASH_01..12`):**
  - Phối đồ nhân vật với *Áo Tứ Thân Nón Quai Thao, Áo Dài Ngũ Thân Huế, Áo Bà Ba Khăn Rằn, Áo Tơi Lá Cọ* và các lớp **Hào Quang Đom Đóm / Hoa Sen**. Toàn bộ là trang sức thẩm mỹ và cộng điểm Duyên Dáng giao lưu, **không bán chỉ số Pay-to-Win (`RULE D1`)**.

---

## 2.5. KẾ HOẠCH SẢN XUẤT CHI TIẾT ASSET, ANIMATION (`8–12 FRAMES`), PAPER-DOLL & VFX GIAI ĐOẠN 4 (`05_MASTER_ART`)

### A. Bảng Định Mức Sản Xuất Asset & Animation Giai Đoạn 4
| Nhóm Asset | Danh mục chi tiết & Mã ID (`05_MASTER_ART`) | Kích thước chuẩn | Số Frames / Biến thể | Kỹ năng AI phụ trách |
| :--- | :--- | :--- | :--- | :--- |
| **1. Cây trồng Đợt 4 (3 Đại Đặc Sản + 3 Cây Đột Biến Ngũ Sắc)** | `CROP_10` (*Bưởi Diễn*), `CROP_18` (*Cà Phê BMT*), `CROP_26` (*Sầu Riêng Ri6*), `CROP_27..29` (*Lúa Ngọc Trai Tím, Sen Ánh Kim, Hồng Ngũ Sắc* — `crop_mutant_purple`) | `48x64 px` (Cây cổ thụ) & `32x48 px` (Cây đột biến phát sáng) | **24 sprites** (`6 loài x 4 giai đoạn`) + hiệu ứng cánh hoa ngũ sắc lấp lánh | `@generate2dsprite` ➔ `@technical-artist` |
| **2. Vật nuôi Quý & Thủy sản Đợt 4 (7 loài)** | `ANIM_07, 09..11` (*Chim Sáo, Lợn Bản, Hươu Sao, Nhà Yến*), `AQUA_04, 09, 11, 12` (*Ba Ba, Cá Anh Vũ, Ghẹ Ô Loan, Cá Tai Tượng*) | `32x32 px` ➔ `64x64 px` (Nhà Yến Đảo Khơi) | `Idle` (**8 frames**), `Swallow_Fly_InOut` (**10 frames** — chim yến bay lượn quanh tháp đá), `Velvet_Glow` (**8 frames** — Hươu sao) | `@generate2dsprite` ➔ `@video2dsprite` |
| **3. Công trình Đình Làng 3 Cấp & Đạo cụ Lễ Hội** | Đình Làng 3 Cấp (`bldg_dinh` `210x74 px`), Xưởng Tinh Chế (`MACH_07` `64x64 px`), Thuyền Rồng Đua Hội (`128x48 px`), Dây Treo Niêu Đất (`96x64 px`) | `64x64 px` ➔ `210x74 px` | 3 Biến thể kiến trúc Đình Làng + Animation `Row_DragonBoat` (**8 frames**), `Buffalo_Plow_Race` (**8 frames**) | `@generate2dmap` + `@generate2dsprite` |
| **4. Hệ thống Paper-Doll Thời Trang 12 Bộ (`FASH_01..12`)** | Lớp Áo/Nón/Phụ kiện tách rời khớp chuẩn khung xương nhân vật `32x48 px` (*Áo Tứ Thân, Áo Dài Huế, Áo Bà Ba, Nón Quai Thao, Khăn Rằn...*) | `32x48 px` / layer | Đồng bộ 100% tọa độ pivot với **8–12 frames** `Idle`, `Walk_4Dir`, `Work`, `Emote_Dance` | `@generate2dsprite` ➔ `@video2dsprite` ➔ `@technical-artist` |
| **5. Bộ 12 Icon Kỷ Vật Tuổi Thơ 8x–9x & Món Đợt 4** | `RELIC_01..12` (*Brick Game, Cassette, Đèn Ông Sao, Súng Phóc Tre...*), `PROD_13` (*Cà Phê Phin*), `PROD_20` (*Bánh Pía*), Gia nhân *Chú Tám Mộc (`WORK_05`)* | `32x32 px` (Icon) & `32x48 px` (Gia nhân) | 14 Icons hoài niệm + Animation *Chú Tám* xúc bùn ao (**8 frames**) | `@generate2dsprite` / `@codeart2d` |
| **6. Hệ thống Particle VFX Giai Đoạn 4** | `fx_mutant_aura` (Hào quang ngũ sắc tím-vàng xoay quanh cây đột biến), `fx_claypot_shatter` (Mảnh niêu đất vỡ + pháo giấy khi đập trúng), `fx_firefly_halo` (Đom đóm bay quanh tà áo dài) | `16x16 px` ➔ `32x32 px` | Particle JSON + Sprite strip **8 frames** | `@codeart2d` + `@technical-artist` |

### B. Quy Trình Kỹ Thuật & Kiểm Định Paper-Doll Giai Đoạn 4 (`RULE D1`)
1. **Chuẩn Hóa Z-Index Paper-Doll 4 Lớp:** `Layer 0: Back Hair/Cloak` ➔ `Layer 1: Base Body (32x48)` ➔ `Layer 2: Outfit (Áo Dài/Tứ Thân/Bà Ba)` ➔ `Layer 3: Hat (Nón Lá/Nón Quai Thao/Khăn Đóng)` ➔ `Layer 4: Aura VFX (fx_firefly_halo)`. Tất cả 4 lớp dùng chung bảng frame offset `(dx, dy)` để không bao giờ bị lệch pixel khi nhân vật cúi cuốc đất hay múa hội.
2. **Đóng gói Atlas Giai Đoạn 4:** Xuất vào `assets/atlases/farm_stage4_guild_fashion.json` + `.png` (`<= 2048x2048 px`).

---

## 3. PHÂN CÔNG NHIỆM VỤ THEO BỘ PHẬN & KỸ NĂNG AI (`WHO DOES WHAT & HOW`)

| Bộ phận | Kỹ năng AI sử dụng | Nhiệm vụ cụ thể trong Giai đoạn 4 | Đầu ra nghiệm thu (`Deliverables`) |
| :--- | :--- | :--- | :--- |
| **1. Game Design & Economy** | `@game-designer` + `@economy-designer` | - Thiết kế ma trận lai tạo Cây Đột Biến (kết hợp 2 cây Sao Vàng ⭐ liền kề + Bùn Ao Phù Sa).<br>- Cân bằng bảng Quyên góp Đình Làng 3 cấp (Vàng + Nông sản theo tuần) để hút lượng Vàng dư thừa từ Giai đoạn 3.<br>- Thiết kế chỉ số Buff sưu tầm 12 Kỷ vật tuổi thơ. | `STAGE4_MUTATION_TABLE`, `GUILD_UPGRADE_COSTS` & `RELIC_BUFF_CONFIG`. |
| **2. Backend & Guild System** | `@backend-architect` | - Viết **Migration Additive-Only** cho bảng `guilds`, `guild_members`, `guild_donations`, `player_relics`, `player_wardrobe`.<br>- Viết **Supabase RPC** `donate_to_guild` (atomic cộng điểm cống hiến & tự động nâng cấp Đình Làng khi đủ mốc). | File SQL Migration Giai đoạn 4 + RPC `donate_to_guild`. |
| **3. Art, Paper-Doll & VFX** | `@generate2dsprite` + `@video2dsprite` + `@generate2dmap` + `@codeart2d` + `@technical-artist` | - Sản xuất 24 frames cây Đợt 4 (gồm 3 cây đột biến ngũ sắc), 7 loài vật nuôi/thủy sản quý, Đình Làng 3 cấp.<br>- Cắt và căn chỉnh tọa độ **12 bộ trang phục Paper-Doll** khớp chuẩn 8–12 frames nhân vật.<br>- Tạo VFX `fx_mutant_aura`, `fx_claypot_shatter`, `fx_firefly_halo`. | Atlas `farm_stage4_guild_fashion.json/.png` + Paper-Doll Anchor Map. |
| **4. Frontend & Minigames** | `@frontend-developer` + `@ui-designer` | - Xây dựng `VillageGuildModal.tsx`, `FestivalMinigamesModal.tsx` (3 minigame mượt 60fps), `ChildhoodMuseumModal.tsx` và `FashionWardrobeModal.tsx`.<br>- Nâng cấp renderer nhân vật trong `FarmScene.ts` hỗ trợ ghép 4 lớp Paper-Doll. | 4 UI Modals + Multi-layer Character Sprite Renderer. |
| **5. Audio & QA** | `@game-audio-engineer` + `@code-reviewer` | - Gắn nhạc nền lễ hội rộn ràng & tiếng trống Đình Làng, tiếng mảnh niêu đất vỡ giòn tan.<br>- Kiểm tra hiệu năng render khi 10+ nhân vật mặc đồ Paper-Doll + Aura xuất hiện trên màn hình. | Báo cáo Audit `RULE D0 & D1` Giai đoạn 4. |

---

## 4. QUY TRÌNH GIAO VIỆC CHO AI (`AI DELEGATION WORKFLOW & READY-TO-USE PROMPTS`)

### Cách 1: Prompt Giao AI Triển Khai Toàn Bộ Giai Đoạn 4 (Full-Stack Execution)
```markdown
Hãy đóng vai đội ngũ phát triển dự án "Nông Trại Tình Yêu & Gia Đình 3 Miền" và triển khai GIAI ĐOẠN 4 (v1.8 - Hội Làng Đình Chung, Cây Đột Biến, Kỷ Vật & Thời Trang) theo đúng file `14_PLAN_GIAI_DOAN_4_v1.8_Hoi_Lang_Va_Thoi_Trang.md`:
1. BƯỚC 1 (Khai báo Tác động chéo theo RULE D0 & D1): Kiểm tra tác động lên `FarmScene.ts` (logic mọc cây đột biến & Paper-Doll renderer) và xác nhận Database Additive-Only trước khi code.
2. BƯỚC 2 (Database & Economy - @economy-designer + @backend-architect): Tạo migration SQL cho `guilds`, `guild_members`, `guild_donations`, `player_relics`, `player_wardrobe` và RPC `donate_to_guild`. Mở khóa 13 loài Đợt 4 (lũy kế 76 loài), 12 Kỷ vật (`RELIC_01..12`) và 12 Thời trang (`FASH_01..12`).
3. BƯỚC 3 (Gameplay & UI - @frontend-developer + @ui-designer): Xây dựng `VillageGuildModal.tsx`, `FestivalMinigamesModal.tsx` (Đua thuyền, Đua trâu, Đập niêu), `ChildhoodMuseumModal.tsx` và `FashionWardrobeModal.tsx` (khung gỗ #3D2314, giấy #FFFDF5).
4. BƯỚC 4 (QA & Nghiệm thu - @code-reviewer): Kiểm tra tỷ lệ lai tạo cây đột biến, Paper-Doll Z-index và đánh dấu hoàn thành Checklist Mục 5.
```

### Cách 2: Prompt Giao AI Sản Xuất Riêng Gói Asset, Animation (`8–12f`), Paper-Doll & VFX Giai Đoạn 4
```markdown
Hãy kích hoạt chuỗi kỹ năng `@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d` và `@technical-artist` để sản xuất trọn bộ Asset, Animation, Paper-Doll & VFX cho GIAI ĐOẠN 4 theo đúng Mục 2.5 của `14_PLAN_GIAI_DOAN_4_v1.8_Hoi_Lang_Va_Thoi_Trang.md` và `05_MASTER_ART`:
1. Tuân thủ tuyệt đối RULE D1 Art Lock: Góc nhìn 3/4 Top-Down Oblique, viền ấm `#3D2314` (cấm `#000000`), nền `#FF00FF`, Anchor `(0.5, 0.9)`.
2. Tạo 6 dải Sprite Cây trồng Đợt 4 (`CROP_10, 18, 26` và 3 Cây Đột Biến Ngũ Sắc `CROP_27..29` = 24 frames), cùng 7 loài vật nuôi/thủy sản quý (`ANIM_07, 09..11`, `AQUA_04, 09, 11, 12`) và Gia nhân *Chú Tám Mộc (`WORK_05`)*.
3. Tạo kiến trúc Đình Làng 3 Cấp (`bldg_dinh` `210x74 px`), Đạo cụ 3 Minigame (`Row_DragonBoat` 8f, `Buffalo_Plow_Race` 8f, Dây Niêu Đất) và 12 Icon Kỷ Vật 8x–9x (`RELIC_01..12` `32x32 px`).
4. Thiết kế 12 Bộ Trang Phục Paper-Doll (`FASH_01..12` `32x48 px`) tách lớp Áo/Nón/Hào quang khớp tuyệt đối từng frame với nhân vật gốc, kèm 3 Particle VFX (`fx_mutant_aura`, `fx_claypot_shatter`, `fx_firefly_halo`), đóng gói vào Atlas `farm_stage4_guild_fashion.json/.png`.
```

---

## 5. CHECKLIST NGHIỆM THU GIAI ĐOẠN 4 (`DEFINITION OF DONE`)
- [ ] **Nghiệm thu RULE D0 & D1:** Không phá vỡ save-game Giai đoạn 1–3; Thời trang hoàn toàn không cộng chỉ số Pay-to-Win; bảng SQL mới Additive-Only.
- [ ] **Nghiệm thu Asset, Paper-Doll & VFX Đợt 4:** 12 bộ trang phục Paper-Doll không bị lệch pixel ở bất kỳ frame nào; Cây Đột Biến hiển thị hào quang `fx_mutant_aura` mượt mà.
- [ ] **Nghiệm thu Đình Làng & Minigame:** Quyên góp Đình Làng cộng điểm realtime; 3 Minigame Hội Làng chơi mượt 60fps trên cả Desktop & Mobile.
