/**
 * Playwright Global Setup
 * 
 * This runs once before all tests to initialize MSW (Mock Service Worker)
 * and set up the mock backend for E2E tests.
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E Test Global Setup...');
  
  // Start MSW service worker
  // Note: MSW will be initialized via the browser context in each test
  // This setup is for any global configuration needed
  
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';
  console.log(`   Using base URL: ${baseURL}`);
  
  // Optionally wait for dev server to be ready
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Try to access the dev server
    await page.goto(baseURL, { timeout: 5000, waitUntil: 'domcontentloaded' });
    console.log('✅ Dev server is ready');
  } catch {
    console.warn('⚠️  Dev server not responding yet, continuing anyway...');
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }
  
  console.log('✅ Global Setup Complete\n');
}

export default globalSetup;
