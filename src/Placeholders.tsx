import { CircleAlertIcon, RotateCwIcon } from 'lucide-react';
import { LoadingDots, LoadingState, LoadingValue } from './AgentProgress';
import type { View } from './types';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PAGE, SECTION_CARDS } from './OtherPages';
import './placeholders.css';

const LABELS: Record<View, string> = { map: 'Mapa', parcels: 'Mis parcelas', technical: 'Análisis técnico', models: 'Modelo de ejemplo', sources: 'Datos y fuentes', admin: 'Administración' };

/** Table body rows whose cells hold a pending value ("—" + unit + dots). `columns` lists each cell's unit. */
export function PlaceholderTableRows({ columns, rows = 4 }: { columns: string[]; rows?: number }) {
  return <>{Array.from({ length: rows }, (_, row) => <TableRow className="placeholder-table-row hover:bg-transparent" key={row}>
    {columns.map((unit, column) => <TableCell key={column} className="h-12 first:pl-4 last:pr-4"><LoadingValue label="Valor pendiente" unit={unit}/></TableCell>)}
  </TableRow>)}</>;
}

/** Chart-sized block: hairline gridlines and a pending value in the middle. */
export function ChartPlaceholder({ label, unit = '' }: { label: string; unit?: string }) {
  return <div className="placeholder-chart relative flex h-56 flex-col justify-between py-3 pr-2 pl-10">
    {[0, 1, 2, 3].map(i => <span key={i} className={cn('block w-full border-t', i < 3 && 'border-dashed')}/>)}
    <div className="absolute inset-0 flex items-center justify-center">
      <LoadingValue className="rounded-lg border bg-card px-3 py-1.5 text-lg shadow-xs" label={`${label} pendiente`} unit={unit}/>
    </div>
  </div>;
}

/** dashboard-01 KPI card with its figure pending. */
function StatPlaceholder({ label, unit = '' }: { label: string; unit?: string }) {
  return <Card className="@container/card">
    <CardHeader>
      <CardDescription>{label}</CardDescription>
      <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl"><LoadingValue label={`${label} pendiente`} unit={unit}/></CardTitle>
      <CardAction><Skeleton className="h-5 w-16 rounded-full"/></CardAction>
    </CardHeader>
    <CardFooter className="flex-col items-start gap-2 border-t-0 bg-transparent pt-0">
      <Skeleton className="h-4 w-40"/>
      <Skeleton className="h-4 w-28"/>
    </CardFooter>
  </Card>;
}

function StatRow({ values }: { values: [string, string][] }) {
  return <div className={SECTION_CARDS}>{values.map(([label, unit]) => <StatPlaceholder key={label} label={label} unit={unit}/>)}</div>;
}

function CardHeaderPlaceholder({ title, badge = true }: { title: string; badge?: boolean }) {
  return <CardHeader>
    <CardTitle>{title}</CardTitle>
    <CardDescription><Skeleton className="mt-1 h-4 w-56 max-w-full"/></CardDescription>
    {badge && <CardAction><Skeleton className="h-5 w-20 rounded-full"/></CardAction>}
  </CardHeader>;
}

function TableBlock({ columns, units }: { columns: string[]; units?: string[] }) {
  return <div className="overflow-hidden rounded-lg border">
    <Table>
      <TableHeader className="bg-muted">
        <TableRow className="hover:bg-transparent">{columns.map(column => <TableHead key={column} className="first:pl-4 last:pr-4">{column}</TableHead>)}</TableRow>
      </TableHeader>
      <TableBody><PlaceholderTableRows columns={units || columns.map(() => '')}/></TableBody>
    </Table>
  </div>;
}

function TableCardPlaceholder({ title, columns }: { title: string; columns: string[] }) {
  return <Card>
    <CardHeaderPlaceholder title={title}/>
    <CardContent><TableBlock columns={columns}/></CardContent>
  </Card>;
}

