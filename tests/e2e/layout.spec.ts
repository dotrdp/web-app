import { test, expect, type Page } from '@playwright/test';
import { navigateSidebar, openAccount, openSidebar, choosePresentation } from './navigation';

async function login(page: Page, account = 'Usar cuenta de prueba') {
  await page.goto('/');
  await page.getByRole('button', { name: account, exact: true }).click();
  await page.getByRole('button', { name: 'Entrar a AgroCebada' }).click();
  await expect(page.getByTestId('map')).toBeVisible();
  await expect(page.locator('.map-setup-overlay')).toHaveCount(0);
}

test('Map layer, month and basemap choices survive side navigation on the same map instance', async ({ page }) => {
  await login(page);
  const map = page.getByTestId('map');
  await page.getByRole('button', { name: 'Clima', exact: true }).click();
  await page.getByRole('button', { name: 'Septiembre 2025', exact: true }).click();
  await page.getByRole('toolbar', { name: 'Paneles del mapa' }).getByRole('button', { name: 'Mapa base', exact: true }).click();
  await page.getByRole('group', { name: 'Cartografía base' }).getByRole('button', { name: /Satélite/ }).click();
  await page.getByRole('toolbar', { name: 'Paneles del mapa' }).getByRole('button', { name: 'Capas', exact: true }).click();
  await expect(map).toHaveAttribute('data-mode', 'climate');
  await expect(map).toHaveAttribute('data-base', 'satellite');
  await expect(map).toHaveAttribute('data-period', '2025-09');
  await navigateSidebar(page, 'Datos y fuentes');
  await expect(page.getByRole('heading', { name: 'Cada dato tiene una historia.' })).toBeVisible();
  await navigateSidebar(page, 'Mapa');
  await expect(map).toHaveAttribute('data-mode', 'climate');
  await expect(map).toHaveAttribute('data-base', 'satellite');
  await expect(page.getByRole('button', { name: 'Septiembre 2025' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Terreno', exact: true }).click();
  await expect(page.getByRole('toolbar', { name: 'Evolución temporal' })).toHaveCount(0);
  await expect(map).toHaveAttribute('data-period', '2025-09');
});

test('Producer and technician keep every permitted view in the navigation menu under one header', async ({ page }) => {
  test.skip(process.env.AGROCEBADA_DEMO !== '1', 'Simulated demo roles');
  await page.setViewportSize({ width: 1440, height: 900 });
  await login(page, 'Técnico');
  for (const [username, role] of [['tecnico', 'technician'], ['productor1', 'producer']]) {
    if (role === 'producer') { await openAccount(page, 'tecnico'); await page.getByRole('menuitem', { name: 'Demo: productor1 · Productor', exact: true }).click(); }
    await expect(page.locator('.atlas-shell')).toHaveAttribute('data-role', role);
    await expect(page.locator('.atlas-header')).toHaveCount(0);
    await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count', '99');
    // Inset shell: 8 px frame, 48 px header above the map, 8 px frame below it.
    const bounds = await page.getByTestId('map').boundingBox(); expect(bounds!.y).toBe(56); expect(bounds!.y + bounds!.height).toBe(892);
    await openSidebar(page);
    await expect(page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Mis parcelas', exact: true })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Administración', exact: true })).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Navegación y cuenta' })).toHaveCount(0);
    for (const name of ['Mis parcelas', 'Análisis técnico', 'Modelo de ejemplo', 'Datos y fuentes']) {
      await navigateSidebar(page, name);
      await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
      await expect(page.getByRole('dialog', { name: 'Navegación y cuenta' })).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Abrir navegación' })).toBeVisible();
    }
    await navigateSidebar(page, 'Mapa');
    await choosePresentation(page, 'Análisis Pro');
    const settings = page.getByRole('dialog', { name: 'Análisis Pro' }); await expect(settings).toBeVisible();
    await expect.poll(async () => { const bounds = await settings.boundingBox(); return bounds!.x + bounds!.width; }).toBe(1440);
    expect((await settings.boundingBox())!.y).toBe(0);
    await page.getByRole('button', { name: 'Cerrar controles avanzados' }).click();
    await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count', '99');
    await page.evaluate(() => { location.hash = '/admin'; });
    await expect(page).toHaveURL(/#\/map$/);
    await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count', '99');
    await openSidebar(page);
    await expect(page.getByRole('button', { name: `Abrir menú de ${username}` })).toBeVisible();
    await page.keyboard.press('Control+b');
  }
});

test('Mobile side menus and map controls work without a producer header or page overflow', async ({ page }) => {
  test.skip(process.env.AGROCEBADA_DEMO !== '1', 'Simulated demo roles');
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page, 'Productor 1');
  await expect(page.locator('.atlas-header')).toHaveCount(0);
  await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count', '99');
  await openSidebar(page);
  const menu = page.getByRole('dialog', { name: 'Navegación y cuenta' }); await expect(menu).toBeVisible();
  await expect.poll(async () => (await menu.boundingBox())!.x).toBe(0);
  expect((await menu.boundingBox())!.width).toBeLessThan(390);
  await page.getByRole('link', { name: 'Mis parcelas', exact: true }).click();
  await expect(menu).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Mis parcelas', exact: true })).toBeVisible();
  await navigateSidebar(page, 'Mapa');
  await expect(menu).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth && document.documentElement.scrollHeight === innerHeight)).toBe(true);
  await openSidebar(page);
  await choosePresentation(page, 'Análisis Pro');
  await expect(page.getByRole('dialog', { name: 'Análisis Pro' })).toBeVisible();
  await expect(menu).toHaveCount(0);
  await page.getByRole('button', { name: 'Cerrar controles avanzados' }).click();
  await page.getByRole('toolbar', { name: 'Paneles del mapa' }).getByRole('button', { name: 'Capas', exact: true }).click();
  await page.getByRole('button', { name: 'Clima', exact: true }).click();
  await page.getByRole('button', { name: 'Cerrar panel' }).click();
  await page.getByRole('button', { name: 'Octubre 2025', exact: true }).click();
  await expect(page.getByTestId('map')).toHaveAttribute('data-period', '2025-10');
  await openSidebar(page); await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Abrir navegación' })).toBeFocused();
});
