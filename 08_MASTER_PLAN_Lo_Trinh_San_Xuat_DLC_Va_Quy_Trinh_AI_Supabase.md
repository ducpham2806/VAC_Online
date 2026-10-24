# TÀI LIỆU KẾ HOẠCH SẢN XUẤT TỔNG THỂ & CHI TIẾT (MASTER MACRO/MICRO PRODUCTION PLAN & DLC ROADMAP)
## Dự án: **HƯƠNG ĐỒNG GIÓ NỘI (NÔNG TRẠI BA MIỀN – VAC ONLINE)**
**Phiên bản:** Master Plan 3.0 (Phân bổ Toàn bộ 140+ Thực thể, 6 Nhân Công Lán Thợ & 12 Tính năng Benchmark/Mới vào Lộ trình 6 Giai đoạn)  
**Thực hiện bởi:** `@game-designer` & `@backend-architect`

---

## PHẦN 1: MACRO PLAN – CHIẾN LƯỢC CHIA NHỎ SẢN PHẨM (2 PHASE CỐT LÕI + 4 BẢN CẬP NHẬT DLC)

Toàn bộ 140+ thực thể và 12 tính năng lớn được phân bổ khoa học vào **6 Cột Mốc Độc Lập** để không bị quá tải khi phát triển:

| Giai Đoạn / Phiên Bản | Mục Tiêu Sản Phẩm | Tính Năng, Nhân Công & Benchmark Mở Khóa | Phân Bổ Thực Thể (Trong 140+ Items) | Thời Gian (Với AI) |
| :--- | :--- | :--- | :--- | :---: |
| **PHASE 0: Foundation (`v0.1`)** | Dựng khung Vite + Phaser 3 + React + Supabase | • Đăng nhập Supabase Auth, lưới `32x32 px`<br>• Đọc dữ liệu từ `04_MASTER_DATA.csv`. | 1 Tileset cơ bản, 1 Nhân vật gốc Nam/Nữ, Khung UI Gỗ/Tre. | **3 – 4 Ngày** |
| **PHASE 1: Core MVP (`v1.0 - Ra mắt!`)** | Chơi mượt vòng lặp VAC tự tay & Bếp Quê ngẫu nhiên | • Chọn Nam/Nữ & 3 vùng quê<br>• Vòng lặp Vườn – Ao – Chuồng + Vét bùn ao<br>• Bếp củi (**Nấu Ngẫu Nhiên!**), Đơn Hợp Tác Xã, Nhiệm vụ Chương 1–2 & **7 Ngày Tân Thủ**<br>• **Miếu Thần Nông / Ông Địa (`BM_TOTEM_01..04` - Rút xăm đầu ngày)** & **Thời Tiết Động**. | • **12 Cây cơ bản** (`CROP_01..12`), **2 Cây ăn trái** (Đu đủ, Dừa)<br>• **4 Vật nuôi** (Gà, Cút, Vịt, Heo)<br>• **4 Thủy sản** (Cá rô, Tép, Cua ốc, Cá chép)<br>• **3 Nhà máy** (Cối xay, Bếp củi, Lò đậu). | **10 – 14 Ngày** |
| **DLC 1: "Họp Chợ Ba Miền & Lán Thợ Khởi Đầu" (`v1.2`)** | Kinh tế Liên vùng, Thương Lái Giá Cao & **Lán Thợ (3 Nhân công đầu)** | • Mở **Báo Chợ Phiên P2P (Thuế 10%)**, **Ga Tàu Thống Nhất** & **Thương Lái Đột Xuất (`BM_BOOM_01` - 09h/20h giá x1.5–x3.0)**<br>• **Mở Lán Thợ Đồng Quê (Lv 14–18):** Thuê **Chú Tư Cày**, **Cô Năm Thảo**, **Anh Sáu Kình** + Nuôi cơm & Cấp phát Nón lá / Áo nâu / Áo tơi<br>• Mở **Thám Hiểm Rừng Trúc & Bãi Bồi (`NEW_EXP_01` - Đốt ⚡)**. | • Mở **15 Cây Đặc sản 3 Miền** & **10 Cây nâng cao** (Sen, Dưa hấu, Xoài, Mít, Tre trúc)<br>• Mở **Nuôi Tằm dệt vải**, Bò sữa, Cá trắm, Cá tra<br>• Thêm 3 Máy: *Quán Nước, Quầy Bún Phở, Lò Đan Lát*. | **8 – 10 Ngày** |
| **DLC 2: "Đạo Chích Làng Quê & Đình Làng" (`v1.5`)** | Bùng nổ tương tác cộng đồng: Đi trộm, Cứu trợ bão, Đình Làng & Đua Thuyền | • Mở **Thăm Nhà**, **Cột Mốc Check-in & Sổ Lưu Bút (`NEW_GUEST_01`)**, **Cứu Trợ Sau Mưa Bão (`NEW_RELIEF_01`)**<br>• Mở **Hái Trộm Vườn & Câu Trộm Cá** (Nhân công chừa 2 phút cửa sổ vàng!) + **4 Lớp Phòng Thủ (Chó Phú Quốc, Ngỗng, Bù nhìn, Bẫy)** & Đổi **Dép Tổ Ong**<br>• Mở **Trùng Tu Đình Làng (`BM_DINH_01..03`)**, **Đua Thuyền Rồng Cuối Tuần (`BM_DERBY_01`)**, **Loa Phường** & **Chat 5 Kênh**. | • Animation đi rón rén & bị Chó rượt<br>• Chó Phú Quốc, Mèo Tam Thể, Ngỗng Trời, Trâu Đen, Chim Sáo Đen biết nói<br>• Công trình Đình Làng 3 cấp & Thuyền Rồng. | **8 – 10 Ngày** |
| **DLC 3: "Lụa Là, Vận May & Chợ Đêm" (`v1.8`)** | Cỗ máy kiếm tiền: Thời trang 12 Slots, Gacha, Vé Số 18:00, Chợ Đêm & 3 Thợ VIP | • Mở **3 Nhân công Cao cấp (Lv 20–25):** **Dì Bảy Bếp**, **Chú Tám Mộc**, **Ông Quản Gia Cửu**<br>• Mở **Khung Nhân Vật 12 Slots Thời Trang + Transmog**, **Rơi đồ RNG**, **Khâu Ghép 3->1** & **Hội Thi Duyên Dáng Làng Quê (`BM_FASHION_01`)**<br>• Mở **Vườn Ươm Đột Biến (`CROP_MUT_01..03`)**, **Chợ Đêm Ẩm Thực Cuối Tuần (`NEW_NIGHT_01`)**, **Lịch Bloc**, **Đập Niêu Gacha**, **Xổ Số 18:00** & **6 Gói IAP**. | • Mở *Khung Cửi Dệt Lụa (`MAC_08`)* & *Xưởng Đồ Khô (`MAC_06`)*<br>• Nuôi Trai ngậm ngọc, Lợn bản, Hươu sao, Chim yến, Rươi, Tôm hùm, Cua Cà Mau, 3 Giống Đột Biến<br>• 40+ món Thời trang 12 Slots. | **10 – 12 Ngày** |
| **DLC 4: "Đời Sống Tri Kỷ & Gia Bảo" (`v2.0 - Mobile App`)** | End-game Meta: Kết hôn, Con cái truyền nghề, Homestay & Lên iOS/Android | • Mở **8 Nhóm Side Quests Chống Lặp** & **Tủ Kính Cổ Vật**<br>• Mở **Hẹn hò 10 Tim, Lễ Cưới Quê & Truyền Nghề Con Cái (`NEW_HEIR_01`)**<br>• Mở **Khu Du Lịch Sinh Thái Homestay (`BM_HOME_01..02`)** & đóng gói **CapacitorJS lên App Store / Google Play**. | • Cây Cau Trầu, Cá Koi ngũ sắc<br>• 3 NPC Hẹn hò + Trang phục Cưới, Tiểu Đồng (Con cái), Đảo Homestay 2 cấp. | **10 – 14 Ngày** |