function ParcelsPlaceholder() {
  return <>
    <StatRow values={[['Parcelas', ''], ['Entrenamiento', ''], ['Predicción', ''], ['Superficie', 'ha']]}/>
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 @3xl/main:flex-row @3xl/main:items-center @3xl/main:justify-between">
        <div className="flex flex-col gap-3 @lg/main:flex-row @lg/main:items-center">
          <Skeleton className="h-7 w-full rounded-lg @lg/main:w-48 @5xl/main:w-96"/>
          <Skeleton className="h-7 w-full rounded-lg @lg/main:w-64"/>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-28 rounded-lg"/>
          <Skeleton className="ml-auto h-7 w-32 rounded-lg @3xl/main:ml-0"/>
        </div>
      </div>
      <TableBlock columns={['Parcela', 'Ubicación', 'Superficie', 'Conjunto', 'Rendimiento', 'NDVI · Landsat']} units={['', '', 'ha', '', 't/ha', '']}/>
      <div className="flex items-center justify-between gap-4 px-1 @3xl/main:px-4">
        <Skeleton className="hidden h-4 w-56 @3xl/main:block"/>
        <div className="flex w-full items-center gap-2 @3xl/main:w-fit">
          <Skeleton className="h-4 w-24"/>
          <Skeleton className="ml-auto size-8 rounded-lg"/>
          <Skeleton className="size-8 rounded-lg"/>
        </div>
      </div>
    </div>
    <Card>
      <CardHeaderPlaceholder title="Tus análisis"/>
      <CardContent className="flex flex-col gap-2">
        {[0, 1].map(i => <div key={i} className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
          <Skeleton className="size-8 rounded-md"/>
          <div className="flex flex-1 flex-col gap-1.5"><Skeleton className="h-4 w-40 max-w-full"/><Skeleton className="h-3 w-24"/></div>
          <LoadingValue label="Rendimiento pendiente" unit="t/ha"/>
        </div>)}
      </CardContent>
    </Card>
  </>;
}

function TechnicalPlaceholder() {
  return <>
    <StatRow values={[['NDVI', ''], ['Precipitación', 'mm'], ['Temperatura máx.', '°C'], ['Relieve', '°']]}/>
    <div className="grid grid-cols-1 gap-4 @4xl/main:grid-cols-2">
      {[['Evolución de la vegetación', 'NDVI'], ['Precipitación mensual', 'mm'], ['Rango de temperatura', '°C'], ['Resultado del modelo', 't/ha']].map(([title, unit]) => <Card key={title}>
        <CardHeaderPlaceholder title={title} badge={false}/>
        <CardContent><ChartPlaceholder label={title} unit={unit}/></CardContent>
      </Card>)}
    </div>
    <Card>
      <CardHeaderPlaceholder title="AlphaEarth Foundations" badge={false}/>
      <CardContent>
        <div className="grid grid-cols-8 gap-1 @3xl/main:grid-cols-16">{Array.from({ length: 64 }, (_, i) => <Skeleton key={i} className="aspect-[1.15] rounded-sm"/>)}</div>
      </CardContent>
    </Card>
  </>;
}

function ModelsPlaceholder() {
  return <>
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">El espacio para tu modelo.</CardTitle>
        <CardDescription className="flex flex-col gap-2 pt-1"><Skeleton className="h-4 w-full max-w-md"/><Skeleton className="h-4 w-2/3 max-w-xs"/></CardDescription>
        <CardAction><Skeleton className="h-5 w-32 rounded-full"/></CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">Valor de ejemplo</span>
        <LoadingValue className="text-4xl font-semibold" label="Rendimiento de ejemplo pendiente" unit="t/ha"/>
      </CardContent>
    </Card>
    <StatRow values={[['RMSE', 't/ha'], ['MAE', 't/ha'], ['R²', ''], ['Validación', '']]}/>
    <Card>
      <CardHeaderPlaceholder title="Datos disponibles para el análisis"/>
      <CardContent>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border bg-border @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {['Parcelas georreferenciadas', 'Dimensiones AlphaEarth', 'Meses de clima', 'Rendimientos registrados'].map(label => <div key={label} className="flex flex-col gap-1.5 bg-card p-4">
            <span className="text-sm text-muted-foreground">{label}</span>
            <LoadingValue className="text-3xl font-semibold" label={`${label} pendiente`}/>
            <Skeleton className="h-3 w-32"/>
          </div>)}
        </div>
      </CardContent>
    </Card>
  </>;
}

