// Statistics for Milli's analysis tools, in plain JavaScript: distributions (normal, t, F, χ²),
// descriptive statistics, correlation matrices with p-values, ordinary least squares with
// diagnostics, group comparisons, kernel density and LOWESS. Checked against numpy/scipy in
// tests/analysis.test.ts.
import { isNum, quantile, ranks } from './expr.mjs';

// ── Special functions and distributions ────────────────────────────────────────────────────────
const LANCZOS = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
export function lgamma(x) {
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
  x -= 1; let a = 0.99999999999980993; const t = x + 7.5;
  for (let i = 0; i < 8; i++) a += LANCZOS[i] / (x + i + 1);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
function betacf(a, b, x) {
  const FPMIN = 1e-300, qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < FPMIN) d = FPMIN; d = 1 / d; let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d; h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d;
    const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-16) break;
  }
  return h;
}
/** Regularized incomplete beta I_x(a, b). */
export function ibeta(x, a, b) {
  if (x <= 0) return 0; if (x >= 1) return 1;
  const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
}
/** Regularized lower incomplete gamma P(a, x). */
export function gammp(a, x) {
  if (x <= 0) return 0;
  if (x < a + 1) { let sum = 1 / a, del = sum, ap = a; for (let n = 0; n < 500; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; } return sum * Math.exp(-x + a * Math.log(x) - lgamma(a)); }
  const FPMIN = 1e-300; let b = x + 1 - a, c = 1 / FPMIN, d = 1 / b, h = d;
  for (let i = 1; i < 500; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < FPMIN) d = FPMIN; c = b + an / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break; }
  return 1 - Math.exp(-x + a * Math.log(x) - lgamma(a)) * h;
}
/** erfc with relative error < 1.2e-7 (Numerical Recipes). */
function erfc(z) {
  const t = 1 / (1 + 0.5 * Math.abs(z));
  const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return z >= 0 ? r : 2 - r;
}
export const normalCdf = z => 0.5 * erfc(-z / Math.SQRT2);
export const normalTwoSided = z => Math.min(1, erfc(Math.abs(z) / Math.SQRT2));
export function normalQuantile(p) {
  let lo = -40, hi = 40; for (let i = 0; i < 120; i++) { const mid = (lo + hi) / 2; if (normalCdf(mid) < p) lo = mid; else hi = mid; } return (lo + hi) / 2;
}
export const tTwoSided = (t, df) => Math.min(1, ibeta(df / (df + t * t), df / 2, 0.5));
export const tCdf = (t, df) => { const tail = 0.5 * ibeta(df / (df + t * t), df / 2, 0.5); return t >= 0 ? 1 - tail : tail; };
export function tQuantile(p, df) {
  let lo = -1e4, hi = 1e4; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (tCdf(mid, df) < p) lo = mid; else hi = mid; } return (lo + hi) / 2;
}
export const fSurvival = (f, d1, d2) => f <= 0 ? 1 : ibeta(d2 / (d2 + d1 * f), d2 / 2, d1 / 2);
export const chi2Survival = (x, k) => 1 - gammp(k / 2, x / 2);

/** Seeded PRNG (mulberry32), so permutation tests are reproducible. */
export function rng(seed = 12345) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// ── Descriptive ────────────────────────────────────────────────────────────────────────────────
const r = (v, d = 4) => v == null || !Number.isFinite(v) ? null : Math.round(v * 10 ** d) / 10 ** d;
export const round = r;
/** p-values: 6 decimals, but tiny ones keep 3 significant digits (1.07e-34), never 0; below double precision, 1e-300. */
export const rp = v => v == null || !Number.isFinite(v) ? null : v < 1e-300 ? 1e-300 : v < 1e-4 ? Number(v.toPrecision(3)) : r(v, 6);
const sum = a => a.reduce((s, v) => s + v, 0);

