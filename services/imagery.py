"""Versioned Sentinel-2 monthly mosaics on globally aligned native grids.

512x512 processing cells are a cache implementation detail. Coverage and scene
selection come from the complete three-state boundary, never a crop rectangle.
Indices are calculated at native resolution before tile resampling.
"""
from pathlib import Path
from collections import OrderedDict
from concurrent.futures import ThreadPoolExecutor
import calendar, hashlib, io, json, math, threading, time
import numpy as np
import requests
import rasterio
from rasterio.enums import Resampling
from rasterio.features import geometry_mask
from rasterio.transform import from_origin, from_bounds
from affine import Affine
from rasterio.vrt import WarpedVRT
from rasterio.warp import reproject, transform_bounds
from shapely.geometry import shape, mapping, box, Point
from shapely.ops import unary_union, transform
from pyproj import Transformer
from diskcache import Cache
from diskcache import Lock
from urllib.parse import urlsplit, parse_qs
from datetime import datetime, timezone
from PIL import Image
import mercantile

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / '.data-cache/imagery'
MANIFESTS = DATA / 'manifests'
MANIFESTS.mkdir(parents=True, exist_ok=True)
CACHE = Cache(str(DATA / 'cache'), size_limit=40*1024**3, eviction_policy='least-recently-used')
BOUNDARY_FILE = ROOT / 'services/data/states.geojson'
BOUNDARY_SHA = hashlib.sha256(BOUNDARY_FILE.read_bytes()).hexdigest()
STATES = json.loads(BOUNDARY_FILE.read_text())
COVERAGE = unary_union([shape(f['geometry']) for f in STATES['features']])
TO_UTM = Transformer.from_crs(4326,32614,always_xy=True).transform
TO_WGS = Transformer.from_crs(32614,4326,always_xy=True).transform
COVERAGE_UTM = transform(TO_UTM,COVERAGE)
STAC = 'https://planetarycomputer.microsoft.com/api/stac/v1'
CELL = 512
CELL_METERS = CELL*10
_signatures = {}
_sign_lock = threading.Lock()
_manifest_lock = threading.Lock()
_cell_locks = [threading.Lock() for _ in range(257)]
_local = threading.local()

class ImageryUnavailable(Exception): pass

def versioned_manifest(manifest):
    native={k:manifest[k] for k in ('algorithm','month','boundarySha256','scenes')}
    digest=lambda value:'s2-v1-'+hashlib.sha256(json.dumps(value,sort_keys=True,separators=(',',':')).encode()).hexdigest()[:16]
    native_version=digest(native)
    renderer={'renderVersion':2,'tileRendering':'Native indices and thresholds, then weighted display overviews.'}
    version=digest({**native,**renderer})
    return {**manifest,**renderer,'nativeVersion':native_version,'version':version,'tileTemplate':f'/api/imagery/tiles/{version}/{manifest["month"]}/{{product}}/{{z}}/{{x}}/{{y}}.png'}

def persist_manifest(manifest):
    body=json.dumps(manifest,separators=(',',':'),ensure_ascii=False)
    (MANIFESTS/f'{manifest["version"]}.json').write_text(body)
    pointer=MANIFESTS/f'{manifest["month"]}.json';temporary=pointer.with_suffix('.tmp');temporary.write_text(body);temporary.replace(pointer)
    return manifest

def checked_month(month):
    if not isinstance(month,str) or len(month)!=7: raise ValueError('Mes no válido.')
    year,m = map(int,month.split('-'))
    if year not in range(2022,2026) or m not in range(1,13): raise ValueError('El atlas cubre 2022–2025.')
    return year,m

def calibrate(dn, scale, offset):
    result = dn.astype('float32')*scale + offset
    result[dn==0] = np.nan
    return result

def normalized_difference(a,b):
    with np.errstate(invalid='ignore', divide='ignore'):
        result = (a-b)/(a+b)
    return np.where(np.isfinite(result) & (np.abs(a+b)>1e-7) & (np.abs(result)<=1),result,np.nan).astype('float32')