function SourcesPlaceholder() {
  return <>
    <header className="flex flex-col gap-1.5">
      <h2 className="text-xl font-semibold tracking-tight">Cada dato tiene una historia.</h2>
      <Skeleton className="h-4 w-full max-w-sm"/>
    </header>
    <div className="grid grid-cols-1 gap-4 @3xl/main:grid-cols-2 @[90rem]/main:grid-cols-3">
      {['Sentinel-2 · Vegetación y agua', 'Delimitación de parcelas', 'Parcelas del reto', 'Límites territoriales', 'Clima y relieve', 'AlphaEarth Foundations', 'NDVI · Landsat Collection 2', 'Observaciones del reto'].map(title => <Card key={title} className="shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5"><Skeleton className="size-8 shrink-0 rounded-lg"/>{title}</CardTitle>
          <CardAction><Skeleton className="h-5 w-20 rounded-full"/></CardAction>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-full"/><Skeleton className="h-4 w-full"/><Skeleton className="h-4 w-3/5"/>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <LoadingValue className="text-sm" label="Inventario de la fuente pendiente"/>
          <Skeleton className="h-7 w-36 rounded-lg"/>
        </CardFooter>
      </Card>)}
    </div>
  </>;
}

function AdminPlaceholder() {
  return <>
    <TableCardPlaceholder title="Usuarios del espacio" columns={['Usuario', 'Nombre', 'Rol', 'Activo']}/>
    <TableCardPlaceholder title="Asignaciones de parcelas" columns={['Parcela', 'Productor', 'Técnico']}/>
  </>;
}

export default function PagePlaceholder({ view, error = '', onRetry, waitingForSelection = false }: { view: View; error?: string; onRetry?: () => void; waitingForSelection?: boolean }) {
  const phase = error ? 'error' : waitingForSelection ? 'waiting' : 'loading';
  return <section
    className={cn('page-placeholder', PAGE, phase !== 'loading' && 'stopped')}
    data-phase={phase}
    aria-label={waitingForSelection ? `Vista previa de ${LABELS[view]}` : `Preparando ${LABELS[view]}`}
  >
    {error ? <Alert>
      <CircleAlertIcon/>
      <AlertTitle>{error}</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-2.5">
        <p className="mb-0!">La vista conserva su estructura mientras tanto. Revisa tu conexión y vuelve a cargarla.</p>
        {onRetry && <Button variant="outline" size="sm" onClick={onRetry}><RotateCwIcon data-icon="inline-start"/>Volver a intentar</Button>}
      </AlertDescription>
    </Alert> : waitingForSelection ? <div className="placeholder-waiting flex w-fit max-w-full items-center gap-2.5 rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground shadow-xs">
      <LoadingDots/><span>En espera de seleccionar una parcela</span>
    </div> : <LoadingState className="placeholder-status rounded-lg border bg-card px-3 py-2 shadow-xs" label={`Cargando ${LABELS[view]}…`}/>}
    <div className="page-placeholder-content flex min-w-0 flex-col gap-4 md:gap-6" aria-hidden="true">
      {view === 'parcels' && <ParcelsPlaceholder/>}
      {view === 'technical' && <TechnicalPlaceholder/>}
      {view === 'models' && <ModelsPlaceholder/>}
      {view === 'sources' && <SourcesPlaceholder/>}
      {view === 'admin' && <AdminPlaceholder/>}
    </div>
  </section>;
}
