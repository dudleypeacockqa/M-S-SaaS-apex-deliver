import React from 'react';
import { fireEvent, screen, within, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import { renderWithQueryClient } from '../../setupTests';
import { WhatIfAnalysis } from '@/modules/fpa/pages/WhatIfAnalysis';

const { getScenarioPresetsMock, calculateScenarioImpactMock, applyScenarioMock } = vi.hoisted(() => ({
  getScenarioPresetsMock: vi.fn(),
  calculateScenarioImpactMock: vi.fn(),
  applyScenarioMock: vi.fn(),
}));

const baselineMetrics = {
  revenue: 10_760_000,
  gross_margin: 67.6,
  ebitda: 2_970_000,
  ebitda_margin: 27.6,
};

const scenarioPresets = [
  {
    id: 'aggressive-growth',
    name: 'Aggressive Expansion',
    description: 'Maximize throughput and pricing power for hyper-growth targets.',
    variables: {
      gaba_red_price: 34,
      gaba_black_price: 36,
      gaba_gold_price: 50,
      production_volume: 135,
      material_costs: 95,
      labor_efficiency: 110,
    },
    revenue_impact: 18,
    ebitda_impact: 14,
  },
  {
    id: 'defensive-moat',
    name: 'Margin Protection',
    description: 'Rebalance pricing mix to defend EBITDA during volatility.',
    variables: {
      gaba_red_price: 31,
      gaba_black_price: 30,
      gaba_gold_price: 47,
      production_volume: 95,
      material_costs: 90,
      labor_efficiency: 120,
    },
    revenue_impact: 4,
    ebitda_impact: 11,
  },
];

vi.mock('@/modules/fpa/services/fpaApi', async () => {
  const actual = await vi.importActual<typeof import('@/modules/fpa/services/fpaApi')>(
    '@/modules/fpa/services/fpaApi'
  );
  return {
    ...actual,
    fpaApi: {
      ...actual.fpaApi,
      getScenarioPresets: getScenarioPresetsMock,
      calculateScenarioImpact: calculateScenarioImpactMock,
      applyScenario: applyScenarioMock,
    },
  };
});

vi.mock('@/modules/fpa/components/DashboardLayout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dashboard-layout">{children}</div>
  ),
}));

const renderPage = () => renderWithQueryClient(<WhatIfAnalysis />);

describe('Integration: WhatIfAnalysis workflow', () => {
  beforeEach(() => {
    getScenarioPresetsMock.mockResolvedValue(scenarioPresets);
    calculateScenarioImpactMock.mockImplementation(
      async (payload: { variables: typeof scenarioPresets[number]['variables'] }) => {
        const multiplier = payload.variables.production_volume / 100;
        return {
          metrics: {
            revenue: Math.round(baselineMetrics.revenue * multiplier),
            gross_margin: baselineMetrics.gross_margin,
            ebitda: Math.round(baselineMetrics.ebitda * multiplier),
            ebitda_margin: baselineMetrics.ebitda_margin,
          },
          baseline: baselineMetrics,
        };
      }
    );
    applyScenarioMock.mockImplementation(async (scenarioId: string) => {
      const scenario = scenarioPresets.find((preset) => preset.id === scenarioId);
      if (!scenario) {
        throw new Error('Scenario not found');
      }
      const multiplier = scenario.variables.production_volume / 100;
      return {
        scenario,
        metrics: {
          revenue: Math.round(baselineMetrics.revenue * multiplier),
          gross_margin: 70.1,
          ebitda: Math.round(baselineMetrics.ebitda * multiplier * 1.05),
          ebitda_margin: 31.4,
        },
        baseline: baselineMetrics,
      };
    });
  });

  it('syncs metrics when production volume slider is adjusted', async () => {
    renderPage();

    const slider = await screen.findByLabelText('Production Volume (%)');
    fireEvent.change(slider, { target: { value: '120' } });

    await waitFor(() => {
      expect(calculateScenarioImpactMock).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: expect.objectContaining({ production_volume: 120 }),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText('\u00A312.9M')).toBeInTheDocument();
    });
    expect(getScenarioPresetsMock).toHaveBeenCalledTimes(1);
  });

  it('applies a curated scenario and surfaces updated metrics', async () => {
    renderPage();

    const aggressiveCard = await screen.findByText('Aggressive Expansion');
    const card = aggressiveCard.closest('.rounded-xl');
    const button = card ? within(card).getByRole('button', { name: /apply scenario/i }) : null;
    expect(button).not.toBeNull();

    fireEvent.click(button!);

    await waitFor(() => {
      expect(applyScenarioMock).toHaveBeenCalledWith('aggressive-growth');
    });

    await waitFor(() => {
      expect(screen.getByText('\u00A314.5M')).toBeInTheDocument();
    });
    expect(screen.getByText(/Baseline revenue:/i)).toBeInTheDocument();
  });
});

