import unittest
from unittest.mock import patch
import numpy as np
from rasterio.transform import from_origin
from shapely.geometry import Point, shape
from segmentation import infer_proposal, ImageryUnavailable

class SegmentationTests(unittest.TestCase):
    def request(self,prompts=None):
        return {'requestId':'test','month':'2025-07','imageryVersion':'fixture','prompts':prompts or [{'coordinates':[-98.56,19.54],'label':1}]}

    def crop(self,manifest,bounds):
        size=round((bounds[2]-bounds[0])/10)
        return np.full((3,size,size),.2,'float32'),np.full((size,size),65535,'uint16'),from_origin(bounds[0],bounds[3],10,10)

    def test_invalid_prompts_and_outside_coverage(self):
        for prompts in [[{}],[None],[{'coordinates':[-98.56,19.54],'label':0}],[{'coordinates':[-99.2,19.43],'label':1}],[{'coordinates':[float('nan'),19.54],'label':1}]]:
            with self.subTest(prompts=prompts),self.assertRaises(ValueError): infer_proposal(self.request(prompts))

    def test_crop_expands_at_edge_and_keeps_georeferenced_provenance(self):
        class Predictor:
            def __init__(self): self.calls=0
            def set_image(self,image): self.size=image.shape[0]
            def predict(self,point_coords,**kwargs):
                self.calls+=1;mask=np.zeros((self.size,self.size),bool)
                if self.calls==1: mask[:]=True
                else:
                    x,y=np.floor(point_coords[0]).astype(int);mask[y-8:y+9,x-8:x+9]=True
                return np.array([mask]),np.array([.9]),None
        model=Predictor()
        with patch('segmentation.predictor',return_value=model),patch('segmentation.crop_rgb',side_effect=self.crop),patch('segmentation.get_manifest',return_value={'version':'fixture','scenes':[]}),patch('segmentation.model_info',return_value={'model':'fixed-test'}):
            result=infer_proposal(self.request())
        self.assertEqual(model.calls,2)
        self.assertEqual(result['requestId'],'test')
        self.assertTrue(shape(result['geometry']).is_valid)
        self.assertTrue(shape(result['geometry']).covers(Point(-98.56,19.54)))
        grid=result['provenance']['cropGrid'];self.assertEqual(grid['projection'],'EPSG:32614');self.assertEqual(grid['extent'][2]-grid['extent'][0],2560)
        self.assertEqual(grid['transform'][0],10);self.assertEqual(grid['transform'][4],-10)

    def test_missing_rgb_and_busy_inference_are_explicit(self):
        def missing(manifest,bounds):
            rgb,source,tf=self.crop(manifest,bounds);rgb[:]=np.nan;return rgb,source,tf
        with patch('segmentation.predictor'),patch('segmentation.crop_rgb',side_effect=missing),patch('segmentation.get_manifest',return_value={'version':'fixture','scenes':[]}):
            with self.assertRaisesRegex(ImageryUnavailable,'despejada'): infer_proposal(self.request())
        with patch('segmentation.get_manifest',return_value={'version':'fixture','scenes':[]}),patch('segmentation._lock') as lock:
            lock.acquire.return_value=False
            with self.assertRaisesRegex(ImageryUnavailable,'otra parcela'): infer_proposal(self.request())

    def test_filled_holes_cannot_undo_an_exclusion_click(self):
        class Predictor:
            def set_image(self,image): self.size=image.shape[0]
            def predict(self,point_coords,**kwargs):
                mask=np.zeros((self.size,self.size),bool);x,y=np.floor(point_coords[0]).astype(int);mask[y-20:y+21,x-20:x+21]=True
                ex,ey=np.floor(point_coords[1]).astype(int);mask[ey,ex]=False
                return np.array([mask]),np.array([.9]),None
        request=self.request([{'coordinates':[-98.56,19.54],'label':1},{'coordinates':[-98.5597,19.54],'label':0}])
        with patch('segmentation.predictor',return_value=Predictor()),patch('segmentation.crop_rgb',side_effect=self.crop),patch('segmentation.get_manifest',return_value={'version':'fixture','scenes':[]}):
            with self.assertRaisesRegex(ValueError,'no respetan'): infer_proposal(request)

if __name__=='__main__': unittest.main()
