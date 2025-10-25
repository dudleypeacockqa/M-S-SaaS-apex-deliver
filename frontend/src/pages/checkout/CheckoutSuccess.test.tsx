import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CheckoutSuccess } from './CheckoutSuccess';

describe('CheckoutSuccess', () => {
  it('should display success message', () => {
    render(
      <BrowserRouter>
        <CheckoutSuccess />
      </BrowserRouter>
    );

    expect(screen.getByText(/Success/i)).toBeInTheDocument();
    expect(screen.getByText(/subscription.*activated/i)).toBeInTheDocument();
  });

  it('should show subscription confirmation details', () => {
    render(
      <BrowserRouter>
        <CheckoutSuccess />
      </BrowserRouter>
    );

    expect(screen.getByText(/thank you/i)).toBeInTheDocument();
    expect(screen.getByText(/confirmation.*email/i)).toBeInTheDocument();
  });

  it('should provide link to billing dashboard', () => {
    render(
      <BrowserRouter>
        <CheckoutSuccess />
      </BrowserRouter>
    );

    const dashboardLink = screen.getByRole('link', { name: /view.*billing.*dashboard/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute('href', '/dashboard/billing');
  });
});
