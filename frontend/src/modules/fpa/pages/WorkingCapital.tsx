import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { fpaApi } from '../services/fpaApi';
import { formatCurrency } from '../../../services/api/deals';

export const WorkingCapital: React.FC = () => {
  const { data: analysis, isLoading } = useQuery({
    queryKey: ['fpa', 'working-capital'],
    queryFn: () => fpaApi.getWorkingCapitalAnalysis(),
  });

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Working Capital</h1>
        {isLoading ? (
          <p>Loading analysis...</p>
        ) : analysis ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Working Capital</h2>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(analysis.current, 'GBP')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">30-Day Projection</h2>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(analysis.projection_30day, 'GBP')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">DSO (Days Sales Outstanding)</h3>
              <p className="text-2xl font-bold text-gray-900">{analysis.dso.toFixed(1)} days</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">DPO (Days Payable Outstanding)</h3>
              <p className="text-2xl font-bold text-gray-900">{analysis.dpo.toFixed(1)} days</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">DIO (Days Inventory Outstanding)</h3>
              <p className="text-2xl font-bold text-gray-900">{analysis.dio.toFixed(1)} days</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600">No working capital data available.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

