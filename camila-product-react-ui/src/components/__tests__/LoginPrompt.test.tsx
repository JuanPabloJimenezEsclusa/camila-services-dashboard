/**
 * UNIT TEST: LoginPrompt Component
 *
 * Comments:
 * - Tests a simple prompt component for unauthenticated users
 * - Demonstrates testing button click handlers
 * - Tests integration with authentication context
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { fireEvent } from '@testing-library/react';
import { LoginPrompt } from '../LoginPrompt';

// Mock the AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Import after mocking
import { useAuth } from '../../context/AuthContext';

describe('LoginPrompt Component', () => {
  it('should call login when button is clicked', () => {
    // Arrange
    const mockLogin = vi.fn();
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: mockLogin,
      logout: vi.fn(),
      isLoading: false,
    });

    // Act
    render(<LoginPrompt />);
    // The button text is "Sign In" based on the component
    const loginButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(loginButton);

    // Assert
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it('should be accessible', () => {
    // Arrange
    const mockLogin = vi.fn();
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: mockLogin,
      logout: vi.fn(),
      isLoading: false,
    });

    // Act
    render(<LoginPrompt />);

    // Assert: Button should be accessible with "Sign In" text
    const button = screen.getByRole('button', { name: /sign in/i });
    expect(button).toBeEnabled();
  });

  it('should render without crashing', () => {
    // Arrange
    const mockLogin = vi.fn();
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: mockLogin,
      logout: vi.fn(),
      isLoading: false,
    });

    // Act & Assert
    expect(() => render(<LoginPrompt />)).not.toThrow();
  });
});

/**
 * KEY TAKEAWAYS:
 *
 * 1. **User Actions**: Test button clicks with fireEvent
 * 2. **Context Integration**: Mock and test auth context usage
 * 3. **Accessibility**: Use getByRole for accessible queries
 * 4. **Simple Components**: Even simple components need tests
 * 5. **User Flow**: Test that login is triggered correctly
 */
