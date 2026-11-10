# Bàn giao · 10/11/2026 · P0 xong, chờ PO 2 việc

## Việc vừa làm
Nhánh `claude/gifted-faraday-2q851c`. P0 chốt nền theo `docs/07_LO_TRINH.md` LT-10:
- P0-2 mẫu hình vẽ code;
- P0-3 ADR + cột mùa;
- P0-4 thử nghiệm kỹ thuật chạy ở máy cục bộ;
- P0-5 wireframe HUD.
PO duyệt mọi đề xuất (QD-18…32).

## Đã xác minh
- typecheck, 190 test, build, check:docs, test:art PASS.
- `prototypes/p0-4-edge/run-local.sh` PASS (cần Deno: `npm i --prefix /tmp/deno deno@2.9.6`).
- Ảnh wireframe 2 cỡ, mọi nút ≥ 44 px.

## Chưa xác minh
- Độ trễ Edge Function trên Supabase thật (P0-6).
- CI GitHub cho nhánh. Chưa merge.
- Sprite thật: mới có hình vẽ code.

## Bước tiếp theo
1. PO trả lời QD-81 (tạo project Supabase mới) → làm P0-6: tạo project, áp `prototypes/p0-4-edge/supabase/`, deploy function, đo p95.
2. PO trả lời QD-80: tạo 5 ảnh theo `art/prompts/p0_samples.md`, bỏ vào `art/source/inbox/` → nhập ảnh + `/vac-asset-audit`.
3. Lập thẻ P1 (vertical slice, `07` LT-03): chuyển `prototypes/p0-4-edge` thành nền P1; scene đi bộ + HUD lai theo UI-20.

## Bối cảnh giữ nguyên
- Code game đang chạy vẫn theo thiết kế cũ (KY-90). DB MVP `0001 → 0014` không đổi.
- Môi trường cloud riêng `VAC_Online` đã tạo (chỉ mở thêm `api.openai.com`), chưa lưu khóa nào.
