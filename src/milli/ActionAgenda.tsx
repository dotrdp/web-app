// Every action Milli took on this answer, as a stealth Agenda: one row per MCP call with its start
// time and duration, its tone (running, done, not shown, failed) and a line on the outcome. A row
// opens the call's arguments and result.
import { useEffect, useRef, useState } from 'react';
import { Agenda } from '@/components/ui/agenda';
import type { AgendaEvent } from '@/components/ui/agenda';
import { actionDetail, actionTitle } from './parts';
import type { Action } from './parts';
import { getOutcome, useOutcomeVersion } from './runtime';

// The relative times ("ends in", "starts in") are left empty: Milli's actions take seconds and their end isn't known.
const LABELS = { today: 'Hoy', tomorrow: 'Mañana', now: 'Ahora', empty: 'Sin acciones', nothingElse: 'Milli no tiene más acciones pendientes', endsIn: '', startingNow: '', startsIn: '', allDay: 'Todo el día',
  show: 'Mostrar', hide: 'Ocultar', earlier: (n: number) => `${n} ${n === 1 ? 'acción anterior' : 'acciones anteriores'}`, ahead: (n: number) => n ? `${n} en curso` : 'Todas terminadas', tentative: 'Pendiente', canceled: 'Cancelada' };

/** Re-renders while Milli runs, so the live row's progress and the Now line move. */
function useTick(active: boolean) {
  const [, setTick] = useState(0);
  useEffect(() => { if (!active) return; const t = setInterval(() => setTick(n => n + 1), 250); return () => clearInterval(t); }, [active]);
}

export default function ActionAgenda({ actions, running }: { actions: Action[]; running: boolean }) {
  useOutcomeVersion();
  useTick(running);
  const now = Date.now();
  const [open, setOpen] = useState<string | null>(null);
  let queued = 0;
  // Done actions are past rows, the one running is live (its bar moves), queued ones wait after the Now line.
  const events: AgendaEvent[] = actions.map(raw => {
    // An approved export: the card holds the user's decision; what the screen did comes from the server.
    const outcome = raw.name === 'request_export' ? getOutcome(raw.id) : undefined;
    const a = outcome ? { ...raw, result: outcome.result, isError: outcome.isError, pending: false, completedAt: raw.completedAt ?? now } : raw;
    const r = a.result as { shown?: boolean; approved?: boolean } | undefined;
    const base = { id: a.id, title: actionTitle(a.name, a.args) };
    if (!a.pending) {
      const end = Math.min(a.completedAt ?? now, now), start = Math.min(a.startedAt ?? end - 300, end - 300);
      return { ...base, start: new Date(start), end: new Date(end), detail: actionDetail(a), tone: a.isError ? 'danger' : r?.shown === false || r?.approved === false ? 'warning' : 'success' };
    }
    if (a.startedAt && running) return { ...base, start: new Date(a.startedAt), end: new Date(Math.max(now + 1000, a.startedAt + 1500)), detail: 'En curso', tone: 'info' };
    if (a.name === 'request_export') return { ...base, start: new Date(now + 1000 * ++queued), end: new Date(now + 1000 * queued + 500), detail: running ? 'En cola' : 'Esperando tu permiso', tone: 'warning', status: 'tentative' };
    if (!running) return { ...base, start: new Date(now - 500), end: new Date(now - 200), detail: 'No se ejecutó', tone: 'neutral', status: 'canceled' };
    return { ...base, start: new Date(now + 1000 * ++queued), end: new Date(now + 1000 * queued + 500), detail: 'En cola', tone: 'neutral' };
  });
  // Follow the newest action, like a log.
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => { const scroller = wrap.current?.querySelector<HTMLElement>('[data-slot="agenda"] > .overflow-y-auto'); if (scroller) scroller.scrollTop = scroller.scrollHeight; }, [actions.length]);
  const selected = actions.find(a => a.id === open);
  if (!actions.length) return null;
  return <div ref={wrap} className="grid gap-1.5">
    <Agenda events={events} title={`Acciones de Milli · ${actions.length}`} now={new Date(now)} days={1} foldPast={false} locale="es-MX" labels={LABELS}
      onEventClick={e => setOpen(o => o === e.id ? null : e.id)} className="milli-agenda max-h-[300px] min-h-0"/>
    {selected && <details open className="rounded-xl bg-tile px-3 py-2 text-[11.5px]">
      <summary className="cursor-pointer text-muted-foreground">{actionTitle(selected.name, selected.args)} · <code>{selected.name}</code></summary>
      <pre className="mt-1.5 max-h-48 overflow-auto font-mono text-[10.5px] leading-relaxed whitespace-pre-wrap text-foreground/80">{JSON.stringify({ argumentos: selected.args, resultado: getOutcome(selected.id)?.result ?? selected.result }, null, 2)}</pre>
    </details>}
  </div>;
}
