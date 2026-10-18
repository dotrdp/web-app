import { test, expect, type Page } from '@playwright/test';

// Agente de IA Milli end to end, with the scripted model (MILLI_PACE slows it so the steps can be seen).
async function openMilli(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Usar cuenta de prueba' }).click();
  await page.getByRole('button', { name: 'Entrar a AgroCebada' }).click();
  await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count', '197');
  await expect(page.getByRole('heading', { name: 'Preparando tu mapa' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Abrir Agente de IA Milli' }).click();
  return page.getByRole('region', { name: 'Agente de IA Milli' });
}

test('Milli works through a task and its actions, asks before downloading, answers and takes feedback', async ({ page }) => {
  const chat = await openMilli(page);
  const downloads: string[] = [];
  page.on('download', d => downloads.push(d.suggestedFilename()));
  await chat.getByRole('button', { name: /Compara el NDVI de julio 2025/ }).click();

  // The typing indicator says Milli is going; its task card counts the steps as they finish.
  await expect(chat.locator('[data-variant="inline"][data-state="active"]').first()).toBeVisible();
  await expect(chat.getByText(/Milli está trabajando · \d de 5 pasos/)).toBeVisible();
  // The screen follows Milli to the dashboard, and the agenda lists what it did.
  await expect(page.getByRole('region', { name: 'Panel de control' })).toBeVisible();
  await expect(chat.getByRole('button', { name: /^Buscar parcelas,/ })).toBeVisible();
  await expect(chat.getByRole('button', { name: /^Leer NDVI y lluvia de \d+ parcelas,/ })).toBeVisible();

  // The export waits for permission: nothing downloads until the user allows it.
  const allow = chat.getByRole('button', { name: 'Permitir descarga' });
  await expect(allow).toBeVisible({ timeout: 30_000 });
  await expect(chat.getByText('Milli espera tu permiso')).toBeVisible();
  await page.waitForTimeout(600);
  expect(downloads).toEqual([]);
  const download = page.waitForEvent('download');
  await allow.click();
  expect((await download).suggestedFilename()).toBe('agrocebada-seleccion.csv');

  // finish_task ends the sequence: the answer shows, the task is done, the indicator stops.
  await expect(chat.getByLabel('Respuesta de Milli')).toContainText('NDVI de julio de 2025');
  await expect(chat.getByLabel('Respuesta de Milli')).toContainText('Descargué la tabla');
  await expect(chat.getByText('Terminado · 5 de 5 pasos')).toBeVisible();
  await expect(chat.getByText(/Descargado · agrocebada-seleccion\.csv · \d+ filas/)).toBeVisible();
  await expect(chat.locator('[data-variant="inline"][data-state="active"]')).toHaveCount(0);
  // The notes Milli wrote are on screen.
  await expect(page.getByRole('textbox', { name: 'Notas' })).toHaveValue(/Milli ·[\s\S]*NDVI julio 2025/);

  // The exploration opens the chain of thought; each stretch of thinking has its check.
  await chat.getByRole('button', { name: /Exploración/ }).click();
  await expect(chat.getByText(/^Pensó/).first()).toBeVisible();

  // A thumbs down asks for a suggestion.
  await chat.getByRole('button', { name: 'No fue útil' }).click();
  await expect(chat.getByText('¿Qué deberíamos mejorar?')).toBeVisible();
  await chat.getByRole('button', { name: 'Datos incorrectos' }).click();
  await chat.getByRole('textbox', { name: 'Sugerencia' }).fill('Incluye la lluvia de cada parcela.');
  await chat.getByRole('button', { name: 'Enviar', exact: true }).click();
  await expect(chat.getByText('Gracias, nos ayuda a mejorar a Milli').first()).toBeVisible();
});

test('Clicking away from Milli stops following; the eye shows what it did and goes away when it finishes', async ({ page }) => {
  const chat = await openMilli(page);
  const working = chat.locator('[data-variant="inline"][data-state="active"]').first();
  const eye = page.getByRole('button', { name: 'Ver lo que hace Milli' });
  const watching = page.getByRole('button', { name: 'Estás viendo lo que hace Milli' });

  await chat.getByRole('button', { name: /Muéstrame en el mapa las parcelas de Puebla/ }).click();
  await expect(working).toBeVisible();
  // Take over once the task starts (a new task always starts followed), before Milli touches the map.
  await expect(chat.getByText('Milli está trabajando · 0 de 3 pasos')).toBeVisible();
  await expect(watching).toBeVisible(); // the screen follows Milli, and says so
  await page.mouse.click(1300, 620); // the map, away from the chat
  await expect(eye).toBeVisible();
  await expect(watching).toHaveCount(0);
  await expect(chat.getByLabel('Respuesta de Milli')).toBeVisible({ timeout: 30_000 });
  await expect(eye).toHaveCount(0);
  await expect(watching).toHaveCount(0);
  // Nothing Milli changed was applied while the user had taken over.
  await expect(page.getByTestId('map')).toHaveAttribute('data-parcel-count', '197');

  // While Milli waits for permission to export, the eye replays what it changed and the screen follows again.
  await chat.getByRole('textbox', { name: 'Mensaje para Milli' }).fill('Compara el NDVI de julio 2025 de las parcelas reservadas de Calpulalpan y exporta la tabla');
  await chat.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(chat.getByText('Milli está trabajando · 0 de 5 pasos')).toBeVisible();
  await page.mouse.click(1300, 620);
  await expect(eye).toBeVisible();
  await expect(chat.getByRole('button', { name: 'Permitir descarga' })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('region', { name: 'Panel de control' })).toHaveCount(0);
  await eye.click();
  await expect(page.getByRole('region', { name: 'Panel de control' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Ver en el mapa · \d+/ })).toBeVisible();
  await expect(eye).toHaveCount(0);
  await expect(watching).toBeVisible();
  await chat.getByRole('button', { name: 'Rechazar' }).click();
  await expect(chat.getByLabel('Respuesta de Milli').nth(1)).toContainText('no diste permiso');
  await expect(chat.getByText('Rechazaste la descarga.')).toBeVisible();
});

test('Milli only takes CSV files: images are refused in plain words, a CSV is read and answered', async ({ page }) => {
  const chat = await openMilli(page);
  await expect(chat.getByText('Solo archivos CSV · hasta 2 MB · sin imágenes')).toBeVisible();
  const input = chat.locator('input[type=file]');
  await expect(input).toHaveAttribute('accept', '.csv,text/csv');
  await input.setInputFiles({ name: 'foto-parcela.png', mimeType: 'image/png', buffer: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]) });
  await expect(chat.getByRole('alert')).toContainText('«foto-parcela.png» es una imagen. Milli solo acepta archivos CSV.');
  await input.setInputFiles({ name: 'rendimientos.csv', mimeType: 'text/csv', buffer: Buffer.from('ID_POLIGONO;rendimiento\nAGC_001;3,2\nAGC_025;2,9\n') });
  await expect(chat.getByText('rendimientos.csv')).toBeVisible();
  await chat.getByRole('textbox', { name: 'Mensaje para Milli' }).fill('Compara este archivo con las estimaciones');
  await chat.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(chat.getByText('CSV · 2 filas · 2 columnas')).toBeVisible();
  const answer = chat.getByLabel('Respuesta de Milli');
  await expect(answer).toContainText('rendimientos.csv', { timeout: 30_000 });
  await expect(answer).toContainText('Coinciden 2 parcelas');
});
