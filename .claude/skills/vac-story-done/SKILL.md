---
name: vac-story-done
description: "Định nghĩa 'xong' cho một việc/module của VAC Online: chạy đủ kiểm tra, chụp màn hình bằng chứng nếu người chơi nhìn thấy thay đổi, cập nhật file 17 và xuất Phiếu nghiệm thu (Bước 5–6 của AGENTS.md). Dùng trước khi báo PO là đã xong."
argument-hint: "<module hoặc mô tả việc, ví dụ M03.1>"
allowed-tools: Read, Grep, Glob, Edit, Bash(npm run *), Bash(npx vitest run *), Bash(node *), Bash(npx vite *), Bash(git *)
---

# /vac-story-done
1. **Tiêu chí** từ yêu cầu PO / runbook `11`–`16`, mỗi tiêu chí kiểm được đúng/sai.
2. **Kiểm tra** (ghi output thật): `npm run typecheck`, `npm test`, `npm run build`, + `npm run test:sql` nếu đụng `supabase/`. Fail → **BLOCKED**; không skip test.
3. **Bằng chứng** nếu đổi UI/Phaser/luồng chơi: `npx vite build && npx vite preview`, Playwright chạy kịch bản thật, chụp 1280×720 và 844×390 vào scratchpad, không có `pageerror`. Không chạy được → NOT ASSESSED.
4. **D0/D1:** lệch số tài liệu? đổi chữ ký/state cũ? migration additive-only?
5. **Cập nhật** `17` (Phụ lục 1, mục C sprint) và nhật ký mục F `VIEC_CAN_LAM.md`.
6. **Phiếu nghiệm thu:**
```
## Phiếu nghiệm thu: <việc>
Tiêu chí: x/y (mỗi dòng ✅ / ❌ / NOT ASSESSED)
Kiểm tra: typecheck · test n/n · test:sql · build
Bằng chứng: <ảnh / log>
Lệch so với plan · RULE D0/D1 · Việc PO cần làm
Kết luận: XONG | XONG CÓ GHI CHÚ | NOT ASSESSED | BLOCKED
```
Dừng chờ PO duyệt. Agent: `vac-qa`.
