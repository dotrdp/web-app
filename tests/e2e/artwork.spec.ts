import { test, expect } from '@playwright/test';

test('Login pairs the form with the globe and particles on desktop and a compact banner on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Inicia sesión', level: 1 })).toBeVisible();
  const story = page.getByRole('complementary', { name: 'El atlas AgroCebada' });
  await expect(story.getByRole('heading', { name: 'El campo tiene mucho que contarte.' })).toBeVisible();
  // The dotted COBE globe and the floating particles render on canvases.
  await expect(story.locator('canvas').first()).toBeAttached();
  await expect.poll(() => story.locator('canvas').count()).toBeGreaterThanOrEqual(2);
  const form = (await page.locator('.login-main').boundingBox())!, storyBox = (await story.boundingBox())!;
  expect(form.x).toBeLessThan(16); expect(storyBox.x).toBeGreaterThanOrEqual(form.width - 1); expect(storyBox.width).toBeGreaterThan(form.width);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(async () => (await story.boundingBox())!.height).toBe(180);
  expect((await page.locator('.login-main').boundingBox())!.y).toBeGreaterThanOrEqual(180);
  await expect(story.getByRole('heading', { name: 'El campo tiene mucho que contarte.' })).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test('A slow globe does not block signing in', async ({ page }) => {
  await page.route('**/Globe*', () => new Promise(() => {}));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Usar cuenta de prueba' }).click(); await page.getByRole('button', { name: 'Entrar a AgroCebada' }).click(); await expect(page.getByTestId('map')).toBeVisible();
  await page.unrouteAll({ behavior: 'ignoreErrors' });
});
