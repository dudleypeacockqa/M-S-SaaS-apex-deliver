import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FeaturesPage } from './FeaturesPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('FeaturesPage', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

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

  it('contains CTA to pricing or trial', () => {
    renderWithRouter(<FeaturesPage />);
    const ctaLinks = screen.getAllByRole('link', { name: /Start Your Free Trial|Schedule a Demo/i });
    expect(ctaLinks.length).toBeGreaterThan(0);
  });

  it('renders multiple feature sections', () => {
    const { container } = renderWithRouter(<FeaturesPage />);
    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(2);
  });

  it('defines canonical and og:url metadata for financeflo.ai', () => {
    renderWithRouter(<FeaturesPage />);

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical).not.toBeNull();
    expect(canonical?.getAttribute('href')).toBe('https://financeflo.ai/features');
    expect(canonical?.getAttribute('href')).not.toContain('100daysandbeyond.com');
    expect(canonical?.getAttribute('href')).not.toContain('apexdeliver.com');

    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    expect(ogUrlMeta).not.toBeNull();
    expect(ogUrlMeta?.getAttribute('content')).toBe('https://financeflo.ai/features');
    expect(ogUrlMeta?.getAttribute('content')).not.toContain('100daysandbeyond.com');
  });

  it('injects software application structured data referencing financeflo.ai', async () => {
    renderWithRouter(<FeaturesPage />);

    await waitFor(() => {
      const script = document.getElementById('features-software-schema') as HTMLScriptElement | null;
      expect(script).not.toBeNull();
      const schema = JSON.parse(script?.textContent ?? '{}');
      expect(schema.url).toBe('https://financeflo.ai/features');
      expect(schema.url).not.toContain('100daysandbeyond.com');
      expect(schema.url).not.toContain('apexdeliver.com');
      expect(schema.featureList).toContain('Deal Pipeline & Flow Management');
    });
  });
});
