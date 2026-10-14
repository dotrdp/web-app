import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChartNoAxesCombined, ChevronDown, ChevronUp, Download, FileJson, FileSpreadsheet, ImageDown, Map as MapIcon, PencilRuler, PenLine, Plus, Ruler, Search, SlidersHorizontal, SquareDashed, TriangleAlert, WandSparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Field, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Kbd } from '@/components/ui/kbd';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Slider } from '@/components/ui/slider';
import { Toaster } from '@/components/ui/sonner';
import { Spinner } from '@/components/ui/spinner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import AtlasMap from './AtlasMap';
import type { MapHandle, MeasureKind } from './AtlasMap';
import Login from './Login';
import ParcelPanel from './ParcelPanel';
import AnalysisDialog from './AnalysisDialog';
import TechnicalPage from './TechnicalPage';
import { ModelsPage, ParcelsPage, SourcesPage } from './OtherPages';
import AdminPage from './AdminPage';
import MapSetup, { createSetupTasks, MapSetupScreen } from './MapSetup';
import type { SetupTaskId } from './MapSetup';
import { LoadingState, LoadingValue } from './AgentProgress';
import PagePlaceholder from './Placeholders';
import { floating, MapRail, PANELS, ToolButton, ToolRail } from './MapToolbar';
import type { MapPanel } from './MapToolbar';
import { BasemapPanel, BookmarksPanel, FiltersPanel, LayersPanel, MODES, ParcelListPanel } from './MapPanels';
import TimeSlider from './TimeSlider';
import type { AgentStep } from './AgentProgress';
import { api, dateKey, download, filterParcels, fmt, mergedParcels, MONTH_NAMES, normalize, parcelCsv, parseCoordinates, polygonArea } from './lib';
import type { Analysis, Atlas, Field as WorkspaceField, Geometry, ImageryManifest, LayerSettings, MapFilters, MapMode, Override, Parcel, SegmentationPrompt, SegmentationProposal, User, View, Workspace } from './types';
import './map.css';

