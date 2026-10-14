// Contextual panels opened from the action rail (ArcGIS Map Viewer pattern):
// layers + basemap gallery, the parcel list and the legend.
import { useMemo, useState } from 'react';
import { ChartNoAxesCombined, ChevronDown, Droplets, Leaf, ListTree, Mountain, Satellite, Sparkles, ThermometerSun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ToolbarGroup, Toolbar, ToolbarItem } from './Toolbar';
import { fmt } from './lib';
import type { Atlas, LayerSettings, MapMode, Parcel } from './types';

export const MODES: { key: MapMode; label: string; detail: string; icon: LucideIcon; pro?: boolean }[] = [
  { key: 'parcels', label: 'Rendimiento', detail: 'Rendimiento registrado · ciclo 2025', icon: ChartNoAxesCombined },
  { key: 'ndvi', label: 'Vegetación', detail: 'NDVI Sentinel-2 · 10 m mensual', icon: Leaf },
  { key: 'water', label: 'Agua', detail: 'Candidatos MNDWI · 20 m mensual', icon: Droplets },
  { key: 'climate', label: 'Clima', detail: 'Precipitación CHIRPS · mensual', icon: ThermometerSun },
  { key: 'terrain', label: 'Terreno', detail: 'Elevación INEGI CEM · estática', icon: Mountain },
  { key: 'landsat', label: 'NDVI · Landsat C2', detail: 'Serie histórica · 30 m', icon: Satellite, pro: true },
  { key: 'alphaearth', label: 'AlphaEarth', detail: 'Embeddings anuales · 10 m', icon: Sparkles, pro: true },
];

type Base = LayerSettings['base'];
export const BASEMAPS: { key: Base; label: string; hint: string }[] = [
  { key: 'topo', label: 'Topográfico', hint: 'Esri World Topographic' },
  { key: 'light', label: 'Claro', hint: 'Positron · OpenFreeMap' },
  { key: 'dark', label: 'Oscuro', hint: 'Dark · OpenFreeMap' },
  { key: 'satellite', label: 'Satélite', hint: 'Esri World Imagery' },
];

export function LayersPanel({ mode, technical, settings, year, onMode, onOpacity }: { mode: MapMode; technical: boolean; settings: LayerSettings; year: number; onMode: (mode: MapMode) => void; onOpacity: (opacity: number) => void }) {
  const modes = MODES.filter(m => !m.pro || technical || m.key === mode);
  const raster = mode === 'ndvi' || mode === 'climate' || mode === 'terrain' || mode === 'landsat' || mode === 'alphaearth';
  return <>
    <section className="panel-section">
      <h3 className="panel-section-title">Datos del territorio</h3>
      <Toolbar className="layer-list" aria-label="Capas del territorio" orientation="vertical">
        <ToolbarGroup aria-label="Datos del territorio">{modes.map(m => <ToolbarItem key={m.key} className="layer-row" label={m.label} tooltip={false} isSelected={mode === m.key} onChange={() => onMode(m.key)}>
          <m.icon className="layer-row-icon"/>
          <span className="layer-row-text"><b>{m.label}</b><small>{m.detail}</small></span>
        </ToolbarItem>)}</ToolbarGroup>
      </Toolbar>
    </section>
    <section className="panel-section">
      <h3 className="panel-section-title">Simbología</h3>
      <MapLegend mode={mode} year={year} settings={settings}/>
      <div className="legend-symbols">
        <div className="legend-key"><i className="legend-symbol cluster">12</i>Grupo de parcelas · acércate para ver límites</div>
        <div className="legend-key"><i className="legend-symbol point"/>Parcela individual</div>
        <div className="legend-key"><i className="legend-symbol field"/>Límite de parcela · color según la capa</div>
      </div>
      {raster && <label className="opacity-control"><span>Transparencia <b>{Math.round((1 - settings.opacity) * 100)} %</b></span>
        <input type="range" aria-label="Transparencia de la capa" min={0} max={90} step={5} value={Math.round((1 - settings.opacity) * 100)} onChange={e => onOpacity(1 - Number(e.target.value) / 100)} style={{ '--value': `${(1 - settings.opacity) / .9 * 100}%` } as React.CSSProperties}/></label>}
    </section>
  </>;
}

