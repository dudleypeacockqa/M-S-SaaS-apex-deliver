import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pmiApi } from '../services/pmiApi';
import { Sparkles, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface AIRecommendationsProps {
  projectId: string;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ projectId }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'best-practices' | 'recommendations' | 'benchmark'>('recommendations');

  const { data: bestPractices, isLoading: loadingPractices } = useQuery({
    queryKey: ['pmi', 'best-practices', projectId],
    queryFn: () => pmiApi.getBestPractices(projectId),
    enabled: activeTab === 'best-practices',
  });

  const { data: recommendations, isLoading: loadingRecommendations } = useQuery({
    queryKey: ['pmi', 'recommendations', projectId],
    queryFn: () => pmiApi.getRecommendations(projectId),
    enabled: activeTab === 'recommendations',
  });

  const { data: benchmark, isLoading: loadingBenchmark } = useQuery({
    queryKey: ['pmi', 'benchmark', projectId],
    queryFn: () => pmiApi.benchmarkAgainstIndustry(projectId),
    enabled: activeTab === 'benchmark',
  });

  const identifyRisksMutation = useMutation({
    mutationFn: () => pmiApi.identifyRisks(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pmi', 'risks', projectId] });
    },
  });

  const suggestSynergiesMutation = useMutation({
    mutationFn: () => pmiApi.suggestSynergies(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pmi', 'synergies', projectId] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          AI Recommendations
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => identifyRisksMutation.mutate()}
            disabled={identifyRisksMutation.isPending}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
          >
            {identifyRisksMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            Identify Risks
          </button>
          <button
            onClick={() => suggestSynergiesMutation.mutate()}
            disabled={suggestSynergiesMutation.isPending}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
          >
            {suggestSynergiesMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            Suggest Synergies
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`pb-2 px-4 border-b-2 ${
              activeTab === 'recommendations'
                ? 'border-purple-500 text-purple-600 font-semibold'
                : 'border-transparent text-gray-500'
            }`}
          >
            Action Recommendations
          </button>
          <button
            onClick={() => setActiveTab('best-practices')}
            className={`pb-2 px-4 border-b-2 ${
              activeTab === 'best-practices'
                ? 'border-purple-500 text-purple-600 font-semibold'
                : 'border-transparent text-gray-500'
            }`}
          >
            Best Practices
          </button>
          <button
            onClick={() => setActiveTab('benchmark')}
            className={`pb-2 px-4 border-b-2 ${
              activeTab === 'benchmark'
                ? 'border-purple-500 text-purple-600 font-semibold'
                : 'border-transparent text-gray-500'
            }`}
          >
            Industry Benchmark
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'recommendations' && (
          <div>
            {loadingRecommendations ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500" />
                <p className="mt-2 text-gray-500">Generating recommendations...</p>
              </div>
            ) : recommendations?.recommendations ? (
              <div className="space-y-4">
                {recommendations.recommendations.map((rec: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{rec.action}</h3>
                        <p className="text-gray-600 mb-3">{rec.reasoning}</p>
                        <div className="flex gap-4 text-sm">
                          <span className={`px-2 py-1 rounded ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            Priority: {rec.priority}
                          </span>
                          <span className="text-gray-500">Timeline: {rec.timeline_days} days</span>
                          {rec.recommended_owner && (
                            <span className="text-gray-500">Owner: {rec.recommended_owner}</span>
                          )}
                        </div>
                      </div>
                      <button className="ml-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recommendations available. Click "Get Recommendations" to generate.
              </div>
            )}
          </div>
        )}

        {activeTab === 'best-practices' && (
          <div>
            {loadingPractices ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500" />
                <p className="mt-2 text-gray-500">Loading best practices...</p>
              </div>
            ) : bestPractices ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Success Factors</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {bestPractices.success_factors?.map((factor: string, idx: number) => (
                      <li key={idx} className="text-gray-700">{factor}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Common Pitfalls</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {bestPractices.pitfalls?.map((pitfall: string, idx: number) => (
                      <li key={idx} className="text-gray-700">{pitfall}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Recommended Actions</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {bestPractices.recommended_actions?.map((action: string, idx: number) => (
                      <li key={idx} className="text-gray-700">{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No best practices available.</div>
            )}
          </div>
        )}

        {activeTab === 'benchmark' && (
          <div>
            {loadingBenchmark ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500" />
                <p className="mt-2 text-gray-500">Benchmarking against industry...</p>
              </div>
            ) : benchmark ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Performance Ratings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(benchmark.performance_ratings || {}).map(([metric, rating]: [string, any]) => (
                      <div key={metric} className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-500">{metric}</div>
                        <div className="text-lg font-semibold">{rating}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Areas of Strength</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {benchmark.strengths?.map((strength: string, idx: number) => (
                      <li key={idx} className="text-gray-700">{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Areas for Improvement</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {benchmark.improvements?.map((improvement: string, idx: number) => (
                      <li key={idx} className="text-gray-700">{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No benchmark data available.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

