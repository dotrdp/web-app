"""Restartable July native-cell prewarm, then cached statewide overview tiles."""
from concurrent.futures import ThreadPoolExecutor, as_completed
import argparse, json, time
import mercantile
from imagery import get_manifest, native_cell, cells_for_bounds, COVERAGE_UTM, COVERAGE, tile_png, CACHE

def warm_cell(manifest,cell):
    for attempt in range(4):
        try: native_cell(manifest,*cell);return cell
        except Exception:
            if attempt==3: raise
            time.sleep(2**attempt)

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--month',default='2025-07');parser.add_argument('--workers',type=int,default=8);parser.add_argument('--tiles-only',action='store_true');args=parser.parse_args()
    manifest=get_manifest(args.month);cells=list(cells_for_bounds(COVERAGE_UTM.bounds))
    # Opening view precedes the far-state overview so the first visit is usable.
    cells.sort(key=lambda c: (c[0]*5120-546000)**2+(c[1]*5120-2180000)**2)
    completed=0;failures=[];started=time.monotonic()
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        jobs={pool.submit(warm_cell,manifest,c):c for c in ([] if args.tiles_only else cells)}
        for future in as_completed(jobs):
            completed+=1
            try: future.result()
            except Exception as error: failures.append({'cell':jobs[future],'error':type(error).__name__})
            if completed%20==0: print(json.dumps({'done':completed,'total':len(cells),'failures':len(failures),'seconds':round(time.monotonic()-started),'cacheGiB':round(CACHE.volume()/1024**3,3)}),flush=True)
    if failures: raise RuntimeError(json.dumps(failures))
    print(json.dumps({'nativeComplete':True,'nativeCells':len(cells),'tilesOnly':args.tiles_only}),flush=True)
    for z in range(6,10):
        with ThreadPoolExecutor(max_workers=3) as pool:
            jobs=[pool.submit(tile_png,manifest,product,tile.z,tile.x,tile.y,threshold) for tile in mercantile.tiles(*COVERAGE.bounds,z) for product,threshold in [('rgb',-1),('ndvi',-1),('mndwi',0)]]
            for future in as_completed(jobs): future.result()
        print(json.dumps({'overviewZoom':z,'complete':True}),flush=True)
    with ThreadPoolExecutor(max_workers=3) as pool:
        jobs=[pool.submit(tile_png,manifest,product,tile.z,tile.x,tile.y,threshold) for z in (10,11) for tile in mercantile.tiles(-98.82,19.48,-97.95,20.11,z) for product,threshold in [('rgb',-1),('ndvi',-1),('mndwi',0)]]
        for future in as_completed(jobs): future.result()
    print(json.dumps({'openingViewComplete':True}),flush=True)
    print(json.dumps({'complete':True,'nativeCells':len(cells),'seconds':round(time.monotonic()-started)}),flush=True)
if __name__=='__main__':main()
