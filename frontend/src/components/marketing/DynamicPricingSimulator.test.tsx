import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DynamicPricingSimulator } from './DynamicPricingSimulator';

// Mock Recharts
vi.mock('recharts', () => {
  const OriginalModule = vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div className="recharts-responsive-container">{children}</div>,
    BarChart: ({ children }: { children: React.ReactNode }) => <div className="recharts-bar-chart">{children}</div>,
    Bar: () => <div className="recharts-bar" />,
    XAxis: () => <div className="recharts-x-axis" />,
    YAxis: () => <div className="recharts-y-axis" />,
    CartesianGrid: () => <div className="recharts-cartesian-grid" />,
    Tooltip: () => <div className="recharts-tooltip" />,
    Cell: () => <div className="recharts-cell" />,
  };
});

describe('DynamicPricingSimulator', () => {
  it('renders title', () => {
    render(<DynamicPricingSimulator />);
    expect(screen.getByText('Dynamic Pricing Engine')).toBeInTheDocument();
  });

  it('renders inputs', () => {
    render(<DynamicPricingSimulator />);
    expect(screen.getByText('Base Product Price ($)')).toBeInTheDocument();
    expect(screen.getByText('Discount Strategy (%)')).toBeInTheDocument();
  });

  it('renders elasticity slider', () => {
    render(<DynamicPricingSimulator />);
    expect(screen.getByText(/Market Elasticity/)).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('shows AI recommendation', () => {
    render(<DynamicPricingSimulator />);
    expect(screen.getByText('AI Recommendation')).toBeInTheDocument();
    expect(screen.getByText(/5% discount/)).toBeInTheDocument();
  });

  it('updates base price', () => {
    render(<DynamicPricingSimulator />);
    const input = screen.getByDisplayValue('100');
    fireEvent.change(input, { target: { value: '200' } });
    expect(input).toHaveValue(200);
  });
});
