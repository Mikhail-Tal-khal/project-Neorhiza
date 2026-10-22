import { defineConfig, devices } from "@playwright/test";

/**
 * E2E suite. Runs against the production build (`npm run build` first).
 *  - :3000  site with a real delivery target (local webhook sink on :4599)
 *  - :3001  site with NO delivery configured (verifies honest failure)
 *
 * Set PLAYWRIGHT_CHROMIUM_PATH to use a locally cached Chromium instead of
 * the Playwright-managed download. Set E2E_BASE_URL to test a server you
 * started yourself (no servers are launched; form-delivery tests need the
 * :4599 sink and :3001 server, so run only the page specs that way).
 */
const PORT = 3000;
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;
/** Point the suite at an already-running server (e.g. `npm run dev`) instead. */
const externalBaseURL = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  timeout: 60_000,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: externalBaseURL ?? `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    launchOptions: { executablePath },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], launchOptions: { executablePath } } }],
  webServer: externalBaseURL ? undefined : [
    {
      command: "node tests/support/webhook-sink.mjs",
      url: "http://127.0.0.1:4599/health",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `npx next start -p ${PORT}`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        CONTACT_WEBHOOK_URL: "http://127.0.0.1:4599/hook",
        CONTACT_WEBHOOK_TOKEN: "e2e-test-token",
        CONTACT_RATE_LIMIT_MAX: "5",
        CONTACT_RATE_LIMIT_WINDOW_SECONDS: "600",
      },
    },
    {
      command: "npx next start -p 3001",
      url: "http://localhost:3001",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { CONTACT_WEBHOOK_URL: "", RESEND_API_KEY: "" },
    },
  ],
});
