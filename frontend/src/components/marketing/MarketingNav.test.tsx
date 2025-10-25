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
    expect(screen.getByRole('link', { name: /features/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /pricing/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('shows Sign In and Sign Up CTAs', () => {
    renderWithRouter(<MarketingNav />);
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get started|sign up/i })).toBeInTheDocument();
  });

  it('renders navigation as nav element for accessibility', () => {
    renderWithRouter(<MarketingNav />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
