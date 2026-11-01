---
paths:
  - "src/services/**"
  - "src/store/**"
---

# Client ↔ server — không tin client

- Ở chế độ `cloud`, mọi thay đổi vàng / XP / kho / ô đất **chỉ** đến từ ảnh chụp do RPC trả về (`farmGateway.ts` → `snapshotToState`). Client không tự cộng tiền.
- RPC lỗi: hiện toast, **không đổi state**. Lỗi `PGRST202`/`42883` (server thiếu hàm) thì quay về chế độ `local`.
- Không lưu mật khẩu, OTP, token, service key vào localStorage hay vào code. Auth chỉ qua Supabase Auth.
- Save cục bộ (`vac_online_save_v1`) chỉ dùng cho chế độ offline và **không bao giờ đẩy lên server**.
- Thêm action mới thì giữ nguyên chữ ký các action cũ (RULE D1). Logic đặt ở `src/domain`, store chỉ điều phối.
