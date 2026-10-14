import { Button } from '@mui/material';
import { ArrowUpRight, ChevronLeft, ChevronRight, Crosshair, MapPin, PencilRuler, X } from 'lucide-react';
import type { Atlas, Parcel } from './types';
import { dateKey, fmt, MONTH_NAMES } from './lib';
import { LineChart } from './Charts';
import { IconButton } from './IconButton';

const GROUPS = { training: ['Entrenamiento', 'ui-badge-leaf'], prediction: ['Predicción', ''], custom: ['Mi parcela', 'ui-badge-dark'] } as const;

export default function ParcelPanel({ parcel, atlas, year, month, sensor, onClose, onLocate, onEdit, onAnalyze, onTechnical, onNext }: { parcel: Parcel; atlas: Atlas; year: number; month: number; sensor: string; onClose: () => void; onLocate: () => void; onEdit: () => void; onAnalyze: () => void; onTechnical: () => void; onNext: (direction: number) => void }) {
  const p = parcel.properties, details = atlas.details[p.id], weather = details?.climate[dateKey(year, month)];
  const values = Array.from({ length: 12 }, (_, m) => sensor === 'Landsat C2' ? atlas.landsat[dateKey(year, m)]?.parcels[p.id]?.mean ?? null : details?.ndvi['Sentinel-2']?.[dateKey(year, m)]?.mean ?? null);
  const observations = details?.ndvi['Sentinel-2']?.[dateKey(year, month)]?.observations;
  const [groupLabel, groupClass] = GROUPS[p.group] ?? GROUPS.prediction;
  return <aside className="parcel-panel floating-parcel map-panel" aria-label="Ficha de parcela">
    <div className="parcel-panel-head">
      <div className="parcel-panel-title">
        <span className="kicker">Parcela seleccionada</span>
        <h2 className="pixel">{p.name || p.id}</h2>
        <p><MapPin size={13}/>{p.municipality} · {p.state}</p>
      </div>
      <IconButton label="Cerrar ficha de parcela" onClick={onClose}><X size={16}/></IconButton>
    </div>
    <div className="parcel-panel-badges"><span className={`ui-badge ${groupClass}`}>{groupLabel}</span><span className="ui-badge">Cebada</span>{p.edited && <span className="ui-badge ui-badge-warning">Editada</span>}</div>

    <div className="parcel-panel-body">
      <div className="recorded-yield">
        <span className="kicker">Rendimiento registrado · 2025</span>
        <strong className="pixel">{fmt(p.observedYield)}<small>t/ha</small></strong>
        {p.observedYield == null && <p>Sin rendimiento registrado para esta parcela.</p>}
      </div>
      <dl className="parcel-stats">
        <div><dt>Superficie</dt><dd>{fmt(p.area)}<small>ha</small></dd></div>
        <div><dt>NDVI · {MONTH_NAMES[month].slice(0, 3).toLowerCase()}</dt><dd>{fmt(values[month])}</dd><small>{observations ? `${observations} observaciones` : 'Sin observación'}</small></div>
        <div><dt>Precipitación</dt><dd>{fmt(weather?.precipitation, 0)}<small>mm</small></dd><small>Histórico mensual</small></div>
      </dl>
      {p.edited && <p className="edited-note">Límites ajustados · observaciones del límite original.</p>}
      <div className="parcel-chart">
        <div className="parcel-chart-head"><b>Vegetación · NDVI</b><span>{sensor} · {year}</span></div>
        <LineChart values={values} compact color="#3d6b13"/>
      </div>
    </div>

    <div className="parcel-card-actions">
      <Button variant="contained" onClick={onAnalyze} endIcon={<ArrowUpRight size={15}/>}>Analizar parcela</Button>
      <Button variant="outlined" onClick={onTechnical}>Ver evolución</Button>
    </div>
    <div className="parcel-card-secondary">
      <Button onClick={onEdit} startIcon={<PencilRuler size={14}/>}>Corregir límites</Button>
      <Button onClick={onLocate} startIcon={<Crosshair size={14}/>}>Acercar</Button>
      <div className="panel-navigation">
        <IconButton label="Parcela anterior" size="sm" onClick={() => onNext(-1)}><ChevronLeft size={15}/></IconButton>
        <IconButton label="Siguiente parcela" size="sm" onClick={() => onNext(1)}><ChevronRight size={15}/></IconButton>
      </div>
    </div>
  </aside>;
}
