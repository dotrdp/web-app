// Milli's figures, matplotlib style: a figure holds axes laid out on a grid (or a mosaic, like
// plt.subplot_mosaic), each axes of a kind (xy, 3d, map, polar, pie) with its own labels, scales,
// limits and ticks; artists (traces, reference lines, annotations) are added one call at a time and
// the figure is compiled to a Plotly spec when shown. Colours come from fixed palettes and
// matplotlib-named colormaps, so a figure looks the same in the chat, in light and dark themes,
// and in the PNG the model gets back.

// ── Colours ────────────────────────────────────────────────────────────────────────────────────
/** Categorical palette (series and groups, in order), readable on light and dark backgrounds. */
export const PALETTE = ['#2f7d4f', '#3b6ea8', '#d08b2c', '#b8493f', '#7a5ba6', '#4f9f97', '#8c6d46', '#c46a9e', '#7c8590', '#9aa83a'];
const NAMED = { verde: 0, green: 0, azul: 1, blue: 1, ambar: 2, ámbar: 2, naranja: 2, orange: 2, rojo: 3, red: 3, morado: 4, purple: 4, turquesa: 5, teal: 5, cafe: 6, café: 6, brown: 6, rosa: 7, pink: 7, gris: 8, gray: 8, grey: 8, oliva: 9, olive: 9 };
const CSS = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%deg]+\)|black|white|negro|blanco|transparent)$/i;
export function colorOf(name, index = 0) {
  if (name == null) return PALETTE[index % PALETTE.length];
  const s = String(name).trim(), low = s.toLowerCase();
  if (/^c\d$/i.test(s)) return PALETTE[Number(s.slice(1)) % PALETTE.length];
  if (low in NAMED) return PALETTE[NAMED[low]];
  if (low === 'negro') return '#1f2321'; if (low === 'blanco') return '#ffffff';
  if (CSS.test(s)) return s;
  throw new Error(`Color no reconocido: «${name}». Usa verde, azul, ambar, rojo, morado, turquesa, cafe, rosa, gris, oliva, C0–C9 o un hex (#2f7d4f).`);
}

