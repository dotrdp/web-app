import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const existingBrowser = '/home/rd/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
const demo = process.env.AGROCEBADA_DEMO === '1';
const localUrl = `http://127.0.0.1:${demo ? 8082 : 8081}`;
export default defineConfig({
  testDir: './tests/e2e', workers: 1, fullyParallel: false, timeout: 45_000,
  reporter: 'list',
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || localUrl, viewport: { width: 1440, height: 1100 }, trace: 'retain-on-failure', launchOptions: { executablePath: process.env.CHROMIUM_PATH || (existsSync(existingBrowser) ? existingBrowser : undefined) } },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: demo ? 'npm run preview:demo' : 'npm run dev',
    url: demo ? localUrl : `${localUrl}/api/health`,
    reuseExistingServer: false, timeout: 30_000,
    env: { PORT: '8081', STATE_DIR: `/tmp/agrocebada-e2e-${Date.now()}` },
  },
});
