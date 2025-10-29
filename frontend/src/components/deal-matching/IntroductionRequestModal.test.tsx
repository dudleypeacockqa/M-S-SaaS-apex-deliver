/**
 * Tests for IntroductionRequestModal Component
 * TDD RED phase - Write failing tests first
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntroductionRequestModal } from './IntroductionRequestModal';

// Mock API service
vi.mock('../../services/dealMatchingService', () => ({
  recordMatchAction: vi.fn(),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('IntroductionRequestModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    renderWithProviders(
      <IntroductionRequestModal
        matchId="match-1"
        dealName="Acme Corp Acquisition"
        isOpen={false}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render modal with form when isOpen is true', () => {
    renderWithProviders(
      <IntroductionRequestModal
        matchId="match-1"
        dealName="Acme Corp Acquisition"
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Request Introduction')).toBeInTheDocument();
    expect(screen.getByText(/Acme Corp Acquisition/i)).toBeInTheDocument();
  });

  it('should display message textarea and disclosure level radios', () => {
    renderWithProviders(
      <IntroductionRequestModal
        matchId="match-1"
        dealName="Acme Corp Acquisition"
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/introduction message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full disclosure/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/limited disclosure/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/anonymous/i)).toBeInTheDocument();
  });

  it('should validate message is required', async () => {
    renderWithProviders(
      <IntroductionRequestModal
        matchId="match-1"
        dealName="Acme Corp Acquisition"
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const submitButton = screen.getByRole('button', { name: /send request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  it('should submit request with valid data', async () => {
    const { recordMatchAction } = await import('../../services/dealMatchingService');
    const mockRecordAction = vi.mocked(recordMatchAction).mockResolvedValue({
      id: 'action-1',
      match_id: 'match-1',
      user_id: 'user-1',
      action: 'request_intro',
      metadata: {
        message: 'I believe there is strong synergy between our portfolios.',
        disclosure_level: 'full',
      },
      created_at: '2025-10-29T10:00:00Z',
    });

    const onSuccess = vi.fn();

    renderWithProviders(
      <IntroductionRequestModal
        matchId="match-1"
        dealName="Acme Corp Acquisition"
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={onSuccess}
      />
    );

    // Fill in form
    const messageInput = screen.getByLabelText(/introduction message/i);
    fireEvent.change(messageInput, {
      target: { value: 'I believe there is strong synergy between our portfolios.' }
    });

    const fullDisclosureRadio = screen.getByLabelText(/full disclosure/i);
    fireEvent.click(fullDisclosureRadio);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /send request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRecordAction).toHaveBeenCalledWith('match-1', {
        action: 'request_intro',
        metadata: {
          message: 'I believe there is strong synergy between our portfolios.',
          disclosure_level: 'full',
        },
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should call onSuccess after submission', async () => {
    const { recordMatchAction } = await import('../../services/dealMatchingService');
    vi.mocked(recordMatchAction).mockResolvedValue({
      id: 'action-1',
      match_id: 'match-1',
      user_id: 'user-1',
      action: 'request_intro',
      metadata: {},
      created_at: '2025-10-29T10:00:00Z',
    });

    const onSuccess = vi.fn();

    renderWithProviders(
      <IntroductionRequestModal
        matchId="match-1"
        dealName="Acme Corp Acquisition"
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={onSuccess}
      />
    );

    // Fill required field
    const messageInput = screen.getByLabelText(/introduction message/i);
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    // Submit
    const submitButton = screen.getByRole('button', { name: /send request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('should show loading state during submission', async () => {
    const { recordMatchAction } = await import('../../services/dealMatchingService');
    vi.mocked(recordMatchAction).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    renderWithProviders(
      <IntroductionRequestModal
        matchId="match-1"
        dealName="Acme Corp Acquisition"
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    // Fill required field
    const messageInput = screen.getByLabelText(/introduction message/i);
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    // Submit
    const submitButton = screen.getByRole('button', { name: /send request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument();
    });
  });

  it('should close and reset form on cancel', () => {
    const onClose = vi.fn();

    renderWithProviders(
      <IntroductionRequestModal
        matchId="match-1"
        dealName="Acme Corp Acquisition"
        isOpen={true}
        onClose={onClose}
        onSuccess={vi.fn()}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
