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

Web và native dùng chung cách gọi API. Godot Web dùng Supabase SDK để đọc phiên Phaser khi cả hai bản cùng origin và cùng project Supabase. Bản native giữ phiên trong vùng lưu riêng của ứng dụng. Bản xem khi mất kết nối được lưu riêng theo tài khoản. Sau một lần gửi có kết quả chưa rõ, nút **Đọc lại** lấy trạng thái server.

## Staging Web và PWA

Đặt bản Phaser ở gốc và bản Godot ở `/godot/` trên cùng origin HTTPS. Dùng cùng URL và khóa công khai trong cấu hình Vite của Phaser và tệp Godot. Chạy `npm run build` cho Phaser, rồi `bash scripts/build-godot-web.sh` cho Godot. Đưa nội dung `godot/dist/` vào `dist/godot/` sau khi xuất. Script Godot đóng gói SDK cho phiên Web vào HTML để PWA vẫn mở được từ cache.

Mở Phaser tại `/?p1`, chờ gửi xong thao tác rồi mở `/godot/index.html` trong cùng trình duyệt. Nếu Phaser còn hàng chờ, quay lại Phaser để đồng bộ rồi bấm **Đọc lại** trong Godot. Khi thử trên Android và iPhone, mở link Godot trong Chrome hoặc Safari, thêm vào màn hình chính, sau đó kiểm phiên, kho, cảm ứng và tốc độ tải khi mở từ icon.
