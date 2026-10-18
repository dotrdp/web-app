import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
// @ts-expect-error The executable backend is a native JavaScript ES module.
import { createApp, validateGeometry } from '../server/index.mjs';

test('Authenticated single account, protected writes, geometry validation and durable fields', async () => {
  const stateDir = await mkdtemp(path.join(tmpdir(), 'agrocebada-api-'));
  const app = await createApp({ stateDir, password: 'UnitTest2026!' });
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const root = 'http://127.0.0.1:' + server.address().port;
  const post = (url: string, body: unknown, cookie = '') => fetch(root + url, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify(body) });
  try {
    assert.equal((await fetch(root + '/api/workspace')).status, 401);
    assert.equal((await post('/api/fields', {})).status, 401);
    assert.equal((await post('/api/auth/login', { username: 'testuser', password: 'wrong' })).status, 401);
    const response = await post('/api/auth/login', { username: 'testuser', password: 'UnitTest2026!' });
    assert.equal(response.status, 200); const user = (await response.json()).user; assert.equal(user.role, undefined); assert.equal(user.username, 'testuser'); assert.equal(user.hash, undefined);
    const setCookie = response.headers.get('set-cookie')!; assert.match(setCookie, /HttpOnly/); assert.match(setCookie, /SameSite=Lax/); const cookie = setCookie.split(';')[0];
    assert.equal((await fetch(root + '/api/admin/users', { headers: { Cookie: cookie } })).status, 404);
    const geometry = { type: 'Polygon', coordinates: [[[-98.56, 19.54], [-98.559, 19.54], [-98.559, 19.541], [-98.56, 19.541], [-98.56, 19.54]]] };
    const saved = await post('/api/fields', { geometry, name: 'Parcela prueba' }, cookie); assert.equal(saved.status, 201);
    const field = await saved.json(); assert.ok(field.area > 1);
    assert.equal((await post('/api/analyses', { geometry, parcelId: field.id }, cookie)).status, 404);
    const durable = JSON.parse(fs.readFileSync(path.join(stateDir, 'workspace.json'), 'utf8')); assert.equal(durable.fields.length, 1); assert.notEqual(durable.user.hash, 'UnitTest2026!');
    const crossing = { type: 'Polygon', coordinates: [[[-98.56,19.54],[-98.559,19.541],[-98.559,19.54],[-98.56,19.541],[-98.56,19.54]]] };
    assert.equal((await post('/api/fields', { geometry: crossing }, cookie)).status, 400);
    const original = JSON.parse(fs.readFileSync(new URL('../public/data/parcels.geojson', import.meta.url), 'utf8'));
    for (const f of original.features) assert.ok(validateGeometry(f.geometry) > 0);
    // Notes: protected, validated, durable.
    const put = (body: unknown, c = cookie) => fetch(root + '/api/notes', { method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: c }, body: JSON.stringify(body) });
    assert.equal((await put({ text: 'x' }, '')).status, 401);
    assert.equal((await put({ text: 42 })).status, 400);
    assert.equal((await put({ text: 'x'.repeat(50_001) })).status, 400);
    assert.equal((await put({ text: 'Revisar AGC_011 en campo' })).status, 200);
    assert.equal((await (await fetch(root + '/api/notes', { headers: { Cookie: cookie } })).json()).text, 'Revisar AGC_011 en campo');
    assert.equal(JSON.parse(fs.readFileSync(path.join(stateDir, 'workspace.json'), 'utf8')).notes, 'Revisar AGC_011 en campo');
    await post('/api/auth/logout', {}, cookie); assert.equal((await fetch(root + '/api/workspace', { headers: { Cookie: cookie } })).status, 401);
  } finally { await new Promise<void>(resolve => server.close(resolve)); }
});
