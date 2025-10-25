import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FeaturesPage } from './FeaturesPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('FeaturesPage', () => {
  it('renders main heading', () => {
    renderWithRouter(<FeaturesPage />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('lists core features', () => {
    renderWithRouter(<FeaturesPage />);
    const coreFeatures = [
      /deal pipeline|deal flow/i,
      /financial intelligence/i,
      /valuation/i,
    ];

    coreFeatures.forEach((matcher) => {
      const matches = screen.getAllByText(matcher);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  it('contains CTA to pricing', () => {
    renderWithRouter(<FeaturesPage />);
    const ctaLinks = screen.getAllByRole('link', { name: /get started|view pricing/i });
    expect(ctaLinks.length).toBeGreaterThan(0);
  });

  it('renders multiple feature sections', () => {
    const { container } = renderWithRouter(<FeaturesPage />);
    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(2);
  });
});
