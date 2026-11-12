# 07 · Lộ trình

**Sở hữu:** các pha phát triển, cổng kiểm chứng, nội dung mỗi pha, thẻ việc đang chạy. **Không chứa:** luật chơi (`01`), con số (`03`), lý do chiến lược dài (`docs/REVIEW-2026-11-10.md`).
Trạng thái: PO duyệt lộ trình này (QD-18, QD-20). Đang chạy P1 (LT-12). Việc tài liệu (LT-11) đã được PO cho làm trước (QD-17).

### LT-01 · Nguyên tắc
1. Mỗi pha kết thúc bằng cổng đo được trên người chơi thật. Chưa qua cổng thì không mở nội dung mới.
2. Thẻ việc nhỏ (1–3 ngày) có file đích, tiêu chí nghiệm thu, bằng chứng (mẫu ở `docs/WORKFLOW.md`).
3. PO chỉ duyệt 3 loại việc: số liệu kinh tế, DB/kiến trúc, phạm vi/core loop. Việc khác AI tự làm, CI là cổng chặn.

### LT-02 · Các pha (ước lượng thô, 1 người + AI)
| Pha | Thời lượng | Nội dung | Cổng qua pha |
|---|---|---|---|
| **P0 Chốt nền** | 1–2 tuần | Tài liệu mới (LT-11); 5 sprite mẫu đúng `05`; ADR kiến trúc `04` KY-10; pipeline dữ liệu KY-20; thêm cột mùa cho dữ liệu | PO duyệt tài liệu + ADR + art mẫu |
| **P1 Vertical slice** | 3–4 tuần | Xem LT-03 | 10–20 người chơi thử; giả định: ≥ 50% quay lại ngày hôm sau |
| **P2 Closed beta Đợt 1** | 4–6 tuần | Đủ Đợt 1 của miền đầu tiên, Chương 1–2, khai hoang, bùn Hoàng Kim, đơn HTX, 1 lễ hội | 50–100 người; đo D1/D7, phễu tân thủ, Sources/Sinks thật |
| **P3 Soft launch PWA** | 2–3 tuần | Hiệu năng di động, tài khoản an toàn, kiểm pháp lý (QD-32) | 2 tuần không lỗi lệch tiền |
| **P4 Các Đợt nội dung** | 4–6 tuần/Đợt | LT-05 | Mỗi Đợt: kiểm cân bằng trên số liệu thật, D7 không giảm |
| **Sau 1.0** | — | Miền thứ 2 và 3; Sảnh Chung (GP-80); app Capacitor | Cộng đồng đủ đông |

### LT-03 · Vertical slice (P1)
- **Miền:** Bắc Bộ (QD-15, QD-21).
- **Bản đồ:** điền trang đổ nát với 3 hạng mục sửa được (nhà, giếng, chuồng gà).
- **Nhân vật:** đi lại có công cụ cuốc / tưới / liềm; chạm nhanh vào ô (GP-02).
- **Nội dung:** ~8 loài trải 2 mùa (5 cây, 2 vật nuôi, 1 cá); 1 xưởng (Bếp Củi); bảng đơn HTX.
- **Làng và cốt truyện:** 2 NPC có tim; Chương 1; 15 phút đầu có hướng dẫn.
- **Hạ tầng:** lưu online; công tắc đổi mùa cho bản thử.
- **Art:** mọi thứ xuất hiện phải là art thật đúng `05`.

### LT-04 · Ngoài bản 1.0
- Xổ số, gacha Đập Niêu, cược vàng PK.
- Loạn Chiến 8–12 người, Máy Thùng Hyper-Casual, PK realtime.
- Ý tưởng giữ ở `01` GP-80. Kiếm tiền: KT-60 (QD-19).

