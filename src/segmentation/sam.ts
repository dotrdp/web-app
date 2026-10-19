// The parcel-delineation model runs in the visitor's browser (src/segmentation/sam.worker.ts).
// The imagery service supplies the satellite crop and checks the masks the browser returns.
import { IS_DEMO, api } from '@/lib';

export type Device = 'webgpu' | 'wasm';
export interface SamFile { file: string; url: string; sha256: string; bytes: number }
export interface SamModel { model: string; runtime: string; files: { encoder: SamFile; decoder: SamFile } }
/** POST /api/segmentation/crops: the square RGB crop (base64, row-major RGB bytes) and the points in its pixels. */
export interface SegmentationCrop { cropId: string; requestId: string; side: number; width: number; height: number; points: number[][]; labels: number[]; image: string }
export interface SamRequest { id: number; runtime: 'cdn' | 'self'; files: SamModel['files']; image: Uint8Array; width: number; height: number; points: number[][]; labels: number[] }
export type SamProgress = { stage: 'download'; loaded: number; total: number } | { stage: 'load' } | { stage: 'run'; device: Device };
export type SamMessage = ({ type: 'progress'; id: number } & SamProgress) | { type: 'result'; id: number; masks: number[][]; scores: number[]; device: Device } | { type: 'error'; id: number; message: string };
export interface SamResult { masks: number[][]; scores: number[]; device: Device }

let worker: Worker | null = null, model: Promise<SamModel> | null = null, nextId = 0;
const pending = new Map<number, { resolve: (r: SamResult) => void; reject: (e: Error) => void; progress: (p: SamProgress) => void }>();

function start() {
  worker = new Worker(new URL('./sam.worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (event: MessageEvent<SamMessage>) => {
    const m = event.data, job = pending.get(m.id); if (!job) return;
    if (m.type === 'progress') { const { type: _t, id: _i, ...progress } = m; job.progress(progress as SamProgress); return; }
    pending.delete(m.id);
    if (m.type === 'result') job.resolve({ masks: m.masks, scores: m.scores, device: m.device }); else job.reject(new Error(m.message));
  };
  worker.onerror = () => { for (const job of pending.values()) job.reject(new Error('No pudimos ejecutar el modelo de delimitación en este navegador. Dibuja el terreno manualmente.')); pending.clear(); worker?.terminate(); worker = null; };
  return worker;
}

/** Whether this browser already keeps both model files (checks Cache Storage only; nothing is fetched). */
export async function modelCached() {
  try { const keys = await (await caches.open('agrocebada-sam')).keys(); return keys.filter(k => k.url.endsWith('.onnx')).length >= 2; }
  catch { return false; }
}

/** Runs the model on one crop. The first call downloads the model (≈64 MB, kept by the browser). */
export async function segmentCrop(crop: SegmentationCrop, progress: (p: SamProgress) => void): Promise<SamResult> {
  model ??= api<SamModel>('/api/segmentation/model').catch(error => { model = null; throw error; });
  const { files } = await model;
  const image = Uint8Array.from(atob(crop.image), c => c.charCodeAt(0));
  if (image.length !== crop.width * crop.height * 3) throw new Error('La imagen de delimitación no es válida.');
  const id = ++nextId, request: SamRequest = { id, runtime: IS_DEMO ? 'cdn' : 'self', files, image, width: crop.width, height: crop.height, points: crop.points, labels: crop.labels };
  return new Promise<SamResult>((resolve, reject) => { pending.set(id, { resolve, reject, progress }); (worker ?? start()).postMessage(request, [image.buffer]); });
}
