import { useState } from 'react';
import { fmt, MONTHS } from './lib';

export function LineChart({ values, color = '#4a8161', comparison, compact = false, label = 'NDVI', unit = '', minimum = 0, maximum = 1 }: { values: (number | null)[]; color?: string; comparison?: (number | null)[]; compact?: boolean; label?: string; unit?: string; minimum?: number; maximum?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const w = 540, h = compact ? 120 : 190, px = compact ? 3 : 38, py = 14, chartH = h - 42;
  const x = (i: number) => px + (w - px - 12) * i / 11;
  const y = (v: number) => py + (maximum - v) / (maximum - minimum) * chartH;
  const line = (data: (number | null)[]) => data.reduce((s, v, i) => v == null ? s : `${s} ${i === 0 || data[i - 1] == null ? 'M' : 'L'}${x(i)},${y(v)}`, '');
  const observed = values.map((v, i) => v != null ? i : -1).filter(i => i >= 0);
  return <div className={`chart ${compact ? 'compact-chart' : ''}`}>
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${label} mensual. ${values.filter(v => v != null).length} meses con datos.`}>
      {!compact && [0, .25, .5, .75, 1].map(t => <g key={t}><line x1={px} x2={w - 10} y1={py + chartH * t} y2={py + chartH * t} stroke="#edf0ed" strokeDasharray="3 4"/><text x={px - 9} y={py + chartH * t + 4} textAnchor="end" fill="#939b96" fontSize="10">{fmt(maximum - t * (maximum - minimum), 1)}</text></g>)}
      {observed.length > 1 && <path d={`${line(values)} L${x(observed.at(-1)!)},${py + chartH} L${x(observed[0])},${py + chartH} Z`} fill={color} opacity=".07"/>}
      {comparison && <path d={line(comparison)} fill="none" stroke="#cda261" strokeWidth="2" strokeDasharray="4 4"/>}
      <path d={line(values)} fill="none" stroke={color} strokeWidth={compact ? 2.5 : 2.8} strokeLinejoin="round" strokeLinecap="round"/>
      {values.map((v, i) => <g key={i}>{v != null && <circle cx={x(i)} cy={y(v)} r={hover === i ? 5 : compact ? 0 : 3} fill={color} stroke="white" strokeWidth="1.5"><title>{MONTHS[i]}: {fmt(v, 3)} {unit}</title></circle>}<rect x={x(i) - 18} y="0" width="36" height={h - 20} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}/><text x={x(i)} y={h - 5} textAnchor="middle" fontSize={compact ? 11 : 10} fill="#939b96">{MONTHS[i]}</text></g>)}
      {hover != null && values[hover] != null && <g><line x1={x(hover)} x2={x(hover)} y1="10" y2={h - 25} stroke={color} opacity=".2"/><rect x={Math.min(w - 104, Math.max(0, x(hover) - 45))} y="1" width="100" height="25" rx="5" fill="#244f3e"/><text x={Math.min(w - 54, Math.max(50, x(hover) + 5))} y="18" textAnchor="middle" fontSize="11" fill="white">{MONTHS[hover]} · {fmt(values[hover], 2)} {unit}</text></g>}
    </svg>
    {!values.some(v => v != null) && <p className="chart-empty">Sin observaciones válidas en este periodo.</p>}
  </div>;
}

export function RainChart({ values, month }: { values: (number | null)[]; month: number }) {
  const max = Math.max(100, ...values.filter((n): n is number => n != null));
  return <div className="rain-chart"><svg viewBox="0 0 540 185" role="img" aria-label="Precipitación mensual en milímetros">
    {[0, 1, 2, 3].map(i => <g key={i}><line x1="38" x2="533" y1={20 + 43 * i} y2={20 + 43 * i} stroke="#edf0ed" strokeDasharray="3 4"/><text x="31" y={24 + 43 * i} textAnchor="end" fill="#939b96" fontSize="10">{fmt(max * (1 - i / 3), 0)}</text></g>)}
    {values.map((v, i) => <g key={i}><rect x={48 + i * 41} y={v == null ? 149 : 149 - v / max * 129} width="22" height={v == null ? 0 : v / max * 129} rx="4" fill={month === i ? '#377968' : '#a8cbd6'}><title>{MONTHS[i]}: {fmt(v, 1)} mm</title></rect><text x={59 + i * 41} y="174" textAnchor="middle" fontSize="10" fill="#939b96">{MONTHS[i]}</text></g>)}
  </svg></div>;
}

export function EmbeddingChart({ values }: { values?: number[] }) {
  return <div className="embedding-grid" role="img" aria-label={values ? 'Las 64 dimensiones del embedding AlphaEarth de la parcela.' : 'No hay embeddings para esta parcela.'}>
    {Array.from({ length: 64 }, (_, i) => { const v = values?.[i]; return <div key={i} title={`A${String(i).padStart(2, '0')}: ${fmt(v, 5)}`} style={{ background: v == null ? '#edf0ee' : v >= 0 ? `rgba(64,125,99,${Math.min(.9, .1 + v * 3)})` : `rgba(157,120,178,${Math.min(.9, .1 + Math.abs(v) * 3)})` }}><span>A{String(i).padStart(2, '0')}</span><b>{fmt(v, 3)}</b></div>; })}
  </div>;
}

export function MiniSpark({ values, color = '#80a385' }: { values: number[]; color?: string }) {
  const minimum = Math.min(...values), maximum = Math.max(...values) + .001;
  const path = values.map((n, i) => `${i ? 'L' : 'M'}${i * 64 / Math.max(1, values.length - 1)},${22 - (n - minimum) / (maximum - minimum) * 19}`).join(' ');
  return <svg width="67" height="27" viewBox="0 0 67 27" aria-hidden="true"><path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
