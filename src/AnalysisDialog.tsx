import { useState } from 'react';
import { Alert, Button, Dialog, DialogContent, IconButton } from '@mui/material';
import { ArrowRight, Check, Download, Info, MapPin, Sprout, TrendingUp, X } from 'lucide-react';
import type { Analysis, Parcel } from './types';
import { api, download, fmt } from './lib';
import { LoadingDots, LoadingState, LoadingValue } from './AgentProgress';

export default function AnalysisDialog({ parcel, onClose, onSaved }: { parcel: Parcel; onClose: () => void; onSaved: (analysis: Analysis) => void }) {
  const [result, setResult] = useState<Analysis | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const p = parcel.properties;
  async function analyze() {
    setBusy(true); setError('');
    try { const data = await api<Analysis>('/api/analyses', { method: 'POST', body: JSON.stringify({ geometry: parcel.geometry, parcelId: p.id, name: p.name || p.id }) }); setResult(data); onSaved(data); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  return <Dialog open onClose={busy ? undefined : onClose} maxWidth="sm" fullWidth aria-labelledby="analysis-title"><DialogContent className="analysis-dialog">
    <div className="dialog-heading"><div className="dialog-mark"><Sprout size={25}/></div><IconButton aria-label="Cerrar análisis" onClick={onClose}><X size={20}/></IconButton></div>
    <span className="section-kicker">{result ? 'VISTA PREVIA DEL RESULTADO' : 'CONOCE TU PARCELA'}</span><h2 id="analysis-title">{result ? 'Una mirada a tu campo.' : 'Analizar parcela'}</h2><p className="dialog-subtitle"><MapPin size={14}/>{p.name || p.id} · {p.municipality}, {p.state}</p>
    <Alert severity="info" icon={<Info size={19}/>} className="model-notice">El rendimiento de <b>4.2 t/ha</b> es un valor de ejemplo. El modelo todavía no está conectado.</Alert>
    {error && <Alert severity="error">{error}</Alert>}
    {result ? <><div className="analysis-result"><span className="example-label">EJEMPLO · SIN INFERENCIA</span><div><TrendingUp size={23}/><strong>{fmt(result.yield)}<small> t/ha</small></strong><p>Rendimiento de ejemplo</p></div><div className="analysis-result-bottom"><span>Superficie geométrica<b>{fmt(result.area)} ha</b></span><span>Producción de ejemplo<b>{fmt(result.production)} t</b></span></div></div><p className="saved-result"><Check size={14}/>Guardado en tus análisis. {new Date(result.createdAt).toLocaleDateString('es-MX')}</p><div className="dialog-actions"><Button variant="outlined" startIcon={<Download size={16}/>} onClick={() => download(`agrocebada-${p.name || p.id}-ejemplo.json`, JSON.stringify(result, null, 2), 'application/json')}>Descargar resultado</Button><Button variant="contained" onClick={onClose}>Volver al mapa</Button></div></> : <>{busy ? <div className="analysis-loading"><LoadingState label="Preparando resultado de ejemplo…"/><div className="analysis-result" aria-hidden="true"><span className="example-label">EJEMPLO · SIN INFERENCIA</span><div><LoadingValue label="Rendimiento pendiente" unit="t/ha"/><p>Rendimiento de ejemplo</p></div><div className="analysis-result-bottom"><span>Superficie geométrica<LoadingValue label="Superficie pendiente" unit="ha"/></span><span>Producción de ejemplo<LoadingValue label="Producción pendiente" unit="t"/></span></div></div></div> : <div className="analysis-preview-details"><span>Superficie declarada<b>{fmt(p.area)} ha</b></span><span>Cultivo<b>Cebada</b></span><span>Ubicación<b>{fmt(p.centroid[1], 5)}, {fmt(p.centroid[0], 5)}</b></span></div>}<div className="dialog-actions"><Button onClick={onClose}>Cancelar</Button><Button variant="contained" disabled={busy} endIcon={busy ? undefined : <ArrowRight size={16}/>} onClick={analyze}>{busy ? <><LoadingDots/>Preparando resultado…</> : 'Analizar parcela'}</Button></div></>}
  </DialogContent></Dialog>;
}
