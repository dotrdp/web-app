import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
// @ts-expect-error Native ES modules without type declarations.
import { createApp } from '../server/index.mjs';
// @ts-expect-error
import { createMilliMcp } from '../server/milli/mcp.mjs';
// @ts-expect-error
import { loadAtlas, parcels } from '../server/milli/data.mjs';
// @ts-expect-error
import { createScriptedModel } from '../server/milli/models/scripted.mjs';
// @ts-expect-error
import { compile } from '../server/milli/analysis/figure.mjs';

const dataDir = new URL('../public/data/', import.meta.url).pathname;
const json = (r: { content: { type: string; text: string }[] }) => JSON.parse(r.content[0].text);

/** MCP server wired to a fake screen that records commands. */
async function mcpClient(commandResult: (type: string, args: unknown) => unknown = () => ({ shown: true })) {
  const atlas = await loadAtlas(dataDir);
  const sent: { type: string; args: unknown }[] = [], notified: unknown[] = [];
  const run: { task: null | { steps: string[] }; finished: string | null; startTask: (t: { steps: string[] }) => void; updateTask: () => void; finish: (a: string) => void } = {
    task: null, finished: null, startTask(t) { this.task = t; }, updateTask() {}, finish(a) { this.finished = a; },
  };
  let notesText = '';
  const live = { command: async (_s: string, _h: string, type: string, args: unknown) => { sent.push({ type, args }); return { ok: true, result: commandResult(type, args) }; }, notify: (_s: string, _h: string, e: unknown) => notified.push(e), screens: new Map([['screen-AAAAAAAAAAAAAAAA', { following: true }]]) };
  const server = createMilliMcp({ screenId: 'screen-AAAAAAAAAAAAAAAA', sessionHash: 'h', live, atlas, allParcels: () => parcels(atlas), run,
    notes: { get: () => ({ text: notesText }), set: async (t: string) => { notesText = t; } }, attachments: new Map([['csv_1', { name: 'mis.csv', columns: ['id', 'kg'], rows: [['AGC_001', '10'], ['AGC_003', '7']] }]]) });
  const client = new Client({ name: 't', version: '1' });
  const [c, s] = InMemoryTransport.createLinkedPair();
  await server.connect(s); await client.connect(c);
  return { client, sent, notified, run, notes: () => notesText };
}

test('MCP: every tool is listed with a schema, and screen tools demand the conversation\'s own screen_id', async () => {
  const { client, sent } = await mcpClient();
  const { tools } = await client.listTools();
  const names = tools.map(t => t.name);
  for (const n of ['start_task', 'update_task', 'finish_task', 'get_screen_state', 'read_table', 'read_notes', 'query_parcels', 'get_series', 'get_integrals', 'get_region_error', 'get_model_metrics', 'read_attachment',
    'navigate', 'open_panel', 'map_fly_to', 'select_parcel', 'map_select_parcels', 'set_map_layer', 'set_map_filters', 'set_time', 'table_set', 'table_check', 'plot_set', 'calculator_set', 'region_error_drill', 'write_notes', 'request_export', 'data_load', 'stats_spatial_autocorrelation', 'plot_figure', 'plot_show'])
    assert.ok(names.includes(n), `missing tool ${n}`);
  for (const t of tools) { assert.equal(t.inputSchema.type, 'object'); assert.ok((t.description ?? '').length > 20, `${t.name} needs a real description`); }
  const wrong = await client.callTool({ name: 'navigate', arguments: { screen_id: 'otra-pantalla-123456', page: 'panel' } });
  assert.equal(wrong.isError, true); assert.match((wrong.content as { text: string }[])[0].text, /no corresponde/);
  assert.equal(sent.length, 0);
  const bad = await client.callTool({ name: 'navigate', arguments: { screen_id: 'screen-AAAAAAAAAAAAAAAA', page: 'cocina' } });
  assert.equal(bad.isError, true);
  const ok = await client.callTool({ name: 'navigate', arguments: { screen_id: 'screen-AAAAAAAAAAAAAAAA', page: 'panel' } });
  assert.equal(ok.isError, undefined); assert.deepEqual(sent[0], { type: 'navigate', args: { page: 'panel' } });
});

