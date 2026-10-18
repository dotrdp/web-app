// Notas: a free-text scratchpad in the side menu, saved to the workspace (/api/notes) a moment
// after typing stops, and flushed when the panel closes.
import { useEffect, useRef, useState } from 'react';
import { api } from '../lib';

type Notes = { text: string; updatedAt: string | null };
type Status = 'loading' | 'saved' | 'dirty' | 'saving' | 'error';
const SAVE_DELAY_MS = 700;
const MAX_NOTES = 50_000;

export default function NotesPanel() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<Status>('loading');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const pending = useRef<string | null>(null), timer = useRef<number | undefined>(undefined);

  async function save() {
    const value = pending.current; if (value == null) return;
    pending.current = null; setStatus('saving');
    try { const saved = await api<Notes>('/api/notes', { method: 'PUT', body: JSON.stringify({ text: value }) }); setSavedAt(saved.updatedAt); setStatus(pending.current == null ? 'saved' : 'dirty'); }
    catch { pending.current ??= value; setStatus('error'); }
  }
  useEffect(() => {
    let live = true;
    api<Notes>('/api/notes').then(n => { if (live) { setText(n.text); setSavedAt(n.updatedAt); setStatus('saved'); } }).catch(() => live && setStatus('error'));
    // Closing the panel saves whatever is still pending.
    return () => { live = false; window.clearTimeout(timer.current); void save(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const change = (value: string) => {
    setText(value); pending.current = value; setStatus('dirty');
    window.clearTimeout(timer.current); timer.current = window.setTimeout(() => void save(), SAVE_DELAY_MS);
  };
  const time = savedAt ? new Date(savedAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : null;
  const label = { loading: 'Cargando…', saved: time ? `Guardado · ${time}` : 'Guardado', dirty: 'Sin guardar…', saving: 'Guardando…', error: 'No se pudo guardar. Reintentaremos al seguir escribiendo.' }[status];

  return <div className="grid min-h-0 gap-2">
    <textarea value={text} onChange={e => change(e.target.value)} disabled={status === 'loading'} maxLength={MAX_NOTES} aria-label="Notas"
      placeholder="Escribe tus notas: parcelas por visitar, observaciones de campo, pendientes…"
      className="min-h-[60vh] w-full resize-y rounded-2xl bg-tile p-3.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"/>
    <p className={`flex justify-between gap-2 px-1 text-[11px] ${status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`} aria-live="polite">
      <span>{label}</span><span className="tabular-nums">{text.length.toLocaleString('es-MX')} caracteres</span>
    </p>
  </div>;
}
