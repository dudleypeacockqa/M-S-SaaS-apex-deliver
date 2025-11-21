import { useFeatureAccess } from '../../../hooks/useFeatureAccess';

/**
 * Hook to check if user has access to FP&A module
 * FP&A module is available to:
 * - CapLiquify FP&A tier (fpa_subscriber)
 * - Professional tier and above
 */
export function useFPAAccess() {
  const access = useFeatureAccess({ feature: 'fpa_module' });
  
  return {
    hasAccess: access.hasAccess,
    isLoading: access.isLoading,
    error: access.error,
    requiredTier: access.requiredTier,
    upgradeMessage: access.upgradeMessage,
    upgradeCtaUrl: access.upgradeCtaUrl || '/pricing',
  };
}

