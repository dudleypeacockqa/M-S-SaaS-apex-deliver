
import React from "react";
import { trustIndicators } from "./heroData";

export const HeroTrustIndicators: React.FC = () => {
  return (
    <div className="flex items-center space-x-8 pt-8">
      {trustIndicators.map((indicator, index) => {
        const IconComponent = indicator.icon;
        
        return (
          <div key={index} className="flex items-center space-x-2">
            <IconComponent className={`h-6 w-6 ${indicator.color}`} />
            <span className="text-sm text-gray-600 font-medium">{indicator.label}</span>
          </div>
        );
      })}
    </div>
  );
};
