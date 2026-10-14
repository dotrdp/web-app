import { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart as RechartsLineChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { fmt, MONTHS, MONTH_NAMES } from './lib';

// shadcn/ui charts (ChartContainer + recharts). Colors come from the theme's
// --chart-* tokens: barley green for vegetation, slate for rain / cold, amber for heat.
export const CHART_COLORS = {
  vegetation: 'var(--chart-1)',
  warm: 'var(--chart-5)',
  cool: 'var(--chart-4)',
  negative: 'var(--muted-foreground)',
  rainSoft: 'color-mix(in oklch, var(--chart-4) 35%, transparent)',
};

type Datum = { month: string; name: string; value: number | null; comparison?: number | null; label?: string };
const monthly = (values: (number | null)[], comparison?: (number | null)[]): Datum[] =>
  MONTHS.map((month, i) => ({ month, name: MONTH_NAMES[i], value: values[i] ?? null, ...(comparison ? { comparison: comparison[i] ?? null } : {}) }));

const monthLabel = (_: unknown, payload: readonly { payload?: unknown }[] | undefined) => (payload?.[0]?.payload as Datum | undefined)?.name ?? '';

/** Tooltip row in the shadcn "formatter" style: swatch, series label, value + unit. */
function TipRow({ value, dataKey, config, unit, digits, dashed }: { value: unknown; dataKey: unknown; config: ChartConfig; unit: string; digits: number; dashed?: boolean }) {
  const key = String(dataKey);
  const number = typeof value === 'number' && Number.isFinite(value);
  return <div className="flex w-full min-w-36 items-center gap-2">
    <span className={cn('size-2.5 shrink-0 rounded-[2px]', dashed && 'h-0 w-2.5 rounded-none border-t-2 border-dashed')} style={dashed ? { borderColor: `var(--color-${key})` } : { background: `var(--color-${key})` }}/>
    <span className="text-muted-foreground">{config[key]?.label}</span>
    <span className="ml-auto font-mono font-medium text-foreground tabular-nums">
      {number ? fmt(value as number, digits) : 'Sin dato'}{number && unit && <span className="ml-0.5 font-normal text-muted-foreground">{unit}</span>}
    </span>
  </div>;
}

function EmptyOverlay({ show, children = 'Sin observaciones válidas en este periodo.' }: { show: boolean; children?: ReactNode }) {
  if (!show) return null;
  return <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">{children}</p>;
}

export function LineChart({ values, color = CHART_COLORS.vegetation, comparison, comparisonColor = CHART_COLORS.cool, compact = false, label = 'NDVI', unit = '', minimum = 0, maximum = 1, seriesLabels, className }: { values: (number | null)[]; color?: string; comparison?: (number | null)[]; comparisonColor?: string; compact?: boolean; label?: string; unit?: string; minimum?: number; maximum?: number; seriesLabels?: [string, string]; className?: string }) {
  const gradient = `fill-${useId().replace(/:/g, '')}`;
  const data = monthly(values, comparison);
  const digits = unit ? 1 : 3;
  const config = {
    value: { label: comparison ? seriesLabels?.[0] ?? label : label, color },
    comparison: { label: seriesLabels?.[1] ?? 'Comparación', color: comparisonColor },
  } satisfies ChartConfig;
  const observed = values.filter(v => v != null).length;
  const empty = !observed && !comparison?.some(v => v != null);
  const yAxis = <YAxis hide={compact} domain={[minimum, maximum]} tickLine={false} axisLine={false} width={unit ? 30 : 38} tickMargin={4} tickCount={5} tickFormatter={(v: number) => fmt(v, unit ? 0 : 2)}/>;
  const xAxis = <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} interval={compact ? 2 : 'preserveStartEnd'} minTickGap={compact ? 0 : 12} padding={compact ? { left: 6, right: 6 } : { left: 8, right: 8 }}/>;
  const tooltip = <ChartTooltip cursor={compact ? false : undefined} content={<ChartTooltipContent indicator="line" labelFormatter={monthLabel} formatter={(value, _name, item) => <TipRow value={value} dataKey={item.dataKey} config={config} unit={unit} digits={digits} dashed={item.dataKey === 'comparison'}/>}/>}/>;
  return <div className="relative" role="img" aria-label={`${label} mensual. ${observed} meses con datos.`}>
    <ChartContainer config={config} className={cn('aspect-auto w-full', compact ? 'h-28' : 'h-[250px]', className)}>
      {comparison
        ? <RechartsLineChart data={data} margin={{ top: 8, right: 8, left: compact ? 8 : 0, bottom: 0 }}>
          <CartesianGrid vertical={false}/>
          {xAxis}{yAxis}{tooltip}
          <Line dataKey="value" name="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-value)', stroke: 'var(--card)', strokeWidth: 1.5 }} activeDot={{ r: 5 }}/>
          <Line dataKey="comparison" name="comparison" type="monotone" stroke="var(--color-comparison)" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: 'var(--color-comparison)', stroke: 'var(--card)', strokeWidth: 1.5 }} activeDot={{ r: 5 }}/>
          {!compact && <ChartLegend content={<ChartLegendContent/>}/>}
        </RechartsLineChart>
        : <AreaChart data={data} margin={{ top: compact ? 6 : 8, right: compact ? 4 : 8, left: compact ? 4 : 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-value)" stopOpacity={compact ? 0.35 : 0.45}/>
              <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.04}/>
            </linearGradient>
          </defs>
          {!compact && <CartesianGrid vertical={false}/>}
          {xAxis}{yAxis}{tooltip}
          <Area dataKey="value" name="value" type="monotone" fill={`url(#${gradient})`} stroke="var(--color-value)" strokeWidth={2} dot={{ r: compact ? 2 : 3, fill: 'var(--color-value)', stroke: 'var(--card)', strokeWidth: 1.5 }} activeDot={{ r: compact ? 4 : 5 }}/>
        </AreaChart>}
    </ChartContainer>
    <EmptyOverlay show={empty}/>
  </div>;
}

