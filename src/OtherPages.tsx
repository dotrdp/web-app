import { useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  CloudRainIcon, CloudSunIcon, DownloadIcon, ExternalLinkIcon, FileChartColumnIcon, FileSpreadsheetIcon, FlaskConicalIcon,
  GaugeIcon, GlobeIcon, InfoIcon, LandmarkIcon, LayersIcon, LeafIcon, MapIcon, MapPinnedIcon, OrbitIcon, RulerIcon,
  SatelliteIcon, ScanSearchIcon, SproutIcon, TargetIcon, WheatIcon,
} from 'lucide-react';
import type { Atlas, Parcel, Workspace } from './types';
import { download, EXAMPLE_YIELD, fmt } from './lib';
import { LoadingValue } from './AgentProgress';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { ParcelsTable } from '@/components/pages/parcels-table';

/** The dashboard-01 KPI row: gradient cards, container-query columns. */
export const SECTION_CARDS = 'grid grid-cols-2 gap-3 md:gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card';
/** Page root: establishes the @container/main the cards and table respond to. */
export const PAGE = '@container/main flex min-w-0 flex-col gap-4 md:gap-6';

/** Amber "Ejemplo" marker for values that do not come from a model. */
export function ExampleBadge({ children = 'Ejemplo', className }: { children?: React.ReactNode; className?: string }) {
  return <Badge variant="outline" className={cn('border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300', className)}>{children}</Badge>;
}

function StatCard({ label, value, unit, badge, badgeIcon: BadgeIcon, footer, hint }: {
  label: string; value: React.ReactNode; unit?: string; badge?: React.ReactNode; badgeIcon?: LucideIcon; footer: string; footerIcon?: LucideIcon; hint: string;
}) {
  return <Card className="@container/card">
    <CardHeader>
      <CardDescription className="col-start-1">{label}</CardDescription>
      <CardTitle className="col-start-1 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        {value}{unit && <span className="ml-1 text-base font-normal text-muted-foreground">{unit}</span>}
      </CardTitle>
      {badge != null && <CardAction className="@max-[230px]/card:hidden"><Badge variant="outline">{BadgeIcon && <BadgeIcon/>}{badge}</Badge></CardAction>}
    </CardHeader>
    <CardFooter className="flex-col items-start gap-1.5 border-t-0 bg-transparent pt-0 text-sm">
      <div className="line-clamp-1 font-medium @max-[230px]/card:line-clamp-2">{footer}</div>
      <div className="text-muted-foreground @max-[230px]/card:hidden">{hint}</div>
    </CardFooter>
  </Card>;
}

