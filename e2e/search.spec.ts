import { test, expect } from "@playwright/test";

test.describe("Site search", () => {
  test("opens from the nav, returns results, and navigates on selection", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search" }).click();
    const dialog = page.getByRole("dialog", { name: "Site search" });
    await expect(dialog).toBeVisible();

    await page.getByRole("combobox").fill("pricing");
    const firstResult = dialog.getByRole("option").first();
    await expect(firstResult).toBeVisible();
    await firstResult.click();
    await expect(page).not.toHaveURL("/");
  });

  test("shows a no-results state with suggestions for a nonsense query", async ({ page }) => {
    await page.goto("/search?q=zzzznonexistentqueryzzzz");
    await expect(page.getByText(/No results for/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Platform" })).toBeVisible();
  });

  test("deep-linked query pre-fills and filters results", async ({ page }) => {
    await page.goto("/search?q=CRM");
    await expect(page.getByRole("textbox")).toHaveValue("CRM");
    await expect(page.getByText(/result/)).toBeVisible();
  });
});
