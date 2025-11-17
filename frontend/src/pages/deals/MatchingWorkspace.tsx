/**
 * Matching Workspace - DEV-018 Frontend
 * Intelligent deal matching interface with presets, actions, and analytics
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
import { MatchSuccessRate } from '../../components/deal-matching/analytics/MatchSuccessRate';
import { MatchScoreDistribution } from '../../components/deal-matching/analytics/MatchScoreDistribution';
import { RecentMatches } from '../../components/deal-matching/analytics/RecentMatches';
import { MatchingActivity } from '../../components/deal-matching/analytics/MatchingActivity';
import { ErrorBoundary } from '../../components/common';

interface MatchingWorkspaceProps {
  dealId?: string;
  activeTab?: 'criteria' | 'matches';
  userTier?: 'starter' | 'professional' | 'growth' | 'premium' | 'enterprise';
}

interface FlashMessage {
  type: 'success' | 'error';
  message: string;
}

interface CustomFieldDisplay {
  key: string;
  value: string;
}

const parseCustomFields = (structures?: string[]): CustomFieldDisplay[] => {
  if (!structures || structures.length === 0) {
    return [];
  }

  return structures
    .map((structure) => {
      const [key = '', value = ''] = structure.split('::');
      return {
        key,
        value,
      };
    })
    .filter((field) => field.key || field.value);
};

const formatCurrencyRange = (min: string, max: string) => {
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const parseValue = (value: string) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const minNumber = parseValue(min);
  const maxNumber = parseValue(max);

  const million = 1_000_000;
  const formatMillions = (value: number) => `£${(value / million).toFixed(1)}M`;

  if (minNumber >= million && maxNumber >= million) {
    return `${formatMillions(minNumber)} – ${formatMillions(maxNumber)}`;
  }

  return `${formatter.format(minNumber)} – ${formatter.format(maxNumber)}`;
};

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
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<string | null>(null);
  const [criteriaToEdit, setCriteriaToEdit] = useState<MatchCriteria | null>(null);
  const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null);
  const criteriaTabRef = useRef<HTMLButtonElement | null>(null);
  const matchesTabRef = useRef<HTMLButtonElement | null>(null);
  const queryClient = useQueryClient();

  const hasAccess = userTier !== 'starter';

  useEffect(() => {
    setActiveTab((previous) => (previous === initialTab ? previous : initialTab));
  }, [initialTab]);

  useEffect(() => {
    if (!dealId && activeTab === 'matches') {
      setActiveTab('criteria');
    }
  }, [dealId, activeTab]);

  const {
    data: criteria = [],
    isLoading: criteriaLoading,
    error: criteriaError,
  } = useQuery<MatchCriteria[]>({
    queryKey: ['matchCriteria'],
    queryFn: fetchMatchCriteria,
    enabled: hasAccess,
  });

  useEffect(() => {
    if (criteria.length === 0) {
      setSelectedCriteriaId(null);
      return;
    }

    setSelectedCriteriaId((previous) => {
      if (previous && criteria.some((criterion) => criterion.id === previous)) {
        return previous;
      }
      return criteria[0]?.id ?? null;
    });
  }, [criteria]);

  const activeCriteria = useMemo(
    () => criteria.find((criterion) => criterion.id === selectedCriteriaId) ?? null,
    [criteria, selectedCriteriaId],
  );

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
      setFlashMessage({ type: 'success', message: 'Match recommendations refreshed' });
    },
    onError: () => {
      setFlashMessage({ type: 'error', message: 'Unable to refresh matches. Please try again.' });
    },
  });

  const saveMatchMutation = useMutation({
    mutationFn: (matchId: string) =>
      recordMatchAction(matchId, { action: 'save', metadata: { source: 'matching_workspace' } }),
    onMutate: async (matchId) => {
      await queryClient.cancelQueries({ queryKey: ['dealMatches', dealId] });
      const previous = queryClient.getQueryData<DealMatch[]>(['dealMatches', dealId]) ?? [];

      queryClient.setQueryData<DealMatch[]>(['dealMatches', dealId], (currentMatches = []) =>
        currentMatches.map((match) =>
          match.id === matchId
            ? {
                ...match,
                status: 'saved',
              }
            : match,
        ),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['dealMatches', dealId], context.previous);
      }
      setFlashMessage({ type: 'error', message: 'Could not save match. Please retry.' });
    },
    onSuccess: () => {
      setFlashMessage({ type: 'success', message: 'Match saved for later review' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dealMatches', dealId] });
    },
  });

  const passMatchMutation = useMutation({
    mutationFn: (matchId: string) =>
      recordMatchAction(matchId, { action: 'pass', metadata: { source: 'matching_workspace' } }),
    onMutate: async (matchId) => {
      await queryClient.cancelQueries({ queryKey: ['dealMatches', dealId] });
      const previous = queryClient.getQueryData<DealMatch[]>(['dealMatches', dealId]) ?? [];

      queryClient.setQueryData<DealMatch[]>(['dealMatches', dealId], (currentMatches = []) =>
        currentMatches.map((match) =>
          match.id === matchId
            ? {
                ...match,
                status: 'passed',
              }
            : match,
        ),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['dealMatches', dealId], context.previous);
      }
      setFlashMessage({ type: 'error', message: 'Unable to dismiss match. Please retry.' });
    },
    onSuccess: () => {
      setFlashMessage({ type: 'success', message: 'Match dismissed' });
    },
    onSettled: () => {
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
    setFlashMessage({ type: 'success', message: 'Introduction request sent' });
    queryClient.invalidateQueries({ queryKey: ['dealMatches', dealId] });
  };

  const handleCreateCriteria = () => {
    setCriteriaToEdit(null);
    setIsCriteriaModalOpen(true);
  };

  const handleEditCriteria = (criterion: MatchCriteria) => {
    setCriteriaToEdit(criterion);
    setIsCriteriaModalOpen(true);
  };

  const handleCriteriaSaved = (criterion: MatchCriteria) => {
    setSelectedCriteriaId(criterion.id);
    setFlashMessage({ type: 'success', message: `Preset "${criterion.name}" saved` });
  };

  const handleCriteriaModalClose = () => {
    setIsCriteriaModalOpen(false);
    setCriteriaToEdit(null);
  };

  useEffect(() => {
    if (!flashMessage) {
      return;
    }

    const timeout = setTimeout(() => setFlashMessage(null), 3500);
    return () => clearTimeout(timeout);
  }, [flashMessage]);

  const error = criteriaError || matchesError;
  const isMatchesTab = activeTab === 'matches';
  const isInitialLoading = criteriaLoading && activeTab === 'criteria';
  const showMatchesLoader = isMatchesTab && (matchesLoading || findMatchesMutation.isPending);
  const canFindMatches = Boolean(activeCriteria && dealId);

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

    const recentMatches = matches
      .slice()
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (aTime === bTime) {
          return (b.score ?? 0) - (a.score ?? 0);
        }
        return bTime - aTime;
      })
      .slice(0, 5)
      .map((match) => ({
        id: match.id ?? `${match.dealId}-${match.matchedDealId ?? 'recent'}`,
        name: match.dealName,
        score: match.score,
        status: match.status,
      }));

    const activityEvents = matches
      .filter((match) => match.status || match.createdAt)
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 6)
      .map((match) => ({
        id: match.id ?? `${match.dealId}-${match.matchedDealId ?? 'activity'}`,
        timestamp: match.createdAt ?? new Date().toISOString(),
        label: `${match.status ? match.status.toUpperCase() : 'MATCHED'}: ${match.dealName}`,
        status: match.status ? match.status.toLowerCase() : 'matched',
      }));

    return {
      total,
      averageScore: Number.isFinite(averageScore) ? averageScore : 0,
      distribution,
      successRate,
      introCount,
      successCount,
      recentMatches,
      activityEvents,
    };
  }, [matches]);

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

  const renderCriteriaCard = (criterion: MatchCriteria) => {
    const customFields = parseCustomFields(criterion.structures);
    const isSelected = selectedCriteriaId === criterion.id;

    return (
      <div
        key={criterion.id}
        className={`border rounded-xl p-4 transition-shadow ${
          isSelected ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-gray-200 hover:shadow-md'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="criteria-preset"
              value={criterion.id}
              checked={isSelected}
              onChange={() => setSelectedCriteriaId(criterion.id)}
              aria-label={`Select ${criterion.name} preset`}
              className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <header className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">{criterion.name}</h3>
                {isSelected && (
                  <span className="text-xs font-medium text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </header>
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-medium">Type:</span> {criterion.deal_type === 'buy_side' ? 'Buy Side' : 'Sell Side'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Industries:</span> {criterion.industries.join(', ')}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Size:</span> {formatCurrencyRange(
                  criterion.min_deal_size,
                  criterion.max_deal_size,
                )}
              </p>
              {criterion.geographies && criterion.geographies.length > 0 && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Geography:</span> {criterion.geographies.join(', ')}
                </p>
              )}
              {customFields.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Custom Filters</p>
                  <ul className="mt-1 space-y-1 text-sm text-gray-600">
                    {customFields.map((field, index) => (
                      <li key={`${criterion.id}-${field.key}-${index}`}>
                        <span className="font-medium">{field.key}:</span> {field.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleEditCriteria(criterion)}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Edit
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Deal Matching</h1>
        <p className="text-sm text-gray-600 mt-1">Discover relevant deals using AI-powered matching</p>
      </div>

      {flashMessage && (
        <div
          role="status"
          className={`mx-6 mt-4 rounded-lg px-4 py-3 text-sm font-medium ${
            flashMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
          data-testid="match-toast"
        >
          {flashMessage.message}
        </div>
      )}

      <div className="border-b border-gray-200 mt-4">
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
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Saved Criteria Presets</h2>
                <p className="text-sm text-gray-500">Select a preset to drive matching or create a new one</p>
              </div>
              <button
                onClick={handleCreateCriteria}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
              >
                <span>New Criteria</span>
              </button>
            </div>

            {criteria.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No criteria saved yet. Create your first one!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {criteria.map((criterion) => renderCriteriaCard(criterion))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'matches' && dealId && (
          <ErrorBoundary fallback={<div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load matches right now.</div>}>
            <div>
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Matches</h2>
                  {activeCriteria ? (
                    <p className="text-sm text-gray-500">Using preset: {activeCriteria.name}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Select a preset to enable matching</p>
                  )}
                </div>
                {canFindMatches ? (
                  <button
                    onClick={() => {
                      if (activeCriteria) {
                        findMatchesMutation.mutate({
                          criteria_id: activeCriteria.id,
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
                  <div className="text-sm text-gray-500">Select or create a criteria preset to find matches.</div>
                )}
              </div>

              {criteria.length > 0 && (
                <fieldset className="mb-4 rounded-lg border border-gray-200 p-4">
                  <legend className="text-sm font-medium text-gray-700">Select a preset</legend>
                  <div className="mt-2 grid gap-3 md:grid-cols-2">
                    {criteria.map((criterionOption) => (
                      <label
                        key={`matches-preset-${criterionOption.id}`}
                        className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
                          selectedCriteriaId === criterionOption.id
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span className="mr-3 flex-1">
                          <span className="block font-semibold text-gray-900">
                            {criterionOption.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            Industries: {criterionOption.industries.slice(0, 2).join(', ')}
                          </span>
                        </span>
                        <input
                          type="radio"
                          name="match-preset"
                          value={criterionOption.id}
                          checked={selectedCriteriaId === criterionOption.id}
                          onChange={() => setSelectedCriteriaId(criterionOption.id)}
                          aria-label={`Select ${criterionOption.name} preset`}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {matchAnalytics && !showMatchesLoader && (
                <div className="mb-6 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <MatchSuccessRate
                      successRate={matchAnalytics.successRate}
                      total={matchAnalytics.total}
                      successCount={matchAnalytics.successCount}
                    />
                    <MatchScoreDistribution
                      distribution={matchAnalytics.distribution}
                      total={matchAnalytics.total}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <RecentMatches matches={matchAnalytics.recentMatches} />
                    <MatchingActivity events={matchAnalytics.activityEvents} />
                  </div>
                </div>
              )}

              {showMatchesLoader ? (
                <MatchesSkeleton />
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
          </ErrorBoundary>
        )}
      <MatchDetailModal
        match={selectedMatch}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onSave={handleSaveMatch}
        onPass={handlePassMatch}
        onRequestIntro={handleRequestIntro}
        actionLoading={saveMatchMutation.isPending || passMatchMutation.isPending}
      />

      <CriteriaBuilderModal
        isOpen={isCriteriaModalOpen}
        onClose={handleCriteriaModalClose}
        onSuccess={handleCriteriaSaved}
        initialCriteria={criteriaToEdit}
      />

      <IntroductionRequestModal
        matchId={selectedMatch?.id ?? ''}
        dealName={selectedMatch?.dealName ?? ''}
        isOpen={isIntroModalOpen}
        onClose={handleCloseIntroModal}
        onSuccess={handleIntroSuccess}
      />
    </div>
    </div>
  );
};

const MatchesSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={`match-skeleton-${index}`}
        className="animate-pulse rounded-lg border border-gray-200 p-4 shadow-sm"
      >
        <div className="h-4 w-1/3 rounded bg-gray-200" />
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="h-3 rounded bg-gray-100" />
          <div className="h-3 rounded bg-gray-100" />
        </div>
        <div className="mt-4 h-3 w-2/3 rounded bg-gray-100" />
      </div>
    ))}
  </div>
);

export default MatchingWorkspace;
