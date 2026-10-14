import { lazy, Suspense, useState } from 'react';
import { ArrowRight, CircleAlert, Eye, EyeOff, KeyRound } from 'lucide-react';
import { api, IS_DEMO } from './lib';
import type { User } from './types';
import { LoadingDots } from './AgentProgress';
import { LogoMark } from './Logo';
import Particles from './Particles';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Kbd } from '@/components/ui/kbd';
import { cn } from '@/lib/utils';

// COBE and its WebGL setup load after the form, so signing in never waits on the globe.
const Globe = lazy(() => import('./Globe'));

const DEMO_PASSWORD = 'Fira2026!';
const ROLE_ACCOUNTS = [['tecnico', 'Técnico'], ['productor1', 'Productor 1'], ['productor2', 'Productor 2']] as const;
const FACTS = [
  { value: '197', label: 'parcelas de cebada' },
  { value: '10 m', label: 'Sentinel-2 por píxel' },
  { value: '2017–2025', label: 'serie histórica' },
];

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
  const fillAccount = (id: string) => { setUsername(id); setPassword(DEMO_PASSWORD); setError(''); };
  const waiting = busy || checkingSession;

  return <div className="flex min-h-svh flex-col-reverse bg-background md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
    <main className="login-main flex flex-1 flex-col gap-6 p-6 md:p-10">
      <header className="hidden md:flex"><Brand/></header>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm">
          <form onSubmit={submit}>
            <FieldGroup className="gap-6">
              <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-semibold tracking-tight">Inicia sesión</h1>
                <p className="text-sm text-balance text-muted-foreground">Explora las 197 parcelas de cebada del Reto FIRA 2026 en Hidalgo, Puebla y Tlaxcala.</p>
              </div>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="username">Usuario</FieldLabel>
                  <Input id="username" className="h-9" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" placeholder="Tu nombre de usuario" required autoFocus aria-invalid={!!error || undefined}/>
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <InputGroup className="h-9">
                    <InputGroupInput id="password" type={visible ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" placeholder="Tu contraseña" required aria-invalid={!!error || undefined}/>
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton size="icon-xs" aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <EyeOff/> : <Eye/>}</InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                {error && <Alert variant="destructive">
                  <CircleAlert/>
                  <AlertTitle>No pudimos iniciar sesión</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>}
                <Field>
                  <Button type="submit" size="lg" className="w-full" disabled={waiting}>
                    {waiting ? <><LoadingDots/>{checkingSession ? 'Abriendo AgroCebada…' : 'Entrando…'}</> : <>Entrar a AgroCebada<ArrowRight data-icon="inline-end"/></>}
                  </Button>
                </Field>
              </FieldGroup>
              <FieldSeparator>o usa una cuenta de prueba</FieldSeparator>
              <div className="flex flex-col gap-3">
                <Item variant="outline" className="gap-3 p-3">
                  <ItemMedia variant="icon" className="size-8 rounded-md border bg-muted text-muted-foreground"><KeyRound/></ItemMedia>
                  <ItemContent className="min-w-0 gap-1">
                    <ItemTitle>Cuenta administradora</ItemTitle>
                    <ItemDescription className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
                      <span className="sr-only">Usuario</span><Kbd className="font-mono">testuser</Kbd>
                      <span aria-hidden="true">·</span>
                      <span className="sr-only">Contraseña</span><Kbd className="font-mono">{DEMO_PASSWORD}</Kbd>
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="basis-full">
                    <Button type="button" variant="outline" className="w-full" onClick={() => fillAccount('testuser')}>Usar cuenta de prueba</Button>
                  </ItemActions>
                </Item>
                {IS_DEMO && <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Entrar con otro rol</span>
                  <ButtonGroup aria-label="Otras cuentas de prueba" className="max-sm:w-full max-sm:*:flex-1">
                    {ROLE_ACCOUNTS.map(([id, label]) => <Button key={id} type="button" variant="outline" size="sm" aria-pressed={username === id} className="aria-pressed:bg-muted" onClick={() => fillAccount(id)}>{label}</Button>)}
                  </ButtonGroup>
                </div>}
              </div>
              {IS_DEMO && <FieldDescription className="text-center text-xs">Demo: los cambios se pierden al recargar la página.</FieldDescription>}
            </FieldGroup>
          </form>
        </div>
      </div>
      <footer className="flex justify-between gap-4 text-xs text-muted-foreground"><span>© 2026 AgroCebada</span><span>Hecho para el Reto FIRA</span></footer>
    </main>
    <LoginStory/>
  </div>;
}

