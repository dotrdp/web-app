#!/usr/bin/env python3
"""Cache real monthly Landsat 8/9 Collection 2 L2 NDVI, including pixel QA.

Source: Microsoft Planetary Computer / USGS. Read only the regional window
from COGs. A monthly median of up to two low-cloud scenes is calculated on
the original 30 m UTM grid. Parcel means use pixel centers inside the parcel.
Display PNGs carry signed NDVI at 1e-4 precision in R/G, and validity in alpha.
The browser colors these values and masks pixels below the selected threshold.
"""
import argparse
import calendar
import hashlib
import json
from pathlib import Path
import time
import warnings

import numpy as np
from osgeo import gdal, ogr, osr
from PIL import Image
from pyproj import Transformer
import requests
from shapely.geometry import box, shape

gdal.UseExceptions()
gdal.SetConfigOption('GDAL_DISABLE_READDIR_ON_OPEN', 'EMPTY_DIR')
gdal.SetConfigOption('CPL_VSIL_CURL_ALLOWED_EXTENSIONS', '.TIF,.tif')
gdal.SetConfigOption('GDAL_HTTP_TIMEOUT', '45')
gdal.SetConfigOption('GDAL_HTTP_MAX_RETRY', '2')
gdal.SetConfigOption('GDAL_HTTP_RETRY_DELAY', '1')
ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.data-cache/landsat'
OUT = ROOT / 'public'
STAC = 'https://planetarycomputer.microsoft.com/api/stac/v1/search'
BBOX = [-98.66, 19.48, -98.15, 20.03]
SESSION = requests.Session()


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + '.tmp')
    temp.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':'), allow_nan=False))
    temp.replace(path)


def get(url, **kwargs):
    for attempt in range(4):
        try:
            r = SESSION.get(url, timeout=60, **kwargs)
            r.raise_for_status()
            return r.json()
        except requests.RequestException:
            if attempt == 3:
                raise RuntimeError('Remote Landsat catalog unavailable after four attempts') from None
            time.sleep(2)


def build_labels(features, geo, width, height):
    memory = ogr.GetDriverByName('Memory').CreateDataSource('parcels')
    srs = osr.SpatialReference()
    srs.ImportFromEPSG(32614)
    layer = memory.CreateLayer('parcels', srs, ogr.wkbMultiPolygon)
    layer.CreateField(ogr.FieldDefn('label', ogr.OFTInteger))
    wgs = osr.SpatialReference()
    wgs.ImportFromEPSG(4326)
    wgs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    srs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    transform = osr.CoordinateTransformation(wgs, srs)
    for idx, feature in enumerate(features):
        geom = ogr.CreateGeometryFromJson(json.dumps(feature['geometry']))
        geom.Transform(transform)
        rec = ogr.Feature(layer.GetLayerDefn())
        rec.SetField('label', idx + 1)
        rec.SetGeometry(geom)
        layer.CreateFeature(rec)
    raster = gdal.GetDriverByName('MEM').Create('', width, height, 1, gdal.GDT_UInt16)
    raster.SetGeoTransform(geo)
    raster.SetProjection(srs.ExportToWkt())
    gdal.RasterizeLayer(raster, [1], layer, options=['ATTRIBUTE=label'])
    return raster.ReadAsArray()


