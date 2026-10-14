// Adapted from Magic UI's Floating 3D Particles (MIT, /licenses/magicui-MIT.txt):
// polar particles rotate around a vertical axis with perspective and buoyant drift.
// Changed for AgroCebada: devicePixelRatio cap, pauses off-screen, stops for reduced motion.
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Particle { angle: number; radius: number; y: number; size: number; speed: number; opacity: number; x: number; py: number; scale: number }

function rgba(hex: string, alpha: number) {
  const value = Number.parseInt(hex.replace('#', ''), 16);
  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${alpha})`;
}

export default function Particles({ quantity = 260, color = '#b9e769', size = 1.6, opacity = .35, drift = .35, depth = .6, className = '' }: { quantity?: number; color?: string; size?: number; opacity?: number; drift?: number; depth?: number; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current, context = element?.getContext('2d');
    if (!element || !context) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const t = Math.max(0, Math.min(1, depth));
    const fov = 800 - t * 600, distance = 100 + t * 700, range = t * Math.min(400, fov + distance - 1);
    let width = 1, height = 1, particles: Particle[] = [], frame = 0, paused = false;
    const spawn = (): Particle => ({
      angle: Math.random() * Math.PI * 2, radius: Math.random() * Math.max(width, height) * 1.2,
      y: (Math.random() - .5) * height * 2, size: Math.max(.4, size * (.6 + Math.random() * .8)),
      speed: .0012 + Math.random() * .001, opacity: Math.min(1, Math.max(.05, opacity - .2 + Math.random() * .4)), x: 0, py: 0, scale: 1,
    });
    const paint = (move: boolean) => {
      context.clearRect(0, 0, width, height);
      const cx = width / 2, cy = height / 2;
      for (const p of particles) {
        if (move) {
          p.angle += p.speed; p.y -= drift;
          if (p.y < -height) { p.y = height; p.radius = Math.random() * Math.max(width, height) * 1.2; }
        }
        p.scale = fov / Math.max(1, fov + distance + Math.sin(p.angle) * range);
        p.x = cx + Math.cos(p.angle) * p.radius * p.scale; p.py = cy + p.y * p.scale;
      }
      particles.sort((a, b) => a.scale - b.scale);
      for (const p of particles) {
        context.beginPath(); context.fillStyle = rgba(color, p.opacity * Math.min(1, p.scale * 1.6));
        context.arc(p.x, p.py, Math.max(.3, p.size * p.scale * 1.4), 0, Math.PI * 2); context.fill();
      }
    };
    const tick = () => { frame = 0; if (paused) return; paint(!reduced.matches); if (!reduced.matches) frame = requestAnimationFrame(tick); };
    const start = () => { if (!frame && !paused) frame = requestAnimationFrame(tick); };
    const resize = () => {
      const box = element.getBoundingClientRect();
      width = Math.max(1, Math.round(box.width)); height = Math.max(1, Math.round(box.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(width * dpr); element.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: window.innerWidth < 768 ? Math.round(quantity * .35) : quantity }, spawn);
      paint(false); start();
    };
    const observer = new ResizeObserver(resize); observer.observe(element);
    const io = new IntersectionObserver(([entry]) => { paused = !entry?.isIntersecting || document.hidden; start(); }); io.observe(element);
    const visibility = () => { paused = document.hidden; start(); };
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', start);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', start); };
  }, [quantity, color, size, opacity, drift, depth]);
  return <canvas ref={canvas} data-slot="particles" className={cn('pointer-events-none absolute inset-0 size-full', className)} aria-hidden="true"/>;
}
