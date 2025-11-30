import React from 'react';
import { Calculator, TrendingUp, Target, Zap } from 'lucide-react';
import { ROICalculator } from './ROICalculator';

export const ROICalculatorSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-brand-teal-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-blue rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-brand-teal-400/10 rounded-full border border-brand-teal-400/20 mb-6">
            <Calculator className="h-5 w-5 text-brand-teal-600 mr-2" />
            <span className="text-brand-teal-600 font-semibold">Calculate Your Potential</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            See Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal-400 to-brand-blue">
              ROI in Real-Time
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover exactly how much you could save with our Adaptive Intelligence Framework™. 
            Get a personalized ROI calculation based on your business metrics.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-brand-teal-400/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-brand-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Instant Results</h3>
            </div>
            <p className="text-slate-600">
              Get immediate insights into your potential savings, ROI percentage, and payback period
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-brand-blue/10 rounded-lg">
                <Target className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Industry-Specific</h3>
            </div>
            <p className="text-slate-600">
              Calculations tailored to your industry with specific efficiency multipliers
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-brand-teal-400/10 rounded-lg">
                <Zap className="h-6 w-6 text-brand-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Commitment</h3>
            </div>
            <p className="text-slate-600">
              Free calculation with no obligation. See the numbers before making any decisions
            </p>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="max-w-5xl mx-auto">
          <ROICalculator 
            showDetailedBreakdown={true}
            onCalculationComplete={(inputs, results) => {
              // Track calculation completion
              console.log('ROI Calculated:', { inputs, results });
            }}
          />
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            Want to discuss your results with an expert?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/assessment"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-brand-teal-400 to-brand-blue text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300"
            >
              Schedule Free Assessment
            </a>
            <a
              href="tel:+447360539147"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-navy border-2 border-brand-teal-400 font-semibold rounded-lg hover:bg-brand-teal-50 transition-all duration-300"
            >
              Call: +44 7360 539147
            </a>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-teal-400 rounded-full"></div>
              <span>Based on 450+ implementations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-teal-400 rounded-full"></div>
              <span>66% average cost reduction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-teal-400 rounded-full"></div>
              <span>500% average ROI boost</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculatorSection;
