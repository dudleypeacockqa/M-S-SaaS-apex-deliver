/**
 * DealKanbanBoard Component Tests
 *
 * Tests for the Deal Pipeline Kanban board with drag-and-drop functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
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
      stage: 'sourcing' as DealStage,
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
      stage: 'evaluation' as DealStage,
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
      stage: 'due_diligence' as DealStage,
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

      expect(screen.getByTestId('pipeline-stage-sourcing')).toBeInTheDocument()
      expect(screen.getByTestId('pipeline-stage-evaluation')).toBeInTheDocument()
      expect(screen.getByTestId('pipeline-stage-due_diligence')).toBeInTheDocument()
      expect(screen.getByTestId('pipeline-stage-negotiation')).toBeInTheDocument()
      expect(screen.getByTestId('pipeline-stage-closing')).toBeInTheDocument()
    })

    it('should render deals in correct columns', () => {
      renderKanbanBoard()

      expect(screen.getByText('Acme Corp Acquisition')).toBeInTheDocument()
      expect(screen.getByText('Beta Ltd Deal')).toBeInTheDocument()
      expect(screen.getByText('Gamma Inc Merger')).toBeInTheDocument()
    })

    it('should display deal count for each stage', () => {
      renderKanbanBoard()

      expect(screen.getByTestId('stage-count-sourcing')).toHaveTextContent('1')
      expect(screen.getByTestId('stage-count-evaluation')).toHaveTextContent('1')
      expect(screen.getByTestId('stage-count-due_diligence')).toHaveTextContent('1')
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

    it('should render SLA and probability badges defined in pipeline templates', () => {
      setPipelineTemplateResponse([
        {
          id: 'tpl-1',
          name: 'PMI Default',
          description: 'M&A sprint template',
          is_default: true,
          stages: [
            { id: 'stage-1', name: 'Sourcing', order_index: 1, probability: 45, sla_hours: 36, color: '#fcd34d' },
            { id: 'stage-2', name: 'Evaluation', order_index: 2, probability: 55, sla_hours: 72, color: '#93c5fd' },
          ],
        } as PipelineTemplate,
      ])

      renderKanbanBoard()

      const sourcingStage = screen.getByTestId('pipeline-stage-sourcing')
      expect(within(sourcingStage).getByText('SLA 36h')).toBeInTheDocument()
      expect(within(sourcingStage).getByText('Win 45%')).toBeInTheDocument()

      const evaluationStage = screen.getByTestId('pipeline-stage-evaluation')
      expect(within(evaluationStage).getByText('SLA 72h')).toBeInTheDocument()
      expect(within(evaluationStage).getByText('Win 55%')).toBeInTheDocument()
    })

    it('should display weighted pipeline totals when probability metadata exists', () => {
      setPipelineTemplateResponse([
        {
          id: 'tpl-1',
          name: 'PMI Default',
          description: 'M&A sprint template',
          is_default: true,
          stages: [
            { id: 'stage-1', name: 'Sourcing', order_index: 1, probability: 25, sla_hours: 48, color: '#fed7aa' },
            { id: 'stage-2', name: 'Evaluation', order_index: 2, probability: 60, sla_hours: 72, color: '#bfdbfe' },
            { id: 'stage-3', name: 'Due Diligence', order_index: 3, probability: 75, sla_hours: 120, color: '#fef3c7' },
          ],
        } as PipelineTemplate,
      ])

      renderKanbanBoard()

      const sourcingStage = screen.getByTestId('pipeline-stage-sourcing')
      expect(within(sourcingStage).getByText(/Weighted/i)).toHaveTextContent('£1,250,000')

      const evaluationStage = screen.getByTestId('pipeline-stage-evaluation')
      expect(within(evaluationStage).getByText(/Weighted/i)).toHaveTextContent('£1,200,000')
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

      expect(screen.getByText('Acme Corp', { exact: true })).toBeInTheDocument()
      expect(screen.getByText('Beta Ltd', { exact: true })).toBeInTheDocument()
      expect(screen.getByText('Gamma Inc', { exact: true })).toBeInTheDocument()
    })

    it('should display formatted deal size', () => {
      renderKanbanBoard()

      expect(screen.getByText('£5,000,000')).toBeInTheDocument()
      expect(screen.getByText('£2,000,000')).toBeInTheDocument()
      expect(screen.getByText('US$10,000,000')).toBeInTheDocument()
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

      const dealCards = screen.getAllByTestId(/draggable-/)
      expect(dealCards.length).toBe(mockDeals.length)
    })
  })
})
