/**
 * Tests for MidaxoAlternative page
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MidaxoAlternative } from './MidaxoAlternative';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MidaxoAlternative Page', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  describe('Page Rendering', () => {
    it('should render main heading', () => {
      renderWithRouter(<MidaxoAlternative />);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should render canonical URL for financeflo.ai', () => {
      renderWithRouter(<MidaxoAlternative />);
      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).not.toBeNull();
      expect(canonical?.getAttribute('href')).toBe('https://financeflo.ai/compare/midaxo-alternative');
      expect(canonical?.getAttribute('href')).not.toContain('100daysandbeyond.com');
    });

    it('should render comparison content', () => {
      renderWithRouter(<MidaxoAlternative />);
      // Check for comparison-related content
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });
});

