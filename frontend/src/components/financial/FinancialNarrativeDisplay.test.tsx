/**
 * Tests for FinancialNarrativeDisplay Component - DEV-010 Phase 2.3
 * TDD: Write tests first, then implement component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FinancialNarrativeDisplay } from './FinancialNarrativeDisplay';

describe('FinancialNarrativeDisplay Component', () => {
  const mockNarrative = {
    summary: 'The company demonstrates strong financial health with consistent profitability and manageable debt levels. Revenue growth of 15% YoY indicates market traction.',
    strengths: [
      'Strong liquidity position with current ratio of 2.5',
      'High profitability margins (gross: 45%, net: 18%)',
      'Low debt-to-equity ratio of 0.6 indicates conservative leverage',
    ],
    weaknesses: [
      'Inventory turnover could be improved',
      'Working capital cycle is slightly longer than industry average',
    ],
    redFlags: [
      'Declining interest coverage ratio over past 2 quarters',
    ],
    growthSignals: [
      'Revenue growth accelerating (10% → 15% YoY)',
      'Expanding profit margins indicate operational efficiency',
    ],
    aiModel: 'gpt-4',
    generatedAt: '2025-10-26T10:30:00Z',
  };

  it('should render executive summary', () => {
    render(<FinancialNarrativeDisplay narrative={mockNarrative} />);

    expect(screen.getByText(/strong financial health/i)).toBeInTheDocument();
    expect(screen.getByText(/revenue growth of 15%/i)).toBeInTheDocument();
  });

  it('should render strengths section with all items', () => {
    render(<FinancialNarrativeDisplay narrative={mockNarrative} />);

    expect(screen.getByText(/strengths/i)).toBeInTheDocument();
    expect(screen.getByText(/strong liquidity position/i)).toBeInTheDocument();
    expect(screen.getByText(/high profitability margins/i)).toBeInTheDocument();
    expect(screen.getByText(/low debt-to-equity/i)).toBeInTheDocument();
  });

  it('should render weaknesses section with all items', () => {
    render(<FinancialNarrativeDisplay narrative={mockNarrative} />);

    expect(screen.getByText(/weaknesses/i)).toBeInTheDocument();
    expect(screen.getByText(/inventory turnover/i)).toBeInTheDocument();
    expect(screen.getByText(/working capital cycle/i)).toBeInTheDocument();
  });

  it('should render red flags section with warning styling', () => {
    render(<FinancialNarrativeDisplay narrative={mockNarrative} />);

    expect(screen.getByText(/red flags/i)).toBeInTheDocument();
    expect(screen.getByText(/declining interest coverage/i)).toBeInTheDocument();

    // Red flags section should have warning/error styling
    const redFlagsSection = screen.getByText(/red flags/i).closest('section');
    expect(redFlagsSection).toHaveClass(/red|warning|danger/i);
  });

  it('should render growth signals section', () => {
    render(<FinancialNarrativeDisplay narrative={mockNarrative} />);

    expect(screen.getByText(/growth signals/i)).toBeInTheDocument();
    expect(screen.getByText(/revenue growth accelerating/i)).toBeInTheDocument();
    expect(screen.getByText(/expanding profit margins/i)).toBeInTheDocument();
  });

  it('should call onRegenerate when regenerate button is clicked', () => {
    const onRegenerateMock = vi.fn();

    render(
      <FinancialNarrativeDisplay
        narrative={mockNarrative}
        onRegenerate={onRegenerateMock}
      />
    );

    const regenerateButton = screen.getByRole('button', { name: /regenerate/i });
    fireEvent.click(regenerateButton);

    expect(onRegenerateMock).toHaveBeenCalledTimes(1);
  });

  it('should show empty state when no narrative provided', () => {
    render(<FinancialNarrativeDisplay narrative={null} />);

    expect(screen.getByText(/no narrative available/i)).toBeInTheDocument();
    expect(screen.getByText(/generate.*narrative/i)).toBeInTheDocument();
  });

  it('should display generation metadata', () => {
    render(<FinancialNarrativeDisplay narrative={mockNarrative} />);

    expect(screen.getByText(/gpt-4/i)).toBeInTheDocument();
    expect(screen.getByText(/generated/i)).toBeInTheDocument();
  });

  it('should support markdown formatting in summary', () => {
    const narrativeWithMarkdown = {
      ...mockNarrative,
      summary: 'The company has **excellent** profitability.',
    };

    render(<FinancialNarrativeDisplay narrative={narrativeWithMarkdown} />);

    // Check that the summary content is rendered (markdown is processed by ReactMarkdown)
    expect(screen.getByText(/excellent/i)).toBeInTheDocument();
    expect(screen.getByText(/profitability/i)).toBeInTheDocument();
  });
});
