// Economía del productor: the calculator page of the dashboard. Turns the estimate and its
// out-of-fold error into money at an editable price and, when the producer enters one, a
// cost per hectare (typed, or worked out from the seed, bought by the kilo (seeds per m² and
// thousand-kernel weight) or by the bulto (m² one bulto sows), plus other costs): income with its range, margin and break-even yield, for all
// parcels, a set, or the selected parcel, plus the same reading per parcel in a table.
import { useMemo, useRef, useState } from 'react';
import { MapPin, Sprout, X } from 'lucide-react';
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable, useDataTable } from '@/components/ui/data-table';
import { fmt } from '../lib';
import { COVERAGE_LABEL, DEFAULT_PRICE_MXN_T, money, productiveError } from '../model';
import type { Coverage } from '../model';
import { Stat } from './EstimationPanel';
import RegionError from './RegionError';
import ShiftPill from '../shell/ShiftPill';
import { TABLE_OPTIONS } from './table-es';
import type { Atlas, Parcel } from '../types';

type Scope = 'all' | 'prediction' | 'training' | 'selected';
type Seed = { unit: 'kg' | 'bulto'; price: number | null; perM2: number | null; tkw: number | null; bagPrice: number | null; bagM2: number | null; other: number | null };
/** Typical barley thousand-kernel weight (g); editable, as seed lots vary. */
const DEFAULT_TKW_G = 45;
/** Seed rate: seeds/m² × thousand-kernel weight (g) ÷ 100 = kg/ha (10,000 m²/ha, 1,000 seeds, 1,000 g/kg). */
const seedKgHa = (perM2: number, tkw: number) => perM2 * tkw / 100;
/** Seed cost per hectare: kg/ha × price per kg, or bultos/ha (10,000 m² ÷ m² per bulto) × price per bulto. */
function seedCostHa(s: Seed) {
  if (s.unit === 'kg') return s.price != null && s.perM2 != null && s.tkw != null ? seedKgHa(s.perM2, s.tkw) * s.price : null;
  return s.bagPrice != null && s.bagM2 ? 10_000 / s.bagM2 * s.bagPrice : null;
}
type Row = { parcel: Parcel; estimate: number; production: number; income: number; band: number; cost: number | null; margin: number | null };