---

## PHẦN 2: QUY TRÌNH 7 BƯỚC LÀM GAME VỚI AI (ANTIGRAVITY + CHATGPT + SUPABASE + VERCEL)
1. **Bước 1 – Data Spec:** Biên dịch `04_MASTER_DATA_Bang_Thong_So_Kinh_Te_Toan_Game.csv` (140+ dòng) thành `src/config/gameCatalog.json`.
2. **Bước 2 – Database & RPC (Supabase):** Chạy file SQL trong `03_MASTER_TECH` tạo bảng và các hàm RPC chống gian lận.
3. **Bước 3 – Tạo & Chuẩn hóa Pixel Art Tự động:** Tạo Sprite trên nền `#FF00FF`, chạy script Node.js tách nền và ép về đúng lưới `32x32` / `64x64 px` với bảng 64 màu chuẩn.
4. **Bước 4 – Animation 8–12 Frames & Shaders:** Kết hợp Sprite Sheet 8–12 frames nối vòng lặp không giật với `Wind Sway Shader`, `Water Shimmer Shader` và `Particle Emitters`.
5. **Bước 5 – Giao diện React Overlay:** Xây dựng các cửa sổ Modal Gỗ/Tre/Giấy Dó theo đúng `07_INTERACTIVE_WIREFRAME_VIEWER.html`.
6. **Bước 6 – QA với Dev Cheat Panel:** Dùng nút **[⏩ Tua nhanh x60]** kiểm tra toàn bộ vòng lặp kinh tế.
7. **Bước 7 – Deploy Vercel / Netlify PWA:** Tự động build và bật Service Worker Offline Cache.
