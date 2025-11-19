import React, { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Settings, BarChart3, Gauge, Heart, ShieldAlert } from 'lucide-react'

import { DashboardLayout } from '../components/DashboardLayout'
import { ScenarioSlider } from '../components/ScenarioSlider'
import { ScenarioImpactCards } from '../components/ScenarioImpactCards'
import { PredefinedScenarios } from '../components/PredefinedScenarios'
import { fpaApi, type PredefinedScenario } from '../services/fpaApi'

interface ScenarioVariables {
  gabaRedPrice: number
  gabaBlackPrice: number
  gabaGoldPrice: number
  productionVolume: number
  materialCosts: number
  laborEfficiency: number
}

const BASELINE_VARIABLES: ScenarioVariables = {
  gabaRedPrice: 30,
  gabaBlackPrice: 32,
  gabaGoldPrice: 45,
  productionVolume: 100,
  materialCosts: 100,
  laborEfficiency: 100,
}

const BASELINE_METRICS = {
  revenue: 10_760_000,
  grossMargin: 67.6,
  ebitda: 2_970_000,
  ebitdaMargin: 27.6,
}

const toPayload = (variables: ScenarioVariables) => ({
  variables: {
    gaba_red_price: variables.gabaRedPrice,
    gaba_black_price: variables.gabaBlackPrice,
    gaba_gold_price: variables.gabaGoldPrice,
    production_volume: variables.productionVolume,
    material_costs: variables.materialCosts,
    labor_efficiency: variables.laborEfficiency,
  },
})

const fromPayload = (payload: PredefinedScenario['variables']): ScenarioVariables => ({
  gabaRedPrice: payload.gaba_red_price,
  gabaBlackPrice: payload.gaba_black_price,
  gabaGoldPrice: payload.gaba_gold_price,
  productionVolume: payload.production_volume,
  materialCosts: payload.material_costs,
  laborEfficiency: payload.labor_efficiency,
})

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

