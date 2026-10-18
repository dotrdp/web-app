// Scripted model: a stand-in for a real LLM that drives Milli through the same ModelAdapter
// interface, so the whole pipeline (MCP tools, live screen, chat, approvals, end of sequence) can be
// built and tested without a provider.
//
// ModelAdapter interface (what a real provider adapter implements):
//   stream({ system, messages, tools, signal, context }) → AsyncIterable of
//     { type: 'reasoning', delta } | { type: 'text', delta } | { type: 'tool_call', id?, name, args }
//   One call is one assistant turn; the loop runs the tool calls and calls stream() again.
//
// Each scenario is a list of steps; step N runs on the Nth assistant turn after the user's message
// and can read every earlier tool result, so later steps use real data (ids, totals, series).
const STATES = ['Hidalgo', 'Puebla', 'Tlaxcala'];
const fmt = (v, d = 2) => v == null ? '—' : Number(v).toLocaleString('es-MX', { minimumFractionDigits: d, maximumFractionDigits: d });
const money = v => v == null ? '—' : Number(v).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
const stateIn = text => STATES.find(s => new RegExp(s, 'i').test(text)) ?? null;
const numberIn = (text, re) => { const m = text.match(re); return m ? Number(m[1].replace(/[,\s]/g, '')) : null; };
const MONTH_LABELS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const delay = (ms, signal) => new Promise(r => { const t = setTimeout(r, ms); signal?.addEventListener('abort', () => { clearTimeout(t); r(); }, { once: true }); });

/** Turn context: the user's text, attachments, earlier results by tool name, the screen id. */
function turn(messages, context) {
  const lastUser = messages.findLastIndex(m => m.role === 'user' && !m.internal);
  const user = messages[lastUser];
  const after = messages.slice(lastUser + 1);
  const results = {};
  for (const m of after) if (m.role === 'tool') { try { results[m.name] = JSON.parse(m.result); } catch { results[m.name] = { error: m.result }; } }
  return {
    text: user?.content.find(c => c.type === 'text')?.text ?? '',
    attachments: user?.content.filter(c => c.type === 'attachment') ?? [],
    step: after.filter(m => m.role === 'assistant').length,
    results, screen: context.screenId,
  };
}

