/// <reference lib="webworker" />
// Runs SAM 2.1 tiny in the browser: WebGPU when the adapter is there, WebAssembly otherwise.
// The ONNX graphs come from services/export_sam2_onnx.py; the encoder resizes and normalises.
import * as ort from 'onnxruntime-web/webgpu';
import type { SamFile, SamRequest, SamMessage, Device } from './sam';
import { upsample, runLengths } from './masks';

const post = (message: SamMessage) => (self as unknown as DedicatedWorkerGlobalScope).postMessage(message);
let sessions: Promise<{ encoder: ort.InferenceSession; decoder: ort.InferenceSession; device: Device }> | null = null;

const hex = (buffer: ArrayBuffer) => [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('');

/** One model file, from Cache Storage when it was downloaded before (names carry the hash). */
async function download(file: SamFile, progress: (bytes: number) => void) {
  const cache = typeof caches === 'undefined' ? null : await caches.open('agrocebada-sam').catch(() => null);
  const hit = await cache?.match(file.url);
  if (hit) { progress(file.bytes); return new Uint8Array(await hit.arrayBuffer()); }
  const response = await fetch(file.url);
  if (!response.ok || !response.body) throw new Error('No pudimos descargar el modelo de delimitación.');
  const data = new Uint8Array(file.bytes); const reader = response.body.getReader(); let offset = 0;
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    if (offset + value.length > data.length) throw new Error('El modelo descargado no coincide con la versión publicada.');
    data.set(value, offset); offset += value.length; progress(offset);
  }
  if (offset !== file.bytes || crypto.subtle && hex(await crypto.subtle.digest('SHA-256', data)) !== file.sha256) throw new Error('El modelo descargado no coincide con la versión publicada.');
  await cache?.put(file.url, new Response(data, { headers: { 'Content-Type': 'application/octet-stream' } })).catch(() => undefined);
  return data;
}

async function load(request: SamRequest) {
  const version = ort.env.versions.web;
  ort.env.wasm.wasmPaths = request.runtime === 'cdn' ? `https://cdn.jsdelivr.net/npm/onnxruntime-web@${version}/dist/` : `/ort/${version}/`;
  ort.env.wasm.numThreads = self.crossOriginIsolated ? Math.min(4, navigator.hardwareConcurrency || 1) : 1;
  const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu;
  const adapter = await gpu?.requestAdapter().catch(() => null);
  const total = request.files.encoder.bytes + request.files.decoder.bytes, loaded = { encoder: 0, decoder: 0 };
  const progress = (name: 'encoder' | 'decoder') => (bytes: number) => { loaded[name] = bytes; post({ type: 'progress', id: request.id, stage: 'download', loaded: loaded.encoder + loaded.decoder, total }); };
  const [encoder, decoder] = await Promise.all([download(request.files.encoder, progress('encoder')), download(request.files.decoder, progress('decoder'))]);
  post({ type: 'progress', id: request.id, stage: 'load' });
  const create = (device: Device) => Promise.all([encoder, decoder].map(model => ort.InferenceSession.create(model, { executionProviders: [device], graphOptimizationLevel: 'all' })));
  if (adapter) {
    try { const [e, d] = await create('webgpu'); return { encoder: e, decoder: d, device: 'webgpu' as const }; }
    catch (error) { console.warn('SAM: WebGPU no disponible, se usa WebAssembly.', error); }
  }
  const [e, d] = await create('wasm');
  return { encoder: e, decoder: d, device: 'wasm' as const };
}

async function segment(request: SamRequest) {
  sessions ??= load(request).catch(error => { sessions = null; throw error; });
  const { encoder, decoder, device } = await sessions;
  post({ type: 'progress', id: request.id, stage: 'run', device });
  const { width: w, height: h, image } = request, plane = w * h;
  const chw = new Float32Array(3 * plane);
  for (let i = 0; i < plane; i++) for (let c = 0; c < 3; c++) chw[c * plane + i] = image[i * 3 + c];
  const features = await encoder.run({ image: new ort.Tensor('float32', chw, [1, 3, h, w]) });
  const n = request.points.length;
  const coords = new Float32Array(n * 2); request.points.forEach(([x, y], i) => { coords[i * 2] = x / w * 1024; coords[i * 2 + 1] = y / h * 1024; });
  const out = await decoder.run({ high_res_0: features.high_res_0, high_res_1: features.high_res_1, image_embed: features.image_embed,
    point_coords: new ort.Tensor('float32', coords, [1, n, 2]), point_labels: new ort.Tensor('float32', Float32Array.from(request.labels), [1, n]) });
  const logits = await out.masks.getData() as Float32Array, scores = [...await out.iou.getData() as Float32Array];
  const size = out.masks.dims[3], count = out.masks.dims[1];
  const masks = Array.from({ length: count }, (_, k) => runLengths(upsample(logits, k * size * size, size, w, h)));
  for (const t of [...Object.values(features), ...Object.values(out)]) t.dispose();
  post({ type: 'result', id: request.id, masks, scores, device });
}

self.onmessage = (event: MessageEvent<SamRequest>) => {
  segment(event.data).catch(error => (console.error('SAM:', error), post({ type: 'error', id: event.data.id, message: error instanceof Error && /modelo|descargar/.test(error.message) ? error.message : 'No pudimos ejecutar el modelo de delimitación en este navegador. Dibuja el terreno manualmente.' })));
};
