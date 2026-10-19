// Spatial statistics for Milli: great-circle distances, spatial weights (k nearest neighbours,
// distance band, inverse distance), global Moran's I and Geary's C with analytical and permutation
// inference, local Moran's I (LISA clusters) and Getis–Ord Gi* hot spots, the empirical
// semivariogram with spherical / exponential / Gaussian fits, a Moran correlogram, and inverse
// distance weighting onto a grid. Formulas follow PySAL (esda) and gstat; checked in tests.
import { isNum } from './expr.mjs';
import { chi2Survival, normalTwoSided, rng, round as r, rp } from './stats.mjs';
const chi2p = v => rp(chi2Survival(v, 1));

const R_KM = 6371.0088, rad = d => d * Math.PI / 180;
export function haversine(lon1, lat1, lon2, lat2) {
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return 2 * R_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}
const sum = a => a.reduce((s, v) => s + v, 0);
export const MAX_POINTS = 3000;

/** Rows with a value and coordinates: { idx (row numbers), x (values), lon, lat, d (distance matrix) }. */
export function points(columns, n, { value, lon = 'lon', lat = 'lat' }) {
  for (const c of [value, lon, lat].filter(Boolean)) if (!(c in columns)) throw new Error(`No existe la columna «${c}». Columnas: ${Object.keys(columns).join(', ')}.`);
  const idx = []; for (let i = 0; i < n; i++) if ((!value || isNum(columns[value][i])) && isNum(columns[lon][i]) && isNum(columns[lat][i])) idx.push(i);
  if (idx.length < 5) throw new Error(`Hay ${idx.length} filas con ${value ? `${value}, ` : ''}${lon} y ${lat}; hacen falta al menos 5.`);
  if (idx.length > MAX_POINTS) throw new Error(`Hay ${idx.length} puntos; el máximo para estadística espacial es ${MAX_POINTS}. Agrega por parcela antes (un punto por parcela).`);
  const LO = idx.map(i => columns[lon][i]), LA = idx.map(i => columns[lat][i]);
  if (LO.some(v => Math.abs(v) > 180) || LA.some(v => Math.abs(v) > 90)) throw new Error(`${lon}/${lat} no parecen grados de longitud/latitud.`);
  const m = idx.length, d = Array.from({ length: m }, () => new Float64Array(m));
  for (let i = 0; i < m; i++) for (let j = i + 1; j < m; j++) d[i][j] = d[j][i] = haversine(LO[i], LA[i], LO[j], LA[j]);
  return { idx, x: value ? idx.map(i => columns[value][i]) : null, lon: LO, lat: LA, d };
}

/** Spatial weights as neighbour lists [{ j, w }]. Row-standardized unless standardize is false. */
export function weights(d, { type = 'knn', k = 8, km, power = 1, standardize = true } = {}) {
  const n = d.length, lists = [];
  for (let i = 0; i < n; i++) {
    let nb;
    const order = () => Array.from({ length: n }, (_, j) => j).filter(j => j !== i).sort((a, b) => d[i][a] - d[i][b]);
    if (type === 'knn') nb = order().slice(0, Math.min(k, n - 1)).map(j => ({ j, w: 1 }));
    else if (type === 'distance') { if (!(km > 0)) throw new Error('weights distance necesita km > 0.'); nb = order().filter(j => d[i][j] <= km).map(j => ({ j, w: 1 })); }
    else if (type === 'inverse_distance') nb = order().filter(j => !km || d[i][j] <= km).map(j => ({ j, w: 1 / Math.max(d[i][j], 0.01) ** power }));
    else throw new Error(`Tipo de pesos desconocido: ${type}.`);
    lists.push(nb);
  }
  if (standardize) for (const nb of lists) { const t = sum(nb.map(x => x.w)); if (t) nb.forEach(x => { x.w /= t; }); }
  const counts = lists.map(nb => nb.length);
  return { lists, summary: { type, k: type === 'knn' ? Math.min(k, n - 1) : undefined, km, standardized: standardize, mean_neighbors: r(sum(counts) / n, 2), min_neighbors: Math.min(...counts), max_neighbors: Math.max(...counts), isolates: counts.filter(c => !c).length,
    mean_neighbor_km: r(sum(lists.map((nb, i) => nb.length ? sum(nb.map(x => d[i][x.j])) / nb.length : 0)) / n, 3) } };
}

