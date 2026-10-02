// Start the reviewed production build on 8080, preserving the demo workspace.
// Only this app's own Node server at this working directory may be stopped.
import { spawn } from 'node:child_process';
import { readdir, readFile, readlink, mkdir, writeFile } from 'node:fs/promises';
import { openSync, closeSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const directory = path.join(root, '.data-cache/server');
if (!(await readFile(path.join(root, 'dist/index.html'), 'utf8')).includes('AgroCebada')) throw new Error('Build the app before starting the reviewed version.');
const stopped = [];
for (const entry of await readdir('/proc')) {
  if (!/^\d+$/.test(entry)) continue;
  try {
    const pid = Number(entry);
    const cwd = await readlink(`/proc/${pid}/cwd`);
    if (cwd !== root.replace(/\/$/, '')) continue;
    const args = (await readFile(`/proc/${pid}/cmdline`, 'utf8')).split('\0').filter(Boolean);
    if (!args[0]?.endsWith('node') || !args.slice(1).some(a => a === 'server/index.mjs' || a === path.join(root, 'server/index.mjs'))) continue;
    const env = (await readFile(`/proc/${pid}/environ`, 'utf8')).split('\0');
    const port = env.find(v => v.startsWith('PORT='))?.slice(5) || '8080';
    if (port !== '8080') continue;
    process.kill(pid, 'SIGTERM'); stopped.push(pid);
  } catch (e) { if (!['ENOENT', 'ESRCH', 'EACCES'].includes(e.code)) throw e; }
}
await new Promise(resolve => setTimeout(resolve, 1200));
await mkdir(directory, { recursive: true });
const fd = openSync(path.join(directory, 'runtime.log'), 'a', 0o600);
const child = spawn(process.execPath, [path.join(root, 'server/index.mjs'), '--production'], { cwd: root, detached: true, stdio: ['ignore', fd, fd], env: { ...process.env, HOST: '127.0.0.1', PORT: '8080', STATE_DIR: directory } });
child.unref(); closeSync(fd);
await writeFile(path.join(directory, 'runtime.pid'), String(child.pid), { mode: 0o600 });
let ready = false;
for (let i = 0; i < 50; i++) {
  try { const r = await fetch('http://127.0.0.1:8080/api/health'); const h = await r.json(); if (r.ok && h.model === 'placeholder') { ready = true; break; } } catch {}
  await new Promise(resolve => setTimeout(resolve, 100));
}
if (!ready) throw new Error('Production server did not start; inspect .data-cache/server/runtime.log.');
console.log(JSON.stringify({ url: 'http://localhost:8080', pid: child.pid, stopped, model: 'placeholder', ready }));
