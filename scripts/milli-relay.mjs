// Answer Milli's turns by hand when the server runs with MILLI_MODEL=relay.
//
//   node scripts/milli-relay.mjs wait [--system]     waits for the next turn and prints what the model would see
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
  console.log(`TURN ${t.turn} · screen ${t.screenId}${t.attachments?.length ? ` · attachments ${JSON.stringify(t.attachments)}` : ''}`);
  if (rest.includes('--system')) console.log(`\n--- system ---\n${t.system}\n--- tools: ${t.tools.map(x => x.name).join(', ')}`);
  // Everything since the last real user message: what this turn has to answer.
  const lastUser = t.messages.findLastIndex(m => m.role === 'user' && !m.internal);
  for (const m of t.messages.slice(Math.max(0, lastUser))) {
    if (m.role === 'user') console.log(`\n[${m.internal ? 'reminder' : 'user'}] ${m.content.map(c => c.type === 'text' ? c.text : `<csv ${c.id} ${c.name}: ${c.columns?.join(',')} · ${c.rows} rows>`).join(' ')}`);
    else if (m.role === 'assistant') for (const c of m.content) console.log(c.type === 'tool_call' ? `[call] ${c.name} ${cut(JSON.stringify(c.args), 300)}` : `[${c.type}] ${cut(c.text, 300)}`);
    else if (m.role === 'tool') console.log(`[result${m.isError ? ' ERROR' : ''}] ${m.name}: ${cut(m.result)}`);
  }
} else if (cmd === 'reply') {
  const [turn, from] = rest;
  const body = from === '-' || !from ? await new Promise(r => { let s = ''; process.stdin.on('data', d => s += d).on('end', () => r(s)); }) : await readFile(from, 'utf8');
  JSON.parse(body); // fail here, not in the server
  await writeFile(path.join(dir, `turn-${turn}.reply.json`), body);
  console.log(`answered turn ${turn}`);
} else {
  console.log('usage: milli-relay.mjs wait [--system] | reply <turn> <file|->');
}
