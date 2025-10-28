import { useState } from 'react';
import { trackCtaClick, trackMarketingEvent } from '../../lib/analytics';

export const ROICalculator: React.FC = () => {
  const [dealsPerYear, setDealsPerYear] = useState(12);
  const [avgDealSize, setAvgDealSize] = useState(5);
  const [hoursPerDeal, setHoursPerDeal] = useState(40);

  const handleDealsChange = (value: number) => {
    setDealsPerYear(value);
    trackMarketingEvent('roi_calculator_update', { field: 'deals_per_year', value });
  };

  const handleDealSizeChange = (value: number) => {
    setAvgDealSize(value);
    trackMarketingEvent('roi_calculator_update', { field: 'average_deal_size_millions', value });
  };

  const handleHoursChange = (value: number) => {
    setHoursPerDeal(value);
    trackMarketingEvent('roi_calculator_update', { field: 'hours_per_deal', value });
  };

  // Calculations
  const currentCost = dealsPerYear * hoursPerDeal * 150; // £150/hour consulting rate
  const platformCost = 279 * 12; // £279/month
  const timeSaved = dealsPerYear * hoursPerDeal * 0.4; // 40% time savings
  const valueSaved = timeSaved * 150;
  const netSavings = valueSaved - platformCost;
  const roi = ((netSavings / platformCost) * 100).toFixed(0);
  const additionalDeals = Math.floor(timeSaved / hoursPerDeal);
  const additionalRevenue = additionalDeals * avgDealSize * 1000000 * 0.02; // 2% success fee

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Calculate Your ROI
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how much time and money you'll save with ApexDeliver
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Side - Inputs */}
            <div className="p-8 lg:p-12 bg-gradient-to-br from-indigo-900 to-blue-900 text-white">
              <h3 className="text-2xl font-bold mb-8">Your Current Situation</h3>
              
              <div className="space-y-8">
                {/* Deals Per Year */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Deals per year
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={dealsPerYear}
                      onChange={(e) => handleDealsChange(Number(e.target.value))}
                      className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="w-16 text-right">
                      <span className="text-2xl font-bold">{dealsPerYear}</span>
                    </div>
                  </div>
                </div>

                {/* Average Deal Size */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Average deal size (£M)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={avgDealSize}
                      onChange={(e) => handleDealSizeChange(Number(e.target.value))}
                      className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="w-16 text-right">
                      <span className="text-2xl font-bold">£{avgDealSize}M</span>
                    </div>
                  </div>
                </div>

                {/* Hours Per Deal */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Hours spent per deal
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="10"
                      value={hoursPerDeal}
                      onChange={(e) => handleHoursChange(Number(e.target.value))}
                      className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="w-16 text-right">
                      <span className="text-2xl font-bold">{hoursPerDeal}h</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-sm text-blue-200 mb-2">Current Annual Cost</div>
                <div className="text-3xl font-bold">£{currentCost.toLocaleString()}</div>
                <div className="text-sm text-blue-200 mt-1">Based on £150/hour consulting rate</div>
              </div>
            </div>

            {/* Right Side - Results */}
            <div className="p-8 lg:p-12 bg-white">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Your Results with ApexDeliver</h3>
              
              <div className="space-y-6">
                {/* ROI */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Return on Investment</span>
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-4xl font-bold text-green-600">{roi}%</div>
                </div>

                {/* Time Saved */}
                <div className="p-6 bg-blue-50 rounded-xl">
                  <div className="text-sm font-medium text-gray-700 mb-2">Time Saved Annually</div>
                  <div className="text-3xl font-bold text-blue-600">{timeSaved.toLocaleString()} hours</div>
                  <div className="text-sm text-gray-600 mt-1">40% reduction in admin time</div>
                </div>

                {/* Money Saved */}
                <div className="p-6 bg-purple-50 rounded-xl">
                  <div className="text-sm font-medium text-gray-700 mb-2">Value of Time Saved</div>
                  <div className="text-3xl font-bold text-purple-600">£{valueSaved.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 mt-1">At £150/hour consulting rate</div>
                </div>

                {/* Additional Deals */}
                <div className="p-6 bg-yellow-50 rounded-xl">
                  <div className="text-sm font-medium text-gray-700 mb-2">Additional Deals Possible</div>
                  <div className="text-3xl font-bold text-yellow-600">{additionalDeals} deals</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Potential revenue: £{(additionalRevenue / 1000).toFixed(0)}K
                  </div>
                </div>

                {/* Net Savings */}
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">Net Annual Savings</div>
                  <div className="text-4xl font-bold text-indigo-600">£{netSavings.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 mt-1">After platform cost of £{platformCost.toLocaleString()}</div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <a
                  href="/sign-up"
                  className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center px-8 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                  onClick={() => trackCtaClick('start-saving', 'roi-calculator')}
                >
                  Start Saving Today - Free Trial
                </a>
                <p className="text-center text-sm text-gray-500 mt-3">
                  No credit card required • 14-day free trial
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-gray-500 mt-8 max-w-3xl mx-auto">
          * Calculations are estimates based on industry averages and customer feedback. Actual results may vary depending on your specific use case and deal complexity.
        </p>
      </div>
    </section>
  );
};

