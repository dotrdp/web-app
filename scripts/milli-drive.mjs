// Drives Milli's MCP tools against a real, logged-in browser tab, one call at a time, and checks the
// screen after each step (the DOM and get_screen_state). Starts its own server on PORT (8084) with a
// throwaway state dir, so it never touches the dev server or real notes.
//
//   node scripts/milli-drive.mjs            # headless; screenshots in $SHOTS (default /tmp/milli-drive)
//   HEADED=1 node scripts/milli-drive.mjs   # watch it
//
// request_export is called directly here: the user's approval lives in the agent loop (covered by
// tests/milli.test.ts and the e2e test), not in the MCP server.
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createApp } from '../server/index.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 8084), shots = process.env.SHOTS || '/tmp/milli-drive';
const browserPath = '/home/rd/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
await mkdir(shots, { recursive: true });

const app = await createApp({ stateDir: await mkdtemp(path.join(tmpdir(), 'milli-drive-')) });
const server = createServer(app);
const { createServer: createVite } = await import('vite');
const vite = await createVite({ root, server: { middlewareMode: true, hmr: { server } }, appType: 'spa', logLevel: 'error' });
app.use(vite.middlewares);
await new Promise(r => server.listen(port, '127.0.0.1', r));

const browser = await chromium.launch({ headless: !process.env.HEADED, executablePath: process.env.CHROMIUM_PATH || (existsSync(browserPath) ? browserPath : undefined) });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true })).newPage();
const results = [];
let failed = 0, n = 0;
const close = async () => { await browser.close(); await vite.close(); server.close(); };

