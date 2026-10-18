// Milli-IA's identity (milli is Náhuatl for crop): the barley mark as its avatar and a
// sparkle that twinkles once on arrival and again when something new comes in.
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { LogoMark } from '../Logo';

/** Barley avatar. Bump `twinkle` to replay the sparkle; `unread` shows a dot. */
export function MilliAvatar({ size = 24, twinkle = 0, unread = false }: { size?: number; twinkle?: number; unread?: boolean }) {
  return <span className="relative inline-grid shrink-0 place-items-center rounded-full bg-primary-container" style={{ width: size, height: size }}>
    <LogoMark size={Math.round(size * .78)}/>
    <motion.span key={twinkle} aria-hidden="true" className="milli-sparkle absolute -top-1.5 -right-1.5 grid place-items-center text-primary"
      initial={{ opacity: 0, scale: 0, rotate: -45 }} animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.25, 1, .6], rotate: [-45, 20, 45, 90] }} transition={{ duration: 1.1, times: [0, .3, .7, 1], ease: 'easeOut', delay: .25 }}>
      <Sparkles className="size-3 fill-current"/>
    </motion.span>
    {unread && <span aria-hidden="true" className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-destructive ring-2 ring-frame"/>}
  </span>;
}

export function MilliName({ className }: { className?: string }) {
  return <span className={cn('font-semibold whitespace-nowrap', className)}>Milli-IA</span>;
}
