# 🚂 PLAN TRIỂN KHAI CHI TIẾT GIAI ĐOẠN 3: CHỢ PHIÊN, CHUYẾN TÀU THỐNG NHẤT & HÀNG XÓM (`v1.5`)
**Phiên bản:** `1.1 (Stage 3 Execution Plan & AI Delegation Playbook — Bổ sung Kế Hoạch Sản Xuất Chi Tiết Asset, Animation 8–12f, Tilemap & VFX)`  
**Mốc phát hành:** Tháng 3 (Tuần 5–6 — Bản mở rộng Giao thương liên vùng & Tương tác Hàng xóm đầu tiên)  
**Tài liệu tham chiếu gốc:** `00_MASTER_BIBLE` ➔ `01_MASTER_GDD` ➔ `02_MASTER_ECONOMY` ➔ `03_MASTER_TECH` ➔ `04_MASTER_NARRATIVE` ➔ `05_MASTER_ART` ➔ `06_MASTER_UI_UX`  
**Quy tắc bắt buộc:** Thực thi nghiêm ngặt **`RULE D0`** (Đối chiếu khử trùng lặp) & **`RULE D1`** (Bảo toàn Core Gameplay, Nhất quán Art `#3D2314`/Code/DB Additive-Only & Cảnh báo tác động chéo ngay tại Bước 1).

---

## 1. MỤC TIÊU CỐT LÕI & CÂU CHUYỆN GIAI ĐOẠN 3 (CHAPTER 3: TIẾNG CÒI TÀU THỐNG NHẤT & NHỊP CHỢ PHIÊN)
- **Bối cảnh cốt truyện (`04_MASTER_NARRATIVE` Mục 1.7):** Chuyến Tàu Thống Nhất Bắc – Nam khôi phục lại ga xép đầu làng! Nông sản của nông trại giờ đây không chỉ bán quanh xóm mà còn đóng toa tàu đi khắp 3 Miền. Hàng xóm láng giềng (*Tí Nị, Út Mót*) bắt đầu ghé sang thăm vườn, tưới nước hộ, bắt sâu giúp... và thỉnh thoảng "sang thăm" lúc nửa đêm để hái trộm 1–2 trái chín đầu cành (hoặc bị Chó Cỏ rượt rớt lại *Dép Tổ Ong* làm kỷ niệm).
- **Mục tiêu sản phẩm & KPI:**
  - Mở khóa hệ thống **Giao thương P2P** (*Sạp Báo Chợ Phiên 8 ô*), **Đơn hàng lớn liên vùng** (*Tàu Hỏa Thống Nhất 3 toa x 3 kiện*) và **Tương tác Hàng xóm** (*Thăm vườn, Giúp đỡ +5 Tim/lượt, Hái trộm vui vẻ tối đa 15% sản lượng/ô & Chó Cỏ canh gác*).
  - Mở rộng hệ sinh thái sinh vật từ **45 loài lên 63 loài (+18 loài mới)** trải dài khắp 3 Miền.
  - Tăng chỉ số **D7 Retention > 28%** và tỷ lệ tương tác xã hội hàng ngày (**Social Daily Active Ratio > 45%**).

---

## 2. DANH MỤC TÍNH NĂNG, HỆ SINH THÁI & PHạm VI TRIỂN KHAI GIAI ĐOẠN 3 (`WHAT TO BUILD`)

### 2.1. Hệ Sinh Thái Nông – Thủy – Hải Sản Đợt 3 (+18 Loài Mở Khóa = Lũy Kế 63 Loài)
1. **12 Cây trồng Đợt 3 (Mở khóa Vườn Cây Ăn Quả Lâu Năm & Đặc sản 3 Miền):**
   - **Miền Bắc (4 loài):** *Nấm Hương Rừng (`CROP_06`), Đậu Tương (`CROP_07`), Vải Thiều Thanh Hà (`CROP_08`), Nhãn Lồng Hưng Yên (`CROP_09`)*.
   - **Miền Trung (4 loài):** *Mía Đường (`CROP_14`), Sen Hồng (`CROP_15`), Nho Ninh Thuận (`CROP_16`), Hồ Tiêu (`CROP_17`)*.
   - **Miền Nam (4 loài):** *Xoài Cát Hòa Lộc (`CROP_22`), Vú Sữa Lò Rèn (`CROP_23`), Măng Cụt Lái Thiêu (`CROP_24`), Mít Tố Nữ (`CROP_25`)*.
   - *Cơ chế mới:* **Cây Ăn Quả Lâu Năm (Perennial Trees)** thu hoạch **3 mùa quả liên tiếp** rồi mới枯 (cần **Cưa Sắt** `TOOL_SAW` để dọn gốc nhận Gỗ).
