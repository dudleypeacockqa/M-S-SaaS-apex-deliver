/**
 * Tests for MatchDetailModal Component
 * TDD RED phase - Write failing tests first
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MatchDetailModal } from './MatchDetailModal';
import type { DealMatch } from '../../services/dealMatchingService';

const mockMatch: DealMatch = {
  id: 'match-1',
  dealId: 'deal-1',
  matchedDealId: 'matched-deal-1',
  dealName: 'Acme Corp Acquisition',
  score: 85.5,
  confidence: 'high' as const,
  explanation: {
    industry_match: { score: 0.95, reason: 'Perfect industry match - both in SaaS sector' },
    size_match: { score: 0.80, reason: 'Deal size within optimal range' },
    geography_match: { score: 0.85, reason: 'Both located in UK' },
    description_match: { score: 0.75, reason: 'Strong semantic similarity in descriptions' },
  },
  status: 'pending',
  createdAt: '2025-10-29T10:00:00Z',
};

describe('MatchDetailModal', () => {
  it('should not render when isOpen is false', () => {
    render(
      <MatchDetailModal
        match={mockMatch}
        isOpen={false}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onPass={vi.fn()}
        onRequestIntro={vi.fn()}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render modal when isOpen is true', () => {
    render(
      <MatchDetailModal
        match={mockMatch}
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onPass={vi.fn()}
        onRequestIntro={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp Acquisition')).toBeInTheDocument();
  });

  it('should display match score and confidence badge', () => {
    render(
      <MatchDetailModal
        match={mockMatch}
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onPass={vi.fn()}
        onRequestIntro={vi.fn()}
      />
    );

    expect(screen.getByText('86%')).toBeInTheDocument(); // Rounded from 85.5
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('should display explanation breakdown with scores', () => {
    render(
      <MatchDetailModal
        match={mockMatch}
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onPass={vi.fn()}
        onRequestIntro={vi.fn()}
      />
    );

    expect(screen.getByText('Industry Match')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument(); // industry_match score
    expect(screen.getByText(/Perfect industry match/i)).toBeInTheDocument();

    expect(screen.getByText('Size Match')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();

    expect(screen.getByText('Geography Match')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();

    expect(screen.getByText('Description Match')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();

    render(
      <MatchDetailModal
        match={mockMatch}
        isOpen={true}
        onClose={onClose}
        onSave={vi.fn()}
        onPass={vi.fn()}
        onRequestIntro={vi.fn()}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onSave when Save button is clicked', () => {
    const onSave = vi.fn();

    render(
      <MatchDetailModal
        match={mockMatch}
        isOpen={true}
        onClose={vi.fn()}
        onSave={onSave}
        onPass={vi.fn()}
        onRequestIntro={vi.fn()}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save match/i });
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledWith('match-1');
  });

  it('should call onPass when Pass button is clicked', () => {
    const onPass = vi.fn();

    render(
      <MatchDetailModal
        match={mockMatch}
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onPass={onPass}
        onRequestIntro={vi.fn()}
      />
    );

    const passButton = screen.getByRole('button', { name: /pass/i });
    fireEvent.click(passButton);

    expect(onPass).toHaveBeenCalledWith('match-1');
  });

  it('should call onRequestIntro when Request Introduction button is clicked', () => {
    const onRequestIntro = vi.fn();

    render(
      <MatchDetailModal
        match={mockMatch}
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onPass={vi.fn()}
        onRequestIntro={onRequestIntro}
      />
    );

    const requestButton = screen.getByRole('button', { name: /request introduction/i });
    fireEvent.click(requestButton);

    expect(onRequestIntro).toHaveBeenCalledWith('match-1');
  });

  it('should close modal when clicking backdrop', () => {
    const onClose = vi.fn();

    render(
      <MatchDetailModal
        match={mockMatch}
        isOpen={true}
        onClose={onClose}
        onSave={vi.fn()}
        onPass={vi.fn()}
        onRequestIntro={vi.fn()}
      />
    );

    const backdrop = screen.getByRole('dialog').parentElement;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    }
  });
});