const lagOf = (lists, z) => lists.map(nb => sum(nb.map(({ j, w }) => w * z[j])));
function moranI(lists, z, s0) { let num = 0; lists.forEach((nb, i) => { for (const { j, w } of nb) num += w * z[i] * z[j]; }); return z.length / s0 * num / sum(z.map(v => v * v)); }
function shuffle(a, rand) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

/** Global Moran's I and Geary's C (normality and permutation inference) plus, per point, the
 *  standardized value, its spatial lag, local Moran's I with conditional-permutation pseudo
 *  p-values and LISA quadrant, and optionally Getis–Ord Gi* z-scores. */
export function autocorrelation(x, d, w, { permutations = 999, seed = 12345, alpha = 0.05, local = true, getis = false, gWeights } = {}) {
  const n = x.length, mean = sum(x) / n, dev = x.map(v => v - mean), m2 = sum(dev.map(v => v * v)) / n;
  if (!m2) throw new Error('El valor es constante: no hay variación que correlacionar.');
  const sd = Math.sqrt(m2), z = dev.map(v => v / sd), { lists } = w;
  let s0 = 0, s1 = 0; const rowSum = Array(n).fill(0), colSum = Array(n).fill(0), wm = new Map();
  lists.forEach((nb, i) => { for (const { j, w: v } of nb) { s0 += v; rowSum[i] += v; colSum[j] += v; wm.set(i * n + j, v); } });
  // S1 = ½ Σ_ij (w_ij + w_ji)²: each unordered pair counts twice, so once per pair without the ½
  // (kNN weights are asymmetric: a pair can have weight in one direction only).
  const seen = new Set();
  for (const key of wm.keys()) { const i = Math.floor(key / n), j = key % n, pair = Math.min(i, j) * n + Math.max(i, j); if (seen.has(pair)) continue; seen.add(pair); s1 += ((wm.get(i * n + j) ?? 0) + (wm.get(j * n + i) ?? 0)) ** 2; }
  const s2 = sum(rowSum.map((v, i) => (v + colSum[i]) ** 2));
  const I = moranI(lists, dev, s0), EI = -1 / (n - 1);
  const varN = (n * n * s1 - n * s2 + 3 * s0 * s0) / ((n * n - 1) * s0 * s0) - EI * EI;
  const zN = (I - EI) / Math.sqrt(varN);
  let geary = 0; lists.forEach((nb, i) => { for (const { j, w: v } of nb) geary += v * (x[i] - x[j]) ** 2; });
  const C = (n - 1) * geary / (2 * s0 * sum(dev.map(v => v * v)));
  const varC = ((2 * s1 + s2) * (n - 1) - 4 * s0 * s0) / (2 * (n + 1) * s0 * s0);
  const rand = rng(seed), sims = [];
  for (let p = 0; p < permutations; p++) sims.push(moranI(lists, shuffle(dev, rand), s0));
  const larger = I > EI ? sims.filter(v => v >= I).length : sims.filter(v => v <= I).length;
  const simMean = sum(sims) / (sims.length || 1), simSd = Math.sqrt(sum(sims.map(v => (v - simMean) ** 2)) / Math.max(1, sims.length - 1));
  const lag = lagOf(lists, z);
  const global = {
    n, moran_i: r(I), expected_i: r(EI), z_normal: r(zN, 3), p_normal: rp(normalTwoSided(zN)),
    p_permutation: permutations ? r((larger + 1) / (permutations + 1), 6) : null, z_permutation: permutations && simSd ? r((I - simMean) / simSd, 3) : null, permutations,
    geary_c: r(C), geary_z: r((1 - C) / Math.sqrt(varC), 3), geary_p: rp(normalTwoSided((1 - C) / Math.sqrt(varC))),
    reading: Math.abs(zN) < 1.96 ? 'sin autocorrelación espacial significativa (patrón compatible con azar)' : I > EI ? 'autocorrelación positiva: valores parecidos se agrupan en el espacio' : 'autocorrelación negativa: vecinos tienden a ser distintos (patrón disperso)',
  };
  const out = { global, z, lag };
  if (local) {
    const li = z.map((v, i) => (n - 1) * v * lag[i] / n); // esda: (n − 1) z_i lag_i / Σz², with Σz² = n
    const pLocal = Array(n).fill(null), cls = Array(n).fill(null);
    if (permutations) {
      const randL = rng(seed + 1);
      for (let i = 0; i < n; i++) {
        const nb = lists[i]; if (!nb.length) continue;
        const others = z.filter((_, j) => j !== i); let larger2 = 0;
        for (let p = 0; p < permutations; p++) {
          // Draw |nb| other values without replacement (partial Fisher–Yates on a copy).
          let s = 0; const pool = others; const picked = new Set();
          for (let t = 0; t < nb.length; t++) { let j; do j = Math.floor(randL() * pool.length); while (picked.has(j)); picked.add(j); s += nb[t].w * pool[j]; }
          if (z[i] * s >= z[i] * lag[i]) larger2++;
        }
        if (permutations - larger2 < larger2) larger2 = permutations - larger2;
        pLocal[i] = (larger2 + 1) / (permutations + 1);
      }
    }
    z.forEach((v, i) => { const q = v > 0 ? (lag[i] > 0 ? 'HH' : 'HL') : (lag[i] > 0 ? 'LH' : 'LL'); cls[i] = pLocal[i] != null && pLocal[i] <= alpha ? q : 'no significativo'; });
    out.local = { local_i: li, p: pLocal, quadrant: z.map((v, i) => v > 0 ? (lag[i] > 0 ? 'HH' : 'HL') : (lag[i] > 0 ? 'LH' : 'LL')), cluster: cls };
    const counts = {}; for (const c of cls) counts[c] = (counts[c] ?? 0) + 1; out.global.lisa_counts = counts;
  }
  if (getis) {
    // Gi*: binary weights including the point itself.
    const lists2 = gWeights.lists, xbar = mean, S = Math.sqrt(sum(x.map(v => v * v)) / n - xbar * xbar);
    const gz = x.map((_, i) => { const nb = [...lists2[i].map(o => ({ j: o.j, w: 1 })), { j: i, w: 1 }]; const W = nb.length; const num = sum(nb.map(o => x[o.j])) - xbar * W; const den = S * Math.sqrt((n * W - W * W) / (n - 1)); return den ? num / den : null; });
    out.getis = { z: gz, p: gz.map(v => v == null ? null : normalTwoSided(v)), class: gz.map(v => v == null ? null : v >= 2.576 ? 'caliente 99 %' : v >= 1.96 ? 'caliente 95 %' : v >= 1.645 ? 'caliente 90 %' : v <= -2.576 ? 'frío 99 %' : v <= -1.96 ? 'frío 95 %' : v <= -1.645 ? 'frío 90 %' : 'no significativo') };
  }
  return out;
}

