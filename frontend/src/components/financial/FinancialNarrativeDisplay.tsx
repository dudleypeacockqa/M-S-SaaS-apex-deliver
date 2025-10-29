/**
 * FinancialNarrativeDisplay Component - DEV-010
 * Displays AI-generated financial narrative with strengths, weaknesses, and red flags
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';

export interface FinancialNarrative {
  summary: string;
  strengths?: string[];
  weaknesses?: string[];
  redFlags?: string[];
  growthSignals?: string[];
  aiModel: string;
  generatedAt: string;
}

export interface FinancialNarrativeDisplayProps {
  narrative: FinancialNarrative | null;
  onRegenerate?: () => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
}

export const FinancialNarrativeDisplay: React.FC<FinancialNarrativeDisplayProps> = ({
  narrative,
  onRegenerate,
  onGenerate,
  isGenerating = false,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!narrative) {
    return (
      <div className="financial-narrative-display p-6 bg-white rounded-lg shadow">
        <div className="empty-state text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No narrative available</p>
          <p className="text-gray-400 text-sm mb-6">Generate an AI-powered financial narrative from your data</p>
          {onGenerate && (
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating Narrative...' : 'Generate Financial Narrative'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="financial-narrative-display p-6 bg-white rounded-lg shadow">
      <div className="header flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Financial Analysis</h2>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
        )}
      </div>

      {/* Executive Summary */}
      <section className="summary mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Executive Summary</h3>
        <div className="prose prose-sm max-w-none text-gray-700">
          <ReactMarkdown>{narrative.summary}</ReactMarkdown>
        </div>
      </section>

      {/* Strengths */}
      {narrative.strengths && narrative.strengths.length > 0 && (
        <section className="strengths mb-8">
          <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
            <span className="mr-2">✓</span> Strengths
          </h3>
          <ul className="space-y-2">
            {narrative.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">●</span>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Growth Signals */}
      {narrative.growthSignals && narrative.growthSignals.length > 0 && (
        <section className="growth-signals mb-8">
          <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
            <span className="mr-2">📈</span> Growth Signals
          </h3>
          <ul className="space-y-2">
            {narrative.growthSignals.map((signal, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">●</span>
                <span className="text-gray-700">{signal}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Weaknesses */}
      {narrative.weaknesses && narrative.weaknesses.length > 0 && (
        <section className="weaknesses mb-8">
          <h3 className="text-lg font-semibold text-yellow-700 mb-3 flex items-center">
            <span className="mr-2">⚠</span> Weaknesses
          </h3>
          <ul className="space-y-2">
            {narrative.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <span className="text-yellow-500 mr-2 mt-1">●</span>
                <span className="text-gray-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Red Flags */}
      {narrative.redFlags && narrative.redFlags.length > 0 && (
        <section className="red-flags bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center">
            <span className="mr-2">🚩</span> Red Flags
          </h3>
          <ul className="space-y-2">
            {narrative.redFlags.map((flag, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2 mt-1">●</span>
                <span className="text-gray-700">{flag}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Metadata */}
      <div className="metadata mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
        <div className="flex justify-between items-center">
          <span>
            Generated by <span className="font-medium text-gray-700">{narrative.aiModel}</span>
          </span>
          <span>
            {formatDate(narrative.generatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};
