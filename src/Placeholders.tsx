import { Alert, Button } from '@mui/material';
import { LoadingDots, LoadingState, LoadingValue } from './AgentProgress';
import { DotLoader } from './Loader';
import type { View } from './types';
import './placeholders.css';
import './pages.css';

const LABELS: Record<View, string> = { map: 'Mapa', parcels: 'Mis parcelas', technical: 'Análisis técnico', models: 'Modelo de ejemplo', sources: 'Datos y fuentes', admin: 'Administración' };

export function PlaceholderTableRows({ columns, rows = 4 }: { columns: string[]; rows?: number }) {
  return <>{Array.from({ length: rows }, (_, row) => <tr className="placeholder-table-row" key={row}>{columns.map((unit, column) => <td key={column}><LoadingValue label="Valor pendiente" unit={unit}/></td>)}</tr>)}</>;
}

function PlaceholderHeader({ title }: { title: string }) {
  return <div className="data-card-header"><div className="card-heading"><span className="card-icon placeholder-icon"/><div><h3>{title}</h3><span className="placeholder-line short"/></div></div></div>;
}

function TablePlaceholder({ title, columns, units }: { title: string; columns: string[]; units?: string[] }) {
  return <section className="data-card placeholder-table-card">
    <div className="data-card-header"><div className="card-heading"><span className="card-icon placeholder-icon"/><div><h3>{title}</h3><span className="placeholder-line short"/></div></div><LoadingValue label="Cantidad pendiente"/></div>
    <div className="table-scroll"><table className="parcel-table"><thead><tr>{columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody><PlaceholderTableRows columns={units || columns.map(() => '')}/></tbody></table></div>
  </section>;
}

function MetricPlaceholders({ values, strip = false }: { values: [string, string][]; strip?: boolean }) {
  if (strip) return <div className="stat-strip ui-card placeholder-metrics-strip">{values.map(([label, unit]) => <div className="stat" key={label}><span className="kicker">{label}</span><LoadingValue className="stat-value" label={`${label} pendiente`} unit={unit}/><span className="placeholder-line short"/></div>)}</div>;
  return <div className="placeholder-metrics">{values.map(([label, unit]) => <section className="data-card stat-card" key={label}><span className="kicker">{label}</span><LoadingValue className="stat-value" label={`${label} pendiente`} unit={unit}/><span className="placeholder-line short"/></section>)}</div>;
}

export function ChartPlaceholder({ label, unit = '' }: { label: string; unit?: string }) {
  return <div className="placeholder-chart">
    <span className="placeholder-chart-axis"/><span className="placeholder-chart-axis"/><span className="placeholder-chart-axis"/><span className="placeholder-chart-axis"/>
    <div className="placeholder-chart-center"><DotLoader name="bars" size={26} color="var(--subtle-foreground)"/><LoadingValue label={`${label} pendiente`} unit={unit}/></div>
  </div>;
}

export default function PagePlaceholder({ view, error = '', onRetry, waitingForSelection = false }: { view: View; error?: string; onRetry?: () => void; waitingForSelection?: boolean }) {
  return <section className={`page-placeholder ${error || waitingForSelection ? 'stopped' : ''}`} data-phase={error ? 'error' : waitingForSelection ? 'waiting' : 'loading'} aria-label={waitingForSelection ? `Vista previa de ${LABELS[view]}` : `Preparando ${LABELS[view]}`}>
    {error ? <Alert className="page-alert" severity="warning" action={onRetry && <Button onClick={onRetry}>Volver a intentar</Button>}>{error}</Alert> : waitingForSelection ? <div className="placeholder-waiting"><LoadingDots/><span>En espera de seleccionar una parcela</span></div> : <LoadingState className="placeholder-status" label={`Cargando ${LABELS[view]}…`}/>}
    <div className="page-placeholder-content page-stack" aria-hidden="true">
      {view === 'parcels' && <>
        <MetricPlaceholders strip values={[['Parcelas', ''], ['Entrenamiento', ''], ['Predicción', ''], ['Superficie', 'ha']]}/>
        <TablePlaceholder title="Tus parcelas" columns={['Parcela', 'Ubicación', 'Superficie', 'Conjunto', 'Rendimiento registrado', 'NDVI · Landsat']} units={['', '', 'ha', '', 't/ha', '']}/>
        <section className="data-card placeholder-analysis-list"><div className="data-card-header"><div className="card-heading"><span className="card-icon placeholder-icon"/><div><h3>Tus análisis</h3><span className="placeholder-line short"/></div></div><LoadingValue label="Análisis guardados pendientes"/></div>
          {[0, 1].map(i => <div className="placeholder-list-item" key={i}><span className="placeholder-line"/><LoadingValue label="Rendimiento pendiente" unit="t/ha"/></div>)}
        </section>
      </>}
      {view === 'technical' && <>
        <MetricPlaceholders values={[['NDVI', ''], ['Precipitación', 'mm'], ['Temperatura máx.', '°C'], ['Relieve', '°']]}/>
        <div className="technical-chart-grid">{[['Evolución de la vegetación', 'NDVI'], ['Precipitación mensual', 'mm'], ['Rango de temperatura', '°C'], ['Resultado del modelo', 't/ha']].map(([title, unit]) => <section className="data-card chart-card" key={title}><PlaceholderHeader title={title}/><div className="chart-body"><ChartPlaceholder label={title} unit={unit}/></div></section>)}</div>
        <section className="data-card placeholder-embedding"><PlaceholderHeader title="AlphaEarth Foundations"/><div className="chart-body"><div className="placeholder-matrix">{Array.from({ length: 64 }, (_, i) => <i key={i}/>)}</div></div></section>
      </>}
      {view === 'models' && <>
        <section className="model-intro ui-card dotted-surface placeholder-intro"><div className="model-intro-copy"><span className="kicker">Del dato a la decisión</span><h2 className="pixel display-title">El espacio para tu modelo.</h2><p>Datos disponibles y métricas de ejemplo</p></div><div className="model-intro-example"><span className="kicker">Valor de ejemplo</span><LoadingValue label="Rendimiento de ejemplo pendiente" unit="t/ha"/></div></section>
        <MetricPlaceholders values={[['RMSE', 't/ha'], ['MAE', 't/ha'], ['R²', ''], ['Validación', '']]}/>
        <section className="data-card"><PlaceholderHeader title="Datos disponibles para el análisis"/><div className="input-source-grid">{['Parcelas', 'Dimensiones AlphaEarth', 'Meses de clima', 'Rendimientos registrados'].map(label => <div className="stat" key={label}><LoadingValue className="stat-value" label={`${label} pendiente`}/><b>{label}</b><span className="placeholder-line short"/></div>)}</div></section>
      </>}
      {view === 'sources' && <>
        <section className="sources-banner ui-card dotted-surface placeholder-intro"><span className="banner-icon placeholder-icon"/><div className="sources-banner-copy"><span className="kicker">Procedencia</span><h2 className="pixel display-title">Cada dato tiene una historia.</h2><p>Fuentes, periodos y alcance de la información.</p></div></section>
        <div className="sources-grid">{['Sentinel-2 · Vegetación y agua', 'Delimitación de parcelas', 'Parcelas del reto', 'Límites territoriales', 'Clima y relieve', 'AlphaEarth Foundations', 'NDVI · Landsat Collection 2', 'Observaciones del reto'].map(title => <section className="data-card source-card placeholder-source" key={title}>
          <div className="source-card-top"><span className="card-icon lg placeholder-icon"/><span className="placeholder-line tag"/></div>
          <h3>{title}</h3><span className="placeholder-line"/><span className="placeholder-line"/><span className="placeholder-line short"/>
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
