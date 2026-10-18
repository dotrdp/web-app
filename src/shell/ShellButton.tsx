// Round icon button with a tooltip, used by the tool pill and the popouts. Toggles
// (those given `pressed`) morph their icon into an X while active, unless `morph` is off.
// A `hotkey` shows as a small number in the button's lower-left corner (the button grows a
// little so it clears the icon) and in its tooltip.
import type { ReactNode } from 'react';
import MorphIcon from './MorphIcon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function ShellButton({ label, side = 'top', pressed, busy, disabled, shortcut, hotkey, morph = true, className, children, onClick }: { label: string; side?: 'right' | 'left' | 'top' | 'bottom'; pressed?: boolean; busy?: boolean; disabled?: boolean; shortcut?: string; hotkey?: string; morph?: boolean; className?: string; children: ReactNode; onClick: () => void }) {
  return <Tooltip>
    <TooltipTrigger asChild>
      <button type="button" aria-label={label} aria-keyshortcuts={hotkey} aria-pressed={pressed} aria-busy={busy || undefined} disabled={disabled} onClick={onClick}
        className={cn('relative grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-tile hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 aria-pressed:bg-primary-container aria-pressed:text-on-primary-container pointer-coarse:size-11 [&_svg]:size-[18px]', busy && '[&_svg]:animate-pulse', hotkey && 'size-10', className)}>{pressed === undefined || !morph ? children : <MorphIcon active={pressed}>{children}</MorphIcon>}
        {hotkey && <span aria-hidden="true" className="pointer-events-none absolute bottom-[2px] left-[3px] text-[9px] leading-none font-medium tabular-nums opacity-70">{hotkey}</span>}</button>
    </TooltipTrigger>
    <TooltipContent side={side}>{label}{(shortcut ?? hotkey) && <span className="ml-2 opacity-60">{shortcut ?? hotkey}</span>}</TooltipContent>
  </Tooltip>;
}
