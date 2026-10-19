import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import worker from '../server/worker.mjs';
// @ts-expect-error Native ES modules without type declarations.
import { createApp } from '../server/index.mjs';
import { upsample, runLengths } from '../src/segmentation/masks.ts';

const decode = (runs: number[]) => runs.flatMap((n, i) => Array(n).fill(i % 2));

test('Mask run lengths start with zeros and cover every pixel', () => {
  assert.deepEqual(runLengths(Uint8Array.from([0, 0, 1, 1, 1, 0])), [2, 3, 1]);
  assert.deepEqual(runLengths(Uint8Array.from([1, 1, 0])), [0, 2, 1]);
  assert.deepEqual(runLengths(new Uint8Array(4)), [4]);
  const mask = Uint8Array.from({ length: 999 }, (_, i) => +(Math.sin(i / 7) > .3));
  assert.deepEqual(decode(runLengths(mask)), [...mask]);
});

test('Mask upsampling is bilinear with half-pixel centres, like torch align_corners=False', () => {
  const size = 4, logits = new Float32Array(size * size);
  // Same size: the logits' signs come back unchanged.
  logits.set([-1, 2, -3, 4, 5, -6, 7, -8, -1, -1, 1, 1, 0.5, -0.5, 0.25, -0.25]);
  assert.deepEqual([...upsample(logits, 0, size, size, size)], [...logits].map(v => +(v > 0)));
  // Doubling a left-negative / right-positive split moves the edge to the middle, as torch does.
  const split = new Float32Array(16).map((_, i) => i % 4 < 2 ? -1 : 1);
  const up = upsample(split, 0, 4, 8, 8);
  assert.deepEqual([...up.slice(0, 8)], [0, 0, 0, 0, 1, 1, 1, 1]);
  // The offset picks the k-th of several masks.
  const two = new Float32Array(32); two.fill(1, 16);
  assert.equal(upsample(two, 16, 4, 2, 2).reduce((a, b) => a + b, 0), 4);
  assert.equal(upsample(two, 0, 4, 2, 2).reduce((a, b) => a + b, 0), 0);
});

test('Worker forwards the segmentation crop, proposal, model and model files, and nothing else', async () => {
  const env = { ASSETS: { fetch: async () => new Response('asset') }, SERVICE_TOKEN: 'test-secret', AGROCEBADA_SERVICE: { get: async () => 'https://rig-test.trycloudflare.com' } };
  const stored: string[] = [];
  (globalThis as any).caches = { default: { match: async () => undefined, put: async (r: Request) => { stored.push(new URL(r.url).pathname); } } };
  const seen: { url: string; method: string; bytes: number }[] = [];
  const original = globalThis.fetch;
  globalThis.fetch = async (input: any, options: any) => {
    const url = String(input), bytes = options?.body ? options.body.byteLength : 0; seen.push({ url, method: options?.method, bytes });
    return url.endsWith('.onnx') ? new Response(new Uint8Array(8), { headers: { 'Content-Type': 'application/octet-stream' } }) : Response.json({ ok: true });
  };
  const waits: Promise<unknown>[] = [];
  const call = (pathname: string, init?: RequestInit) => worker.fetch(new Request('https://demo.test' + pathname, init), env, { waitUntil: (p: Promise<unknown>) => waits.push(p) });
  try {
    const post = (body: string) => ({ method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': String(body.length) }, body });
    assert.equal((await call('/api/segmentation/crops', post('{"a":1}'))).status, 200);
    assert.equal((await call('/api/segmentation/model')).status, 200);
    const file = '/api/segmentation/models/sam2.1-tiny-encoder-016997303513ced8.onnx';
    const model = await call(file); assert.equal(model.status, 200); assert.equal(model.headers.get('Content-Type'), 'application/octet-stream');
    await Promise.all(waits); assert.deepEqual(stored, [file]);
    // Masks for a 512 px crop fit; the old 16 KB limit still holds for the crop request.
    const masks = JSON.stringify({ masks: [Array(20000).fill(5)] });
    assert.ok(masks.length > 16384 && masks.length < 262144);
    assert.equal((await call('/api/segmentation/proposals', post(masks))).status, 200);
    assert.equal((await call('/api/segmentation/crops', post(masks))).status, 413);
    assert.equal((await call('/api/segmentation/proposals', post('x'.repeat(262145)))).status, 413);
    // Wrong methods, unknown files, query strings and a JSON body passed off as a model are refused.
    assert.equal((await call('/api/segmentation/crops')).status, 405);
    assert.equal((await call('/api/segmentation/model', post('{}'))).status, 405);
    assert.equal((await call('/api/segmentation/models/other.onnx')).status, 404);
    assert.equal((await call('/api/segmentation/models/sam2.1-tiny-encoder-016997303513ced8.onnx?x=1')).status, 422);
    assert.equal((await call('/api/segmentation/model/../health')).status, 404);
    globalThis.fetch = async () => Response.json({ not: 'a model' });
    assert.equal((await call('/api/segmentation/models/sam2.1-tiny-decoder-e64432ef35862b63.onnx')).status, 503);
    assert.deepEqual(seen.map(s => s.url.replace('https://rig-test.trycloudflare.com', '')), ['/api/segmentation/crops', '/api/segmentation/model', file, '/api/segmentation/proposals']);
  } finally { globalThis.fetch = original; delete (globalThis as any).caches; }
});

test('The app serves only the onnxruntime files the browser model needs, cached for good', async () => {
  const app = await createApp({ stateDir: await mkdtemp(path.join(tmpdir(), 'agro-seg-')) });
  const server = app.listen(0); const base = `http://127.0.0.1:${(server.address() as any).port}`;
  try {
    const { version } = JSON.parse((await import('node:fs')).readFileSync('node_modules/onnxruntime-web/package.json', 'utf8'));
    for (const file of ['ort-wasm-simd-threaded.asyncify.mjs', 'ort-wasm-simd-threaded.asyncify.wasm']) {
      const r = await fetch(`${base}/ort/${version}/${file}`); assert.equal(r.status, 200, file);
      assert.match(r.headers.get('Cache-Control') ?? '', /immutable/); await r.arrayBuffer();
    }
    for (const bad of [`/ort/0.0.1/ort-wasm-simd-threaded.asyncify.wasm`, `/ort/${version}/ort-wasm-simd-threaded.jsep.wasm`, `/ort/${version}/..%2Fpackage.json`, `/ort/${version}/ort.webgpu.min.mjs`])
      assert.equal((await fetch(base + bad)).status, 404, bad);
  } finally { server.closeAllConnections(); server.close(); }
});