2. **1 Vật nuôi bảo vệ & thụ phấn Đợt 3:**
   - *Ong Mật Rừng (`ANIM_08` - Đặt cạnh vườn cây ăn quả tăng **+5% xác suất Nông sản Sao Vàng ⭐**)*.
   - Mở khóa đầy đủ *Đàn Ngỗng Trắng (`ANIM_03`)* & *Trâu Đen Cày Ruộng (`ANIM_06`)* cho liên vùng.
3. **5 Thủy sản Đợt 3 (Khép kín chuỗi nuôi trồng mặt nước 3 Miền):**
   - *Cá Trắm Đen (`AQUA_03` - Bắc), Cá Bống Sông Trà (`AQUA_05` - Trung), Bè Nuôi Trai Ngọc (`AQUA_06` - Trung), Cá Linh Mùa Nước Nổi (`AQUA_07` - Nam), Bè Cá Bớp (`AQUA_08` - Nam)*.

### 2.2. Dây Chuyền Chế Biến Đợt 3 (+9 Món = Lũy Kế 19/22 Công Thức)
- Mở thêm **Xưởng Thủ Công Tre Mây (`MACH_05`)** & **Quầy Chè - Giải Khát (`MACH_06`)**:
  - *Mật Ong Rừng Hoa Nhãn (`PROD_05`), Vải Thiều Sấy Khô (`PROD_06`), Đậu Phụ Làng Mơ (`PROD_07`), Đường Phèn Kết Tinh (`PROD_11`), Rượu Vang Nho Phan Rang (`PROD_12`), Kẹo Dừa Bến Tre (`PROD_16`), Sinh Tố Măng Cụt (`PROD_17`), Bánh Tráng Trảng Bàng (`PROD_18`), Mứt Dừa Non (`PROD_19`)*.

### 2.3. Hệ Thống Tàu Hỏa Thống Nhất, Sạp Báo Chợ Phiên & Tương Tác Hàng Xóm
- **Tàu Hỏa Thống Nhất (`TrainOrderModal.tsx` & `TrainService`):**
  - Cập bến 4 chuyến/ngày (mỗi chuyến đỗ 4 giờ, có thể gọi sớm bằng `5 💎`).
  - Gồm **3 Toa hàng x 3 Kiện nông sản/chế biến**; đóng đủ từng toa nhận Vàng + EXP, đóng đủ cả **3/3 Toa** nhận **Rương Công Đức Ga Tàu** (rớt *Dụng cụ mở đất, Xẻng/Cưa/Thuốc Nổ, Xu Đình Làng*).
  - Cho phép **Nhờ Hàng Xóm Đóng Giúp tối đa 1 kiện/chuyến** (người giúp nhận Vàng + **+15 Tim Tình Làng Nghĩa Xóm 💖**).
- **Sạp Báo Chợ Phiên Đầu Làng (`RoadsideShopModal.tsx`):**
  - Mỗi người chơi có **8 ô bày bán** (mở khóa dần theo Level/Vàng).
  - Giá trần – giá sàn tự động giới hạn trong biên độ **`[0.5x – 1.5x BasePrice]`**, thuế sàn **5%** (hoặc 3% khi có Thẻ Tháng) theo đúng `02_MASTER_ECONOMY`.
  - Đăng báo miễn phí lên *Tờ Báo Nông Thôn Hàng Ngày* mỗi 15 phút/lần.
