# AGENTS.md — VAC Online (Hương Đồng Gió Nội)

Luật bắt buộc cho mọi AI agent và người làm. Bản đầy đủ trước khi rút gọn (2026-11-10): [docs/archive/AGENTS-2026-11-10-truoc-rut-gon.md](docs/archive/AGENTS-2026-11-10-truoc-rut-gon.md) — chỉ đọc khi cần truy vết. Trả lời tiếng Việt.

## 1. Đầu phiên — đọc ít, đọc đúng
1. [docs/SESSION-HANDOFF.md](docs/SESSION-HANDOFF.md) (việc đang làm, bước kế tiếp).
2. Đúng **một** thẻ việc trong [docs/07_LO_TRINH.md](docs/07_LO_TRINH.md) LT-10 hoặc `VIEC_CAN_LAM.md`.
3. Chỉ mở mục thiết kế (`GP-nn`, `KT-nn`…) mà việc đó cần, bắt đầu từ bản đồ [docs/00_TONG_QUAN.md](docs/00_TONG_QUAN.md) TQ-04. Câu hỏi về code/tài liệu: chạy `graphify query "<câu hỏi>"` trước khi grep/đọc file.
4. Cần chuyên môn: tra [docs/studio/INDEX.md](docs/studio/INDEX.md), mở 1–3 skill. Không nạp cả thư viện, không đọc toàn bộ archive.

Quy trình phiên và budget ký tự: [docs/WORKFLOW.md](docs/WORKFLOW.md).

## 2. RULE D0 — Một nguồn chân lý, không trùng lặp
- Thiết kế ở `docs/00 → 08`. Bản đồ "thông tin nào ở file nào" và quy trình sửa: `docs/00_TONG_QUAN.md` TQ-04, TQ-05. Bộ cũ `00 → 17` chỉ còn trong `docs_archive_merged/v1-2026-11-10/`, không dùng làm nguồn.
- Mỗi luật/công thức là một heading có mã (`### GP-12 · …`). Nơi khác chỉ dẫn mã, không chép nội dung. `npm run check:docs` báo mã sai/trùng.
- Con số: chỉ ở `docs/03_KINH_TE.md` (hằng số chung) hoặc dữ liệu (`data/catalog.csv` ↔ `GAME_CATALOG`, test khóa). Quyết định của PO: chỉ ở `docs/08_QUYET_DINH.md` (`QD-nn`).
- Hiện trạng code: chỉ ở `docs/04_KY_THUAT.md` KY-90.
- Tính năng mới chồng lấn cái cũ → gộp vào một hệ thống. Sửa một luật/số → `/vac-propagate-change`; định kỳ `/vac-consistency-check`.
- Thư mục gốc chỉ có `README.md`, `AGENTS.md`, `CLAUDE.md`, `VIEC_CAN_LAM.md`; mọi tài liệu khác ở `docs/`.

## 3. RULE D1 — Giữ hướng game, giữ dữ liệu, báo tác động sớm
1. **Core gameplay** (`docs/00_TONG_QUAN.md` TQ-02, TQ-03): nông trại kiểu Green Farm 3 + Harvest Moon — vòng Vườn – Ao – Chuồng 3 miền (bản chơi thử 1 miền), điều khiển lai đi bộ + chạm, 4 mùa theo tuần thật, NPC có tim; mở theo 5 Đợt `23 → 45 → 63 → 76 → 81` loài gắn 10 Chương Gia Phả; ⚡ chỉ cho việc nặng (thao tác nông trại `0⚡`, PK `-5⚡`/trận). Tính năng phụ (PK, Loạn Chiến, Hyper-Casual, lễ hội) chỉ bổ trợ, không phá kinh tế nông trại: trần Hyper-Casual `≤ 1.500/ngày`, thuế Sới Đình `10%` zero-sum.
2. **Art/UI:** theo `docs/05_ART_AUDIO.md`: bảng 64 màu (`art/palette/vac_base.gpl`), góc 3/4 top-down, lưới 32×32, **viền ấm `#3D2314`, cấm `#000000`**, hoạt ảnh 8–12 frame; chất liệu Gỗ Lim / Tre / Giấy Dó; HUD 2 ngón màn ngang, nút ≥ 38–44px, tôn trọng `safe-area-inset-*`.
3. **Code:** TypeScript strict, 0 `any`; data-driven từ `GAME_CATALOG`; luật chơi là hàm thuần trong `src/domain/` (**sửa luật thì sửa cả SQL**); không phá chữ ký hàm, state hay luồng đang chạy.
4. **Database additive-only:** chỉ `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS … DEFAULT`, `CREATE OR REPLACE FUNCTION`; mỗi thay đổi là migration mới `supabase/migrations/NNNN_*.sql` + `npm run test:sql`. **Cấm** `DROP TABLE/COLUMN`, đổi tên cột đang dùng, đổi ID thực thể (`CROP_ ANI_ AQUA_ PROD_ MAC_ WORK_ PET_ FASH_ BM_ NEW_ CRAFT_ IAP_ DEF_ TRAP_ MAT_`). Lưu `localStorage` giữ tương thích ngược (`version` + `migrate`). Ngoại lệ một lần: viết lại schema khi chuyển sang kiến trúc mới (QD-81).
5. **Báo tác động ở Bước 1:** trước khi code, ghi impact report 5 dòng: (1) core VAC, (2) kinh tế, (3) art/UI, (4) module cũ, (5) DB. **Dừng chờ PO** khi đụng DB, kinh tế hoặc core loop; việc khác tự làm tiếp.

