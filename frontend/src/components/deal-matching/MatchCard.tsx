import { MatchScoreBadge } from './MatchScoreBadge';

export interface DealMatch {
  id: string;
  dealId: string;
  dealName: string;
  targetCompany: string;
  industry: string;
  score: number;
  confidence: 'high' | 'medium' | 'low';
  explanation: {
    industry: { score: number; reasoning: string };
    size: { score: number; reasoning: string };
    geography: { score: number; reasoning: string };
  };
  status: 'pending' | 'saved' | 'passed';
}

export interface MatchCardProps {
  match: DealMatch;
  onViewDetails: (match: DealMatch) => void;
  onSave: (matchId: string) => void;
  onPass: (matchId: string) => void;
  loading?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onViewDetails,
  onSave,
  onPass,
  loading = false,
}) => {
  const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const topReasoning = match.explanation.industry.reasoning;

  return (
    <div
      data-testid="match-card"
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all"
    >
      {/* Header with Score Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{match.dealName}</h3>
          <p className="text-sm text-gray-600">{match.targetCompany}</p>
        </div>
        <MatchScoreBadge score={match.score} />
      </div>

      {/* Industry */}
      <div className="mb-3">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {match.industry}
        </span>
      </div>

      {/* Match Explanation Preview */}
      <div className="mb-4">
        <p className="text-sm text-gray-700">{truncateText(topReasoning)}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(match)}
          className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          View Details
        </button>
        <button
          onClick={() => onSave(match.id)}
          disabled={loading}
          className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save Match
        </button>
        <button
          onClick={() => onPass(match.id)}
          disabled={loading}
          className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Pass
        </button>
      </div>
    </div>
  );
};
