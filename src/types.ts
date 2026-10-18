/** Phases of the workspace: explore the map, read the estimate on the dashboard page. */
export type Phase = 'explorar' | 'estimar';
export type Geometry = { type: 'Polygon'; coordinates: number[][][] };
export interface ParcelProperties {
  id: string; municipality: string; state: string; crop: string; area: number;
  group: 'training' | 'prediction' | 'custom'; observedYield: number | null;
  predictedYield: number | null; predictionSource: 'model' | 'none'; fold?: number | null; centroid: number[];
  bounds: number[]; elevation: number | null; slope: number | null; name?: string; edited?: boolean;
}
export interface Parcel { type: 'Feature'; properties: ParcelProperties; geometry: Geometry }
export interface FeatureCollection { type: 'FeatureCollection'; features: Parcel[] }
export interface Climate { precipitation: number | null; tmin: number | null; tmax: number | null }
export interface Raster { url: string; extent: number[]; projection: string }
export interface ParcelData { climate: Record<string, Climate>; ndvi: Record<string, Record<string, { mean: number; min?: number | null; max?: number | null; observations: number }>>; embedding: Record<string, Raster & { values: number[] }> }
export interface LandsatStats { mean: number | null; min: number | null; max: number | null; validPixels: number; totalPixels: number; coverage: number }
export interface LandsatMonth extends Raster { date: string; parcels: Record<string, LandsatStats>; scenes: { id: string; date: string; cloudCover: number; stacUrl: string }[]; nativeResolution: number; validAreaFraction: number }
export interface Atlas { predictions: import('./model').Predictions; parcels: FeatureCollection; details: Record<string, ParcelData>; rasters: Record<string, Raster>; landsat: Record<string, LandsatMonth>; provenance: { parcelCount: number; trainingCount: number; predictionCount: number; totalArea: number; satelliteRetained: Record<string, number>; modelStatus: string } }
/** One kind of account: everyone sees the same atlas; the estimate is a phase, not a role. */
export interface User { id: string; username: string; name: string; role?: string }
export interface ImageryScene { id: string; date: string; tile: string; cloudCover: number; baseline: string; calibration: { scale: number; offset: number }; stacUrl: string }
export interface ImageryManifest { version: string; nativeVersion?: string; renderVersion?: number; tileRendering?: string; month: string; source: string; resolution: { rgb: number; ndvi: number; mndwi: number }; states: string[]; tiles: string[]; scenes: ImageryScene[]; mosaic: string; missingData: string; tileTemplate: string }
export interface SegmentationPrompt { coordinates: number[]; label: 0 | 1 }
export interface SegmentationProvenance { model: string; checkpointSha256: string; codeVersion: string; imageryVersion: string; month: string; scenes: ImageryScene[]; prompts: SegmentationPrompt[]; cropBounds: number[]; cropGrid?: { projection: string; extent: number[]; transform: number[] }; resolution: number; proposedGeometry: Geometry; correctedGeometry?: Geometry; score: number; latencyMs: number }
export interface SegmentationProposal { id: string; requestId: string; geometry: Geometry; area: number; warnings: string[]; provenance: SegmentationProvenance }
export interface Field { id: string; name: string; geometry: Geometry; area: number; createdAt: string; segmentation?: SegmentationProvenance }
export interface Override { geometry: Geometry; area: number; updatedAt: string }
export interface Workspace { overrides: Record<string, Override>; fields: Field[] }
export interface MapFilters { query: string; state: string; group: string; ndviEnabled: boolean; ndviThreshold: number; onlyNdvi: boolean; /** "Parcelas parecidas": estimated yield within this band (t/ha). */ yieldBand?: [number, number] | null }
/** The basemap; the data layers are a stack (src/layers.ts). */
export interface LayerSettings { base: 'topo' | 'light' | 'dark' | 'satellite' }
