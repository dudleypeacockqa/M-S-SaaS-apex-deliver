import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const DynamicPricingSimulator: React.FC = () => {
  const [basePrice, setBasePrice] = useState(100);
  const [volumeDiscount, setVolumeDiscount] = useState(10);
  const [seasonalMultiplier, setSeasonalMultiplier] = useState(1.2);
  
  const calculatePricing = () => {
    const data = [
      { name: 'Standard', price: basePrice, revenue: basePrice * 100 },
      { name: 'Volume (50+)', price: basePrice * (1 - volumeDiscount / 100), revenue: (basePrice * (1 - volumeDiscount / 100)) * 150 },
      { name: 'Seasonal Peak', price: basePrice * seasonalMultiplier, revenue: (basePrice * seasonalMultiplier) * 80 },
    ];
    return data;
  };

  const data = calculatePricing();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-6 text-indigo-900">Dynamic Pricing Engine Simulator</h3>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">Base Price ($)</label>
          <input
            id="basePrice"
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="volumeDiscount" className="block text-sm font-medium text-gray-700 mb-1">Volume Discount (%)</label>
          <input
            id="volumeDiscount"
            type="number"
            value={volumeDiscount}
            onChange={(e) => setVolumeDiscount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="seasonalMultiplier" className="block text-sm font-medium text-gray-700 mb-1">Seasonal Multiplier (x)</label>
          <input
            id="seasonalMultiplier"
            type="number"
            step="0.1"
            value={seasonalMultiplier}
            onChange={(e) => setSeasonalMultiplier(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{fontSize: 12}} />
            <YAxis yAxisId="left" orientation="left" stroke="#4F46E5" />
            <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="price" name="Unit Price ($)" fill="#4F46E5" />
            <Bar yAxisId="right" dataKey="revenue" name="Est. Revenue ($)" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-indigo-50 p-4 rounded-md">
        <h4 className="font-bold text-indigo-900 mb-2">Impact Analysis</h4>
        <ul className="text-sm text-indigo-800 space-y-1">
          <li>• Volume pricing could increase revenue by {((data[1].revenue - data[0].revenue) / data[0].revenue * 100).toFixed(1)}% via higher quantity.</li>
          <li>• Peak pricing captures {((data[2].price - data[0].price) / data[0].price * 100).toFixed(1)}% more margin during high demand.</li>
        </ul>
      </div>
    </div>
  );
};
