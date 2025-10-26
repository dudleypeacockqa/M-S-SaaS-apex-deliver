/**
 * Financial Dashboard Component - DEV-010
 * Displays 47 financial ratios, AI narrative, and Deal Readiness Score
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  getFinancialRatios,
  getFinancialNarrative,
  type FinancialRatiosResponse,
  type FinancialNarrativeResponse,
} from '../../services/api/financial';

interface FinancialDashboardProps {
  dealId: string;
}

interface RatioCategory {
  title: string;
  ratios: Array<{
    label: string;
    value: number | undefined;
    format: 'number' | 'percentage';
    goodThreshold?: { min?: number; max?: number };
  }>;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ dealId }) => {
  const { getToken } = useAuth();
  const [ratios, setRatios] = useState<FinancialRatiosResponse | null>(null);
  const [narrative, setNarrative] = useState<FinancialNarrativeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFinancialData() {
      try {
        setLoading(true);
        setError(null);

        const token = await getToken();
        if (!token) {
          throw new Error('Authentication required');
        }

        // Fetch ratios and narrative in parallel
        const [ratiosData, narrativeData] = await Promise.allSettled([
          getFinancialRatios(dealId, token),
          getFinancialNarrative(dealId, token),
        ]);

        if (ratiosData.status === 'fulfilled') {
          setRatios(ratiosData.value);
        }

        if (narrativeData.status === 'fulfilled') {
          setNarrative(narrativeData.value);
        }

        // If both failed, show error
        if (ratiosData.status === 'rejected' && narrativeData.status === 'rejected') {
          throw new Error('Error loading financial data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading financial data');
      } finally {
        setLoading(false);
      }
    }

    fetchFinancialData();
  }, [dealId, getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (error && !ratios) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const ratioCategories: RatioCategory[] = [
    {
      title: 'Liquidity Ratios',
      ratios: [
        { label: 'Current Ratio', value: ratios?.current_ratio, format: 'number' },
        { label: 'Quick Ratio', value: ratios?.quick_ratio, format: 'number' },
        { label: 'Cash Ratio', value: ratios?.cash_ratio, format: 'number' },
        { label: 'Operating Cash Flow Ratio', value: ratios?.operating_cash_flow_ratio, format: 'number' },
        { label: 'Defensive Interval Ratio', value: ratios?.defensive_interval_ratio, format: 'number' },
      ],
    },
    {
      title: 'Profitability Ratios',
      ratios: [
        { label: 'Gross Profit Margin', value: ratios?.gross_profit_margin, format: 'percentage' },
        { label: 'Operating Profit Margin', value: ratios?.operating_profit_margin, format: 'percentage' },
        { label: 'Net Profit Margin', value: ratios?.net_profit_margin, format: 'percentage' },
        { label: 'Return on Assets (ROA)', value: ratios?.return_on_assets, format: 'percentage' },
        { label: 'Return on Equity (ROE)', value: ratios?.return_on_equity, format: 'percentage' },
        { label: 'Return on Invested Capital (ROIC)', value: ratios?.return_on_invested_capital, format: 'percentage' },
        { label: 'EBITDA Margin', value: ratios?.ebitda_margin, format: 'percentage' },
        { label: 'EBIT Margin', value: ratios?.ebit_margin, format: 'percentage' },
      ],
    },
    {
      title: 'Leverage Ratios',
      ratios: [
        { label: 'Debt-to-Equity', value: ratios?.debt_to_equity, format: 'number' },
        { label: 'Debt-to-Assets', value: ratios?.debt_to_assets, format: 'number' },
        { label: 'Equity Multiplier', value: ratios?.equity_multiplier, format: 'number' },
        { label: 'Interest Coverage', value: ratios?.interest_coverage, format: 'number' },
        { label: 'Debt Service Coverage', value: ratios?.debt_service_coverage, format: 'number' },
        { label: 'Financial Leverage', value: ratios?.financial_leverage, format: 'number' },
      ],
    },
  ];

  const getScoreColor = (score: number | undefined) => {
    if (!score) return 'bg-gray-200 text-gray-700';
    if (score >= 76) return 'bg-green-500 text-white';
    if (score >= 51) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Financial Analysis Dashboard</h1>

      {/* Deal Readiness Score */}
      {narrative && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Deal Readiness Score</h2>
          <div className="flex items-center gap-8">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold ${getScoreColor(narrative.readiness_score)}`}>
              {narrative.readiness_score?.toFixed(1)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Score Breakdown</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Data Quality</p>
                  <p className="font-semibold">{narrative.readiness_score_breakdown?.data_quality_score}/25</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Financial Health</p>
                  <p className="font-semibold">{narrative.readiness_score_breakdown?.financial_health_score}/40</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Growth Trajectory</p>
                  <p className="font-semibold">{narrative.readiness_score_breakdown?.growth_trajectory_score}/20</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Risk Assessment</p>
                  <p className="font-semibold">{narrative.readiness_score_breakdown?.risk_assessment_score}/15</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Narrative */}
      {narrative && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Financial Analysis Narrative</h2>
          <p className="text-gray-700 mb-6">{narrative.summary}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-2">Strengths</h3>
              <ul className="list-disc list-inside space-y-1">
                {narrative.strengths?.map((strength, index) => (
                  <li key={index} className="text-gray-700">{strength}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-yellow-700 mb-2">Weaknesses</h3>
              <ul className="list-disc list-inside space-y-1">
                {narrative.weaknesses?.map((weakness, index) => (
                  <li key={index} className="text-gray-700">{weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-red-700 mb-2">Red Flags</h3>
            {narrative.red_flags && narrative.red_flags.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {narrative.red_flags.map((flag, index) => (
                  <li key={index} className="text-gray-700">{flag}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No red flags identified</p>
            )}
          </div>
        </div>
      )}

      {/* Financial Ratios */}
      <div className="space-y-6">
        {ratioCategories.map((category) => (
          <div key={category.title} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.ratios.map((ratio) => (
                <div key={ratio.label} className="border border-gray-200 rounded p-3">
                  <p className="text-sm text-gray-600 mb-1">{ratio.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {ratio.value !== undefined
                      ? ratio.format === 'percentage'
                        ? `${ratio.value.toFixed(1)}%`
                        : ratio.value.toFixed(2)
                      : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialDashboard;
