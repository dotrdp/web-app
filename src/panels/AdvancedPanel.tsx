// Phase 3 · Indicadores avanzados. Everything technical lives here and only here:
// the parcel's monthly series and AlphaEarth vector, the model's diagnostics
// (folds, residuals, observed vs estimated, largest errors) and the scientific
// layer controls (thresholds, historical sensors, climate, terrain, provenance).
import { useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Download, FlaskConical, X } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ReferenceLine, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import TechnicalPage from '../TechnicalPage';
import { download, fmt } from '../lib';
import type { Atlas, ImageryManifest, LayerSettings, MapFilters, MapMode, Parcel } from '../types';

export type AdvancedTab = 'parcela' | 'modelo' | 'capas';
const TABS: [AdvancedTab, string][] = [['parcela', 'Parcela'], ['modelo', 'Diagnóstico del modelo'], ['capas', 'Capas técnicas']];

export default function AdvancedPanel({ atlas, parcels, selected, year, month, keyDate, mode, filters, layers, manifest, tab, onTab, onSelect, onLocate, onMode, setFilters, setLayers, onClose }: {
  atlas: Atlas; parcels: Parcel[]; selected: Parcel | null; year: number; month: number; keyDate: string; mode: MapMode; filters: MapFilters; layers: LayerSettings; manifest: ImageryManifest | null; tab: AdvancedTab;
  onTab: (tab: AdvancedTab) => void; onSelect: (id: string) => void; onLocate: () => void; onMode: (mode: MapMode) => void; setFilters: Dispatch<SetStateAction<MapFilters>>; setLayers: Dispatch<SetStateAction<LayerSettings>>; onClose: () => void;
}) {
  return <div className="flex h-full min-h-0 flex-col">
    <header className="flex items-center gap-3 px-5 pt-4 pb-2">
      <span className="grid size-9 place-items-center rounded-full bg-primary-container text-on-primary-container"><FlaskConical className="size-[18px]"/></span>
      <div className="grid min-w-0 flex-1 leading-tight"><h2 className="text-lg font-medium tracking-tight">Indicadores avanzados</h2><p className="truncate text-xs text-muted-foreground">Series, diagnóstico y capas científicas</p></div>
      <Button variant="ghost" size="icon-sm" aria-label="Cerrar indicadores avanzados" onClick={onClose} className="rounded-full"><X/></Button>
    </header>
    <div role="tablist" aria-label="Indicadores avanzados" className="mx-5 flex gap-1 rounded-full bg-tile p-1 text-xs">
      {TABS.map(([key, label]) => <button key={key} role="tab" type="button" aria-selected={tab === key} onClick={() => onTab(key)} className="flex-1 rounded-full px-3 py-1.5 text-muted-foreground aria-selected:bg-primary aria-selected:text-primary-foreground">{label}</button>)}
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-3 pb-5 [&_[data-slot=card]]:rounded-[20px] [&_[data-slot=card]]:border-0 [&_[data-slot=card]]:bg-tile [&_[data-slot=card]]:shadow-none [&_[data-slot=card]]:bg-none">
      {tab === 'parcela' && (selected ? <TechnicalPage atlas={atlas} parcels={parcels} selected={selected} year={year} month={month} onSelect={onSelect} onMap={onLocate}/> : <ChooseParcel parcels={parcels} onSelect={onSelect}/>)}
      {tab === 'modelo' && <ModelDiagnostics atlas={atlas} parcels={parcels} mode={mode} onMode={onMode} onSelect={onSelect}/>}
      {tab === 'capas' && <TechnicalLayers atlas={atlas} mode={mode} keyDate={keyDate} filters={filters} layers={layers} manifest={manifest} onMode={onMode} setFilters={setFilters} setLayers={setLayers}/>}
    </div>
  </div>;
}

function ChooseParcel({ parcels, onSelect }: { parcels: Parcel[]; onSelect: (id: string) => void }) {
  return <div className="grid place-items-center gap-3 py-10 text-center">
    <p className="max-w-sm text-sm text-muted-foreground">Selecciona una parcela en el mapa o elige una aquí para ver su vegetación, clima, relieve y embedding AlphaEarth.</p>
    <select aria-label="Parcela de análisis" defaultValue="" onChange={e => e.target.value && onSelect(e.target.value)} className="h-9 w-64 rounded-full bg-tile px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <option value="" disabled>Elige una parcela</option>
      {parcels.map(p => <option key={p.properties.id} value={p.properties.id}>{p.properties.name || p.properties.id} · {p.properties.municipality}</option>)}
    </select>
  </div>;
}

