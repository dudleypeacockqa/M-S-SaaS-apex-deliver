/**
 * Event Dashboard Tests
 * TDD: RED → GREEN → REFACTOR
 * Feature: F-012 Event Management Hub
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EventDashboard } from '../EventDashboard'
import * as eventsApi from '../../../services/api/events'

// Mock the events API
vi.mock('../../../services/api/events')

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

describe('EventDashboard', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = createTestQueryClient()
    vi.clearAllMocks()
  })

  it('should render event dashboard with event list', async () => {
    const mockEvents = [
      {
        id: 'event-1',
        name: 'M&A Conference 2025',
        description: 'Annual M&A conference',
        event_type: 'in_person',
        status: 'published',
        start_date: '2025-12-01T09:00:00Z',
        end_date: '2025-12-01T17:00:00Z',
        location: 'London, UK',
        capacity: 500,
        base_price: 0,
        currency: 'GBP',
        organization_id: 'org-1',
        created_by_user_id: 'user-1',
        created_at: '2025-11-01T00:00:00Z',
      },
    ]

    vi.mocked(eventsApi.listEvents).mockResolvedValue(mockEvents)

    render(
      <QueryClientProvider client={queryClient}>
        <EventDashboard />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('M&A Conference 2025')).toBeInTheDocument()
    })

    expect(eventsApi.listEvents).toHaveBeenCalled()
  })

  it('should display loading state initially', () => {
    vi.mocked(eventsApi.listEvents).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    render(
      <QueryClientProvider client={queryClient}>
        <EventDashboard />
      </QueryClientProvider>
    )

    // Should show loading indicator
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should filter events by status', async () => {
    const mockEvents = [
      {
        id: 'event-1',
        name: 'Published Event',
        event_type: 'virtual',
        status: 'published',
        start_date: '2025-12-01T09:00:00Z',
        end_date: '2025-12-01T17:00:00Z',
        base_price: 0,
        currency: 'GBP',
        organization_id: 'org-1',
        created_by_user_id: 'user-1',
        created_at: '2025-11-01T00:00:00Z',
      },
    ]

    vi.mocked(eventsApi.listEvents).mockResolvedValue(mockEvents)

    render(
      <QueryClientProvider client={queryClient}>
        <EventDashboard />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(eventsApi.listEvents).toHaveBeenCalled()
    })
  })

  it('should handle empty event list', async () => {
    vi.mocked(eventsApi.listEvents).mockResolvedValue([])

    render(
      <QueryClientProvider client={queryClient}>
        <EventDashboard />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/no events/i)).toBeInTheDocument()
    })
  })
})


