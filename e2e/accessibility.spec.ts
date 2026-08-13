import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** SRS Section 23/29: WCAG 2.2 AA conformance, automated accessibility tests. */
const pagesToAudit = ["/", "/platform", "/pricing", "/demo", "/contact", "/blog", "/docs/getting-started", "/faq"];

for (const path of pagesToAudit) {
  test(`${path} has no critical accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });
}
