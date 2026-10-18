#!/usr/bin/env python3
"""Build a portable atlas from the original FIRA/QGIS data without modifying it.

Run through uv with the system Python (GDAL, NumPy, Pillow, Shapely and PyProj).
"""
from pathlib import Path
import argparse
import csv
import hashlib
import json
import re
import shutil
from collections import defaultdict

import numpy as np
from osgeo import gdal
from PIL import Image
from pyproj import Transformer
from shapely.geometry import shape, mapping

gdal.UseExceptions()
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public'
SOURCE = ROOT.parent


def number(value):
    try:
        n = float(value)
        return round(n, 6) if np.isfinite(n) else None
    except (ValueError, TypeError):
        return None


def records(path):
    with open(path, encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':'), allow_nan=False))


def monthly_ndvi(original):
    """Monthly NDVI per parcel and sensor from FIRA's scenes with at most 30 % cloud: the mean of
    the scene means, the lowest scene minimum, the highest scene maximum and the scene count."""
    aggregate = defaultdict(list)
    counts = defaultdict(int)
    for path, sensor_default in [(original / 'Conjunto_datos_BASICO_AgroCebada2026.csv', None), (original / 'Conjunto_datos_PRO_AgroCebada.csv', 'Planet')]:
        with open(path, encoding='utf-8-sig', newline='') as f:
            for r in csv.DictReader(f):
                sensor = r.get('sensor', sensor_default) or sensor_default
                value = number(r.get('ndvi_promedio'))
                cloud = number(r.get('porcentaje_nubosidad'))
                if value is None or not -1 <= value <= 1 or cloud is None or cloud > 30:
                    continue
                date_parts = r['fecha_captura'].split('/')
                date = f'{date_parts[2]}-{date_parts[1].zfill(2)}'
                aggregate[(r['ID_POLIGONO'], sensor, date)].append((value, number(r.get('ndvi_min')), number(r.get('ndvi_max'))))
                counts[sensor] += 1
    records = {}
    for key, scenes in aggregate.items():
        lows = [lo for _, lo, _ in scenes if lo is not None and -1 <= lo <= 1]
        highs = [hi for _, _, hi in scenes if hi is not None and -1 <= hi <= 1]
        records[key] = {'mean': round(float(np.mean([v for v, _, _ in scenes])), 4), 'min': round(min(lows), 4) if lows else None,
                        'max': round(max(highs), 4) if highs else None, 'observations': len(scenes)}
    return records, counts


def export_ndvi(source):
    """Refresh only the monthly NDVI in parcel-data.json, leaving every other export untouched."""
    data = json.loads((OUT / 'data/parcel-data.json').read_text())
    ndvi, _ = monthly_ndvi(source / 'dataset' / 'DATASET_RETO_AGRO_2026')
    for parcel in data.values():
        parcel['ndvi'] = {}
    for (pid, sensor, date), record in ndvi.items():
        if pid in data:
            data[pid]['ndvi'].setdefault(sensor, {})[date] = record
    write(OUT / 'data/parcel-data.json', data)


