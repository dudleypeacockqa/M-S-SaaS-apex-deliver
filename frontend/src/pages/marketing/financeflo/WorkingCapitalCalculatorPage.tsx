import React, { useState, useEffect } from 'react';
import Calculator from '@/components/marketing/financeflo/calculator/Calculator';
import LeadCaptureModal from '@/components/marketing/financeflo/calculator/LeadCaptureModal';
import { Helmet } from 'react-helmet-async';
import { track } from '@/lib/analytics';
import { getURLParameters } from '@/utils/financeflo/revenueMatching';

const WorkingCapitalCalculatorPage: React.FC = () => {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [modalData, setModalData] = useState<{ inputs: any; results: any } | null>(null);

  useEffect(() => {
    // Track page view with URL parameters
    const urlParams = getURLParameters();
    track('calculator_viewed', {
      utm_source: urlParams.utm_source,
      utm_campaign: urlParams.utm_campaign,
      utm_medium: urlParams.utm_medium,
      has_email_prefill: !!urlParams.email
    });
  }, []);

  const handleOpenLeadCapture = (inputs: any, results: any) => {
    setModalData({ inputs, results });
    setShowLeadModal(true);
  };

  const handleCloseLeadCapture = () => {
    setShowLeadModal(false);
  };

  return (
    <>
      <Helmet>
        <title>Working Capital Calculator | FinanceFlo</title>
        <meta
          name="description"
          content="Calculate your working capital unlock potential and cash flow optimization opportunities with FinanceFlo's interactive calculator."
        />
      </Helmet>

      <div className="min-h-screen bg-brand-grey py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-4">
              <span className="inline-block bg-brand-green/10 text-brand-green text-sm font-semibold px-4 py-2 rounded-full">
                Trusted by 450+ CFOs
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-navy mb-4">
              Unlock Hidden Cash in Your Business
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Discover how much cash you could unlock by optimizing your working capital.
              Get instant insights and a Board-Ready Report in minutes.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Results in 60 seconds</span>
              </div>
            </div>
          </div>

          {/* Calculator Component */}
          <Calculator onOpenLeadCapture={handleOpenLeadCapture} />

          {/* Additional Info Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-navy mb-2">Cash Flow Optimization</h3>
              <p className="text-gray-600">
                Identify opportunities to improve cash flow by optimizing debtor days, creditor days, and inventory turns.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-navy mb-2">Industry Benchmarks</h3>
              <p className="text-gray-600">
                Compare your performance against industry averages and identify areas for improvement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="w-12 h-12 bg-brand-navy/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-navy mb-2">Board-Ready Reports</h3>
              <p className="text-gray-600">
                Export professional PDF reports with detailed analysis and recommendations for stakeholders.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-brand-navy to-brand-navy-light rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Want to Learn More?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Discover how FinanceFlo can help you optimize your working capital and improve cash flow with AI-powered financial management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-brand-green text-white font-semibold rounded-2xl hover:bg-brand-green-light transition-colors"
              >
                Book a Demo
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-brand-navy font-semibold rounded-2xl hover:bg-gray-100 transition-colors"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Modal */}
      {showLeadModal && modalData && (
        <LeadCaptureModal
          isOpen={showLeadModal}
          onClose={handleCloseLeadCapture}
          inputs={modalData.inputs}
          results={modalData.results}
        />
      )}
    </>
  );
};

export default WorkingCapitalCalculatorPage;