const MODELS = {
  spherical: (h, a) => h >= a ? 1 : 1.5 * h / a - 0.5 * (h / a) ** 3,
  exponential: (h, a) => 1 - Math.exp(-h / a),
  gaussian: (h, a) => 1 - Math.exp(-((h / a) ** 2)),
};
const PRACTICAL = { spherical: 1, exponential: 3, gaussian: Math.sqrt(3) };

/** Empirical semivariogram (Matheron or Cressie–Hawkins) in distance bins, and a weighted
 *  least-squares fit of a spherical, exponential or Gaussian model (nugget, partial sill, range). */
export function variogram(x, d, { bins = 12, maxKm, estimator = 'matheron', model = 'spherical', nugget: fixedNugget, rangeKm: fixedRange } = {}) {
  const n = x.length; let maxD = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) maxD = Math.max(maxD, d[i][j]);
  const cutoff = maxKm ?? maxD / 2, width = cutoff / bins;
  const acc = Array.from({ length: bins }, () => ({ h: 0, sq: 0, rt: 0, n: 0 }));
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const h = d[i][j]; if (h > cutoff) continue;
    const b = Math.min(bins - 1, Math.floor(h / width)); const a = acc[b];
    a.h += h; a.sq += (x[i] - x[j]) ** 2; a.rt += Math.sqrt(Math.abs(x[i] - x[j])); a.n++;
  }
  const rows = acc.map((a, b) => a.n ? { bin: b + 1, from_km: r(b * width, 4), to_km: r((b + 1) * width, 4), lag_km: r(a.h / a.n, 4), pairs: a.n,
    gamma: r(estimator === 'cressie' ? (a.rt / a.n) ** 4 / (2 * (0.457 + 0.494 / a.n)) : a.sq / (2 * a.n), 6) } : null).filter(Boolean);
  const mean = sum(x) / n, variance = sum(x.map(v => (v - mean) ** 2)) / (n - 1);
  let fit = null;
  if (model !== 'none' && rows.length >= 3) {
    const f = MODELS[model]; if (!f) throw new Error(`Modelo de variograma desconocido: ${model}.`);
    const hmax = rows.at(-1).lag_km, hmin = rows[0].lag_km;
    // Weighted least squares for nugget c0 and partial sill c at each candidate range a.
    const solve = (a, weight) => {
      let sw = 0, sf = 0, sg = 0, sff = 0, sfg = 0;
      for (const row of rows) { const w = weight(row), v = f(row.lag_km, a); sw += w; sf += w * v; sg += w * row.gamma; sff += w * v * v; sfg += w * v * row.gamma; }
      let c0, c;
      if (fixedNugget != null) { c0 = fixedNugget; c = sff ? Math.max(0, (sfg - c0 * sf) / sff) : 0; }
      else { const den = sw * sff - sf * sf; c0 = den ? (sg * sff - sf * sfg) / den : sg / sw; c = den ? (sw * sfg - sf * sg) / den : 0; if (c0 < 0) { c0 = 0; c = sff ? sfg / sff : 0; } if (c < 0) { c = 0; c0 = sg / sw; } }
      return { a, c0, c, wsse: sum(rows.map(row => weight(row) * (row.gamma - c0 - c * f(row.lag_km, a)) ** 2)) };
    };
    const ranges = fixedRange != null ? [fixedRange / PRACTICAL[model]] : Array.from({ length: 160 }, (_, s2) => hmin * 0.4 + (hmax * 3 - hmin * 0.4) * s2 / 159);
    const search = weight => ranges.map(a => solve(a, weight)).reduce((b, t) => !b || t.wsse < b.wsse ? t : b, null);
    // Weighted by the number of pairs per lag (gstat fit.method 1): agrees best with scipy's curve_fit here.
    let best = search(row => row.pairs);
    // No structure only if γ does not rise with distance and a flat line fits about as well.
    const flat = sum(rows.map(row => row.pairs * row.gamma)) / sum(rows.map(row => row.pairs));
    const sse = c0c => sum(rows.map(row => row.pairs * (row.gamma - c0c(row)) ** 2)), sseFlat = sse(() => flat), sseFit = sse(row => best.c0 + best.c * f(row.lag_km, best.a));
    const head = rows.slice(0, 2).reduce((t, row) => t + row.gamma, 0) / Math.min(2, rows.length), tail = rows.slice(-3).reduce((t, row) => t + row.gamma, 0) / Math.min(3, rows.length);
    const rising = tail > head * 1.25;
    const pure = !rising && (sseFit > 0.8 * sseFlat || best.a * PRACTICAL[model] < hmin);
    if (pure) best = { a: 0, c0: flat, c: 0, pure: true };
    const sill = best.c0 + best.c, ratio = sill ? best.c0 / sill : null, practical = best.a * PRACTICAL[model];
    const warnings = [];
    if (!pure && practical > cutoff) warnings.push(`El alcance práctico (${r(practical, 1)} km) supera la distancia analizada (${r(cutoff, 1)} km): la semivarianza no llega a una meseta. Suele indicar una tendencia regional; prueba el variograma de los residuos de una regresión (stats_regression) o un max_km mayor.`);
    if (!pure && Math.abs(sill - tail) / Math.max(tail, 1e-9) > 0.3 && practical <= cutoff) warnings.push(`La meseta del modelo (${r(sill, 3)}) se aleja de la semivarianza empírica en las últimas distancias (${r(tail, 3)}): el ajuste es pobre; compara otro modelo.`);
    if (rising && sseFit > 0.8 * sseFlat) warnings.push('La semivarianza crece con la distancia, pero el modelo apenas mejora a una recta horizontal: interprétalo con cautela.');
    fit = { model: pure ? 'pepita pura' : model, nugget: r(best.c0, 6), partial_sill: r(best.c, 6), sill: r(sill, 6), range_parameter_km: r(best.a, 4), practical_range_km: r(practical, 4),
      nugget_to_sill: r(ratio, 3), rmse: r(Math.sqrt(sum(rows.map(row => (row.gamma - (pure ? flat : best.c0 + best.c * f(row.lag_km, best.a))) ** 2)) / rows.length), 6), weights: 'pares por clase (N_h)',
      dependence: pure ? 'sin estructura espacial detectable (efecto pepita puro: la semivarianza no crece con la distancia)' : ratio < 0.25 ? 'fuerte (pepita < 25 % de la meseta)' : ratio <= 0.75 ? 'moderada (pepita 25–75 % de la meseta)' : 'débil (pepita > 75 % de la meseta)',
      ...(warnings.length ? { warnings } : {}),
      curve: Array.from({ length: 80 }, (_, i) => { const h = cutoff * i / 79; return { lag_km: r(h, 4), gamma: r(pure ? best.c0 : best.c0 * (h > 0 ? 1 : 0) + best.c * f(h, best.a), 6) }; }) };
  }
  return { cutoff_km: r(cutoff, 4), bin_width_km: r(width, 4), sample_variance: r(variance, 6), estimator, rows, fit };
}

