import { expect, type Page } from '@playwright/test';

// The shadcn sidebar is off-canvas: expanded/collapsed on desktop, a sheet on mobile.
async function sidebarOpen(page: Page) {
  // The mobile sheet content also carries data-slot="sidebar" (plus Radix's data-state), so exclude it.
  const desktop = page.locator('[data-slot="sidebar"][data-state]:not([data-mobile])');
  if (await desktop.count()) return await desktop.first().getAttribute('data-state') === 'expanded';
  return await page.getByRole('dialog', { name: 'Navegación y cuenta' }).isVisible();
}
export async function openSidebar(page: Page) {
  if (!await sidebarOpen(page)) await page.getByRole('button', { name: 'Abrir navegación' }).first().click();
  await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toBeInViewport();
}
export async function navigateSidebar(page: Page, name: string) {
  await openSidebar(page);
  await page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name, exact: true }).click();
  // On mobile the sheet closes after navigating; wait so later steps don't hit its exit transition.
  await page.locator('[data-slot="sheet-content"]').waitFor({ state: 'detached' });
}
// The account menu is the sidebar footer's dropdown; its entries are menu items.
export async function openAccount(page: Page, username: string) {
  await openSidebar(page);
  await page.getByRole('button', { name: `Abrir menú de ${username}` }).click();
}
// Productor / Análisis Pro lives in the sidebar footer.
export async function choosePresentation(page: Page, name: 'Productor' | 'Análisis Pro') {
  await openSidebar(page);
  await page.getByRole('group', { name: 'Presentación' }).getByRole('button', { name, exact: true }).click();
}
