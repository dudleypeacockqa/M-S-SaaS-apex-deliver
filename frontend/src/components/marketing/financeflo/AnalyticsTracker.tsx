import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics 4 interface
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

interface AnalyticsTrackerProps {
  trackingId?: string;
  enableDebug?: boolean;
}

export const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({
  trackingId = 'G-XXXXXXXXXX', // Replace with actual GA4 tracking ID
  enableDebug = false
}) => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics 4 with Consent Mode v2
    const initializeGA4 = () => {
      if (typeof window !== 'undefined' && !window.gtag) {
        // Create dataLayer
        window.dataLayer = window.dataLayer || [];

        // Define gtag function
        function gtag(...args: unknown[]) {
          window.dataLayer.push(args);
        }
        window.gtag = gtag;

        // Set default consent mode to denied (UK PECR compliance)
        gtag('consent', 'default', {
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied',
          'analytics_storage': 'denied',
          'functionality_storage': 'granted', // Necessary cookies
          'personalization_storage': 'denied',
          'security_storage': 'granted', // Necessary cookies
        });

        // Load GA4 script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        document.head.appendChild(script);

        script.onload = () => {
          gtag('js', new Date());
          gtag('config', trackingId, {
            page_title: document.title,
            page_location: window.location.href,
            debug_mode: enableDebug
          });

          // Enhanced ecommerce tracking setup
          gtag('config', trackingId, {
            custom_map: {
              'custom_parameter_1': 'erp_system_interest',
              'custom_parameter_2': 'company_size',
              'custom_parameter_3': 'industry_type'
            }
          });
        };
      }
    };

    initializeGA4();
  }, [trackingId, enableDebug]);

  // Track page views
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', trackingId, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname
      });

      // Track page view event
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname
      });
    }
  }, [location, trackingId]);

  return null;
};

// Custom hooks for tracking specific events
export const useAnalytics = () => {
  const trackEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: parameters.category || 'engagement',
        event_label: parameters.label,
        value: parameters.value,
        ...parameters
      });
    }
  };

  const trackConversion = (conversionName: string, value?: number, currency: string = 'GBP') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: `${conversionName}`,
        value: value,
        currency: currency
      });
    }
  };

  const trackFormSubmission = (formName: string, formData: Record<string, unknown> = {}) => {
    trackEvent('form_submit', {
      category: 'form',
      label: formName,
      form_name: formName,
      ...formData
    });
  };

  const trackVideoEngagement = (videoTitle: string, action: string, progress?: number) => {
    trackEvent('video_engagement', {
      category: 'video',
      label: videoTitle,
      video_title: videoTitle,
      video_action: action,
      video_progress: progress
    });
  };

  const trackDownload = (fileName: string, fileType: string) => {
    trackEvent('file_download', {
      category: 'download',
      label: fileName,
      file_name: fileName,
      file_type: fileType
    });
  };

  const trackERPInterest = (erpSystem: string, action: string) => {
    trackEvent('erp_interest', {
      category: 'erp',
      label: erpSystem,
      erp_system: erpSystem,
      erp_action: action
    });
  };

  const trackConsultationRequest = (source: string, erpInterest?: string) => {
    trackEvent('consultation_request', {
      category: 'lead_generation',
      label: source,
      consultation_source: source,
      erp_interest: erpInterest
    });
    
    // Track as conversion
    trackConversion('consultation_request');
  };

  const trackPhoneCall = (source: string) => {
    trackEvent('phone_call', {
      category: 'lead_generation',
      label: source,
      call_source: source
    });
    
    // Track as conversion
    trackConversion('phone_call');
  };

  return {
    trackEvent,
    trackConversion,
    trackFormSubmission,
    trackVideoEngagement,
    trackDownload,
    trackERPInterest,
    trackConsultationRequest,
    trackPhoneCall
  };
};

// Component for tracking specific page interactions
export const PageInteractionTracker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    // Track scroll depth
    let maxScroll = 0;
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        trackEvent('scroll_depth', {
          category: 'engagement',
          label: `${scrollPercent}%`,
          scroll_depth: scrollPercent
        });
      }
    };

    // Track time on page
    const startTime = Date.now();
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 30) { // Only track if user spent more than 30 seconds
        trackEvent('time_on_page', {
          category: 'engagement',
          value: timeSpent,
          time_spent: timeSpent
        });
      }
    };

    // Track clicks on external links
    const trackExternalLinks = (event: Event) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href && !target.href.includes(window.location.hostname)) {
        trackEvent('external_link_click', {
          category: 'outbound',
          label: target.href,
          link_url: target.href
        });
      }
    };

    // Add event listeners
    window.addEventListener('scroll', trackScrollDepth);
    window.addEventListener('beforeunload', trackTimeOnPage);
    document.addEventListener('click', trackExternalLinks);

    return () => {
      window.removeEventListener('scroll', trackScrollDepth);
      window.removeEventListener('beforeunload', trackTimeOnPage);
      document.removeEventListener('click', trackExternalLinks);
    };
  }, [trackEvent]);

  return <>{children}</>;
};

// Component for tracking CTA button clicks
export const CTATracker: React.FC<{
  children: React.ReactNode;
  ctaName: string;
  ctaLocation: string;
  onClick?: () => void;
}> = ({ children, ctaName, ctaLocation, onClick }) => {
  const { trackEvent } = useAnalytics();

  const handleClick = () => {
    trackEvent('cta_click', {
      category: 'cta',
      label: ctaName,
      cta_name: ctaName,
      cta_location: ctaLocation
    });
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
};

// Component for tracking form interactions
export const FormTracker: React.FC<{
  children: React.ReactNode;
  formName: string;
}> = ({ children, formName }) => {
  const { trackEvent, trackFormSubmission } = useAnalytics();

  useEffect(() => {
    const form = document.querySelector(`form[data-form-name="${formName}"]`);
    if (!form) return;

    const trackFormStart = () => {
      trackEvent('form_start', {
        category: 'form',
        label: formName,
        form_name: formName
      });
    };

    const trackFormSubmit = (event: Event) => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);
      const data: Record<string, unknown> = {};
      
      formData.forEach((value, key) => {
        data[key] = value;
      });

      trackFormSubmission(formName, data);
      
      // Continue with normal form submission
      (event.target as HTMLFormElement).submit();
    };

    const firstInput = form.querySelector('input, textarea, select');
    if (firstInput) {
      firstInput.addEventListener('focus', trackFormStart, { once: true });
    }

    form.addEventListener('submit', trackFormSubmit);

    return () => {
      if (firstInput) {
        firstInput.removeEventListener('focus', trackFormStart);
      }
      form.removeEventListener('submit', trackFormSubmit);
    };
  }, [formName, trackEvent, trackFormSubmission]);

  return <>{children}</>;
};

export default AnalyticsTracker;

