# AGENTS.md — VAC Online (Hương Đồng Gió Nội)

Luật bắt buộc cho mọi AI agent và người làm. Bản đầy đủ trước khi rút gọn (2026-11-10): [docs/archive/AGENTS-2026-11-10-truoc-rut-gon.md](docs/archive/AGENTS-2026-11-10-truoc-rut-gon.md) — chỉ đọc khi cần truy vết. Trả lời tiếng Việt.

## 1. Đầu phiên — đọc ít, đọc đúng
1. [docs/SESSION-HANDOFF.md](docs/SESSION-HANDOFF.md) (việc đang làm, bước kế tiếp).
2. Đúng **một** mục việc trong [docs/PROJECT-PLAN.md](docs/PROJECT-PLAN.md) hoặc `VIEC_CAN_LAM.md`.
3. Chỉ mở đoạn tài liệu `00 → 17` mà việc đó dẫn tới (file > 30 KB đọc theo đoạn). Câu hỏi về code/tài liệu: chạy `graphify query "<câu hỏi>"` trước khi grep/đọc file.
4. Cần chuyên môn: tra [docs/studio/INDEX.md](docs/studio/INDEX.md), mở 1–3 skill. Không nạp cả thư viện, không đọc toàn bộ archive.

Quy trình phiên và budget ký tự: [docs/WORKFLOW.md](docs/WORKFLOW.md).

## 2. RULE D0 — Một nguồn chân lý, không trùng lặp
- Mỗi loại thông tin chỉ viết đầy đủ ở **một** nơi; nơi khác dẫn link:
  - gameplay, cốt truyện, 5 Đợt → `01`; công thức, giá, thuế, trần, Sources/Sinks → `02` + dữ liệu;
  - kiến trúc, DB, RPC, 14 quy tắc code `C1–C14` → `03`; art, palette, sprite, âm thanh → `05`;
  - màn hình, flow → `06`/`07`; lộ trình → `08` (đích) + `docs/PROJECT-PLAN.md` (đang chạy);
  - runbook từng giai đoạn → `11 → 16`; **hiện trạng thật** của code → `17`.
- Dữ liệu thực thể: `GAME_CATALOG` (`src/data/masterData.ts`) là nguồn chuẩn; CSV `04` và seed SQL phải khớp (test đã khóa).
- Tính năng mới chồng lấn tính năng cũ → gộp vào một hệ thống, không để hai bản song song.
- Sửa một con số / luật → chạy `/vac-propagate-change`. Định kỳ `/vac-consistency-check`.
- Thư mục gốc chỉ giữ `00 → 17`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `VIEC_CAN_LAM.md`; tài liệu quy trình ở `docs/`, bản cũ ở `docs/archive/` hoặc `docs_archive_merged/`.

## 3. RULE D1 — Giữ hướng game, giữ dữ liệu, báo tác động sớm
1. **Core gameplay:** trái tim là vòng Vườn – Ao – Chuồng 3 miền (70% chung – 30% độc quyền), mở theo 5 Đợt `23 → 45 → 63 → 76 → 81` loài gắn 10 Chương Gia Phả; năng lượng ⚡ hybrid (`0⚡` thao tác nông trại và giải trí Sảnh, PK `-5⚡`/trận). Tính năng phụ (PK, Loạn Chiến, Hyper-Casual, lễ hội) chỉ bổ trợ, không phá kinh tế nông trại: trần Hyper-Casual `≤ 1.500/ngày`, thuế Sới Đình `10%` zero-sum.
2. **Art/UI:** bảng 64 màu (`art/palette/vac_base.gpl`), góc 3/4 top-down, lưới 32×32 (ô đất 168×80), **viền ấm `#3D2314`, cấm `#000000`**, hoạt ảnh 8–12 frame; chất liệu Gỗ Lim / Tre / Giấy Dó; HUD 2 ngón màn ngang, nút ≥ 38–44px, tôn trọng `safe-area-inset-*`.
3. **Code:** TypeScript strict, 0 `any`; data-driven từ `GAME_CATALOG`; luật chơi là hàm thuần trong `src/domain/` (**sửa luật thì sửa cả SQL**); không phá chữ ký hàm, state hay luồng đang chạy.
4. **Database additive-only:** chỉ `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS … DEFAULT`, `CREATE OR REPLACE FUNCTION`; mỗi thay đổi là migration mới `supabase/migrations/NNNN_*.sql` + `npm run test:sql`. **Cấm** `DROP TABLE/COLUMN`, đổi tên cột đang dùng, đổi ID thực thể (`CROP_ ANI_ AQUA_ PROD_ MAC_ WORK_ PET_ FASH_ BM_ NEW_ CRAFT_ IAP_ DEF_ TRAP_`). Lưu `localStorage` giữ tương thích ngược (`version` + `migrate`).
5. **Báo tác động ở Bước 1:** trước khi code, ghi impact report 5 dòng: (1) core VAC, (2) kinh tế, (3) art/UI, (4) module cũ, (5) DB. **Dừng chờ PO** khi đụng DB, kinh tế hoặc core loop; việc khác tự làm tiếp.

