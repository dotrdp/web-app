// Milli's data plane: the same data the app shows (parcels with the ensemble's out-of-fold
// predictions merged in, FIRA's monthly Sentinel-2 NDVI, CHIRPS rain, regional error), read on
// the server so analysis never depends on what a screen happens to display. Every function is
// pure over the loaded atlas, mirroring the app's own calculations in src/lib.ts and the panels.
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
export const YEARS = [2022, 2023, 2024, 2025];
/** Growing cycle used by the dashboard's NDVI integral: April to the October cutoff (0-based months). */
export const CYCLE = [3, 4, 5, 6, 7, 8, 9];
/** Fewer evaluated parcels than this and a municipality borrows its state's error (RegionError.tsx). */
export const SMALL_SAMPLE = 5;
const key = (year, month0) => `${year}-${String(month0 + 1).padStart(2, '0')}`;
const round = (v, d = 4) => v == null || Number.isNaN(v) ? null : Math.round(v * 10 ** d) / 10 ** d;
const mean = xs => { const v = xs.filter(x => x != null && !Number.isNaN(x)); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };

export async function loadAtlas(dataDir) {
  const read = async name => JSON.parse(await readFile(path.join(dataDir, name), 'utf8'));
  const [geo, predictions, details] = await Promise.all([read('parcels.geojson'), read('predictions.json'), read('parcel-data.json')]);
  return { geo, predictions, details };
}

/** Parcels as the app merges them (lib.ts mergedParcels): ensemble predictions plus the account's own fields. */
export function parcels(atlas, workspace = { overrides: {}, fields: [] }) {
  const q80 = atlas.predictions.absErrorQuantiles['0.8'];
  const original = atlas.geo.features.map(f => {
    const p = f.properties, pred = atlas.predictions.parcels[p.id], area = workspace.overrides[p.id]?.area ?? p.area;
    const predicted = pred?.predicted ?? null;
    return { id: p.id, name: p.name ?? null, municipality: p.municipality, state: p.state, group: p.group, area: round(area, 2),
      observed: p.observedYield ?? null, predicted: round(predicted), interval80: predicted == null ? null : [round(Math.max(0, predicted - q80)), round(predicted + q80)],
      production: predicted == null ? null : round(predicted * area, 2), error: predicted != null && p.observedYield != null ? round(predicted - p.observedYield) : null,
      bounds: p.bounds, centroid: p.centroid, fold: pred?.fold ?? null };
  });
  const own = workspace.fields.map(f => ({ id: f.id, name: f.name, municipality: 'Terreno personalizado', state: 'Mi parcela', group: 'custom', area: round(workspace.overrides[f.id]?.area ?? f.area, 2),
    observed: null, predicted: null, interval80: null, production: null, error: null, bounds: null, centroid: null, fold: null }));
  return [...original, ...own];
}

const GROUPS = { reservadas: 'prediction', prediction: 'prediction', con_rendimiento: 'training', training: 'training', propias: 'custom', custom: 'custom' };
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Filter, sort and page the parcels. Filters combine with AND. */
export function queryParcels(all, { ids, state, municipality, group, query, predicted_min, predicted_max, area_min, area_max, has_observed, sort = 'id', desc = false, offset = 0, limit = 50, fields } = {}) {
  let rows = all;
  if (ids?.length) { const s = new Set(ids); rows = rows.filter(p => s.has(p.id)); }
  if (state) rows = rows.filter(p => norm(p.state) === norm(state));
  if (municipality) { const m = (Array.isArray(municipality) ? municipality : [municipality]).map(norm); rows = rows.filter(p => m.includes(norm(p.municipality))); }
  if (group && group !== 'all') rows = rows.filter(p => p.group === (GROUPS[group] ?? group));
  if (query) rows = rows.filter(p => norm(`${p.id} ${p.name ?? ''} ${p.municipality} ${p.state}`).includes(norm(query)));
  if (predicted_min != null) rows = rows.filter(p => p.predicted != null && p.predicted >= predicted_min);
  if (predicted_max != null) rows = rows.filter(p => p.predicted != null && p.predicted <= predicted_max);
  if (area_min != null) rows = rows.filter(p => p.area >= area_min);
  if (area_max != null) rows = rows.filter(p => p.area <= area_max);
  if (has_observed != null) rows = rows.filter(p => (p.observed != null) === has_observed);
  const sorted = [...rows].sort((a, b) => {
    const x = a[sort], y = b[sort];
    if (x == null) return 1; if (y == null) return -1;
    const c = typeof x === 'string' ? x.localeCompare(String(y)) : x - y;
    return desc ? -c : c;
  });
  const keep = fields?.length ? fields : ['id', 'name', 'municipality', 'state', 'group', 'area', 'observed', 'predicted', 'interval80', 'production', 'error'];
  const page = sorted.slice(offset, offset + Math.min(limit, 500)).map(p => Object.fromEntries(keep.map(k => [k, p[k] ?? null])));
  const est = rows.filter(p => p.predicted != null);
  const ha = est.reduce((t, p) => t + p.area, 0), production = est.reduce((t, p) => t + p.production, 0);
  return { total: rows.length, offset, returned: page.length, rows: page,
    summary: { parcels: rows.length, with_estimate: est.length, area_ha: round(rows.reduce((t, p) => t + p.area, 0), 2), production_t: round(production, 1), mean_yield_t_ha: round(ha ? production / ha : null) } };
}

