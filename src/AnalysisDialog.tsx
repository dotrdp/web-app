import { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowRight, CircleCheck, Download, FlaskConical, Info, TriangleAlert, X } from 'lucide-react';
import type { Analysis, Parcel } from './types';
import { api, download, fmt } from './lib';
import { LoadingDots, LoadingState, LoadingValue } from './AgentProgress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

function ExampleBadge() {
  return <Badge variant="outline" className="border-chart-5/50 bg-chart-5/10 tracking-wide text-foreground uppercase"><FlaskConical/>Ejemplo · sin inferencia</Badge>;
}

/** Result panel; the same layout renders with pending values while the request runs. */
function ResultPanel({ yieldValue, area, production }: { yieldValue: ReactNode; area: ReactNode; production: ReactNode }) {
  return <div className="flex flex-col gap-4 rounded-xl border bg-gradient-to-t from-primary/5 to-card p-4 shadow-xs dark:bg-card">
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">Rendimiento de ejemplo</span>
        <div className="text-4xl font-semibold tracking-tight tabular-nums">{yieldValue}</div>
      </div>
      <ExampleBadge/>
    </div>
    <p className="text-sm text-muted-foreground">Valor fijo de ejemplo, sin inferencia.</p>
    <Separator/>
    <dl className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-1"><dt className="text-xs text-muted-foreground">Superficie geométrica</dt><dd className="text-base font-medium tabular-nums">{area}</dd></div>
      <div className="flex flex-col gap-1"><dt className="text-xs text-muted-foreground">Producción de ejemplo</dt><dd className="text-base font-medium tabular-nums">{production}</dd></div>
    </dl>
  </div>;
}

const Unit = ({ children }: { children: ReactNode }) => <span className="ml-1 text-sm font-normal text-muted-foreground">{children}</span>;

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
  return <Dialog open onOpenChange={open => { if (!open && !busy) onClose(); }}>
    <DialogContent showCloseButton={false} className="gap-5 sm:max-w-lg" onInteractOutside={e => { if (busy) e.preventDefault(); }}>
      <DialogHeader className="pr-8">
        <DialogTitle className="text-lg font-semibold">{result ? 'Una mirada a tu campo.' : 'Analizar parcela'}</DialogTitle>
        <DialogDescription>{p.name || p.id} · {p.municipality}, {p.state}</DialogDescription>
      </DialogHeader>
      <DialogClose asChild><Button variant="ghost" size="icon-sm" className="absolute top-3 right-3" aria-label="Cerrar análisis" disabled={busy}><X/></Button></DialogClose>

      <Alert><Info/><AlertDescription className="text-pretty">El rendimiento de <b className="font-medium text-foreground">4.2 t/ha</b> es un valor de ejemplo. El modelo todavía no está conectado.</AlertDescription></Alert>
      {error && <Alert variant="destructive"><TriangleAlert/><AlertDescription className="text-pretty">{error}</AlertDescription></Alert>}

      {result ? <div className="flex flex-col gap-3">
        <ResultPanel yieldValue={<>{fmt(result.yield)}<Unit>t/ha</Unit></>} area={<>{fmt(result.area)} ha</>} production={<>{fmt(result.production)} t</>}/>
        <p className="flex items-center gap-2 text-sm text-muted-foreground"><CircleCheck className="size-4 text-chart-1" aria-hidden="true"/>Guardado en tus análisis. {new Date(result.createdAt).toLocaleDateString('es-MX')}</p>
      </div> : busy ? <div className="analysis-loading flex flex-col gap-3">
        <LoadingState label="Preparando resultado de ejemplo…"/>
        <div aria-hidden="true"><ResultPanel yieldValue={<LoadingValue label="Rendimiento pendiente" unit="t/ha"/>} area={<LoadingValue label="Superficie pendiente" unit="ha"/>} production={<LoadingValue label="Producción pendiente" unit="t"/>}/></div>
      </div> : <dl className="grid grid-cols-1 divide-y rounded-xl border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {[['Superficie declarada', `${fmt(p.area)} ha`], ['Cultivo', 'Cebada'], ['Ubicación', `${fmt(p.centroid[1], 5)}, ${fmt(p.centroid[0], 5)}`]].map(([label, value], i) => <div key={label} className="flex items-center justify-between gap-1 px-4 py-3 sm:flex-col sm:items-start">
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className={i === 2 ? 'font-mono text-xs tabular-nums' : 'text-base font-medium tabular-nums'}>{value}</dd>
        </div>)}
      </dl>}

      <DialogFooter>{result ? <>
        <Button variant="outline" onClick={() => download(`agrocebada-${p.name || p.id}-ejemplo.json`, JSON.stringify(result, null, 2), 'application/json')}><Download data-icon="inline-start"/>Descargar resultado</Button>
        <Button onClick={onClose}>Volver al mapa</Button>
      </> : <>
        <Button variant="outline" onClick={onClose} disabled={busy}>Cancelar</Button>
        <Button disabled={busy} onClick={analyze}>{busy ? <><LoadingDots/>Preparando resultado…</> : <>Analizar parcela<ArrowRight data-icon="inline-end"/></>}</Button>
      </>}</DialogFooter>
    </DialogContent>
  </Dialog>;
}
