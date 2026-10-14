import { useState } from 'react';
import type { ReactNode } from 'react';
import { Download, ExternalLink, Info, Map as MapIcon, MapPin, Minus, Satellite, TrendingDown, TrendingUp } from 'lucide-react';
import type { Atlas, Parcel } from './types';
import { dateKey, download, EXAMPLE_YIELD, fmt, MONTH_NAMES } from './lib';
import { CHART_COLORS, EmbeddingChart, LineChart, RainChart } from './Charts';
import { LoadingValue } from './AgentProgress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const GROUP_LABELS = { training: 'Entrenamiento', prediction: 'Predicción', custom: 'Mi parcela' } as const;
const SENSORS = ['Landsat C2', 'Sentinel-2', 'Planet'] as const;
type Sensor = typeof SENSORS[number];

/** CardTitle exposed as a real heading so the page outline reads well. */
function Heading({ children, className }: { children: ReactNode; className?: string }) {
  return <CardTitle role="heading" aria-level={2} className={className}>{children}</CardTitle>;
}

function Kpi({ label, value, unit, badge, trend, headline, foot }: { label: string; value: string; unit?: string; badge?: ReactNode; trend?: 'up' | 'down' | 'flat'; headline: ReactNode; foot: string }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : trend === 'flat' ? Minus : null;
  return <Card className="@container/card">
    <CardHeader>
      <CardDescription>{label}</CardDescription>
      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        {value}{unit && value !== '—' && <span className="ml-1 text-base font-normal text-muted-foreground">{unit}</span>}
      </CardTitle>
      {badge && <CardAction><Badge variant="outline">{TrendIcon && <TrendIcon/>}{badge}</Badge></CardAction>}
    </CardHeader>
    <CardFooter className="mt-auto flex-col items-start gap-1.5 border-t-0 bg-transparent pt-0 text-sm">
      <div className="line-clamp-1 flex items-center gap-2 font-medium">{headline}</div>
      <div className="text-muted-foreground">{foot}</div>
    </CardFooter>
  </Card>;
}

