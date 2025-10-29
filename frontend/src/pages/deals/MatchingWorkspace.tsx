/**
 * Matching Workspace - DEV-018 Phase 4 Frontend
 * Intelligent deal matching interface
 */

import React, { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchMatchCriteria,
  listDealMatches,
  findMatchesForDeal,
  recordMatchAction,
  type MatchCriteria,
  type DealMatch,
} from '../../services/dealMatchingService';
import { MatchCard } from '../../components/deal-matching/MatchCard';
import { MatchDetailModal } from '../../components/deal-matching/MatchDetailModal';

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
  const [selectedMatch, setSelectedMatch] = useState<DealMatch | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const criteriaTabRef = useRef<HTMLButtonElement | null>(null);
  const matchesTabRef = useRef<HTMLButtonElement | null>(null);
  const queryClient = useQueryClient();

  const hasAccess = userTier !== 'starter';

  const {
    data: criteria = [],
    isLoading: criteriaLoading,
    error: criteriaError,
  } = useQuery<MatchCriteria[]>({
    queryKey: ['matchCriteria'],
    queryFn: fetchMatchCriteria,
    enabled: hasAccess,
  });

  const {
    data: matches = [],
    isLoading: matchesLoading,
    error: matchesError,
  } = useQuery<DealMatch[]>({
    queryKey: ['dealMatches', dealId],
    queryFn: () => listDealMatches(dealId!),
    enabled: hasAccess && activeTab === 'matches' && !!dealId,
  });

  const findMatchesMutation = useMutation({
    mutationFn: (request: Parameters<typeof findMatchesForDeal>[1]) =>
      findMatchesForDeal(dealId!, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealMatches', dealId] });
    },
  });

  const saveMatchMutation = useMutation({
    mutationFn: (matchId: string) =>
      recordMatchAction(matchId, { action: 'save', metadata: {} }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealMatches', dealId] });
    },
  });

  const passMatchMutation = useMutation({
    mutationFn: (matchId: string) =>
      recordMatchAction(matchId, { action: 'pass', metadata: {} }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealMatches', dealId] });
    },
  });

  const handleViewDetails = (match: DealMatch) => {
    // Record view action
    if (match.id) {
      recordMatchAction(match.id, { action: 'view', metadata: {} });
    }
    setSelectedMatch(match);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedMatch(null);
  };

  const handleSaveMatch = (matchId: string) => {
    saveMatchMutation.mutate(matchId);
  };

  const handlePassMatch = (matchId: string) => {
    passMatchMutation.mutate(matchId);
    if (isDetailModalOpen) {
      handleCloseDetailModal();
    }
  };

  const handleRequestIntro = (matchId: string) => {
    // TODO: Phase 4 - Open IntroductionRequestModal
    // For now, just record the action directly
    recordMatchAction(matchId, {
      action: 'request_intro',
      metadata: { message: 'Introduction request sent' }
    });
    queryClient.invalidateQueries({ queryKey: ['dealMatches', dealId] });
    if (isDetailModalOpen) {
      handleCloseDetailModal();
    }
  };

  if (!hasAccess) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Unlock Deal Matching</h2>
        <p className="text-gray-600 mb-6">
          Upgrade to Professional tier or higher to access intelligent deal matching powered by AI.
        </p>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
          Upgrade to Professional
        </button>
        <p className="text-sm text-gray-500 mt-4">Starting at £598/month</p>
      </div>
    );
  }

  const error = criteriaError || matchesError;
  const isInitialLoading = criteriaLoading && activeTab === 'criteria';
  const showMatchesLoader = matchesLoading || criteriaLoading;
  const canFindMatches = criteria.length > 0;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading matching data. Please try again.</p>
      </div>
    );
  }

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Deal Matching</h1>
        <p className="text-sm text-gray-600 mt-1">
          Discover relevant deals using AI-powered matching
        </p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            ref={criteriaTabRef}
            role="tab"
            aria-selected={activeTab === 'criteria'}
            onClick={() => setActiveTab('criteria')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'criteria'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
            }`}
            data-testid="criteria-tab"
          >
            Criteria
          </button>
          {dealId && (
            <button
              ref={matchesTabRef}
              role="tab"
              aria-selected={activeTab === 'matches'}
              onClick={() => setActiveTab('matches')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'matches'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
              data-testid="matches-tab"
            >
              Matches
            </button>
          )}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'criteria' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Saved Criteria</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                Create Criteria
              </button>
            </div>

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
                        <span className="font-medium">Size:</span>{' '}
                        £{(parseFloat(criterion.min_deal_size) / 1_000_000).toFixed(1)}M - £
                        {(parseFloat(criterion.max_deal_size) / 1_000_000).toFixed(1)}M
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
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Matches</h2>
              {canFindMatches ? (
                <button
                  onClick={() => {
                    if (criteria.length > 0) {
                      findMatchesMutation.mutate({
                        criteria_id: criteria[0].id,
                        top_n: 10,
                        min_score: 40,
                      });
                    }
                  }}
                  disabled={findMatchesMutation.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:bg-gray-400"
                >
                  {findMatchesMutation.isPending ? 'Finding...' : 'Find Matches'}
                </button>
              ) : (
                !showMatchesLoader && (
                  <div className="text-sm text-gray-500">
                    Save match criteria to enable matching.
                  </div>
                )
              )}
            </div>

            {showMatchesLoader ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Loading matches...</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No matches found. Try finding matches for this deal.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match) => (
                  <MatchCard
                    key={`${match.dealId}-${match.matchedDealId ?? match.id ?? 'calculated'}`}
                    match={match}
                    onViewDetails={handleViewDetails}
                    onSave={handleSaveMatch}
                    onPass={handlePassMatch}
                    loading={saveMatchMutation.isPending || passMatchMutation.isPending}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Match Detail Modal */}
      <MatchDetailModal
        match={selectedMatch}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onSave={handleSaveMatch}
        onPass={handlePassMatch}
        onRequestIntro={handleRequestIntro}
      />
    </div>
  );
};

export default MatchingWorkspace;
