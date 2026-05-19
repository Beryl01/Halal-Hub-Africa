import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 1,
  workers: 1,
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL: 'https://halalhub.finbros.co.ke',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 60000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
