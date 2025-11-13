import React from 'react';

/**
 * Dashboard Mockup Component
 * Shows a visual representation of the CapLiquify 13-week cash forecast dashboard
 * Similar to FinanceFlo.ai's live dashboard mockup
 */
export const DashboardMockup: React.FC = () => {
  return (
    <div className="relative max-w-5xl mx-auto mt-12">
      {/* Browser Chrome */}
      <div className="bg-gray-800 rounded-t-lg p-3 flex items-center gap-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 bg-gray-700 rounded px-4 py-1 text-gray-400 text-sm">
          app.capliquify.com/cash-forecast
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="bg-white rounded-b-lg shadow-2xl p-6 border-x border-b border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">13-Week Cash Forecast</h3>
            <p className="text-gray-600">Updated 2 hours ago • 95.8% accuracy</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-md bg-emerald-700 text-white font-semibold text-sm transition-colors hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
              Export PDF
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold text-sm">
              Share
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
            <div className="text-emerald-700 text-sm font-semibold mb-1">Current Cash</div>
            <div className="text-2xl font-bold text-emerald-900">£2.4M</div>
            <div className="text-emerald-700 text-xs mt-1">↑ 12% vs last week</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="text-blue-700 text-sm font-semibold mb-1">Week 13 Cash</div>
            <div className="text-2xl font-bold text-blue-900">£3.1M</div>
            <div className="text-blue-600 text-xs mt-1">Forecast</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="text-purple-700 text-sm font-semibold mb-1">DSO</div>
            <div className="text-2xl font-bold text-purple-900">42 days</div>
            <div className="text-purple-600 text-xs mt-1">↓ 5 days improved</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <div className="text-orange-700 text-sm font-semibold mb-1">DPO</div>
            <div className="text-2xl font-bold text-orange-900">38 days</div>
            <div className="text-orange-600 text-xs mt-1">Optimized</div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-semibold text-gray-700">Cash Position Trend</div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-700 rounded-full" aria-hidden="true"></div>
                <span className="text-gray-600">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-700 rounded-full" aria-hidden="true"></div>
                <span className="text-gray-600">Forecast</span>
              </div>
            </div>
          </div>
          
          {/* Simplified Chart Visualization */}
          <div className="relative h-48">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-t border-gray-300 border-dashed"></div>
              ))}
            </div>
            
            {/* Chart bars */}
            <div className="absolute inset-0 flex items-end justify-between px-2 gap-1">
              {[65, 70, 68, 75, 80, 85, 82, 88, 90, 92, 95, 98, 100].map((height, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t ${i < 7 ? 'bg-emerald-700' : 'bg-blue-700/80'}`}
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Week labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>W1</span>
            <span>W4</span>
            <span>W7</span>
            <span>W10</span>
            <span>W13</span>
          </div>
        </div>

        {/* Action Items */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                !
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">Action Required</div>
                <div className="text-gray-700 text-xs mt-1">
                  3 invoices overdue by 15+ days. Review AR aging.
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                ✓
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">On Track</div>
                <div className="text-gray-700 text-xs mt-1">
                  Cash runway: 18 months. Working capital optimized.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-3xl -z-10"></div>
    </div>
  );
};
