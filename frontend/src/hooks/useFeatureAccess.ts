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

export interface FeatureAccessState {
  feature: string;
  hasAccess: boolean;
  tier: string;
  tierLabel: string;
  requiredTier: string | null;
  requiredTierLabel: string | null;
  upgradeRequired: boolean;
  upgradeMessage: string | null;
  upgradeCtaUrl: string | null;
  isLoading: boolean;
  isFetched: boolean;
  error: unknown;
}

export const featureQueryKey = (feature: string) => ['feature-access', feature] as const;

export const useFeatureAccess = ({ feature, enabled = true }: FeatureAccessOptions): FeatureAccessState => {
  const query = useQuery<FeatureAccessResponse>({
    queryKey: featureQueryKey(feature),
    enabled,
    staleTime: 5 * 60 * 1000,
    queryFn: () => checkFeatureAccess(feature),
  });

  if (process.env.NODE_ENV === 'test') {
    console.log('useFeatureAccess result', feature, query.data);
  }

  return useMemo<FeatureAccessState>(
    () => ({
      feature,
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
    [feature, query.data, query.error, query.isFetched, query.isLoading],
  );
};
