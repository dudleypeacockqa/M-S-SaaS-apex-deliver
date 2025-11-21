
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AdditionalFeature } from "./types";

interface AdditionalFeaturesGridProps {
  features: AdditionalFeature[];
}

export const AdditionalFeaturesGrid: React.FC<AdditionalFeaturesGridProps> = ({
  features,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <Card
          key={index}
          className="bg-white hover:bg-gradient-to-br hover:from-brand-navy/5 hover:to-brand-blue/5 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group rounded-2xl"
        >
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-to-r from-brand-navy to-brand-navy-light text-white p-4 rounded-2xl inline-block mb-4 group-hover:scale-110 transition-transform duration-300">
              <feature.icon className="h-8 w-8" />
            </div>

            <h3 className="text-base sm:text-lg font-heading font-bold text-gray-900 mb-2 break-words">{feature.title}</h3>
            <p className="text-gray-600 text-sm break-words">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
