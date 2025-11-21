import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import { renderWithQueryClient } from '../../setupTests';
import { DealPipeline } from '@/pages/deals/DealPipeline';

const { listDealsMock, updateDealStageMock } = vi.hoisted(() => ({
  listDealsMock: vi.fn(),
  updateDealStageMock: vi.fn(),
}));

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('@/modules/deals/components/DealKanbanBoard', () => ({
  DealKanbanBoard: ({
    deals,
    onDealMove,
  }: {
    deals: Array<{ id: string }>;
    onDealMove: (dealId: string, newStage: string) => void;
  }) => (
    <div data-testid="deal-kanban-board">
      <p data-testid="deal-count">{deals.length} deals loaded</p>
      <button onClick={() => deals.length > 0 && onDealMove(deals[0].id, 'negotiation')}>
        Move First Deal
      </button>
    </div>
  ),
}));

vi.mock('@/services/api/deals', async () => {
  const actual = await vi.importActual<typeof import('@/services/api/deals')>('@/services/api/deals');
  return {
    ...actual,
    listDeals: listDealsMock,
    updateDealStage: updateDealStageMock,
  };
});

const pipelineDeals = [
  {
    id: 'deal-001',
    name: 'Capstone Analytics Acquisition',
    target_company: 'Capstone Analytics',
    industry: 'Analytics',
    deal_size: 12500000,
    currency: 'GBP',
    stage: 'due_diligence',
    owner_id: 'owner-1',
    organization_id: 'org-1',
    description: null,
    archived_at: null,
    created_at: '2025-10-01T12:00:00Z',
    updated_at: '2025-10-10T09:30:00Z',
  },
  {
    id: 'deal-002',
    name: 'Northwind Manufacturing Buyout',
    target_company: 'Northwind Manufacturing',
    industry: 'Manufacturing',
    deal_size: 42000000,
    currency: 'GBP',
    stage: 'negotiation',
    owner_id: 'owner-2',
    organization_id: 'org-1',
    description: null,
    archived_at: null,
    created_at: '2025-09-15T15:45:00Z',
    updated_at: '2025-10-12T08:15:00Z',
  },
  {
    id: 'deal-003',
    name: 'Helios Health Platform',
    target_company: 'Helios Health',
    industry: 'Healthcare',
    deal_size: 9500000,
    currency: 'GBP',
    stage: 'evaluation',
    owner_id: 'owner-3',
    organization_id: 'org-1',
    description: null,
    archived_at: null,
    created_at: '2025-10-05T10:00:00Z',
    updated_at: '2025-10-08T14:22:00Z',
  },
];

const formatTotalValue = (value: number) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

describe('Integration: DealPipeline workflow', () => {
  beforeEach(() => {
    listDealsMock.mockResolvedValue({
      items: pipelineDeals,
      total: pipelineDeals.length,
      page: 1,
      per_page: 100,
      total_pages: 1,
    });
    updateDealStageMock.mockResolvedValue({
      ...pipelineDeals[0],
      stage: 'negotiation',
    });
    navigateMock.mockReset();
  });

  it('renders summary metrics and navigates to the new deal form', async () => {
    renderWithQueryClient(<DealPipeline />);

    expect(
      await screen.findByRole('heading', { name: /Pipeline Command Center/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/3 active mandates/i)).toBeInTheDocument();
    expect(
      screen.getByText(formatTotalValue(12500000 + 42000000 + 9500000))
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /New Deal/i }));
    expect(navigateMock).toHaveBeenCalledWith('/deals/new');
  });

  it('invokes stage mutation when the board requests a move', async () => {
    renderWithQueryClient(<DealPipeline />);

    const trigger = await screen.findByRole('button', { name: /Move First Deal/i });
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(updateDealStageMock).toHaveBeenCalledWith('deal-001', 'negotiation');
    });
    expect(screen.getByTestId('deal-count')).toHaveTextContent('3 deals loaded');
  });
});

