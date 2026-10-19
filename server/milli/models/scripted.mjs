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
          ['plot_figure', { title: `NDVI y lluvia 2025 · ${ranked.length} parcelas`, subtitle: 'Promedio del grupo por mes', caption: 'NDVI de FIRA (Sentinel-2, ≤30 % nubes) y lluvia CHIRPS.' }],
          ['plot_bar', { x: MONTH_LABELS, y: s.average.map(m => m.precip_mm ?? null), y_axis: 'right', color: 'azul', alpha: 0.45, label: 'Lluvia (mm)' }],
          ['plot_line', { x: MONTH_LABELS, y: s.average.map(m => m.ndvi_mean ?? null), color: 'verde', marker: true, label: 'NDVI medio', sort: false }],
          ['plot_reference', { kind: 'vline', value: 'jul', label: 'Julio' }],
          ['plot_axes', { x: { label: 'Mes 2025', order: MONTH_LABELS }, y: { label: 'NDVI', lim: [0, 1] }, y2: { label: 'Lluvia (mm)' } }],
          ['plot_show', {}],
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
      const answer = `**NDVI de julio de 2025 · ${ranked.length} parcelas reservadas**\n\n- NDVI medio del grupo: **${fmt(s.average[6]?.ndvi_mean, 3)}** (lluvia de julio: ${fmt(s.average[6]?.precip_mm, 0)} mm).\n- Más verdes: ${ranked.slice(0, 3).map(id => `**${id}** ${fmt(july(id), 3)}`).join(', ')}.\n- Menos verdes: ${ranked.slice(-3).map(id => `**${id}** ${fmt(july(id), 3)}`).join(', ')}.\n\nLa figura de arriba muestra la temporada del grupo. Las dejé marcadas en el panel con su gráfica de 2025 y anoté el resumen en Notas. ${approved ? 'Descargué la tabla en CSV.' : 'No descargué la tabla porque no diste permiso.'}`;
      return { reasoning: 'Tengo todo: cierro la tarea con la respuesta.',
        calls: [['update_task', { screen_id: screen, step: 4, status: approved ? 'done' : 'skipped' }], ['finish_task', { screen_id: screen, answer }]] };
    },
  ],
};

const plotScenario = {
  match: t => /gr[aá]fic|plot|dispersi|diagrama|figura/i.test(t),
  steps: [
    ({ screen }) => ({ reasoning: 'Quieren ver qué tan bien estima el modelo. Cargo las parcelas con rendimiento registrado y el error por estado como datasets y armo una figura de dos paneles: dispersión de estimado contra registrado y barras del error.',
      calls: [['start_task', { screen_id: screen, title: 'Estimado contra registrado', goal: 'Graficar el rendimiento estimado contra el registrado y el error por estado.', steps: ['Cargar las parcelas con rendimiento registrado', 'Medir el error por estado', 'Graficar', 'Responder'] }]] }),
    ({ screen }) => ({ reasoning: 'Cargo las parcelas con rendimiento registrado (estimado fuera de partición).',
      calls: [['update_task', { screen_id: screen, step: 0, status: 'running' }], ['data_load', { source: 'parcelas', as: 'p', filters: { group: 'con_rendimiento' } }]] }),
    ({ screen, results }) => ({ reasoning: `Son ${results.data_load.rows} parcelas. Ahora el error por estado.`,
      calls: [['update_task', { screen_id: screen, step: 0, status: 'done', note: `${results.data_load.rows} parcelas` }], ['update_task', { screen_id: screen, step: 1, status: 'running' }],
        ['data_load', { source: 'error_regional', level: 'estado', as: 'e' }], ['get_region_error', { level: 'estado' }]] }),
    ({ screen, results }) => ({ reasoning: 'Armo la figura: arriba la dispersión por estado con la recta y = x, abajo el MAE y RMSE de cada estado con el MAE global como referencia. Luego reviso la imagen.',
      calls: [['update_task', { screen_id: screen, step: 1, status: 'done' }], ['update_task', { screen_id: screen, step: 2, status: 'running' }],
        ['plot_figure', { title: '¿Qué tan bien estima el modelo?', subtitle: '138 parcelas con rendimiento registrado · estimado fuera de partición', mosaic: [['disp'], ['err']], subplot_titles: ['Estimado contra registrado', 'Error por estado'], height: 640 }],
        ['plot_scatter', { ax: 'disp', dataset: 'p', x: 'observed', y: 'predicted', color_by: 'state', hover: ['id', 'municipality'] }],
        ['plot_reference', { ax: 'disp', kind: 'identity', label: 'y = x' }],
        ['plot_axes', { ax: 'disp', x: { label: 'Registrado (t/ha)' }, y: { label: 'Estimado (t/ha)' }, equal_aspect: true }],
        ['plot_bar', { ax: 'err', dataset: 'e', x: 'region', y: 'mae', color: 'verde', label: 'MAE', labels: true, label_format: '.2f' }],
        ['plot_bar', { ax: 'err', dataset: 'e', x: 'region', y: 'rmse', color: 'ambar', label: 'RMSE', labels: true, label_format: '.2f' }],
        ['plot_reference', { ax: 'err', kind: 'hline', value: results.get_region_error.overall.mae, label: 'MAE global' }],
        ['plot_axes', { ax: 'err', x: { label: 'Estado' }, y: { label: 'Error (t/ha)' } }],
        ['plot_show', {}]] }),
    ({ screen, results }) => {
      const e = results.get_region_error, worst = [...e.regions].sort((a, b) => (b.measured?.mae ?? 0) - (a.measured?.mae ?? 0))[0];
      const answer = `Armé una figura de dos paneles con las **${e.overall.n} parcelas** que tienen rendimiento registrado:\n\n1. **Estimado contra registrado**: cada punto es una parcela, por estado; cuanto más cerca de la diagonal y = x, mejor la estimación.\n2. **Error por estado**: ${e.regions.map(r => `${r.name} MAE ${fmt(r.measured?.mae)} t/ha`).join(', ')}.\n\nEl MAE global es **${fmt(e.overall.mae)} t/ha**; ${worst.name} es donde más se equivoca el modelo.`;
      return { reasoning: 'La imagen se lee bien. Cierro con la lectura de la figura.', calls: [['update_task', { screen_id: screen, step: 2, status: 'done' }], ['update_task', { screen_id: screen, step: 3, status: 'done' }], ['finish_task', { screen_id: screen, answer }]] };
    },
  ],
};

