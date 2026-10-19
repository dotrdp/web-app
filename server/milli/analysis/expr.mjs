// A small, safe expression language for Milli's datasets (no eval): the formulas the model writes in
// data_transform (filter, derive, aggregate). Evaluation is vectorised: an expression over a table of
// n rows gives a column of n values, so row-wise arithmetic, column-wide statistics (mean(x),
// zscore(x)) and window functions (lag, cumsum) mix freely, like pandas.
//
//   numbers 1.5 2e3 · strings 'a' "b" · true false null · columns by name or `quoted name`
//   + - * / % ^ · == != < <= > >= · and or not (also && || !) · x in ['a', 'b'] · lists [1, 2]
//   functions: see FUNCTIONS below (the tool descriptions list them for the model).

const OPS = { or: 1, '||': 1, and: 2, '&&': 2, '==': 4, '!=': 4, '<': 4, '<=': 4, '>': 4, '>=': 4, in: 4, '+': 5, '-': 5, '*': 6, '/': 6, '%': 6, '^': 8 };

function tokenize(src) {
  const out = []; let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    const rest = src.slice(i);
    let m;
    if ((m = rest.match(/^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/))) { out.push({ t: 'num', v: Number(m[0]) }); i += m[0].length; continue; }
    if (c === '"' || c === "'") {
      let j = i + 1, s = '';
      while (j < src.length && src[j] !== c) { if (src[j] === '\\' && j + 1 < src.length) j++; s += src[j++]; }
      if (j >= src.length) throw new Error(`Falta cerrar la cadena que empieza en la posición ${i + 1}.`);
      out.push({ t: 'str', v: s }); i = j + 1; continue;
    }
    if (c === '`') { const j = src.indexOf('`', i + 1); if (j < 0) throw new Error('Falta cerrar el nombre entre comillas invertidas.'); out.push({ t: 'id', v: src.slice(i + 1, j), quoted: true }); i = j + 1; continue; }
    if ((m = rest.match(/^[\p{L}_][\p{L}\p{N}_.]*/u))) {
      const w = m[0], lw = w.toLowerCase();
      if (['and', 'or', 'not', 'in'].includes(lw)) out.push({ t: 'op', v: lw });
      else if (lw === 'true' || lw === 'false') out.push({ t: 'bool', v: lw === 'true' });
      else if (lw === 'null' || lw === 'none' || lw === 'nan') out.push({ t: 'null' });
      else out.push({ t: 'id', v: w });
      i += w.length; continue;
    }
    if ((m = rest.match(/^(==|!=|<=|>=|&&|\|\||\*\*)/))) { out.push({ t: 'op', v: m[0] === '**' ? '^' : m[0] }); i += 2; continue; }
    if ('+-*/%^<>!'.includes(c)) { out.push({ t: 'op', v: c === '!' ? 'not' : c }); i++; continue; }
    if (c === '=') { out.push({ t: 'op', v: '==' }); i++; continue; }
    if ('(),[]'.includes(c)) { out.push({ t: c }); i++; continue; }
    throw new Error(`Carácter inesperado «${c}» en la posición ${i + 1}.`);
  }
  return out;
}

export function parse(src) {
  if (typeof src !== 'string' || !src.trim()) throw new Error('La expresión está vacía.');
  const tokens = tokenize(src); let p = 0;
  const peek = () => tokens[p], next = () => tokens[p++];
  const expect = t => { const k = next(); if (k?.t !== t) throw new Error(`Se esperaba «${t}» en «${src}».`); return k; };
  function primary() {
    const k = next();
    if (!k) throw new Error(`La expresión «${src}» termina antes de tiempo.`);
    if (k.t === 'num' || k.t === 'str' || k.t === 'bool') return { t: 'lit', v: k.v };
    if (k.t === 'null') return { t: 'lit', v: null };
    if (k.t === '(') { const e = expr(0); expect(')'); return e; }
    if (k.t === '[') { const items = []; if (peek()?.t !== ']') do items.push(expr(0)); while (peek()?.t === ',' && next()); expect(']'); return { t: 'list', items }; }
    if (k.t === 'op' && (k.v === '-' || k.v === '+')) return { t: 'un', op: k.v, a: expr(7) };
    if (k.t === 'op' && k.v === 'not') return { t: 'un', op: 'not', a: expr(3) };
    if (k.t === 'id') {
      if (!k.quoted && peek()?.t === '(') {
        next(); const args = [];
        if (peek()?.t !== ')') do args.push(expr(0)); while (peek()?.t === ',' && next());
        expect(')'); return { t: 'call', name: k.v.toLowerCase(), args };
      }
      return { t: 'col', name: k.v };
    }
    throw new Error(`No entiendo «${k.v ?? k.t}» en «${src}».`);
  }
  function expr(min) {
    let left = primary();
    for (;;) {
      const k = peek();
      if (!k || k.t !== 'op' || !(k.v in OPS)) break;
      const prec = OPS[k.v];
      if (prec < min) break;
      next();
      left = { t: 'bin', op: k.v, a: left, b: expr(k.v === '^' ? prec : prec + 1) };
    }
    return left;
  }
  const tree = expr(0);
  if (p < tokens.length) throw new Error(`Sobra «${tokens[p].v ?? tokens[p].t}» en «${src}».`);
  return tree;
}

