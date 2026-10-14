import { test, expect, type Page } from '@playwright/test';
import { openSidebar, choosePresentation } from './navigation';

async function login(page: Page, imageryAvailable = false) {
  if (imageryAvailable) {
    const manifest = { version: 's2-test', month: '2025-07', source: 'Sentinel-2 L2A', resolution: { rgb: 10, ndvi: 10, mndwi: 20 }, states: ['Hidalgo', 'Puebla', 'Tlaxcala'], tiles: ['14QNH'], scenes: [], mosaic: 'clear-first', missingData: 'transparent', tileTemplate: '/api/imagery/tiles/s2-test/2025-07/{product}/{z}/{x}/{y}.png' };
    await page.route('**/api/imagery/manifests/*', route => route.fulfill({ json: manifest }));
    await page.route('**/api/imagery/tiles/**', route => route.fulfill({ contentType: 'image/png', body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64') }));
  } else await page.route('**/api/imagery/manifests/*', route => route.fulfill({ status: 503, json: { error: 'Servicio de imágenes no disponible.' } }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Usar cuenta de prueba' }).click();
  await page.getByRole('button', { name: 'Entrar a AgroCebada' }).click();
  await expect(page.getByTestId('map')).toBeVisible();
  await expect(page.locator('.map-setup-overlay')).toHaveCount(0);
}

test('Layer rows pair icons with labels, icon-only map controls share tooltips, and rows select with the keyboard', async ({ page }) => {
  await login(page);
  const layers = page.getByRole('toolbar', { name: 'Capas del territorio' });
  for (const name of ['Rendimiento', 'Vegetación', 'Agua', 'Clima', 'Terreno']) {
    const button = layers.getByRole('button', { name, exact: true });
    const bounds = (await button.boundingBox())!;
    expect(bounds.height).toBeGreaterThanOrEqual(44); expect(bounds.width).toBeGreaterThan(200);
    await expect(button).toContainText(name);
    await expect(button.locator('svg')).toHaveCount(1);
  }
  const zoomIn = page.getByRole('button', { name: 'Acercar mapa', exact: true });
  expect((await zoomIn.boundingBox())!.width).toBe(36);
  await zoomIn.hover();
  await expect(page.getByRole('tooltip')).toHaveText('Acercar mapa');
  await page.getByRole('button', { name: 'Alejar mapa', exact: true }).hover();
  await expect(page.getByRole('tooltip')).toHaveText('Alejar mapa');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await page.mouse.move(700, 400);
  const vegetation = layers.getByRole('button', { name: 'Vegetación', exact: true });
  await layers.getByRole('button', { name: 'Rendimiento', exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(vegetation).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.getByTestId('map')).toHaveAttribute('data-mode', 'ndvi');
  await expect(vegetation).toHaveAttribute('aria-pressed', 'true');
});

test('Zoom buttons respect view limits and follow wheel, fit and coordinate search', async ({ page }) => {
  await login(page);
  const map = page.getByTestId('map'), original = await map.elementHandle();
  const zoomIn = page.getByRole('button', { name: 'Acercar mapa', exact: true });
  const zoomOut = page.getByRole('button', { name: 'Alejar mapa', exact: true });
  await expect(page.getByRole('slider', { name: 'Zoom del mapa' })).toHaveCount(0);
  const initialZoom = Number(await map.getAttribute('data-zoom'));
  await zoomIn.click();
  await expect.poll(async () => Number(await map.getAttribute('data-zoom'))).toBeCloseTo(initialZoom + 1, 1);
  await zoomOut.click();
  await expect.poll(async () => Number(await map.getAttribute('data-zoom'))).toBeCloseTo(initialZoom, 1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  while (await zoomIn.isEnabled()) await zoomIn.click();
  await expect(map).toHaveAttribute('data-zoom', '19.00'); await expect(zoomIn).toBeDisabled();
  await zoomOut.click(); await expect(map).toHaveAttribute('data-zoom', '18.00'); await expect(zoomIn).toBeEnabled();
  while (await zoomOut.isEnabled()) await zoomOut.click();
  await expect(map).toHaveAttribute('data-zoom', '5.00'); await expect(zoomOut).toBeDisabled();
  await zoomIn.click(); await expect(map).toHaveAttribute('data-zoom', '6.00'); await expect(zoomOut).toBeEnabled();
  const canvas = (await page.getByRole('application').boundingBox())!;
  await page.getByRole('application').focus();
  await page.mouse.move(canvas.x + canvas.width * .6, canvas.y + canvas.height * .45);
  await page.mouse.wheel(0, -200);
  await expect.poll(async () => Number(await map.getAttribute('data-zoom'))).toBeGreaterThan(6.3);
  await expect(zoomOut).toBeEnabled();
  await page.getByRole('button', { name: 'Ver todas las parcelas', exact: true }).click();
  await expect.poll(async () => Number(await map.getAttribute('data-zoom'))).toBeGreaterThan(9);
  await expect.poll(async () => Number(await map.getAttribute('data-zoom'))).toBeLessThan(12);
  await page.getByRole('textbox', { name: 'Buscar municipio, ID o coordenadas' }).fill('19.54, -98.56');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();
  await expect.poll(async () => Number(await map.getAttribute('data-zoom'))).toBe(16);
  await zoomIn.click(); await expect(map).toHaveAttribute('data-zoom', '17.00');
  expect(await map.evaluate((element, previous) => element === previous, original)).toBe(true);
  await expect(map).toHaveAttribute('data-period', '2025-07');
});

test('Water index slider updates the MNDWI legend and actual tile threshold, with keyboard and drag input', async ({ page }) => {
  const thresholds: string[] = [];
  page.on('request', request => { if (request.url().includes('/mndwi/')) thresholds.push(new URL(request.url()).searchParams.get('threshold')!); });
  await login(page, true);
  const map = page.getByTestId('map'), initialZoom = await map.getAttribute('data-zoom');
  await page.getByRole('button', { name: 'Agua', exact: true }).click();
  await expect.poll(() => thresholds.includes('0')).toBe(true);
  await choosePresentation(page, 'Análisis Pro');
  const panel = page.getByRole('dialog', { name: 'Análisis Pro' });
  const water = panel.getByRole('slider', { name: 'Umbral de agua MNDWI' });
  await expect(water).toHaveAttribute('min', '-1'); await expect(water).toHaveAttribute('max', '1');
  await expect(water).toHaveAttribute('aria-valuenow', '0');
  await expect(panel.getByRole('spinbutton', { name: 'Umbral de agua MNDWI' })).toHaveCount(0);
  const synced = async () => {
    const value = await water.getAttribute('aria-valuenow');
    await expect(page.locator('.map-legend')).toContainText(`MNDWI ≥ ${value} · 20 m`);
    await expect.poll(() => thresholds.includes(value!)).toBe(true);
  };
  await water.focus(); await page.keyboard.press('End'); await expect(water).toHaveAttribute('aria-valuenow', '1'); await synced();
  await page.keyboard.press('ArrowRight'); await expect(water).toHaveAttribute('aria-valuenow', '1');
  await page.keyboard.press('Home'); await expect(water).toHaveAttribute('aria-valuenow', '-1'); await synced();
  await page.keyboard.press('ArrowLeft'); await expect(water).toHaveAttribute('aria-valuenow', '-1');
  await page.keyboard.press('PageUp'); await expect(water).toHaveAttribute('aria-valuenow', '-0.75');
  await page.keyboard.press('ArrowRight'); await expect(water).toHaveAttribute('aria-valuenow', '-0.7'); await synced();
  const track = (await panel.locator('.water-index-control .stealth-slider-control').boundingBox())!;
  await page.mouse.move(track.x + track.width * .3, track.y + track.height / 2);
  await page.mouse.down();
  await page.mouse.move(track.x + track.width * .7, track.y + track.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect.poll(async () => Number(await water.getAttribute('aria-valuenow'))).toBeGreaterThan(.3);
  await expect.poll(async () => Number(await water.getAttribute('aria-valuenow'))).toBeLessThan(.5);
  await synced();
  const finalValue = await water.getAttribute('aria-valuenow');
  await expect(map).toHaveAttribute('data-zoom', initialZoom!); await expect(map).toHaveAttribute('data-period', '2025-07');
  await panel.getByRole('button', { name: 'Cerrar controles avanzados' }).click();
  await choosePresentation(page, 'Análisis Pro');
  await expect(water).toHaveAttribute('aria-valuenow', finalValue!);
});

test('Navigation stays hidden behind the header menu and the map keeps only icon rails', async ({ page }) => {
  await login(page);
  await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toHaveCount(0);
  await expect(page.locator('.app-header .logo-mark')).toBeVisible();
  for (const name of ['Capas', 'Mapa base', 'Parcelas', 'Marcadores', 'Filtros']) expect(await page.getByRole('toolbar', { name: 'Paneles del mapa' }).getByRole('button', { name, exact: true }).innerText()).toBe('');
  for (const name of ['Analizar mi terreno', 'Dibujar parcela', 'Medir distancia', 'Medir área', 'Exportar']) await expect(page.getByRole('toolbar', { name: 'Herramientas del mapa' }).getByRole('button', { name, exact: true })).toHaveText('');
  await expect(page.getByRole('toolbar', { name: 'Navegación del mapa' }).getByRole('button', { name: 'Mi ubicación' })).toBeVisible();
  await page.getByRole('button', { name: 'Abrir navegación' }).click();
  const drawer = page.getByRole('dialog', { name: 'Navegación y cuenta' });
  const nav = drawer.getByRole('navigation', { name: 'Navegación principal' });
  await expect(nav.getByRole('link', { name: 'Mapa', exact: true })).toHaveAttribute('aria-current', 'page');
  await nav.getByRole('link', { name: 'Datos y fuentes', exact: true }).click();
  await expect(drawer).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Cada dato tiene una historia.' })).toBeVisible();
  await page.getByRole('button', { name: 'Abrir navegación' }).click();
  await expect(nav.getByRole('link', { name: 'Datos y fuentes', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(drawer).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Abrir navegación' })).toBeFocused();
});

test.describe('Touch controls with reduced motion', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  test('Touch zoom buttons and water slider retain full tap targets and reduced motion', async ({ page }) => {
    await login(page);
    const map = page.getByTestId('map'), initialZoom = Number(await map.getAttribute('data-zoom'));
    const zoomIn = page.getByRole('button', { name: 'Acercar mapa', exact: true });
    const zoomOut = page.getByRole('button', { name: 'Alejar mapa', exact: true });
    for (const button of [zoomIn, zoomOut]) { const box = (await button.boundingBox())!; expect(box.width).toBe(44); expect(box.height).toBe(44); }
    await zoomIn.tap(); await expect.poll(async () => Number(await map.getAttribute('data-zoom'))).toBeCloseTo(initialZoom + 1, 1);
    await zoomOut.tap(); await expect.poll(async () => Number(await map.getAttribute('data-zoom'))).toBeCloseTo(initialZoom, 1);
    await openSidebar(page);
    await page.getByRole('button', { name: 'Análisis Pro', exact: true }).tap();
    const panel = page.getByRole('dialog', { name: 'Análisis Pro' });
    const water = panel.getByRole('slider', { name: 'Umbral de agua MNDWI' });
    const track = (await panel.locator('.water-index-control .stealth-slider-control').boundingBox())!;
    expect(track.height).toBeGreaterThanOrEqual(44);
    await page.touchscreen.tap(track.x + track.width * .8, track.y + track.height / 2);
    await expect.poll(async () => Number(await water.getAttribute('aria-valuenow'))).toBeGreaterThan(.5);
    const session = await page.context().newCDPSession(page);
    const y = track.y + track.height / 2;
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: track.x + track.width * .8, y }] });
    for (let step = 1; step <= 8; step++) {
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: track.x + track.width * (.8 - .4 * step / 8), y }] });
      await page.evaluate(() => new Promise(requestAnimationFrame));
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await session.detach();
    await expect.poll(async () => Number(await water.getAttribute('aria-valuenow'))).toBeLessThan(0);
    expect(await page.locator('.stealth-slider-knob').evaluate(e => getComputedStyle(e).scale)).toBe('1');
    // Let Chromium finish the touch gesture before the next tap; it suppresses
    // compatibility clicks immediately after a synthetic drag.
    await page.waitForTimeout(350);
    await panel.getByRole('button', { name: 'Cerrar controles avanzados' }).tap();
    await expect(panel).toBeHidden();
    await openSidebar(page);
    const nav = page.getByRole('navigation', { name: 'Navegación principal' });
    for (const link of await nav.getByRole('link').all()) expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await nav.getByRole('link', { name: 'Mis parcelas', exact: true }).tap();
    await expect(page.getByRole('heading', { name: 'Mis parcelas', exact: true })).toBeVisible();
    await expect(page.getByRole('dialog', { name: 'Navegación y cuenta' })).toHaveCount(0);
  });
});
