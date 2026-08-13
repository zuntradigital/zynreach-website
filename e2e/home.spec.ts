import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("loads with the correct H1 and title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/ZynReach/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "One platform for AI-powered revenue growth"
    );
  });

  test("has exactly one H1 (SRS 23 semantic HTML requirement)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("has a working skip link", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  test("primary CTAs navigate correctly", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("main").getByRole("link", { name: "Book a Demo" }).first().click();
    await expect(page).toHaveURL(/\/demo$/);
  });

  test("renders Organization and WebSite structured data", async ({ page }) => {
    await page.goto("/");
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = scripts.map((s) => JSON.parse(s)["@type"]);
    expect(types).toContain("Organization");
    expect(types).toContain("WebSite");
  });
});
