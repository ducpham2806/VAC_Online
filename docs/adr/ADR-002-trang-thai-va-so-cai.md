# ADR-002 · Trạng thái nông trại một bản ghi + sổ cái tiền tệ

**Trạng thái:** Chấp nhận (QD-20, 10/11/2026). **Áp vào:** `docs/04_KY_THUAT.md` KY-10, KY-31. DB mới; DB MVP giữ nguyên, không sửa.

## Bối cảnh
- **Bản MVP:** trạng thái trải trên ~15 bảng (`profiles`, `farm_entities`, `inventory`…). Mỗi luật mới cần migration và RPC mới.
- **Đặc điểm game:** nông trại bất đồng bộ, mỗi người chỉ ghi dữ liệu của mình. Tương tác giữa người chơi (chợ, giúp, trộm) đến từ Đợt 3.

## Quyết định
**Bảng `farm_states`** (mỗi người chơi 1 dòng):
- `user_id uuid primary key` → `auth.users`;
- `version bigint not null default 0`;
- `schema_version int not null` (để `migrate` dữ liệu jsonb);
- `state jsonb not null`;
- `updated_at timestamptz`.

**Bảng `ledger`** (chỉ thêm, không sửa, không xóa):
- `id bigserial`, `user_id`, `at timestamptz default now()`;
- `currency text check in ('GOLD','GEM','XU','STAMINA')`;
- `delta bigint`, `balance_after bigint`;
- `reason text` (mã thao tác), `ref text` (ID thực thể hoặc giao dịch).

**Hàm `_commit_farm_state(p_user, p_expected_version, p_state, p_schema_version, p_ledger jsonb)`:**
- trong 1 transaction: cập nhật `farm_states` với điều kiện `version = p_expected_version` (version + 1), rồi chèn các dòng `ledger`;
- trả `false` nếu version đã đổi, để Edge Function đọc lại và thử lại (tối đa 3 lần);
- chỉ `service_role` gọi được.

**RLS:**
- `farm_states`: người chơi chỉ `select` dòng của mình. Không ai `insert/update` trực tiếp ngoài hàm trên.
- `ledger`: người chơi đọc dòng của mình.

**Thao tác giữa 2 người chơi** (Đợt 3, chợ/trộm): hàm riêng khóa cả 2 dòng theo thứ tự `user_id`; tiền đi qua escrow trong `ledger`. Ngoài phạm vi P0.

## Hệ quả
- Thêm hệ thống mới không cần bảng mới: chỉ thêm trường vào `state` + nâng `schema_version` + hàm `migrate` (thuần, có test).
- Analytics (retention, Sources/Sinks) đọc từ `ledger` và bảng sự kiện, không đọc `state`.
- Truy vấn chéo người chơi (bảng xếp hạng) cần bảng phụ đồng bộ từ `state` — làm khi cần.
- Kích thước `state` mục tiêu < 64 KB/người. Vượt mức thì tách phần lớn (Sổ Cá, Kỷ Vật) ra bảng riêng.
