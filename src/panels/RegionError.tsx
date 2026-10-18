// Expected error by region for the parcels the calculator is working on. The model's error is
// measured out of fold on the 138 parcels with recorded yield; each parcel's expected error is
// that measured error for its municipality, or for its state when the municipality has fewer
// than SMALL_SAMPLE evaluated parcels. Bars average it per state over the current parcels (the
// checked ones, or every shown one); a state opens its municipalities in a table with aligned
// bars and checkboxes that check the municipality's parcels; an arrow returns to the states.
import { useMemo, useState } from 'react';
import { ArrowLeft, MousePointerClick } from 'lucide-react';
import type { ColumnDef, RowSelectionState, Updater } from '@tanstack/react-table';
import { AnimatePresence, motion } from 'motion/react';
import { Bar, BarChart, CartesianGrid, LabelList, ReferenceLine, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { DataTable, useDataTable } from '@/components/ui/data-table';
import { fmt } from '../lib';
import { TABLE_OPTIONS } from './table-es';
import { useMilliController } from '../milli/bridge';
import { round, tableSlice } from '../milli/app-controller';
import type { Parcel } from '../types';

type Measured = { n: number; mae: number };
type Region = { name: string; parcels: number; picked: number; expected: number; measured: Measured | null; source: 'municipio' | 'estado' };
const chartConfig = { expected: { label: 'Error esperado', color: 'var(--primary)' } } satisfies ChartConfig;
/** Fewer evaluated parcels than this and a municipality borrows its state's error. */
const SMALL_SAMPLE = 5;
const mean = (xs: number[]) => xs.reduce((t, x) => t + x, 0) / Math.max(xs.length, 1);

export default function RegionError({ all, shown, picked, overall, onPick }: {
  all: Parcel[]; shown: Parcel[]; picked: Set<string>; overall: number; onPick: (ids: string[], on: boolean) => void;
}) {
  const [state, setState] = useState<string | null>(null);
  // Measured error (out-of-fold MAE) per state and per municipality, from every evaluated parcel.
  const measured = useMemo(() => {
    const groups = new Map<string, number[]>();
    for (const p of all) {
      const f = p.properties; if (f.group !== 'training' || f.observedYield == null || f.predictedYield == null) continue;
      const e = Math.abs(f.predictedYield - f.observedYield);
      for (const k of [`e:${f.state}`, `m:${f.state}/${f.municipality}`]) groups.set(k, [...groups.get(k) ?? [], e]);
    }
    return new Map([...groups].map(([k, errors]) => [k, { n: errors.length, mae: mean(errors) }]));
  }, [all]);
  const expectedFor = (p: Parcel) => {
    const m = measured.get(`m:${p.properties.state}/${p.properties.municipality}`);
    return m && m.n >= SMALL_SAMPLE ? { value: m.mae, source: 'municipio' as const } : { value: measured.get(`e:${p.properties.state}`)?.mae ?? overall, source: 'estado' as const };
  };
  const current = picked.size ? shown.filter(p => picked.has(p.properties.id)) : shown;

  const by = (ps: Parcel[], key: (p: Parcel) => string) => { const m = new Map<string, Parcel[]>(); for (const p of ps) m.set(key(p), [...m.get(key(p)) ?? [], p]); return [...m]; };
  const states = by(current, p => p.properties.state).map(([name, ps]) => ({ name, n: ps.length, expected: mean(ps.map(p => expectedFor(p).value)) })).sort((a, b) => b.n - a.n);
  const municipalities: Region[] = state ? by(shown.filter(p => p.properties.state === state), p => p.properties.municipality).map(([name, ps]) => {
    const e = expectedFor(ps[0]);
    return { name, parcels: ps.length, picked: ps.filter(p => picked.has(p.properties.id)).length, expected: e.value, measured: measured.get(`m:${state}/${name}`) ?? null, source: e.source };
  }) : [];
  const scale = Math.max(...municipalities.map(m => m.expected), overall, .01);
  // Checking a municipality checks (or unchecks) all of its shown parcels.
  // Only checked rows go in: TanStack counts every key, so `false` entries would skew select-all.
  const rowSelection: RowSelectionState = Object.fromEntries(municipalities.filter(m => m.picked === m.parcels).map(m => [m.name, true]));
  const onRowSelectionChange = (updater: Updater<RowSelectionState>) => {
    const next = typeof updater === 'function' ? updater(rowSelection) : updater;
    for (const m of municipalities) if (!!next[m.name] !== !!rowSelection[m.name])
      onPick(shown.filter(p => p.properties.state === state && p.properties.municipality === m.name).map(p => p.properties.id), !!next[m.name]);
  };

  const columns = useMemo<ColumnDef<Region>[]>(() => [
    { id: 'name', accessorKey: 'name', header: 'Municipio', cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { id: 'parcels', accessorKey: 'parcels', header: 'Parcelas', cell: ({ row }) => <span className="tabular-nums">{row.original.picked ? `${row.original.picked} de ${row.original.parcels}` : row.original.parcels}</span>, meta: { align: 'right' } },
    { id: 'expected', accessorKey: 'expected', header: 'Error esperado t/ha', size: 240,
      cell: ({ row }) => <span className="flex items-center gap-2"><span className="h-2 flex-1 overflow-hidden rounded-full bg-tile-strong"><span className="block h-full rounded-full bg-primary" style={{ width: `${row.original.expected / scale * 100}%` }}/></span><span className="w-10 text-right font-medium tabular-nums">±{fmt(row.original.expected)}</span></span> },
    { id: 'source', accessorFn: r => r.measured?.n ?? 0, header: 'Medido en', cell: ({ row }) => { const r = row.original;
      return r.source === 'municipio' ? <span className="text-muted-foreground tabular-nums">{r.measured!.n} parcelas del municipio</span>
        : <span className="text-muted-foreground" title={`Menos de ${SMALL_SAMPLE} parcelas evaluadas en el municipio: se usa el error del estado`}>el estado <span className="rounded-full bg-tile-strong px-1.5 py-px text-[10px]">poca muestra{r.measured ? ` · ${r.measured.n} aquí` : ''}</span></span>; } },
  ], [scale]);
  const table = useDataTable<Region>({ ...TABLE_OPTIONS, data: municipalities, columns, getRowId: r => r.name, enableTopToolbar: false, enableColumnFilters: false, enableGlobalFilter: false,
    enableRowSelection: true, selectAllMode: 'all', positionToolbarAlertBanner: 'none', state: { rowSelection }, onRowSelectionChange,
    initialState: { sorting: [{ id: 'parcels', desc: true }] }, renderCaption: () => <span className="sr-only">Error esperado por municipio en {state}</span> });
  const top = Math.ceil(Math.max(...states.map(s => s.expected), overall) * 12) / 10, step = top > .6 ? .2 : .1;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => Math.round(i * step * 10) / 10);
  const who = picked.size ? `${current.length} ${current.length === 1 ? 'parcela seleccionada' : 'parcelas seleccionadas'}` : `${current.length} parcelas mostradas`;
  const stateRow = states.find(s => s.name === state);

  useMilliController('region', {
    snapshot: () => ({ economia: { error_esperado: { vista: state ? `municipios de ${state}` : 'estados', error_general_t_ha: round(overall, 3), para: who,
      estados: states.map(s => ({ estado: s.name, parcelas: s.n, error_esperado_t_ha: round(s.expected, 3) })) } } }),
    commands: {
      region_error_drill: ({ state: next }) => { setState(next as string | null); return {}; },
      read_table: args => {
        if (!state) throw new Error('La tabla de municipios se abre con region_error_drill(state). Ahora se ven los estados (get_screen_state → economia.error_esperado).');
        return tableSlice(table.getRowModel().rows.map(r => ({ municipio: r.original.name, parcelas: r.original.parcels, marcadas: r.original.picked, error_esperado_t_ha: round(r.original.expected, 3),
          fuente: r.original.source, medido_en_parcelas: r.original.measured?.n ?? null })), args, { tabla: 'error_municipios', estado: state });
      },
    },
  });

  return <figure className="tile grid min-h-[300px] content-start gap-2 rounded-[20px] p-3">
    <div className="flex items-start gap-2 px-1">
      {state && <button type="button" onClick={() => setState(null)} aria-label="Volver a los estados" title="Volver a los estados" className="grid size-8 shrink-0 place-items-center rounded-full bg-frame/70 hover:bg-frame [&_svg]:size-4"><ArrowLeft/></button>}
      <figcaption className="mr-auto text-sm font-medium">{state ? `Error esperado en ${state}` : 'Error esperado por estado'}
        <span className="block text-xs font-normal text-muted-foreground">{state ? `${stateRow ? `±${fmt(stateRow.expected)} t/ha para ${stateRow.n} de ${who}` : `Ninguna de las ${who} está en ${state}`} · general ±${fmt(overall)} t/ha` : `Para ${who} · error de su municipio (o de su estado con poca muestra), medido fuera de partición`}</span></figcaption>
      {!state && <span className="flex items-center gap-1.5 rounded-full bg-primary-container px-2.5 py-1 text-[11px] text-on-primary-container"><MousePointerClick className="size-3.5"/>Haz clic en un estado para ver sus municipios</span>}
    </div>
    <AnimatePresence mode="wait" initial={false}>
      {state
        ? <motion.div key="municipalities" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: .22 }}>
            <DataTable table={table} surfaceClassName="max-h-[260px] rounded-2xl"/>
          </motion.div>
        : <motion.div key="states" className="grid gap-2" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: .22 }}>
            {states.length ? <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
              <BarChart data={states} margin={{ top: 22, right: 8, bottom: 0, left: -12 }}>
                <CartesianGrid vertical={false}/>
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12}/>
                <YAxis tickLine={false} axisLine={false} fontSize={11} unit=" t/ha" width={64} domain={[0, ticks[ticks.length - 1]]} ticks={ticks} interval={0}/>
                <ReferenceLine y={overall} stroke="var(--muted-foreground)" strokeDasharray="4 4" label={{ value: `General ±${fmt(overall)}`, position: 'insideTopRight', fontSize: 10, fill: 'var(--muted-foreground)' }}/>
                <ChartTooltip cursor={{ fill: 'var(--primary)', fillOpacity: .06 }} content={<ChartTooltipContent hideIndicator labelFormatter={label => `${label} · clic para ver municipios`}
                  formatter={(_v, _n, item) => { const r = item.payload as { expected: number; n: number }; return <span className="tabular-nums">Error esperado ±{fmt(r.expected)} t/ha · {r.n} {r.n === 1 ? 'parcela' : 'parcelas'}</span>; }}/>}/>
                <Bar dataKey="expected" fill="var(--color-expected)" fillOpacity={.85} radius={[8, 8, 2, 2]} maxBarSize={88} className="cursor-pointer" onClick={d => { const name = (d as unknown as { payload?: { name: string } }).payload?.name; if (name) setState(name); }}>
                  <LabelList dataKey="expected" position="top" fontSize={11} formatter={v => `±${fmt(Number(v))}`}/>
                </Bar>
              </BarChart>
            </ChartContainer> : <p className="grid h-[200px] place-items-center text-sm text-muted-foreground">No hay parcelas con estimación en la vista actual.</p>}
            <div role="group" aria-label="Ver municipios de un estado" className="flex flex-wrap gap-1.5 px-1">
              {states.map(s => <button key={s.name} type="button" onClick={() => setState(s.name)} className="rounded-full bg-frame/70 px-3 py-1 text-xs hover:bg-frame">{s.name} <span className="text-muted-foreground tabular-nums">· {s.n}</span></button>)}
            </div>
          </motion.div>}
    </AnimatePresence>
  </figure>;
}
