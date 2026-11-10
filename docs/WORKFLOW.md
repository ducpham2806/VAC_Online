# Quy trình phiên làm việc và thu gọn ngữ cảnh

Áp dụng cho mọi phiên AI và người. Luật gốc: `AGENTS.md`.

## Đọc khi bắt đầu
1. `AGENTS.md` (nếu công cụ chưa tự nạp) → [SESSION-HANDOFF](SESSION-HANDOFF.md).
2. Chọn đúng **một** thẻ việc ở [07_LO_TRINH](07_LO_TRINH.md) LT-10 hoặc `VIEC_CAN_LAM.md`. Chỉ mở mục có mã (`GP-nn`, `KT-nn`…) mà việc dẫn tới; bản đồ ở [00_TONG_QUAN](00_TONG_QUAN.md) TQ-04.
3. Câu hỏi về code/tài liệu: `graphify query` → chỉ đọc đúng dòng đồ thị chỉ ra.
4. Cần chuyên môn: [studio/INDEX](studio/INDEX.md) → 1–3 skill.

Không đọc cả WORKLOG cũ, archive hay 116 skill. Không làm lại kiểm toán toàn repo mỗi phiên — hiện trạng ở `04` KY-90.

## Trạng thái việc
`READY` → `ACTIVE` → `DONE`. `WAITING` phải ghi đang chờ gì (thường là PO hoặc áp DB). `BACKLOG` = chưa lên kế hoạch.
Chỉ `DONE` khi đủ tiêu chí nghiệm thu. Có code nhưng chưa merge, chưa áp DB thật, hoặc chưa có người chơi thử → ghi đúng mức đó.

**Mẫu thẻ việc** (dùng trong `07_LO_TRINH.md` LT-10):
`ID · Mục tiêu · File đích · Phụ thuộc · Việc làm · Tiêu chí nghiệm thu (đo được) · Bằng chứng (lệnh test, ảnh chụp, số liệu)`.

## Trước khi chuyển việc hoặc kết thúc phiên
1. Xem `git status` / diff thật. Tách phần đã xong và phần còn dở. Chưa xong thì giữ `ACTIVE`/`WAITING` và ghi điểm tiếp tục.
2. Việc xong → thêm **một tóm tắt 5–8 dòng** vào [COMPLETED](COMPLETED.md): ID/ngày/commit, kết quả, quyết định phải giữ, bằng chứng, giới hạn, bước tiếp.
3. Ghi [WORKLOG](WORKLOG.md): tối đa **3 mục** mới nhất, mỗi mục ~100–150 từ. Mục cũ chuyển **nguyên văn** sang `docs/archive/WORKLOG-YYYY-MM.md` (thêm vào cuối file), rồi mới xóa khỏi WORKLOG.
4. Cập nhật [SESSION-HANDOFF](SESSION-HANDOFF.md) và đánh dấu `[x]` trong `VIEC_CAN_LAM.md` / `07_LO_TRINH.md`. Quyết định mới của PO ghi `08_QUYET_DINH.md`.
5. Chạy `npm run check:docs`; commit tài liệu cùng phần việc.

## Budget đầu vào
| File | Trần ký tự | Nội dung |
|---|---:|---|
| `AGENTS.md` | 7.000 | Luật bắt buộc |
| `CLAUDE.md` | 2.000 | Phần riêng Claude Code |
| `docs/SESSION-HANDOFF.md` | 3.000 | Một trang trạng thái + bước kế |
| `docs/01_GAMEPLAY.md` | 24.000 | Luật chơi (đọc theo mục, không đọc cả file) |
| `docs/00`, `02`–`08` | 16.000/file | Thiết kế khác, quyết định |
| `docs/WORKLOG.md` | 4.500 | ≤ 3 mục |
| `docs/COMPLETED.md` | 9.000 | Tóm tắt thành quả theo module |
| `VIEC_CAN_LAM.md` | 16.000 | Việc PO, quyết định chờ, lộ trình |

Budget là số ký tự, không phải số token. Bộ đọc tối thiểu (AGENTS + CLAUDE + HANDOFF + một mục PLAN) ≈ 15–20 nghìn ký tự, so với ~20 KB chỉ riêng `AGENTS.md` cũ. Chi tiết vượt trần chuyển vào archive/reference kèm link; không bỏ quyết định, hợp đồng dữ liệu hay giới hạn kiểm thử. `npm run check:docs` kiểm trần, link hỏng, mã mục (định nghĩa 1 lần, dẫn đúng), số mục WORKLOG và bản ghim Game Studio.
