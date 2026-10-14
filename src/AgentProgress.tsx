// Adapted from Spectrum UI's loading-state and agent-steps (Apache-2.0).
// Changed for AgroCebada: shadcn/ui tokens and Badge, Spanish status labels, real
// request timing, accessible announcements and reduced-motion behavior.
// See /licenses/spectrum-ui.txt.
import { useEffect, useId, useState } from 'react';
import type { CSSProperties } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import './agent-progress.css';

export type AgentStatus = 'pending' | 'running' | 'success' | 'error';
export interface AgentStep {
  id: string;
  name: string;
  status: AgentStatus;
  detail?: string;
  result?: string;
  startedAt?: number;
  completedAt?: number;
  children?: AgentStep[];
}
const STATUS_LABELS: Record<AgentStatus, string> = { pending: 'En espera', running: 'En curso', success: 'Listo', error: 'Error' };
const STATUS_BADGES: Record<AgentStatus, string> = {
  pending: 'border-border bg-transparent text-muted-foreground',
  running: 'bg-secondary text-secondary-foreground',
  success: 'bg-brand/10 text-brand dark:bg-brand/20',
  error: 'bg-destructive/10 text-destructive',
};

function formatDuration(ms: number) {
  const seconds = Math.max(0, ms) / 1000;
  return seconds < 60 ? `${seconds.toFixed(1)} s` : `${Math.floor(seconds / 60)} min ${Math.floor(seconds % 60)} s`;
}
function useElapsed(active: boolean, startedAt?: number, completedAt?: number) {
  const [mountedAt] = useState(() => performance.now());
  const [now, setNow] = useState(() => performance.now());
  useEffect(() => {
    if (!active) return;
    setNow(performance.now());
    const timer = window.setInterval(() => setNow(performance.now()), 100);
    return () => clearInterval(timer);
  }, [active, startedAt]);
  return formatDuration((completedAt ?? now) - (startedAt ?? mountedAt));
}

/** Nine dots pulsing outward from the middle column. */
export function LoadingDots({ className = '' }: { className?: string }) {
  return <span className={cn('loading-dots', className)} aria-hidden="true">{Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3), column = index % 3;
    return <span key={index} style={{ '--dot-delay': `${(column + Math.abs(row - 1)) * 90}ms` } as CSSProperties}/>;
  })}</span>;
}

export function LoadingState({ label, className = '', timer = true, startedAt }: { label: string; className?: string; timer?: boolean; startedAt?: number }) {
  const elapsed = useElapsed(timer, startedAt);
  return <div className={cn('loading-state', className)} role="status" aria-live="polite">
    <LoadingDots/><span className="loading-state-label">{label}</span>
    {timer && <span className="loading-elapsed" aria-hidden="true">{elapsed}</span>}
  </div>;
}

export function LoadingValue({ label, unit = '', active = true, className = '' }: { label: string; unit?: string; active?: boolean; className?: string }) {
  return <span className={cn('loading-value', !active && 'stopped', className)} role="img" aria-label={label}>
    <span className="loading-value-number">—</span>{unit && <small>{unit}</small>}<LoadingDots/>
  </span>;
}

function StepMarker({ status, small = false }: { status: AgentStatus; small?: boolean }) {
  return <span aria-hidden="true" data-status={status} className={cn(
    'agent-step-marker relative z-10 grid shrink-0 place-items-center rounded-full border bg-background text-muted-foreground',
    small ? 'size-4 [&_svg]:size-2.5' : 'size-6 [&_svg]:size-3',
    status === 'pending' && 'border-dashed border-muted-foreground/40',
    status === 'running' && 'border-border text-foreground',
    status === 'success' && 'border-brand bg-brand text-brand-foreground',
    status === 'error' && 'border-destructive/30 bg-destructive/10 text-destructive',
  )}>
    {status === 'success' ? <Check strokeWidth={3}/> : status === 'error' ? <X strokeWidth={3}/> : status === 'running' ? <LoadingDots className={small ? 'scale-[.6]' : 'scale-[.8]'}/> : null}
  </span>;
}

function StatusBadge({ status }: { status: AgentStatus }) {
  return <Badge variant="outline" className={cn('agent-step-status h-[18px] shrink-0 px-1.5 text-[11px] font-medium', status, STATUS_BADGES[status], status !== 'pending' && 'border-transparent')}>{STATUS_LABELS[status]}</Badge>;
}

function StepRow({ step, compact }: { step: AgentStep; compact: boolean }) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const elapsed = useElapsed(step.status === 'running', step.startedAt, step.completedAt);
  const expandable = !compact && !!(step.result || step.children?.length);
  const heading = <>
    <span className="agent-step-name min-w-0 text-sm leading-snug font-medium">{step.name}</span>
    <StatusBadge status={step.status}/>
    {step.startedAt !== undefined && <span className="agent-step-time ml-auto shrink-0 font-mono text-xs whitespace-nowrap text-muted-foreground tabular-nums" aria-hidden="true">{elapsed}</span>}
    {expandable && <ChevronDown aria-hidden="true" className={cn('size-3.5 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none', step.startedAt === undefined && 'ml-auto', open && 'rotate-180')}/>}
  </>;
  const headingClass = 'agent-step-heading flex min-h-6 w-full min-w-0 items-center gap-2 text-left';
  return <li data-step={step.id} data-status={step.status} className={cn(
    'agent-step relative flex gap-3 last:[&>.agent-step-body]:pb-0', step.status,
    'not-last:before:absolute not-last:before:top-7 not-last:before:bottom-1 not-last:before:left-[11.5px] not-last:before:w-px not-last:before:bg-border',
    step.status === 'success' && 'not-last:before:bg-brand/40',
  )}>
    <StepMarker status={step.status}/>
    <div className={cn('agent-step-body min-w-0 flex-1', compact ? 'pb-3' : 'pb-5')}>
      {expandable
        ? <button type="button" className={cn(headingClass, '-mx-1.5 -my-1 w-[calc(100%+0.75rem)] cursor-pointer rounded-md px-1.5 py-1 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 max-md:min-h-10')} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={detailsId}>{heading}</button>
        : <div className={headingClass}>{heading}</div>}
      {step.detail && <p className="agent-step-detail mt-0.5 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>}
      {expandable && open && <div className="agent-step-details mt-2 flex flex-col gap-2" id={detailsId}>
        {step.result && <p className="agent-step-result rounded-md bg-muted px-3 py-2 text-xs leading-relaxed text-muted-foreground">{step.result}</p>}
        {step.children && <ul className="agent-parallel-steps grid gap-1.5" aria-label={`Fuentes de ${step.name}`}>{step.children.map(child => <li key={child.id} data-step={child.id} data-status={child.status} className="rounded-md border px-2.5 py-2">
          <div className="flex items-center gap-2 text-xs"><StepMarker status={child.status} small/><span className="min-w-0 flex-1 truncate font-medium">{child.name}</span><StatusBadge status={child.status}/></div>
          {child.result && <p className="mt-1 pl-6 text-xs leading-relaxed text-muted-foreground">{child.result}</p>}
        </li>)}</ul>}
      </div>}
    </div>
  </li>;
}

export function AgentSteps({ steps, compact = false, label = 'Pasos de preparación' }: { steps: AgentStep[]; compact?: boolean; label?: string }) {
  return <ol className={cn('agent-steps w-full text-left', compact && 'compact')} aria-label={label}>{steps.map(step => <StepRow key={step.id} step={step} compact={compact}/>)}</ol>;
}
