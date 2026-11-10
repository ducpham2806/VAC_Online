# P0-4 · Thử nghiệm kỹ thuật: một bản luật TS trên Edge Function

Thẻ `docs/07_LO_TRINH.md` LT-10 P0-4, kiểm [ADR-001](../../docs/adr/ADR-001-mot-ban-luat.md) + [ADR-002](../../docs/adr/ADR-002-trang-thai-va-so-cai.md). Đây là thử nghiệm, không phải code sản phẩm.

## Gồm gì
| File | Vai trò |
|---|---|
| `engine.ts` | Hàm thuần `applyActions(state, actions, {now, rng})`: gọi nguyên luật `src/domain/farm.ts` (gieo, tưới, thu, bán HTX) + luật mùa mới (`src/domain/season.ts`); trả trạng thái, sổ cái, kết quả từng thao tác |
| `engine.test.ts` | Vòng gieo → thu → bán, từ chối trái mùa, không tin client, giới hạn lô (chạy trong `npm test`) |
| `build-engine.sh` | esbuild đóng gói `engine.ts` + `src/domain` + `src/data` thành `supabase/functions/_shared/engine.js` (~120 KB, file sinh, không commit) |
| `supabase/migrations/0001_state_ledger.sql` | `farm_states` (1 dòng/người, `version`), `ledger` (chỉ thêm, chặn số dư âm), `_commit_farm_state` (chỉ `service_role`), RLS |
| `supabase/tests/commit.test.sql` | Khóa lạc quan, sổ cái atomic, chặn số dư âm, quyền |
| `supabase/functions/apply-actions/index.ts` | Edge Function Deno: danh tính từ JWT, đọc → áp luật → commit, thử lại ≤ 3 lần khi xung đột |
| `bench.ts`, `run-local.sh` | Dựng Postgres tạm + chạy function trên Deno + đo |

Chạy: `DENO=<đường dẫn deno> ./run-local.sh`.

## Kết quả (10/11/2026, máy cloud, Postgres 16 + Deno 2.9.6 cục bộ)
- `commit.test.sql` PASS. Migration chạy 2 lần an toàn.
- 100 lô tuần tự (2 thao tác/lô): **p50 2,0 ms, p95 3,1 ms**. Đây là thời gian xử lý ở máy cục bộ, chưa gồm mạng.
- 3 lô song song cùng người chơi: 3/3 thành công, 1 lần thử lại do xung đột version; cả 3 ô đều được gieo.
- Sổ cái khớp số dư cuối (`2.500 + Σ delta = gold`).
- `deno check` của function qua.
- Kết luận: kiến trúc ADR-001/002 chạy được, luật chỉ viết một lần.

## Chưa kiểm được
- **Độ trễ trên Supabase thật** (khởi động lạnh + mạng). Mục tiêu p95 < 400 ms. Cần project Supabase mới (QD-20); chưa tạo vì tạo project là thao tác tốn tài nguyên, chờ PO cho phép.
- **Từ 4 lô song song cùng tài khoản trở lên** có thể hết 3 lần thử. Bình thường một tài khoản chỉ chơi trên 1 thiết bị. Khi làm thật thì thêm backoff ngẫu nhiên và gộp thao tác phía client.
- **Xác thực JWT** dựa vào gateway Supabase (`verify_jwt`). Ở máy cục bộ dùng JWT giả.