export function ParcelsPage({ parcels, atlas, workspace, keyDate, onSelect, onAnalyze }: { parcels: Parcel[]; atlas: Atlas; workspace: Workspace; keyDate: string; onSelect: (id: string) => void; onAnalyze: (p: Parcel) => void }) {
  const summary = useMemo(() => {
    const training = parcels.filter(p => p.properties.group === 'training');
    const yields = training.map(p => p.properties.observedYield).filter((y): y is number => y != null);
    const area = parcels.reduce((total, p) => total + (p.properties.area || 0), 0);
    return {
      training: training.length,
      prediction: parcels.filter(p => p.properties.group === 'prediction').length,
      custom: parcels.filter(p => p.properties.group === 'custom').length,
      states: new Set(parcels.map(p => p.properties.state)).size,
      municipalities: new Set(parcels.map(p => `${p.properties.state}/${p.properties.municipality}`)).size,
      meanYield: yields.length ? yields.reduce((a, b) => a + b, 0) / yields.length : null,
      area,
      meanArea: parcels.length ? area / parcels.length : 0,
    };
  }, [parcels]);
  const share = (n: number) => parcels.length ? `${Math.round(n / parcels.length * 100)}%` : '—';

  return <div className={PAGE}>
    <div className={SECTION_CARDS} role="group" aria-label="Resumen de parcelas">
      <StatCard label="Parcelas" value={parcels.length} badge={`${summary.states} estados`} badgeIcon={MapPinnedIcon}
        footer="En tu espacio de trabajo" footerIcon={LayersIcon} hint={`${summary.municipalities} municipios con parcelas`}/>
      <StatCard label="Entrenamiento" value={summary.training} badge={share(summary.training)} badgeIcon={TargetIcon}
        footer="Con rendimiento registrado" footerIcon={WheatIcon} hint={summary.meanYield == null ? 'Sin rendimientos registrados' : `Promedio de ${fmt(summary.meanYield)} t/ha`}/>
      <StatCard label="Predicción" value={summary.prediction} badge={share(summary.prediction)} badgeIcon={FlaskConicalIcon}
        footer="Conjunto a estimar" footerIcon={SproutIcon} hint="El rendimiento llegará con el modelo"/>
      <StatCard label="Superficie" value={fmt(summary.area, 0)} unit="ha"
        footer={summary.custom ? `${summary.custom} trazadas por ti` : 'Superficie declarada'} footerIcon={MapIcon} hint={`Promedio de ${fmt(summary.meanArea, 1)} ha por parcela`} badge={`${fmt(summary.area / 100, 1)} km²`}/>
    </div>

    <ParcelsTable parcels={parcels} atlas={atlas} keyDate={keyDate} onSelect={onSelect} onAnalyze={onAnalyze}/>

    <Card>
      <CardHeader>
        <CardTitle>Tus análisis</CardTitle>
        <CardDescription>Resultados guardados en este espacio de trabajo</CardDescription>
        <CardAction><Badge variant="secondary" className="tabular-nums">{workspace.analyses.length} guardados</Badge></CardAction>
      </CardHeader>
      <CardContent>
        {workspace.analyses.length ? <ItemGroup className="gap-2">{workspace.analyses.slice(0, 12).map(a => <Item key={a.id} variant="outline" size="sm" role="listitem">
          <ItemMedia variant="icon" className="size-8 rounded-md bg-muted"><FileChartColumnIcon/></ItemMedia>
          <ItemContent className="min-w-40">
            <ItemTitle className="truncate">{a.name}</ItemTitle>
            <ItemDescription>{new Date(a.createdAt).toLocaleDateString('es-MX')} · {fmt(a.area)} ha</ItemDescription>
          </ItemContent>
          <ItemActions className="ml-auto gap-3">
            <ExampleBadge/>
            <span className="text-base font-semibold tabular-nums">{fmt(a.yield)} <span className="text-xs font-normal text-muted-foreground">t/ha</span></span>
            <Button variant="outline" size="sm" onClick={() => download(`${a.name}-ejemplo.json`, JSON.stringify(a, null, 2), 'application/json')}>
              <DownloadIcon data-icon="inline-start"/>Descargar
            </Button>
          </ItemActions>
        </Item>)}</ItemGroup> : <Empty className="border py-10">
          <EmptyHeader>
            <EmptyMedia variant="icon"><MapIcon/></EmptyMedia>
            <EmptyTitle>Tu próximo análisis empieza en el mapa.</EmptyTitle>
            <EmptyDescription>Selecciona una parcela y presiona “Analizar parcela”, o usa “Analizar” en la tabla.</EmptyDescription>
          </EmptyHeader>
        </Empty>}
      </CardContent>
    </Card>
  </div>;
}

const METRICS: [string, string, string, string][] = [
  ['RMSE', 'Error cuadrático medio', 't/ha', 'Penaliza los errores grandes'],
  ['MAE', 'Error absoluto medio', 't/ha', 'Desviación típica por parcela'],
  ['R²', 'Varianza explicada', '', 'De 0 a 1 · mayor es mejor'],
  ['Validación', 'Parcela independiente', '', 'Conjunto reservado del reto'],
];
const INPUTS: [string, string, string, LucideIcon][] = [
  ['197', 'Parcelas georreferenciadas', 'Límites originales del reto', MapPinnedIcon],
  ['64', 'Dimensiones AlphaEarth', '2017–2025 · resolución de 10 m', OrbitIcon],
  ['48', 'Meses de clima', 'Precipitación y temperatura · 2022–2025', CloudRainIcon],
  ['138', 'Rendimientos registrados', 'Ciclo de cebada de 2025', WheatIcon],
];