// ── Scenarios ─────────────────────────────────────────────────────────────────────────────────
const ndviScenario = {
  match: t => /ndvi|vegetaci/i.test(t),
  steps: [
    ({ screen, text }) => {
      const municipality = /calpulalpan/i.test(text) ? 'Calpulalpan' : /chignahuapan/i.test(text) ? 'Chignahuapan' : /singuilucan/i.test(text) ? 'Singuilucan' : 'Calpulalpan';
      return { reasoning: `Me piden comparar el NDVI de julio de 2025 en las parcelas reservadas de ${municipality}, dejar una nota y exportar la tabla. Voy a buscar las parcelas, leer su serie mensual de NDVI y lluvia, mostrarlas en el panel, anotar lo importante y pedir permiso para exportar.`,
        calls: [['start_task', { screen_id: screen, title: `NDVI de julio 2025 · ${municipality}`, goal: `Comparar el NDVI de julio de 2025 en las parcelas reservadas de ${municipality}, anotarlo y exportar la tabla.`,
          steps: [`Buscar las parcelas reservadas de ${municipality}`, 'Leer NDVI y lluvia de 2025', 'Mostrarlas en el panel', 'Anotar los hallazgos', 'Exportar la tabla'] }]], memo: { municipality } };
    },
    ({ screen, text }) => {
      const municipality = /chignahuapan/i.test(text) ? 'Chignahuapan' : /singuilucan/i.test(text) ? 'Singuilucan' : 'Calpulalpan';
      return { reasoning: `Busco en el atlas las parcelas reservadas de ${municipality}; no dependo de lo que muestre la pantalla.`,
        calls: [['update_task', { screen_id: screen, step: 0, status: 'running' }], ['query_parcels', { municipality, group: 'reservadas', fields: ['id', 'area', 'predicted'], limit: 200 }]] };
    },
    ({ screen, results }) => {
      const ids = results.query_parcels.rows.map(r => r.id);
      return { reasoning: `Encontré ${ids.length} parcelas. Leo su NDVI (media, mínimo, máximo) y la lluvia de 2025, y le pido a la pantalla que anime la gráfica recorriéndolas.`,
        calls: [['update_task', { screen_id: screen, step: 0, status: 'done', note: `${ids.length} parcelas` }], ['update_task', { screen_id: screen, step: 1, status: 'running' }],
          ['get_series', { parcel_ids: ids, years: [2025], metrics: ['ndvi_mean', 'ndvi_min', 'ndvi_max', 'precip'], show: true, screen_id: screen }]] };
    },
    ({ screen, results }) => {
      const s = results.get_series, july = id => s.by_parcel[id]?.[6]?.ndvi_mean;
      const ranked = Object.keys(s.by_parcel).filter(id => july(id) != null).sort((a, b) => july(b) - july(a));
      return { reasoning: `En julio de 2025 el NDVI medio del grupo fue ${fmt(s.average[6]?.ndvi_mean, 3)} con ${fmt(s.average[6]?.precip_mm, 0)} mm de lluvia. La más verde es ${ranked[0]} (${fmt(july(ranked[0]), 3)}) y la menos ${ranked.at(-1)} (${fmt(july(ranked.at(-1)), 3)}). Ahora las marco en la tabla del panel para que la gráfica las muestre.`,
        calls: [['update_task', { screen_id: screen, step: 1, status: 'done', note: `NDVI julio ${fmt(s.average[6]?.ndvi_mean, 3)}` }], ['update_task', { screen_id: screen, step: 2, status: 'running' }],
          ['create_plot', { title: `NDVI y lluvia 2025 · ${ranked.length} parcelas`, subtitle: 'Promedio del grupo por mes', kind: 'line', x: MONTH_LABELS,
            y_label: 'NDVI', y_min: 0, y_max: 1, y2_label: 'Lluvia', y2_unit: 'mm',
            series: [{ name: 'NDVI medio', values: s.average.map(m => m.ndvi_mean ?? null), color: 'verde' }, { name: 'Lluvia', values: s.average.map(m => m.precip_mm ?? null), type: 'bar', axis: 'right', color: 'azul' }],
            reference_lines: [{ axis: 'x', value: 'jul', label: 'Julio' }], note: 'NDVI de FIRA (Sentinel-2, ≤30 % nubes) y lluvia CHIRPS.' }],
          ['navigate', { screen_id: screen, page: 'panel' }], ['table_set', { screen_id: screen, table: 'estimaciones', set_tab: 'reservadas', search: '' }],
          ['table_check', { screen_id: screen, table: 'estimaciones', mode: 'set', parcel_ids: ranked }], ['plot_set', { screen_id: screen, year: 2025 }]], memo: { ranked } };
    },
    ({ screen, results }) => {
      const s = results.get_series, july = id => s.by_parcel[id]?.[6]?.ndvi_mean;
      const ranked = Object.keys(s.by_parcel).filter(id => july(id) != null).sort((a, b) => july(b) - july(a));
      const note = `NDVI julio 2025 · ${ranked.length} parcelas reservadas: media ${fmt(s.average[6]?.ndvi_mean, 3)}, lluvia ${fmt(s.average[6]?.precip_mm, 0)} mm.\nMás verdes: ${ranked.slice(0, 3).map(id => `${id} (${fmt(july(id), 3)})`).join(', ')}.\nMenos verdes: ${ranked.slice(-3).map(id => `${id} (${fmt(july(id), 3)})`).join(', ')}.`;
      return { reasoning: 'Dejo el resumen en las notas de la cuenta para que todo el equipo lo vea.',
        calls: [['update_task', { screen_id: screen, step: 2, status: 'done' }], ['update_task', { screen_id: screen, step: 3, status: 'running' }], ['write_notes', { screen_id: screen, mode: 'append', text: note }]] };
    },
    ({ screen }) => ({ reasoning: 'Para exportar necesito el permiso del usuario; se lo pido.',
      calls: [['update_task', { screen_id: screen, step: 3, status: 'done' }], ['update_task', { screen_id: screen, step: 4, status: 'running' }],
        ['request_export', { screen_id: screen, kind: 'estimaciones_csv', scope: 'seleccionadas', reason: 'Tabla de las parcelas comparadas.' }]] }),
    ({ screen, results }) => {
      const s = results.get_series, july = id => s.by_parcel[id]?.[6]?.ndvi_mean;
      const ranked = Object.keys(s.by_parcel).filter(id => july(id) != null).sort((a, b) => july(b) - july(a));
      const approved = results.request_export?.approved !== false && !results.request_export?.error;
      const answer = `**NDVI de julio de 2025 · ${ranked.length} parcelas reservadas**\n\n- NDVI medio del grupo: **${fmt(s.average[6]?.ndvi_mean, 3)}** (lluvia de julio: ${fmt(s.average[6]?.precip_mm, 0)} mm).\n- Más verdes: ${ranked.slice(0, 3).map(id => `**${id}** ${fmt(july(id), 3)}`).join(', ')}.\n- Menos verdes: ${ranked.slice(-3).map(id => `**${id}** ${fmt(july(id), 3)}`).join(', ')}.\n\nLa gráfica de arriba muestra la temporada del grupo. Las dejé marcadas en el panel con su gráfica de 2025 y anoté el resumen en Notas. ${approved ? 'Descargué la tabla en CSV.' : 'No descargué la tabla porque no diste permiso.'}`;
      return { reasoning: 'Tengo todo: cierro la tarea con la respuesta.',
        calls: [['update_task', { screen_id: screen, step: 4, status: approved ? 'done' : 'skipped' }], ['finish_task', { screen_id: screen, answer }]] };
    },
  ],
};

