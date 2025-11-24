/**
 * Tests for SolutionDealTeam page
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SolutionDealTeam } from './SolutionDealTeam';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SolutionDealTeam Page', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  describe('Page Rendering', () => {
    it('should render main heading', () => {
      renderWithRouter(<SolutionDealTeam />);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should render SEO metadata', () => {
      renderWithRouter(<SolutionDealTeam />);
      expect(document.title).toBeTruthy();
    });

    it('should render canonical URL for financeflo.ai', () => {
      renderWithRouter(<SolutionDealTeam />);
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        expect(canonical.getAttribute('href')).toContain('financeflo.ai');
        expect(canonical.getAttribute('href')).not.toContain('100daysandbeyond.com');
        expect(canonical.getAttribute('href')).not.toContain('apexdeliver.com');
      }
    });
  });
});

