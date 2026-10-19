import express from 'express';
import { createServer } from 'node:http';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { validateGeometry } from './geometry.mjs';
import { createLive } from './milli/live.mjs';
import { createMilli } from './milli/agent.mjs';
import { mountMcpHttp } from './milli/mcp-http.mjs';
import { loadAtlas, parcels } from './milli/data.mjs';
import { createScriptedModel } from './milli/models/scripted.mjs';
import { createRelayModel } from './milli/models/relay.mjs';
export { validateGeometry } from './geometry.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicUser = u => ({ id: u.id, username: u.username, name: u.name });
const sha = value => createHash('sha256').update(value).digest('hex');
const cookieName = 'agrocebada_session';

/** Notes are plain text; this keeps one save well under the 256 kB JSON body limit. */
const MAX_NOTES = 50_000;

/** Milli's model. Only the scripted stand-in exists for now; a provider adapter plugs in here by name. */
function milliModel(name = process.env.MILLI_MODEL || 'scripted', stateDir) {
  // MILLI_PACE: milliseconds per streamed word of the scripted model (the e2e tests slow it down).
  if (name === 'scripted') return createScriptedModel(process.env.MILLI_PACE ? { pace: Number(process.env.MILLI_PACE) } : {});
  // Development only: each turn is answered through files (scripts/milli-relay.mjs).
  if (name === 'relay') return createRelayModel({ dir: path.join(stateDir, 'milli-relay') });
  throw new Error(`Modelo de Milli desconocido: ${name}`);
}

