// Milli's analyst tools on the MCP server: datasets (data_*) and statistics (stats_*). Datasets live
// in the conversation's session and are referred to by name, like pandas DataFrames; statistics
// either answer directly or add columns / create datasets that the plot_* tools can draw.
import { z } from 'zod';
import { FUNCTION_NAMES, isNum } from './analysis/expr.mjs';
import { column, COLUMN_DOCS, getDataset, loadSource, makeDataset, rowsOf, store, summarize, transform } from './analysis/frame.mjs';
import { compareGroups, correlation, describe, ols, pca, round, rp } from './analysis/stats.mjs';
import { autocorrelation, correlogram, idw, lmTests, points, variogram, weights } from './analysis/spatial.mjs';

const text = data => ({ content: [{ type: 'text', text: typeof data === 'string' ? data : JSON.stringify(data) }] });
const fail = message => ({ content: [{ type: 'text', text: message }], isError: true });
const safe = fn => async args => { try { return text(await fn(args)); } catch (e) { return fail(e.message); } };
const datasetName = z.string().regex(/^[A-Za-z_][A-Za-z0-9_]{0,40}$/).describe('Nombre del dataset (letras, números y _).');
const weightsSchema = z.object({
  type: z.enum(['knn', 'distance', 'inverse_distance']).default('knn').describe('knn: k vecinos más cercanos (robusto si la densidad varía); distance: todos los vecinos a ≤ km; inverse_distance: peso 1/d^power (hasta km si se da).'),
  k: z.number().int().min(1).max(50).default(8), km: z.number().positive().optional(), power: z.number().min(0.5).max(3).default(1),
}).default({ type: 'knn', k: 8 });
const STEP_DOC = `Pasos (en orden, cada uno es un objeto con una clave):
- {filter: "expr"} conserva filas donde expr es verdadera. Ej. {filter: "group == 'training' and area_ha >= 2"}.
- {derive: {nueva: "expr", …}, by?: [cols]} crea/reemplaza columnas. Con by, las funciones de columna se calculan dentro de cada grupo. Ej. {derive: {anomalia: "ndvi_mean - mean(ndvi_mean)"}, by: ["id"]}.
- {select: [cols]} · {drop: [cols]} · {rename: {vieja: "nueva"}} · {distinct: [cols]} · {dropna: [cols] | true}
- {sort: ["col", "-otra"]} (- = descendente) · {limit: n, offset?: k} · {sample: n, seed?}
- {group_by: [cols], aggregate: {nombre: "expr", …}} una fila por grupo. Ej. {group_by: ["municipality"], aggregate: {n: "count()", mae: "mean(abs_error)", rend: "wmean(observed, area_ha)"}}.
- {pivot: {index: "id", columns: "month", values: "ndvi_mean", aggregate?: "mean", prefix?: "m"}} a formato ancho.
- {melt: {id_vars: ["id"], value_vars?: [cols], var_name?: "variable", value_name?: "value"}} a formato largo.
- {join: {dataset: "otro", on: "id" | ["a","b"] | [{left, right}], how?: "left"|"inner"|"outer"|"right", suffix?: "_2"}}
- {concat: ["otro", …]} agrega las filas de otros datasets debajo (une columnas; las que falten quedan nulas), como pd.concat.
Los nombres de columna nuevos pueden ser legibles («Rend. registrado (t/ha)»): sirven de etiqueta en gráficas; en expresiones van entre comillas invertidas. Sin «as» el dataset se reemplaza.
Expresiones: números, 'texto', columnas por nombre (o \`con espacios\`), + - * / % ^, == != < <= > >=, and or not, x in ['a','b'], null.
Funciones: ${FUNCTION_NAMES.join(', ')}. Fila a fila: abs, sqrt, log, log10, exp, round(x, d), pow, clip, if(c, a, b), isnull, coalesce, num, str, contains, concat, cut(x, [bordes]). De columna (un valor; por grupo con by/group_by): mean, median, sum, count, std, var, min(x), max(x), q(x, p), corr(a, b), wmean(x, w), n_unique, first, last. Ventana (en el orden actual): zscore, rank, pct_rank, cumsum, diff, lag, lead, normalize, row_number.`;