/** Lagrange-multiplier tests on OLS residuals (Anselin 1988; robust forms, Anselin et al. 1996):
 *  do the residuals call for a spatial error or a spatial lag model? `fitted` is Xβ, `mwxb2` is the
 *  squared norm of W·Xβ after projecting out X. */
export function lmTests(w, y, e, fitted, mwxb2) {
  const n = y.length, lag = v => w.lists.map(nb => sum(nb.map(({ j, w: wt }) => wt * v[j]))), s2 = sum(e.map(v => v * v)) / n;
  let T = 0; const wm = new Map(); w.lists.forEach((nb, i) => nb.forEach(({ j, w: wt }) => wm.set(i * n + j, wt)));
  for (const [k, v] of wm) { const i = Math.floor(k / n), j = k % n; T += v * v + v * (wm.get(j * n + i) ?? 0); }
  const We = lag(e), Wy = lag(y), eWe = sum(e.map((v, i) => v * We[i])) / s2, eWy = sum(e.map((v, i) => v * Wy[i])) / s2, D = mwxb2 / s2 + T;
  const test = (stat) => ({ stat: r(stat, 4), p: chi2p(stat) });
  return { lm_error: test(eWe ** 2 / T), lm_lag: test(eWy ** 2 / D), robust_lm_error: test((eWe - T / D * eWy) ** 2 / (T - T * T / D)), robust_lm_lag: test((eWy - eWe) ** 2 / (D - T)),
    reading: 'Si solo LM-error (o su forma robusta) es significativo, el error tiene estructura espacial (modelo de error espacial); si LM-lag, el rendimiento de los vecinos influye directamente (modelo de rezago espacial). Si ambos, mira las robustas.' };
}

