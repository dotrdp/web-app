import { test, expect } from '@playwright/test';

test('Static demo resets analyses on reload and uses no API, cookies or browser storage', async ({ page, context }) => {
  test.skip(process.env.AGROCEBADA_DEMO !== '1', 'Applies to the static demo build.');
  const apiRequests: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url());
  });
  const login = async () => {
    await page.getByRole('button', { name: 'Usar cuenta de prueba' }).click();
    await page.getByRole('button', { name: 'Entrar a AgroCebada' }).click();
    await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count', '197');
  };
  await page.goto('/');
  await expect(page.getByText('Demo: los cambios se pierden al recargar la página.')).toBeVisible();
  await login();
  await page.getByRole('button', { name: 'Analizar parcela', exact: true }).first().click();
  await page.getByRole('button', { name: 'Analizar parcela', exact: true }).last().click();
  await expect(page.getByText('Guardado en tus análisis.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Volver al mapa', exact: true }).click();
  await page.getByRole('button', { name: 'Mis parcelas', exact: false }).first().click();
  await expect(page.getByText('1 guardados', { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('button', { name: 'Entrar a AgroCebada' })).toBeVisible();
  // Return to the map because a hash route survives a page reload.
  await page.goto('/');
  await login();
  await page.getByRole('button', { name: 'Mis parcelas', exact: false }).first().click();
  await expect(page.getByText('0 guardados', { exact: true })).toBeVisible();
  expect(apiRequests).toEqual([]);
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
});
