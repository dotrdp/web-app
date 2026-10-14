// ArcGIS-style time slider: play, a month track with tick dots, and the current
// date as the picker. One row, one source of truth for the period.
import { ChevronDown, Pause, Play } from 'lucide-react';
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarItem } from './Toolbar';
import { MONTH_NAMES, MONTHS } from './lib';
import type { MapMode } from './types';

const YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

export default function TimeSlider({ mode, year, month, keyDate, playing, onPlay, onMonth, onYear, onDate }: { mode: MapMode; year: number; month: number; keyDate: string; playing: boolean; onPlay: (playing: boolean) => void; onMonth: (month: number) => void; onYear: (year: number) => void; onDate: (year: number, month: number) => void }) {
  if (mode === 'alphaearth') return <div className="time-slider annual">
    <Toolbar className="time-slider-toolbar" aria-label="Evolución temporal">
      <ToolbarGroup aria-label="Año AlphaEarth"><label className="time-date" title="AlphaEarth · embeddings anuales"><span className="dock-year">Anual {year}</span><ChevronDown size={14}/><select className="annual-picker" aria-label="Año AlphaEarth" value={year} onChange={e => onYear(Number(e.target.value))}>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select></label></ToolbarGroup>
    </Toolbar>
  </div>;
  const progress = Math.max(0, Math.min(1, (month - 3) / 6));
  return <div className="time-slider">
    <Toolbar className="time-slider-toolbar" aria-label="Evolución temporal">
      <ToolbarGroup aria-label="Reproducción"><ToolbarButton className="time-play" label={playing ? 'Pausar meses' : 'Reproducir meses'} onClick={() => onPlay(!playing)}>{playing ? <Pause/> : <Play/>}</ToolbarButton></ToolbarGroup>
      <ToolbarGroup className="time-track month-dock-tools" aria-label="Meses de abril a octubre" style={{ '--progress': progress } as React.CSSProperties}>
        {MONTHS.slice(3, 10).map((label, i) => <ToolbarItem key={label} className="time-tick" isSelected={month === i + 3} label={`${MONTH_NAMES[i + 3]} ${year}`} tooltip={false} onChange={() => onMonth(i + 3)}><i className="time-dot" aria-hidden="true"/><span>{label}</span></ToolbarItem>)}
      </ToolbarGroup>
      <ToolbarGroup aria-label="Elegir mes"><label className="time-date month-picker" title="Abril–octubre · ciclo de cebada · elegir otro mes"><span className="dock-year" aria-live="polite">{MONTH_NAMES[month]} {year}</span><ChevronDown size={14}/><input aria-label="Mes de observación" type="month" min="2022-01" max="2025-12" value={keyDate} onChange={e => { if (e.target.value) { const [y, m] = e.target.value.split('-').map(Number); onDate(y, m - 1); } }}/></label></ToolbarGroup>
    </Toolbar>
  </div>;
}
