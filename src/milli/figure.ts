// Draws the figures Milli builds with its plot_* tools. The server sends the figure itself (axes,
// artists, references); here it is laid out for the width it is drawn at with the same layout engine
// the server uses (narrow: panels stack), given the app's look (fonts, text and grid colours from
// the theme tokens, light or dark basemap, Spanish dates), and drawn into the chat, the enlarged
// dialog, or an offscreen PNG that goes back to the model so it can check what the user sees.
// Plotly loads only when the first figure appears.
// @ts-expect-error Shared ES module without type declarations.
import { compile as compileFigure } from '../../server/milli/analysis/figure.mjs';
type PlotlyModule = {
  react: (el: HTMLElement, data: unknown[], layout: object, config?: object) => Promise<unknown>;
  newPlot: (el: HTMLElement, data: unknown[], layout: object, config?: object) => Promise<unknown>;
  purge: (el: HTMLElement) => void;
  toImage: (fig: HTMLElement | { data: unknown[]; layout: object; config?: object }, opts: { format: 'png' | 'svg'; width: number; height: number; scale?: number }) => Promise<string>;
  Plots: { resize: (el: HTMLElement) => void };
  register: (module: object) => void;
};
export type FigurePayload = { id: string; version: number; title: string | null; subtitle: string | null; caption: string | null; replaces?: string | null; state: unknown };
type Compiled = { data: Record<string, unknown>[]; layout: Record<string, unknown>; height: number };
/** The figure laid out for a drawing `width` pixels wide. */
export function compileAt(fig: FigurePayload, width: number): Compiled {
  if (fig.state) return compileFigure(fig.state, { width: Math.round(width) }) as Compiled;
  // A figure compiled by an older server (data and layout already laid out): draw it as it is.
  const old = fig as unknown as Partial<Compiled>;
  if (old.data && old.layout) return { data: old.data, layout: old.layout, height: old.height ?? (old.layout.height as number) ?? 320 };
  throw new Error('Esta figura viene de una versión anterior del servidor; reinícialo para verla.');
}

// Spanish month and day names for date axes and hover labels.
const ES_LOCALE = { moduleType: 'locale', name: 'es', dictionary: {}, format: {
  days: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'], shortDays: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  shortMonths: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'], date: '%d/%m/%Y', decimal: '.', thousands: ',' } };
// Which figures are folded in the chat: newer versions, figures that replace a draft, withdrawals.
const folds = new Map<string, { latest: number; reason?: string }>(), foldListeners = new Set<() => void>();
let foldVersion = 0;
export function noteFigure(event: { shown?: FigurePayload; withdrawn?: string }) {
  if (event.shown) { const f = event.shown, cur = folds.get(f.id); folds.set(f.id, { ...cur, latest: Math.max(cur?.latest ?? 0, f.version) }); if (f.replaces) folds.set(f.replaces, { latest: folds.get(f.replaces)?.latest ?? 1, reason: 'Milli la rehízo abajo' }); }
  if (event.withdrawn) folds.set(event.withdrawn, { latest: folds.get(event.withdrawn)?.latest ?? 1, reason: 'Milli la retiró' });
  foldVersion++; foldListeners.forEach(l => l());
}
export const subscribeFolds = (l: () => void) => { foldListeners.add(l); return () => { foldListeners.delete(l); }; };
export const getFoldVersion = () => foldVersion;
/** Why this version is folded, or null when it is the current one. */
export const foldOf = (f: FigurePayload) => { const s = folds.get(f.id); return s?.reason ?? (s && s.latest > f.version ? 'Milli la corrigió abajo' : null); };

let plotly: Promise<PlotlyModule> | null = null;
export const loadPlotly = () => (plotly ??= import('plotly.js-dist-min').then(m => { const P = (m.default ?? m) as unknown as PlotlyModule; P.register(ES_LOCALE); return P; }));

