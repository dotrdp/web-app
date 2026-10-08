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
import { LocateFixed, Map as MapIcon, Maximize2, Minimize2, Minus, Moon, Plus, Satellite, Search } from 'lucide-react';
import type { Atlas, Geometry, ImageryManifest, LayerSettings, MapFilters, MapMode, Parcel, Raster } from './types';
import { fmt } from './lib';
import { coloredNdviUrl, ndviColor } from './ndvi';
import { LoadingState } from './AgentProgress';
import { CompactToolbar, ToolbarButton, ToolbarGroup, ToolbarItem, ToolbarSeparator } from './Toolbar';

proj4.defs('EPSG:6372', '+proj=lcc +lat_0=12 +lon_0=-102 +lat_1=17.5 +lat_2=29.5 +x_0=2500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('EPSG:32614', '+proj=utm +zone=14 +datum=WGS84 +units=m +no_defs');
register(proj4);
const format = new GeoJSON();
const MIN_ZOOM = 5, MAX_ZOOM = 19;

export interface MapHandle { fitAll: () => void; fitParcel: (parcel: Parcel) => void; fitGeometry: (geometry: object) => void; locate: (coords: number[]) => void; draw: () => void; edit: (parcel: Parcel) => void; proposal: (geometry: Geometry | null) => void; editDraft: (geometry: Geometry) => void; cancel: () => void; finish: () => void; undo: () => void; geometry: () => Geometry | null }
interface Props { atlas: Atlas; parcels: Parcel[]; selected: Parcel | null; mode: MapMode; year: number; keyDate: string; filters: MapFilters; settings: LayerSettings; manifest?: ImageryManifest | null; imageryVisible?: boolean; onReady?: () => void; onImageryBusy?: (busy: boolean) => void; onImageryFailure?: () => void; onMapClick?: (coords: number[]) => void; onCancel?: () => void; onBaseChange: (base: LayerSettings['base']) => void; onSelect: (id: string) => void; onDraft: (geometry: Geometry | null) => void }

export default forwardRef<MapHandle, Props>(function AtlasMap(props, ref) {
  const host = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const latest = useRef(props); latest.current = props;
  const runtime = useRef<{ map: Map; source: VectorSource; parcels: VectorLayer<VectorSource>; clusters: VectorLayer<Cluster>; images: ImageLayer<ImageStatic>[]; dark: TileLayer<XYZ>; imagery: TileLayer<XYZ>; tileSources: globalThis.Map<string, XYZ>; embeddingLayers: globalThis.Map<string, ImageLayer<ImageStatic>>; satellite: TileLayer<XYZ>; streets: TileLayer<OSM>; municipalities: VectorLayer<VectorSource>; states: VectorLayer<VectorSource>; draftSource: VectorSource; draftLayer: VectorLayer<VectorSource>; interaction: Draw | Modify | null; editingId: string | null } | null>(null);
  const [position, setPosition] = useState('19.754° N · 98.405° O');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rasterInfo, setRasterInfo] = useState({ valid: 0, displayed: 0 });
  const [embeddingCount, setEmbeddingCount] = useState(0);
  const [zoom, setZoom] = useState(11);
  const [viewZoom, setViewZoom] = useState(11);
  const [fullscreen, setFullscreen] = useState(false);
  const [viewportRevision, setViewportRevision] = useState(0);
  const initialFit = useRef(false);
  const tileFailures = useRef(new globalThis.Map<XYZ, Set<string>>());
  const pendingTiles = useRef(new globalThis.Map<XYZ, Set<string>>());

  useEffect(() => {
    const changed = () => setFullscreen(document.fullscreenElement === document.documentElement);
    document.addEventListener('fullscreenchange', changed);
    return () => document.removeEventListener('fullscreenchange', changed);
  }, []);

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
  function proposal(geometry: Geometry | null) {
    const r = runtime.current; if (!r) return;
    if (r.interaction) r.map.removeInteraction(r.interaction);
    r.interaction = null; r.draftSource.clear();
    if (geometry) r.draftSource.addFeature(new Feature(format.readGeometry(geometry, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' })));
  }
  function editDraft(geometry: Geometry) {
    proposal(geometry); const r = runtime.current; if (!r) return;
    const interaction = new Modify({ source: r.draftSource }); r.interaction = interaction; r.map.addInteraction(interaction);
    interaction.on('modifyend', () => latest.current.onDraft(currentGeometry()));
  }
  useImperativeHandle(ref, () => ({
    fitAll() { const r = runtime.current; const extent = r?.source.getExtent(); if (r && extent && !r.source.isEmpty()) r.map.getView().fit(extent, { padding: [85, 65, 70, 65], maxZoom: 13.5, duration: 550 }); },
    fitParcel,
    fitGeometry(geometry) { const r = runtime.current; if (r) r.map.getView().fit(format.readGeometry(geometry).transform('EPSG:4326','EPSG:3857').getExtent(), { padding: [160,70,120,70], duration: 500, maxZoom: 14 }); },
    proposal, editDraft,
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
    const dark = new TileLayer({ source: new XYZ({ url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', crossOrigin: 'anonymous', maxZoom: 16, attributions: '© Esri, HERE, Garmin, OpenStreetMap contributors' }), cacheSize: 256 });
    const imagery = new TileLayer<XYZ>({ visible: false, zIndex: 12, cacheSize: 256 });
    const satellite = new TileLayer({ source: new XYZ({ url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', crossOrigin: 'anonymous', maxZoom: 19, attributions: 'Imagery © Esri, Maxar, Earthstar Geographics' }) });
    const streets = new TileLayer({ visible: false, source: new OSM({ crossOrigin: 'anonymous' }) });
    const municipalities = new VectorLayer({ source: new VectorSource({ url: '/data/municipios.geojson', format }), minZoom: 9, style: new Style({ stroke: new Stroke({ color: 'rgba(255,255,255,.26)', width: 1, lineDash: [4, 6] }) }) });
    const states = new VectorLayer({ source: new VectorSource({ url: '/data/estados.geojson', format }), style: new Style({ stroke: new Stroke({ color: 'rgba(230,236,215,.63)', width: 1.5 }) }) });
    const parcels = new VectorLayer({ source, zIndex: 40, style(feature) {
      const p = latest.current;
      if (feature.get('id') === runtime.current?.editingId) return undefined;
      const selected = feature.get('id') === p.selected?.properties.id;
      let color = '#a4b0a7', fill = 'rgba(146,160,151,.16)';
      if (p.mode === 'parcels') { const value = feature.get('observedYield'); if (value != null) { const t = Math.min(1,Math.max(0,value/8)); const rgb = [Math.round(213-139*t),Math.round(171-34*t),Math.round(90+7*t)]; color = `rgb(${rgb.join(',')})`; fill = `rgba(${rgb.join(',')},.4)`; } }
      if (p.mode === 'landsat') { const v = p.atlas.landsat[p.keyDate]?.parcels[feature.get('id')]?.mean; if (v != null) { color = `rgb(${ndviColor(v).join(',')})`; fill = `rgba(${ndviColor(v).join(',')},.4)`; } }
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
      return new Style({ image: new Circle({ radius: n > 1 ? 15 + Math.min(5, Math.log(n)) : 6, fill: new Fill({ color: isSelected ? '#e1edb0' : predict ? '#596660' : '#376249' }), stroke: new Stroke({ color: isSelected ? '#244b38' : '#d2e1ca', width: 2 }) }), text: n > 1 ? new Text({ text: String(n), font: '600 11px Inter Variable, sans-serif', fill: new Fill({ color: isSelected ? '#244b38' : 'white' }) }) : undefined });
    } });
    const draftSource = new VectorSource();
    const draftLayer = new VectorLayer({ source: draftSource, zIndex: 100, style: new Style({ stroke: new Stroke({ color: '#f1df79', width: 3, lineDash: [6, 4] }), fill: new Fill({ color: 'rgba(242,226,126,.22)' }), image: new Circle({ radius: 6, fill: new Fill({ color: '#f1df79' }), stroke: new Stroke({ color: '#365840', width: 2 }) }) }) });
    const map = new Map({ target: host.current, layers: [dark, satellite, streets, imagery, municipalities, states, parcels, clusters, draftLayer], view: new View({ center: fromLonLat([-98.4, 19.755]), zoom: 10.85, minZoom: MIN_ZOOM, maxZoom: MAX_ZOOM }), controls: defaultControls({ zoom: false, rotate: false }).extend([new ScaleLine({ bar: false })]) });
    runtime.current = { map, source, parcels, clusters, dark, imagery, tileSources: new globalThis.Map(), embeddingLayers: new globalThis.Map(), satellite, streets, municipalities, states, draftSource, draftLayer, images: [], interaction: null, editingId: null };
    map.on('singleclick', event => {
      if (runtime.current?.interaction) return;
      if (latest.current.onMapClick) { latest.current.onMapClick(toLonLat(event.coordinate)); return; }
      const clicked = map.forEachFeatureAtPixel(event.pixel, (f, layer) => layer === parcels || layer === clusters ? f : undefined, { hitTolerance: 8 });
      if (!clicked) return;
      const members = clicked.get('features') as Feature[] | undefined;
      if (members && members.length > 1) { const extent = createEmpty(); for (const f of members) extend(extent, f.getGeometry()!.getExtent()); map.getView().fit(extent, { padding: [80, 70, 70, 70], maxZoom: 16, duration: 450 }); }
      else latest.current.onSelect(members ? members[0].get('id') : clicked.get('id'));
    });
    map.on('pointermove', event => { if (event.dragging) return; const c = toLonLat(event.coordinate); setPosition(`${fmt(Math.abs(c[1]), 4)}° ${c[1] < 0 ? 'S' : 'N'} · ${fmt(Math.abs(c[0]), 4)}° ${c[0] < 0 ? 'O' : 'E'}`); host.current!.style.cursor = runtime.current?.interaction ? 'crosshair' : map.hasFeatureAtPixel(event.pixel, { layerFilter: l => l === parcels || l === clusters }) ? 'pointer' : 'grab'; });
    map.on('moveend', () => { setZoom(map.getView().getZoom() || 11); setViewportRevision(v => v + 1); });
    // Track the real view for wheel/pinch, fit and search as well as the slider.
    // Keep the expensive parcel overlays on moveend rather than every drag frame.
    const syncZoom = () => setViewZoom(map.getView().getZoom() ?? 11);
    map.getView().on('change:resolution', syncZoom); syncZoom();
    const resize = new ResizeObserver(() => map.updateSize()); resize.observe(host.current);
    return () => { resize.disconnect(); map.getView().un('change:resolution', syncZoom); for (const source of runtime.current?.tileSources.values() || []) source.dispose(); tileFailures.current.clear(); pendingTiles.current.clear(); map.dispose(); runtime.current = null; initialFit.current = false; };
  }, []);

  useEffect(() => { const r = runtime.current; if (!r) return; r.source.clear(); r.source.addFeatures(format.readFeatures({ type: 'FeatureCollection', features: props.parcels }, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' })); const extent = r.source.getExtent(); if (!initialFit.current && extent) { initialFit.current = true; r.map.getView().fit(extent, { padding: [70, 60, 90, 60], maxZoom: 12.5, duration: 0 }); } }, [props.parcels]);
  useEffect(() => {
    const r = runtime.current; if (!r) return;
    const ready = () => latest.current.onReady?.();
    r.map.once('postrender', ready); r.map.render();
    return () => r.map.un('postrender', ready);
  }, [props.atlas]);
  useEffect(() => { const r = runtime.current; r?.parcels.changed(); r?.clusters.changed(); }, [props.selected, props.mode, props.year, props.keyDate]);

  useEffect(() => {
    const r = runtime.current; if (!r) return;
    r.dark.setVisible(props.settings.base === 'dark');
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
    if (props.mode === 'landsat') {
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
    return () => { cancelled = true; };
  }, [props.mode, props.keyDate, props.year, props.settings.precipitation, props.settings.tmin, props.settings.tmax, props.settings.elevation, props.settings.slope, props.settings.base, props.settings.municipalities, props.settings.states, props.settings.opacity, props.atlas, props.filters.ndviEnabled, props.filters.ndviThreshold]);

  // Raster sources survive parcel selection and map movement. Only product,
  // month or scientific threshold changes replace a tiled source; four sources
  // and 256 rendered tiles bound browser memory during temporal playback.
  useEffect(() => {
    const r = runtime.current; if (!r) return;
    const product = props.imageryVisible ? 'rgb' : props.mode === 'water' ? 'mndwi' : props.mode === 'ndvi' ? 'ndvi' : null;
    r.imagery.setVisible(!!product && !!props.manifest);
    if (!product || !props.manifest) { if (!product) latest.current.onImageryBusy?.(false); return; }
    const threshold = product === 'mndwi' ? props.settings.waterThreshold ?? 0 : props.filters.ndviEnabled ? props.filters.ndviThreshold : -1;
    const url = props.manifest.tileTemplate.replace('{product}', product) + `?threshold=${threshold}`;
    let source = r.tileSources.get(url);
    if (!source) {
      source = new XYZ({ url, crossOrigin: 'anonymous', minZoom: 6, maxZoom: 16, transition: 150, attributions: 'Sentinel-2 L2A © Copernicus / Microsoft Planetary Computer' });
      const created = source, failures = new Set<string>(), pending = new Set<string>(); tileFailures.current.set(created, failures); pendingTiles.current.set(created, pending);
      const active = () => r.imagery.getVisible() && r.imagery.getSource() === created;
      source.on('tileloadstart', event => { pending.add(event.tile.getKey()); if (active()) latest.current.onImageryBusy?.(true); });
      source.on('tileloaderror', event => { pending.delete(event.tile.getKey()); failures.add(event.tile.getKey()); if (failures.size > 512) failures.delete(failures.values().next().value!); if (active()) { latest.current.onImageryBusy?.(pending.size > 0); latest.current.onImageryFailure?.(); setError('Servicio de imágenes no disponible. Puedes seguir usando el atlas.'); } });
      source.on('tileloadend', event => { pending.delete(event.tile.getKey()); failures.delete(event.tile.getKey()); if (active()) { latest.current.onImageryBusy?.(pending.size > 0); if (!failures.size) setError(''); } });
      r.tileSources.set(url, source);
      if (r.tileSources.size > 4) { const oldest = r.tileSources.keys().next().value!, evicted = r.tileSources.get(oldest)!; tileFailures.current.delete(evicted); pendingTiles.current.delete(evicted); evicted.dispose(); r.tileSources.delete(oldest); }
    }
    r.imagery.setSource(source); r.imagery.setOpacity(product === 'mndwi' ? props.settings.waterOpacity ?? .75 : props.imageryVisible ? 1 : props.settings.opacity);
    setError(tileFailures.current.get(source)?.size ? 'Servicio de imágenes no disponible. Puedes seguir usando el atlas.' : '');
    latest.current.onImageryBusy?.(!!pendingTiles.current.get(source)?.size);
  }, [props.manifest, props.mode, props.imageryVisible, props.filters.ndviEnabled, props.filters.ndviThreshold, props.settings.waterThreshold, props.settings.waterOpacity, props.settings.opacity]);

  useEffect(() => {
    const r = runtime.current; if (!r) return;
    const wanted = new Set<string>();
    if (props.mode === 'alphaearth') {
      const extent = r.map.getView().calculateExtent(r.map.getSize());
      let count = 0;
      for (const parcel of props.parcels) {
        const raster = props.atlas.details[parcel.properties.id]?.embedding[String(props.year)];
        if (raster && (zoom >= 13 || parcel.properties.id === props.selected?.properties.id) && intersects(extent, transformExtent(parcel.properties.bounds, 'EPSG:4326', 'EPSG:3857'))) {
          wanted.add(raster.url); count++;
          if (!r.embeddingLayers.has(raster.url)) { const layer = new ImageLayer({ zIndex: 15, opacity: props.settings.opacity, source: new ImageStatic({ url: raster.url, imageExtent: raster.extent, projection: raster.projection }) }); r.embeddingLayers.set(raster.url, layer); r.map.addLayer(layer); }
        }
      }
      setEmbeddingCount(count);
    }
    for (const [url, layer] of r.embeddingLayers) if (!wanted.has(url)) { r.map.removeLayer(layer); r.embeddingLayers.delete(url); }
  }, [props.mode, props.year, props.atlas, props.parcels, props.selected, zoom, viewportRevision, props.settings.opacity]);

  const zoomBy = (delta: number) => {
    const view = runtime.current?.map.getView();
    if (!view) return;
    const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, (view.getZoom() ?? MIN_ZOOM) + delta));
    view.cancelAnimations();
    view.animate({ zoom: next, duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200 });
  };
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { setError('No pudimos abrir la pantalla completa en este navegador.'); }
  }
  return <div className="map-canvas-wrap" ref={wrapper} data-testid="map" data-mode={props.mode} data-base={props.settings.base} data-zoom={viewZoom.toFixed(2)} data-parcel-count={props.parcels.length} data-period={props.keyDate} data-valid-pixels={rasterInfo.valid} data-displayed-pixels={rasterInfo.displayed} data-embedding-count={embeddingCount}>
    <div ref={host} className="map-canvas" tabIndex={0} role="application" aria-label="Mapa interactivo de parcelas de Hidalgo, Puebla y Tlaxcala" onKeyDown={e => { if (e.key === 'Escape') { cancel(); latest.current.onCancel?.(); } }}/>
    <CompactToolbar className="map-navigation-toolbar" aria-label="Navegación del mapa" orientation="vertical" compactIcon={<Search/>} compactLabel={`Zoom ${viewZoom.toFixed(1)}`}>
      <ToolbarGroup aria-label="Zoom del mapa">
        <ToolbarButton label="Acercar mapa" isDisabled={viewZoom >= MAX_ZOOM} onClick={() => zoomBy(1)}><Plus/></ToolbarButton>
        <ToolbarButton label="Alejar mapa" isDisabled={viewZoom <= MIN_ZOOM} onClick={() => zoomBy(-1)}><Minus/></ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator/>
      <ToolbarGroup aria-label="Vista del mapa">
        <ToolbarButton label="Ver todas las parcelas" isDisabled={!props.parcels.length} onClick={() => { const r = runtime.current; const extent = r?.source.getExtent(); if (r && extent && !r.source.isEmpty()) r.map.getView().fit(extent, { padding: [80, 70, 70, 70], maxZoom: 13.5, duration: 450 }); }}><LocateFixed/></ToolbarButton>
        <ToolbarItem label={fullscreen ? 'Salir de pantalla completa' : 'Mapa en pantalla completa'} isSelected={fullscreen} isDisabled={document.fullscreenEnabled === false} onChange={() => void toggleFullscreen()}>{fullscreen ? <Minimize2/> : <Maximize2/>}</ToolbarItem>
      </ToolbarGroup>
    </CompactToolbar>
    <CompactToolbar className="map-basemap-toolbar" aria-label="Mapa base" compactIcon={<MapIcon/>} compactLabel={props.settings.base === 'dark' ? 'Mapa oscuro' : props.settings.base === 'satellite' ? 'Satélite' : 'Calles'}>
      <ToolbarGroup aria-label="Cartografía base">{([{ key: 'dark', label: 'Mapa oscuro', icon: Moon }, { key: 'satellite', label: 'Satélite', icon: Satellite }, { key: 'streets', label: 'Calles', icon: MapIcon }] as const).map(base =>
        <ToolbarItem key={base.key} label={base.label} isSelected={props.settings.base === base.key} onChange={() => props.onBaseChange(base.key)}><base.icon/></ToolbarItem>
      )}</ToolbarGroup>
    </CompactToolbar>
    {loading && <div className="map-status"><LoadingState label="Cargando Landsat…"/></div>}
    {error && <div className="map-status error" role="status">{error}{['ndvi','water'].includes(props.mode) || props.imageryVisible ? <button onClick={() => { const source = runtime.current?.imagery.getSource(); if (source) { tileFailures.current.get(source)?.clear(); source.refresh(); } setError(''); }}>Reintentar imágenes</button> : null}</div>}
    <div className="map-legend">{props.mode === 'parcels' && <><b>Rendimiento registrado · 2025</b><div className="yield-gradient"/><small>0 <span>t/ha</span> 8</small><span><i className="legend-dot neutral"/>Sin valor registrado</span></>}{['ndvi','landsat'].includes(props.mode) && <div className="ndvi-map-legend"><b>{props.mode === 'ndvi' ? 'Sentinel-2 · 10 m' : 'Landsat C2 · 30 m'}</b><div className="ndvi-gradient"/><small>−1 <span>NDVI</span> 1</small></div>}{props.mode === 'water' && <><span><i className="legend-dot water"/>Candidatos de agua</span><small>MNDWI ≥ {props.settings.waterThreshold ?? 0} · 20 m</small></>}{props.mode === 'alphaearth' && <small>AlphaEarth · A00 / A01 / A02 · anual {props.year}</small>}{props.settings.precipitation && <small>Precipitación · 0–1488 mm/mes</small>}{props.settings.tmax && <small>Temperatura máxima · 4–42 °C</small>}{props.settings.tmin && <small>Temperatura mínima · 4–42 °C</small>}{props.settings.elevation && <small>Elevación · 8–5608 m s.n.m.</small>}{props.settings.slope && <small>Pendiente · 0–71°</small>}</div>
    <div className="map-coordinates">{position}<span>WGS 84</span></div>
  </div>;
});
