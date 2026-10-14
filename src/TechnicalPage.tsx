import { useState } from 'react';
import { Alert, Button, FormControl, MenuItem, Select } from '@mui/material';
import { Download, ExternalLink } from 'lucide-react';
import type { Atlas, Parcel } from './types';
import { dateKey, download, EXAMPLE_YIELD, fmt, MONTH_NAMES } from './lib';
import { CHART_COLORS, EmbeddingChart, LineChart, RainChart } from './Charts';
import { LoadingValue } from './AgentProgress';
import './pages.css';

const GROUP_LABELS = { training: 'Entrenamiento', prediction: 'Predicción', custom: 'Mi parcela' } as const;

function CardHeading({ title, description }: { title: string; description: string }) {
  return <div className="card-heading"><div><h3>{title}</h3><p>{description}</p></div></div>;
}

export default function TechnicalPage({ atlas, parcels, selected, year, month, onSelect, onMap }: { atlas: Atlas; parcels: Parcel[]; selected: Parcel | null; year: number; month: number; onSelect: (id: string) => void; onMap: () => void }) {
  const [sensor, setSensor] = useState('Landsat C2');
  const parcel = selected || parcels[0], p = parcel?.properties;
  if (!parcel) return null;
  const details = atlas.details[p.id], key = dateKey(year, month);
  const weather = details?.climate[key];
  const vegetation = Array.from({ length: 12 }, (_, i) => sensor === 'Landsat C2' ? atlas.landsat[dateKey(year, i)]?.parcels[p.id]?.mean ?? null : details?.ndvi[sensor]?.[dateKey(year, i)]?.mean ?? null);
  const rain = Array.from({ length: 12 }, (_, i) => details?.climate[dateKey(year, i)]?.precipitation ?? null);
  const tmax = Array.from({ length: 12 }, (_, i) => details?.climate[dateKey(year, i)]?.tmax ?? null);
  const tmin = Array.from({ length: 12 }, (_, i) => details?.climate[dateKey(year, i)]?.tmin ?? null);
  const emb = details?.embedding[String(year)];
  const scenes = atlas.landsat[key]?.scenes || [];
  const stats = [
    { label: `NDVI · ${sensor}`, value: fmt(vegetation[month], 3), unit: '', foot: `${MONTH_NAMES[month]} ${year}` },
    { label: 'Precipitación', value: fmt(weather?.precipitation, 1), unit: 'mm', foot: 'CHIRPS · mensual' },
    { label: 'Temperatura máx.', value: fmt(weather?.tmax, 1), unit: '°C', foot: 'CHIRTS-ERA5 · mensual' },
    { label: 'Pendiente', value: fmt(p.slope, 1), unit: '°', foot: `${fmt(p.elevation, 0)} m s.n.m. · INEGI` },
  ];
  return <div className="technical-page page-stack">
    <section className="technical-parcel">
      <div className="technical-parcel-identity">
        <h2 className="section-title">{p.name || p.id}</h2>
        <p>{p.municipality} · {p.state}<span className="dot-sep"/>{fmt(p.area)} ha<span className={`parcel-status ${p.group}`}>{GROUP_LABELS[p.group]}</span></p>
      </div>
      <div className="technical-parcel-actions">
        <FormControl size="small"><Select value={p.id} onChange={e => onSelect(e.target.value)} inputProps={{ 'aria-label': 'Parcela de análisis' }}>{parcels.map(f => <MenuItem key={f.properties.id} value={f.properties.id}>{f.properties.name || f.properties.id} · {f.properties.municipality}</MenuItem>)}</Select></FormControl>
        <Button variant="outlined" onClick={onMap}>Ver en el mapa</Button>
      </div>
    </section>

    <div className="stat-strip ui-card technical-stats" role="group" aria-label="Resumen del mes">{stats.map(s => <div className="stat" key={s.label}>
      <span className="stat-label">{s.label}</span>
      <strong className="stat-value">{s.value}{s.unit && <small>{s.unit}</small>}</strong>
      <span className="stat-foot">{s.foot}</span>
    </div>)}</div>

    {p.edited && <Alert className="page-alert" severity="info">Los datos ambientales corresponden a los límites originales del dataset. Tus límites ajustados se conservan por separado.</Alert>}

    <div className="technical-chart-grid">
      <section className="data-card chart-card">
        <div className="data-card-header"><CardHeading title="Evolución de la vegetación" description={`Promedio mensual por parcela · ${year}`}/><Select className="toolbar-select compact" size="small" value={sensor} onChange={e => setSensor(e.target.value)} inputProps={{ 'aria-label': 'Sensor de NDVI' }}><MenuItem value="Landsat C2">Landsat C2</MenuItem><MenuItem value="Sentinel-2">Sentinel-2</MenuItem><MenuItem value="Planet">Planet</MenuItem></Select></div>
        <div className="chart-body"><LineChart values={vegetation} label={`NDVI de ${sensor}`} minimum={vegetation.some(v => v != null && v < 0) ? -.25 : 0} maximum={1}/></div>
        <div className="chart-footnote"><span className="legend-swatch" style={{ background: CHART_COLORS.vegetation }}/>{sensor === 'Landsat C2' ? 'Mediana de hasta 2 escenas · píxeles válidos QA · 30 m' : 'Observaciones originales · nubosidad ≤ 30% · media mensual'}</div>
      </section>
      <section className="data-card chart-card">
        <div className="data-card-header"><CardHeading title="Precipitación mensual" description={`CHIRPS · milímetros por mes · ${year}`}/></div>
        <div className="chart-body"><RainChart values={rain} month={month}/></div>
        <div className="chart-footnote"><span className="legend-swatch" style={{ background: CHART_COLORS.cool }}/>Media espacial de los píxeles dentro de la parcela · {MONTH_NAMES[month]} resaltado.</div>
      </section>
      <section className="data-card chart-card">
        <div className="data-card-header"><CardHeading title="Rango de temperatura" description="CHIRTS-ERA5 · temperaturas medias mensuales en °C"/></div>
        <div className="chart-body"><LineChart values={tmax} comparison={tmin} label="Temperatura máxima y mínima" unit="°C" minimum={0} maximum={40} color={CHART_COLORS.warm} comparisonColor={CHART_COLORS.cool} seriesLabels={['Máx.', 'Mín.']}/></div>
        <div className="chart-footnote temperature-legend"><span><i style={{ background: CHART_COLORS.warm }}/>Máxima</span><span><i className="dashed" style={{ borderColor: CHART_COLORS.cool }}/>Mínima · línea discontinua</span></div>
      </section>
      <section className="data-card chart-card model-placeholder-card">
        <div className="data-card-header"><CardHeading title="Resultado del modelo" description="Espacio reservado para la predicción"/><span className="ui-badge ui-badge-warning example-label">Ejemplo</span></div>
        <div className="model-placeholder-body">
          <div className="technical-placeholder-yield"><span className="display-figure">{fmt(EXAMPLE_YIELD)}</span><small>t/ha</small></div>
          <p>Valor fijo de ejemplo, sin inferencia.</p>
          <div className="metric-placeholder-row">{['RMSE', 'MAE', 'R²'].map(label => <div key={label}><span className="stat-label">{label}{label !== 'R²' ? ' · t/ha' : ''}</span><LoadingValue active={false} label={`${label} pendiente del modelo`}/></div>)}</div>
        </div>
        <div className="chart-footnote">Las métricas y explicaciones se mostrarán al conectar el modelo.</div>
      </section>
    </div>

    <section className="data-card embedding-card">
      <div className="data-card-header"><CardHeading title="AlphaEarth Foundations" description={`Embedding anual ${year} · 64 dimensiones · píxeles nativos de 10 m`}/><Button size="small" variant="outlined" disabled={!emb} startIcon={<Download size={13}/>} onClick={() => download(`${p.id}-alphaearth-${year}.json`, JSON.stringify({ parcel: p.id, year, axes: emb.values, aggregation: 'Area-weighted dequantized pixel mean, normalized to unit length', source: 'Google / Google DeepMind; CC BY 4.0' }, null, 2), 'application/json')}>Descargar vector</Button></div>
      <div className="chart-body"><EmbeddingChart values={emb?.values}/></div>
      <p className="chart-footnote embedding-note">Cada celda representa un eje del vector, sin unidad física. Estos datos resumen un año completo y no cambian al seleccionar un mes. Los colores RGB del mapa usan A00, A01 y A02; no representan salud del cultivo.</p>
    </section>

    <section className="data-card acquisition-card">
      <div className="data-card-header"><CardHeading title="Escenas Landsat del mes" description={`USGS · Collection 2 · Level 2 · ${MONTH_NAMES[month]} ${year}`}/></div>
      {scenes.length ? <ul className="scene-list">{scenes.map(s => <li key={s.id}>
        <div><strong>{s.id}</strong><span>{s.date} · nubosidad de escena {fmt(s.cloudCover, 1)}%</span></div>
        <a className="ui-btn ui-btn-ghost ui-btn-icon ui-btn-sm" href={s.stacUrl} target="_blank" rel="noreferrer" aria-label={`Metadatos de ${s.id}`}><ExternalLink size={15}/></a>
      </li>)}</ul> : <div className="empty-state small"><p>No hay escenas locales disponibles en este mes.</p></div>}
      <p className="chart-footnote formula-note">NDVI = (NIR − rojo) / (NIR + rojo). Reflectancia: DN × 0.0000275 − 0.2. Máscara de nubes, sombras, nieve, cirrus y saturación.</p>
    </section>
  </div>;
}
