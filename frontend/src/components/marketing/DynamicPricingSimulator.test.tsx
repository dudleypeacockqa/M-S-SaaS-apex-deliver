import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { DynamicPricingSimulator } from './DynamicPricingSimulator';

vi.mock('recharts', () => {
  const MockContainer: React.FC<React.PropsWithChildren> = ({ children }) => (
    <div data-testid="mock-responsive-container">{children}</div>
  );
  const makeNullComponent = () => () => null;

  return {
    ResponsiveContainer: MockContainer,
    BarChart: MockContainer,
    CartesianGrid: makeNullComponent(),
    XAxis: makeNullComponent(),
    YAxis: makeNullComponent(),
    Tooltip: makeNullComponent(),
    Legend: makeNullComponent(),
    Bar: makeNullComponent(),
  };
});

describe('DynamicPricingSimulator', () => {
  it('announces the best case revenue and updates when inputs change', () => {
    render(<DynamicPricingSimulator />);

    const summary = screen.getByTestId('pricing-summary');
    expect(summary).toHaveTextContent(/Best case revenue/i);
    expect(summary).toHaveTextContent('Volume (50+)');
    expect(summary).toHaveTextContent('$13,500');

    const seasonalInput = screen.getByLabelText(/Seasonal Multiplier/i);
    fireEvent.change(seasonalInput, { target: { value: '1.8' } });

    expect(summary).toHaveTextContent('Seasonal Peak');
    expect(summary).toHaveTextContent('$14,400');
  });
});
import { render, screen, fireEvent } from '@testing-library/react';
import { DynamicPricingSimulator } from './DynamicPricingSimulator';
import React from 'react';

// Mock Recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => <div>Bar</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
}));

describe('DynamicPricingSimulator', () => {
  it('renders all inputs', () => {
    render(<DynamicPricingSimulator />);
    expect(screen.getByLabelText('Base Price ($)')).toBeInTheDocument();
    expect(screen.getByLabelText('Volume Discount (%)')).toBeInTheDocument();
    expect(screen.getByLabelText('Seasonal Multiplier (x)')).toBeInTheDocument();
  });

  it('renders impact analysis', () => {
    render(<DynamicPricingSimulator />);
    expect(screen.getByText('Impact Analysis')).toBeInTheDocument();
    expect(screen.getByText(/Volume pricing could increase revenue/)).toBeInTheDocument();
  });
});

