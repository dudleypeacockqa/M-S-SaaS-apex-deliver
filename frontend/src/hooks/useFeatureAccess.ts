import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
  checkFeatureAccess,
  type FeatureAccessResponse,
} from '../services/api/podcasts';

export interface FeatureAccessOptions {
  feature: string;
  enabled?: boolean;
}

export const featureQueryKey = (feature: string) => ['feature-access', feature] as const;

export const useFeatureAccess = ({ feature, enabled = true }: FeatureAccessOptions) => {
  const query = useQuery<FeatureAccessResponse>({
    queryKey: featureQueryKey(feature),
    enabled,
    staleTime: 5 * 60 * 1000,
    queryFn: () => checkFeatureAccess(feature),
  });

  return useMemo(
    () => ({
      hasAccess: query.data?.hasAccess ?? false,
      tier: query.data?.tier ?? 'starter',
      tierLabel: query.data?.tierLabel ?? query.data?.tier ?? 'Starter',
      requiredTier: query.data?.requiredTier ?? null,
      requiredTierLabel: query.data?.requiredTierLabel ?? query.data?.requiredTier ?? null,
      upgradeRequired: query.data?.upgradeRequired ?? false,
      upgradeMessage: query.data?.upgradeMessage ?? null,
      upgradeCtaUrl: query.data?.upgradeCtaUrl ?? null,
      isLoading: query.isLoading,
      isFetched: query.isFetched,
      error: query.error,
    }),
    [query.data, query.error, query.isFetched, query.isLoading],
  );
};
