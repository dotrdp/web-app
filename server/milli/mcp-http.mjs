// The "agrocebada" MCP server for agents outside the app, over MCP's Streamable HTTP transport.
// Every logged-in browser tab has its own MCP address, /mcp/<key>: the key is a secret the server
// gives the tab when it connects (live.mjs), shown in Ajustes → MCP de esta pestaña. An agent on
// that address acts only on that tab, and only while the person's login lasts: logging out, the
// login expiring or the tab staying closed ends it. Each MCP session has its own datasets and
// figures, so several agents can share a tab's address without stepping on each other's data.
import { randomUUID } from 'node:crypto';
import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { createMilliMcp } from './mcp.mjs';
import { createSession } from './analysis/frame.mjs';

const LIMITS = { sessions: 64, idleMs: 2 * 3600_000 };
const rpcError = (res, status, code, message) => res.status(status).json({ jsonrpc: '2.0', error: { code, message }, id: null });

/**
 * @param app express app
 * @param ctx { live, atlas, allParcels, workspace, notes, loggedIn(sessionHash): boolean }
 */
export function mountMcpHttp(app, ctx) {
  const { live } = ctx;
  const sessions = new Map(); // MCP session id → { transport, server, screenId, sessionHash, lastSeen }

  /** The tab behind a key, if it is still there and its person is still logged in. */
  function tabOf(key) {
    const hit = live.byMcpKey(key);
    if (!hit) return { status: 404, message: 'Esta dirección MCP no corresponde a ninguna pestaña abierta: la pestaña se cerró o se recargó. Copia la dirección nueva en AgroCebada → Ajustes → MCP de esta pestaña.' };
    if (!ctx.loggedIn(hit.screen.sessionHash)) return { status: 401, message: 'La sesión de esa pestaña terminó: vuelve a iniciar sesión en AgroCebada y copia la dirección MCP nueva.' };
    return { screenId: hit.id, sessionHash: hit.screen.sessionHash };
  }
  const close = (id, entry) => { sessions.delete(id); entry.transport.close().catch(() => {}); entry.server.close().catch(() => {}); };

  app.post('/mcp/:key', express.json({ limit: '8mb' }), async (req, res) => {
    try {
      const tab = tabOf(req.params.key);
      if (tab.status) return rpcError(res, tab.status, -32001, tab.message);
      const sid = req.headers['mcp-session-id'];
      let entry = sid ? sessions.get(String(sid)) : null;
      if (sid && !entry) return rpcError(res, 404, -32000, 'Sesión MCP desconocida o expirada: inicia una nueva (initialize).');
      if (entry && entry.screenId !== tab.screenId) return rpcError(res, 403, -32003, 'Esta sesión MCP pertenece a otra pestaña.');
      if (!entry) {
        if (!isInitializeRequest(req.body)) return rpcError(res, 400, -32000, 'No hay sesión: la primera solicitud debe ser initialize.');
        if (sessions.size >= LIMITS.sessions) { const [oldId, oldest] = [...sessions].sort((a, b) => a[1].lastSeen - b[1].lastSeen)[0]; close(oldId, oldest); }
        const name = String(req.body?.params?.clientInfo?.name ?? '').slice(0, 60) || 'Agente externo';
        const run = { task: null, startTask(t) { this.task = { ...t, status: t.steps.map(() => 'pending') }; }, updateTask({ step, status }) { if (this.task) this.task.status[step] = status; }, finish() { this.task = null; } };
        const server = createMilliMcp({ screenId: tab.screenId, sessionHash: tab.sessionHash, live, atlas: ctx.atlas, allParcels: ctx.allParcels, notes: ctx.notes, run, attachments: new Map(),
          workspace: ctx.workspace, session: createSession(), agent: { name }, agentName: name });
        const created = { server, screenId: tab.screenId, sessionHash: tab.sessionHash, lastSeen: Date.now() };
        created.transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => randomUUID(), onsessioninitialized: id => { sessions.set(id, created); } });
        created.transport.onclose = () => { const id = created.transport.sessionId; if (id && sessions.get(id) === created) sessions.delete(id); };
        await server.connect(created.transport);
        entry = created;
      }
      entry.lastSeen = Date.now();
      await entry.transport.handleRequest(req, res, req.body);
    } catch (e) {
      console.error('[mcp]', e);
      if (!res.headersSent) rpcError(res, 500, -32603, 'Error interno del servidor MCP.');
    }
  });
  // GET opens a session's server-to-client stream; DELETE ends the session.
  const existing = async (req, res) => {
    const tab = tabOf(req.params.key);
    if (tab.status) return rpcError(res, tab.status, -32001, tab.message);
    const entry = sessions.get(String(req.headers['mcp-session-id'] ?? ''));
    if (!entry) return rpcError(res, 404, -32000, 'Sesión MCP desconocida o expirada.');
    if (entry.screenId !== tab.screenId) return rpcError(res, 403, -32003, 'Esta sesión MCP pertenece a otra pestaña.');
    entry.lastSeen = Date.now();
    try { await entry.transport.handleRequest(req, res); } catch (e) { console.error('[mcp]', e); if (!res.headersSent) rpcError(res, 500, -32603, 'Error interno del servidor MCP.'); }
  };
  app.get('/mcp/:key', existing);
  app.delete('/mcp/:key', existing);
  app.all('/mcp', (_req, res) => rpcError(res, 404, -32001, 'Cada pestaña tiene su propia dirección MCP (/mcp/<clave>): cópiala en AgroCebada → Ajustes → MCP de esta pestaña.'));

  // Sessions end with their tab: closed for good, logged out, or idle for two hours.
  const sweep = setInterval(() => {
    for (const [id, e] of sessions) if (!live.screens.has(e.screenId) || !ctx.loggedIn(e.sessionHash) || Date.now() - e.lastSeen > LIMITS.idleMs) close(id, e);
  }, 30_000);
  sweep.unref();
  /** Ends a login's agent sessions at once (logout). */
  const endLogin = sessionHash => { for (const [id, e] of sessions) if (e.sessionHash === sessionHash) close(id, e); };
  return { sessions, endLogin };
}
