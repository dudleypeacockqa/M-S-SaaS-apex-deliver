// Disabled ZoomInfo Tracker - temporary fix for loading issues
import React from 'react';

interface ZoomInfoTrackerProps {
  enabled?: boolean;
}

export const ZoomInfoTracker: React.FC<ZoomInfoTrackerProps> = ({
  enabled = false // Disabled by default
}) => {
  // Tracker is disabled to prevent blocking scripts
  return null;
};

// Disabled hook for ZoomInfo tracking events
export const useZoomInfoTracking = () => {
  const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
    // Tracking disabled - no-op
  };

  const trackPageView = (pageName?: string) => {
    // Tracking disabled - no-op
  };

  const trackFormSubmission = (formName: string, formData?: Record<string, any>) => {
    // Tracking disabled - no-op
  };

  const trackVideoEngagement = (videoTitle: string, action: string, progress?: number) => {
    // Tracking disabled - no-op
  };

  const trackCTAClick = (ctaName: string, ctaLocation: string) => {
    // Tracking disabled - no-op
  };

  const trackConsultationRequest = (source: string, contactMethod: string) => {
    // Tracking disabled - no-op
  };

  const trackERPInterest = (erpSystem: string, industry?: string) => {
    // Tracking disabled - no-op
  };

  return {
    trackEvent,
    trackPageView,
    trackFormSubmission,
    trackVideoEngagement,
    trackCTAClick,
    trackConsultationRequest,
    trackERPInterest
  };
};

// Disabled tracking components
export const ZoomInfoPageTracker: React.FC<{
  children: React.ReactNode;
  pageName?: string;
}> = ({ children }) => {
  return <>{children}</>;
};

export const ZoomInfoCTATracker: React.FC<{
  children: React.ReactNode;
  ctaName: string;
  ctaLocation: string;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  return (
    <div onClick={onClick}>
      {children}
    </div>
  );
};

export const ZoomInfoFormTracker: React.FC<{
  children: React.ReactNode;
  formName: string;
}> = ({ children }) => {
  return <>{children}</>;
};

export default ZoomInfoTracker;