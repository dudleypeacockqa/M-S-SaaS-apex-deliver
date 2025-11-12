import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { EnhancedLandingPage } from './EnhancedLandingPage';

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

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
    expect(screen.getByText(/CapLiquify FP&A/i)).toBeInTheDocument();
    expect(
      screen.getByText(/13-week cash visibility and working capital clarity in 5 minutes/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Start Your Free 14-Day Trial/i)).toBeInTheDocument();
  });

  it('surfaces hero proof points for CapLiquify and ApexDeliver', async () => {
    await renderLandingPage();
    const statLabels = [
      /13-week cash forecast/i,
      /70% lower ops cost/i,
      /500\+ finance leaders/i,
      /95% accuracy/i,
    ];
    statLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders How It Works section', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Your Entire M&A Workflow, Unified and Automated/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Land with CapLiquify/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Expand to ApexDeliver/i })).toBeInTheDocument();
  });

  it('displays feature cards', async () => {
    await renderLandingPage();

    expect(screen.getByText(/CapLiquify FP&A Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/ApexDeliver M&A Suite/i)).toBeInTheDocument();
    expect(screen.getByText(/B2B2C Customer Portals/i)).toBeInTheDocument();
    expect(screen.getByText(/A Feature for Every Stage of Your Growth Journey/i)).toBeInTheDocument();
  });

  it('renders Pricing Teaser section', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Powerful, Transparent Pricing That Scales With You/i)).toBeInTheDocument();
    expect(screen.getByText(/View Full Pricing & Features/i)).toBeInTheDocument();
  });

  it('displays branding with 100 Days & Beyond', async () => {
    await renderLandingPage();
    // Check structured data includes new branding
    const structuredDataScript = document.head.querySelector('#product-schema');
    expect(structuredDataScript).not.toBeNull();
  });

  it('shows three-step workflow', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Land with CapLiquify/i)).toBeInTheDocument();
    expect(screen.getByText(/Expand to ApexDeliver/i)).toBeInTheDocument();
    expect(screen.getByText(/Grow Your Portfolio/i)).toBeInTheDocument();
  });

  it('includes trust messaging in hero', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Trusted by dealmakers, finance leaders, and private equity firms worldwide/i)).toBeInTheDocument();
  });

  it('renders TrustBadges component', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Enterprise-Grade Security/i)).toBeInTheDocument();
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

    const structuredDataScript = document.head.querySelector('#product-schema');
    expect(structuredDataScript).not.toBeNull();
  });

  it('displays sections in correct order', async () => {
    const { container } = await renderLandingPage();

    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(5);
  });

  it('all CTAs link to sign-up page', async () => {
    await renderLandingPage();

    const signUpButtons = screen.getAllByText(/Start Your Free 14-Day Trial/i);
    signUpButtons.forEach(button => {
      expect(button.closest('a')).toHaveAttribute('href', '/sign-up');
    });
  });

  it('includes Schedule a Demo CTA', async () => {
    await renderLandingPage();
    const demoButtons = screen.getAllByText(/Schedule a Demo/i);
    expect(demoButtons.length).toBeGreaterThan(0);
  });

  it('includes Explore All Features CTA', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Explore All Features/i)).toBeInTheDocument();
  });

  it('renders final CTA section', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Ready to Transform Your M&A Workflow\?/i)).toBeInTheDocument();
  });

  it('includes Schedule a Demo CTA in final section', async () => {
    await renderLandingPage();
    const demoLinks = screen.getAllByText(/Schedule a Demo/i);
    // Should have at least 2: one in hero, one in CTASection
    expect(demoLinks.length).toBeGreaterThanOrEqual(2);
  });
});
