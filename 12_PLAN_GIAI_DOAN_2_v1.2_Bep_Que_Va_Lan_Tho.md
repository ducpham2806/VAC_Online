# KẾ HOẠCH TRIỂN KHAI CHI TIẾT GIAI ĐOẠN 2 (`v1.2 UPDATE 1` — 10 NGÀY): BẾP QUÊ, ĐỐ CA DAO, LÁN THỢ, SINH THÁI ĐỢT 2 (`+22 ➔ 45/81 LOÀI V-A-C`) & GÓI SẢN XUẤT ASSET / ANIMATION / VFX ĐỢT 2
## Dự án: **VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)**
**Mã tài liệu:** `12_PLAN_GIAI_DOAN_2_v1.2_Bep_Que_Va_Lan_Tho.md`  
**Phiên bản:** Stage 2 Execution Runbook v1.1 (Bổ sung **Mục 2.5: Kế Hoạch Sản Xuất Chi Tiết Asset, Animation `8–12 Frames`, Tilemap & Particle VFX Giai Đoạn 2**, tuân thủ `RULE D0` & `RULE D1`)  
**Thời lượng Sprint:** 10 Ngày làm việc (Sprint 3)  
**Phạm vi Modules:** **10 Modules (`M04.1` ➔ `M05.5`)** thuộc `EPIC 04` & `EPIC 05`  
**Đợt mở khóa nông – thủy – hải sản:** **📦 Đợt 2 (`+22 loài` ➔ Lũy kế `45 / 81 loài V-A-C`) + 3 Xưởng làng nghề + 9 Món ăn mới + 2 Gia nhân đầu + Chương 3, 6 & 7**  
**Tài liệu Master tham chiếu:** `00_MASTER_BIBLE`, `01_MASTER_GDD`, `02_MASTER_ECONOMY`, `03_MASTER_TECH`, `04_MASTER_DATA.csv`, `05_MASTER_ART`, `06_MASTER_UI_UX`, `10_MASTER_AI_PLAYBOOK`

---

## 🛡️ 1. BẢNG ĐÁNH GIÁ TÁC ĐỘNG CHÉO SỚM (`RULE D1 IMPACT REPORT — GIAI ĐOẠN 2`)

| Hạng Mục Kiểm Toán (`RULE D1`) | Trạng Thái | Quy Định Khóa Chặt Trong Giai Đoạn 2 (`v1.2 Update 1`) |
| :--- | :---: | :--- |
| **1. Core Gameplay VAC & Không Làm Mất Vai Trò Người Chơi** | **🟢 Bảo Toàn 100%** | Mở khóa Lán Thợ nhưng **không làm mất việc của người chơi**: Gia nhân chỉ làm việc khi Bàn Ăn còn cơm và **chờ đúng 5 phút sau khi cây/cá chín mới thu hoạch** (để chủ nhà đang online kịp tự tay thu hoặc chừa cửa sổ 2 phút cho bạn bè hái trộm ở Giai đoạn 3). |
| **2. Cân Bằng Kinh Tế (`4-Layer Worker Sinks`)** | **🟢 `94% – 100%`** | Mở khóa **4 Vòng lặp tiêu tiền Lán Thợ** (*Lương Xu + Mâm Cơm Bếp Quê + Đồ Bảo Hộ 72h + Phụ Cấp Ngày Mùa*), hút `2,500 – 5,500 🪙/ngày` giúp triệt tiêu lạm phát khi người chơi đạt Lv.10–16. |
| **3. Nhất Quán Art Style, Animation & UI/UX** | **🟢 Đồng Nhất 100%** | Công trình `bldg_lodge` (Lán Thợ), `NPC_05` (Cụ Đồ Vũ Bằng) và Gia nhân giữ nguyên góc `3/4 Top-Down`, viền ấm `#3D2314`, animation đi bộ về bàn ăn khi `Độ No < 35%`, kèm SFX `playCookingSizzle()` & `playAnimalHappy()`. |
| **4. Kiến Trúc Code & Cô Lập Module** | **🟢 Không Lỗi Hồi Quy** | Toàn bộ nông sản do thợ thu tự động phải đổ vào **Giỏ Kho Lán Thợ riêng biệt (`workerPantryCount <= 120`)**, tuyệt đối không làm tràn Kho chính của người chơi (`RULE C5`). |
| **5. Cơ Sở Dữ Liệu (`Additive-Only DB`)** | **🟢 Mở Rộng An Toàn** | Bổ sung bảng `public.hired_workers` (`CREATE TABLE IF NOT EXISTS`), giữ nguyên 100% dữ liệu `profiles`, `farm_entities` và `inventories` từ Giai đoạn 1 (`RULE C13`). |

