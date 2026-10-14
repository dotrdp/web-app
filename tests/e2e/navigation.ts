import type { Page } from '@playwright/test';

export async function openSidebar(page: Page) {
  if (!await page.getByRole('complementary', { name: 'Menú lateral' }).isVisible()) await page.getByRole('button', { name: 'Abrir navegación' }).click();
}
export async function navigateSidebar(page: Page, name: string) {
  await openSidebar(page);
  await page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name, exact: true }).click();
  // The drawer closes after navigating; wait so later steps don't hit its exit transition.
  await page.locator('.nav-drawer').waitFor({ state: 'detached' });
}
// The account menu lives in the header, outside the navigation drawer.
export async function openAccount(page: Page, username: string) {
  await page.getByRole('button', { name: `Abrir menú de ${username}` }).click();
}

// Productor / Análisis Pro lives in the account menu (desktop) and the navigation drawer (mobile).
export async function choosePresentation(page: Page, name: 'Productor' | 'Análisis Pro') {
  const direct = page.getByRole('button', { name, exact: true });
  if (!await direct.isVisible()) {
    const account = page.getByRole('button', { name: /^Abrir menú de / });
    if (await account.isVisible()) await account.click(); else await page.getByRole('button', { name: 'Abrir navegación' }).click();
  }
  await page.getByRole('button', { name, exact: true }).click();
}
