import React from 'react';

interface MatchScoreDistributionProps {
  distribution: {
    high: number;
    medium: number;
    low: number;
  };
  total: number;
}

const BAR_COLORS = {
  high: 'bg-emerald-500',
  medium: 'bg-amber-500',
  low: 'bg-rose-500',
};

export const MatchScoreDistribution: React.FC<MatchScoreDistributionProps> = ({ distribution, total }) => {
  if (total === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-4" data-testid="score-distribution-empty">
        <p className="text-sm text-gray-500">No matches available to calculate score distribution.</p>
      </div>
    );
  }

  const buckets: Array<{ label: string; value: number; key: keyof typeof distribution }> = [
    { label: 'High (≥80)', value: distribution.high, key: 'high' },
    { label: 'Medium (60-79)', value: distribution.medium, key: 'medium' },
    { label: 'Low (<60)', value: distribution.low, key: 'low' },
  ];

  return (
    <div className="rounded-lg border border-gray-200 p-4" data-testid="score-distribution">
      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Score Distribution</h4>
      <div className="space-y-3">
        {buckets.map((bucket) => {
          const percentage = total === 0 ? 0 : Math.round((bucket.value / total) * 100);
          const width = bucket.value === 0 ? 0 : Math.max(percentage, 6);
          return (
            <div key={bucket.key}>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{bucket.label}</span>
                <span>{bucket.value}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-gray-100">
                <div
                  className={`${BAR_COLORS[bucket.key]} h-2 rounded-full transition-all`}
                  style={{ width: `${width}%` }}
                  role="presentation"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
