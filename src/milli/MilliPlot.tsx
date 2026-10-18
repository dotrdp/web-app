// create_plot in the chat: the chart Milli asked for, drawn from the tool call's arguments with the
// app's shadcn charts (recharts + theme tokens, so it follows light/dark and the crop palettes).
// Lines, bars (vertical or horizontal), areas, and their combinations on one or two axes; scatter
// with an optional y = x line. While the call runs the card holds its place.
import { motion } from 'motion/react';
import { Area, Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import type { ToolCallMessagePartComponent } from '@assistant-ui/react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { fmt } from '../lib';

type Kind = 'line' | 'bar' | 'area';
type Series = { name: string; values?: (number | null)[]; points?: { x: number; y: number; label?: string }[]; type?: Kind; axis?: 'left' | 'right'; color?: string };
export type PlotSpec = {
  title: string; subtitle?: string; kind: Kind | 'scatter'; x?: (string | number)[];
  x_label?: string; y_label?: string; y_unit?: string; y2_label?: string; y2_unit?: string; y_min?: number; y_max?: number;
  series: Series[]; stacked?: boolean; horizontal?: boolean; identity_line?: boolean;
  reference_lines?: { axis: 'x' | 'y'; value: number | string; label?: string }[]; note?: string;
};

const COLORS: Record<string, string> = { verde: 'var(--chart-1)', azul: 'var(--chart-4)', ambar: 'var(--chart-5)', verde_claro: 'var(--chart-3)', gris: 'var(--muted-foreground)' };
const ORDER = ['verde', 'azul', 'ambar', 'verde_claro', 'gris'];
const colorOf = (s: Series, i: number) => COLORS[s.color ?? ''] ?? COLORS[ORDER[i]] ?? 'var(--chart-2)';

/** Digits that suit the data's size: 0.734, 2.31, 207.6, 1,700. */
function digitsFor(values: number[]) {
  const top = Math.max(0, ...values.map(Math.abs));
  return top < 1 ? 3 : top < 10 ? 2 : top < 1000 ? 1 : 0;
}
const tick = (digits: number) => (v: number) => typeof v === 'number' ? fmt(v, Math.max(0, digits - 1)) : String(v);
const axisTitle = (label?: string, unit?: string) => label ? `${label}${unit ? ` (${unit})` : ''}` : unit ?? '';

function Legend({ series }: { series: Series[] }) {
  if (series.length < 2) return null;
  return <ul className="flex flex-wrap gap-x-3 gap-y-1 px-1 text-[11px] text-muted-foreground">
    {series.map((s, i) => <li key={i} className="flex items-center gap-1.5">
      <span className={s.type === 'line' ? 'h-0.5 w-3 rounded-full' : 'size-2.5 rounded-[3px]'} style={{ background: colorOf(s, i) }}/>{s.name}
    </li>)}
  </ul>;
}

function Row({ color, name, value, unit, digits }: { color: string; name: string; value: unknown; unit?: string; digits: number }) {
  const number = typeof value === 'number' && Number.isFinite(value);
  return <div className="flex w-full min-w-36 items-center gap-2">
    <span className="size-2.5 shrink-0 rounded-[2px]" style={{ background: color }}/>
    <span className="text-muted-foreground">{name}</span>
    <span className="ml-auto font-mono font-medium text-foreground tabular-nums">{number ? fmt(value as number, digits) : 'Sin dato'}{number && unit && <span className="ml-0.5 font-normal text-muted-foreground">{unit}</span>}</span>
  </div>;
}

function Cartesian({ spec }: { spec: PlotSpec }) {
  const x = spec.x ?? [], horizontal = !!spec.horizontal;
  const rows = x.map((cat, i) => Object.fromEntries([['x', String(cat)], ...spec.series.map((s, k) => [`s${k}`, s.values?.[i] ?? null])]));
  const config = Object.fromEntries(spec.series.map((s, k) => [`s${k}`, { label: s.name, color: colorOf(s, k) }])) satisfies ChartConfig;
  const right = spec.series.some(s => s.axis === 'right');
  const digits = (axis: 'left' | 'right') => digitsFor(spec.series.filter(s => (s.axis ?? 'left') === axis).flatMap(s => (s.values ?? []).filter((v): v is number => v != null)));
  const [dl, dr] = [digits('left'), digits('right')];
  const domain = [spec.y_min ?? 'auto', spec.y_max ?? 'auto'] as [number | 'auto', number | 'auto'];
  const height = horizontal ? Math.min(420, Math.max(160, x.length * 22 + 40)) : 210;
  const longest = Math.max(...x.map(c => String(c).length));
  const category = <XAxis dataKey="x" type="category" tickLine={false} axisLine={false} tickMargin={8} minTickGap={8} interval="preserveStartEnd" label={spec.x_label ? { value: spec.x_label, position: 'insideBottom', offset: -2, fontSize: 10 } : undefined}/>;
  const valueAxis = (id: 'left' | 'right') => horizontal
    ? <XAxis key={id} xAxisId={id} type="number" domain={domain} tickLine={false} axisLine={false} tickFormatter={tick(dl)} orientation={id === 'right' ? 'top' : 'bottom'}/>
    : <YAxis key={id} yAxisId={id} orientation={id} domain={id === 'left' ? domain : ['auto', 'auto']} tickLine={false} axisLine={false} width={44} tickCount={5} tickFormatter={tick(id === 'left' ? dl : dr)}
        label={axisTitle(id === 'left' ? spec.y_label : spec.y2_label, id === 'left' ? spec.y_unit : spec.y2_unit) ? { value: axisTitle(id === 'left' ? spec.y_label : spec.y2_label, id === 'left' ? spec.y_unit : spec.y2_unit), angle: -90, position: id === 'left' ? 'insideLeft' : 'insideRight', fontSize: 10, style: { textAnchor: 'middle' } } : undefined}/>;
  const axisProp = (axis: 'left' | 'right') => horizontal ? { xAxisId: axis } : { yAxisId: axis };
  return <ChartContainer config={config} className="aspect-auto w-full" style={{ height }}>
    <ComposedChart data={rows} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ top: 8, right: right ? 0 : 6, left: 0, bottom: spec.x_label ? 10 : 0 }}>
      <CartesianGrid vertical={horizontal} horizontal={!horizontal}/>
      {horizontal ? <YAxis dataKey="x" type="category" tickLine={false} axisLine={false} width={Math.min(110, longest * 6.5 + 8)} interval={0} fontSize={10}/> : category}
      {valueAxis('left')}{right && valueAxis('right')}
      <ChartTooltip cursor={{ fill: 'var(--tile)' }} content={<ChartTooltipContent indicator="line" formatter={(value, _name, item) => {
        const k = Number(String(item.dataKey).slice(1)), s = spec.series[k];
        return <Row color={colorOf(s, k)} name={s.name} value={value} unit={s.axis === 'right' ? spec.y2_unit : spec.y_unit} digits={s.axis === 'right' ? dr : dl}/>;
      }}/>}/>
      {(spec.reference_lines ?? []).map((r, i) => {
        const onValue = r.axis === 'y', props = onValue ? (horizontal ? { x: Number(r.value), xAxisId: 'left' } : { y: Number(r.value), yAxisId: 'left' }) : (horizontal ? { y: String(r.value), xAxisId: 'left' } : { x: String(r.value), yAxisId: 'left' }) as unknown as { x?: number; y?: number };
        return <ReferenceLine key={i} {...props} stroke="var(--foreground)" strokeOpacity={.55} strokeDasharray="4 4" ifOverflow="extendDomain" label={r.label ? { value: r.label, position: 'insideTopRight', fontSize: 10, fill: 'var(--muted-foreground)' } : undefined}/>;
      })}
      {spec.series.map((s, k) => {
        const type = s.type ?? (spec.kind as Kind), key = `s${k}`, axis = s.axis ?? 'left', color = `var(--color-${key})`;
        const stack = spec.stacked ? `stack-${axis}` : undefined;
        if (type === 'bar') return <Bar key={key} dataKey={key} name={key} {...axisProp(axis)} stackId={stack} fill={color} radius={stack ? 0 : horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]} maxBarSize={28} fillOpacity={spec.series.length > 1 && spec.kind !== 'bar' ? .55 : 1}/>;
        if (type === 'area') return <Area key={key} dataKey={key} name={key} {...axisProp(axis)} stackId={stack} type="monotone" stroke={color} fill={color} fillOpacity={.18} strokeWidth={2} connectNulls={false}/>;
        return <Line key={key} dataKey={key} name={key} {...axisProp(axis)} type="monotone" stroke={color} strokeWidth={2} dot={x.length <= 24 ? { r: 2.5, fill: color, stroke: 'var(--card)', strokeWidth: 1 } : false} activeDot={{ r: 4.5 }} connectNulls={false}/>;
      })}
    </ComposedChart>
  </ChartContainer>;
}