---

## 📦 2. DANH MỤC THỰC THỂ & CỐT TRUYỆN MỞ KHÓA TRONG GIAI ĐOẠN 2 (`WAVE 2 CONTENT`)

1. **🌱 Vườn (`+13 loài` ➔ Lũy kế `29/48 cây`):**
   * 7 Cây ruộng trung hạn (`CROP_13..19` - Lv.8–11): *Cà chua & Cà tím, Mướp hương & Khổ qua, Lúa nếp cái hoa vàng, Bầu sao & Bí đao, Khoai môn & Củ sắn, Vừng đen & Hạt sen, Sen Đồng Tháp / Hồ Tây*.
   * 3 Cây lâu năm (`CROP_24..26` - Lv.8–11): *Dừa Xiêm Xanh, Ổi Lê & Hồng Xiêm, Chuối Tiêu Quê*.
   * 3 Cây Đặc Sản 3 Miền Bậc 2 (`CROP_N02`, `CROP_C02`, `CROP_S02` - Lv.7): *Chè Tân Cương Thái Nguyên (Bắc), Thanh Long Ruột Đỏ (Trung), Khóm (Dứa) Cầu Đúc (Nam)*.
2. **🐄 Chuồng (`+6 loài` ➔ Lũy kế `10/14 vật nuôi`):** *Heo Móng Cái (`ANI_05`), Nong Tằm Ăn Lá Dâu Nhả Kén Tơ (`ANI_06`), Bò Vàng & Bò Sữa (`ANI_07`)* + 3 Đặc sản Chuồng Bậc 1 (*Gà Đông Tảo `ANI_N01`, Dê Cừu Ninh Thuận `ANI_C01`, Vịt Chạy Đồng Trứng Son `ANI_S01`*).
3. **🐟 Ao (`+3 loài` ➔ Lũy kế `6/19 thủy sản`):** *Cá Chép Vàng (`AQUA_04`), Ếch Đồng & Lươn Vàng (`AQUA_05`), Cá Trê & Rô Phi (`AQUA_06`)*.
4. **🏭 Xưởng Làng Nghề (`+3 Xưởng` ➔ `6/8 Xưởng`), Món Ăn (`+9 Món` ➔ `14/27 Món`) & Gia Nhân (`2/6 Thợ`):**
   * Mở *Quán Nước Đầu Làng (`MAC_04`), Lò Gốm & Đan Lát (`MAC_07`), Khung Cửi Dệt Lụa (`MAC_08`)*.
   * Mở 7 món quê (`PROD_06..12`), 2 món nước giải khát (`PROD_19..20`), 2 Đồ bảo hộ 72h (`CRAFT_01` *Nón Lá Tre*, `CRAFT_02` *Áo Cánh Nâu*) và 2 Gia nhân đầu (`WORK_01` *Chú Tư Cày*, `WORK_02` *Cô Năm Thảo*).
5. **📖 Cốt Truyện Gia Phả:** Mở khóa **Chương 3 (Lv.6)**, **Chương 6 (Lv.14)** & **Chương 7 (Lv.16)**.

---

## 🎨 2.5. KẾ HOẠCH SẢN XUẤT CHI TIẾT ASSET, ANIMATION (`8–12 FRAMES`), TILEMAP & VFX GIAI ĐOẠN 2 (`STAGE 2 ART & VFX PIPELINE`)

