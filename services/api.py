"""Local rig service. The same-origin Worker supplies the server-held token."""
import asyncio, hmac, os, time
from collections import OrderedDict
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response
from imagery import get_manifest, public_manifest, tile_png, ImageryUnavailable
from segmentation import infer_proposal, model_info

app=FastAPI(docs_url=None,redoc_url=None,openapi_url=None)
TOKEN=os.environ.get('AGROCEBADA_SERVICE_TOKEN','')
if not TOKEN: raise RuntimeError('Configure AGROCEBADA_SERVICE_TOKEN before starting the service.')
tile_slots=asyncio.Semaphore(4)
pending_tiles=0
requests_by_client=OrderedDict()

@app.middleware('http')
async def protect(request:Request,call_next):
    if TOKEN and not hmac.compare_digest(request.headers.get('x-agrocebada-service-token',''),TOKEN): return JSONResponse({'error':'Servicio no autorizado.'},status_code=403)
    if request.headers.get('content-length','0').isdigit() and int(request.headers.get('content-length','0'))>16384: return JSONResponse({'error':'Solicitud demasiado grande.'},status_code=413)
    now=time.time();client=request.headers.get('x-demo-client',request.client.host if request.client else 'local')
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

@app.post('/api/segmentation/proposals')
async def proposal(request:Request):
    raw=await request.body()
    if len(raw)>16384: return JSONResponse({'error':'Solicitud demasiado grande.'},status_code=413)
    data=await request.json()
    if not isinstance(data,dict) or not isinstance(data.get('prompts'),list) or not isinstance(data.get('requestId'),str) or len(data['requestId'])>80 or not isinstance(data.get('imageryVersion'),str) or not isinstance(data.get('month'),str): raise ValueError('Solicitud de delimitación no válida.')
    result=await asyncio.to_thread(infer_proposal,data)
    return JSONResponse(result,headers={'Cache-Control':'no-store'})
