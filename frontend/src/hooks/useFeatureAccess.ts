import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { api } from '../services/api';

export interface FeatureAccessResponse {
  hasAccess: boolean;
  tier: string;
  requiredTier?: string;
}

export interface FeatureAccessOptions {
  feature: string;
  enabled?: boolean;
}

export const featureQueryKey = (feature: string) => ['feature-access', feature] as const;

export const useFeatureAccess = ({ feature, enabled = true }: FeatureAccessOptions) => {
  const query = useQuery<FeatureAccessResponse>({
    queryKey: featureQueryKey(feature),
    enabled,
    queryFn: async () => {
      const response = await api.get(`/podcasts/features/${feature}`);
      return response.data as FeatureAccessResponse;
    },
  });

  return useMemo(
    () => ({
      hasAccess: query.data?.hasAccess ?? false,
      tier: query.data?.tier ?? 'starter',
      requiredTier: query.data?.requiredTier ?? null,
      isLoading: query.isLoading,
      isFetched: query.isFetched,
      error: query.error,
    }),
    [query.data, query.error, query.isFetched, query.isLoading],
  );
};