| Nhóm Hạng Mục Đồ Họa | Danh Sách Mã Asset Cần Sản Xuất Trong Giai Đoạn 2 | Thông Số Kỹ Thuật (`Size`, `Frames`, `Palette`) | Cách Thực Thi Bằng AI Skills (`How to Generate & Integrate`) |
| :--- | :--- | :--- | :--- |
| **1. Công Trình Lán Thợ & 3 Xưởng Làng Nghề** | • `bldg_lodge` (**Lán Thợ Gia Nhân Mái Tranh** + Bàn Ăn Chung + Giỏ Tre `120 ô`)<br>• `MAC_04` (Quán Nước Đầu Làng)<br>• `MAC_07` (Lò Gốm & Đan Lát Tre Trúc)<br>• `MAC_08` (**Khung Cửi Dệt Lụa Tơ Tằm**) | • `bldg_lodge`: `198 x 74 px` (mái tranh vàng `#F5B82E`, cột tre `#4E8222`).<br>• 3 Xưởng: `64 x 64 px`, viền ấm `#3D2314`. | Kích hoạt **`@generate2dmap`** & **`@codeart2d`**: Tạo texture `bldg_lodge` trong `PixelAssetGenerator.ts` và đặt tại tọa độ `(width * 0.39, 68)` trong `FarmScene.ts`. |
| **2. Nhân Vật Gia Nhân & NPC Thực Khách Bí Ẩn** | • `char_worker_garden` (**Chú Tư Cày `WORK_01`** — Nón lá, áo cánh nâu, cầm liềm)<br>• `char_worker_breed` (**Cô Năm Thảo `WORK_02`** — Khăn rằn, áo bà ba, cầm giỏ tre)<br>• `NPC_05` (**Cụ Đồ Ẩm Thực Vũ Bằng** — Áo the đen, khăn xếp, cầm quạt giấy) | • Gia nhân: `48 x 48 px`, tâm neo `(0.5, 0.9)`.<br>• Cụ Đồ Vũ Bằng: `48 x 56 px`. | Kích hoạt **`@generate2dsprite`** tạo Master Still trên nền `#FF00FF`, sau đó dùng **`@codeart2d`** / **`@video2dsprite`** đóng gói texture vào `PixelAssetGenerator.ts`. |
| **3. Sprite +22 Loài V-A-C Đợt 2, 9 Món Ăn & 2 Đồ Bảo Hộ** | • **13 Cây Đợt 2** (`CROP_13..19`, `CROP_24..26`, `CROP_N02/C02/S02`) x 4 giai đoạn (`52 frames`), nổi bật là `crop_lotus` (Đầm Sen hồng `#F4A7B9`) và `crop_fruit_tree` (Dừa, Ổi, Chuối)<br>• **6 Vật nuôi** (*Heo, Nong Tằm nhả kén vàng, Bò Sữa, Gà Đông Tảo chân to, Dê, Vịt*) & **3 Thủy sản** (*Cá Chép, Lươn, Cá Trê*)<br>• **9 Icon Món ăn mới** & **2 Icon Đồ bảo hộ** (`CRAFT_01` Nón Lá, `CRAFT_02` Áo Cánh Nâu) | • Cây giàn leo & Đầm sen: `48 x 48 px`.<br>• Cây ăn quả lâu năm: `48 x 64 px`.<br>• Icon món ăn/bảo hộ: `32 x 32 px`. | Kích hoạt **`@generate2dsprite`** & **`@codeart2d`**: Cập nhật `crop_lotus` và `crop_fruit_tree` trong `PixelAssetGenerator.ts` và hiển thị tự động theo `tile.itemId` trong `FarmScene.ts`. |
| **4. Bộ Animation Đa Khung Hình (`8–12 Frames`)** | • **Gia nhân (`3 Clips/thợ`):** `Patrol_Work` (`8f` đi tuần quanh ruộng/chuồng), `Walk_To_Lodge_Hungry` (`8f` đi bộ về bàn ăn Lán Thợ khi `belly < 35%` kèm nhãn đỏ **`[Đói ➔ Về Lán]`**), `Eat_At_Table` (`8f` ngồi ăn cơm)<br>• **Cụ Đồ Vũ Bằng:** `Idle_StrokeBeard` (`8f` vuốt râu ngâm ca dao)<br>• **Khung Cửi (`MAC_08`):** Con thoi chạy qua lại dệt lụa (`8f`) | • Tốc độ `8 – 12 FPS`.<br>• Chuyển đổi vị trí mượt mà giữa tọa độ ruộng `(w.baseX, w.baseY)` và tọa độ Lán Thợ `(lodgeX, lodgeY)`. | Kích hoạt **`@video2dsprite`** & **`@technical-artist`**: Lập trình máy trạng thái hình ảnh Gia nhân trong hàm `update(time)` của `FarmScene.ts`. |
| **5. Hệ Thống Particle VFX Bếp Quê & Lán Thợ** | • **`fx_chimney_smoke`** (`10x10 px`, trắng xám ấm `#E0D4C0`): Khói bếp lam chiều bốc lên uốn lượn khi Nồi Đất Bếp Quê đỏ lửa<br>• **`fx_culinary_star`** (`8x8 px`, vàng cam `#FF9F1C`): Pháo sáng chúc mừng khi khám phá món mới hoặc giải đúng câu đố Ca dao Cụ Đồ | • Hạt khói bay lên với `alpha: 0.7 ➔ 0` trong `1200ms`. | Kích hoạt **`@technical-artist`**: Kết nối hiệu ứng hạt cùng âm thanh `soundFX.playCookingSizzle()` và `soundFX.playAnimalHappy()`. |

