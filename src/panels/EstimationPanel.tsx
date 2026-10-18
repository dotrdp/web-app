// Phase 2 · Estimar, the dashboard page. Answers the organisers' questions in one place:
// how the estimate compares with what was recorded, what an error in t/ha means in
// tonnes and pesos on a real parcel and how often it holds, every estimate per
// ID_POLIGONO linked to the map (shadcn-react-table), and the 59-parcel submission file.
import { useMemo, useRef, useState } from 'react';
import { CircleHelp, Download, FileSpreadsheet, MapPin, Send } from 'lucide-react';
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { CartesianGrid, ReferenceLine, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { DataTable, useDataTable } from '@/components/ui/data-table';
import { cn } from '@/lib/utils';
import { download, fmt, parcelCsv } from '../lib';
import { COVERAGE_LABEL, DEFAULT_PRICE_MXN_T, interval, money, productiveError, submissionCsv } from '../model';
import type { Coverage } from '../model';
import { TABLE_ES } from './table-es';
import type { Atlas, Parcel } from '../types';

type SetFilter = 'all' | 'prediction' | 'training' | 'municipio';
const SETS: [SetFilter, string][] = [['all', 'Todas'], ['prediction', 'Reservadas · 59'], ['training', 'Con rendimiento · 138'], ['municipio', 'Por municipio']];
type Municipality = { name: string; state: string; count: number; ha: number; production: number; estHa: number; band: number };
const chartConfig = { predicted: { label: 'Estimado', color: 'var(--primary)' } } satisfies ChartConfig;
// Shared table setup: Spanish strings, no pager (every row in one scrolling surface), search and
// per-column filters in popovers, no density or full-screen toggles.
const TABLE_OPTIONS = { localization: TABLE_ES, enablePagination: false, enableDensityToggle: false, enableFullscreenToggle: false, columnFilterDisplayMode: 'popover', defaultDensity: 'compact', enableColumnActions: false } as const;

export function Stat({ label, value, unit, hint, className }: { label: string; value: string; unit?: string; hint?: string; className?: string }) {
  return <div className={cn('tile grid gap-0.5 px-3.5 py-3', className)}>
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-2xl font-normal tracking-tight tabular-nums">{value}{unit && <span className="ml-1 text-sm text-muted-foreground">{unit}</span>}</span>
    {hint && <span className="text-[11px] leading-tight text-muted-foreground">{hint}</span>}
  </div>;
}

export default function EstimationPanel({ atlas, parcels, selected, keyDate, onSelect, onLocate, onShowSelection }: { atlas: Atlas; parcels: Parcel[]; selected: Parcel | null; keyDate: string; onSelect: (id: string) => void; onLocate: (id: string) => void; onShowSelection: (ids: string[]) => void }) {
  const model = atlas.predictions, m = model.metrics;
  const [price, setPrice] = useState(DEFAULT_PRICE_MXN_T);
  const [coverage, setCoverage] = useState<Coverage>('0.8');
  const [set, setSet] = useState<SetFilter>('prediction');
  const locate = useRef(onLocate); locate.current = onLocate;
  const medianArea = useMemo(() => { const a = parcels.map(p => p.properties.area).sort((x, y) => x - y); return a[Math.floor(a.length / 2)] ?? 0; }, [parcels]);
  const area = selected?.properties.area ?? medianArea;
  const typical = productiveError(m.mae_t_ha, area, price), band = productiveError(model.absErrorQuantiles[coverage], area, price);
  const maxShare = Math.max(...Object.values(model.shareWithin));

  const rows = useMemo(() => parcels.filter(p => set === 'all' || set === 'municipio' || p.properties.group === set), [parcels, set]);
  // Group-by (QGIS "Dissolve with stats"): planning and credit portfolios work per municipality.
  const municipalities = useMemo(() => {
    const groups = new Map<string, Municipality>();
    for (const p of rows) {
      const f = p.properties, k = `${f.state}/${f.municipality}`, g = groups.get(k) ?? { name: f.municipality, state: f.state, count: 0, ha: 0, production: 0, estHa: 0, band: 0 };
      g.count++; g.ha += f.area;
      if (f.predictedYield != null) { g.production += f.predictedYield * f.area; g.estHa += f.area; g.band += m.mae_t_ha * f.area; }
      groups.set(k, g);
    }
    return [...groups.values()].sort((a, b) => b.production - a.production);
  }, [rows, m.mae_t_ha]);

  const points = useMemo(() => parcels.filter(p => p.properties.observedYield != null && p.properties.predictedYield != null).map(p => ({ id: p.properties.id, observed: p.properties.observedYield!, predicted: p.properties.predictedYield! })), [parcels]);
  const [lo, hi] = [Math.floor(model.observedRange[0]), Math.ceil(model.observedRange[1])];

  const parcelColumns = useMemo<ColumnDef<Parcel>[]>(() => [
    { id: 'id', accessorFn: p => p.properties.name || p.properties.id, header: 'ID_POLIGONO', cell: ({ getValue }) => <span className="font-mono text-xs">{String(getValue())}</span> },
    { id: 'municipality', accessorFn: p => p.properties.municipality, header: 'Municipio', meta: { variant: 'multi-select' } },
    { id: 'area', accessorFn: p => p.properties.area, header: 'AREA_HA', cell: ({ getValue }) => fmt(getValue<number>()), meta: { align: 'right', variant: 'range-slider' } },
    { id: 'observed', accessorFn: p => p.properties.observedYield, header: 'Registrado', sortUndefined: 'last', cell: ({ getValue }) => <span className="text-muted-foreground">{fmt(getValue<number | null>())}</span>, meta: { align: 'right', variant: 'range-slider' } },
    { id: 'predicted', accessorFn: p => p.properties.predictedYield, header: 'Estimado', sortUndefined: 'last', meta: { align: 'right', variant: 'range-slider' },
      cell: ({ row, getValue }) => <span className="font-medium">{fmt(getValue<number | null>())}{row.original.properties.group === 'training' && getValue() != null && <sup className="ml-0.5 text-[9px] font-normal text-muted-foreground" title="Predicción fuera de partición (validación cruzada)">VC</sup>}</span> },
    { id: 'interval', accessorFn: p => p.properties.predictedYield, header: `Intervalo ${COVERAGE_LABEL[coverage]}`, enableSorting: false, enableColumnFilter: false, meta: { align: 'right' },
      cell: ({ getValue }) => { const est = getValue<number | null>(); const range = est == null ? null : interval(model, est, coverage); return <span className="text-xs whitespace-nowrap text-muted-foreground">{range ? `${fmt(range[0])}–${fmt(range[1])}` : '—'}</span>; } },
    { id: 'production', accessorFn: p => p.properties.predictedYield == null ? null : p.properties.predictedYield * p.properties.area, header: 'Producción t', sortUndefined: 'last', cell: ({ getValue }) => { const v = getValue<number | null>(); return v == null ? '—' : fmt(v, 1); }, meta: { align: 'right', variant: 'range-slider' } },
    // Last column: leave the dashboard and fly to the parcel. A row click only selects it.
    { id: 'locate', header: () => <span className="sr-only">Mapa</span>, enableSorting: false, enableColumnFilter: false, enableHiding: false, size: 48, meta: { align: 'right' },
      cell: ({ row }) => { const f = row.original.properties; return <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label={`Ver ${f.name || f.id} en el mapa`} title="Ver en el mapa" onClick={event => { event.stopPropagation(); locate.current(f.id); }}><MapPin/></Button>; } },
  ], [model, coverage]);
  const municipalityColumns = useMemo<ColumnDef<Municipality>[]>(() => [
    { id: 'name', accessorFn: g => g.name, header: 'Municipio', cell: ({ row }) => <span><span className="font-medium">{row.original.name}</span> <span className="text-xs text-muted-foreground">{row.original.state}</span></span> },
    { id: 'count', accessorKey: 'count', header: 'Parcelas', meta: { align: 'right' } },
    { id: 'ha', accessorKey: 'ha', header: 'Superficie ha', cell: ({ getValue }) => fmt(getValue<number>(), 1), meta: { align: 'right' } },
    { id: 'yield', accessorFn: g => g.estHa ? g.production / g.estHa : null, header: 'Rendimiento t/ha', cell: ({ getValue }) => fmt(getValue<number | null>()), meta: { align: 'right' } },
    { id: 'production', accessorKey: 'production', header: 'Producción t', cell: ({ getValue }) => <span className="font-medium">{fmt(getValue<number>(), 0)}</span>, meta: { align: 'right' } },
    { id: 'band', accessorKey: 'band', header: '± error típico t', cell: ({ getValue }) => <span className="text-muted-foreground">±{fmt(getValue<number>(), 0)}</span>, meta: { align: 'right' } },
  ], []);
  // Checked rows (select one, several or all): exports narrow to them and they can be shown on the map.
  const [checked, setChecked] = useState<RowSelectionState>({});
  const picked = useMemo(() => rows.filter(p => checked[p.properties.id]), [rows, checked]);
  const exported = picked.length ? picked : rows;
  // The set filter sits in the table's own toolbar, left of its search.
  const setTabs = () => <div role="tablist" aria-label="Conjunto" className="flex w-fit flex-wrap gap-1 rounded-full bg-tile p-1 text-xs">
    {SETS.map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={set === key} onClick={() => setSet(key)} className="rounded-full px-3 py-1 text-muted-foreground aria-selected:bg-frame aria-selected:text-foreground aria-selected:shadow-sm">{label}</button>)}
  </div>;
  const parcelTable = useDataTable<Parcel>({ ...TABLE_OPTIONS, data: rows, columns: parcelColumns, getRowId: p => p.properties.id, initialState: { sorting: [{ id: 'id', desc: false }] }, enableRowSelection: true, selectAllMode: 'all', positionToolbarAlertBanner: 'none', state: { rowSelection: checked }, onRowSelectionChange: setChecked,
    onRowClick: ({ row }) => onSelect(row.original.properties.id), renderToolbarActions: setTabs, renderCaption: () => <span className="sr-only">Estimaciones de rendimiento</span> });
  const municipalityTable = useDataTable<Municipality>({ ...TABLE_OPTIONS, data: municipalities, columns: municipalityColumns, getRowId: g => `${g.state}/${g.name}`, renderToolbarActions: setTabs, renderCaption: () => <span className="sr-only">Estimaciones por municipio</span> });

  return <div className="@container/est grid min-w-0 gap-3 *:min-w-0">
    <div className="grid gap-3 *:min-w-0 @3xl/est:grid-cols-[1.25fr_1fr]">
      <figure className="tile grid content-start gap-1 rounded-[20px] p-3">
        <figcaption className="px-1 text-sm font-medium">Estimado vs registrado<span className="block text-xs font-normal text-muted-foreground">{m.n} parcelas · validación cruzada · línea 1:1 · MAE {fmt(m.mae_t_ha)} t/ha · R² {fmt(m.r2)}</span></figcaption>
        <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
          <ScatterChart margin={{ top: 10, right: 12, bottom: 4, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis type="number" dataKey="observed" domain={[lo, hi]} tickCount={hi - lo + 1} name="Registrado" unit=" t/ha" tickLine={false} axisLine={false} fontSize={11}/>
            <YAxis type="number" dataKey="predicted" domain={[lo, hi]} tickCount={hi - lo + 1} name="Estimado" tickLine={false} axisLine={false} fontSize={11}/>
            <ZAxis range={[30, 30]}/>
            <ReferenceLine segment={[{ x: lo, y: lo }, { x: hi, y: hi }]} stroke="var(--muted-foreground)" strokeDasharray="4 4"/>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator labelFormatter={(_, payload) => String((payload?.[0]?.payload as { id?: string })?.id ?? '')} formatter={(_v, _n, item) => { const d = item.payload as { observed: number; predicted: number }; return <span className="tabular-nums">Registrado {fmt(d.observed)} · estimado {fmt(d.predicted)} t/ha</span>; }}/>}/>
            <Scatter data={points} fill="var(--primary)" fillOpacity={.7} className="cursor-pointer" onClick={point => { const d = point as unknown as { id?: string; payload?: { id?: string } }; const id = d.payload?.id ?? d.id; if (id) onSelect(id); }}/>
          </ScatterChart>
        </ChartContainer>
      </figure>

      <section aria-labelledby="productive-title" className="grid content-start gap-2.5 rounded-[20px] bg-primary-container/60 p-4 text-on-primary-container">
        <h3 id="productive-title" className="text-sm font-medium">¿Qué significa para un productor?</h3>
        <p className="text-[13px] leading-relaxed text-pretty">En {selected ? <b className="font-medium">{selected.properties.name || selected.properties.id}</b> : <>una parcela típica</>} de <b className="font-medium tabular-nums">{fmt(area, 2)} ha</b>, el error típico de <b className="font-medium tabular-nums">±{fmt(m.mae_t_ha)} t/ha</b> equivale a <b className="font-medium tabular-nums">±{fmt(typical.tonnes, 2)} t</b> de grano, unos <b className="font-medium tabular-nums">±{money(typical.pesos)}</b> a {money(price)}/t. En {COVERAGE_LABEL[coverage]} de las parcelas evaluadas el error fue menor que <b className="font-medium tabular-nums">{fmt(model.absErrorQuantiles[coverage])} t/ha</b> (±{fmt(band.tonnes, 2)} t · ±{money(band.pesos)}).</p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <label className="flex items-center gap-1.5 rounded-full bg-frame/70 py-1 pr-1 pl-3">Precio supuesto
            <input type="number" min={0} step={100} value={price} onChange={e => setPrice(Math.max(0, Number(e.target.value) || 0))} aria-label="Precio supuesto en pesos por tonelada" className="h-7 w-20 rounded-full bg-frame px-2 text-right tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"/>
            <span className="pr-2 text-muted-foreground">MXN/t</span></label>
          <div role="group" aria-label="Cobertura del intervalo" className="flex rounded-full bg-frame/70 p-0.5">
            {(Object.keys(COVERAGE_LABEL) as Coverage[]).map(c => <button key={c} type="button" aria-pressed={coverage === c} onClick={() => setCoverage(c)} className="rounded-full px-2.5 py-1 aria-pressed:bg-primary aria-pressed:text-primary-foreground">{COVERAGE_LABEL[c]}</button>)}
          </div>
        </div>
        <p className="text-[11px] text-pretty opacity-80">El precio es un supuesto editable, no una cotización. Selecciona una parcela en el mapa o la tabla para usar su superficie.</p>
        <figure aria-label="Proporción de parcelas por debajo de cada error" className="grid gap-1.5 pt-1">
          <figcaption className="text-xs">Parcelas con error menor que…</figcaption>
          {Object.entries(model.shareWithin).filter(([t]) => t !== '0.1').map(([t, share]) => <div key={t} className="grid grid-cols-[4.2rem_1fr_2.6rem] items-center gap-2 text-xs tabular-nums">
            <span>{fmt(Number(t))} t/ha</span>
            <span className="h-2 overflow-hidden rounded-full bg-frame/70"><span className="block h-full rounded-full bg-primary" style={{ width: `${share / maxShare * 100}%` }}/></span>
            <span className="text-right font-medium">{Math.round(share * 100)} %</span>
          </div>)}
        </figure>
      </section>
    </div>

    <section aria-labelledby="table-title" className="grid gap-2 *:min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <h3 id="table-title" className="mr-auto text-sm font-medium">Estimaciones por ID_POLIGONO</h3>
        <Button size="sm" className="rounded-full" onClick={() => download('agrocebada-entrega-59.csv', submissionCsv(model), 'text/csv')}><Send/>Entrega · 59 parcelas</Button>
        {picked.length > 0 && set !== 'municipio' && <>
          <span className="text-xs text-muted-foreground tabular-nums">{picked.length} {picked.length === 1 ? 'seleccionada' : 'seleccionadas'}</span>
          <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setChecked({})}>Quitar selección</Button>
          <Button size="sm" variant="outline" className="rounded-full bg-transparent" onClick={() => onShowSelection(picked.map(p => p.properties.id))}><MapPin/>Ver en el mapa · {picked.length}</Button>
        </>}
        <Button size="sm" variant="outline" className="rounded-full bg-transparent" onClick={() => download('agrocebada-estimaciones.csv', parcelCsv(exported, atlas, keyDate), 'text/csv')}><FileSpreadsheet/>Tabla CSV{picked.length > 0 && ` · ${picked.length}`}</Button>
        <Button size="sm" variant="ghost" className="rounded-full" aria-label="Descargar GeoJSON con estimaciones" onClick={() => download('agrocebada-estimaciones.geojson', JSON.stringify({ type: 'FeatureCollection', features: exported }), 'application/geo+json')}><Download/>GeoJSON{picked.length > 0 && ` · ${picked.length}`}</Button>
      </div>
      {set === 'municipio'
        ? <DataTable table={municipalityTable} surfaceClassName="max-h-[min(560px,calc(100dvh-14rem))] rounded-2xl"/>
        : <DataTable table={parcelTable} surfaceClassName="max-h-[min(560px,calc(100dvh-14rem))] rounded-2xl"/>}
      <p className="text-[11px] text-muted-foreground">{set === 'municipio' && 'El ± suma el error típico por hectárea de cada parcela; es una cota conservadora porque los errores se compensan en parte. '}VC: estimación fuera de partición para las 138 parcelas con rendimiento (el modelo no vio esa parcela). Las 59 reservadas usan el promedio de los cinco modelos de partición.</p>
    </section>

    <Accordion type="single" collapsible className="rounded-2xl bg-tile/60 px-4">
      <AccordionItem value="notes" className="border-0">
        <AccordionTrigger className="text-sm hover:no-underline"><span className="flex items-center gap-2"><CircleHelp className="size-4 text-primary"/>Cómo leer estas cifras</span></AccordionTrigger>
        <AccordionContent>
          <ul className="grid gap-2 text-[13px] leading-relaxed text-pretty text-muted-foreground">
            <li><b className="font-medium text-foreground">Superficie.</b> AREA_HA es la superficie del polígono georreferenciado; la producción estimada multiplica t/ha por esa superficie.</li>
            <li><b className="font-medium text-foreground">Rendimiento.</b> Grano cosechado pesado en báscula, sin ajuste por humedad, impurezas o mermas; incluye todo lo recolectado. Proviene sobre todo de la comercializadora y en menor proporción de productores; ambas fuentes se tratan como una sola variable porque no se identifican por parcela.</li>
            <li><b className="font-medium text-foreground">Evaluación.</b> RMSE, MAE y R² por parcela, sin ponderar por superficie, como en la evaluación oficial. División 70/30 estratificada: 138 parcelas para entrenar y 59 reservadas.</li>
            <li><b className="font-medium text-foreground">Momento.</b> El reto no fija fecha de corte. Esta estimación usa datos hasta el {model.model.cutoff}: {model.model.window.charAt(0).toLowerCase() + model.model.window.slice(1)}</li>
            <li><b className="font-medium text-foreground">Límites de uso.</b> No hay un umbral oficial de error aceptable. Con ±{fmt(m.mae_t_ha)} t/ha la estimación sirve para planear acopio, logística y carteras de crédito por municipio o estado; para decidir sobre una sola parcela conviene usar el intervalo y confirmar en campo. Es un solo ciclo (2025): la generalización a otros años no está evaluada.</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>;
}