function ModelDiagnostics({ atlas, parcels, mode, onMode, onSelect }: { atlas: Atlas; parcels: Parcel[]; mode: MapMode; onMode: (mode: MapMode) => void; onSelect: (id: string) => void }) {
  const model = atlas.predictions;
  const points = useMemo(() => parcels.filter(p => p.properties.observedYield != null && p.properties.predictedYield != null).map(p => ({ id: p.properties.id, observed: p.properties.observedYield!, predicted: p.properties.predictedYield!, error: p.properties.predictedYield! - p.properties.observedYield! })), [parcels]);
  const worst = useMemo(() => [...points].sort((a, b) => Math.abs(b.error) - Math.abs(a.error)).slice(0, 8), [points]);
  const histogram = model.residualHistogram.counts.map((count, i) => ({ bin: `${fmt(model.residualHistogram.edges[i], 2)}`, count, mid: (model.residualHistogram.edges[i] + model.residualHistogram.edges[i + 1]) / 2 }));
  const config = { count: { label: 'Parcelas', color: 'var(--primary)' }, predicted: { label: 'Estimado', color: 'var(--primary)' } } satisfies ChartConfig;
  const [lo, hi] = [Math.floor(model.observedRange[0]), Math.ceil(model.observedRange[1])];
  return <div className="grid gap-3">
    <div className="flex flex-wrap items-center gap-2 rounded-[20px] bg-tile p-3 text-[13px]">
      <span className="mr-auto text-pretty text-muted-foreground">Colorea el mapa con el error fuera de partición de cada parcela (estimado − registrado).</span>
      <Button size="sm" className="rounded-full" variant={mode === 'error' ? 'default' : 'outline'} onClick={() => onMode(mode === 'error' ? 'parcels' : 'error')}>{mode === 'error' ? 'Mostrando error' : 'Ver error en el mapa'}</Button>
    </div>
    <div className="grid gap-3 @container/diag lg:grid-cols-2">
      <figure className="rounded-[20px] bg-tile p-3">
        <figcaption className="px-1 text-sm font-medium">Registrado vs estimado<span className="block text-xs font-normal text-muted-foreground">138 parcelas · validación cruzada · línea 1:1</span></figcaption>
        <ChartContainer config={config} className="aspect-square h-auto w-full max-w-[320px] justify-self-center">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 4, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis type="number" dataKey="observed" domain={[lo, hi]} tickCount={hi - lo + 1} name="Registrado" unit=" t/ha" tickLine={false} axisLine={false} fontSize={11}/>
            <YAxis type="number" dataKey="predicted" domain={[lo, hi]} tickCount={hi - lo + 1} name="Estimado" tickLine={false} axisLine={false} fontSize={11}/>
            <ZAxis range={[28, 28]}/>
            <ReferenceLine segment={[{ x: lo, y: lo }, { x: hi, y: hi }]} stroke="var(--muted-foreground)" strokeDasharray="4 4"/>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator labelFormatter={(_, payload) => String((payload?.[0]?.payload as { id?: string })?.id ?? '')} formatter={(_v, _n, item) => { const d = item.payload as { observed: number; predicted: number }; return <span className="tabular-nums">Registrado {fmt(d.observed)} · estimado {fmt(d.predicted)} t/ha</span>; }}/>}/>
            <Scatter data={points} fill="var(--primary)" fillOpacity={.7} onClick={point => { const d = point as unknown as { id?: string; payload?: { id?: string } }; const id = d.payload?.id ?? d.id; if (id) onSelect(id); }} className="cursor-pointer"/>
          </ScatterChart>
        </ChartContainer>
      </figure>
      <figure className="rounded-[20px] bg-tile p-3">
        <figcaption className="px-1 text-sm font-medium">Distribución del error<span className="block text-xs font-normal text-muted-foreground">Estimado − registrado, t/ha · sesgo {model.metrics.bias_t_ha >= 0 ? '+' : ''}{fmt(model.metrics.bias_t_ha)}</span></figcaption>
        <ChartContainer config={config} className="aspect-[4/3] h-auto w-full">
          <BarChart data={histogram} margin={{ top: 10, right: 6, bottom: 0, left: -18 }}>
            <CartesianGrid vertical={false}/>
            <XAxis dataKey="bin" tickLine={false} axisLine={false} interval={3} fontSize={11}/>
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11}/>
            <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={label => `Desde ${label} t/ha`}/>}/>
            <Bar dataKey="count" radius={[6, 6, 2, 2]} fill="var(--color-count)" fillOpacity={.85}/>
          </BarChart>
        </ChartContainer>
      </figure>
    </div>
    <section className="rounded-[20px] bg-tile p-3" aria-labelledby="folds-title">
      <h3 id="folds-title" className="px-1 pb-2 text-sm font-medium">Particiones de validación</h3>
      <table className="w-full text-[13px] tabular-nums"><thead className="text-xs text-muted-foreground"><tr><th className="py-1 pl-1 text-left font-medium">Partición</th><th className="text-right font-medium">n</th><th className="text-right font-medium">MAE</th><th className="text-right font-medium">RMSE</th><th className="text-right font-medium">R²</th><th className="pr-1 text-right font-medium">Sesgo</th></tr></thead>
        <tbody>{model.folds.map(f => <tr key={f.fold} className="border-t border-frame"><td className="py-1.5 pl-1">{f.fold}</td><td className="text-right">{f.n}</td><td className="text-right">{fmt(f.mae_t_ha)}</td><td className="text-right">{fmt(f.rmse_t_ha)}</td><td className="text-right">{fmt(f.r2)}</td><td className="pr-1 text-right">{f.bias_t_ha >= 0 ? '+' : ''}{fmt(f.bias_t_ha)}</td></tr>)}
          <tr className="border-t border-frame font-medium"><td className="py-1.5 pl-1">Total</td><td className="text-right">{model.metrics.n}</td><td className="text-right">{fmt(model.metrics.mae_t_ha)}</td><td className="text-right">{fmt(model.metrics.rmse_t_ha)}</td><td className="text-right">{fmt(model.metrics.r2)}</td><td className="pr-1 text-right">{model.metrics.bias_t_ha >= 0 ? '+' : ''}{fmt(model.metrics.bias_t_ha)}</td></tr></tbody></table>
      <p className="px-1 pt-2 text-[11px] text-pretty text-muted-foreground">Referencia anterior (aspiring_sota): MAE {fmt(model.reference.mae_t_ha)} · RMSE {fmt(model.reference.rmse_t_ha)} · R² {fmt(model.reference.r2)}. La mejora es pequeña y su intervalo pareado incluye cero. {model.model.blend}.</p>
    </section>
    <section className="rounded-[20px] bg-tile p-3" aria-labelledby="worst-title">
      <h3 id="worst-title" className="px-1 pb-2 text-sm font-medium">Mayores errores</h3>
      <ul className="grid gap-1">{worst.map(w => <li key={w.id}><button type="button" onClick={() => onSelect(w.id)} className="flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left text-[13px] hover:bg-tile-strong">
        <span className="font-mono text-xs">{w.id}</span><span className="text-muted-foreground tabular-nums">reg. {fmt(w.observed)} · est. {fmt(w.predicted)}</span>
        <span className={cn('ml-auto rounded-full px-2 py-0.5 text-xs font-medium tabular-nums', w.error > 0 ? 'bg-chart-5/25' : 'bg-chart-4/25')}>{w.error > 0 ? '+' : ''}{fmt(w.error)} t/ha</span>
      </button></li>)}</ul>
    </section>
  </div>;
}

