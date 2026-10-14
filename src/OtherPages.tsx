import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, InputAdornment, MenuItem, Pagination, Select, TextField } from '@mui/material';
import { ArrowUpDown, ArrowUpRight, Check, Database, Download, ExternalLink, FileJson, Info, Layers3, MapPin, Search, ShieldCheck, Sparkles, Users } from 'lucide-react';
import type { Atlas, Parcel, User, Workspace } from './types';
import { api, download, EXAMPLE_YIELD, fmt, normalize, parcelCsv } from './lib';
import { LoadingValue } from './AgentProgress';
import { DotLoader } from './Loader';
import './pages.css';

const GROUP_LABELS: Record<Parcel['properties']['group'], string> = { training: 'Entrenamiento', prediction: 'Predicción', custom: 'Mi parcela' };

/** Ten-dot NDVI meter: the dot-matrix reading of a 0–1 vegetation index. */
function NdviMeter({ value }: { value: number | null | undefined }) {
  const filled = value == null ? 0 : Math.round(Math.max(0, Math.min(1, value)) * 10);
  return <span className="ndvi-meter" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} className={i < filled ? 'on' : ''}/>)}</span>;
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
  return <div className="parcels-page page-stack">
    <div className="stat-strip ui-card" aria-label="Resumen de parcelas" role="group">
      <div className="stat"><span className="kicker">Parcelas</span><strong className="pixel stat-value">{parcels.length}</strong><span className="stat-foot">En tu espacio de trabajo</span></div>
      <div className="stat"><span className="kicker">Entrenamiento</span><strong className="pixel stat-value">{summary.training}</strong><span className="stat-foot">Con rendimiento registrado</span></div>
      <div className="stat"><span className="kicker">Predicción</span><strong className="pixel stat-value">{summary.prediction}</strong><span className="stat-foot">Conjunto a estimar</span></div>
      <div className="stat"><span className="kicker">Superficie</span><strong className="pixel stat-value">{fmt(summary.area, 0)}<small>ha</small></strong><span className="stat-foot">{summary.custom ? `${summary.custom} trazadas por ti` : 'Superficie declarada'}</span></div>
    </div>

    <section className="data-card parcel-table-card">
      <div className="table-toolbar">
        <TextField className="toolbar-search" size="small" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar ID, municipio o estado…" slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={15}/></InputAdornment> } }} inputProps={{ 'aria-label': 'Buscar en mis parcelas' }}/>
        <Select className="toolbar-select" size="small" value={group} onChange={e => setGroup(e.target.value)} inputProps={{ 'aria-label': 'Conjunto de parcelas' }}><MenuItem value="all">Todos los conjuntos</MenuItem><MenuItem value="training">Entrenamiento</MenuItem><MenuItem value="prediction">Predicción</MenuItem><MenuItem value="custom">Mis terrenos</MenuItem></Select>
        <span className="toolbar-count"><b>{filtered.length}</b> parcelas</span>
        <Button className="toolbar-action" variant="outlined" startIcon={<Download size={14}/>} onClick={() => download('agrocebada-parcelas.csv', parcelCsv(filtered, atlas, keyDate), 'text/csv;charset=utf-8')}>Exportar CSV</Button>
      </div>
      <div className="table-scroll"><table className="parcel-table">
        <thead><tr>
          <th aria-sort={sort === 'id' ? 'ascending' : 'none'}><button className={`th-sort ${sort === 'id' ? 'active' : ''}`} onClick={() => setSort('id')}>Parcela <ArrowUpDown size={12}/></button></th>
          <th>Ubicación</th>
          <th className="num" aria-sort={sort === 'area' ? 'descending' : 'none'}><button className={`th-sort ${sort === 'area' ? 'active' : ''}`} onClick={() => setSort('area')}>Superficie <ArrowUpDown size={12}/></button></th>
          <th>Conjunto</th>
          <th className="num">Rendimiento registrado</th>
          <th>NDVI · Landsat</th>
          <th><span className="sr-only">Acciones</span></th>
        </tr></thead>
        <tbody>{filtered.slice((page - 1) * 12, page * 12).map(p => {
          const ndvi = atlas.landsat[keyDate]?.parcels[p.properties.id]?.mean;
          return <tr key={p.properties.id}>
            <td><button className="table-parcel-id" onClick={() => onSelect(p.properties.id)}><span className="cell-icon"><MapPin size={13}/></span>{p.properties.name || p.properties.id}</button></td>
            <td><span className="cell-stack">{p.properties.municipality}<small>{p.properties.state}</small></span></td>
            <td className="num">{fmt(p.properties.area)} <small className="inline-small">ha</small></td>
            <td><span className={`parcel-status ${p.properties.group}`}>{GROUP_LABELS[p.properties.group]}</span></td>
            <td className="num">{fmt(p.properties.observedYield)} <small className="inline-small">t/ha</small></td>
            <td><span className="ndvi-cell"><NdviMeter value={ndvi}/><span className="mono">{fmt(ndvi, 3)}</span></span></td>
            <td className="row-action"><Button size="small" onClick={() => onAnalyze(p)} endIcon={<ArrowUpRight size={13}/>}>Analizar</Button></td>
          </tr>;
        })}</tbody>
      </table></div>
      {!filtered.length && <div className="empty-state">
        <span className="empty-icon"><Search size={20}/></span>
        <h3>No encontramos parcelas</h3><p>Prueba con otro ID o municipio.</p>
        <Button variant="outlined" onClick={() => { setSearch(''); setGroup('all'); }}>Limpiar filtros</Button>
      </div>}
      <div className="table-footer"><span>Datos originales FIRA · 138 de entrenamiento y 59 de predicción</span><Pagination className="ui-pagination" size="small" count={pages} page={page} onChange={(_, p) => setPage(p)}/></div>
    </section>

    <section className="data-card analyses-card">
      <div className="data-card-header">
        <div className="card-heading"><span className="card-icon"><Sparkles size={15}/></span><div><h3>Tus análisis</h3><p>Resultados guardados en este espacio de trabajo</p></div></div>
        <span className="ui-badge">{workspace.analyses.length} guardados</span>
      </div>
      {workspace.analyses.length ? <ul className="saved-analysis-list">{workspace.analyses.slice(0, 12).map(a => <li key={a.id}>
        <span className="saved-analysis-check"><Check size={13}/></span>
        <span className="saved-analysis-name"><b>{a.name}</b><small>{new Date(a.createdAt).toLocaleDateString('es-MX')} · {fmt(a.area)} ha</small></span>
        <span className="ui-badge ui-badge-warning example-label">EJEMPLO</span>
        <strong className="saved-analysis-yield"><span className="pixel">{fmt(a.yield)}</span> <small>t/ha</small></strong>
        <Button size="small" variant="outlined" startIcon={<Download size={13}/>} onClick={() => download(`${a.name}-ejemplo.json`, JSON.stringify(a, null, 2), 'application/json')}>Descargar</Button>
      </li>)}</ul> : <div className="empty-state small">
        <span className="empty-icon"><Layers3 size={20}/></span>
        <h3>Tu próximo análisis empieza en el mapa.</h3><p>Selecciona una parcela y presiona “Analizar parcela”.</p>
      </div>}
    </section>
  </div>;
}

