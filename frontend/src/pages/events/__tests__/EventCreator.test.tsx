/**
 * Event Creator Tests
 * TDD: RED → GREEN → REFACTOR
 * Feature: F-012 Event Management Hub
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { EventCreator } from '../EventCreator'
import * as eventsApi from '../../../services/api/events'

// Mock Clerk
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({
    user: {
      id: 'user-1',
      organizationId: 'org-1',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
    },
  }),
}))

// Mock the events API
vi.mock('../../../services/api/events')

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <MemoryRouter initialEntries={['/events/create']}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/events/create" element={component} />
          <Route path="/events/:eventId" element={<div>Event Details</div>} />
          <Route path="/events" element={<div>Events List</div>} />
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>
  )
}

describe('EventCreator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render event creation form', () => {
    renderWithProviders(<EventCreator />)

    expect(screen.getAllByText('Create Event').length).toBeGreaterThan(0)
    expect(screen.getByRole('textbox', { name: /event name/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /event type/i })).toBeInTheDocument()
  })

  it('should display all form sections', () => {
    renderWithProviders(<EventCreator />)

    expect(screen.getByText('Basic Information')).toBeInTheDocument()
    expect(screen.getByText('Dates')).toBeInTheDocument()
    expect(screen.getByText('Location')).toBeInTheDocument()
    expect(screen.getByText('Capacity & Pricing')).toBeInTheDocument()
  })

  it('should show virtual link field when event type is virtual', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EventCreator />)

    const eventTypeSelect = screen.getByRole('combobox', { name: /event type/i })
    await user.selectOptions(eventTypeSelect, 'virtual')

    expect(screen.getByRole('textbox', { name: /virtual link/i })).toBeInTheDocument()
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    const mockCreatedEvent = {
      id: 'event-123',
      name: 'Test Event',
      description: 'Test Description',
      event_type: 'virtual' as const,
      status: 'draft' as const,
      start_date: '2025-12-01T09:00:00Z',
      end_date: '2025-12-01T17:00:00Z',
      base_price: 50,
      currency: 'GBP',
      organization_id: 'org-1',
      created_by_user_id: 'user-1',
      created_at: '2025-11-01T00:00:00Z',
    }

    vi.mocked(eventsApi.createEvent).mockResolvedValue(mockCreatedEvent)

    renderWithProviders(<EventCreator />)

    // Fill in form fields
    await user.type(screen.getByRole('textbox', { name: /event name/i }), 'Test Event')
    await user.type(screen.getByRole('textbox', { name: /description/i }), 'Test Description')

    const startDateInput = screen.getAllByRole('textbox').find(el =>
      el.getAttribute('type') === 'datetime-local' || el.closest('label')?.textContent?.match(/start date/i)
    ) || screen.getAllByLabelText(/start date/i)[0] as HTMLInputElement
    await user.clear(startDateInput)
    await user.type(startDateInput, '2025-12-01T09:00')

    const endDateInput = screen.getAllByRole('textbox').find(el =>
      el.getAttribute('type') === 'datetime-local' && el !== startDateInput
    ) || screen.getAllByLabelText(/end date/i)[0] as HTMLInputElement
    await user.clear(endDateInput)
    await user.type(endDateInput, '2025-12-01T17:00')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create event/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(eventsApi.createEvent).toHaveBeenCalled()
    })
  })

  it('should validate required fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EventCreator />)

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /create event/i })
    await user.click(submitButton)

    // Should show alert (validation in component uses alert())
    // In a real implementation, this would be replaced with proper form validation UI
    expect(eventsApi.createEvent).not.toHaveBeenCalled()
  })

  it('should navigate back to events list on cancel', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EventCreator />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    await waitFor(() => {
      expect(screen.getByText('Events List')).toBeInTheDocument()
    })
  })

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup()
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.mocked(eventsApi.createEvent).mockRejectedValue(
      new Error('Failed to create event')
    )

    renderWithProviders(<EventCreator />)

    // Fill in minimum required fields
    await user.type(screen.getByRole('textbox', { name: /event name/i }), 'Test Event')

    const allInputs = screen.getAllByRole('textbox')
    const dateInputs = allInputs.filter(el =>
      el.getAttribute('type') === 'datetime-local'
    )
    const startDateInput = dateInputs[0] as HTMLInputElement
    const endDateInput = dateInputs[1] as HTMLInputElement

    await user.clear(startDateInput)
    await user.type(startDateInput, '2025-12-01T09:00')
    await user.clear(endDateInput)
    await user.type(endDateInput, '2025-12-01T17:00')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create event/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(eventsApi.createEvent).toHaveBeenCalled()
    })

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/unable to create event/i)

    consoleErrorSpy.mockRestore()
  })

  it('should support different event types', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EventCreator />)

    const eventTypeSelect = screen.getByRole('combobox', { name: /event type/i })

    // Check all event type options are available
    expect(screen.getByRole('option', { name: /virtual/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /in person/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /hybrid/i })).toBeInTheDocument()

    // Select in-person
    await user.selectOptions(eventTypeSelect, 'in_person')
    expect((eventTypeSelect as HTMLSelectElement).value).toBe('in_person')

    // Select hybrid
    await user.selectOptions(eventTypeSelect, 'hybrid')
    expect((eventTypeSelect as HTMLSelectElement).value).toBe('hybrid')
  })

  it('should allow setting capacity and pricing', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EventCreator />)

    const allNumberInputs = screen.getAllByRole('spinbutton')
    const capacityInput = allNumberInputs.find(el =>
      el.closest('label')?.textContent?.match(/capacity/i) ||
      (el as HTMLInputElement).placeholder?.match(/unlimited/i)
    ) || allNumberInputs[0]

    const priceInput = allNumberInputs.find(el =>
      el.closest('label')?.textContent?.match(/price/i) ||
      (el as HTMLInputElement).step === '0.01'
    ) || allNumberInputs[1]

    await user.clear(capacityInput)
    await user.type(capacityInput, '100')
    expect((capacityInput as HTMLInputElement).value).toBe('100')

    await user.clear(priceInput)
    await user.type(priceInput, '50')
    expect((priceInput as HTMLInputElement).value).toBe('50')
  })

  it('should support different currencies', async () => {
    const user = userEvent.setup()
    renderWithProviders(<EventCreator />)

    const currencySelect = screen.getAllByRole('combobox').find(
      (el) => (el as HTMLSelectElement).name === 'currency' ||
              (el as HTMLElement).closest('[class*="currency"]')
    ) || screen.getAllByRole('combobox').pop() // Last select is likely currency

    if (currencySelect) {
      expect(screen.getByRole('option', { name: /GBP/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /USD/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /EUR/i })).toBeInTheDocument()
    }
  })

  it('should disable submit button while submitting', async () => {
    const user = userEvent.setup()

    // Mock API to delay response
    vi.mocked(eventsApi.createEvent).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    renderWithProviders(<EventCreator />)

    // Fill minimum fields
    await user.type(screen.getByRole('textbox', { name: /event name/i }), 'Test Event')

    const allInputs = screen.getAllByRole('textbox')
    const dateInputs = allInputs.filter(el =>
      el.getAttribute('type') === 'datetime-local'
    )
    const startDateInput = dateInputs[0] as HTMLInputElement
    const endDateInput = dateInputs[1] as HTMLInputElement

    await user.clear(startDateInput)
    await user.type(startDateInput, '2025-12-01T09:00')
    await user.clear(endDateInput)
    await user.type(endDateInput, '2025-12-01T17:00')

    const submitButton = screen.getByRole('button', { name: /create event/i })
    await user.click(submitButton)

    // Button should be disabled while submitting
    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })
})
