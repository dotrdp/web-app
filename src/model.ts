// The selected yield ensemble (public/data/predictions.json, exported by
// scripts/export_predictions.py) and the helpers that turn its errors into
// productive terms: tonnes per parcel and pesos at an editable price.
export interface ParcelPrediction { set: 'train' | 'predict'; observed: number | null; predicted: number; fold: number | null; areaHa: number }
export interface FoldMetrics { fold: number; n: number; rmse_t_ha: number; mae_t_ha: number; r2: number; bias_t_ha: number }
export interface Predictions {
  model: { name: string; procedure: string; blend: string; evaluation: string; window: string; cutoff: string; target: string; area: string };
  metrics: { rmse_t_ha: number; mae_t_ha: number; r2: number; bias_t_ha: number; n: number };
  reference: { rmse_t_ha: number; mae_t_ha: number; r2: number };
  folds: FoldMetrics[];
  absErrorQuantiles: Record<'0.5' | '0.8' | '0.9', number>;
  shareWithin: Record<string, number>;
  residualHistogram: { edges: number[]; counts: number[] };
  observedRange: [number, number];
  observedMean: number;
  parcels: Record<string, ParcelPrediction>;
}

/** Editable assumption for the productive reading; not a quoted market price. */
export const DEFAULT_PRICE_MXN_T = 6500;
export type Coverage = '0.5' | '0.8' | '0.9';
export const COVERAGE_LABEL: Record<Coverage, string> = { '0.5': '50 %', '0.8': '80 %', '0.9': '90 %' };

/** Empirical interval: half-width is the out-of-fold absolute-error quantile. */
export function interval(model: Predictions, value: number, coverage: Coverage = '0.8'): [number, number] {
  const half = model.absErrorQuantiles[coverage];
  return [Math.max(0, value - half), value + half];
}

export const residual = (p: ParcelPrediction | undefined) => p && p.observed != null ? p.predicted - p.observed : null;

export const money = (value: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value);

/** What an error of `errorTHa` means on a parcel of `areaHa`: tonnes and pesos. */
export function productiveError(errorTHa: number, areaHa: number, price: number) {
  const tonnes = errorTHa * areaHa;
  return { tonnes, pesos: tonnes * price, perHectare: errorTHa * price };
}

/** Challenge submission: one row per ID_POLIGONO of the 59 reserved parcels. */
export function submissionCsv(model: Predictions) {
  const rows = Object.entries(model.parcels).filter(([, p]) => p.set === 'predict').sort(([a], [b]) => a.localeCompare(b)).map(([id, p]) => `${id},${p.predicted.toFixed(4)}`);
  return ['ID_POLIGONO,RENDIMIENTO_T_HA', ...rows].join('\r\n') + '\r\n';
}

/** Natural-breaks-free class edges for the smart symbology: quantiles of the values. */
export function quantileBreaks(values: number[], classes = 5) {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return [];
  return Array.from({ length: classes - 1 }, (_, i) => sorted[Math.min(sorted.length - 1, Math.floor((i + 1) * sorted.length / classes))]);
}
export function equalBreaks(min: number, max: number, classes = 5) {
  return Array.from({ length: classes - 1 }, (_, i) => min + (max - min) * (i + 1) / classes);
}
