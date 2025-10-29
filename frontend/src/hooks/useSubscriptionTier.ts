import { useMemo } from 'react';
import { useOrganization, useUser } from '@clerk/clerk-react';

export type SubscriptionTier = 'starter' | 'professional' | 'premium' | 'enterprise';

interface SubscriptionTierState {
  tier: SubscriptionTier;
  label: string;
  isLoading: boolean;
  isLoaded: boolean;
  error: unknown;
  hasOrganization: boolean;
  isAtLeast: (required: SubscriptionTier) => boolean;
  requiresUpgrade: (required: SubscriptionTier) => boolean;
}

const TIER_LABELS: Record<SubscriptionTier, string> = {
  starter: 'Starter',
  professional: 'Professional',
  premium: 'Premium',
  enterprise: 'Enterprise',
};

const RANK: Record<SubscriptionTier, number> = {
  starter: 0,
  professional: 1,
  premium: 2,
  enterprise: 3,
};

const normalizeTier = (value: unknown): SubscriptionTier => {
  if (typeof value !== 'string') {
    return 'starter';
  }

  const normalized = value.toLowerCase() as SubscriptionTier;
  return normalized in RANK ? normalized : 'starter';
};

const toLabel = (tier: SubscriptionTier) => TIER_LABELS[tier] ?? 'Starter';

const makeComparator = (current: SubscriptionTier) => ({
  isAtLeast: (required: SubscriptionTier) => RANK[current] >= RANK[required],
  requiresUpgrade: (required: SubscriptionTier) => RANK[current] < RANK[required],
});

export const useSubscriptionTier = (): SubscriptionTierState => {
  const { organization, isLoaded: isOrganizationLoaded } = useOrganization();
  const { user, isLoaded: isUserLoaded } = useUser();

  const isLoaded = isOrganizationLoaded && isUserLoaded;
  const isLoading = !isLoaded;

  const organizationTier = organization?.publicMetadata?.subscription_tier ?? organization?.publicMetadata?.subscriptionTier;
  const userTier = user?.publicMetadata?.subscription_tier ?? user?.publicMetadata?.subscriptionTier;

  const tier = normalizeTier(organizationTier ?? userTier);
  const label = toLabel(tier);
  const hasOrganization = Boolean(organization);

  return useMemo<SubscriptionTierState>(() => {
    const comparators = makeComparator(tier);

    return {
      tier,
      label,
      isLoading,
      isLoaded,
      error: null,
      hasOrganization,
      isAtLeast: comparators.isAtLeast,
      requiresUpgrade: comparators.requiresUpgrade,
    };
  }, [hasOrganization, isLoaded, isLoading, label, tier]);
};
