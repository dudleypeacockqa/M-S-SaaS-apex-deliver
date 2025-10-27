/**
 * FinancialOverview Component - DEV-010
 * Displays connection status and provides connect/sync functionality
 */

import React from 'react';

export interface FinancialOverviewProps {
  dealId: string;
  isConnected: boolean;
  platform?: 'xero' | 'quickbooks';
  platformOrgName?: string;
  lastSyncAt?: string | null;
  isLoading?: boolean;
  onConnect: () => void;
  onSync: () => void;
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  isConnected,
  platform,
  platformOrgName,
  lastSyncAt,
  isLoading = false,
  onConnect,
  onSync,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="financial-overview">
      <div className="connection-status-card bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Financial Data Connection</h2>

        {!isConnected ? (
          <div className="not-connected">
            <div className="status-indicator text-gray-500 mb-4">
              <span className="inline-block w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
              Not Connected
            </div>
            <p className="text-gray-600 mb-4">
              Connect your accounting system to import financial data and generate insights.
            </p>
            <button
              onClick={onConnect}
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Connect Accounting System
            </button>
          </div>
        ) : (
          <div className="connected">
            <div className="status-indicator text-green-600 mb-4">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              Connected
            </div>

            {platform && (
              <div className="platform-info mb-3">
                <span className="font-semibold text-gray-700">Platform: </span>
                <span className="text-gray-900 capitalize">{platform}</span>
              </div>
            )}

            {platformOrgName && (
              <div className="org-name mb-4">
                <span className="font-semibold text-gray-700">Organization: </span>
                <span className="text-gray-900">{platformOrgName}</span>
              </div>
            )}

            {lastSyncAt && (
              <div className="last-sync text-sm text-gray-600 mb-4">
                <span className="font-semibold">Last Sync: </span>
                <span>{formatDate(lastSyncAt)}</span>
              </div>
            )}

            <button
              onClick={onSync}
              disabled={isLoading}
              className={`btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Syncing...' : 'Sync Data'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
