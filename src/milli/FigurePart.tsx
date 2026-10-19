// plot_show in the chat: the figure Milli built, laid out for the card's width (panels stack in the
// narrow chat) and drawn with Plotly in the app's theme. It can be opened full size (the grid layout,
// with zoom and pan) or saved as a PNG. When Milli shows a corrected version, replaces a draft with
// a new figure or withdraws it, the earlier one folds into a line.
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { ChevronRight, Download, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { ToolCallMessagePartComponent } from '@assistant-ui/react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { compileAt, downloadFigure, drawFigure, foldOf, getFoldVersion, loadPlotly, subscribeFolds } from './figure';
import type { FigurePayload } from './figure';

/** Redraws when the theme (light/dark, crop scheme) changes. */
function useThemeVersion() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const o = new MutationObserver(() => setV(n => n + 1));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-scheme', 'style'] });
    return () => o.disconnect();
  }, []);
  return v;
}

/** The element's width, kept up to date (layouts are compiled per width). */
function useWidth(ref: React.RefObject<HTMLElement | null>) {
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const node = ref.current; if (!node) return;
    setW(node.clientWidth);
    const o = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    o.observe(node); return () => o.disconnect();
  }, [ref]);
  return w;
}

function Plot({ figure, toolbar = false, className }: { figure: FigurePayload; toolbar?: boolean; className?: string }) {
  const el = useRef<HTMLDivElement>(null), box = useRef<HTMLDivElement>(null), [ready, setReady] = useState(false), [error, setError] = useState<string | null>(null);
  const theme = useThemeVersion(), width = useWidth(box);
  const compiled = useMemo(() => { if (!width) return null; try { return compileAt(figure, width); } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo componer la figura.'); return null; } }, [figure, width]);
  useEffect(() => {
    let live = true;
    if (el.current && compiled) drawFigure(el.current, figure, compiled, { toolbar }).then(() => live && setReady(true), e => live && setError(e instanceof Error ? e.message : 'No se pudo dibujar la figura.'));
    return () => { live = false; };
  }, [figure, compiled, theme, toolbar]);
  useEffect(() => () => { const node = el.current; if (node) void loadPlotly().then(P => P.purge(node)); }, []);
  return <div ref={box} className={cn('relative w-full', className)} style={{ height: compiled?.height ?? 260 }}>
    {!ready && !error && <Skeleton className="absolute inset-0 rounded-xl"/>}
    {error && <p role="alert" className="absolute inset-0 grid place-items-center text-xs text-destructive">{error}</p>}
    <div ref={el} className="milli-figure h-full w-full" data-figure={figure.id} data-version={figure.version}/>
  </div>;
}

export function FigureCard({ figure, folded = null }: { figure: FigurePayload; folded?: string | null }) {
  const [open, setOpen] = useState(false), [expanded, setExpanded] = useState(false), [saving, setSaving] = useState(false);
  if (folded && !expanded) return <button type="button" onClick={() => setExpanded(true)} className="flex items-center gap-1.5 self-start rounded-full px-2 py-1 text-left text-[11.5px] text-muted-foreground hover:bg-tile">
    <ChevronRight className="size-3.5 shrink-0"/>{figure.title ? `«${figure.title}»` : 'Figura'}{figure.version > 1 ? ` (versión ${figure.version})` : ''} · {folded}
  </button>;
  return <motion.figure initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', bounce: .2, visualDuration: .35 }}
    aria-label={figure.title ?? 'Figura de Milli'} className="grid gap-1.5 rounded-2xl bg-tile px-2.5 pt-2.5 pb-2">
    <header className="flex items-start gap-2 px-1">
      <div className="grid min-w-0 flex-1 gap-0.5">
        {figure.title && <h4 className="text-[13px] leading-snug font-medium text-balance">{figure.title}</h4>}
        {figure.subtitle && <p className="text-[11.5px] leading-snug text-pretty text-muted-foreground">{figure.subtitle}</p>}
      </div>
      <button type="button" onClick={() => setOpen(true)} aria-label="Ampliar figura" title="Ampliar" className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-frame/60 hover:text-foreground"><Maximize2 className="size-3.5"/></button>
      <button type="button" disabled={saving} onClick={() => { setSaving(true); void downloadFigure(figure).finally(() => setSaving(false)); }} aria-label="Descargar figura (PNG)" title="Descargar PNG" className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-frame/60 hover:text-foreground disabled:opacity-50"><Download className="size-3.5"/></button>
    </header>
    <Plot figure={figure}/>
    {figure.caption && <figcaption className="px-1 text-[11px] leading-snug text-pretty text-muted-foreground">{figure.caption}</figcaption>}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[4vh] right-0 left-0 mx-auto w-[min(1200px,94vw)] max-w-none translate-x-0 translate-y-0 sm:max-w-none">
        <DialogTitle>{figure.title ?? 'Figura de Milli'}</DialogTitle>
        {figure.subtitle ? <DialogDescription>{figure.subtitle}</DialogDescription> : <DialogDescription className="sr-only">Figura de Milli a tamaño completo</DialogDescription>}
        {open && <div className="max-h-[74vh] overflow-y-auto"><Plot figure={figure} toolbar/></div>}
        {figure.caption && <p className="text-xs text-muted-foreground">{figure.caption}</p>}
      </DialogContent>
    </Dialog>
  </motion.figure>;
}

type ShowResult = { figure?: FigurePayload };
/** The plot_show tool part. */
const FigurePart: ToolCallMessagePartComponent<{ figure_id?: string }, ShowResult> = ({ result, isError }) => {
  useSyncExternalStore(subscribeFolds, getFoldVersion);
  if (isError) return null; // the action row says what was wrong
  if (result === undefined) return <div className="grid gap-2 rounded-2xl bg-tile p-3" aria-label="Milli prepara una figura"><Skeleton className="h-3.5 w-2/5"/><Skeleton className="h-[220px] w-full rounded-xl"/></div>;
  const figure = result?.figure;
  if (!figure) return <p role="alert" className="rounded-xl bg-tile px-3 py-2 text-[12.5px] text-muted-foreground">Milli mostró una figura, pero este servidor no la envió completa. Reinicia el servidor (npm run dev) para verla.</p>;
  return <FigureCard figure={figure} folded={foldOf(figure)}/>;
};
export default FigurePart;
