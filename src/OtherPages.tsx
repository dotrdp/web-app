import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, InputAdornment, MenuItem, Pagination, Select, TextField } from '@mui/material';
import { ArrowUpDown, ChevronRight, Download, ExternalLink, Info, Search } from 'lucide-react';
import type { Atlas, Parcel, User, Workspace } from './types';
import { api, download, EXAMPLE_YIELD, fmt, normalize, parcelCsv } from './lib';
import { LoadingValue } from './AgentProgress';
import './pages.css';

const GROUP_LABELS: Record<Parcel['properties']['group'], string> = { training: 'Entrenamiento', prediction: 'Predicción', custom: 'Mi parcela' };

/** Thin bar reading of a 0–1 vegetation index. */
function NdviMeter({ value }: { value: number | null | undefined }) {
  const filled = value == null ? 0 : Math.max(0, Math.min(1, value)) * 100;
  return <span className="ndvi-meter" aria-hidden="true"><i style={{ width: `${filled}%` }}/></span>;
}

/** Title + optional description: the header of every card. No icon tile. */
export function CardHeading({ title, description, level = 3 }: { title: string; description?: React.ReactNode; level?: 2 | 3 }) {
  const Heading = level === 2 ? 'h2' : 'h3';
  return <div className="card-heading"><div><Heading>{title}</Heading>{description && <p>{description}</p>}</div></div>;
}

/** KPI: muted label, 30px tabular figure, muted caption. */
export function Stat({ label, children, foot }: { label: string; children: React.ReactNode; foot?: React.ReactNode }) {
  return <div className="stat">
    <span className="stat-label">{label}</span>
    {children}
    {foot && <span className="stat-foot">{foot}</span>}
  </div>;
}

