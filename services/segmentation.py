"""SAM 2.1 tiny runs in the visitor's browser (onnxruntime-web on WebGPU, WebAssembly fallback).
This service only prepares the satellite crop and turns the browser's masks into a checked
proposal, so it needs no GPU. Proposals are never saved as parcels."""
from collections import OrderedDict
import base64, hashlib, json, math, threading, time, uuid
import numpy as np
from rasterio.features import shapes
from shapely.geometry import shape, Point, Polygon, mapping
from shapely.ops import transform
from scipy.ndimage import label, binary_fill_holes
from pyproj import Geod
from imagery import ROOT, COVERAGE, COVERAGE_UTM, TO_UTM, TO_WGS, get_manifest, crop_rgb, rgb_uint8, public_manifest, ImageryUnavailable

MODELS = ROOT / '.data-cache/sam2-onnx'
CODE_VERSION = ROOT / 'services/model-version.json'
MAX_SIDE = 5120
_crops = OrderedDict(); _crops_lock = threading.Lock()
_model_info = None

def model_info():
    """The fixed model, with the ONNX files the browser downloads checked against their hashes."""
    global _model_info
    if _model_info is None:
        info = json.loads(CODE_VERSION.read_text()); files = info.get('browser', {}).get('files', {})
        if set(files) != {'encoder', 'decoder'}: raise ImageryUnavailable('El servicio de delimitación no está disponible.')
        for entry in files.values():
            path = MODELS / entry['file']
            if not path.exists(): raise ImageryUnavailable('El servicio de delimitación no está disponible.')
            if hashlib.sha256(path.read_bytes()).hexdigest() != entry['sha256']: raise ImageryUnavailable('La versión del modelo no coincide con la configuración.')
        _model_info = {k: v for k, v in info.items() if k != 'browser'} | {'runtime': info['browser']['runtime'], 'files': {k: {'file': v['file'], 'sha256': v['sha256'], 'bytes': v['bytes']} for k, v in files.items()}}
    return _model_info

def model_file(name):
    """Path of one of the two published ONNX files, or None."""
    files = model_info()['files']
    return next((MODELS / f['file'] for f in files.values() if f['file'] == name), None)

def _prompts(request):
    prompts = request.get('prompts')
    if not isinstance(prompts, list) or not 1 <= len(prompts) <= 24: raise ValueError('Añade entre 1 y 24 puntos, incluyendo un punto interior.')
    for prompt in prompts:
        if not isinstance(prompt, dict): raise ValueError('Los puntos de delimitación no son válidos.')
        coordinates = prompt.get('coordinates')
        if not isinstance(coordinates, list) or len(coordinates) != 2 or not all(isinstance(v, (int, float)) and math.isfinite(v) for v in coordinates) or prompt.get('label') not in (0, 1): raise ValueError('Los puntos de delimitación no son válidos.')
        if not COVERAGE.covers(Point(coordinates)): raise ValueError('Selecciona un terreno dentro de Hidalgo, Puebla o Tlaxcala.')
    if not any(p['label'] == 1 for p in prompts): raise ValueError('Añade un punto interior antes de excluir áreas.')
    return prompts

def prepare_crop(request):
    """Step 1: the square 10 m crop around the points, as RGB bytes for the browser model.
    `side` is only for retries after a proposal touched the edge (each retry doubles it)."""
    started = time.monotonic()
    prompts = _prompts(request)
    manifest = get_manifest(request['month'], request['imageryVersion'])
    xy = np.array([TO_UTM(*p['coordinates']) for p in prompts]); labels = np.array([p['label'] for p in prompts])
    smallest = max(1280, math.ceil((np.ptp(xy, axis=0).max() + 640) / 10) * 10)
    if smallest > MAX_SIDE: raise ValueError('Los puntos están demasiado separados. Delimita una parcela a la vez.')
    side = request.get('side', smallest)
    if side not in {min(MAX_SIDE, smallest * 2 ** k) for k in range(4)}: raise ValueError('Solicitud de delimitación no válida.')
    center = xy.mean(axis=0); x0 = math.floor((center[0] - side / 2) / 10) * 10; y0 = math.floor((center[1] - side / 2) / 10) * 10
    bounds = (x0, y0, x0 + side, y0 + side)
    rgb, source, tf = crop_rgb(manifest, bounds)
    points = np.column_stack([(xy[:, 0] - bounds[0]) / 10, (bounds[3] - xy[:, 1]) / 10])
    pixel = np.floor(points).astype(int); pixel[:, 0] = np.clip(pixel[:, 0], 0, rgb.shape[2] - 1); pixel[:, 1] = np.clip(pixel[:, 1], 0, rgb.shape[1] - 1)
    if not all(np.isfinite(rgb[:, y, x]).all() for (x, y), lab in zip(pixel, labels) if lab == 1): raise ImageryUnavailable('No hay una observación despejada en ese punto y mes. Elige otro mes o dibuja manualmente.')
    image = rgb_uint8(rgb); crop_id = str(uuid.uuid4())
    entry = {'requestId': request['requestId'], 'month': request['month'], 'manifest': manifest, 'prompts': prompts, 'xy': xy, 'labels': labels, 'pixel': pixel,
             'bounds': bounds, 'tf': tf, 'side': side, 'sources': set(np.unique(source).tolist()) - {65535}, 'clear': float(np.isfinite(rgb).all(axis=0).mean()), 'started': started, 'shape': image.shape[:2]}
    with _crops_lock:
        _crops[crop_id] = entry
        while len(_crops) > 64 or _crops and time.monotonic() - next(iter(_crops.values()))['started'] > 900: _crops.popitem(last=False)
    return {'cropId': crop_id, 'requestId': request['requestId'], 'side': side, 'width': image.shape[1], 'height': image.shape[0],
            'points': points.round(3).tolist(), 'labels': labels.tolist(), 'image': base64.b64encode(image.tobytes()).decode()}

