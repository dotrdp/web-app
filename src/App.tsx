// AgroCebada shell. The map is the wallpaper; everything else is an extrusion of
// one frame (Caelestia / Noctalia): the bar on the left, the dashboard dropping
// from the top, the launcher rising from the bottom, panels and cards attached
// to the edges. Two phases replace the old Productor / Técnico roles: Explorar (the
// map) and Estimar, the dashboard page that the map and its controls fade away for. the Agente de IA Milli lives in the top island.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { BoxSelect, ChartSpline, ChevronDown, ChevronUp, Columns2, Database, Download, FileJson, FileSpreadsheet, Home, ImageDown, Layers3, LocateFixed, LogOut, Maximize, Minus, MousePointerClick, Moon, Palette, PencilRuler, PenLine, Plus, Ruler, Calculator, CodeXml, Search, Send, Settings, SquareDashed, Sun, Table2, TriangleAlert, WandSparkles, X } from 'lucide-react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import { Spinner } from '@/components/ui/spinner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import AtlasMap from './AtlasMap';
import type { MapHandle, MeasureKind } from './AtlasMap';
import Login from './Login';
import ParcelPanel from './ParcelPanel';
import { SourcesPage } from './SourcesPage';
import MapSetup, { createSetupTasks, MapSetupScreen } from './MapSetup';
import type { SetupTaskId } from './MapSetup';
import { LoadingState, LoadingValue } from './AgentProgress';
import type { AgentStep } from './AgentProgress';
import { BASEMAPS, BasemapPanel, BookmarksPanel, FiltersPanel, SectionTitle } from './MapPanels';
import LayersPanel from './LayersPanel';
import { TempLayerChips, TempLayerRows } from './milli/TempLayers';
import { AgentFigures, AgentPermission, McpSettings } from './milli/agents';
import { reportPage } from './milli/live';
import { useTempLayers } from './milli/temp-layers';
import { anyTemporal, DEFAULT_STACK, isOn, LAYERS, updateLayer } from './layers';
import type { LayerId, MapLayer } from './layers';
import TimeSlider from './TimeSlider';
import { api, dateKey, download, filterParcels, fmt, IS_DEMO, mergedParcels, MONTH_NAMES, parcelCsv, polygonArea } from './lib';
import { useAppMilli } from './milli/app-controller';
import { startLive } from './milli/live';
import { submissionCsv } from './model';
import type { Predictions } from './model';
import { DEFAULT_PLUGINS, PluginsPanel } from './plugins';
import type { PluginId } from './plugins';
import Popout from './shell/Popout';
import Bar, { MobileDock, PANEL_ITEMS, PHASES } from './shell/Bar';
import type { LeftPanel } from './shell/Bar';
import MilliChat, { MilliEye, MilliProvider, useMilliWorking } from './milli/MilliChat';
import Launcher from './shell/Launcher';
import { MILLI, MilliAvatar, MilliName } from './shell/Milli';
import type { Command } from './shell/Launcher';
import ShellButton from './shell/ShellButton';
import ShiftPill from './shell/ShiftPill';
import { CropMark } from './CropMarks';
import type { Crop } from './CropMarks';
import EstimationPanel, { Stat } from './panels/EstimationPanel';
import EconomicsPanel from './panels/EconomicsPanel';
import NotesPanel from './panels/NotesPanel';
import AttributeTable from './panels/AttributeTable';
import type { Atlas, Field as WorkspaceField, Geometry, ImageryManifest, LayerSettings, MapFilters, Override, Parcel, Phase, SegmentationPrompt, SegmentationProposal, User, Workspace } from './types';
import './map.css';
import './shell/shell.css';

type Sheet = 'fuentes' | 'tabla';
// Everything the bar can show as open: the map panels plus Ajustes, Scripts and Notas.
const PANEL_KEYS: string[] = [...PANEL_ITEMS.map(p => p.key), 'settings', 'scripts', 'notes'];
type Left = LeftPanel | Sheet;
type Scheme = Crop;
const SCHEMES: { key: Scheme; label: string }[] = [{ key: 'maiz', label: 'Maíz' }, { key: 'sorgo', label: 'Sorgo' }, { key: 'trigo', label: 'Trigo' }, { key: 'arroz', label: 'Arroz' }, { key: 'cebada', label: 'Cebada' }, { key: 'mijo', label: 'Mijo' }];
const SHEETS: Sheet[] = ['fuentes', 'tabla'];
const EMPTY_WORKSPACE: Workspace = { overrides: {}, fields: [] };
const EMPTY_FILTERS: MapFilters = { query: '', state: 'all', group: 'all', ndviEnabled: true, ndviThreshold: -1, onlyNdvi: false };
const DEFAULT_LAYERS: LayerSettings = { base: 'topo' };
const LEGACY_ROUTES: Record<string, Phase> = { map: 'explorar', parcels: 'estimar', models: 'estimar', technical: 'explorar', avanzado: 'explorar', sources: 'explorar' };
const routePhase = (): Phase => { const r = window.location.hash.replace('#/', ''); return (PHASES.some(p => p.key === r) ? r : LEGACY_ROUTES[r] ?? 'explorar') as Phase; };
const PAGE = {
  enter: { opacity: 0, scale: 1.015, filter: 'blur(0px)' },
  shown: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: .36, delay: .12, ease: [.2, 0, 0, 1] } },
  // `stillOpen`: another dashboard page replaces this one, so leave the way the map does.
  leave: (stillOpen: boolean) => stillOpen
    ? { opacity: 0, scale: .985, filter: 'blur(6px)', transition: { duration: .38, ease: [.4, 0, .2, 1] } }
    : { opacity: 0, scale: 1.015, filter: 'blur(0px)', transition: { duration: .22 } },
} satisfies Variants;
const shortcutKey = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';

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
  const [parcels, details, rasters, landsat, provenance, predictions] = await Promise.all([
    data<Atlas['parcels']>('parcels.geojson', 'parcels', value => `${value.features.length} límites de parcela disponibles`),
    data<Atlas['details']>('parcel-data.json', 'details', value => `${Object.keys(value).length} parcelas con datos históricos`),
    data<Atlas['rasters']>('layers.json', 'layers', () => 'Vegetación, clima, elevación y pendiente'),
    data<Atlas['landsat']>('landsat.json', 'landsat', value => `${Object.keys(value).length} meses de observaciones`),
    data<Atlas['provenance']>('provenance.json', 'provenance', () => 'Fuentes y procedencia disponibles'),
    data<Predictions>('predictions.json', 'model', value => `MAE ${fmt(value.metrics.mae_t_ha)} t/ha · ${Object.keys(value.parcels).length} estimaciones`),
  ]);
  return { parcels, details, rasters, landsat, provenance, predictions };
}

