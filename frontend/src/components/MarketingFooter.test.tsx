/**
 * Tests for MarketingFooter component
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MarketingFooter from './MarketingFooter';

// Mock wouter
vi.mock('wouter', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('MarketingFooter Component', () => {
  describe('Brand Section', () => {
    it('should render app title', () => {
      render(<MarketingFooter />);
      // Check for the brand title specifically, not copyright (multiple instances)
      const brandTitle = screen.getByRole('link', { name: /apexdeliver/i });
      expect(brandTitle).toBeInTheDocument();
    });

    it('should render brand description', () => {
      render(<MarketingFooter />);
      expect(screen.getByText(/end-to-end m&a intelligence platform/i)).toBeInTheDocument();
    });
  });

  describe('Product Links', () => {
    it('should render Features link', () => {
      render(<MarketingFooter />);
      expect(screen.getByText(/^features$/i)).toBeInTheDocument();
    });

    it('should render Pricing link', () => {
      render(<MarketingFooter />);
      expect(screen.getByText(/^pricing$/i)).toBeInTheDocument();
    });

    it('should render Blog link', () => {
      render(<MarketingFooter />);
      expect(screen.getByText(/^blog$/i)).toBeInTheDocument();
    });
  });

  describe('Legal Links', () => {
    it('should render Privacy Policy link', () => {
      render(<MarketingFooter />);
      expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
    });

    it('should render Terms of Service link', () => {
      render(<MarketingFooter />);
      expect(screen.getByText(/terms of service/i)).toBeInTheDocument();
    });
  });

  describe('Social Media Links', () => {
    it('should render social media icons', () => {
      render(<MarketingFooter />);
      const linkedinLink = screen.getByLabelText(/linkedin/i);
      const twitterLink = screen.getByLabelText(/twitter/i);
      const youtubeLink = screen.getByLabelText(/youtube/i);

      expect(linkedinLink).toBeInTheDocument();
      expect(twitterLink).toBeInTheDocument();
      expect(youtubeLink).toBeInTheDocument();
    });
  });
});
