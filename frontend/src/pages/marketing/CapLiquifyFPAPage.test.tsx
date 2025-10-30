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

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CapLiquifyFPAPage', () => {
  describe('Hero Section', () => {
    it('should render main value proposition', () => {
      renderWithRouter(<CapLiquifyFPAPage />);
      expect(screen.getByText(/transform cash flow visibility in/i)).toBeInTheDocument();
      expect(screen.getByText(/2 hours/i)).toBeInTheDocument();
    });

    it('should render CapLiquify FP&A badge', () => {
      renderWithRouter(<CapLiquifyFPAPage />);
      expect(screen.getByText('CapLiquify FP&A')).toBeInTheDocument();
    });
  });

  describe('Features Section', () => {
    it('should render "13-Week Direct Cash Forecasting" feature', () => {
      renderWithRouter(<CapLiquifyFPAPage />);
      expect(screen.getByText(/13-week direct cash forecasting/i)).toBeInTheDocument();
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
      expect(screen.getByText(/erp integration/i)).toBeInTheDocument();
      expect(screen.getByText(/sage intacct.*odoo/i)).toBeInTheDocument();
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
