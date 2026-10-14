// Parcel details sheet (shadcn data-table-sheet pattern): sticky header with
// previous / next / close, a headline figure, a definition list and actions.
import { Button } from '@mui/material';
import { ChartNoAxesCombined, ChevronDown, ChevronUp, Crosshair, MapPin, PencilRuler, X } from 'lucide-react';
import type { Atlas, Parcel } from './types';
import { dateKey, fmt, MONTH_NAMES } from './lib';
import { LineChart } from './Charts';
import { IconButton } from './IconButton';

const GROUPS = { training: ['Entrenamiento', ''], prediction: ['Predicción', 'ui-badge-outline'], custom: ['Mi parcela', 'ui-badge-dark'] } as const;

export default function ParcelPanel({ parcel, atlas, year, month, sensor, onClose, onLocate, onEdit, onAnalyze, onTechnical, onNext }: { parcel: Parcel; atlas: Atlas; year: number; month: number; sensor: string; onClose: () => void; onLocate: () => void; onEdit: () => void; onAnalyze: () => void; onTechnical: () => void; onNext: (direction: number) => void }) {
  const p = parcel.properties, details = atlas.details[p.id], weather = details?.climate[dateKey(year, month)];
  const values = Array.from({ length: 12 }, (_, m) => sensor === 'Landsat C2' ? atlas.landsat[dateKey(year, m)]?.parcels[p.id]?.mean ?? null : details?.ndvi['Sentinel-2']?.[dateKey(year, m)]?.mean ?? null);
  const observations = details?.ndvi['Sentinel-2']?.[dateKey(year, month)]?.observations;
  const [groupLabel, groupClass] = GROUPS[p.group] ?? GROUPS.prediction;
  const rows: [string, string, string?][] = [
    ['Superficie', `${fmt(p.area)} ha`], ['Cultivo', 'Cebada'],
    [`NDVI · ${MONTH_NAMES[month].toLowerCase()} ${year}`, fmt(values[month]), observations ? `${observations} observaciones` : 'Sin observación'],
    ['Precipitación del mes', `${fmt(weather?.precipitation, 0)} mm`, 'CHIRPS'],
    ['Elevación', p.elevation == null ? '—' : `${fmt(p.elevation, 0)} m`], ['Pendiente', p.slope == null ? '—' : `${fmt(p.slope, 1)}°`],
  ];
  return <aside className="parcel-panel floating-parcel side-panel" aria-label="Ficha de parcela">
    <header className="side-panel-head">
      <div className="side-panel-title"><h2>{p.name || p.id}</h2></div>
      <div className="side-panel-nav">
        <IconButton label="Parcela anterior" size="sm" onClick={() => onNext(-1)}><ChevronUp size={15}/></IconButton>
        <IconButton label="Siguiente parcela" size="sm" onClick={() => onNext(1)}><ChevronDown size={15}/></IconButton>
        <span className="ui-separator"/>
        <IconButton label="Cerrar ficha de parcela" size="sm" onClick={onClose}><X size={16}/></IconButton>
      </div>
    </header>
    <div className="side-panel-body">
      <div className="parcel-intro"><p><MapPin size={13}/>{p.municipality} · {p.state}</p><span className={`ui-badge ${groupClass}`}>{groupLabel}</span>{p.edited && <span className="ui-badge ui-badge-warning">Editada</span>}</div>
      <div className="recorded-yield">
        <span className="kicker">Rendimiento registrado · 2025</span>
        <strong className="pixel">{fmt(p.observedYield)}<small>t/ha</small></strong>
        {p.observedYield == null && <p>Sin rendimiento registrado para esta parcela.</p>}
      </div>
      {p.edited && <p className="edited-note">Límites ajustados · observaciones del límite original.</p>}
      <dl className="detail-list">{rows.map(([label, value, hint]) => <div key={label}><dt>{label}{hint && <small>{hint}</small>}</dt><dd>{value}</dd></div>)}</dl>
      <div className="parcel-chart">
        <div className="parcel-chart-head"><b>Vegetación · NDVI</b><span>{sensor} · {year}</span></div>
        <LineChart values={values} compact color="#1e6b47"/>
      </div>
    </div>
    <footer className="side-panel-foot">
      <Button className="side-panel-primary" variant="contained" fullWidth onClick={onAnalyze}>Analizar parcela</Button>
      <div className="side-panel-links"><Button onClick={onTechnical} startIcon={<ChartNoAxesCombined size={14}/>}>Ver evolución</Button><Button onClick={onEdit} startIcon={<PencilRuler size={14}/>}>Corregir límites</Button><Button onClick={onLocate} startIcon={<Crosshair size={14}/>}>Acercar</Button></div>
    </footer>
  </aside>;
}
