"""Fixed SAM 2.1 tiny image inference. Proposals are never saved as parcels."""
from pathlib import Path
import hashlib, json, math, threading, time, uuid
import numpy as np
import torch
from rasterio.features import shapes
from shapely.geometry import shape, Point, Polygon, mapping
from shapely.ops import transform
from scipy.ndimage import label, binary_fill_holes
from pyproj import Geod
from sam2.build_sam import build_sam2
from sam2.sam2_image_predictor import SAM2ImagePredictor
from imagery import ROOT, COVERAGE, COVERAGE_UTM, TO_UTM, TO_WGS, get_manifest, crop_rgb, rgb_uint8, public_manifest, ImageryUnavailable

CHECKPOINT = ROOT / '.data-cache/sam2.1_hiera_tiny.pt'
CODE_VERSION = (ROOT / 'services/model-version.json')
_lock = threading.Lock()
_predictor = None
_model_info = None

def model_info():
    global _model_info
    if _model_info is None:
        if not CHECKPOINT.exists(): raise ImageryUnavailable('El servicio de delimitación no está disponible.')
        _model_info = json.loads(CODE_VERSION.read_text())
        actual=hashlib.sha256(CHECKPOINT.read_bytes()).hexdigest()
        if actual!=_model_info['checkpointSha256']: raise ImageryUnavailable('La versión del modelo no coincide con la configuración.')
    return _model_info

def predictor():
    global _predictor
    if _predictor is None:
        model_info()
        if not torch.cuda.is_available(): raise ImageryUnavailable('El servicio de delimitación no está disponible.')
        model=build_sam2('configs/sam2.1/sam2.1_hiera_t.yaml',str(CHECKPOINT),device='cuda',apply_postprocessing=False)
        model.eval()
        for parameter in model.parameters(): parameter.requires_grad_(False)
        _predictor=SAM2ImagePredictor(model)
    return _predictor

