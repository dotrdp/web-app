import io,json,math,sys,unittest,uuid
from pathlib import Path
from unittest.mock import patch
import numpy as np
from PIL import Image
from shapely.geometry import Point,mapping
from imagery import *

class ScienceTests(unittest.TestCase):
    def test_source_calibration_and_zero_fill(self):
        dn=np.array([0,1000,3000,6000],dtype='uint16')
        actual=calibrate(dn,.0001,-.1)
        self.assertTrue(np.isnan(actual[0]));np.testing.assert_allclose(actual[1:],[0,.2,.5],atol=1e-7)
        np.testing.assert_allclose(calibrate(dn,.0001,0)[1:],[.1,.3,.6],atol=1e-7)
    def test_green_aggregation_precedes_mndwi(self):
        green=np.array([[.1,.3],[.5,.7]],dtype='float32');swir=np.array([[.2]],dtype='float32')
        water=normalized_difference(aggregate_green(green),swir)
        np.testing.assert_allclose(water,[[1/3]],atol=1e-6)
        self.assertGreater(abs(float(water[0,0])-float(normalized_difference(green,np.full((2,2),.2)).mean())),.05)
        self.assertTrue(np.isnan(normalized_difference(np.array([0]),np.array([0]))[0]))
    def test_complete_state_boundary_and_all_months(self):
        index=json.loads((ROOT/'public/data/sentinel-index.json').read_text());self.assertEqual(len(index['months']),48)
        self.assertEqual({f['properties']['nomgeo'] for f in STATES['features']},{'Hidalgo','Puebla','Tlaxcala'})
        for month in index['months']:
            manifest=get_manifest(month['month']);self.assertEqual(manifest['version'],month['version']);self.assertEqual(manifest['boundarySha256'],BOUNDARY_SHA)
            self.assertEqual(manifest['tiles'],sorted({s['tile'] for s in manifest['scenes']}));self.assertEqual(len(manifest['tiles']),16)
            self.assertTrue(all(s['date'].startswith(month['month']) for s in manifest['scenes']))
        for point in [(-99.02,20.22),(-97.57,18.46),(-98.0,19.45)]: self.assertTrue(COVERAGE.covers(Point(point)),point)
        self.assertFalse(COVERAGE.covers(Point(-99.2,19.43)))
    def test_cloud_mask_clear_pixel_mosaic_and_water_native_grid(self):
        x,y=TO_UTM(-98.4,19.6);cx,cy=math.floor(x/CELL_METERS),math.floor(y/CELL_METERS)
        version='fixture-'+uuid.uuid4().hex;manifest={'version':version,'scenes':[{'id':'first','geometry':mapping(COVERAGE),'calibration':{'scale':.0001,'offset':-.1}},{'id':'second','geometry':mapping(COVERAGE),'calibration':{'scale':.0001,'offset':-.1}}]}
        def read(scene,band,tf,size):
            if band=='SCL':
                a=np.full((size,size),4,'uint16');
                if scene['id']=='first': a[:,size//2:]=9
                return a
            value={'B02':2500,'B03':5000,'B04':3000,'B08':6000,'B11':3000}[band]
            return np.full((size,size),value,'uint16')
        try:
            with patch('imagery.read_band',side_effect=read): cell=native_cell(manifest,cx,cy)
            self.assertEqual(cell['ndvi'].shape,(512,512));self.assertEqual(cell['mndwi'].shape,(256,256))
            valid=np.isfinite(cell['ndvi']);self.assertTrue(valid.any());np.testing.assert_allclose(cell['ndvi'][valid],3/7,atol=1e-6)
            water=np.isfinite(cell['mndwi']);np.testing.assert_allclose(cell['mndwi'][water],1/3,atol=1e-6)
            self.assertTrue((cell['source'][valid]==0).any());self.assertTrue((cell['source'][valid]==1).any())
        finally: CACHE.delete(f'cell/{version}/{cx}/{cy}')
    def test_tile_seams_and_thresholds_on_aligned_native_grid(self):
        tile=mercantile.tile(-98.4,19.6,14);manifest={'version':'fixture-'+uuid.uuid4().hex,'renderVersion':2}
        def data(_,cx,cy):
            tf=cell_grid(cx,cy);xs=(np.arange(512)+.5)*10+tf.c
            red=np.broadcast_to(.05+(xs%100000)/100000*.12,(512,512)).astype('float32')
            return {'rgb':np.stack([red,red,red]),'ndvi':np.full((512,512),.5,'float32'),'mndwi':np.full((256,256),.25,'float32')}
        with patch('imagery.native_cell',side_effect=data):
            left=np.array(Image.open(io.BytesIO(tile_png(manifest,'rgb',tile.z,tile.x,tile.y,-1))))
            right=np.array(Image.open(io.BytesIO(tile_png(manifest,'rgb',tile.z,tile.x+1,tile.y,-1))))
            seam=np.abs(left[:,-1,:3].astype(int)-right[:,0,:3].astype(int));self.assertLessEqual(int(seam.max()),1)
            shown=np.array(Image.open(io.BytesIO(tile_png(manifest,'mndwi',tile.z,tile.x,tile.y,.25))))
            hidden=np.array(Image.open(io.BytesIO(tile_png(manifest,'mndwi',tile.z,tile.x,tile.y,.3))))
            precise=np.array(Image.open(io.BytesIO(tile_png(manifest,'mndwi',tile.z,tile.x,tile.y,.25001))))
            self.assertGreater(int(shown[:,:,3].sum()),0);self.assertEqual(int(hidden[:,:,3].sum()),0)
            self.assertEqual(int(precise[:,:,3].sum()),0)
    def test_overview_preserves_native_thresholds_and_missing_area(self):
        tile=mercantile.tile(-98.4,19.6,6);manifest={'version':'fixture-'+uuid.uuid4().hex,'renderVersion':2}
        x,y=TO_UTM(-98.4,19.6);cell=(math.floor(x/CELL_METERS),math.floor(y/CELL_METERS))
        water=np.full((256,256),-.25,'float32');water[:,::2]=.25
        with patch('imagery.cells_for_bounds',return_value=[cell]),patch('imagery.native_cell',return_value={'mndwi':water}):
            shown=np.array(Image.open(io.BytesIO(tile_png(manifest,'mndwi',tile.z,tile.x,tile.y,0))))
        alpha=shown[:,:,3];self.assertTrue((alpha>0).any());self.assertLessEqual(int(alpha.max()),128);self.assertGreaterEqual(int(alpha[alpha>0].min()),126)
        water[:]=np.nan
        with patch('imagery.cells_for_bounds',return_value=[cell]),patch('imagery.native_cell',return_value={'mndwi':water}):
            missing=np.array(Image.open(io.BytesIO(tile_png(manifest,'mndwi',tile.z,tile.x,tile.y,.01))))
        self.assertEqual(int(missing[:,:,3].sum()),0)
    def test_renderer_version_preserves_immutable_native_provenance(self):
        current=get_manifest('2025-07');self.assertEqual(current['renderVersion'],2)
        original=get_manifest('2025-07',current['nativeVersion']);self.assertNotEqual(original['version'],current['version']);self.assertEqual(original['scenes'],current['scenes'])
        self.assertEqual(original['boundarySha256'],current['boundarySha256'])
        self.assertTrue(all('assets' not in s for s in public_manifest(current)['scenes']))
    def test_gif_loop_duration_partial_frames_and_resource_limits(self):
        for name,limit in [('desktop',5_000_000),('mobile',2_000_000)]:
            path=ROOT/f'public/artwork/login-{name}.gif';im=Image.open(path);self.assertEqual(im.format,'GIF');self.assertEqual(im.info['loop'],0)
            self.assertEqual(im.n_frames,120);duration=0;partial=0;first=np.array(im.convert('RGB'))
            for frame in range(im.n_frames):
                im.seek(frame);duration+=im.info['duration']
                partial+=bool(im.tile and im.tile[0][1]!=(0,0,im.width,im.height))
            last=np.array(im.convert('RGB'));self.assertEqual(duration,10000);self.assertLess(path.stat().st_size,limit);self.assertGreater(partial,100)
            self.assertLess(float(np.abs(first.astype(float)-last).mean()),.2)
            im.close()
if __name__=='__main__':unittest.main()
