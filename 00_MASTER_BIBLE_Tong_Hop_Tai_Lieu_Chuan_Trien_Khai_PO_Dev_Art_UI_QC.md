# SỔ TAY TỔNG CHỈ HUY & MỤC LỤC BỘ TÀI LIỆU CHUẨN DUY NHẤT (MASTER PRODUCTION BIBLE — ZERO REDUNDANCY)
## Dự án: **VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)**
**Mã tài liệu:** `00_MASTER_BIBLE_Tong_Hop_Tai_Lieu_Chuan_Trien_Khai_PO_Dev_Art_UI_QC.md`  
**Phiên bản:** Master Bible 9.1 (Tích hợp **Quy Tắc Tối Thượng `RULE D0`: Luôn Đối Chiếu Chéo & Triệt Tiêu Trùng Lặp Ở Mọi Task**, đồng bộ 100% **6 Giai Đoạn / 11 Epics / 52 Modules / 17 AI Skills / 37 Test Cases**)  
**Đối tượng sử dụng:** Product Owner (PO), Game/Narrative Designer (GD), UI/UX Designer, Artist & Sound, Backend/Multiplayer Dev (BE), Frontend Dev (FE), QA/QC Engineer & AI Coding Agents (ChatGPT, Claude, Antigravity)

---

## 🚨 0. QUY TẮC BẮT BUỘC CHO TẤT CẢ CÁC TASK (`RULE D0: ĐỐI CHIẾU CHÉO & TRIỆT TIÊU TRÙNG LẶP 100%`)

Ở **mọi yêu cầu hoặc task phát sinh** (thêm tính năng, chỉnh sửa thiết kế, cân bằng kinh tế hay lập trình), AI và đội ngũ phát triển **BẮT BUỘC** thực hiện 3 bước kiểm toán sau:
1. **Đối chiếu chéo toàn bộ tài liệu (`Cross-Document Reconciliation`):** Kiểm tra toàn bộ các file từ `00` ➔ `10` và `AGENTS.md` để đảm bảo số lượng Giai đoạn (`6 Giai đoạn`), Epics (`11 Epics`), Modules (`52 Modules: M01.0 ➔ M11.6`), Thực thể gốc (`155 Thực thể`), Skills (`17 Skills`) và Test Cases (`37 TC`) khớp nhau tuyệt đối.
2. **Hợp nhất và xóa bỏ phần trùng lặp, dư thừa (`Zero Redundancy & Pruning`):** Khi nội dung mới giao thoa với phần cũ, bắt buộc gộp chung vào một chuẩn duy nhất và xóa bỏ phần rời rạc cũ (VD: gộp mảnh cổ vật cũ vào `FEAT_03: 12 Kỷ Vật Tuổi Thơ 8x–9x`; phân tách rõ `EVENT_03: Đua Trâu Vàng chỉ số nông trại` với `M11.2..M11.4: Võ Đài PK & Loạn Chiến điều khiển thời gian thực`).
3. **Một Nguồn Chân Lý Duy Nhất (`Single Source of Truth`):** Không copy-paste lặp lại cùng một bảng dữ liệu qua nhiều file — mỗi file trong bộ `00 ➔ 10` giữ một vai trò chuyên biệt duy nhất.

---

## 1. BẢN ĐỒ HỆ THỐNG TÀI LIỆU CHUẨN DUY NHẤT SAU KHI HỢP NHẤT (`CLEAN DOCS MAP: 00 ➔ 10`)

Toàn bộ các tài liệu rời rạc hoặc trùng lặp trước đây đã được **gộp gọn vào đúng các file gốc tương ứng (`00` ➔ `10`)** và lưu trữ bản cũ tại `docs_archive_merged/`. Đội ngũ phát triển và AI chỉ cần làm việc trên bộ file chuẩn dưới đây:

