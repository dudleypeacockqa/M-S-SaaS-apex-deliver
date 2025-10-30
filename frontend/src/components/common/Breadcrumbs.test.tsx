/**
 * Tests for Breadcrumbs Component
 * Navigation component with schema.org structured data
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Breadcrumbs', () => {
  it('should render breadcrumb list with links', () => {
    const items = [
      { name: 'Home', url: '/' },
      { name: 'Features', url: '/features' },
      { name: 'Deal Pipeline', url: '/features/pipeline' },
    ];

    renderWithRouter(<Breadcrumbs items={items} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Deal Pipeline')).toBeInTheDocument();
  });

  it('should render Home link with correct href', () => {
    const items = [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
    ];

    renderWithRouter(<Breadcrumbs items={items} />);

    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should not render link for last (current) breadcrumb', () => {
    const items = [
      { name: 'Home', url: '/' },
      { name: 'Pricing', url: '/pricing' },
    ];

    renderWithRouter(<Breadcrumbs items={items} />);

    const pricingText = screen.getByText('Pricing');
    expect(pricingText.closest('a')).toBeNull(); // Should not be a link
  });

  it('should include BreadcrumbList structured data', () => {
    const items = [
      { name: 'Home', url: 'https://apexdeliver.com' },
      { name: 'About', url: 'https://apexdeliver.com/about' },
    ];

    const { container } = renderWithRouter(<Breadcrumbs items={items} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    if (script?.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].name).toBe('Home');
    }
  });

  it('should render with separators between items', () => {
    const items = [
      { name: 'Home', url: '/' },
      { name: 'Features', url: '/features' },
      { name: 'Valuation', url: '/features/valuation' },
    ];

    const { container } = renderWithRouter(<Breadcrumbs items={items} />);

    // Check for separator characters (assuming "/" or "›")
    const separators = container.querySelectorAll('.breadcrumb-separator');
    expect(separators.length).toBeGreaterThan(0);
  });

  it('should handle single breadcrumb (home only)', () => {
    const items = [{ name: 'Home', url: '/' }];

    renderWithRouter(<Breadcrumbs items={items} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    const separators = document.querySelectorAll('.breadcrumb-separator');
    expect(separators.length).toBe(0); // No separators for single item
  });

  it('should apply responsive styling classes', () => {
    const items = [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
    ];

    const { container } = renderWithRouter(<Breadcrumbs items={items} />);

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('breadcrumbs');
  });
});
