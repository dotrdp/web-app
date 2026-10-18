// This tab's live channel to Milli: a random screen id (memory only, so every tab is its own
// screen), an EventSource for commands and task events, and replies posted back. Also watches for
// the user taking over: a click or key press outside Milli's chat while it works stops following.
import { execute } from './bridge';
import { milli } from './store';
import type { StepStatus } from './store';

export const screenId: string = crypto.randomUUID();

type LiveEvent =
  | { type: 'hello'; screen: string }
  | { type: 'command'; cmdId: string; command: string; args: unknown }
  | { type: 'task'; phase: 'start'; task: { title: string; goal: string; steps: string[] } }
  | { type: 'task'; phase: 'update'; step: number; status: StepStatus; note?: string }
  | { type: 'task'; phase: 'finish'; status?: string }
  | { type: 'show_series'; ids: string[]; year: number };

const post = (body: object) => fetch(`/api/live/${screenId}/reply`, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => undefined);

/** Opens the channel; returns a function that closes it (logout, unmount). */
export function startLive() {
  const source = new EventSource(`/api/live?screen=${encodeURIComponent(screenId)}`, { withCredentials: true });
  source.onopen = () => milli.setConnected(true);
  source.onerror = () => milli.setConnected(false); // EventSource reconnects by itself (retry: 2000)
  source.onmessage = async message => {
    let event: LiveEvent;
    try { event = JSON.parse(message.data); } catch { return; }
    if (event.type === 'command') {
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
