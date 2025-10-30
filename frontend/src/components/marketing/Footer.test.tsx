/**
 * Tests for Footer component
 * Following TDD RED → GREEN → REFACTOR methodology
 *
 * MARK-004 FR-5.2: Footer Tests (10 tests)
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from './Footer';

const renderFooter = () => {
  return render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
};

describe('Footer', () => {
  describe('Layout & Structure', () => {
    it('should render footer with brand name', () => {
      renderFooter();
      const brandElements = screen.getAllByText(/apexdeliver/i);
      expect(brandElements.length).toBeGreaterThan(0);
      expect(brandElements[0]).toBeInTheDocument();
    });

    it('should render footer description', () => {
      renderFooter();
      expect(screen.getByText(/professional m&a intelligence platform/i)).toBeInTheDocument();
    });

    it('should display current year in copyright', () => {
      renderFooter();
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
    });
  });

  describe('Navigation Sections', () => {
    it('should render Product section with links', () => {
      renderFooter();

      expect(screen.getByText(/product/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /features/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /pricing/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
    });

    it('should render Company section with links', () => {
      renderFooter();

      expect(screen.getByText(/company/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /about us/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
    });

    it('should render Legal section with links', () => {
      renderFooter();

      expect(screen.getByText(/legal/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /terms of service/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /cookie policy/i })).toBeInTheDocument();
    });
  });

  describe('Link Navigation', () => {
    it('should have correct href for Features link', () => {
      renderFooter();
      const featuresLink = screen.getByRole('link', { name: /features/i });
      expect(featuresLink.getAttribute('href')).toBe('/features');
    });

    it('should have correct href for Privacy Policy link', () => {
      renderFooter();
      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
      expect(privacyLink.getAttribute('href')).toBe('/legal/privacy');
    });

    it('should have correct href for Terms of Service link', () => {
      renderFooter();
      const termsLink = screen.getByRole('link', { name: /terms of service/i });
      expect(termsLink.getAttribute('href')).toBe('/legal/terms');
    });

    it('should have correct href for Cookie Policy link', () => {
      renderFooter();
      const cookieLink = screen.getByRole('link', { name: /cookie policy/i });
      expect(cookieLink.getAttribute('href')).toBe('/legal/cookies');
    });
  });
});
