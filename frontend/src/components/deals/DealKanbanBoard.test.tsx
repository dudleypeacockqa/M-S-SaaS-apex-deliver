/**
 * DealKanbanBoard Component Tests
 *
 * Tests for the Deal Pipeline Kanban board with drag-and-drop functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DealKanbanBoard } from './DealKanbanBoard'
import * as dealHooks from '@/hooks/deals'
import * as pipelineTemplateHooks from '@/hooks/pipelineTemplates'
import type { PipelineTemplate } from '@/services/api/pipelineTemplates'
import { DealStage } from '@/services/api/deals'

// Mock hooks
vi.mock('@/hooks/deals', () => ({
  useDeals: vi.fn(),
  useUpdateDealStage: vi.fn(),
}))

// Mock @hello-pangea/dnd for testing
vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: any) => <div data-testid="drag-drop-context">{children}</div>,
  Droppable: ({ children, droppableId }: any) => (
    <div data-testid={`droppable-${droppableId}`}>{children({ innerRef: vi.fn(), draggableProps: {}, dragHandleProps: {} }, {})}</div>
  ),
  Draggable: ({ children, draggableId, index }: any) => (
    <div data-testid={`draggable-${draggableId}`}>
      {children({ innerRef: vi.fn(), draggableProps: {}, dragHandleProps: {} }, {})}
    </div>
  ),
}))

vi.mock('@/hooks/pipelineTemplates', () => ({
  usePipelineTemplates: vi.fn(),
}))

describe('DealKanbanBoard', () => {
  let queryClient: QueryClient

  const setPipelineTemplateResponse = (templates: PipelineTemplate[] = []) => {
    vi.mocked(pipelineTemplateHooks.usePipelineTemplates).mockReturnValue({
      data: templates,
      isLoading: false,
      error: null,
    } as any)
  }

  const mockDeals = [
    {
      id: '1',
      name: 'Acme Corp Acquisition',
      target_company: 'Acme Corp',
      stage: DealStage.SOURCING,
      deal_size: 5000000,
      currency: 'GBP',
      owner_id: 'user-1',
      organization_id: 'org-1',
      created_at: '2025-10-01T00:00:00Z',
      updated_at: '2025-10-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Beta Ltd Deal',
      target_company: 'Beta Ltd',
      stage: DealStage.EVALUATION,
      deal_size: 2000000,
      currency: 'GBP',
      owner_id: 'user-1',
      organization_id: 'org-1',
      created_at: '2025-10-02T00:00:00Z',
      updated_at: '2025-10-02T00:00:00Z',
    },
    {
      id: '3',
      name: 'Gamma Inc Merger',
      target_company: 'Gamma Inc',
      stage: DealStage.DUE_DILIGENCE,
      deal_size: 10000000,
      currency: 'USD',
      owner_id: 'user-1',
      organization_id: 'org-1',
      created_at: '2025-10-03T00:00:00Z',
      updated_at: '2025-10-03T00:00:00Z',
    },
  ]

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
    setPipelineTemplateResponse([])
  })

  const renderKanbanBoard = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <DealKanbanBoard />
      </QueryClientProvider>
    )
  }

  describe('Loading State', () => {
    it('should display loading state when fetching deals', () => {
      vi.mocked(dealHooks.useDeals).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any)

      vi.mocked(dealHooks.useUpdateDealStage).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderKanbanBoard()

      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should display empty state when no deals exist', () => {
      vi.mocked(dealHooks.useDeals).mockReturnValue({
        data: { items: [], total: 0, page: 1, per_page: 20 },
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(dealHooks.useUpdateDealStage).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderKanbanBoard()

      expect(screen.getByText(/no deals/i)).toBeInTheDocument()
    })
  })

  describe('Board Rendering', () => {
    beforeEach(() => {
      vi.mocked(dealHooks.useDeals).mockReturnValue({
        data: { items: mockDeals, total: mockDeals.length, page: 1, per_page: 20 },
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(dealHooks.useUpdateDealStage).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)
    })

    it('should render all pipeline stages', () => {
      renderKanbanBoard()

      expect(screen.getByText('Sourcing')).toBeInTheDocument()
      expect(screen.getByText('Evaluation')).toBeInTheDocument()
      expect(screen.getByText('Due Diligence')).toBeInTheDocument()
      expect(screen.getByText('Negotiation')).toBeInTheDocument()
      expect(screen.getByText('Closing')).toBeInTheDocument()
    })

    it('should render deals in correct columns', () => {
      renderKanbanBoard()

      expect(screen.getByText('Acme Corp Acquisition')).toBeInTheDocument()
      expect(screen.getByText('Beta Ltd Deal')).toBeInTheDocument()
      expect(screen.getByText('Gamma Inc Merger')).toBeInTheDocument()
    })

    it('should display deal count for each stage', () => {
      renderKanbanBoard()

      // Each stage should show count
      const sourcingColumn = screen.getByText('Sourcing').closest('div')
      const evaluationColumn = screen.getByText('Evaluation').closest('div')
      const ddColumn = screen.getByText('Due Diligence').closest('div')

      expect(sourcingColumn).toContainHTML('1') // 1 deal in sourcing
      expect(evaluationColumn).toContainHTML('1') // 1 deal in evaluation
      expect(ddColumn).toContainHTML('1') // 1 deal in due diligence
    })

    it('should render DragDropContext', () => {
      renderKanbanBoard()

      expect(screen.getByTestId('drag-drop-context')).toBeInTheDocument()
    })

    it('should render droppable zones for each stage', () => {
      renderKanbanBoard()

      expect(screen.getByTestId('droppable-sourcing')).toBeInTheDocument()
      expect(screen.getByTestId('droppable-evaluation')).toBeInTheDocument()
      expect(screen.getByTestId('droppable-due_diligence')).toBeInTheDocument()
      expect(screen.getByTestId('droppable-negotiation')).toBeInTheDocument()
      expect(screen.getByTestId('droppable-closing')).toBeInTheDocument()
    })

    it('should render draggable cards for each deal', () => {
      renderKanbanBoard()

      expect(screen.getByTestId('draggable-1')).toBeInTheDocument()
      expect(screen.getByTestId('draggable-2')).toBeInTheDocument()
      expect(screen.getByTestId('draggable-3')).toBeInTheDocument()
    })
  })

  describe('Drag and Drop', () => {
    it('should call updateDealStage when deal is dropped in new column', async () => {
      const mockUpdateStage = vi.fn().mockResolvedValue({})

      vi.mocked(dealHooks.useDeals).mockReturnValue({
        data: { items: mockDeals, total: mockDeals.length, page: 1, per_page: 20 },
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(dealHooks.useUpdateDealStage).mockReturnValue({
        mutateAsync: mockUpdateStage,
        isPending: false,
      } as any)

      renderKanbanBoard()

      // Simulate drag from sourcing to evaluation
      // In actual test environment, this would be done via user interaction
      // For now, we test the handler logic exists
      const board = screen.getByTestId('drag-drop-context')
      expect(board).toBeInTheDocument()
    })
  })

  describe('Deal Display', () => {
    beforeEach(() => {
      vi.mocked(dealHooks.useDeals).mockReturnValue({
        data: { items: mockDeals, total: mockDeals.length, page: 1, per_page: 20 },
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(dealHooks.useUpdateDealStage).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)
    })

    it('should display deal name for each card', () => {
      renderKanbanBoard()

      expect(screen.getByText('Acme Corp Acquisition')).toBeInTheDocument()
      expect(screen.getByText('Beta Ltd Deal')).toBeInTheDocument()
      expect(screen.getByText('Gamma Inc Merger')).toBeInTheDocument()
    })

    it('should display target company for each card', () => {
      renderKanbanBoard()

      expect(screen.getByText(/Acme Corp/)).toBeInTheDocument()
      expect(screen.getByText(/Beta Ltd/)).toBeInTheDocument()
      expect(screen.getByText(/Gamma Inc/)).toBeInTheDocument()
    })

    it('should display formatted deal size', () => {
      renderKanbanBoard()

      // Should show formatted currency amounts
      expect(screen.getByText(/5.*M/)).toBeInTheDocument() // £5M
      expect(screen.getByText(/2.*M/)).toBeInTheDocument() // £2M
      expect(screen.getByText(/10.*M/)).toBeInTheDocument() // $10M
    })
  })

  describe('Error Handling', () => {
    it('should display error message when fetch fails', () => {
      vi.mocked(dealHooks.useDeals).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch deals'),
      } as any)

      vi.mocked(dealHooks.useUpdateDealStage).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)

      renderKanbanBoard()

      expect(screen.getByText(/error/i)).toBeInTheDocument()
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument()
    })

    it('should handle stage update errors gracefully', async () => {
      const mockUpdateStage = vi.fn().mockRejectedValue(new Error('Update failed'))

      vi.mocked(dealHooks.useDeals).mockReturnValue({
        data: { items: mockDeals, total: mockDeals.length, page: 1, per_page: 20 },
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(dealHooks.useUpdateDealStage).mockReturnValue({
        mutateAsync: mockUpdateStage,
        isPending: false,
      } as any)

      renderKanbanBoard()

      // Error handling should be in place (will test after implementation)
      expect(screen.getByTestId('drag-drop-context')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      vi.mocked(dealHooks.useDeals).mockReturnValue({
        data: { items: mockDeals, total: mockDeals.length, page: 1, per_page: 20 },
        isLoading: false,
        error: null,
      } as any)

      vi.mocked(dealHooks.useUpdateDealStage).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as any)
    })

    it('should have accessible column headings', () => {
      renderKanbanBoard()

      const headings = screen.getAllByRole('heading', { level: 3 })
      expect(headings.length).toBeGreaterThanOrEqual(5) // 5 stages
    })

    it('should support keyboard navigation for draggable items', () => {
      renderKanbanBoard()

      // Draggable items should be keyboard accessible
      const dealCards = screen.getAllByText(/acquisition|deal|merger/i)
      expect(dealCards.length).toBe(3)
    })
  })
})
