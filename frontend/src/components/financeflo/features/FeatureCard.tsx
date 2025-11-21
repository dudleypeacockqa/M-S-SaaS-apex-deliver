
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Feature } from "./types";

interface FeatureCardProps {
  feature: Feature;
  index: number;
  activeFeature: number;
  onFeatureClick: (index: number) => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  index,
  activeFeature,
  onFeatureClick,
}) => {
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 transform hover:scale-105 rounded-2xl ${
        activeFeature === index
          ? 'ring-2 ring-brand-navy shadow-xl'
          : 'hover:shadow-lg'
      } ${feature.bgColor}`}
      onClick={() => onFeatureClick(index)}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-r ${feature.color} text-white shadow-lg`}>
            <feature.icon className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-heading font-bold text-gray-900">{feature.title}</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-brand-navy">{feature.stats.value}</div>
                <div className="text-sm text-gray-600">{feature.stats.label}</div>
              </div>
            </div>

            <p className="text-brand-navy font-semibold mb-2">{feature.subtitle}</p>

            {activeFeature === index && (
              <div className="mt-4 space-y-3 animate-fade-in">
                <p className="text-gray-600">{feature.description}</p>

                <div className="grid grid-cols-1 gap-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-brand-green" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
