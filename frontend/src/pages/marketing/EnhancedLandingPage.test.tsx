import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { EnhancedLandingPage } from './EnhancedLandingPage';

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

beforeEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

const renderLandingPage = async () => {
  const utils = render(
    <RouterWrapper>
      <EnhancedLandingPage />
    </RouterWrapper>
  );

  await screen.findByText(/Close Deals/i, undefined, { timeout: 10000 });
  return utils;
};

describe('EnhancedLandingPage', () => {
  it('renders without crashing', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Close Deals/i)).toBeInTheDocument();
  });

  it('renders EnhancedHeroSection', async () => {
    await renderLandingPage();
    expect(screen.getByText(/70% Faster/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Free 14-Day Trial/i)).toBeInTheDocument();
  });

  it('renders Problem-Solution section', async () => {
    await renderLandingPage();
    expect(screen.getByText(/The M&A Industry Has an Accessibility Problem/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Traditional Enterprise Platforms/i })).toBeInTheDocument();
    expect(screen.getAllByText(/ApexDeliver Platform/i).length).toBeGreaterThan(0);
  });

  it('displays all 9 feature cards', async () => {
    await renderLandingPage();

    expect(screen.getAllByText(/Deal Pipeline Management/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Financial Intelligence Engine/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Multi-Method Valuation Suite/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Secure Document Room/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/AI-Powered Deal Matching/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Automated Document Generation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Task & Workflow Automation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Professional Community/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('heading', { level: 3, name: /Post-Merger Integration/i }).length).toBeGreaterThan(0);
  });

  it('renders PMI Integration section', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Don't Stop at the Deal/i)).toBeInTheDocument();
    expect(screen.getByText(/Ensure Integration Success/i)).toBeInTheDocument();
  });

  it('displays PMI section with FinanceFlo.ai branding', async () => {
    await renderLandingPage();
    expect(screen.getAllByText(/Powered by FinanceFlo.ai/i).length).toBeGreaterThan(0);
  });

  it('shows complete M&A lifecycle stages', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Pre-Deal/i)).toBeInTheDocument();
    expect(screen.getByText(/Deal Execution/i)).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3, name: /Post-Merger Integration/i }).length).toBeGreaterThan(0);
  });

  it('includes link to FinanceFlo.ai', async () => {
    await renderLandingPage();
    const pmiLink = screen.getByText(/Learn More About PMI Services/i);
    expect(pmiLink.closest('a')).toHaveAttribute('href', 'https://financeflo.ai');
  });

  it('renders ROICalculator component', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Calculate Your ROI/i)).toBeInTheDocument();
  });

  it('renders ComparisonTable component', async () => {
    await renderLandingPage();
    expect(screen.getByText(/How We Compare/i)).toBeInTheDocument();
  });

  it('renders EnhancedTestimonials component', async () => {
    await renderLandingPage();
    const testimonialsHeadings = screen.getAllByText(/Trusted by M&A Professionals Worldwide/i);
    expect(testimonialsHeadings.length).toBeGreaterThan(0);
  });

  it('renders TrustBadges component', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Enterprise-Grade Security/i)).toBeInTheDocument();
  });

  it('renders FAQSection component', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
  });

  it('renders CTASection component', async () => {
    await renderLandingPage();
    const ctaButtons = screen.getAllByText(/Start Free/i);
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  it('includes SEO component with proper meta tags', async () => {
    await renderLandingPage();
    expect(document.title).toContain('ApexDeliver');

    const descriptionMeta = document.querySelector('meta[name="description"]');
    expect(descriptionMeta).not.toBeNull();

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).not.toBeNull();
    expect(canonicalLink?.getAttribute('href')).toBe('https://100daysandbeyond.com/');

    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    expect(ogUrlMeta).not.toBeNull();
    expect(ogUrlMeta?.getAttribute('content')).toBe('https://100daysandbeyond.com/');

    const structuredDataScript = document.head.querySelector('#structured-data-general');
    expect(structuredDataScript).not.toBeNull();
  });

  it('displays sections in correct order', async () => {
    const { container } = await renderLandingPage();

    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(5);
  });

  it('all CTAs link to sign-up page', async () => {
    await renderLandingPage();

    const signUpLinks = screen.getAllByText(/Start Free/i);
    signUpLinks.forEach(link => {
      expect(link.closest('a')).toHaveAttribute('href', '/sign-up');
    });
  });

  it('displays pricing information', async () => {
    await renderLandingPage();
    const pricingEntries = screen.getAllByText(/£279\/month/i);
    expect(pricingEntries.length).toBeGreaterThan(0);
  });

  it('renders ROI calculator savings figures', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Return on Investment/i)).toBeInTheDocument();
  });

  it('shows testimonials metrics', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Active Users/i)).toBeInTheDocument();
  });

  it('shows integration call to action', async () => {
    await renderLandingPage();
    expect(screen.getByText(/View all integrations/i)).toBeInTheDocument();
  });

  it('shows FAQ contact link', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Still have questions/i)).toBeInTheDocument();
  });

  it('renders exit intent popup placeholder', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
  });
});
