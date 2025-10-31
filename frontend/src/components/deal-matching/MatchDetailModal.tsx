/**
 * MatchDetailModal Component
 * Displays full match details with explanation breakdown and action buttons
 */

import React from 'react';
import type { DealMatch } from '../../services/dealMatchingService';
import { MatchScoreBadge } from './MatchScoreBadge';

export interface MatchDetailModalProps {
  match: DealMatch | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (matchId: string) => void;
  onPass: (matchId: string) => void;
  onRequestIntro: (matchId: string) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  isOpen,
  onClose,
  onSave,
  onPass,
  onRequestIntro,
}) => {
  if (!isOpen || !match) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatPercentage = (score: number): string => {
    return `${Math.round(score * 100)}%`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
              {match.dealName}
            </h2>
            {match.matchedDealId && (
              <p className="text-sm text-gray-600 mt-1">Deal ID: {match.matchedDealId}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <MatchScoreBadge score={match.score} />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Confidence Badge */}
        {match.confidence && (
          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                match.confidence === 'high'
                  ? 'bg-green-100 text-green-800'
                  : match.confidence === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Confidence: {match.confidence.charAt(0).toUpperCase() + match.confidence.slice(1)}
            </span>
          </div>
        )}

        {/* Match Explanation Breakdown */}
        <div className="space-y-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Match Breakdown</h3>

          {/* Industry Match */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Industry Match</span>
              <span className="text-lg font-bold text-indigo-600">
                {formatPercentage(match.explanation.industry_match.score)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all"
                style={{ width: formatPercentage(match.explanation.industry_match.score) }}
              />
            </div>
            <p className="text-sm text-gray-600">{match.explanation.industry_match.reason}</p>
          </div>

          {/* Size Match */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Size Match</span>
              <span className="text-lg font-bold text-indigo-600">
                {formatPercentage(match.explanation.size_match.score)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all"
                style={{ width: formatPercentage(match.explanation.size_match.score) }}
              />
            </div>
            <p className="text-sm text-gray-600">{match.explanation.size_match.reason}</p>
          </div>

          {/* Geography Match */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Geography Match</span>
              <span className="text-lg font-bold text-indigo-600">
                {formatPercentage(match.explanation.geography_match.score)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all"
                style={{ width: formatPercentage(match.explanation.geography_match.score) }}
              />
            </div>
            <p className="text-sm text-gray-600">{match.explanation.geography_match.reason}</p>
          </div>

          {/* Description Match */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Description Match</span>
              <span className="text-lg font-bold text-indigo-600">
                {formatPercentage(match.explanation.description_match.score)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all"
                style={{ width: formatPercentage(match.explanation.description_match.score) }}
              />
            </div>
            <p className="text-sm text-gray-600">{match.explanation.description_match.reason}</p>
          </div>
        </div>

        {/* Match Metadata */}
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Status:</span>{' '}
              <span className="font-medium text-gray-900">{match.status || 'pending'}</span>
            </div>
            <div>
              <span className="text-gray-600">Created:</span>{' '}
              <span className="font-medium text-gray-900">{formatDate(match.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 border-t border-gray-200 pt-6">
          <button
            onClick={() => match.id && onSave(match.id)}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
          >
            Save Match
          </button>
          <button
            onClick={() => match.id && onRequestIntro(match.id)}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
            data-testid="request-intro-button"
          >
            Request Introduction
          </button>
          <button
            onClick={() => match.id && onPass(match.id)}
            className="px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Pass
          </button>
        </div>
      </div>
    </div>
  );
};
