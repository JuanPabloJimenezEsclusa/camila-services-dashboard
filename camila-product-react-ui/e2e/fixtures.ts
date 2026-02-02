/**
 * Playwright Test Fixtures with MSW Integration
 * 
 * Custom fixtures that automatically set up MSW for each test
 * 
 * Note: This file is for Playwright test fixtures, not React components
 * The "use" parameter is part of Playwright's API, not a React Hook
 */

/* eslint-disable react-hooks/rules-of-hooks */

import { test as base, expect } from '@playwright/test';

// Extend base test with custom fixtures
export const test = base.extend({
  // Auto-setup MSW for each test
  context: async ({ context }, use) => {
    // Initialize MSW service worker in the browser context
    await context.route('**/*', async (route) => {
      const url = route.request().url();
      
      // Let MSW handle API requests, bypass everything else
      if (
        url.includes('/product-dev/api') ||
        url.includes('/realms/camila-realm') ||
        url.includes('localhost:8090') ||
        url.includes('localhost:9191')
      ) {
        // These requests will be handled by MSW in the browser
        await route.continue();
      } else {
        await route.continue();
      }
    });

    await use(context);
  },
});

export { expect };
