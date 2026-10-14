// Map panels (shadcn Item, Switch, Slider, Badge, Button): data layers with
// symbology, basemap gallery, parcel list, filters and bookmarks.
import { useMemo, useState } from 'react';
import { Toolbar } from 'react-aria-components/Toolbar';
import { ChartNoAxesCombined, Check, Droplets, Leaf, ListFilter, MapPinned, Mountain, Satellite, Sparkles, ThermometerSun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
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

const SectionTitle = ({ children }: { children: string }) => <h3 className="px-1 text-xs font-medium text-muted-foreground">{children}</h3>;

export function LayersPanel({ mode, technical, settings, year, onMode, onOpacity }: { mode: MapMode; technical: boolean; settings: LayerSettings; year: number; onMode: (mode: MapMode) => void; onOpacity: (opacity: number) => void }) {
  const modes = MODES.filter(m => !m.pro || technical || m.key === mode);
  const raster = ['ndvi', 'climate', 'terrain', 'landsat', 'alphaearth'].includes(mode);
  const transparency = Math.round((1 - settings.opacity) * 100);
  return <div className="grid gap-4">
    <section className="grid gap-2">
      <SectionTitle>Datos del territorio</SectionTitle>
      <Toolbar aria-label="Capas del territorio" orientation="vertical" className="grid gap-1">
        {modes.map(m => <Item key={m.key} asChild size="sm" variant={mode === m.key ? 'outline' : 'default'} className={cn('cursor-pointer text-left hover:bg-muted', mode === m.key && 'border-primary/15 bg-accent')}>
          <button type="button" aria-label={m.label} aria-pressed={mode === m.key} onClick={() => onMode(m.key)}>
            <ItemMedia variant="icon" className={cn('size-8 rounded-md border bg-background', mode === m.key && 'border-primary bg-primary text-primary-foreground')}><m.icon/></ItemMedia>
            <ItemContent className="min-w-0 gap-0.5"><ItemTitle>{m.label}</ItemTitle><ItemDescription className="truncate text-xs">{m.detail}</ItemDescription></ItemContent>
            {mode === m.key && <Check className="size-4 text-foreground" aria-hidden="true"/>}
          </button>
        </Item>)}
      </Toolbar>
    </section>
    <Separator/>
    <section className="grid gap-3">
      <SectionTitle>Simbología</SectionTitle>
      <MapLegend mode={mode} year={year} settings={settings}/>
      <div className="grid gap-2.5 rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2.5"><span className="grid size-6 place-items-center rounded-full bg-brand text-[10px] font-semibold text-brand-foreground ring-4 ring-brand/20">12</span>Grupo de parcelas · acércate para ver límites</div>
        <div className="flex items-center gap-2.5"><span className="mx-1.5 size-3 rounded-full border-2 border-background bg-brand shadow-[0_0_0_1px_var(--border)]"/>Parcela individual</div>
        <div className="flex items-center gap-2.5"><span className="h-4 w-6 rounded-sm border-[1.5px] border-chart-1 bg-chart-1/25"/>Límite de parcela · color según la capa</div>
      </div>
      {raster && <div className="grid gap-2.5">
        <div className="flex items-center justify-between text-xs"><Label htmlFor="layer-transparency" className="text-xs font-normal text-muted-foreground">Transparencia</Label><span className="font-medium tabular-nums">{transparency} %</span></div>
        <Slider id="layer-transparency" aria-label="Transparencia de la capa" min={0} max={90} step={5} value={[transparency]} onValueChange={([v]) => onOpacity(1 - v / 100)}/>
      </div>}
    </section>
  </div>;
}

export function BasemapPanel({ settings, onBase, onOverlay }: { settings: LayerSettings; onBase: (base: Base) => void; onOverlay: (key: 'states' | 'municipalities', visible: boolean) => void }) {
  return <div className="grid gap-4">
    <div className="grid grid-cols-2 gap-3" role="group" aria-label="Cartografía base">{BASEMAPS.map(b =>
      <button key={b.key} type="button" aria-label={b.label} aria-pressed={settings.base === b.key} onClick={() => onBase(b.key)} className="group grid gap-1.5 text-left outline-none">
        <span className={cn('block h-20 rounded-lg border bg-muted bg-cover bg-center transition-all group-hover:border-foreground/30 group-focus-visible:ring-3 group-focus-visible:ring-ring/50', settings.base === b.key && 'border-primary ring-2 ring-primary')} style={{ backgroundImage: `url('/basemaps/${b.key}.png')` }}/>
        <span className="grid leading-tight"><span className="text-sm font-medium">{b.label}</span><span className="text-xs text-muted-foreground">{b.hint}</span></span>
      </button>)}</div>
    <Separator/>
    <section className="grid gap-3">
      <SectionTitle>Límites</SectionTitle>
      {([['states', 'Límites estatales', 'INEGI · 3 estados'], ['municipalities', 'Municipios', 'INEGI · 361 límites']] as const).map(([key, label, hint]) =>
        <div key={key} className="flex items-center justify-between gap-3 px-1">
          <Label htmlFor={`overlay-${key}`} className="grid gap-0.5 font-normal"><span className="text-sm font-medium">{label}</span><span className="text-xs text-muted-foreground">{hint}</span></Label>
          <Switch id={`overlay-${key}`} aria-label={label} checked={settings[key]} onCheckedChange={checked => onOverlay(key, checked)}/>
        </div>)}
    </section>
  </div>;
}

const SORTS = { id: 'ID', yield: 'Rendimiento', area: 'Superficie' } as const;
export function ParcelListPanel({ parcels, atlas, keyDate, selectedId, onSelect }: { parcels: Parcel[]; atlas: Atlas; keyDate: string; selectedId: string | null; onSelect: (id: string) => void }) {
  const [sort, setSort] = useState<keyof typeof SORTS>('id');
  const sorted = useMemo(() => [...parcels].sort((a, b) => sort === 'id' ? a.properties.id.localeCompare(b.properties.id) : sort === 'area' ? b.properties.area - a.properties.area : (b.properties.observedYield ?? -1) - (a.properties.observedYield ?? -1)), [parcels, sort]);
  return <div className="grid gap-3">
    <div className="flex items-center justify-between gap-2 px-1">
      <span className="text-sm text-muted-foreground"><span className="font-medium text-foreground tabular-nums">{parcels.length}</span> parcelas</span>
      <Select value={sort} onValueChange={value => setSort(value as keyof typeof SORTS)}>
        <SelectTrigger size="sm" aria-label="Ordenar parcelas" className="w-36"><ListFilter/><SelectValue/></SelectTrigger>
        <SelectContent>{Object.entries(SORTS).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
    {parcels.length ? <ul className="-mx-1 grid gap-0.5" aria-label="Parcelas del mapa">{sorted.map(p => {
      const ndvi = atlas.landsat[keyDate]?.parcels[p.properties.id]?.mean;
      const active = selectedId === p.properties.id;
      return <li key={p.properties.id}><button type="button" aria-current={active || undefined} onClick={() => onSelect(p.properties.id)}
        className={cn('flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted', active && 'bg-accent')}>
        <span className="grid min-w-0 flex-1 leading-tight"><span className="truncate text-sm font-medium">{p.properties.name || p.properties.id}</span><span className="truncate text-xs text-muted-foreground">{p.properties.municipality} · {p.properties.state}</span></span>
        {ndvi != null && <span className="h-1 w-10 overflow-hidden rounded-full bg-muted" title={`NDVI Landsat ${fmt(ndvi, 2)}`}><span className="block h-full rounded-full bg-chart-1" style={{ width: `${Math.max(0, Math.min(1, ndvi)) * 100}%` }}/></span>}
        {p.properties.observedYield == null ? <Badge variant="secondary">Predicción</Badge> : <span className="min-w-16 text-right text-sm font-medium tabular-nums">{fmt(p.properties.observedYield)} <span className="text-xs font-normal text-muted-foreground">t/ha</span></span>}
      </button></li>;
    })}</ul> : <Empty className="py-10"><EmptyHeader><EmptyMedia variant="icon"><MapPinned/></EmptyMedia><EmptyTitle>Sin parcelas</EmptyTitle><EmptyDescription>Ninguna parcela coincide con la búsqueda o los filtros.</EmptyDescription></EmptyHeader></Empty>}
  </div>;
}

export function MapLegend({ mode, year, settings }: { mode: MapMode; year: number; settings: LayerSettings }) {
  const climate = settings.precipitation ? ['Precipitación', '0', '1488 mm/mes', 'from-sky-50 via-sky-300 to-sky-800'] : settings.tmax ? ['Temperatura máxima', '4', '42 °C', 'from-blue-500 via-amber-100 to-red-600'] : settings.tmin ? ['Temperatura mínima', '4', '42 °C', 'from-blue-500 via-amber-100 to-red-600'] : null;
  const terrain = settings.elevation ? ['Elevación', '8', '5608 m', 'from-green-700 via-yellow-200 to-stone-100'] : settings.slope ? ['Pendiente', '0', '71°', 'from-green-700 via-yellow-200 to-stone-100'] : null;
  const ramp = (title: string, from: string, to: string, gradient: string, note?: string) => <div className="grid gap-1.5" key={title}>
    <div className="flex items-baseline justify-between gap-2 text-sm"><span className="font-medium">{title}</span>{note && <span className="text-xs text-muted-foreground">{note}</span>}</div>
    <div className={cn('h-2 rounded-full bg-linear-to-r', gradient)}/>
    <div className="flex justify-between text-xs text-muted-foreground tabular-nums"><span>{from}</span><span>{to}</span></div>
  </div>;
  return <div className="map-legend grid gap-4 px-1">
    {mode === 'parcels' && ramp('Rendimiento registrado', '0', '8 t/ha', 'from-amber-400 via-lime-400 to-green-700', 'Ciclo 2025')}
    {mode === 'ndvi' && ramp('Vegetación · NDVI', '−1', '1', 'from-amber-800 via-yellow-200 to-green-700', 'Sentinel-2 · 10 m')}
    {mode === 'landsat' && ramp('NDVI · Landsat C2', '−1', '1', 'from-amber-800 via-yellow-200 to-green-700', '30 m')}
    {mode === 'water' && <div className="grid gap-1.5 text-sm"><div className="flex items-baseline justify-between gap-2"><span className="font-medium">Candidatos de agua</span><span className="text-xs text-muted-foreground">MNDWI ≥ {settings.waterThreshold ?? 0} · 20 m</span></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="size-2.5 rounded-full bg-sky-500"/>Píxeles sobre el umbral</div></div>}
    {mode === 'alphaearth' && ramp('AlphaEarth', 'A00 · A01 · A02', 'RGB', 'from-violet-600 via-sky-500 to-lime-500', `Anual ${year}`)}
    {climate && ramp(climate[0], climate[1], climate[2], climate[3])}
    {terrain && ramp(terrain[0], terrain[1], terrain[2], terrain[3])}
  </div>;
}

const STATES = ['Hidalgo', 'Puebla', 'Tlaxcala'];
const GROUPS: [string, string][] = [['all', 'Todos'], ['training', 'Entrenamiento'], ['prediction', 'Predicción'], ['custom', 'Mis terrenos']];
const Chip = ({ pressed, children, onClick }: { pressed: boolean; children: string; onClick: () => void }) =>
  <Button type="button" size="sm" variant={pressed ? 'default' : 'outline'} aria-pressed={pressed} onClick={onClick} className="rounded-full">{children}</Button>;

export function FiltersPanel({ state, group, count, total, onChange, onReset }: { state: string; group: string; count: number; total: number; onChange: (next: { state?: string; group?: string }) => void; onReset: () => void }) {
  return <div className="grid gap-5">
    <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground"><span><span className="font-semibold text-foreground tabular-nums">{count}</span> de {total} parcelas</span>{(state !== 'all' || group !== 'all') && <Button variant="link" size="sm" className="h-auto p-0" onClick={onReset}>Restablecer</Button>}</div>
    <section className="grid gap-2"><SectionTitle>Estado</SectionTitle><div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por estado">{['all', ...STATES].map(s => <Chip key={s} pressed={state === s} onClick={() => onChange({ state: s })}>{s === 'all' ? 'Todos' : s}</Chip>)}</div></section>
    <section className="grid gap-2"><SectionTitle>Conjunto</SectionTitle><div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por conjunto">{GROUPS.map(([key, label]) => <Chip key={key} pressed={group === key} onClick={() => onChange({ group: key })}>{label}</Chip>)}</div></section>
  </div>;
}

export function BookmarksPanel({ parcels, onFit, onAll }: { parcels: Parcel[]; onFit: (bounds: number[], label: string) => void; onAll: () => void }) {
  const bookmarks = STATES.map(state => {
    const items = parcels.filter(p => p.properties.state === state);
    const bounds = items.reduce((b, p) => [Math.min(b[0], p.properties.bounds[0]), Math.min(b[1], p.properties.bounds[1]), Math.max(b[2], p.properties.bounds[2]), Math.max(b[3], p.properties.bounds[3])], [Infinity, Infinity, -Infinity, -Infinity]);
    return { state, count: items.length, bounds };
  }).filter(b => b.count);
  const position: Record<string, string> = { all: '62% 46%', Hidalgo: '72% 36%', Puebla: '92% 40%', Tlaxcala: '52% 56%' };
  const row = (key: string, title: string, detail: string, onClick: () => void) => <li key={key}>
    <Item asChild size="sm" className="cursor-pointer hover:bg-muted"><button type="button" onClick={onClick} className="text-left">
      <ItemMedia variant="image" className="h-12 w-18 rounded-md border bg-cover" style={{ backgroundImage: "url('/artwork/login-topo.jpg')", backgroundPosition: position[key], backgroundSize: key === 'all' ? '260% auto' : '420% auto' }}/>
      <ItemContent><ItemTitle>{title}</ItemTitle><ItemDescription className="text-xs">{detail}</ItemDescription></ItemContent>
    </button></Item>
  </li>;
  return <ul className="-mx-1 grid gap-1" aria-label="Marcadores">
    {row('all', 'Todas las parcelas', 'Hidalgo · Puebla · Tlaxcala', onAll)}
    {bookmarks.map(b => row(b.state, b.state, `${b.count} parcelas`, () => onFit(b.bounds, b.state)))}
  </ul>;
}
