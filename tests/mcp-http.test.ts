// The MCP server over HTTP for agents outside the app: every logged-in tab has its own MCP address
// and an agent there acts only on that tab; several tabs (several people, any account) at once;
// several agents on one tab with isolated datasets; downloads only on the person's «Permitir»;
// figures shown in the tab; the address dying with logout or with the tab; shared notes edited
// concurrently; and Milli's chat working in one tab while an outside agent works in another.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
// @ts-expect-error Native ES modules without type declarations.
import { createApp } from '../server/index.mjs';
// @ts-expect-error
import { createScriptedModel } from '../server/milli/models/scripted.mjs';

type Ev = Record<string, any>;
async function* sse(res: Response): AsyncGenerator<Ev> {
  const reader = res.body!.getReader(); const dec = new TextDecoder(); let buf = '';
  while (true) {
    const { value, done } = await reader.read(); if (done) return;
    buf += dec.decode(value, { stream: true });
    let i; while ((i = buf.indexOf('\n\n')) >= 0) { const chunk = buf.slice(0, i); buf = buf.slice(i + 2); const line = chunk.split('\n').find(l => l.startsWith('data: ')); if (line) yield JSON.parse(line.slice(6)); }
  }
}

async function setup() {
  const stateDir = await mkdtemp(path.join(tmpdir(), 'mcp-http-'));
  const app = await createApp({ stateDir, password: 'UnitTest2026!', model: createScriptedModel({ pace: 0 }), liveTimeoutMs: 3000 });
  const server = app.listen(0, '127.0.0.1'); await new Promise<void>(r => server.once('listening', r));
  const root = 'http://127.0.0.1:' + (server.address() as { port: number }).port;
  const login = async () => (await fetch(root + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'testuser', password: 'UnitTest2026!' }) })).headers.get('set-cookie')!.split(';')[0];
  /** A logged-in browser tab: learns its MCP address on connect, answers commands like the app, records them. */
  async function tab(cookie: string, decide: (cmd: Ev) => unknown = () => ({ shown: true })) {
    const screen = 'tab-' + randomUUID(), commands: Ev[] = [], ctrl = new AbortController();
    let mcp = '';
    const res = await fetch(`${root}/api/live?screen=${screen}`, { headers: { Cookie: cookie, 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/140.0' }, signal: ctrl.signal });
    (async () => { try { for await (const e of sse(res)) {
      if (e.type === 'hello') { mcp = `${root}/mcp/${e.mcp}`; continue; }
      if (e.type !== 'command') continue; commands.push(e);
      const result = e.command === 'render_figure' ? { png: 'data:image/png;base64,iVBORw0KGgo=' } : decide(e);
      await fetch(`${root}/api/live/${screen}/reply`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ cmdId: e.cmdId, ok: true, result }) }); } } catch { /* closed */ } })();
    for (let k = 0; k < 50 && !mcp; k++) await new Promise(r => setTimeout(r, 20));
    return { screen, cookie, mcp, commands, close: () => ctrl.abort() };
  }
  async function agent(url: string, name = 'Analista') {
    const client = new Client({ name, version: '1' });
    await client.connect(new StreamableHTTPClientTransport(new URL(url)));
    const call = async (tool: string, args: Record<string, unknown> = {}) => { const r = await client.callTool({ name: tool, arguments: args }) as { isError?: boolean; content: { type: string; text?: string }[] }; const t = r.content[0]?.text ?? ''; let json: any = t; try { json = JSON.parse(t); } catch { /* text */ } return { ...r, json, text: t }; };
    return { client, call };
  }
  const init = (url: string) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'x', version: '1' } } }) });
  return { root, login, tab, agent, init, close: () => new Promise<void>(r => { server.close(() => r()); server.closeAllConnections(); }) };
}

