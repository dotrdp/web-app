import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function signIn(page: Page, hash = '') {
  await page.goto('/' + hash);
  await page.getByRole('button', { name: 'Usar cuenta de prueba' }).click();
  await page.getByRole('button', { name: 'Entrar a AgroCebada' }).click();
  await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count', '197');
  await expect(page.getByRole('heading', { name: 'Preparando tu mapa' })).toHaveCount(0);
}
const bar = (page: Page) => page.getByRole('navigation', { name: 'Barra de AgroCebada' });

test('One account, two phases: no producer or technician roles anywhere', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/Productor|Técnico|Entrar con otro rol/)).toHaveCount(0);
  await signIn(page);
  await expect(page.getByText(/Productor|Técnico|Análisis Pro/)).toHaveCount(0);
  await page.keyboard.press('Alt+2');
  await expect(page).toHaveURL(/#\/estimar$/);
  await expect(bar(page).getByRole('button', { name: 'Volver al mapa' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '¿Qué haremos hoy?' })).toBeVisible();
  // The dashboard has no tabs and there is no third phase any more.
  await expect(page.getByRole('region', { name: 'Panel de control' }).getByRole('tab', { name: 'Modelo' })).toHaveCount(0);
  await page.keyboard.press('Alt+3');
  await expect(page).toHaveURL(/#\/estimar$/);
  await page.keyboard.press('Alt+1');
  await expect(page.getByRole('region', { name: 'Panel de control' })).toHaveCount(0);
  // Legacy and removed routes land on a phase that exists.
  await page.goto('/#/avanzado'); await expect(bar(page).getByRole('button', { name: 'Panel de control' })).toBeVisible();
});

test('The layers panel offers only the Explorar layers', async ({ page }) => {
  await signIn(page);
  const layers = page.getByRole('region', { name: 'Capas y simbología' });
  await expect(layers.getByRole('button', { name: 'Rendimiento' })).toBeVisible();
  await expect(layers.getByRole('button', { name: 'Vegetación' })).toBeVisible();
  for (const name of ['Agua', 'AlphaEarth', 'Clima', 'Terreno', 'Error del modelo']) await expect(layers.getByRole('button', { name })).toHaveCount(0);
});

