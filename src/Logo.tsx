// AgroCebada mark: an ear of barley. It is the seed of the interface: the tile takes
// the scheme's primary tone, so every palette (Cebada, Trigo, Tierra, Noche, Laguna)
// starts from the logo. /favicon.svg keeps the original green.
import { cn } from '@/lib/utils';

const GRAINS: [number, number, number][] = [[12.9, 20.6, -38], [19.1, 20.6, 38], [12.9, 15.6, -38], [19.1, 15.6, 38], [13.2, 10.8, -34], [18.8, 10.8, 34]];

export function LogoMark({ size = 28, tone = 'brand', grow = false, className }: { size?: number; tone?: 'brand' | 'light' | 'bare'; grow?: boolean; className?: string }) {
  const tile = tone === 'brand' ? 'var(--primary)' : tone === 'light' ? '#ffffff' : 'none';
  const ink = tone === 'brand' ? 'var(--primary-foreground)' : tone === 'light' ? '#1e6b47' : 'currentColor';
  return <svg className={cn('logo-mark', grow && 'logo-grow', className)} width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" rx="16" fill={tile} style={{ transition: 'fill .4s' }}/>
    <path d="M16 27V9.5" stroke={ink} strokeWidth="1.6" strokeLinecap="round"/>
    {GRAINS.map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx="2.15" ry="3.5" fill={ink} transform={`rotate(${r} ${x} ${y})`} style={{ '--i': i } as React.CSSProperties}/>)}
    <ellipse cx="16" cy="7.2" rx="1.9" ry="3" fill={ink} style={{ '--i': 6 } as React.CSSProperties}/>
    <path d="M10.6 9.2 8.4 5.6M21.4 9.2l2.2-3.6" stroke={ink} strokeWidth="1.1" strokeLinecap="round" opacity=".7"/>
  </svg>;
}

export function Logo({ size = 28, subtitle = true, tone = 'brand' }: { size?: number; subtitle?: boolean; tone?: 'brand' | 'light' }) {
  return <span className="inline-flex items-center gap-2.5" data-tone={tone}><LogoMark size={size} tone={tone}/><span className={`grid leading-tight ${tone === 'light' ? 'text-white' : 'text-foreground'}`}><span className="text-[15px] font-semibold tracking-tight">AgroCebada</span>{subtitle && <span className={`text-xs ${tone === 'light' ? 'text-white/70' : 'text-muted-foreground'}`}>Atlas FIRA 2026</span>}</span></span>;
}
