import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DealDetails } from './DealDetails';
import * as dealsApi from '../../services/api/deals';
import * as dealsHooks from '../../hooks/deals';

// Mock the deals API
vi.mock('../../services/api/deals', () => ({
  getDeal: vi.fn(),
  updateDeal: vi.fn(),
  archiveDeal: vi.fn(),
  unarchiveDeal: vi.fn(),
  formatCurrency: (amount: number | null, currency = 'GBP') => {
    if (amount === null) return 'N/A';
    return `£${amount.toLocaleString()}`;
  },
  getStageDisplayName: (stage: string) => {
    const names: Record<string, string> = {
      sourcing: 'Sourcing',
      evaluation: 'Evaluation',
      due_diligence: 'Due Diligence',
      negotiation: 'Negotiation',
      closing: 'Closing',
      won: 'Won',
      lost: 'Lost',
    };
    return names[stage] || stage;
  },
  getStageColor: (stage: string) => '#64748b',
}));

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockDeal = {
  id: 'deal-123',
  name: 'Acme Corp Acquisition',
  target_company: 'Acme Corporation Ltd',
  industry: 'Technology',
  deal_size: 5000000,
  currency: 'GBP',
  stage: 'due_diligence' as const,
  owner_id: 'user1',
  organization_id: 'org1',
  description: 'Strategic acquisition to expand market share',
  archived_at: null,
  created_at: '2025-10-20T10:00:00Z',
  updated_at: '2025-10-23T14:30:00Z',
};

