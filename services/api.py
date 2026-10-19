"""Local rig service. The same-origin Worker supplies the server-held token."""
import asyncio, hmac, os, time
from collections import OrderedDict
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response, FileResponse
from imagery import get_manifest, public_manifest, tile_png, ImageryUnavailable
from segmentation import prepare_crop, finish_proposal, model_info, model_file

app=FastAPI(docs_url=None,redoc_url=None,openapi_url=None)
TOKEN=os.environ.get('AGROCEBADA_SERVICE_TOKEN','')
if not TOKEN: raise RuntimeError('Configure AGROCEBADA_SERVICE_TOKEN before starting the service.')
tile_slots=asyncio.Semaphore(4)
pending_tiles=0
requests_by_client=OrderedDict()
# The browser sends its three masks back as run lengths; everything else is a few points.
def body_limit(path): return 262144 if path=='/api/segmentation/proposals' else 16384

@app.middleware('http')
async def protect(request:Request,call_next):
    if TOKEN and not hmac.compare_digest(request.headers.get('x-agrocebada-service-token',''),TOKEN): return JSONResponse({'error':'Servicio no autorizado.'},status_code=403)
    if request.headers.get('content-length','0').isdigit() and int(request.headers.get('content-length','0'))>body_limit(request.url.path): return JSONResponse({'error':'Solicitud demasiado grande.'},status_code=413)
    # Map tiles come in bursts of dozens; they get their own budget so they never starve a delineation.
    now=time.time();client=(request.headers.get('x-demo-client',request.client.host if request.client else 'local'),request.url.path.startswith('/api/imagery/tiles/'))
    requests_by_client.setdefault(client,[])
    recent=[t for t in requests_by_client[client] if now-t<60]
    if len(recent)>=240: return JSONResponse({'error':'Demasiadas solicitudes. Espera unos segundos.'},status_code=429)
    requests_by_client[client]=recent+[now];requests_by_client.move_to_end(client)
    while len(requests_by_client)>2048: requests_by_client.popitem(last=False)
    try: return await call_next(request)
    except ValueError as error: return JSONResponse({'error':str(error)},status_code=422)
    except ImageryUnavailable as error: return JSONResponse({'error':str(error)},status_code=503)
    except Exception as error:
        print(f'Service error: {type(error).__name__}',flush=True)
        return JSONResponse({'error':'Servicio de imágenes no disponible. Puedes seguir usando el atlas.'},status_code=503)

@app.get('/api/imagery/health')
async def health():
    return {'status':'ok','service':'rig','model':model_info()['model']}

@app.get('/api/imagery/manifests/{month}')
async def manifest(month:str):
    value=await asyncio.to_thread(get_manifest,month)
    return JSONResponse(public_manifest(value),headers={'Cache-Control':'public, max-age=3600'})

@app.get('/api/imagery/tiles/{version}/{month}/{product}/{z}/{x}/{y}.png')
async def tile(version:str,month:str,product:str,z:int,x:int,y:int,threshold:float=0):
    global pending_tiles
    if pending_tiles>=32: return JSONResponse({'error':'Las imágenes se están preparando. Intenta de nuevo.'},status_code=503,headers={'Retry-After':'5'})
    pending_tiles+=1
    try:
        async with tile_slots:
            manifest=await asyncio.to_thread(get_manifest,month,version)
            data=await asyncio.to_thread(tile_png,manifest,product,z,x,y,threshold)
    finally: pending_tiles-=1
    return Response(data,media_type='image/png',headers={'Cache-Control':'public, max-age=31536000, immutable','X-Imagery-Version':version})

async def body(request:Request,check):
    raw=await request.body()
    if len(raw)>body_limit(request.url.path): return None
    data=await request.json()
    if not isinstance(data,dict) or not isinstance(data.get('requestId'),str) or len(data['requestId'])>80 or not check(data): raise ValueError('Solicitud de delimitación no válida.')
    return data

@app.get('/api/segmentation/model')
async def segmentation_model():
    info=await asyncio.to_thread(model_info)
    return JSONResponse({'model':info['model'],'runtime':info['runtime'],'files':{k:{**v,'url':f"/api/segmentation/models/{v['file']}"} for k,v in info['files'].items()}},headers={'Cache-Control':'no-cache'})

@app.get('/api/segmentation/models/{name}')
async def segmentation_model_file(name:str):
    path=await asyncio.to_thread(model_file,name)
    if path is None: return JSONResponse({'error':'Este recurso no existe.'},status_code=404)
    return FileResponse(path,media_type='application/octet-stream',headers={'Cache-Control':'public, max-age=31536000, immutable'})

@app.post('/api/segmentation/crops')
async def crop(request:Request):
    data=await body(request,lambda d:isinstance(d.get('prompts'),list) and isinstance(d.get('imageryVersion'),str) and isinstance(d.get('month'),str) and (d.get('side') is None or type(d['side']) is int))
    if data is None: return JSONResponse({'error':'Solicitud demasiado grande.'},status_code=413)
    result=await asyncio.to_thread(prepare_crop,data)
    return JSONResponse(result,headers={'Cache-Control':'no-store'})

@app.post('/api/segmentation/proposals')
async def proposal(request:Request):
    data=await body(request,lambda d:isinstance(d.get('cropId'),str) and isinstance(d.get('masks'),list) and isinstance(d.get('scores'),list))
    if data is None: return JSONResponse({'error':'Solicitud demasiado grande.'},status_code=413)
    result=await asyncio.to_thread(finish_proposal,data)
    return JSONResponse(result,headers={'Cache-Control':'no-store'})
