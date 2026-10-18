// Resumen tiles after Caelestia's dashboard: weather / system / calendar / media, read
// as climate, atlas totals, the map's month and the selected parcel. The Agente de IA
// Milli opens on them.
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, CloudRain, CloudSun, Pause, Play, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoMark } from '../Logo';
import { dateKey, fmt, MONTHS, MONTH_NAMES } from '../lib';
import type { Atlas, Parcel } from '../types';

/** Parcel outline as a disc, standing in for album art. */
export function ParcelArt({ parcel, size = 112, spinning = false }: { parcel: Parcel | null; size?: number; spinning?: boolean }) {
  const path = useMemo(() => {
    if (!parcel) return '';
    const ring = parcel.geometry.coordinates[0], [w, s, e, n] = parcel.properties.bounds;
    const k = 0.62 / Math.max(e - w, (n - s) * 1.07), cx = (w + e) / 2, cy = (s + n) / 2;
    return ring.map(([x, y], i) => `${i ? 'L' : 'M'}${(50 + (x - cx) * k * 100).toFixed(2)},${(50 - (y - cy) * k * 107).toFixed(2)}`).join('') + 'Z';
  }, [parcel]);
  return <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className={cn('shrink-0', spinning && 'motion-safe:animate-[spin_14s_linear_infinite]')}>
    <circle cx="50" cy="50" r="49" fill="var(--primary-container)"/>
    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeOpacity=".18" strokeWidth="1"/>
    <circle cx="50" cy="50" r="31" fill="none" stroke="var(--primary)" strokeOpacity=".12" strokeWidth="1"/>
    {path ? <path d={path} fill="var(--primary)" fillOpacity=".85" stroke="var(--frame)" strokeWidth="1.2" strokeLinejoin="round"/> : <circle cx="50" cy="50" r="6" fill="var(--primary)"/>}
  </svg>;
}

function Tile({ className, children, label }: { className?: string; children: React.ReactNode; label?: string }) {
  return <section aria-label={label} className={cn('tile min-w-0 p-3', className)}>{children}</section>;
}

type SummaryProps = { atlas: Atlas; parcels: Parcel[]; selected: Parcel | null; year: number; month: number; touring: boolean; onMonth: (month: number) => void; onParcel: (direction: number) => void; onTour: (on: boolean) => void };

