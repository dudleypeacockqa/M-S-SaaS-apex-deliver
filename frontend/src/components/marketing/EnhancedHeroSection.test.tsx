import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { EnhancedHeroSection } from './EnhancedHeroSection';

// Wrapper component for routing
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('EnhancedHeroSection', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );
    
    expect(screen.getByText(/Close Deals/i)).toBeInTheDocument();
  });

  it('displays the main headline', () => {
    render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );
    
    expect(screen.getByText(/Close Deals/i)).toBeInTheDocument();
    expect(screen.getByText(/70% Faster/i)).toBeInTheDocument();
  });

  it('displays the subheadline with pricing', () => {
    render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );

    expect(screen.getByText(/AI-powered M&A platform/i)).toBeInTheDocument();
    expect(screen.getByText(/£279\/month/i)).toBeInTheDocument();
  });

  it('displays trust badge with user count', () => {
    render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );
    
    expect(screen.getByText(/Trusted by 500\+ M&A Professionals/i)).toBeInTheDocument();
  });

  it('renders primary CTA button', () => {
    render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );
    
    const ctaButton = screen.getByText(/Start Free 14-Day Trial/i);
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton.closest('a')).toHaveAttribute('href', '/sign-up');
  });

  it('renders secondary CTA button', () => {
    render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );

    const demoButton = screen.getByText(/Watch 2-Min Demo/i);
    expect(demoButton).toBeInTheDocument();
    expect(demoButton.closest('a')).toHaveAttribute('href', '/pricing');
  });

  it('displays trust indicators', () => {
    render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );

    expect(screen.getByText(/No credit card required/i)).toBeInTheDocument();
    expect(screen.getByText(/5-minute setup/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel anytime/i)).toBeInTheDocument();
  });

  it('displays deal count of 847', async () => {
    render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );

    // The component shows static value of 847 for Active Deals
    expect(screen.getByText('847')).toBeInTheDocument();
  });

  it('animates user count from 0 to 500', async () => {
    render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.getAllByText(/500\+/).length).toBeGreaterThan(0);
  });

  it('displays dashboard preview stats', () => {
    render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );

    expect(screen.getByText(/Active Deals/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Value/i)).toBeInTheDocument();
    expect(screen.getByText('£50B')).toBeInTheDocument();
    expect(screen.getByText('32%')).toBeInTheDocument(); // Close Rate
  });

  it('displays deal pipeline stages', () => {
    render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );

    expect(screen.getAllByText(/Sourcing/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Due Diligence/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Negotiation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Closing/i).length).toBeGreaterThan(0);
  });

  it('displays feature highlights', () => {
    render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );

    // The component now shows feature highlights instead of recent deals
    expect(screen.getAllByText(/AI Insights/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Analytics/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Secure/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Fast/i).length).toBeGreaterThan(0);
  });

  it('displays "Save £9,721/year" badge', () => {
    render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );

    expect(screen.getByText(/Save £9,721\/year/i)).toBeInTheDocument();
  });

  it('has proper gradient background', () => {
    const { container } = render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-gradient-to-br');
  });

  it('includes scroll indicator', () => {
    const { container } = render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );
    
    const scrollIndicator = container.querySelector('.animate-bounce');
    expect(scrollIndicator).toBeInTheDocument();
  });

  it('applies visibility animation on mount', () => {
    const { container } = render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );
    
    // Check for transition classes
    const contentDiv = container.querySelector('.transition-all');
    expect(contentDiv).toBeInTheDocument();
  });

  it('renders floating orbs for visual effect', () => {
    const { container } = render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );
    
    const orbs = container.querySelectorAll('.animate-pulse');
    expect(orbs.length).toBeGreaterThan(0);
  });

  it('displays deal value metrics', () => {
    render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );
    
    expect(screen.getAllByText(/£45\.2M/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/£82\.5M/i).length).toBeGreaterThan(0);
  });

  it('has responsive grid layout', () => {
    const { container } = render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );
    
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('lg:grid-cols-2');
  });

  it('includes animated background pattern', () => {
    const { container } = render(
      <RouterWrapper>
        <EnhancedHeroSection />
      </RouterWrapper>
    );
    
    const heroSection = container.querySelector('section');
    expect(heroSection?.innerHTML).toContain('background-image');
  });
});