// ── Evaluation ─────────────────────────────────────────────────────────────────────────────────
const isNum = v => typeof v === 'number' && Number.isFinite(v);
const clean = v => typeof v === 'number' && !Number.isFinite(v) ? null : v === undefined ? null : v;
const fill = (n, v) => new Array(n).fill(v);
const nums = a => a.filter(isNum);
const sum = a => a.reduce((s, v) => s + v, 0);
const meanOf = a => { const v = nums(a); return v.length ? sum(v) / v.length : null; };
const varOf = a => { const v = nums(a); if (v.length < 2) return null; const m = sum(v) / v.length; return sum(v.map(x => (x - m) ** 2)) / (v.length - 1); };
/** Quantile with linear interpolation (numpy's default). */
export function quantile(values, q) {
  const v = nums(values).sort((a, b) => a - b);
  if (!v.length) return null;
  const pos = (v.length - 1) * q, lo = Math.floor(pos), hi = Math.ceil(pos);
  return v[lo] + (v[hi] - v[lo]) * (pos - lo);
}
/** Average ranks (1-based), ties share their mean rank; nulls stay null. */
export function ranks(values) {
  const idx = values.map((v, i) => [v, i]).filter(([v]) => isNum(v)).sort((a, b) => a[0] - b[0]);
  const out = fill(values.length, null);
  for (let i = 0; i < idx.length;) {
    let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
    for (let k = i; k <= j; k++) out[idx[k][1]] = (i + j) / 2 + 1;
    i = j + 1;
  }
  return out;
}
const corrOf = (a, b) => {
  const pairs = a.map((x, i) => [x, b[i]]).filter(([x, y]) => isNum(x) && isNum(y));
  if (pairs.length < 3) return null;
  const mx = sum(pairs.map(p => p[0])) / pairs.length, my = sum(pairs.map(p => p[1])) / pairs.length;
  let sxy = 0, sxx = 0, syy = 0; for (const [x, y] of pairs) { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; syy += (y - my) ** 2; }
  return sxx && syy ? sxy / Math.sqrt(sxx * syy) : null;
};
const map1 = (a, f) => a.map(v => isNum(v) ? clean(f(v)) : null);
const map2 = (a, b, f) => a.map((v, i) => isNum(v) && isNum(b[i]) ? clean(f(v, b[i])) : null);
const scalarArg = (arr, name) => { const v = arr[0]; if (!isNum(v)) throw new Error(`${name} necesita un número.`); return v; };
const label = v => isNum(v) ? (Number.isInteger(v) ? String(v) : String(Math.round(v * 1000) / 1000)) : String(v);

