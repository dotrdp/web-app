// Navigation lives in a drawer opened from the header menu button, hidden most
// of the time. The map keeps only icon rails for its own panels and tools.
import { Fragment, type ReactElement } from 'react';
import { Drawer } from '@mui/material';
import { Bookmark, ChartNoAxesCombined, Database, Filter, FlaskConical, Layers3, Map as MapIcon, Rows3, Table2, Users, X } from 'lucide-react';
import { ActionTooltip } from './IconButton';
import { PresentationSwitch } from './AppHeader';
import { LoadingValue } from './AgentProgress';
import { Logo } from './Logo';
import type { User, View } from './types';
import './rail.css';

export type MapPanel = 'layers' | 'basemap' | 'parcels' | 'bookmarks' | 'filters';
export const PANELS: { key: MapPanel; label: string; short?: string; icon: typeof Layers3; separated?: boolean }[] = [
  { key: 'layers', label: 'Capas', icon: Layers3 },
  { key: 'basemap', label: 'Mapa base', short: 'Base', icon: MapIcon },
  { key: 'parcels', label: 'Parcelas', icon: Rows3 },
  { key: 'bookmarks', label: 'Marcadores', icon: Bookmark },
  { key: 'filters', label: 'Filtros', icon: Filter, separated: true },
];
const VIEW_ICONS: Record<View, typeof MapIcon> = { map: MapIcon, parcels: Table2, technical: ChartNoAxesCombined, models: FlaskConical, sources: Database, admin: Users };
const VIEW_HINTS: Record<View, string> = { map: 'Atlas territorial', parcels: 'Tabla, exportación y análisis', technical: 'Series por parcela', models: 'Métricas y valor de ejemplo', sources: 'Procedencia de los datos', admin: 'Usuarios y asignaciones' };

export function RailTip({ label, side = 'right', children }: { label: string; side?: 'right' | 'left'; children: ReactElement }) {
  return <ActionTooltip content={label} side={side}>{children}</ActionTooltip>;
}

/** Icon-only rail on the left edge of the map: opens one contextual panel at a time. */
export function MapRail({ panel, onPanel, filtered }: { panel: MapPanel | null; onPanel: (panel: MapPanel) => void; filtered: boolean }) {
  return <div className="map-rail" role="toolbar" aria-label="Paneles del mapa" aria-orientation="vertical">
    {PANELS.map(p => <Fragment key={p.key}>{p.separated && <span className="rail-separator" aria-hidden="true"/>}<RailTip label={p.key === 'filters' && filtered ? 'Filtros activos' : p.label}><button type="button" className="rail-item" aria-label={p.label} aria-pressed={panel === p.key} onClick={() => onPanel(p.key)}>
      <p.icon size={20} strokeWidth={1.5}/><span className="rail-label" aria-hidden="true">{p.short ?? p.label}</span>{p.key === 'filters' && filtered && <i className="rail-dot" aria-hidden="true"/>}
    </button></RailTip></Fragment>)}
  </div>;
}

export default function NavMenu({ user, view, views, parcelCount, loading, technical, open, onClose, onNavigate, onPresentation }: { user: User; view: View; views: Record<View, string>; parcelCount: number; loading: boolean; technical: boolean; open: boolean; onClose: () => void; onNavigate: (view: View) => void; onPresentation: (technical: boolean) => void }) {
  const list = (['map', 'parcels', 'technical', 'models', 'sources', 'admin'] as View[]).filter(v => v !== 'admin' || user.role === 'admin');
  return <Drawer anchor="left" open={open} onClose={onClose} slotProps={{ paper: { className: 'nav-drawer', role: 'dialog', 'aria-label': 'Navegación y cuenta', 'aria-modal': true } }}>
    <aside className="nav-menu" aria-label="Menú lateral">
      <div className="nav-menu-head"><Logo size={26} subtitle={false}/><button type="button" className="nav-menu-close" aria-label="Cerrar navegación" onClick={onClose}><X size={18}/></button></div>
      <nav aria-label="Navegación principal"><ul>{list.map(v => { const Icon = VIEW_ICONS[v]; return <li key={v}>
        <a className="nav-link" href={`#/${v}`} aria-label={views[v]} aria-current={view === v ? 'page' : undefined} onClick={event => { event.preventDefault(); onNavigate(v); }}>
          <Icon className="nav-link-icon" size={18} strokeWidth={1.6}/>
          <span className="nav-link-text" title={VIEW_HINTS[v]}>{views[v]}</span>
          {v === 'parcels' && <span className="nav-count" aria-hidden={!loading}>{loading ? <LoadingValue label="Parcelas disponibles pendientes"/> : parcelCount}</span>}
        </a></li>; })}</ul></nav>
      <div className="nav-menu-foot">
        <span className="nav-menu-label">Presentación</span>
        <PresentationSwitch technical={technical} onChange={next => { onClose(); onPresentation(next); }}/>
      </div>
    </aside>
  </Drawer>;
}
