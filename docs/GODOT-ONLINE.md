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

### Nghiệm thu trước khi chuyển URL chính

- Dùng nông trại thử, gieo một ô và ghi lại ô, vàng, kho. Mở cùng origin trong Godot, tải lại và đối chiếu.
- Trên Android và iPhone, cài từ Chrome hoặc Safari rồi mở bằng icon. Ghi thiết bị, phiên bản hệ điều hành, thời gian sẵn sàng lần đầu và lần mở lại, FPS, điều khiển hai ngón, vùng an toàn và âm thanh.
- Sau khi nông trại đã lưu, thử mở lại khi mất mạng. Đối chiếu bản xem với số dư đã ghi. Kết nối lại và đọc trạng thái máy chủ trước khi thử thao tác tiếp.
- Giữ artifact Phaser đã kiểm. Đưa bản Godot mới lên cùng origin, đóng cửa sổ Godot và mở lại để kiểm mã bản dựng đã đổi và tiến trình còn đủ. Sau đó mở `/?p1` để diễn tập quay về Phaser và kiểm lại cùng nông trại.

### Mở bản lưu offline cũ của Phaser

Giữ đường dẫn `/?p1&offline` trên origin cũ khi thử chuyển URL chính. Mở bằng trình duyệt đã chơi để tiếp tục bản lưu có trên máy. Lần đầu mở bản Phaser đã tách chế độ, trình duyệt sao chép bản lưu chung hiện có sang ô offline. Sau đó `/?p1&offline` tiếp tục ghi vào ô riêng. Cơ chế này chỉ giữ được dữ liệu còn trong trình duyệt tại thời điểm sao chép. Nhập bản lưu offline vào tài khoản Godot là quyết định riêng ở LT-14.

Nếu Godot báo Phaser còn thao tác chờ, mở `/?p1` cùng origin, chờ đồng bộ rồi quay lại Godot và bấm **Đọc lại**. Kiểm ô ruộng và số dư sau khi đọc lại.

### Phiếu thử PWA trên thiết bị

| Thiết bị và bản hệ điều hành | Trình duyệt | Mở từ icon lần đầu / mở lại | FPS khi đi bộ | Hai ngón, vùng an toàn | Nghe hiệu ứng | Lưu, mất mạng, đọc lại |
|---|---|---|---|---|---|---|
| Android | Chrome | | | | | |
| iPhone | Safari | | | | | |