| Mã Số | Tên File Chuẩn Trong Thư Mục Gốc | Nội Dung Cốt Lõi & Các File Đã Được Hợp Nhất Vào | Bộ Phận & AI Skills Sử Dụng Chính |
| :---: | :--- | :--- | :--- |
| **`00`** | `00_MASTER_BIBLE_Tong_Hop_Tai_Lieu_Chuan_Trien_Khai_PO_Dev_Art_UI_QC.md` | **Sổ Tay Tổng Chỉ Huy (File này):** Bản đồ điều hướng tài liệu `00 ➔ 10`, Ma trận **6 Giai đoạn (52 Modules)** & Bảng ánh xạ 6 Bộ phận với **17 AI Skills**. | **Tất cả 6 Bộ phận & AI Agents** |
| **`01`** | `01_MASTER_GDD_Gameplay_Nong_Trai_3_Mien_Va_Cong_Dong.md` | **Master GDD v7.0:** Toàn bộ Gameplay Vườn – Ao – Chuồng (**155 thực thể**), 3 Miền, 6 Gia nhân Lán Thợ, **Cốt truyện 10 Chương (`EMP`/`PRAG`)**, 6 Sự kiện Lễ hội (`FEAT_01..03`, `EVENT_01..03`) & **Chương 6: Sảnh Chung Chợ Đình Đa Người Chơi, Võ Đài PK 1v1 / Tổ Đội 3v3 / Loạn Chiến 8–12P & Lều Máy Thùng Hyper-Casual (`30s–90s`)**. | **PO / GD** (`@game-designer`, `@narrative-designer`, `@level-designer`) |
| **`02`** | `02_MASTER_ECONOMY_Can_Bang_Kinh_Te_IAP_Va_Chong_Lam_Phat.md` | **Master Economy v7.0:** Tỷ giá `1.000đ = 5💎`, **7 Van khóa chống lạm phát** (bổ sung **Thuế Sới Đình `10%` Zero-Sum** & **Trần thưởng Hyper-Casual `1,500 🪙/ngày`**), đồng **`🏮 Xu Hội Làng`** & Bảng `Sources vs. Sinks` qua 6 Giai đoạn (`94%–112%`). | **PO / Economy** (`@economy-designer`, `@growth-hacker`) |
| **`03`** | `03_MASTER_TECH_Kien_Truc_Server_Realtime_Webgame_PWA.md` | **Master Tech & Rules v6.0:** Kiến trúc Client (Phaser 3 + React 19 + Zustand), 11 Bảng Supabase SQL, 7 Hàm Atomic RPC (`FOR UPDATE`), **Phân kênh Sảnh Chung `25–30 CCU/Shard` + Đồng bộ `10Hz LERP`**, **Khung lắp ghép `IHyperCasualCartridge` (1-File Minigame SDK)** & 12 Quy tắc Code (`RULE C1 ➔ C12`). | **FE / BE / Multiplayer Dev** (`@backend-architect`, `@godot-multiplayer-engineer`, `@frontend-developer`, `@code-reviewer`) |
| **`04`** | `04_MASTER_DATA_Bang_Thong_So_Kinh_Te_Toan_Game.csv` | **Dữ liệu gốc CSV:** Thông số kinh tế chi tiết (Đồng bộ với `src/data/masterData.ts` & bảng `public.master_catalog`). | **FE / BE / QC** (`@economy-designer`, `@backend-architect`) |
| **`05`** | `05_MASTER_ART_Pixel_Art_Direction_Va_Asset_Pipeline.md` | **Master Art & Audio:** Bảng 64 màu 3 miền, Quy chuẩn Pixel `32x32` / `48x64`, Viền ấm `#3D2314`, Vòng lặp `8–12 frames`, Danh mục Sprite/VFX & **Âm thanh Ngũ Cung WebAudio**. | **Artist / Sound** (`@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d`, `@technical-artist`, `@game-audio-engineer`) |
| **`06`** | `06_MASTER_UI_UX_Wireframe_Va_Flow_Toan_Bo_Tinh_Nang.md` | **Master UI/UX v7.0:** Sơ đồ luồng `0A Splash ➔ 0B Auth 4 Tabs ➔ 1 Chọn Quê ➔ 2 Main HUD ➔ 3 Lán Thợ ➔ 4 Sảnh Chung Chợ Đình (Joystick + Emote Wheel) ➔ 5 Võ Đài PK & Máy Thùng Hyper-Casual`. | **UI/UX / FE** (`@ui-designer`, `@frontend-developer`) |
| **`07`** | `07_INTERACTIVE_WIREFRAME_VIEWER.html` | **Bản Mẫu HTML5 Wireframe Tương Tác:** Mở trên trình duyệt để bấm thử trực quan các màn hình và luồng tính năng. | **UI/UX / PO / FE / QC** (`@ui-designer`) |
| **`08`** | `08_MASTER_PLAN_Lo_Trinh_San_Xuat_DLC_Va_Quy_Trinh_AI_Supabase.md` | **Master Roadmap & WBS v8.0:** Kế hoạch phát triển đồng nhất **6 Giai Đoạn (`Giai đoạn 1` ➔ `Giai đoạn 6`)**, phân rã **11 Epics / 52 Modules**, giao việc cho **6 Bộ phận** kèm **37 Test Cases QC**. | **PO / Tất cả 6 Bộ phận & AI** |
| **`09`** | `09_FACEBOOK_ROADMAP_POSTER.html` | **Công Cụ Xuất Ảnh Poster Lộ Trình (`1920x1080 .PNG`):** Dùng để xuất ảnh truyền thông đăng Facebook/Fanpage. | **PO / Marketing** (`@content-creator`, `@growth-hacker`) |
| **`10`** | `10_MASTER_AI_PLAYBOOK_Quy_Trinh_AI_Tu_Dong_Dung_Tung_Tinh_Nang.md` | **Master AI Playbook v9.0:** Khung tự động nhận diện **17 Skills Chuyên Môn** và thực thi từng tính năng một trong **52 Modules (`M01.0` ➔ `M11.6`)** qua **6 Bước khép kín** + Mẫu Prompt tạo thêm game Hyper-Casual mới trong 1 bước. | **PO / AI Agents (ChatGPT, Claude, Antigravity)** |