- **Thăm Vườn Hàng Xóm, Hái Trộm Vui Vẻ & Chó Cỏ Canh Gác (`NeighborService`):**
  - Ghé thăm nông trại bạn bè/hàng xóm qua thanh Drawer dưới đáy màn hình.
  - **Giúp đỡ:** Tưới cây/bắt sâu/cho ăn giúp (tối đa **5 lần/nhà/ngày**, nhận **+5 💖 Tim/lần**, tối đa `100 💖/ngày`).
  - **Hái trộm vui vẻ (Social Stealing Guardrail):** Chỉ hái được trên ô cây đã chín rộ có **>= 6 đơn vị**, tối đa **15% sản lượng/ô**, để lại tối thiểu **85% sản lượng gốc** cho chủ nhà (`RULE D1` Anti-Griefing).
  - **Chó Cỏ Canh Vườn (`ANIM_04`):** Có **50% xác suất** phát hiện khách hái trộm, sủa vang thu hồi lại nông sản và làm khách đánh rơi **1 Chiếc Dép Tổ Ong (`ITEM_SLIPPER` - bán được `50 🪙` hoặc đổi quà kỷ niệm)**.
- **Gia Nhân Đợt 3 (+2 Gia Nhân = Lũy Kế 4/6):**
  - Mở khóa **Anh Sáu Chăn Trâu (`WORK_03`)** (tự động thu hoạch & cho ăn toàn bộ Chuồng Trại) và **Dì Bảy Đan Lát (`WORK_04`)** (tự động nạp nguyên liệu vào các máy chế biến).

### 2.4. Hệ Thống Audio & Âm Thanh Giai Đoạn 3 (`soundEffects.ts`)
- Kích hoạt SFX còi tàu hơi nước ấm áp kết hợp tiếng chuông ga xép (`playTrainHorn`), tiếng lục lạc Chó Cỏ sủa vui nhộn khi bắt trộm, và nhạc nền `market` (*Hội Chợ Phiên Rộn Ràng — 108 BPM*) khi mở Sạp Báo Chợ Phiên.

---

## 2.5. KẾ HOẠCH SẢN XUẤT CHI TIẾT ASSET, ANIMATION (`8–12 FRAMES`), TILEMAP & VFX GIAI ĐOẠN 3 (`05_MASTER_ART`)

