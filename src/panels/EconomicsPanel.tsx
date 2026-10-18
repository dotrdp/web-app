// Economía del productor: the calculator page of the dashboard. Turns the estimate and its
// out-of-fold error into money at an editable price and, when the producer enters one, a
// cost per hectare: income with its range, margin and break-even yield, for all parcels, a
// set, or the selected parcel, plus the same reading per parcel in a table.
import { useMemo, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable, useDataTable } from '@/components/ui/data-table';
import { fmt } from '../lib';
import { COVERAGE_LABEL, DEFAULT_PRICE_MXN_T, money, productiveError } from '../model';
import type { Coverage } from '../model';
import { Stat } from './EstimationPanel';
import { TABLE_OPTIONS } from './table-es';
import type { Atlas, Parcel } from '../types';

type Scope = 'all' | 'prediction' | 'training' | 'selected';
type Row = { parcel: Parcel; estimate: number; production: number; income: number; band: number; cost: number | null; margin: number | null };

export default function EconomicsPanel({ atlas, parcels, selected, onLocate }: { atlas: Atlas; parcels: Parcel[]; selected: Parcel | null; onLocate: (id: string) => void }) {
  const model = atlas.predictions, m = model.metrics;
  const [price, setPrice] = useState(DEFAULT_PRICE_MXN_T);
  const [costHa, setCostHa] = useState<number | null>(null);
  const [coverage, setCoverage] = useState<Coverage>('0.8');
  const [scope, setScope] = useState<Scope>(selected ? 'selected' : 'all');
  const locate = useRef(onLocate); locate.current = onLocate;
  const scopes: [Scope, string][] = [['all', 'Todas'], ['prediction', 'Reservadas · 59'], ['training', 'Con rendimiento · 138'], ...(selected ? [['selected', selected.properties.name || selected.properties.id] as [Scope, string]] : [])];
  const current = scope === 'selected' && !selected ? 'all' : scope;

  const rows = useMemo<Row[]>(() => parcels
    .filter(p => p.properties.predictedYield != null && (current === 'all' || (current === 'selected' ? p === selected : p.properties.group === current)))
    .map(p => {
      const estimate = p.properties.predictedYield!, area = p.properties.area, production = estimate * area, income = production * price;
      const cost = costHa == null ? null : costHa * area;
      return { parcel: p, estimate, production, income, band: model.absErrorQuantiles[coverage] * area * price, cost, margin: cost == null ? null : income - cost };
    }), [parcels, current, selected, price, costHa, coverage, model]);

  const totals = useMemo(() => {
    const sum = (f: (r: Row) => number) => rows.reduce((t, r) => t + f(r), 0);
    const area = sum(r => r.parcel.properties.area), production = sum(r => r.production), income = sum(r => r.income);
    const breakEven = costHa == null || price <= 0 ? null : costHa / price;
    return { area, production, income, band: sum(r => r.band), cost: costHa == null ? null : costHa * area, margin: costHa == null ? null : income - costHa * area,
      breakEven, above: breakEven == null ? null : rows.filter(r => r.estimate >= breakEven).length };
  }, [rows, costHa, price]);

  // What the typical error means on one parcel: the selected one, or the median-sized parcel.
  const medianArea = useMemo(() => { const a = parcels.map(p => p.properties.area).sort((x, y) => x - y); return a[Math.floor(a.length / 2)] ?? 0; }, [parcels]);
  const area = selected?.properties.area ?? medianArea;
  const typical = productiveError(m.mae_t_ha, area, price), band = productiveError(model.absErrorQuantiles[coverage], area, price);
  const maxShare = Math.max(...Object.values(model.shareWithin));

  const columns = useMemo<ColumnDef<Row>[]>(() => [
    { id: 'id', accessorFn: r => r.parcel.properties.name || r.parcel.properties.id, header: 'ID_POLIGONO', cell: ({ getValue }) => <span className="font-mono text-xs">{String(getValue())}</span> },
    { id: 'municipality', accessorFn: r => r.parcel.properties.municipality, header: 'Municipio', meta: { variant: 'multi-select' } },
    { id: 'area', accessorFn: r => r.parcel.properties.area, header: 'Superficie ha', cell: ({ getValue }) => fmt(getValue<number>()), meta: { align: 'right', variant: 'range-slider' } },
    { id: 'estimate', accessorKey: 'estimate', header: 'Rendimiento t/ha', cell: ({ getValue }) => <span className="font-medium">{fmt(getValue<number>())}</span>, meta: { align: 'right', variant: 'range-slider' } },
    { id: 'production', accessorKey: 'production', header: 'Producción t', cell: ({ getValue }) => fmt(getValue<number>(), 1), meta: { align: 'right', variant: 'range-slider' } },
    { id: 'income', accessorKey: 'income', header: 'Ingreso estimado', cell: ({ getValue }) => money(getValue<number>()), meta: { align: 'right', variant: 'range-slider' } },
    { id: 'band', accessorKey: 'band', header: `± Ingreso ${COVERAGE_LABEL[coverage]}`, enableColumnFilter: false, cell: ({ getValue }) => <span className="text-muted-foreground">±{money(getValue<number>())}</span>, meta: { align: 'right' } },
    { id: 'margin', accessorKey: 'margin', header: 'Margen', sortUndefined: 'last', enableColumnFilter: false, meta: { align: 'right' },
      cell: ({ getValue }) => { const v = getValue<number | null>(); return v == null ? <span className="text-muted-foreground">—</span> : <span className={v < 0 ? 'font-medium text-destructive' : 'font-medium'}>{money(v)}</span>; } },
    { id: 'locate', header: () => <span className="sr-only">Mapa</span>, enableSorting: false, enableColumnFilter: false, enableHiding: false, size: 48, meta: { align: 'right' },
      cell: ({ row }) => { const f = row.original.parcel.properties; return <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label={`Ver ${f.name || f.id} en el mapa`} title="Ver en el mapa" onClick={() => locate.current(f.id)}><MapPin/></Button>; } },
  ], [coverage]);
  const table = useDataTable<Row>({ ...TABLE_OPTIONS, data: rows, columns, getRowId: r => r.parcel.properties.id, initialState: { sorting: [{ id: 'income', desc: true }] },
    renderCaption: () => <span className="sr-only">Economía por parcela</span> });

  return <div className="@container/econ grid min-w-0 gap-3 *:min-w-0">
    <header className="grid gap-0.5">
      <h2 className="text-xl font-medium tracking-tight">Economía del productor</h2>
      <p className="text-xs text-pretty text-muted-foreground">Ingreso, margen y riesgo a partir del rendimiento estimado y su error fuera de partición. El precio y el costo son supuestos editables, no cotizaciones.</p>
    </header>

    <div className="grid gap-3 *:min-w-0 @4xl/econ:grid-cols-[minmax(18rem,1fr)_2.4fr]">
      <section aria-label="Supuestos" className="tile grid content-start gap-3 rounded-[20px] p-4 text-sm">
        <h3 className="text-sm font-medium">Supuestos</h3>
        <label className="grid gap-1"><span className="text-xs text-muted-foreground">Precio de la cebada (MXN/t)</span>
          <input type="number" min={0} step={100} value={price} onChange={e => setPrice(Math.max(0, Number(e.target.value) || 0))} aria-label="Precio de la cebada en pesos por tonelada" className="h-9 rounded-full bg-frame px-3.5 tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"/></label>
        <label className="grid gap-1"><span className="text-xs text-muted-foreground">Costo de producción (MXN/ha)</span>
          <input type="number" min={0} step={500} value={costHa ?? ''} placeholder="Escribe tu costo por hectárea" onChange={e => setCostHa(e.target.value === '' ? null : Math.max(0, Number(e.target.value) || 0))} aria-label="Costo de producción en pesos por hectárea" className="h-9 rounded-full bg-frame px-3.5 tabular-nums outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"/></label>
        <div className="grid gap-1"><span className="text-xs text-muted-foreground">Cobertura del rango</span>
          <div role="group" aria-label="Cobertura del rango" className="flex w-fit rounded-full bg-frame p-0.5 text-xs">
            {(Object.keys(COVERAGE_LABEL) as Coverage[]).map(c => <button key={c} type="button" aria-pressed={coverage === c} onClick={() => setCoverage(c)} className="rounded-full px-3 py-1 aria-pressed:bg-primary aria-pressed:text-primary-foreground">{COVERAGE_LABEL[c]}</button>)}
          </div>
        </div>
        <div className="grid gap-1"><span className="text-xs text-muted-foreground">Parcelas</span>
          <div role="group" aria-label="Parcelas incluidas" className="flex flex-wrap gap-1 rounded-[18px] bg-frame p-0.5 text-xs">
            {scopes.map(([key, label]) => <button key={key} type="button" aria-pressed={current === key} onClick={() => setScope(key)} className="rounded-full px-3 py-1 aria-pressed:bg-primary aria-pressed:text-primary-foreground">{label}</button>)}
          </div>
        </div>
      </section>

      <section aria-label="Resultado" className="grid content-start gap-2 @2xl/econ:grid-cols-3">
        <Stat label="Producción estimada" value={fmt(totals.production, 0)} unit="t" hint={`${rows.length} ${rows.length === 1 ? 'parcela' : 'parcelas'} · ${fmt(totals.area, 1)} ha`}/>
        <Stat label="Ingreso estimado" value={money(totals.income)} hint={`± ${money(totals.band)} con ${COVERAGE_LABEL[coverage]} de cobertura (suma por parcela, cota conservadora)`}/>
        <Stat label="Ingreso por hectárea" value={totals.area ? money(totals.income / totals.area) : '—'} hint={`a ${money(price)}/t`}/>
        <Stat label="Costo total" value={totals.cost == null ? '—' : money(totals.cost)} hint={costHa == null ? 'Escribe tu costo por hectárea para calcularlo' : `${money(costHa)}/ha`}/>
        <Stat label="Margen estimado" value={totals.margin == null ? '—' : money(totals.margin)} className={totals.margin != null && totals.margin < 0 ? 'text-destructive' : undefined} hint={totals.margin == null ? 'Ingreso menos costo' : `${money(totals.margin / Math.max(totals.area, 1e-9))}/ha`}/>
        <Stat label="Punto de equilibrio" value={totals.breakEven == null ? '—' : fmt(totals.breakEven)} unit={totals.breakEven == null ? undefined : 't/ha'} hint={totals.above == null ? 'Rendimiento que cubre el costo' : `${totals.above} de ${rows.length} parcelas lo superan`}/>
      </section>
    </div>

    <section aria-labelledby="error-money-title" className="grid gap-3 rounded-[20px] bg-primary-container/60 p-4 text-on-primary-container @3xl/econ:grid-cols-[1.4fr_1fr]">
      <div className="grid content-start gap-2">
        <h3 id="error-money-title" className="text-sm font-medium">¿Qué significa el error para un productor?</h3>
        <p className="text-[13px] leading-relaxed text-pretty">En {selected ? <b className="font-medium">{selected.properties.name || selected.properties.id}</b> : <>una parcela típica</>} de <b className="font-medium tabular-nums">{fmt(area, 2)} ha</b>, el error típico de <b className="font-medium tabular-nums">±{fmt(m.mae_t_ha)} t/ha</b> equivale a <b className="font-medium tabular-nums">±{fmt(typical.tonnes, 2)} t</b> de grano, unos <b className="font-medium tabular-nums">±{money(typical.pesos)}</b> a {money(price)}/t. En {COVERAGE_LABEL[coverage]} de las parcelas evaluadas el error fue menor que <b className="font-medium tabular-nums">{fmt(model.absErrorQuantiles[coverage])} t/ha</b> (±{fmt(band.tonnes, 2)} t · ±{money(band.pesos)}).</p>
        <p className="text-[11px] text-pretty opacity-80">Selecciona una parcela en el mapa o en el panel de control para usar su superficie.</p>
      </div>
      <figure aria-label="Proporción de parcelas por debajo de cada error" className="grid content-end gap-1.5">
        <figcaption className="text-xs">Parcelas con error menor que…</figcaption>
        {Object.entries(model.shareWithin).filter(([t]) => t !== '0.1').map(([t, share]) => <div key={t} className="grid grid-cols-[4.2rem_1fr_2.6rem] items-center gap-2 text-xs tabular-nums">
          <span>{fmt(Number(t))} t/ha</span>
          <span className="h-2 overflow-hidden rounded-full bg-frame/70"><span className="block h-full rounded-full bg-primary" style={{ width: `${share / maxShare * 100}%` }}/></span>
          <span className="text-right font-medium">{Math.round(share * 100)} %</span>
        </div>)}
      </figure>
    </section>

    <section aria-labelledby="econ-table-title" className="grid gap-2 *:min-w-0">
      <h3 id="econ-table-title" className="text-sm font-medium">Economía por parcela</h3>
      <DataTable table={table} surfaceClassName="max-h-[calc(100dvh-11rem)] rounded-2xl"/>
    </section>
  </div>;
}
