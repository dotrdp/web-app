// Drives Milli's chat in a real browser tab, for trying a model (e.g. MILLI_MODEL=relay) end to end:
// logs in, opens the chat, sends each prompt, waits for Milli's answer, and saves a screenshot of
// every figure it drew (in the chat and enlarged), the whole page after each answer (the app map with
// Milli's temporary layers) and the answer text.
//
//   node scripts/milli-chat.mjs <base-url> <out-dir> "<prompt>" ["<next prompt>" …]
import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [base, out, ...prompts] = process.argv.slice(2);
if (!base || !out || !prompts.length) { console.log('usage: milli-chat.mjs <base-url> <out-dir> "<prompt>" …'); process.exit(1); }
await mkdir(out, { recursive: true });
const browserPath = '/home/rd/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (existsSync(browserPath) ? browserPath : undefined) });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const log = []; page.on('pageerror', e => log.push(`pageerror: ${e.message}`)); page.on('console', m => { if (m.type() === 'error') log.push(`console: ${m.text()}`); });
const timeout = Number(process.env.TURN_MINUTES || 45) * 60_000;
try {
  await page.goto(base);
  await page.getByRole('button', { name: 'Usar cuenta de prueba' }).click();
  await page.getByRole('button', { name: 'Entrar a AgroCebada' }).click();
  await page.getByTestId('map').waitFor();
  await page.getByRole('button', { name: 'Abrir Agente de IA Milli' }).click();
  const chat = page.getByRole('region', { name: 'Agente de IA Milli' });
  for (const [k, prompt] of prompts.entries()) {
    const answers = await chat.getByLabel('Respuesta de Milli').count();
    await chat.getByRole('textbox', { name: 'Mensaje para Milli' }).fill(prompt);
    await chat.getByRole('button', { name: 'Enviar mensaje' }).click();
    console.log(`[${k + 1}] sent: ${prompt}`);
    // Done when a new answer appears or the run stops with an error.
    await page.waitForFunction(n => document.querySelectorAll('[aria-label="Respuesta de Milli"]').length > n || !!document.querySelector('[data-milli] [role="alert"]'), answers, { timeout, polling: 1000 });
    await page.waitForTimeout(2500);
    const msg = chat.locator('[aria-label="Respuesta de Milli"]').last();
    const answer = await msg.count() ? await msg.innerText() : '(sin respuesta)';
    const figures = chat.getByRole('figure');
    const n = await figures.count();
    for (let i = 0; i < n; i++) {
      const f = figures.nth(i); await f.scrollIntoViewIfNeeded(); await page.waitForTimeout(1200);
      await f.screenshot({ path: path.join(out, `turn${k + 1}-figure${i + 1}-chat.png`) });
      const open = f.getByRole('button', { name: 'Ampliar figura' });
      if (await open.count()) { await open.click(); await page.waitForTimeout(2500); await page.screenshot({ path: path.join(out, `turn${k + 1}-figure${i + 1}-large.png`) }); await page.getByRole('dialog').getByRole('button', { name: /close|cerrar/i }).click(); await page.waitForTimeout(400); }
    }
    await page.screenshot({ path: path.join(out, `turn${k + 1}-page.png`) }); // the app, with the map and any temporary layers
    await writeFile(path.join(out, `turn${k + 1}-answer.md`), `# ${prompt}\n\n${answer}\n`);
    console.log(`[${k + 1}] answered; ${n} figure(s) in the chat so far`);
  }
} catch (e) { log.push(`driver: ${e.message}`); console.log(`driver error: ${e.message}`); }
await page.screenshot({ path: path.join(out, 'final.png') });
await writeFile(path.join(out, 'console.log'), log.join('\n'));
await browser.close();
console.log('done');
