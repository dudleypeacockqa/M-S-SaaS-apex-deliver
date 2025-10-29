import { MatchScoreBadge } from './MatchScoreBadge'
import { SaveMatchButton } from './SaveMatchButton'
import { PassMatchButton } from './PassMatchButton'

import type { DealMatch } from '../../services/dealMatchingService'

export interface MatchCardProps {
  match: DealMatch
  onViewDetails: (match: DealMatch) => void
  onSave?: (matchId: string) => void
  onPass?: (matchId: string) => void
  loading?: boolean
}

const truncate = (text: string | undefined, limit = 140) => {
  if (!text) return 'No explanation available.'
  return text.length <= limit ? text : `${text.slice(0, limit)}...`
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onViewDetails,
  onSave,
  onPass,
  loading = false,
}) => {
  const explanation = match.explanation || {
    industry_match: { score: 0, reason: 'No data provided.' },
    size_match: { score: 0, reason: 'No data provided.' },
    geography_match: { score: 0, reason: 'No data provided.' },
    description_match: { score: 0, reason: 'No data provided.' },
  }

  const industryReason =
    explanation.industry_match?.reason ||
    explanation.description_match?.reason ||
    'No explanation available.'

  return (
    <div
      data-testid="match-card"
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{match.dealName}</h3>
          {match.matchedDealId && (
            <p className="text-sm text-gray-600">Deal ID: {match.matchedDealId}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <MatchScoreBadge score={match.score} />
          {match.confidence && (
            <span className="text-xs text-gray-500" data-testid="confidence-label">
              Confidence: weighted criteria summary
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700" data-testid="match-reason">
          {truncate(industryReason)}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(match)}
          className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          View Details
        </button>
        {onSave && (
          <SaveMatchButton
            onClick={() => onSave(match.id ?? match.dealId)}
            loading={loading}
            className="flex-1"
          />
        )}
        {onPass && (
          <PassMatchButton
            onClick={() => onPass(match.id ?? match.dealId)}
            loading={loading}
            className="flex-1"
          />
        )}
      </div>
    </div>
  )
}
