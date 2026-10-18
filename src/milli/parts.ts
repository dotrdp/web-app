// Reads one assistant message the way Milli's chat shows it: the task Milli declared (start_task)
// with its steps' progress (update_task), its thinking and narration (the exploration), the actions
// it took (every other MCP call), the export requests, and the final answer (finish_task).
import type { ThreadAssistantMessagePart } from '@assistant-ui/react';
import type { StepStatus } from './store';

type ToolPart = Extract<ThreadAssistantMessagePart, { type: 'tool-call' }>;
export type Thought = { kind: 'reasoning' | 'text'; text: string; startedAt?: number; completedAt?: number };
export type Action = { id: string; name: string; args: Record<string, unknown>; result: unknown; isError: boolean; startedAt?: number; completedAt?: number; pending: boolean };
export type TaskView = { title: string; goal: string; steps: { label: string; status: StepStatus; note?: string }[] };
export type MessageView = { task: TaskView | null; thoughts: Thought[]; actions: Action[]; exports: ToolPart[]; answer: string | null };

const TASK_TOOLS = new Set(['start_task', 'update_task', 'finish_task']);

export function readMessage(content: readonly ThreadAssistantMessagePart[]): MessageView {
  let task: TaskView | null = null, answer: string | null = null;
  const thoughts: Thought[] = [], actions: Action[] = [], exports: ToolPart[] = [];
  for (const part of content) {
    if (part.type === 'reasoning' || part.type === 'text') {
      const timing = (part as { timing?: { startedAt?: number; completedAt?: number } }).timing;
      if (part.text.trim()) thoughts.push({ kind: part.type, text: part.text, startedAt: timing?.startedAt, completedAt: timing?.completedAt });
      continue;
    }
    if (part.type !== 'tool-call') continue;
    const args = (part.args ?? {}) as Record<string, unknown>;
    if (part.toolName === 'start_task' && !part.isError) {
      task = { title: String(args.title ?? 'Tarea'), goal: String(args.goal ?? ''), steps: ((args.steps as string[]) ?? []).map(label => ({ label, status: 'pending' as StepStatus })) };
    } else if (part.toolName === 'update_task' && task && !part.isError) {
      const step = task.steps[Number(args.step)];
      if (step) { step.status = args.status as StepStatus; if (args.note) step.note = String(args.note); }
    } else if (part.toolName === 'finish_task' && !part.isError) {
      answer = String(args.answer ?? '');
    } else if (part.toolName === 'request_export') {
      exports.push(part);
    }
    if (!TASK_TOOLS.has(part.toolName)) {
      const timing = (part as { timing?: { startedAt?: number; completedAt?: number } }).timing;
      actions.push({ id: part.toolCallId, name: part.toolName, args, result: part.result, isError: !!part.isError, startedAt: timing?.startedAt, completedAt: timing?.completedAt, pending: part.result === undefined });
    }
  }
  return { task, thoughts, actions, exports, answer };
}

const PAGE: Record<string, string> = { mapa: 'el mapa', panel: 'el panel de control', economia: 'la calculadora' };
const PANEL: Record<string, string> = { capas: 'Capas', mapa_base: 'Mapa base', tabla: 'Tabla de atributos', filtros: 'Filtros', ajustes: 'Ajustes', notas: 'Notas', ninguno: 'ningún panel' };
const TABLE: Record<string, string> = { estimaciones: 'estimaciones', municipios: 'municipios', economia: 'economía', error_municipios: 'error por municipio', atributos: 'atributos' };
const EXPORT: Record<string, string> = { estimaciones_csv: 'la tabla de estimaciones (CSV)', entrega_csv: 'la entrega del reto (CSV, 59 parcelas)', parcelas_geojson: 'las parcelas (GeoJSON)', mapa_png: 'la imagen del mapa (PNG)', seleccion_csv: 'la selección (CSV)' };
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const count = (v: unknown, one: string, many: string) => { const n = Array.isArray(v) ? v.length : 0; return `${n} ${n === 1 ? one : many}`; };