type Point = { x: number; y: number; label?: string };
function ScatterPlot({ spec }: { spec: PlotSpec }) {
  const all = spec.series.flatMap(s => s.points ?? []);
  const config = Object.fromEntries(spec.series.map((s, k) => [`s${k}`, { label: s.name, color: colorOf(s, k) }])) satisfies ChartConfig;
  const [dx, dy] = [digitsFor(all.map(p => p.x)), digitsFor(all.map(p => p.y))];
  const lo = Math.min(...all.flatMap(p => [p.x, p.y])), hi = Math.max(...all.flatMap(p => [p.x, p.y]));
  const domain = [spec.y_min ?? 'auto', spec.y_max ?? 'auto'] as [number | 'auto', number | 'auto'];
  return <ChartContainer config={config} className="aspect-auto h-[240px] w-full">
    <ScatterChart margin={{ top: 8, right: 8, left: 0, bottom: spec.x_label ? 10 : 0 }}>
      <CartesianGrid/>
      <XAxis dataKey="x" type="number" domain={['auto', 'auto']} tickLine={false} axisLine={false} tickMargin={6} tickFormatter={tick(dx)} label={spec.x_label ? { value: spec.x_label, position: 'insideBottom', offset: -4, fontSize: 10 } : undefined}/>
      <YAxis dataKey="y" type="number" domain={domain} tickLine={false} axisLine={false} width={44} tickFormatter={tick(dy)}
        label={axisTitle(spec.y_label, spec.y_unit) ? { value: axisTitle(spec.y_label, spec.y_unit), angle: -90, position: 'insideLeft', fontSize: 10, style: { textAnchor: 'middle' } } : undefined}/>
      {spec.identity_line && Number.isFinite(lo) && <ReferenceLine segment={[{ x: lo, y: lo }, { x: hi, y: hi }]} stroke="var(--foreground)" strokeOpacity={.45} strokeDasharray="4 4" ifOverflow="extendDomain"/>}
      {(spec.reference_lines ?? []).map((r, i) => <ReferenceLine key={i} {...(r.axis === 'x' ? { x: Number(r.value) } : { y: Number(r.value) })} stroke="var(--foreground)" strokeOpacity={.55} strokeDasharray="4 4" ifOverflow="extendDomain" label={r.label ? { value: r.label, position: 'insideTopRight', fontSize: 10, fill: 'var(--muted-foreground)' } : undefined}/>)}
      <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
        const item = payload?.[0], p = item?.payload as Point | undefined;
        if (!active || !p) return null;
        const k = spec.series.findIndex(s => s.points?.includes(p));
        return <div className="grid min-w-40 gap-1 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
          <span className="font-medium">{p.label ?? spec.series[k]?.name}</span>
          {p.label && spec.series.length > 1 && <span className="text-muted-foreground">{spec.series[k]?.name}</span>}
          <Row color={colorOf(spec.series[k] ?? { name: '' }, Math.max(0, k))} name={spec.x_label ?? 'x'} value={p.x} digits={dx}/>
          <Row color={colorOf(spec.series[k] ?? { name: '' }, Math.max(0, k))} name={spec.y_label ?? 'y'} value={p.y} unit={spec.y_unit} digits={dy}/>
        </div>;
      }}/>
      {spec.series.map((s, k) => <Scatter key={k} name={s.name} data={s.points ?? []} fill={`var(--color-s${k})`} fillOpacity={.8} shape="circle"/>)}
    </ScatterChart>
  </ChartContainer>;
}

