import { test, expect } from "@playwright/test";

/**
 * Cross-Browser Authentication Tests (Playwright)
 *
 * Runs against Chrome, Firefox, Safari, and mobile viewports.
 * Ensures Proof's login and secure area work identically
 * across all supported browsers per Proof's compatibility matrix.
 */

const BASE_URL = process.env.BASE_URL || "https://the-internet.herokuapp.com";

test.describe("Cross-Browser: Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
  });

  test("should load login page", async ({ page }) => {
    await expect(page).toHaveTitle(/The Internet/);
    await expect(page.locator("#username")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should login with valid credentials", async ({ page }) => {
    await page.fill("#username", "tomsmith");
    await page.fill("#password", "SuperSecretPassword!");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/secure/);
    await expect(page.locator("h2")).toContainText("Secure Area");
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.fill("#username", "baduser");
    await page.fill("#password", "badpass");
    await page.click('button[type="submit"]');

    await expect(page.locator("#flash.error")).toBeVisible();
    await expect(page.locator("#flash")).toContainText("Your username is invalid!");
  });

  test("should successfully logout", async ({ page }) => {
    await page.fill("#username", "tomsmith");
    await page.fill("#password", "SuperSecretPassword!");
    await page.click('button[type="submit"]');
    await page.click("a[href='/logout']");

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator("#flash")).toContainText("You logged out");
  });
});

test.describe("Cross-Browser: Dynamic Content", () => {
  test("should load dynamic content", async ({ page }) => {
    await page.goto(`${BASE_URL}/dynamic_content`);
    const rows = page.locator(".large-10.columns");
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe("Cross-Browser: Responsive Layout", () => {
  test("should display login form correctly on mobile", async ({ page }) => {
    // Viewport already set by Playwright device config
    await page.goto(`${BASE_URL}/login`);
    const username = page.locator("#username");
    const password = page.locator("#password");

    await expect(username).toBeVisible();
    await expect(password).toBeVisible();

    // Check form fields are usable on mobile viewport
    const box = await username.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(50);
  });
});