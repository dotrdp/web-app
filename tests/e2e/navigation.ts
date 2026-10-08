import type { Page } from '@playwright/test';

export async function openSidebar(page: Page) {
  if (!await page.getByRole('complementary', { name: 'Menú lateral' }).isVisible()) await page.getByRole('button', { name: 'Abrir navegación' }).click();
}
export async function navigateSidebar(page: Page, name: string) {
  await openSidebar(page);
  await page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name, exact: true }).click();
}
export async function openAccount(page: Page, username: string) {
  await openSidebar(page);
  await page.getByRole('button', { name: `Abrir menú de ${username}` }).click();
}
