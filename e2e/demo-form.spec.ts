import { test, expect } from "@playwright/test";

test.describe("Book a Demo form", () => {
  test("blocks submission with inline validation errors when empty", async ({ page }) => {
    await page.goto("/demo");
    await page.getByRole("button", { name: "Book a Demo" }).click();
    await expect(page.getByText("Full name is required.")).toBeVisible();
    await expect(page.getByText("Work email is required.")).toBeVisible();
  });

  test("shows a soft warning (not a hard block) for a personal email", async ({ page }) => {
    await page.goto("/demo");
    await page.getByLabel("Work Email").fill("jane@gmail.com");
    await expect(page.getByText(/looks like a personal email address/)).toBeVisible();
  });

  test("submits successfully with valid data and shows the confirmation state", async ({ page }) => {
    await page.goto("/demo");
    await page.getByLabel("Full Name").fill("Playwright Test");
    await page.getByLabel("Work Email").fill("test@e2e-example.com");
    await page.getByLabel("Company Name").fill("E2E Test Co");
    await page.getByLabel("Company Size").selectOption("11-50");
    await page.getByLabel("Country").selectOption("United States");
    await page.getByRole("button", { name: "Book a Demo" }).click();
    await expect(page.getByText("You're on the calendar — almost")).toBeVisible();
  });
});
