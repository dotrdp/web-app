// The real in-browser SAM 2.1 model against a real imagery service, on WebGPU (SwiftShader's
// software adapter in headless Chromium) and on the WebAssembly fallback. Needs the imagery
// service and the ONNX files, so it only runs when asked:
//   SEGMENTATION_LIVE=1 [SAM_DEVICE=webgpu] PLAYWRIGHT_BASE_URL=http://127.0.0.1:8081 npx playwright test segmentation-live
// With SEGMENTATION_REFERENCE=<url of an imagery service that still runs SAM on the GPU> and
// AGROCEBADA_SERVICE_TOKEN, each browser proposal is also compared with that service's proposal.
import { test, expect, type Page, type Request } from '@playwright/test';
import { readFileSync } from 'node:fs';

test.skip(process.env.SEGMENTATION_LIVE !== '1', 'Needs the imagery service and the model files');
test.describe.configure({ mode: 'serial' });

type Ring = number[][];
const parcels: { id: string; area: number; ring: Ring }[] = JSON.parse(readFileSync('public/data/parcels.geojson', 'utf8')).features.map((f: any) => {
  const polys: Ring[][] = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  const ring = polys.map(p => p[0]).sort((a, b) => Math.abs(planarArea(b)) - Math.abs(planarArea(a)))[0];
  return { id: f.properties.id, area: f.properties.area, ring };
});
function planarArea(ring: Ring) { let a = 0; for (let i = 0; i < ring.length - 1; i++) a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]; return a / 2; }
function inside([x, y]: number[], ring: Ring) { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; }
/** The interior point farthest from the boundary (a 40×40 search), so the click lands well inside. */
function interior(ring: Ring) {
  const xs = ring.map(p => p[0]), ys = ring.map(p => p[1]); let best = [0, 0], bestD = -1;
  for (let i = 1; i < 40; i++) for (let j = 1; j < 40; j++) {
    const p = [Math.min(...xs) + (Math.max(...xs) - Math.min(...xs)) * i / 40, Math.min(...ys) + (Math.max(...ys) - Math.min(...ys)) * j / 40];
    if (!inside(p, ring)) continue;
    let d = Infinity; for (let k = 0; k < ring.length - 1; k++) d = Math.min(d, segmentDistance(p, ring[k], ring[k + 1]));
    if (d > bestD) { bestD = d; best = p; }
  }
  return best;
}
function segmentDistance(p: number[], a: number[], b: number[]) { const k = Math.cos(p[1] * Math.PI / 180), dx = (b[0] - a[0]) * k, dy = b[1] - a[1], t = Math.max(0, Math.min(1, (((p[0] - a[0]) * k) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot((p[0] - a[0]) * k - t * dx, p[1] - a[1] - t * dy); }
/** Intersection over union of two rings, by sampling a 300×300 grid over both. */
function iou(a: Ring, b: Ring) {
  const all = [...a, ...b], x0 = Math.min(...all.map(p => p[0])), x1 = Math.max(...all.map(p => p[0])), y0 = Math.min(...all.map(p => p[1])), y1 = Math.max(...all.map(p => p[1]));
  let both = 0, either = 0;
  for (let i = 0; i < 300; i++) for (let j = 0; j < 300; j++) { const p = [x0 + (x1 - x0) * (i + .5) / 300, y0 + (y1 - y0) * (j + .5) / 300], ia = inside(p, a), ib = inside(p, b); both += +(ia && ib); either += +(ia || ib); }
  return either ? both / either : 0;
}

const modelTraffic = (url: string) => /\/api\/segmentation\/|\/ort\/|\.onnx(\?|$)/.test(url);

async function login(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Usar cuenta de prueba' }).click();
  await page.getByRole('button', { name: 'Entrar a AgroCebada' }).click();
  await expect(page.getByTestId('map')).toBeVisible();
}
async function openParcel(page: Page, id: string) {
  await page.getByRole('button', { name: /Buscar o ejecutar un comando/ }).click();
  await page.getByRole('combobox', { name: 'Buscar parcela, municipio, coordenadas o comando' }).fill(id);
  await page.keyboard.press('Enter');
}
const toolbarButton = (page: Page) => page.getByRole('toolbar', { name: 'Herramientas del mapa' }).getByRole('button', { name: 'Delimitar con IA', exact: true });
/** Clicks the map at a coordinate, from the view the map publishes after each move. */
async function clickAt(page: Page, [lon, lat]: number[]) {
  const map = page.getByTestId('map');
  let view = ''; await expect.poll(async () => { const v = await map.getAttribute('data-view'); const same = v === view; view = v ?? ''; return same && !!v; }, { intervals: [400] }).toBe(true);
  const [clon, clat, res] = view.split(',').map(Number), R = 6378137, merc = (lo: number, la: number) => [R * lo * Math.PI / 180, R * Math.log(Math.tan(Math.PI / 4 + la * Math.PI / 360))];
  const [x, y] = merc(lon, lat), [cx, cy] = merc(clon, clat), box = (await map.boundingBox())!;
  const px = box.x + box.width / 2 + (x - cx) / res, py = box.y + box.height / 2 - (y - cy) / res;
  const target = await page.evaluate(([a, b]) => document.elementFromPoint(a, b)?.tagName, [px, py]);
  expect(target, 'the click point must be on the map, not under a panel').toBe('CANVAS');
  await page.mouse.click(px, py);
}
type Outcome = { error: string } | { geometry: { coordinates: Ring[] }; provenance: any };
async function proposal(page: Page): Promise<Outcome> {
  await expect(page.getByRole('button', { name: 'Guardar parcela', exact: true }).or(page.locator('.delineation-card [role=alert]'))).toBeVisible({ timeout: 240_000 });
  const error = page.locator('.delineation-card [role=alert]');
  if (await error.count()) return { error: await error.innerText() };
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar propuesta y correcciones' }).click();
  const data = JSON.parse(readFileSync((await (await download).path())!, 'utf8'));
  return { geometry: data.geometry, provenance: data.properties };
}
async function reference(prompts: unknown, body: any) {
  const url = process.env.SEGMENTATION_REFERENCE; if (!url) return null;
  const r = await fetch(url + '/api/segmentation/proposals', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-AgroCebada-Service-Token': process.env.AGROCEBADA_SERVICE_TOKEN ?? '' }, body: JSON.stringify({ requestId: 'reference', imageryVersion: body.imageryVersion, month: body.month, prompts }) });
  return r.ok ? (await r.json()).geometry.coordinates[0] as Ring : null;
}

// SAM_DEVICE=webgpu runs it on SwiftShader's WebGPU adapter; otherwise there is no adapter and
// the model falls back to WebAssembly.
const device = process.env.SAM_DEVICE === 'webgpu' ? 'webgpu' as const : 'wasm' as const;
test.use({ launchOptions: { args: device === 'webgpu' ? ['--enable-unsafe-webgpu', '--enable-unsafe-swiftshader', '--use-webgpu-adapter=swiftshader'] : [] }, channel: 'chromium' });
{
  test.describe(device, () => {

    test('Nothing about the model loads until Delimitar con IA is clicked on the toolbar', async ({ page }) => {
      const traffic: string[] = [], workers: string[] = [];
      page.on('request', r => { if (modelTraffic(r.url())) traffic.push(new URL(r.url()).pathname); });
      page.on('worker', w => workers.push(w.url()));
      await login(page);
      // Browse: layers, a parcel, the dashboard, the launcher's commands.
      await page.getByRole('switch', { name: 'Vegetación', exact: true }).click();
      await openParcel(page, 'AGC_004');
      await page.getByRole('button', { name: /Buscar o ejecutar un comando/ }).click();
      const search = page.getByRole('combobox', { name: 'Buscar parcela, municipio, coordenadas o comando' });
      await search.fill('>dibujar'); await expect(page.getByRole('option', { name: /Dibujar parcela/ })).toBeVisible();
      await search.fill('>'); await expect(page.getByRole('option').first()).toBeVisible();
      await expect(page.getByRole('option', { name: /Delimitar con IA/ })).toHaveCount(0);
      await search.fill('>delimitar'); await expect(page.getByRole('option')).toHaveCount(0);
      await page.keyboard.press('Escape');
      await page.mouse.click(700, 500);
      await page.waitForTimeout(1500);
      expect(traffic, 'no segmentation, model or runtime request before the toolbar').toEqual([]);
      expect(workers.filter(w => /sam/.test(w)), 'no model worker before the toolbar').toEqual([]);
      // The toolbar click only arms the tool; the download starts with the first click on a field.
      await toolbarButton(page).click();
      await page.waitForTimeout(800);
      expect(traffic).toEqual([]);
      const parcel = parcels.find(p => p.id === 'AGC_004')!;
      await openParcel(page, parcel.id); await toolbarButton(page).click();
      await clickAt(page, interior(parcel.ring));
      await expect.poll(() => traffic.filter(t => t.endsWith('.onnx')).length, { timeout: 60_000 }).toBe(2);
      expect(traffic[0]).toBe('/api/segmentation/crops');
      const result = await proposal(page);
      expect('geometry' in result, JSON.stringify(result)).toBe(true);
    });

    test('Real proposals for small, medium and large parcels; cached model; exclusion points', async ({ page }) => {
      test.setTimeout(900_000);
      const crops: any[] = [], onnx: string[] = [], timing: Record<string, number> = {};
      page.on('request', (r: Request) => {
        const path = new URL(r.url()).pathname;
        if (path === '/api/segmentation/crops') { crops.push(r.postDataJSON()); timing.start ??= Date.now(); }
        if (path.endsWith('.onnx')) onnx.push(path);
      });
      await login(page);
      const sorted = [...parcels].sort((a, b) => a.area - b.area);
      const chosen = [sorted[Math.floor(sorted.length * .15)], sorted[Math.floor(sorted.length * .5)], sorted[Math.floor(sorted.length * .9)], sorted.at(-1)!];
      const rows: string[] = [];
      for (const [k, parcel] of chosen.entries()) {
        await openParcel(page, parcel.id); await toolbarButton(page).click();
        const before = crops.length, t0 = Date.now(); const point = interior(parcel.ring);
        await clickAt(page, point);
        const result = await proposal(page), seconds = (Date.now() - t0) / 1000;
        if (!('geometry' in result)) { rows.push(`${parcel.id} ${parcel.area} ha: ${result.error}`); await page.getByRole('button', { name: 'Cancelar delimitación' }).click(); continue; }
        const ring = result.geometry.coordinates[0], p = result.provenance;
        expect(p.device).toBe(device);
        expect(inside(point, ring), 'the proposal covers the click').toBe(true);
        expect(p.saved).toBe(false);
        const vsParcel = iou(ring, parcel.ring), ref = await reference(p.prompts, crops[before]);
        const vsGpu = ref ? iou(ring, ref) : null;
        rows.push(`${parcel.id} ${parcel.area} ha: ${seconds.toFixed(1)} s, crops ${crops.length - before} (side ${crops.at(-1).side ?? 'first'}), score ${p.score.toFixed(3)}, IoU vs registered parcel ${vsParcel.toFixed(2)}${vsGpu == null ? '' : `, IoU vs server GPU ${vsGpu.toFixed(3)}`}`);
        if (vsGpu != null) expect(vsGpu, `${parcel.id}: same proposal as the GPU service`).toBeGreaterThan(.9);
        if (k === 0) expect(onnx.length, 'the model downloads once').toBe(2);
        if (k > 0) expect(onnx.length, 'later parcels reuse the model').toBe(2);
        // An exclusion point near the edge of the first proposal: the new proposal leaves it out, or says why not.
        if (k === 1) {
          const xs = ring.map(q => q[0]), ys = ring.map(q => q[1]);
          const outside = [point[0] + (Math.max(...xs) - point[0]) * .8, point[1]];
          await page.getByRole('button', { name: '− Excluir', exact: true }).click();
          await clickAt(page, outside);
          const second = await proposal(page);
          if ('geometry' in second) { expect(inside(outside, second.geometry.coordinates[0])).toBe(false); expect(inside(point, second.geometry.coordinates[0])).toBe(true); rows.push(`  exclusion: honoured, ${second.provenance.prompts.length} points`); }
          else { expect(second.error).toMatch(/respetan|ambiguo|válido/); rows.push(`  exclusion: refused with "${second.error}"`); }
        }
        await page.getByRole('button', { name: 'Cancelar delimitación' }).click();
      }
      // A reload keeps the model in Cache Storage: nothing is downloaded again.
      await page.reload(); await expect(page.getByTestId('map')).toBeVisible();
      const again = parcels.find(p => p.id === 'AGC_004')!;
      await openParcel(page, again.id); await toolbarButton(page).click(); await clickAt(page, interior(again.ring));
      expect('geometry' in await proposal(page)).toBe(true);
      expect(onnx.length, 'no model download after a reload').toBe(2);
      console.log(`\n[${device}]\n` + rows.join('\n'));
    });

    test('Cancelling during the first download keeps the download; the next try finishes', async ({ page }) => {
      test.setTimeout(600_000);
      const onnx: string[] = []; page.on('requestfinished', r => { if (r.url().endsWith('.onnx')) onnx.push(r.url()); });
      await login(page);
      const parcel = parcels.find(p => p.id === 'AGC_061')!;
      await openParcel(page, parcel.id); await toolbarButton(page).click(); await clickAt(page, interior(parcel.ring));
      await expect(page.getByRole('status').filter({ hasText: /Descargando el modelo|Preparando|Delimitando/ })).toBeVisible({ timeout: 60_000 });
      await page.getByRole('button', { name: 'Cancelar delimitación' }).click();
      await expect(page.locator('.delineation-card')).toHaveCount(0);
      await openParcel(page, parcel.id); await toolbarButton(page).click(); await clickAt(page, interior(parcel.ring));
      const result = await proposal(page);
      expect('geometry' in result, JSON.stringify(result)).toBe(true);
      expect(onnx.length, 'each file downloaded once').toBe(2);
    });
  });
}