const spatialScenario = {
  match: t => /espacial|autocorrel|moran|lisa|variograma|vecin/i.test(t),
  steps: [
    ({ screen }) => ({ reasoning: 'Me preguntan si el error del modelo tiene estructura espacial. Cargo las parcelas con error medido, pruebo la autocorrelación (Moran global y LISA), calculo el variograma y lo dibujo: diagrama de Moran, mapa LISA y variograma.',
      calls: [['start_task', { screen_id: screen, title: 'Autocorrelación espacial del error', goal: 'Saber si las parcelas cercanas tienen errores parecidos y dónde.', steps: ['Cargar las parcelas con error medido', 'Probar la autocorrelación (Moran y LISA)', 'Calcular el variograma', 'Graficar', 'Responder'] }]] }),
    ({ screen }) => ({ reasoning: 'Cargo las parcelas con rendimiento registrado: tienen el error fuera de partición y su centroide.',
      calls: [['update_task', { screen_id: screen, step: 0, status: 'running' }], ['data_load', { source: 'parcelas', as: 'p', filters: { group: 'con_rendimiento' } }]] }),
    ({ screen, results }) => ({ reasoning: `Son ${results.data_load.rows} parcelas. Pruebo la autocorrelación del error con 8 vecinos más cercanos y 999 permutaciones.`,
      calls: [['update_task', { screen_id: screen, step: 0, status: 'done', note: `${results.data_load.rows} parcelas` }], ['update_task', { screen_id: screen, step: 1, status: 'running' }],
        ['stats_spatial_autocorrelation', { dataset: 'p', column: 'error', weights: { type: 'knn', k: 8 }, permutations: 999 }]] }),
    ({ screen, results }) => {
      const m = results.stats_spatial_autocorrelation;
      return { reasoning: `I de Moran = ${fmt(m.moran_i, 3)} (p = ${fmt(m.p_permutation, 3)}): ${m.reading}. Ahora el variograma para ver a qué distancia llega la dependencia.`,
        calls: [['update_task', { screen_id: screen, step: 1, status: 'done', note: `I = ${fmt(m.moran_i, 3)}, p = ${fmt(m.p_permutation, 3)}` }], ['update_task', { screen_id: screen, step: 2, status: 'running' }],
          ['stats_variogram', { dataset: 'p', column: 'error', model: 'spherical', bins: 12 }]] };
    },
    ({ screen, results }) => {
      const v = results.stats_variogram;
      return { reasoning: 'Armo la figura de tres paneles: diagrama de Moran (la pendiente es I), mapa LISA de las parcelas con los límites municipales y el variograma con su modelo.',
        calls: [['update_task', { screen_id: screen, step: 2, status: 'done' }], ['update_task', { screen_id: screen, step: 3, status: 'running' }],
          ['plot_figure', { title: '¿El error del modelo se agrupa en el espacio?', subtitle: 'Error = estimado − registrado · 8 vecinos más cercanos', mosaic: [['moran'], ['lisa'], ['vario']], axes_types: { lisa: 'map' }, subplot_titles: ['Diagrama de Moran', 'Clusters LISA (p < 0.05)', 'Semivariograma'], height: 1020 }],
          ['plot_scatter', { ax: 'moran', dataset: 'p', x: 'error_z', y: 'error_lag', color_by: 'error_lisa', hover: ['id', 'municipality', 'error'] }],
          ['plot_regression', { ax: 'moran', dataset: 'p', x: 'error_z', y: 'error_lag', scatter: false, color: 'gris', label: 'I de Moran' }],
          ['plot_reference', { ax: 'moran', kind: 'hline', value: 0, dash: 'dot' }], ['plot_reference', { ax: 'moran', kind: 'vline', value: 0, dash: 'dot' }],
          ['plot_axes', { ax: 'moran', x: { label: 'Error estandarizado (z)' }, y: { label: 'Rezago espacial de z' } }],
          ['plot_map', { ax: 'lisa', layer: 'parcelas', dataset: 'p', color_by: 'error_lisa', hover: ['id', 'municipality', 'error'] }],
          ['plot_map', { ax: 'lisa', layer: 'limites', which: 'municipios' }],
          ['plot_scatter', { ax: 'vario', dataset: v.datasets[0], x: 'lag_km', y: 'gamma', size_by: 'pairs', color: 'verde', label: 'Empírico' }],
          ...(v.fit ? [['plot_line', { ax: 'vario', dataset: v.datasets[1], x: 'lag_km', y: 'gamma', color: 'ambar', label: v.fit.model === 'pepita pura' ? 'Modelo: pepita pura (sin estructura)' : `Modelo esférico (alcance ${fmt(v.fit.practical_range_km, 1)} km)` }]] : []),
          ['plot_reference', { ax: 'vario', kind: 'hline', value: v.sample_variance, label: 'Varianza' }],
          ['plot_axes', { ax: 'vario', x: { label: 'Distancia (km)' }, y: { label: 'Semivarianza (t/ha)²' } }],
          ['plot_legend', { position: 'top' }],
          ['plot_show', {}]] };
    },
    ({ screen, results }) => {
      const m = results.stats_spatial_autocorrelation, v = results.stats_variogram, c = m.lisa_counts ?? {};
      const answer = `**${m.reading[0].toUpperCase()}${m.reading.slice(1)}.**\n\n- I de Moran del error: **${fmt(m.moran_i, 3)}** (esperado ${fmt(m.expected_i, 3)}; p por permutaciones = ${fmt(m.p_permutation, 3)}). C de Geary = ${fmt(m.geary_c, 3)}.\n- Clusters LISA significativos: ${['HH', 'LL', 'HL', 'LH'].map(k => `${k} ${c[k] ?? 0}`).join(', ')} de ${m.n} parcelas.\n${v.fit ? (v.fit.model === 'pepita pura' ? `- Variograma: ${v.fit.dependence}.\n` : `- Variograma esférico: pepita ${fmt(v.fit.nugget, 3)}, meseta ${fmt(v.fit.sill, 3)}, alcance práctico ${fmt(v.fit.practical_range_km, 1)} km; dependencia ${v.fit.dependence}.\n`) : ''}\nLa figura muestra el diagrama de Moran (pendiente = I), el mapa de clusters y el variograma.`;
      return { reasoning: 'Cierro con la interpretación.', calls: [['update_task', { screen_id: screen, step: 3, status: 'done' }], ['update_task', { screen_id: screen, step: 4, status: 'done' }], ['finish_task', { screen_id: screen, answer }]] };
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

export const SCENARIOS = [csvScenario, spatialScenario, plotScenario, ndviScenario, economicsScenario, mapScenario, screenScenario];

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
