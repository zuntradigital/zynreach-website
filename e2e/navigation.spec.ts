import { test, expect } from "@playwright/test";

test.describe("Navigation (desktop nav)", () => {
  // The mega menu trigger only renders above the lg breakpoint (SRS 22:
  // "Collapses to hamburger trigger below Tablet breakpoint") — force a
  // desktop viewport so these tests are meaningful under both Playwright
  // projects, not just the "desktop" one.
  test.use({ viewport: { width: 1440, height: 900 } });

  test("mega menu opens and links to capability pages", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Product" }).click();
    // Scoped to the open mega menu panel — "CRM" also appears in the
    // homepage's own capability cards and footer, so an unscoped locator
    // matches multiple elements.
    const megaMenu = page.getByRole("menu", { name: "Product" });
    const crmLink = megaMenu.getByRole("menuitem", { name: "CRM" });
    await expect(crmLink).toBeVisible();
    await crmLink.click();
    await expect(page).toHaveURL(/\/platform\/crm$/);
  });

  test("Escape closes an open mega menu and returns focus to the trigger", async ({ page }) => {
    await page.goto("/en");
    const trigger = page.getByRole("button", { name: "Product" });
    await trigger.click();
    const megaMenu = page.getByRole("menu", { name: "Product" });
    await expect(megaMenu.getByRole("menuitem", { name: "CRM" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(megaMenu).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});

test.describe("Navigation", () => {
  test("footer legal links resolve to real pages", async ({ page }) => {
    await page.goto("/en");
    // On mobile, footer link groups (including Legal) are collapsed into
    // accordions (FooterAccordionGroup) and must be expanded first; on
    // desktop, this button doesn't exist in the accessible tree at all
    // (rendered inside a `sm:hidden` mobile-only section), so this is a
    // no-op there.
    const legalToggle = page.getByRole("button", { name: "Legal" });
    if (await legalToggle.isVisible().catch(() => false)) {
      await legalToggle.click();
    }
    await page.getByRole("link", { name: "Privacy Policy" }).click();
    await expect(page).toHaveURL(/\/legal\/privacy$/);
    await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
  });

  test("a nonexistent route returns the custom 404 page with a real 404 status", async ({ page }) => {
    const response = await page.goto("/en/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("We couldn't find that page")).toBeVisible();
  });
});

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("collapses to a hamburger menu and opens the mobile drawer", async ({ page }) => {
    await page.goto("/en");
    const hamburger = page.getByRole("button", { name: "Open menu" });
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    await expect(page.getByRole("button", { name: "Close menu" })).toBeVisible();
  });
});
