import { getArea } from 'ol/sphere.js';
import Polygon from 'ol/geom/Polygon.js';
import { orient2d } from 'robust-predicates';

export function validateGeometry(geometry) {
  if (geometry?.type !== 'Polygon' || !Array.isArray(geometry.coordinates) || geometry.coordinates.length !== 1) throw new Error('Selecciona o dibuja un polígono sin huecos.');
  const raw = geometry.coordinates[0];
  if (raw.length < 4 || raw.length > 1001) throw new Error('La parcela debe tener entre 3 y 1000 vértices.');
  if (raw.some(p => !Array.isArray(p) || p.length !== 2 || !p.every(Number.isFinite) || Math.abs(p[0]) > 180 || Math.abs(p[1]) > 85)) throw new Error('Las coordenadas de la parcela no son válidas.');
  // Preserve source boundaries while ignoring their repeated adjacent vertices.
  const ring = raw.filter((p, i) => !i || p[0] !== raw[i - 1][0] || p[1] !== raw[i - 1][1]);
  if (ring.length < 4) throw new Error('La parcela debe tener al menos tres vértices distintos.');
  if (ring[0][0] !== ring.at(-1)[0] || ring[0][1] !== ring.at(-1)[1]) throw new Error('Cierra los límites de la parcela.');
  const orient = (a, b, c) => orient2d(a[0], a[1], b[0], b[1], c[0], c[1]);
  const on = (a, b, c) => orient(a, b, c) === 0 && c[0] >= Math.min(a[0], b[0]) && c[0] <= Math.max(a[0], b[0]) && c[1] >= Math.min(a[1], b[1]) && c[1] <= Math.max(a[1], b[1]);
  const n = ring.length - 1;
  for (let i = 0; i < n; i++) {
    if (ring[i][0] === ring[i + 1][0] && ring[i][1] === ring[i + 1][1]) throw new Error('Hay vértices consecutivos duplicados.');
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue;
      const a = ring[i], b = ring[i + 1], c = ring[j], d = ring[j + 1];
      if ((orient(a, b, c) * orient(a, b, d) < 0 && orient(c, d, a) * orient(c, d, b) < 0) || on(a, b, c) || on(a, b, d) || on(c, d, a) || on(c, d, b)) throw new Error('Los límites se cruzan. Ajusta los vértices de la parcela.');
    }
  }
  const area = getArea(new Polygon(geometry.coordinates), { projection: 'EPSG:4326' }) / 10000;
  if (!Number.isFinite(area) || area < 0.001 || area > 100000) throw new Error('La superficie debe estar entre 0.001 y 100,000 hectáreas.');
  return Math.round(area * 10000) / 10000;
}
