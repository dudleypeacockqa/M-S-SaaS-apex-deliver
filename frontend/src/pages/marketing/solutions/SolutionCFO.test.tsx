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
    it('should render main heading with FinanceFlo message', () => {
      renderWithRouter(<SolutionCFO />);
      expect(screen.getByRole('heading', { level: 1, name: /erp data \+ capliquify guardrails/i })).toBeInTheDocument();
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
    it('should mention ERP, CapLiquify, and ApexDeliver benefits', () => {
      renderWithRouter(<SolutionCFO />);
      expect(screen.getByText(/erp blueprint \+ migration/i)).toBeInTheDocument();
      expect(screen.getAllByText(/capliquify guardrails/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/apexdeliver hand-off/i)).toBeInTheDocument();
    });

    it('should render blueprint and trial CTAs', () => {
      renderWithRouter(<SolutionCFO />);
      expect(screen.getByRole('link', { name: /book implementation blueprint/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /start capliquify \+ apexdeliver trial/i })).toBeInTheDocument();
    });
  });
});

