/**
 * Tests for CaseStudiesPage
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseStudiesPage } from './CaseStudiesPage';
import { BrowserRouter } from 'react-router-dom';

// Mock analytics
vi.mock('../../lib/analytics', () => ({
  trackCtaClick: vi.fn(),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CaseStudiesPage', () => {
  describe('Hero Section', () => {
    it('should render main heading', () => {
      renderWithRouter(<CaseStudiesPage />);
      expect(screen.getByText(/real results from real dealmakers/i)).toBeInTheDocument();
    });

    it('should render key metrics in hero', () => {
      renderWithRouter(<CaseStudiesPage />);
      // Multiple instances of "75%" may exist (hero, case studies, etc)
      expect(screen.getAllByText(/75%/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/faster pmi cycles/i)).toBeInTheDocument();
    });
  });

  describe('Case Study: TechVentures PE', () => {
    it('should render TechVentures PE case study', () => {
      renderWithRouter(<CaseStudiesPage />);
      expect(screen.getByText('TechVentures PE')).toBeInTheDocument();
      // Multiple instances of "private equity" may exist (multiple case studies)
      expect(screen.getAllByText(/private equity/i)[0]).toBeInTheDocument();
    });

    it('should render PMI reduction result', () => {
      renderWithRouter(<CaseStudiesPage />);
      expect(screen.getByText(/reduced post-merger integration from 18 months to 4\.5 months/i)).toBeInTheDocument();
    });

    it('should render testimonial quote', () => {
      renderWithRouter(<CaseStudiesPage />);
      expect(screen.getByText(/capliquify transformed how we manage our portfolio/i)).toBeInTheDocument();
    });
  });

  describe('Multiple Case Studies', () => {
    it('should render at least 5 case studies', () => {
      renderWithRouter(<CaseStudiesPage />);

      expect(screen.getByText('TechVentures PE')).toBeInTheDocument();
      expect(screen.getByText('Precision Manufacturing Group')).toBeInTheDocument();
      expect(screen.getByText('Horizon Capital Partners')).toBeInTheDocument();
      expect(screen.getByText('Regional Distribution Co.')).toBeInTheDocument();
      expect(screen.getByText('Growth Equity Fund')).toBeInTheDocument();
    });
  });

  describe('CTA Section', () => {
    it('should render CTA heading', () => {
      renderWithRouter(<CaseStudiesPage />);
      expect(screen.getByText(/ready to write your own success story/i)).toBeInTheDocument();
    });

    it('should render trial CTA button', () => {
      renderWithRouter(<CaseStudiesPage />);
      const buttons = screen.getAllByText(/start your free 14-day trial/i);
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
