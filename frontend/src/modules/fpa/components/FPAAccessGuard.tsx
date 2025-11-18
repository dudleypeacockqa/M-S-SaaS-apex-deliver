import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import { useFPAAccess } from '../hooks/useFPAAccess';

interface FPAAccessGuardProps {
  children: React.ReactNode;
}

/**
 * Centralizes FP&A entitlement checks so every dashboard surface
 * honors the backend feature flag before rendering sensitive data.
 */
export const FPAAccessGuard: React.FC<FPAAccessGuardProps> = ({ children }) => {
  const {
    hasAccess,
    isLoading,
    error,
    upgradeMessage,
    upgradeCtaUrl,
    requiredTier,
  } = useFPAAccess();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Checking FP&A access...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="max-w-lg bg-red-50 border border-red-200 text-red-800 rounded-lg p-6">
          <p className="font-semibold mb-2">Unable to verify access</p>
          <p className="text-sm mb-4">{error.message || 'Please try again or contact support.'}</p>
          <p className="text-xs text-red-600">Error surfaced by FP&A guard.</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="max-w-lg bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">CapLiquify FP&A Access Required</h2>
          <p className="text-gray-600 text-sm mb-4">
            {upgradeMessage ||
              `Upgrade to the ${requiredTier || 'Professional'} tier to unlock production tracking, demand forecasting, and working capital automation.`}
          </p>
          <Link
            to={upgradeCtaUrl || '/pricing'}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View pricing
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
