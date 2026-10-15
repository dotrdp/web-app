// The vertical bar (Caelestia's left bar): the mark opens the launcher, three
// phase pills act as workspaces, map panels sit as tray icons, the active
// context reads vertically, and the clock, theme and power close the column.
import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Bookmark, ChartSpline, Database, Filter, FlaskConical, Layers3, LogOut, Map as MapIcon, Moon, Palette, Puzzle, Sun, Table2, Telescope } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { LogoMark } from '../Logo';
import type { Phase } from '../types';

export type LeftPanel = 'layers' | 'basemap' | 'tabla' | 'filters' | 'bookmarks' | 'plugins';
export const PHASES: { key: Phase; label: string; detail: string; icon: LucideIcon }[] = [
  { key: 'explorar', label: 'Explorar', detail: 'Mapa, parcelas y vegetación', icon: Telescope },
  { key: 'estimar', label: 'Estimar', detail: 'Rendimiento, error y entrega', icon: ChartSpline },
  { key: 'avanzado', label: 'Indicadores avanzados', detail: 'Series, capas técnicas y diagnóstico del modelo', icon: FlaskConical },
];
export const PANEL_ITEMS: { key: LeftPanel; label: string; icon: LucideIcon }[] = [
  { key: 'layers', label: 'Capas y simbología', icon: Layers3 },
  { key: 'basemap', label: 'Mapa base', icon: MapIcon },
  { key: 'tabla', label: 'Tabla de atributos', icon: Table2 },
  { key: 'filters', label: 'Filtros', icon: Filter },
  { key: 'bookmarks', label: 'Marcadores', icon: Bookmark },
  { key: 'plugins', label: 'Complementos', icon: Puzzle },
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

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 15000); return () => clearInterval(timer); }, []);
  const [h, m] = [now.getHours(), now.getMinutes()].map(n => String(n).padStart(2, '0'));
  return <time dateTime={now.toISOString()} className="grid justify-items-center text-[13px] leading-[1.15] font-medium tabular-nums text-foreground/85" aria-label={`Hora ${h}:${m}`}><span>{h}</span><span>{m}</span></time>;
}

export default function Bar({ phase, panel, context, dark, filtered, service, onLogo, onPhase, onPanel, onTheme, onScheme, onSources, onLogout }: {
  phase: Phase; panel: LeftPanel | null; context: string; dark: boolean; filtered: boolean; service: 'ok' | 'busy' | 'error' | 'idle';
  onLogo: () => void; onPhase: (phase: Phase) => void; onPanel: (panel: LeftPanel) => void; onTheme: () => void; onScheme: () => void; onSources: () => void; onLogout: () => void;
}) {
  const index = PHASES.findIndex(p => p.key === phase);
  const serviceLabel = { ok: 'Servicio de imágenes conectado', busy: 'Cargando imágenes Sentinel-2', error: 'Servicio de imágenes no disponible', idle: 'Imágenes en espera' }[service];
  return <nav aria-label="Barra de AgroCebada" className="shell-bar flex h-full w-(--bar) flex-col items-center gap-3 py-3 max-md:hidden">
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" onClick={onLogo} aria-label="Abrir el lanzador (Ctrl K)" className="grid size-10 place-items-center rounded-[14px] outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring active:scale-95"><LogoMark size={34}/></button>
      </TooltipTrigger>
      <TooltipContent side="right">AgroCebada · lanzador <span className="ml-2 opacity-60">Ctrl K</span></TooltipContent>
    </Tooltip>

    <div role="group" aria-label="Fases" className="relative flex flex-col gap-1 rounded-full bg-tile p-1">
      <span aria-hidden="true" className="phase-indicator absolute top-1 left-1 size-9 rounded-full bg-primary" style={{ transform: `translateY(${index * 40}px)` }}/>
      {PHASES.map((p, i) => <BarButton key={p.key} label={`${i + 1} · ${p.label}`} shortcut={`Alt ${i + 1}`} active={phase === p.key} onClick={() => onPhase(p.key)}
        className={cn('z-10 aria-pressed:bg-transparent aria-pressed:text-primary-foreground hover:bg-transparent', phase !== p.key && 'hover:text-foreground')}><p.icon/></BarButton>)}
    </div>

    <div role="group" aria-label="Paneles del mapa" className="flex flex-col items-center gap-1">
      {PANEL_ITEMS.map(item => <BarButton key={item.key} label={item.label} active={panel === item.key} dot={item.key === 'filters' && filtered} onClick={() => onPanel(item.key)}><item.icon/></BarButton>)}
    </div>

    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 overflow-hidden py-2 text-muted-foreground">
      <span className="bar-vertical min-h-0 truncate text-[12.5px] font-medium tracking-wide" aria-live="polite">{context}</span>
    </div>

    <div className="flex flex-col items-center gap-1.5">
      <Tooltip><TooltipTrigger asChild><span tabIndex={0} aria-label={serviceLabel} className="grid size-7 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className={cn('size-2.5 rounded-full', service === 'ok' ? 'bg-emerald-500' : service === 'busy' ? 'animate-pulse bg-amber-400' : service === 'error' ? 'bg-destructive' : 'bg-muted-foreground/40')}/>
      </span></TooltipTrigger><TooltipContent side="right">{serviceLabel}</TooltipContent></Tooltip>
      <Clock/>
      <BarButton label="Datos y fuentes" onClick={onSources}><Database/></BarButton>
      <BarButton label="Esquema de color" onClick={onScheme}><Palette/></BarButton>
      <BarButton label={dark ? 'Tema claro' : 'Tema oscuro'} onClick={onTheme}>{dark ? <Sun/> : <Moon/>}</BarButton>
      <BarButton label="Cerrar sesión" onClick={onLogout} className="text-destructive/80 hover:text-destructive"><LogOut/></BarButton>
    </div>
  </nav>;
}

/** Below 768 px the bar becomes a bottom dock with the same phases. */
export function MobileDock({ phase, onLogo, onPhase, onPanel, panel }: { phase: Phase; panel: LeftPanel | null; onLogo: () => void; onPhase: (phase: Phase) => void; onPanel: (panel: LeftPanel) => void }) {
  return <nav aria-label="Barra de AgroCebada" className="flex h-14 items-center justify-around gap-1 px-2 md:hidden">
    <button type="button" onClick={onLogo} aria-label="Abrir el lanzador" className="grid size-10 place-items-center"><LogoMark size={30}/></button>
    {PHASES.map(p => <button key={p.key} type="button" aria-label={p.label} aria-pressed={phase === p.key} onClick={() => onPhase(p.key)} className="grid size-11 place-items-center rounded-full text-muted-foreground aria-pressed:bg-primary aria-pressed:text-primary-foreground [&_svg]:size-5"><p.icon/></button>)}
    <button type="button" aria-label="Capas y simbología" aria-pressed={panel === 'layers'} onClick={() => onPanel('layers')} className="grid size-11 place-items-center rounded-full text-muted-foreground aria-pressed:bg-primary-container aria-pressed:text-on-primary-container [&_svg]:size-5"><Layers3/></button>
  </nav>;
}
