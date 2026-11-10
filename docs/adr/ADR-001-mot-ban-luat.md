# ADR-001 · Một bản luật TypeScript chạy cả client và server

**Trạng thái:** Chấp nhận (QD-20, 10/11/2026). **Áp vào:** `docs/04_KY_THUAT.md` KY-10.

## Bối cảnh
- **Luật chơi bản MVP viết hai lần:** `src/domain/*.ts` cho client và PL/pgSQL (`0004 → 0015`, ~27 RPC) cho server.
- **Hệ quả:** mỗi lần đổi luật phải sửa 2 nơi cộng 2 bộ test, và hai bản đã từng lệch nhau (`docs/REVIEW-2026-11-10.md` mục 4).

## Phương án
| Phương án | Ưu | Nhược |
|---|---|---|
| A. Giữ PL/pgSQL, sinh test chéo TS ↔ SQL | Không đổi hạ tầng; atomic sẵn bằng `FOR UPDATE` | Vẫn viết luật 2 lần; PL/pgSQL khó test, khó đọc |
| **B. Luật TS chạy trong Supabase Edge Function (Deno)** | Một bản luật, một bộ test; client hiển thị trước đúng như server | Độ trễ khởi động; phải tự khóa lạc quan (ADR-002) |
| C. Server Node riêng (Render/Fly) | Toàn quyền | Thêm hạ tầng và chi phí, thêm chỗ lỗi |

## Quyết định
Chọn **B**.
- **Luật:** `src/domain/` là hàm thuần (không import store/React/Phaser/Supabase; `now` và `rng` truyền vào).
- **Đóng gói:** esbuild gói `src/domain/index.ts` thành `supabase/functions/_shared/domain.js`. Đây là file sinh tự động, không sửa tay; CI kiểm file sinh khớp nguồn.
- **Edge Function `apply-actions`:** nhận danh sách thao tác `{ type, payload, clientTs }[]`, đọc trạng thái và áp từng thao tác bằng giờ server + RNG server, rồi ghi lại theo ADR-002.
  - Thao tác bị từ chối trả lý do, không làm hỏng các thao tác khác trong lô.
- **Client:** áp ngay để hiển thị trước. Khi server trả trạng thái chuẩn thì thay bằng trạng thái đó.

## Hệ quả
- Mỗi luật có test vitest một chỗ; bỏ dần test SQL cho luật.
- `rules/domain-rules.md` và `rules/supabase.md` viết lại khi bắt đầu P1: bỏ "chép luật sang SQL".
- **Việc của P0-4:** đo độ trễ thật trên Supabase, mục tiêu p95 < 400 ms cho lô 1–10 thao tác. Vượt mức đó thì xem lại phương án A.
