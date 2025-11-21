
import React from "react";
import BlueprintHeroSection from "@/components/marketing/financeflo/vsl/ecommerce/blueprint/BlueprintHeroSection";
import BlueprintVideoSection from "@/components/marketing/financeflo/vsl/ecommerce/blueprint/BlueprintVideoSection";
import TrendFloSystemSection from "@/components/marketing/financeflo/vsl/ecommerce/blueprint/TrendFloSystemSection";
import CaseStudySection from "@/components/marketing/financeflo/vsl/ecommerce/blueprint/CaseStudySection";
import ImplementationOptionsSection from "@/components/marketing/financeflo/vsl/ecommerce/blueprint/ImplementationOptionsSection";
import BlueprintCTASection from "@/components/marketing/financeflo/vsl/ecommerce/blueprint/BlueprintCTASection";

const EcommerceVSLBlueprint = () => {
  return (
    <div className="min-h-screen bg-white">
      <BlueprintHeroSection />
      <BlueprintVideoSection />
      <TrendFloSystemSection />
      <CaseStudySection />
      <ImplementationOptionsSection />
      <BlueprintCTASection />
    </div>
  );
};

export default EcommerceVSLBlueprint;
