import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CashFlowCalculator } from './CashFlowCalculator';
import React from 'react';

// Mock Recharts since it doesn't render well in JSDOM
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => <div>Line</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Tooltip: () => <div>Tooltip</div>,
}));

describe('CashFlowCalculator', () => {
  it('renders input fields for starting cash, revenue, expenses', () => {
    render(<CashFlowCalculator />);
    expect(screen.getByLabelText(/starting cash/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weekly revenue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weekly expenses/i)).toBeInTheDocument();
  });

  it('calculates forecast when button clicked', async () => {
    render(<CashFlowCalculator />);
    
    // Inputs are already populated with defaults, so just click
    fireEvent.click(screen.getByText(/Calculate Forecast/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Cash remains positive/i)).toBeInTheDocument();
    });
  });
  
  it('shows warning when cash goes negative', async () => {
    render(<CashFlowCalculator />);
    
    const revenueInput = screen.getByLabelText(/weekly revenue/i);
    const expensesInput = screen.getByLabelText(/weekly expenses/i);
    
    fireEvent.change(revenueInput, { target: { value: '1000' } });
    fireEvent.change(expensesInput, { target: { value: '20000' } }); // High expenses to drain cash
    
    fireEvent.click(screen.getByText(/Calculate Forecast/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Warning: Cash goes negative/i)).toBeInTheDocument();
    });
  });
});

