import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDemoApi } from '../src/demo';
import type { Analysis, Field, User, Workspace } from '../src/types';

const geometry = { type: 'Polygon', coordinates: [[[-98.56, 19.54], [-98.559, 19.54], [-98.559, 19.541], [-98.56, 19.541], [-98.56, 19.54]]] };
const post = (body: unknown): RequestInit => ({ method: 'POST', body: JSON.stringify(body) });
const credentials = { username: 'testuser', password: 'Fira2026!' };

test('Demo edits and placeholder analyses belong only to the current page and reset on logout', async () => {
  const api = createDemoApi();
  assert.equal((await api<{ user: User | null }>('/api/auth/session')).user, null);
  await assert.rejects(api('/api/workspace'), /Inicia sesión/);
  await assert.rejects(api('/api/auth/login', post({ ...credentials, password: 'wrong' })), /no coinciden/);
  assert.equal((await api<{ user: User }>('/api/auth/login', post(credentials))).user.role, 'admin');
  const field = await api<Field>('/api/fields', post({ geometry, name: 'Temporal' }));
  assert.ok(field.area > 1);
  const analysis = await api<Analysis>('/api/analyses', post({ geometry, parcelId: field.id, name: field.name }));
  assert.equal(analysis.status, 'placeholder');
  assert.equal(analysis.yield, 4.2);
  assert.equal(analysis.production, Math.round(analysis.area * 4.2 * 100) / 100);
  await api(`/api/parcels/${field.id}/geometry`, { method: 'PUT', body: JSON.stringify({ geometry }) });
  const workspace = await api<Workspace>('/api/workspace');
  assert.equal(workspace.fields.length, 1);
  assert.equal(workspace.analyses.length, 1);
  assert.equal(Object.keys(workspace.overrides).length, 1);
  workspace.fields.length = 0;
  assert.equal((await api<Workspace>('/api/workspace')).fields.length, 1);

  // A new page cannot inherit another visitor's login or edits.
  const newPage = createDemoApi();
  assert.equal((await newPage<{ user: User | null }>('/api/auth/session')).user, null);
  await newPage('/api/auth/login', post(credentials));
  assert.deepEqual(await newPage('/api/workspace'), { fields: [], overrides: {}, analyses: [] });

  await api('/api/auth/logout', { method: 'POST' });
  await api('/api/auth/login', post(credentials));
  assert.deepEqual(await api('/api/workspace'), { fields: [], overrides: {}, analyses: [] });
});

test('Demo rejects crossed boundaries before adding a field or analysis', async () => {
  const api = createDemoApi();
  await api('/api/auth/login', post(credentials));
  const crossing = { type: 'Polygon', coordinates: [[[-98.56, 19.54], [-98.559, 19.541], [-98.559, 19.54], [-98.56, 19.541], [-98.56, 19.54]]] };
  await assert.rejects(api('/api/fields', post({ geometry: crossing })), /se cruzan/);
  await assert.rejects(api('/api/analyses', post({ geometry: crossing })), /se cruzan/);
  assert.deepEqual(await api('/api/workspace'), { fields: [], overrides: {}, analyses: [] });
});
