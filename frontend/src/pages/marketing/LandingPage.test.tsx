import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from './LandingPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LandingPage', () => {
  it('renders hero section', () => {
    renderWithRouter(<LandingPage />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('displays feature highlights section', () => {
    renderWithRouter(<LandingPage />);
    // Check for at least one feature card
    const highlights = screen.getAllByText(/deal pipeline|financial intelligence/i);
    expect(highlights.length).toBeGreaterThan(0);
  });

  it('contains CTA buttons', () => {
    renderWithRouter(<LandingPage />);
    const ctaButtons = screen.getAllByRole('link', { name: /get started|start free trial|view pricing/i });
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  it('renders main element for semantic HTML', () => {
    const { container } = renderWithRouter(<LandingPage />);
    expect(container.querySelector('main')).toBeInTheDocument();
  });

  it('has multiple sections for better content structure', () => {
    const { container } = renderWithRouter(<LandingPage />);
    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThanOrEqual(3); // Hero, Features, CTA at minimum
  });
});
