const { chromium } = require("playwright");

const routes = [
  "/", "/platform", "/platform/ai-assistants", "/pricing", "/solutions", "/solutions/sales",
  "/trial", "/contact", "/industries", "/industries/healthcare", "/security", "/enterprise",
  "/about", "/careers", "/careers/senior-frontend-engineer", "/search", "/blog",
  "/blog/why-crm-data-goes-stale", "/customers", "/customers/northwind-traders", "/docs",
  "/docs/getting-started", "/docs/api", "/docs/api/list-contacts", "/resources",
  "/resources/guides", "/resources/guides/crm-migration-checklist", "/resources/webinars",
  "/resources/webinars/ai-assistants-deep-dive", "/faq", "/status", "/changelog",
  "/integrations", "/integrations/google-workspace", "/partners", "/demo", "/compliance",
  "/legal/privacy",
];

const locales = ["en", "ar"];
const breakpoints = [
  { name: "mobile", width: 375, height: 800 },
  { name: "desktop", width: 1280, height: 900 },
];

(async () => {
  const browser = await chromium.launch();
  let failCount = 0;

  for (const locale of locales) {
    for (const bp of breakpoints) {
      const context = await browser.newContext({ viewport: { width: bp.width, height: bp.height } });
      const page = await context.newPage();
      for (const route of routes) {
        try {
          await page.goto(`http://localhost:3000/${locale}${route}`, { waitUntil: "networkidle", timeout: 15000 });
          const result = await page.evaluate(() => ({
            docWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
          }));
          const overflow = result.scrollWidth - result.docWidth;
          if (overflow > 1) {
            failCount++;
            console.log(`OVERFLOW [${locale}/${bp.name}] ${route}: +${overflow}px`);
          }
        } catch (err) {
          console.log(`ERROR [${locale}/${bp.name}] ${route}: ${err.message}`);
        }
      }
      await context.close();
    }
  }

  console.log(failCount === 0 ? "\nNO OVERFLOW FOUND across all locales/breakpoints/routes" : `\n${failCount} overflow instances found`);
  await browser.close();
})();
