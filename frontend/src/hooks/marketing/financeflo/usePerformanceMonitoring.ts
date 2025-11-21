// Performance monitoring hook for comprehensive testing
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { enhancedAnalyticsService } from '@/services/analytics/enhancedAnalytics';
import { logger } from '@/utils/logger';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  errorCount: number;
}

// Safe hook that can be used outside Router context
const useSafeLocation = () => {
  try {
    return useLocation();
  } catch {
    // Return mock location when outside Router context
    return { pathname: window.location.pathname };
  }
};

export const usePerformanceMonitoring = () => {
  const location = useSafeLocation();

  // Track page load performance
  useEffect(() => {
    // Skip analytics in development mode
    if (import.meta.env.DEV) {
      return;
    }

    const startTime = performance.now();

    const trackPagePerformance = async () => {
      // Wait for page to be fully loaded
      await new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve(void 0);
        } else {
          window.addEventListener('load', () => resolve(void 0));
        }
      });

      const loadTime = performance.now() - startTime;

      // Track visitor data
      await enhancedAnalyticsService.trackVisitor({
        sessionId: `session_${Date.now()}`,
        visitorId: localStorage.getItem('visitor_id') || `visitor_${Date.now()}`,
        landingPage: location.pathname,
        referrer: document.referrer,
        utmData: {
          source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
          medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
          campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined
        },
        deviceData: {
          type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          browser: navigator.userAgent.split(' ').slice(-1)[0],
          os: navigator.platform,
          country: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      });

      // Store visitor ID for future tracking
      if (!localStorage.getItem('visitor_id')) {
        localStorage.setItem('visitor_id', `visitor_${Date.now()}`);
      }
    };

    trackPagePerformance();
  }, [location.pathname]);

  // Track Core Web Vitals
  const trackWebVitals = useCallback(() => {
    if ('web-vital' in window) {
      // This would integrate with actual Web Vitals library
      logger.info('Core Web Vitals tracking enabled');
    }
  }, []);

  // Monitor errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logger.error('Performance Monitor - Error occurred', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
      // Track error in analytics
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error('Performance Monitor - Unhandled Promise Rejection', 
        new Error(event.reason), {
          reason: event.reason
        });
      // Track error in analytics
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return {
    trackWebVitals
  };
};

export default usePerformanceMonitoring;