/** Monthly NDVI (mean/min/max, scenes) and climate per parcel, plus the average across them. */
export function series(atlas, { ids, years = [2025], metrics = ['ndvi_mean', 'ndvi_min', 'ndvi_max', 'precip'] }) {
  const want = new Set(metrics), out = {};
  const pick = (id, k) => {
    const n = atlas.details[id]?.ndvi?.['Sentinel-2']?.[k], c = atlas.details[id]?.climate?.[k];
    const row = { month: k };
    if (want.has('ndvi_mean')) row.ndvi_mean = round(n?.mean);
    if (want.has('ndvi_min')) row.ndvi_min = round(n?.min ?? null);
    if (want.has('ndvi_max')) row.ndvi_max = round(n?.max ?? null);
    if (want.has('scenes')) row.scenes = n?.observations ?? 0;
    if (want.has('precip')) row.precip_mm = round(c?.precipitation, 1);
    if (want.has('tmin')) row.tmin_c = round(c?.tmin, 1);
    if (want.has('tmax')) row.tmax_c = round(c?.tmax, 1);
    return row;
  };
  const keys = years.flatMap(y => MONTHS.map((_, i) => key(y, i)));
  for (const id of ids) out[id] = atlas.details[id] ? keys.map(k => pick(id, k)) : null;
  const known = ids.filter(id => out[id]);
  const average = keys.map((k, i) => {
    const row = { month: k };
    for (const m of Object.keys(out[known[0]]?.[i] ?? {}).filter(m => m !== 'month')) row[m] = round(mean(known.map(id => out[id][i][m])), m.startsWith('ndvi') ? 4 : 1);
    return row;
  });
  return { parcels: known.length, missing: ids.filter(id => !out[id]), average, by_parcel: out };
}

/** NDVI integral over the cycle, like the dashboard: trapezoids over the monthly mean of the parcels' means. */
export function integrals(atlas, { ids, years = YEARS }) {
  return years.map(year => {
    const pts = CYCLE.map(i => [i, mean(ids.map(id => atlas.details[id]?.ndvi?.['Sentinel-2']?.[key(year, i)]?.mean))]).filter(p => p[1] != null);
    const value = pts.length > 1 ? pts.slice(1).reduce((t, [i, v], k) => t + (i - pts[k][0]) * (v + pts[k][1]) / 2, 0) : null;
    return { year, value_ndvi_month: round(value, 3), months_with_data: pts.length };
  });
}

/** Out-of-fold error measured per state and municipality; expected error per parcel (municipality, or state with few samples). */
export function regionError(all, { level = 'estado', state, ids } = {}) {
  const measured = new Map();
  for (const p of all) {
    if (p.group !== 'training' || p.error == null) continue;
    for (const k of [`e:${p.state}`, `m:${p.state}/${p.municipality}`]) measured.set(k, [...measured.get(k) ?? [], p.error]);
  }
  const stat = errs => errs ? { n: errs.length, mae: round(mean(errs.map(Math.abs)), 3), rmse: round(Math.sqrt(mean(errs.map(e => e * e))), 3), bias: round(mean(errs), 3) } : null;
  const overall = stat(all.filter(p => p.group === 'training' && p.error != null).map(p => p.error));
  const expectedFor = p => {
    const m = measured.get(`m:${p.state}/${p.municipality}`);
    return m && m.length >= SMALL_SAMPLE ? { expected: round(mean(m.map(Math.abs)), 3), source: 'municipio' } : { expected: round(mean((measured.get(`e:${p.state}`) ?? []).map(Math.abs)) ?? overall.mae, 3), source: 'estado' };
  };
  const scope = ids?.length ? all.filter(p => ids.includes(p.id) && p.predicted != null) : all.filter(p => p.predicted != null);
  const groups = new Map();
  for (const p of scope) {
    if (level === 'municipio' && state && norm(p.state) !== norm(state)) continue;
    const k = level === 'municipio' ? `${p.state}/${p.municipality}` : p.state;
    groups.set(k, [...groups.get(k) ?? [], p]);
  }
  const regions = [...groups].map(([k, ps]) => {
    const [st, mun] = level === 'municipio' ? k.split('/') : [k, null];
    const e = expectedFor(ps[0]);
    return { name: mun ?? st, state: st, parcels: ps.length, expected_error_t_ha: level === 'municipio' ? e.expected : round(mean(ps.map(p => expectedFor(p).expected)), 3),
      source: level === 'municipio' ? e.source : 'mixto', measured: stat(measured.get(level === 'municipio' ? `m:${k}` : `e:${k}`)) };
  }).sort((a, b) => b.parcels - a.parcels);
  return { level, state: state ?? null, overall, regions };
}

