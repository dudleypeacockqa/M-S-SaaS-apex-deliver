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
      expect(screen.getAllByText(/75%/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/faster pmi cycles/i)).toBeInTheDocument();
    });
  });

  describe('Case Study: Horizon Capital Partners', () => {
    it('should render Horizon Capital Partners case study', () => {
      renderWithRouter(<CaseStudiesPage />);
      expect(screen.getByText('Horizon Capital Partners')).toBeInTheDocument();
      expect(screen.getAllByText(/private equity/i)[0]).toBeInTheDocument();
    });

    it('should render metrics', () => {
      renderWithRouter(<CaseStudiesPage />);
      // Use getAllByText because "40%" might appear in multiple places (e.g. other case studies or copy)
      const metrics = screen.getAllByText(/40%/i);
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0]).toBeInTheDocument();
    });

    it('should render testimonial quote', () => {
      renderWithRouter(<CaseStudiesPage />);
      expect(screen.getByText(/transformed how we manage our deal flow/i)).toBeInTheDocument();
    });
  });

  describe('Multiple Case Studies', () => {
    it('should render at least 5 case studies', () => {
      renderWithRouter(<CaseStudiesPage />);

      expect(screen.getByText('Horizon Capital Partners')).toBeInTheDocument();
      expect(screen.getByText('TechGrowth Solutions')).toBeInTheDocument();
      expect(screen.getByText('Park Advisory')).toBeInTheDocument();
      expect(screen.getByText('Equilibrium Partners')).toBeInTheDocument();
      expect(screen.getByText('NexGen Manufacturing')).toBeInTheDocument();
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
