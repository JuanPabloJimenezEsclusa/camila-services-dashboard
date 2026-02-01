import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration
 * 
 * Notes:
 * - Configure browsers, viewports, and test settings
 * - Define base URL for all tests
 * - Set up dev server automation
 * - Configure reporters and test artifacts
 * - MSW (Mock Service Worker) mocks backend APIs
 */
export default defineConfig({
  // Test directory
  testDir: './e2e',
  
  // Global setup - initialize MSW mock server
  globalSetup: './e2e/global-setup.ts',
  
  // Timeout per test (30 seconds)
  timeout: 30 * 1000,
  
  // Parallel execution
  // Run tests in parallel across multiple workers
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined, // 1 worker in CI, max on local
  
  // Retry failed tests
  retries: process.env.CI ? 2 : 0, // Retry twice in CI, no retries locally
  
  // Reporter configuration
  reporter: [
    ['html'], // HTML report
    ['list'], // Console output
  ],
  
  // Shared settings for all tests
  use: {
    // Base URL for page.goto()
    baseURL: 'http://localhost:3030',
    
    // Browser context options
    trace: 'on-first-retry', // Capture trace on first retry
    screenshot: 'only-on-failure', // Screenshot failures
    video: 'retain-on-failure', // Video on failures
    
    // Viewport size
    viewport: { width: 1280, height: 720 },
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to test other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // Mobile testing
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // Web server configuration
  // Automatically start dev server before tests
  webServer: {
    command: 'VITE_AUTH_ENABLED=false VITE_MSW_ENABLED=true npm run dev',
    url: 'http://localhost:3030',
    reuseExistingServer: !process.env.CI, // Reuse server locally, fresh in CI
    timeout: 120 * 1000, // 2 minutes to start
  },
});
