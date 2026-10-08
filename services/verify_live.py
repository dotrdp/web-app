"""Repeatable public-service checks; records evidence without source credentials."""
import argparse,io,json,time
from datetime import datetime,timezone
from pathlib import Path
import numpy as np
from PIL import Image
from shapely.geometry import Point,shape
from shapely.ops import unary_union
import mercantile,requests
from imagery import ROOT,COVERAGE

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--origin',default='https://agrocebada.datascience-mexico.com');parser.add_argument('--output',default='.data-cache/verification/live.json');args=parser.parse_args()
    origin=args.origin.rstrip('/');output=Path(args.output);output.parent.mkdir(parents=True,exist_ok=True)
    points=json.loads((ROOT/'services/data/demo-checkpoints.json').read_text());month=points['month']
    original=json.loads((ROOT/'public/data/parcels.geojson').read_text())['features'];original_union=unary_union([shape(f['geometry']) for f in original])
    report={'origin':origin,'checkedAt':datetime.now(timezone.utc).isoformat(),'fields':[],'tiles':[]}
    response=requests.get(origin+'/api/imagery/health',timeout=20);response.raise_for_status();assert response.json()['model']=='SAM 2.1 tiny'
    response=requests.get(origin+'/api/imagery/manifests/'+month,timeout=20);response.raise_for_status();manifest=response.json();report['version']=manifest['version'];assert len(manifest['tiles'])==16 and len(manifest['scenes'])>100
    assert all('assets' not in s and s['date'].startswith(month) for s in manifest['scenes'])
    for item in points['unknownFields']:
        point=Point(item['coordinates']);assert COVERAGE.covers(point) and not original_union.covers(point)
        started=time.monotonic();response=requests.post(origin+'/api/segmentation/proposals',json={'requestId':'live-'+item['state'],'month':month,'imageryVersion':manifest['version'],'prompts':[{'coordinates':item['coordinates'],'label':1}]},timeout=95);response.raise_for_status();proposal=response.json()
        polygon=shape(proposal['geometry']);assert polygon.is_valid and polygon.covers(point) and polygon.area>0
        assert proposal['provenance']['weights']=='fixed-pretrained' and proposal['provenance']['cropGrid']['projection']=='EPSG:32614'
        record={**item,'wallSeconds':round(time.monotonic()-started,3),'areaHa':proposal['area'],'score':proposal['provenance']['score'],'warnings':proposal['warnings'],'latencyMs':proposal['provenance']['latencyMs']};report['fields'].append(record)
        (output.parent/('proposal-'+item['state'].lower()+'.json')).write_text(json.dumps(proposal,indent=2));print(json.dumps(record,ensure_ascii=False),flush=True)
    for item in points['waterViews']:
        assert COVERAGE.covers(Point(item['coordinates']))
        tile=mercantile.tile(*item['coordinates'],13)
        for product in ('rgb','ndvi','mndwi'):
            threshold=0 if product=='mndwi' else -1
            url=manifest['tileTemplate'].replace('{product}',product).replace('{z}',str(tile.z)).replace('{x}',str(tile.x)).replace('{y}',str(tile.y))
            started=time.monotonic()
            for retry in range(3):
                response=requests.get(origin+url,params={'threshold':threshold},timeout=95)
                if response.status_code!=503: break
                time.sleep(1)
            response.raise_for_status();assert 'image/png' in response.headers['Content-Type']
            with Image.open(io.BytesIO(response.content)) as image: pixels=np.array(image);assert image.size==(256,256)
            count=int((pixels[:,:,3]>0).sum());assert count>0,(item,product)
            if product=='mndwi': assert np.all(pixels[pixels[:,:,3]>0,:3]==[65,213,234])
            filename=f'{item["state"].lower()}-{product}.png';(output.parent/filename).write_bytes(response.content)
            record={**item,'product':product,'visiblePixels':count,'wallSeconds':round(time.monotonic()-started,3),'retries':retry,'file':filename};report['tiles'].append(record);print(json.dumps(record,ensure_ascii=False),flush=True)
    parcel=original[0];point=shape(parcel['geometry']).representative_point();response=requests.post(origin+'/api/segmentation/proposals',json={'requestId':'reference-'+parcel['properties']['id'],'month':month,'imageryVersion':manifest['version'],'prompts':[{'coordinates':[point.x,point.y],'label':1}]},timeout=95);response.raise_for_status();proposal=response.json();reference=shape(parcel['geometry']);polygon=shape(proposal['geometry']);iou=polygon.intersection(reference).area/polygon.union(reference).area
    report['reference']={'parcel':parcel['properties']['id'],'iou':round(iou,4),'score':proposal['provenance']['score'],'latencyMs':proposal['provenance']['latencyMs']};assert iou>.7
    output.write_text(json.dumps(report,indent=2,ensure_ascii=False));print(json.dumps({'complete':True,'report':str(output),'reference':report['reference']},ensure_ascii=False),flush=True)
if __name__=='__main__':main()
