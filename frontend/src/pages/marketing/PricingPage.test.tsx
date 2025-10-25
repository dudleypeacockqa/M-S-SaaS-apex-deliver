import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PricingPage } from './PricingPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PricingPage', () => {
  it('renders all 4 pricing tiers', () => {
    renderWithRouter(<PricingPage />);
    const tierNames = ['Starter', 'Professional', 'Enterprise', 'Community Leader'];
    tierNames.forEach((name) => {
      const matches = screen.getAllByText(name);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  it('displays correct pricing amounts', () => {
    renderWithRouter(<PricingPage />);
    expect(screen.getByText(/£279/)).toBeInTheDocument(); // Starter
    expect(screen.getByText(/£598/)).toBeInTheDocument(); // Professional
    expect(screen.getByText(/£1,598/)).toBeInTheDocument(); // Enterprise
    expect(screen.getByText(/£2,997/)).toBeInTheDocument(); // Community Leader
  });

  it('highlights Professional tier as most popular', () => {
    renderWithRouter(<PricingPage />);
    expect(screen.getByText(/most popular/i)).toBeInTheDocument();
  });

  it('renders main heading', () => {
    renderWithRouter(<PricingPage />);
    expect(screen.getByRole('heading', { name: /pricing|choose your plan/i })).toBeInTheDocument();
  });

  it('has CTA buttons for each tier', () => {
    renderWithRouter(<PricingPage />);
    const ctaButtons = screen.getAllByRole('link', { name: /get started|contact sales/i });
    expect(ctaButtons.length).toBeGreaterThanOrEqual(4);
  });
});
