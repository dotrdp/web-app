// Notas: a free-text scratchpad in the side menu, saved to the workspace (/api/notes) a moment
// after typing stops, and flushed when the panel closes. The notes are shared by everyone on the
// account (and by agents): each save says which version it started from, and when someone else
// saved in between, the two edits are merged instead of one overwriting the other.
import { useEffect, useRef, useState } from 'react';
import { api } from '../lib';
import { useMilliController } from '../milli/bridge';

type Notes = { text: string; updatedAt: string | null };
type Status = 'loading' | 'saved' | 'dirty' | 'saving' | 'error';
const SAVE_DELAY_MS = 700;
const MAX_NOTES = 50_000;

export default function NotesPanel() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<Status>('loading');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const pending = useRef<string | null>(null), timer = useRef<number | undefined>(undefined);
  // The version this editor started from: its text and when it was saved.
  const base = useRef<{ text: string; updatedAt: string | null }>({ text: '', updatedAt: null });
  const [merged, setMerged] = useState(false);

  async function save(): Promise<void> {
    const value = pending.current; if (value == null) return;
    pending.current = null; setStatus('saving');
    try {
      const response = await fetch('/api/notes', { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: value, base: base.current.updatedAt }) });
      const body = await response.json();
      if (response.status === 409) {
        // Someone saved in between: keep both edits and save the merge.
        const next = mergeNotes(base.current.text, value, body.text);
        base.current = { text: body.text, updatedAt: body.updatedAt };
        setText(t => t === value ? next : mergeNotes(value, t, next)); pending.current ??= next; setMerged(true);
        return save();
      }
      if (!response.ok) throw new Error(body.error);
      base.current = { text: value, updatedAt: body.updatedAt };
      setSavedAt(body.updatedAt); setStatus(pending.current == null ? 'saved' : 'dirty');
    } catch { pending.current ??= value; setStatus('error'); }
  }
  useEffect(() => {
    let live = true;
    api<Notes>('/api/notes').then(n => { if (live) { base.current = { text: n.text, updatedAt: n.updatedAt }; setText(n.text); setSavedAt(n.updatedAt); setStatus('saved'); } }).catch(() => live && setStatus('error'));
    // Closing the panel saves whatever is still pending.
    return () => { live = false; window.clearTimeout(timer.current); void save(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const change = (value: string) => {
    setText(value); pending.current = value; setStatus('dirty');
    window.clearTimeout(timer.current); timer.current = window.setTimeout(() => void save(), SAVE_DELAY_MS);
  };
  // Milli already saved its edit on the server; show it and scroll to where it wrote.
  const area = useRef<HTMLTextAreaElement>(null);
  useMilliController('notas', { commands: { show: ({ text: next }) => {
    window.clearTimeout(timer.current); pending.current = null;
    // Milli's edit is already saved; refresh the version this editor builds on.
    void api<Notes>('/api/notes').then(n => { base.current = { text: n.text, updatedAt: n.updatedAt }; setSavedAt(n.updatedAt); });
    setText(String(next)); setStatus('saved');
    requestAnimationFrame(() => { const el = area.current; if (el) el.scrollTop = el.scrollHeight; });
  } } });
  const time = savedAt ? new Date(savedAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : null;
  const label = { loading: 'Cargando…', saved: time ? `Guardado · ${time}` : 'Guardado', dirty: 'Sin guardar…', saving: 'Guardando…', error: 'No se pudo guardar. Reintentaremos al seguir escribiendo.' }[status];

  return <div className="grid min-h-0 gap-2">
    <textarea ref={area} value={text} onChange={e => change(e.target.value)} disabled={status === 'loading'} maxLength={MAX_NOTES} aria-label="Notas"
      placeholder="Escribe tus notas: parcelas por visitar, observaciones de campo, pendientes…"
      className="min-h-[60vh] w-full resize-y rounded-2xl bg-tile p-3.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"/>
    <p className={`flex justify-between gap-2 px-1 text-[11px] ${status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`} aria-live="polite">
      <span>{label}{merged && ' · Se combinaron cambios de otra pantalla'}</span><span className="tabular-nums">{text.length.toLocaleString('es-MX')} caracteres</span>
    </p>
  </div>;
}

/** Combine my edit and theirs, both made from `base`: an append on either side is kept as is;
 *  otherwise their text stays and mine follows, marked, so nothing is lost. */
export function mergeNotes(base: string, mine: string, theirs: string) {
  if (mine === theirs || theirs === base) return mine;
  if (mine === base) return theirs;
  if (theirs.startsWith(base)) return mine + theirs.slice(base.length);
  if (mine.startsWith(base)) return theirs + mine.slice(base.length);
  return `${theirs}\n\n— Cambios de esta pantalla (otra persona editó al mismo tiempo):\n${mine}`;
}
