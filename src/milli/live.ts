// This tab's live channel to Milli: a random screen id (memory only, so every tab is its own
// screen), an EventSource for commands and task events, and replies posted back. Also watches for
// the user taking over: a click or key press outside Milli's chat while it works stops following.
import { execute } from './bridge';
import { milli } from './store';
import type { StepStatus } from './store';
import type { FigurePayload } from './figure';

export const screenId: string = crypto.randomUUID();
/** The short code this tab shows (first 4 characters of its id), to tell an outside agent which screen is yours. */
export const screenCode = screenId.replace(/-/g, '').slice(0, 4).toUpperCase();
/** This tab's own MCP address for outside agents (the server sends its secret key on connect). */
let mcpKey: string | null = null; const mcpListeners = new Set<() => void>();
export const mcpUrl = { get: () => mcpKey ? `${location.origin}/mcp/${mcpKey}` : null, subscribe: (l: () => void) => { mcpListeners.add(l); return () => { mcpListeners.delete(l); }; } };
/** Which page this tab shows, reported so an agent listing the account's screens can tell them apart. */
let page = 'mapa';
export function reportPage(next: string) { page = next; void post({ page }); }

type LiveEvent =
  | { type: 'hello'; screen: string; mcp?: string }
  | { type: 'command'; cmdId: string; command: string; args: unknown }
  | { type: 'task'; phase: 'start'; task: { title: string; goal: string; steps: string[] } }
  | { type: 'task'; phase: 'update'; step: number; status: StepStatus; note?: string }
  | { type: 'task'; phase: 'finish'; status?: string }
  | { type: 'show_series'; ids: string[]; year: number };

const post = (body: object) => fetch(`/api/live/${screenId}/reply`, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => undefined);

/** Opens the channel; returns a function that closes it (logout, unmount). */
export function startLive() {
  const source = new EventSource(`/api/live?screen=${encodeURIComponent(screenId)}`, { withCredentials: true });
  source.onopen = () => { milli.setConnected(true); void post({ page, following: milli.get().following }); };
  source.onerror = () => milli.setConnected(false); // EventSource reconnects by itself (retry: 2000)
  source.onmessage = async message => {
    let event: LiveEvent;
    try { event = JSON.parse(message.data); } catch { return; }
    if (event.type === 'hello') { if (event.mcp && event.mcp !== mcpKey) { mcpKey = event.mcp; mcpListeners.forEach(l => l()); } return; }
    if (event.type === 'command' && (event.command === 'ask_permission' || event.command === 'show_figure')) {
      // Outside agents: a download needs the person's «Permitir»; figures appear in a panel (no chat).
      const { askPermission, showAgentFigure } = await import('./agents');
      const args = (event.args ?? {}) as Record<string, unknown>;
      try {
        if (event.command === 'ask_permission') void post({ cmdId: event.cmdId, ok: true, result: await askPermission(args) });
        else { if (!(args.figure as FigurePayload | undefined)?.state) throw new Error('Figura no válida.'); void post({ cmdId: event.cmdId, ok: true, result: showAgentFigure(args as { figure: FigurePayload; agent?: string }) }); }
      } catch (e) { void post({ cmdId: event.cmdId, ok: false, error: e instanceof Error ? e.message : 'No se pudo.' }); }
    } else if (event.type === 'command' && event.command === 'render_figure') {
      // plot_show: draw the figure offscreen and send the PNG back for the model to review. It never
      // touches the view, so it runs whether or not the user is following.
      const { figurePng } = await import('./figure');
      const args = event.args as { figure?: FigurePayload; width?: number };
      try {
        if (!args?.figure?.state) throw new Error('Figura no válida.');
        void post({ cmdId: event.cmdId, ok: true, result: { png: await figurePng(args.figure, Math.min(1600, Math.max(320, args.width ?? 400)), (args.width ?? 400) <= 600 ? 2 : 1) } });
      } catch (e) { void post({ cmdId: event.cmdId, ok: false, error: e instanceof Error ? e.message : 'No se pudo dibujar la figura.' }); }
    } else if (event.type === 'command') {
      const answer = await execute(event.command, event.args);
      void post({ cmdId: event.cmdId, ...answer, following: milli.get().following });
    } else if (event.type === 'task') {
      if (event.phase === 'start') milli.startTask(event.task);
      else if (event.phase === 'update') milli.updateTask(event.step, event.status, event.note);
      else milli.finishTask();
    } else if (event.type === 'show_series') {
      void execute('show_series', { ids: event.ids, year: event.year });
    }
  };

  // Taking over: any click or key outside Milli's own UI while it is working.
  const takeOver = (e: Event) => {
    const s = milli.get();
    if (!s.following || !(s.task || s.chatRunning)) return;
    if ((e.target as Element | null)?.closest?.('[data-milli]')) return;
    if (e instanceof KeyboardEvent && ['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
    milli.setFollowing(false);
  };
  window.addEventListener('pointerdown', takeOver, true);
  window.addEventListener('keydown', takeOver, true);
  // The server learns about following changes right away (start_task reports it to the model).
  let last = milli.get().following;
  const unsubscribe = milli.subscribe(() => { const f = milli.get().following; if (f !== last) { last = f; void post({ following: f }); } });

  return () => {
    source.close(); milli.setConnected(false); unsubscribe();
    window.removeEventListener('pointerdown', takeOver, true);
    window.removeEventListener('keydown', takeOver, true);
  };
}
