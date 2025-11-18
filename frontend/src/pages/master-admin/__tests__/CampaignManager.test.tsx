/**
 * TDD Tests for CampaignManager Component
 * 
 * Tests for campaign management UI following TDD principles.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import CampaignManager from '../CampaignManager'

// Mock the API client
vi.mock('@/services/api/campaigns', () => ({
  listCampaigns: vi.fn(),
  createCampaign: vi.fn(),
  updateCampaign: vi.fn(),
  deleteCampaign: vi.fn(),
  scheduleCampaign: vi.fn(),
  executeCampaign: vi.fn(),
  getCampaignAnalytics: vi.fn(),
}))

describe('CampaignManager', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CampaignManager />
        </BrowserRouter>
      </QueryClientProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders campaigns returned from the API', async () => {
    const { listCampaigns } = await import('@/services/api/campaigns')
    vi.mocked(listCampaigns).mockResolvedValue({
      items: [
        {
          id: 1,
          user_id: 'user-1',
          name: 'Test Campaign',
          type: 'email',
          status: 'draft',
          total_recipients: 42,
          sent_count: 10,
          opened_count: 5,
          clicked_count: 1,
          subject: 'Subject',
          content: 'Body',
          template_id: undefined,
          settings: {},
          scheduled_at: undefined,
          started_at: undefined,
          sent_at: undefined,
          completed_at: undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      total: 1,
      page: 1,
      per_page: 12,
    })

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Test Campaign')).toBeInTheDocument()
    })
  })

  it('allows creating a campaign through the modal form', async () => {
    const { listCampaigns, createCampaign } = await import('@/services/api/campaigns')
    vi.mocked(listCampaigns).mockResolvedValue({ items: [], total: 0, page: 1, per_page: 12 })
    vi.mocked(createCampaign).mockResolvedValue({
      id: 99,
      user_id: 'user-99',
      name: 'My Campaign',
      type: 'email',
      status: 'draft',
      content: 'Hello world',
      subject: 'Subject line',
      template_id: undefined,
      settings: {},
      total_recipients: 0,
      sent_count: 0,
      opened_count: 0,
      clicked_count: 0,
      scheduled_at: undefined,
      started_at: undefined,
      sent_at: undefined,
      completed_at: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    renderComponent()

    fireEvent.click(screen.getByRole('button', { name: /create campaign/i }))

    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'My Campaign' } })
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Subject line' } })
    fireEvent.change(screen.getByLabelText('Content *'), { target: { value: 'Hello world' } })

    const submitButtons = screen.getAllByRole('button', { name: /create campaign/i })
    fireEvent.click(submitButtons[submitButtons.length - 1])

    await waitFor(() => {
      expect(createCampaign).toHaveBeenCalledWith({
        name: 'My Campaign',
        type: 'email',
        subject: 'Subject line',
        content: 'Hello world',
      })
    })
  })

  it('shows analytics after selecting a campaign card', async () => {
    const { listCampaigns, getCampaignAnalytics } = await import('@/services/api/campaigns')
    vi.mocked(listCampaigns).mockResolvedValue({
      items: [
        {
          id: 7,
          user_id: 'user-2',
          name: 'Analytics Campaign',
          type: 'email',
          status: 'sent',
          total_recipients: 200,
          sent_count: 200,
          opened_count: 50,
          clicked_count: 25,
          subject: 'Subject',
          content: 'Body',
          template_id: undefined,
          settings: {},
          scheduled_at: undefined,
          started_at: undefined,
          sent_at: undefined,
          completed_at: undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      total: 1,
      page: 1,
      per_page: 12,
    })
    vi.mocked(getCampaignAnalytics).mockResolvedValue({
      total_recipients: 200,
      sent_count: 180,
      opened_count: 60,
      clicked_count: 30,
      open_rate: 0.333,
      click_rate: 0.166,
      click_to_open_rate: 0.5,
      total_activities: 90,
    })

    renderComponent()

    await waitFor(() => expect(screen.getByText('Analytics Campaign')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Analytics Campaign'))

    await waitFor(() => {
      expect(getCampaignAnalytics).toHaveBeenCalledWith(7)
      expect(screen.getByText('Campaign Analytics')).toBeInTheDocument()
      expect(screen.getByText(/60/)).toBeInTheDocument()
    })
  })
})