/** A CSS colour (oklch, color-mix, var()) as rgb(), which Plotly understands. */
function resolveColor(css: string, probe: HTMLElement, ctx: CanvasRenderingContext2D) {
  probe.style.color = css;
  ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#000'; ctx.fillStyle = getComputedStyle(probe).color; ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return a === 255 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${(a / 255).toFixed(3)})`;
}
export type FigureTheme = { dark: boolean; fg: string; muted: string; grid: string; line: string; bg: string; popover: string; font: string };
export function readTheme(root: HTMLElement = document.documentElement): FigureTheme {
  const probe = document.createElement('span'); probe.style.display = 'none'; root.appendChild(probe);
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const c = (v: string) => resolveColor(v, probe, ctx);
  const theme = { dark: document.documentElement.classList.contains('dark'), fg: c('var(--foreground)'), muted: c('var(--muted-foreground)'), grid: c('color-mix(in oklch, var(--border) 55%, transparent)'), line: c('var(--border)'), bg: c('var(--tile)'), popover: c('var(--popover)'), font: getComputedStyle(root).fontFamily || 'Geist, system-ui, sans-serif' };
  probe.remove();
  return theme;
}

const BASEMAPS: Record<string, (dark: boolean) => object> = {
  auto: dark => ({ style: dark ? 'carto-darkmatter' : 'carto-positron' }),
  claro: () => ({ style: 'carto-positron' }), oscuro: () => ({ style: 'carto-darkmatter' }), calles: () => ({ style: 'carto-voyager' }), ninguno: () => ({ style: 'white-bg' }),
  satelite: () => ({ style: 'white-bg', layers: [{ sourcetype: 'raster', source: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], below: 'traces', sourceattribution: 'Esri, Maxar' }] }),
};

/** The compiled layout dressed in the app's theme. `image` adds the title and a solid background. */
export function themedLayout(fig: FigurePayload, compiled: Compiled, t: FigureTheme, { image = false, width = 400 }: { image?: boolean; width?: number } = {}) {
  const layout: Record<string, unknown> = structuredClone(compiled.layout);
  const axisStyle = { gridcolor: t.grid, linecolor: t.line, zerolinecolor: t.line, tickcolor: t.line, tickfont: { color: t.muted, size: 10 }, title: { font: { color: t.fg, size: 11 } }, automargin: true };
  for (const [k, v] of Object.entries(layout)) {
    if (/^[xy]axis\d*$/.test(k)) { const a = v as Record<string, unknown>; layout[k] = { ...axisStyle, ...a, title: { ...axisStyle.title, ...(a.title as object ?? {}) } }; }
    else if (/^scene\d*$/.test(k)) { const s = v as Record<string, Record<string, unknown>>; for (const ax of ['xaxis', 'yaxis', 'zaxis']) s[ax] = { ...axisStyle, backgroundcolor: 'rgba(0,0,0,0)', showbackground: false, ...s[ax], title: { ...axisStyle.title, ...(s[ax]?.title as object ?? {}) } }; }
    else if (/^polar\d*$/.test(k)) { const p = v as Record<string, Record<string, unknown>>; p.bgcolor = 'rgba(0,0,0,0)' as never; p.radialaxis = { gridcolor: t.grid, linecolor: t.line, tickfont: { color: t.muted, size: 10 }, ...p.radialaxis }; p.angularaxis = { gridcolor: t.grid, linecolor: t.line, tickfont: { color: t.muted, size: 10 }, ...p.angularaxis }; }
    else if (/^map\d*$/.test(k)) { const m = v as Record<string, unknown>; const base = BASEMAPS[String(m.style ?? 'auto')] ?? BASEMAPS.auto; layout[k] = { ...m, ...base(t.dark) }; }
  }
  Object.assign(layout, {
    font: { family: t.font, color: t.fg, size: 11 }, paper_bgcolor: image ? t.bg : 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
    hoverlabel: { bgcolor: t.popover, bordercolor: t.line, font: { family: t.font, color: t.fg, size: 11 } },
  });
  const alpha = (rgb: string, a: number) => rgb.replace(/^rgba?\(([^,]+),([^,]+),([^,)]+).*$/, `rgba($1,$2,$3,${a})`);
  for (const [k, v] of Object.entries(layout)) if (/^legend\d*$/.test(k)) {
    const l = v as Record<string, unknown>;
    layout[k] = { ...l, font: { ...(l.font as object ?? {}), color: t.fg }, ...(l.bgcolor ? { bgcolor: alpha(t.popover, 0.85), bordercolor: t.line } : {}) };
  }
  if (image) {
    const m = layout.margin as Record<string, number>;
    const esc = (v: string) => v.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));
    // Title, subtitle and caption wrap to the image width, like the chat card's text.
    const wrap = (text: string, px: number, size: number) => { const max = Math.max(20, Math.floor(px / (size * 0.56))), lines: string[] = []; for (const w of text.split(/\s+/)) { const last = lines.at(-1); if (last != null && (last + ' ' + w).length <= max) lines[lines.length - 1] = `${last} ${w}`; else lines.push(w); } return lines; };
    const titleLines = fig.title ? wrap(fig.title, width - 24, 14) : [], subLines = fig.subtitle ? wrap(fig.subtitle, width - 24, 11) : [], capLines = fig.caption ? wrap(fig.caption, width - 20, 10) : [];
    const headPx = titleLines.length * 19 + subLines.length * 15 + (titleLines.length || subLines.length ? 14 : 0), capPx = capLines.length * 14 + (capLines.length ? 10 : 0);
    if (headPx) { layout.title = { text: [titleLines.length ? `<b>${titleLines.map(esc).join('<br>')}</b>` : '', subLines.length ? `<span style="font-size:11px">${subLines.map(esc).join('<br>')}</span>` : ''].filter(Boolean).join('<br>'), x: 0.01, xanchor: 'left', xref: 'paper', y: 1, yref: 'container', yanchor: 'top', pad: { t: 16 }, font: { size: 14, color: t.fg } }; m.t = (m.t ?? 30) + headPx + 6; }
    if (capPx) { m.b = (m.b ?? 48) + capPx; layout.annotations = [...(layout.annotations as object[] ?? []), { text: capLines.map(esc).join('<br>'), xref: 'paper', yref: 'paper', x: 0, y: 0, yshift: -(m.b - capPx - 4), xanchor: 'left', yanchor: 'top', align: 'left', showarrow: false, font: { size: 10, color: t.muted } }]; }
    layout.height = (layout.height as number) + headPx + (headPx ? 6 : 0) + capPx;
  }
  return layout;
}

