import { useEffect, useRef } from 'react';

type Dot = { x: number; y: number; z: number; phase: number };

/** A light, decorative particle globe for the brand story panel. */
export default function DotGlobe() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!element || !context) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const dots: Dot[] = Array.from({ length: 300 }, (_, index) => {
      const y = 1 - (index / 299) * 2;
      const radius = Math.sqrt(1 - y * y);
      const angle = Math.PI * (3 - Math.sqrt(5)) * index;
      return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius, phase: (index * 2.399) % (Math.PI * 2) };
    });
    let width = 0, height = 0, frame = 0, rotation = 0, visible = true;
    const resize = new ResizeObserver(entries => {
      const box = entries[0]?.contentRect;
      if (!box) return;
      width = box.width; height = box.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * dpr); element.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    resize.observe(element);
    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? true;
      if (visible) schedule();
    });
    observer.observe(element);
    const draw = () => {
      frame = 0;
      if (!width || !height || !visible) return;
      context.clearRect(0, 0, width, height);
      const cx = width * .52, cy = height * .51, radius = Math.min(width, height) * .43;
      const cosine = Math.cos(rotation), sine = Math.sin(rotation);
      const projected = dots.map(dot => {
        const x = dot.x * cosine - dot.z * sine;
        const z = dot.x * sine + dot.z * cosine;
        const perspective = 1 / (1.45 - z * .32);
        return { x: cx + x * radius * perspective, y: cy + dot.y * radius * perspective, z, phase: dot.phase };
      });
      // Fine meridian-like links make the points read as a globe, not a flat grid.
      context.lineWidth = .7;
      context.strokeStyle = 'rgba(209, 230, 173, .14)';
      for (let i = 0; i < projected.length; i += 1) {
        const here = projected[i];
        if (here.z < -.05) continue;
        for (let j = i + 1; j < projected.length; j += 1) {
          const there = projected[j];
          if (there.z < -.05) continue;
          const dx = here.x - there.x, dy = here.y - there.y;
          if (dx * dx + dy * dy > radius * radius * .018) continue;
          context.globalAlpha = Math.min(here.z, there.z) * .2;
          context.beginPath(); context.moveTo(here.x, here.y); context.lineTo(there.x, there.y); context.stroke();
        }
      }
      context.globalAlpha = 1;
      for (const point of projected) {
        const depth = Math.max(.1, (point.z + 1) / 2);
        const pulse = reducedMotion.matches ? 1 : .84 + .16 * Math.sin(rotation * 4 + point.phase);
        context.beginPath();
        context.arc(point.x, point.y, (.65 + depth * 1.25) * pulse, 0, Math.PI * 2);
        context.fillStyle = point.z > 0 ? `rgba(216, 238, 177, ${.26 + depth * .64})` : `rgba(184, 207, 163, ${.08 + depth * .2})`;
        context.fill();
      }
      // Satellite paths and their moving signal dots echo the original green identity.
      context.save(); context.translate(cx, cy); context.rotate(-.34);
      context.beginPath(); context.ellipse(0, 0, radius * 1.27, radius * .4, 0, 0, Math.PI * 2);
      context.strokeStyle = 'rgba(207, 230, 169, .27)'; context.lineWidth = 1; context.stroke();
      context.beginPath(); context.ellipse(0, 0, radius * 1.12, radius * .59, .65, 0, Math.PI * 2);
      context.strokeStyle = 'rgba(207, 230, 169, .12)'; context.stroke();
      const signalAngle = rotation * 2.1;
      context.beginPath(); context.arc(Math.cos(signalAngle) * radius * 1.27, Math.sin(signalAngle) * radius * .4, 3.2, 0, Math.PI * 2);
      context.fillStyle = '#d8eead'; context.shadowColor = '#d8eead'; context.shadowBlur = 12; context.fill(); context.restore();
      if (!reducedMotion.matches) rotation += .0025;
      if (!reducedMotion.matches) frame = requestAnimationFrame(draw);
    };
    const schedule = () => { if (!frame && visible) frame = requestAnimationFrame(draw); };
    const motionChange = () => schedule();
    reducedMotion.addEventListener('change', motionChange);
    schedule();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); reducedMotion.removeEventListener('change', motionChange); };
  }, []);

  return <canvas ref={canvas} className="dot-globe" aria-hidden="true" />;
}