export function describe(values) {
  const v = values.filter(isNum), n = v.length;
  if (!n) {
    const strings = values.filter(x => x != null && x !== '');
    const counts = new Map(); for (const s of strings) counts.set(s, (counts.get(s) ?? 0) + 1);
    return { type: 'texto', count: strings.length, nulls: values.length - strings.length, unique: counts.size,
      top: [...counts].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([value, count]) => ({ value, count })) };
  }
  const m = sum(v) / n, sd = n > 1 ? Math.sqrt(sum(v.map(x => (x - m) ** 2)) / (n - 1)) : null;
  const skew = sd && n > 2 ? n / ((n - 1) * (n - 2)) * sum(v.map(x => ((x - m) / sd) ** 3)) : null;
  return { type: 'número', count: n, nulls: values.length - n, mean: r(m), std: r(sd), min: r(Math.min(...v)), q25: r(quantile(v, 0.25)), median: r(quantile(v, 0.5)), q75: r(quantile(v, 0.75)), max: r(Math.max(...v)), skew: r(skew, 3) };
}

/** Pearson (or Spearman, on ranks) correlation with a two-sided t-test p-value; pairwise complete. */
export function correlation(a, b, method = 'pearson') {
  const idx = a.map((_, i) => i).filter(i => isNum(a[i]) && isNum(b[i]));
  const n = idx.length; if (n < 3) return { r: null, p: null, n };
  let x = idx.map(i => a[i]), y = idx.map(i => b[i]);
  if (method === 'spearman') { x = ranks(x); y = ranks(y); }
  const mx = sum(x) / n, my = sum(y) / n;
  let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
  if (!sxx || !syy) return { r: null, p: null, n };
  const rho = Math.max(-1, Math.min(1, sxy / Math.sqrt(sxx * syy)));
  const t = rho * Math.sqrt((n - 2) / Math.max(1e-300, 1 - rho * rho));
  return { r: rho, p: Math.abs(rho) === 1 ? 0 : tTwoSided(t, n - 2), n };
}

// ── Linear algebra ─────────────────────────────────────────────────────────────────────────────
/** Inverse of a symmetric positive (semi)definite matrix by Gauss–Jordan with pivoting; null if singular. */
export function invert(m) {
  const n = m.length, a = m.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => +(i === j))]);
  const scale = Math.max(...m.map((row, i) => Math.abs(row[i]))) || 1;
  for (let c = 0; c < n; c++) {
    let p = c; for (let i = c + 1; i < n; i++) if (Math.abs(a[i][c]) > Math.abs(a[p][c])) p = i;
    if (Math.abs(a[p][c]) < 1e-11 * scale) return null;
    [a[c], a[p]] = [a[p], a[c]];
    const d = a[c][c]; for (let j = 0; j < 2 * n; j++) a[c][j] /= d;
    for (let i = 0; i < n; i++) if (i !== c) { const f = a[i][c]; if (f) for (let j = 0; j < 2 * n; j++) a[i][j] -= f * a[c][j]; }
  }
  return a.map(row => row.slice(n));
}

/** Design matrix from columns: numeric predictors as they are, text ones as 0/1 dummies (first level is the reference). */
export function design(columns, predictors, { intercept = true } = {}) {
  const terms = [], getters = [];
  if (intercept) { terms.push('(intercepto)'); getters.push(() => 1); }
  for (const p of predictors) {
    const col = columns[p];
    if (!col) throw new Error(`No existe la columna «${p}». Columnas: ${Object.keys(columns).join(', ')}.`);
    const numeric = col.every(v => v == null || isNum(v));
    if (numeric) { terms.push(p); getters.push(i => col[i]); continue; }
    const levels = [...new Set(col.filter(v => v != null && v !== ''))].map(String).sort();
    if (levels.length < 2) throw new Error(`La columna «${p}» solo tiene un valor; no sirve como predictor.`);
    if (levels.length > 30) throw new Error(`La columna «${p}» tiene ${levels.length} categorías; agrúpalas antes (máximo 30).`);
    for (const lv of levels.slice(1)) { terms.push(`${p}[${lv}]`); getters.push(i => col[i] == null || col[i] === '' ? null : +(String(col[i]) === lv)); }
  }
  return { terms, row: i => getters.map(g => g(i)) };
}

