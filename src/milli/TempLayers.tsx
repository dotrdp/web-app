// Milli's temporary map layers in the interface: a chip on the map for each (hourglass, title,
// legend, remove), and their rows at the top of Capas. Removing one only removes it from the map;
// the figure stays in the chat.
import { AnimatePresence, motion } from 'motion/react';
import { Hourglass, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tempLayers, useTempLayers } from './temp-layers';
import type { TempLayer } from './temp-layers';

const num = (v: number) => Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2);

export function TempLegend({ layer, compact = false }: { layer: TempLayer; compact?: boolean }) {
  const { items, scale } = layer.legend ?? {};
  if (scale) return <div className="grid gap-0.5">
    <span className="h-2 w-full min-w-24 rounded-full" style={{ background: `linear-gradient(to right, ${scale.colors.join(', ')})` }}/>
    <span className="flex justify-between gap-2 text-[10px] text-muted-foreground tabular-nums"><span>{num(scale.min)}</span>{!compact && scale.title && <span className="truncate">{scale.title}</span>}<span>{num(scale.max)}</span></span>
  </div>;
  if (!items?.length) return null;
  return <ul className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-[10.5px] text-muted-foreground">
    {items.slice(0, compact ? 5 : 12).map(([label, color]) => <li key={label} className="flex items-center gap-1"><span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: color }}/>{label}</li>)}
    {compact && items.length > 5 && <li>+{items.length - 5}</li>}
  </ul>;
}

/** Chips over the map, bottom left of the free area. */
export function TempLayerChips({ className }: { className?: string }) {
  const list = useTempLayers();
  return <div className={cn('pointer-events-none flex flex-col items-start gap-1.5', className)} aria-live="polite">
    <AnimatePresence initial={false}>
      {list.map(l => <motion.div key={l.id} layout initial={{ opacity: 0, y: 8, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .96 }} transition={{ type: 'spring', bounce: .2, visualDuration: .3 }}
        role="group" aria-label={`Capa temporal de Milli: ${l.title}`} className="pointer-events-auto grid max-w-[min(22rem,calc(100vw-2rem))] gap-1 rounded-2xl bg-frame/95 py-1.5 pr-1.5 pl-2.5 shadow-md ring-1 ring-border/60 backdrop-blur">
        <div className="flex items-center gap-1.5">
          <Hourglass className="size-3.5 shrink-0 text-primary" aria-hidden="true"/>
          <span className="min-w-0 flex-1 truncate text-[12px] font-medium"><span className="text-muted-foreground">Temporal · </span>{l.title}</span>
          <button type="button" onClick={() => tempLayers.remove(l.id)} aria-label={`Quitar la capa temporal «${l.title}»`} title="Quitar del mapa" className="grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-tile hover:text-foreground"><X className="size-3.5"/></button>
        </div>
        <div className="pr-2"><TempLegend layer={l} compact/></div>
      </motion.div>)}
      {list.length > 1 && <motion.button key="clear" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} type="button" onClick={() => tempLayers.clear()}
        className="pointer-events-auto rounded-full bg-frame/95 px-2.5 py-1 text-[11px] text-muted-foreground shadow-sm ring-1 ring-border/60 hover:text-foreground">Quitar todas las capas temporales</motion.button>}
    </AnimatePresence>
  </div>;
}

/** Rows at the top of Capas. */
export function TempLayerRows() {
  const list = useTempLayers();
  if (!list.length) return null;
  return <section className="grid gap-1.5" aria-label="Capas temporales de Milli">
    <div className="flex items-baseline gap-2 px-1 text-xs text-muted-foreground"><span className="flex-1">Capas temporales de Milli · se quitan cuando quieras</span>
      {list.length > 1 && <button type="button" onClick={() => tempLayers.clear()} className="shrink-0 underline-offset-2 hover:text-foreground hover:underline">Quitar todas</button>}</div>
    <ol className="grid gap-1.5">
      {list.map(l => <li key={l.id} className="grid gap-1.5 rounded-2xl bg-primary-container/60 py-2 pr-2 pl-3 text-on-primary-container">
        <div className="flex items-center gap-2">
          <Hourglass className="size-4 shrink-0" aria-hidden="true"/>
          <div className="grid min-w-0 flex-1"><span className="truncate text-sm font-medium">{l.title}</span><span className="text-[11px] opacity-75">Temporal · de una figura de Milli</span></div>
          <button type="button" onClick={() => tempLayers.remove(l.id)} aria-label={`Quitar la capa temporal «${l.title}»`} className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-frame/50"><X className="size-4"/></button>
        </div>
        <TempLegend layer={l}/>
      </li>)}
    </ol>
  </section>;
}
