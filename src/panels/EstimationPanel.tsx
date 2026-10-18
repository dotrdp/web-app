// Phase 2 · Estimar, the dashboard page: the season behind the estimate (FIRA's monthly NDVI
// mean, minimum and maximum against CHIRPS rain, and its integral over the cycle), a greeting
// photo, and
// every estimate per ID_POLIGONO linked to the map (shadcn-react-table),
// and the 59-parcel submission file.
import { useMemo, useRef, useState } from 'react';
import { CircleHelp, Download, MapPin } from 'lucide-react';
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { Area, Bar, CartesianGrid, ComposedChart, Line, ReferenceArea, XAxis, YAxis } from 'recharts';
import { motion, useReducedMotion } from 'motion/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { DataTable, useDataTable } from '@/components/ui/data-table';
import { cn } from '@/lib/utils';
import { dateKey, download, fmt, MONTH_NAMES, MONTHS, parcelCsv } from '../lib';
import { COVERAGE_LABEL, interval } from '../model';
import ShiftPill from '../shell/ShiftPill';
import { TABLE_OPTIONS } from './table-es';
import { useMilliController } from '../milli/bridge';
import { parcelRow, round, tableSlice } from '../milli/app-controller';
import { applyTableSet, nextChecked, tableState } from '../milli/table-control';
import type { Atlas, Parcel } from '../types';

type SetFilter = 'all' | 'prediction' | 'training' | 'municipio';
const SETS: [SetFilter, string][] = [['all', 'Todas'], ['prediction', 'Reservadas · 59'], ['training', 'Con rendimiento · 138'], ['municipio', 'Por municipio']];
/** Milli's names for the set tabs. */
const TAB_OF: Record<string, SetFilter> = { todas: 'all', reservadas: 'prediction', con_rendimiento: 'training', por_municipio: 'municipio' };
const TAB_NAME: Record<SetFilter, string> = { all: 'todas', prediction: 'reservadas', training: 'con_rendimiento', municipio: 'por_municipio' };
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
type Municipality = { name: string; state: string; count: number; ha: number; production: number; estHa: number; band: number };
const chartConfig = { mean: { label: 'NDVI medio', color: 'var(--primary)' }, range: { label: 'NDVI mín–máx', color: 'var(--primary)' }, rain: { label: 'Lluvia', color: 'var(--chart-4)' } } satisfies ChartConfig;
const YEARS = [2022, 2023, 2024, 2025];
const CYCLE = [3, 4, 5, 6, 7, 8, 9]; // April to the October cutoff
type SeasonMonth = { month: string; name: string; mean: number | null; range: [number, number] | null; rain: number | null; scenes: number };

export function Stat({ label, value, unit, hint, className }: { label: string; value: string; unit?: string; hint?: string; className?: string }) {
  return <div className={cn('tile grid gap-0.5 px-3.5 py-3', className)}>
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-2xl font-normal tracking-tight tabular-nums">{value}{unit && <span className="ml-1 text-sm text-muted-foreground">{unit}</span>}</span>
    {hint && <span className="text-[11px] leading-tight text-muted-foreground">{hint}</span>}
  </div>;
}