/** Radix steps PageUp/PageDown by ten steps; the water index uses quarter steps. */
const pageStep = (size: number, apply: (delta: number) => void) => (e: React.KeyboardEvent) => { if (e.key !== 'PageUp' && e.key !== 'PageDown') return; e.preventDefault(); apply(e.key === 'PageUp' ? size : -size); };

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
  const [loadError, setLoadError] = useState('');
  const setToast = (message: string) => { if (message) toast(message); };
  const [dark, setDark] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  const [setupTasks, setSetupTasks] = useState(() => createSetupTasks()), [setupVisible, setSetupVisible] = useState(true);
  const setupRevision = useRef(0);
  const [view, setView] = useState<View>(() => { const route = window.location.hash.replace('#/', '') as View; return route in VIEWS ? route : 'map'; });
  const [technical, setTechnical] = useState(false), [advanced, setAdvanced] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [year, setYear] = useState(2025), [month, setMonth] = useState(6), [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<MapMode>('parcels');
  const [filters, setFilters] = useState<MapFilters>(EMPTY_FILTERS), [layers, setLayers] = useState<LayerSettings>(DEFAULT_LAYERS);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.location.hash.replace('#/', '') !== 'map' && window.location.hash.replace('#/', '') !== '' && window.innerWidth > 1024);
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

  function navigate(next: View) { if (next === 'admin' && user?.role !== 'admin') return; setView(next); window.location.hash = '/' + next; setSidebarOpen(next !== 'map' && window.innerWidth > 1024); setAdvanced(false); setPlaying(false); if (next !== 'map') cancelDraft(); }
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
        const field = await api<WorkspaceField>('/api/fields', { method: 'POST', body: JSON.stringify({ geometry: draft, name: fieldName, segmentation: proposal?.provenance }) }); setSelectedId(field.id); setToast('Parcela guardada. Confirma los límites en campo.');
      }
      await reloadWorkspace(); setFilters(EMPTY_FILTERS); cancelDraft();
    } catch (e) { setToast((e as Error).message); } finally { setSaving(false); }
  }
  function exportProposal() { if (!draft || !proposal) return; download('propuesta-parcela.geojson', JSON.stringify({ type: 'Feature', geometry: draft, properties: { ...proposal.provenance, correctedGeometry: draft, saved: false } }, null, 2), 'application/geo+json'); }
  async function logout() { await api('/api/auth/logout', { method: 'POST' }); setupRevision.current++; cancelDraft(); setUser(null); setAtlas(null); setSidebarOpen(false); setWorkspace(EMPTY_WORKSPACE); setSelectedId(null); navigate('map'); }
  async function switchUser(username: string) { try { const d = await api<{ user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password: 'Fira2026!' }) }); cancelDraft(); setSelectedId(null); setUser(d.user); setSidebarOpen(false); navigate('map'); } catch (e) { setToast((e as Error).message); } }
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
  if (!atlas && view === 'map') return <MapSetupScreen tasks={setupTasks} error={loadError} onRetry={reload}/>;
  const periodLabel = mode === 'alphaearth' ? `Anual ${year}` : mode === 'parcels' ? 'Ciclo 2025' : mode === 'terrain' ? 'Capa estática' : `${MONTH_NAMES[month]} ${year}`;
  const activeMode = MODES.find(m => m.key === mode);
  const filtered = filters.state !== 'all' || filters.group !== 'all';
  const rightPanel = draftMode ? 'draft' : sidePanel === 'export' ? 'export' : selected ? 'parcel' : null;
  const showTime = temporal || (mode === 'alphaearth' && !draftMode);
  const searchForm = <form role="search" onSubmit={search} className={isMobile ? 'pointer-events-auto' : 'w-72 lg:w-80'}>
          <InputGroup className={isMobile ? 'h-10 bg-background shadow-md' : 'h-8 bg-muted/40 shadow-none'}>
            <InputGroupAddon><Search/></InputGroupAddon>
            <InputGroupInput ref={searchInput} aria-label="Buscar municipio, ID o coordenadas" placeholder="Buscar parcela o lugar" value={filters.query} onChange={e => setFilters(f => ({ ...f, query: e.target.value }))}/>
            <InputGroupAddon align="inline-end">
              {filters.query && <InputGroupButton size="icon-xs" aria-label="Limpiar búsqueda" onClick={() => setFilters(f => ({ ...f, query: '' }))}><X/></InputGroupButton>}
              <InputGroupButton type="submit" size="xs" variant="ghost" aria-label="Buscar" className={isMobile ? 'hidden' : undefined}><Kbd>{shortcutKey}</Kbd><Kbd>K</Kbd></InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>;
  const panelTitle = (key: MapPanel) => PANELS.find(p => p.key === key)!.label;
  const headerActions = view === 'map' ? (isMobile ? null : searchForm) : <>
    {view === 'technical' && selected && <Select value={String(year)} onValueChange={value => setYear(Number(value))}><SelectTrigger size="sm" aria-label="Año del análisis" className="w-24"><SelectValue/></SelectTrigger><SelectContent>{[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent></Select>}
    {view === 'parcels' && atlas && !setupVisible && <Button size="sm" onClick={startDraw} aria-label="Nueva parcela"><Plus/><span className="max-sm:hidden">Nueva parcela</span></Button>}
    <Button size="sm" variant="outline" onClick={() => navigate('map')} aria-label="Volver al mapa"><MapIcon/><span className="max-sm:hidden">Volver al mapa</span></Button>
  </>;
  return <TooltipProvider delayDuration={300}>
  <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} className="atlas-shell h-svh overflow-hidden" data-role={user.role} style={{ '--sidebar-width': 'calc(var(--spacing) * 64)', '--header-height': 'calc(var(--spacing) * 12)' } as React.CSSProperties}>
    <AppSidebar variant="inset" collapsible="offcanvas" user={user} view={view} views={VIEWS} parcelCount={parcels.length} loading={!atlas || setupVisible} technical={technical} dark={dark}
      onNavigate={navigate} onAnalyze={startSegment} onPresentation={presentation} onSwitchUser={username => void switchUser(username)} onLogout={() => void logout()} onTheme={() => setDark(d => !d)}/>
    <SidebarInset className="min-h-0 overflow-hidden">
      <SiteHeader title={view === 'map' ? 'Atlas territorial' : VIEWS[view]} description={view === 'map' ? `${activeMode?.label ?? ''} · ${periodLabel}` : PAGE_LEDES[view]} technical={technical}>{headerActions}</SiteHeader>
    {view === 'map' && atlas ? <main className="full-map relative min-h-0 flex-1 overflow-hidden rounded-b-xl" aria-label="Atlas territorial" data-left={panel || undefined} data-right={rightPanel || undefined}>
      <AtlasMap ref={map} atlas={atlas} parcels={visibleParcels} selected={selected} mode={mode} year={year} keyDate={key} filters={filters} settings={layers} manifest={manifest} imageryVisible={draftMode === 'segment'} onReady={mapReady} onImageryBusy={setImageryBusy} onImageryFailure={() => setPlaying(false)} onMeasure={setMeasureValue} onLocate={locateMe} locating={locating} onSelect={id => { setSidePanel(null); chooseParcel(id); }} onDraft={setDraft} onCancel={() => { cancelDraft(); setMeasureKind(null); }} onMapClick={draftMode === 'segment' && !adjusting ? coords => { if (!segmenting) void infer([...prompts, { coordinates: coords, label: promptLabel }]); } : undefined}/>

      {/* Left: panel rail and the open panel. */}
      <div className="pointer-events-none absolute top-3 bottom-9 left-3 z-20 flex items-start gap-2 max-md:inset-x-0 max-md:top-auto max-md:bottom-0 max-md:flex-col-reverse max-md:items-stretch max-md:gap-0">
        <div className="pointer-events-auto max-md:w-full"><MapRail panel={panel} filtered={filtered} onPanel={next => { parkedPanel.current = null; setPanel(current => current === next ? null : next); }}/></div>
        {panel && <section aria-labelledby="context-panel-title" className={cn(floating, 'context-panel pointer-events-auto flex max-h-full w-80 flex-col overflow-hidden max-md:mx-2 max-md:mb-2 max-md:max-h-[60svh] max-md:w-auto animate-in fade-in slide-in-from-left-2 max-md:slide-in-from-bottom-2')}>
          <header className="flex items-center justify-between gap-2 border-b py-2 pr-2 pl-4"><h2 id="context-panel-title" className="text-sm font-semibold">{panelTitle(panel)}</h2><ToolButton label="Cerrar panel" side="bottom" onClick={() => setPanel(null)}><X/></ToolButton></header>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {panel === 'layers' && <LayersPanel mode={mode} technical={technical} settings={layers} year={year} onMode={switchMode} onOpacity={opacity => setLayers(l => ({ ...l, opacity }))}/>}
            {panel === 'basemap' && <BasemapPanel settings={layers} onBase={base => setLayers(l => ({ ...l, base }))} onOverlay={(overlay, visible) => setLayers(l => ({ ...l, [overlay]: visible }))}/>}
            {panel === 'parcels' && <ParcelListPanel parcels={visibleParcels} atlas={atlas} keyDate={key} selectedId={selectedId} onSelect={id => chooseParcel(id, true)}/>}
            {panel === 'filters' && <FiltersPanel state={filters.state} group={filters.group} count={visibleParcels.length} total={parcels.length} onChange={next => setFilters(f => ({ ...f, ...next }))} onReset={() => setFilters(f => ({ ...f, state: 'all', group: 'all' }))}/>}
            {panel === 'bookmarks' && <BookmarksPanel parcels={parcels} onAll={() => map.current?.fitAll()} onFit={bounds => map.current?.fitBounds(bounds)}/>}
          </div>
        </section>}
      </div>

      {/* Transient status beside the left cluster (and the search on mobile). */}
      <div className={cn('pointer-events-none absolute top-3 z-10 flex w-[min(22rem,calc(100%-8rem))] flex-col items-start gap-2 max-md:items-stretch transition-[left] max-md:inset-x-3 max-md:w-auto', panel ? 'left-[24.5rem]' : 'left-[4.25rem]')}>
        {isMobile && searchForm}
        {liveImagery && (imageryError || !manifest || imageryBusy) && <div role={manifest || imageryError ? 'status' : undefined} className={cn(floating, 'imagery-caption pointer-events-auto flex w-fit max-w-full items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground', imageryError && 'border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200')}>
          {imageryError ? <><span>{imageryError}</span><Button size="xs" variant="outline" onClick={() => setImageryRevision(v => v + 1)}>Reintentar servicio</Button></> : <LoadingState label={manifest ? 'Preparando imágenes Sentinel-2…' : 'Cargando observaciones Sentinel-2…'}/>}
        </div>}
        {measureKind && <div role="status" className={cn(floating, 'pointer-events-auto flex w-fit items-center gap-2 py-1 pr-1 pl-3 text-sm')}><Ruler className="size-4 text-muted-foreground"/><span className="text-muted-foreground">{measureKind === 'area' ? 'Área' : 'Distancia'}</span><span className="font-semibold tabular-nums">{measureValue ?? 'Haz clic en el mapa'}</span><Button size="xs" variant="ghost" onClick={() => toggleMeasure(null)}>Terminar</Button></div>}
      </div>

      {setupVisible && <div className="map-setup-overlay absolute inset-0 z-40 grid place-items-center overflow-y-auto bg-background/60 p-4 backdrop-blur-sm"><MapSetup tasks={setupTasks} error={loadError} onRetry={reload}/></div>}
      {showTime && <div className="@container/time pointer-events-none absolute bottom-9 z-10 flex justify-center px-2 transition-[left,right] max-md:inset-x-3 max-md:bottom-[4.25rem] max-md:px-0 md:left-(--time-left) md:right-(--time-right) [&>*]:pointer-events-auto [&>*]:w-full [&>*]:max-w-xl" style={{ '--time-left': panel ? '24.5rem' : '4.25rem', '--time-right': rightPanel ? 'calc(380px + 5.25rem)' : '4.25rem' } as React.CSSProperties}>
        <TimeSlider mode={mode} year={year} month={month} keyDate={key} playing={playing} onPlay={setPlaying} onMonth={setMonth} onYear={setYear} onDate={(y, m) => { setYear(y); setMonth(m); }}/>
      </div>}

      {/* Right: details panel and tools. */}
      <div className="pointer-events-none absolute top-3 right-3 bottom-9 z-20 flex items-start gap-2 max-md:top-16">
        {rightPanel && <div className="pointer-events-auto flex max-h-full w-[380px] animate-in fade-in slide-in-from-right-2 max-md:fixed max-md:inset-x-2 max-md:top-auto max-md:bottom-[4.25rem] max-md:max-h-[64svh] max-md:w-auto max-md:slide-in-from-bottom-2 [&>*]:w-full">
          {rightPanel === 'parcel' && selected && <ParcelPanel parcel={selected} atlas={atlas} year={year} month={month} sensor={mode === 'landsat' ? 'Landsat C2' : 'Sentinel-2'} onClose={() => setSelectedId(null)} onLocate={() => map.current?.fitParcel(selected)} onEdit={startEdit} onAnalyze={() => setAnalysis(selected)} onTechnical={() => navigate('technical')} onNext={direction => { const index = visibleParcels.findIndex(p => p.properties.id === selectedId); if (visibleParcels.length) chooseParcel(visibleParcels[(index + direction + visibleParcels.length) % visibleParcels.length].properties.id, true); }}/>}
          {rightPanel === 'export' && <aside aria-label="Exportar" className={cn(floating, 'side-panel export-panel flex min-h-0 flex-col overflow-hidden')}>
            <header className="flex items-center gap-1 border-b py-2 pr-2 pl-4"><h2 className="flex-1 text-base font-semibold">Exportar</h2><ToolButton label="Cerrar exportación" side="bottom" onClick={() => setSidePanel(null)}><X/></ToolButton></header>
            <div className="grid gap-3 overflow-y-auto p-3">
              <p className="px-1 text-sm text-muted-foreground">{visibleParcels.length} {visibleParcels.length === 1 ? 'parcela visible' : 'parcelas visibles'} · {activeMode?.label} · {periodLabel}</p>
              <ItemGroup className="gap-2">
                {([[ImageDown, 'Imagen del mapa', 'PNG de la vista actual', () => void exportMap()], [FileJson, 'Parcelas · GeoJSON', 'Límites y atributos para SIG', () => download('parcelas.geojson', JSON.stringify({ type: 'FeatureCollection', features: visibleParcels }), 'application/geo+json')], [FileSpreadsheet, 'Parcelas · CSV', 'Tabla para hojas de cálculo', () => download('parcelas.csv', parcelCsv(visibleParcels, atlas, key), 'text/csv')]] as const).map(([Icon, title, detail, run]) =>
                  <Item key={title} asChild variant="outline" className="cursor-pointer hover:bg-muted"><button type="button" onClick={run} className="text-left"><ItemMedia variant="icon" className="size-9 rounded-md border bg-muted"><Icon/></ItemMedia><ItemContent><ItemTitle>{title}</ItemTitle><ItemDescription className="text-xs">{detail}</ItemDescription></ItemContent><Download className="size-4 text-muted-foreground"/></button></Item>)}
              </ItemGroup>
            </div>
          </aside>}
          {draftMode && <section aria-label="Delimitación de parcela" className={cn(floating, 'side-panel delineation-card flex min-h-0 flex-col overflow-hidden', compactDelineation && 'compact')}>
            <header className="flex items-center gap-1 border-b py-2 pr-2 pl-4">
              <h2 className="flex-1 truncate text-base font-semibold">{draftMode === 'segment' ? 'Delimita tu terreno' : draftMode === 'edit' ? 'Corrige los límites' : 'Dibuja tu parcela'}</h2>
              <ToolButton label={compactDelineation ? 'Expandir controles de delimitación' : 'Contraer controles de delimitación'} side="bottom" onClick={() => setCompactDelineation(!compactDelineation)}>{compactDelineation ? <ChevronDown/> : <ChevronUp/>}</ToolButton>
              <ToolButton label="Cancelar delimitación" side="bottom" onClick={cancelDraft}><X/></ToolButton>
            </header>
            <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-4">
              <div className="grid gap-1"><Badge variant="secondary" className="w-fit">{draftMode === 'segment' ? 'SAM 2.1 · Sentinel-2 RGB' : draftMode === 'edit' ? 'Edición de límites' : 'Dibujo manual'}</Badge>
                {!compactDelineation && <p className="text-sm leading-relaxed text-muted-foreground">{draftMode === 'segment' ? 'Haz clic dentro del terreno. Añade puntos para incluir o excluir áreas y revisa la propuesta antes de guardarla.' : 'Ajusta los vértices. Al dibujar, un doble clic cierra el polígono.'}</p>}</div>
              {draftMode === 'segment' && <>
                <div role="group" aria-label="Tipo de punto" className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                  {([[1, '+ Incluir', 'bg-emerald-500'], [0, '− Excluir', 'bg-rose-500']] as const).map(([value, label, dot]) => <button key={label} type="button" aria-pressed={promptLabel === value && !adjusting} onClick={() => { setAdjusting(false); map.current?.proposal(draft); setPromptLabel(value); }} className="flex h-8 items-center justify-center gap-2 rounded-md text-sm font-medium text-muted-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm"><span className={cn('size-2 rounded-full', dot)}/>{label}</button>)}
                </div>
                {!compactDelineation && <p className="text-xs text-muted-foreground">{MONTH_NAMES[month]} {year} · límites aproximados de 10 m · {prompts.length} {prompts.length === 1 ? 'punto' : 'puntos'}</p>}
                {segmenting && <div className="rounded-lg bg-muted px-3 py-2 text-sm"><LoadingState label="Buscando límites de la parcela…"/></div>}
                {segmentError && <Alert><TriangleAlert/><AlertDescription>{segmentError}</AlertDescription></Alert>}
                {proposal?.warnings.map(w => <p key={w} className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">{w}</p>)}
                <div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" disabled={segmenting || !prompts.length} onClick={() => void infer(prompts)}>Reintentar</Button><Button variant="outline" size="sm" disabled={!draft || segmenting} onClick={() => { setAdjusting(true); setCompactDelineation(true); map.current?.editDraft(draft!); }}>Ajustar vértices</Button><Button variant="ghost" size="sm" onClick={startDraw}><PencilRuler/>Dibujar manualmente</Button></div>
              </>}
              {draftMode === 'draw' && <div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => map.current?.undo()}>Deshacer punto</Button><Button variant="outline" size="sm" onClick={() => map.current?.finish()}>Cerrar polígono</Button></div>}
              <div className="draft-area flex items-baseline justify-between rounded-lg border px-3 py-2.5"><span className="text-sm text-muted-foreground">Superficie</span>{draft ? <b className="text-2xl font-semibold tabular-nums">{fmt(polygonArea(draft))}<span className="ml-1 text-sm font-normal text-muted-foreground">ha</span></b> : segmenting ? <LoadingValue label="Calculando superficie de la propuesta" unit="ha"/> : <b className="text-2xl font-semibold text-muted-foreground/60">—<span className="ml-1 text-sm font-normal">ha</span></b>}</div>
              {draftMode !== 'edit' && <Field><FieldLabel htmlFor="field-name">Nombre de la parcela</FieldLabel><Input id="field-name" value={fieldName} onChange={e => setFieldName(e.target.value)}/></Field>}
            </div>
            <footer className="flex items-center gap-2 border-t p-3"><Button variant="outline" onClick={cancelDraft} className="mr-auto">Cancelar</Button>{proposal && <ToolButton label="Exportar propuesta y correcciones" side="top" disabled={!draft} onClick={exportProposal}><Download/></ToolButton>}<Button disabled={!draft || saving || segmenting} onClick={() => void saveDraft()}>{saving ? <><Spinner/>Guardando…</> : draftMode === 'edit' ? 'Guardar límites' : 'Guardar parcela'}</Button></footer>
          </section>}
        </div>}
        <div className="pointer-events-auto">
          <ToolRail>
            <ToolButton label="Analizar mi terreno" side="left" pressed={draftMode === 'segment'} onClick={startSegment}><WandSparkles/></ToolButton>
            <ToolButton label="Dibujar parcela" side="left" pressed={draftMode === 'draw'} onClick={startDraw}><PenLine/></ToolButton>
            <Separator className="my-0.5 w-6 max-md:hidden"/>
            <ToolButton label="Medir distancia" side="left" pressed={measureKind === 'distance'} onClick={() => toggleMeasure('distance')} className="max-md:hidden"><Ruler/></ToolButton>
            <ToolButton label="Medir área" side="left" pressed={measureKind === 'area'} onClick={() => toggleMeasure('area')} className="max-md:hidden"><SquareDashed/></ToolButton>
            <Separator className="my-0.5 w-6"/>
            <ToolButton label="Exportar" side="left" pressed={sidePanel === 'export'} onClick={() => setSidePanel(p => p === 'export' ? null : 'export')}><Download/></ToolButton>
            {technical && <ToolButton label="Controles avanzados" side="left" expanded={advanced} onClick={() => setAdvanced(!advanced)}><SlidersHorizontal/></ToolButton>}
          </ToolRail>
        </div>
      </div>
    </main> : <main className="atlas-page flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 md:gap-6 md:p-6">
      {!atlas || setupVisible ? <PagePlaceholder view={view} error={loadError} onRetry={reload}/> : <>
      {view === 'parcels' && <ParcelsPage parcels={parcels} atlas={atlas} workspace={workspace} keyDate={key} onSelect={id => { navigate('map'); chooseParcel(id, true); }} onAnalyze={setAnalysis}/>}
      {view === 'technical' && (selected ? <TechnicalPage atlas={atlas} parcels={parcels} selected={selected} year={year} month={month} onSelect={setSelectedId} onMap={() => navigate('map')}/> : <Empty className="mx-auto mt-6 w-full max-w-md flex-none border md:mt-16"><EmptyHeader><EmptyMedia variant="icon"><ChartNoAxesCombined/></EmptyMedia><EmptyTitle><h2>Selecciona una parcela</h2></EmptyTitle><EmptyDescription>Consulta su vegetación, clima, relieve y embeddings AlphaEarth a lo largo del año.</EmptyDescription></EmptyHeader><EmptyContent><Select value="" onValueChange={setSelectedId}><SelectTrigger aria-label="Parcela del análisis" className="w-64"><SelectValue placeholder="Elige una parcela"/></SelectTrigger><SelectContent className="max-h-72">{parcels.map(p => <SelectItem key={p.properties.id} value={p.properties.id}>{p.properties.name || p.properties.id}</SelectItem>)}</SelectContent></Select></EmptyContent></Empty>)}
      {view === 'models' && <ModelsPage/>}{view === 'sources' && <SourcesPage atlas={atlas}/>}{view === 'admin' && user.role === 'admin' && <AdminPage currentUser={user} parcels={parcels} workspace={workspace} onChanged={reloadWorkspace}/>}
      </>}
    </main>}
    </SidebarInset>
  </SidebarProvider>
    {atlas && <Sheet open={advanced && technical} onOpenChange={setAdvanced}><SheetContent side="right" showCloseButton={false} className="advanced-side-panel w-full gap-0 overflow-y-auto sm:max-w-sm">
      <SheetHeader className="flex-row items-start justify-between border-b">
        <div className="grid gap-1"><SheetTitle>Análisis Pro</SheetTitle><SheetDescription>Umbrales, capas históricas y procedencia.</SheetDescription></div>
        <Button variant="ghost" size="icon-sm" aria-label="Cerrar controles avanzados" onClick={() => setAdvanced(false)}><X/></Button>
      </SheetHeader>
      <div className="grid gap-6 p-4">
        <FieldSet>
          <FieldLegend variant="label">Umbrales</FieldLegend>
          <Field><FieldLabel htmlFor="ndvi-threshold">Umbral NDVI</FieldLabel><Input id="ndvi-threshold" aria-label="Valor del umbral NDVI" type="number" step="0.05" min="-1" max="1" value={filters.ndviThreshold} onChange={e => setFilters(f => ({ ...f, ndviThreshold: Math.max(-1, Math.min(1, Number(e.target.value))) }))}/></Field>
          <Field className="water-index-control"><div className="flex items-center justify-between"><FieldLabel>Umbral de agua MNDWI</FieldLabel><span className="text-sm text-muted-foreground tabular-nums">{(layers.waterThreshold ?? 0).toFixed(2)}</span></div><Slider aria-label="Umbral de agua MNDWI" min={-1} max={1} step={0.05} value={[layers.waterThreshold ?? 0]} onValueChange={([value]) => setLayers(l => ({ ...l, waterThreshold: Math.round(value * 100) / 100 }))} onKeyDown={pageStep(0.25, value => setLayers(l => ({ ...l, waterThreshold: Math.round(Math.max(-1, Math.min(1, (l.waterThreshold ?? 0) + value)) * 100) / 100 })))} className="py-3 pointer-coarse:py-5"/></Field>
          <Field><div className="flex items-center justify-between"><FieldLabel>Opacidad de agua</FieldLabel><span className="text-sm text-muted-foreground tabular-nums">{Math.round((layers.waterOpacity || 0) * 100)} %</span></div><Slider aria-label="Opacidad del agua" min={0} max={1} step={0.05} value={[layers.waterOpacity || 0]} onValueChange={([value]) => setLayers(l => ({ ...l, waterOpacity: value }))}/></Field>
        </FieldSet>
        <Separator/>
        <FieldSet>
          <FieldLegend variant="label">Capas históricas</FieldLegend>
          <div className="grid grid-cols-2 gap-2"><Button variant={mode === 'alphaearth' ? 'default' : 'outline'} onClick={() => { switchMode('alphaearth'); setAdvanced(false); }}>AlphaEarth</Button><Button variant={mode === 'landsat' ? 'default' : 'outline'} onClick={() => { switchMode('landsat'); setAdvanced(false); }}>NDVI · Landsat C2</Button></div>
          <Field orientation="horizontal"><Checkbox id="only-ndvi" aria-label="Filtrar también parcelas" checked={filters.onlyNdvi} disabled={mode !== 'landsat'} onCheckedChange={checked => setFilters(f => ({ ...f, onlyNdvi: checked === true }))}/><FieldLabel htmlFor="only-ndvi" className="font-normal">Filtrar también parcelas · Landsat C2</FieldLabel></Field>
        </FieldSet>
        <Separator/>
        <FieldSet>
          <FieldLegend variant="label">Clima y relieve</FieldLegend>
          {(['precipitation', 'tmin', 'tmax', 'elevation', 'slope'] as const).map((layer, i) => <Field key={layer} orientation="horizontal"><Checkbox id={`layer-${layer}`} checked={layers[layer]} onCheckedChange={checked => setLayers(l => ({ ...l, [layer]: checked === true }))}/><FieldLabel htmlFor={`layer-${layer}`} className="font-normal">{['Precipitación', 'Temperatura mínima', 'Temperatura máxima', 'Elevación', 'Pendiente'][i]}</FieldLabel></Field>)}
        </FieldSet>
        <Separator/>
        <FieldSet>
          <FieldLegend variant="label">Exportar y procedencia</FieldLegend>
          <div className="grid grid-cols-2 gap-2"><Button variant="outline" onClick={() => download('parcelas.geojson', JSON.stringify({ type: 'FeatureCollection', features: visibleParcels }), 'application/geo+json')}><Download/>GeoJSON</Button><Button variant="outline" onClick={() => download('parcelas.csv', parcelCsv(visibleParcels, atlas, key), 'text/csv')}><Download/>CSV</Button></div>
          {manifest && <><p className="text-xs text-muted-foreground">{manifest.scenes.length} escenas · {manifest.tiles.length} teselas · {manifest.source}</p><Button variant="outline" onClick={() => download(`sentinel-${key}.json`, JSON.stringify(manifest, null, 2), 'application/json')}>Descargar procedencia del mes</Button></>}
          <Button variant="link" className="justify-start px-0" onClick={() => { setAdvanced(false); navigate('models'); }}>Rendimiento de ejemplo · 4.2 t/ha</Button>
        </FieldSet>
      </div>
    </SheetContent></Sheet>}
    {analysis && <AnalysisDialog parcel={analysis} onClose={() => setAnalysis(null)} onSaved={(a: Analysis) => setWorkspace(w => ({ ...w, analyses: [a, ...w.analyses] }))}/>}
    <Toaster position="bottom-center"/>
  </TooltipProvider>;
}