export function MilliPlot({ spec }: { spec: PlotSpec }) {
  return <motion.figure initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', bounce: .2, visualDuration: .35 }}
    aria-label={spec.title} className="grid gap-2 rounded-2xl bg-tile px-3 pt-2.5 pb-3">
    <header className="grid gap-0.5 px-1">
      <h4 className="text-[13px] leading-snug font-medium text-balance">{spec.title}</h4>
      {spec.subtitle && <p className="text-[11.5px] leading-snug text-pretty text-muted-foreground">{spec.subtitle}</p>}
    </header>
    {spec.kind === 'scatter' ? <ScatterPlot spec={spec}/> : <Cartesian spec={spec}/>}
    <Legend series={spec.series.map(s => ({ ...s, type: s.type ?? (spec.kind === 'scatter' ? 'bar' : spec.kind) }))}/>
    {spec.note && <figcaption className="px-1 text-[11px] leading-snug text-pretty text-muted-foreground">{spec.note}</figcaption>}
  </motion.figure>;
}

/** The create_plot tool part: a placeholder while it runs, the chart once the server accepted it. */
const PlotPart: ToolCallMessagePartComponent<PlotSpec, { ok?: boolean }> = ({ args, result, isError }) => {
  if (isError) return null; // the action row explains what was wrong
  if (result === undefined) return <div className="grid gap-2 rounded-2xl bg-tile p-3" aria-label="Milli prepara una gráfica"><Skeleton className="h-3.5 w-2/5"/><Skeleton className="h-[180px] w-full rounded-xl"/></div>;
  return args?.series?.length ? <MilliPlot spec={args}/> : null;
};
export default PlotPart;