### LT-05 · Nội dung theo Đợt (sau khi qua P2)
| Đợt | Lũy kế loài | Hệ thống mới | Chương |
|---|---|---|---|
| 1 | 23 | Vườn-Ao-Chuồng cơ bản, khai hoang, bùn Hoàng Kim, HTX | 1–2 |
| 2 | 45 | Bếp + xưởng nghề, Lán Thợ (GP-33), lễ hội mùa đầu tiên | 3, 6, 7 |
| 3 | 63 | Chợ phiên, thăm và giúp hàng xóm, tàu Bắc–Nam (GP-40) | 4–5 |
| 4 | 76 | Đình làng, cây đột biến, kỷ vật, thời trang | 8–9 |
| 5 | 81 | Cưới (GP-52), homestay, Tết | 10 |

Danh sách loài cụ thể của mỗi Đợt nằm ở dữ liệu (`unlockWave`); luật mở khóa ở `01` GP-61.

### LT-10 · Thẻ việc P0
| ID | Việc | Phụ thuộc | Trạng thái |
|---|---|---|---|
| P0-1 | Bộ tài liệu mới `docs/00 → 08` | QD-12…17 | DONE 10/11 (LT-11) |
| P0-2 | 5 sprite mẫu (1 cây 4 giai đoạn + mùa, 1 gà, 1 cá, nhân vật đi 4 hướng, ô đất 2 mùa) qua `/vac-asset-audit` | QD-33, QD-80 | DONE 10/11: mẫu vẽ code + ảnh thật PO tạo, nhập bằng `import_sheet.py` (`art/source/p0_ai/`) |
| P0-3 | ADR-001 một bản luật TS; ADR-002 trạng thái + sổ cái tiền tệ; ADR-003 pipeline dữ liệu (thêm cột `seasons`) | QD-20 | DONE 10/11 (`docs/adr/`, cột `Seasons`, `src/domain/season.ts`) |
| P0-4 | Thử nghiệm kỹ thuật: "gieo → thu → bán" chạy luật TS trên Edge Function có khóa phiên bản, đo độ trễ | P0-3 | DONE 10/11 ở máy cục bộ (`prototypes/p0-4-edge/`) |
| P0-6 | Đo độ trễ P0-4 trên Supabase thật (project cũ, mục tiêu p95 < 400 ms); bảng mới không trùng bảng MVP nên áp được kiểu thêm | QD-81 | DONE 11/11 (gộp P1-8: xử lý trên server p95 11 ms; đo từ máy cloud xa, tính cả mạng, p95 379 ms) |
| P0-5 | Wireframe mới cho HUD điều khiển lai (`06` UI-20) | P0-1 | DONE 10/11 (`docs/wireframes/`) |

