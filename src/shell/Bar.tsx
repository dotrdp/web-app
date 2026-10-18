// The vertical bar (Caelestia's left bar): settings and the dashboard at the top,
// map panels as tray icons, and sign-out closing the column. On the dashboard page
// the map panels fade with the map and the dashboard icon morphs into a map.
import type { LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ChartSpline, Filter, FlaskConical, Layers3, LayoutDashboard, LogOut, Map as MapIcon, Settings, Table2, Telescope } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { LogoMark } from '../Logo';
import type { Phase } from '../types';

export type LeftPanel = 'layers' | 'basemap' | 'tabla' | 'filters' | 'settings';
export const PHASES: { key: Phase; label: string; detail: string; icon: LucideIcon }[] = [
  { key: 'explorar', label: 'Explorar', detail: 'Mapa, parcelas y vegetación', icon: Telescope },
  { key: 'estimar', label: 'Estimar', detail: 'Rendimiento, error y entrega', icon: ChartSpline },
  { key: 'avanzado', label: 'Indicadores avanzados', detail: 'Series, capas técnicas y diagnóstico del modelo', icon: FlaskConical },
];
export const PANEL_ITEMS: { key: LeftPanel; label: string; icon: LucideIcon }[] = [
  { key: 'layers', label: 'Capas y simbología', icon: Layers3 },
  { key: 'basemap', label: 'Mapa base', icon: MapIcon },
  { key: 'tabla', label: 'Tabla de atributos', icon: Table2 },
  { key: 'filters', label: 'Filtros y marcadores', icon: Filter },
];

function BarButton({ label, active, onClick, children, className, dot, shortcut }: { label: string; active?: boolean; onClick: () => void; children: React.ReactNode; className?: string; dot?: boolean; shortcut?: string }) {
  return <Tooltip>
    <TooltipTrigger asChild>
      <button type="button" aria-label={label} aria-pressed={active} onClick={onClick}
        className={cn('relative grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-tile hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-primary-container aria-pressed:text-on-primary-container [&_svg]:size-[18px]', className)}>
        {children}
        {dot && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-frame" aria-hidden="true"/>}
      </button>
    </TooltipTrigger>
    <TooltipContent side="right">{label}{shortcut && <span className="ml-2 opacity-60">{shortcut}</span>}</TooltipContent>
  </Tooltip>;
}

/** The dashboard glyph turns, shrinks and blurs into a map (and back). */
export function MorphIcon({ map }: { map: boolean }) {
  return <AnimatePresence mode="popLayout" initial={false}>
    <motion.span key={map ? 'map' : 'dashboard'} className="grid place-items-center"
      initial={{ opacity: 0, scale: .4, rotate: -90, filter: 'blur(4px)' }} animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: .4, rotate: 90, filter: 'blur(4px)' }}
      transition={{ type: 'spring', bounce: .3, visualDuration: .35 }}>
      {map ? <MapIcon/> : <LayoutDashboard/>}
    </motion.span>
  </AnimatePresence>;
}

export default function Bar({ panel, dashboard, filtered, onDashboard, onPanel, onLogout }: {
  panel: LeftPanel | null; dashboard: boolean; filtered: boolean;
  onDashboard: () => void; onPanel: (panel: LeftPanel) => void; onLogout: () => void;
}) {
  return <nav aria-label="Barra de AgroCebada" className="shell-bar flex h-full w-(--bar) flex-col items-center gap-3 py-3 max-md:hidden">
    <div className="flex flex-col gap-1 rounded-full bg-tile p-1">
      <BarButton label="Ajustes" active={panel === 'settings'} onClick={() => onPanel('settings')}><Settings/></BarButton>
      <BarButton label={dashboard ? 'Volver al mapa' : 'Panel de control'} shortcut="Alt D" onClick={onDashboard}><MorphIcon map={dashboard}/></BarButton>
    </div>

    <motion.div role="group" aria-label="Paneles del mapa" inert={dashboard} initial={false} animate={{ opacity: dashboard ? 0 : 1, filter: dashboard ? 'blur(4px)' : 'blur(0px)' }} transition={{ duration: .38, ease: [.4, 0, .2, 1] }} className="flex flex-col items-center gap-1">
      {PANEL_ITEMS.map(item => <BarButton key={item.key} label={item.label} active={panel === item.key} dot={item.key === 'filters' && filtered} onClick={() => onPanel(item.key)}><item.icon/></BarButton>)}
    </motion.div>

    <BarButton label="Cerrar sesión" onClick={onLogout} className="mt-auto text-destructive/80 hover:text-destructive"><LogOut/></BarButton>
  </nav>;
}

/** Below 768 px the bar becomes a bottom dock: launcher, dashboard, layers and settings. */
export function MobileDock({ panel, dashboard, onLogo, onDashboard, onPanel }: { panel: LeftPanel | null; dashboard: boolean; onLogo: () => void; onDashboard: () => void; onPanel: (panel: LeftPanel) => void }) {
  const item = 'grid size-11 place-items-center rounded-full text-muted-foreground aria-pressed:bg-primary-container aria-pressed:text-on-primary-container [&_svg]:size-5';
  return <nav aria-label="Barra de AgroCebada" className="flex h-14 items-center justify-around gap-1 px-2 md:hidden">
    <button type="button" onClick={onLogo} aria-label="Abrir el lanzador" className="grid size-10 place-items-center"><LogoMark size={30}/></button>
    <button type="button" aria-label={dashboard ? 'Volver al mapa' : 'Panel de control'} onClick={onDashboard} className={item}><MorphIcon map={dashboard}/></button>
    <button type="button" aria-label="Capas y simbología" aria-pressed={panel === 'layers'} onClick={() => onPanel('layers')} className={item}><Layers3/></button>
    <button type="button" aria-label="Ajustes" aria-pressed={panel === 'settings'} onClick={() => onPanel('settings')} className={item}><Settings/></button>
  </nav>;
}
