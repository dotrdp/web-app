import { useEffect, useState } from 'react';
import { Alert, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { ArrowRight, Eye, EyeOff, Sprout, Satellite, ShieldCheck, MapPin } from 'lucide-react';
import { api, IS_DEMO } from './lib';
import type { User } from './types';
import { LoadingDots } from './AgentProgress';

export default function Login({ onLogin, checkingSession = false }: { onLogin: (user: User) => void; checkingSession?: boolean }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [motion, setMotion] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setMotion(!media.matches);
    media.addEventListener('change', change); return () => media.removeEventListener('change', change);
  }, []);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try { const result = await api<{ user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }); onLogin(result.user); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  return <div className="login-page">
    <section className="login-story">
      <a className="login-brand" href="#"><img src="/favicon.svg" width="45" height="45" alt=""/><span>AgroCebada<small>INTELIGENCIA PARA EL CAMPO</small></span></a>
      <picture className="login-artwork" aria-hidden="true">
        <source media="(max-width: 700px)" srcSet={`/artwork/login-mobile${motion ? '.gif' : '-poster.webp'}`} width="780" height="320"/>
        <img src={`/artwork/login-desktop${motion ? '.gif' : '-poster.webp'}`} width="720" height="1050" alt="" fetchPriority="low" decoding="async"/>
      </picture>
      <div className="login-story-copy"><span className="competition-pill"><span/>RETO FIRA 2026</span><h1>El campo tiene<br/>mucho que<br/><em>contarte.</em></h1><p>Conecta cada parcela con su territorio.<br/>Explora los datos y descubre nuevas<br/>perspectivas para el cultivo de cebada.</p><div className="login-feature-pills"><span><MapPin size={14}/>197 parcelas</span><span><Satellite size={14}/>Datos satelitales</span></div></div>
      <footer>HIDALGO · PUEBLA · TLAXCALA <span>19.754° N / 98.405° O</span></footer>
    </section>
    <main className="login-main"><div className="login-form">
      <div className="login-mobile-brand"><img src="/favicon.svg" width="34" alt=""/>AgroCebada</div>
      <span className="section-kicker">TU ESPACIO DE TRABAJO</span><h2>Bienvenido al campo.</h2><p>Inicia sesión para explorar el atlas AgroCebada.</p>
      <form onSubmit={submit}>
        <label htmlFor="username">Usuario</label><TextField id="username" fullWidth size="small" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" placeholder="Tu nombre de usuario" required/>
        <label htmlFor="password">Contraseña</label><TextField id="password" fullWidth size="small" type={visible ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" placeholder="Tu contraseña" required slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setVisible(!visible)} size="small">{visible ? <EyeOff size={17}/> : <Eye size={17}/>}</IconButton></InputAdornment> } }}/>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Button fullWidth variant="contained" type="submit" disabled={busy || checkingSession} endIcon={busy || checkingSession ? undefined : <ArrowRight size={17}/>} className="login-submit">{busy || checkingSession ? <><LoadingDots/>{checkingSession ? 'Abriendo AgroCebada…' : 'Entrando…'}</> : 'Entrar a AgroCebada'}</Button>
      </form>
      <div className="demo-login"><div><ShieldCheck size={18}/><b>Cuenta administradora de prueba</b></div><p><span>Usuario <code>testuser</code></span><span>Contraseña <code>Fira2026!</code></span></p><Button size="small" onClick={() => { setUsername('testuser'); setPassword('Fira2026!'); setError(''); }}>Usar cuenta de prueba <ArrowRight size={13}/></Button></div>
      {IS_DEMO && <div className="demo-role-options" aria-label="Otras cuentas de prueba">{[['tecnico', 'Técnico'], ['productor1', 'Productor 1'], ['productor2', 'Productor 2']].map(([id, label]) => <button key={id} type="button" onClick={() => { setUsername(id); setPassword('Fira2026!'); }}>{label}</button>)}</div>}
      <div className="login-footnote"><Sprout size={15}/>{IS_DEMO ? 'Demo: los cambios se pierden al recargar la página.' : 'Tecnología que empieza en la tierra.'}</div>
    </div><footer>AgroCebada 2026 <span>Hecho para el Reto FIRA</span></footer></main>
  </div>;
}