### LT-12 · Thẻ việc P1 (vertical slice LT-03)
Thứ tự: làm phần client chạy offline trước (một bản luật chạy ngay trên máy, ADR-001), nối server sau khi có quyền project VAC (P0-6). Bản thử mở bằng `?p1` trên URL, game MVP cũ vẫn chạy như cũ cho tới P1-12.
| ID | Việc | Nghiệm thu | Phụ thuộc | Trạng thái |
|---|---|---|---|---|
| P1-1 | Atlas `slice` từ `art/source/p0_ai/` (QD-82: gà ~40×40, lúa không ụ bùn) | `public/assets/atlas/slice.*`, `/vac-asset-audit` 0 lỗi | P0-2 | DONE 10/11 |
| P1-2 | Đưa engine P0-4 vào `src/engine/` (dùng chung client + Edge Function) | prototype import từ `src/engine`; test cũ vẫn qua | P0-4 | DONE 10/11 |
| P1-3 | Scene điền trang `EstateScene`: bản đồ ô 32×32, nhân vật đi 4 hướng; joystick nổi góc dưới trái + chạm đất để tự tìm đường (UI-20) | Chụp 1280×720 và 844×390; test tìm đường | P1-1 | DONE 10/11 |
| P1-4 | Chạm ô → tự chọn công cụ (GP-02); xa thì đi tới rồi làm; kéo làm cả loạt ≤ 12 ô (KT-16); gọi engine | Test domain; quay màn hình gieo → tưới → gặt | P1-2, P1-3 | DONE 10/11 (`src/domain/tools.ts`, `tools/qa/p1-slice-smoke.cjs`) |
| P1-5 | HUD lai React (UI-20, UI-30): nút hành động, thanh công cụ thu gọn, mùa + "còn N ngày", 🪙 ⚡ | Chụp 2 cỡ, mọi nút ≥ 44 px | P1-3 | DONE 10/11 (`src/ui/hud/SliceHud.tsx`; túi hạt đã lọc theo mùa) |
| P1-6 | Mùa trên bản đồ: cỏ đổi màu theo mùa (AR-11), khay giống lọc theo mùa, công tắc đổi mùa cho bản thử (chỉ DEV/thử) | Test lọc mùa; chụp Xuân/Đông | P1-5 | DONE 10/11 (công tắc trong ⚙️; ảnh `docs/screenshots/p1-6-*`) |
| P1-7 | Lưu cục bộ trạng thái bản thử (`version` + `migrate`), đồng bộ lô thao tác khi có server | Tải lại trang không mất tiến trình | P1-2 | DONE 10/11; đồng bộ server 11/11 (P1-8, `src/services/sliceSync.ts`) |
| P1-8 | Schema mới trên project VAC (viết lại một lần, QD-81): `farm_states`, `ledger`, `_commit_farm_state`, Edge Function `apply-actions` | test SQL; p95 < 400 ms (gộp P0-6) | Quyền Supabase project VAC; PO duyệt migration | DONE 11/11 (QD-89; đã áp DB thật + đã triển khai function; `tools/qa/p1-8-online-smoke.cjs`) |
| P1-9 | Nội dung 8 loài 2 mùa Bắc Bộ (5 cây, 2 vật nuôi, 1 cá) + art theo prompt; Bếp Củi; bảng đơn HTX | Dữ liệu từ `catalog.csv`; `/vac-balance-check` | P1-4; QD-86 | DONE 11/11 (QD-86, QD-87; `tools/qa/p1-9-smoke.cjs`; ảnh `docs/screenshots/p1-9-*`) |
| P1-10 | Sửa 3 hạng mục điền trang (nhà, giếng, chuồng gà) (GP-14) | Bản đồ đổi hình khi sửa; test luật | P1-4; QD-83 | DONE 10/11 (`src/domain/estate.ts`; ảnh `docs/screenshots/p1-10-*`) |
| P1-11 | 2 NPC có tim, Chương 1, hướng dẫn 15 phút đầu (GP-50, GP-62, TG-30) | Người mới chơi hết hướng dẫn không kẹt | P1-5, P1-10; QD-84 | DONE 10/11 (`tools/qa/p1-tutorial-smoke.cjs`; ảnh `docs/screenshots/p1-11-*`) |
| P1-12 | Chơi thử 10–20 người, đo quay lại ngày hôm sau (cổng LT-02) | Báo cáo số liệu | P1-1…11; QD-88 | ĐANG LÀM: bộ đo, báo cáo, kế hoạch LT-13, gửi sự kiện lên server (P1-8) xong 11/11; chờ PO triển khai link và mời người chơi |

### LT-13 · Kế hoạch chơi thử P1-12 (QD-88)
- **Mục tiêu:** kiểm cổng LT-02 (tỉ lệ quay lại ngày hôm sau) và tìm chỗ người mới bị kẹt.
- **Người chơi:** 10–20 người chưa biết game, chơi trên điện thoại màn ngang hoặc máy tính. Không hướng dẫn thêm ngoài game; ngày 2 không nhắc để đo đúng việc tự quay lại.
- **Link:** PO tự triển khai. `npm run build` ra thư mục tĩnh `dist/`, đưa lên hosting bất kỳ (`vercel.json` có sẵn rewrite), gửi người chơi `<link>/?p1`.
- **Số liệu tự ghi trong game** (ẩn danh, không tên/email; mã chơi thử hiện ở ⚙️ Cài đặt):
  - Sự kiện: mở phiên, thao tác thành công theo loại, lên cấp, bước hướng dẫn. Dạng dữ liệu: `src/game/slice/playtest.ts`.
  - D1 = số người có sự kiện ở ngày (giờ VN) ngay sau ngày đầu ÷ số người đã qua hết ngày hôm sau đó.
  - Kèm: phễu 8 bước hướng dẫn, thời lượng phiên đầu, số phiên, cấp cao nhất (trung vị).
  - Thu về: game tự gửi lên bảng `playtest_events` (P1-8) mỗi 30 giây và khi rời trang. Xuất cho báo cáo: chạy `select json_agg(log) from public.playtest_logs;` trong SQL Editor, lưu kết quả thành `logs.json`.
