import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MatchCard } from './MatchCard';

const mockMatch = {
  id: 'match-1',
  dealId: 'deal-1',
  matchedDealId: 'matched-deal-1',
  dealName: 'Acme Corp Acquisition',
  score: 85.5,
  confidence: 'high' as const,
  explanation: {
    industry_match: { score: 0.9, reason: 'Perfect industry match - both in SaaS sector' },
    size_match: { score: 0.8, reason: 'Deal size within optimal range' },
    geography_match: { score: 0.85, reason: 'Both located in UK' },
    description_match: { score: 0.75, reason: 'Semantic similarity detected' },
  },
  status: 'pending',
};

describe('MatchCard', () => {
  it('renders match data correctly', () => {
    const onViewDetails = vi.fn();
    const onSave = vi.fn();
    const onPass = vi.fn();

    render(
      <MatchCard
        match={mockMatch}
        onViewDetails={onViewDetails}
        onSave={onSave}
        onPass={onPass}
      />
    );

    expect(screen.getByText('Acme Corp Acquisition')).toBeInTheDocument();
    expect(screen.getByText('Deal ID: matched-deal-1')).toBeInTheDocument();
  });

  it('displays score badge with correct confidence', () => {
    const onViewDetails = vi.fn();
    const onSave = vi.fn();
    const onPass = vi.fn();

    render(
      <MatchCard
        match={mockMatch}
        onViewDetails={onViewDetails}
        onSave={onSave}
        onPass={onPass}
      />
    );

    expect(screen.getByTestId('score-badge')).toBeInTheDocument();
    expect(screen.getByText('86%')).toBeInTheDocument(); // Rounded from 85.5
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('shows truncated explanation with View More button', () => {
    const onViewDetails = vi.fn();
    const onSave = vi.fn();
    const onPass = vi.fn();

    render(
      <MatchCard
        match={mockMatch}
        onViewDetails={onViewDetails}
        onSave={onSave}
        onPass={onPass}
      />
    );

    expect(screen.getByText(/Perfect industry match/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument();
  });

  it('calls onViewDetails when View Details clicked', () => {
    const onViewDetails = vi.fn();
    const onSave = vi.fn();
    const onPass = vi.fn();

    render(
      <MatchCard
        match={mockMatch}
        onViewDetails={onViewDetails}
        onSave={onSave}
        onPass={onPass}
      />
    );

    const viewButton = screen.getByRole('button', { name: /view details/i });
    fireEvent.click(viewButton);

    expect(onViewDetails).toHaveBeenCalledWith(mockMatch);
  });

  it('calls onSave when Save button clicked', () => {
    const onViewDetails = vi.fn();
    const onSave = vi.fn();
    const onPass = vi.fn();

    render(
      <MatchCard
        match={mockMatch}
        onViewDetails={onViewDetails}
        onSave={onSave}
        onPass={onPass}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save match/i });
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledWith(mockMatch.id);
  });

  it('calls onPass when Pass button clicked', () => {
    const onViewDetails = vi.fn();
    const onSave = vi.fn();
    const onPass = vi.fn();

    render(
      <MatchCard
        match={mockMatch}
        onViewDetails={onViewDetails}
        onSave={onSave}
        onPass={onPass}
      />
    );

    const passButton = screen.getByRole('button', { name: /pass/i });
    fireEvent.click(passButton);

    expect(onPass).toHaveBeenCalledWith(mockMatch.id);
  });

  it('shows loading state during actions', () => {
    const onViewDetails = vi.fn();
    const onSave = vi.fn();
    const onPass = vi.fn();

    render(
      <MatchCard
        match={mockMatch}
        onViewDetails={onViewDetails}
        onSave={onSave}
        onPass={onPass}
        loading={true}
      />
    );

    const saveButton = screen.getByTestId('save-match-button');
    const passButton = screen.getByTestId('pass-match-button');

    expect(saveButton).toBeDisabled();
    expect(passButton).toBeDisabled();
  });

  it('applies hover styles with transition', () => {
    const onViewDetails = vi.fn();
    const onSave = vi.fn();
    const onPass = vi.fn();

    render(
      <MatchCard
        match={mockMatch}
        onViewDetails={onViewDetails}
        onSave={onSave}
        onPass={onPass}
      />
    );

    const card = screen.getByTestId('match-card');
    expect(card).toHaveClass('hover:shadow-lg');
    expect(card).toHaveClass('transition-all');
  });
});
