import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MatchScoreBadge } from './MatchScoreBadge';

describe('MatchScoreBadge', () => {
  it('renders high confidence badge for score >= 80', () => {
    render(<MatchScoreBadge score={85} />);

    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByTestId('score-badge')).toHaveClass('bg-green-500');
  });

  it('renders medium confidence badge for score 60-79', () => {
    render(<MatchScoreBadge score={70} />);

    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByTestId('score-badge')).toHaveClass('bg-yellow-500');
  });

  it('renders low confidence badge for score < 60', () => {
    render(<MatchScoreBadge score={45} />);

    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByTestId('score-badge')).toHaveClass('bg-red-500');
  });

  it('rounds score to nearest integer', () => {
    render(<MatchScoreBadge score={73.7} />);

    expect(screen.getByText('74%')).toBeInTheDocument();
  });
});
