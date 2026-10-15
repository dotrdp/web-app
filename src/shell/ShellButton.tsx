// Round icon button with a tooltip, used by the tool pill and the popouts.
import type { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function ShellButton({ label, side = 'top', pressed, busy, disabled, className, children, onClick }: { label: string; side?: 'right' | 'left' | 'top' | 'bottom'; pressed?: boolean; busy?: boolean; disabled?: boolean; className?: string; children: ReactNode; onClick: () => void }) {
  return <Tooltip>
    <TooltipTrigger asChild>
      <button type="button" aria-label={label} aria-pressed={pressed} aria-busy={busy || undefined} disabled={disabled} onClick={onClick}
        className={cn('relative grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-tile hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 aria-pressed:bg-primary-container aria-pressed:text-on-primary-container pointer-coarse:size-11 [&_svg]:size-[18px]', busy && '[&_svg]:animate-pulse', className)}>{children}</button>
    </TooltipTrigger>
    <TooltipContent side={side}>{label}</TooltipContent>
  </Tooltip>;
}
