# Bộ prompt 23 loài Đợt 1 (ChatGPT / Gemini / API) — mỗi loài 4 giai đoạn lớn

Dùng khi muốn thay **hình tạm vẽ bằng code** (`npm run art:wave1`) bằng ảnh đẹp hơn.
Kết quả cuối cùng luôn đi qua hậu kỳ của dự án nên **không cần ảnh AI chuẩn pixel tuyệt đối** —
chỉ cần đúng chủ thể, đúng góc, nền đặc `#FF00FF`.

## Quy trình 5 bước (cách 1 — PO dùng giao diện ChatGPT / Gemini)
1. Mở ChatGPT (tạo ảnh) hoặc Gemini. Lần đầu: gửi **Prompt chung** + 1 loài, chọn ảnh ưng ý nhất làm **ảnh mẫu phong cách**.
2. Các loài sau: đính kèm ảnh mẫu đó + "Giữ đúng phong cách ảnh đính kèm" + Prompt chung với dòng mô tả loài.
3. Tải từng ảnh PNG về, đặt tên `<ID>_<giai đoạn>.png` (vd `CROP_01_3.png`), bỏ vào `art/source/inbox/` rồi đẩy lên repo (hoặc gửi file cho Claude trong chat).
4. Claude chạy cho từng ảnh:
   `python3 tools/art/import_sprite.py art/source/inbox/CROP_01_3.png --id CROP_01 --stage 3`
   (tách nền → 48x48 → khóa 64 màu → viền `#3D2314`), rồi `python3 tools/art/pack_atlas.py art/source/wave1 --name wave1`.
5. Claude chạy `/vac-asset-audit`, chụp màn hình trong game gửi PO duyệt. Loài nào chưa có ảnh AI vẫn dùng hình vẽ code.

Nếu ảnh AI ra cả 4 giai đoạn trong 1 ảnh (xếp ngang), Claude cắt ra 4 phần trước khi nhập.

## Prompt chung (giữ nguyên, chỉ thay dòng [LOÀI] và [GIAI ĐOẠN])
```
Cozy Vietnamese countryside pixel art game sprite. Camera: 3/4 top-down oblique (about 45°).
Subject: [LOÀI].
Growth stage: [GIAI ĐOẠN].
Single object centered, small patch of ground under it, the whole object fully visible, nothing cut off.
Chunky readable pixel art, flat shading with 2–3 tones per color, warm dark-brown outline (#3D2314), never pure black.
Warm, soft, cheerful palette (greens, golden yellows, earthy browns, water teal).
Solid flat magenta background #FF00FF filling the whole image, no gradient, no shadow on the background, no text, no border.
```

## [GIAI ĐOẠN] — 4 câu cố định
| Số | Câu dùng trong prompt |
|---|---|
| 0 | `stage 1 of 4: just sprouted seedling (or eggs / tiny fry for animals), very small` |
| 1 | `stage 2 of 4: young plant (or chick / small juvenile), about half size` |
| 2 | `stage 3 of 4: fully grown, not yet ripe (or adult animal)` |
| 3 | `stage 4 of 4: ripe and ready to harvest, produce clearly visible (or adult with its product), a tiny sparkle` |

## [LOÀI] — 23 loài Đợt 1 (`GAME_CATALOG`, `unlockWave = 1`)
| ID | Tên | Mô tả tiếng Anh cho prompt |
|---|---|---|
| `CROP_01` | Lúa Nước (Tẻ Thơm) | rice paddy clump in muddy field soil, ripe: drooping golden rice panicles |
| `CROP_02` | Rau Muống Nước | water spinach (morning glory greens), long hollow stems with arrow-shaped leaves |
| `CROP_03` | Ngô (Bắp) Nếp | sticky corn plant, tall stalk with long leaves, ripe: yellow-white cob in green husk with tassel |
| `CROP_04` | Hành Lá & Rau Mùi | spring onion and coriander, straight green tubes with small white roots, feathery coriander leaves |
| `CROP_05` | Cải Ngọt & Cải Xanh | Vietnamese choy sum / mustard greens rosette, broad light-green leaves |
| `CROP_06` | Khoai Lang Mật | sweet potato vine, heart-shaped purple-green leaves spreading low, ripe: purple tubers peeking from soil |
| `CROP_07` | Đậu Tương (Đậu Nành) | soybean bush, ripe: fuzzy golden-tan pods |
| `CROP_08` | Dưa Chuột (Dưa Leo) | cucumber vine on a small bamboo trellis, ripe: striped green cucumbers |
| `CROP_09` | Mía Tím / Mía Lau | purple sugarcane, 3 jointed purple stalks with green leaves on top |
| `CROP_10` | Lạc (Đậu Phộng) | peanut plant, low clover-like leaves, ripe: beige peanut pods pulled out on the soil |
| `CROP_11` | Sả Ớt Hiểm & Gừng Ta | lemongrass clump with small bird's-eye chili bush, ripe: red and orange chilies |
| `CROP_12` | Đậu Xanh Lòng Vàng | mung bean bush, ripe: dark green slender pods |
| `CROP_23` | Đu Đủ Ruột Đỏ (Lâu Năm) | papaya tree, single trunk, palm-like leaf crown, ripe: orange papayas under the crown |
| `CROP_N01` | Cải Cúc & Su Hào (Bắc) | Northern Vietnam garland chrysanthemum greens with a pale purple-green kohlrabi bulb |
| `CROP_C01` | Tỏi Lý Sơn & Ớt Xiêm (Trung) | Ly Son island garlic, white bulbs with thin leaves, plus tiny red chilies |
| `CROP_S01` | Bông Điên Điển & Bông Súng (Nam) | Mekong sesbania shrub with bright yellow flower clusters |
| `ANI_01` | Gà Ri | Vietnamese red-brown backyard hen in a straw nest, ripe: hen with a cream egg |
| `ANI_02` | Chim Cút | small speckled brown quail in a straw nest, ripe: with speckled quail eggs |
| `ANI_03` | Vịt Cỏ | brown field duck with a green head in a straw nest, ripe: with a pale blue duck egg |
| `ANI_04` | Thỏ Trắng & Bồ Câu | white rabbit with pink inner ears beside a grey pigeon, on straw |
| `AQUA_01` | Cá Rô Đồng | climbing perch fish (olive-grey) in a small teal pond patch |
| `AQUA_02` | Tép Đồng & Cá Bống | tiny freshwater shrimps and a small goby in a small teal pond patch, ripe: orange shrimps |
| `AQUA_03` | Cua Đồng & Ốc Bươu | brown paddy crab and a dark apple snail in a small teal pond patch |

## Cách 2 — API key (Claude tự tạo hàng loạt)
PO thêm `OPENAI_API_KEY` hoặc `GEMINI_API_KEY` vào cài đặt môi trường cloud (menu môi trường trên thanh tiêu đề → Edit
→ Network secrets / biến môi trường) — **không dán key vào chat**. Session mới đọc được key; Claude dùng đúng prompt
trên, tự chạy `import_sprite.py` + `pack_atlas.py` và gửi PO duyệt theo lô.