export function modelMetrics(atlas) {
  const p = atlas.predictions;
  return { model: p.model.name, cutoff: p.model.cutoff, evaluation: p.model.evaluation, metrics: p.metrics, abs_error_quantiles: p.absErrorQuantiles, share_within: p.shareWithin, folds: p.folds };
}

/** Minimal RFC 4180 CSV parser for attachments: quoted fields, escaped quotes, CRLF or LF; the
 *  delimiter (comma, or the semicolon Spanish-locale spreadsheets export) is taken from the header. */
export function parseCsv(text) {
  const rows = []; let row = [], field = '', quoted = false;
  const src = text.replace(/^\uFEFF/, '');
  const firstLine = src.split(/\r?\n/, 1)[0].replace(/"[^"]*"/g, '');
  const delimiter = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ';' : ',';
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"') { if (src[i + 1] === '"') { field += '"'; i++; } else quoted = false; }
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === delimiter) { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && src[i + 1] === '\n') i++; row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const clean = rows.filter(r => r.some(v => v.trim() !== ''));
  if (clean.length < 1) throw new Error('El CSV está vacío.');
  const [header, ...body] = clean;
  if (header.length < 1 || header.every(h => !h.trim())) throw new Error('El CSV no tiene encabezados.');
  return { columns: header.map((h, i) => h.trim() || `columna_${i + 1}`), rows: body };
}

/** Seed cost per hectare, as the calculator: kg (seeds/m² × thousand-kernel weight ÷ 100 × MXN/kg) or bultos (10,000 m² ÷ m² per bulto × MXN/bulto). */
export function seedCostHa(seed) {
  if (!seed) return null;
  if (seed.unit === 'kg') return seed.price != null && seed.per_m2 != null && (seed.tkw ?? 45) != null ? seed.per_m2 * (seed.tkw ?? 45) / 100 * seed.price : null;
  return seed.bag_price != null && seed.bag_m2 ? 10_000 / seed.bag_m2 * seed.bag_price : null;
}

/** The economics calculator (EconomicsPanel.tsx) on the server: same formulas, so results don't depend on the screen. */
export function economics(atlas, all, { price = 6500, cost_ha = null, seed, coverage = '0.8', scope = 'all', checked_parcel_ids } = {}) {
  let costHa = cost_ha;
  const seedCost = seedCostHa(seed);
  if (seedCost != null) costHa = Math.round(seedCost + (seed.other ?? 0));
  const q = atlas.predictions.absErrorQuantiles[coverage];
  let rows = all.filter(p => p.predicted != null && (scope === 'all' || scope === 'selected' || p.group === scope));
  if (checked_parcel_ids?.length) { const s = new Set(checked_parcel_ids); rows = rows.filter(p => s.has(p.id)); }
  const area = rows.reduce((t, p) => t + p.area, 0), production = rows.reduce((t, p) => t + p.predicted * p.area, 0), income = production * price;
  const breakEven = costHa == null || price <= 0 ? null : costHa / price;
  return { inputs: { price, cost_ha: costHa, seed_cost_ha: seedCost == null ? null : Math.round(seedCost), coverage, scope },
    totals: { parcels: rows.length, area: round(area, 2), production: round(production, 1), income: round(income, 0), band: round(rows.reduce((t, p) => t + q * p.area * price, 0), 0),
      cost: costHa == null ? null : round(costHa * area, 0), margin: costHa == null ? null : round(income - costHa * area, 0),
      breakEven: round(breakEven, 3), above: breakEven == null ? null : rows.filter(p => p.predicted >= breakEven).length } };
}
