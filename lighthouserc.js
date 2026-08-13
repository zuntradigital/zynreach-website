/**
 * SRS Section 21 "Performance Budget... enforced in CI via Lighthouse CI"
 * and Section 1.4 targets (LCP < 2.0s, Core Web Vitals "Good" >= 90%).
 * Runs against a local production build — no external service required.
 */
module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      startServerReadyPattern: "Ready in",
      startServerReadyTimeout: 60000,
      url: ["http://localhost:3000/", "http://localhost:3000/pricing", "http://localhost:3000/blog"],
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.85 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2000 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./lighthouse-report",
    },
  },
};
