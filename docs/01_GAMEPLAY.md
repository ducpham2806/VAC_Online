# 01 · Gameplay

**Sở hữu:** luật chơi của mọi hệ thống (viết bằng chữ).
**Không chứa:** con số (dẫn mã `KT-` ở `03`), thông số từng loài (dữ liệu, `04` KY-20), cốt truyện và nhân vật (`02`), màn hình (`06`).
Hướng thiết kế: QD-12…15. Các mục AI đề xuất đã được PO duyệt hết ngày 10/11 (QD-18).

## Vòng chơi

### GP-01 · Vòng chơi
- **Phiên 5–15 phút:** đi một vòng nông trại → thu cái đã chín → tưới, gieo loài đúng mùa → cho vật nuôi ăn, nhặt sản phẩm → đưa nguyên liệu vào xưởng/bếp → giao đơn HTX → nhận vàng, XP, điểm điền trang → sửa một hạng mục hoặc khai thêm đất.
- **Trong ngày (giờ thật):** đơn mới, NPC có chuyện để nói hoặc nhận quà, thời tiết đổi, xưởng nấu xong.
- **Theo tuần (mùa):** đổi mùa thì đổi loài gieo được, có lễ hội của mùa, bản đồ đổi màu.
- **Dài hạn:** 10 Chương Gia Phả (`02` TG-30), mở 5 Đợt nội dung (GP-61), dựng lại toàn bộ điền trang.

### GP-02 · Điều khiển lai (QD-13)
- **Nhân vật:** người chơi điều khiển Điền chủ đi trên bản đồ nông trại (joystick hoặc chạm để đi, `06` UI-20).
- **Công cụ** đổi theo đối tượng được chạm, không cần chọn tay:
  - cuốc: đất hoang;
  - túi hạt: ô trống;
  - bình tưới: cây chưa tưới;
  - liềm hoặc tay: cái đã chín;
  - thức ăn: chuồng;
  - cần câu: ao, sông;
  - rìu/búa: gốc cây, đá;
  - búa sửa: hạng mục đổ nát (GP-14).
- **Tầm làm việc:** đối tượng ở gần nhân vật (ô đang đứng hoặc 8 ô xung quanh) thì làm ngay. Ở xa thì nhân vật tự đi tới rồi làm; đi bộ chỉ là hình thức, không tính thời gian chơi.
- **Làm cả loạt:** giữ và kéo qua nhiều ô để gặt, tưới hoặc gieo một lượt (giới hạn số ô mỗi lượt kéo: KT-16). Công cụ chốt theo ô đầu tiên của lượt kéo; ô cần công cụ khác bị bỏ qua. Kéo bắt đầu ngoài ruộng là kéo xem bản đồ.
- **Hành động cần nhân vật đứng đúng chỗ** (câu cá, đi rừng, nói chuyện với NPC): đi tới mới làm được.
- **Không chặn luật:** máy chủ không kiểm vị trí nhân vật; vị trí chỉ ảnh hưởng hình ảnh và trải nghiệm.

### GP-03 · Nguyên tắc thư thả (trụ cột 4)
- Không có gì chết vì vắng mặt.
  - Cây chín được giữ nguyên tới khi thu.
  - Cây chưa tưới vẫn lớn, chỉ chậm hơn (tưới là để rút ngắn thời gian).
  - Vật nuôi chưa cho ăn thì tạm ngừng cho sản phẩm.
- Không phạt người chơi quay lại sau nhiều ngày. Người ở xa lâu được quà "về thăm quê".

## Thời gian và mùa vụ

### GP-20 · Bốn mùa (QD-14)
- **Mùa chung toàn server:** Xuân → Hạ → Thu → Đông. Mỗi mùa dài 7 ngày thật, đổi lúc 00:00 thứ Hai giờ Việt Nam; một năm game là 28 ngày thật.
  - Lý do chung toàn server: cả làng cùng đón lễ hội.
- **Cây trồng** có danh sách mùa gieo được (cột `seasons` trong dữ liệu). Chỉ gieo được khi mùa hiện tại nằm trong danh sách đó.
  - Cây đã gieo vẫn lớn và thu được khi sang mùa khác; không héo.
