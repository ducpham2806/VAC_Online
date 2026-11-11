"""Test đường ống asset: python3 -m unittest discover -s tools/art -p 'test_*.py'  (npm run test:art)"""
import json
import os
import sys
import tempfile
import unittest

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from import_sprite import DEFAULT_PALETTE, process  # noqa: E402
from pack_atlas import pack  # noqa: E402
from recolor_outline import WARM_OUTLINE, count_near_black, count_off_palette, load_gpl  # noqa: E402

PALETTE = load_gpl(DEFAULT_PALETTE)


def fake_ai_image() -> Image.Image:
    """Ảnh giả lập AI: 512x512, nền magenta lệch nhẹ, viền đen, màu ngoài bảng."""
    im = Image.new("RGB", (512, 512), (250, 8, 247))
    d = ImageDraw.Draw(im)
    d.ellipse((140, 120, 380, 460), fill=(0, 0, 0))
    d.ellipse((150, 130, 370, 450), fill=(120, 190, 30))
    d.rectangle((240, 60, 270, 140), fill=(210, 170, 20))
    return im


class PipelineTest(unittest.TestCase):
    def test_import_ra_dung_chuan_05(self):
        out = process(fake_ai_image(), (48, 48), PALETTE)
        self.assertEqual(out.size, (48, 48))
        self.assertEqual(count_off_palette(out, PALETTE), 0, "mọi pixel phải thuộc bảng 64 màu")
        self.assertEqual(count_near_black(out, 24), 0, "không còn viền đen")
        alphas = {px[3] for px in out.getdata()}
        self.assertTrue(alphas <= {0, 255}, "alpha chỉ 0/255")
        self.assertEqual(out.getpixel((0, 0))[3], 0, "nền đã trong suốt")
        self.assertIn((*WARM_OUTLINE, 255), set(out.getdata()), "có viền ấm #3D2314")
        bbox = out.getbbox()
        self.assertEqual(bbox[3], 48, "neo đáy: hình chạm đáy khung")

    def test_anh_trong_bao_loi(self):
        with self.assertRaises(ValueError):
            process(Image.new("RGB", (64, 64), (255, 0, 255)), (48, 48), PALETTE)

    def test_pack_atlas_json_hash(self):
        with tempfile.TemporaryDirectory() as tmp:
            src = os.path.join(tmp, "src")
            for ent in ("CROP_01", "ANI_01"):
                os.makedirs(os.path.join(src, ent))
                for st in range(4):
                    Image.new("RGBA", (48, 48), (61, 35, 20, 255)).save(os.path.join(src, ent, f"{st}.png"))
            png, js, n = pack(src, "test", os.path.join(tmp, "out"))
            self.assertEqual(n, 8)
            meta = json.load(open(js, encoding="utf-8"))
            self.assertEqual(sorted(meta["frames"])[:2], ["ANI_01_0", "ANI_01_1"])
            sheet = Image.open(png)
            self.assertEqual((sheet.width, sheet.height), (meta["meta"]["size"]["w"], meta["meta"]["size"]["h"]))
            f = meta["frames"]["CROP_01_3"]["frame"]
            self.assertLessEqual(f["x"] + f["w"], sheet.width)


if __name__ == "__main__":
    unittest.main()


