/**
 * UNIT TEST: SkipLink & LoadingSkeleton Components
 * 
 * Notes:
 * Testing simple presentational components for accessibility.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { SkipLink } from '../SkipLink';
import { LoadingSkeleton } from '../LoadingSkeleton';

describe('SkipLink Component', () => {
  it('should render skip link', () => {
    render(<SkipLink />);
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('should have correct href pointing to main content', () => {
    render(<SkipLink />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('should have skip-link class for styling', () => {
    render(<SkipLink />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass('skip-link');
  });

  it('should display accessible text', () => {
    render(<SkipLink />);
    
    // Should have text content for screen readers
    const link = screen.getByRole('link');
    expect(link.textContent).toBeTruthy();
    expect(link.textContent?.length).toBeGreaterThan(0);
  });
});

describe('LoadingSkeleton Component', () => {
  it('should render loading skeleton', () => {
    const { container } = render(<LoadingSkeleton />);
    
    const skeleton = container.querySelector('.chart-gallery-skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  it('should have aria-busy attribute for accessibility', () => {
    const { container } = render(<LoadingSkeleton />);
    
    const skeleton = container.querySelector('[aria-busy="true"]');
    expect(skeleton).toBeInTheDocument();
  });

  it('should have aria-live attribute for screen readers', () => {
    const { container } = render(<LoadingSkeleton />);
    
    const skeleton = container.querySelector('[aria-live="polite"]');
    expect(skeleton).toBeInTheDocument();
  });

  it('should render main chart skeleton', () => {
    const { container } = render(<LoadingSkeleton />);
    
    const mainChart = container.querySelector('.skeleton-main-chart');
    expect(mainChart).toBeInTheDocument();
  });

  it('should render 5 thumbnail skeletons', () => {
    const { container } = render(<LoadingSkeleton />);
    
    const thumbnails = container.querySelectorAll('.skeleton-thumbnail');
    expect(thumbnails).toHaveLength(5);
  });

  it('should render shimmer effects', () => {
    const { container } = render(<LoadingSkeleton />);
    
    const shimmers = container.querySelectorAll('.skeleton-shimmer');
    expect(shimmers.length).toBeGreaterThan(0);
  });

  it('should have correct structure', () => {
    const { container } = render(<LoadingSkeleton />);
    
    // Main container
    expect(container.querySelector('.chart-gallery-skeleton')).toBeInTheDocument();
    // Thumbnails container
    expect(container.querySelector('.skeleton-thumbnails')).toBeInTheDocument();
  });
});

/**
 * KEY TAKEAWAYS:
 * 
 * 1. Test accessibility features (aria-busy, aria-live, skip links)
 * 2. Verify correct structure and class names
 * 3. Test that components render without errors
 * 4. Check link attributes (href)
 * 5. Simple components can have simple tests
 * 6. Focus on what matters: accessibility and correctness
 */
