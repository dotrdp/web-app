// assistant-ui's LocalRuntime talking to Milli's agent on the server. Each run POSTs the user's
// message (or the answer to an export request) to /api/milli/chat and turns the server-sent events
// into message parts: reasoning, narration text and tool calls with their results and timing.
// request_export is a human tool: the run pauses (requires-action) until the approval card adds a
// result, and the continuation run sends that decision to the server.
import { useSyncExternalStore } from 'react';
import type { AttachmentAdapter, ChatModelAdapter, ChatModelRunResult, CompleteAttachment, PendingAttachment, ThreadAssistantMessagePart } from '@assistant-ui/react';
import { screenId } from './live';
import { milli } from './store';

export const APPROVAL_TOOL = 'request_export';
export const END_TOOL = 'finish_task';
export const LIMITS = { files: 3, bytes: 2 * 1024 * 1024 };

/** The server's conversation id for this tab (memory only: a reload starts a new conversation). */
let threadId: string | null = null;
export const getThreadId = () => threadId;
export const resetThread = () => { threadId = null; };

// What the server did with an approved export (the card shows it); the tool part keeps the user's decision.
const outcomes = new Map<string, { result: unknown; isError: boolean }>();
const listeners = new Set<() => void>();
let version = 0;
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export const getOutcome = (id: string) => outcomes.get(id);
/** Re-renders when an export outcome arrives. */
export const useOutcomeVersion = () => useSyncExternalStore(subscribe, () => version);
const setOutcome = (id: string, value: { result: unknown; isError: boolean }) => { outcomes.set(id, value); version++; listeners.forEach(l => l()); };
/** Decisions already sent, so a continuation never sends one twice. */
const answered = new Set<string>();

type ServerEvent =
  | { type: 'thread'; id: string }
  | { type: 'reasoning' | 'text'; delta: string }
  | { type: 'tool-call'; id: string; name: string; args: Record<string, unknown>; at: number }
  | { type: 'tool-start'; id: string; name: string; at: number }
  | { type: 'tool-result'; id: string; name: string; result: string; isError: boolean; at: number }
  | { type: 'approval'; id: string; name: string; args: unknown }
  | { type: 'answer'; text: string }
  | { type: 'error'; message: string }
  | { type: 'done'; status: 'finished' | 'requires-action' | 'cancelled' | 'incomplete' | 'error' };

const parse = (text: string) => { try { return JSON.parse(text); } catch { return text; } };
type Part = ThreadAssistantMessagePart & Record<string, unknown>;

async function* events(response: Response, signal: AbortSignal): AsyncGenerator<ServerEvent> {
  const reader = response.body!.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  try {
    while (!signal.aborted) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value;
      let cut;
      while ((cut = buffer.indexOf('\n\n')) >= 0) {
        const chunk = buffer.slice(0, cut); buffer = buffer.slice(cut + 2);
        const data = chunk.split('\n').filter(l => l.startsWith('data: ')).map(l => l.slice(6)).join('\n');
        if (data) yield JSON.parse(data);
      }
    }
  } finally { reader.releaseLock(); }
}