- **Gán mùa** theo nông lịch Việt. Ví dụ: lúa (Xuân, Thu), su hào và cải (Đông), vải và nhãn (Hạ), đào và bưởi (Đông, cho Tết).
  - Loài ngắn ngày phổ biến được gieo ở 2–3 mùa, để mùa nào cũng có việc.
- **Cây lâu năm** (dừa, ổi, chuối, xoài…): trồng mùa nào cũng được, ra quả theo mùa của nó (QD-29).
- **Vật nuôi, thủy sản:** quanh năm.
- **Đơn hàng HTX** chỉ đòi loài thuộc Đợt đã mở và gieo được trong mùa này hoặc mùa trước.
- **Cây lớn theo giờ thật** (KT-11). Ngày và đêm trong game theo giờ thật Việt Nam, chỉ ảnh hưởng ánh sáng, nhạc và một số sự kiện đêm.

### GP-21 · Thời tiết
- **Thời tiết hằng ngày:** server chọn theo xác suất của mùa; nắng, mưa, giông (mùa Hạ), sương (mùa Đông).
- **Mưa:** mọi ô ngoài trời tính là đã tưới.
- **Giông:** có thể đổ giàn cây leo. Dựng lại giàn tốn 0⚡ và có cơ hội ra Hoàng Kim; bạn bè dựng giúp được.
- **Lịch mùa của các miền:** Nam (2 mùa mưa/khô) và Trung (mùa bão) dùng chung 4 mùa vụ, chỉ khác tên gọi và thời tiết (QD-22).

### GP-22 · Thể lực ⚡
- Chỉ việc nặng tốn ⚡: khai hoang, dọn đá và gốc cây, vét bùn ao, câu cá, đi rừng.
- Thao tác chăm nông trại thường ngày không tốn ⚡ (danh sách và số: KT-20).
- Hết ⚡ thì vẫn chăm nông trại bình thường, chỉ không làm được việc nặng. ⚡ hồi theo giờ thật, hoặc ăn món ăn để hồi thêm.

## Vườn – Ao – Chuồng

### GP-10 · Vườn: gieo, tưới, thu
- **Gieo:** gieo vào ô đã cuốc, mất tiền giống. Loài gieo được phải thỏa đủ: Đợt đã mở, đủ cấp, đúng miền, đúng mùa (GP-61, GP-20).
- **Giai đoạn lớn:** cây có 4 giai đoạn hình ảnh. Tưới rút ngắn thời gian còn lại (KT-11).
- **Thu:** thu hoạch vào Kho, không ra tiền ngay (QD-01). Bán ở HTX, nấu, giao đơn hoặc tặng.
- Cây thường thu một lần rồi gieo lại.

### GP-11 · Ô trồng trên bản đồ (QD-27)
- **Ô trồng:** mỗi ô trồng là một ô lưới 32×32 trên bản đồ tile (`05` AR-20), như các game nông trại đi bộ.
- **Bố cục:** người chơi tự cuốc đất ở vùng đã khai hoang, nên ruộng xếp theo ý mình.
- **Thay cho hệ cũ:** bỏ các "khu" 168×80 cố định của lưới 5×5.

### GP-12 · Ao, bùn phù sa và Hoàng Kim
- **Thủy sản:** thả con giống vào ao, thu nhiều mẻ (GP-13).
- **Bùn:** mỗi lần thu cá thì ao tích bùn. Vét bùn là việc nặng (⚡), được Bùn Phù Sa và có cơ hội nhặt Kỷ Vật (GP-72).
- **Bón Bùn:** bón cho cây đã tưới thì cây chín ngay, có xác suất thành **Hoàng Kim**: sản lượng ×3, ánh vàng (số: KT-12). Hoàng Kim nhân sản lượng, không nhân giá.

