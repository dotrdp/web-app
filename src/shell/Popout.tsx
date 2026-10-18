// A popout attached to one or two edges of the map viewport. It shares the frame
// colour, keeps square corners where it touches an edge and joins each edge with
// concave fillets, so it reads as part of the frame (Caelestia's drawers).
import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { animate, motion, useMotionValue, usePresence, useTransform, type MotionStyle } from 'motion/react';
import { cn } from '@/lib/utils';
import './shell.css';

export type Edge = 'top' | 'bottom' | 'left' | 'right';
const OPPOSITE: Record<Edge, Edge> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const ENDS: Record<Edge, [Edge, Edge]> = { top: ['left', 'right'], bottom: ['left', 'right'], left: ['top', 'bottom'], right: ['top', 'bottom'] };

/** Fillet at `end` of an edge: the quarter circle is cut toward the free side. */
function fillet(edge: Edge, end: Edge, r: number): CSSProperties {
  const at = (side: Edge) => side === 'left' || side === 'top' ? '0' : '100%';
  const style: CSSProperties = { [edge]: 0, [end]: -r };
  // The cut-out circle is centred away from both the edge and the popout.
  const x = edge === 'left' || edge === 'right' ? at(OPPOSITE[edge]) : at(end);
  const y = edge === 'top' || edge === 'bottom' ? at(OPPOSITE[edge]) : at(end);
  style.background = `radial-gradient(circle at ${x} ${y}, transparent ${r - .5}px, var(--frame) ${r}px)`;
  return style;
}

/** A blob swelling out of `edge`: a rounded nub that springs into the full panel. When an
 *  AnimatePresence parent removes it, its content fades first, then it narrows linearly
 *  along the horizontal axis until it merges into the frame. */
function useBlob(edge: Edge, enabled: boolean) {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const p = useMotionValue(enabled && !reduced ? 0 : 1);
  const width = useMotionValue(1), content = useMotionValue(1);
  const [present, safeToRemove] = usePresence();
  useEffect(() => {
    if (present) {
      const controls = [animate(p, 1, { type: 'spring', bounce: .38, visualDuration: .5 }), animate(width, 1, { duration: .2 }), animate(content, 1, { duration: .15 })];
      return () => controls.forEach(c => c.stop());
    }
    if (!enabled || reduced) { safeToRemove?.(); return; }
    let merge: ReturnType<typeof animate> | undefined;
    const fade = animate(content, 0, { duration: .14, ease: 'linear' });
    fade.then(() => { merge = animate(width, 0, { duration: .26, ease: 'linear' }); merge.then(() => safeToRemove?.()); });
    return () => { fade.stop(); merge?.stop(); };
  }, [present]); // eslint-disable-line react-hooks/exhaustive-deps
  const vertical = edge === 'top' || edge === 'bottom';
  // Inset per side: flush on the edge, growing from it on the far side, narrowing toward the middle
  // along it; the negative 40px at rest keeps the fillets visible. On exit the left and right
  // insets close in: toward the edge for side panels, toward the centre for top and bottom ones.
  const clipPath = useTransform([p, width], ([v, w]: number[]) => {
    const free = `calc(${(1 - v) * 100}% - ${40 * v}px)`, along = `calc(${(1 - v) * 38}% - ${40 * v}px)`;
    const merging = () => vertical ? `calc(${(1 - w) * 50}% - ${40 * w}px)` : `calc(${(1 - w) * 100}% - ${40 * w}px)`;
    const side = (s: Edge) => s === edge ? '0px' : w < 1 && (s === 'left' || s === 'right') ? merging() : s === OPPOSITE[edge] ? free : along;
    const r = `${Math.max(0, 1 - v) * 240}px`;
    const corner = (a: Edge, b: Edge) => a === edge || b === edge ? '0px' : r;
    return `inset(${side('top')} ${side('right')} ${side('bottom')} ${side('left')} round ${corner('top', 'left')} ${corner('top', 'right')} ${corner('bottom', 'right')} ${corner('bottom', 'left')})`;
  });
  // A slight stretch away from the edge, so the overshoot reads as a wobble.
  const stretch = useTransform(p, v => .8 + .2 * v);
  return { style: { clipPath, transformOrigin: edge, [vertical ? 'scaleY' : 'scaleX']: stretch, pointerEvents: present ? undefined : 'none' } as MotionStyle, content };
}

export default function Popout({ edges, radius = 20, className, style, children, label, id, animate = true, role = 'region' }: { edges: Edge | Edge[]; radius?: number; className?: string; style?: CSSProperties; children: ReactNode; label?: string; id?: string; animate?: boolean; role?: string }) {
  const attached = Array.isArray(edges) ? edges : [edges];
  const primary = attached[0];
  const corners = { 'top-left': ['top', 'left'], 'top-right': ['top', 'right'], 'bottom-left': ['bottom', 'left'], 'bottom-right': ['bottom', 'right'] } as const;
  const radii = Object.fromEntries(Object.entries(corners).map(([corner, sides]) => [`border${corner.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('')}Radius`, sides.some(s => attached.includes(s)) ? 0 : radius]));
  const fillets = attached.flatMap(edge => ENDS[edge].filter(end => !attached.includes(end)).map(end => ({ key: `${edge}-${end}`, style: fillet(edge, end, radius) })));
  const blob = useBlob(primary, animate);
  return <motion.div id={id} role={role} aria-label={label} data-edge={primary} data-animate={animate} className={cn('popout', className)} style={{ ...radii, '--r': `${radius}px`, ...style, ...blob.style } as MotionStyle}>
    {fillets.map(f => <span key={f.key} aria-hidden="true" className="fillet" style={f.style}/>)}
    <motion.div className="popout-body" style={{ opacity: blob.content }}>{children}</motion.div>
  </motion.div>;
}
