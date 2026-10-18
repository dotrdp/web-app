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

test('One account, three phases: no producer or technician roles anywhere', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/Productor|Técnico|Entrar con otro rol/)).toHaveCount(0);
  await signIn(page);
  await expect(page.getByText(/Productor|Técnico|Análisis Pro/)).toHaveCount(0);
  await bar(page).getByRole('button', { name: 'Panel de control' }).click();
  await page.getByRole('region', { name: 'Panel de control' }).getByRole('tab', { name: 'Estimar' }).click();
  await expect(bar(page).getByRole('button', { name: 'Volver al mapa' })).toBeVisible();
  await expect(page).toHaveURL(/#\/estimar$/);
  await expect(page.getByRole('heading', { name: 'Estimación de rendimiento' })).toBeVisible();
  await page.keyboard.press('Alt+3');
  await expect(page).toHaveURL(/#\/avanzado$/);
  await expect(page.getByRole('heading', { name: 'Indicadores avanzados' })).toBeVisible();
  // Legacy routes land on the matching phase.
  await page.goto('/#/technical'); await expect(page.getByRole('heading', { name: 'Indicadores avanzados' })).toBeVisible();
});

test('Technical layers and controls exist only in the advanced phase', async ({ page }) => {
  await signIn(page);
  const layers = page.getByRole('region', { name: 'Capas y simbología' });
  await expect(layers.getByRole('button', { name: 'Rendimiento' })).toBeVisible();
  await expect(layers.getByRole('button', { name: 'Agua' })).toHaveCount(0);
  await expect(layers.getByRole('button', { name: 'AlphaEarth' })).toHaveCount(0);
  await page.keyboard.press('Alt+3');
  await page.getByRole('tab', { name: 'Capas técnicas' }).click();
  await expect(page.getByRole('slider', { name: 'Umbral de agua MNDWI' })).toBeVisible();
  await page.getByRole('tabpanel', { name: 'Indicadores avanzados' }).getByRole('button', { name: /Error del modelo/ }).first().click();
  await expect(page.getByTestId('map')).toHaveAttribute('data-mode', 'error');
  await page.keyboard.press('Alt+1');
  await expect(page.getByTestId('map')).toHaveAttribute('data-mode', 'parcels');
});

test('Estimar answers the challenge: real metrics, productive reading, linked table and the 59-row submission', async ({ page }) => {
  await signIn(page, '#/estimar');
  const panel = page.getByRole('tabpanel', { name: 'Estimar' });
  await expect(panel.getByText('MAE · error típico')).toBeVisible();
  await expect(panel.getByText(/^0\.32\s*t\/ha$/).first()).toBeVisible();
  await expect(panel.getByText('4.2', { exact: true })).toHaveCount(0);
  await expect(panel.getByText(/equivale a ±1\.\d+ t de grano/)).toBeVisible();
  await panel.getByRole('spinbutton', { name: 'Precio supuesto en pesos por tonelada' }).fill('7000');
  await expect(panel.getByText(/a \$7,000\/t/)).toBeVisible();
  const rows = panel.getByRole('table', { name: 'Estimaciones de rendimiento' }).locator('tbody tr');
  await expect(rows).toHaveCount(59);
  const download = page.waitForEvent('download');
  await panel.getByRole('button', { name: /Entrega · 59 parcelas/ }).click();
  const lines = (await readFile((await (await download).path())!, 'utf8')).trim().split(/\r\n/);
  expect(lines[0]).toBe('ID_POLIGONO,RENDIMIENTO_T_HA'); expect(lines).toHaveLength(60);
  // Picking a parcel returns to the map with its card.
  await rows.first().click();
  const card = page.getByRole('region', { name: 'Ficha de parcela' });
  await expect(card.getByText('Rendimiento estimado')).toBeVisible();
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

test('Dashboard page replaces the map with the model gauges and the cycle cutoff', async ({ page }) => {
  await signIn(page);
  await bar(page).getByRole('button', { name: 'Panel de control' }).click();
  const dash = page.getByRole('region', { name: 'Panel de control' });
  await dash.getByRole('tab', { name: 'Modelo' }).click();
  await expect(dash.getByRole('figure', { name: /R² · varianza: 0.67/ })).toBeVisible();
  await dash.getByRole('tab', { name: 'Ciclo' }).click();
  await expect(dash.getByText(/Corte de la estimación: 31 de octubre/)).toBeVisible();
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
  await page.getByRole('tab', { name: 'Estimar' }).click();
  await expect(page.getByRole('heading', { name: 'Estimación de rendimiento' })).toBeVisible();
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
