import React from 'react';
import { ArrowUp, DollarSign, Star, AlertTriangle } from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  revenueImpact: { value: number; change: number };
  ebitdaImpact: { value: number; change: number };
  variables: Record<string, number>;
}

interface PredefinedScenariosProps {
  baseline: {
    revenue: number;
    ebitda: number;
  };
  onApplyScenario: (scenario: Scenario) => void;
}

export const PredefinedScenarios: React.FC<PredefinedScenariosProps> = ({
  baseline,
  onApplyScenario,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const scenarios: Scenario[] = [
    {
      id: 'aggressive-growth',
      name: 'Aggressive Growth',
      description: '+20% volume, +5% prices',
      icon: ArrowUp,
      iconColor: 'text-green-600',
      revenueImpact: {
        value: baseline.revenue * 1.227,
        change: 22.7,
      },
      ebitdaImpact: {
        value: baseline.ebitda * 1.281,
        change: 28.1,
      },
      variables: {
        productionVolume: 120,
        gabaRedPrice: 31.5,
        gabaBlackPrice: 33.6,
        gabaGoldPrice: 47.25,
      },
    },
    {
      id: 'cost-optimization',
      name: 'Cost Optimization',
      description: '-8% material costs, +10% efficiency',
      icon: DollarSign,
      iconColor: 'text-blue-600',
      revenueImpact: {
        value: baseline.revenue,
        change: 0,
      },
      ebitdaImpact: {
        value: baseline.ebitda * 1.145,
        change: 14.5,
      },
      variables: {
        materialCosts: 92,
        laborEfficiency: 110,
      },
    },
    {
      id: 'premium-positioning',
      name: 'Premium Positioning',
      description: '+15% prices, -5% volume',
      icon: Star,
      iconColor: 'text-purple-600',
      revenueImpact: {
        value: baseline.revenue * 1.097,
        change: 9.7,
      },
      ebitdaImpact: {
        value: baseline.ebitda * 1.212,
        change: 21.2,
      },
      variables: {
        gabaRedPrice: 34.5,
        gabaBlackPrice: 36.8,
        gabaGoldPrice: 51.75,
        productionVolume: 95,
      },
    },
    {
      id: 'conservative',
      name: 'Conservative',
      description: '-10% volume, -5% costs',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      revenueImpact: {
        value: baseline.revenue * 0.901,
        change: -9.9,
      },
      ebitdaImpact: {
        value: baseline.ebitda * 0.943,
        change: -5.7,
      },
      variables: {
        productionVolume: 90,
        materialCosts: 95,
        laborEfficiency: 95,
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {scenarios.map((scenario) => {
        const Icon = scenario.icon;
        const revenueChangeColor = scenario.revenueImpact.change >= 0 ? 'text-green-600' : 'text-red-600';
        const ebitdaChangeColor = scenario.ebitdaImpact.change >= 0 ? 'text-green-600' : 'text-red-600';

        return (
          <div
            key={scenario.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg bg-gray-100 ${scenario.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
                <p className="text-xs text-gray-500">{scenario.description}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Revenue</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(scenario.revenueImpact.value)}
                  </p>
                  <span className={`text-sm font-medium ${revenueChangeColor}`}>
                    ({formatPercent(scenario.revenueImpact.change)})
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">EBITDA</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(scenario.ebitdaImpact.value)}
                  </p>
                  <span className={`text-sm font-medium ${ebitdaChangeColor}`}>
                    ({formatPercent(scenario.ebitdaImpact.change)})
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onApplyScenario(scenario)}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-150"
            >
              Apply Scenario
            </button>
          </div>
        );
      })}
    </div>
  );
};