export default function EstimationPanel({ atlas, parcels, keyDate, onSelect, onLocate, onShowSelection }: { atlas: Atlas; parcels: Parcel[]; keyDate: string; onSelect: (id: string) => void; onLocate: (id: string) => void; onShowSelection: (ids: string[]) => void }) {
  const model = atlas.predictions, m = model.metrics;
  const coverage = '0.8';
  // The greeting animates in every time the dashboard opens (the page mounts afresh each time).
  const greet = !useReducedMotion();
  const [set, setSet] = useState<SetFilter>('prediction');
  const locate = useRef(onLocate); locate.current = onLocate;

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

  const [seasonYear, setSeasonYear] = useState(2025);

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
  ], [model]);
  const municipalityColumns = useMemo<ColumnDef<Municipality>[]>(() => [
    { id: 'name', accessorFn: g => g.name, header: 'Municipio', cell: ({ row }) => <span><span className="font-medium">{row.original.name}</span> <span className="text-xs text-muted-foreground">{row.original.state}</span></span> },
    { id: 'count', accessorKey: 'count', header: 'Parcelas', meta: { align: 'right' } },
    { id: 'ha', accessorKey: 'ha', header: 'Superficie ha', cell: ({ getValue }) => fmt(getValue<number>(), 1), meta: { align: 'right' } },
    { id: 'yield', accessorFn: g => g.estHa ? g.production / g.estHa : null, header: 'Rendimiento t/ha', cell: ({ getValue }) => fmt(getValue<number | null>()), meta: { align: 'right' } },
    { id: 'production', accessorKey: 'production', header: 'Producción t', cell: ({ getValue }) => <span className="font-medium">{fmt(getValue<number>(), 0)}</span>, meta: { align: 'right' } },
    { id: 'band', accessorKey: 'band', header: '± error típico t', cell: ({ getValue }) => <span className="text-muted-foreground">±{fmt(getValue<number>(), 0)}</span>, meta: { align: 'right' } },
  ], []);
  // Checked rows (one, several or all parcels, or whole municipalities in "Por municipio"): the plot,
  // the exports and "Ver en el mapa" narrow to them.
  const [checked, setChecked] = useState<RowSelectionState>({});
  const [checkedGroups, setCheckedGroups] = useState<RowSelectionState>({});
  const groupKey = (p: Parcel) => `${p.properties.state}/${p.properties.municipality}`;
  const picked = useMemo(() => set === 'municipio' ? rows.filter(p => checkedGroups[`${p.properties.state}/${p.properties.municipality}`]) : rows.filter(p => checked[p.properties.id]), [rows, set, checked, checkedGroups]);
  const clearChecks = () => { setChecked({}); setCheckedGroups({}); };
  // The set filter sits in the table's own toolbar, left of its search.
  const setTabs = () => <div role="tablist" aria-label="Conjunto" className="flex w-fit flex-wrap gap-1 rounded-full bg-tile p-1 text-xs">
    {SETS.map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={set === key} onClick={() => setSet(key)} className="relative rounded-full px-3 py-1 text-muted-foreground transition-colors aria-selected:text-foreground">
      {set === key && <ShiftPill id="set-pill" className="bg-frame shadow-sm"/>}<span className="relative z-10">{label}</span>
    </button>)}
  </div>;
  const parcelTable = useDataTable<Parcel>({ ...TABLE_OPTIONS, data: rows, columns: parcelColumns, getRowId: p => p.properties.id, initialState: { sorting: [{ id: 'id', desc: false }] }, enableRowSelection: true, selectAllMode: 'all', positionToolbarAlertBanner: 'none', state: { rowSelection: checked }, onRowSelectionChange: setChecked,
    onRowClick: ({ row }) => onSelect(row.original.properties.id), renderToolbarActions: setTabs, renderCaption: () => <span className="sr-only">Estimaciones de rendimiento</span> });
  const municipalityTable = useDataTable<Municipality>({ ...TABLE_OPTIONS, data: municipalities, columns: municipalityColumns, getRowId: g => `${g.state}/${g.name}`, enableRowSelection: true, selectAllMode: 'all', positionToolbarAlertBanner: 'none', state: { rowSelection: checkedGroups }, onRowSelectionChange: setCheckedGroups, renderToolbarActions: setTabs, renderCaption: () => <span className="sr-only">Estimaciones por municipio</span> });

  // Parcels the table shows right now (set filter, search and column filters), or only the checked ones.
  const shownGroups = new Set(municipalityTable.getRowModel().rows.map(r => r.id));
  const shown = set === 'municipio' ? rows.filter(p => shownGroups.has(groupKey(p))) : parcelTable.getRowModel().rows.map(r => r.original);
  const scope = picked.length ? picked : shown;
  // The season behind the estimate: FIRA's Sentinel-2 NDVI per month (mean of the scene means, lowest
  // scene minimum, highest scene maximum; ≤30 % cloud) and CHIRPS rain, averaged over the scope.
  const avg = (xs: (number | null | undefined)[]) => { const v = xs.filter((x): x is number => x != null); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
  const monthNdvi = (year: number, i: number) => scope.map(p => atlas.details[p.properties.id]?.ndvi['Sentinel-2']?.[dateKey(year, i)]).filter(r => r != null);
  const season: SeasonMonth[] = MONTHS.map((month, i) => {
    const key = dateKey(seasonYear, i), recs = monthNdvi(seasonYear, i);
    const lo = avg(recs.map(r => r.min)), hi = avg(recs.map(r => r.max));
    return { month, name: MONTH_NAMES[i], mean: avg(recs.map(r => r.mean)), range: lo != null && hi != null ? [lo, hi] : null, rain: avg(scope.map(p => atlas.details[p.properties.id]?.climate[key]?.precipitation)), scenes: recs.reduce((t, r) => t + r.observations, 0) };
  });
  // Integral de NDVI: area under the monthly mean over the cycle (trapezoids between observed months,
  // spanning gaps by their length), in NDVI·month, for every year so the season can be compared.
  const integrals = YEARS.map(year => {
    const pts = CYCLE.map(i => [i, avg(monthNdvi(year, i).map(r => r.mean))] as const).filter((p): p is readonly [number, number] => p[1] != null);
    const value = pts.length > 1 ? pts.slice(1).reduce((t, [i, v], k) => t + (i - pts[k][0]) * (v + pts[k][1]) / 2, 0) : null;
    return { year, value, months: pts.length };
  });
  const maxIntegral = Math.max(...integrals.map(x => x.value ?? 0), .01);
  const scopeLabel = scope.length === 1 ? scope[0].properties.name || scope[0].properties.id : `${picked.length ? 'Seleccionadas' : 'Parcelas mostradas'} · promedio de ${scope.length}`;
  // NDVI can dip below zero (bare or wet soil); the axis follows it down in tenths.
  const ndviFloor = Math.min(0, Math.floor(Math.min(...season.map(d => d.range?.[0] ?? 0)) * 10) / 10);

  // Milli: reads and drives the tables and the plot. When it reads series for many parcels, the plot
  // follows along, checking them in batches so the curves move while it reads.
  const [reading, setReading] = useState<{ done: number; total: number } | null>(null);
  const animation = useRef(0);
  const stopReading = () => { animation.current++; setReading(null); };
  const known = (ids: string[]) => { const all = new Map(parcels.map(p => [p.properties.id.toUpperCase(), p.properties.id])); return ids.map(id => all.get(id.toUpperCase())).filter((id): id is string => !!id); };
  /** Shows the "all" set when some ids aren't in the current one, so their checks are visible. */
  const reveal = (ids: string[]) => { if (set === 'municipio' || ids.some(id => !rows.some(p => p.properties.id === id))) setSet('all'); };
  useMilliController('estimacion', {
    snapshot: () => ({ panel: { en_pantalla: true, pestaña: TAB_NAME[set], tabla: set === 'municipio' ? tableState(municipalityTable) : tableState(parcelTable),
      filas_marcadas: set === 'municipio' ? { municipios: Object.keys(checkedGroups) } : { total: picked.length, ids: picked.slice(0, 100).map(p => p.properties.id) },
      grafica: { año: seasonYear, alcance: scopeLabel, parcelas: scope.length,
        meses: season.map(d => ({ mes: d.month, ndvi_media: round(d.mean, 3), ndvi_min: round(d.range?.[0], 3), ndvi_max: round(d.range?.[1], 3), lluvia_mm: round(d.rain, 1), escenas: d.scenes })),
        integrales: integrals.map(x => ({ año: x.year, ndvi_mes: round(x.value, 3), meses_con_dato: x.months })) },
      milli_leyendo: reading } }),
    commands: {
      table_set: ({ set_tab, ...rest }) => {
        stopReading();
        const next = set_tab ? TAB_OF[set_tab as string] : set; if (set_tab) setSet(next);
        if (next === 'municipio') applyTableSet(municipalityTable, rest); else applyTableSet(parcelTable, rest);
        return {};
      },
      table_check: ({ mode, parcel_ids }) => {
        stopReading();
        const ids = known((parcel_ids as string[] | undefined) ?? []);
        if (mode !== 'all' && mode !== 'none' && !ids.length) throw new Error('Ninguna de esas parcelas existe.');
        reveal(ids);
        setChecked(c => nextChecked(c, String(mode), ids, parcelTable.getRowModel().rows.map(r => r.id)));
        return { marcadas_ahora: mode === 'none' ? 0 : undefined };
      },
      plot_set: ({ year }) => { setSeasonYear(Number(year)); return {}; },
      show_series: async ({ ids, year }) => {
        const run = ++animation.current, list = known(ids as string[]);
        setSeasonYear(Number(year)); reveal(list);
        const steps = Math.min(list.length, 14), per = Math.ceil(list.length / Math.max(steps, 1));
        for (let k = 1; k <= steps; k++) {
          if (animation.current !== run) return {};
          const part = list.slice(0, k * per);
          setChecked(Object.fromEntries(part.map(id => [id, true]))); setReading({ done: part.length, total: list.length });
          await sleep(140);
        }
        await sleep(700); if (animation.current === run) setReading(null);
        return { parcelas: list.length };
      },
      read_table: args => args.table === 'municipios'
        ? tableSlice(municipalityTable.getRowModel().rows.map(r => { const g = r.original; return { municipio: g.name, estado: g.state, parcelas: g.count, superficie_ha: round(g.ha, 1), rendimiento_t_ha: g.estHa ? round(g.production / g.estHa, 3) : null, produccion_t: round(g.production, 1), error_tipico_t: round(g.band, 1) }; }), args, { tabla: 'municipios', pestaña: TAB_NAME[set] })
        : tableSlice(parcelTable.getRowModel().rows.map(r => { const est = r.original.properties.predictedYield, range = est == null ? null : interval(model, est, coverage); return { ...parcelRow(r.original), intervalo_80: range ? [round(range[0], 2), round(range[1], 2)] : null, marcada: !!checked[r.id] }; }), args, { tabla: 'estimaciones', pestaña: TAB_NAME[set], ...tableState(parcelTable) }),
      ids: ({ which }) => (which === 'checked' ? picked : scope).map(p => p.properties.id),
    },
  });

  return <div className="@container/est grid min-w-0 gap-3 *:min-w-0">
    <div className="grid gap-3 *:min-w-0 @3xl/est:grid-cols-[1.25fr_1fr]">
      <figure className="tile grid content-start gap-1 rounded-[20px] p-3">
        <div className="flex flex-wrap items-start gap-2 px-1">
          <figcaption className="mr-auto text-sm font-medium">NDVI y lluvia por mes<span className="block text-xs font-normal text-muted-foreground">{scopeLabel} · Sentinel-2 (FIRA, ≤30 % nubes) · CHIRPS</span>
            {reading && <span role="status" className="mt-1 flex w-fit items-center gap-1.5 rounded-full bg-primary-container px-2.5 py-0.5 text-[11px] font-normal text-on-primary-container tabular-nums"><span className="size-1.5 animate-pulse rounded-full bg-primary"/>Milli lee {reading.done} de {reading.total} parcelas</span>}</figcaption>
          <div role="group" aria-label="Año" className="flex rounded-full bg-frame/70 p-0.5 text-xs">
            {YEARS.map(y => <button key={y} type="button" aria-pressed={seasonYear === y} onClick={() => setSeasonYear(y)} className="relative rounded-full px-2.5 py-1 tabular-nums text-muted-foreground transition-colors aria-pressed:text-primary-foreground">
              {seasonYear === y && <ShiftPill id="year-pill" className="bg-primary"/>}<span className="relative z-10">{y}</span>
            </button>)}
          </div>
        </div>
        <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
          <ComposedChart data={season} margin={{ top: 10, right: 0, bottom: 0, left: -12 }}>
            <CartesianGrid vertical={false}/>
            {/* Growing cycle, April to the October cutoff. */}
            <ReferenceArea yAxisId="ndvi" x1="Abr" x2="Oct" fill="var(--primary)" fillOpacity={.05} ifOverflow="hidden"/>
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11}/>
            <YAxis yAxisId="ndvi" interval={0} domain={[ndviFloor, 1]} ticks={[...(ndviFloor < 0 ? [ndviFloor] : []), 0, .25, .5, .75, 1]} tickLine={false} axisLine={false} fontSize={11}/>
            <YAxis yAxisId="rain" orientation="right" tickLine={false} axisLine={false} fontSize={11} unit=" mm" width={64}/>
            <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(_, payload) => { const d = payload?.[0]?.payload as SeasonMonth | undefined; return d ? `${d.name} ${seasonYear}${d.scenes ? ` · ${d.scenes} escenas` : ''}` : ''; }}
              formatter={(value, name) => <span className="flex w-full justify-between gap-3 tabular-nums"><span className="text-muted-foreground">{chartConfig[name as keyof typeof chartConfig]?.label}</span><span>{name === 'range' && Array.isArray(value) ? `${fmt(value[0])}–${fmt(value[1])}` : name === 'rain' ? `${fmt(value as number, 0)} mm` : fmt(value as number)}</span></span>}/>}/>
            <Bar yAxisId="rain" dataKey="rain" fill="var(--color-rain)" fillOpacity={.45} radius={[4, 4, 0, 0]} barSize={14}/>
            <Area yAxisId="ndvi" dataKey="range" stroke="none" fill="var(--color-range)" fillOpacity={.18} connectNulls/>
            <Line yAxisId="ndvi" dataKey="mean" stroke="var(--color-mean)" strokeWidth={2} dot={{ r: 2.5 }} connectNulls/>
          </ComposedChart>
        </ChartContainer>
        <section aria-label="Integral de NDVI" className="grid gap-1.5 border-t border-border/60 px-1 pt-2.5">
          <h4 className="flex items-baseline gap-1.5 text-xs font-medium">Integral de NDVI<span className="font-normal text-muted-foreground">· abril–octubre · NDVI·mes</span></h4>
          <div className="grid grid-cols-4 gap-2">
            {integrals.map(x => <button key={x.year} type="button" aria-pressed={seasonYear === x.year} onClick={() => setSeasonYear(x.year)} title={`${x.months} meses con observación`}
              className="relative grid gap-1 rounded-xl px-2 py-1.5 text-left hover:bg-frame/60">
              {seasonYear === x.year && <ShiftPill id="integral-pill" className="bg-frame/80"/>}
              <span className="relative z-10 flex items-baseline justify-between gap-1 tabular-nums"><span className="text-[11px] text-muted-foreground">{x.year}</span><span className="text-sm font-medium">{x.value == null ? '—' : fmt(x.value)}</span></span>
              <span className="relative z-10 h-1.5 overflow-hidden rounded-full bg-frame/70"><span className="block h-full rounded-full bg-primary transition-opacity" style={{ width: `${(x.value ?? 0) / maxIntegral * 100}%`, opacity: seasonYear === x.year ? 1 : .45 }}/></span>
            </button>)}
          </div>
        </section>
        <p className="px-1 text-[11px] text-pretty text-muted-foreground">Línea: NDVI medio del mes. Banda: del valor mínimo al máximo dentro de la parcela{scope.length === 1 ? '' : ', promediado entre parcelas'}. Barras: lluvia acumulada. El área sombreada es el ciclo (abril–octubre).</p>
      </figure>

      <figure className="relative min-h-[280px] overflow-hidden rounded-[20px] bg-tile">
        <img src="/artwork/cebada-atardecer.jpg" alt="Campo de cebada en macollaje al atardecer" className="absolute inset-0 size-full object-cover"/>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25"/>
        <h2 className="absolute inset-x-6 bottom-12 text-4xl font-semibold tracking-tight text-balance text-white drop-shadow-[0_2px_12px_rgb(0_0_0/0.45)] @5xl/est:text-5xl">
          {'¿Qué haremos hoy?'.split(' ').map((word, i) => <motion.span key={word} className="mr-[.25em] inline-block last:mr-0"
            initial={greet ? { opacity: 0, y: 22, filter: 'blur(10px)' } : false} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ type: 'spring', bounce: .35, visualDuration: .6, delay: .45 + i * .14 }}>{word}</motion.span>)}
        </h2>
        <figcaption className="absolute right-3 bottom-2.5 text-[10px] text-white/75">Foto: RuralNet · cebada en macollaje</figcaption>
      </figure>
    </div>

    <section aria-labelledby="table-title" className="grid gap-2 *:min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <h3 id="table-title" className="mr-auto text-sm font-medium">Estimaciones por ID_POLIGONO</h3>
        {picked.length > 0 && <>
          <Button size="sm" variant="ghost" className="rounded-full" onClick={clearChecks}>Quitar selección</Button>
          <Button size="sm" variant="outline" className="rounded-full bg-transparent" onClick={() => onShowSelection(picked.map(p => p.properties.id))}><MapPin/>Ver en el mapa · {picked.length}</Button>
        </>}
        {/* One export: the checked rows, or every row the table shows. The badge makes a selection explicit. */}
        <Button size="sm" className="rounded-full" title={picked.length ? `CSV con las ${picked.length} filas seleccionadas` : `CSV con las ${scope.length} filas mostradas`}
          onClick={() => download(picked.length ? 'agrocebada-seleccion.csv' : 'agrocebada-estimaciones.csv', parcelCsv(scope, atlas, keyDate), 'text/csv')}>
          <Download/>{picked.length ? 'Exportar seleccionadas' : 'Exportar filas mostradas'}
          {picked.length > 0 && <span className="ml-0.5 rounded-full bg-primary-foreground/20 px-1.5 text-xs tabular-nums">{picked.length}</span>}
        </Button>
      </div>
      {set === 'municipio'
        ? <DataTable table={municipalityTable} surfaceClassName="max-h-[calc(100dvh-11rem)] rounded-2xl"/>
        : <DataTable table={parcelTable} surfaceClassName="max-h-[calc(100dvh-11rem)] rounded-2xl"/>}
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