export function RainChart({ values, month, className }: { values: (number | null)[]; month: number; className?: string }) {
  const config = { value: { label: 'Precipitación', color: CHART_COLORS.cool } } satisfies ChartConfig;
  const data = monthly(values).map((d, i) => ({ ...d, label: i === month && d.value != null ? fmt(d.value, 0) : undefined }));
  return <div className="relative" role="img" aria-label="Precipitación mensual en milímetros">
    <ChartContainer config={config} className={cn('aspect-auto h-[250px] w-full', className)}>
      <BarChart data={data} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false}/>
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} interval="preserveStartEnd" minTickGap={8}/>
        <YAxis tickLine={false} axisLine={false} width={34} tickMargin={4} tickCount={5} allowDecimals={false} domain={[0, 'auto']}/>
        <ChartTooltip content={<ChartTooltipContent labelFormatter={monthLabel} formatter={(value, _name, item) => <TipRow value={value} dataKey={item.dataKey} config={config} unit="mm" digits={1}/>}/>}/>
        <Bar dataKey="value" name="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} maxBarSize={28}>
          {data.map((d, i) => <Cell key={d.month} fillOpacity={i === month ? 1 : 0.32}/>)}
          <LabelList dataKey="label" position="top" offset={6} className="fill-foreground" fontSize={11} fontWeight={500}/>
        </Bar>
      </BarChart>
    </ChartContainer>
    <EmptyOverlay show={!values.some(v => v != null)}/>
  </div>;
}

/** 64-axis AlphaEarth vector as a diverging heatmap: green positive, slate negative, strength = |value|. */
export function EmbeddingChart({ values }: { values?: number[] }) {
  return <div className="@container/embedding flex flex-col gap-4">
    <TooltipProvider delayDuration={0}>
      <div className="grid grid-cols-8 gap-1 @md/embedding:gap-1.5" role="img" aria-label={values ? 'Las 64 dimensiones del embedding AlphaEarth de la parcela.' : 'No hay embeddings para esta parcela.'}>
        {Array.from({ length: 64 }, (_, i) => {
          const v = values?.[i], t = v == null ? 0 : Math.min(1, Math.abs(v) * 3.4);
          const tone = v == null ? null : v >= 0 ? 'var(--chart-1)' : 'var(--chart-4)';
          const axis = `A${String(i).padStart(2, '0')}`;
          const style: CSSProperties = {
            background: tone ? `color-mix(in oklab, ${tone} ${Math.round(t * 100)}%, var(--muted))` : 'var(--muted)',
            color: t > 0.55 ? 'var(--background)' : 'var(--foreground)',
          };
          return <Tooltip key={i}>
            <TooltipTrigger asChild>
              <div className="flex aspect-square flex-col justify-between rounded-md p-1 transition-shadow hover:ring-2 hover:ring-ring @lg/embedding:aspect-[3/2] @lg/embedding:p-1.5 @3xl/embedding:aspect-[2/1]" style={style}>
                <span className="font-mono text-[9px] leading-none opacity-70 @lg/embedding:text-[10px]">{axis}</span>
                <b className="hidden font-mono text-[11px] leading-none font-medium tabular-nums @xl/embedding:block">{fmt(v, 3)}</b>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top"><span className="font-mono tabular-nums">{axis} · {fmt(v, 5)}</span></TooltipContent>
          </Tooltip>;
        })}
      </div>
    </TooltipProvider>
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground" aria-hidden="true">
      <span>Negativo</span>
      <span className="h-2 w-28 rounded-full" style={{ background: 'linear-gradient(in oklab 90deg, var(--chart-4), var(--muted) 50%, var(--chart-1))' }}/>
      <span>Positivo</span>
      <span className="sm:ml-auto">Intensidad = magnitud del eje</span>
    </div>
  </div>;
}

export function MiniSpark({ values, color = CHART_COLORS.vegetation }: { values: number[]; color?: string }) {
  const minimum = Math.min(...values), maximum = Math.max(...values) + .001;
  const path = values.map((n, i) => `${i ? 'L' : 'M'}${i * 64 / Math.max(1, values.length - 1)},${22 - (n - minimum) / (maximum - minimum) * 19}`).join(' ');
  return <svg width="67" height="27" viewBox="0 0 67 27" aria-hidden="true"><path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
