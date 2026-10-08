import { validateGeometry } from '../server/geometry.mjs';
import type { Analysis, Assignment, FeatureCollection, Field, Geometry, Override, Role, User, Workspace } from './types';

export const ROLE_NAMES: Record<Role, string> = { admin: 'Administrador', technician: 'Técnico', producer: 'Productor', user: 'Productor' };
export const DEMO_USERS: User[] = [
  { id: 'test-admin', username: 'testuser', name: 'Administrador de prueba', role: 'admin', active: true },
  { id: 'tech-1', username: 'tecnico', name: 'María · Técnica', role: 'technician', active: true },
  { id: 'producer-1', username: 'productor1', name: 'José · Productor', role: 'producer', active: true },
  { id: 'producer-2', username: 'productor2', name: 'Ana · Productora', role: 'producer', active: true },
];
const emptyWorkspace = (): Workspace => ({ analyses: [], overrides: {}, fields: [] });

// Authority lives here, independently of the Productor / Análisis Pro UI toggle.
// Reload and logout reset users, assignments, parcels and corrections.
export function createDemoApi(loadOriginalIds?: () => Promise<string[]>) {
  let user: User | null = null;
  let users = structuredClone(DEMO_USERS);
  let passwords = Object.fromEntries(users.map(u => [u.id, 'Fira2026!']));
  let workspace = emptyWorkspace();
  let assignments: Assignment[] | undefined;
  let originalIds: Promise<string[]> | undefined;
  async function ids() {
    originalIds ||= loadOriginalIds ? loadOriginalIds() : fetch('/data/parcels.geojson').then(async response => {
      if (!response.ok) throw new Error('No pudimos cargar las parcelas del atlas.');
      return ((await response.json()) as FeatureCollection).features.map(p => p.properties.id);
    }).catch(error => { originalIds = undefined; throw error; });
    const result = await originalIds;
    assignments ||= result.map((parcelId, i) => ({ parcelId, producerId: i % 2 ? 'producer-2' : 'producer-1', technicianId: i % 2 ? null : 'tech-1' }));
    return result;
  }
  const admin = () => { if (user?.role !== 'admin') throw new Error('Se requiere acceso de administrador.'); };
  function allowed(id: string) {
    if (user?.role === 'admin') return true;
    const a = assignments?.find(a => a.parcelId === id);
    return !!a && ((['producer','user'].includes(user?.role || '') && a.producerId === user?.id) || (user?.role === 'technician' && a.technicianId === user.id));
  }
  async function check(id: string) {
    const originals = await ids();
    if (!originals.includes(id) && !workspace.fields.some(f => f.id === id)) throw new Error('No encontramos esa parcela.');
    if (!allowed(id)) throw new Error('Esta parcela no está asignada a tu cuenta.');
  }
  return async function demoApi<T>(path: string, options: RequestInit = {}): Promise<T> {
    const method = options.method?.toUpperCase() || 'GET';
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : {};
    const reply = (value: unknown) => structuredClone(value) as T;
    if (method === 'GET' && path === '/api/auth/session') return reply({ user });
    if (method === 'POST' && path === '/api/auth/login') {
      const candidate = users.find(u => u.username === body.username);
      if (!candidate || passwords[candidate.id] !== body.password) throw new Error('El usuario o la contraseña no coinciden.');
      if (!candidate.active) throw new Error('Esta cuenta de demo está desactivada.');
      user = candidate; return reply({ user });
    }
    if (method === 'POST' && path === '/api/auth/logout') {
      user = null; users = structuredClone(DEMO_USERS); passwords = Object.fromEntries(users.map(u => [u.id, 'Fira2026!'])); workspace = emptyWorkspace(); assignments = undefined;
      return reply({ ok: true });
    }
    if (!user) throw new Error('Inicia sesión para continuar.');
    if (method === 'GET' && path === '/api/workspace') {
      const originals = await ids();
      const accessibleParcelIds = [...originals, ...workspace.fields.map(f => f.id)].filter(allowed);
      return reply({ fields: workspace.fields.filter(f => allowed(f.id)), overrides: Object.fromEntries(Object.entries(workspace.overrides).filter(([id]) => allowed(id))), analyses: workspace.analyses.filter(a => a.parcelId && allowed(a.parcelId)), assignments: assignments?.filter(a => allowed(a.parcelId)), accessibleParcelIds });
    }
    if (path === '/api/admin/users' && method === 'GET') { admin(); return reply({ users }); }
    if (path === '/api/admin/users' && method === 'POST') {
      admin();
      if (!/^[a-z0-9_-]{3,30}$/.test(body.username) || users.some(u => u.username === body.username)) throw new Error('Usa un nombre de usuario único de 3–30 caracteres.');
      if (!['admin','technician','producer'].includes(body.role) || typeof body.password !== 'string' || body.password.length < 8) throw new Error('Selecciona un rol y una contraseña de al menos 8 caracteres.');
      const created: User = { id: crypto.randomUUID(), username: body.username, name: String(body.name || body.username).slice(0,80), role: body.role, active: true };
      users.push(created); passwords[created.id] = body.password; return reply(created);
    }
    const userEdit = path.match(/^\/api\/admin\/users\/([^/]+)$/);
    if (userEdit && method === 'PUT') {
      admin(); const target = users.find(u => u.id === userEdit[1]);
      if (!target) throw new Error('Cuenta no encontrada.');
      if (target.id === user.id && (body.role !== undefined && body.role !== 'admin' || body.active === false)) throw new Error('Mantén activa tu cuenta administradora.');
      if (body.role !== undefined && !['admin','technician','producer'].includes(body.role)) throw new Error('Rol no válido.');
      if (body.role !== undefined) target.role = body.role;
      if (typeof body.active === 'boolean') target.active = body.active;
      if (typeof body.name === 'string') target.name = body.name.slice(0,80);
      return reply(target);
    }
    if (path === '/api/admin/assignments' && method === 'PUT') {
      admin(); await check(body.parcelId);
      if (!users.some(u => u.id === body.producerId && u.role === 'producer' && u.active) || body.technicianId && !users.some(u => u.id === body.technicianId && u.role === 'technician' && u.active)) throw new Error('Selecciona cuentas activas con los roles indicados.');
      const assignment: Assignment = { parcelId: body.parcelId, producerId: body.producerId, technicianId: body.technicianId || null };
      assignments = [...assignments!.filter(a => a.parcelId !== body.parcelId), assignment]; return reply(assignment);
    }
    if (method === 'POST' && path === '/api/fields') {
      await ids(); const area = validateGeometry(body.geometry);
      const ownerId = body.ownerId || (user.role === 'technician' ? assignments?.find(a => a.technicianId === user!.id)?.producerId : user.role === 'admin' ? 'producer-1' : user.id);
      if (!users.some(u => u.id === ownerId && u.role === 'producer') || user.role !== 'admin' && user.id !== ownerId && !assignments?.some(a => a.producerId === ownerId && a.technicianId === user!.id)) throw new Error('No puedes guardar parcelas para esa cuenta.');
      const field: Field = { id: 'user-' + crypto.randomUUID(), name: String(body.name || 'Mi parcela').trim().slice(0,80), geometry: body.geometry as Geometry, area, createdAt: new Date().toISOString(), ownerId, ...(body.segmentation ? { segmentation: { ...body.segmentation, correctedGeometry: body.geometry } } : {}) };
      workspace.fields.push(field); assignments!.push({ parcelId: field.id, producerId: ownerId, technicianId: user.role === 'technician' ? user.id : assignments?.find(a => a.producerId === ownerId)?.technicianId || null }); return reply(field);
    }
    const edit = path.match(/^\/api\/parcels\/([^/]+)\/geometry$/);
    if (method === 'PUT' && edit) {
      const id = decodeURIComponent(edit[1]); await check(id);
      const override: Override = { geometry: body.geometry, area: validateGeometry(body.geometry), updatedAt: new Date().toISOString() };
      workspace.overrides[id] = override;
      const field = workspace.fields.find(f => f.id === id); if (field?.segmentation) field.segmentation.correctedGeometry = body.geometry;
      return reply(override);
    }
    const fieldDelete = path.match(/^\/api\/fields\/([^/]+)$/);
    if (method === 'DELETE' && fieldDelete) {
      await check(fieldDelete[1]); workspace.fields = workspace.fields.filter(f => f.id !== fieldDelete[1]); delete workspace.overrides[fieldDelete[1]]; workspace.analyses = workspace.analyses.filter(a => a.parcelId !== fieldDelete[1]); assignments = assignments!.filter(a => a.parcelId !== fieldDelete[1]); return reply({ ok: true });
    }
    if (method === 'POST' && path === '/api/analyses') {
      if (!body.parcelId) throw new Error('Guarda la parcela antes de analizarla.');
      await check(body.parcelId); const area = validateGeometry(body.geometry);
      const analysis: Analysis = { id: crypto.randomUUID(), parcelId: body.parcelId, name: String(body.name || 'Parcela').slice(0,80), area, geometry: body.geometry, yield: 4.2, production: Math.round(area*4.2*100)/100, status: 'placeholder', createdAt: new Date().toISOString() };
      workspace.analyses.unshift(analysis); workspace.analyses = workspace.analyses.slice(0,500); return reply(analysis);
    }
    throw new Error('Este recurso no existe.');
  };
}
export const demoApi = createDemoApi();