export function ParcelsPage({ parcels, atlas, workspace, keyDate, onSelect, onAnalyze }: { parcels: Parcel[]; atlas: Atlas; workspace: Workspace; keyDate: string; onSelect: (id: string) => void; onAnalyze: (p: Parcel) => void }) {
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('all');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'id' | 'area'>('id');
  const filtered = useMemo(() => parcels.filter(p => (group === 'all' || p.properties.group === group) && normalize(`${p.properties.id} ${p.properties.name || ''} ${p.properties.municipality} ${p.properties.state}`).includes(normalize(search))).sort((a, b) => sort === 'area' ? b.properties.area - a.properties.area : a.properties.id.localeCompare(b.properties.id)), [parcels, search, group, sort]);
  useEffect(() => { setPage(1); }, [search, group]);
  const summary = useMemo(() => ({
    training: parcels.filter(p => p.properties.group === 'training').length,
    prediction: parcels.filter(p => p.properties.group === 'prediction').length,
    custom: parcels.filter(p => p.properties.group === 'custom').length,
    area: parcels.reduce((total, p) => total + (p.properties.area || 0), 0),
  }), [parcels]);
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  const rows = filtered.slice((page - 1) * 12, page * 12);
  return <div className="parcels-page page-stack">
    <div className="stat-strip ui-card" aria-label="Resumen de parcelas" role="group">
      <Stat label="Parcelas" foot="En tu espacio de trabajo"><strong className="stat-value">{parcels.length}</strong></Stat>
      <Stat label="Entrenamiento" foot="Con rendimiento registrado"><strong className="stat-value">{summary.training}</strong></Stat>
      <Stat label="Predicción" foot="Conjunto a estimar"><strong className="stat-value">{summary.prediction}</strong></Stat>
      <Stat label="Superficie" foot={summary.custom ? `${summary.custom} trazadas por ti` : 'Superficie declarada'}><strong className="stat-value">{fmt(summary.area, 0)}<small>ha</small></strong></Stat>
    </div>

    <section className="data-card parcel-table-card" aria-label="Parcelas del espacio">
      <div className="table-toolbar">
        <TextField className="toolbar-search" size="small" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar ID, municipio o estado…" slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={15}/></InputAdornment> } }} inputProps={{ 'aria-label': 'Buscar en mis parcelas' }}/>
        <Select className="toolbar-select" size="small" value={group} onChange={e => setGroup(e.target.value)} inputProps={{ 'aria-label': 'Conjunto de parcelas' }}><MenuItem value="all">Todos los conjuntos</MenuItem><MenuItem value="training">Entrenamiento</MenuItem><MenuItem value="prediction">Predicción</MenuItem><MenuItem value="custom">Mis terrenos</MenuItem></Select>
        <span className="toolbar-count"><b>{filtered.length}</b> parcelas</span>
        <Button className="toolbar-action" variant="outlined" startIcon={<Download size={14}/>} onClick={() => download('agrocebada-parcelas.csv', parcelCsv(filtered, atlas, keyDate), 'text/csv;charset=utf-8')}>Exportar CSV</Button>
      </div>
      <div className="table-scroll parcel-table-wrap"><table className="parcel-table parcel-table-fixed">
        <colgroup><col className="col-id"/><col/><col className="col-area"/><col className="col-group"/><col className="col-yield"/><col className="col-ndvi"/><col className="col-action"/></colgroup>
        <thead><tr>
          <th aria-sort={sort === 'id' ? 'ascending' : 'none'}><button className={`th-sort ${sort === 'id' ? 'active' : ''}`} onClick={() => setSort('id')}>Parcela <ArrowUpDown size={12}/></button></th>
          <th>Ubicación</th>
          <th className="num" aria-sort={sort === 'area' ? 'descending' : 'none'}><button className={`th-sort ${sort === 'area' ? 'active' : ''}`} onClick={() => setSort('area')}>Superficie <ArrowUpDown size={12}/></button></th>
          <th>Conjunto</th>
          <th className="num" title="Rendimiento registrado">Rendimiento</th>
          <th>NDVI · Landsat</th>
          <th><span className="sr-only">Acciones</span></th>
        </tr></thead>
        <tbody>{rows.map(p => {
          const ndvi = atlas.landsat[keyDate]?.parcels[p.properties.id]?.mean;
          return <tr key={p.properties.id} className="row-link" onClick={() => onSelect(p.properties.id)}>
            <td><button className="table-parcel-id" onClick={e => { e.stopPropagation(); onSelect(p.properties.id); }}>{p.properties.name || p.properties.id}</button></td>
            <td><span className="cell-stack">{p.properties.municipality}<small>{p.properties.state}</small></span></td>
            <td className="num">{fmt(p.properties.area)} <small className="inline-small">ha</small></td>
            <td><span className={`parcel-status ${p.properties.group}`}>{GROUP_LABELS[p.properties.group]}</span></td>
            <td className="num">{p.properties.observedYield == null ? <span className="cell-empty">—</span> : <>{fmt(p.properties.observedYield)} <small className="inline-small">t/ha</small></>}</td>
            <td><span className="ndvi-cell"><NdviMeter value={ndvi}/><span className="ndvi-value">{fmt(ndvi, 3)}</span></span></td>
            <td className="row-action"><Button size="small" className="row-analyze" onClick={e => { e.stopPropagation(); onAnalyze(p); }}>Analizar</Button><ChevronRight className="row-chevron" size={16} strokeWidth={1.75} aria-hidden="true"/></td>
          </tr>;
        })}</tbody>
      </table></div>
      <ul className="parcel-cards" aria-label="Parcelas">{rows.map(p => <li key={p.properties.id}>
        <button className="parcel-card-row" onClick={() => onSelect(p.properties.id)}>
          <span className="parcel-card-main"><b>{p.properties.name || p.properties.id}</b><small>{p.properties.municipality} · {p.properties.state}</small></span>
          <span className="parcel-card-meta"><span className="parcel-card-yield">{p.properties.observedYield == null ? <span className="cell-empty">—</span> : <>{fmt(p.properties.observedYield)} <small>t/ha</small></>}</span><span className={`parcel-status ${p.properties.group}`}>{GROUP_LABELS[p.properties.group]}</span></span>
          <ChevronRight className="row-chevron" size={16} strokeWidth={1.75} aria-hidden="true"/>
        </button>
      </li>)}</ul>
      {!filtered.length && <div className="empty-state">
        <h3>No encontramos parcelas</h3><p>Prueba con otro ID o municipio.</p>
        <Button variant="outlined" onClick={() => { setSearch(''); setGroup('all'); }}>Limpiar filtros</Button>
      </div>}
      <div className="table-footer"><span>Datos originales FIRA · 138 de entrenamiento y 59 de predicción</span><Pagination className="ui-pagination" size="small" count={pages} page={page} onChange={(_, p) => setPage(p)}/></div>
    </section>

    <section className="data-card analyses-card">
      <div className="data-card-header">
        <CardHeading title="Tus análisis" description="Resultados guardados en este espacio de trabajo"/>
        <span className="ui-badge">{workspace.analyses.length} guardados</span>
      </div>
      {workspace.analyses.length ? <ul className="saved-analysis-list">{workspace.analyses.slice(0, 12).map(a => <li key={a.id}>
        <span className="saved-analysis-name"><b>{a.name}</b><small>{new Date(a.createdAt).toLocaleDateString('es-MX')} · {fmt(a.area)} ha</small></span>
        <span className="ui-badge ui-badge-warning example-label">Ejemplo</span>
        <strong className="saved-analysis-yield"><span className="figure">{fmt(a.yield)}</span> <small>t/ha</small></strong>
        <Button size="small" startIcon={<Download size={13}/>} onClick={() => download(`${a.name}-ejemplo.json`, JSON.stringify(a, null, 2), 'application/json')}>Descargar</Button>
      </li>)}</ul> : <div className="empty-state small">
        <h3>Tu próximo análisis empieza en el mapa.</h3><p>Selecciona una parcela y presiona “Analizar parcela”.</p>
      </div>}
    </section>
  </div>;
}