export function ModelsPage() {
  const metrics = [['RMSE', 'Error cuadrático medio', 't/ha'], ['MAE', 'Error absoluto medio', 't/ha'], ['R²', 'Varianza explicada', ''], ['Validación', 'Parcela independiente', '']];
  const inputs = [['197', 'Parcelas georreferenciadas', 'Límites originales del reto'], ['64', 'Dimensiones AlphaEarth', '2017–2025 · resolución de 10 m'], ['48', 'Meses de clima', 'Precipitación y temperatura · 2022–2025'], ['138', 'Rendimientos registrados', 'Ciclo de cebada de 2025']];
  return <div className="models-page page-stack">
    <section className="model-intro ui-card dotted-surface">
      <div className="model-intro-copy">
        <span className="kicker">Del dato a la decisión</span>
        <h2 className="pixel display-title">El espacio para tu modelo.</h2>
        <p>Las predicciones y sus métricas se incorporarán aquí. Por ahora, las fichas muestran un valor fijo de ejemplo de <b>{fmt(EXAMPLE_YIELD)} t/ha</b>.</p>
        <span className="ui-badge ui-badge-warning model-status-label"><span className="status-dot"/>MODELO PENDIENTE</span>
      </div>
      <div className="model-intro-example">
        <DotLoader name="lattice" size={44} color="var(--subtle-foreground)"/>
        <span className="kicker">Valor de ejemplo</span>
        <strong className="pixel">{fmt(EXAMPLE_YIELD)}<small>t/ha</small></strong>
        <span className="ui-badge ui-badge-warning">EJEMPLO · SIN INFERENCIA</span>
      </div>
    </section>

    <div className="model-metric-cards">{metrics.map(([title, desc, unit]) => <section className="data-card metric-card" key={title}>
      <div className="metric-card-top"><span className="kicker">{title}</span><span className="ui-badge pending-pill">Pendiente</span></div>
      <LoadingValue className="metric-value" label={`${title} pendiente del modelo`} unit={unit}/>
      <p>{desc}</p>
    </section>)}</div>

    <section className="data-card">
      <div className="data-card-header"><div className="card-heading"><span className="card-icon"><Database size={15}/></span><div><h3>Datos disponibles para el análisis</h3><p>Los datos geográficos y satelitales ya están en el atlas</p></div></div><span className="ui-badge ui-badge-leaf"><span className="live-dot"/>En el atlas</span></div>
      <div className="input-source-grid">{inputs.map(([value, label, detail]) => <div className="stat" key={label}><strong className="pixel stat-value">{value}</strong><b>{label}</b><span className="stat-foot">{detail}</span></div>)}</div>
    </section>

    <Alert className="page-alert" severity="info" icon={<Info size={16}/>}>Los valores de ejemplo no deben usarse para decisiones de producción. No se ha ejecutado ningún modelo predictivo en esta aplicación.</Alert>
  </div>;
}

