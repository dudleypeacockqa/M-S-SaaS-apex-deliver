
import React, { useEffect } from 'react';

interface ZoomInfoTrackerProps {
  enabled?: boolean;
  websiteId?: string;
}

const ZoomInfoTracker: React.FC<ZoomInfoTrackerProps> = ({
  enabled = false,
  websiteId = ''
}) => {
  useEffect(() => {
    if (!enabled || !websiteId) {
      console.log('ZoomInfo tracker disabled or missing website ID');
      return;
    }

    // Type-safe window extension
    const windowWithZi = window as Window & { 
      zi?: (action: string, name: string, data?: Record<string, unknown>) => void;
    };

    // ZoomInfo tracking implementation
    const initializeZoomInfo = () => {
      try {
        // Create ZoomInfo script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = `https://ws.zoominfo.com/pixel/${websiteId}`;
        
        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(script, firstScript);
        }

        // Initialize ZoomInfo function
        windowWithZi.zi = windowWithZi.zi || function(...args) {
          if (typeof windowWithZi.zi === 'function') {
            // Call the actual zi function when available
            (windowWithZi.zi as any).q = (windowWithZi.zi as any).q || [];
            (windowWithZi.zi as any).q.push(args);
          }
        };

        // Track page view
        if (windowWithZi.zi) {
          windowWithZi.zi('track', 'page_view');
        }

      } catch (error) {
        console.error('Error initializing ZoomInfo:', error);
      }
    };

    initializeZoomInfo();

    // Cleanup function
    return () => {
      // Remove ZoomInfo script and clean up
      const scripts = document.querySelectorAll(`script[src*="zoominfo.com"]`);
      scripts.forEach(script => script.remove());
      
      if (windowWithZi.zi) {
        delete windowWithZi.zi;
      }
    };
  }, [enabled, websiteId]);

  // Component doesn't render anything
  return null;
};

export default ZoomInfoTracker;
