import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const existingBrowser = '/home/rd/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
export default defineConfig({
  testDir: './tests/e2e', workers: 1, fullyParallel: false, timeout: 45_000,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:8081', viewport: { width: 1440, height: 1100 }, trace: 'retain-on-failure', launchOptions: { executablePath: process.env.CHROMIUM_PATH || (existsSync(existingBrowser) ? existingBrowser : undefined) } },
  webServer: { command: 'npm run dev', url: 'http://127.0.0.1:8081/api/health', reuseExistingServer: false, timeout: 30_000, env: { PORT: '8081', STATE_DIR: `/tmp/agrocebada-e2e-${Date.now()}` } },
});
