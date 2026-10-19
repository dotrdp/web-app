// Answer Milli's turns by hand when the server runs with MILLI_MODEL=relay.
//
//   node scripts/milli-relay.mjs wait [--system]     waits for the next turn and prints what the model would see
//                                                    (tool results; plot_show's review PNG as an [image] path)
//   node scripts/milli-relay.mjs tools [name…]        prints the tools' descriptions and input schemas (all, or these)
//   node scripts/milli-relay.mjs reply <turn> <file>  answers it with { reasoning?, text?, tool_calls?: [{ name, args }] }
//                                                     (<file> may be - for stdin)
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(process.env.STATE_DIR || path.join(root, '.data-cache/server'), 'milli-relay');
const [cmd, ...rest] = process.argv.slice(2);
const cut = (s, n = 1800) => (s = String(s ?? '')).length > n ? `${s.slice(0, n)}… (+${s.length - n})` : s;

if (cmd === 'wait') {
  let file;
  for (const started = Date.now(); Date.now() - started < 30 * 60_000; await new Promise(r => setTimeout(r, 300))) {
    // A turn with a reply file is already answered (the server removes both once it reads the reply).
    const files = await readdir(dir).catch(() => []);
    const turns = files.filter(f => /^turn-\d+\.json$/.test(f) && !files.includes(f.replace('.json', '.reply.json')));
    if (turns.length) { file = turns.sort((a, b) => parseInt(a.slice(5)) - parseInt(b.slice(5)))[0]; break; }
  }
  if (!file) { console.log('no turn'); process.exit(1); }
  const t = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
  await writeFile(path.join(dir, 'tools.json'), JSON.stringify(t.tools));
  console.log(`TURN ${t.turn} · screen ${t.screenId}${t.attachments?.length ? ` · attachments ${JSON.stringify(t.attachments)}` : ''}`);
  if (rest.includes('--system')) console.log(`\n--- system ---\n${t.system}\n--- tools: ${t.tools.map(x => x.name).join(', ')}`);
  // Everything since the last real user message: what this turn has to answer.
  const lastUser = t.messages.findLastIndex(m => m.role === 'user' && !m.internal);
  for (const m of t.messages.slice(Math.max(0, lastUser))) {
    if (m.role === 'user') console.log(`\n[${m.internal ? 'reminder' : 'user'}] ${m.content.map(c => c.type === 'text' ? c.text : `<csv ${c.id} ${c.name}: ${c.columns?.join(',')} · ${c.rows} rows>`).join(' ')}`);
    else if (m.role === 'assistant') for (const c of m.content) console.log(c.type === 'tool_call' ? `[call] ${c.name} ${cut(JSON.stringify(c.args), 300)}` : `[${c.type}] ${cut(c.text, 300)}`);
    else if (m.role === 'tool') { console.log(`[result${m.isError ? ' ERROR' : ''}] ${m.name}: ${cut(m.result, Number(process.env.RELAY_CUT || 1800))}`); for (const im of m.images ?? []) console.log(`[image] ${im.path}`); }
  }
} else if (cmd === 'tools') {
  // The schemas a provider would send the model, from the newest turn file (or the last one seen).
  const files = (await readdir(dir).catch(() => [])).filter(f => /^turn-\d+\.json$/.test(f)).sort((a, b) => parseInt(b.slice(5)) - parseInt(a.slice(5)));
  const cache = path.join(dir, 'tools.json');
  let tools;
  if (files.length) { tools = JSON.parse(await readFile(path.join(dir, files[0]), 'utf8')).tools; await writeFile(cache, JSON.stringify(tools)); }
  else tools = JSON.parse(await readFile(cache, 'utf8').catch(() => '[]'));
  if (!tools.length) { console.log('No hay turnos todavía: envía un mensaje en el chat y vuelve a intentarlo.'); process.exit(1); }
  const strip = schema => JSON.stringify(schema, (k, v) => k === '$schema' || k === 'additionalProperties' ? undefined : v);
  for (const t of tools.filter(t => !rest.length || rest.includes(t.name))) console.log(`\n## ${t.name}\n${t.description}\ninput: ${strip(t.inputSchema)}`);
} else if (cmd === 'reply') {
  const [turn, from] = rest;
  const body = from === '-' || !from ? await new Promise(r => { let s = ''; process.stdin.on('data', d => s += d).on('end', () => r(s)); }) : await readFile(from, 'utf8');
  JSON.parse(body); // fail here, not in the server
  await writeFile(path.join(dir, `turn-${turn}.reply.json`), body);
  console.log(`answered turn ${turn}`);
} else {
  console.log('usage: milli-relay.mjs wait [--system] | tools [name…] | reply <turn> <file|->');
}
