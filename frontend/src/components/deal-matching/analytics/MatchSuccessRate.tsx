import React from 'react';

interface MatchSuccessRateProps {
  successRate: number;
  total: number;
  successCount: number;
  trendDelta?: number;
}

const getTrendLabel = (trendDelta?: number) => {
  if (trendDelta == null) {
    return 'No prior data';
  }
  if (trendDelta > 0) {
    return `Up ${trendDelta}% week-on-week`;
  }
  if (trendDelta < 0) {
    return `Down ${Math.abs(trendDelta)}% week-on-week`;
  }
  return 'Flat week-on-week';
};

export const MatchSuccessRate: React.FC<MatchSuccessRateProps> = ({ successRate, total, successCount, trendDelta }) => {
  const boundedRate = Math.max(0, Math.min(successRate, 100));

  return (
    <div className="rounded-lg border border-gray-200 p-4" data-testid="match-success-rate">
      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Success Rate</h4>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-emerald-600">{boundedRate}%</p>
          <p className="text-xs text-gray-500">{successCount} of {total} matches saved or intro requested</p>
        </div>
        <div className="w-20 h-20 rounded-full border-4 border-emerald-100 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <span className="text-lg font-semibold text-emerald-700">{boundedRate}%</span>
          </div>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-emerald-100" role="presentation">
        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${boundedRate}%` }} />
      </div>
      <p className="mt-2 text-xs text-gray-500">{getTrendLabel(trendDelta)}</p>
    </div>
  );
};
