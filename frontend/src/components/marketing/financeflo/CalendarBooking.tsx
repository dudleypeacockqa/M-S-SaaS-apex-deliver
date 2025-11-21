import React, { useEffect } from 'react';

interface CalendarBookingProps {
  className?: string;
  minHeight?: string;
}

const CalendarBooking: React.FC<CalendarBookingProps> = ({ 
  className = "", 
  minHeight = "600px" 
}) => {
  useEffect(() => {
    // Load the form embed script
    const script = document.createElement('script');
    script.src = 'https://demo.erpsuccesssystems.com/js/form_embed.js';
    script.type = 'text/javascript';
    script.async = true;
    
    // Check if script is already loaded
    const existingScript = document.querySelector('script[src="https://demo.erpsuccesssystems.com/js/form_embed.js"]');
    if (!existingScript) {
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div
        className="relative w-full overflow-hidden rounded-lg shadow-lg bg-white"
        style={{
          height: minHeight
        }}
      >
        <iframe
          src="https://demo.erpsuccesssystems.com/widget/booking/OoDgv1r9U6994V0VjeX2"
          className="w-full h-full border-0"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            overflow: 'hidden'
          }}
          scrolling="no"
          id="aisGvMZQXL1b32VhTzqn_1751461595070"
          title="Calendar Booking"
          allow="camera; microphone; geolocation"
          loading="lazy"
        />
      </div>
      
      {/* Responsive adjustments for different screen sizes */}
      <style>{`
        @media (max-width: 768px) {
          .calendar-container {
            min-height: 500px;
          }
        }
        
        @media (max-width: 480px) {
          .calendar-container {
            min-height: 450px;
          }
        }
        
        /* Ensure iframe content is fully visible */
        iframe {
          transform: scale(1);
          transform-origin: top left;
        }
        
        /* Handle iframe responsiveness */
        @media (max-width: 768px) {
          iframe {
            transform: scale(0.95);
            transform-origin: top center;
          }
        }
        
        @media (max-width: 480px) {
          iframe {
            transform: scale(0.9);
            transform-origin: top center;
          }
        }
      `}</style>
    </div>
  );
};

export default CalendarBooking;

