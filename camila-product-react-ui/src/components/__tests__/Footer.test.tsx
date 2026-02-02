/**
 * UNIT TEST: Footer Component
 *
 * Notes:
 * Testing a presentational component with links and dynamic content.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { Footer } from '../Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    // Mock Date to have consistent year
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-31'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render footer with all sections', () => {
    render(<Footer />);

    // Check that footer element exists
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should display current year in copyright', () => {
    render(<Footer />);

    // Should show 2026 (mocked date)
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });

  it('should render external links with correct attributes', () => {
    render(<Footer />);

    // Find all GitHub links (now we have 2: Resources and Social Media)
    const githubLinks = screen.getAllByRole('link', { name: /github/i });
    expect(githubLinks.length).toBeGreaterThanOrEqual(1);
    
    // Check first GitHub link (in Resources section)
    expect(githubLinks[0]).toHaveAttribute('href', expect.stringContaining('github.com'));
    expect(githubLinks[0]).toHaveAttribute('target', '_blank');
    expect(githubLinks[0]).toHaveAttribute('rel', 'noopener noreferrer');

    // Find all GitLab links (now we have 2: Resources and Social Media)
    const gitlabLinks = screen.getAllByRole('link', { name: /gitlab/i });
    expect(gitlabLinks.length).toBeGreaterThanOrEqual(1);
    
    // Check first GitLab link (in Resources section)
    expect(gitlabLinks[0]).toHaveAttribute('href', expect.stringContaining('gitlab.com'));
    expect(gitlabLinks[0]).toHaveAttribute('target', '_blank');
    expect(gitlabLinks[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render license link', () => {
    render(<Footer />);

    const licenseLink = screen.getByRole('link', { name: /gnu gpl/i });
    expect(licenseLink).toHaveAttribute('href', 'https://www.gnu.org/licenses/gpl-3.0.html');
    expect(licenseLink).toHaveAttribute('target', '_blank');
  });

  it('should display all API protocols', () => {
    render(<Footer />);

    expect(screen.getByText('REST API')).toBeInTheDocument();
    expect(screen.getByText('GraphQL')).toBeInTheDocument();
    expect(screen.getByText('gRPC')).toBeInTheDocument();
    expect(screen.getByText('RSocket')).toBeInTheDocument();
  });

  it('should display technology stack', () => {
    render(<Footer />);

    // Should mention React, TypeScript, Vite
    const techText = screen.getByText(/React, TypeScript & Vite/i);
    expect(techText).toBeInTheDocument();
  });

  it('should display heart emoji', () => {
    render(<Footer />);

    expect(screen.getByText('❤️')).toBeInTheDocument();
  });

  it('should have semantic HTML structure', () => {
    const { container } = render(<Footer />);

    // Should use <footer> tag
    const footerElement = container.querySelector('footer');
    expect(footerElement).toBeInTheDocument();

    // Should have heading elements
    const headings = container.querySelectorAll('h3, h4');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('should render social media section with icons', () => {
    render(<Footer />);

    // Check for LinkedIn link
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedinLink).toHaveAttribute('href', expect.stringContaining('linkedin.com'));
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Check for X (Twitter) link
    const twitterLink = screen.getByRole('link', { name: /x \(twitter\)/i });
    expect(twitterLink).toHaveAttribute('href', expect.stringContaining('twitter.com'));
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Social media icons should have SVG elements
    const socialSection = screen.getByText(/social media/i).closest('.footer-section');
    expect(socialSection).toBeInTheDocument();
    
    const svgs = socialSection?.querySelectorAll('svg');
    expect(svgs?.length).toBeGreaterThan(0);
  });

  it('should render resource links with icons', () => {
    render(<Footer />);

    // Resources section should exist
    const resourcesHeading = screen.getByText(/resources/i);
    expect(resourcesHeading).toBeInTheDocument();

    // Resource links should have icons
    const resourceSection = resourcesHeading.closest('.footer-section');
    const svgs = resourceSection?.querySelectorAll('svg.footer-icon');
    expect(svgs?.length).toBeGreaterThanOrEqual(2); // GitHub and GitLab icons
  });
});

/**
 * KEY TAKEAWAYS:
 *
 * 1. Test that all content renders
 * 2. Verify external links have security attributes (rel="noopener noreferrer")
 * 3. Test dynamic content (current year)
 * 4. Mock Date for consistent tests
 * 5. Check semantic HTML (footer role, headings)
 * 6. Test accessibility (contentinfo role, aria-labels)
 * 7. Use getAllBy* when multiple elements match (e.g., multiple GitHub links)
 * 8. Test new features (social media icons, resource icons)
 * 9. Query by sections to test specific areas (closest('.footer-section'))
 */
