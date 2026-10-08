import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Button, Checkbox, MenuItem, Pagination, Select, TextField } from '@mui/material';
import { Download, Plus, Users } from 'lucide-react';
import { api, download, normalize } from './lib';
import { ROLE_NAMES } from './demo';
import { LoadingDots, LoadingState, LoadingValue } from './AgentProgress';
import { PlaceholderTableRows } from './Placeholders';
import type { Assignment, Parcel, Role, User, Workspace } from './types';

const ROLES: Role[] = ['admin', 'technician', 'producer'];
export default function AdminPage({ currentUser, parcels, workspace, onChanged }: { currentUser: User; parcels: Parcel[]; workspace: Workspace; onChanged: () => Promise<Workspace> }) {
  const [users, setUsers] = useState<User[]>([]), [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState(''), [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState(''), [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false), [username, setUsername] = useState(''), [name, setName] = useState(''), [password, setPassword] = useState(''), [role, setRole] = useState<Role>('producer');
  const loadRevision = useRef(0);
  const load = useCallback(async () => {
    const revision = ++loadRevision.current; setUsersLoading(true); setError('');
    try { const result = await api<{ users: User[] }>('/api/admin/users'); if (loadRevision.current === revision) setUsers(result.users); }
    catch (error) { if (loadRevision.current === revision) throw error; }
    finally { if (loadRevision.current === revision) setUsersLoading(false); }
  }, []);
  useEffect(() => { void load().catch(e => setError(e.message)); return () => { loadRevision.current++; }; }, [load]);
  async function perform(key: string, action: () => Promise<void>) {
    if (busy) return; setBusy(key); setError('');
    try { await action(); } catch (e) { setError((e as Error).message); } finally { setBusy(null); }
  }
  async function updateUser(user: User, body: unknown) {
    await perform('user-' + user.id, async () => { await api(`/api/admin/users/${user.id}`, { method: 'PUT', body: JSON.stringify(body) }); await load(); await onChanged(); });
  }
  async function assign(parcelId: string, changes: Partial<Assignment>) {
    const current = workspace.assignments?.find(a => a.parcelId === parcelId);
    await perform('parcel-' + parcelId, async () => { await api('/api/admin/assignments', { method: 'PUT', body: JSON.stringify({ ...current, parcelId, ...changes }) }); await onChanged(); });
  }
  async function create(event: React.FormEvent) {
    event.preventDefault();
    await perform('create', async () => { await api('/api/admin/users', { method: 'POST', body: JSON.stringify({ username, name, password, role }) }); setCreating(false); setUsername(''); setName(''); setPassword(''); await load(); });
  }
  const disabled = usersLoading || !!busy;
  const filtered = parcels.filter(p => normalize(`${p.properties.id} ${p.properties.name || ''} ${p.properties.municipality}`).includes(normalize(query)));
  return <div className="admin-page">
    {error && <Alert severity="error" action={<Button onClick={() => void load().catch(e => setError(e.message))}>Reintentar</Button>}>{error}</Alert>}
    <Alert severity="info">Demo en memoria. Las cuentas, asignaciones y correcciones se reinician al recargar o cerrar sesión. Cambiar entre Productor y Análisis Pro conserva los permisos.</Alert>
    <section className="data-card"><div className="data-card-header"><h2><Users size={20}/>Usuarios del espacio</h2><Button disabled={disabled} onClick={() => setCreating(!creating)} startIcon={<Plus size={16}/>}>Crear usuario</Button></div>
      {creating && <form className="admin-create" onSubmit={create}>
        <TextField label="Usuario nuevo" required disabled={disabled} value={username} onChange={e => setUsername(e.target.value)}/><TextField label="Nombre" disabled={disabled} value={name} onChange={e => setName(e.target.value)}/><TextField label="Contraseña de demo" required disabled={disabled} type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        <Select disabled={disabled} value={role} onChange={e => setRole(e.target.value as Role)} inputProps={{ 'aria-label': 'Rol del usuario nuevo' }}>{ROLES.map(r => <MenuItem key={r} value={r}>{ROLE_NAMES[r]}</MenuItem>)}</Select>
        <Button type="submit" variant="contained" disabled={disabled}>{busy === 'create' ? <><LoadingDots/>Guardando usuario…</> : 'Guardar usuario'}</Button>
      </form>}
      {usersLoading && <div className="admin-loading"><LoadingState label="Cargando usuarios y roles…"/></div>}
      <div className="table-scroll"><table className="parcel-table" aria-label="Usuarios del espacio"><thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Activo</th></tr></thead><tbody>
        {usersLoading ? <PlaceholderTableRows columns={['', '', '', '']}/> : users.map(u => <tr key={u.id}><td><b>{u.username}</b>{u.id === currentUser.id && <small>Tu sesión</small>}</td><td>{u.name}</td>
          <td>{busy === 'user-' + u.id ? <LoadingValue label={`Actualizando rol de ${u.username}`}/> : <Select size="small" disabled={disabled || u.id === currentUser.id} value={u.role} onChange={e => void updateUser(u, { role: e.target.value })} inputProps={{ 'aria-label': `Rol de ${u.username}` }}>{ROLES.map(r => <MenuItem key={r} value={r}>{ROLE_NAMES[r]}</MenuItem>)}</Select>}</td>
          <td>{busy === 'user-' + u.id ? <LoadingValue label={`Actualizando estado de ${u.username}`}/> : <Checkbox disabled={disabled || u.id === currentUser.id} checked={u.active !== false} onChange={e => void updateUser(u, { active: e.target.checked })} inputProps={{ 'aria-label': `Cuenta activa de ${u.username}` }}/>}</td>
        </tr>)}
      </tbody></table></div>
    </section>
    <section className="data-card"><div className="data-card-header"><div><h2>Asignaciones de parcelas</h2><p>El técnico accede únicamente a los productores y parcelas asignados.</p></div><Button startIcon={<Download size={16}/>} disabled={disabled} onClick={() => download('demo-asignaciones.json', JSON.stringify(workspace.assignments, null, 2), 'application/json')}>Exportar</Button></div>
      <TextField className="admin-parcel-search" size="small" label="Buscar parcela para asignar" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }}/>
      <div className="table-scroll"><table className="parcel-table" aria-label="Asignaciones de parcelas"><thead><tr><th>Parcela</th><th>Productor</th><th>Técnico</th><th/></tr></thead><tbody>
        {usersLoading ? <PlaceholderTableRows columns={['', '', '', '']}/> : filtered.slice((page - 1) * 10, page * 10).map(p => {
          const a = workspace.assignments?.find(a => a.parcelId === p.properties.id), pending = busy === 'parcel-' + p.properties.id;
          return <tr key={p.properties.id}><td>{p.properties.name || p.properties.id}<small>{p.properties.municipality}</small></td>
            <td>{pending ? <LoadingValue label={`Actualizando productor de ${p.properties.id}`}/> : <Select size="small" disabled={disabled} value={a?.producerId || ''} onChange={e => void assign(p.properties.id, { producerId: e.target.value })} inputProps={{ 'aria-label': `Productor de ${p.properties.id}` }}>{users.filter(u => u.role === 'producer' && u.active).map(u => <MenuItem key={u.id} value={u.id}>{u.username}</MenuItem>)}</Select>}</td>
            <td>{pending ? <LoadingValue label={`Actualizando técnico de ${p.properties.id}`}/> : <Select size="small" disabled={disabled} value={a?.technicianId || ''} onChange={e => void assign(p.properties.id, { technicianId: e.target.value || null })} displayEmpty inputProps={{ 'aria-label': `Técnico de ${p.properties.id}` }}><MenuItem value="">Sin técnico</MenuItem>{users.filter(u => u.role === 'technician' && u.active).map(u => <MenuItem key={u.id} value={u.id}>{u.username}</MenuItem>)}</Select>}</td>
            <td>{p.properties.group === 'custom' && <Button disabled={disabled} onClick={() => void perform('parcel-' + p.properties.id, async () => { await api(`/api/fields/${p.properties.id}`, { method: 'DELETE' }); await onChanged(); })}>Eliminar parcela de demo</Button>}</td>
          </tr>;
        })}
      </tbody></table></div><div className="table-footer"><span>{usersLoading ? <LoadingValue label="Cantidad de parcelas pendiente"/> : `${filtered.length} parcelas de demo`}</span><Pagination disabled={disabled} count={Math.max(1, Math.ceil(filtered.length / 10))} page={page} onChange={(_, p) => setPage(p)}/></div>
    </section>
    <Button disabled={disabled} startIcon={<Download size={16}/>} onClick={() => download('demo-correcciones.geojson', JSON.stringify({ type: 'FeatureCollection', features: workspace.fields.map(f => ({ type: 'Feature', geometry: workspace.overrides[f.id]?.geometry || f.geometry, properties: { name: f.name, ownerId: f.ownerId, segmentation: f.segmentation } })) }, null, 2), 'application/geo+json')}>Exportar correcciones y procedencia</Button>
  </div>;
}
