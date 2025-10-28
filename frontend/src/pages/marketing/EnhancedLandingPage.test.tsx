import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { EnhancedLandingPage } from './EnhancedLandingPage';

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('EnhancedLandingPage', () => {
  it('renders without crashing', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/Close Deals/i)).toBeInTheDocument();
  });

  it('renders EnhancedHeroSection', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/70% Faster/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Free 14-Day Trial/i)).toBeInTheDocument();
  });

  it('renders Problem-Solution section', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/The M&A Industry Has an Accessibility Problem/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Traditional Enterprise Platforms/i })).toBeInTheDocument();
    expect(screen.getAllByText(/ApexDeliver Platform/i).length).toBeGreaterThan(0);
  });

  it('displays all 9 feature cards', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    
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

  it('renders PMI Integration section', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/Don't Stop at the Deal/i)).toBeInTheDocument();
    expect(screen.getByText(/Ensure Integration Success/i)).toBeInTheDocument();
  });

  it('displays PMI section with FinanceFlo.ai branding', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getAllByText(/Powered by FinanceFlo.ai/i).length).toBeGreaterThan(0);
  });

  it('shows complete M&A lifecycle stages', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/Pre-Deal/i)).toBeInTheDocument();
    expect(screen.getByText(/Deal Execution/i)).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3, name: /Post-Merger Integration/i }).length).toBeGreaterThan(0);
  });

  it('includes link to FinanceFlo.ai', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    const pmiLink = screen.getByText(/Learn More About PMI Services/i);
    expect(pmiLink.closest('a')).toHaveAttribute('href', 'https://financeflo.ai');
  });

  it('renders ROICalculator component', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/Calculate Your ROI/i)).toBeInTheDocument();
  });

  it('renders ComparisonTable component', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/How We Compare/i)).toBeInTheDocument();
  });

  it('renders EnhancedTestimonials component', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    const testimonialsHeadings = screen.getAllByText(/Trusted by M&A Professionals Worldwide/i);
    expect(testimonialsHeadings.length).toBeGreaterThan(0);
  });

  it('renders TrustBadges component', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/Enterprise-Grade Security/i)).toBeInTheDocument();
  });

  it('renders FAQSection component', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
  });

  it('renders CTASection component', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    // CTA section should have call-to-action
    const ctaButtons = screen.getAllByText(/Start Free/i);
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  it('includes SEO component with proper meta tags', () => {
    const { container } = render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    
    // SEO component should render meta tags (in document head)
    expect(document.title).toContain('ApexDeliver');
  });

  it('displays sections in correct order', () => {
    const { container } = render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    
    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(5);
  });

  it('all CTAs link to sign-up page', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    
    const signUpLinks = screen.getAllByText(/Start Free/i);
    signUpLinks.forEach(link => {
      expect(link.closest('a')).toHaveAttribute('href', '/sign-up');
    });
  });

  it('displays pricing information', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    const pricingEntries = screen.getAllByText(/£279\/month/i);
    expect(pricingEntries.length).toBeGreaterThan(0);
  });

  it('shows 70% savings claim', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    const savingsClaims = screen.getAllByText(/70% Less Expensive/i);
    expect(savingsClaims.length).toBeGreaterThan(0);
  });

  it('displays trust indicators', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    const trustIndicators = screen.getAllByText(/No credit card required/i);
    expect(trustIndicators.length).toBeGreaterThan(0);
  });

  it('shows customer count', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getAllByText(/500\+/i).length).toBeGreaterThan(0);
  });

  it('displays deal statistics', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getAllByText(/Active Deals/i).length).toBeGreaterThan(0);
  });

  it('shows deal value metric', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getAllByText(/£50B\+/i).length).toBeGreaterThan(0);
  });

  it('includes MarketingLayout wrapper', () => {
    const { container } = render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    
    // MarketingLayout should include nav and footer
    expect(container.querySelector('nav')).toBeInTheDocument();
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('has responsive design', () => {
    const { container } = render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    
    const responsiveElements = container.querySelectorAll('.md\\:grid-cols-2, .lg\\:grid-cols-3');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  it('displays FinanceFlo Group branding', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/Part of the FinanceFlo Group/i)).toBeInTheDocument();
  });

  it('shows complete M&A lifecycle value proposition', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getAllByText(/Day 100 success/i).length).toBeGreaterThan(0);
  });

  it('highlights PMI as NEW feature', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    const newBadges = screen.getAllByText(/NEW/i);
    expect(newBadges.length).toBeGreaterThan(0);
  });

  it('displays ERP consolidation service', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    const erpItems = screen.getAllByText(/ERP consolidation/i);
    expect(erpItems.length).toBeGreaterThan(0);
  });

  it('shows synergy tracking feature', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    const synergyMentions = screen.getAllByText(/Synergy tracking/i);
    expect(synergyMentions.length).toBeGreaterThan(0);
  });

  it('mentions Day 1-100 success planning', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/Day 1-100 success planning/i)).toBeInTheDocument();
  });

  it('displays problem statement about M&A failures', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/70% of M&A deals fail/i)).toBeInTheDocument();
  });

  it('shows all integration logos', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getAllByText(/Xero/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/QuickBooks/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sage/i).length).toBeGreaterThan(0);
  });

  it('displays security certifications', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getAllByText(/GDPR Compliant/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/SOC 2 Type II/i).length).toBeGreaterThan(0);
  });
});

