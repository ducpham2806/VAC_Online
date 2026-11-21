# Lưu online cho bản thử Godot

Thuộc LT-14 bước 2. Tạo `godot/generated/godot_online.json` trước khi mở Editor hoặc xuất Web. Tệp cấu hình này được bỏ qua khi commit.

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

Đóng gói cả hai client từ cùng commit vào một thư mục mới:

```bash
VAC_STAGING_API_URL=https://api-thu.example.org \
VAC_STAGING_PUBLISHABLE_KEY=sb_publishable_... \
GODOT_BIN=/duong/dan/Godot \
bash scripts/build-godot-staging.sh /duong/dan/staging-moi
```

Mặc định đóng gói HEAD. Đặt `VAC_STAGING_REF` để chọn commit cần kiểm hoặc bản cũ lúc thử cập nhật. Script lấy mã đã commit, dựng trong thư mục tạm và chỉ xuất kết quả khi đủ tệp. `/godot/build-info.json` ghi commit và SHA-256 của các tệp PWA chính để đối chiếu khi đổi bản. Gói staging này tắt nhật ký chơi thử. Ở iPhone/iPad chưa có phiên, trang Godot hiển thị hướng dẫn cài icon trước khi tải game. Người chơi có thể chọn chơi trong trình duyệt. Mở từ icon hoặc đã có phiên sẽ vào thẳng game.