function TechnicalLayers({ atlas, mode, keyDate, filters, layers, manifest, onMode, setFilters, setLayers }: { atlas: Atlas; mode: MapMode; keyDate: string; filters: MapFilters; layers: LayerSettings; manifest: ImageryManifest | null; onMode: (mode: MapMode) => void; setFilters: Dispatch<SetStateAction<MapFilters>>; setLayers: Dispatch<SetStateAction<LayerSettings>> }) {
  const chip = (key: MapMode, label: string, detail: string) => <button key={key} type="button" aria-pressed={mode === key} onClick={() => onMode(key)} className="grid rounded-2xl bg-tile px-3 py-2.5 text-left hover:bg-tile-strong aria-pressed:bg-primary aria-pressed:text-primary-foreground">
    <span className="text-sm font-medium">{label}</span><span className="text-xs opacity-75">{detail}</span>
  </button>;
  return <div className="grid gap-4">
    <section className="grid gap-2" aria-label="Capas científicas">
      <h3 className="px-1 text-xs font-medium text-muted-foreground">Capas científicas</h3>
      <div className="grid grid-cols-2 gap-2">
        {chip('water', 'Agua · MNDWI', 'Candidatos Sentinel-2 · 20 m')}
        {chip('landsat', 'NDVI · Landsat C2', 'Serie histórica · 30 m')}
        {chip('alphaearth', 'AlphaEarth', 'Embeddings anuales · 10 m')}
        {chip('error', 'Error del modelo', 'Estimado − registrado')}
        {chip('climate', 'Clima', 'CHIRPS · CHIRTS-ERA5')}
        {chip('terrain', 'Terreno', 'Elevación y pendiente INEGI')}
      </div>
    </section>
    <section className="grid gap-3 rounded-[20px] bg-tile p-4" aria-label="Umbrales">
      <h3 className="text-xs font-medium text-muted-foreground">Umbrales</h3>
      <Field><FieldLabel htmlFor="ndvi-threshold">Umbral NDVI (oculta píxeles por debajo)</FieldLabel><Input id="ndvi-threshold" type="number" step="0.05" min="-1" max="1" value={filters.ndviThreshold} onChange={e => setFilters(f => ({ ...f, ndviThreshold: Math.max(-1, Math.min(1, Number(e.target.value))) }))} className="bg-frame"/></Field>
        <Field className="water-index-control"><div className="flex items-center justify-between"><FieldLabel>Umbral de agua MNDWI</FieldLabel><span className="text-sm text-muted-foreground tabular-nums">{(layers.waterThreshold ?? 0).toFixed(2)}</span></div><Slider aria-label="Umbral de agua MNDWI" min={-1} max={1} step={0.05} value={[layers.waterThreshold ?? 0]} onValueChange={([value]) => setLayers(l => ({ ...l, waterThreshold: Math.round(value * 100) / 100 }))} onKeyDown={e => { if (e.key !== 'PageUp' && e.key !== 'PageDown') return; e.preventDefault(); const d = e.key === 'PageUp' ? .25 : -.25; setLayers(l => ({ ...l, waterThreshold: Math.round(Math.max(-1, Math.min(1, (l.waterThreshold ?? 0) + d)) * 100) / 100 })); }} className="py-3"/></Field>
        <Field><div className="flex items-center justify-between"><FieldLabel>Opacidad de agua</FieldLabel><span className="text-sm text-muted-foreground tabular-nums">{Math.round((layers.waterOpacity || 0) * 100)} %</span></div><Slider aria-label="Opacidad del agua" min={0} max={1} step={0.05} value={[layers.waterOpacity || 0]} onValueChange={([value]) => setLayers(l => ({ ...l, waterOpacity: value }))}/></Field>
      <Field orientation="horizontal"><Checkbox id="only-ndvi" checked={filters.onlyNdvi} disabled={mode !== 'landsat'} onCheckedChange={checked => setFilters(f => ({ ...f, onlyNdvi: checked === true }))}/><FieldLabel htmlFor="only-ndvi" className="font-normal">Filtrar también parcelas por NDVI Landsat</FieldLabel></Field>
    </section>
    <section className="grid gap-2 rounded-[20px] bg-tile p-4" aria-label="Clima y relieve">
      <h3 className="text-xs font-medium text-muted-foreground">Clima y relieve superpuestos</h3>
      {(['precipitation', 'tmin', 'tmax', 'elevation', 'slope'] as const).map((layer, i) => <Field key={layer} orientation="horizontal"><Checkbox id={`layer-${layer}`} checked={layers[layer]} onCheckedChange={checked => setLayers(l => ({ ...l, [layer]: checked === true }))}/><FieldLabel htmlFor={`layer-${layer}`} className="font-normal">{['Precipitación', 'Temperatura mínima', 'Temperatura máxima', 'Elevación', 'Pendiente'][i]}</FieldLabel></Field>)}
    </section>
    <section className="grid gap-2 rounded-[20px] bg-tile p-4" aria-label="Procedencia">
      <h3 className="text-xs font-medium text-muted-foreground">Procedencia</h3>
      {manifest ? <><p className="text-xs text-muted-foreground">{manifest.scenes.length} escenas · {manifest.tiles.length} teselas · {manifest.source}</p><Button variant="outline" className="rounded-full bg-transparent" onClick={() => download(`sentinel-${keyDate}.json`, JSON.stringify(manifest, null, 2), 'application/json')}><Download/>Procedencia Sentinel-2 del mes</Button></> : <p className="text-xs text-muted-foreground">Abre Vegetación o Agua para cargar la procedencia Sentinel-2 del mes.</p>}
      <Button variant="outline" className="rounded-full bg-transparent" onClick={() => download('agrocebada-predicciones-modelo.json', JSON.stringify(atlas.predictions, null, 2), 'application/json')}><Download/>Predicciones y métricas del modelo (JSON)</Button>
    </section>
  </div>;
}
