# SỔ TAY TỔNG CHỈ HUY & MỤC LỤC BỘ 8 TÀI LIỆU CHUẨN DUY NHẤT (MASTER PRODUCTION BIBLE — ZERO REDUNDANCY)
## Dự án: **VAC ONLINE — HƯƠNG ĐỒNG GIÓ NỘI (GAME NÔNG TRẠI 3 MIỀN VIỆT NAM)**
**Mã tài liệu:** `00_MASTER_BIBLE_Tong_Hop_Tai_Lieu_Chuan_Trien_Khai_PO_Dev_Art_UI_QC.md`  
**Phiên bản:** Master Bible 5.0 (Đã rà soát, cắt bỏ 100% nội dung trùng lặp và gộp gọn từ 13 file xuống **Bộ 8 Tài Liệu Chuẩn Duy Nhất `00` ➔ `08`**)  
**Đối tượng sử dụng:** Product Owner (PO), Frontend Dev (FE), Backend Dev (BE), Artist & Sound, UI/UX Designer, QA/QC Engineer

---

## 1. BẢN ĐỒ HỆ THỐNG 8 TÀI LIỆU CHUẨN DUY NHẤT SAU KHI HỢP NHẤT (`CLEAN DOCS MAP`)

Toàn bộ các file trùng lặp cũ (`09`, `10`, `11`, `12`) đã được hợp nhất vào đúng các file gốc tương ứng và chuyển bản lưu cũ vào thư mục `docs_archive_merged/` để thư mục gốc dự án hoàn toàn sạch sẽ, nhất quán 100%:

| Mã Số | Tên File Chuẩn Trong Thư Mục Gốc | Các File Đã Được Gộp Vào & Loại Bỏ Trùng Lặp | Bộ Phận Sử Dụng Chính |
| :---: | :--- | :--- | :--- |
| **`00`** | `00_MASTER_BIBLE_Tong_Hop_Tai_Lieu_Chuan_Trien_Khai_PO_Dev_Art_UI_QC.md` | **File Tổng Chỉ Huy (File này):** Bản đồ tra cứu nhanh & Checklist bàn giao cho 6 bộ phận. | **Tất cả 6 Bộ phận** |
| **`01`** | `01_MASTER_GDD_Gameplay_Nong_Trai_3_Mien_Va_Cong_Dong.md` | **Đã gộp `01_MASTER_GDD` + `12_MASTER_NARRATIVE`:** Toàn bộ Gameplay Vườn – Ao – Chuồng (155 thực thể), 3 Miền, 6 Nhân công Lán Thợ, **Cốt truyện 10 Chương phân nhánh (`EMP`/`PRAG`)**, Hồ sơ 10 NPC & 5 Tầng Nhiệm vụ. | **PO / Game Designer / Narrative / FE** |
| **`02`** | `02_MASTER_ECONOMY_Can_Bang_Kinh_Te_IAP_Va_Chong_Lam_Phat.md` | **Chuẩn Toán Học Kinh Tế:** Tỷ giá `1.000đ = 5💎`, 6 Van khóa chống lạm phát, Chi phí 4 tầng nuôi 6 Nhân công, Bảng cân đối `Sources vs. Sinks` & 6 Gói IAP. | **PO / Economy Designer / BE / QC** |
| **`03`** | `03_MASTER_TECH_Kien_Truc_Server_Realtime_Webgame_PWA.md` | **Đã gộp `03_MASTER_TECH` + `10_MASTER_AI_RULES`:** Kiến trúc Phia Client (Phaser 3 + React 19 + Zustand), 9 Bảng Supabase SQL, 5 Hàm Atomic RPC, Kênh Realtime & **12 Quy tắc Code Bất khả xâm phạm**. | **FE Dev / BE Dev / Tech Lead** |
| **`04`** | `04_MASTER_DATA_Bang_Thong_So_Kinh_Te_Toan_Game.csv` | **Dữ liệu gốc CSV:** Thông số kinh tế từng dòng của thực thể (Đồng bộ với `src/data/masterData.ts` & bảng `public.master_catalog`). | **FE Dev / BE Dev / QC** |
| **`05`** | `05_MASTER_ART_Pixel_Art_Direction_Va_Asset_Pipeline.md` | **Đã gộp `05_MASTER_ART` + `09_MASTER_ASSET_LIST`:** Bảng 64 màu 3 miền, Quy chuẩn Pixel `32x32` / `48x64`, Viền ấm `#3d2314`, Vòng lặp `8–12 frames`, Danh mục Sprite/VFX & **Âm thanh Ngũ Cung WebAudio**. | **Artist / Animator / Sound / FE** |
| **`06`** | `06_MASTER_UI_UX_Wireframe_Va_Flow_Toan_Bo_Tinh_Nang.md` | **Chuẩn Thiết Kế UI/UX:** Sơ đồ luồng `0A Splash 4 bước ➔ 0B Cổng Xác Thực 4 Tabs ➔ 1 Chọn Quê ➔ 2 Main HUD 2-Thumb Landscape` & Quy tắc Safe-Area Mobile/iPad. | **UI/UX Designer / FE Dev** |
| **`07`** | `07_INTERACTIVE_WIREFRAME_VIEWER.html` | **Bản Mẫu HTML5 Tương Tác Trực Quan:** Mở trực tiếp trên trình duyệt để bấm thử toàn bộ 10 Tab màn hình từ Splash/Auth đến Lán Thợ, Bếp Quê, Chợ & Đi Trộm. | **UI/UX / PO / FE Dev / QC** |
| **`08`** | `08_MASTER_PLAN_Lo_Trinh_San_Xuat_DLC_Va_Quy_Trinh_AI_Supabase.md` | **Đã gộp `08_MASTER_PLAN` + `11_MASTER_WBS`:** Kế hoạch phát triển chi tiết qua **6 Giai đoạn (`Phase 0` ➔ `DLC 4 v2.0`)**, có bảng so sánh với kế hoạch cũ và phân giao từng đầu việc cho **6 Bộ phận** kèm **25 Test Cases QC**. | **PO / Tất cả 6 Bộ phận** |

