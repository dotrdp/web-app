// Expected error by region: the model's out-of-fold error (estimate − recorded, on the 138
// parcels with recorded yield) per state, as clickable bars; a state opens its municipalities
// in a table whose error bars share one scale, and an arrow at the top returns to the states.
import { useMemo, useState } from 'react';
import { ArrowLeft, MousePointerClick } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { AnimatePresence, motion } from 'motion/react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { DataTable, useDataTable } from '@/components/ui/data-table';
import { fmt } from '../lib';
import { TABLE_OPTIONS } from './table-es';
import type { Parcel } from '../types';

type Region = { name: string; n: number; mae: number; rmse: number; bias: number };
const chartConfig = { mae: { label: 'Error esperado', color: 'var(--primary)' } } satisfies ChartConfig;
/** Fewer evaluated parcels than this and the regional error is only indicative. */
const SMALL_SAMPLE = 5;

function summarise(parcels: Parcel[], key: (p: Parcel) => string): Region[] {
  const groups = new Map<string, number[]>();
  for (const p of parcels) { const e = p.properties.predictedYield! - p.properties.observedYield!; groups.set(key(p), [...groups.get(key(p)) ?? [], e]); }
  return [...groups].map(([name, errors]) => ({ name, n: errors.length, mae: errors.reduce((t, e) => t + Math.abs(e), 0) / errors.length,
    rmse: Math.sqrt(errors.reduce((t, e) => t + e * e, 0) / errors.length), bias: errors.reduce((t, e) => t + e, 0) / errors.length })).sort((a, b) => b.n - a.n);
}

