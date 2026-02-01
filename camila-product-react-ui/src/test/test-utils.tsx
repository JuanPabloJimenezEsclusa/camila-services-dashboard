/**
 * Custom Test Utilities
 *
 * Notes:
 * This file provides reusable test helpers that wrap components with
 * necessary providers (Router, i18n, Context, etc.)
 *
 * Benefits:
 * - DRY principle: Write provider setup once, reuse everywhere
 * - Consistent test environment
 * - Easy to extend when adding new providers
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../context/ThemeContext';
import { vi } from 'vitest';
import i18n from '../i18n/config';

/**
 * ALL PROVIDERS WRAPPER
 *
 * Wraps components with all necessary context providers.
 * Add your custom providers here (Redux, Theme, Auth, etc.)
 */
interface AllProvidersProps {
  children: React.ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
function AllProviders({ children }: AllProvidersProps) {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            {children}
          </I18nextProvider>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

/**
 * CUSTOM RENDER FUNCTION
 *
 * Notes:
 * This wraps React Testing Library's render() with our providers.
 *
 * Usage:
 *   import { render } from '@/test/test-utils';
 *   render(<MyComponent />);
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything from Testing Library
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';

// Override render with our custom version
export { customRender as render };

/**
 * MOCK DATA FACTORIES
 *
 * Notes:
 * Factory functions create test data with sensible defaults.
 * Override only what you need for each test.
 */

export const createMockProduct = (overrides = {}) => ({
  id: '1',
  internalId: 'PROD-001',
  name: 'Test Product',
  category: 'Electronics',
  salesUnits: 100,
  stock: { default: 50 },
  profitMargin: 0.25,
  daysInStock: 10,
  score: 75.5,
  ...overrides,
});

export const createMockWeightParams = (overrides = {}) => ({
  salesUnits: '0.4',
  stock: '0.2',
  profitMargin: '0.2',
  daysInStock: '0.2',
  page: '0',
  size: '50',
  ...overrides,
});

/**
 * WAIT FOR ASYNC OPERATIONS
 *
 * Helper to wait for async state updates (API calls, timeouts).
 */
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * MOCK INTERSECTION OBSERVER HELPER
 *
 * Simulates elements entering/leaving viewport (for lazy loading tests)
 */
export const mockIntersectionObserver = () => {
  const mockObserver = {
    observe: vi.fn(),
    disconnect: vi.fn(),
    unobserve: vi.fn(),
  };

  window.IntersectionObserver = vi.fn(() => mockObserver) as unknown as typeof IntersectionObserver;

  return mockObserver;
};
