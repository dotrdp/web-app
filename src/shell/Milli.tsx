// Agente de IA Milli (milli is Náhuatl for crop): the barley mark as its avatar, its
// name and three dots that read as an agent ready to talk.
import { cn } from '@/lib/utils';
import { LogoMark } from '../Logo';

export const MILLI = 'Agente de IA Milli';

/** Barley mark on a round tinted badge. */
export function MilliAvatar({ size = 24 }: { size?: number }) {
  return <span className="inline-grid shrink-0 place-items-center rounded-full bg-primary-container" style={{ width: size, height: size }}>
    <LogoMark size={Math.round(size * .78)}/>
  </span>;
}

export function MilliName({ className }: { className?: string }) {
  return <span className={cn('inline-flex items-center gap-2 font-semibold whitespace-nowrap', className)}>
    {MILLI}
    <span aria-hidden="true" className="flex items-center gap-[3px]">{[1, .65, .35].map(o => <span key={o} className="size-1 rounded-full bg-primary" style={{ opacity: o }}/>)}</span>
  </span>;
}