export function ModelsPage() {
  return <div className={PAGE}>
    <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">El espacio para tu modelo.</CardTitle>
        <CardDescription className="max-w-prose text-pretty">
          Las predicciones y sus métricas se incorporarán aquí. Por ahora, las fichas muestran un valor fijo de ejemplo
          de <b className="font-medium text-foreground">{fmt(EXAMPLE_YIELD)} t/ha</b>; no se ha ejecutado ninguna inferencia.
        </CardDescription>
        <CardAction>
          <Badge variant="outline" className="gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-amber-500" aria-hidden="true"/>Modelo pendiente
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Valor de ejemplo</span>
          <span className="text-4xl font-semibold tracking-tight tabular-nums">{fmt(EXAMPLE_YIELD)}<span className="ml-1 text-lg font-normal text-muted-foreground">t/ha</span></span>
        </div>
        <ExampleBadge>Ejemplo · sin inferencia</ExampleBadge>
      </CardContent>
    </Card>

    <div className={SECTION_CARDS} role="group" aria-label="Métricas del modelo">
      {METRICS.map(([title, desc, unit, hint]) => <Card key={title} className="@container/card">
        <CardHeader>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
            <LoadingValue active={false} label={`${title} pendiente del modelo`} unit={unit}/>
          </CardTitle>
          <CardAction><Badge variant="outline"><GaugeIcon/>Pendiente</Badge></CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 border-t-0 bg-transparent pt-0 text-sm">
          <div className="line-clamp-1 font-medium">{desc}</div>
          <div className="text-muted-foreground">{hint}</div>
        </CardFooter>
      </Card>)}
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Datos disponibles para el análisis</CardTitle>
        <CardDescription>Los datos geográficos y satelitales ya están en el atlas</CardDescription>
        <CardAction><Badge variant="secondary">En el atlas</Badge></CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border bg-border @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {INPUTS.map(([value, label, detail, Icon]) => <div key={label} className="flex flex-col gap-1 bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Icon className="size-4"/>{label}</div>
            <div className="text-3xl font-semibold tabular-nums">{value}</div>
            <div className="text-xs text-muted-foreground">{detail}</div>
          </div>)}
        </div>
      </CardContent>
    </Card>

    <Alert role="note">
      <InfoIcon/>
      <AlertDescription>Los valores de ejemplo no deben usarse para decisiones de producción. No se ha ejecutado ningún modelo predictivo en esta aplicación.</AlertDescription>
    </Alert>
  </div>;
}

type Source = { title: string; desc: string; tag: string; stat: string; url: string; download?: string; button?: string; icon: LucideIcon };