const CONFIG = { responsive: false, displaylogo: false, locale: 'es', scrollZoom: false, modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d', 'toggleSpikelines', 'hoverClosestCartesian', 'hoverCompareCartesian'], toImageButtonOptions: { format: 'png', scale: 2 } };

/** Draws the figure laid out for this element's width; `toolbar` shows Plotly's zoom/pan bar (the enlarged view). */
export async function drawFigure(el: HTMLElement, fig: FigurePayload, compiled: Compiled, { toolbar = false } = {}) {
  const Plotly = await loadPlotly();
  // A full redraw, not Plotly.react: react's diff leaves masked contour fills stale when the width changes.
  await Plotly.newPlot(el, compiled.data, { ...themedLayout(fig, compiled, readTheme()), width: el.clientWidth }, { ...CONFIG, displayModeBar: toolbar ? 'hover' : false });
}

/** The figure as a PNG data URL, laid out and themed as the user sees it at `width` (2× pixels), for the model to review. */
export async function figurePng(fig: FigurePayload, width = 400, scale = 2) {
  const Plotly = await loadPlotly();
  const layout = themedLayout(fig, compileAt(fig, width), readTheme(), { image: true, width });
  const host = document.createElement('div');
  host.style.cssText = `position:fixed;left:-10000px;top:0;width:${width}px;height:${layout.height}px;pointer-events:none;`;
  document.body.appendChild(host);
  try {
    await Plotly.newPlot(host, compileAt(fig, width).data, { ...layout, width }, { ...CONFIG, staticPlot: true });
    // Map tiles load asynchronously; give them a moment before the snapshot.
    if (Object.keys(layout).some(k => /^map\d*$/.test(k))) await new Promise(r => setTimeout(r, 1800));
    return await Plotly.toImage(host, { format: 'png', width, height: layout.height as number, scale });
  } finally { Plotly.purge(host); host.remove(); }
}

/** Saves the figure as a PNG, drawn like the review image (title, caption, solid background). */
export async function downloadFigure(fig: FigurePayload) {
  const url = await figurePng(fig, 1100, 2);
  const name = (fig.title ?? fig.id).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'figura';
  const a = document.createElement('a'); a.href = url; a.download = `milli-${name}.png`; a.click();
}