---

## 🛠️ 3. PHÂN RÃ CHI TIẾT 10 MODULES: LÀM GÌ & LÀM NHƯ THẾ NÀO (`WHAT & HOW TO BUILD`)

| Mã Module | Tên Tính Năng | Phải Làm Gì (`What to Build`) | Làm Như Thế Nào (`How to Implement Step-by-Step`) | File Đích & Test Case |
| :---: | :--- | :--- | :--- | :--- |
| **`M04.1`** | **Xây Dựng & Vận Hành 8 Xưởng Làng Nghề (`MAC_01..08`)** | Hiển thị danh sách Xưởng trong Modal `COOKING`, cho phép xây dựng và mở rộng công suất chế biến. | Lập trình `craftOrBuyCatalogItem` trong `useGameStore.ts` kiểm tra `gold >= buyCostGold`, trừ vàng, cộng `+85 XP` và tăng `inventory[mac.id]`. | `src/store/useGameStore.ts`, `src/App.tsx` • `TC-04.1a` |
| **`M04.2`** | **Nồi Đất Phối Món Tự Do ("Thử Tài Bếp Quê")** | Bỏ `>= 3` nguyên liệu vào Nồi Đất để khám phá công thức mới, thưởng nóng `+10💎`, `+50 XP` & `+25⚡`. | Viết action `cookRandomDish(ingredients)` kiểm tra `ingredients.length >= 3`, phát `soundFX.playCookingSizzle()` và cộng thưởng. | `src/store/useGameStore.ts`, `src/App.tsx` • `TC-04.2a` |
| **`M04.3`** | **Sổ Tay 27 Công Thức Ẩm Thực & Hồi Năng Lượng `⚡`** | Chế biến món ăn từ nông sản để bán hoặc ăn hồi `+15⚡ ➔ +45⚡` (khóa trần `maxStamina`). | Cập nhật Modal `COOKING` hiển thị công thức theo Đợt mở khóa; khóa trần `Math.min(maxStamina, stamina + gain)`. | `src/store/useGameStore.ts`, `src/App.tsx` • `TC-04.3a` |
| **`M04.4`** | **Khung Cửi Dệt Lụa (`MAC_08`) & Lò Đan Lát (`MAC_07`)** | Thu kén tơ từ Nong Tằm (`ANI_06`) và tre trúc để dệt vải lụa và đan đồ bảo hộ lao động (`CRAFT_01..04`). | Kết nối sản phẩm đầu ra của `ANI_06` và `CROP_29` vào công thức chế tạo `CRAFT_01..04` trong `useGameStore.ts`. | `src/store/useGameStore.ts` • `TC-04.1a` |
| **`M04.5`** | **Thực Khách Bí Ẩn & Đố Ca Dao Bếp Quê (`FEAT_02`)** | Cụ Đồ Vũ Bằng (`NPC_05`) ra câu đố Ca dao ẩm thực mỗi ngày; giải đúng nhận `+650🪙`, `+10💎`, `+20⚡` & Sao Mai Ẩm Thực. | Lập trình bộ câu đố Ca dao lọc theo các món đã mở ở Đợt 1–2 trong Modal `COOKING` để người chơi luôn đủ nguyên liệu trả lời. | `src/store/useGameStore.ts`, `src/App.tsx` • `TC-04.5a` |
| **`M05.1`** | **Tuyển Dụng Gia Nhân & Gia Hạn Lương 3 Ngày (`-12%`)** | Thuê và gia hạn hợp đồng 3 ngày cho Gia nhân với công thức chiết khấu `Round(Salary * 3 * 0.88)`. | Viết hàm `payWorkerSalary(workerCode)` trong `useGameStore.ts` trừ vàng chính xác, bật `isHired = true` và `contractDaysLeft += 3`. | `src/store/useGameStore.ts` • `TC-05.1a` |
| **`M05.2`** | **Bàn Ăn Chung Lán Thợ & Tự Động Về Ăn (`Độ No < 35%`)** | Dọn cơm lên Bàn Ăn Chung (`lodgeDiningTableMeals`); khi `belly < 35%`, thợ tự đi bộ về Lán ăn 1 suất hồi `100% Độ No`. | Lập trình `addMealsToLodgeTable`, `feedWorker` và nhánh tự động ăn cơm trong `tickWorkerAutomation` + di chuyển Sprite về `lodgeX, lodgeY` trong `FarmScene.ts`. | `src/store/useGameStore.ts`, `FarmScene.ts` • `TC-05.2a` |
| **`M05.3`** | **Cấp Phát 4 Bộ Đồ Bảo Hộ 72 Giờ & Phụ Cấp Ngày Mùa** | Trang bị `CRAFT_01..04` đặt lại độ bền `72/72 giờ` (`+15% ➔ +25%` tốc độ); thưởng phụ cấp `-300🪙` lên `100% Tinh thần`. | Viết hàm `equipWorkerGear` và `giveWorkerBonus` trong `useGameStore.ts`, phát `soundFX.playAnimalHappy()`. | `src/store/useGameStore.ts` • `TC-05.3a` |
| **`M05.4`** | **Giỏ Kho Lán Thợ Riêng Biệt (`120 Ô` – Chống Tràn Kho)** | Nông sản thợ thu tự động cất vào `workerPantryCount` (`0 ➔ 120`); bấm `📥 Thu Giỏ Thợ` rút toàn bộ về kho chính. | Khóa trần `Math.min(120, nextPantry)` trong `tickWorkerAutomation` và viết `claimWorkerPantry` trong `useGameStore.ts`. | `src/store/useGameStore.ts` • `TC-05.4a` |
| **`M05.5`** | **Tính Sản Lượng Thu Hoạch Khi Offline (`Lazy-Tick`)** | Khi người chơi mở lại game sau `1–8 giờ` Offline, tự động tính sản lượng thợ đã làm dựa trên số cơm và giờ hợp đồng còn lại. | Viết hàm `simulateOfflineWorkerProgress(hoursOffline)` trong `useGameStore.ts` tính toán an toàn không gây âm Độ No. | `src/store/useGameStore.ts` • `TC-05.5a` |

