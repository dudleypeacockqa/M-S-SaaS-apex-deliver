'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CalculatorInputs, CalculatorResults } from '@/lib/financeflo/calculator';
import { getRevenueBracket, storeCalculatorData } from '@/utils/financeflo/revenueMatching';
import { track } from '@/lib/analytics';
import { LeadCaptureForm } from './LeadCaptureForm';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: CalculatorInputs;
  results: CalculatorResults | null;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  inputs,
  results
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    // Store calculator data for thank you page
    if (results) {
      storeCalculatorData(inputs, results);
    }

    // Track modal opened event
    track('lead_capture_modal_opened', {
      industry: inputs.industry,
      revenue_bracket: getRevenueBracket(inputs.annualRevenue)
    });
  }, [isOpen, inputs, results]);

  const handleFormSuccess = (email: string, firstName: string, companyName: string) => {
    // Track successful submission
    track('lead_captured_success', {
      industry: inputs.industry,
      revenue_bracket: getRevenueBracket(inputs.annualRevenue)
    });

    // Close modal
    onClose();

    // Navigate to thank you page with parameters
    navigate(`/calculator/thank-you?email=${encodeURIComponent(email)}&name=${encodeURIComponent(firstName)}&company=${encodeURIComponent(companyName)}`);
  };

  const handleFormError = (error: string) => {
    console.error('Form submission error:', error);
    track('lead_capture_error', {
      error: error,
      industry: inputs.industry
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-auto my-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-brand-navy to-brand-navy-light text-white px-8 py-5 rounded-t-2xl">
            <h2 className="text-2xl font-heading font-bold mb-1">
              Get Your Board-Ready Report
            </h2>
            <p className="text-blue-100 text-sm">
              Join 450+ finance leaders • Your detailed analysis stays private in your PDF
            </p>
          </div>

          {/* Custom Lead Capture Form */}
          <div className="px-8 py-6">
            <LeadCaptureForm
              calculatorInputs={inputs}
              onSuccess={handleFormSuccess}
              onError={handleFormError}
            />
          </div>

          {/* Collapsible Details Section */}
          <div className="border-t">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full px-8 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-sm font-medium text-brand-navy"
            >
              <span>What's in your report? What data do we store?</span>
              <svg
                className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDetails && (
              <div className="px-8 py-6 bg-gray-50 border-t space-y-4">
                {/* Benefits - Now First */}
                <div>
                  <p className="text-sm font-semibold text-brand-navy mb-2">Your report includes:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                    <div className="flex items-start">
                      <span className="text-brand-teal-600 mr-2">✓</span>
                      <span>Full cash flow analysis</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-brand-teal-600 mr-2">✓</span>
                      <span>Industry benchmarking</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-brand-teal-600 mr-2">✓</span>
                      <span>90-day action plan</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-brand-teal-600 mr-2">✓</span>
                      <span>Executive summary</span>
                    </div>
                  </div>
                </div>

                {/* Privacy Notice - Now Second */}
                <div>
                  <h3 className="text-sm font-semibold text-brand-navy mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    What We Store
                  </h3>
                  <div className="text-xs text-gray-700 space-y-1">
                    <p className="flex items-start">
                      <span className="text-brand-teal-600 mr-2">✓</span>
                      <span><strong>Contact info:</strong> Name, Email, Phone, Company</span>
                    </p>
                    <p className="flex items-start">
                      <span className="text-brand-teal-600 mr-2">✓</span>
                      <span><strong>Business metrics:</strong> # of Employees, Annual Revenue, Industry</span>
                    </p>
                    <p className="mt-2 flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span><strong>We DO NOT store:</strong> Cash balances, debtor/creditor days, profit margins, EBITDA, or calculated results</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      All detailed financial analysis stays in your PDF only.
                      <span className="inline-flex items-center ml-1">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        GDPR compliant • Never shared
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="px-8 py-3 bg-white text-center text-xs text-gray-600 border-t rounded-b-2xl">
            By submitting, you agree to receive the Board-Ready Report and relevant insights. Unsubscribe anytime.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
