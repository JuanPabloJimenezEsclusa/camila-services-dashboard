/**
 * END-TO-END TEST: Product Search Flow
 *
 * Notes:
 * This demonstrates E2E (End-to-End) TESTING with Playwright:
 * - Tests complete user workflows in a real browser
 * - Interacts with actual UI elements
 * - Verifies visual output and user experience
 * - Catches integration issues that unit tests miss
 *
 * E2E Philosophy:
 * "Test like a real user would use your app"
 * - Click buttons, type in inputs, navigate pages
 * - Verify what appears on screen
 * - Test critical user journeys
 * - Use sparingly (slower, more brittle than unit tests)
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3030';

/**
 * Helper function to log in via Keycloak
 */
async function loginAsUser(page: Page, username: string, password: string) {
  // Navigate to the app
  await page.goto(BASE_URL);

  // Click the login button if present
  const loginButton = page.locator('button:has-text("Sign In")');
  if (await loginButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await loginButton.click();
  }

  // Wait for Keycloak login page
  await page.waitForURL(/keycloak.*\/auth/, { timeout: 10000 });

  // Fill in username and password
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);

  // Submit the form
  await page.click('input[type="submit"]');

  // Wait for successful authentication by checking for authenticated UI elements
  // The header should be visible after successful login
  await page.waitForSelector('header', { timeout: 15000 });
  await page.waitForLoadState('networkidle');
}

test.describe('Product Search Flow', () => {
  test('should login and load the homepage successfully', async ({ page }) => {
    await loginAsUser(page, 'camila', 'camila');
    await expect(page).toHaveTitle(/Camila/i);
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should login and search for a product by internal ID', async ({ page }) => {
    await loginAsUser(page, 'camila', 'camila');
    const searchInput = page.locator('input[type="text"]').first();
    await searchInput.fill('1');
    await searchInput.press('Enter');
    await page.waitForSelector('.product-card', { timeout: 5000 });
    const productCard = page.locator('.product-card').first();
    await expect(productCard).toBeVisible();
    await expect(productCard).toContainText('1');
  });

  test('should login and adjust weight sliders and update results', async ({ page }) => {
    await loginAsUser(page, 'camila', 'camila');
    const salesSlider = page.locator('input[type="range"]').first();
    await salesSlider.fill('0.7');
    await page.waitForTimeout(500);
    const products = page.locator('.product-card');
    await expect(products.first()).toBeVisible();
  });
});