/** Ordinary least squares: coefficients with SE, t, p and 95 % CI; fit statistics; per-row fitted,
 *  residuals, standardized residuals, leverage and Cook's distance (null for rows left out). */
export function ols(columns, n, y, predictors, { intercept = true } = {}) {
  const yc = columns[y]; if (!yc) throw new Error(`No existe la columna «${y}».`);
  const { terms, row } = design(columns, predictors, { intercept });
  const used = [], X = [], Y = [];
  for (let i = 0; i < n; i++) { const x = row(i); if (isNum(yc[i]) && x.every(isNum)) { used.push(i); X.push(x); Y.push(yc[i]); } }
  const k = terms.length, m = X.length;
  if (m <= k) throw new Error(`Hay ${m} filas completas para ${k} coeficientes: faltan datos (revisa los nulos de ${[y, ...predictors].join(', ')}).`);
  const xtx = terms.map((_, a) => terms.map((_, b) => X.reduce((s, x) => s + x[a] * x[b], 0)));
  const inv = invert(xtx);
  if (!inv) throw new Error('Los predictores son colineales (uno es combinación de otros); quita alguno.');
  const xty = terms.map((_, a) => X.reduce((s, x, i) => s + x[a] * Y[i], 0));
  const beta = inv.map(rowv => rowv.reduce((s, v, j) => s + v * xty[j], 0));
  const fitted = X.map(x => x.reduce((s, v, j) => s + v * beta[j], 0)), resid = Y.map((v, i) => v - fitted[i]);
  const sse = sum(resid.map(e => e * e)), my = sum(Y) / m, sst = sum(Y.map(v => (v - my) ** 2));
  const df = m - k, sigma2 = sse / df, tcrit = tQuantile(0.975, df);
  const coefficients = terms.map((term, j) => {
    const se = Math.sqrt(sigma2 * inv[j][j]), t = beta[j] / se;
    return { term, estimate: r(beta[j], 6), se: r(se, 6), t: r(t, 3), p: rp(tTwoSided(t, df)), ci_low: r(beta[j] - tcrit * se, 6), ci_high: r(beta[j] + tcrit * se, 6) };
  });
  const r2 = intercept ? 1 - sse / sst : null, kNoInt = intercept ? k - 1 : k;
  const fstat = intercept && kNoInt > 0 ? ((sst - sse) / kNoInt) / sigma2 : null;
  const lev = X.map(x => { let h = 0; for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) h += x[a] * inv[a][b] * x[b]; return h; });
  const rows = { fitted: Array(n).fill(null), residual: Array(n).fill(null), std_residual: Array(n).fill(null), leverage: Array(n).fill(null), cooks_d: Array(n).fill(null) };
  used.forEach((i, j) => {
    const sr = resid[j] / Math.sqrt(sigma2 * Math.max(1e-12, 1 - lev[j]));
    rows.fitted[i] = r(fitted[j], 6); rows.residual[i] = r(resid[j], 6); rows.std_residual[i] = r(sr, 4); rows.leverage[i] = r(lev[j], 4); rows.cooks_d[i] = r(sr * sr / k * lev[j] / Math.max(1e-12, 1 - lev[j]), 5);
  });
  return {
    model: { y, predictors, terms, intercept, n: m, dropped: n - m, df_resid: df, r2: r(r2), adj_r2: r2 == null ? null : r(1 - (1 - r2) * (m - 1) / df), rmse: r(Math.sqrt(sigma2)), mae: r(sum(resid.map(Math.abs)) / m),
      f: r(fstat, 4), f_p: fstat == null ? null : rp(fSurvival(fstat, kNoInt, df)), aic: r(m * Math.log(sse / m) + 2 * k, 3), coefficients },
    rows, predict: (x, interval = 'confidence') => { // x without intercept term
      const v = intercept ? [1, ...x] : x; const yhat = v.reduce((s, a, j) => s + a * beta[j], 0);
      let q = 0; for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) q += v[a] * inv[a][b] * v[b];
      const se = Math.sqrt(sigma2 * (q + (interval === 'prediction' ? 1 : 0)));
      return { y: yhat, low: yhat - tcrit * se, high: yhat + tcrit * se };
    },
  };
}

