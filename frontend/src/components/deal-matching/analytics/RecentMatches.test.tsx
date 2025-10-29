import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RecentMatches } from './RecentMatches';

describe('RecentMatches', () => {
  it('renders a list of recent matches', () => {
    render(
      <RecentMatches
        matches={[
          { id: '1', name: 'Alpha Corp Acquisition', score: 90, status: 'saved' },
          { id: '2', name: 'Beta Analytics', score: 72, status: 'intro_requested' },
        ]}
      />
    );

    expect(screen.getByTestId('recent-matches')).toBeInTheDocument();
    expect(screen.getByText('Alpha Corp Acquisition')).toBeInTheDocument();
    expect(screen.getByText(/Status: saved/i)).toBeInTheDocument();
  });

  it('renders empty state when no matches provided', () => {
    render(<RecentMatches matches={[]} />);

    expect(screen.getByText(/no recent matches/i)).toBeInTheDocument();
  });
});
