import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("loads with the correct H1 and title", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/ZynReach/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "One Platform to Grow, Automate, and Run Your Business."
    );
  });

  test("has exactly one H1 (SRS 23 semantic HTML requirement)", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("has a working skip link", async ({ page }) => {
    await page.goto("/en");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  test("primary CTAs navigate correctly", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("main").getByRole("link", { name: "Book a Demo" }).first().click();
    await expect(page).toHaveURL(/\/demo$/);
  });

  test("renders Organization and WebSite structured data", async ({ page }) => {
    await page.goto("/en");
    // JsonLd renders via next/script strategy="afterInteractive" (see that
    // component's own comment) — the tags are injected after hydration,
    // not present in the initial HTML, so wait for them to attach before
    // reading contents rather than racing the injection.
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScripts).toHaveCount(2);
    const scripts = await jsonLdScripts.allTextContents();
    const types = scripts.map((s) => JSON.parse(s)["@type"]);
    expect(types).toContain("Organization");
    expect(types).toContain("WebSite");
  });
});