test('MCP: data tools agree with the app (integrals, regional error, series, query, attachments)', async () => {
  const { client } = await mcpClient();
  const reserved = json(await client.callTool({ name: 'query_parcels', arguments: { group: 'reservadas', limit: 500, fields: ['id'] } }) as never);
  assert.equal(reserved.total, 59);
  const integrals = json(await client.callTool({ name: 'get_integrals', arguments: { parcel_ids: reserved.rows.map((r: { id: string }) => r.id) } }) as never);
  // The dashboard shows 2.09 / 1.72 / 2.22 / 2.27 for the 59 reserved parcels.
  integrals.forEach((i: { value_ndvi_month: number }, k: number) => assert.ok(Math.abs(i.value_ndvi_month - [2.09, 1.72, 2.22, 2.27][k]) < 0.006, `${i.value_ndvi_month}`));
  const states = json(await client.callTool({ name: 'get_region_error', arguments: { level: 'estado' } }) as never);
  const measured = Object.fromEntries(states.regions.map((r: { name: string; measured: { mae: number } }) => [r.name, r.measured.mae.toFixed(2)]));
  assert.deepEqual(measured, { Puebla: '0.37', Hidalgo: '0.25', Tlaxcala: '0.30' });
  assert.equal(states.overall.mae.toFixed(3), '0.322'); // the model's MAE, 0.3218
  const s = json(await client.callTool({ name: 'get_series', arguments: { parcel_ids: ['AGC_001', 'NOPE'], years: [2025] } }) as never);
  assert.deepEqual(s.missing, ['NOPE']);
  assert.deepEqual(s.by_parcel.AGC_001[6], { month: '2025-07', ndvi_mean: 0.2458, ndvi_min: 0.101, ndvi_max: 0.723, precip_mm: 207.6 });
  const top = json(await client.callTool({ name: 'query_parcels', arguments: { state: 'puebla', sort: 'predicted', desc: true, limit: 1 } }) as never);
  assert.equal(top.rows[0].state, 'Puebla');
  const att = json(await client.callTool({ name: 'read_attachment', arguments: { attachment_id: 'csv_1', columns: ['id'] } }) as never);
  assert.deepEqual(att.rows, [['AGC_001'], ['AGC_003']]);
  assert.equal((await client.callTool({ name: 'read_attachment', arguments: { attachment_id: 'csv_9' } })).isError, true);
});

test('MCP: task lifecycle, notes, and the plot animation for bulk reads', async () => {
  const { client, run, notified, sent, notes } = await mcpClient(type => type === 'show_notes' ? { shown: true } : { shown: true });
  const sid = 'screen-AAAAAAAAAAAAAAAA';
  assert.equal((await client.callTool({ name: 'update_task', arguments: { screen_id: sid, step: 0, status: 'running' } })).isError, true);
  await client.callTool({ name: 'start_task', arguments: { screen_id: sid, title: 'Prueba', goal: 'Probar el ciclo', steps: ['Uno', 'Dos'] } });
  assert.equal((await client.callTool({ name: 'update_task', arguments: { screen_id: sid, step: 5, status: 'done' } })).isError, true);
  await client.callTool({ name: 'update_task', arguments: { screen_id: sid, step: 1, status: 'done', note: 'ok' } });
  await client.callTool({ name: 'get_series', arguments: { parcel_ids: ['AGC_001', 'AGC_002'], show: true, screen_id: sid } });
  await client.callTool({ name: 'write_notes', arguments: { screen_id: sid, text: 'Primera nota' } });
  await client.callTool({ name: 'write_notes', arguments: { screen_id: sid, text: 'Segunda nota' } });
  assert.match(notes(), /^— Milli · .+\nPrimera nota\n\n— Milli · .+\nSegunda nota$/);
  assert.equal(sent.filter(c => c.type === 'show_notes').length, 2);
  await client.callTool({ name: 'finish_task', arguments: { screen_id: sid, answer: 'Listo.' } });
  assert.equal(run.finished, 'Listo.');
  assert.deepEqual(notified.map(e => (e as { type: string; phase?: string }).phase ?? (e as { type: string }).type), ['start', 'update', 'show_series', 'finish']);
});

