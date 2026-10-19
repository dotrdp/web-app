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
const LAYER_NAMES: Record<string, string> = { ndvi: 'Vegetación', water: 'Agua', precipitation: 'Lluvia', tmax: 'Temperatura máxima', tmin: 'Temperatura mínima', elevation: 'Elevación', slope: 'Pendiente', heatmap: 'Mapa de calor', municipalities: 'Municipios' };
const SOURCES: Record<string, string> = { parcelas: 'las parcelas', serie_mensual: 'la serie mensual', error_regional: 'el error regional', embeddings: 'los embeddings satelitales', adjunto: 'el CSV adjunto' };
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
    case 'set_map_layer': {
      const on = ((a.layers as { id: string; on?: boolean }[] | undefined) ?? []).filter(l => l.on).map(l => LAYER_NAMES[l.id] ?? l.id);
      return a.all_off ? 'Apagar las capas del mapa' : on.length ? `Mostrar ${on.join(' y ').toLowerCase()}` : 'Ajustar las capas del mapa';
    }
    case 'set_map_filters': return a.reset ? 'Quitar los filtros del mapa' : a.state && a.state !== 'all' ? `Filtrar el mapa: ${a.state}` : 'Filtrar el mapa';
    case 'set_time': return `Mapa en ${MONTHS[Number(a.month) - 1] ?? ''} ${a.year}`;
    case 'table_set': return a.set_tab ? `Tabla: ${String(a.set_tab).replace('_', ' ')}` : 'Ajustar la tabla';
    case 'table_check': return a.mode === 'none' ? 'Quitar las marcas' : a.mode === 'all' ? 'Marcar todas las filas' : `Marcar ${count(a.parcel_ids, 'fila', 'filas')}`;
    case 'plot_set': return `Gráfica de ${a.year}`;
    case 'calculator_set': return 'Calcular la economía';
    case 'region_error_drill': return a.state ? `Error por municipio en ${a.state}` : 'Error por estado';
    case 'write_notes': return 'Escribir en Notas';
    case 'data_load': return `Cargar ${SOURCES[String(a.source)] ?? a.source}${a.as ? ` como ${a.as}` : ''}`;
    case 'data_create': return `Crear el dataset ${a.as}`;
    case 'data_transform': return `Transformar ${a.dataset}${a.as && a.as !== a.dataset ? ` → ${a.as}` : ''}`;
    case 'data_describe': return `Describir ${a.dataset}`;
    case 'data_view': return `Leer filas de ${a.dataset}`;
    case 'data_list': return 'Listar datasets y figuras';
    case 'stats_correlation': return `Correlaciones (${a.method ?? 'pearson'}) de ${count(a.columns, 'variable', 'variables')}`;
    case 'stats_regression': return `Regresión de ${a.y}`;
    case 'stats_compare_groups': return `Comparar ${a.value} por ${a.group}`;
    case 'stats_spatial_autocorrelation': return `Autocorrelación espacial de ${a.column}`;
    case 'stats_variogram': return `Variograma de ${a.column}`;
    case 'stats_correlogram': return `Correlograma de ${a.column}`;
    case 'stats_interpolate': return `Interpolar ${a.column} en una malla`;
    case 'stats_pca': return 'Análisis de componentes principales';
    case 'map_show_figure': return 'Mostrar la figura en el mapa';
    case 'map_clear_temp_layers': return 'Quitar las capas temporales del mapa';
    case 'plot_update': return 'Ajustar un elemento de la figura';
    case 'plot_withdraw': return 'Retirar una figura del chat';
    case 'plot_figure': return a.title ? `Nueva figura «${a.title}»` : 'Nueva figura';
    case 'plot_line': return 'Dibujar líneas';
    case 'plot_scatter': return 'Dibujar puntos';
    case 'plot_bar': return 'Dibujar barras';
    case 'plot_hist': return 'Dibujar un histograma';
    case 'plot_hist2d': return 'Dibujar un histograma 2D';
    case 'plot_box': return a.kind === 'violin' ? 'Dibujar violines' : a.kind === 'strip' ? 'Dibujar puntos por categoría' : 'Dibujar cajas';
    case 'plot_kde': return 'Dibujar la densidad';
    case 'plot_errorbar': return 'Dibujar barras de error';
    case 'plot_fill_between': return 'Sombrear una banda';
    case 'plot_heatmap': return 'Dibujar un mapa de calor';
    case 'plot_contour': return 'Dibujar curvas de nivel';
    case 'plot_surface': return 'Dibujar una superficie 3D';
    case 'plot_regression': return `Ajuste ${a.fit === 'lowess' ? 'LOWESS' : a.fit === 'poly' ? 'polinomial' : 'lineal'}`;
    case 'plot_pie': return 'Dibujar un pastel';
    case 'plot_map': return `Capa del mapa: ${a.layer}`;
    case 'plot_reference': return 'Línea de referencia';
    case 'plot_annotate': return 'Anotar la figura';
    case 'plot_axes': return 'Dar formato a los ejes';
    case 'plot_legend': return 'Ajustar la leyenda';
    case 'plot_remove': return 'Quitar un elemento de la figura';
    case 'plot_inspect': return 'Revisar la figura';
    case 'plot_guide': return 'Leer la guía de gráficas';
    case 'plot_show': return 'Mostrar la figura en el chat';
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
    case 'data_load': case 'data_create': case 'data_transform': return `${Number(r.rows).toLocaleString('es-MX')} filas · ${(r.columns as unknown[])?.length ?? 0} columnas`;
    case 'stats_spatial_autocorrelation': return `I de Moran ${r.moran_i} · p ${r.p_permutation ?? r.p_normal}`;
    case 'stats_regression': return `R² ${r.r2} · n ${r.n}`;
    case 'stats_correlation': return `${Object.keys(r.matrix as object ?? {}).length} variables`;
    case 'stats_compare_groups': { const an = r.anova as { p?: number } | undefined; return `ANOVA p ${an?.p ?? '—'}`; }
    case 'stats_variogram': { const f = r.fit as { practical_range_km?: number } | null; return f ? `alcance ${f.practical_range_km} km` : `${(r.bins as unknown[])?.length ?? 0} clases`; }
    case 'plot_show': return `En el chat · versión ${r.version}${Array.isArray(r.on_app_map) && r.on_app_map.length ? ' · y en el mapa' : ''}`;
    case 'stats_pca': { const e = r.explained as { variance_share: number }[] | undefined; return e ? `PC1 ${Math.round(e[0].variance_share * 100)} % · PC2 ${Math.round((e[1]?.variance_share ?? 0) * 100)} %` : ''; }
    case 'request_export': return r.archivo ? `${r.archivo}` : '';
    default: return action.name.startsWith('plot_') && typeof r.points === 'number' ? `${Number(r.points).toLocaleString('es-MX')} puntos` : 'Hecho';
  }
}