def fetch_month(year, month, features):
    date = f'{year}-{month:02d}'
    cache_path = CACHE / f'{date}.json'
    if cache_path.exists():
        return json.loads(cache_path.read_text())
    last = calendar.monthrange(year, month)[1]
    items = get(STAC, params={
        'collections': 'landsat-c2-l2', 'bbox': ','.join(map(str, BBOX)),
        'datetime': f'{date}-01T00:00:00Z/{date}-{last}T23:59:59Z', 'limit': 100,
    })['features']
    region = box(*BBOX)
    # A single WRS path/row covers the full study region. Keep the grid and
    # scene footprint consistent across months instead of mosaicking unlike
    # paths and dates and presenting the result as one observation.
    candidates = [x for x in items if x['id'].startswith(('LC08_', 'LC09_')) and x['properties'].get('landsat:wrs_path') == '026' and x['properties'].get('landsat:wrs_row') == '046' and all(k in x['assets'] for k in ['red', 'nir08', 'qa_pixel'])]
    candidates.sort(key=lambda x: (x['properties'].get('eo:cloud_cover', 100), x['id']))
    candidates = candidates[:2]
    if not candidates:
        raise RuntimeError(f'No Landsat 8/9 scenes for {date}')
    transformer = Transformer.from_crs(4326, 32614, always_xy=True)
    lower = transformer.transform(BBOX[0], BBOX[1])
    upper = transformer.transform(BBOX[2], BBOX[3])
    bounds = [np.floor(lower[0] / 30) * 30, np.floor(lower[1] / 30) * 30, np.ceil(upper[0] / 30) * 30, np.ceil(upper[1] / 30) * 30]
    arrays = []
    scene_metadata = []
    for scene in candidates:
        values = {}
        token = get('https://planetarycomputer.microsoft.com/api/sas/v1/token/landsateuwest/landsat-c2')['token']
        for band in ['red', 'nir08', 'qa_pixel', 'qa_radsat']:
            asset = scene['assets'].get(band)
            if not asset:
                continue
            url = asset['href'] + '?' + token
            # Keep signed URLs out of errors/logs.
            gdal.PushErrorHandler('CPLQuietErrorHandler')
            try:
                remote = gdal.Open('/vsicurl/' + url)
                cropped = gdal.Warp('', remote, format='MEM', dstSRS='EPSG:32614', outputBounds=bounds, xRes=30, yRes=30, resampleAlg='near', srcNodata=0 if band in ['red', 'nir08'] else None, dstNodata=0)
                values[band] = cropped.ReadAsArray()
                geo = cropped.GetGeoTransform()
                projection = cropped.GetProjection()
            except Exception:
                raise RuntimeError(f'Reading Landsat {scene["id"]} band {band} failed') from None
            finally:
                gdal.PopErrorHandler()
        red = values['red'].astype(np.float32) * 0.0000275 - 0.2
        nir = values['nir08'].astype(np.float32) * 0.0000275 - 0.2
        valid = (values['red'] != 0) & (values['nir08'] != 0) & ((values['qa_pixel'] & 63) == 0) & ((nir + red) > 0)
        if 'qa_radsat' in values:
            valid &= (values['qa_radsat'] & ((1 << 3) | (1 << 4))) == 0
        with np.errstate(divide='ignore', invalid='ignore'):
            ndvi = (nir - red) / (nir + red)
        valid &= np.isfinite(ndvi) & (ndvi >= -1) & (ndvi <= 1)
        arrays.append(np.where(valid, ndvi, np.nan))
        scene_metadata.append({'id': scene['id'], 'date': scene['properties']['datetime'][:10], 'cloudCover': scene['properties'].get('eo:cloud_cover'), 'stacUrl': f'https://planetarycomputer.microsoft.com/api/stac/v1/collections/landsat-c2-l2/items/{scene["id"]}'})
        print(f'{date}: read {scene["id"]}', flush=True)
    with warnings.catch_warnings():
        warnings.simplefilter('ignore', RuntimeWarning)
        ndvi = np.nanmedian(np.stack(arrays), axis=0)
    labels = build_labels(features, geo, ndvi.shape[1], ndvi.shape[0])
    parcel_stats = {}
    for idx, feature in enumerate(features):
        inside = labels == idx + 1
        values = ndvi[inside]
        finite = values[np.isfinite(values)]
        parcel_stats[feature['properties']['id']] = {
            'mean': round(float(finite.mean()), 4) if finite.size else None,
            'min': round(float(finite.min()), 4) if finite.size else None,
            'max': round(float(finite.max()), 4) if finite.size else None,
            'validPixels': int(finite.size), 'totalPixels': int(values.size),
            'coverage': round(float(finite.size / values.size), 4) if values.size else 0,
        }
    # Preserve original-grid monthly values for reproducibility and downloads.
    CACHE.mkdir(parents=True, exist_ok=True)
    tif = CACHE / f'{date}.tif'
    ds = gdal.GetDriverByName('GTiff').Create(str(tif), ndvi.shape[1], ndvi.shape[0], 1, gdal.GDT_Float32, options=['COMPRESS=DEFLATE', 'TILED=YES'])
    ds.SetGeoTransform(geo)
    ds.SetProjection(projection)
    ds.GetRasterBand(1).SetNoDataValue(-9999)
    ds.GetRasterBand(1).WriteArray(np.where(np.isfinite(ndvi), ndvi, -9999))
    ds.SetMetadata({'SOURCE': 'USGS Landsat Collection 2 Level 2 via Planetary Computer', 'PERIOD': date, 'COMPOSITE': 'median of up to two lowest-scene-cloud acquisitions', 'MASK': 'QA_PIXEL fill/dilated-cloud/cirrus/cloud/shadow/snow; QA_RADSAT red/NIR saturation', 'SCENES': ','.join(x['id'] for x in scene_metadata)})
    ds.FlushCache()
    display = gdal.Warp('', ds, format='MEM', dstSRS='EPSG:3857', width=640, resampleAlg='average', dstNodata=-9999)
    values = display.ReadAsArray()
    finite = np.isfinite(values) & (values != -9999)
    encoded = np.rint((np.where(finite, values, 0) + 1) * 10000).astype(np.uint16)
    rgba = np.zeros((*values.shape, 4), dtype=np.uint8)
    rgba[:, :, 0] = (encoded >> 8).astype(np.uint8)
    rgba[:, :, 1] = (encoded & 255).astype(np.uint8)
    rgba[:, :, 3] = finite.astype(np.uint8) * 255
    png = OUT / f'rasters/landsat/{date}.png'
    png.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgba).save(png, optimize=True)
    gt = display.GetGeoTransform()
    data = {
        'date': date, 'url': f'/rasters/landsat/{date}.png', 'projection': 'EPSG:3857',
        'extent': [gt[0], gt[3] + gt[5] * display.RasterYSize, gt[0] + gt[1] * display.RasterXSize, gt[3]],
        'parcels': parcel_stats, 'scenes': scene_metadata,
        'nativeResolution': 30, 'displayWidth': display.RasterXSize,
        'validAreaFraction': round(float(finite.mean()), 4),
        'sha256': hashlib.sha256(png.read_bytes()).hexdigest(),
    }
    save(cache_path, data)
    return data


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--years', type=int, nargs='+', default=[2025])
    parser.add_argument('--months', type=int, nargs='+', default=list(range(1, 13)))
    args = parser.parse_args()
    features = json.loads((OUT / 'data/parcels.geojson').read_text())['features']
    target = OUT / 'data/landsat.json'
    manifest = json.loads(target.read_text()) if target.exists() else {}
    for year in args.years:
        for month in args.months:
            try:
                record = fetch_month(year, month, features)
                manifest[record['date']] = record
                save(target, manifest)
                print(f'{record["date"]}: saved. {sum(p["mean"] is not None for p in record["parcels"].values())}/197 parcels with valid NDVI.', flush=True)
            except Exception as e:
                print(f'{year}-{month:02d}: {type(e).__name__}: {e}', flush=True)
                raise
