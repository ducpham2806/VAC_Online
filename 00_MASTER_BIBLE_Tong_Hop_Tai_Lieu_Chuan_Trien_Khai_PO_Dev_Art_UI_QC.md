# SỔ TAY TỔNG CHỈ HUY & MỤC LỤC BỘ TÀI LIỆU CHUẨN DUY NHẤT (MASTER PRODUCTION BIBLE — ZERO REDUNDANCY)
## Dự án: **VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)**
**Mã tài liệu:** `00_MASTER_BIBLE_Tong_Hop_Tai_Lieu_Chuan_Trien_Khai_PO_Dev_Art_UI_QC.md`  
**Phiên bản:** Master Bible 7.0 (Đã rà soát, cắt bỏ 100% nội dung dư thừa/trùng lặp, đồng bộ **Lộ Trình 5 Giai Đoạn Chung Cho User & Dev Team** và tích hợp **Cơ Chế AI Tự Nhận Diện 16 Skills Chuyên Môn** vào quy trình 6 bước)  
**Đối tượng sử dụng:** Product Owner (PO), Game/Narrative Designer (GD), UI/UX Designer, Artist & Sound, Backend Dev (BE), Frontend Dev (FE), QA/QC Engineer & AI Coding Agents (ChatGPT, Claude, Antigravity)

---

## 1. BẢN ĐỒ HỆ THỐNG TÀI LIỆU CHUẨN DUY NHẤT SAU KHI HỢP NHẤT (`CLEAN DOCS MAP: 00 ➔ 10`)

Toàn bộ các tài liệu rời rạc hoặc trùng lặp trước đây đã được **gộp gọn vào đúng các file gốc tương ứng (`00` ➔ `10`)** và lưu trữ bản cũ tại `docs_archive_merged/`. Đội ngũ phát triển và AI chỉ cần làm việc trên bộ file chuẩn dưới đây:

| Mã Số | Tên File Chuẩn Trong Thư Mục Gốc | Nội Dung Cốt Lõi & Các File Đã Được Hợp Nhất Vào | Bộ Phận & AI Skills Sử Dụng Chính |
| :---: | :--- | :--- | :--- |
| **`00`** | `00_MASTER_BIBLE_Tong_Hop_Tai_Lieu_Chuan_Trien_Khai_PO_Dev_Art_UI_QC.md` | **Sổ Tay Tổng Chỉ Huy (File này):** Bản đồ điều hướng tài liệu `00 ➔ 10`, Ma trận 5 Giai đoạn & Bảng ánh xạ 6 Bộ phận với 16 AI Skills. | **Tất cả 6 Bộ phận & AI Agents** |
| **`01`** | `01_MASTER_GDD_Gameplay_Nong_Trai_3_Mien_Va_Cong_Dong.md` | **Đã gộp `01_MASTER_GDD` + `12_MASTER_NARRATIVE`:** Toàn bộ Gameplay Vườn – Ao – Chuồng (**155 thực thể**), 3 Miền, 6 Gia nhân Lán Thợ, **Cốt truyện 10 Chương phân nhánh (`EMP`/`PRAG`)**, Hồ sơ 10 NPC & 5 Tầng Nhiệm vụ. | **PO / GD** (`@game-designer`, `@narrative-designer`, `@level-designer`) |
| **`02`** | `02_MASTER_ECONOMY_Can_Bang_Kinh_Te_IAP_Va_Chong_Lam_Phat.md` | **Chuẩn Toán Học Kinh Tế (155 Thực thể):** Tỷ giá `1.000đ = 5💎`, 6 Van khóa chống lạm phát, Chi phí 4 tầng nuôi 6 Gia nhân, Bảng cân đối `Sources vs. Sinks`, 12 Tính năng Benchmark & 6 Gói IAP. | **PO / Economy** (`@economy-designer`, `@growth-hacker`) |
| **`03`** | `03_MASTER_TECH_Kien_Truc_Server_Realtime_Webgame_PWA.md` | **Đã gộp `03_MASTER_TECH` + `10_MASTER_AI_RULES`:** Kiến trúc Client (Phaser 3 + React 19 + Zustand), 9 Bảng Supabase SQL, 5 Hàm Atomic RPC (`FOR UPDATE`), Kênh Realtime & **12 Quy tắc Code Bất khả xâm phạm (`RULE C1 ➔ C12`)**. | **FE / BE Dev** (`@backend-architect`, `@frontend-developer`, `@code-reviewer`) |
| **`04`** | `04_MASTER_DATA_Bang_Thong_So_Kinh_Te_Toan_Game.csv` | **Dữ liệu gốc CSV:** Thông số kinh tế chi tiết (Đồng bộ với `src/data/masterData.ts` & bảng `public.master_catalog`). | **FE / BE / QC** (`@economy-designer`, `@backend-architect`) |
| **`05`** | `05_MASTER_ART_Pixel_Art_Direction_Va_Asset_Pipeline.md` | **Đã gộp `05_MASTER_ART` + `09_MASTER_ASSET_LIST`:** Bảng 64 màu 3 miền, Quy chuẩn Pixel `32x32` / `48x64`, Viền ấm `#3D2314`, Vòng lặp `8–12 frames`, Danh mục Sprite/VFX & **Âm thanh Ngũ Cung WebAudio**. | **Artist / Sound** (`@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d`, `@technical-artist`, `@game-audio-engineer`) |
| **`06`** | `06_MASTER_UI_UX_Wireframe_Va_Flow_Toan_Bo_Tinh_Nang.md` | **Chuẩn Thiết Kế UI/UX:** Sơ đồ luồng `0A Splash 4 bước ➔ 0B Cổng Xác Thực 4 Tabs ➔ 1 Chọn Quê ➔ 2 Main HUD 2-Thumb Landscape ➔ 3 Lán Thợ` & Quy tắc Safe-Area Mobile/iPad. | **UI/UX / FE** (`@ui-designer`, `@frontend-developer`) |
| **`07`** | `07_INTERACTIVE_WIREFRAME_VIEWER.html` | **Bản Mẫu HTML5 Wireframe Tương Tác:** Mở trên trình duyệt để bấm thử trực quan toàn bộ các màn hình và luồng tính năng. | **UI/UX / PO / FE / QC** (`@ui-designer`) |
| **`08`** | `08_MASTER_PLAN_Lo_Trinh_San_Xuat_DLC_Va_Quy_Trinh_AI_Supabase.md` | **Đã gộp `08_MASTER_PLAN` + `11_MASTER_WBS` + Lộ trình 5 Giai đoạn:** Kế hoạch phát triển đồng nhất **5 Giai Đoạn (`Giai đoạn 1` ➔ `Giai đoạn 5`)**, phân rã **10 Epics / 38 Modules** và giao việc chi tiết cho **6 Bộ phận** kèm **25 Test Cases QC**. | **PO / Tất cả 6 Bộ phận & AI** |
| **`09`** | `09_FACEBOOK_ROADMAP_POSTER.html` | **Công Cụ Xuất Ảnh Poster Lộ Trình 5 Giai Đoạn (`1920x1080 .PNG`):** Dùng để xuất ảnh truyền thông đăng Facebook/Fanpage khớp 100% với 5 giai đoạn trong `08_MASTER_PLAN`. | **PO / Marketing** (`@content-creator`, `@growth-hacker`) |
| **`10`** | `10_MASTER_AI_PLAYBOOK_Quy_Trinh_AI_Tu_Dong_Dung_Tung_Tinh_Nang.md` | **Quy Trình Chuẩn Cho AI (ChatGPT, Claude, Antigravity):** Khung tự động nhận diện **16 Skills Chuyên Môn** và thực thi từng tính năng một qua **6 Bước khép kín** (*Thiết kế ➔ Tạo Asset/SFX ➔ Code BE/Store ➔ Code UI/Scene ➔ Chạy Test QC ➔ Dừng chờ PO Duyệt*). | **PO / AI Agents (ChatGPT, Claude, Antigravity)** |

---

## 2. BẢNG ÁNH XẠ 6 BỘ PHẬN NHÂN SỰ VỚI 16 SKILLS CHUYÊN MÔN CỦA AI (`HUMAN ROLES <-> AI SKILLS MAPPING`)

Khi triển khai từng tính năng theo quy trình 6 bước trong `10_MASTER_AI_PLAYBOOK` và `08_MASTER_PLAN`, mỗi vị trí trong team đều có bộ **AI Skills chuyên môn tương ứng** tự động hỗ trợ:

| Vị Trí Trong Team (Human Role) | Bước Trong Vòng Lặp 6 Bước | Bộ AI Skills Tự Động Nhận Diện & Kích Hoạt | Nhiệm Vụ Cốt Lõi Được Thực Thi |
| :--- | :---: | :--- | :--- |
| **1. PO / Game, Economy & Narrative Designer** | **Bước 1 (Thiết kế)** & **Bước 6 (Duyệt)** | `@game-designer`, `@economy-designer`, `@narrative-designer`, `@level-designer`, `@growth-hacker`, `@content-creator` | Chốt cơ chế gameplay, công thức chống lạm phát, kịch bản 10 chương phân nhánh (`EMP`/`PRAG`), quy hoạch 25 phân khu và duyệt nghiệm thu. |
| **2. UI / UX Designer** | **Bước 1 (Flow)** & **Bước 4 (UI)** | `@ui-designer` | Thiết kế bố cục `2-Thumb Landscape HUD`, Splash 4 bước, Auth 4 Tabs và 11 Modal Gỗ/Tre/Giấy dó chuẩn Safe-Area. |
| **3. Artist, Animator & Sound Engineer** | **Bước 2 (Asset, VFX & Audio)** | `@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d`, `@technical-artist`, `@game-audio-engineer` | Tạo Sprite Pixel 64 màu (viền ấm `#3D2314`), animation `8–12 frames`, bản đồ 3 miền, Particle VFX và nhạc nền Ngũ cung WebAudio. |
| **4. Backend Engineer (BE)** | **Bước 3 (Database & RPC)** | `@backend-architect`, `@economy-designer` | Viết bảng PostgreSQL, Row Level Security (RLS), 5 hàm Atomic RPC (`FOR UPDATE`), Auth OTP và kênh Realtime `vac_online_global_hub`. |
| **5. Frontend Engineer (FE)** | **Bước 3 (Store)** & **Bước 4 (Scene/UI)** | `@frontend-developer`, `@ui-designer`, `@technical-artist` | Lập trình Phaser 3 `FarmScene.ts` (tách `Tap vs Drag > 12px`), React 19 `App.tsx`, Zustand `useGameStore.ts`, Offline PWA & Capacitor. |
| **6. QA / QC Engineer** | **Bước 5 (Kiểm thử & Audit)** | `@code-reviewer` | Kiểm toán mã nguồn (`npx tsc --noEmit` 0 lỗi), kiểm tra 12 Quy tắc bất khả xâm phạm (`RULE C1 ➔ C12`) và chạy tự động **25 Test Cases** trong `qcTestRunner.ts`. |

