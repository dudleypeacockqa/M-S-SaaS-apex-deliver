/**
 * Tests for SolutionCFO page
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SolutionCFO } from './SolutionCFO';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SolutionCFO Page', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  describe('Page Rendering', () => {
    it('should render main heading', () => {
      renderWithRouter(<SolutionCFO />);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should render SEO title', () => {
      renderWithRouter(<SolutionCFO />);
      expect(document.title).toContain('CFO');
    });

    it('should render canonical URL for financeflo.ai', () => {
      renderWithRouter(<SolutionCFO />);
      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).not.toBeNull();
      expect(canonical?.getAttribute('href')).toBe('https://financeflo.ai/solutions/cfo');
      expect(canonical?.getAttribute('href')).not.toContain('100daysandbeyond.com');
      expect(canonical?.getAttribute('href')).not.toContain('apexdeliver.com');
    });
  });

  describe('Content Sections', () => {
    it('should render feature cards', () => {
      renderWithRouter(<SolutionCFO />);
      // Check for feature-related content
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(1);
    });

    it('should render CTA section', () => {
      renderWithRouter(<SolutionCFO />);
      // CTA section should be present (check for common CTA text patterns)
      const ctaLinks = screen.queryAllByRole('link', { name: /get started|start trial|contact|sign up/i });
      expect(ctaLinks.length).toBeGreaterThan(0);
    });
  });
});

