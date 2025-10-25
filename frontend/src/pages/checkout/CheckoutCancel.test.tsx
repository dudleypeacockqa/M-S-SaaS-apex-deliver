import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CheckoutCancel } from './CheckoutCancel';

describe('CheckoutCancel', () => {
  it('should display cancellation message', () => {
    render(
      <BrowserRouter>
        <CheckoutCancel />
      </BrowserRouter>
    );

    expect(screen.getByText(/checkout.*cancel/i)).toBeInTheDocument();
    expect(screen.getByText(/didn't.*complete/i)).toBeInTheDocument();
  });

  it('should provide link back to pricing page', () => {
    render(
      <BrowserRouter>
        <CheckoutCancel />
      </BrowserRouter>
    );

    const pricingLink = screen.getByRole('link', { name: /view.*pricing/i });
    expect(pricingLink).toBeInTheDocument();
    expect(pricingLink).toHaveAttribute('href', '/pricing');
  });

  it('should not require authentication', () => {
    render(
      <BrowserRouter>
        <CheckoutCancel />
      </BrowserRouter>
    );

    expect(screen.getByText(/checkout.*cancel/i)).toBeInTheDocument();
  });
});