export default function RegionError({ parcels, overall }: { parcels: Parcel[]; overall: number }) {
  const [state, setState] = useState<string | null>(null);
  const evaluated = useMemo(() => parcels.filter(p => p.properties.group === 'training' && p.properties.observedYield != null && p.properties.predictedYield != null), [parcels]);
  const states = useMemo(() => summarise(evaluated, p => p.properties.state), [evaluated]);
  const municipalities = useMemo(() => state ? summarise(evaluated.filter(p => p.properties.state === state), p => p.properties.municipality) : [], [evaluated, state]);
  const scale = Math.max(...municipalities.map(m => m.mae), overall, .01);
  const current = states.find(s => s.name === state);
  // Even axis steps of 0.1 t/ha (0.2 above 0.6) up to a little above the tallest bar or the overall line.
  const top = Math.ceil(Math.max(...states.map(s => s.mae), overall) * 12) / 10, step = top > .6 ? .2 : .1;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => Math.round(i * step * 10) / 10);

  const columns = useMemo<ColumnDef<Region>[]>(() => [
    { id: 'name', accessorKey: 'name', header: 'Municipio', cell: ({ row }) => <span className="font-medium">{row.original.name}{row.original.n < SMALL_SAMPLE && <span className="ml-1.5 rounded-full bg-tile-strong px-1.5 py-px text-[10px] font-normal text-muted-foreground" title={`Menos de ${SMALL_SAMPLE} parcelas evaluadas: el error es solo indicativo`}>poca muestra</span>}</span> },
    { id: 'n', accessorKey: 'n', header: 'Parcelas', meta: { align: 'right' } },
    { id: 'mae', accessorKey: 'mae', header: 'Error esperado t/ha', size: 240,
      cell: ({ getValue }) => { const v = getValue<number>(); return <span className="flex items-center gap-2"><span className="h-2 flex-1 overflow-hidden rounded-full bg-tile-strong"><span className="block h-full rounded-full bg-primary" style={{ width: `${v / scale * 100}%` }}/></span><span className="w-10 text-right font-medium tabular-nums">±{fmt(v)}</span></span>; } },
    { id: 'rmse', accessorKey: 'rmse', header: 'RMSE', cell: ({ getValue }) => fmt(getValue<number>()), meta: { align: 'right' } },
    { id: 'bias', accessorKey: 'bias', header: 'Sesgo', cell: ({ getValue }) => { const v = getValue<number>(); return `${v >= 0 ? '+' : ''}${fmt(v)}`; }, meta: { align: 'right' } },
  ], [scale]);
  const table = useDataTable<Region>({ ...TABLE_OPTIONS, data: municipalities, columns, getRowId: r => r.name, enableTopToolbar: false, enableColumnFilters: false, enableGlobalFilter: false,
    initialState: { sorting: [{ id: 'n', desc: true }] }, renderCaption: () => <span className="sr-only">Error esperado por municipio en {state}</span> });

  return <figure className="tile grid min-h-[300px] content-start gap-2 rounded-[20px] p-3">
    <div className="flex items-start gap-2 px-1">
      {state && <button type="button" onClick={() => setState(null)} aria-label="Volver a los estados" title="Volver a los estados" className="grid size-8 shrink-0 place-items-center rounded-full bg-frame/70 hover:bg-frame [&_svg]:size-4"><ArrowLeft/></button>}
      <figcaption className="mr-auto text-sm font-medium">{state ? `Error esperado en ${state}` : 'Error esperado por estado'}
        <span className="block text-xs font-normal text-muted-foreground">{state ? `${current?.n ?? 0} parcelas evaluadas · ±${fmt(current?.mae)} t/ha en el estado · general ±${fmt(overall)} t/ha` : `Error fuera de partición (MAE) · ${evaluated.length} parcelas con rendimiento registrado`}</span></figcaption>
      {!state && <span className="flex items-center gap-1.5 rounded-full bg-primary-container px-2.5 py-1 text-[11px] text-on-primary-container"><MousePointerClick className="size-3.5"/>Haz clic en un estado para ver sus municipios</span>}
    </div>
    <AnimatePresence mode="wait" initial={false}>
      {state
        ? <motion.div key="municipalities" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: .22 }}>
            <DataTable table={table} surfaceClassName="max-h-[260px] rounded-2xl"/>
          </motion.div>
        : <motion.div key="states" className="grid gap-2" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: .22 }}>
            <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
              <BarChart data={states} margin={{ top: 22, right: 8, bottom: 0, left: -12 }}>
                <CartesianGrid vertical={false}/>
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12}/>
                <YAxis tickLine={false} axisLine={false} fontSize={11} unit=" t/ha" width={64} domain={[0, ticks[ticks.length - 1]]} ticks={ticks} interval={0}/>
                <ReferenceLine y={overall} stroke="var(--muted-foreground)" strokeDasharray="4 4" label={{ value: `General ±${fmt(overall)}`, position: 'insideTopRight', fontSize: 10, fill: 'var(--muted-foreground)' }}/>
                <ChartTooltip cursor={{ fill: 'var(--primary)', fillOpacity: .06 }} content={<ChartTooltipContent hideIndicator labelFormatter={label => `${label} · clic para ver municipios`}
                  formatter={(_v, _n, item) => { const r = item.payload as Region; return <span className="grid gap-0.5 tabular-nums"><span>Error esperado ±{fmt(r.mae)} t/ha</span><span className="text-muted-foreground">RMSE {fmt(r.rmse)} · sesgo {r.bias >= 0 ? '+' : ''}{fmt(r.bias)} · {r.n} parcelas</span></span>; }}/>}/>
                <Bar dataKey="mae" radius={[8, 8, 2, 2]} maxBarSize={88} className="cursor-pointer" onClick={d => { const name = (d as unknown as { payload?: Region }).payload?.name; if (name) setState(name); }}>
                  {states.map(s => <Cell key={s.name} fill="var(--color-mae)" fillOpacity={.85}/>)}
                  <LabelList dataKey="mae" position="top" fontSize={11} formatter={v => `±${fmt(Number(v))}`}/>
                </Bar>
              </BarChart>
            </ChartContainer>
            <div role="group" aria-label="Ver municipios de un estado" className="flex flex-wrap gap-1.5 px-1">
              {states.map(s => <button key={s.name} type="button" onClick={() => setState(s.name)} className="rounded-full bg-frame/70 px-3 py-1 text-xs hover:bg-frame">{s.name} <span className="text-muted-foreground tabular-nums">· {s.n}</span></button>)}
            </div>
          </motion.div>}
    </AnimatePresence>
  </figure>;
}
