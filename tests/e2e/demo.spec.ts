import { test, expect } from '@playwright/test';
test('The public demo keeps drawn parcels in page memory only, with no app cookies or browser storage', async ({ page, context }) => {
  test.skip(process.env.AGROCEBADA_DEMO !== '1', 'Public demo only');
  const requests: string[] = []; page.on('request', r => { const path = new URL(r.url()).pathname; if (path.startsWith('/api/') && !/^\/api\/(imagery|segmentation)\//.test(path)) requests.push(path); });
  const login = async () => { await page.getByRole('button', { name: 'Usar cuenta de prueba' }).click(); await page.getByRole('button', { name: 'Entrar a AgroCebada' }).click(); await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count', '197'); };
  await page.goto('/'); await login();
  await page.keyboard.press('Alt+2');
  await expect(page.getByRole('region', { name: 'Panel de control' })).toBeVisible();
  await page.goto('/'); await page.reload(); await login(); expect(requests).toEqual([]);
  // Cloudflare may set its hosting clearance cookie independently of the app.
  const publicHost = new URL(page.url()).hostname === 'agrocebada.datascience-mexico.com';
  const appCookies = (await context.cookies()).filter(c => !(publicHost && c.name === 'cf_clearance' && c.domain === '.datascience-mexico.com' && c.httpOnly && c.secure));
  expect(appCookies.map(c => c.name)).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
});
