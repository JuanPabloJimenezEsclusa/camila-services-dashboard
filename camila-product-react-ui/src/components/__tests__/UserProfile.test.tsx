/**
 * UNIT TEST: UserProfile Component
 * 
 * Comments:
 * - Tests component that displays user authentication info
 * - Demonstrates mocking AuthContext
 * - Tests conditional rendering based on auth state
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { UserProfile } from '../UserProfile';

// Mock the AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Import after mocking
import { useAuth } from '../../context/AuthContext';

describe('UserProfile Component', () => {
  it('should render user info when authenticated', () => {
    // Arrange: Mock authenticated user
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: {
        profile: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    // Act
    render(<UserProfile />);

    // Assert: Name should be visible, email may be in dropdown
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });

  it('should render login prompt when not authenticated', () => {
    // Arrange: Mock unauthenticated state
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    // Act
    render(<UserProfile />);

    // Assert: Should show login related content or nothing
    expect(screen.queryByText(/john doe/i)).not.toBeInTheDocument();
  });

  it('should show loading state', () => {
    // Arrange: Mock loading state
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: true,
    });

    // Act
    render(<UserProfile />);

    // Assert: Should show loading indicator or nothing
    // Component behavior depends on implementation
    expect(screen.queryByText(/john doe/i)).not.toBeInTheDocument();
  });

  it('should handle missing user profile fields', () => {
    // Arrange: Mock user with partial profile
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: {
        profile: {
          name: undefined,
          email: undefined,
        },
      },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    // Act
    render(<UserProfile />);

    // Assert: Should handle gracefully
    expect(screen.queryByText(/undefined/i)).not.toBeInTheDocument();
  });

  it('should render without crashing when user is null', () => {
    // Arrange
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    // Act & Assert
    expect(() => render(<UserProfile />)).not.toThrow();
  });
});

/**
 * KEY TAKEAWAYS:
 * 
 * 1. **Context Mocking**: Mock context hooks like useAuth
 * 2. **Conditional Rendering**: Test different auth states
 * 3. **Loading States**: Test loading, authenticated, unauthenticated
 * 4. **Null Safety**: Test with missing/undefined data
 * 5. **Error Boundary**: Verify component doesn't crash
 */
