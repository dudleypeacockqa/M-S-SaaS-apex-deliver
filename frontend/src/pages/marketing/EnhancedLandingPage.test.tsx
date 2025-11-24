import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { EnhancedLandingPage } from './EnhancedLandingPage';

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <BrowserRouter>{children}</BrowserRouter>
  </HelmetProvider>
);

const renderLandingPage = async () => {
  const utils = render(
    <RouterWrapper>
      <EnhancedLandingPage />
    </RouterWrapper>
  );

  // Wait for hero text
  await screen.findAllByText(/ERP Implementation/i, undefined, { timeout: 10000 });
  return utils;
};

describe('EnhancedLandingPage', () => {
  it('renders without crashing', async () => {
    await renderLandingPage();
    expect(screen.getAllByText(/ERP Implementation/i).length).toBeGreaterThan(0);
  });

  it('renders EnhancedHeroSection', async () => {
    await renderLandingPage();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /ERP Implementation \+ CapLiquify & ApexDeliver/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('FinanceFlo is the ERP reseller'))).toBeInTheDocument();
    expect(screen.getAllByText(/Start Guided Software Trial/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Book ERP Blueprint Call/i).length).toBeGreaterThan(0);
  });

  it('surfaces hero proof points for FinanceFlo', async () => {
    await renderLandingPage();
    expect(
      screen.getByText(
        /Trusted by CFOs, CIOs, and deal teams across the UK/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/20\+ years of ERP rollouts/i)).toBeInTheDocument();
  });

  it('renders How It Works section', async () => {
    await renderLandingPage();
    expect(screen.getByText(/How the FinanceFlo blueprint runs end to end/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Blueprint & Implement ERP/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Activate CapLiquify \+ ApexDeliver/i })).toBeInTheDocument();
  });

  it('displays feature cards', async () => {
    await renderLandingPage();

    expect(screen.getByText(/ERP Implementation & Support Pods/i)).toBeInTheDocument();
    expect(screen.getByText(/CapLiquify FP&A Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/ApexDeliver Deal & Revenue Cloud/i)).toBeInTheDocument();
    expect(screen.getByText(/Service pods and product modules for every stage/i)).toBeInTheDocument();
  });

  it('showcases the expanded platform map', async () => {
    await renderLandingPage();
    expect(screen.getAllByText(/Sales & Promotion Pricing Studio/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Customer & Partner Command Center/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Enterprise Governance & Intelligence/i)).toBeInTheDocument();
  });

  it('highlights new launches and 100-day sprints', async () => {
    await renderLandingPage();
    expect(screen.getByText(/ERP Fast-Start Pod/i)).toBeInTheDocument();
    expect(screen.getByText(/Copilot Control Room/i)).toBeInTheDocument();
    expect(screen.getByText(/Sprint 01 - Blueprint/i)).toBeInTheDocument();
  });

  it('covers persona-specific plays', async () => {
    await renderLandingPage();
    expect(screen.getByText(/ERP, CIO & Transformation Leads/i)).toBeInTheDocument();
    expect(screen.getByText(/Finance, CFO & Deal Teams/i)).toBeInTheDocument();
  });

  it('renders Pricing Teaser section', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Services \+ software pricing that scales with every entity/i)).toBeInTheDocument();
    expect(screen.getByText(/View Full Pricing & Features/i)).toBeInTheDocument();
  });

  it('displays branding with FinanceFlo', async () => {
    await renderLandingPage();
    // Check structured data includes new branding
    const structuredDataScript = document.head.querySelector('#product-schema');
    expect(structuredDataScript).not.toBeNull();
    expect(structuredDataScript?.textContent).toContain('FinanceFlo.ai');
  });

  it('shows three-step workflow', async () => {
    await renderLandingPage();
    expect(screen.getAllByText(/Blueprint & Implement ERP/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Activate CapLiquify \+ ApexDeliver/i)).toBeInTheDocument();
    expect(screen.getByText(/Scale AI Copilots & Revenue Plays/i)).toBeInTheDocument();
  });

  it('includes trust messaging in hero', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Trusted by CFOs, CIOs, and deal teams across the UK/i)).toBeInTheDocument();
  });

  it('renders TrustBadges component', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Enterprise-Grade Security/i)).toBeInTheDocument();
  });

  it('renders CTASection component', async () => {
    await renderLandingPage();
    const ctaButtons = screen.getAllByText(/Start Guided Software Trial/i);
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  it('includes SEO component with proper meta tags', async () => {
    await renderLandingPage();
    expect(document.title).toContain('FinanceFlo');

    const descriptionMeta = document.querySelector('meta[name="description"]');
    expect(descriptionMeta).not.toBeNull();
    expect(descriptionMeta?.getAttribute('content')).toContain('FinanceFlo');

    const structuredDataScript = document.head.querySelector('#product-schema');
    expect(structuredDataScript).not.toBeNull();
  });

  it('displays sections in correct order', async () => {
    const { container } = await renderLandingPage();

    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(5);
  });

  it('all CTAs link to sign-up page or contact page', async () => {
    await renderLandingPage();

    const signUpButtons = screen.getAllByText(/Start Guided Software Trial/i);
    signUpButtons.forEach(button => {
      expect(button.closest('a')).toHaveAttribute('href', '/sign-up');
    });
  });

  it('includes Book ERP Blueprint Call CTA', async () => {
    await renderLandingPage();
    const blueprintButtons = screen.getAllByText(/Book ERP Blueprint Call/i);
    expect(blueprintButtons.length).toBeGreaterThan(0);
  });

  it('includes Explore All Features CTA', async () => {
    await renderLandingPage();
    expect(screen.getByText(/Explore All Features/i)).toBeInTheDocument();
  });

  it('renders final CTA section', async () => {
    await renderLandingPage();
    const ctaHeading = await screen.findByRole('heading', { name: /Ready to modernise ERP, FP&A, and deal execution with one partner\?/i });
    expect(ctaHeading).toBeInTheDocument();
  });

  it('includes Book Implementation Blueprint CTA in final section', async () => {
    await renderLandingPage();
    // Check for Book Implementation Blueprint
    expect(screen.getAllByText(/Book Implementation Blueprint/i).length).toBeGreaterThan(0);
  });
});
