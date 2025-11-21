
import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { useNavigate } from "react-router-dom";
import { ctaButtons } from "./heroData";

export const HeroCTAButtons: React.FC = () => {
  const navigate = useNavigate();

  const handleCTAClick = (action: string) => {
    switch (action) {
      case 'assessment':
        navigate('/assessment');
        break;
      case 'demo':
        // For now, navigate to contact page - can be updated to demo modal later
        navigate('/contact');
        break;
      default:
        // Log development warnings only
        if (import.meta.env.DEV) {
          import('@/utils/logger').then(({ logger }) => {
            logger.warn('Unknown CTA action', { action });
          });
        }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {ctaButtons.map((button, index) => {
        const IconComponent = button.icon;
        
        if (button.variant === 'primary') {
          return (
            <Button 
              key={index}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              onClick={() => handleCTAClick(button.action)}
            >
              {button.text}
              <IconComponent className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          );
        }
        
        return (
          <Button 
            key={index}
            size="lg" 
            variant="outline" 
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            onClick={() => handleCTAClick(button.action)}
          >
            <IconComponent className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
            {button.text}
          </Button>
        );
      })}
    </div>
  );
};