def export(source):
    dataset = source / 'dataset'
    original = dataset / 'DATASET_RETO_AGRO_2026'
    features = json.loads((dataset / 'alphaearth/parcels/parcels_wgs84.geojson').read_text())['features']
    features.sort(key=lambda f: f['properties']['ID_POLIGON'])
    yields = {r['ID_POLIGONO']: r for r in records(original / 'ID_area_rendimiento_70_30_Reto_AgroCebada.csv')}
    parcels = {}
    for f in features:
        props = f['properties']
        pid = props['ID_POLIGON']
        geometry = shape(f['geometry'])
        centroid = geometry.centroid
        properties = {
            'id': pid, 'municipality': props['Municipio'], 'state': props['Estado'],
            'crop': 'Cebada', 'area': number(yields[pid]['AREA_HA']),
            'group': 'training' if props['CONJUNTO'] == 'ENTRENAMIENTO' else 'prediction',
            'observedYield': number(yields[pid]['RENDIMIENTO_T_HA']),
            'predictedYield': 4.2, 'predictionSource': 'placeholder',
            'centroid': [round(centroid.x, 7), round(centroid.y, 7)],
            'bounds': [round(n, 7) for n in geometry.bounds],
        }
        f['properties'] = properties
        # Strip z, retain the original x/y precision and complete boundaries.
        def xy(v):
            return v[:2] if isinstance(v[0], (int, float)) else [xy(c) for c in v]
        f['geometry']['coordinates'] = xy(f['geometry']['coordinates'])
        parcels[pid] = {'climate': {}, 'ndvi': {}, 'embedding': {}}
    metadata = records(source / 'plots/plot_features/row_metadata.csv')
    feature_path = source / 'plots/plot_features/all_plot_features.csv'
    with open(feature_path, encoding='utf-8-sig', newline='') as f:
        reader = csv.reader(f)
        header = next(reader)
        keep = {k: i for i, k in enumerate(header) if k.startswith('raster__') and k.endswith('__mean')}
        by_id = {f['properties']['id']: f for f in features}
        for index, row in enumerate(reader):
            pid = metadata[index]['ID_POLIGONO']
            vals = {k: number(row[i]) for k, i in keep.items()}
            by_id[pid]['properties']['elevation'] = vals.get('raster__elevation_m__mean')
            by_id[pid]['properties']['slope'] = vals.get('raster__slope_deg__mean')
            for y in range(2022, 2026):
                for m in range(1, 13):
                    date = f'{y}-{m:02d}'
                    parcels[pid]['climate'][date] = {key: vals.get(f'raster__{col}__{date}__mean') for key, col in [('precipitation', 'precip_mm_month'), ('tmin', 'tmin_c_month'), ('tmax', 'tmax_c_month')]}
    ndvi, counts = monthly_ndvi(original)
    for (pid, sensor, date), record in ndvi.items():
        if pid in parcels:
            parcels[pid]['ndvi'].setdefault(sensor, {})[date] = record
    write(OUT / 'data/parcels.geojson', {'type': 'FeatureCollection', 'features': features})
    write(OUT / 'data/parcel-data.json', parcels)
    write(OUT / 'data/model.json', {'status': 'placeholder', 'exampleYield': 4.2, 'unit': 't/ha', 'metrics': {'rmse': None, 'mae': None, 'r2': None}, 'explanation': None})
    # Reproject the INEGI source (declares EPSG:6365) to GeoJSON WGS84.
    for name in ['municipios', 'estados']:
        src = dataset / f'qgis/inegi/{name}.geojson'
        tmp = OUT / f'data/{name}.full.geojson'
        ds = gdal.VectorTranslate(str(tmp), str(src), format='GeoJSON', dstSRS='EPSG:4326')
        ds = None
        d = json.loads(tmp.read_text())
        for feature in d['features']:
            props = feature['properties']
            feature['properties'] = {k: props[k] for k in ['cvegeo', 'nomgeo', 'cve_ent'] if k in props}
            feature['geometry'] = mapping(shape(feature['geometry']).simplify(0.00012, preserve_topology=True))
        d.pop('crs', None)
        write(OUT / f'data/{name}.geojson', d)
        tmp.unlink()
    # Retain the QGIS render and its exact CRS/extent for every original raster.
    qmap = dataset / 'agrocebada-web/public/map'
    layer_js = (qmap / 'layers/layers.js').read_text()
    layers = {}
    (OUT / 'rasters/climate').mkdir(parents=True, exist_ok=True)
    (OUT / 'rasters/terrain').mkdir(parents=True, exist_ok=True)
    for block in layer_js.split('var lyr_'):
        if 'ImageStatic' not in block:
            continue
        match = re.search(r'url:\s*"\./layers/([^"]+)"', block)
        ext = re.search(r'imageExtent:\s*(\[[^\]]+\])', block)
        crs = re.search(r"projection:\s*'([^']+)'", block)
        if not (match and ext and crs):
            continue
        filename = match[1]
        if filename.startswith('Pendiente'):
            key, folder = 'slope', 'terrain'
        elif filename.startswith('Elevacin'):
            key, folder = 'elevation', 'terrain'
        else:
            year, month = filename[:4], filename[4:6]
            variable = 'tmax' if 'mxima' in filename else 'tmin' if 'mnima' in filename else 'precipitation'
            key, folder = f'{variable}/{year}-{month}', 'climate'
        target = OUT / f'rasters/{folder}/{filename}'
        shutil.copyfile(qmap / 'layers' / filename, target)
        layers[key] = {'url': f'/rasters/{folder}/{filename}', 'extent': json.loads(ext[1]), 'projection': crs[1]}
    write(OUT / 'data/layers.json', layers)
    provenance = {
        'parcelCount': len(features), 'trainingCount': sum(f['properties']['group'] == 'training' for f in features),
        'predictionCount': sum(f['properties']['group'] == 'prediction' for f in features),
        'totalArea': round(sum(f['properties']['area'] for f in features), 2),
        'cycle': '2025-04-01/2025-10-31', 'climateYears': [2022, 2023, 2024, 2025],
        'satelliteRetained': dict(counts), 'satelliteCloudLimit': 30,
        'rasters': len(layers), 'createdAt': '2026-10-01',
        'modelStatus': 'placeholder',
        'sources': [{'path': str(p.relative_to(source)), 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()} for p in [original / 'ID_area_rendimiento_70_30_Reto_AgroCebada.csv', dataset / 'alphaearth/parcels/parcels_wgs84.geojson']],
    }
    write(OUT / 'data/provenance.json', provenance)
    print(json.dumps(provenance, ensure_ascii=False, indent=2), flush=True)


