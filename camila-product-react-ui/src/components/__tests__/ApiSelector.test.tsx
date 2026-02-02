/**
 * COMPONENT TEST: ApiSelector
 * 
 * Notes:
 * This demonstrates testing INTERACTIVE BUTTON COMPONENTS:
 * - Testing button states (active/inactive)
 * - Testing click handlers and callbacks
 * - Testing conditional rendering (descriptions)
 * - Testing ARIA attributes for accessibility
 * - Testing multiple buttons in a group
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { ApiSelector } from '../ApiSelector';

describe('ApiSelector Component', () => {
  /**
   * TEST PATTERN: Callback Function Testing
   * 
   * Note:
   * Mock the callback prop to verify it's called with correct arguments.
   */
  const mockOnApiChange = vi.fn();

  /**
   * TEST PATTERN: Initial Render with Props
   */
  it('should render all API type buttons', () => {
    render(<ApiSelector selectedApi="REST" onApiChange={mockOnApiChange} />);

    // Verify all 4 buttons are rendered
    expect(screen.getByRole('button', { name: /REST/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /GraphQL/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /gRPC/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /RSocket/i })).toBeInTheDocument();
  });

  /**
   * TEST PATTERN: Active State Rendering
   * 
   * Note:
   * Verify that the selected button has the 'active' class.
   * Test aria-pressed for accessibility.
   */
  it('should highlight the selected API type', () => {
    render(<ApiSelector selectedApi="GraphQL" onApiChange={mockOnApiChange} />);

    const graphqlButton = screen.getByRole('button', { name: /GraphQL/i });
    const restButton = screen.getByRole('button', { name: /REST/i });

    // Check aria-pressed attribute (for screen readers)
    expect(graphqlButton).toHaveAttribute('aria-pressed', 'true');
    expect(restButton).toHaveAttribute('aria-pressed', 'false');

    // Check CSS class (for visual styling)
    expect(graphqlButton).toHaveClass('active');
    expect(restButton).not.toHaveClass('active');
  });

  /**
   * TEST PATTERN: Click Handler Testing
   * 
   * Note:
   * Simulate user clicking different buttons and verify callback is called.
   */
  it('should call onApiChange when clicking a button', async () => {
    const user = userEvent.setup();
    mockOnApiChange.mockClear(); // Reset mock before test

    render(<ApiSelector selectedApi="REST" onApiChange={mockOnApiChange} />);

    // Click GraphQL button
    const graphqlButton = screen.getByRole('button', { name: /GraphQL/i });
    await user.click(graphqlButton);

    // Verify callback was called with correct argument
    expect(mockOnApiChange).toHaveBeenCalledTimes(1);
    expect(mockOnApiChange).toHaveBeenCalledWith('GraphQL');
  });

  it('should allow switching between different API types', async () => {
    const user = userEvent.setup();
    mockOnApiChange.mockClear();

    render(<ApiSelector selectedApi="REST" onApiChange={mockOnApiChange} />);

    // Click each button in sequence
    await user.click(screen.getByRole('button', { name: /GraphQL/i }));
    expect(mockOnApiChange).toHaveBeenLastCalledWith('GraphQL');

    await user.click(screen.getByRole('button', { name: /gRPC/i }));
    expect(mockOnApiChange).toHaveBeenLastCalledWith('GRPC');

    await user.click(screen.getByRole('button', { name: /RSocket/i }));
    expect(mockOnApiChange).toHaveBeenLastCalledWith('RSOCKET');

    // Should have been called 3 times
    expect(mockOnApiChange).toHaveBeenCalledTimes(3);
  });

  /**
   * TEST PATTERN: Conditional Content (Dynamic Description)
   * 
   * Note:
   * Test that the correct description is shown based on selected API.
   */
  it('should display REST description when REST is selected', () => {
    render(<ApiSelector selectedApi="REST" onApiChange={mockOnApiChange} />);

    expect(screen.getByText(/RESTful API endpoints/i)).toBeInTheDocument();
  });

  it('should display GraphQL description when GraphQL is selected', () => {
    render(<ApiSelector selectedApi="GraphQL" onApiChange={mockOnApiChange} />);

    expect(screen.getByText(/GraphQL query language/i)).toBeInTheDocument();
  });

  it('should display gRPC description when gRPC is selected', () => {
    render(<ApiSelector selectedApi="GRPC" onApiChange={mockOnApiChange} />);

    expect(screen.getByText(/gRPC high-performance RPC/i)).toBeInTheDocument();
  });

  it('should display RSocket description when RSocket is selected', () => {
    render(<ApiSelector selectedApi="RSOCKET" onApiChange={mockOnApiChange} />);

    expect(screen.getByText(/RSocket reactive messaging/i)).toBeInTheDocument();
  });

  /**
   * TEST PATTERN: Accessibility Testing
   * 
   * Note:
   * Verify ARIA attributes for screen reader support.
   */
  it('should have proper accessibility attributes', () => {
    render(<ApiSelector selectedApi="REST" onApiChange={mockOnApiChange} />);

    const buttons = screen.getAllByRole('button');

    buttons.forEach(button => {
      // Each button should have aria-pressed attribute
      expect(button).toHaveAttribute('aria-pressed');
      
      // Each button should have aria-label
      expect(button).toHaveAttribute('aria-label');
      
      // Each button should have a title (for tooltips)
      expect(button).toHaveAttribute('title');
    });
  });

  /**
   * TEST PATTERN: Button Labels and Icons
   * 
   * Note:
   * Verify that both icons and labels are rendered.
   */
  it('should display icons and labels for each API type', () => {
    render(<ApiSelector selectedApi="REST" onApiChange={mockOnApiChange} />);

    // Check for emojis (icons)
    expect(screen.getByText('🌐')).toBeInTheDocument(); // REST
    expect(screen.getByText('◈')).toBeInTheDocument();  // GraphQL
    expect(screen.getByText('⚡')).toBeInTheDocument(); // gRPC
    expect(screen.getByText('🔌')).toBeInTheDocument(); // RSocket
  });

  /**
   * TEST PATTERN: Component Title/Heading
   * 
   * Note:
   * Test that the component has a proper heading.
   */
  it('should display component title', () => {
    render(<ApiSelector selectedApi="REST" onApiChange={mockOnApiChange} />);

    // Using i18n key, might render as "API Type" or translation key
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
  });

  /**
   * TEST PATTERN: Re-rendering with Different Props
   * 
   * Note:
   * Test that the component updates correctly when props change.
   */
  it('should update active state when selectedApi prop changes', () => {
    const { rerender } = render(
      <ApiSelector selectedApi="REST" onApiChange={mockOnApiChange} />
    );

    // Initially REST is active
    let restButton = screen.getByRole('button', { name: /REST/i });
    let graphqlButton = screen.getByRole('button', { name: /GraphQL/i });
    
    expect(restButton).toHaveAttribute('aria-pressed', 'true');
    expect(graphqlButton).toHaveAttribute('aria-pressed', 'false');

    // Re-render with GraphQL selected
    rerender(<ApiSelector selectedApi="GraphQL" onApiChange={mockOnApiChange} />);

    // Now GraphQL should be active
    restButton = screen.getByRole('button', { name: /REST/i });
    graphqlButton = screen.getByRole('button', { name: /GraphQL/i });
    
    expect(restButton).toHaveAttribute('aria-pressed', 'false');
    expect(graphqlButton).toHaveAttribute('aria-pressed', 'true');
  });

  /**
   * TEST PATTERN: Edge Case - Clicking Already Selected Button
   * 
   * Note:
   * Test what happens when user clicks the already-active button.
   */
  it('should still call onApiChange when clicking already selected button', async () => {
    const user = userEvent.setup();
    mockOnApiChange.mockClear();

    render(<ApiSelector selectedApi="REST" onApiChange={mockOnApiChange} />);

    // Click the already-selected REST button
    const restButton = screen.getByRole('button', { name: /REST/i });
    await user.click(restButton);

    // Should still call the callback (parent decides behavior)
    expect(mockOnApiChange).toHaveBeenCalledWith('REST');
  });

  /**
   * TEST PATTERN: Keyboard Navigation
   * 
   * Note:
   * Test that buttons are keyboard-accessible.
   */
  it('should be keyboard accessible', async () => {
    const user = userEvent.setup();
    mockOnApiChange.mockClear();

    render(<ApiSelector selectedApi="REST" onApiChange={mockOnApiChange} />);

    // Tab to first button
    await user.tab();
    
    // Press Enter to activate
    await user.keyboard('{Enter}');
    
    // Should have called the callback
    expect(mockOnApiChange).toHaveBeenCalled();
  });
});

/**
 * KEY TAKEAWAYS:
 * 
 * 1. Test button states (active/inactive) with CSS classes and ARIA
 * 2. Use vi.fn() to mock callback props
 * 3. Verify callbacks are called with correct arguments
 * 4. Test conditional rendering (descriptions change based on state)
 * 5. Always test accessibility (aria-pressed, aria-label, role)
 * 6. Test user interactions with userEvent (more realistic than fireEvent)
 * 7. Test re-rendering with different props (use rerender())
 * 8. Test keyboard navigation for accessibility
 * 9. Clear mocks between tests to avoid interference
 * 10. Test edge cases (clicking already-selected button)
 * 
 * ACCESSIBILITY TESTING:
 * - Check aria-pressed for toggle buttons
 * - Verify role="button" exists
 * - Test keyboard navigation (Tab, Enter, Space)
 * - Verify labels and titles for screen readers
 * 
 * BUTTON GROUP TESTING PATTERNS:
 * - Test that only one button is active at a time
 * - Test clicking different buttons in sequence
 * - Verify visual feedback (CSS classes)
 * - Verify semantic feedback (ARIA attributes)
 */