/* The night side: a dotted globe rises from the bottom edge with data arcs to the
   study area, while particles drift past like pollen. */
function LoginStory() {
  return <aside className="login-story dark relative isolate h-[180px] shrink-0 overflow-hidden bg-[oklch(0.16_0.018_160)] text-foreground md:sticky md:top-0 md:flex md:h-svh md:flex-col md:p-10 lg:p-12" aria-label="El atlas AgroCebada">
    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_70%_at_70%_100%,oklch(0.36_0.08_150/0.55),transparent_65%),radial-gradient(60%_50%_at_0%_0%,oklch(0.3_0.04_160/0.5),transparent_70%)]"/>
    <Particles className="-z-10" quantity={300} size={1.3} opacity={.34} drift={.26}/>
    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(1_0_0/0.035)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.035)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_top_left,black,transparent_70%)] bg-size-[56px_56px]"/>

    {/* Mobile banner: brand and a one-line summary over the rising globe. */}
    <div className="relative z-10 flex h-full flex-col justify-between p-5 md:hidden">
      <Brand tone="light"/>
      <p className="text-xs text-white/70">197 parcelas · Sentinel-2 10 m · 2017–2025</p>
    </div>

    <div className="relative z-10 hidden max-w-xl flex-col gap-6 md:flex">
      <Badge variant="outline" className="h-6 gap-2 border-white/15 bg-white/5 px-2.5 text-white/80 backdrop-blur-sm">
        <span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-[#b9e769] opacity-60 motion-reduce:animate-none"/><span className="relative inline-flex size-1.5 rounded-full bg-[#b9e769]"/></span>
        Reto FIRA 2026 · Hidalgo · Puebla · Tlaxcala
      </Badge>
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-white lg:text-5xl xl:text-[3.5rem]">El campo tiene mucho que <span className="text-[#b9e769]">contarte.</span></h2>
        <p className="max-w-md text-[15px] leading-relaxed text-white/60">Cada parcela de cebada, conectada con su territorio: imágenes de satélite, clima, relieve y rendimientos en un solo atlas.</p>
      </div>
      <dl className="grid max-w-lg grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
        {FACTS.map(fact => <div key={fact.label} className="flex flex-col gap-1 px-4 py-3">
          <dt className="order-2 text-xs text-white/50">{fact.label}</dt>
          <dd className="order-1 font-mono text-lg font-medium tracking-tight text-white tabular-nums lg:text-xl">{fact.value}</dd>
        </div>)}
      </dl>
    </div>

    <div aria-hidden="true" className="pointer-events-none absolute -right-[26%] -bottom-[140%] z-0 w-full max-w-none md:right-auto md:bottom-0 md:left-1/2 md:w-[min(1080px,130%)] md:-translate-x-1/2 md:translate-y-[52%]">
      <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,oklch(0.85_0.18_125/0.18),transparent_62%)] blur-3xl"/>
      <Suspense fallback={null}><Globe className="pointer-events-auto"/></Suspense>
    </div>

    <footer className="relative z-10 mt-auto hidden flex-col gap-1 font-mono text-[10.5px] tracking-wider text-white/45 uppercase md:flex">
      <span>19.754° N · 98.405° O</span><span>Copernicus · USGS · INEGI · FIRA</span>
    </footer>
  </aside>;
}

/** Barley mark with the product name, styled with tokens so it needs no global CSS. */
export function Brand({ tone = 'brand', className }: { tone?: 'brand' | 'light'; className?: string }) {
  return <span className={cn('inline-flex items-center gap-2.5', className)}>
    <LogoMark size={30} tone={tone}/>
    <span className="flex flex-col leading-tight">
      <span className={cn('text-[15px] font-semibold tracking-tight', tone === 'light' ? 'text-white' : 'text-foreground')}>AgroCebada</span>
      <span className={cn('text-xs', tone === 'light' ? 'text-white/65' : 'text-muted-foreground')}>Atlas FIRA 2026</span>
    </span>
  </span>;
}
