/**
 * Tests for SalesPromotionPricingPage
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SalesPromotionPricingPage } from './SalesPromotionPricingPage';
import { BrowserRouter } from 'react-router-dom';

// Mock analytics
vi.mock('../../lib/analytics', () => ({
  trackCtaClick: vi.fn(),
}));

// Mock DynamicPricingSimulator which uses recharts
vi.mock('../../components/marketing/DynamicPricingSimulator', () => ({
  DynamicPricingSimulator: () => <div data-testid="dynamic-pricing-simulator">Dynamic Pricing Simulator</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SalesPromotionPricingPage', () => {
  describe('Features Section', () => {
    it('should render "Dynamic Pricing Engine" feature', () => {
      renderWithRouter(<SalesPromotionPricingPage />);
      // Multiple instances may exist (heading and description)
      expect(screen.getAllByText(/dynamic pricing engine/i)[0]).toBeInTheDocument();
    });

    it('should render "Promotion Management" feature', () => {
      renderWithRouter(<SalesPromotionPricingPage />);
      expect(screen.getByText(/promotion management/i)).toBeInTheDocument();
    });

    it('should render "B2B2C Customer Portals" feature', () => {
      renderWithRouter(<SalesPromotionPricingPage />);
      // Multiple instances may exist (heading and description)
      expect(screen.getAllByText(/b2b2c customer portals/i)[0]).toBeInTheDocument();
    });

    it('should render "Quote & Proposal Generation" feature', () => {
      renderWithRouter(<SalesPromotionPricingPage />);
      expect(screen.getByText(/quote & proposal generation/i)).toBeInTheDocument();
    });

    it('should render "Analytics & Reporting" feature', () => {
      renderWithRouter(<SalesPromotionPricingPage />);
      expect(screen.getByText(/analytics & reporting/i)).toBeInTheDocument();
    });
  });

  describe('Key Capabilities', () => {
    it('should mention tiered pricing capability', () => {
      renderWithRouter(<SalesPromotionPricingPage />);
      expect(screen.getByText(/tiered pricing by customer segment/i)).toBeInTheDocument();
    });

    it('should mention self-service order placement', () => {
      renderWithRouter(<SalesPromotionPricingPage />);
      expect(screen.getByText(/self-service order placement/i)).toBeInTheDocument();
    });

    it('should mention campaign creation', () => {
      renderWithRouter(<SalesPromotionPricingPage />);
      expect(screen.getByText(/campaign creation and scheduling/i)).toBeInTheDocument();
    });
  });
});
