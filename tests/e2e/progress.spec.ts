import { test, expect, type Page, type Route } from '@playwright/test';

async function signIn(page: Page) {
  test.skip(process.env.AGROCEBADA_DEMO !== '1', 'Memory demo workflow');
  await page.goto('/');
  await page.getByRole('button', { name: 'Usar cuenta de prueba' }).click();
  await page.getByRole('button', { name: 'Entrar a AgroCebada' }).click();
}

test('Map setup reports real parallel requests and opens only after all required sources arrive', async ({ page }) => {
  const pending = new Map<string, Route[]>();
  for (const file of ['parcels.geojson', 'layers.json', 'landsat.json']) {
    await page.route(`**/data/${file}`, route => { pending.set(file, [...pending.get(file) || [], route]); });
  }
  await signIn(page);
  await expect(page.getByRole('heading', { name: 'Preparando tu mapa' })).toBeVisible();
  await expect(page.locator('.map-setup-values .loading-value').first()).toContainText('—');
  const steps = page.getByRole('list', { name: 'Preparación del mapa', exact: true });
  await expect(steps.locator('[data-step="parcels"]')).toContainText('En curso');
  await expect(steps.locator('[data-step="map"]')).toContainText('En espera');
  await expect(steps.locator('[data-step="workspace"]')).toContainText('En curso');
  await expect(page.getByRole('status').filter({ hasText: 'Conectando el territorio' })).toBeVisible();
  await expect.poll(() => pending.size).toBe(3);
  await expect.poll(() => pending.get('parcels.geojson')?.length).toBe(2);
  for (const route of pending.get('parcels.geojson')!) await route.continue();
  await expect(steps.locator('[data-step="parcels"]')).toContainText('Listo');
  await expect(steps.locator('[data-step="workspace"]')).toContainText('Listo');
  await steps.getByRole('button', { name: 'Cargar parcelas', exact: false }).click();
  await expect(steps.getByText('197 límites de parcela disponibles')).toBeVisible();
  await steps.getByRole('button', { name: 'Preparar observaciones', exact: false }).click();
  await expect(steps.locator('[data-step="details"]')).toContainText('Listo');
  await expect(steps.locator('[data-step="landsat"]')).toContainText('En curso');
  await expect(page.getByTestId('map')).toHaveCount(0);
  await pending.get('layers.json')![0].continue();
  await expect(steps.locator('[data-step="layers"]')).toContainText('Listo');
  await pending.get('landsat.json')![0].continue();
  await expect(page.getByTestId('map')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Preparando tu mapa' })).toHaveCount(0);
  await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count', '197');
});

test('Failed setup can retry, ignores old source responses and respects reduced motion on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  let parcelRequests = 0;
  const landsatRequests: Route[] = [];
  await page.route('**/data/parcels.geojson', route => ++parcelRequests === 1 ? route.fulfill({ status: 503, body: 'Unavailable' }) : route.continue());
  await page.route('**/data/landsat.json', route => { landsatRequests.push(route); });
  await signIn(page);
  await expect(page.getByRole('heading', { name: 'Falta una fuente del mapa' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('No pudimos cargar esta fuente');
  await expect(page.locator('[data-step="parcels"]')).toContainText('Error');
  await page.getByRole('button', { name: 'Volver a intentar' }).click();
  await expect(page.getByRole('heading', { name: 'Preparando tu mapa' })).toBeVisible();
  await expect.poll(() => landsatRequests.length).toBe(2);
  await landsatRequests[0].continue();
  await expect(page.locator('[data-step="observations"]')).toContainText('En curso');
  await expect(page.getByTestId('map')).toHaveCount(0);
  const indicator = page.getByRole('status').filter({ hasText: 'Conectando el territorio' });
  await expect(indicator).toBeVisible();
  expect(await indicator.locator('.loading-dots > span').first().evaluate(e => getComputedStyle(e).animationName)).toBe('none');
  expect(await indicator.locator('.loading-state-label').evaluate(e => getComputedStyle(e).animationName)).toBe('none');
  const initialTime = await indicator.locator('.loading-elapsed').innerText();
  await expect.poll(() => indicator.locator('.loading-elapsed').innerText()).not.toBe(initialTime);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await landsatRequests[1].continue();
  await expect(page.getByTestId('map')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Preparando tu mapa' })).toHaveCount(0);
});
