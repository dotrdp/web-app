import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, FileJson, Info, Plus, Search, Trash2 } from 'lucide-react';
import { api, download, normalize } from './lib';
import { ROLE_NAMES } from './demo';
import { LoadingDots, LoadingState, LoadingValue } from './AgentProgress';
import type { Assignment, Parcel, Role, User, Workspace } from './types';
import { Alert, AlertAction, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ROLES: Role[] = ['admin', 'technician', 'producer'];
const NO_TECHNICIAN = '__none__';
const PAGE_SIZE = 10;

function Heading({ children }: { children: ReactNode }) {
  return <CardTitle role="heading" aria-level={2}>{children}</CardTitle>;
}

function Stat({ label, value, loading, foot }: { label: string; value: number; loading: boolean; foot: string }) {
  return <Card className="@container/card gap-2">
    <CardHeader>
      <CardDescription>{label}</CardDescription>
      <CardTitle className="text-2xl font-semibold tabular-nums">{loading ? <LoadingValue label={`${label} pendiente`} className="min-w-0"/> : value}</CardTitle>
    </CardHeader>
    <CardContent className="text-xs text-muted-foreground">{foot}</CardContent>
  </Card>;
}

function PendingRows({ columns, collapsible }: { columns: number; collapsible?: number }) {
  return <>{Array.from({ length: 4 }, (_, row) => <TableRow key={row} className="hover:bg-transparent">
    {Array.from({ length: columns }, (_, column) => <TableCell key={column} className={column === collapsible ? 'hidden @xl/card:table-cell' : 'first:pl-4 last:pr-4'}><LoadingValue label="Valor pendiente"/></TableCell>)}
  </TableRow>)}</>;
}

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
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const activeCount = users.filter(u => u.active !== false).length;
  const technicians = users.filter(u => u.role === 'technician' && u.active), producers = users.filter(u => u.role === 'producer' && u.active);
  const unassigned = parcels.filter(p => !workspace.assignments?.find(a => a.parcelId === p.properties.id)?.technicianId).length;

  return <div className="@container/main flex w-full min-w-0 flex-col gap-4 md:gap-6">
    {error && <Alert variant="destructive"><Info/><AlertDescription className="text-pretty">{error}</AlertDescription><AlertAction><Button size="xs" variant="outline" onClick={() => void load().catch(e => setError(e.message))}>Reintentar</Button></AlertAction></Alert>}
    <Alert><Info/><AlertDescription className="text-pretty">Demo en memoria. Las cuentas, asignaciones y correcciones se reinician al recargar o cerrar sesión. Cambiar entre Productor y Análisis Pro conserva los permisos.</AlertDescription></Alert>

    <div className="grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @3xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Stat label="Cuentas" value={users.length} loading={usersLoading} foot="En este espacio de demo"/>
      <Stat label="Activas" value={activeCount} loading={usersLoading} foot="Pueden iniciar sesión"/>
      <Stat label="Técnicos" value={technicians.length} loading={usersLoading} foot="Activos con parcelas asignables"/>
      <Stat label="Sin técnico" value={unassigned} loading={usersLoading} foot={`De ${parcels.length} parcelas visibles`}/>
    </div>

    <Card className="@container/card">
      <CardHeader>
        <Heading>Usuarios del espacio</Heading>
        <CardDescription>{usersLoading ? 'Cargando cuentas…' : `${users.length} cuentas · ${activeCount} activas`}</CardDescription>
        <CardAction>
          <Dialog open={creating} onOpenChange={open => busy !== 'create' && setCreating(open)}>
            <DialogTrigger asChild><Button size="sm" disabled={disabled}><Plus data-icon="inline-start"/>Crear usuario</Button></DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form className="grid gap-4" onSubmit={create}>
                <DialogHeader>
                  <DialogTitle>Nuevo usuario</DialogTitle>
                  <DialogDescription>La cuenta existe solo en esta demo y se borra al recargar.</DialogDescription>
                </DialogHeader>
                <FieldGroup className="gap-4">
                  <Field><FieldLabel htmlFor="admin-new-username">Usuario nuevo</FieldLabel><Input id="admin-new-username" required autoComplete="off" disabled={disabled} value={username} onChange={e => setUsername(e.target.value)}/></Field>
                  <Field><FieldLabel htmlFor="admin-new-name">Nombre</FieldLabel><Input id="admin-new-name" disabled={disabled} value={name} onChange={e => setName(e.target.value)}/></Field>
                  <Field><FieldLabel htmlFor="admin-new-password">Contraseña de demo</FieldLabel><Input id="admin-new-password" type="password" required autoComplete="new-password" disabled={disabled} value={password} onChange={e => setPassword(e.target.value)}/></Field>
                  <Field>
                    <FieldLabel htmlFor="admin-new-role">Rol</FieldLabel>
                    <Select value={role} onValueChange={v => setRole(v as Role)} disabled={disabled}>
                      <SelectTrigger id="admin-new-role" className="w-full" aria-label="Rol del usuario nuevo"><SelectValue/></SelectTrigger>
                      <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{ROLE_NAMES[r]}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="outline" disabled={busy === 'create'}>Cancelar</Button></DialogClose>
                  <Button type="submit" disabled={disabled}>{busy === 'create' ? <><LoadingDots/>Guardando usuario…</> : 'Guardar usuario'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>
      {usersLoading && <CardContent><LoadingState label="Cargando usuarios y roles…"/></CardContent>}
      <CardContent className="px-0">
        <Table aria-label="Usuarios del espacio">
          <TableHeader className="bg-muted/50">
            <TableRow><TableHead className="pl-4">Usuario</TableHead><TableHead className="hidden @xl/card:table-cell">Nombre</TableHead><TableHead>Rol</TableHead><TableHead className="pr-4">Activo</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {usersLoading ? <PendingRows columns={4} collapsible={1}/> : users.map(u => {
              const self = u.id === currentUser.id, pending = busy === 'user-' + u.id;
              return <TableRow key={u.id}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm"><AvatarFallback>{u.username.slice(0, 1).toUpperCase()}</AvatarFallback></Avatar>
                    <div className="flex flex-col"><span className="font-medium">{u.username}</span><span className="text-xs text-muted-foreground @xl/card:hidden">{u.name}</span></div>
                    {self && <Badge variant="secondary" title="No puedes cambiar el rol ni desactivar tu propia cuenta.">Tu sesión</Badge>}
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground @xl/card:table-cell">{u.name}</TableCell>
                <TableCell title={self ? 'No puedes cambiar el rol de tu propia cuenta.' : undefined}>{pending ? <LoadingValue label={`Actualizando rol de ${u.username}`}/> : <Select value={u.role} disabled={disabled || self} onValueChange={v => void updateUser(u, { role: v })}>
                  <SelectTrigger size="sm" className="w-36" aria-label={`Rol de ${u.username}`}><SelectValue/></SelectTrigger>
                  <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{ROLE_NAMES[r]}</SelectItem>)}</SelectContent>
                </Select>}</TableCell>
                <TableCell className="pr-4" title={self ? 'No puedes desactivar tu propia cuenta.' : undefined}>{pending ? <LoadingValue label={`Actualizando estado de ${u.username}`}/> : <Switch checked={u.active !== false} disabled={disabled || self} onCheckedChange={checked => void updateUser(u, { active: checked })} aria-label={`Cuenta activa de ${u.username}`}/>}</TableCell>
              </TableRow>;
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Card className="@container/card">
      <CardHeader>
        <Heading>Asignaciones de parcelas</Heading>
        <CardDescription>El técnico accede únicamente a los productores y parcelas asignados.</CardDescription>
        <CardAction><Button size="sm" variant="outline" disabled={disabled} onClick={() => download('demo-asignaciones.json', JSON.stringify(workspace.assignments, null, 2), 'application/json')}><Download data-icon="inline-start"/>Exportar</Button></CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 @lg/card:flex-row @lg/card:items-center @lg/card:justify-between">
        <InputGroup className="@lg/card:max-w-xs">
          <InputGroupInput aria-label="Buscar parcela para asignar" placeholder="Buscar parcela, ID o municipio…" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }}/>
          <InputGroupAddon><Search/></InputGroupAddon>
        </InputGroup>
        <span className="text-sm text-muted-foreground">{usersLoading ? <LoadingValue label="Cantidad de parcelas pendiente"/> : <><b className="font-medium text-foreground tabular-nums">{filtered.length}</b> parcelas de demo</>}</span>
      </CardContent>
      <CardContent className="px-0">
        <Table aria-label="Asignaciones de parcelas">
          <TableHeader className="bg-muted/50">
            <TableRow><TableHead className="pl-4">Parcela</TableHead><TableHead>Productor</TableHead><TableHead>Técnico</TableHead><TableHead className="pr-4"><span className="sr-only">Acciones</span></TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {usersLoading ? <PendingRows columns={4}/> : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(p => {
              const id = p.properties.id, a = workspace.assignments?.find(a => a.parcelId === id), pending = busy === 'parcel-' + id;
              return <TableRow key={id}>
                <TableCell className="pl-4"><div className="flex flex-col"><span className="font-medium">{p.properties.name || id}</span><span className="text-xs text-muted-foreground">{p.properties.municipality}</span></div></TableCell>
                <TableCell>{pending ? <LoadingValue label={`Actualizando productor de ${id}`}/> : <Select value={a?.producerId || ''} disabled={disabled} onValueChange={v => void assign(id, { producerId: v })}>
                  <SelectTrigger size="sm" className="w-36" aria-label={`Productor de ${id}`}><SelectValue placeholder="Sin productor"/></SelectTrigger>
                  <SelectContent>{producers.map(u => <SelectItem key={u.id} value={u.id}>{u.username}</SelectItem>)}</SelectContent>
                </Select>}</TableCell>
                <TableCell>{pending ? <LoadingValue label={`Actualizando técnico de ${id}`}/> : <Select value={a?.technicianId || NO_TECHNICIAN} disabled={disabled} onValueChange={v => void assign(id, { technicianId: v === NO_TECHNICIAN ? null : v })}>
                  <SelectTrigger size="sm" className="w-36" aria-label={`Técnico de ${id}`}><SelectValue/></SelectTrigger>
                  <SelectContent><SelectItem value={NO_TECHNICIAN}>Sin técnico</SelectItem>{technicians.map(u => <SelectItem key={u.id} value={u.id}>{u.username}</SelectItem>)}</SelectContent>
                </Select>}</TableCell>
                <TableCell className="pr-4 text-right">{p.properties.group === 'custom' && <Button size="sm" variant="destructive" disabled={disabled} onClick={() => void perform('parcel-' + id, async () => { await api(`/api/fields/${id}`, { method: 'DELETE' }); await onChanged(); })}><Trash2 data-icon="inline-start"/>Eliminar parcela de demo</Button>}</TableCell>
              </TableRow>;
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <span className="text-sm text-muted-foreground">Página {page} de {pageCount}</span>
        <nav className="flex items-center gap-1.5" aria-label="Paginación de asignaciones">
          <Button variant="outline" size="icon-sm" className="hidden @md/card:flex" disabled={disabled || page === 1} onClick={() => setPage(1)}><span className="sr-only">Primera página</span><ChevronsLeft/></Button>
          <Button variant="outline" size="icon-sm" disabled={disabled || page === 1} onClick={() => setPage(page - 1)}><span className="sr-only">Página anterior</span><ChevronLeft/></Button>
          <Button variant="outline" size="icon-sm" disabled={disabled || page === pageCount} onClick={() => setPage(page + 1)}><span className="sr-only">Página siguiente</span><ChevronRight/></Button>
          <Button variant="outline" size="icon-sm" className="hidden @md/card:flex" disabled={disabled || page === pageCount} onClick={() => setPage(pageCount)}><span className="sr-only">Última página</span><ChevronsRight/></Button>
        </nav>
      </CardFooter>
    </Card>

    <Item variant="outline" className="flex-col items-start bg-card @2xl/main:flex-row @2xl/main:items-center">
      <ItemMedia variant="icon"><FileJson/></ItemMedia>
      <ItemContent>
        <ItemTitle role="heading" aria-level={2}>Correcciones y procedencia</ItemTitle>
        <ItemDescription>GeoJSON con los límites corregidos, su propietario y la procedencia de cada delimitación.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm" disabled={disabled} onClick={() => download('demo-correcciones.geojson', JSON.stringify({ type: 'FeatureCollection', features: workspace.fields.map(f => ({ type: 'Feature', geometry: workspace.overrides[f.id]?.geometry || f.geometry, properties: { name: f.name, ownerId: f.ownerId, segmentation: f.segmentation } })) }, null, 2), 'application/geo+json')}><Download data-icon="inline-start"/>Exportar correcciones y procedencia</Button>
      </ItemActions>
    </Item>
  </div>;
}
