import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
import { extend, createEmpty } from 'ol/extent';
import { Attribution, defaults as defaultControls, ScaleLine } from 'ol/control';
import Draw from 'ol/interaction/Draw';
import DragBox from 'ol/interaction/DragBox';
import HeatmapLayer from 'ol/layer/Heatmap';
import type RenderEvent from 'ol/render/Event';
import Modify from 'ol/interaction/Modify';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { MapboxVectorLayer } from 'ol-mapbox-style';
import Overlay from 'ol/Overlay';
import LineString from 'ol/geom/LineString';
import { getArea, getLength } from 'ol/sphere';
import type { Atlas, Geometry, ImageryManifest, LayerSettings, Parcel } from './types';
import { fmt } from './lib';
import { isOn, LAYERS, layerOf, zIndexOf } from './layers';
import { tempExtent } from './milli/temp-layers';
import type { TempLayer } from './milli/temp-layers';
import type { LayerId, MapLayer } from './layers';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
/** Distinct, soft fills for the Municipios layer (ColorBrewer Set3; one per municipality, by its INEGI key). */
const MUNICIPALITY_COLORS = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'];
const hashColor = (key: string) => { let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0; return MUNICIPALITY_COLORS[h % MUNICIPALITY_COLORS.length]; };
/** Static rasters per layer: climate by month, terrain once. */
const RASTER_LAYERS = ['precipitation', 'tmax', 'tmin', 'elevation', 'slope'] as const satisfies readonly LayerId[];

export type MeasureKind = 'distance' | 'area';
export interface MapHandle { zoomBy: (delta: number) => void; toggleFullscreen: () => Promise<void>; fitBounds: (bounds: number[]) => void; measure: (kind: MeasureKind | null) => void; showLocation: (coords: number[]) => void; exportPng: () => Promise<Blob | null>; fitAll: () => void; fitParcel: (parcel: Parcel) => void; fitGeometry: (geometry: object) => void; /** The visible extent [west, south, east, north] in degrees and the zoom. */ view: () => { bbox: number[]; zoom: number } | null; locate: (coords: number[]) => void; draw: () => void; edit: (parcel: Parcel) => void; proposal: (geometry: Geometry | null) => void; editDraft: (geometry: Geometry) => void; cancel: () => void; finish: () => void; undo: () => void; geometry: () => Geometry | null }
interface Props {
  atlas: Atlas; parcels: Parcel[]; selected: Parcel | null; layers: MapLayer[]; year: number; keyDate: string; settings: LayerSettings; manifest?: ImageryManifest | null; imageryVisible?: boolean;
  onReady?: () => void; onImageryBusy?: (busy: boolean) => void; onImageryFailure?: () => void; onMapClick?: (coords: number[]) => void; onCancel?: () => void;
  onMeasure?: (value: string | null) => void; onSelect: (id: string) => void; onDraft: (geometry: Geometry | null) => void;
  /** Left / right space taken by popouts, so fits keep parcels visible. */
  padding?: { left: number; right: number };
  highlightId?: string | null; swipe?: number | null; statusTarget?: HTMLElement | null; selectArea?: boolean;
  onHover?: (id: string | null, pixel: [number, number] | null) => void; onAreaSelect?: (ids: string[]) => void; onZoom?: (zoom: number) => void; onFullscreen?: (on: boolean) => void;
  /** Milli's temporary layers (milli/temp-layers.ts), drawn above the data layers. */
  tempLayers?: TempLayer[];
}
type Runtime = { heatmap: HeatmapLayer; dragBox: DragBox; clipped: Set<BaseLayer>; map: Map; source: VectorSource; parcels: VectorLayer<VectorSource>; clusters: VectorLayer<Cluster>; rasters: globalThis.Map<LayerId, ImageLayer<ImageStatic>>; bases: Partial<Record<Base, BaseLayer>>; imagery: TileLayer<XYZ>; indices: Record<'ndvi' | 'water', TileLayer<XYZ>>; tileSources: globalThis.Map<string, XYZ>; municipalities: VectorLayer<VectorSource>; municipalityFill: VectorLayer<VectorSource>; states: VectorLayer<VectorSource>; draftSource: VectorSource; draftLayer: VectorLayer<VectorSource>; measureSource: VectorSource; locationSource: VectorSource; measureTip: Overlay; measure: Draw | null; measureEndedAt?: number; interaction: Draw | Modify | null; editingId: string | null; temp: globalThis.Map<string, VectorLayer<VectorSource>> };