- **Báo cáo:** `npm run playtest:report -- <file.json>` (mảng nhật ký mỗi máy) → D1 so cổng LT-02, phễu, thao tác.
- **Phiếu hỏi sau buổi đầu** (kèm mã chơi thử): (1) Có hiểu phải làm gì trong 5 phút đầu không? (2) Chỗ nào bị kẹt hoặc khó chịu? (3) Thích nhất việc gì? (4) Ngày mai có muốn quay lại không, vì sao? (5) Hình, chữ có dễ đọc trên máy của bạn không? (6) Máy và trình duyệt đang dùng.


### LT-14 · Kế hoạch chuyển P1 sang Godot 4 (QD-90)

**PO đã duyệt bắt đầu bước 0 ngày 11/11.** Chuyển P1 Bắc Bộ theo LT-12 trước khi mở nội dung P2. Chốt một commit Phaser làm mốc hành vi, hình ảnh và dữ liệu thử. Dùng bản đó để đối chiếu và quay lui trong thời gian chuyển. Sau khi nghiệm thu, tính năng mới đi vào client Godot.

**Tác động**

1. **Core VAC.** Giữ hành vi gieo, tưới, thu, bán và điều khiển theo GP-02. Dùng các kịch bản P1 hiện có làm tiêu chí đối chiếu.
2. **Kinh tế.** Dùng lại engine TypeScript của server và dữ liệu chuẩn KY-20. So kết quả tiền, kho, XP, thể lực theo cùng chuỗi thao tác.
3. **Art/UI.** Nhập lại PNG và vùng cắt atlas `slice`, `estate`, giữ lưới và điểm neo theo AR-20. Chuyển hoạt ảnh, VFX và HUD sang Godot theo AR-30, AR-31, UI-20 và UI-30. Làm lại phần âm thanh đang tổng hợp bằng WebAudio.
4. **Module cũ.** Viết client mới trong `godot/`. Tách scene bản đồ và UI khỏi lớp gửi thao tác, lưu tiến trình và đăng nhập. Dùng lại dữ liệu và kịch bản kiểm thử.
5. **DB.** Giữ schema, RLS và `apply-actions` hiện tại cho P1 theo QD-89. Dùng môi trường thử được phép. Nếu phát sinh nhu cầu đổi hợp đồng hoặc schema, trình PO duyệt riêng trước khi sửa.