/** name → { min, max (argument count), kind: 'row' | 'agg' | 'window', fn(args: arrays, n) → array | scalar } */
const FUNCTIONS = {
  abs: { args: [1, 1], fn: ([a]) => map1(a, Math.abs) },
  sqrt: { args: [1, 1], fn: ([a]) => map1(a, v => v < 0 ? null : Math.sqrt(v)) },
  log: { args: [1, 2], fn: ([a, b]) => b ? map2(a, b, (v, base) => v > 0 ? Math.log(v) / Math.log(base) : null) : map1(a, v => v > 0 ? Math.log(v) : null) },
  ln: { args: [1, 1], fn: ([a]) => map1(a, v => v > 0 ? Math.log(v) : null) },
  log10: { args: [1, 1], fn: ([a]) => map1(a, v => v > 0 ? Math.log10(v) : null) },
  log2: { args: [1, 1], fn: ([a]) => map1(a, v => v > 0 ? Math.log2(v) : null) },
  log1p: { args: [1, 1], fn: ([a]) => map1(a, v => v > -1 ? Math.log1p(v) : null) },
  exp: { args: [1, 1], fn: ([a]) => map1(a, Math.exp) },
  floor: { args: [1, 1], fn: ([a]) => map1(a, Math.floor) },
  ceil: { args: [1, 1], fn: ([a]) => map1(a, Math.ceil) },
  sign: { args: [1, 1], fn: ([a]) => map1(a, Math.sign) },
  sin: { args: [1, 1], fn: ([a]) => map1(a, Math.sin) }, cos: { args: [1, 1], fn: ([a]) => map1(a, Math.cos) },
  round: { args: [1, 2], fn: ([a, d]) => a.map((v, i) => { const k = d ? d[i] ?? 0 : 0; return isNum(v) ? Math.round(v * 10 ** k) / 10 ** k : null; }) },
  pow: { args: [2, 2], fn: ([a, b]) => map2(a, b, (x, y) => x ** y) },
  clip: { args: [3, 3], fn: ([a, lo, hi]) => a.map((v, i) => isNum(v) ? Math.min(isNum(hi[i]) ? hi[i] : Infinity, Math.max(isNum(lo[i]) ? lo[i] : -Infinity, v)) : null) },
  if: { args: [3, 3], fn: ([c, a, b]) => c.map((v, i) => v === true || (isNum(v) && v !== 0) ? a[i] : b[i]) },
  isnull: { args: [1, 1], fn: ([a]) => a.map(v => v == null || v === '') },
  notnull: { args: [1, 1], fn: ([a]) => a.map(v => v != null && v !== '') },
  coalesce: { args: [1, 9], fn: args => args[0].map((_, i) => args.map(a => a[i]).find(v => v != null && v !== '') ?? null) },
  num: { args: [1, 1], fn: ([a]) => a.map(v => { if (isNum(v)) return v; const x = Number(String(v ?? '').trim().replace(/^(-?\d+),(\d+)$/, '$1.$2')); return v == null || v === '' || !Number.isFinite(x) ? null : x; }) },
  str: { args: [1, 1], fn: ([a]) => a.map(v => v == null ? null : label(v)) },
  lower: { args: [1, 1], fn: ([a]) => a.map(v => v == null ? null : String(v).toLowerCase()) },
  upper: { args: [1, 1], fn: ([a]) => a.map(v => v == null ? null : String(v).toUpperCase()) },
  len: { args: [1, 1], fn: ([a]) => a.map(v => v == null ? null : String(v).length) },
  contains: { args: [2, 2], fn: ([a, b]) => a.map((v, i) => v != null && String(v).toLowerCase().includes(String(b[i] ?? '').toLowerCase())) },
  startswith: { args: [2, 2], fn: ([a, b]) => a.map((v, i) => v != null && String(v).toLowerCase().startsWith(String(b[i] ?? '').toLowerCase())) },
  endswith: { args: [2, 2], fn: ([a, b]) => a.map((v, i) => v != null && String(v).toLowerCase().endsWith(String(b[i] ?? '').toLowerCase())) },
  substr: { args: [2, 3], fn: ([a, s, l]) => a.map((v, i) => v == null ? null : String(v).substr(s[i] ?? 0, l ? l[i] : undefined)) },
  concat: { args: [1, 9], fn: args => args[0].map((_, i) => args.map(a => a[i] == null ? '' : label(a[i])).join('')) },
  /** cut(x, [edges]) or cut(x, [edges], [labels]): class labels "a–b" for bins [a, b). */
  cut: { args: [2, 3], raw: true, fn: ([a, edges, labels]) => {
    const e = edges.list; if (!e || e.length < 2 || !e.every(isNum)) throw new Error('cut necesita una lista de al menos dos bordes numéricos, p. ej. cut(x, [0, 2, 4, 6]).');
    const names = labels?.list ?? e.slice(1).map((hi, k) => `${label(e[k])}–${label(hi)}`);
    return a.map(v => { if (!isNum(v)) return null; for (let k = 0; k < e.length - 1; k++) if (v >= e[k] && (v < e[k + 1] || (k === e.length - 2 && v === e[k + 1]))) return names[k] ?? null; return null; });
  } },
  // Column-wide statistics: one value broadcast to every row (or group, with `by`).
  mean: { args: [1, 1], agg: true, fn: ([a]) => meanOf(a) },
  avg: { args: [1, 1], agg: true, fn: ([a]) => meanOf(a) },
  median: { args: [1, 1], agg: true, fn: ([a]) => quantile(a, 0.5) },
  sum: { args: [1, 1], agg: true, fn: ([a]) => sum(nums(a)) },
  count: { args: [0, 1], agg: true, fn: ([a], n) => a ? a.filter(v => v != null && v !== '').length : n },
  n: { args: [0, 0], agg: true, fn: (_, n) => n },
  std: { args: [1, 1], agg: true, fn: ([a]) => { const v = varOf(a); return v == null ? null : Math.sqrt(v); } },
  var: { args: [1, 1], agg: true, fn: ([a]) => varOf(a) },
  q: { args: [2, 2], agg: true, fn: ([a, p]) => quantile(a, scalarArg(p, 'q(x, p)')) },
  quantile: { args: [2, 2], agg: true, fn: ([a, p]) => quantile(a, scalarArg(p, 'quantile(x, p)')) },
  first: { args: [1, 1], agg: true, fn: ([a]) => a.find(v => v != null) ?? null },
  last: { args: [1, 1], agg: true, fn: ([a]) => [...a].reverse().find(v => v != null) ?? null },
  n_unique: { args: [1, 1], agg: true, fn: ([a]) => new Set(a.filter(v => v != null)).size },
  corr: { args: [2, 2], agg: true, fn: ([a, b]) => corrOf(a, b) },
  cov: { args: [2, 2], agg: true, fn: ([a, b]) => { const p = a.map((x, i) => [x, b[i]]).filter(([x, y]) => isNum(x) && isNum(y)); if (p.length < 2) return null; const mx = sum(p.map(v => v[0])) / p.length, my = sum(p.map(v => v[1])) / p.length; return sum(p.map(([x, y]) => (x - mx) * (y - my))) / (p.length - 1); } },
  wmean: { args: [2, 2], agg: true, fn: ([a, w]) => { let s = 0, t = 0; a.forEach((v, i) => { if (isNum(v) && isNum(w[i])) { s += v * w[i]; t += w[i]; } }); return t ? s / t : null; } },
  // Window functions over the rows in their current order (sort first).
  zscore: { args: [1, 1], fn: ([a]) => { const m = meanOf(a), s = Math.sqrt(varOf(a) ?? 0); return a.map(v => isNum(v) && s ? (v - m) / s : null); } },
  normalize: { args: [1, 1], fn: ([a]) => { const v = nums(a), lo = Math.min(...v), hi = Math.max(...v); return a.map(x => isNum(x) && hi > lo ? (x - lo) / (hi - lo) : null); } },
  rank: { args: [1, 1], fn: ([a]) => ranks(a) },
  pct_rank: { args: [1, 1], fn: ([a]) => { const r = ranks(a), k = nums(a).length; return r.map(v => v == null ? null : k > 1 ? (v - 1) / (k - 1) : 0); } },
  cumsum: { args: [1, 1], fn: ([a]) => { let s = 0; return a.map(v => isNum(v) ? (s += v) : null); } },
  cummax: { args: [1, 1], fn: ([a]) => { let s = -Infinity; return a.map(v => isNum(v) ? (s = Math.max(s, v)) : null); } },
  diff: { args: [1, 2], fn: ([a, k]) => { const d = k ? scalarArg(k, 'diff') : 1; return a.map((v, i) => i >= d && isNum(v) && isNum(a[i - d]) ? v - a[i - d] : null); } },
  lag: { args: [1, 2], fn: ([a, k]) => { const d = k ? scalarArg(k, 'lag') : 1; return a.map((_, i) => i >= d ? a[i - d] : null); } },
  lead: { args: [1, 2], fn: ([a, k]) => { const d = k ? scalarArg(k, 'lead') : 1; return a.map((_, i) => i + d < a.length ? a[i + d] : null); } },
  row_number: { args: [0, 0], fn: (_, n) => Array.from({ length: n }, (_, i) => i + 1) },
};
// min/max: one argument is the column's minimum; two or more compare row by row.
FUNCTIONS.min = { args: [1, 9], fn: (args, n) => args.length === 1 ? { scalar: nums(args[0]).length ? Math.min(...nums(args[0])) : null } : fill(n, 0).map((_, i) => { const v = nums(args.map(a => a[i])); return v.length ? Math.min(...v) : null; }) };
FUNCTIONS.max = { args: [1, 9], fn: (args, n) => args.length === 1 ? { scalar: nums(args[0]).length ? Math.max(...nums(args[0])) : null } : fill(n, 0).map((_, i) => { const v = nums(args.map(a => a[i])); return v.length ? Math.max(...v) : null; }) };