export function ModelsPage() {
  const metrics: [string, string, string][] = [['RMSE', 'Error cuadrático medio', 't/ha'], ['MAE', 'Error absoluto medio', 't/ha'], ['R²', 'Varianza explicada', ''], ['Validación', 'Parcela independiente', '']];
  const inputs: [string, string, string][] = [['197', 'Parcelas georreferenciadas', 'Límites originales del reto'], ['64', 'Dimensiones AlphaEarth', '2017–2025 · resolución de 10 m'], ['48', 'Meses de clima', 'Precipitación y temperatura · 2022–2025'], ['138', 'Rendimientos registrados', 'Ciclo de cebada de 2025']];
  return <div className="models-page page-stack">
    <section className="model-intro data-card">
      <div className="model-intro-copy">
        <h2 className="section-title">El espacio para tu modelo.</h2>
        <p>Las predicciones y sus métricas se incorporarán aquí. Por ahora, las fichas muestran un valor fijo de ejemplo de <b>{fmt(EXAMPLE_YIELD)} t/ha</b>.</p>
        <span className="ui-badge ui-badge-warning model-status-label"><span className="status-dot"/>Modelo pendiente</span>
      </div>
      <div className="model-intro-example">
        <span className="stat-label">Valor de ejemplo</span>
        <strong className="display-figure">{fmt(EXAMPLE_YIELD)}<small>t/ha</small></strong>
        <span className="ui-badge ui-badge-warning example-label">Ejemplo · sin inferencia</span>
      </div>
    </section>

    <section className="stat-strip ui-card model-metrics" aria-label="Métricas del modelo">{metrics.map(([title, desc, unit]) => <Stat key={title} label={title} foot={desc}>
      <LoadingValue className="stat-value metric-value" active={false} label={`${title} pendiente del modelo`} unit={unit}/>
    </Stat>)}</section>

    <section className="data-card">
      <div className="data-card-header"><CardHeading title="Datos disponibles para el análisis" description="Los datos geográficos y satelitales ya están en el atlas"/><span className="ui-badge">En el atlas</span></div>
      <div className="input-source-grid">{inputs.map(([value, label, detail]) => <Stat key={label} label={label} foot={detail}><strong className="stat-value">{value}</strong></Stat>)}</div>
    </section>

    <p className="page-note"><Info size={14} strokeWidth={1.75} aria-hidden="true"/>Los valores de ejemplo no deben usarse para decisiones de producción. No se ha ejecutado ningún modelo predictivo en esta aplicación.</p>
  </div>;
}

