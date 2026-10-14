import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import ImageLayer from 'ol/layer/Image';
import type BaseLayer from 'ol/layer/Base';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import Cluster from 'ol/source/Cluster';
import ImageStatic from 'ol/source/ImageStatic';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style, Circle, Text } from 'ol/style';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import Feature from 'ol/Feature';
import type { FeatureLike } from 'ol/Feature';
import { fromLonLat, toLonLat, transformExtent } from 'ol/proj';
import { extend, createEmpty, intersects } from 'ol/extent';
import { Attribution, defaults as defaultControls, ScaleLine } from 'ol/control';
import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { MapboxVectorLayer } from 'ol-mapbox-style';
import Overlay from 'ol/Overlay';
import LineString from 'ol/geom/LineString';
import { getArea, getLength } from 'ol/sphere';
import { Home, LocateFixed, Maximize, Minimize, Minus, Plus } from 'lucide-react';
import type { Atlas, Geometry, ImageryManifest, LayerSettings, MapFilters, MapMode, Parcel, Raster } from './types';
import { fmt } from './lib';
import { coloredNdviUrl, ndviColor } from './ndvi';
import { LoadingState } from './AgentProgress';
import { Toolbar } from 'react-aria-components/Toolbar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { floating, ToolButton } from './MapToolbar';
import './map.css';