const hex = s => s.split(' ');
/** matplotlib-named colormaps (sequential, diverging, perceptual); append _r to reverse. */
export const COLORMAPS = {
  viridis: hex('#440154 #472d7b #3b528b #2c728e #21918c #28ae80 #5ec962 #addc30 #fde725'),
  cividis: hex('#00224e #123570 #3b496c #575d6d #707173 #8a8779 #a69d75 #c4b56c #e4cf5b #fee838'),
  plasma: hex('#0d0887 #46039f #7201a8 #9c179e #bd3786 #d8576b #ed7953 #fb9f3a #fdca26 #f0f921'),
  inferno: hex('#000004 #1b0c41 #4a0c6b #781c6d #a52c60 #cf4446 #ed6925 #fb9b06 #f7d13d #fcffa4'),
  magma: hex('#000004 #180f3d #440f76 #721f81 #9e2f7f #cd4071 #f1605d #fd9668 #feca8d #fcfdbf'),
  turbo: hex('#30123b #4145ab #4675ed #39a2fc #1bcfd4 #24eca6 #61fc6c #a4fc3b #d1e834 #f3c63a #fe9b2d #f36315 #d93806 #b11901 #7a0403'),
  greens: hex('#f7fcf5 #e5f5e0 #c7e9c0 #a1d99b #74c476 #41ab5d #238b45 #006d2c #00441b'),
  blues: hex('#f7fbff #deebf7 #c6dbef #9ecae1 #6baed6 #4292c6 #2171b5 #08519c #08306b'),
  oranges: hex('#fff5eb #fee6ce #fdd0a2 #fdae6b #fd8d3c #f16913 #d94801 #a63603 #7f2704'),
  reds: hex('#fff5f0 #fee0d2 #fcbba1 #fc9272 #fb6a4a #ef3b2c #cb181d #a50f15 #67000d'),
  purples: hex('#fcfbfd #efedf5 #dadaeb #bcbddc #9e9ac8 #807dba #6a51a3 #54278f #3f007d'),
  greys: hex('#ffffff #f0f0f0 #d9d9d9 #bdbdbd #969696 #737373 #525252 #252525 #000000'),
  ylgn: hex('#ffffe5 #f7fcb9 #d9f0a3 #addd8e #78c679 #41ab5d #238443 #006837 #004529'),
  ylgnbu: hex('#ffffd9 #edf8b1 #c7e9b4 #7fcdbb #41b6c4 #1d91c0 #225ea8 #253494 #081d58'),
  ylorrd: hex('#ffffcc #ffeda0 #fed976 #feb24c #fd8d3c #fc4e2a #e31a1c #bd0026 #800026'),
  ylorbr: hex('#ffffe5 #fff7bc #fee391 #fec44f #fe9929 #ec7014 #cc4c02 #993404 #662506'),
  rdylgn: hex('#a50026 #d73027 #f46d43 #fdae61 #fee08b #ffffbf #d9ef8b #a6d96a #66bd63 #1a9850 #006837'),
  rdylbu: hex('#a50026 #d73027 #f46d43 #fdae61 #fee090 #ffffbf #e0f3f8 #abd9e9 #74add1 #4575b4 #313695'),
  rdbu: hex('#67001f #b2182b #d6604d #f4a582 #fddbc7 #f7f7f7 #d1e5f0 #92c5de #4393c3 #2166ac #053061'),
  brbg: hex('#543005 #8c510a #bf812d #dfc27d #f6e8c3 #f5f5f5 #c7eae5 #80cdc1 #35978f #01665e #003c30'),
  piyg: hex('#8e0152 #c51b7d #de77ae #f1b6da #fde0ef #f7f7f7 #e6f5d0 #b8e186 #7fbc41 #4d9221 #276419'),
  puor: hex('#7f3b08 #b35806 #e08214 #fdb863 #fee0b6 #f7f7f7 #d8daeb #b2abd2 #8073ac #542788 #2d004b'),
  spectral: hex('#9e0142 #d53e4f #f46d43 #fdae61 #fee08b #ffffbf #e6f598 #abdda4 #66c2a5 #3288bd #5e4fa2'),
  coolwarm: hex('#3b4cc0 #5977e3 #7b9ff9 #9ebeff #c0d4f5 #dddcdc #f2cbb7 #f7ac8e #ee8468 #d65244 #b40426'),
  terrain: hex('#333399 #1177dd #00b2b2 #33cc66 #99e07a #ffff99 #ccb87a #997755 #886655 #bbaaaa #ffffff'),
};
export const DIVERGING = new Set(['rdylgn', 'rdylbu', 'rdbu', 'brbg', 'piyg', 'puor', 'spectral', 'coolwarm']);
export function colorscale(name = 'viridis') {
  const low = String(name).toLowerCase().replace(/[\s-]/g, ''), reverse = low.endsWith('_r'), base = reverse ? low.slice(0, -2) : low;
  const stops = COLORMAPS[base];
  if (!stops) throw new Error(`Mapa de color desconocido: «${name}». Disponibles: ${Object.keys(COLORMAPS).join(', ')} (agrega _r para invertir).`);
  const list = reverse ? [...stops].reverse() : stops;
  return list.map((c, i) => [Math.round(i / (list.length - 1) * 1000) / 1000, c]);
}
/** The colour at t ∈ [0, 1] of a Plotly colorscale [[pos, '#rrggbb'], …], as hex. */
export function colorAt(scale, t) {
  const v = Math.min(1, Math.max(0, Number.isFinite(t) ? t : 0)), hexOf = c => { const m = /^#([0-9a-f]{6})$/i.exec(c); const n = m ? parseInt(m[1], 16) : 0x888888; return [n >> 16, (n >> 8) & 255, n & 255]; };
  let i = 1; while (i < scale.length - 1 && scale[i][0] < v) i++;
  const [p0, c0] = scale[i - 1], [p1, c1] = scale[i], f = p1 > p0 ? (v - p0) / (p1 - p0) : 0, a = hexOf(c0), b = hexOf(c1);
  return '#' + a.map((x, k) => Math.round(x + (b[k] - x) * f).toString(16).padStart(2, '0')).join('');
}

/** A map axes of a figure as a temporary layer for the app's map: parcels and cells with their
 *  colours, points, labels, the notes written on it, and its legend or colour scale. */
export function tempLayerOf(fig, axName) {
  const a = fig.axes[axName], traces = fig.traces.filter(t => t.ax === axName && t.trace.visible !== false);
  const layer = { id: `${fig.id}-${axName}`, title: a.title ?? fig.title ?? 'Mapa de Milli', figureId: fig.id, parcels: [], points: [], cells: [], labels: [], markers: [], legend: {} };
  const items = [], scaleColor = (tr, v, key) => { const lo = tr[`${key}min`], hi = tr[`${key}max`]; return colorAt(tr.colorscale ?? tr.marker?.colorscale, hi > lo ? (v - lo) / (hi - lo) : 0.5); };
  for (const { trace: tr, info } of traces) {
    const kind = info?.kind;
    if (tr.type === 'choroplethmap' && kind === 'parcelas') {
      const continuous = tr.zmin != null && tr.zmax != null && tr.colorscale?.length > 2;
      tr.locations.forEach((id, i) => layer.parcels.push([id, continuous ? scaleColor(tr, tr.z[i], 'z') : tr.colorscale[0][1]]));
      if (continuous) layer.legend.scale = { title: tr.colorbar?.title?.text ?? '', min: tr.zmin, max: tr.zmax, colors: tr.colorscale.map(c => c[1]) };
      else if (tr.name) items.push([tr.name, tr.colorscale[0][1]]);
    } else if (tr.type === 'choroplethmap' && kind === 'malla') {
      const f0 = tr.geojson.features[0]?.geometry.coordinates[0];
      if (f0) layer.cell = { dx: Math.abs(f0[1][0] - f0[0][0]), dy: Math.abs(f0[2][1] - f0[1][1]) };
      tr.geojson.features.forEach((f, i) => { const c = f.geometry.coordinates[0]; layer.cells.push([(c[0][0] + c[2][0]) / 2, (c[0][1] + c[2][1]) / 2, scaleColor(tr, tr.z[i], 'z')]); });
      layer.legend.scale = { title: tr.colorbar?.title?.text ?? '', min: tr.zmin, max: tr.zmax, colors: tr.colorscale.map(c => c[1]) };
      layer.opacity = tr.marker?.opacity ?? 0.72;
    } else if (tr.type === 'scattermap' && kind === 'puntos') {
      const m = tr.marker ?? {}, colors = Array.isArray(m.color) ? m.color : null;
      const lo = colors ? m.cmin ?? Math.min(...colors.filter(Number.isFinite)) : 0, hi = colors ? m.cmax ?? Math.max(...colors.filter(Number.isFinite)) : 1;
      tr.lon.forEach((lon, i) => layer.points.push([lon, tr.lat[i], colors ? colorAt(m.colorscale, hi > lo ? (colors[i] - lo) / (hi - lo) : 0.5) : m.color, Array.isArray(m.size) ? m.size[i] : m.size ?? 9]));
      if (colors) layer.legend.scale = { title: m.colorbar?.title?.text ?? '', min: lo, max: hi, colors: m.colorscale.map(c => c[1]) };
      else if (tr.name && tr.showlegend !== false) items.push([tr.name, m.color]);
    } else if (tr.type === 'scattermap' && kind === 'etiquetas') tr.lon.forEach((lon, i) => layer.labels.push([lon, tr.lat[i], String(tr.text[i] ?? '')]));
    else if (tr.type === 'scattermap' && kind === 'anotación') layer.markers.push([tr.lon[0], tr.lat[0], String(tr.text[0] ?? '').replace(/<br>/g, '\n').replace(/<[^>]+>/g, '')]);
  }
  if (items.length) layer.legend.items = items;
  for (const k of ['parcels', 'points', 'cells', 'labels', 'markers']) if (!layer[k].length) delete layer[k];
  if (!layer.legend.items && !layer.legend.scale) delete layer.legend;
  return layer.parcels || layer.points || layer.cells || layer.labels || layer.markers ? layer : null;
}

/** Colours that mean something in this domain, used when the model doesn't choose. */
export const LISA_COLORS = { HH: '#d7191c', LL: '#2c7bb6', HL: '#fdae61', LH: '#abd9e9', 'no significativo': '#d9d9d9' };

// ── Figures and axes ───────────────────────────────────────────────────────────────────────────
const AXES_NAME = /^[A-Za-z_][A-Za-z0-9_]{0,24}$/;
export const AXES_TYPES = ['xy', '3d', 'map', 'polar', 'pie'];

/** A new figure: a rows×cols grid (axes ax1…axN, row by row) or a mosaic of named axes where a
 *  repeated name spans cells, e.g. [["mapa","mapa"],["hist","disp"]]. */
export function newFigure(id, { title, subtitle, caption, rows = 1, cols = 1, mosaic, axes_types = {}, share_x = false, share_y = false, height, subplot_titles } = {}) {
  let grid = mosaic;
  if (grid) {
    if (!Array.isArray(grid) || !grid.length || !grid.every(r => Array.isArray(r) && r.length === grid[0].length)) throw new Error('mosaic debe ser una lista de filas del mismo largo, p. ej. [["a","a"],["b","c"]].');
  } else {
    if (rows * cols > 16) throw new Error('Máximo 16 ejes por figura.');
    grid = Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => `ax${r * cols + c + 1}`));
  }
  const axes = {}, order = [];
  grid.forEach((row, r) => row.forEach((name, c) => {
    if (name == null || name === '.' || name === '') return;
    if (!AXES_NAME.test(name)) throw new Error(`Nombre de ejes no válido: «${name}».`);
    if (!axes[name]) { axes[name] = { name, cell: { r0: r, c0: c, r1: r, c1: c } }; order.push(name); }
    else { const k = axes[name].cell; k.r0 = Math.min(k.r0, r); k.c0 = Math.min(k.c0, c); k.r1 = Math.max(k.r1, r); k.c1 = Math.max(k.c1, c); }
  }));
  for (const a of Object.values(axes)) for (let r = a.cell.r0; r <= a.cell.r1; r++) for (let c = a.cell.c0; c <= a.cell.c1; c++)
    if (grid[r][c] !== a.name) throw new Error(`En mosaic, «${a.name}» debe formar un rectángulo.`);
  if (order.length > 16) throw new Error('Máximo 16 ejes por figura.');
  const types = Array.isArray(axes_types) ? Object.fromEntries(order.map((n, i) => [n, axes_types[i] ?? 'xy'])) : axes_types;
  for (const name of order) {
    const type = types[name] ?? 'xy';
    if (!AXES_TYPES.includes(type)) throw new Error(`Tipo de ejes desconocido: «${type}». Tipos: ${AXES_TYPES.join(', ')}.`);
    Object.assign(axes[name], { type, title: subplot_titles?.[order.indexOf(name)] ?? null, x: {}, y: {}, y2: null, z: {}, map: { basemap: 'auto' }, view: null });
  }
  for (const n of Object.keys(types)) if (!axes[n]) throw new Error(`axes_types menciona «${n}», que no está en la figura. Ejes: ${order.join(', ')}.`);
  return { id, title: title ?? null, subtitle: subtitle ?? null, caption: caption ?? null, rows: grid.length, cols: grid[0].length, axes, order,
    share: { x: !!share_x, y: !!share_y }, height: height ?? null, traces: [], shapes: [], annotations: [], legend: { show: 'auto', position: 'top', title: null }, axesLegend: {}, barmode: null, next: 1, shown: 0 };
}

