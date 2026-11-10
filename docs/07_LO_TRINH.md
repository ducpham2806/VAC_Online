# 07 · Lộ trình

**Sở hữu:** các pha phát triển, cổng kiểm chứng, nội dung mỗi pha, thẻ việc đang chạy. **Không chứa:** luật chơi (`01`), con số (`03`), lý do chiến lược dài (`docs/REVIEW-2026-11-10.md`).
Trạng thái: PO duyệt lộ trình này (QD-18, QD-20). Việc tài liệu (LT-11) đã được PO cho làm trước (QD-17).

### LT-01 · Nguyên tắc
1. Mỗi pha kết thúc bằng cổng đo được trên người chơi thật. Chưa qua cổng thì không mở nội dung mới.
2. Thẻ việc nhỏ (1–3 ngày) có file đích, tiêu chí nghiệm thu, bằng chứng (mẫu ở `docs/WORKFLOW.md`).
3. PO chỉ duyệt 3 loại việc: số liệu kinh tế, DB/kiến trúc, phạm vi/core loop. Việc khác AI tự làm, CI là cổng chặn.

### LT-02 · Các pha (ước lượng thô, 1 người + AI)
| Pha | Thời lượng | Nội dung | Cổng qua pha |
|---|---|---|---|
| **P0 Chốt nền** | 1–2 tuần | Tài liệu mới (LT-11); 5 sprite mẫu đúng `05`; ADR kiến trúc `04` KY-10; pipeline dữ liệu KY-20; thêm cột mùa cho dữ liệu | PO duyệt tài liệu + ADR + art mẫu |
| **P1 Vertical slice** | 3–4 tuần | Xem LT-03 | 10–20 người chơi thử; giả định: ≥ 50% quay lại ngày hôm sau |
| **P2 Closed beta Đợt 1** | 4–6 tuần | Đủ Đợt 1 của miền đầu tiên, Chương 1–2, khai hoang, bùn Hoàng Kim, đơn HTX, 1 lễ hội | 50–100 người; đo D1/D7, phễu tân thủ, Sources/Sinks thật |
| **P3 Soft launch PWA** | 2–3 tuần | Hiệu năng di động, tài khoản an toàn, kiểm pháp lý (QD-32) | 2 tuần không lỗi lệch tiền |
| **P4 Các Đợt nội dung** | 4–6 tuần/Đợt | LT-05 | Mỗi Đợt: kiểm cân bằng trên số liệu thật, D7 không giảm |
| **Sau 1.0** | — | Miền thứ 2 và 3; Sảnh Chung (GP-80); app Capacitor | Cộng đồng đủ đông |

### LT-03 · Vertical slice (P1)
- **Miền:** Bắc Bộ (QD-15, QD-21).
- **Bản đồ:** điền trang đổ nát với 3 hạng mục sửa được (nhà, giếng, chuồng gà).
- **Nhân vật:** đi lại có công cụ cuốc / tưới / liềm; chạm nhanh vào ô (GP-02).
- **Nội dung:** ~8 loài trải 2 mùa (5 cây, 2 vật nuôi, 1 cá); 1 xưởng (Bếp Củi); bảng đơn HTX.
- **Làng và cốt truyện:** 2 NPC có tim; Chương 1; 15 phút đầu có hướng dẫn.
- **Hạ tầng:** lưu online; công tắc đổi mùa cho bản thử.
- **Art:** mọi thứ xuất hiện phải là art thật đúng `05`.

### LT-04 · Ngoài bản 1.0
- Xổ số, gacha Đập Niêu, cược vàng PK.
- Loạn Chiến 8–12 người, Máy Thùng Hyper-Casual, PK realtime.
- Ý tưởng giữ ở `01` GP-80. Kiếm tiền: KT-60 (QD-19).

### LT-05 · Nội dung theo Đợt (sau khi qua P2)
| Đợt | Lũy kế loài | Hệ thống mới | Chương |
|---|---|---|---|
| 1 | 23 | Vườn-Ao-Chuồng cơ bản, khai hoang, bùn Hoàng Kim, HTX | 1–2 |
| 2 | 45 | Bếp + xưởng nghề, Lán Thợ (GP-33), lễ hội mùa đầu tiên | 3, 6, 7 |
| 3 | 63 | Chợ phiên, thăm và giúp hàng xóm, tàu Bắc–Nam (GP-40) | 4–5 |
| 4 | 76 | Đình làng, cây đột biến, kỷ vật, thời trang | 8–9 |
| 5 | 81 | Cưới (GP-52), homestay, Tết | 10 |

Danh sách loài cụ thể của mỗi Đợt nằm ở dữ liệu (`unlockWave`); luật mở khóa ở `01` GP-61.

### LT-10 · Thẻ việc P0
| ID | Việc | Phụ thuộc | Trạng thái |
|---|---|---|---|
| P0-1 | Bộ tài liệu mới `docs/00 → 08` | QD-12…17 | DONE 10/11 (LT-11) |
| P0-2 | 5 sprite mẫu (1 cây 4 giai đoạn + mùa, 1 gà, 1 cá, nhân vật đi 4 hướng, ô đất 2 mùa) qua `/vac-asset-audit` | QD-33, QD-80 | DONE 10/11: mẫu vẽ code + ảnh thật PO tạo, nhập bằng `import_sheet.py` (`art/source/p0_ai/`) |
| P0-3 | ADR-001 một bản luật TS; ADR-002 trạng thái + sổ cái tiền tệ; ADR-003 pipeline dữ liệu (thêm cột `seasons`) | QD-20 | DONE 10/11 (`docs/adr/`, cột `Seasons`, `src/domain/season.ts`) |
| P0-4 | Thử nghiệm kỹ thuật: "gieo → thu → bán" chạy luật TS trên Edge Function có khóa phiên bản, đo độ trễ | P0-3 | DONE 10/11 ở máy cục bộ (`prototypes/p0-4-edge/`) |
| P0-6 | Đo độ trễ P0-4 trên Supabase thật (project cũ, mục tiêu p95 < 400 ms); bảng mới không trùng bảng MVP nên áp được kiểu thêm | QD-81 | BLOCKED: kết nối Supabase của phiên chưa thấy project VAC |
| P0-5 | Wireframe mới cho HUD điều khiển lai (`06` UI-20) | P0-1 | DONE 10/11 (`docs/wireframes/`) |

### LT-11 · Việc tài liệu đã làm
10/11: thay bộ `00 → 17` bằng `docs/00 → 08`, gộp nội dung đáng giữ, đổi hướng theo QD-12…15. Chi tiết: `docs/COMPLETED.md`.
