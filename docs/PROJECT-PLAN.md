# Kế hoạch làm lại VAC Online · ĐỀ XUẤT — chờ PO duyệt · 10/11/2026

Lý do và bằng chứng: [REVIEW-2026-11-10](REVIEW-2026-11-10.md). Trong lúc chờ duyệt, lộ trình đang chạy vẫn là `VIEC_CAN_LAM.md` mục B–C. `08` giữ vai trò thiết kế đích dài hạn.

## Nguyên tắc
1. **Kiểm chứng trước, mở rộng sau:** mỗi pha kết thúc bằng một cổng đo được trên người chơi thật; chưa qua cổng thì không mở nội dung mới.
2. **Một nguồn cho mỗi thứ:** dữ liệu ở `data/`; luật chơi là một bản TypeScript dùng chung client/server; tài liệu chỉ dẫn link.
3. **Thẻ việc nhỏ:** 1–3 ngày, có file đích, tiêu chí nghiệm thu và bằng chứng. Mẫu: `docs/WORKFLOW.md`.
4. **Chỉ 3 cổng duyệt của PO:** (a) số liệu kinh tế, (b) DB/kiến trúc, (c) phạm vi/core loop. Việc khác AI tự làm, CI là cổng chặn.

## Các pha (ước lượng thô cho 1 người + AI)
| Pha | Thời lượng | Làm gì | Cổng qua pha |
|---|---|---|---|
| **P0 — Chốt nền** | 1–2 tuần | Trụ cột 1 trang + cắt phạm vi bản 1.0; chọn nguồn art, thử 5 sprite đúng chuẩn `05`; ADR kiến trúc (một bản luật, Edge Function, khóa phiên bản); pipeline `data/` → TS + SQL; tài liệu còn ~6 file; danh sách giữ/bỏ code cũ | PO duyệt 4 ADR + phạm vi + art mẫu |
| **P1 — Vertical slice** | 3–4 tuần | 1 miền, ~8 loài (5 cây, 2 vật nuôi, 1 cá), Chương 1, 15 phút đầu có hướng dẫn, 1 Bếp đơn giản, lưu online, analytics; **art thật** cho mọi thứ xuất hiện | 10–20 người chơi thử + phỏng vấn ngắn; mục tiêu giả định: ≥ 50% quay lại ngày hôm sau |
| **P2 — Closed beta Đợt 1** | 4–6 tuần | Đủ 23 loài Đợt 1, Chương 1–2, khai hoang, ao/bùn/Hoàng Kim; cân bằng bằng script mô phỏng + số liệu thật; sửa theo phản hồi | 50–100 người; đo D1/D7, phễu tân thủ, Sources/Sinks thật; PO chốt có đi tiếp không |
| **P3 — Soft launch PWA** | 2–3 tuần | Hiệu năng di động, an toàn tài khoản, kiểm pháp lý; chưa thanh toán (hoặc chỉ đồ trang trí) | Không lỗi lệch tiền; số liệu ổn định 2 tuần |
| **P4 — Đợt nội dung** | 4–6 tuần/đợt | Đợt 2 Bếp + Lán Thợ → Đợt 3 Chợ + Hàng xóm (bất đồng bộ) → Đợt 4 Lễ hội + Thời trang + kiếm tiền bằng đồ trang trí → Đợt 5 Cưới + Homestay; app Capacitor khi retention đạt | Mỗi đợt: `/vac-balance-check` trên số liệu thật, D7 không giảm |
| **Sau 1.0** | — | Sảnh Chung bất đồng bộ trước, PK / Loạn Chiến realtime sau cùng | Chỉ khi cộng đồng đủ đông |

**Bỏ khỏi bản 1.0** (giữ trong `01`/`02` làm ý tưởng): Xổ số, gacha Đập Niêu, cược vàng PK, Loạn Chiến 8–12 người, Hyper-Casual cartridge.

## Phân chia việc
| Làn | Ai | Đầu ra |
|---|---|---|
| Quyết định + chơi thử | PO | Trả lời cổng duyệt; tuyển và nói chuyện với người chơi thử |
| Thiết kế + kinh tế | `vac-designer`, `vac-economy` + skill `game-designer`/`economy-designer` | Đặc tả ngắn trong `01`; số trong `data/`; script mô phỏng |
| Code | `vac-backend`, `vac-frontend` | domain → server → client, test kèm theo |
| Art | `vac-art-pipeline` + `agent-sprite-forge` | Sprite/atlas đạt `/vac-asset-audit` |
| QA + phát hành | `vac-qa` + skill `game-qa-playtest` | CI, ảnh chụp, phiếu nghiệm thu, báo cáo playtest |

## Thẻ việc P0 (làm khi PO duyệt)
| ID | Việc | Phụ thuộc |
|---|---|---|
| P0-1 | Trụ cột 1 trang + phạm vi bản 1.0 (giữ/bỏ từng hệ thống của `01`) | PO trả lời 3 câu ở REVIEW mục 7 |
| P0-2 | Chọn nguồn art; 5 sprite mẫu (1 cây 4 giai đoạn, 1 gà, 1 cá, Điền chủ, ô đất) qua `/vac-asset-audit` | PO chọn nguồn ảnh |
| P0-3 | ADR-001 server một bản luật; ADR-002 schema lưu trạng thái + sổ cái tiền tệ; ADR-003 pipeline `data/`; ADR-004 cấu trúc tài liệu mới | — |
| P0-4 | Spike: một thao tác "gieo → thu → bán" chạy domain TS trên Edge Function với khóa phiên bản, đo độ trễ | P0-3 |
| P0-5 | Gộp tài liệu: `00 → 16` về ~6 file, bản cũ vào `docs_archive_merged/` | P0-1 |

## Quyết định PO cần cho kế hoạch này
- [ ] Duyệt hướng "build lại phần nền" (hoặc chọn sửa tại chỗ).
- [ ] Cho phép DB mới cho bản làm lại (ngoại lệ RULE D1 mục 4; DB cũ giữ nguyên).
- [ ] 3 câu ở REVIEW mục 7 (mục tiêu 1.0, nguồn art, 1 hay 3 miền).
