import { navigateSidebar } from './navigation';
import { test, expect, type Page, type Route } from '@playwright/test';

async function signIn(page: Page, path = '/') {
  await page.goto(path);
  await page.getByRole('button', { name: 'Usar cuenta de prueba' }).click();
  await page.getByRole('button', { name: 'Entrar a AgroCebada' }).click();
}
const navigate = navigateSidebar;

for (const [view, title] of [['parcels', 'Mis parcelas'], ['technical', 'Análisis técnico'], ['models', 'Modelo de ejemplo'], ['sources', 'Datos y fuentes'], ['admin', 'Administración']]) {
  test(`${title} preserves its layout with dotted value placeholders until data arrives`, async ({ page }) => {
    test.skip(process.env.AGROCEBADA_DEMO !== '1', 'Demo route bootstrap');
    await page.setViewportSize({ width: 390, height: 844 });
    const held: Route[] = [];
    await page.route('**/data/landsat.json', route => { held.push(route); });
    await signIn(page, '/#/' + view);
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    const placeholder = page.locator('.page-placeholder[data-phase="loading"]');
    await expect(placeholder).toBeVisible();
    await expect(placeholder.getByRole('status')).toContainText(`Cargando ${title}`);
    await expect(placeholder.locator('.loading-value').first()).toContainText('—');
    expect(await placeholder.locator('.loading-value').first().locator('.loading-dots > span').first().evaluate(e => getComputedStyle(e).animationName)).toBe('ag-dot-pulse');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (view === 'parcels') await expect(placeholder.locator('td').filter({ hasText: 'ha' }).first()).toBeVisible();
    await expect.poll(() => held.length).toBe(1);
    await held[0].continue();
    await expect(placeholder).toHaveCount(0);
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    if (view === 'technical') {
      await expect(page.locator('.page-placeholder[data-phase="waiting"]')).toBeVisible();
      expect(await page.locator('.placeholder-waiting .loading-dots > span').first().evaluate(e => getComputedStyle(e).animationName)).toBe('none');
      await page.getByRole('combobox', { name: 'Parcela del análisis' }).click();
      await page.getByRole('option', { name: 'AGC_001', exact: true }).click();
      await expect(page.locator('.page-placeholder')).toHaveCount(0);
      await expect(page.getByRole('heading', { name: 'Evolución de la vegetación' })).toBeVisible();
    }
    if (view === 'models') {
      await expect(page.getByRole('img', { name: 'RMSE pendiente del modelo' })).toContainText('—');
      await expect(page.getByText('MODELO PENDIENTE')).toBeVisible();
    }
  });
}

test('Page loading errors stop the dots, support retry, and preserve reduced-motion behavior', async ({ page }) => {
  test.skip(process.env.AGROCEBADA_DEMO !== '1', 'Demo route bootstrap');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  let fail = true;
  let retry: Route | undefined;
  await page.route('**/data/layers.json', route => {
    if (fail) { fail = false; return route.fulfill({ status: 503, body: 'Unavailable' }); }
    retry = route;
  });
  await signIn(page, '/#/sources');
  await expect(page.getByRole('alert')).toContainText('No pudimos cargar esta fuente');
  expect(await page.locator('.page-placeholder .loading-dots > span').first().evaluate(e => getComputedStyle(e).animationName)).toBe('none');
  await page.getByRole('button', { name: 'Volver a intentar', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Cargando Datos y fuentes' })).toBeVisible();
  expect(await page.locator('.page-placeholder .loading-dots > span').first().evaluate(e => getComputedStyle(e).animationName)).toBe('none');
  await expect.poll(() => !!retry).toBe(true);
  await retry!.continue();
  await expect(page.locator('.page-placeholder')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Cada dato tiene una historia.' })).toBeVisible();
});

test('Administration and example analysis retain dotted placeholders during actual API requests', async ({ page }) => {
  test.skip(process.env.AGROCEBADA_DEMO === '1', 'Uses HTTP requests in the local server to inspect pending states');
  let users: Route | undefined, analysis: Route | undefined;
  await page.route('**/api/admin/users', route => { users = route; });
  await page.route('**/api/analyses', route => { analysis = route; });
  await signIn(page);
  await expect(page.getByTestId('map')).toBeVisible();
  await navigate(page, 'Administración');
  await expect(page.getByRole('status').filter({ hasText: 'Cargando usuarios y roles' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Crear usuario' })).toBeDisabled();
  await expect(page.getByRole('table', { name: 'Usuarios del espacio' }).getByRole('img', { name: 'Valor pendiente' }).first()).toContainText('—');
  await expect.poll(() => !!users).toBe(true);
  await users!.continue();
  await expect(page.getByRole('button', { name: 'Crear usuario' })).toBeEnabled();
  await expect(page.getByRole('status').filter({ hasText: 'Cargando usuarios y roles' })).toHaveCount(0);
  await navigate(page, 'Mis parcelas');
  await page.getByRole('textbox', { name: 'Buscar en mis parcelas' }).fill('AGC_001');
  await page.getByRole('button', { name: 'Analizar', exact: true }).click();
  await page.getByRole('button', { name: 'Analizar parcela', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Preparando resultado de ejemplo' })).toBeVisible();
  await expect(page.locator('.analysis-loading .loading-value').first()).toContainText('—');
  await expect.poll(() => !!analysis).toBe(true);
  await analysis!.continue();
  await expect(page.getByText('Guardado en tus análisis.', { exact: false })).toBeVisible();
  await expect(page.locator('.analysis-loading')).toHaveCount(0);
});
