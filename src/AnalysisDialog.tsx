import { useState } from 'react';
import { Alert, Button, Dialog, DialogContent, IconButton } from '@mui/material';
import { ArrowRight, Check, Download, Info, X } from 'lucide-react';
import type { Analysis, Parcel } from './types';
import { api, download, fmt } from './lib';
import { LoadingDots, LoadingState, LoadingValue } from './AgentProgress';
import './pages.css';

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
  return <Dialog open onClose={busy ? undefined : onClose} maxWidth="sm" fullWidth aria-labelledby="analysis-title" slotProps={{ paper: { className: 'analysis-dialog-paper' } }}><DialogContent className="analysis-dialog">
    <div className="dialog-heading">
      <div className="dialog-heading-copy">
        <h2 id="analysis-title">{result ? 'Una mirada a tu campo.' : 'Analizar parcela'}</h2>
        <p className="dialog-subtitle">{p.name || p.id} · {p.municipality}, {p.state}</p>
      </div>
      <IconButton className="dialog-close" size="small" aria-label="Cerrar análisis" onClick={onClose}><X size={16} strokeWidth={1.75}/></IconButton>
    </div>

    <div className="dialog-body">
      <Alert severity="info" icon={<Info size={16}/>} className="model-notice">El rendimiento de <b>4.2 t/ha</b> es un valor de ejemplo. El modelo todavía no está conectado.</Alert>
      {error && <Alert severity="error">{error}</Alert>}
      {result ? <>
        <div className="analysis-result">
          <span className="ui-badge ui-badge-warning example-label">Ejemplo · sin inferencia</span>
          <div className="analysis-result-main"><strong className="display-figure">{fmt(result.yield)}<small>t/ha</small></strong><p>Rendimiento de ejemplo</p></div>
          <div className="analysis-result-bottom"><span><span className="field-label">Superficie geométrica</span><b>{fmt(result.area)} ha</b></span><span><span className="field-label">Producción de ejemplo</span><b>{fmt(result.production)} t</b></span></div>
        </div>
        <p className="saved-result"><Check size={15} strokeWidth={2} aria-hidden="true"/>Guardado en tus análisis. {new Date(result.createdAt).toLocaleDateString('es-MX')}</p>
      </> : busy ? <div className="analysis-loading">
        <LoadingState label="Preparando resultado de ejemplo…"/>
        <div className="analysis-result" aria-hidden="true">
          <span className="ui-badge ui-badge-warning example-label">Ejemplo · sin inferencia</span>
          <div className="analysis-result-main"><LoadingValue label="Rendimiento pendiente" unit="t/ha"/><p>Rendimiento de ejemplo</p></div>
          <div className="analysis-result-bottom"><span><span className="field-label">Superficie geométrica</span><LoadingValue label="Superficie pendiente" unit="ha"/></span><span><span className="field-label">Producción de ejemplo</span><LoadingValue label="Producción pendiente" unit="t"/></span></div>
        </div>
      </div> : <dl className="analysis-preview-details">
        <div><dt className="field-label">Superficie declarada</dt><dd>{fmt(p.area)} ha</dd></div>
        <div><dt className="field-label">Cultivo</dt><dd>Cebada</dd></div>
        <div><dt className="field-label">Ubicación</dt><dd className="mono">{fmt(p.centroid[1], 5)}, {fmt(p.centroid[0], 5)}</dd></div>
      </dl>}
    </div>

    <div className="dialog-actions">{result ? <>
      <Button variant="outlined" startIcon={<Download size={14}/>} onClick={() => download(`agrocebada-${p.name || p.id}-ejemplo.json`, JSON.stringify(result, null, 2), 'application/json')}>Descargar resultado</Button>
      <Button variant="contained" onClick={onClose}>Volver al mapa</Button>
    </> : <>
      <Button variant="outlined" onClick={onClose}>Cancelar</Button>
      <Button variant="contained" disabled={busy} endIcon={busy ? undefined : <ArrowRight size={15}/>} onClick={analyze}>{busy ? <><LoadingDots/>Preparando resultado…</> : 'Analizar parcela'}</Button>
    </>}</div>
  </DialogContent></Dialog>;
}
