import React from 'react';

interface RecentMatchItem {
  id: string;
  name: string;
  score: number;
  status?: string;
}

interface RecentMatchesProps {
  matches: RecentMatchItem[];
}

const statusLabel = (status?: string) => {
  if (!status) return 'new';
  switch (status.toLowerCase()) {
    case 'saved':
      return 'saved';
    case 'intro_requested':
      return 'intro';
    case 'passed':
    case 'pass':
      return 'passed';
    default:
      return status.toLowerCase();
  }
};

export const RecentMatches: React.FC<RecentMatchesProps> = ({ matches }) => (
  <div className="rounded-lg border border-gray-200 p-4" data-testid="recent-matches">
    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Recent Matches</h4>
    {matches.length === 0 ? (
      <p className="mt-3 text-sm text-gray-500">No recent matches available.</p>
    ) : (
      <ul className="mt-3 space-y-3">
        {matches.map((match) => (
          <li key={match.id} className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium text-gray-900">{match.name}</p>
              <p className="text-xs text-gray-500">Status: {statusLabel(match.status)}</p>
            </div>
            <span className="inline-flex items-center justify-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
              {Math.round(match.score)}%
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);
