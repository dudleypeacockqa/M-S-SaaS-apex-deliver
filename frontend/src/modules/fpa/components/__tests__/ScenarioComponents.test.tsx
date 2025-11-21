import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ScenarioSlider } from '../ScenarioSlider';
import { ScenarioImpactCards } from '../ScenarioImpactCards';
import { PredefinedScenarios } from '../PredefinedScenarios';

describe('ScenarioSlider', () => {
  it('renders label and formatted value', () => {
    render(
      <ScenarioSlider
        label="Production Volume"
        value={110}
        min={80}
        max={140}
        unit="%"
        formatValue={(value) => `${value.toFixed(0)}%`}
        onChange={() => undefined}
      />
    );

    expect(screen.getByText(/production volume/i)).toBeInTheDocument();
    expect(screen.getByText(/current: 110%/i)).toBeInTheDocument();
  });

  it('calls onChange when slider value changes', () => {
    const handleChange = vi.fn();
    render(
      <ScenarioSlider
        label="Labor Efficiency"
        value={95}
        min={70}
        max={130}
        onChange={handleChange}
      />
    );

    fireEvent.change(screen.getByRole('slider'), { target: { value: '105' } });
    expect(handleChange).toHaveBeenCalledWith(105);
  });
});

describe('ScenarioImpactCards', () => {
  it('displays formatted card values with baseline deltas', () => {
    render(
      <ScenarioImpactCards
        revenue={1_500_000}
        grossMargin={58.2}
        ebitda={325_000}
        ebitdaMargin={28.4}
        baseline={{
          revenue: 1_200_000,
          grossMargin: 57.0,
          ebitda: 300_000,
          ebitdaMargin: 27.1,
        }}
      />
    );

    expect(screen.getByText(/projected revenue/i)).toBeInTheDocument();
    expect(screen.getByText('EBITDA')).toBeInTheDocument();
    expect(screen.getByText('Baseline £1.2M')).toBeInTheDocument();
    expect(screen.getByText('£1.5M')).toBeInTheDocument();
    expect(screen.getByText('28.4%')).toBeInTheDocument();
  });
});

describe('PredefinedScenarios', () => {
  it('renders four scenario cards and fires apply callback', () => {
    const onApplyScenario = vi.fn();
    const scenarios = [
      { id: 'aggressive-growth', name: 'Aggressive Growth', description: 'Stretch top-line performance', revenueImpact: 10, ebitdaImpact: 3 },
      { id: 'efficiency-focus', name: 'Efficiency Focus', description: 'Optimize margins via opex discipline', revenueImpact: 4, ebitdaImpact: 5 },
      { id: 'defensive-mode', name: 'Defensive Mode', description: 'Protect EBITDA during downturns', revenueImpact: -2, ebitdaImpact: 2 },
      { id: 'platform-investment', name: 'Platform Investment', description: 'Invest in future-state automation', revenueImpact: 6, ebitdaImpact: -1 },
    ];

    render(
      <PredefinedScenarios
        baseline={{ revenue: 1_000_000, ebitda: 400_000 }}
        scenarios={scenarios}
        onApplyScenario={onApplyScenario}
      />
    );

    const applyButtons = screen.getAllByRole('button', { name: /apply scenario/i });
    expect(applyButtons).toHaveLength(scenarios.length);

    fireEvent.click(applyButtons[0]);
    expect(onApplyScenario).toHaveBeenCalledWith('aggressive-growth');
  });
});


