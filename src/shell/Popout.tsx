// A popout attached to one or two edges of the map viewport. It shares the frame
// colour, keeps square corners where it touches an edge and joins each edge with
// concave fillets, so it reads as part of the frame (Caelestia's drawers).
import type { CSSProperties, ReactNode } from 'react';
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

export default function Popout({ edges, radius = 20, className, style, children, label, id, animate = true, role = 'region' }: { edges: Edge | Edge[]; radius?: number; className?: string; style?: CSSProperties; children: ReactNode; label?: string; id?: string; animate?: boolean; role?: string }) {
  const attached = Array.isArray(edges) ? edges : [edges];
  const primary = attached[0];
  const corners = { 'top-left': ['top', 'left'], 'top-right': ['top', 'right'], 'bottom-left': ['bottom', 'left'], 'bottom-right': ['bottom', 'right'] } as const;
  const radii = Object.fromEntries(Object.entries(corners).map(([corner, sides]) => [`border${corner.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('')}Radius`, sides.some(s => attached.includes(s)) ? 0 : radius]));
  const fillets = attached.flatMap(edge => ENDS[edge].filter(end => !attached.includes(end)).map(end => ({ key: `${edge}-${end}`, style: fillet(edge, end, radius) })));
  return <div id={id} role={role} aria-label={label} data-edge={primary} data-animate={animate} className={cn('popout', className)} style={{ ...radii, '--r': `${radius}px`, ...style } as CSSProperties}>
    {fillets.map(f => <span key={f.key} aria-hidden="true" className="fillet" style={f.style}/>)}
    <div className="popout-body">{children}</div>
  </div>;
}