export default function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [atlas, setAtlas] = useState<Atlas | null>(null), [workspace, setWorkspace] = useState<Workspace>(EMPTY_WORKSPACE);
  const [loadError, setLoadError] = useState('');
  const isMobile = useIsMobile();
  const [viewWidth, setViewWidth] = useState(() => window.innerWidth);
  useEffect(() => { const resize = () => setViewWidth(window.innerWidth); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize); }, []);
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [scheme, setScheme] = useState<Scheme>('cebada');
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  useEffect(() => { document.documentElement.dataset.scheme = scheme; }, [scheme]);
  const [setupTasks, setSetupTasks] = useState(() => createSetupTasks()), [setupVisible, setSetupVisible] = useState(true);
  const setupRevision = useRef(0);

  const [phase, setPhase] = useState<Phase>(routePhase);
  const [left, setLeft] = useState<Left | null>(() => window.innerWidth > 1100 ? 'layers' : null);
  const [assistant, setAssistant] = useState(false), [milliOpened, setMilliOpened] = useState(false);
  const [dashboard, setDashboard] = useState(() => routePhase() === 'estimar');
  // Second dashboard page (the calculator); leaving the dashboard returns it to the main page.
  const [economics, setEconomics] = useState(false);
  useEffect(() => { if (!dashboard) setEconomics(false); }, [dashboard]);
  const [launcher, setLauncher] = useState<string | null>(null);
  const [plugins, setPlugins] = useState(DEFAULT_PLUGINS);
  const [selectedId, setSelectedId] = useState<string | null>(null), [hoverId, setHoverId] = useState<string | null>(null);
  const [identify, setIdentify] = useState<{ id: string; pixel: [number, number] } | null>(null);
  const [year, setYear] = useState(2025), [month, setMonth] = useState(6), [playing, setPlaying] = useState(false), [touring, setTouring] = useState(false);
  const [stack, setStack] = useState<MapLayer[]>(DEFAULT_STACK);
  const tempList = useTempLayers();
  // Outside agents listing the account's screens see which page each tab is on.
  useEffect(() => { if (!IS_DEMO) reportPage(dashboard ? (economics ? 'economia' : 'panel') : 'mapa'); }, [dashboard, economics]);
  const [filters, setFilters] = useState<MapFilters>(EMPTY_FILTERS), [layers, setLayers] = useState<LayerSettings>(DEFAULT_LAYERS);
  const [rightPanel, setRightPanel] = useState<'export' | 'selection' | null>(null);
  const [measureKind, setMeasureKind] = useState<MeasureKind | null>(null), [measureValue, setMeasureValue] = useState<string | null>(null);
  const [swipe, setSwipe] = useState<number | null>(null), [selectArea, setSelectArea] = useState(false), [selection, setSelection] = useState<string[]>([]);
  const [locating, setLocating] = useState(false), [fullscreen, setFullscreen] = useState(false);
  const [draftMode, setDraftMode] = useState<'draw' | 'edit' | 'segment' | null>(null), [draft, setDraft] = useState<Geometry | null>(null), [fieldName, setFieldName] = useState('Mi parcela');
  const [saving, setSaving] = useState(false), [segmenting, setSegmenting] = useState(false), [segmentError, setSegmentError] = useState('');
  const [compactDelineation, setCompactDelineation] = useState(false);
  const [promptLabel, setPromptLabel] = useState<0 | 1>(1), [prompts, setPrompts] = useState<SegmentationPrompt[]>([]), [proposal, setProposal] = useState<SegmentationProposal | null>(null), [adjusting, setAdjusting] = useState(false);
  const [manifest, setManifest] = useState<ImageryManifest | null>(null), [imageryError, setImageryError] = useState('');
  const [imageryRevision, setImageryRevision] = useState(0), [imageryBusy, setImageryBusy] = useState(false);
  const requestRevision = useRef(0), controller = useRef<AbortController | null>(null);
  const segmentationMonth = useRef('');
  const queuedPrompts = useRef<SegmentationPrompt[] | null>(null);
  const map = useRef<MapHandle>(null), key = dateKey(year, month);
  const toolKeys = useRef<(() => void)[]>([]);
  const viewport = useRef<HTMLDivElement>(null);
  const [statusEl, setStatusEl] = useState<HTMLDivElement | null>(null);
  const temporal = anyTemporal(stack) && !draftMode;
  const liveImagery = isOn(stack, 'ndvi') || isOn(stack, 'water') || draftMode === 'segment';

  useEffect(() => { void api<{ user: User | null }>('/api/auth/session').then(d => setUser(current => current === undefined ? d.user : current)).catch(() => setUser(current => current === undefined ? null : current)); }, []);
  const reloadWorkspace = useCallback(async () => { const w = await api<Workspace>('/api/workspace'); setWorkspace(w); return w; }, []);
  const reload = useCallback(() => {
    const revision = ++setupRevision.current;
    setLoadError(''); setSetupVisible(true); setSetupTasks(createSetupTasks(true));
    const progress: SetupProgress = (id, update) => { if (setupRevision.current === revision) setSetupTasks(tasks => ({ ...tasks, [id]: { ...tasks[id], ...update } })); };
    const owned = api<Workspace>('/api/workspace').then(w => {
      progress('workspace', { status: 'success', completedAt: performance.now(), result: `${w.fields.length} terrenos propios · ${Object.keys(w.overrides).length} correcciones` });
      return w;
    }).catch(error => { progress('workspace', { status: 'error', completedAt: performance.now(), detail: 'No pudimos recuperar tus terrenos.' }); throw error; });
    void Promise.all([loadAtlas(progress), owned]).then(([a, w]) => {
      if (setupRevision.current !== revision) return;
      progress('map', { status: 'running', startedAt: performance.now() }); setWorkspace(w); setAtlas(a);
    }).catch(error => { if (setupRevision.current === revision) setLoadError(error.message); });
  }, []);
  const mapReady = useCallback(() => { if (setupTasks.map.status !== 'running') return; setSetupTasks(tasks => ({ ...tasks, map: { ...tasks.map, status: 'success', completedAt: performance.now() } })); setSetupVisible(false); }, [setupTasks.map.status]);
  useEffect(() => { if (user) reload(); }, [user, reload]);
  useEffect(() => { const onRoute = () => goPhase(routePhase()); window.addEventListener('hashchange', onRoute); return () => window.removeEventListener('hashchange', onRoute); });
  useEffect(() => { if (!temporal) setPlaying(false); }, [temporal]);
  useEffect(() => { if (!playing || !temporal || liveImagery && imageryBusy) return; const timer = window.setInterval(() => setMonth(m => m >= 9 || m < 3 ? 3 : m + 1), 2200); return () => clearInterval(timer); }, [playing, temporal, liveImagery, imageryBusy]);
  useEffect(() => {
    setManifest(null); setImageryError(''); setImageryBusy(false);
    if (!user || !liveImagery) return;
    setImageryBusy(true);
    const abort = new AbortController();
    api<ImageryManifest>(`/api/imagery/manifests/${key}`, { signal: abort.signal }).then(value => { if (!abort.signal.aborted) { setManifest(value); setImageryBusy(false); } }).catch(e => { if (!abort.signal.aborted) { setImageryError(e.message); setImageryBusy(false); setPlaying(false); } });
    return () => abort.abort();
  }, [key, liveImagery, user, imageryRevision]);
  useEffect(() => { if (draftMode === 'segment' && segmentationMonth.current !== key) cancelDraft(); }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const queued = queuedPrompts.current;
    if (!queued || draftMode !== 'segment') return;
    if (manifest) { queuedPrompts.current = null; void infer(queued); }
    else if (imageryError) { queuedPrompts.current = null; setSegmenting(false); setSegmentError(imageryError); }
  }, [manifest, imageryError, draftMode]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { controller.current?.abort(); requestRevision.current++; }, []);

  const parcels = useMemo(() => atlas ? mergedParcels(atlas, workspace) : [], [atlas, workspace]);
  const selected = useMemo(() => parcels.find(p => p.properties.id === selectedId) || null, [parcels, selectedId]);
  const visibleParcels = useMemo(() => atlas ? filterParcels(parcels, filters, atlas, key) : [], [parcels, filters, atlas, key]);
  const tourIndex = useRef(0);
  useEffect(() => {
    if (!touring || !visibleParcels.length) return;
    const step = () => { tourIndex.current = (tourIndex.current + 1) % visibleParcels.length; chooseParcel(visibleParcels[tourIndex.current].properties.id, true); };
    step(); const timer = window.setInterval(step, 4200); return () => clearInterval(timer);
  }, [touring, visibleParcels]); // eslint-disable-line react-hooks/exhaustive-deps

  // Agente de IA Milli drives this tab through its live channel (server version only).
  useEffect(() => user && !IS_DEMO ? startLive() : undefined, [user]);
  useAppMilli({ atlas, parcels, visibleParcels, selected, selection, phase, dashboard, economics, left, right: draftMode ? 'draft' : rightPanel ?? (selected ? 'parcel' : null),
    assistant, dark, scheme, stack, layers, filters, year, month, keyDate: key, tools: { draftMode, measureKind, selectArea, swipe, plugins }, map,
    setDashboard, setEconomics, setLeft, setStack, setLayers, setFilters, setYear, setMonth, chooseParcel, showSelection, exportMap });

  // Keyboard: Ctrl/⌘ K launcher, Alt 1–2 phases, Alt D dashboard, 1–9 the map tools in strip
  // order (refreshed every render, so disabled plugins close the gap), C cancels the active map tool,
  // Escape closes the top layer.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setLauncher(l => l === null ? '' : null); return; }
      if (event.altKey && PHASES[Number(event.key) - 1]) { event.preventDefault(); goPhase(PHASES[Number(event.key) - 1].key); return; }
      if (event.altKey && event.key.toLowerCase() === 'd') { event.preventDefault(); setDashboard(d => !d); return; }
      const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || (event.target as HTMLElement | null)?.isContentEditable;
      if (/^[1-9]$/.test(event.key) && !event.metaKey && !event.ctrlKey && !event.altKey && !typing && launcher === null && !dashboard) { const run = toolKeys.current[Number(event.key) - 1]; if (run) { event.preventDefault(); run(); } return; }
      if (event.key.toLowerCase() === 'c' && !event.metaKey && !event.ctrlKey && !event.altKey && !typing && launcher === null) { if (cancelTools()) event.preventDefault(); return; }
      if (event.key === 'Escape' && !(event.target instanceof HTMLInputElement)) { if (launcher !== null) setLauncher(null); else if (assistant) setAssistant(false); else if (economics) setEconomics(false); else if (dashboard) setDashboard(false); else if (swipe != null) setSwipe(null); else if (selectArea) setSelectArea(false); }
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  });

  /** Explorar is the map; Estimar is the dashboard page. Routes, shortcuts and the launcher use this. */
  function goPhase(next: Phase) {
    if (window.location.hash !== '#/' + next) window.history.replaceState(null, '', '#/' + next);
    setPhase(next); setPlaying(false); setTouring(false);
    if (next === 'explorar') setDashboard(false);
    if (next === 'estimar') setDashboard(true);
  }
  function openLeft(next: Left) { setLeft(current => current === next ? null : next); }
  function chooseParcel(id: string, locate = false) { setSelectedId(id); setRightPanel(null); if (locate) { const p = parcels.find(f => f.properties.id === id); if (p) setTimeout(() => map.current?.fitParcel(p), 40); } }
  /** Leaves the dashboard and shows these parcels on the map with the selection summary. */
  function showSelection(ids: string[]) {
    const chosen = parcels.filter(p => ids.includes(p.properties.id)); if (!chosen.length) return;
    const bounds = chosen.reduce((b, p) => [Math.min(b[0], p.properties.bounds[0]), Math.min(b[1], p.properties.bounds[1]), Math.max(b[2], p.properties.bounds[2]), Math.max(b[3], p.properties.bounds[3])], [Infinity, Infinity, -Infinity, -Infinity]);
    setDashboard(false); setSelection(chosen.map(p => p.properties.id)); setRightPanel('selection'); setTimeout(() => map.current?.fitBounds(bounds), 60);
  }
  function nextParcel(direction: number) { const list = visibleParcels.filter(p => p.properties.predictedYield != null || p.properties.group === 'custom'); if (!list.length) return; const index = list.findIndex(p => p.properties.id === selectedId); chooseParcel(list[(index + direction + list.length) % list.length].properties.id, true); }
  function cancelDraft() { queuedPrompts.current = null; controller.current?.abort(); requestRevision.current++; map.current?.cancel(); setDraftMode(null); setDraft(null); setProposal(null); setPrompts([]); setSegmentError(''); setSegmenting(false); setAdjusting(false); }
  function stopTools() { if (measureKind) { setMeasureKind(null); setMeasureValue(null); map.current?.measure(null); } setSelectArea(false); }
  function startDraw() { cancelDraft(); stopTools(); setPlaying(false); setDraftMode('draw'); setCompactDelineation(false); setFieldName('Mi parcela'); setTimeout(() => map.current?.draw(), 50); }
  function startSegment() { cancelDraft(); stopTools(); setSelectedId(null); setPlaying(false); segmentationMonth.current = dateKey(year < 2022 ? 2025 : year, year < 2022 ? 6 : month); if (year < 2022) { setYear(2025); setMonth(6); } setDraftMode('segment'); setCompactDelineation(true); setFieldName('Mi parcela'); setPromptLabel(1); }
  function startEdit() { if (!selected) return; cancelDraft(); stopTools(); setPlaying(false); setDraftMode('edit'); setCompactDelineation(false); setFieldName(selected.properties.name || selected.properties.id); map.current?.edit(selected); }
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
      if (draftMode === 'edit' && selected) { await api<Override>(`/api/parcels/${selected.properties.id}/geometry`, { method: 'PUT', body: JSON.stringify({ geometry: draft }) }); toast('Límites guardados.'); }
      else { const field = await api<WorkspaceField>('/api/fields', { method: 'POST', body: JSON.stringify({ geometry: draft, name: fieldName, segmentation: proposal?.provenance }) }); setSelectedId(field.id); toast('Parcela guardada. Confirma los límites en campo.'); }
      await reloadWorkspace(); setFilters(EMPTY_FILTERS); cancelDraft();
    } catch (e) { toast((e as Error).message); } finally { setSaving(false); }
  }
  function exportProposal() { if (!draft || !proposal) return; download('propuesta-parcela.geojson', JSON.stringify({ type: 'Feature', geometry: draft, properties: { ...proposal.provenance, correctedGeometry: draft, saved: false } }, null, 2), 'application/geo+json'); }
  async function logout() { await api('/api/auth/logout', { method: 'POST' }); setupRevision.current++; cancelDraft(); setUser(null); setAtlas(null); setWorkspace(EMPTY_WORKSPACE); setSelectedId(null); setLauncher(null); setDashboard(false); setAssistant(false); }
  /** Cancels whichever map tool is running; false when none was. The comparison slider is left
   *  alone: it layers over the other tools rather than being one. */
  function cancelTools() {
    const active = !!draftMode || !!measureKind || selectArea || rightPanel === 'export';
    if (draftMode) cancelDraft();
    if (measureKind) toggleMeasure(null);
    setSelectArea(false); setRightPanel(p => p === 'export' ? null : p);
    return active;
  }
  function toggleMeasure(kind: MeasureKind | null) { const next = kind && kind !== measureKind ? kind : null; if (next) { cancelDraft(); setSelectArea(false); } setMeasureKind(next); setMeasureValue(null); map.current?.measure(next); }
  function toggleSelect() { const next = !selectArea; if (next) { cancelDraft(); if (measureKind) toggleMeasure(null); } setSelectArea(next); }
  function locateMe() {
    if (!navigator.geolocation) { toast('Este navegador no permite obtener tu ubicación.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(position => { setLocating(false); map.current?.showLocation([position.coords.longitude, position.coords.latitude]); toast('Ubicación encontrada.'); }, () => { setLocating(false); toast('No pudimos obtener tu ubicación.'); }, { enableHighAccuracy: true, timeout: 10000 });
  }
  async function exportMap() { const blob = await map.current?.exportPng(); if (!blob) { toast('No pudimos exportar la imagen del mapa.'); return; } const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `agrocebada-mapa-${key}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  function togglePlugin(id: PluginId, on: boolean) {
    setPlugins(p => ({ ...p, [id]: on }));
    if (!on) { if (id === 'swipe') setSwipe(null); if (id === 'select') setSelectArea(false); if (id === 'identify') setIdentify(null); if ((id === 'measure' && measureKind === 'distance') || (id === 'area' && measureKind === 'area')) toggleMeasure(null); }
  }

  if (!user) return <Login checkingSession={user === undefined} onLogin={u => { setUser(u); setLoadError(''); }}/>;
  if (!atlas) return <MapSetupScreen tasks={setupTasks} error={loadError} onRetry={reload}/>;

  const periodLabel = temporal ? `${MONTH_NAMES[month].slice(0, 3).toLowerCase()} ${year}` : '2025';
  const modeLabel = stack.filter(l => l.on).map(l => LAYERS[l.id].name).join(' · ') || 'Parcelas';
  const filtered = filters.state !== 'all' || filters.group !== 'all' || !!filters.yieldBand;
  const right = draftMode ? 'draft' : rightPanel ?? (selected ? 'parcel' : null);
  const isSheet = SHEETS.includes(left as Sheet);
  const leftWidth = !left ? 0 : isMobile ? 0 : isSheet ? Math.min(780, Math.max(560, viewWidth * .5)) : 340;
  // The month strip shares the bottom edge with the tool strip; it only appears when both fit.
  // Fill the gap up to the tool strip rather than leave a thin map sliver between them.
  // Milli's chat docks to the right edge on desktop; the map, the dashboard and the right-hand cards make room for it.
  const chatWidth = assistant && !isMobile ? Math.round(Math.min(460, Math.max(380, viewWidth * .3))) : 0;
  const timeWidth = Math.min(520, viewWidth - 66 - leftWidth - (left ? 28 : 0) - 520 - 40 - chatWidth);
  const showTime = temporal && !isMobile && timeWidth >= 300;
  const rightWidth = right && !isMobile ? 372 : 0;
  const openMilli = () => { setAssistant(true); setMilliOpened(true); };
  const identified = identify && plugins.identify ? parcels.find(p => p.properties.id === identify.id) : null;
  const estimates = parcels.map(p => p.properties.predictedYield).filter((v): v is number => v != null).sort((a, b) => a - b);
  const parcelRank = (p: Parcel) => p.properties.predictedYield == null ? null : { percentile: Math.round(estimates.filter(v => v < p.properties.predictedYield!).length / Math.max(1, estimates.length - 1) * 100), of: estimates.length };
  const selectionParcels = parcels.filter(p => selection.includes(p.properties.id));
  const freeWidth = viewWidth - 66 - leftWidth - rightWidth;
  const mapPanelHidden = dashboard && !(left === 'settings' || left === 'fuentes' || left === 'scripts' || left === 'notes');
  const cancellable = !!draftMode || !!measureKind || selectArea || rightPanel === 'export';
  const freeCenter = `calc(${leftWidth}px + (100% - ${leftWidth + rightWidth + chatWidth}px) / 2)`;

  const basemapPreview = (k: string) => <span className="block size-full bg-cover bg-center" style={{ backgroundImage: `url('/basemaps/${k}.png')` }}/>;
  const schemePreview = (k: Scheme) => <span data-scheme={k} className="grid size-full place-items-center bg-frame"><span className="flex items-center gap-1.5"><CropMark crop={k} size={34}/><span className="grid gap-1"><span className="h-1.5 w-8 rounded-full bg-primary"/><span className="h-1.5 w-5 rounded-full bg-primary-container"/><span className="h-1.5 w-6 rounded-full bg-tile-strong"/></span></span></span>;
  const enabledTool = (id: PluginId) => plugins[id];
  const commands: Command[] = [
    ...PHASES.map((p, i) => ({ id: `fase${i + 1}`, title: `Fase ${i + 1} · ${p.label}`, subtitle: p.detail, icon: <p.icon/>, keywords: p.key, run: () => goPhase(p.key) })),
    { id: 'tablero', title: 'Panel de control', subtitle: 'Estimado vs registrado, error en toneladas y pesos, tabla por ID_POLIGONO (Alt D)', icon: <ChartSpline/>, keywords: 'dashboard estimar tabla', run: () => setDashboard(true) },
    { id: 'economia', title: 'Economía del productor', subtitle: 'Ingreso, margen y punto de equilibrio con precio y costo editables', icon: <Calculator/>, keywords: 'calculadora costo precio margen', run: () => { setDashboard(true); setEconomics(true); } },
    { id: 'base', title: 'Mapa base', subtitle: 'Topográfico, claro, oscuro o satélite', icon: <Layers3/>, keywords: 'basemap fondo', carousel: 'base' },
    { id: 'esquema', title: 'Esquema de color', subtitle: 'Una paleta por cultivo: maíz, sorgo, trigo, arroz, cebada y mijo', icon: <Palette/>, keywords: 'tema color scheme cultivo', carousel: 'scheme' },
    { id: dark ? 'claro' : 'oscuro', title: dark ? 'Tema claro' : 'Tema oscuro', subtitle: 'Cambia la luminosidad del marco', icon: dark ? <Sun/> : <Moon/>, run: () => setDark(d => !d) },
    ...(Object.entries(LAYERS) as [LayerId, (typeof LAYERS)[LayerId]][]).map(([id, l]) => ({ id: 'capa ' + l.name.toLowerCase(), title: `Capa · ${l.name}${isOn(stack, id) ? ' · apagar' : ''}`, subtitle: l.subtitle, icon: <l.icon/>, keywords: `capa ${id}`, run: () => setStack(s => updateLayer(s, id, { on: !isOn(s, id) })) })),
    ...(enabledTool('sam') ? [{ id: 'delimitar', title: 'Delimitar con IA', subtitle: 'SAM 2.1 sobre Sentinel-2', icon: <WandSparkles/>, run: startSegment }] : []),
    ...(enabledTool('draw') ? [{ id: 'dibujar', title: 'Dibujar parcela', subtitle: 'Polígono manual', icon: <PenLine/>, run: startDraw }] : []),
    ...(enabledTool('measure') ? [{ id: 'medir', title: 'Medir distancia', subtitle: 'Distancia geodésica', icon: <Ruler/>, run: () => toggleMeasure('distance') }] : []),
    ...(enabledTool('area') ? [{ id: 'area', title: 'Medir área', subtitle: 'Superficie en hectáreas', icon: <SquareDashed/>, run: () => toggleMeasure('area') }] : []),
    ...(enabledTool('swipe') ? [{ id: 'comparar', title: 'Comparar con deslizador', subtitle: 'Capa activa vs mapa base', icon: <Columns2/>, run: () => setSwipe(s => s == null ? .5 : null) }] : []),
    ...(enabledTool('select') ? [{ id: 'seleccionar', title: 'Seleccionar por área', subtitle: 'Arrastra un rectángulo sobre el mapa', icon: <BoxSelect/>, run: toggleSelect }] : []),
    ...(enabledTool('table') ? [{ id: 'tabla', title: 'Tabla de atributos', subtitle: 'Todas las parcelas visibles, enlazadas al mapa', icon: <Table2/>, run: () => setLeft('tabla') }] : []),
    { id: 'entrega', title: 'Descargar entrega del reto', subtitle: 'CSV con ID_POLIGONO y rendimiento de las 59 parcelas', icon: <Send/>, keywords: 'exportar csv submission', run: () => download('agrocebada-entrega-59.csv', submissionCsv(atlas.predictions), 'text/csv') },
    ...(enabledTool('export') ? [{ id: 'exportar', title: 'Exportar', subtitle: 'PNG, GeoJSON y CSV', icon: <Download/>, run: () => setRightPanel('export') }] : []),
    ...(enabledTool('locate') ? [{ id: 'ubicacion', title: 'Mi ubicación', subtitle: 'GPS del navegador', icon: <LocateFixed/>, run: locateMe }] : []),
    { id: 'ajustes', title: 'Ajustes', subtitle: 'Tema, esquema de color, complementos y fuentes', icon: <Settings/>, keywords: 'configuración plugins complementos', run: () => setLeft('settings') },
    { id: 'fuentes', title: 'Datos y fuentes', subtitle: 'Procedencia, periodos y descargas', icon: <Database/>, run: () => setLeft('fuentes') },
    { id: 'salir', title: 'Cerrar sesión', subtitle: 'Vuelve a la pantalla de acceso', icon: <LogOut/>, run: () => void logout() },
  ];

  // Every pressed tool's icon morphs into an X and C cancels it, except the comparison slider,
  // which keeps its icon and stays on: it works on top of the other tools.
  const tools: { id: PluginId; label: string; icon: ReactNode; pressed: boolean; run: () => void; busy?: boolean }[] = [
    { id: 'sam', label: 'Delimitar con IA', icon: <WandSparkles/>, pressed: draftMode === 'segment', run: startSegment },
    { id: 'draw', label: 'Dibujar parcela', icon: <PenLine/>, pressed: draftMode === 'draw', run: startDraw },
    { id: 'measure', label: 'Medir distancia', icon: <Ruler/>, pressed: measureKind === 'distance', run: () => toggleMeasure('distance') },
    { id: 'area', label: 'Medir área', icon: <SquareDashed/>, pressed: measureKind === 'area', run: () => toggleMeasure('area') },
    { id: 'select', label: 'Seleccionar por área', icon: <BoxSelect/>, pressed: selectArea, run: toggleSelect },
    { id: 'swipe', label: 'Comparar con deslizador', icon: <Columns2/>, pressed: swipe != null, run: () => setSwipe(s => s == null ? .5 : null) },
    { id: 'identify', label: 'Identificar al pasar', icon: <MousePointerClick/>, pressed: plugins.identify, run: () => togglePlugin('identify', !plugins.identify) },
    { id: 'table', label: 'Tabla de atributos', icon: <Table2/>, pressed: left === 'tabla', run: () => openLeft('tabla') },
    { id: 'export', label: 'Exportar', icon: <Download/>, pressed: rightPanel === 'export', run: () => setRightPanel(p => p === 'export' ? null : 'export') },
    { id: 'locate', label: 'Mi ubicación', icon: <LocateFixed/>, pressed: false, busy: locating, run: locateMe },
  ];
  // The pill keeps the editing and analysis tools; identify and the table live in
  // the layers panel, the bar and the launcher, so the strip stays short.
  const visibleTools = tools.filter(t => plugins[t.id] && !['identify', 'table'].includes(t.id));
  toolKeys.current = isMobile ? [] : visibleTools.map(t => t.run);
  const panelTitle = (k: Left) => PANEL_ITEMS.find(p => p.key === k)?.label ?? ({ fuentes: 'Datos y fuentes', tabla: 'Tabla de atributos', settings: 'Ajustes', scripts: 'Scripts', notes: 'Notas' } as Record<string, string>)[k];

  return <TooltipProvider delayDuration={300}>
  <div className="shell fixed inset-0 flex select-none max-md:flex-col" data-phase={phase}>
    <Bar panel={left && PANEL_KEYS.includes(left) ? left as LeftPanel : null} dashboard={dashboard} economics={economics} filtered={filtered}
      onDashboard={() => setDashboard(d => !d)} onEconomics={setEconomics} onPanel={openLeft} onLogout={() => void logout()}/>

    <div className="relative min-h-0 flex-1 p-(--gap) md:pl-0">
      <main ref={viewport} className="relative h-full select-text" aria-label="Atlas AgroCebada" style={{ '--left-w': `${leftWidth}px`, '--right-w': `${rightWidth + chatWidth}px` } as CSSProperties}>
        {/* The map and everything that belongs to it fade away for the dashboard page. */}
        <motion.div className="absolute inset-0" inert={dashboard} initial={false} animate={dashboard ? { opacity: 0, scale: .985, filter: 'blur(6px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: .38, ease: [.4, 0, .2, 1] }} style={{ pointerEvents: dashboard ? 'none' : undefined }}>
          <div className="shell-viewport absolute inset-0 overflow-hidden bg-tile">
            <AtlasMap ref={map} atlas={atlas} parcels={visibleParcels} selected={selected} layers={stack} year={year} keyDate={key} settings={layers} manifest={manifest} imageryVisible={draftMode === 'segment'}
              padding={{ left: leftWidth, right: rightWidth + chatWidth }} statusTarget={isMobile || launcher !== null ? null : statusEl} highlightId={hoverId} swipe={swipe} selectArea={selectArea}
              onReady={mapReady} onImageryBusy={setImageryBusy} onImageryFailure={() => setPlaying(false)} onMeasure={setMeasureValue} onFullscreen={setFullscreen}
              onHover={(id, pixel) => setIdentify(id && pixel ? { id, pixel } : null)}
              onAreaSelect={ids => { setSelection(ids); setRightPanel('selection'); setSelectArea(false); }}
              onSelect={id => { setRightPanel(null); chooseParcel(id); }} onDraft={setDraft} onCancel={() => { cancelDraft(); setMeasureKind(null); }}
              onMapClick={draftMode === 'segment' && !adjusting ? coords => { if (!segmenting) void infer([...prompts, { coordinates: coords, label: promptLabel }]); } : undefined} tempLayers={tempList}/>
            <TempLayerChips className="absolute bottom-3 left-[calc(var(--left-w)+0.75rem)] z-[8]"/>
            <AgentFigures className="pointer-events-none absolute top-14 right-[calc(var(--right-w)+0.75rem)] z-[9] flex max-h-[calc(100%-5rem)] w-[min(26rem,calc(100%-2rem))] flex-col gap-2 overflow-y-auto"/>
            {swipe != null && <SwipeDivider value={swipe} onChange={setSwipe} container={viewport} label={modeLabel}/>}
            {identified && <IdentifyCard parcel={identified} pixel={identify!.pixel} atlas={atlas} keyDate={key} container={viewport}/>}
          </div>

          {/* Transient status, centred in the free map area. */}
          <div className="pointer-events-none absolute top-14 z-20 flex -translate-x-1/2 flex-col items-center gap-2" style={{ left: freeCenter }}>
            {liveImagery && (imageryError || !manifest || imageryBusy) && <div role={manifest || imageryError ? 'status' : undefined} className={cn('imagery-caption pointer-events-auto flex w-fit items-center gap-2 rounded-full bg-frame px-3.5 py-1.5 text-xs text-muted-foreground shadow-md', imageryError && 'text-amber-800 dark:text-amber-200')}>
              {imageryError ? <><TriangleAlert className="size-3.5"/><span>{imageryError}</span><Button size="xs" variant="outline" className="rounded-full" onClick={() => setImageryRevision(v => v + 1)}>Reintentar</Button></> : <LoadingState label={manifest ? 'Preparando imágenes Sentinel-2…' : 'Cargando observaciones Sentinel-2…'}/>}
            </div>}
            {measureKind && <div role="status" className="pointer-events-auto flex items-center gap-2 rounded-full bg-frame py-1.5 px-3.5 text-sm shadow-md"><Ruler className="size-4 text-muted-foreground"/><span className="text-muted-foreground">{measureKind === 'area' ? 'Área' : 'Distancia'}</span><span className="font-medium tabular-nums">{measureValue ?? 'Haz clic en el mapa'}</span></div>}
            {selectArea && <div role="status" className="pointer-events-auto flex items-center gap-2 rounded-full bg-frame py-1.5 px-3.5 text-sm shadow-md"><BoxSelect className="size-4 text-muted-foreground"/>Arrastra un rectángulo sobre las parcelas</div>}
          </div>

          {/* Right edge: parcel card, selection summary, export, delineation. */}
          <AnimatePresence mode="wait">
          {right && <Popout key={right + (chatWidth ? '-beside-milli' : '')} edges={isMobile ? 'bottom' : ['right', 'top']} label={right === 'parcel' ? 'Ficha de parcela' : undefined} className={isMobile ? 'inset-x-0 bottom-0 max-h-[70%]' : 'top-0 right-0 max-h-[calc(100%-4.5rem)]'} style={isMobile ? undefined : { width: rightWidth, right: chatWidth }}>
            {right === 'parcel' && selected && <ParcelPanel parcel={selected} atlas={atlas} year={year} month={month} onClose={() => { setSelectedId(null); setTouring(false); }} onLocate={() => map.current?.fitParcel(selected)} onEdit={startEdit} onNext={nextParcel}
              ranking={parcelRank(selected)} onSimilar={() => { const y = selected.properties.predictedYield; if (y == null) return; setFilters(f => ({ ...f, yieldBand: [y - .25, y + .25] })); setLeft('filters'); setTimeout(() => map.current?.fitAll(), 60); }}/>}
            {right === 'selection' && <SelectionSummary parcels={selectionParcels} atlas={atlas} keyDate={key} onClose={() => { setRightPanel(null); setSelection([]); }} onPick={id => chooseParcel(id, true)}/>}
            {right === 'export' && <div className="flex min-h-0 flex-col">
              <header className="flex items-center gap-1 pt-3 pr-3 pl-5"><h2 className="flex-1 text-base font-medium">Exportar</h2><ShellButton label="Cerrar exportación" side="bottom" onClick={() => setRightPanel(null)}><X/></ShellButton></header>
              <div className="grid gap-2 overflow-y-auto px-4 pt-1 pb-4">
                <p className="px-1 text-[13px] text-muted-foreground">{visibleParcels.length} {visibleParcels.length === 1 ? 'parcela visible' : 'parcelas visibles'} · {modeLabel} · {periodLabel}</p>
                {([[Send, 'Entrega del reto', 'ID_POLIGONO y rendimiento · 59 parcelas', () => download('agrocebada-entrega-59.csv', submissionCsv(atlas.predictions), 'text/csv')], [ImageDown, 'Imagen del mapa', 'PNG de la vista actual', () => void exportMap()], [FileJson, 'Parcelas · GeoJSON', 'Límites, estimaciones y atributos', () => download('parcelas.geojson', JSON.stringify({ type: 'FeatureCollection', features: visibleParcels }), 'application/geo+json')], [FileSpreadsheet, 'Parcelas · CSV', 'Estimado, intervalo 80 % y producción', () => download('parcelas.csv', parcelCsv(visibleParcels, atlas, key), 'text/csv')]] as const).map(([Icon, title, detail, run]) =>
                  <button key={title} type="button" onClick={run} className="flex items-center gap-3 rounded-2xl bg-tile px-3 py-2.5 text-left hover:bg-tile-strong"><span className="grid size-9 place-items-center rounded-full bg-primary-container text-on-primary-container"><Icon className="size-4"/></span><span className="grid flex-1 leading-tight"><span className="text-sm font-medium">{title}</span><span className="text-xs text-muted-foreground">{detail}</span></span><Download className="size-4 text-muted-foreground"/></button>)}
              </div>
            </div>}
            {right === 'draft' && <section aria-label="Delimitación de parcela" className={cn('delineation-card flex min-h-0 flex-col', compactDelineation && 'compact')}>
              <header className="flex items-center gap-1 pt-3 pr-3 pl-5">
                <h2 className="flex-1 truncate text-base font-medium">{draftMode === 'segment' ? 'Delimita tu terreno' : draftMode === 'edit' ? 'Corrige los límites' : 'Dibuja tu parcela'}</h2>
                <ShellButton label={compactDelineation ? 'Expandir controles de delimitación' : 'Contraer controles de delimitación'} side="bottom" onClick={() => setCompactDelineation(!compactDelineation)}>{compactDelineation ? <ChevronDown/> : <ChevronUp/>}</ShellButton>
                <ShellButton label="Cancelar delimitación" side="bottom" onClick={cancelDraft}><X/></ShellButton>
              </header>
              <div className="grid min-h-0 flex-1 gap-3.5 overflow-y-auto px-5 pt-1 pb-3">
                <div className="grid gap-1"><span className="w-fit rounded-full bg-primary-container px-2.5 py-0.5 text-xs text-on-primary-container">{draftMode === 'segment' ? 'SAM 2.1 · Sentinel-2 RGB' : draftMode === 'edit' ? 'Edición de límites' : 'Dibujo manual'}</span>
                  {!compactDelineation && <p className="text-[13px] leading-relaxed text-muted-foreground">{draftMode === 'segment' ? 'Haz clic dentro del terreno. Añade puntos para incluir o excluir áreas y revisa la propuesta antes de guardarla.' : 'Ajusta los vértices. Al dibujar, un doble clic cierra el polígono.'}</p>}</div>
                {draftMode === 'segment' && <>
                  <div role="group" aria-label="Tipo de punto" className="grid grid-cols-2 gap-1 rounded-full bg-tile p-1">
                    {([[1, '+ Incluir', 'bg-emerald-500'], [0, '− Excluir', 'bg-rose-500']] as const).map(([value, label, dot]) => <button key={label} type="button" aria-pressed={promptLabel === value && !adjusting} onClick={() => { setAdjusting(false); map.current?.proposal(draft); setPromptLabel(value); }} className="flex h-8 items-center justify-center gap-2 rounded-full text-sm text-muted-foreground aria-pressed:bg-frame aria-pressed:text-foreground aria-pressed:shadow-sm"><span className={cn('size-2 rounded-full', dot)}/>{label}</button>)}
                  </div>
                  {!compactDelineation && <p className="text-xs text-muted-foreground">{MONTH_NAMES[month]} {year} · límites aproximados de 10 m · {prompts.length} {prompts.length === 1 ? 'punto' : 'puntos'}</p>}
                  {segmenting && <div className="rounded-2xl bg-tile px-3 py-2 text-sm"><LoadingState label="Buscando límites de la parcela…"/></div>}
                  {segmentError && <Alert className="rounded-2xl"><TriangleAlert/><AlertDescription>{segmentError}</AlertDescription></Alert>}
                  {proposal?.warnings.map(w => <p key={w} className="rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">{w}</p>)}
                  <div className="flex flex-wrap gap-1.5"><Button variant="outline" size="sm" className="rounded-full bg-transparent" disabled={segmenting || !prompts.length} onClick={() => void infer(prompts)}>Reintentar</Button><Button variant="outline" size="sm" className="rounded-full bg-transparent" disabled={!draft || segmenting} onClick={() => { setAdjusting(true); setCompactDelineation(true); map.current?.editDraft(draft!); }}>Ajustar vértices</Button><Button variant="ghost" size="sm" className="rounded-full" onClick={startDraw}><PencilRuler/>Dibujar manualmente</Button></div>
                </>}
                {draftMode === 'draw' && <div className="flex flex-wrap gap-1.5"><Button variant="outline" size="sm" className="rounded-full bg-transparent" onClick={() => map.current?.undo()}>Deshacer punto</Button><Button variant="outline" size="sm" className="rounded-full bg-transparent" onClick={() => map.current?.finish()}>Cerrar polígono</Button></div>}
                <div className="draft-area flex items-baseline justify-between rounded-2xl bg-tile px-3.5 py-2.5"><span className="text-sm text-muted-foreground">Superficie</span>{draft ? <b className="text-2xl font-normal tabular-nums">{fmt(polygonArea(draft))}<span className="ml-1 text-sm text-muted-foreground">ha</span></b> : segmenting ? <LoadingValue label="Calculando superficie de la propuesta" unit="ha"/> : <b className="text-2xl font-normal text-muted-foreground/60">—<span className="ml-1 text-sm">ha</span></b>}</div>
                {draftMode !== 'edit' && <Field><FieldLabel htmlFor="field-name">Nombre de la parcela</FieldLabel><Input id="field-name" value={fieldName} onChange={e => setFieldName(e.target.value)} className="rounded-full bg-tile"/></Field>}
              </div>
              <footer className="flex items-center gap-2 px-4 pb-4"><Button variant="outline" onClick={cancelDraft} className="mr-auto rounded-full bg-transparent">Cancelar</Button>{proposal && <ShellButton label="Exportar propuesta y correcciones" disabled={!draft} onClick={exportProposal}><Download/></ShellButton>}<Button className="rounded-full" disabled={!draft || saving || segmenting} onClick={() => void saveDraft()}>{saving ? <><Spinner/>Guardando…</> : draftMode === 'edit' ? 'Guardar límites' : 'Guardar parcela'}</Button></footer>
            </section>}
          </Popout>}
          </AnimatePresence>

          {/* Bottom-left: time. Bottom-centre: launcher. Bottom-right: tools and navigation. */}
          <AnimatePresence mode="wait">
          {showTime && launcher === null && <Popout key={'time' + (left ? 'l' : '')} edges={left ? 'bottom' : ['bottom', 'left']} className="bottom-0 @container/time" style={{ width: timeWidth, left: left ? leftWidth + 28 : 0 }}>
            <div className="pt-1 pr-2 pb-0.5"><TimeSlider year={year} month={month} keyDate={key} playing={playing} onPlay={setPlaying} onMonth={setMonth} onDate={(y, m) => { setYear(y); setMonth(m); }}/></div>
          </Popout>}
          </AnimatePresence>

          <AnimatePresence>
          {launcher === null && !(isMobile && (left || right)) && <Popout key={chatWidth ? 'tools-beside-milli' : 'tools'} edges={isMobile ? 'right' : ['bottom', 'right']} label="Herramientas del mapa" animate={milliOpened} className={isMobile ? 'top-1/2 right-0 -translate-y-1/2' : 'right-0 bottom-0 max-w-[36rem]'} style={chatWidth ? { right: chatWidth } : undefined}>
            <AnimatePresence>{cancellable && !isMobile && <motion.p key="cancel-hint" aria-live="polite" className="pointer-events-none absolute right-4 bottom-full mb-1.5 text-xs whitespace-nowrap text-foreground [text-shadow:0_0_2px_var(--frame),0_0_4px_var(--frame),0_0_8px_var(--frame)]"
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: .2 }}>Presiona <kbd className="font-sans font-semibold">C</kbd> para cancelar</motion.p>}</AnimatePresence>
          <div role="toolbar" aria-label="Herramientas del mapa" className={cn('flex items-center gap-0.5 px-1.5 pt-1.5', isMobile && 'flex-col pb-1.5')}>
              {!isMobile && <><ShellButton label={`Buscar o ejecutar un comando (${shortcutKey} K)`} onClick={() => setLauncher('')}><Search/></ShellButton><span className="mx-1 h-5 w-px bg-border" aria-hidden="true"/></>}
              {visibleTools.filter(t => !isMobile || ['sam', 'measure', 'export', 'locate'].includes(t.id)).map(t => <ShellButton key={t.id} label={t.label} side={isMobile ? 'left' : 'top'} pressed={t.pressed} busy={t.busy} morph={t.id !== 'swipe'} hotkey={isMobile ? undefined : String(visibleTools.indexOf(t) + 1)} onClick={t.run}>{t.icon}</ShellButton>)}
              <span className={cn('mx-1 h-5 w-px bg-border', isMobile && 'h-px w-5')} aria-hidden="true"/>
              <ShellButton label="Ver todas las parcelas" side={isMobile ? 'left' : 'top'} onClick={() => map.current?.fitAll()}><Home/></ShellButton>
              <ShellButton label="Alejar mapa" side={isMobile ? 'left' : 'top'} onClick={() => map.current?.zoomBy(-1)}><Minus/></ShellButton>
              <ShellButton label="Acercar mapa" side={isMobile ? 'left' : 'top'} onClick={() => map.current?.zoomBy(1)}><Plus/></ShellButton>
              {!isMobile && <ShellButton label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'} pressed={fullscreen} onClick={() => void map.current?.toggleFullscreen()}><Maximize/></ShellButton>}
            </div>
            {!isMobile && <div ref={setStatusEl} className="px-3.5 pt-1 pb-2"/>}
          </Popout>}
          </AnimatePresence>
        </motion.div>

        {setupVisible && <div className="absolute inset-0 z-50 grid place-items-center overflow-y-auto rounded-(--view-r) bg-frame/60 p-4 backdrop-blur-sm"><MapSetup tasks={setupTasks} error={loadError} onRetry={reload}/></div>}

        {/* Dashboard pages. Switching page plays the map → dashboard transition: the outgoing page shrinks,
            blurs and fades like the map does while the new one fades in; closing the dashboard keeps its quick exit. */}
        <AnimatePresence custom={dashboard}>
        {dashboard && <motion.section key={economics ? 'economics' : 'dashboard'} aria-label={economics ? 'Economía del productor' : 'Panel de control'} className="dashboard-canvas absolute inset-0 z-20 overflow-hidden rounded-(--view-r)"
          variants={PAGE} initial="enter" animate="shown" exit="leave">
          <motion.div className="h-full overflow-y-auto" initial={false} animate={{ paddingRight: chatWidth }} transition={{ duration: .38, ease: [.4, 0, .2, 1] }}><div className="w-full px-4 pt-14 pb-4">
            {economics ? <EconomicsPanel atlas={atlas} parcels={parcels} selected={selected} onLocate={id => { setDashboard(false); chooseParcel(id, true); }}/>
            : <EstimationPanel atlas={atlas} parcels={parcels} keyDate={key} onSelect={id => chooseParcel(id)}
              onLocate={id => { setDashboard(false); chooseParcel(id, true); }}
              onShowSelection={showSelection}/>}
          </div></motion.div>
        </motion.section>}
        </AnimatePresence>

        {/* Left edge: map panels, settings and the full-height sheets. Kept out of the map layer so
            Ajustes and Datos y fuentes also open over the dashboard; map panels fade with the map. */}
        <motion.div className="pointer-events-none absolute inset-0 z-30 *:pointer-events-auto" inert={mapPanelHidden} initial={false}
          animate={mapPanelHidden ? { opacity: 0, filter: 'blur(6px)' } : { opacity: 1, filter: 'blur(0px)' }} transition={{ duration: .38, ease: [.4, 0, .2, 1] }}>
          <AnimatePresence mode="wait">
          {left && <Popout key={left} edges={isMobile ? 'bottom' : isSheet ? ['left', 'top', 'bottom'] : ['left', 'top']} label={panelTitle(left)} className={isMobile ? 'inset-x-0 bottom-0 max-h-[72%]' : isSheet ? 'top-0 bottom-0 left-0' : 'top-0 left-0 max-h-[calc(100%-4.5rem)]'} style={isMobile ? { height: isSheet ? '72%' : undefined } : { width: leftWidth }}>
            {left === 'tabla' && <AttributeTable atlas={atlas} parcels={visibleParcels} selectedId={selectedId} keyDate={key} onSelect={id => chooseParcel(id, true)} onHover={setHoverId} onClose={() => setLeft(null)}/>}
            {left !== 'tabla' && <>
              <header className="flex items-center gap-2 pt-3 pr-3 pl-5"><h2 className="flex-1 text-sm font-medium">{panelTitle(left)}</h2><ShellButton label="Cerrar panel" side="bottom" onClick={() => setLeft(null)}><X/></ShellButton></header>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-4">
                {left === 'layers' && <div className="grid gap-4"><TempLayerRows/><LayersPanel layers={stack} onChange={setStack}/></div>}
                {left === 'basemap' && <BasemapPanel settings={layers} onBase={base => setLayers(l => ({ ...l, base }))}/>}
                {left === 'filters' && <div className="grid gap-6">
                  <FiltersPanel state={filters.state} group={filters.group} band={filters.yieldBand} count={visibleParcels.length} total={parcels.length} onChange={next => setFilters(f => ({ ...f, ...next }))} onReset={() => setFilters(f => ({ ...f, state: 'all', group: 'all', yieldBand: null }))}/>
                  <section className="grid gap-2"><SectionTitle>Marcadores</SectionTitle><BookmarksPanel parcels={parcels} onAll={() => map.current?.fitAll()} onFit={bounds => map.current?.fitBounds(bounds)}/></section>
                </div>}
                {left === 'scripts' && <ScriptsPanel/>}
                {left === 'notes' && <NotesPanel/>}
                {left === 'settings' && <SettingsPanel dark={dark} scheme={scheme} preview={schemePreview} onDark={setDark} onScheme={setScheme} onSources={() => setLeft('fuentes')}>
                  <PluginsPanel enabled={plugins} onToggle={togglePlugin}/>
                  <McpSettings/>
                </SettingsPanel>}
                {left === 'fuentes' && <SourcesPage atlas={atlas}/>}
              </div>
            </>}
          </Popout>}
          </AnimatePresence>
        </motion.div>

        {launcher !== null && <div aria-hidden="true" onClick={() => setLauncher(null)} className="absolute inset-0 z-[35] rounded-(--view-r) bg-frame/60 backdrop-blur-[2px]"/>}


        {/* Top: the Agente de IA Milli (milli is Náhuatl for crop). Pinned to the centre above
            every other layer, on the map and the dashboard. The chat's runtime lives above the
            island, so closing it keeps the conversation and Milli keeps working. */}
        <MilliProvider>
        <div data-milli className="absolute top-0 left-1/2 z-[60] -translate-x-1/2">
          <AnimatePresence>
          {!assistant && <Popout key="island" edges="top" radius={16} className="relative" animate={milliOpened}>
            <MilliIsland onOpen={openMilli}/>
          </Popout>}
          {assistant && isMobile && <Popout key="assistant" edges="top" label={MILLI} className="relative">
            <MilliChat onClose={() => setAssistant(false)}/>
          </Popout>}
          </AnimatePresence>
        </div>
        {/* Opened on desktop, the chat swells out of the right edge while the island melts back into the top. */}
        <AgentPermission/>
        <div data-milli className="pointer-events-none absolute inset-0 z-[60] *:pointer-events-auto">
          <AnimatePresence>
          {assistant && !isMobile && <Popout key="assistant-docked" edges={['right', 'top', 'bottom']} label={MILLI} className="top-0 right-0 bottom-0" style={{ width: chatWidth }}>
            <MilliChat docked onClose={() => setAssistant(false)}/>
          </Popout>}
          </AnimatePresence>
        </div>
        </MilliProvider>

        <AnimatePresence>
        {launcher !== null
          ? <Popout key="launcher" edges="bottom" label="Lanzador" className={cn('shadow-[0_-18px_48px_-20px_rgb(0_0_0/0.35)]', isMobile ? 'inset-x-0 bottom-0 z-40' : 'bottom-0 z-40 -translate-x-1/2')} style={isMobile ? undefined : { left: freeCenter }}>
              <Launcher initial={launcher} parcels={parcels} commands={commands}
                carousels={{ base: { items: BASEMAPS.map(b => ({ key: b.key, label: b.label, preview: basemapPreview(b.key) })), value: layers.base, onPick: base => setLayers(l => ({ ...l, base: base as LayerSettings['base'] })) }, scheme: { items: SCHEMES.map(s => ({ key: s.key, label: s.label, preview: schemePreview(s.key) })), value: scheme, onPick: s => setScheme(s as Scheme) } }}
                onClose={() => setLauncher(null)} onParcel={id => chooseParcel(id, true)} onPlace={coords => { map.current?.locate(coords); }} onMunicipality={(name, geometry) => { map.current?.fitGeometry(geometry); toast(name); }}/>
            </Popout>
          : null}
        </AnimatePresence>
      </main>
    </div>
    <MobileDock panel={left && PANEL_KEYS.includes(left) ? left as LeftPanel : null} dashboard={dashboard} onLogo={() => setLauncher('')} onDashboard={() => setDashboard(d => !d)} onPanel={openLeft}/>
  </div>
  <Toaster position="top-right"/>
  </TooltipProvider>;
}

/** The closed island: Milli's name, its dots waving while it works, and the eye when the user stopped following. */
function MilliIsland({ onOpen }: { onOpen: () => void }) {
  const working = useMilliWorking();
  return <div className="flex items-center pr-1.5">
    <button type="button" onClick={onOpen} aria-label={`Abrir ${MILLI}`} className="flex h-10 items-center gap-2.5 pr-3.5 pl-2.5 text-sm text-muted-foreground hover:text-foreground">
      <MilliAvatar size={26}/><MilliName working={working} className="text-foreground"/>
    </button>
    <MilliEye/>
  </div>;
}

/** Scripts, after ArcGIS's script tools. A placeholder until we settle how scripts run. */
function ScriptsPanel() {
  return <div className="grid justify-items-center gap-3 px-2 py-10 text-center">
    <span className="grid size-12 place-items-center rounded-full bg-primary-container text-on-primary-container"><CodeXml className="size-5"/></span>
    <p className="text-sm font-medium">Scripts</p>
    <p className="max-w-64 text-xs text-pretty text-muted-foreground">Aquí podrás crear y ejecutar scripts sobre las parcelas y sus estimaciones, como las herramientas de script de ArcGIS. Pronto definiremos cómo funcionarán.</p>
  </div>;
}

/** Appearance, plugins and the data sources, gathered off the bar. */
function SettingsPanel({ dark, scheme, preview, onDark, onScheme, onSources, children }: { dark: boolean; scheme: Scheme; preview: (k: Scheme) => ReactNode; onDark: (dark: boolean) => void; onScheme: (s: Scheme) => void; onSources: () => void; children: ReactNode }) {
  return <div className="grid gap-6">
    <section className="grid gap-2"><SectionTitle>Tema</SectionTitle>
      <div role="group" aria-label="Tema" className="grid grid-cols-2 gap-1 rounded-full bg-tile p-1">
        {([[false, 'Claro', Sun], [true, 'Oscuro', Moon]] as const).map(([value, label, Icon]) => <button key={label} type="button" aria-pressed={dark === value} onClick={() => onDark(value)} className="relative flex h-8 items-center justify-center gap-2 rounded-full text-sm text-muted-foreground transition-colors aria-pressed:text-foreground [&_svg]:size-4">
          {dark === value && <ShiftPill id="theme-pill" className="bg-frame shadow-sm"/>}
          <span className="relative z-10 flex items-center gap-2"><Icon/>{label}</span>
        </button>)}
      </div>
    </section>
    <section className="grid gap-2"><SectionTitle>Esquema de color</SectionTitle>
      <div role="group" aria-label="Esquema de color" className="grid grid-cols-2 gap-2">
        {SCHEMES.map(s => <button key={s.key} type="button" aria-pressed={scheme === s.key} onClick={() => onScheme(s.key)} className="grid gap-1.5 rounded-2xl bg-tile p-1.5 pb-2 text-sm text-muted-foreground outline-none hover:bg-tile-strong focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-primary-container aria-pressed:text-on-primary-container">
          <span className="block h-16 overflow-hidden rounded-xl">{preview(s.key)}</span>{s.label}
        </button>)}
      </div>
    </section>
    <section className="grid gap-2"><SectionTitle>Complementos</SectionTitle>{Array.isArray(children) ? children[0] : children}</section>
    {Array.isArray(children) && children[1] && <section className="grid gap-2"><SectionTitle>MCP de esta pestaña</SectionTitle>{children[1]}</section>}
    <section className="grid gap-2"><SectionTitle>Datos</SectionTitle>
      <button type="button" onClick={onSources} className="flex items-center gap-3 rounded-2xl bg-tile px-3 py-2.5 text-left hover:bg-tile-strong"><span className="grid size-9 place-items-center rounded-full bg-primary-container text-on-primary-container"><Database className="size-4"/></span><span className="grid flex-1 leading-tight"><span className="text-sm font-medium">Datos y fuentes</span><span className="text-xs text-muted-foreground">Procedencia, periodos y descargas</span></span></button>
    </section>
  </div>;
}

/** ArcGIS-style swipe: drag the divider; data layers show to its left, the basemap to its right. */
function SwipeDivider({ value, onChange, container, label }: { value: number; onChange: (v: number) => void; container: React.RefObject<HTMLElement | null>; label: string }) {
  const drag = (event: React.PointerEvent) => {
    const box = container.current?.getBoundingClientRect(); if (!box) return;
    const move = (e: PointerEvent) => onChange(Math.max(.02, Math.min(.98, (e.clientX - box.left) / box.width)));
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); event.preventDefault();
  };
  return <div className="swipe-handle" style={{ left: `${value * 100}%` }} onPointerDown={drag}>
    <span className="pointer-events-none absolute top-16 right-3 rounded-full bg-frame px-2.5 py-1 text-[11px] whitespace-nowrap shadow-md">{label}</span>
    <span className="pointer-events-none absolute top-16 left-3 rounded-full bg-frame px-2.5 py-1 text-[11px] whitespace-nowrap shadow-md">Mapa base</span>
    <button type="button" role="slider" aria-label="Posición del comparador" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}
      onKeyDown={e => { if (e.key === 'ArrowLeft') onChange(Math.max(.02, value - .05)); if (e.key === 'ArrowRight') onChange(Math.min(.98, value + .05)); }}
      className="grid size-10 cursor-ew-resize place-items-center rounded-full bg-frame text-primary shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"><Columns2 className="size-4"/></button>
  </div>;
}

/** Value-tool card that follows the cursor over a parcel. */
function IdentifyCard({ parcel, pixel, atlas, keyDate, container }: { parcel: Parcel; pixel: [number, number]; atlas: Atlas; keyDate: string; container: React.RefObject<HTMLElement | null> }) {
  const p = parcel.properties, width = container.current?.clientWidth ?? 1200;
  const ndvi = atlas.details[p.id]?.ndvi['Sentinel-2']?.[keyDate]?.mean, weather = atlas.details[p.id]?.climate[keyDate];
  const flip = pixel[0] > width - 260;
  return <div className="identify-card absolute z-30 w-56 rounded-2xl bg-frame p-3 text-xs shadow-xl" style={{ left: flip ? pixel[0] - 236 : pixel[0] + 16, top: Math.max(8, pixel[1] - 20) }}>
    <p className="font-mono text-[11px] text-muted-foreground">{p.id}</p>
    <p className="truncate text-sm font-medium">{p.name || p.municipality}</p>
    <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 tabular-nums">
      <dt className="text-muted-foreground">Estimado</dt><dd className="text-right font-medium text-primary">{fmt(p.predictedYield)} t/ha</dd>
      <dt className="text-muted-foreground">Registrado</dt><dd className="text-right">{fmt(p.observedYield)} t/ha</dd>
      <dt className="text-muted-foreground">Superficie</dt><dd className="text-right">{fmt(p.area)} ha</dd>
      <dt className="text-muted-foreground">NDVI del mes</dt><dd className="text-right">{fmt(ndvi)}</dd>
      <dt className="text-muted-foreground">Lluvia del mes</dt><dd className="text-right">{fmt(weather?.precipitation, 0)} mm</dd>
      <dt className="text-muted-foreground">T máx del mes</dt><dd className="text-right">{fmt(weather?.tmax, 1)} °C</dd>
    </dl>
  </div>;
}

/** Statistics for a box selection (ArcGIS Dashboards-style indicators). */
function SelectionSummary({ parcels, atlas, keyDate, onClose, onPick }: { parcels: Parcel[]; atlas: Atlas; keyDate: string; onClose: () => void; onPick: (id: string) => void }) {
  const est = parcels.filter(p => p.properties.predictedYield != null);
  const area = parcels.reduce((t, p) => t + p.properties.area, 0), production = est.reduce((t, p) => t + p.properties.predictedYield! * p.properties.area, 0), estArea = est.reduce((t, p) => t + p.properties.area, 0);
  const band = est.reduce((t, p) => t + atlas.predictions.metrics.mae_t_ha * p.properties.area, 0);
  return <div className="flex min-h-0 flex-col">
    <header className="flex items-center gap-1 pt-3 pr-3 pl-5"><h2 className="flex-1 text-base font-medium">Selección</h2><ShellButton label="Borrar selección" side="bottom" onClick={onClose}><X/></ShellButton></header>
    <div className="grid min-h-0 gap-2 overflow-y-auto px-4 pt-1 pb-4">
      {parcels.length ? <>
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Parcelas" value={String(parcels.length)} hint={`${est.length} con estimación`}/>
          <Stat label="Superficie" value={fmt(area, 1)} unit="ha"/>
          <Stat label="Producción estimada" value={fmt(production, 0)} unit="t" hint={`±${fmt(band, 0)} t con el error típico`}/>
          <Stat label="Rendimiento medio" value={fmt(estArea ? production / estArea : null)} unit="t/ha" hint="Ponderado por superficie"/>
        </div>
        <ul className="grid gap-0.5">{parcels.slice(0, 40).map(p => <li key={p.properties.id}><button type="button" onClick={() => onPick(p.properties.id)} className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-[13px] hover:bg-tile"><span className="font-mono text-xs">{p.properties.name || p.properties.id}</span><span className="truncate text-muted-foreground">{p.properties.municipality}</span><span className="ml-auto tabular-nums">{fmt(p.properties.predictedYield)}</span></button></li>)}</ul>
        <Button variant="outline" className="rounded-full bg-transparent" onClick={() => download('agrocebada-seleccion.csv', parcelCsv(parcels, atlas, keyDate), 'text/csv')}><FileSpreadsheet/>Descargar selección</Button>
      </> : <p className="py-6 text-center text-sm text-muted-foreground">El rectángulo no tocó ninguna parcela. Acércate y vuelve a intentarlo.</p>}
    </div>
  </div>;
}
