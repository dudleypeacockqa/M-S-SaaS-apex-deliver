/**
 * DealReadinessScore Component - DEV-010 Phase 2.4
 * Displays Deal Readiness Score (0-100) with circular gauge and component breakdown
 */

import React from 'react';

export interface DealReadinessScoreProps {
  score: number;
  dataQualityScore: number;
  financialHealthScore: number;
  growthTrajectoryScore: number;
  riskAssessmentScore: number;
}

export const DealReadinessScore: React.FC<DealReadinessScoreProps> = ({
  score,
  dataQualityScore,
  financialHealthScore,
  growthTrajectoryScore,
  riskAssessmentScore,
}) => {
  // Determine color based on score
  const getScoreColor = (value: number): string => {
    if (value >= 76) return 'success'; // Green
    if (value >= 50) return 'warning'; // Yellow
    return 'danger'; // Red
  };

  const scoreColor = getScoreColor(score);

  // Color class mapping
  const colorClasses = {
    success: 'bg-green-100 border-green-500 text-green-900',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-900',
    danger: 'bg-red-100 border-red-500 text-red-900',
  };

  // Calculate percentage for circular gauge
  const percentage = Math.min(Math.max(score, 0), 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="deal-readiness-score p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Deal Readiness Score</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Circular Gauge */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="200" height="200" className="circular-progress">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r="45"
                fill="none"
                stroke={scoreColor === 'success' ? '#10b981' : scoreColor === 'warning' ? '#f59e0b' : '#ef4444'}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
            </svg>

            {/* Score display in center */}
            <div className={`score-display absolute inset-0 flex flex-col items-center justify-center ${scoreColor}`}>
              <div className="text-4xl font-bold">{score.toFixed(1)}</div>
              <div className="text-sm text-gray-600">/ 100</div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Breakdown</h3>
          <div className="space-y-4">
            {/* Data Quality */}
            <div className="score-component">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Data Quality</span>
                <span className="text-sm font-bold text-gray-900">
                  {dataQualityScore.toFixed(1)} / 25
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(dataQualityScore / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* Financial Health */}
            <div className="score-component">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Financial Health</span>
                <span className="text-sm font-bold text-gray-900">
                  {financialHealthScore.toFixed(1)} / 40
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(financialHealthScore / 40) * 100}%` }}
                />
              </div>
            </div>

            {/* Growth Trajectory */}
            <div className="score-component">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Growth Trajectory</span>
                <span className="text-sm font-bold text-gray-900">
                  {growthTrajectoryScore.toFixed(1)} / 20
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(growthTrajectoryScore / 20) * 100}%` }}
                />
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="score-component">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Risk Assessment</span>
                <span className="text-sm font-bold text-gray-900">
                  {riskAssessmentScore.toFixed(1)} / 15
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(riskAssessmentScore / 15) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