def infer_proposal(request):
    started=time.monotonic()
    prompts=request['prompts']
    if not isinstance(prompts,list) or not 1<=len(prompts)<=24: raise ValueError('Añade entre 1 y 24 puntos, incluyendo un punto interior.')
    for prompt in prompts:
        if not isinstance(prompt,dict): raise ValueError('Los puntos de delimitación no son válidos.')
        coordinates=prompt.get('coordinates')
        if not isinstance(coordinates,list) or len(coordinates)!=2 or not all(isinstance(v,(int,float)) and math.isfinite(v) for v in coordinates) or prompt.get('label') not in (0,1): raise ValueError('Los puntos de delimitación no son válidos.')
        if not COVERAGE.covers(Point(coordinates)): raise ValueError('Selecciona un terreno dentro de Hidalgo, Puebla o Tlaxcala.')
    if not any(p['label']==1 for p in prompts): raise ValueError('Añade un punto interior antes de excluir áreas.')
    manifest=get_manifest(request['month'],request['imageryVersion'])
    xy=np.array([TO_UTM(*p['coordinates']) for p in prompts]);labels=np.array([p['label'] for p in prompts])
    main_index=int(np.flatnonzero(labels==1)[0]);main_point=Point(xy[main_index])
    side=max(1280,math.ceil((np.ptp(xy,axis=0).max()+640)/10)*10)
    if side>5120: raise ValueError('Los puntos están demasiado separados. Delimita una parcela a la vez.')
    if not _lock.acquire(blocking=False): raise ImageryUnavailable('El servicio está delimitando otra parcela. Vuelve a intentar en unos segundos.')
    try:
        model=predictor();warnings=[]
        for expansion in range(3):
            if time.monotonic()-started>75: raise ImageryUnavailable('La delimitación tardó demasiado. Vuelve a intentar.')
            center=xy.mean(axis=0);x0=math.floor((center[0]-side/2)/10)*10;y0=math.floor((center[1]-side/2)/10)*10
            bounds=(x0,y0,x0+side,y0+side)
            rgb,source,tf=crop_rgb(manifest,bounds)
            if time.monotonic()-started>75: raise ImageryUnavailable('La delimitación tardó demasiado. Vuelve a intentar.')
            points=np.column_stack([(xy[:,0]-bounds[0])/10,(bounds[3]-xy[:,1])/10])
            pixel=np.floor(points).astype(int);pixel[:,0]=np.clip(pixel[:,0],0,rgb.shape[2]-1);pixel[:,1]=np.clip(pixel[:,1],0,rgb.shape[1]-1)
            if not all(np.isfinite(rgb[:,y,x]).all() for (x,y),lab in zip(pixel,labels) if lab==1): raise ImageryUnavailable('No hay una observación despejada en ese punto y mes. Elige otro mes o dibuja manualmente.')
            with torch.inference_mode(),torch.autocast('cuda',dtype=torch.bfloat16):
                model.set_image(rgb_uint8(rgb))
                masks,scores,_=model.predict(point_coords=points,point_labels=labels,multimask_output=True)
            choices=[]
            for mask,score in zip(masks,scores):
                component,count=label(mask)
                component_id=component[pixel[main_index,1],pixel[main_index,0]]
                if not component_id: continue
                selected=component==component_id
                satisfies=all(bool(selected[y,x])==bool(lab) for (x,y),lab in zip(pixel,labels))
                if satisfies: choices.append((float(score),selected))
            if not choices: raise ValueError('El resultado es ambiguo. Añade un punto interior o exterior y vuelve a intentar.')
            choices.sort(key=lambda x:x[0],reverse=True);score,mask=choices[0]
            touches=mask[0].any() or mask[-1].any() or mask[:,0].any() or mask[:,-1].any()
            if touches and side<5120:
                side=min(5120,side*2);continue
            if touches: warnings.append('La propuesta alcanza el borde de la imagen. Ajusta manualmente sus límites antes de guardar.')
            if score<.7 or len(choices)>1 and score-choices[1][0]<.04: warnings.append('Límites ambiguos: revisa la propuesta y añade puntos o ajusta los vértices.')
            if np.isfinite(rgb).all(axis=0).mean()<.8: warnings.append('Parte de la imagen no tiene observaciones despejadas en este mes.')
            # Keep one connected field and an editable exterior. Holes cannot be
            # confirmed reliably at 10m and the existing editor has no hole tool.
            mask=binary_fill_holes(mask).astype('uint8')
            candidates=[shape(geom) for geom,value in shapes(mask,mask=mask.astype(bool),transform=tf) if value==1]
            polygon=next((p for p in candidates if p.covers(main_point)),None)
            if polygon is None: raise ValueError('No pudimos obtener un límite válido. Prueba con otro punto.')
            polygon=Polygon(polygon.exterior).simplify(5,preserve_topology=True).intersection(COVERAGE_UTM)
            if polygon.geom_type=='MultiPolygon': polygon=next((p for p in polygon.geoms if p.covers(main_point)),None)
            if polygon is None or polygon.is_empty or not polygon.is_valid or polygon.geom_type!='Polygon': raise ValueError('La propuesta no es un polígono válido. Ajusta los puntos.')
            # Simplification and filling tiny raster holes must never silently
            # undo an inclusion/exclusion prompt. The current editor supports
            # one exterior; an excluded interior hole needs manual correction.
            if not all(polygon.covers(Point(point))==bool(lab) for point,lab in zip(xy,labels)): raise ValueError('Los límites no respetan todos los puntos. Ajusta los puntos o dibuja manualmente.')
            wgs=transform(TO_WGS,polygon);geometry=mapping(wgs)
            area=abs(Geod(ellps='WGS84').geometry_area_perimeter(wgs)[0])/10000
            if area<.001 or area>100000 or len(wgs.exterior.coords)>1000: raise ValueError('No pudimos delimitar una parcela válida. Prueba con otro punto.')
            info=model_info();indices=set(np.unique(source).tolist())-{65535}
            scenes=[s for i,s in enumerate(public_manifest(manifest)['scenes']) if i in indices]
            provenance={**info,'imageryVersion':manifest['version'],'month':request['month'],'scenes':scenes,'prompts':prompts,'cropBounds':transform(TO_WGS,Polygon.from_bounds(*bounds)).bounds,'cropGrid':{'projection':'EPSG:32614','extent':bounds,'transform':list(tf)[:6]},'resolution':10,'proposedGeometry':geometry,'score':score,'latencyMs':round((time.monotonic()-started)*1000)}
            return {'id':str(uuid.uuid4()),'requestId':request['requestId'],'geometry':geometry,'area':round(area,4),'warnings':warnings,'provenance':provenance}
        raise ValueError('No se obtuvo una propuesta válida. Dibuja el terreno manualmente.')
    finally: _lock.release()
