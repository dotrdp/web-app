// The task Milli declared for this answer (stealth Expandable Card): its goal, each step with a
// spinner that turns into a check, and the Exploración, an arrow that opens Milli's chain of
// thought, where every stretch of thinking spins while it streams and ticks when it's done.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronRight, Minus, X } from 'lucide-react';
import { ExpandableCard, ExpandableCardContent, ExpandableCardTrigger } from '@/components/ui/expandable-card';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { TaskView, Thought } from './parts';
import type { StepStatus } from './store';

const seconds = (t: Thought) => t.startedAt && t.completedAt ? Math.max(1, Math.round((t.completedAt - t.startedAt) / 1000)) : null;

/** Spinner while it runs, a check when it's done (or a cross / dash). */
export function StatusMark({ status, className }: { status: StepStatus; className?: string }) {
  return <span className={cn('relative grid size-4 shrink-0 place-items-center', className)} aria-hidden="true">
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span key={status} className="grid place-items-center" initial={{ scale: .4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .4, opacity: 0 }} transition={{ type: 'spring', bounce: .4, visualDuration: .3 }}>
        {status === 'running' ? <Spinner className="size-3.5 text-primary"/>
          : status === 'done' ? <span className="grid size-4 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-2.5" strokeWidth={3}/></span>
          : status === 'failed' ? <span className="grid size-4 place-items-center rounded-full bg-destructive text-white"><X className="size-2.5" strokeWidth={3}/></span>
          : status === 'skipped' ? <span className="grid size-4 place-items-center rounded-full bg-tile-strong text-muted-foreground"><Minus className="size-2.5" strokeWidth={3}/></span>
          : <span className="size-3 rounded-full border-[1.5px] border-muted-foreground/40"/>}
      </motion.span>
    </AnimatePresence>
  </span>;
}

/** Milli's thinking: one row per stretch of thought, spinning while it streams. Collapsible behind an arrow. */
export function Exploration({ thoughts, running, defaultOpen = false }: { thoughts: Thought[]; running: boolean; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  if (!thoughts.length) return null;
  const last = thoughts.at(-1)!, thinking = running && !last.completedAt;
  const total = thoughts.reduce((t, x) => t + (seconds(x) ?? 0), 0);
  return <section className="grid gap-1.5" aria-label="Exploración">
    <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="group flex w-fit items-center gap-1.5 rounded-full py-0.5 pr-2 text-xs text-muted-foreground hover:text-foreground">
      <ChevronRight className={cn('size-3.5 transition-transform duration-200', open && 'rotate-90')}/>
      <StatusMark status={thinking ? 'running' : 'done'} className="size-3.5"/>
      <span className="font-medium text-foreground">Exploración</span>
      <span>{thinking ? 'Milli está pensando…' : `${thoughts.length} ${thoughts.length === 1 ? 'paso' : 'pasos'} de razonamiento${total ? ` · ${total} s` : ''}`}</span>
    </button>
    <AnimatePresence initial={false}>
      {open && <motion.ol key="chain" className="relative ml-[7px] grid gap-2 overflow-hidden border-l border-border pl-4" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25, ease: [.4, 0, .2, 1] }}>
        {thoughts.map((t, i) => {
          const live = running && i === thoughts.length - 1 && !t.completedAt, s = seconds(t);
          return <li key={i} className="grid gap-0.5 pb-0.5 first:pt-1 last:pb-1">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <StatusMark status={live ? 'running' : 'done'} className="size-3.5"/>
              {t.kind === 'reasoning' ? (live ? 'Pensando…' : `Pensó${s ? ` ${s} s` : ''}`) : 'Milli dijo'}
            </span>
            <p className={cn('text-[12.5px] leading-relaxed text-pretty whitespace-pre-wrap', t.kind === 'reasoning' ? 'text-muted-foreground italic' : 'text-foreground')}>{t.text}</p>
          </li>;
        })}
      </motion.ol>}
    </AnimatePresence>
  </section>;
}

export default function TaskCard({ task, thoughts, running, finished }: { task: TaskView; thoughts: Thought[]; running: boolean; finished: boolean }) {
  const done = task.steps.filter(s => s.status === 'done' || s.status === 'skipped').length;
  // Once the run is over, a step still marked running is just no longer moving.
  const shown = (s: StepStatus): StepStatus => !running && s === 'running' ? (finished ? 'done' : 'pending') : s;
  return <ExpandableCard defaultOpen className="milli-task" aria-label={`Tarea: ${task.title}`}>
    <ExpandableCardTrigger className="gap-2.5 px-3.5 py-3">
      <StatusMark status={running ? 'running' : finished ? 'done' : 'pending'}/>
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="truncate text-[13px] font-medium text-fg">{task.title}</span>
        <span className="text-[11.5px] text-fg-3 tabular-nums">{running ? 'Milli está trabajando' : finished ? 'Terminado' : 'Detenido'} · {done} de {task.steps.length} pasos</span>
      </span>
    </ExpandableCardTrigger>
    <ExpandableCardContent>
      <div className="grid gap-3 px-3.5 pb-3.5">
        {task.goal && <p className="text-[12.5px] leading-relaxed text-pretty text-fg-2">{task.goal}</p>}
        <ol className="grid gap-1.5" aria-label="Pasos">
          {task.steps.map((s, i) => <li key={i} className="grid grid-cols-[1rem_1fr] items-start gap-x-2.5">
            <StatusMark status={shown(s.status)} className="mt-px"/>
            <span className={cn('text-[13px] leading-snug', shown(s.status) === 'pending' ? 'text-fg-3' : 'text-fg')}>{s.label}</span>
            {s.note && <span className="col-start-2 text-[11.5px] leading-snug text-fg-3">{s.note}</span>}
          </li>)}
        </ol>
        <Exploration thoughts={thoughts} running={running}/>
      </div>
    </ExpandableCardContent>
  </ExpandableCard>;
}