test('MCP over HTTP: each logged-in tab has its own MCP, alive only while its person is logged in', async () => {
  const s = await setup();
  try {
    // Two people log in from two browsers; each tab gets its own secret address.
    const ana = await s.tab(await s.login(), c => c.command === 'ask_permission' ? { approved: true } : { shown: true });
    const beto = await s.tab(await s.login(), c => c.command === 'ask_permission' ? { approved: false } : { shown: true });
    assert.match(ana.mcp, /\/mcp\/[\w-]{30,}$/); assert.notEqual(ana.mcp, beto.mcp);
    assert.equal((await s.init(s.root + '/mcp')).status, 404, 'no address, no MCP');
    assert.equal((await s.init(s.root + '/mcp/' + 'x'.repeat(32))).status, 404, 'an unknown key is refused');

    const a1 = await s.agent(ana.mcp, 'Analista'), b1 = await s.agent(beto.mcp, 'Revisor');
    const names = (await a1.client.listTools()).tools.map(t => t.name);
    for (const n of ['screen_info', 'data_load', 'stats_pca', 'plot_show', 'navigate', 'request_export']) assert.ok(names.includes(n), n);
    assert.ok(!names.includes('list_screens'));
    assert.match(a1.client.getInstructions() ?? '', /pertenece a una pestaña/);
    assert.equal((await a1.call('screen_info')).json.screen_id, ana.screen);

    // Each agent acts only on its own tab; screen_id is optional and another tab's id is refused.
    assert.ok(!(await a1.call('navigate', { page: 'panel' })).isError);
    assert.ok(!(await b1.call('map_fly_to', { all: true })).isError);
    assert.deepEqual(ana.commands.map(c => c.command), ['navigate']);
    assert.deepEqual(beto.commands.map(c => c.command), ['map_fly_to']);
    const cross = await a1.call('navigate', { screen_id: beto.screen, page: 'mapa' });
    assert.equal(cross.isError, true); assert.match(cross.text, /pertenece a la pantalla/);
    assert.equal(beto.commands.length, 1);

    // Two agents on Ana's tab at once: their datasets don't mix, even with the same names.
    const a2 = await s.agent(ana.mcp, 'Segundo');
    await Promise.all([a1.call('data_load', { source: 'parcelas', as: 'p', filters: { state: 'Puebla' } }), a2.call('data_load', { source: 'parcelas', as: 'p', filters: { state: 'Tlaxcala' } })]);
    assert.equal((await a1.call('data_describe', { dataset: 'p', columns: ['state'] })).json.columns.state.top[0].value, 'Puebla');
    assert.equal((await a2.call('data_describe', { dataset: 'p', columns: ['state'] })).json.columns.state.top[0].value, 'Tlaxcala');

    // Downloads need the person on the tab: Ana allows, Beto declines; the dialog names the agent.
    assert.equal((await a1.call('request_export', { kind: 'estimaciones_csv' })).json.approved, true);
    assert.deepEqual(ana.commands.slice(-2).map(c => c.command), ['ask_permission', 'download']);
    assert.equal(ana.commands.at(-2)!.args.agent, 'Analista');
    assert.equal((await b1.call('request_export', { kind: 'entrega_csv' })).json.approved, false);
    assert.ok(!beto.commands.some(c => c.command === 'download'));

    // A figure is shown in the agent's tab (no chat) with its map on the tab's map, and the tab's PNG returns.
    await a2.call('plot_figure', { title: 'Tlaxcala', axes_types: ['map'] });
    await a2.call('plot_map', { dataset: 'p', layer: 'parcelas', color_by: 'predicted' });
    const shown = await a2.call('plot_show', {});
    assert.ok(!shown.isError, shown.text); assert.equal(shown.json.shown_on_screen, true);
    assert.ok(shown.content.some(c => c.type === 'image'));
    assert.deepEqual(ana.commands.slice(-3).map(c => c.command), ['show_figure', 'render_figure', 'show_temp_layer']);
    assert.equal(ana.commands.at(-3)!.args.agent, 'Segundo');

    // Shared notes: an agent's append is atomic; a browser saving an older version gets a conflict (409).
    const before = await (await fetch(s.root + '/api/notes', { headers: { Cookie: beto.cookie } })).json();
    await a1.call('write_notes', { text: 'Nota del agente' });
    const stale = await fetch(s.root + '/api/notes', { method: 'PUT', headers: { 'Content-Type': 'application/json', Cookie: beto.cookie }, body: JSON.stringify({ text: 'Texto de Beto', base: before.updatedAt }) });
    assert.equal(stale.status, 409); assert.match((await stale.json()).text, /— Analista · .+\nNota del agente/);

    // Milli's chat in Beto's tab runs while the agent on Ana's tab keeps working.
    const chat = fetch(s.root + '/api/milli/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: beto.cookie }, body: JSON.stringify({ screenId: beto.screen, message: { text: '¿Cuánto ganaría en Hidalgo con un costo de 15000 por hectárea?' } }) });
    const [chatRes, stats] = await Promise.all([chat, a2.call('stats_correlation', { dataset: 'p', columns: ['observed', 'predicted'] })]);
    let answered = false; for await (const e of sse(chatRes)) if (e.type === 'answer') answered = /Hidalgo/.test(e.text);
    assert.ok(answered); assert.ok(!stats.isError);

    // Beto logs out: his tab's MCP ends at once (his agent's session too); Ana's keeps working.
    await fetch(s.root + '/api/auth/logout', { method: 'POST', headers: { Cookie: beto.cookie } });
    await assert.rejects(b1.call('screen_info'));
    const loggedOut = await s.init(beto.mcp);
    assert.equal(loggedOut.status, 401); assert.match((await loggedOut.json()).error.message, /vuelve a iniciar sesión/);
    assert.ok(!(await a1.call('screen_info')).isError);

    // Ana closes her tab: commands fail fast with a clear message instead of hanging.
    ana.close(); await new Promise(r => setTimeout(r, 80));
    const closed = await a1.call('navigate', { page: 'mapa' });
    assert.equal(closed.isError, true); assert.match(closed.text, /desconect|no está conectada/);
    beto.close();
  } finally { await s.close(); }
});
