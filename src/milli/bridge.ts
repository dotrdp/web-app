// The browser side of Milli's MCP tools. The server sends this tab whitelisted commands over the
// live channel; each is validated, routed to the part of the app that owns that state (App, the
// panel, the calculator, regional error, notes), applied with the same handlers the UI uses, and
// answered with the resulting state. While the user isn't following Milli, view changes are kept
// (latest per category) instead of applied, and replayed when they click the eye.
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { categoryOf, milli } from './store';

type Args = Record<string, unknown>;
export type Controller = {
  /** Sections for get_screen_state, keyed by section name (vista, mapa, panel, economia, notas, herramientas). */
  snapshot?: () => Record<string, unknown>;
  commands?: Record<string, (args: Args) => unknown>;
};
type Page = 'mapa' | 'panel' | 'economia';

const controllers = new Map<string, { current: Controller }>();
const waiting = new Set<() => void>();

/** Registers a part of the app with Milli for as long as it is mounted; always calls its latest render's handlers. */
export function useMilliController(name: string, controller: Controller) {
  const ref = useRef(controller); ref.current = controller;
  useEffect(() => {
    controllers.set(name, ref); waiting.forEach(w => w());
    return () => { if (controllers.get(name) === ref) controllers.delete(name); };
  }, [name]);
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
/** Waits for a controller to mount (after a page change), up to `ms`. */
function waitFor(name: string, ms = 3000): Promise<Controller | null> {
  const now = controllers.get(name)?.current;
  if (now) return Promise.resolve(now);
  return new Promise(resolve => {
    const check = () => { const c = controllers.get(name)?.current; if (c) { done(); resolve(c); } };
    const timer = setTimeout(() => { done(); resolve(null); }, ms);
    const done = () => { clearTimeout(timer); waiting.delete(check); };
    waiting.add(check);
  });
}
/** Calls another controller's command if it is mounted (used across parts, e.g. App asking the panel for its checked rows). */
export function peek<T>(name: string, command: string, args: Args = {}): T | undefined {
  return controllers.get(name)?.current.commands?.[command]?.(args) as T | undefined;
}
/** Waits for a controller and calls its command (App opening Notas, then filling it in). */
export async function callWhenReady(name: string, command: string, args: Args = {}) {
  const c = await waitFor(name); return c?.commands?.[command]?.(args);
}

// ── Whitelist: every command the screen accepts, with its arguments ─────────────────────────────
const id = z.string().min(1).max(64), ids = z.array(id).max(300);
const year = z.number().int().min(2022).max(2025);
const TABLES = z.enum(['estimaciones', 'economia']);
const SCHEMAS: Record<string, z.ZodTypeAny> = {
  state: z.object({ sections: z.array(z.enum(['vista', 'mapa', 'panel', 'economia', 'notas', 'herramientas'])).optional() }),
  read_table: z.object({ table: z.enum(['estimaciones', 'municipios', 'economia', 'error_municipios', 'atributos']), offset: z.number().int().min(0).default(0), limit: z.number().int().min(1).max(200).default(50), columns: z.array(z.string()).optional() }),
  navigate: z.object({ page: z.enum(['mapa', 'panel', 'economia']) }),
  open_panel: z.object({ panel: z.enum(['capas', 'mapa_base', 'tabla', 'filtros', 'ajustes', 'notas', 'ninguno']) }),
  map_fly_to: z.object({ parcel_id: id.optional(), bbox: z.array(z.number()).length(4).optional(), all: z.boolean().optional() }),
  select_parcel: z.object({ parcel_id: id }),
  map_select_parcels: z.object({ parcel_ids: ids.min(1) }),
  set_map_layer: z.object({ mode: z.enum(['rendimiento', 'vegetacion']).optional(), yield_field: z.enum(['estimado', 'registrado']).optional(), classification: z.enum(['continua', 'cuantiles', 'intervalos']).optional(),
    heatmap: z.boolean().optional(), opacity: z.number().min(0).max(1).optional(), basemap: z.enum(['topo', 'light', 'dark', 'satellite']).optional(), states_overlay: z.boolean().optional(), municipalities_overlay: z.boolean().optional() }),
  set_map_filters: z.object({ state: z.enum(['all', 'Hidalgo', 'Puebla', 'Tlaxcala']).optional(), group: z.enum(['all', 'reservadas', 'con_rendimiento', 'propias']).optional(),
    yield_band: z.array(z.number()).length(2).nullable().optional(), reset: z.boolean().optional() }),
  set_time: z.object({ year, month: z.number().int().min(1).max(12) }),
  table_set: z.object({ table: TABLES, set_tab: z.enum(['todas', 'reservadas', 'con_rendimiento', 'por_municipio']).optional(), search: z.string().max(80).optional(),
    column_filters: z.array(z.object({ column: z.string(), value: z.unknown() })).optional(), sorting: z.array(z.object({ column: z.string(), desc: z.boolean().default(false) })).optional() }),
  table_check: z.object({ table: TABLES, mode: z.enum(['set', 'add', 'remove', 'all', 'none']), parcel_ids: ids.optional() }),
  plot_set: z.object({ year }),
  show_series: z.object({ ids, year }),
  calculator_set: z.object({ price: z.number().min(0).optional(), cost_ha: z.number().min(0).nullable().optional(),
    seed: z.object({ unit: z.enum(['kg', 'bulto']), price: z.number().optional(), per_m2: z.number().optional(), tkw: z.number().optional(), bag_price: z.number().optional(), bag_m2: z.number().optional(), other: z.number().optional() }).optional(),
    coverage: z.enum(['0.5', '0.8', '0.9']).optional(), scope: z.enum(['all', 'prediction', 'training']).optional(), checked_parcel_ids: ids.optional() }),
  region_error_drill: z.object({ state: z.enum(['Hidalgo', 'Puebla', 'Tlaxcala']).nullable() }),
  show_notes: z.object({ text: z.string().max(50_000) }),
  download: z.object({ kind: z.enum(['estimaciones_csv', 'entrega_csv', 'parcelas_geojson', 'mapa_png', 'seleccion_csv']), scope: z.enum(['mostradas', 'seleccionadas', 'todas']).default('mostradas'), reason: z.string().optional() }),
};

/** Who handles a command, the page it lives on, and the state section that shows its effect. */
function route(command: string, args: Args): { owner: string; page?: Page; section?: string } {
  switch (command) {
    case 'read_table': return { estimaciones: { owner: 'estimacion', page: 'panel' as Page }, municipios: { owner: 'estimacion', page: 'panel' as Page }, economia: { owner: 'economia', page: 'economia' as Page }, error_municipios: { owner: 'region', page: 'economia' as Page } }[args.table as string] ?? { owner: 'app' };
    case 'table_set': case 'table_check': return args.table === 'economia' ? { owner: 'economia', page: 'economia', section: 'economia' } : { owner: 'estimacion', page: 'panel', section: 'panel' };
    case 'plot_set': case 'show_series': return { owner: 'estimacion', page: 'panel', section: 'panel' };
    case 'calculator_set': return { owner: 'economia', page: 'economia', section: 'economia' };
    case 'region_error_drill': return { owner: 'region', page: 'economia', section: 'economia' };
    case 'state': return { owner: 'app' };
    case 'download': return { owner: 'app' };
    case 'show_notes': return { owner: 'app', section: 'notas' };
    default: return { owner: 'app', section: command === 'navigate' || command === 'open_panel' ? 'vista' : 'mapa' };
  }
}
/** Commands that only read or that the user explicitly approved: they run even when not following. */
const ALWAYS = new Set(['state', 'read_table', 'download']);

/** get_screen_state: every mounted part's sections, merged; parts not on screen say so. */
export function snapshot(sections?: string[]) {
  const out: Record<string, Record<string, unknown>> = {};
  for (const [, ref] of controllers) for (const [k, v] of Object.entries(ref.current.snapshot?.() ?? {})) out[k] = { ...out[k], ...(v as Record<string, unknown>) };
  out.panel ??= { en_pantalla: false, nota: 'El panel de control no está abierto; navigate(page: "panel") lo muestra.' };
  out.economia ??= { en_pantalla: false, nota: 'La calculadora no está abierta; navigate(page: "economia") la muestra (calculator_set calcula aunque no esté).' };
  const s = milli.get();
  out.vista = { ...out.vista, siguiendo_a_milli: s.following, cambios_pendientes_por_mostrar: s.deferred.length };
  return sections?.length ? Object.fromEntries(Object.entries(out).filter(([k]) => sections.includes(k))) : out;
}

/** Runs one command from the server. Never throws: errors come back as {ok:false}. */
export async function execute(command: string, raw: unknown, { replay = false } = {}): Promise<{ ok: true; result: unknown } | { ok: false; error: string }> {
  const schema = SCHEMAS[command];
  if (!schema) return { ok: false, error: `Comando no permitido: ${command}.` };
  const parsed = schema.safeParse(raw ?? {});
  if (!parsed.success) return { ok: false, error: `Argumentos no válidos para ${command}: ${parsed.error.issues.map(i => `${i.path.join('.') || 'args'} ${i.message}`).join('; ')}` };
  const args = parsed.data as Args;
  try {
    if (command === 'state') return { ok: true, result: snapshot(args.sections as string[] | undefined) };
    const following = milli.get().following;
    if (!following && !replay && !ALWAYS.has(command)) {
      milli.defer(categoryOf({ command, args }), { command, args });
      return { ok: true, result: { shown: false, reason: 'El usuario dejó de seguirte; el cambio se mostrará cuando pulse el ojo. Los datos de las herramientas de datos siguen siendo correctos.' } };
    }
    const r = route(command, args);
    let owner = controllers.get(r.owner)?.current;
    if (!owner && r.page) {
      if (!following && !replay) return { ok: false, error: 'Esa tabla no está en pantalla y el usuario no te está siguiendo. Usa query_parcels, get_series o get_region_error para leer los datos.' };
      await controllers.get('app')?.current.commands?.navigate?.({ page: r.page });
      owner = (await waitFor(r.owner)) ?? undefined;
    }
    const handler = owner?.commands?.[command];
    if (!handler) return { ok: false, error: 'Esa parte de la aplicación no está disponible ahora mismo.' };
    const result = await handler(args);
    if (command === 'read_table') return { ok: true, result };
    await sleep(80); // let React render the change before reading it back
    const after = r.section ? snapshot([r.section]) : undefined;
    return { ok: true, result: { shown: true, ...(result && typeof result === 'object' ? result : {}), ...(after ? { estado: after } : {}) } };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'La pantalla no pudo hacerlo.' };
  }
}

/** The eye: show everything Milli changed while the user wasn't following, then follow again. */
export async function replayDeferred() {
  const pending = milli.get().deferred;
  milli.setFollowing(true);
  for (const d of pending) await execute(d.command, d.args, { replay: true });
}
