// The map's data layers, as a stack: any number on (or none), drawn in list order (the first on
// top), each with its own opacity and, for the indices, a threshold. Parcels are not a layer: they
// stay as neutral outlines with their t/ha label, and hovering one shows its data.
import { CloudRain, Droplets, Flame, Leaf, Map as MapIcon, Mountain, Thermometer, ThermometerSnowflake, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type LayerId = 'ndvi' | 'water' | 'precipitation' | 'tmax' | 'tmin' | 'elevation' | 'slope' | 'heatmap' | 'municipalities';
export type MapLayer = { id: LayerId; on: boolean; opacity: number; threshold?: number };
export type Threshold = { label: string; min: number; max: number; step: number; default: number; hint: string };
export type LayerInfo = { name: string; subtitle: string; description: string; icon: LucideIcon; temporal: boolean; threshold?: Threshold };

export const LAYERS: Record<LayerId, LayerInfo> = {
  heatmap: { name: 'Mapa de calor', subtitle: 'Producción estimada (t)', icon: Flame, temporal: false,
    description: 'Concentración de la producción estimada: rendimiento estimado por superficie de cada parcela. Las zonas más intensas reúnen más toneladas.' },
  municipalities: { name: 'Municipios', subtitle: 'INEGI · un color por municipio', icon: MapIcon, temporal: false,
    description: 'Rellena cada municipio con un color distinto para ver de un vistazo a cuál pertenece cada parcela.' },
  ndvi: { name: 'Vegetación', subtitle: 'NDVI Sentinel-2 · 10 m mensual', icon: Leaf, temporal: true,
    description: 'Índice de vegetación (NDVI) del mes, de las imágenes Sentinel-2 sin nubes. Más verde es más vigor; valores bajos son suelo desnudo o rastrojo.',
    threshold: { label: 'Umbral NDVI', min: -0.2, max: 0.8, step: 0.05, default: 0.2, hint: 'Oculta los píxeles con NDVI menor: 0.2 separa la vegetación del suelo desnudo.' } },
  water: { name: 'Agua', subtitle: 'MNDWI Sentinel-2 · 10 m mensual', icon: Droplets, temporal: true,
    description: 'Índice de agua (MNDWI) del mes: resalta cuerpos de agua y suelo encharcado. Valores mayores a 0 suelen ser agua.',
    threshold: { label: 'Umbral MNDWI', min: -0.5, max: 0.5, step: 0.05, default: 0, hint: 'Muestra los píxeles con MNDWI mayor: 0 es el corte habitual para agua.' } },
  precipitation: { name: 'Lluvia', subtitle: 'CHIRPS · mm del mes', icon: CloudRain, temporal: true,
    description: 'Lluvia acumulada del mes según CHIRPS (satélite y estaciones, ~5 km). Más oscuro es más lluvia.' },
  tmax: { name: 'Temperatura máxima', subtitle: '°C · promedio del mes', icon: Thermometer, temporal: true,
    description: 'Temperatura máxima promedio del mes. Las olas de calor durante el llenado de grano reducen el rendimiento.' },
  tmin: { name: 'Temperatura mínima', subtitle: '°C · promedio del mes', icon: ThermometerSnowflake, temporal: true,
    description: 'Temperatura mínima promedio del mes. Las heladas tempranas o tardías dañan a la cebada.' },
  elevation: { name: 'Elevación', subtitle: 'Metros sobre el nivel del mar', icon: Mountain, temporal: false,
    description: 'Altitud del terreno. En el altiplano, la altura marca la temperatura y la duración del ciclo.' },
  slope: { name: 'Pendiente', subtitle: 'Grados · terreno', icon: TrendingUp, temporal: false,
    description: 'Inclinación del terreno. Las pendientes fuertes favorecen la erosión y dificultan la mecanización.' },
};

/** Top of the list draws on top. Everything starts off: the map opens on the parcels alone. */
export const DEFAULT_STACK: MapLayer[] = (['heatmap', 'municipalities', 'ndvi', 'water', 'precipitation', 'tmax', 'tmin', 'elevation', 'slope'] as LayerId[])
  .map(id => ({ id, on: false, opacity: id === 'municipalities' ? 0.45 : id === 'heatmap' ? 0.9 : 0.8, ...(LAYERS[id].threshold ? { threshold: LAYERS[id].threshold!.default } : {}) }));

export const isOn = (stack: MapLayer[], id: LayerId) => stack.some(l => l.id === id && l.on);
export const layerOf = (stack: MapLayer[], id: LayerId) => stack.find(l => l.id === id)!;
/** Map z-index for a data layer: above the basemap (0), below the boundaries (20), parcels (40) and tools. */
export const zIndexOf = (stack: MapLayer[], id: LayerId) => 5 + stack.length - stack.findIndex(l => l.id === id);
/** A month-by-month layer is on, so the month slider matters. */
export const anyTemporal = (stack: MapLayer[]) => stack.some(l => l.on && LAYERS[l.id].temporal);
export const updateLayer = (stack: MapLayer[], id: LayerId, next: Partial<MapLayer>) => stack.map(l => l.id === id ? { ...l, ...next } : l);
