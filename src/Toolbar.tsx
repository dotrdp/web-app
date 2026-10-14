// React Aria grouping adapted from Intent UI (MIT: /licenses/intent-ui-MIT.txt).
// React Aria supplies toolbar keyboard navigation. Buttons use Stealth UI's
// icon-button implementation: /licenses/stealth-ui-MIT.txt.
import { createContext, use, type ReactNode } from 'react';
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
/** Shares one tooltip timing context across every map control. */
export function ToolbarLayoutProvider({ children }: { children: ReactNode }) {
  return <IconButtonProvider>{children}</IconButtonProvider>;
}

export function Toolbar({ orientation = 'horizontal', isDisabled, className, ...props }: ToolbarProps) {
  return <ToolbarContext value={{ orientation, isDisabled }}>
    <ToolbarPrimitive {...props} orientation={orientation} data-disabled={isDisabled || undefined}
      className={composeRenderProps(className, value => classes('map-icon-toolbar', value))}/>
  </ToolbarContext>;
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