/** Polynomial fit of y on x (degree 1–5) evaluated on a grid, with its 95 % band. */
export function polyFit(xs, ys, degree = 1, { points = 120, interval = 'confidence', from, to } = {}) {
  const pairs = xs.map((x, i) => [x, ys[i]]).filter(([x, y]) => isNum(x) && isNum(y));
  if (pairs.length < degree + 2) throw new Error(`Hacen falta al menos ${degree + 2} puntos con x e y para ajustar grado ${degree}.`);
  const cols = { y: pairs.map(p => p[1]) }; const names = [];
  for (let d = 1; d <= degree; d++) { cols[`x${d}`] = pairs.map(p => p[0] ** d); names.push(`x${d}`); }
  const fit = ols(cols, pairs.length, 'y', names);
  const lo = from ?? Math.min(...pairs.map(p => p[0])), hi = to ?? Math.max(...pairs.map(p => p[0]));
  const grid = Array.from({ length: points }, (_, i) => lo + (hi - lo) * i / (points - 1));
  const curve = grid.map(x => ({ x, ...fit.predict(names.map((_, d) => x ** (d + 1)), interval) }));
  return { model: fit.model, curve };
}

/** LOWESS (Cleveland): local linear fits with tricube weights and bisquare robustness iterations. */
export function lowess(xs, ys, { frac = 2 / 3, iterations = 2 } = {}) {
  const pts = xs.map((x, i) => [x, ys[i]]).filter(([x, y]) => isNum(x) && isNum(y)).sort((a, b) => a[0] - b[0]);
  const n = pts.length; if (n < 4) throw new Error('LOWESS necesita al menos 4 puntos.');
  const x = pts.map(p => p[0]), y = pts.map(p => p[1]), k = Math.max(3, Math.min(n, Math.round(frac * n)));
  let robust = Array(n).fill(1), fit = Array(n).fill(0);
  for (let it = 0; it <= iterations; it++) {
    fit = x.map(x0 => {
      const d = x.map(v => Math.abs(v - x0)), h = [...d].sort((a, b) => a - b)[k - 1] || 1e-12;
      let sw = 0, swx = 0, swy = 0, swxx = 0, swxy = 0;
      for (let j = 0; j < n; j++) { const u = d[j] / h; if (u >= 1) continue; const w = (1 - u ** 3) ** 3 * robust[j]; sw += w; swx += w * x[j]; swy += w * y[j]; swxx += w * x[j] ** 2; swxy += w * x[j] * y[j]; }
      const den = sw * swxx - swx * swx;
      if (!sw) return y[x.indexOf(x0)];
      if (Math.abs(den) < 1e-12) return swy / sw;
      const b = (sw * swxy - swx * swy) / den, a = (swy - b * swx) / sw; return a + b * x0;
    });
    const res = y.map((v, i) => v - fit[i]), s = quantile(res.map(Math.abs), 0.5) || 1e-12;
    robust = res.map(e => { const u = e / (6 * s); return Math.abs(u) < 1 ? (1 - u * u) ** 2 : 0; });
  }
  return x.map((v, i) => ({ x: v, y: fit[i] }));
}

