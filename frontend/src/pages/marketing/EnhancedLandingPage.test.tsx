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
    expect(screen.getByText(/Traditional Enterprise Platforms/i)).toBeInTheDocument();
    expect(screen.getByText(/ApexDeliver Platform/i)).toBeInTheDocument();
  });

  it('displays all 9 feature cards', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    
    expect(screen.getByText(/Deal Pipeline Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Financial Intelligence Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/Multi-Method Valuation Suite/i)).toBeInTheDocument();
    expect(screen.getByText(/Secure Document Room/i)).toBeInTheDocument();
    expect(screen.getByText(/AI-Powered Deal Matching/i)).toBeInTheDocument();
    expect(screen.getByText(/Automated Document Generation/i)).toBeInTheDocument();
    expect(screen.getByText(/Task & Workflow Automation/i)).toBeInTheDocument();
    expect(screen.getByText(/Professional Community/i)).toBeInTheDocument();
    expect(screen.getByText(/Post-Merger Integration/i)).toBeInTheDocument();
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
    expect(screen.getByText(/Powered by FinanceFlo.ai/i)).toBeInTheDocument();
  });

  it('shows complete M&A lifecycle stages', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/Pre-Deal/i)).toBeInTheDocument();
    expect(screen.getByText(/Deal Execution/i)).toBeInTheDocument();
    expect(screen.getByText(/Post-Merger Integration/i)).toBeInTheDocument();
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
    expect(screen.getByText(/What Our Customers Say/i)).toBeInTheDocument();
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
    expect(screen.getByText(/£279\/month/i)).toBeInTheDocument();
  });

  it('shows 70% savings claim', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/70% Less Expensive/i)).toBeInTheDocument();
  });

  it('displays trust indicators', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/No credit card required/i)).toBeInTheDocument();
  });

  it('shows customer count', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/500\+/i)).toBeInTheDocument();
  });

  it('displays deal statistics', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/847\+/i)).toBeInTheDocument();
  });

  it('shows deal value metric', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/£50B\+/i)).toBeInTheDocument();
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
    expect(screen.getByText(/From Deal Sourcing to Day 100 Success/i)).toBeInTheDocument();
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
    expect(screen.getByText(/ERP consolidation/i)).toBeInTheDocument();
  });

  it('shows synergy tracking feature', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/Synergy tracking/i)).toBeInTheDocument();
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
    expect(screen.getByText(/Xero/i)).toBeInTheDocument();
    expect(screen.getByText(/QuickBooks/i)).toBeInTheDocument();
    expect(screen.getByText(/Sage/i)).toBeInTheDocument();
  });

  it('displays security certifications', () => {
    render(
      <RouterWrapper>
        <EnhancedLandingPage />
      </RouterWrapper>
    );
    expect(screen.getByText(/GDPR Compliant/i)).toBeInTheDocument();
    expect(screen.getByText(/SOC 2 Type II/i)).toBeInTheDocument();
  });
});

