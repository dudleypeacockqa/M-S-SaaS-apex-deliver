import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { pmiApi, type PMISynergy } from '../services/pmiApi';
import { TrendingUp, DollarSign, Target } from 'lucide-react';

interface SynergyTrackerProps {
  projectId: string;
}

export const SynergyTracker: React.FC<SynergyTrackerProps> = ({ projectId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pmi', 'synergies', projectId],
    queryFn: () => pmiApi.listSynergies(projectId),
  });

  if (isLoading) {
    return <div className="text-gray-500">Loading synergies...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading synergies</div>;
  }

  const synergies = data?.items || [];

  const totalPlanned = synergies.reduce((sum, s) => sum + s.planned_value, 0);
  const totalRealized = synergies.reduce((sum, s) => sum + (s.realized_value || 0), 0);
  const realizationRate = totalPlanned > 0 ? (totalRealized / totalPlanned) * 100 : 0;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cost_synergy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'revenue_synergy':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'operational_efficiency':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'realized':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'at_risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number, currency: string = 'GBP') => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Synergy Tracker</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-medium text-gray-600">Total Planned</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPlanned)}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <h3 className="text-sm font-medium text-gray-600">Total Realized</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRealized)}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="text-sm font-medium text-gray-600">Realization Rate</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{realizationRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Synergies List */}
      {synergies.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No synergies tracked yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Planned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Realized
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {synergies.map((synergy) => (
                <tr key={synergy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{synergy.name}</div>
                    {synergy.description && (
                      <div className="text-sm text-gray-500">{synergy.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(synergy.category)}`}
                    >
                      {synergy.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(synergy.planned_value, synergy.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {synergy.realized_value
                      ? formatCurrency(synergy.realized_value, synergy.currency)
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(synergy.status)}`}
                    >
                      {synergy.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

