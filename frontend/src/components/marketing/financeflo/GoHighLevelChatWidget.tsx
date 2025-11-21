import React, { useEffect } from 'react';

interface GoHighLevelChatWidgetProps {
  enabled?: boolean;
  widgetId?: string;
}

export const GoHighLevelChatWidget: React.FC<GoHighLevelChatWidgetProps> = ({
  enabled = true,
  widgetId = '68761434afd5325fa3f86771' // ⚠️ UPDATE THIS WITH YOUR ACTUAL WIDGET ID FROM GHL
}) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const initializeChatWidget = () => {
      // Check if script already exists
      const existingScript = document.querySelector('script[data-widget-id]');
      if (existingScript) {
        return;
      }

      // Create and configure the script element
      const script = document.createElement('script');

      // Using beta URL - this is correct for your account
      script.src = 'https://beta.leadconnectorhq.com/loader.js';
      script.setAttribute('data-resources-url', 'https://beta.leadconnectorhq.com/chat-widget/loader.js');
      script.setAttribute('data-widget-id', widgetId);
      script.async = true;

      // Append to document head
      document.head.appendChild(script);
    };

    // Lazy load: Wait for page to be interactive before loading chat widget
    // This defers the 150+ JS files from GoHighLevel until after critical content loads
    const loadWidget = () => {
      if (document.readyState === 'complete') {
        // Page fully loaded, wait an additional 2 seconds to prioritize user content
        setTimeout(initializeChatWidget, 2000);
      } else {
        // Wait for page to fully load
        window.addEventListener('load', () => {
          setTimeout(initializeChatWidget, 2000);
        }, { once: true });
      }
    };

    loadWidget();

    // Cleanup function
    return () => {
      const script = document.querySelector('script[data-widget-id]');
      if (script) {
        script.remove();
      }
    };
  }, [enabled, widgetId]);

  // This component doesn't render anything visible
  return null;
};

export default GoHighLevelChatWidget;