export function SourcesPage({ atlas }: { atlas: Atlas }) {
  const sources = [
    { icon: Database, title: 'Sentinel-2 · Vegetación y agua', desc: 'RGB y NDVI a 10 m; MNDWI a 20 m. Mosaicos mensuales de observaciones despejadas sobre los límites completos de Hidalgo, Puebla y Tlaxcala. Calibración por escena y máscara SCL. Los candidatos de agua usan MNDWI ≥ 0, sin diagnóstico ni alertas.', tag: 'COPERNICUS', stat: '48 meses · 2022–2025 · 16 teselas', url: '/data/sentinel-index.json', download: 'sentinel-manifiestos.json', button: 'Descargar versiones' },
    { icon: Layers3, title: 'Delimitación de parcelas', desc: 'SAM 2.1 tiny preentrenado y fijo. Propuestas sobre la imagen RGB del mes seleccionado, con puntos de inclusión y exclusión. Límites aproximados de 10 m; requieren revisión y guardado explícito. Las correcciones conservan la propuesta y su procedencia.', tag: 'SAM 2.1', stat: 'Propuestas editables', url: 'https://github.com/facebookresearch/sam2' },
    { icon: MapPin, title: 'Parcelas del reto', desc: '197 límites originales, superficies y 138 rendimientos registrados de cebada. 59 parcelas conforman el conjunto de predicción.', tag: 'FIRA 2026', stat: '197 parcelas', url: '/data/parcels.geojson', download: 'parcelas-agrocebada.geojson', button: 'Descargar GeoJSON' },
    { icon: Layers3, title: 'Límites territoriales', desc: 'Hidalgo, Puebla y Tlaxcala. Marco Geoestadístico de INEGI, diciembre de 2025. Límites de 361 municipios reproyectados a WGS 84.', tag: 'INEGI', stat: '3 estados · 361 municipios', url: 'https://www.inegi.org.mx/servicios/catalogounico.html' },
    { icon: Database, title: 'Clima y relieve', desc: 'Precipitación CHIRPS, temperatura mínima y máxima CHIRTS-ERA5, elevación y pendiente INEGI CEM4. Rasters de la entrega original y simbología QGIS.', tag: '2022–2025', stat: '146 capas', url: '/data/layers.json', download: 'inventario-capas.json', button: 'Descargar inventario' },
    { icon: Layers3, title: 'AlphaEarth Foundations', desc: 'Embeddings anuales de Google y Google DeepMind. 64 ejes A00–A63, 10 m. Vista RGB A00/A01/A02. Media ponderada por área después de decuantizar y normalizar.', tag: 'CC BY 4.0', stat: '2017–2025', url: 'https://developers.google.com/earth-engine/guides/aef_on_gcs_readme' },
    { icon: Database, title: 'NDVI · Landsat Collection 2', desc: 'Landsat 8/9 Level 2, 30 m, USGS vía Microsoft Planetary Computer. Mediana mensual de hasta dos escenas; máscara de nubes, sombras, cirrus, nieve y saturación.', tag: 'USGS', stat: `${Object.keys(atlas.landsat).length} meses`, url: 'https://planetarycomputer.microsoft.com/dataset/landsat-c2-l2' },
    { icon: FileJson, title: 'Observaciones del reto', desc: 'Curvas Sentinel-2 y Planet tomadas de los CSV originales. Se excluyen valores vacíos y observaciones con nubosidad mayor a 30%, sin imputar meses faltantes.', tag: 'DATASET ORIGINAL', stat: `${fmt(Object.values(atlas.provenance.satelliteRetained).reduce((a, b) => a + b, 0), 0)} observaciones válidas`, url: '/data/provenance.json', download: 'procedencia-agrocebada.json', button: 'Ver procedencia' },
  ];
  return <div className="sources-page page-stack">
    <section className="sources-banner ui-card dotted-surface">
      <span className="banner-icon"><ShieldCheck size={22}/></span>
      <div className="sources-banner-copy"><span className="kicker">Procedencia</span><h2 className="pixel display-title">Cada dato tiene una historia.</h2><p>Fuentes, periodos y alcance de la información que ves en el mapa.</p></div>
      <div className="sources-banner-meta"><span className="ui-badge ui-badge-leaf verified-source"><Check size={12}/>Datos con procedencia</span><span className="sources-count"><strong className="pixel">{sources.length}</strong><span className="kicker">fuentes</span></span></div>
    </section>
    <div className="sources-grid">{sources.map(s => <section className="data-card source-card" key={s.title}>
      <div className="source-card-top"><span className="card-icon lg"><s.icon size={17}/></span><span className="ui-badge data-source-tag">{s.tag}</span></div>
      <h3>{s.title}</h3>
      <p>{s.desc}</p>
      <div className="source-card-footer">
        <strong className="mono">{s.stat}</strong>
        <Button size="small" variant="outlined" component="a" href={s.url} download={s.download} target={s.download ? undefined : '_blank'} rel="noreferrer" endIcon={s.download ? <Download size={13}/> : <ExternalLink size={13}/>}>{s.button || 'Consultar fuente'}</Button>
      </div>
    </section>)}</div>
    <div className="source-notes"><Info size={16}/><p>Los límites son geoestadísticos y no determinan propiedad. AlphaEarth resume años completos; las curvas y el NDVI usan datos mensuales. Las imágenes de clima conservan la simbología del mapa QGIS. Los rendimientos marcados “Ejemplo” son placeholders.</p></div>
  </div>;
}

