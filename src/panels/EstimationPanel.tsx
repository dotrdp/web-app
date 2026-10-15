// Phase 2 · Estimar. Answers the organisers' questions in one place: the model's
// RMSE / MAE / R² (per parcel, no area weighting), what an error in t/ha means in
// tonnes and pesos on a real parcel, how often it holds, every estimate per
// ID_POLIGONO linked to the map, and the 59-parcel submission file.
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown, CircleHelp, Download, FileSpreadsheet, Search, Send, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { download, fmt, normalize, parcelCsv } from '../lib';
import { COVERAGE_LABEL, DEFAULT_PRICE_MXN_T, interval, money, productiveError, submissionCsv } from '../model';
import type { Coverage } from '../model';
import type { Atlas, Parcel } from '../types';

type SortKey = 'id' | 'municipality' | 'area' | 'observed' | 'predicted' | 'production' | 'error';
type SetFilter = 'all' | 'prediction' | 'training' | 'custom' | 'municipio';
const SETS: [SetFilter, string][] = [['all', 'Todas'], ['prediction', 'Reservadas · 59'], ['training', 'Con rendimiento · 138'], ['custom', 'Mis terrenos'], ['municipio', 'Por municipio']];

export function Stat({ label, value, unit, hint, className }: { label: string; value: string; unit?: string; hint?: string; className?: string }) {
  return <div className={cn('tile grid gap-0.5 px-3.5 py-3', className)}>
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-2xl font-normal tracking-tight tabular-nums">{value}{unit && <span className="ml-1 text-sm text-muted-foreground">{unit}</span>}</span>
    {hint && <span className="text-[11px] leading-tight text-muted-foreground">{hint}</span>}
  </div>;
}

