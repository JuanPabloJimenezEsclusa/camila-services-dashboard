/**
 * Test Setup File
 * 
 * Notes:
 * This file runs before ALL tests to configure the testing environment.
 * Common uses:
 * - Extend matchers (e.g., toBeInTheDocument)
 * - Mock global objects (localStorage, fetch)
 * - Configure testing libraries
 * - Set up cleanup functions
 */

import '@testing-library/jest-dom'; // Provides custom matchers like toBeInTheDocument()
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

/**
 * AUTOMATIC CLEANUP
 * 
 * Cleans up rendered components after each test to prevent memory leaks
 * and test interference. This is CRITICAL for component tests.
 */
afterEach(() => {
  cleanup();
});

/**
 * MOCK GLOBAL OBJECTS
 * 
 * Many libraries expect browser APIs that may not exist in test environment.
 * Mock them here to prevent errors.
 */

// Mock window.matchMedia (used by responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver (used by lazy loading)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

// Mock ResizeObserver (used by chart libraries)
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as unknown as typeof ResizeObserver;
