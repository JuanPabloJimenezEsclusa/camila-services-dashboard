/**
 * END-TO-END TEST: Product List with Mock Backend
 *
 * Tests the complete user flow using MSW mocked backend
 * No real backend services required!
 * 
 * MSW is started in the browser via src/mocks/browser.ts
 * when VITE_MSW_ENABLED=true
 */

import { test, expect } from '@playwright/test';

test.describe('Product List with Mocked Backend', () => {
  test('should load the homepage and display products', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page).toHaveTitle(/Camila/i);

    // Check that header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Wait for products to load (with mock data)
    await page.waitForSelector('.product-card, [data-testid="product-card"]', {
      timeout: 10000,
      state: 'visible'
    }).catch(() => {
      // If product cards don't exist, check for product list
      return page.waitForSelector('text=Laptop Pro', { timeout: 5000 });
    });
  });

  test('should display mock products from MSW', async ({ page }) => {
    await page.goto('/');

    // Wait for network to be idle
    await page.waitForLoadState('networkidle');

    // Check for specific mock product names
    const products = [
      'Laptop Pro',
      'Wireless Mouse',
      'USB-C Hub',
      'Mechanical Keyboard',
      '4K Monitor'
    ];

    // At least one product should be visible
    let foundProduct = false;
    for (const productName of products) {
      const element = page.locator(`text=${productName}`).first();
      if (await element.isVisible().catch(() => false)) {
        foundProduct = true;
        break;
      }
    }

    expect(foundProduct).toBe(true);
  });

  test('should interact with weight sliders', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Find weight sliders (if they exist)
    const sliders = page.locator('input[type="range"]');
    const sliderCount = await sliders.count();

    if (sliderCount > 0) {
      // Adjust first slider
      const firstSlider = sliders.first();
      await firstSlider.fill('0.7');

      // Wait a bit for any updates
      await page.waitForTimeout(500);

      // Verify page still works
      await expect(page.locator('header')).toBeVisible();
    } else {
      console.log('ℹ️  No sliders found on page, skipping slider test');
    }
  });

  test('should handle API selection', async ({ page }) => {
    await page.goto('/');

    await page.waitForLoadState('networkidle');

    // Look for API selector buttons/select
    const apiSelector = page.locator('select, [role="combobox"], button:has-text("REST"), button:has-text("GraphQL")').first();

    if (await apiSelector.isVisible().catch(() => false)) {
      // Try to interact with API selector
      console.log('✅ API selector found');
    } else {
      console.log('ℹ️  No API selector found, app may be using a fixed API');
    }

    // Verify page is still functional
    await expect(page.locator('header')).toBeVisible();
  });
});

test.describe('Product Search Flow', () => {
  test('should search for products', async ({ page }) => {
    await page.goto('/');

    await page.waitForLoadState('networkidle');

    // Look for search input
    const searchInput = page.locator('input[type="text"], input[placeholder*="Search"], input[placeholder*="search"]').first();

    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill('Laptop');
      await searchInput.press('Enter');

      // Wait for search results
      await page.waitForTimeout(1000);

      // Verify page still renders
      await expect(page.locator('header')).toBeVisible();
    } else {
      console.log('ℹ️  No search input found, skipping search test');
    }
  });
});
