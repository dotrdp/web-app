// Capas y simbología: the layer stack. Every layer is a row: drag it by its handle (≡) to draw it
// above or below the others, switch it on or off, and while it is on set its transparency and, for
// the indices, its threshold. Hovering a layer's name explains what it shows. No layer on is fine:
// the map then shows the parcels alone, and hovering a parcel still shows its data.
import { AnimatePresence, motion, Reorder, useDragControls } from 'motion/react';
import { Menu, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { LAYERS, updateLayer } from './layers';
import type { MapLayer } from './layers';
import { fmt } from './lib';

const spring = { type: 'spring', bounce: .2, visualDuration: .32 } as const;

/** On/off whose thumb springs across (and stretches while pressed). */
export function LayerSwitch({ on, label, onChange }: { on: boolean; label: string; onChange: (on: boolean) => void }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
    className={cn('flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring', on ? 'justify-end bg-primary' : 'justify-start bg-tile-strong')}>
    <motion.span layout transition={{ type: 'spring', stiffness: 600, damping: 32 }} whileTap={{ width: 24 }} className="block h-5 w-5 rounded-full bg-frame shadow-sm"/>
  </button>;
}

function SliderField({ label, value, children, action }: { label: string; value: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <div className="grid gap-2">
    <div className="flex items-center gap-2 text-xs"><span className="flex-1 opacity-80">{label}</span>{action}<span className="font-medium tabular-nums">{value}</span></div>
    {children}
  </div>;
}

function LayerRow({ layer, onChange }: { layer: MapLayer; onChange: (next: Partial<MapLayer>) => void }) {
  const info = LAYERS[layer.id], drag = useDragControls(), threshold = info.threshold;
  const transparency = Math.round((1 - layer.opacity) * 100);
  return <Reorder.Item value={layer} as="li" dragListener={false} dragControls={drag} aria-label={info.name}
    whileDrag={{ scale: 1.02, boxShadow: '0 14px 30px -14px rgb(0 0 0 / .4)' }} transition={spring}
    className={cn('relative list-none rounded-2xl transition-colors duration-300', layer.on ? 'bg-primary-container text-on-primary-container' : 'bg-tile')}>
    <div className="flex items-center gap-1.5 py-2 pr-3 pl-1.5">
      <button type="button" aria-label={`Mover ${info.name}`} title="Arrastra para cambiar el orden" onPointerDown={e => drag.start(e)}
        className="grid size-8 shrink-0 cursor-grab touch-none place-items-center rounded-full opacity-60 hover:bg-frame/50 hover:opacity-100 active:cursor-grabbing"><Menu className="size-4"/></button>
      <Tooltip>
        <TooltipTrigger asChild>
          <div tabIndex={0} className="grid min-w-0 flex-1 cursor-help gap-0.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="truncate text-sm font-medium">{info.name}</span>
            <span className="truncate text-xs opacity-70">{info.subtitle}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={64} className="max-w-64 text-pretty">{info.description}</TooltipContent>
      </Tooltip>
      <LayerSwitch on={layer.on} label={info.name} onChange={on => onChange({ on })}/>
    </div>
    <AnimatePresence initial={false}>
      {layer.on && <motion.div key="controls" className="overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={spring}>
        <div className="grid gap-3.5 px-4 pt-1 pb-3.5">
          <SliderField label="Transparencia" value={`${transparency} %`}>
            <Slider aria-label={`Transparencia de ${info.name}`} min={0} max={90} step={5} value={[transparency]} onValueChange={([v]) => onChange({ opacity: 1 - v / 100 })}/>
          </SliderField>
          {threshold && <SliderField label={threshold.label} value={fmt(layer.threshold ?? threshold.default, 2)}
            action={layer.threshold != null && layer.threshold !== threshold.default && <button type="button" onClick={() => onChange({ threshold: threshold.default })} title={`Volver a ${fmt(threshold.default, 2)}`} aria-label={`Restablecer ${threshold.label}`} className="grid size-5 place-items-center rounded-full opacity-70 hover:bg-frame/50 hover:opacity-100"><RotateCcw className="size-3"/></button>}>
            <Slider aria-label={threshold.label} min={threshold.min} max={threshold.max} step={threshold.step} value={[layer.threshold ?? threshold.default]} onValueChange={([v]) => onChange({ threshold: Math.round(v * 100) / 100 })}/>
            <p className="text-[11px] leading-snug text-pretty opacity-70">{threshold.hint}</p>
          </SliderField>}
        </div>
      </motion.div>}
    </AnimatePresence>
  </Reorder.Item>;
}

export default function LayersPanel({ layers, onChange }: { layers: MapLayer[]; onChange: (layers: MapLayer[]) => void }) {
  const active = layers.filter(l => l.on).length;
  return <div className="grid gap-3">
    <div className="flex items-baseline gap-2 px-1 text-xs text-muted-foreground">
      <p className="flex-1 text-pretty">{active ? `${active} ${active === 1 ? 'capa activa' : 'capas activas'}` : 'Ninguna capa activa'} · arrastra <Menu className="inline size-3 align-[-2px]"/> para ordenar; la de arriba se dibuja encima.</p>
      {active > 0 && <button type="button" onClick={() => onChange(layers.map(l => ({ ...l, on: false })))} className="shrink-0 underline-offset-2 hover:text-foreground hover:underline">Apagar todas</button>}
    </div>
    <Reorder.Group axis="y" as="ol" values={layers} onReorder={onChange} className="grid gap-1.5" aria-label="Capas del mapa">
      {layers.map(l => <LayerRow key={l.id} layer={l} onChange={next => onChange(updateLayer(layers, l.id, next))}/>)}
    </Reorder.Group>
  </div>;
}