---

## 2. BẢNG ÁNH XẠ 6 BỘ PHẬN NHÂN SỰ VỚI 17 SKILLS CHUYÊN MÔN CỦA AI (`HUMAN ROLES <-> AI SKILLS MAPPING`)

| Vị Trí Trong Team (Human Role) | Bước Trong Vòng Lặp 6 Bước | Bộ AI Skills Tự Động Nhận Diện & Kích Hoạt | Nhiệm Vụ Cốt Lõi Được Thực Thi |
| :--- | :---: | :--- | :--- |
| **1. PO / Game, Economy & Narrative Designer** | **Bước 1 (Thiết kế)** & **Bước 6 (Duyệt)** | `@game-designer`, `@economy-designer`, `@narrative-designer`, `@level-designer`, `@growth-hacker`, `@content-creator` | Chốt cơ chế gameplay, công thức chống lạm phát (`Thuế Sới Đình 10%`, `Trần Arcade 1,500🪙/ngày`), kịch bản 10 chương, quy hoạch 25 khu nông trại + 5 khu Sảnh Chung. |
| **2. UI / UX Designer** | **Bước 1 (Flow)** & **Bước 4 (UI)** | `@ui-designer` | Thiết kế bố cục `2-Thumb Landscape HUD`, Virtual Joystick + Emote Wheel Sảnh Chung, Khung vỏ Máy Thùng Hyper-Casual và 12 Modal Gỗ/Tre. |
| **3. Artist, Animator & Sound Engineer** | **Bước 2 (Asset, VFX & Audio)** | `@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d`, `@technical-artist`, `@game-audio-engineer` | Tạo Sprite Pixel 64 màu (viền ấm `#3D2314`), animation `8–12 frames` (Múa lân, Đấu gậy bông, Đấu vật), bản đồ Sảnh Chung và nhạc Ngũ cung / Trống hội. |
| **4. Backend & Multiplayer Engineer (BE)** | **Bước 3 (Database, RPC & Netcode)** | `@backend-architect`, `@godot-multiplayer-engineer`, `@economy-designer` | Viết bảng PostgreSQL, RLS, Atomic RPC (`FOR UPDATE`), **Phân kênh Sảnh Chung `30 CCU/Shard`, Đồng bộ tọa độ `10Hz LERP` & Đồng bộ Seed PRNG cho PK**. |
| **5. Frontend Engineer (FE)** | **Bước 3 (Store)** & **Bước 4 (Scene/SDK)** | `@frontend-developer`, `@ui-designer`, `@technical-artist` | Lập trình `FarmScene.ts`, `SocialPlazaScene.ts`, `MinigameHostScene.ts`, **Chuẩn băng game `IHyperCasualCartridge`**, React 19 `App.tsx` & Zustand Store. |
| **6. QA / QC Engineer** | **Bước 5 (Kiểm thử & Audit)** | `@code-reviewer` | Kiểm toán mã nguồn (`npx tsc --noEmit` 0 lỗi), kiểm tra 12 Quy tắc bất khả xâm phạm (`RULE C1 ➔ C12`) và chạy tự động **37 Test Cases** trong `qcTestRunner.ts`. |

---

## 3. TÓM TẮT LỘ TRÌNH 6 GIAI ĐOẠN ĐỒNG NHẤT (DÙNG CHUNG CHO CẢ CÔNG BỐ USER & SPRINT DEV TEAM — 52 MODULES)

