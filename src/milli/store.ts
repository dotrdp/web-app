// Milli's live state in this tab: the task it is working on (from the server's live channel),
// whether the chat is running, whether the user is following along, and the view changes Milli
// made while the user wasn't following (replayed when they click the eye).
import { useSyncExternalStore } from 'react';

export type StepStatus = 'pending' | 'running' | 'done' | 'failed' | 'skipped';
export type MilliTask = { title: string; goal: string; steps: string[]; status: StepStatus[]; notes: (string | undefined)[] };
export type Deferred = { command: string; args: Record<string, unknown> };
export type MilliState = {
  connected: boolean;
  task: MilliTask | null;
  chatRunning: boolean;
  following: boolean;
  deferred: Deferred[];
};

let state: MilliState = { connected: false, task: null, chatRunning: false, following: true, deferred: [] };
const listeners = new Set<() => void>();
const set = (next: Partial<MilliState>) => { state = { ...state, ...next }; listeners.forEach(l => l()); };

export const milli = {
  get: () => state,
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },
  setConnected: (connected: boolean) => set({ connected }),
  setChatRunning: (chatRunning: boolean) => set({ chatRunning }),
  /** A new task always starts with the screen following Milli. */
  startTask: (t: { title: string; goal: string; steps: string[] }) => set({ task: { ...t, status: t.steps.map(() => 'pending'), notes: t.steps.map(() => undefined) }, following: true, deferred: [] }),
  updateTask: (step: number, status: StepStatus, note?: string) => {
    if (!state.task) return;
    const status2 = [...state.task.status]; status2[step] = status;
    const notes = [...state.task.notes]; if (note) notes[step] = note;
    set({ task: { ...state.task, status: status2, notes } });
  },
  finishTask: () => set({ task: null, following: true, deferred: [] }),
  setFollowing: (following: boolean) => set({ following, ...(following ? { deferred: [] } : {}) }),
  /** Keep only the latest change per category, in the order Milli made them. */
  defer: (category: string, change: Deferred) => set({ deferred: [...state.deferred.filter(d => category !== categoryOf(d)), change] }),
};

/** Which deferred changes supersede each other (same category: only the latest is replayed). */
export function categoryOf({ command, args }: Deferred) {
  if (command === 'table_set' || command === 'table_check') return `${command}:${String(args.table)}`;
  if (command === 'map_fly_to' || command === 'select_parcel' || command === 'map_select_parcels') return 'map_view';
  return command;
}

export const useMilli = () => useSyncExternalStore(milli.subscribe, milli.get, milli.get);
/** Milli is visibly working: a task is open or the chat is streaming. */
export const useMilliWorking = () => { const s = useMilli(); return s.chatRunning || s.task !== null; };