def export_embeddings(source, years):
    """Annual RGB previews and all 64 area-weighted dequantized embedding axes."""
    b = source / 'dataset/alphaearth'
    data = json.loads((OUT / 'data/parcel-data.json').read_text())
    transform = Transformer.from_crs('EPSG:32614', 'EPSG:4326', always_xy=True)
    for year in years:
        folder = OUT / f'rasters/alphaearth/{year}'
        folder.mkdir(parents=True, exist_ok=True)
        for pid in data:
            ds = gdal.Open(str(b / f'rasters/{year}/{pid}.tif'))
            raw = ds.ReadAsArray()
            valid = (raw != -128).all(axis=0)
            embedding = np.sign(raw.astype(float)) * (raw.astype(float) / 127.5) ** 2
            weights = gdal.Open(str(b / f'parcels/{pid}_pixel_area_fraction.tif')).ReadAsArray()
            weights = np.where(valid, weights, 0)
            mean = (embedding * weights).sum(axis=(1, 2)) / weights.sum()
            norm = np.linalg.norm(mean)
            normalized = mean / norm if norm else mean
            gt = ds.GetGeoTransform()
            x0, y0 = gt[0], gt[3]
            x1, y1 = x0 + gt[1] * ds.RasterXSize, y0 + gt[5] * ds.RasterYSize
            sw = transform.transform(x0, y1)
            ne = transform.transform(x1, y0)
            # Display A00/A01/A02 with a fixed [-0.25, 0.25] stretch. This is
            # an embedding visualization, not vegetation health or true color.
            rgba = np.zeros((ds.RasterYSize, ds.RasterXSize, 4), dtype=np.uint8)
            rgba[:, :, :3] = np.clip((embedding[:3].transpose(1, 2, 0) + 0.25) * 510, 0, 255).astype(np.uint8)
            rgba[:, :, 3] = valid.astype(np.uint8) * 230
            Image.fromarray(rgba).save(folder / f'{pid}.png', optimize=True)
            data[pid]['embedding'][str(year)] = {'values': [round(float(n), 5) for n in normalized], 'url': f'/rasters/alphaearth/{year}/{pid}.png', 'extent': [x0, y1, x1, y0], 'projection': 'EPSG:32614'}
        print(f'AlphaEarth {year}: {len(data)} rasters, 64 axes per parcel', flush=True)
    write(OUT / 'data/parcel-data.json', data)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', type=Path, default=SOURCE)
    parser.add_argument('--embeddings-only', action='store_true')
    parser.add_argument('--ndvi-only', action='store_true', help='only refresh the monthly NDVI (mean, min, max) in parcel-data.json')
    args = parser.parse_args()
    if args.ndvi_only:
        export_ndvi(args.source)
        raise SystemExit
    if not args.embeddings_only:
        export(args.source)
    export_embeddings(args.source, range(2017, 2026))
