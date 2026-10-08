// Adapted from Spectrum UI's loading-state and agent-steps (Apache-2.0).
// Changed for AgroCebada: CSS styling, Spanish status labels, real request timing,
// accessible announcements and reduced-motion behavior. See /licenses/spectrum-ui.txt.
import { useEffect, useId, useState } from 'react';
import type { CSSProperties } from 'react';
import { Check, ChevronDown, CircleDashed, X } from 'lucide-react';
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

export function LoadingDots({ className = '' }: { className?: string }) {
  return <span className={`loading-dots ${className}`} aria-hidden="true">{Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3), column = index % 3;
    return <span key={index} style={{ '--dot-delay': `${(column + Math.abs(row - 1)) * 90}ms` } as CSSProperties}/>;
  })}</span>;
}

export function LoadingState({ label, className = '', timer = true, startedAt }: { label: string; className?: string; timer?: boolean; startedAt?: number }) {
  const elapsed = useElapsed(timer, startedAt);
  return <div className={`loading-state ${className}`} role="status" aria-live="polite">
    <LoadingDots/><span className="loading-state-label">{label}</span>
    {timer && <span className="loading-elapsed" aria-hidden="true">{elapsed}</span>}
  </div>;
}

export function LoadingValue({ label, unit = '', active = true, className = '' }: { label: string; unit?: string; active?: boolean; className?: string }) {
  return <span className={`loading-value ${active ? '' : 'stopped'} ${className}`} role="img" aria-label={label}>
    <span className="loading-value-number">—</span>{unit && <small>{unit}</small>}<LoadingDots/>
  </span>;
}

function StepMarker({ status }: { status: AgentStatus }) {
  return <span className={`agent-step-marker ${status}`} aria-hidden="true">{status === 'success' ? <Check size={11} strokeWidth={3}/> : status === 'error' ? <X size={11} strokeWidth={3}/> : status === 'pending' ? <CircleDashed size={15}/> : <LoadingDots/>}</span>;
}

function StepRow({ step, compact }: { step: AgentStep; compact: boolean }) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const elapsed = useElapsed(step.status === 'running', step.startedAt, step.completedAt);
  const expandable = !compact && !!(step.result || step.children?.length);
  const heading = <><span className="agent-step-name">{step.name}</span><span className={`agent-step-status ${step.status}`}>{STATUS_LABELS[step.status]}</span>{step.startedAt !== undefined && <span className="agent-step-time" aria-hidden="true">{elapsed}</span>}{expandable && <ChevronDown size={13} className={open ? 'expanded' : ''} aria-hidden="true"/>}</>;
  return <li className={`agent-step ${step.status}`} data-step={step.id} data-status={step.status}>
    <StepMarker status={step.status}/><div className="agent-step-body">
      {expandable ? <button type="button" className="agent-step-heading" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={detailsId}>{heading}</button> : <div className="agent-step-heading">{heading}</div>}
      {step.detail && <p className="agent-step-detail">{step.detail}</p>}
      {expandable && open && <div className="agent-step-details" id={detailsId}>
        {step.result && <p className="agent-step-result">{step.result}</p>}
        {step.children && <ul className="agent-parallel-steps" aria-label={`Fuentes de ${step.name}`}>{step.children.map(child => <li key={child.id} data-step={child.id} data-status={child.status}>
          <div><StepMarker status={child.status}/><span>{child.name}</span><small>{STATUS_LABELS[child.status]}</small></div>{child.result && <p>{child.result}</p>}
        </li>)}</ul>}
      </div>}
    </div>
  </li>;
}

export function AgentSteps({ steps, compact = false, label = 'Pasos de preparación' }: { steps: AgentStep[]; compact?: boolean; label?: string }) {
  return <ol className={`agent-steps ${compact ? 'compact' : ''}`} aria-label={label}>{steps.map(step => <StepRow key={step.id} step={step} compact={compact}/>)}</ol>;
}
