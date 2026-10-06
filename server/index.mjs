import express from 'express';
import { createServer } from 'node:http';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { validateGeometry } from './geometry.mjs';
export { validateGeometry } from './geometry.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicUser = u => ({ id: u.id, username: u.username, name: u.name, role: u.role });
const sha = value => createHash('sha256').update(value).digest('hex');
const cookieName = 'agrocebada_session';

export async function createApp({ stateDir = process.env.STATE_DIR || path.join(root, '.data-cache/server'), password = process.env.ADMIN_PASSWORD || 'Fira2026!', dataDir = path.join(root, 'public/data') } = {}) {
  await mkdir(stateDir, { recursive: true });
  const statePath = path.join(stateDir, 'workspace.json');
  let state;
  try { state = JSON.parse(await readFile(statePath, 'utf8')); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  if (!state) {
    const salt = randomBytes(16).toString('hex');
    state = { user: { id: 'test-admin', username: 'testuser', name: 'Administrador de prueba', role: 'admin', salt, hash: scryptSync(password, salt, 64).toString('hex') }, analyses: [], overrides: {}, fields: [] };
  }
  let writes = Promise.resolve();
  const persist = () => {
    const body = JSON.stringify(state);
    writes = writes.catch(() => {}).then(async () => { await writeFile(statePath + '.tmp', body, { mode: 0o600 }); await rename(statePath + '.tmp', statePath); });
    return writes;
  };
  await persist();
  const sessions = new Map();
  const attempts = new Map();
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '256kb' }));
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    if (req.path.startsWith('/api/')) res.setHeader('Cache-Control', 'no-store');
    next();
  });
  app.use('/api', (req, res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.headers.origin) {
      try { if (new URL(req.headers.origin).host !== req.headers.host) return res.status(403).json({ error: 'Origen de solicitud no permitido.' }); }
      catch { return res.status(403).json({ error: 'Origen de solicitud no permitido.' }); }
    }
    const token = (req.headers.cookie || '').split(';').map(c => c.trim()).find(c => c.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
    const session = token && sessions.get(sha(token));
    if (session && session.expires > Date.now()) req.user = state.user;
    else if (token) sessions.delete(sha(token));
    next();
  });
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', model: 'placeholder', port: Number(process.env.PORT || 8080) }));
  app.get('/api/auth/session', (req, res) => res.json({ user: req.user ? publicUser(req.user) : null }));
  app.post('/api/auth/login', (req, res) => {
    const ip = req.ip;
    const attempt = attempts.get(ip) || { count: 0, since: Date.now() };
    if (Date.now() - attempt.since > 600000) { attempt.count = 0; attempt.since = Date.now(); }
    if (attempt.count >= 20) return res.status(429).json({ error: 'Demasiados intentos. Intenta de nuevo en unos minutos.' });
    const { username, password: supplied } = req.body || {};
    if (typeof username !== 'string' || typeof supplied !== 'string' || supplied.length > 256) return res.status(400).json({ error: 'Introduce tu usuario y contraseña.' });
    const actual = scryptSync(supplied, state.user.salt, 64);
    const expected = Buffer.from(state.user.hash, 'hex');
    if (username !== state.user.username || !timingSafeEqual(actual, expected)) {
      attempt.count++; attempts.set(ip, attempt);
      return res.status(401).json({ error: 'El usuario o la contraseña no coinciden.' });
    }
    attempts.delete(ip);
    const token = randomBytes(32).toString('base64url');
    sessions.set(sha(token), { expires: Date.now() + 12 * 3600000 });
    res.cookie(cookieName, token, { httpOnly: true, sameSite: 'lax', secure: req.secure, maxAge: 12 * 3600000, path: '/' });
    res.json({ user: publicUser(state.user) });
  });
  app.post('/api/auth/logout', (req, res) => {
    const token = (req.headers.cookie || '').split(';').map(c => c.trim()).find(c => c.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
    if (token) sessions.delete(sha(token));
    res.clearCookie(cookieName, { httpOnly: true, sameSite: 'lax', path: '/' });
    res.json({ ok: true });
  });
  app.use('/api', (req, res, next) => req.user ? next() : res.status(401).json({ error: 'Inicia sesión para continuar.' }));
  app.get('/api/admin/users', (req, res) => req.user.role === 'admin' ? res.json({ users: [publicUser(state.user)] }) : res.status(403).json({ error: 'Se requiere acceso de administrador.' }));
  app.get('/api/workspace', (_req, res) => res.json({ analyses: state.analyses, overrides: state.overrides, fields: state.fields }));
  app.post('/api/fields', async (req, res, next) => {
    try {
      const { geometry, name } = req.body || {};
      const area = validateGeometry(geometry);
      const field = { id: 'user-' + randomUUID(), name: typeof name === 'string' && name.trim() ? name.trim().slice(0, 80) : 'Mi parcela', geometry, area, createdAt: new Date().toISOString() };
      state.fields.push(field); await persist(); res.status(201).json(field);
    } catch (e) { if (e.code) return next(e); res.status(400).json({ error: e.message }); }
  });
  app.put('/api/parcels/:id/geometry', async (req, res, next) => {
    try {
      const { id } = req.params;
      const original = JSON.parse(await readFile(path.join(dataDir, 'parcels.geojson'), 'utf8'));
      if (!original.features.some(f => f.properties.id === id) && !state.fields.some(f => f.id === id)) return res.status(404).json({ error: 'No encontramos esa parcela.' });
      const area = validateGeometry(req.body?.geometry);
      const override = { geometry: req.body.geometry, area, updatedAt: new Date().toISOString() };
      state.overrides[id] = override; await persist(); res.json(override);
    } catch (e) { if (e.code) return next(e); res.status(400).json({ error: e.message }); }
  });
  app.post('/api/analyses', async (req, res, next) => {
    try {
      const { geometry, parcelId, name } = req.body || {};
      const area = validateGeometry(geometry);
      // Deliberate fixed placeholder, as requested. No model is loaded or run.
      const exampleYield = 4.2;
      const result = { id: randomUUID(), parcelId: typeof parcelId === 'string' ? parcelId.slice(0, 100) : null, name: typeof name === 'string' ? name.slice(0, 80) : 'Parcela', area, geometry, yield: exampleYield, production: Math.round(area * exampleYield * 100) / 100, status: 'placeholder', createdAt: new Date().toISOString() };
      state.analyses.unshift(result); state.analyses = state.analyses.slice(0, 500);
      await persist(); res.status(201).json(result);
    } catch (e) { if (e.code) return next(e); res.status(400).json({ error: e.message }); }
  });
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Este recurso no existe.' }));
  app.use((err, _req, res, _next) => { console.error(err.message); res.status(err.type === 'entity.parse.failed' ? 400 : 500).json({ error: err.type === 'entity.parse.failed' ? 'El cuerpo de la solicitud no es válido.' : 'No pudimos guardar el cambio. Intenta de nuevo.' }); });
  return app;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const app = await createApp();
  const server = createServer(app);
  const production = process.argv.includes('--production');
  if (production) {
    app.use(express.static(path.join(root, 'dist')));
    app.get('/{*path}', (_req, res) => res.sendFile(path.join(root, 'dist/index.html')));
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({ root, server: { middlewareMode: true, hmr: { server } }, appType: 'spa' });
    app.use(vite.middlewares);
  }
  const port = Number(process.env.PORT || 8080);
  server.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`AgroCebada · FIRA 2026: http://localhost:${port} (${production ? 'production' : 'development'})`));
  server.on('error', e => { console.error(e.message); process.exit(1); });
  const shutdown = () => server.close(() => process.exit(0));
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
