/**
 * FinancialRatiosDashboard Component - DEV-010
 * Displays financial ratios organized by category with visual indicators
 */

import React from 'react';

export interface FinancialRatios {
  // Liquidity
  current_ratio?: number | null;
  quick_ratio?: number | null;
  cash_ratio?: number | null;

  // Profitability
  gross_profit_margin?: number | null;
  net_profit_margin?: number | null;
  return_on_assets?: number | null;
  return_on_equity?: number | null;

  // Leverage
  debt_to_equity?: number | null;
  debt_to_assets?: number | null;
  interest_coverage?: number | null;
}

export interface FinancialRatiosDashboardProps {
  ratios: FinancialRatios;
}

type RatioIndicator = 'good' | 'warning' | 'bad';

const getRatioIndicator = (ratioName: string, value: number | null): RatioIndicator => {
  if (value === null || value === undefined) return 'bad';

  // Liquidity ratios
  if (ratioName === 'current_ratio' || ratioName === 'quick_ratio') {
    if (value >= 2.0) return 'good';
    if (value >= 1.0) return 'warning';
    return 'bad';
  }

  // Profitability ratios (percentages)
  if (ratioName.includes('margin') || ratioName.includes('return_on')) {
    if (value >= 15) return 'good';
    if (value >= 5) return 'warning';
    return 'bad';
  }

  // Debt ratios
  if (ratioName.includes('debt')) {
    if (value <= 0.5) return 'good';
    if (value <= 1.5) return 'warning';
    return 'bad';
  }

  // Interest coverage
  if (ratioName === 'interest_coverage') {
    if (value >= 5.0) return 'good';
    if (value >= 2.0) return 'warning';
    return 'bad';
  }

  return 'warning';
};

const formatRatioValue = (value: number | null | undefined, isPercentage: boolean = false): string => {
  if (value === null || value === undefined) return 'N/A';
  return isPercentage ? `${value.toFixed(1)}%` : value.toFixed(2);
};

const RatioCard: React.FC<{
  label: string;
  value: number | null | undefined;
  ratioName: string;
  isPercentage?: boolean;
}> = ({ label, value, ratioName, isPercentage = false }) => {
  const indicator = getRatioIndicator(ratioName, value ?? null);
  const indicatorClass = `indicator-${indicator}`;

  return (
    <article className={`ratio-card ${indicatorClass} p-4 rounded-lg border-2 ${
      indicator === 'good' ? 'border-green-400 bg-green-50' :
      indicator === 'warning' ? 'border-yellow-400 bg-yellow-50' :
      'border-red-400 bg-red-50'
    }`} role="article">
      <div className="ratio-label text-sm font-medium text-gray-700 mb-1">
        {label}
      </div>
      <div className={`ratio-value text-2xl font-bold ${
        indicator === 'good' ? 'text-green-700' :
        indicator === 'warning' ? 'text-yellow-700' :
        'text-red-700'
      }`}>
        {formatRatioValue(value, isPercentage)}
      </div>
      <div className={`indicator-badge text-xs mt-1 ${
        indicator === 'good' ? 'text-green-600' :
        indicator === 'warning' ? 'text-yellow-600' :
        'text-red-600'
      }`}>
        {indicator === 'good' ? '● Good' : indicator === 'warning' ? '● Warning' : '● Poor'}
      </div>
    </article>
  );
};

export const FinancialRatiosDashboard: React.FC<FinancialRatiosDashboardProps> = ({ ratios }) => {
  const hasAnyRatios = Object.values(ratios).some(val => val !== null && val !== undefined);

  if (!hasAnyRatios) {
    return (
      <div className="financial-ratios-dashboard p-6 bg-white rounded-lg shadow">
        <div className="empty-state text-center py-12">
          <p className="text-gray-500 text-lg">No financial ratios available</p>
          <p className="text-gray-400 text-sm mt-2">Calculate ratios from financial statements first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-ratios-dashboard p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Financial Ratios Analysis</h2>

      {/* Liquidity Ratios Section */}
      <section className="ratios-section mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Liquidity Ratios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ratios.current_ratio !== undefined && (
            <RatioCard
              label="Current Ratio"
              value={ratios.current_ratio}
              ratioName="current_ratio"
            />
          )}
          {ratios.quick_ratio !== undefined && (
            <RatioCard
              label="Quick Ratio"
              value={ratios.quick_ratio}
              ratioName="quick_ratio"
            />
          )}
          {ratios.cash_ratio !== undefined && (
            <RatioCard
              label="Cash Ratio"
              value={ratios.cash_ratio}
              ratioName="cash_ratio"
            />
          )}
        </div>
      </section>

      {/* Profitability Ratios Section */}
      <section className="ratios-section mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Profitability Ratios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ratios.gross_profit_margin !== undefined && (
            <RatioCard
              label="Gross Profit Margin"
              value={ratios.gross_profit_margin}
              ratioName="gross_profit_margin"
              isPercentage
            />
          )}
          {ratios.net_profit_margin !== undefined && (
            <RatioCard
              label="Net Profit Margin"
              value={ratios.net_profit_margin}
              ratioName="net_profit_margin"
              isPercentage
            />
          )}
          {ratios.return_on_assets !== undefined && (
            <RatioCard
              label="Return on Assets"
              value={ratios.return_on_assets}
              ratioName="return_on_assets"
              isPercentage
            />
          )}
          {ratios.return_on_equity !== undefined && (
            <RatioCard
              label="Return on Equity"
              value={ratios.return_on_equity}
              ratioName="return_on_equity"
              isPercentage
            />
          )}
        </div>
      </section>

      {/* Leverage Ratios Section */}
      <section className="ratios-section">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Leverage Ratios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ratios.debt_to_equity !== undefined && (
            <RatioCard
              label="Debt to Equity"
              value={ratios.debt_to_equity}
              ratioName="debt_to_equity"
            />
          )}
          {ratios.debt_to_assets !== undefined && (
            <RatioCard
              label="Debt to Assets"
              value={ratios.debt_to_assets}
              ratioName="debt_to_assets"
            />
          )}
          {ratios.interest_coverage !== undefined && (
            <RatioCard
              label="Interest Coverage"
              value={ratios.interest_coverage}
              ratioName="interest_coverage"
            />
          )}
        </div>
      </section>
    </div>
  );
};
