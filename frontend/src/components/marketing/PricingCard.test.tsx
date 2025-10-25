import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PricingCard } from './PricingCard';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PricingCard', () => {
  const mockTier = {
    name: 'Professional',
    price: 598,
    currency: '£',
    period: 'month',
    description: 'For Growth Firms',
    features: [
      'Unlimited deals',
      'Advanced analytics',
      'Team collaboration',
      'Priority support',
    ],
    cta: 'Get Started',
    highlighted: true,
  };

  it('renders tier name', () => {
    renderWithRouter(<PricingCard {...mockTier} />);
    expect(screen.getByText(mockTier.name)).toBeInTheDocument();
  });

  it('displays correct price with currency', () => {
    renderWithRouter(<PricingCard {...mockTier} />);
    expect(screen.getByText(/£598/)).toBeInTheDocument();
  });

  it('shows tier description', () => {
    renderWithRouter(<PricingCard {...mockTier} />);
    expect(screen.getByText(mockTier.description)).toBeInTheDocument();
  });

  it('lists all features', () => {
    renderWithRouter(<PricingCard {...mockTier} />);
    mockTier.features.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  it('renders CTA button', () => {
    renderWithRouter(<PricingCard {...mockTier} />);
    expect(screen.getByRole('link', { name: mockTier.cta })).toBeInTheDocument();
  });

  it('highlights the most popular tier', () => {
    const { container } = renderWithRouter(<PricingCard {...mockTier} />);
    expect(container.querySelector('.ring-4, .ring-2, .border-4')).toBeInTheDocument();
  });
});