// ── Full conversations over HTTP, with a simulated browser tab on the live channel ────────────

type Ev = Record<string, any>;
async function* sse(res: Response): AsyncGenerator<Ev> {
  const reader = res.body!.getReader(); const dec = new TextDecoder(); let buf = '';
  while (true) {
    const { value, done } = await reader.read(); if (done) return;
    buf += dec.decode(value, { stream: true });
    let i; while ((i = buf.indexOf('\n\n')) >= 0) { const chunk = buf.slice(0, i); buf = buf.slice(i + 2); const line = chunk.split('\n').find(l => l.startsWith('data: ')); if (line) yield JSON.parse(line.slice(6)); }
  }
}
async function collect(res: Response) { const out: Ev[] = []; for await (const e of sse(res)) out.push(e); return out; }

async function setup(options: Record<string, unknown> = {}) {
  const stateDir = await mkdtemp(path.join(tmpdir(), 'milli-'));
  const app = await createApp({ stateDir, password: 'UnitTest2026!', model: createScriptedModel({ pace: 0 }), liveTimeoutMs: 1500, ...options });
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(r => server.once('listening', r));
  const root = 'http://127.0.0.1:' + (server.address() as { port: number }).port;
  const login = async () => (await fetch(root + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'testuser', password: 'UnitTest2026!' }) })).headers.get('set-cookie')!.split(';')[0];
  const cookie = await login();
  /** A fake tab: answers every command like the real bridge would, and records them. */
  async function tab(cookieValue = cookie, screen = 'tab-' + randomUUID()) {
    const commands: Ev[] = [], events: Ev[] = [];
    const ctrl = new AbortController();
    const res = await fetch(`${root}/api/live?screen=${screen}`, { headers: { Cookie: cookieValue }, signal: ctrl.signal });
    if (res.status !== 200) return { status: res.status, screen, commands, events, close: () => ctrl.abort() };
    (async () => {
      try {
        for await (const e of sse(res)) {
          events.push(e);
          if (e.type !== 'command') continue;
          commands.push(e);
          const result = e.command === 'calculator_set' ? { shown: true, totals: { parcels: 51, area: 400, production: 1700, income: 11050000, band: 900000, cost: 6000000, margin: 5050000, breakEven: 2.31, above: 49 } }
            : e.command === 'state' ? { vista: { pagina: 'mapa' }, mapa: { capas_activas: 'ninguna (solo parcelas)', parcelas_visibles: 197 } } : { shown: true };
          await fetch(`${root}/api/live/${screen}/reply`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookieValue }, body: JSON.stringify({ cmdId: e.cmdId, ok: true, result }) });
        }
      } catch { /* aborted */ }
    })();
    await new Promise(r => setTimeout(r, 50));
    return { status: 200, screen, commands, events, close: () => ctrl.abort() };
  }
  const chat = (body: unknown, cookieValue = cookie) => fetch(root + '/api/milli/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookieValue }, body: JSON.stringify(body) });
  return { root, cookie, login, tab, chat, stateDir, close: () => new Promise<void>(r => { server.close(() => r()); server.closeAllConnections(); }) };
}

