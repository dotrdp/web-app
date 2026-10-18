// Milli conversations, one per browser tab, stored as append-only JSON files under
// stateDir/milli/. A thread belongs to the login session that created it.
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

const THREAD_ID = /^t_[a-f0-9-]{36}$/;

export function createThreads(dir) {
  const ready = mkdir(dir, { recursive: true });
  const cache = new Map();
  const file = id => path.join(dir, `${id}.json`);
  let writes = Promise.resolve();

  async function get(id) {
    if (!THREAD_ID.test(String(id))) return null;
    if (cache.has(id)) return cache.get(id);
    try { const thread = JSON.parse(await readFile(file(id), 'utf8')); cache.set(id, thread); return thread; }
    catch (e) { if (e.code === 'ENOENT') return null; throw e; }
  }
  function create({ sessionHash, screenId }) {
    const thread = { id: `t_${randomUUID()}`, sessionHash, screenId, createdAt: new Date().toISOString(), messages: [], attachments: {}, run: null, pending: null, feedback: [] };
    cache.set(thread.id, thread);
    return thread;
  }
  async function save(thread) {
    await ready;
    const body = JSON.stringify(thread);
    writes = writes.catch(() => {}).then(async () => { await writeFile(file(thread.id) + '.tmp', body, { mode: 0o600 }); await rename(file(thread.id) + '.tmp', file(thread.id)); });
    return writes;
  }
  return { get, create, save };
}
