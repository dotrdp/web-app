import { validateGeometry } from '../server/geometry.mjs';
import type { Analysis, FeatureCollection, Field, Geometry, Override, User, Workspace } from './types';

const DEMO_USER: User = { id: 'test-admin', username: 'testuser', name: 'Administrador de prueba', role: 'admin' };
const emptyWorkspace = (): Workspace => ({ analyses: [], overrides: {}, fields: [] });

// This state belongs only to the current page. Reloading or signing out resets it.
// No cookies, browser storage, API server or database are used by the demo.
export function createDemoApi() {
  let user: User | null = null;
  let workspace = emptyWorkspace();
  let originalIds: Promise<Set<string>> | undefined;

  return async function demoApi<T>(path: string, options: RequestInit = {}): Promise<T> {
    const method = options.method?.toUpperCase() || 'GET';
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : {};
    const reply = (value: unknown) => structuredClone(value) as T;

    if (method === 'GET' && path === '/api/auth/session') return reply({ user });
    if (method === 'POST' && path === '/api/auth/login') {
      if (body.username !== 'testuser' || body.password !== 'Fira2026!') throw new Error('El usuario o la contraseña no coinciden.');
      user = DEMO_USER;
      return reply({ user });
    }
    if (method === 'POST' && path === '/api/auth/logout') {
      user = null;
      workspace = emptyWorkspace();
      return reply({ ok: true });
    }
    if (!user) throw new Error('Inicia sesión para continuar.');
    if (method === 'GET' && path === '/api/workspace') return reply(workspace);
    if (method === 'GET' && path === '/api/admin/users') return reply({ users: [user] });

    if (method === 'POST' && path === '/api/fields') {
      const area = validateGeometry(body.geometry);
      const field: Field = {
        id: 'user-' + crypto.randomUUID(),
        name: typeof body.name === 'string' && body.name.trim() ? body.name.trim().slice(0, 80) : 'Mi parcela',
        geometry: body.geometry as Geometry, area, createdAt: new Date().toISOString(),
      };
      workspace.fields.push(field);
      return reply(field);
    }
    const edit = path.match(/^\/api\/parcels\/([^/]+)\/geometry$/);
    if (method === 'PUT' && edit) {
      const id = decodeURIComponent(edit[1]);
      if (!workspace.fields.some(field => field.id === id)) {
        originalIds ||= fetch('/data/parcels.geojson').then(async response => {
          if (!response.ok) throw new Error('No pudimos cargar las parcelas del atlas.');
          const collection = await response.json() as FeatureCollection;
          return new Set(collection.features.map(parcel => parcel.properties.id));
        }).catch(error => { originalIds = undefined; throw error; });
        if (!(await originalIds).has(id)) throw new Error('No encontramos esa parcela.');
      }
      const override: Override = { geometry: body.geometry as Geometry, area: validateGeometry(body.geometry), updatedAt: new Date().toISOString() };
      workspace.overrides[id] = override;
      return reply(override);
    }
    if (method === 'POST' && path === '/api/analyses') {
      const area = validateGeometry(body.geometry);
      const exampleYield = 4.2;
      const analysis: Analysis = {
        id: crypto.randomUUID(), parcelId: typeof body.parcelId === 'string' ? body.parcelId.slice(0, 100) : null,
        name: typeof body.name === 'string' ? body.name.slice(0, 80) : 'Parcela', area,
        geometry: body.geometry as Geometry, yield: exampleYield,
        production: Math.round(area * exampleYield * 100) / 100,
        status: 'placeholder', createdAt: new Date().toISOString(),
      };
      workspace.analyses.unshift(analysis);
      workspace.analyses = workspace.analyses.slice(0, 500);
      return reply(analysis);
    }
    throw new Error('Este recurso no existe.');
  };
}

export const demoApi = createDemoApi();
