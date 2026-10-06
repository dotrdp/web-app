import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, Menu, MenuItem, Popover, Select, Slider, Snackbar, Switch, TextField, Tooltip } from '@mui/material';
import { ArrowRight, ArrowUpRight, Bell, ChartNoAxesCombined, Check, ChevronDown, ChevronRight, CircleHelp, Database, Download, Droplets, Filter, Grid2X2, Layers3, Leaf, LogOut, Map as MapIcon, MapPin, Menu as MenuIcon, Mountain, PanelLeftClose, PencilRuler, Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Sprout, ThermometerSun, Users, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AtlasMap from './AtlasMap';
import type { MapHandle } from './AtlasMap';
import Login from './Login';
import ParcelPanel from './ParcelPanel';
import AnalysisDialog from './AnalysisDialog';
import TechnicalPage from './TechnicalPage';
import { AdminPage, ModelsPage, ParcelsPage, SourcesPage } from './OtherPages';
import { MiniSpark } from './Charts';
import { api, dateKey, download, EXAMPLE_YIELD, filterParcels, fmt, geometryBounds, IS_DEMO, mergedParcels, MONTH_NAMES, MONTHS, parcelCsv, parseCoordinates, polygonArea } from './lib';
import type { Analysis, Atlas, Field, Geometry, LayerSettings, MapFilters, MapMode, Override, Parcel, User, View, Workspace } from './types';

const EMPTY_WORKSPACE: Workspace = { analyses: [], overrides: {}, fields: [] };
const EMPTY_FILTERS: MapFilters = { query: '', state: 'all', group: 'all', ndviEnabled: true, ndviThreshold: .35, onlyNdvi: false };
const DEFAULT_LAYERS: LayerSettings = { precipitation: false, tmin: false, tmax: false, elevation: false, slope: false, municipalities: true, states: true, opacity: .8, base: 'satellite' };
const VIEWS: Record<View, { label: string; title: string; description: string; icon: LucideIcon }> = {
  map: { label: 'Mapa de parcelas', title: 'Tu territorio, en perspectiva.', description: 'Explora las parcelas, conecta los datos y conoce mejor tu campo.', icon: MapIcon },
  parcels: { label: 'Mis parcelas', title: 'Cada parcela cuenta.', description: 'Consulta el dataset FIRA, tus terrenos y los análisis guardados.', icon: Grid2X2 },
  technical: { label: 'Análisis técnico', title: 'Los datos detrás del campo.', description: 'Curvas de vegetación, clima y embeddings para una mirada más profunda.', icon: ChartNoAxesCombined },
  models: { label: 'Modelo predictivo', title: 'Del dato a la decisión.', description: 'Un espacio para los resultados y la evaluación del modelo.', icon: Sparkles },
  sources: { label: 'Datos y fuentes', title: 'Información con raíces.', description: 'Conoce el origen y el alcance de cada capa del atlas.', icon: Database },
  admin: { label: 'Administración', title: 'Tu espacio de trabajo.', description: 'Usuarios y acceso para el equipo de AgroCebada.', icon: Users },
};
const MAP_MODES: { key: MapMode; label: string; icon: LucideIcon }[] = [{ key: 'parcels', label: 'Parcelas', icon: MapPin }, { key: 'ndvi', label: 'NDVI · Landsat C2', icon: Leaf }, { key: 'alphaearth', label: 'AlphaEarth', icon: Layers3 }, { key: 'climate', label: 'Clima', icon: Droplets }, { key: 'terrain', label: 'Relieve', icon: Mountain }];

async function loadAtlas(): Promise<Atlas> {
  async function data<T>(file: string): Promise<T> { const response = await fetch('/data/' + file); if (!response.ok) throw new Error('No pudimos cargar los datos del atlas.'); return response.json() as Promise<T>; }
  const [parcels, details, rasters, landsat, provenance] = await Promise.all([data<Atlas['parcels']>('parcels.geojson'), data<Atlas['details']>('parcel-data.json'), data<Atlas['rasters']>('layers.json'), data<Atlas['landsat']>('landsat.json'), data<Atlas['provenance']>('provenance.json')]);
  return { parcels, details, rasters, landsat, provenance };
}

export default function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const [workspace, setWorkspace] = useState<Workspace>(EMPTY_WORKSPACE);
  const [loadError, setLoadError] = useState('');
  const [view, setView] = useState<View>(() => { const route = window.location.hash.replace('#/', '') as View; return route in VIEWS ? route : 'map'; });
  const [technical, setTechnical] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>('AGC_001');
  const [year, setYear] = useState(2025), [month, setMonth] = useState(6);
  const [mode, setMode] = useState<MapMode>('parcels');
  const [filters, setFilters] = useState<MapFilters>(EMPTY_FILTERS);
  const [layers, setLayers] = useState<LayerSettings>(DEFAULT_LAYERS);
  const [layerAnchor, setLayerAnchor] = useState<HTMLElement | null>(null), [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);
  const [analysis, setAnalysis] = useState<Parcel | null>(null);
  const [draftMode, setDraftMode] = useState<'draw' | 'edit' | null>(null), [draft, setDraft] = useState<Geometry | null>(null), [fieldName, setFieldName] = useState('Mi parcela');
  const [saving, setSaving] = useState(false), [toast, setToast] = useState('');
  const map = useRef<MapHandle>(null);
  const key = dateKey(year, month);

  useEffect(() => { void api<{ user: User | null }>('/api/auth/session').then(d => setUser(d.user)).catch(() => { setLoadError('No pudimos conectar con el servidor.'); setUser(null); }); }, []);
  const reload = useCallback(() => { setLoadError(''); void Promise.all([loadAtlas(), api<Workspace>('/api/workspace')]).then(([a, w]) => { setAtlas(a); setWorkspace(w); }).catch(e => { setLoadError(e.message); }); }, []);
  useEffect(() => { if (user) reload(); }, [user, reload]);
  useEffect(() => { const onRoute = () => { const route = window.location.hash.replace('#/', '') as View; if (route in VIEWS) setView(route); }; window.addEventListener('hashchange', onRoute); return () => window.removeEventListener('hashchange', onRoute); }, []);
  const parcels = useMemo(() => atlas ? mergedParcels(atlas, workspace) : [], [atlas, workspace]);
  const selected = useMemo(() => parcels.find(p => p.properties.id === selectedId) || null, [parcels, selectedId]);
  const visibleParcels = useMemo(() => atlas ? filterParcels(parcels, { ...filters, onlyNdvi: mode === 'ndvi' && filters.onlyNdvi }, atlas, key) : [], [parcels, filters, atlas, key, mode]);

  function navigate(next: View) { setView(next); window.location.hash = '/' + next; setSidebar(false); if (next === 'technical' || next === 'models') setTechnical(true); if (next !== 'map' && draftMode) { map.current?.cancel(); setDraftMode(null); } window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function switchMode(next: MapMode) {
    setMode(next);
    if (next !== 'alphaearth' && year < 2022) setYear(2025);
    setLayers(l => ({ ...l, precipitation: next === 'climate', tmin: false, tmax: false, elevation: next === 'terrain', slope: false }));
  }
  function chooseParcel(id: string, locate = false) { setSelectedId(id); if (locate) { const p = parcels.find(f => f.properties.id === id); if (p) setTimeout(() => map.current?.fitParcel(p), 50); } }
  function chooseFromTable(id: string) { navigate('map'); chooseParcel(id, true); }
  function search(event: React.FormEvent) { event.preventDefault(); const coords = parseCoordinates(filters.query); if (coords) { map.current?.locate(coords); setToast('Ubicación encontrada. Puedes dibujar tu parcela aquí.'); } else if (visibleParcels.length) { setSelectedId(visibleParcels[0].properties.id); visibleParcels.length === 1 ? map.current?.fitParcel(visibleParcels[0]) : map.current?.fitAll(); } else setToast('No encontramos parcelas con esa búsqueda.'); }
  function clearFilters() { setFilters(EMPTY_FILTERS); setTimeout(() => map.current?.fitAll(), 50); }
  function startDraw() { navigate('map'); setDraftMode('draw'); setDraft(null); setFieldName('Mi parcela'); setTimeout(() => map.current?.draw(), 60); }
  function startEdit() { if (!selected) return; setDraftMode('edit'); setFieldName(selected.properties.name || selected.properties.id); map.current?.edit(selected); }
  function cancelDraft() { map.current?.cancel(); setDraftMode(null); setDraft(null); }
  async function saveDraft() {
    if (!draft || !atlas) return;
    setSaving(true);
    try {
      if (draftMode === 'edit' && selected) {
        const override = await api<Override>(`/api/parcels/${selected.properties.id}/geometry`, { method: 'PUT', body: JSON.stringify({ geometry: draft }) });
        setWorkspace(w => ({ ...w, overrides: { ...w.overrides, [selected.properties.id]: override } }));
        setToast('Límites guardados. El original del dataset se conserva.');
      } else {
        const field = await api<Field>('/api/fields', { method: 'POST', body: JSON.stringify({ geometry: draft, name: fieldName }) });
        setWorkspace(w => ({ ...w, fields: [...w.fields, field] })); setSelectedId(field.id); setToast('Tu parcela quedó guardada. Ya puedes analizarla.');
      }
      setFilters(EMPTY_FILTERS); cancelDraft();
    } catch (e) { setToast((e as Error).message); }
    finally { setSaving(false); }
  }
  async function logout() { try { await api('/api/auth/logout', { method: 'POST' }); setUser(null); setProfileAnchor(null); setWorkspace(EMPTY_WORKSPACE); } catch (e) { setToast((e as Error).message); } }

  if (user === undefined) return <div className="app-loading"><img src="/favicon.svg" width="44" alt=""/><h2>AgroCebada</h2><span className="loader-dot"/><p>Abriendo tu espacio de trabajo…</p></div>;
  if (!user) return <Login onLogin={u => { setUser(u); setLoadError(''); }}/ >;
  if (!atlas) return <div className="app-loading"><img src="/favicon.svg" width="44" alt=""/><h2>{loadError ? 'No pudimos cargar el atlas.' : 'Un momento, volvemos al campo.'}</h2><p>{loadError || 'Preparando parcelas y datos satelitales…'}</p>{loadError ? <Button onClick={reload} variant="contained">Volver a intentar</Button> : <span className="loader-dot"/>}</div>;
  const current = VIEWS[view], countLayers = ['precipitation', 'tmin', 'tmax', 'elevation', 'slope'].filter(k => layers[k as keyof LayerSettings]).length;
  const observed = atlas.parcels.features.map(p => p.properties.observedYield).filter((n): n is number => n != null);
  const averageYield = observed.reduce((a, b) => a + b, 0) / observed.length;
  const ndviCount = Object.values(atlas.landsat[key]?.parcels || {}).filter(v => v.mean != null).length;
  const stats: { label: string; value: string; unit?: string; detail: string; icon: LucideIcon; color: string; spark?: number[] }[] = [
    { label: 'Parcelas del reto', value: '197', detail: '138 entrenamiento · 59 predicción', icon: MapPin, color: 'green' },
    { label: 'Superficie de cultivo', value: fmt(atlas.provenance.totalArea), unit: 'ha', detail: 'Hidalgo, Puebla y Tlaxcala', icon: Sprout, color: 'amber' },
    { label: 'Rendimiento registrado', value: fmt(averageYield), unit: 't/ha', detail: 'Promedio · 138 parcelas · ciclo 2025', icon: ChartNoAxesCombined, color: 'purple', spark: observed.slice(0, 12) },
    { label: 'Cobertura AlphaEarth', value: '197', unit: '/ 197', detail: 'Embeddings anuales · 10 m', icon: Layers3, color: 'blue' },
  ];
  return <div className="app-shell">
    {sidebar && <button className="sidebar-backdrop" aria-label="Cerrar navegación" onClick={() => setSidebar(false)}/>}
    <aside className={`sidebar ${sidebar ? 'mobile-open' : ''}`}>
      <a className="brand" href="#/map" onClick={() => navigate('map')}><img src="/favicon.svg" width="39" height="39" alt=""/><span>AgroCebada<small>FIRA / 2026</small></span></a>
      <div className="workspace-picker"><div className="workspace-icon"><Sprout size={18}/></div><div><b>Reto AgroCebada</b><span>Espacio de trabajo</span></div><ChevronDown size={13}/></div>
      <nav aria-label="Navegación principal"><span className="nav-section">EXPLORAR</span>{(['map', 'parcels'] as View[]).map(v => <NavItem key={v} view={v} current={view} navigate={navigate} count={v === 'parcels' ? parcels.length : undefined}/>)}<span className="nav-section">ANÁLISIS</span>{(['technical', 'models'] as View[]).map(v => <NavItem key={v} view={v} current={view} navigate={navigate}/>)}<span className="nav-section">PROYECTO</span><NavItem view="sources" current={view} navigate={navigate}/>{user.role === 'admin' && <NavItem view="admin" current={view} navigate={navigate}/>}</nav>
      <div className="sidebar-bottom"><div className="challenge-card"><div><span className="live-dot"/>RETO AGROCEBADA</div><strong>Sembramos datos.<br/><em>Cosechamos ideas.</em></strong><span className="challenge-year">FIRA 2026 <Sprout size={30}/></span></div><button className="sidebar-help" onClick={() => navigate('sources')}><CircleHelp size={16}/>Guía y fuentes <ArrowUpRight size={14}/></button><span className="sidebar-version">AgroCebada Atlas <span>v1.0</span></span></div>
    </aside>
    <div className="app-content"><header className="topbar"><div className="breadcrumb"><IconButton className="nav-toggle" aria-label="Abrir navegación" onClick={() => setSidebar(!sidebar)}><MenuIcon size={20}/></IconButton><span className="breadcrumb-home">Espacio de trabajo</span><ChevronRight size={13}/><b>{current.label}</b></div><div className="topbar-actions"><div className="mode-switch" aria-label="Vista de la aplicación"><button className={!technical ? 'active' : ''} onClick={() => { setTechnical(false); if (view === 'technical' || view === 'models') navigate('map'); }}><Sprout size={13}/>Agricultor</button><button className={technical ? 'active' : ''} onClick={() => setTechnical(true)}><SlidersHorizontal size={13}/>Técnica FIRA</button></div><span className="topbar-divider"/><Tooltip title="Cuenta administradora de prueba"><button className="user-profile" onClick={e => setProfileAnchor(e.currentTarget)} aria-label="Abrir menú de testuser"><span className="profile-avatar">TU</span><span><b>testuser</b><small>Administrador</small></span><ChevronDown size={13}/></button></Tooltip></div></header>
      <main className={`main-content view-${view}`}><div className="page-heading"><div><div className="page-eyebrow"><span className="live-dot"/>{current.label.toUpperCase()}<span>/</span>FIRA 2026</div><h1>{current.title}</h1><p>{current.description}</p></div><div className="page-actions">{(view === 'map' || view === 'technical') && <Select className="year-select" size="small" value={year} onChange={e => setYear(Number(e.target.value))} inputProps={{ 'aria-label': 'Año del mapa' }}>{(mode === 'alphaearth' || view === 'technical' ? [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017] : [2025, 2024, 2023, 2022]).map(y => <MenuItem key={y} value={y}>Año {y}</MenuItem>)}</Select>}{view === 'map' && <Button variant="contained" onClick={() => selected ? setAnalysis(selected) : startDraw()} startIcon={<Sparkles size={16}/>}>Analizar parcela</Button>}{view === 'parcels' && <Button variant="contained" onClick={startDraw} startIcon={<PencilRuler size={16}/>}>Nueva parcela</Button>}</div></div>
        {view === 'map' && <><div className="stats-grid">{stats.map(s => <section className="stat-card" key={s.label}><div className="stat-top"><span>{s.label}</span><div className={`stat-icon ${s.color}`}><s.icon size={17}/></div></div><div className="stat-value"><strong>{s.value}</strong>{s.unit && <span>{s.unit}</span>}{s.spark && <MiniSpark values={s.spark} color="#a398c0"/>}</div><p>{s.detail}</p></section>)}</div>
          <section className="map-workspace" aria-label="Explorador de parcelas"><div className="map-workspace-heading"><div><h2><span className="live-dot"/>Atlas de parcelas</h2><span>La tierra, desde los datos.</span></div><div><span className="map-live-caption">DATOS DEL RETO</span><Tooltip title="Exportar las parcelas visibles"><IconButton size="small" aria-label="Exportar parcelas visibles" onClick={() => download('agrocebada-parcelas.csv', parcelCsv(visibleParcels, atlas, key), 'text/csv;charset=utf-8')}><Download size={17}/></IconButton></Tooltip></div></div>
          <div className="map-toolbar"><form className="map-search" onSubmit={search}><Search size={17}/><input value={filters.query} onChange={e => setFilters(f => ({ ...f, query: e.target.value }))} placeholder="Municipio, ID o coordenadas…" aria-label="Buscar municipio, ID o coordenadas"/>{filters.query && <button type="button" aria-label="Limpiar búsqueda" onClick={() => setFilters(f => ({ ...f, query: '' }))}><X size={14}/></button>}<button type="submit" aria-label="Buscar y ubicar"><ArrowRight size={16}/></button></form><Select size="small" value={filters.state} onChange={e => setFilters(f => ({ ...f, state: e.target.value }))} inputProps={{ 'aria-label': 'Filtrar por estado' }}><MenuItem value="all">Todos los estados</MenuItem><MenuItem value="Hidalgo">Hidalgo</MenuItem><MenuItem value="Puebla">Puebla</MenuItem><MenuItem value="Tlaxcala">Tlaxcala</MenuItem>{workspace.fields.length > 0 && <MenuItem value="Mi parcela">Mis terrenos</MenuItem>}</Select><Button className="map-filter-button" startIcon={<Settings2 size={15}/>} variant="outlined" onClick={e => setLayerAnchor(e.currentTarget)}>Capas{countLayers > 0 && <span className="layers-count">{countLayers}</span>}</Button><Tooltip title="Dibujar una nueva parcela"><IconButton aria-label="Dibujar parcela" className="draw-button" onClick={startDraw}><PencilRuler size={18}/></IconButton></Tooltip></div>
          <div className="map-mode-toolbar"><div className="map-mode-tabs" role="tablist" aria-label="Tipo de datos en el mapa">{MAP_MODES.map(item => <button role="tab" aria-selected={mode === item.key} key={item.key} className={mode === item.key ? 'active' : ''} onClick={() => switchMode(item.key)}><item.icon size={14}/>{item.label}{item.key === 'alphaearth' && <span>64D</span>}</button>)}</div><span className="parcel-visible-count">{visibleParcels.length} de {parcels.length} parcelas</span></div>
          {mode === 'ndvi' && <div className="ndvi-controls"><div><Leaf size={16}/><b>Umbral NDVI</b><Switch size="small" checked={filters.ndviEnabled} onChange={(_, enabled) => setFilters(f => ({ ...f, ndviEnabled: enabled }))} inputProps={{ 'aria-label': 'Activar filtro de umbral NDVI' }}/><span>Mostrar valores ≥</span><input className="threshold-number" type="number" min="-1" max="1" step="0.01" value={filters.ndviThreshold} onChange={e => { const value = Number(e.target.value); if (Number.isFinite(value)) setFilters(f => ({ ...f, ndviThreshold: Math.max(-1, Math.min(1, value)) })); }} aria-label="Valor del umbral NDVI"/><Slider size="small" min={-1} max={1} step={.01} value={filters.ndviThreshold} disabled={!filters.ndviEnabled} onChange={(_, v) => setFilters(f => ({ ...f, ndviThreshold: v as number }))} aria-label="Umbral NDVI"/></div><FormControlLabel control={<Checkbox size="small" checked={filters.onlyNdvi} disabled={!filters.ndviEnabled} onChange={(_, checked) => setFilters(f => ({ ...f, onlyNdvi: checked }))}/>} label="Filtrar también parcelas"/><span className="ndvi-coverage">{ndviCount}/197 con datos</span></div>}
          {mode === 'alphaearth' && <div className="annual-note"><Layers3 size={14}/><span>Embedding anual <b>{year}</b> · 64 dimensiones a 10 m. Acerca el mapa para ver los píxeles de cada parcela.</span><span className="data-source-tag">GOOGLE DEEPMIND</span></div>}
          {draftMode && <div className="drawing-banner"><PencilRuler size={18}/><div><b>{draftMode === 'draw' ? 'Dibuja los límites de tu parcela' : `Ajusta los límites de ${fieldName}`}</b><span>{draftMode === 'draw' ? 'Haz clic para añadir vértices y doble clic para cerrar. Después guarda la parcela.' : 'Arrastra los vértices o un punto del borde. Guarda los cambios cuando termines.'}</span></div>{draftMode === 'draw' && !draft && <><Button size="small" onClick={() => map.current?.undo()}>Deshacer punto</Button><Button size="small" onClick={() => map.current?.finish()}>Cerrar polígono</Button></>}<IconButton size="small" aria-label="Cancelar dibujo" onClick={cancelDraft}><X size={17}/></IconButton></div>}
          <div className={`map-and-panel ${!selected || draftMode ? 'no-panel' : ''}`}><div className="map-column"><AtlasMap ref={map} atlas={atlas} parcels={visibleParcels} selected={selected} mode={mode} year={year} keyDate={key} filters={filters} settings={layers} onBaseChange={() => setLayers(l => ({ ...l, base: l.base === "satellite" ? "streets" : "satellite" }))} onSelect={id => chooseParcel(id)} onDraft={setDraft}/>{visibleParcels.length === 0 && <div className="map-no-results"><Filter size={20}/><b>No hay parcelas con estos filtros.</b><Button size="small" onClick={clearFilters}>Limpiar filtros</Button></div>}<MonthPills year={year} month={month} onChange={setMonth} annual={mode === 'alphaearth'}/></div>{selected && !draftMode && <ParcelPanel parcel={selected} atlas={atlas} year={year} month={month} sensor={mode === "ndvi" ? "Landsat C2" : "Sentinel-2"} onClose={() => setSelectedId(null)} onLocate={() => map.current?.fitParcel(selected)} onEdit={startEdit} onAnalyze={() => setAnalysis(selected)} onTechnical={() => navigate('technical')} onNext={direction => { const index = parcels.findIndex(p => p.properties.id === selectedId); chooseParcel(parcels[(index + direction + parcels.length) % parcels.length].properties.id, true); }}/>}</div>
          {draftMode && <div className="draft-save-bar"><TextField size="small" label="Nombre de la parcela" value={fieldName} disabled={draftMode === 'edit'} onChange={e => setFieldName(e.target.value)} inputProps={{ maxLength: 80 }}/><span>{draft ? `${fmt(polygonArea(draft))} ha · límites definidos` : 'Aún no has cerrado el polígono'}</span><Button onClick={cancelDraft}>Cancelar</Button><Button variant="contained" startIcon={<Check size={16}/>} disabled={!draft || saving} onClick={() => void saveDraft()}>{saving ? 'Guardando…' : draftMode === 'edit' ? 'Guardar límites' : 'Guardar parcela'}</Button></div>}
          </section><div className="map-below-row"><span><ShieldCheck size={14}/>Datos originales del Reto AgroCebada 2026</span><button onClick={() => navigate('sources')}>Conocer las fuentes <ArrowUpRight size={13}/></button><span className="model-status"><span/>Modelo pendiente · valores de ejemplo</span></div>
          {technical && <div className="technical-entry"><ChartNoAxesCombined size={23}/><div><b>Una mirada técnica al mismo territorio.</b><span>Explora curvas de NDVI, clima y las 64 dimensiones de AlphaEarth.</span></div><Button onClick={() => navigate('technical')} endIcon={<ArrowRight size={15}/>}>Abrir análisis técnico</Button></div>}
        </>}
        {view === 'technical' && <><MonthPills year={year} month={month} onChange={setMonth}/><TechnicalPage atlas={atlas} parcels={parcels} selected={selected} year={year} month={month} onSelect={id => setSelectedId(id)} onMap={() => { navigate('map'); if (selected) setTimeout(() => map.current?.fitParcel(selected), 80); }}/></>}
        {view === 'parcels' && <ParcelsPage parcels={parcels} atlas={atlas} workspace={workspace} keyDate={key} onSelect={chooseFromTable} onAnalyze={setAnalysis}/>}
        {view === 'models' && <ModelsPage/>}
        {view === 'sources' && <SourcesPage atlas={atlas}/>}
        {view === 'admin' && <AdminPage currentUser={user}/>}
        <footer className="app-footer"><span>AgroCebada <b>/</b> FIRA 2026</span><span>{IS_DEMO ? 'Demo: los cambios se pierden al recargar la página.' : 'El territorio detrás de cada parcela.'}</span></footer>
      </main>
    </div>
    <Popover open={!!layerAnchor} anchorEl={layerAnchor} onClose={() => setLayerAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} slotProps={{ paper: { className: 'layers-popover' } }}><div className="layers-popover-heading"><h3><Layers3 size={17}/>Capas del mapa</h3><IconButton aria-label="Cerrar capas" size="small" onClick={() => setLayerAnchor(null)}><X size={17}/></IconButton></div><span className="nav-section">CLIMA · {MONTH_NAMES[month].toUpperCase()} {year}</span>{([['precipitation', 'Precipitación', 'CHIRPS · mm/mes', Droplets], ['tmax', 'Temperatura máxima', 'CHIRTS-ERA5 · °C', ThermometerSun], ['tmin', 'Temperatura mínima', 'CHIRTS-ERA5 · °C', ThermometerSun], ['elevation', 'Elevación', 'INEGI · m s.n.m. · 120 m', Mountain], ['slope', 'Pendiente', 'INEGI · grados · 120 m', Mountain]] as [keyof LayerSettings, string, string, LucideIcon][]).map(([k, label, desc, Icon]) => <label className="layer-toggle" key={k}><Icon size={17}/><span><b>{label}</b><small>{desc}</small></span><Switch size="small" checked={!!layers[k]} onChange={(_, checked) => setLayers(l => ({ ...l, [k]: checked }))} inputProps={{ 'aria-label': `Capa ${label}` }}/></label>)}<span className="nav-section">REFERENCIAS</span><FormControlLabel control={<Checkbox size="small" checked={layers.municipalities} onChange={(_, v) => setLayers(l => ({ ...l, municipalities: v }))}/>} label="Municipios INEGI"/><FormControlLabel control={<Checkbox size="small" checked={layers.states} onChange={(_, v) => setLayers(l => ({ ...l, states: v }))}/>} label="Límites estatales"/><div className="opacity-control"><span>Opacidad de las capas <b>{Math.round(layers.opacity * 100)}%</b></span><Slider size="small" min={.1} max={1} step={.05} value={layers.opacity} onChange={(_, v) => setLayers(l => ({ ...l, opacity: v as number }))} aria-label="Opacidad de capas"/></div><div className="basemap-choices"><Button size="small" variant={layers.base === 'satellite' ? 'contained' : 'outlined'} onClick={() => setLayers(l => ({ ...l, base: 'satellite' }))}>Satélite</Button><Button size="small" variant={layers.base === 'streets' ? 'contained' : 'outlined'} onClick={() => setLayers(l => ({ ...l, base: 'streets' }))}>Calles</Button></div></Popover>
    <Menu anchorEl={profileAnchor} open={!!profileAnchor} onClose={() => setProfileAnchor(null)}><div className="profile-menu-info"><b>{user.username}</b><span>{user.name}</span><small>Rol: administrador</small></div><MenuItem onClick={() => { navigate('admin'); setProfileAnchor(null); }}><Users size={16}/>Administración</MenuItem><MenuItem onClick={() => void logout()}><LogOut size={16}/>Cerrar sesión</MenuItem></Menu>
    {analysis && <AnalysisDialog key={analysis.properties.id} parcel={analysis} onClose={() => setAnalysis(null)} onSaved={result => setWorkspace(w => ({ ...w, analyses: [result, ...w.analyses] }))}/>}
    <Snackbar open={!!toast} autoHideDuration={6000} onClose={() => setToast('')} message={toast} action={<IconButton color="inherit" size="small" aria-label="Cerrar aviso" onClick={() => setToast('')}><X size={17}/></IconButton>}/>
  </div>;
}

function NavItem({ view, current, navigate, count }: { view: View; current: View; navigate: (view: View) => void; count?: number }) { const item = VIEWS[view]; return <button className={`nav-item ${current === view ? 'active' : ''}`} onClick={() => navigate(view)} aria-current={current === view ? 'page' : undefined}><item.icon size={18}/><span>{item.label}</span>{count != null && <small>{count}</small>}{current === view && <span className="nav-active-dot"/>}</button>; }

function MonthPills({ year, month, onChange, annual = false }: { year: number; month: number; onChange: (month: number) => void; annual?: boolean }) { return <div className={`month-bar ${annual ? 'annual' : ''}`}><div className="month-bar-title"><span>{annual ? 'PERIODO ANUAL' : 'PERIODO DEL MAPA'}</span><b>{year}</b></div><div className="month-pills" aria-label="Mes del mapa">{MONTHS.map((m, i) => <button key={m} className={!annual && month === i ? 'active' : ''} disabled={annual} aria-pressed={!annual && month === i} aria-label={`${MONTH_NAMES[i]} ${year}`} onClick={() => onChange(i)}>{m}</button>)}</div><span className="month-bar-end">{annual ? 'Ene — Dic' : 'Mensual'}<span className="live-dot"/></span></div>; }
