import base64, unittest
from unittest.mock import patch
import numpy as np
from rasterio.transform import from_origin
from shapely.geometry import Point, shape
from segmentation import prepare_crop, finish_proposal, decode_mask, ImageryUnavailable

def runs(mask):
    """The browser's encoding: run lengths over the row-major mask, starting with zeros."""
    flat = mask.ravel().astype(np.int8); edges = np.flatnonzero(np.diff(flat)) + 1
    lengths = np.diff(np.concatenate([[0], edges, [flat.size]])).tolist()
    return ([0] if flat[0] else []) + lengths

class SegmentationTests(unittest.TestCase):
    def request(self, prompts=None, **extra):
        return {'requestId': 'test', 'month': '2025-07', 'imageryVersion': 'fixture', 'prompts': prompts or [{'coordinates': [-98.56, 19.54], 'label': 1}], **extra}

    def crop(self, manifest, bounds):
        size = round((bounds[2] - bounds[0]) / 10)
        return np.full((3, size, size), .2, 'float32'), np.full((size, size), 65535, 'uint16'), from_origin(bounds[0], bounds[3], 10, 10)

    def patches(self, crop=None):
        return [patch('segmentation.crop_rgb', side_effect=crop or self.crop), patch('segmentation.get_manifest', return_value={'version': 'fixture', 'scenes': []}),
                patch('segmentation.model_info', return_value={'model': 'fixed-test', 'files': {}})]

    def run_patched(self, fn, *args, crop=None):
        ps = self.patches(crop)
        for p in ps: p.start()
        try: return fn(*args)
        finally:
            for p in ps: p.stop()

    def test_run_length_masks_round_trip_and_reject_bad_input(self):
        mask = np.zeros((4, 5), bool); mask[1:3, 2:4] = True; mask[0, 0] = True
        self.assertTrue((decode_mask(runs(mask), 4, 5) == mask).all())
        for bad in [[19], [10, 'x', 10], [-1, 21], 'nope']:
            with self.subTest(bad=bad), self.assertRaises(ValueError): decode_mask(bad, 4, 5)

    def test_invalid_prompts_and_outside_coverage(self):
        for prompts in [[{}], [None], [{'coordinates': [-98.56, 19.54], 'label': 0}], [{'coordinates': [-99.2, 19.43], 'label': 1}], [{'coordinates': [float('nan'), 19.54], 'label': 1}]]:
            with self.subTest(prompts=prompts), self.assertRaises(ValueError): prepare_crop(self.request(prompts))
        with self.assertRaises(ValueError): self.run_patched(prepare_crop, self.request(side=1300))

    def test_crop_expands_at_edge_and_keeps_georeferenced_provenance(self):
        crop = self.run_patched(prepare_crop, self.request())
        self.assertEqual((crop['side'], crop['width'], crop['height']), (1280, 128, 128))
        self.assertEqual(len(base64.b64decode(crop['image'])), 128 * 128 * 3)
        full = np.ones((128, 128), bool)
        result = self.run_patched(finish_proposal, {'requestId': 'test', 'cropId': crop['cropId'], 'masks': [runs(full)], 'scores': [.9]})
        self.assertEqual(result, {'requestId': 'test', 'expand': 2560})
        crop = self.run_patched(prepare_crop, self.request(side=2560))
        x, y = np.floor(crop['points'][0]).astype(int); mask = np.zeros((256, 256), bool); mask[y - 8:y + 9, x - 8:x + 9] = True
        result = self.run_patched(finish_proposal, {'requestId': 'test', 'cropId': crop['cropId'], 'masks': [runs(mask)], 'scores': [.9], 'device': 'webgpu'})
        self.assertEqual(result['requestId'], 'test')
        self.assertTrue(shape(result['geometry']).is_valid)
        self.assertTrue(shape(result['geometry']).covers(Point(-98.56, 19.54)))
        self.assertEqual(result['provenance']['device'], 'webgpu')
        grid = result['provenance']['cropGrid']; self.assertEqual(grid['extent'][2] - grid['extent'][0], 2560)
        self.assertEqual(grid['transform'][0], 10); self.assertEqual(grid['transform'][4], -10)

    def test_missing_rgb_and_stale_crops_are_explicit(self):
        def missing(manifest, bounds):
            rgb, source, tf = self.crop(manifest, bounds); rgb[:] = np.nan; return rgb, source, tf
        with self.assertRaisesRegex(ImageryUnavailable, 'despejada'): self.run_patched(prepare_crop, self.request(), crop=missing)
        crop = self.run_patched(prepare_crop, self.request())
        mask = runs(np.zeros((128, 128), bool))
        with self.assertRaisesRegex(ValueError, 'caducó'): finish_proposal({'requestId': 'other', 'cropId': crop['cropId'], 'masks': [mask], 'scores': [.9]})
        with self.assertRaisesRegex(ValueError, 'caducó'): finish_proposal({'requestId': 'test', 'cropId': 'unknown', 'masks': [mask], 'scores': [.9]})

    def test_filled_holes_cannot_undo_an_exclusion_click(self):
        request = self.request([{'coordinates': [-98.56, 19.54], 'label': 1}, {'coordinates': [-98.5597, 19.54], 'label': 0}])
        crop = self.run_patched(prepare_crop, request)
        (x, y), (ex, ey) = np.floor(crop['points']).astype(int)
        mask = np.zeros((crop['height'], crop['width']), bool); mask[y - 20:y + 21, x - 20:x + 21] = True; mask[ey, ex] = False
        with self.assertRaisesRegex(ValueError, 'no respetan'): self.run_patched(finish_proposal, {'requestId': 'test', 'cropId': crop['cropId'], 'masks': [runs(mask)], 'scores': [.9]})

if __name__ == '__main__': unittest.main()
