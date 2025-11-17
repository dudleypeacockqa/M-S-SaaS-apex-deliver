/**
 * Tests for AnalyticsProvider - TDD RED phase
 * Sprint 1.3: MARK-002 Marketing Critical Items
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AnalyticsProvider } from './AnalyticsProvider';

describe('AnalyticsProvider', () => {
  beforeEach(() => {
    // Clear any existing scripts
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    (window as any).gtag = undefined;
    (window as any).dataLayer = undefined;
    (window as any).clarity = undefined;
    (window as any)._linkedin_data_partner_ids = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('Google Analytics 4', () => {
    it('should inject GA4 script when measurement ID is provided', () => {
      const measurementId = 'G-TEST123456';
      vi.stubEnv('VITE_GA_MEASUREMENT_ID', measurementId);

      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      const gaScript = document.querySelector(
        `script[src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"]`
      );
      expect(gaScript).toBeTruthy();
    });

    it('should not inject GA4 script when measurement ID is missing', () => {
      vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');

      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      const gaScripts = document.querySelectorAll('script[src*="googletagmanager"]');
      expect(gaScripts.length).toBe(0);
    });

    it('should initialize gtag dataLayer', () => {
      vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123456');

      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      expect((window as any).dataLayer).toBeDefined();
      expect(Array.isArray((window as any).dataLayer)).toBe(true);
    });
  });

  describe('Microsoft Clarity', () => {
    it('should inject Clarity script when project ID is provided', () => {
      const clarityId = 'ABC123';
      vi.stubEnv('VITE_CLARITY_PROJECT_ID', clarityId);

      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      const clarityScript = document.querySelector(
        `script[src="https://www.clarity.ms/tag/${clarityId}"]`
      );
      expect(clarityScript).toBeTruthy();
      expect((window as any).clarity).toBeDefined();
    });

    it('should not inject Clarity script when project ID is missing', () => {
      vi.stubEnv('VITE_CLARITY_PROJECT_ID', '');

      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      const clarityScripts = document.querySelectorAll('script[data-analytics="clarity"]');
      expect(clarityScripts.length).toBe(0);
      expect((window as any).clarity).toBeUndefined();
    });
  });

  describe('LinkedIn Pixel', () => {
    it('should inject LinkedIn Insight Tag when partner ID is provided', () => {
      const partnerId = '123456';
      vi.stubEnv('VITE_LINKEDIN_PARTNER_ID', partnerId);

      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      // Check for LinkedIn script
      const linkedInScript = document.querySelector('script[data-analytics="linkedin"]');
      expect(linkedInScript).toBeTruthy();
      expect(linkedInScript?.getAttribute('src')).toContain('snap.licdn.com');

      // Check for partner ID in window object
      expect((window as any)._linkedin_data_partner_ids).toBeDefined();
      expect((window as any)._linkedin_data_partner_ids).toContain(partnerId);
    });

    it('should not inject LinkedIn Insight Tag when partner ID is missing', () => {
      vi.stubEnv('VITE_LINKEDIN_PARTNER_ID', '');

      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      expect((window as any)._linkedin_data_partner_ids).toBeUndefined();
    });

    it('should inject LinkedIn noscript image tag', () => {
      const partnerId = '123456';
      vi.stubEnv('VITE_LINKEDIN_PARTNER_ID', partnerId);

      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      const noscript = document.getElementById('linkedin-noscript');
      expect(noscript).toBeTruthy();
      expect(noscript?.innerHTML).toContain('px.ads.linkedin.com');
      expect(noscript?.innerHTML).toContain(partnerId);
    });
  });

  describe('Children Rendering', () => {
    it('should render children components', () => {
      const { getByText } = render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      expect(getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Multiple Analytics Integration', () => {
    it('should initialize all analytics when all IDs are provided', () => {
      vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123456');
      vi.stubEnv('VITE_CLARITY_PROJECT_ID', 'ABC123');
      vi.stubEnv('VITE_LINKEDIN_PARTNER_ID', '123456');

      render(
        <AnalyticsProvider>
          <div>Test Content</div>
        </AnalyticsProvider>
      );

      // All analytics should be initialized
      expect((window as any).gtag).toBeDefined();
      expect((window as any).clarity).toBeDefined();
      expect((window as any)._linkedin_data_partner_ids).toBeDefined();
    });
  });
});
