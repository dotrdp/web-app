// What outside MCP agents (mcp-http.mjs) do in this tab, besides the commands Milli also uses:
// they ask permission to download (a dialog: only «Permitir» downloads) and show figures here (a
// panel over the map, since they have no chat). Ajustes shows this tab's own MCP address.
import { useState, useSyncExternalStore } from 'react';
import { Bot, Check, Copy, Download, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { FigureCard } from './FigurePart';
import type { FigurePayload } from './figure';
import { mcpUrl, screenCode } from './live';

type Ask = { id: string; agent: string; kind: string; scope: string; reason?: string; resolve: (answer: { approved: boolean; timedOut?: boolean }) => void };
type Shown = { key: string; agent: string; figure: FigurePayload };
let asks: Ask[] = [], figures: Shown[] = [];
const listeners = new Set<() => void>();
let version = 0;
const emit = () => { version++; listeners.forEach(l => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const useAgents = () => { useSyncExternalStore(subscribe, () => version); return { asks, figures }; };

const KIND: Record<string, string> = { estimaciones_csv: 'la tabla de estimaciones (CSV)', entrega_csv: 'la entrega del reto (CSV, 59 parcelas)', parcelas_geojson: 'las parcelas (GeoJSON)', mapa_png: 'la imagen del mapa (PNG)', seleccion_csv: 'la selección (CSV)' };
const SCOPE: Record<string, string> = { mostradas: 'las filas que se muestran', seleccionadas: 'las parcelas seleccionadas', todas: 'todas las parcelas' };

/** ask_permission: resolves with the person's decision, or not approved after two minutes. */
export function askPermission(args: { kind?: string; scope?: string; reason?: string; agent?: string }) {
  return new Promise<{ approved: boolean; timedOut?: boolean }>(resolve => {
    const id = crypto.randomUUID();
    const done = (answer: { approved: boolean; timedOut?: boolean }) => { clearTimeout(timer); asks = asks.filter(a => a.id !== id); emit(); resolve(answer); };
    const timer = setTimeout(() => done({ approved: false, timedOut: true }), 120_000);
    asks = [...asks, { id, agent: String(args.agent ?? 'Un agente externo'), kind: String(args.kind ?? ''), scope: String(args.scope ?? 'mostradas'), reason: args.reason, resolve: done }]; emit();
  });
}
/** show_figure: newest first, the same figure replaced by its newer version; at most 4. */
export function showAgentFigure(args: { figure: FigurePayload; agent?: string }) {
  const f = args.figure;
  figures = [{ key: `${f.id}:${f.version}:${Date.now()}`, agent: String(args.agent ?? 'Agente externo'), figure: f }, ...figures.filter(x => x.figure.id !== f.id)].slice(0, 4); emit();
  return { shown: true };
}

export function AgentPermission() {
  const { asks: list } = useAgents(), ask = list[0];
  return <Dialog open={!!ask} onOpenChange={open => { if (!open && ask) ask.resolve({ approved: false }); }}>
    {ask && <DialogContent className="sm:max-w-md">
      <DialogTitle className="flex items-center gap-2"><Download className="size-4"/>¿Permitir una descarga?</DialogTitle>
      <DialogDescription className="text-pretty">
        <b className="text-foreground">{ask.agent}</b> quiere descargar en esta pantalla {KIND[ask.kind] ?? ask.kind}, con {SCOPE[ask.scope] ?? ask.scope}.{ask.reason ? ` Motivo: «${ask.reason}».` : ''}
      </DialogDescription>
      <DialogFooter>
        <Button variant="outline" onClick={() => ask.resolve({ approved: false })}><X/>Rechazar</Button>
        <Button onClick={() => ask.resolve({ approved: true })}><Check/>Permitir descarga</Button>
      </DialogFooter>
    </DialogContent>}
  </Dialog>;
}

/** Figures shown by outside agents, over the map at the right. */
export function AgentFigures({ className }: { className?: string }) {
  const { figures: list } = useAgents();
  return <div className={className}>
    <AnimatePresence initial={false}>
      {list.map(s => <motion.section key={s.key} layout initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ type: 'spring', bounce: .2, visualDuration: .3 }}
        aria-label={`Figura de ${s.agent}`} className="pointer-events-auto grid gap-1 rounded-3xl bg-frame p-2 shadow-lg ring-1 ring-border/60">
        <header className="flex items-center gap-2 px-2 pt-1 text-[11.5px] text-muted-foreground">
          <Bot className="size-3.5 shrink-0"/><span className="min-w-0 flex-1 truncate">{s.agent}</span>
          <button type="button" onClick={() => { figures = figures.filter(x => x.key !== s.key); emit(); }} aria-label={`Cerrar la figura «${s.figure.title ?? s.figure.id}»`} className="grid size-6 place-items-center rounded-full hover:bg-tile hover:text-foreground"><X className="size-3.5"/></button>
        </header>
        <FigureCard figure={s.figure}/>
      </motion.section>)}
    </AnimatePresence>
  </div>;
}

/** Ajustes → MCP de esta pestaña: the address an outside agent uses to work in this tab. */
export function McpSettings() {
  const url = useSyncExternalStore(mcpUrl.subscribe, mcpUrl.get, mcpUrl.get), [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, what: string) => { void navigator.clipboard?.writeText(text).then(() => { setCopied(what); setTimeout(() => setCopied(null), 1500); }); };
  const config = url ? JSON.stringify({ mcpServers: { agrocebada: { type: 'http', url } } }, null, 2) : null;
  return <div className="grid gap-2.5 text-sm" aria-label="MCP de esta pestaña">
    <p className="px-1 text-xs leading-relaxed text-pretty text-muted-foreground">Un agente externo puede usar las herramientas de Milli (datos, estadística, figuras y esta pestaña) por MCP con esta dirección. Es solo de esta pestaña: funciona mientras tengas la sesión iniciada aquí; otras pestañas y otras personas tienen la suya. No la compartas con quien no deba manejar tu pantalla.</p>
    <div className="grid gap-1 rounded-2xl bg-tile px-3 py-2.5">
      <span className="flex justify-between text-xs text-muted-foreground"><span>Dirección MCP (Streamable HTTP)</span><span>Pantalla {screenCode}</span></span>
      {url ? <span className="flex items-center gap-2"><code aria-label="Dirección MCP de esta pestaña" className="min-w-0 flex-1 font-mono text-[11.5px] break-all">{url}</code>
        <button type="button" onClick={() => copy(url, 'url')} aria-label="Copiar la dirección MCP" className="grid size-7 shrink-0 place-items-center rounded-full hover:bg-frame/60">{copied === 'url' ? <Check className="size-3.5"/> : <Copy className="size-3.5"/>}</button></span>
        : <span className="text-xs text-muted-foreground">Conectando…</span>}
    </div>
    {config && <button type="button" onClick={() => copy(config, 'config')} className="justify-self-start rounded-full bg-tile px-3 py-1.5 text-[12px] hover:bg-tile-strong">{copied === 'config' ? 'Copiado' : 'Copiar configuración de cliente MCP (JSON)'}</button>}
  </div>;
}