export default function EstimationPanel({ atlas, parcels, selected, keyDate, onSelect, onHover, onClose }: { atlas: Atlas; parcels: Parcel[]; selected: Parcel | null; keyDate: string; onSelect: (id: string) => void; onHover: (id: string | null) => void; onClose: () => void }) {
  const model = atlas.predictions, m = model.metrics;
  const [price, setPrice] = useState(DEFAULT_PRICE_MXN_T);
  const [coverage, setCoverage] = useState<Coverage>('0.8');
  const [query, setQuery] = useState(''), [set, setSet] = useState<SetFilter>('prediction');
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: 'id', desc: false });
  const medianArea = useMemo(() => { const a = parcels.map(p => p.properties.area).sort((x, y) => x - y); return a[Math.floor(a.length / 2)] ?? 0; }, [parcels]);
  const area = selected?.properties.area ?? medianArea;
  const typical = productiveError(m.mae_t_ha, area, price), band = productiveError(model.absErrorQuantiles[coverage], area, price);

  const rows = useMemo(() => {
    const term = normalize(query);
    const value = (p: Parcel): number | string | null => {
      const f = p.properties;
      switch (sort.key) {
        case 'id': return f.id; case 'municipality': return f.municipality; case 'area': return f.area; case 'observed': return f.observedYield;
        case 'predicted': return f.predictedYield; case 'production': return f.predictedYield == null ? null : f.predictedYield * f.area;
        case 'error': return f.predictedYield != null && f.observedYield != null ? Math.abs(f.predictedYield - f.observedYield) : null;
      }
    };
    return parcels.filter(p => (set === 'all' || set === 'municipio' || p.properties.group === set) && (!term || normalize(`${p.properties.id} ${p.properties.name ?? ''} ${p.properties.municipality} ${p.properties.state}`).includes(term)))
      .sort((a, b) => { const x = value(a), y = value(b); if (x == null) return 1; if (y == null) return -1; const c = typeof x === 'string' ? x.localeCompare(String(y)) : x - (y as number); return sort.desc ? -c : c; });
  }, [parcels, query, set, sort]);
  const totals = useMemo(() => {
    const est = rows.filter(p => p.properties.predictedYield != null);
    const production = est.reduce((t, p) => t + p.properties.predictedYield! * p.properties.area, 0), haTotal = est.reduce((t, p) => t + p.properties.area, 0);
    return { production, ha: haTotal, mean: haTotal ? production / haTotal : null };
  }, [rows]);

  // Group-by (QGIS "Dissolve with stats"): planning and credit portfolios work per municipality.
  const municipalities = useMemo(() => {
    const groups = new Map<string, { name: string; state: string; count: number; ha: number; production: number; estHa: number; band: number }>();
    for (const p of rows) {
      const f = p.properties, k = `${f.state}/${f.municipality}`, g = groups.get(k) ?? { name: f.municipality, state: f.state, count: 0, ha: 0, production: 0, estHa: 0, band: 0 };
      g.count++; g.ha += f.area;
      if (f.predictedYield != null) { g.production += f.predictedYield * f.area; g.estHa += f.area; g.band += m.mae_t_ha * f.area; }
      groups.set(k, g);
    }
    return [...groups.values()].sort((a, b) => b.production - a.production);
  }, [rows, m.mae_t_ha]);
  const header = (key: SortKey, label: string, className?: string) => <th scope="col" aria-sort={sort.key === key ? (sort.desc ? 'descending' : 'ascending') : 'none'} className={cn('sticky top-0 z-10 bg-frame px-2 py-2 font-medium whitespace-nowrap', className)}>
    <button type="button" onClick={() => setSort(s => ({ key, desc: s.key === key ? !s.desc : key !== 'id' && key !== 'municipality' }))} className="inline-flex items-center gap-1 rounded-md hover:text-foreground">
      {label}{sort.key === key ? sort.desc ? <ArrowDown className="size-3"/> : <ArrowUp className="size-3"/> : <ChevronsUpDown className="size-3 opacity-40"/>}
    </button>
  </th>;
  const maxShare = Math.max(...Object.values(model.shareWithin));

  return <div className="@container/est flex h-full min-h-0 flex-col">
    <header className="flex items-start gap-3 px-5 pt-4 pb-3">
      <div className="grid min-w-0 flex-1 gap-0.5">
        <h2 className="text-lg font-medium tracking-tight">Estimación de rendimiento</h2>
        <p className="text-xs text-pretty text-muted-foreground">{model.model.name} · corte {model.model.cutoff} · {m.n} parcelas evaluadas por validación cruzada</p>
      </div>
      <Button variant="ghost" size="icon-sm" aria-label="Cerrar estimación" onClick={onClose} className="rounded-full"><X/></Button>
    </header>

    <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
      <section aria-label="Métricas" className="grid grid-cols-2 gap-2 @lg/est:grid-cols-4">
        <Stat label="MAE · error típico" value={fmt(m.mae_t_ha)} unit="t/ha" hint={`${Math.round(m.mae_t_ha / model.observedMean * 100)} % del rendimiento medio (${fmt(model.observedMean)} t/ha)`}/>
        <Stat label="RMSE" value={fmt(m.rmse_t_ha)} unit="t/ha" hint="Castiga más los errores grandes"/>
        <Stat label="R² · varianza explicada" value={fmt(m.r2)} hint={`Particiones: ${fmt(Math.min(...model.folds.map(f => f.r2)))}–${fmt(Math.max(...model.folds.map(f => f.r2)))}`}/>
        <Stat label="Sesgo medio" value={`${m.bias_t_ha >= 0 ? '+' : ''}${fmt(m.bias_t_ha)}`} unit="t/ha" hint="Positivo: tiende a sobreestimar"/>
      </section>

      <section aria-labelledby="productive-title" className="mt-3 grid gap-3 rounded-[20px] bg-primary-container/60 p-4 text-on-primary-container @2xl/est:grid-cols-[1.2fr_1fr]">
        <div className="grid content-start gap-2">
          <h3 id="productive-title" className="text-sm font-medium">¿Qué significa para un productor?</h3>
          <p className="text-[13px] leading-relaxed text-pretty">En {selected ? <b className="font-medium">{selected.properties.name || selected.properties.id}</b> : <>una parcela típica</>} de <b className="font-medium tabular-nums">{fmt(area, 2)} ha</b>, el error típico de <b className="font-medium tabular-nums">±{fmt(m.mae_t_ha)} t/ha</b> equivale a <b className="font-medium tabular-nums">±{fmt(typical.tonnes, 2)} t</b> de grano, unos <b className="font-medium tabular-nums">±{money(typical.pesos)}</b> a {money(price)}/t. En {COVERAGE_LABEL[coverage]} de las parcelas evaluadas el error fue menor que <b className="font-medium tabular-nums">{fmt(model.absErrorQuantiles[coverage])} t/ha</b> (±{fmt(band.tonnes, 2)} t · ±{money(band.pesos)}).</p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <label className="flex items-center gap-1.5 rounded-full bg-frame/70 py-1 pr-1 pl-3">Precio supuesto
              <input type="number" min={0} step={100} value={price} onChange={e => setPrice(Math.max(0, Number(e.target.value) || 0))} aria-label="Precio supuesto en pesos por tonelada" className="h-7 w-20 rounded-full bg-frame px-2 text-right tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"/>
              <span className="pr-2 text-muted-foreground">MXN/t</span></label>
            <div role="group" aria-label="Cobertura del intervalo" className="flex rounded-full bg-frame/70 p-0.5">
              {(Object.keys(COVERAGE_LABEL) as Coverage[]).map(c => <button key={c} type="button" aria-pressed={coverage === c} onClick={() => setCoverage(c)} className="rounded-full px-2.5 py-1 aria-pressed:bg-primary aria-pressed:text-primary-foreground">{COVERAGE_LABEL[c]}</button>)}
            </div>
          </div>
          <p className="text-[11px] text-pretty opacity-80">El precio es un supuesto editable, no una cotización. Selecciona una parcela en el mapa o la tabla para usar su superficie.</p>
        </div>
        <figure aria-label="Proporción de parcelas por debajo de cada error" className="grid content-end gap-1.5">
          <figcaption className="text-xs">Parcelas con error menor que…</figcaption>
          {Object.entries(model.shareWithin).filter(([t]) => t !== '0.1').map(([t, share]) => <div key={t} className="grid grid-cols-[4.2rem_1fr_2.6rem] items-center gap-2 text-xs tabular-nums">
            <span>{fmt(Number(t))} t/ha</span>
            <span className="h-2 overflow-hidden rounded-full bg-frame/70"><span className="block h-full rounded-full bg-primary" style={{ width: `${share / maxShare * 100}%` }}/></span>
            <span className="text-right font-medium">{Math.round(share * 100)} %</span>
          </div>)}
        </figure>
      </section>

      <section aria-labelledby="table-title" className="mt-4 grid gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 id="table-title" className="mr-auto text-sm font-medium">Estimaciones por ID_POLIGONO</h3>
          <Button size="sm" className="rounded-full" onClick={() => download('agrocebada-entrega-59.csv', submissionCsv(model), 'text/csv')}><Send/>Entrega · 59 parcelas</Button>
          <Button size="sm" variant="outline" className="rounded-full bg-transparent" onClick={() => download('agrocebada-estimaciones.csv', parcelCsv(rows, atlas, keyDate), 'text/csv')}><FileSpreadsheet/>Tabla CSV</Button>
          <Button size="sm" variant="ghost" className="rounded-full" aria-label="Descargar GeoJSON con estimaciones" onClick={() => download('agrocebada-estimaciones.geojson', JSON.stringify({ type: 'FeatureCollection', features: rows }), 'application/geo+json')}><Download/>GeoJSON</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="tablist" aria-label="Conjunto" className="flex flex-wrap gap-1 rounded-full bg-tile p-1 text-xs">
            {SETS.map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={set === key} onClick={() => setSet(key)} className="rounded-full px-3 py-1 text-muted-foreground aria-selected:bg-frame aria-selected:text-foreground aria-selected:shadow-xs">{label}</button>)}
          </div>
          <label className="ml-auto flex h-8 w-52 items-center gap-2 rounded-full bg-tile px-3 text-sm focus-within:ring-2 focus-within:ring-ring max-sm:w-full"><Search className="size-3.5 text-muted-foreground"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filtrar ID o municipio" aria-label="Filtrar estimaciones" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"/></label>
        </div>
        {set === 'municipio' ? <div className="max-h-[22rem] overflow-auto rounded-2xl bg-tile/60">
          <table className="w-full text-left text-[13px]" aria-label="Estimaciones por municipio">
            <thead className="text-xs text-muted-foreground"><tr>{['Municipio', 'Parcelas', 'Superficie ha', 'Rendimiento t/ha', 'Producción t', '± error típico t'].map((h, i) => <th key={h} scope="col" className={cn('sticky top-0 bg-frame px-2 py-2 font-medium whitespace-nowrap', i === 0 ? 'pl-3' : 'text-right', i === 5 && 'pr-3')}>{h}</th>)}</tr></thead>
            <tbody>{municipalities.map(g => <tr key={g.state + g.name} className="border-t border-frame/80">
              <td className="py-1.5 pr-2 pl-3"><span className="font-medium">{g.name}</span> <span className="text-xs text-muted-foreground">{g.state}</span></td>
              <td className="px-2 text-right tabular-nums">{g.count}</td><td className="px-2 text-right tabular-nums">{fmt(g.ha, 1)}</td>
              <td className="px-2 text-right tabular-nums">{fmt(g.estHa ? g.production / g.estHa : null)}</td><td className="px-2 text-right font-medium tabular-nums">{fmt(g.production, 0)}</td><td className="pr-3 pl-2 text-right text-muted-foreground tabular-nums">±{fmt(g.band, 0)}</td>
            </tr>)}</tbody>
          </table>
        </div> : <div className="max-h-[22rem] overflow-auto rounded-2xl bg-tile/60">
          <table className="w-full text-left text-[13px]" aria-label="Estimaciones de rendimiento">
            <thead className="text-xs text-muted-foreground"><tr>
              {header('id', 'ID_POLIGONO', 'pl-3')}{header('municipality', 'Municipio', 'max-sm:hidden')}{header('area', 'AREA_HA', 'text-right')}{header('observed', 'Registrado', 'text-right')}{header('predicted', 'Estimado', 'text-right')}
              <th scope="col" className="sticky top-0 z-10 bg-frame px-2 py-2 text-right font-medium whitespace-nowrap @max-2xl/est:hidden">Intervalo {COVERAGE_LABEL[coverage]}</th>
              {header('production', 'Producción t', 'pr-3 text-right')}
            </tr></thead>
            <tbody>{rows.map(p => { const f = p.properties, est = f.predictedYield, range = est == null ? null : interval(model, est, coverage), active = selected?.properties.id === f.id;
              return <tr key={f.id} aria-selected={active} onClick={() => onSelect(f.id)} onMouseEnter={() => onHover(f.id)} onMouseLeave={() => onHover(null)} className="cursor-pointer border-t border-frame/80 hover:bg-tile aria-selected:bg-primary-container aria-selected:text-on-primary-container">
                <td className="py-1.5 pr-2 pl-3 font-mono text-xs">{f.name || f.id}</td>
                <td className="max-w-28 truncate px-2 max-sm:hidden">{f.municipality}</td>
                <td className="px-2 text-right tabular-nums">{fmt(f.area)}</td>
                <td className="px-2 text-right tabular-nums text-muted-foreground">{fmt(f.observedYield)}</td>
                <td className="px-2 text-right font-medium tabular-nums">{fmt(est)}{f.group === 'training' && est != null && <sup className="ml-0.5 text-[9px] font-normal text-muted-foreground" title="Predicción fuera de partición (validación cruzada)">VC</sup>}</td>
                <td className="px-2 text-right text-xs whitespace-nowrap tabular-nums text-muted-foreground @max-2xl/est:hidden">{range ? `${fmt(range[0])}–${fmt(range[1])}` : '—'}</td>
                <td className="pr-3 pl-2 text-right tabular-nums">{est == null ? '—' : fmt(est * f.area, 1)}</td>
              </tr>; })}</tbody>
            <tfoot><tr className="sticky bottom-0 bg-frame text-xs font-medium"><td className="py-2 pl-3 whitespace-nowrap">{rows.length} parcelas</td><td className="max-sm:hidden"/><td className="px-2 text-right tabular-nums">{fmt(totals.ha, 1)}</td><td/><td className="px-2 text-right tabular-nums" title="Media ponderada por superficie">{fmt(totals.mean)}</td><td className="@max-2xl/est:hidden"/><td className="pr-3 text-right tabular-nums">{fmt(totals.production, 0)}</td></tr></tfoot>
          </table>
        </div>}
        <p className="text-[11px] text-muted-foreground">{set === 'municipio' && 'El ± suma el error típico por hectárea de cada parcela; es una cota conservadora porque los errores se compensan en parte. '}VC: estimación fuera de partición para las 138 parcelas con rendimiento (el modelo no vio esa parcela). Las 59 reservadas usan el promedio de los cinco modelos de partición.</p>
      </section>

      <Accordion type="single" collapsible className="mt-3 rounded-2xl bg-tile/60 px-4">
        <AccordionItem value="notes" className="border-0">
          <AccordionTrigger className="text-sm hover:no-underline"><span className="flex items-center gap-2"><CircleHelp className="size-4 text-primary"/>Cómo leer estas cifras</span></AccordionTrigger>
          <AccordionContent>
            <ul className="grid gap-2 text-[13px] leading-relaxed text-pretty text-muted-foreground">
              <li><b className="font-medium text-foreground">Superficie.</b> AREA_HA es la superficie del polígono georreferenciado; la producción estimada multiplica t/ha por esa superficie.</li>
              <li><b className="font-medium text-foreground">Rendimiento.</b> Grano cosechado pesado en báscula, sin ajuste por humedad, impurezas o mermas; incluye todo lo recolectado. Proviene sobre todo de la comercializadora y en menor proporción de productores; ambas fuentes se tratan como una sola variable porque no se identifican por parcela.</li>
              <li><b className="font-medium text-foreground">Evaluación.</b> RMSE, MAE y R² por parcela, sin ponderar por superficie, como en la evaluación oficial. División 70/30 estratificada: 138 parcelas para entrenar y 59 reservadas.</li>
              <li><b className="font-medium text-foreground">Momento.</b> El reto no fija fecha de corte. Esta estimación usa datos hasta el {model.model.cutoff}: {model.model.window.charAt(0).toLowerCase() + model.model.window.slice(1)}</li>
              <li><b className="font-medium text-foreground">Límites de uso.</b> No hay un umbral oficial de error aceptable. Con ±{fmt(m.mae_t_ha)} t/ha la estimación sirve para planear acopio, logística y carteras de crédito por municipio o estado; para decidir sobre una sola parcela conviene usar el intervalo y confirmar en campo. Es un solo ciclo (2025): la generalización a otros años no está evaluada.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </div>;
}