test('Conversation: NDVI analysis drives the screen, asks to export, resumes on approval and ends with finish_task', async () => {
  const s = await setup();
  try {
    const t = await s.tab();
    const first = await collect(await s.chat({ screenId: t.screen, message: { text: 'Compara el NDVI de julio 2025 de las parcelas reservadas de Calpulalpan, anótalo y exporta la tabla' } }));
    const threadId = first.find(e => e.type === 'thread')!.id;
    const calls = first.filter(e => e.type === 'tool-call').map(e => e.name);
    assert.equal(calls[0], 'start_task');
    for (const n of ['query_parcels', 'get_series', 'navigate', 'table_set', 'table_check', 'plot_set', 'write_notes', 'plot_figure', 'plot_bar', 'plot_line', 'plot_show']) assert.ok(calls.includes(n), `expected ${n}`);
    assert.ok(first.some(e => e.type === 'reasoning'), 'reasoning streams to the chat');
    assert.equal(first.filter(e => e.type === 'tool-result' && e.isError).length, 0, JSON.stringify(first.filter(e => e.isError)));
    const approval = first.find(e => e.type === 'approval')!;
    assert.equal(approval.name, 'request_export');
    assert.deepEqual(first.at(-1), { type: 'done', status: 'requires-action' });
    assert.ok(!t.commands.some(c => c.command === 'download'), 'nothing downloads before approval');
    assert.ok(t.events.some(e => e.type === 'show_series' && e.ids.length === 14), 'the plot animates through the 14 parcels');
    assert.deepEqual(t.commands.find(c => c.command === 'table_check')!.args.mode, 'set');

    const second = await collect(await s.chat({ screenId: t.screen, threadId, approval: { toolCallId: approval.id, approved: true } }));
    assert.ok(t.commands.some(c => c.command === 'download' && c.args.kind === 'estimaciones_csv'), 'downloads after approval');
    const answer = second.find(e => e.type === 'answer')!;
    assert.match(answer.text, /NDVI de julio de 2025 · 14 parcelas reservadas/);
    assert.match(answer.text, /Descargué la tabla/);
    assert.deepEqual(second.at(-1), { type: 'done', status: 'finished' });
    assert.equal(second.filter(e => e.type === 'tool-call').at(-1)!.name, 'finish_task', 'finish_task is the last call: the end of sequence');
    assert.ok(t.events.some(e => e.type === 'task' && e.phase === 'finish'), 'the screen hears the end of the task');
    const notes = await (await fetch(s.root + '/api/notes', { headers: { Cookie: s.cookie } })).json();
    assert.match(notes.text, /NDVI julio 2025 · 14 parcelas reservadas/);
    const saved = await (await fetch(`${s.root}/api/milli/thread/${threadId}`, { headers: { Cookie: s.cookie } })).json();
    assert.equal(saved.pending, null);
    assert.ok(fs.existsSync(path.join(s.stateDir, 'milli', threadId + '.json')));
    t.close();
  } finally { await s.close(); }
});

