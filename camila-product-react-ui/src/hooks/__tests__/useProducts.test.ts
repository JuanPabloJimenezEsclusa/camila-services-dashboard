/**
 * INTEGRATION TEST: useProducts Hook
 * 
 * Notes:
 * This demonstrates CUSTOM HOOK TESTING:
 * - Using renderHook from Testing Library
 * - Mocking API clients
 * - Testing async state updates (loading, data, error)
 * - Testing React hooks in isolation
 * - Simulating different API types (REST, GraphQL, gRPC)
 * 
 * Hook Testing Philosophy:
 * Hooks should be tested in isolation from components when possible.
 * Focus on state changes, side effects, and return values.
 */

import { useProducts } from '../useProducts';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, createMockWeightParams, createMockProduct } from '../../test/test-utils';

/**
 * MOCK API CLIENTS
 * 
 * Note:
 * We mock all API clients to:
 * 1. Avoid real network calls (slow, unreliable)
 * 2. Control response data (test different scenarios)
 * 3. Test error handling (simulate failures)
 * 
 * Vitest auto-hoists vi.mock() to the top of the file.
 */
vi.mock('../../api/restClient', () => ({
  productApi: {
    sortProducts: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock('../../api/graphqlClient', () => ({
  sortProductsGraphQL: vi.fn(),
  findByIdGraphQL: vi.fn(),
}));

vi.mock('../../api/grpcClient', () => ({
  grpcApi: {
    sortProducts: vi.fn(),
  },
}));

vi.mock('../../api/rsocketClient', () => ({
  rsocketApi: {
    sortProducts: vi.fn(),
  },
}));

// Import mocked modules
import { productApi } from '../../api/restClient';
import { sortProductsGraphQL } from '../../api/graphqlClient';
import { grpcApi } from '../../api/grpcClient';
import { rsocketApi } from '../../api/rsocketClient';

describe('useProducts Hook', () => {
  /**
   * TEST SETUP: Mock Data
   * 
   * Note:
   * Create reusable mock data for consistent testing.
   */
  const mockProducts = [
    createMockProduct({ id: '1', name: 'Product 1' }),
    createMockProduct({ id: '2', name: 'Product 2' }),
    createMockProduct({ id: '3', name: 'Product 3' }),
  ];

  const mockApiResponse = {
    products: mockProducts,
    totalCount: 3,
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  /**
   * TEST PATTERN: Initial State
   * 
   * Note:
   * Verify the hook's initial state before any async operations complete.
   */
  describe('Initial State', () => {
    it('should start with loading=true and empty products', () => {
      // Mock API to never resolve (simulates pending state)
      (productApi.sortProducts as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() =>
        useProducts(createMockWeightParams(), 'REST')
      );

      // Check initial state
      expect(result.current.loading).toBe(true);
      expect(result.current.products).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  /**
   * TEST PATTERN: Successful Data Fetching
   * 
   * Note:
   * Test the "happy path" - when everything works correctly.
   * Use waitFor() to wait for async state updates.
   */
  describe('REST API', () => {
    it('should fetch products successfully via REST', async () => {
      // Mock successful API response
      (productApi.sortProducts as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockApiResponse
      );

      const { result } = renderHook(() =>
        useProducts(createMockWeightParams(), 'REST')
      );

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verify final state
      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.totalCount).toBe(3);
      expect(result.current.error).toBeNull();
    });

    it('should call REST API with correct parameters', async () => {
      (productApi.sortProducts as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockApiResponse
      );

      const params = createMockWeightParams({
        salesUnits: '0.5',
        stock: '0.3',
      });

      renderHook(() => useProducts(params, 'REST'));

      // Wait for API call
      await waitFor(() => {
        expect(productApi.sortProducts).toHaveBeenCalledWith(params);
      });
    });
  });

  /**
   * TEST PATTERN: Different API Types
   * 
   * Note:
   * Test that the hook correctly routes requests to different API clients.
   * This tests the switch/case logic in the hook.
   */
  describe('GraphQL API', () => {
    it('should fetch products via GraphQL when apiType="GraphQL"', async () => {
      (sortProductsGraphQL as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockApiResponse
      );

      const { result } = renderHook(() =>
        useProducts(createMockWeightParams(), 'GraphQL')
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verify GraphQL API was called
      expect(sortProductsGraphQL).toHaveBeenCalled();
      // Verify REST API was NOT called
      expect(productApi.sortProducts).not.toHaveBeenCalled();

      expect(result.current.products).toEqual(mockProducts);
    });

    it('should convert string params to numbers for GraphQL', async () => {
      (sortProductsGraphQL as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockApiResponse
      );

      const params = createMockWeightParams({
        salesUnits: '0.5',
        page: '2',
      });

      renderHook(() => useProducts(params, 'GraphQL'));

      await waitFor(() => {
        expect(sortProductsGraphQL).toHaveBeenCalledWith(
          expect.objectContaining({
            salesUnits: 0.5, // Converted from string to number
            page: 2,
          })
        );
      });
    });
  });

  describe('gRPC API', () => {
    it('should fetch products via gRPC when apiType="GRPC"', async () => {
      (grpcApi.sortProducts as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockApiResponse
      );

      const { result } = renderHook(() =>
        useProducts(createMockWeightParams(), 'GRPC')
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(grpcApi.sortProducts).toHaveBeenCalled();
      expect(result.current.products).toEqual(mockProducts);
    });
  });

  describe('RSocket API', () => {
    it('should fetch products via RSocket when apiType="RSOCKET"', async () => {
      (rsocketApi.sortProducts as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockApiResponse
      );

      const { result } = renderHook(() =>
        useProducts(createMockWeightParams(), 'RSOCKET')
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(rsocketApi.sortProducts).toHaveBeenCalled();
      expect(result.current.products).toEqual(mockProducts);
    });
  });

  /**
   * TEST PATTERN: Error Handling
   * 
   * Note:
   * Always test failure scenarios - what happens when things go wrong?
   * Mock API to reject with an error.
   */
  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const errorMessage = 'Network error';
      (productApi.sortProducts as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(errorMessage)
      );

      const { result } = renderHook(() =>
        useProducts(createMockWeightParams(), 'REST')
      );

      // Wait for error state
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verify error state
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.products).toEqual([]);
    });

    it('should handle non-Error objects', async () => {
      // Sometimes APIs throw strings or other types
      (productApi.sortProducts as ReturnType<typeof vi.fn>).mockRejectedValue(
        'Something went wrong'
      );

      const { result } = renderHook(() =>
        useProducts(createMockWeightParams(), 'REST')
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should have a generic error message
      expect(result.current.error).toBe('Failed to fetch products');
    });
  });

  /**
   * TEST PATTERN: Parameter Changes (Re-fetching)
   * 
   * Note:
   * Test that the hook re-fetches when parameters change.
   * Use rerender() from renderHook to update props.
   */
  describe('Parameter Updates', () => {
    it('should refetch when parameters change', async () => {
      (productApi.sortProducts as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockApiResponse
      );

      const initialParams = createMockWeightParams({ salesUnits: '0.4' });
      const { result, rerender } = renderHook(
        ({ params, apiType }) => useProducts(params, apiType),
        {
          initialProps: { params: initialParams, apiType: 'REST' as const },
        }
      );

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should have called API once
      expect(productApi.sortProducts).toHaveBeenCalledTimes(1);

      // Update parameters
      const newParams = createMockWeightParams({ salesUnits: '0.7' });
      rerender({ params: newParams, apiType: 'REST' });

      // Should refetch with new params
      await waitFor(() => {
        expect(productApi.sortProducts).toHaveBeenCalledTimes(2);
      });

      // Verify new params were used
      expect(productApi.sortProducts).toHaveBeenLastCalledWith(newParams);
    });

    it('should refetch when API type changes', async () => {
      (productApi.sortProducts as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockApiResponse
      );
      (sortProductsGraphQL as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockApiResponse
      );

      const params = createMockWeightParams();
      const { rerender } = renderHook(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ apiType }) => useProducts(params, apiType as any),
        {
          initialProps: { apiType: 'REST' as 'REST' | 'GraphQL' | 'gRPC' | 'RSocket' },
        }
      );

      await waitFor(() => {
        expect(productApi.sortProducts).toHaveBeenCalled();
      });

      // Switch to GraphQL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rerender({ apiType: 'GraphQL' as any });

      await waitFor(() => {
        expect(sortProductsGraphQL).toHaveBeenCalled();
      });
    });
  });

  /**
   * TEST PATTERN: Loading States
   * 
   * Note:
   * Verify loading state transitions correctly:
   * true -> false (success) or true -> false (error)
   */
  describe('Loading States', () => {
    it('should transition loading state correctly', async () => {
      let resolveApi: (value: unknown) => void;
      const apiPromise = new Promise(resolve => {
        resolveApi = resolve;
      });

      (productApi.sortProducts as ReturnType<typeof vi.fn>).mockReturnValue(
        apiPromise
      );

      const { result } = renderHook(() =>
        useProducts(createMockWeightParams(), 'REST')
      );

      // Should start loading
      expect(result.current.loading).toBe(true);

      // Resolve the API call
      resolveApi!(mockApiResponse);

      // Should finish loading
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });
});

/**
 * KEY TAKEAWAYS:
 * 
 * 1. Use renderHook() to test hooks in isolation
 * 2. Mock ALL external dependencies (API clients)
 * 3. Test async behavior with waitFor()
 * 4. Test the "happy path" AND error scenarios
 * 5. Test parameter changes with rerender()
 * 6. Verify loading state transitions
 * 7. Test that the correct API is called for each apiType
 * 8. Always clear mocks between tests (beforeEach)
 * 9. Use mockResolvedValue for success, mockRejectedValue for errors
 * 10. Test type conversions (string -> number for GraphQL)
 * 
 * BONUS: Advanced Hook Testing
 * - Test cleanup functions (useEffect return values)
 * - Test multiple simultaneous calls (race conditions)
 * - Test abort controllers (request cancellation)
 * - Test caching and memoization
 */
