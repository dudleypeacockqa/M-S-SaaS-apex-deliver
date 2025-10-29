/**
 * Matching Workspace - DEV-018 Phase 4 Frontend
 * Intelligent deal matching interface
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { CriteriaBuilderModal } from '../../components/deal-matching/CriteriaBuilderModal';
import { IntroductionRequestModal } from '../../components/deal-matching/IntroductionRequestModal';

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
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const criteriaTabRef = useRef<HTMLButtonElement | null>(null);
  const matchesTabRef = useRef<HTMLButtonElement | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setActiveTab((previous) => (previous === initialTab ? previous : initialTab));
  }, [initialTab]);

  useEffect(() => {
    if (!dealId && activeTab === 'matches') {
      setActiveTab('criteria');
    }
  }, [dealId, activeTab]);


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
      recordMatchAction(matchId, { action: 'save', metadata: { source: 'matching_workspace' } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealMatches', dealId] });
    },
  });

  const passMatchMutation = useMutation({
    mutationFn: (matchId: string) =>
      recordMatchAction(matchId, { action: 'pass', metadata: { source: 'matching_workspace' } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealMatches', dealId] });
    },
  });

  const viewMatchMutation = useMutation({
    mutationFn: (matchId: string) =>
      recordMatchAction(matchId, { action: 'view', metadata: { source: 'matching_workspace' } }),
  });

  const handleViewDetails = (match: DealMatch) => {
    if (match.id) {
      viewMatchMutation.mutate(match.id);
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
    const match = matches?.find((item) => item.id === matchId) ?? selectedMatch;
    if (match) {
      setSelectedMatch(match);
      setIsIntroModalOpen(true);
      if (isDetailModalOpen) {
        setIsDetailModalOpen(false);
      }
    }
  };

  const handleCloseIntroModal = () => {
    setIsIntroModalOpen(false);
  };

  const handleIntroSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['dealMatches', dealId] });
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
  const isMatchesTab = activeTab === 'matches';
  const isInitialLoading = criteriaLoading && activeTab === 'criteria';
  const showMatchesLoader = isMatchesTab && (matchesLoading || findMatchesMutation.isPending);
  const canFindMatches = criteria.length > 0;

  const matchAnalytics = useMemo(() => {
    if (!matches || matches.length === 0) {
      return null;
    }

    const total = matches.length;
    const totalScore = matches.reduce((sum, match) => {
      const numericScore = typeof match.score === 'number' ? match.score : Number(match.score);
      return sum + (Number.isFinite(numericScore) ? numericScore : 0);
    }, 0);

    const averageScore = total > 0 ? Math.round(totalScore / total) : 0;

    const distribution = {
      high: matches.filter((match) => match.score >= 80).length,
      medium: matches.filter((match) => match.score >= 60 && match.score < 80).length,
      low: matches.filter((match) => match.score < 60).length,
    };

    const normaliseStatus = (status?: string) => (status ? status.toLowerCase() : '');
    const successStatuses = new Set(['saved', 'intro_requested', 'accepted', 'won', 'converted', 'intro_completed']);
    const introStatuses = new Set(['intro_requested', 'intro_completed']);

    const successCount = matches.filter((match) => successStatuses.has(normaliseStatus(match.status))).length;
    const introCount = matches.filter((match) => introStatuses.has(normaliseStatus(match.status))).length;

    const successRate = total ? Math.round((successCount / total) * 100) : 0;

    return {
      total,
      averageScore: Number.isFinite(averageScore) ? averageScore : 0,
      distribution,
      successRate,
      introCount,
    };
  }, [matches]);

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
              <button
                onClick={() => setIsCriteriaModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
              >
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

            {matchAnalytics && !showMatchesLoader && (
              <section
                aria-label="Match analytics"
                className="mb-6 rounded-lg border border-gray-200 bg-white/60 p-4 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Analytics Overview
                </h3>
                <div className="mt-3 grid gap-4 md:grid-cols-3">
                  <div
                    className="rounded-lg border border-indigo-200 bg-indigo-50 p-4"
                    data-testid="analytics-average"
                  >
                    <p className="text-xs font-medium text-indigo-700 uppercase tracking-wide">
                      Average Match Score
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-indigo-900">
                      {matchAnalytics.averageScore}%
                    </p>
                    <p className="mt-1 text-xs text-indigo-600">
                      Across {matchAnalytics.total} matches
                    </p>
                  </div>
                  <div
                    className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"
                    data-testid="analytics-success-rate"
                  >
                    <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                      Success Rate
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-emerald-900">
                      {matchAnalytics.successRate}%
                    </p>
                    <p className="mt-1 text-xs text-emerald-600">
                      Saved or intro requested
                    </p>
                  </div>
                  <div
                    className="rounded-lg border border-blue-200 bg-blue-50 p-4"
                    data-testid="analytics-intro-count"
                  >
                    <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                      Intro Requests
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-blue-900">
                      {matchAnalytics.introCount}
                    </p>
                    <p className="mt-1 text-xs text-blue-600">
                      Awaiting responses
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div
                    className="rounded-md border border-gray-200 p-3"
                    data-testid="analytics-distribution-high"
                  >
                    <p className="text-sm font-medium text-gray-700">
                      {`High (>=80): ${matchAnalytics.distribution.high}`}
                    </p>
                  </div>
                  <div
                    className="rounded-md border border-gray-200 p-3"
                    data-testid="analytics-distribution-medium"
                  >
                    <p className="text-sm font-medium text-gray-700">
                      {`Medium (60-79): ${matchAnalytics.distribution.medium}`}
                    </p>
                  </div>
                  <div
                    className="rounded-md border border-gray-200 p-3"
                    data-testid="analytics-distribution-low"
                  >
                    <p className="text-sm font-medium text-gray-700">
                      {`Low (<60): ${matchAnalytics.distribution.low}`}
                    </p>
                  </div>
                </div>
              </section>
            )}

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

      {/* Criteria Builder Modal */}
      <CriteriaBuilderModal
        isOpen={isCriteriaModalOpen}
        onClose={() => setIsCriteriaModalOpen(false)}
        onSuccess={() => {
          setIsCriteriaModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ['matchCriteria'] });
        }}
      />

      {/* Introduction Request Modal */}
      <IntroductionRequestModal
        matchId={selectedMatch?.id ?? ''}
        dealName={selectedMatch?.dealName ?? ''}
        isOpen={isIntroModalOpen}
        onClose={handleCloseIntroModal}
        onSuccess={handleIntroSuccess}
      />
    </div>
  );
};

export default MatchingWorkspace;