## 4. Vòng làm một việc (rút gọn từ `10_MASTER_AI_PLAYBOOK`)
1. Spec + impact report (`vac-designer`, `vac-economy`; skill `game-designer`/`economy-designer` qua `vac-studio`).
2. Asset (`vac-art-pipeline`, plugin `agent-sprite-forge`, hậu kỳ `tools/art/`), `/vac-asset-audit`.
3. Backend: migration + RPC + test SQL (`vac-backend`).
4. Client: domain → store slice → UI (`vac-frontend`); thay đổi nhìn thấy được phải chạy thật và chụp màn hình (1280×720 và 844×390).
5. Kiểm tra: `npm run typecheck && npm test && npm run build` (+ `npm run test:sql` khi đụng `supabase/`, `npm run test:art` khi đụng `tools/art/`), `npm run check:docs`. Không tắt/nới test để xanh.
6. `/vac-story-done` → Phiếu nghiệm thu → dừng chờ PO duyệt merge.

## 5. Nhật ký — bắt buộc (PO yêu cầu 2026-11-02, đổi chỗ 2026-11-10)
- Nhật ký chính duy nhất: [docs/WORKLOG.md](docs/WORKLOG.md), **tối đa 3 mục**, mỗi mục ghi: ngày · việc · nhánh/commit · kiểm tra thật · phần còn dở ("dừng ở đâu"). Ghi **trước khi báo xong / kết thúc lượt**, kể cả việc làm dở và quyết định của PO.
- Việc xong: tóm tắt 5–8 dòng vào [docs/COMPLETED.md](docs/COMPLETED.md); mục cũ của WORKLOG chuyển **nguyên văn** sang `docs/archive/` rồi mới xóa khỏi WORKLOG. Cập nhật SESSION-HANDOFF.
- Phân biệt rõ: đã code / đã merge / đã áp DB thật / đã deploy / đã có người chơi thử.
- Danh sách việc: `VIEC_CAN_LAM.md` (việc PO, quyết định chờ) + `docs/PROJECT-PLAN.md` (thứ tự việc). Xong thì `[x]` + gạch, không xóa dòng.

## 6. Bảo mật và môi trường
- Không commit khóa (`.env`, service key, token) — hook `secret-guard` chặn. Không dán key vào chat; dùng biến môi trường.
- Chỉ áp migration lên Supabase thật khi PO cho phép rõ ràng; ghi vào WORKLOG sau khi áp.
- Làm trên nhánh riêng, commit + push nhánh; chỉ merge `main` khi PO yêu cầu.

## 7. Công cụ có thật
- Agent dự án: `.claude/agents/vac-{designer,economy,backend,frontend,art-pipeline,qa}`.
- Skill dự án: `/vac-consistency-check`, `/vac-balance-check`, `/vac-propagate-change`, `/vac-story-done`, `/vac-scope-check`, `/vac-asset-audit`, `/vac-studio` (bộ định tuyến 116 skill Game Studio), `/graphify`.
- Thư viện Game Studio đầy đủ: `.agents/game-studio/` (bản ghim, xem [docs/studio/INSTALLATION.md](docs/studio/INSTALLATION.md)). 21 vai trò trong đó là playbook tham khảo, không phải tiến trình chạy. Dự án dùng **Phaser 3** — skill viết cho Phaser 4 phải đối chiếu API trước khi dùng.
- "17 AI Skills" trong `00 → 16` là tên vai trò; ánh xạ sang công cụ thật ở `17` Phần D.
