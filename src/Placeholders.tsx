import { Alert, Button } from '@mui/material';
import { LoadingDots, LoadingState, LoadingValue } from './AgentProgress';
import type { View } from './types';
import './placeholders.css';

const LABELS: Record<View, string> = { map: 'Mapa', parcels: 'Mis parcelas', technical: 'Análisis técnico', models: 'Modelo de ejemplo', sources: 'Datos y fuentes', admin: 'Administración' };

export function PlaceholderTableRows({ columns, rows = 4 }: { columns: string[]; rows?: number }) {
  return <>{Array.from({ length: rows }, (_, row) => <tr className="placeholder-table-row" key={row}>{columns.map((unit, column) => <td key={column}><LoadingValue label="Valor pendiente" unit={unit}/></td>)}</tr>)}</>;
}

function TablePlaceholder({ title, columns, units }: { title: string; columns: string[]; units?: string[] }) {
  return <section className="data-card placeholder-table-card"><div className="data-card-header"><h3>{title}</h3><LoadingValue label="Cantidad pendiente"/></div><div className="table-scroll"><table className="parcel-table"><thead><tr>{columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody><PlaceholderTableRows columns={units || columns.map(() => '')}/></tbody></table></div></section>;
}

function MetricPlaceholders({ values }: { values: [string, string][] }) {
  return <div className="placeholder-metrics">{values.map(([label, unit]) => <section className="data-card" key={label}><span>{label}</span><LoadingValue label={`${label} pendiente`} unit={unit}/><span className="placeholder-line short"/></section>)}</div>;
}

export function ChartPlaceholder({ label, unit = '' }: { label: string; unit?: string }) {
  return <div className="placeholder-chart"><LoadingValue label={`${label} pendiente`} unit={unit}/><span className="placeholder-chart-axis"/><span className="placeholder-chart-axis"/><span className="placeholder-chart-axis"/></div>;
}

export default function PagePlaceholder({ view, error = '', onRetry, waitingForSelection = false }: { view: View; error?: string; onRetry?: () => void; waitingForSelection?: boolean }) {
  return <section className={`page-placeholder ${error || waitingForSelection ? 'stopped' : ''}`} data-phase={error ? 'error' : waitingForSelection ? 'waiting' : 'loading'} aria-label={waitingForSelection ? `Vista previa de ${LABELS[view]}` : `Preparando ${LABELS[view]}`}>
    {error ? <Alert severity="warning" action={onRetry && <Button onClick={onRetry}>Volver a intentar</Button>}>{error}</Alert> : waitingForSelection ? <div className="placeholder-waiting"><LoadingDots/><span>En espera de seleccionar una parcela</span></div> : <LoadingState label={`Cargando ${LABELS[view]}…`}/>}
    <div className="page-placeholder-content" aria-hidden="true">
      {view === 'parcels' && <><TablePlaceholder title="Tus parcelas" columns={['Parcela', 'Ubicación', 'Superficie', 'Conjunto', 'Rendimiento registrado', 'NDVI · Landsat']} units={['', '', 'ha', '', 't/ha', '']}/><section className="data-card placeholder-analysis-list"><div className="data-card-header"><h3>Tus análisis</h3><LoadingValue label="Análisis guardados pendientes"/></div><div className="placeholder-list-item"><span className="placeholder-line"/><LoadingValue label="Rendimiento pendiente" unit="t/ha"/></div><div className="placeholder-list-item"><span className="placeholder-line"/><LoadingValue label="Rendimiento pendiente" unit="t/ha"/></div></section></>}
      {view === 'technical' && <><MetricPlaceholders values={[[ 'NDVI', '' ], [ 'Precipitación', 'mm' ], [ 'Temperatura máx.', '°C' ], [ 'Relieve', '°' ]]}/><div className="technical-chart-grid">{[['Evolución de la vegetación', 'NDVI'], ['Precipitación mensual', 'mm'], ['Rango de temperatura', '°C'], ['Resultado del modelo', 't/ha']].map(([title, unit]) => <section className="data-card" key={title}><div className="data-card-header"><h3>{title}</h3></div><ChartPlaceholder label={title} unit={unit}/></section>)}</div><section className="data-card placeholder-embedding"><div className="data-card-header"><h3>AlphaEarth Foundations</h3></div><ChartPlaceholder label="Vector anual"/></section></>}
      {view === 'models' && <><section className="data-card placeholder-intro"><h2>El espacio para tu modelo.</h2><p>Datos disponibles y métricas de ejemplo</p><LoadingValue label="Rendimiento de ejemplo pendiente" unit="t/ha"/></section><MetricPlaceholders values={[[ 'RMSE', 't/ha' ], [ 'MAE', 't/ha' ], [ 'R²', '' ], [ 'Validación', '' ]]}/><section className="data-card"><div className="data-card-header"><h3>Datos disponibles para el análisis</h3></div><MetricPlaceholders values={[[ 'Parcelas', '' ], [ 'Dimensiones AlphaEarth', '' ], [ 'Meses de clima', '' ], [ 'Rendimientos registrados', '' ]]}/></section></>}
      {view === 'sources' && <><section className="data-card placeholder-intro"><h2>Cada dato tiene una historia.</h2><p>Fuentes, periodos y alcance de la información.</p></section><div className="sources-grid">{['Sentinel-2 · Vegetación y agua', 'Delimitación de parcelas', 'Parcelas del reto', 'Límites territoriales', 'Clima y relieve', 'AlphaEarth Foundations', 'NDVI · Landsat Collection 2', 'Observaciones del reto'].map(title => <section className="data-card placeholder-source" key={title}><h3>{title}</h3><span className="placeholder-line"/><span className="placeholder-line"/><span className="placeholder-line short"/><LoadingValue label="Inventario de la fuente pendiente"/></section>)}</div></>}
      {view === 'admin' && <><TablePlaceholder title="Usuarios del espacio" columns={['Usuario', 'Nombre', 'Rol', 'Activo']}/><TablePlaceholder title="Asignaciones de parcelas" columns={['Parcela', 'Productor', 'Técnico']}/></>}
    </div>
  </section>;
}
