import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import ImageLayer from 'ol/layer/Image';
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Cluster from 'ol/source/Cluster';
import ImageStatic from 'ol/source/ImageStatic';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style, Circle, Text } from 'ol/style';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import Feature from 'ol/Feature';
import { fromLonLat, toLonLat, transformExtent } from 'ol/proj';
import { getCenter, extend, createEmpty, intersects } from 'ol/extent';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { LocateFixed, Maximize2, Minus, Plus, Layers2 } from 'lucide-react';
import { IconButton, Tooltip } from '@mui/material';
import type { Atlas, Geometry, LayerSettings, MapFilters, MapMode, Parcel, Raster } from './types';
import { fmt } from './lib';
import { coloredNdviUrl, ndviColor } from './ndvi';

proj4.defs('EPSG:6372', '+proj=lcc +lat_0=12 +lon_0=-102 +lat_1=17.5 +lat_2=29.5 +x_0=2500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('EPSG:32614', '+proj=utm +zone=14 +datum=WGS84 +units=m +no_defs');
register(proj4);
const format = new GeoJSON();

export interface MapHandle { fitAll: () => void; fitParcel: (parcel: Parcel) => void; locate: (coords: number[]) => void; draw: () => void; edit: (parcel: Parcel) => void; cancel: () => void; finish: () => void; undo: () => void; geometry: () => Geometry | null }
interface Props { atlas: Atlas; parcels: Parcel[]; selected: Parcel | null; mode: MapMode; year: number; keyDate: string; filters: MapFilters; settings: LayerSettings; onBaseChange: () => void; onSelect: (id: string) => void; onDraft: (geometry: Geometry | null) => void }

export default forwardRef<MapHandle, Props>(function AtlasMap(props, ref) {
  const host = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const latest = useRef(props); latest.current = props;
  const runtime = useRef<{ map: Map; source: VectorSource; parcels: VectorLayer<VectorSource>; clusters: VectorLayer<Cluster>; images: ImageLayer<ImageStatic>[]; satellite: TileLayer<XYZ>; streets: TileLayer<OSM>; municipalities: VectorLayer<VectorSource>; states: VectorLayer<VectorSource>; draftSource: VectorSource; draftLayer: VectorLayer<VectorSource>; interaction: Draw | Modify | null; editingId: string | null } | null>(null);
  const [position, setPosition] = useState('19.754° N · 98.405° O');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rasterInfo, setRasterInfo] = useState({ valid: 0, displayed: 0 });
  const [embeddingCount, setEmbeddingCount] = useState(0);
  const [zoom, setZoom] = useState(11);
  const [viewportRevision, setViewportRevision] = useState(0);
  const initialFit = useRef(false);

  function fitParcel(parcel: Parcel) {
    const r = runtime.current; if (!r) return;
    r.map.getView().fit(transformExtent(parcel.properties.bounds, 'EPSG:4326', 'EPSG:3857'), { padding: [95, 65, 75, 65], maxZoom: 17.5, duration: 600 });
  }
  function cancel() {
    const r = runtime.current; if (!r) return;
    if (r.interaction) r.map.removeInteraction(r.interaction);
    r.interaction = null; r.editingId = null; r.draftSource.clear(); r.parcels.changed(); latest.current.onDraft(null);
  }
  function currentGeometry(): Geometry | null {
    const f = runtime.current?.draftSource.getFeatures()[0];
    return f ? format.writeGeometryObject(f.getGeometry()!, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }) as Geometry : null;
  }
  useImperativeHandle(ref, () => ({
    fitAll() { const r = runtime.current; const extent = r?.source.getExtent(); if (r && extent && !r.source.isEmpty()) r.map.getView().fit(extent, { padding: [85, 65, 70, 65], maxZoom: 13.5, duration: 550 }); },
    fitParcel,
    locate(coords) { runtime.current?.map.getView().animate({ center: fromLonLat(coords), zoom: 16, duration: 600 }); },
    draw() {
      cancel(); const r = runtime.current; if (!r) return;
      const interaction = new Draw({ source: r.draftSource, type: 'Polygon' });
      r.interaction = interaction; r.map.addInteraction(interaction);
      interaction.on('drawend', event => { const geometry = format.writeGeometryObject(event.feature.getGeometry()!, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }) as Geometry; latest.current.onDraft(geometry); r.map.removeInteraction(interaction); r.interaction = null; });
    },
    edit(parcel) {
      cancel(); const r = runtime.current; if (!r) return;
      const feature = format.readFeature(parcel, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }) as Feature<Polygon>;
      r.draftSource.addFeature(feature); r.editingId = parcel.properties.id; r.parcels.changed();
      const interaction = new Modify({ source: r.draftSource }); r.interaction = interaction; r.map.addInteraction(interaction);
      interaction.on('modifyend', () => latest.current.onDraft(currentGeometry()));
      latest.current.onDraft(parcel.geometry); fitParcel(parcel);
    },
    cancel, finish() { const r = runtime.current; if (r?.interaction instanceof Draw) { try { r.interaction.finishDrawing(); } catch { /* Need at least three points. */ } } },
    undo() { const r = runtime.current; if (r?.interaction instanceof Draw) r.interaction.removeLastPoint(); },
    geometry: currentGeometry,
  }));

  useEffect(() => {
    if (!host.current) return;
    const source = new VectorSource();
    const satellite = new TileLayer({ source: new XYZ({ url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', crossOrigin: 'anonymous', maxZoom: 19, attributions: 'Imagery © Esri, Maxar, Earthstar Geographics' }) });
    const streets = new TileLayer({ visible: false, source: new OSM({ crossOrigin: 'anonymous' }) });
    const municipalities = new VectorLayer({ source: new VectorSource({ url: '/data/municipios.geojson', format }), minZoom: 9, style: new Style({ stroke: new Stroke({ color: 'rgba(255,255,255,.26)', width: 1, lineDash: [4, 6] }) }) });
    const states = new VectorLayer({ source: new VectorSource({ url: '/data/estados.geojson', format }), style: new Style({ stroke: new Stroke({ color: 'rgba(230,236,215,.63)', width: 1.5 }) }) });
    const parcels = new VectorLayer({ source, zIndex: 40, style(feature) {
      const p = latest.current;
      if (feature.get('id') === runtime.current?.editingId) return undefined;
      const selected = feature.get('id') === p.selected?.properties.id;
      let color = feature.get('group') === 'prediction' ? '#e8b65f' : '#b8e0a0';
      let fill = feature.get('group') === 'prediction' ? 'rgba(228,179,90,.22)' : 'rgba(125,186,102,.22)';
      if (p.mode === 'ndvi') { const v = p.atlas.landsat[p.keyDate]?.parcels[feature.get('id')]?.mean; if (v != null) { color = `rgb(${ndviColor(v).join(',')})`; fill = `rgba(${ndviColor(v).join(',')},.4)`; } }
      if (p.mode === 'alphaearth') { const e = p.atlas.details[feature.get('id')]?.embedding[String(p.year)]?.values; if (e) { const rgb = e.slice(0, 3).map(n => Math.round(Math.min(255, Math.max(0, (n + .25) * 510)))); color = `rgb(${rgb.join(',')})`; fill = `rgba(${rgb.join(',')},.45)`; } }
      const result = [new Style({ stroke: new Stroke({ color: selected ? '#e6eeaf' : color, width: selected ? 3 : 1.5 }), fill: new Fill({ color: selected ? 'rgba(229,237,156,.28)' : fill }) })];
      if (selected) result.unshift(new Style({ stroke: new Stroke({ color: '#244f3e', width: 6 }) }));
      if ((runtime.current?.map.getView().getZoom() || 0) > 14) result.push(new Style({ text: new Text({ text: feature.get('name') || feature.get('id'), font: '600 11px Inter Variable, sans-serif', fill: new Fill({ color: '#fff' }), stroke: new Stroke({ color: '#244132', width: 3 }), overflow: false }) }));
      return result;
    } });
    const clustered = new Cluster({ source, distance: 26, minDistance: 14, geometryFunction: f => new Point(fromLonLat(f.get('centroid') as number[])) });
    const clusters = new VectorLayer({ source: clustered, zIndex: 50, maxZoom: 13.6, style(f) {
      const collection = f.get('features') as Feature[];
      const n = collection.length;
      const isSelected = collection.some(x => x.get('id') === latest.current.selected?.properties.id);
      const predict = collection.every(x => x.get('group') === 'prediction');
      return new Style({ image: new Circle({ radius: n > 1 ? 15 + Math.min(5, Math.log(n)) : 6, fill: new Fill({ color: isSelected ? '#e1edb0' : predict ? '#e6bb75' : '#376249' }), stroke: new Stroke({ color: isSelected ? '#244b38' : '#d2e1ca', width: 2 }) }), text: n > 1 ? new Text({ text: String(n), font: '600 11px Inter Variable, sans-serif', fill: new Fill({ color: isSelected || predict ? '#244b38' : 'white' }) }) : undefined });
    } });
    const draftSource = new VectorSource();
    const draftLayer = new VectorLayer({ source: draftSource, zIndex: 100, style: new Style({ stroke: new Stroke({ color: '#f1df79', width: 3, lineDash: [6, 4] }), fill: new Fill({ color: 'rgba(242,226,126,.22)' }), image: new Circle({ radius: 6, fill: new Fill({ color: '#f1df79' }), stroke: new Stroke({ color: '#365840', width: 2 }) }) }) });
    const map = new Map({ target: host.current, layers: [satellite, streets, municipalities, states, parcels, clusters, draftLayer], view: new View({ center: fromLonLat([-98.4, 19.755]), zoom: 10.85, minZoom: 5, maxZoom: 19 }), controls: defaultControls({ zoom: false, rotate: false }).extend([new ScaleLine({ bar: false })]) });
    runtime.current = { map, source, parcels, clusters, satellite, streets, municipalities, states, draftSource, draftLayer, images: [], interaction: null, editingId: null };
    map.on('singleclick', event => {
      if (runtime.current?.interaction) return;
      const clicked = map.forEachFeatureAtPixel(event.pixel, (f, layer) => layer === parcels || layer === clusters ? f : undefined, { hitTolerance: 8 });
      if (!clicked) return;
      const members = clicked.get('features') as Feature[] | undefined;
      if (members && members.length > 1) { const extent = createEmpty(); for (const f of members) extend(extent, f.getGeometry()!.getExtent()); map.getView().fit(extent, { padding: [80, 70, 70, 70], maxZoom: 16, duration: 450 }); }
      else latest.current.onSelect(members ? members[0].get('id') : clicked.get('id'));
    });
    map.on('pointermove', event => { if (event.dragging) return; const c = toLonLat(event.coordinate); setPosition(`${fmt(Math.abs(c[1]), 4)}° ${c[1] < 0 ? 'S' : 'N'} · ${fmt(Math.abs(c[0]), 4)}° ${c[0] < 0 ? 'O' : 'E'}`); host.current!.style.cursor = runtime.current?.interaction ? 'crosshair' : map.hasFeatureAtPixel(event.pixel, { layerFilter: l => l === parcels || l === clusters }) ? 'pointer' : 'grab'; });
    map.on('moveend', () => { setZoom(map.getView().getZoom() || 11); setViewportRevision(v => v + 1); });
    const resize = new ResizeObserver(() => map.updateSize()); resize.observe(host.current);
    return () => { resize.disconnect(); map.setTarget(undefined); runtime.current = null; initialFit.current = false; };
  }, []);

  useEffect(() => { const r = runtime.current; if (!r) return; r.source.clear(); r.source.addFeatures(format.readFeatures({ type: 'FeatureCollection', features: props.parcels }, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' })); const extent = r.source.getExtent(); if (!initialFit.current && extent) { initialFit.current = true; r.map.getView().fit(extent, { padding: [70, 60, 90, 60], maxZoom: 12.5, duration: 0 }); } }, [props.parcels]);
  useEffect(() => { const r = runtime.current; r?.parcels.changed(); r?.clusters.changed(); }, [props.selected, props.mode, props.year, props.keyDate]);

  useEffect(() => {
    const r = runtime.current; if (!r) return;
    r.satellite.setVisible(props.settings.base === 'satellite'); r.streets.setVisible(props.settings.base === 'streets');
    r.municipalities.setVisible(props.settings.municipalities); r.states.setVisible(props.settings.states);
    r.municipalities.setStyle(new Style({ stroke: new Stroke({ color: props.settings.base === 'streets' ? 'rgba(78,95,82,.32)' : 'rgba(255,255,255,.3)', width: 1, lineDash: [4, 6] }) }));
    r.states.setStyle(new Style({ stroke: new Stroke({ color: props.settings.base === 'streets' ? '#808f76' : 'rgba(230,236,215,.63)', width: 1.5 }) }));
    for (const layer of r.images) r.map.removeLayer(layer); r.images = [];
    setError(''); setEmbeddingCount(0); setRasterInfo({ valid: 0, displayed: 0 });
    let cancelled = false;
    const add = (raster: Raster, zIndex: number, url = raster.url) => {
      const layer = new ImageLayer({ zIndex, opacity: props.settings.opacity, source: new ImageStatic({ url, imageExtent: raster.extent, projection: raster.projection, crossOrigin: 'anonymous' }) });
      layer.getSource()!.on('imageloaderror', () => { if (!cancelled) setError('No se pudo cargar esta capa. Vuelve a seleccionar el mes.'); });
      r.images.push(layer); r.map.addLayer(layer);
    };
    for (const key of ['elevation', 'slope', 'precipitation', 'tmin', 'tmax'] as const) if (props.settings[key]) {
      const raster = props.atlas.rasters[['precipitation', 'tmin', 'tmax'].includes(key) ? `${key}/${props.keyDate}` : key];
      if (raster) add(raster, key === 'elevation' ? 5 : key === 'slope' ? 6 : 8);
    }
    if (props.mode === 'ndvi') {
      const raster = props.atlas.landsat[props.keyDate];
      if (!raster) { setLoading(false); setError('No hay un compuesto Landsat disponible para este mes.'); }
      else {
        setLoading(true);
        coloredNdviUrl(raster.url, props.filters.ndviThreshold, props.filters.ndviEnabled).then(image => {
          if (cancelled) return;
          add(raster, 12, image.url); setRasterInfo({ valid: image.valid, displayed: image.displayed }); setLoading(false);
        }).catch(() => { if (!cancelled) { setError('No pudimos cargar NDVI. Vuelve a seleccionar el mes.'); setLoading(false); } });
      }
    } else { setLoading(false); }
    if (props.mode === 'alphaearth') {
      const extent = r.map.getView().calculateExtent(r.map.getSize());
      let count = 0;
      for (const parcel of props.parcels) {
        const raster = props.atlas.details[parcel.properties.id]?.embedding[String(props.year)];
        if (raster && (zoom >= 13 || parcel.properties.id === props.selected?.properties.id) && intersects(extent, transformExtent(parcel.properties.bounds, 'EPSG:4326', 'EPSG:3857'))) { add(raster, 15); count++; }
      }
      setEmbeddingCount(count);
    }
    return () => { cancelled = true; };
  }, [props.mode, props.keyDate, props.year, props.settings, props.atlas, props.filters.ndviEnabled, props.filters.ndviThreshold, props.parcels, props.selected, zoom, viewportRevision]);

  const zoomBy = (delta: number) => { const view = runtime.current?.map.getView(); view?.animate({ zoom: (view.getZoom() || 11) + delta, duration: 200 }); };
  return <div className="map-canvas-wrap" ref={wrapper} data-testid="map" data-mode={props.mode} data-parcel-count={props.parcels.length} data-period={props.keyDate} data-valid-pixels={rasterInfo.valid} data-displayed-pixels={rasterInfo.displayed} data-embedding-count={embeddingCount}>
    <div ref={host} className="map-canvas" tabIndex={0} role="application" aria-label="Mapa interactivo de parcelas de Hidalgo, Puebla y Tlaxcala" onKeyDown={e => { if (e.key === 'Escape') cancel(); }}/>
    <div className="map-region-tag"><span className="live-dot"/> Hidalgo · Puebla · Tlaxcala <span className="tag-separator">/</span> <b>{props.parcels.length} parcelas</b></div>
    <div className="map-zoom-buttons">
      <Tooltip title="Acercar"><IconButton aria-label="Acercar mapa" onClick={() => zoomBy(1)}><Plus size={18}/></IconButton></Tooltip>
      <Tooltip title="Alejar"><IconButton aria-label="Alejar mapa" onClick={() => zoomBy(-1)}><Minus size={18}/></IconButton></Tooltip>
      <span/>
      <Tooltip title="Ver todas las parcelas"><IconButton aria-label="Ver todas las parcelas" onClick={() => { const r = runtime.current; const extent = r?.source.getExtent(); if (r && extent && !r.source.isEmpty()) r.map.getView().fit(extent, { padding: [80, 70, 70, 70], maxZoom: 13.5, duration: 450 }); }}><LocateFixed size={18}/></IconButton></Tooltip>
      <Tooltip title="Pantalla completa"><IconButton aria-label="Mapa en pantalla completa" onClick={() => { if (document.fullscreenElement) void document.exitFullscreen(); else void wrapper.current?.requestFullscreen(); }}><Maximize2 size={17}/></IconButton></Tooltip>
    </div>
    <div className="map-basemap"><Layers2 size={14}/><button onClick={props.onBaseChange} aria-label="Alternar mapa base">{props.settings.base === 'satellite' ? 'Satélite' : 'Calles'}</button></div>
    {loading && <div className="map-status" role="status"><span className="loader-dot"/> Cargando Landsat…</div>}
    {error && <div className="map-status error" role="status">{error}</div>}
    <div className="map-legend"><span><i className="legend-dot training"/>Entrenamiento</span><span><i className="legend-dot prediction"/>Predicción</span>{props.mode === 'ndvi' && <div className="ndvi-map-legend"><div className="ndvi-gradient"/><small>−1 <span>NDVI</span> 1</small></div>}{props.mode === 'alphaearth' && <small>AlphaEarth · A00 / A01 / A02 · anual {props.year}</small>}{props.settings.precipitation && <small>Precipitación · 0–1488 mm/mes</small>}{props.settings.tmax && <small>Temperatura máxima · 4–42 °C</small>}{props.settings.tmin && <small>Temperatura mínima · 4–42 °C</small>}{props.settings.elevation && <small>Elevación · 8–5608 m s.n.m.</small>}{props.settings.slope && <small>Pendiente · 0–71°</small>}</div>
    <div className="map-coordinates">{position}<span>WGS 84</span></div>
  </div>;
});