const plotScenario = {
  match: t => /gr[aá]fic|plot|dispersi|diagrama/i.test(t),
  steps: [
    ({ screen }) => ({ reasoning: 'Quieren ver qué tan bien estima el modelo. Leo las parcelas con rendimiento registrado, mido el error por estado y lo dibujo en el chat: dispersión de estimado contra registrado y barras del error.',
      calls: [['start_task', { screen_id: screen, title: 'Estimado contra registrado', goal: 'Graficar el rendimiento estimado contra el registrado y el error por estado.', steps: ['Leer las parcelas con rendimiento registrado', 'Medir el error por estado', 'Graficar', 'Responder'] }]] }),
    ({ screen }) => ({ reasoning: 'Busco las parcelas con rendimiento registrado y su estimado fuera de partición.',
      calls: [['update_task', { screen_id: screen, step: 0, status: 'running' }], ['query_parcels', { has_observed: true, fields: ['id', 'state', 'municipality', 'observed', 'predicted'], limit: 500 }]] }),
    ({ screen, results }) => ({ reasoning: `Son ${results.query_parcels.total} parcelas. Ahora el error medido por estado.`,
      calls: [['update_task', { screen_id: screen, step: 0, status: 'done', note: `${results.query_parcels.total} parcelas` }], ['update_task', { screen_id: screen, step: 1, status: 'running' }], ['get_region_error', { level: 'estado' }]] }),
    ({ screen, results }) => {
      const rows = results.query_parcels.rows.filter(r => r.observed != null && r.predicted != null), regions = results.get_region_error.regions;
      return { reasoning: 'Dibujo las dos gráficas: una serie por estado en la dispersión, con la recta y = x, y el MAE y RMSE de cada estado en barras.',
        calls: [['update_task', { screen_id: screen, step: 1, status: 'done' }], ['update_task', { screen_id: screen, step: 2, status: 'running' }],
          ['create_plot', { title: 'Rendimiento estimado contra registrado', subtitle: `${rows.length} parcelas · estimado fuera de partición`, kind: 'scatter', x_label: 'Registrado (t/ha)', y_label: 'Estimado', y_unit: 't/ha', identity_line: true,
            series: STATES.map(st => ({ name: st, points: rows.filter(r => r.state === st).map(r => ({ x: r.observed, y: r.predicted, label: `${r.id} · ${r.municipality}` })) })).filter(x => x.points.length),
            note: 'Sobre la diagonal, el modelo estimó de más; debajo, de menos.' }],
          ['create_plot', { title: 'Error del modelo por estado', kind: 'bar', x: regions.map(r => r.name), y_label: 'Error', y_unit: 't/ha',
            series: [{ name: 'MAE', values: regions.map(r => r.measured?.mae ?? null), color: 'verde' }, { name: 'RMSE', values: regions.map(r => r.measured?.rmse ?? null), color: 'ambar' }],
            reference_lines: [{ axis: 'y', value: results.get_region_error.overall.mae, label: 'MAE global' }] }]] };
    },
    ({ screen, results }) => {
      const e = results.get_region_error, worst = [...e.regions].sort((a, b) => (b.measured?.mae ?? 0) - (a.measured?.mae ?? 0))[0];
      const answer = `Dibujé dos gráficas con las **${results.query_parcels.total} parcelas** que tienen rendimiento registrado:\n\n1. **Estimado contra registrado**: cada punto es una parcela, por estado; cuanto más cerca de la diagonal, mejor la estimación.\n2. **Error por estado**: ${e.regions.map(r => `${r.name} MAE ${fmt(r.measured?.mae)} t/ha`).join(', ')}.\n\nEl MAE global es **${fmt(e.overall.mae)} t/ha**; ${worst.name} es donde más se equivoca el modelo.`;
      return { reasoning: 'Cierro con la lectura de las gráficas.', calls: [['update_task', { screen_id: screen, step: 2, status: 'done' }], ['update_task', { screen_id: screen, step: 3, status: 'done' }], ['finish_task', { screen_id: screen, answer }]] };
    },
  ],
};