function SensorPicker({ sensor, onChange }: { sensor: Sensor; onChange: (sensor: Sensor) => void }) {
  return <>
    <ToggleGroup type="single" value={sensor} onValueChange={v => v && onChange(v as Sensor)} variant="outline" spacing={0} className="hidden *:data-[slot=toggle-group-item]:px-3! @[600px]/card:flex" aria-label="Sensor de NDVI">
      {SENSORS.map(s => <ToggleGroupItem key={s} value={s}>{s}</ToggleGroupItem>)}
    </ToggleGroup>
    <Select value={sensor} onValueChange={v => onChange(v as Sensor)}>
      <SelectTrigger size="sm" className="w-36 @[600px]/card:hidden" aria-label="Sensor de NDVI (lista)"><SelectValue/></SelectTrigger>
      <SelectContent align="end">{SENSORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
    </Select>
  </>;
}

export default function TechnicalPage({ atlas, parcels, selected, year, month, onSelect, onMap }: { atlas: Atlas; parcels: Parcel[]; selected: Parcel | null; year: number; month: number; onSelect: (id: string) => void; onMap: () => void }) {
  const [sensor, setSensor] = useState<Sensor>('Landsat C2');
  const parcel = selected || parcels[0], p = parcel?.properties;
  if (!parcel) return null;
  const details = atlas.details[p.id], key = dateKey(year, month);
  const weather = details?.climate[key];
  const series = (pick: (m: number) => number | null | undefined) => Array.from({ length: 12 }, (_, m) => pick(m) ?? null);
  const vegetation = series(m => sensor === 'Landsat C2' ? atlas.landsat[dateKey(year, m)]?.parcels[p.id]?.mean : details?.ndvi[sensor]?.[dateKey(year, m)]?.mean);
  const rain = series(m => details?.climate[dateKey(year, m)]?.precipitation);
  const tmax = series(m => details?.climate[dateKey(year, m)]?.tmax);
  const tmin = series(m => details?.climate[dateKey(year, m)]?.tmin);
  const emb = details?.embedding[String(year)];
  const scenes = atlas.landsat[key]?.scenes || [];

  const ndvi = vegetation[month], previous = month > 0 ? vegetation[month - 1] : null;
  const delta = ndvi != null && previous != null ? ndvi - previous : null;
  const trend = delta == null ? undefined : Math.abs(delta) < 0.005 ? 'flat' : delta > 0 ? 'up' : 'down';
  const rainTotal = rain.reduce<number>((sum, v) => sum + (v ?? 0), 0);
  const rainShare = weather?.precipitation != null && rainTotal > 0 ? weather.precipitation / rainTotal * 100 : null;
  const observedMonths = vegetation.filter(v => v != null).length;

  return <div className="@container/main flex w-full min-w-0 flex-col gap-4 md:gap-6">
    <section className="flex flex-col gap-3 @3xl/main:flex-row @3xl/main:items-end @3xl/main:justify-between" aria-label="Parcela seleccionada">
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-xl font-semibold tracking-tight">{p.name || p.id}</h2>
          <Badge variant={p.group === 'custom' ? 'default' : 'secondary'}>{GROUP_LABELS[p.group]}</Badge>
          {p.edited && <Badge variant="outline">Límites ajustados</Badge>}
        </div>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground"><MapPin className="size-3.5"/>{p.municipality} · {p.state}<span aria-hidden="true">·</span>{fmt(p.area)} ha<span aria-hidden="true">·</span>Cebada</p>
      </div>
      <div className="flex items-center gap-2">
        <Select value={p.id} onValueChange={onSelect}>
          <SelectTrigger className="min-w-0 flex-1 sm:w-64 sm:flex-none" aria-label="Parcela de análisis"><SelectValue/></SelectTrigger>
          <SelectContent position="popper" align="end" className="max-h-80">{parcels.map(f => <SelectItem key={f.properties.id} value={f.properties.id}>{f.properties.name || f.properties.id} · {f.properties.municipality}</SelectItem>)}</SelectContent>
        </Select>
        <Button variant="outline" onClick={onMap}><MapIcon data-icon="inline-start"/>Ver en el mapa</Button>
      </div>
    </section>

    {p.edited && <Alert><Info/><AlertDescription className="text-pretty">Los datos ambientales corresponden a los límites originales del dataset. Tus límites ajustados se conservan por separado.</AlertDescription></Alert>}

    <div role="group" aria-label="Resumen del mes" className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Kpi label={`NDVI · ${sensor}`} value={fmt(ndvi, 3)} trend={trend} badge={delta != null ? `${delta > 0 ? '+' : ''}${fmt(delta, 3)}` : undefined}
        headline={delta == null ? `${MONTH_NAMES[month]} ${year}` : <>{trend === 'up' ? 'Sube' : trend === 'down' ? 'Baja' : 'Estable'} frente a {MONTH_NAMES[month - 1].toLowerCase()}{trend === 'up' ? <TrendingUp className="size-4"/> : trend === 'down' ? <TrendingDown className="size-4"/> : null}</>}
        foot={`${MONTH_NAMES[month]} ${year} · ${observedMonths} meses con datos`}/>
      <Kpi label="Precipitación" value={fmt(weather?.precipitation, 1)} unit="mm" badge={rainShare != null ? `${fmt(rainShare, 0)}% del año` : undefined}
        headline={`Acumulado ${year}: ${fmt(rainTotal, 0)} mm`} foot="CHIRPS · mensual"/>
      <Kpi label="Temperatura máx." value={fmt(weather?.tmax, 1)} unit="°C" badge={weather?.tmin != null ? `mín ${fmt(weather.tmin, 1)} °C` : undefined}
        headline={weather?.tmax != null && weather?.tmin != null ? `Amplitud térmica ${fmt(weather.tmax - weather.tmin, 1)} °C` : 'Sin amplitud térmica'} foot="CHIRTS-ERA5 · mensual"/>
      <Kpi label="Pendiente" value={fmt(p.slope, 1)} unit="°" badge={p.elevation != null ? `${fmt(p.elevation, 0)} m` : undefined}
        headline={p.elevation != null ? `${fmt(p.elevation, 0)} m s.n.m.` : 'Sin elevación'} foot="Relieve · INEGI"/>
    </div>

    <Card className="@container/card">
      <CardHeader>
        <Heading>Evolución de la vegetación</Heading>
        <CardDescription>
          <span className="hidden @[540px]/card:inline">NDVI promedio mensual de la parcela · {sensor} · {year}</span>
          <span className="@[540px]/card:hidden">NDVI mensual · {year}</span>
        </CardDescription>
        <CardAction><SensorPicker sensor={sensor} onChange={setSensor}/></CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-4">
        <LineChart values={vegetation} label={`NDVI de ${sensor}`} color={CHART_COLORS.vegetation} minimum={vegetation.some(v => v != null && v < 0) ? -.25 : 0} maximum={1}/>
      </CardContent>
      <CardFooter className="gap-2 text-xs text-muted-foreground">
        <Satellite className="size-3.5 shrink-0"/>
        {sensor === 'Landsat C2' ? 'Mediana de hasta 2 escenas · píxeles válidos QA · 30 m' : 'Observaciones originales del reto · nubosidad ≤ 30% · media mensual'}
      </CardFooter>
    </Card>

    <div className="grid grid-cols-1 gap-4 md:gap-6 @4xl/main:grid-cols-2">
      <Card className="@container/card">
        <CardHeader>
          <Heading>Precipitación mensual</Heading>
          <CardDescription>CHIRPS · milímetros por mes · {year}</CardDescription>
          <CardAction><Badge variant="outline">{MONTH_NAMES[month]}</Badge></CardAction>
        </CardHeader>
        <CardContent className="px-2 sm:px-4"><RainChart values={rain} month={month} className="h-[220px]"/></CardContent>
        <CardFooter className="text-xs text-muted-foreground">Media espacial de los píxeles dentro de la parcela · {MONTH_NAMES[month]} resaltado.</CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <Heading>Rango de temperatura</Heading>
          <CardDescription>CHIRTS-ERA5 · medias mensuales en °C · {year}</CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-4">
          <LineChart values={tmax} comparison={tmin} label="Temperatura máxima y mínima" unit="°C" minimum={0} maximum={40} color={CHART_COLORS.warm} comparisonColor={CHART_COLORS.cool} seriesLabels={['Máxima', 'Mínima']} className="h-[220px]"/>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">Máxima en línea continua · mínima en línea discontinua.</CardFooter>
      </Card>
    </div>

    <div className="grid grid-cols-1 gap-4 md:gap-6 @5xl/main:grid-cols-3">
      <Card className="@container/card @5xl/main:col-span-2">
        <CardHeader>
          <Heading>AlphaEarth Foundations</Heading>
          <CardDescription>Embedding anual {year} · 64 dimensiones · píxeles nativos de 10 m</CardDescription>
          <CardAction>
            <Button size="sm" variant="outline" disabled={!emb} onClick={() => download(`${p.id}-alphaearth-${year}.json`, JSON.stringify({ parcel: p.id, year, axes: emb.values, aggregation: 'Area-weighted dequantized pixel mean, normalized to unit length', source: 'Google / Google DeepMind; CC BY 4.0' }, null, 2), 'application/json')}>
              <Download data-icon="inline-start"/><span className="hidden @[420px]/card:inline">Descargar vector</span><span className="sr-only @[420px]/card:hidden">Descargar vector</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent><EmbeddingChart values={emb?.values}/></CardContent>
        <CardFooter className="text-xs leading-relaxed text-muted-foreground">Cada celda representa un eje del vector, sin unidad física. Estos datos resumen un año completo y no cambian al seleccionar un mes. Los colores RGB del mapa usan A00, A01 y A02; no representan salud del cultivo.</CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <Heading>Resultado del modelo</Heading>
          <CardDescription>Espacio reservado para la predicción</CardDescription>
          <CardAction><Badge variant="outline" className="border-chart-5/50 bg-chart-5/10 text-foreground">Ejemplo</Badge></CardAction>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-5">
          <div className="flex flex-col gap-1 rounded-lg border border-dashed bg-muted/40 p-4">
            <span className="text-xs text-muted-foreground">Rendimiento de ejemplo</span>
            <span className="flex items-baseline gap-1.5"><span className="text-4xl font-semibold tracking-tight tabular-nums">{fmt(EXAMPLE_YIELD)}</span><span className="text-sm text-muted-foreground">t/ha</span></span>
            <p className="text-sm text-muted-foreground">Valor fijo de ejemplo, sin inferencia.</p>
          </div>
          <dl className="grid grid-cols-3 divide-x rounded-lg border">
            {['RMSE', 'MAE', 'R²'].map(label => <div key={label} className="flex flex-col gap-1 px-3 py-2.5">
              <dt className="text-xs text-muted-foreground">{label}{label !== 'R²' && <span className="hidden @[300px]/card:inline"> · t/ha</span>}</dt>
              <dd className="text-lg"><LoadingValue active={false} label={`${label} pendiente del modelo`} className="min-w-0"/></dd>
            </div>)}
          </dl>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">Entradas disponibles para esta parcela</span>
            <ul className="flex flex-col divide-y rounded-lg border text-sm">
              {[
                ['NDVI', `${observedMonths} de 12 meses`, observedMonths > 0],
                ['Clima', `${rain.filter(v => v != null).length} de 12 meses`, rain.some(v => v != null)],
                ['Relieve', p.slope != null ? 'Elevación y pendiente' : 'Sin datos', p.slope != null],
                ['AlphaEarth', emb ? '64 dimensiones' : 'Sin embedding', !!emb],
              ].map(([label, value, ok]) => <li key={label as string} className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="flex items-center gap-2"><span className={`size-1.5 rounded-full ${ok ? 'bg-chart-1' : 'bg-muted-foreground/40'}`} aria-hidden="true"/>{label}</span>
                <span className="text-muted-foreground tabular-nums">{value}</span>
              </li>)}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">Las métricas y explicaciones se mostrarán al conectar el modelo.</CardFooter>
      </Card>
    </div>

    <Card className="@container/card">
      <CardHeader>
        <Heading>Escenas Landsat del mes</Heading>
        <CardDescription>USGS · Collection 2 · Level 2 · {MONTH_NAMES[month]} {year}</CardDescription>
        <CardAction><Badge variant="secondary">{scenes.length} {scenes.length === 1 ? 'escena' : 'escenas'}</Badge></CardAction>
      </CardHeader>
      <CardContent className={scenes.length ? 'px-0' : undefined}>
        {scenes.length ? <Table aria-label="Escenas Landsat del mes">
          <TableHeader className="bg-muted/50">
            <TableRow><TableHead className="pl-4">Escena</TableHead><TableHead className="hidden @md/card:table-cell">Fecha</TableHead><TableHead className="text-right">Nubosidad</TableHead><TableHead className="w-12 pr-4"><span className="sr-only">Metadatos</span></TableHead></TableRow>
          </TableHeader>
          <TableBody>{scenes.map(s => <TableRow key={s.id}>
            <TableCell className="pl-4"><div className="flex flex-col gap-0.5"><span className="font-mono text-xs">{s.id}</span><span className="text-xs text-muted-foreground tabular-nums @md/card:hidden">{s.date}</span></div></TableCell>
            <TableCell className="hidden tabular-nums @md/card:table-cell">{s.date}</TableCell>
            <TableCell className="text-right tabular-nums">{fmt(s.cloudCover, 1)}%</TableCell>
            <TableCell className="pr-4 text-right">
              <Button asChild variant="ghost" size="icon-sm"><a href={s.stacUrl} target="_blank" rel="noreferrer" aria-label={`Metadatos de ${s.id}`}><ExternalLink/></a></Button>
            </TableCell>
          </TableRow>)}</TableBody>
        </Table> : <Empty className="border border-dashed py-8">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Satellite/></EmptyMedia>
            <EmptyTitle>Sin escenas este mes</EmptyTitle>
            <EmptyDescription>No hay escenas locales disponibles en {MONTH_NAMES[month].toLowerCase()} de {year}.</EmptyDescription>
          </EmptyHeader>
        </Empty>}
      </CardContent>
      <CardFooter className="font-mono text-[11px] leading-relaxed text-muted-foreground">NDVI = (NIR − rojo) / (NIR + rojo). Reflectancia: DN × 0.0000275 − 0.2. Máscara de nubes, sombras, nieve, cirrus y saturación.</CardFooter>
    </Card>
  </div>;
}
