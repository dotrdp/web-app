// Milli's analysis engine: the expression language, dataset transforms, statistics and spatial
// statistics, checked against reference values computed with numpy / scipy on the same parcels
// (138 with recorded yield), and the plot tools' figures as the chat receives them.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
// @ts-expect-error Native ES modules without type declarations.
import { evalColumn, parse } from '../server/milli/analysis/expr.mjs';
// @ts-expect-error
import { loadSource, transform } from '../server/milli/analysis/frame.mjs';
// @ts-expect-error
import { compareGroups, correlation, kde, ols, pca, tQuantile } from '../server/milli/analysis/stats.mjs';
// @ts-expect-error
import { autocorrelation, lmTests, points, variogram, weights } from '../server/milli/analysis/spatial.mjs';
// @ts-expect-error
import { colorAt, compile, tempLayerOf } from '../server/milli/analysis/figure.mjs';
// @ts-expect-error
import { quantile } from '../server/milli/analysis/expr.mjs';
// @ts-expect-error
import { loadAtlas, parcels } from '../server/milli/data.mjs';
// @ts-expect-error
import { createMilliMcp } from '../server/milli/mcp.mjs';

const dataDir = new URL('../public/data/', import.meta.url).pathname;
const near = (a: number, b: number, tol = 1e-6, what = '') => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${what} ${a} ≠ ${b}`);
type Cols = Record<string, (number | string | null)[]>;
let cached: Cols | null = null;
async function training(): Promise<Cols> {
  if (cached) return cached;
  const atlas = await loadAtlas(dataDir);
  cached = loadSource({ atlas, workspace: { overrides: {}, fields: [] }, attachments: new Map() }, { source: 'parcelas', filters: { group: 'training' } }).data as Cols;
  return cached;
}

test('Expressions: precedence, nulls, functions, lists, column-wide and grouped statistics', () => {
  const cols = { a: [1, 2, 3, null], b: [10, 20, 30, 40], g: ['x', 'x', 'y', 'y'] };
  const ev = (src: string, by: string[] = []) => evalColumn(src, cols, 4, by);
  assert.deepEqual(ev('a + b * 2'), [21, 42, 63, null]);
  assert.deepEqual(ev('(a + b) * 2'), [22, 44, 66, null]);
  assert.deepEqual(ev('-a ^ 2'), [-1, -4, -9, null]);
  assert.deepEqual(ev('2 ^ 3 ^ 2'), [512, 512, 512, 512]);
  assert.deepEqual(ev('a > 1 and b < 40'), [false, true, true, false]);
  assert.deepEqual(ev("g in ['y']"), [false, false, true, true]);
  assert.deepEqual(ev('not isnull(a)'), [true, true, true, false]);
  assert.deepEqual(ev('mean(b)'), [25, 25, 25, 25]);
  assert.deepEqual(ev('b - mean(b)', ['g']), [-5, 5, -5, 5]);
  assert.deepEqual(ev('rank(b)'), [1, 2, 3, 4]);
  assert.deepEqual(ev('cumsum(a)'), [1, 3, 6, null]);
  assert.deepEqual(ev('lag(b)'), [null, 10, 20, 30]);
  assert.deepEqual(ev('if(a >= 2, "alto", "bajo")'), ['bajo', 'alto', 'alto', 'bajo']);
  assert.deepEqual(ev('cut(b, [0, 15, 40])'), ['0–15', '15–40', '15–40', '15–40']);
  assert.deepEqual(ev('round(b / 3, 1)'), [3.3, 6.7, 10, 13.3]);
  assert.deepEqual(ev('concat(g, "-", a)'), ['x-1', 'x-2', 'y-3', 'y-']);
  assert.deepEqual(ev('max(a, 2)'), [2, 2, 3, 2]);
  assert.deepEqual(ev('max(a)'), [3, 3, 3, 3]);
  assert.deepEqual(ev('q(b, 0.5)'), [25, 25, 25, 25]);
  assert.throws(() => ev('a +'), /termina antes de tiempo/);
  assert.throws(() => ev('foo(a)'), /No conozco la función foo/);
  assert.throws(() => ev('c * 2'), /No existe la columna «c»/);
  assert.throws(() => parse('a = = b'), /No entiendo/);
});

test('Datasets: filter, derive by group, group_by/aggregate, pivot, melt, join, sort, limit', async () => {
  const d = await training(), src = { data: d, n: (d.id as string[]).length };
  const byState = transform(src, [{ filter: 'observed > 0' }, { group_by: ['state'], aggregate: { n: 'count()', mean_obs: 'mean(observed)', mae: 'mean(abs_error)' } }, { sort: ['-n'] }]);
  assert.deepEqual(byState.data.state, ['Puebla', 'Hidalgo', 'Tlaxcala']);
  assert.deepEqual(byState.data.n, [71, 36, 31]);
  near(byState.data.mean_obs[0] as number, 4.4773, 1e-4, 'Puebla mean');
  const anomaly = transform(src, [{ derive: { dev: 'observed - mean(observed)' }, by: ['state'] }, { group_by: ['state'], aggregate: { s: 'sum(dev)' } }]);
  for (const v of anomaly.data.s as number[]) near(v, 0, 1e-9, 'anomalies sum to 0 per state');
  const wide = transform({ data: { id: ['a', 'a', 'b'], m: [1, 2, 1], v: [5, 6, 7] }, n: 3 }, [{ pivot: { index: 'id', columns: 'm', values: 'v', prefix: 'm' } }]);
  assert.deepEqual(wide.data, { id: ['a', 'b'], m1: [5, 7], m2: [6, null] });
  const long = transform({ data: wide.data, n: 2 }, [{ melt: { id_vars: ['id'], var_name: 'mes', value_name: 'v' } }]);
  assert.deepEqual(long.data, { id: ['a', 'a', 'b', 'b'], mes: ['m1', 'm2', 'm1', 'm2'], v: [5, 6, 7, null] });
  const joined = transform({ data: { id: ['a', 'b', 'c'] }, n: 3 }, [{ join: { dataset: 'w', on: 'id', how: 'left' } }], () => ({ data: wide.data, n: 2, columns: ['id', 'm1', 'm2'] }));
  assert.deepEqual(joined.data, { id: ['a', 'b', 'c'], m1: [5, 7, null], m2: [6, null, null] });
  assert.deepEqual(transform(src, [{ sort: ['-observed'] }, { limit: 2 }, { select: ['id'] }]).n, 2);
  assert.throws(() => transform(src, [{ filter: 'nope > 1' }]), /paso 1 \(filter\): No existe la columna «nope»/);
  assert.throws(() => transform(src, [{ explode: 'x' }]), /Paso desconocido/);
});

test('Statistics agree with scipy and numpy (correlation, OLS, groups, t, KDE, quantiles)', async () => {
  const d = await training();
  const c = correlation(d.observed, d.predicted);
  near(c.r, 0.8195512565512962, 1e-9, 'pearson r'); near(c.p, 1.0688224095741165e-34, 1e-4, 'pearson p');
  const s = correlation(d.observed, d.precip_cycle_mm, 'spearman');
  near(s.r, -0.3937082763506754, 1e-9, 'spearman r'); near(s.p, 1.7762170184080405e-06, 1e-4, 'spearman p');
  const fit = ols(d, 138, 'observed', ['ndvi_peak', 'precip_cycle_mm', 'elevation_m', 'state']);
  const ref = { beta: [3.311065338895544, -0.23522670138906096, -0.001442601454417311, 0.0007901856825549836, 0.44808508828890337, -0.79251085465565], se: [1.444932899621233, 0.7889198827315859, 0.0003154007908515106, 0.0005544335365260165, 0.13897868582016454, 0.14565812725737143], p: [0.023518158281134103, 0.7660475896984129, 1.090116481826047e-05, 0.15645601169367312, 0.0015924955596024692, 2.489514262009859e-07] };
  assert.deepEqual(fit.model.terms, ['(intercepto)', 'ndvi_peak', 'precip_cycle_mm', 'elevation_m', 'state[Puebla]', 'state[Tlaxcala]']);
  fit.model.coefficients.forEach((co: { estimate: number; se: number; p: number }, j: number) => { near(co.estimate, ref.beta[j], 1e-5, `beta ${j}`); near(co.se, ref.se[j], 1e-5, `se ${j}`); near(co.p, ref.p[j], 1e-3, `p ${j}`); });
  near(fit.model.r2, 0.5729269231303455, 1e-4, 'R²');
  near(Math.max(...fit.rows.cooks_d.filter((v: number | null) => v != null)), 0.08901784987170552, 1e-3, "Cook's D");
  near(fit.model.coefficients[0].ci_low, 0.4528452435233046, 1e-5, 'CI');
  near(tQuantile(0.975, 10), 2.2281388519649385, 1e-7, 't(10)'); near(tQuantile(0.975, 132), 1.9780988419057233, 1e-7, 't(132)');
  const g = compareGroups(d.observed, d.state);
  near(g.anova.f, 68.35883129634203, 1e-4, 'ANOVA F'); near(g.anova.p, 3.1230083781189307e-21, 1e-2, 'ANOVA p');
  near(g.kruskal_wallis.h, 64.96939625790606, 1e-4, 'Kruskal H'); near(g.kruskal_wallis.p, 7.799645359706864e-15, 1e-2, 'Kruskal p');
  const two = compareGroups(d.observed.filter((_, i) => d.state[i] !== 'Tlaxcala'), d.state.filter(st => st !== 'Tlaxcala'));
  near(Math.abs(two.welch_t.t), 4.8629211994705654, 1e-4, 'Welch t'); near(two.welch_t.p, 9.875175189808045e-06, 1e-3, 'Welch p');
  const k = kde(d.observed, { points: 3, from: 3, to: 5 });
  near(k.bandwidth, 0.3177135887283631, 1e-9, 'Scott bandwidth');
  [0.29447898684012985, 0.28210488744665596, 0.2842459935240696].forEach((v, i) => near(k.curve[i].y, v, 1e-9, `KDE ${i}`));
  [0.1, 0.25, 0.5, 0.9].forEach((q, i) => near(quantile(d.observed, q), [2.892, 3.2, 4.34, 4.842][i], 1e-9, `q${q}`));
});

test("Spatial statistics agree with a numpy implementation (Moran's I, Geary's C, local Moran, variogram)", async () => {
  const d = await training();
  const refs = { error: { I: -0.02209210398996393, z: -0.3864990724156965, C: 1.0479885926513948, lag0: 0.1160454407872812, Ii0: -0.1286048437373853 }, observed: { I: 0.6886009702737226, z: 18.182100799448108, C: 0.3359908258634294, lag0: -1.200208475533928, Ii0: 0.6397685870629152 } };
  for (const [col, ref] of Object.entries(refs)) {
    const p = points(d, 138, { value: col }), w = weights(p.d, { type: 'knn', k: 8 });
    const res = autocorrelation(p.x, p.d, w, { permutations: 199 });
    near(res.global.moran_i, ref.I, 1e-3, `${col} I`); near(res.global.z_normal, ref.z, 1e-2, `${col} z`); near(res.global.geary_c, ref.C, 1e-3, `${col} C`);
    near(res.lag[0], ref.lag0, 1e-6, `${col} lag`); near(res.local.local_i[0], ref.Ii0, 1e-6, `${col} Ii`);
  }
  // Yield clusters strongly in space; the model's error does not.
  const yieldRes = autocorrelation(points(d, 138, { value: 'observed' }).x, points(d, 138, { value: 'observed' }).d, weights(points(d, 138, { value: 'observed' }).d, { k: 8 }), { permutations: 199 });
  assert.ok(yieldRes.global.p_permutation <= 0.01 && /positiva/.test(yieldRes.global.reading));
  assert.ok(['HH', 'LL', 'HL', 'LH', 'no significativo'].includes(yieldRes.local.cluster[0]));
  const p = points(d, 138, { value: 'observed' }), v = variogram(p.x, p.d, { bins: 12, model: 'spherical' });
  const ref = [[1.478900475192337, 920, 0.33186451086956525], [3.5740617042346923, 1375, 0.3080028], [5.8157959721928005, 943, 0.2501825556733829]];
  ref.forEach(([h, n, g], i) => { near(v.rows[i].lag_km, h, 1e-4, 'lag'); assert.equal(v.rows[i].pairs, n); near(v.rows[i].gamma, g, 1e-5, 'gamma'); });
  assert.ok(v.fit.sill > 0 && v.fit.practical_range_km > 0 && v.fit.curve.length === 80);
  assert.throws(() => points(d, 138, { value: 'state' }), /hacen falta al menos 5/);
  // Yield rises with distance (γ triples): never "pure nugget", for any model; the spherical range is flagged when it overruns the cutoff.
  for (const model of ['spherical', 'exponential', 'gaussian']) {
    const fit = variogram(p.x, p.d, { bins: 12, model }).fit;
    assert.notEqual(fit.model, 'pepita pura', model); assert.ok(fit.sill > 0.5 && fit.rmse < 0.25, `${model} ${JSON.stringify({ sill: fit.sill, rmse: fit.rmse })}`);
    if (fit.practical_range_km > 28.9) assert.ok(fit.warnings?.some((w: string) => /supera la distancia/.test(w)), model);
  }
  // The model's error has no structure: pure nugget.
  const pe = points(d, 138, { value: 'error' });
  assert.equal(variogram(pe.x, pe.d, { model: 'spherical' }).fit.model, 'pepita pura');
});

test('PCA of the satellite embeddings agrees with numpy (explained variance of the 2025 AlphaEarth vectors)', async () => {
  const atlas = await loadAtlas(dataDir);
  const { data } = loadSource({ atlas, workspace: { overrides: {}, fields: [] }, attachments: new Map() }, { source: 'embeddings', year: 2025 });
  const names = Object.keys(data).filter(c => /^e\d\d$/.test(c));
  assert.equal(names.length, 64);
  const out = pca(data, (data.id as string[]).length, names, { components: 3 });
  // numpy: eigenvalues of the correlation matrix → 0.1996, 0.1547, 0.1207 of the variance.
  assert.deepEqual(out.explained.map((e: { variance_share: number }) => e.variance_share), [0.1996, 0.1547, 0.1207]);
  assert.equal(out.scores[0].filter((v: number | null) => v != null).length, 197);
  near(out.scores[0].reduce((t: number, v: number) => t + v, 0), 0, 1e-3, 'scores are centred (rounded to 5 decimals)');
});

test('Spatial regression diagnostics agree with numpy (LM-error, LM-lag and their robust forms)', async () => {
  const d = await training();
  const fit = ols(d, 138, 'observed', ['ndvi_peak', 'precip_cycle_mm', 'elevation_m']);
  const p = points(d, 138, { value: 'observed' }), w = weights(p.d, { k: 8 });
  const e = p.idx.map((i: number) => fit.rows.residual[i]), fitted = p.idx.map((i: number) => fit.rows.fitted[i]), y = p.idx.map((i: number) => d.observed[i]);
  const wxb = w.lists.map((nb: { j: number; w: number }[]) => nb.reduce((t, { j, w: wt }) => t + wt * fitted[j], 0));
  const aux = ols({ ...d, wxb }, 138, 'wxb', ['ndvi_peak', 'precip_cycle_mm', 'elevation_m']);
  const lm = lmTests(w, y, e, fitted, aux.rows.residual.reduce((t: number, v: number) => t + v * v, 0));
  near(lm.lm_error.stat, 113.40432829930445, 1e-3, 'LM-error'); near(lm.lm_lag.stat, 131.4387350218562, 1e-3, 'LM-lag');
  near(lm.robust_lm_error.stat, 1.1050145354532637, 1e-2, 'RLM-error'); near(lm.robust_lm_lag.stat, 19.139421258004994, 1e-3, 'RLM-lag');
  assert.ok(lm.lm_lag.p > 0, 'p never rounds to 0');
});

test('Plot tools: a figure built call by call compiles to Plotly subplots, maps, references and legends', async () => {
  const atlas = await loadAtlas(dataDir);
  const live = { command: async () => ({ ok: false, error: 'sin pantalla' }), notify() {}, screens: new Map() };
  const server = createMilliMcp({ screenId: 'screen-AAAAAAAAAAAAAAAA', sessionHash: 'h', live, atlas, allParcels: () => parcels(atlas), run: {}, notes: { get: () => ({ text: '' }) }, attachments: new Map() });
  const client = new Client({ name: 't', version: '1' }); const [c, s] = InMemoryTransport.createLinkedPair(); await server.connect(s); await client.connect(c);
  const call = async (name: string, args: Record<string, unknown>) => { const r = await client.callTool({ name, arguments: args }) as { isError?: boolean; content: { text: string }[]; _meta?: Record<string, unknown> }; return { ...r, json: (() => { try { return JSON.parse(r.content[0].text); } catch { return r.content[0].text; } })() }; };
  const ok = async (name: string, args: Record<string, unknown>) => { const r = await call(name, args); assert.ok(!r.isError, `${name}: ${r.content[0].text}`); return r; };
  const names = (await client.listTools()).tools.map(t => t.name);
  for (const n of ['data_load', 'data_transform', 'stats_spatial_autocorrelation', 'stats_variogram', 'plot_figure', 'plot_line', 'plot_scatter', 'plot_bar', 'plot_hist', 'plot_box', 'plot_heatmap', 'plot_contour', 'plot_surface', 'plot_map', 'plot_regression', 'plot_axes', 'plot_legend', 'plot_show', 'plot_guide']) assert.ok(names.includes(n), n);
  await ok('data_load', { source: 'parcelas', as: 'p', filters: { group: 'con_rendimiento' } });
  await ok('stats_spatial_autocorrelation', { dataset: 'p', column: 'observed', permutations: 99 });
  await ok('plot_figure', { title: 'Prueba', mosaic: [['a', 'm'], ['b', 'b']], axes_types: { m: 'map' }, subplot_titles: ['A', 'M', 'B'] });
  await ok('plot_scatter', { ax: 'a', dataset: 'p', x: 'observed', y: 'predicted', color_by: 'state' });
  await ok('plot_reference', { ax: 'a', kind: 'identity', label: 'y = x' });
  await ok('plot_map', { ax: 'm', layer: 'parcelas', dataset: 'p', color_by: 'observed_lisa' });
  await ok('plot_line', { ax: 'b', dataset: 'p', x: 'lon', y: 'observed', y_axis: 'right' });
  await ok('plot_axes', { ax: 'a', x: { label: 'Registrado (t/ha)' }, y: { label: 'Estimado (t/ha)', scale: 'log' }, equal_aspect: true });
  await ok('plot_legend', { position: 'bottom', title: 'Estado' });
  const shown = await ok('plot_show', { caption: 'Fuente: FIRA' });
  const payload = shown._meta!['agrocebada/figure'] as { state: unknown; caption: string };
  assert.equal(payload.caption, 'Fuente: FIRA');
  // The browser compiles the figure for its width: the enlarged view keeps the grid…
  const fig = compile(payload.state, { width: 1000 }) as { data: Record<string, unknown>[]; layout: Record<string, any> };
  assert.deepEqual(fig.data.filter(t => t.type === 'scatter' && t.xaxis === 'x').map(t => t.name), ['Hidalgo', 'Puebla', 'Tlaxcala']);
  assert.ok(fig.data.some(t => t.type === 'choroplethmap' && t.subplot === 'map'));
  assert.ok(fig.data.some(t => t.yaxis === 'y3'), 'right axis of the second xy axes');
  assert.equal(fig.layout.yaxis3.overlaying, 'y2');
  assert.equal(fig.layout.yaxis.type, 'log'); assert.equal(fig.layout.yaxis.scaleanchor, 'x');
  assert.deepEqual(fig.layout.xaxis2.domain, [0, 1], 'b spans both columns');
  assert.equal(fig.layout.shapes[0].xref, 'x'); assert.equal(fig.layout.shapes[0].label.text, 'y = x');
  assert.ok(fig.layout.map.zoom > 6 && fig.layout.map.center.lat > 19);
  assert.equal(fig.layout.legend.title.text, 'Estado');
  assert.deepEqual(fig.layout.annotations.slice(0, 3).map((a: { text: string }) => a.text), ['<b>A</b>', '<b>M</b>', '<b>B</b>']);
  assert.equal(shown.json.images, 'no disponible'); assert.match(shown.json.review.join(' '), /Sin imagen de revisión/);
  // …and the narrow chat stacks the three panels in one column.
  const narrow = compile(payload.state, { width: 400 }) as { layout: Record<string, any> };
  assert.deepEqual(narrow.layout.xaxis.domain, [0, 1]); assert.deepEqual(narrow.layout.map.domain.x, [0, 1]);
  assert.ok(narrow.layout.yaxis.domain[0] > narrow.layout.map.domain.y[1], 'a above the map');
  // Mistakes come back as plain advice.
  assert.match((await call('plot_scatter', { ax: 'm', dataset: 'p', x: 'lon', y: 'lat' })).content[0].text, /no se puede dibujar en «m» \(ejes map\)/);
  assert.match((await call('plot_line', { dataset: 'p', x: 'lon', y: 'yield' })).content[0].text, /no tiene la columna «yield»/);
  assert.match((await call('plot_surface', { dataset: 'p', x: 'lon', y: 'lat', z: 'observed' })).content[0].text, /dibuja en ejes de tipo 3d; la figura no tiene ninguno/);
  assert.match((await call('plot_line', { figure_id: 'fig9', x: [1], y: [2] })).content[0].text, /No hay una figura «fig9»/);
  // Inline values, histogram counts, facets.
  await ok('plot_figure', { facet: { dataset: 'p', column: 'state' }, share_y: true });
  const h = await ok('plot_hist', { ax: '*', dataset: 'p', x: 'observed', bins: 5 });
  assert.deepEqual(h.json.bins.map((b: { n: number }) => b.n), [36, 71, 31]);
  await ok('plot_figure', { axes_types: ['3d'] });
  await ok('stats_interpolate', { dataset: 'p', column: 'observed', nx: 20, ny: 20 });
  await ok('plot_surface', { dataset: 'malla_observed', x: 'lon', y: 'lat', z: 'value' });
  const surf = await ok('plot_show', {});
  assert.equal((compile((surf._meta!['agrocebada/figure'] as { state: unknown }).state) as { data: { type: string; z: unknown[][] }[] }).data[0].z.length, 20);
  // A masked grid from stats_interpolate is a grid: contours and the map raster take it as is.
  await ok('plot_figure', { mosaic: [['c', 'm']], axes_types: { m: 'map' } });
  await ok('plot_contour', { ax: 'c', dataset: 'malla_observed', x: 'lon', y: 'lat', z: 'value' });
  const raster = await ok('plot_map', { ax: 'm', layer: 'malla', dataset: 'malla_observed' });
  assert.ok(raster.json.points > 0 && raster.json.points <= 400);
  // A map figure becomes a temporary layer for the app's map: LISA classes with their legend, a pinned note.
  await ok('plot_figure', { title: 'Clusters', axes_types: ['map'] });
  await ok('plot_map', { dataset: 'p', layer: 'parcelas', color_by: 'observed_lisa' });
  await ok('plot_annotate', { dataset: 'p', where: "id == 'AGC_001'", x: 'lon', y: 'lat', text: 'Calpulalpan\nbajo' });
  const lisaFig = await ok('plot_show', {});
  const temp = tempLayerOf((lisaFig._meta!['agrocebada/figure'] as { state: Parameters<typeof tempLayerOf>[0] }).state, 'ax1');
  assert.equal(temp.parcels.length, 138); assert.ok(temp.legend.items.some(([label, color]: [string, string]) => label === 'HH' && color === '#d7191c'));
  assert.deepEqual(temp.markers[0].slice(2), ['Calpulalpan\nbajo']);
  assert.equal(colorAt([[0, '#000000'], [1, '#ffffff']], 0.5), '#808080');
  await ok('plot_figure', { axes_types: ['map'] });
  await ok('plot_map', { dataset: 'p', layer: 'parcelas', color_by: 'observed', colormap: 'ylgn' });
  const cont = tempLayerOf(((await ok('plot_show', {}))._meta!['agrocebada/figure'] as { state: never }).state, 'ax1');
  assert.equal(cont.legend.scale.colors.length, 9); assert.ok(new Set(cont.parcels.map((p: [string, string]) => p[1])).size > 20, 'a colour per value');
  const guide = await ok('plot_guide', { topic: 'espacial' });
  assert.match(guide.content[0].text, /Diagrama de Moran/);
});