export const FUNCTION_NAMES = Object.keys(FUNCTIONS).sort();

function compare(op, x, y) {
  if (x == null || y == null) return op === '!=' ? x !== y : op === '==' ? x === y : false;
  if (typeof x !== typeof y && (typeof x === 'string' || typeof y === 'string')) { if (op === '==') return String(x) === String(y); if (op === '!=') return String(x) !== String(y); }
  switch (op) { case '==': return x === y; case '!=': return x !== y; case '<': return x < y; case '<=': return x <= y; case '>': return x > y; default: return x >= y; }
}
const truthy = v => v === true || (isNum(v) && v !== 0);

/** Evaluate a parsed expression over columns { name: array } of n rows. Returns an array of n values. */
export function evaluate(tree, columns, n) {
  const resolve = name => {
    if (name in columns) return columns[name];
    const lower = Object.keys(columns).find(c => c.toLowerCase() === name.toLowerCase());
    if (lower) return columns[lower];
    throw new Error(`No existe la columna «${name}». Columnas: ${Object.keys(columns).join(', ')}.`);
  };
  function ev(node) {
    switch (node.t) {
      case 'lit': return fill(n, node.v);
      case 'col': return resolve(node.name);
      case 'list': { const items = node.items.map(i => ev(i)[0]); return Object.assign(fill(n, null), { list: items }); }
      case 'un': { const a = ev(node.a); return node.op === 'not' ? a.map(v => !truthy(v)) : node.op === '-' ? a.map(v => isNum(v) ? -v : null) : a; }
      case 'bin': {
        const a = ev(node.a), op = node.op;
        if (op === 'in') { const b = ev(node.b); if (!b.list) throw new Error('in necesita una lista, p. ej. state in [\'Puebla\', \'Hidalgo\'].'); return a.map(v => b.list.some(x => compare('==', v, x))); }
        const b = ev(node.b);
        if (op === 'and' || op === '&&') return a.map((v, i) => truthy(v) && truthy(b[i]));
        if (op === 'or' || op === '||') return a.map((v, i) => truthy(v) || truthy(b[i]));
        if (['==', '!=', '<', '<=', '>', '>='].includes(op)) return a.map((v, i) => compare(op, v, b[i]));
        if (op === '+' ) return a.map((v, i) => isNum(v) && isNum(b[i]) ? v + b[i] : (typeof v === 'string' || typeof b[i] === 'string') && v != null && b[i] != null ? label(v) + label(b[i]) : null);
        const f = { '-': (x, y) => x - y, '*': (x, y) => x * y, '/': (x, y) => y === 0 ? null : x / y, '%': (x, y) => y === 0 ? null : ((x % y) + y) % y, '^': (x, y) => x ** y }[op];
        return a.map((v, i) => isNum(v) && isNum(b[i]) ? clean(f(v, b[i])) : null);
      }
      case 'call': {
        const spec = FUNCTIONS[node.name];
        if (!spec) throw new Error(`No conozco la función ${node.name}(). Funciones: ${FUNCTION_NAMES.join(', ')}.`);
        const [lo, hi] = spec.args;
        if (node.args.length < lo || node.args.length > hi) throw new Error(`${node.name}() lleva ${lo === hi ? lo : `${lo} a ${hi}`} argumentos.`);
        const args = node.args.map(a => ev(a));
        const out = spec.fn(args, n);
        if (spec.agg) return fill(n, clean(out));
        if (out && !Array.isArray(out) && 'scalar' in out) return fill(n, clean(out.scalar));
        return out.map(clean);
      }
    }
    throw new Error('Expresión no válida.');
  }
  const out = ev(tree);
  if (out.list) throw new Error('Una lista sola no es un valor; úsala con in o cut().');
  return out;
}

/** Evaluate src over a table, optionally within groups (`by` columns): column-wide functions then
 *  apply to each group, e.g. ndvi - mean(ndvi) by municipality. */
export function evalColumn(src, columns, n, by = []) {
  const tree = typeof src === 'string' ? parse(src) : src;
  if (!by.length) return evaluate(tree, columns, n);
  const groups = groupIndex(columns, n, by), out = fill(n, null);
  for (const idx of groups.values()) {
    const sub = Object.fromEntries(Object.entries(columns).map(([k, v]) => [k, idx.map(i => v[i])]));
    const vals = evaluate(tree, sub, idx.length);
    idx.forEach((i, k) => { out[i] = vals[k]; });
  }
  return out;
}

export function groupIndex(columns, n, by) {
  for (const b of by) if (!(b in columns)) throw new Error(`No existe la columna «${b}» para agrupar. Columnas: ${Object.keys(columns).join(', ')}.`);
  const groups = new Map();
  for (let i = 0; i < n; i++) {
    const k = JSON.stringify(by.map(b => columns[b][i]));
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(i);
  }
  return groups;
}

export { isNum, meanOf as mean, varOf as variance };
