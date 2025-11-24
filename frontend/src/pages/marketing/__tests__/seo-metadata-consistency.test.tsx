/**
 * SEO Metadata Consistency Tests
 * Following TDD RED → GREEN → REFACTOR methodology
 * 
 * Ensures all marketing pages use consistent canonical URLs and OG tags
 * per domain configuration (financeflo.ai)
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PlatformPricingPage from '../pricing/PlatformPricingPage';
import CommunityPricingPage from '../pricing/CommunityPricingPage';
import ServicesPricingPage from '../pricing/ServicesPricingPage';

const EXPECTED_DOMAIN = 'https://financeflo.ai';

beforeEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

describe('SEO Metadata Consistency', () => {
  describe('Pricing Sub-Pages', () => {
    it('PlatformPricingPage uses financeflo.ai canonical URL', () => {
      render(
        <BrowserRouter>
          <PlatformPricingPage />
        </BrowserRouter>
      );

      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).not.toBeNull();
      expect(canonical?.getAttribute('href')).toBe(`${EXPECTED_DOMAIN}/pricing/platform`);
    });

    it('PlatformPricingPage uses financeflo.ai og:url', () => {
      render(
        <BrowserRouter>
          <PlatformPricingPage />
        </BrowserRouter>
      );

      const ogUrl = document.querySelector('meta[property="og:url"]');
      expect(ogUrl).not.toBeNull();
      expect(ogUrl?.getAttribute('content')).toBe(`${EXPECTED_DOMAIN}/pricing/platform`);
    });

    it('CommunityPricingPage uses financeflo.ai canonical URL', () => {
      render(
        <BrowserRouter>
          <CommunityPricingPage />
        </BrowserRouter>
      );

      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).not.toBeNull();
      expect(canonical?.getAttribute('href')).toBe(`${EXPECTED_DOMAIN}/pricing/community`);
    });

    it('CommunityPricingPage uses financeflo.ai og:url', () => {
      render(
        <BrowserRouter>
          <CommunityPricingPage />
        </BrowserRouter>
      );

      const ogUrl = document.querySelector('meta[property="og:url"]');
      expect(ogUrl).not.toBeNull();
      expect(ogUrl?.getAttribute('content')).toBe(`${EXPECTED_DOMAIN}/pricing/community`);
    });

    it('ServicesPricingPage uses financeflo.ai canonical URL', () => {
      render(
        <BrowserRouter>
          <ServicesPricingPage />
        </BrowserRouter>
      );

      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).not.toBeNull();
      expect(canonical?.getAttribute('href')).toBe(`${EXPECTED_DOMAIN}/pricing/services`);
    });

    it('ServicesPricingPage uses financeflo.ai og:url', () => {
      render(
        <BrowserRouter>
          <ServicesPricingPage />
        </BrowserRouter>
      );

      const ogUrl = document.querySelector('meta[property="og:url"]');
      expect(ogUrl).not.toBeNull();
      expect(ogUrl?.getAttribute('content')).toBe(`${EXPECTED_DOMAIN}/pricing/services`);
    });
  });
});

