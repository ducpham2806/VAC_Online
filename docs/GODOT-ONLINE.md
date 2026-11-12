# Lưu online cho bản thử Godot

Thuộc LT-14 bước 2. Tạo `godot/generated/godot_online.json` trước khi mở Editor hoặc xuất Web. Thư mục `generated` nằm ngoài Git.

```json
{
  "url": "https://your-project-ref.supabase.co",
  "publishable_key": "sb_publishable_...",
  "region": "ap-southeast-1",
  "playtest": false
}
```

Chọn project thử đã bật đăng nhập ẩn danh và có `apply-actions` theo QD-89. Khóa công khai được đưa vào bản Web. `playtest` bật gửi nhật ký LT-13. Khi chạy cùng project thử cục bộ có thể dùng URL loopback. Khi bỏ tệp cấu hình, cảnh chạy với máy chủ fixture theo LT-14.

Web và native dùng chung cách gọi API và giữ phiên theo URL project trong bộ nhớ của từng ứng dụng. Bản xem khi mất kết nối được lưu riêng theo tài khoản. Sau một lần gửi có kết quả chưa rõ, nút **Đọc lại** lấy trạng thái server. Anh có thể thực hiện thao tác tiếp theo từ trạng thái đã xác nhận.

Đã kiểm trên Supabase Auth và PostgreSQL cục bộ với handler `apply-actions` của VAC. Chrome qua luồng gieo, tưới, gặt và bán, làm mới phiên khi gặp 401, đọc lại sau mất phản hồi và mở cache PWA khi offline. Godot native giữ phiên khi chạy lại. Kiểm staging, dùng chung phiên với Phaser và đo trên điện thoại thật còn ở LT-14.