### GP-13 · Chuồng và Ao nhiều lứa
- **Con giống:** mua một lần, thu nhiều lứa (trứng, sữa, mẻ cá). Ô hiện "còn N lứa"; hết lứa thì ô trống để thả con mới (công thức N: KT-13).
- **Chăm sóc:** vật nuôi cần được cho ăn mỗi ngày thật để tiếp tục cho sản phẩm. Thức ăn từ Cối Xay Cám hoặc mua ở HTX.
- **Thương vật nuôi:** vuốt ve hằng ngày tăng độ vui; vui cao thì có cơ hội ra sản phẩm loại tốt (QD-18; số liệu chốt ở P2).

### GP-14 · Điền trang và khai hoang (khôi phục kiểu Green Farm 3)
- **Bắt đầu:** điền trang đổ nát. Có các **hạng mục khôi phục**: nhà chính, giếng, chuồng, ao, bếp, vườn cây, cổng.
  - Mỗi hạng mục sửa theo bậc, cần vàng và vật liệu (gỗ, đá, tre).
  - Sửa xong thì mở thêm chức năng hoặc chỗ chứa, gắn với Chương Gia Phả.
- **Khai hoang:** phần đất ngoài khu đã dọn bị đá, gốc cây, cỏ dại che. Dọn đá/gốc cây bằng rìu/búa (việc nặng, ⚡, KT-18) được vật liệu; cuốc đất hoang theo vùng (vàng + ⚡, KT-15).
- **Hỏi lại trước khi tiêu vàng:** sửa hạng mục và khai hoang hiện chi phí, thứ mở được, số đang có; người chơi bấm xác nhận mới trừ. Dọn chướng ngại (chỉ tốn ⚡) làm ngay.
- **Hạng mục đổ nát** hiện xỉn màu kèm đống gạch vụn; sửa xong hiện bình thường. Chuồng chưa sửa thì chưa có gà.
  - Vùng đất mở theo thứ tự cố định, vùng kế tiếp hiện mờ trên bản đồ.
  - Thay cho lưới 5×5 của QD-05 (QD-27).
- **Phong Thủy:** điểm mỹ quan tăng khi sửa hạng mục và đặt trang trí. Đạt mốc Phong Thủy thì có thưởng và mở trang trí mới (QD-18).

## Chế biến và người làm

### GP-30 · Xưởng và Bếp (QD-08)
- **Xây xưởng:** xưởng (`MAC_`) xây bằng vàng; mỗi xưởng nấu 1 mẻ một lúc, có hàng chờ.
- **Nồi Đất:** bỏ 2–4 nguyên liệu để khám phá công thức. Công thức đúng được ghi vào Sổ tay món và có thưởng (KT-30); sai thì trả lại nguyên liệu.
- **Món ăn:** dùng để ăn hồi ⚡, giao đơn, tặng NPC hoặc bán.
- **Xưởng nghề** (Đan Lát, Khung Cửi): làm đồ thợ và vật phẩm trang trí từ nông sản.
- Thời gian, nguyên liệu, giá: dữ liệu (`machineId`, `recipe`).

### GP-33 · Lán Thợ (QD-09, QD-10, QD-11)
- **Mở muộn:** từ Đợt 2. Người chơi phải tự làm quen việc đồng áng trước khi có người phụ.
- **Thợ chỉ thu và tưới, không gieo.**
  - Chỉ thu ô đã chín ít nhất một khoảng chờ, để chủ vườn và hàng xóm còn kịp.
  - Hàng thu được vào Giỏ Thợ riêng; người chơi phải tự nhận về Kho. Thợ không tạo XP.
- **Độ No:** giảm theo ngày. Đói thì nghỉ làm, tự ăn ở Bàn Ăn nếu người chơi đã dọn món.
- **Hợp đồng** trả trước theo ngày. Có thể cấp đồ thợ (đỡ đói) và Phụ Cấp Ngày Mùa (tưới hiệu quả hơn).
- **Server tính bù** khi người chơi vắng mặt (lazy-tick).
- Số liệu: KT-35.

## Giao thương và hàng xóm

