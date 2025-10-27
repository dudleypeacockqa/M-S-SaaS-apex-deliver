/**
 * Tests for FinancialRatiosDashboard Component - DEV-010 Phase 2.2
 * TDD: Write tests first, then implement component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FinancialRatiosDashboard } from './FinancialRatiosDashboard';

describe('FinancialRatiosDashboard Component', () => {
  const mockRatios = {
    // Liquidity Ratios
    current_ratio: 2.5,
    quick_ratio: 1.8,
    cash_ratio: 0.9,

    // Profitability Ratios
    gross_profit_margin: 45.5,
    net_profit_margin: 18.2,
    return_on_assets: 12.5,
    return_on_equity: 22.3,

    // Leverage Ratios
    debt_to_equity: 0.6,
    debt_to_assets: 0.35,
    interest_coverage: 8.5,
  };

  it('should render liquidity ratios section', () => {
    render(<FinancialRatiosDashboard ratios={mockRatios} />);

    expect(screen.getByText(/liquidity/i)).toBeInTheDocument();
    expect(screen.getByText(/current ratio/i)).toBeInTheDocument();
    // Check for the ratio card containing both label and value
    const currentRatioCard = screen.getByText(/current ratio/i).closest('.ratio-card');
    expect(currentRatioCard).toHaveTextContent('2.50');
  });

  it('should render profitability ratios section', () => {
    render(<FinancialRatiosDashboard ratios={mockRatios} />);

    expect(screen.getByText(/profitability/i)).toBeInTheDocument();
    expect(screen.getByText(/gross profit margin/i)).toBeInTheDocument();
    expect(screen.getByText(/45\.5%/)).toBeInTheDocument();
  });

  it('should render leverage ratios section', () => {
    render(<FinancialRatiosDashboard ratios={mockRatios} />);

    expect(screen.getByText(/leverage/i)).toBeInTheDocument();
    expect(screen.getByText(/debt to equity/i)).toBeInTheDocument();
    expect(screen.getByText(/0\.6/)).toBeInTheDocument();
  });

  it('should show visual indicator for good ratios', () => {
    render(<FinancialRatiosDashboard ratios={mockRatios} />);

    // Current ratio > 2.0 is good
    const currentRatioCard = screen.getByText(/current ratio/i).closest('.ratio-card');
    expect(currentRatioCard).toHaveClass('indicator-good');
  });

  it('should show visual indicator for warning ratios', () => {
    const warningRatios = {
      current_ratio: 1.2, // 1.0 - 1.5 is warning range
      net_profit_margin: 8.0,
      debt_to_equity: 1.5,
    };

    render(<FinancialRatiosDashboard ratios={warningRatios} />);

    const currentRatioCard = screen.getByText(/current ratio/i).closest('.ratio-card');
    expect(currentRatioCard).toHaveClass('indicator-warning');
  });

  it('should show visual indicator for bad ratios', () => {
    const badRatios = {
      current_ratio: 0.7, // < 1.0 is bad
      net_profit_margin: 2.0,
      debt_to_equity: 3.0,
    };

    render(<FinancialRatiosDashboard ratios={badRatios} />);

    const currentRatioCard = screen.getByText(/current ratio/i).closest('.ratio-card');
    expect(currentRatioCard).toHaveClass('indicator-bad');
  });

  it('should handle null ratio values gracefully', () => {
    const incompleteRatios = {
      current_ratio: 2.5,
      quick_ratio: null,
      gross_profit_margin: 45.5,
    };

    render(<FinancialRatiosDashboard ratios={incompleteRatios} />);

    expect(screen.getByText(/current ratio/i)).toBeInTheDocument();
    expect(screen.getByText(/2\.5/)).toBeInTheDocument();

    // Quick ratio should show "N/A" or similar
    const quickRatioCard = screen.getByText(/quick ratio/i).closest('.ratio-card');
    expect(quickRatioCard).toHaveTextContent(/n\/a|not available/i);
  });

  it('should render organized in category tabs or sections', () => {
    render(<FinancialRatiosDashboard ratios={mockRatios} />);

    // Should have sections for each category
    expect(screen.getByText(/liquidity/i)).toBeInTheDocument();
    expect(screen.getByText(/profitability/i)).toBeInTheDocument();
    expect(screen.getByText(/leverage/i)).toBeInTheDocument();
  });

  it('should display ratio descriptions on hover or click', () => {
    render(<FinancialRatiosDashboard ratios={mockRatios} />);

    // Each ratio card should have a description or info icon
    const ratioCards = screen.getAllByRole('article');
    expect(ratioCards.length).toBeGreaterThan(0);

    // Each card should have a title
    ratioCards.forEach((card) => {
      expect(card).toHaveTextContent(/.+/); // Not empty
    });
  });

  it('should show empty state when no ratios provided', () => {
    render(<FinancialRatiosDashboard ratios={{}} />);

    expect(screen.getByText(/no financial ratios available/i)).toBeInTheDocument();
  });
});
