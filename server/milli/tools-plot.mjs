// Milli's plotting tools on the MCP server, matplotlib style: plot_figure starts a figure (grid,
// mosaic or facets), artists are added one call at a time (line, scatter, bar, hist, box/violin,
// errorbar, fill_between, heatmap, contour, surface, regression, kde, pie, map layers, reference
// lines, annotations), plot_axes / plot_legend style it, and plot_show draws it in the chat. The
// screen renders a PNG of it, returned to the model as an image so it can check its own work.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { evalColumn, isNum, quantile } from './analysis/expr.mjs';
import { column, getDataset } from './analysis/frame.mjs';
import { addTrace, axesOf, colorOf, colorscale, compile, COLORMAPS, describeFigure, DIVERGING, LEGEND_POSITIONS, LISA_COLORS, newFigure, PALETTE, tempLayerOf } from './analysis/figure.mjs';
import { kde, lowess, polyFit, rng as mulberry, round, tQuantile } from './analysis/stats.mjs';
import { PLOT_GUIDE } from './analysis/guide.mjs';

const text = data => ({ content: [{ type: 'text', text: typeof data === 'string' ? data : JSON.stringify(data) }] });
const fail = message => ({ content: [{ type: 'text', text: message }], isError: true });
const sig = v => typeof v === 'number' ? (Number.isFinite(v) ? Number(v.toPrecision(7)) : null) : v ?? null;
const sum = a => a.reduce((s, v) => s + v, 0);
const uniq = a => [...new Set(a)];

// ── Shared argument schemas ────────────────────────────────────────────────────────────────────
const values = z.array(z.union([z.number(), z.string(), z.boolean(), z.null()])).max(50_000);
const col = z.union([z.string(), values]).describe('Nombre de columna del dataset, o una lista de valores.');
const colNum = z.union([z.string(), values, z.number()]);
const common = {
  figure_id: z.string().optional().describe('Figura (por defecto, la última creada).'),
  ax: z.union([z.string(), z.array(z.string())]).optional().describe('Ejes donde dibujar (nombre de plot_figure; por defecto, el primero compatible). "*" = todos los ejes de la figura (con facetas, cada uno con su subconjunto).'),
  dataset: z.string().optional().describe('Dataset del que salen las columnas. Sin dataset, pasa listas de valores.'),
  where: z.string().max(400).optional().describe('Filtro de filas (expresión de data_transform), p. ej. "state == \'Puebla\'".'),
  label: z.string().max(80).optional().describe('Nombre en la leyenda.'),
  color: z.string().max(40).optional().describe('verde, azul, ambar, rojo, morado, turquesa, cafe, rosa, gris, oliva, C0–C9 o hex.'),
  alpha: z.number().min(0.02).max(1).optional().describe('Opacidad 0–1.'),
  hover: z.array(z.string()).max(8).optional().describe('Columnas extra que se muestran al pasar el cursor (p. ej. ["id", "municipality"]).'),
};
const groupArgs = {
  group_by: z.string().optional().describe('Columna categórica: una serie por valor, con colores de la paleta (como hue en seaborn).'),
  order: z.array(z.union([z.string(), z.number()])).max(60).optional().describe('Orden de los grupos o categorías.'),
  color_map: z.record(z.string(), z.string()).optional().describe('Color por grupo: {"Puebla": "rojo", …}.'),
  labels: z.record(z.string(), z.string().max(60)).optional().describe('Nombre en la leyenda por valor: {"training": "Con rendimiento", …}.'),
};
const colormapArg = z.string().optional().describe(`Mapa de color: ${Object.keys(COLORMAPS).join(', ')} (agrega _r para invertir). Secuencial por defecto viridis; para valores con signo (errores, residuos) usa uno divergente (rdbu_r, coolwarm, rdylgn) con color_mid 0.`);
const colorScaleArgs = {
  colormap: colormapArg, color_range: z.array(z.number()).length(2).optional().describe('[mín, máx] de la escala de color (usa el mismo en varias gráficas para compararlas).'),
  color_mid: z.number().optional().describe('Valor del centro en mapas divergentes (p. ej. 0).'), colorbar_title: z.string().max(40).optional(), show_colorbar: z.boolean().optional(),
};

/** Load the boundary files once, simplified for drawing (one point per ~150–400 m). */
const boundaryCache = new Map();
function boundaries(dataDir, which) {
  if (boundaryCache.has(which)) return boundaryCache.get(which);
  const geo = JSON.parse(readFileSync(path.join(dataDir, which === 'estados' ? 'estados.geojson' : 'municipios.geojson'), 'utf8'));
  const tol = which === 'estados' ? 0.004 : 0.0015;
  const feats = geo.features.map(f => {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    const rings = polys.flatMap(p => p.slice(0, 1)).map(ring => { const out = []; let last = null; for (const [x, y] of ring) if (!last || Math.abs(x - last[0]) + Math.abs(y - last[1]) > tol) { out.push([Math.round(x * 1e5) / 1e5, Math.round(y * 1e5) / 1e5]); last = [x, y]; } if (out.length) out.push(out[0]); return out; }).filter(r => r.length > 3);
    const all = rings.flat(); const bbox = [Math.min(...all.map(p => p[0])), Math.min(...all.map(p => p[1])), Math.max(...all.map(p => p[0])), Math.max(...all.map(p => p[1]))];
    const p = f.properties ?? {}; return { name: p.NOMGEO ?? p.nomgeo ?? p.name ?? p.NOM_MUN ?? p.NOM_ENT ?? p.nombre ?? '', rings, bbox };
  });
  boundaryCache.set(which, feats);
  return feats;
}

