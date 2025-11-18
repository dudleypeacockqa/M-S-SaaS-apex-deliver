/**
 * TDD Tests for VoiceCampaign Component
 * 
 * Tests for voice campaign UI following TDD principles.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import VoiceCampaign from '../VoiceCampaign'

// Mock the API client
vi.mock('@/services/api/voice', () => ({
  createVoiceAgent: vi.fn(),
  listVoiceAgents: vi.fn(),
  makeVoiceCall: vi.fn(),
  getVoiceCallStatus: vi.fn(),
}))

describe('VoiceCampaign', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <VoiceCampaign />
        </BrowserRouter>
      </QueryClientProvider>
    )
  }

  it('renders existing voice agents', async () => {
    const { listVoiceAgents } = await import('@/services/api/voice')
    vi.mocked(listVoiceAgents).mockResolvedValue([
      {
        id: 'agent-123',
        name: 'Sales Agent',
        voice: 'alloy',
        instructions: 'Sell stuff',
        status: 'active',
        personality: 'friendly',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Sales Agent')).toBeInTheDocument()
      expect(screen.getByText(/Voice: alloy/)).toBeInTheDocument()
    })
  })

  it('creates a voice agent', async () => {
    const { listVoiceAgents, createVoiceAgent } = await import('@/services/api/voice')
    vi.mocked(listVoiceAgents).mockResolvedValue([])
    vi.mocked(createVoiceAgent).mockResolvedValue({
      id: 'agent-999',
      name: 'Demo Agent',
      voice: 'alloy',
      instructions: 'Hello world',
      status: 'active',
      personality: 'professional',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    renderComponent()

    fireEvent.click(screen.getByRole('button', { name: /create agent/i }))
    fireEvent.change(screen.getByLabelText('Agent Name *'), { target: { value: 'Demo Agent' } })
    fireEvent.change(screen.getByLabelText('Instructions *'), { target: { value: 'Hello world' } })
    fireEvent.change(screen.getByLabelText('Personality'), { target: { value: 'professional' } })

    const submitButtons = screen.getAllByRole('button', { name: /create agent/i })
    fireEvent.click(submitButtons[submitButtons.length - 1])

    await waitFor(() => {
      expect(createVoiceAgent).toHaveBeenCalledWith({
        name: 'Demo Agent',
        voice: 'alloy',
        instructions: 'Hello world',
        personality: 'professional',
      })
    })
  })

  it('makes a voice call and displays status updates', async () => {
    const { listVoiceAgents, makeVoiceCall, getVoiceCallStatus } = await import('@/services/api/voice')
    vi.mocked(listVoiceAgents).mockResolvedValue([])
    vi.mocked(makeVoiceCall).mockResolvedValue({
      id: 321,
      organization_id: 'org',
      contact_id: 5,
      phone_number: '+15555555555',
      status: 'queued',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    vi.mocked(getVoiceCallStatus).mockResolvedValue({
      id: 321,
      organization_id: 'org',
      contact_id: 5,
      phone_number: '+15555555555',
      status: 'in_progress',
      duration: 42,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    renderComponent()

    fireEvent.click(screen.getByRole('button', { name: /make call/i }))
    fireEvent.change(screen.getByLabelText('Agent ID *'), { target: { value: 'agent-123' } })
    fireEvent.change(screen.getByLabelText('Phone Number *'), { target: { value: '+15555555555' } })
    fireEvent.change(screen.getByLabelText('Contact ID *'), { target: { value: '5' } })

    const submitButtons = screen.getAllByRole('button', { name: /make call/i })
    fireEvent.click(submitButtons[submitButtons.length - 1])

    await waitFor(() => {
      expect(makeVoiceCall).toHaveBeenCalledWith({
        agent_id: 'agent-123',
        phone_number: '+15555555555',
        contact_id: 5,
      })
    })

    await waitFor(() => {
      expect(getVoiceCallStatus).toHaveBeenCalledWith(321)
      expect(screen.getByText(/in_progress/i)).toBeInTheDocument()
    })
  })
})

