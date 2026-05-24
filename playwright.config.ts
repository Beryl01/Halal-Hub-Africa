import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',

  // 60 seconds per test — the site is hosted on a shared server and can be
  // slow on the first navigation of a session
  timeout: 60000,

  // One retry handles the occasional network blip on the live site without
  // masking real failures
  retries: 1,

  // Single worker because all tests hit the same live site. Running in parallel
  // would just hammer it and make timing issues worse.
  workers: 1,

  expect: {
    // Most assertions are on visible elements after networkidle, so 10s is plenty
    timeout: 10000,
  },

  use: {
    baseURL: 'https://halalhub.finbros.co.ke',

    // Only capture screenshots and video when something actually fails — keeps
    // the output directory clean on normal runs
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