/** Gaussian kernel density on a grid (Scott's rule unless a bandwidth is given). */
export function kde(values, { bandwidth, points = 160, from, to, cut = 3 } = {}) {
  const v = values.filter(isNum), n = v.length;
  if (n < 2) throw new Error('La densidad necesita al menos 2 valores.');
  const m = sum(v) / n, sd = Math.sqrt(sum(v.map(x => (x - m) ** 2)) / (n - 1)) || 1e-6;
  const bw = bandwidth ?? sd * n ** (-1 / 5);
  const lo = from ?? Math.min(...v) - cut * bw, hi = to ?? Math.max(...v) + cut * bw;
  const c = 1 / (n * bw * Math.sqrt(2 * Math.PI));
  return { bandwidth: bw, curve: Array.from({ length: points }, (_, i) => { const x = lo + (hi - lo) * i / (points - 1); return { x, y: c * sum(v.map(t => Math.exp(-0.5 * ((x - t) / bw) ** 2))) }; }) };
}

/** Compare a numeric value across groups: per-group summary, one-way ANOVA, Kruskal–Wallis and, for two groups, Welch's t-test. */
export function compareGroups(values, groups) {
  const by = new Map();
  values.forEach((v, i) => { if (isNum(v) && groups[i] != null && groups[i] !== '') { const g = String(groups[i]); if (!by.has(g)) by.set(g, []); by.get(g).push(v); } });
  const list = [...by].filter(([, v]) => v.length > 0);
  if (list.length < 2) throw new Error('Hacen falta al menos dos grupos con datos.');
  const all = list.flatMap(([, v]) => v), N = all.length, grand = sum(all) / N;
  const summary = list.map(([g, v]) => {
    const n = v.length, m = sum(v) / n, sd = n > 1 ? Math.sqrt(sum(v.map(x => (x - m) ** 2)) / (n - 1)) : null, se = sd == null ? null : sd / Math.sqrt(n), t = n > 1 ? tQuantile(0.975, n - 1) : null;
    return { group: g, n, mean: r(m), sd: r(sd), median: r(quantile(v, 0.5)), se: r(se), ci_low: se == null ? null : r(m - t * se), ci_high: se == null ? null : r(m + t * se) };
  }).sort((a, b) => b.mean - a.mean);
  const k = list.length, ssb = sum(list.map(([, v]) => v.length * (sum(v) / v.length - grand) ** 2)), ssw = sum(list.map(([, v]) => { const m = sum(v) / v.length; return sum(v.map(x => (x - m) ** 2)); }));
  const f = (ssb / (k - 1)) / (ssw / (N - k));
  const rk = ranks(all); let off = 0; let h = 0;
  for (const [, v] of list) { const rs = rk.slice(off, off + v.length); off += v.length; h += sum(rs) ** 2 / v.length; }
  h = 12 / (N * (N + 1)) * h - 3 * (N + 1);
  const ties = new Map(); for (const v of all) ties.set(v, (ties.get(v) ?? 0) + 1);
  const correction = 1 - sum([...ties.values()].map(t => t ** 3 - t)) / (N ** 3 - N); if (correction > 0) h /= correction;
  const out = { groups: summary, anova: { f: r(f, 4), df: [k - 1, N - k], p: rp(fSurvival(f, k - 1, N - k)), eta2: r(ssb / (ssb + ssw)) }, kruskal_wallis: { h: r(h, 4), df: k - 1, p: rp(chi2Survival(h, k - 1)) } };
  const welch = ([ga, a], [gb, b]) => {
    const ma = sum(a) / a.length, mb = sum(b) / b.length;
    const va = sum(a.map(x => (x - ma) ** 2)) / (a.length - 1), vb = sum(b.map(x => (x - mb) ** 2)) / (b.length - 1);
    const se = Math.sqrt(va / a.length + vb / b.length), t = (ma - mb) / se;
    const df = (va / a.length + vb / b.length) ** 2 / ((va / a.length) ** 2 / (a.length - 1) + (vb / b.length) ** 2 / (b.length - 1));
    return { a: ga, b: gb, difference: `${ga} − ${gb}`, estimate: r(ma - mb), t: r(t, 4), df: r(df, 2), p: tTwoSided(t, df) };
  };
  if (k === 2) { const w = welch(list[0], list[1]); out.welch_t = { ...w, p: rp(w.p) }; }
  // Post hoc: every pair by Welch's t, Holm-adjusted for the number of comparisons.
  if (k > 2 && k <= 12) {
    const pairs = []; for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) if (list[i][1].length > 1 && list[j][1].length > 1) pairs.push(welch(list[i], list[j]));
    const order = pairs.map((p, i) => [p.p, i]).sort((x, y) => x[0] - y[0]); let running = 0;
    order.forEach(([pv, i], rank) => { running = Math.max(running, Math.min(1, pv * (pairs.length - rank))); pairs[i].p_holm = running; });
    out.pairwise = { method: 'Welch t por pares, p ajustado por Holm', pairs: pairs.map(p => ({ ...p, p: rp(p.p), p_holm: rp(p.p_holm), significant: p.p_holm < 0.05 })) };
  }
  return out;
}