/** Resumen: weather, atlas totals, the selected parcel, month and production by state. */
export function Summary({ atlas, parcels, selected, year, month, touring, onMonth, onParcel, onTour }: SummaryProps) {
  const key = dateKey(year, month);
  const summary = useMemo(() => {
    const climate = parcels.map(p => atlas.details[p.properties.id]?.climate[key]).filter(Boolean);
    const avg = (xs: (number | null | undefined)[]) => { const v = xs.filter((x): x is number => x != null); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
    const states = ['Hidalgo', 'Puebla', 'Tlaxcala'].map(state => {
      const ps = parcels.filter(p => p.properties.state === state);
      return { state, count: ps.length, production: ps.reduce((t, p) => t + (p.properties.predictedYield ?? 0) * p.properties.area, 0) };
    });
    return {
      tmax: avg(climate.map(c => c!.tmax)), tmin: avg(climate.map(c => c!.tmin)), rain: avg(climate.map(c => c!.precipitation)),
      area: parcels.reduce((t, p) => t + p.properties.area, 0), states,
      production: states.reduce((t, s) => t + s.production, 0),
    };
  }, [atlas, parcels, key]);
  const maxState = Math.max(1, ...summary.states.map(s => s.production));
  const WeatherIcon = summary.rain != null && summary.rain > 60 ? CloudRain : summary.rain != null && summary.rain > 15 ? CloudSun : Sun;
  const p = selected?.properties;

  return <div className="grid grid-cols-[1fr_1.35fr_0.95fr] grid-rows-[auto_auto] gap-2.5 max-sm:grid-cols-2">
    <Tile label="Clima del mes" className="flex items-center gap-3">
      <WeatherIcon className="size-10 shrink-0 text-primary" strokeWidth={1.5}/>
      <div className="grid leading-tight"><span className="text-2xl font-normal tabular-nums text-primary">{fmt(summary.tmax, 0)}°C</span><span className="text-xs text-muted-foreground">{fmt(summary.rain, 0)} mm · mín {fmt(summary.tmin, 0)}°</span></div>
    </Tile>
    <Tile label="Atlas" className="flex items-center gap-3">
      <LogoMark size={44} className="shrink-0"/>
      <dl className="grid gap-0.5 text-[13px] leading-tight">
        <div className="flex gap-1.5"><dt className="text-muted-foreground">Parcelas</dt><dd className="font-medium tabular-nums">{parcels.length} · 3 estados</dd></div>
        <div className="flex gap-1.5"><dt className="text-muted-foreground">Superficie</dt><dd className="font-medium tabular-nums">{fmt(summary.area, 0)} ha</dd></div>
        <div className="flex gap-1.5"><dt className="text-muted-foreground">Producción est.</dt><dd className="font-medium tabular-nums">{fmt(summary.production, 0)} t</dd></div>
      </dl>
    </Tile>
    <Tile label="Parcela seleccionada" className="row-span-2 flex flex-col items-center gap-2 text-center max-sm:col-span-2 max-sm:row-span-1">
      <ParcelArt parcel={selected} spinning={touring}/>
      <div className="grid w-full gap-0.5 leading-tight">
        <span className="truncate text-sm font-medium">{p ? p.name || p.id : 'Ninguna parcela'}</span>
        <span className="truncate text-xs text-muted-foreground">{p ? `${p.municipality} · ${p.state}` : 'Usa ▶ para recorrerlas'}</span>
        <span className="text-sm text-primary tabular-nums">{p?.predictedYield != null ? `${fmt(p.predictedYield)} t/ha` : '—'}</span>
      </div>
      <div className="flex items-center gap-1" role="group" aria-label="Recorrido de parcelas">
        <button type="button" aria-label="Parcela anterior" onClick={() => onParcel(-1)} className="grid size-8 place-items-center rounded-full hover:bg-tile-strong [&_svg]:size-4"><ChevronLeft/></button>
        <button type="button" aria-label={touring ? 'Pausar recorrido' : 'Recorrer parcelas'} aria-pressed={touring} onClick={() => onTour(!touring)} className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground [&_svg]:size-4 [&_svg]:fill-current">{touring ? <Pause/> : <Play/>}</button>
        <button type="button" aria-label="Siguiente parcela" onClick={() => onParcel(1)} className="grid size-8 place-items-center rounded-full hover:bg-tile-strong [&_svg]:size-4"><ChevronRight/></button>
      </div>
    </Tile>
    <Tile label="Mes del mapa" className="flex items-center gap-3">
      <div className="grid justify-items-center leading-none text-primary"><span className="text-3xl font-normal tabular-nums">{String(month + 1).padStart(2, '0')}</span><span className="my-1 flex gap-1" aria-hidden="true">{[0, 1, 2].map(i => <span key={i} className="size-1 rounded-full bg-primary"/>)}</span><span className="text-3xl font-normal tabular-nums">{String(year).slice(2)}</span></div>
      <div className="grid gap-1 leading-tight"><span className="text-sm font-medium">{MONTH_NAMES[month]}</span><span className="text-xs text-muted-foreground">{year} · {month >= 3 && month <= 9 ? 'dentro del ciclo' : 'fuera del ciclo'}</span></div>
    </Tile>
    <Tile label="Calendario y producción estimada por estado" className="grid grid-cols-[1fr_auto] items-end gap-3">
      <div className="grid grid-cols-4 gap-1 text-center text-[11px]" role="grid" aria-label={`Meses de ${year}`}>
        {MONTHS.map((label, i) => <button key={label} type="button" aria-pressed={month === i} onClick={() => onMonth(i)}
          className={cn('rounded-full py-1 tabular-nums text-muted-foreground hover:bg-tile-strong aria-pressed:bg-primary aria-pressed:text-primary-foreground', i >= 3 && i <= 9 && 'text-foreground')}>{label}</button>)}
      </div>
      <div className="flex h-full items-end gap-2.5 pl-1" aria-label="Producción estimada por estado">
        {summary.states.map(s => <div key={s.state} className="grid justify-items-center gap-1" title={`${s.state}: ${fmt(s.production, 0)} t estimadas · ${s.count} parcelas`}>
          <span className="relative h-20 w-2 overflow-hidden rounded-full bg-primary-container"><span className="absolute inset-x-0 bottom-0 rounded-full bg-primary transition-[height] duration-700" style={{ height: `${Math.max(6, s.production / maxState * 100)}%` }}/></span>
          <span className="text-[10px] font-medium text-muted-foreground">{s.state[0]}</span>
        </div>)}
      </div>
    </Tile>
  </div>;
}
