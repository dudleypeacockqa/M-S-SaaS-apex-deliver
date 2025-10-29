/**
 * Tests for CriteriaBuilderModal Component
 * TDD RED phase - Write failing tests first
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CriteriaBuilderModal } from './CriteriaBuilderModal';

// Mock API service
vi.mock('../../services/dealMatchingService', () => ({
  createMatchCriteria: vi.fn(),
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

describe('CriteriaBuilderModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    renderWithProviders(
      <CriteriaBuilderModal
        isOpen={false}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render modal when isOpen is true', () => {
    renderWithProviders(
      <CriteriaBuilderModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Create Matching Criteria')).toBeInTheDocument();
  });

  it('should display all required form fields', () => {
    renderWithProviders(
      <CriteriaBuilderModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/criteria name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/buy-side/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sell-side/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/industries/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/minimum deal size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/maximum deal size/i)).toBeInTheDocument();
  });

  it('should validate required fields on submit', async () => {
    renderWithProviders(
      <CriteriaBuilderModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create criteria/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/criteria name is required/i)).toBeInTheDocument();
    });
  });

  it('should validate minimum deal size is less than maximum', async () => {
    renderWithProviders(
      <CriteriaBuilderModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const minInput = screen.getByLabelText(/minimum deal size/i);
    const maxInput = screen.getByLabelText(/maximum deal size/i);

    fireEvent.change(minInput, { target: { value: '10000000' } });
    fireEvent.change(maxInput, { target: { value: '1000000' } });

    const submitButton = screen.getByRole('button', { name: /create criteria/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/minimum must be less than maximum/i)).toBeInTheDocument();
    });
  });

  it('should allow adding industries via input', async () => {
    renderWithProviders(
      <CriteriaBuilderModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const industriesInput = screen.getByLabelText(/industries/i);

    fireEvent.change(industriesInput, { target: { value: 'SaaS' } });
    fireEvent.keyDown(industriesInput, { key: 'Enter', code: 'Enter' });

    // Allow React state update to complete
    await waitFor(() => {
      expect(screen.getByText('SaaS')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should allow removing industries by clicking X', async () => {
    renderWithProviders(
      <CriteriaBuilderModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const industriesInput = screen.getByLabelText(/industries/i);

    fireEvent.change(industriesInput, { target: { value: 'SaaS' } });
    fireEvent.keyDown(industriesInput, { key: 'Enter', code: 'Enter' });

    // Wait for industry tag to appear
    await waitFor(() => {
      expect(screen.getByText('SaaS')).toBeInTheDocument();
    }, { timeout: 2000 });

    const removeButton = screen.getByRole('button', { name: /remove saas/i });
    fireEvent.click(removeButton);

    // Wait for industry tag to be removed
    await waitFor(() => {
      expect(screen.queryByText('SaaS')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should submit form with valid data', async () => {
    const { createMatchCriteria } = await import('../../services/dealMatchingService');
    const mockCreate = vi.mocked(createMatchCriteria).mockResolvedValue({
      id: 'criteria-1',
      user_id: 'user-1',
      organization_id: 'org-1',
      name: 'Tech Acquisitions Q4',
      deal_type: 'buy_side',
      industries: ['saas', 'fintech'],
      min_deal_size: '1000000',
      max_deal_size: '10000000',
      geographies: ['UK'],
      structures: [],
      negative_filters: {},
      weights: {},
      created_at: '2025-10-29T10:00:00Z',
    });

    const onSuccess = vi.fn();

    renderWithProviders(
      <CriteriaBuilderModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={onSuccess}
      />
    );

    // Fill in form
    fireEvent.change(screen.getByLabelText(/criteria name/i), {
      target: { value: 'Tech Acquisitions Q4' }
    });

    fireEvent.click(screen.getByLabelText(/buy-side/i));

    const industriesInput = screen.getByLabelText(/industries/i);
    fireEvent.change(industriesInput, { target: { value: 'SaaS' } });
    fireEvent.keyDown(industriesInput, { key: 'Enter', code: 'Enter' });

    // Wait for industry tag to be added
    await waitFor(() => {
      expect(screen.getByText('SaaS')).toBeInTheDocument();
    }, { timeout: 2000 });

    fireEvent.change(screen.getByLabelText(/minimum deal size/i), {
      target: { value: '1000000' }
    });

    fireEvent.change(screen.getByLabelText(/maximum deal size/i), {
      target: { value: '10000000' }
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create criteria/i });
    fireEvent.click(submitButton);

    // Wait for API call and success callback
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        name: 'Tech Acquisitions Q4',
        deal_type: 'buy_side',
        industries: ['saas'],
        min_deal_size: 1000000,
        max_deal_size: 10000000,
        geographies: [],
        structures: [],
      });
      expect(onSuccess).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('should show loading state during submission', async () => {
    const { createMatchCriteria } = await import('../../services/dealMatchingService');
    vi.mocked(createMatchCriteria).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    renderWithProviders(
      <CriteriaBuilderModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    // Fill minimal required fields
    fireEvent.change(screen.getByLabelText(/criteria name/i), {
      target: { value: 'Test' }
    });

    const industriesInput = screen.getByLabelText(/industries/i);
    fireEvent.change(industriesInput, { target: { value: 'SaaS' } });
    fireEvent.keyDown(industriesInput, { key: 'Enter', code: 'Enter' });

    fireEvent.change(screen.getByLabelText(/minimum deal size/i), {
      target: { value: '1000000' }
    });

    fireEvent.change(screen.getByLabelText(/maximum deal size/i), {
      target: { value: '10000000' }
    });

    const submitButton = screen.getByRole('button', { name: /create criteria/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /creating/i })).toBeInTheDocument();
    });
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();

    renderWithProviders(
      <CriteriaBuilderModal
        isOpen={true}
        onClose={onClose}
        onSuccess={vi.fn()}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should close modal on backdrop click', () => {
    const onClose = vi.fn();

    renderWithProviders(
      <CriteriaBuilderModal
        isOpen={true}
        onClose={onClose}
        onSuccess={vi.fn()}
      />
    );

    const backdrop = screen.getByRole('dialog').parentElement;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    }
  });
});
