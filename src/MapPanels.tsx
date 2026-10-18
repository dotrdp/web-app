// Map panels: basemap gallery, parcel list, filters and bookmarks. The layer stack lives in
// LayersPanel.tsx.
import { useMemo, useState } from 'react';
import { ListFilter, MapPinned } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { fmt } from './lib';
import type { Atlas, LayerSettings, Parcel } from './types';

type Base = LayerSettings['base'];
export const BASEMAPS: { key: Base; label: string; hint: string }[] = [
  { key: 'topo', label: 'Topográfico', hint: 'Esri World Topographic' },
  { key: 'light', label: 'Claro', hint: 'Positron · OpenFreeMap' },
  { key: 'dark', label: 'Oscuro', hint: 'Dark · OpenFreeMap' },
  { key: 'satellite', label: 'Satélite', hint: 'Esri World Imagery' },
];

export const SectionTitle = ({ children }: { children: string }) => <h3 className="px-1 text-xs font-medium text-muted-foreground">{children}</h3>;

export function BasemapPanel({ settings, onBase }: { settings: LayerSettings; onBase: (base: Base) => void }) {
  return <div className="grid gap-4">
    <div className="grid grid-cols-2 gap-3" role="group" aria-label="Cartografía base">{BASEMAPS.map(b =>
      <button key={b.key} type="button" aria-label={b.label} aria-pressed={settings.base === b.key} onClick={() => onBase(b.key)} className="group grid gap-1.5 text-left outline-none">
        <span className={cn('block h-20 rounded-2xl border-0 bg-tile bg-cover bg-center transition-all group-hover:border-foreground/30 group-focus-visible:ring-3 group-focus-visible:ring-ring/50', settings.base === b.key && 'border-primary ring-2 ring-primary')} style={{ backgroundImage: `url('/basemaps/${b.key}.png')` }}/>
        <span className="grid leading-tight"><span className="text-sm font-medium">{b.label}</span><span className="text-xs text-muted-foreground">{b.hint}</span></span>
      </button>)}</div>
  </div>;
}

const SORTS = { id: 'ID', yield: 'Estimado', area: 'Superficie' } as const;
export function ParcelListPanel({ parcels, atlas, keyDate, selectedId, onSelect }: { parcels: Parcel[]; atlas: Atlas; keyDate: string; selectedId: string | null; onSelect: (id: string) => void }) {
  const [sort, setSort] = useState<keyof typeof SORTS>('id');
  const sorted = useMemo(() => [...parcels].sort((a, b) => sort === 'id' ? a.properties.id.localeCompare(b.properties.id) : sort === 'area' ? b.properties.area - a.properties.area : (b.properties.predictedYield ?? -1) - (a.properties.predictedYield ?? -1)), [parcels, sort]);
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
        className={cn('flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition-colors hover:bg-tile', active && 'bg-primary-container text-on-primary-container')}>
        <span className="grid min-w-0 flex-1 leading-tight"><span className="truncate text-sm font-medium">{p.properties.name || p.properties.id}</span><span className="truncate text-xs text-muted-foreground">{p.properties.municipality} · {p.properties.state}</span></span>
        {ndvi != null && <span className="h-1 w-10 overflow-hidden rounded-full bg-muted" title={`NDVI Landsat ${fmt(ndvi, 2)}`}><span className="block h-full rounded-full bg-chart-1" style={{ width: `${Math.max(0, Math.min(1, ndvi)) * 100}%` }}/></span>}
        {p.properties.predictedYield == null ? <Badge variant="secondary">Sin estimación</Badge> : <span className="min-w-16 text-right text-sm font-medium tabular-nums">{fmt(p.properties.predictedYield)} <span className="text-xs font-normal text-muted-foreground">t/ha</span></span>}
      </button></li>;
    })}</ul> : <Empty className="py-10"><EmptyHeader><EmptyMedia variant="icon"><MapPinned/></EmptyMedia><EmptyTitle>Sin parcelas</EmptyTitle><EmptyDescription>Ninguna parcela coincide con la búsqueda o los filtros.</EmptyDescription></EmptyHeader></Empty>}
  </div>;
}

const STATES = ['Hidalgo', 'Puebla', 'Tlaxcala'];
const GROUPS: [string, string][] = [['all', 'Todos'], ['training', 'Con rendimiento'], ['prediction', 'Reservadas'], ['custom', 'Mis terrenos']];
const Chip = ({ pressed, children, onClick }: { pressed: boolean; children: string; onClick: () => void }) =>
  <Button type="button" size="sm" variant={pressed ? 'default' : 'outline'} aria-pressed={pressed} onClick={onClick} className={cn('rounded-full', !pressed && 'bg-transparent')}>{children}</Button>;

export function FiltersPanel({ state, group, band, count, total, onChange, onReset }: { state: string; group: string; band?: [number, number] | null; count: number; total: number; onChange: (next: { state?: string; group?: string; yieldBand?: null }) => void; onReset: () => void }) {
  return <div className="grid gap-5">
    <div className="flex items-center justify-between rounded-2xl bg-tile px-3 py-2.5 text-sm text-muted-foreground"><span><span className="font-semibold text-foreground tabular-nums">{count}</span> de {total} parcelas</span>{(state !== 'all' || group !== 'all' || band) && <Button variant="link" size="sm" className="h-auto p-0" onClick={onReset}>Restablecer</Button>}</div>
    <section className="grid gap-2"><SectionTitle>Estado</SectionTitle><div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por estado">{['all', ...STATES].map(s => <Chip key={s} pressed={state === s} onClick={() => onChange({ state: s })}>{s === 'all' ? 'Todos' : s}</Chip>)}</div></section>
    {band && <section className="grid gap-2"><SectionTitle>Rendimiento estimado</SectionTitle><div className="flex flex-wrap gap-1.5"><Chip pressed onClick={() => onChange({ yieldBand: null })}>{`${fmt(band[0])}–${fmt(band[1])} t/ha ✕`}</Chip></div></section>}
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
    <Item asChild size="sm" className="cursor-pointer rounded-2xl hover:bg-tile"><button type="button" onClick={onClick} className="text-left">
      <ItemMedia variant="image" className="h-12 w-18 rounded-md border bg-cover" style={{ backgroundImage: "url('/artwork/login-topo.jpg')", backgroundPosition: position[key], backgroundSize: key === 'all' ? '260% auto' : '420% auto' }}/>
      <ItemContent><ItemTitle>{title}</ItemTitle><ItemDescription className="text-xs">{detail}</ItemDescription></ItemContent>
    </button></Item>
  </li>;
  return <ul className="-mx-1 grid gap-1" aria-label="Marcadores">
    {row('all', 'Todas las parcelas', 'Hidalgo · Puebla · Tlaxcala', onAll)}
    {bookmarks.map(b => row(b.state, b.state, `${b.count} parcelas`, () => onFit(b.bounds, b.state)))}
  </ul>;
}