/** Moran's I by distance band (binary weights within each band), with normality z and p. */
export function correlogram(x, d, edges) {
  const n = x.length, mean = sum(x) / n, dev = x.map(v => v - mean), ss = sum(dev.map(v => v * v));
  return edges.slice(1).map((hi, b) => {
    const lo = edges[b]; let s0 = 0, num = 0, s1 = 0; const rowSum = Array(n).fill(0);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j && d[i][j] > lo && d[i][j] <= hi) { s0++; num += dev[i] * dev[j]; rowSum[i]++; }
    s1 = 2 * s0; const s2 = sum(rowSum.map(v => (2 * v) ** 2));
    if (!s0) return { from_km: r(lo, 4), to_km: r(hi, 4), mid_km: r((lo + hi) / 2, 4), pairs: 0, moran_i: null, z: null, p: null };
    const I = n / s0 * num / ss, E = -1 / (n - 1), v = (n * n * s1 - n * s2 + 3 * s0 * s0) / ((n * n - 1) * s0 * s0) - E * E, z = (I - E) / Math.sqrt(v);
    return { from_km: r(lo, 4), to_km: r(hi, 4), mid_km: r((lo + hi) / 2, 4), pairs: s0 / 2, moran_i: r(I), z: r(z, 3), p: rp(normalTwoSided(z)) };
  });
}

