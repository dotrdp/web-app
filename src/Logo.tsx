// AgroCebada mark: three ears of barley drawn in lines only (stems and leaves, chevron
// grains, fine awns). The ink takes the scheme's primary tone, so every palette
// (Cebada, Trigo, Tierra, Noche, Laguna) starts from the logo. /favicon.svg keeps the
// original green.
import { cn } from '@/lib/utils';

const STEMS = 'M16 30.5C16 24 16.1 18.5 16.4 15 M15.8 30.5C15.4 25.5 13.9 21.2 12.2 17.6 M16.2 30.5C16.8 26 18.3 22.4 20 19.2 M15.9 28.6C13.2 26.4 10.4 23.4 8.6 18.8 M16.1 27.4C18.6 25.6 21.6 23.4 24.4 19.6';
const AWNS = 'M15.59 11.7 15.47 7.71 M17.74 11.88 18.72 7.98 M15.81 9.84 15.73 5.49 M17.83 10.01 18.84 5.75 M16.04 7.98 15.98 3.27 M17.92 8.13 18.96 3.52 M16.26 6.12 16.23 1.05 M18.01 6.26 19.07 1.29 M16.49 4.26 16.49 -1.17 M18.09 4.39 19.19 -0.95 M17.2 5.4 17.62 1.61 M10 14.95 7.9 11.46 M12.01 14.16 10.93 10.27 M9.36 13.13 7.13 9.31 M11.25 12.39 10.04 8.17 M8.73 11.32 6.36 7.16 M10.49 10.63 9.14 6.07 M8.09 9.5 5.59 5.01 M9.72 8.87 8.25 3.97 M7.46 7.69 4.83 2.86 M8.96 7.1 7.35 1.87 M8.6 8.4 7.07 4.86 M20.22 15.87 21.45 12 M22.22 16.7 24.45 13.26 M20.99 14.22 22.35 10.03 M22.85 15.01 25.23 11.23 M21.75 12.58 23.25 8.05 M23.49 13.31 26 9.2 M22.51 10.94 24.15 6.07 M24.12 11.61 26.78 7.17 M23.27 9.29 25.05 4.1 M24.76 9.91 27.55 5.15 M23.6 10.6 25.27 7.09';
// Listed ear by ear, base to tip; the loading animation grows them in that order.
const GRAINS = [
  'M15.37 13.56 16.4 15 17.66 13.75',
  'M15.59 11.7 16.56 13.08 17.74 11.88',
  'M15.81 9.84 16.72 11.16 17.83 10.01',
  'M16.04 7.98 16.88 9.24 17.92 8.13',
  'M16.26 6.12 17.04 7.32 18.01 6.26',
  'M16.49 4.26 17.2 5.4 18.09 4.39',
  'M10.64 16.76 12.2 17.6 12.78 15.92',
  'M10 14.95 11.48 15.76 12.01 14.16',
  'M9.36 13.13 10.76 13.92 11.25 12.39',
  'M8.73 11.32 10.04 12.08 10.49 10.63',
  'M8.09 9.5 9.32 10.24 9.72 8.87',
  'M7.46 7.69 8.6 8.4 8.96 7.1',
  'M19.46 17.51 20 19.2 21.58 18.4',
  'M20.22 15.87 20.72 17.48 22.22 16.7',
  'M20.99 14.22 21.44 15.76 22.85 15.01',
  'M21.75 12.58 22.16 14.04 23.49 13.31',
  'M22.51 10.94 22.88 12.32 24.12 11.61',
  'M23.27 9.29 23.6 10.6 24.76 9.91',
];

export function LogoMark({ size = 28, tone = 'brand', grow = false, className }: { size?: number; tone?: 'brand' | 'light' | 'bare'; grow?: boolean; className?: string }) {
  const ink = tone === 'brand' ? 'var(--primary)' : tone === 'light' ? '#ffffff' : 'currentColor';
  return <svg className={cn('logo-mark', grow && 'logo-grow', className)} width={size} height={size} viewBox="-0.5 -1.6 33 33" fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transition: 'stroke .4s' }}>
    <path d={STEMS} strokeWidth="1.05"/>
    <g strokeWidth=".85">{GRAINS.map((d, i) => <path key={i} className="grain" d={d} style={{ '--i': i % 6 } as React.CSSProperties}/>)}</g>
    <path d={AWNS} strokeWidth=".42" opacity=".75"/>
  </svg>;
}

export function Logo({ size = 28, subtitle = true, tone = 'brand' }: { size?: number; subtitle?: boolean; tone?: 'brand' | 'light' }) {
  return <span className="inline-flex items-center gap-2.5" data-tone={tone}><LogoMark size={size} tone={tone}/><span className={`grid leading-tight ${tone === 'light' ? 'text-white' : 'text-foreground'}`}><span className="text-[15px] font-semibold tracking-tight">AgroCebada</span>{subtitle && <span className={`text-xs ${tone === 'light' ? 'text-white/70' : 'text-muted-foreground'}`}>Atlas FIRA 2026</span>}</span></span>;
}
