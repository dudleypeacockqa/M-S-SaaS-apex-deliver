import React from 'react';

interface MatchingActivityItem {
  id: string;
  timestamp: string;
  label: string;
  status: string;
}

interface MatchingActivityProps {
  events: MatchingActivityItem[];
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown time';
  }
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const MatchingActivity: React.FC<MatchingActivityProps> = ({ events }) => (
  <div className="rounded-lg border border-gray-200 p-4" data-testid="matching-activity">
    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Matching Activity</h4>
    {events.length === 0 ? (
      <p className="mt-3 text-sm text-gray-500">Activity will appear here once matches are actioned.</p>
    ) : (
      <ol className="mt-4 space-y-3 text-sm text-gray-600">
        {events.map((event) => (
          <li key={event.id} className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" aria-hidden="true" />
            <div>
              <p className="font-medium text-gray-900">{event.label}</p>
              <p className="text-xs text-gray-500">{event.status}</p>
              <p className="text-xs text-gray-400">{formatTimestamp(event.timestamp)}</p>
            </div>
          </li>
        ))}
      </ol>
    )}
  </div>
);