/** Inverse distance weighting from points onto a lon/lat grid; cells farther than maxKm from every point stay empty. */
export function idw(lon, lat, x, { nx = 60, ny = 60, power = 2, neighbors = 12, maxKm, bbox, pad = 0.05 } = {}) {
  const n = x.length;
  let [w, s, e, nn] = bbox ?? [Math.min(...lon), Math.min(...lat), Math.max(...lon), Math.max(...lat)];
  const dx = (e - w) || 0.01, dy = (nn - s) || 0.01; w -= dx * pad; e += dx * pad; s -= dy * pad; nn += dy * pad;
  if (maxKm == null) { // twice the median distance to the 8th neighbour (about one cluster of parcels), at least 2 km
    const k = Math.min(8, n - 1), kth = lon.map((_, i) => lon.map((__, j) => j === i ? Infinity : haversine(lon[i], lat[i], lon[j], lat[j])).sort((a, b) => a - b)[k - 1]).sort((a, b) => a - b);
    maxKm = Math.max(2, 2 * kth[Math.floor(n / 2)]);
  }
  const rows = [];
  for (let gy = 0; gy < ny; gy++) for (let gx = 0; gx < nx; gx++) {
    const glon = w + (e - w) * gx / (nx - 1), glat = s + (nn - s) * gy / (ny - 1);
    const ds = lon.map((_, i) => [haversine(glon, glat, lon[i], lat[i]), i]).sort((a, b) => a[0] - b[0]).slice(0, neighbors);
    let z = null;
    if (ds[0][0] <= maxKm) {
      if (ds[0][0] < 1e-6) z = x[ds[0][1]];
      else { let num = 0, den = 0; for (const [dist, i] of ds) { const wt = 1 / dist ** power; num += wt * x[i]; den += wt; } z = num / den; }
    }
    rows.push({ lon: r(glon, 6), lat: r(glat, 6), value: z == null ? null : r(z, 6) });
  }
  return { nx, ny, bbox: [w, s, e, nn].map(v => r(v, 6)), max_km: r(maxKm, 3), rows };
}
