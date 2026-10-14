// Dot-matrix loaders from Dot Matrix (https://dotmatrix.zzzzshawn.cloud), used
// inside this application under its license: /licenses/dotmatrix-LICENSE.txt.
// Each context uses one loader so the motion carries meaning: a radar for the
// territory, a scanline for satellite imagery, a spiral for delineation, etc.
import type { ComponentType } from 'react';
import type { DotMatrixCommonProps } from './dotmatrix/dotmatrix-core';
import { DotmCircular4 } from './dotmatrix/dotm-circular-4';
import { DotmCircular5 } from './dotmatrix/dotm-circular-5';
import { DotmCircular2 } from './dotmatrix/dotm-circular-2';
import { DotmCircular8 } from './dotmatrix/dotm-circular-8';
import { DotmCircular11 } from './dotmatrix/dotm-circular-11';
import { DotmSquare1 } from './dotmatrix/dotm-square-1';
import { DotmSquare3 } from './dotmatrix/dotm-square-3';
import { DotmSquare4 } from './dotmatrix/dotm-square-4';
import { DotmSquare10 } from './dotmatrix/dotm-square-10';
import { DotmSquare11 } from './dotmatrix/dotm-square-11';
import { DotmSquare12 } from './dotmatrix/dotm-square-12';
import { DotmSquare15 } from './dotmatrix/dotm-square-15';
import { DotmSquare18 } from './dotmatrix/dotm-square-18';
import { DotmSquare20 } from './dotmatrix/dotm-square-20';
import { DotmHex1 } from './dotmatrix/dotm-hex-1';
import { DotmHex5 } from './dotmatrix/dotm-hex-5';
import { DotmHex10 } from './dotmatrix/dotm-hex-10';
import { DotmTriangle4 } from './dotmatrix/dotm-triangle-4';
import { DotmTriangle19 } from './dotmatrix/dotm-triangle-19';
import { Dotm3x3_1 } from './dotmatrix/dotm-3x3-1';
import { Dotm3x3_6 } from './dotmatrix/dotm-3x3-6';
import { Dotm3x3_10 } from './dotmatrix/dotm-3x3-10';
import { Dotm3x3_14 } from './dotmatrix/dotm-3x3-14';

export const DOT_LOADERS = {
  radar: DotmCircular4,       // Radar Arc · scanning the territory
  wheel: DotmCircular5,       // Nova Wheel
  orbit: DotmCircular2,       // Tri Orbit
  pulse: DotmCircular8,       // Heart Pulse
  lunar: DotmCircular11,      // Lunar Breathe
  drift: DotmSquare1,         // Neon Drift
  spiral: DotmSquare3,        // Core Spiral · delineation converging on a field
  twin: DotmSquare4,          // Twin Orbit
  scan: DotmSquare10,         // CRT Glide · satellite scanline
  ring: DotmSquare11,         // Echo Ring
  ripple: DotmSquare12,       // Origin Wave
  helix: DotmSquare15,        // Helix Glow
  bars: DotmSquare18,         // Sound Bars · charts
  mobius: DotmSquare20,       // Mobius Run
  hex: DotmHex1,              // Hex Orbit
  lattice: DotmHex5,          // Spiral Lattice
  vortex: DotmHex10,          // Liquid Vortex
  vertex: DotmTriangle4,      // Vertex Chase
  pivot: DotmTriangle19,      // Pivot Ray
  square: Dotm3x3_1,          // Square Spiral
  echo: Dotm3x3_6,            // Core Echo
  frame: Dotm3x3_10,          // Frame Chase
  comet: Dotm3x3_14,          // Comet Trail
} satisfies Record<string, ComponentType<DotMatrixCommonProps>>;
export type DotLoaderName = keyof typeof DOT_LOADERS;

/** A decorative dot-matrix loader. The surrounding element owns the status text. */
export function DotLoader({ name = 'radar', size = 28, dotSize, color = 'currentColor', className = '', bloom = false, speed }: { name?: DotLoaderName; size?: number; dotSize?: number; color?: string; className?: string; bloom?: boolean; speed?: number }) {
  const Loader = DOT_LOADERS[name];
  const small = name === 'square' || name === 'echo' || name === 'frame' || name === 'comet';
  return <span className={`dot-loader ${className}`} data-loader={name} aria-hidden="true">
    <Loader size={size} dotSize={dotSize ?? Math.max(2, Math.round(size / (small ? 4.6 : 7.2)))} color={color} bloom={bloom} speed={speed}/>
  </span>;
}

// 5×5 sprout drawn in dots: the AgroCebada mark in the same dot-matrix language.
const MARK = [
  '..#..',
  '##.##',
  '.###.',
  '..#..',
  '..#..',
];
export function DotMark({ size = 28, className = '', tone = 'dark' }: { size?: number; className?: string; tone?: 'dark' | 'light' | 'leaf' }) {
  const cell = size / 5;
  return <span className={`dot-mark ${className}`} data-tone={tone} style={{ width: size, height: size }} aria-hidden="true">
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{MARK.flatMap((row, y) => [...row].map((on, x) =>
      <circle key={`${x}-${y}`} cx={x * cell + cell / 2} cy={y * cell + cell / 2} r={cell * (on === '#' ? .36 : .16)} className={on === '#' ? 'on' : 'off'}/>))}</svg>
  </span>;
}