test('Estimar: the season plot and NDVI integral, the table with one export, and the 59-row submission from the map', async ({ page }) => {
  await signIn(page, '#/estimar');
  const panel = page.getByRole('region', { name: 'Panel de control' });
  const season = panel.getByRole('figure').filter({ hasText: 'NDVI y lluvia por mes' });
  await expect(season.getByText(/^Parcelas mostradas · promedio de 59 ·/)).toBeVisible();
  const years = season.getByRole('group', { name: 'Año' });
  await years.getByRole('button', { name: '2023' }).click();
  await expect(years.getByRole('button', { name: '2023' })).toHaveAttribute('aria-pressed', 'true');
  await expect(panel.getByRole('img', { name: 'Campo de cebada en macollaje al atardecer' })).toBeVisible();
  // NDVI integral over the cycle, one per year; picking a year moves the chart too.
  const integral = season.getByRole('region', { name: 'Integral de NDVI' });
  await expect(integral.getByRole('button')).toHaveCount(4);
  await integral.getByRole('button', { name: /2024/ }).click();
  await expect(season.getByRole('group', { name: 'Año' }).getByRole('button', { name: '2024' })).toHaveAttribute('aria-pressed', 'true');
  await expect(integral.getByRole('button', { name: /2024\s*\d+\.\d{2}/ })).toBeVisible();
  await expect(panel.getByRole('tab', { name: 'Mis terrenos' })).toHaveCount(0);
  const table = panel.getByRole('table', { name: 'Estimaciones de rendimiento' });
  const rows = table.locator('tbody tr');
  await expect(rows).toHaveCount(59);
  // One export: every shown row, or only the checked ones with their count on the button.
  const csvLines = async (name: RegExp) => { const download = page.waitForEvent('download'); await panel.getByRole('button', { name }).click(); return (await readFile((await (await download).path())!, 'utf8')).trim().split(/\r?\n/); };
  await expect(panel.getByRole('button', { name: /Entrega|Tabla CSV|GeoJSON/ })).toHaveCount(0);
  expect(await csvLines(/^Exportar filas mostradas$/)).toHaveLength(60);
  // Check all, then a selection of two goes to the map as a selection.
  await table.getByRole('checkbox', { name: 'Seleccionar todo' }).click();
  await expect(panel.getByRole('button', { name: 'Exportar seleccionadas 59' })).toBeVisible();
  await panel.getByRole('button', { name: 'Quitar selección' }).click();
  await rows.nth(0).getByRole('checkbox').click(); await rows.nth(1).getByRole('checkbox').click();
  // The plot follows the table: the shown parcels, or only the checked ones.
  await expect(season.getByText(/^Seleccionadas · promedio de 2 ·/)).toBeVisible();
  expect(await csvLines(/^Exportar seleccionadas 2$/)).toHaveLength(3);
  await rows.nth(1).getByRole('checkbox').click();
  await expect(season.getByText(/^AGC_003 · Sentinel-2/)).toBeVisible();
  await rows.nth(1).getByRole('checkbox').click();
  await panel.getByRole('button', { name: 'Ver en el mapa · 2' }).click();
  await expect(page.getByRole('heading', { name: 'Selección' })).toBeVisible();
  // "Por municipio" has checkboxes too; a municipality selects all its parcels.
  await page.keyboard.press('Alt+2');
  await panel.getByRole('tab', { name: 'Por municipio' }).click();
  const groups = panel.getByRole('table', { name: 'Estimaciones por municipio' }).locator('tbody tr');
  await expect(groups.first().getByRole('checkbox')).toBeVisible();
  await groups.first().getByRole('checkbox').click();
  await expect(panel.getByRole('button', { name: /^Exportar seleccionadas \d+$/ })).toBeVisible();
  await expect(season.getByText(/^(Seleccionadas · promedio de \d+|AGC_\d+) · Sentinel-2/)).toBeVisible();
  await panel.getByRole('button', { name: 'Quitar selección' }).click();
  await panel.getByRole('tab', { name: 'Reservadas · 59' }).click();
  // The last column flies to one parcel and opens its card.
  await panel.getByRole('button', { name: 'Ver AGC_011 en el mapa' }).click();
  await expect(panel).toHaveCount(0);
  const card = page.getByRole('region', { name: 'Ficha de parcela' });
  await expect(card.getByRole('heading', { name: 'AGC_011' })).toBeVisible();
  await expect(card.getByText('Intervalo 80 %')).toBeVisible();
  // The challenge submission now lives in the map's export panel.
  await page.getByRole('toolbar', { name: 'Herramientas del mapa' }).getByRole('button', { name: 'Exportar' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /Entrega del reto/ }).click();
  const lines = (await readFile((await (await download).path())!, 'utf8')).trim().split(/\r\n/);
  expect(lines[0]).toBe('ID_POLIGONO,RENDIMIENTO_T_HA'); expect(lines).toHaveLength(60);
});

