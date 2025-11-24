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
    it('should render footer with FinanceFlo brand', () => {
      renderFooter();
      expect(screen.getAllByText(/financeflo/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/ERP & software reseller/i)).toBeInTheDocument();
    });

    it('should display current year in copyright', () => {
      renderFooter();
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
    });
  });

  describe('Navigation Sections', () => {
    it('should render Services section with ERP and AI links', () => {
      renderFooter();

      expect(screen.getByText(/services/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /ERP Implementation & Resell/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /AI Consulting & Copilots/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Integration & iPaaS Studio/i })).toBeInTheDocument();
    });

    it('should render Software section with CapLiquify and ApexDeliver links', () => {
      renderFooter();

      expect(screen.getByRole('heading', { level: 4, name: /Software/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /CapLiquify FP&A/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /ApexDeliver Deal Cloud/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Sales & Promotion Pricing Studio/i })).toBeInTheDocument();
    });

    it('should render Company section with team and case study links', () => {
      renderFooter();

      expect(screen.getByText(/company/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Team/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Case Studies/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Contact & Locations/i })).toBeInTheDocument();
    });

    it('should render Legal section with policy links', () => {
      renderFooter();

      expect(screen.getByText(/legal/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Terms of Service/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Privacy Policy/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Cookie Policy/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Security Overview/i })).toBeInTheDocument();
    });
  });

  describe('Link Navigation', () => {
    it('should link ERP Implementation to the Sage Intacct route', () => {
      renderFooter();
      const erpLink = screen.getByRole('link', { name: /ERP Implementation & Resell/i });
      expect(erpLink.getAttribute('href')).toBe('/erp/sage-intacct');
    });

    it('should link AI Consulting to the AI enhancement route', () => {
      renderFooter();
      const aiLink = screen.getByRole('link', { name: /AI Consulting & Copilots/i });
      expect(aiLink.getAttribute('href')).toBe('/ai-enhancement/sage-intacct');
    });

    it('should link CapLiquify card to the FP&A page', () => {
      renderFooter();
      const capLink = screen.getByRole('link', { name: /CapLiquify FP&A/i });
      expect(capLink.getAttribute('href')).toBe('/capliquify-fpa');
    });

    it('should keep legal links pointing to canonical routes', () => {
      renderFooter();
      expect(screen.getByRole('link', { name: /Terms of Service/i }).getAttribute('href')).toBe('/legal/terms');
      expect(screen.getByRole('link', { name: /Privacy Policy/i }).getAttribute('href')).toBe('/legal/privacy');
      expect(screen.getByRole('link', { name: /Cookie Policy/i }).getAttribute('href')).toBe('/legal/cookies');
      expect(screen.getByRole('link', { name: /Security Overview/i }).getAttribute('href')).toBe('/security');
    });
  });
});
