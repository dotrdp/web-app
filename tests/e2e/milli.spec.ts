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
  await page.mouse.click(720, 640); // the map, away from the chat
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
  await page.mouse.click(720, 640);
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

test('Milli builds figures call by call, draws them in the chat with Plotly and reviews a PNG of each', async ({ page }) => {
  test.setTimeout(90_000);
  const chat = await openMilli(page);
  await chat.getByRole('button', { name: /Grafica el rendimiento estimado contra el registrado/ }).click();
  const fig = chat.getByRole('figure', { name: '¿Qué tan bien estima el modelo?' });
  await expect(fig).toBeVisible({ timeout: 45_000 });
  await expect(fig).toContainText('138 parcelas con rendimiento registrado');
  // Plotly drew both panels: 138 dots (one series per state), the y = x line, the error bars and their legend.
  await expect(fig.locator('.scatterlayer .point')).toHaveCount(138);
  await expect(fig.locator('.shapelayer path')).toHaveCount(2);
  await expect(fig.locator('.barlayer .point')).toHaveCount(6);
  for (const label of ['Hidalgo', 'Puebla', 'Tlaxcala', 'MAE', 'RMSE']) await expect(fig.locator('[class*="legend"][class$="text"]').filter({ hasText: label })).toHaveCount(1);
  await expect(fig.locator('.xtitle').first()).toHaveText('Registrado (t/ha)');
  await expect(chat.getByLabel('Respuesta de Milli')).toContainText('MAE global');
  // Each step is an action, and plot_show handed the model a review image.
  await expect(chat.getByRole('button', { name: /^Nueva figura «¿Qué tan bien estima el modelo\?»,/ })).toBeVisible();
  await chat.getByRole('button', { name: /^Mostrar la figura en el chat,/ }).click();
  await expect(chat.getByText(/ancho del chat \(400 px, como la ve el usuario\)/)).toBeVisible();
  // Full size.
  await fig.getByRole('button', { name: 'Ampliar figura' }).click();
  const dialog = page.getByRole('dialog', { name: '¿Qué tan bien estima el modelo?' });
  await expect(dialog.locator('.scatterlayer .point')).toHaveCount(138);
  await dialog.getByRole('button', { name: /close|cerrar/i }).click();
});

test('Milli tests spatial autocorrelation and maps the LISA clusters', async ({ page }) => {
  test.setTimeout(90_000);
  const chat = await openMilli(page);
  await chat.getByRole('button', { name: /autocorrelación espacial/ }).click();
  const fig = chat.getByRole('figure', { name: '¿El error del modelo se agrupa en el espacio?' });
  await expect(fig).toBeVisible({ timeout: 45_000 });
  await expect(fig.locator('.maplibregl-canvas')).toHaveCount(1);
  await expect(fig.locator('[class*="legend"][class$="text"]').filter({ hasText: 'no significativo' })).toHaveCount(2); // the Moran panel's legend and the map's
  await expect(fig.locator('.gtitle, .annotation-text').filter({ hasText: 'Semivariograma' })).toHaveCount(1);
  await expect(chat.getByLabel('Respuesta de Milli')).toContainText('I de Moran del error');
  await expect(chat.getByRole('button', { name: /^Autocorrelación espacial de error,/ })).toBeVisible();
  // What Milli drew on the map figure is on the app's map too: a temporary layer, marked and removable.
  const chip = page.getByRole('group', { name: 'Capa temporal de Milli: Clusters LISA (p < 0.05)' });
  await expect(chip).toBeVisible();
  await expect(chip).toContainText('no significativo');
  await page.getByRole('button', { name: 'Cerrar Agente de IA Milli' }).click();
  const panel = page.getByRole('region', { name: 'Capas y simbología' });
  if (!(await panel.isVisible())) await page.getByRole('button', { name: 'Capas y simbología' }).first().click();
  await expect(panel.getByLabel('Capas temporales de Milli').getByText('Clusters LISA (p < 0.05)')).toBeVisible();
  await chip.getByRole('button', { name: 'Quitar la capa temporal «Clusters LISA (p < 0.05)»' }).click();
  await expect(chip).toHaveCount(0);
  await expect(page.getByLabel('Capas temporales de Milli')).toHaveCount(0);
});

test('An outside MCP agent works through this tab\'s own MCP address: shown in Ajustes, a figure shown here, a download only after «Permitir»', async ({ page }) => {
  test.setTimeout(90_000);
  const { Client } = await import('@modelcontextprotocol/sdk/client/index.js');
  const { StreamableHTTPClientTransport } = await import('@modelcontextprotocol/sdk/client/streamableHttp.js');
  await openMilli(page);
  await page.getByRole('button', { name: 'Cerrar Agente de IA Milli' }).click();
  // Ajustes → MCP de esta pestaña: the tab's own address.
  await page.getByRole('button', { name: 'Ajustes' }).first().click();
  const address = page.getByLabel('Dirección MCP de esta pestaña');
  await expect(address).toHaveText(/\/mcp\/[\w-]{30,}$/);
  const url = (await address.textContent())!;

  const client = new Client({ name: 'Analista de prueba', version: '1' });
  await client.connect(new StreamableHTTPClientTransport(new URL(url)));
  const call = (name: string, args: Record<string, unknown> = {}) => client.callTool({ name, arguments: args }) as Promise<{ isError?: boolean; content: { type: string; text?: string }[] }>;
  expect(JSON.parse((await call('screen_info')).content[0].text!).connected).toBe(true);
  // A figure the agent shows appears in this tab (it has no chat), and its PNG goes back to the agent.
  await call('data_load', { source: 'parcelas', as: 'p', filters: { group: 'con_rendimiento' } });
  await call('plot_figure', { title: 'Figura del agente' });
  await call('plot_scatter', { dataset: 'p', x: 'observed', y: 'predicted', color_by: 'state' });
  const shown = await call('plot_show', {});
  expect(shown.content.some(c => c.type === 'image')).toBe(true);
  const panel = page.getByRole('region', { name: 'Figura de Analista de prueba' });
  await expect(panel.getByRole('figure', { name: 'Figura del agente' }).locator('.scatterlayer .point')).toHaveCount(138);
  await panel.getByRole('button', { name: 'Cerrar la figura «Figura del agente»' }).click();
  await expect(panel).toHaveCount(0);
  // A download waits for the person here: the dialog names the agent; «Permitir» downloads.
  const downloads: string[] = []; page.on('download', d => downloads.push(d.suggestedFilename()));
  const pending = call('request_export', { kind: 'estimaciones_csv', scope: 'todas', reason: 'Para el informe' });
  const dialog = page.getByRole('dialog', { name: '¿Permitir una descarga?' });
  await expect(dialog).toContainText('Analista de prueba quiere descargar');
  await dialog.getByRole('button', { name: 'Permitir descarga' }).click();
  expect(JSON.parse((await pending).content[0].text!).approved).toBe(true);
  await expect.poll(() => downloads.length).toBe(1);
  await client.close();
});