Mở Phaser tại `/?p1&client=phaser`, chờ gửi xong thao tác rồi mở `/godot/index.html` trong cùng trình duyệt. Xem cách xử lý hàng chờ ở [phát hành P1](#phát-hành-p1). Khi thử trên Android và iPhone, mở link Godot trong Chrome hoặc Safari, thêm vào màn hình chính, sau đó kiểm phiên, kho, cảm ứng và tốc độ tải khi mở từ icon.

### Safari và icon trên iPhone

Khi chơi bằng tài khoản khách, giữ cách mở đã dùng để có đúng nông trại. Nếu đã chơi trong Safari, tiếp tục dùng tab Safari. Nếu bắt đầu mới và muốn chơi từ icon, thêm vào Màn hình chính trước khi bắt đầu hướng dẫn. iOS tách dữ liệu của ứng dụng web khỏi Safari. Khi cài, WebKit có thể sao chép cookie đăng nhập nhưng không sao chép localStorage, nơi bản thử đang giữ phiên Supabase. Xem [WebKit về cookie đăng nhập khi cài ứng dụng web](https://webkit.org/blog/14787/webkit-features-in-safari-17-2/#login-cookies).

Chuyển nông trại của người chơi cũ giữa hai nơi mở cần luồng đăng nhập hoặc liên kết tài khoản đã nghiệm thu. Xem [kết quả iPhone thật](qa/GODOT-PWA-STAGING-2026-11-19.md#iphone-14-pro-max-thật).

### Kiểm nhật ký Godot trước đợt chơi thử

Bật `playtest` trong cấu hình bản dựng thử. Mở **Sổ Gia Phả** và cuộn xuống cuối để lấy mã chơi thử. Chơi qua các mốc hướng dẫn rồi xuất dữ liệu và chạy báo cáo theo LT-13. Lượt diễn tập dùng dữ liệu thử riêng với nhóm chơi thật. Dùng một client cho mỗi nhóm để đối chiếu D1, vì mã chơi thử do từng client tạo.

### Nghiệm thu trước khi chuyển URL chính

- Dùng nông trại thử, gieo một ô và ghi lại ô, vàng, kho. Mở cùng origin trong Godot, tải lại và đối chiếu.
- Trên Android và iPhone, cài từ Chrome hoặc Safari rồi mở bằng icon. Ghi thiết bị, phiên bản hệ điều hành, thời gian sẵn sàng lần đầu và lần mở lại, FPS, điều khiển hai ngón, vùng an toàn và âm thanh.
- Sau khi nông trại đã lưu, thử mở lại khi mất mạng. Đối chiếu bản xem với số dư đã ghi. Kết nối lại và đọc trạng thái máy chủ trước khi thử thao tác tiếp.
- Giữ artifact Phaser đã kiểm. Đưa bản Godot mới lên cùng origin, đóng cửa sổ Godot và mở lại để kiểm mã bản dựng đã đổi và tiến trình còn đủ. Sau đó tắt chuyển hướng, mở `/?p1` để diễn tập quay về Phaser và kiểm lại cùng nông trại.

### Phát hành P1

**21/11/2026 · PO duyệt QD-91, QD-92 và QD-93 để triển khai thử trên staging.** PO đã thử `d325444` trên iPhone và Android, mỗi máy đạt 5/5. Luồng nâng cấp và mở lại offline đã qua Chrome/WebKit trên HTTPS staging. Kết quả thử định tuyến và quay lui ghi theo bản dựng trong phiếu staging. [Phiếu staging](qa/GODOT-PWA-STAGING-2026-11-19.md).

**QD-91 · Phiên khách Safari/icon.** Giữ phiên riêng theo nơi người chơi mở game. Người mới muốn chơi từ icon cài trước khi bắt đầu hướng dẫn. Người đã làm nông trại trong Safari tiếp tục trên Safari. Hướng dẫn nói rõ mở theo cách khác có thể thấy nông trại khác. Người đang dùng icon tiếp tục mở đúng icon. Luồng liên kết tài khoản để chuyển nông trại giữa hai nơi mở có thể làm sau P1 và nghiệm thu riêng. Phiên khách hiện nằm trong localStorage. WebKit có thể sao chép cookie lúc cài nhưng tách localStorage. [WebKit](https://webkit.org/blog/14787/webkit-features-in-safari-17-2/#login-cookies).

**QD-92 · Offline ở Godot P1.** Sau khi đã mở online, đọc nông trại và lưu đủ tài nguyên, người chơi có thể mở lại để xem bản đã lưu. Giao diện báo đang xem dữ liệu đã lưu và khóa thao tác ghi. Nếu chưa có dữ liệu lưu, hiển thị yêu cầu kết nối. Khi có mạng, bấm **Đọc lại** và chỉ mở thao tác ghi sau khi máy chủ xác nhận đúng phiên và trạng thái. Nếu mất phản hồi lúc gửi thao tác, đọc lại để đối chiếu kết quả trước khi cho làm tiếp. Khi còn hàng chờ Phaser, Godot chỉ đường về lối Phaser online trong bảng dưới để đồng bộ, rồi người chơi quay lại và bấm **Đọc lại**. Giữ bản lưu cục bộ hiện có truy cập qua link Phaser offline.

**QD-93 · URL chính của bản chơi thử P1.** Chuyển điểm vào P1 trên cùng tên miền, dùng cùng dự án Supabase và giữ đường mở app đã kiểm.

| Đường dẫn | Đích sau chuyển |
|---|---|
| `/?p1` | Chuyển tạm sang `/godot/index.html` bằng 307. |
| `/?p1&client=phaser` | Phaser P1 online để xử lý hàng chờ và quay lui. |
| `/?p1&offline` | Phaser P1 offline. Ưu tiên đường này khi query có `offline`. |
| `/godot/index.html` | Điểm mở trực tiếp của Godot và icon đã cài. |
| `/` | MVP hiện tại. Việc đổi trang gốc thuộc phạm vi phát hành riêng. |

`middleware.ts` trên Vercel dùng quy tắc định tuyến đã thử trên staging. Chuyển hướng mặc định tắt. Khi triển khai gói có cả Phaser và `/godot/`, giám sát trước và chỉ đặt `VAC_P1_GODOT_CUTOVER=1` trên môi trường được PO duyệt. Kiểm các biến thể `?p1` và `?p1=`, query offline, lối Phaser và đường trực tiếp trên deployment thử. Giữ tài nguyên và service worker Godot trong phạm vi `/godot/` và kiểm trên hồ sơ đã có worker Phaser. [Tài liệu Vercel](https://vercel.com/docs/routing-middleware).

**Trình tự phát hành.** Xem đích, API, ID bản dựng và điều kiện quay lui trong [phiếu duyệt URL chính](qa/GODOT-PWA-STAGING-2026-11-19.md#phiếu-duyệt-chuyển-url-chính--21112026). Chuẩn bị hai bước triển khai. Bước đầu phục vụ cả hai gói với redirect còn tắt. Xác nhận mã bản dựng, phiên khách và nông trại trên cùng origin, xử lý hàng chờ Phaser, đọc bản lưu offline cũ và cập nhật PWA từ icon. Kiểm nhật ký P1-12 theo LT-13 trên dữ liệu thử. Sau khi QA ghi kết quả và PO cho phép chuyển URL, bật 307 cho nhóm P1. PO dùng URL này để mời nhóm theo QD-88.

**Quay lui.** Nếu mất phiên, lệch tiến trình hoặc Godot không mở được sau cập nhật, tắt 307 để `/?p1` về Phaser từ bản triển khai trước khi đổi URL. Giữ đường `/godot/` cho icon đã cài và phục vụ gói Godot đã kiểm trên cùng đường nếu cần khôi phục. Kiểm lại tài khoản và dữ liệu trước khi tiếp tục chơi. Bảo toàn cache, bản lưu trên thiết bị và dữ liệu máy chủ.

### Mở lại khi mất mạng

Mở từ đúng nơi đã chơi và đã đọc nông trại online ít nhất một lần. Nếu trình duyệt đã lưu đủ gói Web và bản xem nông trại, game mở được từ cache để xem lại. Khi kết nối lại, bấm **Đọc lại**. Nếu mất phản hồi lúc gửi thao tác, dùng nút này để đối chiếu trước khi tiếp tục.

Script xuất Web đợi service worker kiểm soát lần tải đầu trong một khoảng giới hạn để lưu gói game ngay lần đó. Khi bộ nhớ đệm bị chặn hoặc chậm, game vẫn có thể khởi động online. Kết quả thử ở [phiếu staging](qa/GODOT-PWA-STAGING-2026-11-19.md#đóng-và-mở-lại-offline-sau-lần-đầu).

### Mở bản lưu offline cũ của Phaser

Giữ đường dẫn `/?p1&offline` trên origin cũ khi thử chuyển URL chính. Mở bằng trình duyệt đã chơi để tiếp tục bản lưu có trên máy. Lần đầu mở bản Phaser đã tách chế độ, trình duyệt sao chép bản lưu chung hiện có sang ô offline. Sau đó `/?p1&offline` tiếp tục ghi vào ô riêng. Cơ chế này chỉ giữ được dữ liệu còn trong trình duyệt tại thời điểm sao chép. Nhập bản lưu offline vào tài khoản Godot là quyết định riêng ở LT-14.

Nếu Godot báo Phaser còn thao tác chờ, bấm **Mở Phaser** để đồng bộ tại `/?p1&client=phaser`. Sau đó quay lại Godot và bấm **Đọc lại**. Kiểm ô ruộng và số dư sau khi đọc lại.

### Phiếu thử PWA trên thiết bị

1. Mở link staging trong Safari hoặc Chrome. Thêm vào màn hình chính, sau đó mở Godot từ icon vừa tạo.
2. Xoay ngang và giữ joystick bằng một ngón. Dùng ngón kia chạm ô ruộng để gieo. Nghe hiệu ứng lúc lật trang hoặc gieo. Ghi FPS trên HUD khi đi.
3. Ghi số vàng và ô đã gieo. Đóng app rồi mở lại từ icon. Ghi thời gian HUD báo tải và đối chiếu nông trại. Lặp lại một lần khi mất mạng rồi kết nối lại.

| Thiết bị và bản hệ điều hành | Trình duyệt | Mở từ icon lần đầu / mở lại | FPS khi đi bộ | Hai ngón, vùng an toàn | Nghe hiệu ứng | Lưu, mất mạng, đọc lại |
|---|---|---|---|---|---|---|
| Android | Chrome | | | | | |
| iPhone | Safari | | | | | |
