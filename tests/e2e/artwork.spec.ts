import { test, expect } from '@playwright/test';

test('Login hero renders the dot-matrix headline, particles and the data globe on desktop and mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 }); await page.goto('/');
  const story = page.locator('.login-story');
  await expect(story.getByRole('heading', { name: 'El campo tiene mucho que contarte.' })).toBeVisible();
  expect(await story.locator('h1').evaluate(e => getComputedStyle(e).fontFamily)).toContain('Geist Pixel');
  await expect(page.locator('.login-particles')).toBeVisible();
  const globe = page.locator('.globe-canvas'); await expect(globe).toBeVisible();
  await expect.poll(() => globe.evaluate(e => getComputedStyle(e).opacity), { timeout: 20_000 }).toBe('1');
  expect(await page.locator('video').count()).toBe(0);
  const storyBox = (await story.boundingBox())!, form = (await page.locator('.login-main').boundingBox())!;
  expect(storyBox.width).toBeGreaterThan(form.width); expect(form.x).toBeGreaterThanOrEqual(storyBox.width - 1);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(async () => (await story.boundingBox())!.height).toBe(330);
  expect((await page.locator('.login-main').boundingBox())!.y).toBeGreaterThanOrEqual(330);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test('A slow globe does not block signing in', async ({ page }) => {
  await page.route('**/assets/Globe*', () => new Promise(() => {}));
  await page.route('**/src/Globe.tsx*', () => new Promise(() => {}));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Usar cuenta de prueba' }).click(); await page.getByRole('button', { name: 'Entrar a AgroCebada' }).click(); await expect(page.getByTestId('map')).toBeVisible();
  await page.unrouteAll({ behavior: 'ignoreErrors' });
});
