// Agente de IA Milli's chat (assistant-ui on a LocalRuntime). The runtime lives in MilliProvider,
// above the island, so the conversation and a running task survive closing the chat. Each answer
// shows the task card, the agenda of actions, export requests, the final answer and thumbs
// feedback. The composer only takes CSV files, and says so.
import { useMemo, useRef, useState } from 'react';
import type { DragEvent, ReactNode } from 'react';
import { ArrowUp, Eye, EyeOff, FileSpreadsheet, Paperclip, RotateCcw, Square, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AssistantRuntimeProvider, AttachmentPrimitive, AuiIf, ComposerPrimitive, MessagePrimitive, ThreadPrimitive, useAui, useAuiState, useLocalRuntime } from '@assistant-ui/react';
import type { ThreadAssistantMessagePart } from '@assistant-ui/react';
import { ThumbsFeedback } from '@/components/ui/thumbs-feedback';
import { TypingIndicator } from '@/components/ui/typing-indicator';
import { cn } from '@/lib/utils';
import { api, IS_DEMO } from '../lib';
import { MilliAvatar, MilliName } from '../shell/Milli';
import ActionAgenda from './ActionAgenda';
import { replayDeferred } from './bridge';
import ExportApproval from './ExportApproval';
import { readMessage } from './parts';
import { APPROVAL_TOOL, attachmentSummary, CsvAttachmentAdapter, getThreadId, LIMITS, milliAdapter, rejectReason, resetThread } from './runtime';
import { milli, useMilli } from './store';
import TaskCard, { Exploration } from './TaskCard';

const csvAdapter = new CsvAttachmentAdapter();

export function MilliProvider({ children }: { children: ReactNode }) {
  const runtime = useLocalRuntime(milliAdapter, { maxSteps: 500, unstable_humanToolNames: [APPROVAL_TOOL], adapters: { attachments: csvAdapter } });
  return <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>;
}

/** Milli is working: a task is open on this screen, or the chat is streaming. */
export function useMilliWorking() { const s = useMilli(); return s.chatRunning || !!s.task; }

/** The eye: while Milli works it always says whether you're watching. Following, the eye pulses
 *  ("Siguiendo"; a click stops following). Not following, it offers "Ver" with the changes Milli made
 *  meanwhile; a click shows them and follows again. Gone when Milli finishes. */
export function MilliEye({ className }: { className?: string }) {
  const s = useMilli(), working = s.chatRunning || !!s.task;
  const pill = 'flex h-7 shrink-0 items-center gap-1.5 rounded-full pr-2.5 pl-2 text-xs font-medium whitespace-nowrap';
  const motionProps = { initial: { opacity: 0, scale: .7 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: .7 }, transition: { type: 'spring' as const, bounce: .35, visualDuration: .3 } };
  return <AnimatePresence initial={false} mode="popLayout">
    {working && (s.following
      ? <motion.button key="watching" type="button" data-milli {...motionProps} onClick={() => milli.setFollowing(false)}
          aria-label="Estás viendo lo que hace Milli" title="Tu pantalla sigue a Milli. Haz clic (o en cualquier parte) para dejar de seguirla."
          className={cn(pill, 'bg-primary-container text-on-primary-container hover:bg-primary-container/80', className)}>
          <span className="relative grid size-3.5 shrink-0 place-items-center"><span aria-hidden="true" className="absolute inset-0 animate-ping-soft rounded-full bg-primary/50"/><Eye className="relative size-3.5"/></span>
          Siguiendo
        </motion.button>
      : <motion.button key="away" type="button" data-milli {...motionProps} onClick={() => void replayDeferred()}
          aria-label="Ver lo que hace Milli" title="Dejaste de seguir a Milli. Haz clic para ver lo que hizo y volver a seguirla."
          className={cn(pill, 'bg-primary text-primary-foreground hover:bg-primary/90', className)}>
          <EyeOff className="size-3.5 shrink-0"/>Ver{s.deferred.length > 0 && <span className="rounded-full bg-primary-foreground/20 px-1.5 tabular-nums">{s.deferred.length}</span>}
        </motion.button>)}
  </AnimatePresence>;
}