function createBase(kind: Base): BaseLayer {
  if (kind === 'topo') return new TileLayer({ className: 'basemap-invertible', zIndex: 0, preload: 1, source: new XYZ({ url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', crossOrigin: 'anonymous', maxZoom: 19, attributions: ESRI_TOPO }) });
  if (kind === 'satellite') return new TileLayer({ zIndex: 0, source: new XYZ({ url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', crossOrigin: 'anonymous', maxZoom: 19, attributions: 'Imagery © Esri, Maxar, Earthstar Geographics' }) });
  const layer = new MapboxVectorLayer({ styleUrl: VECTOR_STYLES[kind]!, source: 'openmaptiles', declutter: true, zIndex: 0, preload: 1, className: kind === 'light' ? 'basemap-invertible' : 'ol-layer' });
  layer.getSource()?.setAttributions(OPENFREEMAP);
  return layer;
}

export default forwardRef<MapHandle, Props>(function AtlasMap(props, ref) {
  const host = useRef<HTMLDivElement>(null);
  const coordinates = useRef<HTMLSpanElement>(null);
  const controls = useRef<{ scale?: ScaleLine; attribution?: Attribution }>({});
  const latest = useRef(props); latest.current = props;
  const runtime = useRef<Runtime | null>(null);
  const [error, setError] = useState('');
  const [viewZoom, setViewZoom] = useState(11);
  const initialFit = useRef(false);
  const tileFailures = useRef(new globalThis.Map<XYZ, Set<string>>());
  const pendingTiles = useRef(new globalThis.Map<XYZ, Set<string>>());
  const styleCache = useRef(new globalThis.Map<string, Style | Style[]>());
  const swipeRatio = useRef<number | null>(null);

  useEffect(() => {
    const changed = () => { latest.current.onFullscreen?.(document.fullscreenElement === document.documentElement); };
    document.addEventListener('fullscreenchange', changed);
    return () => document.removeEventListener('fullscreenchange', changed);
  }, []);

  const pad = (top: number, side: number, bottom: number) => { const p = latest.current.padding; return [top, side + (p?.right ?? 0), bottom, side + (p?.left ?? 0)]; };
  function fitParcel(parcel: Parcel) {
    const r = runtime.current; if (!r) return;
    r.map.getView().fit(transformExtent(parcel.properties.bounds, 'EPSG:4326', 'EPSG:3857'), { padding: pad(80, 64, 110), maxZoom: 16, duration: 600 });
  }
  function fitAll(duration = 450) {
    const r = runtime.current; const extent = r?.source.getExtent();
    if (r && extent && !r.source.isEmpty()) r.map.getView().fit(extent, { padding: pad(70, 56, 110), maxZoom: 12.4, duration });
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
    zoomBy, toggleFullscreen,
    view() {
      const r = runtime.current, size = r?.map.getSize(); if (!r || !size) return null;
      const v = r.map.getView();
      return { bbox: transformExtent(v.calculateExtent(size), 'EPSG:3857', 'EPSG:4326').map(x => Math.round(x * 1e4) / 1e4), zoom: Math.round((v.getZoom() ?? 0) * 10) / 10 };
    },
    fitBounds(bounds) { runtime.current?.map.getView().fit(transformExtent(bounds, 'EPSG:4326', 'EPSG:3857'), { padding: pad(80, 64, 100), maxZoom: 13, duration: 600 }); },
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
    fitGeometry(geometry) { const r = runtime.current; if (r) r.map.getView().fit(format.readGeometry(geometry).transform('EPSG:4326', 'EPSG:3857').getExtent(), { padding: pad(100, 64, 110), duration: 500, maxZoom: 14 }); },
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

  function onGreenRaster() { const p = latest.current; return isOn(p.layers, 'ndvi') || p.settings.base === 'satellite' || !!p.imageryVisible; }
  function onDarkBase() { const base = latest.current.settings.base; return base === 'dark' || base === 'satellite'; }

  useEffect(() => {
    if (!host.current) return;
    const cache = styleCache.current;
    const cached = (key: string, make: () => Style | Style[]) => { let s = cache.get(key); if (!s) { s = make(); cache.set(key, s); } return s; };
    const source = new VectorSource();
    // Sentinel-2 RGB under the AI delineation; the NDVI and water indices are layers of the stack.
    const imagery = new TileLayer<XYZ>({ visible: false, zIndex: 18, cacheSize: 256 });
    const indices = { ndvi: new TileLayer<XYZ>({ visible: false, cacheSize: 256 }), water: new TileLayer<XYZ>({ visible: false, cacheSize: 256 }) };
    const municipalitySource = new VectorSource({ url: '/data/municipios.geojson', format });
    const municipalities = new VectorLayer({ source: municipalitySource, minZoom: 8.5, zIndex: 20 });
    // Municipios layer: one colour per municipality (its opacity comes from the stack), named when close enough.
    const municipalityFill = new VectorLayer({ source: municipalitySource, visible: false, style(feature, resolution) {
      const key = String(feature.get('cvegeo') ?? feature.get('nomgeo')), name = String(feature.get('nomgeo') ?? '');
      return cached(`muni:${key}:${resolution < 120}`, () => new Style({ fill: new Fill({ color: hashColor(key) }), stroke: new Stroke({ color: 'rgba(255,255,255,.7)', width: 1 }),
        text: resolution < 120 ? new Text({ text: name, font: '600 11px Geist, system-ui, sans-serif', fill: new Fill({ color: '#171717' }), stroke: new Stroke({ color: 'rgba(255,255,255,.85)', width: 3 }), overflow: false }) : undefined }));
    } });
    const states = new VectorLayer({ source: new VectorSource({ url: '/data/estados.geojson', format }), zIndex: 21 });
    const parcels = new VectorLayer({ source, zIndex: 40, minZoom: DETAIL_ZOOM - .01, style(feature, resolution) {
      const p = latest.current;
      if (feature.get('id') === runtime.current?.editingId) return undefined;
      const selected = feature.get('id') === p.selected?.properties.id || feature.get('id') === p.highlightId;
      // Parcels are outlines in a neutral tone: the colour on the map comes from the layers under them.
      const dark = onDarkBase();
      const tone = dark ? '235,238,233' : '75,82,77';
      const styles = cached(`poly:${tone}:${selected}:${dark}`, () => selected
        // The selected field is an outline only, so the imagery underneath stays readable.
        ? [new Style({ stroke: new Stroke({ color: 'rgba(31,37,33,.85)', width: 4.5 }) }), new Style({ stroke: new Stroke({ color: '#ffffff', width: 2.5 }), fill: new Fill({ color: 'rgba(0,0,0,0)' }) })]
        : [new Style({ stroke: new Stroke({ color: `rgba(${tone},.7)`, width: 1.5 }), fill: new Fill({ color: `rgba(${tone},.12)` }) })]) as Style[];
      if (resolution < 9) {
        const estimate = feature.get('predictedYield') as number | null;
        const label = (feature.get('name') || feature.get('id')) + (estimate != null ? `\n${fmt(estimate)} t/ha` : '');
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
    // Production heat map (ArcGIS smart mapping "heat map"): weight = estimated tonnes.
    const heatmap = new HeatmapLayer({ source: new VectorSource(), visible: false, blur: 22, radius: 14, weight: f => Math.min(1, (f.get('production') as number) / 60), gradient: ['rgba(255,247,188,0)', '#fee391', '#fec44f', '#fe9929', '#d95f0e', '#993404'] });
    const dragBox = new DragBox({ className: 'ol-dragbox select-box' });
    dragBox.setActive(false);
    dragBox.on('boxend', () => {
      const extent = dragBox.getGeometry().getExtent(), ids: string[] = [];
      source.forEachFeatureIntersectingExtent(extent, f => { ids.push(f.get('id')); });
      latest.current.onAreaSelect?.(ids);
    });
    const measureSource = new VectorSource(), locationSource = new VectorSource();
    const measureLayer = new VectorLayer({ source: measureSource, zIndex: 110, style: measureStyles(false) });
    const locationLayer = new VectorLayer({ source: locationSource, zIndex: 120, style: [new Style({ image: new Circle({ radius: 16, fill: new Fill({ color: 'rgba(37,99,235,.16)' }) }) }), new Style({ image: new Circle({ radius: 7, fill: new Fill({ color: '#2563eb' }), stroke: new Stroke({ color: '#fff', width: 2.5 }) }) })] });
    const tip = document.createElement('div'); tip.className = 'measure-tip';
    const measureTip = new Overlay({ element: tip, offset: [0, -14], positioning: 'bottom-center', stopEvent: false });
    const draftSource = new VectorSource();
    const draftLayer = new VectorLayer({ source: draftSource, zIndex: 100, style: draftStyles(false) });
    const initialBase = latest.current.settings.base;
    const bases: Runtime['bases'] = { [initialBase]: createBase(initialBase) };
    const map = new Map({ target: host.current, layers: [bases[initialBase]!, indices.ndvi, indices.water, municipalityFill, imagery, municipalities, states, heatmap, parcels, clusters, draftLayer, measureLayer, locationLayer], overlays: [measureTip], view: new View({ center: fromLonLat([-98.4, 19.755]), zoom: 10.85, minZoom: MIN_ZOOM, maxZoom: MAX_ZOOM }), controls: defaultControls({ zoom: false, rotate: false, attribution: false }) });
    map.addInteraction(dragBox); setMapReadyFlag(true);
    runtime.current = { heatmap, dragBox, clipped: new Set(), map, source, parcels, clusters, bases, imagery, indices, rasters: new globalThis.Map(), tileSources: new globalThis.Map(), municipalities, municipalityFill, states, draftSource, draftLayer, measureSource, locationSource, measureTip, measure: null, interaction: null, editingId: null, temp: new globalThis.Map() };
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
    map.getViewport().addEventListener('pointerleave', () => latest.current.onHover?.(null, null));
    map.on('pointermove', event => {
      if (event.dragging) return;
      const c = toLonLat(event.coordinate);
      if (coordinates.current) coordinates.current.textContent = `${fmt(Math.abs(c[1]), 4)}° ${c[1] < 0 ? 'S' : 'N'}  ${fmt(Math.abs(c[0]), 4)}° ${c[0] < 0 ? 'O' : 'E'}`;
      const hovered = runtime.current?.interaction || runtime.current?.measure ? undefined : map.forEachFeatureAtPixel(event.pixel, (f, layer) => layer === parcels ? f : layer === clusters && (f.get('features') as Feature[]).length === 1 ? (f.get('features') as Feature[])[0] : undefined, { hitTolerance: 4 });
      host.current!.style.cursor = runtime.current?.interaction || runtime.current?.dragBox.getActive() ? 'crosshair' : hovered || map.hasFeatureAtPixel(event.pixel, { layerFilter: l => l === clusters }) ? 'pointer' : '';
      latest.current.onHover?.(hovered ? hovered.get('id') : null, hovered ? [event.pixel[0], event.pixel[1]] : null);
    });
    map.on('moveend', () => latest.current.onZoom?.(map.getView().getZoom() || 11));
    for (const layer of [imagery, indices.ndvi, indices.water, municipalityFill, heatmap, parcels]) clip(layer);
    const syncZoom = () => setViewZoom(map.getView().getZoom() ?? 11);
    map.getView().on('change:resolution', syncZoom); syncZoom();
    const resize = new ResizeObserver(() => map.updateSize()); resize.observe(host.current);
    return () => { resize.disconnect(); map.getView().un('change:resolution', syncZoom); for (const s of runtime.current?.tileSources.values() || []) s.dispose(); tileFailures.current.clear(); pendingTiles.current.clear(); cache.clear(); map.dispose(); runtime.current = null; initialFit.current = false; };
  }, []);

  useEffect(() => {
    const r = runtime.current; if (!r) return;
    r.source.clear(); r.source.addFeatures(format.readFeatures({ type: 'FeatureCollection', features: props.parcels }, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }));
    const heat = r.heatmap.getSource()!; heat.clear();
    heat.addFeatures(props.parcels.filter(p => p.properties.predictedYield != null).map(p => new Feature({ geometry: new Point(fromLonLat(p.properties.centroid)), production: p.properties.predictedYield! * p.properties.area })));
    if (!initialFit.current && !r.source.isEmpty()) { initialFit.current = true; fitAll(0); }
  }, [props.parcels]);
  // Milli's temporary layers: one vector layer each, above the parcels and clusters; a new one is framed.
  useEffect(() => {
    const r = runtime.current; if (!r) return;
    const wanted = props.tempLayers ?? [], ids = new Set(wanted.map(l => l.id));
    for (const [id, layer] of r.temp) if (!ids.has(id)) { r.map.removeLayer(layer); layer.getSource()?.dispose(); r.temp.delete(id); }
    const byId = (id: string) => r.source.getFeatures().find(f => f.get('id') === id);
    let newest: TempLayer | null = null;
    wanted.forEach((t, k) => {
      const existing = r.temp.get(t.id);
      if (existing && existing.get('addedAt') === t.addedAt) { existing.setZIndex(56 + k); return; }
      if (existing) { r.map.removeLayer(existing); r.temp.delete(t.id); }
      const source = new VectorSource(), features: Feature[] = [];
      for (const [id, color] of t.parcels ?? []) { const f = byId(id); if (f) features.push(new Feature({ geometry: f.getGeometry()!.clone(), kind: 'parcel', color, centroid: f.get('centroid') })); }
      for (const [lon, lat, color] of t.cells ?? []) { const { dx, dy } = t.cell ?? { dx: 0.005, dy: 0.005 }; features.push(new Feature({ geometry: new Polygon([[[lon - dx / 2, lat - dy / 2], [lon + dx / 2, lat - dy / 2], [lon + dx / 2, lat + dy / 2], [lon - dx / 2, lat + dy / 2], [lon - dx / 2, lat - dy / 2]].map(c => fromLonLat(c))]), kind: 'cell', color })); }
      for (const [lon, lat, color, size] of t.points ?? []) features.push(new Feature({ geometry: new Point(fromLonLat([lon, lat])), kind: 'point', color, size }));
      for (const [lon, lat, text] of t.labels ?? []) features.push(new Feature({ geometry: new Point(fromLonLat([lon, lat])), kind: 'label', text }));
      for (const [lon, lat, text] of t.markers ?? []) features.push(new Feature({ geometry: new Point(fromLonLat([lon, lat])), kind: 'marker', text }));
      source.addFeatures(features);
      const alpha = (c: string, a: number) => { const m = /^#([0-9a-f]{6})$/i.exec(c); if (!m) return c; const n = parseInt(m[1], 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
      const opacity = t.opacity ?? 0.8;
      const layer = new VectorLayer({ source, zIndex: 56 + k, properties: { addedAt: t.addedAt }, style(f, resolution) {
        const kind = f.get('kind') as string, color = f.get('color') as string;
        if (kind === 'cell') return new Style({ fill: new Fill({ color: alpha(color, opacity * 0.85) }) });
        if (kind === 'parcel') return resolution > 18
          // Zoomed out a parcel is a few pixels: a dot at its centroid keeps it visible.
          ? new Style({ geometry: new Point(fromLonLat(f.get('centroid') as number[])), image: new Circle({ radius: 6, fill: new Fill({ color }), stroke: new Stroke({ color: '#ffffff', width: 1.5 }) }) })
          : new Style({ fill: new Fill({ color: alpha(color, opacity) }), stroke: new Stroke({ color: '#ffffff', width: 1.5 }) });
        if (kind === 'point') return new Style({ image: new Circle({ radius: Math.max(3, Number(f.get('size') ?? 9) / 2), fill: new Fill({ color }), stroke: new Stroke({ color: '#ffffff', width: 1.5 }) }) });
        const text = new Text({ text: String(f.get('text') ?? ''), font: `600 ${kind === 'marker' ? 12 : 11.5}px Geist, system-ui, sans-serif`, fill: new Fill({ color: '#171717' }), stroke: new Stroke({ color: 'rgba(255,255,255,.95)', width: 3.5 }), offsetY: kind === 'marker' ? -18 : 0, overflow: true });
        if (kind === 'marker') return [new Style({ image: new Circle({ radius: 7, fill: new Fill({ color: '#d7191c' }), stroke: new Stroke({ color: '#ffffff', width: 2.5 }) }) }), new Style({ text })];
        return new Style({ text });
      } });
      r.map.addLayer(layer); r.temp.set(t.id, layer);
      if (!newest || t.addedAt > newest.addedAt) newest = t;
    });
    // Frame the newest layer (Milli just added it).
    const t = newest as TempLayer | null;
    if (t && Date.now() - t.addedAt < 4000) {
      const ext = tempExtent(t, id => (byId(id)?.get('centroid') as [number, number] | undefined) ?? null);
      if (ext) r.map.getView().fit(transformExtent([ext[0] - 0.01, ext[1] - 0.01, ext[2] + 0.01, ext[3] + 0.01], 'EPSG:4326', 'EPSG:3857'), { padding: pad(96, 72, 120), maxZoom: 15, duration: 500 });
    }
  }, [props.tempLayers, props.parcels]);
  // Heat map and Municipios: on/off, opacity and stack order.
  useEffect(() => {
    const r = runtime.current; if (!r) return;
    for (const [id, layer] of [['heatmap', r.heatmap], ['municipalities', r.municipalityFill]] as const) {
      const l = layerOf(props.layers, id);
      layer.setVisible(l.on); layer.setOpacity(l.opacity); layer.setZIndex(zIndexOf(props.layers, id));
    }
  }, [props.layers]);
  useEffect(() => { runtime.current?.dragBox.setActive(!!props.selectArea); }, [props.selectArea]);
  useEffect(() => { swipeRatio.current = props.swipe ?? null; runtime.current?.map.render(); }, [props.swipe]);
  useEffect(() => {
    const r = runtime.current; if (!r) return;
    const ready = () => latest.current.onReady?.();
    r.map.once('postrender', ready); r.map.render();
    return () => r.map.un('postrender', ready);
  }, [props.atlas]);
  useEffect(() => { const r = runtime.current; r?.parcels.changed(); r?.clusters.changed(); }, [props.selected, props.highlightId, props.year, props.keyDate, props.settings.base, props.imageryVisible, isOn(props.layers, 'ndvi')]);

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

  // Climate (by month) and terrain rasters: one image layer per layer that is on, kept while its
  // month is shown; opacity and order follow the stack.
  useEffect(() => {
    const r = runtime.current; if (!r) return;
    const missing: string[] = [];
    for (const id of RASTER_LAYERS) {
      const l = layerOf(props.layers, id), key = id === 'elevation' || id === 'slope' ? id : `${id}/${props.keyDate}`;
      const raster = l.on ? props.atlas.rasters[key] : undefined, current = r.rasters.get(id);
      if (l.on && !raster) missing.push(LAYERS[id].name);
      if (current && current.get('url') !== raster?.url) { r.map.removeLayer(current); r.rasters.delete(id); }
      if (!raster) continue;
      let layer = r.rasters.get(id);
      if (!layer) {
        layer = new ImageLayer({ source: new ImageStatic({ url: raster.url, imageExtent: raster.extent, projection: raster.projection, crossOrigin: 'anonymous' }) });
        layer.set('url', raster.url);
        layer.getSource()!.on('imageloaderror', () => setError(`No se pudo cargar la capa ${LAYERS[id].name}.`));
        clip(layer); r.rasters.set(id, layer); r.map.addLayer(layer);
      }
      layer.setOpacity(l.opacity); layer.setZIndex(zIndexOf(props.layers, id));
    }
    setError(missing.length ? `Sin datos de ${missing.join(' y ').toLowerCase()} para este mes.` : '');
  }, [props.layers, props.keyDate, props.atlas]);

  // Sentinel-2 tiles: the RGB backdrop of the AI delineation, and the NDVI and water indices of the
  // stack. Sources are kept per product, month and threshold (six at most), so toggling a layer,
  // moving its threshold back or playing the months stays cheap.
  const shownSources = () => { const r = runtime.current; return r ? [r.imagery, r.indices.ndvi, r.indices.water].filter(l => l.getVisible()).map(l => l.getSource()).filter((s): s is XYZ => !!s) : []; };
  const reportBusy = () => latest.current.onImageryBusy?.(shownSources().some(s => !!pendingTiles.current.get(s)?.size));
  function tileSource(manifest: ImageryManifest, product: string, threshold: number) {
    const r = runtime.current!, url = manifest.tileTemplate.replace('{product}', product) + `?threshold=${threshold}`;
    let source = r.tileSources.get(url);
    if (source) return source;
    source = new XYZ({ url, crossOrigin: 'anonymous', minZoom: 6, maxZoom: 16, transition: 150, attributions: 'Sentinel-2 L2A © Copernicus / Microsoft Planetary Computer' });
    const created = source, failures = new Set<string>(), pending = new Set<string>(); tileFailures.current.set(created, failures); pendingTiles.current.set(created, pending);
    const shown = () => shownSources().includes(created);
    source.on('tileloadstart', event => { pending.add(event.tile.getKey()); if (shown()) reportBusy(); });
    source.on('tileloaderror', event => { pending.delete(event.tile.getKey()); failures.add(event.tile.getKey()); if (failures.size > 512) failures.delete(failures.values().next().value!); if (shown()) { reportBusy(); latest.current.onImageryFailure?.(); setError('Servicio de imágenes no disponible. Puedes seguir usando el atlas.'); } });
    source.on('tileloadend', event => { pending.delete(event.tile.getKey()); failures.delete(event.tile.getKey()); if (shown()) { reportBusy(); if (!failures.size) setError(''); } });
    r.tileSources.set(url, source);
    if (r.tileSources.size > 6) { const oldest = r.tileSources.keys().next().value!, evicted = r.tileSources.get(oldest)!; if (!shownSources().includes(evicted)) { tileFailures.current.delete(evicted); pendingTiles.current.delete(evicted); evicted.dispose(); r.tileSources.delete(oldest); } }
    return source;
  }
  useEffect(() => {
    const r = runtime.current; if (!r) return;
    const ndvi = layerOf(props.layers, 'ndvi'), water = layerOf(props.layers, 'water');
    const wanted: [TileLayer<XYZ>, string | null, number][] = [
      [r.imagery, props.imageryVisible ? 'rgb' : null, 0],
      [r.indices.ndvi, ndvi.on ? 'ndvi' : null, ndvi.threshold ?? LAYERS.ndvi.threshold!.default],
      [r.indices.water, water.on ? 'mndwi' : null, water.threshold ?? LAYERS.water.threshold!.default],
    ];
    for (const [layer, product, threshold] of wanted) {
      layer.setVisible(!!product && !!props.manifest);
      if (product && props.manifest) layer.setSource(tileSource(props.manifest, product, threshold));
    }
    r.indices.ndvi.setOpacity(ndvi.opacity); r.indices.ndvi.setZIndex(zIndexOf(props.layers, 'ndvi'));
    r.indices.water.setOpacity(water.opacity); r.indices.water.setZIndex(zIndexOf(props.layers, 'water'));
    if (wanted.some(([, product]) => product)) setError(shownSources().some(s => tileFailures.current.get(s)?.size) ? 'Servicio de imágenes no disponible. Puedes seguir usando el atlas.' : '');
    reportBusy();
  }, [props.manifest, props.imageryVisible, props.layers]); // eslint-disable-line react-hooks/exhaustive-deps

  // The status row may live in another popout (portal); controls follow their element.
  const attach = useCallback((kind: 'scale' | 'attribution') => (el: HTMLDivElement | null) => {
    const r = runtime.current, current = controls.current[kind];
    if (current) { r?.map.removeControl(current); controls.current[kind] = undefined; }
    if (!el || !r) return;
    const control = kind === 'scale' ? new ScaleLine({ bar: false, minWidth: 48, maxWidth: 72, target: el }) : new Attribution({ collapsible: false, target: el });
    controls.current[kind] = control as never; r.map.addControl(control);
  }, []);
  const attachScale = useCallback((el: HTMLDivElement | null) => attach('scale')(el), [attach]);
  const attachAttribution = useCallback((el: HTMLDivElement | null) => attach('attribution')(el), [attach]);
  const [mapReadyFlag, setMapReadyFlag] = useState(false);

  /** Swipe (ArcGIS "Swipe"): data layers draw only left of the divider; the basemap stays whole. */
  function clip(layer: BaseLayer) {
    const r = runtime.current;
    if (r?.clipped.has(layer)) return; r?.clipped.add(layer);
    layer.on('prerender' as never, ((event: RenderEvent) => {
      const ratio = swipeRatio.current, ctx = event.context as CanvasRenderingContext2D | undefined;
      if (ratio == null || !ctx || !('save' in ctx)) return;
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, ctx.canvas.width * ratio, ctx.canvas.height); ctx.clip();
    }) as never);
    layer.on('postrender' as never, ((event: RenderEvent) => {
      const ctx = event.context as CanvasRenderingContext2D | undefined;
      if (swipeRatio.current != null && ctx && 'restore' in ctx) ctx.restore();
    }) as never);
  }
  function zoomBy(delta: number) {
    const view = runtime.current?.map.getView();
    if (!view) return;
    const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, (view.getZoom() ?? MIN_ZOOM) + delta));
    view.cancelAnimations();
    view.animate({ zoom: next, duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200 });
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { setError('No pudimos abrir la pantalla completa en este navegador.'); }
  }
  return <div className="map-canvas-wrap absolute inset-0" data-testid="map" data-layers={props.layers.filter(l => l.on).map(l => l.id).join(' ')} data-base={props.settings.base} data-zoom={viewZoom.toFixed(2)} data-parcel-count={props.parcels.length} data-period={props.keyDate} data-detail={viewZoom >= DETAIL_ZOOM || undefined}>
    {error && <div role="status" className={cn('rounded-full bg-frame shadow-md', 'map-status absolute top-12 left-1/2 z-20 flex max-w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 items-center gap-3 px-3 py-2 text-sm', error && 'border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200')}><span>{error}</span>{isOn(props.layers, 'ndvi') || isOn(props.layers, 'water') || props.imageryVisible ? <Button size="sm" variant="outline" onClick={() => { for (const source of shownSources()) { tileFailures.current.get(source)?.clear(); source.refresh(); } setError(''); }}>Reintentar imágenes</Button> : null}</div>}

    {mapReadyFlag && (() => {
      const row = <div className={cn('map-statusbar flex min-w-0 items-center gap-3 text-[11px] text-muted-foreground', !props.statusTarget && 'pointer-events-auto absolute top-2.5 right-3 z-[9] max-w-[24rem] rounded-full bg-frame/80 px-3 py-1 backdrop-blur max-md:hidden')}>
        <div className="flex shrink-0 items-center gap-2.5 text-[11px] whitespace-pre tabular-nums"><span ref={coordinates}>19.7540° N  98.4050° O</span><span>z {viewZoom.toFixed(1)}</span><div className="map-scale" ref={attachScale}/></div>
        <div className="map-attribution min-w-0 flex-1 truncate" ref={attachAttribution}/>
      </div>;
      return props.statusTarget ? createPortal(row, props.statusTarget) : row;
    })()}

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
