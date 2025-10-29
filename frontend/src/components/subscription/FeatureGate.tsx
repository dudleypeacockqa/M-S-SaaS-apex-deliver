import React, { useState } from 'react';

import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import { useSubscriptionTier, type SubscriptionTier } from '../../hooks/useSubscriptionTier';
import { UpgradeModal } from './UpgradeModal';

interface FeatureGateProps {
  feature: string;
  requiredTier?: SubscriptionTier;
  upgradeMessage?: string | null;
  lockedTitle?: string | null;
  lockedDescription?: string | null;
  ctaLabel?: string | null;
  children: React.ReactNode;
}

const normalizeTier = (tier: string | null | undefined): SubscriptionTier => {
  switch ((tier ?? '').toLowerCase()) {
    case 'professional':
      return 'professional';
    case 'premium':
      return 'premium';
    case 'enterprise':
      return 'enterprise';
    default:
      return 'starter';
  }
};

const defaultUpgradeMessage = (required: SubscriptionTier, feature: string) => {
  const requiredLabel = required.charAt(0).toUpperCase() + required.slice(1);
  const featureName = feature.replace(/_/g, ' ');
  return requiredLabel + ' unlocks ' + featureName + '.';
};

const featureTitle = (feature: string) => feature.replace(/_/g, ' ');

export function FeatureGate({
  feature,
  requiredTier,
  upgradeMessage,
  lockedTitle,
  lockedDescription,
  ctaLabel,
  children,
}: FeatureGateProps) {
  const access = useFeatureAccess({ feature });
  const subscription = useSubscriptionTier();
  const [showModal, setShowModal] = useState(false);

  const resolvedRequiredTier: SubscriptionTier = requiredTier
    ? requiredTier
    : normalizeTier(access.requiredTier ?? access.requiredTierLabel ?? 'professional');

  const hasAccessError = Boolean(access.error);
  const hasAccess = access.hasAccess && !hasAccessError;
  const canRenderChildren = hasAccess || subscription.isAtLeast(resolvedRequiredTier);

  if (access.isLoading || subscription.isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 p-6">
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-400" aria-label="Loading feature access" />
        <span className="ml-3 text-sm text-gray-500">Checking feature access…</span>
      </div>
    );
  }

  if (canRenderChildren) {
    return <>{children}</>;
  }

  const currentTierLabel = subscription.label;
  const requiredTierLabel = (access.requiredTierLabel ?? resolvedRequiredTier.charAt(0).toUpperCase() + resolvedRequiredTier.slice(1));
  const message = upgradeMessage ?? access.upgradeMessage ?? defaultUpgradeMessage(resolvedRequiredTier, feature);
  const headline = lockedTitle ?? 'Upgrade Required';
  const description = lockedDescription ?? 'This feature is gated by your current subscription tier.';
  const buttonLabel = ctaLabel ?? ('Upgrade to ' + requiredTierLabel);
  const ctaUrl = access.upgradeCtaUrl ?? '/pricing';

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{headline}</h3>
          <p className="mt-1 text-sm text-gray-700">{description}</p>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
          <p className="mt-2 text-xs text-gray-500">
            Current tier: <span className="font-medium">{currentTierLabel}</span> · Required tier: <span className="font-medium">{requiredTierLabel}</span>
          </p>
          {hasAccessError ? (
            <p className="mt-2 text-xs text-red-600">We could not verify access at this time. Defaulting to a secure deny.</p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setShowModal(true)}
            >
              {buttonLabel}
            </button>
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View pricing
            </a>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        currentTier={subscription.tier}
        requiredTier={resolvedRequiredTier}
        feature={featureTitle(feature)}
        ctaUrl={ctaUrl}
      />
    </div>
  );
}
