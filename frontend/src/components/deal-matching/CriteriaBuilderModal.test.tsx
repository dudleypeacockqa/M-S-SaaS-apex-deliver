/**
 * Tests for CriteriaBuilderModal Component
 * Ensures dynamic preset handling for DEV-018
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CriteriaBuilderModal } from './CriteriaBuilderModal';
import type { MatchCriteria } from '../../services/dealMatchingService';

vi.mock('../../services/dealMatchingService', () => ({
  createMatchCriteria: vi.fn(),
  updateMatchCriteria: vi.fn(),
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
        isOpen
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
        isOpen
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

  it('validates required fields before submission', async () => {
    renderWithProviders(
      <CriteriaBuilderModal
        isOpen
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /create criteria/i }));

    await waitFor(() => {
      expect(screen.getByText(/criteria name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/add at least one industry/i)).toBeInTheDocument();
    });
  });

  it('validates deal size boundaries', async () => {
    renderWithProviders(
      <CriteriaBuilderModal
        isOpen
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/minimum deal size/i), { target: { value: '5000000' } });
    fireEvent.change(screen.getByLabelText(/maximum deal size/i), { target: { value: '4000000' } });

    fireEvent.click(screen.getByRole('button', { name: /create criteria/i }));

    await waitFor(() => {
      expect(screen.getByText(/minimum must be less than maximum/i)).toBeInTheDocument();
    });
  });

  it('allows adding industries dynamically', async () => {
    renderWithProviders(
      <CriteriaBuilderModal
        isOpen
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/industries/i);
    fireEvent.change(input, { target: { value: 'SaaS' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByTestId('industry-tags')).toHaveTextContent('SaaS');
    });
  });

  it('allows selecting multiple geographies and includes them in submission', async () => {
    const { createMatchCriteria } = await import('../../services/dealMatchingService');
    const mockCreate = vi.mocked(createMatchCriteria).mockResolvedValue({
      id: 'criteria-geo',
      user_id: 'user-1',
      organization_id: 'org-1',
      name: 'Global Expansion',
      deal_type: 'buy_side',
      industries: ['saas'],
      min_deal_size: '2000000',
      max_deal_size: '15000000',
      geographies: ['united_kingdom', 'europe'],
      structures: ['integration::Salesforce'],
      negative_filters: {},
      weights: {},
      created_at: '2025-10-29T10:00:00Z',
    } as MatchCriteria);

    const onSuccess = vi.fn();

    renderWithProviders(
      <CriteriaBuilderModal
        isOpen
        onClose={vi.fn()}
        onSuccess={onSuccess}
      />
    );

    fireEvent.change(screen.getByLabelText(/criteria name/i), { target: { value: 'Global Expansion' } });

    const industriesInput = screen.getByLabelText(/industries/i);
    fireEvent.change(industriesInput, { target: { value: 'SaaS' } });
    fireEvent.keyDown(industriesInput, { key: 'Enter', code: 'Enter' });

    fireEvent.change(screen.getByLabelText(/minimum deal size/i), { target: { value: '2000000' } });
    fireEvent.change(screen.getByLabelText(/maximum deal size/i), { target: { value: '15000000' } });

    fireEvent.click(screen.getByLabelText(/united kingdom/i));
    fireEvent.click(screen.getByLabelText(/europe/i));

    fireEvent.click(screen.getByRole('button', { name: /create criteria/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          geographies: ['united_kingdom', 'europe'],
        })
      );
      expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({ id: 'criteria-geo' }));
    });
  });

  it('preloads existing criteria values when provided', () => {
    const existingCriteria: MatchCriteria = {
      id: 'criteria-existing',
      user_id: 'user-1',
      organization_id: 'org-1',
      name: 'Healthcare Sellers',
      deal_type: 'sell_side',
      industries: ['Healthcare'],
      min_deal_size: '500000',
      max_deal_size: '5000000',
      geographies: ['united_states', 'canada'],
      structures: ['integration::Netsuite'],
      negative_filters: {},
      weights: {},
      created_at: '2025-10-29T09:00:00Z',
    };

    renderWithProviders(
      <CriteriaBuilderModal
        isOpen
        onClose={vi.fn()}
        onSuccess={vi.fn()}
        initialCriteria={existingCriteria}
      />
    );

    expect((screen.getByLabelText(/criteria name/i) as HTMLInputElement).value).toBe('Healthcare Sellers');
    expect((screen.getByLabelText(/sell-side/i) as HTMLInputElement).checked).toBe(true);
    expect(screen.getByText('Healthcare')).toBeInTheDocument();
    expect((screen.getByLabelText(/minimum deal size/i) as HTMLInputElement).value).toBe('500000');
    expect((screen.getByLabelText(/maximum deal size/i) as HTMLInputElement).value).toBe('5000000');
    expect((screen.getByLabelText(/united states/i) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText(/canada/i) as HTMLInputElement).checked).toBe(true);
    expect(screen.getByDisplayValue('integration')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Netsuite')).toBeInTheDocument();
  });

  it('supports adding and removing custom fields', () => {
    renderWithProviders(
      <CriteriaBuilderModal
        isOpen
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText(/add custom field/i));

    const keyInput = screen.getByPlaceholderText(/label/i) as HTMLInputElement;
    const valueInput = screen.getByPlaceholderText(/value/i) as HTMLInputElement;

    fireEvent.change(keyInput, { target: { value: 'Integration' } });
    fireEvent.change(valueInput, { target: { value: 'Salesforce' } });

    expect(keyInput.value).toBe('Integration');
    expect(valueInput.value).toBe('Salesforce');

    fireEvent.click(screen.getByRole('button', { name: /remove integration field/i }));

    expect(screen.queryByTestId('custom-fields')).not.toBeInTheDocument();
  });

  it('submits create payload with dynamic fields', async () => {
    const { createMatchCriteria } = await import('../../services/dealMatchingService');
    const mockCreate = vi.mocked(createMatchCriteria).mockResolvedValue({
      id: 'criteria-1',
      user_id: 'user-1',
      organization_id: 'org-1',
      name: 'Tech Acquisitions Q4',
      deal_type: 'buy_side',
      industries: ['saas'],
      min_deal_size: '1000000',
      max_deal_size: '10000000',
      geographies: [],
      structures: ['Integration::Salesforce'],
      negative_filters: {},
      weights: {},
      created_at: '2025-10-29T10:00:00Z',
    } as MatchCriteria);

    const onSuccess = vi.fn();

    renderWithProviders(
      <CriteriaBuilderModal
        isOpen
        onClose={vi.fn()}
        onSuccess={onSuccess}
      />
    );

    fireEvent.change(screen.getByLabelText(/criteria name/i), { target: { value: 'Tech Acquisitions Q4' } });

    const industriesInput = screen.getByLabelText(/industries/i);
    fireEvent.change(industriesInput, { target: { value: 'SaaS' } });
    fireEvent.keyDown(industriesInput, { key: 'Enter', code: 'Enter' });

    fireEvent.change(screen.getByLabelText(/minimum deal size/i), { target: { value: '1000000' } });
    fireEvent.change(screen.getByLabelText(/maximum deal size/i), { target: { value: '10000000' } });

    fireEvent.click(screen.getByText(/add custom field/i));
    fireEvent.change(screen.getByPlaceholderText(/label/i), { target: { value: 'Integration' } });
    fireEvent.change(screen.getByPlaceholderText(/value/i), { target: { value: 'Salesforce' } });

    fireEvent.click(screen.getByRole('button', { name: /create criteria/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        name: 'Tech Acquisitions Q4',
        deal_type: 'buy_side',
        industries: ['saas'],
        min_deal_size: 1000000,
        max_deal_size: 10000000,
        geographies: [],
        structures: ['Integration::Salesforce'],
        negative_filters: {},
        weights: {},
      });
      expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({ id: 'criteria-1' }));
    });
  });

  it('submits update payload when editing an existing preset', async () => {
    const { updateMatchCriteria } = await import('../../services/dealMatchingService');
    const updatedCriteria: MatchCriteria = {
      id: 'criteria-edit',
      user_id: 'user-1',
      organization_id: 'org-1',
      name: 'Healthcare Sellers Updated',
      deal_type: 'sell_side',
      industries: ['healthcare'],
      min_deal_size: '500000',
      max_deal_size: '5000000',
      geographies: [],
      structures: [],
      negative_filters: {},
      weights: {},
      created_at: '2025-10-29T09:00:00Z',
    };

    vi.mocked(updateMatchCriteria).mockResolvedValue(updatedCriteria);

    const existingCriteria: MatchCriteria = {
      ...updatedCriteria,
      name: 'Healthcare Sellers',
    };

    const onSuccess = vi.fn();

    renderWithProviders(
      <CriteriaBuilderModal
        isOpen
        onClose={vi.fn()}
        onSuccess={onSuccess}
        initialCriteria={existingCriteria}
      />
    );

    fireEvent.change(screen.getByLabelText(/criteria name/i), {
      target: { value: 'Healthcare Sellers Updated' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save criteria/i }));

    await waitFor(() => {
      expect(updateMatchCriteria).toHaveBeenCalledWith('criteria-edit', expect.objectContaining({
        name: 'Healthcare Sellers Updated',
      }));
      expect(onSuccess).toHaveBeenCalledWith(updatedCriteria);
    });
  });

  it('shows loading state during submission', async () => {
    const { createMatchCriteria } = await import('../../services/dealMatchingService');
    vi.mocked(createMatchCriteria).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                id: 'slow-criteria',
                user_id: 'user-1',
                organization_id: 'org-1',
                name: 'Slow Criteria',
                deal_type: 'buy_side',
                industries: ['saas'],
                min_deal_size: '1000000',
                max_deal_size: '5000000',
                geographies: [],
                structures: [],
                negative_filters: {},
                weights: {},
                created_at: '2025-10-29T10:00:00Z',
              } as MatchCriteria),
            250,
          ),
        ),
    );

    renderWithProviders(
      <CriteriaBuilderModal
        isOpen
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/criteria name/i), { target: { value: 'Slow Criteria' } });
    const industriesInput = screen.getByLabelText(/industries/i);
    fireEvent.change(industriesInput, { target: { value: 'SaaS' } });
    fireEvent.keyDown(industriesInput, { key: 'Enter', code: 'Enter' });
    fireEvent.change(screen.getByLabelText(/minimum deal size/i), { target: { value: '1000000' } });
    fireEvent.change(screen.getByLabelText(/maximum deal size/i), { target: { value: '5000000' } });

    fireEvent.click(screen.getByRole('button', { name: /create criteria/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /creating/i })).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();

    renderWithProviders(
      <CriteriaBuilderModal
        isOpen
        onClose={onClose}
        onSuccess={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes modal on backdrop click', () => {
    const onClose = vi.fn();

    renderWithProviders(
      <CriteriaBuilderModal
        isOpen
        onClose={onClose}
        onSuccess={vi.fn()}
      />
    );

    const backdrop = screen.getByRole('dialog').parentElement;
    if (!backdrop) {
      throw new Error('Backdrop not found');
    }

    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