---

## 2. HƯỚNG DẪN TRA CỨU NHANH THEO VỊ TRÍ CHUYÊN MÔN (`ROLE QUICK-START`)

1. **Product Owner (PO) & Game/Narrative Designer:**
   * Đọc **`01_MASTER_GDD`** (Gameplay + Cốt truyện 10 chương), **`02_MASTER_ECONOMY`** (Cân bằng tiền tệ & IAP) và **`08_MASTER_PLAN`** (Tiến độ 6 giai đoạn).
2. **Frontend Engineer (FE - Phaser 3 / React 19 / Zustand):**
   * Đọc **`03_MASTER_TECH`** (Cấu trúc thư mục & 12 Quy tắc Code), **`06_MASTER_UI_UX`** (Luồng màn hình) và đối chiếu tiến độ từng giai đoạn trong **`08_MASTER_PLAN`**.
3. **Backend Engineer (BE - Supabase PostgreSQL / Realtime):**
   * Đọc **`03_MASTER_TECH`** (Phần 2: 9 Bảng SQL, RLS & 5 Hàm Atomic RPC) và chạy 2 file trong `supabase/migrations/0001_*.sql` & `0002_*.sql`.
4. **Technical Artist, Animator & Sound Engineer:**
   * Đọc duy nhất **`05_MASTER_ART`** (Đã tích hợp trọn vẹn bảng màu, kích thước Sprite, quy tắc 8–12 frames, VFX và nhạc nền Ngũ Cung).
5. **UI/UX Designer:**
   * Đọc **`06_MASTER_UI_UX`** và mở trực tiếp **`07_INTERACTIVE_WIREFRAME_VIEWER.html`** trên trình duyệt.
6. **QA / QC Engineer:**
   * Đọc cột **QA/QC** trong **`08_MASTER_PLAN`** và bấm nút **`🧪 QC Test (25 TC)`** ở góc phải dưới màn hình game để chạy tự động 25 kịch bản kiểm thử biên.
