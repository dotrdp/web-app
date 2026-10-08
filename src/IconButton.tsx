// Adapted from Stealth UI, copyright (c) 2026 Paragon.
// MIT license: /licenses/stealth-ui-MIT.txt.
// https://www.stealth.pm/ui/icon-button
import { Tooltip } from '@base-ui/react/tooltip';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useId, useState, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import './stealth-controls.css';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';
export type IconButtonProps = Omit<ComponentProps<'button'>, 'children' | 'aria-label'> & {
  label: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'secondary';
  tooltip?: boolean | ReactNode;
  shortcut?: string;
  tooltipSide?: TooltipSide;
  loading?: boolean;
};

export function IconButtonProvider({ children }: { children: ReactNode }) {
  return <Tooltip.Provider delay={500} closeDelay={0} timeout={400}>{children}</Tooltip.Provider>;
}

export function ActionTooltip({ content, shortcut, side = 'top', disabled, children }: {
  content: ReactNode; shortcut?: string; side?: TooltipSide; disabled?: boolean; children: ReactElement;
}) {
  const id = useId(), [open, setOpen] = useState(false);
  return <Tooltip.Root disabled={disabled} onOpenChange={setOpen}>
    <Tooltip.Trigger aria-describedby={open ? id : undefined} render={children}/>
    <Tooltip.Portal>
      <Tooltip.Positioner side={side} sideOffset={6} collisionPadding={8} className="stealth-tooltip-positioner">
        <Tooltip.Popup role="tooltip" id={id} aria-hidden={!open} className="stealth-tooltip">
          {content}{shortcut && <kbd>{shortcut.split(' ').map((key, i) => <span key={i}>{key}</span>)}</kbd>}
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>;
}

const spring = { type: 'spring', stiffness: 420, damping: 20, mass: .7 } as const;
const swap = {
  initial: { opacity: 0, scale: .6, filter: 'blur(3px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: .6, filter: 'blur(3px)' },
};

export function IconButton({ label, children, size = 'md', variant = 'ghost', tooltip = true,
  shortcut, tooltipSide = 'top', loading = false, disabled, className, onClick, ref, ...rest }: IconButtonProps) {
  const reduce = useReducedMotion();
  const button = <motion.button
    {...(rest as ComponentProps<typeof motion.button>)} ref={ref} type="button" aria-label={label}
    aria-busy={loading || undefined} aria-disabled={loading || undefined} disabled={disabled}
    data-slot="icon-button" data-size={size} data-variant={variant} data-busy={loading || undefined}
    className={['stealth-icon-button', className].filter(Boolean).join(' ')}
    whileTap={loading || disabled || reduce ? {} : { scale: .92, transition: { duration: .08 } }}
    transition={spring} onClick={event => { if (loading) event.preventDefault(); else onClick?.(event); }}>
    <AnimatePresence initial={false}>
      <motion.span key={loading ? 'busy' : 'icon'} aria-hidden="true" className="stealth-button-content"
        initial={reduce ? { opacity: 0 } : swap.initial} animate={swap.animate}
        exit={reduce ? { opacity: 0 } : swap.exit}
        transition={reduce ? { duration: .12 } : { type: 'spring', stiffness: 600, damping: 30, mass: .6 }}>
        {loading ? <svg className="stealth-spinner" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeOpacity=".22" strokeWidth="1.5"/><path d="M8 2.25A5.75 5.75 0 0 1 13.75 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> : children}
      </motion.span>
    </AnimatePresence>
  </motion.button>;
  if (!tooltip) return button;
  return <ActionTooltip content={tooltip === true ? label : tooltip} shortcut={shortcut} side={tooltipSide} disabled={disabled}>{button}</ActionTooltip>;
}