try {
  await page.goto(`http://127.0.0.1:${port}/`);
  await page.getByRole('button', { name: 'Usar cuenta de prueba' }).click();
  await page.getByRole('button', { name: 'Entrar a AgroCebada' }).click();
  await page.getByTestId('map').and(page.locator('[data-parcel-count="197"]')).waitFor({ timeout: 30_000 });

  // The tab registers itself on the live channel; take its screen id like the chat does.
  const { live, connectAgent } = app.locals.milli;
  for (let i = 0; i < 50 && ![...live.screens.values()].some(s => s.res); i++) await page.waitForTimeout(100);
  const [screenId, screen] = [...live.screens].find(([, s]) => s.res) ?? [];
  if (!screenId) throw new Error('The tab never connected to /api/live.');
  const { client, finished } = await connectAgent({ screenId, sessionHash: screen.sessionHash });
  console.log(`screen ${screenId}\n`);

  /** One MCP call, then checks against the screen; logs and screenshots every step. */
  async function step(label, name, args, check, { refused = false } = {}) {
    const started = Date.now();
    const raw = await client.callTool({ name, arguments: { screen_id: screenId, ...args } });
    let result; try { result = JSON.parse(raw.content[0].text); } catch { result = raw.content[0]?.text; }
    let problem = refused ? (raw.isError ? null : 'should have been refused') : raw.isError ? `tool error: ${raw.content[0]?.text}` : null;
    if (!problem && check) try { await check(result); } catch (e) { problem = e.message; }
    const file = path.join(shots, `${String(++n).padStart(2, '0')}-${name}.png`);
    await page.screenshot({ path: file });
    if (problem) failed++;
    results.push({ label, name, ms: Date.now() - started, ok: !problem });
    console.log(`${problem ? '✗' : '✓'} ${label.padEnd(58)} ${String(Date.now() - started).padStart(5)} ms${problem ? `\n    ${problem}` : ''}`);
    return result;
  }
  const expect = (cond, message) => { if (!cond) throw new Error(message); };
  const state = async sections => JSON.parse((await client.callTool({ name: 'get_screen_state', arguments: { screen_id: screenId, sections } })).content[0].text);
  const visible = async (locator, what) => { try { await locator.first().waitFor({ state: 'visible', timeout: 4000 }); } catch { throw new Error(`${what} is not on screen`); } };

  // ── Conversation 1: NDVI of the reserved parcels in Calpulalpan, noted and exported ───────────
  console.log('1 · NDVI de julio 2025 en Calpulalpan, anotado y exportado');
  await step('a wrong screen id is refused', 'navigate', { screen_id: 'x'.repeat(20), page: 'panel' }, null, { refused: true });
  await step('start_task', 'start_task', { title: 'NDVI de Calpulalpan', goal: 'Comparar el NDVI de julio 2025 de las parcelas reservadas de Calpulalpan.', steps: ['Buscar parcelas', 'Leer NDVI', 'Mostrar en el panel', 'Anotar', 'Exportar'] },
    r => expect(r.following === true, `following should be true, got ${r.following}`));
  const q = await step('query_parcels Calpulalpan reservadas', 'query_parcels', { municipality: ['Calpulalpan'], group: 'reservadas', fields: ['id', 'predicted', 'area'] },
    r => expect(r.total > 0, 'no parcels found'));
  const ids = q.rows.map(r => r.id);
  const series = await step(`get_series of ${ids.length} parcels, shown on the plot`, 'get_series', { parcel_ids: ids, years: [2025], metrics: ['ndvi_mean', 'ndvi_min', 'ndvi_max', 'precip'], show: true, include_by_parcel: true },
    async r => { expect(r.parcels === ids.length, `series for ${r.parcels} of ${ids.length}`); await visible(page.getByText(/Milli lee \d+ de \d+ parcelas/), 'the "Milli lee" plot indicator'); });
  await page.waitForTimeout(2600); // let the plot animation finish
  await step('navigate panel', 'navigate', { page: 'panel' }, () => visible(page.getByRole('region', { name: 'Panel de control' }), 'Panel de control'));
  await step('table_set reservadas, sorted by estimate desc', 'table_set', { table: 'estimaciones', set_tab: 'reservadas', search: '', sorting: [{ column: 'Estimado', desc: true }] },
    r => { expect(r.estado.panel.pestaña === 'reservadas', `tab is ${r.estado.panel.pestaña}`); expect(r.estado.panel.tabla.orden[0]?.columna === 'predicted', `sorting ${JSON.stringify(r.estado.panel.tabla.orden)}`); });
  const july = id => series.by_parcel[id]?.find(m => m.month === '2025-07')?.ndvi_mean ?? -1;
  const ranked = [...ids].sort((a, b) => july(b) - july(a));
  await step(`table_check set ${ranked.length} parcels`, 'table_check', { table: 'estimaciones', mode: 'set', parcel_ids: ranked },
    async r => { expect(r.estado.panel.filas_marcadas.total === ranked.length, `checked ${r.estado.panel.filas_marcadas.total}`); await visible(page.getByRole('button', { name: new RegExp(`Ver en el mapa · ${ranked.length}`) }), 'the "Ver en el mapa · N" button'); });
  await step('plot_set 2024, then the screen reports it', 'plot_set', { year: 2024 }, r => expect(r.estado.panel.grafica.año === 2024, `plot year ${r.estado.panel.grafica.año}`));
  await step('plot_set 2025: screen series == data plane', 'plot_set', { year: 2025 }, r => {
    const screenJuly = r.estado.panel.grafica.meses.find(m => m.mes === 'Jul')?.ndvi_media, dataJuly = series.average.find(m => m.month === '2025-07')?.ndvi_mean;
    expect(Math.abs(screenJuly - dataJuly) < 0.002, `July NDVI on screen ${screenJuly} vs data ${dataJuly}`);
  });
  await step('read_table estimaciones (checked rows first page)', 'read_table', { table: 'estimaciones', limit: 5 }, r => expect(r.filas.length > 0 && 'estimado_t_ha' in r.filas[0], 'no rows'));
  await step('write_notes append', 'write_notes', { mode: 'append', text: `NDVI julio 2025 · ${ranked[0]} encabeza (${july(ranked[0]).toFixed(2)}).` },
    async () => {
      await visible(page.getByRole('textbox', { name: 'Notas' }), 'the Notas panel');
      await page.waitForFunction(id => document.querySelector('textarea[aria-label="Notas"]')?.value.includes(id), ranked[0], { timeout: 3000 }).catch(() => { throw new Error("the notes don't show Milli's text"); });
    });
  const downloading = page.waitForEvent('download', { timeout: 6000 });
  await step('request_export estimaciones_csv seleccionadas (approved)', 'request_export', { kind: 'estimaciones_csv', scope: 'seleccionadas' }, async r => {
    const d = await downloading; expect(d.suggestedFilename() === 'agrocebada-seleccion.csv', `downloaded ${d.suggestedFilename()}`); expect(r.filas === ranked.length, `exported ${r.filas} rows`);
  });
  await step('finish_task (end of sequence)', 'finish_task', { answer: `NDVI de julio 2025 de ${ids.length} parcelas reservadas de Calpulalpan.` }, () => expect(finished.length === 1, 'finish not recorded'));

  // ── Conversation 2: the calculator on screen ───────────────────────────────────────────────
  console.log('\n2 · Calculadora para Hidalgo con semilla por bulto');
  await step('start_task', 'start_task', { title: 'Economía de Hidalgo', goal: 'Margen con semilla por bulto.', steps: ['Buscar', 'Calcular'] });
  const hid = await step('query_parcels Hidalgo with estimate', 'query_parcels', { state: 'Hidalgo', fields: ['id'], limit: 500, predicted_min: 0 });
  const calc = await step('calculator_set seed by bulto + 51 checked', 'calculator_set', { price: 6800, seed: { unit: 'bulto', bag_price: 900, bag_m2: 2500, other: 12000 }, coverage: '0.9', scope: 'all', checked_parcel_ids: hid.rows.map(r => r.id) },
    async r => {
      expect(r.inputs.cost_ha === 15600, `cost/ha ${r.inputs.cost_ha}`);
      await visible(page.getByText(new RegExp(`Calculado para ${hid.total} parcelas seleccionadas`)), `"Calculado para ${hid.total} parcelas seleccionadas"`);
      const s = (await state(['economia'])).economia;
      expect(s.totales.margen_mxn === r.totals.margin, `screen margin ${s.totales.margen_mxn} vs server ${r.totals.margin}`);
      expect(s.totales.parcelas === r.totals.parcels, `screen parcels ${s.totales.parcelas} vs server ${r.totals.parcels}`);
      expect(s.supuestos.costo_mxn_ha === 15600, `screen cost/ha ${s.supuestos.costo_mxn_ha}`);
    });
  await step('region_error_drill Hidalgo', 'region_error_drill', { state: 'Hidalgo' }, () => visible(page.getByText('Error esperado en Hidalgo'), '"Error esperado en Hidalgo"'));
  await step('read_table error_municipios', 'read_table', { table: 'error_municipios' }, r => expect(r.filas.length > 0 && r.estado === 'Hidalgo', 'no municipalities'));
  await step('region_error_drill back to states', 'region_error_drill', { state: null }, () => visible(page.getByText('Error esperado por estado'), 'the states view'));
  await step('finish_task', 'finish_task', { answer: `Margen ${calc.totals.margin}` });

  // ── Conversation 3: map layers, filters, selection ─────────────────────────────────────────
  console.log('\n3 · Mapa: capa, filtros y selección');
  await step('start_task', 'start_task', { title: 'Mapa de Puebla', goal: 'Mostrar Puebla.', steps: ['Capa', 'Filtro', 'Selección'] });
  await step('navigate mapa', 'navigate', { page: 'mapa' }, r => expect(r.estado.vista.pagina === 'mapa', 'not on the map'));
  await step('set_map_layer registrado, cuantiles, dark basemap', 'set_map_layer', { mode: 'rendimiento', yield_field: 'registrado', classification: 'cuantiles', basemap: 'dark', municipalities_overlay: true },
    async r => { expect(r.estado.mapa.campo_rendimiento === 'registrado' && r.estado.mapa.clasificacion === 'cuantiles', JSON.stringify(r.estado.mapa)); await visible(page.locator('[data-testid="map"][data-base="dark"]'), 'the dark basemap'); });
  const puebla = await step('query_parcels Puebla', 'query_parcels', { state: 'Puebla', fields: ['id'], limit: 500 });
  await step('set_map_filters Puebla', 'set_map_filters', { state: 'Puebla' },
    async r => { expect(r.estado.mapa.parcelas_visibles === puebla.total, `visible ${r.estado.mapa.parcelas_visibles} vs ${puebla.total}`); await visible(page.locator(`[data-testid="map"][data-parcel-count="${puebla.total}"]`), `${puebla.total} parcels on the map`); });
  await step('map_select_parcels top 5', 'map_select_parcels', { parcel_ids: puebla.rows.slice(0, 5).map(r => r.id) },
    async r => { expect(r.seleccionadas === 5, `selected ${r.seleccionadas}`); await visible(page.getByRole('heading', { name: 'Selección' }), 'the selection summary'); });
  await step('select_parcel opens the card', 'select_parcel', { parcel_id: puebla.rows[0].id }, () => visible(page.getByRole('complementary', { name: 'Ficha de parcela' }), 'the parcel card'));
  await step('map_fly_to all', 'map_fly_to', { all: true }, r => expect(Array.isArray(r.estado.mapa.encuadre?.bbox), 'no view extent'));
  await step('set_map_filters reset', 'set_map_filters', { reset: true }, r => expect(r.estado.mapa.parcelas_visibles === 197, `visible ${r.estado.mapa.parcelas_visibles}`));
  await step('open_panel capas', 'open_panel', { panel: 'capas' }, r => expect(r.estado.vista.panel_lateral === 'capas', `panel ${r.estado.vista.panel_lateral}`));
  await step('invalid arguments are refused (month 13)', 'set_time', { year: 2025, month: 13 }, null, { refused: true });

  // ── Conversation 4: the user takes over ────────────────────────────────────────────────────
  console.log('\n4 · El usuario deja de seguir a Milli');
  await page.mouse.click(900, 500); // a click on the map
  await page.waitForTimeout(200);
  console.log(`${screen.following === false ? '✓' : '✗'} the server knows the user stopped following`); if (screen.following !== false) failed++;
  await step('navigate panel is deferred, not applied', 'navigate', { page: 'panel' }, async r => {
    expect(r.shown === false, `shown ${r.shown}`);
    expect(!(await page.getByRole('region', { name: 'Panel de control' }).isVisible()), 'the page changed anyway');
  });
  await step('data still answers (get_series)', 'get_series', { parcel_ids: [ids[0]], years: [2025] }, r => expect(r.parcels === 1, 'no data'));
  await step('state reports the pending change', 'get_screen_state', { sections: ['vista'] }, r => expect(r.vista.siguiendo_a_milli === false && r.vista.cambios_pendientes_por_mostrar === 1, JSON.stringify(r.vista)));
  await step('finish_task', 'finish_task', { answer: 'Listo.' });
  await step('a new task follows again', 'start_task', { title: 'Otra', goal: 'Comprobar que sigue.', steps: ['Ir'] }, r => expect(r.following === true, `following ${r.following}`));
  await step('navigate panel applies', 'navigate', { page: 'panel' }, () => visible(page.getByRole('region', { name: 'Panel de control' }), 'Panel de control'));
  await step('finish_task', 'finish_task', { answer: 'Listo.' }, () => expect(finished.length === 4, `finished ${finished.length}`));
} catch (e) {
  failed++; console.error('\n✗', e.message);
} finally {
  console.log(`\n${results.filter(r => r.ok).length}/${results.length} steps ok · screenshots in ${shots}`);
  await close();
  process.exit(failed ? 1 : 0);
}
