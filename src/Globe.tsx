// Interactive dotted globe built on COBE (MIT, /licenses/cobe-MIT.txt), following
// Magic UI's Globe pattern (MIT, /licenses/magicui-MIT.txt): drag to spin, spring
// easing. Arcs show where the atlas' satellite and model data come from.
import { useEffect, useRef } from 'react';
import createGlobe, { type Arc, type COBEOptions, type Marker } from 'cobe';
import { useMotionValue, useSpring } from 'motion/react';

type LatLon = [number, number];
const toAngles = ([lat, lon]: LatLon) => [Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180] as const;

export const PLACES = {
  hidalgo: { location: [20.08, -98.76] as LatLon, label: 'Hidalgo' },
  tlaxcala: { location: [19.32, -98.24] as LatLon, label: 'Tlaxcala' },
  puebla: { location: [19.04, -98.21] as LatLon, label: 'Puebla' },
  fira: { location: [19.70, -101.19] as LatLon, label: 'FIRA · Morelia' },
  esa: { location: [41.83, 12.67] as LatLon, label: 'Copernicus · ESA' },
  usgs: { location: [43.73, -96.62] as LatLon, label: 'Landsat · USGS' },
  deepmind: { location: [51.53, -0.12] as LatLon, label: 'AlphaEarth' },
};
const FIELD: LatLon = [19.71, -98.45];
const MARKERS: Marker[] = [
  { location: PLACES.hidalgo.location, size: .03, id: 'hidalgo' },
  { location: PLACES.tlaxcala.location, size: .026, id: 'tlaxcala' },
  { location: PLACES.puebla.location, size: .026, id: 'puebla' },
  { location: PLACES.fira.location, size: .02, id: 'fira' },
  { location: PLACES.esa.location, size: .022, id: 'esa' },
  { location: PLACES.usgs.location, size: .022, id: 'usgs' },
  { location: PLACES.deepmind.location, size: .02, id: 'deepmind' },
];
const ARCS: Arc[] = [
  { from: PLACES.esa.location, to: FIELD, id: 'esa' },
  { from: PLACES.usgs.location, to: FIELD, id: 'usgs' },
  { from: PLACES.deepmind.location, to: FIELD, id: 'deepmind' },
  { from: PLACES.fira.location, to: PLACES.tlaxcala.location, id: 'fira' },
];

export default function Globe({ className = '', focus = FIELD, tilt = -.6, config }: { className?: string; focus?: LatLon; tilt?: number; config?: Partial<COBEOptions> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pointer = useRef<number | null>(null);
  const drag = useMotionValue(0);
  const spring = useSpring(drag, { mass: 1, damping: 30, stiffness: 100 });
  const configRef = useRef(config); configRef.current = config;

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const [focusPhi, focusTheta] = toAngles(focus);
    let width = element.offsetWidth, frame = 0, visible = true, t = 0;
    const size = () => ({ width: width * 2, height: width * 2 });
    // Without WebGL the hero simply keeps its particles and gradient.
    let globe: ReturnType<typeof createGlobe>;
    try { globe = createGlobe(element, {
      devicePixelRatio: 2, ...size(),
      phi: focusPhi, theta: focusTheta + tilt,
      dark: 1, diffuse: 1.15, mapSamples: 22000, mapBrightness: 5.2, mapBaseBrightness: .02,
      baseColor: [.2, .26, .22], markerColor: [.73, .91, .41], glowColor: [.16, .24, .18],
      arcColor: [.73, .91, .41], arcWidth: .32, arcHeight: .36, markerElevation: .01,
      markers: MARKERS, arcs: ARCS, scale: 1, opacity: .92,
      ...configRef.current,
    }); } catch { return; }
    const resize = new ResizeObserver(() => { width = element.offsetWidth; globe.update(size()); });
    resize.observe(element);
    const io = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? true; if (visible && !frame) frame = requestAnimationFrame(render); });
    io.observe(element);
    // A slow sway keeps Mexico in view while Europe's arcs drift past.
    function render() {
      frame = 0;
      if (!visible) return;
      if (!reduced.matches && pointer.current === null) t += .0035;
      globe.update({ phi: focusPhi + Math.sin(t) * .5 + spring.get(), theta: focusTheta + tilt + Math.sin(t * .7) * .03 });
      frame = requestAnimationFrame(render);
    }
    frame = requestAnimationFrame(render);
    const fade = window.setTimeout(() => { element.style.opacity = '1'; }, 60);
    return () => { cancelAnimationFrame(frame); clearTimeout(fade); resize.disconnect(); io.disconnect(); globe.destroy(); };
  }, [focus, tilt, spring]);

  const release = () => { pointer.current = null; if (canvas.current) canvas.current.style.cursor = 'grab'; };
  return <div className={`globe ${className}`}>
    <canvas ref={canvas} className="globe-canvas" aria-hidden="true"
      onPointerDown={event => { pointer.current = event.clientX; event.currentTarget.style.cursor = 'grabbing'; }}
      onPointerUp={release} onPointerOut={release}
      onPointerMove={event => { if (pointer.current === null) return; drag.set(drag.get() + (event.clientX - pointer.current) / 260); pointer.current = event.clientX; }}/>
  </div>;
}
