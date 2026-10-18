// Attribute table (ArcGIS / QGIS): every visible parcel with its attributes,
// sortable and filterable, selection and hover linked to the map.
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown, FileSpreadsheet, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { download, fmt, normalize, parcelCsv } from '../lib';
import type { Atlas, Parcel } from '../types';

type Column = { key: string; label: string; value: (p: Parcel) => number | string | null; digits?: number; className?: string };

export default function AttributeTable({ atlas, parcels, selectedId, keyDate, onSelect, onHover, onClose }: { atlas: Atlas; parcels: Parcel[]; selectedId: string | null; keyDate: string; onSelect: (id: string) => void; onHover: (id: string | null) => void; onClose: () => void }) {
  const columns = useMemo<Column[]>(() => ([
    { key: 'id', label: 'ID_POLIGONO', value: p => p.properties.name || p.properties.id, className: 'font-mono text-xs' },
    { key: 'municipality', label: 'Municipio', value: p => p.properties.municipality, className: 'max-w-32 truncate' },
    { key: 'area', label: 'AREA_HA', value: p => p.properties.area, digits: 2 },
    { key: 'group', label: 'Conjunto', value: p => ({ training: 'Entrenamiento', prediction: 'Reservada', custom: 'Propia' })[p.properties.group] },
    { key: 'observed', label: 'Registrado', value: p => p.properties.observedYield, digits: 2 },
    { key: 'predicted', label: 'Estimado', value: p => p.properties.predictedYield, digits: 2 },
    { key: 'ndvi', label: 'NDVI mes', value: p => atlas.details[p.properties.id]?.ndvi['Sentinel-2']?.[keyDate]?.mean ?? null, digits: 2 },
  ] as Column[]), [atlas, keyDate]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ key: string; desc: boolean }>({ key: 'id', desc: false });
  const rows = useMemo(() => {
    const term = normalize(query), column = columns.find(c => c.key === sort.key) ?? columns[0];
    return parcels.filter(p => !term || normalize(`${p.properties.id} ${p.properties.name ?? ''} ${p.properties.municipality} ${p.properties.state}`).includes(term))
      .sort((a, b) => { const x = column.value(a), y = column.value(b); if (x == null) return 1; if (y == null) return -1; const c = typeof x === 'string' ? x.localeCompare(String(y)) : x - (y as number); return sort.desc ? -c : c; });
  }, [parcels, query, sort, columns]);
  return <div className="flex h-full min-h-0 flex-col">
    <header className="flex flex-wrap items-center gap-2 px-5 pt-4 pb-3">
      <div className="grid min-w-0 flex-1 leading-tight"><h2 className="text-lg font-medium tracking-tight">Tabla de atributos</h2><p className="text-xs text-muted-foreground">{rows.length} de {parcels.length} parcelas visibles · enlazada al mapa</p></div>
      <label className="flex h-8 w-48 items-center gap-2 rounded-full bg-tile px-3 text-sm focus-within:ring-2 focus-within:ring-ring"><Search className="size-3.5 text-muted-foreground"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filtrar" aria-label="Filtrar tabla" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"/></label>
      <Button size="sm" variant="outline" className="rounded-full bg-transparent" onClick={() => download('agrocebada-tabla.csv', parcelCsv(rows, atlas, keyDate), 'text/csv')}><FileSpreadsheet/>CSV</Button>
      <Button variant="ghost" size="icon-sm" aria-label="Cerrar tabla" onClick={onClose} className="rounded-full"><X/></Button>
    </header>
    <div className="mx-5 mb-5 min-h-0 flex-1 overflow-auto rounded-2xl bg-tile/60">
      <table className="w-full text-left text-[13px]" aria-label="Atributos de las parcelas">
        <thead className="text-xs text-muted-foreground"><tr>{columns.map(c => <th key={c.key} scope="col" aria-sort={sort.key === c.key ? (sort.desc ? 'descending' : 'ascending') : 'none'} className={cn('sticky top-0 z-10 bg-frame px-2 py-2 font-medium whitespace-nowrap first:pl-3', c.digits != null && 'text-right')}>
          <button type="button" onClick={() => setSort(s => ({ key: c.key, desc: s.key === c.key ? !s.desc : c.digits != null }))} className="inline-flex items-center gap-1 hover:text-foreground">{c.label}{sort.key === c.key ? sort.desc ? <ArrowDown className="size-3"/> : <ArrowUp className="size-3"/> : <ChevronsUpDown className="size-3 opacity-40"/>}</button>
        </th>)}</tr></thead>
        <tbody>{rows.map(p => <tr key={p.properties.id} aria-selected={selectedId === p.properties.id} onClick={() => onSelect(p.properties.id)} onMouseEnter={() => onHover(p.properties.id)} onMouseLeave={() => onHover(null)} className="cursor-pointer border-t border-frame/80 hover:bg-tile aria-selected:bg-primary-container aria-selected:text-on-primary-container">
          {columns.map(c => { const v = c.value(p); return <td key={c.key} className={cn('px-2 py-1.5 whitespace-nowrap first:pl-3', c.digits != null && 'text-right tabular-nums', c.className)}>{typeof v === 'number' ? fmt(v, c.digits) : v ?? '—'}</td>; })}
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
}
