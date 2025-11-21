import React, { memo } from 'react';
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { EnhancedHeroSection } from "@/components/marketing/financeflo/EnhancedHeroSection";
import { EnhancedFeaturesSection } from "@/components/marketing/financeflo/EnhancedFeaturesSection";
import { EnhancedTestimonialsSection } from "@/components/marketing/financeflo/EnhancedTestimonialsSection";
import ClientLogosSection from "@/components/marketing/financeflo/ClientLogosSection";
import TestimonialsSection from "@/components/marketing/financeflo/TestimonialsSection";
import FreeBookOffer from "@/components/marketing/financeflo/FreeBookOffer";
import FinanceFloAIAssistant from "@/components/marketing/financeflo/FinanceFloAIAssistant";
import { CTASection } from "./CTASection";

// Memoized components for better performance
const MemoizedNavigation = memo(Navigation);
const MemoizedFooter = memo(Footer);
const MemoizedEnhancedHeroSection = memo(EnhancedHeroSection);
const MemoizedEnhancedFeaturesSection = memo(EnhancedFeaturesSection);
const MemoizedClientLogosSection = memo(ClientLogosSection);
const MemoizedTestimonialsSection = memo(TestimonialsSection);
const MemoizedFreeBookOffer = memo(FreeBookOffer);
const MemoizedFinanceFloAIAssistant = memo(FinanceFloAIAssistant);


const MemoizedEnhancedIndex = memo(() => {
  return (
    <div className="min-h-screen">
      <MemoizedNavigation />
      <MemoizedEnhancedHeroSection />
      <MemoizedEnhancedFeaturesSection />
      <MemoizedClientLogosSection />
      <MemoizedTestimonialsSection />
      <MemoizedFreeBookOffer />
      
      {/* AI Assistant Section */}
      <section className="py-16 px-4 bg-accent/30">
        <div className="max-w-2xl mx-auto">
          <MemoizedFinanceFloAIAssistant />
        </div>
      </section>
      
      <CTASection />

      
      <MemoizedFooter />
    </div>
  );
});

MemoizedEnhancedIndex.displayName = 'MemoizedEnhancedIndex';

export default MemoizedEnhancedIndex;