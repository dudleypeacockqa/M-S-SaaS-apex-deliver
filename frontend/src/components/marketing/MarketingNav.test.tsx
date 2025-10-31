import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MarketingNav } from './MarketingNav';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MarketingNav', () => {
  it('renders logo and brand name', () => {
    renderWithRouter(<MarketingNav />);
    expect(screen.getByText(/M&A Intelligence Platform|ApexDeliver/i)).toBeInTheDocument();
  });

  it('displays navigation links', () => {
    renderWithRouter(<MarketingNav />);
    // Pricing is a direct link
    expect(screen.getByRole('link', { name: /pricing/i })).toBeInTheDocument();
    // Products, Solutions, Resources, Company are dropdown buttons (not direct links)
    expect(screen.getByRole('button', { name: /products/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /solutions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resources/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /company/i })).toBeInTheDocument();
  });

  it('shows Sign In and Sign Up CTAs', () => {
    renderWithRouter(<MarketingNav />);
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    // CTA button text is "Start Free Trial" (not "Get Started" or "Sign Up")
    expect(screen.getByRole('link', { name: /start free trial/i })).toBeInTheDocument();
  });

  it('renders navigation as nav element for accessibility', () => {
    renderWithRouter(<MarketingNav />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