test('Conversation: declining the export, the calculator and the map scenarios all reach an answer', async () => {
  const s = await setup();
  try {
    const t = await s.tab();
    const first = await collect(await s.chat({ screenId: t.screen, message: { text: 'Analiza el NDVI de Chignahuapan y exporta' } }));
    const threadId = first.find(e => e.type === 'thread')!.id, approval = first.find(e => e.type === 'approval')!;
    const declined = await collect(await s.chat({ screenId: t.screen, threadId, approval: { toolCallId: approval.id, approved: false } }));
    assert.match(declined.find(e => e.type === 'answer')!.text, /no diste permiso/);
    assert.ok(!t.commands.some(c => c.command === 'download'));
    // Same thread, next request: the calculator.
    const econ = await collect(await s.chat({ screenId: t.screen, threadId, message: { text: '¿Cuánto ganaría en Hidalgo con un costo de 15000 por hectárea?' } }));
    const calc = t.commands.find(c => c.command === 'calculator_set')!;
    assert.equal(calc.args.cost_ha, 15000); assert.equal(calc.args.checked_parcel_ids.length, 51);
    // Totals come from the server's calculator, not the screen: 51 Hidalgo parcels at $15,000/ha.
    const econAnswer = econ.find(e => e.type === 'answer')!.text;
    assert.match(econAnswer, /Parcelas de Hidalgo · 51 parcelas/);
    assert.match(econAnswer, /Margen estimado: \*\*\$[\d,]+\*\*/);
    assert.ok(t.commands.some(c => c.command === 'region_error_drill' && c.args.state === 'Hidalgo'));
    // And the map.
    const map = await collect(await s.chat({ screenId: t.screen, threadId, message: { text: 'Muéstrame en el mapa las parcelas de Puebla con más de 4.5 t' } }));
    const select = t.commands.find(c => c.command === 'map_select_parcels')!;
    assert.ok(select.args.parcel_ids.length > 0);
    assert.ok(t.commands.some(c => c.command === 'set_map_filters' && c.args.state === 'Puebla'));
    assert.deepEqual(map.at(-1), { type: 'done', status: 'finished' });
    // And figures in the chat, built call by call: estimate against recorded, then spatial autocorrelation.
    const plots = await collect(await s.chat({ screenId: t.screen, threadId, message: { text: 'Grafica el rendimiento estimado contra el registrado y el error por estado' } }));
    const names = plots.filter(e => e.type === 'tool-call').map(e => e.name);
    for (const n of ['data_load', 'plot_figure', 'plot_scatter', 'plot_reference', 'plot_bar', 'plot_axes', 'plot_show']) assert.ok(names.includes(n), `expected ${n}`);
    assert.equal(plots.filter(e => e.type === 'tool-result' && e.isError).length, 0, JSON.stringify(plots.filter(e => e.isError)));
    const shown = plots.find(e => e.type === 'tool-result' && e.name === 'plot_show')!;
    assert.equal(shown.figure.title, '¿Qué tan bien estima el modelo?');
    // The chat compiles the figure for its width; the enlarged view keeps both panels' traces.
    const drawn = compile(shown.figure.state, { width: 1000 }) as { data: { type: string; xaxis?: string; x: unknown[] }[] };
    assert.equal(drawn.data.filter(d => d.type === 'scatter' && d.xaxis === 'x').reduce((n, d) => n + d.x.length, 0), 138);
    assert.ok(!('figure' in JSON.parse(shown.result)), 'the model gets a summary, not the figure');
    // The fake tab cannot draw, so the model is told there is no review image.
    assert.match(JSON.parse(shown.result).review.join(' '), /Sin imagen de revisión/);
    assert.match(plots.find(e => e.type === 'answer')!.text, /MAE global es \*\*0[.,]32 t\/ha\*\*/);
    const spatial = await collect(await s.chat({ screenId: t.screen, threadId, message: { text: '¿El error del modelo tiene autocorrelación espacial? Grafícalo' } }));
    assert.equal(spatial.filter(e => e.type === 'tool-result' && e.isError).length, 0, JSON.stringify(spatial.filter(e => e.isError)));
    const fig = compile(spatial.find(e => e.type === 'tool-result' && e.name === 'plot_show')!.figure.state) as { data: { type: string }[] };
    assert.ok(fig.data.some(d => d.type === 'choroplethmap'), 'LISA map');
    // …and the LISA map went to the tab's map as a temporary layer.
    const temp = t.commands.find(c => c.command === 'show_temp_layer')!;
    assert.equal(temp.args.title, 'Clusters LISA (p < 0.05)'); assert.equal(temp.args.parcels.length, 138);
    assert.match(spatial.find(e => e.type === 'answer')!.text, /I de Moran del error: \*\*-?0[.,]0\d\d\*\*/);
    t.close();
  } finally { await s.close(); }
});

