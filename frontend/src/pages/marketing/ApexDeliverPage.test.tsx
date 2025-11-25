/**
 * Tests for ApexDeliverPage
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ApexDeliverPage } from './ApexDeliverPage';
import * as analytics from '../../lib/analytics';

// Mock analytics
vi.mock('../../lib/analytics', () => ({
  trackCtaClick: vi.fn(),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ApexDeliverPage', () => {
  describe('Hero Section', () => {
    it('should render main heading', () => {
      renderWithRouter(<ApexDeliverPage />);
      // Find the h1 heading specifically
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toMatch(/Execute Deals/i);
    });

    it('should render hero description', () => {
      renderWithRouter(<ApexDeliverPage />);
      expect(screen.getByText(/The complete operating system for modern dealmakers/i)).toBeInTheDocument();
    });
  });

  describe('Features Section', () => {
    it('should render AI-Powered Deal Sourcing feature', () => {
      renderWithRouter(<ApexDeliverPage />);
      expect(screen.getByText(/AI-Powered Deal Sourcing/i)).toBeInTheDocument();
    });

    it('should render Secure Virtual Data Room feature', () => {
      renderWithRouter(<ApexDeliverPage />);
      expect(screen.getByText(/Secure Virtual Data Room/i)).toBeInTheDocument();
    });

    it('should render Multi-Method Valuation feature', () => {
      renderWithRouter(<ApexDeliverPage />);
      expect(screen.getByText(/Multi-Method Valuation/i)).toBeInTheDocument();
    });

    it('should render Deal Pipeline Management feature', () => {
      renderWithRouter(<ApexDeliverPage />);
      expect(screen.getByText(/Deal Pipeline Management/i)).toBeInTheDocument();
    });

    it('should render PMI & 100-Day Plans feature', () => {
      renderWithRouter(<ApexDeliverPage />);
      expect(screen.getByText(/PMI & 100-Day Plans/i)).toBeInTheDocument();
    });

    it('should render Document Automation feature', () => {
      renderWithRouter(<ApexDeliverPage />);
      expect(screen.getByText(/Document Automation/i)).toBeInTheDocument();
    });
  });

  describe('Use Cases Section', () => {
    it('should render Private Equity Partner use case', () => {
      renderWithRouter(<ApexDeliverPage />);
      expect(screen.getByText(/Private Equity Partner/i)).toBeInTheDocument();
    });

    it('should render Corporate Dev Lead use case', () => {
      renderWithRouter(<ApexDeliverPage />);
      expect(screen.getByText(/Corporate Dev Lead/i)).toBeInTheDocument();
    });
  });

  describe('CTA Section', () => {
    it('should render CTA buttons', () => {
      renderWithRouter(<ApexDeliverPage />);
      expect(screen.getByText(/Start 14-Day Free Trial/i)).toBeInTheDocument();
      expect(screen.getByText(/Book a Demo/i)).toBeInTheDocument();
    });
  });
});

