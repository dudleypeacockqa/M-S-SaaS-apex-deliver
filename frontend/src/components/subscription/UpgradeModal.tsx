import React from 'react';

import type { SubscriptionTier } from '../../hooks/useSubscriptionTier';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  requiredTier: SubscriptionTier;
  feature: string;
  ctaUrl?: string | null;
}

const PLAN_SUMMARY: Array<{
  tier: SubscriptionTier;
  name: string;
  price: string;
  highlight: string;
  perks: string[];
}> = [
  {
    tier: 'professional',
    name: 'Professional',
    price: '£598/mo',
    highlight: 'Audio studio with 10 episodes per month.',
    perks: ['Advanced editing workflows', 'Audience analytics dashboard', 'Priority support'],
  },
  {
    tier: 'premium',
    name: 'Premium',
    price: '£1,598/mo',
    highlight: 'Includes video production, YouTube publishing and unlimited episodes.',
    perks: ['4K video uploads', 'One-click YouTube publishing', 'AI-assisted transcripts', 'Unlimited episodes'],
  },
  {
    tier: 'enterprise',
    name: 'Enterprise',
    price: '£2,997/mo',
    highlight: 'Live streaming, multi-language transcripts and dedicated success team.',
    perks: ['Live investor broadcasts', 'Multi-language transcription', 'White-glove onboarding'],
  },
];

const tierRank: Record<SubscriptionTier, number> = {
  starter: 0,
  professional: 1,
  premium: 2,
  enterprise: 3,
};

const toTitle = (tier: SubscriptionTier) => tier.charAt(0).toUpperCase() + tier.slice(1);

export function UpgradeModal({ isOpen, onClose, currentTier, requiredTier, feature, ctaUrl }: UpgradeModalProps) {
  if (!isOpen) {
    return null;
  }

  const pricingUrl = ctaUrl ?? '/pricing';
  const targetLabel = toTitle(requiredTier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Compare subscription tiers"
        className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-transparent bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
          aria-label="Close upgrade modal"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <div className="px-8 pb-8 pt-10">
          <h2 className="text-2xl font-semibold text-gray-900">Compare subscription tiers</h2>
          <p className="mt-2 text-sm text-gray-600">
            Unlock <span className="font-medium text-gray-900">{feature.replace('_', ' ')}</span> by upgrading to the {targetLabel} plan.
            Choose the tier that aligns with your production goals.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {PLAN_SUMMARY.map((plan) => {
              const isCurrent = plan.tier === currentTier;
              const isRecommended = plan.tier === requiredTier;

              const cardClasses = [
                'rounded-xl',
                'border',
                'p-4',
                'text-left',
                'transition-all',
                isRecommended ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-gray-200',
                isCurrent ? 'bg-gray-50' : 'bg-white',
              ].join(' ');

              return (
                <div key={plan.tier} className={cardClasses}>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {plan.name} {plan.price}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{plan.highlight}</p>

                  <ul className="mt-4 space-y-1 text-sm text-gray-600">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrent && (
                    <span className="mt-4 inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                      Current plan
                    </span>
                  )}

                  {isRecommended && !isCurrent && (
                    <span className="mt-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                      Recommended
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-600">
              Switching from <span className="font-medium text-gray-900">{toTitle(currentTier)}</span> to <span className="font-medium text-gray-900">{targetLabel}</span> adds all features in between.
            </p>
            <a
              href={pricingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Review pricing &amp; upgrade
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export const compareTiers = (current: SubscriptionTier, target: SubscriptionTier) => {
  return tierRank[current] - tierRank[target];
};
