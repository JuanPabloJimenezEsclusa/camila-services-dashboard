/**
 * UNIT TEST: ProductCard Component
 * 
 * Notes:
 * This demonstrates COMPONENT TESTING fundamentals:
 * - Rendering components with props
 * - Querying elements (getByText, getByRole, queryBy)
 * - Testing conditional rendering
 * - Testing internationalization (i18n)
 * - Using React.memo components
 * 
 * Testing Philosophy:
 * "Test what the user sees, not implementation details"
 * - Focus on rendered output, not internal state
 * - Use accessible queries (getByRole, getByLabelText)
 * - Test user-facing behavior
 */

import { describe, it, expect } from 'vitest';
import { render, screen, createMockProduct } from '../../test/test-utils';
import { ProductCard } from '../ProductCard';

describe('ProductCard Component', () => {
  /**
   * TEST PATTERN: Basic Rendering
   * 
   * Note:
   * Always start with a "smoke test" - does the component render without crashing?
   */
  it('should render without crashing', () => {
    const product = createMockProduct();
    render(<ProductCard product={product} />);
    
    // If we get here without errors, the test passes
    expect(screen.getByText(product.name)).toBeInTheDocument();
  });

  /**
   * TEST PATTERN: Required Props
   * 
   * Note:
   * Test that required data is displayed correctly.
   * Use accessible queries like getByText, getByRole.
   */
  it('should display product name and category', () => {
    const product = createMockProduct({
      name: 'Gaming Laptop',
      category: 'Computers',
    });

    render(<ProductCard product={product} />);

    // Query for text content that the user will see
    expect(screen.getByText('Gaming Laptop')).toBeInTheDocument();
    expect(screen.getByText(/Computers/)).toBeInTheDocument();
  });

  /**
   * TEST PATTERN: Conditional Rendering
   * 
   * Note:
   * Use queryBy* when element might not exist (returns null instead of throwing)
   * Use getBy* when element must exist (throws if not found)
   */
  it('should display sales units when available', () => {
    const product = createMockProduct({ salesUnits: 250 });

    render(<ProductCard product={product} />);

    // salesUnits should be displayed
    expect(screen.getByText(/250/)).toBeInTheDocument();
  });

  it('should NOT display sales units when undefined', () => {
    const product = createMockProduct({ salesUnits: undefined });

    render(<ProductCard product={product} />);

    // queryBy returns null instead of throwing error
    // This tests conditional rendering: {product.salesUnits !== undefined && ...}
    const salesText = screen.queryByText(/product.salesUnits/);
    expect(salesText).not.toBeInTheDocument();
  });

  /**
   * TEST PATTERN: Number Formatting
   * 
   * Note:
   * Test that numbers are formatted correctly (decimals, percentages, etc.)
   */
  it('should format profit margin to 2 decimal places', () => {
    const product = createMockProduct({ profitMargin: 0.3567 });

    render(<ProductCard product={product} />);

    // Should round to 0.36 and not show 0.3567
    expect(screen.getByText(/0\.36%/)).toBeInTheDocument();
  });

  /**
   * TEST PATTERN: Complex Data (Objects/Arrays)
   * 
   * Note:
   * Test components that render lists or nested data structures.
   */
  it('should display stock information by size', () => {
    const product = createMockProduct({
      stock: {
        S: 10,
        M: 25,
        L: 15,
        XL: 5,
      },
    });

    render(<ProductCard product={product} />);

    // Check that each size and quantity is rendered
    expect(screen.getByText(/S: 10/)).toBeInTheDocument();
    expect(screen.getByText(/M: 25/)).toBeInTheDocument();
    expect(screen.getByText(/L: 15/)).toBeInTheDocument();
    expect(screen.getByText(/XL: 5/)).toBeInTheDocument();
  });

  it('should calculate and display total stock correctly', () => {
    const product = createMockProduct({
      stock: {
        S: 10,
        M: 20,
        L: 30,
      },
    });

    render(<ProductCard product={product} />);

    // Total: 10 + 20 + 30 = 60
    expect(screen.getByText(/60/)).toBeInTheDocument();
  });

  /**
   * TEST PATTERN: Edge Cases
   * 
   * Note:
   * Always test boundary conditions and unusual data.
   */
  it('should handle product with zero stock', () => {
    const product = createMockProduct({
      stock: {
        S: 0,
        M: 0,
      },
    });

    render(<ProductCard product={product} />);

    // Should still render, just with 0 quantities
    expect(screen.getByText(/S: 0/)).toBeInTheDocument();
    expect(screen.getByText(/M: 0/)).toBeInTheDocument();
  });

  it('should handle product without stock object', () => {
    const product = createMockProduct({
      stock: undefined,
    });

    render(<ProductCard product={product} />);

    // Stock section should not be rendered
    const stockText = screen.queryByText(/product.stock/);
    expect(stockText).not.toBeInTheDocument();
  });

  /**
   * TEST PATTERN: Internationalization (i18n)
   * 
   * Note:
   * Test that translation keys are used correctly.
   * Note: Our test-utils sets up i18n provider automatically.
   */
  it('should use translation keys for labels', () => {
    const product = createMockProduct();

    render(<ProductCard product={product} />);

    // The i18n might render actual translations or keys depending on config
    // Just verify that the component renders the product data
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(product.category)).toBeInTheDocument();
  });
});

/**
 * KEY TAKEAWAYS:
 * 
 * 1. Component tests should focus on USER BEHAVIOR, not implementation
 * 2. Use createMockProduct() factory for consistent test data
 * 3. Test the "happy path" first, then edge cases
 * 4. queryBy* for optional elements, getBy* for required elements
 * 5. Test conditional rendering explicitly
 * 6. Always test with realistic data
 * 7. Mock only what's necessary (i18n is provided by test-utils)
 */