### A. Bảng Định Mức Sản Xuất Asset & Animation Giai Đoạn 3
| Nhóm Asset | Danh mục chi tiết & Mã ID (`05_MASTER_ART`) | Kích thước chuẩn | Số Frames / Biến thể | Kỹ năng AI phụ trách |
| :--- | :--- | :--- | :--- | :--- |
| **1. Cây trồng Đợt 3 (12 loài — Cây lâu năm 3 miền)** | `CROP_06..09` (*Nấm Hương, Đậu Tương, Vải Thiều, Nhãn Lồng*), `CROP_14..17` (*Mía, Sen Hồng, Nho Ninh Thuận, Hồ Tiêu*), `CROP_22..25` (*Xoài Cát, Vú Sữa, Măng Cụt, Mít Tố Nữ*) | `32x32 px` (Thân leo/lùn) & `48x64 px` (Cây ăn quả lâu năm) | **48 sprites** (`12 loài x 4 giai đoạn`) + trạng thái Gốc cây khô chờ Cưa Sắt | `@generate2dsprite` ➔ `@technical-artist` |
| **2. Vật nuôi Đợt 3 (Ong Mật, Ngỗng & Trâu Đen)** | `ANIM_08` (*Tổ Ong Mật Rừng*), `ANIM_03` (*Đàn Ngỗng Trắng*), `ANIM_06` (*Trâu Đen Cày Ruộng*) | `32x32 px` (Ong) & `48x48 px` (Ngỗng, Trâu) | `Idle` (**8 frames**), `Produce` (**8 frames**), `Happy` (**6 frames**) | `@generate2dsprite` ➔ `@video2dsprite` |
| **3. Thủy sản Đợt 3 (5 loài mặt nước)** | `AQUA_03` (*Cá Trắm Đen*), `AQUA_05..08` (*Cá Bống, Bè Trai Ngọc, Cá Linh, Bè Cá Bớp*) | `32x32 px` (Cá) & `64x48 px` (Bè nuôi trên sông/biển) | `Swim_Ripple` (**8 frames**), `Harvest_Pearl_Glow` (**8 frames** — Trai ngọc phát sáng) | `@generate2dsprite` ➔ `@video2dsprite` |
| **4. Công trình Ga Tàu, Sạp Báo & Xưởng Đợt 3** | Đầu máy Tàu Thống Nhất (`bldg_train` `120x32 px` + 3 Toa hàng), Sạp Báo Chợ Phiên (`bldg_market` `175x74 px`), Xưởng Tre Mây (`MACH_05` `64x64 px`), Quầy Chè (`MACH_06` `64x64 px`) | `64x64 px` ➔ `175x74 px` | `Idle` (**4 frames**), `Train_Arrive_Brake` (**12 frames**), `Working_Loop` (**8 frames**) | `@generate2dmap` + `@generate2dsprite` |
| **5. Nhân vật Gia nhân Đợt 3 & Animation Tương tác Hàng xóm** | Gia nhân *Anh Sáu Chăn Trâu (`WORK_03`)*, *Dì Bảy Đan Lát (`WORK_04`)*; Animation người chơi đi thăm vườn | `32x48 px` | `Steal_Sneak` (**8 frames** — rón rén nhón chân), `Caught_DropSlipper` (**10 frames** — giật mình nhảy dựng rớt Dép Tổ Ong) | `@generate2dsprite` ➔ `@video2dsprite` |
| **6. Bộ Icon Món Chế Biến Đợt 3 & Vật Phẩm Xã Hội** | 9 Icon món (`PROD_05..07`, `PROD_11..12`, `PROD_16..19`), *Cưa Sắt (`TOOL_SAW`)*, *Chiếc Dép Tổ Ong (`ITEM_SLIPPER`)*, *Kiện Hàng Ga Tàu* | `32x32 px` | 15 Icons sắc nét, viền `#3D2314` | `@generate2dsprite` / `@codeart2d` |
| **7. Hệ thống Particle VFX Giai Đoạn 3** | `fx_train_steam` (Khói trắng đầu máy hơi nước), `fx_steal_alert` (Dấu chấm than đỏ `[!]` + tiếng sủa khi Chó Cỏ phát hiện), `fx_bee_pollen` (Đàn ong vàng bay quanh vườn cây ăn quả) | `12x12 px` ➔ `24x24 px` | Particle JSON + Sprite strip **6–8 frames** | `@codeart2d` + `@technical-artist` |

### B. Quy Trình Kỹ Thuật & Kiểm Định Art Giai Đoạn 3 (`RULE D1`)
1. **Quy chuẩn Cây Lâu Năm (`48x64 px`):** Tán cây ăn quả (*Vải, Nhãn, Xoài, Măng Cụt, Mít*) vươn cao nhưng gốc cây vẫn neo đúng tâm ô đất (`Anchor (0.5, 0.9)`), tự động bật hiệu ứng bán trong suốt (`alpha = 0.65`) khi nhân vật đi phía sau tán cây.
2. **Đóng gói Atlas Giai Đoạn 3:** Toàn bộ sprite Đợt 3 xuất vào `assets/atlases/farm_stage3_market_train.json` + `.png` (`<= 2048x2048 px`).

---

## 3. PHÂN CÔNG NHIỆM VỤ THEO BỘ PHẬN & KỸ NĂNG AI (`WHO DOES WHAT & HOW`)

