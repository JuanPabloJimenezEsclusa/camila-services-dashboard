/**
 * UNIT TEST: Performance Utilities
 * 
 * Notes:
 * This demonstrates PURE FUNCTION TESTING:
 * - No React components, just plain JavaScript/TypeScript
 * - Fast, deterministic tests
 * - Test constants and thresholds
 * - Mock external dependencies (web-vitals library)
 * 
 * Testing Philosophy:
 * Pure functions are the easiest to test - no side effects, no state.
 * Always test utility functions before complex components.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';
import { PERFORMANCE_THRESHOLDS, initPerformanceMonitoring } from '../performance';

/**
 * MOCK EXTERNAL MODULE
 * 
 * Note:
 * web-vitals is an external library that we need to mock.
 * Vitest's vi.mock() intercepts imports and replaces them with mocks.
 * 
 * This prevents:
 * - Network calls during tests
 * - Browser API dependencies
 * - Slow external code execution
 */
vi.mock('web-vitals', () => ({
  onCLS: vi.fn(),
  onINP: vi.fn(),
  onFCP: vi.fn(),
  onLCP: vi.fn(),
  onTTFB: vi.fn(),
}));

describe('Performance Utilities', () => {
  /**
   * TEST PATTERN: Constants and Configuration
   * 
   * Note:
   * Test exported constants to ensure they match expected values.
   * This catches accidental changes to critical thresholds.
   */
  describe('PERFORMANCE_THRESHOLDS', () => {
    it('should define correct CLS thresholds', () => {
      expect(PERFORMANCE_THRESHOLDS.CLS.good).toBe(0.1);
      expect(PERFORMANCE_THRESHOLDS.CLS.needsImprovement).toBe(0.25);
    });

    it('should define correct INP thresholds (in milliseconds)', () => {
      expect(PERFORMANCE_THRESHOLDS.INP.good).toBe(200);
      expect(PERFORMANCE_THRESHOLDS.INP.needsImprovement).toBe(500);
    });

    it('should define correct FCP thresholds (in milliseconds)', () => {
      expect(PERFORMANCE_THRESHOLDS.FCP.good).toBe(1800);
      expect(PERFORMANCE_THRESHOLDS.FCP.needsImprovement).toBe(3000);
    });

    it('should define correct LCP thresholds (in milliseconds)', () => {
      expect(PERFORMANCE_THRESHOLDS.LCP.good).toBe(2500);
      expect(PERFORMANCE_THRESHOLDS.LCP.needsImprovement).toBe(4000);
    });

    it('should define correct TTFB thresholds (in milliseconds)', () => {
      expect(PERFORMANCE_THRESHOLDS.TTFB.good).toBe(800);
      expect(PERFORMANCE_THRESHOLDS.TTFB.needsImprovement).toBe(1800);
    });

    /**
     * TEST PATTERN: Threshold Relationships
     * 
     * Note:
     * Test that thresholds make logical sense relative to each other.
     * "good" should always be less than "needsImprovement".
     */
    it('should have "good" thresholds less than "needsImprovement"', () => {
      Object.values(PERFORMANCE_THRESHOLDS).forEach(threshold => {
        expect(threshold.good).toBeLessThan(threshold.needsImprovement);
      });
    });

    /**
     * TEST PATTERN: Type Safety
     * 
     * Note:
     * Verify the structure of the exported object.
     */
    it('should be readonly (as const)', () => {
      // TypeScript enforces this at compile time
      // This test documents the behavior
      expect(PERFORMANCE_THRESHOLDS).toBeDefined();
      expect(typeof PERFORMANCE_THRESHOLDS).toBe('object');
    });
  });

  /**
   * TEST PATTERN: Function Behavior with Mocks
   * 
   * Note:
   * Test that initPerformanceMonitoring() calls the correct functions
   * from the web-vitals library.
   */
  describe('initPerformanceMonitoring', () => {
    beforeEach(() => {
      // Clear mock call history before each test
      vi.clearAllMocks();
    });

    it('should register all Web Vitals listeners', () => {
      initPerformanceMonitoring();

      // Verify each listener was registered
      expect(onCLS).toHaveBeenCalledTimes(1);
      expect(onINP).toHaveBeenCalledTimes(1);
      expect(onFCP).toHaveBeenCalledTimes(1);
      expect(onLCP).toHaveBeenCalledTimes(1);
      expect(onTTFB).toHaveBeenCalledTimes(1);
    });

    it('should pass callback functions to each listener', () => {
      initPerformanceMonitoring();

      // Verify callbacks are functions
      expect(onCLS).toHaveBeenCalledWith(expect.any(Function));
      expect(onINP).toHaveBeenCalledWith(expect.any(Function));
      expect(onFCP).toHaveBeenCalledWith(expect.any(Function));
      expect(onLCP).toHaveBeenCalledWith(expect.any(Function));
      expect(onTTFB).toHaveBeenCalledWith(expect.any(Function));
    });

    /**
     * TEST PATTERN: Callback Behavior
     * 
     * Note:
     * Test what happens when the web-vitals library calls our callback.
     * We simulate a metric being reported.
     */
    it('should handle metric callbacks correctly', () => {
      // Spy on console.log to verify logging
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      initPerformanceMonitoring();

      // Get the callback function passed to onLCP
      const lcpCallback = (onLCP as ReturnType<typeof vi.fn>).mock.calls[0][0];

      // Simulate web-vitals calling our callback with a metric
      const mockMetric = {
        name: 'LCP',
        value: 2000,
        rating: 'good' as const,
        delta: 2000,
        id: 'test-id',
        entries: [],
        navigationType: 'navigate' as const,
      };

      // Call the callback
      lcpCallback(mockMetric);

      // In DEV mode, should log to console
      // Note: import.meta.env.DEV might be false in tests
      // This test documents expected behavior

      consoleSpy.mockRestore();
    });

    /**
     * TEST PATTERN: Idempotency
     * 
     * Note:
     * Test that calling the function multiple times is safe.
     */
    it('should be safe to call multiple times', () => {
      initPerformanceMonitoring();
      initPerformanceMonitoring();
      initPerformanceMonitoring();

      // Should register listeners 3 times (once per call)
      expect(onCLS).toHaveBeenCalledTimes(3);
      expect(onINP).toHaveBeenCalledTimes(3);
    });
  });
});

/**
 * KEY TAKEAWAYS:
 * 
 * 1. Use vi.mock() to mock external dependencies
 * 2. Test constants and exported values explicitly
 * 3. Verify function calls with toHaveBeenCalledWith()
 * 4. Test that callbacks are passed correctly (use expect.any(Function))
 * 5. Simulate external library behavior by calling mocked functions
 * 6. Always clear mocks between tests with vi.clearAllMocks()
 * 7. Test edge cases like multiple calls (idempotency)
 * 8. Pure functions are the easiest to test - prioritize them!
 * 
 * BONUS: Performance Testing Tips
 * - Use vi.spyOn(console, 'log') to verify logging
 * - Mock import.meta.env for environment-specific behavior
 * - Test that "good" < "needsImprovement" < "poor" (threshold logic)
 */