test('Launcher finds parcels, runs ">" commands and recolours the shell from the logo palette', async ({ page }) => {
  await signIn(page);
  await page.keyboard.press('Control+k');
  const input = page.getByRole('combobox', { name: 'Buscar parcela, municipio, coordenadas o comando' });
  await input.fill('AGC_001'); await input.press('Enter');
  await expect(page.getByRole('region', { name: 'Ficha de parcela' }).getByRole('heading', { name: 'AGC_001' })).toBeVisible();
  await page.getByRole('button', { name: 'Buscar o ejecutar un comando (Ctrl K)' }).click();
  await input.fill('>esquema ');
  await page.getByRole('option', { name: 'Trigo' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-scheme', 'trigo');
  await input.fill('>oscuro'); await input.press('Enter');
  await expect(page.locator('html')).toHaveClass(/dark/);
});

test('Dashboard page replaces the map and the bar brings it back', async ({ page }) => {
  await signIn(page);
  await bar(page).getByRole('button', { name: 'Panel de control' }).click();
  const dash = page.getByRole('region', { name: 'Panel de control' });
  await expect(dash.getByRole('table', { name: 'Estimaciones de rendimiento' })).toBeVisible();
  await expect(page.locator('[inert]').getByRole('toolbar', { name: 'Herramientas del mapa' })).toHaveCount(1);
  await bar(page).getByRole('button', { name: 'Volver al mapa' }).click();
  await expect(dash).toHaveCount(0);
  await expect(bar(page).getByRole('button', { name: 'Capas y simbología' })).toBeVisible();
});

test('Agente de IA Milli stays in its island on the map and on the dashboard, opening on its chat', async ({ page }) => {
  await signIn(page);
  await page.getByRole('button', { name: 'Abrir Agente de IA Milli' }).click();
  const milli = page.getByRole('region', { name: 'Agente de IA Milli' });
  await expect(milli.getByRole('textbox', { name: 'Mensaje para Milli' })).toBeVisible();
  await expect(milli.getByRole('heading', { name: '¿Qué quieres que haga Milli?' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(milli).toHaveCount(0);
  await page.keyboard.press('Alt+d');
  await expect(page.getByRole('region', { name: 'Panel de control' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Abrir Agente de IA Milli' })).toBeVisible();
  // Settings open over the dashboard; map panels stay hidden with the map.
  await bar(page).getByRole('button', { name: 'Ajustes' }).click();
  await expect(page.getByRole('region', { name: 'Ajustes' }).getByRole('button', { name: 'Oscuro' })).toBeVisible();
  await page.getByRole('region', { name: 'Ajustes' }).getByRole('button', { name: 'Oscuro' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
});

test('Plugins: swipe compares layers, box selection sums production, disabled tools leave the strip', async ({ page }) => {
  await signIn(page);
  const tools = page.getByRole('toolbar', { name: 'Herramientas del mapa' });
  await tools.getByRole('button', { name: 'Comparar con deslizador' }).click();
  await expect(page.getByRole('slider', { name: 'Posición del comparador' })).toBeVisible();
  await page.keyboard.press('Escape');
  await tools.getByRole('button', { name: 'Seleccionar por área' }).click();
  const canvas = page.getByRole('application', { name: /Mapa interactivo/ }); const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + box.width * .3, box.y + box.height * .1); await page.mouse.down();
  await page.mouse.move(box.x + box.width * .95, box.y + box.height * .9, { steps: 8 }); await page.mouse.up();
  await expect(page.getByRole('heading', { name: 'Selección' })).toBeVisible();
  await expect(page.getByRole('region').filter({ has: page.getByRole('heading', { name: 'Selección' }) }).getByText('Producción estimada', { exact: true })).toBeVisible();
  await bar(page).getByRole('button', { name: 'Ajustes' }).click();
  await page.getByRole('switch', { name: 'Desactivar Comparar con deslizador' }).click();
  await expect(tools.getByRole('button', { name: 'Comparar con deslizador' })).toHaveCount(0);
});

test('Mobile keeps the dock, sheets and launcher inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signIn(page);
  await page.getByRole('navigation', { name: 'Barra de AgroCebada' }).getByRole('button', { name: 'Panel de control' }).click();
  await expect(page.getByRole('heading', { name: '¿Qué haremos hoy?' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test('Bar: settings gather theme, colour scheme, plugins and sources; filters and bookmarks share a panel', async ({ page }) => {
  await signIn(page);
  await expect(bar(page).getByRole('button')).toHaveCount(9);
  await bar(page).getByRole('button', { name: 'Ajustes' }).click();
  const settings = page.getByRole('region', { name: 'Ajustes' });
  await settings.getByRole('button', { name: 'Oscuro' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await settings.getByRole('button', { name: 'Arroz' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-scheme', 'arroz');
  await expect(settings.getByRole('switch').first()).toBeVisible();
  await settings.getByRole('button', { name: /Datos y fuentes/ }).click();
  await expect(page.getByRole('region', { name: 'Datos y fuentes' })).toBeVisible();
  await bar(page).getByRole('button', { name: 'Filtros y marcadores' }).click();
  const filters = page.getByRole('region', { name: 'Filtros y marcadores' });
  await expect(filters.getByRole('group', { name: 'Filtrar por estado' })).toBeVisible();
  await expect(filters.getByRole('list', { name: 'Marcadores' })).toBeVisible();
});

test('Toggles morph into an X while active, and C cancels the running map tool but not the comparison slider', async ({ page }) => {
  await signIn(page);
  const tools = page.getByRole('toolbar', { name: 'Herramientas del mapa' });
  const measure = tools.getByRole('button', { name: 'Medir distancia' });
  await measure.click();
  await expect(measure).toHaveAttribute('aria-pressed', 'true');
  await expect(measure.locator('svg.lucide-x')).toHaveCount(1);
  await expect(page.getByText('Presiona C para cancelar')).toBeVisible();
  await page.keyboard.press('c');
  await expect(page.getByText('Presiona C para cancelar')).toHaveCount(0);
  await expect(measure).toHaveAttribute('aria-pressed', 'false');
  await expect(measure.locator('svg.lucide-x')).toHaveCount(0);
  const swipe = tools.getByRole('button', { name: 'Comparar con deslizador' });
  await swipe.click();
  await expect(page.getByRole('slider', { name: 'Posición del comparador' })).toBeVisible();
  // The comparison slider keeps its icon and survives C: it works on top of the other tools.
  await expect(swipe).toHaveAttribute('aria-pressed', 'true');
  await expect(swipe.locator('svg.lucide-x')).toHaveCount(0);
  await measure.click();
  await page.keyboard.press('c');
  await expect(measure).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('slider', { name: 'Posición del comparador' })).toBeVisible();
  await swipe.click();
  await expect(page.getByRole('slider', { name: 'Posición del comparador' })).toHaveCount(0);
  // Typing a "c" in a field does not cancel anything.
  await tools.getByRole('button', { name: 'Medir distancia' }).click();
  await page.keyboard.press('Control+k');
  await page.getByRole('combobox', { name: /Buscar parcela/ }).fill('c');
  await page.keyboard.press('Escape');
  await expect(measure).toHaveAttribute('aria-pressed', 'true');
  const layers = bar(page).getByRole('button', { name: 'Capas y simbología' });
  await expect(layers.locator('svg.lucide-x')).toHaveCount(1);
  await layers.click();
  await expect(layers.locator('svg.lucide-x')).toHaveCount(0);
});

test('Number keys toggle the map tools in strip order', async ({ page }) => {
  await signIn(page);
  const tools = page.getByRole('toolbar', { name: 'Herramientas del mapa' });
  await expect(tools.getByRole('button', { name: 'Medir distancia' })).toHaveAttribute('aria-keyshortcuts', '3');
  await page.keyboard.press('3');
  await expect(tools.getByRole('button', { name: 'Medir distancia' })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('3');
  await expect(tools.getByRole('button', { name: 'Medir distancia' })).toHaveAttribute('aria-pressed', 'false');
  await page.keyboard.press('6');
  await expect(page.getByRole('slider', { name: 'Posición del comparador' })).toBeVisible();
});

test('Dashboard tools: the main page and producer economics tabs exist only on the dashboard; Scripts is always in the pill', async ({ page }) => {
  await signIn(page);
  const tools = bar(page).getByRole('group', { name: 'Herramientas del panel' });
  await expect(tools).toHaveCount(0);
  await page.keyboard.press('Alt+d');
  await expect(tools.getByRole('button')).toHaveCount(2);
  await expect(tools.getByRole('button', { name: 'Panel principal' })).toHaveAttribute('aria-pressed', 'true');
  await tools.getByRole('button', { name: 'Economía del productor' }).click();
  const econ = page.getByRole('region', { name: 'Economía del productor' });
  await expect(econ.getByRole('heading', { name: /^Calculado para todas las parcelas mostradas · 197$/ })).toBeVisible();
  await expect(econ.getByText('Cotizaciones - calculadora')).toBeVisible();
  // Margin and break-even stay empty until the producer enters a cost.
  await expect(econ.getByText('Escribe tu costo por hectárea para calcularlo')).toBeVisible();
  await econ.getByRole('spinbutton', { name: 'Costo de producción en pesos por hectárea' }).fill('14000');
  await expect(econ.getByText(/de \d+ parcelas lo superan/)).toBeVisible();
  await expect(econ.getByRole('table', { name: 'Economía por parcela' }).locator('tbody tr').first()).toBeVisible();
  // The seed calculator fills the cost per hectare: 300 seeds/m² × 45 g ÷ 100 = 135 kg/ha × $12 + $15,000.
  await expect(econ.getByRole('heading', { name: 'Calcular desde la semilla' })).toBeVisible();
  await econ.getByRole('spinbutton', { name: 'Semillas sembradas por metro cuadrado' }).fill('300');
  await expect(econ.getByText(/Dosis: 135\.0 kg\/ha/)).toBeVisible();
  await econ.getByRole('spinbutton', { name: 'Precio de la semilla en pesos por kilogramo' }).fill('12');
  await econ.getByRole('spinbutton', { name: 'Otros costos de producción en pesos por hectárea' }).fill('15000');
  await expect(econ.getByRole('spinbutton', { name: 'Costo de producción en pesos por hectárea' })).toHaveValue('16620');
  // Bought by the bulto: 10,000 m² ÷ 2,500 m² per bulto = 4 bultos × $900 + $15,000 other costs.
  await econ.getByRole('group', { name: 'Compra de la semilla' }).getByRole('button', { name: 'Por bulto' }).click();
  await econ.getByRole('spinbutton', { name: 'Metros cuadrados que siembra un bulto' }).fill('2500');
  await expect(econ.getByText(/Usas 4\.00 bultos\/ha/)).toBeVisible();
  await econ.getByRole('spinbutton', { name: 'Precio del bulto de semilla en pesos' }).fill('900');
  await expect(econ.getByRole('spinbutton', { name: 'Costo de producción en pesos por hectárea' })).toHaveValue('18600');
  // Expected error by state; a state opens its municipalities, and the arrow comes back.
  const region = econ.getByRole('figure').filter({ hasText: 'Error esperado por estado' });
  await expect(region.getByText('Haz clic en un estado para ver sus municipios')).toBeVisible();
  await region.getByRole('group', { name: 'Ver municipios de un estado' }).getByRole('button', { name: /^Hidalgo/ }).click();
  const munis = econ.getByRole('table', { name: 'Error esperado por municipio en Hidalgo' });
  await expect(munis.locator('tbody tr')).toHaveCount(6);
  await expect(munis.getByText(/poca muestra/).first()).toBeVisible();
  // Checking a municipality selects its parcels; the figures above say what they are calculated for.
  await expect(econ.getByText(/^Calculado para todas las parcelas mostradas · 197$/)).toBeVisible();
  await munis.locator('tbody tr').filter({ hasText: 'Almoloya' }).getByRole('checkbox').click();
  await expect(econ.getByText(/^Calculado para 14 parcelas seleccionadas$/)).toBeVisible();
  await expect(munis.locator('tbody tr').filter({ hasText: 'Almoloya' })).toContainText('14 de 14');
  await econ.getByRole('button', { name: 'Quitar selección' }).click();
  // Checked rows in the parcel table narrow the figures and the error chart.
  await econ.getByRole('table', { name: 'Economía por parcela' }).locator('tbody tr').first().getByRole('checkbox').click();
  await expect(econ.getByText(/^Calculado para 1 parcela seleccionada$/)).toBeVisible();
  await expect(econ.getByText(/^1 parcela · /)).toBeVisible();
  await econ.getByRole('button', { name: 'Quitar selección' }).click();
  await econ.getByRole('button', { name: 'Volver a los estados' }).click();
  await expect(econ.getByText('Haz clic en un estado para ver sus municipios')).toBeVisible();
  await bar(page).getByRole('button', { name: 'Scripts' }).click();
  await expect(page.getByRole('region', { name: 'Scripts' })).toBeVisible();
  await tools.getByRole('button', { name: 'Panel principal' }).click();
  await expect(page.getByRole('region', { name: 'Panel de control' })).toBeVisible();
  // Leaving the dashboard takes its page tabs with it; Scripts lives in the pill and stays.
  await page.keyboard.press('Alt+d');
  await expect(tools).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Scripts' })).toBeVisible();
});

test('Notas: always in the pill, saved as you type and back when reopened', async ({ page }) => {
  await signIn(page);
  const notes = bar(page).getByRole('button', { name: 'Notas' });
  await notes.click();
  const panel = page.getByRole('region', { name: 'Notas' });
  const box = panel.getByRole('textbox', { name: 'Notas' });
  await box.fill('Visitar AGC_011 el lunes');
  await expect(panel.getByText(/^Guardado/)).toBeVisible();
  await notes.click();
  await expect(panel).toHaveCount(0);
  await page.keyboard.press('Alt+d');
  await notes.click();
  await expect(page.getByRole('region', { name: 'Notas' }).getByRole('textbox', { name: 'Notas' })).toHaveValue('Visitar AGC_011 el lunes');
});