proj4.defs('EPSG:6372', '+proj=lcc +lat_0=12 +lon_0=-102 +lat_1=17.5 +lat_2=29.5 +x_0=2500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
proj4.defs('EPSG:32614', '+proj=utm +zone=14 +datum=WGS84 +units=m +no_defs');
register(proj4);
const format = new GeoJSON();
const MIN_ZOOM = 5, MAX_ZOOM = 19;
/** --brand (oklch 0.47 0.1 155) for canvas styles. */
const BRAND = '#1f6b41';
/** Below this zoom parcels read as cluster bubbles; above it as field outlines. */
const DETAIL_ZOOM = 12.6;

type Base = LayerSettings['base'];
const VECTOR_STYLES: Partial<Record<Base, string>> = { light: 'https://tiles.openfreemap.org/styles/positron', dark: 'https://tiles.openfreemap.org/styles/dark' };
const OPENFREEMAP = '<a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/" target="_blank" rel="noreferrer">OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>';

const ESRI_TOPO = 'Esri, TomTom, Garmin, FAO, NOAA, USGS, © OpenStreetMap contributors and the GIS User Community';
const YIELD_RAMP: [number, number[]][] = [[0, [232, 178, 72]], [.5, [158, 206, 92]], [1, [47, 125, 50]]];
function ramp(t: number) {
  const x = Math.min(1, Math.max(0, t));
  for (let i = 1; i < YIELD_RAMP.length; i++) {
    const [t0, a] = YIELD_RAMP[i - 1], [t1, b] = YIELD_RAMP[i];
    if (x <= t1) { const k = (x - t0) / (t1 - t0); return a.map((v, j) => Math.round(v + (b[j] - v) * k)); }
  }
  return YIELD_RAMP.at(-1)![1];
}

export type MeasureKind = 'distance' | 'area';
export interface MapHandle { fitBounds: (bounds: number[]) => void; measure: (kind: MeasureKind | null) => void; showLocation: (coords: number[]) => void; exportPng: () => Promise<Blob | null>; fitAll: () => void; fitParcel: (parcel: Parcel) => void; fitGeometry: (geometry: object) => void; locate: (coords: number[]) => void; draw: () => void; edit: (parcel: Parcel) => void; proposal: (geometry: Geometry | null) => void; editDraft: (geometry: Geometry) => void; cancel: () => void; finish: () => void; undo: () => void; geometry: () => Geometry | null }
interface Props {
  atlas: Atlas; parcels: Parcel[]; selected: Parcel | null; mode: MapMode; year: number; keyDate: string; filters: MapFilters; settings: LayerSettings; manifest?: ImageryManifest | null; imageryVisible?: boolean;
  onReady?: () => void; onImageryBusy?: (busy: boolean) => void; onImageryFailure?: () => void; onMapClick?: (coords: number[]) => void; onCancel?: () => void;
  onMeasure?: (value: string | null) => void; onLocate?: () => void; locating?: boolean; onSelect: (id: string) => void; onDraft: (geometry: Geometry | null) => void;
}
type Runtime = { map: Map; source: VectorSource; parcels: VectorLayer<VectorSource>; clusters: VectorLayer<Cluster>; images: ImageLayer<ImageStatic>[]; bases: Partial<Record<Base, BaseLayer>>; imagery: TileLayer<XYZ>; tileSources: globalThis.Map<string, XYZ>; embeddingLayers: globalThis.Map<string, ImageLayer<ImageStatic>>; municipalities: VectorLayer<VectorSource>; states: VectorLayer<VectorSource>; draftSource: VectorSource; draftLayer: VectorLayer<VectorSource>; measureSource: VectorSource; locationSource: VectorSource; measureTip: Overlay; measure: Draw | null; measureEndedAt?: number; interaction: Draw | Modify | null; editingId: string | null };

function createBase(kind: Base): BaseLayer {
  if (kind === 'topo') return new TileLayer({ zIndex: 0, preload: 1, source: new XYZ({ url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', crossOrigin: 'anonymous', maxZoom: 19, attributions: ESRI_TOPO }) });
  if (kind === 'satellite') return new TileLayer({ zIndex: 0, source: new XYZ({ url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', crossOrigin: 'anonymous', maxZoom: 19, attributions: 'Imagery © Esri, Maxar, Earthstar Geographics' }) });
  const layer = new MapboxVectorLayer({ styleUrl: VECTOR_STYLES[kind]!, source: 'openmaptiles', declutter: true, zIndex: 0, preload: 1 });
  layer.getSource()?.setAttributions(OPENFREEMAP);
  return layer;
}

export default forwardRef<MapHandle, Props>(function AtlasMap(props, ref) {
  const host = useRef<HTMLDivElement>(null);
  const coordinates = useRef<HTMLSpanElement>(null);
  const scale = useRef<HTMLDivElement>(null);
  const attribution = useRef<HTMLDivElement>(null);
  const latest = useRef(props); latest.current = props;
  const runtime = useRef<Runtime | null>(null);
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
  const styleCache = useRef(new globalThis.Map<string, Style | Style[]>());

  useEffect(() => {
    const changed = () => setFullscreen(document.fullscreenElement === document.documentElement);
    document.addEventListener('fullscreenchange', changed);
    return () => document.removeEventListener('fullscreenchange', changed);
  }, []);

  function fitParcel(parcel: Parcel) {
    const r = runtime.current; if (!r) return;
    r.map.getView().fit(transformExtent(parcel.properties.bounds, 'EPSG:4326', 'EPSG:3857'), { padding: [80, 80, 120, 80], maxZoom: 16, duration: 600 });
  }
  function fitAll(duration = 450) {
    const r = runtime.current; const extent = r?.source.getExtent();
    if (r && extent && !r.source.isEmpty()) r.map.getView().fit(extent, { padding: [80, 72, 150, 72], maxZoom: 12.4, duration });
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
  function stopMeasure() {
    const r = runtime.current; if (!r) return;
    if (r.measure) { r.map.removeInteraction(r.measure); r.measureEndedAt = performance.now(); }
    r.measure = null; r.measureSource.clear(); r.measureTip.setPosition(undefined); latest.current.onMeasure?.(null);
  }
  function measure(kind: MeasureKind | null) {
    stopMeasure(); const r = runtime.current; if (!r || !kind) return;
    const draw = new Draw({ source: r.measureSource, type: kind === 'area' ? 'Polygon' : 'LineString', style: measureStyles(true) });
    const label = (geometry: LineString | Polygon) => {
      if (geometry instanceof Polygon) { const ha = getArea(geometry) / 10000; return ha >= 100 ? `${fmt(ha / 100, 2)} km²` : `${fmt(ha, 2)} ha`; }
      const m = getLength(geometry); return m >= 1000 ? `${fmt(m / 1000, 2)} km` : `${fmt(m, 0)} m`;
    };
    draw.on('drawstart', event => {
      r.measureSource.clear();
      const geometry = event.feature.getGeometry() as LineString | Polygon;
      geometry.on('change', () => { const text = label(geometry); r.measureTip.getElement()!.textContent = text; r.measureTip.setPosition(geometry instanceof Polygon ? geometry.getInteriorPoint().getCoordinates() : geometry.getLastCoordinate()); latest.current.onMeasure?.(text); });
    });
    r.measure = draw; r.map.addInteraction(draw);
  }
  useImperativeHandle(ref, () => ({
    fitBounds(bounds) { runtime.current?.map.getView().fit(transformExtent(bounds, 'EPSG:4326', 'EPSG:3857'), { padding: [80, 80, 80, 80], maxZoom: 13, duration: 600 }); },
    measure,
    showLocation(coords) {
      const r = runtime.current; if (!r) return;
      r.locationSource.clear(); r.locationSource.addFeature(new Feature(new Point(fromLonLat(coords))));
      r.map.getView().animate({ center: fromLonLat(coords), zoom: 14, duration: 600 });
    },
    async exportPng() {
      const r = runtime.current; if (!r) return null;
      const size = r.map.getSize()!; const out = document.createElement('canvas'); out.width = size[0]; out.height = size[1];
      const ctx = out.getContext('2d')!;
      try {
        for (const canvas of r.map.getViewport().querySelectorAll<HTMLCanvasElement>('.ol-layer canvas, canvas.ol-layer')) {
          if (!canvas.width) continue;
          const opacity = (canvas.parentNode as HTMLElement).style.opacity || canvas.style.opacity;
          ctx.globalAlpha = opacity === '' ? 1 : Number(opacity);
          const matrix = canvas.style.transform.match(/^matrix\(([^(]*)\)$/)?.[1].split(',').map(Number) ?? [1, 0, 0, 1, 0, 0];
          ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
          ctx.drawImage(canvas, 0, 0);
        }
        return await new Promise<Blob | null>(resolve => out.toBlob(resolve, 'image/png'));
      } catch { return null; }
    },
    fitAll: () => fitAll(550),
    fitParcel,
    fitGeometry(geometry) { const r = runtime.current; if (r) r.map.getView().fit(format.readGeometry(geometry).transform('EPSG:4326', 'EPSG:3857').getExtent(), { padding: [140, 80, 120, 80], duration: 500, maxZoom: 14 }); },
    proposal, editDraft,
    locate(coords) { runtime.current?.map.getView().animate({ center: fromLonLat(coords), zoom: 16, duration: 600 }); },
    draw() {
      cancel(); const r = runtime.current; if (!r) return;
      const interaction = new Draw({ source: r.draftSource, type: 'Polygon', style: draftStyles(true) });
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

  /** Data colour of a parcel in the active mode, or null when it has no value. */
  function parcelColor(feature: FeatureLike): number[] | null {
    const p = latest.current, id = feature.get('id');
    if (p.mode === 'parcels') { const value = feature.get('observedYield'); return value == null ? null : ramp(value / 8); }
    if (p.mode === 'landsat') { const v = p.atlas.landsat[p.keyDate]?.parcels[id]?.mean; return v == null ? null : ndviColor(v); }
    if (p.mode === 'alphaearth') { const e = p.atlas.details[id]?.embedding[String(p.year)]?.values; return e ? e.slice(0, 3).map(n => Math.round(Math.min(255, Math.max(0, (n + .25) * 510)))) : null; }
    return null;
  }
  function onGreenRaster() { const p = latest.current; return ['ndvi', 'landsat', 'alphaearth'].includes(p.mode) || p.settings.base === 'satellite' || !!p.imageryVisible; }
  function onDarkBase() { const base = latest.current.settings.base; return base === 'dark' || base === 'satellite'; }

  useEffect(() => {
    if (!host.current) return;
    const cache = styleCache.current;
    const cached = (key: string, make: () => Style | Style[]) => { let s = cache.get(key); if (!s) { s = make(); cache.set(key, s); } return s; };
    const source = new VectorSource();
    const imagery = new TileLayer<XYZ>({ visible: false, zIndex: 12, cacheSize: 256 });
    const municipalities = new VectorLayer({ source: new VectorSource({ url: '/data/municipios.geojson', format }), minZoom: 8.5, zIndex: 20 });
    const states = new VectorLayer({ source: new VectorSource({ url: '/data/estados.geojson', format }), zIndex: 21 });
    const parcels = new VectorLayer({ source, zIndex: 40, minZoom: DETAIL_ZOOM - .01, style(feature, resolution) {
      const p = latest.current;
      if (feature.get('id') === runtime.current?.editingId) return undefined;
      const selected = feature.get('id') === p.selected?.properties.id;
      const rgb = parcelColor(feature), dark = onDarkBase();
      const tone = rgb ? rgb.join(',') : dark ? '235,238,233' : '75,82,77';
      const styles = cached(`poly:${tone}:${selected}:${dark}`, () => selected
        // The selected field is an outline only, so the imagery underneath stays readable.
        ? [new Style({ stroke: new Stroke({ color: 'rgba(31,37,33,.85)', width: 4.5 }) }), new Style({ stroke: new Stroke({ color: '#ffffff', width: 2.5 }), fill: new Fill({ color: 'rgba(0,0,0,0)' }) })]
        : [new Style({ stroke: new Stroke({ color: `rgba(${tone},${rgb ? .95 : .7})`, width: 1.5 }), fill: new Fill({ color: `rgba(${tone},${rgb ? .32 : .12})` }) })]) as Style[];
      if (resolution < 9) {
        const label = feature.get('name') || feature.get('id');
        return [...styles, cached(`label:${label}:${dark}`, () => new Style({ text: new Text({ text: label, font: '600 12px Geist, system-ui, sans-serif', fill: new Fill({ color: dark ? '#ffffff' : '#171717' }), stroke: new Stroke({ color: dark ? 'rgba(23,23,23,.9)' : 'rgba(255,255,255,.95)', width: 3 }), overflow: true }) })) as Style];
      }
      return styles;
    } });
    const clustered = new Cluster({ source, distance: 34, minDistance: 18, geometryFunction: f => new Point(fromLonLat(f.get('centroid') as number[])) });
    const clusters = new VectorLayer({ source: clustered, zIndex: 50, maxZoom: DETAIL_ZOOM, style(f) {
      const members = f.get('features') as Feature[];
      const n = members.length, selectedId = latest.current.selected?.properties.id;
      const isSelected = members.some(x => x.get('id') === selectedId), dark = onDarkBase();
      // One brand-green marker system on every basemap and layer: data colour appears
      // on the field outlines once the map is close enough to read them.
      // Over green rasters (vegetation, imagery) the brand fill disappears; switch to ink.
      const fill = onGreenRaster() ? '#171717' : BRAND;
      if (n === 1) return cached(`dot:${isSelected}:${fill}`, () => [
        ...(isSelected ? [new Style({ image: new Circle({ radius: 11, fill: new Fill({ color: 'rgba(31,107,65,.2)' }), stroke: new Stroke({ color: BRAND, width: 2 }) }) })] : []),
        new Style({ image: new Circle({ radius: 5, fill: new Fill({ color: fill }), stroke: new Stroke({ color: '#ffffff', width: 2 }) }) }),
      ]);
      const radius = n < 10 ? 12 : n < 50 ? 14.5 : 17;
      return cached(`cluster:${n}:${isSelected}:${fill}`, () => [
        new Style({ image: new Circle({ radius: radius + 4, fill: new Fill({ color: fill === BRAND ? 'rgba(31,107,65,.18)' : 'rgba(255,255,255,.35)' }) }) }),
        new Style({ image: new Circle({ radius, fill: new Fill({ color: fill }), stroke: new Stroke({ color: isSelected ? (fill === BRAND ? '#171717' : BRAND) : '#ffffff', width: isSelected ? 2.5 : 2 }) }), text: new Text({ text: String(n), font: '600 11.5px Geist, system-ui, sans-serif', fill: new Fill({ color: '#ffffff' }) }) }),
      ]);
    } });
    const measureSource = new VectorSource(), locationSource = new VectorSource();
    const measureLayer = new VectorLayer({ source: measureSource, zIndex: 110, style: measureStyles(false) });
    const locationLayer = new VectorLayer({ source: locationSource, zIndex: 120, style: [new Style({ image: new Circle({ radius: 16, fill: new Fill({ color: 'rgba(37,99,235,.16)' }) }) }), new Style({ image: new Circle({ radius: 7, fill: new Fill({ color: '#2563eb' }), stroke: new Stroke({ color: '#fff', width: 2.5 }) }) })] });
    const tip = document.createElement('div'); tip.className = 'measure-tip';
    const measureTip = new Overlay({ element: tip, offset: [0, -14], positioning: 'bottom-center', stopEvent: false });
    const draftSource = new VectorSource();
    const draftLayer = new VectorLayer({ source: draftSource, zIndex: 100, style: draftStyles(false) });
    const initialBase = latest.current.settings.base;
    const bases: Runtime['bases'] = { [initialBase]: createBase(initialBase) };
    const map = new Map({ target: host.current, layers: [bases[initialBase]!, imagery, municipalities, states, parcels, clusters, draftLayer, measureLayer, locationLayer], overlays: [measureTip], view: new View({ center: fromLonLat([-98.4, 19.755]), zoom: 10.85, minZoom: MIN_ZOOM, maxZoom: MAX_ZOOM }), controls: defaultControls({ zoom: false, rotate: false, attribution: false }).extend([new Attribution({ collapsible: false, target: attribution.current ?? undefined }), new ScaleLine({ bar: false, minWidth: 56, maxWidth: 84, target: scale.current ?? undefined })]) });
    runtime.current = { map, source, parcels, clusters, bases, imagery, tileSources: new globalThis.Map(), embeddingLayers: new globalThis.Map(), municipalities, states, draftSource, draftLayer, measureSource, locationSource, measureTip, measure: null, images: [], interaction: null, editingId: null };
    map.on('singleclick', event => {
      // OpenLayers reports a single click 250 ms late; ignore one that began while measuring.
      if (runtime.current?.interaction || runtime.current?.measure || event.originalEvent.timeStamp < (runtime.current?.measureEndedAt ?? 0)) return;
      if (latest.current.onMapClick) { latest.current.onMapClick(toLonLat(event.coordinate)); return; }
      const clicked = map.forEachFeatureAtPixel(event.pixel, (f, layer) => layer === parcels || layer === clusters ? f : undefined, { hitTolerance: 8 });
      if (!clicked) return;
      const members = clicked.get('features') as Feature[] | undefined;
      if (members && members.length > 1) { const extent = createEmpty(); for (const f of members) extend(extent, f.getGeometry()!.getExtent()); map.getView().fit(extent, { padding: [96, 96, 96, 96], maxZoom: 16, duration: 450 }); }
      else latest.current.onSelect(members ? members[0].get('id') : clicked.get('id'));
    });
    // The readout updates its own text node: no React render per pointer move.
    map.on('pointermove', event => {
      if (event.dragging) return;
      const c = toLonLat(event.coordinate);
      if (coordinates.current) coordinates.current.textContent = `${fmt(Math.abs(c[1]), 4)}° ${c[1] < 0 ? 'S' : 'N'}  ${fmt(Math.abs(c[0]), 4)}° ${c[0] < 0 ? 'O' : 'E'}`;
      host.current!.style.cursor = runtime.current?.interaction ? 'crosshair' : map.hasFeatureAtPixel(event.pixel, { layerFilter: l => l === parcels || l === clusters }) ? 'pointer' : '';
    });
    map.on('moveend', () => { setZoom(map.getView().getZoom() || 11); setViewportRevision(v => v + 1); });
    const syncZoom = () => setViewZoom(map.getView().getZoom() ?? 11);
    map.getView().on('change:resolution', syncZoom); syncZoom();
    const resize = new ResizeObserver(() => map.updateSize()); resize.observe(host.current);
    return () => { resize.disconnect(); map.getView().un('change:resolution', syncZoom); for (const s of runtime.current?.tileSources.values() || []) s.dispose(); tileFailures.current.clear(); pendingTiles.current.clear(); cache.clear(); map.dispose(); runtime.current = null; initialFit.current = false; };
  }, []);

  useEffect(() => { const r = runtime.current; if (!r) return; r.source.clear(); r.source.addFeatures(format.readFeatures({ type: 'FeatureCollection', features: props.parcels }, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' })); if (!initialFit.current && !r.source.isEmpty()) { initialFit.current = true; fitAll(0); } }, [props.parcels]);
  useEffect(() => {
    const r = runtime.current; if (!r) return;
    const ready = () => latest.current.onReady?.();
    r.map.once('postrender', ready); r.map.render();
    return () => r.map.un('postrender', ready);
  }, [props.atlas]);
  useEffect(() => { const r = runtime.current; r?.parcels.changed(); r?.clusters.changed(); }, [props.selected, props.mode, props.year, props.keyDate, props.settings.base, props.imageryVisible]);

  // Basemaps are created on first use and kept, so switching back is instant.
  useEffect(() => {
    const r = runtime.current; if (!r) return;
    const base = props.settings.base;
    if (!r.bases[base]) { r.bases[base] = createBase(base); r.map.getLayers().insertAt(0, r.bases[base]!); }
    for (const [key, layer] of Object.entries(r.bases)) layer!.setVisible(key === base);
    const dark = base === 'dark' || base === 'satellite';
    r.states.setStyle(new Style({ stroke: new Stroke({ color: base === 'satellite' ? 'rgba(255,255,255,.8)' : dark ? 'rgba(241,245,239,.5)' : 'rgba(13,18,15,.42)', width: 1.25 }) }));
    r.municipalities.setStyle(new Style({ stroke: new Stroke({ color: dark ? 'rgba(255,255,255,.28)' : 'rgba(13,18,15,.18)', width: 1, lineDash: [3, 4] }) }));
  }, [props.settings.base]);

  useEffect(() => {
    const r = runtime.current; if (!r) return;
    r.municipalities.setVisible(props.settings.municipalities); r.states.setVisible(props.settings.states);
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
  }, [props.mode, props.keyDate, props.year, props.settings.precipitation, props.settings.tmin, props.settings.tmax, props.settings.elevation, props.settings.slope, props.settings.municipalities, props.settings.states, props.settings.opacity, props.atlas, props.filters.ndviEnabled, props.filters.ndviThreshold]);

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
  return <div className="map-canvas-wrap absolute inset-0" data-testid="map" data-mode={props.mode} data-base={props.settings.base} data-zoom={viewZoom.toFixed(2)} data-parcel-count={props.parcels.length} data-period={props.keyDate} data-valid-pixels={rasterInfo.valid} data-displayed-pixels={rasterInfo.displayed} data-embedding-count={embeddingCount} data-detail={viewZoom >= DETAIL_ZOOM || undefined}>
    <Toolbar aria-label="Navegación del mapa" orientation="vertical" className={cn(floating, 'map-zoom-controls absolute right-3 bottom-9 z-10 flex flex-col p-1 max-md:bottom-[4.25rem]')}>
      <ToolButton label="Ver todas las parcelas" side="left" onClick={() => fitAll()}><Home/></ToolButton>
      <Separator className="my-0.5"/>
      <ToolButton label="Acercar mapa" side="left" disabled={viewZoom >= MAX_ZOOM} onClick={() => zoomBy(1)}><Plus/></ToolButton>
      <ToolButton label="Alejar mapa" side="left" disabled={viewZoom <= MIN_ZOOM} onClick={() => zoomBy(-1)}><Minus/></ToolButton>
      <Separator className="my-0.5"/>
      {props.onLocate && <ToolButton label="Mi ubicación" side="left" busy={props.locating} onClick={props.onLocate}><LocateFixed/></ToolButton>}
      <ToolButton label={fullscreen ? 'Salir de pantalla completa' : 'Mapa en pantalla completa'} side="left" pressed={fullscreen} disabled={document.fullscreenEnabled === false} onClick={() => void toggleFullscreen()}>{fullscreen ? <Minimize/> : <Maximize/>}</ToolButton>
    </Toolbar>

    {(loading || error) && <div role="status" className={cn(floating, 'map-status absolute top-3 left-1/2 z-20 flex max-w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 items-center gap-3 px-3 py-2 text-sm', error && 'border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200')}>{loading && !error ? <LoadingState label="Cargando Landsat…"/> : <><span>{error}</span>{['ndvi', 'water'].includes(props.mode) || props.imageryVisible ? <Button size="sm" variant="outline" onClick={() => { const source = runtime.current?.imagery.getSource(); if (source) { tileFailures.current.get(source)?.clear(); source.refresh(); } setError(''); }}>Reintentar imágenes</Button> : null}</>}</div>}

    <div className="map-statusbar absolute inset-x-0 bottom-0 z-[9] flex h-6 items-center justify-between gap-4 border-t bg-background/85 px-3 text-[11px] text-muted-foreground backdrop-blur max-md:hidden">
      <div className="map-attribution min-w-0 truncate" ref={attribution}/>
      <div className="flex shrink-0 items-center gap-3 font-mono text-[10.5px] whitespace-pre"><span ref={coordinates}>19.7540° N  98.4050° O</span><span>z {viewZoom.toFixed(1)}</span><div className="map-scale" ref={scale}/></div>
    </div>

    {/* The canvas follows the controls in the DOM so Tab reaches the controls first. */}
    <div ref={host} className="map-canvas absolute inset-0 bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset" tabIndex={0} role="application" aria-label="Mapa interactivo de parcelas de Hidalgo, Puebla y Tlaxcala" onKeyDown={e => { if (e.key === 'Escape') { cancel(); measure(null); latest.current.onCancel?.(); } }}/>
  </div>;
});

function measureStyles(drawing: boolean) {
  return [
    new Style({ stroke: new Stroke({ color: 'rgba(255,255,255,.9)', width: 5 }) }),
    new Style({ stroke: new Stroke({ color: '#2563eb', width: 2, lineDash: drawing ? [6, 5] : undefined }), fill: new Fill({ color: 'rgba(37,99,235,.12)' }), image: new Circle({ radius: 4, fill: new Fill({ color: '#ffffff' }), stroke: new Stroke({ color: '#2563eb', width: 2 }) }) }),
  ];
}

function draftStyles(drawing: boolean) {
  return [
    new Style({ stroke: new Stroke({ color: 'rgba(13,18,15,.75)', width: 5 }) }),
    new Style({ stroke: new Stroke({ color: '#b9e769', width: 2.5, lineDash: drawing ? [6, 5] : undefined }), fill: new Fill({ color: 'rgba(185,231,105,.24)' }), image: new Circle({ radius: 5, fill: new Fill({ color: '#ffffff' }), stroke: new Stroke({ color: '#0d120f', width: 2 }) }) }),
  ];
}
