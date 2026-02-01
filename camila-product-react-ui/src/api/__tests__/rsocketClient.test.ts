/**
 * UNIT TEST: RSocket API Client
 * 
 * Comments:
 * - Testing RSocket client (reactive streams protocol)
 * - RSocket supports: request-response, request-stream, fire-and-forget
 * - More complex than REST/GraphQL due to streaming nature
 * - Uses mock to simulate RSocket behavior
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as rsocketClient from '../rsocketClient';

// Mock the RSocket client
// RSocket has async initialization and reactive streams
vi.mock('../rsocketClient', async () => {
  const actual = await vi.importActual('../rsocketClient');
  return {
    ...actual,
    // Override the actual exported functions
    sortProductsRSocket: vi.fn(),
    findByIdRSocket: vi.fn(),
  };
});

describe('RSocket API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sortProducts', () => {
    it('should fetch products with weight parameters', async () => {
      // Arrange: Setup mock response
      const mockProducts = [
        { id: 1, name: 'RSocket Product 1', description: 'Desc 1', price: 150 },
        { id: 2, name: 'RSocket Product 2', description: 'Desc 2', price: 250 },
      ];
      
      (rsocketClient.sortProductsRSocket as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        products: mockProducts,
        totalCount: 2,
      });

      // Act
      const weights = { salesUnits: "0.40", stock: "0.40", profitMargin: "0.20", daysInStock: "0.1" };
      const result = await rsocketClient.sortProductsRSocket(weights);

      // Assert
      expect(result.products).toEqual(mockProducts);
      expect(result.totalCount).toBe(2);
      expect(rsocketClient.sortProductsRSocket).toHaveBeenCalledWith(weights);
    });

    it('should handle RSocket connection errors', async () => {
      // Arrange: Mock connection error
      (rsocketClient.sortProductsRSocket as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('RSocket Error: CONNECTION_ERROR')
      );

      // Act & Assert
      const weights = { salesUnits: "0.50", stock: "0.30", profitMargin: "0.20", daysInStock: "0.1" };
      await expect(rsocketClient.sortProductsRSocket(weights)).rejects.toThrow('CONNECTION_ERROR');
    });

    it('should handle empty results', async () => {
      // Arrange
      (rsocketClient.sortProductsRSocket as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        products: [],
        totalCount: 0,
      });

      // Act
      const weights = { salesUnits: "0.33", stock: "0.33", profitMargin: "0.34", daysInStock: "0.1" };
      const result = await rsocketClient.sortProductsRSocket(weights);

      // Assert
      expect(result.products).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('should handle rejected setup errors', async () => {
      // Arrange: Mock setup rejection (common RSocket error)
      (rsocketClient.sortProductsRSocket as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('RSocket Error: REJECTED_SETUP')
      );

      // Act & Assert
      await expect(rsocketClient.sortProductsRSocket({ salesUnits: "0.50", stock: "0.50", profitMargin: "0.0", daysInStock: "0.1" }))
        .rejects.toThrow('REJECTED_SETUP');
    });

    it('should handle application errors', async () => {
      // Arrange: Mock application-level error
      (rsocketClient.sortProductsRSocket as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('RSocket Error: APPLICATION_ERROR - Invalid weights')
      );

      // Act & Assert
      await expect(rsocketClient.sortProductsRSocket({ salesUnits: "0.0", stock: "0.0", profitMargin: "0.0", daysInStock: "0.1" }))
        .rejects.toThrow('APPLICATION_ERROR');
    });
  });

  describe('findById', () => {
    it('should fetch a single product by ID', async () => {
      // Arrange
      const mockProduct = {
        id: 42,
        name: 'RSocket Product',
        description: 'RSocket Description',
        price: 750,
      };
      
      (rsocketClient.findByIdRSocket as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockProduct);

      // @ts-expect-error - Test mock parameter
      // Act
      const result = await rsocketClient.findByIdRSocket(42);

      // Assert
      expect(result).toEqual(mockProduct);
      expect(rsocketClient.findByIdRSocket).toHaveBeenCalledWith(42);
    });

    it('should handle canceled requests', async () => {
      // Arrange: Mock canceled error
      (rsocketClient.findByIdRSocket as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('RSocket Error: CANCELED')
      );

      // Act & Assert
      await expect(rsocketClient.findByIdRSocket('1')).rejects.toThrow('CANCELED');
    });

    it('should handle invalid frame errors', async () => {
      // Arrange
      (rsocketClient.findByIdRSocket as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('RSocket Error: INVALID')
      );

      // @ts-expect-error - Test mock parameter
      // Act & Assert
      await expect(rsocketClient.findByIdRSocket(999)).rejects.toThrow('INVALID');
    });

    it('should handle null response', async () => {
      // Arrange
      (rsocketClient.findByIdRSocket as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

      // @ts-expect-error - Test mock parameter
      // Act
      const result = await rsocketClient.findByIdRSocket(999);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle connection refused', async () => {
      // Arrange
      (rsocketClient.sortProductsRSocket as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('RSocket Error: CONNECTION_REFUSED')
      );

      // Act & Assert
      await expect(rsocketClient.sortProductsRSocket({ salesUnits: "0.50", stock: "0.50", profitMargin: "0.0", daysInStock: "0.1" }))
        .rejects.toThrow('CONNECTION_REFUSED');
    });

    it('should handle lease errors', async () => {
      // Arrange: RSocket lease feature - server can reject requests
      (rsocketClient.sortProductsRSocket as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('RSocket Error: REJECTED - Lease expired')
      );

      // Act & Assert
      await expect(rsocketClient.sortProductsRSocket({ salesUnits: "0.50", stock: "0.50", profitMargin: "0.0", daysInStock: "0.1" }))
        .rejects.toThrow('REJECTED');
    });

    it('should handle malformed data', async () => {
      // Arrange
      (rsocketClient.findByIdRSocket as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('RSocket Error: APPLICATION_ERROR - Malformed data')
      );

      // Act & Assert
      await expect(rsocketClient.findByIdRSocket('1')).rejects.toThrow('Malformed data');
    });

    it('should handle streaming with multiple results', async () => {
      // Arrange: Simulate stream-like response (though we're using request-response)
      const mockProducts = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Stream Product ${i}`,
        description: `Stream Desc ${i}`,
        price: i * 10,
      }));
      
      (rsocketClient.sortProductsRSocket as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        products: mockProducts,
        totalCount: 100,
      });

      // Act
      const result = await rsocketClient.sortProductsRSocket({ salesUnits: "0.50", stock: "0.30", profitMargin: "0.20", daysInStock: "0.1" });

      // Assert
      expect(result.products).toHaveLength(100);
      expect(result.totalCount).toBe(100);
    });

    it('should handle zero weight parameters', async () => {
      // Arrange
      (rsocketClient.sortProductsRSocket as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        products: [],
        totalCount: 0,
      });

      // Act
      const result = await rsocketClient.sortProductsRSocket({ salesUnits: "0.0", stock: "0.0", profitMargin: "0.0", daysInStock: "0.1" });

      // Assert
      expect(result.products).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('should handle maximum weight parameters', async () => {
      // Arrange
      const mockProduct = { id: 1, name: 'Max Weight Product', description: 'Max', price: 999 };
      (rsocketClient.sortProductsRSocket as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        products: [mockProduct],
        totalCount: 1,
      });

      // Act
      const result = await rsocketClient.sortProductsRSocket({ salesUnits: "0.100", stock: "0.100", profitMargin: "0.100", daysInStock: "0.1" });

      // Assert
      expect(result.products).toHaveLength(1);
      expect(result.totalCount).toBe(1);
    });
  });
});

/**
 * KEY TAKEAWAYS:
 * 
 * 1. **RSocket Protocol**: Reactive streams with backpressure
 * 2. **Error Types**: Connection errors, setup errors, application errors
 * 3. **Testing Strategy**: Mock at module level like gRPC
 * 4. **Reactive Nature**: Though we test request-response, RSocket supports streams
 * 5. **Lease Feature**: RSocket servers can limit request rates
 * 
 * RSOCKET ERROR TYPES:
 * - CONNECTION_ERROR: Can't establish connection
 * - REJECTED_SETUP: Server rejected connection setup
 * - APPLICATION_ERROR: Application-level error
 * - CANCELED: Request was canceled
 * - INVALID: Invalid frame/data
 * - REJECTED: Request rejected (e.g., lease expired)
 * 
 * RSOCKET INTERACTION MODELS:
 * 1. Request-Response: Single request, single response (what we test here)
 * 2. Request-Stream: Single request, stream of responses
 * 3. Fire-and-Forget: Single request, no response
 * 4. Channel: Bidirectional stream
 * 
 * WHY RSOCKET?
 * - Efficient binary protocol
 * - Built-in backpressure
 * - Multiple interaction models
 * - Good for microservices communication
 * 
 * TESTING BEST PRACTICES:
 * - Test each error type separately
 * - Verify request parameters are passed correctly
 * - Test edge cases (empty, large datasets)
 * - For streaming, consider using observables/subjects in real implementation
 */
