// Live channel between the server and each open tab ("screen"). A tab picks a random screen id,
// opens GET /api/live?screen=ID (server-sent events) and answers commands with POST
// /api/live/:screen/reply. A screen belongs to the login session that opened it: only runs started
// by that session can command it, and nobody else can claim its id.
import { randomUUID } from 'node:crypto';

export const SCREEN_ID = /^[A-Za-z0-9-]{16,64}$/;
const HEARTBEAT_MS = 15_000;

export function createLive({ timeoutMs = 8_000 } = {}) {
  /** screenId -> { sessionHash, res, pending: Map<cmdId, {resolve, timer}>, following, connectedAt } */
  const screens = new Map();

  function connect(req, res) {
    const id = String(req.query.screen ?? '');
    if (!SCREEN_ID.test(id)) return res.status(400).json({ error: 'Identificador de pantalla no válido.' });
    const existing = screens.get(id);
    if (existing && existing.sessionHash !== req.sessionHash) return res.status(403).json({ error: 'Esta pantalla pertenece a otra sesión.' });
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.write('retry: 2000\n\n');
    const screen = existing ?? { sessionHash: req.sessionHash, pending: new Map(), following: true, connectedAt: Date.now() };
    screen.res?.end();
    screen.res = res;
    screens.set(id, screen);
    send(screen, { type: 'hello', screen: id });
    const beat = setInterval(() => res.write(': ping\n\n'), HEARTBEAT_MS);
    req.on('close', () => {
      clearInterval(beat);
      if (screen.res !== res) return; // replaced by a reconnect
      screen.res = null;
      // Keep the entry briefly so a reconnect keeps ownership; pending commands fail now.
      for (const [cmdId, p] of screen.pending) { clearTimeout(p.timer); p.resolve({ ok: false, error: 'La pantalla se desconectó.' }); screen.pending.delete(cmdId); }
      setTimeout(() => { if (!screen.res && screens.get(id) === screen) screens.delete(id); }, 60_000);
    });
  }

  function send(screen, event) { screen.res?.write(`data: ${JSON.stringify(event)}\n\n`); }

  function reply(req, res) {
    const screen = screens.get(req.params.screen);
    if (!screen || screen.sessionHash !== req.sessionHash) return res.status(404).json({ error: 'Pantalla no encontrada.' });
    const { cmdId, ok, result, error, following } = req.body ?? {};
    if (typeof following === 'boolean') screen.following = following;
    if (cmdId) {
      const p = screen.pending.get(cmdId);
      if (p) { clearTimeout(p.timer); screen.pending.delete(cmdId); p.resolve(ok ? { ok: true, result } : { ok: false, error: String(error ?? 'La pantalla no pudo hacerlo.') }); }
    }
    res.json({ ok: true });
  }

  /** Send a command and wait for the screen's answer. Never throws: failures come back as {ok:false}. */
  function command(screenId, sessionHash, type, args = {}, { timeout = timeoutMs } = {}) {
    const screen = screens.get(screenId);
    if (!screen || screen.sessionHash !== sessionHash) return Promise.resolve({ ok: false, error: 'La pantalla no está conectada a esta sesión.' });
    if (!screen.res) return Promise.resolve({ ok: false, error: 'La pantalla se desconectó.' });
    const cmdId = randomUUID();
    return new Promise(resolve => {
      const timer = setTimeout(() => { screen.pending.delete(cmdId); resolve({ ok: false, error: 'La pantalla no respondió a tiempo.' }); }, timeout);
      screen.pending.set(cmdId, { resolve, timer });
      send(screen, { type: 'command', cmdId, command: type, args });
    });
  }

  /** Fire-and-forget event (task progress, animations). */
  function notify(screenId, sessionHash, event) {
    const screen = screens.get(screenId);
    if (screen && screen.sessionHash === sessionHash) send(screen, event);
  }

  const owns = (screenId, sessionHash) => screens.get(screenId)?.sessionHash === sessionHash;
  const connected = (screenId, sessionHash) => owns(screenId, sessionHash) && !!screens.get(screenId).res;
  return { connect, reply, command, notify, owns, connected, screens };
}
