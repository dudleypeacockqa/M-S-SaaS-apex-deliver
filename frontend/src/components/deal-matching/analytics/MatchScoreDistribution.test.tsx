import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MatchScoreDistribution } from './MatchScoreDistribution';

describe('MatchScoreDistribution', () => {
  it('renders empty state when total is 0', () => {
    render(
      <MatchScoreDistribution
        total={0}
        distribution={{ high: 0, medium: 0, low: 0 }}
      />
    );

    expect(screen.getByTestId('score-distribution-empty')).toBeInTheDocument();
  });

  it('renders bars proportional to distribution', () => {
    render(
      <MatchScoreDistribution
        total={10}
        distribution={{ high: 5, medium: 3, low: 2 }}
      />
    );

    const widget = screen.getByTestId('score-distribution');
    expect(widget).toBeInTheDocument();
    expect(widget.textContent).toContain('High (≥80)');
    expect(widget.textContent).toContain('Medium (60-79)');
    expect(widget.textContent).toContain('Low (<60)');
  });
});
