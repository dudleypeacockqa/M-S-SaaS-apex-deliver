/**
 * Tests for CTASection component
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CTASection } from './CTASection';
import { BrowserRouter } from 'react-router-dom';
import * as analytics from '../../lib/analytics';

// Mock analytics
vi.mock('../../lib/analytics', () => ({
  trackCtaClick: vi.fn(),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CTASection Component', () => {
  describe('Heading and Copy', () => {
    it('should render main CTA heading', () => {
      renderWithRouter(<CTASection />);
      expect(screen.getByText(/ready to transform your m&a workflow/i)).toBeInTheDocument();
    });

    it('should render descriptive copy', () => {
      renderWithRouter(<CTASection />);
      expect(screen.getByText(/join hundreds of dealmakers/i)).toBeInTheDocument();
    });
  });

  describe('CTA Buttons', () => {
    it('should render "Start Your Free Trial" button', () => {
      renderWithRouter(<CTASection />);
      expect(screen.getByText(/start your free trial/i)).toBeInTheDocument();
    });

    it('should render "Schedule a Demo" button', () => {
      renderWithRouter(<CTASection />);
      expect(screen.getByText(/schedule a demo/i)).toBeInTheDocument();
    });

    it('should link trial button to /sign-up', () => {
      renderWithRouter(<CTASection />);
      const trialButton = screen.getByText(/start your free trial/i).closest('a');
      expect(trialButton).toHaveAttribute('href', '/sign-up');
    });

    it('should link demo button to /contact', () => {
      renderWithRouter(<CTASection />);
      const demoButton = screen.getByText(/schedule a demo/i).closest('a');
      expect(demoButton).toHaveAttribute('href', '/contact');
    });
  });

  describe('Analytics Tracking', () => {
    it('should track analytics when trial button is clicked', () => {
      const trackSpy = vi.spyOn(analytics, 'trackCtaClick');
      renderWithRouter(<CTASection />);

      const trialButton = screen.getByText(/start your free trial/i);
      fireEvent.click(trialButton);

      expect(trackSpy).toHaveBeenCalledWith('start-free-trial', 'cta-section');
    });

    it('should track analytics when demo button is clicked', () => {
      const trackSpy = vi.spyOn(analytics, 'trackCtaClick');
      renderWithRouter(<CTASection />);

      const demoButton = screen.getByText(/schedule a demo/i);
      fireEvent.click(demoButton);

      expect(trackSpy).toHaveBeenCalledWith('schedule-demo', 'cta-section');
    });
  });

  describe('Trust Indicators', () => {
    it('should render "Bank-Grade Security" badge', () => {
      renderWithRouter(<CTASection />);
      expect(screen.getByText(/bank-grade security/i)).toBeInTheDocument();
    });

    it('should render "GDPR Compliant" badge', () => {
      renderWithRouter(<CTASection />);
      expect(screen.getByText(/gdpr compliant/i)).toBeInTheDocument();
    });

    it('should render "No Credit Card Required" badge', () => {
      renderWithRouter(<CTASection />);
      expect(screen.getByText(/no credit card required/i)).toBeInTheDocument();
    });
  });
});
