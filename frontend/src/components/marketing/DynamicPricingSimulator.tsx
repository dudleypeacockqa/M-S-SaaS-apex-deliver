import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RefreshCw, TrendingUp, ShoppingBag, Settings, Percent } from 'lucide-react';

export const DynamicPricingSimulator: React.FC = () => {
  const [basePrice, setBasePrice] = useState(100);
  const [discountRate, setDiscountRate] = useState(10);
  const [elasticity, setElasticity] = useState(1.5); // Price elasticity of demand

  const simulationData = useMemo(() => {
    const scenarios = [
      { name: 'Standard', price: basePrice, discount: 0 },
      { name: 'Discounted', price: basePrice * (1 - discountRate / 100), discount: discountRate },
      { name: 'Optimized', price: basePrice * 0.95, discount: 5 }, // AI Suggested
    ];

    return scenarios.map(scenario => {
      // Simple demand curve: Q = Q0 * (P/P0)^(-E)
      const priceRatio = scenario.price / basePrice;
      const volumeMultiplier = Math.pow(priceRatio, -elasticity);
      const estimatedVolume = 1000 * volumeMultiplier;
      const revenue = scenario.price * estimatedVolume;

      return {
        name: scenario.name,
        price: scenario.price,
        volume: Math.round(estimatedVolume),
        revenue: Math.round(revenue),
      };
    });
  }, [basePrice, discountRate, elasticity]);

  const maxRevenue = Math.max(...simulationData.map(d => d.revenue));

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-6 bg-emerald-900 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-emerald-400" />
          Dynamic Pricing Engine
        </h3>
        <p className="text-emerald-100 text-sm mt-1">
          Simulate how price changes impact volume and total revenue.
        </p>
      </div>

      <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Base Product Price ($)
            </label>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Discount Strategy (%)
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="number"
                min="0"
                max="50"
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Market Elasticity ({elasticity})
            </label>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={elasticity}
              onChange={(e) => setElasticity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <p className="text-xs text-slate-500 mt-1">
              Higher elasticity means customers are more sensitive to price changes.
            </p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
            <h4 className="text-sm font-bold text-emerald-800 mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4" /> AI Recommendation
            </h4>
            <p className="text-sm text-emerald-700">
              Based on current elasticity, a <span className="font-bold">5% discount</span> maximizes total revenue.
            </p>
          </div>
        </div>

        {/* Visualization */}
        <div className="md:col-span-2 bg-slate-50 rounded-xl border border-slate-200 p-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={simulationData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#059669" tickFormatter={(val) => `$${val/1000}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" tickFormatter={(val) => `${val}`} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                    name === 'revenue' ? 'Total Revenue' : 'Sales Volume'
                  ]}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar yAxisId="left" dataKey="revenue" name="revenue" radius={[4, 4, 0, 0]} barSize={40}>
                  {simulationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.revenue === maxRevenue ? '#059669' : '#a7f3d0'} />
                  ))}
                </Bar>
                <Bar yAxisId="right" dataKey="volume" name="volume" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-6 mt-2 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-600 rounded"></div> Revenue
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-400 rounded"></div> Volume
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
        <p className="text-sm text-slate-600 font-medium">
          Projected Revenue Lift: <span className="text-emerald-600 font-bold">+{((maxRevenue / simulationData[0].revenue - 1) * 100).toFixed(1)}%</span>
        </p>
        <button className="text-emerald-700 hover:text-emerald-800 font-semibold text-sm flex items-center gap-1">
           Configure Pricing Rules <TrendingUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
