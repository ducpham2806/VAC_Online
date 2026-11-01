---
name: vac-story-done
description: "Định nghĩa 'xong' cho một việc/module của VAC Online: chạy đủ kiểm tra, chụp màn hình bằng chứng nếu người chơi nhìn thấy thay đổi, cập nhật file 17 và xuất Phiếu nghiệm thu (Bước 5–6 của AGENTS.md). Dùng trước khi báo PO là đã xong."
argument-hint: "<module hoặc mô tả việc, ví dụ M03.1>"
allowed-tools: Read, Grep, Glob, Edit, Bash(npm run *), Bash(npx vitest run *), Bash(node *), Bash(npx vite *), Bash(git *)
---

# /vac-story-done (chuyển thể từ CCGS `story-done` + `gate-check`)

## Bước 1 — Tiêu chí
Lấy tiêu chí nghiệm thu từ yêu cầu của PO, plan, hoặc runbook `11`–`16` của module. Mỗi tiêu chí phải kiểm được đúng/sai.

## Bước 2 — Chạy kiểm tra (ghi lại output thật)
`npm run typecheck`, `npm test`, `npm run build`; thêm `npm run test:sql` nếu có đụng `supabase/`.
Bước nào fail thì kết luận **BLOCKED**. Không được skip test (`.claude/rules/tests.md`).

## Bước 3 — Bằng chứng người chơi thấy được (CCGS: "story chạm vào màn hình thì phải chạy và chụp")
Nếu thay đổi UI, Phaser hoặc luồng chơi:
- Chạy `npx vite build && npx vite preview`.
- Dùng Playwright (đã cài sẵn, `require('playwright')`) chạy kịch bản thật.
- Chụp **1280×720 và 844×390** vào scratchpad, kiểm không có `pageerror`.
Không chạy được thì ghi **NOT ASSESSED** cho tiêu chí đó, không ghi "đạt".

## Bước 4 — RULE D0/D1
- Có lệch số liệu tài liệu không (`/vac-consistency-check` nếu đụng tài liệu)?
- Có đổi chữ ký hàm hay state cũ không?
- Migration có additive-only không?

## Bước 5 — Cập nhật hiện trạng
Phụ lục 1 trong file 17 (Done/Partial…), mục C của sprint đang chạy.

## Bước 6 — Phiếu nghiệm thu
```
## Phiếu nghiệm thu: <việc>
Tiêu chí: x/y đạt (liệt kê, mỗi dòng ✅ / ❌ / NOT ASSESSED)
Kiểm tra: typecheck ✅ · test n/n ✅ · test:sql ✅ · build ✅
Bằng chứng: <ảnh / log>
Lệch so với plan: …
RULE D0/D1: …
Việc PO cần làm: …
Kết luận: XONG | XONG CÓ GHI CHÚ | NOT ASSESSED | BLOCKED
```
Dừng chờ PO duyệt (Approval Gate). Agent: `vac-qa`.