def decode_mask(runs, height, width):
    """Run lengths over the row-major mask, starting with a run of zeros."""
    if not isinstance(runs, list) or len(runs) > height * width or not all(isinstance(v, int) and v >= 0 for v in runs) or sum(runs) != height * width: raise ValueError('La máscara de delimitación no es válida.')
    values = np.zeros(len(runs), bool); values[1::2] = True
    return np.repeat(values, runs).reshape(height, width)

def finish_proposal(request):
    """Step 2: picks the browser's best mask that honours every point and returns a checked polygon,
    or {'expand': side} when the field reaches the crop's edge and a larger crop is needed."""
    with _crops_lock: entry = _crops.get(request.get('cropId'))
    if entry is None or entry['requestId'] != request.get('requestId'): raise ValueError('La imagen de delimitación caducó. Vuelve a intentar.')
    masks, scores = request.get('masks'), request.get('scores')
    if not isinstance(masks, list) or not isinstance(scores, list) or not 1 <= len(masks) <= 3 or len(masks) != len(scores) or not all(isinstance(s, (int, float)) and math.isfinite(s) for s in scores): raise ValueError('La máscara de delimitación no es válida.')
    height, width = entry['shape']; masks = [decode_mask(m, height, width) for m in masks]
    pixel, labels, xy, side, bounds, tf = entry['pixel'], entry['labels'], entry['xy'], entry['side'], entry['bounds'], entry['tf']
    main_index = int(np.flatnonzero(labels == 1)[0]); main_point = Point(xy[main_index]); warnings = []
    choices = []
    for mask, score in zip(masks, scores):
        component, count = label(mask)
        component_id = component[pixel[main_index, 1], pixel[main_index, 0]]
        if not component_id: continue
        selected = component == component_id
        if all(bool(selected[y, x]) == bool(lab) for (x, y), lab in zip(pixel, labels)): choices.append((float(score), selected))
    if not choices: raise ValueError('El resultado es ambiguo. Añade un punto interior o exterior y vuelve a intentar.')
    choices.sort(key=lambda x: x[0], reverse=True); score, mask = choices[0]
    touches = mask[0].any() or mask[-1].any() or mask[:, 0].any() or mask[:, -1].any()
    if touches and side < MAX_SIDE: return {'requestId': request['requestId'], 'expand': min(MAX_SIDE, side * 2)}
    if touches: warnings.append('La propuesta alcanza el borde de la imagen. Ajusta manualmente sus límites antes de guardar.')
    if score < .7 or len(choices) > 1 and score - choices[1][0] < .04: warnings.append('Límites ambiguos: revisa la propuesta y añade puntos o ajusta los vértices.')
    if entry['clear'] < .8: warnings.append('Parte de la imagen no tiene observaciones despejadas en este mes.')
    # Keep one connected field and an editable exterior. Holes cannot be
    # confirmed reliably at 10m and the existing editor has no hole tool.
    mask = binary_fill_holes(mask).astype('uint8')
    candidates = [shape(geom) for geom, value in shapes(mask, mask=mask.astype(bool), transform=tf) if value == 1]
    polygon = next((p for p in candidates if p.covers(main_point)), None)
    if polygon is None: raise ValueError('No pudimos obtener un límite válido. Prueba con otro punto.')
    polygon = Polygon(polygon.exterior).simplify(5, preserve_topology=True).intersection(COVERAGE_UTM)
    if polygon.geom_type == 'MultiPolygon': polygon = next((p for p in polygon.geoms if p.covers(main_point)), None)
    if polygon is None or polygon.is_empty or not polygon.is_valid or polygon.geom_type != 'Polygon': raise ValueError('La propuesta no es un polígono válido. Ajusta los puntos.')
    # Simplification and filling tiny raster holes must never silently
    # undo an inclusion/exclusion prompt. The current editor supports
    # one exterior; an excluded interior hole needs manual correction.
    if not all(polygon.covers(Point(point)) == bool(lab) for point, lab in zip(xy, labels)): raise ValueError('Los límites no respetan todos los puntos. Ajusta los puntos o dibuja manualmente.')
    wgs = transform(TO_WGS, polygon); geometry = mapping(wgs)
    area = abs(Geod(ellps='WGS84').geometry_area_perimeter(wgs)[0]) / 10000
    if area < .001 or area > 100000 or len(wgs.exterior.coords) > 1000: raise ValueError('No pudimos delimitar una parcela válida. Prueba con otro punto.')
    info = {k: v for k, v in model_info().items() if k != 'files'} | {'device': request.get('device') if request.get('device') in ('webgpu', 'wasm') else 'browser'}
    scenes = [s for i, s in enumerate(public_manifest(entry['manifest'])['scenes']) if i in entry['sources']]
    provenance = {**info, 'imageryVersion': entry['manifest']['version'], 'month': entry['month'], 'scenes': scenes, 'prompts': entry['prompts'], 'cropBounds': transform(TO_WGS, Polygon.from_bounds(*bounds)).bounds,
                  'cropGrid': {'projection': 'EPSG:32614', 'extent': bounds, 'transform': list(tf)[:6]}, 'resolution': 10, 'proposedGeometry': geometry, 'score': score, 'latencyMs': round((time.monotonic() - entry['started']) * 1000)}
    return {'id': str(uuid.uuid4()), 'requestId': request['requestId'], 'geometry': geometry, 'area': round(area, 4), 'warnings': warnings, 'provenance': provenance}
