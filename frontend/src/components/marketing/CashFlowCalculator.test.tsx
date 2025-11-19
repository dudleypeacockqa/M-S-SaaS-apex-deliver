import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CashFlowCalculator } from './CashFlowCalculator';

// Mock Recharts since it uses ResizeObserver which isn't in JSDOM
vi.mock('recharts', () => {
  const OriginalModule = vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div className="recharts-responsive-container">{children}</div>,
    LineChart: ({ children }: { children: React.ReactNode }) => <div className="recharts-line-chart">{children}</div>,
    Line: () => <div className="recharts-line" />,
    XAxis: () => <div className="recharts-x-axis" />,
    YAxis: () => <div className="recharts-y-axis" />,
    CartesianGrid: () => <div className="recharts-cartesian-grid" />,
    Tooltip: () => <div className="recharts-tooltip" />,
    ReferenceLine: () => <div className="recharts-reference-line" />,
  };
});

describe('CashFlowCalculator', () => {
  it('renders input fields correctly', () => {
    render(<CashFlowCalculator />);
    expect(screen.getByText('Starting Cash Balance')).toBeInTheDocument();
    expect(screen.getByText('Avg. Weekly Revenue')).toBeInTheDocument();
    expect(screen.getByText('Avg. Weekly Expenses')).toBeInTheDocument();
  });

  it('renders chart container', () => {
    render(<CashFlowCalculator />);
    expect(screen.getByText('13-Week Cash Flow Simulator')).toBeInTheDocument();
  });

  it('updates volatility when slider changes', () => {
    render(<CashFlowCalculator />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '10' } });
    expect(screen.getByText('Market Volatility (10%)')).toBeInTheDocument();
  });

  it('shows positive cash flow message by default', () => {
    render(<CashFlowCalculator />);
    expect(screen.getByText('✅ Positive cash runway maintained')).toBeInTheDocument();
  });

  it('updates inputs', () => {
    render(<CashFlowCalculator />);
    const revenueInput = screen.getByDisplayValue('50000'); // Weekly Revenue
    fireEvent.change(revenueInput, { target: { value: '60000' } });
    expect(revenueInput).toHaveValue(60000);
  });
});