/** Legacy read-only administration view (kept for compatibility; the app uses AdminPage.tsx). */
export function AdminPage({ currentUser }: { currentUser: User }) {
  const [users, setUsers] = useState<User[]>([]), [error, setError] = useState('');
  useEffect(() => { void api<{ users: User[] }>('/api/admin/users').then(d => setUsers(d.users)).catch(e => setError(e.message)); }, []);
  return <div className="admin-page page-stack">
    <section className="data-card">
      <div className="data-card-header"><div className="card-heading"><span className="card-icon"><Users size={15}/></span><div><h3>Usuarios del espacio</h3><p>Acceso de prueba para administrar AgroCebada</p></div></div><span className="ui-badge verified-source"><ShieldCheck size={12}/>Administración</span></div>
      {error && <Alert className="card-alert" severity="error">{error}</Alert>}
      <div className="table-scroll"><table className="parcel-table"><thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Estado</th></tr></thead><tbody>{users.map(u => <tr key={u.id}>
        <td><span className="cell-stack"><b>{u.username}</b>{u.id === currentUser.id && <small>Tu sesión</small>}</span></td><td>{u.name}</td>
        <td><span className="parcel-status training">Administrador</span></td>
        <td><span className="active-user"><span className="live-dot"/>Activo</span></td>
      </tr>)}</tbody></table></div>
    </section>
    <Alert className="page-alert" severity="info">La cuenta testuser es la administradora de prueba de este espacio. Puedes cerrar sesión desde el menú de tu perfil.</Alert>
  </div>;
}
