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

### Phiếu duyệt chơi thử P1-12

**22/11/2026 · LT-13, QD-88 và QD-96.** Trước khi bật nhật ký, gói Godot B phục vụ [URL chính P1](https://vac-online-preview.vercel.app/?p1), commit `524ef73`. Đối chiếu SHA-256 của `index.pck` với build-info Production cho thấy đúng gói B đã nghiệm thu. Cấu hình trong gói là `playtest: false`. Gói này dùng để quay lui khi cần tắt nhật ký.

**Diễn tập nhật ký.** Xuất lại đúng mã B với nhật ký bật và API thử cục bộ. Chrome ghi `SESSION` cho hai lần mở dưới cùng một mã, `ACTION: CHOOSE_PATH` và `TUTORIAL: MOVE`. Mã ở cuối **Sổ Gia Phả** đọc được ở 1280×720 và 844×390. PostgreSQL thử ghi qua vai trò người chơi, xuất được 1/1 nhật ký từ `playtest_logs` và khớp một phản hồi mẫu bằng mã. Báo cáo LT-13 đọc hai phiên, một thao tác và mốc MOVE; D1 chưa đủ dữ liệu trong lượt thử cùng ngày. Typecheck, 317 test (gồm 6 test nhật ký và số liệu), build và kiểm tra tài liệu đều qua.

**Bản ứng viên.** Đã đóng gói cục bộ bản B bật nhật ký cho cùng Supabase. So với bản B đang chạy, chỉ khác gói Godot, phiên bản service worker và build-info. SHA-256 của `index.pck` ứng viên là `f40e28de0e01b9be820dafdfc6a6adade3c9c2675fef5126a9d86b45e60adc3a`.

#### Kiểm trên Production

**22/11/2026 · Đã bật theo QD-96.** Vercel đang phục vụ deployment `dpl_CtjAkZFbdPCjj58Zc9CfQ2ASGGsp` trên URL chính, đúng checksum ứng viên. Kiểm `/?p1`, manifest, worker và hai lối Phaser đều qua. B tắt nhật ký để quay lui là `dpl_5uLQGj4SYqgfNb1R4XaRNMtZCwTP`. Đã xác nhận quay về B tắt khi lượt QA đầu so nhầm dấu thời gian máy chủ; lượt kiểm lại đối chiếu dữ liệu nông trại đã lưu và giữ bản bật.

| Hạng mục | Kết quả |
|---|---|
| Giữ dữ liệu qua cập nhật | Chrome cập nhật PWA, dùng đúng gói cache mới và giữ tài khoản khách, vàng, kho, điền trang và Chương 1 khi mở lại. Manifest vẫn mở đúng đường Godot. |
| Ghi Supabase chính thức | Từ URL chính, hai sự kiện `SESSION` cùng mã QA, `ACTION: CHOOSE_PATH` và `TUTORIAL: MOVE` được Supabase trả HTTP 201. Mã nhìn thấy cuối **Sổ Gia Phả**. |
| Xuất nhật ký chính thức | Đạt ngày 22/11. PO xuất dữ liệu đã lọc từ Supabase VAC. Đối chiếu đúng một mã QA, hai phiên, một thao tác `CHOOSE_PATH` và hai mốc `MOVE`. Báo cáo LT-13 đọc 1/1 nhật ký. D1 chưa có dữ liệu đủ điều kiện trong lượt QA cùng ngày. |
| Mời người chơi | PO xác nhận đã gửi lời mời ngày 23/11. Đang thu mã và phản hồi. Dữ liệu QA giữ riêng khỏi danh sách mã tính D1. |

#### Đề nghị triển khai và mời nhóm thử

1. Dựng gói ứng viên từ đúng mã B, bật `playtest: true` cho Godot. Giữ URL P1, dự án Supabase và lối quay lui. Thử gói ứng viên trước khi gán URL chính. Khi được duyệt, bật trong khung chạy thử. Cờ áp dụng cho mọi phiên Godot mở bằng gói này trên URL chính. Thông báo về nhật ký chơi thử trong lời mời và gửi link cho nhóm đã chọn.
2. Trước khi mời, dùng một mã QA riêng trên chính bản ứng viên ở môi trường dự định mời. Kiểm mở từ icon, giữ phiên sau cập nhật, cùng mã qua hai lần mở; một thao tác thành công và một bước hướng dẫn có trong bản xuất từ `public.playtest_logs`. Kiểm đường lui về B hiện tại để tắt thu. Nếu thiếu mã hoặc thiếu bản ghi, dừng ở QA. Chỉ dùng môi trường dữ liệu thật sau khi PO duyệt.
3. PO chọn nhóm và gửi lời mời theo LT-13. Dùng Godot và giữ cùng thiết bị, trình duyệt hoặc icon suốt lượt thử. Ghi riêng mã chơi thử của người đã tham gia sau buổi đầu, dù họ chưa trả lời phiếu. Thu phiếu sau buổi đầu, không gợi ý cách chơi. Ngày hôm sau không nhắc quay lại.
4. Chốt danh sách mã đủ điều kiện, loại mã QA và lượt ngoài nhóm trước khi xuất nhật ký. Tính D1 khi ngày hôm sau của từng người đã kết thúc theo giờ Việt Nam. Báo số người đã bắt đầu, số mã ghép được, số người đủ điều kiện và kết quả LT-02. So bước rớt trong phễu với phản hồi. Khi chốt đợt, khôi phục gói B tắt nhật ký.

#### Lời mời nháp

> Mời bạn chơi thử VAC Online P1 tại https://vac-online-preview.vercel.app/?p1. Bạn có thể chơi trên điện thoại màn ngang hoặc máy tính. Hãy chơi theo hướng dẫn trong game và dùng cùng một cách mở (tab hoặc icon) trong suốt đợt thử. Game ghi lại các lần mở, bước hướng dẫn, thao tác thành công và mốc lên cấp bằng mã chơi thử. Sau buổi đầu, bạn gửi riêng cho mình mã ở cuối **Sổ Gia Phả** và phản hồi theo mẫu dưới đây nhé.

#### Phiếu phản hồi sau buổi đầu

**Kênh đề nghị.** Người chơi gửi riêng cho PO qua kênh nhận lời mời. PO ghi mã và phản hồi vào bảng riêng. Dùng mã 8 ký tự ở cuối **Sổ Gia Phả** để ghép nhật ký, không yêu cầu tên, email hay số điện thoại trong phiếu. Nếu chưa thấy mã, ghi “chưa thấy mã” để đếm phản hồi chưa ghép.

```text
Mã chơi thử (Sổ Gia Phả → cuộn xuống cuối):
1. Trong 5 phút đầu, bạn có hiểu mình cần làm gì không?
2. Bạn bị kẹt hoặc khó chịu ở chỗ nào?
3. Bạn thích nhất việc gì?
4. Ngày mai bạn có muốn quay lại không? Vì sao?
5. Hình và chữ có dễ nhìn trên máy bạn không?
6. Bạn dùng máy và trình duyệt nào? Bạn mở từ tab hay icon?
```

#### Bảng theo dõi riêng của PO

Dùng một dòng cho mỗi người được mời. Gán số thứ tự nội bộ và ghi mã sau buổi đầu, kể cả khi người đó chưa gửi phiếu. Dùng một mã cho mỗi người và giữ cùng nơi mở game. Nếu họ đổi thiết bị hoặc chuyển giữa tab và icon, để riêng các mã phát sinh để đối chiếu với nhật ký buổi đầu. Không nhắc người chơi quay lại ngày hôm sau.

| STT | Đã bắt đầu | Mã chơi thử | Thiết bị và cách mở | Đã nhận phiếu | Điểm kẹt | Trạng thái ghép |
|---|---|---|---|---|---|---|
| 01 |  |  |  |  |  |  |

Để trống mã khi chưa nhận được. Chỉ đưa mã đã xác nhận của nhóm thật vào truy vấn dưới đây. Giữ bảng theo dõi, phản hồi và nhật ký thô trong kênh riêng, ngoài GitHub.

#### Xuất theo mã và chốt báo cáo

Thay hai mã ví dụ trong `values` bằng danh sách đã xác nhận. Truy vấn chuẩn hóa chữ hoa và khoảng trắng, gộp mã lặp trong danh sách và chỉ xuất mã ghép duy nhất. Cột `review` ghi mã chưa có nhật ký hoặc ghép nhiều nhật ký. Chốt các trường hợp đó riêng trước khi dùng báo cáo. Đã diễn tập trên PostgreSQL cục bộ bằng dữ liệu giả, gồm mã lặp, mã trùng giữa hai nhật ký, mã thiếu và lượt ngoài nhóm. Báo cáo mẫu đọc 3/3 nhật ký đã ghép và tính D1 trên 2 người đủ thời gian.

```sql
with cohort as (
  select distinct lower(btrim(input.code)) as code
  from (values ('0123abcd'), ('4567efab')) as input(code)
  where nullif(btrim(input.code), '') is not null
),
matches as (
  select cohort.code, count(l.player) as match_count,
         jsonb_agg(l.log) filter (where l.player is not null) as logs
  from cohort
  left join public.playtest_logs as l
    on cohort.code ~ '^[a-f0-9]{8}$' and left(l.player, 8) = cohort.code
  group by cohort.code
)
select
  coalesce(
    jsonb_agg(logs -> 0 order by code) filter (where match_count = 1), '[]'::jsonb
  ) as logs,
  coalesce(
    jsonb_agg(jsonb_build_object('code', code, 'matches', match_count) order by code)
      filter (where match_count <> 1), '[]'::jsonb
  ) as review
from matches;
```

Lưu riêng giá trị mảng ở cột `logs` thành `logs.json`, rồi chạy `npm run playtest:report -- logs.json`. Chốt D1 sau khi ngày hôm sau của người cuối cùng trong nhóm đã kết thúc (giờ Việt Nam). Nếu báo cáo sớm hơn, ghi rõ số người còn chờ đủ thời gian. Dùng mẫu sau để trả kết quả tổng hợp cho PO.

```text
Khoảng thời gian chơi thử (giờ Việt Nam):
Đã mời / đã bắt đầu / đã nhận phiếu:
Mã ghép được / chưa có mã / mã cần đối chiếu:
D1 (quay lại / đủ điều kiện; tỷ lệ; kết quả so LT-02):
Bước rớt nhiều nhất và điểm kẹt tương ứng trong phiếu:
Vấn đề theo thiết bị hoặc cách mở:
Việc đề nghị sửa trước lượt thử tiếp theo:
```

**Phê duyệt.** PO đã chốt bật nhật ký và thu phản hồi riêng theo QD-96. Chỉ mời nhóm theo LT-13 sau khi báo kết quả QA trên Supabase chính thức cho PO.

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

**Trình tự phát hành.** Production đã chạy B theo QD-95. Xem ID bản dựng, QA và mốc quay lui trong [phiếu Production](qa/GODOT-PWA-STAGING-2026-11-19.md#chuyển-url-chính-sang-godot--21112026). Chuẩn bị hai bước triển khai. Bước đầu phục vụ cả hai gói với redirect còn tắt. Xác nhận mã bản dựng, phiên khách và nông trại trên cùng origin, xử lý hàng chờ Phaser, đọc bản lưu offline cũ và cập nhật PWA từ icon. Kiểm nhật ký P1-12 theo LT-13 trên dữ liệu thử. Sau khi QA ghi kết quả và PO cho phép chuyển URL, bật 307 cho nhóm P1. PO dùng URL này để mời nhóm theo QD-88.

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
