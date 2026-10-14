import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, KeyRound, Layers3, MapPinned, Satellite } from 'lucide-react';
import { api, IS_DEMO } from './lib';
import type { User } from './types';
import { LoadingDots } from './AgentProgress';
import { Logo } from './Logo';
import './login.css';

export default function Login({ onLogin, checkingSession = false }: { onLogin: (user: User) => void; checkingSession?: boolean }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try { const result = await api<{ user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }); onLogin(result.user); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  const fillAccount = (id: string) => { setUsername(id); setPassword('Fira2026!'); setError(''); };
  const waiting = busy || checkingSession;
  return <div className="login-page">
    <main className="login-main">
      <header className="login-top"><Logo size={32}/></header>
      <div className="login-form">
        <h1>Inicia sesión</h1>
        <p className="login-lede">Explora las 197 parcelas de cebada del Reto FIRA 2026 en Hidalgo, Puebla y Tlaxcala.</p>
        <form onSubmit={submit}>
          <div className="login-field"><label className="ui-label" htmlFor="username">Usuario</label>
            <input id="username" className="ui-input" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" placeholder="Tu nombre de usuario" required autoFocus/></div>
          <div className="login-field"><label className="ui-label" htmlFor="password">Contraseña</label>
            <div className="ui-input login-password"><input id="password" type={visible ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" placeholder="Tu contraseña" required/>
              <button type="button" className="login-reveal" aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div></div>
          {error && <div className="login-error" role="alert">{error}</div>}
          <button type="submit" className="ui-btn ui-btn-primary ui-btn-lg login-submit" disabled={waiting}>{waiting ? <><LoadingDots/>{checkingSession ? 'Abriendo AgroCebada…' : 'Entrando…'}</> : <>Entrar a AgroCebada<ArrowRight/></>}</button>
        </form>
        <div className="login-divider"><span>Cuentas de prueba</span></div>
        <div className="demo-login">
          <span className="demo-login-icon"><KeyRound size={16}/></span>
          <div className="demo-login-text"><b>Cuenta administradora de prueba</b><span>Usuario <code>testuser</code> · Contraseña <code>Fira2026!</code></span></div>
          <button type="button" className="ui-btn ui-btn-outline ui-btn-sm" onClick={() => fillAccount('testuser')}>Usar cuenta de prueba</button>
        </div>
        {IS_DEMO && <div className="demo-role-options" aria-label="Otras cuentas de prueba">{[['tecnico', 'Técnico'], ['productor1', 'Productor 1'], ['productor2', 'Productor 2']].map(([id, label]) => <button key={id} type="button" className="ui-btn ui-btn-ghost ui-btn-sm" onClick={() => fillAccount(id)}>{label}</button>)}</div>}
        {IS_DEMO && <p className="login-footnote">Demo: los cambios se pierden al recargar la página.</p>}
      </div>
      <footer className="login-main-footer"><span>© 2026 AgroCebada</span><span>Hecho para el Reto FIRA</span></footer>
    </main>
    <aside className="login-story" aria-label="El atlas AgroCebada">
      <div className="login-map" aria-hidden="true"/>
      <div className="login-story-card">
        <span className="login-story-kicker">Atlas territorial</span>
        <h2>El campo tiene mucho que contarte.</h2>
        <ul className="login-features">
          <li><span><MapPinned size={16}/></span><div><b>197 parcelas georreferenciadas</b><small>Límites originales y rendimientos registrados</small></div></li>
          <li><span><Satellite size={16}/></span><div><b>Sentinel-2 y Landsat</b><small>Vegetación y agua mes a mes, 2017–2025</small></div></li>
          <li><span><Layers3 size={16}/></span><div><b>Clima, relieve y AlphaEarth</b><small>Todo el contexto de cada parcela</small></div></li>
        </ul>
      </div>
      <p className="login-credits">Cartografía Esri World Topographic · Parcelas FIRA · Límites INEGI</p>
    </aside>
  </div>;
}