export function axesOf(fig, name) {
  const key = name ?? fig.order[0];
  const a = fig.axes[key];
  if (!a) throw new Error(`La figura ${fig.id} no tiene ejes «${name}». Ejes: ${fig.order.map(n => `${n} (${fig.axes[n].type})`).join(', ')}.`);
  return a;
}

/** Add an artist; returns its id. */
export function addTrace(fig, ax, trace, info) {
  const id = `t${fig.next++}`;
  fig.traces.push({ id, ax: ax.name, trace, info });
  return id;
}

// ── Compile to Plotly ──────────────────────────────────────────────────────────────────────────
const round3 = v => Math.round(v * 1000) / 1000;

function axisLayout(spec = {}, { kind = 'x' } = {}) {
  const out = {};
  if (spec.label != null) out.title = { text: spec.label };
  if (spec.scale === 'log') out.type = 'log';
  else if (spec.scale === 'category') out.type = 'category';
  else if (spec.scale === 'date') out.type = 'date';
  else if (spec.scale === 'linear') out.type = 'linear';
  if (spec.lim) { const [lo, hi] = spec.lim; out.range = spec.scale === 'log' ? [Math.log10(lo), Math.log10(hi)] : [lo, hi]; out.autorange = false; }
  if (spec.invert) out.autorange = 'reversed';
  if (spec.ticks) { out.tickvals = spec.ticks.values; if (spec.ticks.labels) out.ticktext = spec.ticks.labels; }
  if (spec.tickformat) out.tickformat = spec.tickformat;
  if (spec.tickangle != null) out.tickangle = spec.tickangle;
  if (spec.order) { out.categoryorder = 'array'; out.categoryarray = spec.order; }
  if (spec.grid != null) out.showgrid = spec.grid;
  if (spec.zeroline != null) out.zeroline = spec.zeroline;
  if (spec.nticks) out.nticks = spec.nticks;
  if (spec.side) out.side = spec.side;
  void kind;
  return out;
}

