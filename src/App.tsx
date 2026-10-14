import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Drawer, MenuItem, Select, Slider, Snackbar, TextField } from '@mui/material';
import { ChartNoAxesCombined, ChevronDown, ChevronUp, Download, FileJson, FileSpreadsheet, ImageDown, Map as MapIcon, PencilRuler, PenLine, Plus, Ruler, Search, SlidersHorizontal, SquareDashed, WandSparkles, X } from 'lucide-react';
import AtlasMap from './AtlasMap';
import type { MapHandle, MeasureKind } from './AtlasMap';
import Login from './Login';
import ParcelPanel from './ParcelPanel';
import AnalysisDialog from './AnalysisDialog';
import TechnicalPage from './TechnicalPage';
import { ModelsPage, ParcelsPage, SourcesPage } from './OtherPages';
import AdminPage from './AdminPage';
import MapSetup, { createSetupTasks } from './MapSetup';
import type { SetupTaskId } from './MapSetup';
import { LoadingDots, LoadingState, LoadingValue } from './AgentProgress';
import { Logo } from './Logo';
import PagePlaceholder from './Placeholders';
import AppHeader from './AppHeader';
import NavMenu, { MapRail, PANELS, RailTip } from './ActionRail';
import type { MapPanel } from './ActionRail';
import { BasemapPanel, BookmarksPanel, FiltersPanel, LayersPanel, MODES, ParcelListPanel } from './MapPanels';
import TimeSlider from './TimeSlider';
import MapSlider from './MapSlider';
import { IconButton } from './IconButton';
import { ToolbarLayoutProvider } from './Toolbar';
import type { AgentStep } from './AgentProgress';
import { api, dateKey, download, filterParcels, fmt, mergedParcels, MONTH_NAMES, normalize, parcelCsv, parseCoordinates, polygonArea } from './lib';
import type { Analysis, Atlas, Field, Geometry, ImageryManifest, LayerSettings, MapFilters, MapMode, Override, Parcel, SegmentationPrompt, SegmentationProposal, User, View, Workspace } from './types';
import './pages.css';

