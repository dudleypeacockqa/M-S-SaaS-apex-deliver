// Custom hook for analytics tracking
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '@/services/analytics';
import { AnalyticsEvent } from '@/types/common';

export const useAnalytics = () => {
  const location = useLocation();

  // Track page views automatically
  useEffect(() => {
    const pageTitle = document.title;
    analyticsService.trackPageView(location.pathname, pageTitle);
  }, [location.pathname]);

  // Track custom events
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    analyticsService.trackEvent(event);
  }, []);

  // Track form submissions
  const trackFormSubmission = useCallback((formType: string, formData: Record<string, unknown>) => {
    analyticsService.trackFormSubmission(formType, formData);
  }, []);

  // Track blog interactions
  const trackBlogAnalytics = useCallback((postId: string, type: 'view' | 'video_play' | 'audio_play', duration?: number) => {
    analyticsService.trackBlogAnalytics(postId, type, duration);
  }, []);

  // Track button clicks
  const trackButtonClick = useCallback((buttonName: string, location?: string, additionalData?: Record<string, unknown>) => {
    trackEvent({
      category: 'Button',
      action: 'Click',
      label: buttonName,
      customProperties: {
        location: location || window.location.pathname,
        ...additionalData
      }
    });
  }, [trackEvent]);

  // Track link clicks
  const trackLinkClick = useCallback((linkUrl: string, linkText?: string, isExternal?: boolean) => {
    trackEvent({
      category: 'Link',
      action: 'Click',
      label: linkUrl,
      customProperties: {
        link_text: linkText,
        is_external: isExternal,
        source_page: window.location.pathname
      }
    });
  }, [trackEvent]);

  // Track video interactions
  const trackVideoInteraction = useCallback((videoId: string, action: 'play' | 'pause' | 'complete', currentTime?: number) => {
    trackEvent({
      category: 'Video',
      action: action,
      label: videoId,
      value: currentTime,
      customProperties: {
        video_id: videoId,
        current_time: currentTime,
        page: window.location.pathname
      }
    });
  }, [trackEvent]);

  // Track scroll depth
  const trackScrollDepth = useCallback((depth: number, maxDepth: number) => {
    const percentage = Math.round((depth / maxDepth) * 100);
    
    // Track at 25%, 50%, 75%, and 100% intervals
    if (percentage >= 25 && percentage < 50) {
      trackEvent({
        category: 'Scroll',
        action: '25%',
        label: window.location.pathname,
        value: 25
      });
    } else if (percentage >= 50 && percentage < 75) {
      trackEvent({
        category: 'Scroll',
        action: '50%',
        label: window.location.pathname,
        value: 50
      });
    } else if (percentage >= 75 && percentage < 100) {
      trackEvent({
        category: 'Scroll',
        action: '75%',
        label: window.location.pathname,
        value: 75
      });
    } else if (percentage >= 100) {
      trackEvent({
        category: 'Scroll',
        action: '100%',
        label: window.location.pathname,
        value: 100
      });
    }
  }, [trackEvent]);

  // Track time spent on page
  const trackTimeSpent = useCallback((timeInSeconds: number) => {
    trackEvent({
      category: 'Engagement',
      action: 'Time Spent',
      label: window.location.pathname,
      value: timeInSeconds,
      customProperties: {
        time_spent_seconds: timeInSeconds,
        time_spent_formatted: `${Math.floor(timeInSeconds / 60)}m ${timeInSeconds % 60}s`
      }
    });
  }, [trackEvent]);

  // Track download events
  const trackDownload = useCallback((fileName: string, fileType: string, fileUrl: string) => {
    trackEvent({
      category: 'Download',
      action: 'File Download',
      label: fileName,
      customProperties: {
        file_name: fileName,
        file_type: fileType,
        file_url: fileUrl,
        page: window.location.pathname
      }
    });
  }, [trackEvent]);

  // Track search events
  const trackSearch = useCallback((searchTerm: string, resultsCount?: number) => {
    trackEvent({
      category: 'Search',
      action: 'Search Query',
      label: searchTerm,
      value: resultsCount,
      customProperties: {
        search_term: searchTerm,
        results_count: resultsCount,
        page: window.location.pathname
      }
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackFormSubmission,
    trackBlogAnalytics,
    trackButtonClick,
    trackLinkClick,
    trackVideoInteraction,
    trackScrollDepth,
    trackTimeSpent,
    trackDownload,
    trackSearch
  };
};

export default useAnalytics;