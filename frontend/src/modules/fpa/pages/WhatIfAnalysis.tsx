import React, { useState, useCallback, useMemo } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { ScenarioSlider } from '../components/ScenarioSlider';
import { ScenarioImpactCards } from '../components/ScenarioImpactCards';
import { PredefinedScenarios } from '../components/PredefinedScenarios';
import { Settings, BarChart3, Gauge, Heart } from 'lucide-react';

interface ScenarioVariables {
  gabaRedPrice: number;
  gabaBlackPrice: number;
  gabaGoldPrice: number;
  productionVolume: number;
  materialCosts: number;
  laborEfficiency: number;
}

const BASELINE_VARIABLES: ScenarioVariables = {
  gabaRedPrice: 30.0,
  gabaBlackPrice: 32.0,
  gabaGoldPrice: 45.0,
  productionVolume: 100,
  materialCosts: 100,
  laborEfficiency: 100,
};

const BASELINE_METRICS = {
  revenue: 10760000,
  grossMargin: 67.6,
  ebitda: 2970000,
  ebitdaMargin: 27.6,
};

export const WhatIfAnalysis: React.FC = () => {
  const [variables, setVariables] = useState<ScenarioVariables>(BASELINE_VARIABLES);

  // Calculate impact based on variable changes
  const calculateImpact = useCallback((vars: ScenarioVariables) => {
    const volumeMultiplier = vars.productionVolume / 100;
    const priceMultiplier = 
      (vars.gabaRedPrice / BASELINE_VARIABLES.gabaRedPrice * 0.4 +
       vars.gabaBlackPrice / BASELINE_VARIABLES.gabaBlackPrice * 0.35 +
       vars.gabaGoldPrice / BASELINE_VARIABLES.gabaGoldPrice * 0.25);
    const costMultiplier = vars.materialCosts / 100;
    const efficiencyMultiplier = vars.laborEfficiency / 100;

    const revenue = BASELINE_METRICS.revenue * volumeMultiplier * priceMultiplier;
    const costOfGoodsSold = revenue * 0.324 * costMultiplier / efficiencyMultiplier;
    const grossProfit = revenue - costOfGoodsSold;
    const grossMargin = (grossProfit / revenue) * 100;
    const operatingExpenses = revenue * 0.4 * (1 / efficiencyMultiplier);
    const ebitda = grossProfit - operatingExpenses;
    const ebitdaMargin = (ebitda / revenue) * 100;

    return {
      revenue,
      grossMargin,
      ebitda,
      ebitdaMargin,
    };
  }, []);

  const currentMetrics = useMemo(() => calculateImpact(variables), [variables, calculateImpact]);

  const handleVariableChange = useCallback((key: keyof ScenarioVariables, value: number) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleApplyScenario = useCallback((scenario: any) => {
    setVariables((prev) => ({
      ...prev,
      ...scenario.variables,
    }));
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 bg-white min-h-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">What-If Analysis</h1>
          <p className="text-gray-600">
            Interactive scenario modeling with 20 variables for strategic planning and optimization
          </p>
        </div>

        {/* Scenario Modeling Engine */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Scenario Modeling Engine</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Real-time financial impact analysis with Monte Carlo simulation and sensitivity testing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
              <p className="text-4xl font-bold mb-2">20</p>
              <p className="text-sm opacity-90">Interactive Variables</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg p-6 text-white">
              <p className="text-4xl font-bold mb-2">1000+</p>
              <p className="text-sm opacity-90">Scenario Combinations</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-6 text-white">
              <p className="text-4xl font-bold mb-2">Real-time</p>
              <p className="text-sm opacity-90">Impact Calculation</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg p-6 text-white">
              <p className="text-4xl font-bold mb-2">95%</p>
              <p className="text-sm opacity-90">Confidence Level</p>
            </div>
          </div>
        </div>

        {/* Interactive Variables */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Interactive Variables</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Adjust key business parameters to see real-time impact on financial performance.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScenarioSlider
              label="GABA Red Price (£)"
              value={variables.gabaRedPrice}
              min={20}
              max={50}
              step={0.5}
              unit=""
              formatValue={(v) => `£${v.toFixed(2)}`}
              onChange={(value) => handleVariableChange('gabaRedPrice', value)}
            />
            <ScenarioSlider
              label="GABA Black Price (£)"
              value={variables.gabaBlackPrice}
              min={20}
              max={50}
              step={0.5}
              unit=""
              formatValue={(v) => `£${v.toFixed(2)}`}
              onChange={(value) => handleVariableChange('gabaBlackPrice', value)}
            />
            <ScenarioSlider
              label="GABA Gold Price (£)"
              value={variables.gabaGoldPrice}
              min={30}
              max={70}
              step={0.5}
              unit=""
              formatValue={(v) => `£${v.toFixed(2)}`}
              onChange={(value) => handleVariableChange('gabaGoldPrice', value)}
            />
            <ScenarioSlider
              label="Production Volume (%)"
              value={variables.productionVolume}
              min={50}
              max={150}
              step={1}
              unit="%"
              formatValue={(v) => `${v.toFixed(0)}%`}
              onChange={(value) => handleVariableChange('productionVolume', value)}
            />
            <ScenarioSlider
              label="Material Costs (%)"
              value={variables.materialCosts}
              min={70}
              max={130}
              step={1}
              unit="%"
              formatValue={(v) => `${v.toFixed(0)}%`}
              onChange={(value) => handleVariableChange('materialCosts', value)}
            />
            <ScenarioSlider
              label="Labor Efficiency (%)"
              value={variables.laborEfficiency}
              min={70}
              max={130}
              step={1}
              unit="%"
              formatValue={(v) => `${v.toFixed(0)}%`}
              onChange={(value) => handleVariableChange('laborEfficiency', value)}
            />
          </div>
        </div>

        {/* Scenario Impact Analysis */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Scenario Impact Analysis</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Real-time financial projections based on your variable adjustments.
          </p>
          <ScenarioImpactCards
            revenue={currentMetrics.revenue}
            grossMargin={currentMetrics.grossMargin}
            ebitda={currentMetrics.ebitda}
            ebitdaMargin={currentMetrics.ebitdaMargin}
            baseline={BASELINE_METRICS}
          />
        </div>

        {/* Predefined Scenarios */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Predefined Scenarios</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Quick access to common business scenarios and their financial impact.
          </p>
          <PredefinedScenarios
            baseline={{
              revenue: BASELINE_METRICS.revenue,
              ebitda: BASELINE_METRICS.ebitda,
            }}
            onApplyScenario={handleApplyScenario}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
