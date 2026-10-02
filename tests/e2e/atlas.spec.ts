import { test, expect, type Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Usar cuenta de prueba' }).click();
  await page.getByRole('button', { name: 'Entrar a AgroCebada' }).click();
  await expect(page.getByTestId('map')).toBeVisible();
}

test('197 parcels, ID/municipality/coordinate search, month selection and real raster threshold', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await login(page);
  await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count', '197');
  await expect(page.getByRole('heading', { name: 'AGC_001' })).toBeVisible();
  const search = page.getByRole('textbox', { name: 'Buscar municipio, ID o coordenadas' });
  await search.fill('Chignahuapan'); await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count', '100');
  await search.fill('AGC_002'); await search.press('Enter'); await expect(page.getByRole('heading', { name: 'AGC_002' })).toBeVisible();
  await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count', '1');
  await search.fill('19.54, -98.56'); await search.press('Enter'); await expect(page.getByText('Ubicación encontrada.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Limpiar búsqueda' }).click();
  await page.getByRole('tab', { name: 'NDVI · Landsat C2' }).click();
  await expect.poll(async () => Number(await page.getByTestId('map').getAttribute('data-valid-pixels'))).toBeGreaterThan(0);
  const before = Number(await page.getByTestId('map').getAttribute('data-displayed-pixels'));
  await page.getByRole('spinbutton', { name: 'Valor del umbral NDVI' }).fill('0.8');
  await expect.poll(async () => Number(await page.getByTestId('map').getAttribute('data-displayed-pixels'))).toBeLessThan(before);
  await page.getByRole('checkbox', { name: 'Filtrar también parcelas' }).check();
  await expect.poll(async () => Number(await page.getByTestId('map').getAttribute('data-parcel-count'))).toBeLessThan(197);
  await page.getByRole('button', { name: 'Agosto 2025' }).click();
  await expect(page.getByTestId('map')).toHaveAttribute('data-period', '2025-08');
  await page.getByRole('checkbox', { name: 'Filtrar también parcelas' }).uncheck();
  await page.getByRole('tab', { name: 'Clima', exact: true }).click();
  await page.getByRole('button', { name: 'Septiembre 2025' }).click();
  await expect(page.getByTestId('map')).toHaveAttribute('data-period', '2025-09');
  await page.screenshot({ path: 'test-results/climate-desktop.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('AlphaEarth annual pixels, technical curves and explicit placeholder results', async ({ page }) => {
  await login(page);
  await page.getByRole('textbox', { name: 'Buscar municipio, ID o coordenadas' }).fill('AGC_001');
  await page.getByRole('textbox', { name: 'Buscar municipio, ID o coordenadas' }).press('Enter');
  await page.getByRole('tab', { name: 'AlphaEarth' }).click();
  await expect.poll(async () => Number(await page.getByTestId('map').getAttribute('data-embedding-count'))).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: 'Julio 2025' })).toBeDisabled();
  await page.screenshot({ path: 'test-results/alphaearth-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Análisis técnico', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Evolución de la vegetación' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AlphaEarth Foundations' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Las 64 dimensiones del embedding' })).toBeVisible();
  await expect(page.getByText('Valor fijo de ejemplo, sin inferencia.')).toBeVisible();
  await page.screenshot({ path: 'test-results/technical-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Mis parcelas', exact: false }).first().click();
  await page.getByRole('textbox', { name: 'Buscar en mis parcelas' }).fill('AGC_001');
  await page.getByRole('button', { name: 'Analizar', exact: true }).click();
  await expect(page.getByText('El rendimiento de', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Analizar parcela', exact: true }).click();
  await expect(page.getByText('EJEMPLO · SIN INFERENCIA')).toBeVisible();
  await expect(page.getByText('Guardado en tus análisis.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Volver al mapa', exact: true }).click();
});

test('Draw, save and edit boundaries; admin session and saved fields survive reload', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Dibujar parcela', exact: true }).click();
  await expect(page.getByText('Dibuja los límites de tu parcela')).toBeVisible();
  const canvas = page.getByRole('application', { name: 'Mapa interactivo' });
  await page.waitForTimeout(120);
  const bounds = await canvas.boundingBox(); if (!bounds) throw new Error('Map missing');
  const point = (x: number, y: number) => ({ x: bounds.width * x, y: bounds.height * y });
  await canvas.click({ position: point(.4, .42) });
  await canvas.click({ position: point(.57, .42) });
  await canvas.click({ position: point(.57, .62) });
  await canvas.dblclick({ position: point(.4, .62) });
  await expect(page.getByRole('button', { name: 'Guardar parcela', exact: true })).toBeEnabled();
  await page.getByRole('textbox', { name: 'Nombre de la parcela' }).fill('Parcela e2e');
  await page.getByRole('button', { name: 'Guardar parcela', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Parcela e2e' })).toBeVisible();
  await page.getByRole('button', { name: 'Corregir límites' }).click();
  await expect(page.getByRole('button', { name: 'Guardar límites', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Guardar límites', exact: true }).click();
  await expect(page.getByText('Límites ajustados', { exact: false })).toBeVisible();
  await page.reload(); await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count', '198');
  await page.getByRole('button', { name: 'Abrir menú de testuser' }).click();
  await page.getByRole('menuitem', { name: 'Administración' }).click();
  await expect(page.getByRole('heading', { name: 'Usuarios del espacio' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Administrador', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Abrir menú de testuser' }).click();
  await page.getByRole('menuitem', { name: 'Cerrar sesión' }).click();
  await expect(page.getByRole('button', { name: 'Entrar a AgroCebada' })).toBeVisible();
});

test('Mobile map, month pills and accessible navigation without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  await page.getByRole('tab', { name: 'NDVI · Landsat C2' }).click();
  await page.getByRole('button', { name: 'Octubre 2025' }).click();
  await expect(page.getByTestId('map')).toHaveAttribute('data-period', '2025-10');
  await expect.poll(async () => Number(await page.getByTestId('map').getAttribute('data-valid-pixels'))).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/map-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Abrir navegación' }).click();
  await page.getByRole('button', { name: 'Datos y fuentes', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Cada dato tiene una historia.' })).toBeVisible();
});
