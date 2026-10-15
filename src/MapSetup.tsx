import { CloudOff, RotateCcw, ShieldCheck, TriangleAlert } from 'lucide-react';
import { LogoMark } from './Logo';
import { AgentSteps, LoadingState, LoadingValue } from './AgentProgress';
import type { AgentStep } from './AgentProgress';
import { Brand } from './Login';
import Particles from './Particles';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export type SetupTaskId = 'parcels' | 'details' | 'layers' | 'landsat' | 'provenance' | 'model' | 'workspace' | 'map';
export type SetupTasks = Record<SetupTaskId, AgentStep>;
export function createSetupTasks(started = false): SetupTasks {
  const names: Record<SetupTaskId, string> = { parcels: 'Cargar parcelas', details: 'Observaciones por parcela', layers: 'Preparar capas del territorio', landsat: 'Serie histórica Landsat', provenance: 'Procedencia de los datos', model: 'Estimaciones del modelo', workspace: 'Recuperar tus terrenos', map: 'Abrir el mapa' };
  return Object.fromEntries(Object.entries(names).map(([id, name]) => [id, { id, name, status: started && id !== 'map' ? 'running' : 'pending', ...(started && id !== 'map' ? { startedAt: performance.now() } : {}) }])) as SetupTasks;
}

interface MapSetupProps { tasks: SetupTasks; error: string; onRetry: () => void; className?: string }

export default function MapSetup({ tasks, error, onRetry, className }: MapSetupProps) {
  const children = [tasks.details, tasks.landsat, tasks.provenance, tasks.model];
  const status = children.some(c => c.status === 'error') ? 'error' : children.every(c => c.status === 'success') ? 'success' : children.some(c => c.status === 'running') ? 'running' : 'pending';
  const observations: AgentStep = { id: 'observations', name: 'Preparar observaciones', status, children, detail: status === 'success' ? 'Series históricas y fuentes disponibles' : '4 fuentes en paralelo', startedAt: children.some(c => c.startedAt !== undefined) ? Math.min(...children.map(c => c.startedAt ?? Infinity)) : undefined, completedAt: children.every(c => c.completedAt !== undefined) ? Math.max(...children.map(c => c.completedAt!)) : undefined };
  const steps = [tasks.parcels, observations, tasks.layers, tasks.workspace, { ...tasks.map, detail: tasks.map.status === 'pending' ? 'Esperando los datos del atlas' : 'Vista de julio de 2025 · mapa interactivo' }];
  const ready = steps.filter(s => s.status === 'success').length;
  const percent = Math.round((ready / steps.length) * 100);

  return <Card data-slot="map-setup" data-error={!!error || undefined} aria-labelledby="map-setup-title" role="region"
    className={cn('w-full max-w-md gap-0 rounded-[28px] border-0 bg-frame py-0 shadow-2xl shadow-black/10', className)}>
    <CardHeader className="gap-0 border-b border-tile p-5 pb-5! sm:p-6 sm:pb-6!">
      <div className="flex items-start gap-4">
        {error ? <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-destructive/10 text-destructive"><CloudOff className="size-5"/></span> : <LogoMark size={44} grow className="shrink-0"/>}
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-medium text-brand">Atlas AgroCebada</span>
          <CardTitle className="text-lg leading-tight font-semibold tracking-tight"><h1 id="map-setup-title">{error ? 'Falta una fuente del mapa' : 'Preparando tu mapa'}</h1></CardTitle>
          <CardDescription>Hidalgo, Puebla y Tlaxcala, en una sola vista.</CardDescription>
        </div>
      </div>
    </CardHeader>

    <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3 text-sm">
          {error
            ? <span role="status" className="flex items-center gap-2 font-medium text-destructive"><TriangleAlert className="size-4"/>La carga no pudo completarse</span>
            : <LoadingState label="Conectando el territorio" startedAt={tasks.parcels.startedAt}/>}
          <span className="font-mono text-sm font-medium tabular-nums" aria-hidden="true">{ready}<span className="text-muted-foreground">/{steps.length}</span></span>
        </div>
        <Progress value={percent} aria-label="Progreso de la preparación" aria-valuetext={`${ready} de ${steps.length} pasos`}
          className={cn('h-1.5', error && '*:data-[slot=progress-indicator]:bg-destructive', !error && '*:data-[slot=progress-indicator]:bg-brand')}/>
      </div>

      <div className="map-setup-values grid grid-cols-3 divide-x divide-frame rounded-2xl bg-tile" aria-hidden="true">
        {['Parcelas', 'Observaciones', 'Capas'].map(label => <div key={label} className="flex min-w-0 flex-col gap-1 px-2.5 py-2.5 sm:px-3">
          <span className="truncate text-[11px] text-muted-foreground sm:text-xs">{label}</span>
          <LoadingValue className="text-base font-medium text-foreground" label={`${label} pendientes`} active={!error}/>
        </div>)}
      </div>

      {error && <Alert variant="destructive" className="has-data-[slot=alert-action]:pr-2.5">
        <TriangleAlert/>
        <AlertTitle>{error}</AlertTitle>
        <AlertDescription className="flex flex-col items-start gap-3">
          Comprueba tu conexión y vuelve a intentarlo; el resto del atlas ya está listo.
          <Button size="sm" onClick={onRetry}><RotateCcw data-icon="inline-start"/>Volver a intentar</Button>
        </AlertDescription>
      </Alert>}

      <Separator/>
      <AgentSteps steps={steps} label="Preparación del mapa"/>
      {!error && <span className="progress-sr-only" role="status">{ready} de {steps.length} pasos completados.</span>}
    </CardContent>

    <CardFooter className="gap-2 px-5 py-3.5 text-xs text-muted-foreground sm:px-6">
      <ShieldCheck className="size-3.5 shrink-0"/>Las 197 parcelas y sus estimaciones se preparan para esta sesión.
    </CardFooter>
  </Card>;
}

/** Full-screen variant: brand bar, soft particles and the setup card centred. */
export function MapSetupScreen(props: MapSetupProps) {
  return <main className="relative isolate flex min-h-svh flex-col overflow-hidden bg-frame p-2.5">
    <div className="relative isolate flex flex-1 flex-col overflow-hidden rounded-[22px] bg-tile">
    <Particles className="-z-10 opacity-70" color="#3f8f63" quantity={180} size={1.2} opacity={.28} drift={.18}/>
    <header className="flex h-14 shrink-0 items-center px-4 sm:px-6"><Brand/></header>
    <div className="flex flex-1 items-center justify-center p-4 sm:p-8"><MapSetup {...props}/></div>
    </div>
  </main>;
}
