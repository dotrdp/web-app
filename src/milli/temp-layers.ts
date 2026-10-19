// Milli's temporary map layers: what Milli draws on a map figure in the chat also appears on the
// app's map, as a temporary layer marked with an hourglass that the user removes with one click
// (or that goes away with "Quitar todas"). Kept in memory for this tab only.
import { useSyncExternalStore } from 'react';

type Ll = [number, number];
export type TempLegend = { items?: [string, string][]; scale?: { title: string; min: number; max: number; colors: string[] } };
export type TempLayer = {
  id: string; title: string; figureId?: string;
  /** [parcel id, colour] */ parcels?: [string, string][];
  /** [lon, lat, colour, size px] */ points?: [number, number, string, number][];
  /** [lon, lat, colour] cell centres, with the cell size in degrees */ cells?: [number, number, string][]; cell?: { dx: number; dy: number };
  /** [lon, lat, text] */ labels?: [number, number, string][];
  /** [lon, lat, text]: notes Milli wrote on the map */ markers?: [number, number, string][];
  legend?: TempLegend; opacity?: number; addedAt: number;
};

let layers: TempLayer[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

export const tempLayers = {
  get: () => layers,
  subscribe: (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; },
  /** Adds a layer (replacing one with the same id); at most 4, the oldest goes first. */
  add(layer: Omit<TempLayer, 'addedAt'>) { layers = [...layers.filter(l => l.id !== layer.id), { ...layer, addedAt: Date.now() }].slice(-4); emit(); },
  remove(id: string) { layers = layers.filter(l => l.id !== id); emit(); },
  clear() { layers = []; emit(); },
};
export const useTempLayers = () => useSyncExternalStore(tempLayers.subscribe, tempLayers.get, tempLayers.get);

/** [west, south, east, north] of everything in a layer, or null. */
export function tempExtent(layer: TempLayer, centroid: (id: string) => Ll | null): number[] | null {
  const pts: Ll[] = [...(layer.parcels ?? []).map(([id]) => centroid(id)).filter((p): p is Ll => !!p), ...(layer.points ?? []).map(p => [p[0], p[1]] as Ll),
    ...(layer.cells ?? []).map(c => [c[0], c[1]] as Ll), ...(layer.labels ?? []).map(l => [l[0], l[1]] as Ll), ...(layer.markers ?? []).map(m => [m[0], m[1]] as Ll)];
  if (!pts.length) return null;
  return [Math.min(...pts.map(p => p[0])), Math.min(...pts.map(p => p[1])), Math.max(...pts.map(p => p[0])), Math.max(...pts.map(p => p[1]))];
}
