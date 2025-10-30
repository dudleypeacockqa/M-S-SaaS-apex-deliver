/**
 * Tests for PodcastPage
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PodcastPage } from './PodcastPage';
import { BrowserRouter } from 'react-router-dom';
import * as analytics from '../../lib/analytics';

// Mock analytics
vi.mock('../../lib/analytics', () => ({
  trackCtaClick: vi.fn(),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PodcastPage', () => {
  describe('Header Section', () => {
    it('should render main heading', () => {
      renderWithRouter(<PodcastPage />);
      expect(screen.getByText(/100 days and beyond/i)).toBeInTheDocument();
    });

    it('should render descriptive subheading', () => {
      renderWithRouter(<PodcastPage />);
      expect(screen.getByText(/your guide to m&a success/i)).toBeInTheDocument();
    });
  });

  describe('About the Podcast Section', () => {
    it('should render "About the Podcast" heading', () => {
      renderWithRouter(<PodcastPage />);
      expect(screen.getByText(/about the podcast/i)).toBeInTheDocument();
    });

    it('should render "Actionable Insights" feature', () => {
      renderWithRouter(<PodcastPage />);
      expect(screen.getByText(/actionable insights/i)).toBeInTheDocument();
    });

    it('should render "Expert Guests" feature', () => {
      renderWithRouter(<PodcastPage />);
      expect(screen.getByText(/expert guests/i)).toBeInTheDocument();
    });

    it('should render "Growth Focused" feature', () => {
      renderWithRouter(<PodcastPage />);
      expect(screen.getByText(/growth focused/i)).toBeInTheDocument();
    });
  });

  describe('CTA Section', () => {
    it('should render CTA heading', () => {
      renderWithRouter(<PodcastPage />);
      expect(screen.getByText(/ready to transform your m&a operations/i)).toBeInTheDocument();
    });

    it('should render "Start Your Free 14-Day Trial" button', () => {
      renderWithRouter(<PodcastPage />);
      expect(screen.getByText(/start your free 14-day trial/i)).toBeInTheDocument();
    });

    it('should render "Schedule a Demo" button', () => {
      renderWithRouter(<PodcastPage />);
      expect(screen.getByText(/schedule a demo/i)).toBeInTheDocument();
    });

    it('should track analytics when trial button is clicked', () => {
      const trackSpy = vi.spyOn(analytics, 'trackCtaClick');
      renderWithRouter(<PodcastPage />);

      const trialButton = screen.getByText(/start your free 14-day trial/i);
      fireEvent.click(trialButton);

      expect(trackSpy).toHaveBeenCalledWith('start-trial', 'podcast-page');
    });

    it('should track analytics when demo button is clicked', () => {
      const trackSpy = vi.spyOn(analytics, 'trackCtaClick');
      renderWithRouter(<PodcastPage />);

      const demoButton = screen.getByText(/schedule a demo/i);
      fireEvent.click(demoButton);

      expect(trackSpy).toHaveBeenCalledWith('schedule-demo', 'podcast-page');
    });
  });
});
