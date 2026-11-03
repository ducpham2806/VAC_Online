---
paths:
  - "src/services/**"
  - "src/store/**"
---
# Client ↔ server
- Chế độ `cloud`: vàng/XP/kho/ô đất **chỉ** đổi theo snapshot RPC trả về (`farmGateway.ts` → `snapshotToState`); client không tự cộng tiền.
- RPC lỗi: toast, không đổi state. Lỗi `PGRST202`/`42883` (server thiếu hàm) → quay về `local`.
- Không lưu mật khẩu/OTP/token/service key vào localStorage hay code; auth chỉ qua Supabase Auth.
- Save cục bộ `vac_online_save_v1` chỉ cho offline, không đẩy lên server.
- Action mới giữ nguyên chữ ký action cũ; logic ở `src/domain`, store chỉ điều phối.
