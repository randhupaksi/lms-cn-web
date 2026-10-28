import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : undefined,
  timeout: 30_000,
  globalTimeout: isCI ? 10 * 60 * 1000 : 0,
  expect: { timeout: 5_000 },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  outputDir: "test-results",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer:
    process.platform === "win32" && !isCI
      ? undefined
      : {
          command: isCI
            ? "node .next/standalone/server.js"
            : "node ./node_modules/next/dist/bin/next dev --turbopack --hostname 127.0.0.1 --port 3000",
          url: "http://127.0.0.1:3000/login",
          reuseExistingServer: !isCI,
          timeout: 90_000,
          env: {
            ...process.env,
            NEXT_PUBLIC_API_BASE_URL: "http://localhost:8080/api/v1",
            HOSTNAME: "127.0.0.1",
            PORT: "3000",
          },
        },
});