---

## 3. TÓM TẮT LỘ TRÌNH 5 GIAI ĐOẠN ĐỒNG NHẤT (DÙNG CHUNG CHO CẢ CÔNG BỐ USER & SPRINT DEV TEAM)

| Giai Đoạn | Tên Chủ Đề Công Bố User | Bản Build Dev | Trọng Tâm Triển Khai Của Đội Ngũ & AI (`40 Modules: M01.0 ➔ M10.3`) |
| :---: | :--- | :---: | :--- |
| **Giai Đoạn 1** | **🌱 Về Quê Lập Nghiệp** | `v1.0 Core MVP` *(14 Ngày)* | Hạ tầng Engine + Splash 4 bước + Cổng Xác thực 4 Tabs + Khởi tạo 3 Miền (`Bắc/Trung/Nam`) + Thời tiết động + Khai hoang 25 khu + Chuỗi **Vườn – Ao – Chuồng (81 loài)** + Vét Bùn Ao kích nổ Hoàng Kim `⭐` (`x3`) + **Chương 1–2**. |
| **Giai Đoạn 2** | **🍲 Bếp Quê & Lán Thợ** | `v1.2 Update 1` *(10 Ngày)* | Xây dựng **8 Xưởng Làng Nghề** + **Nồi Đất Phối Món Ngẫu Nhiên** + **27 Món Ăn 3 Miền** + **Lán Thợ Đồng Quê (6 Gia nhân `WORK_01..06`)** + Bàn Ăn Chung + 4 Đồ bảo hộ 72h + Giỏ Kho Thợ `120 ô` + **Lazy-Tick Offline** + **Chương 3, 6, 7**. |
| **Giai Đoạn 3** | **🚂 Chợ Phiên & Hàng Xóm** | `v1.5 Update 2` *(10 Ngày)* | Đơn **Hợp Tác Xã** + **Báo Chợ P2P 3 Miền** (`0.8x–2.0x`, thuế `10%`) + **Tàu Hỏa Bắc – Nam** + **Thương Lái Giá Sốt** + **Hái Trộm Vườn/Cá** (bảo hiểm `80%`) + **4 Lớp Phòng Thủ** (*Chó Phú Quốc* phạt `50🪙` + rớt *Dép Tổ Ong*) + **Cứu Trợ Sau Bão (`0⚡`)** + **Sổ Lưu Bút** + **Chương 4–5**. |
| **Giai Đoạn 4** | **🏮 Hội Làng & Thời Trang** | `v1.8 Update 3` *(10 Ngày)* | **Trùng Tu Đình Làng 3 Cấp** + **Miếu Thần Nông** + **Vườn Ươm Đột Biến (Pity 100%)** + **Rừng Trúc (`-6⚡`)** + **Đua Thuyền Rồng** + **Chợ Đêm (`x1.8`)** + **Gương Soi 12 Ô Thời Trang (`3➔1`, `Transmog`, Thi Duyên Dáng)** + **Lịch Bloc, Đập Niêu, Xổ Số 18h & IAP** + **Chương 8–9**. |
| **Giai Đoạn 5** | **💍 Lễ Cưới & Homestay** | `v2.0 Complete` *(10 Ngày)* | **Hẹn Hò 10 Tim ❤️ & Lễ Cưới Làng Quê** + **Bé Tiểu Đồng Gia Bảo** (`+30⚡` cơm sáng + `+10` nông sản/ngày) + **Khu Du Lịch Sinh Thái Homestay 2 Cấp** + **Xuất Ảnh Bằng Khen Điền Chủ (`.PNG`)** + Đóng gói Native App (`iOS/Android`) + **Chương 10**. |