| Giai Đoạn | Tên Chủ Đề Công Bố User | Bản Build Dev | Trọng Tâm Triển Khai Của Đội Ngũ & AI (`52 Modules: M01.0 ➔ M11.6`) |
| :---: | :--- | :---: | :--- |
| **Giai Đoạn 1** | **🌱 Về Quê Lập Nghiệp** | `v1.0 Core MVP` *(14 Ngày)* | Hạ tầng Engine + Splash 4 bước + Cổng Xác thực 4 Tabs + Khởi tạo 3 Miền (`Bắc/Trung/Nam`) + Thời tiết động + Khai hoang 25 khu + Chuỗi **Vườn – Ao – Chuồng (81 loài)** + Vét Bùn Ao kích nổ Hoàng Kim `⭐` (`x3`) + **Chương 1–2**. |
| **Giai Đoạn 2** | **🍲 Bếp Quê & Lán Thợ** | `v1.2 Update 1` *(10 Ngày)* | Xây dựng **8 Xưởng Làng Nghề** + **Nồi Đất Phối Món Ngẫu Nhiên** + **27 Món Ăn 3 Miền** + **Thực Khách Bí Ẩn Đố Ca Dao (`FEAT_02`)** + **Lán Thợ Đồng Quê (6 Gia nhân `WORK_01..06`)** + Bàn Ăn Chung + 4 Đồ bảo hộ 72h + Giỏ Kho Thợ `120 ô` + **Lazy-Tick Offline** + **Chương 3, 6, 7**. |
| **Giai Đoạn 3** | **🚂 Chợ Phiên & Hàng Xóm** | `v1.5 Update 2` *(10 Ngày)* | Đơn **Hợp Tác Xã** + **Báo Chợ P2P 3 Miền** (`0.8x–2.0x`, thuế `10%`) + **Tàu Hỏa Bắc – Nam** + **Thương Lái Giá Sốt** + **Thương Đội Liên Gia 3 Miền (`FEAT_01`)** + **Hái Trộm Vườn/Cá** (`80%`) + **4 Lớp Phòng Thủ** (*Chó Phú Quốc* + *Dép Tổ Ong*) + **Cứu Trợ Bão (`0⚡`)** + **Sổ Lưu Bút** + **Chương 4–5**. |
| **Giai Đoạn 4** | **🏮 Hội Làng & Thời Trang** | `v1.8 Update 3` *(12 Ngày)* | **Trùng Tu Đình Làng 3 Cấp** + **Miếu Thần Nông** + **Vườn Ươm Đột Biến (Pity 100%)** + **Rừng Trúc & Bảo Tàng 12 Kỷ Vật Tuổi Thơ 8x–9x (`FEAT_03` - Đổi 1-1)** + **Đua Thuyền Rồng** + **Hội Thi Trâu Vàng Cày Giỏi (`EVENT_03`)** + **Chợ Đêm (`x1.8`)** + **12 Ô Thời Trang (`3➔1`, `Transmog`)** + **Lịch Bloc, Đập Niêu, Xổ Số 18h, IAP** + **Đêm Hội Trăng Rằm (`EVENT_02`)** + **Chương 8–9**. |
| **Giai Đoạn 5** | **💍 Lễ Cưới & Homestay** | `v2.0 Complete` *(12 Ngày)* | **Hẹn Hò 10 Tim ❤️ & Lễ Cưới Làng Quê** + **Bé Tiểu Đồng Gia Bảo** (`+30⚡` cơm sáng + `+10` nông sản/ngày) + **Khu Du Lịch Sinh Thái Homestay 2 Cấp** + **Canh Nồi Bánh Chưng Xuyên Đêm & Tiếp Củi `0⚡` (`EVENT_01`)** + **Xuất Ảnh Bằng Khen Điền Chủ (`.PNG`)** + Đóng gói Native App (`iOS/Android`) + **Chương 10**. |
| **Giai Đoạn 6** *(Mới - Tiếp nối)* | **⛩️ Sảnh Chung, PK Dân Gian & Vũ Trụ Hyper-Casual** | `v3.0 Expansion` *(14 Ngày)* | **Sảnh Chung "Chợ Đình Ba Miền" (`M11.1` - Joystick 8 hướng, `10Hz LERP` 30 người/kênh, Bong bóng Chat, Múa Lân)** + **Võ Đài PK 1v1 (`M11.2` - Đấu Gậy Cầu Tre, Đấu Vật Sumo, Ném Dép)** + **Tổ Đội 2v2/3v3 (`M11.3` - Cướp Cờ Lúa Vàng, Kéo Co)** + **Loạn Chiến 8–12P (`M11.4` - Ao Làng Bắt Vịt Vàng, Truyền Pháo Né Trâu)** + **Máy Thùng Hyper-Casual Đơn 15–45s (`M11.5` - Chẻ Tre, Nhảy Lá Sen, Bắn Bi Ve `0⚡`)** + **Khung Lắp Ghép `IHyperCasualCartridge` SDK & Cửa Hàng `🏮 Xu Hội Làng` (`M11.6`)**. |
