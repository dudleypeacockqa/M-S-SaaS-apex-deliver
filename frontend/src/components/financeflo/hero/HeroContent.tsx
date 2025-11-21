
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export const HeroContent: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
          Transform Your Business Into a
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Revenue-Generating Machine</span>
        </h1>
        
        <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
          Our <strong>Adaptive Intelligence Framework™</strong> combines AI automation 
          with intelligent ERP integration to deliver measurable results for finance teams across the UK.
        </p>
      </div>
    </div>
  );
};