class ImportSheetTest(unittest.TestCase):
    """import_sheet.py: nhiều khung / tấm, chung một tỉ lệ thu."""

    def _strip(self) -> Image.Image:
        im = Image.new("RGB", (900, 400), (255, 0, 255))
        d = ImageDraw.Draw(im)
        d.rectangle((40, 300, 140, 380), fill=(120, 190, 30))    # hình thấp
        d.rectangle((400, 60, 500, 380), fill=(120, 190, 30))    # hình cao
        d.rectangle((700, 200, 800, 380), fill=(210, 170, 20))
        return im

    def test_strip_chung_ti_le_va_dung_chuan(self):
        from import_sheet import import_sheet
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "s.png")
            self._strip().save(path)
            frames = import_sheet(path, "strip:3", (32, 48), PALETTE)
        self.assertEqual(len(frames), 3)
        heights = [f.getbbox()[3] - f.getbbox()[1] for f in frames]
        self.assertLess(heights[0], heights[1] / 2, "hình thấp vẫn thấp hơn hình cao (không phóng riêng từng khung)")
        for f in frames:
            self.assertEqual(f.size, (32, 48))
            self.assertEqual(count_off_palette(f, PALETTE), 0)
            self.assertEqual(count_near_black(f, 24), 0)
            self.assertEqual(f.getbbox()[3], 48, "neo đáy")
            self.assertIn((*WARM_OUTLINE, 255), set(f.getdata()))

    def test_sai_so_khung_bao_loi(self):
        from import_sheet import import_sheet
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "s.png")
            self._strip().save(path)
            with self.assertRaises(ValueError):
                import_sheet(path, "strip:4", (32, 48), PALETTE)

    def test_hai_hinh_cham_nhau_van_tach_du_khung(self):
        """Ảnh AI vẽ 2 giai đoạn cây chạm lá nhau: cắt ở cột thưa nhất, vẫn đủ 4 khung đúng chuẩn."""
        from import_sheet import import_sheet
        im = Image.new("RGB", (1000, 400), (255, 0, 255))
        d = ImageDraw.Draw(im)
        d.rectangle((40, 300, 140, 380), fill=(120, 190, 30))
        d.rectangle((240, 200, 340, 380), fill=(120, 190, 30))
        d.rectangle((500, 100, 640, 380), fill=(120, 190, 30))
        d.rectangle((640, 340, 660, 344), fill=(120, 190, 30))  # lá chạm sang hình kế
        d.rectangle((660, 60, 800, 380), fill=(120, 190, 30))
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "s.png")
            im.save(path)
            frames = import_sheet(path, "strip:4", (32, 48), PALETTE)
        self.assertEqual(len(frames), 4)
        self.assertTrue(all(f.size == (32, 48) for f in frames))

    def test_tiles_phu_kin(self):
        from import_sheet import import_sheet
        im = Image.new("RGB", (700, 300), (255, 0, 255))
        d = ImageDraw.Draw(im)
        d.rectangle((20, 50, 320, 250), fill=(140, 90, 50))
        d.rectangle((380, 50, 680, 250), fill=(120, 190, 30))
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "t.png")
            im.save(path)
            tiles = import_sheet(path, "tiles:2", (32, 32), PALETTE)
        for t in tiles:
            self.assertEqual(t.size, (32, 32))
            self.assertEqual({px[3] for px in t.getdata()}, {255}, "ô nền không trong suốt")


class StripSoilTest(unittest.TestCase):
    """QD-82: cây không mang ụ bùn riêng (ô đất đã có đất)."""

    def test_bo_bun_giu_la(self):
        from import_sheet import import_sheet
        im = Image.new("RGB", (400, 400), (255, 0, 255))
        d = ImageDraw.Draw(im)
        d.ellipse((60, 300, 340, 380), fill=(110, 65, 33))      # ụ bùn nâu
        d.rectangle((180, 80, 220, 340), fill=(78, 160, 34))    # thân lá xanh
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "c.png")
            im.save(path)
            (frame,) = import_sheet(path, "strip:1", (32, 48), PALETTE, soil=True)
        colors = {px[:3] for px in frame.getdata() if px[3]}
        self.assertFalse(any(abs(r - 110) < 20 and abs(g - 65) < 20 and abs(b - 33) < 20 for r, g, b in colors), "không còn màu bùn")
        self.assertTrue(any(g > r and g > b for r, g, b in colors), "vẫn còn lá xanh")
        bbox = frame.getbbox()
        self.assertLess(bbox[2] - bbox[0], 16, "khung sát thân cây, không rộng theo ụ bùn")


class ShearTest(unittest.TestCase):
    def test_shear_y_lam_duong_doc_thanh_ngang_giu_cot_dung(self):
        from import_sheet import shear_y
        img = Image.new("RGB", (101, 80), (255, 0, 255))
        d = ImageDraw.Draw(img)
        d.line([(0, 60), (100, 10)], fill=(200, 160, 60))  # rail dốc -0,5
        d.line([(50, 0), (50, 79)], fill=(60, 40, 20))  # cọc đứng
        out = shear_y(img, 0.5)
        px = out.load()
        rail = [y for x in (0, 100) for y in range(out.height) if px[x, y] == (200, 160, 60)]
        self.assertLessEqual(max(rail) - min(rail), 1, "rail thành nằm ngang")
        stake_cols = {x for x in range(out.width) for y in range(out.height) if px[x, y] == (60, 40, 20)}
        self.assertEqual(stake_cols, {50}, "cọc vẫn thẳng đứng")
