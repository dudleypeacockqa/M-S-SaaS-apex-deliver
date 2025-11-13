/**
 * Event Details Tests
 * TDD: RED → GREEN → REFACTOR
 * Feature: F-012 Event Management Hub
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { EventDetails } from '../EventDetails'
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

const mockEvent = {
  id: 'event-123',
  name: 'M&A Summit 2025',
  description: 'Annual M&A summit',
  event_type: 'in_person' as const,
  status: 'published' as const,
  start_date: '2025-12-01T09:00:00Z',
  end_date: '2025-12-01T17:00:00Z',
  location: 'London, UK',
  capacity: 500,
  base_price: 100,
  currency: 'GBP',
  organization_id: 'org-1',
  created_by_user_id: 'user-1',
  created_at: '2025-11-01T00:00:00Z',
}

const renderWithProviders = (eventId: string = 'event-123') => {
  const queryClient = createTestQueryClient()
  return render(
    <MemoryRouter initialEntries={[`/events/${eventId}`]}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/events/:eventId/edit" element={<div>Edit Event</div>} />
          <Route path="/events" element={<div>Events List</div>} />
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>
  )
}

describe('EventDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render event details', async () => {
    vi.mocked(eventsApi.getEvent).mockResolvedValue(mockEvent)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('M&A Summit 2025')).toBeInTheDocument()
    })

    expect(screen.getByText('Annual M&A summit')).toBeInTheDocument()
    expect(eventsApi.getEvent).toHaveBeenCalledWith('event-123')
  })

  it('should display loading state initially', () => {
    vi.mocked(eventsApi.getEvent).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    renderWithProviders()

    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('should display error when event not found', async () => {
    vi.mocked(eventsApi.getEvent).mockResolvedValue(null as any)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Event Not Found')).toBeInTheDocument()
    })
  })

  it('should render all tabs', async () => {
    vi.mocked(eventsApi.getEvent).mockResolvedValue(mockEvent)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('M&A Summit 2025')).toBeInTheDocument()
    })

    // Check all tabs are present
    expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sessions/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tickets/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrations/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /analytics/i })).toBeInTheDocument()
  })

  it('should display event information in overview tab', async () => {
    vi.mocked(eventsApi.getEvent).mockResolvedValue(mockEvent)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('M&A Summit 2025')).toBeInTheDocument()
    })

    // Check event information is displayed
    expect(screen.getByText(/in person/i)).toBeInTheDocument()
    expect(screen.getByText(/published/i)).toBeInTheDocument()
    expect(screen.getByText('London, UK')).toBeInTheDocument()
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByText(/GBP 100.00/i)).toBeInTheDocument()
  })

  it('should load and display sessions when sessions tab clicked', async () => {
    const user = userEvent.setup()
    const mockSessions = [
      {
        id: 'session-1',
        event_id: 'event-123',
        name: 'Opening Keynote',
        description: 'Welcome address',
        start_time: '2025-12-01T09:00:00Z',
        end_time: '2025-12-01T10:00:00Z',
        speaker_name: 'John Doe',
        organization_id: 'org-1',
        created_by_user_id: 'user-1',
        created_at: '2025-11-01T00:00:00Z',
      },
    ]

    vi.mocked(eventsApi.getEvent).mockResolvedValue(mockEvent)
    vi.mocked(eventsApi.listEventSessions).mockResolvedValue(mockSessions)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('M&A Summit 2025')).toBeInTheDocument()
    })

    // Click sessions tab
    const sessionsTab = screen.getByRole('button', { name: /sessions/i })
    await user.click(sessionsTab)

    await waitFor(() => {
      expect(eventsApi.listEventSessions).toHaveBeenCalledWith('event-123')
    })

    await waitFor(() => {
      expect(screen.getByText('Opening Keynote')).toBeInTheDocument()
    })
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should load and display tickets when tickets tab clicked', async () => {
    const user = userEvent.setup()
    const mockTickets = [
      {
        id: 'ticket-1',
        event_id: 'event-123',
        name: 'Early Bird',
        description: 'Early bird pricing',
        price: 50,
        currency: 'GBP',
        quantity: 100,
        available_quantity: 80,
        status: 'active' as const,
        organization_id: 'org-1',
        created_by_user_id: 'user-1',
        created_at: '2025-11-01T00:00:00Z',
      },
    ]

    vi.mocked(eventsApi.getEvent).mockResolvedValue(mockEvent)
    vi.mocked(eventsApi.listEventTickets).mockResolvedValue(mockTickets)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('M&A Summit 2025')).toBeInTheDocument()
    })

    // Click tickets tab
    const ticketsTab = screen.getByRole('button', { name: /tickets/i })
    await user.click(ticketsTab)

    await waitFor(() => {
      expect(eventsApi.listEventTickets).toHaveBeenCalledWith('event-123')
    })

    await waitFor(() => {
      expect(screen.getByText('Early Bird')).toBeInTheDocument()
    })
  })

  it('should load and display registrations when registrations tab clicked', async () => {
    const user = userEvent.setup()
    const mockRegistrations = [
      {
        id: 'reg-1',
        event_id: 'event-123',
        attendee_name: 'Alice Smith',
        attendee_email: 'alice@example.com',
        status: 'confirmed' as const,
        payment_status: 'paid',
        payment_amount: 100,
        currency: 'GBP',
        checked_in: false,
        registered_at: '2025-11-15T10:00:00Z',
        organization_id: 'org-1',
        created_at: '2025-11-15T10:00:00Z',
      },
    ]

    vi.mocked(eventsApi.getEvent).mockResolvedValue(mockEvent)
    vi.mocked(eventsApi.listEventRegistrations).mockResolvedValue(mockRegistrations)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('M&A Summit 2025')).toBeInTheDocument()
    })

    // Click registrations tab
    const registrationsTab = screen.getByRole('button', { name: /registrations/i })
    await user.click(registrationsTab)

    await waitFor(() => {
      expect(eventsApi.listEventRegistrations).toHaveBeenCalledWith('event-123')
    })

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    })
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
  })

  it('should load and display analytics when analytics tab clicked', async () => {
    const user = userEvent.setup()
    const mockAnalytics = {
      id: 'analytics-1',
      event_id: 'event-123',
      total_registrations: 150,
      total_attendees: 120,
      total_revenue: 15000,
      currency: 'GBP',
      session_metrics: {},
      recorded_at: '2025-12-01T18:00:00Z',
      organization_id: 'org-1',
    }

    vi.mocked(eventsApi.getEvent).mockResolvedValue(mockEvent)
    vi.mocked(eventsApi.getEventAnalytics).mockResolvedValue(mockAnalytics)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('M&A Summit 2025')).toBeInTheDocument()
    })

    // Click analytics tab
    const analyticsTab = screen.getByRole('button', { name: /analytics/i })
    await user.click(analyticsTab)

    await waitFor(() => {
      expect(eventsApi.getEventAnalytics).toHaveBeenCalledWith('event-123')
    })

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument() // Total registrations
    })
    expect(screen.getByText('120')).toBeInTheDocument() // Total attendees
    expect(screen.getByText(/15000.00/i)).toBeInTheDocument() // Total revenue
  })

  it('should have edit and delete buttons', async () => {
    vi.mocked(eventsApi.getEvent).mockResolvedValue(mockEvent)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('M&A Summit 2025')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /edit event/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete event/i })).toBeInTheDocument()
  })

  it('should navigate to edit page when edit button clicked', async () => {
    const user = userEvent.setup()
    vi.mocked(eventsApi.getEvent).mockResolvedValue(mockEvent)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('M&A Summit 2025')).toBeInTheDocument()
    })

    const editButton = screen.getByRole('button', { name: /edit event/i })
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByText('Edit Event')).toBeInTheDocument()
    })
  })

  it('should delete event when delete button clicked', async () => {
    const user = userEvent.setup()
    vi.mocked(eventsApi.getEvent).mockResolvedValue(mockEvent)
    vi.mocked(eventsApi.deleteEvent).mockResolvedValue(undefined)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('M&A Summit 2025')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: /delete event/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(eventsApi.deleteEvent).toHaveBeenCalledWith('event-123')
    })

    // Should navigate back to events list after delete
    await waitFor(() => {
      expect(screen.getByText('Events List')).toBeInTheDocument()
    })
  })

  it('should have export CSV button on registrations tab', async () => {
    const user = userEvent.setup()
    const mockRegistrations: any[] = []

    vi.mocked(eventsApi.getEvent).mockResolvedValue(mockEvent)
    vi.mocked(eventsApi.listEventRegistrations).mockResolvedValue(mockRegistrations)

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('M&A Summit 2025')).toBeInTheDocument()
    })

    // Click registrations tab
    const registrationsTab = screen.getByRole('button', { name: /registrations/i })
    await user.click(registrationsTab)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument()
    })
  })

  it('should export registrations when export button clicked', async () => {
    const user = userEvent.setup()
    const mockBlob = new Blob(['csv data'], { type: 'text/csv' })

    vi.mocked(eventsApi.getEvent).mockResolvedValue(mockEvent)
    vi.mocked(eventsApi.listEventRegistrations).mockResolvedValue([])
    vi.mocked(eventsApi.exportEventRegistrations).mockResolvedValue(mockBlob)

    // Mock URL methods
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('M&A Summit 2025')).toBeInTheDocument()
    })

    // Click registrations tab
    const registrationsTab = screen.getByRole('button', { name: /registrations/i })
    await user.click(registrationsTab)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument()
    })

    // Click export button
    const exportButton = screen.getByRole('button', { name: /export csv/i })
    await user.click(exportButton)

    await waitFor(() => {
      expect(eventsApi.exportEventRegistrations).toHaveBeenCalledWith('event-123')
    })

    // Cleanup
    createObjectURLSpy.mockRestore()
    revokeObjectURLSpy.mockRestore()
  })

  it('should show empty states for no sessions, tickets, registrations', async () => {
    const user = userEvent.setup()

    vi.mocked(eventsApi.getEvent).mockResolvedValue(mockEvent)
    vi.mocked(eventsApi.listEventSessions).mockResolvedValue([])
    vi.mocked(eventsApi.listEventTickets).mockResolvedValue([])
    vi.mocked(eventsApi.listEventRegistrations).mockResolvedValue([])

    const { container } = renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('M&A Summit 2025')).toBeInTheDocument()
    })

    // Check sessions empty state
    const sessionsTab = screen.getByRole('button', { name: /sessions/i })
    await user.click(sessionsTab)

    await waitFor(() => {
      expect(container.textContent).toMatch(/no sessions found/i)
    })

    // Check tickets empty state
    const ticketsTab = screen.getByRole('button', { name: /tickets/i })
    await user.click(ticketsTab)

    await waitFor(() => {
      expect(container.textContent).toMatch(/no tickets found/i)
    })

    // Check registrations empty state
    const registrationsTab = screen.getByRole('button', { name: /registrations/i })
    await user.click(registrationsTab)

    await waitFor(() => {
      expect(container.textContent).toMatch(/no registrations found/i)
    })
  })
})