export function registerAnalysisTools(server, ctx) {
  const { session } = ctx;
  const ds = name => getDataset(session, name);
  const save = (name, data, meta, opts) => summarize(store(session, makeDataset(name, data, meta)), opts);

  // ── Datasets ─────────────────────────────────────────────────────────────────────────────────
  server.registerTool('data_load', {
    description: `Carga datos del atlas (o de un CSV adjunto) como un dataset con nombre, para analizar y graficar por nombre de columna sin copiar números. Fuentes:
- parcelas: una fila por parcela (197): id, municipality, state, group, area_ha, observed, predicted, error (estimado − registrado), abs_error, pi80_low/high, production_t, lon, lat (centroide), elevation_m, slope_deg y variables del ciclo del año elegido (abr–oct): ndvi_peak, ndvi_peak_month, ndvi_jul, ndvi_integral, ndvi_mean_cycle, ndvi_scenes, precip_cycle_mm, precip_year_mm, tmax_cycle_c, tmin_cycle_c, tmin_lowest_c.
- serie_mensual: formato largo, una fila por parcela y mes 2022–2025: id, municipality, state, group, year, month, date, ndvi_mean, ndvi_min, ndvi_max, scenes, precip_mm, tmin_c, tmax_c.
- error_regional: error del modelo por estado o municipio (mae, rmse, bias, parcelas, lon/lat medios).
- embeddings: los 64 componentes del embedding anual AlphaEarth de cada parcela (e00–e63, 2017–2025) con id, municipality, state, observed, predicted, lon, lat; para PCA (stats_pca columns_prefix "e").
- adjunto: un CSV que el usuario adjuntó (attachment_id); detecta números y coma decimal.
Devuelve columnas (tipo, unidad, nulos, significado) y las primeras filas.`,
    inputSchema: {
      source: z.enum(['parcelas', 'serie_mensual', 'error_regional', 'embeddings', 'adjunto']), as: datasetName.optional().describe('Nombre del dataset (por defecto, el de la fuente).'),
      year: z.number().int().min(2017).max(2025).default(2025).describe('parcelas: año de las variables del ciclo (2022–2025); embeddings: año (2017–2025).'),
      years: z.array(z.number().int().min(2022).max(2025)).max(4).optional().describe('serie_mensual: años (por defecto 2022–2025).'),
      months: z.array(z.number().int().min(1).max(12)).max(12).optional().describe('serie_mensual: meses 1–12.'),
      filters: z.object({ ids: z.array(z.string()).max(500).optional(), state: z.union([z.string(), z.array(z.string())]).optional(), municipality: z.union([z.string(), z.array(z.string())]).optional(),
        group: z.enum(['all', 'reservadas', 'con_rendimiento', 'propias', 'training', 'prediction', 'custom']).optional(), has_observed: z.boolean().optional() }).default({}),
      level: z.enum(['estado', 'municipio']).default('estado').describe('error_regional: nivel.'), state: z.string().optional().describe('error_regional: solo este estado.'),
      attachment_id: z.string().optional().describe('adjunto: id del CSV (csv_1…).'),
    },
  }, safe(args => {
    const { data, note, units } = loadSource({ atlas: ctx.atlas, workspace: ctx.workspace(), attachments: ctx.attachments }, args);
    return save(args.as ?? args.source, data, { source: args.source === 'adjunto' ? `adjunto ${args.attachment_id}` : args.source, note, units });
  }));

  server.registerTool('data_create', {
    description: 'Crea un dataset con valores que ya tienes (columnas del mismo largo), p. ej. resultados que calculaste o una tabla pequeña escrita a mano. Para datos del atlas usa data_load.',
    inputSchema: { as: datasetName, columns: z.record(z.string(), z.array(z.union([z.number(), z.string(), z.boolean(), z.null()])).max(20000)).describe('{columna: [valores]}.'), units: z.record(z.string(), z.string()).optional() },
  }, safe(({ as, columns, units }) => save(as, columns, { source: 'creado por Milli', units })));

  server.registerTool('data_transform', {
    description: `Transforma un dataset con una secuencia de pasos (como pandas) y guarda el resultado (en «as», o reemplaza el original si no lo das).\n${STEP_DOC}`,
    inputSchema: { dataset: datasetName, as: datasetName.optional(), steps: z.array(z.record(z.string(), z.any())).min(1).max(30) },
  }, safe(({ dataset, as, steps }) => {
    const src = ds(dataset), out = transform(src, steps, name => ds(name));
    const units = { ...src.meta.units };
    for (const st of steps) for (const [name, e] of Object.entries(st.aggregate ?? st.derive ?? {})) { const m = /^\s*(mean|avg|median|min|max|sum|q|quantile|first|last|wmean|std)\(\s*`?([^`,)]+)`?/.exec(String(e)); const u = m && (src.meta.units[m[2]] ?? COLUMN_DOCS[m[2]]?.[0]); if (u) units[name] = u; }
    // Compact: columns already described in the source are listed by name and type only.
    return save(as ?? dataset, out.data, { source: `${dataset} transformado`, units, docs: src.meta.docs }, { preview: 3, known: new Set(src.columns) });
  }));

  server.registerTool('data_describe', {
    description: 'Estadística descriptiva de las columnas de un dataset: n, nulos, media, desviación, mínimo, cuartiles, mediana, máximo y asimetría (números) o valores más frecuentes (texto). Con by, por grupo.',
    inputSchema: { dataset: datasetName, columns: z.array(z.string()).max(30).optional(), by: z.string().optional().describe('Columna para describir por grupo.') },
  }, safe(({ dataset, columns, by }) => {
    const d = ds(dataset), cols = columns?.length ? columns : d.columns;
    if (!by) return { dataset, rows: d.n, columns: Object.fromEntries(cols.map(c => [c, describe(column(d, c))])) };
    const g = column(d, by), levels = [...new Set(g.filter(v => v != null))].sort();
    if (levels.length > 30) throw new Error(`«${by}» tiene ${levels.length} grupos; usa una columna con menos categorías (máx. 30).`);
    return { dataset, by, groups: Object.fromEntries(levels.map(lv => [lv, Object.fromEntries(cols.filter(c => c !== by).map(c => [c, describe(column(d, c).filter((_, i) => g[i] === lv))]))])) };
  }));

  server.registerTool('data_view', {
    description: 'Lee filas de un dataset (paginadas), para revisar valores concretos.',
    inputSchema: { dataset: datasetName, offset: z.number().int().min(0).default(0), limit: z.number().int().min(1).max(200).default(30), columns: z.array(z.string()).max(30).optional() },
  }, safe(({ dataset, ...rest }) => rowsOf(ds(dataset), rest)));

  server.registerTool('data_list', {
    description: 'Lista los datasets y figuras de esta conversación (siguen disponibles entre mensajes).',
    inputSchema: {},
  }, safe(() => ({ datasets: [...session.datasets.values()].map(d => ({ name: d.name, rows: d.n, columns: d.columns, source: d.meta.source })), figures: [...session.figures.values()].map(f => ({ figure_id: f.id, title: f.title, axes: f.order, artists: f.traces.length, shown: f.shown })) })));

  // ── Statistics ───────────────────────────────────────────────────────────────────────────────
  server.registerTool('stats_correlation', {
    description: 'Matriz de correlación (pearson o spearman) entre columnas numéricas, con p-valor (prueba t) y n por par (casos completos por par). Guarda además un dataset largo (var_x, var_y, r, p, n) listo para plot_heatmap.',
    inputSchema: { dataset: datasetName, columns: z.array(z.string()).min(2).max(25), method: z.enum(['pearson', 'spearman']).default('pearson'), as: datasetName.default('correlaciones'),
      labels: z.record(z.string(), z.string().max(40)).optional().describe('Nombres legibles para var_x/var_y: {"observed": "Rend. registrado", …}.') },
  }, safe(({ dataset, columns, method, as, labels = {} }) => {
    const d = ds(dataset), cols = columns.map(c => { column(d, c); return d.columns.find(x => x.toLowerCase() === c.toLowerCase()); });
    const lab = c => labels[c] ?? c;
    const long = { var_x: [], var_y: [], r: [], p: [], n: [] }, matrix = {};
    for (const a of cols) { matrix[a] = {}; for (const b of cols) { const c = correlation(d.data[a], d.data[b], method); matrix[a][b] = round(c.r, 3); long.var_x.push(lab(a)); long.var_y.push(lab(b)); long.r.push(round(c.r, 4)); long.p.push(rp(c.p)); long.n.push(c.n); } }
    store(session, makeDataset(as, long, { source: `correlaciones de ${dataset}` }));
    const pairs = []; cols.forEach((a, i) => cols.slice(i + 1).forEach(b => { const k = long.var_x.findIndex((x, j) => x === lab(a) && long.var_y[j] === lab(b)); pairs.push({ a, b, r: long.r[k], p: long.p[k], n: long.n[k] }); }));
    return { method, matrix, strongest: pairs.filter(p => p.r != null).sort((x, y) => Math.abs(y.r) - Math.abs(x.r)).slice(0, 8), dataset: as, hint: `plot_heatmap con dataset "${as}", x "var_x", y "var_y", z "r", colormap "rdbu", z_range [-1, 1], annotate true, mask "upper", p "p" (estrellas de significancia).` };
  }));

  server.registerTool('stats_pca', {
    description: 'Análisis de componentes principales (PCA) de varias columnas numéricas: varianza explicada por componente (y acumulada), cargas (loadings: cuánto pesa cada variable en cada componente) y puntuaciones de cada fila, que se agregan al dataset como <prefix>1, <prefix>2… (filas incompletas quedan nulas). Por defecto estandariza (matriz de correlación). Guarda las cargas como dataset <as>_cargas (variable, PC1, PC2…) y la varianza como <as>_varianza (para un gráfico de sedimentación). Gráficas típicas: plot_scatter x pc1, y pc2 color_by una categoría (biplot con plot_annotate o plot_line de las cargas), plot_bar de la varianza, y plot_map parcelas color_by pc1 (aparece en el mapa de la app). Para los embeddings: data_load embeddings y columns_prefix "e".',
    inputSchema: { dataset: datasetName, columns: z.array(z.string()).max(80).optional(), columns_prefix: z.string().max(20).optional().describe('Usa todas las columnas numéricas que empiezan así (p. ej. "e" para e00–e63).'),
      components: z.number().int().min(1).max(10).default(3), scale: z.boolean().default(true), prefix: z.string().regex(/^[A-Za-z_][A-Za-z0-9_]{0,15}$/).default('pc'), as: datasetName.default('pca') },
  }, safe(({ dataset, columns, columns_prefix, components, scale, prefix, as }) => {
    const d = ds(dataset);
    const names = columns?.length ? columns.map(c => { column(d, c); return d.columns.find(x => x.toLowerCase() === c.toLowerCase()); }) : d.columns.filter(c => columns_prefix != null && c.startsWith(columns_prefix) && d.data[c].some(isNum) && d.data[c].every(v => v == null || isNum(v)));
    if (names.length < 2) throw new Error('PCA necesita al menos 2 columnas numéricas (columns o columns_prefix).');
    const out = pca(d.data, d.n, names, { components, scale });
    out.scores.forEach((sc, q) => { const c = `${prefix}${q + 1}`; d.data[c] = sc; if (!d.columns.includes(c)) d.columns.push(c); });
    store(session, makeDataset(`${as}_cargas`.slice(0, 41), Object.fromEntries(['variable', ...out.explained.map(e => e.component)].map(c => [c, out.loadings.map(l => l[c])])), { source: `cargas del PCA de ${dataset}` }));
    store(session, makeDataset(`${as}_varianza`.slice(0, 41), { component: out.all_shares.map((_, j) => `PC${j + 1}`), share: out.all_shares, cumulative: out.all_shares.map((_, j) => round(out.all_shares.slice(0, j + 1).reduce((t, v) => t + v, 0), 4)) }, { source: `varianza del PCA de ${dataset}` }));
    const top = out.explained.map((e, q) => ({ component: e.component, strongest: [...out.loadings].sort((x, y) => Math.abs(y[e.component]) - Math.abs(x[e.component])).slice(0, 5).map(l => `${l.variable} ${l[e.component] > 0 ? '+' : '−'}${Math.abs(l[e.component]).toFixed(2)}`) }));
    return { variables: names.length, n: out.n, dropped: out.dropped, scaled: out.scaled, explained: out.explained, strongest_loadings: top, added_columns: out.scores.map((_, q) => `${prefix}${q + 1}`), datasets: [`${as}_cargas`, `${as}_varianza`],
      ...(names.length <= 25 ? { loadings: out.loadings } : {}) };
  }));

  server.registerTool('stats_regression', {
    description: 'Regresión lineal por mínimos cuadrados: y ~ x1 + x2 + … (las columnas de texto entran como variables indicadoras; la primera categoría es la referencia). Devuelve coeficientes con error estándar, t, p e IC 95 %, R², R² ajustado, RMSE, F y AIC. Agrega al dataset las columnas <prefix>fitted, residual, std_residual, leverage y cooks_d (diagnóstico; los residuos pueden probarse luego con stats_spatial_autocorrelation). Para términos cuadráticos o interacciones, créalos antes con data_transform derive.',
    inputSchema: { dataset: datasetName, y: z.string(), x: z.array(z.string()).min(1).max(15), intercept: z.boolean().default(true), prefix: z.string().regex(/^[A-Za-z_][A-Za-z0-9_]{0,20}$/).default('reg_'),
      spatial: z.object({ lon: z.string().default('lon'), lat: z.string().default('lat'), weights: weightsSchema }).optional().describe('Diagnóstico espacial de los residuos: I de Moran y pruebas LM-error / LM-lag (y robustas) para elegir entre un modelo de error o de rezago espacial.') },
  }, safe(({ dataset, y, x, intercept, prefix, spatial }) => {
    const d = ds(dataset), fit = ols(d.data, d.n, y, x, { intercept });
    // VIF: how much each predictor's variance is inflated by the others (> 5–10: collinearity).
    const vif = x.length > 1 ? Object.fromEntries(x.filter(c => column(d, c).every(v => v == null || isNum(v))).map(c => { try { const r2 = ols(d.data, d.n, c, x.filter(o => o !== c)).model.r2; return [c, round(1 / Math.max(1e-9, 1 - r2), 2)]; } catch { return [c, null]; } })) : null;
    let spatialOut = null;
    if (spatial) {
      const used = [...Array(d.n).keys()].filter(i => fit.rows.residual[i] != null && isNum(d.data[spatial.lon]?.[i]) && isNum(d.data[spatial.lat]?.[i]));
      const sub = Object.fromEntries(Object.entries(d.data).map(([k, v]) => [k, used.map(i => v[i])]));
      const pts = points(sub, used.length, { value: y, lon: spatial.lon, lat: spatial.lat }), w = weights(pts.d, { ...spatial.weights, standardize: true });
      const e = pts.idx.map(i => fit.rows.residual[used[i]]), fitted = pts.idx.map(i => fit.rows.fitted[used[i]]), yy = pts.idx.map(i => sub[y][i]);
      const wxb = w.lists.map(nb => nb.reduce((t, { j, w: wt }) => t + wt * fitted[j], 0));
      const aux = ols({ ...Object.fromEntries(Object.entries(sub).map(([k, v]) => [k, pts.idx.map(i => v[i])])), __wxb: wxb }, pts.idx.length, '__wxb', x, { intercept });
      const mwxb2 = aux.rows.residual.reduce((t, v) => t + (v ?? 0) ** 2, 0);
      const moran = autocorrelation(e, pts.d, w, { permutations: 499, local: false }).global;
      spatialOut = { weights: w.summary, residual_moran_i: moran.moran_i, residual_moran_p: moran.p_permutation, ...lmTests(w, yy, e, fitted, mwxb2) };
    }
    for (const [k, v] of Object.entries(fit.rows)) { d.data[prefix + k] = v; if (!d.columns.includes(prefix + k)) d.columns.push(prefix + k); }
    const top = fit.rows.cooks_d.map((v, i) => [v, i]).filter(([v]) => v != null).sort((a, b) => b[0] - a[0]).slice(0, 5).map(([v, i]) => ({ row: i, ...(d.data.id ? { id: d.data.id[i] } : {}), cooks_d: v }));
    return { ...fit.model, ...(vif ? { vif } : {}), added_columns: Object.keys(fit.rows).map(k => prefix + k), most_influential: top, ...(spatialOut ? { spatial: spatialOut } : {}) };
  }));

  server.registerTool('stats_compare_groups', {
    description: 'Compara una variable numérica entre grupos: n, media, desviación, mediana, error estándar e IC 95 % por grupo; ANOVA de una vía (F, p, η²), Kruskal–Wallis (no paramétrica), con dos grupos t de Welch y con más de dos todas las comparaciones por pares (t de Welch con p ajustado por Holm). Guarda el resumen por grupo como dataset grupos_<value>_<group> (para plot_bar o plot_errorbar).',
    inputSchema: { dataset: datasetName, value: z.string(), group: z.string(), as: datasetName.optional() },
  }, safe(({ dataset, value, group, as }) => {
    const d = ds(dataset), out = compareGroups(column(d, value), column(d, group)), name = as ?? `grupos_${value}_${group}`.replace(/[^A-Za-z0-9_]/g, '_').slice(0, 40);
    store(session, makeDataset(name, Object.fromEntries(['group', 'n', 'mean', 'sd', 'median', 'se', 'ci_low', 'ci_high'].map(c => [c, out.groups.map(g => g[c])])), { source: `${value} por ${group}`, docs: { group: `Valor de ${group}.`, mean: `Media de ${value}.`, ci_low: 'Límite inferior del IC 95 % de la media.', ci_high: 'Límite superior del IC 95 % de la media.', se: 'Error estándar de la media.' } }));
    return { ...out, dataset: name };
  }));

  server.registerTool('stats_spatial_autocorrelation', {
    description: `Autocorrelación espacial de una variable entre parcelas (u otros puntos con lon/lat):
- Global: I de Moran (inferencia normal y por permutaciones), C de Geary, lectura en palabras.
- Local (LISA): I local de Moran con p por permutación condicional y cuadrante HH (alto rodeado de alto), LL, HL, LH o «no significativo» (p > alpha).
- Opcional: Gi* de Getis–Ord (puntos calientes / fríos).
Agrega al dataset, para cada fila con valor: <col>_z (valor estandarizado), <col>_lag (rezago espacial: promedio ponderado de los vecinos de z), <col>_lisa_i, <col>_lisa_p, <col>_lisa (clase), y con getis: <col>_gi_z y <col>_hotspot.
Gráficas típicas: diagrama de Moran (plot_scatter x=<col>_z, y=<col>_lag + plot_regression lineal: su pendiente es I), mapa LISA (plot_map layer parcelas, color_by <col>_lisa) y variograma (stats_variogram).
Pesos por defecto: 8 vecinos más cercanos, estandarizados por fila. Usa un punto por parcela (no la serie mensual).`,
    inputSchema: { dataset: datasetName, column: z.string(), lon: z.string().default('lon'), lat: z.string().default('lat'), weights: weightsSchema,
      permutations: z.number().int().min(0).max(9999).default(999), alpha: z.number().min(0.001).max(0.2).default(0.05), getis: z.boolean().default(false), seed: z.number().int().default(12345) },
  }, safe(({ dataset, column: col, lon, lat, weights: wopt, permutations, alpha, getis, seed }) => {
    const d = ds(dataset), name = d.columns.find(c => c.toLowerCase() === col.toLowerCase()) ?? col; column(d, name);
    const p = points(d.data, d.n, { value: name, lon, lat }), w = weights(p.d, { ...wopt, standardize: true });
    if (w.summary.isolates) throw new Error(`${w.summary.isolates} puntos no tienen vecinos con esos pesos; usa knn o una distancia mayor.`);
    const res = autocorrelation(p.x, p.d, w, { permutations, alpha, seed, getis, gWeights: getis ? weights(p.d, { ...wopt, standardize: false }) : null });
    const put = (suffix, vals) => { const c = `${name}_${suffix}`, arr = Array(d.n).fill(null); p.idx.forEach((i, k) => { arr[i] = isNum(vals[k]) ? round(vals[k], 6) : vals[k]; }); d.data[c] = arr; if (!d.columns.includes(c)) d.columns.push(c); return c; };
    const added = [put('z', res.z), put('lag', res.lag)];
    if (res.local) added.push(put('lisa_i', res.local.local_i), put('lisa_p', res.local.p), put('lisa', res.local.cluster));
    if (res.getis) added.push(put('gi_z', res.getis.z), put('hotspot', res.getis.class));
    return { variable: name, weights: w.summary, ...res.global, added_columns: added, colors_hint: 'Colores LISA estándar: HH rojo, LL azul, HL naranja claro, LH azul claro, no significativo gris (plot_map los usa por defecto).' };
  }));

  server.registerTool('stats_variogram', {
    description: 'Semivariograma empírico de una variable sobre lon/lat (distancias en km): semivarianza media por clase de distancia y número de pares, con ajuste por mínimos cuadrados ponderados por pares de un modelo esférico, exponencial o gaussiano (pepita, meseta, alcance práctico, RMSE del ajuste y grado de dependencia espacial). Avisa (fit.warnings) si el alcance supera la distancia analizada (tendencia) o la meseta no coincide con los datos; solo declara «pepita pura» si la semivarianza no crece. Puedes fijar nugget o range_km. Crea el dataset <as> (lag_km, gamma, pairs…) y, si hay ajuste, <as>_modelo (lag_km, gamma) para dibujar la curva con plot_line.',
    inputSchema: { dataset: datasetName, column: z.string(), lon: z.string().default('lon'), lat: z.string().default('lat'), bins: z.number().int().min(4).max(40).default(12),
      max_km: z.number().positive().optional().describe('Distancia máxima (por defecto la mitad de la mayor distancia).'), estimator: z.enum(['matheron', 'cressie']).default('matheron'),
      model: z.enum(['spherical', 'exponential', 'gaussian', 'none']).default('spherical'), as: datasetName.optional(),
      nugget: z.number().min(0).optional().describe('Fija la pepita (si la conoces); por defecto se ajusta.'), range_km: z.number().positive().optional().describe('Fija el alcance práctico en km.') },
  }, safe(({ dataset, column: col, lon, lat, bins, max_km, estimator, model, as, nugget, range_km }) => {
    const d = ds(dataset), p = points(d.data, d.n, { value: col, lon, lat }), v = variogram(p.x, p.d, { bins, maxKm: max_km, estimator, model, nugget, rangeKm: range_km }), name = as ?? `variograma_${col}`.replace(/[^A-Za-z0-9_]/g, '_').slice(0, 40);
    store(session, makeDataset(name, Object.fromEntries(['bin', 'from_km', 'to_km', 'lag_km', 'pairs', 'gamma'].map(c => [c, v.rows.map(rw => rw[c])])), { source: `variograma de ${col}`, units: { lag_km: 'km' } }));
    if (v.fit) store(session, makeDataset(`${name}_modelo`.slice(0, 41), { lag_km: v.fit.curve.map(c => c.lag_km), gamma: v.fit.curve.map(c => c.gamma) }, { source: `modelo ${model}` }));
    const { curve, ...fit } = v.fit ?? {};
    return { variable: col, points: p.x.length, cutoff_km: v.cutoff_km, bin_width_km: v.bin_width_km, sample_variance: v.sample_variance, estimator, bins: v.rows, fit: v.fit ? fit : null, datasets: v.fit ? [name, `${name}_modelo`] : [name], hint: `plot_scatter x "lag_km", y "gamma", size_by "pairs" + plot_line del modelo (dataset ${name}_modelo); plot_reference hline value ${v.sample_variance} (sample_variance) label "Varianza". Si fit trae warnings, menciónalos.` };
  }));

  server.registerTool('stats_correlogram', {
    description: 'Correlograma espacial: I de Moran por clases de distancia (pesos binarios dentro de cada anillo), con z y p. Muestra hasta qué distancia las parcelas se parecen. Crea un dataset (from_km, to_km, mid_km, pairs, moran_i, z, p).',
    inputSchema: { dataset: datasetName, column: z.string(), lon: z.string().default('lon'), lat: z.string().default('lat'),
      edges_km: z.array(z.number().min(0)).min(2).max(30).optional().describe('Bordes de las clases, p. ej. [0, 2, 5, 10, 20, 40]. Por defecto 10 clases hasta la mitad de la mayor distancia.'), as: datasetName.optional() },
  }, safe(({ dataset, column: col, lon, lat, edges_km, as }) => {
    const d = ds(dataset), p = points(d.data, d.n, { value: col, lon, lat });
    let maxD = 0; for (const row of p.d) for (const v of row) maxD = Math.max(maxD, v);
    const edges = edges_km ?? Array.from({ length: 11 }, (_, i) => round(maxD / 2 * i / 10, 3));
    const rows = correlogram(p.x, p.d, edges), name = as ?? `correlograma_${col}`.slice(0, 40);
    store(session, makeDataset(name, Object.fromEntries(Object.keys(rows[0]).map(c => [c, rows.map(rw => rw[c])])), { source: `correlograma de ${col}`, units: { mid_km: 'km' } }));
    return { variable: col, points: p.x.length, bands: rows, dataset: name };
  }));

  server.registerTool('stats_interpolate', {
    description: 'Interpola una variable de puntos (lon/lat) a una malla regular por distancia inversa ponderada (IDW), para superficies continuas: sobre el mapa (plot_map layer "malla"), plot_contour o plot_surface. Las celdas a más de max_km de todo dato quedan vacías (no se extrapola; por defecto el doble de la distancia mediana al 8.º vecino, ≥ 2 km). Crea un dataset (lon, lat, value).',
    inputSchema: { dataset: datasetName, column: z.string(), lon: z.string().default('lon'), lat: z.string().default('lat'), nx: z.number().int().min(10).max(150).default(60), ny: z.number().int().min(10).max(150).default(60),
      power: z.number().min(0.5).max(5).default(2), neighbors: z.number().int().min(1).max(50).default(12), max_km: z.number().positive().optional().describe('Distancia máxima a un dato para rellenar una celda (por defecto 3× la distancia mediana al vecino más cercano).'),
      bbox: z.array(z.number()).length(4).optional().describe('[oeste, sur, este, norte]; por defecto, el de los puntos.'), as: datasetName.optional() },
  }, safe(({ dataset, column: col, lon, lat, as, max_km, ...opt }) => {
    const d = ds(dataset), p = points(d.data, d.n, { value: col, lon, lat }), g = idw(p.lon, p.lat, p.x, { ...opt, maxKm: max_km }), name = as ?? `malla_${col}`.slice(0, 40);
    store(session, makeDataset(name, { lon: g.rows.map(rw => rw.lon), lat: g.rows.map(rw => rw.lat), value: g.rows.map(rw => rw.value) }, { source: `IDW de ${col}` }));
    return { dataset: name, nx: g.nx, ny: g.ny, bbox: g.bbox, max_km: g.max_km, filled_cells: g.rows.filter(rw => rw.value != null).length, hint: `Sobre el mapa: plot_map layer "malla" dataset "${name}" (+ parcelas y limites). En ejes xy: plot_contour x "lon", y "lat", z "value" con plot_axes equal_aspect. En 3d: plot_surface.` };
  }));
}