/** Stealth typing indicator: "Milli trabaja en tu tarea" while it works. */
function Working() {
  const s = useMilli(), working = s.chatRunning || !!s.task;
  return <TypingIndicator people={working ? [{ id: 'milli', name: 'Milli' }] : []} labels={{ one: s.task ? `trabaja · ${s.task.title}` : 'está pensando' }} className="min-w-0"/>;
}

const SUGGESTIONS = [
  'Compara el NDVI de julio 2025 de las parcelas reservadas de Calpulalpan, anótalo y exporta la tabla',
  '¿Cuánto ganaría en Hidalgo con un costo de 15,000 por hectárea?',
  'Muéstrame en el mapa las parcelas de Puebla y selecciónalas',
];

export default function MilliChat() {
  const aui = useAui();
  const running = useAuiState(s => s.thread.isRunning);
  const empty = useAuiState(s => s.thread.messages.length === 0);
  const working = useMilliWorking();
  return <div data-milli className="flex h-[min(680px,calc(100dvh-5.5rem))] w-[min(580px,calc(100vw-1.5rem))] flex-col">
    <header className="flex items-center gap-2.5 px-4 pt-3 pb-2">
      <MilliAvatar size={28}/>
      <div className="grid min-w-0 flex-1">
        <h2 className="text-base leading-tight"><MilliName working={working}/></h2>
        {working ? <Working/> : <span className="truncate text-xs text-muted-foreground">Analiza tus datos y maneja esta pestaña contigo</span>}
      </div>
      <MilliEye/>
      {!empty && <button type="button" disabled={running} onClick={() => { resetThread(); aui.thread.reset(); }} title="Nueva conversación" aria-label="Nueva conversación"
        className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-tile hover:text-foreground disabled:opacity-40"><RotateCcw className="size-4"/></button>}
    </header>
    {IS_DEMO
      ? <p className="m-4 rounded-2xl bg-tile p-4 text-sm text-muted-foreground">Milli necesita la versión con servidor de AgroCebada: lee los datos y maneja la pantalla desde ahí. En esta demostración estática no está disponible.</p>
      : <ThreadPrimitive.Root className="flex min-h-0 flex-1 flex-col">
          <ThreadPrimitive.Viewport className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4">
            <AuiIf condition={s => s.thread.messages.length === 0}><Welcome/></AuiIf>
            <div className="flex flex-col gap-5 pt-2 pb-4 empty:hidden">
              <ThreadPrimitive.Messages>{({ message }) => message.role === 'user' ? <UserMessage/> : <AssistantMessage/>}</ThreadPrimitive.Messages>
            </div>
            <ThreadPrimitive.ViewportFooter className="sticky bottom-0 mt-auto bg-frame pb-3">
              <Composer/>
            </ThreadPrimitive.ViewportFooter>
          </ThreadPrimitive.Viewport>
        </ThreadPrimitive.Root>}
  </div>;
}

function Welcome() {
  const aui = useAui();
  return <div className="grid content-center gap-4 py-6">
    <div className="grid gap-1.5">
      <h3 className="text-xl font-medium tracking-tight text-balance">¿Qué quieres que haga Milli?</h3>
      <p className="text-[13px] leading-relaxed text-pretty text-muted-foreground">Milli lee los datos del atlas, mueve el mapa, ajusta las tablas y llena la calculadora en tu pantalla mientras trabaja. Haz clic en cualquier parte para tomar el control; con el ojo vuelves a ver lo que hace. Siempre te pide permiso antes de descargar.</p>
    </div>
    <div className="grid gap-1.5">
      {SUGGESTIONS.map(s => <button key={s} type="button" onClick={() => { aui.composer.setText(s); aui.composer.send(); }}
        className="rounded-2xl bg-tile px-3.5 py-2.5 text-left text-[13px] leading-snug hover:bg-tile-strong">{s}</button>)}
    </div>
  </div>;
}

function CsvChip({ removable }: { removable?: boolean }) {
  const id = useAuiState(s => s.attachment.id), name = useAuiState(s => s.attachment.name);
  const summary = attachmentSummary(id);
  return <AttachmentPrimitive.Root className="flex max-w-full items-center gap-2 rounded-xl bg-primary-container/60 py-1.5 pr-1.5 pl-2 text-on-primary-container">
    <FileSpreadsheet className="size-4 shrink-0"/>
    <span className="grid min-w-0 leading-tight"><span className="truncate text-[12px] font-medium">{name}</span><span className="text-[10.5px] opacity-75">CSV{summary ? ` · ${summary.rows} filas · ${summary.columns} columnas` : ''}</span></span>
    {removable && <AttachmentPrimitive.Remove className="grid size-6 shrink-0 place-items-center rounded-full hover:bg-frame/60" aria-label={`Quitar ${name}`}><X className="size-3.5"/></AttachmentPrimitive.Remove>}
  </AttachmentPrimitive.Root>;
}

function UserMessage() {
  return <MessagePrimitive.Root className="grid justify-items-end gap-1.5">
    <div className="flex flex-wrap justify-end gap-1.5 empty:hidden"><MessagePrimitive.Attachments components={{ Attachment: () => <CsvChip/> }}/></div>
    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-[13.5px] leading-relaxed whitespace-pre-wrap text-primary-foreground empty:hidden">
      <MessagePrimitive.Parts components={{ Text: ({ text }) => <>{text}</> }}/>
    </div>
  </MessagePrimitive.Root>;
}

const Nothing = () => null;
const md = {
  p: (p: { children?: ReactNode }) => <p className="leading-relaxed text-pretty">{p.children}</p>,
  ul: (p: { children?: ReactNode }) => <ul className="grid list-disc gap-1 pl-5">{p.children}</ul>,
  ol: (p: { children?: ReactNode }) => <ol className="grid list-decimal gap-1 pl-5">{p.children}</ol>,
  strong: (p: { children?: ReactNode }) => <strong className="font-semibold">{p.children}</strong>,
  table: (p: { children?: ReactNode }) => <div className="overflow-x-auto rounded-xl bg-tile"><table className="w-full text-[12px] tabular-nums">{p.children}</table></div>,
  th: (p: { children?: ReactNode }) => <th className="px-2.5 py-1.5 text-left font-medium text-muted-foreground">{p.children}</th>,
  td: (p: { children?: ReactNode }) => <td className="border-t border-border/60 px-2.5 py-1.5">{p.children}</td>,
  code: (p: { children?: ReactNode }) => <code className="rounded bg-tile px-1 font-mono text-[12px]">{p.children}</code>,
};

function AssistantMessage() {
  const content = useAuiState(s => s.message.content) as readonly ThreadAssistantMessagePart[];
  const status = useAuiState(s => s.message.status);
  const custom = useAuiState(s => s.message.metadata.custom) as { outcome?: string; error?: string } | undefined;
  const view = useMemo(() => readMessage(content), [content]);
  const running = status?.type === 'running';
  const finished = custom?.outcome === 'finished' || view.answer != null;
  const narration = view.thoughts.filter(t => t.kind === 'text').map(t => t.text).join('\n\n');
  const failure = custom?.error ?? (status?.type === 'incomplete' && status.reason === 'error' ? String((status as { error?: unknown }).error ?? 'Milli no pudo responder.') : null);
  const cancelled = status?.type === 'incomplete' && status.reason === 'cancelled';
  return <MessagePrimitive.Root className="grid gap-2.5">
    {view.task ? <TaskCard task={view.task} thoughts={view.thoughts} running={running} finished={finished}/> : <Exploration thoughts={view.thoughts} running={running} defaultOpen/>}
    {running && !view.thoughts.length && !view.actions.length && <TypingIndicator people={[{ id: 'milli', name: 'Milli' }]} labels={{ one: 'está empezando' }}/>}
    <ActionAgenda actions={view.actions} running={running}/>
    <MessagePrimitive.Parts components={{ Text: Nothing, Reasoning: Nothing, tools: { by_name: { [APPROVAL_TOOL]: ExportApproval }, Fallback: Nothing } }}/>
    {view.answer != null
      ? <div className="grid gap-2 text-[13.5px]" aria-label="Respuesta de Milli"><ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>{view.answer}</ReactMarkdown></div>
      : !running && narration && !view.task && <div className="grid gap-2 text-[13.5px]"><ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>{narration}</ReactMarkdown></div>}
    {failure && <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-[12.5px] text-destructive">{failure}</p>}
    {cancelled && <p className="text-[12px] text-muted-foreground">Detuviste a Milli.</p>}
    {finished && !running && <Feedback/>}
  </MessagePrimitive.Root>;
}

function Feedback() {
  const messageId = useAuiState(s => s.message.id);
  return <ThumbsFeedback question={null} size="sm" undoable={false} promptComment
    reasons={['Datos incorrectos', 'No hizo lo que pedí', 'Difícil de seguir', 'Tardó demasiado']} reasonsLabel="¿Qué deberíamos mejorar?"
    commentPlaceholder="Escribe tu sugerencia para Milli" thanksLabel="Gracias, nos ayuda a mejorar a Milli"
    labels={{ helpful: 'Útil', notHelpful: 'No fue útil', undo: 'Deshacer', tryAgain: 'Reintentar', addComment: 'Añadir una sugerencia', skip: 'Omitir', send: 'Enviar', comment: 'Sugerencia', sendFailed: 'No pudimos enviar tu opinión', removed: 'Opinión retirada' }}
    onSubmit={f => api('/api/milli/feedback', { method: 'POST', body: JSON.stringify({ threadId: getThreadId(), messageId, ...f }) }).then(() => undefined)}/>;
}

function Composer() {
  const aui = useAui();
  const running = useAuiState(s => s.thread.isRunning);
  const count = useAuiState(s => s.composer.attachments.length);
  const [error, setError] = useState<string | null>(null), [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const add = async (files: File[]) => {
    setError(null); let n = count;
    for (const file of files) {
      const why = rejectReason(file, n);
      if (why) { setError(why); continue; }
      try { await aui.composer.addAttachment(file); n++; } catch { setError(`No pudimos adjuntar «${file.name}».`); }
    }
  };
  const drop = (e: DragEvent) => { e.preventDefault(); setDragging(false); void add([...e.dataTransfer.files]); };
  return <ComposerPrimitive.Root className="relative grid gap-1.5" onDragOver={e => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); setDragging(true); } }} onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false); }} onDrop={drop}>
    <div className={cn('grid gap-2 rounded-[22px] bg-tile p-2 transition-shadow focus-within:ring-2 focus-within:ring-ring', dragging && 'ring-2 ring-primary')}>
      <div className="flex flex-wrap gap-1.5 empty:hidden"><ComposerPrimitive.Attachments components={{ Attachment: () => <CsvChip removable/> }}/></div>
      <ComposerPrimitive.Input rows={1} autoFocus placeholder="Pide a Milli un análisis, un mapa o un cálculo…" aria-label="Mensaje para Milli"
        className="max-h-40 min-h-9 w-full resize-none bg-transparent px-2 py-1.5 text-[13.5px] outline-none placeholder:text-muted-foreground"/>
      <div className="flex items-center gap-1.5">
        <input ref={input} type="file" accept=".csv,text/csv" multiple hidden onChange={e => { void add([...(e.target.files ?? [])]); e.target.value = ''; }}/>
        <button type="button" onClick={() => input.current?.click()} disabled={count >= LIMITS.files} className="flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs hover:bg-frame disabled:opacity-40">
          <Paperclip className="size-3.5"/>Adjuntar CSV
        </button>
        <span className="text-[11px] text-muted-foreground">Solo archivos CSV · hasta 2 MB · sin imágenes</span>
        <span className="flex-1"/>
        {running
          ? <ComposerPrimitive.Cancel className="grid size-9 place-items-center rounded-full bg-foreground text-background hover:opacity-90" aria-label="Detener a Milli"><Square className="size-3.5 fill-current"/></ComposerPrimitive.Cancel>
          : <ComposerPrimitive.Send className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40" aria-label="Enviar mensaje"><ArrowUp className="size-4"/></ComposerPrimitive.Send>}
      </div>
    </div>
    {dragging && <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-[22px] bg-primary-container/90 text-sm font-medium text-on-primary-container">Suelta tu CSV aquí · solo archivos CSV</div>}
    <AnimatePresence>{error && <motion.p key={error} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex items-center gap-1.5 rounded-xl bg-destructive/10 px-3 py-1.5 text-[12px] text-destructive">
      <X className="size-3.5 shrink-0"/><span className="flex-1">{error}</span><button type="button" onClick={() => setError(null)} className="underline underline-offset-2">Entendido</button>
    </motion.p>}</AnimatePresence>
  </ComposerPrimitive.Root>;
}
