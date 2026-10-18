// Parcel card (right popout): the estimate first, as a figure with its interval,
// then what it means in tonnes, a few plain facts and the vegetation curve.
import { ChevronDown, ChevronUp, Crosshair, MapPin, PencilRuler, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Atlas, Parcel } from './types';
import { dateKey, fmt, MONTH_NAMES } from './lib';
import { interval } from './model';
import { LineChart } from './Charts';
import ShellButton from './shell/ShellButton';

const SET_LABEL = { training: 'Con rendimiento registrado', prediction: 'Parcela reservada · predicción', custom: 'Terreno propio' } as const;

export default function ParcelPanel({ parcel, atlas, year, month, ranking, onClose, onLocate, onEdit, onNext, onSimilar }: { parcel: Parcel; atlas: Atlas; year: number; month: number; ranking: { percentile: number; of: number } | null; onClose: () => void; onLocate: () => void; onEdit: () => void; onNext: (direction: number) => void; onSimilar: () => void }) {
  const p = parcel.properties, details = atlas.details[p.id];
  const values = Array.from({ length: 12 }, (_, m) => details?.ndvi['Sentinel-2']?.[dateKey(year, m)]?.mean ?? null);
  const estimate = p.predictedYield, range = estimate == null ? null : interval(atlas.predictions, estimate);
  const error = estimate != null && p.observedYield != null ? estimate - p.observedYield : null;
  const [lo, hi] = [1.5, 6.5], pos = (v: number) => `${Math.max(0, Math.min(1, (v - lo) / (hi - lo))) * 100}%`;
  const facts: [string, string][] = [
    ['Superficie del polígono', `${fmt(p.area)} ha`],
    [`Vegetación · ${MONTH_NAMES[month].toLowerCase()}`, values[month] == null ? 'Sin observación' : `NDVI ${fmt(values[month])}`],
  ];
  return <aside aria-label="Ficha de parcela" className="flex h-full min-h-0 flex-col">
    <header className="flex items-center gap-1 pt-3 pr-3 pl-5">
      <h2 className="min-w-0 flex-1 truncate text-base font-medium">{p.name || p.id}</h2>
      <ShellButton label="Parcela anterior" side="bottom" onClick={() => onNext(-1)}><ChevronUp/></ShellButton>
      <ShellButton label="Siguiente parcela" side="bottom" onClick={() => onNext(1)}><ChevronDown/></ShellButton>
      <ShellButton label="Cerrar ficha de parcela" side="bottom" onClick={onClose}><X/></ShellButton>
    </header>
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
      <p className="flex items-center gap-1 text-[13px] text-muted-foreground"><MapPin className="size-3.5"/>{p.municipality} · {p.state}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{SET_LABEL[p.group]}{p.edited ? ' · límites ajustados' : ''}</p>

      <section aria-label="Rendimiento estimado" className="tile mt-3 grid gap-3 p-4">
        <div className="flex items-end justify-between gap-2">
          <div className="grid leading-tight">
            <span className="text-xs text-muted-foreground">{p.group === 'training' ? 'Estimado (validación cruzada)' : 'Rendimiento estimado'}</span>
            <span className="text-4xl font-normal tracking-tight text-primary tabular-nums">{fmt(estimate)}<span className="ml-1 text-base text-muted-foreground">t/ha</span></span>
          </div>
          {estimate != null && <div className="grid text-right leading-tight"><span className="text-xs text-muted-foreground">Producción</span><span className="text-lg tabular-nums">{fmt(estimate * p.area, 1)} t</span></div>}
        </div>
        {range && <div className="grid gap-1.5" aria-label={`Intervalo 80 %: ${fmt(range[0])} a ${fmt(range[1])} t/ha`}>
          <div className="relative h-2 rounded-full bg-primary-container">
            <span className="absolute inset-y-0 rounded-full bg-primary/35" style={{ left: pos(range[0]), right: `calc(100% - ${pos(range[1])})` }}/>
            <span className="absolute top-1/2 size-3.5 -translate-1/2 rounded-full border-2 border-frame bg-primary" style={{ left: pos(estimate!) }}/>
            {p.observedYield != null && <span className="absolute top-1/2 h-4 w-1 -translate-1/2 rounded-full bg-foreground" style={{ left: pos(p.observedYield) }} title={`Registrado ${fmt(p.observedYield)} t/ha`}/>}
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums"><span>{fmt(range[0])}</span><span>Intervalo 80 %</span><span>{fmt(range[1])} t/ha</span></div>
        </div>}
        {p.observedYield != null && <p className="flex items-center justify-between rounded-xl bg-frame/70 px-3 py-2 text-[13px]"><span><span className="mr-1.5 inline-block h-3 w-1 rounded-full bg-foreground align-middle"/>Registrado <b className="font-medium tabular-nums">{fmt(p.observedYield)} t/ha</b></span>
          {error != null && <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium tabular-nums', Math.abs(error) <= atlas.predictions.metrics.mae_t_ha ? 'bg-primary-container text-on-primary-container' : 'bg-chart-5/25')}>{error > 0 ? '+' : ''}{fmt(error)} t/ha</span>}</p>}
        {ranking && <p className="flex items-center justify-between gap-2 text-[12.5px] text-muted-foreground"><span>Supera al <b className="font-medium text-foreground tabular-nums">{ranking.percentile} %</b> de las {ranking.of} parcelas</span><button type="button" onClick={onSimilar} className="rounded-full px-2 py-0.5 text-primary hover:bg-frame/70">Ver parecidas</button></p>}
        {estimate == null && <p className="text-[13px] text-pretty text-muted-foreground">El modelo necesita la serie semanal de imágenes, el clima y el historial AlphaEarth de la parcela; un terreno dibujado aún no los tiene.</p>}
      </section>

      <dl className="mt-3 grid gap-px overflow-hidden rounded-2xl">{facts.map(([label, value]) => <div key={label} className="flex items-baseline justify-between gap-3 bg-tile/60 px-3.5 py-2.5">
        <dt className="text-[13px] text-muted-foreground">{label}</dt><dd className="text-[13px] font-medium tabular-nums">{value}</dd>
      </div>)}</dl>

      <div className="mt-3">
        <div className="mb-1 flex items-baseline justify-between text-[13px]"><span className="font-medium">Vegetación · NDVI</span><span className="text-xs text-muted-foreground">Sentinel-2 · {year}</span></div>
        <LineChart values={values} compact/>
      </div>
    </div>
    <footer className="grid gap-2 px-4 pb-4">
      <div className="flex justify-center gap-1">
        <Button variant="ghost" size="sm" className="rounded-full" onClick={onLocate}><Crosshair/>Acercar</Button>
        <Button variant="ghost" size="sm" className="rounded-full" onClick={onEdit}><PencilRuler/>Corregir límites</Button>
      </div>
    </footer>
  </aside>;
}
