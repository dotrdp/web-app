// Floating icon toolbars on the map (shadcn Button + Tooltip inside a React Aria
// toolbar for arrow-key navigation): panels on the left, tools on the right.
import type { ReactNode } from 'react';
import { Toolbar } from 'react-aria-components/Toolbar';
import { Bookmark, Filter, Layers3, Map as MapIcon, Rows3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type MapPanel = 'layers' | 'basemap' | 'parcels' | 'bookmarks' | 'filters';
export const PANELS: { key: MapPanel; label: string; short?: string; icon: LucideIcon; separated?: boolean }[] = [
  { key: 'layers', label: 'Capas', icon: Layers3 },
  { key: 'basemap', label: 'Mapa base', short: 'Base', icon: MapIcon },
  { key: 'parcels', label: 'Parcelas', icon: Rows3 },
  { key: 'bookmarks', label: 'Marcadores', icon: Bookmark },
  { key: 'filters', label: 'Filtros', icon: Filter, separated: true },
];

/** Floating surface shared by every map widget. */
export const floating = 'rounded-xl border bg-background shadow-md';

export function ToolButton({ label, side = 'right', pressed, expanded, busy, disabled, className, children, onClick }: { label: string; side?: 'right' | 'left' | 'top' | 'bottom'; pressed?: boolean; expanded?: boolean; busy?: boolean; disabled?: boolean; className?: string; children: ReactNode; onClick: () => void }) {
  return <Tooltip>
    <TooltipTrigger asChild>
      <Button type="button" variant="ghost" size="icon" aria-label={label} aria-pressed={pressed} aria-expanded={expanded} aria-busy={busy || undefined} disabled={disabled} onClick={onClick}
        className={cn('relative size-9 pointer-coarse:size-11 text-muted-foreground hover:text-foreground aria-pressed:bg-accent aria-pressed:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground [&_svg:not([class*=size-])]:size-[18px]', busy && '[&_svg]:animate-pulse', className)}>{children}</Button>
    </TooltipTrigger>
    <TooltipContent side={side}>{label}</TooltipContent>
  </Tooltip>;
}

export function MapRail({ panel, onPanel, filtered }: { panel: MapPanel | null; onPanel: (panel: MapPanel) => void; filtered: boolean }) {
  return <Toolbar aria-label="Paneles del mapa" orientation="vertical" className={cn(floating, 'map-rail flex flex-col items-center gap-1 p-1 max-md:flex-row max-md:justify-around max-md:rounded-none max-md:border-x-0 max-md:border-b-0 max-md:p-1.5')}>
    {PANELS.map(p => <div key={p.key} className="contents">
      {p.separated && <Separator className="my-0.5 w-6 max-md:hidden"/>}
      <ToolButton label={p.label} pressed={panel === p.key} onClick={() => onPanel(p.key)} className="max-md:h-11 max-md:w-16 max-md:flex-col max-md:gap-0.5">
        <p.icon/><span className="hidden text-[10.5px] leading-none font-medium max-md:block" aria-hidden="true">{p.short ?? p.label}</span>
        {p.key === 'filters' && filtered && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-brand ring-2 ring-background" aria-hidden="true"/>}
      </ToolButton>
    </div>)}
  </Toolbar>;
}

export function ToolRail({ children }: { children: ReactNode }) {
  return <Toolbar aria-label="Herramientas del mapa" orientation="vertical" className={cn(floating, 'flex flex-col items-center gap-1 p-1')}>{children}</Toolbar>;
}
