# AGENTS.md — Quy tắc bắt buộc cho AI & dev (Hương Đồng Gió Nội – VAC Online)

Bản rút gọn (2026-11-03). Bản đầy đủ cũ: `docs_archive_merged/AGENTS_v9.3_ban_day_du.md` (không cần đọc đầu phiên).

## 0. Hai quy tắc tối thượng

### RULE D0 — Đối chiếu chéo & không trùng lặp
1. **Đối chiếu:** số liệu và tên phải khớp giữa `00`→`17`, `AGENTS.md` và code: 6 Giai đoạn, 11 Epics, 52 Modules `M01.0`→`M11.6`, `GAME_CATALOG` (số hiện tại: `17` mục A1), 81 loài V-A-C mở theo 5 Đợt `23→45→63→76→81`, 17 AI Skills. Hiện trạng thật chỉ tin `17`.
2. **Không trùng lặp:** tính năng mới giao thoa phần cũ thì gộp vào một hệ thống, xóa phần rời. Mỗi chủ đề chỉ viết đầy đủ ở một nơi, nơi khác dẫn link:
   | Chủ đề | Nguồn duy nhất |
   |---|---|
   | Gameplay, cốt truyện, 5 Đợt V-A-C, luật chơi | `01_MASTER_GDD` |
   | Công thức, giá, thuế, trần, Sources/Sinks | `02_MASTER_ECONOMY` + `04_MASTER_DATA.csv` |
   | DB, RPC, netcode, `IHyperCasualCartridge`, RULE C1–C14 | `03_MASTER_TECH` |
   | Màu, sprite, animation, âm thanh | `05_MASTER_ART` |
   | Luồng & wireframe | `06_MASTER_UI_UX` + `07_…html` |
   | Lộ trình 6 GĐ, cổng kiểm soát, LiveOps | `08_MASTER_PLAN` + `10_MASTER_AI_PLAYBOOK` |
   | Triển khai từng GĐ | `11`→`16` |
   | Hiện trạng code, sprint, trạng thái module | `17_PROJECT_AUDIT` |
3. **Gốc gọn:** chỉ giữ `00`→`17`, `README.md`, `AGENTS.md`, `VIEC_CAN_LAM.md`; file gộp/cũ chuyển vào `docs_archive_merged/`.

### RULE D1 — Giữ hướng game, không phá cái cũ, cảnh báo sớm
1. **Core gameplay:** trung tâm là Vườn–Ao–Chuồng 3 miền (70% chung / 30% độc quyền), 5 Đợt theo 10 Chương Gia Phả, năng lượng Bát Cơm `⚡` (`0⚡` cho trồng/thu/tưới tại nhà và Sảnh Chung; PK `-5⚡`/trận). PK, Loạn Chiến, Máy Thùng, Lễ hội chỉ bổ trợ, không phá kinh tế nông trại (trần Hyper-Casual ≤ 1.500 🏮 Xu Hội Làng/ngày, thuế Sới Đình 10% zero-sum).
2. **Art & UI:** theo `05`/`06` — 64 màu, góc 3/4 top-down, lưới 32×32 (ô đất 168×80), viền ấm `#3D2314` (cấm `#000000`), 8–12 frame; chất liệu gỗ/tre/giấy dó, HUD 2 ngón cầm ngang, `.touch-btn` ≥ 38–44px, `safe-area-inset-*`.
3. **Code:** TypeScript strict, 0 `any`, data-driven từ `GAME_CATALOG` (`src/data/masterData.ts`). Không đổi chữ ký hàm, state hay luồng đang chạy ổn.
4. **Database additive-only:** chỉ `CREATE … IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS … DEFAULT`, `CREATE OR REPLACE`. Cấm `DROP TABLE/COLUMN`, đổi tên cột đang dùng, đổi ID thực thể (`CROP_ ANI_ AQUA_ PROD_ MAC_ WORK_ PET_ FASH_ BM_ NEW_ CRAFT_ IAP_ DEF_ TRAP_`). `localStorage` cũng phải tương thích ngược.
5. **Impact report ở Bước 1:** trước khi code/vẽ, ghi 5 dòng: Core VAC / Kinh tế / Art & UI / Code cũ / Database. **Đụng DB, kinh tế hoặc core loop → báo PO và dừng chờ duyệt.**

## 1. Tài liệu
`00` Bible (mục lục đầy đủ) · `01` GDD · `02` Kinh tế · `03` Kỹ thuật · `04` CSV dữ liệu · `05` Art · `06`/`07` UI/UX · `08`/`09` Lộ trình · `10` AI Playbook · `11`→`16` Kế hoạch GĐ1→GĐ6 · `17` Hiện trạng & sprint. File > 30 KB đọc theo đoạn (hook `read-guard`).

## 1.5. Làm việc hằng ngày
- **Danh sách việc duy nhất: `VIEC_CAN_LAM.md`** — chỉ giữ việc còn mở + vài dòng nhật ký gần nhất. Việc xong và nhật ký cũ **chuyển** sang `docs_archive_merged/VIEC_CAN_LAM_LUU_TRU.md` (không xóa hẳn).
- **🚨 Ghi nhật ký (bắt buộc):** mọi việc AI làm xong hoặc làm dở (code, migration, áp DB thật, tài liệu, kiểm tra, quyết định PO) ghi ngay vào mục F của `VIEC_CAN_LAM.md` **trước khi báo xong**: ngày — việc — file/commit — kết quả kiểm tra — còn dở / dừng ở đâu.
- **Hiện trạng:** luật chung ở `src/domain/` có bản sao SQL trên server — sửa luật thì sửa cả migration mới. Giai đoạn đang mở do `src/config/features.ts` + `app_config` quyết định. Mọi thay đổi DB qua `supabase/migrations/NNNN_*.sql`.
- **Kiểm tra trước khi bàn giao:** `npm run typecheck && npm test && npm run build`, thêm `npm run test:sql` khi đụng `supabase/` (CI chạy cả 4).
- **Công cụ:** skill `/vac-consistency-check`, `/vac-balance-check`, `/vac-propagate-change`, `/vac-story-done`, `/vac-scope-check`, `/vac-asset-audit`; agent `vac-designer`, `vac-economy`, `vac-backend`, `vac-frontend`, `vac-art-pipeline`, `vac-qa`; rule `.claude/rules/` tự nạp theo đường dẫn; hook `read-guard`, `secret-guard`. "17 AI Skills" trong tài liệu là vai trò, ánh xạ sang công cụ thật ở `17` Phần D (art → plugin `agent-sprite-forge`).

## 2. Vòng 6 bước cho mỗi tính năng
1. **Thiết kế:** đối chiếu `01`–`06` + runbook `11`–`16`, impact report 5 dòng; đụng DB/kinh tế/core thì dừng chờ PO.
2. **Asset:** sprite/VFX/âm thanh đúng `05` (`/vac-asset-audit`).
3. **Backend & store:** migration additive-only, types 0 `any`, action mới không phá action cũ.
4. **UI:** scene/HUD/modal theo `06`, không làm lệch HUD cũ.
5. **Kiểm thử hồi quy:** đủ bộ lệnh ở 1.5, rà lại D0/D1.
6. **Nghiệm thu:** Phiếu nghiệm thu (`/vac-story-done`), ghi nhật ký, dừng chờ PO duyệt.
