import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const CashFlowCalculator: React.FC = () => {
  const [startingCash, setStartingCash] = useState(100000);
  const [weeklyRevenue, setWeeklyRevenue] = useState(50000);
  const [weeklyExpenses, setWeeklyExpenses] = useState(40000);
  const [forecast, setForecast] = useState<{ week: string; cash: number }[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculate = () => {
    const weeks = 13;
    const data: { week: string; cash: number }[] = [];
    let currentCash = startingCash;

    for (let i = 1; i <= weeks; i++) {
      currentCash = currentCash + weeklyRevenue - weeklyExpenses;
      data.push({ week: `W${i}`, cash: currentCash });
    }
    setForecast(data);
    setHasCalculated(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-indigo-900">13-Week Cash Forecast Calculator</h3>

      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="startingCash" className="block text-sm font-medium text-gray-700 mb-1">
            Starting Cash ($)
          </label>
          <input
            type="number"
            id="startingCash"
            value={startingCash}
            onChange={(e) => setStartingCash(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="weeklyRevenue" className="block text-sm font-medium text-gray-700 mb-1">
            Weekly Revenue ($)
          </label>
          <input
            type="number"
            id="weeklyRevenue"
            value={weeklyRevenue}
            onChange={(e) => setWeeklyRevenue(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="weeklyExpenses" className="block text-sm font-medium text-gray-700 mb-1">
            Weekly Expenses ($)
          </label>
          <input
            type="number"
            id="weeklyExpenses"
            value={weeklyExpenses}
            onChange={(e) => setWeeklyExpenses(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium mb-6"
      >
        Calculate Forecast
      </button>

      {hasCalculated && (
        <div className="animate-fade-in">
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="cash" stroke="#4F46E5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-indigo-50 p-3 rounded-md mb-4">
             <p className="text-sm text-indigo-800 font-medium">
                {forecast.some((v) => v.cash < 0)
                  ? "⚠️ Warning: Cash goes negative in forecast period."
                  : "✅ Cash remains positive throughout forecast period."}
             </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Want automated forecasting with real-time bank data?
            </p>
            <button className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline text-sm">
              Start Free 14-Day Trial →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