/** Map centre and zoom that frame these lon/lat points in a box about widthPx wide. */
export function frameMap(lons, lats, widthPx = 420, heightPx = 300) {
  const lo = lons.filter(Number.isFinite), la = lats.filter(Number.isFinite);
  if (!lo.length) return { center: { lon: -98.3, lat: 19.8 }, zoom: 7 };
  const w = Math.min(...lo), e = Math.max(...lo), s = Math.min(...la), n = Math.max(...la);
  const merc = lat => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
  // MapLibre (Plotly's map subplots) uses 512-pixel tiles: the world is 512·2^zoom pixels wide.
  const zx = Math.log2(360 * widthPx / 512 / Math.max(e - w, 0.002)), zy = Math.log2(2 * Math.PI * heightPx / 512 / Math.max(merc(n) - merc(s), 0.00004));
  return { center: { lon: (w + e) / 2, lat: (s + n) / 2 }, zoom: Math.max(1, Math.min(16, Math.min(zx, zy) - 0.5)) };
}


// ── Layout engine ──────────────────────────────────────────────────────────────────────────────
// Like matplotlib's constrained layout: rows are laid out in pixels so subplot titles, per-axes
// legends and x-axis labels get the room they need, then converted to Plotly's paper fractions.
// The browser compiles each figure for the width it draws at (this module is shared).
const CHAT_WIDTH = 400;
const ROW_PX = { xy: 240, map: 300, '3d': 320, polar: 260, pie: 230 };
const MARGIN = { l: 56, r: 20, t: 10, b: 8 };
export const LEGEND_POSITIONS = ['top', 'bottom', 'right', 'upper right', 'upper left', 'lower right', 'lower left', 'best'];

const legendItems = traces => { const seen = new Set(), out = []; for (const t of traces) { const tr = t.trace; const names = tr.type === 'pie' ? tr.labels ?? [] : [tr.name]; if (tr.showlegend === false) continue; for (const n of names) { if (!n || seen.has(n)) continue; seen.add(n); out.push(n); } } return out; };
/** Entries of a horizontal legend packed into rows that fit widthPx. Plotly only wraps a legend at
 *  the figure's right edge, so each row becomes its own legend (side-by-side panels stay apart). */
function legendRows(items, widthPx, title) {
  // An entry: symbol and gaps (≈56 px) + text (≈7 px per character at 10.5 px, digits and capitals
  // included). Erring wide costs a little space; erring narrow lets Plotly wrap over the title.
  const rows = [[]]; let x = title ? String(title).length * 7 + 12 : 0;
  for (const it of items) { const w = String(it).replace(/<[^>]+>/g, '').length * 7 + 56; if (rows.at(-1).length && x + w > widthPx) { rows.push([]); x = 0; } rows.at(-1).push(it); x += w; }
  return { rows, px: rows.length * 19 + 4 };
}
/** Break a title into lines that fit widthPx (bold 12 px ≈ 7 px per character). */
export function wrapText(text, widthPx, charPx = 7) {
  const max = Math.max(12, Math.floor(widthPx / charPx)), words = String(text).split(/\s+/), lines = [];
  for (const w of words) { const last = lines.at(-1); if (last != null && (last + ' ' + w).length <= max) lines[lines.length - 1] = `${last} ${w}`; else lines.push(w); }
  return lines;
}
/** matplotlib's loc="best" for xy axes: the corner with the fewest data points. */
function bestCorner(traces, a) {
  const pts = []; for (const t of traces) { const x = t.trace.x, y = t.trace.y; if (Array.isArray(x) && Array.isArray(y)) x.forEach((v, i) => { if (Number.isFinite(v) && Number.isFinite(y[i])) pts.push([v, y[i]]); }); }
  if (!pts.length) return 'upper right';
  const [x0, x1] = a.x.lim ?? [Math.min(...pts.map(p => p[0])), Math.max(...pts.map(p => p[0]))], [y0, y1] = a.y.lim ?? [Math.min(...pts.map(p => p[1])), Math.max(...pts.map(p => p[1]))];
  const fx = v => (v - x0) / ((x1 - x0) || 1), fy = v => (v - y0) / ((y1 - y0) || 1);
  const corners = { 'upper right': p => fx(p[0]) > 0.6 && fy(p[1]) > 0.6, 'upper left': p => fx(p[0]) < 0.4 && fy(p[1]) > 0.6, 'lower right': p => fx(p[0]) > 0.6 && fy(p[1]) < 0.4, 'lower left': p => fx(p[0]) < 0.4 && fy(p[1]) < 0.4 };
  return Object.entries(corners).map(([k, f]) => [k, pts.filter(f).length]).sort((a2, b2) => a2[1] - b2[1])[0][0];
}

/** Narrow screens (the docked chat, a phone): panels stack in one column, in reading order, like a
 *  responsive layout; small multiples keep two columns. The figure itself is unchanged. */