export function SourcesPage({ atlas }: { atlas: Atlas }) {
  const sources: Source[] = [
    { icon: SatelliteIcon, title: 'Sentinel-2 · Vegetación y agua', desc: 'RGB y NDVI a 10 m; MNDWI a 20 m. Mosaicos mensuales de observaciones despejadas sobre los límites completos de Hidalgo, Puebla y Tlaxcala. Calibración por escena y máscara SCL. Los candidatos de agua usan MNDWI ≥ 0, sin diagnóstico ni alertas.', tag: 'Copernicus', stat: '48 meses · 16 teselas', url: '/data/sentinel-index.json', download: 'sentinel-manifiestos.json', button: 'Descargar versiones' },
    { icon: ScanSearchIcon, title: 'Delimitación de parcelas', desc: 'SAM 2.1 tiny preentrenado y fijo. Propuestas sobre la imagen RGB del mes seleccionado, con puntos de inclusión y exclusión. Límites aproximados de 10 m; requieren revisión y guardado explícito. Las correcciones conservan la propuesta y su procedencia.', tag: 'SAM 2.1', stat: 'Propuestas editables', url: 'https://github.com/facebookresearch/sam2' },
    { icon: WheatIcon, title: 'Parcelas del reto', desc: '197 límites originales, superficies y 138 rendimientos registrados de cebada. 59 parcelas conforman el conjunto de predicción.', tag: 'FIRA 2026', stat: '197 parcelas', url: '/data/parcels.geojson', download: 'parcelas-agrocebada.geojson', button: 'Descargar GeoJSON' },
    { icon: LandmarkIcon, title: 'Límites territoriales', desc: 'Hidalgo, Puebla y Tlaxcala. Marco Geoestadístico de INEGI, diciembre de 2025. Límites de 361 municipios reproyectados a WGS 84.', tag: 'INEGI', stat: '3 estados · 361 municipios', url: 'https://www.inegi.org.mx/servicios/catalogounico.html' },
    { icon: CloudSunIcon, title: 'Clima y relieve', desc: 'Precipitación CHIRPS, temperatura mínima y máxima CHIRTS-ERA5, elevación y pendiente INEGI CEM4. Rasters de la entrega original y simbología QGIS.', tag: '2022–2025', stat: '146 capas', url: '/data/layers.json', download: 'inventario-capas.json', button: 'Descargar inventario' },
    { icon: GlobeIcon, title: 'AlphaEarth Foundations', desc: 'Embeddings anuales de Google y Google DeepMind. 64 ejes A00–A63, 10 m. Vista RGB A00/A01/A02. Media ponderada por área después de decuantizar y normalizar.', tag: 'CC BY 4.0', stat: '2017–2025', url: 'https://developers.google.com/earth-engine/guides/aef_on_gcs_readme' },
    { icon: LeafIcon, title: 'NDVI · Landsat Collection 2', desc: 'Landsat 8/9 Level 2, 30 m, USGS vía Microsoft Planetary Computer. Mediana mensual de hasta dos escenas; máscara de nubes, sombras, cirrus, nieve y saturación.', tag: 'USGS', stat: `${Object.keys(atlas.landsat).length} meses`, url: 'https://planetarycomputer.microsoft.com/dataset/landsat-c2-l2' },
    { icon: FileSpreadsheetIcon, title: 'Observaciones del reto', desc: 'Curvas Sentinel-2 y Planet tomadas de los CSV originales. Se excluyen valores vacíos y observaciones con nubosidad mayor a 30%, sin imputar meses faltantes.', tag: 'Dataset original', stat: `${fmt(Object.values(atlas.provenance.satelliteRetained).reduce((a, b) => a + b, 0), 0)} observaciones válidas`, url: '/data/provenance.json', download: 'procedencia-agrocebada.json', button: 'Ver procedencia' },
  ];
  return <div className={PAGE}>
    <header className="flex flex-col gap-1">
      <h2 className="text-xl font-semibold tracking-tight">Cada dato tiene una historia.</h2>
      <p className="text-sm text-muted-foreground">{sources.length} fuentes públicas y del reto. Cada una indica su periodo, su resolución y cómo descargarla.</p>
    </header>
    <div className="grid grid-cols-1 gap-4 @3xl/main:grid-cols-2 @[90rem]/main:grid-cols-3">
      {sources.map(({ icon: Icon, ...s }) => <Card key={s.title} className="shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground"><Icon className="size-4"/></span>
            {s.title}
          </CardTitle>
          <CardAction><Badge variant="outline">{s.tag}</Badge></CardAction>
        </CardHeader>
        <CardContent className="flex-1">
          <CardDescription className="text-pretty leading-relaxed">{s.desc}</CardDescription>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <span className="text-sm font-medium tabular-nums">{s.stat}</span>
          <Button variant="outline" size="sm" asChild>
            <a href={s.url} download={s.download} target={s.download ? undefined : '_blank'} rel="noreferrer">
              {s.button || 'Consultar fuente'}
              {s.download ? <DownloadIcon data-icon="inline-end"/> : <ExternalLinkIcon data-icon="inline-end"/>}
            </a>
          </Button>
        </CardFooter>
      </Card>)}
    </div>
    <Alert role="note">
      <InfoIcon/>
      <AlertDescription>Los límites son geoestadísticos y no determinan propiedad. AlphaEarth resume años completos; las curvas y el NDVI usan datos mensuales. Las imágenes de clima conservan la simbología del mapa QGIS. Los rendimientos marcados “Ejemplo” son placeholders.</AlertDescription>
    </Alert>
  </div>;
}