export const milliAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal, unstable_getMessage }) {
    // A continuation after the approval card: send the user's decision instead of a new message.
    const current = unstable_getMessage();
    const decided = current.content.find(p => p.type === 'tool-call' && p.toolName === APPROVAL_TOOL && p.result !== undefined && !answered.has(p.toolCallId));
    let body: object;
    if (decided && decided.type === 'tool-call') {
      answered.add(decided.toolCallId);
      body = { screenId, threadId, approval: { toolCallId: decided.toolCallId, approved: (decided.result as { approved?: boolean })?.approved === true } };
    } else {
      const user = [...messages].reverse().find(m => m.role === 'user');
      const text = user?.content.map(p => p.type === 'text' ? p.text : '').join('\n').trim() ?? '';
      const attachments = user?.role === 'user' ? user.attachments.map(a => ({ name: a.name, content: csvTexts.get(a.id) ?? '' })) : [];
      body = { screenId, threadId, message: { text, attachments } };
    }

    milli.setChatRunning(true);
    try {
      const response = await fetch('/api/milli/chat', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: abortSignal });
      if (!response.ok || !response.body) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error ?? 'Milli no está disponible ahora mismo.');
      }
      const parts: Part[] = [];
      const custom: Record<string, unknown> = {};
      const byId = new Map<string, number>();
      const close = () => { const last = parts.at(-1); if (last && (last.type === 'reasoning' || last.type === 'text') && last.timing && !(last.timing as { completedAt?: number }).completedAt) parts[parts.length - 1] = { ...last, timing: { ...(last.timing as object), completedAt: Date.now() } } as Part; };
      const snapshot = (status?: ChatModelRunResult['status']): ChatModelRunResult => ({ content: [...parts] as ThreadAssistantMessagePart[], metadata: { custom: { ...custom } }, ...(status ? { status } : {}) });

      for await (const e of events(response, abortSignal)) {
        if (e.type === 'thread') { threadId = e.id; continue; }
        if (e.type === 'reasoning' || e.type === 'text') {
          const last = parts.at(-1);
          if (last?.type === e.type && !(last.timing as { completedAt?: number } | undefined)?.completedAt) parts[parts.length - 1] = { ...last, text: (last as { text: string }).text + e.delta } as Part;
          else { close(); parts.push({ type: e.type, text: e.delta, timing: { startedAt: Date.now() } } as Part); }
        } else if (e.type === 'tool-call') {
          close();
          byId.set(e.id, parts.length);
          parts.push({ type: 'tool-call', toolCallId: e.id, toolName: e.name, args: e.args, argsText: JSON.stringify(e.args) } as Part);
        } else if (e.type === 'tool-start') {
          const i = byId.get(e.id); if (i != null) parts[i] = { ...parts[i], timing: { startedAt: Date.now() } } as Part;
        } else if (e.type === 'tool-result') {
          const i = byId.get(e.id), result = parse(e.result);
          if (i == null) { setOutcome(e.id, { result, isError: e.isError }); continue; } // an approved export from the earlier run
          const ended = Date.now(), started = (parts[i].timing as { startedAt?: number } | undefined)?.startedAt ?? ended;
          parts[i] = { ...parts[i], result, isError: e.isError, timing: { startedAt: started, completedAt: ended } } as Part;
        } else if (e.type === 'approval') {
          custom.awaitingApproval = e.id;
        } else if (e.type === 'answer') {
          custom.answer = e.text;
        } else if (e.type === 'error') {
          custom.error = e.message;
        } else if (e.type === 'done') {
          close();
          custom.outcome = e.status;
          if (e.status === 'requires-action') { yield snapshot({ type: 'requires-action', reason: 'tool-calls' }); return; }
          if (e.status === 'finished') { yield snapshot({ type: 'complete', reason: 'stop' }); return; }
          if (e.status === 'cancelled') { yield snapshot({ type: 'incomplete', reason: 'cancelled' }); return; }
          yield snapshot({ type: 'incomplete', reason: e.status === 'error' ? 'error' : 'other' }); return;
        }
        yield snapshot();
      }
      close();
      yield snapshot(abortSignal.aborted ? { type: 'incomplete', reason: 'cancelled' } : { type: 'incomplete', reason: 'other' });
    } finally {
      milli.setChatRunning(false);
    }
  },
};

// ── CSV-only attachments ─────────────────────────────────────────────────────────────────────────
/** CSV text per attachment id; sent with the message (the server parses and keeps it for the model). */
const csvTexts = new Map<string, string>();
export const isCsv = (file: { name: string; type?: string }) => /\.csv$/i.test(file.name) && (!file.type || /csv|text\/plain|excel/i.test(file.type));
/** Why a file can't be attached, in words the user sees (null when it can). */
export function rejectReason(file: File, count: number) {
  if (!isCsv(file)) return /^image\//.test(file.type) ? `«${file.name}» es una imagen. Milli solo acepta archivos CSV.` : `«${file.name}» no es un CSV. Milli solo acepta archivos CSV.`;
  if (file.size > LIMITS.bytes) return `«${file.name}» pesa más de 2 MB.`;
  if (count >= LIMITS.files) return `Puedes adjuntar hasta ${LIMITS.files} archivos CSV por mensaje.`;
  return null;
}
/** A first look at the CSV for its chip: columns and rows (the server parses it for real). */
export function csvSummary(text: string) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter(l => l.trim());
  const header = lines[0] ?? '', delimiter = (header.match(/;/g)?.length ?? 0) > (header.match(/,/g)?.length ?? 0) ? ';' : ',';
  return { columns: header ? header.split(delimiter).length : 0, rows: Math.max(0, lines.length - 1) };
}
const summaries = new Map<string, { columns: number; rows: number }>();
export const attachmentSummary = (id: string) => summaries.get(id);

export class CsvAttachmentAdapter implements AttachmentAdapter {
  accept = '.csv,text/csv';
  async add({ file }: { file: File }): Promise<PendingAttachment> {
    if (!isCsv(file)) throw new Error(`«${file.name}» no es un CSV.`);
    return { id: crypto.randomUUID(), type: 'document', name: file.name, contentType: 'text/csv', file, status: { type: 'requires-action', reason: 'composer-send' } };
  }
  async send(attachment: PendingAttachment): Promise<CompleteAttachment> {
    const text = await attachment.file.text();
    csvTexts.set(attachment.id, text); summaries.set(attachment.id, csvSummary(text));
    const s = summaries.get(attachment.id)!;
    return { ...attachment, status: { type: 'complete' }, content: [{ type: 'text', text: `[CSV adjunto: ${attachment.name} · ${s.rows} filas · ${s.columns} columnas]` }] };
  }
  async remove() {}
}