export function SourcesPage({ atlas }: { atlas: Atlas }) {
  const sources = [
    { title: 'Sentinel-2 · Vegetación y agua', desc: 'RGB y NDVI a 10 m; MNDWI a 20 m. Mosaicos mensuales de observaciones despejadas sobre los límites completos de Hidalgo, Puebla y Tlaxcala. Calibración por escena y máscara SCL. Los candidatos de agua usan MNDWI ≥ 0, sin diagnóstico ni alertas.', tag: 'Copernicus', stat: '48 meses · 16 teselas', url: '/data/sentinel-index.json', download: 'sentinel-manifiestos.json', button: 'Descargar versiones' },
    { title: 'Delimitación de parcelas', desc: 'SAM 2.1 tiny preentrenado y fijo. Propuestas sobre la imagen RGB del mes seleccionado, con puntos de inclusión y exclusión. Límites aproximados de 10 m; requieren revisión y guardado explícito. Las correcciones conservan la propuesta y su procedencia.', tag: 'SAM 2.1', stat: 'Propuestas editables', url: 'https://github.com/facebookresearch/sam2' },
    { title: 'Parcelas del reto', desc: '197 límites originales, superficies y 138 rendimientos registrados de cebada. 59 parcelas conforman el conjunto de predicción.', tag: 'FIRA 2026', stat: '197 parcelas', url: '/data/parcels.geojson', download: 'parcelas-agrocebada.geojson', button: 'Descargar GeoJSON' },
    { title: 'Límites territoriales', desc: 'Hidalgo, Puebla y Tlaxcala. Marco Geoestadístico de INEGI, diciembre de 2025. Límites de 361 municipios reproyectados a WGS 84.', tag: 'INEGI', stat: '3 estados · 361 municipios', url: 'https://www.inegi.org.mx/servicios/catalogounico.html' },
    { title: 'Clima y relieve', desc: 'Precipitación CHIRPS, temperatura mínima y máxima CHIRTS-ERA5, elevación y pendiente INEGI CEM4. Rasters de la entrega original y simbología QGIS.', tag: '2022–2025', stat: '146 capas', url: '/data/layers.json', download: 'inventario-capas.json', button: 'Descargar inventario' },
    { title: 'AlphaEarth Foundations', desc: 'Embeddings anuales de Google y Google DeepMind. 64 ejes A00–A63, 10 m. Vista RGB A00/A01/A02. Media ponderada por área después de decuantizar y normalizar.', tag: 'CC BY 4.0', stat: '2017–2025', url: 'https://developers.google.com/earth-engine/guides/aef_on_gcs_readme' },
    { title: 'NDVI · Landsat Collection 2', desc: 'Landsat 8/9 Level 2, 30 m, USGS vía Microsoft Planetary Computer. Mediana mensual de hasta dos escenas; máscara de nubes, sombras, cirrus, nieve y saturación.', tag: 'USGS', stat: `${Object.keys(atlas.landsat).length} meses`, url: 'https://planetarycomputer.microsoft.com/dataset/landsat-c2-l2' },
    { title: 'Observaciones del reto', desc: 'Curvas Sentinel-2 y Planet tomadas de los CSV originales. Se excluyen valores vacíos y observaciones con nubosidad mayor a 30%, sin imputar meses faltantes.', tag: 'Dataset original', stat: `${fmt(Object.values(atlas.provenance.satelliteRetained).reduce((a, b) => a + b, 0), 0)} observaciones válidas`, url: '/data/provenance.json', download: 'procedencia-agrocebada.json', button: 'Ver procedencia' },
  ];
  return <div className="sources-page page-stack">
    <header className="page-intro">
      <h2 className="section-title">Cada dato tiene una historia.</h2>
      <p>{sources.length} fuentes públicas y del reto. Cada una indica su periodo, su resolución y cómo descargarla.</p>
    </header>
    <div className="sources-grid">{sources.map(s => <section className="data-card source-card" key={s.title}>
      <div className="source-card-top"><h3>{s.title}</h3><span className="ui-badge data-source-tag">{s.tag}</span></div>
      <p>{s.desc}</p>
      <div className="source-card-footer">
        <span className="source-stat">{s.stat}</span>
        <Button size="small" className="source-link" component="a" href={s.url} download={s.download} target={s.download ? undefined : '_blank'} rel="noreferrer" endIcon={s.download ? <Download size={13}/> : <ExternalLink size={13}/>}>{s.button || 'Consultar fuente'}</Button>
      </div>
    </section>)}</div>
    <p className="page-note">Los límites son geoestadísticos y no determinan propiedad. AlphaEarth resume años completos; las curvas y el NDVI usan datos mensuales. Las imágenes de clima conservan la simbología del mapa QGIS. Los rendimientos marcados “Ejemplo” son placeholders.</p>
  </div>;
}

/** Legacy read-only administration view (kept for compatibility; the app uses AdminPage.tsx). */
export function AdminPage({ currentUser }: { currentUser: User }) {
  const [users, setUsers] = useState<User[]>([]), [error, setError] = useState('');
  useEffect(() => { void api<{ users: User[] }>('/api/admin/users').then(d => setUsers(d.users)).catch(e => setError(e.message)); }, []);
  return <div className="admin-page page-stack">
    <section className="data-card">
      <div className="data-card-header"><CardHeading title="Usuarios del espacio" description="Acceso de prueba para administrar AgroCebada"/><span className="ui-badge">Administración</span></div>
      {error && <Alert className="card-alert" severity="error">{error}</Alert>}
      <div className="table-scroll"><table className="parcel-table"><thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Estado</th></tr></thead><tbody>{users.map(u => <tr key={u.id}>
        <td><span className="cell-stack"><b>{u.username}</b>{u.id === currentUser.id && <small>Tu sesión</small>}</span></td><td>{u.name}</td>
        <td><span className="parcel-status neutral">Administrador</span></td>
        <td><span className="active-user"><span className="live-dot"/>Activo</span></td>
      </tr>)}</tbody></table></div>
    </section>
    <Alert className="page-alert" severity="info">La cuenta testuser es la administradora de prueba de este espacio. Puedes cerrar sesión desde el menú de tu perfil.</Alert>
  </div>;
}
