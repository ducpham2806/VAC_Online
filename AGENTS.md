# 🌾 AGENTS.MD — QUY TẮC CỐT LÕI & CƠ CHẾ TỰ ĐỘNG KÍCH HOẠT SKILL TRONG VÒNG LẶP 6 BƯỚC ("HƯƠNG ĐỒNG GIÓ NỘI - VAC ONLINE")

Tài liệu này được nạp tự động cho các AI Coding Agents (**Antigravity, Claude, ChatGPT, Cursor, Windsurf**) khi làm việc trong kho mã nguồn dự án.

## 1. Bản Đồ Bộ Tài Liệu Chuẩn Duy Nhất (`00` ➔ `10`)
Trước khi thực hiện bất kỳ thay đổi nào, AI phải tham chiếu bộ tài liệu chuẩn tại thư mục gốc:
* `00_MASTER_BIBLE_Tong_Hop_Tai_Lieu_Chuan_Trien_Khai_PO_Dev_Art_UI_QC.md`: Sổ tay tổng chỉ huy, điều hướng tài liệu & ánh xạ 6 Bộ phận với 16 AI Skills.
* `01_MASTER_GDD_Gameplay_Nong_Trai_3_Mien_Va_Cong_Dong.md`: Gameplay Vườn – Ao – Chuồng (155 thực thể), 3 Miền, 6 Gia nhân & Cốt truyện 10 Chương phân nhánh (`EMP`/`PRAG`).
* `02_MASTER_ECONOMY_Can_Bang_Kinh_Te_IAP_Va_Chong_Lam_Phat.md`: Toán học kinh tế, 6 van chống lạm phát, chi phí 4 tầng nuôi thợ & 6 gói IAP.
* `03_MASTER_TECH_Kien_Truc_Server_Realtime_Webgame_PWA.md`: Kiến trúc Phaser 3 + React 19 + Supabase SQL/RPC & **12 Quy tắc Code Bất khả xâm phạm (`RULE C1 ➔ C12`)**.
* `04_MASTER_DATA_Bang_Thong_So_Kinh_Te_Toan_Game.csv`: Dữ liệu thông số kinh tế gốc (155 thực thể).
* `05_MASTER_ART_Pixel_Art_Direction_Va_Asset_Pipeline.md`: Quy chuẩn Pixel Art 64 màu, viền ấm `#3D2314`, animation 8–12 frames & WebAudio Ngũ cung.
* `06_MASTER_UI_UX_Wireframe_Va_Flow_Toan_Bo_Tinh_Nang.md` & `07_INTERACTIVE_WIREFRAME_VIEWER.html`: Wireframe Splash 4 bước, Auth 4 Tabs, 2-Thumb Landscape HUD & Lán Thợ.
* `08_MASTER_PLAN_Lo_Trinh_San_Xuat_DLC_Va_Quy_Trinh_AI_Supabase.md` & `09_FACEBOOK_ROADMAP_POSTER.html`: Lộ trình 5 Giai đoạn đồng nhất (Public & Dev) và phân công 6 vị trí.
* **`10_MASTER_AI_PLAYBOOK_Quy_Trinh_AI_Tu_Dong_Dung_Tung_Tinh_Nang.md`: Quy trình 6 bước khép kín có tích hợp Tự Nhận Diện & Kích Hoạt 16 Skills Chuyên Môn cho từng Module `M01.0` ➔ `M10.3`.**

## 2. Quy Trình 6 Bước Khép Kín Kèm Tự Nhận Diện Skill (`Auto-Skill Routing Loop`)
Khi được yêu cầu làm một tính năng (`Module Mxx.y`), AI **BẮT BUỘC** tự động nhận diện và kích hoạt các Skill liên quan theo từng bước trong `10_MASTER_AI_PLAYBOOK_Quy_Trinh_AI_Tu_Dong_Dung_Tung_Tinh_Nang.md`:
1. **Bước 1 — Thiết kế & Chốt Spec (`@game-designer`, `@economy-designer`, `@narrative-designer`, `@level-designer`):** Đọc `01`, `02`, `04`, `06` để chốt thông số, công thức toán học chống lạm phát, thoại phân nhánh và trường hợp biên.
2. **Bước 2 — Tạo Asset, Bản đồ, VFX & Âm thanh (`@generate2dsprite`, `@video2dsprite`, `@generate2dmap`, `@codeart2d`, `@technical-artist`, `@game-audio-engineer`):** Cập nhật Sprite/Texture trong `src/game/assets/PixelAssetGenerator.ts` (viền ấm `#3D2314`, không dùng `#000000`), Particle VFX trong `FarmScene.ts` và SFX trong `src/services/soundEffects.ts`.
3. **Bước 3 — Code Backend & Store (`@backend-architect`, `@economy-designer`):** Cập nhật SQL/RPC (`FOR UPDATE`) trong `supabase/migrations/`, Types trong `src/data/types.ts` (không dùng `any`) và Action trong `src/store/useGameStore.ts` (chống âm tiền/năng lượng, khóa trần chỉ số, lọc XSS, có fallback Local Vault).
4. **Bước 4 — Code Giao diện 2-Thumb Landscape (`@ui-designer`, `@frontend-developer`):** Cập nhật `FarmScene.ts` (tách biệt `Tap` vs `Drag > 12px`) và `src/App.tsx` (`.touch-btn >= 38–44px`, `safe-area-inset-*`, không dùng `window.alert`).
5. **Bước 5 — Tự kiểm thử & Audit (`@code-reviewer`):** Chạy `npx tsc --noEmit` (`0 errors`) và thêm/chạy Test Case tự động trong `src/services/qcTestRunner.ts` đạt `100% PASS`.
6. **Bước 6 — Trình duyệt & Dừng chờ lệnh (`@growth-hacker`, `@content-creator`):** Xuất **Phiếu Nghiệm Thu Tính Năng** (ghi rõ các Skill đã kích hoạt) và **dừng lại chờ Chủ dự án duyệt (`Approval Gate`)** trước khi chuyển sang tính năng tiếp theo.
