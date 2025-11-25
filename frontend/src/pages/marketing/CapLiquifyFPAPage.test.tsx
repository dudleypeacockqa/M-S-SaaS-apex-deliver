/**
 * Tests for CapLiquifyFPAPage
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CapLiquifyFPAPage } from './CapLiquifyFPAPage';
import { BrowserRouter } from 'react-router-dom';

// Mock analytics
vi.mock('../../lib/analytics', () => ({
  trackCtaClick: vi.fn(),
}));

// Mock components that use recharts
vi.mock('../../components/marketing/CashFlowCalculator', () => ({
  CashFlowCalculator: () => <div data-testid="cash-flow-calculator">Cash Flow Calculator</div>,
}));

vi.mock('../../components/marketing/VideoShowcase', () => ({
  VideoShowcase: () => <div data-testid="video-showcase">Video Showcase</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CapLiquifyFPAPage', () => {
  describe('Hero Section', () => {
    it('should render main value proposition', () => {
      renderWithRouter(<CapLiquifyFPAPage />);
      expect(screen.getByText(/transform cash flow visibility in/i)).toBeInTheDocument();
      // Multiple instances of "2 hours" may exist, check first one
      expect(screen.getAllByText(/2 hours/i)[0]).toBeInTheDocument();
    });

    it('should render CapLiquify FP&A badge', () => {
      renderWithRouter(<CapLiquifyFPAPage />);
      expect(screen.getAllByText('CapLiquify FP&A')[0]).toBeInTheDocument();
    });
  });

  describe('Features Section', () => {
    it('should render "13-Week Direct Cash Forecasting" feature', () => {
      renderWithRouter(<CapLiquifyFPAPage />);
      // Multiple instances may exist (heading and description)
      expect(screen.getAllByText(/13-week direct cash forecasting/i)[0]).toBeInTheDocument();
    });

    it('should render "Working Capital Drivers" feature', () => {
      renderWithRouter(<CapLiquifyFPAPage />);
      expect(screen.getByText(/working capital drivers/i)).toBeInTheDocument();
      expect(screen.getByText(/dso.*dpo.*dio/i)).toBeInTheDocument();
    });

    it('should render "Lender-Ready PDF Packs" feature', () => {
      renderWithRouter(<CapLiquifyFPAPage />);
      expect(screen.getByText(/lender-ready pdf packs/i)).toBeInTheDocument();
    });

    it('should render "ERP Integration" feature', () => {
      renderWithRouter(<CapLiquifyFPAPage />);
      // Multiple instances may exist (heading and description)
      expect(screen.getAllByText(/erp integration/i)[0]).toBeInTheDocument();
      // Check for Sage Intacct (may appear multiple times)
      const sageElements = screen.getAllByText(/sage intacct/i);
      expect(sageElements.length).toBeGreaterThan(0);
    });
  });

  describe('Use Cases', () => {
    it('should render Portfolio CFO use case', () => {
      renderWithRouter(<CapLiquifyFPAPage />);
      expect(screen.getByText(/portfolio cfo/i)).toBeInTheDocument();
    });

    it('should render Controller use case', () => {
      renderWithRouter(<CapLiquifyFPAPage />);
      expect(screen.getByText(/controller/i)).toBeInTheDocument();
    });
  });
});