---

## 👥 4. PHÂN CÔNG 6 BỘ PHẬN & CÁCH GIAO AI LÀM 100% CÔNG VIỆC KÈM SKILL

| Bộ Phận (Role) | AI Skills Tự Động Kích Hoạt | Công Việc Cụ Thể Trong Giai Đoạn 2 | Cách AI Thực Thi Thay Thế Con Người 100% |
| :--- | :--- | :--- | :--- |
| **1. PO / Game, Economy & Narrative Designer** | `@game-designer`, `@economy-designer`, `@narrative-designer` | Chốt thông số 22 loài Đợt 2, toán học 4 tầng Sink Lán Thợ, câu đố Ca dao Cụ Đồ Vũ Bằng và Chương 3, 6, 7. | AI đối chiếu `01_MASTER_GDD` & `02_MASTER_ECONOMY`, nạp công thức chiết khấu lương `-12%` và bộ câu đố Ca dao vào Store. |
| **2. UI / UX Designer** | `@ui-designer` | Thiết kế Modal `COOKING` (2 chế độ: Nồi Đất + Sổ Tay) và Modal `WORKERS` (Danh sách 6 thợ + Bàn Ăn + Giỏ Kho 120 ô). | AI dựng trực tiếp giao diện Gỗ/Tre trong `App.tsx` với thanh tiến trình Độ No và nút thao tác 1 chạm. |
| **3. Artist, Animator, VFX & Sound Engineer** | `@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d`, `@technical-artist`, `@game-audio-engineer` | Sản xuất trọn bộ Asset Đợt 2 theo **Mục 2.5**: 22 loài V-A-C, công trình `bldg_lodge`, Cụ Đồ Vũ Bằng, Animation Gia nhân đi tuần & về bàn ăn khi đói, VFX Khói bếp và SFX `playCookingSizzle()`, `playAnimalHappy()`. | AI sinh Texture trong `PixelAssetGenerator.ts`, lập trình chuyển động đi bộ về Lán khi đói trong `FarmScene.ts` và gắn SFX. |
| **4. Backend Engineer** | `@backend-architect` | Tạo bảng `public.hired_workers` lưu trạng thái hợp đồng, Độ No, Tinh thần và Đồ bảo hộ trên Supabase. | AI viết SQL Migration Additive-Only (`CREATE TABLE IF NOT EXISTS public.hired_workers`) trong `0001_init_huong_dong_gio_noi.sql`. |
| **5. Frontend Engineer** | `@frontend-developer` | Lập trình vòng lặp `tickWorkerAutomation` mỗi 10 giây và `simulateOfflineWorkerProgress`. | AI viết code TypeScript Strict (`0 any`) trong `useGameStore.ts` và đồng bộ hiển thị trực tiếp lên `FarmScene.ts`. |
| **6. QA / QC Engineer** | `@code-reviewer` | Kiểm thử toán học lương 3 ngày, tự động ăn cơm khi `< 35%`, khóa trần Giỏ Thợ `120` và Lazy-Tick Offline. | AI chạy `tsc --noEmit` và bộ Test Cases `TC-04.1a ➔ TC-05.5a` trong `qcTestRunner.ts`. |

