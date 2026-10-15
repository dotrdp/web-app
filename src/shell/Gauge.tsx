// Arc gauge after Caelestia's Performance tab: a 270° tonal track, the value in
// primary, the figure in the middle and a side note.
import type { ReactNode } from 'react';

export default function Gauge({ value, label, figure, unit, size = 132, note, noteLabel }: { value: number; label: string; figure: string; unit?: string; size?: number; note?: ReactNode; noteLabel?: string }) {
  const stroke = Math.max(8, size * .075), r = (size - stroke) / 2, c = 2 * Math.PI * r, arc = c * .75;
  const t = Math.max(0, Math.min(1, value));
  return <figure className="relative flex items-center gap-2" aria-label={`${label}: ${figure}${unit ? ' ' + unit : ''}`}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-[225deg]" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" className="gauge-track" strokeDasharray={`${arc} ${c}`}/>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" className="gauge-value" strokeDasharray={`${arc} ${c}`} strokeDashoffset={arc * (1 - t)}/>
    </svg>
    <figcaption className="absolute grid place-items-center text-center" style={{ width: size, height: size }}>
      <span className="grid leading-tight">
        <span className="font-normal tracking-tight tabular-nums" style={{ fontSize: size * .2 }}>{figure}{unit && <span className="ml-0.5 text-[.55em] text-muted-foreground">{unit}</span>}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </span>
    </figcaption>
    {note != null && <span className="grid self-end pb-2 text-center leading-tight"><span className="text-sm font-medium tabular-nums">{note}</span>{noteLabel && <span className="text-[11px] text-muted-foreground">{noteLabel}</span>}</span>}
  </figure>;
}