### GP-40 · Đơn hàng HTX và tàu Bắc–Nam
- **Bảng đơn HTX:** luôn có vài đơn. Mỗi đơn đòi 1–3 loại hàng, thưởng cao hơn bán thẳng (KT-14). Bỏ đơn thì đơn mới về sau một khoảng chờ.
- Đơn chỉ đòi hàng đã mở và đúng mùa (GP-20).
- **Tàu Bắc–Nam** (Đợt 3): vài chuyến mỗi ngày, mỗi chuyến 3 toa × 3 kiện hàng.
  - Đủ một toa thì có vàng + XP; đủ cả tàu thì có rương thưởng.
  - Hàng xóm được đóng giúp 1 kiện mỗi chuyến, cả hai cùng có thưởng.
- **Thương lái ghé** theo giờ (Đợt 3): mua giá cao trong thời gian ngắn, với trần số lượng.

### GP-41 · Thăm và giúp hàng xóm
- **Thăm và giúp** (Đợt 3): thăm nông trại bạn bè; giúp tưới, cho ăn, dựng giàn đổ, có giới hạn số lần mỗi nhà mỗi ngày. Người giúp có quà nhỏ, chủ nhà được rút ngắn thời gian. Ký Sổ Lưu Bút.
- **Hái trộm:** giữ luật đã chốt (QD-03, QD-06; số liệu KT-32).
  - Chỉ trộm được trong cửa sổ ngắn sau khi chín. Chủ luôn giữ phần lớn sản lượng.
  - Chó và Ngỗng có thể bắt kẻ trộm; bị bắt thì mất vàng (zero-sum).
  - Người chơi tự bật/tắt "vườn mở cho hái trộm" (QD-18), và có thưởng nhỏ nếu bật. Mục đích là giữ trụ cột 3 (làng giúp nhau, không phá nhau).

### GP-42 · Chợ phiên P2P (Đợt 3)
- **Sạp:** mỗi người có vài ô bày bán. Giá đăng trong khung cho phép, người bán chịu thuế (KT-31).
- **Thanh toán:** tiền được giữ trung gian tới khi có người mua; mỗi món chỉ bán được một lần.
- **Chống chuyển vàng:** giới hạn giá trị giao dịch giữa hai người mỗi ngày.

## Làng và con người

### GP-50 · NPC và tim (kiểu Harvest Moon)
- **Tim:** mỗi NPC chính có thanh 0–10 tim.
- **Tăng tim:** nói chuyện mỗi ngày (một lần có tác dụng); tặng quà (một quà có tác dụng mỗi ngày). Quà hợp sở thích thì tăng nhiều; quà ghét thì giảm nhẹ. Tham gia lễ hội và làm việc nhờ cũng tăng tim.
- **Mốc 2/4/6/8/10 tim:** mở cảnh sự kiện ngắn, công thức, giảm giá hoặc nhờ vả mới.
- **Sở thích:** ghi trong dữ liệu NPC (`02` TG-20). Hồ sơ NPC chỉ hiện sở thích người chơi đã phát hiện.
- **Lời thoại** theo mùa, thời tiết, số tim và chương.
- **Chạm NPC** (hoặc nút hành động khi đứng cạnh) mở hộp thoại: chào hỏi, tặng quà từ Kho. NPC chưa chào trong ngày có 💬 trên đầu. Số điểm: KT-19.

### GP-52 · Hẹn hò và cưới (Đợt 5)
- **Ứng viên:** có tên ở `02` TG-20. Đạt 10 tim (QD-25) và tặng tín vật Trầu Cau thì tổ chức lễ cưới ở Đình.
- Bạn bè đến dự được.
- **Sau cưới:** bạn đời phụ việc nhà mỗi ngày; sau đó có con (Bé Tiểu Đồng, lớn qua 3 giai đoạn).

### GP-60 · Ba miền (QD-15)
- **Thiết kế đầy đủ:** người chơi chọn 1 miền khi bắt đầu.
  - Phần lớn loài là chung; mỗi miền có 10 loài đặc sản riêng.
  - Thực tế đếm được 30/81 loài là đặc sản. Mỗi người chơi thấy 61 loài; đặc sản chiếm ~16% số loài với một người chơi.
  - Mỗi miền có thưởng nhỏ riêng (KT-50), cảnh quan và phương ngữ NPC riêng (`02` TG-10).