---

## 📋 5. BỘ CÂU LỆNH (PROMPT) COPY-PASTE ĐỂ GIAO AI TRIỂN KHAI GIAI ĐOẠN 2

### 🔹 Cách 1: Giao AI chạy toàn bộ hoặc rà soát nghiệm thu trọn gói Giai đoạn 2 (Bao gồm Asset, Animation, VFX & Code)
```text
Hãy đọc file `AGENTS.md`, `00_MASTER_BIBLE_Tong_Hop_Tai_Lieu_Chuan_Trien_Khai_PO_Dev_Art_UI_QC.md` và `12_PLAN_GIAI_DOAN_2_v1.2_Bep_Que_Va_Lan_Tho.md`.
Hãy đóng vai trò toàn bộ 6 bộ phận và tự động kích hoạt các Skill chuyên môn liên quan (`@game-designer`, `@economy-designer`, `@narrative-designer`, `@ui-designer`, `@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d`, `@technical-artist`, `@game-audio-engineer`, `@backend-architect`, `@frontend-developer`, `@code-reviewer`) để thực thi/kiểm toán trọn vẹn GIAI ĐOẠN 2 (`v1.2 Update 1` — 10 Modules từ `M04.1` đến `M05.5`, mở khóa Đợt 2 nâng lên 45/81 loài V-A-C, kèm trọn bộ Asset/Animation/VFX ở Mục 2.5).
BẮT BUỘC tuân thủ `RULE D0` và `RULE D1` (xuất bảng `[🔍 ĐÁNH GIÁ TÁC ĐỘNG CHÉO - RULE D1 IMPACT REPORT]` ngay ở Bước 1, bảo toàn 100% dữ liệu và tính năng Giai đoạn 1). Sau khi hoàn tất, hãy chạy `tsc --noEmit` (0 lỗi) và bộ Test Cases Giai đoạn 1 + 2 trong `qcTestRunner.ts` rồi xuất Phiếu Nghiệm Thu trình tôi duyệt.
```

