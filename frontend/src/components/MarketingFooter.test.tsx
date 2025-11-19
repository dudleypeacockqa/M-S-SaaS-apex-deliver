/**
 * Tests for MarketingFooter component
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MarketingFooter from './MarketingFooter';

const renderFooter = () =>
  render(
    <MemoryRouter>
      <MarketingFooter />
    </MemoryRouter>
  );

describe('MarketingFooter Component', () => {
  describe('Brand Section', () => {
    it('should render app title', () => {
      renderFooter();
      // Check for the brand title specifically, not copyright (multiple instances)
      const brandTitle = screen.getByRole('link', { name: /apexdeliver/i });
      expect(brandTitle).toBeInTheDocument();
    });

    it('should render brand description', () => {
      renderFooter();
      expect(screen.getByText(/end-to-end m&a intelligence platform/i)).toBeInTheDocument();
    });
  });

  describe('Product Links', () => {
    it('should render Features link', () => {
      renderFooter();
      expect(screen.getByText(/^features$/i)).toBeInTheDocument();
    });

    it('should render Pricing link', () => {
      renderFooter();
      expect(screen.getByText(/^pricing$/i)).toBeInTheDocument();
    });

    it('should render Blog link', () => {
      renderFooter();
      expect(screen.getByText(/^blog$/i)).toBeInTheDocument();
    });
  });

  describe('Legal Links', () => {
    it('should render Privacy Policy link', () => {
      renderFooter();
      expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
    });

    it('should render Terms of Service link', () => {
      renderFooter();
      expect(screen.getByText(/terms of service/i)).toBeInTheDocument();
    });
  });

  describe('Social Media Links', () => {
    it('should render social media icons', () => {
      renderFooter();
      const linkedinLink = screen.getByLabelText(/linkedin/i);
      const twitterLink = screen.getByLabelText(/twitter/i);
      const youtubeLink = screen.getByLabelText(/youtube/i);

      expect(linkedinLink).toBeInTheDocument();
      expect(twitterLink).toBeInTheDocument();
      expect(youtubeLink).toBeInTheDocument();
    });
  });
});
