import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MatchSuccessRate } from './MatchSuccessRate';

describe('MatchSuccessRate', () => {
  it('renders success metrics', () => {
    render(
      <MatchSuccessRate successRate={67} total={12} successCount={8} trendDelta={5} />
    );

    expect(screen.getByTestId('match-success-rate')).toBeInTheDocument();
    expect(screen.getByText(/8 of 12 matches/)).toBeInTheDocument();
    expect(screen.getByText(/Up 5% week-on-week/i)).toBeInTheDocument();
  });

  it('renders fallback trend when delta missing', () => {
    render(
      <MatchSuccessRate successRate={40} total={10} successCount={4} />
    );

    expect(screen.getByText(/no prior data/i)).toBeInTheDocument();
  });
});