const EMPTY_WORKSPACE: Workspace = { analyses: [], overrides: {}, fields: [] };
const EMPTY_FILTERS: MapFilters = { query: '', state: 'all', group: 'all', ndviEnabled: true, ndviThreshold: -1, onlyNdvi: false };
const DEFAULT_LAYERS: LayerSettings = { precipitation: false, tmin: false, tmax: false, elevation: false, slope: false, municipalities: false, states: true, opacity: .8, base: 'topo', waterThreshold: 0, waterOpacity: .75 };
const PAGE_LEDES: Record<View, string> = { map: '', parcels: 'Tus parcelas, rendimientos registrados y análisis guardados.', technical: 'Series mensuales y anuales de una parcela.', models: 'Dónde se integrará el modelo de rendimiento y cómo se evaluará.', sources: 'Fuentes, periodos y alcance de la información del atlas.', admin: 'Cuentas, funciones y asignación de parcelas.' };
const shortcutKey = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';
const VIEWS: Record<View, string> = { map: 'Mapa', parcels: 'Mis parcelas', technical: 'Análisis técnico', models: 'Modelo de ejemplo', sources: 'Datos y fuentes', admin: 'Administración' };
type SetupProgress = (id: SetupTaskId, update: Partial<AgentStep>) => void;
async function loadAtlas(progress: SetupProgress): Promise<Atlas> {
  async function data<T>(file: string, id: SetupTaskId, result: (value: T) => string): Promise<T> {
    try {
      const response = await fetch('/data/' + file);
      if (!response.ok) throw new Error('No pudimos cargar esta fuente del atlas.');
      const value = await response.json() as T;
      progress(id, { status: 'success', completedAt: performance.now(), result: result(value) });
      return value;
    } catch (error) {
      progress(id, { status: 'error', completedAt: performance.now(), detail: 'No se pudo cargar. Puedes volver a intentar.' });
      throw error;
    }
  }
  const [parcels, details, rasters, landsat, provenance] = await Promise.all([
    data<Atlas['parcels']>('parcels.geojson', 'parcels', value => `${value.features.length} límites de parcela disponibles`),
    data<Atlas['details']>('parcel-data.json', 'details', value => `${Object.keys(value).length} parcelas con datos históricos`),
    data<Atlas['rasters']>('layers.json', 'layers', () => 'Precipitación, temperatura, elevación y pendiente'),
    data<Atlas['landsat']>('landsat.json', 'landsat', value => `${Object.keys(value).length} meses de observaciones`),
    data<Atlas['provenance']>('provenance.json', 'provenance', () => 'Fuentes y procedencia disponibles'),
  ]);
  return { parcels, details, rasters, landsat, provenance };
}
export default function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [atlas, setAtlas] = useState<Atlas | null>(null), [workspace, setWorkspace] = useState<Workspace>(EMPTY_WORKSPACE);
  const [loadError, setLoadError] = useState(''), [toast, setToast] = useState('');
  const [setupTasks, setSetupTasks] = useState(() => createSetupTasks()), [setupVisible, setSetupVisible] = useState(true);
  const setupRevision = useRef(0);
  const [view, setView] = useState<View>(() => { const route = window.location.hash.replace('#/', '') as View; return route in VIEWS ? route : 'map'; });
  const [technical, setTechnical] = useState(false), [advanced, setAdvanced] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [year, setYear] = useState(2025), [month, setMonth] = useState(6), [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<MapMode>('parcels');
  const [filters, setFilters] = useState<MapFilters>(EMPTY_FILTERS), [layers, setLayers] = useState<LayerSettings>(DEFAULT_LAYERS);
  const [navOpen, setNavOpen] = useState(false);
  const [panel, setPanel] = useState<MapPanel | null>(() => window.innerWidth > 1100 ? 'layers' : null);
  const [sidePanel, setSidePanel] = useState<'export' | null>(null);
  const [measureKind, setMeasureKind] = useState<MeasureKind | null>(null), [measureValue, setMeasureValue] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [analysis, setAnalysis] = useState<Parcel | null>(null);
  const [draftMode, setDraftMode] = useState<'draw' | 'edit' | 'segment' | null>(null), [draft, setDraft] = useState<Geometry | null>(null), [fieldName, setFieldName] = useState('Mi parcela');
  const [saving, setSaving] = useState(false), [segmenting, setSegmenting] = useState(false), [segmentError, setSegmentError] = useState('');
  const [compactDelineation, setCompactDelineation] = useState(false);
  const [promptLabel, setPromptLabel] = useState<0 | 1>(1), [prompts, setPrompts] = useState<SegmentationPrompt[]>([]), [proposal, setProposal] = useState<SegmentationProposal | null>(null), [adjusting, setAdjusting] = useState(false);
  const [manifest, setManifest] = useState<ImageryManifest | null>(null), [imageryError, setImageryError] = useState('');
  const [imageryRevision, setImageryRevision] = useState(0);
  const [imageryBusy, setImageryBusy] = useState(false);
  const requestRevision = useRef(0), controller = useRef<AbortController | null>(null);
  const segmentationMonth = useRef('');
  const queuedPrompts = useRef<SegmentationPrompt[] | null>(null);
  const map = useRef<MapHandle>(null), key = dateKey(year, month);
  const searchInput = useRef<HTMLInputElement>(null);
  const temporal = !['parcels', 'terrain', 'alphaearth'].includes(mode) && !draftMode;
  const liveImagery = ['ndvi', 'water'].includes(mode) || draftMode === 'segment';

  useEffect(() => { void api<{ user: User | null }>('/api/auth/session').then(d => setUser(current => current === undefined ? d.user : current)).catch(() => setUser(current => current === undefined ? null : current)); }, []);
  const reloadWorkspace = useCallback(async () => { const w = await api<Workspace>('/api/workspace'); setWorkspace(w); return w; }, []);
  const reload = useCallback(() => {
    const revision = ++setupRevision.current;
    setLoadError(''); setSetupVisible(true); setSetupTasks(createSetupTasks(true));
    const progress: SetupProgress = (id, update) => { if (setupRevision.current === revision) setSetupTasks(tasks => ({ ...tasks, [id]: { ...tasks[id], ...update } })); };
    const assignments = api<Workspace>('/api/workspace').then(w => {
      progress('workspace', { status: 'success', completedAt: performance.now(), result: 'Permisos y parcelas de esta cuenta aplicados' });
      return w;
    }).catch(error => { progress('workspace', { status: 'error', completedAt: performance.now(), detail: 'No pudimos recuperar tus asignaciones.' }); throw error; });
    void Promise.all([loadAtlas(progress), assignments]).then(([a, w]) => {
      if (setupRevision.current !== revision) return;
      progress('map', { status: 'running', startedAt: performance.now() }); setWorkspace(w); setAtlas(a);
    }).catch(error => { if (setupRevision.current === revision) setLoadError(error.message); });
  }, []);
  const mapReady = useCallback(() => { if (setupTasks.map.status !== 'running') return; setSetupTasks(tasks => ({ ...tasks, map: { ...tasks.map, status: 'success', completedAt: performance.now() } })); setSetupVisible(false); }, [setupTasks.map.status]);
  useEffect(() => { if (user) reload(); }, [user, reload]);
  useEffect(() => { if (atlas && view !== 'map' && setupTasks.map.status === 'running') mapReady(); }, [atlas, view, setupTasks.map.status, mapReady]);
  useEffect(() => { const onRoute = () => { const route = window.location.hash.replace('#/', '') as View; if (route in VIEWS) setView(route); }; window.addEventListener('hashchange', onRoute); return () => window.removeEventListener('hashchange', onRoute); }, []);
  useEffect(() => { if (view === 'admin' && user && user.role !== 'admin') navigate('map'); }, [view, user]);
  useEffect(() => { if (!temporal || view !== 'map') setPlaying(false); }, [temporal, view]);
  useEffect(() => { if (!playing || !temporal || liveImagery && imageryBusy) return; const timer = window.setInterval(() => setMonth(m => m >= 9 || m < 3 ? 3 : m + 1), 2200); return () => clearInterval(timer); }, [playing, temporal, liveImagery, imageryBusy]);
  useEffect(() => {
    setManifest(null); setImageryError(''); setImageryBusy(false);
    if (!user || !liveImagery) return;
    setImageryBusy(true);
    const abort = new AbortController();
    api<ImageryManifest>(`/api/imagery/manifests/${key}`, { signal: abort.signal }).then(value => { if (!abort.signal.aborted) { setManifest(value); setImageryBusy(false); } }).catch(e => { if (!abort.signal.aborted) { setImageryError(e.message); setImageryBusy(false); setPlaying(false); } });
    return () => abort.abort();
  }, [key, liveImagery, user, imageryRevision]);
  useEffect(() => { if (draftMode === 'segment' && segmentationMonth.current !== key) cancelDraft(); }, [key]);
  useEffect(() => {
    const queued = queuedPrompts.current;
    if (!queued || draftMode !== 'segment') return;
    if (manifest) { queuedPrompts.current = null; void infer(queued); }
    else if (imageryError) { queuedPrompts.current = null; setSegmenting(false); setSegmentError(imageryError); }
  }, [manifest, imageryError, draftMode]);
  useEffect(() => () => { controller.current?.abort(); requestRevision.current++; }, []);
  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchInput.current?.focus(); searchInput.current?.select(); } };
    window.addEventListener('keydown', focusSearch); return () => window.removeEventListener('keydown', focusSearch);
  }, []);
  // Below 1600 px a details panel temporarily replaces the context panel instead of
  // squeezing the map; the context panel returns when the details close.
  const detailsOpen = !!(selectedId || draftMode || sidePanel);
  const parkedPanel = useRef<MapPanel | null>(null);
  useEffect(() => {
    if (detailsOpen && window.innerWidth < 1600) setPanel(current => { if (!current || current === 'parcels') return current; parkedPanel.current = current; return null; });
    if (!detailsOpen && parkedPanel.current) { setPanel(parkedPanel.current); parkedPanel.current = null; }
  }, [detailsOpen]);
  const parcels = useMemo(() => atlas ? mergedParcels(atlas, workspace) : [], [atlas, workspace]);
  const selected = useMemo(() => parcels.find(p => p.properties.id === selectedId) || null, [parcels, selectedId]);
  const visibleParcels = useMemo(() => atlas ? filterParcels(parcels, { ...filters, onlyNdvi: mode === 'landsat' && filters.onlyNdvi }, atlas, key) : [], [parcels, filters, atlas, key, mode]);

  function navigate(next: View) { if (next === 'admin' && user?.role !== 'admin') return; setView(next); window.location.hash = '/' + next; setNavOpen(false); setAdvanced(false); setPlaying(false); if (next !== 'map') cancelDraft(); }
  function switchMode(next: MapMode) { setMode(next); if (next !== 'alphaearth' && year < 2022) setYear(2025); setLayers(l => ({ ...l, precipitation: next === 'climate', tmin: false, tmax: false, elevation: next === 'terrain', slope: false })); }
  function chooseParcel(id: string, locate = false) { setSelectedId(id); if (locate) { const p = parcels.find(f => f.properties.id === id); if (p) setTimeout(() => map.current?.fitParcel(p), 40); } }
  async function search(event: React.FormEvent) {
    event.preventDefault(); const coords = parseCoordinates(filters.query);
    if (coords) { map.current?.locate(coords); setToast('Ubicación encontrada.'); return; }
    const found = visibleParcels;
    if (found.length && filters.query) { chooseParcel(found[0].properties.id, found.length === 1); if (found.length > 1) map.current?.fitAll(); return; }
    try {
      const d = await fetch('/data/municipios.geojson').then(r => r.json());
      const f = d.features.find((f: { properties: { nomgeo: string } }) => normalize(f.properties.nomgeo).includes(normalize(filters.query)));
      if (f && filters.query) { map.current?.fitGeometry(f.geometry); setToast(f.properties.nomgeo); } else setToast('No encontramos esa parcela o municipio.');
    } catch { setToast('No pudimos completar la búsqueda.'); }
  }
  function cancelDraft() { queuedPrompts.current = null; controller.current?.abort(); requestRevision.current++; map.current?.cancel(); setDraftMode(null); setDraft(null); setProposal(null); setPrompts([]); setSegmentError(''); setSegmenting(false); setAdjusting(false); }
  function startDraw() { cancelDraft(); stopMeasuring(); navigate('map'); setPlaying(false); setDraftMode('draw'); setCompactDelineation(false); setFieldName('Mi parcela'); setTimeout(() => map.current?.draw(), 50); }
  function startSegment() { cancelDraft(); stopMeasuring(); navigate('map'); setSelectedId(null); setPlaying(false); segmentationMonth.current = dateKey(year < 2022 ? 2025 : year, year < 2022 ? 6 : month); if (year < 2022) { setYear(2025); setMonth(6); } setDraftMode('segment'); setCompactDelineation(true); setFieldName('Mi parcela'); setPromptLabel(1); }
  function startEdit() { if (!selected) return; cancelDraft(); stopMeasuring(); setPlaying(false); setDraftMode('edit'); setCompactDelineation(false); setFieldName(selected.properties.name || selected.properties.id); map.current?.edit(selected); }
  async function infer(nextPrompts: SegmentationPrompt[]) {
    // A click that lands before this month's imagery manifest is kept and sent once it arrives.
    if (!manifest && !imageryError && nextPrompts.some(p => p.label === 1)) { queuedPrompts.current = nextPrompts; setPrompts(nextPrompts); setSegmenting(true); setSegmentError(''); return; }
    if (!manifest || !nextPrompts.some(p => p.label === 1)) { setSegmenting(false); setSegmentError(imageryError || 'Selecciona primero un punto dentro de tu terreno.'); return; }
    controller.current?.abort(); const abort = new AbortController(); controller.current = abort;
    const revision = ++requestRevision.current; setSegmenting(true); setSegmentError(''); setPrompts(nextPrompts);
    const timeout = window.setTimeout(() => abort.abort(), 90000);
    try {
      const result = await api<SegmentationProposal>('/api/segmentation/proposals', { method: 'POST', signal: abort.signal, body: JSON.stringify({ requestId: String(revision), imageryVersion: manifest.version, month: key, prompts: nextPrompts }) });
      if (requestRevision.current !== revision || abort.signal.aborted || result.requestId !== String(revision)) return;
      setProposal(result); setDraft(result.geometry); setCompactDelineation(false); map.current?.proposal(result.geometry);
    } catch (e) { if (requestRevision.current === revision) setSegmentError(abort.signal.aborted ? 'La solicitud tardó demasiado. Puedes volver a intentar.' : (e as Error).message); }
    finally { clearTimeout(timeout); if (requestRevision.current === revision) setSegmenting(false); }
  }
  async function saveDraft() {
    if (!draft) return; setSaving(true);
    try {
      if (draftMode === 'edit' && selected) {
        await api<Override>(`/api/parcels/${selected.properties.id}/geometry`, { method: 'PUT', body: JSON.stringify({ geometry: draft }) }); setToast('Límites guardados.');
      } else {
        const field = await api<Field>('/api/fields', { method: 'POST', body: JSON.stringify({ geometry: draft, name: fieldName, segmentation: proposal?.provenance }) }); setSelectedId(field.id); setToast('Parcela guardada. Confirma los límites en campo.');
      }
      await reloadWorkspace(); setFilters(EMPTY_FILTERS); cancelDraft();
    } catch (e) { setToast((e as Error).message); } finally { setSaving(false); }
  }
  function exportProposal() { if (!draft || !proposal) return; download('propuesta-parcela.geojson', JSON.stringify({ type: 'Feature', geometry: draft, properties: { ...proposal.provenance, correctedGeometry: draft, saved: false } }, null, 2), 'application/geo+json'); }
  async function logout() { await api('/api/auth/logout', { method: 'POST' }); setupRevision.current++; cancelDraft(); setUser(null); setAtlas(null); setNavOpen(false); setWorkspace(EMPTY_WORKSPACE); setSelectedId(null); navigate('map'); }
  async function switchUser(username: string) { try { const d = await api<{ user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password: 'Fira2026!' }) }); cancelDraft(); setSelectedId(null); setUser(d.user); setNavOpen(false); navigate('map'); } catch (e) { setToast((e as Error).message); } }
  function presentation(next: boolean) { setTechnical(next); setAdvanced(next); }
  function stopMeasuring() { if (measureKind) { setMeasureKind(null); setMeasureValue(null); map.current?.measure(null); } }
  function toggleMeasure(kind: MeasureKind | null) { const next = kind && kind !== measureKind ? kind : null; if (next) cancelDraft(); setMeasureKind(next); setMeasureValue(null); map.current?.measure(next); }
  function locateMe() {
    if (!navigator.geolocation) { setToast('Este navegador no permite obtener tu ubicación.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(position => { setLocating(false); map.current?.showLocation([position.coords.longitude, position.coords.latitude]); setToast('Ubicación encontrada.'); }, () => { setLocating(false); setToast('No pudimos obtener tu ubicación.'); }, { enableHighAccuracy: true, timeout: 10000 });
  }
  async function exportMap() { const blob = await map.current?.exportPng(); if (!blob) { setToast('No pudimos exportar la imagen del mapa.'); return; } const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `agrocebada-mapa-${key}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }

  if (!user) return <Login checkingSession={user === undefined} onLogin={u => { setUser(u); setLoadError(''); }}/>;
  if (!atlas && view === 'map') return <main className="map-setup-screen"><div className="map-setup-brand"><Logo size={28}/></div><MapSetup tasks={setupTasks} error={loadError} onRetry={reload}/></main>;
  const periodLabel = mode === 'alphaearth' ? `Anual ${year}` : mode === 'parcels' ? 'Ciclo 2025' : mode === 'terrain' ? 'Capa estática' : `${MONTH_NAMES[month]} ${year}`;
  const activeMode = MODES.find(m => m.key === mode);
  const filtered = filters.state !== 'all' || filters.group !== 'all';
  const rightPanel = draftMode ? 'draft' : sidePanel === 'export' ? 'export' : selected ? 'parcel' : null;
  const showTime = temporal || (mode === 'alphaearth' && !draftMode);
  const panelTitle = (key: MapPanel) => PANELS.find(p => p.key === key)!.label;
  return <ToolbarLayoutProvider><div className={`atlas-shell ${view === 'map' ? 'map-route' : 'page-route'}`} data-role={user.role}>
    <AppHeader title={view === 'map' ? 'Atlas territorial' : VIEWS[view]} user={user} technical={technical} onMenu={() => setNavOpen(true)} onHome={() => navigate('map')} onPresentation={presentation} onSwitchUser={username => void switchUser(username)} onLogout={() => void logout()}/>
    <NavMenu user={user} view={view} views={VIEWS} parcelCount={parcels.length} loading={!atlas || setupVisible} technical={technical} open={navOpen} onClose={() => setNavOpen(false)} onNavigate={navigate} onPresentation={presentation}/>
    {view === 'map' && atlas ? <main className="full-map workspace" aria-label="Atlas territorial" data-left={panel || undefined} data-right={rightPanel || undefined}>
      <MapRail panel={panel} filtered={filtered} onPanel={next => { parkedPanel.current = null; setPanel(current => current === next ? null : next); }}/>
      {panel && <section className="context-panel" aria-labelledby="context-panel-title">
        <header className="context-panel-head"><h2 id="context-panel-title">{panelTitle(panel)}</h2><IconButton label="Cerrar panel" size="sm" onClick={() => setPanel(null)}><X size={16}/></IconButton></header>
        <div className="context-panel-body">
          {panel === 'layers' && <LayersPanel mode={mode} technical={technical} settings={layers} year={year} onMode={switchMode} onOpacity={opacity => setLayers(l => ({ ...l, opacity }))}/>}
          {panel === 'basemap' && <BasemapPanel settings={layers} onBase={base => setLayers(l => ({ ...l, base }))} onOverlay={(overlay, visible) => setLayers(l => ({ ...l, [overlay]: visible }))}/>}
          {panel === 'parcels' && <ParcelListPanel parcels={visibleParcels} atlas={atlas} keyDate={key} selectedId={selectedId} onSelect={id => chooseParcel(id, true)}/>}
          {panel === 'filters' && <FiltersPanel state={filters.state} group={filters.group} count={visibleParcels.length} total={parcels.length} onChange={next => setFilters(f => ({ ...f, ...next }))} onReset={() => setFilters(f => ({ ...f, state: 'all', group: 'all' }))}/>}
          {panel === 'bookmarks' && <BookmarksPanel parcels={parcels} onAll={() => map.current?.fitAll()} onFit={bounds => map.current?.fitBounds(bounds)}/>}
        </div>
      </section>}
      <div className="map-stage">
        <div className="map-top-left">
          <form className="floating-search" role="search" onSubmit={search}>
            <Search size={16} strokeWidth={1.7}/>
            <input ref={searchInput} aria-label="Buscar municipio, ID o coordenadas" placeholder="Buscar parcela o lugar" value={filters.query} onChange={e => setFilters(f => ({ ...f, query: e.target.value }))}/>
            {filters.query && <button className="clear-search" type="button" aria-label="Limpiar búsqueda" onClick={() => setFilters(f => ({ ...f, query: '' }))}><X size={14}/></button>}
            <button className="search-submit" type="submit" aria-label="Buscar" title="Buscar · Enter"><kbd className="ui-kbd">{shortcutKey} K</kbd></button>
          </form>
          {liveImagery && (imageryError || !manifest || imageryBusy) && <div className={`imagery-caption ${imageryError ? 'unavailable' : ''}`} role={manifest || imageryError ? 'status' : undefined}>
            {imageryError ? <><span>{imageryError}</span><button className="ui-btn ui-btn-outline ui-btn-sm" onClick={() => setImageryRevision(v => v + 1)}>Reintentar servicio</button></>
              : <LoadingState label={manifest ? 'Preparando imágenes Sentinel-2…' : 'Cargando observaciones Sentinel-2…'}/>}
          </div>}
          {measureKind && <div className="measure-readout" role="status"><Ruler size={14}/><span>{measureKind === 'area' ? 'Área' : 'Distancia'}</span><b>{measureValue ?? 'Haz clic en el mapa'}</b><button type="button" className="text-button" onClick={() => toggleMeasure(null)}>Terminar</button></div>}
        </div>
        <AtlasMap ref={map} atlas={atlas} parcels={visibleParcels} selected={selected} mode={mode} year={year} keyDate={key} filters={filters} settings={layers} manifest={manifest} imageryVisible={draftMode === 'segment'} onReady={mapReady} onImageryBusy={setImageryBusy} onImageryFailure={() => setPlaying(false)} onMeasure={setMeasureValue} onLocate={locateMe} locating={locating} onSelect={id => { setSidePanel(null); chooseParcel(id); }} onDraft={setDraft} onCancel={() => { cancelDraft(); setMeasureKind(null); }} onMapClick={draftMode === 'segment' && !adjusting ? coords => { if (!segmenting) void infer([...prompts, { coordinates: coords, label: promptLabel }]); } : undefined}/>
        {setupVisible && <div className="map-setup-overlay"><MapSetup tasks={setupTasks} error={loadError} onRetry={reload}/></div>}
        {showTime && <TimeSlider mode={mode} year={year} month={month} keyDate={key} playing={playing} onPlay={setPlaying} onMonth={setMonth} onYear={setYear} onDate={(y, m) => { setYear(y); setMonth(m); }}/>}
      </div>
      {rightPanel === 'parcel' && selected && <ParcelPanel parcel={selected} atlas={atlas} year={year} month={month} sensor={mode === 'landsat' ? 'Landsat C2' : 'Sentinel-2'} onClose={() => setSelectedId(null)} onLocate={() => map.current?.fitParcel(selected)} onEdit={startEdit} onAnalyze={() => setAnalysis(selected)} onTechnical={() => navigate('technical')} onNext={direction => { const index = visibleParcels.findIndex(p => p.properties.id === selectedId); if (visibleParcels.length) chooseParcel(visibleParcels[(index + direction + visibleParcels.length) % visibleParcels.length].properties.id, true); }}/>}
      {rightPanel === 'export' && <aside className="side-panel export-panel" aria-label="Exportar">
        <header className="side-panel-head"><div className="side-panel-title"><h2>Exportar</h2></div><div className="side-panel-nav"><IconButton label="Cerrar exportación" size="sm" onClick={() => setSidePanel(null)}><X size={16}/></IconButton></div></header>
        <div className="side-panel-body"><p className="side-panel-lede">{visibleParcels.length} {visibleParcels.length === 1 ? 'parcela visible' : 'parcelas visibles'} · {activeMode?.label} · {periodLabel}</p><ul className="export-list">
          <li><button type="button" onClick={() => void exportMap()}><span className="export-icon"><ImageDown size={18}/></span><span><b>Imagen del mapa</b><small>PNG de la vista actual</small></span></button></li>
          <li><button type="button" onClick={() => download('parcelas.geojson', JSON.stringify({ type: 'FeatureCollection', features: visibleParcels }), 'application/geo+json')}><span className="export-icon"><FileJson size={18}/></span><span><b>Parcelas · GeoJSON</b><small>Límites y atributos para SIG</small></span></button></li>
          <li><button type="button" onClick={() => download('parcelas.csv', parcelCsv(visibleParcels, atlas, key), 'text/csv')}><span className="export-icon"><FileSpreadsheet size={18}/></span><span><b>Parcelas · CSV</b><small>Tabla para hojas de cálculo</small></span></button></li>
        </ul></div>
      </aside>}
      {draftMode && <section className={`side-panel delineation-card ${compactDelineation ? 'compact' : ''}`} aria-label="Delimitación de parcela">
        <header className="side-panel-head delineation-heading">
          <div className="side-panel-title"><h2>{draftMode === 'segment' ? 'Delimita tu terreno' : draftMode === 'edit' ? 'Corrige los límites' : 'Dibuja tu parcela'}</h2></div>
          <div className="side-panel-nav">
            <IconButton className="delineation-collapse" size="sm" label={compactDelineation ? 'Expandir controles de delimitación' : 'Contraer controles de delimitación'} onClick={() => setCompactDelineation(!compactDelineation)}>{compactDelineation ? <ChevronDown size={15}/> : <ChevronUp size={15}/>}</IconButton>
            <span className="ui-separator"/>
            <IconButton label="Cancelar delimitación" size="sm" onClick={cancelDraft}><X size={16}/></IconButton>
          </div>
        </header>
        <div className="side-panel-body delineation-body">
          <p className="side-panel-lede">{draftMode === 'segment' ? 'Delimitación automática · SAM 2.1 sobre Sentinel-2 RGB' : draftMode === 'edit' ? 'Edición de límites' : 'Dibujo manual'}</p>
          <p className="delineation-help">{draftMode === 'segment' ? 'Haz clic dentro del terreno. Añade puntos para incluir o excluir áreas y revisa la propuesta antes de guardarla.' : 'Ajusta los vértices. Al dibujar, un doble clic cierra el polígono.'}</p>
          {draftMode === 'segment' && <>
            <div className="prompt-buttons" role="group" aria-label="Tipo de punto"><button aria-pressed={promptLabel === 1 && !adjusting} onClick={() => { setAdjusting(false); map.current?.proposal(draft); setPromptLabel(1); }}><i className="prompt-dot include"/>+ Incluir</button><button aria-pressed={promptLabel === 0 && !adjusting} onClick={() => { setAdjusting(false); map.current?.proposal(draft); setPromptLabel(0); }}><i className="prompt-dot exclude"/>− Excluir</button></div>
            <p className="delineation-meta">{MONTH_NAMES[month]} {year} · límites aproximados de 10 m · {prompts.length} {prompts.length === 1 ? 'punto' : 'puntos'}</p>
            {segmenting && <div className="delineation-progress"><LoadingState label="Buscando límites de la parcela…"/></div>}
            {segmentError && <Alert severity="warning">{segmentError}</Alert>}
            {proposal?.warnings.map(w => <p className="proposal-warning" key={w}>{w}</p>)}
            <div className="delineation-secondary"><Button variant="outlined" disabled={segmenting || !prompts.length} onClick={() => void infer(prompts)}>Reintentar</Button><Button variant="outlined" disabled={!draft || segmenting} onClick={() => { setAdjusting(true); setCompactDelineation(true); map.current?.editDraft(draft!); }}>Ajustar vértices</Button><Button className="manual-fallback" onClick={startDraw} startIcon={<PencilRuler size={14}/>}>Dibujar manualmente</Button></div>
          </>}
          {draftMode === 'draw' && <div className="delineation-secondary"><Button variant="outlined" onClick={() => map.current?.undo()}>Deshacer punto</Button><Button variant="outlined" onClick={() => map.current?.finish()}>Cerrar polígono</Button></div>}
          <div className="draft-area"><span>Superficie</span>{draft ? <b className="pixel">{fmt(polygonArea(draft))}<small>ha</small></b> : segmenting ? <LoadingValue label="Calculando superficie de la propuesta" unit="ha"/> : <b className="pixel muted">—<small>ha</small></b>}</div>
          {draftMode !== 'edit' && <TextField label="Nombre de la parcela" size="small" fullWidth value={fieldName} onChange={e => setFieldName(e.target.value)}/>}
        </div>
        <footer className="side-panel-foot delineation-footer"><Button variant="outlined" onClick={cancelDraft}>Cancelar</Button>{proposal && <IconButton label="Exportar propuesta y correcciones" disabled={!draft} onClick={exportProposal}><Download size={16}/></IconButton>}<Button variant="contained" disabled={!draft || saving || segmenting} onClick={() => void saveDraft()}>{saving ? <><LoadingDots/>Guardando…</> : draftMode === 'edit' ? 'Guardar límites' : 'Guardar parcela'}</Button></footer>
      </section>}
      <div className="tool-rail" role="toolbar" aria-label="Herramientas del mapa" aria-orientation="vertical">
        <RailTip label="Analizar mi terreno" side="left"><button type="button" className="rail-item" aria-label="Analizar mi terreno" aria-pressed={draftMode === 'segment'} onClick={startSegment}><WandSparkles size={20} strokeWidth={1.5}/></button></RailTip>
        <RailTip label="Dibujar parcela" side="left"><button type="button" className="rail-item" aria-label="Dibujar parcela" aria-pressed={draftMode === 'draw'} onClick={startDraw}><PenLine size={20} strokeWidth={1.5}/></button></RailTip>
        <span className="rail-separator rail-optional"/>
        <RailTip label="Medir distancia" side="left"><button type="button" className="rail-item rail-optional" aria-label="Medir distancia" aria-pressed={measureKind === 'distance'} onClick={() => toggleMeasure('distance')}><Ruler size={20} strokeWidth={1.5}/></button></RailTip>
        <RailTip label="Medir área" side="left"><button type="button" className="rail-item rail-optional" aria-label="Medir área" aria-pressed={measureKind === 'area'} onClick={() => toggleMeasure('area')}><SquareDashed size={20} strokeWidth={1.5}/></button></RailTip>
        <span className="rail-separator"/>
        <RailTip label="Exportar" side="left"><button type="button" className="rail-item" aria-label="Exportar" aria-pressed={sidePanel === 'export'} onClick={() => setSidePanel(p => p === 'export' ? null : 'export')}><Download size={20} strokeWidth={1.5}/></button></RailTip>
        {technical && <RailTip label="Análisis Pro" side="left"><button type="button" className="rail-item" aria-label="Controles avanzados" aria-expanded={advanced} onClick={() => setAdvanced(!advanced)}><SlidersHorizontal size={20} strokeWidth={1.5}/></button></RailTip>}
      </div>
    </main> : <main className="atlas-page"><div className="atlas-page-heading"><div><h1>{VIEWS[view]}</h1><p>{PAGE_LEDES[view]}</p></div><div className="atlas-page-heading-actions">{view === 'technical' && selected && <Select size="small" value={year} onChange={e => setYear(Number(e.target.value))} inputProps={{ 'aria-label': 'Año del análisis' }}>{[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}</Select>}{view === 'parcels' && atlas && !setupVisible && <Button onClick={startDraw} variant="contained" startIcon={<Plus size={15}/>}>Nueva parcela</Button>}<Button variant="outlined" onClick={() => navigate('map')} startIcon={<MapIcon size={15}/>}>Volver al mapa</Button></div></div>
      {!atlas || setupVisible ? <PagePlaceholder view={view} error={loadError} onRetry={reload}/> : <>
      {view === 'parcels' && <ParcelsPage parcels={parcels} atlas={atlas} workspace={workspace} keyDate={key} onSelect={id => { navigate('map'); chooseParcel(id, true); }} onAnalyze={setAnalysis}/>}
      {view === 'technical' && <>{selected ? <TechnicalPage atlas={atlas} parcels={parcels} selected={selected} year={year} month={month} onSelect={setSelectedId} onMap={() => navigate('map')}/> : <section className="empty-panel technical-empty" aria-labelledby="technical-empty-title"><ChartNoAxesCombined size={28} strokeWidth={1.4}/><h2 id="technical-empty-title">Selecciona una parcela</h2><p>Consulta su vegetación, clima, relieve y embeddings AlphaEarth a lo largo del año.</p><Select size="small" value="" displayEmpty onChange={e => setSelectedId(e.target.value)} inputProps={{ 'aria-label': 'Parcela del análisis' }}><MenuItem value="">Elige una parcela</MenuItem>{parcels.map(p => <MenuItem key={p.properties.id} value={p.properties.id}>{p.properties.name || p.properties.id}</MenuItem>)}</Select></section>}</>}
      {view === 'models' && <ModelsPage/>}{view === 'sources' && <SourcesPage atlas={atlas}/>}{view === 'admin' && user.role === 'admin' && <AdminPage currentUser={user} parcels={parcels} workspace={workspace} onChanged={reloadWorkspace}/>}
      </>}
    </main>}
    {atlas && <Drawer anchor="right" open={advanced && technical} onClose={() => setAdvanced(false)} slotProps={{ paper: { className: 'advanced-side-panel', role: 'dialog', 'aria-labelledby': 'advanced-title', 'aria-modal': true } }}><div className="advanced-dialog">
      <div className="dialog-heading"><div><span className="kicker">Presentación técnica</span><h2 id="advanced-title">Análisis Pro</h2></div><IconButton label="Cerrar controles avanzados" onClick={() => setAdvanced(false)}><X size={17}/></IconButton></div>
      <p className="advanced-lede">Umbrales, capas históricas y procedencia.</p>
      <section className="advanced-section"><h3>Umbrales</h3>
        <label className="advanced-field"><span>Umbral NDVI</span><input className="ui-input" aria-label="Valor del umbral NDVI" type="number" step="0.05" min="-1" max="1" value={filters.ndviThreshold} onChange={e => setFilters(f => ({ ...f, ndviThreshold: Math.max(-1, Math.min(1, Number(e.target.value))) }))}/></label>
        <div className="water-index-control"><MapSlider label="Umbral de agua MNDWI" value={layers.waterThreshold ?? 0} min={-1} max={1} step={.05} largeStep={.25} formatValue={value => value.toFixed(2)} onValueChange={value => setLayers(l => ({ ...l, waterThreshold: value }))}/></div>
        <label className="advanced-field"><span>Opacidad de agua <b>{Math.round((layers.waterOpacity || 0) * 100)}%</b></span><Slider aria-label="Opacidad del agua" value={layers.waterOpacity || 0} min={0} max={1} step={.05} onChange={(_, v) => setLayers(l => ({ ...l, waterOpacity: v as number }))}/></label>
      </section>
      <section className="advanced-section"><h3>Capas históricas</h3>
        <div className="advanced-layers"><Button variant={mode === 'alphaearth' ? 'contained' : 'outlined'} onClick={() => { switchMode('alphaearth'); setAdvanced(false); }}>AlphaEarth</Button><Button variant={mode === 'landsat' ? 'contained' : 'outlined'} onClick={() => { switchMode('landsat'); setAdvanced(false); }}>NDVI · Landsat C2</Button></div>
        <label className="advanced-check"><input type="checkbox" aria-label="Filtrar también parcelas" checked={filters.onlyNdvi} disabled={mode !== 'landsat'} onChange={e => setFilters(f => ({ ...f, onlyNdvi: e.target.checked }))}/><span>Filtrar también parcelas · Landsat C2</span></label>
      </section>
      <section className="advanced-section"><h3>Clima y relieve</h3>
        {(['precipitation', 'tmin', 'tmax', 'elevation', 'slope'] as const).map((layer, i) => <label className="advanced-check" key={layer}><input type="checkbox" checked={layers[layer]} onChange={e => setLayers(l => ({ ...l, [layer]: e.target.checked }))}/><span>{['Precipitación', 'Temperatura mínima', 'Temperatura máxima', 'Elevación', 'Pendiente'][i]}</span></label>)}
      </section>
      <section className="advanced-section"><h3>Exportar y procedencia</h3>
        <div className="advanced-actions"><Button variant="outlined" onClick={() => download('parcelas.geojson', JSON.stringify({ type: 'FeatureCollection', features: visibleParcels }), 'application/geo+json')} startIcon={<Download size={15}/>}>Exportar GeoJSON</Button><Button variant="outlined" onClick={() => download('parcelas.csv', parcelCsv(visibleParcels, atlas, key), 'text/csv')} startIcon={<Download size={15}/>}>Exportar CSV</Button></div>
        {manifest && <><p className="advanced-note mono">{manifest.scenes.length} escenas · {manifest.tiles.length} teselas · {manifest.source}</p><Button variant="outlined" onClick={() => download(`sentinel-${key}.json`, JSON.stringify(manifest, null, 2), 'application/json')}>Descargar procedencia del mes</Button></>}
        <Button className="advanced-model-link" onClick={() => { setAdvanced(false); navigate('models'); }}>Rendimiento de ejemplo · 4.2 t/ha</Button>
      </section>
    </div></Drawer>}
    {analysis && <AnalysisDialog parcel={analysis} onClose={() => setAnalysis(null)} onSaved={(a: Analysis) => setWorkspace(w => ({ ...w, analyses: [a, ...w.analyses] }))}/>}
    <Snackbar open={!!toast} autoHideDuration={5000} onClose={() => setToast('')} message={toast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}/>
  </div></ToolbarLayoutProvider>;
}