const economicsScenario = {
  match: t => /costo|calcula|ganar|econom|margen|ingreso/i.test(t),
  steps: [
    ({ screen, text }) => {
      const state = stateIn(text), cost = numberIn(text, /(\d[\d,\s]{2,})/) ?? 15000;
      return { reasoning: `Quieren saber cuánto dejarían las parcelas${state ? ` de ${state}` : ''} con un costo de ${money(cost)} por hectárea. Elijo las parcelas, las cargo en la calculadora en pantalla y reviso el error esperado para dar un rango honesto.`,
        calls: [['start_task', { screen_id: screen, title: `Margen${state ? ` en ${state}` : ''} con ${money(cost)}/ha`, goal: 'Calcular ingreso, costo y margen estimados con su rango de error.', steps: ['Elegir las parcelas', 'Calcular en la calculadora', 'Revisar el error esperado', 'Responder'] }]] };
    },
    ({ screen, text }) => ({ reasoning: 'Busco las parcelas con estimación.', calls: [['update_task', { screen_id: screen, step: 0, status: 'running' }], ['query_parcels', { state: stateIn(text) ?? undefined, predicted_min: 0, fields: ['id', 'area', 'predicted'], limit: 500 }]] }),
    ({ screen, text, results }) => {
      const ids = results.query_parcels.rows.map(r => r.id), cost = numberIn(text, /(\d[\d,\s]{2,})/) ?? 15000;
      return { reasoning: `Son ${ids.length} parcelas. Las marco en la calculadora y pongo el costo de ${money(cost)} por hectárea.`,
        calls: [['update_task', { screen_id: screen, step: 0, status: 'done', note: `${ids.length} parcelas` }], ['update_task', { screen_id: screen, step: 1, status: 'running' }],
          ['calculator_set', { screen_id: screen, cost_ha: cost, scope: 'all', checked_parcel_ids: ids }]] };
    },
    ({ screen, text }) => {
      const state = stateIn(text);
      return { reasoning: 'Con los totales en pantalla, reviso cuánto se equivoca el modelo en esa región.',
        calls: [['update_task', { screen_id: screen, step: 1, status: 'done' }], ['update_task', { screen_id: screen, step: 2, status: 'running' }],
          ...(state ? [['region_error_drill', { screen_id: screen, state }]] : []), ['get_region_error', { level: state ? 'municipio' : 'estado', state: state ?? undefined }]] };
    },
    ({ screen, text, results }) => {
      const t = results.calculator_set?.totals ?? {}, state = stateIn(text), err = results.get_region_error;
      const answer = `**${state ? `Parcelas de ${state}` : 'Todas las parcelas'} · ${t.parcels ?? '—'} parcelas, ${fmt(t.area, 1)} ha**\n\n- Producción estimada: **${fmt(t.production, 0)} t**\n- Ingreso estimado: **${money(t.income)}** (± ${money(t.band)} con 80 % de cobertura)\n- Costo total: **${money(t.cost)}**\n- Margen estimado: **${money(t.margin)}**\n- Punto de equilibrio: **${fmt(t.breakEven)} t/ha** (${t.above ?? '—'} parcelas lo superan)\n\nError esperado del modelo: ${err.regions.map(r => `${r.name} ±${fmt(r.expected_error_t_ha)} t/ha`).join(', ')}. Dejé la calculadora con estos valores en pantalla.`;
      return { reasoning: 'Listo, respondo con los totales y el rango.', calls: [['update_task', { screen_id: screen, step: 2, status: 'done' }], ['update_task', { screen_id: screen, step: 3, status: 'done' }], ['finish_task', { screen_id: screen, answer }]] };
    },
  ],
};

