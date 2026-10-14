// Application header (ArcGIS Map Viewer pattern): menu, brand, document title,
// presentation switch and account.
import { useEffect, useRef, useState } from 'react';
import { LogOut, Menu as MenuIcon, UserRound } from 'lucide-react';
import { DEMO_USERS, ROLE_NAMES } from './demo';
import { IS_DEMO } from './lib';
import { Logo } from './Logo';
import type { User } from './types';

export function PresentationSwitch({ technical, onChange }: { technical: boolean; onChange: (technical: boolean) => void }) {
  return <div className="presentation-switch" role="group" aria-label="Presentación">
    <button type="button" className={!technical ? 'active' : ''} aria-pressed={!technical} onClick={() => onChange(false)}>Productor</button>
    <button type="button" className={technical ? 'active' : ''} aria-pressed={technical} onClick={() => onChange(true)}>Análisis Pro</button>
  </div>;
}

export function AccountMenu({ user, technical, onPresentation, onSwitchUser, onLogout }: { user: User; technical: boolean; onPresentation: (technical: boolean) => void; onSwitchUser: (username: string) => void; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent | KeyboardEvent) => { if (event instanceof KeyboardEvent ? event.key === 'Escape' : !root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, [open]);
  return <div className="account-menu" ref={root}>
    <button type="button" className="account-trigger" aria-label={`Abrir menú de ${user.username}`} aria-expanded={open} onClick={() => setOpen(!open)}>
      <span className="account-avatar">{user.name.slice(0, 1)}</span>
    </button>
    {open && <div className="account-popover" role="group" aria-label="Acciones de cuenta">
      <div className="account-popover-head"><span className="account-avatar large">{user.name.slice(0, 1)}</span><span><b>{user.name}</b><small>{user.username} · {ROLE_NAMES[user.role]}</small></span></div>
      <span className="account-popover-label">Presentación</span>
      <div className="account-popover-switch"><PresentationSwitch technical={technical} onChange={next => { setOpen(false); onPresentation(next); }}/></div>
      {IS_DEMO && <><span className="account-popover-label">Cambiar cuenta de prueba</span>{DEMO_USERS.filter(u => u.id !== user.id).map(u => <button key={u.id} type="button" onClick={() => { setOpen(false); onSwitchUser(u.username); }}><UserRound size={15}/>Demo: {u.username} · {ROLE_NAMES[u.role]}</button>)}</>}
      <button type="button" className="account-logout" onClick={() => { setOpen(false); onLogout(); }}><LogOut size={15}/>Cerrar sesión</button>
    </div>}
  </div>;
}

export default function AppHeader({ title, user, technical, onMenu, onHome, onPresentation, onSwitchUser, onLogout }: { title: string; user: User; technical: boolean; onMenu: () => void; onHome: () => void; onPresentation: (technical: boolean) => void; onSwitchUser: (username: string) => void; onLogout: () => void }) {
  return <header className="app-header">
    <button type="button" className="app-header-menu" aria-label="Abrir navegación" onClick={onMenu}><MenuIcon size={20} strokeWidth={1.7}/></button>
    <a className="app-header-brand" href="#/map" onClick={event => { event.preventDefault(); onHome(); }} aria-label="AgroCebada, ir al mapa"><Logo size={28} subtitle={false}/></a>
    <span className="app-header-divider" aria-hidden="true"/>
    <span className="app-header-title">{title}</span>
    <div className="app-header-actions">
      {technical && <span className="app-header-mode">Análisis Pro</span>}
      <AccountMenu user={user} technical={technical} onPresentation={onPresentation} onSwitchUser={onSwitchUser} onLogout={onLogout}/>
    </div>
  </header>;
}