const renderDealDetails = (dealId: string = 'deal-123') => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/deals/${dealId}`]}>
        <Routes>
          <Route path="/deals/:dealId" element={<DealDetails />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('DealDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.mocked(dealsApi.getDeal).mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep loading
    );

    renderDealDetails();
    expect(screen.getByText('Loading deal details...')).toBeInTheDocument();
  });

  it('should display deal details after loading', async () => {
    vi.mocked(dealsApi.getDeal).mockResolvedValue(mockDeal);

    renderDealDetails();

    await waitFor(() => {
      expect(screen.getAllByText('Acme Corp Acquisition')[0]).toBeInTheDocument();
    });

    // Check all key details are displayed
    expect(screen.getAllByText('Acme Corporation Ltd')[0]).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('£5,000,000')).toBeInTheDocument();
    expect(screen.getAllByText('Due Diligence')[0]).toBeInTheDocument();
    expect(screen.getByText('Strategic acquisition to expand market share')).toBeInTheDocument();
  });

  it('should display "Edit" button when not in edit mode', async () => {
    vi.mocked(dealsApi.getDeal).mockResolvedValue(mockDeal);

    renderDealDetails();

    await waitFor(() => {
      expect(screen.getByText('Edit Deal')).toBeInTheDocument();
    });
  });

  it('should display "Archive" button for non-archived deals', async () => {
    vi.mocked(dealsApi.getDeal).mockResolvedValue(mockDeal);

    renderDealDetails();

    await waitFor(() => {
      expect(screen.getByText('Archive')).toBeInTheDocument();
    });
  });

  it('should display "Unarchive" button for archived deals', async () => {
    const archivedDeal = {
      ...mockDeal,
      archived_at: '2025-10-24T10:00:00Z',
    };

    vi.mocked(dealsApi.getDeal).mockResolvedValue(archivedDeal);

    renderDealDetails();

    await waitFor(() => {
      // Archived deals should not show Archive button
      expect(screen.queryByText('Archive')).not.toBeInTheDocument();
    });
  });

  it('should enter edit mode when Edit button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(dealsApi.getDeal).mockResolvedValue(mockDeal);

    renderDealDetails();

    await waitFor(() => {
      expect(screen.getByText('Edit Deal')).toBeInTheDocument();
    });

    const editButton = screen.getByText('Edit Deal');
    await user.click(editButton);

    // Should show Save and Cancel buttons in edit mode
    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.queryByText('Edit Deal')).not.toBeInTheDocument();
  });

  it('should call updateDeal API when saving changes', async () => {
    const user = userEvent.setup();
    vi.mocked(dealsApi.getDeal).mockResolvedValue(mockDeal);
    vi.mocked(dealsApi.updateDeal).mockResolvedValue({
      ...mockDeal,
      name: 'Updated Deal Name',
    });

    renderDealDetails();

    await waitFor(() => {
      expect(screen.getByText('Edit Deal')).toBeInTheDocument();
    });

    const editButton = screen.getByText('Edit Deal');
    await user.click(editButton);

    // Wait for edit mode
    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save Changes');
    await user.click(saveButton);

    await waitFor(() => {
      expect(dealsApi.updateDeal).toHaveBeenCalledWith('deal-123', expect.any(Object));
    });
  });

  it('should call archiveDeal API when Archive button is clicked', async () => {
    vi.mocked(dealsApi.getDeal).mockResolvedValue(mockDeal);
    vi.mocked(dealsApi.archiveDeal).mockResolvedValue({
      message: 'Deal archived successfully',
      deal_id: 'deal-123',
    });

    // Mock window.confirm to always return true
    global.confirm = vi.fn().mockReturnValue(true);

    renderDealDetails();

    await waitFor(() => {
      expect(screen.getByText('Archive')).toBeInTheDocument();
    });

    const archiveButton = screen.getByText('Archive');
    archiveButton.click();

    await waitFor(() => {
      expect(dealsApi.archiveDeal).toHaveBeenCalledWith('deal-123');
    });

    // Should navigate back to pipeline after archiving
    expect(mockNavigate).toHaveBeenCalledWith('/deals');
  });

  it('should not show action buttons for archived deals', async () => {
    const archivedDeal = {
      ...mockDeal,
      archived_at: '2025-10-24T10:00:00Z',
    };

    vi.mocked(dealsApi.getDeal).mockResolvedValue(archivedDeal);

    renderDealDetails();

    await waitFor(() => {
      expect(screen.getAllByText('Acme Corp Acquisition')[0]).toBeInTheDocument();
    });

    // Archived deals should not show Edit or Archive buttons
    expect(screen.queryByText('Edit Deal')).not.toBeInTheDocument();
    expect(screen.queryByText('Archive')).not.toBeInTheDocument();
  });

  it('should show error state when API call fails', async () => {
    vi.mocked(dealsApi.getDeal).mockRejectedValue(
      new Error('Deal not found')
    );

    renderDealDetails();

    await waitFor(() => {
      expect(screen.getByText('Error Loading Deal')).toBeInTheDocument();
    });

    expect(screen.getByText('Deal not found')).toBeInTheDocument();
    expect(screen.getByText('Back to Pipeline')).toBeInTheDocument();
  });

  it('should navigate back to pipeline when Back button is clicked', async () => {
    vi.mocked(dealsApi.getDeal).mockResolvedValue(mockDeal);

    renderDealDetails();

    await waitFor(() => {
      expect(screen.getAllByText('Acme Corp Acquisition')[0]).toBeInTheDocument();
    });

    const backButton = screen.getAllByText('Back to Pipeline')[0];
    backButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/deals');
  });

  it('should display deal timestamps', async () => {
    vi.mocked(dealsApi.getDeal).mockResolvedValue(mockDeal);

    renderDealDetails();

    await waitFor(() => {
      expect(screen.getAllByText('Acme Corp Acquisition')[0]).toBeInTheDocument();
    });

    // Should display created and updated labels in technical details section
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Last Updated')).toBeInTheDocument();
  });

  it('should handle deals with minimal information', async () => {
    const minimalDeal = {
      id: 'deal-456',
      name: 'Basic Deal',
      target_company: 'Target Co',
      industry: null,
      deal_size: null,
      currency: 'GBP',
      stage: 'sourcing' as const,
      owner_id: 'user1',
      organization_id: 'org1',
      description: null,
      archived_at: null,
      created_at: '2025-10-24T10:00:00Z',
      updated_at: '2025-10-24T10:00:00Z',
    };

    vi.mocked(dealsApi.getDeal).mockResolvedValue(minimalDeal);

    renderDealDetails('deal-456');

    await waitFor(() => {
      expect(screen.getAllByText('Basic Deal')[0]).toBeInTheDocument();
    });

    expect(screen.getAllByText('Target Co')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Sourcing')[0]).toBeInTheDocument();
  });

  // Phase 2A: Tabbed Interface Tests (TDD RED)
  describe('Tabbed Interface', () => {
    it('should render tab navigation with Overview, Financials, Documents, and Team tabs', async () => {
      vi.mocked(dealsApi.getDeal).mockResolvedValue(mockDeal);

      renderDealDetails();

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /overview/i })).toBeInTheDocument();
      });

      expect(screen.getByRole('tab', { name: /financials/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /documents/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /team/i })).toBeInTheDocument();
    });

    it('should show Overview tab content by default', async () => {
      vi.mocked(dealsApi.getDeal).mockResolvedValue(mockDeal);

      renderDealDetails();

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /overview/i })).toHaveAttribute('aria-selected', 'true');
      });

      // Overview content should be visible (deal information)
      expect(screen.getByText('Deal Information')).toBeInTheDocument();
    });

    it('should switch to Financials tab when clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(dealsApi.getDeal).mockResolvedValue(mockDeal);

      renderDealDetails();

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /financials/i })).toBeInTheDocument();
      });

      const financialsTab = screen.getByRole('tab', { name: /financials/i });
      await user.click(financialsTab);

      await waitFor(() => {
        expect(financialsTab).toHaveAttribute('aria-selected', 'true');
      });

      // Financials content should be visible
      expect(screen.getByText(/financial overview/i)).toBeInTheDocument();
    });

    it('should switch to Documents tab when clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(dealsApi.getDeal).mockResolvedValue(mockDeal);

      renderDealDetails();

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /documents/i })).toBeInTheDocument();
      });

      const documentsTab = screen.getByRole('tab', { name: /documents/i });
      await user.click(documentsTab);

      await waitFor(() => {
        expect(documentsTab).toHaveAttribute('aria-selected', 'true');
      });

      // Documents content should be visible
      expect(screen.getByText(/deal documents/i)).toBeInTheDocument();
    });

    it('should switch to Team tab when clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(dealsApi.getDeal).mockResolvedValue(mockDeal);

      renderDealDetails();

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /team/i })).toBeInTheDocument();
      });

      const teamTab = screen.getByRole('tab', { name: /team/i });
      await user.click(teamTab);

      await waitFor(() => {
        expect(teamTab).toHaveAttribute('aria-selected', 'true');
      });

      // Team content should be visible
      expect(screen.getByText(/deal team/i)).toBeInTheDocument();
    });

    it('should persist active tab when re-rendering', async () => {
      const user = userEvent.setup();
      vi.mocked(dealsApi.getDeal).mockResolvedValue(mockDeal);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });

      const { rerender } = renderDealDetails();

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /financials/i })).toBeInTheDocument();
      });

      const financialsTab = screen.getByRole('tab', { name: /financials/i });
      await user.click(financialsTab);

      await waitFor(() => {
        expect(financialsTab).toHaveAttribute('aria-selected', 'true');
      });

      // Re-render
      rerender(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[`/deals/deal-123`]}>
            <Routes>
              <Route path="/deals/:dealId" element={<DealDetails />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );

      // Tab should still be selected
      expect(screen.getByRole('tab', { name: /financials/i })).toHaveAttribute('aria-selected', 'true');
    });
  });
});