export async function createApp({ stateDir = process.env.STATE_DIR || path.join(root, '.data-cache/server'), password = process.env.ADMIN_PASSWORD || 'Fira2026!', dataDir = path.join(root, 'public/data'), model = milliModel(undefined, stateDir), liveTimeoutMs } = {}) {
  await mkdir(stateDir, { recursive: true });
  const statePath = path.join(stateDir, 'workspace.json');
  let state;
  try { state = JSON.parse(await readFile(statePath, 'utf8')); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  if (!state) {
    const salt = randomBytes(16).toString('hex');
    state = { user: { id: 'test-admin', username: 'testuser', name: 'Cuenta de prueba', salt, hash: scryptSync(password, salt, 64).toString('hex') }, analyses: [], overrides: {}, fields: [] };
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
  // Milli's chat carries up to three 2 MB CSV attachments; every other endpoint keeps a small body limit.
  // A tab's reply to plot_show carries the figure's PNG.
  const smallJson = express.json({ limit: '256kb' }), chatJson = express.json({ limit: '7mb' }), replyJson = express.json({ limit: '8mb' });
  app.use((req, res, next) => req.path === '/mcp' || req.path.startsWith('/mcp/') ? next() : (req.path === '/api/milli/chat' ? chatJson : /^\/api\/live\/[^/]+\/reply$/.test(req.path) ? replyJson : smallJson)(req, res, next));
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
    if (session && session.expires > Date.now()) { req.user = state.user; req.sessionHash = sha(token); }
    else if (token) sessions.delete(sha(token));
    next();
  });
  // The onnxruntime-web runtime for the in-browser segmentation model (src/segmentation/sam.worker.ts).
  const ortDir = path.join(root, 'node_modules/onnxruntime-web/dist'), ortVersion = JSON.parse(readFileSync(path.join(root, 'node_modules/onnxruntime-web/package.json'), 'utf8')).version;
  app.get('/ort/:version/:file', (req, res) => {
    if (req.params.version !== ortVersion || !/^ort-wasm-simd-threaded\.asyncify\.(mjs|wasm)$/.test(req.params.file)) return res.status(404).end();
    res.sendFile(path.join(ortDir, req.params.file), { maxAge: '365d', immutable: true });
  });
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', model: 'ensemble-predictions', port: Number(process.env.PORT || 8080) }));
  app.use(['/api/imagery', '/api/segmentation'], async (req, res) => {
    try {
      const token = process.env.AGROCEBADA_SERVICE_TOKEN || await readFile(path.join(root,'.data-cache/deployment/service-token'),'utf8').then(s=>s.trim()).catch(()=> '');
      const response = await fetch((process.env.IMAGERY_SERVICE_URL || 'http://127.0.0.1:8090')+req.originalUrl, { method: req.method, headers: { 'Content-Type':'application/json', 'X-AgroCebada-Service-Token': token, 'X-Demo-Client': req.ip || 'local' }, body: req.method==='POST' ? JSON.stringify(req.body) : undefined, signal: AbortSignal.timeout(95000) });
      // The browser keeps the segmentation model files (immutable, content-hashed names) and tiles.
      const cache = response.headers.get('Cache-Control'); if (cache) res.set('Cache-Control', cache);
      res.status(response.status).set('Content-Type',response.headers.get('Content-Type') || 'application/json').send(Buffer.from(await response.arrayBuffer()));
    } catch { res.status(503).json({ error:'Servicio de imágenes no disponible. Puedes seguir usando el atlas.' }); }
  });
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
    // Logging out also ends the MCP sessions of this login's tabs.
    if (token) { sessions.delete(sha(token)); mcpHttp.endLogin(sha(token)); }
    res.clearCookie(cookieName, { httpOnly: true, sameSite: 'lax', path: '/' });
    res.json({ ok: true });
  });
  // Milli's live channel to each tab, and the MCP endpoint for outside agents (token auth, its own).
  const live = createLive(liveTimeoutMs ? { timeoutMs: liveTimeoutMs } : {});
  const atlas = await loadAtlas(dataDir);
  const notesStore = { get: () => ({ text: state.notes ?? '', updatedAt: state.notesUpdatedAt ?? null }), set: async text => { state.notes = text; state.notesUpdatedAt = new Date().toISOString(); await persist(); } };
  const workspace = () => ({ overrides: state.overrides, fields: state.fields });
  const mcpHttp = mountMcpHttp(app, { live, atlas, workspace, notes: notesStore, allParcels: () => parcels(atlas, workspace()), loggedIn: hash => (sessions.get(hash)?.expires ?? 0) > Date.now() });
  app.use('/api', (req, res, next) => req.user ? next() : res.status(401).json({ error: 'Inicia sesión para continuar.' }));
  app.get('/api/workspace', (_req, res) => res.json({ overrides: state.overrides, fields: state.fields }));
  // Free-text notes from the Notas side menu, saved with the rest of the workspace.
  app.get('/api/notes', (_req, res) => res.json({ text: state.notes ?? '', updatedAt: state.notesUpdatedAt ?? null }));
  app.put('/api/notes', async (req, res, next) => {
    const text = req.body?.text;
    if (typeof text !== 'string' || text.length > MAX_NOTES) return res.status(400).json({ error: `Las notas deben ser texto de hasta ${MAX_NOTES.toLocaleString('es-MX')} caracteres.` });
    // Several people (and agents) share these notes: a save based on an older version is refused,
    // with the current text, so the editor can merge instead of overwriting someone else's edit.
    const base = req.body?.base;
    if (base !== undefined && (base ?? null) !== (state.notesUpdatedAt ?? null)) return res.status(409).json({ error: 'Las notas cambiaron en otra pantalla.', text: state.notes ?? '', updatedAt: state.notesUpdatedAt ?? null });
    try { state.notes = text; state.notesUpdatedAt = new Date().toISOString(); await persist(); res.json({ text: state.notes, updatedAt: state.notesUpdatedAt }); } catch (e) { next(e); }
  });
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
  // Milli: the agent in each tab's chat (chat, thread, feedback).
  const milli = createMilli({ stateDir, atlas, account: state.user.name, live, model, workspace, notes: notesStore });
  app.get('/api/live', live.connect);
  app.post('/api/live/:screen/reply', live.reply);
  app.post('/api/milli/chat', milli.chat);
  app.get('/api/milli/thread/:id', milli.getThread);
  app.post('/api/milli/feedback', milli.feedback);
  app.locals.milli = { live, connectAgent: milli.connectAgent, mcpSessions: mcpHttp.sessions };
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
