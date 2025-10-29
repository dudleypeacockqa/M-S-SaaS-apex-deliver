/**
 * Matching Workspace - DEV-018 Phase 4 Frontend
 * Intelligent deal matching interface
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchMatchCriteria,
  listDealMatches,
  findMatchesForDeal,
  type MatchCriteria,
  type DealMatch,
} from '../../services/dealMatchingService';

interface MatchingWorkspaceProps {
  dealId?: string;
  activeTab?: 'criteria' | 'matches';
  userTier?: 'starter' | 'professional' | 'growth' | 'premium' | 'enterprise';
}

const MatchingWorkspace: React.FC<MatchingWorkspaceProps> = ({
  dealId,
  activeTab: initialTab = 'criteria',
  userTier = 'professional',
}) => {
  const [activeTab, setActiveTab] = useState<'criteria' | 'matches'>(initialTab);
  const queryClient = useQueryClient();

  // Check tier access
  const hasAccess = userTier !== 'starter';

  // Fetch criteria
  const {
    data: criteria = [],
    isLoading: criteriaLoading,
    error: criteriaError,
  } = useQuery<MatchCriteria[]>({
    queryKey: ['matchCriteria'],
    queryFn: fetchMatchCriteria,
    enabled: hasAccess,
  });

  // Fetch matches for specific deal
  const {
    data: matches = [],
    isLoading: matchesLoading,
    error: matchesError,
  } = useQuery<DealMatch[]>({
    queryKey: ['dealMatches', dealId],
    queryFn: () => listDealMatches(dealId!),
    enabled: hasAccess && activeTab === 'matches' && !!dealId,
  });

  // Find matches mutation
  const findMatchesMutation = useMutation({
    mutationFn: (request: Parameters<typeof findMatchesForDeal>[1]) =>
      findMatchesForDeal(dealId!, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealMatches', dealId] });
    },
  });

  // Upgrade prompt for Starter tier
  if (!hasAccess) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Unlock Deal Matching
        </h2>
        <p className="text-gray-600 mb-6">
          Upgrade to Professional tier or higher to access intelligent deal matching powered by AI.
        </p>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
          Upgrade to Professional
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Starting at £598/month
        </p>
      </div>
    );
  }

  const isLoading = criteriaLoading || matchesLoading;
  const error = criteriaError || matchesError;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading matching data. Please try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Deal Matching</h1>
        <p className="text-sm text-gray-600 mt-1">
          Discover relevant deals using AI-powered matching
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            role="tab"
            aria-selected={activeTab === 'criteria'}
            onClick={() => setActiveTab('criteria')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'criteria'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            Criteria
          </button>
          {dealId && (
            <button
              role="tab"
              aria-selected={activeTab === 'matches'}
              onClick={() => setActiveTab('matches')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'matches'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              Matches
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'criteria' && (
          <div>
            {/* Create button */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Saved Criteria</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                Create Criteria
              </button>
            </div>

            {/* Criteria list */}
            {criteria.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No criteria saved yet. Create your first one!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{criterion.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Type:</span>{' '}
                        {criterion.deal_type === 'buy_side' ? 'Buy Side' : 'Sell Side'}
                      </p>
                      <p>
                        <span className="font-medium">Industries:</span>{' '}
                        {criterion.industries.join(', ')}
                      </p>
                      <p>
                        <span className="font-medium">Size:</span> £
                        {(parseFloat(criterion.min_deal_size) / 1000000).toFixed(1)}M - £
                        {(parseFloat(criterion.max_deal_size) / 1000000).toFixed(1)}M
                      </p>
                      {criterion.geographies && criterion.geographies.length > 0 && (
                        <p>
                          <span className="font-medium">Geography:</span>{' '}
                          {criterion.geographies.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'matches' && dealId && (
          <div>
            {/* Find matches button */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Matches</h2>
              <button
                onClick={() => {
                  if (criteria.length > 0) {
                    findMatchesMutation.mutate({
                      criteria: {
                        deal_type: 'buy_side',
                        industries: criteria[0].industries,
                        min_deal_size: parseFloat(criteria[0].min_deal_size),
                        max_deal_size: parseFloat(criteria[0].max_deal_size),
                        geographies: criteria[0].geographies,
                      },
                      limit: 10,
                      min_score: 40,
                    });
                  }
                }}
                disabled={findMatchesMutation.isPending}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:bg-gray-400"
              >
                {findMatchesMutation.isPending ? 'Finding...' : 'Find Matches'}
              </button>
            </div>

            {/* Matches list */}
            {matches.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No matches found. Try finding matches for this deal.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match) => (
                  <div
                    key={match.deal_id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{match.deal_name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-2xl font-bold text-indigo-600">
                            {match.score.toFixed(1)}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              match.confidence === 'high'
                                ? 'bg-green-100 text-green-800'
                                : match.confidence === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {match.confidence.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Industry Match</span>
                        <span className="font-medium">
                          {(match.explanation.industry_match.score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs">{match.explanation.industry_match.reason}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Size Match</span>
                        <span className="font-medium">
                          {(match.explanation.size_match.score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs">{match.explanation.size_match.reason}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Geography Match</span>
                        <span className="font-medium">
                          {(match.explanation.geography_match.score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs">{match.explanation.geography_match.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingWorkspace;