export function BasemapPanel({ settings, onBase, onOverlay }: { settings: LayerSettings; onBase: (base: Base) => void; onOverlay: (key: 'states' | 'municipalities', visible: boolean) => void }) {
  return <>
    <section className="panel-section">
      <div className="basemap-gallery" role="group" aria-label="Cartografía base">{BASEMAPS.map(b =>
        <button key={b.key} type="button" className="basemap-option" data-base={b.key} aria-pressed={settings.base === b.key} onClick={() => onBase(b.key)}>
          <span className="basemap-swatch" aria-hidden="true"/><span className="basemap-text"><b>{b.label}</b><small>{b.hint}</small></span>
        </button>)}</div>
    </section>
    <section className="panel-section">
      <h3 className="panel-section-title">Límites</h3>
      {([['states', 'Límites estatales', 'INEGI · 3 estados'], ['municipalities', 'Municipios', 'INEGI · 361 límites']] as const).map(([key, label, hint]) =>
        <button key={key} type="button" role="switch" className="overlay-switch" aria-checked={settings[key]} onClick={() => onOverlay(key, !settings[key])}>
          <span><b>{label}</b><small>{hint}</small></span><span className="ui-switch" aria-hidden="true"/>
        </button>)}
    </section>
  </>;
}

const SORTS = { id: 'ID', yield: 'Rendimiento', area: 'Superficie' } as const;
export function ParcelListPanel({ parcels, atlas, keyDate, selectedId, onSelect }: { parcels: Parcel[]; atlas: Atlas; keyDate: string; selectedId: string | null; onSelect: (id: string) => void }) {
  const [sort, setSort] = useState<keyof typeof SORTS>('id');
  const sorted = useMemo(() => [...parcels].sort((a, b) => sort === 'id' ? a.properties.id.localeCompare(b.properties.id) : sort === 'area' ? b.properties.area - a.properties.area : (b.properties.observedYield ?? -1) - (a.properties.observedYield ?? -1)), [parcels, sort]);
  return <section className="panel-section panel-section-list">
    <div className="parcel-list-toolbar">
      <span>{parcels.length} parcelas</span>
      <label className="parcel-list-sort">Ordenar: <select aria-label="Ordenar parcelas" value={sort} onChange={e => setSort(e.target.value as keyof typeof SORTS)}>{Object.entries(SORTS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><ChevronDown size={13}/></label>
    </div>
    <ul className="parcel-list" aria-label="Parcelas del mapa">{sorted.map(p => {
      const ndvi = atlas.landsat[keyDate]?.parcels[p.properties.id]?.mean;
      return <li key={p.properties.id}><button type="button" aria-current={selectedId === p.properties.id || undefined} onClick={() => onSelect(p.properties.id)}>
        <span className="parcel-list-text"><b>{p.properties.name || p.properties.id}</b><small>{p.properties.municipality} · {p.properties.state}</small></span>
        {ndvi != null && <i className="parcel-list-bar" style={{ '--ndvi': Math.max(0, Math.min(1, ndvi)) } as React.CSSProperties} title={`NDVI Landsat ${fmt(ndvi, 2)}`}/>}
        {p.properties.observedYield == null ? <span className="ui-badge parcel-list-badge">Predicción</span> : <span className="parcel-list-value">{fmt(p.properties.observedYield)} <small>t/ha</small></span>}
      </button></li>;
    })}</ul>
    {!parcels.length && <div className="panel-empty"><ListTree size={20} strokeWidth={1.6}/><b>Sin parcelas</b><p>Ninguna parcela coincide con la búsqueda o los filtros.</p></div>}
  </section>;
}

export function MapLegend({ mode, year, settings }: { mode: MapMode; year: number; settings: LayerSettings }) {
  const climate = settings.precipitation ? ['Precipitación', '0', '1488 mm/mes', 'rain'] : settings.tmax ? ['Temperatura máxima', '4', '42 °C', 'heat'] : settings.tmin ? ['Temperatura mínima', '4', '42 °C', 'heat'] : null;
  const terrain = settings.elevation ? ['Elevación', '8', '5608 m', 'elevation'] : settings.slope ? ['Pendiente', '0', '71°', 'slope'] : null;
  const ramp = (title: string, from: string, to: string, kind: string, note?: string) => <div className="legend-block" key={title}><div className="legend-title"><b>{title}</b>{note && <span>{note}</span>}</div><div className={`legend-ramp ${kind}`}/><div className="legend-scale"><span>{from}</span><span>{to}</span></div></div>;
  return <div className="map-legend">
    {mode === 'parcels' && ramp('Rendimiento registrado', '0', '8 t/ha', 'yield', 'Ciclo 2025')}
    {mode === 'ndvi' && ramp('Vegetación · NDVI', '−1', '1', 'ndvi', 'Sentinel-2 · 10 m')}
    {mode === 'landsat' && ramp('NDVI · Landsat C2', '−1', '1', 'ndvi', '30 m')}
    {mode === 'water' && <div className="legend-block"><div className="legend-title"><b>Candidatos de agua</b><span>MNDWI ≥ {settings.waterThreshold ?? 0} · 20 m</span></div><div className="legend-key"><i className="legend-dot water"/>Píxeles sobre el umbral</div></div>}
    {mode === 'alphaearth' && <div className="legend-block"><div className="legend-title"><b>AlphaEarth</b><span>Anual {year}</span></div><div className="legend-ramp alphaearth"/><div className="legend-scale"><span>A00 · A01 · A02</span><span>RGB</span></div></div>}
    {climate && ramp(climate[0], climate[1], climate[2], climate[3])}
    {terrain && ramp(terrain[0], terrain[1], terrain[2], terrain[3])}
  </div>;
}


const STATES = ['Hidalgo', 'Puebla', 'Tlaxcala'];
const GROUPS: [string, string][] = [['all', 'Todos'], ['training', 'Entrenamiento'], ['prediction', 'Predicción'], ['custom', 'Mis terrenos']];

export function FiltersPanel({ state, group, count, total, onChange, onReset }: { state: string; group: string; count: number; total: number; onChange: (next: { state?: string; group?: string }) => void; onReset: () => void }) {
  return <section className="panel-section">
    <div className="filter-summary"><span><b>{count}</b> de {total} parcelas</span>{(state !== 'all' || group !== 'all') && <button type="button" className="text-button" onClick={onReset}>Restablecer</button>}</div>
    <h3 className="panel-section-title">Estado</h3>
    <div className="chip-group" role="group" aria-label="Filtrar por estado">{['all', ...STATES].map(s => <button key={s} type="button" className="chip" aria-pressed={state === s} onClick={() => onChange({ state: s })}>{s === 'all' ? 'Todos' : s}</button>)}</div>
    <h3 className="panel-section-title">Conjunto</h3>
    <div className="chip-group" role="group" aria-label="Filtrar por conjunto">{GROUPS.map(([key, label]) => <button key={key} type="button" className="chip" aria-pressed={group === key} onClick={() => onChange({ group: key })}>{label}</button>)}</div>
  </section>;
}

export function BookmarksPanel({ parcels, onFit, onAll }: { parcels: Parcel[]; onFit: (bounds: number[], label: string) => void; onAll: () => void }) {
  const bookmarks = STATES.map(state => {
    const items = parcels.filter(p => p.properties.state === state);
    const bounds = items.reduce((b, p) => [Math.min(b[0], p.properties.bounds[0]), Math.min(b[1], p.properties.bounds[1]), Math.max(b[2], p.properties.bounds[2]), Math.max(b[3], p.properties.bounds[3])], [Infinity, Infinity, -Infinity, -Infinity]);
    return { state, count: items.length, bounds };
  }).filter(b => b.count);
  return <section className="panel-section">
    <ul className="bookmark-list" aria-label="Marcadores">
      <li><button type="button" onClick={onAll}><span className="bookmark-thumb all" aria-hidden="true"/><span><b>Todas las parcelas</b><small>Hidalgo · Puebla · Tlaxcala</small></span></button></li>
      {bookmarks.map(b => <li key={b.state}><button type="button" onClick={() => onFit(b.bounds, b.state)}><span className="bookmark-thumb" data-state={b.state} aria-hidden="true"/><span><b>{b.state}</b><small>{b.count} parcelas</small></span></button></li>)}
    </ul>
  </section>;
}
