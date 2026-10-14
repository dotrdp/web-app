import { CloudOff, Map as MapIcon, RotateCcw } from 'lucide-react';
import { AgentSteps, LoadingState, LoadingValue } from './AgentProgress';
import type { AgentStep } from './AgentProgress';

export type SetupTaskId = 'parcels' | 'details' | 'layers' | 'landsat' | 'provenance' | 'workspace' | 'map';
export type SetupTasks = Record<SetupTaskId, AgentStep>;
export function createSetupTasks(started = false): SetupTasks {
  const names: Record<SetupTaskId, string> = { parcels: 'Cargar parcelas', details: 'Observaciones por parcela', layers: 'Preparar capas del territorio', landsat: 'Serie histórica Landsat', provenance: 'Procedencia de los datos', workspace: 'Aplicar tus asignaciones', map: 'Abrir el mapa' };
  return Object.fromEntries(Object.entries(names).map(([id, name]) => [id, { id, name, status: started && id !== 'map' ? 'running' : 'pending', ...(started && id !== 'map' ? { startedAt: performance.now() } : {}) }])) as SetupTasks;
}

export default function MapSetup({ tasks, error, onRetry }: { tasks: SetupTasks; error: string; onRetry: () => void }) {
  const children = [tasks.details, tasks.landsat, tasks.provenance];
  const status = children.some(c => c.status === 'error') ? 'error' : children.every(c => c.status === 'success') ? 'success' : children.some(c => c.status === 'running') ? 'running' : 'pending';
  const observations: AgentStep = { id: 'observations', name: 'Preparar observaciones', status, children, detail: status === 'success' ? 'Series históricas y fuentes disponibles' : '3 fuentes en paralelo', startedAt: children.some(c => c.startedAt !== undefined) ? Math.min(...children.map(c => c.startedAt ?? Infinity)) : undefined, completedAt: children.every(c => c.completedAt !== undefined) ? Math.max(...children.map(c => c.completedAt!)) : undefined };
  const steps = [tasks.parcels, observations, tasks.layers, tasks.workspace, { ...tasks.map, detail: tasks.map.status === 'pending' ? 'Esperando los datos del atlas' : 'Vista de julio de 2025 · mapa interactivo' }];
  const ready = steps.filter(s => s.status === 'success').length;
  return <section className="map-setup-card" aria-labelledby="map-setup-title" data-error={!!error || undefined}>
    <div className="map-setup-head">
      <span className="map-setup-radar">{error ? <CloudOff size={22} strokeWidth={1.6}/> : <MapIcon size={22} strokeWidth={1.6}/>}</span>
      <div>
        <div className="map-setup-eyebrow">Atlas AgroCebada</div>
        <h1 id="map-setup-title">{error ? 'Falta una fuente del mapa' : 'Preparando tu mapa'}</h1>
        <p className="map-setup-description">Hidalgo, Puebla y Tlaxcala, en una sola vista.</p>
      </div>
    </div>
    <div className="map-setup-summary">
      {error ? <span role="status">La carga no pudo completarse</span> : <LoadingState label="Conectando el territorio" startedAt={tasks.parcels.startedAt}/>}
      <span className="map-setup-count" aria-hidden="true">{ready}<small>/{steps.length}</small></span>
    </div>
    <div className="map-setup-meter" aria-hidden="true">{steps.map(step => <span key={step.id} data-status={step.status}>{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ animationDelay: `${i * 90}ms` }}/>)}</span>)}</div>
    <div className="map-setup-values" aria-hidden="true">{['Parcelas', 'Observaciones', 'Capas'].map(label => <div key={label}><span>{label}</span><LoadingValue label={`${label} pendientes`} active={!error}/></div>)}</div>
    <AgentSteps steps={steps} label="Preparación del mapa"/>
    {!error && <span className="progress-sr-only" role="status">{ready} de {steps.length} pasos completados.</span>}
    {error && <div className="map-setup-error"><p role="alert">{error}</p><button className="ui-btn ui-btn-primary" onClick={onRetry}><RotateCcw/>Volver a intentar</button></div>}
    <p className="map-setup-footnote">Tus parcelas y permisos se preparan para esta sesión.</p>
  </section>;
}
