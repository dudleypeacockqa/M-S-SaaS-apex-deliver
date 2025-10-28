/**
 * FeatureGate Component
 *
 * Controls access to tier-gated podcast features.
 * Shows children when user has access, displays upgrade CTA otherwise.
 *
 * Requirements from DEV-016:
 * - Check feature access via API
 * - Show children only when access granted
 * - Display upgrade prompt with required tier when access denied
 * - Deny-by-default on errors (security requirement)
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkFeatureAccess } from '../../services/api/podcasts';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
}

export function FeatureGate({ feature, children }: FeatureGateProps) {
  const {
    data: accessData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['featureAccess', feature],
    queryFn: () => checkFeatureAccess(feature),
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  // Deny-by-default: If error or no access, show upgrade CTA
  const hasAccess = accessData?.has_access === true;

  if (!hasAccess || error) {
    const requiredTier = accessData?.required_tier || 'Professional';
    const currentTier = accessData?.tier || 'Starter';

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              Upgrade Required
            </h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>
                This feature requires a <span className="font-semibold capitalize">{requiredTier}</span> tier
                subscription or higher. You are currently on the{' '}
                <span className="capitalize">{currentTier}</span> tier.
              </p>
              {error && (
                <p className="mt-2 text-xs text-red-600">
                  Error checking feature access. Please try again later.
                </p>
              )}
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  // TODO: Navigate to pricing page or billing portal
                  window.location.href = '/pricing';
                }}
              >
                Upgrade to {requiredTier}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Access granted - render children
  return <>{children}</>;
}