def aggregate_green(green):
    # Native 10m reflectance is area-averaged onto the exact 20m SWIR grid.
    h,w=green.shape
    values=green.reshape(h//2,2,w//2,2)
    valid=np.isfinite(values)
    count=valid.sum(axis=(1,3))
    total=np.where(valid,values,0).sum(axis=(1,3))
    return np.divide(total,count,out=np.full(count.shape,np.nan,dtype='float32'),where=count>0)

def sign(href):
    parsed=urlsplit(href);account=parsed.hostname.split('.')[0];container=parsed.path.strip('/').split('/')[0]
    cachekey=f'sas/{account}/{container}'
    # One shared container SAS serves all bands and scenes. Signing individual
    # files exhausts the public signing quota and breaks uncached tile requests.
    with Lock(CACHE,'lock/'+cachekey,expire=120):
        cached=CACHE.get(cachekey)
        if cached and cached['expires']>time.time()+300: return href+'?'+cached['token']
        for attempt in range(4):
            response=requests.get(f'https://planetarycomputer.microsoft.com/api/sas/v1/token/{account}/{container}',timeout=30)
            if response.status_code!=429: break
            if attempt==3: raise ImageryUnavailable('El proveedor de imágenes está ocupado. Vuelve a intentar en unos segundos.')
            time.sleep(min(8,2**attempt))
        response.raise_for_status();token=response.json()['token']
        expires=datetime.fromisoformat(parse_qs(token)['se'][0].replace('Z','+00:00')).timestamp()
        CACHE.set(cachekey,{'token':token,'expires':expires},expire=max(1,expires-time.time()))
        return href+'?'+token

def build_manifest(month, refresh=False):
    year,m=checked_month(month)
    pointer=MANIFESTS/f'{month}.json'
    if pointer.exists() and not refresh:
        existing=json.loads(pointer.read_text())
        return existing if existing.get('renderVersion')==2 else persist_manifest(versioned_manifest(existing))
    # Every scene whose footprint intersects the full INEGI union is retained.
    params={'collections':'sentinel-2-l2a','bbox':','.join(map(str,COVERAGE.bounds)),
            'datetime':f'{month}-01T00:00:00Z/{month}-{calendar.monthrange(year,m)[1]:02d}T23:59:59Z','limit':500}
    response=requests.get(STAC+'/search',params=params,timeout=90)
    response.raise_for_status(); page=response.json(); raw=[]
    while True:
        raw.extend(f for f in page['features'] if shape(f['geometry']).intersects(COVERAGE))
        next_link=next((link for link in page.get('links',[]) if link['rel']=='next'),None)
        if not next_link: break
        response=requests.request(next_link.get('method','GET'),next_link['href'],json=next_link.get('body'),timeout=90)
        response.raise_for_status();page=response.json()
    # A reprocessed duplicate of the same acquisition/tile uses the newest
    # baseline and generation date. No random scene subsampling is performed.
    unique={}
    for f in raw:
        p=f['properties']; key=(p['s2:mgrs_tile'],p['datetime'])
        if key not in unique or (p['s2:processing_baseline'],p.get('s2:generation_time',''),f['id']) > (unique[key]['properties']['s2:processing_baseline'],unique[key]['properties'].get('s2:generation_time',''),unique[key]['id']): unique[key]=f
    scenes=[]
    for f in unique.values():
        p=f['properties'];baseline=p['s2:processing_baseline']
        # PC stores original (unharmonized) L2A DNs. Product metadata has
        # BOA_QUANTIFICATION_VALUE=10000, BOA_ADD_OFFSET=-1000 at PB>=04.00.
        # This exact source rule is independently verified against original XML.
        scenes.append({'id':f['id'],'date':p['datetime'],'tile':p['s2:mgrs_tile'],
                       'cloudCover':p['eo:cloud_cover'],'baseline':baseline,
                       'calibration':{'scale':.0001,'offset':-.1 if float(baseline)>=4 else 0},
                       'geometry':f['geometry'],'bbox':f['bbox'],
                       'assets':{k:f['assets'][k]['href'] for k in ('B02','B03','B04','B08','B11','SCL','product-metadata')},
                       'stacUrl':f'{STAC}/collections/sentinel-2-l2a/items/{f["id"]}'})
    scenes.sort(key=lambda s:(s['cloudCover'],s['date'],s['id']))
    content={'algorithm':'s2-native-clear-first-v1','month':month,'boundarySha256':BOUNDARY_SHA,'scenes':scenes}
    version='s2-v1-'+hashlib.sha256(json.dumps(content,sort_keys=True,separators=(',',':')).encode()).hexdigest()[:16]
    content.update(version=version,source='Copernicus Sentinel-2 L2A / Microsoft Planetary Computer',
                   resolution={'rgb':10,'ndvi':10,'mndwi':20},states=['Hidalgo','Puebla','Tlaxcala'],
                   tiles=sorted({s['tile'] for s in scenes}),mosaic='Primera observación despejada por píxel; orden nubosidad, fecha, ID. Máscara SCL 4/5/6/7.',
                   missingData='Transparente; sin interpolación ni imputación.',
                   tileTemplate=f'/api/imagery/tiles/{version}/{month}/{{product}}/{{z}}/{{x}}/{{y}}.png')
    return persist_manifest(versioned_manifest(content))

def get_manifest(month,version=None):
    checked_month(month)
    if version:
        if not version.startswith('s2-v1-') or len(version)!=22: raise ValueError('Versión no válida.')
        file=MANIFESTS/f'{version}.json'
        if not file.exists(): raise ValueError('La versión de imagen ya no está disponible. Selecciona de nuevo el mes.')
        manifest=json.loads(file.read_text())
        if manifest['month']!=month: raise ValueError('La versión no coincide con el mes.')
        return manifest
    with _manifest_lock: return build_manifest(month)

def public_manifest(manifest):
    return {**manifest,'scenes':[{k:v for k,v in s.items() if k not in ('geometry','assets','bbox')} for s in manifest['scenes']]}

def read_band(scene,band,transform_grid,size):
    # Each thread owns a bounded dataset pool; GDAL byte-range reads stay in
    # server memory. Signed URLs never reach the browser or public manifest.
    datasets=getattr(_local,'datasets',None)
    if datasets is None: datasets=_local.datasets=OrderedDict()
    href=scene['assets'][band]
    key=(href,int(time.time()//1200))
    dataset=datasets.get(key)
    if dataset is None:
        with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN='EMPTY_DIR',CPL_VSIL_CURL_ALLOWED_EXTENSIONS='.tif',GDAL_HTTP_CONNECTTIMEOUT=15,GDAL_HTTP_TIMEOUT=45,GDAL_HTTP_MAX_RETRY=2,GDAL_CACHEMAX=128):
            dataset=rasterio.open(sign(href))
        datasets[key]=dataset
        if len(datasets)>20: datasets.popitem(last=False)[1].close()
    else: datasets.move_to_end(key)
    with WarpedVRT(dataset,crs='EPSG:32614',transform=transform_grid,width=size,height=size,resampling=Resampling.nearest,nodata=0) as vrt:
        return vrt.read(1)

def cell_grid(cx,cy,resolution=10):
    left,bottom=cx*CELL_METERS,cy*CELL_METERS
    return from_origin(left,bottom+CELL_METERS,resolution,resolution)

def native_cell(manifest,cx,cy):
    cachekey=f'cell/{manifest.get("nativeVersion",manifest["version"])}/{cx}/{cy}'
    cached=CACHE.get(cachekey)
    if cached is not None:
        with np.load(io.BytesIO(cached)) as loaded: return {k:loaded[k] for k in loaded.files}
    with _cell_locks[hash(cachekey)%len(_cell_locks)]:
        cached=CACHE.get(cachekey)
        if cached is not None:
            with np.load(io.BytesIO(cached)) as loaded: return {k:loaded[k] for k in loaded.files}
        tf=cell_grid(cx,cy);tf20=cell_grid(cx,cy,20)
        bounds=(cx*CELL_METERS,cy*CELL_METERS,(cx+1)*CELL_METERS,(cy+1)*CELL_METERS)
        clipped=COVERAGE_UTM.intersection(box(*bounds))
        inside=geometry_mask([mapping(clipped)],(CELL,CELL),tf,invert=True) if not clipped.is_empty else np.zeros((CELL,CELL),bool)
        inside20=geometry_mask([mapping(clipped)],(CELL//2,CELL//2),tf20,invert=True) if not clipped.is_empty else np.zeros((CELL//2,CELL//2),bool)
        rgb=np.full((3,CELL,CELL),np.nan,'float32');ndvi=np.full((CELL,CELL),np.nan,'float32');water=np.full((CELL//2,CELL//2),np.nan,'float32')
        source=np.full((CELL,CELL),65535,'uint16');water_source=np.full((CELL//2,CELL//2),65535,'uint16')
        region=transform(TO_WGS,box(*bounds))
        for index,scene in enumerate(manifest['scenes']):
            if not shape(scene['geometry']).intersects(region): continue
            remaining=inside & ~np.isfinite(ndvi);remaining20=inside20 & ~np.isfinite(water)
            if not remaining.any() and not remaining20.any(): break
            scl=read_band(scene,'SCL',tf20,CELL//2)
            clear20=np.isin(scl,[4,5,6,7]);clear=clear20.repeat(2,0).repeat(2,1)
            if not (remaining & clear).any() and not (remaining20 & clear20).any(): continue
            calibration=scene['calibration']
            green=calibrate(read_band(scene,'B03',tf,CELL),**calibration)
            if (remaining & clear).any():
                red=calibrate(read_band(scene,'B04',tf,CELL),**calibration)
                blue=calibrate(read_band(scene,'B02',tf,CELL),**calibration)
                nir=calibrate(read_band(scene,'B08',tf,CELL),**calibration)
                vegetation=normalized_difference(nir,red)
                valid=remaining & clear & np.isfinite(vegetation) & np.isfinite(green) & np.isfinite(blue)
                rgb[:,valid]=np.stack([red,green,blue])[:,valid];ndvi[valid]=vegetation[valid];source[valid]=index
            if (remaining20 & clear20).any():
                swir=calibrate(read_band(scene,'B11',tf20,CELL//2),**calibration)
                mndwi=normalized_difference(aggregate_green(green),swir)
                valid20=remaining20 & clear20 & np.isfinite(mndwi)
                water[valid20]=mndwi[valid20];water_source[valid20]=index
        result={'rgb':rgb,'ndvi':ndvi,'mndwi':water,'source':source,'waterSource':water_source}
        buffer=io.BytesIO();np.savez_compressed(buffer,**result);CACHE.set(cachekey,buffer.getvalue())
        return result

def cells_for_bounds(bounds):
    x0,y0,x1,y1=bounds
    for cy in range(math.floor(y0/CELL_METERS),math.ceil(y1/CELL_METERS)):
        for cx in range(math.floor(x0/CELL_METERS),math.ceil(x1/CELL_METERS)):
            if COVERAGE_UTM.intersects(box(cx*CELL_METERS,cy*CELL_METERS,(cx+1)*CELL_METERS,(cy+1)*CELL_METERS)): yield cx,cy

def crop_rgb(manifest,bounds):
    x0,y0,x1,y1=bounds
    width,height=round((x1-x0)/10),round((y1-y0)/10)
    tf=from_origin(x0,y1,10,10)
    rgb=np.full((3,height,width),np.nan,'float32');source=np.full((height,width),65535,'uint16')
    for cx,cy in cells_for_bounds(bounds):
        cell=native_cell(manifest,cx,cy)
        for band in range(3): reproject(cell['rgb'][band],rgb[band],src_transform=cell_grid(cx,cy),src_crs=32614,dst_transform=tf,dst_crs=32614,src_nodata=np.nan,dst_nodata=np.nan,init_dest_nodata=False,resampling=Resampling.nearest)
        reproject(cell['source'],source,src_transform=cell_grid(cx,cy),src_crs=32614,dst_transform=tf,dst_crs=32614,src_nodata=65535,dst_nodata=65535,init_dest_nodata=False,resampling=Resampling.nearest)
    return rgb,source,tf

def rgb_uint8(rgb):
    return np.moveaxis((np.clip(np.nan_to_num(rgb,nan=0)/.3,0,1)**.8*255).astype('uint8'),0,-1)

def tile_png(manifest,product,z,x,y,threshold=0):
    if product not in ('rgb','ndvi','mndwi') or not 6<=z<=16 or not 0<=x<2**z or not 0<=y<2**z or not math.isfinite(threshold) or not -1<=threshold<=1: raise ValueError('Tesela o umbral no válido.')
    threshold_key=f'{threshold:.3f}' if float(threshold)==round(float(threshold),3) else float(threshold).hex()
    key=f'tile/{manifest["version"]}/{product}/{z}/{x}/{y}/{threshold_key}'
    cached=CACHE.get(key)
    if cached is not None: return cached
    tile=mercantile.Tile(x,y,z);bb=mercantile.bounds(tile)
    rgba=np.zeros((256,256,4),'uint8')
    if COVERAGE.intersects(box(*bb)):
        web=mercantile.xy_bounds(tile);tf=from_bounds(*web,256,256)
        native_bounds=transform_bounds(3857,32614,*web,densify_pts=21)
        channels=3 if product=='rgb' else 1
        totals=np.zeros((channels,256,256),'float64');counts=np.zeros((256,256),'float64');domain=np.zeros_like(counts)
        for cx,cy in cells_for_bounds(native_bounds):
            cell=native_cell(manifest,cx,cy);data=cell[product]
            if data.ndim==2: data=data[None]
            valid=np.isfinite(data).all(axis=0)
            if product!='rgb': valid &= data[0]>=threshold
            src_tf=cell_grid(cx,cy,20 if product=='mndwi' else 10)
            # A 5km cell occupies only a few overview pixels. Warp all bands in
            # one call and restrict the destination to those pixels, preserving
            # the exact global tile grid and native scientific calculation.
            cb=transform_bounds(32614,3857,cx*CELL_METERS,cy*CELL_METERS,(cx+1)*CELL_METERS,(cy+1)*CELL_METERS,densify_pts=21)
            col0=max(0,math.floor((cb[0]-tf.c)/tf.a)-1);col1=min(256,math.ceil((cb[2]-tf.c)/tf.a)+1)
            row0=max(0,math.floor((tf.f-cb[3])/-tf.e)-1);row1=min(256,math.ceil((tf.f-cb[1])/-tf.e)+1)
            if col0>=col1 or row0>=row1: continue
            values=np.concatenate([np.where(valid[None],data,0),valid[None],np.ones((1,*valid.shape))]).astype('float64')
            if manifest.get('renderVersion',1)>=2:
                native_resolution=20 if product=='mndwi' else 10
                ratio=(tf.a*math.cos(math.radians((bb.north+bb.south)/2)))/native_resolution
                factor=min(valid.shape[0],2**max(0,math.floor(math.log2(max(1,ratio/4)))))
                if factor>1:
                    # Native thresholds remain exact. Sum reflectance/indices,
                    # valid counts and total counts together before display
                    # reprojection, retaining nodata and water area fractions.
                    height,width=valid.shape
                    values=values.reshape(channels+2,height//factor,factor,width//factor,factor).sum(axis=(2,4))
                    src_tf=src_tf @ Affine.scale(factor,factor)
            temp=np.zeros((channels+2,row1-row0,col1-col0),'float64')
            reproject(values,temp,src_transform=src_tf,src_crs=32614,dst_transform=tf @ Affine.translation(col0,row0),dst_crs=3857,resampling=Resampling.sum)
            totals[:,row0:row1,col0:col1]+=temp[:channels]
            counts[row0:row1,col0:col1]+=temp[channels]
            domain[row0:row1,col0:col1]+=temp[channels+1]
        values=np.divide(totals,counts[None],out=np.zeros_like(totals),where=counts[None]>0)
        if product=='rgb': rgba[:,:,:3]=rgb_uint8(values)
        elif product=='mndwi': rgba[:,:,:3]=[65,213,234]
        else:
            v=np.clip((values[0]+1)/2,0,1)
            stops=np.array([[119,85,51],[207,180,108],[177,201,128],[62,133,72],[22,82,49]])
            position=v*4;lo=np.floor(position).astype(int);hi=np.minimum(lo+1,4);fraction=(position-lo)[:,:,None]
            rgba[:,:,:3]=(stops[lo]*(1-fraction)+stops[hi]*fraction).astype('uint8')
        rgba[:,:,3]=(np.divide(counts,domain,out=np.zeros_like(counts),where=domain>0).clip(0,1)*255).astype('uint8')
    buffer=io.BytesIO();Image.fromarray(rgba).save(buffer,format='PNG',optimize=True)
    result=buffer.getvalue();CACHE.set(key,result);return result
