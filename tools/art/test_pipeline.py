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