| Bước | Việc và đầu ra | Điều kiện qua bước | Ước lượng ngày làm việc |
|---|---|---|---:|
| 0. Kiểm chứng web | Ghim Godot 4.7.2 stable và export templates đồng phiên bản. Dùng GDScript, renderer Compatibility và Web export đơn luồng. Dựng một cảnh có người, ruộng, nút chạm và một lượt lưu/đọc qua `apply-actions` ở môi trường thử. Xuất Web/PWA trên HTTPS. | Chrome Android và Safari iPhone thật mở được từ URL lẫn icon đã cài. Kiểm màn ngang, chạm, đóng rồi mở lại thấy đúng dữ liệu. Ghi thiết bị, thời gian tải nguội/ấm tới lúc chơi được và FPS, đối chiếu Phaser trên cùng máy. Chốt cấu hình sau kết quả. | 2–3 |
| 1. Dựng lát cắt ruộng | Tạo `TileMapLayer`, camera, sắp lớp theo y, chạm-đi-tới, joystick và HUD. Sinh tài nguyên Godot từ dữ liệu/atlas hiện có. Dùng dữ liệu kiểm thử cố định để dựng luồng gieo → tưới → gặt → bán cùng hoạt ảnh. | Đối chiếu hành vi, lớp hình và thao tác theo LT-12. Chụp hai cỡ UI-10. CI nhập dự án, chạy kịch bản headless và xuất Web được. | 4–6 |
| 2. Nối lưu online | Nối Supabase Auth và `apply-actions` cho Web và native, làm mới phiên, đồng bộ trạng thái và ghi nhật ký LT-13. Xem [cấu hình và kiểm thử](GODOT-ONLINE.md). | Cùng tài khoản thử mở lại đúng nông trại. So vàng/kho/XP và lỗi từng thao tác. Kiểm CORS, tải lại, hết hạn phiên và mất mạng khi gửi. Đo độ trễ trên điện thoại theo QD-89. | 3–5 |
| 3. Hoàn tất P1 | Chuyển mùa vụ, điền trang, vật nuôi, bếp, đơn HTX, NPC, Chương 1, hướng dẫn và âm thanh. Dùng atlas và mã sự kiện sẵn có. | Các kịch bản LT-12 đi hết. Người mới hoàn tất hướng dẫn, nhật ký đọc được bằng báo cáo LT-13. Chạy lại kiểm thử web trên máy thật. | 6–9 |
| 4. Phát hành web/PWA | Thử trên bản dựng staging. Chốt phương án phiên, bản lưu cũ và hành vi offline. Kiểm tải lại khi lên phiên bản, mở từ icon, mất mạng và quay lui bằng artifact Phaser đã chốt. | PO duyệt bản Godot, QA xác nhận tiến trình, cache và điều khiển đạt yêu cầu. Sau đó chuyển URL chính và chạy chơi thử theo LT-13. | 3–5 |
| 5. Xuất app khi cần | Dùng cùng dự án Godot để xuất Android trước. APK để thử nội bộ, AAB khi phát hành Google Play. iOS dùng Xcode trên macOS và TestFlight khi có nhu cầu. | Kiểm cài mới, nâng phiên bản, lưu, cảm ứng, safe-area, âm thanh và trở lại sau khi chạy nền trên máy thật. | Tách khỏi mốc web |

**Giữ tiến trình khi chuyển client.** Trạng thái online gắn với tài khoản Supabase. Thử giữ phiên khi chuyển trên cùng origin. Nếu khác origin hoặc chuyển sang app, thử phương án liên kết tài khoản để người chơi truy cập lại nông trại. Bản lưu offline và hàng chờ cũ cần bộ mẫu đọc thử, xác nhận sau nhập và cách quay lui. Khi một yêu cầu gửi đi có kết quả chưa rõ, đối chiếu trạng thái server trước khi gửi lại thao tác có thể cộng/trừ hai lần. Đề xuất bổ sung chống xử lý trùng ở server nếu kiểm thử chứng minh cần, theo RULE D1.

**Phần offline cần PO chốt.** Bước 0–2 ưu tiên online và thử mở lại PWA đã tải. Đề xuất bản Godot đầu tiên cho xem trạng thái đã tải khi mất mạng, báo rõ thao tác đang chờ xác nhận và tiếp tục sau khi kết nối lại. Chơi hoàn toàn offline như chế độ thử `?p1&offline` cần phương án giữ một bộ luật theo ADR-001. Nếu bắt buộc có ở đợt đầu, thử khả năng dùng lại bộ luật trên cả Web và native rồi ước lượng riêng trước khi phát hành.

**Tổng dự kiến** 18–28 ngày làm việc tới web/PWA với một người và AI. Chốt lại sau bước 0 và sau khi xác định yêu cầu offline. Kiểm thử người chơi theo LT-13 và xuất app tính riêng.

