
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
// Performance monitoring removed from initial load
import { ProfessionalHeroSection } from "@/components/marketing/financeflo/ProfessionalHeroSection";
import { EnhancedFeaturesSection } from "@/components/marketing/financeflo/EnhancedFeaturesSection";
import ClientLogosSection from "@/components/marketing/financeflo/ClientLogosSection";
import TestimonialsSection from "@/components/marketing/financeflo/TestimonialsSection";
import FreeBookOffer from "@/components/marketing/financeflo/FreeBookOffer";
import ADAPTProcess from "@/components/marketing/financeflo/ADAPTProcess";
import SEOOptimizer from "@/components/marketing/financeflo/SEOOptimizer";
import PerformanceOptimizer from "@/components/marketing/financeflo/PerformanceOptimizer";
import { Button } from "@/components/marketing/financeflo/ui/Button";
import { useSecureNavigation } from "@/hooks/marketing/financeflo/useSecureNavigation";
import { 
  ArrowRight, 
  CheckCircle, 
  Phone
} from "lucide-react";
// import "@/styles/financeflo/brand.css";

const EnhancedIndex = () => {
  const { navigateTo } = useSecureNavigation();
  
  // Performance monitoring deferred for faster initial load
  
  return (
    <PerformanceOptimizer 
      enableLazyLoading={true}
      enableImageOptimization={false}
      enableCriticalCSS={false}
      enablePreloading={false}
    >
      <SEOOptimizer
        title="Finance Automation Software UK | AI ERP Integration | FinanceFlo"
        description="Finance automation software for UK businesses. AI-powered ERP integration with Sage, Odoo, Acumatica. 300% ROI, 66% cost reduction. Free demo available."
        keywords={[
          "finance automation software",
          "ERP integration UK",
          "AI finance automation",
          "ERP software",
          "finance automation",
          "UK businesses",
          "Sage Intacct",
          "Acumatica",
          "Odoo ERP",
          "financial automation",
          "business automation",
          "ERP implementation",
          "cloud ERP",
          "finance software UK"
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "FinanceFlo.ai",
          "description": "AI-Powered Finance Automation for UK Businesses",
          "url": "https://financeflo.ai",
          "logo": "https://financeflo.ai/FF-Favicon-RT.png",
          "foundingDate": "2020",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+44-7360-539147",
            "contactType": "customer service",
            "areaServed": "GB",
            "availableLanguage": "English"
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "GB"
          },
          "sameAs": [
            "https://www.linkedin.com/company/financeflo-ai"
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "reviewCount": "500"
          },
          "offers": {
            "@type": "Offer",
            "description": "AI-powered ERP integration and finance automation services",
            "areaServed": "GB"
          }
        }}
      />
      <div className="min-h-screen">
        <Navigation />
      

      
      {/* Professional Hero Section */}
      <ProfessionalHeroSection />
      
      {/* Enhanced Features Section */}
      <EnhancedFeaturesSection />
      
      {/* ADAPT Process Section */}
      <ADAPTProcess variant="hero" showCTA={true} />
      
      {/* Client Logos Section */}
      <ClientLogosSection />
      
      {/* Enhanced Testimonials Section */}
      <TestimonialsSection />
      
      {/* Free Book Offer Section */}
      <FreeBookOffer />
      
      
      {/* Final CTA Section */}
      <section className="brand-cta-section" aria-label="Get Started">
        <div className="brand-container-sm">
          <h2 className="brand-cta-title">
            Ready to Transform Your Business Into a Revenue-Generating Machine?
          </h2>
          
          <p className="brand-cta-description">
            Join 500+ businesses that have increased qualified prospects by 300% 
            while streamlining operations with our AI-powered ERP integration system.
          </p>
          
          <div className="brand-cta-buttons mb-8">
            <Button 
              size="lg" 
              variant="brand-cta"
              onClick={() => navigateTo('/assessment')}
            >
              Start Your Free Trial Today
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="brand-outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary"
              onClick={() => navigateTo('/contact')}
            >
              <Phone className="mr-2 h-6 w-6" />
              Book Strategy Session
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-white/80 text-sm">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>30-day free trial</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Setup in under 24 hours</span>
            </div>
          </div>
        </div>
      </section>



      <Footer />
      </div>
    </PerformanceOptimizer>
  );
};

export default EnhancedIndex;