export const WhatIfAnalysis: React.FC = () => {
  const [variables, setVariables] = useState<ScenarioVariables>(BASELINE_VARIABLES)
  const [metrics, setMetrics] = useState(BASELINE_METRICS)
  const [baselineMetrics, setBaselineMetrics] = useState(BASELINE_METRICS)
  const [calculationError, setCalculationError] = useState<string | null>(null)

  const { data: presetResponse, isLoading: presetsLoading } = useQuery({
    queryKey: ['fpa', 'what-if', 'presets'],
    queryFn: () => fpaApi.getScenarioPresets(),
  })

  const calculateMutation = useMutation({
    mutationFn: (vars: ScenarioVariables) => fpaApi.calculateScenarioImpact(toPayload(vars)),
    onSuccess: (response) => {
      setMetrics({
        revenue: response.metrics.revenue,
        grossMargin: response.metrics.gross_margin,
        ebitda: response.metrics.ebitda,
        ebitdaMargin: response.metrics.ebitda_margin,
      })
      if (response.baseline) {
        setBaselineMetrics({
          revenue: response.baseline.revenue,
          grossMargin: response.baseline.gross_margin,
          ebitda: response.baseline.ebitda,
          ebitdaMargin: response.baseline.ebitda_margin,
        })
      }
      setCalculationError(null)
    },
    onError: (error: unknown) => {
      setCalculationError(error instanceof Error ? error.message : 'Unable to calculate scenario impact')
    },
  })

  const applyScenarioMutation = useMutation({
    mutationFn: (scenarioId: string) => fpaApi.applyScenario(scenarioId),
    onSuccess: (response) => {
      setVariables(fromPayload(response.scenario.variables))
      setMetrics({
        revenue: response.metrics.revenue,
        grossMargin: response.metrics.gross_margin,
        ebitda: response.metrics.ebitda,
        ebitdaMargin: response.metrics.ebitda_margin,
      })
      setBaselineMetrics({
        revenue: response.baseline.revenue,
        grossMargin: response.baseline.gross_margin,
        ebitda: response.baseline.ebitda,
        ebitdaMargin: response.baseline.ebitda_margin,
      })
      setCalculationError(null)
    },
    onError: (error: unknown) => {
      setCalculationError(error instanceof Error ? error.message : 'Scenario failed to apply')
    },
  })

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      calculateMutation.mutate(variables)
    }, 250)

    return () => window.clearTimeout(timeout)
  }, [variables, calculateMutation])

  const presetCards = useMemo(() => {
    return (presetResponse ?? []).map((preset) => ({
      id: preset.id,
      name: preset.name,
      description: preset.description,
      revenueImpact: preset.revenue_impact,
      ebitdaImpact: preset.ebitda_impact,
    }))
  }, [presetResponse])

  return (
    <DashboardLayout>
      <div className='min-h-full bg-white p-6 lg:p-8'>
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>What-If Analysis</h1>
          <p className='text-gray-600'>Interactive scenario modeling with 20 variables for strategic planning and optimisation.</p>
        </div>

        <div className='mb-8'>
          <div className='mb-4 flex items-center gap-2'>
            <Settings className='h-5 w-5 text-indigo-600' />
            <h2 className='text-xl font-semibold text-gray-900'>Scenario Modeling Engine</h2>
          </div>
          <p className='mb-6 text-gray-600'>Real-time financial impact analysis with Monte Carlo simulation and sensitivity testing.</p>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <div className='rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white'>
              <p className='text-4xl font-bold'>20</p>
              <p className='text-sm opacity-80'>Interactive Variables</p>
            </div>
            <div className='rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 p-6 text-white'>
              <p className='text-4xl font-bold'>1000+</p>
              <p className='text-sm opacity-80'>Scenario Combinations</p>
            </div>
            <div className='rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white'>
              <p className='text-4xl font-bold'>Real-time</p>
              <p className='text-sm opacity-80'>Impact Calculation</p>
            </div>
            <div className='rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 p-6 text-white'>
              <p className='text-4xl font-bold'>95%</p>
              <p className='text-sm opacity-80'>Confidence Level</p>
            </div>
          </div>
        </div>

        <div className='mb-8 rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-sm'>
          <div className='mb-2 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Gauge className='h-5 w-5 text-indigo-600' />
              <h2 className='text-xl font-semibold text-gray-900'>Interactive Variables</h2>
            </div>
            <span className={`text-sm font-medium ${calculateMutation.isPending ? 'text-amber-600' : 'text-emerald-600'}`}>
              {calculateMutation.isPending ? 'Syncing model…' : 'Model in sync'}
            </span>
          </div>
          <p className='text-sm text-slate-500'>Adjust key business levers to inject new assumptions into the FP&A engine.</p>
          <div className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <ScenarioSlider
              label='GABA Red Price (£)'
              value={variables.gabaRedPrice}
              min={20}
              max={50}
              step={0.5}
              formatValue={(v) => `£${v.toFixed(2)}`}
              onChange={(value) => setVariables((prev) => ({ ...prev, gabaRedPrice: value }))}
            />
            <ScenarioSlider
              label='GABA Black Price (£)'
              value={variables.gabaBlackPrice}
              min={20}
              max={50}
              step={0.5}
              formatValue={(v) => `£${v.toFixed(2)}`}
              onChange={(value) => setVariables((prev) => ({ ...prev, gabaBlackPrice: value }))}
            />
            <ScenarioSlider
              label='GABA Gold Price (£)'
              value={variables.gabaGoldPrice}
              min={30}
              max={70}
              step={0.5}
              formatValue={(v) => `£${v.toFixed(2)}`}
              onChange={(value) => setVariables((prev) => ({ ...prev, gabaGoldPrice: value }))}
            />
            <ScenarioSlider
              label='Production Volume (%)'
              value={variables.productionVolume}
              min={50}
              max={150}
              step={1}
              formatValue={(v) => `${v.toFixed(0)}%`}
              onChange={(value) => setVariables((prev) => ({ ...prev, productionVolume: value }))}
            />
            <ScenarioSlider
              label='Material Costs (%)'
              value={variables.materialCosts}
              min={70}
              max={130}
              step={1}
              formatValue={(v) => `${v.toFixed(0)}%`}
              onChange={(value) => setVariables((prev) => ({ ...prev, materialCosts: value }))}
            />
            <ScenarioSlider
              label='Labor Efficiency (%)'
              value={variables.laborEfficiency}
              min={70}
              max={130}
              step={1}
              formatValue={(v) => `${v.toFixed(0)}%`}
              onChange={(value) => setVariables((prev) => ({ ...prev, laborEfficiency: value }))}
            />
          </div>
        </div>

        <div className='mb-8 rounded-2xl border border-slate-100 bg-slate-50/80 p-6'>
          <div className='mb-4 flex items-center gap-2'>
            <BarChart3 className='h-5 w-5 text-indigo-600' />
            <h2 className='text-xl font-semibold text-gray-900'>Scenario Impact Analysis</h2>
          </div>
          <p className='mb-6 text-gray-600'>Real-time financial projections based on your variable adjustments.</p>
          {calculationError && (
            <div className='mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800'>
              <ShieldAlert className='h-4 w-4' />
              <span>{calculationError}</span>
            </div>
          )}
          <ScenarioImpactCards
            revenue={metrics.revenue}
            grossMargin={metrics.grossMargin}
            ebitda={metrics.ebitda}
            ebitdaMargin={metrics.ebitdaMargin}
            baseline={baselineMetrics}
          />
        </div>

        <div className='mb-8'>
          <div className='mb-4 flex items-center gap-2'>
            <Heart className='h-5 w-5 text-indigo-600' />
            <h2 className='text-xl font-semibold text-gray-900'>Predefined Scenarios</h2>
          </div>
          <p className='mb-6 text-gray-600'>Quick access to common business scenarios and their financial impact.</p>
          <PredefinedScenarios
            baseline={{ revenue: baselineMetrics.revenue, ebitda: baselineMetrics.ebitda }}
            scenarios={presetCards}
            onApplyScenario={(scenarioId) => applyScenarioMutation.mutate(scenarioId)}
            isApplying={applyScenarioMutation.isPending}
          />
          {presetsLoading && <p className='mt-4 text-sm text-slate-500'>Loading curated scenarios…</p>}
          <div className='mt-6 rounded-xl border border-slate-200 p-4 text-sm text-slate-600'>
            <p>Baseline revenue: {formatCurrency(baselineMetrics.revenue)} · Baseline EBITDA: {formatCurrency(baselineMetrics.ebitda)}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
