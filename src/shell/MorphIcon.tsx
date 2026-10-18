// Icon morph shared by every toggle: the glyph turns, shrinks and blurs into its active
// form (an X by default, so an open panel or a running tool reads as "close"), and back.
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function MorphIcon({ active, children, activeIcon = <X/> }: { active: boolean; children: ReactNode; activeIcon?: ReactNode }) {
  return <AnimatePresence mode="popLayout" initial={false}>
    <motion.span key={active ? 'active' : 'idle'} className="grid place-items-center"
      initial={{ opacity: 0, scale: .4, rotate: -90, filter: 'blur(4px)' }} animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: .4, rotate: 90, filter: 'blur(4px)' }}
      transition={{ type: 'spring', bounce: .3, visualDuration: .35 }}>
      {active ? activeIcon : children}
    </motion.span>
  </AnimatePresence>;
}
