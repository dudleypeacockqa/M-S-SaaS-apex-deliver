import { useFeatureAccess } from '../../../hooks/useFeatureAccess'

/**
 * Hook to check PMI module access
 */
export function usePMIAccess() {
  const access = useFeatureAccess({ feature: 'pmi_module' })

  return {
    hasAccess: access.hasAccess,
    isLoading: access.isLoading,
    error: access.error,
    requiredTier: access.requiredTier,
    upgradeMessage: access.upgradeMessage,
    upgradeCtaUrl: access.upgradeCtaUrl ?? '/pricing',
  }
}

