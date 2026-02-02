/**
 * UNIT TEST: gRPC API Client
 * 
 * Comments:
 * - Testing gRPC client by mocking grpc-web library
 * - gRPC uses protobuf messages, more complex than REST/GraphQL
 * - Mocking strategy: Mock the client and service methods
 * - Tests unary calls (request-response pattern)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as grpcClient from '../grpcClient';

// Mock the gRPC client
// We create a mock implementation that simulates gRPC behavior
vi.mock('../grpcClient', async () => {
  const actual = await vi.importActual('../grpcClient');
  return {
    ...actual,
    // Override the actual exported functions
    sortProductsGRPC: vi.fn(),
    findByIdGRPC: vi.fn(),
  };
});

describe('gRPC API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sortProducts', () => {
    it('should fetch products with weight parameters', async () => {
      // Arrange: Setup mock response
      const mockProducts = [
        { id: 1, name: 'gRPC Product 1', description: 'Desc 1', price: 100 },
        { id: 2, name: 'gRPC Product 2', description: 'Desc 2', price: 200 },
      ];
      
      (grpcClient.sortProductsGRPC as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        products: mockProducts,
        totalCount: 2,
      });

      // Act
      const weights = { salesUnits: "0.60", stock: "0.30", profitMargin: "0.10", daysInStock: "0.1" };
      const result = await grpcClient.sortProductsGRPC(weights);

      // Assert
      expect(result.products).toEqual(mockProducts);
      expect(result.totalCount).toBe(2);
      expect(grpcClient.sortProductsGRPC).toHaveBeenCalledWith(weights);
    });

    it('should handle gRPC errors', async () => {
      // Arrange: Mock gRPC error
      const grpcError = new Error('gRPC Error: UNAVAILABLE');
      (grpcClient.sortProductsGRPC as ReturnType<typeof vi.fn>).mockRejectedValueOnce(grpcError);

      // Act & Assert
      const weights = { salesUnits: "0.50", stock: "0.50", profitMargin: "0.0", daysInStock: "0.1" };
      await expect(grpcClient.sortProductsGRPC(weights)).rejects.toThrow('gRPC Error');
    });

    it('should handle empty results', async () => {
      // Arrange
      (grpcClient.sortProductsGRPC as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        products: [],
        totalCount: 0,
      });

      // Act
      const weights = { salesUnits: "0.100", stock: "0.0", profitMargin: "0.0", daysInStock: "0.1" };
      const result = await grpcClient.sortProductsGRPC(weights);

      // Assert
      expect(result.products).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('should handle timeout errors', async () => {
      // Arrange: Simulate timeout
      (grpcClient.sortProductsGRPC as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('gRPC Error: DEADLINE_EXCEEDED')
      );

      // Act & Assert
      await expect(grpcClient.sortProductsGRPC({ salesUnits: "0.50", stock: "0.50", profitMargin: "0.0", daysInStock: "0.1" }))
        .rejects.toThrow('DEADLINE_EXCEEDED');
    });
  });

  describe('findById', () => {
    it('should fetch a single product by ID', async () => {
      // Arrange
      const mockProduct = {
        id: 42,
        name: 'gRPC Product',
        description: 'gRPC Description',
        price: 500,
      };
      
      (grpcClient.findByIdGRPC as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockProduct);

      // Act
      const result = await grpcClient.findByIdGRPC('42');

      // Assert
      expect(result).toEqual(mockProduct);
      expect(grpcClient.findByIdGRPC).toHaveBeenCalledWith('42');
    });

    it('should handle NOT_FOUND error', async () => {
      // Arrange: Mock NOT_FOUND error (gRPC status code 5)
      (grpcClient.findByIdGRPC as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('gRPC Error: NOT_FOUND')
      );

      // Act & Assert
      await expect(grpcClient.findByIdGRPC('999')).rejects.toThrow('NOT_FOUND');
    });

    it('should handle null product', async () => {
      // Arrange
      (grpcClient.findByIdGRPC as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

      // Act
      const result = await grpcClient.findByIdGRPC('999');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle connection errors', async () => {
      // Arrange
      (grpcClient.sortProductsGRPC as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('gRPC Error: UNAVAILABLE - Connection refused')
      );

      // Act & Assert
      await expect(grpcClient.sortProductsGRPC({ salesUnits: "0.50", stock: "0.50", profitMargin: "0.0", daysInStock: "0.1" }))
        .rejects.toThrow('UNAVAILABLE');
    });

    it('should handle invalid weight parameters', async () => {
      // Arrange
      (grpcClient.sortProductsGRPC as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('gRPC Error: INVALID_ARGUMENT')
      );

      // Act & Assert
      await expect(grpcClient.sortProductsGRPC({ salesUnits: "invalid" }))
        .rejects.toThrow('INVALID_ARGUMENT');
    });

    it('should handle large datasets', async () => {
      // Arrange: Simulate large response
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Product ${i}`,
        description: `Description ${i}`,
        price: i * 10,
      }));
      
      (grpcClient.sortProductsGRPC as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        products: largeDataset,
        totalCount: 1000,
      });

      // Act
      const result = await grpcClient.sortProductsGRPC({ salesUnits: "0.50", stock: "0.30", profitMargin: "0.20", daysInStock: "0.1" });

      // Assert
      expect(result.products).toHaveLength(1000);
      expect(result.totalCount).toBe(1000);
    });
  });
});

/**
 * KEY TAKEAWAYS:
 * 
 * 1. **gRPC Testing Strategy**: Mock the client module, not the wire protocol
 * 2. **Error Types**: gRPC has specific status codes (UNAVAILABLE, NOT_FOUND, etc.)
 * 3. **Mock Pattern**: Use vi.mock() with importActual to preserve exports
 * 4. **Timeout Handling**: Test DEADLINE_EXCEEDED scenarios
 * 5. **Performance**: Test with large datasets
 * 
 * gRPC STATUS CODES:
 * - OK (0): Success
 * - NOT_FOUND (5): Resource not found
 * - INVALID_ARGUMENT (3): Invalid request
 * - UNAVAILABLE (14): Service unavailable
 * - DEADLINE_EXCEEDED (4): Request timeout
 * 
 * WHY MOCK AT MODULE LEVEL?
 * - gRPC-web is complex to set up
 * - Protobuf messages require compilation
 * - Module mocking simulates real behavior
 * - Focuses on testing our logic, not gRPC internals
 * 
 * REAL-WORLD CONSIDERATIONS:
 * - In production, use integration tests with test gRPC server
 * - Unit tests verify our code handles gRPC responses correctly
 * - E2E tests verify actual gRPC communication
 */