| Bộ phận | Kỹ năng AI sử dụng | Nhiệm vụ cụ thể trong Giai đoạn 3 | Đầu ra nghiệm thu (`Deliverables`) |
| :--- | :--- | :--- | :--- |
| **1. Game Design & Economy** | `@game-designer` + `@economy-designer` | - Cân bằng phần thưởng 3 Toa Tàu Thống Nhất (hệ số 1.35x giá gốc + điểm Công Đức).<br>- Thiết kế công thức chống lạm phát & chống chuyển Vàng lậu qua Sạp Báo Chợ Phiên (khóa biên độ giá `[0.5x – 1.5x]`, ẩn danh người bán ngoài danh sách bạn bè nếu vượt ngưỡng).<br>- Cân bằng tỷ lệ hái trộm (max 15%/ô) & xác suất Chó Cỏ bắt trộm (50%). | Bảng thông số `STAGE3_MARKET_TRAIN_CONFIG` & công thức chống lạm phát P2P. |
| **2. Backend & Multiplayer** | `@backend-architect` | - Viết **Migration Additive-Only** cho bảng `market_listings` (Sạp Báo Chợ Phiên), `train_orders` (Tàu Hỏa 3 toa), và `neighbor_steal_logs` (Nhật ký thăm vườn/hái trộm/rớt dép).<br>- Viết **Supabase RPC** `buy_market_listing` (có `SELECT ... FOR UPDATE SKIP LOCKED` chống 2 người mua trùng 1 món hàng cùng mili-giây) và RPC `steal_neighbor_crop` (kiểm tra sản lượng `>= 6` và trừ đúng 15% atomic). | File SQL Migration Giai đoạn 3 + 3 RPC atomic transactions. |
| **3. Art, Animation & VFX** | `@generate2dsprite` + `@video2dsprite` + `@generate2dmap` + `@codeart2d` + `@technical-artist` | - Sản xuất 48 frames cây trồng Đợt 3 (tán cây lâu năm `48x64`), Ong mật, Ngỗng, Trâu, 5 Thủy sản.<br>- Render animation Đầu máy Tàu Thống Nhất nhả khói (`fx_train_steam`), animation nhân vật rón rén hái trộm (`Steal_Sneak`) & giật mình rớt Dép Tổ Ong (`Caught_DropSlipper`). | Atlas `farm_stage3_market_train.json/.png` & VFX configs. |
| **4. Frontend & Gameplay** | `@frontend-developer` + `@ui-designer` | - Xây dựng `RoadsideShopModal.tsx` (Sạp báo 8 ô + Báo Nông Thôn) và `TrainOrderModal.tsx` (Tàu 3 toa + nút Nhờ bạn bè).<br>- Xây dựng **Chế độ Thăm Vườn Hàng Xóm (`NeighborVisitMode`)**: Chuyển cảnh sang nông trại bạn bè với bảng HUD Tưới hộ/Hái trộm/Nhật ký Dép Tổ Ong. | UI Modals + `NeighborService.ts` + `TrainService.ts`. |
| **5. Code Audit & QA** | `@code-reviewer` | - Kiểm tra Race Condition khi 2 người chơi cùng bấm mua 1 ô hàng trên Sạp Báo.<br>- Kiểm tra bảo toàn sản lượng gốc (`>= 85%`) khi bị nhiều hàng xóm ghé thăm liên tiếp. | Báo cáo Audit `RULE D0 & D1` Giai đoạn 3. |

---

## 4. QUY TRÌNH GIAO VIỆC CHO AI (`AI DELEGATION WORKFLOW & READY-TO-USE PROMPTS`)

### Cách 1: Prompt Giao AI Triển Khai Toàn Bộ Giai Đoạn 3 (Full-Stack Execution)
```markdown
Hãy đóng vai đội ngũ phát triển dự án "Nông Trại Tình Yêu & Gia Đình 3 Miền" và triển khai GIAI ĐOẠN 3 (v1.5 - Chợ Phiên, Tàu Thống Nhất & Hàng Xóm) theo đúng file `13_PLAN_GIAI_DOAN_3_v1.5_Cho_Phien_Va_Hang_Xom.md`:
1. BƯỚC 1 (Khai báo Tác động chéo theo RULE D0 & D1): Kiểm tra tác động lên `FarmScene.ts`, `App.tsx`, `market_listings`, `train_orders` và xác nhận Additive-Only 100% trước khi viết code.
2. BƯỚC 2 (Database & Economy - @economy-designer + @backend-architect): Tạo migration SQL cho `market_listings`, `train_orders`, `neighbor_steal_logs` và các RPC atomic (`buy_market_listing` với FOR UPDATE SKIP LOCKED, `steal_neighbor_crop` giới hạn <=15% sản lượng và kiểm tra Chó Cỏ 50%). Mở khóa 18 sinh vật Đợt 3 (lũy kế 63 loài) và 9 món chế biến Đợt 3.
3. BƯỚC 3 (Gameplay & UI - @frontend-developer + @ui-designer): Xây dựng `TrainOrderModal.tsx`, `RoadsideShopModal.tsx` (khung gỗ #3D2314, giấy #FFFDF5) và chế độ Thăm Vườn Hàng Xóm (`NeighborVisitMode`) trên `FarmScene.ts` (tưới hộ +5 Tim, hái trộm vui vẻ rớt Dép Tổ Ong).
4. BƯỚC 4 (Audio & QA - @game-audio-engineer + @code-reviewer): Gắn `soundEffects.playTrainHorn()` và BGM `market`, sau đó chạy nghiệm thu toàn diện theo Checklist Mục 5.
```