/** A short Spanish title for an action, from the tool and its arguments. */
export function actionTitle(name: string, a: Record<string, unknown>) {
  switch (name) {
    case 'get_screen_state': return 'Leer la pantalla';
    case 'read_table': return `Leer la tabla de ${TABLE[String(a.table)] ?? a.table}`;
    case 'read_notes': return 'Leer las notas';
    case 'query_parcels': return 'Buscar parcelas';
    case 'get_series': return `Leer NDVI y lluvia de ${count(a.parcel_ids, 'parcela', 'parcelas')}`;
    case 'get_integrals': return 'Calcular la integral de NDVI';
    case 'get_region_error': return a.state ? `Error esperado en ${a.state}` : 'Error esperado por región';
    case 'get_model_metrics': return 'Leer las métricas del modelo';
    case 'read_attachment': return `Leer el CSV adjunto (${a.attachment_id})`;
    case 'navigate': return `Ir a ${PAGE[String(a.page)] ?? a.page}`;
    case 'open_panel': return a.panel === 'ninguno' ? 'Cerrar el panel lateral' : `Abrir ${PANEL[String(a.panel)] ?? a.panel}`;
    case 'map_fly_to': return a.parcel_id ? `Ir a ${a.parcel_id} en el mapa` : a.all ? 'Ver todas las parcelas' : 'Mover el mapa';
    case 'select_parcel': return `Seleccionar ${a.parcel_id}`;
    case 'map_select_parcels': return `Seleccionar ${count(a.parcel_ids, 'parcela', 'parcelas')} en el mapa`;
    case 'set_map_layer': return a.mode === 'vegetacion' ? 'Mostrar la vegetación' : a.yield_field ? `Mostrar el rendimiento ${a.yield_field}` : 'Cambiar la capa del mapa';
    case 'set_map_filters': return a.reset ? 'Quitar los filtros del mapa' : a.state && a.state !== 'all' ? `Filtrar el mapa: ${a.state}` : 'Filtrar el mapa';
    case 'set_time': return `Mapa en ${MONTHS[Number(a.month) - 1] ?? ''} ${a.year}`;
    case 'table_set': return a.set_tab ? `Tabla: ${String(a.set_tab).replace('_', ' ')}` : 'Ajustar la tabla';
    case 'table_check': return a.mode === 'none' ? 'Quitar las marcas' : a.mode === 'all' ? 'Marcar todas las filas' : `Marcar ${count(a.parcel_ids, 'fila', 'filas')}`;
    case 'plot_set': return `Gráfica de ${a.year}`;
    case 'calculator_set': return 'Calcular la economía';
    case 'region_error_drill': return a.state ? `Error por municipio en ${a.state}` : 'Error por estado';
    case 'write_notes': return 'Escribir en Notas';
    case 'request_export': return `Descargar ${EXPORT[String(a.kind)] ?? a.kind}`;
    default: return name;
  }
}

const money = (n: unknown) => typeof n === 'number' ? `$${Math.round(n).toLocaleString('es-MX')}` : '—';
/** One line about how an action went, from its result. */
export function actionDetail(action: Action): string {
  const r = action.result as Record<string, unknown> | string | undefined;
  if (action.pending) return action.name === 'request_export' ? 'Esperando tu permiso' : 'En curso';
  if (action.isError) return typeof r === 'string' ? r.replace(/^MCP error -?\d+:\s*/, '').slice(0, 140) : 'No se pudo';
  if (!r || typeof r !== 'object') return '';
  if (r.shown === false) return 'No se mostró: dejaste de seguir a Milli';
  if (r.approved === false) return 'Rechazaste la descarga';
  switch (action.name) {
    case 'query_parcels': return `${r.total} parcelas · ${Math.round(Number((r.summary as Record<string, number>)?.area_ha ?? 0)).toLocaleString('es-MX')} ha`;
    case 'get_series': return `${r.parcels} parcelas${Array.isArray(r.missing) && r.missing.length ? ` · ${r.missing.length} sin datos` : ''}`;
    case 'read_table': return `${(r.filas as unknown[])?.length ?? 0} de ${r.total} filas`;
    case 'calculator_set': { const t = r.totals as Record<string, unknown> | undefined; return t ? `${t.parcels} parcelas · margen ${money(t.margin)}` : ''; }
    case 'get_region_error': { const o = r.overall as Record<string, number> | undefined; return o ? `MAE ${o.mae?.toFixed(2)} t/ha en ${o.n} parcelas` : ''; }
    case 'map_select_parcels': return `${r.seleccionadas} seleccionadas`;
    case 'write_notes': return `${Number(r.characters).toLocaleString('es-MX')} caracteres`;
    case 'request_export': return r.archivo ? `${r.archivo}` : '';
    default: return 'Hecho';
  }
}
