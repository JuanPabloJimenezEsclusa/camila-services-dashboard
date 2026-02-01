# E2E Testing with Mock Backend

This directory contains E2E (End-to-End) tests using Playwright with MSW (Mock Service Worker) to mock all backend APIs.

## Overview

The E2E tests run against a real browser but with **mocked backend services**, eliminating the need for running actual backend services (REST, GraphQL, gRPC, RSocket, Keycloak).

**Key Feature:** The dev server is **automatically started** by Playwright. No need to run `npm run dev` separately!

## Structure

```
e2e/
├── mocks/
│   ├── data.ts           # Mock product data
│   └── handlers.ts       # MSW request handlers
├── global-setup.ts       # Playwright global setup
├── mock-server.ts        # MSW server configuration
├── fixtures.ts           # Custom Playwright fixtures
├── product-list-mocked.spec.ts  # E2E test with mocks
└── product-search.spec.ts       # Original E2E test (requires real backend)
```

## Running Tests

### With Mocked Backend (Recommended)

```bash
# Run all E2E tests with mocked backend
npm run test:e2e:mocked

# Run with UI mode for debugging
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/product-list-mocked.spec.ts
```

### With Real Backend

```bash
# Requires all backend services running
npm run test:e2e
```

## Mock Data

The mock data includes 5 sample products:
- Laptop Pro 15"
- Wireless Mouse
- USB-C Hub
- Mechanical Keyboard
- 4K Monitor 27"

## Mocked APIs

### REST API
- `GET /products` - List all products
- `GET /products/:id` - Get single product
- `POST /products/sort` - Sort products with weights

### GraphQL API
- Query: `products` - List all products
- Query: `product(id)` - Get single product
- Mutation: `sortProducts` - Sort with weights

### Keycloak Authentication
- OpenID configuration
- Token endpoint
- User info endpoint
- JWKS endpoint

## Configuration

E2E tests use `.env.e2e` configuration:
- `VITE_AUTH_ENABLED=false` - Disables authentication
- Mock backend URLs configured
- Port: 3000 (dev server)

## Debugging

```bash
# Debug mode (step through tests)
npm run test:e2e:debug

# UI mode (interactive)
npm run test:e2e:ui

# Run specific test
npx playwright test -g "should load the homepage"
```

## CI/CD Integration

The mocked E2E tests are ideal for CI/CD:
- No external dependencies
- Fast execution (~10-30 seconds)
- Reliable and deterministic
- No flaky network issues

## Writing New Tests

1. Add mock data to `e2e/mocks/data.ts`
2. Add MSW handlers to `e2e/mocks/handlers.ts`
3. Create test file: `e2e/my-feature.spec.ts`
4. Import and use the mock server setup

```typescript
import { test, expect } from '@playwright/test';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

const server = setupServer(...handlers);

test.beforeAll(() => server.listen());
test.afterAll(() => server.close());
test.beforeEach(() => server.resetHandlers());

test('my test', async ({ page }) => {
  await page.goto('/');
  // ... test code
});
```

## Notes

- gRPC and RSocket mocking is not implemented (complex protocols)
- Authentication is disabled by default
- Tests run in Chromium browser by default
- Parallel execution enabled (configurable in `playwright.config.ts`)
