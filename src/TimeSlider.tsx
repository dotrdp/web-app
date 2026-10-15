// Time slider (shadcn Button + month track): play, months April–October and the
// date as a picker. AlphaEarth shows a year selector instead.
import { CalendarDays, ChevronDown, Pause, Play } from 'lucide-react';
import { Toolbar } from 'react-aria-components/Toolbar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MONTH_NAMES, MONTHS } from './lib';
import type { MapMode } from './types';

const YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

export default function TimeSlider({ mode, year, month, keyDate, playing, onPlay, onMonth, onYear, onDate }: { mode: MapMode; year: number; month: number; keyDate: string; playing: boolean; onPlay: (playing: boolean) => void; onMonth: (month: number) => void; onYear: (year: number) => void; onDate: (year: number, month: number) => void }) {
  if (mode === 'alphaearth') return <div className="time-slider p-1">
    <Toolbar aria-label="Evolución temporal" className="flex items-center">
      <label className="relative flex h-9 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm hover:bg-tile focus-within:ring-3 focus-within:ring-ring/50">
        <CalendarDays className="size-4 text-muted-foreground"/><span className="dock-year font-medium">Anual {year}</span><ChevronDown className="size-4 text-muted-foreground"/>
        <select className="absolute inset-0 cursor-pointer opacity-0" aria-label="Año AlphaEarth" value={year} onChange={e => onYear(Number(e.target.value))}>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select>
      </label>
    </Toolbar>
  </div>;
  const progress = Math.max(0, Math.min(1, (month - 3) / 6));
  return <div className="time-slider px-2 py-1.5">
    <Toolbar aria-label="Evolución temporal" className="flex items-center gap-2">
      <Button type="button" size="icon" className="size-10 rounded-full" aria-label={playing ? 'Pausar meses' : 'Reproducir meses'} onClick={() => onPlay(!playing)}>{playing ? <Pause className="fill-current"/> : <Play className="fill-current"/>}</Button>
      <div role="group" aria-label="Meses de abril a octubre" className="relative flex min-w-0 flex-1 items-start justify-between px-1 [--rail-inset:1.25rem] @max-[30rem]/time:[--rail-inset:0.75rem]">
        <span aria-hidden="true" className="absolute inset-x-5 top-[13px] @max-[30rem]/time:inset-x-3 h-0.5 rounded-full bg-border"/>
        <span aria-hidden="true" className="absolute left-5 top-[13px] @max-[30rem]/time:left-3 h-0.5 rounded-full bg-primary transition-[width] duration-300" style={{ width: `calc((100% - 2 * var(--rail-inset)) * ${progress})` }}/>
        {MONTHS.slice(3, 10).map((label, i) => { const active = month === i + 3; return <button key={label} type="button" aria-label={`${MONTH_NAMES[i + 3]} ${year}`} aria-pressed={active} onClick={() => onMonth(i + 3)}
          className="group relative z-10 grid w-10 justify-items-center gap-1.5 rounded-md pt-2 pb-1 @max-[30rem]/time:w-6 outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <span className="grid size-3.5 place-items-center"><span className={cn('size-2.5 rounded-full border-2 border-muted-foreground/40 bg-background transition-all group-hover:border-foreground', active && 'size-3.5 border-primary bg-primary ring-4 ring-primary/15')}/></span>
          <span className={cn('text-[11px] leading-none text-muted-foreground', active && 'font-semibold text-foreground')} aria-hidden="true"><span className="@max-[30rem]/time:hidden">{label}</span><span className="hidden @max-[30rem]/time:inline">{label[0]}</span></span>
        </button>; })}
      </div>
      <label className="relative flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full pl-3 pr-2 text-sm whitespace-nowrap @max-[30rem]/time:pl-2 hover:bg-tile focus-within:ring-3 focus-within:ring-ring/50" title="Abril–octubre · ciclo de cebada · elegir otro mes">
        <span className="dock-year font-semibold" aria-live="polite">{MONTH_NAMES[month]} {year}</span><ChevronDown className="size-4 text-muted-foreground"/>
        <input aria-label="Mes de observación" type="month" min="2022-01" max="2025-12" value={keyDate} className="absolute inset-0 cursor-pointer opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full" onChange={e => { if (e.target.value) { const [y, m] = e.target.value.split('-').map(Number); onDate(y, m - 1); } }}/>
      </label>
    </Toolbar>
  </div>;
}
