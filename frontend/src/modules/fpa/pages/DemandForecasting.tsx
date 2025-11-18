import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { fpaApi } from '../services/fpaApi';

export const DemandForecasting: React.FC = () => {
  const { data: forecasts, isLoading } = useQuery({
    queryKey: ['fpa', 'demand-forecast'],
    queryFn: () => fpaApi.getDemandForecasts(),
  });

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Demand Forecasting</h1>
        {isLoading ? (
          <p>Loading forecasts...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600">Demand forecasting feature coming soon...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

