import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ArrowRight, RefreshCw, TrendingUp, DollarSign } from 'lucide-react';

export const CashFlowCalculator: React.FC = () => {
  const [startingCash, setStartingCash] = useState(100000);
  const [weeklyRevenue, setWeeklyRevenue] = useState(50000);
  const [weeklyExpenses, setWeeklyExpenses] = useState(40000);
  const [volatility, setVolatility] = useState(5); // % random variance

  const forecast = useMemo(() => {
    const weeks = 13;
    const data = [];
    let currentCash = startingCash;

    for (let i = 0; i <= weeks; i++) {
      if (i === 0) {
        data.push({ week: `Week ${i}`, cash: currentCash, low: currentCash, high: currentCash });
        continue;
      }

      // Add some realistic variance
      const revVariance = 1 + (Math.random() * volatility * 2 - volatility) / 100;
      const expVariance = 1 + (Math.random() * volatility * 2 - volatility) / 100;

      const rev = weeklyRevenue * revVariance;
      const exp = weeklyExpenses * expVariance;
      
      currentCash = currentCash + rev - exp;
      
      data.push({
        week: `Week ${i}`,
        cash: Math.round(currentCash),
        low: 50000, // Threshold line
      });
    }
    return data;
  }, [startingCash, weeklyRevenue, weeklyExpenses, volatility]);

  const minCash = Math.min(...forecast.map(d => d.cash));
  const isNegative = minCash < 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-6 bg-indigo-900 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          13-Week Cash Flow Simulator
        </h3>
        <p className="text-indigo-200 text-sm mt-1">
          Visualize your cash runway with our interactive forecasting engine.
        </p>
      </div>

      <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Starting Cash Balance
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="number"
                value={startingCash}
                onChange={(e) => setStartingCash(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Avg. Weekly Revenue
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="number"
                value={weeklyRevenue}
                onChange={(e) => setWeeklyRevenue(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Avg. Weekly Expenses
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="number"
                value={weeklyExpenses}
                onChange={(e) => setWeeklyExpenses(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Market Volatility ({volatility}%)
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={volatility}
              onChange={(e) => setVolatility(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <button 
            onClick={() => setVolatility(volatility === 5 ? 5.01 : 5)} 
            className="w-full flex items-center justify-center gap-2 text-indigo-600 font-semibold bg-indigo-50 hover:bg-indigo-100 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Simulation
          </button>
        </div>

        {/* Chart */}
        <div className="md:col-span-2 bg-slate-50 rounded-xl border border-slate-200 p-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  interval={2}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cash Balance']}
                  contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
                <Line 
                  type="monotone" 
                  dataKey="cash" 
                  stroke={isNegative ? "#ef4444" : "#4f46e5"} 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className={`flex items-center gap-2 ${isNegative ? 'text-red-600' : 'text-emerald-600'} font-medium`}>
              {isNegative ? (
                <>⚠️ Warning: Negative cash flow projected</>
              ) : (
                <>✅ Positive cash runway maintained</>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Ending Balance</div>
              <div className={`text-xl font-bold ${forecast[forecast.length - 1].cash < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                ${forecast[forecast.length - 1].cash.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
        <p className="text-sm text-slate-600 hidden md:block">
          Get AI-powered accuracy with live bank data integration.
        </p>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200">
          Start Full Forecast <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
