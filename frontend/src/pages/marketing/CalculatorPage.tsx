import React from 'react';
import { Calculator } from '../../components/calculator/Calculator';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { Helmet } from 'react-helmet-async';

export const CalculatorPage = () => {
  return (
    <MarketingLayout>
      <Helmet>
        <title>Working Capital Calculator - FinanceFlo.ai</title>
        <meta 
          name="description" 
          content="Calculate your working capital potential and cash flow unlock with FinanceFlo's free calculator." 
        />
      </Helmet>
      <div className="bg-gray-50 py-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-navy mb-4">Working Capital Calculator</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how much cash you could unlock by optimizing your working capital cycle.
            </p>
          </div>
          <Calculator />
        </div>
      </div>
    </MarketingLayout>
  );
};

export default CalculatorPage;