### 🔹 Cách 2: Giao AI chuyên biệt sản xuất / nâng cấp gói Asset, Animation (`8–12 frames`) & Particle VFX của Giai đoạn 2
```text
Hãy kích hoạt `@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d`, `@technical-artist` và `@game-audio-engineer`.
Dựa theo Mục 2.5 trong `12_PLAN_GIAI_DOAN_2_v1.2_Bep_Que_Va_Lan_Tho.md` và quy chuẩn tại `05_MASTER_ART_Pixel_Art_Direction_Va_Asset_Pipeline.md` (viền ấm `#3D2314`, cấm `#000000`), hãy tạo/cập nhật trọn bộ Sprite cho 22 loài Đợt 2 (`crop_lotus`, `crop_fruit_tree`, Nong Tằm, Bò Sữa, Gà Đông Tảo), công trình `bldg_lodge`, Cụ Đồ Vũ Bằng, Animation Gia nhân đi tuần & tự đi bộ về Bàn Ăn khi `belly < 35%`, cùng hiệu ứng Khói bếp & SFX Bếp Quê.
```

### 🔹 Cách 3: Giao AI dựng từng Module lẻ trong Giai đoạn 2 (Từ `M04.1` đến `M05.5`)
```text
Dựa theo `12_PLAN_GIAI_DOAN_2_v1.2_Bep_Que_Va_Lan_Tho.md` và quy trình 6 bước khép kín trong `10_MASTER_AI_PLAYBOOK`, hãy tự động nhận diện Skill và triển khai Module: [NHẬP MÃ MODULE, VD: M04.5 hoặc M05.2].
Nhớ xuất bảng `[🔍 ĐÁNH GIÁ TÁC ĐỘNG CHÉO - RULE D1 IMPACT REPORT]` ở Bước 1, thực hiện đầy đủ phần Asset/VFX ở Bước 2 và dừng chờ tôi duyệt ở Bước 6.
```

---

## ✅ 6. TIÊU CHÍ NGHIỆM THU HOÀN THÀNH GIAI ĐOẠN 2 (`STAGE 2 EXIT CRITERIA`)
- [x] Mở khóa đúng **+22 loài Đợt 2** (tổng `45/81 loài V-A-C`), 3 Xưởng làng nghề (*Quán Nước, Đan Lát, Khung Cửi*) và 9 Món ăn mới khi hoàn thành Chương 3, 6, 7.
- [x] Toàn bộ **Asset, Animation (`8–12 frames`) và VFX của Đợt 2 (`Mục 2.5`)** hoạt động mượt: Gia nhân hiển thị trên bản đồ, tự đổi sang nhãn đỏ `[Đói ➔ Về Lán]` và đi bộ về `bldg_lodge` khi `belly < 35%`.
- [x] Nồi Đất Phối Món chặn khi `< 3` nguyên liệu và thưởng đúng `+10💎`, `+50 XP`, `+25⚡` khi `>= 3` nguyên liệu.
- [x] Gia hạn lương 3 ngày tính đúng chiết khấu `-12%` (`Round(Salary * 3 * 0.88)`), nhân công tự về bàn ăn khi `belly < 35%` và Giỏ Kho Thợ khóa cứng ở trần `120/120`.
- [x] Pass 100% các Test Cases `TC-04.1a`, `TC-04.2a`, `TC-04.3a`, `TC-04.5a`, `TC-05.1a`, `TC-05.2a`, `TC-05.3a`, `TC-05.4a`, `TC-05.5a` (đồng thời giữ `100% PASS` toàn bộ Test Cases Giai đoạn 1).
