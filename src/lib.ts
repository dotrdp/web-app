import type { Atlas, Geometry, MapFilters, Parcel, Workspace } from './types';
import Polygon from 'ol/geom/Polygon';
import { getArea } from 'ol/sphere';

export const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
export const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
export const EXAMPLE_YIELD = 4.2;
export const IS_DEMO = import.meta.env?.VITE_DEMO === 'true';
export const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const fmt = (n: number | null | undefined, digits = 2) => n == null || !Number.isFinite(n) ? '—' : new Intl.NumberFormat('es-MX', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
export const dateKey = (year: number, month: number) => `${year}-${String(month + 1).padStart(2, '0')}`;
export const polygonArea = (geometry: Geometry) => getArea(new Polygon(geometry.coordinates), { projection: 'EPSG:4326' }) / 10000;

export function parseCoordinates(value: string): [number, number] | null {
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)\s*[,;]\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const a = Number(match[1]), b = Number(match[2]);
  // Accept both latitude,longitude and longitude,latitude for Mexico.
  const pair: [number, number] = Math.abs(a) <= 90 && Math.abs(b) > 90 ? [b, a] : [a, b];
  return Math.abs(pair[0]) <= 180 && Math.abs(pair[1]) <= 85 ? pair : null;
}

export function filterParcels(parcels: Parcel[], filters: MapFilters, atlas: Atlas, key: string) {
  const query = normalize(filters.query);
  const coordinates = parseCoordinates(filters.query);
  return parcels.filter(p => {
    const f = p.properties;
    if (filters.state !== 'all' && f.state !== filters.state) return false;
    if (filters.group !== 'all' && f.group !== filters.group) return false;
    if (query && !coordinates && !normalize(`${f.id} ${f.municipality} ${f.state} ${f.name || ''}`).includes(query)) return false;
    if (filters.ndviEnabled && filters.onlyNdvi) {
      const ndvi = atlas.landsat[key]?.parcels[f.id]?.mean;
      if (ndvi == null || ndvi < filters.ndviThreshold) return false;
    }
    return true;
  });
}

export function mergedParcels(atlas: Atlas, workspace: Workspace): Parcel[] {
  const original = atlas.parcels.features.map(f => {
    const override = workspace.overrides[f.properties.id];
    if (!override) return f;
    const bounds = geometryBounds(override.geometry);
    return { ...f, geometry: override.geometry, properties: { ...f.properties, area: override.area, edited: true, bounds, centroid: [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2] } };
  });
  for (const field of workspace.fields) {
    const override = workspace.overrides[field.id];
    const geometry = override?.geometry || field.geometry;
    const bounds = geometryBounds(geometry);
    original.push({ type: 'Feature', geometry, properties: { id: field.id, name: field.name, municipality: 'Terreno personalizado', state: 'Mi parcela', crop: 'Cebada', area: override?.area || field.area, group: 'custom', observedYield: null, predictedYield: EXAMPLE_YIELD, predictionSource: 'placeholder', centroid: [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2], bounds, elevation: null, slope: null, edited: !!override } });
  }
  return original;
}

export const geometryBounds = (geometry: Geometry) => {
  const coords = geometry.coordinates.flat();
  return [Math.min(...coords.map(c => c[0])), Math.min(...coords.map(c => c[1])), Math.max(...coords.map(c => c[0])), Math.max(...coords.map(c => c[1]))];
};

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (IS_DEMO) {
    const { demoApi } = await import('./demo');
    return demoApi<T>(path, options);
  }
  const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'No pudimos completar la solicitud.');
  return data as T;
}

export function download(name: string, contents: string, mime = 'text/plain') {
  const url = URL.createObjectURL(new Blob([contents], { type: mime }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function parcelCsv(parcels: Parcel[], atlas: Atlas, key: string) {
  const rows = [['ID', 'Municipio', 'Estado', 'Superficie_ha', 'Rendimiento_observado_t_ha', 'Rendimiento_EJEMPLO_t_ha', 'Estado_modelo', 'NDVI_Landsat_C2', 'Periodo_NDVI'], ...parcels.map(p => [p.properties.id, p.properties.municipality, p.properties.state, p.properties.area, p.properties.observedYield ?? '', EXAMPLE_YIELD, 'PLACEHOLDER_SIN_INFERENCIA', atlas.landsat[key]?.parcels[p.properties.id]?.mean ?? '', key])];
  return '\uFEFF' + rows.map(row => row.map(x => '"' + String(x).replaceAll('"', '""') + '"').join(',')).join('\r\n');
}
