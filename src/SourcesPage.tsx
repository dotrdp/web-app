// Datos y fuentes: every source with its period, resolution and download.
import { BrainCircuitIcon, CloudSunIcon, DownloadIcon, ExternalLinkIcon, FileSpreadsheetIcon, GlobeIcon, InfoIcon, LandmarkIcon, LeafIcon, SatelliteIcon, ScanSearchIcon, WheatIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Atlas } from './types';
import { fmt } from './lib';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type Source = { title: string; desc: string; tag: string; stat: string; url: string; download?: string; button?: string; icon: LucideIcon };

export function SourcesPage({ atlas }: { atlas: Atlas }) {
  const m = atlas.predictions.metrics;
  const sources: Source[] = [
    { icon: BrainCircuitIcon, title: 'Modelo de rendimiento', desc: `${atlas.predictions.model.name}. ${atlas.predictions.model.blend}. ${atlas.predictions.model.window} Evaluado con validación cruzada de cinco particiones: MAE ${fmt(m.mae_t_ha)}, RMSE ${fmt(m.rmse_t_ha)} t/ha y R² ${fmt(m.r2)}.`, tag: 'Ensamble', stat: '197 estimaciones', url: '/data/predictions.json', download: 'agrocebada-predicciones.json', button: 'Descargar predicciones' },
    { icon: SatelliteIcon, title: 'Sentinel-2 · Vegetación y agua', desc: 'RGB y NDVI a 10 m; MNDWI a 20 m. Mosaicos mensuales de observaciones despejadas sobre los límites completos de Hidalgo, Puebla y Tlaxcala. Calibración por escena y máscara SCL. Los candidatos de agua usan MNDWI ≥ 0, sin diagnóstico ni alertas.', tag: 'Copernicus', stat: '48 meses · 16 teselas', url: '/data/sentinel-index.json', download: 'sentinel-manifiestos.json', button: 'Descargar versiones' },
    { icon: ScanSearchIcon, title: 'Delimitación de parcelas', desc: 'SAM 2.1 tiny preentrenado y fijo. Propuestas sobre la imagen RGB del mes seleccionado, con puntos de inclusión y exclusión. Límites aproximados de 10 m; requieren revisión y guardado explícito. Las correcciones conservan la propuesta y su procedencia.', tag: 'SAM 2.1', stat: 'Propuestas editables', url: 'https://github.com/facebookresearch/sam2' },
    { icon: WheatIcon, title: 'Parcelas del reto', desc: '197 límites originales, superficies y 138 rendimientos registrados de cebada. 59 parcelas conforman el conjunto de predicción.', tag: 'FIRA 2026', stat: '197 parcelas', url: '/data/parcels.geojson', download: 'parcelas-agrocebada.geojson', button: 'Descargar GeoJSON' },
    { icon: LandmarkIcon, title: 'Límites territoriales', desc: 'Hidalgo, Puebla y Tlaxcala. Marco Geoestadístico de INEGI, diciembre de 2025. Límites de 361 municipios reproyectados a WGS 84.', tag: 'INEGI', stat: '3 estados · 361 municipios', url: 'https://www.inegi.org.mx/servicios/catalogounico.html' },
    { icon: CloudSunIcon, title: 'Clima y relieve', desc: 'Precipitación CHIRPS, temperatura mínima y máxima CHIRTS-ERA5, elevación y pendiente INEGI CEM4. Rasters de la entrega original y simbología QGIS.', tag: '2022–2025', stat: '146 capas', url: '/data/layers.json', download: 'inventario-capas.json', button: 'Descargar inventario' },
    { icon: GlobeIcon, title: 'AlphaEarth Foundations', desc: 'Embeddings anuales de Google y Google DeepMind. 64 ejes A00–A63, 10 m. Vista RGB A00/A01/A02. Media ponderada por área después de decuantizar y normalizar.', tag: 'CC BY 4.0', stat: '2017–2025', url: 'https://developers.google.com/earth-engine/guides/aef_on_gcs_readme' },
    { icon: LeafIcon, title: 'NDVI · Landsat Collection 2', desc: 'Landsat 8/9 Level 2, 30 m, USGS vía Microsoft Planetary Computer. Mediana mensual de hasta dos escenas; máscara de nubes, sombras, cirrus, nieve y saturación.', tag: 'USGS', stat: `${Object.keys(atlas.landsat).length} meses`, url: 'https://planetarycomputer.microsoft.com/dataset/landsat-c2-l2' },
    { icon: FileSpreadsheetIcon, title: 'Observaciones del reto', desc: 'Curvas Sentinel-2 y Planet tomadas de los CSV originales. Se excluyen valores vacíos y observaciones con nubosidad mayor a 30%, sin imputar meses faltantes.', tag: 'Dataset original', stat: `${fmt(Object.values(atlas.provenance.satelliteRetained).reduce((a, b) => a + b, 0), 0)} observaciones válidas`, url: '/data/provenance.json', download: 'procedencia-agrocebada.json', button: 'Ver procedencia' },
  ];
  return <div className="@container/main flex min-w-0 flex-col gap-4">
    <p className="text-sm text-muted-foreground">{sources.length} fuentes públicas y del reto. Cada una indica su periodo, su resolución y cómo descargarla.</p>
    <div className="grid grid-cols-1 gap-3 @2xl/main:grid-cols-2">
      {sources.map(({ icon: Icon, ...s }) => <Card key={s.title} className="gap-3 rounded-[20px] border-0 bg-tile py-4 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container"><Icon className="size-4"/></span>
            {s.title}
          </CardTitle>
          <CardAction><Badge variant="outline">{s.tag}</Badge></CardAction>
        </CardHeader>
        <CardContent className="flex-1">
          <CardDescription className="text-pretty leading-relaxed">{s.desc}</CardDescription>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <span className="text-sm font-medium tabular-nums">{s.stat}</span>
          <Button variant="outline" size="sm" className="rounded-full bg-transparent" asChild>
            <a href={s.url} download={s.download} target={s.download ? undefined : '_blank'} rel="noreferrer">
              {s.button || 'Consultar fuente'}
              {s.download ? <DownloadIcon data-icon="inline-end"/> : <ExternalLinkIcon data-icon="inline-end"/>}
            </a>
          </Button>
        </CardFooter>
      </Card>)}
    </div>
    <Alert role="note" className="rounded-[20px] border-0 bg-tile">
      <InfoIcon/>
      <AlertDescription>Los límites son geoestadísticos y no determinan propiedad. AlphaEarth resume años completos; las curvas y el NDVI usan datos mensuales. Las imágenes de clima conservan la simbología del mapa QGIS. Las estimaciones del modelo llevan su intervalo y su error de validación.</AlertDescription>
    </Alert>
  </div>;
}
