import React from 'react';
import { DollarSign, TrendingUp, Briefcase, Target } from 'lucide-react';

interface ImpactCard {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  subLabel: string;
  gradient: string;
}

interface ScenarioImpactCardsProps {
  revenue: number;
  grossMargin: number;
  ebitda: number;
  ebitdaMargin: number;
  baseline?: {
    revenue: number;
    grossMargin: number;
    ebitda: number;
    ebitdaMargin: number;
  };
}

export const ScenarioImpactCards: React.FC<ScenarioImpactCardsProps> = ({
  revenue,
  grossMargin,
  ebitda,
  ebitdaMargin,
  baseline,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const cards: ImpactCard[] = [
    {
      icon: DollarSign,
      value: formatCurrency(revenue),
      label: 'Projected Revenue',
      subLabel: baseline ? 'Baseline' : 'Current',
      gradient: 'from-purple-500 to-indigo-600',
    },
    {
      icon: TrendingUp,
      value: formatPercent(grossMargin),
      label: 'Gross Margin',
      subLabel: baseline ? 'Baseline' : 'Current',
      gradient: 'from-indigo-500 to-blue-600',
    },
    {
      icon: Briefcase,
      value: formatCurrency(ebitda),
      label: 'EBITDA',
      subLabel: baseline ? 'Baseline' : 'Current',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Target,
      value: formatPercent(ebitdaMargin),
      label: 'EBITDA Margin',
      subLabel: baseline ? 'Baseline' : 'Current',
      gradient: 'from-cyan-500 to-teal-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.gradient} rounded-lg shadow-lg p-6 text-white transform transition-all duration-200 hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-4">
              <Icon className="w-8 h-8 opacity-90" />
            </div>
            <div className="mb-2">
              <p className="text-3xl font-bold">{card.value}</p>
            </div>
            <div>
              <p className="text-sm font-semibold opacity-95">{card.label}</p>
              <p className="text-xs opacity-75 mt-1">{card.subLabel}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

