/**
 * SIMPLIFIED UNIT TEST: WeightForm Component
 * 
 * Notes:
 * This demonstrates testing forms with range inputs (sliders).
 * Note: Range inputs have limitations - they don't support all userEvent methods.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../test/test-utils';
import { WeightForm } from '../WeightForm';

describe('WeightForm Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOnSubmit: any;

  beforeEach(() => {
    mockOnSubmit = vi.fn();
  });

  it('should render with default weight values', () => {
    render(<WeightForm onSubmit={mockOnSubmit} />);

    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThanOrEqual(4);
    expect(sliders[0]).toHaveValue('0.4');
  });

  it('should update slider value when user changes it', () => {
    render(<WeightForm onSubmit={mockOnSubmit} />);

    const sliders = screen.getAllByRole('slider');
    const salesInput = sliders[0];

    // Use fireEvent for range inputs (userEvent.clear doesn't work on ranges)
    fireEvent.change(salesInput, { target: { value: '0.7' } });

    expect(salesInput).toHaveValue('0.7');
  });

  it('should call onSubmit with debounce after value change', async () => {
    render(<WeightForm onSubmit={mockOnSubmit} />);

    const sliders = screen.getAllByRole('slider');
    const salesInput = sliders[0];

    fireEvent.change(salesInput, { target: { value: '0.70' } });

    await waitFor(
      () => {
        expect(mockOnSubmit).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );

    const lastCall = mockOnSubmit.mock.calls[mockOnSubmit.mock.calls.length - 1];
    expect(lastCall[0].salesUnits).toBe('0.70');
  });

  it('should respect min and max props', () => {
    render(
      <WeightForm 
        onSubmit={mockOnSubmit} 
        minWeight={0}
        maxWeight={5}
      />
    );

    const sliders = screen.getAllByRole('slider');
    expect(sliders[0]).toHaveAttribute('min', '0');
    expect(sliders[0]).toHaveAttribute('max', '5');
  });

  it('should call onSubmit on initial mount', async () => {
    render(<WeightForm onSubmit={mockOnSubmit} />);

    await waitFor(
      () => {
        expect(mockOnSubmit).toHaveBeenCalled();
      },
      { timeout: 500 }
    );
  });
});
