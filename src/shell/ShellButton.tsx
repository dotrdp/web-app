// Round icon button with a tooltip, used by the tool pill and the popouts. Toggles
// (those given `pressed`) morph their icon into an X while active, unless `morph` is off.
import type { ReactNode } from 'react';
import MorphIcon from './MorphIcon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function ShellButton({ label, side = 'top', pressed, busy, disabled, shortcut, morph = true, className, children, onClick }: { label: string; side?: 'right' | 'left' | 'top' | 'bottom'; pressed?: boolean; busy?: boolean; disabled?: boolean; shortcut?: string; morph?: boolean; className?: string; children: ReactNode; onClick: () => void }) {
  return <Tooltip>
    <TooltipTrigger asChild>
      <button type="button" aria-label={label} aria-pressed={pressed} aria-busy={busy || undefined} disabled={disabled} onClick={onClick}
        className={cn('relative grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-tile hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 aria-pressed:bg-primary-container aria-pressed:text-on-primary-container pointer-coarse:size-11 [&_svg]:size-[18px]', busy && '[&_svg]:animate-pulse', className)}>{pressed === undefined || !morph ? children : <MorphIcon active={pressed}>{children}</MorphIcon>}</button>
    </TooltipTrigger>
    <TooltipContent side={side}>{label}{shortcut && <span className="ml-2 opacity-60">{shortcut}</span>}</TooltipContent>
  </Tooltip>;
}
