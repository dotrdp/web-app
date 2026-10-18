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
  await expect(page.getByRole('heading', { name: '¿Qué significa para un productor?' })).toBeVisible();
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

test('Estimar answers the challenge: the plot, productive reading, the table and the 59-row submission', async ({ page }) => {
  await signIn(page, '#/estimar');
  const panel = page.getByRole('region', { name: 'Panel de control' });
  const season = panel.getByRole('figure').filter({ hasText: 'NDVI y lluvia por mes' });
  await expect(season.getByText(/^Parcelas mostradas · promedio de 59 ·/)).toBeVisible();
  await season.getByRole('button', { name: '2023' }).click();
  await expect(season.getByRole('button', { name: '2023' })).toHaveAttribute('aria-pressed', 'true');
  await expect(panel.getByText(/equivale a ±1\.\d+ t de grano/)).toBeVisible();
  await panel.getByRole('spinbutton', { name: 'Precio supuesto en pesos por tonelada' }).fill('7000');
  await expect(panel.getByText(/a \$7,000\/t/)).toBeVisible();
  await expect(panel.getByRole('tab', { name: 'Mis terrenos' })).toHaveCount(0);
  const table = panel.getByRole('table', { name: 'Estimaciones de rendimiento' });
  const rows = table.locator('tbody tr');
  await expect(rows).toHaveCount(59);
  const download = page.waitForEvent('download');
  await panel.getByRole('button', { name: /Entrega · 59 parcelas/ }).click();
  const lines = (await readFile((await (await download).path())!, 'utf8')).trim().split(/\r\n/);
  expect(lines[0]).toBe('ID_POLIGONO,RENDIMIENTO_T_HA'); expect(lines).toHaveLength(60);
  // A row click picks the parcel for the productive reading without leaving the dashboard.
  await rows.first().click();
  await expect(panel.getByText(/En AGC_003 de 18\.68 ha/)).toBeVisible();
  // Check all, then a selection of two goes to the map as a selection.
  await table.getByRole('checkbox', { name: 'Seleccionar todo' }).click();
  await expect(panel.getByText('59 seleccionadas')).toBeVisible();
  await panel.getByRole('button', { name: 'Quitar selección' }).click();
  await rows.nth(0).getByRole('checkbox').click(); await rows.nth(1).getByRole('checkbox').click();
  // The plot follows the table: the shown parcels, or only the checked ones.
  await expect(season.getByText(/^Seleccionadas · promedio de 2 ·/)).toBeVisible();
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
  await expect(panel.getByText(/^\d+ seleccionadas?$/)).toBeVisible();
  await expect(season.getByText(/^(Seleccionadas · promedio de \d+|AGC_\d+) · Sentinel-2/)).toBeVisible();
  await panel.getByRole('button', { name: 'Quitar selección' }).click();
  await panel.getByRole('tab', { name: 'Reservadas · 59' }).click();
  // The last column flies to one parcel and opens its card.
  await panel.getByRole('button', { name: 'Ver AGC_011 en el mapa' }).click();
  await expect(panel).toHaveCount(0);
  const card = page.getByRole('region', { name: 'Ficha de parcela' });
  await expect(card.getByRole('heading', { name: 'AGC_011' })).toBeVisible();
  await expect(card.getByText('Intervalo 80 %')).toBeVisible();
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

test('Agente de IA Milli stays in its island on the map and on the dashboard, opening on the Resumen', async ({ page }) => {
  await signIn(page);
  await page.getByRole('button', { name: 'Abrir Agente de IA Milli' }).click();
  const milli = page.getByRole('region', { name: 'Agente de IA Milli' });
  await expect(milli.getByRole('region', { name: 'Clima del mes' })).toBeVisible();
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
  await expect(page.getByRole('heading', { name: '¿Qué significa para un productor?' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test('Bar: settings gather theme, colour scheme, plugins and sources; filters and bookmarks share a panel', async ({ page }) => {
  await signIn(page);
  await expect(bar(page).getByRole('button')).toHaveCount(7);
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