export default function EconomicsPanel({ atlas, parcels, selected, onLocate }: { atlas: Atlas; parcels: Parcel[]; selected: Parcel | null; onLocate: (id: string) => void }) {
  const model = atlas.predictions, m = model.metrics;
  const [price, setPrice] = useState(DEFAULT_PRICE_MXN_T);
  const [costHa, setCostHa] = useState<number | null>(null);
  // Seed calculator: once its inputs are complete it fills the cost per hectare (seed + other costs).
  const [seed, setSeed] = useState<Seed>({ unit: 'kg', price: null, perM2: null, tkw: DEFAULT_TKW_G, bagPrice: null, bagM2: null, other: null });
  const seedKg = seed.unit === 'kg' && seed.perM2 != null && seed.tkw != null ? seedKgHa(seed.perM2, seed.tkw) : null;
  const bags = seed.unit === 'bulto' && seed.bagM2 ? 10_000 / seed.bagM2 : null;
  const seedCost = seedCostHa(seed);
  const updateSeed = (next: Partial<Seed>) => {
    const s = { ...seed, ...next }; setSeed(s);
    const cost = seedCostHa(s); if (cost != null) setCostHa(Math.round(cost + (s.other ?? 0)));
  };
  const seedFields: (readonly [Exclude<keyof Seed, 'unit'>, string, string, number])[] = [
    ...(seed.unit === 'kg'
      ? [['price', 'Precio de la semilla (MXN/kg)', 'Precio de la semilla en pesos por kilogramo', 1], ['perM2', 'Semillas por m²', 'Semillas sembradas por metro cuadrado', 10], ['tkw', 'Peso de mil semillas (g)', 'Peso de mil semillas en gramos', 1]] as const
      : [['bagPrice', 'Precio del bulto (MXN)', 'Precio del bulto de semilla en pesos', 10], ['bagM2', '¿Cuántos m² siembra un bulto?', 'Metros cuadrados que siembra un bulto', 100]] as const),
    ['other', 'Otros costos (MXN/ha)', 'Otros costos de producción en pesos por hectárea', 500],
  ];
  const numberOrNull = (value: string) => value === '' ? null : Math.max(0, Number(value) || 0);
  const [coverage, setCoverage] = useState<Coverage>('0.8');
  const [scope, setScope] = useState<Scope>(selected ? 'selected' : 'all');
  const locate = useRef(onLocate); locate.current = onLocate;
  const [checked, setChecked] = useState<RowSelectionState>({});
  const scopes: [Scope, string][] = [['all', 'Todas'], ['prediction', 'Reservadas · 59'], ['training', 'Con rendimiento · 138'], ...(selected ? [['selected', selected.properties.name || selected.properties.id] as [Scope, string]] : [])];
  const current = scope === 'selected' && !selected ? 'all' : scope;

  const rows = useMemo<Row[]>(() => parcels
    .filter(p => p.properties.predictedYield != null && (current === 'all' || (current === 'selected' ? p === selected : p.properties.group === current)))
    .map(p => {
      const estimate = p.properties.predictedYield!, area = p.properties.area, production = estimate * area, income = production * price;
      const cost = costHa == null ? null : costHa * area;
      return { parcel: p, estimate, production, income, band: model.absErrorQuantiles[coverage] * area * price, cost, margin: cost == null ? null : income - cost };
    }), [parcels, current, selected, price, costHa, coverage, model]);


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
    enableRowSelection: true, selectAllMode: 'all', positionToolbarAlertBanner: 'none', state: { rowSelection: checked }, onRowSelectionChange: setChecked,
    renderCaption: () => <span className="sr-only">Economía por parcela</span> });
  // Everything above the table works on the checked rows or, with none checked, every row the table
  // shows (parcel set, search and column filters).
  const shown = table.getRowModel().rows.map(r => r.original);
  const picked = shown.filter(r => checked[r.parcel.properties.id]);
  const calc = picked.length ? picked : shown;
  const pick = (ids: string[], on: boolean) => setChecked(c => { const n = { ...c }; for (const id of ids) { if (on) n[id] = true; else delete n[id]; } return n; });
  const totals = (() => {
    const sum = (f: (r: Row) => number) => calc.reduce((t, r) => t + f(r), 0);
    const area = sum(r => r.parcel.properties.area), production = sum(r => r.production), income = sum(r => r.income);
    const breakEven = costHa == null || price <= 0 ? null : costHa / price;
    return { area, production, income, band: sum(r => r.band), cost: costHa == null ? null : costHa * area, margin: costHa == null ? null : income - costHa * area,
      breakEven, above: breakEven == null ? null : calc.filter(r => r.estimate >= breakEven).length };
  })();


  return <div className="@container/econ grid min-w-0 gap-3 *:min-w-0">
    {/* The title says what the page is calculating for: every shown parcel, or the checked ones. */}
    <header className="grid gap-0.5">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-xl font-medium tracking-tight" aria-live="polite">{picked.length
          ? <>Calculado para <span className="tabular-nums">{picked.length}</span> {picked.length === 1 ? 'parcela seleccionada' : 'parcelas seleccionadas'}</>
          : <>Calculado para todas las parcelas mostradas · <span className="tabular-nums">{shown.length}</span></>}</h2>
        {picked.length > 0
          ? <button type="button" onClick={() => setChecked({})} className="flex items-center gap-1 self-center rounded-full px-2 py-1 text-xs text-muted-foreground hover:bg-tile hover:text-foreground [&_svg]:size-3.5"><X/>Quitar selección</button>
          : <span className="text-xs text-muted-foreground">Marca parcelas en la tabla de abajo para calcular solo esas.</span>}
      </div>
      <p className="text-xs text-muted-foreground">Cotizaciones - calculadora</p>
    </header>

    <div className="grid gap-3 *:min-w-0 @4xl/econ:grid-cols-[minmax(18rem,1fr)_2.4fr]">
      <section aria-label="Supuestos" className="tile grid content-start gap-3 rounded-[20px] p-4 text-sm">
        <h3 className="text-sm font-medium">Supuestos</h3>
        <label className="grid gap-1"><span className="text-xs text-muted-foreground">Precio de la cebada (MXN/t)</span>
          <input type="number" min={0} step={100} value={price} onChange={e => setPrice(Math.max(0, Number(e.target.value) || 0))} aria-label="Precio de la cebada en pesos por tonelada" className="h-9 rounded-full bg-frame px-3.5 tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"/></label>
        <label className="grid gap-1"><span className="text-xs text-muted-foreground">Costo de producción (MXN/ha)</span>
          <input type="number" min={0} step={500} value={costHa ?? ''} placeholder="Escribe tu costo por hectárea" onChange={e => setCostHa(e.target.value === '' ? null : Math.max(0, Number(e.target.value) || 0))} aria-label="Costo de producción en pesos por hectárea" className="h-9 rounded-full bg-frame px-3.5 tabular-nums outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"/></label>
        <section aria-labelledby="seed-title" className="grid gap-2 rounded-2xl bg-frame/60 p-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <Sprout className="size-4 text-primary"/><h4 id="seed-title" className="flex-1 text-xs font-medium">Calcular desde la semilla</h4>
            <div role="group" aria-label="Compra de la semilla" className="flex rounded-full bg-frame p-0.5 text-[11px]">
              {([['kg', 'Por kg'], ['bulto', 'Por bulto']] as const).map(([unit, label]) => <button key={unit} type="button" aria-pressed={seed.unit === unit} onClick={() => updateSeed({ unit })}
                className="relative rounded-full px-2.5 py-0.5 text-muted-foreground transition-colors aria-pressed:text-primary-foreground">
                {seed.unit === unit && <ShiftPill id="seed-unit-pill" className="bg-primary"/>}<span className="relative z-10">{label}</span>
              </button>)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {seedFields.map(([key, label, aria, step]) =>
              <label key={key} className="grid content-end gap-1"><span className="text-[11px] leading-tight text-muted-foreground">{label}</span>
                <input type="number" min={0} step={step} value={seed[key] ?? ''} onChange={e => updateSeed({ [key]: numberOrNull(e.target.value) })} aria-label={aria}
                  className="h-8 min-w-0 rounded-full bg-frame px-3 text-sm tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"/></label>)}
          </div>
          <p className="text-[11px] leading-snug text-pretty text-muted-foreground" aria-live="polite">
            {seed.unit === 'kg'
              ? seedKg == null ? 'Escribe las semillas por m² para calcular la dosis.' : <>Dosis: <b className="font-medium text-foreground tabular-nums">{fmt(seedKg, 1)} kg/ha</b>{seedCost == null && ' · escribe el precio de la semilla para calcular su costo.'}</>
              : bags == null ? 'Escribe cuántos m² siembra un bulto.' : <>Usas <b className="font-medium text-foreground tabular-nums">{fmt(bags, 2)} bultos/ha</b>{seedCost == null && ' · escribe el precio del bulto para calcular su costo.'}</>}
            {seedCost != null && <> · semilla <b className="font-medium text-foreground tabular-nums">{money(seedCost)}/ha</b>{seed.other ? <> + otros {money(seed.other)}/ha</> : null} → se llenó el costo por hectárea.</>}
          </p>
          <p className="text-[10px] leading-snug text-pretty text-muted-foreground/80">{seed.unit === 'kg' ? 'Dosis = semillas/m² × peso de mil semillas (g) ÷ 100.' : 'Bultos por hectárea = 10,000 m² ÷ m² que siembra un bulto.'} No ajusta por germinación ni establecimiento.</p>
        </section>
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

      <div className="grid content-start gap-3">
        <section aria-label="Resultado" className="grid content-start gap-2 @2xl/econ:grid-cols-3">
          <Stat label="Producción estimada" value={fmt(totals.production, 0)} unit="t" hint={`${calc.length} ${calc.length === 1 ? 'parcela' : 'parcelas'} · ${fmt(totals.area, 1)} ha`}/>
          <Stat label="Ingreso estimado" value={money(totals.income)} hint={`± ${money(totals.band)} con ${COVERAGE_LABEL[coverage]} de cobertura (suma por parcela, cota conservadora)`}/>
          <Stat label="Ingreso por hectárea" value={totals.area ? money(totals.income / totals.area) : '—'} hint={`a ${money(price)}/t`}/>
          <Stat label="Costo total" value={totals.cost == null ? '—' : money(totals.cost)} hint={costHa == null ? 'Escribe tu costo por hectárea para calcularlo' : `${money(costHa)}/ha`}/>
          <Stat label="Margen estimado" value={totals.margin == null ? '—' : money(totals.margin)} className={totals.margin != null && totals.margin < 0 ? 'text-destructive' : undefined} hint={totals.margin == null ? 'Ingreso menos costo' : `${money(totals.margin / Math.max(totals.area, 1e-9))}/ha`}/>
          <Stat label="Punto de equilibrio" value={totals.breakEven == null ? '—' : fmt(totals.breakEven)} unit={totals.breakEven == null ? undefined : 't/ha'} hint={totals.above == null ? 'Rendimiento que cubre el costo' : `${totals.above} de ${calc.length} parcelas lo superan`}/>
        </section>
        <RegionError all={parcels} shown={shown.map(r => r.parcel)} picked={new Set(picked.map(r => r.parcel.properties.id))} overall={m.mae_t_ha} onPick={pick}/>
      </div>
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