/** Eigenvalues and eigenvectors of a symmetric matrix (cyclic Jacobi), largest first. */
export function eigenSymmetric(m) {
  const n = m.length, a = m.map(r => [...r]), v = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => +(i === j)));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += a[i][j] ** 2;
    if (off < 1e-22) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(a[p][q]) < 1e-300) continue;
      const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]), t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1)), c = 1 / Math.sqrt(t * t + 1), sn = t * c;
      for (let k = 0; k < n; k++) { const akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - sn * akq; a[k][q] = sn * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - sn * aqk; a[q][k] = sn * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = v[k][p], vkq = v[k][q]; v[k][p] = c * vkp - sn * vkq; v[k][q] = sn * vkp + c * vkq; }
    }
  }
  return a.map((r, i) => ({ value: r[i], vector: v.map(row => row[i]) })).sort((x, y) => y.value - x.value);
}

/** Principal component analysis over complete rows: explained variance, loadings and scores.
 *  Standardized (correlation matrix) unless scale is false. Signs are fixed so each component's
 *  largest loading is positive. */
export function pca(columns, n, names, { components = 3, scale = true } = {}) {
  const rows = [];
  for (let i = 0; i < n; i++) { const x = names.map(c => columns[c][i]); if (x.every(isNum)) rows.push({ i, x }); }
  const m = rows.length, k = names.length;
  if (m < k + 2 && m < 10) throw new Error(`Hay ${m} filas completas para ${k} variables; hacen falta más.`);
  const mean = names.map((_, j) => sum(rows.map(r => r.x[j])) / m), sd = names.map((_, j) => Math.sqrt(sum(rows.map(r => (r.x[j] - mean[j]) ** 2)) / (m - 1)) || 1);
  const z = rows.map(r => r.x.map((v, j) => (v - mean[j]) / (scale ? sd[j] : 1)));
  const cov = names.map((_, a) => names.map((__, b) => sum(z.map(r => r[a] * r[b])) / (m - 1)));
  const eig = eigenSymmetric(cov), total = sum(eig.map(e => Math.max(0, e.value))), nc = Math.min(components, k);
  const comps = eig.slice(0, nc).map(e => { const big = e.vector.reduce((b, v, j) => Math.abs(v) > Math.abs(e.vector[b]) ? j : b, 0), sign = e.vector[big] < 0 ? -1 : 1; return { value: e.value, vector: e.vector.map(v => v * sign) }; });
  let cum = 0;
  return {
    n: m, dropped: n - m, scaled: scale,
    explained: comps.map((c, j) => { const share = c.value / total; cum += share; return { component: `PC${j + 1}`, eigenvalue: r(c.value, 5), variance_share: r(share, 4), cumulative: r(cum, 4) }; }),
    all_shares: eig.map(e => r(Math.max(0, e.value) / total, 4)),
    loadings: names.map((name, j) => ({ variable: name, ...Object.fromEntries(comps.map((c, q) => [`PC${q + 1}`, r(c.vector[j] * (scale ? 1 : 1), 4)])) })),
    scores: comps.map(c => { const out = Array(n).fill(null); rows.forEach((row, t) => { out[row.i] = r(sum(z[t].map((v, j) => v * c.vector[j])), 5); }); return out; }),
  };
}