**Chạy lại bước 0.** Cài Godot 4.7.2 và Web export template đơn luồng đồng phiên bản. Dựng bản Web, chạy bộ thử Deno/PostgreSQL, rồi chạy máy chủ Web ở terminal khác.

```bash
npm ci
GODOT_BIN=/duong/dan/Godot bash scripts/build-godot-web.sh
PG_BIN=/duong/dan/postgresql/bin DENO=/duong/dan/deno bash tools/qa/edge/run-local.sh --serve
python3 tools/qa/serve-godot-probe.py
```

Mở `http://127.0.0.1:4173/`. Bộ thử chỉ có một nông trại mẫu, qua handler và sổ cái thật trên PostgreSQL tạm với danh tính giả. Khi đưa qua HTTPS thử nghiệm, chạy máy chủ Web với `VAC_GODOT_PREVIEW_ORIGIN` bằng origin HTTPS chính xác. Trên máy thật, thử gieo khi ô trống, thêm vào màn hình chính, mở từ icon và đối chiếu trạng thái. HUD hiển thị FPS và thời gian tới khi đọc xong nông trại.

- [x] ~~Bản đồ cảnh thử chỉnh được trong Godot Editor.~~ Mở `estate_map.tscn` để tô `Terrain/Ground` và dời `PlayerSpawn`. Mở `estate_features.tscn` để dời công trình, đá, cây và vùng đất. Bấm F5 chạy `estate_probe.tscn`. Khi mới clone, chạy build với `--prepare-only` để nhập dữ liệu và sprite vào Editor.
- [x] ~~Thử hoạt ảnh theo AR-30, AR-31 trên cảnh hiện có.~~ Chạm để đi hoặc dùng phím mũi tên/WASD. Chỉnh khung hình và tốc độ trong `farmer.tscn`, chỉnh bụi đất và hạt trong `sow_fx.tscn`. Hiệu ứng chỉ chạy khi có phản hồi gieo thành công.
- [x] ~~Thử joystick nổi theo UI-20.~~ Giữ và kéo ở vùng dưới trái, dùng ngón khác chạm ô gieo. Trên Mac, dùng chuột kéo để thử. Chỉnh hình trong `touch_joystick.tscn` và vùng nhận chạm ở `HUD/Margin/Layout/Space/Joystick` trong cảnh chính.
- [x] ~~Thử camera theo UI-20.~~ Kéo ở đất trống hoặc kéo hai ngón để xem bản đồ. Điều khiển nhân vật để camera bám lại. Chọn `EstateCamera` trong cảnh chính để chỉnh độ lệch và tốc độ bám.
- [x] ~~Chạy vòng gieo → tưới → gặt → bán trên một ô.~~ Chạy `bash tools/qa/run-godot-farm-fixture.sh`, rồi `python3 tools/qa/serve-godot-probe.py --farm-loop` ở terminal khác. F5 hoặc mở Web cục bộ. Bộ thử tăng tốc đồng hồ, giữ kho qua tải lại và đặt lại khi khởi động lại tiến trình Deno.
- [x] ~~Lịch mùa, cỏ và gieo lúa theo GP-20.~~ Fixture nhận `XUAN`, `HA`, `THU` hoặc `DONG`.
- [x] ~~Dọn, sửa, khai hoang theo GP-14.~~ Kiểm hủy xác nhận, tưới cả loạt sau sửa giếng và mở lại ô mới.

Nguồn kỹ thuật chính thức gồm [Godot 4.7.2 stable](https://godotengine.org/download/archive/4.7.2-stable/), [Web và PWA](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html), [Android](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_android.html), [iOS](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_ios.html) và [Supabase Auth ẩn danh](https://supabase.com/docs/guides/auth/auth-anonymous).

### LT-11 · Việc tài liệu đã làm
10/11: thay bộ `00 → 17` bằng `docs/00 → 08`, gộp nội dung đáng giữ, đổi hướng theo QD-12…15. Chi tiết: `docs/COMPLETED.md`.
