import { useState } from 'react';
import { Alert, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { ArrowRight, Eye, EyeOff, Sprout, Satellite, ShieldCheck, MapPin } from 'lucide-react';
import { api, IS_DEMO } from './lib';
import type { User } from './types';

export default function Login({ onLogin }: { onLogin: (user: User) => void }) {
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
  return <div className="login-page">
    <section className="login-story">
      <a className="login-brand" href="#"><img src="/favicon.svg" width="45" height="45" alt=""/><span>AgroCebada<small>INTELIGENCIA PARA EL CAMPO</small></span></a>
      <div className="login-topography" aria-hidden="true"><svg viewBox="0 0 620 750" preserveAspectRatio="xMidYMid slice">{Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${-140 + i * 20} 840 C${-80 + i * 22} 520 ${580 - i * 22} 590 ${550 - i * 17} 325 S${75 + i * 15} 175 ${185 + i * 25} -90`} fill="none" stroke="#c9e19a" strokeOpacity={.08 + i % 3 * .02} strokeWidth="1.4"/>)}</svg></div>
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
        <Button fullWidth variant="contained" type="submit" disabled={busy} endIcon={<ArrowRight size={17}/>} className="login-submit">{busy ? 'Entrando…' : 'Entrar a AgroCebada'}</Button>
      </form>
      <div className="demo-login"><div><ShieldCheck size={18}/><b>Cuenta administradora de prueba</b></div><p><span>Usuario <code>testuser</code></span><span>Contraseña <code>Fira2026!</code></span></p><Button size="small" onClick={() => { setUsername('testuser'); setPassword('Fira2026!'); setError(''); }}>Usar cuenta de prueba <ArrowRight size={13}/></Button></div>
      <div className="login-footnote"><Sprout size={15}/>{IS_DEMO ? 'Demo: los cambios se pierden al recargar la página.' : 'Tecnología que empieza en la tierra.'}</div>
    </div><footer>AgroCebada 2026 <span>Hecho para el Reto FIRA</span></footer></main>
  </div>;
}
