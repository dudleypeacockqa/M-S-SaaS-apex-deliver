import React from 'react';

import type { QuotaSummary } from '../../services/api/podcasts';

interface QuotaWarningProps {
  quota: QuotaSummary;
  threshold?: number;
}

const formatDate = (value: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

const getUsage = (quota: QuotaSummary) => {
  if (quota.isUnlimited || quota.limit === null || quota.limit <= 0) {
    return {
      ratio: 0,
      percent: 0,
    };
  }
  const ratio = Math.min(quota.used / quota.limit, 1);
  return {
    ratio,
    percent: Math.round(ratio * 100),
  };
};

export const QuotaWarning: React.FC<QuotaWarningProps> = ({ quota, threshold = 0.8 }) => {
  if (quota.isUnlimited || quota.limit === null || quota.limit <= 0) {
    return null;
  }

  const { ratio, percent } = getUsage(quota);
  const isWarning = ratio >= threshold;
  const isExceeded = ratio >= 1 || (quota.remaining ?? 0) <= 0 || quota.upgradeRequired;

  if (!isWarning && !isExceeded) {
    return null;
  }

  const resetDate = formatDate(quota.periodEnd);
  const remaining = Math.max(quota.remaining ?? 0, 0);
  const remainingCopy = `${remaining} ${remaining === 1 ? "episode" : "episodes"} remaining`;

  return (
    <aside
      className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
        isExceeded
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-amber-200 bg-amber-50 text-amber-700'
      }`}
      role={isExceeded ? 'alert' : 'status'}
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">
            {isExceeded
              ? 'Quota exhausted'
              : `You have used ${percent}% of your monthly quota`}
          </p>
          <p className="mt-1">
            {isExceeded
              ? 'You have reached your monthly episode allocation.'
              : `You are approaching your monthly limit with ${remainingCopy}.`}
          </p>
          {resetDate && (
            <p className="mt-1 text-xs opacity-80">Resets on {resetDate}.</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-36 overflow-hidden rounded-full bg-white/60">
            <div
              className="rounded-full bg-current"
              style={{ width: `${Math.min(percent, 100)}%` }}
              aria-hidden
            />
          </div>
          <span className="text-xs font-semibold">{percent}%</span>
        </div>
      </div>
      {isExceeded && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {quota.upgradeMessage && (
            <span className="text-xs font-semibold text-current">{quota.upgradeMessage}</span>
          )}
          <a
            className="inline-flex items-center rounded-md bg-white px-3 py-1 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            href={quota.upgradeCtaUrl ?? '/pricing'}
          >
            View upgrade options
          </a>
        </div>
      )}
    </aside>
  );
};

export default QuotaWarning;