## 4. Vòng làm một việc
1. Đặc tả (viết vào mục có mã ở `docs/01`…) + impact report (`vac-designer`, `vac-economy`; skill `game-designer`/`economy-designer` qua `vac-studio`).
2. Asset (`vac-art-pipeline`, plugin `agent-sprite-forge`, hậu kỳ `tools/art/`), `/vac-asset-audit`.
3. Backend: migration + RPC + test SQL (`vac-backend`).
4. Client: domain → store slice → UI (`vac-frontend`); thay đổi nhìn thấy được phải chạy thật và chụp màn hình (1280×720 và 844×390).
5. Kiểm tra: `npm run typecheck && npm test && npm run build` (+ `npm run test:sql` khi đụng `supabase/`, `npm run test:art` khi đụng `tools/art/`), `npm run check:docs`. Không tắt/nới test để xanh.
6. `/vac-story-done` → Phiếu nghiệm thu → dừng chờ PO duyệt merge.

## 5. Nhật ký — bắt buộc (PO yêu cầu 2026-11-02, đổi chỗ 2026-11-10)
- Nhật ký chính duy nhất: [docs/WORKLOG.md](docs/WORKLOG.md), **tối đa 3 mục**, mỗi mục ghi: ngày · việc · nhánh/commit · kiểm tra thật · phần còn dở ("dừng ở đâu"). Ghi **trước khi báo xong / kết thúc lượt**, kể cả việc làm dở và quyết định của PO.
- Việc xong: tóm tắt 5–8 dòng vào [docs/COMPLETED.md](docs/COMPLETED.md); mục cũ của WORKLOG chuyển **nguyên văn** sang `docs/archive/` rồi mới xóa khỏi WORKLOG. Cập nhật SESSION-HANDOFF.
- Phân biệt rõ: đã code / đã merge / đã áp DB thật / đã deploy / đã có người chơi thử.
- Danh sách việc: `VIEC_CAN_LAM.md` (việc PO) + `docs/07_LO_TRINH.md` (thẻ việc); quyết định: `docs/08_QUYET_DINH.md`. Xong thì `[x]` + gạch, không xóa dòng.

## 6. Bảo mật và môi trường
- Không commit khóa (`.env`, service key, token) — hook `secret-guard` chặn. Không dán key vào chat; dùng biến môi trường.
- Chỉ áp migration lên Supabase thật khi PO cho phép rõ ràng; ghi vào WORKLOG sau khi áp.
- Làm trên nhánh riêng, commit + push nhánh; chỉ merge `main` khi PO yêu cầu.

## 7. Công cụ có thật
- Agent dự án: `.claude/agents/vac-{designer,economy,backend,frontend,art-pipeline,qa}`.
- Skill dự án: `/vac-consistency-check`, `/vac-balance-check`, `/vac-propagate-change`, `/vac-story-done`, `/vac-scope-check`, `/vac-asset-audit`, `/vac-studio` (bộ định tuyến 116 skill Game Studio), `/graphify`.
- Thư viện Game Studio đầy đủ: `.agents/game-studio/` (bản ghim, xem [docs/studio/INSTALLATION.md](docs/studio/INSTALLATION.md)). 21 vai trò trong đó là playbook tham khảo, không phải tiến trình chạy. Dự án dùng **Phaser 3** — skill viết cho Phaser 4 phải đối chiếu API trước khi dùng.
