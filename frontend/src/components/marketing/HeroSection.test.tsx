import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroSection } from './HeroSection';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('HeroSection', () => {
  it('renders main headline', () => {
    renderWithRouter(<HeroSection />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('displays value proposition subheadline', () => {
    renderWithRouter(<HeroSection />);
    const subheadline = screen.getByText(/£279\/month|affordable|accessible/i);
    expect(subheadline).toBeInTheDocument();
  });

  it('shows primary CTA button', () => {
    renderWithRouter(<HeroSection />);
    const primaryCTA = screen.getByRole('link', { name: /start free trial|get started/i });
    expect(primaryCTA).toBeInTheDocument();
  });

  it('shows secondary CTA button', () => {
    renderWithRouter(<HeroSection />);
    const secondaryCTA = screen.getByRole('link', { name: /view pricing|see pricing/i });
    expect(secondaryCTA).toBeInTheDocument();
  });

  it('renders as section element for semantic HTML', () => {
    const { container } = renderWithRouter(<HeroSection />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});
