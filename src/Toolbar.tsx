// React Aria grouping adapted from Intent UI (MIT: /licenses/intent-ui-MIT.txt).
// React Aria supplies toolbar keyboard navigation. Buttons use Stealth UI's
// icon-button implementation: /licenses/stealth-ui-MIT.txt.
import { createContext, use, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronsLeft, ChevronsUp } from 'lucide-react';
import { Group, type GroupProps } from 'react-aria-components/Group';
import { Separator, type SeparatorProps } from 'react-aria-components/Separator';
import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import { Toolbar as ToolbarPrimitive, type ToolbarProps as ToolbarPrimitiveProps } from 'react-aria-components/Toolbar';
import { IconButton, IconButtonProvider, type IconButtonProps } from './IconButton';
import './map-toolbar.css';

interface ToolbarProps extends ToolbarPrimitiveProps { isDisabled?: boolean }
const ToolbarContext = createContext<Pick<ToolbarProps, 'orientation' | 'isDisabled'>>({ orientation: 'horizontal' });
const ToolbarGroupContext = createContext<{ isDisabled?: boolean }>({});
const classes = (...values: (string | undefined | false)[]) => values.filter(Boolean).join(' ');
const ToolbarLayoutContext = createContext<{ compact: Record<string, boolean>; change: (name: string, compact: boolean) => void } | null>(null);

export function ToolbarLayoutProvider({ children }: { children: ReactNode }) {
  const [compact, setCompact] = useState<Record<string, boolean>>({});
  return <ToolbarLayoutContext value={{ compact, change: (name, value) => setCompact(current => ({ ...current, [name]: value })) }}>
    <IconButtonProvider>{children}</IconButtonProvider>
  </ToolbarLayoutContext>;
}

export function Toolbar({ orientation = 'horizontal', isDisabled, className, ...props }: ToolbarProps) {
  return <ToolbarContext value={{ orientation, isDisabled }}>
    <ToolbarPrimitive {...props} orientation={orientation} data-disabled={isDisabled || undefined}
      className={composeRenderProps(className, value => classes('map-icon-toolbar', value))}/>
  </ToolbarContext>;
}

interface CompactToolbarProps extends Omit<ToolbarProps, 'className' | 'children'> {
  className?: string;
  toolbarClassName?: string;
  compactIcon: ReactNode;
  compactLabel: string;
  children: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  'aria-label': string;
}
export function CompactToolbar({ className, toolbarClassName, compactIcon, compactLabel, leading, trailing, children, orientation = 'horizontal', ...props }: CompactToolbarProps) {
  const layout = use(ToolbarLayoutContext), [localCompact, setLocalCompact] = useState(false);
  const name = props['aria-label'], compact = layout?.compact[name] ?? localCompact;
  const contentId = useId(), expand = useRef<HTMLButtonElement>(null), collapse = useRef<HTMLButtonElement>(null), focusPending = useRef(false);
  function change(value: boolean) { focusPending.current = true; if (layout) layout.change(name, value); else setLocalCompact(value); }
  useLayoutEffect(() => {
    if (!focusPending.current) return;
    (compact ? expand : collapse).current?.focus(); focusPending.current = false;
  }, [compact]);
  return <div className={classes('compact-toolbar', className)} data-compact={compact} data-orientation={orientation}>
    <div className="compact-toolbar-content" id={contentId} hidden={compact}>
      {leading && <div className="compact-toolbar-leading">{leading}</div>}
      <Toolbar {...props} orientation={orientation} className={classes('compact-toolbar-expanded', toolbarClassName)}>
        {children}
        <ToolbarGroup className="toolbar-compact-controls" aria-label="Visibilidad de la barra">
          <IconButton ref={collapse} className="toolbar-compact-toggle" label={`Contraer barra: ${name}`}
            tooltip={`Contraer ${name}`} tooltipSide={orientation === 'vertical' ? 'right' : 'top'}
            aria-expanded={true} aria-controls={contentId} onClick={() => change(true)}>
            {orientation === 'vertical' ? <ChevronsUp/> : <ChevronsLeft/>}
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
      {trailing}
    </div>
    {compact && <IconButton ref={expand} className="toolbar-compact-summary" label={`Expandir barra: ${name}`}
      tooltip={`${compactLabel} · Expandir ${name}`} tooltipSide={orientation === 'vertical' ? 'right' : 'top'}
      aria-expanded={false} aria-controls={contentId} onClick={() => change(false)}>{compactIcon}</IconButton>}
  </div>;
}

export function ToolbarGroup({ isDisabled, className, ...props }: GroupProps) {
  const toolbar = use(ToolbarContext), disabled = isDisabled || toolbar.isDisabled;
  return <ToolbarGroupContext value={{ isDisabled: disabled }}>
    <Group {...props} isDisabled={disabled} className={composeRenderProps(className, value => classes('map-icon-toolbar-group', value))}/>
  </ToolbarGroupContext>;
}

interface ToolbarButtonProps extends IconButtonProps { isDisabled?: boolean }
export function ToolbarButton({ isDisabled, disabled, ...props }: ToolbarButtonProps) {
  const toolbar = use(ToolbarContext), group = use(ToolbarGroupContext);
  return <IconButton {...props} disabled={disabled || isDisabled || group.isDisabled || toolbar.isDisabled}/>;
}

interface ToolbarItemProps extends Omit<ToolbarButtonProps, 'onChange'> { isSelected: boolean; onChange: (selected: boolean) => void }
export function ToolbarItem({ isSelected, onChange, ...props }: ToolbarItemProps) {
  return <ToolbarButton {...props} aria-pressed={isSelected} onClick={() => onChange(!isSelected)}/>;
}

export function ToolbarSeparator({ className, ...props }: SeparatorProps) {
  const { orientation } = use(ToolbarContext);
  return <Separator {...props} orientation={orientation === 'vertical' ? 'horizontal' : 'vertical'} className={classes('map-icon-toolbar-separator', className)}/>;
}
