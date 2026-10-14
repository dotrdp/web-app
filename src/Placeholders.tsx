import { Alert, Button } from '@mui/material';
import { LoadingDots, LoadingState, LoadingValue } from './AgentProgress';
import type { View } from './types';
import './placeholders.css';
import './pages.css';

const LABELS: Record<View, string> = { map: 'Mapa', parcels: 'Mis parcelas', technical: 'Análisis técnico', models: 'Modelo de ejemplo', sources: 'Datos y fuentes', admin: 'Administración' };

export function PlaceholderTableRows({ columns, rows = 4 }: { columns: string[]; rows?: number }) {
  return <>{Array.from({ length: rows }, (_, row) => <tr className="placeholder-table-row" key={row}>{columns.map((unit, column) => <td key={column}><LoadingValue label="Valor pendiente" unit={unit}/></td>)}</tr>)}</>;
}

function PlaceholderHeader({ title, count = false }: { title: string; count?: boolean }) {
  return <div className="data-card-header"><div className="card-heading"><div><h3>{title}</h3><span className="placeholder-line short"/></div></div>{count && <LoadingValue label="Cantidad pendiente"/>}</div>;
}

function TablePlaceholder({ title, columns, units }: { title?: string; columns: string[]; units?: string[] }) {
  return <section className="data-card placeholder-table-card">
    {title ? <PlaceholderHeader title={title} count/> : <div className="table-toolbar placeholder-toolbar"><span className="placeholder-field"/><span className="placeholder-field narrow"/><LoadingValue className="toolbar-count" label="Cantidad pendiente"/></div>}
    <div className="table-scroll"><table className="parcel-table"><thead><tr>{columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody><PlaceholderTableRows columns={units || columns.map(() => '')}/></tbody></table></div>
  </section>;
}

function Metric({ label, unit }: { label: string; unit: string }) {
  return <div className="stat"><span className="stat-label">{label}</span><LoadingValue className="stat-value" label={`${label} pendiente`} unit={unit}/><span className="placeholder-line short"/></div>;
}

function MetricPlaceholders({ values }: { values: [string, string][] }) {
  return <div className="stat-strip ui-card placeholder-metrics-strip">{values.map(([label, unit]) => <Metric key={label} label={label} unit={unit}/>)}</div>;
}

export function ChartPlaceholder({ label, unit = '' }: { label: string; unit?: string }) {
  return <div className="placeholder-chart">
    <span className="placeholder-chart-axis"/><span className="placeholder-chart-axis"/><span className="placeholder-chart-axis"/><span className="placeholder-chart-axis"/>
    <div className="placeholder-chart-center"><LoadingValue label={`${label} pendiente`} unit={unit}/></div>
  </div>;
}

export default function PagePlaceholder({ view, error = '', onRetry, waitingForSelection = false }: { view: View; error?: string; onRetry?: () => void; waitingForSelection?: boolean }) {
  return <section className={`page-placeholder ${error || waitingForSelection ? 'stopped' : ''}`} data-phase={error ? 'error' : waitingForSelection ? 'waiting' : 'loading'} aria-label={waitingForSelection ? `Vista previa de ${LABELS[view]}` : `Preparando ${LABELS[view]}`}>
    {error ? <Alert className="page-alert" severity="warning" action={onRetry && <Button onClick={onRetry}>Volver a intentar</Button>}>{error}</Alert> : waitingForSelection ? <div className="placeholder-waiting"><LoadingDots/><span>En espera de seleccionar una parcela</span></div> : <LoadingState className="placeholder-status" label={`Cargando ${LABELS[view]}…`}/>}
    <div className="page-placeholder-content page-stack" aria-hidden="true">
      {view === 'parcels' && <>
        <MetricPlaceholders values={[['Parcelas', ''], ['Entrenamiento', ''], ['Predicción', ''], ['Superficie', 'ha']]}/>
        <TablePlaceholder columns={['Parcela', 'Ubicación', 'Superficie', 'Conjunto', 'Rendimiento', 'NDVI · Landsat']} units={['', '', 'ha', '', 't/ha', '']}/>
        <section className="data-card placeholder-analysis-list"><PlaceholderHeader title="Tus análisis" count/>
          {[0, 1].map(i => <div className="placeholder-list-item" key={i}><span className="placeholder-line"/><LoadingValue label="Rendimiento pendiente" unit="t/ha"/></div>)}
        </section>
      </>}
      {view === 'technical' && <>
        <MetricPlaceholders values={[['NDVI', ''], ['Precipitación', 'mm'], ['Temperatura máx.', '°C'], ['Relieve', '°']]}/>
        <div className="technical-chart-grid">{[['Evolución de la vegetación', 'NDVI'], ['Precipitación mensual', 'mm'], ['Rango de temperatura', '°C'], ['Resultado del modelo', 't/ha']].map(([title, unit]) => <section className="data-card chart-card" key={title}><PlaceholderHeader title={title}/><div className="chart-body"><ChartPlaceholder label={title} unit={unit}/></div></section>)}</div>
        <section className="data-card placeholder-embedding"><PlaceholderHeader title="AlphaEarth Foundations"/><div className="chart-body"><div className="placeholder-matrix">{Array.from({ length: 64 }, (_, i) => <i key={i}/>)}</div></div></section>
      </>}
      {view === 'models' && <>
        <section className="model-intro data-card placeholder-intro"><div className="model-intro-copy"><h2 className="section-title">El espacio para tu modelo.</h2><span className="placeholder-line"/><span className="placeholder-line short"/></div><div className="model-intro-example"><span className="stat-label">Valor de ejemplo</span><LoadingValue label="Rendimiento de ejemplo pendiente" unit="t/ha"/></div></section>
        <MetricPlaceholders values={[['RMSE', 't/ha'], ['MAE', 't/ha'], ['R²', ''], ['Validación', '']]}/>
        <section className="data-card"><PlaceholderHeader title="Datos disponibles para el análisis"/><div className="input-source-grid">{['Parcelas georreferenciadas', 'Dimensiones AlphaEarth', 'Meses de clima', 'Rendimientos registrados'].map(label => <Metric key={label} label={label} unit=""/>)}</div></section>
      </>}
      {view === 'sources' && <>
        <header className="page-intro placeholder-intro"><h2 className="section-title">Cada dato tiene una historia.</h2><span className="placeholder-line"/></header>
        <div className="sources-grid">{['Sentinel-2 · Vegetación y agua', 'Delimitación de parcelas', 'Parcelas del reto', 'Límites territoriales', 'Clima y relieve', 'AlphaEarth Foundations', 'NDVI · Landsat Collection 2', 'Observaciones del reto'].map(title => <section className="data-card source-card placeholder-source" key={title}>
          <div className="source-card-top"><h3>{title}</h3><span className="placeholder-line tag"/></div><span className="placeholder-line"/><span className="placeholder-line"/><span className="placeholder-line short"/>
          <div className="source-card-footer"><LoadingValue label="Inventario de la fuente pendiente"/></div>
        </section>)}</div>
      </>}
      {view === 'admin' && <>
        <TablePlaceholder title="Usuarios del espacio" columns={['Usuario', 'Nombre', 'Rol', 'Activo']}/>
        <TablePlaceholder title="Asignaciones de parcelas" columns={['Parcela', 'Productor', 'Técnico']}/>
      </>}
    </div>
  </section>;
}
