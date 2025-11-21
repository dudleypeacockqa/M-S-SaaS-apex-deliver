
import React, { useState } from "react";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Star } from "lucide-react";
import { FeatureCard } from "./features/FeatureCard";
import { FeatureVisualization } from "./features/FeatureVisualization";
import { AdditionalFeaturesGrid } from "./features/AdditionalFeaturesGrid";
import { FeaturesCTA } from "./features/FeaturesCTA";
import { mainFeatures, additionalFeatures } from "./features/featuresData";

export const EnhancedFeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="brand-section bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="bg-brand-gradient text-white px-4 sm:px-6 py-2 text-base sm:text-lg font-semibold mb-4 sm:mb-6">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Award-Winning Technology
          </Badge>

          <h2 className="brand-heading brand-heading-lg text-foreground mb-4 sm:mb-6 px-4">
            The Most Advanced
            <span className="brand-gradient-text"> AI+ERP Platform</span>
          </h2>

          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Built specifically for UK mid-market businesses, our platform combines cutting-edge AI
            with intelligent ERP integration to deliver unprecedented results.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Feature Cards */}
          <div className="space-y-4">
            {mainFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                index={index}
                activeFeature={activeFeature}
                onFeatureClick={setActiveFeature}
              />
            ))}
          </div>

          {/* Feature Visualization */}
          <FeatureVisualization
            features={mainFeatures}
            activeFeature={activeFeature}
          />
        </div>

        {/* Additional Features Grid */}
        <AdditionalFeaturesGrid features={additionalFeatures} />

        {/* CTA Section */}
        <FeaturesCTA />
      </div>
    </section>
  );
};

export default EnhancedFeaturesSection;
