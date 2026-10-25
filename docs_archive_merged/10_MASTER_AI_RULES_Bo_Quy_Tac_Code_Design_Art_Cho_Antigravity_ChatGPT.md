# BỘ QUY TẮC CỐT LÕI (MASTER AI RULESET & SYSTEM PROMPTS) CHO ANTIGRAVITY, CHATGPT & CURSOR/CLAUDE
## Dự án: **HƯƠNG ĐỒNG GIÓ NỘI (NÔNG TRẠI BA MIỀN – VAC ONLINE)**
**Phiên bản:** Master Rules 4.0 (Hoàn thiện Quy tắc Mobile Landscape PWA, Capacitor iOS/Android/iPad, 140+ Thực thể, 6 Nhân Công & 12 Tính năng Benchmark)

---

## PHẦN 1: 6 NGUYÊN TẮC KIẾN TRÚC CODE, SUPABASE & MOBILE PWA / CAPACITOR (CODE & PLATFORM RULES)
1. **RULE C1 – Tech Stack Cố Định:** `Vite` + `React 19` (Floating HUD Overlay) + `Phaser 3` (Full-Screen 2D Pixel Canvas) + `TypeScript` (Strict Mode, cấm dùng `any`) + `Tailwind CSS` + `Zustand` + `Supabase` + `CapacitorJS` (đóng gói iOS / Android / iPadOS).
2. **RULE C2 – 100% Data-Driven:** Mọi thông số của **140+ thực thể** (48 cây trồng & cây đột biến, 19 vật nuôi, 19 thủy sản, 30+ món ăn/đồ bảo hộ thợ, 6 nhân công `WORK_01..06`, 12 tính năng Benchmark `BM_*` & `NEW_*`) phải đọc từ `04_MASTER_DATA_Bang_Thong_So_Kinh_Te_Toan_Game.csv` / `masterData.ts`, tuyệt đối không hardcode.
3. **RULE C3 – Chống Gian Lận Bằng Supabase RPC:** Client chỉ được `SELECT`. Mọi thay đổi về `gold`, `gems`, `stamina`, `inventories`, `hired_workers`, `market_listings`, `trader_booms`, `steal` bắt buộc gọi qua hàm **PostgreSQL RPC (`SECURITY DEFINER`)** có khóa dòng `FOR UPDATE`.
4. **RULE C4 – Đồng Hồ Server & Lazy Worker Evaluation:** Lưu mốc hoàn thành `mature_at` và `contract_expires_at` chuẩn UTC trên Supabase. Khi mở nông trại, tính sản lượng Nhân công đã thu hoạch trong lúc Offline và cất vào **Giỏ Kho Lán Thợ (`worker_pantry_items`)**.
5. **RULE C5 – Tách Biệt Render 60 FPS:** Phaser 3 vẽ Bản đồ, Cây cối, Vật nuôi, 6 Nhân công đi làm việc; React vẽ toàn bộ Floating HUD & cửa sổ Modal Gỗ/Tre/Giấy Dó.
6. **RULE C6 – Chuẩn Responsive Mobile Landscape PWA & iOS/Android/iPad (BẮT BUỘC):**
   * **Full-Bleed Landscape Viewport (`100dvw x 100dvh`):** Canvas Phaser 3 phải phủ kín 100% màn hình (`fixed inset-0 z-0`, `Phaser.Scale.ENVELOP` + Camera Drag-to-Pan & Zoom `➕/🎯/➖`) để không bao giờ bị viền đen trên cả điện thoại dài (`19.5:9`, `20:9`) lẫn iPad (`4:3`).
   * **Floating 2-Thumb HUD & Safe-Area Insets:** Tuyệt đối không dùng thanh Header/Footer đặc chiếm mất chiều dọc màn hình ngang điện thoại. Toàn bộ HUD phải nổi (`fixed`), áp dụng `env(safe-area-inset-top/bottom/left/right)` tránh tai thỏ/Dynamic Island, chia rõ **Vùng Ngón Cái Trái** (Khay hạt giống thu gọn, Giỏ kho thợ, Chat) và **Vùng Ngón Cái Phải** (6 nút tính năng chính + Zoom), kích thước vùng chạm tối thiểu `>= 38–44px`.
   * **Portrait Prompt & Native Readiness:** Có màn hình nhắc xoay ngang thông minh trên điện thoại cầm dọc (kèm nút bật Fullscreen khóa ngang và nút bỏ qua), cấu hình sẵn `public/manifest.webmanifest`, `public/sw.js` và `capacitor.config.ts`.

