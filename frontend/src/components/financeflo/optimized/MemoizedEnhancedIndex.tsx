import React, { memo } from 'react';
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { EnhancedHeroSection } from "@/components/EnhancedHeroSection";
import { EnhancedFeaturesSection } from "@/components/EnhancedFeaturesSection";
import { EnhancedTestimonialsSection } from "@/components/EnhancedTestimonialsSection";
import ClientLogosSection from "@/components/ClientLogosSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FreeBookOffer from "@/components/FreeBookOffer";
import FinanceFloAIAssistant from "@/components/FinanceFloAIAssistant";
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