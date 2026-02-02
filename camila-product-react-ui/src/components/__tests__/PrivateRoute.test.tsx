/**
 * UNIT TEST: PrivateRoute Component
 * 
 * Comments:
 * - Tests route protection based on authentication
 * - Demonstrates testing React Router components
 * - Tests redirect behavior for unauthenticated users
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { PrivateRoute } from '../PrivateRoute';

// Mock the AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Import after mocking
import { useAuth } from '../../context/AuthContext';

// Mock child component for testing
const TestComponent = () => <div>Protected Content</div>;

describe('PrivateRoute Component', () => {
  it('should render children when authenticated', () => {
    // Arrange: Mock authenticated user
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { profile: { name: 'John' } },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    // Act
    render(
      <PrivateRoute>
        <TestComponent />
      </PrivateRoute>
    );

    // Assert
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should not render children when not authenticated', () => {
    // Arrange: Mock unauthenticated state
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    // Act
    render(
      <PrivateRoute>
        <TestComponent />
      </PrivateRoute>
    );

    // Assert: Protected content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should show loading while authentication is in progress', () => {
    // Arrange: Mock loading state
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: true,
    });

    // Act
    render(
      <PrivateRoute>
        <TestComponent />
      </PrivateRoute>
    );

    // Assert: Protected content should not be visible during loading
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should handle null children gracefully', () => {
    // Arrange
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { profile: { name: 'John' } },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    // Act & Assert
    expect(() => render(<PrivateRoute>{null}</PrivateRoute>)).not.toThrow();
  });

  it('should handle multiple children', () => {
    // Arrange
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { profile: { name: 'John' } },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    // Act
    render(
      <PrivateRoute>
        <div>Child 1</div>
        <div>Child 2</div>
      </PrivateRoute>
    );

    // Assert
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});

/**
 * KEY TAKEAWAYS:
 * 
 * 1. **Route Protection**: Test authentication-based rendering
 * 2. **Multiple States**: Test authenticated, unauthenticated, loading
 * 3. **Children Props**: Test with different children configurations
 * 4. **Security**: Verify protected content is NOT rendered when not auth'd
 * 5. **Loading States**: Show appropriate UI during auth check
 */
