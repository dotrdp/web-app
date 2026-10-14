import { choosePresentation } from './navigation';
import { test, expect, type Page } from '@playwright/test';

async function openMap(page: Page) {
  await page.route('**/api/imagery/manifests/*', route => route.fulfill({ status: 503, json: { error: 'Servicio de imágenes no disponible.' } }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Usar cuenta de prueba' }).click();
  await page.getByRole('button', { name: 'Entrar a AgroCebada' }).click();
  await expect(page.getByTestId('map')).toBeVisible();
  await expect(page.locator('.map-setup-overlay')).toHaveCount(0);
}

test('The layer list navigates with arrows and the time slider appears only for layers that change over time', async ({ page }) => {
  await openMap(page);
  const layers = page.getByRole('toolbar', { name: 'Capas del territorio' });
  const time = page.getByRole('toolbar', { name: 'Evolución temporal' });
  const map = page.getByTestId('map');
  // Rendimiento is a single 2025 cycle: no time slider competes with the map.
  await expect(time).toHaveCount(0);
  await expect(layers).toHaveAttribute('aria-orientation', 'vertical');
  await expect(layers.getByRole('button', { pressed: true })).toHaveAccessibleName('Rendimiento');
  await layers.getByRole('button', { name: 'Rendimiento' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(layers.getByRole('button', { name: 'Vegetación' })).toBeFocused();
  await expect(map).toHaveAttribute('data-mode', 'parcels');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  const climate = layers.getByRole('button', { name: 'Clima', exact: true });
  await expect(climate).toBeFocused();
  await page.keyboard.press('Space');
  await expect(map).toHaveAttribute('data-mode', 'climate');
  await expect(climate).toHaveAttribute('aria-pressed', 'true');
  await expect(layers.getByRole('button', { pressed: true })).toHaveCount(1);
  await expect(time.getByRole('button', { name: 'Reproducir meses' })).toBeEnabled();
  await time.getByRole('button', { name: 'Julio 2025' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(time.getByRole('button', { name: 'Agosto 2025' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(map).toHaveAttribute('data-period', '2025-08');
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Mes de observación')).toBeFocused();
  await page.getByLabel('Mes de observación').fill('2024-12');
  await expect(map).toHaveAttribute('data-period', '2024-12');
  await layers.getByRole('button', { name: 'Terreno' }).click();
  await expect(time).toHaveCount(0);
  await expect(map).toHaveAttribute('data-period', '2024-12');
});

test('Zoom controls, the basemap gallery and fullscreen change the real map and keep tools available', async ({ page }) => {
  await openMap(page);
  const map = page.getByTestId('map');
  const navigation = page.getByRole('toolbar', { name: 'Navegación del mapa' });
  const initialParcelCount = await map.getAttribute('data-parcel-count');
  await expect(navigation).toHaveAttribute('aria-orientation', 'vertical');
  await expect(map).toHaveAttribute('data-base', 'topo');
  const initialZoom = Number(await map.getAttribute('data-zoom'));
  await navigation.getByRole('button', { name: 'Acercar mapa' }).focus();
  await page.keyboard.press('Enter');
  await expect.poll(async () => Number(await map.getAttribute('data-zoom'))).toBeGreaterThan(initialZoom + .8);
  await page.keyboard.press('ArrowDown');
  await expect(navigation.getByRole('button', { name: 'Alejar mapa' })).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(navigation.getByRole('button', { name: 'Ver todas las parcelas' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect.poll(async () => Number(await map.getAttribute('data-zoom'))).toBeLessThan(initialZoom + .2);

  await page.getByRole('toolbar', { name: 'Paneles del mapa' }).getByRole('button', { name: 'Mapa base', exact: true }).click();
  const basemap = page.getByRole('group', { name: 'Cartografía base' });
  await expect(basemap.getByRole('button', { pressed: true })).toHaveAccessibleName(/Topográfico/);
  await basemap.getByRole('button', { name: /Satélite/ }).click();
  await expect(map).toHaveAttribute('data-base', 'satellite');
  await expect(basemap.getByRole('button', { pressed: true })).toHaveCount(1);
  await basemap.getByRole('button', { name: /Oscuro/ }).click();
  await expect(map).toHaveAttribute('data-base', 'dark');
  const municipalities = page.getByRole('switch', { name: /Municipios/ });
  await expect(municipalities).toHaveAttribute('aria-checked', 'false');
  await municipalities.click();
  await expect(municipalities).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('button', { name: 'Cerrar panel' }).click();
  await expect(basemap).toHaveCount(0);
  await page.getByRole('toolbar', { name: 'Paneles del mapa' }).getByRole('button', { name: 'Mapa base', exact: true }).click();
  await expect(basemap.getByRole('button', { pressed: true })).toHaveAccessibleName(/Oscuro/);
  await expect(map).toHaveAttribute('data-period', '2025-07');
  await expect(map).toHaveAttribute('data-parcel-count', initialParcelCount!);

  await navigation.getByRole('button', { name: 'Mapa en pantalla completa' }).click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement === document.documentElement)).toBe(true);
  await expect(page.getByRole('button', { name: 'Analizar mi terreno', exact: true })).toBeVisible();
  await choosePresentation(page, 'Análisis Pro');
  await expect(page.getByRole('dialog', { name: 'Análisis Pro' })).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar controles avanzados' }).click();
  await navigation.getByRole('button', { name: 'Salir de pantalla completa' }).click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement)).toBe(null);
});

test('Filters, bookmarks, measuring and export work from the map rails', async ({ page }) => {
  await openMap(page);
  const map = page.getByTestId('map'), panels = page.getByRole('toolbar', { name: 'Paneles del mapa' });
  const total = Number(await map.getAttribute('data-parcel-count'));
  await panels.getByRole('button', { name: 'Filtros', exact: true }).click();
  await page.getByRole('group', { name: 'Filtrar por estado' }).getByRole('button', { name: 'Tlaxcala' }).click();
  await expect.poll(async () => Number(await map.getAttribute('data-parcel-count'))).toBeLessThan(total);
  await page.getByRole('button', { name: 'Restablecer' }).click();
  await expect(map).toHaveAttribute('data-parcel-count', String(total));
  await panels.getByRole('button', { name: 'Marcadores', exact: true }).click();
  const zoom = Number(await map.getAttribute('data-zoom'));
  await page.getByRole('list', { name: 'Marcadores' }).getByRole('button', { name: /^Puebla/ }).click();
  await expect.poll(async () => Number(await map.getAttribute('data-zoom'))).not.toBeCloseTo(zoom, 1);
  const tools = page.getByRole('toolbar', { name: 'Herramientas del mapa' });
  await tools.getByRole('button', { name: 'Medir distancia' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Distancia' })).toBeVisible();
  const canvas = page.getByRole('application', { name: 'Mapa interactivo', exact: false }), box = (await canvas.boundingBox())!;
  await canvas.click({ position: { x: box.width * .4, y: box.height * .4 } });
  await canvas.dblclick({ position: { x: box.width * .6, y: box.height * .4 } });
  await expect(page.getByRole('status').filter({ hasText: 'Distancia' })).toContainText(/\d+(\.\d+)? (k?m)/);
  await page.getByRole('button', { name: 'Terminar' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Distancia' })).toHaveCount(0);
  await tools.getByRole('button', { name: 'Exportar', exact: true }).click();
  await expect(page.getByRole('complementary', { name: 'Exportar' })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /Parcelas · GeoJSON/ }).click();
  expect((await download).suggestedFilename()).toBe('parcelas.geojson');
});

test('Mobile controls expose every month and drawing pauses playback without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openMap(page);
  await page.getByRole('toolbar', { name: 'Paneles del mapa' }).getByRole('button', { name: 'Capas', exact: true }).click();
  const layers = page.getByRole('toolbar', { name: 'Capas del territorio' });
  const time = page.getByRole('toolbar', { name: 'Evolución temporal' });
  await layers.getByRole('button', { name: 'Terreno' }).click();
  await expect(layers.getByRole('button', { name: 'Terreno' })).toHaveAttribute('aria-pressed', 'true');
  await layers.getByRole('button', { name: 'Clima', exact: true }).click();
  await page.getByRole('button', { name: 'Cerrar panel' }).click();
  await time.getByRole('button', { name: 'Octubre 2025' }).click();
  await expect(page.getByTestId('map')).toHaveAttribute('data-period', '2025-10');
  await time.getByRole('button', { name: 'Reproducir meses' }).click();
  await expect(time.getByRole('button', { name: 'Pausar meses' })).toBeVisible();
  await page.getByRole('button', { name: 'Dibujar parcela', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dibuja tu parcela' })).toBeVisible();
  await expect(time).toHaveCount(0);
  await page.getByRole('button', { name: 'Cancelar delimitación' }).click();
  await expect(time.getByRole('button', { name: 'Reproducir meses' })).toBeEnabled();
  await expect(page.getByTestId('map')).toHaveAttribute('data-period', '2025-10');
  const size = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, viewport: [innerWidth, innerHeight] }));
  expect([size.width, size.height]).toEqual(size.viewport);
  await expect(page.getByRole('button', { name: 'Analizar mi terreno', exact: true })).toBeVisible();
  const boxes = await page.getByRole('toolbar').evaluateAll(elements => elements.map(element => {
    const r = element.getBoundingClientRect();
    return { x: r.x, y: r.y, right: r.right, bottom: r.bottom };
  }));
  for (const box of boxes) { expect(box.x).toBeGreaterThanOrEqual(0); expect(box.y).toBeGreaterThanOrEqual(56); expect(box.right).toBeLessThanOrEqual(390); expect(box.bottom).toBeLessThanOrEqual(844); }
});