---

## PHẦN 2: 7 NGUYÊN TẮC THIẾT KẾ GAME, THUÊ NHÂN CÔNG, BENCHMARK & CHỐNG LẠM PHÁT (DESIGN & ECONOMY RULES)
1. **RULE D1 – Năng Lượng Kép (Hybrid Stamina):** Thao tác sản xuất cơ bản tại nhà tốn `0 ⚡`; thao tác khai hoang, vét bùn ao (`-3 ⚡`), câu cá tay (`-3 ⚡`), đi trộm (`-1~2 ⚡`) và **Thám hiểm Rừng Trúc & Bãi Bồi (`-5~12 ⚡`)** tốn `⚡ Stamina`.
2. **RULE D2 – Tuần Hoàn Sinh Thái VAC:** Vườn $\rightarrow$ Chuồng (Phân Hữu Cơ/Kén Tơ) $\rightarrow$ Ao (Vét Bùn Phù Sa) $\rightarrow$ Bón ngược lại cho Cây ăn quả lâu năm (+2 quả & 30% nổ Hoàng Kim ⭐).
3. **RULE D3 – Quy Tắc Hệ Thống Thuê Nhân Công ("Lán Thợ Đồng Quê" – Mở Từ Level 14+):** 6 nhân công (`WORK_01..06`) với 4 vòng lặp tiêu tiền (Lương Xu, Nuôi cơm Bàn Ăn Lán Thợ, Áo quần bảo hộ độ bền 72h, Phụ cấp ngày mùa) và **chờ 5 phút sau khi cây chín mới thu** (chừa phút 3–5 cho bạn bè rình trộm!).
4. **RULE D4 – Quy Tắc 12 Tính Năng Benchmark & Đột Phá Mới:** Thương Lái Đột Xuất (`1.5x–3.0x`, hoa hồng chủ nhà `+5%`), Vườn Ươm Đột Biến (có Pity), Trùng Tu Đình Làng 3 cấp (`+5% sản lượng vĩnh viễn`), Miếu Thần Nông, Đua Thuyền Rồng, Thi Thời Trang, Homestay, Rừng Trúc, Chợ Đêm Cuối Tuần (`1.8x giá`, 0% thuế), Sổ Lưu Bút, Cứu Trợ Sau Bão, Lễ Cưới & Gia Bảo Truyền Đời.
5. **RULE D5 – Độc Quyền 10 Bậc Đặc Sản 3 Miền.**
6. **RULE D6 – Bảo Hiểm Đi Trộm 80% & Zero-Sum Penalty (`Dép Tổ Ong`).**
7. **RULE D7 – Khóa Van Chống Lạm Phát (`1.000 VNĐ = 5 💎`, Khung giá Chợ `0.8x–2.0x`, Thuế Chợ `10%`).**

---

## PHẦN 3: 5 NGUYÊN TẮC PIXEL ART & ANIMATION ĐA KHUNG HÌNH (`8 – 12 FRAMES SEAMLESS`)
1. **RULE A1 – Góc Nhìn & Lưới Chuẩn:** `3/4 Top-Down Oblique`, ô lưới `32x32 px`, nhân vật & nhân công `48x64` / `64x64 px`.
2. **RULE A2 – Viền Màu Ấm:** Dùng `Selective Colored Outline (#3D2314)`, cấm dùng viền đen tuyền `#000000`.
3. **RULE A3 – Thế Giới Sống Động 100% (Zero Static Elements):** Mọi cây cối, lúa, mặt nước ao, vật nuôi, 6 Nhân công đều có chuyển động lệch pha (`Phase Offset`).
4. **RULE A4 – Khép Vòng Không Giật (`0° -> 315°`).**
5. **RULE A5 – Phản Hồi Xúc Giác 3 Lớp (`Squash & Stretch` + `Particle Burst` + `Toast/Parabol`).**
