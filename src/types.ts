export type View = 'map' | 'parcels' | 'technical' | 'models' | 'sources' | 'admin';
export type MapMode = 'parcels' | 'ndvi' | 'alphaearth' | 'climate' | 'terrain';
export type Geometry = { type: 'Polygon'; coordinates: number[][][] };
export interface ParcelProperties {
  id: string; municipality: string; state: string; crop: string; area: number;
  group: 'training' | 'prediction' | 'custom'; observedYield: number | null;
  predictedYield: number; predictionSource: 'placeholder'; centroid: number[];
  bounds: number[]; elevation: number | null; slope: number | null; name?: string; edited?: boolean;
}
export interface Parcel { type: 'Feature'; properties: ParcelProperties; geometry: Geometry }
export interface FeatureCollection { type: 'FeatureCollection'; features: Parcel[] }
export interface Climate { precipitation: number | null; tmin: number | null; tmax: number | null }
export interface Raster { url: string; extent: number[]; projection: string }
export interface ParcelData { climate: Record<string, Climate>; ndvi: Record<string, Record<string, { mean: number; observations: number }>>; embedding: Record<string, Raster & { values: number[] }> }
export interface LandsatStats { mean: number | null; min: number | null; max: number | null; validPixels: number; totalPixels: number; coverage: number }
export interface LandsatMonth extends Raster { date: string; parcels: Record<string, LandsatStats>; scenes: { id: string; date: string; cloudCover: number; stacUrl: string }[]; nativeResolution: number; validAreaFraction: number }
export interface Atlas { parcels: FeatureCollection; details: Record<string, ParcelData>; rasters: Record<string, Raster>; landsat: Record<string, LandsatMonth>; provenance: { parcelCount: number; trainingCount: number; predictionCount: number; totalArea: number; satelliteRetained: Record<string, number>; modelStatus: string } }
export interface User { id: string; username: string; name: string; role: 'admin' | 'user' }
export interface Field { id: string; name: string; geometry: Geometry; area: number; createdAt: string }
export interface Override { geometry: Geometry; area: number; updatedAt: string }
export interface Analysis { id: string; parcelId: string | null; name: string; area: number; geometry: Geometry; yield: number; production: number; status: 'placeholder'; createdAt: string }
export interface Workspace { analyses: Analysis[]; overrides: Record<string, Override>; fields: Field[] }
export interface MapFilters { query: string; state: string; group: string; ndviEnabled: boolean; ndviThreshold: number; onlyNdvi: boolean }
export interface LayerSettings { precipitation: boolean; tmin: boolean; tmax: boolean; elevation: boolean; slope: boolean; municipalities: boolean; states: boolean; opacity: number; base: 'satellite' | 'streets' }