export function registerPlotTools(server, ctx) {
  const { session } = ctx;
  const parcelGeo = () => (ctx._geo ??= new Map(ctx.atlas.geo.features.map(f => [f.properties.id, f])));

  // ── Helpers ──────────────────────────────────────────────────────────────────────────────────
  const figureOf = id => {
    const fid = id ?? session.lastFigure;
    if (!fid) throw new Error('No hay figura: empieza con plot_figure.');
    const f = session.figures.get(fid);
    if (!f) throw new Error(`No hay una figura «${fid}». Figuras: ${[...session.figures.keys()].join(', ') || 'ninguna'}.`);
    return f;
  };
  /** The axes this call draws on, of an allowed type. */
  const targets = (fig, ax, allowed, tool) => {
    const ok = a => allowed.includes(a.type);
    let list;
    if (ax === '*') list = fig.order.map(n => fig.axes[n]).filter(ok);
    else if (Array.isArray(ax)) list = ax.map(n => axesOf(fig, n));
    else if (ax) list = [axesOf(fig, ax)];
    else { const first = fig.order.map(n => fig.axes[n]).find(ok); if (!first) throw new Error(`${tool} dibuja en ejes de tipo ${allowed.join(' o ')}; la figura no tiene ninguno (tipos: ${fig.order.map(n => `${n}: ${fig.axes[n].type}`).join(', ')}). Crea la figura con axes_types.`); list = [first]; }
    for (const a of list) if (!ok(a)) throw new Error(`${tool} no se puede dibujar en «${a.name}» (ejes ${a.type}); necesita ejes ${allowed.join(' o ')}.`);
    if (!list.length) throw new Error(`No hay ejes de tipo ${allowed.join(' o ')} en la figura.`);
    return list;
  };
  /** Column access for one target axes: dataset rows after `where` and the axes' facet. */
  const frame = (args, a) => {
    if (!args.dataset) {
      return { n: null, get: (spec, name) => { if (spec == null) return null; if (typeof spec === 'string') throw new Error(`«${name}» es "${spec}", pero no diste dataset; pasa dataset o una lista de valores.`); return Array.isArray(spec) ? spec : null; }, name: spec => typeof spec === 'string' ? spec : null };
    }
    const d = getDataset(session, args.dataset);
    let idx = [...Array(d.n).keys()];
    if (args.where) { const keep = evalColumn(args.where, d.data, d.n); idx = idx.filter(i => keep[i] === true || (isNum(keep[i]) && keep[i] !== 0)); }
    // Facets: each panel gets its rows; a dataset without the facet column (a reference curve) goes whole on every panel.
    if (a?.facet && d.columns.some(c => c.toLowerCase() === a.facet.column.toLowerCase())) { const fc = column(d, a.facet.column); idx = idx.filter(i => String(fc[i]) === String(a.facet.value)); }
    return {
      n: idx.length, d,
      get: (spec, name) => {
        if (spec == null) return null;
        if (typeof spec === 'string') { const c = column(d, spec); return idx.map(i => c[i]); }
        if (typeof spec === 'number') return idx.map(() => spec);
        if (Array.isArray(spec)) { if (spec.length !== idx.length) throw new Error(`«${name}» tiene ${spec.length} valores y el dataset (filtrado) tiene ${idx.length} filas.`); return spec; }
        return null;
      },
      name: spec => typeof spec === 'string' ? (d.columns.find(c => c.toLowerCase() === spec.toLowerCase()) ?? spec) : null,
    };
  };
  const unitOf = (args, name) => { if (!args.dataset || !name) return ''; const d = session.datasets.get(args.dataset); return d?.meta.units?.[name] ?? ''; };
  /** Categories of a grouping column in a stable order (given, numeric, or alphabetical). */
  const levelsOf = (vals, order) => { const u = uniq(vals.filter(v => v != null && v !== '')); if (order?.length) return [...order.filter(o => u.some(v => String(v) === String(o))), ...u.filter(v => !order.some(o => String(o) === String(v)))]; return u.sort((a, b) => isNum(a) && isNum(b) ? a - b : String(a).localeCompare(String(b), 'es')); };
  const groupColor = (args, level, k, levels) => {
    if (args.color_map?.[String(level)]) return colorOf(args.color_map[String(level)]);
    if (levels.every(l => String(l) in LISA_COLORS)) return LISA_COLORS[String(level)];
    return PALETTE[k % PALETTE.length];
  };
  const withAlpha = (c, a) => { if (a == null || a >= 1) return c; const m = /^#([0-9a-f]{6})$/i.exec(c); if (!m) return c; const n = parseInt(m[1], 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  /** Split rows by group_by (or one group) and call make for each. */
  const byGroup = (args, f, make) => {
    if (!args.group_by) return [make({ idx: null, level: null, color: args.color ? colorOf(args.color) : null, k: 0 })];
    const g = f.get(args.group_by, 'group_by');
    let levels = levelsOf(g, args.order);
    // LISA classes: background first, significant clusters drawn on top (and first in the legend).
    if (!args.order && levels.every(l => String(l) in LISA_COLORS)) levels = ['no significativo', 'LH', 'HL', 'LL', 'HH'].filter(l => levels.includes(l));
    if (levels.length > 40) throw new Error(`group_by «${args.group_by}» tiene ${levels.length} grupos; usa una columna con menos categorías o color_by continuo.`);
    return levels.map((level, k) => make({ idx: g.map((v, i) => String(v) === String(level) ? i : -1).filter(i => i >= 0), level: args.labels?.[String(level)] ?? level, raw: level, color: groupColor(args, level, k, levels), k }));
  };
  const pick = (arr, idx) => arr == null ? null : idx ? idx.map(i => arr[i]) : arr;
  /** Hover text: the extra columns as customdata lines under the trace's own values. */
  const hoverOf = (args, f, idx, base) => {
    const extra = (args.hover ?? []).map(h => [h, pick(f.get(h, 'hover'), idx)]);
    if (!extra.length) return { hovertemplate: `${base}<extra>%{fullData.name}</extra>` };
    const n = extra[0][1].length;
    return { customdata: Array.from({ length: n }, (_, i) => extra.map(([, v]) => sig(v[i]))), hovertemplate: `${extra.map(([h], k) => `${h}: <b>%{customdata[${k}]}</b>`).join('<br>')}<br>${base}<extra>%{fullData.name}</extra>` };
  };
  /** Colour scale for a trace: markers and surfaces take cmin/cmax/cmid, z-valued traces (heatmap, contour, choropleth) zmin/zmax/zmid. */
  const scaleOf = (args, vals, key = 'c', explicit = false) => {
    const nums = vals.filter(isNum), name = args.colormap ?? (nums.some(v => v < 0) && nums.some(v => v > 0) ? 'rdbu_r' : 'viridis');
    const base = String(name).toLowerCase().replace(/_r$/, ''), mid = args.color_mid ?? (DIVERGING.has(base) && !args.color_range ? 0 : undefined);
    const range = args.color_range ?? (explicit && nums.length ? [Math.min(...nums), Math.max(...nums)] : null);
    return { colorscale: colorscale(name), ...(range ? { [`${key}min`]: range[0], [`${key}max`]: range[1] } : {}), ...(mid != null ? { [`${key}mid`]: mid } : {}) };
  };
  const result = (fig, axes, ids, points, warnings = [], extra = {}) => ({ ok: true, figure_id: fig.id, ax: axes.map(a => a.name).join(', '), trace_ids: ids, points, ...(warnings.length ? { warnings } : {}), ...extra });
  const tool = (name, description, shape, fn) => server.registerTool(name, { description, inputSchema: shape }, async args => { try { const out = await fn(args); return out?.content ? out : text(out); } catch (e) { return fail(e.message); } });
  const numeric = v => v.length > 0 && v.every(x => x == null || isNum(x));
  const extentOf = (xs, ys) => xs.map((x, i) => [x, ys[i]]).filter(([x, y]) => isNum(x) && isNum(y));

  // ── Figure ───────────────────────────────────────────────────────────────────────────────────
  tool('plot_figure', `Empieza una figura nueva (como plt.subplots / plt.subplot_mosaic) y la deja como figura actual. Opciones de disposición:
- rows × cols: ejes ax1, ax2… fila por fila.
- mosaic: nombres por celda; repetir un nombre lo extiende, "." deja una celda vacía. Ej. [["mapa","mapa"],["hist","moran"]].
- facet: una gráfica pequeña por valor de una columna (small multiples), p. ej. una por municipio; luego dibuja con ax "*" y cada ejes recibe solo sus filas.
axes_types da el tipo de cada ejes: xy (cartesianos, por defecto), 3d (eje z), map (mapa con parcelas y mapa base), polar, pie. Con share_x / share_y los ejes comparten escala y se ocultan las etiquetas interiores (como matplotlib). Si rehaces una figura que ya mostraste, pasa replaces con su id para que el borrador se pliegue en el chat. Después agrega artistas (plot_line, plot_scatter, plot_bar, plot_hist, plot_map…), dale formato (plot_axes, plot_legend) y termina con plot_show. Consulta plot_guide para recetas.`, {
    title: z.string().max(120).optional(), subtitle: z.string().max(200).optional(), caption: z.string().max(400).optional().describe('Pie de figura: fuente, método o cómo leerla.'),
    rows: z.number().int().min(1).max(6).default(1), cols: z.number().int().min(1).max(4).default(1),
    mosaic: z.array(z.array(z.string().max(24))).max(6).optional(), axes_types: z.union([z.record(z.string(), z.enum(['xy', '3d', 'map', 'polar', 'pie'])), z.array(z.enum(['xy', '3d', 'map', 'polar', 'pie']))]).optional().describe('{nombre: tipo} o lista en el orden de los ejes.'),
    subplot_titles: z.array(z.string().max(80)).max(16).optional(), share_x: z.boolean().optional(), share_y: z.boolean().optional(),
    height: z.number().int().min(180).max(1600).optional().describe('Alto en píxeles (por defecto según filas).'),
    height_ratios: z.array(z.number().positive()).max(6).optional().describe('Alto relativo de cada fila, p. ej. [2, 1] (como gridspec height_ratios).'),
    width_ratios: z.array(z.number().positive()).max(4).optional().describe('Ancho relativo de cada columna, p. ej. [3, 1].'),
    replaces: z.string().optional().describe('figure_id de un borrador que esta figura sustituye: al mostrarla, el borrador se pliega en el chat.'),
    facet: z.object({ dataset: z.string(), column: z.string(), cols: z.number().int().min(1).max(4).optional().describe('Columnas de paneles (por defecto 2: el chat es angosto).'), order: z.array(z.union([z.string(), z.number()])).optional(), type: z.enum(['xy', 'map', 'polar', '3d']).default('xy') }).optional(),
  }, args => {
    let fig;
    const id = `fig${session.next.figure++}`;
    if (args.facet) {
      const d = getDataset(session, args.facet.dataset), levels = levelsOf(column(d, args.facet.column), args.facet.order);
      if (levels.length > 16) throw new Error(`«${args.facet.column}» tiene ${levels.length} valores; el máximo de facetas es 16 (filtra antes).`);
      const cols = args.facet.cols ?? Math.min(levels.length, 2), rows = Math.ceil(levels.length / cols);
      const mosaic = Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => r * cols + c < levels.length ? `ax${r * cols + c + 1}` : '.'));
      fig = newFigure(id, { ...args, mosaic, axes_types: levels.map(() => args.facet.type), subplot_titles: levels.map(String) });
      fig.order.forEach((n, i) => { fig.axes[n].facet = { column: args.facet.column, value: levels[i] }; });
    } else fig = newFigure(id, args);
    if (args.height_ratios) fig.heightRatios = args.height_ratios;
    if (args.width_ratios) fig.widthRatios = args.width_ratios;
    if (args.replaces) { if (!session.figures.has(args.replaces)) throw new Error(`replaces: no hay una figura «${args.replaces}».`); fig.replaces = args.replaces; }
    session.figures.set(id, fig); session.lastFigure = id;
    return { ok: true, figure_id: id, axes: fig.order.map(n => ({ name: n, type: fig.axes[n].type, ...(fig.axes[n].facet ? { facet: `${fig.axes[n].facet.column} = ${fig.axes[n].facet.value}` } : {}) })), next: 'Agrega artistas (plot_line, plot_scatter, plot_bar, plot_hist, plot_box, plot_map…) y termina con plot_show.' };
  });

  // ── Lines and scatter ────────────────────────────────────────────────────────────────────────
  tool('plot_line', 'Dibuja líneas y = f(x) (como ax.plot): series de tiempo, curvas, perfiles. Con group_by, una línea por grupo. En ejes 3d agrega z (línea 3D); en ejes polares x es el ángulo (grados o categorías) e y el radio. Opciones: marker, dash, step (escalones), fill (área bajo la curva), stack (áreas apiladas, como stackplot), smooth, y_axis "right" (segundo eje y, como twinx). Las x numéricas o de fecha se ordenan.', {
    ...common, ...groupArgs, x: col, y: col, z: col.optional(),
    width: z.number().min(0.5).max(8).default(2), dash: z.enum(['solid', 'dash', 'dot', 'dashdot', 'longdash']).default('solid'),
    marker: z.union([z.boolean(), z.enum(['circle', 'square', 'diamond', 'triangle-up', 'triangle-down', 'x', 'cross', 'star'])]).default(false), marker_size: z.number().min(2).max(20).default(6),
    step: z.enum(['none', 'post', 'pre', 'mid']).default('none'), fill: z.enum(['none', 'tozero', 'tonext']).default('none'), stack: z.boolean().default(false), smooth: z.boolean().default(false),
    y_axis: z.enum(['left', 'right']).default('left'), sort: z.boolean().default(true), text: z.string().optional().describe('Columna con etiquetas para cada punto.'),
    close: z.boolean().optional().describe('Ejes polares: cierra la línea uniendo el último punto con el primero (por defecto sí, para ciclos como los meses).'),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['xy', '3d', 'polar'], 'plot_line'), ids = []; let points = 0; const warnings = [];
    for (const a of axes) {
      const f = frame(args, a), X = f.get(args.x, 'x'), Y = f.get(args.y, 'y'), Z = f.get(args.z, 'z'), T = f.get(args.text, 'text');
      if (a.type === '3d' && !Z) throw new Error('En ejes 3d, plot_line necesita z.');
      if (X.length !== Y.length) throw new Error(`x tiene ${X.length} valores e y ${Y.length}.`);
      for (const g of byGroup(args, f, o => o)) {
        let idx = g.idx ?? [...X.keys()];
        if (args.sort && a.type !== 'polar' && (numeric(X) || X.every(v => v == null || /^\d{4}-\d{2}/.test(String(v))))) idx = [...idx].sort((p, q) => (X[p] > X[q]) - (X[p] < X[q]));
        const x = idx.map(i => sig(X[i])), y = idx.map(i => sig(Y[i])), color = g.color ?? colorOf(args.color, fig.traces.length);
        const name = g.level != null ? `${args.label ? `${args.label} · ` : ''}${g.level}` : args.label ?? f.name(args.y) ?? 'serie';
        const marker = args.marker ? { symbol: args.marker === true ? 'circle' : args.marker, size: args.marker_size, color } : undefined;
        const line = { color, width: args.width, dash: args.dash, ...(args.step !== 'none' ? { shape: { post: 'hv', pre: 'vh', mid: 'hvh' }[args.step] } : args.smooth ? { shape: 'spline', smoothing: 0.8 } : {}) };
        let trace;
        if (a.type === '3d') trace = { type: 'scatter3d', mode: args.marker ? 'lines+markers' : 'lines', x, y, z: idx.map(i => sig(Z[i])), line: { color, width: args.width * 2 }, marker };
        else if (a.type === 'polar') { const closed = args.close !== false && x.length > 2; trace = { type: 'scatterpolar', mode: args.marker ? 'lines+markers' : 'lines', theta: closed ? [...x, x[0]] : x, r: closed ? [...y, y[0]] : y, line, marker, ...(args.fill !== 'none' ? { fill: 'toself', fillcolor: withAlpha(color, 0.2) } : {}) }; }
        else trace = { type: 'scatter', mode: args.marker || T ? `lines${args.marker ? '+markers' : ''}${T ? '+text' : ''}` : 'lines', x, y, line, marker, connectgaps: false,
          ...(T ? { text: idx.map(i => T[i]), textposition: 'top center', textfont: { size: 10 } } : {}),
          ...(args.stack ? { stackgroup: `s-${a.name}-${args.y_axis}`, fillcolor: withAlpha(color, 0.55) } : args.fill === 'tozero' ? { fill: 'tozeroy', fillcolor: withAlpha(color, 0.18) } : args.fill === 'tonext' ? { fill: 'tonexty', fillcolor: withAlpha(color, 0.18) } : {}),
          ...hoverOf(args, f, idx, `${f.name(args.x) ?? 'x'}: %{x}<br>${f.name(args.y) ?? 'y'}: <b>%{y}</b>`) };
        trace.name = name; if (args.alpha != null) trace.opacity = args.alpha;
        if (!args.label && !args.group_by && f.name(args.y) == null) trace.showlegend = false;
        const nulls = y.filter(v => v == null).length; if (nulls) warnings.push(`${name}: ${nulls} valores nulos (huecos en la línea).`);
        ids.push(addTrace(fig, a, trace, { kind: 'line', secondary: args.y_axis === 'right', extent: [] })); points += x.length;
      }
    }
    return result(fig, axes, ids, points, warnings);
  });

  tool('plot_scatter', 'Dibuja puntos (como ax.scatter): relaciones entre dos variables. color_by colorea por una columna (numérica → mapa de color con barra; texto → una serie por categoría con leyenda); size_by escala el tamaño. En ejes 3d agrega z (dispersión 3D); en polares x es el ángulo. label_points escribe una etiqueta junto a cada punto (úsalo con pocos puntos). Para mapas usa plot_map.', {
    ...common, ...groupArgs, ...colorScaleArgs, x: col, y: col, z: col.optional(), color_by: z.string().optional(), size: z.number().min(1).max(40).default(7), size_by: z.string().optional(), size_range: z.array(z.number().min(1).max(60)).length(2).default([4, 22]),
    symbol: z.enum(['circle', 'square', 'diamond', 'triangle-up', 'triangle-down', 'x', 'cross', 'star', 'circle-open', 'square-open']).default('circle'),
    edge: z.boolean().default(true).describe('Borde fino alrededor de cada punto.'), label_points: z.string().optional(), y_axis: z.enum(['left', 'right']).default('left'),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['xy', '3d', 'polar'], 'plot_scatter'), ids = []; let points = 0; const warnings = [];
    for (const a of axes) {
      const f = frame(args, a), X = f.get(args.x, 'x'), Y = f.get(args.y, 'y'), Z = f.get(args.z, 'z');
      if (a.type === '3d' && !Z) throw new Error('En ejes 3d, plot_scatter necesita z.');
      const C = args.color_by ? f.get(args.color_by, 'color_by') : null, S = args.size_by ? f.get(args.size_by, 'size_by') : null, L = args.label_points ? f.get(args.label_points, 'label_points') : null;
      const continuous = C && numeric(C) && uniq(C.filter(isNum)).length > 12;
      const groupBy = args.group_by ?? (C && !continuous ? args.color_by : null);
      const sMin = S ? Math.min(...S.filter(isNum)) : 0, sMax = S ? Math.max(...S.filter(isNum)) : 1;
      let first = true;
      for (const g of byGroup({ ...args, group_by: groupBy }, f, o => o)) {
        const idx = (g.idx ?? [...X.keys()]).filter(i => isNum(X[i]) || (!numeric(X) && X[i] != null)).filter(i => isNum(Y[i]));
        const dropped = (g.idx ?? X).length - idx.length; if (dropped) warnings.push(`${dropped} filas sin x o y se omitieron.`);
        const color = g.color ?? colorOf(args.color, fig.traces.length);
        const size = S ? idx.map(i => isNum(S[i]) ? round(args.size_range[0] + (args.size_range[1] - args.size_range[0]) * (sMax > sMin ? (S[i] - sMin) / (sMax - sMin) : 0.5), 2) : args.size_range[0]) : args.size;
        const marker = { size, symbol: args.symbol, opacity: args.alpha ?? (idx.length > 300 ? 0.6 : 0.85), line: args.edge ? { width: 0.6, color: 'rgba(255,255,255,0.7)' } : { width: 0 },
          ...(continuous ? { color: idx.map(i => sig(C[i])), ...scaleOf(args, C), showscale: args.show_colorbar ?? first, colorbar: { title: { text: args.colorbar_title ?? f.name(args.color_by) ?? '' } } } : { color }) };
        if (S) marker.sizemode = 'diameter';
        const name = g.level != null ? String(g.level) : args.label ?? (args.dataset ? `${f.name(args.y)} vs ${f.name(args.x)}` : 'puntos');
        const base = `${f.name(args.x) ?? 'x'}: %{x}<br>${f.name(args.y) ?? 'y'}: <b>%{y}</b>${Z ? `<br>${f.name(args.z) ?? 'z'}: %{z}` : ''}${continuous ? `<br>${f.name(args.color_by)}: %{marker.color}` : ''}`;
        let trace;
        if (a.type === '3d') trace = { type: 'scatter3d', mode: 'markers', x: idx.map(i => sig(X[i])), y: idx.map(i => sig(Y[i])), z: idx.map(i => sig(Z[i])), marker: { ...marker, size: Array.isArray(size) ? size.map(s => s * 0.6) : size * 0.6, line: undefined } };
        else if (a.type === 'polar') trace = { type: 'scatterpolar', mode: 'markers', theta: idx.map(i => sig(X[i])), r: idx.map(i => sig(Y[i])), marker };
        else trace = { type: idx.length > 4000 ? 'scattergl' : 'scatter', mode: L ? 'markers+text' : 'markers', x: idx.map(i => sig(X[i])), y: idx.map(i => sig(Y[i])), marker, ...(L ? { text: idx.map(i => L[i]), textposition: 'top center', textfont: { size: 9 } } : {}) };
        Object.assign(trace, { name, ...hoverOf(args, f, idx, base) });
        if (!groupBy && !args.label) trace.showlegend = false;
        ids.push(addTrace(fig, a, trace, { kind: 'scatter', secondary: args.y_axis === 'right' })); points += idx.length; first = false;
      }
    }
    return result(fig, axes, ids, points, uniq(warnings));
  });

  // ── Bars, histograms, distributions ──────────────────────────────────────────────────────────
  tool('plot_bar', 'Barras (como ax.bar / barh y seaborn.barplot): x son categorías e y valores. Si hay varias filas por categoría, aggregate las resume (mean, sum, count, median; por defecto mean) y error agrega barras de error (sd, se, ci95 o una columna). group_by → barras agrupadas (o apiladas con stacked). orientation "h" para rankings con nombres largos. labels escribe el valor sobre cada barra. sort ordena por valor. En ejes polares dibuja barras polares (rosa de vientos). Nota: stacked aplica a toda la figura.', {
    ...common, ...groupArgs, ...colorScaleArgs, x: col, y: col.optional().describe('Valores (omitir con aggregate "count").'), aggregate: z.enum(['none', 'mean', 'sum', 'count', 'median', 'min', 'max']).optional(),
    error: z.union([z.enum(['sd', 'se', 'ci95']), z.string()]).optional().describe('sd, se o ci95 (calculados de las filas de cada categoría) o una columna con la semiamplitud (± valor).'),
    error_low: z.string().optional().describe('Columna con el límite inferior absoluto (p. ej. ci_low de stats_compare_groups).'), error_high: z.string().optional().describe('Columna con el límite superior absoluto (p. ej. ci_high).'),
    orientation: z.enum(['v', 'h']).default('v'), stacked: z.boolean().default(false),
    labels: z.boolean().default(false), label_format: z.string().max(12).optional().describe('Formato d3 de las etiquetas, p. ej. ".2f", ",.0f", ".0%".'), sort: z.enum(['none', 'asc', 'desc']).default('none'),
    color_by: z.string().optional().describe('Colorear cada barra por el valor (o por otra columna numérica) con un mapa de color.'), y_axis: z.enum(['left', 'right']).default('left'),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['xy', 'polar'], 'plot_bar'), ids = []; let points = 0; const warnings = [];
    if (args.stacked) fig.barmode = 'stack';
    for (const a of axes) {
      const f = frame(args, a), X = f.get(args.x, 'x'), Y = args.y != null ? f.get(args.y, 'y') : null, E = args.error && !['sd', 'se', 'ci95'].includes(args.error) ? f.get(args.error, 'error') : null;
      const C = args.color_by ? f.get(args.color_by, 'color_by') : null, LO = args.error_low ? f.get(args.error_low, 'error_low') : null, HI = args.error_high ? f.get(args.error_high, 'error_high') : null;
      if (!Y && args.aggregate !== 'count') throw new Error('plot_bar necesita y (o aggregate "count").');
      const G = args.group_by ? f.get(args.group_by, 'group_by') : null, keyOf = i => `${X[i]}\u0001${G ? G[i] : ''}`;
      const dup = uniq([...X.keys()].map(keyOf)).length < X.length;
      let agg = args.aggregate ?? (dup ? 'mean' : 'none');
      if (dup && agg === 'none') agg = 'mean';
      if (dup && (!args.aggregate || args.aggregate === 'none')) warnings.push('Había varias filas por categoría: se usó la media (aggregate mean). Indica aggregate para otra cosa.');
      const allLevels = levelsOf(X, args.order);
      const groups = byGroup(args, f, o => o);
      for (const g of groups) {
        const idx = g.idx ?? [...X.keys()];
        const cats = args.order?.length ? allLevels : levelsOf(idx.map(i => X[i]));
        let rows = cats.map(cat => {
          const sub = idx.filter(i => String(X[i]) === String(cat)), v = Y ? sub.map(i => Y[i]).filter(isNum) : sub;
          const val = agg === 'none' ? (Y ? Y[sub[0]] : null) : agg === 'count' ? sub.length : agg === 'sum' ? sum(v) : agg === 'median' ? quantile(v, 0.5) : agg === 'min' ? Math.min(...v) : agg === 'max' ? Math.max(...v) : v.length ? sum(v) / v.length : null;
          let err = null;
          if (E) err = E[sub[0]];
          else if (args.error && Y && v.length > 1) { const m = sum(v) / v.length, sd = Math.sqrt(sum(v.map(t => (t - m) ** 2)) / (v.length - 1)); err = args.error === 'sd' ? sd : args.error === 'se' ? sd / Math.sqrt(v.length) : tQuantile(0.975, v.length - 1) * sd / Math.sqrt(v.length); }
          const lo = LO && isNum(LO[sub[0]]) && isNum(val) ? val - LO[sub[0]] : null, hi = HI && isNum(HI[sub[0]]) && isNum(val) ? HI[sub[0]] - val : null;
          return { cat, val: sig(val), err: sig(hi ?? err), errMinus: lo != null ? sig(lo) : null, c: C ? sig(C[sub[0]]) : null, n: sub.length };
        });
        if (args.sort !== 'none') rows = rows.sort((p, q) => args.sort === 'asc' ? p.val - q.val : q.val - p.val);
        const color = g.color ?? colorOf(args.color, args.group_by ? g.k : 0);
        const cats2 = rows.map(rw => rw.cat), vals = rows.map(rw => rw.val);
        const marker = C ? { color: rows.map(rw => rw.c), ...scaleOf(args, rows.map(rw => rw.c)), showscale: args.show_colorbar ?? true, colorbar: { title: { text: args.colorbar_title ?? f.name(args.color_by) ?? '' } } } : { color: withAlpha(color, args.alpha), line: { width: 0 } };
        const name = g.level != null ? String(g.level) : args.label ?? f.name(args.y) ?? (agg === 'count' ? 'conteo' : 'valor');
        let trace;
        if (a.type === 'polar') trace = { type: 'barpolar', theta: cats2, r: vals, marker, name };
        else {
          const h = args.orientation === 'h';
          trace = { type: 'bar', orientation: args.orientation, [h ? 'y' : 'x']: cats2, [h ? 'x' : 'y']: vals, marker, name, ...(args.group_by ? { offsetgroup: `${a.name}-${g.k}` } : {}),
            ...(rows.some(rw => rw.err != null) ? { [h ? 'error_x' : 'error_y']: { type: 'data', array: rows.map(rw => rw.err), ...(rows.some(rw => rw.errMinus != null) ? { symmetric: false, arrayminus: rows.map(rw => rw.errMinus) } : {}), visible: true, thickness: 1.2, width: 4 } } : {}),
            // With error bars the value goes inside the bar, clear of the whiskers.
            ...(args.labels ? { texttemplate: `%{${h ? 'x' : 'y'}${args.label_format ? `:${args.label_format}` : ''}}`, textposition: args.stacked || rows.some(rw => rw.err != null) ? 'inside' : 'outside', insidetextanchor: rows.some(rw => rw.err != null) ? 'start' : 'end', cliponaxis: false, textfont: { size: 10 } } : {}),
            hovertemplate: `%{${h ? 'y' : 'x'}}<br>${f.name(args.y) ?? ''}${agg !== 'none' ? ` (${agg})` : ''}: <b>%{${h ? 'x' : 'y'}}</b><extra>%{fullData.name}</extra>` };
          if (h) { a.y.order ??= cats2.slice().reverse(); }
        }
        if (!args.group_by && !args.label) trace.showlegend = false;
        ids.push(addTrace(fig, a, trace, { kind: 'bar', secondary: args.y_axis === 'right' })); points += rows.length;
      }
    }
    return result(fig, axes, ids, points, uniq(warnings));
  });

  tool('plot_hist', 'Histograma (como ax.hist): bins (número o "auto" como numpy), bin_width o edges. density: count (conteo), percent, probability o density (integra 1). cumulative para la distribución acumulada. group_by superpone un histograma por grupo con los mismos bordes (con alpha). histtype "step" dibuja solo el contorno. Devuelve los bordes y conteos.', {
    ...common, ...groupArgs, x: col, bins: z.union([z.number().int().min(1).max(200), z.literal('auto')]).default('auto'), bin_width: z.number().positive().optional(), edges: z.array(z.number()).min(2).max(201).optional(),
    range: z.array(z.number()).length(2).optional(), density: z.enum(['count', 'percent', 'probability', 'density']).default('count'), cumulative: z.boolean().default(false),
    histtype: z.enum(['bar', 'step']).default('bar'), orientation: z.enum(['v', 'h']).default('v'),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['xy'], 'plot_hist'), ids = []; let points = 0; const out = [];
    for (const a of axes) {
      const f = frame(args, a), X = f.get(args.x, 'x'), all = X.filter(isNum);
      if (all.length < 2) throw new Error(`«${f.name(args.x) ?? 'x'}» tiene ${all.length} valores numéricos; el histograma necesita al menos 2.`);
      const lo = args.range?.[0] ?? Math.min(...all), hi = args.range?.[1] ?? Math.max(...all);
      let edges = args.edges;
      if (!edges) {
        let nb;
        if (args.bin_width) nb = Math.max(1, Math.ceil((hi - lo) / args.bin_width));
        else if (args.bins === 'auto') { const iqr = quantile(all, 0.75) - quantile(all, 0.25), fd = iqr > 0 ? Math.ceil((hi - lo) / (2 * iqr * all.length ** (-1 / 3))) : 0, st = Math.ceil(Math.log2(all.length) + 1); nb = Math.min(100, Math.max(st, fd || st)); }
        else nb = args.bins;
        const w = args.bin_width ?? ((hi - lo) || 1) / nb;
        edges = Array.from({ length: nb + 1 }, (_, i) => lo + w * i);
      }
      const groups = byGroup(args, f, o => o), overlay = groups.length > 1;
      for (const g of groups) {
        const v = (g.idx ?? [...X.keys()]).map(i => X[i]).filter(isNum);
        const counts = edges.slice(1).map((e, k) => v.filter(t => t >= edges[k] && (t < e || (k === edges.length - 2 && t <= e))).length);
        let y = counts.map(Number), total = v.length;
        if (args.cumulative) { let s = 0; y = y.map(c => (s += c)); }
        if (args.density === 'percent') y = y.map(c => 100 * c / total); else if (args.density === 'probability') y = y.map(c => c / total); else if (args.density === 'density') y = y.map((c, k) => args.cumulative ? c / total : c / total / (edges[k + 1] - edges[k]));
        const color = g.color ?? colorOf(args.color, fig.traces.length), mids = edges.slice(1).map((e, k) => sig((e + edges[k]) / 2)), widths = edges.slice(1).map((e, k) => sig(e - edges[k]));
        const name = g.level != null ? String(g.level) : args.label ?? f.name(args.x) ?? 'histograma', h = args.orientation === 'h';
        let trace;
        // A step outline: up from 0 at the first edge, across each bin, back down at the last edge.
        if (args.histtype === 'step') trace = { type: 'scatter', mode: 'lines', [h ? 'y' : 'x']: [edges[0], ...edges].map(sig), [h ? 'x' : 'y']: [0, ...y, 0].map(sig), line: { color, width: 2, shape: h ? 'vh' : 'hv' } };
        else trace = { type: 'bar', orientation: args.orientation, [h ? 'y' : 'x']: mids, [h ? 'x' : 'y']: y.map(sig), width: widths, offsetgroup: `hist-${a.name}`, marker: { color: withAlpha(color, args.alpha ?? (overlay ? 0.55 : 0.9)), line: { width: 0.6, color: 'rgba(255,255,255,0.6)' } },
          customdata: edges.slice(1).map((e, k) => [sig(edges[k]), sig(e), counts[k]]), hovertemplate: `[%{customdata[0]}, %{customdata[1]})<br>n = <b>%{customdata[2]}</b>${args.density !== 'count' ? `<br>%{${h ? 'x' : 'y'}:.3f}` : ''}<extra>%{fullData.name}</extra>` };
        trace.name = name; if (!overlay && !args.label) trace.showlegend = false;
        ids.push(addTrace(fig, a, trace, { kind: 'hist' })); points += v.length;
        out.push({ group: g.level ?? name, n: v.length, edges: edges.map(e => sig(e)), counts });
      }
      if (overlay && args.histtype === 'bar') fig.barmode ??= 'overlay';
    }
    if (fig.barmode === 'group' && out.length > 1) fig.barmode = 'overlay';
    return result(fig, axes, ids, points, [], { bins: out.slice(0, 6) });
  });

  tool('plot_hist2d', 'Histograma 2D (densidad de puntos en una cuadrícula, como plt.hist2d / hexbin) o sus curvas de nivel (kind "contour"), para muchas observaciones de dos variables.', {
    ...common, ...colorScaleArgs, x: col, y: col, bins_x: z.number().int().min(2).max(200).default(25), bins_y: z.number().int().min(2).max(200).default(25), kind: z.enum(['heatmap', 'contour']).default('heatmap'),
    density: z.enum(['count', 'percent', 'probability', 'density']).default('count'),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['xy'], 'plot_hist2d'), ids = []; let points = 0;
    for (const a of axes) {
      const f = frame(args, a), X = f.get(args.x, 'x'), Y = f.get(args.y, 'y'), idx = [...X.keys()].filter(i => isNum(X[i]) && isNum(Y[i]));
      const trace = { type: args.kind === 'contour' ? 'histogram2dcontour' : 'histogram2d', x: idx.map(i => sig(X[i])), y: idx.map(i => sig(Y[i])), nbinsx: args.bins_x, nbinsy: args.bins_y, histnorm: { count: '', percent: 'percent', probability: 'probability', density: 'probability density' }[args.density],
        ...scaleOf({ colormap: args.colormap ?? 'viridis', ...args }, [0, 1], 'z'), showscale: args.show_colorbar ?? true, colorbar: { title: { text: args.colorbar_title ?? (args.density === 'count' ? 'n' : args.density) } }, name: args.label ?? 'densidad' };
      if (args.kind === 'contour') trace.contours = { coloring: 'fill', showlines: true }; trace.showlegend = false;
      ids.push(addTrace(fig, a, trace, { kind: 'hist2d' })); points += idx.length;
    }
    return result(fig, axes, ids, points);
  });

  tool('plot_box', 'Distribución por categoría: caja (box, como ax.boxplot), violín (violin, densidad con una caja angosta dentro) o puntos (strip, como seaborn.stripplot). y es la variable numérica y x la categoría (opcional). Para un color por categoría pasa group_by igual a x (no se desplazan). Con otra columna, group_by divide cada categoría en subgrupos lado a lado (como hue). points: outliers, all (puntos con dispersión jitter encima de la forma) o none. show_mean: línea discontinua de la media dentro de la caja (box) o del violín.', {
    ...common, ...groupArgs, y: col, x: col.optional(), kind: z.enum(['box', 'violin', 'strip']).default('box'), points: z.enum(['outliers', 'all', 'none']).default('outliers'),
    show_mean: z.boolean().default(true), notch: z.boolean().default(false), orientation: z.enum(['v', 'h']).default('v'),
    jitter: z.number().min(0).max(1).default(0.35).describe('Dispersión horizontal de los puntos (0–1).'), point_size: z.number().min(2).max(12).default(5),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['xy'], 'plot_box'), ids = []; let points = 0;
    // x and group_by the same column: one colour per category, centred on its tick (no dodging).
    const sameAsX = args.group_by && typeof args.x === 'string' && args.group_by.toLowerCase() === args.x.toLowerCase();
    if (args.group_by && !sameAsX) fig.boxmode = 'group';
    for (const a of axes) {
      const f = frame(args, a), Y = f.get(args.y, 'y'), X = args.x != null ? f.get(args.x, 'x') : null, h = args.orientation === 'h';
      for (const g of byGroup(args, f, o => o)) {
        const idx = (g.idx ?? [...Y.keys()]).filter(i => isNum(Y[i])), color = g.color ?? colorOf(args.color, args.group_by ? g.k : 0);
        const vals = idx.map(i => sig(Y[i])), cats = X ? idx.map(i => X[i]) : undefined;
        const name = g.level != null ? String(g.level) : args.label ?? f.name(args.y) ?? 'valores';
        let trace;
        const over = { pointpos: 0, jitter: args.jitter, marker: { color: withAlpha(color, args.alpha ?? 0.7), size: args.point_size, line: { width: 0.5, color: 'rgba(255,255,255,0.7)' } } };
        if (args.kind === 'violin') trace = { type: 'violin', [h ? 'x' : 'y']: vals, ...(cats ? { [h ? 'y' : 'x']: cats } : {}), orientation: args.orientation, box: { visible: true, width: 0.12 }, meanline: { visible: args.show_mean }, points: args.points === 'none' ? false : args.points, ...over, line: { color }, fillcolor: withAlpha(color, 0.3), spanmode: 'hard', ...(sameAsX ? { scalegroup: a.name } : {}) };
        else if (args.kind === 'strip') trace = { type: 'box', [h ? 'x' : 'y']: vals, ...(cats ? { [h ? 'y' : 'x']: cats } : {}), orientation: args.orientation, boxpoints: 'all', ...over, jitter: Math.max(args.jitter, 0.5), fillcolor: 'rgba(0,0,0,0)', line: { color: 'rgba(0,0,0,0)' }, hoveron: 'points' };
        else trace = { type: 'box', [h ? 'x' : 'y']: vals, ...(cats ? { [h ? 'y' : 'x']: cats } : {}), orientation: args.orientation, boxpoints: args.points === 'none' ? false : args.points, boxmean: args.show_mean, notched: args.notch, ...over, marker: { ...over.marker, color }, line: { color, width: 1.5 }, fillcolor: withAlpha(color, 0.3) };
        trace.name = name; if (args.group_by && !sameAsX) trace.offsetgroup = `${a.name}-${g.k}`; if ((!args.group_by || sameAsX) && !args.label) trace.showlegend = false;
        if (args.hover?.length) { const extra = args.hover.map(hc => pick(f.get(hc, 'hover'), idx)); trace.text = idx.map((_, k) => args.hover.map((hc, j) => `${hc}: ${extra[j][k]}`).join('<br>')); }
        ids.push(addTrace(fig, a, trace, { kind: args.kind })); points += idx.length;
      }
    }
    if (args.kind === 'violin' && args.group_by && !sameAsX) fig.violinmode = 'group';
    return result(fig, axes, ids, points);
  });

  tool('plot_kde', 'Curva de densidad por kernel gaussiano (como seaborn.kdeplot), una por grupo con group_by; útil para comparar distribuciones. bandwidth fija el ancho (por defecto regla de Scott); fill rellena bajo la curva; rug marca cada observación.', {
    ...common, ...groupArgs, x: col, bandwidth: z.number().positive().optional(), fill: z.boolean().default(true), rug: z.boolean().default(false),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['xy'], 'plot_kde'), ids = []; let points = 0; const bws = [];
    for (const a of axes) {
      const f = frame(args, a), X = f.get(args.x, 'x');
      for (const g of byGroup(args, f, o => o)) {
        const v = (g.idx ?? [...X.keys()]).map(i => X[i]).filter(isNum), k = kde(v, { bandwidth: args.bandwidth }), color = g.color ?? colorOf(args.color, fig.traces.length);
        const name = g.level != null ? String(g.level) : args.label ?? f.name(args.x) ?? 'densidad';
        const trace = { type: 'scatter', mode: 'lines', x: k.curve.map(p => sig(p.x)), y: k.curve.map(p => sig(p.y)), line: { color, width: 2 }, name, ...(args.fill ? { fill: 'tozeroy', fillcolor: withAlpha(color, args.alpha ?? 0.18) } : {}), hovertemplate: `%{x}<br>densidad: %{y:.3f}<extra>${name}</extra>` };
        if (!args.group_by && !args.label) trace.showlegend = false;
        ids.push(addTrace(fig, a, trace, { kind: 'kde' })); points += v.length; bws.push({ group: g.level ?? name, n: v.length, bandwidth: round(k.bandwidth, 5) });
        if (args.rug) ids.push(addTrace(fig, a, { type: 'scatter', mode: 'markers', x: v.map(sig), y: v.map(() => 0), marker: { symbol: 'line-ns-open', size: 10, color }, showlegend: false, hoverinfo: 'x', name }, { kind: 'rug' }));
      }
    }
    return result(fig, axes, ids, points, [], { bandwidths: bws });
  });

  tool('plot_errorbar', 'Puntos (o línea) con barras de error (como ax.errorbar): yerr / xerr como columna o número (simétrico) y yerr_minus para errores asimétricos. Útil para medias con IC por grupo o estimaciones con su intervalo.', {
    ...common, x: col, y: col, yerr: colNum.optional(), yerr_minus: colNum.optional(), xerr: colNum.optional(), line: z.boolean().default(false), marker_size: z.number().min(2).max(20).default(7), capsize: z.number().min(0).max(12).default(4), y_axis: z.enum(['left', 'right']).default('left'),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['xy'], 'plot_errorbar'), ids = []; let points = 0;
    for (const a of axes) {
      const f = frame(args, a), X = f.get(args.x, 'x'), Y = f.get(args.y, 'y'), n = X.length;
      const ev = s => s == null ? null : typeof s === 'number' ? Array(n).fill(s) : f.get(s, 'error');
      const YE = ev(args.yerr), YM = ev(args.yerr_minus), XE = ev(args.xerr), color = colorOf(args.color, fig.traces.length);
      const trace = { type: 'scatter', mode: args.line ? 'lines+markers' : 'markers', x: X.map(sig), y: Y.map(sig), marker: { color, size: args.marker_size }, line: { color, width: 1.5 }, name: args.label ?? f.name(args.y) ?? 'media',
        ...(YE ? { error_y: { type: 'data', array: YE.map(sig), ...(YM ? { arrayminus: YM.map(sig), symmetric: false } : {}), visible: true, thickness: 1.4, width: args.capsize, color } } : {}),
        ...(XE ? { error_x: { type: 'data', array: XE.map(sig), visible: true, thickness: 1.4, width: args.capsize, color } } : {}), ...hoverOf(args, f, null, `${f.name(args.x) ?? 'x'}: %{x}<br>${f.name(args.y) ?? 'y'}: <b>%{y}</b>`) };
      if (!args.label) trace.showlegend = false;
      ids.push(addTrace(fig, a, trace, { kind: 'errorbar', secondary: args.y_axis === 'right' })); points += n;
    }
    return result(fig, axes, ids, points);
  });

  tool('plot_fill_between', 'Rellena el área entre dos curvas y1 e y2 sobre x (como ax.fill_between): bandas de intervalo (P10–P90, IC), rangos mín–máx, sombras de incertidumbre. y2 puede ser un número (p. ej. 0). Con group_by, una banda por grupo con el color del grupo (las mismas que plot_line con ese group_by); alpha por defecto 0.18. Varias bandas superpuestas se mezclan: usa alpha bajo o paneles separados.', {
    ...common, ...groupArgs, x: col, y1: col, y2: colNum.default(0), y_axis: z.enum(['left', 'right']).default('left'),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['xy'], 'plot_fill_between'), ids = []; let points = 0;
    for (const a of axes) {
      const f = frame(args, a), X = f.get(args.x, 'x'), Y1 = f.get(args.y1, 'y1'), Y2 = typeof args.y2 === 'number' ? X.map(() => args.y2) : f.get(args.y2, 'y2');
      for (const g of byGroup(args, f, o => o)) {
        let idx = (g.idx ?? [...X.keys()]).filter(i => X[i] != null); if (numeric(X) || X.every(v => v == null || /^\d{4}-/.test(String(v)))) idx.sort((p, q) => (X[p] > X[q]) - (X[p] < X[q]));
        const color = g.color ?? colorOf(args.color, fig.traces.length), name = g.level != null ? `${args.label ? `${args.label} · ` : ''}${g.level}` : args.label ?? 'banda', info = { kind: 'fill_between', secondary: args.y_axis === 'right' };
        ids.push(addTrace(fig, a, { type: 'scatter', mode: 'lines', x: idx.map(i => sig(X[i])), y: idx.map(i => sig(Y2[i])), line: { width: 0, color }, showlegend: false, hoverinfo: 'skip', name, legendgroup: name }, info));
        ids.push(addTrace(fig, a, { type: 'scatter', mode: 'lines', x: idx.map(i => sig(X[i])), y: idx.map(i => sig(Y1[i])), line: { width: 0, color }, fill: 'tonexty', fillcolor: withAlpha(color, args.alpha ?? 0.18), name, legendgroup: name, showlegend: !!(args.label || args.group_by), hovertemplate: `%{x}: %{y}<extra>${name}</extra>` }, info));
        points += idx.length;
      }
    }
    return result(fig, axes, ids, points);
  });

  // ── Matrices and surfaces ────────────────────────────────────────────────────────────────────
  /** A z matrix over the unique x and y values of long-form data (mean of duplicates). */
  const toGrid = (X, Y, Z, xOrder, yOrder) => {
    // Text categories keep their order of appearance (a correlation matrix keeps the variables' order).
    const inOrder = (v, order) => order?.length || numeric(v) ? levelsOf(v, order) : uniq(v.filter(t => t != null && t !== ''));
    const xs = inOrder(X, xOrder), ys = inOrder(Y, yOrder), cell = new Map();
    const present = new Set();
    X.forEach((x, i) => { if (x == null || Y[i] == null) return; const k = `${x}\u0001${Y[i]}`; present.add(k); if (!isNum(Z[i])) return; const c = cell.get(k) ?? []; c.push(Z[i]); cell.set(k, c); });
    return { xs, ys, z: ys.map(y => xs.map(x => { const c = cell.get(`${x}\u0001${y}`); return c ? sig(sum(c) / c.length) : null; })), filled: present.size, duplicates: [...cell.values()].some(c => c.length > 1) };
  };
  /** Planar IDW of scattered x, y, z onto an n×n grid (axes scaled to [0, 1]); far cells stay empty. */
  const idwPlanar = (X, Y, Z, n = 50, radius = 0.15) => {
    const pts = X.map((x, i) => [x, Y[i], Z[i]]).filter(p => p.every(isNum)); if (pts.length < 3) throw new Error('Hacen falta al menos 3 puntos con x, y, z para interpolar.');
    const [x0, x1] = [Math.min(...pts.map(p => p[0])), Math.max(...pts.map(p => p[0]))], [y0, y1] = [Math.min(...pts.map(p => p[1])), Math.max(...pts.map(p => p[1]))];
    const sx = x1 - x0 || 1, sy = y1 - y0 || 1, xs = Array.from({ length: n }, (_, i) => x0 + sx * i / (n - 1)), ys = Array.from({ length: n }, (_, i) => y0 + sy * i / (n - 1));
    const z = ys.map(gy => xs.map(gx => { const ds = pts.map(p => [Math.hypot((p[0] - gx) / sx, (p[1] - gy) / sy), p[2]]).sort((a, b) => a[0] - b[0]).slice(0, 12); if (ds[0][0] > radius) return null; if (ds[0][0] < 1e-9) return sig(ds[0][1]); let a = 0, b = 0; for (const [d, v] of ds) { a += v / d ** 2; b += 1 / d ** 2; } return sig(a / b); }));
    return { xs: xs.map(sig), ys: ys.map(sig), z };
  };
  const gridFrom = (args, f) => {
    if (args.matrix) return { xs: args.matrix.x_labels ?? args.matrix.z[0].map((_, i) => i), ys: args.matrix.y_labels ?? args.matrix.z.map((_, i) => i), z: args.matrix.z.map(r => r.map(sig)) };
    const X = f.get(args.x, 'x'), Y = f.get(args.y, 'y'), Z = f.get(args.z, 'z');
    if (!X || !Y || !Z) throw new Error('Pasa x, y, z (formato largo) o matrix {z, x_labels, y_labels}.');
    if (args.interpolate === 'idw') return idwPlanar(X, Y, Z, args.grid ?? 50, args.radius ?? 0.15);
    const g = toGrid(X, Y, Z, args.x_order, args.y_order);
    const coverage = g.filled / (g.xs.length * g.ys.length);
    if (numeric(X) && numeric(Y) && coverage < 0.5 && g.xs.length * g.ys.length > 400) throw new Error(`x e y no forman una malla (solo ${Math.round(coverage * 100)} % de las celdas tienen dato): son puntos dispersos. Usa interpolate "idw" o stats_interpolate.`);
    return g;
  };

  tool('plot_heatmap', 'Mapa de calor de una matriz (como imshow / seaborn.heatmap): matrices de correlación, tablas mes × año, municipio × variable. Entrada en formato largo (x, y, z columnas; duplicados se promedian) o matrix {z: [[…]], x_labels, y_labels}. annotate escribe el valor en cada celda. Para correlaciones: colormap rdbu, z_range [-1, 1].', {
    ...common, ...colorScaleArgs, x: col.optional(), y: col.optional(), z: col.optional(), matrix: z.object({ z: z.array(z.array(z.number().nullable())).max(400), x_labels: z.array(z.union([z.string(), z.number()])).optional(), y_labels: z.array(z.union([z.string(), z.number()])).optional() }).optional(),
    x_order: z.array(z.union([z.string(), z.number()])).optional(), y_order: z.array(z.union([z.string(), z.number()])).optional(), z_range: z.array(z.number()).length(2).optional(),
    annotate: z.boolean().default(false), decimals: z.number().int().min(0).max(4).default(2), gap: z.number().min(0).max(6).default(1),
    mask: z.enum(['none', 'upper', 'lower']).default('none').describe('Oculta el triángulo superior o inferior (incluida la diagonal) de una matriz simétrica, como seaborn mask=np.triu.'),
    p: z.string().optional().describe('Columna de p-valores (formato largo): agrega estrellas al valor (* p<0.05, ** p<0.01, *** p<0.001).'),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['xy'], 'plot_heatmap'), ids = []; let points = 0;
    for (const a of axes) {
      const f = frame(args, a), g = gridFrom(args, f);
      if (args.mask !== 'none') g.z = g.z.map((row, i) => row.map((v, j) => (args.mask === 'upper' ? j >= i : j <= i) ? null : v));
      const flat = g.z.flat().filter(isNum);
      let text = null;
      if (args.annotate) {
        const P = args.p ? gridFrom({ ...args, z: args.p }, f).z : null, stars = q => !isNum(q) ? '' : q < 0.001 ? '***' : q < 0.01 ? '**' : q < 0.05 ? '*' : '';
        text = g.z.map((row, i) => row.map((v, j) => isNum(v) ? `${v.toFixed(args.decimals).replace('-', '−')}${P ? stars(P[i][j]) : ''}` : ''));
      }
      const trace = { type: 'heatmap', x: g.xs.map(String).every((s, i) => s === String(g.xs[i])) ? g.xs : g.xs.map(String), y: g.ys, z: g.z, xgap: args.gap, ygap: args.gap, ...scaleOf({ ...args, color_range: args.z_range ?? args.color_range }, flat, 'z'),
        showscale: args.show_colorbar ?? true, colorbar: { title: { text: args.colorbar_title ?? (typeof args.z === 'string' ? args.z : '') } }, name: args.label ?? 'matriz', showlegend: false,
        hovertemplate: `${f.name?.(args.x) ?? 'x'}: %{x}<br>${f.name?.(args.y) ?? 'y'}: %{y}<br>${typeof args.z === 'string' ? args.z : 'z'}: <b>%{z}</b><extra></extra>`,
        ...(text ? { text, texttemplate: '%{text}', textfont: { size: 10 }, textchars: Math.max(...text.flat().map(t => t.length)) } : {}) };
      if (!numeric(g.xs)) a.x.scale ??= 'category'; if (!numeric(g.ys)) a.y.scale ??= 'category';
      ids.push(addTrace(fig, a, trace, { kind: 'heatmap' })); points += flat.length;
    }
    return result(fig, axes, ids, points);
  });

  tool('plot_contour', 'Curvas de nivel (como ax.contour / contourf) de z sobre x, y: de una malla en formato largo (p. ej. el dataset de stats_interpolate con lon, lat, value) o de puntos dispersos con interpolate "idw". filled rellena entre niveles; levels fija cuántos; show_labels escribe el valor en las líneas. Para lon/lat usa plot_axes equal_aspect.', {
    ...common, ...colorScaleArgs, x: col.optional(), y: col.optional(), z: col.optional(), matrix: z.object({ z: z.array(z.array(z.number().nullable())), x_labels: z.array(z.number()).optional(), y_labels: z.array(z.number()).optional() }).optional(),
    interpolate: z.enum(['none', 'idw']).default('none'), grid: z.number().int().min(10).max(150).default(50), radius: z.number().min(0.02).max(1).default(0.15).describe('idw: distancia máxima a un dato, como fracción del rango de x e y (0.15 = 15 % del ancho de los datos); las celdas más lejanas quedan vacías.'),
    levels: z.number().int().min(2).max(40).optional(), level_range: z.array(z.number()).length(2).optional(), filled: z.boolean().default(true), show_labels: z.boolean().default(false), line_color: z.string().optional(),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['xy'], 'plot_contour'), ids = []; let points = 0;
    for (const a of axes) {
      const f = frame(args, a), g = gridFrom(args, f), flat = g.z.flat().filter(isNum);
      const lo = args.level_range?.[0] ?? Math.min(...flat), hi = args.level_range?.[1] ?? Math.max(...flat), nl = args.levels ?? 10;
      const trace = { type: 'contour', x: g.xs, y: g.ys, z: g.z, ...scaleOf(args, flat, 'z'), showscale: args.show_colorbar ?? args.filled, colorbar: { title: { text: args.colorbar_title ?? (typeof args.z === 'string' ? args.z : '') } }, name: args.label ?? 'contorno', showlegend: false,
        autocontour: false, contours: { start: lo, end: hi, size: (hi - lo) / nl || 1, coloring: args.filled ? 'fill' : 'lines', showlabels: args.show_labels, labelfont: { size: 9 } }, line: { width: args.filled ? 0.5 : 1.5, ...(args.line_color ? { color: colorOf(args.line_color) } : {}) }, connectgaps: false, opacity: args.alpha ?? 1 };
      ids.push(addTrace(fig, a, trace, { kind: 'contour' })); points += flat.length;
    }
    return result(fig, axes, ids, points);
  });

  tool('plot_surface', 'Superficie 3D z = f(x, y) (como plot_surface de mplot3d) en ejes 3d: de una malla en formato largo, matrix, o puntos dispersos con interpolate "idw". contours proyecta curvas de nivel sobre la superficie.', {
    ...common, ...colorScaleArgs, x: col.optional(), y: col.optional(), z: col.optional(), matrix: z.object({ z: z.array(z.array(z.number().nullable())), x_labels: z.array(z.number()).optional(), y_labels: z.array(z.number()).optional() }).optional(),
    interpolate: z.enum(['none', 'idw']).default('none'), grid: z.number().int().min(10).max(120).default(40), radius: z.number().min(0.02).max(1).default(0.2), contours: z.boolean().default(false),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['3d'], 'plot_surface'), ids = []; let points = 0;
    for (const a of axes) {
      const f = frame(args, a), g = gridFrom(args, f), flat = g.z.flat().filter(isNum);
      const trace = { type: 'surface', x: g.xs, y: g.ys, z: g.z, ...scaleOf(args, flat), showscale: args.show_colorbar ?? true, colorbar: { title: { text: args.colorbar_title ?? (typeof args.z === 'string' ? args.z : '') } }, opacity: args.alpha ?? 1, name: args.label ?? 'superficie', showlegend: false,
        ...(args.contours ? { contours: { z: { show: true, usecolormap: true, project: { z: true } } } } : {}) };
      ids.push(addTrace(fig, a, trace, { kind: 'surface' })); points += flat.length;
    }
    return result(fig, axes, ids, points);
  });

  // ── Models on the plot ───────────────────────────────────────────────────────────────────────
  tool('plot_regression', 'Puntos con su ajuste (como seaborn.regplot): lineal, polinomial (degree) o LOWESS (curva suave robusta, frac). Agrega la banda del 95 % (lineal/polinomial: de confianza de la media, o de predicción con band "prediction"; LOWESS: por bootstrap); band_color y band_alpha la ajustan, ci false la quita. Con group_by, un ajuste por grupo. Devuelve los coeficientes, R² y p del ajuste; show_equation los pone en la leyenda.', {
    ...common, ...groupArgs, x: col, y: col, fit: z.enum(['linear', 'poly', 'lowess']).default('linear'), degree: z.number().int().min(1).max(5).default(2), frac: z.number().min(0.1).max(1).default(0.66),
    ci: z.union([z.number().min(0.5).max(0.999), z.literal(false)]).default(0.95), band: z.enum(['confidence', 'prediction']).default('confidence'),
    scatter: z.boolean().default(true), marker_size: z.number().min(2).max(20).default(6), show_equation: z.boolean().default(true), width: z.number().min(0.5).max(6).default(2.2),
    band_color: z.string().optional().describe('Color de la banda (por defecto, el de la línea).'), band_alpha: z.number().min(0.03).max(0.6).default(0.16), bootstrap: z.number().int().min(50).max(1000).default(200).describe('lowess: remuestreos para su banda.'),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['xy'], 'plot_regression'), ids = []; let points = 0; const fits = [];
    for (const a of axes) {
      const f = frame(args, a), X = f.get(args.x, 'x'), Y = f.get(args.y, 'y');
      for (const g of byGroup(args, f, o => o)) {
        const idx = (g.idx ?? [...X.keys()]).filter(i => isNum(X[i]) && isNum(Y[i])), x = idx.map(i => X[i]), y = idx.map(i => Y[i]);
        const color = g.color ?? colorOf(args.color, args.group_by ? g.k : 0), base = g.level != null ? String(g.level) : args.label ?? 'ajuste';
        if (args.scatter) { const t = { type: 'scatter', mode: 'markers', x: x.map(sig), y: y.map(sig), marker: { color: withAlpha(color, args.alpha ?? 0.7), size: args.marker_size, line: { width: 0.6, color: 'rgba(255,255,255,0.7)' } }, name: base, showlegend: !!args.group_by, legendgroup: base, ...hoverOf(args, f, idx, `${f.name(args.x) ?? 'x'}: %{x}<br>${f.name(args.y) ?? 'y'}: <b>%{y}</b>`) }; ids.push(addTrace(fig, a, t, { kind: 'scatter' })); }
        let curve, stats = null;
        if (args.fit === 'lowess') {
          curve = lowess(x, y, { frac: args.frac }).map(p => ({ x: p.x, y: p.y })); stats = { fit: 'lowess', frac: args.frac, n: x.length };
          if (args.ci !== false) {
            // Bootstrap band (like seaborn's lowess CI): refit on resampled parcels, take percentiles at each x.
            const xs = [...new Set(curve.map(p => p.x))], rand = mulberry(7), sims = xs.map(() => []);
            for (let b = 0; b < args.bootstrap; b++) {
              const pick = x.map(() => Math.floor(rand() * x.length)), fit = lowess(pick.map(i => x[i]), pick.map(i => y[i]), { frac: args.frac, iterations: 1 });
              const fx = fit.map(p => p.x), fy = fit.map(p => p.y);
              xs.forEach((v, k) => { if (v < fx[0] || v > fx.at(-1)) return; let j = fx.findIndex(t => t >= v); if (j <= 0) { sims[k].push(fy[0]); return; } const t = (v - fx[j - 1]) / ((fx[j] - fx[j - 1]) || 1); sims[k].push(fy[j - 1] + t * (fy[j] - fy[j - 1])); });
            }
            const lo = (1 - args.ci) / 2, band = xs.map((v, k) => ({ x: v, low: quantile(sims[k], lo), high: quantile(sims[k], 1 - lo) }));
            curve = curve.map(p => { const bnd = band[xs.indexOf(p.x)]; return { ...p, low: bnd.low ?? p.y, high: bnd.high ?? p.y }; });
            stats.band = `bootstrap ${args.bootstrap} remuestreos, ${Math.round(args.ci * 100)} %`;
          }
        }
        else {
          const deg = args.fit === 'linear' ? 1 : args.degree, pf = polyFit(x, y, deg, { interval: args.band });
          if (args.ci !== false && args.ci !== 0.95) { const t95 = tQuantile(0.975, pf.model.df_resid), tc = tQuantile(0.5 + args.ci / 2, pf.model.df_resid); pf.curve.forEach(p => { const half = (p.high - p.y) * tc / t95; p.low = p.y - half; p.high = p.y + half; }); }
          curve = pf.curve; const co = pf.model.coefficients;
          stats = { fit: args.fit, degree: deg, n: pf.model.n, r2: pf.model.r2, rmse: pf.model.rmse, coefficients: co.map(c => ({ term: c.term.replace('x1', 'x').replace(/x(\d)/, 'x^$1'), estimate: c.estimate, se: c.se, p: c.p })), f_p: pf.model.f_p };
        }
        if (args.ci !== false && curve[0]?.low != null) {
          const bandColor = withAlpha(args.band_color ? colorOf(args.band_color) : color, args.band_alpha);
          ids.push(addTrace(fig, a, { type: 'scatter', mode: 'lines', x: curve.map(p => sig(p.x)), y: curve.map(p => sig(p.low)), line: { width: 0 }, showlegend: false, hoverinfo: 'skip', legendgroup: base, name: base }, { kind: 'band' }));
          ids.push(addTrace(fig, a, { type: 'scatter', mode: 'lines', x: curve.map(p => sig(p.x)), y: curve.map(p => sig(p.high)), line: { width: 0 }, fill: 'tonexty', fillcolor: bandColor, showlegend: false, hoverinfo: 'skip', legendgroup: base, name: base }, { kind: 'band' }));
        }
        const fmt = v => (Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 1 ? v.toFixed(2) : v.toPrecision(2));
        const eq = stats.coefficients ? `y = ${fmt(stats.coefficients[0].estimate)}${stats.coefficients.slice(1).map((c, k) => ` ${c.estimate < 0 ? '−' : '+'} ${fmt(Math.abs(c.estimate))}x${k ? `<sup>${k + 1}</sup>` : ''}`).join('')} · R² = ${stats.r2?.toFixed(2)}` : null;
        const name = args.show_equation && eq ? `${args.group_by || args.label ? `${base}: ` : ''}${eq}` : args.fit === 'lowess' && !args.label && !args.group_by ? `LOWESS (frac ${args.frac})` : base;
        ids.push(addTrace(fig, a, { type: 'scatter', mode: 'lines', x: curve.map(p => sig(p.x)), y: curve.map(p => sig(p.y)), line: { color, width: args.width }, name, legendgroup: base, showlegend: !!(args.show_equation || args.group_by || args.label || args.fit === 'lowess'), hovertemplate: `ajuste: %{y:.3f}<extra>${base}</extra>` }, { kind: 'fit' }));
        points += x.length; fits.push({ group: g.level ?? base, ...stats });
      }
    }
    return result(fig, axes, ids, points, [], { fits });
  });

  // ── Pie ──────────────────────────────────────────────────────────────────────────────────────
  tool('plot_pie', 'Pastel o dona (hole > 0) en ejes de tipo pie (como ax.pie): proporciones de pocas categorías (≤ 8). Si hay varias filas por etiqueta, se suman.', {
    ...common, ...groupArgs, labels: col, values: col.optional().describe('Omitir para contar filas.'), hole: z.number().min(0).max(0.8).default(0.45), text: z.enum(['percent', 'value', 'label+percent', 'none']).default('percent'), sort: z.boolean().default(true),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['pie'], 'plot_pie'), ids = []; let points = 0;
    for (const a of axes) {
      const f = frame(args, a), L = f.get(args.labels, 'labels'), V = args.values != null ? f.get(args.values, 'values') : L.map(() => 1), levels = levelsOf(L, args.order);
      const vals = levels.map(l => sum(L.map((v, i) => String(v) === String(l) && isNum(V[i]) ? V[i] : 0))); points += L.length;
      ids.push(addTrace(fig, a, { type: 'pie', labels: levels.map(String), values: vals.map(sig), hole: args.hole, sort: args.sort, textinfo: args.text, marker: { colors: levels.map((l, k) => groupColor(args, l, k, levels)), line: { color: 'rgba(255,255,255,0.8)', width: 1 } }, name: args.label ?? '', hovertemplate: '%{label}: <b>%{value}</b> (%{percent})<extra></extra>' }, { kind: 'pie' }));
    }
    return result(fig, axes, ids, points);
  });

  // ── Maps ─────────────────────────────────────────────────────────────────────────────────────
  tool('plot_map', `Agrega una capa a unos ejes de tipo map (mapa con mapa base, encuadre automático). Capas:
- parcelas: los polígonos de las parcelas (por la columna id), coloreados por color_by: numérica → mapa de color con barra (coropleta); texto → un color por categoría con leyenda (p. ej. clusters LISA: colores estándar automáticos).
- puntos: puntos en lon/lat (centroides u otros), con color_by y size_by.
- densidad: mapa de calor de densidad de puntos (weight pondera).
- limites: contornos de estados o municipios cerca de los datos (which).
- etiquetas: texto en lon/lat (text).
- malla: una superficie en celdas (el dataset de stats_interpolate: lon, lat, value) sobre el mapa base, con su mapa de color; las celdas vacías no se dibujan. Combínala con parcelas o puntos encima y limites.
basemap: auto (claro u oscuro según el tema), claro, oscuro, satelite, calles, ninguno.`, {
    ...common, ...groupArgs, ...colorScaleArgs, layer: z.enum(['parcelas', 'puntos', 'densidad', 'limites', 'etiquetas', 'malla']), value: z.string().default('value').describe('malla: columna con el valor de cada celda.'), id: z.string().default('id'), lon: z.string().default('lon'), lat: z.string().default('lat'),
    color_by: z.string().optional(), size: z.number().min(2).max(40).default(9), size_by: z.string().optional(), size_range: z.array(z.number().min(1).max(60)).length(2).default([5, 24]),
    line_width: z.number().min(0).max(6).optional(), line_color: z.string().optional(), which: z.enum(['estados', 'municipios']).default('municipios'),
    text: z.string().optional(), radius: z.number().int().min(2).max(80).default(18), weight: z.string().optional(), basemap: z.enum(['auto', 'claro', 'oscuro', 'satelite', 'calles', 'ninguno']).optional(),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['map'], 'plot_map'), ids = []; let points = 0; const warnings = [];
    for (const a of axes) {
      if (args.basemap) a.map.basemap = args.basemap;
      if (args.layer === 'limites') {
        const ext = fig.traces.filter(t => t.ax === a.name).flatMap(t => t.info?.extent ?? []);
        const all = ext.length ? ext : ctx.atlas.geo.features.map(ft => ft.properties.centroid);
        const [w, s, e, n] = [Math.min(...all.map(p => p[0])), Math.min(...all.map(p => p[1])), Math.max(...all.map(p => p[0])), Math.max(...all.map(p => p[1]))], pad = 0.08;
        const feats = boundaries(ctx.dataDir, args.which).filter(ft => ft.bbox[0] < e + pad && ft.bbox[2] > w - pad && ft.bbox[1] < n + pad && ft.bbox[3] > s - pad);
        const lon = [], lat = []; for (const ft of feats) for (const ring of ft.rings) { for (const [x, y] of ring) { lon.push(x); lat.push(y); } lon.push(null); lat.push(null); }
        ids.push(addTrace(fig, a, { type: 'scattermap', mode: 'lines', lon, lat, line: { width: args.line_width ?? (args.which === 'estados' ? 1.6 : 0.8), color: args.line_color ? colorOf(args.line_color) : 'rgba(110,110,110,0.85)' }, name: args.label ?? args.which, showlegend: !!args.label, hoverinfo: 'skip' }, { kind: 'limites', extent: [] }));
        points += feats.length; continue;
      }
      const f = frame(args, a);
      if (!f.d) throw new Error('plot_map necesita dataset (p. ej. el de data_load parcelas).');
      if (args.layer === 'malla') {
        const LO = f.get(args.lon, 'lon'), LA = f.get(args.lat, 'lat'), V = f.get(args.value, 'value');
        const step = vals => { const u = uniq(vals.filter(isNum)).sort((p, q) => p - q); let m = Infinity; for (let i = 1; i < u.length; i++) m = Math.min(m, u[i] - u[i - 1]); return Number.isFinite(m) ? m : 0.01; };
        const dx = step(LO) / 2, dy = step(LA) / 2, idx = [...V.keys()].filter(i => isNum(V[i]) && isNum(LO[i]) && isNum(LA[i]));
        if (idx.length > 12_000) throw new Error(`La malla tiene ${idx.length} celdas; usa nx, ny ≤ 100 en stats_interpolate.`);
        const gj = { type: 'FeatureCollection', features: idx.map(i => ({ type: 'Feature', id: `c${i}`, properties: { id: `c${i}` }, geometry: { type: 'Polygon', coordinates: [[[LO[i] - dx, LA[i] - dy], [LO[i] + dx, LA[i] - dy], [LO[i] + dx, LA[i] + dy], [LO[i] - dx, LA[i] + dy], [LO[i] - dx, LA[i] - dy]].map(([x, y]) => [sig(x), sig(y)])] } })) };
        const scale = scaleOf(args, V, 'c', true);
        ids.push(addTrace(fig, a, { type: 'choroplethmap', geojson: gj, featureidkey: 'properties.id', locations: idx.map(i => `c${i}`), z: idx.map(i => sig(V[i])), zmin: scale.cmin, zmax: scale.cmax, ...(scale.cmid != null ? { zmid: scale.cmid } : {}), colorscale: scale.colorscale,
          marker: { opacity: args.alpha ?? 0.72, line: { width: 0 } }, showscale: args.show_colorbar ?? true, colorbar: { title: { text: args.colorbar_title ?? args.value } }, name: args.label ?? 'superficie', showlegend: false, hovertemplate: `${args.value}: <b>%{z}</b><extra></extra>` },
          { kind: 'malla', extent: idx.map(i => [LO[i], LA[i]]) }));
        points += idx.length; continue;
      }
      const C = args.color_by ? f.get(args.color_by, 'color_by') : null, continuous = C && numeric(C) && uniq(C.filter(isNum)).length > 10;
      const hoverCols = args.hover ?? (args.layer === 'parcelas' ? ['id', 'municipality'].filter(c => f.d.columns.includes(c)) : []);
      if (args.layer === 'parcelas') {
        const ID = f.get(args.id, 'id'), geo = parcelGeo();
        const groups = C && !continuous ? byGroup({ ...args, group_by: args.color_by }, f, o => o) : [{ idx: null, level: null, color: args.color ? colorOf(args.color) : PALETTE[0], k: 0 }];
        let first = true;
        for (const g of groups) {
          const idx = (g.idx ?? [...ID.keys()]).filter(i => geo.has(ID[i]) && (!continuous || isNum(C[i])));
          const missing = (g.idx ?? ID).length - idx.length; if (missing) warnings.push(`${missing} filas sin polígono${continuous ? ' o sin valor' : ''} se omitieron.`);
          if (!idx.length) continue;
          const feats = idx.map(i => geo.get(ID[i])), extent = feats.flatMap(ft => [[ft.properties.bounds[0], ft.properties.bounds[1]], [ft.properties.bounds[2], ft.properties.bounds[3]]]);
          const gj = { type: 'FeatureCollection', features: feats.map(ft => ({ type: 'Feature', properties: { id: ft.properties.id }, geometry: { type: ft.geometry.type, coordinates: JSON.parse(JSON.stringify(ft.geometry.coordinates, (k, v) => typeof v === 'number' ? Math.round(v * 1e6) / 1e6 : v)) } })) };
          const hv = hoverCols.map(h => pick(f.get(h, 'hover'), idx));
          const trace = { type: 'choroplethmap', geojson: gj, featureidkey: 'properties.id', locations: idx.map(i => ID[i]),
            z: continuous ? idx.map(i => sig(C[i])) : idx.map(() => 1), marker: { opacity: args.alpha ?? 0.85, line: { width: args.line_width ?? 0.6, color: args.line_color ? colorOf(args.line_color) : 'rgba(255,255,255,0.85)' } },
            ...(continuous ? { ...scaleOf(args, C), showscale: args.show_colorbar ?? first, colorbar: { title: { text: args.colorbar_title ?? f.name(args.color_by) } } } : { colorscale: [[0, g.color], [1, g.color]], showscale: false }),
            name: g.level != null ? String(g.level) : args.label ?? (C ? f.name(args.color_by) : 'parcelas'), showlegend: g.level != null || !!args.label,
            customdata: idx.map((_, k) => hv.map(v => sig(v[k]))), hovertemplate: `${hoverCols.map((h, k) => `${h}: <b>%{customdata[${k}]}</b>`).join('<br>')}${continuous ? `<br>${f.name(args.color_by)}: <b>%{z}</b>` : g.level != null ? `<br>${f.name(args.color_by)}: <b>${g.level}</b>` : ''}<extra></extra>` };
          const sizes = feats.map(ft => { const [w, s2, e] = ft.properties.bounds; return (e - w) * 111_320 * Math.cos(s2 * Math.PI / 180); }).sort((p, q) => p - q);
          const scale = continuous ? scaleOf(args, C, 'c', true) : null;
          if (continuous) Object.assign(trace, { zmin: scale.cmin, zmax: scale.cmax, ...(scale.cmid != null ? { zmid: scale.cmid } : {}) });
          ids.push(addTrace(fig, a, trace, { kind: 'parcelas', extent }));
          ids.push(addTrace(fig, a, { type: 'scattermap', mode: 'markers', lon: feats.map(ft => ft.properties.centroid[0]), lat: feats.map(ft => ft.properties.centroid[1]), name: trace.name, showlegend: false, legendgroup: trace.name,
            marker: { size: args.size ?? 9, opacity: 0.95, ...(continuous ? { color: trace.z, ...scale, showscale: false } : { color: g.color }) }, customdata: trace.customdata, hovertemplate: trace.hovertemplate.replace('%{z}', '%{marker.color}') },
            { kind: 'parcelas (puntos)', autoPoints: sizes[Math.floor(sizes.length / 2)], extent: [] }));
          points += idx.length; first = false;
        }
      } else {
        const LO = f.get(args.lon, 'lon'), LA = f.get(args.lat, 'lat'), idxAll = [...LO.keys()].filter(i => isNum(LO[i]) && isNum(LA[i]));
        if (!idxAll.length) throw new Error(`No hay filas con ${args.lon}/${args.lat}.`);
        if (args.layer === 'densidad') {
          const W = args.weight ? f.get(args.weight, 'weight') : null;
          ids.push(addTrace(fig, a, { type: 'densitymap', lon: idxAll.map(i => sig(LO[i])), lat: idxAll.map(i => sig(LA[i])), ...(W ? { z: idxAll.map(i => sig(W[i])) } : {}), radius: args.radius, ...scaleOf({ colormap: args.colormap ?? 'ylorrd', ...args }, [0, 1], 'z'), showscale: args.show_colorbar ?? !!W, colorbar: { title: { text: args.colorbar_title ?? args.weight ?? 'densidad' } }, opacity: args.alpha ?? 0.8, name: args.label ?? 'densidad', showlegend: false }, { kind: 'densidad', extent: idxAll.map(i => [LO[i], LA[i]]) }));
          points += idxAll.length; continue;
        }
        if (args.layer === 'etiquetas') {
          const T = f.get(args.text ?? args.id, 'text');
          ids.push(addTrace(fig, a, { type: 'scattermap', mode: 'text', lon: idxAll.map(i => sig(LO[i])), lat: idxAll.map(i => sig(LA[i])), text: idxAll.map(i => T[i]), textfont: { size: 11, color: args.color ? colorOf(args.color) : '#202622' }, name: args.label ?? 'etiquetas', showlegend: false, hoverinfo: 'skip' }, { kind: 'etiquetas', extent: idxAll.map(i => [LO[i], LA[i]]) }));
          continue;
        }
        const S = args.size_by ? f.get(args.size_by, 'size_by') : null, sMin = S ? Math.min(...S.filter(isNum)) : 0, sMax = S ? Math.max(...S.filter(isNum)) : 1;
        const groups = C && !continuous ? byGroup({ ...args, group_by: args.color_by }, f, o => o) : [{ idx: null, level: null, color: args.color ? colorOf(args.color) : PALETTE[0], k: 0 }];
        let first = true;
        for (const g of groups) {
          const idx = (g.idx ?? idxAll).filter(i => idxAll.includes(i)), hv = hoverCols.map(h => pick(f.get(h, 'hover'), idx));
          const trace = { type: 'scattermap', mode: 'markers', lon: idx.map(i => sig(LO[i])), lat: idx.map(i => sig(LA[i])),
            marker: { size: S ? idx.map(i => isNum(S[i]) ? round(args.size_range[0] + (args.size_range[1] - args.size_range[0]) * (sMax > sMin ? (S[i] - sMin) / (sMax - sMin) : 0.5), 2) : args.size_range[0]) : args.size, opacity: args.alpha ?? 0.85,
              ...(continuous ? { color: idx.map(i => sig(C[i])), ...scaleOf(args, C), showscale: args.show_colorbar ?? first, colorbar: { title: { text: args.colorbar_title ?? f.name(args.color_by) } } } : { color: g.color }) },
            name: g.level != null ? String(g.level) : args.label ?? 'puntos', showlegend: g.level != null || !!args.label,
            customdata: idx.map((_, k) => hv.map(v => sig(v[k]))), hovertemplate: `${hoverCols.map((h, k) => `${h}: <b>%{customdata[${k}]}</b><br>`).join('')}${continuous ? `${f.name(args.color_by)}: <b>%{marker.color}</b>` : ''}<extra></extra>` };
          ids.push(addTrace(fig, a, trace, { kind: 'puntos', extent: idx.map(i => [LO[i], LA[i]]) })); points += idx.length; first = false;
        }
      }
    }
    return result(fig, axes, ids, points, uniq(warnings));
  });

  // ── References and annotations ───────────────────────────────────────────────────────────────
  tool('plot_reference', 'Líneas y franjas de referencia en ejes xy (como axhline, axvline, axline, axhspan, axvspan): hline en y = value, vline en x = value, line con slope e intercept (identity = la recta y = x, para estimado contra registrado), hspan / vspan entre values [a, b]. label pone un texto en la línea.', {
    figure_id: common.figure_id, ax: common.ax, kind: z.enum(['hline', 'vline', 'line', 'identity', 'hspan', 'vspan']), value: z.union([z.number(), z.string()]).optional(), values: z.array(z.union([z.number(), z.string()])).length(2).optional(),
    ranges: z.array(z.array(z.union([z.number(), z.string()])).length(2)).max(12).optional().describe('hspan/vspan: varias franjas a la vez, [[a, b], [c, d]].'),
    slope: z.number().optional(), intercept: z.number().default(0), label: z.string().max(60).optional(), color: z.string().optional(), dash: z.enum(['solid', 'dash', 'dot', 'dashdot']).default('dash'), width: z.number().min(0.5).max(6).default(1.4),
    alpha: z.number().min(0.05).max(1).optional(), y_axis: z.enum(['left', 'right']).default('left'), label_position: z.enum(['start', 'middle', 'end']).default('end'),
  }, args => {
    const fig = figureOf(args.figure_id), axes = targets(fig, args.ax ?? null, ['xy'], 'plot_reference'), out = [];
    const color = args.color ? colorOf(args.color) : 'rgba(90,96,92,0.9)';
    for (const [k, a] of axes.entries()) {
      let shape;
      // With several axes the label goes on the first only; spans put it at their top edge, clear of the data.
      const text = k === 0 ? args.label : undefined, spanLabel = { text, textposition: 'top left', font: { size: 10, color } };
      const line = { color, width: args.width, dash: args.dash }, label = text ? { label: { text, textposition: args.label_position, font: { size: 10, color }, ...(args.kind === 'vline' ? { textangle: 0 } : {}) } } : {};
      if ((args.kind === 'hspan' || args.kind === 'vspan') && args.ranges) {
        const fill = withAlpha(args.color ? colorOf(args.color) : '#7c8590', args.alpha ?? 0.13);
        args.ranges.forEach(([v0, v1], j) => { const sh = args.kind === 'hspan' ? { type: 'rect', xref: 'domain', x0: 0, x1: 1, y0: v0, y1: v1 } : { type: 'rect', yref: 'domain', y0: 0, y1: 1, x0: v0, x1: v1 }; const rid = `r${fig.next++}`; fig.shapes.push({ id: rid, ax: a.name, kind: args.kind, shape: { ...sh, fillcolor: fill, line: { width: 0 }, layer: 'below', ...(text && j === 0 ? { label: spanLabel } : {}) }, secondary: args.y_axis === 'right' }); out.push(rid); });
        continue;
      }
      if (args.kind === 'hline' || args.kind === 'vline') {
        if (args.value == null) throw new Error(`${args.kind} necesita value.`);
        shape = args.kind === 'hline' ? { type: 'line', xref: 'domain', x0: 0, x1: 1, y0: args.value, y1: args.value, line, ...label } : { type: 'line', yref: 'domain', y0: 0, y1: 1, x0: args.value, x1: args.value, line, ...label };
      } else if (args.kind === 'hspan' || args.kind === 'vspan') {
        if (!args.values) throw new Error(`${args.kind} necesita values [desde, hasta] o ranges [[a, b], …].`);
        const fill = withAlpha(args.color ? colorOf(args.color) : '#7c8590', args.alpha ?? 0.15);
        const sl = text ? { label: spanLabel } : {};
        shape = args.kind === 'hspan' ? { type: 'rect', xref: 'domain', x0: 0, x1: 1, y0: args.values[0], y1: args.values[1], fillcolor: fill, line: { width: 0 }, layer: 'below', ...sl } : { type: 'rect', yref: 'domain', y0: 0, y1: 1, x0: args.values[0], x1: args.values[1], fillcolor: fill, line: { width: 0 }, layer: 'below', ...sl };
      } else {
        const slope = args.kind === 'identity' ? 1 : args.slope, b = args.kind === 'identity' ? 0 : args.intercept;
        if (slope == null) throw new Error('line necesita slope (e intercept).');
        const pts = fig.traces.filter(t => t.ax === a.name).flatMap(t => Array.isArray(t.trace.x) && Array.isArray(t.trace.y) ? extentOf(t.trace.x, t.trace.y) : []);
        if (!pts.length) throw new Error(`Dibuja primero los datos en «${a.name}»: la recta se extiende sobre su rango.`);
        let lo = Math.min(...pts.map(p => p[0])), hi = Math.max(...pts.map(p => p[0]));
        if (args.kind === 'identity') { lo = Math.min(lo, ...pts.map(p => p[1])); hi = Math.max(hi, ...pts.map(p => p[1])); }
        const pad = (hi - lo) * 0.04; lo -= pad; hi += pad;
        shape = { type: 'line', x0: lo, x1: hi, y0: b + slope * lo, y1: b + slope * hi, line, ...label };
      }
      const id = `r${fig.next++}`; fig.shapes.push({ id, ax: a.name, kind: args.kind, shape, secondary: args.y_axis === 'right' }); out.push(id);
    }
    return { ok: true, figure_id: fig.id, ids: out };
  });

  tool('plot_annotate', 'Texto en la figura (como ax.annotate / ax.text): coords "data" (coordenadas de los datos, con arrow para una flecha que apunta al punto), "axes" (0–1 dentro de los ejes) o "figure" (0–1 en toda la figura). En ejes de tipo map, x es la longitud e y la latitud: la nota queda fijada con un marcador y aparece también en el mapa de la app. Para señalar una fila (p. ej. una parcela atípica) sin copiar coordenadas: dataset + where (p. ej. "id == \'AGC_171\'") y x / y como nombres de columna. Con arrow, dx / dy son el desplazamiento del texto respecto al punto en píxeles (dx > 0 a la derecha, dy > 0 hacia abajo; usa ±40 o más para que la flecha se vea). "\\n" o <br> parten líneas.', {
    figure_id: common.figure_id, ax: z.string().optional(), text: z.string().min(1).max(200), x: z.union([z.number(), z.string()]), y: z.union([z.number(), z.string()]),
    dataset: z.string().optional(), where: z.string().max(300).optional(),
    coords: z.enum(['data', 'axes', 'figure']).default('data'), arrow: z.boolean().default(false), dx: z.number().min(-300).max(300).default(30), dy: z.number().min(-300).max(300).default(-30),
    font_size: z.number().min(7).max(24).default(11), color: z.string().optional(), align: z.enum(['left', 'center', 'right']).default('center'), bold: z.boolean().default(false), background: z.boolean().default(false),
  }, args => {
    const fig = figureOf(args.figure_id), a = args.coords === 'figure' ? null : axesOf(fig, args.ax);
    const color = args.color ? colorOf(args.color) : undefined, id = `a${fig.next++}`;
    let { x, y } = args;
    if (args.dataset) {
      const f = frame(args, null), X = f.get(typeof x === 'string' ? x : null, 'x'), Y = f.get(typeof y === 'string' ? y : null, 'y');
      if (!f.n) throw new Error(`Ninguna fila de ${args.dataset} cumple where «${args.where ?? ''}».`);
      if (X) x = sig(X[0]); if (Y) y = sig(Y[0]);
    }
    const label = args.text.replace(/\n/g, '<br>');
    // On a map, a note is pinned at x = longitude, y = latitude (and goes to the app's map with the figure).
    if (a?.type === 'map') {
      if (!isNum(Number(x)) || !isNum(Number(y)) || Math.abs(Number(x)) > 180 || Math.abs(Number(y)) > 90) throw new Error('En un mapa, x es la longitud e y la latitud (o pasa dataset + where con x "lon", y "lat").');
      const tid = addTrace(fig, a, { type: 'scattermap', mode: 'markers+text', lon: [Number(x)], lat: [Number(y)], text: [args.bold ? `<b>${label}</b>` : label], textposition: 'top right', textfont: { size: args.font_size, color: color ?? '#171717' }, marker: { size: 11, color: color ?? '#d7191c' }, showlegend: false, hoverinfo: 'text', name: 'nota' }, { kind: 'anotación', extent: [[Number(x), Number(y)]] });
      return { ok: true, figure_id: fig.id, id: tid, note: 'Nota fijada en el mapa (aparece también en el mapa de la app al mostrar la figura).' };
    }
    fig.annotations.push({ id, ax: a?.name ?? null, coords: args.coords, ann: { text: args.bold ? `<b>${label}</b>` : label, x, y, showarrow: args.arrow, ...(args.arrow ? { ax: args.dx, ay: args.dy, arrowhead: 2, arrowsize: 1, arrowwidth: 1.2, ...(color ? { arrowcolor: color } : {}) } : {}), font: { size: args.font_size, ...(color ? { color } : {}) }, align: args.align, ...(args.background ? { bgcolor: 'rgba(255,255,255,0.75)', borderpad: 3 } : {}) } });
    return { ok: true, figure_id: fig.id, id };
  });

  // ── Styling ──────────────────────────────────────────────────────────────────────────────────
  const axisSpec = z.object({
    label: z.string().max(80).optional(), scale: z.enum(['linear', 'log', 'category', 'date']).optional(), lim: z.array(z.number()).length(2).optional(),
    ticks: z.object({ values: z.array(z.union([z.number(), z.string()])).max(60), labels: z.array(z.string()).max(60).optional() }).optional(), tickformat: z.string().max(16).optional().describe('d3: ".0%", ",.0f", ".2f", "%b %Y" (fechas).'),
    tickangle: z.number().min(-90).max(90).optional(), order: z.array(z.union([z.string(), z.number()])).max(200).optional().describe('Orden de las categorías.'), grid: z.boolean().optional(), invert: z.boolean().optional(), zeroline: z.boolean().optional(), nticks: z.number().int().min(2).max(30).optional(),
  }).partial();
  tool('plot_axes', 'Formato de unos ejes (como ax.set_*): title (título de los ejes), x / y / y2 (segundo eje y) / z (3d): label, scale (linear, log, category, date), lim [mín, máx], ticks {values, labels}, tickformat, tickangle, order (categorías), grid, invert, zeroline. equal_aspect fija 1:1 (mapas en lon/lat, estimado contra registrado). En 3d: view {elev, azim} (grados, como ax.view_init) y aspect. En map: basemap, center {lon, lat}, zoom. En polar: direction, rotation, sector. ax "*" aplica a todos.', {
    figure_id: common.figure_id, ax: z.union([z.string(), z.array(z.string())]).optional(), title: z.string().max(100).optional(), x: axisSpec.optional(), y: axisSpec.optional(), y2: axisSpec.optional(), z: axisSpec.optional(),
    equal_aspect: z.boolean().optional(), view: z.object({ elev: z.number().min(-90).max(90).default(30), azim: z.number().min(-360).max(360).default(-60), dist: z.number().min(0.8).max(4).default(2) }).optional(), aspect: z.enum(['cube', 'data', 'auto']).optional(),
    basemap: z.enum(['auto', 'claro', 'oscuro', 'satelite', 'calles', 'ninguno']).optional(), center: z.object({ lon: z.number(), lat: z.number() }).optional(), zoom: z.number().min(1).max(18).optional(),
    direction: z.enum(['clockwise', 'counterclockwise']).optional(), rotation: z.number().min(-360).max(360).optional(), sector: z.array(z.number()).length(2).optional(),
    radial_angle: z.number().min(0).max(360).optional().describe('Polar: ángulo (grados) donde se dibuja el eje radial y sus etiquetas, para que no choquen con los datos ni las etiquetas angulares.'),
  }, args => {
    const fig = figureOf(args.figure_id);
    const list = args.ax === '*' ? fig.order.map(n => fig.axes[n]) : Array.isArray(args.ax) ? args.ax.map(n => axesOf(fig, n)) : [axesOf(fig, args.ax)];
    const warnings = [];
    for (const a of list) {
      if (args.title != null) a.title = args.title;
      for (const k of ['x', 'y', 'z']) if (args[k]) { a[k] = { ...a[k], ...args[k] }; if (args[k].scale === 'log' && args[k].lim?.some(v => v <= 0)) throw new Error(`lim en escala log debe ser positivo (${k}).`); }
      if (args.y2) a.y2 = { ...(a.y2 ?? {}), ...args.y2 };
      if (args.equal_aspect != null) a.equal = args.equal_aspect;
      if (args.view) a.view = args.view; if (args.aspect) a.aspect = args.aspect;
      if (args.basemap) a.map.basemap = args.basemap; if (args.center) a.map.center = args.center; if (args.zoom) a.map.zoom = args.zoom;
      if (args.direction || args.rotation != null || args.sector || args.radial_angle != null) a.polar = { ...(a.polar ?? {}), ...(args.direction ? { direction: args.direction } : {}), ...(args.rotation != null ? { rotation: args.rotation } : {}), ...(args.sector ? { sector: args.sector } : {}), ...(args.radial_angle != null ? { radial_angle: args.radial_angle } : {}) };
      if ((args.view || args.z) && a.type !== '3d') warnings.push(`«${a.name}» no es 3d: view y z no aplican.`);
      if ((args.basemap || args.center || args.zoom) && a.type !== 'map') warnings.push(`«${a.name}» no es un mapa: basemap/center/zoom no aplican.`);
    }
    return { ok: true, figure_id: fig.id, axes: list.map(a => a.name), ...(warnings.length ? { warnings } : {}) };
  });

  tool('plot_legend', `Leyendas (como ax.legend): cada ejes tiene su propia leyenda con sus series (se muestra sola si hay más de una serie con nombre). Sin ax cambia todas; con ax, solo la de esos ejes. position: top (encima de los ejes, por defecto; las entradas se acomodan en columnas dentro del ancho de sus ejes), bottom (debajo), right (a la derecha), upper right / upper left / lower right / lower left (dentro), best (en ejes xy, la esquina con menos puntos, como loc="best"). En ejes pie la leyenda lista las porciones. show false la oculta. title, font_size.`, {
    figure_id: common.figure_id, ax: z.string().optional(), show: z.union([z.boolean(), z.literal('auto')]).default(true), position: z.enum(LEGEND_POSITIONS).optional(), title: z.string().max(60).optional(),
    font_size: z.number().min(7).max(16).optional(),
  }, args => {
    const fig = figureOf(args.figure_id), next = { show: args.show, ...(args.position ? { position: args.position } : {}), ...(args.title != null ? { title: args.title } : {}), ...(args.font_size ? { font_size: args.font_size } : {}) };
    if (args.ax) { axesOf(fig, args.ax); fig.axesLegend[args.ax] = { ...(fig.axesLegend[args.ax] ?? {}), ...next }; } else { fig.legend = { ...fig.legend, ...next }; fig.axesLegend = {}; }
    return { ok: true, figure_id: fig.id, legend: args.ax ? { [args.ax]: fig.axesLegend[args.ax] } : fig.legend };
  });

  tool('plot_remove', 'Quita un artista (t…), referencia (r…) o anotación (a…) de la figura, o "last" para deshacer el último artista; para corregir antes de mostrarla otra vez.', {
    figure_id: common.figure_id, id: z.string(),
  }, args => {
    const fig = figureOf(args.figure_id);
    if (args.id === 'last') { const t = fig.traces.pop(); if (!t) throw new Error('La figura no tiene artistas.'); return { ok: true, removed: t.id }; }
    for (const list of ['traces', 'shapes', 'annotations']) { const i = fig[list].findIndex(x => x.id === args.id); if (i >= 0) { fig[list].splice(i, 1); return { ok: true, removed: args.id }; } }
    throw new Error(`No hay «${args.id}» en ${fig.id}. Artistas: ${fig.traces.map(t => t.id).join(', ')}; referencias: ${fig.shapes.map(s => s.id).join(', ') || 'ninguna'}; anotaciones: ${fig.annotations.map(s => s.id).join(', ') || 'ninguna'}.`);
  });

  tool('plot_update', 'Cambia el estilo de un artista ya dibujado (t…) sin quitarlo ni alterar el orden: nombre en la leyenda, color, opacidad, grosor y tipo de línea, tamaño de marcador, o lo oculta.', {
    figure_id: common.figure_id, id: z.string(), label: z.string().max(80).optional(), color: z.string().optional(), alpha: z.number().min(0.02).max(1).optional(),
    width: z.number().min(0.5).max(8).optional(), dash: z.enum(['solid', 'dash', 'dot', 'dashdot', 'longdash']).optional(), marker_size: z.number().min(2).max(30).optional(), visible: z.boolean().optional(), show_in_legend: z.boolean().optional(),
  }, args => {
    const fig = figureOf(args.figure_id), t = fig.traces.find(x => x.id === args.id);
    if (!t) throw new Error(`No hay un artista «${args.id}» en ${fig.id}. Artistas: ${fig.traces.map(x => `${x.id} (${x.info?.kind})`).join(', ')}.`);
    const tr = t.trace;
    if (args.label != null) tr.name = args.label;
    if (args.color) { const c = colorOf(args.color); if (tr.line) tr.line = { ...tr.line, color: c }; if (tr.marker && !Array.isArray(tr.marker.color)) tr.marker = { ...tr.marker, color: c }; if (tr.fillcolor) tr.fillcolor = withAlpha(c, 0.2); }
    if (args.alpha != null) tr.opacity = args.alpha;
    if (args.width != null && tr.line) tr.line = { ...tr.line, width: args.width };
    if (args.dash && tr.line) tr.line = { ...tr.line, dash: args.dash };
    if (args.marker_size != null && tr.marker) tr.marker = { ...tr.marker, size: args.marker_size };
    if (args.visible != null) tr.visible = args.visible;
    if (args.show_in_legend != null) tr.showlegend = args.show_in_legend;
    return { ok: true, figure_id: fig.id, updated: t.id };
  });

  tool('plot_withdraw', 'Retira del chat una figura que ya mostraste (por ejemplo un borrador que rehiciste en otra figura): todas sus versiones se pliegan en una línea. Para corregir la misma figura no hace falta: vuelve a llamar plot_show y la versión anterior se pliega sola.', {
    figure_id: z.string(), reason: z.string().max(120).optional(),
  }, args => { const fig = figureOf(args.figure_id); fig.withdrawn = true; return { ok: true, withdrawn: fig.id }; });

  tool('plot_inspect', 'Describe la figura actual (ejes, artistas, referencias, leyenda) sin mostrarla, para revisar antes de plot_show.', { figure_id: common.figure_id }, args => describeFigure(figureOf(args.figure_id)));

  tool('plot_guide', 'Recetas para gráficas de análisis con estas herramientas (series de tiempo, dispersión con ajuste, matriz de correlación, distribución por grupo, facetas, mapas coropléticos, autocorrelación espacial: diagrama de Moran, mapa LISA, variograma, correlograma, superficies interpoladas, 3D) y buenas prácticas. Léela si no sabes cómo armar una figura.', {
    topic: z.enum(['todo', 'basico', 'tiempo', 'relaciones', 'distribuciones', 'mapas', 'espacial', '3d', 'estilo']).default('todo'),
  }, args => args.topic === 'todo' ? Object.values(PLOT_GUIDE).join('\n\n') : PLOT_GUIDE[args.topic]);

  // ── The app's map ────────────────────────────────────────────────────────────────────────────
  tool('map_show_figure', 'Muestra en el mapa de la app, como capa temporal, lo que dibujaste en los ejes de tipo map de una figura (plot_show ya lo hace al mostrarla; úsalo para volver a ponerla o para mostrar un mapa sin repetir la figura). Cada capa temporal lleva un reloj de arena y el usuario la quita con un clic. Máximo 4 a la vez.', {
    screen_id: z.string(), figure_id: common.figure_id, ax: z.string().optional().describe('Ejes map (por defecto, todos los de la figura).'),
  }, async args => {
    const target = ctx.access.resolve(args.screen_id); if (target.error) throw new Error(target.error);
    const fig = figureOf(args.figure_id), names = args.ax ? [axesOf(fig, args.ax).name] : fig.order.filter(n => fig.axes[n].type === 'map');
    if (!names.length) throw new Error(`La figura ${fig.id} no tiene ejes de tipo map.`);
    const out = [];
    for (const n of names) {
      if (fig.axes[n].type !== 'map') throw new Error(`«${n}» no es un mapa.`);
      const layer = tempLayerOf(fig, n); if (!layer) { out.push(`«${n}» no tiene capas que mostrar (parcelas, malla, puntos, etiquetas o notas).`); continue; }
      const answer = await ctx.access.command(target.id, 'show_temp_layer', layer);
      out.push(answer.ok ? { layer: layer.id, title: layer.title, ...(answer.result?.shown === false ? { shown: false } : {}) } : `No se pudo: ${answer.error}`);
    }
    return { ok: true, on_app_map: out };
  });
  tool('map_clear_temp_layers', 'Quita del mapa de la app las capas temporales de Milli (todas, o una por id: <figure_id>-<ejes>).', {
    screen_id: z.string(), id: z.string().optional(),
  }, async args => {
    const target = ctx.access.resolve(args.screen_id); if (target.error) throw new Error(target.error);
    const answer = await ctx.access.command(target.id, 'clear_temp_layers', args.id ? { id: args.id } : {});
    if (!answer.ok) throw new Error(answer.error);
    return { ok: true, ...answer.result };
  });

  // ── Show ─────────────────────────────────────────────────────────────────────────────────────
  server.registerTool('plot_show', {
    description: 'Muestra la figura en el chat (como plt.show), dentro de tu respuesta, y te devuelve imágenes PNG de cómo quedó para que la revises. review "chat" (por defecto) la dibuja al ancho del chat (≈400 px): es lo que el usuario ve primero; en pantallas angostas los paneles se apilan en una columna. "large" la dibuja como al ampliarla (≈1000 px, paneles en su cuadrícula); "both" devuelve las dos. El resultado trae además "review": avisos automáticos (ejes sin etiqueta, ejes vacíos, sin título). Si la figura tiene ejes de tipo map, lo que dibujas en ellos (parcelas coloreadas, malla, puntos, etiquetas, notas de plot_annotate) también aparece en el mapa de la app como capa temporal, con su leyenda, y el mapa la encuadra. Si algo no se lee bien, corrige (plot_axes, plot_legend, plot_update, plot_remove) y vuelve a llamar plot_show: la versión anterior se pliega en el chat. Menciona la figura en tu respuesta final.',
    inputSchema: { figure_id: common.figure_id, caption: z.string().max(400).optional(), review: z.enum(['chat', 'large', 'both', 'none']).default('chat'),
      screen_id: z.string().optional().describe('Opcional: la pestaña de este chat o MCP (es la única donde se muestra).'),
      on_map: z.boolean().default(true).describe('Los ejes de tipo map también se muestran en el mapa de la app como capa temporal (con un reloj de arena; el usuario la quita con un clic).') },
  }, async args => {
    try {
      const fig = figureOf(args.figure_id);
      if (args.caption != null) fig.caption = args.caption;
      if (!fig.traces.length) throw new Error('La figura no tiene nada dibujado todavía.');
      compile(fig, { width: 400 }); compile(fig, { width: 1000 }); // fails here, with a message, if something can't be drawn
      fig.shown++;
      // The browser lays the figure out for each width it draws at (chat, enlarged, review image).
      const payload = { id: fig.id, version: fig.shown, title: fig.title, subtitle: fig.subtitle, caption: fig.caption, replaces: fig.replaces ?? null, state: JSON.parse(JSON.stringify(fig)) };
      const notes = [];
      for (const n of fig.order) {
        const a = fig.axes[n], arts = fig.traces.filter(t => t.ax === n);
        if (!arts.length) notes.push(`Los ejes «${n}» están vacíos.`);
        else if (a.type === 'xy' && !a.x.label && !a.y.label && !arts.every(t => t.info?.kind === 'heatmap')) notes.push(`«${n}» no tiene etiquetas de ejes (plot_axes x/y label, con unidades).`);
      }
      if (!fig.title) notes.push('La figura no tiene título (plot_figure title).');
      const images = [];
      // Where the figure is drawn: the chat's own tab, or the tab an outside agent names.
      let screen = ctx.access.defaultScreen;
      if (args.screen_id) { const r = ctx.access.resolve(args.screen_id); if (r.error) throw new Error(r.error); screen = r.id; }
      if (ctx.access.external) {
        if (screen) { const shown = await ctx.access.command(screen, 'show_figure', { figure: payload, agent: ctx.agentName ?? 'Agente externo' }); notes.push(shown.ok ? 'Figura mostrada en la pantalla elegida.' : `No se pudo mostrar en la pantalla: ${shown.error}`); }
        else notes.push('Sin screen_id: la figura existe pero nadie la ve; pasa screen_id (list_screens) para mostrarla y recibir su imagen.');
      }
      const widths = { chat: [['chat', 400]], large: [['large', 1000]], both: [['chat', 400], ['large', 1000]], none: [] }[args.review];
      if (widths.length && screen) for (const [kind, width] of widths) {
        const answer = await ctx.access.command(screen, 'render_figure', { figure: payload, width }, { timeout: 30_000 });
        if (answer.ok && typeof answer.result?.png === 'string') images.push({ kind, width, data: answer.result.png.replace(/^data:image\/png;base64,/, '') });
        else { notes.push(`Sin imagen de revisión: ${answer.error ?? answer.result?.error ?? 'la pantalla no la generó'}.`); break; }
      }
      // What the figure draws on a map is also drawn on the app's map, as a temporary layer.
      const onMap = [];
      if (args.on_map && screen) for (const n of fig.order.filter(n => fig.axes[n].type === 'map')) {
        const layer = tempLayerOf(fig, n); if (!layer) continue;
        const answer = await ctx.access.command(screen, 'show_temp_layer', layer);
        onMap.push(answer.ok ? (answer.result?.shown === false ? `«${layer.title}»: se mostrará en el mapa cuando el usuario vuelva a seguirte` : `«${layer.title}» en el mapa de la app (capa temporal)`) : `«${layer.title}»: no se pudo mostrar en el mapa (${answer.error})`);
      }
      const summary = { ok: true, shown_in_chat: !ctx.access.external, ...(ctx.access.external ? { shown_on_screen: !!screen } : {}), version: fig.shown, ...describeFigure(fig), ...(notes.length ? { review: notes } : {}), ...(onMap.length ? { on_app_map: onMap } : {}),
        images: images.length ? images.map((im, i) => `${i + 1}: ${im.kind === 'chat' ? `ancho del chat (${im.width} px, como la ve el usuario)` : `ampliada (${im.width} px)`}`) : 'no disponible' };
      return { content: [{ type: 'text', text: JSON.stringify(summary) }, ...images.map(im => ({ type: 'image', data: im.data, mimeType: 'image/png' }))], _meta: { 'agrocebada/figure': payload } };
    } catch (e) { return fail(e.message); }
  });
}