### Cách 2: Prompt Giao AI Sản Xuất Riêng Gói Asset, Animation (`8–12f`) & VFX Giai Đoạn 3
```markdown
Hãy kích hoạt chuỗi kỹ năng `@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d` và `@technical-artist` để sản xuất trọn bộ Asset, Animation & VFX cho GIAI ĐOẠN 3 theo đúng Mục 2.5 của `13_PLAN_GIAI_DOAN_3_v1.5_Cho_Phien_Va_Hang_Xom.md` và `05_MASTER_ART`:
1. Tuân thủ tuyệt đối RULE D1 Art Lock: Góc nhìn 3/4 Top-Down Oblique, viền ấm `#3D2314` (cấm `#000000`), nền `#FF00FF`, Anchor `(0.5, 0.9)`.
2. Tạo 12 dải Sprite Cây trồng Đợt 3 (`CROP_06..09`, `CROP_14..17`, `CROP_22..25` — mỗi cây 4 giai đoạn = 48 frames, cây ăn quả lâu năm kích thước `48x64 px` có thêm trạng thái gốc khô chờ Cưa Sắt).
3. Tạo Sprite & Animation `8–12 frames` cho Ong Mật (`ANIM_08`), Đàn Ngỗng (`ANIM_03`), Trâu Đen (`ANIM_06`), 5 Thủy sản (`AQUA_03, 05..08`), 2 Gia nhân (`WORK_03` Anh Sáu, `WORK_04` Dì Bảy), cùng 2 động tác xã hội của người chơi: `Steal_Sneak` (8f rón rén) và `Caught_DropSlipper` (10f bị Chó rượt rớt Dép Tổ Ong).
4. Tạo Sprite Công trình Đầu máy Tàu Thống Nhất (`bldg_train` `120x32 px`), Sạp Báo Chợ Phiên (`bldg_market` `175x74 px`), Xưởng Tre Mây (`MACH_05`), Quầy Chè (`MACH_06`), 15 Icon 32x32 và 3 Particle VFX (`fx_train_steam`, `fx_steal_alert`, `fx_bee_pollen`), đóng gói vào Atlas `farm_stage3_market_train.json/.png`.
```

---

## 5. CHECKLIST NGHIỆM THU GIAI ĐOẠN 3 (`DEFINITION OF DONE`)
- [ ] **Nghiệm thu RULE D0 & D1:** Không phá vỡ save-game Giai đoạn 1 & 2; các bảng SQL mới là Additive-Only; UI Sạp Báo & Tàu Hỏa giữ nguyên bảng màu ấm `#3D2314` / `#FFFDF5`.
- [ ] **Nghiệm thu Asset, Animation & VFX Đợt 3:** Đủ 48 frames cây trồng Đợt 3 (tán cây lâu năm tự làm mờ `alpha = 0.65` khi đi khuất), animation Tàu Hỏa nhả khói `fx_train_steam`, animation `Steal_Sneak` & `Caught_DropSlipper` mượt 60fps.
- [ ] **Nghiệm thu Chống Lạm Phát & Chống Phá Hoại:** Sạp Báo khóa cứng biên độ giá `[0.5x – 1.5x]` + thuế 5%; hái trộm không bao giờ lấy quá 15% sản lượng/ô và luôn để lại `>= 85%` cho chủ vườn.
- [ ] **Nghiệm thu Concurrency:** Mua hàng trên Sạp Báo Chợ Phiên xử lý chuẩn khi 2 người bấm cùng lúc (không nhân đôi vật phẩm, không trừ tiền oan).