export function reflow(fig, width) {
  if (width >= 560 || fig.cols === 1) return fig;
  const facets = fig.order.every(n => fig.axes[n].facet);
  if (facets && fig.cols <= 2) return fig;
  const cols = facets ? 2 : 1, axes = {};
  fig.order.forEach((n, i) => { const r = Math.floor(i / cols), c = i % cols; axes[n] = { ...fig.axes[n], cell: { r0: r, c0: c, r1: r, c1: c } }; });
  return { ...fig, axes, rows: Math.ceil(fig.order.length / cols), cols, heightRatios: null, widthRatios: null, height: null };
}

/** The figure as a Plotly spec { data, layout, height } for a drawing `width` pixels wide. The chat,
 *  the enlarged view and the model's review image each compile it for their own width. */
export function compile(input, { width = CHAT_WIDTH } = {}) {
  const fig = reflow(input, width);
  const layout = { showlegend: true, hovermode: 'closest', separators: '.,', barmode: fig.barmode ?? 'group', bargap: 0.18, bargroupgap: 0.06 };
  const axes = fig.order.map(n => fig.axes[n]), byAx = n => fig.traces.filter(t => t.ax === n);
  // Long category labels on the left of a panel (municipalities on horizontal bars, heatmap rows)
  // get room inside that panel's own space, so the other panels (a map above) keep their width.
  const ML = MARGIN.l;
  const labelPad = a => {
    if (a.type !== 'xy') return 0;
    const labels = byAx(a.name).flatMap(t => (t.trace.orientation === 'h' || t.trace.type === 'heatmap') && Array.isArray(t.trace.y) ? t.trace.y : []).concat(a.y.order ?? []);
    const longest = Math.max(0, ...labels.filter(v => typeof v === 'string').map(v => v.length));
    return longest ? Math.max(0, Math.min(width * 0.42, longest * 6.3 + 22 + (a.y.label ? 18 : 0)) - ML) : 0;
  };
  // Legends: one per axes that has something to tell apart; small multiples share one for the figure (like FacetGrid).
  const legends = {}, facets = axes.length > 1 && axes.every(a => a.facet);
  let figLegend = null;
  if (facets) {
    const items = legendItems(fig.traces), spec = { show: 'auto', title: null, ...fig.legend };
    if (items.length && (spec.show === 'auto' ? items.length > 1 : !!spec.show)) figLegend = { items, title: spec.title, fontSize: spec.font_size };
  } else axes.forEach(a => {
    const spec = { show: 'auto', position: 'top', title: null, ...fig.legend, ...(fig.axesLegend?.[a.name] ?? {}) }, items = legendItems(byAx(a.name));
    const show = items.length > 0 && (spec.show === 'auto' ? items.length > 1 : !!spec.show);
    const position = spec.position === 'best' ? (a.type === 'xy' ? bestCorner(byAx(a.name), a) : 'upper right') : spec.position;
    if (show) legends[a.name] = { items, position, title: spec.title, fontSize: spec.font_size };
  });
  const hasBar = a => byAx(a.name).some(t => t.trace.marker?.showscale || t.trace.showscale);
  const hasY2 = a => a.type === 'xy' && (byAx(a.name).some(t => t.info?.secondary) || !!a.y2);
  // Columns (fractions): wider gaps where a colour bar, second y axis or side legend needs room.
  const gapAfter = c => { if (c >= fig.cols - 1) return 0; const left = axes.filter(a => a.cell.c1 === c); return 0.09 + (left.some(hasBar) ? 0.1 : 0) + (left.some(hasY2) ? 0.08 : 0) + (left.some(a => legends[a.name]?.position === 'right') ? 0.22 : 0); };
  const gaps = Array.from({ length: fig.cols }, (_, c) => gapAfter(c)), free = 1 - gaps.reduce((t, g) => t + g, 0);
  const wr = fig.widthRatios?.length === fig.cols ? fig.widthRatios : Array(fig.cols).fill(1), wsum = wr.reduce((t, v) => t + v, 0), colW = c => free * wr[c] / wsum;
  const colX = c => Array.from({ length: c }, (_, k) => colW(k) + gaps[k]).reduce((t, v) => t + v, 0);
  const xDom = a => [colX(a.cell.c0) + labelPad(a) / (width - ML - MARGIN.r), colX(a.cell.c1) + colW(a.cell.c1)].map(round3);
  const widthPx = a => (width - ML - MARGIN.r) * (xDom(a)[1] - xDom(a)[0]);
  // Rows (pixels): headroom above (title, legend) and room below (tick labels, x title, legend).
  const lg = a => legends[a.name], lgRows = a => legendRows(lg(a).items, widthPx(a), lg(a).title), lgPx = a => lg(a) && ['top', 'bottom'].includes(lg(a).position) ? lgRows(a).px : 0;
  const figLegendRows = figLegend ? legendRows(figLegend.items, width - ML - MARGIN.r, figLegend.title) : null;
  const titleLines = a => a.title ? wrapText(a.title, widthPx(a)) : [];
  // Reference labels at the top of a line or span stick out above the axes.
  const topLabels = a => fig.shapes.some(sh => sh.ax === a.name && sh.shape.label?.text && (sh.kind === 'vline' || sh.kind === 'vspan' || sh.kind === 'hspan'));
  const above = a => titleLines(a).length * 16 + (a.title ? 6 : 0) + (lg(a)?.position === 'top' ? lgPx(a) + 2 : 0) + (a.type === 'polar' ? 18 : 0) + (topLabels(a) ? 14 : 0);
  // Shared axes keep tick labels and titles only on the outer panels (matplotlib's label_outer).
  const innerX = a => fig.share.x && a.type === 'xy' && axes.some(o => o !== a && o.type === 'xy' && o.cell.r0 > a.cell.r1 && o.cell.c0 <= a.cell.c1 && o.cell.c1 >= a.cell.c0);
  const innerY = a => fig.share.y && a.type === 'xy' && axes.some(o => o !== a && o.type === 'xy' && o.cell.c1 < a.cell.c0 && o.cell.r0 <= a.cell.r1 && o.cell.r1 >= a.cell.r0);
  const below = a => (a.type === 'xy' ? (innerX(a) ? 8 : (a.x.label ? 46 : 28) + (a.x.tickangle ? 24 : 0)) : a.type === 'polar' ? 24 : 6) + (lg(a)?.position === 'bottom' ? lgPx(a) + 4 : 0);
  const rows = Array.from({ length: fig.rows }, (_, r) => {
    const own = axes.filter(a => a.cell.r0 === r && a.cell.r1 === r), any = axes.filter(a => a.cell.r0 <= r && a.cell.r1 >= r);
    return { base: own.length ? Math.max(...own.map(a => ROW_PX[a.type] ?? 240)) : Math.max(160, ...any.map(a => (ROW_PX[a.type] ?? 240) / (a.cell.r1 - a.cell.r0 + 1))),
      above: Math.max(0, ...axes.filter(a => a.cell.r0 === r).map(above)), below: Math.max(0, ...axes.filter(a => a.cell.r1 === r).map(below)) };
  });
  const fixed = rows.reduce((t, r) => t + r.above + r.below, 0) + MARGIN.t + MARGIN.b;
  if (fig.heightRatios?.length === fig.rows) { const unit = rows.reduce((t, r) => t + r.base, 0) / fig.heightRatios.reduce((t, v) => t + v, 0); rows.forEach((r, i) => { r.base = unit * fig.heightRatios[i]; }); }
  if (fig.height) { const want = Math.max(100 * fig.rows, fig.height - fixed), have = rows.reduce((t, r) => t + r.base, 0); rows.forEach(r => { r.base = r.base * want / have; }); }
  let height = Math.round(fixed + rows.reduce((t, r) => t + r.base, 0));
  if (figLegendRows) height += figLegendRows.px + 4;
  const marginT = MARGIN.t + rows[0].above + (figLegendRows ? figLegendRows.px + 4 : 0), marginB = MARGIN.b + rows.at(-1).below, paperH = height - marginT - marginB;
  const tops = []; let y = 0; rows.forEach((r, i) => { if (i) y += rows[i - 1].below + r.above; tops.push(y); y += r.base; });
  const yDom = a => [1 - (tops[a.cell.r1] + rows[a.cell.r1].base) / paperH, 1 - tops[a.cell.r0] / paperH].map(v => round3(Math.min(1, Math.max(0, v))));
  const lastCol = axes.filter(a => a.cell.c1 === fig.cols - 1);
  layout.margin = { l: ML, r: MARGIN.r + (lastCol.some(hasBar) ? 62 : 0) + (lastCol.some(hasY2) ? 46 : 0) + (lastCol.some(a => lg(a)?.position === 'right') ? 120 : 0), t: marginT, b: marginB };
  for (const n of fig.annotations) if (n.coords === 'figure') {
    const yv = Number(n.ann.y), lines = String(n.ann.text).split('<br>').length * 15;
    if (yv < 0) layout.margin.b += Math.ceil(-yv * paperH) + lines; else if (yv > 1) layout.margin.t += Math.ceil((yv - 1) * paperH) + lines;
  }
  layout.height = height = Math.round(height + (layout.margin.t - marginT) + (layout.margin.b - marginB));

  const data = [], refs = {}, annotations = [], shapes = [];
  let xy = 0, y2n = 0, scenes = 0, maps = 0, polars = 0, legendN = 0;
  const legendIds = {}; // axes → { name → legend id }
  const newLegend = (box) => { const id = ++legendN === 1 ? 'legend' : `legend${legendN}`; layout[id] = { itemsizing: 'constant', font: { size: 10.5 }, tracegroupgap: 2, ...box }; return id; };
  /** Horizontal rows stacked from `y0` (paper) upwards (top) or downwards (bottom); returns name → legend id. */
  const stackRows = (rowsOut, x0, y0, up, L) => { const map = {}; rowsOut.rows.forEach((row, i) => { const k = up ? rowsOut.rows.length - 1 - i : i; const id = newLegend({ orientation: 'h', x: x0, xanchor: 'left', y: y0 + (up ? 1 : -1) * k * 19 / paperH, yanchor: up ? 'bottom' : 'top', ...(i === 0 && L.title ? { title: { text: L.title, side: 'left' } } : {}), ...(L.fontSize ? { font: { size: L.fontSize } } : {}) }); for (const it of row) map[it] = id; }); return map; };
  if (figLegendRows) { const ids = stackRows(figLegendRows, 0, 1 + (rows[0].above + 3) / paperH, true, figLegend); for (const a of axes) legendIds[a.name] = ids; }
  const xyCount = axes.filter(a => a.type === 'xy').length;
  for (const a of axes) {
    const dom = { x: xDom(a), y: yDom(a) }, name = a.name;
    if (a.type === 'xy') {
      const k = ++xy, xs = k === 1 ? '' : String(k), xa = `xaxis${xs}`, ya = `yaxis${xs}`;
      layout[xa] = { domain: dom.x, anchor: `y${xs}`, ...axisLayout(a.x) };
      layout[ya] = { domain: dom.y, anchor: `x${xs}`, ...axisLayout(a.y, { kind: 'y' }) };
      if (fig.share.x && k > 1) layout[xa].matches = 'x';
      if (fig.share.y && k > 1) layout[ya].matches = 'y';
      if (innerX(a)) { layout[xa].showticklabels = false; delete layout[xa].title; }
      if (innerY(a)) { layout[ya].showticklabels = false; delete layout[ya].title; }
      if (a.equal) { layout[ya].scaleanchor = `x${xs}`; layout[ya].scaleratio = 1; layout[ya].constrain = 'range'; layout[xa].constrain = 'range'; }
      const ref = { x: `x${xs}`, y: `y${xs}`, dom };
      if (hasY2(a)) { const n2 = xyCount + ++y2n; layout[`yaxis${n2}`] = { overlaying: `y${xs}`, side: 'right', anchor: `x${xs}`, showgrid: false, ...(a.y2?.ticks || a.y2?.lim ? {} : { tickmode: 'sync' }), ...axisLayout(a.y2 ?? {}, { kind: 'y' }) }; ref.y2 = `y${n2}`; }
      refs[name] = ref;
    } else if (a.type === '3d') {
      const k = ++scenes, sname = k === 1 ? 'scene' : `scene${k}`;
      layout[sname] = { domain: dom, xaxis: axisLayout(a.x), yaxis: axisLayout(a.y), zaxis: axisLayout(a.z), aspectmode: a.aspect ?? 'cube' };
      { const { elev = 22, azim = -55, dist = 2.35 } = a.view ?? {}, e = elev * Math.PI / 180, z = azim * Math.PI / 180; layout[sname].camera = { eye: { x: round3(dist * Math.cos(e) * Math.cos(z)), y: round3(dist * Math.cos(e) * Math.sin(z)), z: round3(dist * Math.sin(e)) } }; }
      refs[name] = { scene: sname, dom };
    } else if (a.type === 'map') {
      const k = ++maps, m = k === 1 ? 'map' : `map${k}`, pts = byAx(name).flatMap(t => t.info?.extent ?? []);
      const framed = frameMap(pts.map(p => p[0]), pts.map(p => p[1]), widthPx(a) * 1.15, (rows[a.cell.r0].base) * (a.cell.r1 - a.cell.r0 + 1));
      layout[m] = { domain: dom, center: a.map.center ?? framed.center, zoom: a.map.zoom ?? framed.zoom, style: a.map.basemap ?? 'auto' };
      refs[name] = { subplot: m, dom, zoom: layout[m].zoom, lat: layout[m].center.lat };
    } else if (a.type === 'polar') {
      const k = ++polars, pn = k === 1 ? 'polar' : `polar${k}`;
      const ang = axisLayout(a.x); delete ang.title; delete ang.range; delete ang.autorange;
      layout[pn] = { domain: dom, radialaxis: { angle: a.polar?.radial_angle ?? 90, tickangle: a.polar?.radial_angle ?? 90, ...axisLayout(a.y) }, angularaxis: { direction: a.polar?.direction ?? 'clockwise', rotation: a.polar?.rotation ?? 90, ...ang } };
      if (a.polar?.sector) layout[pn].sector = a.polar.sector;
      refs[name] = { subplot: pn, dom };
    } else refs[name] = { dom };
    // Per-axes legend, placed around (or inside) its axes.
    const L = legends[name];
    if (L) {
      const px = 1 / paperH, inside = /^(upper|lower) /.test(L.position);
      if (L.position === 'top' && a.type !== 'pie') legendIds[name] = stackRows(lgRows(a), dom.x[0], dom.y[1] + 3 * px, true, L);
      else if (L.position === 'bottom' && a.type !== 'pie') legendIds[name] = stackRows(lgRows(a), dom.x[0], dom.y[0] - (below(a) - lgPx(a) - 2) * px, false, L);
      else {
        const pos = L.position === 'top' ? { orientation: 'h', x: dom.x[0], xanchor: 'left', y: dom.y[1] + 3 * px, yanchor: 'bottom' }
          : L.position === 'bottom' ? { orientation: 'h', x: dom.x[0], xanchor: 'left', y: dom.y[0] - (below(a) - lgPx(a) - 2) * px, yanchor: 'top' }
          : L.position === 'right' ? { orientation: 'v', x: dom.x[1] + (hasBar(a) ? 0.12 : 0.02), xanchor: 'left', y: dom.y[1], yanchor: 'top' }
          : { orientation: 'v', x: L.position.endsWith('right') ? dom.x[1] - 0.01 : dom.x[0] + 0.01, xanchor: L.position.endsWith('right') ? 'right' : 'left', y: L.position.startsWith('upper') ? dom.y[1] - 6 * px : dom.y[0] + 6 * px, yanchor: L.position.startsWith('upper') ? 'top' : 'bottom' };
        const id = newLegend({ ...pos, ...(L.title ? { title: { text: L.title, side: 'top' } } : {}), ...(L.fontSize ? { font: { size: L.fontSize } } : {}), ...(inside ? { bgcolor: 'rgba(250,250,248,0.78)', bordercolor: 'rgba(120,120,120,0.35)', borderwidth: 1 } : {}) });
        legendIds[name] = new Proxy({}, { get: () => id });
      }
    }
    if (a.title) annotations.push({ text: `<b>${titleLines(a).map(esc).join('<br>')}</b>`, x: (dom.x[0] + dom.x[1]) / 2, y: dom.y[1], xref: 'paper', yref: 'paper', xanchor: 'center', yanchor: 'bottom', yshift: 3 + (L?.position === 'top' ? lgPx(a) + 2 : 0) + (a.type === 'polar' ? 18 : 0) + (topLabels(a) ? 14 : 0), showarrow: false, font: { size: 12 } });
  }

  for (const t of fig.traces) {
    const a = fig.axes[t.ax], ref = refs[t.ax], tr = { ...t.trace, uid: t.id };
    // Parcels are about 300 m across: at a regional zoom draw them as points too, or they vanish.
    if (t.info?.autoPoints) { const mPerPx = 78271.52 * Math.cos(ref.lat * Math.PI / 180) / 2 ** ref.zoom; if (t.info.autoPoints / mPerPx >= 7) continue; }
    if (a.type === 'xy') { tr.xaxis = ref.x; tr.yaxis = t.info?.secondary ? ref.y2 : ref.y; }
    else if (a.type === '3d') tr.scene = ref.scene;
    else if (a.type === 'map' || a.type === 'polar') tr.subplot = ref.subplot;
    else if (a.type === 'pie') tr.domain = { x: ref.dom.x, y: ref.dom.y };
    const lid = legendIds[t.ax]?.[a.type === 'pie' ? (tr.labels?.[0] ?? '') : tr.name];
    if (lid && (a.type === 'pie' || tr.name)) { tr.legend = lid; if (a.type !== 'pie') tr.legendgroup = `${facets ? 'fig' : t.ax}:${tr.legendgroup ?? tr.name}`; } else tr.showlegend = false;
    // Heatmap cell values: smaller where cells are narrow, dropped where they can't be read (the chat is ~400 px wide).
    if (tr.type === 'heatmap' && tr.texttemplate && Array.isArray(tr.x)) {
      const cell = widthPx(a) / Math.max(1, tr.x.length), chars = tr.textchars ?? 5, size = Math.min(11, cell / (chars * 0.62));
      if (size < 6.5) { delete tr.texttemplate; delete tr.text; } else tr.textfont = { ...(tr.textfont ?? {}), size: Math.round(size * 10) / 10 };
    }
    delete tr.textchars;
    if (tr.marker?.showscale || tr.showscale) {
      const cb = { thickness: 10, len: Math.max(0.2, (ref.dom.y[1] - ref.dom.y[0]) * 0.92), y: (ref.dom.y[0] + ref.dom.y[1]) / 2, yanchor: 'middle', x: ref.dom.x[1] + (ref.y2 ? 0.1 : 0.015), xanchor: 'left', ...(tr.marker?.colorbar ?? tr.colorbar ?? {}) };
      if (tr.marker?.showscale) tr.marker = { ...tr.marker, colorbar: cb }; else tr.colorbar = cb;
    }
    data.push(tr);
  }
  // LISA classes read in their usual order (clusters first), whatever order they were drawn in.
  const LISA_RANK = { HH: 1, LL: 2, HL: 3, LH: 4, 'no significativo': 5 };
  for (const tr of data) if (tr.name in LISA_RANK) tr.legendrank = 900 + LISA_RANK[tr.name];
  // One legend entry per name within a legend; the others follow it (same legendgroup).
  const seen = new Set();
  for (const tr of data) { if (!tr.legend || tr.showlegend === false || !tr.name) continue; const k = `${tr.legend}:${tr.name}`; if (seen.has(k)) tr.showlegend = false; else seen.add(k); }
  layout.showlegend = legendN > 0;
  for (const s of fig.shapes) {
    const a = fig.axes[s.ax], ref = refs[s.ax]; if (a.type !== 'xy') continue;
    const sh = { ...s.shape }, yr = s.secondary ? ref.y2 : ref.y;
    sh.xref = sh.xref === 'domain' ? `${ref.x} domain` : ref.x; sh.yref = sh.yref === 'domain' ? `${yr} domain` : yr;
    shapes.push(sh);
  }
  for (const n of fig.annotations) {
    const ann = { showarrow: false, ...n.ann };
    if (n.coords === 'figure') { ann.xref = 'paper'; ann.yref = 'paper'; }
    else if (n.ax) {
      const a = fig.axes[n.ax], ref = refs[n.ax];
      if (a.type === 'xy') { ann.xref = n.coords === 'axes' ? `${ref.x} domain` : ref.x; ann.yref = n.coords === 'axes' ? `${ref.y} domain` : ref.y; }
      else { ann.xref = 'paper'; ann.yref = 'paper'; ann.x = ref.dom.x[0] + (ref.dom.x[1] - ref.dom.x[0]) * (Number(ann.x) || 0.5); ann.y = ref.dom.y[0] + (ref.dom.y[1] - ref.dom.y[0]) * (Number(ann.y) || 0.5); }
    }
    annotations.push(ann);
  }
  if (fig.boxmode) layout.boxmode = fig.boxmode;
  if (fig.violinmode) layout.violinmode = fig.violinmode;
  if (annotations.length) layout.annotations = annotations;
  if (shapes.length) layout.shapes = shapes;
  return { data, layout, height };
}

const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

/** What the model gets back about a figure: its axes, artists and anything worth fixing. */
export function describeFigure(fig) {
  return {
    figure_id: fig.id, title: fig.title, layout: { rows: fig.rows, cols: fig.cols },
    axes: fig.order.map(n => { const a = fig.axes[n]; return { name: n, type: a.type, ...(a.title ? { title: a.title } : {}), ...(a.x.label ? { x_label: a.x.label } : {}), ...(a.y.label ? { y_label: a.y.label } : {}), ...(a.y2?.label ? { y2_label: a.y2.label } : {}), ...(a.type === '3d' && a.z.label ? { z_label: a.z.label } : {}), artists: fig.traces.filter(t => t.ax === n).map(t => `${t.id}: ${t.info?.kind}${t.trace.name ? ` «${t.trace.name}»` : ''}`) }; }),
    references: fig.shapes.map(s => `${s.id}: ${s.kind} en ${s.ax}`), annotations: fig.annotations.length, legend: { ...fig.legend, ...(fig.axesLegend && Object.keys(fig.axesLegend).length ? { por_ejes: fig.axesLegend } : {}) }, shown: fig.shown,
  };
}
