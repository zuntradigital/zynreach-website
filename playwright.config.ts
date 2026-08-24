import { defineConfig, devices } from "@playwright/test";

/** SRS Section 29: End-to-End Tests, Accessibility Tests, Responsive Tests. */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "line",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    // Bare `npm run start` (no --hostname/--port overrides), checked
    // against `localhost` rather than `127.0.0.1` — this exact
    // command+URL combination is proven to start and respond reliably
    // in this project's own CI runner (lighthouserc.js's Lighthouse CI
    // job uses the identical `startServerCommand: "npm run start"` /
    // `http://localhost:3000/...` pattern in the very same workflow run
    // and serves real pages within seconds). The previous explicit
    // `--hostname 127.0.0.1 --port 3000` + `http://127.0.0.1:3000`
    // variant reliably never became reachable on GitHub's Ubuntu
    // runners, despite working locally — this aligns Playwright with
    // the configuration already confirmed to work in the same CI
    // environment instead.
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