test('Conversation: CSV attachments only, ownership, busy threads, cancellation and a model that forgets to finish', async () => {
  const s = await setup();
  try {
    const t = await s.tab();
    // CSV analysis.
    const csv = await collect(await s.chat({ screenId: t.screen, message: { text: 'Revisa mi archivo', attachments: [{ name: 'cosecha.csv', content: 'parcela;kg\nAGC_001;9000\nAGC_003;12000\n' }] } }));
    assert.equal(csv.find(e => e.type === 'tool-call' && e.name === 'read_attachment')!.args.attachment_id, 'csv_1');
    assert.match(csv.find(e => e.type === 'answer')!.text, /Coinciden \*\*2 parcelas\*\*/);
    // Images and other files are refused before anything runs.
    const png = await s.chat({ screenId: t.screen, message: { text: 'mira', attachments: [{ name: 'foto.png', content: 'xx' }] } });
    assert.equal(png.status, 400); assert.match((await png.json()).error, /solo acepta archivos CSV/);
    const empty = await s.chat({ screenId: t.screen, message: { text: '', attachments: [{ name: 'vacio.csv', content: '' }] } });
    assert.equal(empty.status, 400);
    // Another session can't claim this screen or drive it.
    const other = await s.login();
    assert.equal((await s.tab(other, t.screen)).status, 403);
    assert.equal((await s.chat({ screenId: t.screen, message: { text: 'hola' } }, other)).status, 409);
    // A screen that never connected can't be used.
    assert.equal((await s.chat({ screenId: 'tab-' + randomUUID(), message: { text: 'hola' } })).status, 409);
    t.close();
  } finally { await s.close(); }

  // Cancelling mid-run (closing the request) ends the run and frees the thread for the next message.
  const s3 = await setup({ model: createScriptedModel({ pace: 40 }) });
  try {
    const t = await s3.tab();
    const ctrl = new AbortController();
    const res = await fetch(s3.root + '/api/milli/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: s3.cookie }, body: JSON.stringify({ screenId: t.screen, message: { text: 'hola' } }), signal: ctrl.signal });
    const threadId = (await sse(res).next()).value!.id;
    ctrl.abort();
    await new Promise(r => setTimeout(r, 400));
    assert.ok(t.events.some(e => e.type === 'task' && e.phase === 'finish' && e.status === 'cancelled'), 'the screen hears the cancellation');
    const again = await collect(await s3.chat({ screenId: t.screen, threadId, message: { text: 'hola de nuevo' } }));
    assert.deepEqual(again.at(-1), { type: 'done', status: 'finished' });
    t.close();
  } finally { await s3.close(); }

  // A model that never calls finish_task gets one reminder, then the task closes as incomplete.
  const lazy = { name: 'lazy', async *stream() { yield { type: 'text', delta: 'Creo que ya está.' }; } };
  const s2 = await setup({ model: lazy });
  try {
    const t = await s2.tab();
    const out = await collect(await s2.chat({ screenId: t.screen, message: { text: 'hola' } }));
    assert.ok(out.some(e => e.type === 'error' && /no cerró la tarea/.test(e.message)));
    assert.deepEqual(out.at(-1), { type: 'done', status: 'incomplete' });
    assert.ok(t.events.some(e => e.type === 'task' && e.phase === 'finish' && e.status === 'incomplete'));
    t.close();
  } finally { await s2.close(); }
});

test('Live channel: a disconnected screen fails fast, and a silent one times out', async () => {
  const s = await setup();
  try {
    const silent = 'tab-' + randomUUID();
    const ctrl = new AbortController();
    await fetch(`${s.root}/api/live?screen=${silent}`, { headers: { Cookie: s.cookie }, signal: ctrl.signal });
    const started = Date.now();
    const out = await collect(await s.chat({ screenId: silent, message: { text: 'Muéstrame en el mapa las parcelas de Tlaxcala' } }));
    const failed = out.filter(e => e.type === 'tool-result' && e.isError);
    assert.ok(failed.some(e => /no respondió a tiempo/.test(e.result)), 'screen commands time out instead of hanging');
    assert.ok(Date.now() - started < 30_000);
    assert.deepEqual(out.at(-1), { type: 'done', status: 'finished' }, 'the model still finishes, knowing the screen did not respond');
    ctrl.abort();
    const fb = await fetch(s.root + '/api/milli/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: s.cookie }, body: JSON.stringify({ threadId: out[0].id, messageId: 'm1', vote: 'down', reasons: ['Cifras incorrectas'], comment: 'Usa t/ha' }) });
    assert.equal(fb.status, 200);
    assert.equal((await fetch(s.root + '/api/milli/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: s.cookie }, body: JSON.stringify({ threadId: out[0].id, vote: 'meh' }) })).status, 400);
  } finally { await s.close(); }
});
