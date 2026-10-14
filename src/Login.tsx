import { lazy, Suspense, useState } from 'react';
import { ArrowRight, Eye, EyeOff, KeyRound } from 'lucide-react';
import { api, IS_DEMO } from './lib';
import type { User } from './types';
import { LoadingDots } from './AgentProgress';
import { DotMark } from './Loader';
import Particles from './Particles';
import './login.css';

const Globe = lazy(() => import('./Globe'));

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
    <section className="login-story" aria-labelledby="login-headline">
      <Particles className="login-particles" quantity={320} size={1.4} opacity={.32} drift={.28}/>
      <div className="login-story-grid" aria-hidden="true"/>
      <header className="login-brand"><DotMark size={26} tone="leaf"/><span>AgroCebada</span><span className="login-brand-tag">FIRA 2026</span></header>
      <div className="login-story-copy">
        <span className="login-pill"><span className="live-dot"/>Reto FIRA 2026 · Hidalgo · Puebla · Tlaxcala</span>
        <h1 id="login-headline" className="pixel">El campo tiene mucho que <em>contarte.</em></h1>
        <p>Cada parcela de cebada, conectada con su territorio: imágenes Sentinel-2, series Landsat, clima, relieve y embeddings AlphaEarth en un solo atlas.</p>
        <dl className="login-stats">
          <div><dt>Parcelas</dt><dd className="pixel">197</dd></div>
          <div><dt>Resolución</dt><dd className="pixel">10<small>m</small></dd></div>
          <div><dt>Serie</dt><dd className="pixel">2017<small>–25</small></dd></div>
        </dl>
      </div>
      <div className="login-globe-wrap"><Suspense fallback={null}><Globe className="login-globe"/></Suspense></div>
      <footer className="login-story-footer"><span>19.754° N · 98.405° O</span><span>Copernicus · USGS · INEGI · FIRA</span></footer>
    </section>

    <main className="login-main">
      <div className="login-mobile-brand"><DotMark size={24}/>AgroCebada</div>
      <div className="login-form">
        <span className="kicker">Tu espacio de trabajo</span>
        <h2>Bienvenido al campo.</h2>
        <p className="login-lede">Inicia sesión para explorar el atlas AgroCebada.</p>
        <form onSubmit={submit} noValidate={false}>
          <div className="login-field"><label className="ui-label" htmlFor="username">Usuario</label>
            <input id="username" className="ui-input" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" placeholder="Tu nombre de usuario" required autoFocus/></div>
          <div className="login-field"><label className="ui-label" htmlFor="password">Contraseña</label>
            <div className="ui-input login-password"><input id="password" type={visible ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" placeholder="Tu contraseña" required/>
              <button type="button" className="login-reveal" aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div></div>
          {error && <div className="login-error" role="alert">{error}</div>}
          <button type="submit" className="ui-btn ui-btn-primary ui-btn-lg login-submit" disabled={waiting}>{waiting ? <><LoadingDots/>{checkingSession ? 'Abriendo AgroCebada…' : 'Entrando…'}</> : <>Entrar a AgroCebada<ArrowRight/></>}</button>
        </form>
        <div className="login-divider"><span>o usa una cuenta de prueba</span></div>
        <div className="demo-login">
          <div className="demo-login-head"><KeyRound size={15}/><b>Cuenta administradora de prueba</b></div>
          <dl><div><dt>Usuario</dt><dd><code>testuser</code></dd></div><div><dt>Contraseña</dt><dd><code>Fira2026!</code></dd></div></dl>
          <button type="button" className="ui-btn ui-btn-outline ui-btn-sm" onClick={() => fillAccount('testuser')}>Usar cuenta de prueba<ArrowRight/></button>
        </div>
        {IS_DEMO && <div className="demo-role-options" aria-label="Otras cuentas de prueba">{[['tecnico', 'Técnico'], ['productor1', 'Productor 1'], ['productor2', 'Productor 2']].map(([id, label]) => <button key={id} type="button" className="ui-btn ui-btn-ghost ui-btn-sm" onClick={() => fillAccount(id)}>{label}</button>)}</div>}
        <p className="login-footnote">{IS_DEMO ? 'Demo: los cambios se pierden al recargar la página.' : 'Tecnología que empieza en la tierra.'}</p>
      </div>
      <footer className="login-main-footer"><span>AgroCebada 2026</span><span>Hecho para el Reto FIRA</span></footer>
    </main>
  </div>;
}
