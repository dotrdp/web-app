// The sliding background under the current option of a segmented control (Claro / Oscuro,
// years, sets, page tabs). Render it inside the active option only: Motion's shared layout
// moves the one pill between options. Option content needs `relative z-10` to stay above it.
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function ShiftPill({ id, className }: { id: string; className?: string }) {
  return <motion.span layoutId={id} aria-hidden="true" className={cn('absolute inset-0 rounded-[inherit]', className)} transition={{ type: 'spring', bounce: .2, visualDuration: .35 }}/>;
}
