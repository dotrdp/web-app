import { useLayoutEffect, useRef, useState } from 'react';
import { fmt, MONTHS, MONTH_NAMES } from './lib';

// Charts are drawn in real pixels: the SVG width follows its container so axis
// text stays crisp (11px sans) at every card size. Calm palette: brand green for
// vegetation, muted slate and clay for climate. Styling lives in pages.css (.chart*).

export const CHART_COLORS = { vegetation: '#1e6b47', warm: '#b0622d', cool: '#4f7590', negative: '#8a8f8b', rainSoft: '#d3dfe7' };

function useWidth(fallback: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(fallback);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => { const next = Math.round(element.getBoundingClientRect().width); if (next > 0) setWidth(next); };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Contiguous runs of observed months, so gaps stay gaps in lines and areas. */
function segments(data: (number | null)[]) {
  const runs: number[][] = [];
  data.forEach((v, i) => { if (v == null) return; if (i === 0 || data[i - 1] == null) runs.push([]); runs.at(-1)!.push(i); });
  return runs;
}

function Tooltip({ left, width, title, rows }: { left: number; width: number; title: string; rows: { color: string; label?: string; value: string; dashed?: boolean }[] }) {
  const clamped = Math.min(width - 78, Math.max(78, left));
  return <div className="chart-tooltip" style={{ left: clamped }} aria-hidden="true">
    <span className="chart-tooltip-title">{title}</span>
    {rows.map((row, i) => <span className="chart-tooltip-row" key={i}><i className={row.dashed ? 'dashed' : ''} style={{ background: row.color, borderColor: row.color }}/>{row.label && <span>{row.label}</span>}<b>{row.value}</b></span>)}
  </div>;
}

export function LineChart({ values, color = CHART_COLORS.vegetation, comparison, comparisonColor = CHART_COLORS.cool, compact = false, label = 'NDVI', unit = '', minimum = 0, maximum = 1, seriesLabels }: { values: (number | null)[]; color?: string; comparison?: (number | null)[]; comparisonColor?: string; compact?: boolean; label?: string; unit?: string; minimum?: number; maximum?: number; seriesLabels?: [string, string] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [ref, w] = useWidth(540);
  const h = compact ? 112 : 224, left = compact ? 8 : 40, right = compact ? 8 : 12, top = compact ? 10 : 14, bottom = 26;
  const plotH = h - top - bottom, plotW = Math.max(10, w - left - right), step = plotW / 11, base = top + plotH;
  const x = (i: number) => left + step * i;
  const y = (v: number) => top + (maximum - Math.min(maximum, Math.max(minimum, v))) / (maximum - minimum) * plotH;
  const line = (data: (number | null)[]) => segments(data).map(run => run.map((i, k) => `${k ? 'L' : 'M'}${x(i).toFixed(1)},${y(data[i]!).toFixed(1)}`).join(' ')).join(' ');
  const area = segments(values).filter(run => run.length > 1).map(run => `${run.map((i, k) => `${k ? 'L' : 'M'}${x(i).toFixed(1)},${y(values[i]!).toFixed(1)}`).join(' ')} L${x(run.at(-1)!).toFixed(1)},${base} L${x(run[0]).toFixed(1)},${base} Z`).join(' ');
  const ticks = compact ? [1] : [0, .25, .5, .75, 1];
  const digits = unit ? 1 : 2;
  const hovered = hover != null && (values[hover] != null || comparison?.[hover] != null);
  return <div ref={ref} className={`chart line-chart ${compact ? 'compact-chart' : ''}`} onMouseLeave={() => setHover(null)}>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${label} mensual. ${values.filter(v => v != null).length} meses con datos.`}>
      <g className="chart-grid">{ticks.map(t => <line key={t} x1={left} x2={w - right} y1={top + plotH * t} y2={top + plotH * t} className={t === 1 ? 'baseline' : ''}/>)}</g>
      {!compact && <g className="chart-axis">{ticks.map(t => <text key={t} x={left - 8} y={top + plotH * t + 3.5} textAnchor="end">{fmt(maximum - t * (maximum - minimum), 1)}</text>)}</g>}
      <g className="chart-axis">{MONTHS.map((m, i) => ((!compact && step >= 27) || i % 2 === 0) && <text key={m} x={x(i)} y={h - 8} textAnchor="middle" className={hover === i ? 'active' : ''}>{m}</text>)}</g>
      {hovered && <line className="chart-cursor" x1={x(hover!)} x2={x(hover!)} y1={top} y2={base}/>}
      {area && !comparison && <path d={area} fill={color} fillOpacity=".07"/>}
      {comparison && <path d={line(comparison)} fill="none" stroke={comparisonColor} strokeWidth="1.75" strokeDasharray="4 4" strokeLinecap="round"/>}
      <path d={line(values)} fill="none" stroke={color} strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round"/>
      {comparison?.map((v, i) => v != null && (!compact || hover === i) && <circle key={`c${i}`} cx={x(i)} cy={y(v)} r={hover === i ? 4 : 2.25} fill={comparisonColor} stroke="var(--card)" strokeWidth="1.5"/>)}
      {values.map((v, i) => v != null && (!compact || hover === i) && <circle key={i} cx={x(i)} cy={y(v)} r={hover === i ? 4 : 2.5} fill={color} stroke="var(--card)" strokeWidth="1.5"><title>{MONTHS[i]}: {fmt(v, 3)} {unit}</title></circle>)}
      {values.map((_, i) => <rect key={`h${i}`} x={x(i) - step / 2} y="0" width={step} height={h} fill="transparent" onMouseEnter={() => setHover(i)}/>)}
    </svg>
    {hovered && <Tooltip left={x(hover!)} width={w} title={MONTH_NAMES[hover!]} rows={[
      { color, label: comparison ? seriesLabels?.[0] ?? label : undefined, value: `${fmt(values[hover!], digits)}${unit ? ` ${unit}` : ''}` },
      ...(comparison ? [{ color: comparisonColor, dashed: true, label: seriesLabels?.[1], value: `${fmt(comparison[hover!], digits)}${unit ? ` ${unit}` : ''}` }] : []),
    ]}/>}
    {!values.some(v => v != null) && <p className="chart-empty">Sin observaciones válidas en este periodo.</p>}
  </div>;
}

export function RainChart({ values, month }: { values: (number | null)[]; month: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const [ref, w] = useWidth(540);
  // Round axis: 0, 50, 100… (or 100 / 200 steps for wetter months).
  const rawMax = Math.max(100, ...values.filter((n): n is number => n != null));
  const tickStep = rawMax <= 150 ? 50 : rawMax <= 300 ? 50 * Math.ceil(rawMax / 250) : 100 * Math.ceil(rawMax / 500);
  const max = Math.ceil(rawMax / tickStep) * tickStep, tickCount = max / tickStep;
  const h = 224, left = 40, right = 12, top = 18, bottom = 26;
  const plotH = h - top - bottom, plotW = Math.max(10, w - left - right), step = plotW / 12, base = top + plotH;
  const barW = Math.max(6, Math.min(24, step * .5));
  const bar = (i: number, v: number) => {
    const bh = Math.max(0, v / max * plotH), x0 = left + step * i + (step - barW) / 2, y0 = base - bh, r = Math.min(3, bh, barW / 2);
    return `M${x0},${base} V${y0 + r} Q${x0},${y0} ${x0 + r},${y0} H${x0 + barW - r} Q${x0 + barW},${y0} ${x0 + barW},${y0 + r} V${base} Z`;
  };
  const cx = (i: number) => left + step * i + step / 2;
  const shown = hover ?? month;
  return <div ref={ref} className="chart rain-chart" onMouseLeave={() => setHover(null)}>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Precipitación mensual en milímetros">
      <g className="chart-grid">{Array.from({ length: tickCount + 1 }, (_, i) => <line key={i} x1={left} x2={w - right} y1={top + plotH * i / tickCount} y2={top + plotH * i / tickCount} className={i === tickCount ? 'baseline' : ''}/>)}</g>
      <g className="chart-axis">{Array.from({ length: tickCount + 1 }, (_, i) => <text key={i} x={left - 8} y={top + plotH * i / tickCount + 3.5} textAnchor="end">{fmt(max * (1 - i / tickCount), 0)}</text>)}</g>
      {values.map((v, i) => v != null && v > 0 && <path key={i} d={bar(i, v)} fill={i === month ? CHART_COLORS.cool : CHART_COLORS.rainSoft} opacity={hover != null && hover !== i ? .6 : 1}><title>{MONTHS[i]}: {fmt(v, 1)} mm</title></path>)}
      {values[shown] != null && hover == null && <text className="chart-value-label" x={cx(shown)} y={base - (values[shown]! / max * plotH) - 7} textAnchor="middle">{fmt(values[shown], 0)}</text>}
      <g className="chart-axis">{MONTHS.map((m, i) => (step >= 27 || i % 2 === 0) && <text key={m} x={cx(i)} y={h - 8} textAnchor="middle" className={i === month || hover === i ? 'active' : ''}>{m}</text>)}</g>
      {values.map((_, i) => <rect key={`h${i}`} x={left + step * i} y="0" width={step} height={h} fill="transparent" onMouseEnter={() => setHover(i)}/>)}
    </svg>
    {hover != null && <Tooltip left={cx(hover)} width={w} title={MONTH_NAMES[hover]} rows={[{ color: hover === month ? CHART_COLORS.cool : CHART_COLORS.rainSoft, value: values[hover] == null ? 'Sin dato' : `${fmt(values[hover], 1)} mm` }]}/>}
  </div>;
}

/** 64-axis AlphaEarth vector as a diverging heatmap: tint strength follows |value|. */
export function EmbeddingChart({ values }: { values?: number[] }) {
  return <div className="embedding-chart">
    <div className="embedding-grid" role="img" aria-label={values ? 'Las 64 dimensiones del embedding AlphaEarth de la parcela.' : 'No hay embeddings para esta parcela.'}>
      {Array.from({ length: 64 }, (_, i) => {
        const v = values?.[i], t = v == null ? 0 : Math.min(1, Math.abs(v) * 3.4);
        const sign = v == null ? 'empty' : v >= 0 ? 'positive' : 'negative';
        return <div key={i} className="embedding-cell" data-sign={sign} data-strong={t > .55 ? '' : undefined} title={`A${String(i).padStart(2, '0')}: ${fmt(v, 5)}`} style={{ '--t': t.toFixed(3) } as React.CSSProperties}>
          <span>A{String(i).padStart(2, '0')}</span><b>{fmt(v, 3)}</b>
        </div>;
      })}
    </div>
    <div className="embedding-legend" aria-hidden="true">
      <span>Negativo</span>
      <span className="embedding-legend-scale">{[1, .6, .25, 0, .25, .6, 1].map((t, i) => <i key={i} data-sign={i < 3 ? 'negative' : i > 3 ? 'positive' : 'empty'} style={{ '--t': t } as React.CSSProperties}/>)}</span>
      <span>Positivo</span>
      <span className="embedding-legend-note">Intensidad = magnitud del eje</span>
    </div>
  </div>;
}

export function MiniSpark({ values, color = CHART_COLORS.vegetation }: { values: number[]; color?: string }) {
  const minimum = Math.min(...values), maximum = Math.max(...values) + .001;
  const path = values.map((n, i) => `${i ? 'L' : 'M'}${i * 64 / Math.max(1, values.length - 1)},${22 - (n - minimum) / (maximum - minimum) * 19}`).join(' ');
  return <svg width="67" height="27" viewBox="0 0 67 27" aria-hidden="true"><path d={path} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
