import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
// @ts-expect-error - Node.js built-in module
import path from 'node:path';

/**
 * Vitest Configuration
 *
 * Notes:
 * - Vitest is Vite-native, so it reuses your Vite config
 * - Provides Jest-compatible API with better performance
 * - Supports ESM, TypeScript, and modern features out of the box
 */
export default defineConfig({
  plugins: [react()],

  test: {
    // Test Environment
    // - 'jsdom': Simulates browser environment (use for React components)
    // - 'happy-dom': Faster alternative to jsdom (lighter weight)
    // - 'node': For pure Node.js tests (no DOM)
    environment: 'jsdom',

    // Setup Files
    // Runs before each test file to configure global test utilities
    setupFiles: ['./src/test/setup.ts'],

    // Globals
    // Enables global test functions (describe, it, expect) without imports
    // Similar to Jest's behavior
    globals: true,

    // CSS Handling
    // Mock CSS imports to avoid parsing errors in tests
    css: true,

    // Coverage Configuration
    coverage: {
      provider: 'v8', // Fast, built-in coverage tool
      reporter: ['text', 'json', 'html', 'lcov'], // Multiple output formats
      include: ['src/**/*.{ts,tsx}'], // Files to include in coverage
      exclude: [
        'src/**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/test/**',
        'src/**/__tests__/**',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
      ],
      // Coverage thresholds (fail tests if below these percentages)
      thresholds: {
        lines: 25,
        functions: 25,
        branches: 25,
        statements: 25,
      },
    },

    // Test Matching Patterns
    // Defines which files are considered test files
    include: ['src/**/*.{test,spec}.{ts,tsx}'],

    // Timeout Settings
    testTimeout: 10000, // 10 seconds per test (useful for async operations)
    hookTimeout: 10000, // 10 seconds for before/after hooks

    // UI for interactive test viewing
    // Run `npm run test:ui` to see visual test results
    ui: true,

    // Watch mode settings
    watch: false, // Disable by default (enable with --watch flag)
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
