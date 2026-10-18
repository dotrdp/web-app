// Relay model (development only, MILLI_MODEL=relay): instead of calling a provider, each turn is
// written to a file and the loop waits for a reply file, so a person or an outside agent can act
// as Milli's model through the real chat, MCP tools and screen. scripts/milli-relay.mjs reads and
// answers the turns.
//
//   <dir>/turn-<n>.json        { system, messages, tools, screenId, attachments }   (written here)
//   <dir>/turn-<n>.reply.json  { reasoning?, text?, tool_calls?: [{ name, args }] } (written by the relay)
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

export function createRelayModel({ dir, pace = 25, timeoutMs = 15 * 60_000 } = {}) {
  let turn = 0;
  const sleep = (ms, signal) => new Promise(r => { const t = setTimeout(r, ms); signal?.addEventListener('abort', () => { clearTimeout(t); r(); }, { once: true }); });
  return {
    name: 'relay',
    async *stream({ system, messages, tools, signal, context }) {
      await mkdir(dir, { recursive: true });
      const n = ++turn, request = path.join(dir, `turn-${n}.json`), replyFile = path.join(dir, `turn-${n}.reply.json`);
      await writeFile(request, JSON.stringify({ turn: n, screenId: context?.screenId, system, messages, tools, attachments: Object.entries(context?.attachments ?? {}).map(([id, a]) => ({ id, name: a.name, columns: a.columns, rows: a.rows?.length })) }, null, 1));
      let reply = null;
      for (const started = Date.now(); !signal?.aborted && Date.now() - started < timeoutMs;) {
        try { reply = JSON.parse(await readFile(replyFile, 'utf8')); break; } catch { await sleep(250, signal); }
      }
      await rm(request, { force: true }); await rm(replyFile, { force: true });
      if (!reply) return;
      // Stream like a model: thinking and text word by word, then the tool calls.
      for (const kind of ['reasoning', 'text']) {
        for (const word of String(reply[kind] ?? '').split(/(?<=\s)/).filter(Boolean)) {
          if (signal?.aborted) return;
          yield { type: kind, delta: word };
          await sleep(pace, signal);
        }
      }
      for (const call of reply.tool_calls ?? []) {
        if (!tools.some(t => t.name === call.name)) throw new Error(`Relay: unknown tool ${call.name}`);
        yield { type: 'tool_call', name: call.name, args: call.args ?? {} };
      }
    },
  };
}
