# Tóm tắt việc đã hoàn tất

Bộ nhớ kết quả theo module, không phải nhật ký thứ hai. Chỉ đọc mục liên quan. Chi tiết từng ngày: [archive nhật ký cũ](archive/WORKLOG-2026-11-03-VIEC_CAN_LAM-muc-F.md); hiện trạng đầy đủ: `17` Phần C. "Đã code" ≠ "đã áp DB thật" ≠ "đã có người chơi".

## TOOLING-01 · Game Studio + Graphify + hệ nhật ký · 10/11/2026
- Nhánh `claude/gifted-faraday-2q851c`. Cài thư viện Game_Studio_Agent `c5dac46` (297 file, 116 skill, 21 vai trò) ở `.agents/game-studio/`, manifest băm từng file, skill định tuyến `/vac-studio`, chỉ mục riêng cho VAC.
- Graphify `0.9.105` (+SQL): skill `/graphify`, hook nhắc tra đồ thị, SessionStart tự cài và dựng `graphify-out/` (~1.350 nút, không commit).
- Rút `AGENTS.md` 19,7 KB → ~6 KB, giữ đủ RULE D0/D1 (bản cũ nguyên văn ở archive). Nhật ký chuyển từ `VIEC_CAN_LAM.md` mục F sang `docs/WORKLOG.md` + COMPLETED + HANDOFF, có `npm run check:docs`.
- Bản đánh giá plan + kế hoạch làm lại (đề xuất, **chờ PO duyệt**): `docs/REVIEW-2026-11-10.md`, `docs/PROJECT-PLAN.md`.
- Không đổi code game, DB hay kinh tế.

## S0 · Ổn định nền móng · 31/10/2026 — DONE
- Build chạy lại; vitest + CI (typecheck → test → test:sql → build); chỉ dùng Supabase Auth, bỏ kho mật khẩu ở localStorage; công cụ debug chỉ hiện ở DEV.
- `0003_security_hardening`: RPC khóa bằng `auth.uid()`, catalog chỉ `service_role` ghi; seed catalog phía server. Dữ liệu `unlockWave` 5 Đợt (23/45/63/76/81) có test khóa.
- Quy ước: `GAME_CATALOG` (166 mục) là nguồn chuẩn; CSV `04` (146 dòng) phải là tập con.

## S1 · Vòng chơi GĐ1 trên server · 01/11/2026 — DONE, đã áp DB thật
- `0004_farm_core`: gieo, tưới, thu vào Kho, bán HTX, năng lượng +1⚡/3 phút đều tính ở server. `0005` sửa Security Advisor; smoke test thật đạt.
- Lưu tiến trình online/offline (`persist` có `version`); khóa Khay giống theo Đợt/cấp/miền.
- PO chốt: thuế Chợ 5%, bảo hiểm trộm 80%, PK `-5⚡`.

## S2 · Tách kiến trúc + khai hoang + nhiệm vụ · 01–02/11/2026 — DONE, đã áp DB thật
- Store tách 6 slice; `App.tsx` 2.084 → ~700 dòng, 11 modal ra file riêng.
- Khai hoang lưới 5×5 (`farmGrid.ts`, `0006`); mục tiêu nhiệm vụ đo trên server Ch.1–2 (`0007`); analytics D1/D7, phễu, Sources/Sinks (`0008`, `npm run supabase -- report`).
- HUD màn ngang thấp 844×390; atlas tạm 23 loài × 4 giai đoạn; bản chạy thử GĐ1 (Artifact). Vá lỗ hổng "mua món rồi bán lại" ở Bách Khoa.
- Còn mở: art thật Đợt 1 (chờ PO chọn nguồn ảnh); mục tiêu Ch.4–5, 8–10.

## S3 · Hướng dẫn tân thủ · 02/11/2026 — DONE (closed beta chưa chạy)
- Bác Bảy hướng dẫn 8 bước Chương 1–2 (`src/domain/tutorial.ts`, `TutorialCoach`).
- **Chưa có người chơi thử thật** — closed beta 50–100 người vẫn là việc mở.

## S4 · Bếp Quê & Xưởng · 02/11/2026 — DONE code, đã áp DB thật, chưa mở cho người chơi
- Luật nấu theo nguyên liệu (`cooking.ts`), `0009_kitchen` (3 bảng, 5 RPC), `recipe_seed.sql`, `CookingModal` 3 tab, nút Ăn trong Kho.
- PO chốt: Nồi Đất là khám phá công thức, giữ dữ liệu gốc và giá.

## S5 · Lán Thợ & Xưởng nghề · 03/11/2026 — DONE code, đã áp DB thật (`0010`–`0014`)
- Vật nuôi/thủy sản nhiều lứa (`0010`) — sửa lỗi lỗ mỗi lứa có từ GĐ1, có hiệu lực ngay với người chơi online.
- Thợ chỉ thu + tưới, lương 25% (Chú Tư Lv.13/200🪙, Cô Năm Lv.15/275🪙), lazy-tick server (`0011`); mục tiêu Ch.3/6/7 (`0012`); xưởng Đan Lát/Khung Cửi + đồ thợ 72h (`0013`); Phụ Cấp Ngày Mùa 300🪙 (`0014`).
- Bằng chứng cuối: typecheck, 178 test, build, test:sql (7 file), test:art PASS; Security Advisor 0 ERROR.

## Chuẩn bị mở GĐ2 · 03/11/2026 — WAITING PO
- Sprite tạm Lán Thợ + 2 thợ; `0015_app_config_stage` (công tắc giai đoạn ở DB) + test; bản chạy thử GĐ2 (Artifact riêng tư).
- **Chờ:** PO xác nhận áp `0015`, merge, deploy `VITE_GAME_STAGE=2`, bật `game_stage = 2`. Nếu PO duyệt kế hoạch làm lại thì việc này có thể không cần nữa.

## Hạ tầng AI dự án · 31/10–01/11/2026 — DONE
- 6 agent `vac-*`, 6 skill `vac-*`, 7 rule theo đường dẫn, hook `read-guard`/`secret-guard`/SessionStart, plugin `agent-sprite-forge` — chuyển thể chọn lọc từ Claude-Code-Game-Studios (`.claude/THIRD_PARTY.md`).
