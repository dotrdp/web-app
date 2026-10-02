import { Button, IconButton, Tooltip } from '@mui/material';
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Droplets, MapPin, Maximize2, PencilRuler, Sprout, ThermometerSun, X, Mountain, TrendingUp, Info } from 'lucide-react';
import { useState } from 'react';
import type { Atlas, Parcel } from './types';
import { dateKey, EXAMPLE_YIELD, fmt, MONTH_NAMES } from './lib';
import { LineChart } from './Charts';

export default function ParcelPanel({ parcel, atlas, year, month, sensor, onClose, onLocate, onEdit, onAnalyze, onTechnical, onNext }: { parcel: Parcel; atlas: Atlas; year: number; month: number; sensor: string; onClose: () => void; onLocate: () => void; onEdit: () => void; onAnalyze: () => void; onTechnical: () => void; onNext: (direction: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const p = parcel.properties, details = atlas.details[p.id], key = dateKey(year, month);
  const weather = details?.climate[key];
  const values = Array.from({ length: 12 }, (_, m) => sensor === 'Landsat C2' ? atlas.landsat[dateKey(year, m)]?.parcels[p.id]?.mean ?? null : details?.ndvi['Sentinel-2']?.[dateKey(year, m)]?.mean ?? null);
  return <aside className="parcel-panel" aria-label="Ficha de parcela">
    <div className="panel-caption"><span><MapPin size={14}/>PARCELA SELECCIONADA</span><IconButton size="small" aria-label="Cerrar ficha de parcela" onClick={onClose}><X size={17}/></IconButton></div>
    <div className="panel-parcel-heading"><div><h2>{p.name || p.id}</h2><p><MapPin size={13}/>{p.municipality}, {p.state}</p></div><span className={`parcel-status ${p.group}`}>{p.group === 'training' ? 'Entrenamiento' : p.group === 'prediction' ? 'Predicción' : 'Mi parcela'}</span></div>
    <div className="panel-area"><div className="area-icon"><Sprout size={20}/></div><div><span>Superficie de cultivo</span><strong>{fmt(p.area)} <small>ha</small></strong></div><span className="crop-tag">CEBADA</span></div>
    {p.edited && <p className="edited-note">Límites ajustados · datos ambientales de los límites originales.</p>}
    <div className="yield-card"><div className="yield-title"><span><TrendingUp size={15}/>Rendimiento estimado</span><span className="example-label">EJEMPLO</span></div><strong>{fmt(EXAMPLE_YIELD)} <small>t/ha</small></strong><div className="yield-card-bottom"><span>Producción aproximada</span><b>{fmt(EXAMPLE_YIELD * p.area)} t</b></div><p>Valor de ejemplo. Modelo pendiente.</p></div>
    {p.observedYield != null && <div className="observed-yield"><span>Rendimiento registrado · ciclo 2025</span><b>{fmt(p.observedYield)} t/ha</b></div>}
    <div className="panel-section-title"><h3>El entorno de tu parcela</h3><span>{MONTH_NAMES[month]} {year}</span></div>
    <div className="weather-grid"><div><Droplets size={17} color="#6b9aac"/><span>Precipitación</span><strong>{fmt(weather?.precipitation, 0)} <small>mm</small></strong></div><div><ThermometerSun size={18} color="#c39355"/><span>Temperatura máx.</span><strong>{fmt(weather?.tmax, 1)} <small>°C</small></strong></div><div><Mountain size={17} color="#8b9481"/><span>Elevación</span><strong>{fmt(p.elevation, 0)} <small>m</small></strong></div></div>
    <div className="panel-section-title ndvi-panel-heading"><h3><span className="ndvi-dot"/>Vegetación de la parcela</h3><button onClick={onTechnical} aria-label="Ver curvas NDVI en detalle"><ArrowUpRight size={16}/></button></div>
    <div className="panel-ndvi-caption"><span>NDVI · {sensor}</span><strong>{fmt(values[month], 2)} <small>en {MONTH_NAMES[month].toLowerCase()}</small></strong></div>
    <LineChart values={values} compact/>
    <button className="coordinates-toggle" onClick={() => setExpanded(!expanded)}>Ubicación y detalles <ChevronDown size={14} className={expanded ? 'rotated' : ''}/></button>
    {expanded && <div className="coordinate-details"><span>Latitud<b>{fmt(p.centroid[1], 6)}</b></span><span>Longitud<b>{fmt(p.centroid[0], 6)}</b></span><span>Pendiente<b>{fmt(p.slope, 1)}°</b></span><button onClick={onLocate}><Maximize2 size={13}/>Acercar a la parcela</button></div>}
    <div className="parcel-panel-actions"><Button variant="contained" fullWidth onClick={onAnalyze} endIcon={<ArrowUpRight size={16}/>}>Analizar parcela</Button><Button fullWidth onClick={onEdit} startIcon={<PencilRuler size={15}/>}>Corregir límites</Button></div>
    <div className="panel-navigation"><span><Info size={12}/>Ficha del dataset FIRA</span><div><Tooltip title="Parcela anterior"><IconButton size="small" aria-label="Parcela anterior" onClick={() => onNext(-1)}><ChevronLeft size={16}/></IconButton></Tooltip><Tooltip title="Siguiente parcela"><IconButton size="small" aria-label="Siguiente parcela" onClick={() => onNext(1)}><ChevronRight size={16}/></IconButton></Tooltip></div></div>
  </aside>;
}
