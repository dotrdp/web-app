import { Fragment, useEffect, useRef, useState } from 'react';
import { Drawer, useMediaQuery } from '@mui/material';
import { ChartNoAxesCombined, ChevronsUpDown, Database, FlaskConical, Grid2X2, LogOut, Map, Users, X } from 'lucide-react';
import { DEMO_USERS, ROLE_NAMES } from './demo';
import { IS_DEMO } from './lib';
import { LoadingValue } from './AgentProgress';
import { IconButton } from './IconButton';
import { DotMark } from './Loader';
import { Navbar, NavbarActions, NavbarBrand, NavbarLink, NavbarLinks } from './Navbar';
import type { User, View } from './types';
import './sidebar.css';

interface Props {
  user: User; view: View; views: Record<View, string>; parcelCount: number; loading: boolean;
  open: boolean; technical: boolean;
  onClose: () => void; onNavigate: (view: View) => void; onPresentation: (technical: boolean) => void;
  onSwitchUser: (username: string) => void; onLogout: () => void;
}
const ICONS = { map: Map, parcels: Grid2X2, technical: ChartNoAxesCombined, models: FlaskConical, sources: Database, admin: Users };

export default function Sidebar(props: Props) {
  const narrow = useMediaQuery('(max-width: 1000px)', { noSsr: true });
  const [accountOpen, setAccountOpen] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  useEffect(() => { setAccountOpen(false); }, [props.user.id, props.view]);
  function navigate(view: View) { setAccountOpen(false); props.onNavigate(view); }
  const sections: [string, View[]][] = [['Explorar', ['map', 'parcels']], ['Análisis', ['technical', 'models']], ['Proyecto', props.user.role === 'admin' ? ['sources', 'admin'] : ['sources']]];
  const content = <Navbar target={scroll}>
    <div className="side-navigation-brand">
      <NavbarBrand href="#/map" onClick={event => { event.preventDefault(); navigate('map'); }}><DotMark size={24}/><span>AgroCebada<small>FIRA 2026</small></span></NavbarBrand>
      {narrow && <IconButton className="side-navigation-close" label="Cerrar navegación" onClick={props.onClose}><X size={18}/></IconButton>}
    </div>
    <div className="side-navigation-scroll" ref={scroll}>
      <div className="side-workspace">
        <span className="side-workspace-mark" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i}/>)}</span>
        <span className="side-workspace-text"><b>Atlas territorial</b><small>Hidalgo · Puebla · Tlaxcala</small></span>
        <span className="side-workspace-status" title="Datos disponibles"><span className="live-dot"/></span>
      </div>
      <div className="side-presentation">
        <span className="side-section-label">Presentación</span>
        <div className="presentation-switch" aria-label="Presentación">
          <button className={!props.technical ? 'active' : ''} aria-pressed={!props.technical} onClick={() => props.onPresentation(false)}>Productor</button>
          <button className={props.technical ? 'active' : ''} aria-pressed={props.technical} onClick={() => { props.onClose(); props.onPresentation(true); }}>Análisis Pro</button>
        </div>
      </div>
      <NavbarLinks aria-label="Navegación principal">{sections.map(([section, views]) => <Fragment key={section}>
        <li className="side-section-label">{section}</li>
        {views.map(view => {
          const Icon = ICONS[view];
          return <NavbarLink key={view} href={`#/${view}`} aria-label={props.views[view]} active={props.view === view} onClick={event => { event.preventDefault(); navigate(view); }}>
            <Icon size={16}/><span>{props.views[view]}</span>
            {view === 'parcels' && <b className="side-parcel-count" aria-hidden={!props.loading}>{props.loading ? <LoadingValue label="Parcelas disponibles pendientes"/> : props.parcelCount}</b>}
          </NavbarLink>;
        })}
      </Fragment>)}</NavbarLinks>
    </div>
    <NavbarActions className="side-account">
      {accountOpen && <div className="side-account-actions" role="group" aria-label="Acciones de cuenta">
        <span className="side-section-label">{IS_DEMO ? 'Cambiar cuenta de prueba' : 'Tu cuenta'}</span>
        {IS_DEMO && DEMO_USERS.filter(user => user.id !== props.user.id).map(user => <button key={user.id} onClick={() => { setAccountOpen(false); props.onClose(); props.onSwitchUser(user.username); }}>Demo: {user.username} · {ROLE_NAMES[user.role]}</button>)}
        <button className="side-logout" onClick={() => { setAccountOpen(false); props.onLogout(); }}><LogOut size={15}/>Cerrar sesión</button>
      </div>}
      <button className="side-account-trigger" aria-label={`Abrir menú de ${props.user.username}`} aria-expanded={accountOpen} onClick={() => setAccountOpen(!accountOpen)}>
        <span className="side-account-avatar pixel">{props.user.name.slice(0, 1)}</span>
        <span className="side-account-name"><b>{props.user.username}</b><small>{ROLE_NAMES[props.user.role]}</small></span>
        <ChevronsUpDown size={15}/>
      </button>
    </NavbarActions>
  </Navbar>;
  if (narrow) return <Drawer anchor="left" open={props.open} onClose={props.onClose} slotProps={{ paper: { className: 'side-navigation side-navigation-drawer', role: 'dialog', 'aria-label': 'Navegación y cuenta', 'aria-modal': true } }}><aside aria-label="Menú lateral" className="side-navigation-inner">{content}</aside></Drawer>;
  return <aside className="side-navigation" aria-label="Menú lateral">{content}</aside>;
}
