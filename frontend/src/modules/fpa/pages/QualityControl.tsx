import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';

export const QualityControl: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Quality Control</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">Quality control feature coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

