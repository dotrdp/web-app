"""Render ambient GIFs from real INEGI geometry and georeferenced Esri imagery.

This is a cartographic rendering, with no baked-in login copy or map dependency
at runtime. Run: uv run --no-project --python /usr/bin/python3 scripts/render_login.py
"""
from pathlib import Path
import io, json, math, hashlib
import numpy as np
import requests
from PIL import Image, ImageDraw, ImageFont
from pyproj import Transformer

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/artwork'
CACHE = ROOT / '.data-cache/artwork'
OUT.mkdir(parents=True, exist_ok=True)
CACHE.mkdir(parents=True, exist_ok=True)
PARCELS = json.loads((ROOT / 'public/data/parcels.geojson').read_text())['features']
MUNICIPIOS = json.loads((ROOT / 'public/data/municipios.geojson').read_text())['features']
project = Transformer.from_crs(4326, 3857, always_xy=True).transform
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 10)

def composition(width, height, mobile=False):
    # Farmland around Calpulalpan, the original FIRA parcel region. The stable
    # camera places the field network on the right and leaves the copy quiet.
    cx, cy = project(-98.57, 19.56)
    span = 24000 if not mobile else 34000
    bounds = (cx-span*.66, cy-span*height/width*.57, cx+span*.34, cy+span*height/width*.43)
    raw = CACHE / ('mobile.jpg' if mobile else 'desktop.jpg')
    url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export'
    params = dict(bbox=','.join(map(str,bounds)), bboxSR=3857, imageSR=3857,
                  size=f'{width},{height}', format='jpg', f='image')
    if not raw.exists():
        response = requests.get(url, params=params, timeout=60)
        response.raise_for_status()
        raw.write_bytes(response.content)
    source = Image.open(raw).convert('RGB').resize((width,height))
    a = np.asarray(source).astype(float) / 255
    lum = a[:,:,0]*.25+a[:,:,1]*.6+a[:,:,2]*.15
    x = np.linspace(0,1,width)[None,:]
    y = np.linspace(0,1,height)[:,None]
    quiet = .18 + .65*np.clip((x-.18)*1.7,0,1)
    quiet = quiet * (.72 + .28*np.abs(y-.4))
    if mobile: quiet = .4+.3*x
    terrain = np.stack([14+lum*27*quiet, 27+lum*42*quiet, 24+lum*30*quiet],axis=-1)
    base = Image.fromarray(terrain.clip(0,255).astype('uint8'))
    def pixel(coord):
        px,py = project(*coord[:2]);return ((px-bounds[0])*width/(bounds[2]-bounds[0]), (bounds[3]-py)*height/(bounds[3]-bounds[1]))
    draw = ImageDraw.Draw(base)
    for feature in MUNICIPIOS:
        geom = feature['geometry']; polygons = geom['coordinates'] if geom['type']=='MultiPolygon' else [geom['coordinates']]
        for polygon in polygons:
            line = [pixel(c) for c in polygon[0]]
            if any(-100<p[0]<width+100 and -100<p[1]<height+100 for p in line):
                draw.line(line, fill=(44,64,53), width=1)
    fields=[]
    for feature in PARCELS:
        points=[pixel(c) for c in feature['geometry']['coordinates'][0]]
        if any(0<p[0]<width and 0<p[1]<height for p in points):
            draw.line(points,fill=(92,112,76),width=1)
            fields.append(points)
    # Geographical annotation remains small; all headline text stays in HTML.
    draw.text((width-160,height-100),'CALPULALPAN',font=font,fill=(125,143,113))
    draw.text((width-160,height-82),'19.56 N  /  98.57 O',font=font,fill=(91,113,96))
    return base,fields,bounds,raw,params

def render(name,width,height,mobile=False):
    base,fields,bounds,raw,params = composition(width,height,mobile)
    frames=[]
    # A global palette keeps partial-frame encoding efficient and eliminates
    # palette flicker. The final frame differs from the first by one small step.
    palette_sample=base.copy()
    d=ImageDraw.Draw(palette_sample)
    for k in range(24): d.rectangle((k*5,0,k*5+4,5),fill=(74+k*3,105+k*3,65+k*2))
    palette=palette_sample.quantize(colors=128,method=Image.Quantize.MEDIANCUT)
    for i in range(120):
        t=i/120
        frame=base.copy();d=ImageDraw.Draw(frame)
        for k,points in enumerate(fields):
            if k%4: continue
            phase=(t-k*.047)%1
            intensity=math.sin(math.pi*phase)**4
            if intensity>.025:
                color=tuple(round(a+(b-a)*intensity) for a,b in zip((62,87,56),(126,171,92)))
                d.polygon(points,fill=color)
            # Smoothly draw the outline, hold it, then fade it into the base.
            progress=min(1,phase*3)
            alpha=math.sin(math.pi*phase)**2
            path=points[:max(2,round(len(points)*progress))]
            d.line(path,fill=tuple(round(a+(b-a)*alpha) for a,b in zip((92,112,76),(187,207,130))),width=1)
        frame=frame.quantize(palette=palette,dither=Image.Dither.NONE)
        frames.append(frame)
    # GIF time units are 10ms; 80,80,90 produces exactly 12fps and 10s.
    frames[0].save(OUT/f'login-{name}.gif',save_all=True,append_images=frames[1:],
                   duration=[80,80,90]*40,loop=0,optimize=True,disposal=1)
    frames[35].convert('RGB').save(OUT/f'login-{name}-poster.webp',quality=90)
    for index in (0,40,80): frames[index].convert('RGB').save(OUT/f'storyboard-{name}-{index//40+1}.png')
    return dict(width=width,height=height,frames=120,durationMs=10000,loop=0,
                bounds3857=bounds,source='Esri World Imagery; INEGI; FIRA supplied parcels',
                sourceRequest=params,sourceSha256=hashlib.sha256(raw.read_bytes()).hexdigest(),
                bytes=(OUT/f'login-{name}.gif').stat().st_size)

metadata={'desktop':render('desktop',720,1050),'mobile':render('mobile',780,320,True)}
(OUT/'manifest.json').write_text(json.dumps(metadata,indent=2))
print(json.dumps(metadata,indent=2))
