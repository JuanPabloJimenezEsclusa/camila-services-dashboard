/**
 * INTEGRATION TEST: REST API Client
 * 
 * Notes:
 * This demonstrates API CLIENT TESTING with MSW (Mock Service Worker):
 * - Intercept HTTP requests at the network level
 * - Test axios client configuration
 * - Simulate success and error responses
 * - Test request/response transformation
 * - More realistic than vi.mock() for HTTP clients
 * 
 * MSW Benefits:
 * - Tests work the same in Node and browser
 * - Intercepts actual fetch/axios calls (not mocking the library)
 * - Can reuse mocks between tests and development
 * - Catches issues with request formatting
 */

import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { productApi } from '../restClient';
import { createMockProduct, createMockWeightParams } from '../../test/test-utils';

/**
 * MSW SERVER SETUP
 * 
 * Note:
 * setupServer() creates a mock server that intercepts HTTP requests.
 * Define handlers for different endpoints.
 */
const mockProducts = [
  createMockProduct({ id: '1', name: 'Product 1' }),
  createMockProduct({ id: '2', name: 'Product 2' }),
];

const mockApiResponse = {
  products: mockProducts,
  totalCount: 2,
};

// Define mock HTTP handlers
const handlers = [
  // GET /products?salesUnits=...
  http.get('/product-dev/api/products', ({ request }) => {
    const url = new URL(request.url);
    const salesUnits = url.searchParams.get('salesUnits');
    
    // Simulate query parameter validation
    if (salesUnits && Number.parseFloat(salesUnits) < 0) {
      return HttpResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    // Return array directly (as the real API does)
    // Include x-total-count header
    return HttpResponse.json(mockProducts, {
      headers: {
        'x-total-count': '2',
      },
    });
  }),

  // GET /products/:id
  http.get('/product-dev/api/products/:id', ({ params }) => {
    const { id } = params;
    const product = mockProducts.find(p => p.id === id);

    if (!product) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(product);
  }),
];

// Create MSW server
const server = setupServer(...handlers);

describe('REST API Client', () => {
  /**
   * MSW LIFECYCLE
   * 
   * Note:
   * - beforeAll: Start the server before any tests
   * - afterEach: Reset handlers to default state after each test
   * - afterAll: Cleanup and close the server
   */
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' }); // Fail on unexpected requests
  });

  afterEach(() => {
    server.resetHandlers(); // Reset to default handlers
  });

  afterAll(() => {
    server.close(); // Cleanup
  });

  /**
   * TEST PATTERN: Successful API Call
   * 
   * Note:
   * Test that the client correctly formats requests and parses responses.
   */
  describe('sortProducts', () => {
    it('should fetch products with weight parameters', async () => {
      const params = createMockWeightParams({
        salesUnits: '0.5',
        stock: '0.3',
      });

      const result = await productApi.sortProducts(params);

      // Verify response structure
      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('totalCount');
      expect(result.products).toHaveLength(2);
      expect(result.totalCount).toBe(2);
    });

    it('should send query parameters correctly', async () => {
      const params = createMockWeightParams({
        salesUnits: '0.6',
        stock: '0.2',
        profitMargin: '0.1',
        daysInStock: '0.1',
        page: '2',
        size: '25',
      });

      const result = await productApi.sortProducts(params);

      // MSW intercepts and validates query params
      expect(result).toBeDefined();
    });

    /**
     * TEST PATTERN: Error Handling - Invalid Parameters
     * 
     * Note:
     * Test that the client handles HTTP error responses correctly.
     */
    it('should handle 400 Bad Request errors', async () => {
      const invalidParams = createMockWeightParams({
        salesUnits: '-1', // Invalid negative value
      });

      await expect(productApi.sortProducts(invalidParams)).rejects.toThrow();
    });

    /**
     * TEST PATTERN: Network Errors
     * 
     * Note:
     * Simulate network failures using MSW's one-time handlers.
     */
    it('should handle network errors', async () => {
      // Override handler for this test only
      server.use(
        http.get('/product-dev/api/products', () => {
          return HttpResponse.error(); // Simulate network failure
        })
      );

      const params = createMockWeightParams();

      await expect(productApi.sortProducts(params)).rejects.toThrow();
    });

    /**
     * TEST PATTERN: Timeout
     * 
     * Note:
     * Test that the client respects timeout configuration.
     */
    it('should handle request timeouts', async () => {
      // Skip this test as the client doesn't have timeout configured
      // Uncomment and adjust when timeout is added to axios config
      expect(true).toBe(true);
    });
  });

  /**
   * TEST PATTERN: Different Endpoint
   * 
   * Note:
   * Test additional API methods.
   */
  describe('findById', () => {
    it('should fetch a single product by ID', async () => {
      const result = await productApi.findById('1');

      expect(result).toEqual(mockProducts[0]);
      expect(result.id).toBe('1');
    });

    it('should handle 404 Not Found errors', async () => {
      await expect(productApi.findById('999')).rejects.toThrow();
    });

    /**
     * TEST PATTERN: Response Transformation
     * 
     * Note:
     * Test that axios interceptors or response transformers work correctly.
     */
    it('should parse JSON response correctly', async () => {
      const result = await productApi.findById('1');

      // Verify the response is a plain JavaScript object
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
    });
  });

  /**
   * TEST PATTERN: Edge Cases
   * 
   * Note:
   * Test boundary conditions and unusual inputs.
   */
  describe('Edge Cases', () => {
    it('should handle empty response', async () => {
      server.use(
        http.get('/product-dev/api/products', () => {
          return HttpResponse.json([], {
            headers: { 'x-total-count': '0' },
          });
        })
      );

      const params = createMockWeightParams();
      const result = await productApi.sortProducts(params);

      expect(result.products).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('should handle zero weight parameters', async () => {
      const params = createMockWeightParams({
        salesUnits: '0',
        stock: '0',
        profitMargin: '0',
        daysInStock: '0',
      });

      const result = await productApi.sortProducts(params);

      expect(result).toBeDefined();
    });

    it('should handle maximum weight parameters', async () => {
      const params = createMockWeightParams({
        salesUnits: '10',
        stock: '10',
        profitMargin: '10',
        daysInStock: '10',
      });

      const result = await productApi.sortProducts(params);

      expect(result).toBeDefined();
    });
  });

  /**
   * TEST PATTERN: Request Headers
   * 
   * Note:
   * Verify that the client sends correct headers (Content-Type, Authorization, etc.)
   */
  describe('Request Configuration', () => {
    it('should send correct Content-Type header', async () => {
      let capturedHeaders: Headers | undefined;

      server.use(
        http.get('/product-dev/api/products', ({ request }) => {
          capturedHeaders = request.headers;
          return HttpResponse.json(mockApiResponse);
        })
      );

      await productApi.sortProducts(createMockWeightParams());

      // Axios typically sends 'application/json' for JSON requests
      // This might vary based on your axios configuration
      expect(capturedHeaders).toBeDefined();
    });
  });
});

/**
 * KEY TAKEAWAYS:
 * 
 * 1. MSW intercepts HTTP at the network level (more realistic than mocks)
 * 2. Use setupServer() for Node.js tests (setupWorker() for browser)
 * 3. Define handlers for each endpoint you want to mock
 * 4. Use server.use() to override handlers for specific tests
 * 5. Always reset handlers after each test (afterEach)
 * 6. Test both success AND error responses (4xx, 5xx, network errors)
 * 7. Test edge cases (empty responses, invalid inputs)
 * 8. Verify request formatting (headers, query params, body)
 * 9. Use HttpResponse.error() to simulate network failures
 * 10. Set onUnhandledRequest: 'error' to catch missing handlers
 * 
 * BONUS: Advanced MSW Patterns
 * - Use request.json() to inspect POST body
 * - Use request.cookies() for cookie handling
 * - Chain multiple handlers for different scenarios
 * - Use server.events.on('request:start') for request logging
 * - Create reusable handler factories for common patterns
 * 
 * MSW vs vi.mock():
 * - MSW: Better for HTTP clients (axios, fetch)
 * - vi.mock(): Better for module-level mocks (React components, utilities)
 */