- **Loài của miền khác:** mua ở Chợ phiên, hoặc nhận Túi Hạt Giao Thoa (trồng được 3 vụ, KT-45) từ Thương Đội Liên Gia.
  - Thương Đội Liên Gia: 3 người chơi khác miền cùng góp hàng; chỉ chạy khi đã mở đủ 3 miền.
- **Bản chơi thử và closed beta:** chỉ 1 miền: Bắc Bộ (QD-21). Màn tạo nhân vật hiện 2 miền còn lại là "sắp mở".

### GP-61 · Mở khóa nội dung
- **Đợt và chương:** một loài gieo hoặc nuôi được khi thỏa đủ:
  - (1) Đợt của nó đã phát hành;
  - (2) đã mở chương tương ứng;
  - (3) đủ cấp;
  - (4) đúng miền;
  - (5) đúng mùa, chỉ áp cho cây trồng.
- **Năm Đợt:** lũy kế 23 → 45 → 63 → 76 → 81 loài V-A-C. Đợt của từng loài nằm ở dữ liệu (`unlockWave`, có test khóa).
- **Khay giống:** loài bị khóa vẫn hiện, ghi rõ điều kiện ("Mở ở Chương N", "Gieo được mùa Hạ").
- **Kiểm tra thiếu loài:** với 1 miền, Đợt 1 chỉ có ~21 loài, chia 4 mùa là mỏng. Khi gán mùa phải đảm bảo mỗi mùa có ≥ 6 loài cây gieo được. Nếu thiếu thì kéo sớm một phần Đợt 2 (QD-18; chốt khi thêm cột `seasons`, `07` LT-10 P0-3).

### GP-62 · Hướng dẫn tân thủ
- **Người dẫn:** Bác Bảy dẫn tối đa 8 bước trong Chương 1–2.
- **Các bước:** đi lại, cuốc, gieo, tưới, thu, bán HTX, giao đơn đầu tiên, vét bùn và bón bùn.
- **Cách chạy:** mỗi bước tự xong theo trạng thái game, có thể ẩn. Không chặn người chơi làm việc khác.
- **Bản thử (QD-84):** 8 bước — đi lại, gieo, tưới, gặt, bán HTX, dọn đá, sửa Giếng, sửa Nhà; xong thì nhắc mở Gia Phả nhận Chương 1. Mũi tên trên bản đồ chỉ chỗ cần làm; thiếu vật liệu thì chỉ chỗ lấy (`src/game/slice/sliceTutorial.ts`).
- Code MVP cũ: `src/domain/tutorial.ts` (theo luật cũ).

### GP-63 · Nhiệm vụ
1. **Chính tuyến:** 10 Chương Gia Phả. Mục tiêu đo được trên server; bộ đếm có sẵn: tưới, thu theo loài, vét bùn, bón bùn, xây, nấu, thuê, dọn món, cấp đồ. Mỗi chương có một lựa chọn "tình nghĩa / thực dụng" ảnh hưởng thưởng (`02` TG-30).
2. **Điểm danh 7 ngày tân thủ.**
3. **Hằng ngày:** đơn HTX, tàu, Thực Khách Bí Ẩn đố ca dao (GP-73).
4. **Quan hệ:** nhờ vả của NPC theo tim (GP-50), chuyện đời các thợ.
5. **Theo mùa:** lễ hội (GP-70), sưu tầm Kỷ Vật.

## Lễ hội và nội dung chiều sâu

### GP-70 · Lễ hội theo mùa
- **Lịch:** mỗi mùa có 1–2 lễ hội cố định ở ngày thứ N của mùa (lịch: `02` TG-50).
- **Diễn ra:** ở quảng trường làng.
- **Tham gia:** nộp hàng hoặc chơi một trò ngắn. Thưởng là đồ trang trí, danh hiệu, 🏮, tim với NPC.
- **Đình Làng:** sửa theo bậc như hạng mục điền trang (GP-14), mỗi bậc mở lễ hội lớn hơn. Làm theo mốc cá nhân, không có hội (QD-24).