const mapScenario = {
  match: t => /mapa|mu[eé]strame|ubica|selecciona/i.test(t),
  steps: [
    ({ screen, text }) => ({ reasoning: 'Quieren ver en el mapa un grupo de parcelas. Las busco, ajusto la capa y los filtros y las selecciono.',
      calls: [['start_task', { screen_id: screen, title: `Parcelas en el mapa${stateIn(text) ? ` · ${stateIn(text)}` : ''}`, goal: 'Encontrar las parcelas pedidas y mostrarlas seleccionadas en el mapa.', steps: ['Buscar las parcelas', 'Preparar el mapa', 'Seleccionarlas'] }]] }),
    ({ screen, text }) => ({ reasoning: 'Busco las parcelas en el atlas.', calls: [['update_task', { screen_id: screen, step: 0, status: 'running' }],
      ['query_parcels', { state: stateIn(text) ?? undefined, predicted_min: numberIn(text, /(\d+(?:[.,]\d+)?)\s*t/i) ?? undefined, sort: 'predicted', desc: true, fields: ['id', 'municipality', 'predicted'], limit: 300 }]] }),
    ({ screen, text, results }) => ({ reasoning: `Son ${results.query_parcels.total} parcelas. Enciendo el mapa de calor de la producción y filtro por estado.`,
      calls: [['update_task', { screen_id: screen, step: 0, status: 'done', note: `${results.query_parcels.total} parcelas` }], ['update_task', { screen_id: screen, step: 1, status: 'running' }],
        ['navigate', { screen_id: screen, page: 'mapa' }], ['set_map_layer', { screen_id: screen, layers: [{ id: 'heatmap', on: true }] }], ['set_map_filters', { screen_id: screen, state: stateIn(text) ?? 'all' }]] }),
    ({ screen, results }) => {
      const ids = results.query_parcels.rows.map(r => r.id);
      return { reasoning: 'Las selecciono y encuadro.', calls: [['update_task', { screen_id: screen, step: 1, status: 'done' }], ['update_task', { screen_id: screen, step: 2, status: 'running' }], ['map_select_parcels', { screen_id: screen, parcel_ids: ids }]] };
    },
    ({ screen, results }) => {
      const q = results.query_parcels;
      const answer = `Te dejé **${q.total} parcelas** seleccionadas en el mapa (${fmt(q.summary.area_ha, 1)} ha, ${fmt(q.summary.production_t, 0)} t estimadas, ${fmt(q.summary.mean_yield_t_ha)} t/ha de media).\n\nLas de mayor rendimiento estimado: ${q.rows.slice(0, 3).map(r => `**${r.id}** (${r.municipality}, ${fmt(r.predicted)} t/ha)`).join(', ')}.`;
      return { reasoning: 'Cierro con el resumen.', calls: [['update_task', { screen_id: screen, step: 2, status: 'done' }], ['finish_task', { screen_id: screen, answer }]] };
    },
  ],
};

