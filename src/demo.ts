import { validateGeometry } from '../server/geometry.mjs';
import type { FeatureCollection, Field, Geometry, Override, User, Workspace } from './types';

/** The single demo account. Everyone sees all 197 parcels; there are no producer/technician roles. */
export const DEMO_USER: User = { id: 'demo-user', username: 'testuser', name: 'Cuenta de prueba' };
export const DEMO_PASSWORD = 'Fira2026!';
const emptyWorkspace = (): Workspace => ({ overrides: {}, fields: [] });

// Page memory only: reload and logout reset drawn parcels, corrections and notes.
export function createDemoApi(loadOriginalIds?: () => Promise<string[]>) {
  let user: User | null = null;
  let workspace = emptyWorkspace();
  let notes = { text: '', updatedAt: null as string | null };
  let originalIds: Promise<string[]> | undefined;
  async function ids() {
    originalIds ||= loadOriginalIds ? loadOriginalIds() : fetch('/data/parcels.geojson').then(async response => {
      if (!response.ok) throw new Error('No pudimos cargar las parcelas del atlas.');
      return ((await response.json()) as FeatureCollection).features.map(p => p.properties.id);
    }).catch(error => { originalIds = undefined; throw error; });
    return originalIds;
  }
  async function check(id: string) {
    if (!(await ids()).includes(id) && !workspace.fields.some(f => f.id === id)) throw new Error('No encontramos esa parcela.');
  }
  return async function demoApi<T>(path: string, options: RequestInit = {}): Promise<T> {
    const method = options.method?.toUpperCase() || 'GET';
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : {};
    const reply = (value: unknown) => structuredClone(value) as T;
    if (method === 'GET' && path === '/api/auth/session') return reply({ user });
    if (method === 'POST' && path === '/api/auth/login') {
      if (body.username !== DEMO_USER.username || body.password !== DEMO_PASSWORD) throw new Error('El usuario o la contraseña no coinciden.');
      user = DEMO_USER; return reply({ user });
    }
    if (method === 'POST' && path === '/api/auth/logout') { user = null; workspace = emptyWorkspace(); notes = { text: '', updatedAt: null }; return reply({ ok: true }); }
    if (!user) throw new Error('Inicia sesión para continuar.');
    if (method === 'GET' && path === '/api/workspace') { await ids(); return reply(workspace); }
    if (method === 'GET' && path === '/api/notes') return reply(notes);
    if (method === 'PUT' && path === '/api/notes') {
      if (typeof body.text !== 'string' || body.text.length > 50_000) throw new Error('Las notas deben ser texto de hasta 50,000 caracteres.');
      notes = { text: body.text, updatedAt: new Date().toISOString() }; return reply(notes);
    }
    if (method === 'POST' && path === '/api/fields') {
      await ids(); const area = validateGeometry(body.geometry);
      const field: Field = { id: 'user-' + crypto.randomUUID(), name: String(body.name || 'Mi parcela').trim().slice(0, 80), geometry: body.geometry as Geometry, area, createdAt: new Date().toISOString(), ...(body.segmentation ? { segmentation: { ...body.segmentation, correctedGeometry: body.geometry } } : {}) };
      workspace.fields.push(field); return reply(field);
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
      await check(fieldDelete[1]); workspace.fields = workspace.fields.filter(f => f.id !== fieldDelete[1]); delete workspace.overrides[fieldDelete[1]]; return reply({ ok: true });
    }
    throw new Error('Este recurso no existe.');
  };
}
export const demoApi = createDemoApi();