### GP-71 · Canh nồi Bánh Chưng (Tết, Đông → Xuân)
- **Nấu:** người chơi nộp nguyên liệu để nấu một nồi.
- **Bạn bè giúp:** tối đa 5 bạn tiếp củi (0⚡), mỗi lần rút ngắn thời gian, người giúp nhận lì xì. Nồi nấu 6h (QD-26).
- **Kết quả:** bánh thường hoặc bánh Hoàng Kim.

### GP-72 · Kỷ Vật tuổi thơ 8x–9x
- **Bộ sưu tập:** 12 món kỷ vật (máy chơi game cầm tay, băng cassette, đèn ông sao…).
- **Nguồn rơi:** khi vét bùn, đi rừng, cuốc đất hoang, câu cá.
- **Đổi:** đổi 1-1 cùng bậc với hàng xóm, có phí (KT-45).
- **Thưởng:** đủ bộ thì có thưởng lớn và mở bản nhạc riêng. Trưng bày trong nhà chính.

### GP-73 · Thực Khách Bí Ẩn đố ca dao (Đợt 2)
- **Lịch:** 2 khung giờ mỗi ngày, Cụ Đồ ra câu đố ca dao về món ăn.
- **Trả lời:** dọn đúng món trong thời gian giới hạn thì có thưởng (vàng, 💎, ⚡). Món đố chỉ dùng nguyên liệu đã mở.

### GP-74 · Thời trang và trang trí (Đợt 4)
- **Thời trang:** 12 ô trang phục kiểu búp bê giấy (paper-doll), chỉ để đẹp; không tăng chỉ số (KT-60).
- **Trang trí:** đặt tự do trên điền trang, tính vào Phong Thủy.

### GP-75 · Cây đột biến (Đợt 4)
- **Tạo:** hai cây Hoàng Kim cạnh nhau, khi bón bùn có xác suất nhỏ ra hạt đột biến. Có bảo hiểm sau N lần thất bại.
- **Chiết cành:** ở Vườn Ươm Đình Làng.

### GP-76 · Khám phá: Rừng Trúc và bãi sông
- **Khu ngoài nông trại:** đi bộ tới bằng nhân vật; mỗi lần vào tốn ⚡.
- **Có gì:** hái măng, nấm, phấn hoa đột biến; nhặt gỗ và đá; cơ hội gặp Kỷ Vật. Đồ hái được làm mới theo ngày và theo mùa.

### GP-77 · Câu cá (mới)
- **Câu:** đứng ở bờ ao hoặc sông, thả câu, canh nhịp kéo (trò 1 nút). Tốn ⚡ mỗi lần câu.
- **Cá câu được:** theo mùa và thời tiết; khác với cá nuôi trong ao. Có Sổ Cá để sưu tầm.

### GP-78 · Homestay (Đợt 5)
- **Nâng cấp:** nhà chính nâng thành Homestay 2 cấp (Nhà Sàn Tre, Biệt Thự Đầm Sen).
- **Khách:** các nhóm khách đặt phòng. Người chơi dọn món và dẫn khách tham quan vườn để nhận Vé Du Lịch, 💎, danh vọng.

## Sau bản 1.0

### GP-80 · Sảnh Chung, PK, Hyper-Casual (`07` LT-04)
- **Sảnh Chung "Chợ Đình":** nhiều người cùng đi lại, khoe trang phục, chat bong bóng, biểu cảm Múa Lân / Múa Sạp. Dùng lại bộ điều khiển đi bộ của nông trại. Số người mỗi phòng: QD-23.
- **PK dân gian không bạo lực:** Đi Cầu Tre Gậy Bông, Vật Sới Đình, Cướp Cờ, Bắt Vịt Vàng. Tốn ⚡ (QD-04). Chỉ làm khi có trọng tài server (`04` KY-60).
- **Máy Thùng:** minigame 30–45 giây, có trần thưởng (KT-40). Không cược vàng.
