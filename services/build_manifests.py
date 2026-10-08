"""Build all 48 immutable manifests; summarize every intersecting MGRS tile."""
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
import argparse, json
from imagery import build_manifest, ROOT

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--refresh',action='store_true');args=parser.parse_args()
    months=[f'{year}-{month:02d}' for year in range(2022,2026) for month in range(1,13)]
    summaries=[]
    with ThreadPoolExecutor(max_workers=4) as pool:
        jobs={pool.submit(build_manifest,month,args.refresh):month for month in months}
        for future in as_completed(jobs):
            manifest=future.result()
            summary={k:manifest[k] for k in ('month','version','tiles','resolution','boundarySha256')}
            summary['sceneCount']=len(manifest['scenes']);summaries.append(summary)
            print(json.dumps(summary),flush=True)
    (ROOT/'public/data/sentinel-index.json').write_text(json.dumps({'source':'Copernicus / Microsoft Planetary Computer','states':['Hidalgo','Puebla','Tlaxcala'],'months':sorted(summaries,key=lambda x:x['month'])},indent=2))
if __name__=='__main__': main()
