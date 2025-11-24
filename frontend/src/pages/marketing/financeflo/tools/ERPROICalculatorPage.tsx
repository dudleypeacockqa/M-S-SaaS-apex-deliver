import React from "react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import ERPROICalculator from "@/components/marketing/financeflo/ERPROICalculator";
import { Helmet } from "react-helmet-async";

const ERPROICalculatorPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>ERP ROI Calculator - Calculate Your Return on Investment | FinanceFlo.ai</title>
        <meta 
          name="description" 
          content="Free ERP ROI calculator for UK businesses. Calculate implementation costs, payback period, and potential savings. Get instant results and detailed analysis report." 
        />
        <meta name="keywords" content="ERP ROI calculator, ERP implementation cost, return on investment, UK ERP, business calculator" />
        <link rel="canonical" href="https://financeflo.ai/tools/erp-roi-calculator" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="ERP ROI Calculator - Calculate Your Return on Investment" />
        <meta property="og:description" content="Free ERP ROI calculator for UK businesses. Calculate implementation costs, payback period, and potential savings." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://financeflo.ai/tools/erp-roi-calculator" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ERP ROI Calculator - Calculate Your Return on Investment" />
        <meta name="twitter:description" content="Free ERP ROI calculator for UK businesses. Calculate implementation costs, payback period, and potential savings." />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "ERP ROI Calculator",
            "description": "Calculate the return on investment for ERP implementation",
            "url": "https://financeflo.ai/tools/erp-roi-calculator",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "GBP"
            },
            "provider": {
              "@type": "Organization",
              "name": "FinanceFlo.ai",
              "url": "https://financeflo.ai"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        
        <main className="pt-20 pb-16">
          <div className="brand-container">
            {/* Hero Section */}
            <div className="text-center py-12 brand-container-sm">
              <h1 className="brand-heading-xl mb-6">
                ERP ROI Calculator
              </h1>
              <p className="brand-body-lg mb-8 leading-relaxed">
                Calculate the potential return on investment for your ERP implementation. 
                Get instant estimates based on your business metrics and receive a detailed analysis report.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  ✓ Used by 450+ UK businesses
                </span>
                <span className="flex items-center">
                  ✓ Industry-specific calculations
                </span>
                <span className="flex items-center">
                  ✓ Instant results
                </span>
                <span className="flex items-center">
                  ✓ Free detailed report
                </span>
              </div>
            </div>

            {/* Calculator Component */}
            <ERPROICalculator />

            {/* Additional Information */}
            <div className="mt-16 brand-container-sm">
              <div className="brand-card-elevated">
                <h2 className="brand-heading-md mb-6">
                  Why Calculate Your ERP ROI?
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="brand-heading-sm mb-3">
                      Make Informed Decisions
                    </h3>
                    <p className="brand-body mb-4">
                      Understanding the financial impact of ERP implementation helps you make data-driven 
                      decisions about technology investments and budget allocation.
                    </p>
                    
                    <h3 className="brand-heading-sm mb-3">
                      Secure Executive Buy-in
                    </h3>
                    <p className="brand-body">
                      Present clear ROI projections to stakeholders and board members to secure 
                      approval and funding for your ERP project.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="brand-heading-sm mb-3">
                      Plan Your Budget
                    </h3>
                    <p className="brand-body mb-4">
                      Get realistic cost estimates for implementation, including hidden costs and 
                      ongoing expenses to plan your budget accurately.
                    </p>
                    
                    <h3 className="brand-heading-sm mb-3">
                      Compare Solutions
                    </h3>
                    <p className="brand-body">
                      Use ROI calculations to compare different ERP solutions and implementation 
                      approaches to find the best fit for your business.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <div className="bg-brand-gradient rounded-lg p-8 text-white">
                <h2 className="brand-heading-md mb-4 text-white">
                  Ready to Start Your ERP Journey?
                </h2>
                <p className="brand-body-lg mb-6 text-white/90">
                  Our ERP experts have helped over 450 UK businesses successfully implement 
                  ERP solutions. Get personalised guidance for your project.
                </p>
                <div className="brand-cta-buttons">
                  <a 
                    href="tel:+447492882175"
                    className="brand-button-secondary bg-white text-primary hover:bg-gray-100"
                  >
                    Call +44 7492 882175
                  </a>
                  <a 
                    href="/contact"
                    className="brand-button-outline border-2 border-white text-white hover:bg-white hover:text-primary"
                  >
                    Schedule Consultation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ERPROICalculatorPage;

