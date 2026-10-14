// Parcel details (shadcn Card, after the dashboard-01 data-table sheet): header
// with previous / next / close, headline figure, key facts, NDVI curve, actions.
import { ChartNoAxesCombined, ChevronDown, ChevronUp, Crosshair, MapPin, PencilRuler, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Atlas, Parcel } from './types';
import { dateKey, fmt, MONTH_NAMES } from './lib';
import { LineChart } from './Charts';
import { floating, ToolButton } from './MapToolbar';

const GROUPS = { training: ['Entrenamiento', 'secondary'], prediction: ['Predicción', 'outline'], custom: ['Mi parcela', 'default'] } as const;

export default function ParcelPanel({ parcel, atlas, year, month, sensor, onClose, onLocate, onEdit, onAnalyze, onTechnical, onNext }: { parcel: Parcel; atlas: Atlas; year: number; month: number; sensor: string; onClose: () => void; onLocate: () => void; onEdit: () => void; onAnalyze: () => void; onTechnical: () => void; onNext: (direction: number) => void }) {
  const p = parcel.properties, details = atlas.details[p.id], weather = details?.climate[dateKey(year, month)];
  const values = Array.from({ length: 12 }, (_, m) => sensor === 'Landsat C2' ? atlas.landsat[dateKey(year, m)]?.parcels[p.id]?.mean ?? null : details?.ndvi['Sentinel-2']?.[dateKey(year, m)]?.mean ?? null);
  const observations = details?.ndvi['Sentinel-2']?.[dateKey(year, month)]?.observations;
  const [groupLabel, groupVariant] = GROUPS[p.group] ?? GROUPS.prediction;
  const facts: [string, string, string?][] = [
    ['Superficie', `${fmt(p.area)} ha`], ['Cultivo', 'Cebada'],
    [`NDVI · ${MONTH_NAMES[month].toLowerCase()} ${year}`, fmt(values[month]), sensor === 'Landsat C2' ? 'Landsat C2' : observations ? `Sentinel-2 · ${observations} observaciones` : 'Sentinel-2 · sin observación'],
    ['Precipitación del mes', `${fmt(weather?.precipitation, 0)} mm`, 'CHIRPS'],
    ['Elevación', p.elevation == null ? '—' : `${fmt(p.elevation, 0)} m`], ['Pendiente', p.slope == null ? '—' : `${fmt(p.slope, 1)}°`],
  ];
  return <aside aria-label="Ficha de parcela" className={cn(floating, 'side-panel floating-parcel flex min-h-0 flex-col overflow-hidden')}>
    <header className="flex items-center gap-1 border-b py-2 pr-2 pl-4">
      <h2 className="flex-1 truncate text-base font-semibold">{p.name || p.id}</h2>
      <ToolButton label="Parcela anterior" side="bottom" onClick={() => onNext(-1)}><ChevronUp/></ToolButton>
      <ToolButton label="Siguiente parcela" side="bottom" onClick={() => onNext(1)}><ChevronDown/></ToolButton>
      <ToolButton label="Cerrar ficha de parcela" side="bottom" onClick={onClose}><X/></ToolButton>
    </header>
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      <div className="flex flex-wrap items-center gap-2"><span className="mr-auto flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5"/>{p.municipality} · {p.state}</span><Badge variant={groupVariant}>{groupLabel}</Badge>{p.edited && <Badge variant="outline" className="border-amber-300 text-amber-700 dark:text-amber-400">Editada</Badge>}</div>
      <div className="recorded-yield mt-4 rounded-lg border bg-muted/40 p-4">
        <p className="text-sm text-muted-foreground">Rendimiento registrado · 2025</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">{fmt(p.observedYield)}<span className="ml-1.5 text-base font-normal text-muted-foreground">t/ha</span></p>
        {p.observedYield == null && <p className="mt-1 text-sm text-muted-foreground">Sin rendimiento registrado para esta parcela.</p>}
      </div>
      {p.edited && <p className="edited-note mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">Límites ajustados · observaciones del límite original.</p>}
      <dl className="mt-4 divide-y">{facts.map(([label, value, hint]) => <div key={label} className="flex items-baseline justify-between gap-3 py-2.5">
        <dt className="grid text-sm text-muted-foreground">{label}{hint && <span className="text-xs text-muted-foreground/70">{hint}</span>}</dt>
        <dd className="text-sm font-medium tabular-nums">{value}</dd>
      </div>)}</dl>
      <div className="mt-4">
        <div className="mb-1 flex items-baseline justify-between text-sm"><span className="font-medium">Vegetación · NDVI</span><span className="text-xs text-muted-foreground">{sensor} · {year}</span></div>
        <LineChart values={values} compact/>
      </div>
    </div>
    <footer className="grid gap-2 border-t p-3">
      <Button onClick={onAnalyze} className="w-full" size="lg">Analizar parcela</Button>
      <div className="flex flex-wrap gap-1">
        <Button variant="ghost" size="sm" onClick={onTechnical}><ChartNoAxesCombined/>Ver evolución</Button>
        <Button variant="ghost" size="sm" onClick={onEdit}><PencilRuler/>Corregir límites</Button>
        <Button variant="ghost" size="sm" onClick={onLocate}><Crosshair/>Acercar</Button>
      </div>
    </footer>
  </aside>;
}