const csvScenario = {
  match: (t, attachments) => attachments.length > 0,
  steps: [
    ({ screen, attachments }) => ({ reasoning: `El usuario adjuntó ${attachments[0].name} (${attachments[0].rows} filas). Lo leo como datos y lo cruzo con el atlas.`,
      calls: [['start_task', { screen_id: screen, title: `Analizar ${attachments[0].name}`, goal: 'Leer el CSV adjunto y cruzarlo con las parcelas del atlas.', steps: ['Leer el CSV', 'Cruzar con el atlas', 'Responder'] }]] }),
    ({ screen, attachments }) => ({ reasoning: 'Leo las filas del CSV.', calls: [['update_task', { screen_id: screen, step: 0, status: 'running' }], ['read_attachment', { attachment_id: attachments[0].id, limit: 200 }]] }),
    ({ screen, results }) => {
      const a = results.read_attachment, ids = [...new Set(a.rows.flat().filter(v => /^AGC_\d+$/i.test(String(v).trim())).map(v => String(v).trim().toUpperCase()))];
      return { reasoning: `Tiene ${a.total_rows} filas y las columnas ${a.columns.join(', ')}. Encontré ${ids.length} ids de parcela; los busco en el atlas.`,
        calls: [['update_task', { screen_id: screen, step: 0, status: 'done', note: `${a.total_rows} filas` }], ['update_task', { screen_id: screen, step: 1, status: 'running' }],
          ['query_parcels', { ids: ids.length ? ids : ['__ninguno__'], fields: ['id', 'municipality', 'predicted', 'observed'], limit: 200 }]] };
    },
    ({ screen, results }) => {
      const a = results.read_attachment, q = results.query_parcels;
      const answer = `**${a.name}**: ${a.total_rows} filas, columnas ${a.columns.map(c => `\`${c}\``).join(', ')}.\n\n${q.total ? `Coinciden **${q.total} parcelas** del atlas (${fmt(q.summary.area_ha, 1)} ha, ${fmt(q.summary.mean_yield_t_ha)} t/ha estimadas de media).` : 'No encontré ids de parcela del atlas (AGC_…) en el archivo.'}`;
      return { reasoning: 'Respondo con lo que encontré.', calls: [['update_task', { screen_id: screen, step: 1, status: 'done' }], ['update_task', { screen_id: screen, step: 2, status: 'done' }], ['finish_task', { screen_id: screen, answer }]] };
    },
  ],
};

const screenScenario = {
  match: () => true,
  steps: [
    ({ screen }) => ({ reasoning: 'No es un análisis concreto: reviso qué tiene el usuario en pantalla para orientarle.', calls: [['start_task', { screen_id: screen, title: 'Revisar tu pantalla', goal: 'Entender qué estás viendo y sugerir qué puedo hacer.', steps: ['Leer la pantalla', 'Responder'] }]] }),
    ({ screen }) => ({ reasoning: 'Leo el estado completo de la pantalla.', calls: [['update_task', { screen_id: screen, step: 0, status: 'running' }], ['get_screen_state', { screen_id: screen }]] }),
    ({ screen, results }) => {
      const s = results.get_screen_state ?? {}, page = { mapa: 'el mapa', panel: 'el panel de control', economia: 'la calculadora de economía' }[s.vista?.pagina] ?? 'la aplicación';
      const answer = `Estás en **${page}**${s.mapa ? ` (capas: ${s.mapa.capas_activas}, ${s.mapa.parcelas_visibles} parcelas visibles)` : ''}.\n\nPuedo, por ejemplo:\n- comparar el **NDVI** de un grupo de parcelas y mostrarlo en la gráfica,\n- calcular **ingreso y margen** con tu costo por hectárea,\n- **filtrar y seleccionar** parcelas en el mapa,\n- analizar un **CSV** que adjuntes.`;
      return { reasoning: 'Respondo con sugerencias.', calls: [['update_task', { screen_id: screen, step: 0, status: 'done' }], ['update_task', { screen_id: screen, step: 1, status: 'done' }], ['finish_task', { screen_id: screen, answer }]] };
    },
  ],
};

export const SCENARIOS = [csvScenario, plotScenario, ndviScenario, economicsScenario, mapScenario, screenScenario];

export function createScriptedModel({ scenarios = SCENARIOS, pace = 18 } = {}) {
  return {
    name: 'scripted',
    async *stream({ messages, tools, signal, context }) {
      const t = turn(messages, context);
      const scenario = scenarios.find(s => s.match(t.text, t.attachments));
      const step = scenario.steps[t.step];
      if (!step) { yield { type: 'text', delta: 'Terminé.' }; return; }
      const { reasoning, text, calls = [] } = step(t);
      const known = new Set(tools.map(x => x.name));
      for (const [name] of calls) if (!known.has(name)) throw new Error(`El guion llama una herramienta inexistente: ${name}`);
      // Stream reasoning word by word, like a real model.
      for (const word of (reasoning ?? '').split(/(?<= )/)) { if (signal?.aborted) return; yield { type: 'reasoning', delta: word }; if (pace) await delay(pace, signal); }
      if (text) yield { type: 'text', delta: text };
      for (const [name, args] of calls) yield { type: 'tool_call', name, args };
    },
  };
}
